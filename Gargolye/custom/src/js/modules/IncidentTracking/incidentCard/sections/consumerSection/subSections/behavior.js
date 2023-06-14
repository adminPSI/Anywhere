const consumerBehavior = (function () {
  // DOM
  //---------------------
  let section;
  let behaviorHome;
  let newBehaviorBtn;
  let behaviorReviewTable;
  //*form
  let behaviorTypeDropdown;
  let startTimeInput;
  let endTimeInput;
  let occurrencesInput;
  let formButtons;
  let deleteBtn;
  let saveBtn;
  let cancelBtn;
  // DATA
  //---------------------
  let behaviorData; // save/update data
  let behaviorDeleteData;
  let behaviorTypes; // dropdown data
  // Values
  //---------------------
  let selectedConsumerId;
  let selectedBehaviorId;
  //*form default values
  let behaviorType;
  let behaviorTypeId;
  let startTime;
  let endTime;
  let occurrences;

  let isEdit;
  let formReadOnly;

  function getDataForSave() {
    return behaviorData;
  }
  function getDataForDelete() {
    return behaviorDeleteData;
  }
  function clearData() {
    behaviorData = undefined;
    behaviorDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedBehaviorId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    // deletes all follow ups
    if (behaviorData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newBehaviorData } = behaviorData;
      behaviorData = newBehaviorData;

      if (!behaviorDeleteData[consumerId]) {
        behaviorDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerBehaviorData() {
    if (!selectedBehaviorId.includes('new')) {
      var deletedBehavior = behaviorData[selectedConsumerId][selectedBehaviorId];
      if (!behaviorDeleteData[selectedConsumerId]) behaviorDeleteData[selectedConsumerId] = {};
      behaviorDeleteData[selectedConsumerId][selectedBehaviorId] = deletedBehavior;
    }

    delete behaviorData[selectedConsumerId][selectedBehaviorId];

    selectedBehaviorId = undefined;
    var form = section.querySelector('.behaviorForm');
    section.removeChild(form);
    behaviorHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }
  function formatTime(dirtyTime) {
    dirtyTime.replace('-', '');
    const splitTime = dirtyTime.split(':');
    const hours = splitTime[0].length === 1 ? `0${splitTime[0]}` : splitTime[0];
    const minutes = splitTime[1].length === 1 ? `0${splitTime[1]}` : splitTime[1];
    return `${hours}:${minutes}`;
  }
  function getTimeLength(start, end) {
    if (!start || !end) return '';
    if (start.includes('/')) {
      start = start.split(' ')[1];
    }
    let totalTime = UTIL.calculateTotalHours(start, end, 'hh:mm');
    totalTime = formatTime(totalTime);
    return totalTime;
  }
  function parseStartTime(dirtyStart) {
    const splittime = dirtyStart.split(' ');
    const time = `${splittime[1]} ${splittime[2]}`;
    return UTIL.convertToMilitary(time);
  }

  function getDropdownData() {
    incidentTrackingAjax.getitConsumerBehaviorTypes(function (res) {
      behaviorTypes = res;
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
        deleteConsumerBehaviorData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
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
    var hasErrors = [].slice.call(section.querySelectorAll('.error'));

    if (hasErrors.length === 0) {
      saveBtn.classList.remove('disabled');
    } else {
      saveBtn.classList.add('disabled');
    }
  }
  function clearFormDataDefaults() {
    behaviorType = undefined;
    behaviorTypeId = undefined;
    startTime = undefined;
    endTime = undefined;
    occurrences = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      behaviorType = formData.behaviorType;
      behaviorTypeId = formData.behaviorTypeId;
      startTime = formData.startTime;
      endTime = formData.endTime;
      occurrences = formData.occurrences;
    }
  }
  // events
  function setupFormEvents() {
    let tmpBehaviorTypeId = null;
    let tmpStartTime = null;
    let tmpEndTime = null;
    let tmpOccurrences = null;

    behaviorTypeDropdown.addEventListener('change', e => {
      if (!e.target.value || e.target.value === '%') {
        behaviorTypeDropdown.classList.add('error');
      } else {
        behaviorTypeDropdown.classList.remove('error');
      }

      tmpBehaviorTypeId = e.target.value;
      checkRequiredFields();
    });
    startTimeInput.addEventListener('change', e => {
      tmpStartTime = e.target.value;
    });
    endTimeInput.addEventListener('change', e => {
      tmpEndTime = e.target.value;
    });
    occurrencesInput.addEventListener('keyup', e => {
      if (e.target.value < 0) {
        occurrencesInput.classList.add('error');
      } else {
        occurrencesInput.classList.add('error');
      }
    });
    occurrencesInput.addEventListener('change', e => {
      tmpOccurrences = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (e.target.classList.contains('disabled')) return;

        if (!behaviorData[selectedConsumerId]) {
          behaviorData[selectedConsumerId] = {};
        }

        if (!behaviorData[selectedConsumerId][selectedBehaviorId]) {
          var keys = Object.keys(behaviorData[selectedConsumerId]);
          selectedBehaviorId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          behaviorData[selectedConsumerId][selectedBehaviorId] = {
            behaviorTypeId: '',
            startTime: '',
            endTime: '',
            occurrences: '',
            updated: '',
          };
        }

        if (
          tmpBehaviorTypeId !== null ||
          tmpStartTime !== null ||
          tmpEndTime !== null ||
          tmpOccurrences !== null
        ) {
          behaviorData[selectedConsumerId][selectedBehaviorId].updated = true;
        }

        if (tmpBehaviorTypeId !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].behaviorTypeId = tmpBehaviorTypeId;
        }
        if (tmpStartTime !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].startTime = tmpStartTime;
        }
        if (tmpEndTime !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].endTime = tmpEndTime;
        }
        if (tmpOccurrences !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].occurrences = tmpOccurrences;
        }

        selectedBehaviorId = undefined;

        var form = section.querySelector('.behaviorForm');
        section.removeChild(form);
        behaviorHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedBehaviorId = undefined;
        var form = section.querySelector('.behaviorForm');
        section.removeChild(form);
        behaviorHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildBehaviorTypeDropdown() {
    var opts = {
      label: 'Behavior Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var behaviortypeDrop = dropdown.build(opts);

    var data = behaviorTypes.map(fu => {
      return {
        value: fu.itBehaviorTypeId,
        text: fu.behaviorTypeName,
      };
    });

    data.sort((a, b) => {
      return a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1;
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(behaviortypeDrop, data, behaviorTypeId);

    return behaviortypeDrop;
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

    var startTimeInput = input.build(opts);

    return startTimeInput;
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

    var endTimeInput = input.build(opts);

    return endTimeInput;
  }
  function buildOccurrencesInput() {
    var opts = {
      label: 'No. of Occurrences',
      type: 'number',
      style: 'secondary',
      value: occurrences,
      attributes: [
        {
          key: 'min',
          value: 1,
        },
        {
          key: 'step',
          value: 1,
        },
      ],
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var occurrencesInput = input.build(opts);

    return occurrencesInput;
  }

  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
      classNames: 'disabled',
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
  function buildNewBehaviorForm() {
    let form = document.createElement('div');
    form.classList.add('behaviorForm');

    behaviorTypeDropdown = buildBehaviorTypeDropdown();
    startTimeInput = buildStartTimeInput();
    endTimeInput = buildEndTimeInput();
    occurrencesInput = buildOccurrencesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(behaviorTypeDropdown);
    form.appendChild(startTimeInput);
    form.appendChild(endTimeInput);
    form.appendChild(occurrencesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    behaviorHome.classList.add('hidden');

    behaviorForm = buildNewBehaviorForm();
    section.appendChild(behaviorForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = behaviorReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!behaviorData) return;
    if (!behaviorData[selectedConsumerId]) return;

    let tableData = [];

    let keys = Object.keys(behaviorData[selectedConsumerId]);
    keys.forEach(key => {
      let behaviorDATA = behaviorData[selectedConsumerId][key];

      let filterBehaviorTypes = behaviorTypes.filter(
        type => type.itBehaviorTypeId === behaviorDATA.behaviorTypeId,
      );
      let behaviorType = filterBehaviorTypes[0] ? filterBehaviorTypes[0].behaviorTypeName : '';
      let timeLength = getTimeLength(behaviorDATA.startTime, behaviorDATA.endTime);
      let occurrencesNum = behaviorDATA.occurrences;

      tableData.push({
        id: key,
        values: [behaviorType, timeLength, occurrencesNum],
      });
    });

    table.populate(behaviorReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerBehaviorTable',
      columnHeadings: ['Behavior Type', 'Time Length', 'Occurrences'],
    });

    reviewTable.addEventListener('click', event => {
      if (
        event.target.classList.contains('table__row') &&
        !event.target.classList.contains('header')
      ) {
        selectedBehaviorId = event.target.id;
        setFormDataDefaults(behaviorData[selectedConsumerId][selectedBehaviorId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    behaviorData = {};
    behaviorDeleteData = {};
    getDropdownData();
  }
  function buildAddNewBehaviorBtn() {
    var btn = button.build({
      text: 'Add New Behavior Detail',
      type: 'contained',
      style: 'secondary',
    });
    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'behaviorSection');

    behaviorHome = document.createElement('div');
    behaviorHome.classList.add('consumerSections__section__home');

    newBehaviorBtn = buildAddNewBehaviorBtn();
    behaviorReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) behaviorHome.appendChild(newBehaviorBtn);
    behaviorHome.appendChild(behaviorReviewTable);

    section.appendChild(behaviorHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        d.startTime = parseStartTime(d.startTime);

        if (!behaviorData[selectedConsumerId]) {
          behaviorData[selectedConsumerId] = {};
        }

        if (!behaviorData[selectedConsumerId][d.itConsumerBehaviorId]) {
          behaviorData[selectedConsumerId][d.itConsumerBehaviorId] = d;
          behaviorData[selectedConsumerId][d.itConsumerBehaviorId].updated = false;
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
