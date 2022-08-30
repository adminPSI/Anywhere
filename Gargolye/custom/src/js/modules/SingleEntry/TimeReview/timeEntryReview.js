var timeEntryReview = (function () {
  //-DATA------------------
  var payPeriodData;
  var locationData;
  var workCodeData;
  //-DOM------------------
  var payPeriodsDropdown;
  var reviewTable;
  var mulitSelectBtn;
  var selectAllBtn;
  var filterBtn;
  var filterPopup;
  var locationDropdown;
  var workCodeDropdown;
  var applyBtn;
  var cancelBtn;
  //-VALUES------------------
  var payPeriod;
  var locationId;
  var workCodeId;
  var locationName;
  var workCodeName;
  var startDate;
  var endDate;
  var tmpLocationId;
  var tmpLocationName;
  var tmpWorkCodeId;
  var tmpWorkCodeName;
  var wcAbbreviation;
  //-OTHER------------------
  var statusLookup = {
    A: 'Awaiting Approval',
    P: 'Pending',
    R: 'Rejected',
    I: 'Imported',
    S: 'Submitted',
    D: 'Duplicate',
  };
  var enableMultiEdit = false;
  var enableSelectAll = false;
  var selectedRows = []; // array of row ids
  //-TABLE DATA------------------
  var entriesByDate; // original results array

  // Util
  //------------------------------------
  function formatTimeString(timeString) {
    if (timeString === '') return timeString;
    // removes seconds and strips leading zeros then converts to standard
    var time = timeString.split(':');
    var hh = time[0].split('')[0] === '0' ? time[0].split('')[1] : time[0];
    var mm = time[1];

    return UTIL.convertFromMilitary(`${hh}:${mm}`);
  }
  function showDeleteEntryWarningPopup(messageText, callback) {
    var popup = POPUP.build({ classNames: ['warning'], hideX: true });
    var message = document.createElement('p');
    message.innerHTML = messageText;
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: function () {
        POPUP.hide(popup);
        callback();
        ACTION_NAV.hide();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: function () {
        POPUP.hide(popup);
        ACTION_NAV.hide();

        mulitSelectBtn.classList.remove('enabled');
        mulitSelectBtn.classList.remove('disabled');
        selectAllBtn.classList.remove('enabled');
        enableMultiEdit = false;
        enableSelectAll = false;

        selectedRows = [];
        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));
      },
    });
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    popup.appendChild(message);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
  }
  function showSubmitError(messageText) {
    var popup = POPUP.build({ classNames: ['error'] });
    var message = document.createElement('p');
    message.innerHTML = messageText;
    popup.appendChild(message);

    POPUP.show(popup);
  }
  function clearAllGlobalVariables() {
    selectedRows = [];

    payPeriod = undefined;
    locationId = undefined;
    workCodeId = undefined;
    locationName = undefined;
    workCodeName = undefined;
    enableMultiEdit = false;
    enableSelectAll = false;
    tmpLocationId = undefined;
    tmpLocationName = undefined;
    tmpWorkCodeId = undefined;
    tmpWorkCodeName = undefined;
  }

  // Submit & Delete
  //------------------------------------
  function submitEntries() {
    var statusDataObj = {
      newStatus: 'S',
      singleEntryIdString: selectedRows.join(','),
      token: $.session.Token,
    };
    singleEntryAjax.updateSingleEntryStatus(statusDataObj, function (results) {
      successfulSave.show('ENTRIES SUBMITTED');
      setTimeout(function () {
        successfulSave.hide();
        loadReviewPage();
        enableMultiEdit = false;
        mulitSelectBtn.classList.remove('enabled');
      }, 1000);
    });
  }
  function deleteEntries() {
    var deletePromises = [];

    selectedRows.forEach(row => {
      deletePromises.push(
        new Promise(function (fulfill, reject) {
          singleEntryAjax.deleteSingleEntryRecord(row, function (results) {
            fulfill();
          });
        }),
      );
    });

    Promise.all(deletePromises)
      .then(function (res) {
        successfulSave.show('ENTRIES DELETED');
        setTimeout(function () {
          successfulSave.hide();
          loadReviewPage();
          enableMultiEdit = false;
          mulitSelectBtn.classList.remove('enabled');
        }, 1000);
      })
      .catch(function (error) {});
  }
  function submitEntry(updateObj) {
    singleEntryAjax.updateSingleEntryStatus(updateObj, function () {
      loadReviewPage();
    });
  }
  function deleteEntry(entryId) {
    singleEntryAjax.deleteSingleEntryRecord(entryId, function () {
      loadReviewPage();
    });
  }

  // Action Nav
  //------------------------------------
  function handleActionNavEvent(target) {
    var targetAction = target.dataset.actionNav;

    if (!selectedRows || selectedRows.length === 0) {
      enableMultiEdit = false;
      mulitSelectBtn.classList.remove('enabled');
      ACTION_NAV.hide();
      return;
    }

    switch (targetAction) {
      case 'submitEntries': {
        var warningMessage = `By clicking Yes, you are confirming that you have reviewed these entries and that they are correct to the best of your knowledge.`;
        showDeleteEntryWarningPopup(warningMessage, () => submitEntries());
        ACTION_NAV.hide();
        break;
      }
      case 'deleteEntries': {
        showDeleteEntryWarningPopup(
          `These entries will be permanently deleted, do you wish to continue?`,
          deleteEntries,
        );
        break;
      }
    }
  }
  function setupActionNav() {
    var submitBtn = button.build({
      text: 'Submit',
      style: 'secondary',
      type: 'contained',
      attributes: [{ key: 'data-action-nav', value: 'submitEntries' }],
    });
    var deleteBtn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'outlined',
      attributes: [{ key: 'data-action-nav', value: 'deleteEntries' }],
    });

    ACTION_NAV.populate([submitBtn, deleteBtn]);
    ACTION_NAV.hide();
  }

  // Filtering
  //------------------------------------
  function buildFilteredBy() {
    var filteredBy = document.querySelector('.widgetFilteredBy');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
    }

    startDate = payPeriod.start;
    endDate = payPeriod.end;
    //reformat startDate and endDate
    var splitStartDate = startDate.split('-');
    var splitEndDate = endDate.split('-');

    filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Pay Period:</span> ${UTIL.leadingZero(splitStartDate[1])}/${UTIL.leadingZero(
      splitStartDate[2],
    )}/${splitStartDate[0].slice(2, 4)} - ${UTIL.leadingZero(splitEndDate[1])}/${UTIL.leadingZero(
      splitEndDate[2],
    )}/${splitEndDate[0].slice(2, 4)}</p>
      <p><span>Location:</span> ${locationName}</p>
      <p><span>Work Code:</span> ${workCodeName}</p>
    </div>`;

    return filteredBy;
  }
  function populateLocationDropdown() {
    var data = locationData.map(l => {
      return {
        value: l.ID,
        text: l.Name,
        attributes: [
          { key: 'data-residence', value: l.Residence },
          { key: 'data-reimbursable', value: l.SE_Trans_Reimbursable },
        ],
      };
    });
    data.unshift({ value: '%', text: 'All' });
    dropdown.populate(locationDropdown, data, locationId);
  }
  function populateWorkCodeDropdown() {
    var data = workCodeData.map(wc => {
      return {
        value: wc.workcodeid,
        text: wc.workcodename,
      };
    });
    data.unshift({
      value: '%',
      text: 'All',
    });
    dropdown.populate(workCodeDropdown, data, workCodeId);
  }
  function setupFilterEventListeners() {
      locationDropdown.addEventListener('change', function () {
      var selectedOption = event.target.options[event.target.selectedIndex];
      tmpLocationId = selectedOption.value;
      tmpLocationName = selectedOption.innerHTML;
    });
    workCodeDropdown.addEventListener('change', function () {
      var selectedOption = event.target.options[event.target.selectedIndex];
      tmpWorkCodeId = selectedOption.value;
      tmpWorkCodeName = selectedOption.innerHTML;
    });

    applyBtn.addEventListener('click', function () {
      if (tmpLocationId || tmpWorkCodeId) {
        locationId = tmpLocationId;
        workCodeId = tmpWorkCodeId;

          if (locationId !== '%' || workCodeId !== '%') {
              populateTable(
                  entriesByDate.filter(e => {
                      if (tmpLocationId && tmpWorkCodeId) {
                          wcAbbreviation = workCodeName.split(' ')[0];
                          if (tmpLocationId === '%') {
                              return e.WCCode === wcAbbreviation;
                          } else if (tmpWorkCodeId === '%') {
                              return e.Location_ID === locationId;
                          } else {
                              return e.Location_ID === locationId && e.WCCode === wcAbbreviation;
                          }
                      }
                      if (tmpLocationId && !tmpWorkCodeId) {
                          return e.Location_ID === locationId;
                      }

                      if (tmpWorkCodeId && !tmpLocationId) {
                          wcAbbreviation = workCodeName.split(' ')[0];
                          return e.WCCode === wcAbbreviation;
                      }
                  }),
              );
          } else {
              populateTable(entriesByDate);
          }

        ACTION_NAV.hide();
        mulitSelectBtn.classList.remove('enabled');
        mulitSelectBtn.classList.remove('disabled');
        selectAllBtn.classList.remove('enabled');
        selectAllBtn.classList.remove('disabled');
        enableMultiEdit = false;
        enableSelectAll = false;
        selectedRows = [];
        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));
      }

      if (tmpLocationName) locationName = tmpLocationName;
      if (tmpWorkCodeName) workCodeName = tmpWorkCodeName;

      startDate = payPeriod.start;
      endDate = payPeriod.end;
      //reformat startDate and endDate
      var splitStartDate = startDate.split('-');
      var splitEndDate = endDate.split('-');

      var filteredBy = document.querySelector('.widgetFilteredBy');
      filteredBy.innerHTML = `<div class="filteredByData">
        <p><span>Pay Period:</span> ${UTIL.leadingZero(splitStartDate[1])}/${UTIL.leadingZero(
        splitStartDate[2],
      )}/${splitStartDate[0].slice(2, 4)} - ${UTIL.leadingZero(splitEndDate[1])}/${UTIL.leadingZero(
        splitEndDate[2],
      )}/${splitEndDate[0].slice(2, 4)}</p>
        <p><span>Location:</span> ${locationName}</p>
        <p><span>Work Code:</span> ${workCodeName}</p>
      </div>`;

      startDate = payPeriod.start;
      endDate = payPeriod.end;

      //load review page for the selected pay period
      refreshPage(payPeriod);

      POPUP.hide(filterPopup);
    });
    cancelBtn.addEventListener('click', function () {
      POPUP.hide(filterPopup);
    });
  }
  function showFilterPopup() {
    // popup
    filterPopup = POPUP.build({
      classNames: 'timeEntryReviewFilterPopup',
      hideX: true,
    });

    // pay period dropdown
    payPeriodsDropdown = buildPayPeriodDropdown();

    // location dropdown
    locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Locations',
      style: 'secondary',
      readonly: false,
    });
    workCodeDropdown = dropdown.build({
      dropdownID: 'workCodeDropdown',
      label: 'Work Codes',
      style: 'secondary',
      readonly: false,
    });
    applyBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(applyBtn);
    btnWrap.appendChild(cancelBtn);

    // Build Popup
    filterPopup.appendChild(payPeriodsDropdown);
    filterPopup.appendChild(locationDropdown);
    filterPopup.appendChild(workCodeDropdown);
    filterPopup.appendChild(btnWrap);

    // populate drodown
    populateLocationDropdown();
    populateWorkCodeDropdown();

    setupFilterEventListeners();

    POPUP.show(filterPopup);
  }

  // Time Entry Details Popup
  //------------------------------------
  function getDataForTimeEntryEdit(status, entryId) {
    $.session.editSingleEntryCardStatus = status;
    singleEntryAjax.getSingleEntryById(entryId, results => {
      singleEntryAjax.getSingleEntryConsumersPresent(entryId, consumers => {
        editTimeEntry.init({
          entry: results,
          consumers: consumers,
          payPeriod,
        });
      });
    });
  }
  function showRowDetails(entryId, entryStatus, isValid, consumersPresent) {
    // popup
    var popup = POPUP.build({
      classNames: 'timeEntryDetailsPopup',
    });
    // btns
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('buttonWrap');
    var editBtn = button.build({
      text: 'Edit',
      style: 'secondary',
      type: 'contained',
      classNames: 'editEntryBtn',
      callback: function () {
        POPUP.hide(popup);
        getDataForTimeEntryEdit(entryStatus, entryId);
      },
    });
    var submitBtn = button.build({
      text: 'Submit',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup);
        var updateObj = {
          token: $.session.Token,
          singleEntryIdString: entryId,
          newStatus: 'S',
        };
        // var entry = entriesByDate.filter(e => e.Single_Entry_ID === entryId)[0];
        if (!isValid) {
          showSubmitError(`Unable to submit entry, end time needed.`);
        } else {
          var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;
          showDeleteEntryWarningPopup(warningMessage, () => submitEntry(updateObj));
          POPUP.hide(popup);
        }
      },
    });
    var deleteBtn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        var warningMessage = `This entry will be permanently deleted, do you wish to continue?`;
        showDeleteEntryWarningPopup(warningMessage, () => deleteEntry(entryId));
        POPUP.hide(popup);
      },
    });

    btnWrap.appendChild(editBtn);
    if (entryStatus === 'P' || entryStatus === 'R') {
      btnWrap.appendChild(submitBtn);
      btnWrap.appendChild(deleteBtn);
    }
    // Aditional details
    const consumerDisplay = document.createElement('div');
    consumerDisplay.id = 'consumerDisplay';
    const loadingDisplay = document.createElement('div');
    loadingDisplay.id = 'loadingDisplay';
    const transportationDisplay = document.createElement('div');
    transportationDisplay.id = 'transportationDisplay';

    popup.appendChild(loadingDisplay);
    popup.appendChild(consumerDisplay);
    popup.appendChild(transportationDisplay);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
    timeEntryDetailsPopup.init(entryId, consumersPresent);
  }

  // Time Entry Review Table
  //-----------------------------------
  function enableMultiEditRows() {
    enableMultiEdit = !enableMultiEdit;

    mulitSelectBtn.classList.toggle('enabled');

    if (enableMultiEdit) {
      ACTION_NAV.show();
    } else {
      ACTION_NAV.hide();
    }

    selectedRows = [];
    var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
    highlightedRows.forEach(row => row.classList.remove('selected'));
  }
  function enableSelectAllRows() {
    enableSelectAll = !enableSelectAll;

    selectAllBtn.classList.toggle('enabled');

    if (enableSelectAll) {
      ACTION_NAV.show();
      enableMultiEdit = true;
      mulitSelectBtn.classList.add('disabled');
      mulitSelectBtn.classList.remove('enabled');

      selectedRows = [];

      var rows = [].slice.call(document.querySelectorAll('.table__row'));
      rows.forEach(r => {
        var isValid = r.dataset.valid === 'true' ? true : false;
        if (!isValid) return;

        var entryStatus = r.dataset.status;
        if (entryStatus === 'P' || entryStatus === 'R') {
          r.classList.add('selected');
          selectedRows.push(r.id);
        }
      });
    } else {
      ACTION_NAV.hide();
      enableMultiEdit = false;
      mulitSelectBtn.classList.remove('disabled');

      selectedRows = [];

      var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
      highlightedRows.forEach(row => row.classList.remove('selected'));
    }
  }
  // events
  function handleReviewTableEvents(event) {
    var isRow = event.target.classList.contains('table__row');
    var isSelected = event.target.classList.contains('selected');
    var entryStatus = event.target.dataset.status;
    var isValid = event.target.dataset.valid === 'true' ? true : false;
    var entryId = event.target.id;
    var consumersPresent = event.target.dataset.consumers;
    if (!isRow) return; // if not row return

    if (enableMultiEdit && isValid) {
      if (isSelected) {
        event.target.classList.remove('selected');
        selectedRows = selectedRows.filter(sr => sr !== entryId);
        if (enableSelectAll) {
          enableSelectAll = false;
          mulitSelectBtn.classList.remove('disabled');
          mulitSelectBtn.classList.add('enabled');
          selectAllBtn.classList.remove('enabled');
        }
      } else {
        if (entryStatus === 'P' || entryStatus === 'R') {
          event.target.classList.add('selected');
          selectedRows.push(entryId);
        }
      }
    } else if (!enableMultiEdit) {
      selectedRows = [];
      showRowDetails(entryId, entryStatus, isValid, consumersPresent);
    }
  }
  // populate
  function populateTable(results) {
    var workCodes = timeEntry.getWorkCodes();

    var tableData = results.map(td => {
      var entryId = td.Single_Entry_ID;

      var serviceDate = UTIL.abbreviateDateYear(td.Date_of_Service.split(' ')[0]);
      var startTime = formatTimeString(td.Start_Time);
      var endTime = formatTimeString(td.End_Time === '23:59:59' ? '00:00:00' : td.End_Time);
      var hours = td.Check_Hours;
      var locationName = td.Location_Name;
      var wcCode = td.WCCode;
      var status = statusLookup[td.Anywhere_Status];
      var abbStatus = td.Anywhere_Status;
      var consumersPresent = td.Number_Consumers_Present;
      const transportationUnits = td.Transportation_Units;

      var isValid;
      var workCodeData = workCodes.filter(wc => wc.workcodeid === td.Work_Code_ID);

      if (workCodeData[0] && workCodeData[0].keyTimes === 'Y') {
        // end time required to be valid
        isValid = td.End_Time === '' ? 'false' : 'true';
      } else {
        isValid = 'true';
      }

      //consumer present and transportation icons
      const additionalInformation = document.createElement('div');
      additionalInformation.classList.add('additionalInfoBox');
      additionalInformation.innerHTML = consumersPresent;
      if (transportationUnits !== '') additionalInformation.innerHTML += icons.car;

      return {
        id: entryId,
        values: [
          status,
          serviceDate,
          startTime,
          endTime,
          hours,
          locationName,
          wcCode,
          additionalInformation.outerHTML,
        ],
        attributes: [
          { key: 'data-status', value: abbStatus },
          { key: 'data-valid', value: isValid },
          { key: 'data-consumers', value: consumersPresent },
        ],
      };
    });

    table.populate(reviewTable, tableData);
  }
  // build
  function buildTopNav() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('actionButtonWrap');

    filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtn',
      callback: showFilterPopup,
    });
    mulitSelectBtn = button.build({
      text: 'Multi Select',
      icon: 'multiSelect',
      style: 'secondary',
      type: 'contained',
      classNames: 'multiSelectBtn',
      callback: enableMultiEditRows,
    });
    selectAllBtn = button.build({
      text: 'Select All',
      icon: 'multiSelect',
      style: 'secondary',
      type: 'contained',
      classNames: 'selectAllBtn',
      callback: enableSelectAllRows,
    });

    btnWrap.appendChild(filterBtn);
    btnWrap.appendChild(mulitSelectBtn);
    btnWrap.appendChild(selectAllBtn);

    return btnWrap;
  }
  function buildReportButton() {
    var btn = button.build({
      text: 'Reports',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        reports.init(payPeriod);
      },
    });

    return btn;
  }
  function buildTable() {
    var tableOptions = {
      tableId: 'singleEntryReviewTable',
      headline: 'My Time Entries',
      columnHeadings: [
        'Status',
        'Date',
        'Start Time',
        'End Time',
        'Hours',
        'Location',
        'Work Code',
        '',
      ],
      callback: handleReviewTableEvents,
    };

    return table.build(tableOptions);
  }
  function buildReviewPage() {
    DOM.clearActionCenter();
    var topNav = buildTopNav();
    var reportBtn = buildReportButton();
    var fitleredBy = buildFilteredBy();
    reviewTable = buildTable();

    DOM.ACTIONCENTER.appendChild(topNav);
    DOM.ACTIONCENTER.appendChild(reportBtn);
    DOM.ACTIONCENTER.appendChild(fitleredBy);
    DOM.ACTIONCENTER.appendChild(reviewTable);

    setupActionNav();
  }
  // load
  function loadReviewPage(status) {
    roster2.removeMiniRosterBtn();

    $.session.fromEdit = true;
    $.session.singleEntrycrossMidnight = false;

    if (!locationId) locationId = '%';
    if (!locationName) locationName = 'All';
    if (!workCodeId) workCodeId = '%';
    if (!workCodeName) workCodeName = 'All';

    buildReviewPage();
    singleEntryAjax.getSingleEntryByDate(
      {
        userId: $.session.UserId,
        startDate: payPeriod.start,
        endDate: payPeriod.end,
        locationId: locationId ? locationId : '%',
        workCodeId: workCodeId ? workCodeId : '%',
        statusIn: status ? status : '',
      },
      function (results, error) {
          entriesByDate = results;
          if (locationId !== '%' || workCodeId !== '%') {
              populateTable(
                  entriesByDate.filter(e => {
                      if (tmpLocationId && tmpWorkCodeId) {
                          wcAbbreviation = workCodeName.split(' ')[0];
                          if (tmpLocationId === '%') {
                              return e.WCCode === wcAbbreviation;
                          } else if (tmpWorkCodeId === '%') {
                              return e.Location_ID === locationId;
                          } else {
                              return e.Location_ID === locationId && e.WCCode === wcAbbreviation;
                          }
                      }
                      if (tmpLocationId && !tmpWorkCodeId && tmpLocationId !== '%') {
                          return e.Location_ID === locationId;
                      }
                      if (tmpWorkCodeId && !tmpLocationId && tmpWorkCodeId !== '%') {
                          wcAbbreviation = workCodeName.split(' ')[0];
                          return e.WCCode === wcAbbreviation;
                      }
                  }),
              );
          } else {
              populateTable(entriesByDate);
          }
      },
    );
  }

  // Pay Period Popup - time entry review landing
  //--------------------------------------------------
  function buildPayPeriodDropdown() {
    // build
    var select = dropdown.build({
      dropdownId: 'payPeriodsDropdown',
      label: 'Pay Periods',
      style: 'secondary',
      readonly: false,
    });
    // populate
    var dropdownData = payPeriodData.map(pp => {
      var dateArray = pp.dateString.split(' - ');
      startDate = dateArray[0];
      endDate = dateArray[1];
      var startDateAbbr = UTIL.abbreviateDateYear(startDate);
      var endDateAbbr = UTIL.abbreviateDateYear(endDate);

      return {
        value: `${startDate} - ${endDate}`,
        text: `${startDateAbbr} - ${endDateAbbr}`,
      };
    });
    dropdown.populate(select, dropdownData, payPeriod.dateString);
    // event
    select.addEventListener('change', function () {
      var dateRange = event.target.value.split(' - ');
      var startDateIso = UTIL.formatDateToIso(dateRange[0]);
      var endDateIso = UTIL.formatDateToIso(dateRange[1]);
      payPeriod = timeEntry.setSelectedPayPeriod(startDateIso, endDateIso, event.target.value);
    });

    return select;
  }

  //Handle navigation from dashboard widget to module
  function dashHandler(startPeriod, endPeriod, status) {
    payPeriodData = timeEntry.getPayPeriods(false);
    locationData = timeEntry.getLocations();
    workCodeData = timeEntry.getWorkCodes();
    let startDateIso = UTIL.formatDateToIso(startPeriod);
    let endDateIso = UTIL.formatDateToIso(endPeriod);

    payPeriod = timeEntry.setSelectedPayPeriod(
      startDateIso,
      endDateIso,
      `${startPeriod} - ${endPeriod}`,
    );
    loadReviewPage(status);
  }
  /*
  function displayPayPeriodPopup() {
    // popup
    var popup = POPUP.build({classNames: 'timeEntryReviewPayPeriodPopup'});
    // popup message
    var popupText = document.createElement('p');
    popupText.innerHTML = 'Please select a pay period to review';
    // popup dropdown
    var payPeriodsDropdown = buildPayPeriodDropdown();
    // apply button
    var applyBtn = button.build({
      text: 'Review',
      style: 'secondary',
      type: 'contained',
      callback: function() {
        POPUP.hide(popup);
        loadReviewPage();
      }
    });
    // build popup
    popup.appendChild(popupText);
    popup.appendChild(payPeriodsDropdown);
    popup.appendChild(applyBtn);
    // show popup
    POPUP.show(popup);
  }
  */
  function refreshPage(payperiod) {
    setActiveModuleSectionAttribute('timeEntry-review');
    payPeriodData = timeEntry.getPayPeriods(false);
    // payPeriod = timeEntry.getCurrentPayPeriod(false);
    payPeriod = payperiod ? payperiod : timeEntry.getCurrentPayPeriod(false);
    locationData = timeEntry.getLocations();
    workCodeData = timeEntry.getWorkCodes();

    loadReviewPage();
  }
  function init() {
    payPeriodData = timeEntry.getPayPeriods(false);
    payPeriod = timeEntry.getCurrentPayPeriod(false);
    locationData = timeEntry.getLocations();
    workCodeData = timeEntry.getWorkCodes();

    //displayPayPeriodPopup();
    loadReviewPage();
  }

  return {
    loadReviewPage,
    handleActionNavEvent,
    clearAllGlobalVariables,
    dashHandler,
    refreshPage,
    showDeleteEntryWarningPopup,
    init,
  };
})();
