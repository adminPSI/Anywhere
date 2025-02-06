const Calendar = (function () {
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
  // DOM
  const wrapperEle = document.createElement('div');
  const calendarEle = document.createElement('div');
  const calendarHeaderEle = document.createElement('div');
  const calendarTitleEle = document.createElement('div');
  const calendarNavEle = document.createElement('div');

  const viewBtnEle = {
    month: document.createElement('button'),
    week: document.createElement('button'),
    day: document.createElement('button'),
  };

  const navBtnEle = {
    next: document.createElement('button'),
    prev: document.createElement('button'),
    today: document.createElement('button'),
  };
  const monthDOMCache = {};

  // Date
  let currentView = 'month';
  let currentDate = dates.getTodaysDateObj();
  const todaysDate = dates.getTodaysDateObj();

  function renderEvents(events = []) {
    // sort events by date/time
    events
      .sort((a, b) => {})
      .forEach(e => {
        const eventEle = document.createElement('div');
        eventEle.addEventListener('click', () => {});
      });
  }

  function renderMonthView() {
    const containerEle = document.createElement('div');
    containerEle.className = 'month-view';

    const firstDayOfMonth = dates.startOfMonth(currentDate);
    const lastDayOfMonth = dates.endOfMonth(currentDate);
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

    // cal header
    calendarTitleEle.textContent = `${MONTH_NAMES[currentDate.getMonth()]} - ${currentDate.getFullYear()}`;

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

      monthDOMCache[day] = dayCellEle;

      containerEle.appendChild(weekWrapEle);

      if (!dates.isSameMonth(day, currentDate)) {
        dayCellEle.classList.add('notSameMonth');
      }
    });

    calendarEle.appendChild(containerEle);
  }
  function renderWeekView() {
    const containerEle = document.createElement('div');
    containerEle.className = 'week-view';

    const firstDayOfWeek = dates.startOfWeek(currentDate);
    const lastDayOfWeek = dates.endOfWeek(currentDate);
    const daysToRender = eachDayOfInterval({
      start: firstDayOfWeek,
      end: lastDayOfWeek,
    });

    // day header row
    const dayHeaderRowEle = document.createElement('div');
    containerEle.appendChild(dayHeaderRowEle);
    DAY_NAMES.forEach(dayName => {
      const nameCellEle = document.createElement('div');
      nameCellEle.textContent = dayName;
      dayHeaderRowEle.appendChild(nameCellEle);
    });

    const weekWrapEle = document.createElement('div');
    daysToRender.forEach(day => {
      const dayCellEle = document.createElement('div');
      weekWrapEle.appendChild(dayCellEle);

      // TODO: check if day is in same month (get isSameMonth from datefns)
      // if (dates.isSameMonth(day, currentDate)) {
      //   dayCellEle.classList.add('TODO');
      // }

      // TODO: add events to day
    });

    calendarEle.appendChild(containerEle);
  }
  function renderDayView() {
    const containerEle = document.createElement('div');
    containerEle.className = 'day-view';

    // TODO: add events to day

    calendarEle.appendChild(containerEle);
  }

  function renderCalendar() {
    calendarEle.innerHTML = '';

    if (currentView === 'month') {
      renderMonthView();
    }
    if (currentView === 'week') {
      renderWeekView();
    }
    if (currentView === 'day') {
      renderDayView();
    }
  }

  function handleViewChange(newView) {
    if (newView === currentView) return;

    calendarEle.innerHTML = '';

    viewBtnEle[currentView].classList.remove('active');
    viewBtnEle[newView].classList.add('active');
    currentView = newView;

    renderCalendar();
  }
  function handleNavigation(navEvent) {
    if (navEvent === 'prev') {
      if (currentView === 'month') {
        currentDate = dates.subMonths(currentDate, 1);
      }
      if (currentView === 'week') {
        currentDate = dates.subWeeks(currentDate, 1);
      }
      if (currentView === 'day') {
        currentDate = dates.subDays(currentDate, 1);
      }
    }
    if (navEvent === 'next') {
      if (currentView === 'month') {
        currentDate = dates.addMonths(currentDate, 1);
      }
      if (currentView === 'week') {
        currentDate = dates.addWeeks(currentDate, 1);
      }
      if (currentView === 'day') {
        currentDate = dates.addDays(currentDate, 1);
      }
    }
    if (navEvent === 'today') {
      currentDate = todaysDate;
    }

    renderCalendar();
  }

  function build() {
    wrapperEle.innerHTML = '';
    calendarElewrapperEle.innerHTML = '';
    calendarHeaderElewrapperEle.innerHTML = '';
    calendarTitleElewrapperEle.innerHTML = '';
    calendarNavElewrapperEle.innerHTML = '';
    // main
    wrapperEle.classList.add('calendarWrap');
    calendarHeaderEle.classList.add('calendarHeader');
    calendarTitleEle.classList.add('calendarTitleEle');
    calendarNavEle.classList.add('calendarNav');
    calendarEle.classList.add('calendar');

    // view buttons
    viewBtnEle['month'].setAttribute('data-view', 'month');
    viewBtnEle['week'].setAttribute('data-view', 'week');
    viewBtnEle['day'].setAttribute('data-view', 'day');
    viewBtnEle['month'].textContent = 'Month';
    viewBtnEle['week'].textContent = 'Week';
    viewBtnEle['day'].textContent = 'Day';

    // nav buttons
    navBtnEle['next'].setAttribute('data-nav', 'next');
    navBtnEle['prev'].setAttribute('data-nav', 'prev');
    navBtnEle['today'].setAttribute('data-nav', 'today');
    navBtnEle['next'].textContent = 'Next >>';
    navBtnEle['prev'].textContent = '<< Prev';
    navBtnEle['today'].textContent = 'Today';

    const viewToggleWrap = document.createElement('div');
    const dateNavWrap = document.createElement('div');
    viewToggleWrap.classList.add('viewToggle');
    dateNavWrap.classList.add('dateNav');

    viewToggleWrap.appendChild(viewBtnEle['month']);
    viewToggleWrap.appendChild(viewBtnEle['week']);
    viewToggleWrap.appendChild(viewBtnEle['day']);

    dateNavWrap.appendChild(navBtnEle['prev']);
    dateNavWrap.appendChild(navBtnEle['today']);
    dateNavWrap.appendChild(navBtnEle['next']);

    calendarNavEle.appendChild(dateNavWrap);
    calendarNavEle.appendChild(viewToggleWrap);

    calendarHeaderEle.appendChild(calendarTitleEle);
    calendarHeaderEle.appendChild(calendarNavEle);

    wrapperEle.appendChild(calendarHeaderEle);
    wrapperEle.appendChild(calendarEle);

    calendarNavEle.addEventListener('click', e => {
      if (e.target.dataset.view) {
        handleViewChange(e.target.dataset.view);
      }

      if (e.target.dataset.nav) {
        handleNavigation(e.target.dataset.nav);
      }
    });
  }

  function init() {
    build();

    viewBtnEle['month'].classList.add('active');

    renderCalendar();

    return wrapperEle;
  }

  return {
    init,
  };
})();
