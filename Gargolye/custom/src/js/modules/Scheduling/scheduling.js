//* DO NOT FORGET
//  search out below comment symbols to make sure noting was forgotten
//?Q:
//TODO:
//* DO NOT FORGET

const EVENT_TYPES = {
  1: 'My Shifts', // blankish, red, blue, green, orange, purple, yellow
  2: 'Not My Shifts', // blankish, red, blue, green, orange, purple, yellow **only can see this group security key
  3: 'Open Shifts', // same color no matter who you are (WHITE)
  4: 'Pending Request Open Shifts', // blankish, red, blue, green, orange, purple, yellow
  5: 'Pending Call Off Shifts', // blankish, red, blue, green, orange, purple, yellow
  6: 'Appointments Shifts', // blankish, red, blue, green, orange, purple, yellow
};
const EVENT_COLORS = {
  red: '#BE0000',
  blue: '#5E9BCD',
  green: '#2CB167',
  orange: '#F37F2C',
  purple: '#8C7EE3',
  yellow: '#DED896',
  defaultMuted: '#CACACA',
};

const SchedulingEventDetails = (function () {
  //
  // TODO: add color dropdown to shift popups for EVENT_TYPES 4,5,6
  let locations;
  let shiftEmployees;
  let regions;

  let rosterPicker;

  var shiftDateForCall;
  var detailsLocationId;

  function checkRequiredFields(btn) {
    var hasErrors = [].slice.call(document.querySelectorAll('.error'));
    if (hasErrors.length === 0) {
      btn.classList.remove('disabled');
    } else {
      btn.classList.add('disabled');
    }
  }

  // Shift Call Off Request
  //-----------------------------------------------------------------------
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
  function renderRequestOffPopup(eventId) {
    const popup = POPUP.build({
      classNames: 'request-off-popup',
      attributes: [{ key: 'shiftId', value: eventId }],
    });

    const reasonDropdown = dropdown.build({
      dropdownId: 'reasonDropdown',
      label: 'Reason',
      style: 'secondary',
      readOnly: 'false',
    });

    const notesInput = input.build({
      id: 'noteInput',
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
    });

    const employeeDropdown = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee To Notify',
      style: 'secondary',
    });

    const cancelBtn = button.build({
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

    const sendRequestBtn = button.build({
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

    reasonDropdown.addEventListener('change', e => {
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

  // Shifts: EVENT_TYPES 1 & 2
  //-----------------------------------------------------------------------
  function populateRegionDropdown(regionDropdown) {
    const dropdownData = regions.map(r => ({
      value: r,
      text: r,
    }));

    dropdownData.unshift({
      value: '',
      text: '',
    });

    dropdown.populate(regionDropdown, dropdownData);
  }
  function showFilterEmployeePopup(onSaveCallbackFunc) {
    const opts = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    };

    const employeePopup = POPUP.build({
      id: 'filterEmployeePopup',
    });

    const regionDropdown = dropdown.build({
      dropdownId: 'regionDropdown',
      label: 'Region',
      style: 'secondary',
    });

    const savebtn = button.build({
      text: 'Update Employee List',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        POPUP.hide(popup);
        shiftEmployees = await schedulingAjax.getFilteredEmployeesForScheduling({
          locationId: '0',
          includeTrainedOnly: 0,
          region: 'ALL',
          maxWeeklyHours: -1,
          shiftStartTime: '00:00:00',
          shiftEndTime: '00:00:00',
          minTimeBetweenShifts: -1,
        });
        onSaveCallbackFunc();
      },
    });

    const employeeOptionsWrap = document.createElement('div');
    employeeOptionsWrap = `
      <p>Select employee options</p>

      <div class="employeeOptionsContainer">

        <div class="employeeOption">
          <input type="checkbox" name="location" />
          <div class="label">
            <p>Only include employees trained at the location</p>
          </div>
        </div>

        <div class="employeeOption">
          <input type="checkbox" name="hour" />
          <div class="label">
            <p>Exclude employees that would have more than</p>
            <input type="number" name="hours" />
            <p> hours for the work week</p>
          </div>
        </div>

        <div class="employeeOption">
          <input type="checkbox" name="minute" />
          <div class="label">
            <p>Exclude employees that have a shift less than</p>
            <input type="number" name="minutes" />
            <p>minutes before this one</p>
          </div>
        </div>

        <div class="employeeOption">
          <input type="checkbox" name="overlap" />
          <div class="label">
            <p>Exclude employees who have a day off that overlaps with this shift</p>
          </div>
        </div>

        <div class="employeeOption">
          <input type="checkbox" name="region" />
          <div class="label">
            <p>Only show employees from this region:</p>
          </div>
        </div>

      </div>
    `;

    employeeOptionsWrap.addEventListener('change', e => {
      console.log(e.target);
    });

    employeePopup.appendChild(employeeOptionsWrap);
    employeePopup.appendChild(regionDropdown);
    employeePopup.appendChild(savebtn);

    POPUP.show(employeePopup);

    populateRegionDropdown(regionDropdown);
  }
  function populateShiftLocationDropdown(locationDropdown, defaultValue = '') {
    const dropdownData = locations
      .map(d => ({
        value: d.locationId,
        text: d.locationName,
      }))
      .filter(l => !l.id);

    dropdownData.unshift({
      value: '%',
      text: 'All',
    });

    dropdown.populate(locationDropdown, dropdownData, defaultValue);
  }
  function populateShiftEmployeeDropdown(employeeDropdown, defaultValue = '') {
    let dropdownData = [
      {
        value: '%',
        text: 'All',
      },
      {
        value: $.session.UserId,
        text: `${$.session.Name}, ${$.session.LName}`,
      },
    ];

    employees.forEach(d =>
      dropdownData.push({
        id: 'todo',
        value: 'todo',
        text: 'todo',
      }),
    );

    dropdown.populate(employeeDropdown, dropdownData, defaultValue);
  }
  function populateShiftColorDropdown(colorDropdown, defaultValue = '') {
    const dropdownData = [
      { value: '%', text: '' },
      { value: 'red', text: 'red' },
      { value: 'blue', text: 'blue' },
      { value: 'green', text: 'green' },
      { value: 'orange', text: 'orange' },
      { value: 'purple', text: 'purple' },
      { value: 'yellow', text: 'yellow' },
    ];

    dropdown.populate(colorDropdown, dropdownData, defaultValue);
  }
  function buildCallOffButton(shiftId) {
    if (
      _scheduleView === 'mine' &&
      (_currentView === 'week' || _currentView === 'day') &&
      $.session.schedAllowCallOffRequests === 'Y' &&
      $.session.schedulingUpdate
    ) {
      const callOffBtn = button.build({
        text: 'Call Off',
        style: 'secondary',
        type: 'contained',
        callback: function () {
          POPUP.hide(shiftPopup);
          renderRequestOffPopup(shiftId);
        },
      });

      let btnWrap = document.createElement('div');
      btnWrap.classList.add('popupBtnWrap');
      btnWrap.appendChild(callOffBtn);

      return btnWrap;
    }

    return null;
  }
  function showAddIndividualPopup(onSelectCallback, selectedConsumers) {
    const addIndividualPopup = POPUP.build({
      id: 'shiftDetailPopup',
      hideX: true,
    });

    rosterPicker.renderTo(addIndividualPopup);
    rosterPicker.populate();

    if (selectedConsumers) {
      rosterPicker.setSelectedConsumers(selectedConsumers);
    }

    rosterPicker.onConsumerSelect(onSelectCallback);

    POPUP.show(addIndividualPopup);
  }
  function showShiftPopup(data) {
    const updateEmployeeDropdownData = newEmployeeData => {
      console.log(newEmployeeData);
      //TODO: When user clicks UPDATE EMPLOYEE LIST,
      //TODO: if there was an employee already selected in the dropdown before getting to
      //TODO: this pop-up and the selected employee no longer fits the criteria selected here,
      //TODO: clear the Employee dropdown when going back to the Add Shift/Edit Shift popup.
    };

    const isNew = data ? false : true;

    const shiftData = data
      ? {
          shiftId: data.shiftId,
          locationId: data.locationId,
          employeeId: data.personId,
          color: data.color,
          startTime: data.startTime,
          endTime: data.endTime,
          notifyEmployee: '',
          consumerNames: [],
          date: [data.serviceDate.split(' ')[0]],
        }
      : {
          shiftId: '',
          locationId: '',
          employeeId: '',
          color: '',
          startTime: '',
          endTime: '',
          notifyEmployee: '',
          consumerNames: [],
          date: [],
        };

    const shiftPopup = POPUP.build({
      id: 'shiftDetailPopup',
    });

    if (!isNew && !$.session.schedulingUpdate) {
      const shiftDate = shiftData.serviceDate.split(' ')[0];
      let startTime = shiftData.startTime;
      let endTime = shiftData.endTime;
      startTime = dates.convertFromMilitary(startTime);
      endTime = dates.convertFromMilitary(endTime);
      const consumers = shiftData.consumerNames;
      const location = shiftData.locationName;
      const shiftNotes = shiftData.shiftNotes;
      const workCode = `${shiftData.workCode} - ${shiftData.workCodeDescription}`;
      let shiftType = shiftData.shiftType;
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

      // popup details
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

      // add call off
      //?Q: do we want to show call off button if the do not have $.session.schedulingUpdate
      const callOffBtn = buildCallOffButton(data.shiftId);
      if (callOffBtn) {
        shiftPopup.appendChild(callOffBtn);
      }
    }

    const dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
      allowFutureDate: false,
    });

    const filterEmployeesBtn = button.build({
      text: 'Filter Employee List',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        showFilterEmployeePopup(updateEmployeeDropdownData);
      },
    });

    const locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Location',
      style: 'secondary',
      required: true,
    });
    const employeeDropdown = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee',
      style: 'secondary',
    });
    const colorDropdown = dropdown.build({
      dropdownId: 'colorDropdown',
      label: 'Color',
      style: 'secondary',
    });

    const startTimeInput = input.build({
      label: 'Start Time',
      type: 'time',
      style: 'secondary',
    });
    const endTimeInput = input.build({
      label: 'End Time',
      type: 'time',
      style: 'secondary',
    });

    const addIndividualBtn = button.build({
      text: '+ Add Individual',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(shiftPopup);
      },
    });
    const individualWrap = document.createElement('div');
    //TODO: loop over shiftData.consumerNames to build out cards
    // const rosterCard = new RosterCard({
    //   consumerId: consumer.id,
    //   firstName: consumer.FN,
    //   middleName: consumer.MN,
    //   lastName: consumer.LN,
    //   isInactive: inActive,
    // });
    rosterCard.renderTo(individualWrap);

    const notifyEmployee = input.buildCheckbox({
      text: 'Notify Employee',
      isChecked: false,
    });

    const buttonWrap = document.createElement('div');
    const savebtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        POPUP.hide(shiftPopup);
        const res = await schedulingAjax.saveOrUpdateShift({
          date: shiftData.date.join(','),
          consumerId: shiftData.join(','),
          startTime: shiftData.startTime,
          endTime: shiftData.endTime,
          color: shiftData.color,
          locationId: shiftData.locationId,
          notifyEmployee: shiftData.notifyEmployee,
        });
      },
    });
    const cancelbtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(shiftPopup);
      },
    });
    buttonWrap.appendChild(savebtn);
    buttonWrap.appendChild(cancelbtn);

    // Required Fields
    if (!shiftData.locationId) locationDropdown.classList.add('error');
    if (!shiftData.startTime) startTimeInput.classList.add('error');
    if (!shiftData.endTime) endTimeInput.classList.add('error');

    // Event Listener
    shiftPopup.addEventListener('change', e => {
      if (e.target === locationDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        shiftData.locationId = selectedOption.value;

        if (shiftData.locationId === '') {
          locationDropdown.classList.add('error');
          employeeDropdown.classList.add('disabled');
        } else {
          locationDropdown.classList.remove('error');
          employeeDropdown.classList.remove('disabled');
        }

        // Reset employee dropdown
        populateShiftEmployeeDropdown(employeeDropdown);
        shiftData.employeeId = '';
        employeeDropdown.classList.add('error');

        // Clear out consumers
        shiftData.consumerNames = [];
        rosterPicker.setSelectedConsumers([]);
        individualWrap.innerHTML = '';
      }
      if (e.target === employeeDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        shiftData.employeeId = selectedOption.value;

        if (shiftData.employeeId === '') {
          employeeDropdown.classList.add('error');
        } else {
          employeeDropdown.classList.remove('error');
        }
      }
      if (e.target === colorDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        shiftData.color = selectedOption.value;

        if (selectedOption.value === '%') shiftData.color = 'white';
      }
      if (e.target === startTimeInput) {
        //TODO: start time must be before end time
        console.log('start time', e.target.value);
        // if valid
        shiftData.startTime = e.target.value;
      }
      if (e.target === endTimeInput) {
        //TODO: end time must be after start time
        console.log('end time', e.target.value);
        // if valid
        shiftData.endTime = e.target.value;
      }
      if (e.target === notifyEmployee) {
      }

      if (e.target === addIndividualBtn) {
        showAddIndividualPopup(onSelectCallback);
      }
    });
    individualWrap.addEventListener('click', e => {
      //TODO: remove roster card from DOM
      //TODO: remove consumerID from consumerNames array
    });

    // Build Popup
    shiftPopup.appendChild(filterEmployeesBtn);
    shiftPopup.appendChild(locationDropdown);
    shiftPopup.appendChild(employeeDropdown);
    shiftPopup.appendChild(startTimeInput);
    shiftPopup.appendChild(endTimeInput);
    shiftPopup.appendChild(colorDropdown);
    shiftPopup.appendChild(individualWrap);
    shiftPopup.appendChild(addIndividualBtn);
    shiftPopup.appendChild(notifyEmployee);
    shiftPopup.appendChild(buttonWrap);

    if (!$.session.schedulingUpdate) {
      shiftPopup.remove(filterEmployeesBtn);
      shiftPopup.remove(colorDropdown);
      shiftPopup.remove(addIndividualBtn);
      shiftPopup.remove(notifyEmployee);
    }

    // add call off
    const callOffBtn = buildCallOffButton(data.shiftId);
    if (callOffBtn) {
      shiftPopup.appendChild(callOffBtn);
    }

    // Populate Dropdowns
    populateShiftLocationDropdown(locationDropdown, shiftData.locationId);
    populateShiftEmployeeDropdown(employeeDropdown, shiftData.employeeId);
    populateShiftColorDropdown(colorDropdown, shiftData.color);

    POPUP.show(shiftPopup);
  }

  // Open Shifts: EVENT_TYPE 3
  //-----------------------------------------------------------------------
  function displayOverlapPopup(existingShiftLocationName) {
    const overlapPopup = POPUP.build({
      classNames: 'sendRequestShiftPopup',
    });

    overlapWrap = document.createElement('div');
    overlapWrap.innerHTML = `
      <div class="detailsHeading">
        <h2>Requested Shift Overlap</h2>
        <p>This open shift overlaps with an existing shift you are scheduled to work at ${existingShiftLocationName}. You cannot request this open shift.</p>
      </div>
    `;

    const overlapCancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: function () {
        POPUP.hide(overlapPopup);
      },
    });

    overlapPopup.appendChild(overlapWrap);
    overlapPopup.appendChild(overlapCancelBtn);

    POPUP.show(overlapPopup);
  }
  function renderSendShiftRequestPopup(data) {
    const popup = POPUP.build({
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

    const employeeDropdown = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee To Notify',
      style: 'secondary',
    });
    employeeDropdown.classList.add('error');
    employeeDropdown.addEventListener('change', e => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      employeeId = selectedOption.id;

      if (employeeId === '%') {
        employeeDropdown.classList.add('error');
      } else {
        employeeDropdown.classList.remove('error');
      }

      checkRequiredFields(sendRequestBtn);
    });

    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: function () {
        POPUP.hide(popup);
      },
    });

    const sendRequestBtn = button.build({
      id: 'sendReqBtn',
      classNames: 'disabled',
      text: 'Send Request',
      style: 'secondary',
      type: 'contained',
      icon: 'send',
      callback: function () {
        data.notifiedEmployeeId = employeeId;
        schedulingAjax.saveOpenShiftRequestSchedulingAjax(data);
        POPUP.hide(popup);

        //TODO: ? reload the calendar ?
        //? I think we just want to remove this event from the calendar
        // _scheduleView = 'mine';
        // _currentView = 'week';
        // init();
      },
    });

    schedulingAjax.getCallOffDropdownEmployeesAjax(shiftDateForCall, detailsLocationId, populateEmployeesDropdown);

    popup.appendChild(employeeDropdown);

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(sendRequestBtn);
    btnWrap.appendChild(cancelBtn);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
  }
  function showOpenShiftPopup(data) {
    const shiftDate = data.serviceDate.split(' ')[0];
    let startTime = data.startTime;
    let endTime = data.endTime;
    startTime = dates.convertFromMilitary(startTime);
    endTime = dates.convertFromMilitary(endTime);
    const consumers = data.consumerNames;
    const location = data.locationName;
    const shiftNotes = data.shiftNotes;
    const workCode = `${data.workCode} - ${data.workCodeDescription}`;
    let shiftType = data.shiftType;
    shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
    shiftDateForCall = shiftDate;

    const popup = POPUP.build({
      classNames: 'openShiftDetails',
      attributes: [{ key: 'shiftId', value: data.shiftId }],
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

    if ($.session.schedRequestOpenShifts === 'N' || $.session.isPSI) {
    } else if (!$.session.schedulingUpdate || !$.session.schedulingView) {
    } else {
      const btnWrap = document.createElement('div');
      btnWrap.classList.add('popupBtnWrap');

      const requestShiftBtn = button.build({
        text: 'Request Shift',
        style: 'secondary',
        type: 'contained',
        callback: async function () {
          POPUP.hide(popup);

          const { getOverlapStatusforSelectedShiftResult: overlapWithExistingShift } =
            await schedulingAjax.getOverlapStatusforSelectedShiftAjax(data.shiftId, $.session.PeopleId);

          if (overlapWithExistingShift == 'NoOverLap') {
            renderSendShiftRequestPopup({
              token: $.session.Token,
              shiftId: data.shiftId,
              personId: $.session.PeopleId,
              status: 'P',
              notifiedEmployeeId: null,
            });
          } else {
            displayOverlapPopup(overlapWithExistingShift);
            return;
          }
        },
      });

      btnWrap.appendChild(requestShiftBtn);
      popup.appendChild(btnWrap);
    }

    POPUP.show(popup);
  }

  // Pending Open Shifts: EVENT_TYPE 4
  //-----------------------------------------------------------------------
  function showPendingOpenShiftsPopup(data) {
    const shiftDate = data.serviceDate.split(' ')[0];
    let startTime = data.startTime;
    let endTime = data.endTime;
    startTime = dates.convertFromMilitary(startTime);
    endTime = dates.convertFromMilitary(endTime);
    const consumers = data.consumerNames;
    const location = data.locationName;
    const shiftNotes = data.shiftNotes;
    const workCode = `${data.workCode} - ${data.workCodeDescription}`;
    let shiftType = data.shiftType;
    shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
    shiftDateForCall = shiftDate;

    const popup = POPUP.build({
      classNames: 'pendingOpenShiftPopup',
      attributes: [{ key: 'shiftId', value: data.shiftId }],
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

    if (data.requestedById === $.session.PeopleId) {
      const cancelRequestBtn = button.build({
        id: 'cancelRequestBtn',
        attributes: [{ shiftId: data.shiftId }],
        text: 'Cancel Request',
        style: 'secondary',
        type: 'contained',
        callback: function () {
          const shiftId = data.shiftId;
          schedulingAjax.cancelRequestOpenShiftSchedulingAjax(shiftId);
          POPUP.hide(popup);

          //TODO: ? reload the calendar ?
          //? I think we just want to remove this event from the calendar
          // _scheduleView = 'mine';
          // _currentView = 'week';
          // init();
        },
      });

      let btnWrap = document.createElement('div');
      btnWrap.classList.add('popupBtnWrap');
      btnWrap.appendChild(cancelRequestBtn);
      popup.appendChild(btnWrap);
    }

    POPUP.show(popup);
  }

  // Call Off Shifts: EVENT_TYPE 5
  //-----------------------------------------------------------------------
  function showPendingCallOffShiftsPopup(data) {
    const shiftDate = data.serviceDate.split(' ')[0];
    let startTime = data.startTime;
    let endTime = data.endTime;
    startTime = data.convertFromMilitary(startTime);
    endTime = data.convertFromMilitary(endTime);
    const consumers = data.consumerNames;
    const location = data.locationName;
    const shiftNotes = data.shiftNotes;
    const workCode = `${data.workCode} - ${data.workCodeDescription}`;
    let shiftType = data.shiftType;
    shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
    shiftDateForCall = shiftDate;

    const popup = POPUP.build({
      classNames: 'pendingCallOffDetails',
      attributes: [{ key: 'shiftId', value: details.shiftId }],
    });

    const wrap = document.createElement('div');
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

  // Appointments: EVENT_TYPE 6
  //-----------------------------------------------------------------------
  function showAppointmentPopup(data) {
    const date = data.dateScheduled.split(' ')[0];
    const time =
      data.timeScheduled !== ''
        ? dates.convertFromMilitary(data.timeScheduled)
        : dates.convertFromMilitary(data.dateScheduled.split(' ')[1]);
    const notes = data.notes;
    const consumer = data.consumerName;
    const provider = data.provider;
    const type = data.typeDescription;
    const reason = data.reason;

    const popup = POPUP.build({
      classNames: 'appointmentDetails',
      attributes: [{ key: 'appointmentId', value: data.medTrackingId }],
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

  function showEventDetailsPopup(eventTypeID, data) {
    debugger;
    if (eventTypeID === '1' || eventTypeID === '2') {
      showShiftPopup(data);
    }
    if (eventTypeID === '3') {
      showOpenShiftPopup(data);
    }
    if (eventTypeID === '4') {
      showPendingOpenShiftsPopup(data);
    }
    if (eventTypeID === '5') {
      showPendingCallOffShiftsPopup(data);
    }
    if (eventTypeID === '6') {
      showAppointmentPopup(data);
    }
  }

  async function preLoadData(defaultLocations) {
    locations = [...defaultLocations];

    shiftEmployees = await schedulingAjax.getFilteredEmployeesForScheduling({
      locationId: '0',
      includeTrainedOnly: 0,
      region: 'ALL',
      maxWeeklyHours: -1,
      shiftStartTime: '00:00:00',
      shiftEndTime: '00:00:00',
      minTimeBetweenShifts: -1,
    });

    regions = await schedulingAjax.getRegionDropdown();

    rosterPicker = new RosterPicker({
      allowMultiSelect: true,
      consumerRequired: false,
      selectionDate: undefined,
    });
    await rosterPicker.fetchConsumers();
  }

  return {
    preLoadData,
    showEventDetailsPopup,
  };
})();

const SchedulingCalendar = (function () {
  // DOM
  let ScheduleCalendar;
  let locationDropdownEle;
  let employeeDropdownEle;
  let shiftTypeDropdownEle;
  let shiftTypeNote;
  let pubUnpubButtonEle;
  let newShiftButtonEle;

  // DATA
  let schedules;
  let appointments;
  let calendarEvents;
  let calendarAppointments;
  let locations;
  let employees;

  // GLOBALS
  let currentCalView = 'month';
  let selectedLocationId;
  let selectedEmployeeId;
  let selectedShiftType;
  let viewOptionShifts = 'yes';

  // Calendar Events/Shifts/Appointments
  //-----------------------------------------------------------------------
  function getEventType(personID, callOffStatus, requestShiftStatus) {
    if (!personID) {
      if (!callOffStatus && (requestShiftStatus === 'D' || requestShiftStatus === '')) {
        return { type: EVENT_TYPES[3], id: 3 };
      }

      if (requestShiftStatus === 'P') {
        return { type: EVENT_TYPES[4], id: 4 };
      }
    }

    if (personID.toString() === $.session.PeopleId) {
      if (callOffStatus === 'P') {
        return { type: EVENT_TYPES[5], id: 5 };
      }

      return { type: EVENT_TYPES[1], id: 1 };
    }

    return { type: EVENT_TYPES[2], id: 2 };
  }
  function getEventColor(typeId, color) {
    if (typeId === 3) {
      return '#FFFFFF';
    }

    if (!color) {
      return '#CACACA';
    }

    return EVENT_COLORS[color];
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
  function getEventTotalTime(dirtyStart, dirtyEnd) {
    if (!dirtyStart || !dirtyEnd) return '';

    const [startHours, startMinutes, startSeconds] = dirtyStart.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = dirtyEnd.split(':').map(Number);

    const startTimeMilliseconds = (startHours * 3600 + startMinutes * 60 + startSeconds) * 1000;
    const endTimeMilliseconds = (endHours * 3600 + endMinutes * 60 + endSeconds) * 1000;

    let milliseconds = endTimeMilliseconds - startTimeMilliseconds;

    if (milliseconds < 0) {
      milliseconds += 24 * 3600 * 1000;
    }

    const hours = milliseconds / (1000 * 60 * 60);
    return hours === 0 ? '' : `(${hours})`;
  }
  async function getCalendarEvents(locationID = '%', peopleID = '%') {
    schedules = await schedulingAjax.getSchedulesForSchedulingModuleNew(locationID, peopleID);

    return schedules.map(sch => {
      const timeRegEx = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
      const isStartTimeValid = timeRegEx.test(sch.startTime);
      const isEndTimeValid = timeRegEx.test(sch.endTime);

      if (!isStartTimeValid || !isEndTimeValid || res.serviceDate === '') {
        return;
      }

      const { type, id } = getEventType(sch.personID, sch.callOffStatus, sch.requestShiftStatus);

      if (!type || (id === '2' && !$.session.schedulingSecurity)) {
        return;
      }

      const serviceDate = formatServiceDate(sch.serviceDate, sch.dateScheduled);
      const startTime = `${serviceDate} ${sch.startTime}`;
      const endTime = `${serviceDate} ${sch.endTime}`;
      const length = getEventTotalTime(sch.startTime, sch.endTime);
      const description = formatDescription(sch.firstName, sch.lastName);
      const color = getEventColor(id, sch.color);

      return {
        eventId: sch.shiftId,
        date: serviceDate,
        startTime: startTime,
        endTime: endTime,
        length: length,
        description: description,
        name: sch.lastName,
        type: {
          name: type,
          id: id,
        },
        locationId: sch.locationId,
        locationName: sch.locationName,
        publishedDate: sch.publishDate,
        color: color,
      };
    });
  }
  async function getCalendarAppointments() {
    appointments = await schedulingAjax.getScheduleApptInformationNew();

    return appointments.map(appt => {
      const serviceDate = formatServiceDate(appt.serviceDate, appt.dateScheduled);
      const startTime = `${serviceDate} ${appt.timeScheduled}`;
      const endTime = dates.addHours(startTime, 1);
      const color = getEventColor(id, appt.color);

      return {
        eventId: appt.medTrackingId,
        date: serviceDate,
        startTime: startTime,
        endTime: endTime,
        length: 1,
        description: appt.typeDescription,
        name: appt.consumerName,
        type: {
          name: EVENT_TYPES[6],
          id: 6,
        },
        locationId: appt.locationId,
        locationName: appt.locationName,
        publishedDate: appt.publishDate,
        color: color,
      };
    });
  }

  // Pub/Sub Popup
  //-----------------------------------------------------------------------
  function populateLocationPubUnpubDropdown() {
    const dropdownData = locations
      .map(d => ({
        value: d.locationId,
        text: d.locationName,
      }))
      .filter(l => !l.id);

    dropdownData.unshift({
      value: '%',
      text: 'All',
    });
    dropdownData.unshift({
      value: '',
      text: '',
    });

    selectedLocationId = dropdownData[0].value;

    dropdown.populate(locationDropdownEle, dropdownData, selectedLocationId);
  }
  function populateEmployeePubUnpubDropdown(dropdown) {
    let dropdownData = [
      {
        value: '',
        text: '',
      },
      {
        value: '%',
        text: 'All',
      },
      {
        value: $.session.UserId,
        text: `${$.session.Name}, ${$.session.LName}`,
      },
    ];

    if ($.session.schedulingUpdate) {
      employees.forEach(d =>
        dropdownData.push({
          value: d.Person_Id,
          text: d.EmployeeName,
        }),
      );
    }

    dropdown.populate(dropdown, dropdownData, '');
  }
  function showPubUnpubSchedulesPopup() {
    //! Values are required for all fields.
    const data = {
      locationId: '',
      employeeId: '',
      fromDate: '',
      toDate: '',
      notifyEmployee: '',
    };

    const pubUnpubPopup = POPUP.build({
      id: 'shiftDetailPopup',
    });

    const locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Location',
      style: 'secondary',
    });
    const employeeDropdown = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee',
      style: 'secondary',
    });
    const fromDateInput = input.build({
      id: 'fromDateInput',
      type: 'date',
      label: 'From Date',
      style: 'secondary',
      value: filterValues.activityStartDate,
    });
    const toDateInput = input.build({
      id: 'toDateInput',
      type: 'date',
      label: 'To Date',
      style: 'secondary',
      value: filterValues.activityEndDate,
    });
    const notifyEmployees = input.buildCheckbox({
      text: 'Notify Employees',
      isChecked: false,
    });

    locationDropdown.classList.add('error');
    employeeDropdown.classList.add('error');
    fromDateInput.classList.add('error');
    toDateInput.classList.add('error');

    // Event Listener
    pubUnpubPopup.addEventListener('change', e => {
      if (e.target === locationDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        data.locationId = selectedOption.value;
      }
      if (e.target === employeeDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        data.employeeId = selectedOption.value;
      }
      if (e.target === fromDateInput) {
        data.fromDate = e.target.value;
      }
      if (e.target === toDateInput) {
        data.toDate = e.target.value;
      }
      if (e.target === notifyEmployees) {
      }
    });

    const buttonWrap = document.createElement('div');
    const savebtn = button.build({
      text: 'UnpubPopuplish',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(pubUnpubPopup);
        schedulingAjax.publishUnpublishSchedules(data);
      },
    });
    const cancelbtn = button.build({
      text: 'Un-publish',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(pubUnpubPopup);
      },
    });
    buttonWrap.appendChild(savebtn);
    buttonWrap.appendChild(cancelbtn);

    pubUnpubPopup.appendChild(locationDropdown);
    pubUnpubPopup.appendChild(employeeDropdown);
    pubUnpubPopup.appendChild(fromDateInput);
    pubUnpubPopup.appendChild(toDateInput);
    pubUnpubPopup.appendChild(notifyEmployees);

    pubUnpubPopup.appendChild(buttonWrap);

    populateLocationPubUnpubDropdown(locationDropdown);
    populateEmployeePubUnpubDropdown(employeeDropdown);

    POPUP.show(pubUnpubPopup);
  }

  // MAIN DOM
  //-----------------------------------------------------------------------
  function populateLocationDropdown() {
    const dropdownData = locations
      .map(d => ({
        value: d.locationId,
        text: d.locationName,
      }))
      .filter(l => !l.id);

    dropdownData.unshift({
      value: '%',
      text: 'All',
    });

    //TODO: change back to dropdownData[1].value;
    selectedLocationId = dropdownData[0].value;

    dropdown.populate(locationDropdownEle, dropdownData, selectedLocationId);
  }
  function populateEmployeeDropdown() {
    let dropdownData = [
      {
        value: '%',
        text: 'All',
      },
      {
        value: $.session.UserId,
        text: `${$.session.Name}, ${$.session.LName}`,
      },
    ];

    if ($.session.schedulingUpdate) {
      employees.forEach(d =>
        dropdownData.push({
          value: d.Person_Id,
          text: d.EmployeeName,
        }),
      );
    }

    if ((viewOptionShifts = 'yes')) {
      dropdownData.unshift({
        id: '',
        value: 'none',
        text: '(none)',
      });
    }

    dropdown.populate(employeeDropdownEle, dropdownData, selectedEmployeeId);
  }
  function buildLocationDropdown() {
    const dropdownEle = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Location:',
      style: 'secondary',
    });

    dropdownEle.addEventListener('change', async event => {
      selectedLocationId = event.target.options[event.target.selectedIndex].value;

      calendarEvents = await getCalendarEvents(selectedLocationId, selectedEmployeeId);

      if (selectedLocationId === '%' && (currentCalView === 'week' || currentCalView === 'day')) {
        ScheduleCalendar.renderGroupedEvents(calendarEvents, {
          groupBy: 'locationId',
          groupName: 'locationName',
        });
      } else {
        ScheduleCalendar.renderEvents(calendarEvents);
      }
    });

    return dropdownEle;
  }
  function buildEmployeeDropdown() {
    const dropdownEle = dropdown.build({
      dropdownId: 'employeeDropdown',
      label: 'Employee:',
      style: 'secondary',
    });

    dropdownEle.addEventListener('change', async event => {
      selectedEmployeeId = event.target.options[event.target.selectedIndex].value;

      calendarEvents = await getCalendarEvents(selectedLocationId, selectedEmployeeId);

      if (selectedEmployeeId === '%' && (currentCalView === 'week' || currentCalView === 'day')) {
        ScheduleCalendar.renderGroupedEvents(calendarEvents, {
          groupBy: 'personId',
          groupName: 'name',
        });
      } else {
        ScheduleCalendar.renderEvents(calendarEvents);
      }
    });

    return dropdownEle;
  }
  function updateShiftTypeNote(shiftCount) {
    shiftTypeNote.textContent = `Un-Publishsed Shifts: ${shiftCount}`;

    if (shiftCount === 0) {
      shiftTypeNote.classList.add('error');
    } else {
      shiftTypeNote.classList.remove('error');
    }
  }
  function buildShiftTypeDropdown() {
    const shiftTypeWrap = document.createElement('div');
    shiftTypeWrap.classList.add('shiftTypeWrap');
    shiftTypeNote = document.createElement('p');
    shiftTypeNote.textContent = 'Un-Publishsed Shifts: 0';
    const dropdownEle = dropdown.build({
      dropdownId: 'shiftTypeDropdown',
      label: 'Show:',
      style: 'secondary',
    });

    dropdownEle.addEventListener('change', event => {
      selectedShiftType = event.target.options[event.target.selectedIndex].value;
    });

    selectedShiftType = '0';

    dropdown.populate(
      dropdownEle,
      [
        {
          value: '0',
          text: 'All Shifts',
        },
        {
          value: '1',
          text: 'Published Shifts',
        },
        {
          value: '2',
          text: 'Un-Publishsed Shifts',
        },
      ],
      selectedShiftType,
    );

    shiftTypeWrap.appendChild(dropdownEle);
    shiftTypeWrap.appendChild(shiftTypeNote);

    return shiftTypeWrap;
  }
  function buildPubUnpubSchedulesButton() {
    const buttonEle = button.build({
      text: 'Publish / Un-Publish Schedules',
      classNames: ['pubUnpubButton'],
      style: 'secondary',
      type: 'contained',
      callback: function () {
        showPubUnpubSchedulesPopup();
      },
    });

    return buttonEle;
  }
  function buildNewShiftButton() {
    const buttonEle = button.build({
      text: 'Add New Shift',
      classNames: ['newShiftButton'],
      style: 'secondary',
      type: 'contained',
      callback: function () {
        showShiftPopup();
      },
    });

    return buttonEle;
  }
  function buildOpenShiftViewToggleButton() {
    const radioContainer = document.createElement('div');
    radioContainer.classList.add('openShiftWrap');

    const radioTitle = document.createElement('p');
    radioTitle.innerText = 'Show Open Shifts';

    const radioDiv = document.createElement('div');
    const yesRadio = input.buildRadio({
      text: 'Yes',
      name: 'viewOpenShifts',
      isChecked: false,
    });
    const noRadio = input.buildRadio({
      text: 'No',
      name: 'viewOpenShifts',
      isChecked: true,
    });
    radioDiv.appendChild(yesRadio);
    radioDiv.appendChild(noRadio);

    radioDiv.addEventListener('change', async e => {
      console.log(e.target);

      viewOptionShifts = e.target.text.toLowerCase();

      if (viewOptionShifts === 'no' && selectedEmployeeId === 'none') {
        selectedEmployeeId = $.session.UserId;
        //TODO: re render events with new selectedEmployeeId
      }

      populateEmployeeDropdown();

      if (!$.session.schedulingSecurity) {
        const includeOpenShiftLocations = viewOptionShifts === 'yes' ? 'Y' : 'N';
        locations = await schedulingAjax.getLocationDropdownForScheduling(includeOpenShiftLocations);
        populateLocationDropdown();
      }
    });

    radioContainer.appendChild(radioTitle);
    radioContainer.appendChild(radioDiv);

    return radioContainer;
  }
  function build() {
    const scheduleWrap = document.createElement('div');
    scheduleWrap.classList.add('scheduleWrap');

    const scheduleNav = document.createElement('div');
    scheduleNav.classList.add('scheduleNav');

    const colLeft = document.createElement('div');
    colLeft.classList.add('colLeft');

    const colRight = document.createElement('div');
    colRight.classList.add('colRight');

    locationDropdownEle = buildLocationDropdown();
    employeeDropdownEle = buildEmployeeDropdown();
    openShiftViewToggleEle = buildOpenShiftViewToggleButton();
    pubUnpubButtonEle = buildPubUnpubSchedulesButton();
    shiftTypeDropdownEle = buildShiftTypeDropdown();
    newShiftButtonEle = buildNewShiftButton();

    colLeft.appendChild(locationDropdownEle);
    colLeft.appendChild(employeeDropdownEle);
    colLeft.appendChild(shiftTypeDropdownEle);

    colRight.appendChild(openShiftViewToggleEle);
    colRight.appendChild(newShiftButtonEle);
    colRight.appendChild(pubUnpubButtonEle);

    if (!$.session.schedulingSecurity) {
      colLeft.removeChild(shiftTypeDropdownEle);
      colRight.removeChild(newShiftButtonEle);
      colRight.removeChild(pubUnpubButtonEle);
      employeeDropdownEle.classList.add('disabled');
    }

    scheduleNav.appendChild(colLeft);
    scheduleNav.appendChild(colRight);
    scheduleWrap.appendChild(scheduleNav);
    scheduleWrap.appendChild(ScheduleCalendar.rootEle);

    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.appendChild(scheduleWrap);

    ScheduleCalendar.renderCalendar();
  }

  async function init() {
    //TODO: remove after dev testing
    console.clear();
    $.session.schedulingUpdate = true;
    $.session.schedulingView = true;
    $.session.schedAllowCallOffRequests = 'Y';
    $.session.schedRequestOpenShifts = 'Y';
    $.session.hideAllScheduleButton = false;
    $.session.schedulingSecurity = true; // this needs added from db
    $.session.PeopleId = '7357';
    $.session.UserId = 'joshk';
    //TODO: remove after dev testing

    selectedEmployeeId = $.session.UserId;

    ScheduleCalendar = new Calendar({
      defaultView: currentCalView,
      onEventClick({ id }) {
        const targetEvent = [...appointments, ...schedules].find(event => event.eventId === id);
        SchedulingEventDetails.showEventDetailsPopup(targetEvent);
      },
      onViewChange(newView) {
        currentCalView = newView;
      },
    });

    build();

    employees = await schedulingAjax.getEmployeesForScheduling($.session.UserId);
    populateEmployeeDropdown();

    //! if user does not have the security key for Scheduling, the values in the Location dropdown
    //! should only show locations where the logged in user is assigned to a shift.
    //! **Mike checks this in backend**
    locations = await schedulingAjax.getLocationDropdownForSchedulingNew('N');
    populateLocationDropdown();

    calendarEvents = await getCalendarEvents(selectedLocationId, selectedEmployeeId);
    calendarAppointments = await getCalendarAppointments();
    //ScheduleCalendar.renderEvents([...calendarEvents, ...calendarAppointments]);
    console.log('Schedules:', schedules);
    console.log('Events:', calendarEvents);
    console.log('Appointments:', calendarAppointments);

    // ScheduleCalendar.renderEvents(TEST_EVENTS);
    ScheduleCalendar.renderGroupedEvents(TEST_EVENTS, {
      groupBy: 'locationId',
      groupName: 'locationName',
    });
    // ScheduleCalendar.renderGroupedEvents(TEST_EVENTS, {
    //   groupBy: 'personId',
    //   groupName: 'name',
    // });

    SchedulingEventDetails.preLoadData(locations);
  }

  return {
    init,
  };
})();

