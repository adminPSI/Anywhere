var rosterAbsent = (function() {
    //-DATA------------------
    var absentReasons;
    var notificationTypes;
    //-DOM------------------
    var MASS_ABSENT_POPUP;
    // *absent form inputs
    var CONSUMERS_SELECTED_INPUT;
    var DATE_OF_ABSENSE_INPUT;
    var DATE_REPORTED_INPUT;
    var LOCATION_INPUT;
    var NOTIFICATION_DROPDOWN;
    var REPORTED_BY_INPUT;
    var REASON_DROPDOWN;
    var TIME_REPORTED_INPUT;
    // *absent form btns
    var SAVE_ABSENT_BTN;
    var DELETE_ABSENT_BTN;
    var CANCEL_ABSENT_BTN;
    // *action nav btns
    var doneBtn;
    var cancelBtn;
    //-VALUES------------------
    var absentLocation;
    // save/update
    var absenceDate;
    var consumerIdString;
    var dateReported;
    var locationId;
    var notificationId;
    var reportedBy;
    var resonId;
    var timeReported;
    // delete data
    var absentRecordId;
    var doPreSaveCheck = true;

    // Absent Save
    //---------------------------------------------
    function showPreSaveWarningPopup() {
        var preSaveWarningPopup = POPUP.build({
            header: 'The following consumers have an already existing record in either Outcomes or Day Services. Do you wish to proceed?'
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var yesBtn = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
      callback: function(event) {
                doPreSaveCheck = false;
                SAVE_ABSENT_BTN.click();
                POPUP.hide(preSaveWarningPopup);
            }
        });
        var noBtn = button.build({
            text: 'No',
            style: 'secondary',
            type: 'contained',
      callback: function() {
                POPUP.hide(preSaveWarningPopup);
            }
        });

        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        preSaveWarningPopup.appendChild(btnWrap);

        POPUP.show(preSaveWarningPopup);
    }
    function saveSingleAbsent() {
        var singleSaveData = {
            token: $.session.Token,
            absentReasonId: resonId === '%' ? '' : resonId,
            absentNotificationId: notificationId === '%' ? '' : notificationId,
            consumerIdString: consumerIdString,
            absenceDate: absenceDate,
            locationId: locationId,
            reportedBy: UTIL.removeUnsavableNoteText(reportedBy),
            timeReported: timeReported,
            dateReported: dateReported
        };
        var preSaveData = {
            token: $.session.Token,
            consumerIdString: consumerIdString,
            absentDate: absenceDate,
            locationId: locationId,
        };

        function updateAbsents() {
            roster2.refreshRosterList();
            var backBtn = document.querySelector('.sectionBackBtn');
            backBtn.click();
        }
        function checkAbsentPreSave(results) {
            if (results && results.length) {
                // show warning message
                showPreSaveWarningPopup()
                return;
            }

            absentAjax.oneLocationAbsentSave(singleSaveData, updateAbsents);
        }

        if (doPreSaveCheck) {
            absentAjax.absentPreSaveCheck(preSaveData, checkAbsentPreSave);
        } else {
            absentAjax.oneLocationAbsentSave(singleSaveData, updateAbsents);
            doPreSaveCheck = true;
        }
    }
    function saveMassAbsent() {
        var singleSaveData = {
            token: $.session.Token,
            absentReasonId: resonId === '%' ? '' : resonId,
            absentNotificationId: notificationId === '%' ? '' : notificationId,
            consumerIdString: consumerIdString,
            absenceDate: absenceDate,
            locationId: locationId,
            reportedBy: UTIL.removeUnsavableNoteText(reportedBy),
            timeReported: timeReported,
            dateReported: dateReported
        };

    absentAjax.oneLocationAbsentSave(singleSaveData, function() {
            roster2.refreshRosterList();
        });
    }

    // UTIL
    //---------------------------------------------
    async function getAbsentConsumers(locationId, absenceDate, callback) {
        try {
            let getConsumersByLocationAbsentResults = (await absentAjax.getConsumersByLocationAbsent(locationId, absenceDate)).getConsumersByLocationAbsentResult;
            getConsumersByLocationAbsentResults = JSON.parse(getConsumersByLocationAbsentResults);
            const absentConsumerIds = createAbsentConsumersObj(getConsumersByLocationAbsentResults);
            return absentConsumerIds;
        } catch (error) {
            console.log(error);
        }

        // absentAjax.getConsumersByLocationAbsent(locationId, absenceDate, function(results) {
        //   var absentConsumerIds = createAbsentConsumersObj(results);
        //   if (callback) callback(absentConsumerIds);
        // });
    }
    function getAbsentFormDropdownData(callback) {
        if (!notificationTypes || !absentReasons) {
      absentAjax.selectAbsentNotificationTypes(function(results) {
                notificationTypes = results;
        absentAjax.selectAbsentReasons(function(results) {
                    absentReasons = results;
                    if (callback) callback();
                });
            });
        } else {
            if (callback) callback();
        }
    }
    function createAbsentConsumersObj(results) {
        if (!results || results.length === 0) return {};

        var newObj = {};

        results.forEach(r => {
            if (!newObj[r.consumer_id]) newObj[r.consumer_id] = r.consumer_id;
        });

        return newObj;
    }
    function setSaveData(absentData) {
        if (!absentData) {
            var selectedLocationObj = roster2.getSelectedLocationObj();

            absentLocation = selectedLocationObj.locationName;
            absenceDate = UTIL.getTodaysDate();
            dateReported = UTIL.getTodaysDate();
            locationId = selectedLocationObj.locationId;
            notificationId = '%';
            reportedBy = `${$.session.LName}, ${$.session.Name}`;
            resonId = '%';
            timeReported = UTIL.getCurrentTime();

            return;
        }

        var rosterLocations = roster2.getRosterLocations();

        var data = absentData[0];
        var tempLocation = rosterLocations.filter(rl => rl.ID === data.locationId);
        var tempLocationName = tempLocation[0].Name;
        var tempLocationId = data.locationId;
        var tempDateOfAbsense = UTIL.formatDateToIso(data.dateOfAbsence.split(' ')[0]);
        var tempReportedBy = data.reportedby;
        var tempDatereported = UTIL.formatDateToIso(data.dateReported.split(' ')[0]);
        var tempTimereported = data.timereported;
        var tempReasonId = data.reasonId;
        var tempNotifiId = data.notificationId;

        absentRecordId = data.recordid;

        absentLocation = tempLocationName;
        absenceDate = tempDateOfAbsense;
        consumerIdString = data.consumerId;
        dateReported = tempDatereported;
        locationId = tempLocationId;
        notificationId = tempNotifiId;
        reportedBy = tempReportedBy;
        resonId = tempReasonId;
        timeReported = tempTimereported;
    }

    // Absent Form
    //---------------------------------------------
    function populateAbsentFormDropdowns(defaultValues) {
        var notifValue = defaultValues.notif;
        var reasonValue = defaultValues.reason;

        var notificationTypeData = notificationTypes.map(r => {
            return {
                value: r.notifid,
                text: r.notifdesc
            }
        });
        var reasonsData = absentReasons.map(r => {
            return {
                value: r.reasonid,
                text: r.reasondesc
            }
        });

    var defaultVal = {value: '%', text: ''};
        notificationTypeData.unshift(defaultVal);
        reasonsData.unshift(defaultVal);

        dropdown.populate(NOTIFICATION_DROPDOWN, notificationTypeData, notifValue);
        dropdown.populate(REASON_DROPDOWN, reasonsData, reasonValue);
    }
    function setupFormEvents(single) {
        REASON_DROPDOWN.addEventListener('change', event => {
            var selectedOpt = event.target.options[event.target.selectedIndex];
            resonId = selectedOpt.value;
        });
        NOTIFICATION_DROPDOWN.addEventListener('change', event => {
            var selectedOpt = event.target.options[event.target.selectedIndex];
            notificationId = selectedOpt.value;
        });
        DATE_OF_ABSENSE_INPUT.addEventListener('change', event => {
            absenceDate = event.target.value;
        });
        DATE_REPORTED_INPUT.addEventListener('change', event => {
            dateReported = event.target.value;
        });
        TIME_REPORTED_INPUT.addEventListener('change', event => {
            timeReported = event.target.value;
        });
        SAVE_ABSENT_BTN.addEventListener('click', () => {
            document.getElementById("absentSaveBtn").disabled = true;
            if (!single) {
                // untoggle MASS_ABSENT_BTN
                MASS_ABSENT_BTN.setAttribute('data-toggled', false);
                // clear selected consumers
                roster2.clearSelectedConsumers();
                // hide popup
                POPUP.hide(MASS_ABSENT_POPUP);
                // reset active section
                setActiveModuleSectionAttribute('roster-info');
                // save it
                saveMassAbsent();
            } else {
                saveSingleAbsent();
            }
        });
        DELETE_ABSENT_BTN.addEventListener('click', () => {
      absentAjax.deleteAbsent(absentRecordId, function(results) {
                roster2.refreshRosterList();
            });
            var backBtn = document.querySelector('.sectionBackBtn');
            backBtn.click();
        });
        CANCEL_ABSENT_BTN.addEventListener('click', () => {
            // untoggle MASS_ABSENT_BTN
            MASS_ABSENT_BTN.setAttribute('data-toggled', false);
            // clear selected consumers
            roster2.clearSelectedConsumers();
            // hide absent actionnav
            ACTION_NAV.hide();
            // hide popup
            POPUP.hide(MASS_ABSENT_POPUP);
        });
    }
    function buildAbsentForm(single, consumerId, dateOfAbsent, absentData) {
        if (absentData && absentData.length) {
            setSaveData(absentData);
        } else if (single) {
            setSaveData();
            consumerIdString = consumerId;
            absenceDate = dateOfAbsent;
        } else {
            //setSaveData();
        }

        var absentForm = document.createElement('div');
        absentForm.classList.add('absentForm');
        // inputs & dropdowns
        CONSUMERS_SELECTED_INPUT = input.build({
            label: 'Consumer(s)',
            type: 'text',
            style: 'secondary',
            value: 'All Selected',
            readonly: true
        });
        LOCATION_INPUT = input.build({
            label: 'Location',
            type: 'text',
            style: 'secondary',
            value: absentLocation,
            readonly: true
        });
        DATE_OF_ABSENSE_INPUT = input.build({
            label: 'Date Of Absence',
            type: 'date',
            style: 'secondary',
            value: absenceDate ? absenceDate : UTIL.getTodaysDate()
        });
        REPORTED_BY_INPUT = input.build({
            label: 'Reported By',
            type: 'text',
            style: 'secondary',
            value: reportedBy ? reportedBy : `${$.session.LName}, ${$.session.Name}`,
            readonly: true
        });
        DATE_REPORTED_INPUT = input.build({
            label: 'Date Reported',
            type: 'date',
            style: 'secondary',
            value: dateReported ? dateReported : UTIL.getTodaysDate()
        });
        TIME_REPORTED_INPUT = input.build({
            label: 'Time Reported',
            type: 'time',
            style: 'secondary',
            value: timeReported ? timeReported : UTIL.getCurrentTime()
        });
        REASON_DROPDOWN = dropdown.build({
            label: 'Reason',
            style: 'secondary'
        });
        NOTIFICATION_DROPDOWN = dropdown.build({
            label: 'Notification Type',
            style: 'secondary'
        });

        // save, cancel & delete buttons
        var ABSENT_BTN_WRAP = document.createElement('div');
        ABSENT_BTN_WRAP.classList.add('btnWrap');
        SAVE_ABSENT_BTN = button.build({
            text: 'Save',
            style: 'secondary',
            id: 'absentSaveBtn',
            type: 'contained'
        });
        CANCEL_ABSENT_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'contained'
        });
        DELETE_ABSENT_BTN = button.build({
            text: 'Delete',
            style: 'secondary',
            type: 'outlined'
        });

        if (absentData && absentData.length) {
            absentForm.classList.add('disabled');
            if ($.session.RosterDeleteAbsent) ABSENT_BTN_WRAP.appendChild(DELETE_ABSENT_BTN);
        } else {
            ABSENT_BTN_WRAP.appendChild(SAVE_ABSENT_BTN);
        }

        if (!single) ABSENT_BTN_WRAP.appendChild(CANCEL_ABSENT_BTN);
        if (!single) absentForm.appendChild(CONSUMERS_SELECTED_INPUT);
        absentForm.appendChild(LOCATION_INPUT);
        absentForm.appendChild(DATE_OF_ABSENSE_INPUT);
        absentForm.appendChild(REPORTED_BY_INPUT);
        absentForm.appendChild(DATE_REPORTED_INPUT);
        absentForm.appendChild(TIME_REPORTED_INPUT);
        absentForm.appendChild(REASON_DROPDOWN);
        absentForm.appendChild(NOTIFICATION_DROPDOWN);
        absentForm.appendChild(ABSENT_BTN_WRAP);

        // populate dropdowns
        populateAbsentFormDropdowns({
      reason:  resonId ? resonId : '%', 
            notif: notificationId ? notificationId : '%'
        });
        // set events
        setupFormEvents(single);

        return absentForm;
    }

    // Single Absent
    //---------------------------------------------
    function init() {
        getAbsentFormDropdownData();
    }

    // Mass Absent
    //---------------------------------------------
    function showAbsentPopup() {
        // create popup
        MASS_ABSENT_POPUP = POPUP.build({
            classNames: 'rosterAbsentPopup'
        });
        // build form
        var absentForm = buildAbsentForm(false);
        // append form to popup
        MASS_ABSENT_POPUP.appendChild(absentForm);
        POPUP.show(MASS_ABSENT_POPUP);
    }
    function setConsumerIdString() {
        var selectedConsumers = roster2.getSelectedConsumers();
        consumerIdString = selectedConsumers.map(sc => sc.id).join(',');
    }
    function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

    switch(targetAction) {
            case 'absentDone': {
                setConsumerIdString();
                showAbsentPopup();
                document.getElementById('massAbsentSelectAllBtn').style.display = 'none';
                document.getElementById('massAbsentDeselectAllBtn').style.display = 'none';
                break;
            }
            case 'absentCancel': {
                MASS_ABSENT_BTN.setAttribute('data-toggled', false);
                setActiveModuleSectionAttribute('roster-info');
                roster2.clearSelectedConsumers();
                ACTION_NAV.hide();
                document.getElementById('massAbsentSelectAllBtn').style.display = 'none';
                document.getElementById('massAbsentDeselectAllBtn').style.display = 'none'; 
                break;
            }
        }
    }
    function toggleActionNavBtns() {
        var selectedConsumers = roster2.getSelectedConsumers();
        if (selectedConsumers.length > 0) {
            doneBtn.classList.remove('disabled');
        } else {
            doneBtn.classList.add('disabled');
        }
    }
    function buildAbsentActionNav() {
        doneBtn = button.build({
            text: 'Done',
            id: 'absentDone',
            icon: 'checkmark',
            style: 'secondary',
            type: 'contained',
            classNames: 'disabled',
      attributes: [{key: 'data-action-nav', value: 'absentDone'}]
        });
        cancelBtn = button.build({
            text: 'Cancel',
            icon: 'close',
            style: 'secondary',
            type: 'outlined',
      attributes: [{key: 'data-action-nav', value: 'absentCancel'}]
        });

        ACTION_NAV.populate([doneBtn, cancelBtn]);
    }
    function initMassAbsent() {
        MASS_ABSENT_BTN = document.querySelector('.massAbsentBtn');
        getAbsentFormDropdownData(() => {
            buildAbsentActionNav();
            setSaveData();
        });
    }


    return {
        buildAbsentForm,
        createAbsentConsumersObj,
        getAbsentConsumers,
        handleActionNavEvent,
        initMassAbsent,
        init,
        toggleActionNavBtns
    }
})();