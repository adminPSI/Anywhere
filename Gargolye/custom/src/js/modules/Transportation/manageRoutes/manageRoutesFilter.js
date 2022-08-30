const TRANS_manageRoutesFilter = (function () {
  // Inputs
  let startDateInput, endDateInput, driverDropdown, locationDropdown, routeStatusDropdown;
  let filterOpts;

  function createFilterElements() {
    startDateInput = input.build({
      id: 'myRouteDateStart',
      label: 'From',
      type: 'date',
      style: 'secondary',
      value: filterOpts.serviceDateStart,
    });
    endDateInput = input.build({
      id: 'myRouteDateStop',
      label: 'To',
      type: 'date',
      style: 'secondary',
      value: filterOpts.serviceDateStop,
    });
    driverDropdown = dropdown.build({
      dropdownId: 'driverDropdown',
      label: 'Driver',
      style: 'secondary',
    });
    locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Location',
      style: 'secondary',
    });
    routeStatusDropdown = dropdown.build({
      dropdownId: 'routeStatusDropdown',
      label: 'Route Status',
      style: 'secondary',
    });
  }

  function buildFilterPopup(params) {
    const dateWrap = document.createElement('div');
    dateWrap.classList.add('dateWrap', 'btnWrap');

    const popup = POPUP.build({
      header: 'Filter',
      classNames: 'manageRoutesFilterPopup',
    });

    const applyButton = button.build({
      text: 'APPLY',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: () => {
        POPUP.hide(popup);
        TRANS_manageRoutes.filterApply(filterOpts);
      },
    });
    applyButton.style.width = '100%';

    dateWrap.appendChild(startDateInput);
    dateWrap.appendChild(endDateInput);

    popup.appendChild(dateWrap);
    popup.appendChild(driverDropdown);
    popup.appendChild(locationDropdown);
    popup.appendChild(routeStatusDropdown);
    popup.appendChild(applyButton);
    POPUP.show(popup);

    populateDropdowns();
    eventListeners();
  }

  function populateDropdowns() {
    const driverDropdownData = [];
    const locationDropdownData = [];
    const drivers = TRANS_mainLanding.getAllDrivers();
    const locations = TRANS_mainLanding.getLocations();
    const routeStatusDropdownData = [
      {
        value: '%',
        text: 'All',
      },
      {
        value: 'C',
        text: 'Completed',
      },
      {
        value: 'IP',
        text: 'In Progress',
      },
      {
        value: 'NS',
        text: 'Not Started',
      },
    ];

    drivers.forEach((val, key, map) => {
      driverDropdownData.push({
        value: key,
        text: `${val.Last_Name}, ${val.First_Name}`,
      });
    });
    locations.forEach((val, key, map) => {
      locationDropdownData.push({
        value: key,
        text: `${val.Name}`,
      });
    });

    driverDropdownData.unshift({ value: '%', text: 'All' });
    locationDropdownData.unshift({ value: '%', text: 'All' });
    dropdown.populate(driverDropdown, driverDropdownData, filterOpts.personId);
    dropdown.populate(locationDropdown, locationDropdownData, filterOpts.locationId);
    dropdown.populate(
      routeStatusDropdown,
      routeStatusDropdownData,
      filterOpts.routeStatus,
    );
  }

  function eventListeners() {
    startDateInput.addEventListener('change', event => {
      if (isValidDate(event.target.value)) {
        filterOpts.serviceDateStart = event.target.value;
      } else {
        event.target.value = filterOpts.serviceDateStart;
      }
    });
    endDateInput.addEventListener('change', event => {
      if (isValidDate(event.target.value)) {
        filterOpts.serviceDateStop = event.target.value;
      } else {
        event.target.value = filterOpts.serviceDateStop;
      }
    });
    driverDropdown.addEventListener('change', event => {
      filterOpts.personId = event.target.value;
    });
    locationDropdown.addEventListener('change', event => {
      filterOpts.locationId = event.target.value;
    });
    routeStatusDropdown.addEventListener('change', event => {
      filterOpts.routeStatus = event.target.value;
    });
  }

  function isValidDate(d) {
    d = new Date(d);
    return d instanceof Date && !isNaN(d);
  }

  function init(opts) {
    filterOpts = opts;
    createFilterElements();
    buildFilterPopup();
  }

  return {
    init,
  };
})();
