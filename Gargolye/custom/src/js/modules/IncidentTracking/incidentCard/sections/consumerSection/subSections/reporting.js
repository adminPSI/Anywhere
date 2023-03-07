var consumerReporting = (function () {
  // DOM
  //---------------------
  var section;
  var reportingHome;
  var newReportingBtn;
  var reportingReviewTable;
  //*form
  var reportingCategoryDropdown;
  var reportedByInput;
  var reportedToInput;
  var reportMethodInput;
  var reportDateInput;
  var reportTimeInput;
  var reportNotesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var reportingData;
  var reportingDeleteData;
  var reportingCategories;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedReportId;
  //*form values
  var dateReported;
  var reportTime;
  var reportBy;
  var reportMethod;
  var reportTo;
  var reportingCategoryId;
  var reportNotes;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return reportingData;
  }
  function getDataForDelete() {
    return reportingDeleteData;
  }
  function clearData() {
    reportingData = undefined;
    reportingDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedReportId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    var { [consumerId]: removedConsumerData, ...newReportingData } = reportingData;
    reportingData = newReportingData;

    if (!reportingDeleteData[consumerId]) {
      reportingDeleteData[consumerId] = removedConsumerData;
    }
  }
  function deleteConsumerReportingData() {
    if (!selectedReportId.includes('new')) {
      var deletedReport = reportingData[selectedConsumerId][selectedReportId];
      if (!reportingDeleteData[selectedConsumerId]) reportingDeleteData[selectedConsumerId] = {};
      reportingDeleteData[selectedConsumerId][selectedReportId] = deletedReport;
    }

    delete reportingData[selectedConsumerId][selectedReportId];

    selectedReportId = undefined;
    var form = section.querySelector('.reportForm');
    section.removeChild(form);
    reportingHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getitReportingCategories(function (res) {
      reportingCategories = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerReportingData();
        POPUP.hide(deleteWarningPopup);
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var reportCatSelect = reportingCategoryDropdown.querySelector('.dropdown__select');
    if (!reportCatSelect.value || reportCatSelect.value === '%') {
      reportingCategoryDropdown.classList.add('error');
      hasErrors = true;
    } else {
      reportingCategoryDropdown.classList.remove('error');
    }

    var dateInput = reportDateInput.querySelector('input');
    if (!dateInput.value) {
      reportDateInput.classList.add('error');
      hasErrors = true;
    } else {
      reportDateInput.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    dateReported = undefined;
    reportTime = undefined;
    reportBy = undefined;
    reportMethod = undefined;
    reportTo = undefined;
    reportingCategoryId = undefined;
    reportNotes = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    console.table(formData);
    if (formData) {
      dateReported = formData.dateReported;
      reportTime = formData.timeReported; // todo
      reportBy = formData.reportBy;
      reportMethod = formData.reportMethod;
      reportTo = formData.reportTo;
      reportingCategoryId = formData.reportingCategoryID;
      reportNotes = formData.notes;
    }
  }
  // events
  function setupFormEvents() {
    var tmpReportingCategoryId;
    var tmpReportedBy;
    var tmpReportedTo;
    var tmpReportMethod;
    var tmpReportDate;
    var tmpReportTime;
    var tmpNote;

    reportingCategoryDropdown.addEventListener('change', e => {
      tmpReportingCategoryId = e.target.value;
      checkRequiredFields();
    });
    reportedByInput.addEventListener('change', e => {
      tmpReportedBy = e.target.value;
    });
    reportedToInput.addEventListener('change', e => {
      tmpReportedTo = e.target.value;
    });
    reportMethodInput.addEventListener('change', e => {
      tmpReportMethod = e.target.value;
    });
    reportDateInput.addEventListener('change', e => {
      tmpReportDate = e.target.value;
      checkRequiredFields();
    });
    reportTimeInput.addEventListener('change', e => {
      tmpReportTime = e.target.value;
    });
    reportNotesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!reportingData[selectedConsumerId]) {
          reportingData[selectedConsumerId] = {};
        }

        if (!reportingData[selectedConsumerId][selectedReportId]) {
          var keys = Object.keys(reportingData[selectedConsumerId]);
          selectedReportId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          reportingData[selectedConsumerId][selectedReportId] = {
            reportingCategoryID: '',
            reportBy: '',
            reportTo: '',
            reportMethod: '',
            dateReported: '',
            notes: '',
            updated: '',
          };
        }

        if (
          tmpReportingCategoryId ||
          tmpReportedBy ||
          tmpReportedTo ||
          tmpReportMethod ||
          tmpReportDate ||
          tmpReportTime ||
          tmpNote
        ) {
          reportingData[selectedConsumerId][selectedReportId].updated = true;
        }

        if (tmpReportingCategoryId)
          reportingData[selectedConsumerId][selectedReportId].reportingCategoryID =
            tmpReportingCategoryId;
        if (tmpReportedBy)
          reportingData[selectedConsumerId][selectedReportId].reportBy = tmpReportedBy;
        if (tmpReportedTo)
          reportingData[selectedConsumerId][selectedReportId].reportTo = tmpReportedTo;
        if (tmpReportMethod)
          reportingData[selectedConsumerId][selectedReportId].reportMethod = tmpReportMethod;
        if (tmpReportDate)
          reportingData[selectedConsumerId][selectedReportId].dateReported = tmpReportDate;
        if (tmpReportTime)
          reportingData[selectedConsumerId][selectedReportId].timeReported = tmpReportTime;
        if (tmpNote) reportingData[selectedConsumerId][selectedReportId].notes = tmpNote;

        selectedReportId = undefined;

        var form = section.querySelector('.reportForm');
        section.removeChild(form);
        reportingHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        return;
      }

      if (e.target === cancelBtn) {
        selectedReportId = undefined;
        var form = section.querySelector('.reportForm');
        section.removeChild(form);
        reportingHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildReportingCategoryDropdown() {
    var opts = {
      label: 'Reporting To Category',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rCatDrop = dropdown.build(opts);

    var data = reportingCategories.map(cat => {
      return {
        value: cat.itReportingCategoryId,
        text: cat.itReportingCategoryName,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(rCatDrop, data, reportingCategoryId);

    return rCatDrop;
  }
  function buildReportedByInput() {
    var opts = {
      label: 'Reported By',
      type: 'text',
      style: 'secondary',
      value: reportBy,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rbInput = input.build(opts);

    return rbInput;
  }
  function buildReportedToInput() {
    var opts = {
      label: 'Reported To',
      type: 'text',
      style: 'secondary',
      value: reportTo,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rtInput = input.build(opts);

    return rtInput;
  }
  function buildReportMethodInput() {
    var opts = {
      label: 'Report Method',
      type: 'text',
      style: 'secondary',
      value: reportMethod,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rmInput = input.build(opts);

    return rmInput;
  }
  function buildReportedDateInput() {
    var opts = {
      label: 'Date Reported',
      type: 'date',
      style: 'secondary',
      value: dateReported,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rdInput = input.build(opts);

    return rdInput;
  }
  function buildReportedTimeInput() {
    var opts = {
      label: 'Reported Time',
      type: 'time',
      style: 'secondary',
      value: reportTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rtInput = input.build(opts);

    return rtInput;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
      value: reportNotes,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var nInput = input.build(opts);

    return nInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate)
      btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewReportingForm() {
    var form = document.createElement('div');
    form.classList.add('reportForm');

    reportingCategoryDropdown = buildReportingCategoryDropdown();
    reportedByInput = buildReportedByInput();
    reportedToInput = buildReportedToInput();
    reportMethodInput = buildReportMethodInput();
    reportDateInput = buildReportedDateInput();
    reportTimeInput = buildReportedTimeInput();
    reportNotesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(reportingCategoryDropdown);
    form.appendChild(reportedByInput);
    form.appendChild(reportedToInput);
    form.appendChild(reportMethodInput);
    form.appendChild(reportDateInput);
    form.appendChild(reportTimeInput);
    form.appendChild(reportNotesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    reportingHome.classList.add('hidden');

    var reportingForm = buildNewReportingForm();
    section.appendChild(reportingForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = reportingReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!reportingData) return;
    if (!reportingData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(reportingData[selectedConsumerId]);
    keys.forEach(key => {
      var data = reportingData[selectedConsumerId][key];
      var filteredCategories = reportingCategories.filter(
        rCat => rCat.itReportingCategoryId === data.reportingCategoryID,
      );
      var reportedCategory = filteredCategories[0].itReportingCategoryName;
      var date = data.dateReported ? data.dateReported.split(' ')[0] : '';
      date = date ? UTIL.formatDateFromIso(date) : date;
      var reportBy = data.reportBy;

      tableData.push({
        id: key,
        values: [reportedCategory, date, reportBy],
      });
    });

    table.populate(reportingReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerReportingTable',
      columnHeadings: ['Reporting Category', 'Date Reported', 'Reported By'],
    });

    reviewTable.addEventListener('click', event => {
      if (
        event.target.classList.contains('table__row') &&
        !event.target.classList.contains('header')
      ) {
        selectedReportId = event.target.id;
        setFormDataDefaults(reportingData[selectedConsumerId][selectedReportId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    reportingData = {};
    reportingDeleteData = {};
    getDropdownData();
  }
  function buildAddNewFollowUpBtn() {
    var btn = button.build({
      text: 'Add New Reporting',
      type: 'contained',
      style: 'secondary',
    });

    btn.addEventListener('click', () => {
      showForm(false);
      incidentCard.checkEntireIncidentCardforErrors();
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'reportingSection');

    reportingHome = document.createElement('div');
    reportingHome.classList.add('consumerSections__section__home');

    newReportingBtn = buildAddNewFollowUpBtn();
    reportingReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) reportingHome.appendChild(newReportingBtn);
    reportingHome.appendChild(reportingReviewTable);

    section.appendChild(reportingHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!reportingData[selectedConsumerId]) {
          reportingData[selectedConsumerId] = {};
        }

        if (!reportingData[selectedConsumerId][d.itConsumerReportId]) {
          reportingData[selectedConsumerId][d.itConsumerReportId] = d;
          reportingData[selectedConsumerId][d.itConsumerReportId].updated = false;

          // format dates
          if (reportingData[selectedConsumerId][d.itConsumerReportId].dateReported) {
            var dateReported =
              reportingData[selectedConsumerId][d.itConsumerReportId].dateReported.split(' ')[0];
            reportingData[selectedConsumerId][d.itConsumerReportId].dateReported =
              UTIL.formatDateToIso(dateReported);
          }
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
