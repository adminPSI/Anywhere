var consumerInjuries = (function () {
  // DOM
  //---------------------
  var section;
  var injuriesHome;
  var newInjuryBtn;
  var injuriesReviewTable;
  //*form
  var injuryLocationDropdown;
  var injuryTypeDropdown;
  var checkedByNurseCheckbox;
  var detailsInput;
  var treatmentInput;
  var dateCheckedInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var injuryData; // save/update data
  var injuryDeleteData;
  var injuryLocations;
  var injuryTypes;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedInjuryId;
  //*form values
  var injuryLocationId;
  var injuryTypeId;
  var checkedByNurse;
  var details;
  var treatment;
  var dateChecked;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return injuryData;
  }
  function getDataForDelete() {
    return injuryDeleteData;
  }
  function clearData() {
    injuryData = undefined;
    injuryDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedInjuryId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    if (injuryData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newInjuryData } = injuryData;
      injuryData = newInjuryData;

      if (!injuryDeleteData[consumerId]) {
        injuryDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerInjuryData() {
    if (!selectedInjuryId.includes('new')) {
      var deletedInjury = injuryData[selectedConsumerId][selectedInjuryId];
      if (!injuryDeleteData[selectedConsumerId]) injuryDeleteData[selectedConsumerId] = {};
      injuryDeleteData[selectedConsumerId][selectedInjuryId] = deletedInjury;
    }

    delete injuryData[selectedConsumerId][selectedInjuryId];

    selectedInjuryId = undefined;
    var form = section.querySelector('.injuryForm');
    section.removeChild(form);
    injuriesHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getInjuryLocationsDropdown(function (locations) {
      injuryLocations = locations;

      incidentTrackingAjax.getInjuryTypesDropdown(function (types) {
        injuryTypes = types;
      });
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
        deleteConsumerInjuryData();
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

    var injuryLocationSelect = injuryLocationDropdown.querySelector('.dropdown__select');
    var injuryTypeSelect = injuryTypeDropdown.querySelector('.dropdown__select');

    if (!injuryLocationSelect.value || injuryLocationSelect.value === '%') {
      injuryLocationDropdown.classList.add('error');
      hasErrors = true;
    } else {
      injuryLocationDropdown.classList.remove('error');
    }

    if (!injuryTypeSelect.value || injuryTypeSelect.value === '%') {
      injuryTypeDropdown.classList.add('error');
      hasErrors = true;
    } else {
      injuryTypeDropdown.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    injuryLocationId = undefined;
    injuryTypeId = undefined;
    checkedByNurse = undefined;
    details = undefined;
    treatment = undefined;
    dateChecked = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      injuryLocationId = formData.injuryLocationId;
      injuryTypeId = formData.injuryTypeId;
      checkedByNurse = formData.checkedByNurse;
      details = formData.injuryDetails;
      treatment = formData.injuryTreatment;
      dateChecked = formData.checkedDate;
    }
  }
  // events
  function setupFormEvents() {
    var tmpInjuryLocation;
    var tmpInjuryType;
    var tmpCheckedBy;
    var tmpDetails;
    var tmpTreatment;
    var tmpDateChecked;

    injuryLocationDropdown.addEventListener('change', e => {
      tmpInjuryLocation = e.target.value;
      checkRequiredFields();
    });
    injuryTypeDropdown.addEventListener('change', e => {
      tmpInjuryType = e.target.value;
      checkRequiredFields();
    });
    checkedByNurseCheckbox.addEventListener('change', e => {
      tmpCheckedBy = e.target.checked ? 'Y' : 'N';
    });
    detailsInput.addEventListener('change', e => {
      tmpDetails = e.target.value;
    });
    treatmentInput.addEventListener('change', e => {
      tmpTreatment = e.target.value;
    });
    dateCheckedInput.addEventListener('change', e => {
      tmpDateChecked = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!injuryData[selectedConsumerId]) {
          injuryData[selectedConsumerId] = {};
        }

        if (!injuryData[selectedConsumerId][selectedInjuryId]) {
          var keys = Object.keys(injuryData[selectedConsumerId]);
          selectedInjuryId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          injuryData[selectedConsumerId][selectedInjuryId] = {
            injuryLocationId: '',
            injuryTypeId: '',
            checkedByNurse: 'N',
            injuryDetails: '',
            injuryTreatment: '',
            checkedDate: '',
            updated: '',
          };
        }

        if (
          tmpInjuryLocation ||
          tmpInjuryType ||
          tmpCheckedBy ||
          tmpDetails ||
          tmpTreatment ||
          tmpDateChecked
        ) {
          injuryData[selectedConsumerId][selectedInjuryId].updated = true;
        }

        if (tmpInjuryLocation)
          injuryData[selectedConsumerId][selectedInjuryId].injuryLocationId = tmpInjuryLocation;
        if (tmpInjuryType)
          injuryData[selectedConsumerId][selectedInjuryId].injuryTypeId = tmpInjuryType;
        if (tmpCheckedBy)
          injuryData[selectedConsumerId][selectedInjuryId].checkedByNurse = tmpCheckedBy;
        if (tmpDetails) injuryData[selectedConsumerId][selectedInjuryId].injuryDetails = tmpDetails;
        if (tmpTreatment)
          injuryData[selectedConsumerId][selectedInjuryId].injuryTreatment = tmpTreatment;
        if (tmpDateChecked)
          injuryData[selectedConsumerId][selectedInjuryId].checkedDate = tmpDateChecked;

        selectedInjuryId = undefined;

        var form = section.querySelector('.injuryForm');
        section.removeChild(form);
        injuriesHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        return;
      }

      if (e.target === cancelBtn) {
        selectedInjuryId = undefined;
        var form = section.querySelector('.injuryForm');
        section.removeChild(form);
        injuriesHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildInjuryLocationDropdown() {
    var opts = {
      label: 'Injury Location',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iLocDrop = dropdown.build(opts);

    var data = injuryLocations.map(loc => {
      return {
        value: loc.injuryLocationId,
        text: loc.injuryLocation,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(iLocDrop, data, injuryLocationId);

    return iLocDrop;
  }
  function buildInjuryTypeDropdown() {
    var opts = {
      label: 'Injury Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iTypeDrop = dropdown.build(opts);

    var data = injuryTypes.map(type => {
      return {
        value: type.injuryTypeId,
        text: type.injuryType,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(iTypeDrop, data, injuryTypeId);

    return iTypeDrop;
  }
  function buildCheckedByCheckbox() {
    var opts = {
      text: 'Checked By Nurse',
      isChecked: checkedByNurse === 'Y' ? true : false,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var checkbox = input.buildCheckbox(opts);

    return checkbox;
  }
  function buildDetailsInput() {
    var opts = {
      label: 'Details',
      type: 'textarea',
      style: 'secondary',
      value: details,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var dInput = input.build(opts);

    return dInput;
  }
  function buildTreatmentInput() {
    var opts = {
      label: 'Treatment',
      type: 'textarea',
      style: 'secondary',
      value: treatment,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var tInput = input.build(opts);

    return tInput;
  }
  function buildDateCheckedInput() {
    var opts = {
      label: 'Date Checked',
      type: 'date',
      style: 'secondary',
      value: dateChecked,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var dcInput = input.build(opts);

    return dcInput;
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
  function buildNewInjuryForm() {
    var form = document.createElement('div');
    form.classList.add('injuryForm');

    injuryLocationDropdown = buildInjuryLocationDropdown();
    injuryTypeDropdown = buildInjuryTypeDropdown();
    checkedByNurseCheckbox = buildCheckedByCheckbox();
    detailsInput = buildDetailsInput();
    treatmentInput = buildTreatmentInput();
    dateCheckedInput = buildDateCheckedInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(injuryLocationDropdown);
    form.appendChild(injuryTypeDropdown);
    form.appendChild(checkedByNurseCheckbox);
    form.appendChild(detailsInput);
    form.appendChild(treatmentInput);
    form.appendChild(dateCheckedInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    injuriesHome.classList.add('hidden');

    var injuryForm = buildNewInjuryForm();
    section.appendChild(injuryForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = injuriesReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!injuryData) return;
    if (!injuryData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(injuryData[selectedConsumerId]);
    keys.forEach(key => {
      var data = injuryData[selectedConsumerId][key];
      var filteredLocations = injuryLocations.filter(
        iLoc => iLoc.injuryLocationId === data.injuryLocationId,
      );
      var filteredTypes = injuryTypes.filter(iType => iType.injuryTypeId === data.injuryTypeId);
      var injuryLocation = filteredLocations[0].injuryLocation;
      var injuryType = filteredTypes[0].injuryType;
      var nurseChecked = data.checkedByNurse === 'Y' ? 'Yes' : 'No';

      tableData.push({
        id: key,
        values: [injuryLocation, injuryType, nurseChecked],
      });
    });

    table.populate(injuriesReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerInjuriesTable',
      columnHeadings: ['Injury Location', 'Injury Type', 'Checked By Nurse'],
    });

    reviewTable.addEventListener('click', event => {
      if (
        event.target.classList.contains('table__row') &&
        !event.target.classList.contains('header')
      ) {
        selectedInjuryId = event.target.id;
        setFormDataDefaults(injuryData[selectedConsumerId][selectedInjuryId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    injuryData = {};
    injuryDeleteData = {};
    getDropdownData();
  }
  function buildAddNewInjuryBtn() {
    var btn = button.build({
      text: 'Add New Injury',
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
    section.classList.add('consumerSections__section', 'injuriesSection');

    injuriesHome = document.createElement('div');
    injuriesHome.classList.add('consumerSections__section__home');

    newInjuryBtn = buildAddNewInjuryBtn();
    injuriesReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) injuriesHome.appendChild(newInjuryBtn);
    injuriesHome.appendChild(injuriesReviewTable);

    section.appendChild(injuriesHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!injuryData[selectedConsumerId]) {
          injuryData[selectedConsumerId] = {};
        }

        if (!injuryData[selectedConsumerId][d.itConsumerInjuryId]) {
          injuryData[selectedConsumerId][d.itConsumerInjuryId] = d;
          injuryData[selectedConsumerId][d.itConsumerInjuryId].updated = false;

          // format dates
          var dateChecked = injuryData[selectedConsumerId][d.itConsumerInjuryId].checkedDate;
          dateChecked = dateChecked ? dateChecked.split(' ')[0] : null;

          if (dateChecked) {
            injuryData[selectedConsumerId][d.itConsumerInjuryId].checkedDate =
              UTIL.formatDateToIso(dateChecked);
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
