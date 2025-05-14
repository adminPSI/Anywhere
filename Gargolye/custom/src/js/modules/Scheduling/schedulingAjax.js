const schedulingAjax = (function () {
  async function getSchedulesForSchedulingModuleNew(locationId, personId) {
    //When using this call:
    //Pass a '%' for the personId and the locationId from the dropdown to get all schedules for a location
    //Pass a '%' for the locationId and the users personId to get all of that persons schedules
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getSchedulesForSchedulingModuleNew/',
        data: JSON.stringify({
          token: $.session.Token,
          locationId: locationId,
          personId: personId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result.getSchedulesForSchedulingModuleNewResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getScheduleApptInformationNew(locationId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getScheduleApptInformationNew/',
        data: JSON.stringify({
          token: $.session.Token,
          locationId: locationId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getScheduleApptInformationNewResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getLocationDropdownForSchedulingNew(openShiftYes) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getLocationDropdownForSchedulingNew/',
        data: JSON.stringify({
          token: $.session.Token,
          showOpenShifts: openShiftYes,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getLocationDropdownForSchedulingNewResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getDayOfWeekScheduleAjaxNew() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getDayOfWeekSchedule/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getDayOfWeekScheduleResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function saveOrUpdateShift(retrieveData) {
    // date: '01/01/2015, 01/02/2025'
    // consumerId: '123, 123, 123'
    // startTime
    // endTime
    // locationId
    // employeeId
    // notifyEmployee
    // color
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/saveOrUpdateShift/',
        data: JSON.stringify({
          token: $.session.Token,
          ...retrieveData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.saveOrUpdateShiftResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function saveOrUpdateAppointment(retrieveData) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/saveOrUpdateAppointment/',
        data: JSON.stringify({
          token: $.session.Token,
          ...retrieveData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.saveOrUpdateAppointmentResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getSchedulesForSchedulingModule(locationId, personId) {
    //When using this call:
    //Pass a '%' for the personId and the locationId from the dropdown to get all schedules for a location
    //Pass a '%' for the locationId and the users personId to get all of that persons schedules
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getSchedulesForSchedulingModule/',
        data: JSON.stringify({
          token: $.session.Token,
          locationId: locationId,
          personId: personId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result.getSchedulesForSchedulingModuleResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getScheduleApptInformation(locationId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getScheduleApptInformation/',
        data: JSON.stringify({
          token: $.session.Token,
          locationId: locationId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getScheduleApptInformationResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getFilteredEmployeesForScheduling(retrieveData) {
    // locationId: '0', // '0' for null '%' for all
    // includeTrainedOnly: 0,
    // region: 'ALL', // '0' for null '%' for all
    // maxWeeklyHours: -1, // -1 for null
    // shiftStartTime: '00:00:00',
    // shiftEndTime: '00:00:00',
    // minTimeBetweenShifts: -1, // -1 for null
    const data = { ...retrieveData };

    if (!data.locationId) {
      data.includeTrainedOnly = 0;
    }
    if (data.shiftdate.length === 0) {
      data.includeOverlaps = 0;
      data.maxWeeklyHours = -1;
      data.minTimeBetweenShifts = -1;
    } else {
      data.shiftdate = data.shiftdate.map(date => dates.formatISO(new Date(date))).join(',');
    }

    delete data.filterHours;
    delete data.filterMinutes;
    delete data.filterRegion;

    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getEmployeeDropdown/',
        data: JSON.stringify({
          token: $.session.Token,
          ...data,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getEmployeeDropdownResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getEmployeesForScheduling(userId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getAllEmployees/',
        data: JSON.stringify({
          token: $.session.Token,
          userId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getAllEmployeesResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getRegionDropdown() {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getSchedulingRegions/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getSchedulingRegionsResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function publishUnpublishSchedules(retrieveData, pubOrUnpub) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/publishShift/',
        data: JSON.stringify({
          token: $.session.Token,
          publish: pubOrUnpub,
          ...retrieveData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.publishShiftResult;
    } catch (error) {
      return error;
    }
  }
  async function requestDaysOffSchedulingAjax(insertData) {
    //insertData must include token, personId, dates, fromTime, toTime, reason, employeeNotifiedId, status
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/requestDaysOffScheduling/',
        data: JSON.stringify(insertData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  function getCallOffDropdownReasonsAjax(cb) {
    //insertData must include token, toPersonId, reasonId, notification
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
        '/getCallOffDropdownReasons/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCallOffDropdownReasonsResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getCallOffDropdownEmployeesAjax(shiftDate, locationId, cb) {
    //insertData must include token, locationId
    shiftDate = UTIL.formatDateToIso(shiftDate);
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
        '/getCallOffDropdownEmployees/',
      data: '{"token":"' + $.session.Token + '","shiftDate":"' + shiftDate + '","locationId":"' + locationId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getCallOffDropdownEmployeesResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getRequestTimeOffDropdownEmployees(cb) {
    //insertData must include token
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
        '/getRequestTimeOffDropdownEmployees/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getRequestTimeOffDropdownEmployeesResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function saveSchedulingCallOffRequestAjax(insertData) {
    //insertData must include token, shiftId, personId, reasonId, note, status, notifiedEmployeeId
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
        '/saveSchedulingCallOffRequest/',
      //data: '{"token":"' + $.session.Token + '"}',
      data: JSON.stringify(insertData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveSchedulingCallOffRequestResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getDayOfWeekScheduleAjax(cb) {
    //insertData must include token, shiftId, personId, reasonId, note, status, notifiedEmployeeId
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
        '/getDayOfWeekSchedule/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getDayOfWeekScheduleResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function saveOpenShiftRequestSchedulingAjax(insertData) {
    //token, shiftId, personId, status, notifiedEmployeeId)
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
        '/saveOpenShiftRequestScheduling/',
      data: JSON.stringify(insertData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveOpenShiftRequestSchedulingResult;
        //cb(res, schedules);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  async function getOverlapStatusforSelectedShiftAjax(shiftId, personId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getOverlapStatusforSelectedShift/',
        data: '{"token":"' + $.session.Token + '","shiftId":"' + shiftId + '","personId":"' + personId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getOverlapDataforSelectedShiftAjax(shiftId, personId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getOverlapDataforSelectedShift/',
        data: '{"token":"' + $.session.Token + '","shiftId":"' + shiftId + '","personId":"' + personId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  function cancelRequestOpenShiftSchedulingAjax(requestShiftId) {
    //token, requestShiftId)
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
        '/cancelRequestOpenShiftScheduling/',
      data: '{"token":"' + $.session.Token + '","requestShiftId":"' + requestShiftId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.cancelRequestOpenShiftSchedulingResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function approveDenyOpenShiftRequestSchedulingAjax(insertData) {
    //token, requestedShiftId, decision)
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
        '/approveDenyOpenShiftRequestScheduling/',
      data: JSON.stringify(insertData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.approveDenyOpenShiftRequestSchedulingResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function approveDenyCallOffRequestSchedulingAjax(insertData) {
    //token, callOffShiftId, decision)
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
        '/approveDenyCallOffRequestScheduling/',
      data: JSON.stringify(insertData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.approveDenyCallOffRequestSchedulingResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  async function approveDenyDaysOffRequestSchedulingAjax(insertData) {
    //token, daysOffIdString(comma separated), decision, dateTime)
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/approveDenyDaysOffRequestScheduling/',
        data: JSON.stringify(insertData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.approveDenyDaysOffRequestSchedulingResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  function getScheduleMyApprovalDataAjax(insertData, cb) {
    //token, personId
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
        '/getScheduleMyApprovalData/',
      data: JSON.stringify(insertData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getScheduleMyApprovalDataResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  return {
    getSchedulesForSchedulingModuleNew,
    getScheduleApptInformationNew,
    getLocationDropdownForSchedulingNew,
    getDayOfWeekScheduleAjaxNew,
    //
    saveOrUpdateShift,
    saveOrUpdateAppointment,
    getSchedulesForSchedulingModule,
    getScheduleApptInformation,
    getEmployeesForScheduling,
    getFilteredEmployeesForScheduling,
    getRegionDropdown,
    publishUnpublishSchedules,
    //
    requestDaysOffSchedulingAjax,
    getCallOffDropdownReasonsAjax,
    getCallOffDropdownEmployeesAjax,
    saveSchedulingCallOffRequestAjax,
    getDayOfWeekScheduleAjax,
    cancelRequestOpenShiftSchedulingAjax,
    saveOpenShiftRequestSchedulingAjax,
    getOverlapStatusforSelectedShiftAjax,
    getOverlapDataforSelectedShiftAjax,
    approveDenyOpenShiftRequestSchedulingAjax,
    approveDenyCallOffRequestSchedulingAjax,
    approveDenyDaysOffRequestSchedulingAjax,
    getScheduleMyApprovalDataAjax,
    getRequestTimeOffDropdownEmployees,
    //OLD
    getLocationDropdownForSchedulingAjaxOLD,
    getSchedulesForSchedulingModuleAjaxOLD,
    getScheduleApptInformationAjaxOLD,
  };

  //OLD
  function getLocationDropdownForSchedulingAjaxOLD(cb) {
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
        '/getLocationDropdownForScheduling/',
      data: JSON.stringify({
        token: $.session.Token,
        showOpenShifts: 'N',
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getLocationDropdownForSchedulingResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getSchedulesForSchedulingModuleAjaxOLD(locationId, personId, cb) {
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
        '/getSchedulesForSchedulingModule/',
      data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "personId":"' + personId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getSchedulesForSchedulingModuleResult;
        cb(res, locationId);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getScheduleApptInformationAjaxOLD(locationId, cb) {
    //Added locationId from dropdown on all schedule view
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
        '/getScheduleApptInformation/',
      data: '{"token":"' + $.session.Token + '","locationId":"' + locationId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getScheduleApptInformationResult;
        cb(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  return {
    getSchedulesForSchedulingModuleAjax: getSchedulesForSchedulingModuleAjax,
    getLocationDropdownForSchedulingAjax: getLocationDropdownForSchedulingAjax,
    getScheduleApptInformationAjax: getScheduleApptInformationAjax,
    getEmployeesForSchedulingAjax: getEmployeesForSchedulingAjax,
    getRegionDropdownAjax: getRegionDropdownAjax,
    requestDaysOffSchedulingAjax: requestDaysOffSchedulingAjax,
    getCallOffDropdownReasonsAjax: getCallOffDropdownReasonsAjax,
    getCallOffDropdownEmployeesAjax: getCallOffDropdownEmployeesAjax,
    saveSchedulingCallOffRequestAjax: saveSchedulingCallOffRequestAjax,
    getDayOfWeekScheduleAjax: getDayOfWeekScheduleAjax,
    cancelRequestOpenShiftSchedulingAjax: cancelRequestOpenShiftSchedulingAjax,
    saveOpenShiftRequestSchedulingAjax: saveOpenShiftRequestSchedulingAjax,
    getOverlapStatusforSelectedShiftAjax: getOverlapStatusforSelectedShiftAjax,
    getOverlapDataforSelectedShiftAjax: getOverlapDataforSelectedShiftAjax,
    approveDenyOpenShiftRequestSchedulingAjax: approveDenyOpenShiftRequestSchedulingAjax,
    approveDenyCallOffRequestSchedulingAjax: approveDenyCallOffRequestSchedulingAjax,
    approveDenyDaysOffRequestSchedulingAjax: approveDenyDaysOffRequestSchedulingAjax,
    getScheduleMyApprovalDataAjax: getScheduleMyApprovalDataAjax,
    getRequestTimeOffDropdownEmployees: getRequestTimeOffDropdownEmployees,
  };
})();
