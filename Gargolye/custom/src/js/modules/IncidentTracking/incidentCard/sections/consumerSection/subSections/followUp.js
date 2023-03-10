var consumerFollowUp = (function () {
  // DOM
  //---------------------
  var section;
  var followUpHome;
  var newFollowUpBtn;
  var followUpReviewTable;
  //*form
  var followUpForm;
  var followUpTypeDropdown;
  var personResponsibleInput;
  var dueDateInput;
  var completedDateInput;
  var notesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var followUpsData; // save/update data
  var followUpsDeleteData;
  var followUpTypes;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedFollowUpId;
  //*form default values
  var dueDate;
  var dateCompleted;
  var followUpTypeId;
  var personResponsible;
  var followUpNote;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return followUpsData;
  }
  function getDataForDelete() {
    return followUpsDeleteData;
  }
  function clearData() {
    followUpsData = undefined;
    followUpsDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedFollowUpId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    // deletes all follow ups
    if (followUpsData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newFollowUpsData } = followUpsData;
      followUpsData = newFollowUpsData;

      if (!followUpsDeleteData[consumerId]) {
        followUpsDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerFollowUpData() {
    if (!selectedFollowUpId.includes('new')) {
      var deletedFollowUp = followUpsData[selectedConsumerId][selectedFollowUpId];
      if (!followUpsDeleteData[selectedConsumerId]) followUpsDeleteData[selectedConsumerId] = {};
      followUpsDeleteData[selectedConsumerId][selectedFollowUpId] = deletedFollowUp;
    }

    delete followUpsData[selectedConsumerId][selectedFollowUpId];

    selectedFollowUpId = undefined;
    var form = section.querySelector('.followUpForm');
    section.removeChild(form);
    followUpHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getitConsumerFollowUpTypes(function (res) {
      followUpTypes = res;
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
        deleteConsumerFollowUpData();
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
    var hasErrors = false;

    var followUpTypeSelect = followUpTypeDropdown.querySelector('.dropdown__select');
    if (!followUpTypeSelect.value || followUpTypeSelect.value === '%') {
      followUpTypeDropdown.classList.add('error');
      hasErrors = true;
    } else {
      followUpTypeDropdown.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    dueDate = undefined;
    dateCompleted = undefined;
    followUpTypeId = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
    personResponsible = undefined;
    followUpNote = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      dueDate = formData.dueDate;
      dateCompleted = formData.dateCompleted;
      followUpTypeId = formData.followUpTypeId;
      personResponsible = formData.personResponsible;
      followUpNote = formData.notes;
    }
  }
  // events
  function setupFormEvents() {
    var tmpFollowUpTypeId;
    var tmpPersonResponsible;
    var tmpDueDate;
    var tmpCompletedDate;
    var tmpNote;

    followUpTypeDropdown.addEventListener('change', e => {
      tmpFollowUpTypeId = e.target.value;
      checkRequiredFields();
    });
    personResponsibleInput.addEventListener('change', e => {
      tmpPersonResponsible = e.target.value;
    });
    dueDateInput.addEventListener('change', e => {
      tmpDueDate = e.target.value;
    });
    completedDateInput.addEventListener('change', e => {
      tmpCompletedDate = e.target.value;
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
        if (!followUpsData[selectedConsumerId]) {
          followUpsData[selectedConsumerId] = {};
        }

        if (!followUpsData[selectedConsumerId][selectedFollowUpId]) {
          var keys = Object.keys(followUpsData[selectedConsumerId]);
          selectedFollowUpId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          followUpsData[selectedConsumerId][selectedFollowUpId] = {
            dateCompleted: '',
            dueDate: '',
            followUpTypeId: '',
            notes: '',
            personResponsible: '',
            updated: '',
          };
        }

        if (
          tmpCompletedDate ||
          tmpDueDate ||
          tmpFollowUpTypeId ||
          tmpNote ||
          tmpPersonResponsible
        ) {
          followUpsData[selectedConsumerId][selectedFollowUpId].updated = true;
        }

        if (tmpCompletedDate)
          followUpsData[selectedConsumerId][selectedFollowUpId].dateCompleted = tmpCompletedDate;
        if (tmpDueDate) followUpsData[selectedConsumerId][selectedFollowUpId].dueDate = tmpDueDate;
        if (tmpFollowUpTypeId)
          followUpsData[selectedConsumerId][selectedFollowUpId].followUpTypeId = tmpFollowUpTypeId;
        if (tmpNote) followUpsData[selectedConsumerId][selectedFollowUpId].notes = tmpNote;
        if (tmpPersonResponsible)
          followUpsData[selectedConsumerId][selectedFollowUpId].personResponsible =
            tmpPersonResponsible;

        selectedFollowUpId = undefined;

        var form = section.querySelector('.followUpForm');
        section.removeChild(form);
        followUpHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedFollowUpId = undefined;
        var form = section.querySelector('.followUpForm');
        section.removeChild(form);
        followUpHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildFollowUpTypeDropdown() {
    var opts = {
      label: 'Follow Up Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var followUptypeDrop = dropdown.build(opts);

    var data = followUpTypes.map(fu => {
      return {
        value: fu.itFollowUpTypeId,
        text: fu.followUpTypeName,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(followUptypeDrop, data, followUpTypeId);

    return followUptypeDrop;
  }
  function buildPersonResponsibleInput() {
    var opts = {
      label: 'Person Responsible',
      type: 'text',
      style: 'secondary',
      value: personResponsible,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var personInput = input.build(opts);

    return personInput;
  }
  function buildDueDateInput() {
    var inputOptions = {
      label: 'Due Date',
      type: 'date',
      style: 'secondary',
      value: '',
    };

    if (dueDate) inputOptions.value = dueDate;
    if (isEdit && formReadOnly) {
      inputOptions.readonly = true;
    }

    var dateInput = input.build(inputOptions);

    return dateInput;
  }
  function buildCompletedDateInput() {
    var inputOptions = {
      label: 'Date Completed',
      type: 'date',
      style: 'secondary',
      value: '',
    };

    if (dateCompleted) inputOptions.value = dateCompleted;
    if (isEdit && formReadOnly) {
      inputOptions.readonly = true;
    }

    var dateInput = input.build(inputOptions);

    return dateInput;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Note',
      type: 'textarea',
      style: 'secondary',
      value: followUpNote,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var noteInput = input.build(opts);

    return noteInput;
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
  function buildNewFollowUpForm() {
    var form = document.createElement('div');
    form.classList.add('followUpForm');

    followUpTypeDropdown = buildFollowUpTypeDropdown();
    personResponsibleInput = buildPersonResponsibleInput();
    dueDateInput = buildDueDateInput();
    completedDateInput = buildCompletedDateInput();
    notesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(followUpTypeDropdown);
    form.appendChild(personResponsibleInput);
    form.appendChild(dueDateInput);
    form.appendChild(completedDateInput);
    form.appendChild(notesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    followUpHome.classList.add('hidden');

    followUpForm = buildNewFollowUpForm();
    section.appendChild(followUpForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = followUpReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!followUpsData) return;
    if (!followUpsData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(followUpsData[selectedConsumerId]);
    keys.forEach(key => {
      var followUpData = followUpsData[selectedConsumerId][key];

      var filterFollowUpTypes = followUpTypes.filter(
        type => type.itFollowUpTypeId === followUpData.followUpTypeId,
      );
      var followUpType = filterFollowUpTypes[0] ? filterFollowUpTypes[0].followUpTypeName : '';
      var personResponsible = followUpData.personResponsible;
      var dueDate = followUpData.dueDate ? followUpData.dueDate.split(' ')[0] : '';
      dueDate = dueDate ? UTIL.formatDateFromIso(dueDate) : dueDate;

      tableData.push({
        id: key,
        values: [followUpType, personResponsible, dueDate],
      });
    });

    table.populate(followUpReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerFollowUpTable',
      columnHeadings: ['Follow Up Type', 'Person Responsible', 'Due Date'],
    });

    reviewTable.addEventListener('click', event => {
      if (
        event.target.classList.contains('table__row') &&
        !event.target.classList.contains('header')
      ) {
        selectedFollowUpId = event.target.id;
        setFormDataDefaults(followUpsData[selectedConsumerId][selectedFollowUpId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    followUpsData = {};
    followUpsDeleteData = {};
    getDropdownData();
  }
  function buildAddNewFollowUpBtn() {
    var btn = button.build({
      text: 'Add New Follow Up',
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
    section.classList.add('consumerSections__section', 'followUpSection');

    followUpHome = document.createElement('div');
    followUpHome.classList.add('consumerSections__section__home');

    newFollowUpBtn = buildAddNewFollowUpBtn();
    followUpReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) followUpHome.appendChild(newFollowUpBtn);
    followUpHome.appendChild(followUpReviewTable);

    section.appendChild(followUpHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!followUpsData[selectedConsumerId]) {
          followUpsData[selectedConsumerId] = {};
        }

        if (!followUpsData[selectedConsumerId][d.itConsumerFollowUpId]) {
          followUpsData[selectedConsumerId][d.itConsumerFollowUpId] = d;
          followUpsData[selectedConsumerId][d.itConsumerFollowUpId].updated = false;

          // format dates
          var dateTimeCompleted =
            followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dateCompleted;
          var dueDateTime = followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dueDate;
          dateCompleted = dateTimeCompleted ? dateTimeCompleted.split(' ')[0] : null;
          dueDate = dueDateTime ? dueDateTime.split(' ')[0] : null;

          if (dateCompleted) {
            followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dateCompleted =
              UTIL.formatDateToIso(dateCompleted);
          }
          if (dueDate) {
            followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dueDate =
              UTIL.formatDateToIso(dueDate);
          }
        }
      });
    }
    console.table(followUpsData);

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
