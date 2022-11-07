var schedulingAjax = (function () {
  function getLocationDropdownForSchedulingAjax(cb) {
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getLocationDropdownForScheduling/",
          data: '{"token":"' + $.session.Token + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.getLocationDropdownForSchedulingResult;                
              cb(res);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  //When using this call:
  //Pass a '%' for the personId and the locationId from the dropdown to get all schedules for a location
  //Pass a '%' for the locationId and the users personId to get all of that pesons schedules
  function getSchedulesForSchedulingModuleAjax(locationId, personId, cb) {
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getSchedulesForSchedulingModule/",
          data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "personId":"' + personId + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
            var res = response.getSchedulesForSchedulingModuleResult;
            cb(res, locationId);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function requestDaysOffSchedulingAjax(insertData) {
      //insertData must include token, personId, dates, fromTime, toTime, reason, employeeNotifiedId, status
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/requestDaysOffScheduling/",
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.requestDaysOffSchedulingResult;
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function getCallOffDropdownReasonsAjax(cb) {
      //insertData must include token, toPersonId, reasonId, notification
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getCallOffDropdownReasons/",
          data: '{"token":"' + $.session.Token + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.getCallOffDropdownReasonsResult;
              cb(res);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

    function getCallOffDropdownEmployeesAjax(shiftDate, locationId, cb) {
      //insertData must include token, locationId
      shiftDate = UTIL.formatDateToIso(shiftDate);
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getCallOffDropdownEmployees/",
          data: '{"token":"' + $.session.Token + '","shiftDate":"' + shiftDate + '","locationId":"' + locationId+ '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.getCallOffDropdownEmployeesResult;
              cb(res);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
    }

    function getRequestTimeOffDropdownEmployees(cb) {
        //insertData must include token
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getRequestTimeOffDropdownEmployees/",
            data: '{"token":"' + $.session.Token + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = response.getRequestTimeOffDropdownEmployeesResult;
                cb(res);
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            }
        });
    }

  function saveSchedulingCallOffRequestAjax(insertData) {
      //insertData must include token, shiftId, personId, reasonId, note, status, notifiedEmployeeId
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/saveSchedulingCallOffRequest/",
          //data: '{"token":"' + $.session.Token + '"}',
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.saveSchedulingCallOffRequestResult;
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function getDayOfWeekScheduleAjax(cb) {
      //insertData must include token, shiftId, personId, reasonId, note, status, notifiedEmployeeId
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getDayOfWeekSchedule/",
          data: '{"token":"' + $.session.Token + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.getDayOfWeekScheduleResult;
              cb(res);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function getScheduleApptInformationAjax(locationId, cb) {//Added locationId from dropdown on all schedule view
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getScheduleApptInformation/",
          data: '{"token":"' + $.session.Token + '","locationId":"' + locationId + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.getScheduleApptInformationResult;
              cb(res);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function saveOpenShiftRequestSchedulingAjax(insertData) {//token, shiftId, personId, status, notifiedEmployeeId)
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/saveOpenShiftRequestScheduling/",
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.saveOpenShiftRequestSchedulingResult;
              //cb(res, schedules);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  async function getOverlapStatusforSelectedShiftAjax(shiftId, personId) {
    try {
        const result = await $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getOverlapStatusforSelectedShift/",
          data: '{"token":"' + $.session.Token + '","shiftId":"' + shiftId + '","personId":"' + personId + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
        });
        return result;
    } catch (error) {
        throw new Error(error.responseText);
    }
}

async function getOverlapDataforSelectedShiftAjax(shiftId, personId) {
    try {
        const result = await $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getOverlapDataforSelectedShift/",
              data: '{"token":"' + $.session.Token + '","shiftId":"' + shiftId + '","personId":"' + personId + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
        });
        return result;
    } catch (error) {
        throw new Error(error.responseText);
    }
}

  function cancelRequestOpenShiftSchedulingAjax(requestShiftId) {//token, requestShiftId)
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/cancelRequestOpenShiftScheduling/",
          data: '{"token":"' + $.session.Token + '","requestShiftId":"' + requestShiftId + '"}',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.cancelRequestOpenShiftSchedulingResult;
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function approveDenyOpenShiftRequestSchedulingAjax(insertData) {//token, requestedShiftId, decision)
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/approveDenyOpenShiftRequestScheduling/",
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.approveDenyOpenShiftRequestSchedulingResult;
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function approveDenyCallOffRequestSchedulingAjax(insertData) {//token, callOffShiftId, decision)
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/approveDenyCallOffRequestScheduling/",
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.approveDenyCallOffRequestSchedulingResult;
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function approveDenyDaysOffRequestSchedulingAjax(insertData) {//token, daysOffIdString(comma separated), decision)
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/approveDenyDaysOffRequestScheduling/",
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.approveDenyDaysOffRequestSchedulingResult;
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  function getScheduleMyApprovalDataAjax(insertData, cb) {//token, personId
      $.ajax({
          type: "POST",
          url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
              "/" + $.webServer.serviceName + "/getScheduleMyApprovalData/",
          data: JSON.stringify(insertData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response, status, xhr) {
              var res = response.getScheduleMyApprovalDataResult;
              cb(res);
          },
          error: function (xhr, status, error) {
              //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
          }
      });
  }

  return {
      getSchedulesForSchedulingModuleAjax: getSchedulesForSchedulingModuleAjax,
      getLocationDropdownForSchedulingAjax: getLocationDropdownForSchedulingAjax,
      requestDaysOffSchedulingAjax: requestDaysOffSchedulingAjax,
      getCallOffDropdownReasonsAjax: getCallOffDropdownReasonsAjax,
      getCallOffDropdownEmployeesAjax: getCallOffDropdownEmployeesAjax,
      saveSchedulingCallOffRequestAjax: saveSchedulingCallOffRequestAjax,
      getDayOfWeekScheduleAjax: getDayOfWeekScheduleAjax,
      getScheduleApptInformationAjax: getScheduleApptInformationAjax,
      cancelRequestOpenShiftSchedulingAjax: cancelRequestOpenShiftSchedulingAjax,
      saveOpenShiftRequestSchedulingAjax: saveOpenShiftRequestSchedulingAjax,
      getOverlapStatusforSelectedShiftAjax: getOverlapStatusforSelectedShiftAjax,
      getOverlapDataforSelectedShiftAjax: getOverlapDataforSelectedShiftAjax,
      approveDenyOpenShiftRequestSchedulingAjax: approveDenyOpenShiftRequestSchedulingAjax,
      approveDenyCallOffRequestSchedulingAjax: approveDenyCallOffRequestSchedulingAjax,
      approveDenyDaysOffRequestSchedulingAjax: approveDenyDaysOffRequestSchedulingAjax,
      getScheduleMyApprovalDataAjax: getScheduleMyApprovalDataAjax,
      getRequestTimeOffDropdownEmployees: getRequestTimeOffDropdownEmployees
  };

})();