var absentWidget = (function() {
    // DATA
    //-----------------------
    var date;
    // cached data
    var absentWidgetDate;
    var absentWidgetLocationId;
    var absentWidgetLocationName;
    var absentWidgetGroupId;
    var absentWidgetGroupName;
    var absentWidgetGroupCode;
    // DOM
    //-----------------------
    var widget;
    var widgetBody;
    var consumerList;
    var totalConsumers;
    var filterPopup;
    var locationDropdown;
    var groupDropdown;
    var applyFiltersBtn;
    var cancelFilterBtn;
    var locationList;
    var groupList;

    function buildFilterPopup() {
        var widgetFilter = widget.querySelector('.widget__filters');
        if (widgetFilter) return;

        filterPopup = dashboard.buildFilterPopup();

        var dateInput = input.build({
            id: 'absentWidgetDate',
            label: 'Date',
            type: 'date',
            style: 'secondary',
            value: absentWidgetDate
        });
        locationDropdown = dropdown.build({
            dropdownId: 'absentWidgetLocations',
            label: 'Location',
            style: 'secondary',
            readonly: false
        });
        groupDropdown = dropdown.build({
            dropdownId: 'absentWidgetGroups',
            label: 'Group',
            style: 'secondary',
            readonly: $.session.RosterCaseLoad
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

        filterPopup.appendChild(dateInput);
        filterPopup.appendChild(locationDropdown);
        filterPopup.appendChild(groupDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);

        // Set date filter to today        
        date = document.getElementById('absentWidgetDate');
        date.value = UTIL.getTodaysDate();
        absentWidgetDate = date.value;
    }
    function eventSetup() {
        var oldAbsentDate;
        var oldLocationName;
        var oldLocationId;
        var oldGroupId;
        var oldGoupCode;
        var oldGroupName;

        date.addEventListener('change', event => {
            var absentDate = event.target.value;
            oldAbsentDate = absentWidgetDate;
            absentWidgetDate = absentDate;

            // cache old values
            oldLocationName = absentWidgetLocationName;
            oldLocationId = absentWidgetLocationId;           
            //When changing the date - locations get reset, so also reset the ID and Name back to all - which is the default value
            absentWidgetLocationId = "000";
            absentWidgetLocationName = "ALL";
            absentWidgetAjax.getLocationsForDashboardAbsent(populateAbsentWidgetLocations);
             
            // if case load apply group dorpdown must be caseload not repopulated 
            if ($.session.RosterCaseLoad == false) {
                oldGroupId = absentWidgetGroupId;
                oldGoupCode = absentWidgetGroupCode;
                oldGroupName = absentWidgetGroupName;
                absentWidgetGroupId = '0';
                absentWidgetGroupCode = 'ALL';
                absentWidgetGroupName = 'Everyone';
                absentWidgetAjax.getConsumerGroupsForDashboardAbsent(absentWidgetLocationId, populateAbsentWidgetGroups);
            }
        });
        locationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            // cache old values
            oldLocationName = absentWidgetLocationName;
            oldLocationId = absentWidgetLocationId;
            // update session variables
            absentWidgetLocationName = selectedOption.innerHTML;
            absentWidgetLocationId = selectedOption.value;

            // if case load apply group dorpdown must be caseload not repopulated 
            if ($.session.RosterCaseLoad == false) {
                // reset group session variables since location dropdown change updates group dropdown values
                oldGroupId = absentWidgetGroupId;
                oldGoupCode = absentWidgetGroupCode;
                oldGroupName = absentWidgetGroupName;
                absentWidgetGroupId = '0';
                absentWidgetGroupCode = 'ALL';
                absentWidgetGroupName = 'Everyone';
                // update group dropdown 
                absentWidgetAjax.getConsumerGroupsForDashboardAbsent(absentWidgetLocationId, populateAbsentWidgetGroups);
            }          
        });
        groupDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            // cache old values
            oldGroupId = absentWidgetGroupId;
            oldGoupCode = absentWidgetGroupCode;
            oldGroupName = absentWidgetGroupName;
            // update session variables
            absentWidgetGroupId = selectedOption.value;
            absentWidgetGroupCode = selectedOption.id;
            absentWidgetGroupName = selectedOption.innerHTML;
        });
        applyFiltersBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);

            //Loading
            consumerList.innerHTML = '';
            PROGRESS__ANYWHERE.init()
            PROGRESS__ANYWHERE.SPINNER.show(consumerList, "Loading");
        
            absentWidgetAjax.getAbsentWidgetFilterDataAjax({
                token: $.session.Token,
                absentDate: absentWidgetDate,
                absentLocationId: absentWidgetLocationId,
                absentGroupCode: absentWidgetGroupCode,
                custGroupId: absentWidgetGroupId,
                isCaseLoad: $.session.RosterCaseLoad,
            }, populateAbsentWidgetResults);
            widgetSettingsAjax.setWidgetFilter('dashabsentconsumers', 'location', absentWidgetLocationId);
            widgetSettingsAjax.setWidgetFilter('dashabsentconsumers', 'group', absentWidgetGroupId);
        });
        cancelFilterBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);

            absentWidgetDate = oldAbsentDate;
            absentWidgetLocationId = oldLocationId;
            absentWidgetLocationName = oldLocationName;
            absentWidgetGroupId = oldGroupId;
            absentWidgetGroupCode = oldGoupCode;
            absentWidgetGroupName = oldGroupName;
        });
    }
    function populateAbsentWidgetLocations(results) {
        var data = results.map(r => {
            return {
                id: r.ID,
                value: r.ID,
                text: r.Name
            }
        });
        locationList = data;
        dropdown.populate('absentWidgetLocations', data, absentWidgetLocationId);
    }
    function populateAbsentWidgetGroups(results) {
        var data = results.map(r => {
            return {
                id: r.GroupCode,
                value: r.RetrieveID,
                text: r.GroupName
            }
        });
        UTIL.findAndSlice(data, 'Everyone', 'text');
        const defaultGroup = {
            id: '%',
            value: '0',
            text: 'EVERYONE',
        };
        data.unshift(defaultGroup);

        if ($.session.RosterCaseLoad) {
            const caseLoadGroup = { id: 'CAS', value: '00', text: 'Caseload' };
            data.unshift(caseLoadGroup);
        }


        var defaultVal = absentWidgetGroupId

        if (absentWidgetLocationId !== '000') {
            var allFiterData = data.filter(d => d.id === 'ALL');
            if (allFiterData.length > 0) {
                defaultVal = allFiterData[0].value;
            }
        }
        groupList = data;
        dropdown.populate('absentWidgetGroups', data, defaultVal);
    }
    function displayFilteredBy() {
        var filteredBy = widget.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
            widgetBody.insertBefore(filteredBy, totalConsumers);
        }

        var splitDate = absentWidgetDate.split('-');
        var filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(splitDate[2])}/${splitDate[0].slice(2, 4)}`;

        filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Date:</span> ${filteredDate}</p>
      <p><span>Location:</span> ${absentWidgetLocationName}</p>
      <p><span>Group:</span> ${absentWidgetGroupName}</p>
    </div>`;
    }

    function populateAbsentWidgetResults(results) {
        displayFilteredBy();

        consumerList.innerHTML = '';

        if (results.length < 1) {
            totalConsumers.innerHTML = '';
            consumerList.innerHTML = `<p>No Absent Consumers</p>`;
            return;
        }

        var absentObj = {};
        var locations = [];
        var totalAbsentCount = 0;
        // build absent object
        results.forEach(r => {
            var locationName = r.Description;
            var locationId = r.locId;
            var consumerName = `${r.LN}, ${r.FN}`;
            if (locationId !== absentWidgetLocationId && absentWidgetLocationId !== '000') return; // This breaks current iteration if you are filtering a location

            if (!absentObj[locationId]) {
                absentObj[locationId] = [];
                locations.push(`${locationName}{*}${locationId}`);
            }
            totalAbsentCount++
            absentObj[locationId].push(consumerName);
        });
        // sort by location name
        locations = locations.sort((a, b) => {
            return a < b ? 1 : 0;
        });
        // build & append absent consumer results
        locations.forEach(loc => {
            loc = loc.split('{*}');
            var locName = loc[0];
            var locId = loc[1];
            var totalAbsent = absentObj[locId].length;
            var header = `${locName} - ${totalAbsent}`;
            var list = `
        <ul>
          ${absentObj[locId].map(c => `<li>${c}</li>`).join('')}
        </ul>
      `;
            consumerList.innerHTML += `<h4>${header}</h4><p>${list}</p>`;
        });

        totalConsumers.innerHTML = `<h4>Total Absent: ${totalAbsentCount}</h4>`;
    }

    async function init() {
        widget = document.getElementById('dashabsentconsumers');
        widgetBody = widget.querySelector('.widget__body');
        consumerList = document.querySelector('.absentConsumerList');
        totalConsumers = document.querySelector('.totalAbsentConsumers');

        // append filter button
        dashboard.appendFilterButton('dashabsentconsumers', 'absentFilterBtn');

        var filterLocationDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashabsentconsumers', 'location');
        absentWidgetLocationId = filterLocationDefaultValue.getWidgetFilterResult;
        var filterGroupDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashabsentconsumers', 'group');
        absentWidgetGroupId = filterGroupDefaultValue.getWidgetFilterResult;
        var isCaseLoad = $.session.RosterCaseLoad;

        if (!absentWidgetDate) absentWidgetDate = UTIL.getTodaysDate();
        if (!absentWidgetLocationId) absentWidgetLocationId = '000';
        if (!absentWidgetLocationName) absentWidgetLocationName = 'ALL';
        if (!absentWidgetGroupId) absentWidgetGroupId = '0';
        if (!absentWidgetGroupName) absentWidgetGroupName = 'Everyone';
        if (!absentWidgetGroupCode) absentWidgetGroupCode = 'ALL';

        if (isCaseLoad) absentWidgetGroupId = '00';
        if (isCaseLoad) absentWidgetGroupName = 'Caseload';
        if (isCaseLoad) absentWidgetGroupCode = 'CAS';
        // To handle if caseload security key apply and than remove  that time caseload widget setting value not applying 
        if (!isCaseLoad && absentWidgetGroupId == '00') {
            absentWidgetGroupId = '0';
            absentWidgetGroupName = 'Everyone';
            absentWidgetGroupCode = 'ALL'; 
        }

        buildFilterPopup();
        displayFilteredBy();
        eventSetup();

        PROGRESS__ANYWHERE.init()
        PROGRESS__ANYWHERE.SPINNER.show(consumerList, "Loading");

        absentWidgetAjax.getLocationsForDashboardAbsent(function (locations) {
            absentWidgetAjax.getConsumerGroupsForDashboardAbsent(absentWidgetLocationId, function (groups) {
                populateAbsentWidgetLocations(locations);
                populateAbsentWidgetGroups(groups);

                absentWidgetLocationName = locationList.find(l => l.id == absentWidgetLocationId)?.text;
                absentWidgetGroupName = groupList.find(l => l.value == absentWidgetGroupId)?.text;
                absentWidgetGroupCode = groupList.find(l => l.value == absentWidgetGroupId)?.id;
            
                absentWidgetAjax.getAbsentWidgetFilterDataAjax({
                    token: $.session.Token,
                    absentDate: absentWidgetDate,
                    absentLocationId: absentWidgetLocationId,
                    absentGroupCode: absentWidgetGroupCode,
                    custGroupId: absentWidgetGroupId,
                    isCaseLoad: $.session.RosterCaseLoad,
                }, populateAbsentWidgetResults);
            });
        });

        // populate widget
        // absentWidgetAjax.getLocationsForDashboardAbsent(populateAbsentWidgetLocations);
        // absentWidgetAjax.getConsumerGroupsForDashboardAbsent(absentWidgetLocationId, populateAbsentWidgetGroups);
    }

    return {
        init
    };
})();