const FSS = (() => {
    //Inputs
    var selectedConsumer;
    let fSSData;
    //filter
    let filterValues;
    let newFilterValues;
    let editFamily;
    let filesList = [];
    let backBtn;
    // DOM
    let pageWrap;
    let overviewTable;
    //--
    let filterPopup;
    let address;
    let applyFilterBtn;
    let btnWrap;
    let familyNameBtnWrap;
    let primaryPhoneBtnWrap;
    let addressBtnWrap;
    let coPayVal;
    let allocationVal;
    let fundingSourceVal;
    let startDateVal;
    let endDateVal;
    let authorizationPopup;
    let UtilizationPopup
    let encumberedInputsVal;
    let familyMemberDropdownVal;
    let serviceCodeDropdownVal;
    let paidAmountInputsVal;
    let vendorDropdownVal;
    let datePaidVal;
    let selectedConsumersId;
    //--

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;
        switch (targetAction) {
            case 'miniRosterDone': {
                var activeConsumers = roster2.getActiveConsumers();
                selectedConsumer = activeConsumers[activeConsumers.length - 1];
                selectedConsumersId = activeConsumers[activeConsumers.length - 1].id;
                await loadFSSLanding();
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

    async function loadFSSLanding() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        initFilterValues();
        pageWrap = document.createElement('div');
        const consumerCard = buildConsumerCard();
        const backbtnWrap = document.createElement('div');
        backbtnWrap.classList.add('addOutcomeBtnWrap');
        const addInsertServicesBtnWrap = document.createElement('div');
        addInsertServicesBtnWrap.classList.add('addInsertServicesBtnWrap');
        backbtnWrap.appendChild(addInsertServicesBtnWrap);

        filteredByData = buildFilteredByData();
        editFamily = editFamiliesButton();
        backBtn = backButton();
        addInsertServicesBtnWrap.appendChild(editFamily);

        backbtnWrap.appendChild(backBtn);

        pageWrap.appendChild(consumerCard);
        pageWrap.appendChild(backbtnWrap);
        pageWrap.appendChild(filteredByData);
        DOM.ACTIONCENTER.appendChild(pageWrap);

        if ($.session.FSSUpdate == true) {
            editFamily.classList.remove('disabled');
        } else {
            editFamily.classList.add('disabled');
        }

        const spinner = PROGRESS.SPINNER.get('Gathering Data...');
        pageWrap.appendChild(spinner);

        fSSData = await FSSAjax.getFSSPageData({
            token: $.session.Token,
            familyName: filterValues.familyName,
            primaryPhone: filterValues.primaryPhone,
            address: filterValues.address,
            appName: $.session.applicationName,
        });

        pageWrap.removeChild(spinner);
        buildOverviewTable();
    }

    function buildConsumerCard() {
        selectedConsumer.card.classList.remove('highlighted');
        const wrap = document.createElement('div');
        wrap.classList.add('planConsumerCard');
        wrap.appendChild(selectedConsumer.card);
        return wrap;
    }

    function initFilterValues() {
        filterValues = {
            familyName: '%',
            primaryPhone: '%',
            address: '%',
        };
    }

    function buildFilteredByData() {
        var currentFilterDisplay = document.querySelector('.filteredByData');

        if (!currentFilterDisplay) {
            currentFilterDisplay = document.createElement('div');
            currentFilterDisplay.classList.add('filteredByData');
            filterButtonSet();
            currentFilterDisplay.appendChild(btnWrap);
        }

        if (filterValues.familyName === '%') {
            btnWrap.appendChild(familyNameBtnWrap);
            btnWrap.removeChild(familyNameBtnWrap);
        } else {
            btnWrap.appendChild(familyNameBtnWrap);
            if (document.getElementById('familyNameBtn') != null)
                document.getElementById('familyNameBtn').innerHTML = 'Family Name: ' + filterValues.familyName;
        }

        if (filterValues.primaryPhone === '%') {
            btnWrap.appendChild(primaryPhoneBtnWrap);
            btnWrap.removeChild(primaryPhoneBtnWrap);
        } else {
            btnWrap.appendChild(primaryPhoneBtnWrap);
            if (document.getElementById('primaryPhoneBtn') != null)
                document.getElementById('primaryPhoneBtn').innerHTML = ' Primary Phone: ' + filterValues.primaryPhone;
        }

        if (filterValues.address === '%') {
            btnWrap.appendChild(addressBtnWrap);
            btnWrap.removeChild(addressBtnWrap);
        } else {
            btnWrap.appendChild(addressBtnWrap);
            if (document.getElementById('addressBtn') != null)
                document.getElementById('addressBtn').innerHTML = 'Address: ' + filterValues.address;
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
            callback: () => {
                showFilterPopup('ALL');
            },
        });

        familyNameBtn = button.build({
            id: 'familyNameBtn',
            text: 'Family Name: ' + filterValues.familyName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => {
                showFilterPopup('familyNameBtn');
            },
        });
        familyNameCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => {
                closeFilter('familyNameBtn');
            },
        });

        primaryPhoneBtn = button.build({
            id: 'primaryPhoneBtn',
            text: 'Primary Phone: ' + filterValues.primaryPhone,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => {
                showFilterPopup('primaryPhoneBtn');
            },
        });

        primaryPhoneCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => {
                closeFilter('primaryPhoneBtn');
            },
        });

        addressBtn = button.build({
            id: 'addressBtn',
            text: 'Import Date: ' + filterValues.address,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => {
                showFilterPopup('addressBtn');
            },
        });

        addressCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => {
                closeFilter('addressBtn');
            },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        familyNameBtnWrap = document.createElement('div');
        familyNameBtnWrap.classList.add('filterSelectionBtnWrap');
        familyNameBtnWrap.appendChild(familyNameBtn);
        familyNameBtnWrap.appendChild(familyNameCloseBtn);
        btnWrap.appendChild(familyNameBtnWrap);

        primaryPhoneBtnWrap = document.createElement('div');
        primaryPhoneBtnWrap.classList.add('filterSelectionBtnWrap');
        primaryPhoneBtnWrap.appendChild(primaryPhoneBtn);
        primaryPhoneBtnWrap.appendChild(primaryPhoneCloseBtn);
        btnWrap.appendChild(primaryPhoneBtnWrap);

        addressBtnWrap = document.createElement('div');
        addressBtnWrap.classList.add('filterSelectionBtnWrap');
        addressBtnWrap.appendChild(addressBtn);
        addressBtnWrap.appendChild(addressCloseBtn);
        btnWrap.appendChild(addressBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'familyNameBtn') {
            newFilterValues.familyName = '%';
        }
        if (closeFilter == 'primaryPhoneBtn') {
            newFilterValues.primaryPhone = '%';
        }
        if (closeFilter == 'addressBtn') {
            newFilterValues.address = '%';
        }
        applyFilter();
    }

    function showFilterPopup(IsShow) {
        filterPopup = POPUP.build({});

        // Inputs
        familyNameInput = input.build({
            type: 'text',
            label: 'Family Name',
            style: 'secondary',
            value: filterValues.familyName == '%' ? '' : filterValues.familyName,
        });

        primaryPhoneInput = input.build({
            type: 'text',
            label: 'Primary Phone',
            style: 'secondary',
            value: filterValues.primaryPhone == '%' ? '' : filterValues.primaryPhone,
        });

        addressInput = input.build({
            type: 'text',
            label: 'Address',
            style: 'secondary',
            value: filterValues.address == '%' ? '' : filterValues.address,
        });

        const btnFilterWrap = document.createElement('div');
        btnFilterWrap.classList.add('btnWrap');
        applyFilterBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });
        cancelFilterBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: function () {
                POPUP.hide(filterPopup);
            },
        });
        btnFilterWrap.appendChild(applyFilterBtn);
        btnFilterWrap.appendChild(cancelFilterBtn);

        if (IsShow == 'ALL' || IsShow == 'familyNameBtn') filterPopup.appendChild(familyNameInput);
        if (IsShow == 'ALL' || IsShow == 'primaryPhoneBtn') filterPopup.appendChild(primaryPhoneInput);
        if (IsShow == 'ALL' || IsShow == 'addressBtn') filterPopup.appendChild(addressInput);
        filterPopup.appendChild(btnFilterWrap);

        POPUP.show(filterPopup);
        setupFilterEvents();
    }
    function setupFilterEvents() {
        newFilterValues = {};

        familyNameInput.addEventListener('input', event => {
            newFilterValues.familyName = event.target.value;
        });

        primaryPhoneInput.addEventListener('input', event => {
            newFilterValues.primaryPhone = event.target.value;
        });

        addressInput.addEventListener('input', event => {
            newFilterValues.address = event.target.value;
        });

        applyFilterBtn.addEventListener('click', async e => {
            if (!applyFilterBtn.classList.contains('disabled')) {
                applyFilter();
                POPUP.hide(filterPopup);
            }
        });
    }

    async function applyFilter() {
        filterValues = { ...filterValues, ...newFilterValues };

        const spinner = PROGRESS.SPINNER.get('Gathering Data...');
        pageWrap.removeChild(overviewTable);
        pageWrap.appendChild(spinner);

        fSSData = await FSSAjax.getFSSPageData({
            token: $.session.Token,
            familyName: filterValues.familyName,
            primaryPhone: filterValues.primaryPhone,
            address: filterValues.address,
            appName: $.session.applicationName,
        });

        pageWrap.removeChild(spinner);

        buildOverviewTable();
        const newfilteredByData = buildFilteredByData();
        pageWrap.replaceChild(newfilteredByData, filteredByData);
        filteredByData = newfilteredByData;
    }

    function editFamiliesButton() {
        return button.build({
            text: 'Edit Families',
            style: 'secondary',
            type: 'contained',
            classNames: 'reportBtn',
            callback: async () => {
                if (!editFamily.classList.contains('disabled')) {
                    EditFamilies.init();
                }
            },
        });
    }

    function backButton() {
        return button.build({
            text: 'BACK',
            style: 'secondary',
            type: 'outlined',
            callback: async () => {
                roster2.clearSelectedConsumers();
                roster2.clearActiveConsumers();
                FSS.init()
            },
        });
    }


    function buildOverviewTable() {
        groupChildData();
        groupSubChildData();

        overviewTable = document.createElement('div');
        overviewTable.classList.add('fssTable');

        const mainHeading = document.createElement('div');
        mainHeading.classList.add('fssTable__header');
        mainHeading.innerHTML = `
      <div></div>
      <div>Family Name</div>
      <div>Address</div>
      <div>Primary Phone</div>
      <div>Notes</div>
      <div></div>
    `;
        overviewTable.appendChild(mainHeading);

        fSSData.pageDataParent.forEach(parent => {
            const familyID = parent.familyId;
            var eventName;
            const notes = parent.notes == null ? '' : parent.notes;
            const rowWrap = document.createElement('div');
            rowWrap.classList.add('fssTable__subTableWrap');

            // TOP LEVEL ROW
            //---------------------------------
            const mainDataRow = document.createElement('div');
            mainDataRow.classList.add('fssTable__mainDataRow', 'fssTable__dataRow');
            mainDataRow.value = parent.familyId;
            const endIcon = document.createElement('div');
            endIcon.classList.add('fssTable__endIcon');

            const toggleIcon = document.createElement('div');
            toggleIcon.id = 'authToggle';
            toggleIcon.classList.add('fssTable__endIcon');
            toggleIcon.innerHTML = icons['keyArrowRight'];
            mainDataRow.innerHTML = `       
        <div>${parent.familyName}</div>
        <div>${parent.address}</div>
        <div>${parent.primaryPhone}</div>
        <div>${notes}</div>               
      `;
            mainDataRow.prepend(toggleIcon);
            if ($.session.FSSUpdate == true) {
                endIcon.innerHTML = icons['add'];
            } else {
                endIcon.innerHTML = `<div></div>`;
            }
            mainDataRow.appendChild(endIcon);
            rowWrap.appendChild(mainDataRow);

            // SUB ROWS
            //---------------------------------
            const subRowWrap = document.createElement('div');
            subRowWrap.classList.add('fssTable__subRowWrap');

            const subHeading = document.createElement('div');
            subHeading.classList.add('fssTable__subHeader');
            subHeading.innerHTML = `
        <div></div>
        <div>Start Date</div>
        <div>End Date</div>
        <div>Co-Pay %</div>
        <div>Allocation</div>
        <div>Encumbered</div>
        <div>Amt. Paid</div>
        <div>Balance</div>
        <div>Funding</div>
        <div></div>
      `;
            subRowWrap.appendChild(subHeading);

            if (fSSData.pageDataChild[familyID]) {
                fSSData.pageDataChild[familyID].sort((a, b) => {
                    return parseInt(a.itemnum) - parseInt(b.itemnum);
                });

                fSSData.pageDataChild[familyID].forEach(child => {
                    const fundingSourceID = child.fundingSourceID;
                    const fID = child.familyId;
                    const authId = child.authId;
                    const encumbered = child.encumbered == null ? '0.0' : child.encumbered;
                    const amtPaid = child.amtPaid == null ? '0.0' : child.amtPaid;
                    const subDataRow = document.createElement('div');
                    var startDate =
                        child.startDate == null || ''
                            ? ''
                            : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.startDate.split('T')[0]));
                    var endDate =
                        child.endDate == null || ''
                            ? ''
                            : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.endDate.split('T')[0]));
                    subDataRow.classList.add('fssTable__subDataRow', 'fssTable__dataRow');
                    const endIconSub = document.createElement('div');
                    endIconSub.classList.add('fssTable__endIcon');
                    const toggleIconSub = document.createElement('div');
                    toggleIconSub.id = 'authToggle';
                    toggleIconSub.classList.add('fssTable__endIcon');
                    toggleIconSub.innerHTML = icons['keyArrowRight'];

                    subDataRow.innerHTML = `
            <div>${startDate}</div>     
            <div>${endDate}</div>
            <div>${child.coPay}</div>
            <div>${child.allocation}</div>
            <div>${encumbered}</div> 
             <div>${amtPaid}</div>
            <div>${child.balance}</div>
            <div>${child.funding}</div> 

          `;
                    subDataRow.prepend(toggleIconSub);
                    if ($.session.FSSUpdate == true) {
                        endIconSub.innerHTML = icons['add'];
                    } else {
                        endIconSub.innerHTML = `<div></div>`;
                    }
                    subDataRow.appendChild(endIconSub);
                    subRowWrap.appendChild(subDataRow);

                    endIconSub.addEventListener('click', e => {
                        addFamilyUtilization(child.familyId, child.authId, fundingSourceID);
                    });

                    // SUB CHILD ROWS
                    //---------------------------------
                    const subChildRowWrap = document.createElement('div');
                    subChildRowWrap.classList.add('fssTable__subChildRowWrap');

                    const subChildHeading = document.createElement('div');
                    subChildHeading.classList.add('fssTable__subChildHeader');
                    subChildHeading.innerHTML = `
                     <div></div>
                    <div>Family Member</div>
                    <div>Service Code</div>
                    <div>Vendor</div>
                    <div>Encumbered</div>
                    <div>Paid amount</div>
                    <div>Date Paid</div>
                    <div></div>
                        `;
                    subChildRowWrap.appendChild(subChildHeading);

                    if (fSSData.pageDataSubChild[authId]) {
                        fSSData.pageDataSubChild[authId].sort((a, b) => {
                            return parseInt(a.itemnum) - parseInt(b.itemnum);
                        });

                        fSSData.pageDataSubChild[authId].forEach(subChild => {
                            const aID = subChild.authId;
                            const encumbered = subChild.encumbered == null ? '0.0' : subChild.encumbered;
                            const paidAmt = subChild.paidAmt == null ? '0.0' : subChild.paidAmt;
                            const subChildDataRow = document.createElement('div');
                            var paidDate =
                                subChild.paidDate == null || ''
                                    ? ''
                                    : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(subChild.paidDate.split('T')[0]));

                            subChildDataRow.classList.add('fssTable__subChildDataRow', 'fssTable__dataRow');
                            const endIconSub = document.createElement('div');
                            endIconSub.classList.add('fssTable__endIcon');


                            subChildDataRow.innerHTML = `
                             <div></div>
                            <div>${subChild.familyMember}</div>
                            <div>${subChild.serviceCode}</div>
                            <div>${subChild.Vendor}</div>
                            <div>${encumbered}</div> 
                            <div>${paidAmt}</div>
                            <div>${paidDate}</div>
                            `;
                            if ($.session.FSSUpdate == true) {
                                endIconSub.innerHTML = icons['delete'];
                            } else {
                                endIconSub.innerHTML = `<div></div>`;
                            }
                            subChildDataRow.appendChild(endIconSub);
                            subChildRowWrap.appendChild(subChildDataRow);

                            subChildDataRow.addEventListener('click', e => {
                                //subChild.authDetailId  subChild.authId
                            });
                        });
                    }
                    toggleIconSub.addEventListener('click', e => {
                        const toggle = document.querySelector('#authToggle');
                        eventName = 'toggle';
                        if (subChildRowWrap.classList.contains('active')) {
                            // close it
                            subChildRowWrap.classList.remove('active');
                            toggleIconSub.innerHTML = icons.keyArrowRight;
                        } else {
                            // open it
                            subChildRowWrap.classList.add('active');
                            toggleIconSub.innerHTML = icons.keyArrowDown;
                        }
                    });

                    subRowWrap.appendChild(subChildRowWrap);
                });
            }

            toggleIcon.addEventListener('click', e => {
                const toggle = document.querySelector('#authToggle');
                eventName = 'toggle';
                if (subRowWrap.classList.contains('active')) {
                    // close it
                    subRowWrap.classList.remove('active');
                    toggleIcon.innerHTML = icons.keyArrowRight;
                } else {
                    // open it
                    subRowWrap.classList.add('active');
                    toggleIcon.innerHTML = icons.keyArrowDown;
                }
            });

            endIcon.addEventListener('click', e => {
                addFamilyAuthorization(parent.familyId)
            });

            // ASSEMBLY
            //---------------------------------
            rowWrap.appendChild(subRowWrap);
            overviewTable.appendChild(rowWrap);
        });

        pageWrap.appendChild(overviewTable);
    }

    function groupChildData() {
        if (!fSSData.pageDataChild) {
            return;
        }

        const groupedChildren = fSSData.pageDataChild.reduce((obj, child) => {
            if (!obj[child.familyId]) {
                obj[child.familyId] = [];
                obj[child.familyId].push(child);
            } else {
                obj[child.familyId].push(child);
            }

            return obj;
        }, {});

        fSSData.pageDataChild = { ...groupedChildren };
    }

    function groupSubChildData() {
        if (!fSSData.pageDataSubChild) {
            return;
        }

        const groupedChildren = fSSData.pageDataSubChild.reduce((obj, child) => {
            if (!obj[child.authId]) {
                obj[child.authId] = [];
                obj[child.authId].push(child);
            } else {
                obj[child.authId].push(child);
            }

            return obj;
        }, {});

        fSSData.pageDataSubChild = { ...groupedChildren };
    }

    function addFamilyAuthorization(familyId) {

        authorizationPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.innerText = 'New Family Authorization';

        // inputs     
        newStartDate = input.build({
            id: 'newStartDate',
            type: 'date',
            label: 'Start Date',
            style: 'secondary',
            value: UTIL.getTodaysDate(),
        });
        startDateVal = UTIL.getTodaysDate()

        newEndDate = input.build({
            id: 'newEndDate',
            type: 'date',
            label: 'End Date',
            style: 'secondary',
        });
        coPay = input.build({
            id: 'coPay',
            type: 'number',
            label: 'Copay %',
            style: 'secondary',
            attributes: [
                { key: 'min', value: '0' },
                { key: 'max', value: '99' },
                {
                    key: 'onkeypress',
                    value: 'return event.charCode >= 48 && event.charCode <= 57',
                },
            ],
        });

        allocation = input.build({
            id: 'allocation',
            type: 'text',
            label: 'Allocation',
            style: 'secondary',
            value: '$',
        });

        fundingSourceDropdown = dropdown.build({
            id: 'fundingSourceDropdown',
            label: "Payee",
            dropdownId: "fundingSourceDropdown",
        });

        APPLY_BTN = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (!APPLY_BTN.classList.contains('disabled')) {
                    await saveAuthorizationData(familyId);
                    POPUP.hide(authorizationPopup);
                }
            },
        });

        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        authorizationPopup.appendChild(heading);
        authorizationPopup.appendChild(newStartDate);
        authorizationPopup.appendChild(newEndDate);
        authorizationPopup.appendChild(coPay);
        authorizationPopup.appendChild(allocation);
        authorizationPopup.appendChild(fundingSourceDropdown);
        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(APPLY_BTN);
        popupbtnWrap.appendChild(CANCEL_BTN);
        authorizationPopup.appendChild(popupbtnWrap);

        POPUP.show(authorizationPopup);
        fundingDropdownPopulate();
        authorizationPopupEventListeners();
        authorizationRequiredFieldsOfPopup();
    }

    function authorizationPopupEventListeners() {
        coPay.addEventListener('input', event => {
            coPayVal = event.target.value;
            authorizationRequiredFieldsOfPopup();
        });

        allocation.addEventListener('input', event => {
            allocationVal = event.target.value;
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(allocationVal)) {
                document.getElementById('allocation').value = '$';
            }
            else if (allocationVal.includes('.') && (allocationVal.match(/\./g).length > 1 || allocationVal.toString().split('.')[1].length > 2)) {
                document.getElementById('allocation').value = '$';
            }
            if (allocationVal.includes('-') || allocationVal.includes(' ')) {
                document.getElementById('allocation').value = '$';
            }
            if (allocationVal.includes('$') && allocationVal.match(/\$/g).length > 1) {
                document.getElementById('allocation').value = '$';
            }
            allocationVal = allocationVal.replace('$', '');
            authorizationRequiredFieldsOfPopup();
        });

        fundingSourceDropdown.addEventListener('change', event => {
            fundingSourceVal = event.target.options[event.target.selectedIndex].id;
            authorizationRequiredFieldsOfPopup();
        });
        newStartDate.addEventListener('input', event => {
            startDateVal = event.target.value;
            authorizationRequiredFieldsOfPopup();
        });
        newEndDate.addEventListener('input', event => {
            endDateVal = event.target.value;
            authorizationRequiredFieldsOfPopup();
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(authorizationPopup);
        });
    }

    function authorizationRequiredFieldsOfPopup() {
        var allocate = allocation.querySelector('#allocation');
        var fundingSource = fundingSourceDropdown.querySelector('#fundingSourceDropdown');
        var startDate = newStartDate.querySelector('#newStartDate');
        var endDate = newEndDate.querySelector('#newEndDate');
        var cPay = coPay.querySelector('#coPay');

        var reg = new RegExp('^[0-9 . $ -]+$');

        if (fundingSource.value === '') {
            fundingSourceDropdown.classList.add('errorPopup');
        } else {
            fundingSourceDropdown.classList.remove('errorPopup');
        }

        if (cPay.value != '' && parseInt(cPay.value) > 99) {
            coPay.classList.add('errorPopup');
        } else {
            coPay.classList.remove('errorPopup');
        }

        if (allocate.value === '' || allocate.value === '$' || allocate.value.includes('-') || !reg.test(allocate.value)) {
            allocation.classList.add('errorPopup');
        } else {
            allocation.classList.remove('errorPopup');
        }

        if (startDate.value === '') {
            newStartDate.classList.add('errorPopup');
        } else {
            newStartDate.classList.remove('errorPopup');
        }

        if (endDate.value === '' || startDate.value > endDate.value) {
            newEndDate.classList.add('errorPopup');
        } else {
            newEndDate.classList.remove('errorPopup');
        }

        setAuthorizationBtnStatusOfPopup();
    }

    async function fundingDropdownPopulate() {
        const {
            getFundingResult: Fundings,
        } = await FSSAjax.getFunding();

        let data = Fundings.map((fundings) => ({
            id: fundings.id,
            value: fundings.id,
            text: fundings.name
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("fundingSourceDropdown", data, '');
    }

    function setAuthorizationBtnStatusOfPopup() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            APPLY_BTN.classList.add('disabled');
            return;
        } else {
            APPLY_BTN.classList.remove('disabled');
        }
    }

    async function saveAuthorizationData(familyId) {
        await FSSAjax.insertAuthorization({
            token: $.session.Token,
            coPay: coPayVal,
            allocation: allocationVal,
            fundingSource: fundingSourceVal,
            startDate: startDateVal,
            endDate: endDateVal,
            userId: $.session.UserId,
            familyID: familyId,
        });
        applyFilter();
    }



    function addFamilyUtilization(familyId, authId, fundingSourceID) {

        UtilizationPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.innerText = 'New Family Utilization';

        // inputs     
        familyMemberDropdown = dropdown.build({
            id: 'familyMemberDropdown',
            label: "Family Member",
            dropdownId: "familyMemberDropdown",
        });

        serviceCodeDropdown = dropdown.build({
            id: 'serviceCodeDropdown',
            label: "Service Code",
            dropdownId: "serviceCodeDropdown",
        });

        vendorDropdown = dropdown.build({
            id: 'vendorDropdown',
            label: "Vendor",
            dropdownId: "vendorDropdown",
        });

        encumberedInputs = input.build({
            id: 'encumbered',
            type: 'text',
            label: 'Encumbered',
            style: 'secondary',
        });

        paidAmountInputs = input.build({
            id: 'paidAmountInputs',
            type: 'text',
            label: 'Paid amount',
            style: 'secondary',
        });

        datePaid = input.build({
            id: 'datePaid',
            type: 'date',
            label: 'Date Paid',
            style: 'secondary',
        });

        UAPPLY_BTN = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (!UAPPLY_BTN.classList.contains('disabled')) {
                    await saveUtilizationData(familyId, authId);
                    POPUP.hide(UtilizationPopup);
                }
            },
        });

        UCANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });
        var LineBr = document.createElement('br');
        UtilizationPopup.appendChild(heading);
        UtilizationPopup.appendChild(LineBr);
        UtilizationPopup.appendChild(LineBr);
        UtilizationPopup.appendChild(familyMemberDropdown);
        UtilizationPopup.appendChild(serviceCodeDropdown);
        UtilizationPopup.appendChild(vendorDropdown);


        UtilizationPopup.appendChild(encumberedInputs);
        UtilizationPopup.appendChild(paidAmountInputs);

        UtilizationPopup.appendChild(datePaid);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(UAPPLY_BTN);
        popupbtnWrap.appendChild(UCANCEL_BTN);
        UtilizationPopup.appendChild(popupbtnWrap);

        POPUP.show(UtilizationPopup);
        UtilizationDropdownPopulate(fundingSourceID);
        UtilizationPopupEventListeners();
        UtilizationRequiredFieldsOfPopup();
    }

    function UtilizationPopupEventListeners() {       
        encumberedInputs.addEventListener('input', event => {
            encumberedInputsVal = event.target.value;
        });
        familyMemberDropdown.addEventListener('change', event => {
            familyMemberDropdownVal = event.target.options[event.target.selectedIndex].id;
            UtilizationRequiredFieldsOfPopup();
        });
        serviceCodeDropdown.addEventListener('change', event => {
            serviceCodeDropdownVal = event.target.options[event.target.selectedIndex].id;
            UtilizationRequiredFieldsOfPopup();
        });
        vendorDropdown.addEventListener('change', event => {
            vendorDropdownVal = event.target.options[event.target.selectedIndex].id;
        });
        paidAmountInputs.addEventListener('input', event => {
            paidAmountInputsVal = event.target.value;
            UtilizationRequiredFieldsOfPopup();
        });
        datePaid.addEventListener('input', event => {
            datePaidVal = event.target.value;
            UtilizationRequiredFieldsOfPopup();
        });

        UCANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(UtilizationPopup);
        });
    }

    function UtilizationRequiredFieldsOfPopup() {
        var familyMemberVal = familyMemberDropdown.querySelector('#familyMemberDropdown');
        var serviceCodeVal = serviceCodeDropdown.querySelector('#serviceCodeDropdown');
        var paidAmountval = paidAmountInputs.querySelector('#paidAmountInputs');
        var datePaidVal = datePaid.querySelector('#datePaid');

        if (familyMemberVal.value === '') {
            familyMemberDropdown.classList.add('errorPopup');
        } else {
            familyMemberDropdown.classList.remove('errorPopup');
        }

        if (serviceCodeVal.value === '') {
            serviceCodeDropdown.classList.add('errorPopup');
        } else {
            serviceCodeDropdown.classList.remove('errorPopup');
        }

        if (paidAmountval.value === '' && datePaidVal.value != '') {
            paidAmountInputs.classList.add('errorPopup');
        } else {
            paidAmountInputs.classList.remove('errorPopup');
        }

        if (datePaidVal.value === '' && paidAmountval.value != '') {
            datePaid.classList.add('errorPopup');
        } else {
            datePaid.classList.remove('errorPopup');
        }

        setUtilizationBtnStatusOfPopup();
    }

    async function UtilizationDropdownPopulate(fundingSourceID) {
        const {
            getFamilyMembersDropDownResult: FamilyMembers,
        } = await FSSAjax.getFamilyMembersDropDown();

        let familyMembersData = FamilyMembers.map((familyMembers) => ({
            id: familyMembers.id,
            value: familyMembers.id,
            text: familyMembers.name
        }));
        familyMembersData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("familyMemberDropdown", familyMembersData, '');

        const {
            getServiceCodesResult: ServiceCode,
        } = await FSSAjax.getServiceCodes(fundingSourceID);

        let serviceCodeData = ServiceCode.map((serviceCode) => ({
            id: serviceCode.id,
            value: serviceCode.id,
            text: serviceCode.name
        }));
        serviceCodeData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("serviceCodeDropdown", serviceCodeData, '');

        const {
            getVendorsResult: Vendors,
        } = await FSSAjax.getVendors();

        let vendorsData = Vendors.map((vendors) => ({
            id: vendors.id,
            value: vendors.id,
            text: vendors.name
        }));
        vendorsData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("vendorDropdown", vendorsData, '');
    }

    function setUtilizationBtnStatusOfPopup() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            UAPPLY_BTN.classList.add('disabled');
            return;
        } else {
            UAPPLY_BTN.classList.remove('disabled');
        }
    }

    async function saveUtilizationData(familyId, authId) {
        await FSSAjax.insertUtilization({
            token: $.session.Token,
            encumbered: encumberedInputsVal,
            familyMember: familyMemberDropdownVal,
            serviceCode: serviceCodeDropdownVal,
            paidAmount: paidAmountInputsVal,
            vendor: vendorDropdownVal,
            datePaid: datePaidVal,
            userId: $.session.UserId,
            familyID: familyId,
            authID: authId,
            consumerID: selectedConsumersId,
        });
        applyFilter();
    }

    function formatDate(date) {
        if (!date) return '';

        return UTIL.abbreviateDateYear(UTIL.formatDateFromIso(date.split('T')[0]));
    }
    function init() {
        setActiveModuleAttribute('FSS');
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        init,
        handleActionNavEvent,
        loadFSSLanding,
    };
})(); 
