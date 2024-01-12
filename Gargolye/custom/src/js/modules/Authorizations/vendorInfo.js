const vendorInfo = (function () {
    let SEARCH_WRAP;
    let SEARCH_BTN;
    let SEARCH_INPUT;
    let userTableData = [];
    let tempUserTableData = [];
    let displayedUsers = [];
    var userTable;

    let btnWrap;
    let vendorBtnWrap;
    let DDNumberBtnWrap;
    let localNumberBtnWrap;
    let goodStandingBtnWrap;
    let homeServicesBtnWrap;
    let takingNewReferralsBtnWrap;
    let fundingSourceBtnWrap;
    let serviceCodeBtnWrap;

    //filter
    let filterValues;
    function init() {
        filterValues = undefined;
        vendorInfoLoad();
    }

    async function vendorInfoLoad() {
        DOM.clearActionCenter();
        const topNav = buildRosterTopNav();
        userTable = buildTable();
        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        const filteredBy = buildFilteredBy();
        filterRow.appendChild(filteredBy);
        topNav.classList.add('marginBottomFilter');

        DOM.ACTIONCENTER.appendChild(topNav);
        DOM.ACTIONCENTER.appendChild(filterRow);
        DOM.ACTIONCENTER.appendChild(userTable);

        SEARCH_BTN.addEventListener('click', event => {
            SEARCH_WRAP.classList.toggle('searchOpen');
            SEARCH_INPUT.value = '';
            SEARCH_INPUT.focus();
        });

        SEARCH_INPUT.addEventListener('keyup', event => {
            tableUserSearch(event.target.value);
        });
        loadReviewPage();
        document.getElementById('searchBtn').click();
    }

    function buildSearchBtn() {
        return button.build({
            id: 'searchBtn',
            text: 'Search',
            icon: 'search',
            style: 'secondary',
            type: 'contained',
            classNames: ['searchBtn'],
        });
    }

    function buildNewFilterBtn() {
        if (!filterValues) filterValues = {
            token: $.session.Token,
            vendor: '%',
            DDNumber: '',
            localNumber: '',
            goodStanding: '%',
            homeServices: '%',
            takingNewReferrals: '%',
            fundingSource: '%',
            serviceCode: '%',
        }
    }

    function buildTable() {
        var tableOptions = {
            plain: false,
            headline: 'Vendor Info',
            tableId: 'vendorInfoTable',
            columnHeadings: ['Name', 'DD Number', 'Local Number', 'Contact', 'Phone'],
            callback: handleVendorInfoTableEvents,
            endIcon: false,
            secondendIcon: false,
        };

        return table.build(tableOptions);
    }

    function populateTable(results, IsFirstLoad) {
        userTableData = results.map(td => {
            var vendorID = td.vendorID;
            var name = td.name;
            var DDNumber = td.DDNumber;
            var localNumber = td.localNumber;
            var contact = td.contact;
            var phone = td.phone;

            return {
                vendorID: vendorID,
                name: name,
                DDNumber: DDNumber,
                localNumber: localNumber,
                contact: contact,
                phone: phone,
                values: [name, DDNumber, localNumber, contact, formatPhoneNumber(phone)],
                attributes: [
                    { key: 'vendorId', value: vendorID },
                ],
            };
        });
        if (IsFirstLoad) {
            tempUserTableData = userTableData;
        }
        table.populate(userTable, userTableData, false, true);
    }

    function handleVendorInfoTableEvents(event) {
        var name = event.target.childNodes[0].innerText;
        var DDNum = event.target.childNodes[1].innerText;
        var localNum = event.target.childNodes[2].innerText;
        var phone = event.target.childNodes[4].innerText;
        var vendorId = event.target.attributes.vendorId.value;
        newVendorInfo.refreshVendor(vendorId, DDNum, localNum, phone, name);
    }

    function buildRosterTopNav() {
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('roster-top-nav');

        SEARCH_BTN = buildSearchBtn();
        buildNewFilterBtn();

        // custom search stuff
        SEARCH_WRAP = document.createElement('div');
        SEARCH_WRAP.classList.add('rosterSearch');
        SEARCH_INPUT = document.createElement('input');
        SEARCH_INPUT.setAttribute('placeholder', 'search vendors');
        SEARCH_WRAP.appendChild(SEARCH_BTN);
        SEARCH_WRAP.appendChild(SEARCH_INPUT);

        var wrap1 = document.createElement('div');
        wrap1.classList.add('btnWrap');
        wrap1.appendChild(SEARCH_WRAP);

        btnWrap.appendChild(wrap1);
        return btnWrap;
    }

    function tableUserSearch(searchValue) {
        searchValue = searchValue.toLowerCase();
        displayedUsers = [];

        tempUserTableData.forEach(consumer => {
            var Name = consumer.name.toLowerCase();
            var fullName = `${Name}`;
            var matchesName = fullName.indexOf(searchValue);

            if (matchesName !== -1) {
                consumerObj = {
                    vendorID: consumer.vendorID,
                    name: consumer.name,
                    DDNumber: consumer.DDNumber,
                    localNumber: consumer.localNumber,
                    contact: consumer.contact,
                    phone: consumer.phone,
                };
                displayedUsers.push(consumerObj);
            }
        });
        populateTable(displayedUsers, false);
    }

    function buildFilteredBy() {
        var filteredBy = document.querySelector('.filteredByData');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet();
            filteredBy.appendChild(btnWrap);
        }

        filteredBy.style.maxWidth = '100%';

        if (filterValues.vendor === '%' || filterValues.vendor === 'ALL') {
            btnWrap.appendChild(vendorBtnWrap);
            btnWrap.removeChild(vendorBtnWrap);
        } else {
            btnWrap.appendChild(vendorBtnWrap);
        }

        if (filterValues.DDNumber === '') {
            btnWrap.appendChild(DDNumberBtnWrap);
            btnWrap.removeChild(DDNumberBtnWrap);
        } else {
            btnWrap.appendChild(DDNumberBtnWrap);
        }

        if (filterValues.localNumber === '') {
            btnWrap.appendChild(localNumberBtnWrap);
            btnWrap.removeChild(localNumberBtnWrap);
        } else {
            btnWrap.appendChild(localNumberBtnWrap);
        }

        if (filterValues.goodStanding === '%' || filterValues.goodStanding === 'ALL') {
            btnWrap.appendChild(goodStandingBtnWrap);
            btnWrap.removeChild(goodStandingBtnWrap);
        } else {
            btnWrap.appendChild(goodStandingBtnWrap);
        }

        if (filterValues.homeServices === '%' || filterValues.homeServices === 'ALL') {
            btnWrap.appendChild(homeServicesBtnWrap);
            btnWrap.removeChild(homeServicesBtnWrap);
        } else {
            btnWrap.appendChild(homeServicesBtnWrap);
        }

        if (filterValues.takingNewReferrals === '%' || filterValues.takingNewReferrals === 'ALL') {
            btnWrap.appendChild(takingNewReferralsBtnWrap);
            btnWrap.removeChild(takingNewReferralsBtnWrap);
        } else {
            btnWrap.appendChild(takingNewReferralsBtnWrap);
        }

        if (filterValues.fundingSource === '%' || filterValues.fundingSource === 'ALL') {
            btnWrap.appendChild(fundingSourceBtnWrap);
            btnWrap.removeChild(fundingSourceBtnWrap);
        } else {
            btnWrap.appendChild(fundingSourceBtnWrap);
        }
        if (filterValues.serviceCode === '%' || filterValues.serviceCode === 'ALL') {
            btnWrap.appendChild(serviceCodeBtnWrap);
            btnWrap.removeChild(serviceCodeBtnWrap);
        } else {
            btnWrap.appendChild(serviceCodeBtnWrap);
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

        DDNumberBtn = button.build({
            id: 'DDNumberBtn',
            text: 'DD Number: ' + filterValues.DDNumber,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('DDNumberBtn') },
        });
        DDNumberCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('DDNumberBtn') },
        });

        localNumberBtn = button.build({
            id: 'localNumberBtn',
            text: 'Local Number: ' + filterValues.localNumber,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('localNumberBtn') },
        });
        localNumberCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('localNumberBtn') },
        });
        vendorBtn = button.build({
            id: 'vendorBtn',
            text: 'Vendor: ' + filterValues.vendor,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('vendorBtn') },
        });
        vendorCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('vendorBtn') },
        });

        goodStandingBtn = button.build({
            id: 'goodStandingBtn',
            text: filterValues.goodStanding == 'Y' ? 'In Good Standing: Yes' : 'In Good Standing: No',
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('goodStandingBtn') },
        });
        goodStandingCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('goodStandingBtn') },
        });

        homeServicesBtn = button.build({
            id: 'homeServicesBtn',
            text: filterValues.homeServices == 'Y' ? 'In Home Services: Yes' : 'In Home Services: No',
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('homeServicesBtn') },
        });
        homeServicesCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('homeServicesBtn') },
        });

        takingNewReferralsBtn = button.build({
            id: 'takingNewReferralsBtn',
            text: filterValues.takingNewReferrals == 'Y' ? 'Taking New Referrals: Yes' : 'Taking New Referrals: No',
            style: 'secondary', 
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('takingNewReferralsBtn') },
        });
        takingNewReferralsCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('takingNewReferralsBtn') },
        });

        fundingSourceBtn = button.build({
            id: 'fundingSourceBtn',
            text: 'Funding Source: ' + filterValues.fundingSource,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('fundingSourceBtn') },
        });
        fundingSourceCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('fundingSourceBtn') },
        });

        serviceCodeBtn = button.build({
            id: 'serviceCodeBtn',
            text: 'Service Code: ' + filterValues.serviceCode,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('serviceCodeBtn') },
        });
        serviceCodeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('serviceCodeBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        vendorBtnWrap = document.createElement('div');
        vendorBtnWrap.classList.add('filterSelectionBtnWrap');
        vendorBtnWrap.appendChild(vendorBtn);
        vendorBtnWrap.appendChild(vendorCloseBtn);
        btnWrap.appendChild(vendorBtnWrap);

        DDNumberBtnWrap = document.createElement('div');
        DDNumberBtnWrap.classList.add('filterSelectionBtnWrap');
        DDNumberBtnWrap.appendChild(DDNumberBtn);
        DDNumberBtnWrap.appendChild(DDNumberCloseBtn)
        btnWrap.appendChild(DDNumberBtnWrap);

        localNumberBtnWrap = document.createElement('div');
        localNumberBtnWrap.classList.add('filterSelectionBtnWrap');
        localNumberBtnWrap.appendChild(localNumberBtn);
        localNumberBtnWrap.appendChild(localNumberCloseBtn);
        btnWrap.appendChild(localNumberBtnWrap);

        goodStandingBtnWrap = document.createElement('div');
        goodStandingBtnWrap.classList.add('filterSelectionBtnWrap');
        goodStandingBtnWrap.appendChild(goodStandingBtn);
        goodStandingBtnWrap.appendChild(goodStandingCloseBtn);
        btnWrap.appendChild(goodStandingBtnWrap);

        homeServicesBtnWrap = document.createElement('div');
        homeServicesBtnWrap.classList.add('filterSelectionBtnWrap');
        homeServicesBtnWrap.appendChild(homeServicesBtn);
        homeServicesBtnWrap.appendChild(homeServicesCloseBtn);
        btnWrap.appendChild(homeServicesBtnWrap);

        takingNewReferralsBtnWrap = document.createElement('div');
        takingNewReferralsBtnWrap.classList.add('filterSelectionBtnWrap');
        takingNewReferralsBtnWrap.appendChild(takingNewReferralsBtn);
        takingNewReferralsBtnWrap.appendChild(takingNewReferralsCloseBtn)
        btnWrap.appendChild(takingNewReferralsBtnWrap);

        fundingSourceBtnWrap = document.createElement('div');
        fundingSourceBtnWrap.classList.add('filterSelectionBtnWrap');
        fundingSourceBtnWrap.appendChild(fundingSourceBtn);
        fundingSourceBtnWrap.appendChild(fundingSourceCloseBtn);
        btnWrap.appendChild(fundingSourceBtnWrap);

        serviceCodeBtnWrap = document.createElement('div');
        serviceCodeBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceCodeBtnWrap.appendChild(serviceCodeBtn);
        serviceCodeBtnWrap.appendChild(serviceCodeCloseBtn);
        btnWrap.appendChild(serviceCodeBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'DDNumberBtn') {
            filterValues.DDNumber = '';
        }
        if (closeFilter == 'localNumberBtn') {
            filterValues.localNumber = '';
        }
        if (closeFilter == 'vendorBtn') {
            filterValues.vendor = '%';
        }
        if (closeFilter == 'goodStandingBtn') {
            filterValues.goodStanding = '%';
        }
        if (closeFilter == 'homeServicesBtn') {
            filterValues.homeServices = '%';
        }
        if (closeFilter == 'fundingSourceBtn') {
            filterValues.fundingSource = '%';
        }
        if (closeFilter == 'serviceCodeBtn') {
            filterValues.serviceCode = '%';
        }
        if (closeFilter == 'takingNewReferralsBtn') {
            filterValues.takingNewReferrals = '%';
        }

        vendorInfoLoad();
    }


    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(IsShow) {
        // popup
        filterPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        // dropdowns & inputs 
        vendorDropdown = dropdown.build({
            id: 'vendorDropdown',
            label: "Vendors",
            dropdownId: "vendorDropdown",
        });

        DDNumberInput = input.build({
            id: 'DDNumberInput',
            type: 'text',
            label: 'DD Number',
            style: 'secondary',
            value: filterValues.DDNumber,
        });

        localNumberInput = input.build({
            id: 'localNumberInput',
            type: 'text',
            label: 'Local Number',
            style: 'secondary',
            value: filterValues.localNumber,
        });

        goodStandingDropdown = dropdown.build({
            id: 'goodStandingDropdown',
            label: "In Good Standing",
            dropdownId: "goodStandingDropdown",
        });

        homeServicesDropdown = dropdown.build({
            id: 'homeServicesDropdown',
            label: "In Home Services",
            dropdownId: "homeServicesDropdown",
        });

        takingNewReferralsDropdown = dropdown.build({
            id: 'takingNewReferralsDropdown',
            label: "Taking New Referrals",
            dropdownId: "takingNewReferralsDropdown",
        });

        fundingSourceDropdown = dropdown.build({
            id: 'fundingSourceDropdown',
            label: "Funding Source",
            dropdownId: "fundingSourceDropdown",
        });

        serviceCodeDropdown = dropdown.build({
            id: 'serviceCodeDropdown',
            label: "Service Code",
            dropdownId: "serviceCodeDropdown",
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

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        if (IsShow == 'ALL' || IsShow == 'vendorBtn')
            filterPopup.appendChild(vendorDropdown);
        if (IsShow == 'ALL' || IsShow == 'DDNumberBtn')
            filterPopup.appendChild(DDNumberInput);
        if (IsShow == 'ALL' || IsShow == 'localNumberBtn')
            filterPopup.appendChild(localNumberInput);
        if (IsShow == 'ALL' || IsShow == 'goodStandingBtn')
            filterPopup.appendChild(goodStandingDropdown);
        if (IsShow == 'ALL' || IsShow == 'homeServicesBtn')
            filterPopup.appendChild(homeServicesDropdown);
        if (IsShow == 'ALL' || IsShow == 'takingNewReferralsBtn')  
            filterPopup.appendChild(takingNewReferralsDropdown);
        if (IsShow == 'ALL' || IsShow == 'fundingSourceBtn')
            filterPopup.appendChild(fundingSourceDropdown);
        if (IsShow == 'ALL' || IsShow == 'serviceCodeBtn')
        filterPopup.appendChild(serviceCodeDropdown);

        filterPopup.appendChild(btnWrap);

        POPUP.show(filterPopup);
        eventListeners();
        populateFilterDropdown();
    }

    // binding filter events 
    function eventListeners() {
        var tmpVendor;
        var tmpDDNumber;
        var tmpLocalNumber;
        var tmpGoodStanding;
        var tmpHomeServices;
        var tmpTakingNewReferrals;
        var tmpFundingSource;
        var tmpServiceCode;

        vendorDropdown.addEventListener('change', event => {
            tmpVendor = event.target.value;
        });
        DDNumberInput.addEventListener('input', event => {
            tmpDDNumber = event.target.value;
        });
        localNumberInput.addEventListener('input', event => {
            tmpLocalNumber = event.target.value;
        });
        goodStandingDropdown.addEventListener('change', event => {
            tmpGoodStanding = event.target.value;
        });
        homeServicesDropdown.addEventListener('change', event => {
            tmpHomeServices = event.target.value;
        });
        takingNewReferralsDropdown.addEventListener('change', event => {
            tmpTakingNewReferrals = event.target.value;
        });
        fundingSourceDropdown.addEventListener('change', event => {
            tmpFundingSource = event.target.value;
        });
        serviceCodeDropdown.addEventListener('change', event => {
            tmpServiceCode = event.target.value;
        });

        APPLY_BTN.addEventListener('click', () => {
            updateFilterData({
                tmpVendor,
                tmpDDNumber,
                tmpLocalNumber,
                tmpGoodStanding,
                tmpHomeServices,
                tmpTakingNewReferrals,
                tmpFundingSource,
                tmpServiceCode
            });

            POPUP.hide(filterPopup);
            vendorInfoLoad();
        });
    }

    function updateFilterData(data) {
        if (data.tmpVendor) filterValues.vendor = data.tmpVendor;
        if (data.tmpDDNumber != undefined) filterValues.DDNumber = data.tmpDDNumber;
        if (data.tmpLocalNumber != undefined) filterValues.localNumber = data.tmpLocalNumber;
        if (data.tmpGoodStanding) filterValues.goodStanding = data.tmpGoodStanding;
        if (data.tmpHomeServices) filterValues.homeServices = data.tmpHomeServices;
        if (data.tmpTakingNewReferrals) filterValues.takingNewReferrals = data.tmpTakingNewReferrals;
        if (data.tmpFundingSource) filterValues.fundingSource = data.tmpFundingSource;
        if (data.tmpServiceCode) filterValues.serviceCode = data.tmpServiceCode;
    }

    async function populateFilterDropdown() {

        const {
            getVendorResult: Vendor,
        } = await authorizationsAjax.getVendorAsync();
        let vendorData = Vendor.map((vendor) => ({
            id: vendor.Description,
            value: vendor.Description,
            text: vendor.Description
        }));
        vendorData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("vendorDropdown", vendorData, filterValues.vendor);

        const {
            getFundingSourceResult: FundingSource,
        } = await authorizationsAjax.getFundingSourceAsync();
        let fundingSourceData = FundingSource.map((fundingSource) => ({
            id: fundingSource.ID,
            value: fundingSource.Description,
            text: fundingSource.Description
        }));
        fundingSourceData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("fundingSourceDropdown", fundingSourceData, filterValues.fundingSource);

        const {
            getServiceCodeResult: ServiceCode,
        } = await authorizationsAjax.getServiceCodeAsync();
        let serviceCodeData = ServiceCode.map((serviceCode) => ({
            id: serviceCode.ID,
            value: serviceCode.Description,
            text: serviceCode.Description
        }));
        serviceCodeData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("serviceCodeDropdown", serviceCodeData, filterValues.serviceCode);

        const goodStandingData = ([
            { id: 1, value: 'N', text: 'No' },
            { id: 2, value: 'Y', text: 'Yes' },
        ]);
        goodStandingData.unshift({ id: '%', value: '%', text: 'ALL' });
        dropdown.populate("goodStandingDropdown", goodStandingData, filterValues.goodStanding);

        const homeServicesData = ([
            { id: 1, value: 'N', text: 'No' },
            { id: 2, value: 'Y', text: 'Yes' },
        ]);
        homeServicesData.unshift({ id: '%', value: '%', text: 'ALL' });
        dropdown.populate("homeServicesDropdown", homeServicesData, filterValues.homeServices);

        const takingNewReferralsData = ([
            { id: 1, value: 'N', text: 'No' },
            { id: 2, value: 'Y', text: 'Yes' },
        ]);
        takingNewReferralsData.unshift({ id: '%', value: '%', text: 'ALL' });
        dropdown.populate("takingNewReferralsDropdown", takingNewReferralsData, filterValues.takingNewReferrals);
    }

    function filterPopupCancelBtn() {
        POPUP.hide(filterPopup);
    }

    // load  
    function loadReviewPage() {
        var DDNum = filterValues.DDNumber == '' ? '%' : filterValues.DDNumber;
        var localNum = filterValues.localNumber == '' ? '%' : filterValues.localNumber;
        authorizationsAjax.getVendorInfoAsync({
            vendor: filterValues.vendor,
            DDNumber: DDNum,
            localNumber: localNum,
            goodStanding: filterValues.goodStanding,
            homeServices: filterValues.homeServices,
            takingNewReferrals: filterValues.takingNewReferrals,
            fundingSource: filterValues.fundingSource,
            serviceCode: filterValues.serviceCode,
        },
            function (results) {
                populateTable(results, true);
            },
        );
    }

    function formatPhoneNumber(number) {
        if (number == '' || number == ' ') return '';

        const phoneNumber = UTIL.formatPhoneNumber(number.substr(0, 10));
        const phoneExt = number.substr(10);

        const phonebracket = phoneNumber.substr(0, 3);
        const phonenum = phoneNumber.substr(4, 11);

        const phone = `(${phonebracket})` + ` ` + ` ${phonenum}` + ` ` + `${phoneExt}`;

        return phone;
    }

    return {
        init,
        vendorInfoLoad,
    };
})();
