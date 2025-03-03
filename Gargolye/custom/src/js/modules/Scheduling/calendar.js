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
const EVENT_COLOR = {
  1: 'white', // red, blue, green, orange, purple, yelow
  2: 'cyan',
  3: 'teal',
  4: 'pink',
  5: 'maroon',
  6: 'indigo',
  //? coral, olive
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
  return (
    dates.isEqual(dirtyDate, rangeObj.start) ||
    dates.isEqual(dirtyDate, rangeObj.end) ||
    (dates.isAfter(dirtyDate, rangeObj.start) && dates.isBefore(dirtyDate, rangeObj.end))
  );
}

class Calendar {
  constructor() {
    this.currentView = 'month';
    this.currentDate = dates.getTodaysDateObj();
    this.todaysDate = dates.getTodaysDateObj();
    this.dateRange = {
      start: null,
      end: null,
    };

    this.eventCache = null;
    this.monthDOMCache = null;

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

    this.build();
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
    const weekWrapEle = document.createElement('div');
    weekWrapEle.className = 'week';
    containerEle.appendChild(weekWrapEle);

    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'timeSlot';
      timeSlot.textContent = formatTime(hour);
      weekWrapEle.appendChild(timeSlot);

      for (let day = 0; day < daysToRender.length; day++) {
        const daySlot = document.createElement('div');
        daySlot.className = 'daySlot';
        daySlot.setAttribute('data-time', `${hour}:00`);
        weekWrapEle.appendChild(daySlot);
      }
    }

    const weekEventsWrapEle = document.createElement('div');
    weekEventsWrapEle.className = 'weekEvents';
    weekWrapEle.appendChild(weekEventsWrapEle);

    this.calendarEle.appendChild(containerEle);
  }
  renderDayView() {
    const containerEle = document.createElement('div');
    containerEle.className = 'day-view';

    // TODO: add events to day

    this.calendarEle.appendChild(containerEle);
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

  // Events, Schedule, etc.
  renderMonthEvents() {
    if (!this.eventCache) return;

    this.eventCache
      .filter(event => isDateWithinSpan(event.date, this.dateRange))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .map(event => {
        const eventDate = new Date(event.date);

        const eventCellEle = document.createElement('div');
        const color = event.type.id !== 1 ? EVENT_COLOR[event.type.id] : event.color;

        const eventTimeStamp = eventDate.getTime();
        this.monthDOMCache[eventTimeStamp].appendChild(eventCellEle);
      });
  }
  renderWeekEvents() {
    const weekEventWrap = this.calendarEle.querySelector('.weekEvents');
    weekEventWrap.innerHTML = '';

    if (!this.eventCache) return;

    this.eventCache
      .filter(event => isDateWithinSpan(event.date, this.dateRange))
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
        eventCellEle.textContent = `${event.startTime.split(' ')[1]} - ${event.endTime.split(' ')[1]} ${event.name}`;
        eventCellEle.className = 'eventCellEle';
        eventCellEle.style.gridColumn = `${gridColumnStart} / span 1`;
        eventCellEle.style.gridRow = `${gridRowStart} / ${gridRowEnd}`;
        // set group
        const color = event.type.id !== 1 ? EVENT_COLOR[event.type.id] : event.color;

        weekEventWrap.appendChild(eventCellEle);
      });
  }
  renderDayEvents() {
    events.forEach(event => {});
  }
  renderEvents(events) {
    if (events) {
      this.eventCache = events;
    }

    if (this.currentView === 'month') {
      this.renderMonthEvents();
    }
    if (this.currentView === 'week') {
      this.renderWeekEvents();
    }
    if (this.currentView === 'day') {
      this.renderDayEvents();
    }
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
    this.renderEvents();
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
    this.renderEvents();
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

    this.calendarNavEle.addEventListener('click', e => {
      if (e.target.dataset.view) {
        this.handleViewChange(e.target.dataset.view);
      }

      if (e.target.dataset.nav) {
        this.handleNavigation(e.target.dataset.nav);
      }
    });
  }
}
