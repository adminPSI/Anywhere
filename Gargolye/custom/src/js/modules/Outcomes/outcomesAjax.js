const outcomesAjax = (function () {
  function deleteGoal(activityId, consumerId, goalDate, callback) {
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
        '/deleteGoal/',
      data: '{"token":"' + $.session.Token + '", "activityId":"' + activityId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);
        callback();
      },
      error: function (xhr, status, error) {},
    });
  }
  function getGoals(consumerId, goalDate, callback) {
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
        '/getGoalsByDateNew/',
      data: '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '", "goalDate":"' + goalDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getGoalsByDateNewResult;
        callback(res);
      },
    });
  }
  async function getGoalsAsync(consumerId, goalDate) {
    const retrieveData = {
      consumerId,
      goalDate,
      token: $.session.Token,
    };
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
          '/getGoalsByDateNew/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getGoalsByDateNewResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  function getGoalSpecificLocationInfo(activityId, goalId, objId, callback) {
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
        '/getGoalSpecificLocationInfoJSON/',
      data: '{"token":"' + $.session.Token + '", "activityId":"' + activityId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getGoalSpecificLocationInfoJSONResult;
        callback(res);
      },
    });
  }
  function getIdsWithGoals(callback) {
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
        '/getUserIdsWithGoalsJSON/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getUserIdsWithGoalsJSONResult;
        callback(res);
      },
    });
  }
  function getUserIdsWithGoalsByDate(goalsCheckDate, callback) {
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
        '/getUserIdsWithGoalsByDateJSON/',
      data: '{"token":"' + $.session.Token + '", "goalsCheckDate":"' + goalsCheckDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getUserIdsWithGoalsByDateJSONResult;
        callback(res);
      },
    });
  }
  function getDaysBackForEditingGoalsAndUseConsumerLocation(consumerId, callback) {
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
        '/getDaysBackForEditingGoalsJSON/',
      data: '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getDaysBackForEditingGoalsJSONResult;
        callback(res);
      },
    });
  }
  function getViewableGoalIdsByPermission(callback) {
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
        '/getViewableGoalIdsByPermissionJSON/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getViewableGoalIdsByPermissionJSONResult;
        res.forEach(function ashLikesThisLoop(element, i) {
          $.session.viewableGoalTypeIds.push(element.ID);
        });
        callback();
      },
    });
  }
  function getRemainingDailyGoals(checkDate, callback) {
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
        '/getRemainingDailyGoalsJSON/',
      data: '{"token":"' + $.session.Token + '", "checkDate":"' + checkDate + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getRemainingDailyGoalsJSONResult;
        callback(res);
      },
    });
  }
  function getGoalsCommunityIntegrationLevelDropdown(callback) {
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
        '/getGoalsCommunityIntegrationLevelJSON/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getGoalsCommunityIntegrationLevelJSONResult;
        callback(res);
      },
    });
  }
  //Get whether or not community integration is required.
  function getGoalsCommunityIntegrationRequired(callback) {
    //Brad
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
        '/getGoalsCommunityIntegrationRequiredJSON/',
      data: '{"token":"' + $.session.Token + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var results = ''; //JSON.parse(response.getGoalsCommunityIntegrationRequiredResult);
        var res = response.getGoalsCommunityIntegrationRequiredJSONResult;

        if (res.length) {
          if (res[0].Setting_Value == 'Y') {
            $.session.communityIntegrityRequired = true;
          } else {
            $.session.communityIntegrityRequired = false;
          }
        } else {
          $.session.communityIntegrityRequired = 'n/a';
        }

        callback(res);
      },
    });
  }
  function getOutcomeTypeForFilter(data, callback) {
    // data = {consumerId, selectedDate, token}
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
        '/getOutcomeTypeForFilterJSON/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var results = response.getOutcomeTypeForFilterJSONResult;
        callback(results);
      },
    });
  }
  //function getConsumerTableConsumerLocation(consumerId) {
  //	data = {
  //		token: $.session.Token,
  //		consumerId: consumerId,
  //	};
  //	$.ajax({
  //		type: 'POST',
  //		url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getConsumerTableConsumerLocation/',
  //		data: JSON.stringify(data),
  //		contentType: 'application/json; charset=utf-8',
  //		dataType: 'json',
  //		success: function(response, status, xhr) {
  //			data = response.getConsumerTableConsumerLocationResult;
  //			$.session.consumerTableConsumerLocationId = data[0].locationId;
  //			$.session.consumerTableConsumerLocationName = data[0].description;
  //		},
  //		error: function(xhr, status, error) {
  //			alert('Error\n-----\n' + xhr.status + '\n' + xhr.responseText);
  //		},
  //	});
  //}
  function saveGoals(data, callback) {
    data = {
      token: $.session.Token,
      objectiveId: data.objectiveId,
      activityId: data.activityId,
      date: data.objdate,
      success: data.success,
      goalnote: data.goalnote,
      promptType: data.promptType,
      promptNumber: data.promptNumber,
      locationId: data.locationId,
      locationSecondaryId: data.locationSecondaryId,
      goalStartTime: data.goalStartTime,
      goalEndTime: data.goalEndTime,
      goalCILevel: data.goalCILevel,
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
        '/saveGoal/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = JSON.stringify(response);

        if (!response.saveGoalResult.match('Error')) {
          callback(res);
        } else {
          alert('Outcome could not be saved. Please verify your start time, end time, and all other data.');
        }
      },
    });
  }
  function getObjectiveActivity(objectiveActivityId, callback) {
    data = {
      objectiveActivityId: objectiveActivityId,
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
        '/getObjectiveActivity/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getObjectiveActivityResult;
        callback(res);
      },
    });
  }
  function getOutcomesPrompts(callback) {
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
        '/getOutcomesPrompts/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getOutcomesPromptsResult;
        callback(res);
      },
    });
  }
  function getOutcomesSuccessTypes(goalTypeId, callback) {
    data = {
      goalTypeId,
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
        '/getOutcomesSuccessTypes/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getOutcomesSuccessTypesResult;
        callback(res);
      },
    });
  }
  function getOutcomesPrimaryAndSecondaryLocations(consumerId, goalDate, callback) {
    data = {
      consumerId,
      goalDate,
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
        '/getOutcomesPrimaryAndSecondaryLocations/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getOutcomesPrimaryAndSecondaryLocationsResult;
        callback(res);
      },
    });
  }
  function getSuccessSymbols(callback) {
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
        '/getSuccessSymbolLookup/',
      // data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getSuccessSymbolLookupResult;
        callback(res);
      },
    });
  }

  async function getOutcomeServicsPageData(retrieveData) {
    // token
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
          '/getOutcomeServicsPageData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getOutcomeServicsPageDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getOutcomeTypeDropDownAsync(selectedConsumer, effectiveDateStart) {
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
          '/getOutcomeTypeDropDown/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: selectedConsumer,
          effectiveDateStart,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getOutcomeServiceDropDownAsync(selectedConsumerId, startDate) {
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
          '/getOutcomeServiceDropDown/',
        data: JSON.stringify({
          token: $.session.Token,
          consumerId: selectedConsumerId,
          effectiveDateStart: startDate,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getGoalEntriesByIdAsync(goalId) {
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
          '/getGoalEntriesById/',
        data: '{"token":"' + $.session.Token + '", "goalId":"' + goalId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getObjectiveEntriesByIdAsync(objectiveId) {
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
          '/getObjectiveEntriesById/',
        data: '{"token":"' + $.session.Token + '", "objectiveId":"' + objectiveId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getServiceFrequencyTypeDropDownAsync(Type) {
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
          '/getServiceFrequencyTypeDropDown/',
        data: JSON.stringify({
          token: $.session.Token,
          type: Type,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function insertOutcomeInfoAsync(
    startDate,
    endDate,
    outcomeType,
    outcomeStatement,
    userID,
    goalId,
    consumerId,
    location,
  ) {
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
          '/insertOutcomeInfo/',
        data: JSON.stringify({
          token: $.session.Token,
          startDate: startDate,
          endDate: endDate,
          outcomeType: outcomeType,
          outcomeStatement: outcomeStatement,
          userID: userID,
          goalId: goalId,
          consumerId: consumerId,
          location: location,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function insertOutcomeServiceInfoAsync(
    startDate,
    endDate,
    outcomeType,
    servicesStatement,
    ServiceType,
    method,
    success,
    frequencyModifier,
    frequency,
    frequencyPeriod,
    userID,
    objectiveId,
    consumerId,
    location,
    duration,
  ) {
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
          '/insertOutcomeServiceInfo/',
        data: JSON.stringify({
          token: $.session.Token,
          startDate: startDate,
          endDate: endDate,
          outcomeType: outcomeType,
          servicesStatement: servicesStatement,
          ServiceType: ServiceType,
          method: method,
          success: success,
          frequencyModifier: frequencyModifier,
          frequency: frequency,
          frequencyPeriod: frequencyPeriod,
          userID: userID,
          objectiveId: objectiveId,
          consumerId: consumerId,
          location: location,
          duration: duration,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getLocationDropDownAsync() {
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
          '/getLocationDropDown/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  // Review
  async function getReviewTableData(retrieveData) {
    //consumerId, objectiveDate
    //4365, '2024/07/01'
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
          '/getOutcomesReviewGrid/',
        data: JSON.stringify({
          token: $.session.Token,
          ...retrieveData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result.getOutcomesReviewGridResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getReviewTableDataSecondary(retrieveData) {
    //consumerId, startDate, endDate, objectiveIdList
    //4365, '2024/07/01', '2024/10/01',
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
          '/getOutcomesReviewGridSecondary/',
        data: JSON.stringify({
          token: $.session.Token,
          ...retrieveData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result.getOutcomesReviewGridSecondaryResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function getAllGoalTypes() {
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
          '/getAllGoalTypes/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result.getAllGoalTypesResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  async function addReviewNote(data) {
    // @token
    // @objectiveActivityId
    // @consumerId
    // @employeeId
    // @objectiveActivityDate
    // @note
    // @result
    // @notifyEmployee
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
          '/updateReviewNote/',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result.updateReviewNoteResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }
  //

  async function addOutcomePlan(retrieveData) {
    try {
      var binary = '';
      var bytes = new Uint8Array(retrieveData.attachment);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let abString = window.btoa(binary);
      retrieveData.attachment = abString;
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
          '/addOutcomePlan/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.addOutcomePlanResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getPlanHistorybyConsumer(selectedConsumerId) {
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
          '/getPlanHistorybyConsumer/',
        data: '{"token":"' + $.session.Token + '", "consumerId":"' + selectedConsumerId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function addOutcomePlanLater(retrieveData) {
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
          '/addOutcomePlanLater/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.addOutcomePlanLaterResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  function addOutcomePlanNow(selectedConsumerId) {
    data = {
      token: $.session.Token,
      consumerId: selectedConsumerId,
    };
    var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/addOutcomePlanNow/`;
    var successFunction = function (resp) {
      var res = JSON.stringify(response);
    };

    var form = document.createElement('form');
    form.setAttribute('action', action);
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.setAttribute('enctype', 'application/json');
    form.setAttribute('success', successFunction);
    var tokenInput = document.createElement('input');
    tokenInput.setAttribute('name', 'token');
    tokenInput.setAttribute('value', $.session.Token);
    tokenInput.id = 'token';
    var attachmentInput = document.createElement('input');
    attachmentInput.setAttribute('name', 'consumerId');
    attachmentInput.setAttribute('value', selectedConsumerId);
    attachmentInput.id = 'consumerId';

    form.appendChild(tokenInput);
    form.appendChild(attachmentInput);
    form.style.position = 'absolute';
    form.style.opacity = '0';
    document.body.appendChild(form);

    form.submit();
    form.remove();
  }

  async function isNewBtnDisabledByPlanHistory(selectedConsumerId, goalTypeID, ObjectiveID) {
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
          '/isNewBtnDisabledByPlanHistory/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "consumerId":"' +
          selectedConsumerId +
          '", "goalTypeID":"' +
          goalTypeID +
          '", "ObjectiveID":"' +
          ObjectiveID +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function isViewPlabBtnDisabled(selectedConsumerId) {
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
          '/isViewPlabBtnDisabled/',
        data: '{"token":"' + $.session.Token + '", "consumerId":"' + selectedConsumerId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  return {
    deleteGoal,
    getGoals,
    getGoalsAsync,
    getGoalSpecificLocationInfo,
    getIdsWithGoals,
    getUserIdsWithGoalsByDate,
    getDaysBackForEditingGoalsAndUseConsumerLocation,
    getViewableGoalIdsByPermission,
    getRemainingDailyGoals,
    getGoalsCommunityIntegrationLevelDropdown,
    getGoalsCommunityIntegrationRequired,
    getOutcomeTypeForFilter,
    // getConsumerTableConsumerLocation,
    saveGoals,
    getObjectiveActivity,
    getOutcomesPrompts,
    getOutcomesSuccessTypes,
    getOutcomesPrimaryAndSecondaryLocations,
    getSuccessSymbols,
    getOutcomeServicsPageData,
    getOutcomeTypeDropDownAsync,
    getGoalEntriesByIdAsync,
    getObjectiveEntriesByIdAsync,
    getOutcomeServiceDropDownAsync,
    getServiceFrequencyTypeDropDownAsync,
    insertOutcomeInfoAsync,
    insertOutcomeServiceInfoAsync,
    getLocationDropDownAsync,
    // Review
    getReviewTableData,
    getReviewTableDataSecondary,
    getAllGoalTypes,
    addReviewNote,
    //
    addOutcomePlan,
    getPlanHistorybyConsumer,
    addOutcomePlanLater,
    addOutcomePlanNow,
    isNewBtnDisabledByPlanHistory,
    isViewPlabBtnDisabled,
  };
})();
