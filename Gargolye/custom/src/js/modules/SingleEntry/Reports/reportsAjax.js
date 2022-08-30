var reportsAjax = (function(){
  function getEmpSingleEntryDetailReportAjax(userId, startDate, endDate) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/BasicSingleEntryReport/',
      data: '{"token":"' + $.session.Token + '", "userId":"' + userId + '", "startDate":"' + startDate + '", "endDate":"' + endDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var arr = response.BasicSingleEntryReportResult._buffer;
        var byteArray = new Uint8Array(arr);
        var blob = new Blob([byteArray], { type: 'application/pdf' });
        if ($.session.browser == 'Explorer' || $.session.browser == 'Mozilla') {
          window.navigator.msSaveOrOpenBlob(blob, 'report.pdf');
        } else {
          var fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        }
        reports.handledProcessedReport();
      }
    });
  }
  
  function getOverlapSingleEntryDetailReportAjax(userId, startDate, endDate) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/SingleEntryOverLapReport/',
      data: '{"token":"' + $.session.Token + '", "userId":"' + userId + '", "startDate":"' + startDate + '", "endDate":"' + endDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var arr = response.SingleEntryOverLapReportResult._buffer;
        var byteArray = new Uint8Array(arr);
        var blob = new Blob([byteArray], { type: 'application/pdf' });
        if ($.session.browser == 'Explorer' || $.session.browser == 'Mozilla') {
          window.navigator.msSaveOrOpenBlob(blob, 'report.pdf');
        } else {
          var fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        }
        reports.handledProcessedReport();
      }
    });
  }

  return {
    getEmpSingleEntryDetailReportAjax,
    getOverlapSingleEntryDetailReportAjax
  }
})();
