//Ajax call using ASYNC AWAIT
const cnProductivitySettingsAjax = (function() {
  //placeholder
  function getCaseNoteProductivitySettings() {
    data = {
      token: $.session.Token,
      daysBack: daysBack,
    }
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol + '://' +
        $.webServer.address + ':' +
        $.webServer.port + '/' +
        $.webServer.serviceName + '/ /',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    });
  }
  
  return {
    getCaseNoteProductivitySettings
  };
})()