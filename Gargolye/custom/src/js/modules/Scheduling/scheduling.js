//!: check filter function on newEvents when save/updating a shift from popups

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
  let rosterCache;

  // GLOBALS
  let currentCalView = 'month';
  let selectedLocationId;
  let selectedEmployeeId;
  let selectedShiftType;
  let viewOptionShifts = 'yes';

  // Shift Popups
  let shiftEmployees;
  let regions;
  var shiftDateForCall;
  var detailsLocationId;

  function resetModule() {
    // DOM
    ScheduleCalendar = undefined;
    locationDropdownEle = undefined;
    employeeDropdownEle = undefined;
    shiftTypeDropdownEle = undefined;
    shiftTypeNote = undefined;
    pubUnpubButtonEle = undefined;
    newShiftButtonEle = undefined;

    // DATA
    schedules = undefined;
    appointments = undefined;
    calendarEvents = undefined;
    calendarAppointments = undefined;
    locations = undefined;
    employees = undefined;
    rosterCache = undefined;

    // GLOBALS
    currentCalView = 'month';
    selectedLocationId = undefined;
    selectedEmployeeId = undefined;
    selectedShiftType = undefined;
    viewOptionShifts = 'yes';

    // Shift Popups
    shiftEmployees = undefined;
    regions = undefined;
    shiftDateForCall = undefined;
    detailsLocationId = undefined;
  }

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
  function populateCallOffReasonsDropdown(results) {
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
  function populateCallOffEmployeesDropdown(results) {
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
  function renderRequestOffPopup(eventId, cb) {
    let reasonId, note, employeeId;

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
        schedulingAjax.saveSchedulingCallOffRequestAjax({
          token: $.session.Token,
          shiftId: eventId,
          personId: $.session.PeopleId,
          reasonId: reasonId,
          note: note,
          status: 'P',
          notifiedEmployeeId: employeeId,
        });

        POPUP.hide(popup);

        cb();
      },
    });

    reasonDropdown.classList.add('error');
    notesInput.classList.add('error');
    employeeDropdown.classList.add('error');

    reasonDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      reasonId = selectedOption.id;

      if (reasonId === '%') {
        reasonDropdown.classList.add('error');
      } else {
        reasonDropdown.classList.remove('error');
      }
      checkRequiredFields(sendRequestBtn);
    });

    notesInput.addEventListener('change', e => {
      note = e.target.value;

      if (e.target.value === '') {
        notesInput.classList.add('error');
      } else {
        notesInput.classList.remove('error');
      }

      checkRequiredFields(sendRequestBtn);
    });

    employeeDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
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

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(sendRequestBtn);
    btnWrap.appendChild(cancelBtn);

    popup.appendChild(header);
    popup.appendChild(reasonDropdown);
    popup.appendChild(notesInput);
    popup.appendChild(employeeDropdown);
    popup.appendChild(btnWrap);

    POPUP.show(popup);

    schedulingAjax.getCallOffDropdownEmployeesAjax(
      shiftDateForCall,
      detailsLocationId,
      populateCallOffEmployeesDropdown,
    );
    schedulingAjax.getCallOffDropdownReasonsAjax(populateCallOffReasonsDropdown);
  }

  // Shifts
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
  function renderSendShiftRequestPopup(data, cb) {
    let employeeId;

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
      callback: async function () {
        data.notifiedEmployeeId = employeeId;
        await schedulingAjax.saveOpenShiftRequestSchedulingAjax(data);
        POPUP.hide(popup);

        cb();
      },
    });

    schedulingAjax.getCallOffDropdownEmployeesAjax(
      shiftDateForCall,
      detailsLocationId,
      populateCallOffEmployeesDropdown,
    );

    popup.appendChild(employeeDropdown);

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(sendRequestBtn);
    btnWrap.appendChild(cancelBtn);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
  }
  //
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
      hideX: true,
    });

    employeePopup.innerHTML = `
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
          <div class="label nestedInput">
            <p>Exclude employees that would have more than</p>
            <input type="number" name="hours" />
            <p> hours for the work week</p>
          </div>
        </div>

        <div class="employeeOption">
          <input type="checkbox" name="minute" />
          <div class="label nestedInput">
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
        employeePopup.remove();

        shiftEmployees = await schedulingAjax.getFilteredEmployeesForScheduling({
          locationId: '0',
          includeTrainedOnly: 0,
          region: 'ALL',
          maxWeeklyHours: -1,
          shiftStartTime: '00:00:00',
          shiftEndTime: '00:00:00',
          minTimeBetweenShifts: -1,
        });

        onSaveCallbackFunc(shiftEmployees);
      },
    });
    const cancelbtn = button.build({
      text: 'cancel',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        employeePopup.remove();
        onSaveCallbackFunc();
      },
    });

    employeePopup.addEventListener('change', e => {
      console.log('employeeOptions', e.target, e.target.checked);
    });

    const buttonWrap = document.createElement('div');
    buttonWrap.classList.add('btnWrap');
    buttonWrap.appendChild(savebtn);
    buttonWrap.appendChild(cancelbtn);

    employeePopup.appendChild(regionDropdown);
    employeePopup.appendChild(buttonWrap);

    populateRegionDropdown(regionDropdown);

    POPUP.show(employeePopup);
  }
  //
  async function getConsumersForIndivualPop(selectedDate) {
    try {
      const todaysDate = selectedDate == undefined ? dates.getTodaysDateObj() : new Date(selectedDate);
      todaysDate.setHours(0, 0, 0, 0);
      const filterDate = dates.formatISO(todaysDate, { representation: 'date' });

      if (rosterCache[filterDate]) {
        return rosterCache[filterDate];
      }

      const daysBackDate = dates.subDays(todaysDate, $.session.defaultProgressNoteReviewDays);
      const data = await _UTIL.fetchData('getConsumersByGroupJSON', {
        groupCode: 'All',
        retrieveId: '0',
        serviceDate: filterDate,
        daysBackDate: dates.formatISO(daysBackDate, { representation: 'date' }),
        isActive: 'No',
      });

      const consumers = data.getConsumersByGroupJSONResult.reduce((acc, cv) => {
        acc[cv.id] = cv;
        return acc;
      }, {});

      rosterCache[filterDate] = Object.values(consumers).sort((a, b) => {
        if (a.LN < b.LN) return -1;
        if (a.LN > b.LN) return 1;

        if (a.FN < b.FN) return -1;
        if (a.FN > b.FN) return 1;

        return 0;
      });

      return rosterCache[filterDate];
    } catch (error) {
      console.log('uh oh something went horribly wrong :(', error.message);
    }
  }
  async function showAddIndividualPopup(onSelectCallback, selectedConsumers, rosterDate) {
    let newSelectedConsumers = [...selectedConsumers];

    const addIndividualPopup = POPUP.build({
      id: 'addIndividualPopup',
      hideX: true,
    });

    const consumerWrap = document.createElement('div');
    consumerWrap.classList.add('rosterCardsWrap');

    const savebtn = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        addIndividualPopup.remove();
        onSelectCallback(newSelectedConsumers);
      },
    });
    const cancelbtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        addIndividualPopup.remove();
      },
    });

    const buttonWrap = document.createElement('div');
    buttonWrap.classList.add('btnWrap');
    buttonWrap.appendChild(savebtn);
    buttonWrap.appendChild(cancelbtn);

    addIndividualPopup.appendChild(consumerWrap);
    addIndividualPopup.appendChild(buttonWrap);

    POPUP.show(addIndividualPopup);

    const spinner = PROGRESS.SPINNER.get('Gathering Individuals...');
    consumerWrap.appendChild(spinner);

    const consumersRes = await getConsumersForIndivualPop(rosterDate, newSelectedConsumers);
    consumersRes.forEach(c => {
      const consumerString = `${c.FN} ${c.LN}|${c.id}`;

      const gridAnimationWrapper = document.createElement('div');
      gridAnimationWrapper.classList.add('rosterCardWrap');

      const rosterCard = new RosterCard({
        consumerId: c.id,
        firstName: c.FN,
        middleName: c.MN,
        lastName: c.LN,
      });
      rosterCard.rootElement.id = consumerString;
      rosterCard.renderTo(gridAnimationWrapper);
      consumerWrap.appendChild(gridAnimationWrapper);

      if (newSelectedConsumers.includes(consumerString)) {
        gridAnimationWrapper.classList.add('selected');
      }

      gridAnimationWrapper.addEventListener('click', () => {
        if (gridAnimationWrapper.classList.contains('selected')) {
          newSelectedConsumers = newSelectedConsumers.filter(c => c === consumerString);
          gridAnimationWrapper.classList.remove('selected');
        } else {
          newSelectedConsumers.push(consumerString);
          gridAnimationWrapper.classList.add('selected');
        }
      });
    });

    spinner.remove();
  }
  //
  class WeekViewDatePicker {
    constructor(opts) {
      this.onDateChange = opts.onDateChange;

      // Dates
      this.selectedDates = [...opts.selectedDates];
      this.weekStart = dates.startOfWeek(opts.defaultDate);
      this.weekEnd = dates.endOfWeek(opts.defaultDate);
      this.daysToRender = dates.eachDayOfInterval({
        start: this.weekStart,
        end: this.weekEnd,
      });

      // DOM
      this.rootEle = document.createElement('div');
      this.weekWrapEle = document.createElement('div');
      this.prevWeekNavBtn = document.createElement('div');
      this.nextWeekNavBtn = document.createElement('div');

      this.build();
      this.render();
    }

    handleClick(e) {
      if (e.target === this.prevWeekNavBtn) {
        this.weekStart = dates.subWeeks(this.weekStart, 1);
        this.weekEnd = dates.subWeeks(this.weekEnd, 1);
        this.daysToRender = dates.eachDayOfInterval({
          start: this.weekStart,
          end: this.weekEnd,
        });

        this.render();
        return;
      }
      if (e.target === this.prevWeekNavBtn) {
        this.weekStart = dates.addWeeks(this.weekStart, 1);
        this.weekEnd = dates.addWeeks(this.weekEnd, 1);
        this.daysToRender = dates.eachDayOfInterval({
          start: this.weekStart,
          end: this.weekEnd,
        });

        this.render();
        return;
      }
      if (e.target.dataset.target === 'date') {
        if (e.target.classList.contains('selected')) {
          this.selectedDates = this.selectedDates.filter(d => d !== e.target.dataset.date);
          e.target.classList.remove('selected');
        } else {
          this.selectedDates.push(e.target.dataset.date);
          e.target.classList.add('selected');
        }

        this.onDateChange(
          this.selectedDates.map(dirtyDate => {
            const returnDate = new Date(dirtyDate);
            returnDate.setHours(0, 0, 0, 0);
            const dd = returnDate.getDate();
            const mm = returnDate.getMonth() + 1;
            const yyyy = returnDate.getFullYear();
            return `${yyyy}-${UTIL.leadingZero(mm)}-${UTIL.leadingZero(dd)}`;
          }),
        );

        return;
      }
    }

    render() {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let index = 0; index < this.daysToRender.length; index++) {
        const dateWrapEle = document.createElement('div');
        dateWrapEle.classList.add('dateWrap');
        dateWrapEle.setAttribute('data-target', 'date');

        const dateString = this.daysToRender[index].toDateString();
        dateWrapEle.setAttribute('data-date', dateString);

        const month = this.daysToRender[index].getMonth() + 1;
        const day = this.daysToRender[index].getDate();
        const year = this.daysToRender[index].getFullYear();

        if (this.selectedDates.includes(`${month}/${day}/${year}`)) {
          dateWrapEle.classList.add('selected');
        }

        const nameEle = document.createElement('div');
        nameEle.textContent = `${dayNames[index]}`;

        const dateEle = document.createElement('div');
        dateEle.textContent = `${month}/${day}`;

        dateWrapEle.appendChild(nameEle);
        dateWrapEle.appendChild(dateEle);

        this.weekWrapEle.appendChild(dateWrapEle);
      }
    }

    build() {
      this.rootEle.classList.add('weekViewDatePicker');
      this.weekWrapEle.classList.add('weekWrap');
      this.prevWeekNavBtn.classList.add('prevWeekBtn');
      this.nextWeekNavBtn.classList.add('nextWeekBtn');

      this.prevWeekNavBtn.appendChild(Icon.getIcon('arrowLeft'));
      this.nextWeekNavBtn.appendChild(Icon.getIcon('arrowRight'));

      this.rootEle.appendChild(this.prevWeekNavBtn);
      this.rootEle.appendChild(this.weekWrapEle);
      this.rootEle.appendChild(this.nextWeekNavBtn);

      this.rootEle.addEventListener('click', this.handleClick.bind(this));
    }
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
    dropdownData.unshift({
      value: '',
      text: '',
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
        value: $.session.PeopleId,
        text: `${$.session.Name}, ${$.session.LName}`,
      },
    ];

    shiftEmployees.forEach(d =>
      dropdownData.push({
        value: d.Person_Id,
        text: d.EmployeeName,
      }),
    );

    dropdown.populate(employeeDropdown, dropdownData, defaultValue);
  }
  function populateShiftColorDropdown(colorDropdown, defaultValue = '') {
    const dropdownData = [
      { value: '', text: '' }, // default gray
      { value: 'red', text: 'red' },
      { value: 'blue', text: 'blue' },
      { value: 'green', text: 'green' },
      { value: 'orange', text: 'orange' },
      { value: 'purple', text: 'purple' },
      { value: 'yellow', text: 'yellow' },
    ];

    dropdown.populate(colorDropdown, dropdownData, defaultValue);
  }

  function showShiftPopup(data, eventTypeID, isCopy) {
    const checkRequiredFieldsShiftPopup = () => {
      let errors = [...shiftPopup.querySelectorAll('.error')];

      if (errors.length > 0 || shiftData.date.length === 0) {
        savebtn.classList.add('disabled');
      } else {
        savebtn.classList.remove('disabled');
      }
    };

    const isNew = data && !isCopy ? false : true;

    const shiftData = data
      ? {
          shiftId: data.shiftId,
          locationId: data.locationId,
          employeeId: data.personId,
          color: data.color,
          startTime: data.startTime,
          endTime: data.endTime,
          notifyEmployee: 'N',
          consumerNames: data.consumerNames === '' ? [] : data.consumerNames.split(','), // [name|id]
          date: [data.serviceDate.split(' ')[0]],
        }
      : {
          shiftId: '',
          locationId: '',
          employeeId: '',
          color: '',
          startTime: '',
          endTime: '',
          notifyEmployee: 'N',
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
    }

    if (isCopy) {
      shiftData.shiftId = '';

      const copyHeading = document.createElement('h2');
      copyHeading.textContent = 'Copy Shift';
      shiftPopup.appendChild(copyHeading);
    }

    const defaultDate = ScheduleCalendar.getCurrentDate();
    const shiftDateSelect = new WeekViewDatePicker({
      defaultDate: defaultDate,
      selectedDates: [...shiftData.date],
      onDateChange(newDateArray) {
        shiftData.date = [...newDateArray];

        checkRequiredFieldsShiftPopup(shiftPopup, savebtn);
      },
    });
    const filterEmployeesBtn = button.build({
      text: 'Filter Employee List',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterEmployeesBtn',
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
      value: shiftData.startTime,
    });
    const endTimeInput = input.build({
      label: 'End Time',
      type: 'time',
      style: 'secondary',
      value: shiftData.endTime,
    });
    const notifyEmployee = input.buildCheckbox({
      text: 'Notify Employee',
      isChecked: false,
    });
    const callOffBtn = button.build({
      text: 'Call Off',
      style: 'secondary',
      type: 'contained',
    });
    const requestShiftBtn = button.build({
      text: 'Request Shift',
      style: 'secondary',
      type: 'contained',
    });
    const cancelShiftBtn = button.build({
      text: 'Cancel Request',
      style: 'secondary',
      type: 'contained',
    });

    const addIndividualBtn = button.build({
      text: '+ Add Individual',
      style: 'secondary',
      type: 'contained',
      classNames: 'addIndividualBtn',
    });
    const individualCardWrap = document.createElement('div');
    individualCardWrap.classList.add('individualCardWrap');

    if (shiftData.consumerNames.length > 0) {
      const consumerNames = shiftData.consumerNames;
      consumerNames.forEach(cn => {
        const [name, id] = cn[0].split('|');
        const [first, last] = name.split(' ');

        const gridAnimationWrapper = document.createElement('div');
        gridAnimationWrapper.classList.add('rosterCardWrap');

        const rosterCard = new RosterCard({
          consumerId: id,
          firstName: first,
          middleName: '',
          lastName: last,
        });

        rosterCard.renderTo(gridAnimationWrapper);
        individualCardWrap.appendChild(gridAnimationWrapper);
      });
    }

    const savebtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        const res = await schedulingAjax.saveOrUpdateShift({
          dateString: shiftData.date.join(','),
          consumerIdString: shiftData.consumerNames.map(n => n.split('|')[1]).join(','),
          startTime: shiftData.startTime,
          endTime: shiftData.endTime,
          color: shiftData.color,
          locationId: shiftData.locationId,
          notifyEmployee: shiftData.notifyEmployee,
          personId: selectedEmployeeId,
          saveUpdateFlag: isNew ? 'S' : 'U',
        });

        calendarEvents = await getCalendarEvents(selectedLocationId, selectedEmployeeId);

        const newEvents = calendarEvents.filter(calEvent => res.includes(calEvent.eventId));

        newEvents.forEach(event => {
          if (!isNew) {
            ScheduleCalendar.updateEvent({ ...event });
          } else {
            ScheduleCalendar.addEvent({ ...event });
          }
        });

        POPUP.hide(shiftPopup);
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

    // Required Fields
    if (!shiftData.locationId) {
      locationDropdown.classList.add('error');
      employeeDropdown.classList.add('disabled');
    }
    if (!shiftData.startTime) startTimeInput.classList.add('error');
    if (!shiftData.endTime) endTimeInput.classList.add('error');

    // Event Listener
    shiftPopup.addEventListener('change', e => {
      if (e.target.parentElement === locationDropdown) {
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
        individualCardWrap.innerHTML = '';
      }
      if (e.target.parentElement === employeeDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        shiftData.employeeId = selectedOption.value;

        if (shiftData.employeeId === '') {
          employeeDropdown.classList.add('error');
        } else {
          employeeDropdown.classList.remove('error');
        }
      }
      if (e.target.parentElement === colorDropdown) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        shiftData.color = selectedOption.value;

        if (selectedOption.value === '%') shiftData.color = 'white';
      }
      if (e.target.parentElement === startTimeInput) {
        shiftData.startTime = e.target.value;

        if (!shiftData.startTime || (shiftData.endTime && shiftData.startTime > shiftData.endTime)) {
          startTimeInput.classList.add('error');
        } else {
          startTimeInput.classList.remove('error');

          if (shiftData.endTime) {
            endTimeInput.classList.remove('error');
          }
        }
      }
      if (e.target.parentElement === endTimeInput) {
        shiftData.endTime = e.target.value;

        if (!shiftData.endTime || (shiftData.startTime && shiftData.endTime < shiftData.startTime)) {
          endTimeInput.classList.add('error');
        } else {
          endTimeInput.classList.remove('error');

          if (shiftData.startTime) {
            startTimeInput.classList.remove('error');
          }
        }
      }
      if (e.target.parentElement === notifyEmployee) {
        shiftData.notifyEmployee = e.target.checked ? 'Y' : 'N';
      }

      checkRequiredFieldsShiftPopup(shiftPopup, savebtn);
    });
    shiftPopup.addEventListener('click', async e => {
      if (e.target === filterEmployeesBtn) {
        showFilterEmployeePopup(newEmployeeData => {
          if (!newEmployeeData) return;

          if (!newEmployeeData.find(empData => empData.Person_Id === shiftData.employeeId)) {
            shiftData.employeeId = '';
          }

          populateShiftEmployeeDropdown(employeeDropdown, shiftData.employeeId);
        });
      }
      if (e.target === addIndividualBtn) {
        const datesSelectedCount = shiftData.date.length > 0 ? null : shiftData.date[0];
        shiftPopup.style.opacity = 0.5;
        shiftPopup.style.pointerEvents = 'none';
        showAddIndividualPopup(
          consumers => {
            shiftData.consumerNames = [...consumers];
            individualCardWrap.innerHTML = '';
            if (shiftData.consumerNames.length > 0) {
              const consumerNames = shiftData.consumerNames;
              consumerNames.forEach(cn => {
                const [name, id] = cn.split('|');
                const [fName, lName] = name.split(' ');

                const gridAnimationWrapper = document.createElement('div');
                gridAnimationWrapper.classList.add('rosterCardWrap');

                const rosterCard = new RosterCard({
                  consumerId: id,
                  firstName: fName,
                  middleName: '',
                  lastName: lName,
                });

                rosterCard.renderTo(gridAnimationWrapper);
                individualCardWrap.appendChild(gridAnimationWrapper);
              });
            }
            shiftPopup.style.opacity = 1;
            shiftPopup.style.pointerEvents = 'all';
          },
          shiftData.consumerNames,
          datesSelectedCount,
        );
      }
      if (e.target === callOffBtn) {
        POPUP.hide(shiftPopup);
        renderRequestOffPopup(shiftData.shiftId, () => {
          const updatedShift = calendarEvents.find(event => event.eventId === shiftData.shiftId);
          updatedShift.typeName = EVENT_TYPES[5];
          updatedShift.typeId = 5;

          const updatedShiftScheduleCache = schedules.find(event => event.shiftId === shiftData.shiftId);
          updatedShiftScheduleCache.typeName = EVENT_TYPES[5];
          updatedShiftScheduleCache.typeId = 5;

          ScheduleCalendar.updateEvent({ ...updatedShift });
        });
      }
      if (e.target === requestShiftBtn) {
        POPUP.hide(shiftPopup);

        const { getOverlapStatusforSelectedShiftResult: overlapWithExistingShift } =
          await schedulingAjax.getOverlapStatusforSelectedShiftAjax(shiftData.shiftId, $.session.PeopleId);

        if (overlapWithExistingShift == 'NoOverLap') {
          renderSendShiftRequestPopup(
            {
              token: $.session.Token,
              shiftId: shiftData.shiftId,
              personId: $.session.PeopleId,
              status: 'P',
              notifiedEmployeeId: null,
            },
            () => {
              const updatedShift = calendarEvents.find(event => event.eventId === shiftData.shiftId);
              updatedShift.typeName = EVENT_TYPES[4];
              updatedShift.typeId = 4;

              const updatedShiftScheduleCache = schedules.find(event => event.shiftId === shiftData.shiftId);
              updatedShiftScheduleCache.typeName = EVENT_TYPES[4];
              updatedShiftScheduleCache.typeId = 4;

              ScheduleCalendar.updateEvent({ ...updatedShift });
            },
          );
        } else {
          displayOverlapPopup(overlapWithExistingShift);
          return;
        }
      }
      if (e.target === cancelShiftBtn) {
        POPUP.hide(shiftPopup);
        schedulingAjax.cancelRequestOpenShiftSchedulingAjax(shiftData.shiftId);

        const updatedShift = calendarEvents.find(event => event.eventId === shiftData.shiftId);
        updatedShift.typeName = EVENT_TYPES[3];
        updatedShift.typeId = 3;

        const updatedShiftScheduleCache = schedules.find(event => event.shiftId === shiftData.shiftId);
        updatedShiftScheduleCache.typeName = EVENT_TYPES[3];
        updatedShiftScheduleCache.typeId = 3;

        ScheduleCalendar.updateEvent({ ...updatedShift });
      }
    });
    individualCardWrap.addEventListener('click', e => {
      if (!$.session.schedulingSecurity) return;

      const idToRemove = e.target.id;
      shiftData.consumerNames = shiftData.consumerNames.filter(cn => (cn.id = idToRemove));
      e.target.remove();
    });

    // Build Popup
    const buttonWrap = document.createElement('div');
    buttonWrap.classList.add('btnWrap');
    buttonWrap.appendChild(savebtn);
    buttonWrap.appendChild(cancelbtn);
    //
    shiftPopup.appendChild(filterEmployeesBtn);
    shiftPopup.appendChild(shiftDateSelect.rootEle);
    shiftPopup.appendChild(locationDropdown);
    shiftPopup.appendChild(employeeDropdown);
    shiftPopup.appendChild(startTimeInput);
    shiftPopup.appendChild(endTimeInput);
    shiftPopup.appendChild(colorDropdown);
    shiftPopup.appendChild(individualCardWrap);
    shiftPopup.appendChild(addIndividualBtn);
    shiftPopup.appendChild(notifyEmployee);
    shiftPopup.appendChild(buttonWrap);

    if (!$.session.schedulingSecurity) {
      shiftPopup.remove(filterEmployeesBtn);
      shiftPopup.remove(colorDropdown);
      shiftPopup.remove(addIndividualBtn);
      shiftPopup.remove(notifyEmployee);
    }

    if (
      eventTypeID === '1' &&
      selectedEmployeeId === $.session.PeopleId &&
      (currentCalView === 'week' || currentCalView === 'day') &&
      $.session.schedAllowCallOffRequests === 'Y' &&
      $.session.schedulingUpdate
    ) {
      shiftPopup.appendChild(callOffBtn);
    }

    if (
      eventTypeID === '3' &&
      $.session.schedRequestOpenShifts === 'Y' &&
      !$.session.isPSI &&
      $.session.schedulingUpdate &&
      $.session.schedulingView
    ) {
      shiftPopup.appendChild(requestShiftBtn);
    }

    if (eventTypeID === '4' && data && data.requestedById === $.session.PeopleId) {
      shiftPopup.appendChild(cancelShiftBtn);
    }

    // Populate Dropdowns
    populateShiftLocationDropdown(locationDropdown, shiftData.locationId);
    populateShiftEmployeeDropdown(employeeDropdown, shiftData.employeeId);
    populateShiftColorDropdown(colorDropdown, shiftData.color);

    checkRequiredFieldsShiftPopup(shiftPopup, savebtn);

    POPUP.show(shiftPopup);
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

  function showEventDetailsPopup({ eventTypeId, data, viewDate, isCopy }) {
    if (eventTypeId === '6') {
      showAppointmentPopup(data);
    }

    showShiftPopup(data, eventTypeId, isCopy);
  }
  async function preLoadPopupData() {
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
  }

  // Calendar
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
        typeId: id,
        typeName: type,
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
        typeId: 6,
        typeName: EVENT_TYPES[6],
        locationId: appt.locationId,
        locationName: appt.locationName,
        publishedDate: appt.publishDate,
        color: color,
      };
    });
  }
  function renderCalendarEvents() {
    if (selectedLocationId === '%') {
      ScheduleCalendar.renderGroupedEvents([...calendarEvents, ...calendarAppointments], {
        groupBy: 'locationId',
        groupName: 'locationName',
      });
    } else if (selectedEmployeeId === '%') {
      ScheduleCalendar.renderGroupedEvents([...calendarEvents, ...calendarAppointments], {
        groupBy: 'personId',
        groupName: 'name',
      });
    } else {
      ScheduleCalendar.renderEvents([...calendarEvents, ...calendarAppointments]);
    }
  }
  //
  function handleCalendarEventClick(eventTarget) {
    if (eventTarget.classList.contains('eventCellEle')) {
      const viewDate = ScheduleCalendar.getCurrentDate();
      const eventTypeId = eventTarget.dataset.typeId;
      const shiftId = eventTarget.dataset.eventId;
      const targetEvent = [...appointments, ...schedules].find(ev => ev.shiftId == shiftId);
      showEventDetailsPopup({
        eventTypeId,
        data: targetEvent,
        viewDate,
        isCopy: false,
      });
    }

    if (eventTarget.classList.contains('copyShiftIcon')) {
      const viewDate = ScheduleCalendar.getCurrentDate();
      const eventTypeId = eventTarget.dataset.typeId;
      const shiftId = eventTarget.dataset.eventId;
      const targetEvent = [...appointments, ...schedules].find(event => event.eventId === shiftId);
      showEventDetailsPopup({
        eventTypeId,
        data: targetEvent,
        viewDate,
        isCopy: true,
      });
    }
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
        value: $.session.PeopleId,
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

    selectedLocationId = dropdownData[1].value;

    dropdown.populate(locationDropdownEle, dropdownData, selectedLocationId);
  }
  function populateEmployeeDropdown() {
    let dropdownData = [
      {
        value: '%',
        text: 'All',
      },
      {
        value: $.session.PeopleId,
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

      renderCalendarEvents();
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

      renderCalendarEvents();
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
      // filter out events based off selectedShiftType
      if (selectedShiftType === '0') {
        ScheduleCalendar.filterEventsBy({
          resetFilter: true,
        });
      }

      const filterCheck = selectedShiftType === '1' ? value => value !== '' : value => value === '';
      ScheduleCalendar.filterEventsBy({ filterKey: 'publishedDate', filterCheck });
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
    });

    buttonEle.addEventListener('click', e => {
      showPubUnpubSchedulesPopup();
    });

    return buttonEle;
  }
  function buildNewShiftButton() {
    const buttonEle = button.build({
      text: 'Add New Shift',
      classNames: ['newShiftButton'],
      style: 'secondary',
      type: 'contained',
    });

    buttonEle.addEventListener('click', e => {
      const viewDate = ScheduleCalendar.getCurrentDate();
      showEventDetailsPopup({
        eventTypeId: '',
        data: null,
        viewDate,
        isCopy: false,
      });
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

      // if USER don't have security key they are only ever viewing their own schedule

      if (viewOptionShifts === 'no') {
        if (selectedEmployeeId === 'none') {
          selectedEmployeeId = $.session.PeopleId;

          renderCalendarEvents();
        }

        const filterCheck = value => value === 3;
        ScheduleCalendar.filterEventsBy({ filterKey: 'typeId', filterCheck });
      } else {
        ScheduleCalendar.filterEventsBy({ resetFilter: true });
      }

      renderCalendarEvents();

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
    resetModule();

    //!W remove after dev testing
    console.clear();
    // $.session.schedulingUpdate = true;
    // $.session.schedulingView = true;
    // $.session.schedAllowCallOffRequests = 'Y';
    // $.session.schedRequestOpenShifts = 'Y';
    // $.session.hideAllScheduleButton = false;
    // $.session.schedulingSecurity = true;
    //!W remove after dev testing

    selectedEmployeeId = $.session.PeopleId;
    rosterCache = {};

    ScheduleCalendar = new Calendar({
      defaultView: currentCalView,
      onEventClick: handleCalendarEventClick,
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
    ScheduleCalendar.renderEvents([...calendarEvents, ...calendarAppointments]);
    // console.log('Schedules:', schedules);
    // console.log('Events:', calendarEvents);
    // console.log('Appointments:', calendarAppointments);

    preLoadPopupData();
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
        SchedulingCalendar.init();
      },
    });
    const schedulingCalendarWeb2CalBtn = button.build({
      text: 'View Calendar Web2Cal',
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
