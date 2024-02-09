const assessmentHistory = (() => {
    //Inputs
    let filterRow;
    let assessmentEntriesTable = [];
    let filterPopup;
    var selectedConsumers;
    var selectedConsumersName;
    var selectedConsumersId;
    //filter
    let filterValues;

    let startDateFrom;
    let startDateTo;
    let endDateFrom;
    let endDateTo;
    let priorAuthApplFrom;
    let priorAuthApplTo;
    let priorAuthRecFrom;
    let priorAuthRecTo;


    let btnWrap;
    let methodologyValuesBtnWrap;
    let scoreValuesBtnWrap;
    let startDateBtnWrap;
    let endDateBtnWrap;
    let priorAuthApplyBtnWrap;
    let priorAuthRecBtnWrap;
    let priorAuthAmtFromBtnWrap;
    let priorAuthAmtToBtnWrap;


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

        selectedConsumersId = selectedConsumers[selectedConsumers.length - 1].id;
        const name = (
            await ConsumerFinancesAjax.getConsumerNameByID({
                token: $.session.Token,
                consumerId: selectedConsumersId,
            })
        ).getConsumerNameByIDResult;

        selectedConsumersName = name[0].FullName;
        buildNewFilterBtn();
        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        const filteredBy = buildFilteredBy();
        filterRow.appendChild(filteredBy);
        landingPage.appendChild(filterRow);
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
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    }

    // build the display of the current Filter Settings (next to the Filter button) 
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.filteredByData');

        startDateFrom = filterValues.startDateFrom == '%' ? 'ALL' : moment(filterValues.startDateFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        startDateTo = filterValues.startDateTo == '%' ? 'ALL' : moment(filterValues.startDateTo, 'YYYY-MM-DD').format('MM/DD/YYYY');
        endDateFrom = filterValues.endDateFrom == '%' ? 'ALL' : moment(filterValues.endDateFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        endDateTo = filterValues.endDateTo == '%' ? 'ALL' : moment(filterValues.endDateTo, 'YYYY-MM-DD').format('MM/DD/YYYY');
        priorAuthApplFrom = filterValues.priorAuthApplFrom == '%' ? 'ALL' : moment(filterValues.priorAuthApplFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        priorAuthApplTo = filterValues.priorAuthApplTo == '%' ? 'ALL' : moment(filterValues.priorAuthApplTo, 'YYYY-MM-DD').format('MM/DD/YYYY');
        priorAuthRecFrom = filterValues.priorAuthRecFrom == '%' ? 'ALL' : moment(filterValues.priorAuthRecFrom, 'YYYY-MM-DD').format('MM/DD/YYYY');
        priorAuthRecTo = filterValues.priorAuthRecTo == '%' ? 'ALL' : moment(filterValues.priorAuthRecTo, 'YYYY-MM-DD').format('MM/DD/YYYY');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet();
            filteredBy.appendChild(btnWrap);
        }

        filteredBy.style.maxWidth = '100%';

        if (filterValues.methodologyValues === '%' || filterValues.methodologyValues === 'ALL') {
            btnWrap.appendChild(methodologyValuesBtnWrap);
            btnWrap.removeChild(methodologyValuesBtnWrap);
        } else {
            btnWrap.appendChild(methodologyValuesBtnWrap);
        }

        if (filterValues.scoreValues === '%' || filterValues.scoreValues === 'ALL') {
            btnWrap.appendChild(scoreValuesBtnWrap);
            btnWrap.removeChild(scoreValuesBtnWrap);
        } else {
            btnWrap.appendChild(scoreValuesBtnWrap);
        }

        if (startDateFrom == 'ALL' && startDateTo == 'ALL') {
            btnWrap.appendChild(startDateBtnWrap);
            btnWrap.removeChild(startDateBtnWrap);
        } else {
            btnWrap.appendChild(startDateBtnWrap);
        }

        if (endDateFrom === 'ALL' && endDateTo === 'ALL') {
            btnWrap.appendChild(endDateBtnWrap);
            btnWrap.removeChild(endDateBtnWrap);
        } else {
            btnWrap.appendChild(endDateBtnWrap);
        }

        if (priorAuthApplFrom === 'ALL' && priorAuthApplTo === 'ALL') {
            btnWrap.appendChild(priorAuthApplyBtnWrap);
            btnWrap.removeChild(priorAuthApplyBtnWrap);
        } else {
            btnWrap.appendChild(priorAuthApplyBtnWrap);
        }

        if (priorAuthRecFrom === 'ALL' && priorAuthRecTo === 'ALL') {
            btnWrap.appendChild(priorAuthRecBtnWrap);
            btnWrap.removeChild(priorAuthRecBtnWrap);
        } else {
            btnWrap.appendChild(priorAuthRecBtnWrap);
        }

        if (filterValues.priorAuthAmtFrom === '') {
            btnWrap.appendChild(priorAuthAmtFromBtnWrap);
            btnWrap.removeChild(priorAuthAmtFromBtnWrap);
        } else {
            btnWrap.appendChild(priorAuthAmtFromBtnWrap);
        }

        if (filterValues.priorAuthAmtTo === '') {
            btnWrap.appendChild(priorAuthAmtToBtnWrap);
            btnWrap.removeChild(priorAuthAmtToBtnWrap);
        } else {
            btnWrap.appendChild(priorAuthAmtToBtnWrap);
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

        methodologyValuesBtn = button.build({
            id: 'methodologyValuesBtn',
            text: 'Methodology: ' + filterValues.methodologyValues,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('methodologyValuesBtn') },
        });
        methodologyValuesCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('methodologyValuesBtn') },
        });

        scoreValuesBtn = button.build({
            id: 'scoreValuesBtn',
            text: 'Score: ' + filterValues.scoreValues,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('scoreValuesBtn') },
        });
        scoreValuesCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('scoreValuesBtn') },
        });

        startDateBtn = button.build({
            id: 'startDateBtn',
            text: 'Start Date: ' + startDateFrom + '-' + startDateTo,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('startDateBtn') },
        });

        endDateBtn = button.build({
            id: 'endDateBtn',
            text: 'End Date: ' + endDateFrom + '-' + endDateTo,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('endDateBtn') },
        });
        endDateCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('endDateBtn') },
        });

        priorAuthApplyBtn = button.build({
            id: 'priorAuthApplyBtn',
            text: 'Prior Auth Applied: ' + priorAuthApplFrom + '-' + priorAuthApplTo,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('priorAuthApplyBtn') },
        });
        priorAuthApplyCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('priorAuthApplyBtn') },
        });

        priorAuthRecBtn = button.build({
            id: 'priorAuthRecBtn',
            text: 'Prior Auth Received: ' + priorAuthRecFrom + '-' + priorAuthRecTo,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('priorAuthRecBtn') },
        });
        priorAuthRecCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('priorAuthRecBtn') },
        });

        priorAuthAmtFromBtn = button.build({
            id: 'priorAuthAmtFromBtn',
            text: 'Prior Auth Amount From: $' + numberWithCommas(filterValues.priorAuthAmtFrom),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('priorAuthAmtFromBtn') },
        });
        priorAuthAmtFromCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('priorAuthAmtFromBtn') },
        });

        priorAuthAmtToBtn = button.build({
            id: 'priorAuthAmtToBtn',
            text: 'Prior Auth Amount To: $' + numberWithCommas(filterValues.priorAuthAmtTo),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('priorAuthAmtToBtn') },
        });
        priorAuthAmtToCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('priorAuthAmtToBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        methodologyValuesBtnWrap = document.createElement('div');
        methodologyValuesBtnWrap.classList.add('filterSelectionBtnWrap');
        methodologyValuesBtnWrap.appendChild(methodologyValuesBtn);
        methodologyValuesBtnWrap.appendChild(methodologyValuesCloseBtn);
        btnWrap.appendChild(methodologyValuesBtnWrap);

        scoreValuesBtnWrap = document.createElement('div');
        scoreValuesBtnWrap.classList.add('filterSelectionBtnWrap');
        scoreValuesBtnWrap.appendChild(scoreValuesBtn);
        scoreValuesBtnWrap.appendChild(scoreValuesCloseBtn);
        btnWrap.appendChild(scoreValuesBtnWrap);

        startDateBtnWrap = document.createElement('div');
        startDateBtnWrap.classList.add('filterSelectionBtnWrap');
        startDateBtnWrap.appendChild(startDateBtn); 
        btnWrap.appendChild(startDateBtnWrap);

        endDateBtnWrap = document.createElement('div');
        endDateBtnWrap.classList.add('filterSelectionBtnWrap');
        endDateBtnWrap.appendChild(endDateBtn);
        endDateBtnWrap.appendChild(endDateCloseBtn)
        btnWrap.appendChild(endDateBtnWrap);

        priorAuthApplyBtnWrap = document.createElement('div');
        priorAuthApplyBtnWrap.classList.add('filterSelectionBtnWrap');
        priorAuthApplyBtnWrap.appendChild(priorAuthApplyBtn);
        priorAuthApplyBtnWrap.appendChild(priorAuthApplyCloseBtn);
        btnWrap.appendChild(priorAuthApplyBtnWrap);

        priorAuthRecBtnWrap = document.createElement('div');
        priorAuthRecBtnWrap.classList.add('filterSelectionBtnWrap');
        priorAuthRecBtnWrap.appendChild(priorAuthRecBtn);
        priorAuthRecBtnWrap.appendChild(priorAuthRecCloseBtn);
        btnWrap.appendChild(priorAuthRecBtnWrap);

        priorAuthAmtFromBtnWrap = document.createElement('div');
        priorAuthAmtFromBtnWrap.classList.add('filterSelectionBtnWrap');
        priorAuthAmtFromBtnWrap.appendChild(priorAuthAmtFromBtn);
        priorAuthAmtFromBtnWrap.appendChild(priorAuthAmtFromCloseBtn)
        btnWrap.appendChild(priorAuthAmtFromBtnWrap);

        priorAuthAmtToBtnWrap = document.createElement('div');
        priorAuthAmtToBtnWrap.classList.add('filterSelectionBtnWrap');
        priorAuthAmtToBtnWrap.appendChild(priorAuthAmtToBtn);
        priorAuthAmtToBtnWrap.appendChild(priorAuthAmtToCloseBtn);
        btnWrap.appendChild(priorAuthAmtToBtnWrap);
    }

    function closeFilter(closeFilter) {

        if (closeFilter == 'methodologyValuesBtn') {
            filterValues.methodologyValues = '%';
            filterValues.methodology = '%';
        }
        if (closeFilter == 'scoreValuesBtn') {
            filterValues.scoreValues = '%';
            filterValues.score = '%';
        }
        if (closeFilter == 'priorAuthApplyBtn') {
            filterValues.priorAuthApplFrom = '%';
            filterValues.priorAuthApplTo = '%';
        }
        if (closeFilter == 'priorAuthRecBtn') {
            filterValues.priorAuthRecFrom = '%';
            filterValues.priorAuthRecTo = '%';
        }
        if (closeFilter == 'endDateBtn') {
            filterValues.endDateFrom = '%';
            filterValues.endDateTo = '%';
        }
        if (closeFilter == 'priorAuthAmtFromBtn') {
            filterValues.priorAuthAmtFrom = '';
        }
        if (closeFilter == 'priorAuthAmtToBtn') {
            filterValues.priorAuthAmtTo = '';
        }

        loadAssessmentHistoryLanding();
    }

    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(IsShow) {
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
            label: 'Prior Auth Amt From',
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
        if (IsShow == 'ALL' || IsShow == 'priorAuthAmtFromBtn')
            amtWrap.appendChild(priorAuthAmtFrom);
        if (IsShow == 'ALL' || IsShow == 'priorAuthAmtToBtn')
            amtWrap.appendChild(priorAuthAmtTo);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        if (IsShow == 'ALL' || IsShow == 'methodologyValuesBtn')
            filterPopup.appendChild(methodologyDropdown);
        if (IsShow == 'ALL' || IsShow == 'scoreValuesBtn')
            filterPopup.appendChild(scoreDropdown);
        if (IsShow == 'ALL' || IsShow == 'startDateBtn')
            filterPopup.appendChild(startDateWrap);
        if (IsShow == 'ALL' || IsShow == 'endDateBtn')
            filterPopup.appendChild(endDateWrap);
        if (IsShow == 'ALL' || IsShow == 'priorAuthApplyBtn')
            filterPopup.appendChild(applDateWrap);
        if (IsShow == 'ALL' || IsShow == 'priorAuthRecBtn')
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
            tmpPriorAuthAmtFrom = minAmount.trim().replace('$', '');
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
            tmpPriorAuthAmtTo = maxAmount.trim().replace('$', '');
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
