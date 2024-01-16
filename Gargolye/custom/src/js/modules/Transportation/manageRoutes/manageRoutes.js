const TRANS_manageRoutes = (function () {
    let routesTable;
    let selectedRoutes, filteredRoutes;
    let filterOpts;
    let tripsStatus;
    let multiEditEnabled, multiSelRoutes, multiSelectBtn;
    let updateDriverBtn, updateVehicleBtn;

    let filterBtn;
    let filteredDateStart;
    let filteredDateStop;
    let selectedDriver;
    let selectedLocation;
    let selectedRouteStatus;
    let totalRouteCount;
    let selectedVehicle;

    let btnWrap;
    let filteredDateStartBtnWrap;
    let selectedDriverBtnWrap;
    let selectedLocationBtnWrap;
    let selectedRouteStatusBtnWrap;
    let selectedVehicleBtnWrap;
    let totalRouteCountBtnWrap;

    function buildPage(resetFilter) {

        const backButton = button.build({
            id: 'myRouteBackButton',
            text: 'Back',
            style: 'secondary',
            type: 'text',
            icon: 'arrowBack',
            callback: () => {
                setActiveModuleSectionAttribute(null);
                TRANS_mainLanding.init();
            },
        });

        if (resetFilter) {
            filterOpts = {
                token: $.session.Token,
                serviceDateStart: UTIL.getTodaysDate(),
                serviceDateStop: UTIL.getTodaysDate(),
                personId: '%',
                locationId: '%',
                routeStatus: '%',
            };

            filteredDateStart = UTIL.abbreviateDateYear(UTIL.formatDateFromIso(UTIL.getTodaysDate(), '/'));
            filteredDateStop = UTIL.abbreviateDateYear(UTIL.formatDateFromIso(UTIL.getTodaysDate(), '/'));
            selectedDriver = '%';
            selectedLocation = '%';
            selectedRouteStatus = '%';
            totalRouteCount = '0';
            selectedVehicle = '%';
        }

        multiSelectBtn = button.build({
            id: 'multiSelect',
            text: 'Multi select',
            icon: 'multiSelect',
            style: 'secondary',
            type: 'contained',
            classNames: 'multiSelectBtn',
            callback: function () {
                enableMultiEditRows();
                filterBtn.classList.toggle('disabled');
                backButton.classList.toggle('disabled');
            },
        });

        routesTable = table.build({
            tableId: 'manageRouteTable',
            headline: 'Routes',
            columnHeadings: [
                'Date',
                'Route',
                'Driver',
                'Vehicle',
                'Location',
                'Start Odometer',
                'End Odometer',
                'Start Time',
                'Stop Time',
            ],
        });
        routesTable.setAttribute('data-multiselect-enabled', false);
        // * FILTERED BY DISPLAY
        const filteredByDisplay = buildFilteredBy();

        DOM.ACTIONCENTER.appendChild(backButton);
        DOM.ACTIONCENTER.appendChild(filteredByDisplay);
        DOM.ACTIONCENTER.appendChild(routesTable);

        getData();
    }

    function populateTable() {
        const tableData = [];
        multiSelRoutes = new Map();
        filteredRoutes.forEach((val, key, map) => {
            const {
                batchNumber,
                dateOfService,
                tripId,
                tripName,
                vehicleInfoId,
                odoStart,
                odoStop,
                startTime,
                endTime,
                locationName,
                driverId,
                tripInspection,
                tripsCompletedId,
            } = val;

            const vehicleNumber = TRANS_mainLanding.vehicleLookup(vehicleInfoId).vehicleNumber;
            const driver = TRANS_mainLanding.driverLookup(driverId);
            const addHocRoute = tripId === '' ? true : false;
            const batched = batchNumber === '' ? false : true;

            const driverDisp = `${driver.Last_Name}, ${driver.First_Name}`;
            const readDate = UTIL.abbreviateDateYear(dateOfService.split(' ')[0]);
            const readStartTime = UTIL.formatTimeString(startTime);
            const readEndTime = UTIL.formatTimeString(endTime);
            const readOdoStart = odoStart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const readOdoStop = odoStop.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const status = tripsStatus.get(tripsCompletedId);

            const rowValues = [
                readDate,
                tripName,
                driverDisp,
                vehicleNumber,
                locationName,
                readOdoStart,
                readOdoStop,
                readStartTime,
                readEndTime,
            ];
            tableData.push({
                values: rowValues,
                id: key,
                attributes: [{ key: 'data-route-status', value: status }],
                onClick: evt => {
                    if (multiEditEnabled) {
                        if (batched) {
                            console.info(`route ${key} is batched`);
                            // evt.target.classList.add('batchedWarn');
                            const batchWarnEl = document.createElement('span');
                            batchWarnEl.innerText = 'ROUTE IS BATCHED';
                            batchWarnEl.classList.add('batchedWarn');
                            evt.target.appendChild(batchWarnEl);
                            setTimeout(() => {
                                // evt.target.classList.remove('batchedWarn');
                                batchWarnEl.remove();
                            }, 1000);
                        } else {
                            evt.target.classList.toggle('selected');
                            multiSelRoutes.has(key) ? multiSelRoutes.delete(key) : multiSelRoutes.set(key, val);
                            if (multiSelRoutes.size > 0) {
                                updateDriverBtn.classList.remove('disabled');
                                updateVehicleBtn.classList.remove('disabled');
                            } else {
                                updateDriverBtn.classList.add('disabled');
                                updateVehicleBtn.classList.add('disabled');
                            }
                        }
                    } else {
                        TRANS_manageEditRoute.init({
                            addHocRoute: addHocRoute,
                            routeId: key,
                            date: UTIL.formatDateToIso(dateOfService.split(' ')[0]),
                            routeName: tripName,
                            locationName: locationName,
                            vehicleInspectionId: tripInspection,
                            batched: batched,
                        });
                    }
                },
            });
        });
        table.populate(routesTable, tableData);
    }

    function buildFilteredBy() {
        let filteredBy = document.querySelector('.filteredByData');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet()
            filteredBy.appendChild(btnWrap);
        }

        const driverLookup = TRANS_mainLanding.driverLookup(filterOpts.personId);
        const locationLookup = TRANS_mainLanding.locationLookup(filterOpts.locationId);
        const vehicleLookup = TRANS_mainLanding.vehicleFilteredLookup(filterOpts.vehicleId);

        filteredDateStart = UTIL.abbreviateDateYear(
            UTIL.formatDateFromIso(filterOpts.serviceDateStart, '/'),
        );
        filteredDateStop = UTIL.abbreviateDateYear(
            UTIL.formatDateFromIso(filterOpts.serviceDateStop, '/'),
        );
        selectedDriver = driverLookup
            ? `${driverLookup.Last_Name}, ${driverLookup.First_Name}`
            : 'All';
        selectedLocation = locationLookup ? locationLookup.Name : 'All';
        selectedVehicle = vehicleLookup ? vehicleLookup.vehicleNumber : 'All';
        totalRouteCount = filteredRoutes ? filteredRoutes.size : '0';


        switch (filterOpts.routeStatus) {
            case 'NS':
                selectedRouteStatus = 'Not Started';
                break;
            case 'IP':
                selectedRouteStatus = 'In Progress';
                break;
            case 'C':
                selectedRouteStatus = 'Completed';
                break;
            default:
                selectedRouteStatus = 'All';
                break;
        }

        if (document.getElementById('filteredDateStartBtn') != null)
            document.getElementById('filteredDateStartBtn').innerHTML = 'Date: ' + filteredDateStart + ' - ' + filteredDateStop;


        if (selectedDriver === '%' || selectedDriver === 'All') {
            btnWrap.appendChild(selectedDriverBtnWrap);
            btnWrap.removeChild(selectedDriverBtnWrap);
        } else {
            btnWrap.appendChild(selectedDriverBtnWrap);
            document.getElementById('selectedDriverBtn').innerHTML = 'Driver: ' + selectedDriver;
        }

        if (selectedLocation === '%' || selectedLocation === 'All') {
            btnWrap.appendChild(selectedLocationBtnWrap);
            btnWrap.removeChild(selectedLocationBtnWrap);
        } else {
            btnWrap.appendChild(selectedLocationBtnWrap);
            document.getElementById('selectedLocationBtn').innerHTML = 'Location: ' + selectedLocation;
        }

        if (selectedRouteStatus === '%' || selectedRouteStatus === 'All') {
            btnWrap.appendChild(selectedRouteStatusBtnWrap);
            btnWrap.removeChild(selectedRouteStatusBtnWrap);
        } else {
            btnWrap.appendChild(selectedRouteStatusBtnWrap);
            document.getElementById('selectedRouteStatusBtn').innerHTML = 'Route Status: ' + selectedRouteStatus;
        }

        if (selectedVehicle === '%' || selectedVehicle === 'All') {
            btnWrap.appendChild(selectedVehicleBtnWrap);
            btnWrap.removeChild(selectedVehicleBtnWrap);
        } else {
            btnWrap.appendChild(selectedVehicleBtnWrap);
            document.getElementById('selectedVehicleBtn').innerHTML = 'Vehicle: ' + selectedVehicle;
        }

        if (document.getElementById('totalRouteCountBtn') != null)
            document.getElementById('totalRouteCountBtn').innerHTML = 'Total Route Count: ' + totalRouteCount;

        return filteredBy;
    }

    function filterButtonSet() {
        filterBtn = button.build({
            text: 'Filter',
            style: 'secondary',
            type: 'contained',
            icon: 'filter',
            classNames: 'filterBtnNew',
            callback: () => {
                TRANS_manageRoutesFilter.init(filterOpts, 'ALL');
            },
        });

        filteredDateStartBtn = button.build({
            id: 'filteredDateStartBtn',
            text: 'Date: ' + filteredDateStart + ' - ' + filteredDateStop,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_manageRoutesFilter.init(filterOpts, 'filteredDateStartBtn') },
        });

        selectedDriverBtn = button.build({
            id: 'selectedDriverBtn',
            text: 'Driver: ' + selectedDriver,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_manageRoutesFilter.init(filterOpts, 'selectedDriverBtn') },
        });
        selectedDriverCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('selectedDriverBtn') },
        });

        selectedLocationBtn = button.build({
            id: 'selectedLocationBtn',
            text: 'Location: ' + selectedLocation,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_manageRoutesFilter.init(filterOpts, 'selectedLocationBtn') },
        });
        selectedLocationCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('selectedLocationBtn') },
        });

        selectedRouteStatusBtn = button.build({
            id: 'selectedRouteStatusBtn',
            text: 'Route Status: ' + selectedRouteStatus,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_manageRoutesFilter.init(filterOpts, 'selectedRouteStatusBtn') },
        });
        selectedRouteStatusCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('selectedRouteStatusBtn') },
        });

        totalRouteCountBtn = button.build({
            id: 'totalRouteCountBtn',
            text: 'Total Route Count: ' + totalRouteCount,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
        });

        selectedVehicleBtn = button.build({
            id: 'selectedVehicleBtn',
            text: 'Vehicle: ' + selectedVehicle,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_manageRoutesFilter.init(filterOpts, 'selectedVehicleBtn') },
        });
        selectedVehicleCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('selectedVehicleBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        filteredDateStartBtnWrap = document.createElement('div');
        filteredDateStartBtnWrap.classList.add('filterSelectionBtnWrap');
        filteredDateStartBtnWrap.appendChild(filteredDateStartBtn);
        btnWrap.appendChild(filteredDateStartBtnWrap);

        selectedDriverBtnWrap = document.createElement('div');
        selectedDriverBtnWrap.classList.add('filterSelectionBtnWrap');
        selectedDriverBtnWrap.appendChild(selectedDriverBtn);
        selectedDriverBtnWrap.appendChild(selectedDriverCloseBtn);
        btnWrap.appendChild(selectedDriverBtnWrap);

        selectedLocationBtnWrap = document.createElement('div');
        selectedLocationBtnWrap.classList.add('filterSelectionBtnWrap');
        selectedLocationBtnWrap.appendChild(selectedLocationBtn);
        selectedLocationBtnWrap.appendChild(selectedLocationCloseBtn);
        btnWrap.appendChild(selectedLocationBtnWrap);

        selectedRouteStatusBtnWrap = document.createElement('div');
        selectedRouteStatusBtnWrap.classList.add('filterSelectionBtnWrap');
        selectedRouteStatusBtnWrap.appendChild(selectedRouteStatusBtn);
        selectedRouteStatusBtnWrap.appendChild(selectedRouteStatusCloseBtn);
        btnWrap.appendChild(selectedRouteStatusBtnWrap);

        totalRouteCountBtnWrap = document.createElement('div');
        totalRouteCountBtnWrap.classList.add('filterSelectionBtnWrap');
        totalRouteCountBtnWrap.appendChild(totalRouteCountBtn);
        btnWrap.appendChild(totalRouteCountBtnWrap);

        selectedVehicleBtnWrap = document.createElement('div');
        selectedVehicleBtnWrap.classList.add('filterSelectionBtnWrap');
        selectedVehicleBtnWrap.appendChild(selectedVehicleBtn);
        selectedVehicleBtnWrap.appendChild(selectedVehicleCloseBtn);
        btnWrap.appendChild(selectedVehicleBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'selectedLocationBtn') {
            filterOpts.locationId = '%';
        }
        if (closeFilter == 'selectedRouteStatusBtn') {
            filterOpts.routeStatus = '%';
        }
        if (closeFilter == 'selectedDriverBtn') {
            filterOpts.personId = '%';
        }
        if (closeFilter == 'selectedVehicleBtn') {
            filterOpts.vehicleId = '%';
        }

        getData();
    }

    async function getData() {
        table.clear(routesTable);
        PROGRESS__ANYWHERE.init();
        PROGRESS__ANYWHERE.SPINNER.show(DOM.ACTIONCENTER, 'Gathering Routes...');
        const locationPermissions = TRANS_mainLanding.getLocations();
        const tmpRoutes = (await TRANS_manageRoutesAjax.getTrips(filterOpts)).getTripsResult;
        const routeMap = new Map();
        tmpRoutes.forEach(route => {
            if (locationPermissions.has(route.locationId)) {
                routeMap.set(route.tripsCompletedId, route);
            } else {
                console.info(
                    `skipping route ${route.tripsCompletedId}. User does not have permission to the route's location.`,
                );
            }
        });
        filteredRoutes = routeMap;
        PROGRESS__ANYWHERE.SPINNER.hide(DOM.ACTIONCENTER);
        determineTripStatus();
        filterTripStatus();
        buildFilteredBy();
        populateTable();
    }

    function filterApply(opts) {
        filterOpts = opts;
        getData();
    }

    function filterTripStatus() {
        if (filterOpts.routeStatus === '%') return;
        tripsStatus;
        let tripsWithFilteredStatus = [...tripsStatus.entries()]
            .filter(({ 1: v }) => v === filterOpts.routeStatus)
            .map(([k]) => k);
        const tempFilteredRoutes = new Map();
        tripsWithFilteredStatus.forEach(tripId => {
            tempFilteredRoutes.set(tripId, filteredRoutes.get(tripId));
        });
        filteredRoutes = tempFilteredRoutes;
    }

    function enableMultiEditRows() {
        setupActionNav();
        multiEditEnabled = !multiEditEnabled;
        multiSelectBtn.classList.toggle('enabled');

        if (multiEditEnabled) {
            ACTION_NAV.show();
            routesTable.setAttribute('data-multiselect-enabled', true);
        } else {
            // clear out selected rows?
            ACTION_NAV.hide();
            multiSelRoutes.clear();
            routesTable.setAttribute('data-multiselect-enabled', false);
        }

        const highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));
    }

    function setupActionNav() {
        updateDriverBtn = button.build({
            text: 'Update Driver',
            style: 'secondary',
            type: 'contained',
            classNames: 'disabled',
            callback: () => {
                TRANS_updatePopup.init({ updateType: 'driver', selectedRoutes: multiSelRoutes });
            },
        });
        updateVehicleBtn = button.build({
            text: 'Update Vehicle',
            style: 'secondary',
            type: 'contained',
            classNames: 'disabled',
            callback: () => {
                TRANS_updatePopup.init({ updateType: 'vehicle', selectedRoutes: multiSelRoutes });
            },
        });

        ACTION_NAV.clear();
        ACTION_NAV.populate([updateDriverBtn, updateVehicleBtn]);
        ACTION_NAV.hide();
    }

    function massUpdateCallback() {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        multiSelectBtn.dispatchEvent(event);
        getData();
    }

    function determineTripStatus() {
        const tempStatusMap = new Map();
        filteredRoutes.forEach((val, key, map) => {
            const {
                endTime,
                odoStart,
                odoStop,
                startTime,
                tripType,
                totalConsumersOnRecord,
                consumerNoStatus,
            } = val;
            let status;

            // First break down into Miles or Trip. Miles and Trip have different definitions of being complete.
            switch (tripType) {
                case 'M':
                    if (
                        endTime === '' &&
                        startTime === '' &&
                        odoStart === '' &&
                        odoStop === '' &&
                        consumerNoStatus === totalConsumersOnRecord
                    ) {
                        // Nothing has been completed, so the trip has not started = NS
                        status = 'NS';
                    } else if (
                        endTime !== '' &&
                        startTime !== '' &&
                        odoStart !== '' &&
                        odoStop !== '' &&
                        consumerNoStatus == 0
                    ) {
                        // Everything has been completed, so the trip is complete = C
                        status = 'C';
                    } else {
                        // If something is completed... but not everything, its still in progress = IP
                        status = 'IP';
                    }
                    break;
                case 'T':
                    if (endTime === '' && startTime === '' && consumerNoStatus === totalConsumersOnRecord) {
                        // Nothing has been completed, so the trip has not started = NS
                        status = 'NS';
                    } else if (endTime !== '' && startTime !== '' && consumerNoStatus == 0) {
                        // Everything has been completed, so the trip is complete = C
                        status = 'C';
                    } else {
                        // If something is completed... but not everything, its still in progress = IP
                        status = 'IP';
                    }
                    break;

                default:
                    console.error(
                        'There was a problem determining the completion status of the trip. No Miles/Trip Billing_Type found!',
                    );
                    status = 'NS';
                    break;
            }

            tempStatusMap.set(key, status);
        });
        tripsStatus = tempStatusMap;
    }
    /** Manage Routes Init Function
     * @param {boolean} [resetFilter=True] False will not reset filter values
     */
    function init(resetFilter = true) {
        multiEditEnabled = false;
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        setActiveModuleSectionAttribute('manageroute');
        buildPage(resetFilter);
    }
    return {
        init,
        filterApply,
        massUpdateCallback,
    };
})();
