const RosterPicker = (() => {
  function buildRosterCard() {}

  async function init() {
    const consumers = await _UTIL.fetchData('getConsumersByGroupJSON', {
      groupCode: 'All',
      retrieveId: '0',
      date: '2023-10-04',
      daysBackDate: '2023-06-27',
    });
  }

  return {
    init,
  };
})();
