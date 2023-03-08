var consumerIntervention = (function () {
  // DOM
  //---------------------
  var section;
  var interventionHome;
  var newInterventionBtn;
  var interventionReviewTable;
  //*form
  var interventionTypeDropdown;
  var startTimeInput;
  var endTimeInput;
  var totalTimeInput;
  var aversiveCheckbox;
  var notesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var interventionData; // save/update data
  var interventionDeleteData;
  var interventionTypes;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedInterventionId;
  //*form values
  var interventionTypeId;
  var startTime;
  var endTime;
  var timeLength;
  var aversive;
  var note;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function calculateTotalHours(dirtyStart, dirtyEnd) {
    // must be military time
    if (dirtyStart === '' || dirtyEnd === '' || !dirtyStart || !dirtyEnd) {
      return;
    }

    var startTime = dirtyStart.split(':');
    var endTime = dirtyEnd.split(':');

    var tempDate = new Date();
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth();
    var day = tempDate.getDate();

    var startDate = new Date(year, month, day, startTime[0], startTime[1]);
    var endDate;
    if (dirtyEnd === '00:00') {
      endDate = new Date(year, month, day + 1, endTime[0], endTime[1]);
    } else {
      endDate = new Date(year, month, day, endTime[0], endTime[1]);
    }

    var timeDiff = endDate - startDate;
    var hoursDiff = Math.floor((timeDiff % 86400000) / 3600000);
    var minutesDiff = Math.floor(((timeDiff % 86400000) % 3600000) / 60000);

    return `${UTIL.leadingZero(hoursDiff)}:${UTIL.leadingZero(minutesDiff)}`;
  }
  function calculateTimeLength() {
    var stInput = startTimeInput.querySelector('input');
    var etInput = endTimeInput.querySelector('input');
    var ttInput = totalTimeInput.querySelector('input');

    var sTime = stInput.value;
    var eTime = etInput.value;

    if (!sTime || !eTime) {
      if (!sTime) startTimeInput.classList.remove('error');
      if (!eTime) endTimeInput.classList.remove('error');
      if (!sTime && !eTime) saveBtn.classList.remove('disabled');
      return null;
    }

    var totalTime = calculateTotalHours(sTime, eTime);

    if (totalTime.search('-') === -1) {
      ttInput.value = totalTime;
      startTimeInput.classList.remove('error');
      endTimeInput.classList.remove('error');
      saveBtn.classList.remove('disabled');
      return totalTime;
    } else {
      ttInput.value = '';
      startTimeInput.classList.add('error');
      endTimeInput.classList.add('error');
      saveBtn.classList.add('disabled');
      return null;
    }
  }

  function getDataForSave() {
    return interventionData;
  }
  function getDataForDelete() {
    return interventionDeleteData;
  }
  function clearData() {
    interventionData = undefined;
    interventionDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedInterventionId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    if (interventionData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newInterventionData } = interventionData;
      interventionData = newInterventionData;

      if (!interventionDeleteData[consumerId]) {
        interventionDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerInterventionData() {
    if (!selectedInterventionId.includes('new')) {
      var deletedIntervention = interventionData[selectedConsumerId][selectedInterventionId];
      if (!interventionDeleteData[selectedConsumerId])
        interventionDeleteData[selectedConsumerId] = {};
      interventionDeleteData[selectedConsumerId][selectedInterventionId] = deletedIntervention;
    }

    delete interventionData[selectedConsumerId][selectedInterventionId];

    selectedInterventionId = undefined;
    var form = section.querySelector('.interventionForm');
    section.removeChild(form);
    interventionHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getInterventionTypesDropdown(function (res) {
      interventionTypes = res;
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
        deleteConsumerInterventionData();
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

    var interventionTypeSelect = interventionTypeDropdown.querySelector('.dropdown__select');
    if (!interventionTypeSelect.value || interventionTypeSelect.value === '%') {
      interventionTypeDropdown.classList.add('error');
      hasErrors = true;
    } else {
      interventionTypeDropdown.classList.remove('error');
    }

    //var errors = [...followUpForm.querySelectorAll('.error')];
    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    interventionTypeId = undefined;
    startTime = undefined;
    endTime = undefined;
    timeLength = undefined;
    aversive = undefined;
    note = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      var sTime = formData.startTime.split(':');
      var eTime = formData.stopTime.split(':');
      var tTime = formData.timeLength.split(':');

      interventionTypeId = formData.interventionType;
      startTime = `${sTime[0]}:${sTime[1]}`;
      endTime = `${eTime[0]}:${eTime[1]}`;
      timeLength = `${tTime[0]}:${tTime[1]}`;
      aversive = formData.aversive;
      note = formData.interventionNotes;
      lastUpdatedBy = formData.lastUpdatedBy;
      lastUpdatedOn = formData.lastUpdatedOn;
    }
  }
  // events
  function setupFormEvents() {
    var tmpInterventionType;
    var tmpStartTime;
    var tmpEndTime;
    var tmpTimeLength;
    var tmpAversive;
    var tmpNote;

    interventionTypeDropdown.addEventListener('change', e => {
      tmpInterventionType = e.target.value;
      checkRequiredFields();
    });
    startTimeInput.addEventListener('change', e => {
      tmpStartTime = e.target.value;
      tmpTimeLength = calculateTimeLength();
    });
    endTimeInput.addEventListener('change', e => {
      tmpEndTime = e.target.value;
      tmpTimeLength = calculateTimeLength();
    });
    aversiveCheckbox.addEventListener('change', e => {
      tmpAversive = e.target.checked ? 'Y' : 'N';
    });
    notesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!interventionData[selectedConsumerId]) {
          interventionData[selectedConsumerId] = {};
        }

        if (!interventionData[selectedConsumerId][selectedInterventionId]) {
          var keys = Object.keys(interventionData[selectedConsumerId]);
          selectedInterventionId =
            keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          interventionData[selectedConsumerId][selectedInterventionId] = {
            interventionType: '',
            startTime: '',
            stopTime: '',
            timeLength: '',
            aversive: '',
            interventionNotes: '',
            updated: '',
          };
        }

        if (
          tmpInterventionType ||
          tmpStartTime ||
          tmpEndTime ||
          tmpTimeLength ||
          tmpAversive ||
          tmpNote
        ) {
          interventionData[selectedConsumerId][selectedInterventionId].updated = true;
        }

        if (tmpInterventionType)
          interventionData[selectedConsumerId][selectedInterventionId].interventionType =
            tmpInterventionType;
        if (tmpStartTime)
          interventionData[selectedConsumerId][selectedInterventionId].startTime = tmpStartTime;
        if (tmpEndTime)
          interventionData[selectedConsumerId][selectedInterventionId].stopTime = tmpEndTime;
        if (tmpTimeLength)
          interventionData[selectedConsumerId][selectedInterventionId].timeLength = tmpTimeLength;
        if (tmpAversive)
          interventionData[selectedConsumerId][selectedInterventionId].aversive = tmpAversive;
        if (tmpNote)
          interventionData[selectedConsumerId][selectedInterventionId].interventionNotes = tmpNote;

        selectedInterventionId = undefined;

        var form = section.querySelector('.interventionForm');
        section.removeChild(form);
        interventionHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        return;
      }

      if (e.target === cancelBtn) {
        selectedInterventionId = undefined;
        var form = section.querySelector('.interventionForm');
        section.removeChild(form);
        interventionHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildInterventionTypeDropdown() {
    var opts = {
      label: 'Intervention Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iTypeDrop = dropdown.build(opts);

    var data = interventionTypes.map(it => {
      return {
        value: it.interventionTypeId,
        text: it.description,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(iTypeDrop, data, interventionTypeId);

    return iTypeDrop;
  }
  function buildStartTimeInput() {
    var opts = {
      label: 'Start Time',
      type: 'time',
      style: 'secondary',
      value: startTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var stInput = input.build(opts);

    return stInput;
  }
  function buildEndTimeInput() {
    var opts = {
      label: 'End Time',
      type: 'time',
      style: 'secondary',
      value: endTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var etInput = input.build(opts);

    return etInput;
  }
  function buildTotalTimeInput() {
    var opts = {
      label: 'Total Time',
      type: 'text',
      style: 'secondary',
      readonly: true,
      value: timeLength,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var etInput = input.build(opts);

    return etInput;
  }
  function buildAversiveCheckbox() {
    var opts = {
      text: 'Aversive',
      isChecked: aversive === 'Y' ? true : false,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var checkbox = input.buildCheckbox(opts);

    return checkbox;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
      value: note,
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
  function buildNewInterventionForm() {
    var form = document.createElement('div');
    form.classList.add('interventionForm');

    interventionTypeDropdown = buildInterventionTypeDropdown();
    startTimeInput = buildStartTimeInput();
    endTimeInput = buildEndTimeInput();
    totalTimeInput = buildTotalTimeInput();
    aversiveCheckbox = buildAversiveCheckbox();
    notesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(interventionTypeDropdown);
    form.appendChild(startTimeInput);
    form.appendChild(endTimeInput);
    form.appendChild(totalTimeInput);
    form.appendChild(aversiveCheckbox);
    form.appendChild(notesInput);
    form.appendChild(formButtons);

    form.addEventListener('change', () => incidentCard.checkEntireIncidentCardforErrors());

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    interventionHome.classList.add('hidden');

    var interventionForm = buildNewInterventionForm();
    section.appendChild(interventionForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = interventionReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!interventionData) return;
    if (!interventionData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(interventionData[selectedConsumerId]);
    keys.forEach(key => {
      var data = interventionData[selectedConsumerId][key];
      var filteredInterventionTypes = interventionTypes.filter(
        it => it.interventionTypeId === data.interventionType,
      );
      var interventionType = filteredInterventionTypes[0].description;
      var timeLength = data.timeLength.split(':');
      timeLength = `${timeLength[0]}:${timeLength[1]}`;
      var aversive = data.aversive === 'Y' ? 'Yes' : 'No';

      tableData.push({
        id: key,
        values: [interventionType, timeLength, aversive],
      });
    });

    table.populate(interventionReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerInterventionTable',
      columnHeadings: ['Intervention Type', 'Time Length', 'Aversive'],
    });

    reviewTable.addEventListener('click', event => {
      if (
        event.target.classList.contains('table__row') &&
        !event.target.classList.contains('header')
      ) {
        selectedInterventionId = event.target.id;
        setFormDataDefaults(interventionData[selectedConsumerId][selectedInterventionId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    interventionData = {};
    interventionDeleteData = {};
    getDropdownData();
  }
  function buildAddNewInterventionBtn() {
    var btn = button.build({
      text: 'Add New Intervention',
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
    section.classList.add('consumerSections__section', 'interventionSection');

    interventionHome = document.createElement('div');
    interventionHome.classList.add('consumerSections__section__home');

    newInterventionBtn = buildAddNewInterventionBtn();
    interventionReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) interventionHome.appendChild(newInterventionBtn);
    interventionHome.appendChild(interventionReviewTable);

    section.appendChild(interventionHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!interventionData[selectedConsumerId]) {
          interventionData[selectedConsumerId] = {};
        }

        if (!interventionData[selectedConsumerId][d.itConsumerInterventionId]) {
          interventionData[selectedConsumerId][d.itConsumerInterventionId] = d;
          interventionData[selectedConsumerId][d.itConsumerInterventionId].updated = false;
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
