const outcomesReview = (function () {
  let selectedConsumerId;
  let selectedDate;
  let outcomesData;
  let outcomesDataRaw;
  let outcomesDataSecondaryRaw;
  let activityRes;
  let locations;
  let successTypes;
  let goalTypes;

  let tabSections;
  let activeTab;

  let filterBtn;
  let servBtnWrap;
  let serviceBtn;
  let serviceCloseBtn;
  let typeBtnWrap;
  let outcomeTypeBtn;
  let outcomeTypeCloseBtn;
  let serviceFilterVal;
  let outcomeTypeFilterVal;

  let selectedDateSpan = { to: null, from: null };
  let unitType;
  let spanLength;
  let daysBackInput;
  let toDateInput;
  let fromDateInput;

  let outcomesReviewDiv;
  let outcomeTabs;

  // Constants
  const NO_FREQ = 'No Frequency';
  const HOUR = 'Hourly';
  const DAY = 'Daily';
  const WEEK = 'Weekly';
  const MONTH = 'Monthly';
  const YEAR = 'Yearly';

  const FREQUENCY = {
    'OBJFMAL': "At least", 
    'OBJFMAN': "As needed", 
    'OBJFMAR': "As Requested", 
    'OBJFMEX': "Exactly", 
    'OBJFMNM': "No more than"
  };
  const RECURRANCE = {
    D: "per day", 
    Y: "per year", 
    W: "per week", 
    M: "per month", 
    H: "per hour"
  };

  // Mini Roster
  //----------------------------------------------------
  async function handleActionNavEvent(target) {
    if (target.dataset.actionNav === 'miniRosterCancel') {
      DOM.toggleNavLayout();
    }

    if (target.dataset.actionNav === 'miniRosterDone') {
      DOM.toggleNavLayout();

      roster2.removeConsumerFromActiveConsumers(selectedConsumerId);

      const activeConsumers = roster2.getActiveConsumers();
      selectedConsumerId = activeConsumers[0].id;
      //selectedConsumerCard = activeConsumers[0].card;

      await getReviewTableData();
      await getReviewTableDataSecondary();

      // rebuild & populate tabs/tables
      const newOutcomeTabs = buildTabs();
      outcomesReviewDiv.replaceChild(newOutcomeTabs, outcomeTabs);
      outcomeTabs = newOutcomeTabs;

      populateTabSections();
      
    }
  }

  // Filtering
  //----------------------------------------------------
  // date span filter
  function updateFilterDates() {
    daysBackToggleBtn.textContent = `${unitType} Back`;
    daysBackLabel.textContent = `${unitType} Back`;
    daysBackInput.value = spanLength;
    fromDateInput.value = selectedDateSpan.from;
    toDateInput.value = selectedDateSpan.to;
  }
  function buildFilterDates() {
    const toggleButtonWrap = _DOM.createElement('div', { class: 'dateFilterToggle' });
    daysBackToggleBtn = _DOM.createElement('button', { class: 'active', id: 'days-back-btn', text: `${unitType} Back` });
    const dateRangeToggleBtn = _DOM.createElement('button', { id: 'date-range-btn', text: 'Date Range' });
    toggleButtonWrap.appendChild(daysBackToggleBtn);
    toggleButtonWrap.appendChild(dateRangeToggleBtn);

    const daysBackInputWrap = _DOM.createElement('div', { class: ['daysBack', 'active'] });
    daysBackLabel = _DOM.createElement('label', { for: 'daysBack', text: `${unitType} Back` });
    daysBackInput = _DOM.createElement('input', { id: 'daysBack', type: 'number', name: 'daysBack', value: spanLength });
    daysBackInputWrap.appendChild(daysBackLabel);
    daysBackInputWrap.appendChild(daysBackInput);
    
    const dateRangeInputWrap = _DOM.createElement('div', { class: ['dateRange'] });
    const dateRangeInnerWrap1 = _DOM.createElement('div');
    const dateRangeInnerWrap2 = _DOM.createElement('div');
    dateRangeInputWrap.appendChild(dateRangeInnerWrap1);
    dateRangeInputWrap.appendChild(dateRangeInnerWrap2);
    
    const fromDateLabel = _DOM.createElement('label', { for: 'fromDate', text: `From:` });
    fromDateInput = _DOM.createElement('input', { id: 'fromDate', type: 'date', name: 'fromDate', value: selectedDateSpan.from });
    dateRangeInnerWrap1.appendChild(fromDateLabel);
    dateRangeInnerWrap1.appendChild(fromDateInput);

    const toDateLabel = _DOM.createElement('label', { for: 'toDate', text: `To:` });
    toDateInput = _DOM.createElement('input', { id: 'toDate', type: 'date', name: 'toDate', value:selectedDateSpan.to  });
    dateRangeInnerWrap2.appendChild(toDateLabel);
    dateRangeInnerWrap2.appendChild(toDateInput);

    const dateWrap = _DOM.createElement('div', { class: 'dateFilter' });
    dateWrap.appendChild(toggleButtonWrap);
    dateWrap.appendChild(daysBackInputWrap);
    dateWrap.appendChild(dateRangeInputWrap);

    toggleButtonWrap.addEventListener('click', (e) => {
      if (e.target.classList.contains('active')) {
        return;
      }

      const daysBack = dateWrap.querySelector('.daysBack')
      const dateRange = dateWrap.querySelector('.dateRange')

      if (e.target === daysBackToggleBtn) {
        daysBack.classList.add('active');
        daysBackToggleBtn.classList.add('active');
        dateRange.classList.remove('active');
        dateRangeToggleBtn.classList.remove('active');
        return;
      }

      daysBack.classList.remove('active');
      daysBackToggleBtn.classList.remove('active');
      dateRange.classList.add('active');
      dateRangeToggleBtn.classList.add('active');
    });

    dateWrap.addEventListener('change', async (e) => {
      if (e.target.id === 'daysBack') {
        console.log('days back input changed', e.target.value);
        spanLength = e.target.value;
        selectedDateSpan.to = selectedDate;

        switch(activeTab) {
          case NO_FREQ: {
            const dateObj = dates.subDays(new Date(`${selectedDateSpan.to} 00:00:00`), spanLength);
            selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
          }
          case HOUR: {
            const dateObj = dates.subHours(new Date(`${selectedDateSpan.to} 00:00:00`), spanLength);
            selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
          }
          case DAY: {
            const dateObj = dates.subDays(new Date(`${selectedDateSpan.to} 00:00:00`), spanLength);
            selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
          }
          case WEEK: {
            const dateObj = dates.subWeeks(new Date(`${selectedDateSpan.to} 00:00:00`), spanLength);
            selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
          }
          case MONTH: {
            const dateObj = dates.subMonths(new Date(`${selectedDateSpan.to} 00:00:00`), spanLength);
            selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
          }
          case YEAR: {
            const dateObj = dates.subYears(new Date(`${selectedDateSpan.to} 00:00:00`), spanLength);
            selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
          }
        }

        await getReviewTableData();
        await getReviewTableDataSecondary();
        populateTabSections();
      }
      if (e.target.id === 'fromDate') {
        console.log('from date input changed', e.target.value);
        selectedDateSpan.from = e.target.value;

        await getReviewTableData();
        await getReviewTableDataSecondary();
        populateTabSections();
      }
      if (e.target.id === 'toDate') {
        console.log('to date input changed', e.target.value);
        selectedDateSpan.to = e.target.value;

        await getReviewTableData();
        await getReviewTableDataSecondary();
        populateTabSections();
      }
    });

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
      outcomeTypeBtn.textContent = `Outcome Type: ${outcomeType}`;
    }
  }
  // filter popup
  function applyFilter() {
    updateCurrentFilterDisplay(serviceFilterVal.text, outcomeTypeFilterVal.text);

    const tableData = sortReviewTableData(outcomesDataRaw, { service: serviceFilterVal.value, type: outcomeTypeFilterVal.value });
    sortReviewTableDataSecondary(outcomesDataSecondaryRaw, tableData, { service: serviceFilterVal.value, type: outcomeTypeFilterVal.value });

    populateTabSections(tableData);
  }
  async function buildTypesDropdown() {
    const typesDrop = dropdown.build({
      dropdownId: 'outcomeDropdown',
      label: 'Outcome Type',
      style: 'secondary',
      readonly: false,
    });

    const data = goalTypes.map(type => {
      return {
        value: type.goalTypeId,
        text: type.goalTypeDescription,
      };
    });
    data.unshift({ value: '%', text: 'All' });

    const defaultValue = outcomeTypeFilterVal?.value ?? '%';
    dropdown.populate(typesDrop, data, defaultValue);

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

    const defaultValue = serviceFilterVal?.value ?? 'All';
    dropdown.populate(servDrop, data, defaultValue);

    return servDrop;
  }
  function closeFilter(closefilter) {
    if (closefilter == 'serviceBtn') {
      serviceFilterVal.text = 'All';
      serviceFilterVal.value = 'All'
    }
    if (closefilter == 'outcomeTypeBtn') {
      outcomeTypeFilterVal.text = 'All';
      outcomeTypeFilterVal.value = '%';
    }
    applyFilter();
  }
  async function showFilterPopup(IsShow) {
    let tempServiceVal, tempTypeVal;

    filterPopup = POPUP.build({
      closeCallback: () => {
        
      }
    });

    const serviceDropdown = buildServiceDropdown();
    const typesDropdown = await buildTypesDropdown();
    const applyButton = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    applyButton.classList.add('singleBtn');

    serviceDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      tempServiceVal = selectedOption;
    });
    typesDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      tempTypeVal = selectedOption;
    });
    applyButton.addEventListener('click', () => {
      serviceFilterVal = tempServiceVal ?? serviceFilterVal;
      outcomeTypeFilterVal = tempTypeVal ?? outcomeTypeFilterVal;
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
    const reviewNotePopup = POPUP.build({
      id: 'reviewNotePopup'
    });

    const header = _DOM.createElement('div', {class: ['reviewNoteHeader']});

    const topInfo = _DOM.createElement('div');

    const noteInput = input.build({
      label: 'Review Note',
      style: 'secondary',
      type: 'textarea',
    });
    const notifyEmployeeCheckbox = input.buildCheckbox({
      text: 'Notify Employee',
  });
    const savebtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: () => {

      },
    });
    const cancelbtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: () => {
        POPUP.hide(reviewNotePopup)
      },
    });

    
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(savebtn);
    btnWrap.appendChild(cancelbtn);

    reviewNotePopup.appendChild(noteInput);
    reviewNotePopup.appendChild(notifyEmployeeCheckbox);
    reviewNotePopup.appendChild(btnWrap);

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
      outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(selectedConsumerId, dates.formateToISO(outcome.date), results => {
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
    return tabs.build({
      sections: Object.values(tabSections),
      active: 0,
      tabNavCallback: function (data) {
        activeTab = data.activeSection;
        setUnitType();
        updateFilterDates();
      },
    });
  }
  function populateTabSections(data) {
    if (!data) data = outcomesData;

    for (const key in data) {
      const sectionID = tabSections[key].toLowerCase();
      const section = document.getElementById(sectionID);
      section.innerHTML = '';

      const sectionTable = buildTable(data[key]);

      section.appendChild(sectionTable);
    }
  }

  // Main
  //----------------------------------------------------
  function setUnitType() {
    selectedDateSpan.to = selectedDate;

    switch (activeTab) {
      case NO_FREQ:  {
        const dateObj = dates.subDays(new Date(`${selectedDate} 00:00:00`), 7);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Day(s)';
        spanLength = 7;
        break;
      }
      case HOUR:  {
        const dateObj = dates.subHours(new Date(`${selectedDate} 00:00:00`), 24);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Hour(s)';
        spanLength = 24;
        break;
      }
      case DAY:  {
        const dateObj = dates.subDays(new Date(`${selectedDate} 00:00:00`), 2);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Day(s)';
        spanLength = 2;
        break;
      }
      case WEEK:  {
        const dateObj = dates.subWeeks(new Date(`${selectedDate} 00:00:00`), 1);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Week(s)';
        spanLength = 1;
        break;
      }
      case MONTH:  {
        const dateObj = dates.subMonths(new Date(`${selectedDate} 00:00:00`), 2);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Month(s)';
        spanLength = 2;
        break;
      }
      case YEAR:  {
        const dateObj = dates.subYears(new Date(`${selectedDate} 00:00:00`), 2);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Year(s)';
        spanLength = 2;
        break;
      }
      default: {
        console.error(activeTab)
        throw new Error('something went wrong setting unit types')
      }
    }
  }
  function setTabSections() {
    tabSections = {};

    if (outcomesData.hasOwnProperty('NF')) tabSections['NF'] = NO_FREQ;
    if (outcomesData.hasOwnProperty('H')) tabSections['H'] = HOUR;
    if (outcomesData.hasOwnProperty('D')) tabSections['D'] = DAY;
    if (outcomesData.hasOwnProperty('W')) tabSections['W'] = WEEK;
    if (outcomesData.hasOwnProperty('M')) tabSections['M'] = MONTH;
    if (outcomesData.hasOwnProperty('Y')) tabSections['Y'] = YEAR;

    activeTab = Object.values(tabSections)[0];
  }
  function sortReviewTableData(data, filterBy) {
    objIdSet = new Set();

    return data.reduce((a, d) => {
      const occurrence = d.objectiveRecurrance || 'NF';
      const objID = d.objectiveId;
      const date = d.objective_date.split(' ')[0];

      objIdSet.add(objID);

      if (!a[occurrence]) {
        a[occurrence] = {};
      }

      if (!a[occurrence][objID]) {
        a[occurrence][objID] = {
          reviewDates: {},
        };
      }

      // if (!a[occurrence][objID].reviewDates[date]) {
      //   a[occurrence][objID].reviewDates[date] = {};
      // }

      const freq = FREQUENCY[d.frequencyModifier] || '';
      const recurr = RECURRANCE[d.objectiveRecurrance] || '';

      a[occurrence][objID].individual = d.consumerName;
      a[occurrence][objID].serviceStatement = d.objectiveStatement;
      a[occurrence][objID].frequency = `${freq} ${d.objectiveIncrement} ${recurr}`;
      a[occurrence][objID].timesDoc = d.timesDocumented;
      a[occurrence][objID].successRate = d.objectiveSuccess;
  
      return a;
    }, {});
  }
  function sortReviewTableDataSecondary(data, outcomeOjb, filterBy) {
    data.forEach(d => {
      const occurrence = d.objectiveRecurrance || 'NF';
      const objID = d.objectiveId;
      const date = d.objective_date.split(' ')[0];
      const staffId = d.staffId;

      if (filterBy) {
        if (filterBy.service && filterBy.service !== d.objectiveSuccessDescription) return;
        if (filterBy.type && filterBy.type !== d.goalTypeId) return;
      }

      if (outcomeOjb[occurrence]) {
        if (outcomeOjb[occurrence][objID]) {
          if (!outcomeOjb[occurrence][objID].reviewDates[date]) {
            outcomeOjb[occurrence][objID].reviewDates[date] = {};
          }

          if (!outcomeOjb[occurrence][objID].reviewDates[date][staffId]) {
            outcomeOjb[occurrence][objID].reviewDates[date][staffId] = {};
          }

          outcomeOjb[occurrence][objID].reviewDates[date][staffId].employee = d.employee;
          outcomeOjb[occurrence][objID].reviewDates[date][staffId].result = `${d.objectiveSuccessSymbol } ${d.objectiveSuccessDescription }`;
          outcomeOjb[occurrence][objID].reviewDates[date][staffId].attempts = d.promptNumber;
          outcomeOjb[occurrence][objID].reviewDates[date][staffId].prompts = d.promptType;
          outcomeOjb[occurrence][objID].reviewDates[date][staffId].note = d.objectiveActivityNote;

          outcomeOjb[occurrence][objID].reviewDates[date][staffId].activityId = d.objectiveActivityId;
        }
      }
    });
  }
  async function getReviewTableData() {
    const data = await outcomesAjax.getReviewTableData({
      consumerId: selectedConsumerId,
      objectiveDate: dates.formateToISO(selectedDate),
    });

    outcomesDataRaw = data;

    if (!data || !data.length) {
      console.log(`No data for consumerID: ${selectedConsumerId}`);
    }
    
    outcomesData = sortReviewTableData(data);
    setTabSections();
    setUnitType();
  }
  async function getReviewTableDataSecondary() {
    const data = await outcomesAjax.getReviewTableDataSecondary({
      consumerId: selectedConsumerId,
      startDate: selectedDateSpan.from,
      endDate: selectedDateSpan.to,
      objectiveIdList: Array.from(objIdSet).join(',')
    });

    outcomesDataSecondaryRaw = data;
  
    console.log(data);

    sortReviewTableDataSecondary(data, outcomesData);
  }
  async function init(consumer, date, allowedConsumerIds) {
    console.clear();

    selectedConsumerId = consumer.id;
    selectedConsumerCard = consumer.card;
    selectedDate = date; 
    serviceFilterVal = {};
    outcomeTypeFilterVal = {};

    setActiveModuleSectionAttribute('outcomes-review');
    PROGRESS.SPINNER.show('Loading Outcomes...');

    await getReviewTableData();
    await getReviewTableDataSecondary();
    console.table(outcomesData);

    DOM.clearActionCenter();

    outcomesReviewDiv = _DOM.createElement('div');
    outcomesReviewDiv.classList.add('outcomesReview');

    const filterDisplay = buildCurrentFilterdisplay();
    outcomeTabs = buildTabs();

    outcomesReviewDiv.appendChild(filterDisplay);
    outcomesReviewDiv.appendChild(outcomeTabs);
    DOM.ACTIONCENTER.appendChild(outcomesReviewDiv);

    updateCurrentFilterDisplay();
    populateTabSections();

    goalTypes = await outcomesAjax.getAllGoalTypes();

    roster2.setAllowedConsumers(allowedConsumerIds);
    roster2.addConsumerToActiveConsumers(selectedConsumerCard);
    roster2.miniRosterinit(null, {
      hideDate: true,
    });
  }

  return {
    init,
    handleActionNavEvent,
  };
})();
