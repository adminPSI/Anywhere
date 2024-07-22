const authorizations = (function () {
    // DATA
    let authData;
    let filterDropdownData;
    let selectedConsumer;
    let filterValues;
    // DOM
    let pageWrap;
    let overviewTable;
    //--
    let filterPopup;
    let planTypeDropdown;
    let vendorDropdown;
    let matchSourceDropdown;
    let completedDateStart;
    let completedDateEnd;
    let yearStartStart;
    let yearStartEnd;
    let yearEndStart;
    let yearEndEnd;
    let applyFilterBtn;

    let btnWrap;
    let plantypeBtnWrap;
    let vendorBtnWrap;
    let matchSourceBtnWrap;
    let completedDateBtnWrap;
    let yearStartBtnWrap;
    let yearEndBtnWrap;

    let newFilterValues;

    function handleActionNavEvent(target) {
        const targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                DOM.scrollToTopOfPage();
                DOM.clearActionCenter();
                selectedConsumer = roster2.getActiveConsumers()[0];
                DOM.clearActionCenter();
                loadPage();
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
    function clearAllData() {
        // DATA
        authData = undefined;
        filterDropdownData = undefined;
        selectedConsumer = undefined;
        filterValues = undefined;
        pageWrap = undefined;
        overviewTable = undefined;
        filterPopup = undefined;
        planTypeDropdown = undefined;
        vendorDropdown = undefined;
        matchSourceDropdown = undefined;
        completedDateStartInput = undefined;
        completedDateEndInput = undefined;
        yearStartStartInput = undefined;
        yearStartEndInput = undefined;
        yearEndStartInput = undefined;
        yearEndEndInput = undefined;
        applyFilterBtn = undefined;
    }
    function groupChildData() {
        if (!authData.pageDataChild) {
            return;
        }

        const groupedChildren = authData.pageDataChild.reduce((obj, child) => {
            if (!obj[child.pas_id]) {
                obj[child.pas_id] = [];
                obj[child.pas_id].push(child);
            } else {
                obj[child.pas_id].push(child);
            }

            return obj;
        }, {});

        authData.pageDataChild = { ...groupedChildren };
    }
    function convertToCurrency(dirtyNumber) {
        const numberValue = parseFloat(dirtyNumber);

        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            numberValue,
        );
    }
    function getFreqName(key) {
        const freqObj = {
            W: 'Week',
            S: 'Span',
            D: 'Day',
            M: 'Month',
            N: 'None',
        };

        return freqObj[key];
    }
    function formatDate(date) {
        if (!date) return '';

        return UTIL.abbreviateDateYear(UTIL.formatDateFromIso(date.split('T')[0]));
    }

    // Filter Popup
    //----------------------------------------
    function initFilterValues() {
        filterValues = {
            planType: '%',
            vendor: '%',
            matchSource: '%',
            completedDateStart: dates
                .formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 2))
                .slice(0, 10),
            completedDateEnd: dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
            yearStartStart: dates
                .formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 2))
                .slice(0, 10),
            yearStartEnd: dates
                .formatISO(dates.addYears(new Date(new Date().setHours(0, 0, 0, 0)), 1))
                .slice(0, 10),
            yearEndStart: '', //dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
            yearEndEnd: '', //dates.formatISO(dates.addYears(new Date(new Date().setHours(0, 0, 0, 0)), 1)).slice(0, 10),
        };
    }
    function buildFilteredByData() {
        var currentFilterDisplay = document.querySelector('.filteredByData');

        completedDateStart = `${formatDate(filterValues.completedDateStart)}`;
        completedDateEnd = `${formatDate(filterValues.completedDateEnd)}`;
        yearStartStart = `${formatDate(filterValues.yearStartStart)}`;
        yearStartEnd = `${formatDate(filterValues.yearStartEnd)}`;
        yearEndStart = `${formatDate(filterValues.yearEndStart)}`;
        yearEndEnd = `${formatDate(filterValues.yearEndEnd)}`;

        if (!currentFilterDisplay) {
            currentFilterDisplay = document.createElement('div');
            currentFilterDisplay.classList.add('filteredByData');
            filterButtonSet();
            currentFilterDisplay.appendChild(btnWrap);
        }

        if (getPlanTypeFullName(filterValues.planType) === 'All') {
            btnWrap.appendChild(plantypeBtnWrap);
            btnWrap.removeChild(plantypeBtnWrap);
        } else {
            btnWrap.appendChild(plantypeBtnWrap);
            if (document.getElementById('plantypeBtn') != null)
                document.getElementById('plantypeBtn').innerHTML = 'Plan Type: ' + getPlanTypeFullName(filterValues.planType);
        }

        if (getVendorFullName(filterValues.vendor) === 'All') {
            btnWrap.appendChild(vendorBtnWrap);
            btnWrap.removeChild(vendorBtnWrap);
        } else {
            btnWrap.appendChild(vendorBtnWrap);
            if (document.getElementById('vendorBtn') != null)
                document.getElementById('vendorBtn').innerHTML = 'PL Vendor: ' + getVendorFullName(filterValues.vendor);
        }

        if (getMatchSourceName(filterValues.matchSource) === 'All') {
            btnWrap.appendChild(matchSourceBtnWrap);
            btnWrap.removeChild(matchSourceBtnWrap);
        } else {
            btnWrap.appendChild(matchSourceBtnWrap);
            if (document.getElementById('matchSourceBtn') != null)
                document.getElementById('matchSourceBtn').innerHTML = 'Match Source: ' + getMatchSourceName(filterValues.matchSource);
        }

        if (completedDateStart == '' && completedDateEnd == '') {
            btnWrap.appendChild(completedDateBtnWrap);
            btnWrap.removeChild(completedDateBtnWrap);
        } else {
            btnWrap.appendChild(completedDateBtnWrap);
            if (document.getElementById('completedDateBtn') != null)
                document.getElementById('completedDateBtn').innerHTML = 'Completed Dates: ' + completedDateStart + '-' + completedDateEnd;
        }

        if (yearStartStart === '' && yearStartEnd === '') {
            btnWrap.appendChild(yearStartBtnWrap);
            btnWrap.removeChild(yearStartBtnWrap);
        } else {
            btnWrap.appendChild(yearStartBtnWrap);
            if (document.getElementById('yearStartBtn') != null)
                document.getElementById('yearStartBtn').innerHTML = 'Year Start: ' + yearStartStart + '-' + yearStartEnd;
        }

        if (yearEndStart === '' && yearEndEnd === '') {
            btnWrap.appendChild(yearEndBtnWrap);
            btnWrap.removeChild(yearEndBtnWrap);
        } else {
            btnWrap.appendChild(yearEndBtnWrap);
            if (document.getElementById('yearEndBtn') != null)
                document.getElementById('yearEndBtn').innerHTML = 'Year End: ' + yearEndStart + '-' + yearEndEnd;
        }

        return currentFilterDisplay;
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

        plantypeBtn = button.build({
            id: 'plantypeBtn',
            text: 'Plan Type: ' + getPlanTypeFullName(filterValues.planType),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('plantypeBtn') },
        });
        plantypeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('plantypeBtn') },
        });

        vendorBtn = button.build({
            id: 'vendorBtn',
            text: 'PL Vendor: ' + getVendorFullName(filterValues.vendor),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('vendorBtn') },
        });
        vendorCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('vendorBtn') },
        });

        matchSourceBtn = button.build({
            id: 'matchSourceBtn',
            text: 'Match Source: ' + getMatchSourceName(filterValues.matchSource),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('matchSourceBtn') },
        });
        matchSourceCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('matchSourceBtn') },
        });

        completedDateBtn = button.build({
            id: 'completedDateBtn',
            text: 'Completed Dates: ' + completedDateStart + '-' + completedDateEnd,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('completedDateBtn') },
        });

        yearStartBtn = button.build({
            id: 'yearStartBtn',
            text: 'Year start: ' + yearStartStart + '-' + yearStartEnd,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('yearStartBtn') },
        });

        yearEndBtn = button.build({
            id: 'yearEndBtn',
            text: 'Year End: ' + yearEndStart + '-' + yearEndEnd,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('yearEndBtn') },
        });
        yearEndCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('yearEndBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        plantypeBtnWrap = document.createElement('div');
        plantypeBtnWrap.classList.add('filterSelectionBtnWrap');
        plantypeBtnWrap.appendChild(plantypeBtn);
        plantypeBtnWrap.appendChild(plantypeCloseBtn);
        btnWrap.appendChild(plantypeBtnWrap);

        vendorBtnWrap = document.createElement('div');
        vendorBtnWrap.classList.add('filterSelectionBtnWrap');
        vendorBtnWrap.appendChild(vendorBtn);
        vendorBtnWrap.appendChild(vendorCloseBtn);
        btnWrap.appendChild(vendorBtnWrap);

        matchSourceBtnWrap = document.createElement('div');
        matchSourceBtnWrap.classList.add('filterSelectionBtnWrap');
        matchSourceBtnWrap.appendChild(matchSourceBtn);
        matchSourceBtnWrap.appendChild(matchSourceCloseBtn);
        btnWrap.appendChild(matchSourceBtnWrap);

        completedDateBtnWrap = document.createElement('div');
        completedDateBtnWrap.classList.add('filterSelectionBtnWrap');
        completedDateBtnWrap.appendChild(completedDateBtn);
        btnWrap.appendChild(completedDateBtnWrap);

        yearStartBtnWrap = document.createElement('div');
        yearStartBtnWrap.classList.add('filterSelectionBtnWrap');
        yearStartBtnWrap.appendChild(yearStartBtn);
        btnWrap.appendChild(yearStartBtnWrap);

        yearEndBtnWrap = document.createElement('div');
        yearEndBtnWrap.classList.add('filterSelectionBtnWrap');
        yearEndBtnWrap.appendChild(yearEndBtn);
        yearEndBtnWrap.appendChild(yearEndCloseBtn);
        btnWrap.appendChild(yearEndBtnWrap);

    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'plantypeBtn') {
            filterValues.planType = '%';
            newFilterValues.planType = '%';
        }
        if (closeFilter == 'vendorBtn') {
            filterValues.vendor = '%';
            newFilterValues.vendor = '%';
        }

        if (closeFilter == 'matchSourceBtn') {
            filterValues.matchSource = '%';
            newFilterValues.matchSource = '%';
        }

        if (closeFilter == 'yearEndBtn') {
            filterValues.yearEndStart = '';
            filterValues.yearEndEnd = '';
            newFilterValues.yearEndStart = '';
            newFilterValues.yearEndEnd = '';
        }

        applyFilter();

    }

    function checkFilterPopForErrors() {
        const errors = [...filterPopup.querySelectorAll('.error')];
        const hasErrors = errors.legnth > 0 ? true : false;

        if (hasErrors) {
            applyFilterBtn.classList.add('disabled');
        } else {
            applyFilterBtn.classList.remove('disabled');
        }
    }
    function populatePlanTypeDropdown() {
        const data = [
            { value: '%', text: 'All' },
            { text: 'Final', value: 'F' },
            { text: 'Initial', value: 'I' },
            { text: 'Revision', value: 'V' },
            { text: 'Redetermination', value: 'R' },
        ];
        dropdown.populate(planTypeDropdown, data, filterValues.planType);
    }
    function populateVendorDropdown() {
        const data = filterDropdownData.planVendors.map(pv => {
            return {
                value: pv.vendorId,
                text: pv.vendorName,
            };
        });
        data.unshift({ value: '%', text: 'All' });
        data.sort((a, b) => {
            if (a.vendorName < b.vendorName) {
                return -1;
            }
            if (a.vendorName > b.vendorName) {
                return 1;
            }
            return 0;
        });
        dropdown.populate(vendorDropdown, data, filterValues.vendor);
    }
    function populateMatchSourceDropdown() {
        const data = filterDropdownData.matchSources.map(ms => {
            return {
                value: ms.code,
                text: ms.caption,
            };
        });
        data.sort((a, b) => {
            if (a.caption < b.caption) {
                return -1;
            }
            if (a.caption > b.caption) {
                return 1;
            }
            return 0;
        });
        data.unshift({ value: '%', text: 'All' });
        dropdown.populate(matchSourceDropdown, data, filterValues.matchSource);
    }
    function getVendorFullName(id) {
        if (id === '') return '';
        if (id === '%') return 'All';

        const filteredVendor = filterDropdownData.planVendors.filter(pv => {
            return pv.vendorId === id;
        });

        if (filteredVendor.length > 0) {
            return filteredVendor[0].vendorName;
        }
    }
    function getPlanTypeFullName(value, revisionNumber) {
        switch (value) {
            case 'F': {
                return 'Final';
            }
            case 'I': {
                return 'Initial';
            }
            case 'V': {
                return revisionNumber ? `Revision ${revisionNumber}` : 'Revision';
            }
            case 'R': {
                return 'Redetermination';
            }
            default: {
                return 'All';
            }
        }
    }
    function getMatchSourceName(id) {
        if (id === '%') return 'All';

        const filteredMatch = filterDropdownData.matchSources.filter(ms => {
            return ms.code === code;
        });

        if (filteredMatch.length > 0) {
            return filteredMatch[0].caption;
        }
    }
    function showFilterPopup(IsShow) {
        filterPopup = POPUP.build({
            classNames: 'authorizationsReviewFilterPopup',
        });

        // Dropdowns
        planTypeDropdown = dropdown.build({
            dropdownId: 'planTypeDropdown',
            label: 'Plan Type',
            style: 'secondary',
        });
        vendorDropdown = dropdown.build({
            dropdownId: 'vendorDropdown',
            label: 'PL Vendor',
            style: 'secondary',
        });
        matchSourceDropdown = dropdown.build({
            dropdownId: 'matchSourceDropdown',
            label: 'Match Source',
            style: 'secondary',
        });

        // Date Inputs
        const dateWrap = document.createElement('div');
        completedDateStartInput = input.build({
            type: 'date',
            label: 'Completed Date (Start)',
            style: 'secondary',
            value: filterValues.completedDateStart,
        });
        completedDateEndInput = input.build({
            type: 'date',
            label: 'Completed Date (End)',
            style: 'secondary',
            value: filterValues.completedDateEnd,
        });
        yearStartStartInput = input.build({
            type: 'date',
            label: 'Year Start (Start)',
            style: 'secondary',
            value: filterValues.yearStartStart,
        });
        yearStartEndInput = input.build({
            type: 'date',
            label: 'Year Start (End)',
            style: 'secondary',
            value: filterValues.yearStartEnd,
        });
        yearEndStartInput = input.build({
            type: 'date',
            label: 'Year End (Start)',
            style: 'secondary',
            value: filterValues.yearEndStart,
        });
        yearEndEndInput = input.build({
            type: 'date',
            label: 'Year End (End)',
            style: 'secondary',
            value: filterValues.yearEndEnd,
        });
        if (IsShow == 'ALL' || IsShow == 'completedDateBtn') {
            dateWrap.appendChild(completedDateStartInput);
            dateWrap.appendChild(completedDateEndInput);
        }
        if (IsShow == 'ALL' || IsShow == 'yearStartBtn') {
            dateWrap.appendChild(yearStartStartInput);
            dateWrap.appendChild(yearStartEndInput);
        }
        if (IsShow == 'ALL' || IsShow == 'yearEndBtn') {
            dateWrap.appendChild(yearEndStartInput);
            dateWrap.appendChild(yearEndEndInput);
        }

        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        applyFilterBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });
        const cancelFilterBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: function () {
                POPUP.hide(filterPopup);
            },
        });
        btnWrap.appendChild(applyFilterBtn);
        btnWrap.appendChild(cancelFilterBtn);

        if (IsShow == 'ALL' || IsShow == 'plantypeBtn')
            filterPopup.appendChild(planTypeDropdown);
        if (IsShow == 'ALL' || IsShow == 'vendorBtn')
            filterPopup.appendChild(vendorDropdown);
        if (IsShow == 'ALL' || IsShow == 'matchSourceBtn')
            filterPopup.appendChild(matchSourceDropdown);
        filterPopup.appendChild(dateWrap);
        filterPopup.appendChild(btnWrap);

        POPUP.show(filterPopup);

        populatePlanTypeDropdown();
        populateVendorDropdown();
        populateMatchSourceDropdown();

        setupFilterEvents();
    }
    function setupFilterEvents() {
        newFilterValues = {};

        planTypeDropdown.addEventListener('change', e => {
            var selectedOption = e.target.options[e.target.selectedIndex];
            newFilterValues.planType = selectedOption.value;
        });
        vendorDropdown.addEventListener('change', e => {
            var selectedOption = e.target.options[e.target.selectedIndex];
            newFilterValues.vendor = selectedOption.value;
        });
        matchSourceDropdown.addEventListener('change', e => {
            var selectedOption = e.target.options[e.target.selectedIndex];
            newFilterValues.matchSource = selectedOption.value;
        });
        completedDateStartInput.addEventListener('change', e => {
            newFilterValues.completedDateStart = e.target.value;
            if (e.target.value === '') {
                completedDateStartInput.classList.add('error');
            } else {
                completedDateStartInput.classList.remove('error');
            }
            checkFilterPopForErrors();
        });
        completedDateEndInput.addEventListener('change', e => {
            newFilterValues.completedDateEnd = e.target.value;
            if (e.target.value === '') {
                completedDateEndInput.classList.add('error');
            } else {
                completedDateEndInput.classList.remove('error');
            }
            checkFilterPopForErrors();
        });
        yearStartStartInput.addEventListener('change', e => {
            newFilterValues.yearStartStart = e.target.value;
            if (e.target.value === '') {
                yearStartStartInput.classList.add('error');
            } else {
                yearStartStartInput.classList.remove('error');
            }
            checkFilterPopForErrors();
        });
        yearStartEndInput.addEventListener('change', e => {
            newFilterValues.yearStartEnd = e.target.value;
            if (e.target.value === '') {
                yearStartEndInput.classList.add('error');
            } else {
                yearStartEndInput.classList.remove('error');
            }
            checkFilterPopForErrors();
        });
        yearEndStartInput.addEventListener('change', e => {
            newFilterValues.yearEndStart = e.target.value;
        });
        yearEndEndInput.addEventListener('change', e => {
            newFilterValues.yearEndEnd = e.target.value;
        });
        applyFilterBtn.addEventListener('click', async e => {
            POPUP.hide(filterPopup);
            applyFilter();
        });
    }

    async function applyFilter() {
        filterValues = { ...filterValues, ...newFilterValues };

        const spinner = PROGRESS.SPINNER.get('Gathering Data...');
        pageWrap.removeChild(overviewTable);
        pageWrap.appendChild(spinner);

        authData = await authorizationsAjax.getPageData({
            token: $.session.Token,
            selectedConsumerId: selectedConsumer.id,
            code: '%',
            matchSource: filterValues.matchSource,
            vendorId: filterValues.vendor,
            planType: filterValues.planType,
            planYearStartStart: UTIL.formatDateToIso(filterValues.yearStartStart),
            planYearStartEnd: UTIL.formatDateToIso(filterValues.yearStartEnd),
            planYearEndStart: filterValues.yearEndStart
                ? UTIL.formatDateToIso(filterValues.yearEndStart)
                : '',
            planYearEndEnd: filterValues.yearEndEnd
                ? UTIL.formatDateToIso(filterValues.yearEndEnd)
                : '',
            completedDateStart: UTIL.formatDateToIso(filterValues.completedDateStart),
            completedDateEnd: UTIL.formatDateToIso(filterValues.completedDateEnd),
        });
        pageWrap.removeChild(spinner);

        buildOverviewTable();
        const newfilteredByData = buildFilteredByData();
        pageWrap.replaceChild(newfilteredByData, filteredByData);
        filteredByData = newfilteredByData;
    }
    //----------------------------------------
    function buildConsumerCard() {
        selectedConsumer.card.classList.remove('highlighted');

        const wrap = document.createElement('div');
        wrap.classList.add('planConsumerCard');

        wrap.appendChild(selectedConsumer.card);

        return wrap;
    }
    function buildOverviewTable() {
        groupChildData();

        overviewTable = document.createElement('div');
        overviewTable.classList.add('authTable');

        const mainHeading = document.createElement('div');
        mainHeading.classList.add('authTable__header');
        mainHeading.innerHTML = `
      <div></div>
      <div>Completed</div>
      <div>Year Start</div>
      <div>Year End</div>
      <div>Plan Type</div>
      <div>PL Vendor</div>
      <div>Match Source</div>
    `;
        overviewTable.appendChild(mainHeading);

        authData.pageDataParent.forEach(parent => {
            const pasID = parent.pas_id;

            const rowWrap = document.createElement('div');
            rowWrap.classList.add('authTable__subTableWrap');

            // TOP LEVEL ROW
            //---------------------------------
            const mainDataRow = document.createElement('div');
            mainDataRow.classList.add('authTable__mainDataRow', 'authTable__dataRow');
            mainDataRow.innerHTML = `
        <div id="authToggle">${icons.keyArrowRight}</div>
        <div>${UTIL.abbreviateDateYear(
                UTIL.formatDateFromIso(parent.CompletionDate.split('T')[0]),
            )}</div>
        <div>${UTIL.abbreviateDateYear(
                UTIL.formatDateFromIso(parent.plan_year_start.split('T')[0]),
            )}</div>
        <div>${UTIL.abbreviateDateYear(
                UTIL.formatDateFromIso(parent.plan_year_end.split('T')[0]),
            )}</div>
        <div>${getPlanTypeFullName(parent.plantype, parent.revisionNum)}</div>
        <div>${parent.plVendorId ? getVendorFullName(parent.plVendorId) : ''}</div>
        <div>${parent.sourceAndCaption}</div>
      `;
            rowWrap.appendChild(mainDataRow);

            // SUB ROWS
            //---------------------------------
            const subRowWrap = document.createElement('div');
            subRowWrap.classList.add('authTable__subRowWrap');

            const subHeading = document.createElement('div');
            subHeading.classList.add('authTable__subHeader');
            subHeading.innerHTML = `
        <div>#</div>
        <div>Service</div>
        <div>Service Code</div>
        <div>Begin Date</div>
        <div>End Date</div>
        <div>Units</div>
        <div>Frequency</div>
        <div>Vendor</div>
        <div>Auth Cost FY1</div>
        <div>Auth Cost FY2</div>
      `;
            subRowWrap.appendChild(subHeading);

            if (authData.pageDataChild[pasID]) {
                authData.pageDataChild[pasID].sort((a, b) => {
                    return parseInt(a.itemnum) - parseInt(b.itemnum);
                });

                authData.pageDataChild[pasID].forEach(child => {
                    const subDataRow = document.createElement('div');
                    subDataRow.classList.add('authTable__subDataRow', 'authTable__dataRow');
                    subDataRow.innerHTML = `
            <div>${child.itemnum}</div>
            <div>${child.description}</div>
            <div>${child.service_code}</div>
            <div>${UTIL.abbreviateDateYear(
                        UTIL.formatDateFromIso(child.BeginDate.split('T')[0]),
                    )}</div>
            <div>${UTIL.abbreviateDateYear(
                        UTIL.formatDateFromIso(child.EndDate.split('T')[0]),
                    )}</div>
            <div>${child.MaxUnits}</div>
            <div>${getFreqName(child.frequency)}</div>
            <div>${child.vendorName}</div>
            <div>${convertToCurrency(child.authCostFY1)}</div>
            <div>${convertToCurrency(child.authCostFY2)}</div>
          `;
                    subRowWrap.appendChild(subDataRow);
                });
            }

            // EVENT
            //---------------------------------
            mainDataRow.addEventListener('click', e => {
                const toggle = e.target.querySelector('#authToggle');

                if (subRowWrap.classList.contains('active')) {
                    // close it
                    subRowWrap.classList.remove('active');
                    toggle.innerHTML = icons.keyArrowRight;
                } else {
                    // open it
                    subRowWrap.classList.add('active');
                    toggle.innerHTML = icons.keyArrowDown;
                }
            });

            // ASSEMBLY
            //---------------------------------
            rowWrap.appendChild(subRowWrap);
            overviewTable.appendChild(rowWrap);
        });

        pageWrap.appendChild(overviewTable);
    }

    async function loadPage() {
        initFilterValues();

        pageWrap = document.createElement('div');
        const consumerCard = buildConsumerCard();

        filteredByData = buildFilteredByData();

        pageWrap.appendChild(consumerCard);
        pageWrap.appendChild(filteredByData);
        DOM.ACTIONCENTER.appendChild(pageWrap);

        const spinner = PROGRESS.SPINNER.get('Gathering Data...');
        pageWrap.appendChild(spinner);

        // authData = await authorizationsAjax.getPageData({
        //     token: $.session.Token,
        //     selectedConsumerId: selectedConsumer.id,
        //     code: '%',
        //     matchSource: filterValues.matchSource,
        //     vendorId: filterValues.vendor,
        //     planType: filterValues.planType,
        //     planYearStartStart: filterValues.yearStartStart,
        //     planYearStartEnd: filterValues.yearStartEnd,
        //     planYearEndStart: filterValues.yearEndStart,
        //     planYearEndEnd: filterValues.yearEndEnd,
        //     completedDateStart: filterValues.completedDateStart,
        //     completedDateEnd: filterValues.completedDateEnd,
        // });
        authData = await authorizationsAjax.getPageData();
        filterDropdownData = await authorizationsAjax.getFilterDropdownData({
            token: $.session.Token,
        });

        pageWrap.removeChild(spinner);

        buildOverviewTable();
    }

    function init() {
        setActiveModuleSectionAttribute('authorizations');
        $.loadedApp = 'authorizations';
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        handleActionNavEvent,
        clearAllData,
        init,
    };
})();
