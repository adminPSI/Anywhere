const remainingDailyServicesWidget = (function () {
  var filter = {
    outcomeType: '%',
    location: '%',
    group: '%',
    date: null,
  };
  // DATA
  //-----------------------
  // DOM
  //-----------------------
  var widget;
  var widgetBody;
  var filterPopup;
  var goalsWidgetDate;
  var outcomeDropdown;
  var locationDropdown;
  var groupDropdown;
  var applyFiltersBtn;
  var cancelFilterBtn;

  function populateFilteredList(res) {
    var consumers = {};
    var totalServices = 0;
    var totalConsumers = 0;

    res.forEach(function (consumer) {
      var fullName = consumer.last_name.trim() + ', ' + consumer.first_name;
      if (!consumers[fullName]) consumers[fullName] = 0;
      consumers[fullName]++;
      totalServices++;
    });

    var consumersSorted = {};
    Object.keys(consumers)
      .sort()
      .forEach(function (key) {
        consumersSorted[key] = consumers[key];
      });

    var list = document.getElementById('goalsUL');
    if (!list) return;
    list.innerHTML = '';

    var names = Object.keys(consumersSorted);
    names.forEach(function (name) {
      var li = document.createElement('LI');
      li.innerText = name + ' - ' + consumers[name];
      // li.classList.add('customLink')
      list.appendChild(li);
      // li.addEventListener("click", event => {
      // let consumerid = 34275;
      // setActiveModuleSectionAttribute('outcomes');
      // actioncenter.dataset.activeModule = "outcomes"
      // UTIL.toggleMenuItemHighlight("outcomes")
      // DOM.clearActionCenter();
      // DOM.scrollToTopOfPage();

      // outcomes.dashHandler(consumerid)
      //})
      totalConsumers++;
    });

    var consumerCount = document.getElementById('goalsConsumerCount');
    var serviceCount = document.getElementById('goalsCount');
    consumerCount.innerText = totalConsumers;
    serviceCount.innerText = totalServices;
  }

  function buildFilterPopup() {
    var widgetFilter = widget.querySelector('.widget__filters');
    if (widgetFilter) return;

    filterPopup = dashboard.buildFilterPopup();

    var dateInput = input.build({
      id: 'goalsWidgetDate',
      label: 'Date',
      type: 'date',
      style: 'secondary',
      value: goalsWidgetDate,
    });

    outcomeDropdown = dropdown.build({
      dropdownId: 'goalsWidgetOutcomes',
      label: 'Outcome Type',
      style: 'secondary',
      readonly: false,
    });
    locationDropdown = dropdown.build({
      dropdownId: 'goalsWidgetLocations',
      label: 'Location',
      style: 'secondary',
      readonly: false,
    });
    groupDropdown = dropdown.build({
      dropdownId: 'goalsWidgetGroups',
      label: 'Group',
      style: 'secondary',
      readonly: false,
    });
    applyFiltersBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    cancelFilterBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(applyFiltersBtn);
    btnWrap.appendChild(cancelFilterBtn);

    filterPopup.appendChild(dateInput);
    filterPopup.appendChild(outcomeDropdown);
    filterPopup.appendChild(locationDropdown);
    filterPopup.appendChild(groupDropdown);
    filterPopup.appendChild(btnWrap);
    widget.insertBefore(filterPopup, widgetBody);

    // Set date filter to today
    date = document.getElementById('goalsWidgetDate');
    date.value = UTIL.getTodaysDate();
    goalsWidgetDate = date.value;
    filter.date = date.value;
  }

  function populateOutcomeTypesFilter(res) {
    var dataArr = res.map(function (data) {
      return {
        id: data.Id,
        value: data.Id,
        text: data.Description,
      };
    });

    var defaultOutcome = {
      id: '%',
      value: '%',
      text: 'ALL',
    };
    dataArr.unshift(defaultOutcome);

    if (!$.session.outcomesWidgetOutcomeTypeId)
      $.session.outcomesWidgetOutcomeTypeId = dataArr[0].value;
    if (!$.session.outcomesWidgetOutcomeTypeName)
      $.session.outcomesWidgetOutcomeTypeName = dataArr[0].text;

    dropdown.populate('goalsWidgetOutcomes', dataArr, $.session.outcomesWidgetOutcomeTypeId);
  }
  function populateLocationsFilter(res) {
    var dataArr = res.map(function (data) {
      return {
        value: data.ID,
        text: data.Name,
      };
    });

    var defaultLocation = {
      id: '%',
      value: '%',
      text: 'ALL',
    };
    dataArr.unshift(defaultLocation);

    if (!$.session.outcomeWidgetLocationId) $.session.outcomeWidgetLocationId = dataArr[0].value;
    if (!$.session.outcomeWidgetLocationName) $.session.outcomeWidgetLocationName = dataArr[0].text;

    dropdown.populate('goalsWidgetLocations', dataArr, $.session.outcomeWidgetLocationId);
  }
  function populateGroupsFilter(res) {
    var dataArr = res.map(function (data) {
      return {
        value: data.RetrieveID,
        text: data.GroupName,
      };
    });

    UTIL.findAndSlice(dataArr, 'Caseload', 'text');
    UTIL.findAndSlice(dataArr, 'Needs Attention', 'text');
    UTIL.findAndSlice(dataArr, 'Everyone', 'text');

    var defaultGroup = {
      id: '%',
      value: '%',
      text: 'EVERYONE',
    };
    dataArr.unshift(defaultGroup);

    if (!$.session.outcomesWidgetGroupId) $.session.outcomesWidgetGroupId = dataArr[0].value;
    if (!$.session.outcomesWidgetGroupName) $.session.outcomesWidgetGroupName = dataArr[0].text;

    dropdown.populate('goalsWidgetGroups', dataArr, $.session.outcomesWidgetGroupId);
  }
  function eventSetup() {
    // for filter values
    var oldFilter = {
      outcomeType: null,
      location: null,
      group: null,
      date: null,
    };
    // for session variables
    var oldOutcomesWidgetGoalsDate;
    var oldOutcomesWidgetOutcomeTypeId;
    var oldOutcomesWidgetOutcomeTypeName;
    var oldOutcomeWidgetLocationId;
    var oldOutcomeWidgetLocationName;
    var oldOutcomesWidgetGroupId;
    var oldOutcomesWidgetGroupName;

    date.addEventListener('change', event => {
      var goalsDate = event.target.value;
      oldGoalsDate = goalsWidgetDate;
      goalsWidgetDate = goalsDate;
      filter.date = goalsWidgetDate;

      // cache old values
      oldOutcomesWidgetOutcomeTypeId = $.session.outcomesWidgetOutcomeTypeId;
      oldOutcomesWidgetOutcomeTypeName = $.session.outcomesWidgetOutcomeTypeName;
      oldOutcomeWidgetLocationId = $.session.outcomeWidgetLocationId;
      oldOutcomeWidgetLocationName = $.session.outcomeWidgetLocationName;
      oldOutcomesWidgetGroupId = $.session.outcomesWidgetGroupId;
      oldOutcomesWidgetGroupName = $.session.outcomesWidgetGroupName;

      //When changing the date - locations get reset, so also reset the ID and Name back to all - which is the default value
      OutcomesWidgetOutcomeTypeId = '%';
      OutcomesWidgetOutcomeTypeName = 'ALL';
      OutcomeWidgetLocationId = '%';
      OutcomeWidgetLocationName = 'ALL';
      OutcomesWidgetGroupId = '%';
      //OutcomesWidgetGroupCode = 'ALL';
      OutcomesWidgetGroupName = 'Everyone';

      //absentWidgetAjax.getLocationsForDashboardAbsent(populateAbsentWidgetLocations);
      //absentWidgetAjax.getConsumerGroupsForDashboardAbsent(absentWidgetLocationId, populateAbsentWidgetGroups);
    });

    outcomeDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      oldFilter.outcomeType = filter.outcomeType;
      filter.outcomeType =
        selectedOption.value === '%' ? '%' : UTIL.removeDecimals(selectedOption.value);
      //For remembering filter values
      oldOutcomesWidgetOutcomeTypeId = $.session.outcomesWidgetOutcomeTypeId;
      oldOutcomesWidgetOutcomeTypeName = $.session.outcomesWidgetOutcomeTypeName;
      $.session.outcomesWidgetOutcomeTypeId = selectedOption.value;
      $.session.outcomesWidgetOutcomeTypeName = selectedOption.text;
    });
    locationDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      oldFilter.location = filter.location;
      filter.location =
        selectedOption.value === '%' ? '%' : UTIL.removeDecimals(selectedOption.value);
      remainingDailyServicesWidgetAjax.populateGroupsFilter(selectedOption.value); //
      //remainingDailyServicesWidgetAjax.populateFilteredList('%', filter.location, '%')//MIke
      //For remembering filter values
      oldOutcomeWidgetLocationId = $.session.outcomeWidgetLocationId;
      oldOutcomeWidgetLocationName = $.session.outcomeWidgetLocationName;
      $.session.outcomeWidgetLocationId = selectedOption.value;
      $.session.outcomeWidgetLocationName = selectedOption.text;
    });
    groupDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      oldFilter.group = filter.group;
      filter.group = selectedOption.value === '%' ? '%' : UTIL.removeDecimals(selectedOption.value);
      //For remembering filter values
      oldOutcomesWidgetGroupId = $.session.outcomesWidgetGroupId;
      oldOutcomesWidgetGroupName = $.session.outcomesWidgetGroupName;
      $.session.outcomesWidgetGroupId = selectedOption.value;
      $.session.outcomesWidgetGroupName = selectedOption.text;
    });
    applyFiltersBtn.addEventListener('click', () => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);
      remainingDailyServicesWidgetAjax.populateFilteredList(
        filter.outcomeType,
        filter.location,
        filter.group,
        filter.date, // JMM  goalsWidgetDate
        function (list) {
          populateFilteredList(list);
          displayFilteredBy();
        },
      );
    });
    cancelFilterBtn.addEventListener('click', () => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);
      // reset filter values
      filter.date = oldFilter.date;
      filter.outcomeType = oldFilter.outcomeType;
      filter.location = oldFilter.location;
      filter.group = oldFilter.group;
      // reset session variables
      goalsWidgetDate = oldGoalsDate;
      $.session.outcomesWidgetgoalsDate = oldOutcomesWidgetGoalsDate;
      $.session.outcomesWidgetOutcomeTypeId = oldOutcomesWidgetOutcomeTypeId;
      $.session.outcomesWidgetOutcomeTypeName = oldOutcomesWidgetOutcomeTypeName;
      $.session.outcomeWidgetLocationId = oldOutcomeWidgetLocationId;
      $.session.outcomeWidgetLocationName = oldOutcomeWidgetLocationName;
      $.session.outcomesWidgetGroupId = oldOutcomesWidgetGroupId;
      $.session.outcomesWidgetGroupName = oldOutcomesWidgetGroupName;
    });
  }
  function displayFilteredBy() {
    var filteredBy = widget.querySelector('.widgetFilteredBy');
    var widgetBodyNav = widget.querySelector('.widget__body-nav');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
      widgetBody.insertBefore(filteredBy, widgetBodyNav);
    }

    var splitDate = goalsWidgetDate.split('-');
    var filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(
      splitDate[2],
    )}/${splitDate[0].slice(2, 4)}`;

    $.session.outcomesWidgetgoalsDate = goalsWidgetDate;
    filter.date = goalsWidgetDate;

    filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Date:</span> ${filteredDate}</p>
          <p><span>Outcome:</span> ${$.session.outcomesWidgetOutcomeTypeName}</p>
          <p><span>Location:</span> ${$.session.outcomeWidgetLocationName}</p>
          <p><span>Group:</span> ${$.session.outcomesWidgetGroupName}</p>
        </div>`;
  }

  function init() {
    widget = document.getElementById('dashgoalswidget');
    widgetBody = widget.querySelector('.widget__body');
    // append filter button
    dashboard.appendFilterButton('dashgoalswidget', 'goalsFilterBtn');

    if ($.session.outcomesWidgetOutcomeTypeId)
      filter.outcomeType = $.session.outcomesWidgetOutcomeTypeId;
    if ($.session.outcomeWidgetLocationId) filter.location = $.session.outcomeWidgetLocationId;
    if ($.session.outcomesWidgetGroupId) filter.group = $.session.outcomesWidgetGroupId;

    buildFilterPopup();
    eventSetup();

    remainingDailyServicesWidgetAjax.populateOutcomeTypesFilter(function (outcomes) {
      remainingDailyServicesWidgetAjax.populateLocationsFilter(function (locations) {
        remainingDailyServicesWidgetAjax.populateGroupsFilter(filter.location, function (groups) {
          remainingDailyServicesWidgetAjax.populateFilteredList(
            filter.outcomeType,
            filter.location,
            filter.group,
            filter.date,
            function (list) {
              populateOutcomeTypesFilter(outcomes);
              populateLocationsFilter(locations);
              populateGroupsFilter(groups);
              populateFilteredList(list);
              displayFilteredBy();
            },
          );
        });
      });
    });
  }

  return {
    filter: filter,
    populateOutcomeTypesFilter: populateOutcomeTypesFilter,
    populateLocationsFilter: populateLocationsFilter,
    populateGroupsFilter: populateGroupsFilter,
    populateFilteredList: populateFilteredList,
    init: init,
  };
})();

// $.session.outcomesWidgetOutcomeTypeName -All
// $.session.outcomesWidgetLocationName -All
// $.session.outcomesWidgetGroupName -Everyone
