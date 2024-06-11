var timeEntryCard = (function () {
    //-DATA------------------
    var payPeriodData;
    var locationData;
    var workCodeData;
    var requiredFields;
    var crossMidnightTimeData;
    var saveUserId; // userID used for cross midnight entries (eg, "charles")
    var personId; // Id of originator of entry (e.g., 37)
    var supervisorId;
    var rejectedTime;
    //-DOM------------------
    var card; // time entry card
    // dropdowns
    var payPeriodDropdown;
    var locationDropdown;
    var workCodeDropdown;
    var reasonDropdown;
    var locationTypeDropdown;
    // inputs
    var dateInput;
    var startTimeInput;
    var endTimeInput;
    var totalHoursInput;
    var noteInput;
    var rejectionReasonInput;
    // transportation
    var transportationBtn;
    var transportationPopup;
    var transportationDropdown;
    var licenseplateInput;
    var odometerStartInput;
    var odometerEndInput;
    var odometerTotalInput;
    var destinationInput;
    var reasonInput;
    var saveTransBtn;
    var deleteTransBtn;
    var cancelTransBtn;
    // btns
    var saveBtn;
    var deleteBtn;
    var cancelBtn;
    var saveOrUpdate;
    //-VALUES------------------
    var isEdit;
    var isAdminEdit;
    var isCardDisabled;
    var status;
    var singleEntryId;
    var now;
    var nowHour;
    var nowMinutes;
    // consumers
    var consumerIds;
    var numberOfConsumersPresent;
    // dropdown & input
    var payPeriod;
    var entryDate;
    var workCode;
    var locationId;
    var startTime;
    var endTime;
    var totalHours;
    var noteText;
    var rejectionReason;
    //EVV
    var evvReasonCodeObj;
    var evvReasonCode;
    var locationTypeCode;
    var sendEvvData;
    var wcServiceType;
    var reasonRequired; // true || false
    var eligibleConsumersObj;
    var endTimeClicks;
    var evvAttest;
    var evvCommunity;
    var defaultTimesChanged; // true || false
    var defaultStartTimeChanged; // true || false (needed for 1st  entry in crossmidnight entries)
    var defaultEndTimeChanged; // true || false (needed for 2nd entry in crossmidnight entries)
    // time overlap
    var timeOverlap;
    // workcode related
    var isBillable; // Y || N
    var keyStartStop; // Y || N
    // coordinates
    var startLatitude;
    var startLongitude;
    var endLatitude;
    var endLongitude;
    // transportation
    var transportationSaved = false;
    var isTransportationValid;
    var destination = null;
    var odometerEnd = null;
    var odometerStart = null;
    var reason = null;
    var transportationType = null;
    var transportationReimbursable = null;
    var transportationUnits = null;
    var licensePlateNumber = null;
    // temp transportation data (holds data until save)
    var tmpTransportationType = null;
    var tmpTransportationReimbursable = null;
    var tmpOdometerStart = null;
    var tmpOdometerEnd = null;
    var tmpTransportationUnits = null;
    var tmpDestination = null;
    var tmpReason = null;
    var tmpLicenseplate = null;
    var isEVVSingleEntry = false;
    var reasonCodeValue;
    var eVVChangeDate;
    var todayDate;

    // Action Nav
    //------------------------------------
    function handleActionNavEvent(target, isNew) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                DOM.toggleNavLayout();
                const selectedConsumers = roster2.getActiveConsumers();
                moveConsumersToTimeCard(selectedConsumers);
                break;
            }
            case 'miniRosterCancel': {
                DOM.toggleNavLayout();
                break;
            }
        }
    }

    // Util
    //------------------------------------
    function errorPopup(message) {
        popup = POPUP.build({ classNames: 'error' });
        messageArea = document.createElement('p');
        messageArea.innerHTML = message;
        popup.appendChild(messageArea);
        POPUP.show(popup);
    }
    function disableInput(element) {
        var input = element.querySelector('input');
        if (!input) input = element.querySelector('select');
        if (!input) input = element.querySelector('textarea');
        element.classList.add('disabled');
        input.setAttribute('readonly', 'true');
    }
    function enableInput(element) {
        var input = element.querySelector('input');
        if (!input) input = element.querySelector('select');
        if (!input) input = element.querySelector('textarea');
        element.classList.remove('disabled');
        input.removeAttribute('readonly');
    }
    function getOverlapData() {
        return {
            token: $.session.Token,
            dateOfService: entryDate,
            startTime: startTime,
            endTime: endTime,
            singleEntryId: '',
        };
    }
    function getSaveUpdateData(saveorupdate) {
        // setTotalHours();
        if (saveorupdate) saveOrUpdate = saveorupdate;
        var consumer_Ids = consumerIds ? consumerIds.join(',') : '';
        var data;
        if (!evvReasonCode || evvReasonCode === '%') evvReasonCode = '';
        if (keyStartStop === 'Y' && !startTime) startTime = startTimeInput.querySelector('input').value;
        let deviceOS = checkDeviceType();
        if (evvReasonCode !== '') deviceOS = 'Manual';

        if (saveOrUpdate === 'Save') {
            data = {
                // session variables
                token: $.session.Token,
                userId: crossMidnightTimeData && saveUserId ? saveUserId : $.session.UserId, // for crossmidnight -- this is used for PersonID (in DB)
                updaterId: crossMidnightTimeData && saveUserId ? $.session.UserId : '', // for crossmidnight -- this is used for UserID (in DB)
                personId: crossMidnightTimeData && saveUserId ? personId : 0, // for crossmidnight
                // card data
                checkHours: totalHours ? totalHours : '',
                crossMidnightCheckHours: crossMidnightTimeData
                    ? [
                        { day1TotalHours: crossMidnightTimeData.day1TotalHours },
                        { day2TotalHours: crossMidnightTimeData.day2TotalHours },
                    ]
                    : '',
                consumerId: consumer_Ids,
                dateOfService: entryDate,
                defaultStartTimeChanged: defaultStartTimeChanged ? defaultStartTimeChanged : false, // for crossmidnight evv entries
                defaultEndTimeChanged: defaultEndTimeChanged ? defaultEndTimeChanged : false, // for crossmidnight evv entries
                endTime: endTime ? endTime : '',
                endLatitude: endLatitude ? endLatitude : 0,
                endLongitude: endLongitude ? endLongitude : 0,
                inComments: noteText ? UTIL.removeUnsavableNoteText(noteText) : '',
                latitude: crossMidnightTimeData ? endLatitude : startLatitude,
                longitude: crossMidnightTimeData ? endLongitude : startLongitude,
                locationId: locationId ? locationId : '',
                numberOfConsumersPresent: numberOfConsumersPresent
                    ? numberOfConsumersPresent
                    : consumerIds
                        ? consumerIds.length
                        : 0,
                startTime: startTime ? startTime : '',
                workCodeID: workCode ? workCode : '',

                // transportation
                destination: destination ? UTIL.removeUnsavableNoteText(destination) : '',
                licensePlateNumber: licensePlateNumber
                    ? UTIL.removeUnsavableNoteText(licensePlateNumber)
                    : '',
                odometerEnd: !odometerEnd
                    ? null
                    : odometerEnd === 0 || odometerEnd === '0'
                        ? null
                        : odometerEnd,
                odometerStart: !odometerStart
                    ? null
                    : odometerStart === 0 || odometerStart === '0'
                        ? null
                        : odometerStart,
                reason: reason ? UTIL.removeUnsavableNoteText(reason) : '',
                transportationReimbursable: transportationReimbursable ? transportationReimbursable : '',
                transportationUnits: transportationUnits ? transportationUnits : '',
                // EVV
                deviceType: deviceOS,
                evvReason: evvReasonCode,
                attest: attestCheckbox.getElementsByTagName('input')[0].checked ? 'Y' : 'N',
                community: communityCheckbox.getElementsByTagName('input')[0].checked ? 'Y' : 'N',
                evvLocationType: locationTypeCode,
            };
        } else {
            data = {
                // session variables
                token: $.session.Token,
                userId: $.session.UserId,
                // card data
                singleEntryId,
                checkHours: totalHours ? totalHours : '',
                crossMidnightCheckHours: crossMidnightTimeData
                    ? [
                        { day1TotalHours: crossMidnightTimeData.day1TotalHours },
                        { day2TotalHours: crossMidnightTimeData.day2TotalHours },
                    ]
                    : '',
                consumerId: consumer_Ids,
                dateOfService: entryDate,
                defaultStartTimeChanged: defaultStartTimeChanged ? defaultStartTimeChanged : false, // for crossmidnight evv entries
                defaultEndTimeChanged: defaultEndTimeChanged ? defaultEndTimeChanged : false, // for crossmidnight evv entries
                endTime: endTime ? endTime : '',
                endLatitude: endLatitude ? endLatitude : 0,
                endLongitude: endLongitude ? endLongitude : 0,
                inComments: noteText ? UTIL.removeUnsavableNoteText(noteText) : '',
                locationId: locationId ? locationId : '',
                numberOfConsumersPresent: numberOfConsumersPresent
                    ? numberOfConsumersPresent
                    : consumerIds
                        ? consumerIds.length
                        : 0,
                startTime: startTime ? startTime : '',
                workCodeID: workCode ? workCode : '',
                // transportation
                destination: destination ? UTIL.removeUnsavableNoteText(destination) : '',
                licensePlateNumber: licensePlateNumber
                    ? UTIL.removeUnsavableNoteText(licensePlateNumber)
                    : '',
                odometerEnd: !odometerEnd
                    ? null
                    : odometerEnd === 0 || odometerEnd === '0'
                        ? null
                        : odometerEnd,
                odometerStart: !odometerStart
                    ? null
                    : odometerStart === 0 || odometerStart === '0'
                        ? null
                        : odometerStart,
                reason: reason ? UTIL.removeUnsavableNoteText(reason) : '',
                transportationReimbursable: transportationReimbursable ? transportationReimbursable : '',
                transportationUnits: transportationUnits ? transportationUnits : '',

                deviceType: deviceOS,
                evvReason: evvReasonCode,
                attest: attestCheckbox.getElementsByTagName('input')[0].checked ? 'Y' : 'N',
                community: communityCheckbox.getElementsByTagName('input')[0].checked ? 'Y' : 'N',
                updateEVVReason:
                    $.session.singleEntrycrossMidnight && !defaultStartTimeChanged ? 'false' : 'true',
                evvLocationType: locationTypeCode,
            };
        }

        return data;
    }
    function checkDeviceType() {
        if ($.session.OS === 'iPhone/iPod' || $.session.OS === 'Linux') {
            return 'Mobile';
        } else return 'Other';
    }
    function setStartTimeLocation(pos) {
        startLatitude = pos.lat;
        startLongitude = pos.long;
    }
    function setEndTimeLocation(pos) {
        endLatitude = pos.lat;
        endLongitude = pos.long;
    }
    function setTotalHours() {
        if (keyStartStop === 'N') return;
        if (!startTime || !endTime) return;

        crossMidnightTimeData = {};

        var hoursInput = totalHoursInput.querySelector('input');
        var hours = UTIL.calculateTotalHours(startTime, endTime);

        if ((startTime === '00:00:00' || startTime === '00:00') && endTime === '00:00') {
            // user entered midnight for both start and end time
            totalHours = hours;
            hoursInput.value = totalHours;
            $.session.singleEntrycrossMidnight = false;
            crossMidnightTimeData = {};
        } else if (hours < 0 || hours === '0.00') {
            // user entered time period that spans into the next day
            // for the database entries
            var totalHours1 = UTIL.calculateTotalHours(startTime, '00:00');
            var totalHours2 = UTIL.calculateTotalHours('00:00', endTime);
            // for display on the screen
            totalHours = Number(totalHours1) + Number(totalHours2);
            // totalHours = (2400 + hours * 100)/100;
            hoursInput.value = totalHours.toFixed(2);
            $.session.singleEntrycrossMidnight = true;

            crossMidnightTimeData = {
                day1StartTime: startTime,
                day1EndTime: '00:00',
                day1TotalHours: totalHours1,
                day2StartTime: '00:00',
                day2EndTime: endTime,
                day2TotalHours: totalHours2,
            };
        } else {
            // user entered time period all within one day
            totalHours = hours;
            hoursInput.value = totalHours;
            $.session.singleEntrycrossMidnight = false;
            crossMidnightTimeData = {};
        }
    }

    function updateDateValMinMax(resetDate = true) {
        var todaysDate = UTIL.getTodaysDate();

        // if today is within the current pay period, then today is selected date; otherwise, payperiod start is selected date
        if (resetDate) {
            if (todaysDate <= payPeriod.end && todaysDate >= payPeriod.start) {
                entryDate = todaysDate;
            } else {
                entryDate = payPeriod.start;
            }
        }
        var input = dateInput.querySelector('input');
        if (resetDate) input.value = entryDate;
        input.setAttribute('min', payPeriod.start);
        input.setAttribute('max', payPeriod.end);

        // Set Min/Max Dates for Billable Work Codes
        if (isEdit) {
            if (isBillable === 'Y') {
                input.setAttribute('min', entryDate);
                input.setAttribute('max', entryDate);
            }
        } else {
            // NEW
            // If todays date is within the pay period, set the max to today's date. Otherwise max stays set to pay period end date.
            if (isBillable === 'Y' && todaysDate <= payPeriod.start) {
                // input.setAttribute('min', entryDate);
                input.setAttribute('max', UTIL.getTodaysDate());
            }
        }
        roster2.updateSelectedDate(entryDate);
    }
    async function setEditDataValues(editData) {
        var ed = editData[0];
        status = ed.Anywhere_Status;
        singleEntryId = ed.Single_Entry_ID;
        entryDate = UTIL.formatDateToIso(ed.Date_of_Service.split(' ')[0]);
        roster2.updateSelectedDate(entryDate);
        workCode = ed.Work_Code_ID;
        locationId = ed.Location_ID;
        startTime = ed.Start_Time;
        endTime = ed.End_Time === '23:59:59' ? '00:00' : ed.End_Time;
        totalHours = ed.Check_Hours;
        noteText = ed.Comments;
        locationTypeCode = ed.locationTypeCode;
        //get the rejection reason
        await singleEntryAjax.getSingleEntryById(singleEntryId, results => {
            entryData = results;
            rejectionReason = entryData.rejectionReason;
        });

        saveUserId = ed.User_ID; // userID used for cross midnight entries
        personId = ed.Person_ID;
        numberOfConsumersPresent = ed.Number_Consumers_Present;
        isBillable = ed.billable;
        keyStartStop = ed.keytimes;

        evvAttest = ed.attest;
        evvCommunity = ed.community;
        supervisorId = ed.supervisorId;
        rejectedTime = ed.rejected_time;
        destination = ed.destination;
        odometerEnd = ed.odometerend;
        odometerStart = ed.odometerstart;
        reason = ed.reason;
        transportationReimbursable = ed.Transportation_reimbursable;
        transportationUnits = ed.Transportation_Units;
        transportationType = ed.Transportation_reimbursable === 'N' ? 'Company' : 'Personal';
        licensePlateNumber = ed.licensePlateNumber;

        isTransportationValid = transportationType && transportationUnits ? true : false;
    }
    function clearAllGlobalVariables() {
        //CLEAR EVV CACHE
        clearSavedSignaturesAndNotes();

        isEdit = undefined;
        isAdminEdit = undefined;
        isCardDisabled = undefined;
        status = undefined;
        singleEntryId = undefined;

        consumerIds = undefined;
        numberOfConsumersPresent = undefined;
        workCode = undefined;
        locationId = undefined;
        startTime = undefined;
        endTime = undefined;
        totalHours = undefined;
        noteText = undefined;
        rejectionReason = undefined;
        isBillable = undefined;
        keyStartStop = undefined;
        startLatitude = undefined;
        startLongitude = undefined;
        endLatitude = undefined;
        endLongitude = undefined;
        crossMidnightTimeData = undefined;
        $.session.singleEntrycrossMidnight = undefined;

        timeOverlap = undefined;

        isTransportationValid = undefined;
        destination = null;
        odometerEnd = null;
        odometerStart = null;
        reason = null;
        licensePlateNumber = null;
        transportationType = null;
        transportationReimbursable = null;
        transportationUnits = null;

        tmpTransportationType = null;
        tmpTransportationReimbursable = null;
        tmpOdometerStart = null;
        tmpOdometerEnd = null;
        tmpTransportationUnits = null;
        tmpDestination = null;
        tmpReason = null;
        tmpLicenseplate = null;

        eligibleConsumersObj = {};
        reasonRequired = false;
        isEVVSingleEntry = false;
        defaultTimesChanged = false;
        defaultStartTimeChanged = false;
        defaultEndTimeChanged = false;
        evvAttest = null;
        evvCommunity = null;
        evvReasonCode = null;
        endTimeClicks = 0;
        locationTypeCode = null;
    }
    function clearCard() {
        // clear inputs & dropdowns
        var locDrop = locationDropdown.querySelector('select');
        var startInput = startTimeInput.querySelector('input');
        var endInput = endTimeInput.querySelector('input');
        var hoursInput = totalHoursInput.querySelector('input');
        if (!isEdit) locDrop.value = '';
        startInput.value = '';
        startTime = null;
        endInput.value = '';
        endTime = null;
        hoursInput.value = '';
        endTimeClicks = 0;

        const reasonCodeDropdown = reasonDropdown.querySelector('select');
        reasonCodeDropdown.value = '';
        //Hide evv reason code
        document.querySelector('.timeCard__evv').style.display = 'none';
        document.querySelector('.timeCard__evvattestChk').style.display = 'none';
        reasonCodeDropdown.classList.remove('error');
        defaultTimesChanged = false;
        defaultStartTimeChanged = false;
        defaultEndTimeChanged = false;
        reasonRequired = false;

        evvAttest = null;
        evvCommunity = null;
        evvReasonCode = null;
        locationTypeCode = null;

        // clear selected consumers
        if (isEdit) {
        }

        clearConsumerSection();
        checkPermissions();
    }

    function clearConsumerSection() {
        var consumerSection = document.querySelector('.timeCard__consumers');
        var consumers = [].slice.call(card.querySelectorAll('.seConsumerCard'));

        consumers.forEach(c => {
            var consumerCard = c.querySelector('.consumerCard');
            var consumerId = consumerCard.dataset.consumerId;
            consumerSection.removeChild(c);
            roster2.removeConsumerFromActiveConsumers(consumerId);
            consumerIds = consumerIds.filter(id => id !== consumerId);
            var activeConsumers = roster2.getActiveConsumers();
            numberOfConsumersPresent = activeConsumers ? activeConsumers.length : '0';
        });
    }

    // Consumers
    //------------------------------------
    async function getAllowedConsumersBasedOffResidence() {
        var residenceLocations = timeEntry.getResidenceLocations(); //Residence
        var rosterConsumers = await roster2.getAllRosterConsumers();
        var allowedConsumers = [];

        rosterConsumers.forEach(rc => {
            var primaryLocId = rc.conL;
            var locData = residenceLocations.filter(rl => rl.locationId === primaryLocId);
            if (locData.length > 0 && locData && locData[0].residence === 'Y') {
                // If a location is selected on the time entry card check this against
                // the primary location too. This usually only happens on edits.
                if (locationId) {
                    if (locationId === primaryLocId) {
                        allowedConsumers.push({ consumer_id: rc.id });
                    }
                } else {
                    allowedConsumers.push({ consumer_id: rc.id });
                }
            }
        });

        return allowedConsumers;
    }
    async function getAllowedConsumersBasedOffServiceLocations() {
        var residenceLocations = timeEntry.getResidenceLocations(); //Residence
        var rosterConsumers = await roster2.getAllRosterConsumers();
        var allowedConsumers = [];
        rosterConsumers.forEach(rc => {
            var serviceLocations = rc.LId.split('|');
            var locData = residenceLocations.filter(rl => {
                let exists = false;
                serviceLocations.forEach(sl => {
                    if (rl.locationId === sl && rl.residence === 'Y') exists = true;
                });
                return exists;
            });
            if (locData.length > 0 && locData) {
                allowedConsumers.push({ consumer_id: rc.id });
            }
        });

        return allowedConsumers;
    }
    async function setAllowedConsumers(callback) {
        switch (isBillable) {
            case 'Y':
                switch (isAdminEdit) {
                    case true:
                        if ($.session.SingleEntryEditTimeEntry) {
                            results = (await singleEntryAjax.getSingleEntryUsersByLocation(locationId, entryDate))
                                .getSingleEntryUsersByLocationJSONResult;
                            roster2.setAllowedConsumers(results);
                            if (callback) callback();
                        } else {
                            roster2.setAllowedConsumers([]);
                            if (callback) callback();
                        }
                        break;
                    default:
                        results = (await singleEntryAjax.getSingleEntryUsersByLocation(locationId, entryDate))
                            .getSingleEntryUsersByLocationJSONResult;
                        roster2.setAllowedConsumers(results);
                        if (callback) callback();
                        break;
                }
                break;
            default:
                roster2.setAllowedConsumers([]);
                if (callback) callback();
                break;
        }
    }

    function showConsumerExtras(consumercard, consumerid) {
        var extras = POPUP.build({ id: 'consumerExtrasPopup' });
        extras.classList.add('extras');
        POPUP.show(extras);

        var evv;
        // check cache for instance by consumerid
        if (consumerid in $.session.evvDataCache) {
            // if exist in cache grab it
            evv = $.session.evvDataCache[consumerid];
            evv.editInit();
            evv.populatePopup();
        } else {
            // if nothing found create new EVV instance
            evv = new EVV({
                consumer: consumercard,
                consumerId: consumerid,
                signatureDataUrl: '',
                noteDataString: '',
                fromSave: false,
            });
            evv.populatePopup();
        }
    }
    function buildConsumerCard(consumerCard, consumerData) {
        consumerCard.classList.remove('highlighted');

        var card = document.createElement('div');
        card.classList.add('seConsumerCard');

        card.appendChild(consumerCard);

        if (
            $.session.singleEntryShowConsumerSignature === 'Y' ||
            $.session.singleEntryShowConsumerNote === 'Y'
        ) {
            var hasNote = consumerData.hasNote === 'True' ? true : false;
            var hasSignature = consumerData.hasSignature === 'True' ? true : false;
            var classes = hasSignature || hasNote ? ['evv-highlight', 'extrasBtn'] : ['extrasBtn'];
            var extrasBtn = button.build({
                text: 'Action',
                type: 'contained',
                style: 'secondary',
                classNames: classes,
                callback: function () {
                    showConsumerExtras(consumerCard, consumerData.consumerid);
                },
            });
            card.appendChild(extrasBtn);
        }

        consumerCard.addEventListener('click', removeConsumerFromTimeCard);

        return card;
    }
    function moveConsumersToTimeCard(consumers) {
        var consumerList = document.querySelector('.timeCard__consumers');
        consumers.forEach(async consumer => {
            //If consumer is already on the selected consumer list ignore
            if (consumerIds.filter(id => id === consumer.id).length > 0) return;
            consumer.card.classList.remove('highlighted');
            var clone = consumer.card.cloneNode(true);
            var card = buildConsumerCard(clone, { consumerid: consumer.id });
            consumerList.appendChild(card);
            consumerIds.push(consumer.id);
            await evvCheckConsumerEligibility(consumer.id);
            numberOfConsumersPresent = consumerIds.length;
        });
        checkPermissions();
    }
    function removeConsumerFromTimeCard(event) {
        if (
            $.session.singleEntryAddConsumersOnBillable === 'P' &&
            isEdit === true &&
            consumerIds.length === 1
        ) {
            // do not allow them to remove consumer and show an error
            var consumerWarningPopup = POPUP.build({
                classNames: ['warning'],
            });

            var warningMessage = document.createElement('p');
            warningMessage.innerHTML = 'You are not allowed to remove consumers from this entry.';

            consumerWarningPopup.appendChild(warningMessage);

            POPUP.show(consumerWarningPopup);
            return;
        }

        // remove consumer from active consumers
        var consumerSection = event.target.parentElement.parentElement;
        var consumerWrap = event.target.parentElement;
        consumerSection.removeChild(consumerWrap);

        var consumerid = event.target.dataset.consumerId;
        roster2.removeConsumerFromActiveConsumers(consumerid);
        consumerIds = consumerIds.filter(id => id !== consumerid);

        var activeConsumers = roster2.getActiveConsumers();
        numberOfConsumersPresent = activeConsumers ? activeConsumers.length : '0';
        // Remove consumer from evv data cache
        removeConsumerFromEVVCache(consumerid);
        //
        checkPermissions();
        evvCheckRemainingConsumers();
    }

    // Transportation
    //------------------------------------
    function saveTransportation() {
        transportationSaved = true;
        POPUP.hide(transportationPopup);
        transportationBtn.classList.add('success');
    }
    function deleteTransportation() {
        transportationSaved = false;
        POPUP.hide(transportationPopup);
        clearTransportationValues();
        transportationBtn.classList.remove('success');
    }
    function clearTransportationValues() {
        destination = null;
        odometerEnd = null;
        odometerStart = null;
        reason = null;
        transportationType = null;
        transportationReimbursable = null;
        transportationUnits = null;
        licensePlateNumber = null;
    }
    function calculateMileage(startVal, endVal) {
        var start = parseInt(startVal);
        var end = parseInt(endVal);
        if (start && end && start <= end) {
            return end - start;
        } else {
            return 'error';
        }
    }
    function checkTransportationRequiredFields() {
        //var isTransEdit = transportationBtn.classList.contains('success');
        // odometer
        function checkOdometer() {
            var odoTotal = odometerTotalInput.querySelector('input');

            var odoStartVal = odometerStart;
            var odoEndVal = odometerEnd;
            var odoTotalVal = transportationUnits;

            var isStartValid;
            var isEndValid;

            function checkStartVal() {
                if (!odoStartVal || odoStartVal === '') {
                    odometerStartInput.classList.add('error');
                    return 'error';
                } else {
                    odometerStartInput.classList.remove('error');
                    return 'success';
                }
            }
            function checkEndVal() {
                if (!odoEndVal || odoEndVal === '') {
                    odometerEndInput.classList.add('error');
                    return 'error';
                } else {
                    odometerEndInput.classList.remove('error');
                    return 'success';
                }
            }
            function setToalMiles() {
                var totalMiles = calculateMileage(odoStartVal, odoEndVal);
                if (totalMiles !== 'error') {
                    odoTotal.value = totalMiles;
                    transportationUnits = totalMiles;
                    odometerTotalInput.classList.remove('error');
                } else {
                    odometerStartInput.classList.add('error');
                    odometerEndInput.classList.add('error');
                    odometerTotalInput.classList.add('error');
                }
            }

            if (requiredFields.isOdometerRequired === 'Y') {
                // only allowed to use odo start & stop inputs
                // odometerTotalInput.classList.add('disabled');
                isStartValid = checkStartVal();
                isEndValid = checkEndVal();
                if (isStartValid !== 'error' && isEndValid !== 'error') {
                    setToalMiles();
                }

                if (
                    transportationUnits !== '' &&
                    (odometerEnd == '' || odometerEnd == null) &&
                    (odometerStart == '' || odometerStart == null)
                ) {
                    odometerTotalInput.classList.remove('error');
                    odometerStartInput.classList.remove('error');
                    odometerEndInput.classList.remove('error');
                }

                if (
                    transportationUnits == null &&
                    (odometerEnd == '' || odometerEnd == null) &&
                    (odometerStart == '' || odometerStart == null)
                ) {
                    odometerTotalInput.classList.add('error');
                    odometerStartInput.classList.add('error');
                    odometerEndInput.classList.add('error');
                }

                return;
            }

            if (requiredFields.isOdometerRequired === 'N') {
                // allowed to use any of the three
                var startValue = !odoStartVal || odoStartVal === '' ? false : true;
                var endValue = !odoEndVal || odoEndVal === '' ? false : true;
                var totalValue = !odoTotalVal || odoTotalVal === '' ? false : true;

                if (!startValue && !endValue && !totalValue) {
                    // blank slate, clear all errors
                    // odometerTotalInput.classList.remove('disabled');
                    // odometerTotalInput.classList.remove('error');
                    odometerTotalInput.classList.add('error');
                    odometerStartInput.classList.remove('disabled');
                    odometerStartInput.classList.add('error');
                    odometerEndInput.classList.remove('disabled');
                    odometerEndInput.classList.add('error');

                    return;
                }

                if (
                    (totalValue && (!startValue || !endValue)) ||
                    (odoStartVal === '0' && odoEndVal === '0')
                ) {
                    // use total miles input
                    // var odometerTotalInput = odometerTotalInput.querySelector('input');
                    if (!startValue && endValue) {
                        //var odoStartInput = odometerStartInput.querySelector('input');
                        odometerEndInput.classList.remove('error');
                        odometerEndInput.classList.remove('disabled');
                        odometerStartInput.classList.add('error');
                        odometerStartInput.classList.remove('disabled');
                        odometerTotalInput.classList.add('disabled');
                        //  odometerTotalInput.classList.add('error');
                        odoTotal.value = '';
                        totalValue = false;
                        odoTotalVal = '';
                    }
                    if (!endValue && startValue) {
                        // var odoEndInput = odometerEndInput.querySelector('input');
                        odometerStartInput.classList.remove('error');
                        odometerStartInput.classList.remove('disabled');
                        odometerEndInput.classList.add('error');
                        odometerEndInput.classList.remove('disabled');
                        odometerTotalInput.classList.add('disabled');
                        // odometerTotalInput.classList.add('error');
                        odoTotal.value = '';
                        totalValue = false;
                        odoTotalVal = '';
                    }

                    if (!endValue && !startValue && odoTotal.value !== '') {
                        // var odoEndInput = odometerEndInput.querySelector('input');
                        odometerEndInput.classList.remove('error');
                        odometerEndInput.classList.add('disabled');
                        odometerStartInput.classList.remove('error');
                        odometerStartInput.classList.add('disabled');
                        odometerTotalInput.classList.remove('disabled');
                        odometerTotalInput.classList.remove('error');
                        // odoTotal.value = '';
                        //  totalValue = false;
                        //  odoTotalVal = '';
                    }

                    if (!endValue && !startValue && odoTotal.value === '') {
                        // var odoEndInput = odometerEndInput.querySelector('input');
                        odometerEndInput.classList.add('error');
                        odometerEndInput.classList.remove('disabled');
                        odometerStartInput.classList.add('error');
                        odometerStartInput.classList.remove('disabled');
                        odometerTotalInput.classList.remove('disabled');
                        odometerTotalInput.classList.add('error');
                        odoTotal.value = '';
                        totalValue = false;
                        odoTotalVal = '';
                    }
                    //odoStartInput.value = '';
                    // odoEndInput.value = '';

                    return;
                }

                if (startValue || endValue) {
                    // use odo start & end inputs
                    odometerTotalInput.classList.add('disabled');

                    isStartValid = checkStartVal();
                    isEndValid = checkEndVal();
                    if (isStartValid !== 'error' && isEndValid !== 'error') {
                        setToalMiles();
                    }

                    return;
                }
            }
        } // end of odometer check

        function checkTotalMiles() {
            var totalMilesVal = transportationUnits;

            if (requiredFields.isOdometerRequired === 'N') {
                if (totalMilesVal === '' || !totalMilesVal) {
                    odometerTotalInput.classList.add('error');
                } else {
                    odometerTotalInput.classList.remove('error');
                }
            }
        }

        // reason
        function checkReason() {
            var reasonVal = reason;

            if (requiredFields.isReasonRequired === 'Y') {
                if (reasonVal === '' || !reasonVal) {
                    reasonInput.classList.add('error');
                } else {
                    reasonInput.classList.remove('error');
                }
            }
        }
        // destination
        function checkDestination() {
            var destinationVal = destination;

            if (requiredFields.isDestinationRequired === 'Y') {
                if (destinationVal === '' || !destinationVal) {
                    destinationInput.classList.add('error');
                } else {
                    destinationInput.classList.remove('error');
                }
            }
        }

        // license plate
        function checkLicensePlate() {
            var licenseplateVal = licensePlateNumber;

            if (requiredFields.isLicensePlateRequired === 'Y') {
                if (licenseplateVal === '' || !licenseplateVal) {
                    licenseplateInput.classList.add('error');
                } else {
                    licenseplateInput.classList.remove('error');
                }
            }
        }

        checkTotalMiles();
        checkOdometer();
        checkReason();
        checkDestination();
        checkLicensePlate();

        var errors = [].slice.call(transportationPopup.querySelectorAll('.error'));
        if (errors && errors.length === 0) {
            saveTransBtn.classList.remove('disabled');
        } else {
            saveTransBtn.classList.add('disabled');
        }
    }
    function setupTransportationEvents() {
        // cache old values in case of cancel click
        var oldTransportationType;
        var oldlicenseplate;
        var oldTransportationReimbursable;
        var oldOdometerStart;
        var oldOdometerEnd;
        var oldTransportationUnits;
        var oldDestination;
        var oldReason;

        transportationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];

            oldTransportationType = transportationType;
            oldTransportationReimbursable = transportationReimbursable;

            if (selectedOption.value === 'Company') {
                transportationType = selectedOption.value;
                transportationReimbursable = 'N';
            } else if (selectedOption.value === 'Personal') {
                transportationType = selectedOption.value;
                transportationReimbursable = 'Y';
            }
            checkTransportationRequiredFields();
        });

        licenseplateInput.addEventListener('change', event => {
            if (!oldlicenseplate) oldlicenseplate = licensePlateNumber;
            licensePlateNumber = event.target.value;
            checkTransportationRequiredFields();
        });
        odometerStartInput.addEventListener('change', event => {
            if (!oldOdometerStart) oldOdometerStart = odometerStart;
            odometerStart = event.target.value;
            checkTransportationRequiredFields();
        });
        odometerEndInput.addEventListener('change', event => {
            if (!oldOdometerEnd) oldOdometerEnd = odometerEnd;
            odometerEnd = event.target.value;
            checkTransportationRequiredFields();
        });
        odometerTotalInput.addEventListener('change', event => {
            // oldTransportationUnits = transportationUnits;
            transportationUnits = event.target.value;
            checkTransportationRequiredFields();
        });
        destinationInput.addEventListener('change', event => {
            if (!oldDestination) oldDestination = destination;
            destination = event.target.value;
            checkTransportationRequiredFields();
        });
        reasonInput.addEventListener('change', event => {
            if (!oldReason) oldReason = reason;
            reason = event.target.value;
            checkTransportationRequiredFields();
        });

        saveTransBtn.addEventListener('click', () => {
            saveTransportation();
            checkPermissions();
        });
        deleteTransBtn.addEventListener('click', deleteTransportation);
        cancelTransBtn.addEventListener('click', () => {
            if (transportationSaved) {
                transportationType = oldTransportationType ? oldTransportationType : transportationType;
                transportationReimbursable = oldTransportationReimbursable
                    ? oldTransportationReimbursable
                    : transportationReimbursable;
                odometerStart =
                    oldOdometerStart || oldOdometerStart === '' ? oldOdometerStart : odometerStart;
                odometerEnd = oldOdometerEnd || oldOdometerEnd === '' ? oldOdometerEnd : odometerEnd;
                destination = oldDestination ? oldDestination : destination;
                reason = oldReason ? oldReason : reason;
                licensePlateNumber = oldlicenseplate ? oldlicenseplate : licensePlateNumber;
            } else {
                clearTransportationValues();
            }

            POPUP.hide(transportationPopup);
        });
    }
    function populateTransportationDropdown() {
        var data = [
            { value: 'Personal', text: 'Personal' },
            { value: 'Company', text: 'Company' },
        ];

        if (!transportationType || transportationType === 'Personal') {
            transportationType = 'Personal';
            transportationReimbursable = 'Y';
        }

        dropdown.populate(transportationDropdown, data, transportationType);
    }
    function buildTransportationPopup() {
        // clear tmp values
        tmpTransportationType = null;
        tmpTransportationReimbursable = null;
        tmpOdometerStart = null;
        tmpOdometerEnd = null;
        tmpTransportationUnits = null;
        tmpDestination = null;
        tmpReason = null;
        tmpLicenseplate = null;

        var popupClassNames = isCardDisabled
            ? ['timeEntryTransportationPopup', 'popup--filter', 'disabled']
            : ['timeEntryTransportationPopup', 'popup--filter'];

        transportationPopup = POPUP.build({
            classNames: popupClassNames,
            hideX: true,
        });

        transportationDropdown = dropdown.build({
            label: 'Transportation Type',
            style: 'secondary',
        });
        licenseplateInput = input.build({
            label: 'License Plate',
            type: 'text',
            style: 'secondary',
            value: licensePlateNumber,
            attributes: [{ key: 'maxlength', value: 10 }],
        });
        odometerStartInput = input.build({
            label: 'Odometer Start',
            type: 'number',
            style: 'secondary',
            value: odometerStart === '0' ? '' : odometerStart,
        });
        odometerEndInput = input.build({
            label: 'Odometer End',
            type: 'number',
            style: 'secondary',
            value: odometerEnd === '0' ? '' : odometerEnd,
        });
        odometerTotalInput = input.build({
            label: 'Total Miles',
            type: 'number',
            style: 'secondary',
            value: transportationUnits,
        });
        destinationInput = input.build({
            label: 'Destination',
            type: 'textarea',
            style: 'secondary',
            value: destination,
        });
        reasonInput = input.build({
            label: 'Reason',
            type: 'textarea',
            style: 'secondary',
            value: reason,
        });

        saveTransBtn = button.build({
            text: 'Save',
            type: 'contained',
            style: 'secondary',
            classNames: 'disabled',
        });
        deleteTransBtn = button.build({
            text: 'Delete',
            type: 'outlined',
            style: 'secondary',
        });
        cancelTransBtn = button.build({
            text: 'Cancel',
            type: 'outlined',
            style: 'secondary',
            classNames: 'cancelTransBtn',
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(saveTransBtn);
        btnWrap.appendChild(deleteTransBtn);
        btnWrap.appendChild(cancelTransBtn);

        transportationPopup.appendChild(transportationDropdown);
        transportationPopup.appendChild(odometerStartInput);
        transportationPopup.appendChild(odometerEndInput);
        transportationPopup.appendChild(odometerTotalInput);
        transportationPopup.appendChild(licenseplateInput);
        transportationPopup.appendChild(destinationInput);
        transportationPopup.appendChild(reasonInput);
        transportationPopup.appendChild(btnWrap);

        populateTransportationDropdown();
        setupTransportationEvents();
        checkTransportationRequiredFields();

        POPUP.show(transportationPopup);
    }
    function buildTransportationBtn() {
        var classes = isTransportationValid ? ['transportationBtn', 'success'] : ['transportationBtn'];
        return (btn = button.build({
            text: 'Add Transportation',
            icon: 'car',
            style: 'secondary',
            type: 'outlined',
            classNames: classes,
        }));
    }

    // Permissions & Required Fields
    //------------------------------------
    function checkRequiredFields() {
        // date
        function checkDates() {
            var payPeriodStart = new Date(payPeriod.start.split('-').join('/'));
            var payPeriodEnd = new Date(payPeriod.end.split('-').join('/'));
            var newEntryDate = entryDate.split('-');
            newEntryDate[1] = newEntryDate[1] - 1;
            newEntryDate = new Date(newEntryDate[0], newEntryDate[1], newEntryDate[2], 0, 0, 0);

            // check if entered date is outside the pay period
            var isDateAfter = dates.isAfter(newEntryDate, payPeriodStart);
            var isDateBefore = dates.isBefore(newEntryDate, payPeriodEnd);

            if (!isDateAfter) isDateAfter = dates.isEqual(newEntryDate, payPeriodStart);
            if (!isDateBefore) isDateBefore = dates.isEqual(newEntryDate, payPeriodEnd);

            if (!isDateAfter || !isDateBefore) {
                dateInput.classList.add('error');
            } else {
                dateInput.classList.remove('error');
            }

            // check if entered date is beyond todays date
            var todayDate = new Date(UTIL.getTodaysDate().split('-').join('/'));
            var isDateAfterToday = dates.isAfter(newEntryDate, todayDate);

            // for non-billable work codes, selected date can be beyond today
            // Added isDateAfter, and isDateBefore check. Can't blanket remove the error for non-billable
            // because the date still has to be within the pay period
            if (isBillable === 'N' && isDateAfter && isDateBefore) dateInput.classList.remove('error');
            if (isBillable === 'Y' && isDateAfter && isDateBefore && isDateAfterToday)
                dateInput.classList.add('error');
        }
        // workcode
        function checkWorkcodes() {
            var workCodeSelect = workCodeDropdown.querySelector('select');
            var currentValue = workCodeSelect.value;
            if (currentValue === '%') {
                workCodeDropdown.classList.add('error');
            } else {
                workCodeDropdown.classList.remove('error');
            }
        }
        // location
        function checkLocation() {
            var isDisabled = locationDropdown.classList.contains('disabled');
            var locationSelect = locationDropdown.querySelector('select');
            var currentValue = locationSelect.value;
            if (isDisabled) {
                locationDropdown.classList.remove('error');
            } else {
                if (currentValue === '%' || currentValue === '') {
                    locationDropdown.classList.add('error');
                    roster2.toggleMiniRosterBtnVisible(false);
                } else {
                    locationDropdown.classList.remove('error');
                    if (isBillable === 'Y') roster2.toggleMiniRosterBtnVisible(true);
                }
            }
        }

        // startTime, endTime & totalHours
        function checkTimeAndHours() {
            var startInput = startTimeInput.querySelector('input');
            var endInput = endTimeInput.querySelector('input');
            var hoursInput = totalHoursInput.querySelector('input');

            if (!isBillable) {
                startTimeInput.classList.remove('error');
                totalHoursInput.classList.remove('error');
            } else {
                if (keyStartStop === 'Y') {
                    if (!timeOverlap) {
                        endTimeInput.classList.remove('error');
                    }

                    var isStartTimeValid = UTIL.validateTime(startInput.value);
                    var isEndTimeValid = UTIL.validateTime(endInput.value);
                    if (isStartTimeValid) {
                        startTimeInput.classList.remove('error');
                    } else {
                        startTimeInput.classList.add('error');
                    }

                    var todaysDate = UTIL.getTodaysDate();
                    // error endTime: for billable codes with Service Date today, don't allow cross over midnight (next day)
                    if (isEdit && evvReasonCode !== '') {
                        if (
                            isBillable === 'Y' &&
                            entryDate === todaysDate &&
                            checkTimeForAfterNow(endInput.value)
                        ) {
                            endTimeInput.classList.add('error');
                        }
                    } else if (isEdit && evvReasonCode === '') {
                        if (isBillable === 'Y' && entryDate > todaysDate) {
                            endTimeInput.classList.add('error');
                        }
                    } else {
                        if (
                            isBillable === 'Y' &&
                            entryDate === todaysDate &&
                            $.session.singleEntrycrossMidnight
                        ) {
                            endTimeInput.classList.add('error');
                        }
                    }
                    totalHoursInput.classList.remove('error');
                } else {
                    if (hoursInput.value === '' || hoursInput.value < 0) {
                        totalHoursInput.classList.add('error');
                    } else {
                        totalHoursInput.classList.remove('error');
                    }
                    startTimeInput.classList.remove('error');
                }
            }
        }
        function checkStartTimeInputsForAfterNow() {
            const tempNow = new Date();
            const convertedToday = new Date(tempNow.getFullYear(), tempNow.getMonth(), tempNow.getDate());
            const splitServiceDate = entryDate.split('-');
            const entryDateObj = new Date(
                splitServiceDate[0],
                parseInt(splitServiceDate[1]) - 1,
                splitServiceDate[2],
            );

            if (isBillable === 'Y' && sendEvvData === 'Y' && !(entryDateObj < convertedToday)) {
                if (checkTimeForAfterNow(startTime)) {
                    startTimeInput.classList.add('error');
                }
                if (checkTimeForAfterNow(endTime) && endTime !== '00:00') {
                    endTimeInput.classList.add('error');
                }
            }
        }
        // consumers
        function checkConsumers() {
            var activeConsumers = roster2.getActiveConsumers();
            var consumerError = document.querySelector('.consumerSectionError');

            if (isBillable === 'Y') {
                // error
                if ($.session.singleEntryAddConsumersOnBillable === 'P') {
                    // require a consumer to be picked
                    if (activeConsumers.length < 1) {
                        // show consumer error
                        consumerError.innerHTML = `*You must select at least one consumer.`;
                        consumerError.classList.add('error');
                        consumerError.classList.remove('hidden');
                    } else {
                        consumerError.classList.add('hidden');
                        consumerError.classList.remove('warning');
                        consumerError.classList.remove('error');
                    }
                }
                // warning
                if ($.session.singleEntryAddConsumersOnBillable === 'Y') {
                    // do not require a consumer to be picked but give warning
                    if (activeConsumers.length < 1) {
                        // show consumer warning
                        consumerError.innerHTML = `*It is advised you select a consumer.`;
                        consumerError.classList.add('warning');
                        consumerError.classList.remove('hidden');
                    } else {
                        consumerError.classList.add('hidden');
                        consumerError.classList.remove('warning');
                        consumerError.classList.remove('error');
                    }
                }
            } else {
                consumerError.classList.add('hidden');
                consumerError.classList.remove('warning');
                consumerError.classList.remove('error');
            }
        }
        // note
        function checkNote() {
            if (requiredFields.isNoteRequired === 'Y') {
                if (noteText === '' || !noteText) {
                    noteInput.classList.add('error');
                } else {
                    noteInput.classList.remove('error');
                }
            }
        }
        function checkEvv() {
            var isDisabled = reasonDropdown.classList.contains('disabled');
            var reasonSelect = reasonDropdown.querySelector('select');
            var currentValue = reasonSelect.value;
            if (isDisabled) {
                reasonDropdown.classList.remove('error');
            } else {
                if (
                    currentValue === '%' ||
                    (currentValue === '' &&
                        reasonRequired &&
                        (!evvReasonCode || evvReasonCode === '%') &&
                        defaultTimesChanged)
                ) {
                    if (document.querySelector('.timeCard__evv').style.display !== 'none') {
                        reasonDropdown.classList.add('error');
                    }

                    // roster2.toggleMiniRosterBtnVisible(false);
                } else {
                    reasonDropdown.classList.remove('error');
                    // if (isBillable === 'Y') roster2.toggleMiniRosterBtnVisible(true);
                }
            }
        }

        checkDates();
        checkWorkcodes();
        checkLocation();
        checkTimeAndHours();
        checkStartTimeInputsForAfterNow();
        checkConsumers();
        checkNote();
        checkEvv();

        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (status === 'A' || status === 'S' || status === 'I' || hasErrors.length !== 0) {
            if ($.session.SingleEntryEditTimeEntry && status === 'A') {
                saveBtn.classList.remove('disabled');
                deleteBtn.classList.remove('disabled');
                saveAndSumbitBtn.classList.remove('disabled');

                if (hasErrors.length !== 0) {
                    saveBtn.classList.add('disabled');
                    deleteBtn.classList.add('disabled');
                    saveAndSumbitBtn.classList.add('disabled');
                }
            } else {
                saveBtn.classList.add('disabled');
                // deleteBtn.classList.add('disabled');
                saveAndSumbitBtn.classList.add('disabled');
            }
        } else {
            saveBtn.classList.remove('disabled');
            deleteBtn.classList.remove('disabled');

            if (keyStartStop === 'Y') {
                // if 'Y' then end time is enabled and we need to check for it
                if (endTime) {
                    saveAndSumbitBtn.classList.remove('disabled');
                } else {
                    saveAndSumbitBtn.classList.add('disabled');
                }
            } else {
                // no check needed, done by hasErrors
                saveAndSumbitBtn.classList.remove('disabled');
            }
        }
    }
    function checkPermissions() {
        // Enable/Disable Fields
        if ($.session.SingleEntryEditTimeEntry && status === 'A') {
        } else if (
            $.session.editSingleEntryCardStatus === 'S' ||
            $.session.editSingleEntryCardStatus === 'I' ||
            $.session.editSingleEntryCardStatus === 'A'
        ) {
            disableInput(dateInput);
            disableInput(startTimeInput);
            disableInput(endTimeInput);
            disableInput(noteInput);
            if (licenseplateInput) disableInput(licenseplateInput);
        }

        // Location dropdown
        if (
            (isBillable === 'Y' || !isBillable) &&
            !$.session.singleEntryUseServiceLocations &&
            $.session.singleEntryAddConsumersOnBillable === 'P'
        ) {
            disableInput(locationDropdown);
        } else {
            enableInput(locationDropdown);
        }

        // Key Times
        if (!isBillable) {
            disableInput(totalHoursInput);
            disableInput(startTimeInput);
            disableInput(endTimeInput);
        } else {
            if (keyStartStop === 'Y') {
                disableInput(totalHoursInput);
                enableInput(startTimeInput);
                enableInput(endTimeInput);
            } else {
                enableInput(totalHoursInput);
                disableInput(startTimeInput);
                disableInput(endTimeInput);
            }
        }

        // Save, Delete & Cancel Buttons
        if (isEdit) {
            if (
                $.session.editSingleEntryCardStatus === 'S' ||
                $.session.editSingleEntryCardStatus === 'I' ||
                // $.session.editSingleEntryCardStatus === 'R' ||
                $.session.SingleEntryUpdate === false
            ) {
                saveBtn.classList.add('disabled');
                deleteBtn.classList.add('disabled');
                saveAndSumbitBtn.classList.add('disabled');
            } else {
                saveBtn.classList.remove('disabled');
                deleteBtn.classList.remove('disabled');
                saveAndSumbitBtn.classList.remove('disabled');
            }
        }

        checkRequiredFields();
    }

    // Events
    //------------------------------------
    function setupCardEvents() {
        if (!isEdit) {
            payPeriodDropdown.addEventListener('change', event => {
                const selectedOption = event.target.options[event.target.selectedIndex];
                var dateRange = event.target.value.split(' - ');
                var startDateIso = UTIL.formatDateToIso(dateRange[0]);
                var endDateIso = UTIL.formatDateToIso(dateRange[1]);
                sendEvvData = selectedOption.dataset.sendevv;
                payPeriod = timeEntry.setSelectedPayPeriod(startDateIso, endDateIso, event.target.value);
                updateDateValMinMax();
            });
        } else {
            deleteBtn.addEventListener('click', event => {
                var warningMessage = `This entry will be permanently deleted, do you wish to continue?`;
                timeEntryReview.showDeleteEntryWarningPopup(warningMessage, () =>
                    timeEntry.deleteEntry(singleEntryId, isAdminEdit, payPeriod),
                );
            });
        }

        locationDropdown.addEventListener('change', event => {
            locationId = event.target.value;
            setAllowedConsumers();
            clearConsumerSection();
            checkPermissions();
        });
        reasonDropdown.addEventListener('change', event => {
            evvReasonCode = event.target.value;
            checkPermissions();
        });
        locationTypeDropdown.addEventListener('change', event => {
            locationTypeCode = event.target.value;
            checkPermissions();
        });
        attestCheckbox.addEventListener('change', event => {
            checkAttestStatus();
        });
        workCodeDropdown.addEventListener('change', event => workCodeDropdownEvent(event));
        dateInput.addEventListener('change', event => {
            entryDate = event.target.value;
            roster2.updateSelectedDate(entryDate);
            evvCheckConsumerEligibilityExistingConsumers();
            checkPermissions();
        });
        dateInput.addEventListener('keydown', event => {
            event.preventDefault();
            event.stopPropagation();
        });
        startTimeInput.addEventListener('focusout', async event => {
            var hoursInput = totalHoursInput.querySelector('input');
            var isTimeValid = UTIL.validateTime(event.target.value);
            if (!isTimeValid) {
                hoursInput.value = '';
                checkPermissions();
                return;
            }

            const origStartTime = startTime;
            startTime = `${event.target.value.split(':')[0]}:${event.target.value.split(':')[1]}`;
            if ($.session.singleEntry15minDoc === 'Y' && origStartTime !== startTime) {
                var min = parseInt(startTime.split(':')[1]);
                if (min % 15 !== 0) {
                    errorPopup('This is not a valid time, you must document to the nearest quarter hour.');
                    event.target.value = '';
                    startTime = '0';
                }
            }

            if (origStartTime !== startTime) defaultTimesChanged = true;
            if (origStartTime !== startTime) {
                defaultStartTimeChanged = true;
                reasonRequired = true; // for evv
            } else {
                defaultStartTimeChanged = false;
                reasonRequired = false;
            }

            if (isEdit && defaultStartTimeChanged) {
                reasonDropdown.classList.remove('disabled');
                const reasonCodeDropdown = reasonDropdown.querySelector('select');
                reasonCodeDropdown.value = '%';
                evvReasonCode = '%';
                reasonDropdown.classList.add('error');
            }

            await evvCheck();
            setTotalHours();
            checkPermissions();
            UTIL.getGeoLocation(setStartTimeLocation);
        });
        endTimeInput.addEventListener('click', event => {
            setEndTimeOnClick(event);
        });
        endTimeInput.addEventListener('focusout', async event => {
            var hoursInput = totalHoursInput.querySelector('input');
            var endInput = endTimeInput.querySelector('input');
            var isTimeValid = UTIL.validateTime(event.target.value);
            if (!isTimeValid) {
                $.session.singleEntrycrossMidnight = false;
                //	crossMidnightTimeData = {};
                endInput.value = '';
                endTime = null;
                hoursInput.value = '';
                totalHours = null;
                checkPermissions();
                return;
            }
            var now = new Date();
            let origEndTime = endTime;
            let systemDefaultForCheckEnd = now.getHours() + ':' + now.getMinutes();
            endTime = `${event.target.value.split(':')[0]}:${event.target.value.split(':')[1]}`; //Edge fucks shit up with selecting time with the time picker
            if ($.session.singleEntry15minDoc === 'Y' && origEndTime !== endTime) {
                // and endTime !== event.target.value
                var min = parseInt(endTime.split(':')[1]);
                if (min % 15 !== 0) {
                    errorPopup('This is not a valid time, you must document to the nearest quarter hour.');
                    event.target.value = '';
                    endTime = '0';
                }
            }

            if (origEndTime) {
                origEndTime = `${origEndTime.split(':')[0]}:${origEndTime.split(':')[1]}`;
            }

            if (origEndTime !== endTime) defaultTimesChanged = true;

            // 9:30:00 !== 9:30
            if (systemDefaultForCheckEnd !== endTime) {
                defaultEndTimeChanged = true;
                reasonRequired = true; // for evv
            } else {
                defaultEndTimeChanged = false;
                reasonRequired = false;
            }

            if (isEdit && defaultTimesChanged) {
                reasonDropdown.classList.remove('disabled');
                const reasonCodeDropdown = reasonDropdown.querySelector('select');
                reasonCodeDropdown.value = '%';
                evvReasonCode = '%';
                reasonDropdown.classList.add('error');
            }

            await evvCheck();
            setTotalHours();
            checkPermissions();
            UTIL.getGeoLocation(setEndTimeLocation);
        });
        // TOTALHOURSINPUT - changed from keyup to input because using the arrow keys
        // (not on the keyboard but in the input itself) didn't trigger the event listener
        totalHoursInput.addEventListener('input', event => {
            totalHours = event.target.value;
            checkPermissions();
        });
        noteInput.addEventListener('keyup', event => {
            noteText = event.target.value;
            checkPermissions();
        });
        transportationBtn.addEventListener('click', () => {
            buildTransportationPopup();
        });
        saveBtn.addEventListener('click', async event => {
            event.target.classList.add('disabled');
            saveOrUpdate = event.target.dataset.insertType;
            if (saveOrUpdate === 'Save') {
                const result = await singleEntryAjax.getExistingTimeEntry();
                const { getExistingTimeEntryResult } = result;
                if (getExistingTimeEntryResult.length > 0) {
                    newTimeEntry.endDateWarningPopup(getExistingTimeEntryResult);
                } else {
                    timeEntry.getEntryData(keyStartStop);
                }
            }
            if (saveOrUpdate === 'Update') timeEntry.updateEntry(isAdminEdit, payPeriod, keyStartStop);
        });
        saveAndSumbitBtn.addEventListener('click', async event => {
            // Save entry first
            event.target.classList.add('disabled');
            saveBtn.classList.add('disabled');
            saveOrUpdate = event.target.dataset.insertType;

            const saveAndUpdate = true;
            if (saveOrUpdate === 'Save') {
                const result = await singleEntryAjax.getExistingTimeEntry();
                const { getExistingTimeEntryResult } = result;
                if (getExistingTimeEntryResult.length > 0) {
                    newTimeEntry.endDateWarningPopup(getExistingTimeEntryResult);
                } else {
                    timeEntry.getEntryData(keyStartStop, saveAndUpdate);
                }
            }
            if (saveOrUpdate === 'Update')
                timeEntry.updateEntry(isAdminEdit, payPeriod, keyStartStop, saveAndUpdate);

            // TODO, make global so access from timeentry.js
            // event.target.classList.remove('disabled');
            // saveBtn.classList.remove('disabled');
        });
        cancelBtn.addEventListener('click', () => {
            if (isAdminEdit) {
                timeApproval.refreshPage(payPeriod);
            } else {
                timeEntryReview.refreshPage(payPeriod);
            }
            clearAllGlobalVariables();
        });
    }
    function enableSaveButtons() {
        saveBtn.classList.remove('disabled');
        saveAndSumbitBtn.classList.remove('disabled');
    }

    function enableSaveButton() {
        saveBtn.classList.remove('disabled');
    }

    async function customRosterApplyFilterEvent() {
        if (isBillable === 'Y' && !$.session.singleEntryUseServiceLocations) {
            // check if residence === 'N'
            var allowedConsumers = await getAllowedConsumersBasedOffResidence();
            roster2.setAllowedConsumers(allowedConsumers);
        } else {
            // roster.setAllowedConsumers([]);
            // var allowedConsumers = await getAllowedConsumersBasedOffServiceLocations();
            // roster2.setAllowedConsumers(allowedConsumers);
            await setAllowedConsumers();
        }
    }

    async function workCodeDropdownEvent(event) {
        var selectedOption = event.target.options[event.target.selectedIndex];
        workCode = selectedOption.value;
        isBillable = selectedOption.dataset.billable;
        keyStartStop = selectedOption.dataset.keytimes;
        wcServiceType = selectedOption.dataset.servicetype;

        updateDateValMinMax(false);

        if (isBillable === 'Y' && !$.session.singleEntryUseServiceLocations) {
            // check if residence === 'N'
            var allowedConsumers = await getAllowedConsumersBasedOffResidence();
            roster2.setAllowedConsumers(allowedConsumers);
        } else {
            // roster.setAllowedConsumers([]);
            var allowedConsumers = await getAllowedConsumersBasedOffServiceLocations();
            roster2.setAllowedConsumers(allowedConsumers);
        }

        var miniRosterBtn = document.querySelector('.consumerListBtn');
        if (miniRosterBtn) {
            if (isBillable === 'Y') {
                miniRosterBtn.classList.remove('disabled');
            } else {
                miniRosterBtn.classList.add('disabled');
            }
        }

        clearCard();
        // Set start time after card gets cleared
        if (keyStartStop === 'Y') {
            startTimeInput.getElementsByTagName('input')[0].value = `${nowHour}:${nowMinutes}`;
            startTime = `${nowHour}:${nowMinutes}`;
            UTIL.getGeoLocation(setStartTimeLocation);
        }

        checkPermissions();
    }

    function setEndTimeOnClick(event) {
        if (endTimeClicks !== 0 || event.target.value !== '') return;
        endTimeClicks = 1;
        let tempEndTime = new Date();
        let endTimeHour = tempEndTime.getHours() < '10' ? `0${now.getHours()}` : tempEndTime.getHours();
        let endTimeMinute =
            tempEndTime.getMinutes() < '10' ? `0${now.getMinutes()}` : tempEndTime.getMinutes();
        event.target.value = `${endTimeHour}:${endTimeMinute}`;
        endTime = `${endTimeHour}:${endTimeMinute}`;
        UTIL.getGeoLocation(setEndTimeLocation);
        setTotalHours();
        checkPermissions();
    }

    // Populate
    //------------------------------------
    function populatePayPeriodDropdown() {
        var dropdownData = payPeriodData.map(pp => {
            var dateArray = pp.dateString.split(' - ');
            var startDate = dateArray[0];
            var endDate = dateArray[1];

            var startDateAbbr = UTIL.abbreviateDateYear(startDate);
            var endDateAbbr = UTIL.abbreviateDateYear(endDate);
            return {
                value: `${startDate} - ${endDate}`,
                text: `${startDateAbbr} - ${endDateAbbr}`,
                attributes: [{ key: 'data-sendEvv', value: pp.sendEvvData }],
            };
        });
        sendEvvData = dropdownData[0].attributes[0].value;
        dropdown.populate(payPeriodDropdown, dropdownData, payPeriod.dateString);
    }
    function populateLocationDropdown() {
        // ID, Name, Residence, SE_Trans_Reimbursable
        var dropdownData = locationData.map(loc => {
            return {
                value: loc.ID,
                text: loc.Name,
            };
        });

        dropdownData.unshift({ value: '%', text: '' });

        dropdown.populate(locationDropdown, dropdownData, locationId);
    }
    function populateWorkCodeDropdown() {
        var wcData;

        if (isEdit) {
            wcData = workCodeData.filter(wc => wc.billable === isBillable);
        } else {
            wcData = workCodeData;
        }

        var dropdownData = wcData.map(wc => {
            return {
                value: wc.workcodeid,
                text: wc.workcodename,
                attributes: [
                    { key: 'data-billable', value: wc.billable },
                    { key: 'data-keyTimes', value: wc.keyTimes },
                    { key: 'data-serviceType', value: wc.serviceType },
                ],
            };
        });

        dropdownData.unshift({ value: '%', text: '' });

        dropdown.populate(workCodeDropdown, dropdownData, workCode);
    }
    function populateReasonCodeDropdown() {
        const dropdownData = evvReasonCodeObj.map(reason => {
            return {
                value: reason.reasonCode,
                text: `${reason.reasonCode} - ${reason.reasonDescription}`,
            };
        });
        dropdownData.unshift({ value: '%', text: '' });
        dropdown.populate(reasonDropdown, dropdownData, evvReasonCode);


        if (evvReasonCode == null || evvReasonCode == '%' || evvReasonCode == undefined || evvReasonCode == '99') {
            evvReasonCode = '99';
            reasonCodeValue = '99 - Documentation on file supports manual change';
        }
        else {
            reasonCodeValue = dropdownData.find(x => x.value == evvReasonCode).text;
        }

        if (document.getElementById('reasonInput') != null && document.getElementById('reasonInput') != undefined) {
            document.getElementById('reasonInput').value = reasonCodeValue;
        }

        populateLocationTypeDropdown();
    }

    function populateLocationTypeDropdown() {
        const locationTypeDropdownData = ([
            { id: 1, value: 1, text: "1 - Home" },
            { id: 2, value: 2, text: "2 - Community" },
        ]);
        dropdown.populate(locationTypeDropdown, locationTypeDropdownData, locationTypeCode);
    }
    async function populateCard(useAllWorkCodes) {
        payPeriodData = timeEntry.getPayPeriods(false);
        locationData = timeEntry.getLocations();
        workCodeData = await timeEntry.getWorkCodes(useAllWorkCodes);
        requiredFields = timeEntry.getRequiredFields();
        evvReasonCodeObj = timeEntry.getEvvReasonCodes();

        endTimeClicks = 0;
        now = new Date();
        nowHour = now.getHours() < '10' ? `0${now.getHours()}` : now.getHours();
        nowMinutes = now.getMinutes() < '10' ? `0${now.getMinutes()}` : now.getMinutes();

        if (!isEdit) populatePayPeriodDropdown();
        populateLocationDropdown();
        populateWorkCodeDropdown();

        setupCardEvents();
        checkPermissions();
        if (defaultTimesChanged) showEvv();

        // if (isEdit) {
        // 	singleEntryAjax.getSingleEntryUsersByLocation(locationId, entryDate, function(results) {
        // 		roster.setAllowedConsumers(results);
        // 	});
        // }

        if (isAdminEdit) {
            if (!$.session.SingleEntryEditTimeEntry) {
                isCardDisabled = true;
                card.classList.add('disabled');
                saveBtn.classList.add('disabled');
                deleteBtn.classList.add('disabled');
            } else {
                if (
                    status === 'A' ||
                    status === 'S' ||
                    status === 'I' ||
                    (!$.session.SingleEntryUpdate && isEdit)
                ) {
                    if ($.session.SingleEntryEditTimeEntry && status === 'A') {
                        isCardDisabled = false;
                        card.classList.remove('disabled');
                        enableInput(noteInput);
                    } else {
                        isCardDisabled = true;
                    }
                } else if (status === 'R' || status === 'D') {
                    isCardDisabled = true;
                }
            }
        } else {
            if (
                status === 'A' ||
                status === 'S' ||
                status === 'I' ||
                status === 'D' ||
                (!$.session.SingleEntryUpdate && isEdit)
            ) {
                isCardDisabled = true;
            }
        }

        if (isCardDisabled) {
            card.classList.add('disabled');
            saveBtn.classList.add('disabled');
            saveAndSumbitBtn.classList.add('disabled');
            deleteBtn.classList.add('disabled');
            roster2.toggleMiniRosterBtnVisible(false);
            workCodeDropdown.classList.add('disabled');
            locationDropdown.classList.add('disabled');
            startTimeInput.classList.add('disabled');
            endTimeInput.classList.add('disabled');
            reasonDropdown.classList.add('disabled');
            attestCheckbox.classList.add('disabled');
            transportationBtn.classList.add('disabled');
            dateInput.classList.add('disabled');
            noteInput.classList.add('disabled');
            rejectionReasonInput.classList.add('disabled');
        }
        // initially when editing a rejected/Non-Billable, the Save btns are disabled, they become enabled after the first edit of the form
        if (
            status === 'R' &&
            (personId === $.session.PeopleId || supervisorId === $.session.PeopleId)
        ) {
            saveBtn.classList.add('disabled');
            saveAndSumbitBtn.classList.add('disabled');
        }
    }
    // EVV
    // -----------------------------------
    function checkTimeForAfterNow(enteredTime) {
        let tempNow = new Date();
        let nowHour = tempNow.getHours() < '10' ? `0${now.getHours()}` : tempNow.getHours();
        let nowMinuet = tempNow.getMinutes() < '10' ? `0${now.getMinutes()}` : tempNow.getMinutes();
        return (
            Date.parse(`01/01/2020 ${enteredTime}`) > Date.parse(`01/01/2020 ${nowHour}:${nowMinuet}`)
        );
    }

    async function evvCheck() {
        if (!isEdit) {
            if (startTime) {
                // const timeChanged = startTime !== `${nowHour}:${nowMinutes}`
                await evvCheckConsumerEligibilityExistingConsumers();
                if (
                    isBillable === 'Y' &&
                    defaultTimesChanged &&
                    wcServiceType === 'A' &&
                    sendEvvData === 'Y' &&
                    (reasonRequired === true || isEVVSingleEntry)
                ) {
                    showEvv();
                    // evvCheckConsumerEligibilityExistingConsumers();                    
                } else {
                    document.querySelector('.timeCard__evv').style.display = 'none';
                    document.querySelector('.timeCard__evvattestChk').style.display = 'none';
                    reasonRequired = false;
                }
            }
        } else {
            //isEdit is true
            let wcObj = workCodeData.filter(wc => wc.workcodeid === workCode);
            wcServiceType = wcObj[0].serviceType;
            let ppObj = payPeriodData.filter(pp => pp.dateString === payPeriod.dateString);
            sendEvvData = ppObj[0].sendEvvData;
            await evvCheckConsumerEligibilityExistingConsumers();
            if (
                isBillable === 'Y' &&
                defaultTimesChanged &&
                wcServiceType === 'A' &&
                sendEvvData === 'Y' &&
                (reasonRequired === true || isEVVSingleEntry)
            ) {
                if (defaultEndTimeChanged || defaultTimesChanged) {
                    showEvv();
                    // checkRequiredFields();
                    // await evvCheckConsumerEligibilityExistingConsumers();  
                } else {
                    reasonRequired = false;
                    document.querySelector('.timeCard__evv').style.display = 'none';
                    document.querySelector('.timeCard__evvattestChk').style.display = 'none';
                }
            } else {
                reasonRequired = false;
                document.querySelector('.timeCard__evv').style.display = 'none';
                document.querySelector('.timeCard__evvattestChk').style.display = 'none';
            }
        }
    }

    // async function evvCheckConsumerEligibility(id) {
    //   const eligibilityProm = new Promise((resolve, reject) => {
    //     singleEntryAjax.getEvvEligibility(id, entryDate, res => {
    //       if (res.length > 0) {
    //         eligibleConsumersObj[id] = true;
    //         reasonRequired = true;
    //       } else eligibleConsumersObj[id] = false;
    //       resolve('evvEligibilityChecked');
    //     });
    //   });
    //   eligibilityProm.then(() => evvCheck());
    // }

    // function evvCheckConsumerEligibilityExistingConsumers() {
    //   reasonRequired = false;
    //   consumerIds.forEach(id => {
    //     const eligibilityProm = new Promise((resolve, reject) => {
    //       singleEntryAjax.getEvvEligibility(id, entryDate, res => {
    //         if (res.length > 0) {
    //           reasonRequired = true;
    //           eligibleConsumersObj[id] = true;
    //           checkAttestStatus();
    //         } else eligibleConsumersObj[id] = false;
    //         resolve('evvEligibilityChecked');
    //       });
    //     });
    //     eligibilityProm.then(() => checkRequiredFields());
    //   });
    // }

    async function evvCheckConsumerEligibility(id) {
        const res = await singleEntryAjax.getEvvEligibilityAsync(id, entryDate);
        if (res.length > 0) {
            eligibleConsumersObj[id] = true;
            reasonRequired = true;
        } else {
            eligibleConsumersObj[id] = false;
        }

        await evvCheck();
    }

    async function evvCheckConsumerEligibilityExistingConsumers() {
        reasonRequired = false;
        consumerIds.forEach(async id => {
            const res = await singleEntryAjax.getEvvEligibilityAsync(id, entryDate);
            if (res.length > 0) {
                reasonRequired = true;
                eligibleConsumersObj[id] = true;
                isEVVSingleEntry = true;
            } else {
                eligibleConsumersObj[id] = false;
            }
            disableCardFields();

            if (isEVVSingleEntry && sendEvvData === 'Y' && eVVChangeDate != '' && $.session.stateAbbreviation == 'OH' && todayDate >= eVVChangeDate) {
                populateLocationTypeDropdown();  
                document.querySelector('.timeCard__LocationEvv').style.display = 'flex';
            }
        });

        // checkRequiredFields();
    }
    // under following conditions, the form imputs disabled (except time inputs): 1) entry is rejected, 2) workcode = Billable, 3) user is creator/supervisor, 4) this entry requires EVV
    function disableCardFields() {
        if (
            isEVVSingleEntry &&
            isEdit &&
            isBillable &&
            status == 'R' &&
            (personId === $.session.PeopleId || supervisorId === $.session.PeopleId)
        ) {
            roster2.toggleMiniRosterBtnVisible(false);
            workCodeDropdown.classList.add('disabled');
            locationDropdown.classList.add('disabled');
            attestCheckbox.classList.add('disabled');
            transportationBtn.classList.add('disabled');
            dateInput.classList.add('disabled');
            noteInput.classList.add('disabled');
            rejectionReasonInput.classList.add('disabled');
        }
    }

    async function evvCheckRemainingConsumers() {
        reasonRequired = false;
        consumerIds.forEach(id => {
            if (eligibleConsumersObj[id]) reasonRequired = true;
        });
        await evvCheck();
        checkAttestStatus();
    }

    function showEvv() {
        populateReasonCodeDropdown();
        document.querySelector('.timeCard__evv').style.display = 'flex';
        document.querySelector('.timeCard__evvattestChk').style.display = 'flex';  
        document.querySelector('.timeCard__LocationEvv').style.display = 'flex'; 
        if (eVVChangeDate != '' && $.session.stateAbbreviation == 'OH' && todayDate >= eVVChangeDate && locationTypeCode == null) {
            locationTypeCode = '1';
        }
    }

    function checkAttestStatus() {
        if (reasonRequired && attestCheckbox.getElementsByTagName('input')[0].checked === false) {
            attestCheckbox.classList.add('redButNotError');
        } else {
            attestCheckbox.classList.remove('redButNotError');
        }
    }

    // Build
    //------------------------------------
    // dropdowns
    function buildPayPeriodDropdown() {
        return dropdown.build({
            dropdownId: 'payPeriodsDropdown',
            label: 'Pay Period',
            style: 'secondary',
            readonly: false,
        });
    }
    function buildLocationDropdown() {
        return dropdown.build({
            dropdownId: 'locationsDropodown',
            label: 'Location',
            style: 'secondary',
            readonly: isEdit ? true : false,
        });
    }
    function buildWorkCodeDropdown() {
        return dropdown.build({
            dropdownId: 'workCodesDropdown',
            label: 'Work Code',
            style: 'secondary',
            readonly: false,
        });
    }
    function buildEVVReasonDropdown() {
        return dropdown.build({
            dropdownId: 'reasonDropdown',
            label: 'Reason Code',
            style: 'secondary',
            readonly: false,
        });
    }

    function buildLocationTypeDropdown() {
        return dropdown.build({
            dropdownId: 'locationTypeDropdown',
            label: 'Location Type',
            style: 'secondary',
            readonly: false,
        });
    }

    function buildEVVReasontext() {
        return input.build({
            id: 'reasonInput',
            type: 'text',
            label: 'Reason Code',
            style: 'secondary',
            value: reasonCodeValue,
            readonly: true,
        });
    }
    // inputs
    function buildDateInput() {
        var dateObj = new Date(entryDate);
        var minDate;
        var maxDate;
        if (isEdit) {
            if (isBillable === 'Y') {
                minDate = entryDate;
                maxDate = entryDate;
            } else {
                // minDate = UTIL.getFormattedDateFromDate(dates.startDayOfWeek(dateObj), { separator: '-', format: 'iso' });
                // maxDate = UTIL.getFormattedDateFromDate(dates.endOfWeek(dateObj), { separator: '-', format: 'iso' });
                minDate = payPeriod.start;
                maxDate = payPeriod.end;
            }
        } else {
            //NEW
            if (isBillable === 'Y') {
                minDate = payPeriod.start;
                maxDate = entryDate;
            } else {
                minDate = payPeriod.start;
                maxDate = payPeriod.end;
            }
        }
        return input.build({
            id: 'dateBox',
            label: 'Date',
            type: 'date',
            style: 'secondary',
            value: entryDate,
            attributes: [
                {
                    key: 'min',
                    value: minDate,
                },
                {
                    key: 'max',
                    value: maxDate,
                },
            ],
        });
    }
    function buildStartTimeInput() {
        return (startTimeInput = input.build({
            label: 'Start Time',
            type: 'time',
            style: 'secondary',
            attributes: [{ key: 'step', value: $.session.singleEntry15minDoc === 'Y' ? '900' : '60' }],
            value: startTime,
        }));
    }
    function buildEndTimeInput() {
        return (endTimeInput = input.build({
            label: 'End Time',
            type: 'time',
            style: 'secondary',
            attributes: [{ key: 'step', value: $.session.singleEntry15minDoc === 'Y' ? '900' : '60' }],
            value: endTime,
        }));
    }
    function buildTotalHoursInput() {
        return (totalHoursInput = input.build({
            label: 'Hours',
            type: 'number',
            style: 'secondary',
            value: totalHours,
            attributes: [{ key: 'min', value: '0' }],
        }));
    }
    function buildNoteInput() {
        return (noteInput = input.build({
            label: 'Note',
            style: 'secondary',
            type: 'textarea',
            value: noteText,
        }));
    }
    function buildRejectionReasonInput() {
        return (rejectionReasonInput = input.build({
            id: 'rejectionReason',
            label: 'Rejection Reason',
            style: 'secondary',
            type: 'textarea',
            value: rejectionReason,
        }));
    }
    function buildAttestCheckbox() {
        return (attestCheckbox = input.buildCheckbox({
            text: 'Attest',
            style: 'secondary',
            isChecked: evvAttest ? (evvAttest === 'Y' ? true : false) : true,
        }));
    }

    function buildCommunityCheckbox() {
        return (communityCheckbox = input.buildCheckbox({
            text: 'Community',
            style: 'secondary',
            isChecked: evvCommunity === 'Y' ? true : false,
        }));
    }

    // main sections
    function buildTimeEntrySection() {
        var section = document.createElement('div');
        section.classList.add('timeCard__timeEntry');
        // dropdowns
        if (!isEdit) payPeriodDropdown = buildPayPeriodDropdown();
        locationDropdown = buildLocationDropdown();
        workCodeDropdown = buildWorkCodeDropdown();
        reasonDropdown = buildEVVReasonDropdown();
        locationTypeDropdown = buildLocationTypeDropdown();
        // inputs
        reasonInput = buildEVVReasontext();
        dateInput = buildDateInput();
        startTimeInput = buildStartTimeInput();
        endTimeInput = buildEndTimeInput();
        totalHoursInput = buildTotalHoursInput();
        communityCheckbox = buildCommunityCheckbox();
        noteInput = buildNoteInput();
        rejectionReasonInput = buildRejectionReasonInput();
        attestCheckbox = buildAttestCheckbox();
        // transportation
        transportationBtn = buildTransportationBtn();

        var wrap1 = document.createElement('div'); // dates
        var wrap2 = document.createElement('div'); // dropdowns
        var wrap3 = document.createElement('div'); // times
        var wrap4 = document.createElement('div'); // evv
        var wrap5 = document.createElement('div'); // location evv       
        var wrap6 = document.createElement('div'); // attestCheckbox
        var wrap7 = document.createElement('div'); // evv + location evv
        wrap1.classList.add('timeCard__date');
        wrap2.classList.add('timeCard__other');
        wrap3.classList.add('timeCard__time');
        wrap4.classList.add('timeCard__evv');
        wrap5.classList.add('timeCard__LocationEvv');
        wrap6.classList.add('timeCard__evvattestChk');
        wrap7.classList.add('timeCard__evvLocationEvv');

        //rejection reason should always be disabled!
        rejectionReasonInput.classList.add('disabled');

        // date wrap
        if (!isEdit) wrap1.appendChild(payPeriodDropdown);
        wrap1.appendChild(dateInput);
        // dropdown wrap
        wrap2.appendChild(workCodeDropdown);
        wrap2.appendChild(locationDropdown);
        // time wrap
        wrap3.appendChild(startTimeInput);
        wrap3.appendChild(endTimeInput);

        if ($.session.stateAbbreviation === 'IN') {
            wrap3.appendChild(communityCheckbox);
        }

        wrap3.appendChild(totalHoursInput);

        // evv wrap
        // hide evv stuff initially
        eVVChangeDate = $.session.ohioEVVChangeDate != '' ? new Date($.session.ohioEVVChangeDate.split('-').join('/')) : '';
        todayDate = new Date(UTIL.getTodaysDate().split('-').join('/'));
        if (defaultTimesChanged) {
            (wrap4.style.display = 'flex');
            (wrap5.style.display = 'flex');
            (wrap6.style.display = 'flex');
        } else {
            (wrap4.style.display = 'none');
            (wrap5.style.display = 'none');
            (wrap6.style.display = 'none');
        }
        if (eVVChangeDate != '' && $.session.stateAbbreviation == 'OH' && todayDate >= eVVChangeDate) {
            wrap4.appendChild(reasonInput);
            wrap5.appendChild(locationTypeDropdown);
        }
        else {
            wrap4.appendChild(reasonDropdown);
        }
         
        wrap6.appendChild(attestCheckbox);
        wrap7.appendChild(wrap4);
        wrap7.appendChild(wrap5);
        wrap7.appendChild(wrap6); 

        section.appendChild(wrap1);
        section.appendChild(wrap2);
        section.appendChild(wrap3);
        section.appendChild(wrap7);
        section.appendChild(noteInput);
        if (status === 'R') {
            section.appendChild(rejectionReasonInput);
        }

        $.session.singleEntryShowTransportation === 'Y' ? section.appendChild(transportationBtn) : ''; //Show Transportation system preference

        return section;
    }
    async function buildConsumerSection(consumersPresent) {
        var section = document.createElement('div');
        section.classList.add('timeCard__consumers');

        var consumerSectionError = document.createElement('div');
        consumerSectionError.classList.add('consumerSectionError');

        section.appendChild(consumerSectionError);

        roster2.clearActiveConsumers(); // clear any previous active consumers

        if (consumersPresent && consumersPresent.length > 0) {
            consumersPresent.forEach(async cp => {
                var splitName = cp.consumername.split(',');
                var consumer = roster2.buildConsumerCard({
                    FN: splitName[0],
                    LN: splitName[1],
                    id: cp.consumerid,
                });
                roster2.addConsumerToActiveConsumers(consumer);
                var card = buildConsumerCard(consumer, cp);
                section.appendChild(card);
                consumerIds.push(cp.consumerid);
                numberOfConsumersPresent = consumerIds.length;
                await evvCheckConsumerEligibility(cp.consumerid);
            });
        }

        return section;
    }
    function buildSaveDeleteCancelButtons() {
        var saveOrUpdate = isEdit ? 'Update' : 'Save';
        saveBtn = button.build({
            text: saveOrUpdate,
            style: 'secondary',
            type: 'contained',
            classNames: ['disabled'],
            attributes: [{ key: 'data-insert-type', value: saveOrUpdate }],
        });
        saveAndSumbitBtn = button.build({
            text: `${saveOrUpdate} and submit`,
            style: 'secondary',
            type: 'contained',
            classNames: ['disabled'],
            attributes: [{ key: 'data-insert-type', value: saveOrUpdate }],
        });
        deleteBtn = button.build({
            text: 'Delete',
            style: 'secondary',
            type: 'outlined',
            classNames: ['disabled'],
        });
        cancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('timeCard__actions');

        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(saveAndSumbitBtn);
        if (isEdit) btnWrap.appendChild(deleteBtn);
        btnWrap.appendChild(cancelBtn);

        return btnWrap;
    }

    async function buildCard(options, editData, consumersPresent, payperiod) {
        // options = {isEdit}
        saveUserId = null;
        personId = null;
        var opts = options;
        isEdit = opts.isEdit;
        isAdminEdit = opts.isAdminEdit;

        if (editData && editData.length > 0) {
            setEditDataValues(editData);
            payPeriod = payperiod;
            if (consumersPresent.length > 0) evvReasonCode = consumersPresent[0].evvReasonCode;
            if (evvReasonCode) defaultTimesChanged = true;
            if (isBillable === 'N') {
                roster2.toggleMiniRosterBtnVisible(false);
            } else roster2.toggleMiniRosterBtnVisible(true);
            // evvAttest = editData.attest
        } else {
            entryDate = timeEntry.getCurrentDate(false);
            roster2.updateSelectedDate(entryDate);
            payPeriod = timeEntry.getCurrentPayPeriod(false);
        }

        if ((isEdit || isAdminEdit) && isTransportationValid) {
            transportationSaved = true;
        } else {
            transportationSaved = false;
        }

        await setAllowedConsumers();

        consumerIds = [];
        eligibleConsumersObj = {};

        card = document.createElement('div');
        card.classList.add('card', 'timeCard');

        var cardHeader = document.createElement('div');
        cardHeader.classList.add('card__header');
        var heading = isEdit ? 'Edit Time Entry' : 'New Time Entry';
        cardHeader.innerHTML = `<h3>${heading}</h3>`;

        var cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        var timeEntrySection = buildTimeEntrySection();
        var consumerSection = await buildConsumerSection(consumersPresent);
        var saveDeleteCancel = buildSaveDeleteCancelButtons();

        // build card body
        cardBody.appendChild(timeEntrySection);
        cardBody.appendChild(consumerSection);
        cardBody.appendChild(saveDeleteCancel);
        // build card
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        return card;
    }

    return {
        build: buildCard,
        populate: populateCard,
        getOverlapData,
        getSaveUpdateData,
        setAllowedConsumers,
        customRosterApplyFilterEvent,
        moveConsumersToTimeCard,
        handleActionNavEvent,
        clearAllGlobalVariables,
        enableSaveButtons,
        enableSaveButton,
    };
})();
