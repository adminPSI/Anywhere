const communityBasedAssessmentForm = (() => {
  //Inputs
  let serviceDateInput;
  let startTimeInput;
  let endTimeInput;
  let SAMLevelDropdown;
  let positionDropdown;
  let otherEmployerDropdown;
  let contactMethodDropdown;
  let behavioralIndicatorsDropdown;
  let jobTaskQualityIndicatorsDropdown;
  let jobTaskQuantityIndicatorsDropdown;
  let narrativeInput;
  let interventionsInput;

  // buttons
  let addEmployersBtn;
  let saveNoteBtn;
  let saveAndNewNoteBtn;
  let cancelNoteBtn;
  let updateNoteBtn;
  let deleteNoteBtn;

  // Case Note Edit Data
  let consumerId;
  let caseNoteId;
  let serviceDate;
  let startTime;
  let endTime;
  let SAMLevel;
  let position;
  let employer;
  let contactMethod;
  let behavioralIndicators;
  let jobTaskQualityIndicators;
  let jobTaskQuantityIndicators;
  let narrative;
  let interventions;
  let positionDropDownData;

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
      SAMLevel = caseNoteData[0].SAMLevel; //TODO JOE: Case_Notes.Service_Area_Modifier (populates with N/A, 1, 2, or 3)
      position = caseNoteData[0].position;
      employer = caseNoteData[0].employerId;
      contactMethod = caseNoteData[0].contactMethod; //TODO JOE: Corresponding Code_Table.Code will save to emp_ood.contact_method
      jobTaskQuantityIndicators = caseNoteData[0].jobTaskQuantityIndicators; //TODO JOE: Corresponding Code_Table.Code will save to emp_ood.quantity_indicators
      narrative = caseNoteData[0].narrative; //TODO JOE: emp_ood.narrative
      interventions = caseNoteData[0].interventions; //TODO JOE: emp_ood.interventions
      behavioralIndicators = caseNoteData[0].behavioralIndicators; //TODO JOE: Corresponding Code_Table.Code will save to emp_ood.behavioral_indicators
      jobTaskQualityIndicators = caseNoteData[0].jobTaskQualityIndicators; //TODO JOE: Corresponding Code_Table.Code will save to emp_ood.quality_indicators
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
      SAMLevel = '';
      position = '';
      employer = '';
      contactMethod = '';
      jobTaskQuantityIndicators = '';
      narrative = '';
      interventions = '';
      behavioralIndicators = '';
      jobTaskQualityIndicators = '';
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

    SAMLevelDropdown = dropdown.build({
      label: 'SAM Level',
      dropdownId: 'SAMLevelDropdown',
      value: SAMLevel,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    positionDropdown = dropdown.build({
      id: 'positionDropdown',
      label: 'Position',
      dropdownId: 'positionDropdown',
      value: position,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    otherEmployerDropdown = dropdown.build({
      id: "otherEmployerDropdown",
      label: "Other Employer",
      dropdownId: "otherEmployerDropdown",
      value: employer,
      readonly: formReadOnly,
  }); 

    contactMethodDropdown = dropdown.build({
      label: 'Contact Method',
      dropdownId: 'contactMethodDropdown',
      value: contactMethod,
      readonly: formReadOnly,
    });

    behavioralIndicatorsDropdown = dropdown.build({
      label: 'Behavioral Indicators (Work Days)',
      dropdownId: 'behavioralIndicatorsDropdown',
      value: behavioralIndicators,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    jobTaskQualityIndicatorsDropdown = dropdown.build({
      label: 'Job Task Quality Indicators (Work Days)',
      dropdownId: 'jobTaskQualityIndicatorsDropdown',
      value: jobTaskQualityIndicators,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    jobTaskQuantityIndicatorsDropdown = dropdown.build({
      label: 'Job Task Quantity Indicators (Work Days)',
      dropdownId: 'jobTaskQuantityIndicatorsDropdown',
      value: jobTaskQuantityIndicators,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    narrativeInput = input.build({
      label: 'Narrative',
      value: narrative,
      type: 'textarea',
      classNames: 'autosize',
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    interventionsInput = input.build({
      label: 'Interventions',
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

    addEmployersBtn = button.build({
      id: 'addEmployersBtn',
      text: 'Add Employers',
      style : 'secondary',
      type: 'contained',
      icon: 'add',
      classNames: ['caseNoteSave'],
      callback: async () => { 
        //if (!addNewEmployerBtn.classList.contains('disabled')) {
          buildEmployerPopUp({}, 'insert', 'employer', null)
     // }
      },
    });


    setupEvents();

    let myconsumer = buildConsumerCard(currentConsumer);

    let container = document.createElement('div');
    container.classList.add('monthlyForm');
    var LineBr = document.createElement('br');

    const heading = document.createElement('h2');
    heading.innerHTML = `${selectedConsumerServiceName} - OOD Form 8`;
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
    inputContainer1.classList.add('ood_form8monthlyplacement_inputContainer1'); // new _OOD.scss setting  -- ood_form8monthlyplacement_inputContainer1
   
     const wrapHeading = document.createElement('div');
     wrapHeading.classList.add('ChoosePositionEmployer')
     wrapHeading.innerHTML = '<p>Choose either a Position or Employer.</p>';

    inputContainer1.appendChild(wrapHeading);
    inputContainer1.appendChild(positionDropdown);
    inputContainer1.appendChild(otherEmployerDropdown);
    if ($.session.OODInsertEmployers) inputContainer1.appendChild(addEmployersBtn);

    const inputContainer2 = document.createElement('div');
    inputContainer2.classList.add('ood_form4monthlyplacement_inputContainer2');

    inputContainer2.appendChild(SAMLevelDropdown);
    inputContainer2.appendChild(contactMethodDropdown);
    inputContainer2.appendChild(behavioralIndicatorsDropdown);

    const inputContainer3 = document.createElement('div');
    inputContainer3.classList.add('ood_form4monthlyplacement_inputContainer2');

    inputContainer3.appendChild(jobTaskQualityIndicatorsDropdown);
    inputContainer3.appendChild(jobTaskQuantityIndicatorsDropdown);

    container.appendChild(inputContainer0);
    container.appendChild(inputContainer1);
    container.appendChild(inputContainer2);
    container.appendChild(inputContainer3);

    container.appendChild(narrativeInput);
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
    populateContactMethodDropdown();
    populatePositionDropdown();
    populateIndicatorsDropdown();
    populateOtherEmployerDropdown(consumerId);

    DOM.ACTIONCENTER.appendChild(container);

    DOM.autosizeTextarea();

    // call Required Fields
    checkRequiredFields();
  }
  // TODO JOE: Double check that AJAX pulls correct data
  // Contact Method -  Contact Method dropdown should be a list of values (code_table.caption)
  // where code_table.table_id = employment_code and code_table.field_id = contactmethod
  async function populateContactMethodDropdown() {
    const { getContactMethodsResult: contactMethods } = await OODAjax.getContactMethodsAsync('Form8');
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = contactMethods.map(contactMethod => ({
      id: contactMethod.code,
      value: contactMethod.code,
      text: contactMethod.caption,
    }));

    const index = data.findIndex(x => x.id == contactMethod);
    if (index === -1) {
      // case note contactType not in the contactTypes DDL
    }

    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('contactMethodDropdown', data, contactMethod);
  }

  async function populatePositionDropdown() {
    const { getOODPositionsResult: positions } = await OODAjax.getPositionsAsync(consumerId);
    // const templates = WorkflowViewerComponent.getTemplates();
    
    positionDropDownData = positions;

    let data = positions.map(position => ({
      id: position.employerId,
      value: position.code,
      text: position.caption,
    }));

    const index = data.findIndex(x => x.id == position);
    if (index === -1) {
      // case note contactType not in the contactTypes DDL
      // employer = ''; 
    } else {
     // employer = '0' // 'SEE POSITION DROPDOWN';
    }

    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('positionDropdown', data, position);
  }


  async function populateOtherEmployerDropdown(currentConsumerId) { 
		
		const {
			getActiveEmployersResult: employers,
		} = await OODAjax.getActiveEmployersAsync();
	  // const templates = WorkflowViewerComponent.getTemplates();

    var filteredemployers = employers.filter(item => !positionDropDownData.some(otherItem => otherItem.employerId === item.employerId));

	  let data = filteredemployers.map((employr) => ({
		  id: employr.employerId, 
		  value: employr.employerId, 
		  text: (employr.address1 == '') ? employr.employerName : employr.employerName + ' -- ' + employr.address1,
	  }));   

        var positiondropdown = document.getElementById("positionDropdown");
    		const index = data.findIndex((x) => x.id == employer);
						if (index === -1) {
							// case note employer not in the employers DDL
              employer = '';
             // positiondropdown.disabled = false;
             // position = '';
						} else {
              
             // positiondropdown.disabled = true;
              // position = '0' // 'SEE OTHER EMPLOYER DROPDOWN';
            }

            checkRequiredFields();

   var filtereddata = data.filter((x) => x.id != 0);

	  filtereddata.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
	  dropdown.populate("otherEmployerDropdown", filtereddata, employer);        
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
    dropdown.populate('behavioralIndicatorsDropdown', data, behavioralIndicators);
    dropdown.populate('jobTaskQualityIndicatorsDropdown', data, jobTaskQualityIndicators);
    dropdown.populate('jobTaskQuantityIndicatorsDropdown', data, jobTaskQuantityIndicators);
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
    const SAMLevelDropdownData = [
      { text: 'SELECT', value: 'SELECT' },
      { text: 'N/A', value: '0' },
      { text: '1', value: '1' },
      { text: '2', value: '2' },
      { text: '3', value: '3' },
    ];
    const yesNoDropdownData = [
      { text: 'SELECT', value: 'SELECT' },
      { text: 'Yes', value: 'Y' },
      { text: 'No', value: 'N' },
    ];

    dropdown.populate(SAMLevelDropdown, SAMLevelDropdownData, SAMLevel);
    // TODO JOE: Double check that DDL is properly populated -- not yes/no for Form 8
    // Behavioral Indicators (Work Days) dropdown should be a list of
    // values (code_table.caption) where code_table.table_id = employment_code and code_table.field_id = Lichert Scale 2
    // dropdown.populate(behavioralIndicatorsDropdown, yesNoDropdownData, behavioralIndicators);
    // TODO JOE: Double check that DDL is properly populated -- not yes/no for Form 8
    // Job Task Quality Indicators -Job Task Quality Indicators (Work Days) dropdown should
    // be a list of values (code_table.caption) where code_table.table_id = employment_code and code_table.field_id = Lichert Scale 2
    // dropdown.populate(jobTaskQualityIndicatorsDropdown, yesNoDropdownData, jobTaskQualityIndicators);
    // TODO JOE: Double check that DDL is properly populated -- not yes/no for Form 8
    // Job Task Quantity Indicators -Job Task Quantity Indicators (Work Days) dropdown
    // should be a list of values (code_table.caption) where code_table.table_id = employment_code and code_table.field_id = Lichert Scale 2
    // dropdown.populate(jobTaskQuantityIndicatorsDropdown, yesNoDropdownData, jobTaskQuantityIndicators);
  }

  function checkRequiredFields() {
    if (!SAMLevel || SAMLevel === '') {
      SAMLevelDropdown.classList.add('error');
      //return 'error';
    } else {
      SAMLevelDropdown.classList.remove('error');
      // return 'success';
    }

    const employerWrap = document.getElementsByClassName("ood_form8monthlyplacement_inputContainer1");

    if (!position || position === '' || position === '0') {
          if (!employer || employer === '') {
            positionDropdown.classList.add('error');
            otherEmployerDropdown.classList.add('error'); 
            
            employerWrap[0].classList.add('error');
            let otheremployerdropdown = document.getElementById("otherEmployerDropdown");
          //  otheremployerdropdown.disabled = false; 
            let positiondropdown = document.getElementById("positionDropdown");
          //  positiondropdown.disabled = false;
          } else {
            positionDropdown.classList.remove('error');
            otherEmployerDropdown.classList.remove('error'); 
            employerWrap[0].classList.remove('error');
            let otheremployerdropdown = document.getElementById("otherEmployerDropdown");
         //   otheremployerdropdown.disabled = false; 
            let positiondropdown = document.getElementById("positionDropdown");
          //  positiondropdown.disabled = true;
          }
      
    } else {
      positionDropdown.classList.remove('error');  
      otherEmployerDropdown.classList.remove('error');  
      employerWrap[0].classList.remove('error');
      let otheremployerdropdown = document.getElementById("otherEmployerDropdown");
    //  otheremployerdropdown.disabled = true;
      let positiondropdown = document.getElementById("positionDropdown");
     // positiondropdown.disabled = false; 
    }

   // if (!employer || employer === '') {
  //    otherEmployerDropdown.classList.add('error');
  //  } else {
  //    otherEmployerDropdown.classList.remove('error');
   // }

    if (!contactMethod || contactMethod === '') {
      contactMethodDropdown.classList.add('error');
    } else {
      contactMethodDropdown.classList.remove('error');
    }

    if (!behavioralIndicators || behavioralIndicators === '') {
      behavioralIndicatorsDropdown.classList.add('error');
    } else {
      behavioralIndicatorsDropdown.classList.remove('error');
    }

    if (!jobTaskQualityIndicators || jobTaskQualityIndicators === '') {
      jobTaskQualityIndicatorsDropdown.classList.add('error');
    } else {
      jobTaskQualityIndicatorsDropdown.classList.remove('error');
    }

    if (!jobTaskQuantityIndicators || jobTaskQuantityIndicators === '') {
      jobTaskQuantityIndicatorsDropdown.classList.add('error');
    } else {
      jobTaskQuantityIndicatorsDropdown.classList.remove('error');
    }

    var noteInput = narrativeInput.querySelector('textarea');

    if (noteInput.value === '') {
      narrativeInput.classList.add('error');
    } else {
      narrativeInput.classList.remove('error');
    }

    //var interventionInpt = interventionsInput.querySelector('textarea');

    //if (interventionInpt.value === '') {
    //  interventionsInput.classList.add('error');
   // } else {
  //    interventionsInput.classList.remove('error');
   // }

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
    SAMLevelDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        SAMLevel = '';
      } else {
        SAMLevel = selectedOption.value;
      }
      checkRequiredFields();
    });

    positionDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      var otherEmployerdropdown = document.getElementById("otherEmployerDropdown");

      if (selectedOption.value == 'SELECT') {
        position = '';
      //  otherEmployerdropdown.disabled = false; 
       // addEmployersBtn.disabled = false;
       // employer = '';
      } else {
        position = selectedOption.value;
      //  otherEmployerdropdown.disabled = true; 
       // addEmployersBtn.disabled = true;
        // employer = '0' // 'SEE POSITION DROPDOWN';
        employer = '';
        populateOtherEmployerDropdown();
      }
      checkRequiredFields();
    });

    otherEmployerDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      var positiondropdown = document.getElementById("positionDropdown");

      if (selectedOption.value == "SELECT") {
        employer = '';
       // positiondropdown.disabled = false; 
       // position = '';
      } else {
        employer = selectedOption.value;
      //  positiondropdown.disabled = true;
        // position = '0' //'SEE OTHER EMPLOYER DROPDOWN';
        position = ''; 
        populatePositionDropdown();
      }
      checkRequiredFields();
    });

    contactMethodDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        contactMethod = '';
      } else {
        contactMethod = selectedOption.value;
      }
      checkRequiredFields();
    });

    behavioralIndicatorsDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        behavioralIndicators = '';
      } else {
        behavioralIndicators = selectedOption.value;
      }
      checkRequiredFields();
    });

    jobTaskQualityIndicatorsDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        jobTaskQualityIndicators = '';
      } else {
        jobTaskQualityIndicators = selectedOption.value;
      }
      checkRequiredFields();
    });

    jobTaskQuantityIndicatorsDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        jobTaskQuantityIndicators = '';
      } else {
        jobTaskQuantityIndicators = selectedOption.value;
      }
      checkRequiredFields();
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

    narrativeInput.addEventListener('input', event => {
      narrative = event.target.value;
      checkRequiredFields();
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
      SAMLevel,
      position,
      employer,
      contactMethod,
      behavioralIndicators,
      jobTaskQualityIndicators,
      jobTaskQuantityIndicators,
      narrative,
      interventions,
      userId,
    };
    // TODO JOE: This AJAX needs to change
    OODAjax.updateForm8CommunityBasedAssessment(data, function (results) {
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
      SAMLevel,
      position,
      employer,
      contactMethod,
      behavioralIndicators,
      jobTaskQualityIndicators,
      jobTaskQuantityIndicators,
      narrative,
      interventions,
      userId,
      serviceId,
      referenceNumber,
      caseManagerId,
    };
    // TODO JOE: This AJAX needs to change
    OODAjax.insertForm8CommunityBasedAssessment(data, function (results) {
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

// build Employer pop-up used for adding/editing Employer information
async function buildEmployerPopUp(employerdata, postType, openpageName, redirectInfo) {
  if (openpageName == 'employmentInfo') {
      openedPage = 'employmentInfo';
      redirectInformation = redirectInfo
  }
  else
      openedPage = 'employer';

  var headingEmployer;
  if (employerdata && Object.keys(employerdata).length !== 0) {
      employerId = employerdata[0].employerId;
      employerName = employerdata[0].employerName;
      employeraddress1 = employerdata[0].address1;
      employeraddress2 = employerdata[0].address2;
      employercity = employerdata[0].city;
      employerstate = employerdata[0].state;
      employerzipcode = employerdata[0].zipcode;
      headingEmployer = 'Edit this Employer';
      BtnEventType = 'Update';
  } else {
      employerId = '';
      employerName = '';
      employeraddress1 = '';
      employeraddress2 = '';
      employercity = '';
      employerstate = '';
      employerzipcode = '';
      headingEmployer = 'Add Employer';
      BtnEventType = 'Add';
  }

  let editEmployerPopup = POPUP.build({
      header: headingEmployer,
      hideX: true,
      id: "editEmployerPopup"
  });

  employerInput = input.build({
      id: 'employerInput',
      label: 'Employer',
      value: (employerName) ? employerName : '',
  });

  address1Input = input.build({
      label: 'Address',
      value: (employeraddress1) ? employeraddress1 : '',
  });

  address2Input = input.build({
      label: 'Address 2',
      value: (employeraddress2) ? employeraddress2 : '',
  });

  cityInput = input.build({
      label: 'City',
      value: (employercity) ? employercity : '',
  });

  stateInput = input.build({
      label: 'State',
      value: (employerstate) ? employerstate : '',
  });

  zipcodeInput = input.build({
      label: 'Zip Code',
      value: (employerzipcode) ? employerzipcode : '',
  });

  popupSaveBtn = button.build({
      id: "addEmployerSaveBtn",
      text: "save",
      type: "contained",
      style: "secondary",
      classNames: 'disabled',
      callback: () => {
          if (!popupSaveBtn.classList.contains('disabled')) {
            editEmployerPopupDoneBtn(postType)
          }
      }
  });

  popupCancelBtn = button.build({
      id: "addEmployerCancelBtn",
      text: "cancel",
      type: "outlined",
      style: "secondary",
      callback: () => POPUP.hide(editEmployerPopup)
  });

  let btnWrap = document.createElement("div");
  btnWrap.classList.add("btnWrap");
  btnWrap.appendChild(popupSaveBtn);
  btnWrap.appendChild(popupCancelBtn);
  editEmployerPopup.appendChild(employerInput);
  editEmployerPopup.appendChild(address1Input);
  editEmployerPopup.appendChild(address2Input);
  editEmployerPopup.appendChild(cityInput);
  editEmployerPopup.appendChild(stateInput);
  editEmployerPopup.appendChild(zipcodeInput);
  editEmployerPopup.appendChild(btnWrap);

  popUpEventHandlers();
  POPUP.show(editEmployerPopup);
  checkPopupRequiredFields();
}

function popUpEventHandlers() {
employerInput.addEventListener('input', event => {
    employerName = event.target.value.trim();
    checkPopupRequiredFields();
});

address1Input.addEventListener('input', event => {
    employeraddress1 = event.target.value;
});

address2Input.addEventListener('input', event => {
    employeraddress2 = event.target.value;
});

cityInput.addEventListener('input', event => {
    employercity = event.target.value;
});

stateInput.addEventListener('input', event => {
    employerstate = event.target.value;
});

zipcodeInput.addEventListener('input', event => {
    employerzipcode = event.target.value;
});
}

function checkPopupRequiredFields() {
var employrInput = employerInput.querySelector('#employerInput');
if (employrInput.value.trim() === '') { 
    employerInput.classList.add('error');
    popupSaveBtn.classList.add('disabled'); 
    return;
} else {
    employerInput.classList.remove('error');
    popupSaveBtn.classList.remove('disabled');
}

// if (($.session.UpdateEmployers && BtnEventType == 'Update') || ($.session.InsertEmployers && BtnEventType == 'Add')) {
//     popupSaveBtn.classList.remove('disabled');
// } else {
//  popupSaveBtn.classList.add('disabled');
// }
}

// Event for Done BTN on the Edit Employer Popup Window
async function editEmployerPopupDoneBtn(postType) {

  if (postType == 'insert') {

      const result = await OODAjax.insertEmployerAsync(employerName, employeraddress1, employeraddress2, employercity, employerstate, employerzipcode);
      const { insertEmployerResult } = result;
      employer = insertEmployerResult.employerId;

      if (employer == '0') {
          warningPopup();
      } else {
          
        populateOtherEmployerDropdown(consumerId);
         // const dropdown = document.querySelector('#employerDropdown');
          //    const selectedValue = dropdown.value;
         //     var selectedOption = dropdown.options[dropdown.selectedIndex];

           //   if (selectedOption.value == "SELECT") {
          //      employer = '';
            //  } else {
            //    employer = selectedOption.value;
            //  }
          //    checkRequiredFields();

            position = ''; 
            populatePositionDropdown();
            checkRequiredFields();

              POPUP.hide(editEmployerPopup)
            successfulSave.show();

          setTimeout(function () {
              successfulSave.hide();
              
              
             // if (openedPage == 'employmentInfo')
             //     NewEmployment.refreshEmployment(redirectInformation.positionId, redirectInformation.empName, redirectInformation.posName, redirectInformation.consumersName, redirectInformation.consumersId, tabPositionIndex = 0);
             // else
             //     addEditEmployers.init();
          }, 2000);
      }

  } else {  //'update'
      POPUP.hide(editEmployerPopup)
      const result = await OODAjax.updateEmployerAsync(employerId, employerName, employeraddress1, employeraddress2, employercity, employerstate, employerzipcode);
      const { updateEmployerResult: { employerID } } = result;
      successfulSave.show();
      setTimeout(function () {
          successfulSave.hide();
        //  addEditEmployers.init();
      }, 2000);
  }
}

function warningPopup() {
  var popup = POPUP.build({
      id: 'warningPopup',
      classNames: 'warning',
  });
  var OKBtn = button.build({
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      callback: function () {
          POPUP.hide(popup);
          overlay.show();
      },
  });
  var btnWrap = document.createElement('div');
  btnWrap.classList.add('btnWrap');
  btnWrap.appendChild(OKBtn);

  var warningMessage = document.createElement('p');
  warningMessage.innerHTML = "This employer already exists.";
  popup.appendChild(warningMessage);
  popup.appendChild(btnWrap);
  POPUP.show(popup);
}

  return {
    init,
  };
})();
