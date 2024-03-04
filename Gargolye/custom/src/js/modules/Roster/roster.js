const roster2 = (function () {
  // CAHCED DATA
  let rosterLocations; // cached roster locations
  let rosterGroups; // cached roster groups
  let rosterConsumers; // cached list of consumers
  let groupedRosterConsumers; // cached list of consumers
  let absentConsumers;
  let consumersWithUnreadNotes;
  let locationsWithUnreadNotes; //
  // DOM
  let ROSTER_LIST;
  let ROSTER_WRAP;
  let ROSTER_SPINNER;
  let LOAD_MORE_BTN;
  let FILTER_BTN;
  let SEARCH_WRAP;
  let SEARCH_BTN;
  let SEARCH_INPUT;
  let SELECT_ALL_BTN;
  let DESELECT_ALL_BTN;
  let LOCATION_NOTES_BTN;
  let MASS_ABSENT_BTN;
  var FILTER_POPUP;
  let loadingRosterWrap;
  let loadRosterSpinner;
  // DOM - MINI ROSTER
  let MINI_ROSTER_BTN;
  let MINI_ROSTER_POPUP;
  let MINI_ROSTER_DONE;
  let MINI_ROSTER_CANCEL;
  // filtering
  let selectedDate;
  let selectedLocationName;
  let selectedLocationId;
  let selectedGroupCode;
  let selectedGroupId;
  let selectedGroupName;
  let hideDateFilter;

  let btnWrap;
  let filteredDateBtnWrap;
  let selectedLocationNameBtnWrap;
  let selectedGroupNameBtnWrap;
  let totalConsumerCountBtnWrap;
  var filteredDate;
  // VALUES
  let rosterListSelectable;
  let selectedConsumers = [];
  let selectedConsumerCache = [];
  let activeConsumers = [];
  let allowedConsumerIds;
  let consumersWithAlerts;
  let totalConsumerCount = 0;
  // Roster Groups/Pagination
  let rosterGroupCount;
  let activeGroup;

  var locationHasUnreadNote;
  // Selected & Active Consumers
  //---------------------------------------------
  function selectedConsumersToActiveList() {
    selectedConsumers.forEach(sc => sc.card.classList.remove('highlighted'));
    activeConsumers = [...activeConsumers, ...selectedConsumers];
    selectedConsumerCache = selectedConsumers;
    selectedConsumers = [];
  }
  // Selected*
  function addConsumerToSelectedConsumers(consumer) {
    selectedConsumers.push({
      id: consumer.dataset.consumerId,
      card: consumer,
    });
  }
  function removeConsumerFromSelectedConsumers(consumerId) {
    selectedConsumers = selectedConsumers.filter(c => c.id !== consumerId);
  }
  function getSelectedConsumers() {
    return [...selectedConsumers];
  }
  function getSelectedConsumersCache() {
    return [...selectedConsumerCache];
  }
  /*
            I created selected consumers miniroster to have a function
            that gives you only the consumers that were selected in the mini roster
            GetActiveConsumers gives you the active consumers on the roster, even if they
            werent just selected
        */
  function getSelectedConsumersMiniRoster() {
    return [...selectedConsumerCache];
  }
  /**
   * Returns all roster consumers.
   *
   * @async
   * @returns {Object[]} Returns Array of consumer objects
   * -- FN: First Name
   * -- IDa: ?
   * -- LId: service location id's seperated by |
   * -- LN: Last Name
   * -- MN: Middle Name
   * -- SD: ?
   * -- conL: primary location id
   * -- id: consumer id
   */
  async function getAllRosterConsumers() {
    if (rosterConsumers) {
      return [...rosterConsumers];
    } else {
      await getRosterData();
      await getRosterConsumersData();
      return [...rosterConsumers];
    }
  }
  function clearSelectedConsumers() {
    selectedConsumers = [];
    // clearHighlightedConsumers();
    return selectedConsumers;
  }
  // Active*
  function addConsumerToActiveConsumers(consumer) {
    activeConsumers.push({
      id: consumer.dataset.consumerId,
      card: consumer,
    });
  }
  function removeConsumerFromActiveConsumers(consumerId) {
    activeConsumers = activeConsumers.filter(c => c.id !== consumerId);
  }
  function getActiveConsumers() {
    return [...activeConsumers];
  }
  function clearActiveConsumers() {
    activeConsumers = [];
    return activeConsumers;
  }

  // Util
  //---------------------------------------------
  function clearHighlightedConsumers() {
    if (!ROSTER_LIST) return;
    var consumers = [].slice.call(ROSTER_WRAP.querySelectorAll('.consumerCard.highlighted'));
    if (consumers.length > 1) {
      consumers.forEach(c => {
        c.classList.remove('consumer-selected', 'highlighted');
      });
    }
  }
  function removeMiniRosterBtn() {
    var miniRosterBtn = document.querySelector('.consumerListBtn');
    if (miniRosterBtn) {
      document.body.removeChild(miniRosterBtn);
    }
  }
  function getSelectedLocationObj() {
    return {
      locationName: selectedLocationName,
      locationId: selectedLocationId,
    };
  }
  function getSelectedDate() {
    return selectedDate;
  }
  function getRosterLocations() {
    return rosterLocations;
  }
  function getConsumersWithUnreadNotes() {
    return consumersWithUnreadNotes;
  }
  function updateSelectedDate(date) {
    selectedDate = date;
  }
  function updateSelectedLocationId(locationId, locationName) {
    selectedLocationId = locationId;
    selectedGroupId = locationId;
    selectedLocationName = locationName;
  }
  function setRosterGroups(rosterData) {
    rosterGroups = rosterData;
    selectedGroupCode = rosterData[0].GroupCode;
    selectedGroupId = rosterData[0].RetrieveID;
    // selectedGroupName = rosterData[0].GroupName;
    $.session.formsCaseload == true && $.loadedApp === 'forms'
      ? (selectedGroupName = 'Caseload')
      : (selectedGroupName = selectedGroupName = rosterData[0].GroupName);
  }
  function setSelectedGroupData() {
    var defaultRosterGroup = defaults.getLocation('rosterGroup').split('-');
    var defaultRosterGroupCode = defaultRosterGroup[0];
    var defaultRosterGroupID = defaultRosterGroup[1];

    rosterGroups.forEach(g => {
      if (g.GroupCode === defaultRosterGroupCode && g.RetrieveID === defaultRosterGroupID) {
        selectedGroupCode = g.GroupCode;
        selectedGroupId = g.RetrieveID;
        // selectedGroupName = g.GroupName;
        $.session.formsCaseload == true && $.loadedApp === 'forms'
          ? (selectedGroupName = 'Caseload')
          : (selectedGroupName = g.GroupName);
      }
    });

    if (!selectedGroupName) {
      selectedGroupCode = rosterGroups[0].GroupCode;
      selectedGroupId = rosterGroups[0].RetrieveID;
      selectedGroupName = rosterGroups[0].GroupName;
    }

    if ($.session.formsCaseload == true && $.loadedApp === 'forms') selectedGroupName = 'Caseload';
  }
  function setSelectedLocationData() {
    if (defaults.getLocation('roster') !== '') {
      selectedLocationId = defaults.getLocation('roster');

      var selectedLocationObj = rosterLocations.filter(loc => {
        return selectedLocationId === loc.ID;
      });

      selectedLocationName = selectedLocationObj[0].Name;
      $.session.selectedLocation = [selectedLocationId, selectedLocationName];
    }

    if (!selectedLocationId) {
      selectedLocationId = '0';
      selectedLocationName = 'All';
    }
  }
  function setCustomDefaultLocationData({ locationId, locationName }) {
    selectedLocationName = locationName;
    selectedLocationId = locationId;
  }
  function setAllowedConsumers(idArray) {
    // Allowed Consumers *Per Module
    allowedConsumerIds = [];
    consumersWithAlerts = [];

    if (idArray[0] === '%') {
      allowedConsumerIds = ['%'];
      return;
    }

    idArray.forEach(r => {
      const id = r.consumer_id ? r.consumer_id : r;
      allowedConsumerIds.push(id);
      if (r.showAlertIcon) consumersWithAlerts.push(id);
    });
  }

  // Search
  //---------------------------------------------
  function searchRoster(searchValue) {
    searchValue = searchValue.toLowerCase();
    const consumers = rosterConsumers.filter(rc => {
      var firstName = rc.FN.toLowerCase();
      var lastName = rc.LN.toLowerCase();
      var middleName = rc.MN.toLowerCase(); //
      var fullName = `${firstName} ${middleName} ${lastName}`;
      var fullNameReversed = `${lastName} ${firstName} ${middleName}`;
      var matchesName = fullName.indexOf(searchValue);
      var matchesNameReverse = fullNameReversed.indexOf(searchValue);

      return matchesName !== -1 || matchesNameReverse !== -1;
    });

    const rosterlists = [...ROSTER_WRAP.querySelectorAll('.roster__list')];
    rosterlists && rosterlists.forEach(rl => ROSTER_WRAP.removeChild(rl));
    groupRosterConsumers(consumers);
    populateRoster();
    totalConsumerCount = consumers.length;
    updateTotalConsumerCount();
  }
  // Filtering
  //---------------------------------------------
  function updateTotalConsumerCount() {
    if (document.getElementById('totalConsumerCountBtn') != null)
      document.getElementById('totalConsumerCountBtn').innerHTML = 'Total Consumer Count: ' + totalConsumerCount;
  }
  function buildFilteredBy() {
    var filteredBy = document.querySelector('.widgetFilteredBy');

    var splitDate = selectedDate.split('-');
    filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(splitDate[2])}/${splitDate[0].slice(2, 4)}`;

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
      filteredBy1 = document.createElement('div');
      filteredBy1.classList.add('filteredByData');
      filterButtonSet();
      filteredBy1.appendChild(btnWrap);
      filteredBy.appendChild(filteredBy1);
    }

    if (document.getElementById('filteredDateBtn') != null)
      document.getElementById('filteredDateBtn').innerHTML = 'Date: ' + filteredDate;

    if (hideDateFilter) {
      btnWrap.removeChild(filteredDateBtnWrap);
    }

    if (selectedLocationName === '%' || selectedLocationName === 'All') {
      btnWrap.appendChild(selectedLocationNameBtnWrap);
      btnWrap.removeChild(selectedLocationNameBtnWrap);
    } else {
      btnWrap.appendChild(selectedLocationNameBtnWrap);
      if (document.getElementById('selectedLocationNameBtn') != null)
        document.getElementById('selectedLocationNameBtn').innerHTML = 'Location: ' + selectedLocationName;
    }

    if (selectedGroupName === '%' || selectedGroupName === 'Everyone') {
      btnWrap.appendChild(selectedGroupNameBtnWrap);
      btnWrap.removeChild(selectedGroupNameBtnWrap);
    } else {
      btnWrap.appendChild(selectedGroupNameBtnWrap);
      if (document.getElementById('selectedGroupNameBtn') != null)
        document.getElementById('selectedGroupNameBtn').innerHTML = 'Group: ' + selectedGroupName;
    }

    if (document.getElementById('totalConsumerCountBtn') != null)
      document.getElementById('totalConsumerCountBtn').innerHTML = 'Total Consumer Count: ' + totalConsumerCount;

    return filteredBy;
  }

  function filterButtonSet() {
    filteredDateBtn = button.build({
      id: 'filteredDateBtn',
      text: 'Date: ' + filteredDate,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        buildFilterPopup('filteredDateBtn');
      },
    });

    selectedLocationNameBtn = button.build({
      id: 'selectedLocationNameBtn',
      text: 'Location: ' + selectedLocationName,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        buildFilterPopup('selectedLocationNameBtn');
      },
    });
    selectedLocationNameCloseBtn = button.build({
      icon: 'Delete',
      style: 'secondary',
      type: 'text',
      classNames: 'filterCloseBtn',
      callback: () => {
        closeFilter('selectedLocationNameBtn');
      },
    });

    selectedGroupNameBtn = button.build({
      id: 'selectedGroupNameBtn',
      text: 'Group: ' + selectedGroupName,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        buildFilterPopup('selectedGroupNameBtn');
      },
    });
    selectedGroupNameCloseBtn = button.build({
      icon: 'Delete',
      style: 'secondary',
      type: 'text',
      classNames: 'filterCloseBtn',
      callback: () => {
        closeFilter('selectedGroupNameBtn');
      },
    });

    totalConsumerCountBtn = button.build({
      id: 'totalConsumerCountBtn',
      text: 'Total Consumer Count: ' + totalConsumerCount,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
    });

    btnWrap = document.createElement('div');
    btnWrap.classList.add('filterBtnWrap');

    filteredDateBtnWrap = document.createElement('div');
    filteredDateBtnWrap.classList.add('filterSelectionFirstBtnWrap');
    filteredDateBtnWrap.appendChild(filteredDateBtn);
    btnWrap.appendChild(filteredDateBtnWrap);

    selectedLocationNameBtnWrap = document.createElement('div');
    selectedLocationNameBtnWrap.classList.add('filterSelectionBtnWrap');
    selectedLocationNameBtnWrap.appendChild(selectedLocationNameBtn);
    selectedLocationNameBtnWrap.appendChild(selectedLocationNameCloseBtn);
    btnWrap.appendChild(selectedLocationNameBtnWrap);

    selectedGroupNameBtnWrap = document.createElement('div');
    selectedGroupNameBtnWrap.classList.add('filterSelectionBtnWrap');
    selectedGroupNameBtnWrap.appendChild(selectedGroupNameBtn);
    selectedGroupNameBtnWrap.appendChild(selectedGroupNameCloseBtn);
    btnWrap.appendChild(selectedGroupNameBtnWrap);

    totalConsumerCountBtnWrap = document.createElement('div');
    totalConsumerCountBtnWrap.classList.add('filterSelectionBtnWrap');
    totalConsumerCountBtnWrap.appendChild(totalConsumerCountBtn);
    btnWrap.appendChild(totalConsumerCountBtnWrap);
  }

  async function closeFilter(closeFilter) {
    if (closeFilter == 'selectedLocationNameBtn') {
      selectedLocationName = 'All';
      selectedLocationId = '0';
      selectedGroupName = 'Everyone';
      selectedGroupCode = 'ALL';
      btnWrap.removeChild(selectedLocationNameBtnWrap);
      const groupResults = await getConsumerGroupsData(selectedLocationId);
      rosterGroups = groupResults;
      $.session.selectedLocation = [selectedLocationId, selectedLocationName];
    }
    if (closeFilter == 'selectedGroupNameBtn') {
      selectedGroupName = 'Everyone';
      selectedGroupCode = 'ALL';
      btnWrap.removeChild(selectedGroupNameBtnWrap);
    }
    filterApply();
  }

  function buildDateInput() {
    var defaultVal = selectedDate ? selectedDate : UTIL.getTodaysDate();
    var date = input.build({
      type: 'date',
      label: 'Date',
      style: 'secondary',
      value: defaultVal,
      attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
    });

    return date;
  }
  function buildLocationDropdown() {
    var locationDropdown = dropdown.build({
      dropdownId: 'rosterLocationDropdown',
      label: 'Locations',
      style: 'secondary',
    });

    return locationDropdown;
  }
  function buildGroupDropdown() {
    var groupDropdown = dropdown.build({
      dropdownId: 'rosterGroupDropdown',
      label: 'Groups',
      style: 'secondary',
      readonly: $.session.formsCaseload == true && $.loadedApp === 'forms' ? true : false,
    });

    return groupDropdown;
  }
  function buildFilterPopup(IsShow) {
    // popup
    FILTER_POPUP = POPUP.build({
      classNames: ['rosterFilterPopup'],
      hideX: true,
    });
    // dropdowns & inputs
    DATE_INPUT = buildDateInput();
    LOCATION_DROPDOWN = buildLocationDropdown();
    GROUP_DROPDOWN = buildGroupDropdown();
    // apply filters button
    APPLY_BTN = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    CANCEL_BTN = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(APPLY_BTN);
    btnWrap.appendChild(CANCEL_BTN);

    // build popup
    if (!hideDateFilter) {
      if (IsShow == 'ALL' || IsShow == 'filteredDateBtn') FILTER_POPUP.appendChild(DATE_INPUT);
    }
    if (IsShow == 'ALL' || IsShow == 'selectedLocationNameBtn') FILTER_POPUP.appendChild(LOCATION_DROPDOWN);
    if (IsShow == 'ALL' || IsShow == 'selectedGroupNameBtn') FILTER_POPUP.appendChild(GROUP_DROPDOWN);
    FILTER_POPUP.appendChild(btnWrap);

    setupFilterEvent();

    POPUP.show(FILTER_POPUP);

    populateLocationDropdown();
    populateGroupDropdown();
  }
  // filter dropdowns
  function populateLocationDropdown() {
    var defaultVal = selectedLocationId ? selectedLocationId : defaults.getLocation('roster');
    var defaultValName;
    var data = rosterLocations.map(r => {
      var attributes = [{ key: 'data-residence', value: r.Residence }];

      var hasUnreadLocationNote = locationsWithUnreadNotes.filter(loc => loc.loc_id === r.ID);
      hasUnreadLocationNote = hasUnreadLocationNote.length > 0 ? true : false;

      if (r.ID === defaultVal) {
        defaultValName = r.Name;
        if (hasUnreadLocationNote) {
          LOCATION_NOTES_BTN.classList.add('attention');
        } else {
          LOCATION_NOTES_BTN.classList.remove('attention');
        }
      }

      if (hasUnreadLocationNote) {
        attributes.push({ key: 'data-hasUnreadNote', value: 'true' });
      } else {
        attributes.push({ key: 'data-hasUnreadNote', value: 'false' });
      }

      return {
        id: r.ID,
        value: r.ID,
        text: r.Name,
        attributes,
      };
    });
    var allOpt = {
      value: '0',
      text: 'All',
    };

    data.unshift(allOpt);

    dropdown.populate(LOCATION_DROPDOWN, data, defaultVal);

    selectedLocationId = defaultVal;
    if (selectedLocationId === '0') {
      selectedLocationName = 'All';
    } else {
      selectedLocationName = defaultValName;
    }
  }
  function populateGroupDropdown() {
    var locId = selectedLocationId === '0' ? '0' : selectedLocationId;
    var defaultVal;
    if ($.session.formsCaseload == true && $.loadedApp === 'forms') {
      defaultVal = `CAS-${locId}`;
      selectedGroupCode = 'CAS';
    } else {
      defaultVal = selectedGroupCode
        ? selectedGroupCode === 'ALL'
          ? `${selectedGroupCode}-${locId}`
          : `${selectedGroupCode}-${selectedGroupId}`
        : '';
    }

    groupCodeObj = {};

    var data = rosterGroups.map(r => {
      // dataObj for quick lookup
      if (!groupCodeObj[r.GroupCode]) {
        groupCodeObj[r.GroupCode] = {
          groupCode: r.GroupCode,
          groupName: r.GroupName,
          members: r.Members ? r.Members.split('|') : r.Members,
        };
      }

      return {
        value: `${r.GroupCode}-${r.RetrieveID}`,
        text: r.GroupName,
        attributes: [{ key: 'data-retrieveId', value: r.RetrieveID }],
      };
    });

    dropdown.populate('rosterGroupDropdown', data, defaultVal);

    if (!selectedGroupName) {
      selectedGroupCode = data[0].value;
      selectedGroupName = data[0].text;
      selectedGroupId = data[0].attributes[0].value;
    }
  }
  // filter events
  function setupFilterEvent() {
    var oldDate;
    var oldLocationName;
    var oldLocationId;
    var oldGroupCode;
    var oldGroupId;
    var oldGroupName;
    var oldRosterGroups;

    var locationHasUnreadNote;

    DATE_INPUT.addEventListener('change', event => {
      oldDate = selectedDate;
      selectedDate = event.target.value;
    });
    LOCATION_DROPDOWN.addEventListener('change', event => locationDropdownEvent(event));
    async function locationDropdownEvent(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      oldLocationId = selectedLocationId;
      oldLocationName = selectedLocationName;
      selectedLocationId = selectedOption.value;
      selectedLocationName = selectedOption.innerHTML;
      $.session.selectedLocation = [selectedLocationId, selectedLocationName];
      toggleMassAbsentBtn();
      toggleLocationNotesBtn();

      const hasUnreadNote = selectedOption.dataset.hasunreadnote === 'true' ? true : false;
      locationHasUnreadNote = hasUnreadNote;

      const groupResults = await getConsumerGroupsData(selectedLocationId);

      oldRosterGroups = rosterGroups;
      oldGroupId = selectedGroupId;
      oldGroupCode = selectedGroupCode;
      oldGroupName = selectedGroupName;

      rosterGroups = groupResults;
      selectedGroupId = groupResults[0].RetrieveID;
      selectedGroupCode = groupResults[0].GroupCode;
      // selectedGroupName = groupResults[0].GroupName;
      $.session.formsCaseload == true && $.loadedApp === 'forms'
        ? (selectedGroupName = 'Caseload')
        : (selectedGroupName = groupResults[0].GroupName);
      //selectedLocationId = tmpLocationId;
      populateGroupDropdown();
    }
    GROUP_DROPDOWN.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      oldGroupId = selectedGroupId;
      oldGroupCode = selectedGroupCode;
      oldGroupName = selectedGroupName;

      selectedGroupCode = selectedOption.value.split('-')[0];
      selectedGroupId = selectedOption.dataset.retrieveid;
      selectedGroupName = selectedOption.innerHTML;
    });
    APPLY_BTN.addEventListener('click', async () => {
      POPUP.hide(FILTER_POPUP);
      filterApply();
    });
    CANCEL_BTN.addEventListener('click', () => {
      POPUP.hide(FILTER_POPUP);

      if (oldDate) selectedDate = oldDate;
      if (oldLocationId) selectedLocationId = oldLocationId;
      if (oldLocationName) selectedLocationName = oldLocationName;
      if (oldGroupId) selectedGroupId = oldGroupId;
      if (oldGroupCode) selectedGroupCode = oldGroupCode;
      if (oldGroupName) selectedGroupName = oldGroupName;
      if (oldRosterGroups) rosterGroups = oldRosterGroups;
    });
  }

  function filterUpdateDisplay() {
    if (selectedDate === '') {
      selectedDate = UTIL.getTodaysDate();
    }
    var splitDate = selectedDate.split('-');
    filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(splitDate[2])}/${splitDate[0].slice(2, 4)}`;

    if (document.getElementById('filteredDateBtn') != null)
      document.getElementById('filteredDateBtn').innerHTML = 'Date: ' + filteredDate;

    if (selectedLocationName === '%' || selectedLocationName === 'All') {
      btnWrap.appendChild(selectedLocationNameBtnWrap);
      btnWrap.removeChild(selectedLocationNameBtnWrap);
    } else {
      btnWrap.appendChild(selectedLocationNameBtnWrap);
      document.getElementById('selectedLocationNameBtn').innerHTML = 'Location: ' + selectedLocationName;
    }

    if (selectedGroupName === '%' || selectedGroupName === 'Everyone') {
      btnWrap.appendChild(selectedGroupNameBtnWrap);
      btnWrap.removeChild(selectedGroupNameBtnWrap);
    } else {
      btnWrap.appendChild(selectedGroupNameBtnWrap);
      document.getElementById('selectedGroupNameBtn').innerHTML = 'Group: ' + selectedGroupName;
    }

    document.getElementById('totalConsumerCountBtn').innerHTML = 'Total Consumer Count: ' + totalConsumerCount;

    if (!rosterListSelectable) {
      consumerInfo.toggleHideShowAbsentMenuSection(selectedLocationId);
    }

    if (selectedLocationId !== '000') {
      if (defaults.rememberLastLocation('roster')) defaults.setLocation('roster', selectedLocationId);
    }

    if ($.loadedApp === 'ConsumerFinances' || $.loadedApp === 'CFEditAccount') {
      if (defaults.rememberLastLocation('moneyManagement')) defaults.setLocation('moneyManagement', selectedLocationId);
    }
  }
  async function filterApply() {
    customGroups.init(rosterGroups);

    if (locationHasUnreadNote) {
      LOCATION_NOTES_BTN.classList.add('attention');
    } else {
      LOCATION_NOTES_BTN.classList.remove('attention');
    }

    const rosterlists = [...ROSTER_WRAP.querySelectorAll('.roster__list')];
    rosterlists.forEach(rl => ROSTER_WRAP.removeChild(rl));

    ROSTER_SPINNER = PROGRESS.SPINNER.get('Please wait while we gather everyone up...');
    ROSTER_WRAP.insertBefore(ROSTER_SPINNER, ROSTER_WRAP.lastChild);
    totalConsumerCount = 0;
    await getRosterConsumersData(true);
    //Ugly... should be re-done to be able to pass a custom apply action for the filter if needed
    // but I'm running out of thime for this release. THis is needed to reset the set allowed consumers
    //when filtering on a location or group.
    if ($.loadedApp === 'timeEntry') {
      await timeEntryCard.customRosterApplyFilterEvent();
    }
    populateRoster();
    filterUpdateDisplay();
  }
  // Top Nav
  //---------------------------------------------
  function toggleLocationNotesBtn() {
    if (selectedLocationId === '0' || selectedLocationName === 'All' || $.session.useProgressNotes === 'N') {
      LOCATION_NOTES_BTN.classList.add('disabled');
      LOCATION_NOTES_BTN.classList.remove('attention');
    } else {
      LOCATION_NOTES_BTN.classList.remove('disabled');
    }
  }
  function toggleMassAbsentBtn() {
    var useAbsent = $.session.useAbsentFeature === 'Y' ? true : false;

    if (!useAbsent || selectedLocationId === '0' || selectedLocationName === 'All') {
      MASS_ABSENT_BTN.classList.add('disabled');
    } else {
      MASS_ABSENT_BTN.classList.remove('disabled');
    }
  }
  function buildFilterBtn() {
    return button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtn',
    });
  }
  function buildSearchBtn() {
    return button.build({
      id: 'searchBtn',
      text: 'Search',
      icon: 'search',
      style: 'secondary',
      type: 'contained',
      classNames: ['searchBtn'],
    });
  }
  function buildSelectAllBtn() {
    return button.build({
      icon: 'selectAll',
      style: 'secondary',
      type: 'contained',
      classNames: 'selectAllBtn',
    });
  }
  function buildDeSelectAllBtn() {
    return button.build({
      icon: 'deSelectAll',
      style: 'secondary',
      type: 'contained',
      classNames: 'deselectAllBtn',
    });
  }
  function buildLocationNotesBtn() {
    var hasUnreadLocationNote =
      locationsWithUnreadNotes && locationsWithUnreadNotes.filter(loc => loc.loc_id === selectedLocationId);
    hasUnreadLocationNote = hasUnreadLocationNote.length > 0 ? true : false;

    const locationNotesBtnClassNames = ['locationNotesBtn'];

    if (selectedLocationId === '0' || selectedLocationName === 'All' || $.session.useProgressNotes === 'N') {
      locationNotesBtnClassNames.push('disabled');
    }
    if (hasUnreadLocationNote && $.session.useProgressNotes === 'Y') {
      locationNotesBtnClassNames.push('attention');
    }

    return button.build({
      text: 'Location Notes',
      style: 'secondary',
      type: 'contained',
      icon: 'note',
      classNames: locationNotesBtnClassNames,
    });
  }
  function buildMassAbsentBtn() {
    var useAbsent = $.session.useAbsentFeature === 'Y' ? true : false;

    return button.build({
      text: 'Mass Absent',
      style: 'secondary',
      type: 'contained',
      icon: 'no',
      classNames:
        selectedLocationId === '0' || selectedLocationName === 'All' || !useAbsent
          ? ['massAbsentBtn', 'disabled']
          : ['massAbsentBtn'],
      toggle: true,
    });
  }
  function buildManageGroupsBtn() {
    return button.build({
      text: 'Manage Groups',
      style: 'secondary',
      type: 'contained',
      icon: 'people',
    });
  }
  function buildRosterTopNav() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('roster-top-nav');

    FILTER_BTN = buildFilterBtn();
    SEARCH_BTN = buildSearchBtn();
    SELECT_ALL_BTN = buildSelectAllBtn();
    DESELECT_ALL_BTN = buildDeSelectAllBtn();
    LOCATION_NOTES_BTN = buildLocationNotesBtn();
    MASS_ABSENT_BTN = buildMassAbsentBtn();
    MANAGE_GROUPS_BTN = buildManageGroupsBtn();

    // custom search stuff
    SEARCH_WRAP = document.createElement('div');
    // SEARCH_WRAP.classList.add('rosterSearch', 'searchOpen');
    SEARCH_WRAP.classList.add('rosterSearch');
    SEARCH_INPUT = document.createElement('input');
    SEARCH_INPUT.setAttribute('placeholder', 'search consumers');
    SEARCH_WRAP.appendChild(SEARCH_BTN);
    SEARCH_WRAP.appendChild(SEARCH_INPUT);

    if (rosterListSelectable) {
      var wrap1 = document.createElement('div');
      var wrap2 = document.createElement('div');
      wrap1.classList.add('btnWrap');
      wrap2.classList.add('btnWrap');
      // btns to show => selectAll, deselectAll
      wrap1.appendChild(SEARCH_WRAP);
      wrap2.appendChild(FILTER_BTN);
      wrap2.appendChild(SELECT_ALL_BTN);
      wrap2.appendChild(DESELECT_ALL_BTN);

      btnWrap.appendChild(wrap1);
      btnWrap.appendChild(wrap2);
    } else {
      var wrap1 = document.createElement('div');
      var wrap2 = document.createElement('div');
      wrap1.classList.add('btnWrap');
      wrap2.classList.add('btnWrap');
      wrap2.classList.add('rosterNotesAbsentGroups');
      // btns to show => search, notes, absent, groups
      wrap1.appendChild(FILTER_BTN);
      wrap1.appendChild(SEARCH_WRAP);

      wrap2.appendChild(LOCATION_NOTES_BTN);
      wrap2.appendChild(MASS_ABSENT_BTN);
      wrap2.appendChild(MANAGE_GROUPS_BTN);

      btnWrap.appendChild(wrap1);
      btnWrap.appendChild(wrap2);
    }

    return btnWrap;
  }

  // Roster Consumers
  //---------------------------------------------
  function populateConsumerCardPortraits() {
    const consumerCards = [...document.querySelectorAll('.consumerCard')];
    consumerCards.forEach(card => {
      const id = card.dataset.consumerId;
      const portrait = card.querySelector('.portrait');
      portrait.innerHTML = `
       <img
         src="./images/portraits/${id}.png"
         onerror="this.src='./images/new-icons/default.jpg'"
       />`;
    });
  }
  function buildConsumerCard(consumerData) {
    const fName = consumerData.FN ? consumerData.FN.trim() : '';
    const lName = consumerData.LN ? consumerData.LN.trim() : '';
    const mName = consumerData.MN ? consumerData.MN.trim() : '';
    const id = consumerData.id;
    const serviceLocations = consumerData.LId;
    const primaryLocation = consumerData.conL;
    const hasUnreadNote = consumersWithUnreadNotes && consumersWithUnreadNotes[consumerData.id] ? true : false;
    const isAbsent = absentConsumers && absentConsumers[consumerData.id] ? true : false;
    const isActive = activeConsumers && activeConsumers.filter(ac => ac.id === consumerData.id);
    const isSelected = selectedConsumers && selectedConsumers.filter(sc => sc.id === consumerData.id);
    const hasAlert = consumersWithAlerts && consumersWithAlerts.filter(cwa => cwa === consumerData.id);
    const showAlert = hasAlert && hasAlert.length !== 0 ? true : false;
    const dateOfBirth = consumerData.dob ? consumerData.dob.split(' ')[0] : '';
    let isAllowed;
    if (!allowedConsumerIds) {
      isAllowed = true;
    } else if (allowedConsumerIds[0] === '%') {
      isAllowed = true;
    } else {
      isAllowed = allowedConsumerIds.filter(consumerId => consumerId === id);
      isAllowed = isAllowed.length === 0 ? false : true;
    }

    const consumerCard = document.createElement('div');
    consumerCard.classList.add('consumerCard');
    consumerCard.setAttribute('data-consumer-id', id);
    consumerCard.setAttribute('data-dob', dateOfBirth);

    if (serviceLocations) {
      consumerCard.setAttribute('data-service-locations', serviceLocations);
    }
    if (primaryLocation && $.session.applicationName === 'Advisor') {
      consumerCard.setAttribute('data-primary-location', primaryLocation);
    }
    if (hasUnreadNote) {
      consumerCard.setAttribute('data-unreadnote', 'true');
    } else {
      consumerCard.setAttribute('data-unreadnote', 'false');
    }

    if (isSelected.length > 0 && rosterListSelectable) {
      consumerCard.classList.add('highlighted', 'consumer-selected');
    }

    if ($.loadedApp === 'outcomes') {
      consumerCard.classList.remove('disabled');
    } else {
      if ((isActive && isActive.length >= 1) || !isAllowed) {
        consumerCard.classList.add('disabled');
      } else {
        consumerCard.classList.remove('disabled');
      }
    }

    const portrait = document.createElement('div');
    const details = document.createElement('div');
    const alertIcons = document.createElement('div');
    const d = new Date();
    const time = d.getTime();
    portrait.classList.add('portrait');
    details.classList.add('details');
    alertIcons.classList.add('icons');
    portrait.innerHTML = `''`;
    portrait.innerHTML = `
      <img 
        src="./images/portraits/${id}.png?${time}"
        onerror="this.src='./images/new-icons/default.jpg'"
      />`;
    details.innerHTML = `
      <div class="name">
        <p class="name_last">${lName},</p>
		    <p class="name_first">${fName} ${mName}</p>
      <div>`;
    alertIcons.innerHTML = `
      ${isAbsent ? `<span class="absentIcon">A</span>` : ''}
      ${!rosterListSelectable ? (hasUnreadNote ? `<span class="alert">${icons['bell']}</span>` : '') : ''}
		`;

    consumerCard.appendChild(portrait);
    consumerCard.appendChild(details);
    consumerCard.appendChild(alertIcons);

    if (showAlert) {
      var ICONS = consumerCard.querySelector('.icons');
      var iconsSVG = ICONS.querySelector('.alertIcon');
      var iconSVG = document.createElement('p');
      iconSVG.classList.add('alertIcon');
      iconSVG.innerHTML = icons['error'];
      if (ICONS) {
        if (!iconsSVG) {
          ICONS.appendChild(iconSVG);
        }
      }
    }

    return consumerCard;
  }

  // Mini Roster Popup
  //---------------------------------------------
  function toggleActionCenterChildrenVisiblity(hideOrShow) {
    const actionCenterChildren = [...DOM.ACTIONCENTER.children];
    actionCenterChildren.forEach(child => {
      if (hideOrShow === 'hide') {
        child.style.display = 'none';
        return;
      }
      child.removeAttribute('style');
    });
  }
  function actionNavCallback(e) {
    SELECT_ALL_BTN.classList.remove('disabled');
    DESELECT_ALL_BTN.classList.remove('disabled');

    if (MINI_ROSTER_BTN) MINI_ROSTER_BTN.classList.remove('disabled');

    DOM.ACTIONCENTER.removeChild(MINI_ROSTER_POPUP);
    toggleActionCenterChildrenVisiblity('show');

    if (e.target === MINI_ROSTER_DONE) {
      roster2.selectedConsumersToActiveList();
    }
  }
  function buildActioNav() {
    MINI_ROSTER_DONE = button.build({
      text: 'Done',
      icon: 'checkmark',
      style: 'secondary',
      type: 'contained',
      attributes: [{ key: 'data-action-nav', value: 'miniRosterDone' }],
      classNames: ['disabled'],
      callback: actionNavCallback,
    });
    MINI_ROSTER_CANCEL = button.build({
      text: 'Cancel',
      icon: 'close',
      style: 'secondary',
      type: 'outlined',
      attributes: [{ key: 'data-action-nav', value: 'miniRosterCancel' }],
      callback: actionNavCallback,
    });

    ACTION_NAV.populate([MINI_ROSTER_DONE, MINI_ROSTER_CANCEL]);
  }
  function getMiniRosterHeadline(consumercount) {
    switch ($.loadedApp) {
      case 'incidenttracking': {
        if (!consumercount) return `Select consumer(s) below`;
        return `Select consumer(s) below to add them to this incident. <span>Total Consumer Count:</span> ${consumercount}`;
        break;
      }
      case 'timeEntry': {
        if (!consumercount) return `Select consumer(s) below`;
        return `Select consumer(s) below to add them to this entry. <span>Total Consumer Count:</span> ${consumercount}`;
        break;
      }
      case 'workshop': {
        if (!consumercount) return `Select consumer(s) below`;
        return `Select consumer(s) below to clock them in or out. <span>Total Consumer Count:</span> ${consumercount}`;
        break;
      }
      case 'plan': {
        return `Select a consumer below`;
      }
      default: {
        if (!consumercount) return `Select consumer(s) below`;
        return `Select consumer(s) below <span>Total Consumer Count:</span> ${consumercount}`;
        break;
      }
    }
  }
  function buildMiniRosterPopup(rosterMarkup) {
    const miniRosterWrap = document.createElement('div');
    miniRosterWrap.classList.add('enabledConsumers', 'miniRoster');
    miniRosterWrap.setAttribute('data-roster', 'enabled');

    var headline = document.createElement('h3');
    headline.classList.add('miniRosterHeadline');
    headline.innerHTML = getMiniRosterHeadline();

    // miniRosterWrap.appendChild(headline);
    rosterMarkup.insertBefore(headline, rosterMarkup.firstChild.nextSibling);
    miniRosterWrap.appendChild(rosterMarkup);

    return miniRosterWrap;
  }
  function showMiniRosterPopup(rosterMarkup) {
    if (MINI_ROSTER_BTN) MINI_ROSTER_BTN.classList.add('disabled');

    const activeSection = DOM.ACTIONCENTER.dataset.activeSection;
    //buttons need to be disabled. This will need to
    // be modified if more modules need these buttons disabled

    if (
      $.loadedApp === 'outcomes' ||
      $.loadedApp === 'plan' ||
      $.loadedApp === 'ConsumerFinances' ||
      $.loadedApp === 'CFEditAccount' ||
      $.loadedApp === 'employment' ||
      $.loadedApp === 'covid' ||
      $.loadedApp === 'forms' ||
      $.loadedApp === 'assessmentHistory' ||
      activeSection === 'caseNotesSSA-new' ||
      activeSection === 'caseNotes-new'
    ) {
      SELECT_ALL_BTN.classList.add('disabled');
      DESELECT_ALL_BTN.classList.add('disabled');
    }
    toggleActionCenterChildrenVisiblity('hide');

    MINI_ROSTER_POPUP = buildMiniRosterPopup(rosterMarkup);
    DOM.ACTIONCENTER.appendChild(MINI_ROSTER_POPUP);
    buildActioNav();
  }
  /**
   * Initializes the mini roster. Removes the mini roster button, and re-adds it with new settings.
   * @param {Object} locationData - Location information Object. Only use if you need to bypass the roster's default location.
   * @param {string} locationData.locationId - The Location ID
   * @param {string} locationData.locationName - The Location Name. If location name is not known, pass an empty string.
   * @param {Object} rosterOptions - Options for customizing the mini roster
   * @param {boolean} rosterOptions.hideDate - true = hide date selection. For example, SE has pay period date restrictions.
   * someone could change the date on the roster outside of the payperiod and choose someone who may be inactive. Removing this option alltogether prevents this.
   * !IMPORTANT! If setting this to true, you must update the roster date when they change the date within the module using roster2.updateSelectedDate()
   */
  async function miniRosterinit(locationData, rosterOptions) {
    removeMiniRosterBtn();
    // Reset date from moving between modules:
    selectedDate = UTIL.getTodaysDate();
    if (locationData) {
      const { locationId, locationName } = locationData;
      if (locationName && locationId) {
        selectedLocationName = locationName;
        selectedLocationId = locationId;
      } else if (locationName === '') {
        if (locationId === '0') {
          selectedLocationName = 'All';
          selectedLocationId = locationId;
        } else {
          rosterLocations = rosterLocations ?? (await getRosterLocationsData());
          const selectedLocationObj = rosterLocations.filter(loc => locationId === loc.ID);
          selectedLocationName = selectedLocationObj[0].Name;
          selectedLocationId = locationId;
        }
      }
      // reset group when custom location is passed:
      selectedGroupId = selectedLocationId;
      selectedGroupCode = 'ALL';
      selectedGroupName = 'Everyone';
    }
    MINI_ROSTER_BTN = button.build({
      icon: 'people',
      style: 'secondary',
      type: 'contained',
      id: 'mini_roster',
      // classNames: ['floatingActionBtn', 'consumerListBtn', 'disabled'],
      classNames: ['floatingActionBtn', 'consumerListBtn'],
      callback: async () => {
        if (
          $.loadedApp === 'ConsumerFinances' ||
          $.loadedApp === 'CFEditAccount' ||
          $.loadedApp === 'employment' ||
          $.loadedApp === 'assessmentHistory'
        ) {
          clearSelectedConsumers();
          clearActiveConsumers();
        }
        MINI_ROSTER_BTN.classList.add('disabled');
        await showMiniRoster(rosterOptions);
        MINI_ROSTER_BTN.classList.remove('disabled');
      },
    });

    document.body.appendChild(MINI_ROSTER_BTN);
    DOM.toggleNavLayout();
  }

  async function showMiniRoster(
    rosterOptions = {
      hideDate: false,
    },
  ) {
    const rosterMarkup = await buildRoster({
      selectable: true,
      hideDateFilter: rosterOptions.hideDate ? true : false,
    });
    showMiniRosterPopup(rosterMarkup);
    totalConsumerCount = 0;
    await getRosterConsumersData();
    populateRoster();
    document.getElementById('searchBtn').click();
    filterApply();
  }
  /**
   * Enables or disables the mini roster button.
   * @param {boolean} showBtn - True = enable the mini roster button
   */
  function toggleMiniRosterBtnVisible(showBtn) {
    if (showBtn) {
      MINI_ROSTER_BTN.classList.remove('disabled');
    } else {
      MINI_ROSTER_BTN.classList.add('disabled');
    }
  }
  // Roster Data
  //---------------------------------------------
  async function getRosterLocationsData() {
    try {
      const data = (await rosterAjax.getRosterLocations()).getLocationsJSONResult;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function getConsumerGroupsData() {
    try {
      const data = (await customGroupsAjax.getConsumerGroups(selectedLocationId)).getConsumerGroupsJSONResult;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function getLocationsWithUnreadNotesData() {
    try {
      const data = (await locationNotesAjax.getLocationsWithUnreadNotes()).getLocationsWithUnreadNotesResult;
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getConsumersByGroupData(getConsumerByGroupData) {
    try {
      const data = (await rosterAjax.getConsumersByGroup(getConsumerByGroupData)).getConsumersByGroupJSONResult;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function getConsumersWithUnreadNotesByEmployeeAndLocationData(selectedLocationId) {
    try {
      const data = (await progressNotesAjax.getConsumersWithUnreadNotesByEmployeeAndLocation(selectedLocationId))
        .getConsumersWithUnreadNotesByEmployeeAndLocationResult;
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getRosterConsumersData(forceGroupFilter) {
    if ($.session.formsCaseload == true && $.loadedApp === 'forms') selectedGroupCode = 'CAS';
    const getConsumerByGroupData = {
      selectedGroupCode,
      selectedGroupId,
      selectedLocationId,
      selectedDate,
    };

    if (!rosterConsumers || rosterConsumers.length === 0 || forceGroupFilter) {
      rosterConsumers = await getConsumersByGroupData(getConsumerByGroupData);
    }

    // I am not sure why consumer location was being set to the selected location ID?
    const seenIds = {};

    rosterConsumers = rosterConsumers.filter(consumer => {
      if (seenIds[consumer.id]) {
        return false;
      } else {
        seenIds[consumer.id] = true;
        return true;
      }
    });
    groupRosterConsumers();

    if (selectedLocationId !== '0') {
      const consumersWithUnreadNotesResults = await getConsumersWithUnreadNotesByEmployeeAndLocationData(
        selectedLocationId,
      );
      consumersWithUnreadNotes = progressNotes.createConsumersWithUnreadNotesObj(consumersWithUnreadNotesResults);
    } else {
      consumersWithUnreadNotes = {};
    }

    absentConsumers = await rosterAbsent.getAbsentConsumers(selectedLocationId, selectedDate);
  }
  async function getRosterData() {
    if (!selectedDate) selectedDate = UTIL.getTodaysDate();

    rosterLocations = await getRosterLocationsData();
    if (!selectedLocationId || rosterLocations.filter(loc => loc.ID === selectedLocationId).length === 0) {
      if (selectedLocationId !== '0') setSelectedLocationData();
    }

    rosterGroups = await getConsumerGroupsData(selectedLocationId);
    if (!selectedGroupName || ($.session.formsCaseload == true && $.loadedApp === 'forms')) setSelectedGroupData();

    locationsWithUnreadNotes = await getLocationsWithUnreadNotesData();
  }

  // Roster List
  //---------------------------------------------
  function buildLoadMoreBtn() {
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('loadMoreConsumersBtn');

    const btn = button.build({
      text: 'Load More...',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        activeGroup++;
        populateRoster(true);
      },
    });

    btnWrap.appendChild(btn);

    return btnWrap;
  }
  function toggleRosterListLockdown(lockItDown) {
    if (lockItDown) {
      ROSTER_WRAP.classList.add('disabled');
    } else {
      ROSTER_WRAP.classList.remove('disabled');
    }
  }
  async function refreshRosterList() {
    rosterListSelectable = false;
    setActiveModuleSectionAttribute('roster-info');

    const rosterlists = [...ROSTER_WRAP.querySelectorAll('.roster__list')];
    rosterlists && rosterlists.forEach(rl => ROSTER_WRAP.removeChild(rl));
    totalConsumerCount = 0;

    await getRosterData();
    await getRosterConsumersData(true);
    populateRoster();
  }
  function rosterEventSetup() {
    ROSTER_WRAP.addEventListener('click', e => {
      const isConsumer = event.target.classList.contains('consumerCard');
      if (!isConsumer) return;
      const consumer = event.target;
      const consumerId = event.target.dataset.consumerId;

      const activeSection = DOM.ACTIONCENTER.dataset.activeSection;

      if (activeSection === 'roster-info') {
        toggleRosterListLockdown(true);
        DOM.scrollToTopOfPage();
        consumerInfo.showCard(consumer);
        return;
      }

      const isConsumerSelected = consumer.classList.contains('consumer-selected');
      // var activeSection = actioncenter.dataset.activeSection;

      if (
        $.loadedApp === 'outcomes' ||
        $.loadedApp === 'plan' ||
        $.loadedApp === 'authorizations' ||
        $.loadedApp === 'ConsumerFinances' ||
        $.loadedApp === 'CFEditAccount' ||
        $.loadedApp === 'employment' ||
        $.loadedApp === 'covid' ||
        $.loadedApp === 'forms' ||
        $.loadedApp === 'assessmentHistory' ||
        // $.loadedApp === 'OOD' ||
        activeSection === 'caseNotesSSA-new' ||
        activeSection === 'caseNotes-new'
      ) {
        // add modules that only allow one consumer
        if (isConsumerSelected) {
          consumer.classList.remove('consumer-selected');
          consumer.classList.remove('highlighted');
          removeConsumerFromSelectedConsumers(consumerId);
        } else {
          const currentlySelectedConsumer = ROSTER_WRAP.querySelector('.consumer-selected');
          if (currentlySelectedConsumer) {
            const currentlySelectedConsumerId = currentlySelectedConsumer.dataset.consumerId;
            currentlySelectedConsumer.classList.remove('highlighted');
            currentlySelectedConsumer.classList.remove('consumer-selected');
            removeConsumerFromSelectedConsumers(currentlySelectedConsumerId);
          }
          consumer.classList.add('consumer-selected');
          consumer.classList.add('highlighted');
          addConsumerToSelectedConsumers(consumer);
        }
      } else {
        if (!isConsumerSelected) {
          addConsumerToSelectedConsumers(consumer);
          consumer.classList.add('consumer-selected');
          consumer.classList.add('highlighted');
        } else {
          consumer.classList.remove('consumer-selected');
          consumer.classList.remove('highlighted');
          removeConsumerFromSelectedConsumers(consumerId);
        }
      }

      if (activeSection === 'roster-absent') {
        const doneBtn = document.getElementById('absentDone');
        if (selectedConsumers.length > 0) {
          doneBtn.classList.remove('disabled');
        } else {
          doneBtn.classList.add('disabled');
        }
        return;
      }

      if (selectedConsumers.length > 0) {
        MINI_ROSTER_DONE.classList.remove('disabled');
      } else {
        MINI_ROSTER_DONE.classList.add('disabled');
      }
    });

    SELECT_ALL_BTN.addEventListener('click', event => {
      var consumers = [].slice.call(ROSTER_WRAP.querySelectorAll('.consumerCard:not(.highlighted)'));
      consumers.forEach(c => {
        if (c.classList.contains('disabled')) return;
        var consumer = c.cloneNode(true);
        addConsumerToSelectedConsumers(consumer);
        c.classList.add('consumer-selected', 'highlighted');
      });

      const groupCount = Object.keys(groupedRosterConsumers).length;
      const nextGroup = activeGroup + 1;
      for (let i = nextGroup; i <= groupCount; i++) {
        if (groupedRosterConsumers[i]) {
          groupedRosterConsumers[i].forEach(c => {
            var consumer = buildConsumerCard(c);
            if (consumer.classList.contains('disabled')) return;
            addConsumerToSelectedConsumers(consumer);
          });
        }
      }

      console.table(selectedConsumers);

      if (selectedConsumers.length > 0) {
        MINI_ROSTER_DONE.classList.remove('disabled');
      } else {
        MINI_ROSTER_DONE.classList.add('disabled');
      }
    });

    DESELECT_ALL_BTN.addEventListener('click', event => {
      clearHighlightedConsumers();
      clearSelectedConsumers();

      console.table(selectedConsumers);

      if (selectedConsumers.length > 0) {
        MINI_ROSTER_DONE.classList.remove('disabled');
      } else {
        MINI_ROSTER_DONE.classList.add('disabled');
      }
    });

    FILTER_BTN.addEventListener('click', event => {
      buildFilterPopup('ALL');
    });

    SEARCH_BTN.addEventListener('click', event => {
      SEARCH_WRAP.classList.toggle('searchOpen');
      SEARCH_INPUT.value = '';
      SEARCH_INPUT.focus();
    });
    SEARCH_INPUT.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        searchRoster(event.target.value);
      }
    });

    MASS_ABSENT_BTN.addEventListener('click', event => {
      if (event.target.dataset.toggled === 'true') {
        rosterListSelectable = true;
        rosterAbsent.initMassAbsent();
        setActiveModuleSectionAttribute('roster-absent');
      } else {
        rosterListSelectable = false;
        ACTION_NAV.hide();
        setActiveModuleSectionAttribute('roster-info');
      }
    });

    MANAGE_GROUPS_BTN.addEventListener('click', event => {
      customGroups.loadManageGroupsPage();
    });

    LOCATION_NOTES_BTN.addEventListener('click', event => {
      locationNotes.loadAllNotesPage();
    });
  }
  function populateRoster(loadingMore) {
    if (!rosterConsumers) return;

    ROSTER_LIST = document.createElement('div');
    ROSTER_LIST.classList.add('roster__list');

    if (groupedRosterConsumers[activeGroup]) {
      groupedRosterConsumers[activeGroup].forEach(c => ROSTER_LIST.appendChild(buildConsumerCard(c)));
      totalConsumerCount = rosterConsumers.length;
    }

    if (ROSTER_WRAP.contains(ROSTER_SPINNER)) ROSTER_WRAP.removeChild(ROSTER_SPINNER);
    if (!ROSTER_WRAP.contains(LOAD_MORE_BTN)) {
      LOAD_MORE_BTN = buildLoadMoreBtn();
      ROSTER_WRAP.appendChild(LOAD_MORE_BTN);
    }
    ROSTER_WRAP.insertBefore(ROSTER_LIST, LOAD_MORE_BTN);
    // if (!loadingMore) SEARCH_INPUT.focus();
    const nextGroup = activeGroup + 1;
    if (!groupedRosterConsumers[nextGroup]) {
      ROSTER_WRAP.removeChild(LOAD_MORE_BTN);
    }

    updateTotalConsumerCount();
    // populateConsumerCardPortraits();
  }
  function groupRosterConsumers(consumers) {
    const chunkBy = 50;
    const chunkedArray = consumers ? UTIL.chunkArray(consumers, chunkBy) : UTIL.chunkArray(rosterConsumers, chunkBy);
    groupedRosterConsumers = {};
    chunkedArray.forEach((a, index) => (groupedRosterConsumers[index] = a));

    const rosterGroupKeys = Object.keys(groupedRosterConsumers);
    rosterGroupCount = rosterGroupKeys && rosterGroupKeys.length;
    activeGroup = 0;
  }
  /**
   *
   * @param {Object} param0
   * @param {boolean} param0.hideDateFilter - True = hide Date filter.
   *
   */
  async function buildRoster({ selectable, ...otherOpts }, callback) {
    rosterListSelectable = selectable;
    hideDateFilter = otherOpts.hideDateFilter;

    await getRosterData();

    // roster
    ROSTER_WRAP = document.createElement('div');
    ROSTER_WRAP.classList.add('roster');
    // roster topNav
    const topNav = buildRosterTopNav();
    const filteredBy = buildFilteredBy();
    // build roster
    ROSTER_SPINNER = PROGRESS.SPINNER.get('Please wait while we gather everyone up...');
    ROSTER_WRAP.appendChild(topNav);
    ROSTER_WRAP.appendChild(filteredBy);
    ROSTER_WRAP.appendChild(ROSTER_SPINNER);
    // setup event listener
    rosterEventSetup();

    return ROSTER_WRAP;
  }

  // Main Module
  //---------------------------------------------
  async function loadRosterInfo() {
    //reset date
    selectedDate = UTIL.getTodaysDate();
    // clear out roster location and group so it will set back to default roster location (as per ticket 47820)
    selectedLocationId = null;
    selectedGroupName = null;

    PROGRESS.SPINNER.show('Loading Roster...');

    const rosterMarkup = await buildRoster({
      selectable: false,
      showActionNavCancel: false,
      forMiniRoster: false,
      hideDateFilter: false,
    });

    setActiveModuleSectionAttribute('roster-info');
    DOM.clearActionCenter();

    var consumerInfoCard = consumerInfo.buildCard();
    DOM.ACTIONCENTER.appendChild(rosterMarkup);
    DOM.ACTIONCENTER.appendChild(consumerInfoCard);
    consumerInfo.toggleHideShowAbsentMenuSection(selectedLocationId);

    customGroups.init(rosterGroups);
    rosterAbsent.init();

    totalConsumerCount = 0;
    await getRosterConsumersData();
    populateRoster();
    document.getElementById('searchBtn').click();
    filterUpdateDisplay();
  }

  return {
    addConsumerToActiveConsumers,
    buildRoster,
    buildConsumerCard,
    clearActiveConsumers,
    clearSelectedConsumers,
    getActiveConsumers,
    getSelectedConsumers,
    getSelectedConsumersCache,
    getSelectedConsumersMiniRoster,
    getSelectedLocationObj,
    getSelectedDate,
    getRosterLocations,
    getAllRosterConsumers,
    getConsumersWithUnreadNotes,
    getConsumerGroupsData,
    loadRosterInfo,
    miniRosterinit,
    populateRoster,
    refreshRosterList,
    removeConsumerFromActiveConsumers,
    removeMiniRosterBtn,
    selectedConsumersToActiveList,
    setAllowedConsumers,
    setRosterGroups,
    setCustomDefaultLocationData,
    showMiniRoster,
    toggleRosterListLockdown,
    toggleMiniRosterBtnVisible,
    toggleActionCenterChildrenVisiblity,
    updateSelectedDate,
    updateSelectedLocationId,
  };
})();
