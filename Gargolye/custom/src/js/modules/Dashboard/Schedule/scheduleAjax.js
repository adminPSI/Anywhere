var scheduleAjax = (function () {
  function getSchedulingPeriodsAjax(callback) {
    $.ajax({
        type: "POST",
        url: 
          $.webServer.protocol + "://" + 
          $.webServer.address + ":" + 
          $.webServer.port + "/" + 
          $.webServer.serviceName + "/getSchedulingPeriods/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
          var res = response.getSchedulingPeriodsResult;
          var data = res.map(r => {
            var start = r.start_date.split(' ')[0];
            var end = r.end_date.split(' ')[0];
            var text = `${start} - ${end}`;
            return {
              start,
              end,
              text,
              currentWeek: r.is_curr_date === '1' ? true : false
            }
          });
          callback(data);
        },
        error: function (xhr, status, error) {
          //callback(error);
        }
    });
  }

  function getSchedulingPeriodsDetailsAjax(filterData, callback) {
    //Filter data to include token, startDate, endDate
    $.ajax({
      type: "POST",
      url: 
        $.webServer.protocol + "://" + 
        $.webServer.address + ":" + 
        $.webServer.port + "/" + 
        $.webServer.serviceName + "/getSchedulingPeriodsDetails/",
      data: JSON.stringify(filterData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response, status, xhr) {
        var res = response.getSchedulingPeriodsDetailsResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //callback(error, null);
      }
    });
  }

  return {
    getSchedulingPeriodsAjax,
    getSchedulingPeriodsDetailsAjax
  }

}());