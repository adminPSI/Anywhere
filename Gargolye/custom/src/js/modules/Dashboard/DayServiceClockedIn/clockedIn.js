var clockedInWidget = (function () {
    // DATA
    //-----------------------
    var locations;
    var clockedInConsumers;
    var clockedInStaff;
    // DOM
    //-----------------------
    var widget;
    var widgetBody;
    var asOfTime;
    var widgetTabs;
    var filterPopup;
    var locationDropdown;
    var applyFiltersBtn;
    var cancelFilterBtn;
    // VALUES
    //-----------------------
    var locationId;
    var locationName;

    // Filtering
    function populateLocations() {
        var data = locations.map(r => {
            return {
                id: r.ID,
                value: r.ID,
                text: r.Name,
            };
        });

        // if (!$.session.defaultDayServiceLocation) $.session.defaultDayServiceLocation = data[0].value;
        if (!locationId) locationId = data[0].value;
        if (!locationName) locationName = data[0].text;

        dropdown.populate('clockedInLocations', data, locationId);
    }
    function buildFilterPopup() {
        var widgetFilter = widget.querySelector('.widget__filters');
        if (widgetFilter) return;

        filterPopup = dashboard.buildFilterPopup();

        locationDropdown = dropdown.build({
            dropdownId: 'clockedInLocations',
            label: 'Location',
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

        filterPopup.appendChild(locationDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);
    }
    function displayFilteredBy() {
        var filteredBy = widget.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
            widgetBody.insertBefore(filteredBy, asOfTime);
        }

        filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Location:</span> ${locationName}</p>
    </div>`;
    }

    function populateCurrentClockInTime() {
        var currentTime = UTIL.getCurrentTime();
        currentTime = UTIL.convertFromMilitary(currentTime);

        asOfTime = document.createElement('p');
        asOfTime.classList.add('bold', 'clockedInTime');
        asOfTime.innerHTML = `Clocked In As Of ${currentTime}`;

        widgetBody.appendChild(asOfTime);
    }
    function populateConsumersNames() {
        var consumers = {};
        var totalConsumers = 0;

        clockedInConsumers.forEach(function (consumer) {
            var fullName = `${consumer.clockedinconsumername.split(' ')[1]}, ${
                consumer.clockedinconsumername.split(' ')[0]
            }`;
            if (!consumers[fullName]) consumers[fullName] = 0;
            consumers[fullName]++;
            totalConsumers++;
        });

        var consumersSorted = {};
        Object.keys(consumers)
            .sort()
            .forEach(function (key) {
                consumersSorted[key] = consumers[key];
            });

        // Tab Section
        var section = document.querySelector('.consumers-section');
        if (!section) return;
        section.innerHTML = '';

        var consumerCount = document.createElement('div');
        consumerCount.classList.add('clockedInCount');
        consumerCount.innerHTML = `Total - ${totalConsumers}`;

        var list = document.createElement('ul');
        list.classList.add('clockedInList');

        var names = Object.keys(consumersSorted);
        names.forEach(function (name) {
            var li = document.createElement('li');
            li.innerHTML = name;
            list.appendChild(li);
        });

        section.appendChild(consumerCount);
        section.appendChild(list);
    }
    function populateStaffNames() {
        var consumers = {};
        var totalEmployees = 0;

        clockedInStaff.forEach(function (consumer) {
      var fullName = `${consumer.staffclockedinname.split(' ')[1]}, ${
        consumer.staffclockedinname.split(' ')[0]
                }`;
            if (!consumers[fullName]) consumers[fullName] = 0;
            consumers[fullName]++;
            totalEmployees++;
        });

        var consumersSorted = {};
        Object.keys(consumers)
            .sort()
            .forEach(function (key) {
                consumersSorted[key] = consumers[key];
            });

        // Tab Section
        var section = document.querySelector('.employees-section');
        if (!section) return;
        section.innerHTML = '';

        var employeeCount = document.createElement('div');
        employeeCount.classList.add('clockedInCount');
        employeeCount.innerHTML = `Total - ${totalEmployees}`;

        var list = document.createElement('ul');
        list.classList.add('clockedInList');

        var names = Object.keys(consumersSorted);
        names.forEach(function (name) {
            var li = document.createElement('LI');
            li.innerHTML = name;
            list.appendChild(li);
        });

        section.appendChild(employeeCount);
        section.appendChild(list);
    }
    function buildWidgetTabs() {
        var tabOptions = {
            sections: ['Consumers', 'Employees'],
        };

        var widgetTabs = tabs.build(tabOptions);

        widgetBody.appendChild(widgetTabs);

        populateConsumersNames();
        populateStaffNames();
        displayFilteredBy();
    }

    function eventSetup() {
        var oldLocationId;
        var oldLocationName;

        locationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            oldLocationId = locationId;
            oldLocationName = locationName;
            locationId = selectedOption.value;
            locationName = selectedOption.innerHTML;
        });
        applyFiltersBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);

            clockedInWidgetAjax.getClockedInConsumerNamesDayServicesAjax(
                locationId,
                function (consumerNames) {
                    clockedInConsumers = consumerNames;
                    clockedInWidgetAjax.getClockedInStaffNamesDayServicesAjax(
                        locationId,
                        function (staffNames) {
                            clockedInStaff = staffNames;
                            populateConsumersNames();
                            populateStaffNames();
                            displayFilteredBy();
                        },
                    );
                },
            );
            widgetSettingsAjax.setWidgetFilter('dashdsclockedin', 'location', locationId)
        });
        cancelFilterBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);

            locationId = oldLocationId;
            locationName = oldLocationName;
        });
    }
    function getInitialData(callback) {
        clockedInWidgetAjax.getLocationsForDashboardDayServices(function (results) {
            locations = results;

            if (locationId)
                locationName = locations.find(l => l.ID == locationId).Name;
            locationId = locationId != '' ? locationId : locations[0].ID;

            clockedInWidgetAjax.getClockedInConsumerNamesDayServicesAjax(
                locationId,
                function (results) {
                    clockedInConsumers = results;

                    clockedInWidgetAjax.getClockedInStaffNamesDayServicesAjax(
                        locations[0].ID,
                        function (results) {
                            clockedInStaff = results;

                            callback();
                        },
                    );
                },
            );
        });
    }

    async function init() {
        // append filter button
        dashboard.appendFilterButton('dashdsclockedin', 'clockedInFilterBtn');

        widget = document.getElementById('dashdsclockedin');
        widgetBody = widget.querySelector('.widget__body');
        widgetBody.innerHTML = '';

        var filterLocationDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashdsclockedin', 'location');
        locationId = filterLocationDefaultValue.getWidgetFilterResult;
        buildFilterPopup();
        eventSetup();

        getInitialData(function () {
            populateCurrentClockInTime();
            populateLocations();
            buildWidgetTabs();
        });
    }

    return {
        init,
    };
})();
