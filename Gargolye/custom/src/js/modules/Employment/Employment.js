const Employment = (() => {
    //Inputs
    let newFilterBtn;
    let filterRow;
    let EmploymentEntriesTable = [];
    let PositionBtns;
    let consumerRow;
    let consumerElement;
    let filterPopup;
    var selectedConsumers;
    var selectedConsumersName;
    var selectedConsumersId;
    //filter
    let filterValues;
    let btnWrap;
    let employerBtnWrap;
    let positionBtnWrap;
    let positionStartDateBtnWrap; 
    let positionEndDateBtnWrap;
    let jobStandingBtnWrap;
    let reportValues;
    // update Path 
    let ConsumersId;
    var employmentPath;
    let getEmployeepath = []; 
    let currentStatus;
    let pathToEmployment;
    let pathToStartDate;
    let existingPathID;
    let existingStartDate;
    let existingEndDate;

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
                await loadEmploymentLanding();
                DOM.toggleNavLayout();
                break;
            }
            case 'miniRosterCancel': {
                DOM.toggleNavLayout();
                loadApp('home');
                break;
            }
        }
    }

    // Build Employment Module Landing Page 
    async function loadEmploymentLanding() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();

        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

        landingPage = document.createElement('div');

        selectedConsumersId = selectedConsumers[selectedConsumers.length - 1].id;
        $.session.consumerId = selectedConsumersId;
        const name = (
            await ConsumerFinancesAjax.getConsumerNameByID({
                token: $.session.Token,
                consumerId: selectedConsumersId,
            })
        ).getConsumerNameByIDResult;

        selectedConsumersName = name[0].FullName;
        const topButton = buildHeaderButton(selectedConsumers[0]);
        landingPage.appendChild(topButton);
        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        const filteredBy = buildFilteredBy();
        filterRow.appendChild(filteredBy);

        landingPage.appendChild(filterRow);

        ///// Employment pah functionality 
        ConsumersId = selectedConsumersId;
        getEmployeepath = await EmploymentAjax.getEmployeementPathAsync(ConsumersId);

        const result = await EmploymentAjax.isNewPositionEnableAsync(ConsumersId);
        const { isNewPositionEnableResult } = result;
        if (isNewPositionEnableResult[0].IsEmployeeEnable == '0') {
            createEmploymentPathPopupBtn();
        }

        employmentPath = getEmployeepath.getEmployeementPathResult.length > 0 ? getEmployeepath.getEmployeementPathResult[0].employmentPath : '';
        existingPathID = getEmployeepath.getEmployeementPathResult[0] == undefined || getEmployeepath.getEmployeementPathResult[0].existingPathID == '' ? '' : getEmployeepath.getEmployeementPathResult[0].existingPathID;
        existingStartDate = getEmployeepath.getEmployeementPathResult[0] == undefined || getEmployeepath.getEmployeementPathResult[0].existingStartDate == '' ? '' : moment(getEmployeepath.getEmployeementPathResult[0].existingStartDate).format('YYYY-MM-DD');
        existingEndDate = getEmployeepath.getEmployeementPathResult[0] == undefined || getEmployeepath.getEmployeementPathResult[0].existingEndDate == '' ? '' : moment(getEmployeepath.getEmployeementPathResult[0].existingEndDate).format('YYYY-MM-DD');

        UPDATE_BTN = button.build({
            text: 'Update',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                updatePathPopupBtn()
            },
        });

        const messageHeading = document.createElement('b');
        messageHeading.classList.add('boldfont');
        messageHeading.style.marginTop = '1%';
        messageHeading.innerText = 'Path to Employment: '

        const message = document.createElement('p');
        if (employmentPath == '1')
            message.innerText = ' 1 - I have a job but would like a better one or to move up.';
        else if (employmentPath == '2')
            message.innerText = ' 2 - I want a job! I need help to find one.';
        else if (employmentPath == '3')
            message.innerText = " 3 - I'm not sure about work. I need help to learn more.";
        else if (employmentPath == '4')
            message.innerText = " 4 - I don't think I want to work, but I may not know enough.";
        else
            message.innerText = '';
        message.style.marginTop = '1%';
        message.style.marginLeft = '1%';
        var msgWrap = document.createElement('div');
        msgWrap.classList.add('employmentMsgWrap');

        msgWrap.appendChild(messageHeading);
        msgWrap.appendChild(message);

        if ($.session.EmploymentUpdate) {
            UPDATE_BTN.style.marginLeft = '1%';
            msgWrap.appendChild(UPDATE_BTN);
        }

        landingPage.appendChild(msgWrap);
        /////////////     

        EmploymentEntriesTable = await buildEmploymentEntriesTable(filterValues);
        landingPage.appendChild(EmploymentEntriesTable);
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // build the listing of Employment Entries (based off of filter settings)
    async function buildEmploymentEntriesTable(filterValues) {
        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            headline: selectedConsumersName,
            columnHeadings: ['Employer', 'Position', 'Position Start Date', 'Position End Date', 'Job Standing'],
            endIcon: false,
        };

        let EmploymentsEntries = await EmploymentAjax.getEmploymentEntriesAsync(
            selectedConsumersId,
            filterValues.employer,
            filterValues.position,
            filterValues.positionStartDate,
            filterValues.positionEndDate == null ? UTIL.getTodaysDate() : filterValues.positionEndDate,
            filterValues.jobStanding,
        );

        let tableData = EmploymentsEntries.getEmploymentEntriesResult.map((entry) => ({
            values: [entry.employer, entry.position, entry.positionStartDate == '' ? '' : moment(entry.positionStartDate).format('M/D/YYYY'), entry.positionEndDate == '' ? '' : moment(entry.positionEndDate).format('M/D/YYYY'), entry.jobStanding],
            attributes: [{ key: 'positionId', value: entry.positionId }, { key: 'PeopleName', value: entry.PeopleName }],
            onClick: (e) => {
                handleAccountTableEvents(e)
            },
        }));
        const oTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = oTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Employer
        headers[1].setAttribute('data-type', 'string'); // Position
        headers[2].setAttribute('data-type', 'date'); // Position start 
        headers[3].setAttribute('data-type', 'date'); // Position End 
        headers[4].setAttribute('data-type', 'string'); // Job Standing 


        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(oTable);

        table.populate(oTable, tableData);

        return oTable;
    }

    function handleAccountTableEvents(event) {
        var name = event.target.childNodes[0].innerText;
        var positionName = event.target.childNodes[1].innerText;
        var positionId = event.target.attributes.positionId.value;
        NewEmployment.refreshEmployment(positionId, name, positionName, selectedConsumersName, selectedConsumersId);
    }

    // build display of Account and button
    function buildHeaderButton(consumer) {
        consumerElement = document.createElement('div');
        consumerRow = document.createElement('div');
        consumerRow.classList.add('consumerHeader');
        PositionBtns = buildButtonBar(consumer);
        consumerRow.appendChild(PositionBtns);
        consumerElement.appendChild(consumerRow);
        return consumerElement;
    }

    function buildButtonBar(consumer) {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');
        buttonBar.style.maxHeight = '50px';
        buttonBar.style.minWidth = '100%';

        const newPositionBtn = button.build({
            text: '+ New Position',
            style: 'secondary',
            type: 'contained',
            classNames: 'entryBtn',
            callback: async () => {
                if (!newPositionBtn.classList.contains('disabled')) {
                    NewEmployment.refreshEmployment(positionId = undefined, '', '', selectedConsumersName, selectedConsumersId)
                }
            },
        });

        const editEmployerBtn = button.build({
            text: 'Edit Employers',
            style: 'secondary',
            type: 'contained',
            classNames: 'entryBtn',
            callback: async () => {
                if (!editEmployerBtn.classList.contains('disabled')) {
                    addEditEmployers.init();
                }
            },
        });



        // Helper function to create the main reports button on the module page
        function createMainReportButton(buttonsData) {
            return button.build({
                text: 'Reports',
                icon: 'add',
                style: 'secondary',
                type: 'contained',
                classNames: 'entryBtn',
                callback: function () {
                    // Iterate through each item in the buttonsData array
                    buttonsData.forEach(function (buttonData) {
                        buttonData.filterValues = getReportValues();
                    });

                    generateReports.showReportsPopup(buttonsData);
                },
            });
        }
        reportsBtn = createMainReportButton([{ text: 'Employee Reporting Information' }])

        if ($.session.EmploymentUpdate) {
            newPositionBtn.classList.remove('disabled');
        }
        else {
            newPositionBtn.classList.add('disabled');
        }
        newPositionBtn.style.height = '50px';

        newFilterBtn = buildNewFilterBtn();

        const entryButtonBar = document.createElement('div');
        entryButtonBar.classList.add('employmentBtnWrap');
        entryButtonBar.style.width = '100%';
        entryButtonBar.appendChild(newPositionBtn);

        if (!$.session.InsertEmployers && !$.session.UpdateEmployers) {
            editEmployerBtn.classList.add('disabled');
        }
        entryButtonBar.appendChild(editEmployerBtn);
        if ($.session.EmploymentView) {
            entryButtonBar.appendChild(reportsBtn);
        }
        buttonBar.appendChild(entryButtonBar);

        return buttonBar;
    }

    // build Filter button, which filters the data displayed on the OOD Entries Table
    function buildNewFilterBtn() {
        if (!filterValues) filterValues = {
            token: $.session.Token,
            employer: '%',
            position: '%',
            positionStartDate: '1900-01-01',
            positionEndDate: null,
            jobStanding: '%',
            EmployerID: '%',
            positionID: '%',
            jobStandingID: '%'
        }
    }

    function getReportValues() {
        return (reportValues = {
            consumerID: selectedConsumersId,
            employer: filterValues.EmployerID == undefined ? '%' : filterValues.EmployerID,
            position: filterValues.positionID == undefined ? '%' : filterValues.positionID,
            positionStartDate: filterValues.positionStartDate,
            positionEndDate: filterValues.positionEndDate == null ? UTIL.getTodaysDate() : filterValues.positionEndDate,
            jobStanding: filterValues.jobStandingID == undefined ? '%' : filterValues.jobStandingID,
        });
    }


    // build the display of the current Filter Settings (next to the Filter button) 
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.filteredByData');
        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet()
            filteredBy.appendChild(btnWrap);
        }

        filteredBy.style.maxWidth = '100%';
        if (filterValues.employer === '%' || filterValues.employer === 'ALL') {
            btnWrap.appendChild(employerBtnWrap);
            btnWrap.removeChild(employerBtnWrap);
        } else {
            btnWrap.appendChild(employerBtnWrap);
        }

        if (filterValues.position === '%' || filterValues.position === 'ALL') {
            btnWrap.appendChild(positionBtnWrap);
            btnWrap.removeChild(positionBtnWrap);
        } else {
            btnWrap.appendChild(positionBtnWrap);
        }

        if (filterValues.positionEndDate === null) {
            btnWrap.appendChild(positionEndDateBtnWrap);
            btnWrap.removeChild(positionEndDateBtnWrap);
        } else {
            btnWrap.appendChild(positionEndDateBtnWrap);
        }
        if (filterValues.jobStanding === '%' || filterValues.jobStanding === 'ALL') {
            btnWrap.appendChild(jobStandingBtnWrap);
            btnWrap.removeChild(jobStandingBtnWrap);
        } else {
            btnWrap.appendChild(jobStandingBtnWrap);
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
            callback: () => { buildFilterPopUp('ALL') },
        });

        employerBtn = button.build({
            id: 'employerBtn',
            text: 'Employer: ' + filterValues.employer,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('employerBtn') },
        });
        employerCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('employerBtn') },
        });

        positionBtn = button.build({
            id: 'positionBtn',
            text: 'Position: ' + filterValues.position,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('positionBtn') },
        });
        positionCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('positionBtn') },
        });

        positionStartDateBtn = button.build({
            id: 'positionStartDateBtn',
            text: 'Position Start Date: ' + moment(filterValues.positionStartDate, 'YYYY-MM-DD').format('MM/DD/YYYY'),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('positionStartDateBtn') },
        });

        positionEndDateBtn = button.build({
            id: 'positionEndDateBtn',
            text: 'Position End Date: ' + moment(filterValues.positionEndDate, 'YYYY-MM-DD').format('MM/DD/YYYY'),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('positionEndDateBtn') },
        });
        positionEndDateCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('positionEndDateBtn') },
        });

        jobStandingBtn = button.build({
            id: 'jobStandingBtn',
            text: 'Job Standing: ' + filterValues.jobStanding,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('jobStandingBtn') },
        });
        jobStandingCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('jobStandingBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        employerBtnWrap = document.createElement('div');
        employerBtnWrap.classList.add('filterSelectionBtnWrap');
        employerBtnWrap.appendChild(employerBtn);
        employerBtnWrap.appendChild(employerCloseBtn);
        btnWrap.appendChild(employerBtnWrap);

        positionBtnWrap = document.createElement('div');
        positionBtnWrap.classList.add('filterSelectionBtnWrap');
        positionBtnWrap.appendChild(positionBtn);
        positionBtnWrap.appendChild(positionCloseBtn);
        btnWrap.appendChild(positionBtnWrap);

        positionStartDateBtnWrap = document.createElement('div');
        positionStartDateBtnWrap.classList.add('filterSelectionBtnWrap');
        positionStartDateBtnWrap.appendChild(positionStartDateBtn);
        btnWrap.appendChild(positionStartDateBtnWrap);

        positionEndDateBtnWrap = document.createElement('div');
        positionEndDateBtnWrap.classList.add('filterSelectionBtnWrap');
        positionEndDateBtnWrap.appendChild(positionEndDateBtn);
        positionEndDateBtnWrap.appendChild(positionEndDateCloseBtn);
        btnWrap.appendChild(positionEndDateBtnWrap);

        jobStandingBtnWrap = document.createElement('div');
        jobStandingBtnWrap.classList.add('filterSelectionBtnWrap');
        jobStandingBtnWrap.appendChild(jobStandingBtn);
        jobStandingBtnWrap.appendChild(jobStandingCloseBtn);
        btnWrap.appendChild(jobStandingBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'employerBtn') {
            filterValues.employer = '%';
        }
        if (closeFilter == 'positionBtn') {
            filterValues.position = '%';
        }
        if (closeFilter == 'positionEndDateBtn') {
            filterValues.positionEndDate = null;
        }
        if (closeFilter == 'jobStandingBtn') {
            filterValues.jobStanding = '%';
        }
        loadEmploymentLanding();
    }

    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(IsShow) {
        // popup
        filterPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        // dropdowns & inputs 
        positionStartDate = input.build({
            id: 'positionStartDate',
            type: 'date',
            label: 'Position Start Date',
            style: 'secondary',
            value: filterValues.positionStartDate,
        });

        positionEndDate = input.build({
            id: 'positionEndDate',
            type: 'date',
            label: 'Position End Date',
            style: 'secondary',
            value: filterValues.positionEndDate,
        });

        positionDropdown = dropdown.build({
            id: 'positionDropdown',
            label: "Position",
            dropdownId: "positionDropdown",
        });

        jobStandingDropdown = dropdown.build({
            id: 'jobStandingDropdown',
            label: "Job Standing",
            dropdownId: "jobStandingDropdown",
        });

        EmployerDropdown = dropdown.build({
            id: 'employerDropdown',
            label: "Employer",
            dropdownId: "employerDropdown",
        });

        // apply filters button
        APPLY_BTN = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => filterPopupCancelBtn()
        });

        if (IsShow == 'ALL' || IsShow == 'employerBtn')
            filterPopup.appendChild(EmployerDropdown);
        if (IsShow == 'ALL' || IsShow == 'positionBtn')
            filterPopup.appendChild(positionDropdown);
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        var dateWrap = document.createElement('div');
        dateWrap.classList.add('dateWrap');
        if (IsShow == 'ALL' || IsShow == 'positionStartDateBtn')
            dateWrap.appendChild(positionStartDate);
        if (IsShow == 'ALL' || IsShow == 'positionEndDateBtn')
            dateWrap.appendChild(positionEndDate);

        // build popup
        filterPopup.appendChild(dateWrap);
        if (IsShow == 'ALL' || IsShow == 'jobStandingBtn')
            filterPopup.appendChild(jobStandingDropdown);
        filterPopup.appendChild(btnWrap);

        eventListeners();
        populateFilterDropdown();
        POPUP.show(filterPopup);
    }

    // binding filter events 
    function eventListeners() {

        var tmpEmployer;
        var tmpPosition;
        var tmpJobStanding;
        var tmpStartDate;
        var tmpEndDate;
        var tmpEmployerID;
        var tmppositionID;
        var tmpjobStandingID;

        positionStartDate.addEventListener('change', event => {
            tmpStartDate = event.target.value;
        });
        positionEndDate.addEventListener('change', event => {
            tmpEndDate = event.target.value;
        });
        EmployerDropdown.addEventListener('change', event => {
            tmpEmployer = event.target.value;
            tmpEmployerID = event.target.options[event.target.selectedIndex].id;
        });
        positionDropdown.addEventListener('change', event => {
            tmpPosition = event.target.value;
            tmppositionID = event.target.options[event.target.selectedIndex].id;
        });
        jobStandingDropdown.addEventListener('change', event => {
            tmpJobStanding = event.target.value;
            tmpjobStandingID = event.target.options[event.target.selectedIndex].id;
        });

        APPLY_BTN.addEventListener('click', () => {
            updateFilterData({
                tmpEmployer,
                tmpPosition,
                tmpJobStanding,
                tmpStartDate,
                tmpEndDate,
                tmpEmployerID,
                tmppositionID,
                tmpjobStandingID
            });

            POPUP.hide(filterPopup);
            eventListeners();
            loadEmploymentLanding();
        });
    }

    function updateFilterData(data) {
        if (data.tmpEmployer) filterValues.employer = data.tmpEmployer;
        if (data.tmpPosition) filterValues.position = data.tmpPosition;
        if (data.tmpJobStanding) filterValues.jobStanding = data.tmpJobStanding;
        if (data.tmpStartDate) filterValues.positionStartDate = data.tmpStartDate;
        if (data.tmpEndDate) filterValues.positionEndDate = data.tmpEndDate;
        if (data.tmpEndDate == '') filterValues.positionEndDate = null;
        if (data.tmpStartDate == '') filterValues.positionStartDate = '1900-01-01';

        if (data.tmpEmployerID) filterValues.EmployerID = data.tmpEmployerID;
        if (data.tmppositionID) filterValues.positionID = data.tmppositionID;
        if (data.tmpjobStandingID) filterValues.jobStandingID = data.tmpjobStandingID;
    }

    async function populateFilterDropdown() {
        const {
            getPositionsResult: Positions,
        } = await EmploymentAjax.getPositionsAsync();
        let positionsData = Positions.map((positions) => ({
            id: positions.positionId,
            value: positions.positionName,
            text: positions.positionName
        }));
        positionsData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("positionDropdown", positionsData, filterValues.position);

        const {
            getEmployersResult: Employer,
        } = await EmploymentAjax.getEmployersAsync();
        let data = Employer.map((employer) => ({
            id: employer.employerId,
            value: employer.employerName,
            text: employer.employerName
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("employerDropdown", data, filterValues.employer);

        const {
            getJobStandingsResult: JobStanding,
        } = await EmploymentAjax.getJobStandingsAsync();
        let jobStandingData = JobStanding.map((jobStanding) => ({
            id: jobStanding.jobStandingId,
            value: jobStanding.jobStandingName,
            text: jobStanding.jobStandingName
        }));
        jobStandingData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("jobStandingDropdown", jobStandingData, filterValues.jobStanding);
    }

    function filterPopupCancelBtn() {
        POPUP.hide(filterPopup);
    }

    function updatePathPopupBtn() {
        employmentPath = '';
        currentEndDate = existingEndDate;
        newStartDate = '';
        newEndDate = '';

        updatePathPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '20px';
        heading.innerText = 'Update Path to Employment';

        // dropdowns & inputs
        currentPathEndDate = input.build({
            id: 'currentPathEndDate',
            type: 'date',
            label: 'Current Path End Date',
            style: 'secondary',
            value: currentEndDate,
        });

        newPathEmploymentDropdown = dropdown.build({
            id: 'newPathEmploymentDropdown',
            label: "New Path to Employment",
            dropdownId: "newPathEmploymentDropdown",
        });

        newPathStartDate = input.build({
            id: 'newPathStartDate',
            type: 'date',
            label: 'New Path Start Date',
            style: 'secondary',
            value: newStartDate,
        });

        newPathEndDate = input.build({
            id: 'newPathEndDate',
            type: 'date',
            label: 'New Path End Date',
            style: 'secondary',
            value: newEndDate,
        });

        APPLY_BTN = button.build({
            text: 'APPLY',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                if (!APPLY_BTN.classList.contains('disabled')) {
                    APPLY_BTN.classList.add('disabled');
                    saveNewPathPopup();
                }
            }
        });

        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        updatePathPopup.appendChild(heading);
        updatePathPopup.appendChild(currentPathEndDate);

        updatePathPopup.appendChild(newPathEmploymentDropdown);
        updatePathPopup.appendChild(newPathStartDate);
        updatePathPopup.appendChild(newPathEndDate);

        var confirmMessage = document.createElement('div');
        confirmMessage.innerHTML = `<h3 id="confirmMessage" class="confirmMessage password-warning"></h3>`;
        updatePathPopup.appendChild(confirmMessage);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(APPLY_BTN);
        popupbtnWrap.appendChild(CANCEL_BTN);
        updatePathPopup.appendChild(popupbtnWrap);

        POPUP.show(updatePathPopup);
        PopupEventListeners();
        populateNewPathEmploymentDropdown('updatePath');
        checkRequiredFieldsOfEmploymentPath();
    }

    function PopupEventListeners() {
        newPathEmploymentDropdown.addEventListener('change', event => {
            employmentPath = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });

        newPathStartDate.addEventListener('input', event => {
            newStartDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });
        newPathEndDate.addEventListener('input', event => {
            newEndDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });
        currentPathEndDate.addEventListener('input', event => {
            currentEndDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(updatePathPopup);
        });
    }

    function checkRequiredFieldsOfEmploymentPath() {
        var newPathEmployment = newPathEmploymentDropdown.querySelector('#newPathEmploymentDropdown');
        var newStartDate = newPathStartDate.querySelector('#newPathStartDate');
        var newEndDate = newPathEndDate.querySelector('#newPathEndDate');
        var CurrentEndDate = currentPathEndDate.querySelector('#currentPathEndDate');

        if (newPathEmployment.value === '') {
            newPathEmploymentDropdown.classList.add('errorPopup');
        } else {
            newPathEmploymentDropdown.classList.remove('errorPopup');
        }

        if (CurrentEndDate.value === '' || CurrentEndDate.value < existingStartDate) {
            currentPathEndDate.classList.add('errorPopup');
        } else {
            currentPathEndDate.classList.remove('errorPopup');
        }

        if (newStartDate.value === '' || CurrentEndDate.value > newStartDate.value || (newEndDate.value != '' && newStartDate.value > newEndDate.value)) {
            newPathStartDate.classList.add('errorPopup');
        } else {
            newPathStartDate.classList.remove('errorPopup');
        }

        setBtnStatusOfEmploymentPath();
    }

    function setBtnStatusOfEmploymentPath() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            APPLY_BTN.classList.add('disabled');
            return;
        } else {
            APPLY_BTN.classList.remove('disabled');
        }
    }

    function populateNewPathEmploymentDropdown(pathName) {
        const condfidentialDropdownData = ([
            { id: 1, value: 1, text: "1 - I have a job but would like a better one or to move up." },
            { id: 2, value: 2, text: "2 - I want a job! I need help to find one." },
            { id: 3, value: 3, text: "3 - I'm not sure about work. I need help to learn more." },
            { id: 4, value: 4, text: "4 - I don't think I want to work, but I may not know enough." },
        ]);
        condfidentialDropdownData.unshift({ id: null, value: '', text: '' });
        if (pathName == 'updatePath')
            dropdown.populate("newPathEmploymentDropdown", condfidentialDropdownData, employmentPath);
        else
            dropdown.populate("pathToEmploymentDropdown", condfidentialDropdownData, pathToEmployment);
    }

    async function saveNewPathPopup() {
        const result = await EmploymentAjax.insertEmploymentPathAsync(employmentPath, newStartDate, newEndDate, currentEndDate, ConsumersId, $.session.UserId, existingPathID);
        const { insertEmploymentPathResult } = result;
        var messagetext = document.getElementById('confirmMessage');
        
        messagetext.innerHTML = ``;
        if (insertEmploymentPathResult.pathId == '-1') {
            messagetext.innerHTML = 'This record overlaps with an existing record. Changes cannot be saved.';
            messagetext.classList.add('password-error');
        }
        else {
            POPUP.hide(updatePathPopup);
            loadEmploymentLanding();
        }
    }

    function createEmploymentPathPopupBtn() {
        pathToStartDate = '';
        pathToEmployment = '';
        currentStatus = '';

        createPathPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        // dropdowns & inputs
        currentStatusDropdown = dropdown.build({
            id: 'currentStatusDropdown',
            label: "Current Status",
            dropdownId: "currentStatusDropdown",
        });

        pathToEmploymentDropdown = dropdown.build({
            id: 'pathToEmploymentDropdown',
            label: "Path to Employment",
            dropdownId: "pathToEmploymentDropdown",
        });

        pathToEmploymentStartDate = input.build({
            id: 'pathToEmploymentStartDate',
            type: 'date',
            label: 'Path to Employment Start Date',
            style: 'secondary',
        });

        CONTINUE_BTN = button.build({
            text: 'continue',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                if (!CONTINUE_BTN.classList.contains('disabled')) {
                    CONTINUE_BTN.classList.add('disabled');
                    createNewPath();
                }
            }
        });

        CREATE_PATH_CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        createPathPopup.appendChild(currentStatusDropdown);
        createPathPopup.appendChild(pathToEmploymentDropdown);
        createPathPopup.appendChild(pathToEmploymentStartDate);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(CREATE_PATH_CANCEL_BTN);
        popupbtnWrap.appendChild(CONTINUE_BTN);
        createPathPopup.appendChild(popupbtnWrap);

        POPUP.show(createPathPopup);
        pathToEmploymentStartDate.classList.add('disabled');
        createEmploymentPathPopupEventListeners();
        populateNewPathEmploymentDropdown('createPath');
        populateEmploymentStatusDropdowns();
        checkRequiredFieldsOfCreateEmploymentPath();
    }

    function createEmploymentPathPopupEventListeners() {
        currentStatusDropdown.addEventListener('change', event => {
            currentStatus = event.target.value;
            checkRequiredFieldsOfCreateEmploymentPath();
        });
        pathToEmploymentDropdown.addEventListener('change', event => {
            pathToEmployment = event.target.value;
            if (pathToEmployment == '') {
                pathToEmploymentStartDate.classList.add('disabled');
                pathToStartDate = '';
                document.getElementById('pathToEmploymentStartDate').value = '';
            }
            else {
                pathToEmploymentStartDate.classList.remove('disabled');
            }
            checkRequiredFieldsOfCreateEmploymentPath();
        });

        pathToEmploymentStartDate.addEventListener('input', event => {
            if (pathToEmployment != '') {
                pathToStartDate = event.target.value;
            }
            else {
                document.getElementById('pathToEmploymentStartDate').value = '';
                pathToStartDate = '';
            }
            checkRequiredFieldsOfCreateEmploymentPath();
        });

        CREATE_PATH_CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(createPathPopup);
            loadEmploymentLanding();
        });
    }

    function checkRequiredFieldsOfCreateEmploymentPath() {
        var currentSts = currentStatusDropdown.querySelector('#currentStatusDropdown');
        var pathToEmp = pathToEmploymentDropdown.querySelector('#pathToEmploymentDropdown');
        var pathStartDt = pathToEmploymentStartDate.querySelector('#pathToEmploymentStartDate');

        if (currentSts.value === '') {
            currentStatusDropdown.classList.add('errorPopup');
        } else {
            currentStatusDropdown.classList.remove('errorPopup');
        }

        if (pathToEmp.value != '' && pathStartDt.value === '') {
            pathToEmploymentStartDate.classList.add('errorPopup');
        } else {
            pathToEmploymentStartDate.classList.remove('errorPopup');
        }

        setBtnStatusOfCreateEmploymentPath();
    }

    function setBtnStatusOfCreateEmploymentPath() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            CONTINUE_BTN.classList.add('disabled');
            return;
        } else {
            CONTINUE_BTN.classList.remove('disabled');
        }
    }

    async function populateEmploymentStatusDropdowns() {
        const {
            getEmployeeStatusDropDownResult: EmpStatus,
        } = await EmploymentAjax.getEmployeeStatusDropDownAsync();
        let empStatus = EmpStatus.map((empStatus) => ({
            id: empStatus.empStatusId,
            value: empStatus.empStatusId,
            text: empStatus.empStatusName
        }));
        empStatus.unshift({ id: null, value: '', text: '' });
        dropdown.populate("currentStatusDropdown", empStatus, currentStatus);
    }

    async function createNewPath() {
        const result = await EmploymentAjax.createNewEmploymentPathAsync(currentStatus, pathToEmployment, pathToStartDate, ConsumersId, $.session.UserId);
        const { createNewEmploymentPathResult } = result;
        POPUP.hide(createPathPopup);
        loadEmploymentLanding();
    }

    function init() {
        setActiveModuleAttribute('Employment');
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        init,
        handleActionNavEvent,
        loadEmploymentLanding,
    };
})(); 
