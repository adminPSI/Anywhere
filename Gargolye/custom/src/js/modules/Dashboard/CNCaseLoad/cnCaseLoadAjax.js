//Ajax call using ASYNC AWAIT

const CN_CaseLoadWidgetAjax = (function() {
  function getCaseNoteProductivity(daysBack = 7) {
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
        $.webServer.serviceName + '/getDashboardCaseNoteProductivity/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    });
  }
  
  return {
    getCaseNoteProductivity
  };
})();
