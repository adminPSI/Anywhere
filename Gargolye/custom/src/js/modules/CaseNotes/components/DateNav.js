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

  let selectedDate;

  //=========================
  // MAIN LIB
  //-------------------------
  function DateNavigation() {
    // GET TODAYS DATE AND SET HOURS TO MIDNIGHT
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);

    // GET BEGIN OF CURRENT WEEK
    const currentWeekStart = dates.startDayOfWeek(todaysDate);
    // GET END OF CURRENT WEEK
    const currentWeekEnd = dates.endOfWeek(todaysDate);

    const currentWeekData = dates.eachDayOfInterval({
      start: currentWeekStart,
      end: currentWeekEnd,
    });
    console.table(currentWeekData);

    // BUILD OUT DATE NAV
    const navWrapEle = document.createElement('div');

    currentWeekData.forEach(date => {
      const dayOfWeek = date.getDay();
      const month = date.getMonth();
      const day = date.getDate();

      const dateWrapEle = document.createElement('div');
      const dayOfWeekEle = document.createElement('p');
      const dateEle = document.createElement('p');

      dayOfWeekEle.innerText = DAYS[dayOfWeek];
      dateEle.innerText = `${month}/${day}`;

      dateWrapEle.appendChild(dateEle);
      dateWrapEle.appendChild(dayOfWeekEle);

      navWrapEle.appendChild(dateWrapEle);
    });
  }

  return DateNavigation;
});
