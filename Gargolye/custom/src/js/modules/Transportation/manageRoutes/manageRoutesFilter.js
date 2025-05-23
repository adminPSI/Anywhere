const TRANS_manageRoutesFilter = (function () {
    // Inputs
    let startDateInput, endDateInput, driverDropdown, locationDropdown, routeStatusDropdown, vehicleDropdown;
    let filterOpts;
    let IsShow;

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
        vehicleDropdown = dropdown.build({
            dropdownId: 'vehicleDropdown',
            label: 'Vehicle',
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

        if (IsShow == 'ALL' || IsShow == 'filteredDateStartBtn')
            popup.appendChild(dateWrap);
        if (IsShow == 'ALL' || IsShow == 'selectedDriverBtn')
            popup.appendChild(driverDropdown);
        if (IsShow == 'ALL' || IsShow == 'selectedLocationBtn')
            popup.appendChild(locationDropdown);
        if (IsShow == 'ALL' || IsShow == 'selectedRouteStatusBtn')
            popup.appendChild(routeStatusDropdown);
        if (IsShow == 'ALL' || IsShow == 'selectedVehicleBtn')
            popup.appendChild(vehicleDropdown);
        popup.appendChild(applyButton);
        POPUP.show(popup);

        populateDropdowns();
        eventListeners();
    }

    function populateDropdowns() {
        const driverDropdownData = [];
        const locationDropdownData = [];
        const vehicleDropdownData = [];
        const drivers = TRANS_mainLanding.getAllDrivers();
        const locations = TRANS_mainLanding.getLocations();
        const vehicles = TRANS_mainLanding.getVehicles();
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
        vehicles.forEach((val, key, map) => {
            vehicleDropdownData.push({
                value: key,
                text: `${val.vehicleNumber}`,
            });
        });
        driverDropdownData.unshift({ value: '%', text: 'All' });
        locationDropdownData.unshift({ value: '%', text: 'All' });
        vehicleDropdownData.unshift({ value: '%', text: 'All' });
        dropdown.populate(driverDropdown, driverDropdownData, filterOpts.personId);
        dropdown.populate(locationDropdown, locationDropdownData, filterOpts.locationId);
        dropdown.populate(vehicleDropdown, vehicleDropdownData, filterOpts.vehicleId);
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
        vehicleDropdown.addEventListener('change', event => {
            filterOpts.vehicleId = event.target.value;
        });
        routeStatusDropdown.addEventListener('change', event => {
            filterOpts.routeStatus = event.target.value;
        });
    }

    function isValidDate(d) {
        d = new Date(d);
        return d instanceof Date && !isNaN(d);
    }

    function init(opts, IsFilterShow) {
        filterOpts = opts;
        IsShow = IsFilterShow; 
        createFilterElements();
        buildFilterPopup();
    }

    return {
        init,
    };
})();
