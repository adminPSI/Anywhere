const Tier1andJDPlanForm = (() => {
  //Inputs
  let serviceDateInput; // Default Service Date to the date that is selected 
  // when the user clicks New Entry in the previous page.  Default all other fields to null/unselected
  let SAMLevelDropdown; //SAM Level dropdown should have same values/logic as existing dropdown for OOD Form 8
  let contactMethodDropdown; // Contact Type dropdown should have values from code_table.caption 
  //where table_ID = Employment_Code_OOD_6 and code_table.field_id = ContactMethod  
  let narrativeInput;
  

  // buttons
  let saveNoteBtn;
  let saveAndNewNoteBtn;
  let cancelNoteBtn;
  let updateNoteBtn;
  let deleteNoteBtn;

  // Case Note Edit Data
  let consumerId;  // emp_ood.consumer_id = consumer_id from consumers table for the selected consumer 
  let caseNoteId;
  let serviceDate; // emp_ood.date_of_service = Service Date from page 
  let SAMLevel; // emp_ood.service_area_modifier = SAM Level from page.  Save data to table using same logic as found in OOD Form 8. 
  let contactMethod;  // emp_ood.contact_method = Contact Type from page.  Save code_table.code for selected contact method
  let narrative; // emp_ood.narrative = Narrative from page 

  //Case Note Data
  let caseManagerId; // ??? emp_ood.person_id = the person_id from the persons table of the logged in
  let userId; // ??? user emp_ood.user_id = user_id from users_groups of the user who made the last update to the entry 
  let serviceId;
  let referenceNumber; // emp_ood.reference_number = copy consumer_services_master.reference_number from the selected service (in pop-up prior to going to this page)

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
      SAMLevel = caseNoteData[0].SAMLevel; //TODO JOE: Case_Notes.Service_Area_Modifier (populates with N/A, 1, 2, or 3)
      contactMethod = caseNoteData[0].contactMethod; //TODO JOE: Corresponding Code_Table.Code will save to emp_ood.contact_method
      narrative = caseNoteData[0].narrative; //TODO JOE: emp_ood.narrative
      
    } else {
      caseManagerId = $.session.PeopleId;
      userId = $.session.UserId;
      serviceId = selectedConsumerServiceId;
      caseNoteId = '0';
      serviceDate = selectedServiceDate;
      referenceNumber = selectedConsumerReferenceNumber;
      SAMLevel = '';
      contactMethod = '';
      narrative = '';
      
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


    SAMLevelDropdown = dropdown.build({
      label: 'SAM Level',
      dropdownId: 'SAMLevelDropdown',
      value: SAMLevel,
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    contactMethodDropdown = dropdown.build({
      label: 'Contact Type',
      dropdownId: 'contactMethodDropdown',
      value: contactMethod,
      readonly: formReadOnly,
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
    // heading.innerHTML = `${selectedConsumerServiceName} - OOD Form 8`;
    heading.innerHTML = `Tier 1 and JD Plan - OOD Form 6`;
    heading.classList.add('OODsectionHeading');

    container.appendChild(myconsumer);
    // container.appendChild(LineBr);
    container.appendChild(LineBr);
    container.appendChild(heading);
    container.appendChild(LineBr);

    const inputContainer0 = document.createElement('div');
    inputContainer0.classList.add('ood_form4monthlyplacement_inputContainer1');
    inputContainer0.appendChild(serviceDateInput);
    inputContainer0.appendChild(contactMethodDropdown);
    inputContainer0.appendChild(SAMLevelDropdown);

  //  const inputContainer1 = document.createElement('div');
   // inputContainer1.classList.add('ood_form4monthlyplacement_inputContainer1'); // new _OOD.scss setting  -- ood_form8monthlyplacement_inputContainer1
    
    

   // const inputContainer2 = document.createElement('div');
  //  inputContainer2.classList.add('ood_form4monthlyplacement_inputContainer2');
    

    container.appendChild(inputContainer0);
  //  container.appendChild(inputContainer1);
   // container.appendChild(inputContainer2);

    container.appendChild(narrativeInput);

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
   
    DOM.ACTIONCENTER.appendChild(container);

    DOM.autosizeTextarea();

    // call Required Fields
    checkRequiredFields();
  }
  // TODO JOE: Double check that AJAX pulls correct data
  // Contact Method -  Contact Method dropdown should be a list of values (code_table.caption)
  // where code_table.table_id = employment_code and code_table.field_id = contactmethod
  async function populateContactMethodDropdown() {
    const { getContactMethodsResult: contactMethods } = await OODAjax.getContactMethodsAsync('Form6');
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
  
    if (!contactMethod || contactMethod === '') {
      contactMethodDropdown.classList.add('error');
    } else {
      contactMethodDropdown.classList.remove('error');
    }


    var noteInput = narrativeInput.querySelector('textarea');

    if (noteInput.value === '') {
      narrativeInput.classList.add('error');
    } else {
      narrativeInput.classList.remove('error');
    }

    checkServiceDateInput();
    
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

    contactMethodDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        contactMethod = '';
      } else {
        contactMethod = selectedOption.value;
      }
      checkRequiredFields();
    });

    serviceDateInput.addEventListener('change', event => {
      serviceDate = event.target.value;
      checkServiceDateInput();
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
      SAMLevel,
      contactMethod,
      narrative,
      userId,
    };
  
    OODAjax.updateForm6Tier1andJDPLan(data, function (results) {
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
      SAMLevel,
      contactMethod,
      narrative,
      userId,
      serviceId,
      referenceNumber,
      caseManagerId,
    };
    
    OODAjax.insertForm6Tier1andJDPLan(data, function (results) {
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
