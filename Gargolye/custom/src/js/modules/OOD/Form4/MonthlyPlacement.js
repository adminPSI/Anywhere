const OODForm4MonthlyPlacement = (() => {

  //Inputs
  let serviceDateInput;
  let startTimeInput;
  let endTimeInput;
  let SAMLevelDropdown;
  let employerDropdown;
  let contactMethodDropdown;
  let jobSeekerPresentDropdown;  //-- REMOVED FROM FORM ON 4/8/22
  let outcomeDropdown;           //-- REMOVED FROM FORM ON 4/8/22
  let TSCNotifiedDropdown;      //-- REMOVED FROM FORM ON 4/8/22
  let applicationSubmittedDropdown; 
  let interviewDropdown; 
  let bilingualSupplementDropdown;
  let narrativeOutcomeInput;

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
let employer;
let contactType;
let jobSeekerPresent;
let outcome;
let TSCNotified;
let bilingualSupplement;
let notes;
let application;
let interview;

//Case Note Data
let caseManagerId;
let userId;
let serviceId;
let referenceNumber;

let formReadOnly = false;

let currentEntryUserId;

  async function init(caseNoteData, currentConsumer, selectedConsumerServiceId, selectedConsumerReferenceNumber, currentRecordUserId, selectedServiceDate, clickSource = 'OODGrid') {

    DOM.clearActionCenter();
    document.querySelectorAll('.consumerListBtn').forEach(e => e.remove());

    consumerId = currentConsumer.id;
    currentEntryUserId = currentRecordUserId;

    if (caseNoteData && Object.keys(caseNoteData).length !== 0) {

      userId = $.session.UserId;
      caseNoteId = caseNoteData[0].caseNoteId;
      serviceDate = caseNoteData[0].serviceDate;
      startTime = caseNoteData[0].startTime;
      endTime = caseNoteData[0].endTime;
      SAMLevel = caseNoteData[0].SAMLevel;
      employer = caseNoteData[0].employer;
      contactType = caseNoteData[0].contactType;
      jobSeekerPresent = caseNoteData[0].jobSeekerPresent;    //-- REMOVED FROM FORM ON 4/8/22
      outcome = caseNoteData[0].outcome;                   //-- REMOVED FROM FORM ON 4/8/22
      TSCNotified = caseNoteData[0].TSCNotified;            //-- REMOVED FROM FORM ON 4/8/22
      bilingualSupplement = caseNoteData[0].bilingualSupplement;
      notes = caseNoteData[0].notes;
      application = caseNoteData[0].application;
      interview = caseNoteData[0].interview;
 
     } else {

      caseManagerId = $.session.PeopleId;
      userId = $.session.UserId;
      serviceId = selectedConsumerServiceId;
      referenceNumber = selectedConsumerReferenceNumber;
      caseNoteId = '0';
      serviceDate = selectedServiceDate;
      //serviceDate = UTIL.getTodaysDate();
      startTime = '';
      endTime = '';
      SAMLevel = '';
      employer = '';
      contactType = '';
      jobSeekerPresent = '';   //-- REMOVED FROM FORM ON 4/8/22
      outcome = '';           //-- REMOVED FROM FORM ON 4/8/22
      TSCNotified = '';        //-- REMOVED FROM FORM ON 4/8/22
      bilingualSupplement = '';
      notes = '';
      application = '';
      interview = '';

     }

     if (clickSource === 'OODGrid' &&  !$.session.OODUpdate) {
      formReadOnly = true;
     }

     if (clickSource === 'newEntry' &&  !$.session.OODInsert) {
      formReadOnly = true;
     }

     if ((userId !== currentRecordUserId)) {
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
        dropdownId: "SAMLevelDropdown",
        value: SAMLevel,
        readonly: formReadOnly,
        //readonly: true,
        // type: 'email',
      });
    
    employerDropdown = dropdown.build({
        label: "Employer",
        dropdownId: "employerDropdown",
        value: employer,
        readonly: formReadOnly,
    });  

    contactMethodDropdown = dropdown.build({
      label: "Contact Method",
      dropdownId: "contactMethodDropdown",
      value: contactType,
      readonly: formReadOnly,
    });  

    applicationSubmittedDropdown = dropdown.build({
      label: 'Application Submitted',
      dropdownId: "applicationSubmittedDropdown",
      value: application,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    interviewDropdown = dropdown.build({
      label: 'Interview',
      dropdownId: "interviewDropdown",
      value: interview,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    //-- REMOVED FROM FORM ON 4/8/22
    jobSeekerPresentDropdown = dropdown.build({
      label: 'Job Seeker Present ?',
      dropdownId: "jobSeekerPresentDropdown",
      value: jobSeekerPresent,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    //-- REMOVED FROM FORM ON 4/8/22
    outcomeDropdown = dropdown.build({
      label: 'Outcome',
      dropdownId: "outcomeDropdown",
      value: outcome,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    //-- REMOVED FROM FORM ON 4/8/22
    TSCNotifiedDropdown = dropdown.build({
      label: 'TSC Notified ?',
      dropdownId: "TSCNotifiedDropdown",
      value: TSCNotified,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    bilingualSupplementDropdown = dropdown.build({
      label: 'Bilingual Supplement ?',
      dropdownId: "bilingualSupplementDropdown",
      value: bilingualSupplement,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    narrativeOutcomeInput = input.build({
      label: 'Narrative/Outcome',
      value: notes,
      type: 'textarea',
      classNames: 'autosize',
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    saveNoteBtn = button.build({
      text: 'Save',
      style : 'secondary',
      type: 'contained',
      icon: 'save',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => { 
        insertFormData('save');  
      },
    });
    saveAndNewNoteBtn = button.build({
      text: 'Save & New',
      style : 'secondary',
      type: 'contained',
      icon: 'add',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => {
          insertFormData('saveandNew');
      },
    });
    updateNoteBtn = button.build({
      text: 'update',
      style : 'secondary',
      type: 'contained',
      icon: 'add',
    //  classNames: 'disabled',
      callback: async () => {      
       updateFormData(); 
      },
    });
    deleteNoteBtn = button.build({
      text: 'Delete',
      style : 'secondary',
      type: 'contained',
      icon: 'delete',
     // classNames: 'disabled',
      callback: async () => {
        deleteConfirmation(caseNoteId); 
      },
    });
    cancelNoteBtn = button.build({
      text: 'cancel',
      style : 'secondary',
      type: 'outlined',
      icon: 'close',
      classNames: ['caseNoteCancel'],
      callback: async () =>  {
        OOD.loadOODLanding();
      },
    });

    addEmployersBtn = button.build({
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

    let myconsumer = buildConsumerCard(currentConsumer)

      let container = document.createElement("div");
      container.classList.add("monthlyForm");
     var LineBr = document.createElement('br');

     const heading = document.createElement('h2');
     heading.innerHTML = 'Monthly Placement - OOD Form 4';
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
    inputContainer1.classList.add('ood_form4monthlyplacement_inputContainer1');
    inputContainer1.appendChild(SAMLevelDropdown);
    inputContainer1.appendChild(employerDropdown);
    inputContainer1.appendChild(addEmployersBtn);
    
    

    const inputContainer2 = document.createElement('div');
    inputContainer2.classList.add('ood_form4monthlyplacement_inputContainer2');
    //inputContainer2.appendChild(jobSeekerPresentDropdown); //-- REMOVED FROM FORM ON 4/8/22
    //inputContainer2.appendChild(outcomeDropdown);    //-- REMOVED FROM FORM ON 4/8/22
    //inputContainer2.appendChild(TSCNotifiedDropdown);  //-- REMOVED FROM FORM ON 4/8/22
    inputContainer2.appendChild(contactMethodDropdown);
    inputContainer2.appendChild(applicationSubmittedDropdown);
    inputContainer2.appendChild(interviewDropdown);
    inputContainer2.appendChild(bilingualSupplementDropdown);

    container.appendChild(inputContainer0);
    container.appendChild(inputContainer1);
    container.appendChild(inputContainer2);

      container.appendChild(narrativeOutcomeInput);
    
      let updatecontainer = document.createElement("div");
      updatecontainer.classList.add("updatecontainer");

      let updatemessage = document.createElement("div");
      updatemessage.classList.add("updatemessage");

      updatemessage.innerHTML = `<span style="color: red">This record was created by another user therefore no edits can be made.</span>`;
      updatecontainer.appendChild(updatemessage);

      let btnWrap = document.createElement("div");
      btnWrap.classList.add("btnWrap");
      (caseNoteId == '0') ? btnWrap.appendChild(saveNoteBtn) :  btnWrap.appendChild(updateNoteBtn);
      (caseNoteId == '0') ? btnWrap.appendChild(saveAndNewNoteBtn) : btnWrap.appendChild(deleteNoteBtn) ;


      let btnWrap2 = document.createElement("div");
      btnWrap2.classList.add("btnWrap");
      btnWrap2.appendChild(cancelNoteBtn);

      let btnRow = document.createElement("div");
      btnRow.classList.add("btnRow");
       btnRow.appendChild(btnWrap);
       btnRow.appendChild(btnWrap2);

      if (userId !== currentEntryUserId) btnRow.appendChild(updatecontainer);

      container.appendChild(btnRow);

      populateStaticDropDowns();
      populateConsumerEmployersDropdown(currentConsumer.id);
      populateContactTypeDropdown();
      populateOutcomeDropdown();
      

    DOM.ACTIONCENTER.appendChild(container);

    DOM.autosizeTextarea();

    // call Required Fields
    checkRequiredFields();
  }

	async function populateConsumerEmployersDropdown(currentConsumerId) { 
		
		const {
			getActiveEmployersResult: employers,
		} = await OODAjax.getActiveEmployersAsync();
	  // const templates = WorkflowViewerComponent.getTemplates();

	  let data = employers.map((employr) => ({
		  id: employr.employerId, 
		  value: employr.employerId, 
		  text: (employr.address1 == '') ? employr.employerName : employr.employerName + ' -- ' + employr.address1,
	  })); 

    		const index = data.findIndex((x) => x.id == employer);
						if (index === -1) {
							// case note employer not in the employers DDL
						}

   var filtereddata = data.filter((x) => x.id != 0);

	  filtereddata.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
	  dropdown.populate("employerDropdown", filtereddata, employer);        
  }

	  async function populateContactTypeDropdown() { 
		
      const {
        getContactTypesResult: contactTypes,
      } = await OODAjax.getContactTypesAsync();
      // const templates = WorkflowViewerComponent.getTemplates();
      let data = contactTypes.map((contactType) => ({
        id: contactType.contactCode, 
        value: contactType.contactCode, 
        text: contactType.contactCaption,
      })); 

      const index = data.findIndex((x) => x.id == contactType);
						if (index === -1) {
							// case note contactType not in the contactTypes DDL
						}

      data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
      dropdown.populate("contactMethodDropdown", data, contactType);        
    }

    async function populateOutcomeDropdown() { 
		
      const {
        getOutcomesResult: outcomes,
      } = await OODAjax.getOutcomesAsync();
      // const templates = WorkflowViewerComponent.getTemplates();
      let data = outcomes.map((outcome) => ({
        id: outcome.outcomeCode, 
        value: outcome.outcomeCode, 
        text: outcome.outcomeCaption,
      })); 

      const index = data.findIndex((x) => x.id == outcome);
						if (index === -1) {
							// case note outcome not in the outcomes DDL
						}

      data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
      dropdown.populate("outcomeDropdown", data, outcome);        
    }

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
   //  dropdown.populate(jobSeekerPresentDropdown, yesNoDropdownData, jobSeekerPresent);  //-- REMOVED FROM FORM ON 4/8/22
   //  dropdown.populate(TSCNotifiedDropdown, yesNoDropdownData, TSCNotified);            //-- REMOVED FROM FORM ON 4/8/22
   dropdown.populate(applicationSubmittedDropdown, yesNoDropdownData, application); 
   dropdown.populate(interviewDropdown, yesNoDropdownData, interview); 
    dropdown.populate(bilingualSupplementDropdown, yesNoDropdownData, bilingualSupplement);
  }

  function checkRequiredFields() {

    if (!SAMLevel || SAMLevel === '') {
      SAMLevelDropdown.classList.add('error');
      //return 'error';
    } else {
      SAMLevelDropdown.classList.remove('error');
     // return 'success';
    }

    if (!employer || employer === '') {
      employerDropdown.classList.add('error');
    } else {
      employerDropdown.classList.remove('error');
    }

    if (!contactType || contactType === '') {
      contactMethodDropdown.classList.add('error');
    } else {
      contactMethodDropdown.classList.remove('error');
    }

    if (!application || application === '') {
      applicationSubmittedDropdown.classList.add('error');
    } else {
      applicationSubmittedDropdown.classList.remove('error');
    }

    if (!interview || interview === '') {
      interviewDropdown.classList.add('error');
    } else {
      interviewDropdown.classList.remove('error');
    }

    //-- REMOVED FROM FORM ON 4/8/22
    if (!jobSeekerPresent || jobSeekerPresent === '') {
      jobSeekerPresentDropdown.classList.add('error');
    } else {
      jobSeekerPresentDropdown.classList.remove('error');
    }

    //-- REMOVED FROM FORM ON 4/8/22
    if (!outcome || outcome === '') {
      outcomeDropdown.classList.add('error');
    } else {
      outcomeDropdown.classList.remove('error');
    }

    //-- REMOVED FROM FORM ON 4/8/22
    if (!TSCNotified || TSCNotified === '') {
      TSCNotifiedDropdown.classList.add('error');
    } else {
      TSCNotifiedDropdown.classList.remove('error');
    }

    if (!bilingualSupplement || bilingualSupplement === '') {
      bilingualSupplementDropdown.classList.add('error');
    } else {
      bilingualSupplementDropdown.classList.remove('error');
    }

    var noteInput = narrativeOutcomeInput.querySelector('textarea');

    if (noteInput.value === '') {
      narrativeOutcomeInput.classList.add('error');
    } else {
      narrativeOutcomeInput.classList.remove('error');
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
    if ((hasErrors.length !== 0) || formReadOnly) {
        saveNoteBtn.classList.add('disabled');
        saveAndNewNoteBtn.classList.add('disabled');
        updateNoteBtn.classList.add('disabled');
      } else {
        saveNoteBtn.classList.remove('disabled');
        saveAndNewNoteBtn.classList.remove('disabled');
        updateNoteBtn.classList.remove('disabled');
      }

      if ((userId !== currentEntryUserId) || !$.session.OODDelete) {
        deleteNoteBtn.classList.add('disabled');
      } else {
        deleteNoteBtn.classList.remove('disabled')
      }

  }

function checkEndInputTime() {

  var endInput = endTimeInput.querySelector('input');
  var todaysDate = UTIL.getTodaysDate();
  currentserviceDate = UTIL.formatDateToIso(serviceDate.split(' ')[0]);

  if (currentserviceDate === todaysDate && checkTimeForAfterNow(endInput.value))
  {
    endTimeInput.classList.add('error');
    return;
  } else {
    endTimeInput.classList.remove('error');
  }

  var isEndAfterStartTime = validateStartEndTimes('endCheck')

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

  if (currentserviceDate === todaysDate && checkTimeForAfterNow(startInput.value))
  {
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
  let nowMinuet =
    tempNow.getMinutes() < '10' ? `0${tempNow.getMinutes()}` : tempNow.getMinutes();
  return (
    Date.parse(`01/01/2020 ${enteredTime}`) >
    Date.parse(`01/01/2020 ${nowHour}:${nowMinuet}`)
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
       
      if (selectedOption.value == "SELECT") {
          SAMLevel = '';
      } else {
        SAMLevel = selectedOption.value;
      }
      checkRequiredFields();
    });

    employerDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        employer = '';
      } else {
        employer = selectedOption.value;
      }
      checkRequiredFields();
    });

    contactMethodDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        contactType = '';
      } else {
        contactType = selectedOption.value;
      }
      checkRequiredFields();
    });

    applicationSubmittedDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        application = '';
      } else {
        application = selectedOption.value;
      }
      checkRequiredFields();
    });

    interviewDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        interview = '';
      } else {
        interview = selectedOption.value;
      }
      checkRequiredFields();
    });

    //-- REMOVED FROM FORM ON 4/8/22
    jobSeekerPresentDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        jobSeekerPresent = '';
      } else {
        jobSeekerPresent = selectedOption.value;
      }
      checkRequiredFields();
    });

    //-- REMOVED FROM FORM ON 4/8/22
    outcomeDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        outcome = '';
      } else {
        outcome = selectedOption.value;
      }
      checkRequiredFields();
    });

    //-- REMOVED FROM FORM ON 4/8/22
    TSCNotifiedDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        TSCNotified = '';
      } else {
        TSCNotified = selectedOption.value;
      }
      checkRequiredFields();
    });

    bilingualSupplementDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        bilingualSupplement = '';
      } else {
        bilingualSupplement = selectedOption.value;
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

    narrativeOutcomeInput.addEventListener('input', event => {
      notes = event.target.value;
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

      const consumerRow =  document.createElement('div');
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
        employer,
        contactType,
        jobSeekerPresent,  //-- REMOVED FROM FORM ON 4/8/22
        outcome,           //-- REMOVED FROM FORM ON 4/8/22
        TSCNotified,       //-- REMOVED FROM FORM ON 4/8/22
        bilingualSupplement,
        notes,
        userId,
        application, 
        interview,
      };

      OODAjax.updateForm4MonthlyPlacementEditData(data, function(results) {
        successfulSave.show();
          setTimeout(function() {
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
        employer,
        contactType,
        jobSeekerPresent,    //-- REMOVED FROM FORM ON 4/8/22
        outcome,             //-- REMOVED FROM FORM ON 4/8/22
        TSCNotified,         //-- REMOVED FROM FORM ON 4/8/22
        bilingualSupplement,
        notes,
        caseManagerId,
        userId,
        serviceId,
        referenceNumber,
        application, 
        interview,
      };

      OODAjax.insertForm4MonthlyPlacementEditData(data, function(results) {
        successfulSave.show();
        if (saveType == 'saveandNew') {
          setTimeout(function() {
            successfulSave.hide();
            overlay.show();
            OOD.buildEntryServicePopUp(consumerId, 'newEntry');
          }, 2000);
        } else {  //save
          setTimeout(function() {
            successfulSave.hide();
            OOD.loadOODLanding();
          }, 2000);
        }
      });

    }

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
        callback: async function() {
                  POPUP.hide(deletepopup);
                   let result = await OODAjax.deleteOODFormEntryAsync(caseNoteId);  
                   if (result.deleteOODFormEntryResult === "1"){
                        OOD.loadOODLanding();                
                   }
        },
      });
      var noBtn = button.build({
        text: 'No',
        style: 'secondary',
        type: 'contained',
        icon: 'close',
        callback: function() {
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

     return {
    init,
    
  };
})();
