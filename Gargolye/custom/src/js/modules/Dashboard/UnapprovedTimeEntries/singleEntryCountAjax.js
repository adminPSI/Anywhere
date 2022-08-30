var singleEntryCountWidgetAjax = (function() {
  function getSingleEntryCountInfo(callback) {
    //ANYW_Dashboard_GetSingleEntryCountInfo 
    $.ajax({
      type: "POST",
      url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
          "/" + $.webServer.serviceName + "/getSingleEntryCountInfoJSON/",
      data: '{"token":"' + $.session.Token + '"}',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response, status, xhr) {
        res = response.getSingleEntryCountInfoJSONResult;
        callback(null, res);
      },
      error: function (xhr, status, error) {
        callback(error, null)
      },
    });
  }

  return {
    getSingleEntryCountInfo
  }
}());