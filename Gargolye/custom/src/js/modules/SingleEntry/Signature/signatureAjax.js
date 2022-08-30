var signatureAjax = (function() {
	function getConsumersSignaturesAndNotes(singleEntryId){
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumersSignaturesAndNotes/",
        data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
          clearSavedSignaturesAndNotes();
  
          var data = response.getConsumersSignaturesAndNotesResult;
  
          data.forEach(d => {
            var evvOptions = {
              consumer: null,
              consumerId: d.consumerId,
              signatureDataUrl: d.signature,
              noteDataString: d.note,
              fromSave: true
            };
  
            if (d.consumerId in $.session.evvDataCache === false) {
              var evv = new EVV(evvOptions);
              $.session.evvDataCache[d.consumerId] = evv;
            }
          });
          
        },
        error: function (xhr, status, error) {
          
        },
    });
  }

  function getSpecificConsumerSignatureAndNote(retrieveData, signOrNote, evvOptions) {//token,singleEntryId,consumerId    
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSpecificConsumerSignatureAndNote/",
        data: JSON.stringify(retrieveData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
          // var data = response.getSpecificConsumerSignatureAndNoteResult;            
          // var note = data[0].note;
          // var signatureDataUrl = data[0].signature;
          // signatureDataUrl = "data:image/png;base64," + signatureDataUrl;
          // if (signatureDataUrl === "data:image/png;base64,") {
          //     signatureDataUrl = "";
          // }
        },
        error: function (xhr, status, error) {
            //callback(error, null);
        },
    });
  }

  function singleEntrySaveSignatureAndNote(signatureAndNoteData, callback) {//token,singleEntryId,consumerId,note,signatureImage
    signatureAndNoteData.signatureImage = signatureAndNoteData.signatureImage === '' ? null : signatureAndNoteData.signatureImage;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/singleEntrySaveSignatureAndNote/",
        data: JSON.stringify(signatureAndNoteData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            clearSavedSignaturesAndNotes();
            //callback(null, res);
        },
        error: function (xhr, status, error) {
            //callback(error, null);
        },
    });
  }
  
	return {
    getConsumersSignaturesAndNotes,
    getSpecificConsumerSignatureAndNote,
    singleEntrySaveSignatureAndNote
	};
})();