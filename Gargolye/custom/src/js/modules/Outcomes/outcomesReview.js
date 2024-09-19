const outcomesReview = (function () {
  let selectedConsumerId;
  let outcomesData;
  let outcomesDataRaw;
  let activityRes;
  let locations;
  let successTypes;
  let goalTypes;

  let tabSections;

  let filterBtn;
  let servBtnWrap;
  let serviceBtn;
  let serviceCloseBtn;
  let typeBtnWrap;
  let outcomeTypeBtn;
  let outcomeTypeCloseBtn;

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
  // date filter
  function buildFilterDates(unitType = 'Days') {
    const dateToggle = `
      <div class="dateFilterToggle">
        <button id="days-back-btn" class="active">${unitType} Back</button>
        <button id="date-range-btn">Date Range</button>
      </div>
    `;

    const dateInputs = `
      <div class="daysBack active" >
        <label for="daysBack">${unitType} Back:</label>
        <input type="number" id="daysBack" name="daysBack" min="1" />
      </div>

      <div class="dateRange">
        <div>
          <label for="fromDate">From:</label>
          <input type="date" id="fromDate" name="fromDate" />
        </div>
        <div>
          <label for="toDate">To:</label>
          <input type="date" id="toDate" name="toDate" />
        </div>
      </div>
    `;

    const dateWrap = _DOM.createElement('div', { class: 'dateFilter' });
    dateWrap.innerHTML = dateToggle;
    dateWrap.innerHTML += dateInputs;

    return dateWrap;
  }
  // current filter display
  function buildCurrentFilterdisplay() {
    const currentFilterDisplay = _DOM.createElement('div', { class: 'filteredByData' });
    const dateFilter = buildFilterDates();
    const filteredByWrap = _DOM.createElement('div', { class: 'filteredByWrap' });
    const btnWrap = _DOM.createElement('div', { class: 'filterBtnWrap' });
    servBtnWrap = _DOM.createElement('div', { class: 'filterSelectionBtnWrap' });
    typeBtnWrap = _DOM.createElement('div', { class: 'filterSelectionBtnWrap' });

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
      text: 'Service:',
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
      text: 'Outcome Type:',
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

    btnWrap.appendChild(filterBtn);

    servBtnWrap.appendChild(serviceBtn);
    servBtnWrap.appendChild(serviceCloseBtn);

    typeBtnWrap.appendChild(outcomeTypeBtn);
    typeBtnWrap.appendChild(outcomeTypeCloseBtn);

    filteredByWrap.appendChild(btnWrap);
    filteredByWrap.appendChild(servBtnWrap);
    filteredByWrap.appendChild(typeBtnWrap);
    currentFilterDisplay.appendChild(filteredByWrap);
    currentFilterDisplay.appendChild(dateFilter);

    return currentFilterDisplay;
  }
  function updateCurrentFilterDisplay(service = '%', outcomeType = '%') {
    if (service === '%' || service === 'All') {
      servBtnWrap.classList.add('hidden');
    } else {
      servBtnWrap.classList.remove('hidden');
      serviceBtn.textContent = `Service: ${service}`;
    }

    if (outcomeType === '%' || outcomeType === 'All') {
      typeBtnWrap.classList.add('hidden');
    } else {
      typeBtnWrap.classList.remove('hidden');
      typeBtnWrap.textContent = `Outcome Type: ${outcomeType}`;
    }
  }
  // filter popup
  function applyFilter() {
    updateCurrentFilterDisplay(); //TODO: pass new service and type
    //TODO: filter Outcomes
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
    dropdown.populate(typesDrop, data, '%');

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

    servDrop.addEventListener('change', event => {
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

  // Add Review Note Popup
  //----------------------------------------------------
  function showAddReviewNotePopup() {
    const reviewNotePopup = POPUP.build();

    const noteInput = input.build({
      label: 'Review Note',
      style: 'secondary',
      type: 'textarea',
    });

    reviewNotePopup.appendChild(noteInput);

    POPUP.show(reviewNotePopup);
  }

  // Detail View Popup
  //----------------------------------------------------
  function buildPrimaryLocationDropdown(locId) {
    const select = dropdown.build({
      label: 'Primary Location',
      style: 'secondary',
    });

    const data = outcomesLocations.Primary.map(pl => {
      return {
        value: pl.Location_ID,
        text: pl.description,
      };
    });

    return select;
  }
  function buildSecondaryLocationDropdown(locId) {
    const select = dropdown.build({
      label: 'Secondary Location',
      style: 'secondary',
    });

    return select;
  }
  function buildResultsDropdown(result) {
    const select = dropdown.build({
      label: 'Results',
      style: 'secondary',
    });

    return select;
  }
  function buildPromptsDropdown(code) {
    const select = dropdown.build({
      label: 'Prompts',
      style: 'secondary',
    });

    return select;
  }
  function buildAttemptsDropdown(attempt) {
    const select = dropdown.build({
      label: 'Attempts',
      style: 'secondary',
    });

    return select;
  }
  function buildCommunityIntegrationDropdown(ciLevel) {
    const select = dropdown.build({
      label: 'Community Integration',
      style: 'secondary',
    });

    return select;
  }
  function buildTimeInputs(startTime, endTime) {
    const start = input.build({
      label: 'Start Time',
      style: 'secondary',
      type: 'time',
      value: startTime,
    });
    const end = input.build({
      label: 'End Time',
      style: 'secondary',
      type: 'time',
      value: endTime,
    });

    
    const timeWrap = document.createElement('div');
    timeWrap.appendChild(start);
    timeWrap.appendChild(end);

    return timeWrap;
  }
  function buildNoteInput(note) {
    const noteInput = input.build({
      label: 'Note',
      style: 'secondary',
      type: 'textarea',
      value: note,
    });

    return noteInput;
  }
  function buildSaveButton(isEdit) {
    const text = isEdit ? 'Update' : 'Save';
    const btn = button.build({
      text,
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      //callback: saveNewOutcome,
    });

    return btn;
  }
  function buildDeleteButton() {
    const btn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'contained',
      //callback: deleteIncident,
    });

    return btn;
  }
  function buildAddNoteButton() {
    const btn = button.build({
      text: 'Add Review Note',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        showAddReviewNotePopup();
      },
    });

    return btn;
  }
  function buildCardEnteredByDetails(enteredBy, lastUpdatedDateDirty) {
    let lastEditedTime = lastUpdatedDateDirty.split(' ')[1];
    let lastEditHH = lastEditedTime.split(':')[0];
    let lastEditMM = UTIL.leadingZero(lastEditedTime.split(':')[1]);
    lastEditedTime = `${lastEditHH}:${lastEditMM} ${lastUpdatedDateDirty.split(' ')[2]}`;
    let lastEditedDate = editData.Last_Update.split(' ')[0];
    let lastEdited = `${lastEditedDate} ${lastEditedTime}`;

    const txtArea = document.createElement('p');
    txtArea.classList.add('enteredByDetail');
    txtArea.innerHTML = `Entered By: ${enteredBy} <br>Last Updated: ${lastEdited}`;

    return txtArea;
  }
  function showDetailViewPopup(editData) {
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
    const addReviewNoteBtn = buildAddNoteButton();
    const lastEditBy = buildCardEnteredByDetails(editData.submitted_by_user_id, editData.Last_Update);

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(addReviewNoteBtn);

    detailsPopup.appendChild(primaryLocationDropdown);
    detailsPopup.appendChild(secondaryLocationDropdown);
    detailsPopup.appendChild(resultsDropdown);
    detailsPopup.appendChild(promptsDropdown);
    detailsPopup.appendChild(attemptsDropdown);

    if ($.session.applicationName !== 'Gatekeeper') {
      detailsPopup.appendChild(cIDropdown);
      detailsPopup.appendChild(timeInputs);
    }

    detailsPopup.appendChild(noteInput);
    detailsPopup.appendChild(btnWrap);
    detailsPopup.appendChild(lastEditBy);

    POPUP.show(detailsPopup);

    //? Might need below but need more data from Mike
    if (editData && editData.submitted_by_user_id && editData.submitted_by_user_id.toUpperCase() !== $.session.UserId.toUpperCase()) {
      primaryLocationDropdown.classList.add('disabled');
      secondaryLocationDropdown.classList.add('disabled');
      resultsDropdown.classList.add('disabled');
      attemptsDropdown.classList.add('disabled');
      promptsDropdown.classList.add('disabled');
      cIDropdown.classList.add('disabled');
      timeInputs.classList.add('disabled');
      noteInput.querySelector('.input-field__input').setAttribute('readonly', 'true');
      saveBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
      btnWrap.classList.add('hidden');
    }
  }
  function onDetailRowClick(outcome) {
    const getSuccessTypes = new Promise((resolve, reject) => {
      outcomesAjax.getOutcomesSuccessTypes(outcome.goalTypeID, results => {
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

        resolve('success');
      });
    });

    const getLocations = new Promise((resolve, reject) => {
      outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(selectedConsumerId, outcome.date, results => {
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

        resolve('success');
      });
    });

    // TODO: get activityID
    const getActivity = new Promise((resolve, reject) => {
      outcomesAjax.getObjectiveActivity(outcome.activityId, results => {
        activityRes = results;
        resolve('success');
      });
    });

    Promise.all([getSuccessTypes, getLocations, getActivity]).then(function () {
      showDetailViewPopup(activityRes);
    });
  }

  // Table
  //----------------------------------------------------
  function buildToggleIcon() {
    const toggleIcon = _DOM.createElement('div', { class:[ 'rowToggle', 'closed'] });
    toggleIcon.innerHTML = icons['keyArrowRight'];
    return toggleIcon;
  }
  function buildTable(data) {
    const table = _DOM.createElement('div');
    table.classList.add('outcomesReviewTable');

    const mainHeading = _DOM.createElement('div', { class: ['heading', 'heading-main'] });
    mainHeading.innerHTML = `
      <div></div>
      <div>Individual</div>
      <div>Service Statement</div>
      <div>Frequency</div>
      <div>Times Documented</div>  
      <div>Success Rate</div>
    `;
    table.appendChild(mainHeading);

    for (const objId in data) {
      const d = data[objId];
      
      const mainRowWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-main'] });
      table.appendChild(mainRowWrap);
      
      const mainRow = _DOM.createElement('div', { class: ['row', 'row-main'] });
      const mainTI = buildToggleIcon();
      mainTI.classList.add('mainToggle');
      mainRow.appendChild(mainTI);
      mainRow.innerHTML += `
        <div>${d.individual}</div>
        <div>${d.serviceStatement}</div>
        <div>${d.frequency}</div>
        <div>${d.timesDoc}</div>
        <div>${d.successRate}</div>
      `;
      mainRowWrap.appendChild(mainRow);

      const mainRowSubWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-main-sub', 'hidden'] });
      mainRowWrap.appendChild(mainRowSubWrap);
      
      mainRow.addEventListener('click', e => {
        const target = e.target;

        if (!target.classList.contains('mainToggle')) return;
  
        const showChildren = target.classList.contains('closed');

        if (showChildren) {
          target.innerHTML = icons.keyArrowDown;
          target.classList.remove('closed');
          mainRowSubWrap.classList.remove('hidden');
        } else {
          target.innerHTML = icons.keyArrowRight;
          target.classList.add('closed');
          mainRowSubWrap.classList.add('hidden');
        }
      });

      for (const date in data[objId].reviewDates) {
        const dateRowWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-date'] });
        mainRowSubWrap.appendChild(dateRowWrap);

        const dateRow = _DOM.createElement('div', { class: ['row', 'row-date'] });
        const dateTI = buildToggleIcon();
        dateTI.classList.add('subToggle');
        dateRow.appendChild(dateTI);
        dateRow.innerHTML += `<div>${date}</div>`;
        dateRowWrap.appendChild(dateRow);
        
        const detailsTable = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-date-sub', 'hidden'] });
        dateRowWrap.appendChild(detailsTable);

        dateRow.addEventListener('click', e => {
          const target = e.target;
  
          if (!target.classList.contains('subToggle')) return;
    
          const showChildren = target.classList.contains('closed');
  
          if (showChildren) {
            target.innerHTML = icons.keyArrowDown;
            target.classList.remove('closed');
            detailsTable.classList.remove('hidden');
          } else {
            target.innerHTML = icons.keyArrowRight;
            target.classList.add('closed');
            detailsTable.classList.add('hidden');
          }
        });

        const detailsHeading = _DOM.createElement('div', { class: ['heading', 'heading-details'] });
        detailsHeading.innerHTML = `
          <div>Employee</div>
          <div>Result</div>
          <div>Attempts</div>
          <div>Prompts</div>  
          <div>Note</div>
        `;
        detailsTable.appendChild(detailsHeading);

        for (const staffId in data[objId].reviewDates[date]) {
          const details = data[objId].reviewDates[date][staffId];
          const detailRow = _DOM.createElement('div', { class: ['row', 'row-details'] });
          detailRow.innerHTML = `
            <div>${details.employee}</div>
            <div>${details.result}</div>
            <div>${details.attempts}</div>
            <div>${details.prompts}</div>
            <div>${details.note}</div>
          `;
          detailsTable.appendChild(detailRow);

          detailRow.addEventListener('click', () => {
            console.log('detail row click', details.activityId);
            onDetailRowClick({goalTypeID: objId, activityId: details.activityId, date: date});
          });
        }
      }
    }

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
      sections: Object.values(tabSections),
      active: 0,
      tabNavCallback: function (data) {
        console.log(data);
      },
    });
  }
  function populateTabSections() {
    for (const key in outcomesData) {
      const sectionID = tabSections[key].toLowerCase();
      const section = document.getElementById(sectionID);
      section.innerHTML = '';

      const sectionTable = buildTable(outcomesData[key]);

      section.appendChild(sectionTable);
    }
  }

  // Main
  //----------------------------------------------------
  async function getReviewTableData() {
    const data = await outcomesAjax.getReviewTableData({
      consumerId: selectedConsumerId,
      startDate: '2023/01/01',
      endDate: '2024/10/01',
    });

    outcomesDataRaw = {};

    outcomesData = data.reduce((a, d) => {
      const occurrence = d.objectiveRecurrance || 'NF';
      const objID = d.objectiveId;
      const date = d.objective_date.split(' ')[0];
      const staffId = d.staffId;

      if (!outcomesDataRaw[occurrence]) {
        outcomesDataRaw[occurrence] = [];
      }
      outcomesDataRaw[occurrence].push(d);

      if (!a[occurrence]) {
        a[occurrence] = {};
      }

      if (!a[occurrence][objID]) {
        a[occurrence][objID] = {
          reviewDates: {},
        };
      }

      if (!a[occurrence][objID].reviewDates[date]) {
        a[occurrence][objID].reviewDates[date] = {};
      }

      if (!a[occurrence][objID].reviewDates[date][staffId]) {
        a[occurrence][objID].reviewDates[date][staffId] = {};
      }

      // main row
      a[occurrence][objID].individual = d.consumerName;
      a[occurrence][objID].serviceStatement = d.objectiveStatement;
      a[occurrence][objID].frequency = `${d.frequencyModifier} ${d.objectiveIncrement} ${d.objectiveRecurrance}`;
      a[occurrence][objID].timesDoc = d.timesDocumented;
      a[occurrence][objID].successRate = d.objectiveSuccess;

      // detail row
      a[occurrence][objID].reviewDates[date][staffId].employee = d.employee;
      a[occurrence][objID].reviewDates[date][staffId].result = `${d.objectiveSuccessSymbol } ${d.objectiveSuccessDescription }`;
      a[occurrence][objID].reviewDates[date][staffId].attempts = d.promptNumber;
      a[occurrence][objID].reviewDates[date][staffId].prompts = d.promptType;
      a[occurrence][objID].reviewDates[date][staffId].note = d.objectiveActivityNote ;
      // data for detail popup
      a[occurrence][objID].reviewDates[date][staffId].activityId = d.objectiveActivityId;
      
      return a;
    }, {});

    console.table(outcomesDataRaw);
  }
  async function init(consumer) {
    console.clear();

    //selectedConsumerId = consumer.id;
    //selectedConsumerId = '4365';
    selectedConsumerId = '3190';

    setActiveModuleSectionAttribute('outcomes-review');
    PROGRESS.SPINNER.show('Loading Outcomes...');

    await getReviewTableData();

    DOM.clearActionCenter();

    const outcomesReview = _DOM.createElement('div');
    outcomesReview.classList.add('outcomesReview');

    const filterDisplay = buildCurrentFilterdisplay();
    const outcomeTabs = buildTabs();

    outcomesReview.appendChild(filterDisplay);
    outcomesReview.appendChild(outcomeTabs);
    DOM.ACTIONCENTER.appendChild(outcomesReview);

    updateCurrentFilterDisplay();
    populateTabSections();

    //goalTypes = await outcomesAjax.getAllGoalTypes();

    roster2.setAllowedConsumers(['%']);
    roster2.addConsumerToActiveConsumers(consumer.card);
    roster2.miniRosterinit(null, {
      hideDate: true,
    });
  }

  return {
    init,
    handleActionNavEvent,
  };
})();
