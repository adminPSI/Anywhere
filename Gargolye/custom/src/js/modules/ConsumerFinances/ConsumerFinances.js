const ConsumerFinances = (() => {
    //Inputs
    let newFilterBtn;
    let filterRow;
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

    //service filter options
    let selectedConsumerIds;

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
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

    // Build OOD Module Landing Page 
    async function loadConsumerFinanceLanding(value) {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();

        if (value) {
            filterValues.accountName = value;
        }

        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

        landingPage = document.createElement('div');
        var LineBr = document.createElement('br');

        selectedConsumersId = selectedConsumers[0].id;
        $.session.consumerId = selectedConsumersId;
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
        ConsumerFinanceEntriesTable = await buildConsumerFinanceEntriesTable(filterValues);
        landingPage.appendChild(ConsumerFinanceEntriesTable);
        populateAccountDropdown();
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // build the listing of OOD Entries (based off of filter settings)
    async function buildConsumerFinanceEntriesTable(filterValues) {
        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            headline: 'Consumer: ' + selectedConsumersName,
            columnHeadings: ['Date', 'Account', 'Payee', 'Category', 'Amount', 'Check No.', 'Balance', 'Entered By', ''],
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
        );

        ConsumerFinancesEntries.getAccountTransectionEntriesResult.forEach(function (entry) {
            let newDate = new Date(entry.activityDate);
            let theMonth = newDate.getMonth() + 1;
            let formatActivityDate = UTIL.leadingZero(theMonth) + '/' + UTIL.leadingZero(newDate.getDate()) + '/' + newDate.getFullYear();
            entry.activityDate = formatActivityDate;
        });

        let tableData = ConsumerFinancesEntries.getAccountTransectionEntriesResult.map((entry) => ({
            values: [entry.activityDate, entry.account, entry.payee, entry.category, '$' + entry.amount, entry.checkno, '$' + entry.balance, entry.enteredby, entry.AttachmentsID == 0 ? '' : `${icons['attachmentSmall']}`],
            attributes: [{ key: 'registerId', value: entry.ID }],
            onClick: (e) => {
                handleAccountTableEvents(e.target.attributes.registerId.value)
            },
        }));
        const oTable = table.build(tableOptions);
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

    // build display of "Entry" Buttons -- "New Entry" and "New Monthly Summary"
    function buildButtonBar(consumer) {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');
        buttonBar.style.maxHeight = '50px';
        buttonBar.style.minWidth = '100%';

        const dropdownButtonBar = document.createElement('div');
        const entryButtonBar = document.createElement('div');
        const filterButtonBar = document.createElement('div');
        dropdownButtonBar.style.width = '32%';
        entryButtonBar.style.width = '32%';
        filterButtonBar.style.width = '32%';

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
            callback: async () => { NewEntryCF.init() },
        });
        if ($.session.CFInsert) {
            entryBtn.classList.remove('disabled');
        }
        else {
            entryBtn.classList.add('disabled');
        }
        entryBtn.style.height = '50px';
        entryBtn.style.minWidth = '100%';

        newFilterBtn = buildNewFilterBtn();
        newFilterBtn.style.height = '50px';
        newFilterBtn.style.minWidth = '100%';
        accountDropdown.style.minWidth = '100%';
        dropdownButtonBar.appendChild(accountDropdown);
        entryButtonBar.appendChild(entryBtn);
        filterButtonBar.appendChild(newFilterBtn);

        entryButtonBar.style.marginLeft = '2%';
        filterButtonBar.style.marginLeft = '2%';

        buttonBar.appendChild(dropdownButtonBar);
        buttonBar.appendChild(entryButtonBar);
        buttonBar.appendChild(filterButtonBar);
        return buttonBar;
    }

    // build Filter button, which filters the data displayed on the OOD Entries Table
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
        }

        return button.build({
            text: 'Filter',
            style: 'secondary',
            type: 'contained',
            callback: () => buildFilterPopUp(filterValues)
        });
    }

    // Populate the Account DDL 
    async function populateAccountDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync(selectedConsumersId);
        let data = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountName,
            text: account.accountName
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate("accountDropdown", data, filterValues.accountName);
    }

    // build the display of the current Filter Settings (next to the Filter button) 
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
        }

        filteredBy.style.maxWidth = '100%';
        const startDate = moment(filterValues.activityStartDate, 'YYYY-MM-DD').format('M/D/YYYY');
        const endDate = moment(filterValues.activityEndDate, 'YYYY-MM-DD').format('M/D/YYYY');

        filteredBy.innerHTML = `<div class="filteredByData">
			<p>
                <span>From Date:</span> ${startDate}&nbsp;&nbsp;
			    <span>To date:</span> ${endDate}&nbsp;&nbsp;
                <span>Min Amount:</span>$ ${filterValues.minamount}&nbsp;&nbsp;
                <span>Max Amount:</span>$ ${filterValues.maxamount}&nbsp;&nbsp;
                <span>Account:</span> ${(filterValues.accountName == '%') ? 'ALL' : filterValues.accountName}&nbsp;&nbsp;
			    <span>Payee:</span> ${(filterValues.payee == '%') ? 'ALL' : filterValues.payee}&nbsp;&nbsp;
			    <span>Category:</span> ${(filterValues.category == '%') ? 'ALL' : filterValues.category} &nbsp;&nbsp;
                <span>Last Updated By:</span> ${(filterValues.enteredBy == '%') ? 'ALL' : filterValues.userName} &nbsp;
                <span>Has Attachment:</span>${(filterValues.isattachment == '%') ? 'ALL' : filterValues.isattachment} 
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

        fromDateInput = input.build({ 
            id: 'fromDateInput',
            type: 'date',
            label: 'From Date', 
            style: 'secondary',
            value:filterValues.activityStartDate,
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

        // dropdowns & inputs
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
            callback: async () => filterPopupDoneBtn()
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => filterPopupCancelBtn()
        });
        fromDateInput.style.width = '170px';
        toDateInput.style.width = '170px';
        minAmountInput.style.width = '170px';
        maxAmountInput.style.width = '170px';
        toDateInput.style.marginLeft = '12px';
        maxAmountInput.style.marginLeft = '12px';


        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        var dateWrap = document.createElement('div');
        dateWrap.classList.add('dropdownWrap');
        dateWrap.appendChild(fromDateInput);
        dateWrap.appendChild(toDateInput);

        var amountWrap = document.createElement('div');
        amountWrap.classList.add('dropdownWrap');
        amountWrap.appendChild(minAmountInput);
        amountWrap.appendChild(maxAmountInput);

        // build popup
        filterPopup.appendChild(dateWrap);
        filterPopup.appendChild(amountWrap);
        filterPopup.appendChild(accountFilterDropdown);

        filterPopup.appendChild(payeeDropdown);
        filterPopup.appendChild(categoryDropdown);
        filterPopup.appendChild(lastUpdateDropdown);
        filterPopup.appendChild(isAttachedDropdown);

        filterPopup.appendChild(btnWrap);
        eventListeners();
        populateFilterDropdown();
        POPUP.show(filterPopup);
    }

    // binding filter events 
    function eventListeners() {
        fromDateInput.addEventListener('change', event => {
            filterValues.activityStartDate = event.target.value;
        });
        toDateInput.addEventListener('change', event => {
            filterValues.activityEndDate = event.target.value;   
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
            filterValues.minamount = minAmount.replace('$', '');
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
            filterValues.maxamount = maxAmount.replace('$', ''); 
        });

        accountFilterDropdown.addEventListener('change', event => {
            filterValues.accountName = event.target.value;
        });
        lastUpdateDropdown.addEventListener('change', event => {
            filterValues.enteredBy = event.target.value;
            filterValues.userName = event.target.options[event.target.selectedIndex].innerHTML;
        });
        payeeDropdown.addEventListener('change', event => {
            filterValues.payee = event.target.value;
        });
        categoryDropdown.addEventListener('change', event => {
            filterValues.category = event.target.value;
        });
        isAttachedDropdown.addEventListener('change', event => {
            filterValues.isattachment = event.target.value; 
        });

    }

    async function populateFilterDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync(selectedConsumersId);
        let accountData = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountName,
            text: account.accountName
        }));
        accountData.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate("accountFilterDropdown", accountData, filterValues.accountName);

        const {
            getPayeesResult: Payees,
        } = await ConsumerFinancesAjax.getPayeesAsync();
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
    }

    async function filterPopupDoneBtn() {
        POPUP.hide(filterPopup);
        eventListeners();
        loadConsumerFinanceLanding();
    }

    function filterPopupCancelBtn() {
        POPUP.hide(filterPopup);
    }

    function init() {
        setActiveModuleAttribute('ConsumerFinances');
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        init,
        handleActionNavEvent,
        loadConsumerFinanceLanding,
    };
})(); 
