const adminSingleEntryWidget = (function () {
  var statuses = {
    A: 'Needs Approval',
    P: 'Pending',
    R: 'Rejected',
  };
  // DATA
  //-----------------------
  var cachedResults;
  var cachedResults_locations;
  var selectedConsumerId;
  var selectedConsumerName;
  var selectedLocationId;
  var selectedLocationDescription;
  var entriesObj = {};
  var consumerNames = {};
  // DOM
  //-----------------------
  var widget;
  var widgetBody;
  var filterPopup;
  var consumerDropdown;
  var locationDropdown;
  var applyFiltersBtn;
  var cancelFilterBtn;

  // Filtering
  function buildFilterPopup() {
    widget = document.getElementById('admindashsingleentrywidget');
    if (!widget) return;
    var widgetFilter = widget.querySelector('.widget__filters');
    if (widgetFilter) return;

    widgetBody = widget.querySelector('.widget__body');

    filterPopup = dashboard.buildFilterPopup();

    consumerDropdown = dropdown.build({
      dropdownId: 'adminWidgetEmployees',
      label: 'Employees',
      style: 'secondary',
      readonly: false,
    });
    locationDropdown = dropdown.build({
      dropdownId: 'adminWidgetLocations',
      label: 'Locations',
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

    filterPopup.appendChild(consumerDropdown);
    filterPopup.appendChild(locationDropdown);
    filterPopup.appendChild(btnWrap);
    widget.insertBefore(filterPopup, widgetBody);
  }
  function populateConsumerDropdown() {
    // Consumer drop down should not include Logged in User
    for (var key in consumerNames) {
      if (consumerNames[key].peopleId === $.session.PeopleId) {
        delete consumerNames[key];
      }
    }

    let data = Object.keys(consumerNames).map(c => {
      return {
        value: consumerNames[c].peopleId,
        text: consumerNames[c].name,
      };
    });
    //order Consumer DropDown by name
    data.sort((a, b) => (a.text > b.text ? 1 : -1));

    data.unshift({ value: '%', text: 'ALL' });

    dropdown.populate('adminWidgetEmployees', data, selectedConsumerId);
  }

  function populateLocationsDropDown(locationNames) {
    if (locationNames.length > 0) {
      let data = Object.keys(locationNames).map(l => {
        return {
          value: locationNames[l].locationId,
          text: locationNames[l].description,
        };
      });
      data.unshift({ value: '%', text: 'ALL' });

      dropdown.populate('adminWidgetLocations', data, selectedLocationId);
    }
  }

  function eventSetup() {
    var oldSelectedConsumerId;
    var oldSelectedConsumerName;
    var oldSelectedLocationId;
    var oldSelectedLocationDescription;

    consumerDropdown.addEventListener('change', event => {
      var selectedConsumerOption = event.target.options[event.target.selectedIndex];

      oldSelectedConsumerId = selectedConsumerId;
      oldSelectedConsumerName = selectedConsumerName;

      selectedConsumerId = selectedConsumerOption.value;
      selectedConsumerName = selectedConsumerOption.innerHTML;
    });
    locationDropdown.addEventListener('change', event => {
      var selectedLocationOption = event.target.options[event.target.selectedIndex];

      oldSelectedLocationId = selectedLocationId;
      oldSelectedLocationDescription = selectedLocationDescription;

      selectedLocationId = selectedLocationOption.value;
      selectedLocationDescription = selectedLocationOption.innerHTML;
    });
    applyFiltersBtn.addEventListener('click', event => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);
      groupCountInfo(cachedResults, selectedConsumerId, selectedLocationId);
      populateCountInfo();
    });
    cancelFilterBtn.addEventListener('click', event => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);

      selectedConsumerId = oldSelectedConsumerId;
      selectedConsumerName = oldSelectedConsumerName;
      selectedLocationId = oldSelectedLocationId;
      selectedLocationDescription = oldSelectedLocationDescription;
    });
  }
  function displayFilteredBy() {
    var filteredBy = widget.querySelector('.widgetFilteredBy');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
      widgetBody.appendChild(filteredBy);
    }

    filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Employee:</span> ${selectedConsumerName}</p>
      <p><span>Location:</span> ${selectedLocationDescription}</p></div> `;
  }

  function populateCountInfo() {
    displayFilteredBy();

    var pendingSection = widget.querySelector('.pending-section');
    var approvalSection = widget.querySelector('.needsapproval-section');
    var rejectedSection = widget.querySelector('.rejected-section');
    pendingSection.innerHTML = '';
    approvalSection.innerHTML = '';
    rejectedSection.innerHTML = '';

    var entryGroups = Object.keys(entriesObj);
    entryGroups.forEach(group => {
      var dateRanges = Object.keys(entriesObj[group]);
      dateRanges.sort((a, b) => {
        var dateA = a.split('{*}')[0];
        var dateB = b.split('{*}')[0];
        dateA = new Date(dateA);
        dateB = new Date(dateB);

        if (dateA > dateB) {
          return -1;
        } else if (dateA < dateB) {
          return 1;
        } else {
          return 0;
        }
      });
      dateRanges.forEach(range => {
        var text = range.split('{*}').join(' - ');
        var count = entriesObj[group][range].count;
        var p = document.createElement('p');
        p.setAttribute('start-date', range.split('{*}')[0]);
        p.setAttribute('end-date', range.split('{*}')[1]);
        p.innerHTML = `${text} - <span>${count}</span>`;
        p.classList.add('customLink');
        if (group === 'P') {
          pendingSection.appendChild(p);
          addEvent(p, 'P');
        } else if (group === 'A') {
          approvalSection.appendChild(p);
          addEvent(p, 'A');
        } else if (group === 'R') {
          rejectedSection.appendChild(p);
          addEvent(p, 'R');
        }
      });
    });
  }

  function addEvent(element, status) {
    element.addEventListener('click', event => {
      let startDate = event.target.getAttribute('start-date');
      let endDate = event.target.getAttribute('end-date');
      setActiveModuleSectionAttribute('timeEntry-approval');
      actioncenter.dataset.activeModule = 'timeEntry';
      DOM.clearActionCenter();
      DOM.scrollToTopOfPage();
      UTIL.toggleMenuItemHighlight('timeEntry');
      timeEntry.getInitialData(() => {
        timeApproval.dashHandler(startDate, endDate, status);
      });
    });
  }
  function buildWidgetTabs() {
    var widgetTabs = widgetBody.querySelector('.tabs');
    if (!widgetTabs) {
      var tabOptions = {
        sections: ['Needs Approval', 'Pending', 'Rejected'],
      };

      widgetTabs = tabs.build(tabOptions);

      widgetBody.appendChild(widgetTabs);
    }
  }
  function groupCountInfo(data, selectedConsumerId, selectedLocationId) {
    entriesObj = {};
    data.forEach(d => {
      if (statuses[d.Anywhere_Status]) {
        if (
          selectedConsumerId &&
          (selectedConsumerId === d.People_ID || selectedConsumerId === '%')
        ) {
          if (
            selectedLocationId &&
            (selectedLocationId === d.Location_ID || selectedLocationId === '%')
          ) {
            var peopleId = d.People_ID;
            var locationId = d.Location_ID;
            var name = `${d.last_name}` + ', ' + `${d.first_name}`;
            var status = d.Anywhere_Status;
            var startDate = d.startdate.split(' ')[0];
            var endDate = d.enddate.split(' ')[0];
            var dateString = `${startDate}{*}${endDate}`;

            if (!entriesObj[status]) {
              entriesObj[status] = {};
            }
            if (!entriesObj[status][dateString]) {
              entriesObj[status][dateString] = { count: 0 };
            }
            entriesObj[status][dateString].count++;

            if (!consumerNames[peopleId]) {
              consumerNames[peopleId] = { peopleId, name };
            }
          }
        }
      }
    });
  }

  function init() {
    if (!selectedConsumerName) selectedConsumerName = 'ALL';
    if (!selectedConsumerId) selectedConsumerId = '%';
    if (!selectedLocationDescription) selectedLocationDescription = 'ALL';
    if (!selectedLocationId) selectedLocationId = '%';

    widget = document.getElementById('admindashsingleentrywidget');
    widgetBody = widget.querySelector('.widget__body');
    widgetBody.innerHTML = '';

    dashboard.appendFilterButton('admindashsingleentrywidget', 'adminSeFilterBtn');

    // filtering
    displayFilteredBy();
    buildFilterPopup();
    eventSetup();

    adminSingleEntryWidgetAjax.getSingleEntryAdminLocations(function (res, error) {
      cachedResults_locations = res;

      adminSingleEntryWidgetAjax.getSingleEntryAdminApprovalNumbers(function (results, error) {
        cachedResults = results;
        groupCountInfo(results, selectedConsumerId, selectedLocationId);
        populateConsumerDropdown();
        populateLocationsDropDown(cachedResults_locations);
        // info/tabs
        buildWidgetTabs();
        populateCountInfo();
      });
    });
  }

  return {
    init,
  };
})();
