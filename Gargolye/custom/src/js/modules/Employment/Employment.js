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

        const entryButtonBar = document.createElement('div');
        entryButtonBar.style.width = '49%';

        const newPositionBtn = button.build({
            text: '+ New Position',
            style: 'secondary',
            type: 'contained',
            classNames: 'newEntryBtn',
            callback: async () => { NewEmployment.refreshEmployment(positionId = undefined, '', '', selectedConsumersName, selectedConsumersId) },
        });
        if ($.session.EmploymentUpdate ) {
            newPositionBtn.classList.remove('disabled');
        }
        else {
            newPositionBtn.classList.add('disabled');
        }
        newPositionBtn.style.height = '50px';
        newPositionBtn.style.minWidth = '100%';

        newFilterBtn = buildNewFilterBtn();
        entryButtonBar.appendChild(newPositionBtn);

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
        }
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

        positionStartDate.addEventListener('change', event => {
            tmpStartDate = event.target.value;
        });
        positionEndDate.addEventListener('change', event => {
            tmpEndDate = event.target.value;
        });
        EmployerDropdown.addEventListener('change', event => {
            tmpEmployer = event.target.value;
        });
        positionDropdown.addEventListener('change', event => {
            tmpPosition = event.target.value;
        });
        jobStandingDropdown.addEventListener('change', event => {
            tmpJobStanding = event.target.value;
        });

        APPLY_BTN.addEventListener('click', () => {
            updateFilterData({
                tmpEmployer,
                tmpPosition,
                tmpJobStanding,
                tmpStartDate,
                tmpEndDate
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