const Scheduling = (function () {
  function loadSchedulingLanding() {
    const schedulingCalendarBtn = button.build({
      text: 'View Calendar',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-calendar');
        PROGRESS.SPINNER.show('Loading Schedule...');
        // SchedulingCalendar.init();
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

const TEST_EVENTS = [
  {
    color: '#FFFFFF',
    date: '3/2/2025',
    description: '',
    endTime: '3/2/2025 12:00:00',
    eventId: 101,
    length: '(2)',
    locationId: '1001',
    locationName: 'Main Hall',
    name: 'Morning Shift',
    personId: '501',
    publishedDate: '3/1/2025 10:00:00 AM',
    startTime: '3/2/2025 10:00:00',
    type: { name: 'Open Shifts', id: 3 },
  },
  {
    color: '#BE0000',
    date: '3/2/2025',
    description: '',
    endTime: '3/2/2025 18:00:00',
    eventId: 102,
    length: '(2)',
    locationId: '1002',
    locationName: 'Conference Room A',
    name: 'Afternoon Meeting',
    personId: '502',
    publishedDate: '3/1/2025 12:00:00 PM',
    startTime: '3/2/2025 16:00:00',
    type: { name: 'My Shifts', id: 1 },
  },
  {
    color: '#5E9BCD',
    date: '3/3/2025',
    description: '',
    endTime: '3/3/2025 14:00:00',
    eventId: 103,
    length: '(2)',
    locationId: '1003',
    locationName: 'Break Room',
    name: 'Lunch Break',
    personId: '503',
    publishedDate: '3/2/2025 09:30:00 AM',
    startTime: '3/3/2025 12:00:00',
    type: { name: 'Not My Shifts', id: 2 },
  },
  {
    color: '#FFFFFF',
    date: '3/3/2025',
    description: '',
    endTime: '3/3/2025 22:00:00',
    eventId: 104,
    length: '(2)',
    locationId: '1001',
    locationName: 'Main Hall',
    name: 'Evening Coverage',
    personId: '501',
    publishedDate: '3/2/2025 13:00:00 PM',
    startTime: '3/3/2025 20:00:00',
    type: { name: 'Open Shifts', id: 3 },
  },
  {
    color: '#2CB167',
    date: '3/4/2025',
    description: '',
    endTime: '3/4/2025 17:00:00',
    eventId: 105,
    length: '(2)',
    locationId: '1002',
    locationName: 'Conference Room A',
    name: 'Training Session',
    personId: '504',
    publishedDate: '3/3/2025 14:00:00 PM',
    startTime: '3/4/2025 15:00:00',
    type: { name: 'Pending Request Open Shifts', id: 4 },
  },
  {
    color: '#F37F2C',
    date: '3/4/2025',
    description: '',
    endTime: '3/4/2025 21:00:00',
    eventId: 106,
    length: '(2)',
    locationId: '1003',
    locationName: 'Break Room',
    name: 'Late Shift',
    personId: '505',
    publishedDate: '3/3/2025 16:30:00 PM',
    startTime: '3/4/2025 19:00:00',
    type: { name: 'Pending Call Off Shifts', id: 5 },
  },
  {
    color: '#8C7EE3',
    date: '3/5/2025',
    description: '',
    endTime: '3/5/2025 11:30:00',
    eventId: 107,
    length: '(2)',
    locationId: '1001',
    locationName: 'Main Hall',
    name: 'Team Briefing',
    personId: '501',
    publishedDate: '3/4/2025 07:00:00 AM',
    startTime: '3/5/2025 09:30:00',
    type: { name: 'Appointments Shifts', id: 6 },
  },
  {
    color: '#CACACA',
    date: '3/5/2025',
    description: '',
    endTime: '3/5/2025 18:00:00',
    eventId: 108,
    length: '(2)',
    locationId: '1002',
    locationName: 'Conference Room A',
    name: 'Project Review',
    personId: '502',
    publishedDate: '3/4/2025 10:00:00 AM',
    startTime: '3/5/2025 16:00:00',
    type: { name: 'My Shifts', id: 1 },
  },
  {
    color: '#DED896',
    date: '3/6/2025',
    description: '',
    endTime: '3/6/2025 20:00:00',
    eventId: 109,
    length: '(2)',
    locationId: '1003',
    locationName: 'Break Room',
    name: 'Shift Handover',
    personId: '503',
    publishedDate: '3/5/2025 12:00:00 PM',
    startTime: '3/6/2025 18:00:00',
    type: { name: 'Pending Request Open Shifts', id: 4 },
  },
  {
    color: '#FFFFFF',
    date: '3/6/2025',
    description: '',
    endTime: '3/6/2025 15:00:00',
    eventId: 110,
    length: '(2)',
    locationId: '1001',
    locationName: 'Main Hall',
    name: 'Guest Visit',
    personId: '504',
    publishedDate: '3/5/2025 14:30:00 PM',
    startTime: '3/6/2025 13:00:00',
    type: { name: 'Open Shifts', id: 3 },
  },
  {
    color: '#5E9BCD',
    date: '3/7/2025',
    description: '',
    endTime: '3/7/2025 17:00:00',
    eventId: 111,
    length: '(2)',
    locationId: '1002',
    locationName: 'Conference Room A',
    name: 'Weekly Planning',
    personId: '505',
    publishedDate: '3/6/2025 09:00:00 AM',
    startTime: '3/7/2025 15:00:00',
    type: { name: 'Not My Shifts', id: 2 },
  },
  {
    color: '#F37F2C',
    date: '3/7/2025',
    description: '',
    endTime: '3/7/2025 21:30:00',
    eventId: 112,
    length: '(2)',
    locationId: '1003',
    locationName: 'Break Room',
    name: 'Maintenance Shift',
    personId: '501',
    publishedDate: '3/6/2025 16:00:00 PM',
    startTime: '3/7/2025 19:30:00',
    type: { name: 'Pending Call Off Shifts', id: 5 },
  },
  {
    color: '#8C7EE3',
    date: '3/8/2025',
    description: '',
    endTime: '3/8/2025 10:00:00',
    eventId: 113,
    length: '(2)',
    locationId: '1001',
    locationName: 'Main Hall',
    name: 'Early Morning Prep',
    personId: '502',
    publishedDate: '3/7/2025 06:00:00 AM',
    startTime: '3/8/2025 08:00:00',
    type: { name: 'Appointments Shifts', id: 6 },
  },
];

// console.log(events);
