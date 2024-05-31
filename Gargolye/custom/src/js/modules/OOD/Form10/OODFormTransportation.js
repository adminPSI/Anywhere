const OODFormTransportation = (() => {

  //Inputs
  let serviceDateInput;
  let startTimeInput;
  let endTimeInput;

  // buttons
let saveNoteBtn;
let saveAndNewNoteBtn;
let cancelNoteBtn;
let updateNoteBtn;
let deleteNoteBtn;

// OOD Transportation Edit Data
let consumerId;
//let personId;
let OODTransportationId;
let serviceDate;
let startTime;
let endTime;
let startLocation;
let endLocation;
let numberInVehicle; 

//OOD Transportation Data
let caseManagerId;
let userId;
let serviceId;
let referenceNumber;

let formReadOnly;

let currentEntryUserId;

  async function init(OODTransportationData, currentConsumer, selectedConsumerServiceId, selectedConsumerReferenceNumber, currentRecordUserId, selectedServiceDate, clickSource = 'OODGrid') {

    formReadOnly = false;

    DOM.clearActionCenter();
    document.querySelectorAll('.consumerListBtn').forEach(e => e.remove());

    consumerId = currentConsumer.id;
    currentEntryUserId = currentRecordUserId;

    if (OODTransportationData && Object.keys(OODTransportationData).length !== 0) {
    //  consumerId = OODTransportationData[0].consumerId;  // consumer_id from consumers table for the selected consumer
    // personId = OODTransportationData[0].personId;  //the person_id from the persons table of the logged in user
    OODTransportationId = OODTransportationData[0].OODTransportationId;
    serviceDate = OODTransportationData[0].serviceDate;   // Service Date from page
    startTime = OODTransportationData[0].startTime;  // Start Time from page
    endTime = OODTransportationData[0].endTime; // end Time from page
    numberInVehicle = OODTransportationData[0].numberInVehicle; // # In Vehicle Per Trip from page
    startLocation = OODTransportationData[0].startLocation; // Start Location Street/City from page
    endLocation = OODTransportationData[0].endLocation; // End Location Street/City from page
    userId = $.session.UserId;  // user_id from users_groups of the user who made the last update to the entry
      
     } else {
      //  consumerId = OODTransportationData[0].consumerId;  // consumer_id from consumers table for the selected consumer
      // personId = OODTransportationData[0].personId;  //the person_id from the persons table of the logged in user
      OODTransportationId = '0';
      serviceDate = selectedServiceDate;
      //serviceDate = UTIL.getTodaysDate();
      startTime = '';
      endTime = '';
      numberInVehicle = '';
      startLocation = '';
      endLocation = '';
      userId = $.session.UserId;
      referenceNumber = selectedConsumerReferenceNumber;  // the value from consumer_services_master.reference_number for the service selected from NEW ENTRY form in previous page

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

      numberInVehicleInput = input.build({
        label: '# in Vehicle Per Trip',
        type: 'number',
        style: 'secondary',
        value: numberInVehicle === '0' || numberInVehicle === '0.00' ? '' : numberInVehicle,
        readonly: formReadOnly,
        attributes: [{ key: 'min', value: '0' }],
      });

    startLocationInput = input.build({
      label: 'Start Location Street/City',
      value: startLocation,
      type: 'textarea',
      classNames: 'autosize',
      readonly: formReadOnly,
      //readonly: true,
      // type: 'email',
    });

    endLocationInput = input.build({
      label: 'End Location Street/City',
      value: endLocation,
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
        checkRequiredFields()
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if ((hasErrors.length === 0)) {
          insertFormData('save');
        } 
      },
    });
    saveAndNewNoteBtn = button.build({
      text: 'Save & New',
      style : 'secondary',
      type: 'contained',
      icon: 'add',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => {
        checkRequiredFields()
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if ((hasErrors.length === 0)) {
          insertFormData('saveandNew');
        }    
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
        //TODO JOE; Look at DElete
        deleteConfirmation(OODTransportationId); 
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

    setupEvents();

    let myconsumer = buildConsumerCard(currentConsumer)

      let container = document.createElement("div");
      container.classList.add("monthlyForm");
     var LineBr = document.createElement('br');

     const heading = document.createElement('h2');
     heading.innerHTML = 'Transportation - OOD Form 10';
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
    inputContainer0.appendChild(numberInVehicleInput);

    container.appendChild(inputContainer0);
  
      container.appendChild(startLocationInput);
      container.appendChild(endLocationInput);
    
      let updatecontainer = document.createElement("div");
      updatecontainer.classList.add("updatecontainer");

      let updatemessage = document.createElement("div");
      updatemessage.classList.add("updatemessage");

      updatemessage.innerHTML = `<span style="color: red">This record was created by another user therefore no edits can be made.</span>`;
      updatecontainer.appendChild(updatemessage);

      let btnWrap = document.createElement("div");
      btnWrap.classList.add("btnWrap");
      (OODTransportationId == '0') ? btnWrap.appendChild(saveNoteBtn) :  btnWrap.appendChild(updateNoteBtn);
      (OODTransportationId == '0') ? btnWrap.appendChild(saveAndNewNoteBtn) : btnWrap.appendChild(deleteNoteBtn) ;


      let btnWrap2 = document.createElement("div");
      btnWrap2.classList.add("btnWrap");
      btnWrap2.appendChild(cancelNoteBtn);

      let btnRow = document.createElement("div");
      btnRow.classList.add("btnRow");
       btnRow.appendChild(btnWrap);
       btnRow.appendChild(btnWrap2);

      if (userId !== currentEntryUserId) btnRow.appendChild(updatecontainer);

      container.appendChild(btnRow);

    DOM.ACTIONCENTER.appendChild(container);

    DOM.autosizeTextarea();

    // call Required Fields
    checkRequiredFields();
  }

  function checkRequiredFields() {

    var numInVehicleInput = numberInVehicleInput.querySelector('input');

    if (numInVehicleInput.value === '' || numInVehicleInput.value === 0 || numInVehicleInput.value <= 0) {
      numberInVehicleInput.classList.add('error');
    } else {
      numberInVehicleInput.classList.remove('error');
    }

    var startLocInput = startLocationInput.querySelector('textarea');

    if (startLocInput.value === '') {
      startLocationInput.classList.add('error');
    } else {
      startLocationInput.classList.remove('error');
    }

    var endLocInput = endLocationInput.querySelector('textarea');

    if (endLocInput.value === '') {
      endLocationInput.classList.add('error');
    } else {
      endLocationInput.classList.remove('error');
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

    numberInVehicleInput.addEventListener('input', event => {
      numberInVehicle = event.target.value;
      checkRequiredFields();
    });

    numberInVehicleInput.addEventListener('keypress', event => {
      numberInVehicle = event.target.value;
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

    startLocationInput.addEventListener('input', event => {
      startLocation = event.target.value;
      checkRequiredFields();
    });

    endLocationInput.addEventListener('input', event => {
      endLocation = event.target.value;
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
        OODTransportationId,
        serviceDate: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
        startTime,
        endTime,
        numberInVehicle,
        startLocation,
        endLocation,
        userId,
      };

      OODAjax.updateForm10TransportationData(data, function(results) {
        if (results.includes("Error")) {
            return;
        } else {

          successfulSave.show();
          setTimeout(function() {
            successfulSave.hide();
            OOD.loadOODLanding();
          }, 2000);

        }
      });
    }

    function insertFormData(saveType) {
      var data = {
        consumerId,
        serviceDate: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
        startTime,
        endTime,
        numberInVehicle,
        startLocation,
        endLocation,  
        userId,
        referenceNumber,
      };

      OODAjax.insertForm10TransportationData(data, function(results) {
        if (results.includes("Error")) {
              return;
        } else {

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
        }
    });
  }
    //TODO JOE : Look into DElete for Transporation
    function deleteConfirmation(OODTransportationId) {
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
                   let result = await OODAjax.deleteOODForm10TransportationEntry(OODTransportationId);  
                   if (result.deleteOODForm10TransportationEntryResult === "1"){
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
    

     return {
    init,
    
  };
})();
