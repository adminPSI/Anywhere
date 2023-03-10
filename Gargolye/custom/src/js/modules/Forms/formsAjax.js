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
                  licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20230512):A9A5F75D0437C60AF360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                  documentType: 'pdf',
                  // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                  // initialDoc: 'test.pdf',  // You can also use documents on your server
               }, document.getElementById('viewer'))
                  .then(instance => {
                      console.log('success with S3 file');
                      var FitMode = instance.FitMode;
                      instance.setFitMode(FitMode.FitWidth);
                  // hide the ribbons
                   instance.disableElements(['ribbons']);
                  // instance.disableFeatures([instance.Feature.Download]);
                  // set the default toolbar group to the Shapes group
                    //  instance.setToolbarGroup(['toolbarGroup-Shapes']);
                      // call methods from instance, docViewer and annotManager as needed
      
                      const { docViewer, annotManager } = instance;
      
                      // -- Save PDF with Annotations -- https://www.pdftron.com/documentation/web/guides/get-file-data-with-viewer/
      
                      // Add header button that will get file data on click
                      instance.setHeaderItems(header => {
                          header.push({
                              type: 'actionButton',
                             // img: '../../../../images/new-icons/default.png',
                            // img: 'icon-annotation-status-accepted',
                             img: 'icon-tool-pen-fill',
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
                      instance.loadDocument(blob, { filename: templateName + '.pdf'});
                      instance.disableElements(['toolsHeader']);
                     // instance.disableElements(['toolbarGroup-Shapes']);
                    //  instance.disableElements(['toolbarGroup-Edit']);
                    //  instance.disableElements(['toolbarGroup-Insert']);
                      // you can also access major namespaces from the instance as follows:
                      const Tools = instance.Tools;
                       const Annotations = instance.Annotations;
                       
                      docViewer.on('documentLoaded', async () => {
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
                  licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20230512):A9A5F75D0437C60AF360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                  documentType: 'pdf',
                   // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                  // initialDoc: 'test.pdf',  // You can also use documents on your server
               }, document.getElementById('viewer'))
                  .then(instance => {
                      console.log('success with S3 file');
                      var FitMode = instance.FitMode;
                      instance.setFitMode(FitMode.FitWidth);
                  // hide the ribbons
                   instance.disableElements(['ribbons']);
                 //  instance.disableFeatures([instance.Feature.Download]);
               
                      const { docViewer, annotManager } = instance;
                                    
                      instance.setHeaderItems(header => {
                          header.push({
                              type: 'actionButton',
                              // img: '../../../../images/new-icons/default.png',
                             // img: 'icon-annotation-status-accepted',
                             img: 'icon-tool-pen-fill',
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
                                     img: 'icon-tool-stamp-fill',
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
                      instance.loadDocument(blob, { filename: 'myfile.pdf'});
                      instance.disableElements(['toolsHeader']);
                       
                      docViewer.on('documentLoaded', async () => {
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

  
  function openFormEditor(formId, documentEdited, consumerId, isRefresh, isTemplate, applicationName, formCompleteDate) {
 
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
                  licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20230512):A9A5F75D0437C60AF360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                  documentType: 'pdf',
                   // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf',
                  // initialDoc: 'test.pdf',  // You can also use documents on your server
               }, document.getElementById('viewer'))
                  .then(instance => {
                      console.log('success with S3 file');
                      var FitMode = instance.FitMode;
                      instance.setFitMode(FitMode.FitWidth);
                  // hide the ribbons
                   instance.disableElements(['ribbons']);
                 //  instance.disableFeatures([instance.Feature.Download]);
               
                      const { docViewer, annotManager } = instance;
                                    
                      instance.setHeaderItems(header => {
                        if ($.session.formsUpdate) { 
                          header.push({
                              type: 'actionButton',
                              // img: '../../../../images/new-icons/default.png',
                             // img: 'icon-annotation-status-accepted',
                             img: 'icon-tool-pen-fill',
                              title: 'Save Current Data',
                              onClick: async () => {

                              try{
            
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

                              } catch {
                                      // 
                                      alert('This PDF document format does not allow saving. Document NOT saved.');
                                     // POPUP.hide(formPopup);
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
                                     img: 'icon-tool-stamp-fill',
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
                      instance.loadDocument(blob, { filename: 'myfile.pdf'});
                      instance.disableElements(['toolsHeader']);
                       
                      docViewer.on('documentLoaded', async () => {
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
          forms.loadPDFFormsLanding();
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