const missingSignatureAjax = (function () {
  function getMissingPlanSignatures(retrieveData, callback) {
    $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getMissingPlanSignatures/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getMissingPlanSignaturesResult;
        callback(res);
      },
      error: function (xhr, status, error) {},
    });
  }

  return {
    getMissingPlanSignatures,
  };
})();
