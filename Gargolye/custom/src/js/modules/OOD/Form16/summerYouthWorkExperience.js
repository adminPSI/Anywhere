const summerYouthWorkExperienceForm = (() => {
  //Inputs
  let serviceDateInput;  // case_notes.service_date : Default Service Date to the date that is selected when the user clicks New Entry in the previous page.  Make this non-editable.      
  let startTimeInput; // case_notes.start_time : Default "Start Time", "End Time", and "Individual Experiences, Performance, & Interventions"  to null.
  let endTimeInput; //  case_notes.end_time
  let positionDropdown;  //  emp_ood.position_id : Default Position to null (with SELECT selected on).  Dropdown values should be same as current Position list on Form 8 New Entry page.
  let interventionsInput; // rename -- case_notes.notes : Individual Experiences, Performance, & Interventions = case_notes.notes
  let groupSizeInput; // add --  case_notes.ratio_consumers : Group Size should be disabled until the user selects a Position on the same page.  
  // Once a position is selected, set the value in Group Size to be em_employee_position.default_group_size 
  // (new column being added via Task on this ticket) for the selected position. 
  // The user should be able to change the default value here to any positive whole number.  This field is required.


  // buttons
  let saveNoteBtn;
  let saveAndNewNoteBtn;
  let cancelNoteBtn;
  let updateNoteBtn;
  let deleteNoteBtn;
  // When the user saves, there will be one record saved into the case_notes table and one record saved to the emp_ood table.  
  // We are doing the same thing when saving a record from the New Entry screen for OOD Form 8.  Let analyst know if you need 
  // help with data being saved to these tables.


  // Case Note Edit Data
  let consumerId;
  let caseNoteId;
  let serviceDate;
  let startTime;
  let endTime;
  let position;  
  let interventions; // rename -- DATA -- Individual Experiences, Performance, & Interventions = case_notes.notes
  let groupSize; // add 

  //Case Note Data
  let caseManagerId;
  let userId;
  let serviceId;
  let referenceNumber;

  let formReadOnly = false;

  let currentEntryUserId;

  async function init(
    caseNoteData,
    currentConsumer,
    selectedConsumerServiceId,
    selectedConsumerServiceName,
    selectedConsumerReferenceNumber,
    currentRecordUserId,
    selectedServiceDate,
    clickSource = 'OODGrid',
  ) {
    DOM.clearActionCenter();
    document.querySelectorAll('.consumerListBtn').forEach(e => e.remove());

    consumerId = currentConsumer.id;
    currentEntryUserId = currentRecordUserId;

    if (caseNoteData && Object.keys(caseNoteData).length !== 0) {
      userId = $.session.UserId;
      caseNoteId = caseNoteData[0].caseNoteId;
      serviceDate = caseNoteData[0].serviceDate; //TODO JOE: Case_Notes.Service_Date
      startTime = caseNoteData[0].startTime; //TODO JOE: Case_Notes.Start_Time
      endTime = caseNoteData[0].endTime; //TODO JOE: Case_Notes.End_Time
      position = caseNoteData[0].position;
      groupSize = caseNoteData[0].groupSize;
      interventions = caseNoteData[0].interventions; //TODO JOE: emp_ood.interventions
      
    } else {
      caseManagerId = $.session.PeopleId;
      userId = $.session.UserId;
      serviceId = selectedConsumerServiceId;
      caseNoteId = '0';
      serviceDate = selectedServiceDate;
      //serviceDate = UTIL.getTodaysDate();
      referenceNumber = selectedConsumerReferenceNumber;
      startTime = '';
      endTime = '';
      position = '';
      groupSize = '';
      interventions = '';
    }

    if (clickSource === 'OODGrid' && !$.session.OODUpdate) {
      formReadOnly = true;
    }

    if (clickSource === 'newEntry' && !$.session.OODInsert) {
      formReadOnly = true;
    }

    if (userId !== currentRecordUserId) {
      formReadOnly = true;
    }

    serviceDateInput = input.build({
      type: 'date',
      label: 'Service Date',
      style: 'secondary',
      value: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
      //readonly: ((userId !== currentRecordUserId) || (!$.session.OODUpdate && !$.session.OODInsert)) ? true : false,
      readonly: true,
      //value: filterValues.serviceDateStart
    });

    startTimeInput = input.build({
      label: 'Start Time',
      type: 'time',
      value: startTime,
      readonly: formReadOnly,
      // style,
      // value: startTime,
    });

    endTimeInput = input.build({
      label: 'End Time',
      type: 'time',
      value: endTime,
      readonly: formReadOnly,
      // style,
      // value: endTime,
    });

    positionDropdown = dropdown.build({
      label: 'Position',
      dropdownId: 'positionDropdown',
      value: position,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    groupSizeInput = input.build({
      label: 'Group Size',
      type: 'number',
      style: 'secondary',
      value: groupSize === '0' || groupSize === '0.00' ? '' : groupSize,
      readonly: formReadOnly,
      attributes: [{ key: 'min', value: '0' }],
    });
  

    interventionsInput = input.build({
      label: 'Individual Experiences, Performance, & Interventions',
      value: interventions,
      type: 'textarea',
      classNames: 'autosize',
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    saveNoteBtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      icon: 'save',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => {
        insertFormData('save');
      },
    });
    saveAndNewNoteBtn = button.build({
      text: 'Save & New',
      style: 'secondary',
      type: 'contained',
      icon: 'add',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => {
        insertFormData('saveandNew');
      },
    });
    updateNoteBtn = button.build({
      text: 'update',
      style: 'secondary',
      type: 'contained',
      icon: 'add',
      //  classNames: 'disabled',
      callback: async () => {
        updateFormData();
      },
    });
    deleteNoteBtn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'contained',
      icon: 'delete',
      // classNames: 'disabled',
      callback: async () => {
        deleteConfirmation(caseNoteId);
      },
    });
    cancelNoteBtn = button.build({
      text: 'cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      classNames: ['caseNoteCancel'],
      callback: async () => {
        OOD.loadOODLanding();
      },
    });

    setupEvents();

    let myconsumer = buildConsumerCard(currentConsumer);

    let container = document.createElement('div');
    container.classList.add('monthlyForm');
    var LineBr = document.createElement('br');

    const heading = document.createElement('h2');
    // heading.innerHTML = `${selectedConsumerServiceName} - OOD Form 16`;
    heading.innerHTML = `Summer Youth Work Experience - OOD Form 16`;
    heading.classList.add('OODsectionHeading');

    container.appendChild(myconsumer);
    // container.appendChild(LineBr);
    container.appendChild(LineBr);
    container.appendChild(heading);
    container.appendChild(LineBr);

    const inputContainer0 = document.createElement('div');
    inputContainer0.classList.add('ood_form4monthlyplacement_inputContainer1');
    inputContainer0.appendChild(serviceDateInput);
    inputContainer0.appendChild(startTimeInput);
    inputContainer0.appendChild(endTimeInput);

    const inputContainer1 = document.createElement('div');
    inputContainer1.classList.add('ood_form4monthlyplacement_inputContainer1'); // new _OOD.scss setting  -- ood_form8monthlyplacement_inputContainer1
    inputContainer1.appendChild(positionDropdown);
    inputContainer1.appendChild(groupSizeInput);

    const inputContainer2 = document.createElement('div');
    inputContainer2.classList.add('ood_form4monthlyplacement_inputContainer2');

    container.appendChild(inputContainer0);
    container.appendChild(inputContainer1);
    container.appendChild(inputContainer2);

    container.appendChild(interventionsInput);

    let updatecontainer = document.createElement('div');
    updatecontainer.classList.add('updatecontainer');

    let updatemessage = document.createElement('div');
    updatemessage.classList.add('updatemessage');

    updatemessage.innerHTML = `<span style="color: red">This record was created by another user therefore no edits can be made.</span>`;
    updatecontainer.appendChild(updatemessage);

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    caseNoteId == '0' ? btnWrap.appendChild(saveNoteBtn) : btnWrap.appendChild(updateNoteBtn);
    caseNoteId == '0' ? btnWrap.appendChild(saveAndNewNoteBtn) : btnWrap.appendChild(deleteNoteBtn);

    let btnWrap2 = document.createElement('div');
    btnWrap2.classList.add('btnWrap');
    btnWrap2.appendChild(cancelNoteBtn);

    let btnRow = document.createElement('div');
    btnRow.classList.add('btnRow');
    btnRow.appendChild(btnWrap);
    btnRow.appendChild(btnWrap2);

    if (userId !== currentEntryUserId) btnRow.appendChild(updatecontainer);

    container.appendChild(btnRow);

    populateStaticDropDowns();
    populatePositionDropdown();
    populateIndicatorsDropdown();
    // populateOutcomeDropdown();

    DOM.ACTIONCENTER.appendChild(container);

    DOM.autosizeTextarea();

    // call Required Fields
    checkRequiredFields();
  }

  async function populatePositionDropdown() {
    const { getOODPositionsResult: positions } = await OODAjax.getPositionsAsync(consumerId);
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = positions.map(position => ({
      id: (position.defaultGroupSize && position.defaultGroupSize > 0) ? position.defaultGroupSize : '0',
      value: position.code,
      text: position.caption,
    }));

    const index = data.findIndex(x => x.id == position);
    if (index === -1) {
      // case note contactType not in the contactTypes DDL
    }

    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('positionDropdown', data, position);
  }

  async function populateIndicatorsDropdown() {
    const { getIndicatorsResult: indicators } = await OODAjax.getIndicatorsAsync();
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = indicators.map(indicator => ({
      id: indicator.code,
      value: indicator.code,
      text: indicator.caption,
    }));

    const index = data.findIndex(x => x.id == position);
    if (index === -1) {
      // case note contactType not in the contactTypes DDL
    }

    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    
  }

  // TODO JOE: Look into whether this AJAX needs to change or not
  // THis DDL may not be needed?
  // async function populateOutcomeDropdown() {

  //   const {
  //     getOutcomesResult: outcomes,
  //   } = await OODAjax.getOutcomesAsync();
  //   // const templates = WorkflowViewerComponent.getTemplates();
  //   let data = outcomes.map((outcome) => ({
  //     id: outcome.outcomeCode,
  //     value: outcome.outcomeCode,
  //     text: outcome.outcomeCaption,
  //   }));

  //   const index = data.findIndex((x) => x.id == outcome);
  // 				if (index === -1) {
  // 					// case note outcome not in the outcomes DDL
  // 				}

  //   data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
  //   dropdown.populate("outcomeDropdown", data, outcome);
  // }

  function populateStaticDropDowns() {
    const yesNoDropdownData = [
      { text: 'SELECT', value: 'SELECT' },
      { text: 'Yes', value: 'Y' },
      { text: 'No', value: 'N' },
    ];

  }

  function checkRequiredFields() {
    
    

    if (!position || position === '') {
      positionDropdown.classList.add('error');
      groupSizeInput.classList.add('disabled');
    } else {
      positionDropdown.classList.remove('error');
      groupSizeInput.classList.remove('disabled');
      groupSizeInput.classList.remove('error');
      // return 'success';
    }

    var numgroupSizeInput = groupSizeInput.querySelector('input');
    if (numgroupSizeInput.value === '' || numgroupSizeInput.value === 0 || numgroupSizeInput.value <= 0) {
      groupSizeInput.classList.add('error');
    } else {
      groupSizeInput.classList.remove('error');
    }


    var interventionInpt = interventionsInput.querySelector('textarea');

    if (interventionInpt.value === '') {
      interventionsInput.classList.add('error');
    } else {
      interventionsInput.classList.remove('error');
    }

    checkServiceDateInput();
    checkStartInputTime();
    checkEndInputTime();
    setBtnStatus();
  }

  function checkServiceDateInput() {
    let todaydate = new Date();
    let myservicedate = new Date(serviceDate);

    var isDateBefore = dates.isBefore(myservicedate, todaydate);

    if (!isDateBefore) {
      serviceDateInput.classList.add('error');
    } else {
      serviceDateInput.classList.remove('error');
    }
  }

  function setBtnStatus() {
    var hasErrors = [].slice.call(document.querySelectorAll('.error'));
    if (hasErrors.length !== 0 || formReadOnly) {
      saveNoteBtn.classList.add('disabled');
      saveAndNewNoteBtn.classList.add('disabled');
      updateNoteBtn.classList.add('disabled');
    } else {
      saveNoteBtn.classList.remove('disabled');
      saveAndNewNoteBtn.classList.remove('disabled');
      updateNoteBtn.classList.remove('disabled');
    }

    if (userId !== currentEntryUserId || !$.session.OODDelete) {
      deleteNoteBtn.classList.add('disabled');
    } else {
      deleteNoteBtn.classList.remove('disabled');
    }
  }

  function checkEndInputTime() {
    var endInput = endTimeInput.querySelector('input');
    var todaysDate = UTIL.getTodaysDate();
    currentserviceDate = UTIL.formatDateToIso(serviceDate.split(' ')[0]);

    if (currentserviceDate === todaysDate && checkTimeForAfterNow(endInput.value)) {
      endTimeInput.classList.add('error');
      return;
    } else {
      endTimeInput.classList.remove('error');
    }

    var isEndAfterStartTime = validateStartEndTimes('endCheck');

    if (isEndAfterStartTime) {
      endTimeInput.classList.remove('error');
    } else {
      endTimeInput.classList.add('error');
      return;
    }

    var isEndTimeValid = UTIL.validateTime(endInput.value);

    if (isEndTimeValid) {
      endTimeInput.classList.remove('error');
    } else {
      endTimeInput.classList.add('error');
      return;
    }
  }

  function checkStartInputTime() {
    var startInput = startTimeInput.querySelector('input');
    var todaysDate = UTIL.getTodaysDate();
    currentserviceDate = UTIL.formatDateToIso(serviceDate.split(' ')[0]);

    if (currentserviceDate === todaysDate && checkTimeForAfterNow(startInput.value)) {
      startTimeInput.classList.add('error');
      return;
    } else {
      startTimeInput.classList.remove('error');
    }

    var isStartTimeValid = UTIL.validateTime(startInput.value);
    if (isStartTimeValid) {
      startTimeInput.classList.remove('error');
    } else {
      startTimeInput.classList.add('error');
      return;
    }
  }

  function checkTimeForAfterNow(enteredTime) {
    let tempNow = new Date();
    let nowHour = tempNow.getHours() < '10' ? `0${tempNow.getHours()}` : tempNow.getHours();
    let nowMinuet = tempNow.getMinutes() < '10' ? `0${tempNow.getMinutes()}` : tempNow.getMinutes();
    return (
      Date.parse(`01/01/2020 ${enteredTime}`) > Date.parse(`01/01/2020 ${nowHour}:${nowMinuet}`)
    );
  }

  function validateStartEndTimes(validateTime) {
    var startInput = startTimeInput.querySelector('input');
    var endInput = endTimeInput.querySelector('input');
    var dateInput = serviceDateInput.querySelector('input');
    var startTime = startInput.value;
    var endTime = endInput.value;
    var currentDate = UTIL.getTodaysDate();
    var currentTime = UTIL.getCurrentTime();

    if (validateTime === 'startCheck') {
      if (dateInput.value === currentDate) {
        if (startTime > currentTime) return false; // current date can't have startTime be future time
      }

      if (startTime === '') return false; //error on no time,
      if (startTime !== '' && endTime === '') return true; // initial condition, startTime entered, but not endTime
    } else {
      // endCheck
      if (dateInput.value === currentDate) {
        if (endTime > currentTime) return false; // current date can't have endTime be future time
      }

      if (endTime === '' || endTime === '00:00') return false; //error on no time, or a 12am end time
    }

    return startTime >= endTime ? false : true; // startTime can't be after EndTime
  }

  function setupEvents() {

    positionDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        position = '';
        groupSize = '';
        var numgroupSizeInput = groupSizeInput.querySelector('input');
        numgroupSizeInput.value = '';

      } else {
        position = selectedOption.value;
        groupSize = selectedOption.id;
        var numgroupSizeInput = groupSizeInput.querySelector('input');
        numgroupSizeInput.value = (selectedOption.id && selectedOption.id > 0) ? selectedOption.id : '';
      }
      checkRequiredFields();
    });


    groupSizeInput.addEventListener('input', event => {
      groupSize = event.target.value;
      checkRequiredFields();
    });
	
	
    groupSizeInput.addEventListener('keypress', event => {
      groupSize = event.target.value;
      if (event.key === '.' && event.target.value.indexOf('.') !== -1) {
        // event.target.value = event.target.value.substr(0, (event.target.value.length - 1))
        event.preventDefault();
        return;
      }
        if (event.keyCode < 48 || event.keyCode > 57) {
          event.preventDefault();
          return;
      }
    });

    startTimeInput.addEventListener('focusout', event => {
      startTime = event.target.value;
      checkStartInputTime();
      checkEndInputTime();
      setBtnStatus();
    });

    endTimeInput.addEventListener('change', event => {
      endTime = event.target.value;
      checkStartInputTime();
      checkEndInputTime();
      setBtnStatus();
    });

    serviceDateInput.addEventListener('change', event => {
      serviceDate = event.target.value;
      checkServiceDateInput();
      checkStartInputTime();
      checkEndInputTime();
      setBtnStatus();
    });
    serviceDateInput.addEventListener('keydown', event => {
      event.preventDefault();
      event.stopPropagation();
    });

    interventionsInput.addEventListener('input', event => {
      interventions = event.target.value;
      checkRequiredFields();
    });

    saveAndNewNoteBtn.addEventListener('click', event => {
      // event.target.classList.add('disabled');
      saveAndNewNoteBtn.classList.add('disabled');
      saveNoteBtn.classList.add('disabled');
    });

    saveNoteBtn.addEventListener('click', event => {
      // event.target.classList.add('disabled');
      saveAndNewNoteBtn.classList.add('disabled');
      saveNoteBtn.classList.add('disabled');
    });
  }

  // build display of selected consumers with their associated "Entry" buttons
  function buildConsumerCard(consumer) {
    const consumerRow = document.createElement('div');
    var LineBr = document.createElement('br');

    consumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(consumer.card);

    consumerRow.appendChild(wrap);
    consumerRow.appendChild(LineBr);
    //  wrap.appendChild(LineBr);

    return consumerRow;
  }

  function updateFormData() {
    var data = {
      consumerId,
      caseNoteId,
      serviceDate: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
      startTime,
      endTime,
      position,
      groupSize,
      interventions,
      userId,
    };
    // TODO JOE: This AJAX needs to change
    OODAjax.updateForm16SummerYouthWorkExperience(data, function (results) {
      successfulSave.show();
      setTimeout(function () {
        successfulSave.hide();
        OOD.loadOODLanding();
      }, 2000);
    });
  }

  function insertFormData(saveType) {
    var data = {
      consumerId,
      caseNoteId,
      serviceDate: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
      startTime,
      endTime,
      position,
      groupSize,
      interventions,
      userId,
      serviceId,
      referenceNumber,
      caseManagerId,
    };
    // TODO JOE: This AJAX needs to change
    OODAjax.insertForm16SummerYouthWorkExperience(data, function (results) {
      successfulSave.show();
      if (saveType == 'saveandNew') {
        setTimeout(function () {
          successfulSave.hide();
          overlay.show();
          OOD.buildEntryServicePopUp(consumerId, 'newEntry');
        }, 2000);
      } else {
        //save
        setTimeout(function () {
          successfulSave.hide();
          OOD.loadOODLanding();
        }, 2000);
      }
    });
  }

  // TODO JOE: Look into whether this AJAX needs to change or not
  function deleteConfirmation(caseNoteId) {
    var deletepopup = POPUP.build({
      id: 'deleteWarningPopup',
      classNames: 'warning',
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: async function () {
        POPUP.hide(deletepopup);
        let result = await OODAjax.deleteOODFormEntryAsync(caseNoteId);
        if (result.deleteOODFormEntryResult === '1') {
          OOD.loadOODLanding();
        }
      },
    });
    var noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      icon: 'close',
      callback: function () {
        POPUP.hide(deletepopup);
      },
    });
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = 'Are you sure you want to delete this record?';
    deletepopup.appendChild(warningMessage);
    deletepopup.appendChild(btnWrap);
    POPUP.show(deletepopup);
  }

  return {
    init,
  };
})();
