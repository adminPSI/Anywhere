//TODO: refactor god awful sort functions
const outcomesReview = (function () {
  let selectedConsumerId;
  let locations;
  let successTypes;
  let date;

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

  function buildFilterDates() {
    const dateToggle = `
      <div class="dateFilterToggle">
        <button id="days-back-btn" class="active">Days Back</button>
        <button id="date-range-btn">Date Range</button>
      </div>
    `;

    const dateInputs = `
      <div id="daysBack">
        <label for="daysBack">Days Back:</label>
        <input type="number" id="daysBack" name="daysBack" min="1" />
      </div>

      <div id="dateRange">
        <label for="fromDate">From:</label>
        <input type="date" id="fromDate" name="fromDate" />
        <label for="toDate">To:</label>
        <input type="date" id="toDate" name="toDate" />
      </div>
    `;
  }

  // 
  //----------------------------------------------------
  function buildPrimaryLocationDropdown(locId) {
    var select = dropdown.build({
      label: 'Primary Location',
      style: 'secondary',
    });

    var data = outcomesLocations.Primary.map(pl => {
      return {
        value: pl.Location_ID,
        text: pl.description,
      };
    });

    return select;
  }
  function buildSecondaryLocationDropdown(locId) {
    var select = dropdown.build({
      label: 'Secondary Location',
      style: 'secondary',
    });

    return select;
  }
  function buildResultsDropdown(result) {
    var select = dropdown.build({
      label: 'Results',
      style: 'secondary',
    });

    return select;
  }
  function buildPromptsDropdown(code) {
    var select = dropdown.build({
      label: 'Prompts',
      style: 'secondary',
    });

    return select;
  }
  function buildAttemptsDropdown(attempt) {
    var select = dropdown.build({
      label: 'Attempts',
      style: 'secondary',
    });

    return select;
  }
  function buildCommunityIntegrationDropdown(ciLevel) {
    var select = dropdown.build({
      label: 'Community Integration',
      style: 'secondary',
    });

    return select;
  }
  function buildTimeInputs(startTime, endTime) {
    var start = input.build({
      label: 'Start Time',
      style: 'secondary',
      type: 'time',
      value: startTime,
    });
    var end = input.build({
      label: 'End Time',
      style: 'secondary',
      type: 'time',
      value: endTime,
    });

    return {
      start,
      end,
    };
  }
  function buildNoteInput(note) {
    var noteInput = input.build({
      label: 'Note',
      style: 'secondary',
      type: 'textarea',
      value: note,
    });

    return noteInput;
  }
  function showDetailViewPopup(data) {
    const detailsPopup = POPUP.build();

    const primaryLocationDropdown = buildPrimaryLocationDropdown(editData.Location_ID);
    const secondaryLocationDropdown = buildSecondaryLocationDropdown(editData.Locations_Secondary_ID);
    const resultsDropdown = buildResultsDropdown(editData.objective_success_description);
    const promptsDropdown = buildPromptsDropdown(editData.Prompt_Type);
    const attemptsDropdown = buildAttemptsDropdown(editData.Prompt_Number);
    const cIDropdown = buildCommunityIntegrationDropdown(editData.community_integration_level);
    const timeInputs = buildTimeInputs(editData.start_time, editData.end_time);
    const noteInput = buildNoteInput(editData.Objective_Activity_Note);
    const saveBtn = buildSaveButton(true);
    const deleteBtn = buildDeleteButton();
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
  function sortOutcomeLocations(results) {
    locations = {};

    results.forEach(res => {
      if (!locations[res.type]) {
        locations[res.type] = [];
      }

      locations[res.type].push(res);
    });
    locations['Primary'].sort(function (a, b) {
      if (a.description < b.description) {
        return -1;
      }
      if (a.description > b.description) {
        return 1;
      }
      return 0;
    });

    if (locations.Secondary) {
      locations['Secondary'].sort(function (a, b) {
        if (a.description < b.description) {
          return -1;
        }
        if (a.description > b.description) {
          return 1;
        }
        return 0;
      });
    }
  }
  function sortSuccessTypes(results) {
    unOrderedSuccessObj = {};
    successTypes = {};

    results.forEach(st => {
      var label = st.Objective_Success_Description;
      if (!unOrderedSuccessObj[label]) {
        unOrderedSuccessObj[label] = st;
      }
    });

    Object.keys(unOrderedSuccessObj)
      .sort()
      .forEach(key => {
        successTypes[key] = unOrderedSuccessObj[key];
      });
  }
  function onDetailRowClick(outcome) {
    // TODO: get Goal_Type_ID
    const getSuccessTypes = new Promise((resolve, reject) => {
      outcomesAjax.getOutcomesSuccessTypes(outcome.Goal_Type_ID, results => {
        sortSuccessTypes(results)
        resolve('success');
      });
    })
    
    const getLocations = new Promise((resolve, reject) => {
      outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(selectedConsumerId, date, results => {
        sortOutcomeLocations(results);
        resolve('success');
      });
    });
    
    // TODO: get activityID
    const getActivity = new Promise((resolve, reject) => {
      outcomesAjax.getObjectiveActivity(activityId, results => {
        activityRes = results;
        resolve('success');
      });
    });

    Promise.all([getSuccessTypes, getLocations, getActivity]).then(function () {
      showDetailViewPopup(activityRes);
    });
  }
  function buildTable() {
    const table = _DOM.createElement('table');

    
    // const toggleIcon = document.createElement('div');
    // toggleIcon.classList.add('');
    // toggleIcon.innerHTML = icons['keyArrowRight'];

    return table;
  }

  function init(consumerId) {
    DOM.clearActionCenter();
    PROGRESS.SPINNER.show('Loading Outcomes...');

    selectedConsumerId = consumerId;
    date = UTIL.getTodaysDate();
  }

  return {
    init,
  };
})();
