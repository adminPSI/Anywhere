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

    async function fSSLanding() {
        var activeConsumers = roster2.getActiveConsumers();
        selectedConsumer = activeConsumers[activeConsumers.length - 1];
        selectedConsumersId = activeConsumers[activeConsumers.length - 1].id;
        await loadFSSLanding();
        DOM.toggleNavLayout();
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
            consumerID: selectedConsumersId
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
            consumerID: selectedConsumersId
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
            const primaryPhone = parent.primaryPhone == null ? '' : formatPhoneNumber(parent.primaryPhone);
            const address = parent.address == null ? '' : parent.address;
            const familyName = parent.familyName == null ? '' : parent.familyName;
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
        <div>${familyName}</div>
        <div>${address}</div>
        <div>${primaryPhone}</div>
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
                    const coPay = child.coPay == null ? '0' : child.coPay;
                    const encumbered = child.encumbered == null ? '0.00' : parseFloat(child.encumbered).toFixed(2); 
                    const amtPaid = child.amtPaid == null ? '0.00' : parseFloat(child.amtPaid).toFixed(2);
                    const balance = child.balance == null ? '0.00' : parseFloat(child.balance).toFixed(2);
                    const allocation = child.allocation == null ? '0.00' : parseFloat(child.allocation).toFixed(2) ;
                    const funding = child.funding == null ? '' : child.funding;
                    const subDataRow = document.createElement('div');
                    var startDate =
                        child.startDate == null || ''
                            ? ''
                            : moment(child.startDate).format('MM/DD/YYYY');
                    var endDate =
                        child.endDate == null || ''
                            ? ''
                            : moment(child.endDate).format('MM/DD/YYYY');
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
            <div>${coPay}</div>
            <div>$ ${allocation}</div>
            <div>$${encumbered}</div> 
             <div>$${amtPaid}</div> 
            <div>$${balance}</div>
            <div>${funding}</div> 

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
                    <div>Paid Amt.</div>
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
                            const encumbered = subChild.encumbered == null ? '0.00' : parseFloat(subChild.encumbered).toFixed(2);
                            const paidAmt = subChild.paidAmt == null ? '0.00' : parseFloat(subChild.paidAmt).toFixed(2);
                            const Vendor = subChild.Vendor == null ? '' : subChild.Vendor;
                            const serviceCode = subChild.serviceCode == null ? '' : subChild.serviceCode;
                            const familyMember = subChild.familyMember == null ? '' : subChild.familyMember;
                            const subChildDataRow = document.createElement('div');
                            var paidDate =
                                subChild.paidDate == null || ''
                                    ? ''
                                    : moment(subChild.paidDate).format('MM/DD/YYYY');

                            subChildDataRow.classList.add('fssTable__subChildDataRow', 'fssTable__dataRow');
                            const endIconSubChild = document.createElement('div');
                            endIconSubChild.classList.add('fssTable__endIcon');


                            subChildDataRow.innerHTML = `
                             <div></div>
                            <div>${familyMember}</div>
                            <div>${serviceCode}</div>
                            <div>${Vendor}</div>
                            <div>$${encumbered}</div>   
                            <div>$${paidAmt}</div>
                            <div>${paidDate}</div>
                            `;
                            if ($.session.FSSDelete == true) {
                                endIconSubChild.innerHTML = icons['delete'];
                            } else {
                                endIconSubChild.innerHTML = `<div></div>`;
                            }
                            subChildDataRow.appendChild(endIconSubChild);
                            subChildRowWrap.appendChild(subChildDataRow);

                            endIconSubChild.addEventListener('click', e => {
                                deleteAuthorizationData(subChild.authDetailId);
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
            label: "Funding Source",
            dropdownId: "fundingSourceDropdown",
        });

        APPLY_BTN = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (!APPLY_BTN.classList.contains('disabled')) {
                    await saveAuthorizationData(familyId);
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
        const {
            insertAuthorizationResult: Authorizationresult,
        } = await FSSAjax.insertAuthorization({
            token: $.session.Token,
            coPay: coPayVal,
            allocation: allocationVal,
            fundingSource: fundingSourceVal,
            startDate: startDateVal,
            endDate: endDateVal,
            userId: $.session.UserId,
            familyID: familyId,
        });
        const result = Authorizationresult.replace('@', '');
        const jsonObject = JSON.parse(result);
        if (jsonObject[0].nextAuthId == '-1') {
            POPUP.hide(authorizationPopup);
            overlapMessagePopup();
        } else {
            applyFilter();
            POPUP.hide(authorizationPopup);
        }


    }

    async function deleteAuthorizationData(authDetailId) {
        await FSSAjax.deleteAuthorization({
            token: $.session.Token,
            authDetailId: authDetailId,
        });
        applyFilter();
    }

    function overlapMessagePopup() {
        const OverlapConfPOPUP = POPUP.build({
            hideX: true,
        });
        const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(OverlapConfPOPUP);
                POPUP.show(authorizationPopup);
            },
        });
        okBtn.style.width = '100%';
        const message = document.createElement('p');

        message.innerText = 'This record overlaps with another record with the same funding source.';

        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        OverlapConfPOPUP.appendChild(message);
        OverlapConfPOPUP.appendChild(okBtn);
        okBtn.focus();
        POPUP.show(OverlapConfPOPUP);
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
            type: 'number',
            label: 'Encumbered',
            style: 'secondary',
        });

        paidAmountInputs = input.build({
            id: 'paidAmountInputs',
            type: 'number',
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
                    POPUP.hide(UtilizationPopup);
                    await saveUtilizationData(familyId, authId);
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

        var popupInputWrap = document.createElement('div');
        popupInputWrap.classList.add('btnWrap');
        encumberedInputs.style.width = '49%';
        paidAmountInputs.style.width = '49%';
        popupInputWrap.appendChild(encumberedInputs);
        popupInputWrap.appendChild(paidAmountInputs);
        UtilizationPopup.appendChild(popupInputWrap);
        datePaid.style.width = '49%';
        UtilizationPopup.appendChild(datePaid);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(UAPPLY_BTN);
        popupbtnWrap.appendChild(UCANCEL_BTN);
        UtilizationPopup.appendChild(popupbtnWrap);

        POPUP.show(UtilizationPopup);
        UtilizationDropdownPopulate(familyId, fundingSourceID);
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

    async function UtilizationDropdownPopulate(familyId, fundingSourceID) {
        const {
            getFamilyMembersDropDownResult: FamilyMembers,
        } = await FSSAjax.getFamilyMembersDropDown(familyId);

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
        const {
            insertUtilizationResult: utilizationResult,
        } = await FSSAjax.insertUtilization({
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
            isSimpleBilling: $.session.automateSimpleBilling,
        });

        if ($.session.automateSimpleBilling == 'Y' && utilizationResult.isSuccess != '') {
            simpalBillingMessagePopup(utilizationResult);
        } else {
            applyFilter();
        }
    }

    function simpalBillingMessagePopup(utilizationResult) {
        const ConfPOPUP = POPUP.build({
            hideX: true,
        });
        const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(ConfPOPUP);
                applyFilter();
            },
        });
        okBtn.style.width = '100%';
        const message = document.createElement('p');
        let previousPaid = Number(utilizationResult.previousPaid)
        let currentPaid = Number(utilizationResult.currentPaid)
        if (previousPaid === 0 && currentPaid > 0) {
            if (utilizationResult.isSuccess == 'N') {
                message.innerText = 'Insert, Failed.  Could not create new Simple_Billing_Entry record. Please contact Primary Solutions.';
            }
            else if (utilizationResult.isSuccess == 'Y' && utilizationResult.isReceivable == 'Y') {
                message.innerText = 'County simple billing entry created… An entry has been created in County Simple Billing Entry. You will need to go to the County Simple Billing Entry window to Validate & Archive this transaction.';
            }
            else if (utilizationResult.isSuccess == 'Y' && utilizationResult.isReceivable == 'N') {
                message.innerText = 'Simple billing entry created. An entry has been created in Simple Billing Entry. You will need to go to the Simple Billing Entry window to Validate & Archive this transaction.';
            }
            else {
                message.innerText = '';
            }
        } else if (previousPaid > 0 && currentPaid === 0 && utilizationResult.isReceivable == 'N') {
            message.innerText = 'Simple billing entry needs deleted. No changes have been made in Simple Billing. Make sure that you delete any existing Simple Billing entries.';
        } else if (previousPaid > 0 && currentPaid === 0 && utilizationResult.isReceivable == 'Y') {
            message.innerText = 'County simple billing entry needs deleted. No changes have been made in County Simple Billing. Make sure that you delete any existing County Simple Billing entries.';
        } else if (previousPaid > 0 && currentPaid > 0 && utilizationResult.isReceivable == 'N') {
            message.innerText = 'Simple billing entry needs modified. No changes have been made in Simple Billing. Make sure that you modify the existing Simple Billing entry to reflect the modified information.';
        } else if (previousPaid > 0 && currentPaid > 0 && utilizationResult.isReceivable == 'Y') {
            message.innerText = 'County simple billing entry needs modified. No changes have been made in County Simple Billing. Make sure that you modify the existing County Simple Billing entry to reflect the modified information.';
        } else {
            message.innerText = '';
        }

        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        ConfPOPUP.appendChild(message);
        ConfPOPUP.appendChild(okBtn);
        okBtn.focus();
        if (message.innerText != '')
            POPUP.show(ConfPOPUP);
    }

    function formatPhoneNumber(number) {
        if (!number) return;
        const splitNumber = number
            .replace(/[^\w\s]/gi, '')
            .replaceAll(' ', '')
            .replaceAll('x', '');

        const phoneNumber = UTIL.formatPhoneNumber(splitNumber.substr(0, 10));
        const phoneExt = splitNumber.substr(10);

        const phone = phoneExt ? `${phoneNumber} (${phoneExt})` : `${phoneNumber}`;

        return phone;
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
        fSSLanding
    };
})(); 
