var hoursWorkedWidgetAjax = (function () {
  function getWorkWeeks(callback) {
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
        '/getWorkWeeks/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getWorkWeeksResult;
        callback(null, res);
      },
      error: function (xhr, status, error) {
        callback(error, null);
      },
    });
  }

  function getHoursWorked(callback) {
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
        '/getCompanyWorkWeekAndHours/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCompanyWorkWeekAndHoursResult;
        callback(null, res);
      },
      error: function (xhr, status, error) {
        callback(error, null);
      },
    });
  }

  return {
    getWorkWeeks,
    getHoursWorked,
  };
})();
