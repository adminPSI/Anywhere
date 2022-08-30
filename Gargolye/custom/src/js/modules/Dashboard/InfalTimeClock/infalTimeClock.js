var infalTimeClockWidget = (function() {
	var position;
	var tempID = readCookie('id');
	var jobs = {};
	var timeData = [];
	var timeDataLookup = {};
	var currentJob;
	var currentTimeRecord;
	var ID;
	var jobDropdown;
	var infalPunchClockButton;
	var clockedIn = Boolean;
	var infalTimeClockTable;	
	var jobSelectionSection = document.createElement('div');
	var timeMessageSection = document.createElement('div');
	var clockedInStatusMessage = document.createElement('div');
	var actioncenter;
	

	function setInfalId(err, idObj) {
		if (err) {
			throw 'Error';
		}
		//if (idObj[0] && idObj[0].App_Password) ID = idObj[0].App_Password;
		if (idObj !== undefined) {
			if (idObj[0] && idObj[0].App_Username) ID = idObj[0].App_Username;
			//else ID = idObj;
			else ID = tempID;
		} else {
			//ID = idObj;
			ID = tempID;
		}
	}
	
	function getJobs () {
		infalAjax.InfalGetJobsAjax({ id: ID }, function(err, returnJobs) {
		if (err) {
			$('#dashinfaltimeclockwidget .dashboarderror').show();
			if (callback) callback('error');
			throw 'Error';
		} else {
			jobs = returnJobs;
			populateJobDropDown()
			}
		});
	}

	function cacheTimeDataForLookup(data) {
		data.forEach(d => {
			if (!timeDataLookup[d.ID]) {
				timeDataLookup[d.ID] = d;
			}
		});
	}

	function getTimePunches () {
		infalAjax.InfalGetClockInsAndOutsAjax({ id: ID }, function(err, data){
		if (err) {
			$('#dashinfaltimeclockwidget .dashboarderror').show();
			if (callback) callback('error');
			throw 'Error';
		} else {
			timeData = data;
			cacheTimeDataForLookup(data);
			// Sort the punches by ID:
			timeData.sort((a,b) => (a.Job_Description_No > b.Job_Description_No) ? 1 : -1);
			//build the table with the punch data
			timeClockTable(timeData)
			// set initial clocked in status
			const clockedInRecord = timeData.find(record => record.OutTime === "");
			if (timeData.length == 0 ) {
				clockedInStatusMessage.innerHTML = 'You are curently clocked out';
				clockedIn = false;
				infalPunchClockButton.innerHTML = 'Clock In';
				infalPunchClockButton.setAttribute('data-clock-action', 'in')
				infalTimeClockTable.style.display = 'none';
				timeMessageSection.innerHTML = 'No time entries for today.'
			} else if (clockedInRecord){
				clockedIn = true;
				getCurrentRecord(timeData);
				infalPunchClockButton.innerHTML = 'Clock Out';
				infalPunchClockButton.setAttribute('data-clock-action', 'out')
				jobDropdown.style.display = 'none';
                clockedInStatusMessage.innerHTML = 'Currently clocked in as ' + clockedInRecord.Emp_Job_Description + ' at ' + clockedInRecord.InTime.replace(/^0+/, '');
			} else {
				clockedInStatusMessage.innerHTML = 'You are curently clocked out';
				clockedIn = false;
				infalPunchClockButton.innerHTML = 'Clock In';
				infalPunchClockButton.setAttribute('data-clock-action', 'in')
			}
		}
	})
	}

	function populateJobDropDown() {
		var data = jobs.map(j => {
			var id = j.Job_Description_No
			var value = j.Job_Description;
			var text = j.text;
			return{
				id,
				value,
				text
			}
		})
		dropdown.populate('jobsDropdown', data);
		selectedJob = jobs[0].Job_Description_No;
		selectedJobDescription = jobs[0].Job_Description;
		jobDropdown.addEventListener('change', () => {
			var selectedOption = event.target.options[event.target.selectedIndex];
			selectedJob = selectedOption.id;
			selectedJobDescription = selectedOption.value;
		})
	}

	function calcPosition(p) {
		position = p;
		restOfStuff();
	}
	//Geo Location Lat and Long
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(calcPosition, restOfStuff);//second parm is for error handling, for example location is blocked.
		} else {
			// position = false;
			restOfStuff();
		}
	}
	//Clock in action 
	function clockIn () {
		var fullDate = moment(new Date()),
		inDate = fullDate.format('MM/DD/YYYY'),
		startTime = fullDate.format('hh:mm'),
		startAMPM = fullDate.format('A');
		var timeObj = {
		empIdString: ID + '',
		jobIdString: selectedJob + '',
		latInString: '0',
		longInString: '0',
		inDate: inDate,
		StartTime: startTime + '',
		StartAMPM: startAMPM + '',
		};
	
		if (position) {
		 	var latitude = position.coords.latitude;
		 	var longitude = position.coords.longitude;

		  	timeObj.latInString = latitude;
		 	timeObj.longInString = longitude;
		 }
		
		infalAjax.InfalClockInAjax(timeObj, results => {
			currentTimeRecord = results.InfalClockInResult;
			updateTimeData();
			timeMessageSection.innerHTML = '';
		});
		jobDropdown.style.display = 'none';
		infalTimeClockTable.style.display = 'block';
        clockedInStatusMessage.innerHTML = 'Currently clocked in as ' + selectedJobDescription + ' at ' + startTime.replace(/^0+/, '') + startAMPM;
	}
	//Clock Out action
	function clockOut () {
		clockedInStatusMessage.innerHTML = 'You are curently clocked out';
		getCurrentRecord(timeData)
		var fullDate = moment(new Date()),
		outDate = fullDate.format('MM/DD/YYYY'),
		EndTime = fullDate.format('hh:mm'),
		EndTimeAMPM = fullDate.format('A');
		var timeObj = {
			empIdString: ID,
			jobIdString: currentJob,
			recIdString: currentTimeRecord,
			latOutString: '0',
			longOutString: '0',
			outDate: outDate + '',
			EndTime: EndTime + '',
			EndTimeAMPM: EndTimeAMPM + '',
			Memo: timeDataLookup[currentTimeRecord].Memo === null ? '': timeDataLookup[currentTimeRecord].Memo,

			};
			
			if (position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
   
				 timeObj.latOutString = latitude;
				timeObj.longOutString = longitude;
			}
		
		infalAjax.InfalClockOutAjax(timeObj, r => {
			updateTimeData();
			jobDropdown.style.display = 'flex';
		});
	}

	function memoPopup(timeRecord) {
		var widget = document.getElementById('dashinfaltimeclockwidget');
		var widgetBody = widget.querySelector('.widget__body');
		// var popup = document.createElement('div');
		var popup = POPUP.build({
			classNames: 'infalTimeMemoPopup',
			header: 'Shift Note'
		})
		// popup.classList.add('popup', 'visible', 'infalTimeMemoPopup', 'popup--filter');
		// popup.setAttribute('data-popup', 'true');
		
		timeRecord = parseInt(timeRecord);
		let saveBtn = button.build({
			text: 'Save',
			style: 'secondary',
			type: 'contained',
			icon: 'checkmark',
			callback: function() {
				timeDataLookup[timeRecord].Memo = document.getElementById('memoInput').value;
				//Highlight this row if they add a memo, remove the highlight if they clear out the memo:
				if (timeDataLookup[timeRecord].Memo !== null && timeDataLookup[timeRecord].Memo !== '') {
					let row = document.getElementById(timeRecord);
					row.classList.add('containsMemo');
				} else {
					let row = document.getElementById(timeRecord);
					row.classList.remove('containsMemo');
				}
				overlay.hide();
				POPUP.hide(popup)
				// actioncenter.removeChild(popup);
				bodyScrollLock.enableBodyScroll(popup);
			}
		})

		let clearBtn = button.build({
			text: 'Clear',
			style: 'secondary',
			type: 'outlined',
			icon: 'clear',
			callback: function() {
				document.getElementById('memoInput').value = '';
			}
		});

		let memoInput = input.build({
			id: 'memoInput',
			label: 'Memo',
			type: 'textarea',
			style: 'secondary',
			value: timeDataLookup[timeRecord].Memo,
			readonly: timeRecord === currentTimeRecord && clockedIn ? false : true
		});
		popup.appendChild(memoInput);
		if (currentTimeRecord === timeRecord && clockedIn) {
			btnWrap = document.createElement('div');
			btnWrap.classList.add('btnWrap')
			btnWrap.appendChild(saveBtn)
			btnWrap.appendChild(clearBtn)
			popup.appendChild(btnWrap);
		}
		
		POPUP.show(popup);
	}

	infalPunchClockButton = button.build({
		id: 'infalClockInOutBtn',
		classNames: 'infalClockInOutBtn',
		text: '',
		style: 'secondary',
		type: 'contained',
		callback: function () {
			if (clockedIn) {
				clockOut()
				infalPunchClockButton.innerHTML = 'Clock In';
				infalPunchClockButton.setAttribute('data-clock-action', 'in');
				currentJob = '';
				clockedIn = !clockedIn;
			} else {
				clockIn();
				infalPunchClockButton.innerHTML = 'Clock Out';
				infalPunchClockButton.setAttribute('data-clock-action', 'out');
				clockedIn = !clockedIn;
			}
		}
	});

	function timeClockTable(timeData) {

		var options = {
			columnHeadings:[
				'Job',
				'Time in',
				'Time out'
			],
			tableId: 'infalTimeClockWidgetTable',
			callback: function () {
				memoPopup(event.target.id);
			}
		};
		
		infalTimeClockTable = table.build(options);
		var widget = document.getElementById('dashinfaltimeclockwidget');
		var widgetBody = widget.querySelector('.widget__body');




		widgetBody.appendChild(infalTimeClockTable);
		widgetBody.appendChild(timeMessageSection);
		let data = timeData.map(t => {
			return {
				values: [
					t.Emp_Job_Description,
					t.InTime,
					t.OutTime
				],
				id: t.ID
			}
		});
		table.populate('infalTimeClockWidgetTable', data)

		//Highlight the row if it contains a memo:
		var x;
		for (x in timeDataLookup) {
			if (timeDataLookup[x].Memo !== null && timeDataLookup[x].Memo !== '') {
				let row = document.getElementById(x);
				row.classList.add('containsMemo')
			}
		}
	}

	// Updates Current Record variables, and re-populates the time clock table
	function updateTimeData() {
		infalAjax.InfalGetClockInsAndOutsAjax({ id: ID }, function(err, data){
			if (err) {
				$('#dashinfaltimeclockwidget .dashboarderror').show();
				if (callback) callback('error');
				throw 'Error';
			} else {
				timeData = data;
				timeData.sort((a,b) => (a.Job_Description_No > b.Job_Description_No) ? 1 : -1);
				getCurrentRecord(timeData);
				cacheTimeDataForLookup(data);
				let tableData = timeData.map(t => {
					return {
						values: [
							t.Emp_Job_Description,
							t.InTime,
							t.OutTime
						],
						id: t.ID
					}
				});
				table.populate('infalTimeClockWidgetTable', tableData);
				//Highlight the row if it contains a memo:
				var x;
				for (x in timeDataLookup) {
					if (timeDataLookup[x].Memo !== null && timeDataLookup[x].Memo !== '') {
						let row = document.getElementById(x);
						row.classList.add('containsMemo');
					}
				}
			}
		})	
	}	

	function getCurrentRecord(timeData) {
		const clockedInRecord = timeData.find(record => record.OutTime === "");
		if (!clockedInRecord) return;
		currentTimeRecord = clockedInRecord.ID;
		currentJob = clockedInRecord.Emp_Job_Id;
	}

	var buildComponents = (function() {
		var widget = document.getElementById('dashinfaltimeclockwidget');
		var widgetBody = widget.querySelector('.widget__body');
		jobSelectionSection.setAttribute('id', 'jobSelectionSection');
		timeMessageSection.setAttribute('id', 'timeMessageSection');
		clockedInStatusMessage.setAttribute('id', 'clockedInStatusMessage');
		jobDropdown = dropdown.build({
      	dropdownId: 'jobsDropdown',
		label: 'Job',
		style: 'secondary',
		readonly: false
		});
		widgetBody.appendChild(clockedInStatusMessage);
		widgetBody.appendChild(jobSelectionSection);
		jobSelectionSection.appendChild(jobDropdown);
		jobSelectionSection.appendChild(infalPunchClockButton);

		

	})

	function restOfStuff(){
		setInfalId();
		buildComponents();
		getTimePunches();
		getJobs();
	}

	function init() {
		actioncenter = document.getElementById('actioncenter');
		getLocation();
	}

	  return {
		  init,
	  };
  })();