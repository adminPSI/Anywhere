//=============================================
// *** EDIT THIS CODE AT YOUR OWN RISK ***
//=============================================
var schedulingCalendar = (function () {
  var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var _scheduleArray = [];
  var _schedules = []; // cache of all schedules
  var _appointments = []; // all appointments
  var _locationsArr = []; // for locations dropdown
  var _reasonsArr = []; // for reasons dropdown
  var _startDay = 0; // start day of week
  var _currentWeekHours = null;
  var _scheduleView = 'mine';
  var _currentView = 'week';
  var defaultLocation; //default location for location dropdown
  // DOM Elements
  var actioncenter;
  // mobile check
  var isMobile;
  //Hack to get locationId to pass to get drop down employees
  var detailsLocationId;
  var shiftDateForCall;

  function appendModuleContainer(moduleName) {
    var actionCenter = document.getElementById('actioncenter');
    actionCenter.innerHTML = '';
    var moduleContainer = document.createElement('DIV');
    moduleContainer.classList.add(moduleName);
    moduleContainer.id = UTIL.camelize(moduleName);
    actionCenter.appendChild(moduleContainer);
  }
  function removeInnerHtml(elementId) {
    var element = document.getElementById(elementId);
    element.innerHTML = '';
  }

  //========================================================
  // DATE UTIL
  //========================================================
  function toInteger(dirtyNumber) {
    var number = Number(dirtyNumber);

    if (isNaN(number)) {
      return number;
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }

  function cloneDate(argument) {
    const argStr = Object.prototype.toString.call(argument);

    if (argument instanceof Date || (typeof argument === 'object' && argStr === ['object Date'])) {
      return new Date(argument.getTime());
    } else if (typeof argument === 'number' || argStr === ['object Number']) {
      return new Date(argument);
    } else {
      argument = argument.split(',');
      return new Date(parseInt(argument[0]), parseInt(argument[1] - 1), parseInt(argument[2]));
    }
  }

  function addMilliseconds(dirtyDate, dirtyAmount) {
    var timestamp = cloneDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount);
  }

  function addMinutes(dirtyDate, dirtyAmount) {
    var MILLISECONDS_IN_MINUTE = 60000;
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
  }

  function addDays(dirtyDate, dirtyAmount) {
    const date = cloneDate(dirtyDate);
    const amount = toInteger(dirtyAmount);
    date.setDate(date.getDate() + amount);
    return date;
  }

  function getDay(dirtyDate) {
    const date = cloneDate(dirtyDate);
    const day = date.getDay();
    return day;
  }

  function getServiceDate(res) {
    var dateString = res.serviceDate ? res.serviceDate : res.dateScheduled;
    var serviceDateObj = dateString.split(' ')[0].split('/');
    var serviceYear = serviceDateObj[2];
    var serviceMonth = UTIL.leadingZero(serviceDateObj[0]);
    var serviceMonthName = months[serviceDateObj[0] - 1];
    var serviceDate = UTIL.leadingZero(serviceDateObj[1]);
    var serviceDay = days[getDay(`${serviceDateObj[2]}-${serviceDateObj[0]}-${serviceDateObj[1]}`)];

    serviceDateObj = `${serviceYear}-${serviceMonth}-${serviceDate}`;
    return serviceDateObj;
  }

  function setStartDay(dayObj) {
    var weekDays = ['S', 'M', 'T', 'W', 'R', 'F', 'A', 'S'];
    var dayOfWeek = dayObj[0].Day_of_Week;
    var startDay = weekDays.indexOf(dayOfWeek);
    _startDay = startDay !== -1 ? startDay : 0;
  }

  function eachDateOfInterval(dirtyInterval) {
    const interval = dirtyInterval || {};

    if (interval.start === interval.end) return interval.start.split(',').join('/');

    const startDate = cloneDate(interval.start);
    const endDate = cloneDate(interval.end);

    const endTime = endDate.getTime();

    if (!(startDate.getTime() <= endTime)) return;

    let dates = [];

    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {
      dates.push(cloneDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return dates;
  }

  function isWithinInterval(dirtyDate, dirtyInterval) {
    var interval = dirtyInterval || {};
    var time = cloneDate(dirtyDate).getTime();
    var startTime = cloneDate(interval.start).getTime();
    var endTime = cloneDate(interval.end).getTime();

    return time >= startTime && time <= endTime;
  }

  function areConsecutiveDates(date1, date2) {
    date1 = date1.split(' ')[0].split('/');
    date2 = date2.split(' ')[0].split('/');

    date1[0] = date1[0] - 1;
    date2[0] = date2[0] - 1;

    var dateOne = new Date(date1[2], date1[0], date1[1]);
    var dateTwo = new Date(date2[2], date2[0], date2[1]);

    dateOne = addDays(dateOne, 1);

    return dateOne.getTime() === dateTwo.getTime();
  }

  //========================================================
  // TIME UTIL
  //========================================================
  function getTotalHours(startTime, endTime) {
    if (startTime === undefined || endTime === undefined) {
      return;
    } else {
      startTime = startTime.trim();
      endTime = endTime.trim();
    }

    var endDate = endTime === '12:00 AM' ? '01/02/2019 ' : '01/01/2019 ';
    var startTimeDate = new Date('01/01/2019 ' + startTime);
    var endTimeDate = new Date(endDate + endTime);
    var startTimeMilliseconds = startTimeDate.getTime();
    var endTimeMilliseconds = endTimeDate.getTime();
    // total milliseconds
    var milliseconds = endTimeMilliseconds - startTimeMilliseconds;
    var hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((milliseconds / (1000 * 60)) % 60);

    return hours + minutes / 60;
  }

  function timeOverlapCheck(fromTime, toTime) {
    var startTimeMilliseconds = new Date('01/01/2019 ' + fromTime).getTime();
    var endTimeMilliseconds = new Date('01/01/2019 ' + toTime).getTime();
    var timeDifference = endTimeMilliseconds - startTimeMilliseconds;
    return timeDifference < 0 ? false : true;
  }

  function midnightNextDay(date) {
    date = `${date} 00:00:00`;
    return addDays(date, 1);
  }

  function convertToMilitary(dirtyTime) {
    var hours = Math.floor((dirtyTime / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((dirtyTime / (1000 * 60)) % 60);
    return `${hours}:${UTIL.leadingZero(minutes / 60)}:00`;
  }

  function convertFromMilitary(dirtyTime) {
    var timeArr = dirtyTime.split(':');
    var dirtyHours = parseInt(timeArr[0]);
    var dirtyMinutes = parseInt(timeArr[1]);

    var hours, minutes, amPm;

    if (dirtyHours === 0) {
      hours = '12';
      amPm = 'AM';
    }
    if (dirtyHours > 0 && dirtyHours < 12) {
      hours = dirtyHours.toString();
      amPm = 'AM';
    }
    if (dirtyHours === 12) {
      hours = dirtyHours.toString();
      amPm = 'PM';
    }
    if (dirtyHours > 12) {
      hours = (dirtyHours - 12).toString();
      amPm = 'PM';
    }

    minutes = UTIL.leadingZero(dirtyMinutes);

    return `${hours}:${minutes} ${amPm}`;
  }

  //========================================================
  // Scheduling Locations
  //========================================================
  function renderLocationDropdown() {
    calContainer = document.querySelector('.calendarContainer');
    let scheduleViewWrap = document.querySelector('.scheduleViewWrap');
    if (locationDropdown) return;
    var locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Locations:',
      style: 'secondary',
    });

    scheduleViewWrap.appendChild(locationDropdown);
    locationDropdown.classList.add('disabled');
    // actioncenter.insertBefore(locationDropdown, calContainer);

    // var locationDropdown = document.getElementById('js-scheduleLocationDropdown');
    locationDropdown.addEventListener('change', event => {
      var option = event.target.options[event.target.selectedIndex];
      var locationId = option.id;
      schedulingAjax.getSchedulesForSchedulingModuleAjax(locationId, '%', populateSchedules);
    });
  }

  function populateLocationDropdown(data) {
    // var dropdown = document.getElementById('locationDropdown');
    let dropdownData = data.map(d => {
      var id = d.locationId;
      var value = d.locationName;
      var text = d.locationName;
      return {
        id,
        value,
        text,
      };
    });

    dropdown.populate('locationDropdown', dropdownData);

    // cache cloned data
    _locationsArr = data;
    // populate schedule for default location
    defaultLocation = dropdownData[0].id;
    // schedulingAjax.getSchedulesForSchedulingModuleAjax(defaultLocation, '%', populateSchedules);
  }

  //========================================================
  // SHIFT DETAILS
  //========================================================
  function renderDetailsPopup(details, type) {
    details = details[0];
    var actioncenter = document.getElementById('actioncenter');
    var shiftDetails = document.querySelector('.shiftDetails');
    var openShiftDetails = document.querySelector('.openShiftDetails');
    var pendingOpenShiftDetails = document.querySelector('.pendingOpenShiftDetails');
    var pendingCallOffDetails = document.querySelector('.pendingCallOffDetails');
    var appointmentDetails = document.querySelector('.appointmentDetails');

    if (shiftDetails) {
      var shiftId = shiftDetails.getAttribute('shiftId');
      if (shiftId !== details.shiftId) {
        actioncenter.removeChild(shiftDetails);
      } else {
        return;
      }
    }
    if (openShiftDetails) {
      var shiftId = openShiftDetails.getAttribute('shiftId');
      if (shiftId !== details.shiftId) {
        actioncenter.removeChild(openShiftDetails);
      } else {
        return;
      }
    }
    if (pendingOpenShiftDetails) {
      var shiftId = pendingOpenShiftDetails.getAttribute('shiftId');
      if (shiftId !== details.shiftId) {
        actioncenter.removeChild(pendingOpenShiftDetails);
      } else {
        return;
      }
    }
    if (pendingCallOffDetails) {
      var shiftId = pendingCallOffDetails.getAttribute('shiftId');
      if (shiftId !== details.shiftId) {
        actioncenter.removeChild(pendingCallOffDetails);
      } else {
        return;
      }
    }
    if (appointmentDetails) {
      var appointmentId = appointmentDetails.getAttribute('appointmentId');
      if (appointmentId !== details.medTrackingId) {
        actioncenter.removeChild(appointmentDetails);
      } else {
        return;
      }
    }
    detailsLocationId = details.locationId;
    switch (type) {
      case 'shift':
        renderShiftDetails(details);
        break;
      case 'openShift':
        renderOpenShiftDetails(details);
        break;
      case 'requestOff':
        renderPendingOpenShiftDetails(details);
        break;
      case 'callOff':
        renderPendingCallOffDetails(details);
        break;
      case 'appointment':
        renderAppointmentDetails(details);
        break;
      default:
        break;
    }
  }

  // Shift Details / Appointment Details
  //---------------------------------------------------
  function renderAppointmentDetails(details) {
    var actioncenter = document.getElementById('actioncenter');

    var date = details.dateScheduled.split(' ')[0];
    var time =
      details.timeScheduled !== ''
        ? convertFromMilitary(details.timeScheduled)
        : convertFromMilitary(details.dateScheduled.split(' ')[1]);
    var notes = details.notes;
    var consumer = details.consumerName;
    var provider = details.provider;
    var type = details.typeDescription;
    var reason = details.reason;

    var popup = POPUP.build({
      classNames: 'appointmentDetails',
      attributes: [{ key: 'appointmentId', value: details.medTrackingId }],
    });

    wrap = document.createElement('div');
    wrap.innerHTML = `
          <div class="detailsHeading">
            <h2>Appointment Details</h2>
            <p class="smallDetail font-mediumEmphasis">${date}</p>
          </div>
          
          <div class="detailsBody">
            <div class="time popupDetailsLine">
              <h4 class="label">Time:</h4>
              <p>${time}</p>
            </div>
            <hr>
            <div class="employee popupDetailsLine">
              <h4 class="label">Consumer:</h4>
              <p>${consumer}</p>
            </div>
            <hr>
            <div class="popupDetailsLine">
              <h4 class="label">Provider:</h4>
              <p>${provider}</p>
            </div>
            <hr>
            <div class="type popupDetailsLine">
              <h4 class="label">Type:</h4>
              <p>${type}</p>
            </div>
            <hr>
            <div class="reason popupDetailsLine">
              <h4 class="label">Reason:</h4>
              <p>${reason}</p>
            </div>
            <hr>
            <div class="shiftNotes popupDetailsLine">
              <h4 class="label">Notes:</h4>
              <p>${notes}</p>
            </div>
          </div>
      `;
    popup.appendChild(wrap);
    POPUP.show(popup);
  }
  // UPDATED FOR RESPONSIVE POPUP
  function renderShiftDetails(details) {
    var actioncenter = document.getElementById('actioncenter');

    var shiftDate = details.serviceDate.split(' ')[0];
    var startTime = details.startTime;
    var endTime = details.endTime;
    var consumers = details.consumerNames;
    var location = details.locationName;
    var shiftNotes = details.shiftNotes;
    var shiftType = details.shiftType;
    var workCode = `${details.workCode} - ${details.workCodeDescription}`;
    shiftDateForCall = shiftDate;
    shiftType =
      shiftType === 'A'
        ? 'Awake'
        : shiftType === 'N'
        ? 'Night'
        : shiftType === 'D'
        ? 'Day'
        : shiftType === 'S'
        ? 'Sleep'
        : '';
    startTime = convertFromMilitary(startTime);
    endTime = convertFromMilitary(endTime);

    var popup = POPUP.build({
      classNames: 'shiftDetails',
      attributes: [{ key: 'shiftId', value: details.shiftId }],
    });
    wrap = document.createElement('div');
    wrap.innerHTML = `
          <div class="detailsHeading">
            <h2>Shift Details</h2>
            <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
          </div>
          <div class="detailsBody">
            <div class="location popupDetailsLine">
              <h4 class="label">Location:  </h4>
              <p>${location}</p>
            </div>
            <hr>
            <div class="time popupDetailsLine">
              <h4 class="label">Time:  </h4>
              <p>${startTime} - ${endTime}</p>
            </div>
            <hr>
            <div class="employee popupDetailsLine">
              <h4 class="label">Consumers:  </h4>
              <p>${consumers}</p>
            </div>
            <hr>
            <div class="workCode popupDetailsLine">
              <h4 class="label">Work Code:  </h4>
              <p>${workCode}</p>
            </div>
            <hr>
            <div class="shiftType popupDetailsLine">
              <h4 class="label">Shift Type:  </h4>
              <p>${shiftType}</p>
            </div>
            <hr>
            <div class="shiftNotes popupDetailsLine">
              <h4 class="label">Notes:  </h4>
              <p>${shiftNotes}</p>
            </div>
          </div>
          `;
    popup.appendChild(wrap);
    //New Call off btn using button.build
    let callOffBtn = button.build({
      text: 'Call Off',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup);
        renderRequestOffPopup(details.shiftId);
      },
    });

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(callOffBtn);

    if (
      _scheduleView === 'mine' &&
      (_currentView === 'week' || _currentView === 'day') &&
      $.session.schedAllowCallOffRequests === 'Y' &&
      $.session.schedulingUpdate
    ) {
      popup.appendChild(btnWrap);
    }
    POPUP.show(popup);
  }

  // UPDATED FOR RESPONSIVE POPUP
  // Open Shift Details
  //---------------------------------------------------
  function renderOpenShiftDetails(details) {
    var actioncenter = document.getElementById('actioncenter');

    var shiftDate = details.serviceDate.split(' ')[0];
    var startTime = details.startTime;
    var endTime = details.endTime;
    var consumers = details.consumerNames;
    var location = details.locationName;
    var shiftNotes = details.shiftNotes;
    var shiftType = details.shiftType;
    var workCode = `${details.workCode} - ${details.workCodeDescription}`;
    shiftDateForCall = shiftDate;
    shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
    startTime = convertFromMilitary(startTime);
    endTime = convertFromMilitary(endTime);

    var popup = POPUP.build({
      classNames: 'openShiftDetails',
      attributes: [{ key: 'shiftId', value: details.shiftId }],
    });
    wrap = document.createElement('div');
    wrap.innerHTML = `
          <div class="detailsHeading">
            <h2>Shift Details</h2>
            <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
          </div>
          <hr>
          <div class="detailsBody">
            <div class="location popupDetailsLine">
              <h4 class="label">Location:</h4>
              <p>${location}</p>
            </div>
            <hr>
            <div class="time popupDetailsLine">
              <h4 class="label">Time:</h4>
              <p>${startTime} - ${endTime}</p>
            </div>
            <hr>
            <div class="employee popupDetailsLine">
              <h4 class="label">Consumers:</h4>
              <p>${consumers}</p>
            </div>
            <hr>
            <div class="workCode popupDetailsLine">
              <h4 class="label">Work Code:</h4>
              <p>${workCode}</p>
            </div>
            <hr>
            <div class="shiftType popupDetailsLine">
              <h4 class="label">Shift Type:</h4>
              <p>${shiftType}</p>
            </div>
            <hr>
            <div class="shiftNotes popupDetailsLine">
              <h4 class="label">Notes:</h4>
              <p>${shiftNotes}</p>
            </div>
          </div>
      `;
    popup.appendChild(wrap);
    let requestShiftBtn = button.build({
      text: 'Request Shift',
      style: 'secondary',
      type: 'contained',
      callback: async function () {
        var token = $.session.Token;
        var shiftId = details.shiftId;
        var personId = $.session.PeopleId;
        var status = 'P';
        var notifiedEmployeeId = null;
        POPUP.hide(popup);

        const { getOverlapStatusforSelectedShiftResult: overlapWithExistingShift } =
          await schedulingAjax.getOverlapStatusforSelectedShiftAjax(shiftId, personId);

        if (overlapWithExistingShift == 'NoOverLap') {
          renderSendShiftRequestPopup({
            token,
            shiftId,
            personId,
            status,
            notifiedEmployeeId,
          });
        } else {
          displayOverlapPopup(overlapWithExistingShift);
          return;
        }
      },
    });

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');

    if ($.session.schedRequestOpenShifts === 'N' || $.session.isPSI) {
    } else if (!$.session.schedulingUpdate || !$.session.schedulingView) {
    } else {
      btnWrap.appendChild(requestShiftBtn);
      popup.appendChild(btnWrap);
    }

    // ($.session.schedRequestOpenShifts === 'N' || $.session.isPSI) ? null:
    // (!$.session.schedulingUpdate || !$.session.schedulingView) ? null: popup.appendChild(btnWrap)

    POPUP.show(popup);
  }

  function displayOverlapPopup(existingShiftLocationName) {
    var overlapPopup = POPUP.build({
      classNames: 'sendRequestShiftPopup',
    });
    overlapWrap = document.createElement('div');
    overlapWrap.innerHTML = `
          <div class="detailsHeading">
            <h2>Requested Shift Overlap</h2>
            <p>This open shift overlaps with an existing shift you are scheduled to work at ${existingShiftLocationName}. You cannot request this open shift.</p>
          </div>
      `;
    overlapPopup.appendChild(overlapWrap);

    let overlapCancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: function () {
        POPUP.hide(overlapPopup);
      },
    });

    //overlapPopup.appendChild(wrap2);
    overlapPopup.appendChild(overlapCancelBtn);

    POPUP.show(overlapPopup);
  }
  // UPDATED FOR RESPONSIVE POPUP
  function renderSendShiftRequestPopup(data) {
    var actioncenter = document.getElementById('actioncenter');

    var popup = POPUP.build({
      classNames: 'sendRequestShiftPopup',
    });
    wrap = document.createElement('div');
    wrap.innerHTML = `
          <div class="detailsHeading">
            <h2>Request Open Shift</h2>
          </div>
  
          <div class="detailsBody">
            <div class="dropdown-wrap">
              <span class="requestError"></span>
            </div>
          </div>
      `;
    popup.appendChild(wrap);
    var employeeDropdown = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee To Notify',
      style: 'secondary',
    });
    let cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: function () {
        POPUP.hide(popup);
      },
    });
    let sendRequestBtn = button.build({
      id: 'sendReqBtn',
      classNames: 'disabled',
      text: 'Send Request',
      style: 'secondary',
      type: 'contained',
      icon: 'send',
      callback: function () {
        data.notifiedEmployeeId = employeeId;
        schedulingAjax.saveOpenShiftRequestSchedulingAjax(data);
        _scheduleView = 'mine';
        _currentView = 'week';
        POPUP.hide(popup);
        init();
      },
    });

    schedulingAjax.getCallOffDropdownEmployeesAjax(shiftDateForCall, detailsLocationId, populateEmployeesDropdown);

    POPUP.show(popup);
    popup.appendChild(employeeDropdown);

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(sendRequestBtn);
    btnWrap.appendChild(cancelBtn);
    popup.appendChild(btnWrap);

    employeeDropdown.classList.add('error');
    employeeDropdown.addEventListener('change', function () {
      var selectedOption = event.target.options[event.target.selectedIndex];
      employeeId = selectedOption.id;
      if (employeeId === '%') {
        employeeDropdown.classList.add('error');
      } else {
        employeeDropdown.classList.remove('error');
      }
      checkRequiredFields(sendRequestBtn);
    });
  }

  // Pending Open Shift Details
  // UPDATED FOR RESPONSIVE POPUP
  //---------------------------------------------------
  function renderPendingOpenShiftDetails(details) {
    var actioncenter = document.getElementById('actioncenter');

    var shiftDate = details.serviceDate.split(' ')[0];
    var startTime = details.startTime;
    var endTime = details.endTime;
    var consumers = details.consumerNames;
    var location = details.locationName;
    var shiftNotes = details.shiftNotes;
    var shiftType = details.shiftType;
    var workCode = `${details.workCode} - ${details.workCodeDescription}`;
    shiftDateForCall = shiftDate; //need this to pass back in order to get correct dropdown employees
    shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
    startTime = convertFromMilitary(startTime);
    endTime = convertFromMilitary(endTime);

    var popup = POPUP.build({
      classNames: 'pendingOpenShiftPopup',
      attributes: [{ key: 'shiftId', value: details.shiftId }],
    });
    wrap = document.createElement('div');
    wrap.innerHTML = `
          <div class="detailsHeading">
            <h2>Shift Details</h2>
            <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
          </div>
          
          <div class="detailsBody">
            <div class="location popupDetailsLine">
              <h4 class="label">Location:</h4>
              <p>${location}</p>
            </div>
            <hr>
            <div class="time popupDetailsLine">
              <h4 class="label">Time:</h4>
              <p>${startTime} - ${endTime}</p>
            </div>
            <hr>
            <div class="employee popupDetailsLine">
              <h4 class="label">Consumers:</h4>
              <p>${consumers}</p>
            </div>
            <hr>
            <div class="workCode popupDetailsLine">
              <h4 class="label">Work Code:</h4>
              <p>${workCode}</p>
            </div>
            <hr>
            <div class="shiftType popupDetailsLine">
              <h4 class="label">Shift Type:</h4>
              <p>${shiftType}</p>
            </div>
            <hr>
            <div class="shiftNotes popupDetailsLine">
              <h4 class="label">Notes:</h4>
              <p>${shiftNotes}</p>
            </div>
          </div>
      `;

    popup.appendChild(wrap);
    let cancelRequestBtn = button.build({
      id: 'cancelRequestBtn',
      attributes: [{ shiftId: details.shiftId }],
      text: 'Cancel Request',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        var shiftId = details.shiftId;
        schedulingAjax.cancelRequestOpenShiftSchedulingAjax(shiftId);
        POPUP.hide(popup);
        _scheduleView = 'mine';
        _currentView = 'week';
        init();
      },
    });

    if (details.requestedById === $.session.PeopleId) {
      let btnWrap = document.createElement('div');
      btnWrap.classList.add('popupBtnWrap');
      btnWrap.appendChild(cancelRequestBtn);
      popup.appendChild(btnWrap);
    }
    POPUP.show(popup);
  }

  // Pending Call Off Details
  // UPDATED FOR RESPONSIVE POPUP
  //---------------------------------------------------

  // UPDATED FOR RESPONSIVE POPUP
  function renderPendingCallOffDetails(details) {
    var actioncenter = document.getElementById('actioncenter');

    var shiftDate = details.serviceDate.split(' ')[0];
    var startTime = details.startTime;
    var endTime = details.endTime;
    var consumers = details.consumerNames;
    var location = details.locationName;
    var shiftNotes = details.shiftNotes;
    var shiftType = details.shiftType;
    var workCode = `${details.workCode} - ${details.workCodeDescription}`;
    shiftDateForCall = shiftDate;
    shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
    startTime = convertFromMilitary(startTime);
    endTime = convertFromMilitary(endTime);

    var popup = POPUP.build({
      classNames: 'pendingCallOffDetails',
      attributes: [{ key: 'shiftId', value: details.shiftId }],
    });
    var wrap = document.createElement('div');
    wrap.innerHTML = `
        <div class="detailsHeading">
          <h2>Shift Details</h2>
          <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
        </div>
        <div class="detailsBody">
          <div class="location popupDetailsLine">
            <h4 class="label">Location:  </h4>
            <p>${location}</p>
          </div>
          <hr>
          <div class="time popupDetailsLine">
            <h4 class="label">Time:  </h4>
            <p>${startTime} - ${endTime}</p>
          </div>
          <hr>
          <div class="employee popupDetailsLine">
            <h4 class="label">Consumers:  </h4>
            <p>${consumers}</p>
          </div>
          <hr>
          <div class="workCode popupDetailsLine">
            <h4 class="label">Work Code:  </h4>
            <p>${workCode}</p>
          </div>
          <hr>
          <div class="shiftType popupDetailsLine">
            <h4 class="label">Shift Type:  </h4>
            <p>${shiftType}</p>
          </div>
          <hr>
          <div class="shiftNotes popupDetailsLine">
            <h4 class="label">Notes:  </h4>
            <p>${shiftNotes}</p>
          </div>
        </div>
      `;
    popup.appendChild(wrap);

    POPUP.show(popup);
  }

  // Employee Shift Call Off
  // *the button shown inside shift details
  //---------------------------------------------------

  // UPDATED FOR RESPONSIVE DROPDOWN
  function populateReasonsDropdown(results) {
    results.sort((a, b) => (a.reasonName < b.reasonName ? -1 : 1));
    results = [{ reasonId: '%', reasonName: '' }, ...results];
    var dropdownData = results.map(r => {
      var id = r.reasonId;
      var value = r.reasonName;
      var text = r.reasonName;
      return {
        id,
        value,
        text,
      };
    });
    dropdown.populate('reasonDropdown', dropdownData);
    // reasonDropdown.addEventListener('change', () => {
    //   var selectedOption = event.target.options[event.target.selectedIndex];
    //   reasonId = selectedOption.id;
    // })
  }
  // UPDATED FOR RESPONSIVE DROPDOWN
  function populateEmployeesDropdown(results) {
    results = [{ employeeId: '%', employeeName: '' }, ...results];
    var employeeData = results.map(r => {
      var id = r.employeeId;
      var value = r.employeeName;
      var text = r.employeeName;
      return {
        id,
        value,
        text,
      };
    });

    dropdown.populate('employeeDropdown', employeeData);
    // employeeDropdown.addEventListener('change', () => {
    //   var sendRequestBtn = document.getElementById('sendReqBtn')
    //   var selectedOption = event.target.options[event.target.selectedIndex];
    //   employeeId = selectedOption.id;
    //   employeeId !== '%' ? sendRequestBtn.classList.remove('disabled'): sendRequestBtn.classList.add('disabled');
    // });
  }

  //UPDATED FOR RESPONSIVE CODE
  //CALL OFF POPUP
  function renderRequestOffPopup(eventId) {
    var actioncenter = document.getElementById('actioncenter');
    var calendar = document.getElementById('calendarContent');

    var popup = POPUP.build({
      classNames: 'request-off-popup',
      attributes: [{ key: 'shiftId', value: eventId }],
    });
    var reasonDropdown = dropdown.build({
      dropdownId: 'reasonDropdown',
      label: 'Reason',
      style: 'secondary',
      readOnly: 'false',
    });

    var notesInput = input.build({
      id: 'noteInput',
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
    });

    var employeeDropdown = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee To Notify',
      style: 'secondary',
    });

    var cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: function () {
        POPUP.hide(popup);
        reasonId = '';
        employeeId = '';
        note = '';
      },
    });

    var sendRequestBtn = button.build({
      id: 'sendReqBtn',
      text: 'Send Request',
      classNames: 'disabled',
      style: 'secondary',
      type: 'contained',
      icon: 'send',
      callback: function () {
        var note = document.getElementById('noteInput').value;
        var data = {
          token: $.session.Token,
          shiftId: eventId,
          personId: $.session.PeopleId,
          reasonId: reasonId,
          note: note,
          status: 'P',
          notifiedEmployeeId: employeeId,
        };

        schedulingAjax.saveSchedulingCallOffRequestAjax(data);
        POPUP.hide(popup);
        init();
      },
    });

    reasonDropdown.classList.add('error');
    notesInput.classList.add('error');
    employeeDropdown.classList.add('error');

    reasonDropdown.addEventListener('change', function () {
      var selectedOption = event.target.options[event.target.selectedIndex];
      reasonId = selectedOption.id;
      if (reasonId === '%') {
        reasonDropdown.classList.add('error');
      } else {
        reasonDropdown.classList.remove('error');
      }
      checkRequiredFields(sendRequestBtn);
    });

    notesInput.addEventListener('change', function () {
      if (notesInput.firstChild.value === '') {
        notesInput.classList.add('error');
      } else {
        notesInput.classList.remove('error');
      }
      checkRequiredFields(sendRequestBtn);
    });

    employeeDropdown.addEventListener('change', function () {
      var selectedOption = event.target.options[event.target.selectedIndex];
      employeeId = selectedOption.id;
      if (employeeId === '%') {
        employeeDropdown.classList.add('error');
      } else {
        employeeDropdown.classList.remove('error');
      }
      checkRequiredFields(sendRequestBtn);
    });

    let header = document.createElement('h2');
    header.classList.add('detailsHeading');
    header.innerHTML = 'Call Off Request';

    POPUP.show(popup);
    let btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(sendRequestBtn);
    btnWrap.appendChild(cancelBtn);

    popup.appendChild(header);
    popup.appendChild(reasonDropdown);
    popup.appendChild(notesInput);
    popup.appendChild(employeeDropdown);
    popup.appendChild(btnWrap);

    schedulingAjax.getCallOffDropdownEmployeesAjax(shiftDateForCall, detailsLocationId, populateEmployeesDropdown);
    schedulingAjax.getCallOffDropdownReasonsAjax(populateReasonsDropdown);
  }

  function checkRequiredFields(btn) {
    var hasErrors = [].slice.call(document.querySelectorAll('.error'));
    if (hasErrors.length === 0) {
      btn.classList.remove('disabled');
    } else {
      btn.classList.add('disabled');
    }
  }

  // ----------------------------------------------
  // MOVED TO schedulingRequestTimeOff.js v v v
  // Employee Request Time Off
  // *the button at the bottom of calendar
  // *allows employee to request multiple days off
  //---------------------------------------------------

  //========================================================
  // Schedules
  //========================================================
  function toggleView() {
    var btn = document.getElementById('scheduleViewBtn');
    var scheduleView = btn.getAttribute('data-view');
    var locationDropdown = document.getElementById('locationDropdown');

    if (scheduleView === 'all') {
      // set view
      _scheduleView = 'mine';
      _currentView = 'week';
      btn.setAttribute('data-view', 'mine');
      schedulingAjax.getSchedulesForSchedulingModuleAjax('%', $.session.PeopleId, populateSchedules);
      // remove location dropdown
      let scheduleViewWrap = document.querySelector('.scheduleViewWrap');
      var locationDropdown = document.getElementById('locationDropdown');
      // scheduleViewWrap.removeChild(locationDropdown.parentNode);
      locationDropdown.parentElement.classList.add('disabled');
      // locationDropdown.setAttribute('disabled', true);
    } else {
      // set view
      _scheduleView = 'all';
      _currentView = 'week';
      btn.setAttribute('data-view', 'all');
      // enable loaction dropdown
      locationDropdown.parentElement.classList.remove('disabled');
      if (defaultLocation === null) {
        let option = locationDropdown.options[locationDropdown.selectedIndex];
        var locationId = option.id;
        schedulingAjax.getSchedulesForSchedulingModuleAjax(locationId, '%', populateSchedules);
      } else {
        schedulingAjax.getSchedulesForSchedulingModuleAjax(defaultLocation, '%', populateSchedules);
        defaultLocation = null;
      }
    }
  }

  function renderScheduleViewBtn() {
    let btnWrap = document.createElement('div');
    btnWrap.classList.add('scheduleViewWrap');

    scheduleViewBtn = button.build({
      id: 'scheduleViewBtn',
      attributes: [{ 'data-view': 'mine' }],
      text: 'My Schedule', //Default view is My Schedule, Text shoul say All Schedules
      //because that is that you will view when clicked
      style: 'secondary',
      type: 'contained',
      toggle: true,
      toggleText: 'All Schedules',
      callback: function () {
        toggleView();
      },
    });
    if ($.session.hideAllScheduleButton) {
      return;
    } else {
      btnWrap.appendChild(scheduleViewBtn);
    }
    calContainer = document.querySelector('.calendarContainer');
    actioncenter.insertBefore(btnWrap, calContainer);
  }

  function populateShiftTotalHours() {
    if (isMobile && _currentView === 'day') return;
    function getDateRangeFromCalTitle() {
      var calTitle = document.getElementById('calTitle').innerHTML;

      var year = calTitle.split('-')[1].split(',')[1].trim();
      var dateString1 = calTitle.split('-')[0].trim() + `, ${year}`;
      var dateString2 = calTitle.split('-')[1].split(',')[0].trim() + `, ${year}`;
      var date1 = new Date(dateString1);
      var date2 = new Date(dateString2);
      // must return object with start and end properties
      return { start: date1, end: date2 };
    }

    function calcWeekTotalHours() {
      var dateRangeObj = getDateRangeFromCalTitle();

      var myShifts = _schedules.filter(schedule => {
        var serviceDate = schedule.serviceDate.split(' ')[0].split('/');
        var yyyy = serviceDate[2];
        var mm = parseInt(serviceDate[0]) - 1;
        var dd = serviceDate[1];
        serviceDate = new Date(yyyy, mm, dd);
        var withinInterval = isWithinInterval(serviceDate, dateRangeObj);
        return withinInterval;
      });

      var totalHours = 0;
      myShifts.forEach(shift => {
        var doesIdMatch = $.session.PeopleId === shift.personID;
        if (doesIdMatch) totalHours += parseFloat(shift.hoursScheduled);
      });

      return totalHours;
    }

    setTimeout(() => {
      var totalHours;
      if (_currentWeekHours !== null) {
        totalHours = _currentWeekHours;
      } else {
        totalHours = calcWeekTotalHours();
      }

      // Total Shifts at Bottom of Page
      //=========================================
      var wrap = document.querySelector('.total-hours-wrap');
      var wrapMarkup = `<p class="total-hours">Current Week Total Hours: ${parseFloat(totalHours).toFixed(2)}</p>`;

      if (wrap) {
        wrap.innerHTML = wrapMarkup;
      } else {
        var calendar = document.querySelector('.calendarFooter');
        wrap = document.createElement('div');
        wrap.classList.add('total-hours-wrap');
        wrap.innerHTML = wrapMarkup;
        calendar.appendChild(wrap);
      }

      // Individual Shift Total Hours
      //=========================================
      var shifts = Array.prototype.slice.call(document.querySelectorAll('.eventBody .hdr'));
      shifts.forEach(shift => {
        var time = shift.innerHTML;
        time = time.split('-');
        time[1] = time[1].trim() === '11:59 PM' ? '12:00 AM' : time[1];
        var hours = getTotalHours(time[0], time[1]);
        // sets total hours per shift
        shift.innerHTML += `(${parseFloat(hours).toFixed(2)})`;
      });

      _currentWeekHours = totalHours; // cache total hours
    }, 100);
  }

  function populateAppointments(results) {
    results.forEach((res, index) => {
      var serviceDate = getServiceDate(res);
      var startTime = `${serviceDate} ${res.timeScheduled}`;
      // This code is for microshit IE
      var dateArray = startTime.split(' ')[0].split('-');
      var timeArray = startTime.split(' ')[1].split(':');
      var yyyy = dateArray[0];
      var mm = dateArray[1] - 1;
      var dd = dateArray[2];
      var hour = timeArray[0];
      var min = timeArray[1];
      var sec = timeArray[2];
      var date = new Date(yyyy, mm, dd, hour, min, sec);
      // end Microshit IE code
      var endTime = addMinutes(date, 60);
      endTime = `${serviceDate} ${UTIL.leadingZero(endTime.getHours())}:${UTIL.leadingZero(endTime.getMinutes())}:00`;

      _scheduleArray[5].events.push({
        startTime: startTime,
        endTime: endTime,
        group: {
          groupId: 6,
        },
        eventId: res.medTrackingId,
        allDay: false,
        description: res.typeDescription,
        name: res.consumerName,
        eventName: res.takenToApptBy,
      });

      // Temp cache of appointments
      _appointments.push(res);
    });
  }

  function populateSchedules(results, locationId) {
    // clear own _schedules cache
    _schedules = [];
    // refigure dataObject to match web2cal
    _scheduleArray = [
      {
        name: 'My Shifts',
        groupId: 1,
        events: [],
        groups: null,
      },
      {
        name: 'All Shifts',
        groupId: 2,
        events: [],
        groups: null,
      },
      {
        name: 'Open Shifts',
        groupId: 3,
        events: [],
        groups: null,
      },
      {
        name: 'Pending Request Open Shifts',
        groupId: 4,
        events: [],
        groups: null,
      },
      {
        name: 'Pending Call Off Shifts',
        groupId: 5,
        events: [],
        groups: null,
      },
      {
        name: 'Appointments',
        groupId: 6,
        events: [],
        groups: null,
      },
    ];

    results.forEach(res => {
      // null/undefined checks
      var timeRegEx = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
      var isStartTimeValid = timeRegEx.test(res.startTime);
      var isEndTimeValid = timeRegEx.test(res.endTime);

      if (!isStartTimeValid || !isEndTimeValid || res.serviceDate === '') {
        return;
      }

      if (_scheduleView === 'mine' && $.session.isPSI) return;

      // Determine which scheduleArray group to push to
      var groupPos; // position in scheduleArray
      var groupId; // calendar group number

      if (res.personID === '' || res.personID === null) {
        if (_scheduleView === 'all') {
          if (
            (res.callOffStatus === '' && res.requestShiftStatus === '') ||
            (res.callOffStatus === '' && res.requestShiftStatus === 'D')
          ) {
            //MAT changed 6/7/2019. Ash check
            // open shift
            groupId = 3;
            groupPos = 2;
          } else if (res.requestShiftStatus === 'P') {
            // pending open shift
            groupId = 4;
            groupPos = 3;
          }
        }
      } else if (res.personID.toString() === $.session.PeopleId) {
        if (res.callOffStatus === 'P') {
          // pending call off
          groupId = 5;
          groupPos = 4;
        } else {
          // my shifts
          groupId = 1;
          groupPos = 0;
        }
      } else {
        // all shifts
        groupId = 2;
        groupPos = 1;
      }

      // Event Details
      //----------------------
      var serviceDate = getServiceDate(res);
      var startTime = `${serviceDate} ${res.startTime}`;
      var endTime = `${serviceDate} ${res.endTime}`;
      var description = `${res.lastName}, ${res.firstName}`;
      description = description.trim() === ',' ? '' : description;
      var eventName = _scheduleView === 'mine' ? res.locationName : `${res.lastName}, ${res.firstName} `;
      eventName = eventName.trim() === ',' ? '' : eventName;
      eventName = eventName === '' ? res.locationName : eventName;
      var name = _scheduleView === 'mine' ? res.locationName : res.lastName;
      name = name === '' ? res.locationName : name;

      if (typeof groupPos === 'number') {
        _scheduleArray[groupPos].events.push({
          startTime: startTime,
          endTime: endTime,
          group: {
            groupId: groupId,
          },
          eventId: res.shiftId,
          allDay: false,
          description: description,
          name: name,
          eventName: eventName,
        });
      }

      // Cache schedules
      _schedules.push(res);
    });

    if (_scheduleView === 'all') {
      schedulingAjax.getScheduleApptInformationAjax(locationId, function (results) {
        populateAppointments(results);
        drawCalendar();
      });
    } else {
      drawCalendar(_scheduleArray);
    }
  }

  //========================================================
  // Schedule Admin
  // MOVED to SchedulingApproveRequest.js
  //========================================================

  //========================================================
  // Calendar
  //========================================================
  let ical;
  function drawCalendar() {
    removeInnerHtml('calendarContainer');
    ical = new Web2Cal('calendarContainer', {
      loadEvents: function () {
        ical.render(_scheduleArray);
      },
      onNewEvent: onNewEvent,
      startOfWeek: _startDay,
      readOnly: true,
    });
    ical.build();

    removeStuffWeDontWant();
    renderCalFooter();
    setupCalendarEvents();
    if (_currentView === 'week' || _currentView === 'day') {
      populateShiftTotalHours();
    }
    if (!document.querySelector('.scheduleViewWrap')) {
      renderScheduleViewBtn();
      renderLocationDropdown();
      schedulingAjax.getLocationDropdownForSchedulingAjax(populateLocationDropdown);
    }
  }

  function onNewEvent(obj, groups, allday) {
    Web2Cal.defaultPlugins.onNewEvent(obj, groups, allday);
  }

  function rzCloseAddEvent() {
    ical.closeAddEvent();
  }

  function renderCalFooter() {
    var calendar = document.getElementById('calendarContent');
    var footer = document.createElement('div');
    footer.classList.add('calendarFooter');
    footer.innerHTML = `<div class="footer-btn-wrap"></div>`;
    calendar.appendChild(footer);
  }

  function setupDateHeadingEvent() {
    var dateHeadings = Array.prototype.slice.call(document.querySelectorAll('.calHeader'));

    dateHeadings.forEach(heading => {
      heading.addEventListener('click', event => {
        _currentView = 'day';
        populateShiftTotalHours();
      });
    });
  }

  function setupCalendarEvents() {
    var calendar = document.getElementById('calendarContent');
    var monthBtn = document.getElementById('calNavmonth');
    var weekBtn = document.getElementById('calNavweek');
    var dayBtn = document.getElementById('calNavday');
    var prevBtn = document.querySelector('.prevButton.navbtn');
    var nextBtn = document.querySelector('.nextButton.navbtn');

    calendar.addEventListener('click', event => {
      switch (event.target) {
        case monthBtn:
          _currentView = 'month';
          var a = document.querySelector('.calendarFooter');
          var b = a.querySelector('.total-hours-wrap');
          if (b) a.removeChild(b);
          break;
        case weekBtn:
          _currentView = 'week';
          setupDateHeadingEvent();
          populateShiftTotalHours();
          if ($.session.schedAllowCallOffRequests === 'Y' && $.session.schedulingUpdate) {
          }
          break;
        case dayBtn:
          _currentView = 'day';
          populateShiftTotalHours();
          if ($.session.schedAllowCallOffRequests === 'Y' && $.session.schedulingUpdate) {
          }
          break;
        case prevBtn:
        case nextBtn:
          if (_currentView === 'week' || _currentView === 'day') {
            populateShiftTotalHours();
            if (_scheduleView === 'mine' && $.session.schedAllowCallOffRequests === 'Y' && $.session.schedulingUpdate) {
            }
          }
          break;

        default:
          if (event.target.classList.contains('dayEvent')) {
            // My Shifts & All Shifts
            if (event.target.classList.contains('red') || event.target.classList.contains('blueTemplate')) {
              var eventId = parseInt(event.target.getAttribute('eventid'));
              var eventDetails = _schedules.filter(schedule => {
                return schedule.shiftId === eventId;
              });
              renderDetailsPopup(eventDetails, 'shift');
              return;
            }

            // Open Shifts
            if (event.target.classList.contains('brickTemplate')) {
              var eventId = parseInt(event.target.getAttribute('eventid'));
              var eventDetails = _schedules.filter(schedule => {
                return schedule.shiftId === eventId;
              });
              renderDetailsPopup(eventDetails, 'openShift');
              return;
            }

            // Pending Request Open Shifts
            if (event.target.classList.contains('tealTemplate')) {
              var eventId = parseInt(event.target.getAttribute('eventid'));
              var eventDetails = _schedules.filter(schedule => {
                return schedule.shiftId === eventId;
              });
              renderDetailsPopup(eventDetails, 'requestOff');
              return;
            }

            // Pending Call Off Shifts
            if (event.target.classList.contains('lightGreenTemplate')) {
              var eventId = parseInt(event.target.getAttribute('eventid'));
              var eventDetails = _schedules.filter(schedule => {
                return schedule.shiftId === eventId;
              });
              renderDetailsPopup(eventDetails, 'callOff');
              return;
            }

            // Appointments
            if (event.target.classList.contains('brownTemplate')) {
              var appointmentId = event.target.getAttribute('eventid');
              var appointmenttDetails = _appointments.filter(appointment => {
                return appointment.medTrackingId === appointmentId;
              });

              renderDetailsPopup(appointmenttDetails, 'appointment');
              return;
            }
          }
          break;
      }
    });
  }

  //========================================================
  // Overriding Web2Cal
  //========================================================
  function removeStuffWeDontWant() {
    var navWrap = document.getElementById('inner-wrap');
    var leftNav = document.getElementById('leftNav');
    navWrap.removeChild(leftNav);

    var inliner1 = document.querySelector('.inline.r1');
    var inliner2 = document.querySelector('.inline.r2');
    var calNav = document.getElementById('calNavData');
    var agendaBtn = document.querySelector('.liagenda');
    var workshiftBtn = document.querySelector('.liworkshift');
    var resourceBtn = document.querySelector('.liw2cview');
    var groupsBtn = document.querySelector('.topHideShowLink');
    var calicon = document.querySelector('.icon-calendar');
    calNav.removeChild(agendaBtn);
    calNav.removeChild(workshiftBtn);
    calNav.removeChild(resourceBtn);
    inliner1.removeChild(groupsBtn);
    inliner2.removeChild(calicon);

    var collapseWrap = document.querySelector('#topnavContainer .inline.r2');
    var collapse = document.querySelector('.collapse-left-nav.icon-arrow-left');
    collapseWrap.removeChild(collapse);
  }
  function init() {
    isMobile = document.body.dataset.mobile;

    if (isMobile) {
      _currentView = 'day';
    } else {
      _currentView = 'week';
    }
    _scheduleView = 'mine';
    PROGRESS.init();
    PROGRESS.SPINNER.init();
    PROGRESS.SPINNER.show('Loading Calendar');
    schedulingAjax.getDayOfWeekScheduleAjax(setStartDay);

    // default view is my schedules
    schedulingAjax.getSchedulesForSchedulingModuleAjax('%', $.session.PeopleId, function (results) {
      // PROGRESS.SPINNER.hide();
      DOM.clearActionCenter();
      actioncenter = document.getElementById('actioncenter');
      appendModuleContainer('calendarContainer');
      populateSchedules(results);

      // *** Only for All Schedule View
      // Once we have the schedule array built,
      // send it off to have appointments joined before
      // drawing the calendar

      //populateSchedules does this too...
      // if (_scheduleView === 'all') {
      //   schedulingAjax.getScheduleApptInformationAjax(locationId, function(results) {
      //     populateAppointments(results);
      //     drawCalendar();
      //   });
      // } else {
      //   drawCalendar();
      // }
    });
  }

  return {
    init,
  };
})();
