var timeApproval = (function () {
    //-DATA------------------
    var locationData;
    var payPeriodData;
    var payPeriod;
    var endDate;
    var startDate;
    var rejectionReasonText;
    // dropdowns
    var employees;
    var locations;
    var supervisors;
    // filter data
    var payPeriodText;
    var supervisorId;
    var supervisorName;
    var locationId;
    var locationName;
    var employeeId;
    var employeeName;
    var status;
    var statusText;

    let btnWrap;
    let supervisorBtnWrap;
    let locationBtnWrap;
    let statusBtnWrap;
    let employeeBtnWrap;
    let workCodeBtnWrap;
    let startDateBtnWrap;
    let endDateBtnWrap;

    var tmpSupervisorId;
    var tmpSupervisorName;
    var tmpLocationId;
    var tmpLocationName;
    var tmpEmployeeId;
    var tmpEmployeeName;
    var tmpStatus;
    var tmpStatusText;
    //-DOM------------------
    var reviewTable;
    var mulitSelectBtn;
    var selectAllBtn;
    var filterBtn;
    var mapBtn;
    var filterPopup;
    var payPeriodsDropdown;
    var supervisorDropdown;
    var employeeDropdown;
    var locationDropdown;
    var statusDropdown;
    var applyBtn;
    var startDateInput;
    var endDateInput
    var tmpStartDate;
    var tmpEndDate;
    // action nav items
    var cancelBtn;
    var approveNavBtn;
    var rejectNavBtn;
    var submitNavBtn;
    //-WorkCode---------------
    var workCodeData;
    var workCodeDropdown;
    var workCodeId;
    var workCodeName;
    var tmpWorkCodeId;
    var tmpWorkCodeName;
    //-OTHER------------------
    var statuses = [
        { key: 'A', value: 'Awaiting Approval' },
        { key: 'P', value: 'Pending' },
        { key: 'I', value: 'Imported' },
        { key: 'S', value: 'Submitted' },
        { key: 'R', value: 'Rejected' },
    ];
    var statusLookup = {
        A: 'Awaiting Approval',
        P: 'Pending',
        R: 'Rejected',
        I: 'Imported',
        S: 'Submitted',
        D: 'Duplicate',
    };
    var workCodeLookup = {
        A: 'Awake Service',
        L: '1:1 Lucas County',
        N: 'Non Billable',
        O: 'On Behalf Of - Admin',
        S: 'Sleep',
        T: 'Transportation',
        V: 'Vacation',
    };
    var enableMultiEdit = false;
    var enableSelectAll = false;
    var selectedRows = []; // array of row ids
    var sortedSelectedRows;
    var rejectOrApprove;
    let totalHours = 0;
    //-TABLE DATA------------------
    let showMap = false;
    // const LSKEY_showMap = "se_showMap"
    let IsFilterDisable = true;

    function clearAllGlobalVariables() {
        selectedRows = [];

        locationData = undefined;
        payPeriodData = undefined;
        payPeriod = undefined;
        endDate = undefined;
        startDate = undefined;

        employees = undefined;
        locations = undefined;
        supervisors = undefined;

        supervisorId = undefined;
        locationId = undefined;
        employeeId = undefined;
        status = undefined;
        totalHours = undefined;

        workCodeId = undefined;
        workCodeName = undefined;
        tmpWorkCodeId = undefined;
        tmpWorkCodeName = undefined;

        enableSelectAll = false;
        enableMultiEdit = false;
    }
    function sortSelectedRowsForUpdate() {
        sortedSelectedRows = {};

        selectedRows.forEach(sr => {
            if (!sortedSelectedRows[sr.status]) {
                sortedSelectedRows[sr.status] = [];
            }

            sortedSelectedRows[sr.status].push(sr.id);
        });

        console.table(sortedSelectedRows);
    }
    // Approve/Reject/Submit
    //------------------------------------
    function updateSelectAllStatus(type) {
        let updatePromiseArray = [];
        const selectedRowKeys = Object.keys(sortedSelectedRows);
        let statusUpdateData = {};
        switch (type) {
            case 'approve':
                selectedRowKeys.forEach(key => {
                    if (key === 'A') {
                        statusUpdateData = {
                            token: $.session.Token,
                            singleEntryIdString:
                                sortedSelectedRows[key].length > 1
                                    ? sortedSelectedRows[key].join(',')
                                    : sortedSelectedRows[key][0],
                            newStatus: 'S',
                            userID: $.session.UserId,
                            rejectionReason: '',
                        };
                    }
                });
                break;
            case 'reject':
                selectedRowKeys.forEach(key => {
                    if (key === 'A') {
                        statusUpdateData = {
                            token: $.session.Token,
                            singleEntryIdString:
                                sortedSelectedRows[key].length > 1
                                    ? sortedSelectedRows[key].join(',')
                                    : sortedSelectedRows[key][0],
                            newStatus: 'R',
                            userID: $.session.UserId,
                            rejectionReason: rejectionReasonText,
                        };
                    }
                });
                break;
            case 'submit':
                selectedRowKeys.forEach(key => {
                    if (key === 'P') {
                        statusUpdateData = {
                            token: $.session.Token,
                            singleEntryIdString:
                                sortedSelectedRows[key].length > 1
                                    ? sortedSelectedRows[key].join(',')
                                    : sortedSelectedRows[key][0],
                            newStatus: 'A',
                            userID: $.session.UserId,
                            rejectionReason: '',
                        };
                    }
                });
                break;
            default:
                break;
        }

        var updatePromise = new Promise((fulfill, reject) => {
            singleEntryAjax.adminUpdateSingleEntryStatus(statusUpdateData, function (results) {
                fulfill();
            });
        });

        updatePromise.then(() => {
            successfulSave.show();
            selectedRows = [];
            setTimeout(function () {
                successfulSave.hide();
                getReviewTableData(populateTable);
            }, 1000);
        });
    }

    function updateEntryStatus() {
        var updatePromiseArray = [];

        var selectedRowKeys = Object.keys(sortedSelectedRows);
        selectedRowKeys.forEach(key => {
            var statusUpdateData = {
                token: $.session.Token,
                singleEntryIdString:
                    sortedSelectedRows[key].length > 1
                        ? sortedSelectedRows[key].join(',')
                        : sortedSelectedRows[key][0],
                newStatus: '',
                userID: $.session.UserId,
                rejectionReason: '',
            };

            statusUpdateData.newStatus = key === 'P' ? 'A' : '';
            if (statusUpdateData.newStatus === '' && rejectOrApprove) {
                statusUpdateData.newStatus = rejectOrApprove === 'approve' ? 'S' : 'R';
                statusUpdateData.rejectionReason = rejectOrApprove === 'approve' ? '' : rejectionReasonText;
            }

            console.table(statusUpdateData);

            var updatePromise = new Promise((fulfill, reject) => {
                singleEntryAjax.adminUpdateSingleEntryStatus(statusUpdateData, function (results) {
                    fulfill();
                });
            });

            updatePromiseArray.push(updatePromise);
        });

        Promise.all(updatePromiseArray).then(() => {
            successfulSave.show();
            selectedRows = [];
            setTimeout(function () {
                successfulSave.hide();
                getReviewTableData(populateTable);
            }, 1000);
        });
    }
    // Status Change Popup
    //------------------------------------
    function setApproveOrReject(approveOrReject) {
        rejectOrApprove = approveOrReject;
    }
    function buildStatusChangePopupMessage() {
        var pCount = sortedSelectedRows['P'] ? sortedSelectedRows['P'].length : 0;
        var aCount = sortedSelectedRows['A'] ? sortedSelectedRows['A'].length : 0;

        var messageBody = document.createElement('div');
        messageBody.classList.add('timeApprovalWarningPopup__messages');

        if (pCount > 0) {
            var pMessageContainer = document.createElement('div');
            pMessageContainer.classList.add('timeApprovalWarningPopup__messageContainer');

            var pMessageWrap = document.createElement('div');
            pMessageWrap.classList.add('timeApprovalWarningPopup__messageWrap');
            var pMessage = document.createElement('p');
            pMessage.innerHTML = `You have selected ${pCount} ${pCount === 1 ? `entry` : 'entries'
                } with a status of Pending, to be submitted.`;
            pMessageWrap.appendChild(pMessage);

            pMessageContainer.appendChild(pMessageWrap);
            pMessageContainer.appendChild(pMessageWrap);

            messageBody.appendChild(pMessageContainer);
        }
        if (aCount > 0) {
            var aMessageContainer = document.createElement('div');
            aMessageContainer.classList.add('timeApprovalWarningPopup__messageContainer');

            var aMessageWrap = document.createElement('div');
            aMessageWrap.classList.add('timeApprovalWarningPopup__messageWrap');
            var aMessage = document.createElement('p');
            aMessage.innerHTML = `You have selected ${aCount} ${aCount === 1 ? `entry` : 'entries'
                } with a status of Awaiting Approval.`;
            aMessageWrap.appendChild(aMessage);

            var aMessage2Wrap = document.createElement('div');
            aMessage2Wrap.classList.add('timeApprovalWarningPopup__messageWrap', 'messageWithBtns');
            var aMessage2 = document.createElement('p');

            aMessage2.innerHTML = `Would you like to Approve or Reject ${aCount === 1 ? `this entry` : 'these entries'
                }?`;
            var aMessageBtnWrap = document.createElement('div');
            aMessageBtnWrap.classList.add('btnWrap');
            var approveBtn = button.build({ text: 'Approve' });
            var rejectBtn = button.build({ text: 'Reject' });

            approveBtn.addEventListener('click', () => {
                approveBtn.classList.add('enabled');
                rejectBtn.classList.remove('enabled');
                setApproveOrReject('approve');
            });
            rejectBtn.addEventListener('click', () => {
                rejectBtn.classList.add('enabled');
                approveBtn.classList.remove('enabled');
                setApproveOrReject('reject');
            });

            aMessageBtnWrap.appendChild(approveBtn);
            aMessageBtnWrap.appendChild(rejectBtn);
            aMessage2Wrap.appendChild(aMessage2);
            aMessage2Wrap.appendChild(aMessageBtnWrap);

            aMessageContainer.appendChild(aMessageWrap);
            aMessageContainer.appendChild(aMessage2Wrap);

            messageBody.appendChild(aMessageContainer);
        }

        return messageBody;
    }
    function showStatusChangePopup() {
        var warningPop = POPUP.build({});
        warningPop.classList.add('timeApprovalWarningPopup');

        // build message
        var message = buildStatusChangePopupMessage();

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        var yesBtn = button.build({
            text: 'Proceed',
            type: 'contained',
            style: 'secondary',
            callback: function () {
                updateEntryStatus();
                POPUP.hide(warningPop);
            },
        });
        var noBtn = button.build({
            text: 'Cancel',
            type: 'contained',
            style: 'secondary',
            callback: function () {
                POPUP.hide(warningPop);
            },
        });

        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);

        warningPop.appendChild(message);
        warningPop.appendChild(btnWrap);

        POPUP.show(warningPop);
    }

    // Data Getters
    //------------------------------------
    function getDropdownData(callback) {
        singleEntryAjax.getSingleEntrySupervisors($.session.PeopleId, function (results) {
            supervisors = results;

            singleEntryAjax.getSubEmployeeListAndCountInfo(
                parseInt($.session.PeopleId),
                function (results) {
                    employees = results;

                    singleEntryAjax.getAdminSingleEntryLocations(function (results) {
                        locations = results;

                        callback();
                    });
                },
            );
        });
    }
    function getReviewTableData(callback) {
        var filterData = {
            token: $.session.Token,
            endDate,
            startDate,
            supervisorId: supervisorId ? supervisorId : $.session.PeopleId,
            locationId: locationId ? locationId : '',
            employeeId: employeeId ? employeeId : '',
            status: status || status !== '%' ? status : '',
            workCodeId: workCodeId ? workCodeId : '',
        };
        singleEntryAjax.singleEntryFilterAdminList(filterData, function (results) {
            reviewTableData = results;
            callback(results);

            //clear google map. Don't show it unless they click the show map button.

            // if (showMap) {
            //   addMap()
            // } else GOOGLE_MAP.clearMap()

            GOOGLE_MAP.clearMap();
            showMap = false;
        });
    }

    // Action Nav
    //------------------------------------
    function actionNavEvent(type) {
        ACTION_NAV.hide();
        mulitSelectBtn.classList.remove('disabled');
        mulitSelectBtn.classList.remove('enabled');
        selectAllBtn.classList.remove('enabled');

        enableMultiEdit = false;
        enableSelectAll = false;

        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));

        if (selectedRows.length > 0) {
            if (type === 'reject') {
                //open rejection reason popup
                var popup = POPUP.build({
                    header: 'Reject Multiple Time Records',
                });

                var dataMessage = document.createElement('p');
                dataMessage.style.marginBottom = '2em';
                dataMessage.innerHTML = '';

                // Text Input
                var rejectionReason = input.build({
                    label: 'Reason:',
                    type: 'textarea',
                    style: 'secondary',
                    classNames: 'autosize',
                    charLimit: '500',
                    forceCharLimit: true,
                });
                var reasonInput = document.createElement('div');
                reasonInput.appendChild(rejectionReason);
                rejectionReason.addEventListener('change', event => {
                    rejectionReasonText = event.target.value;
                });

                var btnWrap = document.createElement('div');
                btnWrap.classList.add('btnWrap');

                //save button
                var notifyBtn = button.build({
                    text: 'Save',
                    style: 'secondary',
                    type: 'contained',
                    callback: function () {
                        sortSelectedRowsForUpdate();
                        setApproveOrReject('reject');
                        updateSelectAllStatus(type);

                        rejectionReasonText = '';
                        POPUP.hide(popup);
                    },
                });

                //cancel button
                var cancelBtn = button.build({
                    text: 'Cancel',
                    style: 'secondary',
                    type: 'contained',
                    callback: function () {
                        POPUP.hide(popup);
                    },
                });

                //display data
                popup.appendChild(dataMessage);
                popup.appendChild(reasonInput);

                btnWrap.appendChild(notifyBtn);
                btnWrap.appendChild(cancelBtn);
                popup.appendChild(btnWrap);

                //show popup
                POPUP.show(popup);
            } else {
                sortSelectedRowsForUpdate();
                updateSelectAllStatus(type);
            }
        }
    }

    function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;
        switch (targetAction) {
            case 'timeApprovalApprove': {
                actionNavEvent('approve');
                break;
            }
            case 'timeApprovalSubmit': {
                actionNavEvent('submit');
                break;
            }
            case 'timeApprovalReject': {
                actionNavEvent('reject');
                break;
            }
            default:
                break;
        }
    }
    function setupActionNav() {
        approveNavBtn = button.build({
            text: 'Approve',
            style: 'secondary',
            type: 'contained',
            attributes: [{ key: 'data-action-nav', value: 'timeApprovalApprove' }],
        });
        submitNavBtn = button.build({
            text: 'Submit',
            style: 'secondary',
            type: 'contained',
            attributes: [{ key: 'data-action-nav', value: 'timeApprovalSubmit' }],
        });
        rejectNavBtn = button.build({
            text: 'Reject',
            style: 'secondary',
            type: 'contained',
            attributes: [{ key: 'data-action-nav', value: 'timeApprovalReject' }],
        });
        ACTION_NAV.populate([approveNavBtn, submitNavBtn, rejectNavBtn]);
        ACTION_NAV.hide();
    }

    // Filtering
    //------------------------------------
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.filteredByData');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet();
            filteredBy.appendChild(btnWrap);
        }

        if (document.getElementById('startDateBtn') != null) {
            document.getElementById('startDateBtn').innerHTML = 'From Date: ' + moment(startDate, 'YYYY-MM-DD').format('M/D/YYYY');
            document.getElementById('endDateBtn').innerHTML = 'To Date: ' + moment(endDate, 'YYYY-MM-DD').format('M/D/YYYY');
            document.getElementById('supervisorBtn').innerHTML = 'Supervisor: ' + supervisorName;
        }


        if (employeeName === 'All' || employeeName === '') {  
            btnWrap.appendChild(employeeBtnWrap);
            btnWrap.removeChild(employeeBtnWrap);
        }
        else {
            btnWrap.appendChild(employeeBtnWrap);
            if (document.getElementById('employeeBtn') != null)
                document.getElementById('employeeBtn').innerHTML = 'Employee: ' + employeeName;
        }

        if (locationName === 'All' || locationName === '%') {
            btnWrap.appendChild(locationBtnWrap);
            btnWrap.removeChild(locationBtnWrap);
        }
        else {
            btnWrap.appendChild(locationBtnWrap);
            if (document.getElementById('locationBtn') != null)
                document.getElementById('locationBtn').innerHTML = 'Location: ' + locationName;
        }

        if (statusText === 'All' || statusText === '%') {
            btnWrap.appendChild(statusBtnWrap);
            btnWrap.removeChild(statusBtnWrap);
        } else {
            btnWrap.appendChild(statusBtnWrap);
            if (document.getElementById('statusBtn') != null)
                document.getElementById('statusBtn').innerHTML = 'Status: ' + statusText;
        }


        if (workCodeName === 'All' || workCodeName === '%') {
            btnWrap.appendChild(workCodeBtnWrap);
            btnWrap.removeChild(workCodeBtnWrap);
        }
        else {
            btnWrap.appendChild(workCodeBtnWrap);
            if (document.getElementById('workCodeBtn') != null)
                document.getElementById('workCodeBtn').innerHTML = 'Work Code: ' + workCodeName;
        }

        return filteredBy;
    }

    function filterButtonSet() {
        filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtnNew',
            callback: () => { showFilterPopup('ALL') },
        });

        supervisorBtn = button.build({
            id: 'supervisorBtn',
            text: 'Supervisor: ' + supervisorName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('supervisorBtn') },
        });

        locationBtn = button.build({
            id: 'locationBtn',
            text: 'Location: ' + locationName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('locationBtn') },
        });
        locationCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('locationBtn') },
        });

        statusBtn = button.build({
            id: 'statusBtn',
            text: 'Consumer: ' + statusText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('statusBtn') },
        });
        statusCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('statusBtn') },
        });

        employeeBtn = button.build({
            id: 'employeeBtn',
            text: 'Employee: ' + employeeName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('employeeBtn') },
        });
        employeeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('employeeBtn') },
        });

        workCodeBtn = button.build({
            id: 'workCodeBtn',
            text: 'Work Code: ' + workCodeName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('workCodeBtn') },
        });
        workCodeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('workCodeBtn') },
        });

        startDateBtn = button.build({
            id: 'startDateBtn',
            text: 'From Date: ' + UTIL.formatDateFromIso(startDate),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('startDateBtn') },
        });

        endDateBtn = button.build({
            id: 'endDateBtn',
            text: 'To Date: ' + UTIL.formatDateFromIso(endDate),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('endDateBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        startDateBtnWrap = document.createElement('div');
        startDateBtnWrap.classList.add('filterSelectionBtnWrap');
        startDateBtnWrap.appendChild(startDateBtn);
        btnWrap.appendChild(startDateBtnWrap);

        endDateBtnWrap = document.createElement('div');
        endDateBtnWrap.classList.add('filterSelectionBtnWrap');
        endDateBtnWrap.appendChild(endDateBtn);
        btnWrap.appendChild(endDateBtnWrap);

        supervisorBtnWrap = document.createElement('div');
        supervisorBtnWrap.classList.add('filterSelectionBtnWrap');
        supervisorBtnWrap.appendChild(supervisorBtn);
        btnWrap.appendChild(supervisorBtnWrap);

        locationBtnWrap = document.createElement('div');
        locationBtnWrap.classList.add('filterSelectionBtnWrap');
        locationBtnWrap.appendChild(locationBtn);
        locationBtnWrap.appendChild(locationCloseBtn);
        btnWrap.appendChild(locationBtnWrap);

        statusBtnWrap = document.createElement('div');
        statusBtnWrap.classList.add('filterSelectionBtnWrap');
        statusBtnWrap.appendChild(statusBtn);
        statusBtnWrap.appendChild(statusCloseBtn);
        btnWrap.appendChild(statusBtnWrap);

        employeeBtnWrap = document.createElement('div');
        employeeBtnWrap.classList.add('filterSelectionBtnWrap');
        employeeBtnWrap.appendChild(employeeBtn);
        employeeBtnWrap.appendChild(employeeCloseBtn);
        btnWrap.appendChild(employeeBtnWrap);

        workCodeBtnWrap = document.createElement('div');
        workCodeBtnWrap.classList.add('filterSelectionBtnWrap');
        workCodeBtnWrap.appendChild(workCodeBtn);
        workCodeBtnWrap.appendChild(workCodeCloseBtn);
        btnWrap.appendChild(workCodeBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'locationBtn') {
            locationName = 'All';
            locationId = '%';
            tmpLocationId = '%';
            tmpLocationName = 'All';
        }
        if (closeFilter == 'statusBtn') {
            statusText = 'All';
            status = '%';
            tmpStatus = '%';
            tmpStatusText = 'All';
        }
        if (closeFilter == 'employeeBtn') {
            employeeId = '';
            employeeName = 'All';
            tmpEmployeeId = '';
            tmpEmployeeName = 'All';
        }
        if (closeFilter == 'workCodeBtn') {
            workCodeId = '%';
            workCodeName = 'All';
            tmpWorkCodeId = '%';
            tmpWorkCodeName = 'All';
        }
        filterApply();
    }

    function updateFilterData(data) {
        if (data.tmpSupervisorId) supervisorId = data.tmpSupervisorId;
        if (data.tmpSupervisorName) supervisorName = data.tmpSupervisorName;
        if (data.tmpLocationId) locationId = data.tmpLocationId;
        if (data.tmpLocationName) locationName = data.tmpLocationName;
        if (data.tmpEmployeeId || data.tmpEmployeeId === '') employeeId = data.tmpEmployeeId;
        if (data.tmpEmployeeName) employeeName = data.tmpEmployeeName;
        if (data.tmpStatus) status = data.tmpStatus;
        if (data.tmpStatusText) statusText = data.tmpStatusText;
        if (data.tmpWorkCodeId || data.tmpWorkCodeId === '') workCodeId = data.tmpWorkCodeId;
        if (data.tmpWorkCodeName) workCodeName = data.tmpWorkCodeName;
        if (data.tmpStartDate) startDate = data.tmpStartDate;
        if (data.tmpEndDate) endDate = data.tmpEndDate;
        if (data.tmpStartDate) payPeriod.start = data.tmpStartDate;
        if (data.tmpEndDate) payPeriod.end = data.tmpEndDate;

    }
    function buildSupervisorDropdown() {
        var select = dropdown.build({
            label: 'Supervisor',
            style: 'secondary',
            readonly: false,
        });

        var data = supervisors.map(sup => {
            return {
                value: sup.Person_ID,
                text: `${sup.last_name}, ${sup.first_name}`,
            };
        });

        data.sort((a, b) => {
            var aNameSplit = a.text.split(',');
            var bNameSplit = b.text.split(',');
            var aName = `${aNameSplit[0].trim()}${aNameSplit[1].trim()}`.toLowerCase();
            var bName = `${bNameSplit[0].trim()}${bNameSplit[1].trim()}`.toLowerCase();

            return aName > bName ? 1 : -1;
        });

        dropdown.populate(select, data, supervisorId);

        return select;
    }
    function buildEmployeeDropdown() {
        var select = dropdown.build({
            dropdownId: 'subEmployeeList',
            label: 'Employee',
            style: 'secondary',
            readonly: false,
        });
        var data = employees.map(emp => {
            return {
                value: emp.Person_ID,
                text: `${emp.last_name}, ${emp.first_name}`,
            };
        });
        data.sort((a, b) => {
            var aNameSplit = a.text.split(',');
            var bNameSplit = b.text.split(',');
            var aName = `${aNameSplit[0].trim()}${aNameSplit[1].trim()}`.toLowerCase();
            var bName = `${bNameSplit[0].trim()}${bNameSplit[1].trim()}`.toLowerCase();

            return aName > bName ? 1 : -1;
        });
        data.unshift({
            value: '',
            text: 'All',
        });

        dropdown.populate(select, data, employeeId);

        return select;
    }
    function repopulateEmployeeDropdown() {
        var data = employees.map(emp => {
            return {
                value: emp.Person_ID,
                text: `${emp.last_name}, ${emp.first_name}`,
            };
        });

        data.sort((a, b) => {
            var aNameSplit = a.text.split(',');
            var bNameSplit = b.text.split(',');
            var aName = `${aNameSplit[0].trim()}${aNameSplit[1].trim()}`.toLowerCase();
            var bName = `${bNameSplit[0].trim()}${bNameSplit[1].trim()}`.toLowerCase();

            return aName > bName ? 1 : -1;
        });

        data.unshift({
            value: '',
            text: 'All',
        });

        dropdown.populate('subEmployeeList', data, employeeId);
    }
    function buildLocationDropdown() {
        var select = dropdown.build({
            label: 'Location',
            style: 'secondary',
            readonly: false,
        });

        var data = locations.map(loc => {
            return {
                value: loc.locationID,
                text: loc.shortDescription,
            };
        });
        data.sort((a, b) => (a.text > b.text ? 1 : -1));
        data.unshift({
            value: '%',
            text: 'All',
        });

        var defaultVal;

        if (locationId) defaultVal = locationId;

        dropdown.populate(select, data, locationId);

        return select;
    }
    function buildStatusDropdown() {
        var select = dropdown.build({
            label: 'Status',
            style: 'secondary',
            readonly: false,
        });

        var data = statuses.map(status => {
            return {
                value: status.key,
                text: status.value,
            };
        });

        data.unshift({
            value: '%',
            text: 'All',
        });

        dropdown.populate(select, data, status);

        return select;
    }
    function buildWorkCodeDropdown() {
        var select = dropdown.build({
            label: 'Work Codes',
            style: 'secondary',
            readonly: false,
        });

        var data = workCodeData.map(wc => {
            return {
                value: wc.workcodeid,
                text: wc.workcodename,
            };
        });

        data.unshift({
            value: '%',
            text: 'All',
        });

        dropdown.populate(select, data, workCodeId);

        return select;
    }
    function setupFilterEvents() {
        tmpSupervisorId;
        tmpSupervisorName;
        tmpLocationId;
        tmpLocationName;
        tmpEmployeeId;
        tmpEmployeeName;
        tmpStatus;
        tmpStatusText;
        tmpStartDate;
        tmpEndDate;

        supervisorDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpSupervisorId = selectedOption.value;
            tmpSupervisorName = selectedOption.innerHTML;
            singleEntryAjax.getSubEmployeeListAndCountInfo(tmpSupervisorId, function (results) {
                employees = results;
                repopulateEmployeeDropdown();
            });
        });
        employeeDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpEmployeeId = selectedOption.value;
            tmpEmployeeName = selectedOption.innerHTML;
        });
        locationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpLocationId = selectedOption.value;
            tmpLocationName = selectedOption.innerHTML;
        });
        statusDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpStatus = selectedOption.value;
            tmpStatusText = selectedOption.innerHTML;
        });
        workCodeDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpWorkCodeId = selectedOption.value;
            tmpWorkCodeName = selectedOption.innerHTML;
        });
        startDateInput.addEventListener('change', event => {
            if (isValidDate(event.target.value)) {
                tmpStartDate = event.target.value;
                payPeriod.start = event.target.value;
                checkDateValidation();
            } else {
                event.target.value = tmpStartDate;
            }
        });
        endDateInput.addEventListener('change', event => {
            if (isValidDate(event.target.value)) {
                tmpEndDate = event.target.value;
                payPeriod.end = event.target.value;
                checkDateValidation();
            } else {
                event.target.value = tmpEndDate;
            }
        });

        applyBtn.addEventListener('click', () => {

            if (IsFilterDisable) {
                POPUP.hide(filterPopup);

                // if (tmpEmployeeId !== "") {
                //   showMap = true
                // } else showMap = false
                filterApply();
            }
            IsFilterDisable = true;
        });

        applyBtn.addEventListener('keypress', event => {
            if (event.keyCode === 13 && applyBtn.classList.contains('disabled')) {
                IsFilterDisable = false;
            }
        });

        cancelBtn.addEventListener('click', () => {
            POPUP.hide(filterPopup);
            tmpStartDate = startDate;
            tmpEndDate = endDate;
        });
    }

    function filterApply() {
        if (tmpWorkCodeId) workCodeId = tmpWorkCodeId;
        if (tmpWorkCodeName) workCodeName = tmpWorkCodeName;

        updateFilterData({
            tmpSupervisorId,
            tmpSupervisorName,
            tmpLocationId,
            tmpLocationName,
            tmpEmployeeId,
            tmpEmployeeName,
            tmpStatus,
            tmpStatusText,
            tmpWorkCodeId,
            tmpWorkCodeName,
            tmpStartDate,
            tmpEndDate
        });
       
        document.getElementById('startDateBtn').innerHTML = 'From Date: ' + moment(startDate, 'YYYY-MM-DD').format('M/D/YYYY');
        document.getElementById('endDateBtn').innerHTML = 'To Date: ' + moment(endDate, 'YYYY-MM-DD').format('M/D/YYYY');
        document.getElementById('supervisorBtn').innerHTML = 'Supervisor: ' + supervisorName;

        if (employeeName === 'All' || employeeName === '') {
            btnWrap.appendChild(employeeBtnWrap);
            btnWrap.removeChild(employeeBtnWrap);
        }
        else {
            btnWrap.appendChild(employeeBtnWrap);
            document.getElementById('employeeBtn').innerHTML = 'Employee: ' + employeeName;
        }

        if (locationName === 'All' || locationName === '%') {
            btnWrap.appendChild(locationBtnWrap);
            btnWrap.removeChild(locationBtnWrap);
        }
        else {
            btnWrap.appendChild(locationBtnWrap);
            document.getElementById('locationBtn').innerHTML = 'Location: ' + locationName;
        }

        if (statusText === 'All' || statusText === '%') {
            btnWrap.appendChild(statusBtnWrap);
            btnWrap.removeChild(statusBtnWrap);
        } else {
            btnWrap.appendChild(statusBtnWrap);
            document.getElementById('statusBtn').innerHTML = 'Status: ' + statusText;
        }


        if (workCodeName === 'All' || workCodeName === '%') {
            btnWrap.appendChild(workCodeBtnWrap);
            btnWrap.removeChild(workCodeBtnWrap);
        }
        else {
            btnWrap.appendChild(workCodeBtnWrap);
            document.getElementById('workCodeBtn').innerHTML = 'Work Code: ' + workCodeName;
        } 

        mulitSelectBtn.classList.remove('disabled');
        mulitSelectBtn.classList.remove('enabled');
        selectAllBtn.classList.remove('enabled');

        enableMultiEdit = false;
        enableSelectAll = false;

        selectedRows = [];
        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));

        startDate = payPeriod.start;
        endDate = payPeriod.end;

        getDropdownData(function () {
            loadReviewPage();
        });

    }
    function showFilterPopup(IsShow) {
        filterPopup = POPUP.build({ hideX: true });

        supervisorDropdown = buildSupervisorDropdown();
        employeeDropdown = buildEmployeeDropdown();
        locationDropdown = buildLocationDropdown();
        statusDropdown = buildStatusDropdown();
        workCodeDropdown = buildWorkCodeDropdown();

        startDateInput = input.build({
            id: 'startDateInput',
            label: 'From',
            type: 'date',
            style: 'secondary',
            value: startDate,
        });
        endDateInput = input.build({
            id: 'endDateInput',
            label: 'To',
            type: 'date',
            style: 'secondary',
            value: endDate,
        });

        applyBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });
        cancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(applyBtn);
        btnWrap.appendChild(cancelBtn);

        const dateWrap = document.createElement('div');
        dateWrap.classList.add('dateWrap', 'btnWrap');
        if (IsShow == 'ALL' || IsShow == 'startDateBtn')
            dateWrap.appendChild(startDateInput);
        if (IsShow == 'ALL' || IsShow == 'endDateBtn')
            dateWrap.appendChild(endDateInput);

        if (IsShow == 'ALL' || IsShow == 'supervisorBtn')
            filterPopup.appendChild(supervisorDropdown);
        if (IsShow == 'ALL' || IsShow == 'employeeBtn')
            filterPopup.appendChild(employeeDropdown);
        if (IsShow == 'ALL' || IsShow == 'locationBtn')
            filterPopup.appendChild(locationDropdown);
        if (IsShow == 'ALL' || IsShow == 'statusBtn')
            filterPopup.appendChild(statusDropdown);
        filterPopup.appendChild(dateWrap);
        if (IsShow == 'ALL' || IsShow == 'workCodeBtn')
            filterPopup.appendChild(workCodeDropdown);
        filterPopup.appendChild(btnWrap);

        setupFilterEvents();

        singleEntryAjax.getSubEmployeeListAndCountInfo(supervisorId, function (results) {
            employees = results;
            repopulateEmployeeDropdown();
        });

        checkDateValidation();
        POPUP.show(filterPopup);
    }


    function checkDateValidation() {
        if (tmpStartDate > tmpEndDate) {
            endDateInput.classList.add('error');
        } else {
            endDateInput.classList.remove('error');
        }
        setBtnStatusOfApplyFilter();
    }

    function setBtnStatusOfApplyFilter() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            applyBtn.classList.add('disabled');
            return;
        } else {
            applyBtn.classList.remove('disabled');
        }
    }

    // Time Entry Details Popup
    //------------------------------------
    function getDataForTimeEntryEdit(status, entryId, isOrginUser) {
        $.session.editSingleEntryCardStatus = status;
        singleEntryAjax.getSingleEntryById(entryId, results => {
            singleEntryAjax.getSingleEntryConsumersPresent(entryId, consumers => {
                editTimeEntry.init({
                    isOrginUser,
                    entry: results,
                    consumers: consumers,
                    isAdminEdit: true,
                    payPeriod,
                    recordActivityElement: document.getElementById(`${entryId}-seRecordActivity`),
                });
            });
        });
    }
    function showRowDetails(
        entryId,
        entryStatus,
        consumersPresent,
        isValid,
        rowName,
        rowDate,
        rowStartTime,
        rowEndTime,
        rowWorkCode,
        isOrginUser,
    ) {
        selectedRows = [];
        selectedRows.push({ id: entryId, status: entryStatus });
        sortSelectedRowsForUpdate();
        // popup
        var popup = POPUP.build({
            classNames: 'timeEntryDetailsPopup',
        });
        // btns
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('buttonWrap');
        var editBtn = button.build({
            text: 'Edit',
            style: 'secondary',
            type: 'contained',
            //icon: 'edit',
            classNames: 'editEntryBtn',
            callback: function () {
                POPUP.hide(popup);
                getDataForTimeEntryEdit(entryStatus, entryId, isOrginUser);
            },
        });
        var approveBtn = button.build({
            text: 'Approve',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                if (!isValid) {
                    showSubmitError(`Unable to approve entry, end time needed.`);
                } else {
                    setApproveOrReject('approve');
                    updateEntryStatus();
                }
            },
        });
        var submitBtn = button.build({
            text: 'Submit',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                if (!isValid) {
                    showSubmitError(`Unable to submit entry, end time needed.`);
                } else {
                    setApproveOrReject('');
                    updateEntryStatus();
                }
            },
        });
        var rejectBtn = button.build({
            text: 'Reject',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                function showRejectionPopup() {
                    //popup
                    var popup = POPUP.build({
                        header: 'Reject Time Entry - ' + rowName,
                    });

                    //put together work code description
                    var workCode = workCodeLookup[rowWorkCode];
                    if (workCode != '') {
                        var workCodeText = rowWorkCode + ' - ' + workCode;
                    } else {
                        var workCodeText = rowWorkCode;
                    }

                    //format consumer data before displaying
                    var dataMessage = document.createElement('p');
                    dataMessage.style.marginBottom = '2em';
                    dataMessage.innerHTML =
                        'Date: ' +
                        rowDate +
                        '<br />' +
                        'Start Time: ' +
                        rowStartTime +
                        '<br />' +
                        'End Time: ' +
                        rowEndTime +
                        '<br />' +
                        'Work Code: ' +
                        workCodeText;

                    // Text Input
                    var rejectionReason = input.build({
                        label: 'Reason:',
                        type: 'textarea',
                        style: 'secondary',
                        classNames: 'autosize',
                        charLimit: '500',
                        forceCharLimit: true,
                    });
                    var reasonInput = document.createElement('div');
                    reasonInput.appendChild(rejectionReason);
                    rejectionReason.addEventListener('change', event => {
                        rejectionReasonText = event.target.value;
                    });

                    var btnWrap = document.createElement('div');
                    btnWrap.classList.add('btnWrap');

                    //save button
                    var notifyBtn = button.build({
                        text: 'Save',
                        style: 'secondary',
                        type: 'contained',
                        callback: function () {
                            //Update Work Code and the Rejection Reason
                            setApproveOrReject('reject');
                            updateEntryStatus();
                            rejectionReasonText = '';
                            POPUP.hide(popup);
                        },
                    });

                    //cancel button
                    var cancelBtn = button.build({
                        text: 'Cancel',
                        style: 'secondary',
                        type: 'contained',
                        callback: function () {
                            POPUP.hide(popup);
                        },
                    });

                    //display data
                    popup.appendChild(dataMessage);
                    popup.appendChild(reasonInput);

                    btnWrap.appendChild(notifyBtn);
                    btnWrap.appendChild(cancelBtn);
                    popup.appendChild(btnWrap);

                    //show popup
                    POPUP.show(popup);
                }
                showRejectionPopup();
            },
        });

        btnWrap.appendChild(editBtn);
        if (entryStatus === 'P') {
            btnWrap.appendChild(submitBtn);
        }
        if (entryStatus === 'A') {
            btnWrap.appendChild(approveBtn);
            btnWrap.appendChild(rejectBtn);
        }
        // Aditional details
        const consumerDisplay = document.createElement('div');
        consumerDisplay.id = 'consumerDisplay';
        const loadingDisplay = document.createElement('div');
        loadingDisplay.id = 'loadingDisplay';
        const transportationDisplay = document.createElement('div');
        transportationDisplay.id = 'transportationDisplay';

        popup.appendChild(loadingDisplay);
        popup.appendChild(consumerDisplay);
        popup.appendChild(transportationDisplay);
        popup.appendChild(btnWrap);

        POPUP.show(popup);
        timeEntryDetailsPopup.init(entryId, consumersPresent);
    }

    // Admin Review Table
    //------------------------------------
    function enableMultiEditRows() {
        enableMultiEdit = !enableMultiEdit;

        mulitSelectBtn.classList.toggle('enabled');

        if (enableMultiEdit) {
            ACTION_NAV.show();
        } else {
            ACTION_NAV.hide();
        }

        selectedRows = [];
        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));
    }
    function enableSelectAllRows() {
        enableSelectAll = !enableSelectAll;

        selectAllBtn.classList.toggle('enabled');

        if (enableSelectAll) {
            ACTION_NAV.show();
            enableMultiEdit = true;
            mulitSelectBtn.classList.add('disabled');
            mulitSelectBtn.classList.remove('enabled');

            selectedRows = [];

            var rows = [].slice.call(document.querySelectorAll('.table__row'));
            rows.forEach(r => {
                var isValid = r.dataset.valid === 'true' ? true : false;
                if (!isValid) return;

                var entryStatus = r.dataset.status;
                var entryId = r.id;

                if (entryStatus === 'P' || entryStatus === 'A') {
                    r.classList.add('selected');
                    selectedRows.push({ id: entryId, status: entryStatus });
                }
            });
        } else {
            ACTION_NAV.hide();
            enableMultiEdit = false;
            mulitSelectBtn.classList.remove('disabled');

            selectedRows = [];

            var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
            highlightedRows.forEach(row => row.classList.remove('selected'));
        }
    }
    // events
    function handleReviewTableEvents(event) {
        var isRow = event.target.classList.contains('table__row');
        var isSelected = event.target.classList.contains('selected');
        var entryStatus = event.target.dataset.status;
        var entryId = event.target.id;

        //capture rowName, rowDate, rowStartTime, rowEndTime, rowWorkCode
        var rowName = event.target.childNodes[1].innerText;
        var rowDate = event.target.childNodes[2].innerText;
        var rowStartTime = event.target.childNodes[3].innerText;
        var rowEndTime = event.target.childNodes[4].innerText;
        var rowWorkCode = event.target.childNodes[7].innerText;

        var consumersPresent = event.target.dataset.consumers;
        var isValid = event.target.dataset.valid === 'true' ? true : false;
        var isOrginUser = event.target.dataset.valid === 'Y' ? true : false;
        if (!isRow) return; // if not row return

        if (enableMultiEdit && isValid) {
            if (isSelected) {
                // if alread selected, de-select it
                event.target.classList.remove('selected');
                selectedRows = selectedRows.filter(sr => sr.id !== entryId);
                if (enableSelectAll) {
                    enableSelectAll = false;
                    mulitSelectBtn.classList.remove('disabled');
                    mulitSelectBtn.classList.add('enabled');
                    selectAllBtn.classList.remove('enabled');
                }
            } else {
                if (entryStatus === 'P' || entryStatus === 'A') {
                    event.target.classList.add('selected');
                    selectedRows.push({ id: entryId, status: entryStatus });
                }
            }
        } else if (!enableMultiEdit) {
            selectedRows = [];
            showRowDetails(
                entryId,
                entryStatus,
                consumersPresent,
                isValid,
                rowName,
                rowDate,
                rowStartTime,
                rowEndTime,
                rowWorkCode,
                isOrginUser,
            );
        }
    }
    // populate
    function populateTable(results) {
        totalHours = 0;
        var tableData = results.map(entry => {
            var isOrginUser = $.session.PeopleId === entry.peopleId ? 'Y' : 'N';

            var entryId = entry.Single_Entry_ID;
            var status = statusLookup[entry.Anywhere_status];
            var employee = `${entry.lastname}, ${entry.firstname}`;
            var date = entry.Date_of_Service.split(' ')[0];
            var start = UTIL.convertFromMilitary(entry.start_time);
            var end = UTIL.convertFromMilitary(
                entry.end_time === '23:59:59' ? '00:00:00' : entry.end_time,
            );
            var hours = parseFloat(entry.check_hours);
            var location = entry.Location_Name;
            var workcode = entry.WCCode;
            var comments = entry.comments;
            const consumersPresent = entry.Number_Consumers_Present;
            const transportationUnits = entry.transportation_units;
            let isValid;

            totalHours += hours;
            if (entry.keyTimes === 'Y') {
                // end time required to be valid
                isValid = entry.end_time === '' ? 'false' : 'true';
            } else {
                isValid = 'true';
            }

            //consumer present and transportation icons
            const additionalInformation = document.createElement('div');
            additionalInformation.classList.add('additionalInfoBox');
            additionalInformation.innerHTML = consumersPresent;
            if (transportationUnits !== '') additionalInformation.innerHTML += icons.car;

            const iconsBox = document.createElement('div');
            iconsBox.classList.add('iconsBox');
            iconsBox.appendChild(additionalInformation);

            if (comments !== "" && comments !== null) {
                const commentsBox = document.createElement('div');
                commentsBox.classList.add('commentsBox');
                commentsBox.innerHTML = icons.note;
                iconsBox.appendChild(commentsBox);

                if (isValid === 'false') {
                    const svgElement = commentsBox.querySelector('svg');
                    svgElement.style.color = 'white';
                }
            }

            return {
                id: entryId,
                values: [
                    status,
                    employee,
                    date,
                    start,
                    end,
                    hours,
                    location,
                    workcode,
                    iconsBox.outerHTML
                ],
                attributes: [
                    { key: 'data-status', value: entry.Anywhere_status },
                    { key: 'data-consumers', value: consumersPresent },
                    { key: 'data-valid', value: isValid },
                    { key: 'data-origUser', value: isOrginUser },
                ],
            };
        });

        table.populate(reviewTable, tableData);
        totalHours = totalHours.toFixed(2);
        buildHoursWorked(totalHours);
        buildSERecordActivity(results);
    }
    // BUILD ==============
    // == Build Hours Worked ==
    function buildHoursWorked(hours) {
        if (Array.from(document.querySelectorAll('.table__row')).length === 1) return; // 1st row is the headers. If there is only the first row, there are no records
        const lastRow = Array.from(document.querySelectorAll('.table__row')).pop();
        const lastRowHour = lastRow.childNodes[5].innerText;
        lastRow.childNodes[5].outerHTML = `<div><p>${lastRowHour}</p><div class="totalhoursdiv">Total Hours: ${hours}</div></div>`;
    }

    // Row Additional Information from ticket 66490 Submitted/Rejected/Approved User and Date
    function buildSERecordActivity(seData) {
        function createElement(status, user, date, seID, rejected) {
            const dateVal = date.split(' ')[0];
            const timeVal = UTIL.formatTimeString(
                UTIL.convertToMilitary(`${date.split(' ')[1]} ${date.split(' ')[2]}`),
            );
            const element = document.createElement('p');
            element.classList.add('seRecordActivity');
            element.id = `${seID}-seRecordActivity`;
            element.innerText = `${status}: ${dateVal} - ${timeVal} - ${user}`;
            // if (rejected) element.classList.add('rejected'); //add red text to the message for rejected records
            const tableRow = document.getElementById(seID);
            tableRow.appendChild(element);
        }
        seData.forEach(entry => {
            switch (entry.Anywhere_status) {
                case 'A':   // Submitted needs approval
                    createElement(
                        'Record Submitted',
                        entry.submittedUser,
                        entry.submit_date,
                        entry.Single_Entry_ID,
                        false,
                    );
                    break;
                case 'S':  // Submitted (and Approved)
                    if (entry.approved_time != '') {
                        createElement(
                            'Record Approved',
                            entry.approvedUser,
                            entry.approved_time,
                            entry.Single_Entry_ID,
                            false,
                        );
                        break;

                    } else {
                        createElement(
                            'Record Submitted',
                            entry.submittedUser,
                            entry.submit_date,
                            entry.Single_Entry_ID,
                            false,
                        );
                        break;
                    }

                case 'I':  // Imported into Advisor
                case 'D': // Duplicate 
                    createElement(
                        'Record Submitted',
                        entry.submittedUser,
                        entry.submit_date,
                        entry.Single_Entry_ID,
                        false,
                    );
                    break;
                case 'R':  // Rejected
                    createElement(
                        'Record Rejected',
                        entry.rejectedUser,
                        entry.rejected_time,
                        entry.Single_Entry_ID,
                        true,
                    );
                    break;

                default:
                    break;
            }
        });
    }

    function buildTopNav() {
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('actionButtonWrap');

        mulitSelectBtn = button.build({
            text: 'Multi Select',
            icon: 'multiSelect',
            style: 'secondary',
            type: 'contained',
            classNames: 'multiSelectBtn',
            callback: enableMultiEditRows,
        });
        selectAllBtn = button.build({
            text: 'Select All',
            icon: 'multiSelect',
            style: 'secondary',
            type: 'contained',
            classNames: 'selectAllBtn',
            callback: enableSelectAllRows,
        });

        btnWrap.appendChild(mulitSelectBtn);
        btnWrap.appendChild(selectAllBtn);

        return btnWrap;
    }
    function buildTable() {
        var tableOptions = {
            tableId: 'singleEntryAdminReviewTable',
            headline: 'Time Entries',
            columnHeadings: [
                'Status',
                'Employee',
                'Date',
                'Start Time',
                'End Time',
                'Hours',
                'Location',
                'Work Code',
                '',
            ],
            callback: e => {
                handleReviewTableEvents(e);
            },
        };

        return table.build(tableOptions);
    }
    function buildReviewPage() {
        mapBtn = button.build({
            text: showMap ? ' Hide Map' : ' Show Map',
            style: 'secodary',
            type: 'text',
            classNames: 'mapBtn',
            callback: function () {
                if (!showMap) addMap();
                showMap = true;
                //See comment in init func regarding the removal of local storage setting for Map.
                //Button will only be show map. once clicked they can't hide it. This is to prevent people from
                //showing and hiding rapidly and incuring high api usage.

                //UTIL.LS.setStorage(LSKEY_showMap, showMap)
                //if (showMap) {
                //  mapBtn.innerHTML = icons.close + ' Hide Map'
                //  addMap()
                //} else {
                //  mapBtn.innerHTML = icons.show + ' Show Map'
                //  GOOGLE_MAP.clearMap()
                //}
            },
        });
        mapBtn.innerHTML = icons.show + ' Show Map';

        DOM.clearActionCenter();
        var topNav = buildTopNav();
        var fitleredBy = buildFilteredBy();
        reviewTable = buildTable();

        // Set the data type for each header, for sorting purposes
        const headers = reviewTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Status
        headers[1].setAttribute('data-type', 'string'); // Employee
        headers[2].setAttribute('data-type', 'date'); // Date
        headers[3].setAttribute('data-type', 'date'); // Start Time
        headers[4].setAttribute('data-type', 'date'); // End Time 
        headers[5].setAttribute('data-type', 'number'); // Hours
        headers[5].setAttribute('data-type', 'string'); // Location
        headers[7].setAttribute('data-type', 'string'); // Work Code 

        DOM.ACTIONCENTER.appendChild(topNav);
        DOM.ACTIONCENTER.appendChild(fitleredBy);
        DOM.ACTIONCENTER.appendChild(reviewTable);
        DOM.ACTIONCENTER.appendChild(mapBtn);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(reviewTable);

        setupActionNav();
    }
    // load
    function loadReviewPage() {
        $.session.singleEntrycrossMidnight = false;
        roster2.removeMiniRosterBtn();
        if (!supervisorId) supervisorId = $.session.PeopleId;
        if (!supervisorName) supervisorName = `${$.session.Name} ${$.session.LName}`;
        if (!employeeId) employeeId = '';
        if (!employeeName) employeeName = 'All';
        if (!locationId) locationId = '%';
        if (!locationName) locationName = 'All';
        if (!status) status = '%';
        if (!statusText) statusText = 'All';
        if (!workCodeId) workCodeId = '%';
        if (!workCodeName) workCodeName = 'All';

        buildReviewPage();
        getReviewTableData(populateTable);
    }

    /**
     * Handle navigation from dashboard widget to module
     * @param {string} startPeriod - M/D/Y Start of the pay period
     * @param {string} endPeriod - M/D/Y End of the pay period
     * @param {string} dashStatus - Letter code of status of the time entry
     * */
    async function dashHandler(startPeriod, endPeriod, dashStatus) {
        payPeriodData = timeEntry.getPayPeriods(false);
        locationData = timeEntry.getLocations();
        let startDateIso = UTIL.formatDateToIso(startPeriod);
        let endDateIso = UTIL.formatDateToIso(endPeriod);
        startDate = startDateIso;
        endDate = endDateIso;
        status = dashStatus;
        workCodeData = await timeEntry.getWorkCodes();

        payPeriod = timeEntry.setSelectedPayPeriod(
            startDateIso,
            endDateIso,
            `${startPeriod} - ${endPeriod}`,
        );

        getDropdownData(function () {
            loadReviewPage();
        });
    }

    function addMap() {
        let center;
        let markers = [];
        let markerLabels = [];
        reviewTableData.forEach((el, i) => {
            if (el.latitude == 0 && el.longitude == 0) return;
            latLngObj = {
                lat: parseFloat(el.latitude),
                lng: parseFloat(el.longitude),
            };
            let markerLabelDate = el.Date_of_Service.split(' ')[0];
            let markerLabelStartTime = UTIL.formatTimeString(el.start_time);
            let markerLabelEndTime = UTIL.formatTimeString(el.end_time);
            let markerLabelText = `
      ${el.lastname}, ${el.firstname}<br>
      ${markerLabelDate} ${markerLabelStartTime} - ${markerLabelEndTime}<br>
      ${el.Location_Name}
      `;
            markers.push(latLngObj);
            markerLabels.push(markerLabelText);
        });

        markers = GOOGLE_MAP.createMarkerArray(markers, markerLabels);

        let recordCnt = markers.latLngObj.length;
        if (recordCnt === 0) {
            GOOGLE_MAP.clearMap();
            return;
        }
        center = markers.latLngObj[0];
        GOOGLE_MAP.createBoundry(markers.latLngObj);
        GOOGLE_MAP.clearMap();
        GOOGLE_MAP.createElement(DOM.ACTIONCENTER);

        GOOGLE_MAP.initMap(10, center, markers);
    }

    async function refreshPage(payperiod) {
        payPeriodData = timeEntry.getPayPeriods(false);
        payPeriod = payperiod ? payperiod : timeEntry.getCurrentPayPeriod(false);
        locationData = timeEntry.getLocations();
        setActiveModuleSectionAttribute('timeEntry-approval');
        workCodeData = await timeEntry.getWorkCodes();
        startDate = payperiod.start;
        endDate = payperiod.end;

        getDropdownData(function () {
            loadReviewPage();
        }); 
    }

    function showSubmitError(messageText) {
        var popup = POPUP.build({ classNames: ['error'] });
        var message = document.createElement('p');
        message.innerHTML = messageText;
        popup.appendChild(message);

        POPUP.show(popup);
    }

    function isValidDate(d) {
        d = new Date(d);
        return d instanceof Date && !isNaN(d);
    }

    async function init() {
        //Removing Local Storage Key for showing Map. Map will now be defaulted to off,
        //end user will always need to click on show map button to load map.
        //this is to prevent over usage of google api.
        // showMap = UTIL.LS.getStorage(LSKEY_showMap);
        showMap = false;
        // if (showMap === undefined) showMap = true;
        payPeriodData = timeEntry.getPayPeriods(false);
        payPeriod = timeEntry.getCurrentPayPeriod(false);
        locationData = timeEntry.getLocations();
        workCodeData = await timeEntry.getWorkCodes();

        //displayPayPeriodPopup();
        if (payPeriod.start && payPeriod.end) {
            startDate = payPeriod.start;
            endDate = payPeriod.end;
        }
        else {
            endDate = UTIL.formatDateFromDateObj(dates.addDays(new Date(), 5));
            startDate = UTIL.formatDateFromDateObj(dates.subDays(new Date(), 1));
        }

        tmpStartDate = startDate;
        tmpEndDate = endDate;

        getDropdownData(function () {
            loadReviewPage();
        });
    }

    return {
        handleActionNavEvent,
        dashHandler,
        clearAllGlobalVariables,
        refreshPage,
        init,
    };
})();
