const ConsumerFinances = (() => {
    //Inputs  
    let ConsumerFinanceEntriesTable = [];
    let CFConsumerBtns;
    let consumerRow;
    let consumerElement;
    let filterPopup;
    var selectedConsumers;
    var selectedConsumersName;
    var selectedConsumersId;
    //filter
    let accountDropdown;
    let filterValues;
    let btnWrap;
    let activityStartDateBtnWrap;
    let activityEndDateBtnWrap;
    let minamountBtnWrap;
    let maxamountBtnWrap;
    let transectionTypeBtnWrap;
    let accountNameBtnWrap;
    let payeeBtnWrap;
    let categoryBtnWrap;
    let enteredByBtnWrap;
    let isattachmentBtnWrap;
    let accountPermission;
    let tempAccountPer;

    //service filter options
    let selectedConsumerIds;

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
                filterValues = undefined;
                await loadConsumerFinanceLanding();
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

    async function backFromConsumerFinanceEditAccount(Consumers) {  
        setActiveModuleAttribute('ConsumerFinances');   
        DOM.clearActionCenter();
        selectedConsumers = Consumers;
        filterValues = undefined;
        await loadConsumerFinanceLanding();
        DOM.toggleNavLayout();   
    }

    // Build Consumer Finance Module Landing Page 
    async function loadConsumerFinanceLanding(value) {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();

        if (value) {
            filterValues.accountName = value;
        }

        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();
        landingPage = document.createElement('div'); 
        if (selectedConsumers != undefined) {
            selectedConsumersId = selectedConsumers[selectedConsumers.length - 1].id;
            $.session.consumerId = selectedConsumersId;
        } else {
            dashboard.load();
            return;  
        }
       
        const name = (
            await ConsumerFinancesAjax.getConsumerNameByID({
                token: $.session.Token,
                consumerId: selectedConsumersId,
            })
        ).getConsumerNameByIDResult;

        getaccountPermission();

        selectedConsumersName = name[0].FullName;
        const topButton = buildHeaderButton(selectedConsumers[0]);
        landingPage.appendChild(topButton);
        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        const filteredBy = buildFilteredBy();
        filterRow.appendChild(filteredBy);
        landingPage.appendChild(filterRow);
        ConsumerFinanceEntriesTable = await buildConsumerFinanceEntriesTable(filterValues);
        landingPage.appendChild(ConsumerFinanceEntriesTable);
        populateAccountDropdown();
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    function getaccountPermission() {
        accountPermission = '';
        tempAccountPer = [];
        if ($.session.CFViewChecking)
            tempAccountPer.push('Checking');

        if ($.session.CFViewCraditCard) {
            tempAccountPer.push('Credit Card');
        }

        if ($.session.CFViewFoodStamp) {
            tempAccountPer.push('Food Stamps');
        }

        if ($.session.CFViewPettyCash) {
            tempAccountPer.push('Petty Cash');
        }

        if ($.session.CFViewShaving) {
            tempAccountPer.push('Savings');
        }

        if ($.session.CFViewChristmasClub) {
            tempAccountPer.push('Christmas Club');
        }
        if ($.session.CFViewSystem20183A) {
            tempAccountPer.push('System 2018.3A');
        }
        if ($.session.CFViewSystem20183) {
            tempAccountPer.push('System 2018.3');
        }
        if ($.session.CFViewOhioEBT) {
            tempAccountPer.push('Ohio EBT');
        }
        if ($.session.CFViewViewFoodStampDebitCardEBT) {
            tempAccountPer.push('Food Stamp Debit Card EBT');
        }

        if (tempAccountPer.length > 0) {
            accountPermission = tempAccountPer.toString();
        }
        else
            accountPermission = '';
    }

    // build the listing of OOD Entries (based off of filter settings)
    async function buildConsumerFinanceEntriesTable(filterValues) {
        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            headline: selectedConsumersName,
            columnHeadings: ['Date', 'Account', 'Payee', 'Category', 'Amount', 'Check No.', 'Balance', 'Entered By'],
            endIcon: true,
        };

        selectedConsumerIds = selectedConsumers.map(function (x) { return x.id });
        let ConsumerFinancesEntries = await ConsumerFinancesAjax.getAccountTransectionEntriesAsync(
            selectedConsumerIds.join(", "),
            filterValues.activityStartDate,
            filterValues.activityEndDate,
            filterValues.accountName,
            filterValues.payee,
            filterValues.category,
            filterValues.minamount,
            filterValues.maxamount,
            filterValues.checkNo,
            filterValues.Balance,
            filterValues.enteredBy,
            filterValues.isattachment,
            filterValues.transectionType,
            accountPermission,
        );

        ConsumerFinancesEntries.getAccountTransectionEntriesResult.forEach(function (entry) {
            let newDate = new Date(entry.activityDate);
            let theMonth = newDate.getMonth() + 1;
            let formatActivityDate = UTIL.leadingZero(theMonth) + '/' + UTIL.leadingZero(newDate.getDate()) + '/' + newDate.getFullYear();
            entry.activityDate = formatActivityDate;
        });

        let tableData = ConsumerFinancesEntries.getAccountTransectionEntriesResult.map((entry) => ({
            values: [entry.activityDate, entry.account, entry.payee, entry.category, '$' + entry.amount, entry.checkno, '$' + entry.balance, entry.enteredby],
            attributes: [{ key: 'registerId', value: entry.ID }, { key: 'data-plan-active', value: entry.isExpance }],
            onClick: (e) => {
                handleAccountTableEvents(e.target.attributes.registerId.value)
            },
            endIcon: entry.AttachmentsID == 0 ? `${icons['Empty']}` : `${icons['attachmentSmall']}`,
        }));
        const oTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = oTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'date'); // Date
        headers[1].setAttribute('data-type', 'string'); // Account
        headers[2].setAttribute('data-type', 'string'); // Payee
        headers[3].setAttribute('data-type', 'string'); // Category 
        headers[4].setAttribute('data-type', 'string'); // Amount 
        headers[5].setAttribute('data-type', 'string'); // Check No
        headers[6].setAttribute('data-type', 'string'); // Balance  
        headers[7].setAttribute('data-type', 'string'); // Enter By 

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(oTable);

        table.populate(oTable, tableData);

        return oTable;
    }

    function handleAccountTableEvents(registerId) {
        NewEntryCF.buildNewEntryForm(registerId);
    }

    // build display of Account and button
    function buildHeaderButton(consumer) {
        consumerElement = document.createElement('div');
        consumerRow = document.createElement('div');
        consumerRow.classList.add('consumerHeader');
        CFConsumerBtns = buildButtonBar(consumer);
        consumerRow.appendChild(CFConsumerBtns);
        consumerElement.appendChild(consumerRow);
        return consumerElement;
    }

    function buildButtonBar(consumer) {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');
        buttonBar.style.maxHeight = '50px';
        buttonBar.style.minWidth = '100%';

        const dropdownButtonBar = document.createElement('div');
        const entryButtonBar = document.createElement('div');
        const editButtonBar = document.createElement('div');
        dropdownButtonBar.style.width = '32%';
        entryButtonBar.style.width = '32%';
        editButtonBar.style.width = '32%';

        accountDropdown = dropdown.build({
            label: "Accounts:",
            dropdownId: "accountDropdown",
        });

        accountDropdown.addEventListener('change', event => {
            filterValues.accountName = event.target.value;
            loadConsumerFinanceLanding(filterValues.accountName);
        });

        const entryBtn = button.build({
            text: '+ New Entry',
            style: 'secondary',
            type: 'contained',
            classNames: 'newEntryBtn',
            callback: async () => {
                if (!entryBtn.classList.contains('disabled')) { 
                    NewEntryCF.init()
                }
            },
        });

        const editAccountBtn = button.build({
            text: 'Edit Account',
            style: 'secondary',
            type: 'contained',
            callback: async () => {        
                if (!editAccountBtn.classList.contains('disabled')) { 
                    CFEditAccount.loadCFEditFromAccountRegister(selectedConsumers)
                }
            },
        });

        if ($.session.CFInsert) {
            entryBtn.classList.remove('disabled');
        }
        else {
            entryBtn.classList.add('disabled');
        }

        if ($.session.CFViewEditAccounts) {
            editAccountBtn.classList.remove('disabled');
        }
        else {
            editAccountBtn.classList.add('disabled');
        }

        entryBtn.style.height = '50px';
        entryBtn.style.minWidth = '100%';  
        editAccountBtn.style.height = '50px';
        editAccountBtn.style.minWidth = '100%';    

        buildNewFilterBtn();
        accountDropdown.style.minWidth = '100%';
        dropdownButtonBar.appendChild(accountDropdown);
        editButtonBar.appendChild(editAccountBtn);
        editButtonBar.style.marginLeft = '2%';
        entryButtonBar.appendChild(entryBtn);
        entryButtonBar.style.marginLeft = '2%';
        buttonBar.appendChild(dropdownButtonBar);
        buttonBar.appendChild(editButtonBar); 
        buttonBar.appendChild(entryButtonBar);
        return buttonBar;
    }

    function buildNewFilterBtn() {
        if (!filterValues) filterValues = {
            token: $.session.Token,
            activityStartDate: UTIL.formatDateFromDateObj(dates.subDays(new Date(), 30)),
            activityEndDate: UTIL.getTodaysDate(),
            accountName: '%',
            payee: '%',
            category: '%',
            minamount: '-10000.00',
            maxamount: '10000.00',
            checkNo: '',
            Balance: '',
            enteredBy: '%',
            isattachment: '%',
            transectionType: '%',
        }
    }

    // Populate the Account DDL 
    async function populateAccountDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync(selectedConsumersId, accountPermission);
        let data = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountName,
            text: account.accountName + ' - $' + (account.totalBalance == '' ? '0.00' : account.totalBalance)
        }));
        if (data.length > 0)
            data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate("accountDropdown", data, filterValues.accountName);
    }

    // build the display of the current Filter Settings (next to the Filter button) 
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.filteredByData');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet();
            filteredBy.appendChild(btnWrap);
        }

        filteredBy.style.maxWidth = '100%';

        if (filterValues.transectionType === '%' || filterValues.transectionType === 'ALL') {
            btnWrap.appendChild(transectionTypeBtnWrap);
            btnWrap.removeChild(transectionTypeBtnWrap);
        } else {
            btnWrap.appendChild(transectionTypeBtnWrap);
        }

        if (filterValues.accountName === '%' || filterValues.accountName === 'ALL') {
            btnWrap.appendChild(accountNameBtnWrap);
            btnWrap.removeChild(accountNameBtnWrap);
        } else {
            btnWrap.appendChild(accountNameBtnWrap);
        }

        if (filterValues.payee === '%' || filterValues.payee === 'ALL') {
            btnWrap.appendChild(payeeBtnWrap);
            btnWrap.removeChild(payeeBtnWrap);
        } else {
            btnWrap.appendChild(payeeBtnWrap);
        }

        if (filterValues.category === '%' || filterValues.category === 'ALL') {
            btnWrap.appendChild(categoryBtnWrap);
            btnWrap.removeChild(categoryBtnWrap);
        } else {
            btnWrap.appendChild(categoryBtnWrap);
        }

        if (filterValues.enteredBy === '%' || filterValues.enteredBy === 'ALL') {
            btnWrap.appendChild(enteredByBtnWrap);
            btnWrap.removeChild(enteredByBtnWrap);
        } else {
            btnWrap.appendChild(enteredByBtnWrap);
        }
        if (filterValues.isattachment === '%' || filterValues.isattachment === 'ALL') {
            btnWrap.appendChild(isattachmentBtnWrap);
            btnWrap.removeChild(isattachmentBtnWrap);
        } else {
            btnWrap.appendChild(isattachmentBtnWrap);
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
        activityStartDateBtn = button.build({
            id: 'activityStartDateBtn',
            text: 'From Date: ' + moment(filterValues.activityStartDate, 'YYYY-MM-DD').format('M/D/YYYY'),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('activityStartDateBtn') },
        });
        activityEndDateBtn = button.build({
            id: 'activityEndDateBtn',
            text: 'To date: ' + moment(filterValues.activityEndDate, 'YYYY-MM-DD').format('M/D/YYYY'),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('activityEndDateBtn') },
        });
        minamountBtn = button.build({
            id: 'minamountBtn',
            text: 'Min Amount: $' + filterValues.minamount,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('minamountBtn') },
        });
        maxamountBtn = button.build({
            id: 'maxamountBtn',
            text: 'Max Amount: $' + filterValues.maxamount,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('maxamountBtn') },
        });
        transectionTypeBtn = button.build({
            id: 'transectionTypeBtn',
            text: filterValues.transectionType == 'false' ? 'Transaction Type: Deposit' : 'Transaction Type: Expense',
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('transectionTypeBtn') },
        });
        transectionTypeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('transectionTypeBtn') },
        });
        accountNameBtn = button.build({
            id: 'accountNameBtn',
            text: 'Account: ' + filterValues.accountName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('accountNameBtn') },
        });
        accountNameCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('accountNameBtn') },
        });
        payeeBtn = button.build({
            id: 'payeeBtn',
            text: 'Payee: ' + filterValues.payee,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('payeeBtn') },
        });
        payeeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('payeeBtn') },
        });
        categoryBtn = button.build({
            id: 'categoryBtn',
            text: 'Category: ' + filterValues.category,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('categoryBtn') },
        });
        categoryCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('categoryBtn') },
        });
        enteredByBtn = button.build({
            id: 'enteredByBtn',
            text: 'Last Updated By: ' + filterValues.userName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('enteredByBtn') },
        });
        enteredByCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('enteredByBtn') },
        });
        isattachmentBtn = button.build({
            id: 'isattachmentBtn',
            text: 'Has Attachment: ' + filterValues.isattachment,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('isattachmentBtn') },
        });
        isattachmentCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('isattachmentBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        activityStartDateBtnWrap = document.createElement('div');
        activityStartDateBtnWrap.classList.add('filterSelectionBtnWrap');
        activityStartDateBtnWrap.appendChild(activityStartDateBtn);
        btnWrap.appendChild(activityStartDateBtnWrap);

        activityEndDateBtnWrap = document.createElement('div');
        activityEndDateBtnWrap.classList.add('filterSelectionBtnWrap');
        activityEndDateBtnWrap.appendChild(activityEndDateBtn);
        btnWrap.appendChild(activityEndDateBtnWrap);

        minamountBtnWrap = document.createElement('div');
        minamountBtnWrap.classList.add('filterSelectionBtnWrap');
        minamountBtnWrap.appendChild(minamountBtn);
        btnWrap.appendChild(minamountBtnWrap);

        maxamountBtnWrap = document.createElement('div');
        maxamountBtnWrap.classList.add('filterSelectionBtnWrap');
        maxamountBtnWrap.appendChild(maxamountBtn);
        btnWrap.appendChild(maxamountBtnWrap);

        transectionTypeBtnWrap = document.createElement('div');
        transectionTypeBtnWrap.classList.add('filterSelectionBtnWrap');
        transectionTypeBtnWrap.appendChild(transectionTypeBtn);
        transectionTypeBtnWrap.appendChild(transectionTypeCloseBtn);
        btnWrap.appendChild(transectionTypeBtnWrap);

        accountNameBtnWrap = document.createElement('div');
        accountNameBtnWrap.classList.add('filterSelectionBtnWrap');
        accountNameBtnWrap.appendChild(accountNameBtn);
        accountNameBtnWrap.appendChild(accountNameCloseBtn);
        btnWrap.appendChild(accountNameBtnWrap);

        payeeBtnWrap = document.createElement('div');
        payeeBtnWrap.classList.add('filterSelectionBtnWrap');
        payeeBtnWrap.appendChild(payeeBtn);
        payeeBtnWrap.appendChild(payeeCloseBtn);
        btnWrap.appendChild(payeeBtnWrap);

        categoryBtnWrap = document.createElement('div');
        categoryBtnWrap.classList.add('filterSelectionBtnWrap');
        categoryBtnWrap.appendChild(categoryBtn);
        categoryBtnWrap.appendChild(categoryCloseBtn)
        btnWrap.appendChild(categoryBtnWrap);

        enteredByBtnWrap = document.createElement('div');
        enteredByBtnWrap.classList.add('filterSelectionBtnWrap');
        enteredByBtnWrap.appendChild(enteredByBtn);
        enteredByBtnWrap.appendChild(enteredByCloseBtn);
        btnWrap.appendChild(enteredByBtnWrap);

        isattachmentBtnWrap = document.createElement('div');
        isattachmentBtnWrap.classList.add('filterSelectionBtnWrap');
        isattachmentBtnWrap.appendChild(isattachmentBtn);
        isattachmentBtnWrap.appendChild(isattachmentCloseBtn);
        btnWrap.appendChild(isattachmentBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'transectionTypeBtn') {
            filterValues.transectionType = '%';
        }
        if (closeFilter == 'accountNameBtn') {
            filterValues.accountName = '%';
        }
        if (closeFilter == 'payeeBtn') {
            filterValues.payee = '%';
        }
        if (closeFilter == 'enteredByBtn') {
            filterValues.enteredBy = '%';
        }
        if (closeFilter == 'isattachmentBtn') {
            filterValues.isattachment = '%';
        }
        if (closeFilter == 'categoryBtn') {
            filterValues.category = '%';
        }
        loadConsumerFinanceLanding();
    }

    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(IsShow) {
        // popup
        filterPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        // dropdowns & inputs
        fromDateInput = input.build({
            id: 'fromDateInput',
            type: 'date',
            label: 'From Date',
            style: 'secondary',
            value: filterValues.activityStartDate,
        });

        toDateInput = input.build({
            id: 'toDateInput',
            type: 'date',
            label: 'To Date',
            style: 'secondary',
            value: filterValues.activityEndDate,
        });

        minAmountInput = input.build({
            id: 'minAmountInput',
            type: 'text',
            label: 'Min Amount',
            style: 'secondary',
            value: '$' + ((filterValues.minamount) ? filterValues.minamount : ''),
        });

        maxAmountInput = input.build({
            id: 'maxAmountInput',
            type: 'text',
            label: 'Max Amount',
            style: 'secondary',
            value: '$' + ((filterValues.maxamount) ? filterValues.maxamount : ''),
        });

        transectionTypeFilterDropdown = dropdown.build({
            label: "Transaction Type",
            dropdownId: "transectionTypeFilterDropdown",
        });

        accountFilterDropdown = dropdown.build({
            label: "Account",
            dropdownId: "accountFilterDropdown",
        });

        payeeDropdown = dropdown.build({
            id: 'payeeDropdown',
            label: "Payee",
            dropdownId: "payeeDropdown",
        });

        categoryDropdown = dropdown.build({
            id: 'categoryDropdown',
            label: "Category",
            dropdownId: "categoryDropdown",
        });

        lastUpdateDropdown = dropdown.build({
            id: 'lastUpdateDropdown',
            label: "Last Updated By",
            dropdownId: "lastUpdateDropdown",
        });

        isAttachedDropdown = dropdown.build({
            id: 'isAttachedDropdown',
            label: "Has Attachment?",
            dropdownId: "isAttachedDropdown",
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

        var dateWrap = document.createElement('div');
        dateWrap.classList.add('dateWrap');
        if (IsShow == 'ALL' || IsShow == 'activityStartDateBtn')
            dateWrap.appendChild(fromDateInput);
        if (IsShow == 'ALL' || IsShow == 'activityEndDateBtn')
            dateWrap.appendChild(toDateInput);

        var amountWrap = document.createElement('div');
        amountWrap.classList.add('dateWrap');
        if (IsShow == 'ALL' || IsShow == 'minamountBtn')
            amountWrap.appendChild(minAmountInput);
        if (IsShow == 'ALL' || IsShow == 'maxamountBtn')
            amountWrap.appendChild(maxAmountInput);

        // build popup
        filterPopup.appendChild(dateWrap);
        filterPopup.appendChild(amountWrap);
        if (IsShow == 'ALL' || IsShow == 'transectionTypeBtn')
            filterPopup.appendChild(transectionTypeFilterDropdown);
        if (IsShow == 'ALL' || IsShow == 'accountNameBtn')
            filterPopup.appendChild(accountFilterDropdown);
        if (IsShow == 'ALL' || IsShow == 'payeeBtn')
            filterPopup.appendChild(payeeDropdown);
        if (IsShow == 'ALL' || IsShow == 'categoryBtn')
            filterPopup.appendChild(categoryDropdown);
        if (IsShow == 'ALL' || IsShow == 'enteredByBtn')
            filterPopup.appendChild(lastUpdateDropdown);
        if (IsShow == 'ALL' || IsShow == 'isattachmentBtn')
            filterPopup.appendChild(isAttachedDropdown);

        filterPopup.appendChild(btnWrap);
        eventListeners();
        populateFilterDropdown();
        POPUP.show(filterPopup);
        checkValidationOfFilter();
    }

    // binding filter events 
    function eventListeners() {
        var tmpactivityStartDate;
        var tmpactivityEndDate;
        var tmpminAmount;
        var tmpmaxAmount;
        var tmpaccountName;
        var tmpenteredBy;
        var tmppayee;
        var tmpcategory;
        var tmpisattachment;
        var tmptransectionType;

        fromDateInput.addEventListener('change', event => {
            tmpactivityStartDate = event.target.value;
            checkValidationOfFilter();
        });
        toDateInput.addEventListener('change', event => {
            tmpactivityEndDate = event.target.value;
            checkValidationOfFilter();
        });

        minAmountInput.addEventListener('keyup', event => {
            minAmount = event.target.value;
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(minAmount)) {
                document.getElementById('minAmountInput').value = minAmount.substring(0, minAmount.length - 1);
                return;
            }
            else if (minAmount.includes('.') && (minAmount.match(/\./g).length > 1 || minAmount.toString().split('.')[1].length > 2)) {
                document.getElementById('minAmountInput').value = minAmount.substring(0, minAmount.length - 1);
                return;
            }

            tmpminAmount = minAmount.trim().replace('$', '');
            tmpminAmount = parseFloat(tmpminAmount).toFixed(2);
        });

        maxAmountInput.addEventListener('keyup', event => {
            maxAmount = event.target.value;
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(maxAmount)) {
                document.getElementById('maxAmountInput').value = maxAmount.substring(0, maxAmount.length - 1);
                return;
            }
            else if (maxAmount.includes('.') && (maxAmount.match(/\./g).length > 1 || maxAmount.toString().split('.')[1].length > 2)) {
                document.getElementById('maxAmountInput').value = maxAmount.substring(0, maxAmount.length - 1);
                return;
            }
            tmpmaxAmount = maxAmount.trim().replace('$', '');  
            tmpmaxAmount = parseFloat(tmpmaxAmount).toFixed(2); 
        });

        transectionTypeFilterDropdown.addEventListener('change', event => {
            tmptransectionType = event.target.value;
        });
        accountFilterDropdown.addEventListener('change', event => {
            tmpaccountName = event.target.value;
        });
        lastUpdateDropdown.addEventListener('change', event => {
            tmpenteredBy = event.target.options[event.target.selectedIndex].innerHTML == 'ALL' ? '%' : event.target.options[event.target.selectedIndex].id; //event.target.options[event.target.selectedIndex].innerHTML;
            filterValues.userName = event.target.options[event.target.selectedIndex].innerHTML;
        });
        payeeDropdown.addEventListener('change', event => {
            tmppayee = event.target.value;
        });
        categoryDropdown.addEventListener('change', event => {
            tmpcategory = event.target.value;
        });
        isAttachedDropdown.addEventListener('change', event => {
            tmpisattachment = event.target.value;
        });

        APPLY_BTN.addEventListener('click', () => {
            if (!APPLY_BTN.classList.contains('disabled')) {
                updateFilterData({
                    tmpactivityStartDate,
                    tmpactivityEndDate,
                    tmpminAmount,
                    tmpmaxAmount,
                    tmpaccountName,
                    tmpenteredBy,
                    tmppayee,
                    tmpcategory,
                    tmpisattachment,
                    tmptransectionType
                });
                POPUP.hide(filterPopup);
                loadConsumerFinanceLanding();
            }
        });

    }

    function updateFilterData(data) {
        if (data.tmpactivityStartDate) filterValues.activityStartDate = data.tmpactivityStartDate;
        if (data.tmpactivityEndDate) filterValues.activityEndDate = data.tmpactivityEndDate;
        if (data.tmpminAmount) filterValues.minamount = data.tmpminAmount;
        if (data.tmpmaxAmount) filterValues.maxamount = data.tmpmaxAmount;
        if (data.tmpaccountName) filterValues.accountName = data.tmpaccountName;
        if (data.tmpenteredBy) filterValues.enteredBy = data.tmpenteredBy;
        if (data.tmppayee) filterValues.payee = data.tmppayee;
        if (data.tmpcategory) filterValues.category = data.tmpcategory;
        if (data.tmpisattachment) filterValues.isattachment = data.tmpisattachment;
        if (data.tmptransectionType) filterValues.transectionType = data.tmptransectionType;
    }

    function checkValidationOfFilter() {
        var fromDate = fromDateInput.querySelector('#fromDateInput');
        var toDate = toDateInput.querySelector('#toDateInput');

        if (fromDate.value > toDate.value) {
            toDateInput.classList.add('errorPopup');
        } else {
            toDateInput.classList.remove('errorPopup');
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

    async function populateFilterDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync(selectedConsumersId, accountPermission);
        let accountData = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountName,
            text: account.accountName
        }));
        accountData.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate("accountFilterDropdown", accountData, filterValues.accountName);

        const {
            getPayeesResult: Payees,
        } = await ConsumerFinancesAjax.getPayeesAsync($.session.consumerId);
        let payeeData = Payees.map((payees) => ({
            id: payees.CategoryID,
            value: payees.Description,
            text: payees.Description
        }));
        payeeData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("payeeDropdown", payeeData, filterValues.payee);
        let categoryID;
        const {
            getCategoriesSubCategoriesResult: Category,
        } = await ConsumerFinancesAjax.getCategoriesSubCategoriesAsync(categoryID);
        let categoryData = Category.map((category) => ({
            id: category.CategoryID,
            value: category.CategoryDescription,
            text: category.CategoryDescription
        }));
        categoryData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("categoryDropdown", categoryData, filterValues.category);

        const {
            getActiveUsedByResult: employees,
        } = await ConsumerFinancesAjax.getActiveEmployeesAsync();
        let data = employees.map((employee) => ({
            id: employee.userId,
            value: employee.userId,
            text: employee.userName
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("lastUpdateDropdown", data, filterValues.enteredBy);

        const condfidentialDropdownData = ([
            { text: 'Yes', value: 'Yes' },
            { text: 'No', value: 'No' },
        ]);
        condfidentialDropdownData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("isAttachedDropdown", condfidentialDropdownData, filterValues.isattachment);

        const TransectionTypeDropdownData = ([
            { text: 'Deposit', value: 'false' },
            { text: 'Expense', value: 'true' },
        ]);
        TransectionTypeDropdownData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("transectionTypeFilterDropdown", TransectionTypeDropdownData, filterValues.transectionType);
    }

    function filterPopupCancelBtn() {
        POPUP.hide(filterPopup);
    }

    function init() {
        setActiveModuleAttribute('ConsumerFinances');
        DOM.clearActionCenter();

        let defaultCFLocation = defaults.getLocation('moneyManagement');
        if (defaultCFLocation === '') {
            defaults.setLocation('moneyManagement', 0);
            defaultCFLocation = "0";
        }
        roster2.miniRosterinit({
            locationId: defaultCFLocation,
            locationName: '',
        }, {
            hideDate: true,
        });

        roster2.showMiniRoster();
    }

    return {
        init,
        handleActionNavEvent,
        loadConsumerFinanceLanding,
        getaccountPermission,
        backFromConsumerFinanceEditAccount,
    };
})(); 
