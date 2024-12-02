const incidentOverview = (function () {
    // DOM Elements
    let overviewTable;
    //Incident Tracking Report Data
    let incidentTrackingEmailData = { emailSubject: 'Incidents [Composite] by Consumer, Date' };
    //filters
    let filterPopup;
    let filterBtn;
    let applyFilterBtn;
    let alphaDropdown;
    let locationDropdown;
    let consumerDropdown;
    let betaDropdown;
    let fromDateInput;
    let toDateInput;
    let categoryDropdown;
    let showDropdown;
    let consumerDropdownData;
    let btnWrap;
    let supervisorBtnWrap;
    let locationBtnWrap;
    let consumerBtnWrap;
    let employeeBtnWrap;
    let categoryBtnWrap;
    let fromDateBtnWrap;
    let toDateBtnWrap;
    // filter values for remembering
    let filterData = {
        alpha: null,
        alphaName: null,
        beta: null,
        betaName: null,
        location: null,
        locationName: null,
        consumer: null,
        consumerName: null,
        category: null,
        categoryName: null,
        fromDate: null,
        toDate: null,
        show: null,
    };
    // alpha beta stuff
    let changedSelectedAlphaBetas;
    let alphaBetaData;
    let selectedAlphaId;
    let selectedBetaData = {
        id: '',
        name: '',
    };
    let retrieveData = {
        token: '',
        locationId: '%',
        employeeId: null,
        supervisorId: '',
        subcategoryId: '%',
        fromDate: '',
        toDate: '',
        viewCaseLoad: $.session.incidentTrackingViewCaseLoad,
    };
    let emailString;
    let selectedRelation = [];
    let gkRelationships;
    let relationshipDoneBtn;
    let relationshipCancelBtn;
    // Filtering
    //------------------------------------
    function populateSelectedFilterValues() {
        var selectedFilters = document.querySelector('.filteredByData');
        if (!selectedFilters) {
            selectedFilters = document.createElement('div');
            selectedFilters.classList.add('filteredByData');
            DOM.ACTIONCENTER.appendChild(selectedFilters);
            filterData.alphaName = $.session.LName + ', ' + $.session.Name;
            filterButtonSet();
            selectedFilters.appendChild(btnWrap);
        }

        if (filterData.locationName === null || filterData.locationName === 'All' || filterData.locationName === 'All Locations') {
            btnWrap.appendChild(locationBtnWrap);
            btnWrap.removeChild(locationBtnWrap);
        }
        else {
            btnWrap.appendChild(locationBtnWrap);
            document.getElementById('locationBtn').innerHTML = 'Location: ' + filterData.locationName;
        }

        if (filterData.consumerName === null || filterData.consumerName === 'All' || filterData.consumerName === 'All Consumers') {
            btnWrap.appendChild(consumerBtnWrap);
            btnWrap.removeChild(consumerBtnWrap);
        } else {
            btnWrap.appendChild(consumerBtnWrap);
            document.getElementById('consumerBtn').innerHTML = 'Consumer: ' + filterData.consumerName;
        }

        if (filterData.betaName === null || filterData.betaName === 'All' || filterData.betaName === 'All Employees') {
            btnWrap.appendChild(employeeBtnWrap);
            btnWrap.removeChild(employeeBtnWrap);
        }
        else {
            btnWrap.appendChild(employeeBtnWrap);
            document.getElementById('employeeBtn').innerHTML = 'Employee: ' + filterData.betaName;
        }
        if (filterData.categoryName === null || filterData.categoryName === 'All' || filterData.categoryName === 'All Categories') {
            btnWrap.appendChild(categoryBtnWrap);
            btnWrap.removeChild(categoryBtnWrap);
        }
        else {
            btnWrap.appendChild(categoryBtnWrap);
            document.getElementById('categoryBtn').innerHTML = 'Category / Subcategory: ' + filterData.categoryName;
        }

        if (filterData.show === null || filterData.show === 'All') {
            btnWrap.appendChild(showBtnWrap);
            btnWrap.removeChild(showBtnWrap);
        }
        else {
            btnWrap.appendChild(showBtnWrap);
            document.getElementById('showBtn').innerHTML = 'Show: ' + filterData.show;
        }

        document.getElementById('supervisorBtn').innerHTML = 'Supervisor: ' + filterData.alphaName;
        document.getElementById('fromDateBtn').innerHTML = 'From Date: ' + UTIL.formatDateFromIso(filterData.fromDate);
        document.getElementById('toDateBtn').innerHTML = 'To Date: ' + UTIL.formatDateFromIso(filterData.toDate);

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
            text: 'Supervisor: ' + filterData.alphaName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('supervisorBtn') },
        });

        locationBtn = button.build({
            id: 'locationBtn',
            text: 'Location: ' + filterData.locationName,
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

        consumerBtn = button.build({
            id: 'consumerBtn',
            text: 'Consumer: ' + filterData.consumerName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('consumerBtn') },
        });
        consumerCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('consumerBtn') },
        });

        employeeBtn = button.build({
            id: 'employeeBtn',
            text: 'Employee: ' + filterData.betaName,
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

        categoryBtn = button.build({
            id: 'categoryBtn',
            text: 'Category / Subcategory: ' + filterData.categoryName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('categoryBtn') },
        });
        categoryCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('categoryBtn') },
        });

        showBtn = button.build({
            id: 'showBtn',
            text: 'Show: ' + filterData.show,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('showBtn') },
        });
        showCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('showBtn') },
        });

        fromDateBtn = button.build({
            id: 'fromDateBtn',
            text: 'From Date: ' + UTIL.formatDateFromIso(filterData.fromDate),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('fromDateBtn') },
        });

        toDateBtn = button.build({
            id: 'toDateBtn',
            text: 'To Date: ' + UTIL.formatDateFromIso(filterData.toDate),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('toDateBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        supervisorBtnWrap = document.createElement('div');
        supervisorBtnWrap.classList.add('filterSelectionBtnWrap');
        supervisorBtnWrap.appendChild(supervisorBtn);
        btnWrap.appendChild(supervisorBtnWrap);

        locationBtnWrap = document.createElement('div');
        locationBtnWrap.classList.add('filterSelectionBtnWrap');
        locationBtnWrap.appendChild(locationBtn);
        locationBtnWrap.appendChild(locationCloseBtn);
        btnWrap.appendChild(locationBtnWrap);

        consumerBtnWrap = document.createElement('div');
        consumerBtnWrap.classList.add('filterSelectionBtnWrap');
        consumerBtnWrap.appendChild(consumerBtn);
        consumerBtnWrap.appendChild(consumerCloseBtn);
        btnWrap.appendChild(consumerBtnWrap);

        employeeBtnWrap = document.createElement('div');
        employeeBtnWrap.classList.add('filterSelectionBtnWrap');
        employeeBtnWrap.appendChild(employeeBtn);
        employeeBtnWrap.appendChild(employeeCloseBtn);
        btnWrap.appendChild(employeeBtnWrap);

        categoryBtnWrap = document.createElement('div');
        categoryBtnWrap.classList.add('filterSelectionBtnWrap');
        categoryBtnWrap.appendChild(categoryBtn);
        categoryBtnWrap.appendChild(categoryCloseBtn);
        btnWrap.appendChild(categoryBtnWrap);

        showBtnWrap = document.createElement('div');
        showBtnWrap.classList.add('filterSelectionBtnWrap');
        showBtnWrap.appendChild(showBtn);
        showBtnWrap.appendChild(showCloseBtn);
        btnWrap.appendChild(showBtnWrap);

        fromDateBtnWrap = document.createElement('div');
        fromDateBtnWrap.classList.add('filterSelectionBtnWrap');
        fromDateBtnWrap.appendChild(fromDateBtn);
        btnWrap.appendChild(fromDateBtnWrap);

        toDateBtnWrap = document.createElement('div');
        toDateBtnWrap.classList.add('filterSelectionBtnWrap');
        toDateBtnWrap.appendChild(toDateBtn);
        btnWrap.appendChild(toDateBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'locationBtn') {
            filterData.locationName = 'All';
            retrieveData.locationId = '%';
            filterData.location = '%';
        }
        if (closeFilter == 'consumerBtn') {
            filterData.consumerName = 'All';
            retrieveData.consumerId = '%';
            filterData.consumer = '%';
        }
        if (closeFilter == 'employeeBtn') {
            retrieveData.employeeId = '%';
            filterData.beta = '%';
            filterData.betaName = 'All';
        }
        if (closeFilter == 'categoryBtn') {
            retrieveData.subcategoryId = '%';
            filterData.category = '%';
            filterData.categoryName = 'All';
        }

        if (closeFilter == 'showBtn') {
            filterData.show = 'All';
        }

        populateSelectedFilterValues();
        incidentTrackingAjax.getITReviewTableData(retrieveData, populateOverviewTable);
    }

    function saveFilterData(data) {
        filterData.alpha = data.alphaId ? data.alphaId : filterData.alpha;
        filterData.alphaName = data.alphaName ? data.alphaName : filterData.alphaName;
        filterData.beta = data.betaId ? data.betaId : filterData.beta;
        filterData.betaName = data.betaName ? data.betaName : filterData.betaName;
        filterData.location = data.locationId ? data.locationId : filterData.location;
        filterData.locationName = data.locationName ? data.locationName : data.locationName == '' ? null : filterData.locationName;
        filterData.consumer = data.consumerId ? data.consumerId : filterData.consumer;
        filterData.consumerName = data.consumerName ? data.consumerName : filterData.consumerName;
        filterData.category = data.categoryId ? data.categoryId : filterData.category;
        filterData.categoryName = data.categoryName ? data.categoryName : filterData.categoryName;
        filterData.fromDate = data.fromDate ? data.fromDate : filterData.fromDate;
        filterData.toDate = data.toDate ? data.toDate : filterData.toDate;
        filterData.show = data.show ? data.show : filterData.show;
    }
    function populateFilterDropdowns() {
        incidentTrackingAjax.getReviewPageLocations(populateLocationsDropdown);
        //incidentTrackingAjax.getReviewPageLocations(populateConsumersDropdown);
        getConsumerDropdownData();
        incidentTrackingAjax.getIncidentCategories(populateCategoriesDropdown);
        incidentTrackingAjax.getITReviewPageEmployeeListAndSubList(
            $.session.PeopleId,
            populateUserAndEmployeeDropdowns,
        );
    }
    function getFromDateValue() {
        if (filterData.fromDate) return filterData.fromDate;

        var fromDate = convertDaysBack($.session.defaultIncidentTrackingDaysBack);
        filterData.fromDate = fromDate;
        return fromDate;
    }
    function getToDateValue() {
        if (filterData.toDate) return filterData.toDate;

        var today = UTIL.getTodaysDate();
        filterData.toDate = today;
        return today;
    }
    function buildFilterPopup(IsShow) {
        filterPopup = POPUP.build({
            classNames: ['incidentTrackingFilterPopup'],
        });

        alphaDropdown = dropdown.build({
            dropdownId: 'locationDropdown',
            label: 'Supervisor',
            style: 'secondary',
        });
        locationDropdown = dropdown.build({
            dropdownId: 'locationDropdown',
            label: 'Location',
            style: 'secondary',
        });
        consumerDropdown = dropdown.build({
            dropdownId: 'consumerDropdown',
            label: 'Consumer',
            style: 'secondary',
        });
        betaDropdown = dropdown.build({
            dropdownId: 'locationDropdown',
            label: 'Employee',
            style: 'secondary',
        });
        categoryDropdown = dropdown.build({
            dropdownId: 'locationDropdown',
            label: 'Category/Subcategory',
            style: 'secondary',
        });
        showDropdown = dropdown.build({
            dropdownId: 'showDropdown',
            label: "Show",
            style: "secondary"
        });
        fromDateInput = input.build({
            label: 'From Date',
            type: 'date',
            style: 'secondary',
            value: getFromDateValue(),
        });
        toDateInput = input.build({
            label: 'To Date',
            type: 'date',
            style: 'secondary',
            value: getToDateValue(),
        });
        applyFilterBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });

        // Build Popup
        if (IsShow == 'ALL' || IsShow == 'supervisorBtn')
            filterPopup.appendChild(alphaDropdown);
        if (IsShow == 'ALL' || IsShow == 'locationBtn')
            filterPopup.appendChild(locationDropdown);
        if (IsShow == 'ALL' || IsShow == 'consumerBtn')
            filterPopup.appendChild(consumerDropdown);
        if (IsShow == 'ALL' || IsShow == 'employeeBtn')
            filterPopup.appendChild(betaDropdown);
        if (IsShow == 'ALL' || IsShow == 'categoryBtn')
            filterPopup.appendChild(categoryDropdown);
        if (IsShow == 'ALL' || IsShow == 'showBtn')
            filterPopup.appendChild(showDropdown);
        if (IsShow == 'ALL' || IsShow == 'fromDateBtn')
            filterPopup.appendChild(fromDateInput);
        if (IsShow == 'ALL' || IsShow == 'toDateBtn')
            filterPopup.appendChild(toDateInput);

        filterPopup.appendChild(applyFilterBtn);

        // Populate Dropodowns
        populateFilterDropdowns();
    }
    function showFilterPopup(IsShow) {
        // popup
        buildFilterPopup(IsShow);
        POPUP.show(filterPopup);
        // Setup Events
        filterDropdownEventSetup();
    }
    function setupFiltering() {
        const filterAndReportsBtnsWrap = document.createElement('div');
        filterAndReportsBtnsWrap.classList.add('filterAndReportsBtnsWrap');

        function getFilterValues() {
            return (filterValues = {
                ITLocation: retrieveData.locationId,
                ITConsumer: retrieveData.consumerId ? retrieveData.consumerId : '%',
                ITFromDate: filterData.fromDate,
                ITToDate: filterData.toDate,
            });
        }
        // Helper function to create the main reports button on the module page
        function createMainReportButton(buttonsData) {
            return button.build({
                text: 'Reports',
                icon: 'add',
                style: 'secondary',
                type: 'contained',
                classNames: 'reportBtn',
                callback: function () {
                    // Iterate through each item in the buttonsData array
                    buttonsData.forEach(function (buttonData) {
                        buttonData.filterValues = getFilterValues();
                    });

                    generateReports.showReportsPopup(buttonsData);
                },
            });
        }

        reportsBtn = createMainReportButton([{ text: 'Incident Reporting Log' }]);

        DOM.ACTIONCENTER.appendChild(filterAndReportsBtnsWrap);
        filterAndReportsBtnsWrap.appendChild(reportsBtn);

        buildFilterPopup('ALL');
    }
    function filterDropdownEventSetup() {
        var tmpAlphaId;
        var tmpAlphaName;
        var tmpBetaId;
        var tmpBetaName;
        var tmpLocationId;
        var tmpLocationName;
        var tmpConsumerId;
        var tmpConsumerName;
        var tmpCategoryId;
        var tmpCategoryName;
        var tmpToDate;
        var tmpFromDate;
        var tmpShow;

        alphaDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            selectedAlphaId = selectedOption.value;
            // update retrieveData obj
            retrieveData.supervisorId = selectedAlphaId;
            retrieveData.locationId = '%';
            retrieveData.consumerId = '%';
            retrieveData.employeeId = '%';
            retrieveData.subcategoryId = '%';
            retrieveData.viewCaseLoad = $.session.incidentTrackingViewCaseLoad;
            // temp cache data
            tmpAlphaId = selectedAlphaId;
            tmpAlphaName = selectedOption.innerHTML;
            // re populate beta dropwond based off selected alpha
            alphaBetaData.forEach(d => {
                if (d.alpha.personId === selectedAlphaId) {
                    changedSelectedAlphaBetas = d.betas;
                    populateBetas(d.betas);
                }
            });
        });
        betaDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            selectedBetaData.id = selectedOption.value;
            selectedBetaData.name = selectedOption.innerHTML;
            retrieveData.employeeId = selectedBetaData.id;

            // temp cache data
            tmpBetaId = selectedBetaData.id;
            tmpBetaName = selectedBetaData.name;
        });
        locationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            retrieveData.locationId = selectedOption.value;
            // temp cache data  
            tmpLocationId = selectedOption.value;
            tmpLocationName = selectedOption.innerHTML;
        });
        consumerDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            retrieveData.consumerId = selectedOption.value;
            // temp cache data
            tmpConsumerId = selectedOption.value;
            tmpConsumerName = selectedOption.innerHTML;
        });
        categoryDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            retrieveData.subcategoryId = selectedOption.value;
            // temp cache data
            tmpCategoryId = selectedOption.value;
            tmpCategoryName = selectedOption.innerHTML;
        });
        showDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            // temp cache data
            tmpShow = selectedOption.innerHTML;
        });
        toDateInput.addEventListener('change', event => {
            var selectedDate = event.target.value;
            if (selectedDate === '') {
                toDateInput.classList.add('error');
                applyFilterBtn.classList.add('disabled');
            } else {
                toDateInput.classList.remove('error');
                applyFilterBtn.classList.remove('disabled');
            }
            retrieveData.toDate = selectedDate;
            filterData.toDate = selectedDate;
            toDateVal = selectedDate;
            // temp cache data
            tmpToDate = selectedDate;
        });
        fromDateInput.addEventListener('change', event => {
            var selectedDate = event.target.value;
            if (selectedDate === '') {
                fromDateInput.classList.add('error');
                applyFilterBtn.classList.add('disabled');
            } else {
                fromDateInput.classList.remove('error');
                applyFilterBtn.classList.remove('disabled');
            }
            retrieveData.fromDate = selectedDate;
            // temp cache data
            tmpFromDate = selectedDate;
        });

        applyFilterBtn.addEventListener('click', event => {
            POPUP.hide(filterPopup);
            saveFilterData({
                alphaId: tmpAlphaId,
                alphaName: tmpAlphaName,
                betaId: tmpBetaId,
                betaName: tmpBetaName,
                locationId: tmpLocationId,
                locationName: tmpLocationName,
                consumerId: tmpConsumerId,
                consumerName: tmpConsumerName,
                categoryId: tmpCategoryId,
                categoryName: tmpCategoryName,
                toDate: tmpToDate,
                fromDate: tmpFromDate,
                show: tmpShow
            });
            populateSelectedFilterValues();
            incidentTrackingAjax.getITReviewTableData(retrieveData, populateOverviewTable);
        });
    }
    // Dropdowns
    //------------------------------------
    function populateAlphas(alphas) {
        var data = alphas.map(a => {
            var value = a.personId;
            var text = `${a.lastName}, ${a.firstName}`;

            return {
                value,
                text,
            };
        });

        if (filterData.alpha) {
            dropdown.populate(alphaDropdown, data, filterData.alpha);
        } else {
            dropdown.populate(alphaDropdown, data);
            filterData.alpha = data[0].value;
            filterData.alphaName = data[0].text;
        }
    }
    function populateBetas(betas) {
        var data = betas.map(b => {
            var value = b.personId;
            var text = `${b.lastName}, ${b.firstName}`;

            return {
                value,
                text,
            };
        });

        var defaultOption = {
            value: '%',
            text: 'All',
        };
        data.unshift(defaultOption);

        var filteredBetas = betas.filter(b => b.personId === filterData.beta);

        if (filteredBetas.length > 0) {
            dropdown.populate(betaDropdown, data, filterData.beta);
        } else {
            dropdown.populate(betaDropdown, data);
            filterData.betaName = 'All Employees';
        }
    }
    function populateUserAndEmployeeDropdowns(res) {
        function decipherXML(res) {
            var xmlDoc,
                allEmployees = [];
            xmlDoc = UTIL.parseXml(
                '<?xml version="1.0" encoding="UTF-8"?>' + res.getITReviewPageEmployeeListAndSubListResult,
            );

            var employeeobjectArray = [].slice.call(xmlDoc.getElementsByTagName('employeeobject'));
            employeeobjectArray.forEach(employeeObject => {
                var alphaNode = [].slice.call(employeeObject.getElementsByTagName('alpha'))[0];
                var betasNode = [].slice.call(employeeObject.getElementsByTagName('beta'));
                var alpha = {
                    personId: [].slice.call(alphaNode.getElementsByTagName('personid'))[0].textContent,
                    firstName: [].slice.call(alphaNode.getElementsByTagName('firstname'))[0].textContent,
                    lastName: [].slice.call(alphaNode.getElementsByTagName('lastname'))[0].textContent,
                    userName: [].slice.call(alphaNode.getElementsByTagName('username'))[0].textContent,
                };
                var betas = [];
                if (betasNode !== undefined) {
                    betasNode.forEach(betaNode => {
                        var beta = {
                            personId: [].slice.call(betaNode.getElementsByTagName('personid'))[0].textContent,
                            firstName: [].slice.call(betaNode.getElementsByTagName('firstname'))[0].textContent,
                            lastName: [].slice.call(betaNode.getElementsByTagName('lastname'))[0].textContent,
                            userName: [].slice.call(betaNode.getElementsByTagName('username'))[0].textContent,
                        };
                        betas.push(beta);
                    });
                }
                var alphaAndBeta;
                if (betas.length > 0) {
                    alphaAndBeta = {
                        alpha: alpha,
                        betas: betas,
                    };
                } else {
                    alphaAndBeta = {
                        alpha: alpha,
                        betas: [],
                    };
                }
                allEmployees.push(alphaAndBeta);
            });
            return allEmployees;
        }

        alphaBetaData = decipherXML(res);
        var defaultAlpha;
        var alphas = [];
        // move default alpha to start
        alphaBetaData = alphaBetaData.filter(d => {
            if (d.alpha.personId === $.session.PeopleId) defaultAlpha = d;
            return d.alpha.personId !== $.session.PeopleId;
        });
        alphaBetaData.unshift(defaultAlpha);
        // set aside alphas
        alphaBetaData.forEach(d => {
            if (d !== undefined) {
                alphas.push(d.alpha);
            }
        });
        // initial population of dropdowns
        populateAlphas(alphas);
        if (!changedSelectedAlphaBetas) {
            populateBetas(alphaBetaData[0].betas);
        } else {
            populateBetas(changedSelectedAlphaBetas);
        }
    }
    function populateLocationsDropdown(res) {
        var data = res.map(r => {
            var value = r.ID;
            var text = r.Name;

            return {
                value,
                text,
            };
        });

        var defaultOption = {
            value: '%',
            text: 'All',
        };
        data.unshift(defaultOption);

        if (filterData.location) {
            dropdown.populate(locationDropdown, data, filterData.location);
        } else {
            dropdown.populate(locationDropdown, data);
            filterData.locationName = 'All Locations';
        }

        const showDropdownData = ([
            { id: 1, value: 'Unread', text: 'Unread' },
            { id: 2, value: 'Read', text: 'Read' },
        ]);
        showDropdownData.unshift({ id: null, value: 'All', text: 'All' });
        dropdown.populate(showDropdown, showDropdownData, filterData.show);
    }

    function populateConsumersDropdown() {
        populateDropdownData = consumerDropdownData.map(el => {
            return {
                text: `${el.LN}, ${el.FN}`,
                value: el.id,
            };
        });
        populateDropdownData.unshift({ text: 'All', value: '%' });

        if (filterData.consumer) {
            dropdown.populate(consumerDropdown, populateDropdownData, filterData.consumer);
        } else {
            dropdown.populate(consumerDropdown, populateDropdownData);
            filterData.consumerName = 'All Consumers';
        }
    }

    function getConsumerDropdownData() {
        return new Promise((resolve, reject) => {
            caseNotesAjax.getConsumersForCNFilter(res => {
                consumerDropdownData = res;
                populateConsumersDropdown();
                resolve('success');
            });
        });
    }

    function populateCategoriesDropdown(res) {
        var data = res.map(r => {
            var value = r.subcategoryId;
            var text = r.incidentCategory;

            return {
                value,
                text,
            };
        });

        var defaultOption = {
            value: '%',
            text: 'All',
        };
        data.unshift(defaultOption);

        if (filterData.category) {
            dropdown.populate(categoryDropdown, data, filterData.category);
        } else {
            dropdown.populate(categoryDropdown, data);
            filterData.categoryName = 'All Categories';
        }
    }
    // Incident Overview Email Button and Popup
    async function showIncidentEmailPopup(incidentId, consumerId) {
        //*--------------------------------------
        //* POPUP
        //*--------------------------------------
        const incidentEmailPopup = POPUP.build({
            header: 'Email Report',
            id: 'sig_mainPopup',
        });

        const importFromRelationshipsBtn = button.build({
            text: 'SELECT FROM RELATIONSHIPS',
            type: 'contained',
            style: 'secondary',
            callback: () => {
                popFromRelationships(consumerId);
            },
        });
        importFromRelationshipsBtn.style.width = '100%';

        //* INPUTS
        //*------------------------------
        const toAddress = input.build({
            label: 'Email To Addresses:',
            callbackType: 'input',
            id: 'toAddress',
            callback: event => {
                // If the toAddresses field is blank, disable the send button
                const inputField = document.getElementById('toAddress');
                if (inputField.value === '') {
                    sendBtn.classList.add('disabled');
                } else {
                    sendBtn.classList.remove('disabled');
                }

                // set value of report email data to input value
                incidentTrackingEmailData.toAddresses = event.target.value;
            },
        });

        const ccAddress = input.build({
            label: 'Email Cc Addresses:',
            callbackType: 'input',
            callback: event => {
                // set value of report email data to input value
                incidentTrackingEmailData.ccAddresses = event.target.value;
            },
        });

        const bccAddress = input.build({
            label: 'Email Bcc Addresses:',
            callbackType: 'input',
            callback: event => {
                // set value of report email data to input value
                incidentTrackingEmailData.bccAddresses = event.target.value;
            },
        });

        const emailSubject = input.build({
            label: 'Email Subject:',
            callbackType: 'input',
            value: 'Incidents [Composite] by Consumer, Date',
            callback: event => {
                // set value of report email data to input value
                incidentTrackingEmailData.emailSubject = event.target.value;
            },
        });

        const emailBody = input.build({
            label: 'Email Body:',
            callbackType: 'input',
            type: 'textarea',
            classNames: 'autosize',
            callback: event => {
                // set value of report email data to input value
                incidentTrackingEmailData.emailBody = event.target.value;
            },
        });

        //* BUTTONS
        //*------------------------------
        const sendBtn = button.build({
            id: 'incidentEmailSendBtn',
            text: 'send',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                incidentTrackingAjax.generateIncidentTrackingReport(
                    incidentId,
                    checkIfITReportIsReadyInterval,
                );
                POPUP.hide(incidentEmailPopup);
            },
        });

        const cancelBtn = button.build({
            id: 'incidentEmailPopup_cancel',
            text: 'cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(incidentEmailPopup);
            },
        });

        const result = await incidentTrackingAjax.getRelationshipData(consumerId);
        const { getRelationshipDataResult } = result;
        gkRelationships = getRelationshipDataResult;

        //* Add elements to popup
        //*------------------------------
        incidentEmailPopup.appendChild(importFromRelationshipsBtn);
        if (gkRelationships.length == 0) importFromRelationshipsBtn.classList.add('disabled');
        incidentEmailPopup.appendChild(toAddress);
        incidentEmailPopup.appendChild(ccAddress);
        incidentEmailPopup.appendChild(bccAddress);
        incidentEmailPopup.appendChild(emailSubject);
        incidentEmailPopup.appendChild(emailBody);

        const mainWrap = document.createElement('div');
        const btnWrap2 = document.createElement('div');
        btnWrap2.classList.add('btnWrap');
        btnWrap2.appendChild(sendBtn);
        sendBtn.classList.add('disabled');
        btnWrap2.appendChild(cancelBtn);
        mainWrap.appendChild(btnWrap2);
        incidentEmailPopup.appendChild(mainWrap);

        POPUP.show(incidentEmailPopup);
    }

    async function popFromRelationships(consumerId) {
        const mainPopup = document.getElementById('sig_mainPopup');
        const emailSendBtn = document.getElementById('incidentEmailSendBtn');
        mainPopup.style.display = 'none';

        const importPopup = POPUP.build({
            id: 'sig_importPopup',
            closeCallback: () => {
                overlay.show();
                mainPopup.style.removeProperty('display');
            },
        });
        const relationshipSection = document.createElement('div');

        relationshipDoneBtn = button.build({
            id: 'incidentDoneBtn',
            text: 'Done',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(importPopup);
                selectedRelation = selectedRelation.filter(n => n);
                emailString = selectedRelation.toString().replaceAll(",", ";");  
                document.getElementById('toAddress').value = emailString;
                incidentTrackingEmailData.toAddresses = emailString; 
                if (emailString == '')
                    emailSendBtn.classList.add('disabled');
                else
                    emailSendBtn.classList.remove('disabled');
                overlay.show();
                mainPopup.style.removeProperty('display');
                selectedRelation = [];
            },
        });

        relationshipCancelBtn = button.build({
            id: 'incidentCancelBtn',
            text: 'cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(importPopup);
            },
        });
        gkRelationships.forEach(rel => {
            const name = contactInformation.cleanName(rel);
            const address = contactInformation.cleanAddress(rel, true);
            const cityStateZip = contactInformation.cleanCityStateZip(rel);

            const relationshipDisp = document.createElement('div');
            relationshipDisp.innerHTML = `Name: <span>${name}</span>`;
            relationshipDisp.classList.add('sig_gkRelationships');

            relationshipDisp.addEventListener('click', e => {
                const isSelected = e.target.classList.contains('selected');
                if (isSelected) {
                    e.target.classList.remove('selected');
                    selectedRelation = selectedRelation.filter(e => e !== rel.email);
                } else {
                    e.target.classList.add('selected');
                    selectedRelation.push(rel.email);
                }
                toggleAssignButton();
            });

            relationshipSection.appendChild(relationshipDisp);
        });

        importPopup.appendChild(relationshipSection);

        const mainWrap = document.createElement('div');
        const btnWrap2 = document.createElement('div');
        btnWrap2.classList.add('btnWrap');
        btnWrap2.appendChild(relationshipDoneBtn);
        relationshipDoneBtn.classList.add('disabled');
        btnWrap2.appendChild(relationshipCancelBtn);
        mainWrap.appendChild(btnWrap2);
        importPopup.appendChild(mainWrap);

        POPUP.show(importPopup);

    }

    function toggleAssignButton() {
        if (selectedRelation.length === 0) {
            relationshipDoneBtn.classList.add('disabled');
            return;
        }
        relationshipDoneBtn.classList.remove('disabled');
    }

    // Repeatedly checks to see if the report is ready
    function checkIfITReportIsReadyInterval(res) {
        seconds = parseInt($.session.reportSeconds);
        intSeconds = seconds * 1000;
        interval = setInterval(async () => {
            await checkITReportExists(res);
        }, intSeconds);
    }

    async function checkITReportExists(res) {
        await incidentTrackingAjax.checkIfITReportExists(res, callITReport);
    }

    // Retrieves the report when it is ready
    function callITReport(res, reportScheduleId) {
        if (res.indexOf('1') === -1) {
            //do nothing
        } else {
            incidentTrackingAjax.sendIncidentTrackingReport(reportScheduleId, incidentTrackingEmailData);
            clearInterval(interval);
            reportRunning = false;

            // Reset values of email data
            incidentTrackingEmailData = { emailSubject: 'Incidents [Composite] by Consumer, Date' };
        }
    }

    // OVERVIEW TABLE
    //------------------------------------
    function buildOverviewTable() {
        populateSelectedFilterValues();

        if (!$.session.incidentTrackingEmailIncident) {
            var tableOptions = {
                tableId: 'incidentOverviewTable',
                heading: 'Incident Overview',
                columnHeadings: ['Location', 'Entered By', 'Date', 'Time', 'Type', 'Consumer(s) Involved'],
            };
        } else {
            var tableOptions = {
                tableId: 'incidentOverviewTable',
                heading: 'Incident Overview',
                columnHeadings: ['Location', 'Entered By', 'Date', 'Time', 'Type', 'Consumer(s) Involved'],
                endIcon: true,
            };
        }

        overviewTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = overviewTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Location
        headers[1].setAttribute('data-type', 'string'); // Entered By
        headers[2].setAttribute('data-type', 'date'); //Date
        headers[3].setAttribute('data-type', 'date'); // Time
        headers[4].setAttribute('data-type', 'string'); // Type 
        headers[5].setAttribute('data-type', 'string'); // Consumer(s) Involved 


        DOM.ACTIONCENTER.appendChild(overviewTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(overviewTable);
    }
    function populateOverviewTable(res) {
        var incidents = {};
        res.forEach(r => {
            if (!incidents[r.incidentId]) {
                incidents[r.incidentId] = r;
            } else {
                const dupName = incidents[r.incidentId].consumerName.includes(r.consumerName);
                if (!dupName) {
                    incidents[r.incidentId].consumerName += `, ${r.consumerName}`;
                }
                incidents[r.incidentId].viewedBy += `, ${r.viewedBy}`;
            }
        });

        var keys = Object.keys(incidents);
        const removeArray = [];
        var count = 0;
        var data = keys
            .filter(k => {
                var obj = incidents[k];

                if ($.session.incidentTrackingViewPerm.length !== 0) {
                    if (
                        obj.description !== '' &&
                        !$.session.incidentTrackingViewPerm.includes(obj.description.toLowerCase())
                    ) {
                        return false;
                    }
                }

                return true;
            })
            .map(key => {
                var obj = incidents[key];

                var rowId = obj.incidentId;
                var location = obj.locationName;
                var enteredBy = obj.supervisorName;
                var date = obj.incidentDate.split(' ')[0];
                var time = UTIL.convertFromMilitary(obj.incidentTime);
                var category = obj.incidentCategory;
                var consumersInvolved = obj.consumerName.replace(/\|/g, ', ');
                var viewedOn = obj.viewedOn ? true : false;
                var orginUser =
                    obj.originallyEnteredBy.toLowerCase() === $.session.UserId.toLowerCase() ? true : false;
                var userHasViewed = obj.viewedBy.includes($.session.UserId) ? true : false;
                var showBold;

                if (!orginUser && !userHasViewed) {
                    showBold = true;
                }

                if (filterData.show == 'Read' && showBold) {
                    removeArray.push(count);
                }
                else if (filterData.show == 'Unread' && !showBold) {
                    removeArray.push(count);
                }
                count = count + 1;
                var incidentEmailBtn = document.createElement('button');
                incidentEmailBtn.classList.add('btn', 'btn--secondary', 'btn--contained');
                incidentEmailBtn.textContent = 'EMAIL';
                incidentEmailBtn.style.zIndex = '9999';

                if (!$.session.incidentTrackingEmailIncident) {
                    return {
                        id: rowId,
                        values: [location, enteredBy, date, time, category, consumersInvolved],
                        attributes: [{ key: 'data-viewed', value: showBold }],
                        onClick: async event => {
                            await incidentTrackingAjax.updateIncidentViewByUser({
                                token: $.session.Token,
                                incidentId: rowId,
                                userId: $.session.UserId,
                            });
                            DOM.scrollToTopOfPage();
                            reviewIncident.init(event.target.id);
                        },
                    };
                } else {
                    return {
                        id: rowId,
                        values: [location, enteredBy, date, time, category, consumersInvolved],
                        attributes: [{ key: 'data-viewed', value: showBold }],
                        endIcon: incidentEmailBtn.outerHTML,
                        endIconCallback: e => {
                            e.stopPropagation();
                            var isParentRow = e.target.parentNode.classList.contains('table__row');
                            if (!isParentRow) return;

                            showIncidentEmailPopup(obj.incidentId, obj.consumerId);
                        },
                        onClick: async event => {
                            await incidentTrackingAjax.updateIncidentViewByUser({
                                token: $.session.Token,
                                incidentId: rowId,
                                userId: $.session.UserId,
                            });
                            DOM.scrollToTopOfPage();
                            reviewIncident.init(event.target.id);
                        },
                    };
                }
            });

        for (let i = removeArray.length - 1; i >= 0; i--)
            data.splice(removeArray[i], 1);

        data.sort(function (a, b) {
            var dateOne = UTIL.formatDateToIso(a.values[2]);
            var dateTwo = UTIL.formatDateToIso(b.values[2]);
            dateOne = new Date(dateOne);
            dateTwo = new Date(dateTwo);
            var newDateOne = dateOne.getTime();
            var newDateTwo = dateTwo.getTime();

            var timeOne = a.values[3];
            var timeTwo = b.values[3];
            timeOne = UTIL.convertToMilitary(timeOne);
            timeTwo = UTIL.convertToMilitary(timeTwo);
            timeOne = parseFloat(`${parseInt(timeOne.split(':')[0])}.${parseInt(timeOne.split(':')[1])}`);
            timeTwo = parseFloat(`${parseInt(timeTwo.split(':')[0])}.${parseInt(timeTwo.split(':')[1])}`);

            if (newDateOne === newDateTwo) {
                return timeOne - timeTwo;
            }

            return newDateOne > newDateTwo ? -1 : 1;
        });

        table.populate(overviewTable, data);
    }

    function init() {
        setActiveModuleSectionAttribute('incidentTracking-overview');
        DOM.clearActionCenter();

        retrieveData.supervisorId = $.session.PeopleId;
        retrieveData.token = $.session.Token;
        retrieveData.viewCaseLoad = $.session.incidentTrackingViewCaseLoad;
        retrieveData.toDate = getToDateValue();
        retrieveData.fromDate = getFromDateValue();

        setupFiltering();

        //never need mini roster on reviews
        roster2.removeMiniRosterBtn();

        incidentTrackingAjax.getITReviewTableData(retrieveData, function (results) {
            buildOverviewTable();
            populateOverviewTable(results);
        });
    }

    return {
        init,
    };
})();
