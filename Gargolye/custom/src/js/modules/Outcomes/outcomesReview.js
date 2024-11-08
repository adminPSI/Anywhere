const outcomesReview = (function () {
  // Data
  let selectedConsumerId;
  let selectedConsumerCard;
  let selectedDate;
  let outcomesData;
  let outcomesDataRaw;
  let outcomesDataSecondaryRaw;
  let exclamationIds;
  let exclamationSecondaryIds;
  let exclamationDateMap;
  let timesDocByDate;
  let dropdownData;
  let activityRes;
  let locations;
  let successTypes;
  let goalTypes;
  let tabSections;
  let activeTab;
  // Filter
  let filterBtn;
  let servBtnWrap;
  let serviceBtn;
  let serviceCloseBtn;
  let typeBtnWrap;
  let outcomeTypeBtn;
  let outcomeTypeCloseBtn;
  let serviceFilterVal;
  let outcomeTypeFilterVal;
  // Date span/days back filter
  let selectedDateSpan = { to: null, from: null };
  let unitType;
  let spanLength;
  let daysBackInput;
  let toDateInput;
  let fromDateInput;
  // DOM
  let outcomesReviewDiv;
  let outcomeTabs;
  let detailsPopup;
  let reviewNotePopup;
  // Constants
  const NO_FREQ_SPAN = 7;
  const HOUR_SPAN = 24;
  const DAY_SPAN = 2;
  const WEEK_SPAN = 1;
  const MONTH_SPAN = 2;
  const YEAR_SPAN = 2;
  const NO_FREQ = 'no frequency';
  const HOUR = 'hourly';
  const DAY = 'daily';
  const WEEK = 'weekly';
  const MONTH = 'monthly';
  const YEAR = 'yearly';
  const FREQ_MAP = {
    'no frequency': 'NF',
    hourly: 'H',
    daily: 'D',
    weekly: 'W',
    monthly: 'M',
    yearly: 'Y',
  };
  const MONTHS = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };
  const FREQUENCY = {
    OBJFMAL: 'At least',
    OBJFMAN: 'As needed',
    OBJFMAR: 'As Requested',
    OBJFMEX: 'Exactly',
    OBJFMNM: 'No more than',
  };
  const RECURRANCE = {
    D: 'per day',
    Y: 'per year',
    W: 'per week',
    M: 'per month',
    H: 'per hour',
  };

  function buildConsumerCard() {
    selectedConsumerCard.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(selectedConsumerCard);

    return wrap;
  }

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
      selectedConsumerCard = activeConsumers[0].card;

      await getReviewTableData();
      await getReviewTableDataSecondary();

      // replace consumer header
      const newConsumerCardHeader = buildConsumerCard();
      outcomesReviewDiv.replaceChild(newConsumerCardHeader, consumerCardHeader);
      consumerCardHeader = newConsumerCardHeader;
      // rebuild & populate tabs/tables
      const newOutcomeTabs = buildTabs();
      outcomesReviewDiv.replaceChild(newOutcomeTabs, outcomeTabs);
      outcomeTabs = newOutcomeTabs;

      populateTabSections();

      // data that is based off consumerID
      outcomesAjax.getDaysBackForEditingGoalsAndUseConsumerLocation(selectedConsumerId, res => {
        defaultPrimaryLocation = results[0].consumer_location;
      });
      outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(
        selectedConsumerId,
        dates.formateToISO(selectedDate),
        results => sortLocations(results),
      );
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
    daysBackToggleBtn = _DOM.createElement('button', {
      class: 'active',
      id: 'days-back-btn',
      text: `${unitType} Back`,
    });
    const dateRangeToggleBtn = _DOM.createElement('button', { id: 'date-range-btn', text: 'Date Range' });
    toggleButtonWrap.appendChild(daysBackToggleBtn);
    toggleButtonWrap.appendChild(dateRangeToggleBtn);

    const daysBackInputWrap = _DOM.createElement('div', { class: ['daysBack', 'active'] });
    daysBackLabel = _DOM.createElement('label', { for: 'daysBack', text: `${unitType} Back` });
    daysBackInput = _DOM.createElement('input', {
      id: 'daysBack',
      type: 'number',
      name: 'daysBack',
      value: spanLength,
    });
    daysBackInputWrap.appendChild(daysBackLabel);
    daysBackInputWrap.appendChild(daysBackInput);

    const dateRangeInputWrap = _DOM.createElement('div', { class: ['dateRange'] });
    const dateRangeInnerWrap1 = _DOM.createElement('div');
    const dateRangeInnerWrap2 = _DOM.createElement('div');
    dateRangeInputWrap.appendChild(dateRangeInnerWrap1);
    dateRangeInputWrap.appendChild(dateRangeInnerWrap2);

    const fromDateLabel = _DOM.createElement('label', { for: 'fromDate', text: `From:` });
    fromDateInput = _DOM.createElement('input', {
      id: 'fromDate',
      type: 'date',
      name: 'fromDate',
      value: selectedDateSpan.from,
    });
    dateRangeInnerWrap1.appendChild(fromDateLabel);
    dateRangeInnerWrap1.appendChild(fromDateInput);

    const toDateLabel = _DOM.createElement('label', { for: 'toDate', text: `To:` });
    toDateInput = _DOM.createElement('input', {
      id: 'toDate',
      type: 'date',
      name: 'toDate',
      value: selectedDateSpan.to,
    });
    dateRangeInnerWrap2.appendChild(toDateLabel);
    dateRangeInnerWrap2.appendChild(toDateInput);

    const dateWrap = _DOM.createElement('div', { class: 'dateFilter' });
    dateWrap.appendChild(toggleButtonWrap);
    dateWrap.appendChild(daysBackInputWrap);
    dateWrap.appendChild(dateRangeInputWrap);

    toggleButtonWrap.addEventListener('click', e => {
      if (e.target.classList.contains('active')) {
        return;
      }

      const daysBack = dateWrap.querySelector('.daysBack');
      const dateRange = dateWrap.querySelector('.dateRange');

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

    dateWrap.addEventListener('change', async e => {
      if (e.target.id === 'daysBack') {
        spanLength = e.target.value;
        selectedDateSpan.to = selectedDate;

        switch (activeTab) {
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

        Object.keys(outcomesData).forEach(a => {
          Object.keys(outcomesData[a]).forEach(b => {
            delete outcomesData[a][b].reviewDates;
            outcomesData[a][b].timesDoc = 0;
          });
        });
        await getReviewTableDataSecondary();

        populateTabSections();
      }
      if (e.target.id === 'fromDate') {
        selectedDateSpan.from = e.target.value;

        Object.keys(outcomesData).forEach(a => {
          Object.keys(outcomesData[a]).forEach(b => {
            delete outcomesData[a][b].reviewDates;
            outcomesData[a][b].timesDoc = 0;
          });
        });
        await getReviewTableDataSecondary();

        populateTabSections();
      }
      if (e.target.id === 'toDate') {
        selectedDateSpan.to = e.target.value;

        Object.keys(outcomesData).forEach(a => {
          Object.keys(outcomesData[a]).forEach(b => {
            delete outcomesData[a][b].reviewDates;
            outcomesData[a][b].timesDoc = 0;
          });
        });
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

    // const tableData = sortReviewTableData(outcomesDataRaw, {
    //   service: serviceFilterVal.value,
    //   type: outcomeTypeFilterVal.value,
    // });
    // sortReviewTableDataSecondary(outcomesDataSecondaryRaw, tableData);

    populateTabSections();
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
      serviceFilterVal.value = 'All';
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
      closeCallback: () => {},
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
  function showAddReviewNotePopup({ date, result, attempts, prompts, employeeId, activityId }) {
    const saveData = {
      objectiveActivityId: activityId,
      reviewNote: '',
      consumerId: selectedConsumerId,
      objectiveActivityDate: date.split(' ')[0],
      notifyEmployee: 'N',
    };

    reviewNotePopup = POPUP.build({
      id: 'reviewNotePopup',
      hideX: true,
    });

    const header = _DOM.createElement('div', { class: ['reviewNoteHeader'] });
    header.innerHTML = `<p>Service Review Note - ${selectedConsumerName}</p>`;
    const topInfo = _DOM.createElement('div', { class: ['reviewNoteInfo'] });
    topInfo.innerHTML = `
      <p>Date: ${date}</p>
      <p>Result: ${result}</p>
      <p>Attempts: ${attempts}</p>
      <p>Prompts: ${prompts}</p>
    `;

    const noteInput = input.build({
      label: 'Review Note',
      style: 'secondary',
      type: 'textarea',
      callback: e => {
        saveData.reviewNote = e.target.value;
      },
    });
    const notifyEmployeeCheckbox = input.buildCheckbox({
      text: 'Notify Employee',
      callback: e => {
        saveData.notifyEmployee = e.target.checked ? 'Y' : 'N';
      },
    });
    const savebtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        await outcomesAjax.addReviewNote({
          token: $.session.Token,
          ...saveData,
        });

        POPUP.hide(reviewNotePopup);
        POPUP.show(detailsPopup);
      },
    });
    const cancelbtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(reviewNotePopup);
        POPUP.show(detailsPopup);
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(savebtn);
    btnWrap.appendChild(cancelbtn);

    reviewNotePopup.appendChild(header);
    reviewNotePopup.appendChild(topInfo);
    reviewNotePopup.appendChild(noteInput);
    reviewNotePopup.appendChild(notifyEmployeeCheckbox);
    reviewNotePopup.appendChild(btnWrap);

    POPUP.show(reviewNotePopup);
  }

  // Detail View Popup
  //----------------------------------------------------
  function sortLocations(results) {
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
  // Popup
  function buildPrimaryLocationDropdown(locId) {
    const select = dropdown.build({
      label: 'Primary Location',
      style: 'secondary',
    });

    const data = locations.Primary.map(pl => {
      return {
        value: pl.Location_ID,
        text: pl.description,
      };
    });

    dropdown.populate(select, data, locId);

    return select;
  }
  function buildSecondaryLocationDropdown(secLocId) {
    const select = dropdown.build({
      label: 'Secondary Location',
      style: 'secondary',
    });

    if (!locations.Secondary || locations.Secondary.legnth < 1) return select;

    const data = locations.Secondary.filter(sloc => {
      return sloc.primaryLocId === secLocId ? true : false;
    }).map(sl => {
      return {
        value: sl.Location_ID,
        text: sl.description,
        attributes: [{ key: 'data-primary-loc-id', value: sl.primaryLocId }],
      };
    });
    data.unshift({
      value: '',
      text: '',
    });

    dropdown.populate(select, data, secLocId);

    return select;
  }
  function buildResultsDropdown(result = '') {
    const select = dropdown.build({
      label: 'Results',
      style: 'secondary',
    });

    const data = Object.values(successTypes).map(r => {
      return {
        value: r.Objective_Success_Description,
        text: `${r.Objective_Success} ${r.Objective_Success_Description}`,
        attributes: [{ key: 'data-success', value: r.Objective_Success }],
      };
    });
    data.unshift({
      value: '',
      text: '',
    });

    const successType = result || data[0].value;
    successDetails = successTypes[successType];

    dropdown.populate(select, data, result);

    return select;
  }
  function buildPromptsDropdown(code = '') {
    const select = dropdown.build({
      label: 'Prompts',
      style: 'secondary',
    });

    const data = dropdownData.prompts.map(op => {
      return {
        value: op.Code,
        text: `${op.Code} ${op.Caption}`,
      };
    });
    data.unshift({
      value: '',
      text: '',
    });

    dropdown.populate(select, data, code);

    return select;
  }
  function buildAttemptsDropdown(attempt = '') {
    const select = dropdown.build({
      label: 'Attempts',
      style: 'secondary',
    });

    const data = [
      { value: '', text: '' },
      // { value: '', text: '&#216' },
      // { value: '0', text: '0' },
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
      { value: '4', text: '4' },
      { value: '5', text: '5' },
      { value: '6', text: '6' },
      { value: '7', text: '7' },
      { value: '8', text: '8' },
      { value: '9', text: '9' },
    ];

    dropdown.populate(select, data, attempt);

    return select;
  }
  function buildCommunityIntegrationDropdown(ciLevel = '') {
    const select = dropdown.build({
      label: 'Community Integration',
      style: 'secondary',
    });

    const data = dropdownData.ci.map(ci => {
      return {
        value: ci.code,
        text: `${ci.code} ${ci.captionname}`,
      };
    });
    var defaultVal = {
      value: '',
      text: '',
    };
    data.unshift(defaultVal);

    dropdown.populate(select, data, ciLevel);

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

    return { timeWrap, start, end };
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
    });

    return btn;
  }
  function buildDeleteButton() {
    const btn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'contained',
    });

    return btn;
  }
  function buildAddNoteButton() {
    const btn = button.build({
      text: 'Add Review Note',
      style: 'secondary',
      type: 'contained',
    });

    return btn;
  }
  function buildCardEnteredByDetails(enteredBy, lastUpdatedDateDirty) {
    let lastEditedTime = lastUpdatedDateDirty.split(' ')[1];
    const lastEditHH = lastEditedTime.split(':')[0];
    const lastEditMM = UTIL.leadingZero(lastEditedTime.split(':')[1]);
    lastEditedTime = `${lastEditHH}:${lastEditMM} ${lastUpdatedDateDirty.split(' ')[2]}`;
    const lastEditedDate = lastUpdatedDateDirty.split(' ')[0];
    const lastEdited = `${lastEditedDate} ${lastEditedTime}`;

    const txtArea = document.createElement('p');
    txtArea.classList.add('enteredByDetail');
    txtArea.innerHTML = `Entered By: ${enteredBy} <br>Last Updated: ${lastEdited}`;

    return txtArea;
  }
  function showDetailViewPopup(editData, outcomeData) {
    console.table(editData);
    detailsPopup = POPUP.build({});
    const tmpData = {};

    if (editData) {
      locationID = editData.Location_ID;
      tmpData.primaryLoc = editData.Location_ID;
      tmpData.secLoc = editData.Locations_Secondary_ID;
      tmpData.result = editData.objective_success_description;
      tmpData.prompt = editData.Prompt_Type;
      tmpData.attempt = editData.Prompt_Number;
      tmpData.ci = editData.community_integration_level;
      tmpData.startTime = editData.start_time;
      tmpData.endTime = editData.end_time;
      tmpData.note = editData.Objective_Activity_Note;
    } else {
      // TODO: defaultObjLocationId, defaultGoalLocationId, useConsumerLocation||defaultPrimaryLocation
      // TODO: outcomes.js line 1021 ^^^^^
      locationID = '';
    }

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

    const checkRequiredFields = () => {
      const showAttempts = successDetails?.Show_Attempts;
      const showPrompts = successDetails?.Show_Prompts;
      const showTime = successDetails?.Show_Time;
      const showCI = successDetails?.Show_Community_Integration;

      const attemptsRequired = successDetails?.Attempts_Required;
      const promptsRequired = successDetails?.Prompt_Required;
      const timeRequired = successDetails?.Times_Required;
      const ciRequired = successDetails?.Community_Integration_Required;
      const noteRequired = successDetails?.Notes_Required;

      // attempts
      if (showAttempts === 'Y') {
        attemptsDropdown.classList.remove('hidden');
        attemptsDropdown.classList.remove('disabled');
        if (attemptsRequired === 'Y') {
          if (!tmpData.attempt || tmpData.attempt === '') {
            attemptsDropdown.classList.add('error');
          } else {
            attemptsDropdown.classList.remove('error');
          }
        } else {
          attemptsDropdown.classList.remove('error');
        }
      } else {
        attemptsDropdown.classList.add('hidden');
        attemptsDropdown.classList.add('disabled');
      }
      // prompts
      if (showPrompts === 'Y') {
        promptsDropdown.classList.remove('hidden');
        promptsDropdown.classList.remove('disabled');
        if (promptsRequired === 'Y') {
          if (!tmpData.prompt || tmpData.prompt === '') {
            promptsDropdown.classList.add('error');
          } else {
            promptsDropdown.classList.remove('error');
          }
        } else {
          promptsDropdown.classList.remove('error');
        }
      } else {
        promptsDropdown.classList.add('hidden');
        promptsDropdown.classList.add('disabled');
      }
      // community integration
      if (showCI === 'Y') {
        cIDropdown.classList.remove('hidden');
        cIDropdown.classList.remove('disabled');
        if (ciRequired === 'Y') {
          if (!tmpData.ci || tmpData.ci === '') {
            cIDropdown.classList.add('error');
          } else {
            cIDropdown.classList.remove('error');
          }
        } else {
          cIDropdown.classList.remove('error');
        }
      } else {
        cIDropdown.classList.add('hidden');
        cIDropdown.classList.add('disabled');
      }
      // start and end time
      if (showTime === 'Y') {
        timeInputs.start.classList.remove('disabled');
        timeInputs.end.classList.remove('disabled');
        if (timeRequired === 'Y') {
          if (tmpData.startTime === '') {
            timeInputs.start.classList.add('error');
          } else {
            timeInputs.start.classList.remove('error');
          }
          if (tmpData.endTime === '') {
            timeInputs.end.classList.add('error');
          } else {
            timeInputs.end.classList.remove('error');
          }
        } else {
          timeInputs.start.classList.remove('error');
          timeInputs.end.classList.remove('error');
        }
      } else {
        timeInputs.start.classList.add('disabled');
        timeInputs.end.classList.add('disabled');
      }
      // note
      if (noteRequired === 'Y') {
        if (!tmpData.note || tmpData.note === '') {
          noteInput.classList.add('error');
        } else {
          noteInput.classList.remove('error');
        }
      } else {
        noteInput.classList.remove('error');
      }

      const errors = [...detailsPopup.querySelectorAll('.error')];
      if (errors.length === 0) {
        saveBtn.classList.remove('disabled');
      } else {
        saveBtn.classList.add('disabled');
      }
    };

    primaryLocationDropdown.addEventListener('change', e => {
      tmpData.primaryLoc = e.target.value;
    });
    secondaryLocationDropdown.addEventListener('change', e => {
      tmpData.secLoc = e.target.value;
    });
    resultsDropdown.addEventListener('change', e => {
      tmpData.result = e.target.value;
      checkRequiredFields();
    });
    promptsDropdown.addEventListener('change', e => {
      tmpData.prompt = e.target.value;
      checkRequiredFields();
    });
    attemptsDropdown.addEventListener('change', e => {
      tmpData.attempt = e.target.value;
      checkRequiredFields();
    });
    cIDropdown.addEventListener('change', e => {
      tmpData.ci = e.target.value;
      checkRequiredFields();
    });

    timeInputs.start.addEventListener('change', e => {
      if (e.target) {
        tmpData.startTime = e.target.value;
      }
      checkRequiredFields();
    });
    timeInputs.end.addEventListener('change', e => {
      if (e.target) {
        tmpData.endTime = e.target.value;
      }
      checkRequiredFields();
    });
    noteInput.addEventListener('change', e => {
      tmpData.note = e.target.value;
      checkRequiredFields();
    });

    addReviewNoteBtn.addEventListener('click', e => {
      POPUP.hide(detailsPopup);
      showAddReviewNotePopup({
        date: editData.Objective_Date,
        result: outcomeData.result,
        attempts: outcomeData.attempt,
        prompts: editData.Prompt_Number,
        employeeId: outcomeData.employeeId,
        activityId: outcomeData.activityId,
      });
    });
    saveBtn.addEventListener('click', e => {
      outcomesAjax.saveGoals(data, () => {
        POPUP.hide(detailsPopup);
      });
    });
    deleteBtn.addEventListener('click', e => {
      outcomesAjax.deleteGoal(activityId, selectedConsumerId, selectedDate, async () => {
        POPUP.hide(detailsPopup);
      });
    });

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
      detailsPopup.appendChild(timeInputs.timeWrap);
    }

    detailsPopup.appendChild(noteInput);
    detailsPopup.appendChild(btnWrap);
    detailsPopup.appendChild(lastEditBy);

    POPUP.show(detailsPopup);

    checkRequiredFields();

    return;

    //? Might need below but need more data from Mike
    if (
      editData &&
      editData.submitted_by_user_id &&
      editData.submitted_by_user_id.toUpperCase() !== $.session.UserId.toUpperCase()
    ) {
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

    const getActivity = new Promise((resolve, reject) => {
      outcomesAjax.getObjectiveActivity(outcome.activityId, results => {
        activityRes = results;
        resolve('success');
      });
    });

    Promise.all([getSuccessTypes, getActivity]).then(function () {
      showDetailViewPopup(activityRes[0], outcome);
    });
  }

  // Table
  //----------------------------------------------------
  function buildToggleIcon() {
    const toggleIcon = _DOM.createElement('div', { class: ['rowToggle', 'closed'] });
    toggleIcon.innerHTML = icons['keyArrowRight'];
    return toggleIcon;
  }
  function buildTable(data) {
    let showTabExclamation;

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
      <div></div>
    `;
    table.appendChild(mainHeading);

    for (const objId in data) {
      const d = data[objId];

      const mainRowWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-main'] });
      table.appendChild(mainRowWrap);

      const mainRow = _DOM.createElement('div', { class: ['row', 'row-main'] });
      mainRow.setAttribute('data-outcomeType', d.outcomeType)
      mainRow.setAttribute('data-outcomeTypeId', d.outcomeTypeId)
      mainRow.setAttribute('data-showExclamation', d.showExclamation)
      const mainTI = buildToggleIcon();
      mainTI.classList.add('mainToggle');
      mainRow.appendChild(mainTI);
      mainRow.innerHTML += `
        <div>${d.individual}</div>
        <div>${d.serviceStatement}</div>
        <div>${d.frequency}</div>
        <div>${d.timesDoc}</div>
        <div>${d.successRate}</div>
        <div>${d.showExclamation ? icons.error : ''}</div>
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
        dateRow.innerHTML += `<div>${date !== 'nf' ? date : 'No Frequency'}</div>`;
        dateRowWrap.appendChild(dateRow);
        if (exclamationDateMap[objId] && exclamationDateMap[objId][date]) {
          dateRow.innerHTML += `<div>${icons.error}</div>`;
          showTabExclamation = true;
        }

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

        if (Object.keys(data[objId].reviewDates[date]).length > 0) {
          const detailsHeading = _DOM.createElement('div', { class: ['heading', 'heading-details'] });
          detailsHeading.innerHTML = `
            <div>Employee</div>
            <div>Result</div>
            <div>Attempts</div>
            <div>Prompts</div>  
            <div>Note</div>
          `;
          detailsTable.appendChild(detailsHeading);

          for (const activityId in data[objId].reviewDates[date]) {
            const details = data[objId].reviewDates[date][activityId];

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
              onDetailRowClick({
                goalTypeID: objId,
                activityId: details.activityId,
                date: date,
                result: details.result,
                attempt: details.attempts,
                employeeId: details.staffId,
              });
            });
          }
        }
      }
    }

    return { sectionTable: table, showTabExclamation };
  }

  // Tabs
  //----------------------------------------------------
  function buildTabs() {
    return tabs.build({
      sections: Object.values(tabSections),
      active: 0,
      tabNavCallback: async function (data) {
        activeTab = data.activeSection.toLowerCase();
        setUnitType();
        updateFilterDates();

        Object.keys(outcomesData).forEach(a => {
          Object.keys(outcomesData[a]).forEach(b => {
            delete outcomesData[a][b].reviewDates;
            outcomesData[a][b].timesDoc = 0;
          });
        });
        await getReviewTableDataSecondary();

        populateTabSections();
      },
    });
  }
  function populateTabSections(data) {
    if (!data) data = outcomesData;

    const key = FREQ_MAP[activeTab];
    const sectionID = tabSections[key].toLowerCase();
    const section = document.getElementById(sectionID);
    section.innerHTML = '';

    const { sectionTable, showTabExclamation } = buildTable(data[key], key);

    const rows = [...sectionTable.querySelectorAll('.row.row-main')];
    rows.forEach(row => {
      const outcomeType = row.dataset.outcometype;
      const outcomeTypeId = row.dataset.outcometypeid;
      const showExclamation = row.dataset.showexclamation;

      if (outcomeTypeFilterVal.text !== 'All' && outcomeTypeFilterVal.text !== outcomeType) {
        row.parentNode.style.display = 'none';
        return;
      }

      if (serviceFilterVal.text === 'Complete' && showExclamation === 'true') {
        row.parentNode.style.display = 'none';
        return;
      }

      if (serviceFilterVal.text === 'Incomplete' && showExclamation === 'false') {
        row.parentNode.style.display = 'none';
        return;
      }

      row.parentNode.style.display = 'flex';
    });

    const tabNavItems = [...document.querySelectorAll('.tabs__nav--item')];
    tabNavItems.forEach(item => {
      const freq = item.getAttribute('section');

      if (freq.toLowerCase() === activeTab.toLowerCase() && showTabExclamation) {
        item.innerHTML = `${freq} ${icons.error}`;
      } else {
        item.innerHTML = freq;
      }
    });

    section.appendChild(sectionTable);

    return;
  }

  // Main
  //----------------------------------------------------
  function getPercentForSuccessRate(topNumb, bottomNum) {
    if (!topNumb || !bottomNum || bottomNum === '0') {
      return '';
    }

    const percent = ((parseInt(topNumb) / parseInt(bottomNum)) * 100).toString().slice(0, 5);

    return `${percent}%`;
  }
  function setDatesForMiddleTier() {
    Object.keys(outcomesData).forEach(occ => {
      if (occ === 'NF') return;

      Object.keys(outcomesData[occ]).forEach(objId => {
        const dObj = {};

        if (occ === 'H') {
          dObj[0] = currentDateTime;
          dObj[0].setMinutes(0);
          dObj[0].setSeconds(0);
        } else {
          dObj[0] = new Date(`${selectedDateSpan.to} 00:00:00`)
        }

        for (let index = 0; index < spanLength - 1; index++) {
          switch (occ) {
            case 'H': {
              const nextDate = dates.subHours(dObj[index], 1);
              dObj[index + 1] = nextDate;
              break;
            }
            case 'D': {
              const nextDate = dates.subDays(dObj[index], 1);
              dObj[index + 1] = nextDate;
              break;
            }
            case 'W': {
              const nextDate = dates.subWeeks(dObj[index], 1);
              dObj[index + 1] = nextDate;
              break;
            }
            case 'M': {
              const nextDate = dates.subMonths(dObj[index], 1);
              dObj[index + 1] = nextDate;
              break;
            }
            case 'Y': {
              const nextDate = dates.subYears(dObj[index], 1);
              dObj[index + 1] = nextDate;
              break;
            }
          }
        }

        Object.keys(dObj).forEach(key => {
          if (!outcomesData[occ][objId].reviewDates) {
            outcomesData[occ][objId].reviewDates = {};
          }

          switch (occ) {
            case 'H': {
              //2024-10-31T14:11:35-04:00
              const militaryTime = dates.formatISO(dObj[key]).slice(11, 16);
              outcomesData[occ][objId].reviewDates[militaryTime] = {};
              break;
            }
            case 'D': {
              const isoDate = dates.formatISO(dObj[key]).split('T')[0];
              const stDate = dates.formateToStandard(isoDate);
              outcomesData[occ][objId].reviewDates[stDate] = {};
              break;
            }
            case 'W': {
              const weekStart = dates.startDayOfWeek(dObj[key]);
              const isoStartDate = dates.formatISO(weekStart).split('T')[0];
              const stStartDate = dates.formateToStandard(isoStartDate);

              const weekEnd = dates.endOfWeek(dObj[key]);
              const isoEndDate = dates.formatISO(weekEnd).split('T')[0];
              const stEndDate = dates.formateToStandard(isoEndDate);

              const dateKey = `${stStartDate}-${stEndDate}`;

              outcomesData[occ][objId].reviewDates[dateKey] = {};
              break;
            }
            case 'M': {
              const isoDate = dates.formatISO(dObj[key]).split('T')[0];
              const stDate = dates.formateToStandard(isoDate);
              const dateKey = MONTHS[stDate.split('/')[0]];
              outcomesData[occ][objId].reviewDates[dateKey] = {};
              break;
            }
            case 'Y': {
              const isoDate = dates.formatISO(dObj[key]).split('T')[0];
              const stDate = dates.formateToStandard(isoDate);
              const dateKey = stDate.split('/')[2];
              outcomesData[occ][objId].reviewDates[dateKey] = {};
              break;
            }
          }
        });
      });
    });
  }
  function setUnitType() {
    selectedDateSpan.to = selectedDate;

    switch (activeTab) {
      case NO_FREQ: {
        const dateObj = dates.subDays(new Date(`${selectedDate} 00:00:00`), NO_FREQ_SPAN);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Day(s)';
        spanLength = NO_FREQ_SPAN;
        break;
      }
      case HOUR: {
        const dateObj = dates.subHours(new Date(`${selectedDate} 00:00:00`), HOUR_SPAN);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Hour(s)';
        spanLength = HOUR_SPAN;
        break;
      }
      case DAY: {
        const dateObj = dates.subDays(new Date(`${selectedDate} 00:00:00`), DAY_SPAN);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Day(s)';
        spanLength = DAY_SPAN;
        break;
      }
      case WEEK: {
        let dateObj;

        if (WEEK_SPAN === 1) {
          dateObj = new Date(`${selectedDate} 00:00:00`)
        } else {
          dateObj = dates.subWeeks(new Date(`${selectedDate} 00:00:00`), WEEK_SPAN);
        }
        
        dateObj = dates.startDayOfWeek(dateObj);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Week(s)';
        spanLength = WEEK_SPAN;
        break;
      }
      case MONTH: {
        const dateObj = dates.subMonths(new Date(`${selectedDate} 00:00:00`), MONTH_SPAN);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Month(s)';
        spanLength = MONTH_SPAN;
        break;
      }
      case YEAR: {
        const dateObj = dates.subYears(new Date(`${selectedDate} 00:00:00`), YEAR_SPAN);
        selectedDateSpan.from = dates.formatISO(dateObj).split('T')[0];
        unitType = 'Year(s)';
        spanLength = YEAR_SPAN;
        break;
      }
      default: {
        console.error(activeTab);
        throw new Error('something went wrong setting unit types');
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
  function sortReviewTableData(dirtyData) {
    objIdSet = new Set();

    return dirtyData.reduce((a, d) => {
      const occurrence = d.objectiveRecurrance || 'NF';
      const objID = d.objectiveId;

      if (!occurrence || !objID) return a;

      objIdSet.add(objID);

      if (!a[occurrence]) {
        a[occurrence] = {};
      }

      if (!a[occurrence][objID]) {
        a[occurrence][objID] = {};
      }

      const freq = FREQUENCY[d.frequencyModifier] || '';
      const recurr = RECURRANCE[d.objectiveRecurrance] || '';

      a[occurrence][objID].showExclamation = false;
      a[occurrence][objID].individual = d.consumerName;
      a[occurrence][objID].serviceStatement = d.objectiveStatement;
      a[occurrence][objID].frequency = `${freq} ${d.objectiveIncrement} ${recurr}`;
      a[occurrence][objID].frequencyIncrement = d.objectiveIncrement;
      a[occurrence][objID].frequencyModifier = d.frequencyModifier;
      a[occurrence][objID].timesDoc = 0;
      a[occurrence][objID].successRate = 0;
      a[occurrence][objID].outcomeType = d.goalTypeDescription;
      a[occurrence][objID].outcomeTypeId = d.goalTypeId;

      return a;
    }, {});
  }
  function sortReviewTableDataSecondary(data, outcomeOjb) {
    timesDocByDate = {};

    data.forEach(d => {
      const occurrence = d.objectiveRecurrance || 'NF';
      const objID = d.objectiveId;
      const date = d.objective_date.split(' ')[0];
      const staffId = d.staffId;
      const activityId = d.objectiveActivityId;
      const percent = getPercentForSuccessRate(d.top_number, d.bottom_number);

      if (outcomeOjb[occurrence]) {
        if (outcomeOjb[occurrence][objID]) {
          outcomeOjb[occurrence][objID].successRate = percent;

          const prompt = dropdownData.prompts.find(p => p.Code === d.promptType);

          let dateThisBelongsTo;

          if (occurrence === 'NF') {
            outcomeOjb[occurrence][objID].timesDoc++;

            if (!outcomeOjb[occurrence][objID].reviewDates) {
              outcomeOjb[occurrence][objID].reviewDates = {};
            }

            if (!outcomeOjb[occurrence][objID].reviewDates['nf']) {
              outcomeOjb[occurrence][objID].reviewDates['nf'] = {};
            }

            if (!outcomeOjb[occurrence][objID].reviewDates['nf'][activityId]) {
              outcomeOjb[occurrence][objID].reviewDates['nf'][activityId] = {};
            }

            outcomeOjb[occurrence][objID].reviewDates['nf'][activityId].employee = d.employee;
            outcomeOjb[occurrence][objID].reviewDates['nf'][
              activityId
            ].result = `${d.objectiveSuccessSymbol} ${d.objectiveSuccessDescription}`;
            outcomeOjb[occurrence][objID].reviewDates['nf'][activityId].attempts = d.promptNumber;
            outcomeOjb[occurrence][objID].reviewDates['nf'][activityId].prompts = `${prompt ? prompt.Code : ''} ${prompt ? prompt.Caption : ''}`;
            outcomeOjb[occurrence][objID].reviewDates['nf'][activityId].note = d.objectiveActivityNote;
            outcomeOjb[occurrence][objID].reviewDates['nf'][activityId].activityId = d.objectiveActivityId;
            outcomeOjb[occurrence][objID].reviewDates['nf'][activityId].staffId = staffId;

            return;
          }
          if (occurrence === 'H') {
            if (d.startTime) {
              Object.keys(outcomeOjb[occurrence][objID].reviewDates).forEach(key => {
                let splitStart = d.startTime.split(':');
                let splitKey = key.split(':');

                if (splitStart[0] === splitKey[0]) {
                  dateThisBelongsTo = key;
                }
              });
            }
          }
          if (occurrence === 'D') {
            const splitDate = date.split('/');
            const month = splitDate[0] < 10 ? `0${splitDate[0]}` : splitDate[0];
            const day = splitDate[1] < 10 ? `0${splitDate[1]}` : splitDate[1];
            const year = splitDate[2];
            
            dateThisBelongsTo = `${month}/${day}/${year}`;
          }
          if (occurrence === 'W') {
            Object.keys(outcomeOjb[occurrence][objID].reviewDates).forEach(key => {
              const [start, end] = key.split('-');
              const afterDate = new Date(`${start} 00:00:00`);
              const endDate = new Date(`${end} 00:00:00`);
              const compareDate = new Date(`${date} 00:00:00`);
              const isAfter = dates.isAfter(compareDate, afterDate);
              const isBefore = dates.isBefore(compareDate, endDate);

              if (isAfter && isBefore) {
                dateThisBelongsTo = key;
              }
            });
          }
          if (occurrence === 'M') {
            Object.keys(outcomeOjb[occurrence][objID].reviewDates).forEach(key => {
              let [month, day, year] = date.split('/');
              if (month < 10 && month.length === 1) {
                month = `0${month}`;
              }

              if (MONTHS[month] === key) {
                dateThisBelongsTo = key;
              }
            });
          }
          if (occurrence === 'Y') {
            Object.keys(outcomeOjb[occurrence][objID].reviewDates).forEach(key => {
              const [month, day, year] = date.split('/');
              if (year === key) {
                dateThisBelongsTo = key;
              }
            });
          }

          if (!dateThisBelongsTo) return;
          if (!outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo]) return;

          outcomeOjb[occurrence][objID].timesDoc++;

          if (!timesDocByDate[occurrence]) timesDocByDate[occurrence] = {};
          if (!timesDocByDate[occurrence][objID]) timesDocByDate[occurrence][objID] = {};
          if (!timesDocByDate[occurrence][objID][dateThisBelongsTo]) timesDocByDate[occurrence][objID][dateThisBelongsTo] = {};
          if (!timesDocByDate[occurrence][objID][dateThisBelongsTo].timesDoc) {
            timesDocByDate[occurrence][objID][dateThisBelongsTo].timesDoc = 1;
          } else {
            timesDocByDate[occurrence][objID][dateThisBelongsTo].timesDoc++;
          }
          
          if (!outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][activityId]) {
            outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][activityId] = {};
          }

          outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][activityId].employee = d.employee;
          outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][
            activityId
          ].result = `${d.objectiveSuccessSymbol} ${d.objectiveSuccessDescription}`;
          outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][activityId].attempts = d.promptNumber;
          outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][
            activityId
          ].prompts = `${prompt ? prompt.Code : ''} ${prompt ? prompt.Caption : ''}`;
          outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][activityId].note = d.objectiveActivityNote;
          outcomeOjb[occurrence][objID].reviewDates[dateThisBelongsTo][activityId].activityId = d.objectiveActivityId;
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

    outcomesData = sortReviewTableData(data);
    setTabSections();
    setUnitType();
  }
  async function getReviewTableDataSecondary() {
    exclamationDateMap = {};
    setDatesForMiddleTier();

    const frequency = FREQ_MAP[activeTab];
    const data = await outcomesAjax.getReviewTableDataSecondary({
      consumerId: selectedConsumerId,
      startDate: selectedDateSpan.from,
      endDate: selectedDateSpan.to,
      objectiveIdList: Array.from(objIdSet).join(','),
      frequency,
    });

    outcomesDataSecondaryRaw = data.gridSecondary;
    exclamationIds = data.exIds.map(idObj => idObj.objective_id);
    exclamationSecondaryIds = data.exIds.map(idObj => idObj.Staff_ID);

    sortReviewTableDataSecondary(data.gridSecondary, outcomesData);

    Object.keys(outcomesData[frequency]).forEach(objId => {
      if (outcomesData[frequency][objId].timesDoc > 0) {
        if (!outcomesData[frequency][objId].successRate) {
          outcomesData[frequency][objId].successRate = '100%';
        }
      }

      if (exclamationIds && exclamationIds.find(ids => ids === objId)) {
        outcomesData[frequency][objId].showExclamation = true;
      }

      if (outcomesData[frequency][objId].reviewDates) {
        Object.keys(outcomesData[frequency][objId].reviewDates).forEach(rDate => {
          const freqMod = outcomesData[frequency][objId].frequencyModifier;
          const freqInc = outcomesData[frequency][objId].frequencyIncrement;
          const timesDoc = outcomesData[frequency][objId].timesDoc;
          let timesDocDate = 0;

          if (timesDocByDate[frequency] && timesDocByDate[frequency][objId] && timesDocByDate[frequency][objId][rDate]) {
            timesDocDate = timesDocByDate[frequency][objId][rDate].timesDoc ?? 0;
          }

          if (!exclamationDateMap[objId]) exclamationDateMap[objId] = {};

          if (freqMod === 'OBJFMAL' && timesDocDate < parseInt(freqInc)) {
            //'At least'
            exclamationDateMap[objId][rDate] = true;
          }
          if (freqMod === 'OBJFMEX' && timesDocDate !== parseInt(freqInc)) {
            //'Exactly'
            exclamationDateMap[objId][rDate] = true;
          }
          if (freqMod === 'OBJFMNM' && timesDocDate > parseInt(freqInc)) {
            //'No more than'
            exclamationDateMap[objId][rDate] = true;
          }
        });
      }
    });
  }
  
  async function init({ consumer, consumerName, date, allowedConsumerIds }) {
    console.clear();

    selectedConsumerId = consumer.id;
    selectedConsumerCard = consumer.card;
    selectedConsumerName = consumerName;
    selectedDate = date;
    serviceFilterVal = {
      text: 'All',
      value: 'All'
    };
    outcomeTypeFilterVal = {
      text: 'All',
      value: '%'
    };
    currentDateTime = new Date();

    setActiveModuleSectionAttribute('outcomes-review');
    PROGRESS.SPINNER.show('Loading Outcomes...');

    otherData = outcomes.getDataForOverview();
    dropdownData = outcomes.getDropdownValues();

    await getReviewTableData();
    await getReviewTableDataSecondary();

    DOM.clearActionCenter();

    outcomesReviewDiv = _DOM.createElement('div');
    outcomesReviewDiv.classList.add('outcomesReview');

    consumerCardHeader = buildConsumerCard();

    const filterDisplay = buildCurrentFilterdisplay();
    outcomeTabs = buildTabs();

    outcomesReviewDiv.appendChild(consumerCardHeader);
    outcomesReviewDiv.appendChild(filterDisplay);
    outcomesReviewDiv.appendChild(outcomeTabs);
    DOM.ACTIONCENTER.appendChild(outcomesReviewDiv);

    updateCurrentFilterDisplay();
    populateTabSections();

    roster2.setAllowedConsumers(allowedConsumerIds);
    roster2.addConsumerToActiveConsumers(selectedConsumerCard);
    roster2.miniRosterinit(null, {
      hideDate: true,
    });

    goalTypes = await outcomesAjax.getAllGoalTypes();
    outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(
      selectedConsumerId,
      dates.formateToISO(selectedDate),
      results => sortLocations(results),
    );
  }

  return {
    init,
    handleActionNavEvent,
  };
})();
