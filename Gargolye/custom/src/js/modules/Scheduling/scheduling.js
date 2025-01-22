const SchedulingShiftDetails = (function () {
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

  return {
    renderDetailsPopup,
  };
})();

const SchedulingCalendar = (function () {
  const currentView = 'mine';
  const calendarGroups = {
    1: 'My Shifts',
    2: 'All Shifts',
    3: 'Open Shifts',
    4: 'Pending Request Open Shifts',
    5: 'Pending Call Off Shifts',
    6: 'Appointments Shifts',
  };

  let scheduleCalEle;
  let locationDropdownEle;

  let schedules;
  let appointments;
  let calendarEvents;
  let calendarAppointments;
  let locations;
  let selectedLocationId;

  //TODO: put this somewhere => if (currentView === 'mine' && $.session.isPSI) return;

  // Header
  function populateLocationDropdown() {
    const dropdownData = locations.map(d => ({
      id: d.locationId,
      value: d.locationName,
      text: d.locationName,
    }));

    selectedLocationId = dropdownData[0].id;

    dropdown.populate(locationDropdownEle, dropdownData);
  }
  function buildLocationDropdown() {
    const locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Locations:',
      style: 'secondary',
    });

    locationDropdown.addEventListener('change', event => {
      selectedLocationId = event.target.options[event.target.selectedIndex].id;
    });

    return locationDropdown;
  }
  function buildViewButton() {
    $.session.hideAllScheduleButton;
    return button.build({
      id: 'scheduleViewBtn',
      text: 'My Schedule',
      style: 'secondary',
      type: 'contained',
      toggle: true,
      toggleText: 'All Schedules',
      callback: async e => {
        console.log(e);

        if (currentView === 'mine') {
          currentView === 'all';
          await getCalendarEvents(selectedLocationId, '%');
          locationDropdownEle.classList.remove('disabled');
          return;
        }

        if (currentView === 'all') {
          currentView === 'mine';
          await getCalendarEvents('%', $.session.PeopleId);
          locationDropdownEle.classList.add('disabled');
          return;
        }
      },
    });
  }

  // Calendar Events
  function getEventGroup(personID, callOffStatus, requestShiftStatus) {
    if (!personID && currentView === 'all') {
      if (!callOffStatus && (requestShiftStatus === 'D' || requestShiftStatus === '')) {
        return { group: calendarGroups[3], id: 3 };
      }

      if (requestShiftStatus === 'P') {
        return { group: calendarGroups[4], id: 4 };
      }
    }

    if (personID.toString() === $.session.PeopleId) {
      if (callOffStatus === 'P') {
        return { group: calendarGroups[5], id: 5 };
      }

      return { group: calendarGroups[1], id: 1 };
    }

    return { group: calendarGroups[2], id: 2 };
  }
  function formatServiceDate(serviceDate, dateScheduled) {
    let date = serviceDate ? serviceDate : dateScheduled;
    return date.split(' ')[0];
    // I will let calendar handle formating
    date = date.split(' ')[0].split('/');
    const serviceYear = date[2];
    const serviceMonth = UTIL.leadingZero(date[0]);
    const serviceDay = UTIL.leadingZero(date[1]);

    return `${serviceYear}-${serviceMonth}-${serviceDay}`;
  }
  function formatDescription(firstName, lastName) {
    if (!lastName || !firstName) return '';

    return `${lastName}, ${firstName}`;
  }
  function formatEventName(firstName, lastName, locationName) {
    if (currentView === 'mine' || !firstName || !lastName) {
      return locationName;
    }

    return `${lastName}, ${firstName}`;
  }
  async function getCalendarEvents(locationID = '%', peopleID = '%') {
    schedules = await schedulingAjax.getSchedulesForSchedulingModuleAjax(locationID, peopleID);

    return schedules.map(sch => {
      const timeRegEx = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
      const isStartTimeValid = timeRegEx.test(sch.startTime);
      const isEndTimeValid = timeRegEx.test(sch.endTime);

      if (!isStartTimeValid || !isEndTimeValid || res.serviceDate === '') {
        return;
      }

      const { group, id } = getEventGroup(sch.personID, sch.callOffStatus, sch.requestShiftStatus);

      if (!group) return;

      const serviceDate = formatServiceDate(sch.serviceDate, sch.dateScheduled);
      const startTime = `${serviceDate} ${sch.startTime}`;
      const endTime = `${serviceDate} ${sch.endTime}`;
      const description = formatDescription(sch.firstName, sch.lastName);
      const eventName = formatEventName(sch.firstName, sch.lastName, sch.locationName);
      const name = currentView === 'mine' || !sch.lastName ? sch.locationName : sch.lastName;

      return {
        startTime: startTime,
        endTime: endTime,
        date: serviceDate,
        group: {
          name: group,
          id: id,
        },
        eventId: sch.shiftId,
        allDay: false,
        description: description,
        name: name,
        eventName: eventName,
      };
    });
  }
  async function getCalendarAppointments() {
    appointments = await schedulingAjax.getScheduleApptInformationAjax();

    return appointments.map(appt => {
      const serviceDate = formatServiceDate(appt.serviceDate, appt.dateScheduled);
      const startTime = `${serviceDate} ${appt.timeScheduled}`;
      const endTime = ''; //TODO: endTime is 1 hour past startTime

      return {
        startTime: startTime,
        endTime: endTime,
        date: serviceDate,
        group: {
          name: calendarGroups[6],
          id: 6,
        },
        eventId: appt.medTrackingId,
        allDay: false,
        description: appt.typeDescription,
        name: appt.consumerName,
        eventName: appt.takenToApptBy,
      };
    });
  }

  function build() {
    const scheduleWrap = document.createElement('div');
    scheduleWrap.classList.add('scheduleWrap');

    const scheduleNav = document.createElement('div');
    scheduleNav.classList.add('scheduleNav');

    locationDropdownEle = buildLocationDropdown();
    const viewButton = buildViewButton();

    scheduleNav.appendChild(viewButton);
    scheduleNav.appendChild(locationDropdownEle);

    scheduleWrap.appendChild(scheduleNav);
    scheduleWrap.appendChild(scheduleCalEle);

    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.appendChild(scheduleWrap);
  }

  async function init() {
    scheduleCalEle = Calendar.init();
    build();

    locations = await schedulingAjax.getLocationDropdownForSchedulingAjax();
    populateLocationDropdown();

    calendarEvents = await getCalendarEvents('%', $.session.PeopleId);
    calendarAppointments = await getCalendarAppointments();
  }

  return {
    init,
  };
})();

