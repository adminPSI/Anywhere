const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};
const MONTH_NAMES_ABBR = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

function formatTime(hour) {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}
function roundToNearestQuarter(timeStr) {
  let [hour, minutes] = timeStr.split(':').map(Number);

  // Round minutes to nearest quarter-hour
  let roundedMinutes = Math.round(minutes / 15) * 15;

  // Handle edge case where rounding up reaches the next hour
  if (roundedMinutes === 60) {
    hour = (hour + 1) % 24; // Ensure 24-hour format wraps around
    roundedMinutes = 0;
  }

  // Format with leading zeros if needed
  let roundedTime = `${String(hour).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;

  return roundedTime;
}
function isDateWithinSpan(dirtyDate, rangeObj) {
  const isEqualWithStart = dates.isEqual(new Date(dirtyDate), rangeObj.start);
  const isEqualWithEnd = dates.isEqual(new Date(dirtyDate), rangeObj.end);
  const isAfterStart = dates.isAfter(new Date(dirtyDate), rangeObj.start);
  const isBeforeEnd = dates.isBefore(new Date(dirtyDate), rangeObj.end);

  if ((isEqualWithStart || isAfterStart) && (isEqualWithEnd || isBeforeEnd)) {
    return true;
  }

  return false;
}
function isSameDay(dirtyDate, dirtySelectedDate) {
  return dates.isEqual(dirtyDate, dirtySelectedDate);
}

class Calendar {
  constructor(opts) {
    this.currentView = opts.defaultView;
    this.customGroupingOn = false;
    this.customGroupOptions = null;

    this.onEventClick = opts.onEventClick;
    this.onViewChange = opts.onViewChange;

    this.currentDate = dates.getTodaysDateObj();
    this.todaysDate = dates.getTodaysDateObj();
    this.dateRange = {
      start: null,
      end: null,
    };

    this.eventCache = null;
    this.eventCacheBackup = null;
    this.monthDOMCache = null;
    this.eventGroupDOMCache = {};

    this.rootEle = document.createElement('div');
    this.calendarEle = document.createElement('div');
    this.calendarHeaderEle = document.createElement('div');
    this.calendarTitleEle = document.createElement('div');
    this.calendarNavEle = document.createElement('div');
    this.viewBtnEle = {
      month: document.createElement('button'),
      week: document.createElement('button'),
      day: document.createElement('button'),
    };
    this.navBtnEle = {
      next: document.createElement('button'),
      prev: document.createElement('button'),
      today: document.createElement('button'),
    };

    this.weekWrapEle = document.createElement('div');
    this.weekEventsWrapEle = document.createElement('div');
    this.dayWrapEle = document.createElement('div');
    this.dayEventsWrapEle = document.createElement('div');

    this.build();
    this.attachEventListeners();
  }

  // Helpers
  updateHeader(prevDate) {
    if (prevDate && MONTH_NAMES[prevDate.getMonth()] === MONTH_NAMES[this.currentDate.getMonth()]) return;

    this.calendarTitleEle.textContent = `${
      MONTH_NAMES[this.currentDate.getMonth()]
    } - ${this.currentDate.getFullYear()}`;
  }

  // Views
  renderMonthView() {
    this.monthDOMCache = {};

    const containerEle = document.createElement('div');
    containerEle.className = 'month-view';

    const firstDayOfMonth = dates.startOfMonth(this.currentDate);
    const lastDayOfMonth = dates.endOfMonth(this.currentDate);
    const startWeekFirstDay = dates.startOfWeek(firstDayOfMonth, {
      weekStartsOn: 0,
    });
    const endWeekLastDay = dates.endOfWeek(lastDayOfMonth, {
      weekStartsOn: 0,
    });
    const daysToRender = dates.eachDayOfInterval({
      start: startWeekFirstDay,
      end: endWeekLastDay,
    });

    this.dateRange.start = startWeekFirstDay;
    this.dateRange.end = endWeekLastDay;

    // day header row
    const dayHeaderRowEle = document.createElement('div');
    dayHeaderRowEle.className = 'dayNameHeader';
    containerEle.appendChild(dayHeaderRowEle);
    DAY_NAMES.forEach(dayName => {
      const nameCellEle = document.createElement('div');
      nameCellEle.textContent = dayName;
      dayHeaderRowEle.appendChild(nameCellEle);
    });

    let weekWrapEle;
    daysToRender.forEach((day, index) => {
      if (index % 7 === 0) {
        weekWrapEle = document.createElement('div');
        weekWrapEle.className = 'week';
        containerEle.appendChild(weekWrapEle);
      }

      const timeStamp = `${day.getTime()}`;
      const dayCellEle = document.createElement('div');
      dayCellEle.textContent = day.getDate();
      dayCellEle.className = 'day';
      dayCellEle.setAttribute('data-date', timeStamp);
      weekWrapEle.appendChild(dayCellEle);

      this.monthDOMCache[timeStamp] = dayCellEle;

      containerEle.appendChild(weekWrapEle);

      if (!dates.isSameMonth(day, this.currentDate)) {
        dayCellEle.classList.add('notSameMonth');
      }
    });

    this.calendarEle.appendChild(containerEle);
  }
  renderWeekView() {
    const containerEle = document.createElement('div');
    containerEle.className = 'week-view';

    const firstDayOfWeek = dates.startOfWeek(this.currentDate);
    const lastDayOfWeek = dates.endOfWeek(this.currentDate);
    const daysToRender = dates.eachDayOfInterval({
      start: firstDayOfWeek,
      end: lastDayOfWeek,
    });

    this.dateRange.start = firstDayOfWeek;
    this.dateRange.end = lastDayOfWeek;

    // day header row
    const dayHeaderRowEle = document.createElement('div');
    dayHeaderRowEle.className = 'dayNameHeader';
    containerEle.appendChild(dayHeaderRowEle);

    const emptyCellEle = document.createElement('div');
    emptyCellEle.className = 'emptyCell';
    dayHeaderRowEle.appendChild(emptyCellEle);

    DAY_NAMES.forEach((dayName, index) => {
      const nameCellEle = document.createElement('div');
      const abbrMonthName = MONTH_NAMES_ABBR[daysToRender[index].getMonth()];
      const dayOfMonth = daysToRender[index].getDate();
      nameCellEle.textContent = `${dayName}, ${abbrMonthName} ${dayOfMonth}`;
      dayHeaderRowEle.appendChild(nameCellEle);
    });

    // week wrap
    this.weekWrapEle.innerHTML = '';
    this.weekWrapEle.className = 'week';
    containerEle.appendChild(this.weekWrapEle);

    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'timeSlot';
      timeSlot.textContent = formatTime(hour);
      this.weekWrapEle.appendChild(timeSlot);

      for (let day = 0; day < daysToRender.length; day++) {
        const daySlot = document.createElement('div');
        daySlot.className = 'daySlot';
        daySlot.setAttribute('data-time', `${hour}:00`);
        this.weekWrapEle.appendChild(daySlot);
      }
    }

    this.weekEventsWrapEle.className = 'weekEvents';
    this.weekWrapEle.appendChild(this.weekEventsWrapEle);

    this.calendarEle.appendChild(containerEle);
  }
  renderDayView() {
    const containerEle = document.createElement('div');
    containerEle.className = 'day-view';

    const dayStart = new Date(this.currentDate);
    const dayEnd = new Date(this.currentDate);

    this.dateRange.start = dayStart;
    this.dateRange.end = dayEnd;

    // day header
    const dayHeaderRowEle = document.createElement('div');
    dayHeaderRowEle.className = 'dayNameHeader';
    containerEle.appendChild(dayHeaderRowEle);

    const emptyCellEle = document.createElement('div');
    emptyCellEle.className = 'emptyCell';
    dayHeaderRowEle.appendChild(emptyCellEle);

    const nameCellEle = document.createElement('div');
    const abbrMonthName = MONTH_NAMES_ABBR[this.currentDate.getMonth()];
    const dayOfMonth = this.currentDate.getDate();
    const dayName = DAY_NAMES[this.currentDate.getDay()];
    nameCellEle.textContent = `${dayName}, ${abbrMonthName} ${dayOfMonth}`;
    dayHeaderRowEle.appendChild(nameCellEle);

    // day wrap
    this.dayWrapEle.innerHTML = '';
    this.dayWrapEle.className = 'day';
    containerEle.appendChild(this.dayWrapEle);

    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'timeSlot';
      timeSlot.textContent = formatTime(hour);
      this.dayWrapEle.appendChild(timeSlot);

      const daySlot = document.createElement('div');
      daySlot.className = 'daySlot';
      daySlot.setAttribute('data-time', `${hour}:00`);
      this.dayWrapEle.appendChild(daySlot);
    }

    this.dayEventsWrapEle.className = 'dayEvents';
    this.dayWrapEle.appendChild(this.dayEventsWrapEle);

    this.calendarEle.appendChild(containerEle);
  }

  // Events
  renderMonthEvents() {
    if (!this.eventCache) return;

    this.eventCache
      .filter(event => isDateWithinSpan(event.date, this.dateRange))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .map(event => {
        const eventDate = new Date(event.date);

        const eventCellEle = document.createElement('div');

        const eventTimeStamp = eventDate.getTime();
        this.monthDOMCache[eventTimeStamp].appendChild(eventCellEle);
      });
  }
  renderWeekEventsAsGroups(opts) {
    this.eventGroupDOMCache = {};

    this.weekWrapEle.classList.add('customGrouping');
    this.weekWrapEle.innerHTML = '';

    this.eventCache
      .filter(e => isDateWithinSpan(e.date, this.dateRange))
      .map(event => {
        // Grouping
        const groupByKey = event[opts.groupBy];
        const groupByName = event[opts.groupName];

        if (!this.eventGroupDOMCache[groupByKey]) {
          const groupWrapEle = document.createElement('div');
          groupWrapEle.id = `g-${groupByKey}`;
          const groupLabelEle = document.createElement('div');
          groupWrapEle.className = 'eventGroup';
          groupLabelEle.className = 'eventGroup-label';
          groupLabelEle.textContent = groupByName;

          groupWrapEle.appendChild(groupLabelEle);
          this.weekWrapEle.appendChild(groupWrapEle);

          this.eventGroupDOMCache[groupByKey] = groupWrapEle;
        }

        // Position
        const eventDate = new Date(event.date);
        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;

        // Event
        const eventCellEle = document.createElement('div');
        eventCellEle.id = `e-${event.eventId}`;
        eventCellEle.setAttribute('data-event-id', event.eventId);
        eventCellEle.setAttribute('data-type-id', event.type.id);
        eventCellEle.className = 'eventCellEle';
        eventCellEle.style.gridColumn = `${gridColumnStart} / span 1`;
        eventCellEle.style.backgroundColor = event.color;
        this.eventGroupDOMCache[groupByKey].appendChild(eventCellEle);

        const startTime = dates.convertFromMilitary(event.startTime.split(' ')[1]);
        const endTime = dates.convertFromMilitary(event.endTime.split(' ')[1]);
        const isPublished = event.publishedDate;
        const icon = isPublished ? icons.show : icons.eyeClose;
        eventCellEle.innerHTML = `
          <p class="eventTime">${startTime} - ${endTime} ${event.length}</p>
          <p class="eventName">${event.name}</p>
          <p class="pubUnpubIcon">${icon}</p>
          <p class="copyShiftIcon">${icons.copyShift}</p>
        `;
      });
  }
  renderWeekEvents() {
    this.weekEventsWrapEle.innerHTML = '';

    if (!this.eventCache) return;

    this.eventCache
      .filter(e => isDateWithinSpan(e.date, this.dateRange))
      .map(event => {
        const eventDate = new Date(event.date);
        const startDate = new Date(event.startTime);
        const endDate = new Date(event.endTime);

        // Position
        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;

        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const gridRowStart = startHour + 1;
        const gridRowEnd = endHour + 2;

        // View
        const eventCellEle = document.createElement('div');
        eventCellEle.className = 'eventCellEle';
        eventCellEle.id = `e-${event.eventId}`;
        eventCellEle.setAttribute('data-event-id', event.eventId);
        eventCellEle.setAttribute('data-type-id', event.type.id);
        eventCellEle.style.gridColumn = `${gridColumnStart} / span 1`;
        eventCellEle.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
        eventCellEle.style.backgroundColor = event.color;

        const startTime = dates.convertFromMilitary(event.startTime.split(' ')[1]);
        const endTime = dates.convertFromMilitary(event.endTime.split(' ')[1]);
        const isPublished = event.publishedDate;
        const icon = isPublished ? icons.show : icons.eyeClose;
        eventCellEle.innerHTML = `
          <p class="eventTime">${startTime} - ${endTime} ${event.length}</p>
          <p class="eventName">${event.name}</p>
          <p class="pubUnpubIcon">${icon}</p>
          <p class="copyShiftIcon">${icons.copyShift}</p>
        `;

        this.weekEventsWrapEle.appendChild(eventCellEle);
      });
  }
  renderDayEvents() {
    this.dayEventsWrapEle.innerHTML = '';

    if (!this.eventCache) return;

    this.eventCache
      .filter(e => isSameDay(e.date, this.selectedDate))
      .map(event => {
        const startDate = new Date(event.startTime);
        const endDate = new Date(event.endTime);

        // Position
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const gridRowStart = startHour + 1;
        const gridRowEnd = endHour + 2;

        // View
        const eventCellEle = document.createElement('div');
        eventCellEle.className = 'eventCellEle';
        eventCellEle.id = `e-${event.eventId}`;
        eventCellEle.setAttribute('data-event-id', event.eventId);
        eventCellEle.setAttribute('data-type-id', event.type.id);
        eventCellEle.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
        eventCellEle.style.backgroundColor = event.color;

        const startTime = dates.convertFromMilitary(event.startTime.split(' ')[1]);
        const endTime = dates.convertFromMilitary(event.endTime.split(' ')[1]);
        const isPublished = event.publishedDate;
        const icon = isPublished ? icons.show : icons.eyeClose;
        eventCellEle.innerHTML = `
          <p class="eventTime">${startTime} - ${endTime} ${event.length}</p>
          <p class="eventName">${event.name}</p>
          <p class="pubUnpubIcon">${icon}</p>
          <p class="copyShiftIcon">${icons.copyShift}</p>
        `;

        this.dayEventsWrapEle.appendChild(eventCellEle);
      });
  }
  renderDayEventsAsGroups(opts) {
    this.eventGroupDOMCache = {};
    this.dayWrapEle.classList.add('customGrouping');
    this.dayWrapEle.innerHTML = '';

    this.eventCache
      .filter(e => isSameDay(e.date, this.selectedDate))
      .map(event => {
        // Grouping
        const groupByKey = event[opts.groupBy];
        const groupByName = event[opts.groupName];

        if (!this.eventGroupDOMCache[groupByKey]) {
          const groupWrapEle = document.createElement('div');
          groupWrapEle.id = `g-${groupByKey}`;
          const groupLabelEle = document.createElement('div');
          groupWrapEle.className = 'eventGroup';
          groupLabelEle.className = 'eventGroup-label';
          groupLabelEle.textContent = groupByName;

          groupWrapEle.appendChild(groupLabelEle);
          this.dayWrapEle.appendChild(groupWrapEle);

          this.eventGroupDOMCache[groupByKey] = groupWrapEle;
        }

        // Position
        const startDate = new Date(event.startTime);
        const endDate = new Date(event.endTime);
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const gridRowStart = startHour + 1;
        const gridRowEnd = endHour + 2;

        // Event
        const eventCellEle = document.createElement('div');
        eventCellEle.id = `e-${event.eventId}`;
        eventCellEle.setAttribute('data-event-id', event.eventId);
        eventCellEle.setAttribute('data-type-id', event.type.id);
        eventCellEle.className = 'eventCellEle';
        eventCellEle.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
        eventCellEle.style.backgroundColor = event.color;
        this.eventGroupDOMCache[groupByKey].appendChild(eventCellEle);

        const startTime = dates.convertFromMilitary(event.startTime.split(' ')[1]);
        const endTime = dates.convertFromMilitary(event.endTime.split(' ')[1]);
        const isPublished = event.publishedDate;
        const icon = isPublished ? icons.show : icons.eyeClose;
        eventCellEle.innerHTML = `
          <p class="eventTime">${startTime} - ${endTime} ${event.length}</p>
          <p class="eventName">${event.name}</p>
          <p class="pubUnpubIcon">${icon}</p>
          <p class="copyShiftIcon">${icons.copyShift}</p>
        `;
      });
  }

  // Event Listeners
  handleViewChange(newView) {
    if (newView === this.currentView) return;

    this.calendarEle.innerHTML = '';

    this.viewBtnEle[this.currentView].classList.remove('active');
    this.viewBtnEle[newView].classList.add('active');
    this.currentView = newView;

    this.updateHeader();
    this.renderCalendar();

    if (this.customGroupingOn) {
      this.renderGroupedEvents();
    } else {
      this.renderEvents();
    }

    this.onViewChange(this.currentView);
  }
  handleNavigation(navEvent) {
    const prevDate = this.currentDate;

    if (navEvent === 'prev') {
      if (this.currentView === 'month') {
        this.currentDate = dates.subMonths(this.currentDate, 1);
      }
      if (this.currentView === 'week') {
        this.currentDate = dates.subWeeks(this.currentDate, 1);
      }
      if (this.currentView === 'day') {
        this.currentDate = dates.subDays(this.currentDate, 1);
      }
    }
    if (navEvent === 'next') {
      if (this.currentView === 'month') {
        this.currentDate = dates.addMonths(this.currentDate, 1);
      }
      if (this.currentView === 'week') {
        this.currentDate = dates.addWeeks(this.currentDate, 1);
      }
      if (this.currentView === 'day') {
        this.currentDate = dates.addDays(this.currentDate, 1);
      }
    }
    if (navEvent === 'today') {
      this.currentDate = todaysDate;
    }

    this.updateHeader(prevDate);
    this.renderCalendar();

    if (this.customGroupingOn) {
      this.renderGroupedEvents();
    } else {
      this.renderEvents();
    }
  }
  handleNavClickEvent(e) {
    const dataset = e.target.dataset;

    if (dataset.view) {
      this.handleViewChange(dataset.view);
    }

    if (dataset.nav) {
      this.handleNavigation(dataset.nav);
    }
  }
  handleCalendarEventClick(e) {
    const a = e.target.dataset;
    console.log(a);

    this.onEventClick(e.target);
  }

  attachEventListeners() {
    this.calendarEle.addEventListener('click', this.handleCalendarEventClick.bind(this));
    this.calendarNavEle.addEventListener('click', this.handleNavClickEvent.bind(this));
  }
  build() {
    this.rootEle.innerHTML = '';
    this.calendarEle.innerHTML = '';
    this.calendarHeaderEle.innerHTML = '';
    this.calendarTitleEle.innerHTML = '';
    this.calendarNavEle.innerHTML = '';

    // main
    this.rootEle.className = 'calendarWrap';
    this.calendarEle.className = `calendar`;
    this.calendarHeaderEle.className = 'calendarHeader';
    this.calendarTitleEle.className = 'calendarTitleEle';
    this.calendarNavEle.className = 'calendarNav';

    this.calendarTitleEle.textContent = `${
      MONTH_NAMES[this.currentDate.getMonth()]
    } - ${this.currentDate.getFullYear()}`;

    // view buttons
    this.viewBtnEle['month'].setAttribute('data-view', 'month');
    this.viewBtnEle['week'].setAttribute('data-view', 'week');
    this.viewBtnEle['day'].setAttribute('data-view', 'day');
    this.viewBtnEle['month'].textContent = 'Month';
    this.viewBtnEle['week'].textContent = 'Week';
    this.viewBtnEle['day'].textContent = 'Day';

    this.viewBtnEle[this.currentView].className = 'active';

    // nav buttons
    this.navBtnEle['next'].setAttribute('data-nav', 'next');
    this.navBtnEle['prev'].setAttribute('data-nav', 'prev');
    this.navBtnEle['today'].setAttribute('data-nav', 'today');
    this.navBtnEle['next'].textContent = 'Next >>';
    this.navBtnEle['prev'].textContent = '<< Prev';
    this.navBtnEle['today'].textContent = 'Today';

    const viewToggleWrap = document.createElement('div');
    const dateNavWrap = document.createElement('div');
    viewToggleWrap.className = 'viewToggle';
    dateNavWrap.className = 'dateNav';

    viewToggleWrap.appendChild(this.viewBtnEle['month']);
    viewToggleWrap.appendChild(this.viewBtnEle['week']);
    viewToggleWrap.appendChild(this.viewBtnEle['day']);

    dateNavWrap.appendChild(this.navBtnEle['prev']);
    dateNavWrap.appendChild(this.navBtnEle['today']);
    dateNavWrap.appendChild(this.navBtnEle['next']);

    this.calendarNavEle.appendChild(dateNavWrap);
    this.calendarNavEle.appendChild(viewToggleWrap);

    this.calendarHeaderEle.appendChild(this.calendarTitleEle);
    this.calendarHeaderEle.appendChild(this.calendarNavEle);

    this.rootEle.appendChild(this.calendarHeaderEle);
    this.rootEle.appendChild(this.calendarEle);
  }

  // PUBLIC
  //============================================
  getDateRangeInView() {
    return this.dateRange;
  }
  getCurrentDate() {
    return this.currentDate;
  }
  removeEvent(id) {
    const eventToRemove = this.calendarEle.getElementById(`e-${id}`);

    if (eventToRemove) {
      eventToRemove.remove();
    }

    if (this.eventCacheBackup) {
      this.eventCacheBackup = this.eventCacheBackup.filter(e => e.eventId !== id);
    } else {
      this.eventCache = this.eventCache.filter(e => e.eventId !== id);
    }
  }
  addEvent(newEvent) {
    if (this.eventCacheBackup) {
      this.eventCacheBackup.push(newEvent);
    } else {
      this.eventCache.push(newEvent);
    }

    if (this.currentView === 'month') {
      return;
    }

    if (this.currentView === 'week' || this.currentView === 'day') {
      if (this.customGroupingOn) {
        // Grouping
        const groupByKey = newEvent[opts.groupBy];
        const groupByName = newEvent[opts.groupName];

        if (!this.eventGroupDOMCache[groupByKey]) {
          const groupWrapEle = document.createElement('div');
          groupWrapEle.id = `g-${groupByKey}`;
          const groupLabelEle = document.createElement('div');
          groupWrapEle.className = 'eventGroup';
          groupLabelEle.className = 'eventGroup-label';
          groupLabelEle.textContent = groupByName;

          groupWrapEle.appendChild(groupLabelEle);
          this.weekWrapEle.appendChild(groupWrapEle);

          this.eventGroupDOMCache[groupByKey] = groupWrapEle;
        }

        // Position
        const eventDate = new Date(newEvent.date);
        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;

        // Event
        const eventCellEle = document.createElement('div');
        eventCellEle.id = `e-${newEvent.eventId}`;
        eventCellEle.setAttribute('data-event-id', newEvent.eventId);
        eventCellEle.setAttribute('data-type-id', newEvent.type.id);
        eventCellEle.className = 'eventCellEle';
        eventCellEle.style.gridColumn = `${gridColumnStart} / span 1`;
        eventCellEle.style.backgroundColor = newEvent.color;
        this.eventGroupDOMCache[groupByKey].appendChild(eventCellEle);

        const startTime = dates.convertFromMilitary(newEvent.startTime.split(' ')[1]);
        const endTime = dates.convertFromMilitary(newEvent.endTime.split(' ')[1]);
        const isPublished = newEvent.publishedDate;
        const icon = isPublished ? icons.show : icons.eyeClose;
        eventCellEle.innerHTML = `
           <p class="eventTime">${startTime} - ${endTime} ${newEvent.length}</p>
           <p class="eventName">${newEvent.name}</p>
           <p class="pubUnpubIcon">${icon}</p>
           <p class="copyShiftIcon">${icons.copyShift}</p>
         `;
      } else {
        const eventDate = new Date(newEvent.date);
        const startDate = new Date(newEvent.startTime);
        const endDate = new Date(newEvent.endTime);

        // Position
        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;

        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const gridRowStart = startHour + 1;
        const gridRowEnd = endHour + 2;

        // View
        const eventCellEle = document.createElement('div');
        eventCellEle.className = 'eventCellEle';
        eventCellEle.id = `e-${newEvent.eventId}`;
        eventCellEle.setAttribute('data-event-id', newEvent.eventId);
        eventCellEle.setAttribute('data-type-id', newEvent.type.id);
        eventCellEle.style.gridColumn = `${gridColumnStart} / span 1`;
        eventCellEle.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
        eventCellEle.style.backgroundColor = newEvent.color;

        const startTime = dates.convertFromMilitary(newEvent.startTime.split(' ')[1]);
        const endTime = dates.convertFromMilitary(newEvent.endTime.split(' ')[1]);
        const isPublished = newEvent.publishedDate;
        const icon = isPublished ? icons.show : icons.eyeClose;
        eventCellEle.innerHTML = `
          <p class="eventTime">${startTime} - ${endTime} ${newEvent.length}</p>
          <p class="eventName">${newEvent.name}</p>
          <p class="pubUnpubIcon">${icon}</p>
          <p class="copyShiftIcon">${icons.copyShift}</p>
        `;

        this.weekEventsWrapEle.appendChild(eventCellEle);
      }
    }
  }
  updateEvent(updatedEvent) {
    let oldEvent;

    if (this.eventCacheBackup) {
      this.eventCacheBackup.forEach((event, index) => {
        if (event.eventId === updatedEvent.eventId) {
          oldEvent = { ...event };
          event = { ...updatedEvent };
        }
      });
    } else {
      this.eventCache.forEach((event, index) => {
        if (event.eventId === updatedEvent.eventId) {
          oldEvent = { ...event };
          event = { ...updatedEvent };
        }
      });
    }

    const eventCell = this.calendarEle.getElementById(`e-${updatedEvent.eventId}`);

    // See if there was a date change that took it out of view
    const isStillInRange = isDateWithinSpan(updatedEvent.date, this.dateRange);
    if (!isStillInRange) {
      eventCell.remove();
    }

    if (this.currentView === 'month') {
      return;
    }

    // Update cell group type and color
    if (this.currentView === 'week' || this.currentView === 'day') {
      eventCell.setAttribute('data-type-id', updatedEvent.type.id);
      eventCell.style.backgroundColor = updatedEvent.color;
    }

    // Check if it needs moved
    if (this.customGroupingOn) {
      if (updatedEvent.locationId !== oldEvent.locationId) {
        const newGroup = this.calendarEle.getElementById(`g-${updatedEvent.locationId}`);
        newGroup.appendChild(eventCell);

        // Position
        const eventDate = new Date(updatedEvent.date);
        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;
        eventCell.style.gridColumn = `${gridColumnStart} / span 1`;
      }

      if (oldEvent.date !== updatedEvent.date) {
        // Position
        const eventDate = new Date(updatedEvent.date);
        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;
        eventCell.style.gridColumn = `${gridColumnStart} / span 1`;
      }
    } else {
      const oldStartDate = new Date(oldEvent.startTime);
      const oldEndDate = new Date(oldEvent.endTime);
      const newStartDate = new Date(updatedEvent.startTime);
      const newEndDate = new Date(updatedEvent.endTime);

      const sameStart = oldStartDate.getTime() === newStartDate.getTime();
      const sameEnd = oldEndDate.getTime() === newEndDate.getTime();

      if (oldEvent.date !== updatedEvent.date || !sameStart || !sameEnd) {
        // Position
        const eventDate = new Date(updatedEvent.date);
        const startDate = new Date(updatedEvent.startTime);
        const endDate = new Date(updatedEvent.endTime);

        const dayIndex = eventDate.getDay();
        const gridColumnStart = dayIndex + 2;

        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const gridRowStart = startHour + 1;
        const gridRowEnd = endHour + 2;

        eventCell.style.gridColumn = `${gridColumnStart} / span 1`;
        eventCell.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
      }
    }

    // Refresh inner HTML markup
    const startTime = dates.convertFromMilitary(updatedEvent.startTime.split(' ')[1]);
    const endTime = dates.convertFromMilitary(updatedEvent.endTime.split(' ')[1]);
    const isPublished = updatedEvent.publishedDate;
    const icon = isPublished ? icons.show : icons.eyeClose;
    eventCellEle.innerHTML = `
      <p class="eventTime">${startTime} - ${endTime} ${updatedEvent.length}</p>
      <p class="eventName">${updatedEvent.name}</p>
      <p class="pubUnpubIcon">${icon}</p>
      <p class="copyShiftIcon">${icons.copyShift}</p>
    `;
  }
  filterEventsBy(filterOptions) {
    if (filterOptions.resetFilter) {
      this.eventCache = [...this.eventCacheBackup];
      this.eventCacheBackup = null;

      if (this.customGroupingOn) {
        this.renderGroupedEvents();
      } else {
        this.renderEvents();
      }
      return;
    }

    this.eventCacheBackup = [...this.eventCache];

    const { filterKey, filterCheck } = filterOptions;
    this.eventCache = this.eventCache.filter(event => {
      return filterCheck(event[filterKey]);
    });
  }
  renderGroupedEvents(events, groupOptions) {
    if (events) {
      this.eventCache = events;
    }

    if (groupOptions) {
      this.customGroupOptions = groupOptions;
    }

    this.customGroupingOn = true;

    if (this.currentView === 'week') {
      this.renderWeekEventsAsGroups(this.customGroupOptions);
      return;
    }
  }
  renderEvents(events) {
    if (events) {
      this.eventCache = events;
    }

    if (this.customGroupingOn) {
      // reset calendar grid
      this.renderCalendar();
      this.customGroupingOn = false;
      this.customGroupOptions = null;
    }

    if (this.currentView === 'month') {
      this.renderMonthEvents();
      return;
    }
    if (this.currentView === 'week') {
      this.renderWeekEvents();
      return;
    }
    if (this.currentView === 'day') {
      this.renderDayEvents();
      return;
    }
  }
  renderCalendar() {
    this.calendarEle.innerHTML = '';

    if (this.currentView === 'month') {
      this.renderMonthView();
    }
    if (this.currentView === 'week') {
      this.renderWeekView();
    }
    if (this.currentView === 'day') {
      this.renderDayView();
    }
  }
}
