var incidentTrackingAjax = (function () {
  'use-strict';
  //Incident Save
  //Send incident notification
  function sendNotification(notificationType, employeeId, data) {
    // notificationType either Insert or Update
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
        '/sendITNotification/',
      data:
        '{"token":"' +
        $.session.Token +
        '","notificationType":"' +
        notificationType +
        '","employeeId":"' +
        employeeId +
        '","incidentTypeDesc":"' +
        data.incidentTypeDesc +
        '","incidentDate":"' +
        data.incidentDate +
        '","incidentTime":"' +
        data.incidentTime +
        '","subcategoryId":"' +
        data.subcategoryId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITInvolvementTypeDataResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Drop Downs Creation
  //Involvment Types
  function getInvolvementTypeData(callback) {
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
        '/getITInvolvementTypeData/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITInvolvementTypeDataResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Incident Categories
  function getIncidentCategories(callback) {
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
        '/getITIncidentCategories/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITIncidentCategoriesResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Locations Detail
  function getIncidentLocationDetail(callback) {
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
        '/getITIncidentLocationDetail/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITIncidentLocationDetailResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Service Locations
  function getConsumerServiceLocations(consumerId, callback) {
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
        '/getITConsumerServiceLocations/',
      data: '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITConsumerServiceLocationsResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Days back
  function updateIncidentTrackingDaysBack() {
    updatedReviewDays = $('#incidenttrackingdaysback').val();
    if (parseInt(updatedReviewDays) > parseInt('365')) {
      updatedReviewDays = 365;
      $('#incidenttrackingdaysback').val('365');
      alert('Days back must be 365 or less.');
    }
    $.session.defaultIncidentTrackingReviewDays = updatedReviewDays;
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
        '/updateIncidentTrackingDaysBack/',
      data: '{"token":"' + $.session.Token + '", "updatedReviewDays":"' + updatedReviewDays + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.updateIncidentTrackingDaysBackResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Get review table data
  function getITReviewTableData(retrieveData, callback) {
    //retrieveData is = token, userId, locationId, employeeId, subcategoryId, fromDate, toDate
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
        '/getITReviewTableData/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITReviewTableDataResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        // callback(error, null);
      },
    });
  }

  //Review page locations
  function getReviewPageLocations(callback) {
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
        '/getLocationsIncidentTrackingReviewPage/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getLocationsIncidentTrackingReviewPageResult;
        callback(res);
        //var allString = '<location><ID>000</ID><Name>All</Name><Residence>Y</Residence></location>';//this is to add the 'ALL' option
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  //Employees Involved Employee Dropdown
  function getEmployeesInvolvedEmployeeDropdown(callback) {
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
        '/getEmployeesInvolvedEmployeeDropdown/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getEmployeesInvolvedEmployeeDropdownResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  function getITReviewPageEmployeeListAndSubList(supervisorId, callback) {
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
        '/getITReviewPageEmployeeListAndSubList/',
      data: '{"token":"' + $.session.Token + '", "supervisorId":"' + supervisorId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response;
        callback(res);
      },
      error: function (xhr, status, error) {
        //callback(error, null);
      },
    });
  }

  function getIncidentEditReviewDataAllObjects(incidentId, callback) {
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
        '/getIncidentEditReviewDataAllObjects/',
      data: '{"token":"' + $.session.Token + '", "incidentId":"' + incidentId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getIncidentEditReviewDataAllObjectsResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //callback(error, null);
      },
    });
  }

  function deleteITIncident(incidentId) {
    // notificationType either Insert or Update
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
        '/deleteAnywhereITIncident/',
      data: '{"token":"' + $.session.Token + '","incidentId":"' + incidentId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getITInvolvementTypeDataResult;
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  function saveUpdateITIncident(incidentData, callback) {
    var notifyArr = incidentData.notifyEmployeeString.split('|');
    var employeeIdArr = incidentData.employeeIdString.split('|');
    var notificationType = incidentData.saveUpdate === 'Save' ? 'Insert' : 'Update';
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
        '/saveUpdateITIncident/',
      data: JSON.stringify(incidentData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITIncidentResult;
        successfulSave.show();
        setTimeout(function () {
          successfulSave.hide();
            for (let i = 0; i < notifyArr.length; i++) {
                if (notifyArr[i] === 'Y') {
                    sendNotification(notificationType, employeeIdArr[i], incidentData);
                }
            }
          //notifyArr.forEach((notify, index) => {
          //  if (notify === 'Y') {
          //    sendNotification(notificationType, employeeIdArr[index], incidentData);
          //  }
          //});
          if (callback) callback(res);
        }, 1000);
        //for loop' if notify emp is y call procedure with person id of employee with checked box
      },
      error: function (xhr, status, error) {
        //callback(error, null);
      },
    });
  }

  // consumer involved DROPDOWN data
  function getReviewedByDropdown(callback) {
    // notificationType either Insert or Update
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
        '/getReviewedByDropdown/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getReviewedByDropdownResult;
        callback(res);
      },
    });
  }
  function getInjuryLocationsDropdown(callback) {
    // notificationType either Insert or Update
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
        '/getInjuryLocationsDropdown/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getInjuryLocationsDropdownResult;
        callback(res);
      },
    });
  }
  function getInjuryTypesDropdown(callback) {
    // notificationType either Insert or Update
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
        '/getInjuryTypesDropdown/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getInjuryTypesDropdownResult;
        callback(res);
      },
    });
  }
  function getitConsumerFollowUpTypes(callback) {
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
        '/getitConsumerFollowUpTypes/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerFollowUpTypesResult;
        callback(res);
      },
    });
  }
  //TODO: ash - c# and SQL
  //TODO: ash - itBehaviorTypeId, behaviorTypeName
  function getitConsumerBehaviorTypes(callback) {
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
        '/getitConsumerBehaviorTypes/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerBehaviorTypesResult;
        callback(res);
      },
    });
  }
  function getitReportingCategories(callback) {
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
        '/getitReportingCategories/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitReportingCategoriesResult;
        callback(res);
      },
    });
  }
  function getInterventionTypesDropdown(callback) {
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
        '/getInterventionTypesDropdown/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getInterventionTypesDropdownResult;
        callback(res);
      },
    });
  }
  // consumer involved REVIEW data
  function getitConsumerInterventions(consumerId, incidentId, callback) {
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
        '/getitConsumerInterventions/',
      data:
        '{"token":"' +
        $.session.Token +
        '","consumerId":"' +
        consumerId +
        '","incidentId":"' +
        incidentId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerInterventionsResult;
        callback(res);
      },
    });
  }
  function getitConsumerInjuries(consumerId, incidentId, callback) {
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
        '/getitConsumerInjuries/',
      data:
        '{"token":"' +
        $.session.Token +
        '","consumerId":"' +
        consumerId +
        '","incidentId":"' +
        incidentId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerInjuriesResult;
        callback(res);
      },
    });
  }
  function getitConsumerReviews(consumerId, incidentId, callback) {
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
        '/getitConsumerReviews/',
      data:
        '{"token":"' +
        $.session.Token +
        '","consumerId":"' +
        consumerId +
        '","incidentId":"' +
        incidentId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerReviewsResult;
        callback(res);
      },
    });
  }
  function getitConsumerFollowUps(consumerId, incidentId, callback) {
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
        '/getitConsumerFollowUps/',
      data:
        '{"token":"' +
        $.session.Token +
        '","consumerId":"' +
        consumerId +
        '","incidentId":"' +
        incidentId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerFollowUpsResult;
        callback(res);
      },
    });
  }
  function getitConsumerReporting(consumerId, incidentId, callback) {
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
        '/getitConsumerReporting/',
      data:
        '{"token":"' +
        $.session.Token +
        '","consumerId":"' +
        consumerId +
        '","incidentId":"' +
        incidentId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerReportingResult;
        callback(res);
      },
    });
  }
  function getitConsumerBehavior(consumerId, incidentId, callback) {
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
        '/getitConsumerBehavior/',
      data:
        '{"token":"' +
        $.session.Token +
        '","consumerId":"' +
        consumerId +
        '","incidentId":"' +
        incidentId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getitConsumerBehaviorResult;
        callback(res);
      },
    });
  }

  //Consumer Folow Ups Specific Alters
  function itDeleteConsumerFollowUp(itConsumerFollowUpId, callback) {
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
        '/itDeleteConsumerFollowUp/',
      data:
        '{"token":"' + $.session.Token + '","itConsumerFollowUpId":"' + itConsumerFollowUpId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.itDeleteConsumerFollowUpResult;
        callback(res);
      },
    });
  }
  function saveUpdateITConsumerFollowUp(data, callback) {
    // data = {
    // 	token: $.session.Token,
    // 	consumerInvolvedId: '',
    // 	consumerFollowUpIdArray: [],
    // 	followUpTypeIdArray: [],
    // 	personResponsibleArray: [],
    // 	dueDateArray: [],
    // 	completedDateArray: [],
    // 	notesArray: [],
    // };
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
        '/saveUpdateITConsumerFollowUp/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITConsumerFollowUpResult;
        if (callback) callback(res);
      },
    });
  }
  //Consumer Injury Alters
  function saveUpdateITConsumerInjuries(data, callback) {
    // data = {
    // 	token: $.session.Token,
    //  itConsumerInvolvedId: '',
    //  itConsumerInjuryIdArray: [],
    // 	checkedByNurseArray: [],
    // 	checkedDateArray: [],
    // 	detailsArray: [],
    // 	itInjuryLocationIdArray: [],
    // 	itInjuryTypeIdArray: [],
    // 	treatmentArray: [],
    // };
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
        '/saveUpdateITConsumerInjuries/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITConsumerInjuriesResult;
        if (callback) callback(res);
      },
    });
  }
  function itDeleteConsumerInjuries(itConsumerInjuryId, callback) {
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
        '/itDeleteConsumerInjuries/',
      data: '{"token":"' + $.session.Token + '","itConsumerInjuryId":"' + itConsumerInjuryId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.itDeleteConsumerInjuriesResult;
        callback(res);
      },
    });
  }
  //Consumer Intervention Alters
  function itDeleteConsumerInterventions(itConsumerInterventionId, callback) {
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
        '/itDeleteConsumerInterventions/',
      data:
        '{"token":"' +
        $.session.Token +
        '","itConsumerInterventionId":"' +
        itConsumerInterventionId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.itDeleteConsumerInterventionsResult;
        callback(res);
      },
    });
  }
  function saveUpdateITConsumerInterventions(data, callback) {
    // data = {
    // 	token: $.session.Token,
    // 	itConsumerInvolvedId: '',
    // 	itConsumerInterventionIdArray: [],
    // 	aversiveArray: [],
    //  itConsumerInterventionTypeIdArray: [],
    //  notesArray: [],
    // 	startTimeArray: [],
    // 	stopTimeArray: [],
    // 	timeLengthArray: [],
    // };
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
        '/saveUpdateITConsumerInterventions/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITConsumerInterventionsResult;
        if (callback) callback(res);
      },
    });
  }
  //Consumer Reporting Alters
  function itDeleteConsumerReporting(itConsumerReportingId, callback) {
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
        '/itDeleteConsumerReporting/',
      data:
        '{"token":"' +
        $.session.Token +
        '","itConsumerReportingId":"' +
        itConsumerReportingId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.itDeleteConsumerReportingResult;
        callback(res);
      },
    });
  }
  function saveUpdateITConsumerReporting(data, callback) {
    // data = {
    // 	token: $.session.Token,
    // 	consumerInvolvedId: '',
    // 	consumerReportIdArray: [],
    // 	reportDateArray: [],
    //  reportTimeArray: [],
    //  reportingCategoryIdArray: [],
    //  reportToArray: [],
    //  reportByArray: [],
    //  reportMethodArray: [],
    // 	notesArray: [],
    // };
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
        '/saveUpdateITConsumerReporting/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITConsumerReportingResult;
        if (callback) callback(res);
      },
    });
  }
  //Consumer Review Alters
  function itDeleteConsumerReviews(itConsumerReviewId, callback) {
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
        '/itDeleteConsumerReviews/',
      data: '{"token":"' + $.session.Token + '","itConsumerReviewId":"' + itConsumerReviewId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.itDeleteConsumerReviewsResult;
        callback(res);
      },
    });
  }
  function saveUpdateITConsumerReviews(data, callback) {
    // data = {
    // 	token: $.session.Token,
    // 	consumerInvolvedId: '',
    // 	itConsumerReviewIdArray: [],
    // 	reviewedByArray: [],
    //  reviewedDateArray: [],
    //  noteArray: [],
    // };
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
        '/saveUpdateITConsumerReviews/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITConsumerReviewsResult;
        if (callback) callback(res);
      },
    });
  }
  //Consumer Behavior Alters
  function itDeleteConsumerBehavior(itConsumerBehaviorId, callback) {
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
        '/itDeleteConsumerBehaviors/',
      data:
        '{"token":"' + $.session.Token + '","itConsumerBehaviorId":"' + itConsumerBehaviorId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.itDeleteConsumerBehaviorsResult;
        callback(res);
      },
    });
  }
  function saveUpdateITConsumerBehaviors(data, callback) {
    // data = {
    // 	token: $.session.Token,
    // 	consumerInvolvedId: '',
    // 	itConsumerBehaviorIdArray: [],
    // 	startTimeArray: [],
    //  endTimeArray: [],
    //  occurrencesArray: [],
    // };
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
        '/saveUpdateITConsumerBehaviors/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.saveUpdateITConsumerBehaviorsResult;
        if (callback) callback(res);
      },
    });
  }

  // User Incident View Tracking
  async function updateIncidentViewByUser(retrieveData) {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateIncidentViewByUser/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
    } catch (error) {
      console.log(error.responseText);
    }
  }

  // Generate Incident Tracking Report
  function generateIncidentTrackingReport(incidentId, callback) {
    data = {
      token: $.session.Token,
      incidentId: incidentId
    };
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
        '/generateIncidentTrackingReport/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.generateIncidentTrackingReportResult;
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  function checkIfITReportExists(res, callback) {
    data = {
      token: $.session.Token,
      reportScheduleId: res[0].reportScheduleId,
    };
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
        '/checkIfITReportExists/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.checkIfITReportExistsResult;
        callback(res, data.reportScheduleId);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  // Send the report to designated emails
  function sendIncidentTrackingReport(reportScheduleId, incidentTrackingEmailReportData) {
    data = {
      token: $.session.Token,
      reportScheduleId: reportScheduleId,
      toAddresses: incidentTrackingEmailReportData.toAddresses,
      ccAddresses: incidentTrackingEmailReportData.ccAddresses,
      bccAddresses: incidentTrackingEmailReportData.bccAddresses,
      emailSubject: incidentTrackingEmailReportData.emailSubject,
      emailBody: incidentTrackingEmailReportData.emailBody
    };
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
        '/sendIncidentTrackingReport/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.sendIncidentTrackingReportResult;
        //callback(res, data.reportScheduleId);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }

  return {
    sendNotification,
    getInvolvementTypeData,
    getIncidentCategories,
    getIncidentLocationDetail,
    getConsumerServiceLocations,
    updateIncidentTrackingDaysBack,
    getITReviewTableData,
    getReviewPageLocations,
    getEmployeesInvolvedEmployeeDropdown,
    getITReviewPageEmployeeListAndSubList,
    getIncidentEditReviewDataAllObjects,
    deleteITIncident,
    saveUpdateITIncident,
    getReviewedByDropdown,
    getInjuryLocationsDropdown,
    getInjuryTypesDropdown,
    getitConsumerInterventions,
    getitConsumerInjuries,
    getitConsumerReviews,
    getitConsumerFollowUps,
    getitConsumerReporting,
    getitConsumerBehavior,
    getitConsumerFollowUpTypes,
    getitConsumerBehaviorTypes,
    getitReportingCategories,
    getInterventionTypesDropdown,
    itDeleteConsumerFollowUp,
    saveUpdateITConsumerFollowUp,
    itDeleteConsumerReporting,
    saveUpdateITConsumerReporting,
    itDeleteConsumerReviews,
    saveUpdateITConsumerReviews,
    itDeleteConsumerInjuries,
    itDeleteConsumerInterventions,
    saveUpdateITConsumerInjuries,
    saveUpdateITConsumerInterventions,
    itDeleteConsumerBehavior,
    saveUpdateITConsumerBehaviors,
    updateIncidentViewByUser,
    generateIncidentTrackingReport,
    checkIfITReportExists,
    sendIncidentTrackingReport
  };
})();
