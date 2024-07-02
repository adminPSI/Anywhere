var formsAjax = (function () {
    
  function openEditor(templateId, templateName, consumerId, stepId, docOrder) {
 
      $.ajax({
          type: 'POST',
          url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/openEditor/',
          data: '{"templateId":"' + templateId + '", "consumerId":"' + consumerId + '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (response, status, xhr) {
              var arr = response.openEditorResult;
          
              WebViewer({
                  path: './WebViewer/lib', // path to the PDFTron 'lib' folder on your server
                 // licenseKey: 'Marshall Information Services, LLC(primarysolutions.net):OEM:Advisor/Anywhere;Gatekeeper/Anywhere::B+:AMS(20220512):A8A5354D0437C60A7360B13AC9A2537860614FABB956CD3BD5343BC2C76C38C054C2BEF5C7',
                  licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20240512):99A5375D0437C60A0360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                  documentType: 'pdf',
                  // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                  // initialDoc: 'test.pdf',  // You can also use documents on your server
               }, document.getElementById('viewer'))
                  .then(instance => {
                      console.log('success with S3 file');
                      var FitMode = instance.UI.FitMode;
                      instance.UI.setFitMode(FitMode.FitWidth);
                  // hide the ribbons
                   instance.UI.disableElements(['ribbons']);
                  // instance.disableFeatures([instance.Feature.Download]);
                  // set the default toolbar group to the Shapes group
                    //  instance.setToolbarGroup(['toolbarGroup-Shapes']);
                      // call methods from instance, docViewer and annotManager as needed
      
                      const docViewer = instance.Core.documentViewer; 
                      const annotManager = instance.Core.annotationManager;
      
                      // -- Save PDF with Annotations -- https://www.pdftron.com/documentation/web/guides/get-file-data-with-viewer/
      
                      // Add header button that will get file data on click
                      instance.UI.setHeaderItems(header => {
                          header.push({
                            type: 'actionButton',
                            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path class="fill-path" d="M17.59 3.59c-.38-.38-.89-.59-1.42-.59H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7.83c0-.53-.21-1.04-.59-1.41l-2.82-2.83zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm1-10H7c-1.1 0-2-.9-2-2s.9-2 2-2h6c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>',
                            title: 'Save Current Data',
                              onClick: async () => {
                                 const doc = docViewer.getDocument();
                                 const xfdfString = await annotManager.exportAnnotations();
                                                       
                                 const data = await doc.getFileData({
                                      // saves the document with annotations in it
                                      xfdfString
                                  });          
                              
                                  let documentEdited = "1"; // documentEdited = T 
                      const result = await WorkflowViewerAjax.insertStepDocumentAsync(stepId, docOrder, templateName + '.pdf', 'pdf', data, documentEdited); 
                      const {insertWorkflowStepDocumentResult: {attachmentId, documentId}} = result;

                      const newDocObj = {
                        documentId: documentId,
                        stepId: stepId,
                        docOrder: `"${docOrder}"`,
                        description: templateName + '.pdf',
                        attachmentId: attachmentId,
                        documentEdited: documentEdited,
                                      attachmentType: 'pdf'
                          }
  
                      const newStepDocComponent = new WorkflowDocumentComponent(newDocObj).render();  

                                  alert('Document has been saved.');

                      POPUP.hide(formPopup);

                      const stepsContainer = document.querySelector(`.wf-steps-container[data-id='${stepId}']`);
                      const documentsList = stepsContainer.querySelector(".wf-documents-list");
     
                      documentsList.appendChild(newStepDocComponent);

                              }
                          });
                         
                          header.push({
                              type: 'actionButton',
                             // img: '../../../../images/new-icons/default.png',
                              img: 'icon-close',
                              title: 'Close Window',
                              onClick: async () => {

                                  let PDFForm = document.getElementById('formPopup');
                                  POPUP.hide(formPopup);

                              }
                          });
                      });
      
                      // -- Display PDF (from memorystream/string)   --  https://www.pdftron.com/documentation/web/guides/basics/open/base64/
      
                      const binaryString = window.atob(arr);
                      const len = binaryString.length;
                      const bytes = new Uint8Array(len);
      
                      for (let i = 0; i < len; ++i) {
                          bytes[i] = binaryString.charCodeAt(i);
                      }
      
                      // const arr = new Uint8Array(bytes);
                      const blob = new Blob([bytes], { type: 'application/pdf' });
                      instance.Core.documentViewer.loadDocument(blob, { filename: templateName + '.pdf'});
                      instance.UI.disableElements(['toolsHeader']);
                     // instance.disableElements(['toolbarGroup-Shapes']);
                    //  instance.disableElements(['toolbarGroup-Edit']);
                    //  instance.disableElements(['toolbarGroup-Insert']);
                      // you can also access major namespaces from the instance as follows:
                      const Tools = instance.Tools;
                      const Annotations = instance.Annotations;
                       
                      docViewer.addEventListener('documentLoaded', async () => {
                          //docViewer.setOptions({ enableAnnotations: false });
                         // docViewer.zoomTo(docViewer.getZoom() + 1.75);
                          // call methods relating to the loaded document
                      });
                  });

          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          },
      });
  }

  function openPDFEditor(documentId, documentEdited, consumerId, isRefresh) {
 
      $.ajax({
          type: 'POST',
          url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/openPDFEditor/',
          data: '{"documentId":"' + documentId + '", "documentEdited":"' + documentEdited + '", "consumerId":"' + consumerId + '", "isRefresh":"' + isRefresh + '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (response, status, xhr) {
              var arr = response.openPDFEditorResult;
          
              WebViewer({
                  path: './WebViewer/lib', // path to the PDFTron 'lib' folder on your server
                  // licenseKey: 'Marshall Information Services, LLC(primarysolutions.net):OEM:Advisor/Anywhere;Gatekeeper/Anywhere::B+:AMS(20220512):A8A5354D0437C60A7360B13AC9A2537860614FABB956CD3BD5343BC2C76C38C054C2BEF5C7',
                  licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20240512):99A5375D0437C60A0360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                  documentType: 'pdf',
                   // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                  // initialDoc: 'test.pdf',  // You can also use documents on your server
               }, document.getElementById('viewer'))
                  .then(instance => {
                      console.log('success with S3 file');
                      var FitMode = instance.UI.FitMode;
                      instance.UI.setFitMode(FitMode.FitWidth);
                  // hide the ribbons
                   instance.UI.disableElements(['ribbons']);
                 //  instance.disableFeatures([instance.Feature.Download]);
               
                      const docViewer = instance.Core.documentViewer;
                      const annotManager = instance.Core.annotationManager
                                    
                      instance.UI.setHeaderItems(header => {
                          header.push({
                            type: 'actionButton',
                            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path class="fill-path" d="M17.59 3.59c-.38-.38-.89-.59-1.42-.59H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7.83c0-.53-.21-1.04-.59-1.41l-2.82-2.83zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm1-10H7c-1.1 0-2-.9-2-2s.9-2 2-2h6c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>',
                            title: 'Save Current Data',
                              onClick: async () => {

                              try{
            
                                 const doc = docViewer.getDocument();
                                 const xfdfString = await annotManager.exportAnnotations();
                                                       
                                 const data = await doc.getFileData({
                                      // saves the document with annotations in it
                                      xfdfString
                                  });          
                              
                                  let documentEdited = "1"; // documentEdited = T 
                                  const result = await WorkflowViewerAjax.updateStepDocumentAsync(documentId, 'pdf', data, documentEdited); 
                                  const {updateWorkflowStepDocumentResult: {attachmentId, documntId}} = result;
          
                                  alert('Document has been saved.');

                                  POPUP.hide(formPopup);
                                  const updatedDocument = document.querySelector(`[data-document-id='${documentId}']`);
                                  updatedDocument.setAttribute("data-attachment-id", `${attachmentId}`);
                                  updatedDocument.setAttribute("data-document-edited", `${documentEdited}`);
                                  updatedDocument.setAttribute("data-attachment-type", 'pdf');
                                     
                              } catch {
                                      // 
                                      alert('This PDF document format does not allow saving. Document NOT saved.');
                                     // POPUP.hide(formPopup);

                              }


                              }
                          });
                          
                              header.push({
                                  type: 'actionButton',
                                 // img: '../../../../images/new-icons/default.png',
                                 img: 'icon-close',
                                  title: 'Close Window',
                                  onClick: async () => {
                                     // let PDFForm = document.getElementById('formPopup');
                                      POPUP.hide(formPopup);
  
                                  }
                              });  
                              
                              if (documentEdited == "1") {

                                  header.push({
                                      type: 'actionButton',
                                     // img: '../../../../images/new-icons/default.png',
                                     // img: 'icon-chevron-down',
                                     img: '<svg fill="#000000" height="22px" width="22px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M426.574,403.384c-0.04-0.445-0.11-0.88-0.177-1.317c-0.039-0.253-0.068-0.506-0.115-0.757 c-0.081-0.425-0.188-0.84-0.294-1.256c-0.066-0.261-0.125-0.524-0.201-0.783c-0.115-0.388-0.252-0.766-0.388-1.145 c-0.101-0.282-0.195-0.565-0.309-0.843c-0.14-0.344-0.3-0.677-0.458-1.012c-0.141-0.301-0.277-0.603-0.433-0.899 c-0.161-0.305-0.341-0.598-0.517-0.894c-0.181-0.306-0.357-0.615-0.555-0.914c-0.189-0.285-0.396-0.554-0.598-0.829 c-0.212-0.289-0.416-0.581-0.644-0.862c-0.229-0.282-0.479-0.545-0.722-0.815c-0.203-0.225-0.388-0.46-0.602-0.679 c-0.03-0.03-0.063-0.055-0.092-0.085c-0.216-0.218-0.451-0.415-0.677-0.623c-4.089-3.782-9.292-5.686-14.51-5.673h-85.276 c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h20.393c-26.343,13.774-55.128,21.323-84.4,21.323 c-106.042,0-192-85.958-192-192c0-29.414,6.613-57.859,19.169-83.716c5.146-10.599,0.727-23.363-9.872-28.509 c-10.599-5.146-23.363-0.727-28.509,9.872c-15.361,31.634-23.455,66.447-23.455,102.353 c0,129.606,105.061,234.667,234.667,234.667c45.644,0,89.851-14.62,128.006-40.418v40.429c0,11.782,9.551,21.333,21.333,21.333 c11.782,0,21.333-9.551,21.333-21.333v-85.333c0-0.405-0.038-0.8-0.061-1.199C426.598,403.884,426.596,403.634,426.574,403.384z"></path> <path d="M256.001,21.325c-45.622,0-89.833,14.627-127.996,40.422V21.333C128.005,9.551,118.454,0,106.672,0 C94.89,0,85.339,9.551,85.339,21.333v85.06c-0.001,0.047,0,0.094,0,0.141v0.132c0,0.134,0.018,0.264,0.02,0.398 c0.01,0.549,0.031,1.097,0.083,1.645c0.025,0.261,0.07,0.515,0.104,0.772c0.057,0.428,0.112,0.856,0.195,1.281 c0.06,0.308,0.14,0.608,0.213,0.912c0.089,0.369,0.174,0.737,0.283,1.101c0.095,0.319,0.209,0.628,0.319,0.94 c0.12,0.342,0.236,0.683,0.373,1.02c0.128,0.313,0.274,0.616,0.417,0.921c0.15,0.323,0.296,0.646,0.464,0.962 c0.165,0.312,0.348,0.611,0.528,0.913c0.173,0.292,0.34,0.585,0.529,0.87c0.221,0.334,0.461,0.651,0.7,0.972 c0.175,0.234,0.339,0.473,0.525,0.702c0.319,0.394,0.662,0.767,1.007,1.137c0.117,0.125,0.218,0.258,0.338,0.381 c0.017,0.017,0.036,0.032,0.053,0.049c0.461,0.467,0.944,0.91,1.446,1.333c0.039,0.033,0.076,0.072,0.115,0.105 c3.602,2.992,8.205,4.808,13.232,4.899c0.064,0.001,0.127,0.009,0.191,0.01c0.067,0.001,0.132,0.01,0.199,0.01h85.333 c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-20.416c26.355-13.784,55.149-21.342,84.412-21.342 c106.034,0,192,85.972,192,192c0,29.464-6.617,57.929-19.188,83.795c-5.15,10.597-0.734,23.362,9.863,28.512 c10.597,5.15,23.362,0.734,28.512-9.863c15.381-31.649,23.479-66.486,23.479-102.445C490.668,126.4,385.6,21.325,256.001,21.325z "></path> </g> </g> </g> </g></svg>',
                                      title: 'Refresh with original data',
                                      onClick: async () => {

                                          const doc = docViewer.getDocument();
                                          const xfdfString = await annotManager.exportAnnotations();
                                                       
                                          const data = await doc.getFileData({
                                              // saves the document with annotations in it
                                              xfdfString
                                              });   

                                          docViewer.closeDocument();
                                          // get the data for annotated version of the document 
                                          let isRefresh = true; 
                                          const result = await formsAjax.getPDFDocData(documentId, "0", consumerId, isRefresh);

                                          if (result) {

                                              const binaryString = window.atob(result);
                                              const len = binaryString.length;
                                              const bytes = new Uint8Array(len);
                              
                                              for (let i = 0; i < len; ++i) {
                                                  bytes[i] = binaryString.charCodeAt(i);
                                              }
                                              // display annotated version of the document 
                                              const blob = new Blob([bytes], { type: 'application/pdf' });
                                              var FitMode = docViewer.FitMode;
                                              docViewer.setFitMode(FitMode.FitWidth);
                                              docViewer.loadDocument(blob, { filename: 'myfile.pdf'});
                            
                                            }          
                                              
                                      }
                                  });
                              }     
                         
                      });

                      
                      // -- Display PDF (from memorystream/string)   --  https://www.pdftron.com/documentation/web/guides/basics/open/base64/
      
                      const binaryString = window.atob(arr);
                      const len = binaryString.length;
                      const bytes = new Uint8Array(len);
      
                      for (let i = 0; i < len; ++i) {
                          bytes[i] = binaryString.charCodeAt(i);
                      }
      
                      // const arr = new Uint8Array(bytes);
                      const blob = new Blob([bytes], { type: 'application/pdf' });
                      instance.UI.loadDocument(blob, { filename: 'myfile.pdf'});
                      instance.UI.disableElements(['toolsHeader']);
                       
                      docViewer.addEventListener('documentLoaded', async () => {
                          try {
                              annotManager.exportAnnotations().then(xfdfString => {
                                const doc =  docViewer.getDocument();
                              });

                          } catch {

                              documentNotAllowedSaveAlert();
                             // alert('This PDF document format does not allow saving. Any entered data can not be saved to the database.');
                          }
                         
                      });
                  });

          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          },
      });
  }

  
  function openFormEditor(formId, documentEdited, consumerId, isRefresh, isTemplate, applicationName, formCompleteDate, isFormLocked) {
 
      $.ajax({
          type: 'POST',
          url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/openFormEditor/',
          data: '{"formId":"' + formId + '", "documentEdited":"' + documentEdited + '", "consumerId":"' + consumerId + '", "isRefresh":"' + isRefresh + '", "isTemplate":"' + isTemplate + '", "applicationName":"' + applicationName + '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (response, status, xhr) {
              var arr = response.openFormEditorResult;

              WebViewer({
                  path: './WebViewer/lib', // path to the PDFTron 'lib' folder on your server
                  // licenseKey: 'Marshall Information Services, LLC(primarysolutions.net):OEM:Advisor/Anywhere;Gatekeeper/Anywhere::B+:AMS(20220512):A8A5354D0437C60A7360B13AC9A2537860614FABB956CD3BD5343BC2C76C38C054C2BEF5C7',
                  // licenseKey: 'Marshall Information Services, LLC(primarysolutions.net):OEM:Advisor/Anywhere;Gatekeeper/Anywhere::B+:AMS(20220512):A8A5354D0437C60A7360B13AC9A2537860614FABB956CD3BD5343BC2C76C38C054C2BEF5C7',
                  licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20240512):99A5375D0437C60A0360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                  documentType: 'pdf',
                   // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                  // initialDoc: 'test.pdf',  // You can also use documents on your server
               }, document.getElementById('viewer'))
                  .then(instance => {
                      console.log('success with S3 file');
                      var FitMode = instance.UI.FitMode;
                      instance.UI.setFitMode(FitMode.FitWidth);
                  // hide the ribbons
                   instance.UI.disableElements(['ribbons']);
                 //  instance.disableFeatures([instance.Feature.Download]);
               
                      const docViewer = instance.Core.documentViewer;
                      const annotManager = instance.Core.annotationManager;
                                    
                      instance.UI.setHeaderItems(header => {
                        if ($.session.formsUpdate) { 
                          header.push({
                            type: 'actionButton',
                            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path class="fill-path" d="M17.59 3.59c-.38-.38-.89-.59-1.42-.59H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7.83c0-.53-.21-1.04-.59-1.41l-2.82-2.83zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm1-10H7c-1.1 0-2-.9-2-2s.9-2 2-2h6c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>',
                            title: 'Save Current Data',
                              onClick: async () => {

                              try{
                                if (isFormLocked) {
                                  throw new Error();
                                }
            
                                 let formID;
                                 const doc = docViewer.getDocument();
                                 const xfdfString = await annotManager.exportAnnotations();
                                                       
                                 const data = await doc.getFileData({
                                      // saves the document with annotations in it
                                     xfdfString
                                  });          
                              
                                 // let documentEdited = "1"; // documentEdited = T 
                                //  insertConsumerFormAsync
                                if (documentEdited === "1") {
                                  const result = await formsAjax.updateConsumerFormAsync(formId, data, documentEdited); 
                                  const {updateConsumerFormResult: {formID}} = result;

                                } else {
                                  const result = await formsAjax.insertConsumerFormAsync($.session.UserId, consumerId, formId, data, formCompleteDate); 
                                  const {insertConsumerFormResult} = result;
                                  formID = insertConsumerFormResult.formId;

                                  overlay.hide();
                                 forms.loadPDFFormsLanding();
                                }

                                  alert('Document has been saved.');

                              } catch(e) { 
                                      if(e) {
                                        alert('Cannot save while document is locked. Document NOT saved.')
                                      } else {
                                        //
                                        alert('This PDF document format does not allow saving. Document NOT saved.');
                                        // POPUP.hide(formPopup);
                                      }  
                              }

                              }
                          }); // push
                        } //if
                              header.push({
                                  type: 'actionButton',
                                 // img: '../../../../images/new-icons/default.png',
                                 img: 'icon-close',
                                  title: 'Close Window',
                                  onClick: async () => {
                                     // let PDFForm = document.getElementById('formPopup');
                                      //POPUP.hide(formPopup);
                                      if ($.session.formsUpdate) { 
                                        closewarningPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
                                        removeFormsLock(formId, consumerId);
                                      } else {
                                        POPUP.hide(formPopup);
                                        removeFormsLock(formId, consumerId);
                                      }
  
                                  }
                              });  
                              
                              if (isTemplate == "0" && $.session.formsUpdate == true) {

                                  header.push({
                                      type: 'actionButton',
                                     // img: '../../../../images/new-icons/default.png',
                                     // img: 'icon-chevron-down',
                                     img: '<svg fill="#000000" height="22px" width="22px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M426.574,403.384c-0.04-0.445-0.11-0.88-0.177-1.317c-0.039-0.253-0.068-0.506-0.115-0.757 c-0.081-0.425-0.188-0.84-0.294-1.256c-0.066-0.261-0.125-0.524-0.201-0.783c-0.115-0.388-0.252-0.766-0.388-1.145 c-0.101-0.282-0.195-0.565-0.309-0.843c-0.14-0.344-0.3-0.677-0.458-1.012c-0.141-0.301-0.277-0.603-0.433-0.899 c-0.161-0.305-0.341-0.598-0.517-0.894c-0.181-0.306-0.357-0.615-0.555-0.914c-0.189-0.285-0.396-0.554-0.598-0.829 c-0.212-0.289-0.416-0.581-0.644-0.862c-0.229-0.282-0.479-0.545-0.722-0.815c-0.203-0.225-0.388-0.46-0.602-0.679 c-0.03-0.03-0.063-0.055-0.092-0.085c-0.216-0.218-0.451-0.415-0.677-0.623c-4.089-3.782-9.292-5.686-14.51-5.673h-85.276 c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h20.393c-26.343,13.774-55.128,21.323-84.4,21.323 c-106.042,0-192-85.958-192-192c0-29.414,6.613-57.859,19.169-83.716c5.146-10.599,0.727-23.363-9.872-28.509 c-10.599-5.146-23.363-0.727-28.509,9.872c-15.361,31.634-23.455,66.447-23.455,102.353 c0,129.606,105.061,234.667,234.667,234.667c45.644,0,89.851-14.62,128.006-40.418v40.429c0,11.782,9.551,21.333,21.333,21.333 c11.782,0,21.333-9.551,21.333-21.333v-85.333c0-0.405-0.038-0.8-0.061-1.199C426.598,403.884,426.596,403.634,426.574,403.384z"></path> <path d="M256.001,21.325c-45.622,0-89.833,14.627-127.996,40.422V21.333C128.005,9.551,118.454,0,106.672,0 C94.89,0,85.339,9.551,85.339,21.333v85.06c-0.001,0.047,0,0.094,0,0.141v0.132c0,0.134,0.018,0.264,0.02,0.398 c0.01,0.549,0.031,1.097,0.083,1.645c0.025,0.261,0.07,0.515,0.104,0.772c0.057,0.428,0.112,0.856,0.195,1.281 c0.06,0.308,0.14,0.608,0.213,0.912c0.089,0.369,0.174,0.737,0.283,1.101c0.095,0.319,0.209,0.628,0.319,0.94 c0.12,0.342,0.236,0.683,0.373,1.02c0.128,0.313,0.274,0.616,0.417,0.921c0.15,0.323,0.296,0.646,0.464,0.962 c0.165,0.312,0.348,0.611,0.528,0.913c0.173,0.292,0.34,0.585,0.529,0.87c0.221,0.334,0.461,0.651,0.7,0.972 c0.175,0.234,0.339,0.473,0.525,0.702c0.319,0.394,0.662,0.767,1.007,1.137c0.117,0.125,0.218,0.258,0.338,0.381 c0.017,0.017,0.036,0.032,0.053,0.049c0.461,0.467,0.944,0.91,1.446,1.333c0.039,0.033,0.076,0.072,0.115,0.105 c3.602,2.992,8.205,4.808,13.232,4.899c0.064,0.001,0.127,0.009,0.191,0.01c0.067,0.001,0.132,0.01,0.199,0.01h85.333 c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-20.416c26.355-13.784,55.149-21.342,84.412-21.342 c106.034,0,192,85.972,192,192c0,29.464-6.617,57.929-19.188,83.795c-5.15,10.597-0.734,23.362,9.863,28.512 c10.597,5.15,23.362,0.734,28.512-9.863c15.381-31.649,23.479-66.486,23.479-102.445C490.668,126.4,385.6,21.325,256.001,21.325z "></path> </g> </g> </g> </g></svg>',
                                      title: 'Refresh with original data',
                                      onClick: async () => {

                                          const doc = docViewer.getDocument();
                                          const xfdfString = await annotManager.exportAnnotations();
                                                       
                                          const data = await doc.getFileData({
                                              // saves the document with annotations in it
                                              xfdfString
                                              });   

                                          docViewer.closeDocument();
                                          // get the data for annotated version of the document 
                                          let isRefresh = true; 
                                          const result = await formsAjax.getPDFFormData(formId, "0", consumerId, isRefresh, isTemplate, $.session.applicationName);

                                          if (result) {

                                              const binaryString = window.atob(result);
                                              const len = binaryString.length;
                                              const bytes = new Uint8Array(len);
                              
                                              for (let i = 0; i < len; ++i) {
                                                  bytes[i] = binaryString.charCodeAt(i);
                                              }
                                              // display annotated version of the document 
                                              const blob = new Blob([bytes], { type: 'application/pdf' });
                                              var FitMode = docViewer.FitMode;
                                              docViewer.setFitMode(FitMode.FitWidth);
                                              docViewer.loadDocument(blob, { filename: 'myfile.pdf'});
                            
                                            }          
                                              
                                      }
                                  });

                             }     
                         
                      });

                      
                      // -- Display PDF (from memorystream/string)   --  https://www.pdftron.com/documentation/web/guides/basics/open/base64/
      
                      const binaryString = window.atob(arr);
                      const len = binaryString.length;
                      const bytes = new Uint8Array(len);
      
                      for (let i = 0; i < len; ++i) {
                          bytes[i] = binaryString.charCodeAt(i);
                      }
      
                      // const arr = new Uint8Array(bytes);
                      const blob = new Blob([bytes], { type: 'application/pdf' });
                      docViewer.loadDocument(blob, { filename: 'myfile.pdf'});
                      instance.UI.disableElements(['toolsHeader']);
                       
                      docViewer.addEventListener('documentLoaded', async () => {
                          try {

                              const doc = docViewer.getDocument();
                              const xfdfString = await annotManager.exportAnnotations();
                                                    
                              const data = await doc.getFileData({
                                   // saves the document with annotations in it
                                   xfdfString
                               });

                          } catch {

                              documentNotAllowedSaveAlert();
                             // alert('This PDF document format does not allow saving. Any entered data can not be saved to the database.');
                          }
                         
                      });
                  });
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          },
      });
  }

  function openStepFormEditor(formId, documentEdited, consumerId, isRefresh, isTemplate, applicationName, formCompleteDate, isFormLocked, stepId, docOrder, formName) {
 
    $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/openFormEditor/',
        data: '{"formId":"' + formId + '", "documentEdited":"' + documentEdited + '", "consumerId":"' + consumerId + '", "isRefresh":"' + isRefresh + '", "isTemplate":"' + isTemplate + '", "applicationName":"' + applicationName + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response, status, xhr) {
            var arr = response.openFormEditorResult;

            WebViewer({
                path: './WebViewer/lib', // path to the PDFTron 'lib' folder on your server
                // licenseKey: 'Marshall Information Services, LLC(primarysolutions.net):OEM:Advisor/Anywhere;Gatekeeper/Anywhere::B+:AMS(20220512):A8A5354D0437C60A7360B13AC9A2537860614FABB956CD3BD5343BC2C76C38C054C2BEF5C7',
                // licenseKey: 'Marshall Information Services, LLC(primarysolutions.net):OEM:Advisor/Anywhere;Gatekeeper/Anywhere::B+:AMS(20220512):A8A5354D0437C60A7360B13AC9A2537860614FABB956CD3BD5343BC2C76C38C054C2BEF5C7',
                licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20240512):99A5375D0437C60A0360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                documentType: 'pdf',
                 // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                // initialDoc: 'test.pdf',  // You can also use documents on your server
             }, document.getElementById('viewer'))
                .then(instance => {
                    console.log('success with S3 file');
                    var FitMode = instance.UI.FitMode;
                    instance.UI.setFitMode(FitMode.FitWidth);
                // hide the ribbons
                 instance.UI.disableElements(['ribbons']);
               //  instance.disableFeatures([instance.Feature.Download]);
             
                    const docViewer = instance.Core.documentViewer;
                    const annotManager = instance.Core.annotationManager;
                                  
                    instance.UI.setHeaderItems(header => {
                      if ($.session.formsUpdate) { 
                        header.push({
                          type: 'actionButton',
                          img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path class="fill-path" d="M17.59 3.59c-.38-.38-.89-.59-1.42-.59H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7.83c0-.53-.21-1.04-.59-1.41l-2.82-2.83zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm1-10H7c-1.1 0-2-.9-2-2s.9-2 2-2h6c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>',
                          title: 'Save Current Data',
                            onClick: async () => {
                                    const doc = docViewer.getDocument();
                                    const xfdfString = await annotManager.exportAnnotations();
                                                          
                                    const data = await doc.getFileData({
                                        // saves the document with annotations in it
                                        xfdfString
                                    });          
                         // save the Step Document with any edits included       
                        let documentEdited = "1"; // documentEdited = T 
                        const resultStepDoc = await WorkflowViewerAjax.insertStepDocumentAsync(stepId, docOrder, formName + '.pdf', 'pdf', data, documentEdited); 
                        const {insertWorkflowStepDocumentResult: {attachmentId, documentId}} = resultStepDoc;
                        // save the original Form Document with any edits included
                       // const resultFormDoc = await formsAjax.updateConsumerFormAsync(formId, data, documentEdited); 
                        //          const {updateConsumerFormResult: {formID}} = resultFormDoc;

                        const newDocObj = {
                          documentId: documentId,
                          stepId: stepId,
                          docOrder: `"${docOrder}"`,
                          description: formName + '.pdf',
                          attachmentId: attachmentId,
                          documentEdited: documentEdited,
                                        attachmentType: 'pdf'

                                      }
  
                                      const newStepDocComponent = new WorkflowDocumentComponent(newDocObj).render();  
                
                                                  alert('Document has been saved.');



                                                  removeFormsLock(formId, consumerId);
                                      POPUP.hide(formPopup);
                
                                      const stepsContainer = document.querySelector(`.wf-steps-container[data-id='${stepId}']`);
                                      const documentsList = stepsContainer.querySelector(".wf-documents-list");
                     
                                      documentsList.appendChild(newStepDocComponent);
                
                                  

                            } //onclick
                        }); // push
                      } //if
                            header.push({
                                type: 'actionButton',
                               // img: '../../../../images/new-icons/default.png',
                               img: 'icon-close',
                                title: 'Close Window',
                                onClick: async () => {
                                   // let PDFForm = document.getElementById('formPopup');
                                    //POPUP.hide(formPopup);
                                    if ($.session.formsUpdate) { 
                                      closewarningPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
                                      removeFormsLock(formId, consumerId);
                                    } else {
                                      POPUP.hide(formPopup);
                                      removeFormsLock(formId, consumerId);
                                    }

                                }
                            });  
                            
                            if (isTemplate == "0" && $.session.formsUpdate == true) {

                                header.push({
                                    type: 'actionButton',
                                   // img: '../../../../images/new-icons/default.png',
                                   // img: 'icon-chevron-down',
                                   img: '<svg fill="#000000" height="22px" width="22px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M426.574,403.384c-0.04-0.445-0.11-0.88-0.177-1.317c-0.039-0.253-0.068-0.506-0.115-0.757 c-0.081-0.425-0.188-0.84-0.294-1.256c-0.066-0.261-0.125-0.524-0.201-0.783c-0.115-0.388-0.252-0.766-0.388-1.145 c-0.101-0.282-0.195-0.565-0.309-0.843c-0.14-0.344-0.3-0.677-0.458-1.012c-0.141-0.301-0.277-0.603-0.433-0.899 c-0.161-0.305-0.341-0.598-0.517-0.894c-0.181-0.306-0.357-0.615-0.555-0.914c-0.189-0.285-0.396-0.554-0.598-0.829 c-0.212-0.289-0.416-0.581-0.644-0.862c-0.229-0.282-0.479-0.545-0.722-0.815c-0.203-0.225-0.388-0.46-0.602-0.679 c-0.03-0.03-0.063-0.055-0.092-0.085c-0.216-0.218-0.451-0.415-0.677-0.623c-4.089-3.782-9.292-5.686-14.51-5.673h-85.276 c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333h20.393c-26.343,13.774-55.128,21.323-84.4,21.323 c-106.042,0-192-85.958-192-192c0-29.414,6.613-57.859,19.169-83.716c5.146-10.599,0.727-23.363-9.872-28.509 c-10.599-5.146-23.363-0.727-28.509,9.872c-15.361,31.634-23.455,66.447-23.455,102.353 c0,129.606,105.061,234.667,234.667,234.667c45.644,0,89.851-14.62,128.006-40.418v40.429c0,11.782,9.551,21.333,21.333,21.333 c11.782,0,21.333-9.551,21.333-21.333v-85.333c0-0.405-0.038-0.8-0.061-1.199C426.598,403.884,426.596,403.634,426.574,403.384z"></path> <path d="M256.001,21.325c-45.622,0-89.833,14.627-127.996,40.422V21.333C128.005,9.551,118.454,0,106.672,0 C94.89,0,85.339,9.551,85.339,21.333v85.06c-0.001,0.047,0,0.094,0,0.141v0.132c0,0.134,0.018,0.264,0.02,0.398 c0.01,0.549,0.031,1.097,0.083,1.645c0.025,0.261,0.07,0.515,0.104,0.772c0.057,0.428,0.112,0.856,0.195,1.281 c0.06,0.308,0.14,0.608,0.213,0.912c0.089,0.369,0.174,0.737,0.283,1.101c0.095,0.319,0.209,0.628,0.319,0.94 c0.12,0.342,0.236,0.683,0.373,1.02c0.128,0.313,0.274,0.616,0.417,0.921c0.15,0.323,0.296,0.646,0.464,0.962 c0.165,0.312,0.348,0.611,0.528,0.913c0.173,0.292,0.34,0.585,0.529,0.87c0.221,0.334,0.461,0.651,0.7,0.972 c0.175,0.234,0.339,0.473,0.525,0.702c0.319,0.394,0.662,0.767,1.007,1.137c0.117,0.125,0.218,0.258,0.338,0.381 c0.017,0.017,0.036,0.032,0.053,0.049c0.461,0.467,0.944,0.91,1.446,1.333c0.039,0.033,0.076,0.072,0.115,0.105 c3.602,2.992,8.205,4.808,13.232,4.899c0.064,0.001,0.127,0.009,0.191,0.01c0.067,0.001,0.132,0.01,0.199,0.01h85.333 c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333h-20.416c26.355-13.784,55.149-21.342,84.412-21.342 c106.034,0,192,85.972,192,192c0,29.464-6.617,57.929-19.188,83.795c-5.15,10.597-0.734,23.362,9.863,28.512 c10.597,5.15,23.362,0.734,28.512-9.863c15.381-31.649,23.479-66.486,23.479-102.445C490.668,126.4,385.6,21.325,256.001,21.325z "></path> </g> </g> </g> </g></svg>',
                                      title: 'Refresh with original data',
                                    onClick: async () => {

                                        const doc = docViewer.getDocument();
                                        const xfdfString = await annotManager.exportAnnotations();
                                                     
                                        const data = await doc.getFileData({
                                            // saves the document with annotations in it
                                            xfdfString
                                            });   

                                        docViewer.closeDocument();
                                        // get the data for annotated version of the document 
                                        let isRefresh = true; 
                                        const result = await formsAjax.getPDFFormData(formId, "0", consumerId, isRefresh, isTemplate, $.session.applicationName);

                                        if (result) {

                                            const binaryString = window.atob(result);
                                            const len = binaryString.length;
                                            const bytes = new Uint8Array(len);
                            
                                            for (let i = 0; i < len; ++i) {
                                                bytes[i] = binaryString.charCodeAt(i);
                                            }
                                            // display annotated version of the document 
                                            const blob = new Blob([bytes], { type: 'application/pdf' });
                                            var FitMode = docViewer.FitMode;
                                            docViewer.setFitMode(FitMode.FitWidth);
                                            docViewer.loadDocument(blob, { filename: 'myfile.pdf'});
                          
                                          }          
                                            
                                    }
                                });

                           }     
                       
                    });

                    
                    // -- Display PDF (from memorystream/string)   --  https://www.pdftron.com/documentation/web/guides/basics/open/base64/
    
                    const binaryString = window.atob(arr);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
    
                    for (let i = 0; i < len; ++i) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
    
                    // const arr = new Uint8Array(bytes);
                    const blob = new Blob([bytes], { type: 'application/pdf' });
                    instance.Core.documentViewer.loadDocument(blob, { filename: 'myfile.pdf'});
                    instance.UI.disableElements(['toolsHeader']);
                     
                    docViewer.addEventListener('documentLoaded', async () => {
                        try {

                            const doc = docViewer.getDocument();
                            const xfdfString = await annotManager.exportAnnotations();
                                                  
                            const data = await doc.getFileData({
                                 // saves the document with annotations in it
                                 xfdfString
                             });

                        } catch {

                            documentNotAllowedSaveAlert();
                           // alert('This PDF document format does not allow saving. Any entered data can not be saved to the database.');
                        }
                       
                    });
                });
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}
  async function getUserFormTemplatesAsync(userId, hasAssignedFormTypes) {
      try {
        const result = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/getUserFormTemplates/',
          data: JSON.stringify({
            token: $.session.Token,
            userId: userId,
            hasAssignedFormTypes: hasAssignedFormTypes,
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return result;
      } catch (error) {
        throw new Error(error.responseText);
      }
    }
  
    async function insertConsumerFormAsync(
      userId,
      consumerId,
      formtemplateid,
      formdata,
      formCompleteDate,
    ) {
      try {
        var binary = '';
        var bytes = new Uint8Array(formdata);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let abString = window.btoa(binary);
        const result = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/insertConsumerForm/',
          data: JSON.stringify({
            token: $.session.Token,
            userId,
            consumerId,
            formtemplateid,
            formdata: abString,
            formCompleteDate,
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return result;
      } catch (error) {
        throw new Error(error.responseText);
      }
    }
  
    async function updateConsumerFormAsync(
      formId,
      formdata,
      documentEdited,
    ) {
      try {
        var binary = '';
        var bytes = new Uint8Array(formdata);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let abString = window.btoa(binary);
        const result = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/updateConsumerForm/',
          data: JSON.stringify({
            token: $.session.Token,
            formId,
            formdata: abString,
            documentEdited,
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return result;
      } catch (error) {
        throw new Error(error.responseText);
      }
    }
  
    async function updateConsumerFormCompletionDateAsync(
      formId,
      formCompletionDate,
    ) {
      try {
       
        const result = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/updateConsumerFormCompletionDate/',
          data: JSON.stringify({
            token: $.session.Token,
            formId,
            formCompletionDate,
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return result;
      } catch (error) {
        throw new Error(error.responseText);
      }
    }

    async function deleteConsumerFormAsync(formId) {
      try {
        const result = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/deleteConsumerForm/',
          data:
            '{"token":"' +
            $.session.Token +
            '", "formId":"' +
            formId +
            '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return result;
      } catch (error) {
        throw new Error(error.responseText);
      }
    }

    async function getconsumerFormsAsync(userId, consumerId, hasAssignedFormTypes) {
      try {
        const result = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/getconsumerForms/',
          data:
            '{"token":"' +
            $.session.Token +
            '", "userId":"' +
            userId +
            '", "consumerId":"' +
            consumerId +
            '", "hasAssignedFormTypes":"' +
            hasAssignedFormTypes +
            '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return result;
      } catch (error) {
        throw new Error(error.responseText);
      }
    }
   

  // for Plan module (Workflow Step Docs)
  async function getPDFDocData(documentId, documentEdited, consumerId, isRefresh) {
      // token, consumerId
      try {
        const data = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/openPDFEditor/',
            data: '{"documentId":"' + documentId + '", "documentEdited":"' + documentEdited + '", "consumerId":"' + consumerId + '", "isRefresh":"' + isRefresh + '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return data.openPDFEditorResult;
      } catch (error) {
        console.log(error.responseText);
      }
    }

    // for Forms module
    async function getPDFFormData(formId, documentEdited, consumerId, isRefresh, isTemplate, applicationName) {
      // token, consumerId
      try {
        const data = await $.ajax({
          type: 'POST',
          url:
            $.webServer.protocol +
            '://' +
            $.webServer.address +
            ':' +
            $.webServer.port +
            '/' +
            $.webServer.serviceName +
            '/openFormEditor/',
            data: '{"formId":"' + formId + '", "documentEdited":"' + documentEdited + '", "consumerId":"' + consumerId + '", "isRefresh":"' + isRefresh + '", "isTemplate":"' + isTemplate + '", "applicationName":"' + applicationName + '"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
        });
        return data.openFormEditorResult;
      } catch (error) {
        console.log(error.responseText);
      }
    } 
      
  function documentNotAllowedSaveAlert() {

    var popup = POPUP.build({
      id: 'saveNotAllowedAlertPopup',
      classNames: 'warning',
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var okBtn = button.build({
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: async function() {
        POPUP.hide(popup);
                  overlay.show();
      },
    });
    
    btnWrap.appendChild(okBtn);
    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = 'This PDF document format does not allow saving. Any entered data can not be saved to the database.';
    popup.appendChild(warningMessage);
    popup.appendChild(btnWrap);
    POPUP.show(popup);

  }

 function closewarningPopup(formId, documentEdited, consumerId, isRefresh, isTemplate) {
    const closewarningpopup = POPUP.build({
      id: 'closewarningPopup',
      classNames: 'warning',
      hideX: true,
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add("btnWrap");
    
      const continueNoSaveBtn = button.build({
        text: 'Continue Close',
        style: 'secondary',
        type: 'contained',
        callback: async function() {
        
           POPUP.hide(closewarningpopup);
           POPUP.hide(formPopup);
          // if (documentEdited === "0") forms.loadPDFFormsLanding();
          //overlay.hide();
         // forms.loadPDFFormsLanding();
         // overlay.show();

        } //callback
      }) //continueBtn Build

      
    
      var mustSaveBtn = button.build({
        text: 'Do Not Close',
        style: 'secondary',
        type: 'contained',
        callback: function() {
          POPUP.hide(closewarningpopup);
          overlay.show();
          
        }
      })
      btnWrap.appendChild(mustSaveBtn);
      btnWrap.appendChild(continueNoSaveBtn);
  
    var warningMessage = document.createElement("p");
    warningMessage.innerHTML = "You should not close this form until you have saved your work. Do you want to proceed with closing this form?";
    closewarningpopup.appendChild(warningMessage);
    closewarningpopup.appendChild(btnWrap);
    POPUP.show(closewarningpopup);
  }

  async function checkFormsLock(formId, userId) {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/checkFormsLock/',
          data: '{"formId":"' + formId + '", "userId":"' + userId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.checkFormsLockResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function removeFormsLock(formId) {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/removeFormsLock/',
          data: '{"formId":"' + formId + '", "userId":"' + $.session.UserId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.removeFormsLockResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  return {       
      openEditor,
      openPDFEditor,
      openFormEditor,
      openStepFormEditor,
      getUserFormTemplatesAsync,
      insertConsumerFormAsync,
      updateConsumerFormAsync,
      updateConsumerFormCompletionDateAsync,
      deleteConsumerFormAsync,
      getconsumerFormsAsync,
      getPDFDocData,
      getPDFFormData,
      removeFormsLock,
      checkFormsLock
  };
}) ();