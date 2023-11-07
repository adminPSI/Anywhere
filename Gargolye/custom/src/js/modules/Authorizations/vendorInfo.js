const vendorInfo = (function () {
    let SEARCH_WRAP;
    let SEARCH_BTN;
    let SEARCH_INPUT;
    let userTableData = [];
    let tempUserTableData = [];
    let displayedUsers = [];
    let newFilterBtn;
    var userTable;

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

        return button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            callback: () => buildFilterPopUp(filterValues)
        });
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
        newFilterBtn = buildNewFilterBtn();

        // custom search stuff
        SEARCH_WRAP = document.createElement('div');
        SEARCH_WRAP.classList.add('rosterSearch');
        SEARCH_INPUT = document.createElement('input');
        SEARCH_INPUT.setAttribute('placeholder', 'search vendors');
        SEARCH_WRAP.appendChild(SEARCH_BTN);
        SEARCH_WRAP.appendChild(SEARCH_INPUT);

        var wrap1 = document.createElement('div');
        wrap1.classList.add('btnWrap');
        wrap1.appendChild(newFilterBtn);
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
        var filteredBy = document.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
        }

        filteredBy.style.maxWidth = '100%';
        filteredBy.innerHTML = `<div class="filteredByData"> 
			<p>                         
                <span>Vendor:</span> ${(filterValues.vendor == '%') ? 'ALL' : filterValues.vendor}&nbsp;&nbsp;
			    <span>DD Number:</span> ${(filterValues.DDNumber == '') ? 'ALL' : filterValues.DDNumber}&nbsp;&nbsp;
                <span>Local Number:</span> ${(filterValues.localNumber == '') ? 'ALL' : filterValues.localNumber}&nbsp;&nbsp;
                <span>In Good Standing:</span> ${(filterValues.goodStanding == '%') ? 'ALL' : filterValues.goodStanding == 'Y' ? 'Yes' : 'No'} &nbsp;&nbsp; 
                <span>In Home Services:</span> ${(filterValues.homeServices == '%') ? 'ALL' : filterValues.homeServices == 'Y' ? 'Yes' : 'No'} &nbsp;&nbsp;
                <span>Taking New Referrals:</span> ${(filterValues.takingNewReferrals == '%') ? 'ALL' : filterValues.takingNewReferrals == 'Y' ? 'Yes' : 'No'} &nbsp;&nbsp;
                <span>Funding Source:</span> ${(filterValues.fundingSource == '%') ? 'ALL' : filterValues.fundingSource} &nbsp;&nbsp;
                <span>Service Code:</span> ${(filterValues.serviceCode == '%') ? 'ALL' : filterValues.serviceCode} 
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

        filterPopup.appendChild(vendorDropdown);
        filterPopup.appendChild(DDNumberInput);
        filterPopup.appendChild(localNumberInput);
        filterPopup.appendChild(goodStandingDropdown);
        filterPopup.appendChild(homeServicesDropdown);
        filterPopup.appendChild(takingNewReferralsDropdown);
        filterPopup.appendChild(fundingSourceDropdown);
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

        const phone = `(${phonebracket})` + ` ` + ` ${phonenum}` + ` ` + `${ phoneExt }`;   

        return phone;
    }

    return {
        init,
        vendorInfoLoad,
    };
})();
