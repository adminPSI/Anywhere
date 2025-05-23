var esignaturesAjax = (function () {  

  async function openESignaturesPDFEditor(tempUserId, progressDiv) {
    const token = $.session.token;
    
    // Show the spinner
    var popup = document.createElement('div');
    popup.classList.add('pendingSavePopup', 'popup');

    //SPINNER
    spinnerWrap = document.createElement('div');
    spinnerWrap.classList.add('spinner');
    spinnerMessage = document.createElement('h2');
    spinnerMessage.classList.add('spinner__message');
    var spinnerBar = document.createElement('div');
    spinnerBar.classList.add('spinner__bar');
    spinnerMessage.innerHTML = `<p>Loading...</p>`;
    spinnerWrap.appendChild(spinnerBar);
    spinnerWrap.appendChild(spinnerMessage);

    popup.appendChild(spinnerWrap);

    progressDiv.appendChild(popup);

    try {
      const response = await $.ajax({
        type: 'POST',
        url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/openESignaturesEditor/',
        data: JSON.stringify({ tempUserId }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      });
  
      var arr = response.openESignaturesEditorResult;
  
      await WebViewer({
        path: './WebViewer/lib', // path to the PDFTron 'lib' folder on your server
        licenseKey: 'Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::B+:AMS(20240512):99A5375D0437C60A0360B13AC9A2537860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7',
        documentType: 'pdf',
      }, document.getElementById('viewer'))
        .then(instance => {
          var FitMode = instance.UI.FitMode;
          instance.UI.setFitMode(FitMode.FitWidth);
          instance.UI.disableElements(['ribbons']);
  
          const docViewer = instance.Core.documentViewer;
          const annotManager = instance.Core.annotationManager;
  
          instance.UI.setHeaderItems(header => {
            header.push({
              type: 'actionButton',
              img: 'icon-close',
              title: 'Close Window',
              onClick: async () => { }
            });
          });
  
          const binaryString = window.atob(arr);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
  
          for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
          }
  
          const blob = new Blob([bytes], { type: 'application/pdf' });
          instance.Core.documentViewer.loadDocument(blob, { filename: 'myfile.pdf' });
          instance.UI.disableElements(['toolsHeader']);
  
          docViewer.addEventListener('documentLoaded', async () => {
            try {
              const doc = docViewer.getDocument();
              const xfdfString = await annotManager.exportAnnotations();
  
              await doc.getFileData({
                // saves the document with annotations in it
                xfdfString
              });
  
            } catch (error) {
              throw new Error('Failed to process document');
            }
          });
        });
  

      var popup = document.querySelector('.pendingSavePopup');
      progressDiv.removeChild(popup);

      return 'success';
    } catch (error) {
      var popup = document.querySelector('.pendingSavePopup');
      progressDiv.removeChild(popup);
      
      return 'error';
    }
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
})();
