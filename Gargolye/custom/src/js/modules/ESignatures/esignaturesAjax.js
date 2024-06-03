var esignaturesAjax = (function () {  
  
    function openESignaturesPDFEditor(tempUserId, formId, documentEdited, consumerId, isRefresh, isTemplate, applicationName) {
        const token = $.session.token;
        const planAttachmentIds = [];
        const wfAttachmentIds = [];
        const sigAttachmentIds = [];

      $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/openESignaturesEditor/',
        data: '{"tempUserId":"' + tempUserId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response, status, xhr) {
            

            var arr = response.openESignaturesEditorResult;

            WebViewer({
                path: './WebViewer/lib', // path to the PDFTron 'lib' folder on your server
                licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20240512):99A5375D0437C60A0360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
                documentType: 'pdf',
             }, document.getElementById('viewer'))
                .then(instance => {
                    var FitMode = instance.FitMode;
                    instance.setFitMode(FitMode.FitWidth);
                // hide the ribbons
                 instance.disableElements(['ribbons']);
             
                    const { docViewer, annotManager } = instance;
                                  
                    instance.setHeaderItems(header => {
                            header.push({
                                type: 'actionButton',
                                img: 'icon-close',
                                title: 'Close Window',
                                onClick: async () => {
                                }
                            });     
                    });
  
                    const binaryString = window.atob(arr);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
    
                    for (let i = 0; i < len; ++i) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
    
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
  
                        }
                       
                    });
                });
        },
        error: function (xhr, status, error) {
        },
    });
  }

  function downloadReportAfterSigning(retrieveData, callback) {
    var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/downloadReportAfterSigning/`;
    var successFunction = function (resp) {
      var res = JSON.stringify(response);
      callback();
    };

    var form = document.createElement('form');
    form.setAttribute('action', action);
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.setAttribute('enctype', 'bare');
    form.setAttribute('success', successFunction);

    var tempUserIdInput = document.createElement('input');
    tempUserIdInput.setAttribute('name', 'token');
    tempUserIdInput.setAttribute('value', retrieveData.tempUserId);
    tempUserIdInput.id = 'tempUserId';

    form.appendChild(tempUserIdInput);

    form.style.position = 'absolute';
    form.style.opacity = '0';
    document.body.appendChild(form);

    form.submit();
  }
  
    return {       
        openESignaturesPDFEditor,
        downloadReportAfterSigning
    };
  }) ();