var outcomesAjax = (function () {
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
                //getGoals($.userId, goalId + '-' + objectiveId);
                callback();
                // getGoals(consumerId, goalDate);
                // var list = $.pages.rosterconsumerlist.split('</consumer>');
                // getRemainingDailyGoals(list);
            },
            error: function (xhr, status, error) { },
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
            data:
                '{"token":"' +
                $.session.Token +
                '", "consumerId":"' +
                consumerId +
                '", "goalDate":"' +
                goalDate +
                '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getGoalsByDateNewResult;
                callback(res);
            },
        });
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
                    alert(
                        'Outcome could not be saved. Please verify your start time, end time, and all other data.',
                    );
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

    return {
        deleteGoal,
        getGoals,
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
    };
})();
