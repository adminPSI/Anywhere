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
    let isNewPositionEnable;
    //filter
    let filterValues;

    //service filter options
    let selectedConsumerIds;

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
        var LineBr = document.createElement('br');

        selectedConsumersId = selectedConsumers[0].id;
        $.session.consumerId = selectedConsumersId;
        const name = (
            await ConsumerFinancesAjax.getConsumerNameByID({ 
                token: $.session.Token,
                consumerId: selectedConsumersId,
            })
        ).getConsumerNameByIDResult;

        const result = await EmploymentAjax.isNewPositionEnableAsync(selectedConsumersId);
        const { isNewPositionEnableResult } = result;

        if (isNewPositionEnableResult[0].IsEmployeeEnable == '0') {
            isNewPositionEnable = false;
        }
        else {
            isNewPositionEnable = true;
        }

        selectedConsumersName = name[0].FullName;
        const topButton = buildHeaderButton(selectedConsumers[0]);
        landingPage.appendChild(topButton);
        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        const filteredBy = buildFilteredBy();
        filterRow.appendChild(filteredBy);

        landingPage.appendChild(LineBr);
        landingPage.appendChild(LineBr);
        landingPage.appendChild(filterRow);
        landingPage.appendChild(LineBr);
        EmploymentEntriesTable = await buildEmploymentEntriesTable(filterValues);
        landingPage.appendChild(EmploymentEntriesTable);
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // build the listing of Employment Entries (based off of filter settings)
    async function buildEmploymentEntriesTable(filterValues) {
        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            headline: 'Consumer: ' + selectedConsumersName,
            columnHeadings: ['Employer', 'Position', 'Position Start Date', 'Position End Date', 'Job Standing'],
            endIcon: $.session.OODView == true ? true : false,
        };

        selectedConsumerIds = selectedConsumers.map(function (x) { return x.id });

        let EmploymentsEntries = await EmploymentAjax.getEmploymentEntriesAsync(
            selectedConsumerIds.join(", "),
            filterValues.employer,
            filterValues.position,
            filterValues.positionStartDate,
            filterValues.positionEndDate == null ? UTIL.getTodaysDate() : filterValues.positionEndDate,
            filterValues.jobStanding,
        );

        const additionalInformation = newODDEntryBtn();
        additionalInformation.innerHTML = '+ NEW ODD ENTRY';
        additionalInformation.style = 'margin-top: -10px; width: 200px;';

        let tableData = EmploymentsEntries.getEmploymentEntriesResult.map((entry) => ({
            values: [entry.employer, entry.position, entry.positionStartDate == '' ? '' : moment(entry.positionStartDate).format('M/D/YYYY'), entry.positionEndDate == '' ? '' : moment(entry.positionEndDate).format('M/D/YYYY'), entry.jobStanding],
            attributes: [{ key: 'positionId', value: entry.positionId }, { key: 'PeopleName', value: entry.PeopleName }],
            onClick: (e) => {
                handleAccountTableEvents(e)
            },
            endIcon: $.session.OODView == true ? additionalInformation.outerHTML : '',
            endIconCallback: e => {
                // TODO
                //buildChangePasswordPopup(userID, FirstName, LastName); 
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

    function newODDEntryBtn() {
        return button.build({
            text: '+ NEW ODD ENTRY',
            style: 'secondary',
            type: 'contained',
        });
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

    // build display of "Entry" Buttons -- "New Entry" and "New Monthly Summary"
    function buildButtonBar(consumer) {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');
        buttonBar.style.maxHeight = '50px';
        buttonBar.style.minWidth = '100%';

        const entryButtonBar = document.createElement('div');
        const filterButtonBar = document.createElement('div');

        entryButtonBar.style.width = '49%';
        filterButtonBar.style.width = '49%';


        const newPositionBtn = button.build({
            text: '+ New Position',
            style: 'secondary',
            type: 'contained',
            classNames: 'newEntryBtn',
            callback: async () => { NewEmployment.refreshEmployment(positionId = undefined, '', '', selectedConsumersName, selectedConsumersId) },
        });
        if ($.session.EmploymentUpdate && isNewPositionEnable) {
            newPositionBtn.classList.remove('disabled');
        }
        else {
            newPositionBtn.classList.add('disabled');
        }
        newPositionBtn.style.height = '50px';
        newPositionBtn.style.minWidth = '100%';

        newFilterBtn = buildNewFilterBtn();
        newFilterBtn.style.height = '50px';
        newFilterBtn.style.minWidth = '100%';
        entryButtonBar.appendChild(newPositionBtn);
        filterButtonBar.appendChild(newFilterBtn);

        filterButtonBar.style.marginLeft = '2%';

        buttonBar.appendChild(entryButtonBar);
        buttonBar.appendChild(filterButtonBar);
        return buttonBar;
    }

    // build Filter button, which filters the data displayed on the OOD Entries Table
    function buildNewFilterBtn() {
        if (!filterValues) filterValues = {
            token: $.session.Token,
            employer: '%',
            position: '%',
            positionStartDate: '1900-01-01', // UTIL.formatDateFromDateObj(dates.subDays(new Date('1/1/1990'))),  
            positionEndDate: null,// UTIL.getTodaysDate(),           
            jobStanding: '%',
        }

        return button.build({
            text: 'Filter',
            style: 'secondary',
            type: 'contained',
            callback: () => buildFilterPopUp(filterValues)
        });
    }


    // build the display of the current Filter Settings (next to the Filter button) 
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
        }

        filteredBy.style.maxWidth = '100%';
        const startDate = moment(filterValues.positionStartDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const endDate = filterValues.positionEndDate == null ? 'none' : moment(filterValues.positionEndDate, 'YYYY-MM-DD').format('MM/DD/YYYY');

        filteredBy.innerHTML = `<div class="filteredByData">
			<p>                         
                <span>Employer:</span> ${(filterValues.employer == '%') ? 'ALL' : filterValues.employer}&nbsp;&nbsp;
			    <span>Position:</span> ${(filterValues.position == '%') ? 'ALL' : filterValues.position}&nbsp;&nbsp;
                <span>Position Start Date:</span> ${startDate}&nbsp;&nbsp;
			    <span> Position End Date:</span> ${endDate}&nbsp;&nbsp;   
			    <span>Job Standing:</span> ${(filterValues.jobStanding == '%') ? 'ALL' : filterValues.jobStanding}                
            </p>
		  </div>`;

        return filteredBy;
    }

    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(filterValues) {
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
        positionStartDate.style.width = '170px';
        positionEndDate.style.width = '170px';
        positionEndDate.style.marginLeft = '12px';

        filterPopup.appendChild(EmployerDropdown);
        filterPopup.appendChild(positionDropdown);
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        var dateWrap = document.createElement('div');
        dateWrap.classList.add('dropdownWrap');
        dateWrap.appendChild(positionStartDate);
        dateWrap.appendChild(positionEndDate);

        // build popup
        filterPopup.appendChild(dateWrap);
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
