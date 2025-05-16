var defaultsAjax = (function () {
    function setDefaultValue(type, value, name) {
        var typeName = "";
        var switchCase = 0;
        switch (type) {
            case 1:
                typeName = "Default Staff Location";
                break;
            case 2:
                typeName = "Default Roster Location";
                createCookie("defaultRosterGroupName", "Everyone", 7);
                createCookie("defaultRosterGroupValue", "ALL", 7);
                saveDefaultLocationNameAjax("6", "Everyone");
                saveDefaultLocationValueAjax("6", "ALL");
                $("#rostergroup6").text("Everyone");
                if (value != 0 && name != null) {
                    getConsumerGroups(value, name);
                    $.session.defaultRosterLocation = value;
                    createCookie("defaultRosterLocationName", name, 7);
                    saveDefaultLocationNameAjax("2", name);
                } else {
                    createCookie(
                        "defaultRosterLocationName",
                        "Remember Last Location",
                        7
                    );
                    saveDefaultLocationNameAjax("2", "Remember Last Location");
                }
                break;
            case 3:
                typeName = "Default Day Service Location";
                if (value != 0 && name != null) {
                    createCookie("defaultDayServiceLocationName", name, 7);
                    createCookie("defaultDayServiceLocationNameValue", value, 7);
                    createCookie("defaultDayServiceLocationFlag", false, 7);
                    saveDefaultLocationNameAjax("3", name);
                    saveDefaultLocationValueAjax("3", value);
                    $.session.defaultDayServiceLocationFlag = "false";
                    $.session.dsLocationHistoryFlag = false;
                } else {
                    var test = $(this).text();
                    saveDefaultLocationNameAjax("3", "Remember Last Location");
                    if (name == null) {
                        createCookie("defaultDayServiceLocationFlag", true, 7);
                        $.session.defaultDayServiceLocationFlag = "true";
                    }
                }
                break;
            case 4:
                typeName = "Default Time Clock Location";
                if (value != 0 && name != null) {
                    createCookie("defaultTimeClockLocationName", name, 7);
                    createCookie("defaultTimeClockLocationValue", value, 7);
                    saveDefaultLocationNameAjax("4", name);
                    saveDefaultLocationValueAjax("4", value);
                } else {
                }
                //New way to save to the database
                switchCase = "4";
                saveDefaultLocationValueAjax(switchCase, value);
                break;
            case 5:
                typeName = "Default Workshop Location";
                if (value != 0 && name != null) {
                    createCookie("defaultWorkshopLocationName", name, 7);
                    createCookie("defaultWorkshopLocationValue", value, 7);
                    saveDefaultLocationNameAjax("5", name);
                    saveDefaultLocationValueAjax("5", value);
                } else {
                    createCookie(
                        "defaultWorkshopLocationName",
                        "Remember Last Location",
                        7
                    );
                    saveDefaultLocationNameAjax("5", "Remember Last Location");
                }
                break;
            case 6:
                typeName = "Default Roster Group";
                if (value != 0 && name != null) {
                    createCookie("defaultRosterGroupName", name, 7);
                    createCookie("defaultRosterGroupValue", value, 7);
                    saveDefaultLocationNameAjax("6", name);
                    saveDefaultLocationValueAjax("6", value);
                } else {
                    createCookie("defaultRosterGroupName", "Everyone", 7);
                    saveDefaultLocationNameAjax("6", "Everyone");
                }
                break;
            case 7:
                typeName = "Default MoneyManagement Location";
                if (value != 0 && name != null) {
                    createCookie("defaultMoneyManagementLocationName", name, 7);
                    createCookie("defaultMoneyManagementLocationValue", value, 7);
                    saveDefaultLocationNameAjax("7", name);
                    saveDefaultLocationValueAjax("7", value);
                } else {
                    createCookie(
                        "defaultMoneyManagementLocationName",
                        "Remember Last Location",
                        7
                    );
                    saveDefaultLocationNameAjax("7", "Remember Last Location");
                }
                break;
            case 8:
                typeName = "Default Plan Location";
                createCookie("defaultPlanGroupName", "Everyone", 7);
                createCookie("defaultPlanGroupValue", "ALL", 7);
                saveDefaultLocationNameAjax("9", "Everyone");
                saveDefaultLocationValueAjax("9", "ALL");
                $("#plangroup9").text("Everyone");
                if (value != 0 && name != null) {
                    getConsumerGroups(value, name);
                    $.session.defaultPlanLocation = value;
                    createCookie("defaultPlanLocationName", name, 7);
                    saveDefaultLocationNameAjax("8", name);
                } else {
                    createCookie(
                        "defaultPlanLocationName",
                        "Remember Last Location",
                        7
                    );
                    saveDefaultLocationNameAjax("8", "Remember Last Location");
                }
                break;
            case 9:
                typeName = "Default Plan Group";
                if (value != 0 && name != null) {
                    createCookie("defaultPlanGroupName", name, 7);
                    createCookie("defaultPlanGroupValue", value, 7);
                    saveDefaultLocationNameAjax("9", name);
                    saveDefaultLocationValueAjax("9", value);
                } else {
                    createCookie("defaultPlanGroupName", "Everyone", 7);
                    saveDefaultLocationNameAjax("9", "Everyone");
                }
                break;
            case 10:
                typeName = "Default OOD Location";
                if (value != 0 && name != null) {
                    createCookie("defaultOODLocationName", name, 10);
                    createCookie("defaultOODLocationValue", value, 10);
                    saveDefaultLocationNameAjax("10", name);
                    saveDefaultLocationValueAjax("10", value);
                } else {
                    createCookie(
                        "defaultOODLocationName",
                        "Remember Last Location",
                        10
                    );
                    saveDefaultLocationNameAjax("10", "Remember Last Location");
                }
                break;
            case 11:
                typeName = "Default Outcomes Location";
                if (value != 0 && name != null) {
                    createCookie("defaultOutcomesLocationName", name, 11);
                    createCookie("defaultOutcomesLocationValue", value, 11);
                    saveDefaultLocationNameAjax("11", name);
                    saveDefaultLocationValueAjax("11", value);
                } else {
                    createCookie(
                        "defaultOutcomesLocationName",
                        "Remember Last Location",
                        11
                    );
                    saveDefaultLocationNameAjax("11", "Remember Last Location");
                }
                break;
            case 12:
                typeName = "Default TimeEntry Location";
                createCookie("defaultTimeEntryGroupName", "Everyone", 12);
                createCookie("defaultTimeEntryGroupValue", "ALL", 12);
                saveDefaultLocationNameAjax("12", "Everyone");
                saveDefaultLocationValueAjax("12", "ALL");
                $("#timeEntrygroup12").text("Everyone");
                if (value != 0 && name != null) {
                    getConsumerGroups(value, name);
                    $.session.defaultTimeEntryLocation = value;
                    createCookie("defaultTimeEntryLocationName", name, 12);
                    saveDefaultLocationNameAjax("12", name);
                } else {
                    createCookie(
                        "defaultTimeEntryLocationName",
                        "Remember Last Location",
                        12
                    );
                    saveDefaultLocationNameAjax("12", "Remember Last Location");
                }
                break;
            case 13:
                typeName = "Default TimeEntry Group";
                if (value != 0 && name != null) {
                    createCookie("defaultTimeEntryGroupName", name, 13);
                    createCookie("defaultTimeEntryGroupValue", value, 13);
                    saveDefaultLocationNameAjax("13", name);
                    saveDefaultLocationValueAjax("13", value);
                } else {
                    createCookie("defaultTimeEntryGroupName", "Everyone", 13);
                    saveDefaultLocationNameAjax("13", "Everyone");
                }
                break;
        }

        setDefaultLoc(type, value);
    }

    async function getInvalidDefaults() {
        // string token
        const retrieveData = {
            token: $.session.Token
        }
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
                    '/getInvalidDefaults/',
                data: JSON.stringify(retrieveData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            });

            return data.getInvalidDefaultsResult;
        } catch (error) {
            console.log(error);
        }
    }

    function saveDefaultLocationValue(switchCase, locationId) {
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
                "/saveDefaultLocationValue/",
            data:
                '{"token":"' +
                $.session.Token +
                '", "switchCase":"' +
                switchCase +
                '", "locationId":"' +
                locationId +
                '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
            }
            //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
        });
    }

    function saveDefaultLocationName(switchCase, locationName) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/saveDefaultLocationName/',
            data: '{"token":"' + $.session.Token + '", "switchCase":"' + switchCase + '", "locationName":"' + locationName + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
            },
            //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
        });
    }

    function updateConsumerNotesDaysBack(updatedReviewDays) {
        $.session.defaultProgressNoteReviewDays = updatedReviewDays;
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
                "/updateConsumerNotesDaysBack/",
            data:
                '{"token":"' +
                $.session.Token +
                '", "updatedReviewDays":"' +
                updatedReviewDays +
                '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            }
        });
    }

    function updateConsumerNotesChecklistDaysBack() {
        updatedChecklistDays = $("#progressnoteschecklistdaysback").val();
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
                "/updateConsumerNotesChecklistDaysBack/",
            data:
                '{"token":"' +
                $.session.Token +
                '", "updatedChecklistDays":"' +
                updatedChecklistDays +
                '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            }
        });
    }

    //Days back
    function updateIncidentTrackingDaysBack(updatedReviewDays) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateIncidentTrackingDaysBack/',
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

    //Case Note Review Days
    function updateCaseNotesDaysBack(updatedDaysBack) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/updateCaseNotesReviewDays/',
            data: '{"token":"' + $.session.Token + '", "updatedReviewDays":"' + updatedDaysBack + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.updateCaseNotesReviewDaysResult;
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }

    // Roster ---
    // -----------

    function getRosterLocations(callback) {
        $.ajax({
            type: 'POST',
            url: $.webServer.protocol + '://' + $.webServer.address + ':' + $.webServer.port + '/' + $.webServer.serviceName + '/getLocationsJSON/',
            data: '{"token":"' + $.session.Token + '"}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response, status, xhr) {
                var res = response.getLocationsJSONResult;
                callback(res);
            },
            error: function (xhr, status, error) {
                callback(null);
            },
        });
    }
    function getConsumerGroups(locationId, callback) {
        $.ajax({
            type: "POST",
            url:
                $.webServer.protocol + "://" +
                $.webServer.address + ":" +
                $.webServer.port + "/" +
                $.webServer.serviceName + "/getConsumerGroupsJSON/",
            data: '{"locationId":"' + locationId + '", "token":"' + $.session.Token + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = response.getConsumerGroupsJSONResult;
                callback(res);
            }
        });
    }

    function updateConnectWithPerson(connectType) {
        $.session.defaultContact = connectType;
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
                "/updateConnectWithPerson/",
            data:
                '{"token":"' +
                $.session.Token +
                '", "connectType":"' +
                connectType +
                '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            }
        });
    }


    return {
        setDefaultValue,
        updateConsumerNotesDaysBack,
        updateConsumerNotesChecklistDaysBack,
        saveDefaultLocationValue,
        saveDefaultLocationName,
        updateIncidentTrackingDaysBack,
        updateCaseNotesDaysBack,
        getConsumerGroups,
        getRosterLocations,
        getInvalidDefaults,
        updateConnectWithPerson
    };
})();
