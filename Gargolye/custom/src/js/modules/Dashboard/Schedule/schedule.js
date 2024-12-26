var schedule = (function () {
    // DATA
    //-----------------------
    var locations = [];
    var weeks;
    var scheduleObj;
    // DOM
    //-----------------------
    var initialLoad;
    var widget;
    var widgetBody;
    var filterPopup;
    var weeksDropdown;
    var locationDropdown;
    var applyFiltersBtn;
    var cancelFilterBtn;
    // VALUES
    //-----------------------
    var totalHours;
    var selectedWeek;
    var selectedStart;
    var selectedEnd;

    function buildScheduleObj(results) {
        scheduleObj = {};
        results.forEach(r => {
            var location = r.location;
            var date = r.service_date.split(' ')[0];
            date = UTIL.formatDateToIso(date);
            var hours = r.difftime;
            var start = r.start_time;
            var end = r.end_time;
            var timeSpan = `${start} - ${end}`;
            var initials = r.initials.trim();

            if (locations.indexOf(location) === -1) {
                locations.push(location);
            }

            if (!scheduleObj[location]) {
                scheduleObj[location] = {};
            }
            if (!scheduleObj[location][date]) {
                scheduleObj[location][date] = {};
            }
            if (!scheduleObj[location][date][timeSpan]) {
                scheduleObj[location][date][timeSpan] = {
                    initials: [],
                    time: parseFloat(hours),
                };
            }
            if (initials !== '') {
                scheduleObj[location][date][timeSpan].initials.push(initials);
            }
        });
        if (results.length === 0) {
            scheduleObj = {};
        }
    }

    function populateSchedule(filterBy) {
        var filteredData = [];
        var dataByDate = {};
        totalHours = 0; //setting to 0 here so that it clears out when there is no schedule and so it doesn't keep getting appended to

        if (filterBy === 'All') {
            Object.keys(scheduleObj).forEach(key => {
                filteredData.push({
                    data: scheduleObj[key],
                    name: key,
                });
            });
        } else {
            filteredData.push({ data: scheduleObj[filterBy], name: filterBy });
        }

        if (filteredData.length !== 0 && filteredData[0].data !== undefined) {
            filteredData.forEach(d => {
                var locationDates = d.data;
                var locationName = d.name;
                Object.keys(locationDates).forEach(date => {
                    var locationDateEvents = locationDates[date];
                    if (!dataByDate[date]) {
                        dataByDate[date] = {};
                    }
                    var timeKeys = Object.keys(d.data[date]);
                    timeKeys.forEach(key => {
                        totalHours = totalHours + d.data[date][key].time;
                    });

                    Object.keys(locationDateEvents)
                        .sort()
                        .forEach(event => {
                            if (!dataByDate[date][event]) {
                                dataByDate[date][event] = {};
                            }

                            dataByDate[date][event][locationName] = locationDateEvents[event];
                        });
                });
            });
        }

        scheduleList.innerHTML = '';
        var divOne = document.createElement('div');
        divOne.classList.add('totalHours');
        divOne.innerHTML = `<p class='bold'>Total Hours - ${totalHours.toFixed(2)}</p>`;
        var divTwo = document.createElement('div');
        divTwo.innerHTML = `<p class='bold'>Week of ${selectedWeek}</p>`;
        divTwo.classList.add('weekOf');

        var dates = Object.keys(dataByDate);
        dates.sort();
        dates.forEach(date => {
            var fullDate = moment(date).format('dddd, MMMM D');
            var div = document.createElement('div');
            div.classList.add('scheduleRow');
            div.innerHTML = `<p>${fullDate}</p>`;

            // get times for specified date
            var times = Object.keys(dataByDate[date]);
            times.sort().forEach(timeFrame => {
                var times = timeFrame.split(' - ');
                var start = times[0].split(':');
                var end = times[1].split(':');
                var startTime = moment().hour(parseInt(start[0], 10)).minute(parseInt(start[1], 10));
                var endTime = moment().hour(parseInt(end[0], 10)).minute(parseInt(end[1], 10));

                var locations = Object.keys(dataByDate[date][timeFrame]).sort();

                locations.forEach(location => {
                    var initials = dataByDate[date][timeFrame][location].initials;
                    initials = initials.length > 0 ? initials.join(', ') : '';

                    div.innerHTML += `
            <p>${startTime.format('h:mma')} to ${endTime.format('h:mma')} - ${location}${
            initials !== '' ? ` - ${initials}` : ''
                        }</p>
          `;
                });
            });

            scheduleList.appendChild(div);
        });

        scheduleList.insertBefore(divOne, scheduleList.childNodes[0]);
        scheduleList.insertBefore(divTwo, scheduleList.childNodes[0]);

        // initialLoad = false;
    }

    function buildFilterPopup() {
        var widgetFilter = widget.querySelector('.widget__filters');
        if (widgetFilter) return;

        filterPopup = dashboard.buildFilterPopup();

        weeksDropdown = dropdown.build({
            dropdownId: 'dashboardScheduleWeekDropdown',
            label: 'Weeks',
            style: 'secondary',
            readonly: false,
        });
        locationDropdown = dropdown.build({
            dropdownId: 'dashboardScheduleLocationDropdown',
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

        filterPopup.appendChild(weeksDropdown);
        filterPopup.appendChild(locationDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);
    }
    function eventSetup() {
        var oldSelectedWeek;
        var oldSelectedStart;
        var oldSelectedEnd;
        var oldMyscheduleWidgetLocationText;

        weeksDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            var date = selectedOption.value.split(' - ');
            oldSelectedWeek = selectedWeek;
            oldSelectedStart = selectedStart;
            oldSelectedEnd = selectedEnd;
            selectedWeek = event.target.value;
            selectedStart = date[0];
            selectedEnd = date[1];
        });

        locationDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            oldMyscheduleWidgetLocationText = $.session.myscheduleWidgetLocationText;
            $.session.myscheduleWidgetLocationText = selectedOption.value;
        });
        applyFiltersBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
            scheduleAjax.getSchedulingPeriodsDetailsAjax(
                {
                    token: $.session.Token,
                    startDate: UTIL.formatDateToIso(selectedStart),
                    endDate: UTIL.formatDateToIso(selectedEnd),
                },
                function (results) {
                    buildScheduleObj(results);
                    populateLocationDropdown();
                    displayFilteredBy();
                    populateSchedule($.session.myscheduleWidgetLocationText);
                },
            );
            widgetSettingsAjax.setWidgetFilter('dashschedulewidget', 'location', $.session.myscheduleWidgetLocationText)
        });
        cancelFilterBtn.addEventListener('click', event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);

            $.session.myscheduleWidgetLocationText = oldMyscheduleWidgetLocationText;
            selectedWeek = oldSelectedWeek;
            selectedStart = oldSelectedStart;
            selectedEnd = oldSelectedEnd;
        });
    }
    function populateLocationDropdown() {
        var data = locations.map(location => {
            return {
                value: location,
                text: location,
            };
        });

        data.unshift({ value: 'All', text: 'All' });
        data.sort();

        if ($.session.myscheduleWidgetLocationText) {
            data = data.filter(d => d.value !== $.session.myscheduleWidgetLocationText);
            data.unshift({
                value: $.session.myscheduleWidgetLocationText,
                text: $.session.myscheduleWidgetLocationText,
            });
        } else {
            $.session.myscheduleWidgetLocationText = data[0].value;
        }

        dropdown.populate(
            'dashboardScheduleLocationDropdown',
            data,
            $.session.myscheduleWidgetLocationText,
        );
    }
    function populateWeeksDropdown(results) {
        weeks = results;

    let defaultValue;

        var data = results.map(r => {
            if (r.currentWeek) {
        defaultValue = r.text;
                selectedWeek = r.text;
                selectedStart = r.start;
                selectedEnd = r.end;
            }

            return {
                value: r.text,
                text: r.text,
            };
        });

    if (!defaultValue) {
            selectedWeek = data[0].text;
            selectedStart = results[0].start;
            selectedEnd = results[0].end;
        }

    dropdown.populate('dashboardScheduleWeekDropdown', data, defaultValue);
    }
    function displayFilteredBy() {
        var filteredBy = widget.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
            widgetBody.insertBefore(filteredBy, scheduleList);
        }

        var splitDate = selectedWeek.split('-');
        var start = splitDate[0].trim().split('/');
        var end = splitDate[1].trim().split('/');
        start = `${UTIL.leadingZero(start[0])}/${UTIL.leadingZero(start[1])}/${start[2].slice(2, 4)}`;
        end = `${UTIL.leadingZero(end[0])}/${UTIL.leadingZero(end[1])}/${end[2].slice(2, 4)}`;
        var filteredDate = `${start} - ${end}`;

        filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Weeks:</span> ${filteredDate}</p>
      <p><span>Location:</span> ${$.session.myscheduleWidgetLocationText}</p>
    </div>`;
    }

    async function init() {
        widget = document.getElementById('dashschedulewidget');
        widgetBody = widget.querySelector('.widget__body');
        scheduleList = document.getElementById('scheduleWorkedLists');
        dashboard.appendFilterButton('dashschedulewidget', 'scheduleFilterBtn');

        var filterLocationDefaultValue = await widgetSettingsAjax.getWidgetFilter('dashschedulewidget', 'location');
        $.session.myscheduleWidgetLocationText = filterLocationDefaultValue.getWidgetFilterResult;
        if (!$.session.myscheduleWidgetLocationText) $.session.myscheduleWidgetLocationText = 'All';
     
        buildFilterPopup();
        eventSetup();

        scheduleAjax.getSchedulingPeriodsAjax(function (results) {
            populateWeeksDropdown(results);

            scheduleAjax.getSchedulingPeriodsDetailsAjax(
                {
                    token: $.session.Token,
                    startDate: UTIL.formatDateToIso(selectedStart),
                    endDate: UTIL.formatDateToIso(selectedEnd),
                },
                function (results) {
                    buildScheduleObj(results);
                    populateLocationDropdown();
                    displayFilteredBy();
                    populateSchedule($.session.myscheduleWidgetLocationText);
                },
            );
        });
    }

    return {
        init,
    };
})();
