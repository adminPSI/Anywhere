const outcomesReview = (function () {
  let selectedConsumerId;
  let locations;
  let successTypes;
  let goalTypes;

  let tabSections;

  // Util
  //----------------------------------------------------
  async function getReviewTableData() {
    const data = await outcomesAjax.getReviewTableData({
      consumerId: '4365',
      startDate: '2024/07/01',
      endDate: '2024/10/01',
    });

    outcomesData = data.reduce((a, d) => {
      const occurrence = d.objectiveRecurrance || 'NF';

      if (!a[occurrence]) {
        a[occurrence] = [];
      }

      a[occurrence].push(d);

      return a;
    }, {});
  }

  // Mini Roster
  //----------------------------------------------------
  async function handleActionNavEvent(target) {
    if (target.dataset.actionNav === 'miniRosterCancel') {
      DOM.toggleNavLayout();
    }

    if (target.dataset.actionNav === 'miniRosterDone') {
      DOM.toggleNavLayout();
      PROGRESS.SPINNER.show('Loading...');

      const activeConsumers = roster2.getActiveConsumers();
      selectedConsumerId = activeConsumers[0].id;

      // rebuild & populate tabs/tables
      const outcomeTabs = buildTabs();
      outcomesReview.appendChild(outcomeTabs);

      await getReviewTableData();

      populateTabSections();
    }
  }

  // Filtering
  //----------------------------------------------------
  // current filter display
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
  // filter popup
  function filterOutcomes() {}
  function applyFilter() {
    updateCurrentFilterDisplay(); //TODO: pass new service and type
    filterOutcomes();
  }
  async function buildTypesDropdown() {
    const typesDrop = dropdown.build({
      dropdownId: 'outcomeDropdown',
      label: 'Outcome Type',
      style: 'secondary',
      readonly: false,
    });

    typesDrop.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
    });

   
    const data = goalTypes.map(type => {
      return {
        value: type.Goal_Type_ID,
        text: type.goal_type_description,
      };
    });
    data.unshift({ value: '%', text: 'All' });
    dropdown.populate(typesDrop, data, '%');;

    return typesDrop;
  }
  function buildServiceDropdown() {
    const servDrop = dropdown.build({
      label: 'Service',
      style: 'secondary',
      readonly: false,
    });

    const data = [
      { value: 'All', text: 'All' },
      { value: 'Complete', text: 'Complete' },
      { value: 'Incomplete', text: 'Incomplete' },
    ];
    dropdown.populate(servDrop, data, 'All');

    serviceDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
    });

    return servDrop;
  }
  function showFilterPopup(IsShow) {
    filterPopup = POPUP.build({});

    const serviceDropdown = buildServiceDropdown();
    const typesDropdown = buildTypesDropdown();
    const applyButton = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    applyButton.classList.add('singleBtn');
    applyButton.addEventListener('click', () => {
      applyFilter();
      POPUP.hide(filterPopup);
    });

    if (IsShow == 'ALL' || IsShow == 'serviceBtn') filterPopup.appendChild(serviceDropdown);
    if (IsShow == 'ALL' || IsShow == 'outcomeTypeBtn') filterPopup.appendChild(typesDropdown);
    filterPopup.appendChild(applyButton);

    POPUP.show(filterPopup);
  }

  function buildFilterDates(unitType) {
    const dateToggle = `
      <div class="dateFilterToggle">
        <button id="days-back-btn" class="active">${unitType} Back</button>
        <button id="date-range-btn">Date Range</button>
      </div>
    `;

    const dateInputs = `
      <div id="daysBack">
        <label for="daysBack">${unitType} Back:</label>
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

  // Detail View
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
        sortSuccessTypes(results);
        resolve('success');
      });
    });

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

  // Tabs
  //----------------------------------------------------
  function buildTabs() {
    tabSections = {};

    if (outcomesData.hasOwnProperty('NF')) tabSections['NF'] = 'No Frequency';
    if (outcomesData.hasOwnProperty('H')) tabSections['H'] = 'Hourly';
    if (outcomesData.hasOwnProperty('D')) tabSections['D'] = 'Daily';
    if (outcomesData.hasOwnProperty('W')) tabSections['W'] = 'Weekly';
    if (outcomesData.hasOwnProperty('M')) tabSections['M'] = 'Monthly';
    if (outcomesData.hasOwnProperty('Y')) tabSections['Y'] = 'Yearly';

    return tabs.build({
      sections: Object.keys(tabSections),
      active: 0,
      tabNavCallback: function (data) {
        console.log(data);
      },
    });
  }
  function populateTabSections() {
    for (const key in outcomesData) {
      const sectionID = tabSections[key];
      const section = document.getElementById(sectionID);
      section.innerHTML = '';
      
      const sectionTable = buildTable(outcomesData[key]);

      section.appendChild(sectionTable);
    }
  }

  // Main
  //----------------------------------------------------
  async function init(consumer) {
    console.clear();

    selectedConsumerId = consumer.id;

    setActiveModuleSectionAttribute('outcomes-review');
    DOM.clearActionCenter();
    
    const outcomesReview = document.createElement('div');
    outcomesReview.classList.add('outcomesReview');
    const outcomeTabs = buildTabs();
    outcomesReview.appendChild(outcomeTabs);
    DOM.ACTIONCENTER.appendChild(outcomesReview);

    await getReviewTableData();

    //populateTabSections();
    
    goalTypes = await outcomesAjax.getAllGoalTypes();

    roster2.setAllowedConsumers(['%']);
    roster2.addConsumerToActiveConsumers(consumer.card);
    roster2.miniRosterinit(null, {
      hideDate: true,
    });
  }

  return {
    init,
    handleActionNavEvent
  };
})();
