var defaults = (function () {
    // dom
    var rosterLocationDropdown;
    var rosterGroupDropdown;
    var dayServicesLocationDropdown;
    var timeClockLocationDropdown;
    var WorkshopLocationDropdown;
    var moneyManagementLocationDropdown;
    var OODLocationDropdown;
    var outcomesLocationDropdown;
    var rosterRLLCheckBox;
    var dayServicesRLLCheckBox;
    var timeClockRLLCheckBox;
    var WorkshopRLLCheckBox;
    var moneyManagementRLLCheckBox;
    var OODRLLCheckBox;
    var outcomesRLLCheckBox;
    var itDaysBackInput;
    var caseNotesDaysBackInput;
    var progressNotesDaysBackInput;
    var planLocationDropdown;
    var planGroupDropdown;
    var planRLLCheckBox;
    var planConnectDropdown;
    var timeEntryLocationDropdown;
    var timeEntryGroupDropdown;
    var timeEntryRLLCheckBox;
    var formsLocationDropdown;
    var formsGroupDropdown;
    var formsRLLCheckBox;
    var employmentLocationDropdown;
    var employmentGroupDropdown;
    var employmentRLLCheckBox;

    // values
    var todaysDate = UTIL.getTodaysDate();
    var rosterLocation;
    var rosterGroup;
    var rosterGroupName;
    var dayServicesLocation;
    var timeClockLocation;
    var WorkshopLocation;
    var moneyManagementLocation;
    var OODLocation;
    var outcomesLocation;
    var rosterRLL;
    var dayServicesRLL;
    var timeClockRLL;
    var workshopRLL;
    var moneyManagementRLL;
    var OODRLL;
    var outcomesRLL;
    var planRLL;
    var planLocation;
    var planGroup;
    var planGroupName;
    var planConnect;
    var timeEntryRLL;
    var timeEntryLocation;
    var timeEntryGroup;
    var timeEntryGroupName;
    var defaultRosterLocationFixed;
    var formsRLL;
    var formsLocation;
    var formsGroup;
    var formsGroupName;
    var employmentRLL;
    var employmentLocation;
    var employmentGroup;
    var employmentGroupName;
    //dropdown data
    var dayServiceDropdownData;
    var workshopDropdownData;
    var moneyManagementDropdownData;
    var OODDropdownData;
    var outcomesDropdownData;
    var timeClockDropdownData;
    var rosterLocDropdownData;
    var rosterGroupDropdownData;
    var planLocDropdownData;
    var planGroupDropdownData;
    var timeEntryLocDropdownData;
    var timeEntryGroupDropdownData;
    var formsLocDropdownData;
    var formsGroupDropdownData;
    var employmentLocDropdownData;
    var employmentGroupDropdownData;
    var communicationTypeDropdownData;

    function getLocation(module) {
        // module ex.. 'roster', 'dayServices'
        switch (module) {
            case 'roster': {
                return $.session.defaultRosterLocation === 'null' ||
                    $.session.defaultRosterLocation === '0'
                    ? ''
                    : $.session.defaultRosterLocation;
                break;
            }
            case 'rosterGroup': {
                return $.session.defaultRosterGroupValue;
                break;
            }
            case 'dayServices': {
                return $.session.defaultDayServiceLocation;
                break;
            }
            case 'timeClock': {
                return $.session.defaultDSTimeClockValue;
                break;
            }
            case 'workshop': {
                return $.session.defaultWorkshopLocationValue;
                break;
            }
            case 'moneyManagement': {
                return $.session.defaultMoneyManagementLocationValue;
                break;
            }
            case 'OOD': {
                return $.session.defaultOODLocationValue;
                break;
            }
            case 'outcomes': {
                return $.session.defaultOutcomesLocationValue;
                break;
            }
            case 'plan': {
                return $.session.defaultPlanLocation === 'null' ||
                    $.session.defaultPlanLocation === '0'
                    ? ''
                    : $.session.defaultPlanLocation;
                break;
            }
            case 'planGroup': {
                return $.session.defaultPlanGroupValue;
                break;
            }
            case 'planGroupName': {
                return $.session.defaultPlanGroupName;
                break;
            }
            case 'timeEntry': {
                return $.session.defaultTimeEntryLocation === 'null' ||
                    $.session.defaultTimeEntryLocation === '0'
                    ? ''
                    : $.session.defaultTimeEntryLocation;
                break;
            }
            case 'timeEntryGroup': {
                return $.session.defaultTimeEntryGroupValue;
                break;
            }
            case 'timeEntryGroupName': {
                return $.session.defaultTimeEntryGroupName;
                break;
            }
            case 'forms': {
                return $.session.defaultFormsLocation === 'null' ||
                    $.session.defaultFormsLocation === '0'
                    ? ''
                    : $.session.defaultFormsLocation;
                break;
            }
            case 'formsGroup': {
                return $.session.defaultFormsGroupValue;
                break;
            }
            case 'formsGroupName': {
                return $.session.defaultFormsGroupName;
                break;
            }
            case 'employment': {
                return $.session.defaultEmploymentLocation === 'null' ||
                    $.session.defaultEmploymentLocation === '0'
                    ? ''
                    : $.session.defaultEmploymentLocation;
                break;
            }
            case 'employmentGroup': {
                return $.session.defaultEmploymentGroupValue;
                break;
            }
            case 'employmentGroupName': {
                return $.session.defaultEmploymentGroupName; 
                break;
            }
            default: {
                return null;
                break;
            }
        }
    }

    function setLocation(module, value, name) {
        // only called from within defaults page
        switch (module) {
            case 'roster': {
                rosterLocation = value;
                defaultsAjax.saveDefaultLocationValue('2', rosterLocation);
                //reset session var for the current session
                $.session.defaultRosterLocation = rosterLocation;
                break;
            }
            case 'rosterGroup': {
                rosterGroup = value;
                defaultsAjax.saveDefaultLocationValue('6', rosterGroup, rosterGroupName);
                //reset session var for the current session
                $.session.defaultRosterGroupValue = rosterGroup;
                break;
            }
            case 'dayServices': {
                dayServicesLocation = value;
                defaultsAjax.saveDefaultLocationValue('3', dayServicesLocation);
                //reset session var for the current session
                $.session.defaultDayServiceLocation = dayServicesLocation;
                break;
            }
            case 'timeClock': {
                timeClockLocation = value;
                defaultsAjax.saveDefaultLocationValue('4', timeClockLocation);
                //reset session var for the current session
                $.session.defaultDSTimeClockValue = timeClockLocation;
                break;
            }
            case 'workshop': {
                WorkshopLocation = value;
                defaultsAjax.saveDefaultLocationValue('5', WorkshopLocation);
                //reset session var for the current session
                $.session.defaultWorkshopLocationValue = WorkshopLocation;
                break;
            }
            case 'moneyManagement': {
                moneyManagementLocation = value;
                defaultsAjax.saveDefaultLocationValue('7', moneyManagementLocation);
                //reset session var for the current session
                $.session.defaultMoneyManagementLocationValue = moneyManagementLocation;
                break;
            }
            case 'plan': {
                planLocation = value;
                defaultsAjax.saveDefaultLocationValue('8', planLocation);
                //reset session var for the current session
                $.session.defaultPlanLocation = planLocation;
                break;
            }
            case 'planGroup': {
                planGroup = value;
                planGroupName = name;
                defaultsAjax.saveDefaultLocationValue('9', planGroup);
                defaultsAjax.saveDefaultLocationName('9', planGroupName);
                //reset session var for the current session
                $.session.defaultPlanGroupName = planGroupName;
                $.session.defaultPlanGroupValue = planGroup;
                break;
            }
            case 'OOD': {
                OODLocation = value;
                defaultsAjax.saveDefaultLocationValue('10', OODLocation);
                //reset session var for the current session
                $.session.defaultOODLocationValue = OODLocation;
                break;
            }
            case 'outcomes': {
                outcomesLocation = value;
                defaultsAjax.saveDefaultLocationValue('11', outcomesLocation);
                //reset session var for the current session
                $.session.defaultOutcomesLocationValue = outcomesLocation;
                break;
            }
            case 'timeEntry': {
                timeEntryLocation = value;
                defaultsAjax.saveDefaultLocationValue('12', timeEntryLocation);
                //reset session var for the current session
                $.session.defaultTimeEntryLocation = timeEntryLocation;
                break;
            }
            case 'timeEntryGroup': {
                timeEntryGroup = value;
                timeEntryGroupName = name;
                defaultsAjax.saveDefaultLocationValue('13', timeEntryGroup);
                defaultsAjax.saveDefaultLocationName('13', timeEntryGroupName);
                //reset session var for the current session
                $.session.defaultTimeEntryGroupName = timeEntryGroupName;
                $.session.defaultTimeEntryGroupValue = timeEntryGroup;
                break;
            }
            case 'forms': {
                formsLocation = value;
                defaultsAjax.saveDefaultLocationValue('14', formsLocation);
                //reset session var for the current session
                $.session.defaultFormsLocation = formsLocation;
                break;
            }
            case 'formsGroup': {
                formsGroup = value;
                formsGroupName = name;
                defaultsAjax.saveDefaultLocationValue('15', formsGroup);
                defaultsAjax.saveDefaultLocationName('15', formsGroupName);
                //reset session var for the current session
                $.session.defaultFormsGroupName = formsGroupName;
                $.session.defaultFormsGroupValue = formsGroup;
                break;
            }
            case 'employment': {
                employmentLocation = value;
                defaultsAjax.saveDefaultLocationValue('16', employmentLocation);
                //reset session var for the current session
                $.session.defaultEmploymentLocation = employmentLocation;
                break;
            }
            case 'employmentGroup': {
                employmentGroup = value;
                employmentGroupName = name;
                defaultsAjax.saveDefaultLocationValue('17', employmentGroup);
                defaultsAjax.saveDefaultLocationName('17', employmentGroupName);
                //reset session var for the current session
                $.session.defaultEmploymentGroupName = employmentGroupName;
                $.session.defaultEmploymentGroupValue = employmentGroup;
                break;
            }
            default: {
                return null;
                break;
            }
        }

        // defaultsAjax.setDefaultValue();
    }

    function setRememberLastLocation(module) {
        // only called from within defaults page
        switch (module) {
            case 'roster': {
                if (rosterRLL) {
                    defaultsAjax.saveDefaultLocationName('2', 'Remember Last Location');
                    $.session.defaultRosterLocationName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('2', '');
                    $.session.defaultRosterLocationName = '';
                }
                break;
            }
            case 'dayServices': {
                if (dayServicesRLL) {
                    defaultsAjax.saveDefaultLocationName('3', 'Remember Last Location');
                    $.session.defaultDayServiceLocationName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('3', '');
                    $.session.defaultDayServiceLocationName = '';
                }
                break;
            }
            case 'timeClock': {
                if (timeClockRLL) {
                    defaultsAjax.saveDefaultLocationName('4', 'Remember Last Location');
                    $.session.defaultDSTimeClockName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('4', '');
                    $.session.defaultDSTimeClockName = '';
                }
                break;
            }
            case 'workshop': {
                if (workshopRLL) {
                    defaultsAjax.saveDefaultLocationName('5', 'Remember Last Location');
                    $.session.defaultWorkshopLocation = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('5', '');
                    $.session.defaultWorkshopLocation = '';
                }
                break;
            }
            case 'moneyManagement': {
                if (moneyManagementRLL) {
                    defaultsAjax.saveDefaultLocationName('7', 'Remember Last Location');
                    $.session.defaultMoneyManagementLocation = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('7', '');
                    $.session.defaultMoneyManagementLocation = '';
                }
                break;
            }
            case 'plan': {
                if (planRLL) {
                    defaultsAjax.saveDefaultLocationName('8', 'Remember Last Location');
                    $.session.defaultPlanLocationName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('8', '');
                    $.session.defaultPlanLocationName = '';
                }
                break;
            }
            case 'OOD': {
                if (OODRLL) {
                    defaultsAjax.saveDefaultLocationName('10', 'Remember Last Location');
                    $.session.defaultOODLocation = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('10', '');
                    $.session.defaultOODLocation = '';
                }
                break;
            }
            case 'outcomes': {
                if (outcomesRLL) {
                    defaultsAjax.saveDefaultLocationName('11', 'Remember Last Location');
                    $.session.defaultOutcomesLocation = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('11', '');
                    $.session.defaultOutcomesLocation = '';
                }
                break;
            }
            case 'timeEntry': {
                if (timeEntryRLL) {
                    defaultsAjax.saveDefaultLocationName('12', 'Remember Last Location');
                    $.session.defaultTimeEntryLocationName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('12', '');
                    $.session.defaultTimeEntryLocationName = '';
                }
                break;
            }
            case 'forms': {
                if (formsRLL) {
                    defaultsAjax.saveDefaultLocationName('14', 'Remember Last Location');
                    $.session.defaultFormsLocationName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('14', '');
                    $.session.defaultFormsLocationName = '';
                }
                break;
            }
            case 'employment': {
                if (employmentRLL) {
                    defaultsAjax.saveDefaultLocationName('16', 'Remember Last Location');
                    $.session.defaultEmploymentLocationName = 'Remember Last Location';
                } else {
                    defaultsAjax.saveDefaultLocationName('16', '');
                    $.session.defaultEmploymentLocationName = '';
                }
                break;
            }
            default: {
                return null;
                break;
            }
        }
    }

    // function updateRememberLastLocation() {
    //   defaultsAjax.saveDefaultLocationValue();
    // }

    function getGroup(module) {
        switch (module) {
            case 'roster': {
                return rosterGroup;
                break;
            }
        }
    }

    function setGroup(module, newGroup) {
        // only called from within defaults page
        switch (module) {
            case 'roster': {
                rosterGroup = newGroup;
                break;
            }
        }

        defaultsAjax.setDefaultValue();
    }

    function dropdownData() {
        var dayServiceLocationPromise = new Promise(function (resolve, reject) {
            dayServiceAjax.getDayServiceLocations(todaysDate, loc => {
                dayServiceDropdownData = loc.map(loc => {
                    var id = `ds-${loc.locationId}`;
                    var value = loc.locationId;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                //If they don't have any defaults set, add a blank record to the dropdown.
                //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                if (getLocation('dayServices') === '')
                    dayServiceDropdownData.unshift({
                        id: 'ds-0',
                        value: null,
                        text: 'SELECT A LOCATION',
                    });
                resolve('success');
            });
        });

        var workshopLocationPromise = new Promise(function (resolve, reject) {
            workshopAjax.WorkshopLocations(todaysDate, r => {
                workshopDropdownData = r.map(loc => {
                    var id = `ws-${loc.id}`;
                    var value = loc.id;
                    var text = loc.name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                //If they don't have any defaults set, add a blank record to the dropdown.
                //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                if (getLocation('workshop') === '' || getLocation('workshop') === '0')
                    workshopDropdownData.unshift({ id: 'ws-0', value: '0', text: 'ALL' });
                resolve('success');
            });
        });

        var timeClockLocationPromise = new Promise(function (resolve, reject) {
            timeClockDropdownData = $.session.locations.map((location, index) => {
                var id = `tc-${$.session.locationids[index]}`;
                var value = $.session.locationids[index];
                var text = location;
                return {
                    id,
                    value,
                    text,
                };
            });
            //If they don't have any defaults set, add a blank record to the dropdown.
            //This will force an update on change and NOT make it look like the have a default set, when they really don't.
            //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
            if (getLocation('timeClock') === '') {
                timeClockDropdownData.unshift({ id: 'tc-0', value: null, text: 'SELECT A LOCATION' });
            }
            resolve('success');
        });

        var rosterLocPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                rosterLocDropdownData = loc.map(loc => {
                    var id = `ros-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                //If they don't have any defaults set, add a blank record to the dropdown.
                //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                if (getLocation('roster') === '')
                    rosterLocDropdownData.unshift({ id: 'ros-0', value: null, text: 'ALL' });
                resolve('success');
            });
        });

        var rosterGroupPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getConsumerGroups(
                $.session.defaultRosterLocation === 'null' ? '' : $.session.defaultRosterLocation,
                res => {
                    rosterGroupDropdownData = res.map(group => {
                        var id = `rosGr-${group.GroupCode}-${group.RetrieveID}`;
                        var value = `${group.GroupCode}-${group.RetrieveID}`;
                        var text = group.GroupName;
                        return {
                            id,
                            value,
                            text,
                        };
                    });
                    //If they don't have any defaults set, add a blank record to the dropdown.
                    //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                    //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                    // if (getLocation("rosterGroup") === "") rosterGroupDropdownData.unshift({ id: "rosGr-0", value: null, text: "SELECT A GROUP" });
                    resolve('success');
                },
            );
        });

        var moneyManagementLocationPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                moneyManagementDropdownData = loc.map(loc => {
                    var id = `ros-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                //If they don't have any defaults set, add a blank record to the dropdown.
                //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                moneyManagementDropdownData.unshift({ id: 'ros-0', value: '0', text: 'ALL' });
                resolve('success');
            });
        });

        var OODLocationPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                OODDropdownData = loc.map(loc => {
                    var id = `ros-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                //If they don't have any defaults set, add a blank record to the dropdown.
                //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                OODDropdownData.unshift({ id: 'ros-0', value: '0', text: 'ALL' });
                resolve('success');
            });
        });

        var outcomesLocationPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                outcomesDropdownData = loc.map(loc => {
                    var id = `ros-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                //If they don't have any defaults set, add a blank record to the dropdown.
                //This will force an update on change and NOT make it look like the have a default set, when they really don't.
                //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
                outcomesDropdownData.unshift({ id: 'ros-0', value: '0', text: 'ALL' });
                resolve('success');
            });
        });

        var planLocPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                planLocDropdownData = loc.map(loc => {
                    var id = `plan-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                if (getLocation('plan') === '')
                    planLocDropdownData.unshift({ id: 'plan-0', value: null, text: 'ALL' });
                resolve('success');
            });
        });

        var planGroupPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getConsumerGroups(
                $.session.defaultPlanLocation === null || $.session.defaultPlanLocation === undefined ? '0' : $.session.defaultPlanLocation,
                res => {
                    planGroupDropdownData = res.map(group => {
                        var id = `planGr-${group.GroupCode}-${group.RetrieveID}`;
                        var value = `${group.GroupCode}-${group.RetrieveID}`;
                        var text = group.GroupName;
                        return {
                            id,
                            value,
                            text,
                        };
                    });
                    resolve('success');
                },
            );
        });

        var timeEntryLocPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                timeEntryLocDropdownData = loc.map(loc => {
                    var id = `timeEntry-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                if (getLocation('timeEntry') === '')
                    timeEntryLocDropdownData.unshift({ id: 'timeEntry-0', value: null, text: 'ALL' });
                resolve('success');
            });
        });

        var timeEntryGroupPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getConsumerGroups(
                $.session.defaultTimeEntryLocation === null || $.session.defaulTimeEntryLocation === undefined ? '0' : $.session.defaultTimeEntryLocation,
                res => {
                    timeEntryGroupDropdownData = res.map(group => {
                        var id = `timeEntryGr-${group.GroupCode}-${group.RetrieveID}`;
                        var value = `${group.GroupCode}-${group.RetrieveID}`;
                        var text = group.GroupName;
                        return {
                            id,
                            value,
                            text,
                        };
                    });
                    resolve('success');
                },
            );
        });

        var formsLocPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                formsLocDropdownData = loc.map(loc => {
                    var id = `forms-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                if (getLocation('forms') === '')
                    formsLocDropdownData.unshift({ id: 'forms-0', value: null, text: 'ALL' });
                resolve('success');
            });
        });

        var formsGroupPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getConsumerGroups(
                $.session.defaultFormsLocation === null || $.session.defaultFormsLocation === undefined ? '0' : $.session.defaultFormsLocation,
                res => {
                    formsGroupDropdownData = res.map(group => {
                        var id = `formsGr-${group.GroupCode}-${group.RetrieveID}`;
                        var value = `${group.GroupCode}-${group.RetrieveID}`;
                        var text = group.GroupName;
                        return {
                            id,
                            value,
                            text,
                        };
                    });
                    resolve('success');
                },
            );
        });

        var employmentLocPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getRosterLocations(loc => {
                employmentLocDropdownData = loc.map(loc => {
                    var id = `employment-${loc.ID}`;
                    var value = loc.ID;
                    var text = loc.Name;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                if (getLocation('employment') === '')
                    employmentLocDropdownData.unshift({ id: 'employment-0', value: null, text: 'ALL' });
                resolve('success');
            });
        });

        var employmentGroupPromise = new Promise(function (resolve, reject) {
            defaultsAjax.getConsumerGroups(
                $.session.defaultEmploymentLocation === null || $.session.defaultEmploymentLocation === undefined ? '0' : $.session.defaultEmploymentLocation,
                res => {
                    employmentGroupDropdownData = res.map(group => {
                        var id = `employmentGr-${group.GroupCode}-${group.RetrieveID}`; 
                        var value = `${group.GroupCode}-${group.RetrieveID}`;
                        var text = group.GroupName;
                        return {
                            id,
                            value,
                            text,
                        };
                    });
                    resolve('success');
                },
            );
        });

        communicationTypeDropdownData = ([
            { value: '1', text: 'Letter / Mail.' },
            { value: '2', text: 'Phone Call.' },
            { value: '3', text: 'Text.' },
            { value: '4', text: 'Email.' },
            { value: '5', text: 'Social Media.' },
            { value: '6', text: 'Video Meeting.' },
            { value: '7', text: 'Other.' },
        ]);

        Promise.all([
            dayServiceLocationPromise,
            workshopLocationPromise,
            timeClockLocationPromise,
            rosterLocPromise,
            rosterGroupPromise,
            moneyManagementLocationPromise,
            OODLocationPromise,
            outcomesLocationPromise,
            planLocPromise,
            planGroupPromise,
            timeEntryLocPromise,
            timeEntryGroupPromise,
            formsLocPromise,
            formsGroupPromise,
            employmentLocPromise,
            employmentGroupPromise
        ]).then(() => {
            buildPage();
        });
    }

    function rememberLastLocation(module) {
        switch (module) {
            case 'roster': {
                if ($.session.defaultRosterLocationName === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'dayServices': {
                if ($.session.defaultDayServiceLocationName === 'Remember Last Location')
                    return true;
                else return false;
                break;
            }
            case 'timeClock': {
                if ($.session.defaultDSTimeClockName === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'workshop': {
                if ($.session.defaultWorkshopLocation === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'moneyManagement': {
                if ($.session.defaultMoneyManagementLocation === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'OOD': {
                if ($.session.defaultOODLocation === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'outcomes': {
                if ($.session.defaultOutcomesLocation === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'plan': {
                if ($.session.defaultPlanLocationName === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'timeEntry': {
                if ($.session.defaultTimeEntryLocationName === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'forms': {
                if ($.session.defaultFormsLocationName === 'Remember Last Location') return true;
                else return false;
                break;
            }
            case 'employment': {
                if ($.session.defaultEmploymentLocationName === 'Remember Last Location') return true;
                else return false;
                break;
            }
            default: {
                return null;
                break;
            }
        }
    }

    function repopulateRosterGroupDropdown(loc) {
        rosterGroupDropdown.classList.add('disabled');
        rosterGroupDropdownData = null;
        defaultsAjax.getConsumerGroups(loc, res => {
            rosterGroupDropdownData = res.map(group => {
                var id = `rosGr-${group.GroupCode}-${group.RetrieveID}`;
                var value = `${group.GroupCode}-${group.RetrieveID}`;
                var text = group.GroupName;
                return {
                    id,
                    value,
                    text,
                };
            });
            //If they don't have any defaults set, add a blank record to the dropdown.
            //This will force an update on change and NOT make it look like the have a default set, when they really don't.
            //Once they set a default, they can only set a new one, they can't change to no default. No default might break things.
            // if (getLocation("rosterGroup") === "") rosterGroupDropdownData.unshift({ id: "rosGr-0", value: null, text: "SELECT A GROUP" });
            setLocation('rosterGroup', `ALL-${loc}`);
            dropdown.populate(rosterGroupDropdown, rosterGroupDropdownData, `CAS-${loc}`);
            rosterGroupDropdown.classList.remove('disabled');
        });
    }

    function repopulatePlanGroupDropdown(loc) {
        planGroupDropdown.classList.add('disabled');
        planGroupDropdownData = null;
        defaultsAjax.getConsumerGroups(loc, res => {
            planGroupDropdownData = res.map(group => {
                var id = `planGr-${group.GroupCode}-${group.RetrieveID}`;
                var value = `${group.GroupCode}-${group.RetrieveID}`;
                var text = group.GroupName;
                return {
                    id,
                    value,
                    text,
                };
            });
            setLocation('planGroup', `CAS-${loc}`, 'Caseload');
            dropdown.populate(planGroupDropdown, planGroupDropdownData, `CAS-${loc}`);
            planGroupDropdown.classList.remove('disabled');
        });
    }

    function repopulateTimeEntryGroupDropdown(loc) {
        timeEntryGroupDropdown.classList.add('disabled');
        timeEntryGroupDropdownData = null;
        defaultsAjax.getConsumerGroups(loc, res => {
            timeEntryGroupDropdownData = res.map(group => {
                var id = `timeEntryGr-${group.GroupCode}-${group.RetrieveID}`;
                var value = `${group.GroupCode}-${group.RetrieveID}`;
                var text = group.GroupName;
                return {
                    id,
                    value,
                    text,
                };
            });
            setLocation('timeEntryGroup', `CAS-${loc}`, 'Caseload');
            dropdown.populate(timeEntryGroupDropdown, timeEntryGroupDropdownData, `CAS-${loc}`);
            timeEntryGroupDropdown.classList.remove('disabled');
        });
    }

    function repopulateFormsGroupDropdown(loc) {
        formsGroupDropdown.classList.add('disabled');
        formsGroupDropdownData = null;
        defaultsAjax.getConsumerGroups(loc, res => {
            formsGroupDropdownData = res.map(group => {
                var id = `formsGr-${group.GroupCode}-${group.RetrieveID}`;
                var value = `${group.GroupCode}-${group.RetrieveID}`;
                var text = group.GroupName;
                return {
                    id,
                    value,
                    text,
                };
            });
            setLocation('formsGroup', `CAS-${loc}`, 'Caseload');
            dropdown.populate(formsGroupDropdown, formsGroupDropdownData, `CAS-${loc}`);
            formsGroupDropdown.classList.remove('disabled');
        });
    }

    function repopulateEmploymentGroupDropdown(loc) {
        employmentGroupDropdown.classList.add('disabled');
        employmentGroupDropdownData = null;
        defaultsAjax.getConsumerGroups(loc, res => {
            employmentGroupDropdownData = res.map(group => {
                var id = `employmentGr-${group.GroupCode}-${group.RetrieveID}`;
                var value = `${group.GroupCode}-${group.RetrieveID}`;
                var text = group.GroupName;
                return {
                    id,
                    value,
                    text,
                };
            });
            setLocation('employmentGroup', `CAS-${loc}`, 'Caseload');
            dropdown.populate(employmentGroupDropdown, employmentGroupDropdownData, `CAS-${loc}`);
            employmentGroupDropdown.classList.remove('disabled');
        });
    }
    function buildPage() {
        var defaultsPage = document.querySelector('.util-menu__defaults');
        defaultsPage.innerHTML = '';

        const currMenu = document.createElement('p');
        currMenu.innerText = 'Defaults';
        currMenu.classList.add('menuTopDisplay');

        var rosterSection = document.createElement('div');
        var rosterSectionHeader = document.createElement('h3');
        rosterSection.classList.add('settingMenuCard');
        rosterSectionHeader.classList.add('header');
        rosterSectionHeader.innerHTML = 'Roster';

        var dayServiceSection = document.createElement('div');
        var dayServiceSectionHeader = document.createElement('h3');
        dayServiceSection.classList.add('settingMenuCard');
        dayServiceSectionHeader.classList.add('header');
        dayServiceSectionHeader.innerHTML = 'Day Services';

        var timeClockSection = document.createElement('div');
        var timeClockSectionHeader = document.createElement('h3');
        timeClockSection.classList.add('settingMenuCard');
        timeClockSectionHeader.classList.add('header');
        timeClockSectionHeader.innerHTML = 'Day Services Time Clock';

        var WorkshopSection = document.createElement('div');
        var WorkshopSectionHeader = document.createElement('h3');
        WorkshopSection.classList.add('settingMenuCard');
        WorkshopSectionHeader.classList.add('header');
        WorkshopSectionHeader.innerHTML = 'Workshop';

        var incidentTrackingSection = document.createElement('div');
        var incidentTrackingSectionHeader = document.createElement('h3');
        incidentTrackingSection.classList.add('settingMenuCard');
        incidentTrackingSectionHeader.classList.add('header');
        incidentTrackingSectionHeader.innerHTML = 'Incident Tracking';

        var moneyManagementSection = document.createElement('div');
        var moneyManagementSectionHeader = document.createElement('h3');
        moneyManagementSection.classList.add('settingMenuCard');
        moneyManagementSectionHeader.classList.add('header');
        moneyManagementSectionHeader.innerHTML = 'Money Management';

        var OODSection = document.createElement('div');
        var OODSectionHeader = document.createElement('h3');
        OODSection.classList.add('settingMenuCard');
        OODSectionHeader.classList.add('header');
        OODSectionHeader.innerHTML = 'OOD';

        var outcomesSection = document.createElement('div');
        var outcomesSectionHeader = document.createElement('h3');
        outcomesSection.classList.add('settingMenuCard');
        outcomesSectionHeader.classList.add('header');
        outcomesSectionHeader.innerHTML = 'Outcomes';

        var caseNotesSection = document.createElement('div');
        var caseNotesSectionHeader = document.createElement('h3');
        caseNotesSection.classList.add('settingMenuCard');
        caseNotesSectionHeader.classList.add('header');
        caseNotesSectionHeader.innerHTML = 'Case Notes';

        var planSection = document.createElement('div');
        var planSectionHeader = document.createElement('h3');
        planSection.classList.add('settingMenuCard');
        planSectionHeader.classList.add('header');
        planSectionHeader.innerHTML = 'Plan';

        var timeEntrySection = document.createElement('div');
        var timeEntrySectionHeader = document.createElement('h3');
        timeEntrySection.classList.add('settingMenuCard');
        timeEntrySectionHeader.classList.add('header');
        timeEntrySectionHeader.innerHTML = 'TimeEntry';

        var formsSection = document.createElement('div');
        var formsSectionHeader = document.createElement('h3');
        formsSection.classList.add('settingMenuCard');
        formsSectionHeader.classList.add('header');
        formsSectionHeader.innerHTML = 'Forms';

        var employmentSection = document.createElement('div');
        var employmentSectionHeader = document.createElement('h3');
        employmentSection.classList.add('settingMenuCard');
        employmentSectionHeader.classList.add('header');
        employmentSectionHeader.innerHTML = 'Employment';

        rosterLocationDropdown = dropdown.build({
            dropdownId: 'defaultRosterLocation',
            label: 'Default Location',
            style: 'secondary',
        });

        rosterRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: rosterRLL,
        });
        rosterGroupDropdown = dropdown.build({
            dropdownId: 'defaultRosterGroup',
            label: 'Default Group',
            style: 'secondary',
        });
        dayServicesLocationDropdown = dropdown.build({
            dropdownId: 'defaultDayServicesLocation',
            className: 'defaultLocationDD',
            label: 'Default Location',
            style: 'secondary',
        });

        dayServicesRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: dayServicesRLL,
        });
        timeClockLocationDropdown = dropdown.build({
            dropdownId: 'defaultTimeClockLocation',
            className: 'defaultLocationDD',
            label: 'Default Location',
            style: 'secondary',
        });

        timeClockRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: timeClockRLL,
        });
        WorkshopLocationDropdown = dropdown.build({
            dropdownId: 'defaultWorkshopLocation',
            className: 'defaultLocationDD',
            label: 'Default Location',
            style: 'secondary',
        });

        WorkshopRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: workshopRLL,
        });
        moneyManagementLocationDropdown = dropdown.build({
            dropdownId: 'defaultMoneyManagementLocation',
            className: 'defaultLocationDD',
            label: 'Default Location',
            style: 'secondary',
        });

        moneyManagementRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: moneyManagementRLL,
        });

        OODLocationDropdown = dropdown.build({
            dropdownId: 'defaultOODLocation',
            className: 'defaultLocationDD',
            label: 'Default Location',
            style: 'secondary',
        });

        OODRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: OODRLL,
        });

        outcomesLocationDropdown = dropdown.build({
            dropdownId: 'defaultOutcomesLocation',
            className: 'defaultLocationDD',
            label: 'Default Location',
            style: 'secondary',
        });

        outcomesRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: outcomesRLL,
        });

        var backButton = button.build({
            text: 'Back',
            icon: 'arrowBack',
            type: 'text',
            attributes: [{ key: 'data-action', value: 'back' }],
        });

        itDaysBackInput = input.build({
            id: 'itDaysBack',
            label: 'Days Back (max: 365)',
            type: 'number',
            style: 'secondary',
            attributes: [
                { key: 'min', value: '1' },
                { key: 'max', value: '365' },
                {
                    key: 'onkeypress',
                    value: 'return event.charCode >= 48 && event.charCode <= 57',
                },
            ],
            value: $.session.defaultIncidentTrackingDaysBack,
        });

        caseNotesDaysBackInput = input.build({
            id: 'cnDaysBack',
            label: 'Days Back (max: 99)',
            type: 'number',
            style: 'secondary',
            attributes: [
                { key: 'min', value: '1' },
                { key: 'max', value: '99' },
                {
                    key: 'onkeypress',
                    value: 'return event.charCode >= 48 && event.charCode <= 57',
                },
            ],
            value: $.session.defaultCaseNoteReviewDays,
        });

        progressNotesDaysBackInput = input.build({
            id: 'progNotesDaysBack',
            label: 'Progress Notes Days Back (max: 99)',
            type: 'number',
            style: 'secondary',
            attributes: [
                { key: 'min', value: '1' },
                { key: 'max', value: '999' },
                {
                    key: 'onkeypress',
                    value: 'return event.charCode >= 48 && event.charCode <= 57',
                },
            ],
            value: $.session.defaultProgressNoteReviewDays,
        });

        planLocationDropdown = dropdown.build({
            dropdownId: 'defaultPlanLocation',
            label: 'Default Location',
            style: 'secondary',
        });
        planRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: planRLL,
        });
        planGroupDropdown = dropdown.build({
            dropdownId: 'defaultPlanGroup',
            label: 'Default Group',
            style: 'secondary',
        });

        planConnectDropdown = dropdown.build({
            dropdownId: 'defaultPlanConnect',
            label: 'Best way to connect with the person',
            style: 'secondary',
        });

        timeEntryLocationDropdown = dropdown.build({
            dropdownId: 'defaultTimeEntryLocation',
            label: 'Default Location',
            style: 'secondary',
        });
        timeEntryRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: timeEntryRLL,
        });
        timeEntryGroupDropdown = dropdown.build({
            dropdownId: 'defaultTimeEntryGroup',
            label: 'Default Group',
            style: 'secondary',
        });

        formsLocationDropdown = dropdown.build({
            dropdownId: 'defaultFormsLocation',
            label: 'Default Location',
            style: 'secondary',
        });
        formsRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: formsRLL,
        });
        formsGroupDropdown = dropdown.build({
            dropdownId: 'defaultFormsGroup',
            label: 'Default Group',
            style: 'secondary',
        });


        employmentLocationDropdown = dropdown.build({
            dropdownId: 'defaultEmploymentLocation',
            label: 'Default Location',
            style: 'secondary',
        });
        employmentRLLCheckBox = input.buildCheckbox({
            text: 'Remember Last Location',
            className: 'rllCheckBox',
            style: 'secondary',
            isChecked: employmentRLL,
        });
        employmentGroupDropdown = dropdown.build({
            dropdownId: 'defaultEmploymentGroup',
            label: 'Default Group',
            style: 'secondary',
        });

        //Display for current menu
        defaultsPage.appendChild(currMenu);

        //if remember last location is enabled, disable the location dropdown
        if (rosterRLL) rosterLocationDropdown.classList.add('disabled');
        if (rosterRLL) rosterGroupDropdown.classList.add('disabled');
        if (dayServicesRLL) dayServicesLocationDropdown.classList.add('disabled');
        if (timeClockRLL) timeClockLocationDropdown.classList.add('disabled');
        if (workshopRLL) WorkshopLocationDropdown.classList.add('disabled');
        if (moneyManagementRLL) moneyManagementLocationDropdown.classList.add('disabled');
        if (OODRLL) OODLocationDropdown.classList.add('disabled');
        if (outcomesRLL) outcomesLocationDropdown.classList.add('disabled');
        if (planRLL) planLocationDropdown.classList.add('disabled');
        if (planRLL) planGroupDropdown.classList.add('disabled');
        if (timeEntryRLL) timeEntryLocationDropdown.classList.add('disabled');
        if (timeEntryRLL) timeEntryGroupDropdown.classList.add('disabled');

        if (formsRLL) formsLocationDropdown.classList.add('disabled');
        if (formsRLL) formsGroupDropdown.classList.add('disabled');
        if (employmentRLL) employmentLocationDropdown.classList.add('disabled');
        if (employmentRLL) employmentGroupDropdown.classList.add('disabled');

        //checkbox div and wraper for right justification
        rosterChecboxDiv = document.createElement('div');
        dayServicesChecboxDiv = document.createElement('div');
        timeClockChecboxDiv = document.createElement('div');
        workshopChecboxDiv = document.createElement('div');
        moneyManagementChecboxDiv = document.createElement('div');
        OODChecboxDiv = document.createElement('div');
        outcomesChecboxDiv = document.createElement('div');
        planChecboxDiv = document.createElement('div');
        timeEntryChecboxDiv = document.createElement('div');
        formsChecboxDiv = document.createElement('div');
        employmentChecboxDiv = document.createElement('div');
        rosterChecboxDiv.classList.add('checkboxWrap');
        dayServicesChecboxDiv.classList.add('checkboxWrap');
        timeClockChecboxDiv.classList.add('checkboxWrap');
        workshopChecboxDiv.classList.add('checkboxWrap');
        moneyManagementChecboxDiv.classList.add('checkboxWrap');
        OODChecboxDiv.classList.add('checkboxWrap');
        outcomesChecboxDiv.classList.add('checkboxWrap');
        planChecboxDiv.classList.add('checkboxWrap');
        timeEntryChecboxDiv.classList.add('checkboxWrap');
        formsChecboxDiv.classList.add('checkboxWrap');
        employmentChecboxDiv.classList.add('checkboxWrap');

        rosterChecboxDiv.appendChild(rosterRLLCheckBox);
        dayServicesChecboxDiv.appendChild(dayServicesRLLCheckBox);
        outcomesChecboxDiv.appendChild(outcomesRLLCheckBox);
        timeClockChecboxDiv.appendChild(timeClockRLLCheckBox);
        workshopChecboxDiv.appendChild(WorkshopRLLCheckBox);
        moneyManagementChecboxDiv.appendChild(moneyManagementRLLCheckBox);
        OODChecboxDiv.appendChild(OODRLLCheckBox);
        planChecboxDiv.appendChild(planRLLCheckBox);
        timeEntryChecboxDiv.appendChild(timeEntryRLLCheckBox);
        formsChecboxDiv.appendChild(formsRLLCheckBox);
        employmentChecboxDiv.appendChild(employmentRLLCheckBox);

        //roster settigns
        rosterSection.appendChild(rosterSectionHeader);
        rosterSection.appendChild(rosterLocationDropdown);
        rosterSection.appendChild(rosterChecboxDiv);
        rosterSection.appendChild(rosterGroupDropdown);
        rosterSection.appendChild(progressNotesDaysBackInput);

        // day service settings
        dayServiceSection.appendChild(dayServiceSectionHeader);
        dayServiceSection.appendChild(dayServicesLocationDropdown);
        dayServiceSection.appendChild(dayServicesChecboxDiv);

        //outcomes settings
        outcomesSection.appendChild(outcomesSectionHeader);
        outcomesSection.appendChild(outcomesLocationDropdown);
        outcomesSection.appendChild(outcomesChecboxDiv);

        //time clock settings
        timeClockSection.appendChild(timeClockSectionHeader);
        timeClockSection.appendChild(timeClockLocationDropdown);
        timeClockSection.appendChild(timeClockChecboxDiv);

        //workshop settings
        if ($.session.applicationName === 'Advisor') {
            WorkshopSection.appendChild(WorkshopSectionHeader);
            WorkshopSection.appendChild(WorkshopLocationDropdown);
            WorkshopSection.appendChild(workshopChecboxDiv);
        }

        //Incitent Tracking Settings
        if ($.session.applicationName === 'Advisor') {
            incidentTrackingSection.appendChild(incidentTrackingSectionHeader);
            incidentTrackingSection.appendChild(itDaysBackInput);
        }

        //moneyManagement settings
        if ($.session.applicationName === 'Advisor') {
            moneyManagementSection.appendChild(moneyManagementSectionHeader);
            moneyManagementSection.appendChild(moneyManagementLocationDropdown);
            moneyManagementSection.appendChild(moneyManagementChecboxDiv);
        }

        //OOD settings
        if ($.session.applicationName === 'Advisor') {
            OODSection.appendChild(OODSectionHeader);
            OODSection.appendChild(OODLocationDropdown);
            OODSection.appendChild(OODChecboxDiv);
        }

        //case notes settings
        caseNotesSection.appendChild(caseNotesSectionHeader);
        caseNotesSection.appendChild(caseNotesDaysBackInput);

        //timeEntry settigns
        timeEntrySection.appendChild(timeEntrySectionHeader);
        timeEntrySection.appendChild(timeEntryLocationDropdown);
        timeEntrySection.appendChild(timeEntryChecboxDiv);
        timeEntrySection.appendChild(timeEntryGroupDropdown);

        //Forms
        formsSection.appendChild(formsSectionHeader);
        formsSection.appendChild(formsLocationDropdown);
        formsSection.appendChild(formsChecboxDiv);
        formsSection.appendChild(formsGroupDropdown);

        //Employment settings
        employmentSection.appendChild(employmentSectionHeader);
        employmentSection.appendChild(employmentLocationDropdown);
        employmentSection.appendChild(employmentChecboxDiv);
        employmentSection.appendChild(employmentGroupDropdown);

        //plan settigns
        planSection.appendChild(planSectionHeader);
        planSection.appendChild(planLocationDropdown);
        planSection.appendChild(planChecboxDiv);
        planSection.appendChild(planGroupDropdown);
        planSection.appendChild(planConnectDropdown);

        defaultsPage.appendChild(backButton);
        defaultsPage.appendChild(rosterSection);
        defaultsPage.appendChild(dayServiceSection);
        defaultsPage.appendChild(outcomesSection);
        defaultsPage.appendChild(caseNotesSection);
        if ($.session.applicationName === 'Advisor') {
            defaultsPage.appendChild(timeEntrySection);
        }
        defaultsPage.appendChild(planSection);
        if ($.session.applicationName === 'Gatekeeper')
            defaultsPage.appendChild(formsSection);
        if ($.session.applicationName === 'Gatekeeper')
            defaultsPage.appendChild(employmentSection);

        if ($.session.dsCertified) defaultsPage.appendChild(timeClockSection);
        if ($.session.applicationName === 'Advisor')
            defaultsPage.appendChild(WorkshopSection);
        if ($.session.applicationName === 'Advisor')
            defaultsPage.appendChild(incidentTrackingSection);
        if ($.session.applicationName === 'Advisor')
            defaultsPage.appendChild(formsSection);
        if ($.session.applicationName === 'Advisor')
            defaultsPage.appendChild(employmentSection);
        if ($.session.applicationName === 'Advisor')
            defaultsPage.appendChild(OODSection);
        if ($.session.applicationName === 'Advisor')
            defaultsPage.appendChild(moneyManagementSection);

        rosterLocationDropdown.classList.add('defaultLocationDD');
        dayServicesLocationDropdown.classList.add('defaultLocationDD');
        timeClockLocationDropdown.classList.add('defaultLocationDD');
        WorkshopLocationDropdown.classList.add('defaultLocationDD');
        moneyManagementLocationDropdown.classList.add('defaultLocationDD');
        OODLocationDropdown.classList.add('defaultLocationDD');
        outcomesLocationDropdown.classList.add('defaultLocationDD');
        planLocationDropdown.classList.add('defaultLocationDD');
        timeEntryLocationDropdown.classList.add('defaultLocationDD');
        formsLocationDropdown.classList.add('defaultLocationDD');
        employmentLocationDropdown.classList.add('defaultLocationDD');
        //RESET roster group to all if they have roster remember last location enabled. this is incase they change location but their selected default group is not in that location
        if (rosterRLL && $.session.defaultRosterGroupValue !== 'ALL')
            setLocation('rosterGroup', 'ALL');

        //populate
        //
        dropdown.populate(
            rosterLocationDropdown,
            rosterLocDropdownData,
            $.session.defaultRosterLocation === 'null' ? '' : $.session.defaultRosterLocation,
        );

        dropdown.populate(
            rosterGroupDropdown,
            rosterGroupDropdownData,
            $.session.defaultRosterGroupValue,
        );

        dropdown.populate(
            dayServicesLocationDropdown,
            dayServiceDropdownData,
            $.session.defaultDayServiceLocation,
        );

        dropdown.populate(
            WorkshopLocationDropdown,
            workshopDropdownData,
            $.session.defaultWorkshopLocationValue,
        );
        dropdown.populate(
            moneyManagementLocationDropdown,
            moneyManagementDropdownData,
            $.session.defaultMoneyManagementLocationValue,
        );

        dropdown.populate(
            OODLocationDropdown,
            OODDropdownData,
            $.session.defaultOODLocationValue,
        );

        dropdown.populate(
            outcomesLocationDropdown,
            outcomesDropdownData,
            $.session.defaultOutcomesLocationValue,
        );

        dropdown.populate(
            planLocationDropdown,
            planLocDropdownData,
            $.session.defaultPlanLocation === 'null' ? '' : $.session.defaultPlanLocation,
        );

        dropdown.populate(
            planGroupDropdown,
            planGroupDropdownData,
            $.session.defaultPlanGroupValue,
        );

        dropdown.populate(
            timeEntryLocationDropdown,
            timeEntryLocDropdownData,
            $.session.defaultTimeEntryLocation === 'null' ? '' : $.session.defaultTimeEntryLocation,
        );

        dropdown.populate(
            timeEntryGroupDropdown,
            timeEntryGroupDropdownData,
            $.session.defaultTimeEntryGroupValue,
        );
 
        dropdown.populate(
            formsLocationDropdown,
            formsLocDropdownData,
            $.session.defaultFormsLocation === 'null' ? '' : $.session.defaultFormsLocation,
        );

        dropdown.populate(
            formsGroupDropdown,
            formsGroupDropdownData,
            $.session.defaultFormsGroupValue,
        );

        dropdown.populate(
            employmentLocationDropdown,
            employmentLocDropdownData,
            $.session.defaultEmploymentLocation === 'null' ? '' : $.session.defaultEmploymentLocation,
        );

        dropdown.populate(
            employmentGroupDropdown,
            employmentGroupDropdownData,
            $.session.defaultEmploymentGroupValue,
        );

        if ($.session.defaultContact !== '')
            dropdown.populate(planConnectDropdown, communicationTypeDropdownData, $.session.defaultContact);
        else
            dropdown.populate(planConnectDropdown, communicationTypeDropdownData);

        if ($.session.dsCertified)
            dropdown.populate(
                timeClockLocationDropdown,
                timeClockDropdownData,
                $.session.defaultDSTimeClockValue,
            );
        addEventListeners();
    }

    function checkInitialRememberLastLocation() {
        rosterRLL = rememberLastLocation('roster');
        dayServicesRLL = rememberLastLocation('dayServices');
        timeClockRLL = rememberLastLocation('timeClock');
        workshopRLL = rememberLastLocation('workshop');
        moneyManagementRLL = rememberLastLocation('moneyManagement');
        OODRLL = rememberLastLocation('OOD');
        outcomesRLL = rememberLastLocation('outcomes');
        planRLL = rememberLastLocation('plan');
        timeEntryRLL = rememberLastLocation('timeEntry');
        formsRLL = rememberLastLocation('forms');
        employmentRLL = rememberLastLocation('employment');
    }

    function addEventListeners() {
        //=====
        //ROSTER
        progressNotesDaysBackInput.addEventListener('change', () => {
            let newVal = parseInt(event.target.value);
            if (newVal <= 999 && newVal >= 1) {
                defaultsAjax.updateConsumerNotesDaysBack(newVal);
            }
        });
        rosterLocationDropdown.addEventListener('change', () => {
            setLocation('roster', event.target.options[event.target.selectedIndex].value);
            repopulateRosterGroupDropdown(
                event.target.options[event.target.selectedIndex].value,
            );
            //Reset roster group to all
            setLocation('rosterGroup', 'ALL', 'Everyone');
        });
        rosterRLLCheckBox.addEventListener('change', () => {
            rosterRLL = !rosterRLL;
            setRememberLastLocation('roster');

            if (rosterRLL) {
                groupDropdownOptions = document.getElementById('defaultRosterGroup');
                rosterLocationDropdown.classList.add('disabled');
                rosterGroupDropdown.classList.add('disabled');
                groupDropdownOptions.selectedIndex = 'ALL';
                setLocation('rosterGroup', 'ALL', 'Everyone');
            } else {
                rosterLocationDropdown.classList.remove('disabled');
                rosterGroupDropdown.classList.remove('disabled');
            }
        });
        rosterGroupDropdown.addEventListener('change', () => {
            setLocation(
                'rosterGroup',
                event.target.options[event.target.selectedIndex].value,
                event.target.options[event.target.selectedIndex].innerHTML,
            );
        });
        //=====
        //WORKSHOP
        WorkshopLocationDropdown.addEventListener('change', () => {
            setLocation('workshop', event.target.options[event.target.selectedIndex].value);
        });
        WorkshopRLLCheckBox.addEventListener('change', () => {
            workshopRLL = !workshopRLL;
            setRememberLastLocation('workshop');
            if (workshopRLL) WorkshopLocationDropdown.classList.add('disabled');
            else WorkshopLocationDropdown.classList.remove('disabled');
        });
        //=====
        //MONEY MANAGEMENT
        moneyManagementLocationDropdown.addEventListener('change', () => {
            if (!moneyManagementLocationDropdown.classList.contains('disabled')) {
                setLocation('moneyManagement', event.target.options[event.target.selectedIndex].value);
            }
            else {
                document.getElementById('defaultMoneyManagementLocation').value = $.session.defaultMoneyManagementLocationValue;
            }
        });
        moneyManagementRLLCheckBox.addEventListener('change', () => {
            moneyManagementRLL = !moneyManagementRLL;
            setRememberLastLocation('moneyManagement');
            if (moneyManagementRLL) moneyManagementLocationDropdown.classList.add('disabled');
            else moneyManagementLocationDropdown.classList.remove('disabled');
        });
        //=====
        //OOD
        OODLocationDropdown.addEventListener('change', () => {
            if (!OODLocationDropdown.classList.contains('disabled')) {
                setLocation('OOD', event.target.options[event.target.selectedIndex].value);
            }
            else {
                document.getElementById('defaultOODLocation').value = $.session.defaultOODLocationValue;
            }
        });
        OODRLLCheckBox.addEventListener('change', () => {
            OODRLL = !OODRLL;
            setRememberLastLocation('OOD');
            if (OODRLL) OODLocationDropdown.classList.add('disabled');
            else OODLocationDropdown.classList.remove('disabled');
        });
        //=====
        //outcomes
        outcomesLocationDropdown.addEventListener('change', () => {
            if (!outcomesLocationDropdown.classList.contains('disabled')) {
                setLocation('outcomes', event.target.options[event.target.selectedIndex].value);
            }
            else {
                document.getElementById('defaultOutcomesLocation').value = $.session.defaultOutcomesLocationValue;
            }
        });
        outcomesRLLCheckBox.addEventListener('change', () => {
            outcomesRLL = !outcomesRLL;
            setRememberLastLocation('outcomes');
            if (outcomesRLL) outcomesLocationDropdown.classList.add('disabled');
            else outcomesLocationDropdown.classList.remove('disabled');
        });
        //=====
        // PLAN
        planLocationDropdown.addEventListener('change', () => {
            setLocation('plan', event.target.options[event.target.selectedIndex].value);
            repopulatePlanGroupDropdown(
                event.target.options[event.target.selectedIndex].value,
            );
            setLocation('planGroup', 'ALL', 'Everyone');
        });
        planRLLCheckBox.addEventListener('change', () => {
            planRLL = !planRLL;
            setRememberLastLocation('plan');

            if (planRLL) {
                groupDropdownOptions = document.getElementById('defaultPlanGroup');
                planLocationDropdown.classList.add('disabled');
                planGroupDropdown.classList.add('disabled');
                groupDropdownOptions.selectedIndex = 'ALL';
                setLocation('planGroup', 'ALL', 'Everyone');
            } else {
                planLocationDropdown.classList.remove('disabled');
                planGroupDropdown.classList.remove('disabled');
            }
        });
        planGroupDropdown.addEventListener('change', () => {
            setLocation(
                'planGroup',
                event.target.options[event.target.selectedIndex].value,
                event.target.options[event.target.selectedIndex].innerHTML,
            );
        });
        planConnectDropdown.addEventListener('change', () => {
            defaultsAjax.updateConnectWithPerson(event.target.options[event.target.selectedIndex].value);
        });
        //=====
        // TIME ENTRY
        timeEntryLocationDropdown.addEventListener('change', () => {
            setLocation('timeEntry', event.target.options[event.target.selectedIndex].value);
            repopulateTimeEntryGroupDropdown(
                event.target.options[event.target.selectedIndex].value,
            );
            setLocation('timeEntryGroup', 'ALL', 'Everyone');
        });
        timeEntryRLLCheckBox.addEventListener('change', () => {
            timeEntryRLL = !timeEntryRLL;
            setRememberLastLocation('timeEntry');

            if (timeEntryRLL) {
                groupDropdownOptions = document.getElementById('defaultTimeEntryGroup');
                timeEntryLocationDropdown.classList.add('disabled');
                timeEntryGroupDropdown.classList.add('disabled');
                groupDropdownOptions.selectedIndex = 'ALL';
                setLocation('timeEntryGroup', 'ALL', 'Everyone');
            } else {
                timeEntryLocationDropdown.classList.remove('disabled');
                timeEntryGroupDropdown.classList.remove('disabled');
            }
        });
        timeEntryGroupDropdown.addEventListener('change', () => {
            setLocation(
                'timeEntryGroup',
                event.target.options[event.target.selectedIndex].value,
                event.target.options[event.target.selectedIndex].innerHTML,
            );
        });
        //=====
        // FORMS
        formsLocationDropdown.addEventListener('change', () => {
            setLocation('forms', event.target.options[event.target.selectedIndex].value);
            repopulateFormsGroupDropdown(
                event.target.options[event.target.selectedIndex].value,
            );
            setLocation('formsGroup', 'ALL', 'Everyone');
        });
        formsRLLCheckBox.addEventListener('change', () => {
            formsRLL = !formsRLL;
            setRememberLastLocation('forms');

            if (formsRLL) {
                groupDropdownOptions = document.getElementById('defaultFormsGroup');
                formsLocationDropdown.classList.add('disabled');
                formsGroupDropdown.classList.add('disabled');
                groupDropdownOptions.selectedIndex = 'ALL';
                setLocation('formsGroup', 'ALL', 'Everyone');
            } else {
                formsLocationDropdown.classList.remove('disabled');
                formsGroupDropdown.classList.remove('disabled');
            }
        });
        formsGroupDropdown.addEventListener('change', () => {
            setLocation(
                'formsGroup',
                event.target.options[event.target.selectedIndex].value,
                event.target.options[event.target.selectedIndex].innerHTML,
            );
        });
        //=====
        // EMPLOYMENT
        employmentLocationDropdown.addEventListener('change', () => {
            setLocation('employment', event.target.options[event.target.selectedIndex].value);
            repopulateEmploymentGroupDropdown(
                event.target.options[event.target.selectedIndex].value,
            );
            setLocation('employmentGroup', 'ALL', 'Everyone');
        });
        employmentRLLCheckBox.addEventListener('change', () => {
            employmentRLL = !employmentRLL;
            setRememberLastLocation('employment');

            if (employmentRLL) {
                groupDropdownOptions = document.getElementById('defaultEmploymentGroup');
                employmentLocationDropdown.classList.add('disabled');
                employmentGroupDropdown.classList.add('disabled');
                groupDropdownOptions.selectedIndex = 'ALL';
                setLocation('employmentGroup', 'ALL', 'Everyone');
            } else {
                employmentLocationDropdown.classList.remove('disabled');
                employmentGroupDropdown.classList.remove('disabled');
            }
        });
        employmentGroupDropdown.addEventListener('change', () => {
            setLocation(
                'employmentGroup',
                event.target.options[event.target.selectedIndex].value,
                event.target.options[event.target.selectedIndex].innerHTML,
            );
        });
        //=====
        // DAY SERVICES
        dayServicesLocationDropdown.addEventListener('change', () => {
            setLocation('dayServices', event.target.options[event.target.selectedIndex].value);
        });

        dayServicesRLLCheckBox.addEventListener('change', () => {
            dayServicesRLL = !dayServicesRLL;
            setRememberLastLocation('dayServices');
            if (dayServicesRLL) dayServicesLocationDropdown.classList.add('disabled');
            else dayServicesLocationDropdown.classList.remove('disabled');
        });
        //=====
        //INCIDENT TRACKING
        itDaysBackInput.addEventListener('change', () => {
            let newVal = parseInt(event.target.value);
            if (newVal <= 365 && newVal >= 1) {
                $.session.defaultIncidentTrackingDaysBack = newVal;
                defaultsAjax.updateIncidentTrackingDaysBack(newVal);
            }
        });
        //=====
        //CASE NOTES
        caseNotesDaysBackInput.addEventListener('change', () => {
            let newVal = parseInt(event.target.value);
            if (newVal <= 99 && newVal >= 1) {
                $.session.defaultCaseNoteReviewDays = newVal;
                defaultsAjax.updateCaseNotesDaysBack(newVal);
            }
        });

        //=====
        //DS TIME CLOCK (NEED TO BE DAY SERVICE CERTIFIED TO USE)
        if ($.session.dsCertified) {
            timeClockLocationDropdown.addEventListener('change', () => {
                setLocation('timeClock', event.target.options[event.target.selectedIndex].value);
            });
            timeClockRLLCheckBox.addEventListener('change', () => {
                timeClockRLL = !timeClockRLL;
                setRememberLastLocation('timeClock');
                if (timeClockRLL) timeClockLocationDropdown.classList.add('disabled');
                else timeClockLocationDropdown.classList.remove('disabled');
            });
        }
    }
    // Checks DB for any default locations that have been inactivated
    // Resets those locations back to null, and displays a message with locations that were reset
    async function getInvalidDefaultLocations() {
        const invalidDefaults = await defaultsAjax.getInvalidDefaults();

        if (invalidDefaults == undefined || invalidDefaults.length === 0) return; 

        // BUILD POPUP
        const invalidDefaultNotificationPopup = POPUP.build({
            id: 'invalidDefaultPopup',
        });

        const continueBtn = button.build({
            id: 'invalidDefaultContinueBtn',
            text: 'Continue',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(invalidDefaultNotificationPopup);
            },
        });

        continueBtn.style.width = '100%';

        // MAIN MESSAGE
        const message = document.createElement('div');
        message.classList.add('invalidDefaultMessage');
        message.innerHTML = `<p>
    Some of your default locations are no longer available to view in Anywhere.<br><br>
    Go to ${icons.ellipsis}<span style="font-weight: 700;"> > Set Defaults</span> to select a new default location.<br><hr>
    </p>`;

        const listHeader = document.createElement('p');
        listHeader.innerText = 'Locations that were reset:';
        listHeader.classList.add('invalidDefaultListHeader');

        // LIST OF INVALID LOCATIONS
        const list = document.createElement('ul');
        list.classList.add('invalidDefaultList');

        invalidDefaults.forEach(def => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>Location Name:</span> ${def.locationName}<br><span>As Your:</span> ${def.moduleDefault}`;
            list.appendChild(listItem);
        });

        // APPEND AND SHOW POPUP
        invalidDefaultNotificationPopup.appendChild(message);
        invalidDefaultNotificationPopup.appendChild(listHeader);
        invalidDefaultNotificationPopup.appendChild(list);
        invalidDefaultNotificationPopup.appendChild(continueBtn);

        POPUP.show(invalidDefaultNotificationPopup);

        //RESET VALUES
        invalidDefaults.forEach(def => {
            switch (def.moduleDefault) {
                case 'Default Roster Location':
                    setLocation('roster', '');
                    setLocation('rosterGroup', '');
                    break;
                case 'Default Day Services Location':
                    setLocation('dayServices', '');
                    break;
                case 'Default Time Clock Location':
                    setLocation('timeClock', '');
                    break;
                case 'Default Workshop Location':
                    setLocation('workshop', '');
                    break;
                case 'Default MoneyManagement Location':
                    setLocation('moneyManagement', '');
                    break;
                case 'Default Plan Location':
                    setLocation('plan', '');
                    setLocation('planGroup', '');
                    break;
                case 'Default OOD Location':
                    setLocation('OOD', '');
                    break;
                case 'Default Outcomes Location':
                    setLocation('outcomes', '');
                    break;
                case 'Default TimeEntry Location':
                    setLocation('timeEntry', '');
                    setLocation('timeEntryGroup', '');
                    break;
                case 'Default Forms Location':
                    setLocation('forms', '');
                    setLocation('formsGroup', '');
                    break;
                case 'Default Employment Location':
                    setLocation('employment', '');
                    setLocation('employmentGroup', '');
                    break;
                default:
                    console.warn(`couldn't reset a default location`);
                    break;
            }
        });
    }

    function init() {
        checkInitialRememberLastLocation();
        dropdownData();
    }

    return {
        init,
        buildPage,
        getLocation,
        getGroup,
        getInvalidDefaultLocations,
        setLocation,
        setGroup,
        rememberLastLocation,
    };
})();
