(function (global, factory) {
  global.DateNavigation = factory();
})(this, function () {
  const DAYS = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
  };

  /**
   * Merge default options with user options
   *
   * @function
   * @param {Object}  userOptions - User defined options object
   * @return {Object} - Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  //=======================================
  // CUSTOM DATE PICKER
  //---------------------------------------
  /**
   * @constructor
   */
  function DatePicker() {
    this.inputWrap = null;
    this.input = null;

    this.build();
  }

  DatePicker.prototype.build = function () {
    // INPUT WRAP
    this.inputWrap = _DOM.createElement('div', {
      class: 'datePicker',
    });

    // INPUT & LABEL
    this.input = _DOM.createElement('input', {
      id: 'datePicker',
      type: 'date',
      name: 'datePicker',
    });
    const labelEle = _DOM.createElement('label', {
      node: Icon.getIcon('calendar'),
      for: 'datePicker',
    });
    labelEle.addEventListener('click', e => {
      this.input.showPicker();
    });

    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(labelEle);

    return this;
  };

  DatePicker.prototype.onDateChange = function (cb) {
    this.input.addEventListener('change', e => {
      cb(e.target.value);
    });
  };

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    selectedDate: dates.getTodaysDateObj(),
    allowFutureDate: true,
  };
  /**
   * @constructor
   * @param {Object} options
   * @param {Date} [options.selectedDate] - Initial date for date nav
   * @param {Boolean} [options.allowFutureDate] - Whether toallow future dates to be selected
   */
  function DateNavigation(options) {
    // Data Init
    this.options = mergOptionsWithDefaults(options);
    //? by default selectedDate, weekStart, weekEnd and eachDayoFWeek
    //? will be the most current week of calandar year
    this.weekStart = dates.startDayOfWeek(this.options.selectedDate);
    this.weekEnd = dates.endOfWeek(this.options.selectedDate);
    this.eachDayOfWeek = dates.eachDayOfInterval({
      start: this.weekStart,
      end: this.weekEnd,
    });

    this.isCurrentWeek = dates.isDateInCurrentWeek(this.options.selectedDate);

    if (!this.options.allowFutureDate && dates.isDateInFuture(this.options.selectedDate)) {
      throw new Error('Selected date option can not be in future if allow future date option is set to false');
    }

    // DOM
    this.navigationEle = null;
    this.weekWrapEle = null;
    this.prevWeekNavBtn = null;
  }

  /**
   * Builds the Navigation element structure
   *
   * @function
   * @returns {DateNavigation} - Returns the current instances for chaining
   */
  DateNavigation.prototype.build = function () {
    this.navigationEle = _DOM.createElement('div', { class: 'dateNavigation' });
    this.weekWrapEle = _DOM.createElement('div', { class: 'week' });

    this.prevWeekNavBtn = _DOM.createElement('div', {
      class: 'navButtons',
      'data-target': 'prevWeek',
      node: Icon.getIcon('arrowLeft'),
    });
    this.nextWeekNavBtn = _DOM.createElement('div', {
      class: this.isCurrentWeek ? ['navButtons', 'disabled'] : 'navButtons',
      'data-target': 'nextWeek',
      node: Icon.getIcon('arrowRight'),
    });
    this.customDatePicker = new DatePicker();

    this.navigationEle.appendChild(this.customDatePicker.inputWrap);
    this.navigationEle.appendChild(this.prevWeekNavBtn);
    this.navigationEle.appendChild(this.weekWrapEle);
    this.navigationEle.appendChild(this.nextWeekNavBtn);

    this.populate();
    this.setupEvents();

    return this;
  };

  /**
   * Populates the navigation with the dates for the selected week range
   *
   * @function
   */
  DateNavigation.prototype.populate = function () {
    this.weekWrapEle.innerHTML = '';

    this.eachDayOfWeek.forEach(date => {
      const isDateCurrentlySelected = date.getTime() === this.options.selectedDate.getTime() ? true : false;
      const isDateInFuture = dates.isDateInFuture(date);

      const dayOfWeek = date.getDay();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const classArray = ['day'];
      if (isDateCurrentlySelected) classArray.push('selected');
      if (isDateInFuture && !this.options.allowFutureDate) classArray.push('disabled');

      const dateWrapEle = _DOM.createElement('div', {
        class: classArray,
        'data-date': date.toDateString(),
        'data-target': 'date',
      });
      const dayOfWeekEle = _DOM.createElement('p', { text: DAYS[dayOfWeek], class: 'weekday' });
      const dateEle = _DOM.createElement('p', { text: `${month}/${day}`, class: 'date' });

      dateWrapEle.appendChild(dateEle);
      dateWrapEle.appendChild(dayOfWeekEle);

      this.weekWrapEle.appendChild(dateWrapEle);
    });
  };

  /**
   * Sets up events for navigation
   *
   * @function
   */
  DateNavigation.prototype.setupEvents = function () {
    this.navigationEle.addEventListener('click', e => {
      if (e.target.dataset.target === 'prevWeek') {
        this.weekStart = dates.subWeeks(this.weekStart, 1);
        this.weekEnd = dates.subWeeks(this.weekEnd, 1);
        this.eachDayOfWeek = dates.eachDayOfInterval({
          start: this.weekStart,
          end: this.weekEnd,
        });

        //? default selected date to monday on week change
        this.options.selectedDate = this.eachDayOfWeek[1];

        this.populate();
        this.onDateChange(this.options.selectedDate);

        return;
      }

      if (e.target.dataset.target === 'nextWeek') {
        this.weekStart = dates.addWeeks(this.weekStart, 1);
        this.weekEnd = dates.addWeeks(this.weekEnd, 1);
        this.eachDayOfWeek = dates.eachDayOfInterval({
          start: this.weekStart,
          end: this.weekEnd,
        });

        //? default selected date to monday on week change
        this.options.selectedDate = this.eachDayOfWeek[1];

        this.populate();
        this.onDateChange(this.options.selectedDate);

        return;
      }
    });

    this.customDatePicker.onDateChange(newDate => {
      const newDateValue = new Date(`${newDate}T00:00:00`);

      if (!this.options.allowFutureDate) {
        if (dates.isDateInFuture(newDateValue)) {
          return;
        }
      }

      this.options.selectedDate = newDateValue;
      this.isCurrentWeek = dates.isDateInCurrentWeek(this.options.selectedDate);
      this.weekStart = dates.startDayOfWeek(this.options.selectedDate);
      this.weekEnd = dates.endOfWeek(this.options.selectedDate);
      this.eachDayOfWeek = dates.eachDayOfInterval({
        start: this.weekStart,
        end: this.weekEnd,
      });

      if (this.isCurrentWeek) {
        this.nextWeekNavBtn.classList.add('disabled');
      } else {
        this.nextWeekNavBtn.classList.remove('disabled');
      }

      this.populate();
      this.onDateChange(this.options.selectedDate);
    });
  };

  /**
   * On date change method
   *
   * @function
   * @param {Function} cb -
   */
  DateNavigation.prototype.onDateChange = function (cb) {
    this.navigationEle.addEventListener('click', e => {
      if (e.target.dataset.target === 'date') {
        const currentSelectedDate = this.weekWrapEle.querySelector('.selected');
        if (currentSelectedDate) {
          currentSelectedDate.classList.remove('selected');
        }

        this.options.selectedDate = new Date(e.target.dataset.date);
        e.target.classList.add('selected');

        cb(this.options.selectedDate);

        return;
      }
    });
  };

  /**
   * Renders the built Date Navigation element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the navigation to
   * @returns {DateNavigation} - Returns the current instances for chaining
   */
  DateNavigation.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.navigationEle);
    }

    return this;
  };

  return DateNavigation;
});
