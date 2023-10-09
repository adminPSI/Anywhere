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
   * @param {Object}  userOptions  User defined options object
   * @return {Object}              Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @class
   * @param {Object} options
   * @param {Function} options.onDateChange
   */
  function DateNavigation(options) {
    // Data Init
    //? by default selectedDate, weekStart, weekEnd and eachDayoFWeek will be the most current week of calandar year
    this.selectedDate = dates.getTodaysDateObj();
    this.weekStart = dates.startDayOfWeek(this.selectedDate);
    this.weekEnd = dates.endOfWeek(this.selectedDate);
    this.eachDayOfWeek = dates.eachDayOfInterval({
      start: this.weekStart,
      end: this.weekEnd,
    });

    // Callbacks
    this.onDateChange = options.onDateChange;

    // DOM
    this.navigationEle = null;
    this.weekWrapEle = null;
  }
  /**
   * Builds the Navigation element structure
   *
   * @function
   * @returns {DateNavigation} Returns the current instances for chaining
   */
  DateNavigation.prototype.build = function () {
    this.navigationEle = _DOM.createElement('div', { class: 'dateNavigation' });
    this.weekWrapEle = _DOM.createElement('div', { class: 'week' });
    const prevWeekNavBtn = _DOM.createElement('div', {
      class: 'navButtons',
      'data-target': 'prevWeek',
      node: Icon.getIcon('arrowLeft'),
    });
    const nextWeekNavBtn = _DOM.createElement('div', {
      class: 'navButtons',
      'data-target': 'nextWeek',
      node: Icon.getIcon('arrowRight'),
    });

    this.navigationEle.appendChild(prevWeekNavBtn);
    this.navigationEle.appendChild(this.weekWrapEle);
    this.navigationEle.appendChild(nextWeekNavBtn);

    this.populate();
    this.setupEvents();

    return this;
  };

  /**
   * Populates the navigation with the dates for the selected week range
   */
  DateNavigation.prototype.populate = function () {
    this.weekWrapEle.innerHTML = '';

    this.eachDayOfWeek.forEach(date => {
      let isDateCurrentlySelected = date.getTime() === this.selectedDate.getTime() ? true : false;

      const dayOfWeek = date.getDay();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const dateWrapEle = _DOM.createElement('div', {
        class: isDateCurrentlySelected ? ['day', 'selected'] : 'day',
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
   * Setsup events for navigation
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
        this.selectedDate = this.eachDayOfWeek[1];

        this.populate();
        this.onDateChange(this.selectedDate);

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
        this.selectedDate = this.eachDayOfWeek[1];

        this.populate();
        this.onDateChange(this.selectedDate);

        return;
      }

      if (e.target.dataset.target === 'date') {
        const currentSelectedDate = this.weekWrapEle.querySelector('.selected');
        if (currentSelectedDate) {
          currentSelectedDate.classList.remove('selected');
        }

        this.selectedDate = date;
        e.target.classList.add('selected');

        this.onDateChange(this.selectedDate);

        return;
      }
    });
  };

  /**
   * Renders the built Date Navigation element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the navigation to
   * @returns {DateNavigation} Returns the current instances for chaining
   */
  DateNavigation.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.navigationEle);
    }

    return this;
  };

  return DateNavigation;
});
