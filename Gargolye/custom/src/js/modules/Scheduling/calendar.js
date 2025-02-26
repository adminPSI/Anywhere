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

const formatTime = hour => {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
};

class Calendar {
  constructor() {
    this.currentView = 'month';
    this.currentDate = dates.getTodaysDateObj();
    this.todaysDate = dates.getTodaysDateObj();

    this.monthDOMCache = {};

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

  updateHeader(prevDate) {
    if (prevDate && MONTH_NAMES[prevDate.getMonth()] === MONTH_NAMES[this.currentDate.getMonth()]) return;

    this.calendarTitleEle.textContent = `${
      MONTH_NAMES[this.currentDate.getMonth()]
    } - ${this.currentDate.getFullYear()}`;
  }

  // Views
  renderMonthView() {
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

      const dayCellEle = document.createElement('div');
      dayCellEle.textContent = day.getDate();
      dayCellEle.className = 'day';
      weekWrapEle.appendChild(dayCellEle);

      this.monthDOMCache[day] = dayCellEle;

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

    // day header row
    const dayHeaderRowEle = document.createElement('div');
    dayHeaderRowEle.className = 'dayNameHeader';
    containerEle.appendChild(dayHeaderRowEle);

    const emptyCellEle = document.createElement('div');
    emptyCellEle.className = 'emptyCell';
    dayHeaderRowEle.appendChild(emptyCellEle);

    DAY_NAMES.forEach((dayName, index) => {
      const nameCellEle = document.createElement('div');
      nameCellEle.textContent = `${dayName}, ${MONTH_NAMES_ABBR[daysToRender[index].getMonth()]} ${daysToRender[
        index
      ].getDate()}`;
      dayHeaderRowEle.appendChild(nameCellEle);
    });

    // week wrap
    const weekWrapEle = document.createElement('div');
    weekWrapEle.className = 'week';
    containerEle.appendChild(weekWrapEle);

    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = document.createElement('div');
      timeSlot.classList.add('timeSlot');
      timeSlot.textContent = formatTime(hour);
      weekWrapEle.appendChild(timeSlot);

      for (let day = 0; day < daysToRender.length; day++) {
        const daySlot = document.createElement('div');
        daySlot.classList.add('daySlot');
        daySlot.setAttribute('data-time', `${hour}:00`);
        weekWrapEle.appendChild(daySlot);
      }
    }

    // daysToRender.forEach(day => {
    //   const dayCellEle = document.createElement('div');
    //   dayCellEle.className = 'day';
    //   weekWrapEle.appendChild(dayCellEle);
    //   dayCellEle.textContent = `${day}`.slice(0, 10);

    //   for (let hour = 0; hour < 24; hour++) {
    //     const timeSlot = document.createElement('div');
    //     timeSlot.classList.add('dayTimeSlot');
    //     timeSlot.setAttribute('data-time', `${hour}:00`);
    //     dayCellEle.appendChild(timeSlot);
    //   }

    //   if (!dates.isSameMonth(day, this.currentDate)) {
    //     dayCellEle.classList.add('notSameMonth');
    //   }
    // });

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

  // Events
  handleViewChange(newView) {
    if (newView === this.currentView) return;

    this.calendarEle.innerHTML = '';

    this.viewBtnEle[this.currentView].classList.remove('active');
    this.viewBtnEle[newView].classList.add('active');
    this.currentView = newView;

    this.updateHeader();
    this.renderCalendar();
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