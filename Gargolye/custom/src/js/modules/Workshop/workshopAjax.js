var workshopAjax = (function() {
  function clockoutWorkshopSingle(jobActid, timeEntered, callback) {
    singleClockOutData = {
      token: $.session.Token,
      jobActivityId: jobActid,
      timeEntered: timeEntered
    };
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/ClockoutWorkshopSingle/",
      data: JSON.stringify(singleClockOutData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          var res = JSON.stringify(response);
          callback(res);
          // if (res.indexOf("End Overlap") !== -1) {
          //   timeOverlapPopup("End time overlaps with existing record.");
          // } else {
          //   endTime = formatTimeFromDB(singleClockOutData.timeEntered);
          //   $("#" + singleClockOutData.jobActivityId + " td:nth-child(3)").text(
          //     endTime
          //   );

          //   // this works now just need to send over the endtime and not starttime input - Ash
          //   var clockoutEndtime = Array.from(
          //     $("#" + singleClockOutData.jobActivityId + " td:nth-child(3)")
          //   );
          //   validateEndTime(clockoutEndtime[0]);
          //   filterSetup();
          // }
        } catch (e) {}
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  function deleteWorkshopEntry(jobActId, callback) {
    deleteData = {
      token: $.session.Token,
      jobActivityId: jobActId
    };
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/DeleteWorkshopEntry/",
      data: JSON.stringify(deleteData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          data = response.getDeleteWorkshopEntryResult;
          callback();
        } catch (e) {}
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  //Call to popuate list based on drop down values
  function getWorkshopBatchById(data, callback) {
    callback();
  }

  function getEnabledConsumersForWorkshop(selectedDate, selectedLocation, callback) {
    // var selectedDate = $("#workshopdateboxinside").html();
    // selectedDate = formatDateForDatabaseSave(selectedDate);
    // var selectedLocation = $("#workshoplocationname").attr("locationid");
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/getEnabledConsumersForWorkshop/",
      data:
        '{"token":"' +
        $.session.Token +
        '", "selectedDate":"' +
        selectedDate +
        '", "selectedLocation":"' +
        selectedLocation +
        '"}',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        var res = JSON.parse(response.getEnabledConsumersForWorkshopResult);
        callback(res);
        // disableNonWorkshopConsumers(res);
      },
      error: function(xhr, status, error) {}
    });
  }

  function updateWorkshopClockIn(jobActid, timeEntered, callback) {
    updateClockInData = {
      token: $.session.Token,
      jobActivityId: jobActid,
      timeEntered: timeEntered
    };
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/UpdateWorkshopClockIn/",
      data: JSON.stringify(updateClockInData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          var res = JSON.stringify(response);
          callback(res);
          // if (res.indexOf("Start Overlap") != -1) {
          //   //Show pop up with error message saying start time can not be after end time.
          //   timeOverlapPopup("Start time can not be set after end time.");
          // } else {
          //   startTime = formatTimeFromDB(updateClockInData.timeEntered);
          //   $("#" + updateClockInData.jobActivityId + " td:nth-child(2)").text(
          //     startTime
          //   );
          //   filterSetup();
          //   $("*").removeClass("waitingCursor");
          // }
        } catch (e) {}
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  function updateWorkshopQuantity(quantity, jobActId) {
    insertData = {
      token: $.session.Token,
      quantity: quantity,
      jobActivityId: jobActId
    };
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/UpdateWorkshopQuantity/",
      data: JSON.stringify(insertData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          data = response.getUpdateWorkshopQuantityResult;
          
        } catch (e) {}
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  function WorkshopPreBatchLoad(callback) {
    var newDate = new Date();
    absenceDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1) +
      "-" +
      newDate.getDate();
    $.session.workshopBatchId = "";
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/WorkshopPreBatchLoad/",
      data:
        '{"token":"' +
        $.session.Token +
        '", "absenceDate":"' +
        absenceDate +
        '"}',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        data = response.WorkshopPreBatchLoadResult;
        callback(data);
        // if (data.length > 1) {
        // 	displaySelectBatch(data, callback);
        // } else if (data.length == 1) {
        // 	$.session.workshopBatchId = data[0].id;
        // 	callback(data);
        // } else {
        // 	displayNoBatch();
        // 	$('#roostertoolbar').hide();
        // 	$('*').removeClass('waitingCursor');
        // 	data = null;
        // 	callback(data);
        // }
      },
      error: function(xhr, status, error) {
        callback(error, null);
      }
    });
  }

  function WorkshopLocations(dateSelected, callback) {
    // var selectedDate = $("#workshopdateboxinside").html();
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/WorkshopLocations/",
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceDate":"' +
        dateSelected +
        '"}',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          data = response.WorkshopLocationsResult;
          callback(data);
          // populateLocations(null, data);
        } catch (e) {}
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  function WorkshopGetSupervisors(date, callback) {
    // var selectedDate = $("#workshopdateboxinside").html();
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/getWorkshopSupervisors/",
      data:
        '{"token":"' +
        $.session.Token +
        '", "selectedDate":"' +
        date +
        '"}',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          data = response.getWorkshopSupervisorsResult;
          callback(data);
          // populateSupervisors(null, data);
        } catch (e) {}
      },
      error: function(xhr, status, error) {}
    });
  }

  function WorkshopGetJobCode(date, location, callback) {
    // var selectedDate = $("#workshopdateboxinside").html();
    // var location = $("#workshoplocationname").attr("locationid");
    queryData = {
      token: $.session.Token,
      selectedDate: date,
      location: location
    };
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/getWorkshopJobCode/",
      data: JSON.stringify(queryData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          data = response.getWorkshopJobCodeResult;
          callback(data);
          // populateWorkCodes(null, data);
        } catch (e) {}
      },
      error: function(xhr, status, error) {}
    });
  }

  function WorkshopFilterList(data, callback) {
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/getWorkshopFilterListData/",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          data = response.getWorkshopFilterListDataResult;
          callback(data)
          // preFilterListDataSetup(null, data, overlapData);
        } catch (e) {
          console.log(e);
        }
      },
      error: function(xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      }
    });
  }

  function WorkshopClockIn(data, callback) {
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/GetWorkshopOverlaps/",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          //Returns ConsumerIds of people that already have a record
          res = response.GetWorkshopOverlapsResult;
          callback(res);
        } catch (e) {
          callback(e, null);
        }
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  function WorkshopClockOut(data, callback) {
    $.ajax({
      type: "POST",
      url:
        $.webServer.protocol +
        "://" +
        $.webServer.address +
        ":" +
        $.webServer.port +
        "/" +
        $.webServer.serviceName +
        "/GetWorkshopOverlaps/",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response, status, xhr) {
        try {
          res = response.GetWorkshopOverlapsResult;
          callback(res);
        } catch (e) {
          callback(e, null);
        }
      },
      error: function(xhr, status, error) {
        alert("Error\n-----\n" + xhr.status + "\n" + xhr.responseText);
      }
    });
  }

  return {
    clockoutWorkshopSingle,
    deleteWorkshopEntry,
    getWorkshopBatchById,
    getEnabledConsumersForWorkshop,
    updateWorkshopClockIn,
    updateWorkshopQuantity,
    WorkshopPreBatchLoad,
    WorkshopLocations,
    WorkshopGetSupervisors,
    WorkshopGetJobCode,
    WorkshopFilterList,
    WorkshopClockIn,
    WorkshopClockOut
  };
})();
