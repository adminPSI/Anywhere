var consumerFinancesWidget = (function () {
    // cached data
    var cfWidgetLocationName;
    var cfWidgetConsumerName;
    var cfWidgetSortOrderId;
    var cfWidgetSortOrderName;
    // DOM
    //-----------------------
    var widget;
    var widgetBody;
    var filterPopup;
    var locationDropdown;
    var consumerDropdown;
    var sortOrderDropdown;
    var applyFiltersBtn;
    var cancelFilterBtn;

    function buildFilterPopup() {
        var widgetFilter = widget.querySelector('.widget__filters');
        if (widgetFilter) return;

        filterPopup = dashboard.buildFilterPopup();

        locationDropdown = dropdown.build({
            dropdownId: 'consumerFinancesWidgetLocations',
            label: 'Location',
            style: 'secondary',
            readonly: false
        });
        consumerDropdown = dropdown.build({
            dropdownId: 'consumerFinancesWidgetConsumer',
            label: 'Consumer',
            style: 'secondary',
            readonly: false
        });
        sortOrderDropdown = dropdown.build({
            dropdownId: 'consumerFinancesWidgetSortOrder',
            label: 'Sort Order',
            style: 'secondary',
            readonly: false
        });
        applyFiltersBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained'
        });
        cancelFilterBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined'
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(applyFiltersBtn);
        btnWrap.appendChild(cancelFilterBtn);

        filterPopup.appendChild(consumerDropdown);
        filterPopup.appendChild(locationDropdown);
        filterPopup.appendChild(sortOrderDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);
    }
    function eventSetup() {
        var tempCFWidgetLocationName;
        var tempCFWidgetConsumerName;
        var tempCFWidgetSortOrderName;


        locationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tempCFWidgetLocationName = selectedOption.value;
            // cfWidgetLocationName = selectedOption.value;
        });
        consumerDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tempCFWidgetConsumerName = selectedOption.value;
            // cfWidgetConsumerName = selectedOption.value;
        });
        sortOrderDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tempCFWidgetSortOrderName = selectedOption.value;
            // cfWidgetSortOrderName = selectedOption.value;
        });
        applyFiltersBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);

            updateFilterData({
                tempCFWidgetLocationName,
                tempCFWidgetConsumerName,
                tempCFWidgetSortOrderName
            });

            //Loading
            widgetBody.innerHTML = '';
            PROGRESS__ANYWHERE.init()
            PROGRESS__ANYWHERE.SPINNER.show(widgetBody, "Loading");

            ConsumerFinancesWidgetAjax.getConsumerFinanceWidgetEntriesDataAjax({
                token: $.session.Token,
                consumerName: cfWidgetConsumerName,
                locationName: cfWidgetLocationName,
                sortOrderName: cfWidgetSortOrderName,
                isCaseLoad: $.session.ConsumerFinanceCaseLoad,
            }, populateConsumerFinanceResults);

            widgetSettingsAjax.setWidgetFilter('dashMoneyManagementwidget', 'consumer', cfWidgetConsumerName)
            widgetSettingsAjax.setWidgetFilter('dashMoneyManagementwidget', 'location', cfWidgetLocationName)
            widgetSettingsAjax.setWidgetFilter('dashMoneyManagementwidget', 'sortOrder', cfWidgetSortOrderName)
        });
        cancelFilterBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
        });
    }

    function updateFilterData(data) {
        if (data.tempCFWidgetLocationName) cfWidgetLocationName = data.tempCFWidgetLocationName;
        if (data.tempCFWidgetConsumerName) cfWidgetConsumerName = data.tempCFWidgetConsumerName;
        if (data.tempCFWidgetSortOrderName) cfWidgetSortOrderName = data.tempCFWidgetSortOrderName;
    }

    function populateCFWidgetLocations(results) {
        var data = results.map(r => {
            return {
                id: r.ID,
                value: r.Name,
                text: r.Name
            }
        });
        data.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate('consumerFinancesWidgetLocations', data, cfWidgetLocationName);
    }
    function populateCFWidgetConsumers(results) {
        var data = results.map(r => {
            return {
                id: r.ID,
                value: r.FullName,
                text: r.FullName
            }
        });
        data.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate('consumerFinancesWidgetConsumer', data, cfWidgetConsumerName);
    }
    function populateCFWidgetDropdowns() {
        const sortData = ([
            { id: 1, value: 'Consumer Last Name Ascending', text: 'Consumer Last Name Ascending' },
            { id: 2, value: 'Consumer Last Name Descending', text: 'Consumer Last Name Descending' },
            { id: 3, value: 'Account Balance Ascending', text: 'Account Balance Ascending' },
            { id: 4, value: 'Account Balance Descending', text: 'Account Balance Descending' },
            { id: 5, value: 'Last Transaction Ascending', text: 'Last Transaction Ascending' },
            { id: 6, value: 'Last Transaction Descending', text: 'Last Transaction Descending' },
        ]);
        dropdown.populate("consumerFinancesWidgetSortOrder", sortData, cfWidgetSortOrderName);
    }

    function displayFilteredBy() {
        var filteredBy = widget.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
            widgetBody.appendChild(filteredBy);
        }

        filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Consumer:</span> ${(cfWidgetConsumerName == '%') ? 'ALL' : cfWidgetConsumerName}</p>
      <p><span>Location:</span> ${(cfWidgetLocationName == '%') ? 'ALL' : cfWidgetLocationName}</p> 
      <p><span>Sort Order:</span> ${cfWidgetSortOrderName}</p>
    </div>`;
    }

    var tableOptions = {
        plain: true,
        columnHeadings: ['Name', 'Account', 'Balance', 'Last Transaction'],
        tableId: 'consumerFinanceWidgetTable',
    };

    function populateConsumerFinanceResults(results) {
        displayFilteredBy();
        var widget = document.getElementById('dashMoneyManagementwidget');
        if (!widget) return;


        var cfTable = table.build(tableOptions);
        // Set the data type for each header, for sorting purposes
        const headers = cfTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Name
        headers[1].setAttribute('data-type', 'string'); // Account
        headers[2].setAttribute('data-type', 'amount'); // Balance
        headers[3].setAttribute('data-type', 'date'); // Last Transaction 

        widgetBody.appendChild(cfTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(cfTable);

        cfTableData = results.map(td => {
            var ID = td.Id;
            var name = td.name;
            var account = td.account;
            var balance = td.balance;
            var lastTransaction = td.lastTransaction;

            return {
                id: ID,
                values: [name, account, balance == '' ? '$0.00' : '$' + balance, lastTransaction == '' ? '' : moment(lastTransaction).format('MM/DD/YY')],
                attributes: [
                    { key: 'data-consumer-id', value: td.Id }, { key: 'consumerId', value: td.Id }, { key: 'registerId', value: td.registerId }
                ],
                onClick: (e) => {
                    handleAccountTableEvents(e.target.attributes.consumerId.value, e.target.attributes.registerId.value)
                },
            };
        });

        table.populate(cfTable, cfTableData);
        PROGRESS__ANYWHERE.SPINNER.hide(widgetBody, "Loading");
    }

    function handleAccountTableEvents(consumerId, registerId) {
        $.session.consumerId = consumerId;
        NewEntryCF.buildNewEntryForm(registerId);
    }

    async function init() {
        widget = document.getElementById('dashMoneyManagementwidget');
        widgetBody = widget.querySelector('.widget__body');

        // append filter button
        dashboard.appendFilterButton('dashMoneyManagementwidget', 'moneyManagementFilterBtn');

        var filterConsumerDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashMoneyManagementwidget', 'consumer');
        cfWidgetConsumerName = filterConsumerDefaultValue.getWidgetFilterResult;
        var filterLocationDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashMoneyManagementwidget', 'location');
        cfWidgetLocationName = filterLocationDefaultValue.getWidgetFilterResult;
        var filterSortOrderDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashMoneyManagementwidget', 'sortOrder');
        cfWidgetSortOrderName = filterSortOrderDefaultValue.getWidgetFilterResult;

        if (!cfWidgetLocationName) cfWidgetLocationName = '%';
        if (!cfWidgetConsumerName) cfWidgetConsumerName = '%';
        if (!cfWidgetSortOrderName) cfWidgetSortOrderName = 'Consumer Last Name Ascending';

        buildFilterPopup();
        displayFilteredBy();
        eventSetup();
        populateCFWidgetDropdowns();
        ConsumerFinancesWidgetAjax.getLocationsForDashboardAbsent(populateCFWidgetLocations);
        ConsumerFinancesWidgetAjax.getCFWidgetConsumers($.session.ConsumerFinanceCaseLoad, populateCFWidgetConsumers);

        PROGRESS__ANYWHERE.init()
        PROGRESS__ANYWHERE.SPINNER.show(widgetBody, "Loading");

        ConsumerFinancesWidgetAjax.getConsumerFinanceWidgetEntriesDataAjax({
            token: $.session.Token,
            consumerName: cfWidgetConsumerName,
            locationName: cfWidgetLocationName,
            sortOrderName: cfWidgetSortOrderName,
            isCaseLoad: $.session.ConsumerFinanceCaseLoad,
        }, populateConsumerFinanceResults);
    }

    return {
        init
    };
})();