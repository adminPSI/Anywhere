var notesOverview = (function () {
    // DOM
    var overviewTable;   
    // Values & Data
    var billers;
    var caseLoadRestriction;
    var groups;
    var tableConsumers;
    //PERMISSIONS
    var viewEntered;
    var caseloadOnly;
    // Filter Values
    let filterValues;
    var billerId;
    var billerName;
    var serviceDateStart;
    var serviceDateEnd;
    var datesEnteredStart; // '1900-01-01'
    var datesEnteredEnd; // UTIL.getTodaysDate()
    let reviewConsumerId;
    // table load vals
    var selectedRosterId = '';
    let isSSANote;
    var interval = null;
    // id array
    let noteIds = [];
    let overLapIds = [];

    let reviewAttachmentList;
    let attachcount;

    let reportRunning = false;

    let btnWrapFilter;
    // UTIL
    //---------------------------------------------
    function getServiceDateDefaultValues(startOrEnd) {
        var dateOffset = 24 * 60 * 60 * 1000 * parseInt($.session.defaultCaseNoteReviewDays);
        var todaysDate = new Date();
        var daysBackDate = new Date();
        var newDate;
        daysBackDate.setTime(daysBackDate.getTime() - dateOffset);
        if (startOrEnd === 'start') {
            newDate =
                daysBackDate.getFullYear() +
                '-' +
                ('0' + (daysBackDate.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + daysBackDate.getDate()).slice(-2);
        } else {
            newDate =
                todaysDate.getFullYear() +
                '-' +
                ('0' + (todaysDate.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + todaysDate.getDate()).slice(-2);
        }

        return newDate;
    }

    //MutationObserver to detect when loading and unloading review table to
    //disable and re-enable consumer list button
    function buildMutationObserver() {
        var observNode = document.getElementById('actioncenter');
        var config = { attributes: true };
        var callback = function (mutationList, observer) {
            for (let mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (
                        mutation.target.dataset.activeSection === 'caseNotes-new' ||
                        mutation.target.dataset.activeSection === 'caseNotes-review'
                    ) {
                        observer.disconnect();
                    } else if (mutation.attributeName === 'data-active-section') {
                        observer.disconnect();
                        miniRosterBtn = document.querySelector('.consumerListBtn');
                        if (miniRosterBtn) miniRosterBtn.classList.remove('disabled');
                    }
                    //Reset filter values when leaving casenotes
                    if (mutation.target.dataset.activeModule !== 'casenotes') {
                        resetFilterValues();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(observNode, config);
    }

    function showCNReportsPopup() {
        // popup
        var popup = document.createElement('div');
        popup.classList.add('popup', 'visible', 'popup--filter', 'timeEntryReportsPopup');
        popup.setAttribute('data-popup', 'true');
        // header
        var header = document.createElement('h5');
        header.innerHTML = `Select A Report To View`;
        // reports list
        var reports = `
      <ul>
      </ul>
    `;
    // var detailBtn = button.build({
    //   text: 'Detail Report',
    //   style: 'secondary',
    //   type: 'contained',
    //   callback: function () {
    //     reportRunning = true;
    //     const notesReportWarningPopup = POPUP.build({
    //       id: 'notesReportWarningPopup1',
    //       hideX: false,
    //       classNames: 'warning',
    //     });
    //     const warningMessage = document.createElement('p');
    //     warningMessage.innerHTML =
    //       'Your report is being generated and will be downloaded when finished, in the meantime you may continue with your work.';
    //     const acceptBtn = button.build({
    //       text: 'Ok',
    //       style: 'secondary',
    //       type: 'contained',
    //       callback: function () {
    //         POPUP.hide(notesReportWarningPopup);
    //         overlay.hide();
    //         bodyScrollLock.enableBodyScroll(popup);
    //         actioncenter.removeChild(popup);
    //         const IDs = noteIds.join(',');
    //         passFilterValuesForDetailReport(filterValues);
    //       },
    //     });
    //     const btnWrap = document.createElement('div');
    //     btnWrap.classList.add('btnWrap');
    //     btnWrap.appendChild(acceptBtn);
    //     notesReportWarningPopup.appendChild(warningMessage);
    //     notesReportWarningPopup.appendChild(btnWrap);
    //     POPUP.show(notesReportWarningPopup);
    //   },
    // });
    // var timeEntryBtn = button.build({
    //   text: 'Time Analysis Report',
    //   style: 'secondary',
    //   type: 'contained',
    //   callback: function () {
    //     reportRunning = true;
    //     const notesReportWarningPopup = POPUP.build({
    //       id: 'notesReportWarningPopup2',
    //       hideX: false,
    //       classNames: 'warning',
    //     });
    //     const warningMessage = document.createElement('p');
    //     warningMessage.innerHTML =
    //       'Your report is being generated and will be downloaded when finished, in the meantime you may continue with your work.';
    //     const acceptBtn = button.build({
    //       text: 'Ok',
    //       style: 'secondary',
    //       type: 'contained',
    //       callback: function () {
    //         POPUP.hide(notesReportWarningPopup);
    //         overlay.hide();
    //         bodyScrollLock.enableBodyScroll(popup);
    //         actioncenter.removeChild(popup);
    //         passFilterValuesForTimeEntryReport(filterValues);
    //       },
    //     });
    //     const btnWrap = document.createElement('div');
    //     btnWrap.classList.add('btnWrap');
    //     btnWrap.appendChild(acceptBtn);
    //     notesReportWarningPopup.appendChild(warningMessage);
    //     notesReportWarningPopup.appendChild(btnWrap);
    //     POPUP.show(notesReportWarningPopup);
    //   },
    // });

        if (reportRunning) {
            detailBtn.disabled = true;
            timeEntryBtn.disabled = true;
        }

        popup.appendChild(header);
        popup.appendChild(detailBtn);
        popup.appendChild(timeEntryBtn);

        // append to dom
        bodyScrollLock.disableBodyScroll(popup);
        overlay.show();
        actioncenter.appendChild(popup);
    }

    function passFilterValuesForDetailReport(filterValues) {
        caseNotesAjax.generateCNDetailReport(filterValues, checkIfCNReportIsReadyInterval);
    }

    function passFilterValuesForTimeEntryReport(filterValues) {
        caseNotesAjax.generateCNTimeAnalysisReport(filterValues, checkIfCNReportIsReadyInterval);
    }

    function checkIfCNReportIsReadyInterval(res) {
        seconds = parseInt($.session.reportSeconds);
        intSeconds = seconds * 1000;
        interval = setInterval(async () => {
            await checkCNReportExists(res);
        }, intSeconds);
    }

    async function checkCNReportExists(res) {
        await caseNotesAjax.checkIfCNReportExists(res, callCNReport);
    }

    function callCNReport(res, reportScheduleId) {
        if (res.indexOf('1') === -1) {
            //do nothing
        } else {
            caseNotesAjax.viewCaseNoteReport(reportScheduleId);
            clearInterval(interval);
            reportRunning = false;
        }
    }

    function initFilterDisplay() {
        if (!billerName) {
            billers.forEach(biller => {
                if (biller.billerId == $.session.PeopleId) {
                    billerName = biller.billerName;
                }
            });
        }

        const displayConsumerName = filterValues.consumerName;

        let dispalyServiceDateStart = UTIL.formatDateFromIso(serviceDateStart);
        let dispalyServiceDateEnd = UTIL.formatDateFromIso(serviceDateEnd);
        let displayDateEnteredStart = UTIL.formatDateFromIso(datesEnteredStart);
        let dispalyDatesEnteredEnd = UTIL.formatDateFromIso(datesEnteredEnd);

        var currentFilterDisplay = document.querySelector('.filteredByData');
        if (!currentFilterDisplay) {
            currentFilterDisplay = document.createElement('div');
            currentFilterDisplay.classList.add('filteredByData');
            currentFilterDisplay.id = 'notesFilterDiv';
            btnWrapFilter = cnFilters.filterButtonSet(billerName, displayConsumerName, 'All', 'All', 'All', dispalyServiceDateStart, dispalyServiceDateEnd, displayDateEnteredStart, dispalyDatesEnteredEnd,
                'All', 'All', 'All', 'All', 'All', 'All', 'All', 'No', 'All', filterValues);
            currentFilterDisplay.appendChild(btnWrapFilter);
            btnWrapFilter = cnFilters.ShowHideFilter(billerName, displayConsumerName, 'All', 'All', 'All', dispalyServiceDateStart, dispalyServiceDateEnd, displayDateEnteredStart, dispalyDatesEnteredEnd,
                'All', 'All', 'All', 'All', 'All', 'All', 'All', 'No', 'All');
            currentFilterDisplay.appendChild(btnWrapFilter);
        }

        return currentFilterDisplay;
    }
    function buildTopBtns() {
        // custom search stuff
        SEARCH_BTN = button.build({
            id: 'searchBtn',
            text: 'Search',
            icon: 'search',
            style: 'secondary',
            type: 'contained',
        });

        SEARCH_WRAP = document.createElement('div');
        SEARCH_WRAP.classList.add('consumerSearch');
        SEARCH_INPUT = document.createElement('input');
        SEARCH_INPUT.setAttribute('placeholder', 'search consumers');
        SEARCH_WRAP.appendChild(SEARCH_BTN);
        SEARCH_WRAP.appendChild(SEARCH_INPUT);

        var newNoteBtn = button.build({
            text: 'New Note',
            style: 'secondary',
            type: 'contained',
            icon: 'add',
            callback: function () {
                //reset filter values when creating new note
                resetFilterValues();
                $.session.CaseNotesSSANotes && isSSANote ? noteSSA.init('new') : note.init('new');
            },
        });
    // var cnReportBtn = button.build({
    //   text: 'Reports',
    //   style: 'secondary',
    //   type: 'contained',
    //   modal: true,
    //   icon: 'add',
    //   callback: function () {
    //     showCNReportsPopup();
    //   },
    // });

    var cnReportBtn = generateReports.createMainReportButton([ { text: 'Detail Report', filterValues}, { text: 'Time Analysis Report', filterValues}, { text: 'TXX Case Notes', filterValues}, { text: 'Minutes By Date', filterValues}])

        cnADVReportBtn = generateReports.createMainReportButton([{ text: 'Detailed Case Notes By Biller', filterValues }, { text: 'Minutes By Date', filterValues}]);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('cnbtnWrap');

        //PERMISSION// caseNoteUpdate === True means they have they
        //Can create new notes or update/delete notes.
        if ($.session.CaseNotesUpdate) btnWrap.appendChild(newNoteBtn);
        if ($.session.applicationName === 'Gatekeeper') btnWrap.appendChild(cnReportBtn);
        if ($.session.applicationName === 'Advisor') btnWrap.appendChild(cnADVReportBtn);
        DOM.ACTIONCENTER.appendChild(btnWrap);
        DOM.ACTIONCENTER.appendChild(SEARCH_WRAP);       
        const filteredBy = initFilterDisplay();
        DOM.ACTIONCENTER.appendChild(filteredBy);
    }

    // Table
    //---------------------------------------------
    function handleTableEvents() {
        var isRow = event.target.classList.contains('table__row');
        if (!isRow) return;
        // show row details and/or go to note review
        var caseNoteId = event.target.id;
        var consumerId = event.target.dataset.consumerId;
        var isSSANote = event.target.dataset.isssanote;

        if ($.session.CaseNotesSSANotes && isSSANote === 'Y') {
            caseNotesAjax.getCaseNoteEdit(caseNoteId, function (results) {
                noteSSA.init('review', results, groups);
            });
        } else {
            caseNotesAjax.getCaseNoteEdit(caseNoteId, function (results) {
                note.init('review', results, groups);
            });
        }
    }

    function getTableData() {
        // const cnData = await fetchData('getConsumersThatCanHaveMileageJSON', {
        //   applicationName: 'Advisor',
        //   attachments: '%',
        //   billed: '%',
        //   billerId: '7369',
        //   billingCode: '%',
        //   confidential: '%',
        //   consumerId: '%',
        //   contact: '%',
        //   corrected: '%',
        //   dateEnteredEnd: '2023-10-03',
        //   dateEnteredStart: '1900-01-01',
        //   location: '%',
        //   need: '%',
        //   noteText: '%%%',
        //   overlaps: 'N',
        //   reviewStatus: '%',
        //   service: '%',
        //   serviceEndDate: '2023-10-03',
        //   serviceStartDate: '2020-09-26',
        // });
        // var tableFilterData = {
        //   billerId,
        //   selectedRosterUserId: selectedRosterId,
        //   serviceStartDate: serviceDateStart,
        //   serviceEndDate: serviceDateEnd,
        //   dateEnteredStart: datesEnteredStart === "" ? '1900-01-01': datesEnteredStart,
        //   dateEnteredEnd: datesEnteredEnd
        // }
        caseNotesAjax.getFilteredCaseNotesList(filterValues, filteredData => {
            if (filteredData.length !== 0) {
                overLapIds = filteredData[0].overlaps;
            }

            populateTable(filteredData);
            groups = {};
            tableConsumers = [];
            filteredData.forEach(fd => {
                if (fd.numberInGroup !== '1') {
                    const groupNoteId = fd.groupnoteid.split('.')[0];
                    var consumerId = fd.consumerid.split('.')[0];
                    var name = `${fd.lastname}, ${fd.firstname}`;
                    if (!groups[groupNoteId]) {
                        groups[groupNoteId] = { [consumerId]: name };
                    }
                    groups[groupNoteId][consumerId] = name;
                }
            });
            filteredData.forEach(fd => {
                var cnId = fd.casenoteid.split('.')[0];
                var firstName = fd.firstname;
                var lastName = fd.lastname;
                var obj = { id: cnId, FirstName: firstName, LastName: lastName };
                tableConsumers.push(obj);
            });
        });
    }
    function populateTable(tableData) {
        tableData = permissions_Table(tableData);
        var groupCounts = {};

        tableData.forEach(td => {
            let groupId;
            if (td.groupnoteid === null) {
                groupId = '';
            } else {
                groupId = td.groupnoteid.split('.')[0];
            }
            if (!groupCounts[groupId]) {
                groupCounts[groupId] = 0;
            }

            groupCounts[groupId]++;
        });

        var data = tableData.map(td => {
            var hasOverlap = false;
            var originalupdateTrim = td.originalupdate.split('T')[0];
            var servicedate = UTIL.formatDateFromIso(td.servicedate.split('T')[0]);
            var starttime = UTIL.convertFromMilitary(td.starttime);
            var endtime = UTIL.convertFromMilitary(td.endtime);
            var name = `${td.lastname}, ${td.firstname}`;
            var originalUpdate = UTIL.formatDateFromIso(originalupdateTrim);
            var lastUpdateBy = td.lastupdatedby;
            // var groupCount = groupCounts[td.groupnoteid] === '' ? '0' : groupCounts[td.groupnoteid];
            var groupCount = td.numberInGroup;
            var caseNoteId = td.casenoteid.split('.')[0];
            if (overLapIds !== null) {
                if (overLapIds.includes(caseNoteId)) hasOverlap = true;
            }
            var consumerId = td.consumerid.split('.')[0];
            isSSANote = td.isSSANote;
            // just for GK - JMM 3/18
            attachcount = td.attachcount;

            noteIds.push(caseNoteId);

            var thisendIcon;
            var GKendIcon =
                !attachcount || attachcount === '  ' || attachcount === '0'
                    ? `<p style="display:none;">XXX</p>`
                    : `${icons['attachment']}`;
            var ADVendIcon = null;

            if ($.session.applicationName === 'Gatekeeper') {
                thisendIcon = GKendIcon;
            } else {
                thisendIcon = ADVendIcon;
            }

            return {
                values: [servicedate, starttime, endtime, name, originalUpdate, lastUpdateBy, groupCount],
                id: caseNoteId,
                overlap: hasOverlap,
                attributes: [
                    { key: 'data-consumer-id', value: consumerId },
                    { key: 'data-isssanote', value: isSSANote },
                ],
                endIcon: thisendIcon,
                endIconCallback: e => {
                    e.stopPropagation();
                    var isParentRow = e.target.parentNode.classList.contains('table__row');
                    if (!isParentRow) return;
                    // show row details and/or go to note review
                    var caseNoteId = e.target.parentNode.id;
                    var testNoteId = 1298784;
                    caseNotesAjax.getCaseNoteAttachmentsList(caseNoteId, function (results) {
                        attachmentPopup();
                        if (results.length !== 0) populateExistingAttachments(results);

                        //cnAttachment.init([], results, '', caseNoteId);
                    });
                },
                onClick: handleTableEvents,
            };
        });

        table.populate(overviewTable, data);
    }

    function buildTable() {
        var thiscolumnheadings = [];
        var GKcolumnheadings = [
            'Service Date',
            'Start Time',
            'End Time',
            'Name',
            'Date Created',
            'User Updated',
            'Group',
            'Attach',
        ];
        var ADVcolumnheadings = ['Service Date', 'Start Time', 'End Time', 'Name', 'Date Created', 'User Updated', 'Group'];
        $.session.applicationName === 'Gatekeeper'
            ? (thiscolumnheadings = GKcolumnheadings)
            : (thiscolumnheadings = ADVcolumnheadings);

        overviewTable = table.build({
            tableId: 'caseNotesReviewTable',
            columnHeadings: thiscolumnheadings,
            endIcon: !attachcount || attachcount === '  ' || attachcount === '0' ? false : true,
        });

        // Set the data type for each header, for sorting purposes
        const headers = overviewTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'date'); // Service Date
        headers[1].setAttribute('data-type', 'date'); // Service Start
        headers[2].setAttribute('data-type', 'date'); // Service End
        headers[3].setAttribute('data-type', 'string'); // Name
        headers[4].setAttribute('data-type', 'date'); // Date Created
        headers[5].setAttribute('data-type', 'string'); // User Updated
        headers[6].setAttribute('data-type', 'number'); // Group
        // headers[7].setAttribute("data-type", "string"); // Attach Icon

        // overviewTable.addEventListener('click', handleTableEvents);
        DOM.ACTIONCENTER.appendChild(overviewTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(overviewTable);
    }

    function tableConsumerSearch(searchValue) {
        searchValue = searchValue.toLowerCase();
        // gather all names shown
        //reset the array containing list of consumers that are being displayed
        displayedConsumers = [searchValue];
        tableConsumers.forEach(consumer => {
            var firstName = consumer.FirstName.toLowerCase();
            var lastName = consumer.LastName.toLowerCase();
            var fullName = `${firstName} ${lastName}`;
            var fullNameReversed = `${lastName} ${firstName}`;
            var matchesName = fullName.indexOf(searchValue);
            var matchesNameReverse = fullNameReversed.indexOf(searchValue);
            var caseNote = document.getElementById(consumer.id);

            if (matchesName !== -1 || matchesNameReverse !== -1) {
                caseNote.classList.remove('hidden');
                displayedConsumers.push(consumer.id);
            } else {
                caseNote.classList.add('hidden');
                var index = displayedConsumers.indexOf(consumer.id);
                if (index > -1) displayedConsumers.splice(index, 1);
            }
        });
    }

    function setFilterValFromPopup(newFilterValues) {
        filterValues = newFilterValues;
        getTableData();
    }

    function resetFilterValues() {
        filterValues = null;        

        billerId = null;
        serviceDateStart = null;
        serviceDateEnd = null;
        datesEnteredStart = null;
        datesEnteredEnd = null;
    }
    //permissions_table are permissions that effect what case notes you can see in the table
    function permissions_Table(tableData) {
        var newTable = [];
        //VIEW ENTERED - can only view case notes you have entered. Can't see any other notes.
        //CASELOAD ONLY - Can only view consumers that are on your caseload (or any note that you entered. If you were the one to enter a note, this trumps any permission)
        if (viewEntered && caseloadOnly) {
            for (let tDi = 0; tDi < tableData.length; tDi++) {
                for (let cIdx = 0; cIdx < caseLoadRestriction.length; cIdx++) {
                    if (
                        caseLoadRestriction[cIdx].id.toUpperCase() === tableData[tDi].consumerid.split('.')[0].toUpperCase() ||
                        tableData[tDi].enteredby.toUpperCase() === $.session.UserId.toUpperCase()
                    ) {
                        newTable.push(tableData[tDi]);
                        break;
                    }
                }
            }
            return newTable;
        } else if (viewEntered) {
            for (let tDi = 0; tDi < tableData.length; tDi++) {
                if (tableData[tDi].enteredby.toUpperCase() === $.session.UserId.toUpperCase()) {
                    newTable.push(tableData[tDi]);
                }
            }
            return newTable;
        } else if (caseloadOnly) {
            for (let tDi = 0; tDi < tableData.length; tDi++) {
                for (let cIdx = 0; cIdx < caseLoadRestriction.length; cIdx++) {
                    if (caseLoadRestriction[cIdx].id === tableData[tDi].consumerid.split('.')[0]) {
                        newTable.push(tableData[tDi]);
                        break;
                    }
                }
            }
            return newTable;
        } else return tableData;
    }

    function mainEventListeners() {
        SEARCH_BTN.addEventListener('click', event => {
            SEARCH_WRAP.classList.toggle('searchOpen');
            SEARCH_INPUT.value = '';
            SEARCH_INPUT.focus();
        });
        SEARCH_INPUT.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                tableConsumerSearch(event.target.value);
            }
        });
    }

    function disableMiniRosterBtn() {
        var btn = document.querySelector('.consumerListBtn');
        if (btn) btn.classList.add('disabled');
    }

    function loadPage() {
        if (!filterValues.billerId) filterValues.billerId = $.session.PeopleId;
        DOM.clearActionCenter();
        buildTopBtns();
        buildTable();
        getTableData();
        buildMutationObserver();
        disableMiniRosterBtn();
        mainEventListeners();
        document.getElementById('searchBtn').click();
    }

    function initialData(callback) {
        const promArray = [];

        if (caseloadOnly) {
            const caseloadRestrictionPromise = new Promise(function (resolve, reject) {
                caseNotesAjax.getCaseLoadRestriction(res => {
                    caseLoadRestriction = res;
                    resolve('success');
                });
            });
            promArray.push(caseloadRestrictionPromise);
        }

        //FILTER DROPDOWN DATA
        //==========================
        //biller Dropdown
        const getBillersListPromise = new Promise(function (resolve, reject) {
            caseNotesAjax.getBillersListForDropDown(res => {
                billers = res;
                resolve('success');
            });
        });
        promArray.push(getBillersListPromise);

        Promise.all(promArray).then(function () {
            callback();
        });
    }
    /**
     * Going from Dashboard to CN Review Table, and filter based on My Case Load widget settings
     * @param {intiger} daysBack - Days back setting for the My Case Load Widget
     * @param {string} consumerId - ID for the consumer that was clicked on
     * @param {string} consumerName - Name of the Consumer. Needed for Filtered by display
     * @param {*} viewEnteredWidgetSetting
     */
    function dashHandeler(daysBack, consumerId, viewEnteredWidgetSetting, consumerName) {
        const daysBackDate = new Date();
        daysBackDate.setDate(daysBackDate.getDate() - daysBack);
        reviewConsumerId = consumerId;
        viewEntered = $.session.CaseNotesViewEntered ? viewEnteredWidgetSetting : false;
        caseloadOnly = $.session.CaseNotesCaseloadRestriction;
        setActiveModuleSectionAttribute('caseNotes-overview');
        //If statements are to prevent re-setting filter when moving from new note to review note back to the overview
        if (!serviceDateStart) serviceDateStart = UTIL.formatDateFromDateObj(daysBackDate);
        if (!serviceDateEnd) serviceDateEnd = getServiceDateDefaultValues('end');
        datesEnteredStart = '1900-01-01';
        if (!datesEnteredEnd) datesEnteredEnd = UTIL.getTodaysDate();
        filterValues = {
            billerId: $.session.PeopleId,
            billerName: '',
            consumer: reviewConsumerId,
            consumerName: consumerName,
            billingCode: '%',
            reviewStatus: '%',
            serviceDateStart: serviceDateStart,
            serviceDateEnd: serviceDateEnd,
            enteredDateStart: datesEnteredStart,
            enteredDateEnd: datesEnteredEnd,
            location: '%',
            service: '%',
            need: '%',
            contact: '%',
            confidential: '%',
            corrected: '%',
            billed: '%',
            attachments: '%',
            noteText: '%',
            noteTextValue: '',
        };

        initialData(loadPage);
    }

    function setInitFilterValues() {
        //If statements are to prevent re-setting filter when moving from new note to review note back to the overview
        if (!serviceDateStart) serviceDateStart = getServiceDateDefaultValues('start');
        if (!serviceDateEnd) serviceDateEnd = getServiceDateDefaultValues('end');
        if (!datesEnteredStart) datesEnteredStart = '1900-01-01';
        if (!datesEnteredEnd) datesEnteredEnd = UTIL.getTodaysDate();
        if (!filterValues) {
            filterValues = {
                billerId: $.session.PeopleId,
                consumer: '%',
                consumerName: 'All',
                billingCode: '%',
                reviewStatus: '%',
                serviceDateStart: serviceDateStart,
                serviceDateEnd: serviceDateEnd,
                enteredDateStart: datesEnteredStart,
                enteredDateEnd: datesEnteredEnd,
                location: '%',
                service: '%',
                need: '%',
                contact: '%',
                confidential: '%',
                corrected: '%',
                billed: '%',
                attachments: '%',
                overlaps: 'N',
                noteText: '%',
                noteTextValue: '',
            };
        }
    }

    function attachmentPopup() {
        const popup = POPUP.build({
            header: 'Attachments',
            id: 'cnAttachmentPopup',
        });

        addAttachmentBtn = button.build({
            text: 'Add Attachment',
            style: 'secondary',
            type: 'text',
            icon: 'add',
            // callback: addNewAttachment
        });
        addAttachmentBtn.type = 'button';
        removeAttachmentBtn = button.build({
            style: 'secondary',
            type: 'text',
            icon: 'delete',
        });
        removeAttachmentBtn.type = 'button';
        // addRemoveAttachmentEventListener(removeAttachmentBtn);
        const saveBtn = button.build({
            id: 'attachmentSave',
            text: 'Done',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                // saveAction();
                POPUP.hide(popup);
            },
        });
        // const cancelBtn = button.build({
        //   id: "attachmentCancel",
        //   text: "cancel",
        //   style: "secondary",
        //   type: "outlined",
        //   callback: () => {
        //     POPUP.hide(popup);
        //   }
        // });

        reviewAttachmentList = document.createElement('div');
        reviewAttachmentList.classList.add('reviewAttachmentList');
        newAttachmentList = document.createElement('div');
        newAttachmentList.classList.add('newAttachmentList');
        const newAttachmentsHeader = document.createElement('h5');
        newAttachmentsHeader.innerText = 'Attachments to be added:';
        // if (isBatched === '' || isBatched === null) {
        //     newAttachmentList.appendChild(newAttachmentsHeader);
        // }

        attachmentInput = document.createElement('input');
        attachmentInput.type = 'file';
        attachmentInput.classList.add('input-field__input', 'attachmentInput');
        attachmentInput.onchange = event => fileValidation(event.target);

        attachmentContainer = document.createElement('div');
        attachmentContainer.classList.add('attachmentContainer');
        attachmentList = document.createElement('form');
        attachmentList.setAttribute('id', 'attachmentForm');
        // if (isBatched === '' || isBatched === null) {
        //     attachmentList.appendChild(attachmentContainer);
        //     attachmentContainer.appendChild(removeAttachmentBtn);
        //     attachmentContainer.appendChild(attachmentInput);
        // }
        // attachmentContainer.appendChild(addAttachmentBtn);

        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        popup.appendChild(reviewAttachmentList);
        popup.appendChild(newAttachmentList);
        popup.appendChild(attachmentList);
        // if (isBatched === '' || isBatched === null) {
        //     popup.appendChild(addAttachmentBtn);
        // }

        btnWrap.appendChild(saveBtn);
        //  btnWrap.appendChild(cancelBtn);
        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }

    function populateExistingAttachments(reviewAttachments) {
        const header = document.createElement('h5');
        header.innerText = 'Select an attachment to view:';
        reviewAttachmentList.appendChild(header);
        //console.table(reviewAttachments)

        reviewAttachments.forEach(attachment => {
            const fileContainer = document.createElement('div');
            fileContainer.classList.add('reviewAttachmentContainer');
            fileContainer.setAttribute('id', attachment.attachmentId);
            fileContainer.setAttribute('delete', false);

            const removeAttachmentBtn = button.build({
                style: 'secondary',
                type: 'text',
                icon: 'delete',
                // callback: event => addRemoveAttachmentToDeleteList(event.target.parentElement)
            });

            const file = document.createElement('p');
            file.innerText = attachment.description;
            // if (isBatched === '' || isBatched === null) {
            //     fileContainer.appendChild(removeAttachmentBtn);
            // }
            fileContainer.appendChild(file);
            file.addEventListener('click', event => {
                const attachmentId = event.target.parentElement.id;
                caseNotesAjax.viewCaseNoteAttachment(attachmentId);
            });
            reviewAttachmentList.appendChild(fileContainer);
        });
    }

    function init() {
        reviewConsumerId = null;
        viewEntered = $.session.CaseNotesViewEntered;
        caseloadOnly = $.session.CaseNotesCaseloadRestriction;
        setActiveModuleSectionAttribute('caseNotes-overview');
        setInitFilterValues();
        initialData(loadPage);
    }

    return {
        init,
        dashHandeler,
        setFilterValFromPopup,
        permissions_Table,        
    };
})();
