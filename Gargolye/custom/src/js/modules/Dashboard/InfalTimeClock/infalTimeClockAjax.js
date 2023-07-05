var infalTimeClockAjax = (function () {
  //Gets the group note id for inserting new group notes
  function getJobs() {
    var id = readCookie('id');
    $.ajax({
      type: 'POST',
      //url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
      //    "/" + $.webServer.serviceName + "/getURL/",
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/InfalGetJobs/',
      data: '{"id":"' + id + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        createJobButtonsHtml(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  function infalClockInDataSetUp(EmpId, jobId, LatIn, LongIn, inDate, startTime, ampm) {
    var clockInData = {
      empIdString: EmpId,
      jobIdString: jobId,
      latInString: LatIn,
      longInString: LongIn,
      inDate: inDate,
      StartTime: startTime,
      StartAMPM: ampm,
    };

    clockIn(clockInData);
  }

  function clockIn(clockInData) {
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
        '/InfalClockIn/',
      //data: '{"empIdString":"' + EmpId + '", "jobIdString":"' + jobId + '", "latInString":"' + LatIn + '", "longInString":"' + LongIn + '", "inDate":"' + inDate + '", "StartTime":"' + startTime + '", "ampm":"' + ampm + '"}',
      data: JSON.stringify(clockInData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        checkClockInResult(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  function infalClockOutDataSetUp(
    EmpId,
    jobId,
    recId,
    LatOut,
    LongOut,
    outDate,
    endTime,
    ampm,
    memo,
  ) {
    var clockOutData = {
      empIdString: EmpId,
      jobIdString: jobId,
      recIdString: recId,
      latOutString: LatOut,
      longOutString: LongOut,
      outDate: outDate,
      EndTime: endTime,
      EndTimeAMPM: ampm,
      Memo: memo,
    };

    clockOut(clockOutData);
  }

  function clockOut(clockOutData) {
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
        '/InfalClockOut/',
      //data: '{"empIdString":"' + EmpId + '", "jobIdString":"' + jobId + '", "recIdString":"' + recId + '", "latOutString":"' + LatOut + '", "longOutString":"' + LongOut + '", "outDate":"' + outDate + '", "EndTime":"' + endTime + '", "EndTimeAMPM":"' + ampm + '", "Memo":"' + memo + '"}',
      data: JSON.stringify(clockOutData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        checkClockOutResult(res);
      },
      error: function (xhr, status, error) {
        console.log(xhr, status, error);
      },
    });
  }

  function checkAnticipo(id, pass) {
    $.ajax({
      type: 'POST',
      //url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
      //    "/" + $.webServer.serviceName + "/getURL/",
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/ValidateLogin/',
      data: '{"id":"' + id + '", "pass":"' + pass + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        allowAccess(res);
      },
      error: function (xhr, status, error) {
        console.log(xhr, status, error);
      },
    });
  }

  return {
    getJobs,
    infalClockInDataSetUp,
    clockIn,
    infalClockOutDataSetUp,
    clockOut,
    checkAnticipo,
  };
})();
