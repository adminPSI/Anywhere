const dayServiceAjax = (function () {
  function checkConsumersForDate(locationId, consumerList, serviceDate, callback) {
    //CONSUMER LIST = "id|id|id|id" or "id|"
    //massUserCheckByDate
    // var consumerIds = '';

    // // For every consumer that is "active":
    // $('#consumerlist')
    // 	.children()
    // 	.each(function() {
    // 		// Add the consumer day service record for update:
    // 		consumerId = $(this).attr('id');
    // 		consumerIds = consumerIds + consumerId + '|';
    // 	});

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
        '/massUserCheckByDateJSON/',
      data:
        '{"consumerIds":"' +
        consumerList +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationId":"' +
        locationId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        // var res = JSON.stringify(response);
        var res = response.massUserCheckByDateJSONResult;
        callback(res);
      },
    });
  }
  function getDayServiceGetEnabledConsumers(serviceDate, locationId, callback) {
    //* serviceDate, locationId & groupId are set by filter
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
        '/getDayServiceGetEnabledConsumers/',
      data: '{"serviceDate":"' + serviceDate + '", "locationId":"' + locationId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        // var res = JSON.stringify(response);
        var res = response.getDayServiceGetEnabledConsumersResult;
        callback(res);
      },
    });
  }
  function dayServiceClockIn(consumerIds, serviceDate, locationId, startTime, callback) {
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
        '/addDayServiceActivityMassClockInConsumer/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "consumerIds":"' +
        consumerIds +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationId":"' +
        locationId +
        '", "startTime":"' +
        startTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
        return;
        errorMessage = '';
        var errorId;
        var errorConsumerIds;

        $('dayrow', res).each(function () {
          // Look for errors:
          $('errors', res).each(function () {
            // Get the error code:
            tmpErrorCode = $('error_code', this).text();
            // If time overlaps:
            if (tmpErrorCode == '615') {
              // Set the error message:
              errorMessage = ' Time overlaps found, with people exsiting in the database';
              setErrorBox(errorMessage);
              // Get the consumer IDs:
              errorConsumerIds = $('consumers', this).text();
            }
          });
        });

        //alert('success: ' + res);

        // After clockin, refresh data
        if (errorConsumerIds != null) {
          getConsumerDayServiceActivity(errorConsumerIds);
        } else {
          getConsumerDayServiceActivity();
        }
      },

      //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
  }
  function dayServiceClockOut(consumerIds, stopTime) {
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
        '/addDayServiceActivityMassClockOutConsumer/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "consumerIds":"' +
        consumerIds +
        '", "serviceDate":"' +
        $('#dsdatebox').val() +
        '", "locationId":"' +
        $('#dslocationbox').attr('locid') +
        '", "stopTime":"' +
        stopTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        //alert('success: ' + res);

        //<error><error_code>615</error_code><consumers>156|156|</consumers></error>
        errorMessage = '';

        $('dayrow', res).each(function () {
          // Look for errors:
          $('errors', res).each(function () {
            // Get the error code:
            tmpErrorCode = $('error_code', this).text();
            // If time overlaps:
            if (tmpErrorCode == '615') {
              // Set the error message:
              errorMessage = ' Time overlaps found, with people exsiting in the database';
              setErrorBox(errorMessage);
              // Get the consumer IDs:
              errorConsumerIds = $('consumers', this).text();
            }
          });
        });

        // After clockout, refresh data
        getConsumerDayServiceActivity();
      },

      //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
  }
  function deleteDayServiceActivity(consumerIds, serviceDate, locationID, callback) {
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
        '/deleteDayServiceMassDeleteConsumerActivity/',
      data:
        '{"consumerIds":"' +
        consumerIds +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationID":"' +
        locationID +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);

        // After delete, refresh data
        // getConsumerDayServiceActivity();
      },

      //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); }
    });
  }
  function deleteCIStaffId(consumerId, startTime, serviceDate, locationID, callback) {
    // startTime = convertTimeToMilitary(startTime);
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
        '/deleteCIStaffId/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationID":"' +
        locationID +
        '", "consumerId":"' +
        consumerId +
        '", "startTime":"' +
        startTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback();
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getDateToCheckShowCI(callback) {
    //Done
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
        '/getDateToCheckShowCI/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.parse(response.getDateToCheckShowCIResult);
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getExistingCIStaffId(consumerId, startTime, resIn, ciButtonId, isBatched) {
    startTime = convertTimeToMilitary(startTime);
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
        '/getExistingCIStaffId/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceDate":"' +
        $('#dsdatebox').val() +
        '", "locationID":"' +
        $('#dslocationbox').attr('locid') +
        '", "consumerId":"' +
        consumerId +
        '", "startTime":"' +
        startTime +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        staffId = getExistingCIStaffIDFromResponse(res);
        createCIDropdown(resIn, staffId, consumerId, startTime, ciButtonId, isBatched);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getDayServiceLocations(serviceDate, callback) {
    //Done
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
        '/getDayServiceLocationsJSON/',
      data: '{"token":"' + $.session.Token + '", "serviceDate":"' + serviceDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        //var res = JSON.stringify(response);
        var res = response.getDayServiceLocationsJSONResult;
        //always check for errors before processing
        //if (checkforErrors(res) == -1){
        //    return;
        //};
        callback(res);
        return;
        var optionsHtml = [];
        var locations = $('#dslocationpop');
        var first = 0;
        var showSelect = 'Y';

        $('location', res).each(function () {
          tmpName = $('name', this).text();
          tmpId = $('locationId', this).text();
          tmpId2 = $('ID', this).text();
          tmpRes = $('Residence', this).text();

          if (tmpRes == 'Y') {
            icon = "<img class='houseIcon' src='./images/new-icons/icon_house.png' />";
          } else {
            icon = "<img class='buildingIcon' src='./images/new-icons/icon_building.png' />";
          }

          if (tmpId == '') {
            tmpId = tmpId2;
          }

          // If more than 1 location for the selected consumers:
          if (serviceLocationCount > 1) {
            // Populate the day services location box with all the locations and a link to the changeTheDSLocation function in dayservices.js:
            optionsHtml.push(
              "<a href='#' class='loclink' locid='" +
                tmpId +
                "' residence='" +
                tmpRes +
                "' onClick='changeTheDSLocation(" +
                tmpId +
                ")'>" +
                icon +
                ' ' +
                tmpName +
                '</a>',
            );
          } else {
            // If only 1 location for the selected consumers and the location id is the same as the selected location:
            if (serviceLocationCount == 1 && locationIds[0] == currentlocationId) {
              // If the location id = the selected location:
              if (tmpId == currentlocationId) {
                currentlocationId = tmpId;

                // Display the location name:
                $('#dslocationbox').html(
                  tmpName +
                    "<dslocationdownarrow id='dslocationdownarrow' class='locationdownarrow dropdownarrow' onClick='popDSLocation(event)'></dslocationdownarrow>",
                );
                $('#dslocationbox').attr('locid', tmpId);
                resizeHeaderText('#dslocationbox', tmpName.length);
                showSelect = 'N';
              } else {
                // Populate the day services location box with all the locations and a link to the changeTheDSLocation function in dayservices.js:
                optionsHtml.push(
                  "<a href='#' class='loclink' locid='" +
                    tmpId +
                    "' residence='" +
                    tmpRes +
                    "' onClick='changeTheDSLocation(" +
                    tmpId +
                    ")'>" +
                    icon +
                    ' ' +
                    tmpName +
                    '</a>',
                );
              }
            } else {
              // Populate the day services location box with all the locations and a link to the changeTheDSLocation function in dayservices.js:
              optionsHtml.push(
                "<a href='#' class='loclink' locid='" +
                  tmpId +
                  "' residence='" +
                  tmpRes +
                  "' onClick='changeTheDSLocation(" +
                  tmpId +
                  ")'>" +
                  icon +
                  ' ' +
                  tmpName +
                  '</a>',
              );
            }
          }
        });

        // If more than 1 location for the selected consumers:
        if (showSelect == 'Y') {
          // Display "Select a Location":
          $('#dslocationbox').html(
            'Select a Location' +
              "<dslocationdownarrow id='dslocationdownarrow' class='locationdownarrow dropdownarrow' onClick='popDSLocation(event)'></dslocationdownarrow>",
          );
          $('#dslocationbox').attr('locid', 0);
          resizeHeaderText('#dslocationbox', 15);
          currentlocationId = 0;
        }

        optionsHtml = optionsHtml.join('');
        locations.html(optionsHtml);

        //if true gets history value for switching between modules but not reloading page
        if ($.session.dsLocationHistoryFlag == true && $.session.dsLocationHistoryValue != null) {
          changeTheDSLocation($.session.dsLocationHistoryValue);
        } else {
          if (readCookie('defaultDayServiceLocationName') == 'Remember Last Location') {
            changeTheDSLocation(readCookie('defaultDayServiceLocation'));
          } else {
            changeTheDSLocation(readCookie('defaultDayServiceLocationNameValue'));
          }
        }

        if (currentlocationId != 0) {
          getConsumerDayServiceActivity();
        } else {
          $('#locationhelp').css('display', 'block');
          $('#appbuttonbox').html('');
        }
      },

      //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n'+ xhr.responseText); }
    });
  }
  function getConsumerDayServiceActivity(
    peopleList,
    serviceDate,
    locationId,
    groupCode,
    retrieveId,
    callback,
  ) {
    //Done
    // removeErrorMessage();
    // var dsDate = $('#dsdatebox').val();
    // if (dsDate == undefined) {
    // 	var newDate = new Date();
    // 	dsDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
    // }
    groupCode = !groupCode ? 'ALL' : groupCode;

    if (groupCode !== 'CST') {
      if (!retrieveId) retrieveId = locationId;
    }

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
        '/getConsumerDayServiceActivityJSON/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "peopleList":"' +
        peopleList +
        '", "groupCode":"' +
        groupCode +
        '","retrieveId":"' +
        retrieveId +
        '","serviceDate":"' +
        serviceDate +
        '", "locationId":"' +
        locationId +
        '"}',

      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getConsumerDayServiceActivityJSONResult;
        callback(res);
      },
    });
  }
  function getCiStaff(serviceDate, locationId, callback) {
    // startTime = convertTimeToMilitary(startTime);
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
        '/getCIStaffDropdownJSON/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationID":"' +
        locationId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        //var res = JSON.stringify(response);
        var res = response.getCIStaffDropdownJSONResult;
        callback(res);
        //ASH below will need tweaked to fit new response
        // getExistingCIStaffIdAjax(consumerId, startTime, res, ciButtonId, isBatched);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function updateCIStaff(consumerId, staffId, startTime, serviceDate, locationId, callback) {
    startTime = convertTimeToMilitary(startTime);
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
        '/updateCIStaff/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationID":"' +
        locationId +
        '", "consumerId":"' +
        consumerId +
        '", "startTime":"' +
        startTime +
        '", "staffId":"' +
        staffId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function updateDayServiceActivity(
    consumerIds,
    inputType,
    inputTime,
    serviceDate,
    locationID,
    dayServiceType,
    selectedGroupId,
    callback,
  ) {
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
        '/updateDayServiceActivity/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "consumerIds":"' +
        consumerIds +
        '", "serviceDate":"' +
        serviceDate +
        '", "locationId":"' +
        locationID +
        '", "inputType":"' +
        inputType +
        '", "inputTime":"' +
        inputTime +
        '", "dayServiceType":"' +
        dayServiceType +
        '", "selectedGroupId":"' +
        selectedGroupId +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback(res);
        // return res;
        // var errorId;
        // errorMessage = '';
        // var errorConsumerIds;

        // $('dayrow', res).each(function() {
        // 	// Look for errors:
        // 	$('errors', res).each(function() {
        // 		// Get the error code:
        // 		tmpErrorCode = $('error_code', this).text();
        // 		// If time overlaps:

        // 		if (tmpErrorCode == '615' && inputTime != '00:00:00') {
        // 			// Get the consumer IDs:
        // 			errorConsumerIds = $('consumers', this).text();
        // 		}
        // 	});
        // });

        // // After update, refresh data
        // if (errorConsumerIds != null) {
        // 	getConsumerDayServiceActivity(errorConsumerIds);
        // } else {
        // 	getConsumerDayServiceActivity();
        // }
      },

      error: function (xhr, status, error) {
        alert('Error\n-----\n' + error + ' \n' + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getDSIsLocationBatched(locationId, serviceDate, callback) {
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
        '/getDSIsLocationBatched/',
      data:
        '{"token":"' +
        $.session.Token +
        '", "locationId":"' +
        locationId +
        '", "serviceDate":"' +
        serviceDate +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        data = response.getDSIsLocationBatchedResult;
        callback(data);
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  function getDayServiceGroups(token, locationId, callback) {
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
        '/getDayServiceGroups/',
      data: '{"token":"' + token + '", "locationId":"' + locationId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: function (response, status, xhr) {
        // var res = JSON.stringify(response);
        var res = response.getDayServiceGroupsResult;
        callback(res);
      },
    });
  }

  return {
    checkConsumersForDate,
    getDayServiceGetEnabledConsumers,
    dayServiceClockIn,
    dayServiceClockOut,
    deleteDayServiceActivity,
    deleteCIStaffId,
    getDateToCheckShowCI,
    getExistingCIStaffId,
    getDayServiceLocations,
    getConsumerDayServiceActivity,
    getCiStaff,
    updateCIStaff,
    updateDayServiceActivity,
    getDSIsLocationBatched,
    getDayServiceGroups,
  };
})();
