var timeClock = (function() {
	// DOM elements
	var widget;
	var widgetResults;
	var clockInOutBtn;
	var rowdataPopup;
	// Data & Values
	var currentLocationId;
	var currentStartTime;
	var currentEndTime;

	function giveInvalidTimeError() {
		var timeError = document.createElement('p');
		timeError.style.color = 'red';
		timeError.innerHTML = $.session.timeClockError;
		widgetError.appendChild(timeError);
		$.session.timeClockError = '';
	}
	function punchClock(event) {
		var btn = event.target;
		switch (btn.dataset.clockAction) {
			case 'in':
				timeClockAjax.clockInStaff();
				btn.innerHTML = 'Clock Out';
				btn.setAttribute('data-clock-action', 'out');
				break;
			case 'out':
				timeClockAjax.clockOutStaff();
				btn.innerHTML = 'Clock In';
				btn.setAttribute('data-clock-action', 'in');
				break;
			default:
				break;
		}
	}
	function updateStaffTimeClock(data) {
		var updateKeys = [];
		var newLocationData = data.newLocationData;
		var newStartTimeData = data.newStartTimeData;
		var newEndTimeData = data.newEndTimeData;
		var currentStartTime = data.data.startTime;
		var currentEndTime = data.data.stopTime;
		if (newLocationData) {
			var newLocationId = newLocationData.loc;

			if (newLocationId !== currentLocationId) {
				if (newStartTimeData) newStartTimeData.loc = newLocationId;
				if (newEndTimeData) newEndTimeData.loc = newLocationId;
			}
		}

		//if (newStartTimeData) newEndTimeData.orgTime = newStartTimeData.newTime;

		if (newLocationData) updateKeys.push('newLocationData');
		if (newStartTimeData) {
			if (currentEndTime && newStartTimeData.newTime > currentEndTime) {
				$.session.timeClockError = 'Invald Time';
				giveInvalidTimeError();
				//return
			} else {
				updateKeys.push('newStartTimeData');
			}
		}
		if (newEndTimeData) {
			if (newEndTimeData.newTime < currentStartTime) {
				$.session.timeClockError = 'Invald Time';
				giveInvalidTimeError();
				//return
			} else {
				updateKeys.push('newEndTimeData');
			}
		}

		switch (updateKeys.length) {
			case 1: {
				timeClockAjax.updateStaffClockTime(data[updateKeys[0]], () => {
					timeClockAjax.getStaffActivity(processStaffActivity);
				});
				break;
			}
			case 2: {
				timeClockAjax.updateStaffClockTime(data[updateKeys[0]], () => {
					timeClockAjax.updateStaffClockTime(data[updateKeys[1]], () => {
						timeClockAjax.getStaffActivity(processStaffActivity);
					});
				});
				break;
			}
			case 3: {
				timeClockAjax.updateStaffClockTime(data[updateKeys[0]], () => {
					timeClockAjax.updateStaffClockTime(data[updateKeys[1]], () => {
						timeClockAjax.updateStaffClockTime(data[updateKeys[2]], () => {
							timeClockAjax.getStaffActivity(processStaffActivity);
						});
					});
				});
				break;
			}
		}
	}
	function populateLocationsDropdown(description) {
		var defaultLocation;
		// prepare locations data for dropdown
		var locations = $.session.locations
			.map((location, index) => {
				if (location === description) {
					defaultLocation = {
						id: $.session.locationids[index],
						value: location,
						text: location,
					};
				}
				return {
					id: $.session.locationids[index],
					value: location,
					text: location,
				};
			})
			.filter(loc => {
				return loc.value !== description;
			});

		locations.unshift(defaultLocation);

		dropdown.populate('timeClockLocations', locations);
	}
	function displayRowData(data) {
		readOnly = false;
		currentLocationId = data.locationId;
		currentStartTime = data.startTime;
		currentEndTime = data.stopTime;
		var newLocationData;
		var newStartTimeData;
		var newEndTimeData;

		var rowId = data.rowId;
    var locationId = data.locationId;
    
    if ($.session.DenyStaffClockUpdate === true) {
      readOnly = true;
    } else {
      readOnly = false;
    }

    rowdataPopup = POPUP.build({ classNames: ['timeClockRowDetailsPopup']});

		// build popup inner html
		var locationsDropdown = dropdown.build({
			dropdownId: 'timeClockLocations',
			label: 'Locations',
			style: 'secondary'
		});
		var startTimeInput = input.build({
			id: 'timeClockStartTime',
			label: 'Start Time',
			type: 'time',
			style: 'secondary',
			readonly: readOnly,
			value: data.startTime,
		});
		var endTimeInput = input.build({
			id: 'timeClockEndTime',
			label: 'End Time',
			type: 'time',
			style: 'secondary',
			readonly: readOnly,
			value: data.stopTime,
		});
		var applyChanges = button.build({
			text: 'Apply Changes',
			style: 'secondary',
      type: 'contained',
			callback: function() {
				POPUP.hide(rowdataPopup);
				updateStaffTimeClock({ newLocationData, newStartTimeData, newEndTimeData, data });
			},
		});
		var deleteEntry = button.build({
			text: 'Delete Entry',
			style: 'secondary',
      type: 'contained',
      classNames: 'deleteTimeBtn',
			callback: function() {
				showTimeClockDeleteWarning(data);
			},
    });
    
		var timeWrap = document.createElement('div');
		timeWrap.classList.add('timeWrap');
		timeWrap.appendChild(startTimeInput);
    timeWrap.appendChild(endTimeInput);
    
    var btnWrap = document.createElement('div');
		btnWrap.classList.add('btnWrap');
		btnWrap.appendChild(applyChanges);
    btnWrap.appendChild(deleteEntry);


		rowdataPopup.appendChild(locationsDropdown);
		rowdataPopup.appendChild(timeWrap);
		rowdataPopup.appendChild(btnWrap);

		POPUP.show(rowdataPopup);
		populateLocationsDropdown(data.description);

		// popup events
		function showTimeClockDeleteWarning(data) {
			POPUP.hide(rowdataPopup);
			var timeClockDeleteWarningPop = POPUP.build({
				header: 'Are you sure you want to delete this entry?',
			});

			var btnWrap = document.createElement('div');
			btnWrap.classList.add('btnWrap');
			var yesBtn = button.build({
				text: 'Yes',
				style: 'secondary',
				type: 'contained',
				callback: function() {
					timeClockAjax.updateStaffClockTime(
						{
							loc: locationId,
							orgTime: data.startTime,
							newTime: data.startTime,
							isStartTime: 3,
							checkedAgainstTime: '',
						},
						() => {
							timeClockAjax.getStaffActivity(processStaffActivity);
						}
					);
					POPUP.hide(timeClockDeleteWarningPop);
				},
			});
			var noBtn = button.build({
				text: 'No',
				style: 'secondary',
				type: 'contained',
				callback: function() {
					POPUP.hide(timeClockDeleteWarningPop);
					POPUP.show(rowdataPopup);
				},
			});

			btnWrap.appendChild(yesBtn);
			btnWrap.appendChild(noBtn);
			timeClockDeleteWarningPop.appendChild(btnWrap);

			POPUP.show(timeClockDeleteWarningPop);
		}

		locationsDropdown.addEventListener('change', event => {
			var selectedOption = event.target.options[event.target.selectedIndex];
			newLocationData = {
				loc: selectedOption.id,
				orgTime: data.startTime,
				newTime: data.startTime,
				isStartTime: 2,
				checkedAgainstTime: '',
			};
		});
		startTimeInput.addEventListener('change', event => {
			newStartTimeData = {
				loc: data.locationId,
				orgTime: data.startTime,
				newTime: `${event.target.value}:00`,
				isStartTime: 0,
				checkedAgainstTime: '',
			};
		});
		endTimeInput.addEventListener('change', event => {
			newEndTimeData = {
				loc: data.locationId,
				orgTime: data.startTime,
				newTime: `${event.target.value}:00`,
				isStartTime: 1,
				checkedAgainstTime: '',
			};
		});
	}
	function processStaffActivity(results) {
		var lastClockOutTime;
    widgetResults.innerHTML = '';
    widgetError.innerHTML = '';
		if ($.session.timeClockError) giveInvalidTimeError();
		results.forEach((r, index) => {
			var staffId = r.Staff_ID;
			var locationId = r.Location_ID;
			var locationCode = r.location_code;
			var startTime = r.Start_Time === '23:59:59' ? '00:00:00' : r.Start_Time;
			var stopTime = r.Stop_Time === '23:59:59' ? '00:00:00' : r.Stop_Time;
			var serviceDate = r.Service_Date.split(' ')[0];
			var description = r.Description;

			var resultsRow = document.createElement('div');
			resultsRow.classList.add('results-row');
			resultsRow.setAttribute('data-row-id', index);
			resultsRow.innerHTML = `
        <div class="description">${description}</div>
        <div class="startTime">${UTIL.convertFromMilitary(startTime)}</div>
        <div class="stopTime">${UTIL.convertFromMilitary(stopTime)}</div>
      `;

			widgetResults.appendChild(resultsRow);

			resultsRow.addEventListener('click', function() {
				displayRowData({
					staffId,
					locationId,
					locationCode,
					description,
					serviceDate,
					startTime,
					stopTime,
					rowId: index,
				});
			});

			lastClockOutTime = stopTime;
		});

		if (lastClockOutTime !== '') {
			clockInOutBtn.innerHTML = 'Clock In';
			clockInOutBtn.setAttribute('data-clock-action', 'in');
		} else {
			clockInOutBtn.innerHTML = 'Clock Out';
			clockInOutBtn.setAttribute('data-clock-action', 'out');
		}
	}

	function init() {
    widget = document.getElementById('dashtimeclockwidget');
    widgetError = widget.querySelector('.overlapError');
		widgetResults = widget.querySelector('.widget__results');
		clockInOutBtn = widget.querySelector('.clockInOutBtn');

		clockInOutBtn.addEventListener('click', punchClock);

		timeClockAjax.getStaffActivity(processStaffActivity);
	}

	return {
		processStaffActivity,
		giveInvalidTimeError,
		init,
	};
})();