const Scheduling = (function () {
  $.session.schedulingUpdate = true;
  $.session.schedulingView = true;
  $.session.schedAllowCallOffRequests = 'Y';
  $.session.schedRequestOpenShifts = 'Y';
  $.session.hideAllScheduleButton = false;

  function loadSchedulingLanding() {
    const schedulingCalendarBtn = button.build({
      text: 'View Calendar',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-calendar');
        PROGRESS.SPINNER.show('Loading Schedule...');
        SchedulingCalendar.init();
      },
    });
    const schedulingCalendarWeb2CalBtn = button.build({
      text: 'View Calendar - Web2Cal',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-calendar');
        PROGRESS.SPINNER.show('Loading Schedule...');
        schedulingCalendar.init();
      },
    });
    const schedulingRequestTimeOffBtn = button.build({
      text: 'Request Time Off',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-requestTimeOff');
        PROGRESS.SPINNER.show('Loading...');
        schedulingRequestTimeOff.init();
      },
    });
    const schedulingApproveRequestBtn = button.build({
      text: 'Approve Requests',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-approveRequests');
        PROGRESS.SPINNER.show('Loading...');
        schedulingApproveRequest.init();
      },
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('landingBtnWrap');

    btnWrap.appendChild(schedulingCalendarBtn);
    btnWrap.appendChild(schedulingCalendarWeb2CalBtn);

    if ($.session.schedulingView === false && $.session.schedulingUpdate === true) {
      btnWrap.appendChild(schedulingRequestTimeOffBtn);
      btnWrap.appendChild(schedulingApproveRequestBtn);
    }

    DOM.ACTIONCENTER.appendChild(btnWrap);
  }

  function init() {
    if (!$.session.schedulingUpdate) {
      setActiveModuleSectionAttribute('scheduling-calendar');
      SchedulingCalendar.init();
    } else {
      loadSchedulingLanding();
    }
  }

  return {
    init,
  };
})();
