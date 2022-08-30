var hoursWorkedWidget = (function() {
	// DATA
	//-----------------------
	var hoursWorkedList = {};
	var selectedWeekView = 'currweek';
  var selectedWeekRange;
  var selectedWeekRangeTxt;
	// DOM
	//-----------------------
	var widget;
  var widgetBody;
  var hoursList;
	var filterPopup;
	var weeksDropdown;
	var applyFiltersBtn;
	var cancelFilterBtn;

	function populateWeeksDropdown(results) {
    // value
		var currStart = moment(results.curr_start_date).format('MM-DD-YYYY');
		var currEnd = moment(results.curr_end_date).format('MM-DD-YYYY');
		var prevStart = moment(results.prev_start_date).format('MM-DD-YYYY');
    var prevEnd = moment(results.prev_end_date).format('MM-DD-YYYY');
    // text
    var newCurrStart = currStart.split('-').join('/');
    var newCurrEnd = currEnd.split('-').join('/');
    var newPrevStart = prevStart.split('-').join('/');
    var newPrevEnd = prevEnd.split('-').join('/');

		var data = [
			{
				id: 'currweek',
				value: `${currStart} - ${currEnd}`,
				text: `${newCurrStart} - ${newCurrEnd}`,
			},
			{
				id: 'prevweek',
				value: `${prevStart} - ${prevEnd}`,
				text: `${newPrevStart} - ${newPrevEnd}`,
			},
    ];
    
    if (!selectedWeekRange) selectedWeekRange = data[0].value;
    if (!selectedWeekRangeTxt) selectedWeekRangeTxt = data[0].text;

		dropdown.populate('hoursWorkedWeekDropdown', data, selectedWeekRange);
	}

	function populateHoursWorkedList(results) {
		hoursList.innerHTML = '';

		var dataObj;

		if (!Object.keys(hoursWorkedList).length) {
			dataObj = {};
			results.forEach(r => {
				var date = r.workdate.split(' ')[0].split('/');
				date = `${UTIL.leadingZero(date[0])}/${UTIL.leadingZero(date[1])}/${date[2]}`;
				var location = r.location;
				var hours;

				if ($.session.applicationName === 'Advisor') {
					if (r.check_hours !== '' && r.check_hours !== '0.00') {
						hours = parseFloat(r.check_hours).toFixed(2);
					} else if (r.hours !== '' && r.hours !== '0.000000000') {
						hours = parseFloat(r.hours).toFixed(2);
					} else {
						hours = 0;
					}
				} else {
					if (r.check_hours !== '' && r.check_hours !== '0') {
						hours = parseFloat(r.check_hours).toFixed(2);
					} else if (r.hours !== '' && r.hours !== '0.000000000') {
						hours = parseFloat(r.hours).toFixed(2);
					} else {
						hours = 0;
					}
				}

				if (!dataObj[r.week]) {
					dataObj[r.week] = {};
				}
				if (!dataObj[r.week][date]) {
					dataObj[r.week][date] = {};
				}
				if (!dataObj[r.week][date][location]) {
					dataObj[r.week][date][location] = {
						hours: parseFloat(hours).toFixed(2),
						name: location,
					};
				} else {
					var newHours = parseFloat(dataObj[r.week][date][location].hours) + parseFloat(hours);
					dataObj[r.week][date][location].hours = parseFloat(newHours).toFixed(2);
				}
			});
			// cache data
			hoursWorkedList = dataObj;
		} else {
			dataObj = hoursWorkedList;
		}

		if (!dataObj[selectedWeekView]) {
			hoursList.innerHTML = `<h4>Nothing scheduled</h4>`;
			return;
		} else {
      var overlapDisclaimer = document.createElement('h4');
      overlapDisclaimer.classList.add('overlapDisclaimer');
      overlapDisclaimer.innerHTML = 'This widget does not reconcile overlapping time entries.';
      hoursList.appendChild(overlapDisclaimer);
    }

		var weekRange = Object.keys(dataObj[selectedWeekView]);
		weekRange.forEach(week => {
			var div = document.createElement('div');

			var totalHours = 0;

			var locations = Object.keys(dataObj[selectedWeekView][week]);
			locations.forEach(location => {
				var hours = dataObj[selectedWeekView][week][location].hours;
				hours = parseFloat(hours);
				totalHours += hours;

				var locationText = document.createElement('p');
				locationText.innerHTML = `${location} - ${hours} hours`;

				div.appendChild(locationText);
			});

			var dateText = document.createElement('h4');
			dateText.classList.add('dateDisp');
			var isoWeek = UTIL.formatDateToIso(week);
			dateText.innerHTML = `${moment(isoWeek).format('dddd, MMMM D')} - ${totalHours} hours`;

			div.insertBefore(dateText, div.firstChild);
			hoursList.appendChild(div);
		});
    
    displayFilteredBy();
	}

	function buildFilterPopup() {
		var widgetFilter = widget.querySelector('.widget__filters');
		if (widgetFilter) return;

		filterPopup = dashboard.buildFilterPopup();

		weeksDropdown = dropdown.build({
			dropdownId: 'hoursWorkedWeekDropdown',
			label: 'Weeks',
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
		filterPopup.appendChild(btnWrap);
		widget.insertBefore(filterPopup, widgetBody);
  }
  
  function displayFilteredBy() {
    var filteredBy = widget.querySelector('.widgetFilteredBy');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
      widgetBody.insertBefore(filteredBy, hoursList);
    }

    filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Weeks:</span> ${selectedWeekRangeTxt}</p>
    </div>`;
  }

	function eventSetup() {
    var oldSelectedWeekView;
    var oldSelectedWeekRange;
    var oldSelectedWeekRangeTxt;

		weeksDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      oldSelectedWeekView = selectedWeekView;
      oldSelectedWeekRange = selectedWeekRange;
      oldSelectedWeekRangeTxt = selectedWeekRangeTxt;

      selectedWeekView = selectedOption.id;
      selectedWeekRange = selectedOption.value;
      selectedWeekRangeTxt = selectedOption.innerHTML;
		});
		applyFiltersBtn.addEventListener('click', () => {
			filterPopup.classList.remove('visible');
			overlay.hide();
			bodyScrollLock.enableBodyScroll(filterPopup);
			populateHoursWorkedList();
		});
		cancelFilterBtn.addEventListener('click', () => {
			filterPopup.classList.remove('visible');
			overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);
      
      selectedWeekView = oldSelectedWeekView;
      selectedWeekRange = oldSelectedWeekRange;
      selectedWeekRangeTxt = oldSelectedWeekRangeTxt;
		});
	}

	function init() {
		widget = document.getElementById('dashhoursworkedwidget');
		widgetBody = widget.querySelector('.widget__body');
		hoursList = document.getElementById('hoursWorkedLists');

		// append filter button
		dashboard.appendFilterButton('dashhoursworkedwidget', 'hoursWorkedFilterBtn');

		buildFilterPopup();
		eventSetup();

		hoursWorkedWidgetAjax.getWorkWeeks(function(error, workWeeks) {
      populateWeeksDropdown(workWeeks);
      displayFilteredBy();
      
			hoursWorkedWidgetAjax.getHoursWorked(function(error, hoursWorked) {
        populateHoursWorkedList(hoursWorked);
			});
		});
	}

	return {
		init,
	};
})();
