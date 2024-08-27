const outcomesReview = (function () {
  // Filtering
  //----------------------------------------------------
  function updateCurrentFilterDisplay(service, outcomeType) {}

  //
  //----------------------------------------------------
  function buildTabs(outcomesData = {}) {
    const sections = [];
    const noFreqOutcomes = outcomesData['NF'];
    const hourlyOutcomes = outcomesData['H'];
    const dailyOutcomes = outcomesData['D'];
    const weeklyOutcomes = outcomesData['W'];
    const monthlyOutcomes = outcomesData['M'];
    const yearlyOutcomes = outcomesData['Y'];

    if (noFreqOutcomes) sections.push('No Frequency');
    if (hourlyOutcomes) sections.push('Hourly');
    if (dailyOutcomes) sections.push('Daily');
    if (weeklyOutcomes) sections.push('Weekly');
    if (monthlyOutcomes) sections.push('Monthly');
    if (yearlyOutcomes) sections.push('Yearly');

    const outcomeTabs = tabs.build({
      sections,
      active: 0,
      tabNavCallback: function (data) {
        currentSection = data.activeSection;
        setUpOutcomesTabSpans();
      },
    });
  }
  
  // Table
  //----------------------------------------------------
  function buildRow() {}
  function buildTable() {}

  function init() {
    DOM.clearActionCenter(selectedConsumer);
    PROGRESS.SPINNER.show('Loading Outcomes...');
  }

  return {
    init
  }
})();

