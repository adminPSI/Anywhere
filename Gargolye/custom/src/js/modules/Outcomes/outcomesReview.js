const outcomesReview = (function () {
  // Filtering
  //----------------------------------------------------
  function updateCurrentFilterDisplay(service, outcomeType) {
    var currentFilterDisplay = document.querySelector('.filteredByData');

    if (!currentFilterDisplay) {
      currentFilterDisplay = document.createElement('div');
      currentFilterDisplay.classList.add('filteredByData');
      filterButtonSet(service, outcomeType);
      currentFilterDisplay.appendChild(btnWrap);
    }

    currentFilterDisplay.style.maxWidth = '100%';

    if (service === '%' || service === 'All') {
      btnWrap.appendChild(serviceBtnWrap);
      btnWrap.removeChild(serviceBtnWrap);
    } else {
      btnWrap.appendChild(serviceBtnWrap);
      if (document.getElementById('serviceBtn') != null)
        document.getElementById('serviceBtn').innerHTML = 'Service: ' + service;
    }

    if (outcomeType === '%' || outcomeType === 'All') {
      btnWrap.appendChild(outcomeTypeBtnWrap);
      btnWrap.removeChild(outcomeTypeBtnWrap);
    } else {
      btnWrap.appendChild(outcomeTypeBtnWrap);
      if (document.getElementById('outcomeTypeBtn') != null)
        document.getElementById('outcomeTypeBtn').innerHTML = 'Outcome Type: ' + outcomeType;
    }
    return currentFilterDisplay;
  }
  function filterButtonSet(service = 'All', outcomeType = 'All') {
    filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtnNew',
      callback: () => {
        showFilterPopup('ALL');
      },
    });

    serviceBtn = button.build({
      id: 'serviceBtn',
      text: 'Service: ' + service,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('serviceBtn');
      },
    });
    serviceCloseBtn = button.build({
      icon: 'Delete',
      style: 'secondary',
      type: 'text',
      classNames: 'filterCloseBtn',
      callback: () => {
        closeFilter('serviceBtn');
      },
    });

    outcomeTypeBtn = button.build({
      id: 'outcomeTypeBtn',
      text: 'Outcome Type: ' + outcomeType,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('outcomeTypeBtn');
      },
    });
    outcomeTypeCloseBtn = button.build({
      icon: 'Delete',
      style: 'secondary',
      type: 'text',
      classNames: 'filterCloseBtn',
      callback: () => {
        closeFilter('outcomeTypeBtn');
      },
    });

    btnWrap = document.createElement('div');
    btnWrap.classList.add('filterBtnWrap');
    btnWrap.appendChild(filterBtn);

    serviceBtnWrap = document.createElement('div');
    serviceBtnWrap.classList.add('filterSelectionBtnWrap');
    serviceBtnWrap.appendChild(serviceBtn);
    serviceBtnWrap.appendChild(serviceCloseBtn);
    btnWrap.appendChild(serviceBtnWrap);

    outcomeTypeBtnWrap = document.createElement('div');
    outcomeTypeBtnWrap.classList.add('filterSelectionBtnWrap');
    outcomeTypeBtnWrap.appendChild(outcomeTypeBtn);
    outcomeTypeBtnWrap.appendChild(outcomeTypeCloseBtn);
    btnWrap.appendChild(outcomeTypeBtnWrap);
  }
  function showFilterPopup(IsShow) {
    filterPopup = POPUP.build({});

    serviceDropdown = dropdown.build({
      label: 'Service',
      style: 'secondary',
      readonly: false,
    });
    outcomeDropdown = dropdown.build({
      dropdownId: 'outcomeDropdown',
      label: 'Outcome Type',
      style: 'secondary',
      readonly: false,
    });
    applyButton = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });

    applyButton.classList.add('singleBtn');
    if (IsShow == 'ALL' || IsShow == 'serviceBtn') filterPopup.appendChild(serviceDropdown);
    if (IsShow == 'ALL' || IsShow == 'outcomeTypeBtn') filterPopup.appendChild(outcomeDropdown);
    filterPopup.appendChild(applyButton);

    populateDropdowns();
    setupFilterEvents();

    POPUP.show(filterPopup);
  }

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
  const toggleIcon = document.createElement('div');
  toggleIcon.classList.add('');
  toggleIcon.innerHTML = icons['keyArrowRight'];

  function buildTable() {
    const table = _DOM.createElement('table');

    return table;
  }

  function init() {
    DOM.clearActionCenter(selectedConsumer);
    PROGRESS.SPINNER.show('Loading Outcomes...');
  }

  return {
    init,
  };
})();
