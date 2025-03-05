var timeEntry = (function () {
    var adminPayPeriods = [];
    var payPeriods = [];
    var currentAdminPayPeriod;
    var currentPayPeriod;
    var currentAdminDate;
    var currentDate;
    var locations;
    var residenceLocations;
    var workCodes;
    var evvReasonCodes;
    var crossmidnightisadminedit;
    var crossmidnightpayperiod;
    let saveAndSubmit;
    // required fields
    var requiredFields = {
        isDestinationRequired: '',
        isOriginationRequired: '',
        isNoteRequired: '',
        isOdometerRequired: '',
        isLicensePlateRequired: '',
        isReasonRequired: '',
        supervisorApproval: '',
        reconfigImportFile: '',
        useFiveCharWorkCode: '',
    };

    // overlapping locations variables
    let overlapLocationsPopup;
    let overlapLocationsDropdown;
    let overlapLocationsDoneBtn;
    //let locationId = '';
    let duplicateconsumerIds;
    let consumerswithUniqueLocations;
    let consumerswithMultipleLocations;
    let overlapconsumerlocationdata;
    let selectedOverlapLocIds = {};

    // Save, Update, Delete
    //------------------------------------
    function getEntryData(keyStartStop, saveAndSubmitBool) {
        saveAndSubmit = saveAndSubmitBool;
        if (keyStartStop === 'Y') {
            var overlapData = timeEntryCard.getOverlapData();
            singleEntryAjax.singleEntryOverlapCheck(overlapData, function (results) {
                if (results.length > 0) {
                    showOverlapPopup();
                } else {
                    $.session.singleEntrycrossMidnight
                        ? showMultipleEntriesPopup()
                        : getEntryData('', saveAndSubmit);
                }
            });

            return;
        }

        let saveData = timeEntryCard.getSaveUpdateData();

        if ($.session.singleEntrycrossMidnight === false || !saveData.endTime) {
            saveEntryData(saveData);
        } else {
            // entry crosses midnight, meaning two entries need tp be saved to DB

            // first day entry in the database
            let saveData1 = timeEntryCard.getSaveUpdateData();
            saveData1.checkHours = saveData1.crossMidnightCheckHours[0].day1TotalHours;
            saveData1.endTime = '00:00';

            if (!saveData1.defaultStartTimeChanged) {
                saveData1.evvReason = '';
                checkDeviceType() === 'Mobile'
                    ? (saveData1.deviceType = 'Mobile')
                    : (saveData1.deviceType = 'Other');
            }

            //saveEntryData(saveData1);

            // second day entry in the database
            let saveData2 = timeEntryCard.getSaveUpdateData();
            saveData2.checkHours = saveData2.crossMidnightCheckHours[1].day2TotalHours;
            saveData2.startTime = '00:00';

            // transportation only saved with the first day entry
            saveData2.destination = '';
            saveData2.origination = '';
            saveData2.licensePlateNumber = '';
            saveData2.odometerEnd = '';
            saveData2.odometerStart = '';
            saveData2.reason = '';
            saveData2.transportationReimbursable = '';
            saveData2.transportationUnits = 0;

            // * Date Constructor Doc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
            // * Note on constructing date on date string is highly discouraged due to browser differences and inconsistencies.
            // * This was the issue for the crossing over midnight issue in older versions of safari.
            const year = parseInt(saveData2.dateOfService.split('-')[0]);
            const month = parseInt(saveData2.dateOfService.split('-')[1]);
            const day = parseInt(saveData2.dateOfService.split('-')[2]);
            var nextDay = new Date(year, month - 1, day);
            nextDay.setDate(nextDay.getDate() + 1);

            var dd = ('0' + nextDay.getDate()).slice(-2);
            var mm = ('0' + (nextDay.getMonth() + 1)).slice(-2);
            var yyyy = nextDay.getFullYear();

            saveData2.dateOfService = yyyy + '-' + mm + '-' + dd;

            if (!saveData2.defaultEndTimeChanged) {
                saveData2.evvReason = '';
                checkDeviceType() === 'Mobile'
                    ? (saveData2.deviceType = 'Mobile')
                    : (saveData2.deviceType = 'Other');
            }

            saveEntryData(saveData1, saveData2);
        }
    }
    function saveEntryData(saveData, saveData2) {
        if (saveData.locationId !== '' || saveData.consumerId === '') {
            if (saveAndSubmit) {
                var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;

                showWarningPopup(warningMessage, () => {
                    singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
                        const entryId = results[1].replace('</', '');
                        const updateObj = {
                            token: $.session.Token,
                            singleEntryIdString: entryId,
                            newStatus: 'S',
                        };

                        singleEntryAjax.updateSingleEntryStatus(updateObj, function () {
                            if (!saveData2) {
                                successfulSave.show('SAVED & SUBMITTED');
                                setTimeout(function () {
                                    successfulSave.hide();
                                    timeEntryCard.clearAllGlobalVariables();
                                    roster2.clearActiveConsumers();
                                    newTimeEntry.init(true);
                                }, 1000);
                            } else {
                                singleEntryAjax.insertSingleEntryNew(saveData2, function (results2) {
                                    const entryId2 = results2[1].replace('</', '');
                                    const updateObj2 = {
                                        token: $.session.Token,
                                        singleEntryIdString: entryId2,
                                        newStatus: 'S',
                                    };

                                    singleEntryAjax.updateSingleEntryStatus(updateObj2, function () {
                                        successfulSave.show('SAVED & SUBMITTED');
                                        setTimeout(function () {
                                            successfulSave.hide();
                                            timeEntryCard.clearAllGlobalVariables();
                                            roster2.clearActiveConsumers();
                                            newTimeEntry.init(true);
                                        }, 1000);
                                    });
                                });
                            }
                        });
                    });
                });
            } else {
                singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
                    if (!saveData2) {
                        successfulSave.show('SAVED');
                        setTimeout(function () {
                            successfulSave.hide();
                            timeEntryCard.clearAllGlobalVariables();
                            roster2.clearActiveConsumers();
                            newTimeEntry.init(true);
                        }, 1000);
                    } else {
                        singleEntryAjax.insertSingleEntryNew(saveData2, function (results) {
                            successfulSave.show('SAVED');
                            setTimeout(function () {
                                successfulSave.hide();
                                timeEntryCard.clearAllGlobalVariables();
                                roster2.clearActiveConsumers();
                                newTimeEntry.init(true);
                            }, 1000);
                        });
                    }
                });
            }
        } else {
            if (saveAndSubmit) {
                var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;

                showWarningPopup(warningMessage, () => {
                    // 1. Grab the consumer/location data
                    singleEntryAjax.getSelectedConsumerLocations(saveData, function (results) {
                        overlapconsumerlocationdata = results;
                        // no location overlaps for any selected consumer
                        if (overlapconsumerlocationdata.length === 0) {
                            singleEntryAjax.preInsertSingleEntry(saveData, function (results) {
                                const idArray = results.map(r => r.singleEntryId);
                                const updateObj = {
                                    token: $.session.Token,
                                    singleEntryIdString: idArray.join(','),
                                    newStatus: 'S',
                                };

                                singleEntryAjax.updateSingleEntryStatus(updateObj, function () {
                                    if (!saveData2) {
                                        successfulSave.show('SAVED & SUBMITTED');
                                        setTimeout(function () {
                                            successfulSave.hide();
                                            timeEntryCard.clearAllGlobalVariables();
                                            roster2.clearActiveConsumers();
                                            newTimeEntry.init();
                                        }, 1000);
                                    } else {
                                        singleEntryAjax.preInsertSingleEntry(saveData2, function (results2) {
                                            const idArray = results2.map(r => r.singleEntryId);
                                            const updateObj2 = {
                                                token: $.session.Token,
                                                singleEntryIdString: idArray.join(','),
                                                newStatus: 'S',
                                            };

                                            singleEntryAjax.updateSingleEntryStatus(updateObj2, function () {
                                                successfulSave.show('SAVED & SUBMITTED');
                                                setTimeout(function () {
                                                    successfulSave.hide();
                                                    timeEntryCard.clearAllGlobalVariables();
                                                    roster2.clearActiveConsumers();
                                                    newTimeEntry.init();
                                                }, 1000);
                                            });
                                        });
                                    }
                                });
                            });
                        } else {
                            // location overlaps exist for a selected consumer
                            displayOverlapLocationsPopup(results);
                        }
                    });
                });
            } else {
                // Just the save BTN -- if (saveData.locationId !== '' || saveData.consumerId === '')

                // 1. Grab the consumer/location data
                singleEntryAjax.getSelectedConsumerLocations(saveData, function (results) {
                    overlapconsumerlocationdata = results;

                    // no location overlaps for any selected consumer
                    if (overlapconsumerlocationdata.length === 0) {
                        singleEntryAjax.preInsertSingleEntry(saveData, function (results) {
                            if (!saveData2) {
                                successfulSave.show('SAVED');
                                setTimeout(function () {
                                    successfulSave.hide();
                                    timeEntryCard.clearAllGlobalVariables();
                                    roster2.clearActiveConsumers();
                                    newTimeEntry.init();
                                }, 1000);
                            } else {
                                singleEntryAjax.preInsertSingleEntry(saveData2, function (results) {
                                    successfulSave.show('SAVED');
                                    setTimeout(function () {
                                        successfulSave.hide();
                                        timeEntryCard.clearAllGlobalVariables();
                                        roster2.clearActiveConsumers();
                                        newTimeEntry.init();
                                    }, 1000);
                                });
                            }
                        });
                    } else {
                        // location overlaps exist for a selected consumer
                        displayOverlapLocationsPopup(results);
                    }
                });
            }
        }
    }
    function updateSingleEntry(isAdminEdit, payPeriod, updateData) {
        singleEntryAjax.updateSingleEntry(updateData, function (results) {
            if (!saveAndSubmit) {
                // Orig Update
                if (!$.session.singleEntrycrossMidnight) {
                    successfulSave.show('UPDATED');
                }
                setTimeout(function () {
                    if (!$.session.singleEntrycrossMidnight) {
                        successfulSave.hide();
                    }
                    roster2.clearActiveConsumers();
                    timeEntryCard.clearAllGlobalVariables();

                    if (isAdminEdit) {
                        timeApproval.refreshPage(payPeriod);
                    } else {
                        timeEntryReview.refreshPage(payPeriod);
                    }
                }, 1000);
            } else {
                // Update w/Submit
                var updateObj = {
                    token: $.session.Token,
                    singleEntryIdString: updateData.singleEntryId,
                    newStatus: 'S',
                };
                var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;

                showWarningPopup(warningMessage, () => {
                    singleEntryAjax.updateSingleEntryStatus(updateObj, () => {
                        if (!$.session.singleEntrycrossMidnight) {
                            successfulSave.show('UPDATED & SUBMITTED');
                        }
                        setTimeout(function () {
                            if (!$.session.singleEntrycrossMidnight) {
                                successfulSave.hide();
                            }
                            roster2.clearActiveConsumers();
                            timeEntryCard.clearAllGlobalVariables();

                            if (isAdminEdit) {
                                timeApproval.refreshPage(payPeriod);
                            } else {
                                timeEntryReview.refreshPage(payPeriod);
                            }
                        }, 1000);
                    });
                });
            }
        });
    }
    function saveAndUpdateEntryForMidnightCross(saveData, updateData, isAdminEdit, payPeriod) {
        singleEntryAjax.updateSingleEntry(updateData, updateResults => {
            // Update w/Submit
            const updateObj1 = {
                token: $.session.Token,
                singleEntryIdString: updateData.singleEntryId,
                newStatus: 'S',
            };
            singleEntryAjax.insertSingleEntryNew(saveData, saveResults => {
                const updateObj2 = {
                    token: $.session.Token,
                    singleEntryIdString: saveResults[1].replace('</', ''),
                    newStatus: 'S',
                };

                if (saveAndSubmit) {
                    var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;
                    showWarningPopup(warningMessage, () => {
                        singleEntryAjax.updateSingleEntryStatus(updateObj1, () => {
                            singleEntryAjax.updateSingleEntryStatus(updateObj2, () => {
                                successfulSave.show('UPDATED & SUBMITTED');
                                setTimeout(function () {
                                    successfulSave.hide();
                                    timeEntryCard.clearAllGlobalVariables();
                                    roster2.clearActiveConsumers();

                                    if (isAdminEdit) {
                                        timeApproval.refreshPage(payPeriod);
                                    } else {
                                        timeEntryReview.refreshPage(payPeriod);
                                    }
                                }, 1000);
                            });
                        });
                    });
                } else {
                    successfulSave.show('UPDATED');
                    setTimeout(function () {
                        successfulSave.hide();
                        timeEntryCard.clearAllGlobalVariables();
                        roster2.clearActiveConsumers();

                        if (isAdminEdit) {
                            timeApproval.refreshPage(payPeriod);
                        } else {
                            timeEntryReview.refreshPage(payPeriod);
                        }
                    }, 1000);
                }
            });
        });
    }
    function updateEntry(isAdminEdit, payPeriod, keyStartStop, saveAndSubmitBool) {
        saveAndSubmit = saveAndSubmitBool;

        if (keyStartStop === 'Y') {
            if ($.session.singleEntrycrossMidnight) {
                crossmidnightisadminedit = isAdminEdit;
                crossmidnightpayperiod = payPeriod;
                showMultipleEntriesPopup('update');
                return;
            }
        }

        var saveData = timeEntryCard.getSaveUpdateData('Save');
        var updateData = timeEntryCard.getSaveUpdateData('Update');
        // update an entry that crosses midnight, results in update of original entry and a save of the new entry
        if ($.session.singleEntrycrossMidnight) {
            // may need overlapcheck on crossmidnight Update because saved record (2nd entry) may overlap with previous edits
            // if (keyStartStop === 'Y') {
            // 	var overlapData = timeEntryCard.getOverlapData();
            // 	singleEntryAjax.singleEntryOverlapCheck(overlapData, function(results) {
            // 		if (results.length > 0) {
            // 			showOverlapPopup('update');
            // 		}
            // 	});
            // 	return;
            // }

            // second day entry in the database -- SAVE
            saveData.checkHours = saveData.crossMidnightCheckHours[1].day2TotalHours;
            saveData.startTime = '00:00';

            // transportation only saved with the first day entry
            saveData.destination = '';
            saveData.origination = '';
            saveData.licensePlateNumber = '';
            saveData.odometerEnd = '';
            saveData.odometerStart = '';
            saveData.reason = '';
            saveData.transportationReimbursable = '';
            saveData.transportationUnits = 0;

            if (!saveData.defaultEndTimeChanged) {
                saveData.evvReason = '';
                checkDeviceType() === 'Mobile'
                    ? (saveData.deviceType = 'Mobile')
                    : (saveData.deviceType = 'Other');
            }
            // * Date Constructor Doc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
            // * Note on constructing date on date string is highly discouraged due to browser differences and inconsistencies.
            // * This was the issue for the crossing over midnight issue in older versions of safari.
            const year = parseInt(saveData.dateOfService.split('-')[0]);
            const month = parseInt(saveData.dateOfService.split('-')[1]);
            const day = parseInt(saveData.dateOfService.split('-')[2]);
            var nextDay = new Date(year, month - 1, day);
            nextDay.setDate(nextDay.getDate() + 1);

            var dd = ('0' + nextDay.getDate()).slice(-2);
            var mm = ('0' + (nextDay.getMonth() + 1)).slice(-2);
            var yyyy = nextDay.getFullYear();

            saveData.dateOfService = yyyy + '-' + mm + '-' + dd;

            // first day entry in the database -- UPDATE
            updateData.checkHours = saveData.crossMidnightCheckHours[0].day1TotalHours;
            updateData.endTime = '00:00';

            saveAndUpdateEntryForMidnightCross(
                saveData,
                updateData,
                crossmidnightisadminedit,
                crossmidnightpayperiod,
            );
        } else {
            updateSingleEntry(isAdminEdit, payPeriod, updateData);
        }
    }
    function deleteEntry(entryId, isAdminEdit, payPeriod) {
        if (!entryId) return;

        singleEntryAjax.deleteSingleEntryRecord(entryId, function (results) {
            successfulSave.show('DELETED');
            setTimeout(function () {
                successfulSave.hide();
                if (isAdminEdit) {
                    timeApproval.refreshPage(payPeriod);
                } else {
                    timeEntryReview.refreshPage(payPeriod); 
                }
            }, 1000);
        });
    }

    function showOverlapPopup(updateorsave = 'save') {
        var popup = POPUP.build({});
        var message = document.createElement('p');
        message.style.marginBottom = '2em';
        message.innerHTML = `There is an overlap with an existing Time Entry record. Do you wish to proceed?`;

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        var yesBtn = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                if ($.session.singleEntrycrossMidnight && updateorsave === 'save') {
                    showMultipleEntriesPopup();
                }
                if (!$.session.singleEntrycrossMidnight && updateorsave === 'save') {
                    getEntryData('', saveAndSubmit);
                }
                if ($.session.singleEntrycrossMidnight && updateorsave === 'update') {
                    showMultipleEntriesPopup('update');
                }
                if (!$.session.singleEntrycrossMidnight && updateorsave === 'update') {
                    updateEntry('', '', '', saveAndSubmit);
                }
            },
        });
        var noBtn = button.build({
            text: 'No',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
            },
        });

        popup.appendChild(message);
        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        popup.appendChild(btnWrap);

        POPUP.show(popup);
    }
    function showWarningPopup(messageText, callback) {
        var popup = POPUP.build({ classNames: ['warning'], hideX: true });
        var message = document.createElement('p');
        message.innerHTML = messageText;
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var yesBtn = button.build({
            text: 'Yes',
            type: 'contained',
            style: 'secondary',
            callback: function () {
                POPUP.hide(popup);
                callback();
            },
        });
        var noBtn = button.build({
            text: 'No',
            type: 'contained',
            style: 'secondary',
            callback: function () {
                POPUP.hide(popup);
                timeEntryCard.enableSaveButtons();
            },
        });
        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        popup.appendChild(message);
        popup.appendChild(btnWrap);

        POPUP.show(popup);
    }
    function showMultipleEntriesPopup(updateorsave = 'save') {
        var popup2 = POPUP.build({});
        var message2 = document.createElement('p');
        message2.innerHTML = `You have entered an End Time that crosses over midnight. Two separate entries will be created when this record is saved. Do you wish to proceed?`;
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var yesBtn2 = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup2);
                updateorsave === 'save'
                    ? getEntryData('', saveAndSubmit)
                    : updateEntry('', '', '', saveAndSubmit);
            },
        });
        var noBtn2 = button.build({
            text: 'No',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup2);
            },
        });
        btnWrap.appendChild(yesBtn2);
        btnWrap.appendChild(noBtn2);
        popup2.appendChild(message2);
        popup2.appendChild(btnWrap);
        //	popup2.appendChild(noBtn2);

        POPUP.show(popup2);
    }

    // Overlapping Locations
    function getConsumerswithOverlappingLocations(consumerlocatons) {
        // get list of consumerIds that are listed more than once (ie, consumers with overlappng locations)
        duplicateconsumerIds = consumerlocatons.reduce((a, e) => {
            a[e.consumerId] = ++a[e.consumerId] || 0;
            return a;
        }, {});

        // get list of consumer/locations that DO NOT have overlapping locations
        consumerswithUniqueLocations = consumerlocatons.filter(
            e => !duplicateconsumerIds[e.consumerId],
        );

        // get list of consumer/locations that DO have overlapping locations
        consumerswithMultipleLocations = consumerlocatons.filter(
            e => duplicateconsumerIds[e.consumerId],
        );
    }
    function checkOverlapPopupForErrors() {
        const erros = [...overlapLocationsPopup.querySelectorAll('.error')];

        if (erros.length > 0) {
            overlapLocationsDoneBtn.classList.add('disabled');
        } else {
            overlapLocationsDoneBtn.classList.remove('disabled');
        }
    }
    function populateOverlapLocationsDropdown(locDrop, consumer) {
        let thisconsumersLocations = consumerswithMultipleLocations.filter(
            val => val.consumerId === consumer.consumerId,
        );

        let data = thisconsumersLocations.map(location => ({
            id: location.consumerId,
            value: location.locationId,
            text: location.locationName,
        }));
        data.unshift({ id: '', value: 'SELECT', text: 'SELECT' }); //ADD Blank value
        dropdown.populate(locDrop, data);
    }
    function buildOverlapLocationsDropdown(consumer, index) {
        const wrap = document.createElement('div');

        const overlappedLocationsEntriesMessage = document.createElement('p');
        overlappedLocationsEntriesMessage.innerHTML = `<span style="font-weight: 500; font-size: 14px">${consumer.consumerName}</span><br>`;

        const overlapLocationsDropdown = dropdown.build({
            label: 'Locations',
            dropdownId: `overlapLocationsDropdown${index}`,
        });

        overlapLocationsDropdown.classList.add('error');

        overlapLocationsDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];

            const seletedOverlapLocId = selectedOption.value;
            selectedOverlapLocIds[consumer.consumerId] = seletedOverlapLocId;
            // selectedOverlapConsumerId
            if (!seletedOverlapLocId || seletedOverlapLocId === 'SELECT') {
                overlapLocationsDropdown.classList.add('error');
            } else {
                overlapLocationsDropdown.classList.remove('error');
            }
            checkOverlapPopupForErrors();
        });

        populateOverlapLocationsDropdown(overlapLocationsDropdown, consumer);

        wrap.appendChild(overlappedLocationsEntriesMessage);
        wrap.appendChild(overlapLocationsDropdown);

        return wrap;
    }
    function displayOverlapLocationsPopup(results) {
        getConsumerswithOverlappingLocations(results);

        // build overlapLocation Popup
        overlapLocationsPopup = POPUP.build({
            header: `Overlapping locations for selected consumer(s).`,
            hideX: false,
            id: 'overlapLocationsPopup',
        });

        let overlappedLocationsEntriesMessage = document.createElement('p');
        overlappedLocationsEntriesMessage.innerHTML = `Consumers listed below have multiple locations for the selected date. For each consumer, please select the location where these services are being provided. <br><br>`;

        overlapLocationsPopup.appendChild(overlappedLocationsEntriesMessage);

        // reduce the list of consumer/locations with overlapping locations (ie, consumerswithMultipleLocations) to a single/unique record representing each consumer/location pair
        let overlapConsumerlist = consumerswithMultipleLocations
            .map(item => ({ consumerId: item.consumerId, consumerName: item.consumerName }))
            .filter((value, index, self) => self.indexOf(value) === index);

        // consumerNames in OverlapConsumerlist LastName, FirstName
        for (const consumer of overlapConsumerlist) {
            let firstName = consumer.consumerName.split(' ').slice(0, -1).join(' ');
            let lastName = consumer.consumerName.split(' ').slice(-1).join(' ');
            consumer.consumerName = lastName + ', ' + firstName;
        }
        // a single/unique record representing each consumer/location pair
        overlapConsumerlist = overlapConsumerlist.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    t => t.consumerId === value.consumerId && t.consumerName === value.consumerName,
                ),
        );
        //alphabatize
        // overlapConsumerlist = overlapConsumerlist.sort();
        overlapConsumerlist.sort(function (a, b) {
            var textA = a.consumerName.toUpperCase();
            var textB = b.consumerName.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        // cycle through each consumer/location pair to build a dropdown for each unique pair
        overlapConsumerlist.forEach((consumer, index) => {
            const markup = buildOverlapLocationsDropdown(consumer, index);
            overlapLocationsPopup.appendChild(markup);
        });

        overlapLocationsDoneBtn = button.build({
            id: 'overlapLocationsDoneBtn',
            text: 'done',
            type: 'contained',
            style: 'secondary',
            classNames: 'disabled',
            callback: async () => {
                if (saveAndSubmit) {
                    // SAve and Submit BTN clicked

                    POPUP.hide(overlapLocationsPopup);
                    var listofSingleEntryIdsSaved = await saveSingleEntrywithLocationOverlaps();
                    var test = listofSingleEntryIdsSaved;
                    var updateObj = {
                        token: $.session.Token,
                        singleEntryIdString: listofSingleEntryIdsSaved.join(','),
                        newStatus: 'S',
                    };

                    singleEntryAjax.updateSingleEntryStatus(updateObj, function () {
                        successfulSave.show('SAVED & SUBMITTED');
                        setTimeout(function () {
                            successfulSave.hide();
                            timeEntryCard.clearAllGlobalVariables();
                            roster2.clearActiveConsumers();
                            newTimeEntry.init(true);
                        }, 1000);
                    }); // end -- singleEntryAjax.updateSingleEntryStatus

                    selectedOverlapLocIds = {};
                } else {
                    // Save BTN clicked

                    var listofSingleEntryIdsSaved = await saveSingleEntrywithLocationOverlaps();
                    var test = listofSingleEntryIdsSaved;

                    POPUP.hide(overlapLocationsPopup);
                    successfulSave.show('SAVED');
                    setTimeout(function () {
                        successfulSave.hide();
                        timeEntryCard.clearAllGlobalVariables();
                        roster2.clearActiveConsumers();
                        newTimeEntry.init();
                    }, 1000);

                    selectedOverlapLocIds = {};
                }
            },
        });
        this.doneButton = overlapLocationsDoneBtn;

        let cancelBtn = button.build({
            id: 'overlapLocationsCancelBtn',
            text: 'cancel',
            type: 'outlined',
            style: 'secondary',
            callback: () => {
                selectedOverlapLocIds = {};

                POPUP.hide(overlapLocationsPopup);

                if (saveAndSubmit) {
                    timeEntryCard.enableSaveButtons();
                } else {
                    timeEntryCard.enableSaveButton();
                }
            },
        });

        selectedOverlapConsumerId = consumerswithMultipleLocations[0].consumerId;
        let btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(overlapLocationsDoneBtn);
        btnWrap.appendChild(cancelBtn);
        overlapLocationsPopup.appendChild(btnWrap);

        POPUP.show(overlapLocationsPopup);
    }
    async function saveSingleEntrywithLocationOverlaps() {
        let savedLocationsSingleEntryPairs = [];
        let overlapSavedLocationsSingleEntryPairs = [];

        // ****************// FIRST SAVE SECTION -- SAVING Consumers with NON-Overlapping Locations -- SAVED IN GROUPS OF CONSUMERS WHO SHARE A LOCATIONID
        var duplocationIds = consumerswithUniqueLocations.reduce((a, e) => {
            a[e.locationId] = ++a[e.locationId] || 0;
            return a;
        }, {});

        // filtering the consumers with non-overlapping locationsIds (consumerswithUniqueLocations)
        // cycle through each duplicate location Id record to get list of LocationIds that have more than one record (ie, duplicates)
        var listofDuplicateLocationIds = [];
        for (prop in duplocationIds) {
            if (duplocationIds[prop] !== 0) {
                listofDuplicateLocationIds.push(prop);
            }
        }

        if (listofDuplicateLocationIds.length > 0) {
            for (const duplocatId of listofDuplicateLocationIds) {
                // create a subset of records for each duplicate location Id
                var nonoverlapconsumerswithsamelocation;
                nonoverlapconsumerswithsamelocation = consumerswithUniqueLocations.filter(e => {
                    return e.locationId === duplocatId;
                });

                if (nonoverlapconsumerswithsamelocation.length > 0) {
                    var strConsumerIds = '';
                    var locationid;
                    // putting together list of consumerIds with a shared locationID
                    nonoverlapconsumerswithsamelocation.forEach(function (item) {
                        strConsumerIds = strConsumerIds + item.consumerId + ',';
                        locationid = item.locationId;
                    });

                    strConsumerIds = strConsumerIds.slice(0, -1);

                    saveData = timeEntryCard.getSaveUpdateData();
                    saveData.locationId = locationid;
                    saveData.consumerId = strConsumerIds;

                    //  NON-Overlapping Location SAVE -- saving the SingleEntry that has multiple consumers who share a single location
                    // SAVED -- one record in the AA_Single_Entry Table and multiple records in the AA_Consumers_Present table
                    let singleentryid;
                    await singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
                        singleentryid = results[1].slice(0, -2);
                    });
                    savedLocationsSingleEntryPairs.push({
                        locationId: saveData.locationId,
                        singleEntryId: singleentryid,
                    });
                } // end if -- if (nonoverlapconsumerswithsamelocation.length > 0)
            } // end for -- for (const duplocatId of listofDuplicateLocationIds)
        } // end if -- if (listofDuplicateLocationIds.length > 0)

        // ****************// SECOND SAVE SECTION -- SAVING Consumers with NON-Overlapping Locations -- SAVED CONSUMERS WHO HAVE UNIQUE LOCATIONID
        // filtering Entries that are non-overlapping (consumerswithUniqueLocations) and have a unique location per unique consumer
        var nonoverlapconsumerswithUniqueLocations;
        nonoverlapconsumerswithUniqueLocations = consumerswithUniqueLocations.filter(
            e => !duplocationIds[e.locationId],
        );

        // NON-Overlapping Location SAVE -- saving the SingleEntry that has a single location with an associated single consumer
        // SAVED -- one record in the SingleEntr Table and assocciated Single record in the AA_Consumers_Present table
        if (nonoverlapconsumerswithUniqueLocations.length > 0) {
            for (const item of nonoverlapconsumerswithUniqueLocations) {
                saveData = timeEntryCard.getSaveUpdateData();
                saveData.locationId = item.locationId;
                saveData.consumerId = item.consumerId;
                let singleentryid;
                await singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
                    singleentryid = results[1].slice(0, -2);
                });
                savedLocationsSingleEntryPairs.push({
                    locationId: saveData.locationId,
                    singleEntryId: singleentryid,
                });
            }
        }
        // ****************// THIRD SAVE SECTION -- SAVING Consumers with Overlapping Locations **************************************************************
        // if any non-overlapping locations were saved, then we need to determine how to save the overlapping locations
        if (
            savedLocationsSingleEntryPairs.length > 0 ||
            overlapSavedLocationsSingleEntryPairs.length > 0 ||
            Object.values(selectedOverlapLocIds).length !== 0
        ) {
            // loop through all the selected locations for the overlapping locations
            for (prop in selectedOverlapLocIds) {
                let foundlocation = false;
                let seletedOverlapLocationId = selectedOverlapLocIds[prop];
                let selectedOverlapConsumerId = prop;

                if (overlapSavedLocationsSingleEntryPairs.length > 0) {
                    // loop through all the SAVED 'Overlapping location" Single Entries (all the overlapping location saves)
                    for (const item of overlapSavedLocationsSingleEntryPairs) {
                        // if the current location has already been saved, then just save the Consumer in the AA_Consumers_Present table
                        if (item.locationId === seletedOverlapLocationId) {
                            foundlocation = true;
                            let saveData = timeEntryCard.getSaveUpdateData();
                            consumerData = {
                                token: $.session.Token,
                                singleEntryId: item.singleEntryId,
                                consumerId: selectedOverlapConsumerId,
                                deviceType: saveData.deviceType,
                                evvReason: saveData.evvReason,
                            };
                            // Single Entry Record already exists for this location so just save to the AA_Consumers_Present table
                            await singleEntryAjax.insertConsumerforSavedSingleEntry(
                                consumerData,
                function (res) {},
                            );
                        } // end if (item.locationId === seletedOverlapLocationId)
                    } //  end for -- all the saved Single Entries (all the non-overlapping location saves)
                } else {
                    // overlapSavedLocationsSingleEntryPairs.length = 0

                    // loop through all the SAVED Single Entries (all the NON-overlapping location saves)
                    for (const item of savedLocationsSingleEntryPairs) {
                        // if the current location has already been saved, then just save the Consumer in the AA_Consumers_Present table
                        if (item.locationId === seletedOverlapLocationId) {
                            foundlocation = true;
                            let saveData = timeEntryCard.getSaveUpdateData();
                            consumerData = {
                                token: $.session.Token,
                                singleEntryId: item.singleEntryId,
                                consumerId: selectedOverlapConsumerId,
                                deviceType: saveData.deviceType,
                                evvReason: saveData.evvReason,
                            };
                            // Single Entry Record already exists for this location so just save to the AA_Consumers_Present table
                            await singleEntryAjax.insertConsumerforSavedSingleEntry(
                                consumerData,
                function (res) {},
                            );
                        } // end -- if (item.locationId === seletedOverlapLocationId)
                    } //  end for -- all the saved Single Entries (all the non-overlapping location saves)
                } // end if/else -- overlapSavedLocationsSingleEntryPairs.length > 0

                // if the location has NOT already been Saved, just save the overlapping location
                if (!foundlocation) await saveOverlapLocationasSingleEntry(prop);
            } //  end for -- the selected locations for the overlapping locations
        } else {
            // there were NO locations saved in any of the sections above, so just save the overlapping location

            await saveOverlapLocationasSingleEntry(prop);
        }
        // ****************// ALL SAVES ARE NOW COMPLETE //**************************************************************

        // NESTED/Child FUNCTION inside ==> function saveSingleEntrywithLocationOverlaps()  -- handles each new Single Entry Insert from the Parent function
        async function saveOverlapLocationasSingleEntry(prop) {
            saveData = timeEntryCard.getSaveUpdateData();

            let singleentryid;
            const seletedOverlapLocationId = selectedOverlapLocIds[prop];
            const selectedOverlapConsumerId = prop;
            saveData.locationId = seletedOverlapLocationId;
            saveData.consumerId = selectedOverlapConsumerId;

            await singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
                singleentryid = results[1].slice(0, -2);
                overlapSavedLocationsSingleEntryPairs.push({
                    locationId: saveData.locationId,
                    singleEntryId: singleentryid,
                });
            });
        } // end of nested function -- async function saveOverlapLocationasSingleEntry()

        // put together full list of new Single Entry SAVES
        var concatsavedLocationsSingleEntryPairs = savedLocationsSingleEntryPairs.concat(
            overlapSavedLocationsSingleEntryPairs,
        );

        //After all Single Entries have been saved, go get the Consumers Present and update the AA_Single_Entry Table
        // let saveData = timeEntryCard.getSaveUpdateData();
        for (const item of concatsavedLocationsSingleEntryPairs) {
            await singleEntryAjax.getSingleEntryConsumersPresentAsync(item.singleEntryId, function (res) {
                saveData.singleEntryId = item.singleEntryId;
                saveData.locationId = item.locationId;
                saveData.numberOfConsumersPresent = res.length;
            });
      await singleEntryAjax.updateSingleEntry(saveData, function (results) {});
        }
        // return list of newly created singleEntryIds (from all the AA_Single_Entry saves/inserts from ALL the SAVES above)
        const singleEntryIdArray = concatsavedLocationsSingleEntryPairs.map(r => r.singleEntryId);

        return singleEntryIdArray;
    } // end of Parent/containing function -- function populateOverlapLocationsDropdown(locDrop, consumer)

    // Util/CRUD
    //------------------------------------
    function checkDeviceType() {
        if ($.session.OS === 'iPhone/iPod' || $.session.OS === 'Linux') {
            return 'Mobile';
        } else return 'Other';
    }
    function setRequiredFields(results) {
        var res = results[0];

        requiredFields.isDestinationRequired = res.destinationrequired;
        requiredFields.isOriginationRequired = res.originationrequired;
        requiredFields.isNoteRequired = res.noterequired;
        requiredFields.isOdometerRequired = res.odometerrequired;
        requiredFields.isLicensePlateRequired = res.licenseplaterequired;
        requiredFields.isReasonRequired = res.reasonrequired;
        requiredFields.supervisorApproval = res.supervisorapproval;
        requiredFields.reconfigImportFile = res.reconfigimportfile;
        requiredFields.useFiveCharWorkCode = res.use5characterworkcode;
    }
    function setSelectedPayPeriod(dirtyStart, dirtyEnd, dateString) {
        // start and end format must be YYYY-MM-DD
        var tmpStart = dirtyStart;
        var tmpEnd = dirtyEnd;

        return {
            start: tmpStart,
            end: tmpEnd,
            dateString,
        };
    }
    function sortPayPeriods(results) {
        var adminDatesSet = false;
        var datesSet = false;
        var adminDefaultDates;
        var defaultDates;
        var now = new Date();
        now.setHours(0, 0, 0, 0);

        results.forEach((r, i) => {
            var anywhereClosed = r.anywhereclosed;
            var sendEvvData = r.sendevvdata;
            var startDate = r.startdate.split(' ')[0]; //  MM/DD/YYYY
            var endDate = r.enddate.split(' ')[0]; //  MM/DD/YYYY
            var startDateIso = UTIL.formatDateToIso(startDate); //  YYYY-MM-DD
            var endDateIso = UTIL.formatDateToIso(endDate); //  YYYY-MM-DD

            var dateString = `${startDate} - ${endDate}`; // for dropdown text only
            var newObj = {
                start: startDateIso,
                end: endDateIso,
                dateString,
                sendEvvData: sendEvvData,
            };

            var startDateObj = new Date(startDate);
            var endDateObj = new Date(endDate);

            if (i === 0) {
                adminDefaultDates = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
            }
            if (anywhereClosed === 'False' && !defaultDates) {
                defaultDates = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
            }

            // getting the current date & pay period
            if (now >= startDateObj && now <= endDateObj) {
                currentAdminDate = UTIL.formatDateToIso(
                    `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
                );
                currentAdminPayPeriod = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
                adminDatesSet = true;

                if (anywhereClosed === 'False') {
                    currentDate = UTIL.formatDateToIso(
                        `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
                    );
                    currentPayPeriod = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
                    datesSet = true;
                }
            }
            // sorting pay periods
            adminPayPeriods.push(newObj);
            if (anywhereClosed === 'False') {
                payPeriods.push(newObj);
            }
        });

        if (!adminDatesSet) {
            currentAdminDate = adminDefaultDates.start;
            currentAdminPayPeriod = adminDefaultDates;
        }
        if (!datesSet && defaultDates) {
            currentDate = defaultDates.start;
            currentPayPeriod = defaultDates;
        }
    }
    function getPayPeriods(admin) {
        if (admin) {
            return [...adminPayPeriods];
        } else {
            return [...payPeriods];
        }
    }
    function getCurrentPayPeriod(admin) {
        if (admin) {
            return UTIL.iterationCopy(currentAdminPayPeriod);
        } else {
            return UTIL.iterationCopy(currentPayPeriod);
        }
    }
    function getCurrentDate(admin) {
        if (admin) {
            return currentAdminDate;
        } else {
            return currentDate;
        }
    }
    function getLocations() {
        return [...locations];
    }
    function getEvvReasonCodes() {
        return [...evvReasonCodes];
    }
    function getResidenceLocations() {
        if (!residenceLocations) return [];
        return [...residenceLocations];
    }
    async function getWorkCodes(useAllWorkCodes) {
        if (!useAllWorkCodes) {
            return [...workCodes];
        }

        const allWorkCodes = await singleEntryAjax.getWorkCodesAsync(useAllWorkCodes);

        return [...allWorkCodes];
    }
    function getRequiredFields() {
        return UTIL.iterationCopy(requiredFields);
    }
    function getInitialData(callback) {
        if (
            payPeriods.length === 0 ||
            adminPayPeriods.length === 0 ||
            !locations ||
            !workCodes ||
            !evvReasonCodes
        ) {
            let promises = [];

            const getSingleEntryPayPeriods = new Promise((resolve, reject) => {
                singleEntryAjax.getSingleEntryPayPeriods(results => {
                    sortPayPeriods(results);
                    resolve('getSingleEntryPayPeriods DONE');
                });
            });
            promises.push(getSingleEntryPayPeriods);

            const getSingleEntryLocations = new Promise((resolve, reject) => {
                singleEntryAjax.getSingleEntryLocations(results => {
                    locations = results;
                    resolve('getSingleEntryLocations DONE');
                });
            });
            promises.push(getSingleEntryLocations);

            const getRequiredSingleEntryFields = new Promise((resolve, reject) => {
                singleEntryAjax.getRequiredSingleEntryFields(results => {
                    setRequiredFields(results);
                    resolve('getRequiredSingleEntryFields DONE');
                });
            });
            promises.push(getRequiredSingleEntryFields);

            const getWorkCodes = new Promise((resolve, reject) => {
                singleEntryAjax.getWorkCodes(results => {
                    workCodes = results;
                    resolve('getWorkCodes DONE');
                });
            });
            promises.push(getWorkCodes);

            const getLocationsAndResidences = new Promise((resolve, reject) => {
                singleEntryAjax.getLocationsAndResidences(results => {
                    residenceLocations = results;
                    resolve('getWorkCodes DONE');
                });
            });
            promises.push(getLocationsAndResidences);

            const getEvvReasonCodes = new Promise((resolve, reject) => {
                singleEntryAjax.getEvvReasonCodes(results => {
                    evvReasonCodes = results;
                    resolve('getEvvReasonCodes DONE');
                });
            });
            promises.push(getEvvReasonCodes);

            Promise.all(promises).then(() => {
                callback();
            });

            // singleEntryAjax.getSingleEntryPayPeriods(function getSingleEntryPayPeriods(results) {
            // 	sortPayPeriods(results);

            // 	singleEntryAjax.getSingleEntryLocations(function getSingleEntryLocations(results) {
            // 		locations = results;

            // 		singleEntryAjax.getRequiredSingleEntryFields(function getRequiredSingleEntryFields(results) {
            // 			setRequiredFields(results);

            // 			singleEntryAjax.getWorkCodes(function getWorkCodes(results) {
            //         workCodes = results;

            //         singleEntryAjax.getLocationsAndResidences(function getLocationsAndResidence(results) {
            //           residenceLocations = results;
            //           callback();
            //         });
            // 			});
            // 		});
            // 	});
            // });
        } else {
            callback();
        }
    }

    function checkLocationServicesEnabled() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // if location services are on, continue with normal functionality
                    $.session.singleEntrycrossMidnight = false;
                    newTimeEntry.init();
                },
                function (error) {
                    // If location services are off, show popup
                    const locationsWarningpopup = POPUP.build({
                        id: 'warningPopup',
                        hideX: false,
                        classNames: 'warning',
                    });

                    const okBtn = button.build({
                        text: 'OK',
                        style: 'secondary',
                        type: 'contained',
                        callback: function () {
                            POPUP.hide(locationsWarningpopup);
                        },
                    });
                    const btnWrap = document.createElement('div');
                    btnWrap.classList.add('btnWrap');
                    btnWrap.appendChild(okBtn);

                    const warningMessage = document.createElement('p');
                    warningMessage.innerHTML =
                        "Location services must be enabled on this device to save a new time entry record.  Please contact your company's IT team for assistance.";
                    locationsWarningpopup.appendChild(warningMessage);
                    locationsWarningpopup.appendChild(btnWrap);
                    POPUP.show(locationsWarningpopup);
                },
            );
        } else {
            // If location services are not supported, show popup
            const locationsWarningpopup = POPUP.build({
                id: 'warningPopup',
                hideX: false,
                classNames: 'warning',
            });

            const okBtn = button.build({
                text: 'OK',
                style: 'secondary',
                type: 'contained',
                callback: function () {
                    POPUP.hide(locationsWarningpopup);
                },
            });
            const btnWrap = document.createElement('div');
            btnWrap.classList.add('btnWrap');
            btnWrap.appendChild(okBtn);

            const warningMessage = document.createElement('p');
            warningMessage.innerHTML =
                "Location services must be enabled on this device to save a new time entry record.  Please contact your company's IT team for assistance.";
            locationsWarningpopup.appendChild(warningMessage);
            locationsWarningpopup.appendChild(btnWrap);
            POPUP.show(locationsWarningpopup);
        }
    }

    // Landing Page
    //------------------------------------
    async function loadNewTimeEntryPage() {
        if ($.session.singleEntryLocationRequired === 'Y') {
            // If location settings are required, check location settings
            checkLocationServicesEnabled();
        } else {
            // If location settings are not required, resume normal funcionality
            const result = await singleEntryAjax.getExistingTimeEntry();
            const { getExistingTimeEntryResult } = result;
            if (getExistingTimeEntryResult.length > 0 && $.session.anyRequireEndTime == 'Y') {
                newTimeEntry.endDateWarningPopup(getExistingTimeEntryResult); 
            }
            else {
                $.session.singleEntrycrossMidnight = false;
                newTimeEntry.init();
            }         
        }
    }
    function loadTimeEntryReviewPage() {
        $.session.singleEntrycrossMidnight = false;
        setActiveModuleSectionAttribute('timeEntry-review');
        timeEntryReview.init();
    }
    function loadTimeEntryApprovalPage() {
        setActiveModuleSectionAttribute('timeEntry-approval');
        timeApproval.init();
    }
    function loadSingleEntryLanding() {
        var timeEntryBtn = button.build({
            text: 'New Entry',
            style: 'secondary',
            type: 'contained',
            callback: loadNewTimeEntryPage,
        });
        var timeReviewBtn = button.build({
            text: 'Time Review',
            style: 'secondary',
            type: 'contained',
            callback: loadTimeEntryReviewPage,
        });
        var timeApprovalBtn = button.build({
            text: 'Time Approval',
            style: 'secondary',
            type: 'contained',
            callback: loadTimeEntryApprovalPage,
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('landingBtnWrap');

        btnWrap.appendChild(timeEntryBtn);
        btnWrap.appendChild(timeReviewBtn);
        if ($.session.ViewAdminSingleEntry && $.session.SEViewAdminWidget) {
            btnWrap.appendChild(timeApprovalBtn);
        }

        DOM.clearActionCenter();
        DOM.ACTIONCENTER.appendChild(btnWrap);
    }
    function init() {
        DOM.clearActionCenter();
        PROGRESS.SPINNER.show('Loading Time Entry...');
        getInitialData(loadSingleEntryLanding);
    }

    return {
        setSelectedPayPeriod,
        getPayPeriods,
        getCurrentPayPeriod,
        getCurrentDate,
        getLocations,
        getResidenceLocations,
        getWorkCodes,
        getRequiredFields,
        getInitialData,
        getEvvReasonCodes,
        getEntryData,
        updateEntry,
        deleteEntry,
        init,
    };
})();
