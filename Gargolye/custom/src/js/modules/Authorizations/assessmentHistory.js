const assessmentHistory = (() => {
    //Inputs
    let newFilterBtn;
    let filterRow;
    let assessmentEntriesTable = [];
    let filterBtns;
    let consumerRow;
    let consumerElement;
    let filterPopup;
    var selectedConsumers;
    var selectedConsumersName;
    var selectedConsumersId;
    //filter
    let filterValues;

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
                filterValues = undefined;
                await loadAssessmentHistoryLanding();
                DOM.toggleNavLayout();
                break;
            }
            case 'miniRosterCancel': {
                DOM.toggleNavLayout();
                authorizationLanding.load();
                break;
            }
        }
    }

    // Build AssessmentHistory Module Landing Page 
    async function loadAssessmentHistoryLanding() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();

        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

        landingPage = document.createElement('div');
        var LineBr = document.createElement('br');

        selectedConsumersId = selectedConsumers[0].id;
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

        landingPage.appendChild(LineBr);
        landingPage.appendChild(LineBr);
        landingPage.appendChild(filterRow);
        landingPage.appendChild(LineBr);
        assessmentEntriesTable = await buildAssessmentEntriesTable(filterValues);
        landingPage.appendChild(assessmentEntriesTable);
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // build the listing of Assessment Entries (based off of filter settings)
    async function buildAssessmentEntriesTable(filterValues) {
        const tableOptions = {
            plain: false,
            tableId: 'assessmentHistoryTable',
            headline: 'Consumer: ' + selectedConsumersName,
            columnHeadings: ['Start Date', 'End Date', 'Methodology', 'Score', 'Behavior Mod?', 'Medical Mod?', 'DC Mod?', 'CC Mod?', 'Prior Auth Applied', 'Prior Auth Received', 'Prior Auth Amount'],
            endIcon: false,
        };

        let assessmentEntries = await authorizationsAjax.getAssessmentEntriesAsync(
            selectedConsumersId,
            filterValues.methodology,
            filterValues.score,
            filterValues.startDateFrom,
            filterValues.startDateTo,
            filterValues.endDateFrom,
            filterValues.endDateTo,
            filterValues.priorAuthApplFrom,
            filterValues.priorAuthApplTo,
            filterValues.priorAuthRecFrom,
            filterValues.priorAuthRecTo,
            filterValues.priorAuthAmtFrom,
            filterValues.priorAuthAmtTo,
        );

        let tableData = assessmentEntries.getAssessmentEntriesResult.map((entry) => ({
            values: [entry.startDate == '' ? '' : moment(entry.startDate).format('MM/DD/YYYY'), entry.endDate == '' ? '' : moment(entry.endDate).format('MM/DD/YYYY'),
            entry.methodology, entry.score, entry.behaviorMod, entry.medicalMod, entry.DCMod, entry.CCMod, entry.priorAuthApplied == '' ? '' : moment(entry.priorAuthApplied).format('MM/DD/YYYY'),
                entry.priorAuthReceived == '' ? '' : moment(entry.priorAuthReceived).format('MM/DD/YYYY'), entry.priorAuthAmount == '' ? '' : '$' + numberWithCommas(entry.priorAuthAmount)], 
            attributes: [{ key: 'Id', value: entry.ID }],
            onClick: (e) => {
            },

        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function buildHeaderButton(consumer) {
        consumerElement = document.createElement('div');
        consumerRow = document.createElement('div');
        consumerRow.classList.add('consumerHeader');
        filterBtns = buildButtonBar(consumer);
        consumerRow.appendChild(filterBtns);
        consumerElement.appendChild(consumerRow);
        return consumerElement;
    }

    function buildButtonBar(consumer) {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');
        buttonBar.style.maxHeight = '50px';
        buttonBar.style.minWidth = '100%';

        const filterButtonBar = document.createElement('div');

        newFilterBtn = buildNewFilterBtn();
        newFilterBtn.style.height = '50px';
        newFilterBtn.style.minWidth = '100%';
        filterButtonBar.appendChild(newFilterBtn);
        buttonBar.appendChild(filterButtonBar);
        return buttonBar;
    }

    // build Filter button, which filters the data displayed on the Assessment History Entries Table
    function buildNewFilterBtn() {
        if (!filterValues) filterValues = {
            token: $.session.Token,
            methodology: '%',
            score: '%',
            startDateFrom: UTIL.formatDateFromDateObj(dates.subDays(new Date(), 730)),
            startDateTo: '%',
            endDateFrom: '%',
            endDateTo: '%',
            priorAuthApplFrom: '%',
            priorAuthApplTo: '%',
            priorAuthRecFrom: '%',
            priorAuthRecTo: '%',
            priorAuthAmtFrom: '',
            priorAuthAmtTo: '',
            methodologyValues: '%',
            scoreValues: '%',
        }

        return button.build({
            text: 'Filter',
            icon: 'filter',
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
        const startDateFrom = filterValues.startDateFrom == '%' ? 'ALL' : moment(filterValues.startDateFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const startDateTo = filterValues.startDateTo == '%' ? 'ALL' : moment(filterValues.startDateTo, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const endDateFrom = filterValues.endDateFrom == '%' ? 'ALL' : moment(filterValues.endDateFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const endDateTo = filterValues.endDateTo == '%' ? 'ALL' : moment(filterValues.endDateTo, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const priorAuthApplFrom = filterValues.priorAuthApplFrom == '%' ? 'ALL' : moment(filterValues.priorAuthApplFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const priorAuthApplTo = filterValues.priorAuthApplTo == '%' ? 'ALL' : moment(filterValues.priorAuthApplTo, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const priorAuthRecFrom = filterValues.priorAuthRecFrom == '%' ? 'ALL' : moment(filterValues.priorAuthRecFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const priorAuthRecTo = filterValues.priorAuthRecTo == '%' ? 'ALL' : moment(filterValues.priorAuthRecTo, 'YYYY-MM-DD').format('MM/DD/YYYY');

        filteredBy.innerHTML = `<div class="filteredByData"> 
			<p>                         
                <span>Methodology:</span> ${(filterValues.methodologyValues == '%') ? 'ALL' : filterValues.methodologyValues}&nbsp;&nbsp;
			    <span>Score:</span> ${(filterValues.scoreValues == '%') ? 'ALL' : filterValues.scoreValues}&nbsp;&nbsp;
                <span>Start Date:</span> ${(startDateFrom == 'ALL' && startDateTo == 'ALL') ? 'ALL' : startDateFrom + '-' + startDateTo}&nbsp;&nbsp;
                <span>End Date:</span> ${(endDateFrom == 'ALL' && endDateTo == 'ALL') ? 'ALL' : endDateFrom + '-' + endDateTo} &nbsp;&nbsp;
                <span>Prior Auth Applied:</span> ${(priorAuthApplFrom == 'ALL' && priorAuthApplTo == 'ALL') ? 'ALL' : priorAuthApplFrom + '-' + priorAuthApplTo} &nbsp;&nbsp;
                <span>Prior Auth Received:</span> ${(priorAuthRecFrom == 'ALL' && priorAuthRecTo == 'ALL') ? 'ALL' : priorAuthRecFrom + '-' + priorAuthRecTo} &nbsp;&nbsp;
                <span>Prior Auth Amount From:</span> ${(filterValues.priorAuthAmtFrom == '') ? 'ALL' : filterValues.priorAuthAmtFrom} &nbsp;&nbsp;
                <span>Prior Auth Amount To:</span> ${(filterValues.priorAuthAmtTo == '') ? 'ALL' : filterValues.priorAuthAmtTo} &nbsp;&nbsp;
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
        methodologyDropdown = dropdown.build({
            id: 'methodologyDropdown',
            label: "Methodology",
            dropdownId: "methodologyDropdown",
        });

        scoreDropdown = dropdown.build({
            id: 'scoreDropdown',
            label: "Score",
            dropdownId: "scoreDropdown",
        });

        startDateFrom = input.build({
            id: 'startDateFrom',
            type: 'date',
            label: 'Start Date From',
            style: 'secondary',
            value: filterValues.startDateFrom,
        });

        startDateTo = input.build({
            id: 'startDateTo',
            type: 'date',
            label: 'Start Date To',
            style: 'secondary',
            value: filterValues.startDateTo,
        });

        endDateFrom = input.build({
            id: 'endDateFrom',
            type: 'date',
            label: 'End Date From',
            style: 'secondary',
            value: filterValues.endDateFrom,
        });

        endDateTo = input.build({
            id: 'endDateTo',
            type: 'date',
            label: 'End Date To',
            style: 'secondary',
            value: filterValues.endDateTo,
        });

        priorAuthApplFrom = input.build({
            id: 'priorAuthApplFrom',
            type: 'date',
            label: 'Prior Auth Appl From',
            style: 'secondary',
            value: filterValues.priorAuthApplFrom,
        });

        priorAuthApplTo = input.build({
            id: 'priorAuthApplTo',
            type: 'date',
            label: 'Prior Auth Appl To',
            style: 'secondary',
            value: filterValues.priorAuthApplTo,
        });

        priorAuthRecFrom = input.build({
            id: 'priorAuthRecFrom',
            type: 'date',
            label: 'Prior Auth Rec From',
            style: 'secondary',
            value: filterValues.priorAuthRecFrom,
        });

        priorAuthRecTo = input.build({
            id: 'priorAuthRecTo',
            type: 'date',
            label: 'Prior Auth Rec To',
            style: 'secondary',
            value: filterValues.priorAuthRecTo,
        });

        priorAuthAmtFrom = input.build({
            id: 'priorAuthAmtFrom',
            type: 'text',
            label: 'Prior Auth Amt from',
            style: 'secondary',
            value: '$' + ((filterValues.priorAuthAmtFrom) ? filterValues.priorAuthAmtFrom : ''),
        });

        priorAuthAmtTo = input.build({
            id: 'priorAuthAmtTo',
            type: 'text',
            label: 'Prior Auth Amt To',
            style: 'secondary',
            value: '$' + ((filterValues.priorAuthAmtTo) ? filterValues.priorAuthAmtTo : ''),
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

        var startDateWrap = document.createElement('div');
        startDateWrap.classList.add('dateWrap');
        startDateWrap.appendChild(startDateFrom);
        startDateWrap.appendChild(startDateTo);

        var endDateWrap = document.createElement('div');
        endDateWrap.classList.add('dateWrap');
        endDateWrap.appendChild(endDateFrom);
        endDateWrap.appendChild(endDateTo);

        var applDateWrap = document.createElement('div');
        applDateWrap.classList.add('dateWrap');
        applDateWrap.appendChild(priorAuthApplFrom);
        applDateWrap.appendChild(priorAuthApplTo);

        var recDateWrap = document.createElement('div');
        recDateWrap.classList.add('dateWrap');
        recDateWrap.appendChild(priorAuthRecFrom);
        recDateWrap.appendChild(priorAuthRecTo);

        var amtWrap = document.createElement('div');
        amtWrap.classList.add('dateWrap');
        amtWrap.appendChild(priorAuthAmtFrom);
        amtWrap.appendChild(priorAuthAmtTo);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        filterPopup.appendChild(methodologyDropdown);
        filterPopup.appendChild(scoreDropdown);
        filterPopup.appendChild(startDateWrap);
        filterPopup.appendChild(endDateWrap);
        filterPopup.appendChild(applDateWrap);
        filterPopup.appendChild(recDateWrap);
        filterPopup.appendChild(amtWrap);
        filterPopup.appendChild(btnWrap);

        POPUP.show(filterPopup);
        eventListeners();
        populateFilterDropdown();
        checkRequiredFieldsOfFilter();
    }

    // binding filter events 
    function eventListeners() {
        var tmpMethodology;
        var tmpScore;
        var tmpStartDateFrom;
        var tmpStartDateTo;
        var tmpEndDateFrom;
        var tmpEndDateTo;
        var tmpPriorAuthApplFrom;
        var tmpPriorAuthApplTo;
        var tmpPriorAuthRecFrom;
        var tmpPriorAuthRecTo;
        var tmpPriorAuthAmtFrom;
        var tmpPriorAuthAmtTo;

        methodologyDropdown.addEventListener('change', event => {
            tmpMethodology = event.target.value;
            filterValues.methodologyValues = event.target.options[event.target.selectedIndex].innerHTML;
            populateScoreDropdown(tmpMethodology)
        });
        scoreDropdown.addEventListener('change', event => {
            tmpScore = event.target.value;
            filterValues.scoreValues = event.target.options[event.target.selectedIndex].innerHTML;
        });

        startDateFrom.addEventListener('change', event => {
            tmpStartDateFrom = event.target.value;
            checkRequiredFieldsOfFilter();
        });
        startDateTo.addEventListener('change', event => {
            tmpStartDateTo = event.target.value;
            checkRequiredFieldsOfFilter();
        });

        endDateFrom.addEventListener('change', event => {
            tmpEndDateFrom = event.target.value;
            checkRequiredFieldsOfFilter();
        });
        endDateTo.addEventListener('change', event => {
            tmpEndDateTo = event.target.value;
            checkRequiredFieldsOfFilter();
        });

        priorAuthApplFrom.addEventListener('change', event => {
            tmpPriorAuthApplFrom = event.target.value;
            checkRequiredFieldsOfFilter();
        });
        priorAuthApplTo.addEventListener('change', event => {
            tmpPriorAuthApplTo = event.target.value;
            checkRequiredFieldsOfFilter();
        });

        priorAuthRecFrom.addEventListener('change', event => {
            tmpPriorAuthRecFrom = event.target.value;
            checkRequiredFieldsOfFilter();
        });
        priorAuthRecTo.addEventListener('change', event => {
            tmpPriorAuthRecTo = event.target.value;
            checkRequiredFieldsOfFilter();
        });

        priorAuthAmtFrom.addEventListener('input', event => {
            minAmount = event.target.value;
            tmpPriorAuthAmtFrom = minAmount.replace('$', '');
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(minAmount)) {
                document.getElementById('priorAuthAmtFrom').value = minAmount.substring(0, minAmount.length - 1);
                return;
            }
            else if (minAmount.includes('.') && (minAmount.match(/\./g).length > 1 || minAmount.toString().split('.')[1].length > 2)) {
                document.getElementById('priorAuthAmtFrom').value = minAmount.substring(0, minAmount.length - 1);
                return;
            }            
            checkRequiredFieldsOfFilter();
        });

        priorAuthAmtTo.addEventListener('input', event => {
            maxAmount = event.target.value;
            tmpPriorAuthAmtTo = maxAmount.replace('$', '');
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(maxAmount)) {
                document.getElementById('priorAuthAmtTo').value = maxAmount.substring(0, maxAmount.length - 1);
                return;
            }
            else if (maxAmount.includes('.') && (maxAmount.match(/\./g).length > 1 || maxAmount.toString().split('.')[1].length > 2)) {
                document.getElementById('priorAuthAmtTo').value = maxAmount.substring(0, maxAmount.length - 1);
                return;
            }           
            checkRequiredFieldsOfFilter();
        });


        APPLY_BTN.addEventListener('click', () => {
            updateFilterData({
                tmpMethodology,
                tmpScore,
                tmpStartDateFrom,
                tmpStartDateTo,
                tmpEndDateFrom,
                tmpEndDateTo,
                tmpPriorAuthApplFrom,
                tmpPriorAuthApplTo,
                tmpPriorAuthRecFrom,
                tmpPriorAuthRecTo,
                tmpPriorAuthAmtFrom,
                tmpPriorAuthAmtTo
            });

            POPUP.hide(filterPopup);
            loadAssessmentHistoryLanding();
        });
    }

    function checkRequiredFieldsOfFilter() {

        var newStartDateFrom = startDateFrom.querySelector('#startDateFrom');
        var newStartDateTo = startDateTo.querySelector('#startDateTo');
        var newEndDateFrom = endDateFrom.querySelector('#endDateFrom');
        var newEndDateTo = endDateTo.querySelector('#endDateTo');
        var newPriorAuthApplFrom = priorAuthApplFrom.querySelector('#priorAuthApplFrom');
        var newPriorAuthApplTo = priorAuthApplTo.querySelector('#priorAuthApplTo');
        var newPriorAuthRecFrom = priorAuthRecFrom.querySelector('#priorAuthRecFrom');
        var newPriorAuthRecTo = priorAuthRecTo.querySelector('#priorAuthRecTo');
        var newPriorAuthAmtFrom = parseInt(priorAuthAmtFrom.querySelector('#priorAuthAmtFrom').value.replace('$', ''));
        var newPriorAuthAmtTo = parseInt(priorAuthAmtTo.querySelector('#priorAuthAmtTo').value.replace('$', ''));

        if (newStartDateTo.value != '' && newStartDateFrom.value > newStartDateTo.value) {
            startDateTo.classList.add('errorPopup');
        } else {
            startDateTo.classList.remove('errorPopup');
        }

        if (newEndDateTo.value != '' && newEndDateFrom.value > newEndDateTo.value) {
            endDateTo.classList.add('errorPopup');
        } else {
            endDateTo.classList.remove('errorPopup');
        }

        if (newPriorAuthApplTo.value != '' && newPriorAuthApplFrom.value > newPriorAuthApplTo.value) {
            priorAuthApplTo.classList.add('errorPopup');
        } else {
            priorAuthApplTo.classList.remove('errorPopup');
        }

        if (newPriorAuthRecTo.value != '' && newPriorAuthRecFrom.value > newPriorAuthRecTo.value) {
            priorAuthRecTo.classList.add('errorPopup');
        } else {
            priorAuthRecTo.classList.remove('errorPopup');
        }

        if (newPriorAuthAmtTo != '' && newPriorAuthAmtFrom > newPriorAuthAmtTo) {
            priorAuthAmtTo.classList.add('errorPopup');
        } else {
            priorAuthAmtTo.classList.remove('errorPopup');
        }

        setBtnStatusOfFilter();
    }

    function setBtnStatusOfFilter() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            APPLY_BTN.classList.add('disabled');
            return;
        } else {
            APPLY_BTN.classList.remove('disabled');
        }
    }

    function updateFilterData(data) { 
        if (data.tmpMethodology) filterValues.methodology = data.tmpMethodology;
        if (data.tmpScore) filterValues.score = data.tmpScore;
        if (data.tmpStartDateFrom != undefined) filterValues.startDateFrom = data.tmpStartDateFrom;
        if (data.tmpStartDateTo != undefined) filterValues.startDateTo = data.tmpStartDateTo;
        if (data.tmpEndDateFrom != undefined) filterValues.endDateFrom = data.tmpEndDateFrom;
        if (data.tmpEndDateTo != undefined) filterValues.endDateTo = data.tmpEndDateTo;
        if (data.tmpPriorAuthApplFrom != undefined) filterValues.priorAuthApplFrom = data.tmpPriorAuthApplFrom;
        if (data.tmpPriorAuthApplTo != undefined) filterValues.priorAuthApplTo = data.tmpPriorAuthApplTo;
        if (data.tmpPriorAuthRecFrom != undefined) filterValues.priorAuthRecFrom = data.tmpPriorAuthRecFrom;
        if (data.tmpPriorAuthRecTo != undefined) filterValues.priorAuthRecTo = data.tmpPriorAuthRecTo;
        if (data.tmpPriorAuthAmtFrom != undefined) filterValues.priorAuthAmtFrom = data.tmpPriorAuthAmtFrom;
        if (data.tmpPriorAuthAmtTo != undefined) filterValues.priorAuthAmtTo = data.tmpPriorAuthAmtTo;

        if (data.tmpStartDateFrom == '') filterValues.startDateFrom = '%';
        if (data.tmpStartDateTo == '') filterValues.startDateTo = '%';
        if (data.tmpEndDateFrom == '') filterValues.endDateFrom = '%';
        if (data.tmpEndDateTo == '') filterValues.endDateTo = '%';
        if (data.tmpPriorAuthApplFrom == '') filterValues.priorAuthApplFrom = '%';
        if (data.tmpPriorAuthApplTo == '') filterValues.priorAuthApplTo = '%';
        if (data.tmpPriorAuthRecFrom == '') filterValues.priorAuthRecFrom = '%';
        if (data.tmpPriorAuthRecTo == '') filterValues.priorAuthRecTo = '%';   
    }

    function populateFilterDropdown() {
        const methData = ([
            { id: 1, value: 'D', text: 'Day Services' },
            { id: 2, value: 'S', text: 'Self Waiver' },
            { id: 3, value: 'W', text: 'Waiver Reimbursement' },
        ]);
        methData.unshift({ id: '%', value: '%', text: 'ALL' });
        dropdown.populate("methodologyDropdown", methData, filterValues.methodology);
        populateScoreDropdown(filterValues.methodology);
    }

    async function populateScoreDropdown(methodologyID) {
        const {
            getScoreResult: Score,
        } = await authorizationsAjax.getScoreAsync(methodologyID);
        let scoreData = Score.map((score) => ({
            id: score.scoreID,
            value: score.scoreDescription,
            text: score.scoreDescription
        }));
        scoreData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("scoreDropdown", scoreData, filterValues.score);
    }

    function filterPopupCancelBtn() {
        POPUP.hide(filterPopup);
    }

    function init() {
        setActiveModuleSectionAttribute('assessmentHistory');
        $.loadedApp = 'assessmentHistory';
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        init,
        handleActionNavEvent,
        loadAssessmentHistoryLanding,
    };
})(); 
