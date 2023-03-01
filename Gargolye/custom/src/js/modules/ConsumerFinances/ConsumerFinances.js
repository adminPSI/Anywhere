const ConsumerFinances = (() => {
    //Inputs

    let newFilterBtn;
    let filterRow;
    let newEntryBtn;
    let ConsumerFinanceEntriesTable = [];
    let CFConsumerBtns;
    let consumerRow;
    let consumerElement;
    let filterPopup;
    var selectedConsumers;
    var selectedConsumersName;

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
    async function loadConsumerFinanceLanding() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

        landingPage = document.createElement('div');
        var LineBr = document.createElement('br');
  
        selectedConsumers.forEach((consumer) => {
            selectedConsumersName = consumer.card.innerText
            const topButton = buildHeaderButton(consumer);
            landingPage.appendChild(topButton);
        });

        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        //TODO:
        //const filteredBy = buildFilteredBy();
        //filterRow.appendChild(filteredBy);

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
            tableId: 'OODEntriesTable',
            headline: selectedConsumersName,
            columnHeadings: ['Date', 'Account', 'Payee', 'Category', 'Amount', 'Check No.', 'Balance', 'Entered By'],
            endIcon: false,

        };

        selectedConsumerIds = selectedConsumers.map(function (x) { return x.id });
        let ConsumerFinancesEntries = await ConsumerFinancesAjax.getAccountTransectionEntriesAsync(
            selectedConsumerIds.join(", "),
            filterValues.activityStartDate,
            filterValues.activityEndDate,
            filterValues.accountName,
            filterValues.payee,
            filterValues.category,
            filterValues.amount,
            filterValues.checkNo,
            filterValues.Balance,
            filterValues.enteredBy,
        );

        debugger;
        ConsumerFinancesEntries.getAccountTransectionEntriesResult.forEach(function (entry) {
            let newDate = new Date(entry.activityDate);
            let theMonth = newDate.getMonth() + 1;
            let formatActivityDate = UTIL.leadingZero(theMonth) + '/' + UTIL.leadingZero(newDate.getDate()) + '/' + newDate.getFullYear();
            entry.activityDate = formatActivityDate;
        });


        let tableData = ConsumerFinancesEntries.getAccountTransectionEntriesResult.map((entry) => ({
            values: [entry.activityDate, entry.account, entry.payee, entry.category, entry.amount, entry.checkno, entry.balance, entry.enteredby],

            attributes: [{ key: 'registerId', value: entry.ID }, { key: 'userId', value: entry.enteredby }],
            onClick: (e) => {

            },
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
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
            debugger;
            //filterValues.userId = event.target.value;
            filterValues.accountName = event.target.options[event.target.selectedIndex].text;
            loadConsumerFinanceLanding(); 
            //ConsumerFinanceEntriesTable =  buildConsumerFinanceEntriesTable(filterValues); 
        });


        const entryBtn = button.build({
            text: '+ New Entry',
            style: 'secondary',
            type: 'contained',
            attributes: [{ key: 'consumerId', value: consumer.id }, { key: 'btnType', value: 'newEntry' }],
            classNames: !$.session.OODInsert ? ['newEntryBtn', 'disabled'] : ['newEntryBtn'],
        });
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
        populateAccountDropdown();

        return buttonBar;
    }

    // build Filter button, which filters the data displayed on the OOD Entries Table
    function buildNewFilterBtn() {
        if (!filterValues) filterValues = {
            token: $.session.Token,
            activityStartDate: '2006-02-01', //UTIL.formatDateFromDateObj(dates.subDays(new Date(), 30)),
            activityEndDate: UTIL.getTodaysDate(),
            accountName: '%',
            payee: '%',
            category: '%',
            amount: '',
            checkNo: '',
            Balance: '',
            enteredBy: '%'
        }

        return button.build({
            text: 'Filter',
            style: 'secondary',
            type: 'contained',
            //Todo : 
            /*callback: () => buildFilterPopUp(filterValues)*/
        });
    }

    // Populate the Account DDL 
    async function populateAccountDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync();
        let data = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountId,
            text: account.accountName
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value    
        data.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("accountDropdown", data, filterValues.accountName);
    }



    //TODO:
    // build the display of the current Filter Settings (next to the Filter button) 
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
        }

        filteredBy.style.maxWidth = '100%';
        // var splitDate = selectedDate.split('-');
        var splitDate = "2021-12-28".split('-');
        var filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(
            splitDate[2],
        )}/${splitDate[0].slice(2, 4)}`;

        const startDate = moment(filterValues.activityStartDate, 'YYYY-MM-DD').format('M/D/YYYY');
        const endDate = moment(filterValues.activityEndDate, 'YYYY-MM-DD').format('M/D/YYYY');

        filteredBy.innerHTML = `
		  <div class="filteredByData">
			<p>
                <span>Date:</span> ${startDate}&nbsp;&nbsp;
			    <span>End date:</span> ${endDate}&nbsp;&nbsp;
                <span>Account:</span> ${(filterValues.accountName == '%') ? 'ALL' : filterValues.accountName}&nbsp;&nbsp;
			    <span>Payee:</span> ${(filterValues.payee == '%') ? 'ALL' : filterValues.payee}&nbsp;&nbsp;
			    <span>Category:</span> ${(filterValues.category == '%') ? 'ALL' : filterValues.category}
            </p>
		  </div>
		`;

        return filteredBy;
    }

    // ToDO:
    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(filterValues) {
        // popup
        filterPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });
        // dropdowns & inputs
        accountDropdown = dropdown.build({
            label: "Account",
            dropdownId: "accountDropdown",
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
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        // build popup

        filterPopup.appendChild(accountDropdown);
     
        filterPopup.appendChild(btnWrap);

        eventListeners();

        POPUP.show(filterPopup);
    }

    // ToDO:
    // binding filter events 
    function eventListeners() {
        accountDropdown.addEventListener('change', event => {
            filterValues.serviceId = event.target.value;
            filterValues.serviceName = event.target.options[event.target.selectedIndex].text;
        });
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
