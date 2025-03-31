const EditFamilies = (function () {
    let SEARCH_WRAP;
    let SEARCH_BTN;
    let SEARCH_INPUT;
    let INACTIVE_CHKBOX;
    let familyTableData = [];
    let tempfamilyTableData = [];
    let displayedUsers = [];
    var userTable;
    var isChecked;
    let backBtn;

    function init() {
        setActiveModuleAttribute('FSS');
        DOM.clearActionCenter();
        const topNav = buildRosterTopNav();
        userTable = buildTable();

        // Set the data type for each header, for sorting purposes
        const headers = userTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Family Name
        headers[1].setAttribute('data-type', 'string'); // Address
        headers[2].setAttribute('data-type', 'number'); // Phone 

        DOM.ACTIONCENTER.appendChild(topNav);
        DOM.ACTIONCENTER.appendChild(userTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(userTable);

        SEARCH_BTN.addEventListener('click', event => {
            SEARCH_WRAP.classList.toggle('searchOpen');
            SEARCH_INPUT.value = '';
            SEARCH_INPUT.focus();
        });

        SEARCH_INPUT.addEventListener('keyup', event => {
            tableUserSearch(event.target.value);
        });
        isChecked = $.session.isActiveFamilies;
        loadReviewPage(isChecked);
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

    function viewEditFamilyBtn() {
        return button.build({
            text: 'View/Edit Family',
            style: 'secondary',
            type: 'contained',
        });
    }

    function buildInactiveChkBox() {
        return input.buildCheckbox({
            text: 'Show Inactives',
            id: 'chkInacive',
            callback: () => setCheckForInactiveUser(event.target),
            isChecked: $.session.isActiveFamilies,
        });
    }

    function buildActiveChkBox(checked) {
        return input.buildCheckbox({
            isChecked: checked === 'Y' ? true : false,
            callback: () => setCheckForInactiveUser(event.target),
        });
    }

    function buildTable() {
        var tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            columnHeadings: ['Name', 'Address', 'Primary Phone'],
            endIcon: true,
            secondendIconHeading: 'Active',
            secondendIcon: true,
        };

        return table.build(tableOptions);
    }

    //populate
    function populateTable(results, IsFirstLoad) {
        familyTableData = results.map(td => {
            var familyId = td.familyId;
            var primaryPhone = td.primaryPhone;
            var familyName = td.familyName;
            var address = td.address;
            var Active = td.active;

            const additionalInformation = viewEditFamilyBtn();
            additionalInformation.innerHTML = 'View/Edit Family';

            additionalInformation.style = 'margin-top: -10px; width: 200px;';
            const activeCheckbox = buildActiveChkBox(Active);
            activeCheckbox.style = "padding-top: 2px; margin-left: 10px;";

            return {
                id: familyId,
                endIcon: additionalInformation.outerHTML,
                secondendIcon: activeCheckbox.outerHTML,
                FamilyName: familyName,
                Address: address,
                PrimaryPhone: primaryPhone,
                Active: Active,
                values: [familyName, address, primaryPhone],
                attributes: [
                    { key: 'data-status', value: Active },
                    { key: 'familyId', value: familyId },
                ],
                endIconCallback: e => {
                    EditFamilyHeader.refreshFamily(familyId, familyName);
                },
                secondendIconCallback: e => {
                },
            };
        });
        if (IsFirstLoad) {
            tempfamilyTableData = familyTableData;
        }
        table.populate(userTable, familyTableData, false, true);
    }

    function buildRosterTopNav() {
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('roster-top-nav');

        SEARCH_BTN = buildSearchBtn();       
        INACTIVE_CHKBOX = buildInactiveChkBox();     
        backBtn = backButton();
       
        // custom search stuff
        SEARCH_WRAP = document.createElement('div');
        SEARCH_WRAP.classList.add('rosterSearch');
        SEARCH_INPUT = document.createElement('input');
        SEARCH_INPUT.setAttribute('placeholder', 'search families');
        SEARCH_WRAP.appendChild(SEARCH_BTN);
        SEARCH_WRAP.appendChild(SEARCH_INPUT);

        var wrap1 = document.createElement('div');
        wrap1.classList.add('headerWrap');
        INACTIVE_CHKBOX.classList.add('width25Per');
        wrap1.appendChild(INACTIVE_CHKBOX);
        SEARCH_WRAP.classList.add('width75Per');
        wrap1.appendChild(SEARCH_WRAP);
        backBtn.classList.add('width13Per');
        wrap1.appendChild(backBtn);

        INACTIVE_CHKBOX.addEventListener('change', event => {
            isChecked = event.target.checked;
            $.session.isActiveFamilies = isChecked;
        });

        btnWrap.appendChild(wrap1);
        return btnWrap;
    }

    function backButton() {
        return button.build({
            text: 'BACK',
            style: 'secondary',
            type: 'outlined',
            callback: async () => {
                FSS.fSSLanding() 
            },
        });
    }

    function setCheckForInactiveUser(input) {
        if (input.checked) {
            isChecked = true;
        } else {
            isChecked = false;
        }
        loadReviewPage(isChecked);
    }

    function tableUserSearch(searchValue) {

        searchValue = searchValue.toLowerCase();
        displayedUsers = [];
        tempfamilyTableData.forEach(consumer => {
            var familyName = consumer.FamilyName.toLowerCase();
            var address = consumer.Address.toLowerCase();
            var primaryPhone = consumer.PrimaryPhone.toLowerCase();
            var fullName = `${familyName} ${address} ${primaryPhone}`;
            var fullNameReversed = `${address} ${familyName} ${primaryPhone}`;
            var matchesName = fullName.indexOf(searchValue);
            var matchesNameReverse = fullNameReversed.indexOf(searchValue);

            if (matchesName !== -1 || matchesNameReverse !== -1) {
                consumerObj = {
                    familyId: consumer.id,
                    familyName: consumer.FamilyName,
                    address: consumer.Address,
                    primaryPhone: consumer.PrimaryPhone,
                    active: consumer.Active,
                };
                displayedUsers.push(consumerObj);
            }
        });
        populateTable(displayedUsers, false);
    }

    // load
    function loadReviewPage(active) {
        active = document.getElementById('chkInacive').checked;
        FSSAjax.getActiveInactiveFamilylist(
            {
                isActive: active == true ? 'N' : 'Y',
            },
            function (results, error) {
                populateTable(results, true);
            },
        );
    }

    return {
        init,
    };
})();
