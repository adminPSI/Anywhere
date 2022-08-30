var absentAjax = (function() {
  function absentPreSaveCheck(selectData, callback) {
    // data = {token, consumerIdString, absentDate, locationId}
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/absentPreSave/',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(selectData),
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.absentPreSaveResult;
        callback(res);
      }
    });
  }
  function allLocationSaveAbsent(data, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/allLocationSaveAbsent/',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.allLocationSaveAbsentResult;
        if (callback) callback(res);
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function deleteAbsent(absentId, callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/deleteAbsent/',
      data: '{"token":"' + $.session.Token + '", "absentId":"' + absentId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
      }
    });
  }
  function getConsumersByLocationAbsent(locationId, absenceDate, callback) {
    // returns absent consumers for provided location and date
    var selectData = {
      token: $.session.Token,
      absenceDate: absenceDate ? absenceDate : UTIL.getTodaysDate(),
      locationId: locationId,
    };

    if (parseInt(locationId, 10) === 0) {
      selectData.locationId = "%";
    }

    return $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getConsumersByLocationAbsent/',
      data: JSON.stringify(selectData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });

    // $.ajax({
    //   type: 'POST',
    //   url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getConsumersByLocationAbsent/',
    //   data: JSON.stringify(selectData),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   success: function(response, status, xhr) {
    //     var res = JSON.parse(response.getConsumersByLocationAbsentResult);
    //     callback(res);
    //   }
    // });
  }
  function oneLocationAbsentSave(saveData, callback) {
    // saveData = {
    //   token, absentReasonId, absentNotificationId, consumerIdString, absenceDate,
    //   locationId, reportedBy, timeReported, dateReported
    // }
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/oneLocationAbsentSave/',
      data: JSON.stringify(saveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = response.oneLocationAbsentTableSaveResult;
        callback();
      }
    });
  }
  function selectAbsentNotificationTypes(callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/selectAbsentNotificationTypes/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        if (response.selectAbsentNotificationTypesResult) {
          var res = JSON.parse(response.selectAbsentNotificationTypesResult);
          callback(res);
          return;
        } 
        
        callback([]);
      }
    });
  }
  function selectAbsentReasons(callback) {
    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/selectAbsentReasons/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        if (response.selectAbsentReasonsResult) {
          var res = JSON.parse(response.selectAbsentReasonsResult);
          callback(res);
          return;
        }
        
        callback([]);
      }
    });
  }
  function selectAbsent(selectData, callback) {
    // selectData = {token, consumerId, locationId, statusDate }

    $.ajax({
      type: 'POST',
      url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/selectAbsent/',
      data: JSON.stringify(selectData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response, status, xhr) {
        var res = JSON.parse(response.selectAbsentResult);
        callback(res);
      }
    });
  
    return false;
  }
  
  return {
    absentPreSaveCheck,
    allLocationSaveAbsent,
    deleteAbsent,
    getConsumersByLocationAbsent,
    oneLocationAbsentSave,
    selectAbsentNotificationTypes,
    selectAbsentReasons,
    selectAbsent
  }
})();

