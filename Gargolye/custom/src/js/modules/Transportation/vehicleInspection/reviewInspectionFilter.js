const TRANS_reviewInspectionFilter = (function () {
    // Inputs
    let fromDateInput, toDateInput, vehicleDropdown, enteredByDropdown;
    let filterOpts
    let IsShow;
    let applyButton;  
    function createFilterElements() {

        fromDateInput = input.build({
            id: "inspectionFromDate",
            label: "From",
            type: "date",
            style: "secondary",
            value: filterOpts.fromDate
        })
        toDateInput = input.build({
            id: "inspectionToDate",
            label: "To",
            type: "date",
            style: "secondary",
            value: filterOpts.toDate
        })
        vehicleDropdown = dropdown.build({
            dropdownId: 'vehicleDropdown',
            label: 'Vehicle',
            style: 'secondary',
            value: filterOpts.vehicleInfoId
        });
        enteredByDropdown = dropdown.build({
            dropdownId: 'enteredByDropdown',
            label: 'Entered By',
            style: 'secondary',
            value: filterOpts.userId
        });
    }

    function buildFilterPopup(params) {
        const dateWrap = document.createElement('div')
        dateWrap.classList.add('dateWrap', 'btnWrap')

        const popup = POPUP.build({
            header: 'Filter',
            classNames: 'vehicleInspectionFilterPopup'
        })

        applyButton = button.build({
            text: 'APPLY',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(popup)
                TRANS_inspectionReview.filterApply(filterOpts)
            }
        });
        applyButton.style.width = '100%';
        dateWrap.appendChild(fromDateInput);
        dateWrap.appendChild(toDateInput);

        if (IsShow == 'ALL' || IsShow == 'fromDateBtn')
            popup.appendChild(dateWrap);
        if (IsShow == 'ALL' || IsShow == 'vehicleNumberBtn')
            popup.appendChild(vehicleDropdown)
        if (IsShow == 'ALL' || IsShow == 'enteredByBtn')
            popup.appendChild(enteredByDropdown)
        popup.appendChild(applyButton);
        POPUP.show(popup)

        eventListeners();
        populateDropdowns();
    }

    function populateDropdowns() {
        const vehicleDropdownData = []
        const enteredByDropdownData = []
        const vehicles = TRANS_mainLanding.getVehicles();
        const drivers = TRANS_mainLanding.getAllDrivers();

        vehicles.forEach((val, key, map) => {
            vehicleDropdownData.push({
                value: key,
                text: val.vehicleNumber
            });
        })

        drivers.forEach((val, key, map) => {
            enteredByDropdownData.push({
                value: key,
                text: `${val.Last_Name}, ${val.First_Name}`
            });
        });

        vehicleDropdownData.unshift({ value: '%', text: 'All' })
        enteredByDropdownData.unshift({ value: '%', text: 'All' })

        dropdown.populate(vehicleDropdown, vehicleDropdownData, filterOpts.vehicleInfoId)
        dropdown.populate(enteredByDropdown, enteredByDropdownData, filterOpts.userId)
    }

    function eventListeners() {
        fromDateInput.addEventListener('change', event => {
            if (isValidDate(event.target.value)) {
                if (UTIL.checkValidDateRange(event.target.value, toDateInput.firstElementChild.value)) {
                    updateDates();
                } else {
                    console.info('invalid date range');
                    fromDateInput.classList.add('error');
                    applyButton.classList.add('disabled');
                }
            } else {
                event.target.value = filterOpts.fromDate
            }

        })
        toDateInput.addEventListener('change', event => {
            if (isValidDate(event.target.value)) {
                if (UTIL.checkValidDateRange(fromDateInput.firstElementChild.value, event.target.value)) {
                    updateDates();
                } else {
                    console.info('invalid date range');
                    toDateInput.classList.add('error');
                    applyButton.classList.add('disabled');
                }
            } else {
                event.target.value = filterOpts.toDate
            }
        })
        vehicleDropdown.addEventListener('change', event => {
            filterOpts.vehicleInfoId = event.target.value;
        })
        enteredByDropdown.addEventListener('change', event => {
            filterOpts.userId = event.target.value;
        })

        function isValidDate(d) {
            d = new Date(d)
            return d instanceof Date && !isNaN(d);
        }

        function updateDates() {
            filterOpts.fromDate = fromDateInput.firstElementChild.value;
            filterOpts.toDate = toDateInput.firstElementChild.value;
            fromDateInput.classList.remove('error');
            toDateInput.classList.remove('error');
            applyButton.classList.remove('disabled');
        }
    }

    function init(opts, IsFilterShow) {
        filterOpts = opts;
        IsShow = IsFilterShow;
        createFilterElements();
        buildFilterPopup()
    }

    return {
        init
    }
})();