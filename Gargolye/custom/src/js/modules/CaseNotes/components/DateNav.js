const DateNavigation = (() => {
  const DAYS = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
  };
  // getDate returns day of month
  // getDay returns day of week
  // getMonth returns month

  function init() {
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

    const currentWeek = currentWeekData.map(date => {
      const dayOfWeek = date.getDay();
      const month = date.getMonth();
      const day = date.getDate();

      return {
        dayOfWeek: DAYS[dayOfWeek],
        date: `${month}/${day}`,
      };
    });

    console.table(currentWeekData);
    console.table(currentWeek);
  }

  return {
    init,
  };
})();
