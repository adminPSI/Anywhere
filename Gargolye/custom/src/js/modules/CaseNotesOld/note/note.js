var note = (function () {
  // DOM Stuff
  let caseNoteCard;
  let serviceDateInput, startTimeInput, endTimeInput, noteTextInput, mileageInput;
  let serviceCodeDropdown; // billing/service code
  let locationDropdown,
    serviceDropdown,
    serviceLocationDropdown,
    needDropdown,
    vendorDropdown,
    contactDropdown;
  let myPhrasesBtn,
    deleteNoteBtn,
    cancelNoteBtn,
    timerStartBtn,
    timerStopBtn,
    consumerListBtn,
    attachmentsBtn,
    saveAndNewNoteBtn;
  let confidentialCheckbox;
  let docTimeMinutesField, travelTimeMinutesField;
  let groupNoteDisplay;
  // Values & Data
  var selectedConsumerIds = [];
  var dropdownDataKeys;
  var dropdownData = {};
  var billers; // for casemanager dropdown
  var consumersThatCanHaveMileage;
  var defaultServiceCode;
  var pageLoaded;
  var timerRunning;
  var groupData;
  var lastUpdatedBy;
  var enteredBy;
  var lastUpdated;
  var groupConsumers;
  var mileage;
  let billerDropdownData;
  let fromDashboard;
  let dashboardConsumer;
  // GK Required
  var gkLocationRequired;
  var gkNeedRequired;
  var gkContactRequired;
  var gkServiceRequired;
  var gkAllowGroupNotes;
  var gkMileageRequired;
  // note data
  var noteId;
  var credit;
  var serviceCode;
  var locationId;
  var serviceId;
  var serviceLocationId;
  var needId;
  var vendorId;
  var contactId;
  var serviceDate;
  var startTime;
  var endTime;
  var noteText;
  var confidential;
  var reviewRequired;
  var documentationTime;
  var travelTime;
  //Attachment
  let tempAttachmentArray = [],
    reviewAttachmentArray = [],
    attachmentCount;
  // Revew Note Data Only
  var caseManagerId;
  var consumerId;
  var consumerName;
  var reviewData; // all the data
  var reviewResults;
  var reviewRejectReason;
  var correctedCheckbox;
  var corrected;
  let isGroupNote;
  var allowGroupNotes;
  var convertToGroupNote = false; //When reviewing a single note, more consumers can be added to convert it to group note.
  var rd;
  // Permisisons
  var viewOnly;
  var cnBatched;
  //need for required fields
  var gkLocationRequired = '';
  var gkServiceRequired = '';
  var gkNeedRequired = '';
  var gkContactRequired = '';
  var advLocationRequired = '';
  var advServiceRequired = '';
  var advNeedRequired = '';
  var advContactRequired = '';
  // case note inputs
  var isReadOnly;

  // Utils
  // ----------------------------------------
  function warningPopup(text, continueFunc, cancelFunc, hide_X = true) {
    const popup = POPUP.build({
      id: 'warningPopup',
      classNames: 'warning',
      hideX: hide_X,
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    if (continueFunc) {
      const continueBtn = button.build({
        text: 'continue',
        style: 'secondary',
        type: 'contained',
        callback: function () {
          POPUP.hide(popup);
          continueFunc();
        },
      });
      btnWrap.appendChild(continueBtn);
    }
    if (cancelFunc) {
      var cancelBtn = button.build({
        text: 'cancel',
        style: 'secondary',
        type: 'contained',
        callback: function () {
          POPUP.hide(popup);
          cancelFunc();
        },
      });
      btnWrap.appendChild(cancelBtn);
    }
    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = text;
    popup.appendChild(warningMessage);
    popup.appendChild(btnWrap);
    POPUP.show(popup);
  }

  function validateTimesWhenDateChange() {
    var startInput = startTimeInput.querySelector('input');
    var endInput = endTimeInput.querySelector('input');
    var dateInput = serviceDateInput.querySelector('input');
    // var startTime = UTIL.convertToMilitary(startInput.value);
    var startTime = startInput.value;
    // var endTime = UTIL.convertToMilitary(endInput.value);
    var endTime = endInput.value;
    var currentDate = UTIL.getTodaysDate();
    var currentTime = UTIL.getCurrentTime();

    let isTimeValid;
    isTimeValid = true;

    if (dateInput.value === currentDate) {
      isTimeValid = currentTime < startTime || currentTime < endTime ? false : true; // current date: can't have Time be future time
    }

    if (startTime >= endTime) {
      isTimeValid = false; // any date:  startTime can't be after endTime
    }

    if (startTime === '' || endTime === '') {
      isTimeValid = false; // start time and end time are required
    }

    //isTimeValid = startTime >= endTime ? false : true; // any date:  startTime can't be after endTime

    return {
      isValid: isTimeValid,
      startTime,
      endTime,
    };
  }
  function checkIfSameDates() {
    var dateEntered = new Date(serviceDateInput.value);
    var todaysDate = new Date();
    dateEntered = dateEntered.getMilliseconds();
    todaysDate = todaysDate.getMilliseconds();

    return dateEntered === todaysDate ? 0 : 1;
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

  function setNoteValues(reviewData) {
    if (pageLoaded === 'new') {
      caseManagerId = $.session.PeopleId;
      consumerId = '';
      consumerName = '';
      allowGroupNotes = false;

      noteId = 0;
      serviceCode = '';
      locationId = '';
      serviceId = '';
      serviceLocationId = '';
      needId = '';
      vendorId = '';
      contactId = '';
      serviceDate = UTIL.getTodaysDate();
      startTime = UTIL.getCurrentTime();
      endTime = '';
      noteText = '';
      confidential = 'N';
      corrected = 'N';
      reviewRequired = '';
    } else {
      rd = reviewData[0];
      isGroupNote = rd.groupid === '' ? false : true;

      caseManagerId = rd.casemanagerid;
      consumerId = rd.consumerid;
      consumerName = rd.consumername;
      noteId = rd.noteid;
      groupNoteId = rd.groupid === '' ? 0 : rd.groupid;
      credit = rd.credit;
      serviceCode = rd.mainbillingorservicecodeid; // serv/bill code
      locationId = rd.locationcode;
      serviceId = rd.servicecode; // services
      serviceLocationId = rd.servicelocationid;
      needId = rd.serviceneedcode;
      vendorId = rd.vendorid;
      contactId = rd.contactcode;
      serviceDate = UTIL.formatDateToIso(rd.servicedate.split(' ')[0]);
      startTime = rd.starttime;
      endTime = rd.endtime;
      noteText = rd.casenote;
      confidential = rd.confidential;
      corrected = rd.corrected;
      reviewRequired = rd.reviewrequired === '' ? 'N' : rd.reviewrequired;
      reviewResults = rd.reviewresults;
      reviewRejectReason = rd.rejectionreason;
      documentationTime = rd.totaldoctime;
      travelTime = rd.traveltime;
      lastUpdated = rd.lastupdate;
      enteredBy = rd.originaluserid;
      cnBatched = rd.batched;
      originalUserName = rd.originaluserfullname;
      mileage = rd.totalmiles;
    }
  }
  function checkIfBatched() {
    return cnBatched !== '' ? true : false;
  }

  function checkIfCredit() {
    return credit === 'Y' || credit === '-1' ? true : false; //ADVUNIT: '-1' and GKUNIT: 'Y'
  }

  function isCaseNoteReadOnly() {
    if (credit === 'Y' || credit === '-1') {
      isReadOnly = true;
      // } else if (caseManagerId !== $.session.PeopleId) {
      //  isReadOnly = true;
    } else {
      isReadOnly = false;
    }
  }
  function showTimeWarningPopup(callback) {
    const timeWarningPop = POPUP.build({
      id: 'timeWarningPop',
      classNames: 'warning',
      hideX: hide_X,
    });

    const message = document.createElement('p');
    message.innerText = `The times you have entered
    are outside the current normal working hours. Click OK to
    proceed or cacnel to return to the form.`;

    const okBtn = button.build({
      text: 'ok',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(timeWarningPop);
        callback();
      },
    });
    const cancelBtn = button.build({
      text: 'cancel',
      style: 'secondary',
      type: 'outlined',
      callback: function () {
        POPUP.hide(timeWarningPop);
      },
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(okBtn);
    btnWrap.appendChild(cancelBtn);

    timeWarningPop.appendChild(message);
    timeWarningPop.appendChild(btnWrap);

    POPUP.show(timeWarningPop);
  }

  async function noteSaveUpdate(saveAndNew) {
    //Remove the selected consumer from active list
    selectedConsumerIds.forEach(cId => {
      roster2.removeConsumerFromActiveConsumers(cId);
    });
    var vendorInput = vendorDropdown.firstElementChild;
    var locationInput = locationDropdown.firstElementChild;
    var serviceInput = serviceDropdown.firstElementChild;
    var needInput = needDropdown.firstElementChild;
    var contactInput = contactDropdown.firstElementChild;
    documentationTimer.stopTimer;
    noteText = UTIL.removeUnsavableNoteText(noteText);
    // If they are converting from a single note to a group note, delete existing note and create a new note classified as a group note
    if (convertToGroupNote) {
      await singleNoteToGroupNote();
    }
    if (pageLoaded === 'new') {
      var overlapData = {
        consumerId,
        startTime,
        endTime,
        serviceDate,
        caseManagerId,
        noteId: 0,
        groupNoteId: 0,
      };
      var saveData = {
        caseManagerId,
        noteId,
        // dropdowns
        serviceOrBillingCodeId: serviceCode,
        locationCode: locationId,
        serviceCode: serviceId,
        needCode: needId,
        serviceDate,
        startTime,
        endTime,
        vendorId: vendorInput.value,
        contactCode: contactId,
        serviceLocationCode: serviceLocationId,
        caseNote: noteText, // from note input
        confidential, // from checkbox
        corrected, // from checkbox

        casenotemileage: String(mileage) === 'null' ? '0' : String(mileage),
        casenotetraveltime: String(travelTime),
        documentationTime: String(documentationTime),
        reviewRequired,
      };
      newNote.saveNote(
        { overlapData, saveData, selectedConsumerIds, saveAndNew },
        tempAttachmentArray,
      );
      return;
    }

    if (pageLoaded === 'review') {
      // clean start time and end time:
      endTime = endTime.length === 8 ? endTime.substring(0, 5) : endTime;
      startTime = startTime.length === 8 ? startTime.substring(0, 5) : startTime;
      var updateOverlapData = {
        consumerId,
        startTime,
        endTime,
        serviceDate,
        caseManagerId,
        noteId,
        groupNoteId,
      };
      var updateData = {
        noteId,
        groupNoteId,
        caseManagerId,
        consumerId,
        serviceOrBillingCodeId: serviceCode,
        locationCode:
          locationInput.selectedIndex === -1
            ? 0
            : locationInput.options[locationInput.selectedIndex].value,
        serviceCode:
          serviceInput.selectedIndex === -1
            ? 0
            : serviceInput.options[serviceInput.selectedIndex].value,
        needCode:
          needInput.selectedIndex === -1 ? 0 : needInput.options[needInput.selectedIndex].value,
        serviceDate,
        startTime,
        endTime,
        vendorId,
        contactCode:
          contactInput.selectedIndex === -1
            ? 0
            : contactInput.options[contactInput.selectedIndex].value,
        serviceLocationCode: serviceLocationId,
        reviewRequired,
        confidential,
        corrected,
        caseNote: noteText,
        casenotemileage: String(mileage) === 'null' ? '' : String(mileage),
        casenotetraveltime: travelTime === null ? String(0) : String(travelTime),
        documentationTime: documentationTime === null ? String(0) : String(documentationTime),
      };
      reviewNote.updateNote(
        { overlapData: updateOverlapData, updateData, selectedConsumerIds, isGroupNote },
        tempAttachmentArray,
      );
    }
  }

  // Dropdowns
  // ----------------------------------------
  function dealWithDropdownDataHugeString(res) {
    function decipherXML(res) {
      var xmlDoc,
        data = [];
      xmlDoc = UTIL.parseXml(
        '<?xml version="1.0" encoding="UTF-8"?>' + res.populateDropdownDataResult,
      );

      var billingCodes = [].slice.call(xmlDoc.getElementsByTagName('billingcode'));
      billingCodes.forEach(bc => {
        var tmpServiceCode = [].slice.call(bc.getElementsByTagName('codename'))[0];
        var tmpServiceId = [].slice.call(bc.getElementsByTagName('serviceid'))[0];
        var tmpServiceFunding = [].slice.call(bc.getElementsByTagName('includeinfunding'))[0];
        var tmpServiceRequired = [].slice.call(bc.getElementsByTagName('servicerequired'))[0];
        var tmpLocationRequired = [].slice.call(bc.getElementsByTagName('locationrequired'))[0];
        var tmpNeedRequired = [].slice.call(bc.getElementsByTagName('needrequired'))[0];
        var tmpContactRequired = [].slice.call(bc.getElementsByTagName('contactrequired'))[0];
        var tmpAllowGroupNotes = [].slice.call(bc.getElementsByTagName('allowgroupnotes'))[0];
        var tmpMileageRequired = [].slice.call(bc.getElementsByTagName('mileagerequired'))[0];
        var tmpDocTimeRequired = [].slice.call(bc.getElementsByTagName('doctimerequired'))[0];
        var tmpTravelTimeRequired = [].slice.call(bc.getElementsByTagName('traveltimerequired'))[0];
        var locations = [].slice.call(bc.getElementsByTagName('location'));
        var contacts = [].slice.call(bc.getElementsByTagName('contact'));
        var services = [].slice.call(bc.getElementsByTagName('service'));
        var needs = [].slice.call(bc.getElementsByTagName('need'));

        var tmpObject = {};
        tmpObject.serviceCode = tmpServiceCode ? tmpServiceCode.textContent : '';
        tmpObject.serviceId = tmpServiceId ? tmpServiceId.textContent : '';
        tmpObject.serviceFunding = tmpServiceFunding ? tmpServiceFunding.textContent : '';
        tmpObject.serviceRequired = tmpServiceRequired ? tmpServiceRequired.textContent : '';
        tmpObject.locationRequired = tmpLocationRequired ? tmpLocationRequired.textContent : '';
        tmpObject.needRequired = tmpNeedRequired ? tmpNeedRequired.textContent : '';
        tmpObject.contactRequired = tmpContactRequired ? tmpContactRequired.textContent : '';
        tmpObject.allowGroupNotes = tmpAllowGroupNotes ? tmpAllowGroupNotes.textContent : '';
        tmpObject.mileageRequired = tmpMileageRequired ? tmpMileageRequired.textContent : '';
        tmpObject.docTimeRequired = tmpDocTimeRequired ? tmpDocTimeRequired.textContent : '';
        tmpObject.travelTimeRequired = tmpTravelTimeRequired
          ? tmpTravelTimeRequired.textContent
          : '';
        tmpObject.locations = [];
        tmpObject.contacts = [];
        tmpObject.services = [];
        tmpObject.needs = [];

        locations.forEach(loc => {
          var tmpLocName = [].slice.call(loc.getElementsByTagName('locname'))[0].textContent;
          var tmpLocCode = [].slice.call(loc.getElementsByTagName('loccode'))[0].textContent;
          tmpObject.locations.push({
            locName: tmpLocName,
            locCode: tmpLocCode,
          });
        });
        contacts.forEach(loc => {
          var tmpContactName = [].slice.call(loc.getElementsByTagName('contactname'))[0]
            .textContent;
          var tmpContactCode = [].slice.call(loc.getElementsByTagName('contactcode'))[0]
            .textContent;
          tmpObject.contacts.push({
            contactName: tmpContactName,
            contactCode: tmpContactCode,
          });
        });
        services.forEach(loc => {
          var tmpServiceName = [].slice.call(loc.getElementsByTagName('servicename'))[0]
            .textContent;
          var tmpServiceCode = [].slice.call(loc.getElementsByTagName('servicecode'))[0]
            .textContent;
          tmpObject.services.push({
            serviceName: tmpServiceName,
            serviceCode: tmpServiceCode,
          });
        });
        needs.forEach(loc => {
          var tmpNeedName = [].slice.call(loc.getElementsByTagName('needname'))[0].textContent;
          var tmpNeedCode = [].slice.call(loc.getElementsByTagName('needcode'))[0].textContent;
          tmpObject.needs.push({
            needName: tmpNeedName,
            needCode: tmpNeedCode,
          });
        });

        data.push(tmpObject);
      });

      return data;
    }

    var beautifulObject = decipherXML(res);

    // create object for quick access
    beautifulObject.forEach(dd => {
      // create object for each billercode
      if (!dropdownData[dd.serviceId]) {
        dropdownData[dd.serviceId] = {
          serviceId: dd.serviceId,
          serviceCode: dd.serviceCode,
          serviceFunding: dd.serviceFunding,
          locations: [...dd.locations],
          contacts: [...dd.contacts],
          services: [...dd.services],
          needs: [...dd.needs],
          docTimeRequired: dd.docTimeRequired,
          travelTimeRequired: dd.travelTimeRequired,
          mileageRequired: dd.mileageRequired,
          locationRequired: dd.locationRequired,
          needRequired: dd.needRequired,
          serviceRequired: dd.serviceRequired,
          contactRequired: dd.contactRequired,
          allowGroupNotes: dd.allowGroupNotes,
        };
      }
    });
    // dropdownData[""] = {
    //   serviceId: "",
    //   serviceCode: "",
    //   serviceFunding: "",
    //   locations: [{locName:"", locCode: ""}],
    //   contacts: [{contactName:"", contactCode: ""}],
    //   services: [{serviceName:"", serviceCode: ""}],
    //   needs: [{needName:"", needCode: ""}],
    //   docTimeRequired: "",
    //   travelTimeRequired: "",
    //   mileageRequired: ""
    // }
    dropdownDataKeys = Object.keys(dropdownData);
    return dropdownData;
  }

  function checkServiceFunding() {
    if ($.session.applicationName === 'Advisor') {
      if (
        serviceCodeDropdown.firstChild.options[
          serviceCodeDropdown.firstChild.selectedIndex
        ].getAttribute('data-service-funding') === 'N'
      ) {
        serviceLocationDropdown.classList.add('hidden');
        serviceLocationDropdown.classList.remove('error');
        serviceLocationDropdown.firstChild.selectedIndex = 0;
        serviceLocationId = '00';
      } else {
        serviceLocationDropdown.classList.remove('hidden');
        if (serviceLocationId === '' || serviceLocationId === '00')
          serviceLocationDropdown.classList.add('error');
      }
    }
  }

  function populateBillerDropdown() {
    billerDropdownData = dropdownDataKeys.map((key, index) => {
      if (index === 1) serviceCode = key;
      return {
        value: dropdownData[key].serviceId,
        text: UTIL.removeQuotes(dropdownData[key].serviceCode),
        attributes: [
          { key: 'data-service-funding', value: dropdownData[key].serviceFunding },
          { key: 'data-allowGroupNotes', value: dropdownData[key].allowGroupNotes },
        ],
      };
    });

    billerDropdownData.unshift({ id: '0', value: '', text: '' }); //ADD Blank value
    billerDropdownData.sort(function (a, b) {
      // alphabetize
      if (a.text < b.text) {
        return -1;
      }
      if (a.text > b.text) {
        return 1;
      }
      return 0;
    });

    var defaultVal;

    defaultVal = defaultServiceCode;

    if (rd && rd.mainbillingorservicecodeid) {
      serviceCode = rd.mainbillingorservicecodeid;
      defaultVal = serviceCode;
    } else {
      serviceCode = defaultVal;
    }

    if ($.session.applicationName === 'Advisor') {
      allowGroupNotes = true;
    } else {
      if (pageLoaded === 'review') {
        allowGroupNotes = dropdownData[defaultVal].allowGroupNotes === 'Y' ? true : false;
      }
    }

    dropdown.populate(serviceCodeDropdown, billerDropdownData, defaultVal);
    populateBillerRelatedDropdowns();
    if ($.session.applicationName === 'Gatekeeper') {
      checkGKRequiredFields();
    }
  }
  function populateLocationDrodown() {
    var locations = dropdownData[serviceCode].locations;
    var data = locations.map(loc => {
      return {
        value: loc.locCode,
        text: loc.locName,
      };
    });

    data.unshift({ value: '', text: '' });

    var defaultVal;

    if (rd && rd.locationcode) {
      locationId = rd.locationcode;
      defaultVal = rd.locationcode;
    } else {
      locationId = data[0] && data[0].value ? data[0].value : '';
    }

    dropDownDisplay(data, 'locationDropdwn');

    dropdown.populate(locationDropdown, data, defaultVal);
  }
  function populateServicesDrodown() {
    var services = dropdownData[serviceCode].services;
    var data = services.map(service => {
      return {
        value: service.serviceCode,
        text: service.serviceName,
      };
    });

    data.unshift({ value: '', text: '' });
    var defaultVal;

    if (rd && rd.servicecode) {
      defaultVal = rd.servicecode;
    } else {
      serviceId = data[0] && data[0].value ? data[0].value : '';
    }

    dropDownDisplay(data, 'serviceDropdwn');

    dropdown.populate(serviceDropdown, data, defaultVal);
  }
  function populateContactsDrodown() {
    var contacts = dropdownData[serviceCode].contacts;

    //if contacts.length =

    var data = contacts.map(contact => {
      return {
        value: contact.contactCode,
        text: contact.contactName,
      };
    });
    data.unshift({ value: '', text: '' });
    var defaultVal;

    if (rd && rd.contactcode) {
      defaultVal = rd.contactcode;
    } else {
      contactId = data[0] && data[0].value ? data[0].value : '';
    }

    dropDownDisplay(data, 'contactDropdwn');

    dropdown.populate(contactDropdown, data, defaultVal);
  }
  function populateNeedsDrodown() {
    var needs = dropdownData[serviceCode].needs;
    var data = needs.map(need => {
      return {
        value: need.needCode,
        text: need.needName,
      };
    });
    data.unshift({ value: '', text: '' });
    var defaultVal;

    if (rd && rd.serviceneedcode) {
      defaultVal = rd.serviceneedcode;
    } else {
      needId = data[0] && data[0].value ? data[0].value : '';
    }

    dropDownDisplay(data, 'needDropdwn');

    dropdown.populate(needDropdown, data, defaultVal);
  }

  function dropDownDisplay(data, dropDown) {
    if (data.length > 1) {
      document.getElementById(dropDown).parentElement.style.display = '';
      //$("#needDropdwn").show();
    } else {
      document.getElementById(dropDown).parentElement.style.display = 'none';
      //$("#needDropdwn").hide();
    }
  }

  function populateBillerRelatedDropdowns() {
    // Skip populating dropdowns if biller doesn have a default service code. Breaks things.
    if (serviceCode !== '') {
      if (!rd) {
        locationId = '';
        serviceId = '';
        needId = '';
        contactId = '';
      }
      //Below if statement added from ticket #31039 in 2020.3. It was noticed that if the user
      //had a default service code that was later set as inactive, they would still
      // have this service code associated with them but it would break the module.
      //This sould be a temp fix until there are measures put in place that prevent
      //this in the desktop application.
      if (dropdownData[serviceCode]) {
        populateLocationDrodown();
        populateServicesDrodown();
        populateContactsDrodown();
        populateNeedsDrodown();
      } else {
        serviceCode = '';
        dropdown.populate(serviceCodeDropdown, billerDropdownData);
      }
    }
    if (rd) {
      selectedConsumerIds[0] = rd.consumerid;
      populateVendorDropdown();
      populateServiceLocations();
    }
  }
  function populateVendorDropdown() {
    caseNotesAjax.getConsumerSpecificVendors(
      selectedConsumerIds[0],
      serviceDate,
      function (results) {
        var data = results.map(r => {
          return {
            value: r.vendorId,
            text: r.vendorName,
          };
        });
        //        if ($.session.applicationName === 'Gatekeeper')
        //          data.unshift({ value: '', text: '' }); // add blank value in vendor dropdown for GK only
        var defaultVal;

        if (rd && rd.vendorid) {
          defaultVal = rd.vendorid;
        } else {
          vendorId = data[1] && data[1].value ? data[1].value : '';
          defaultVal = vendorId;
        }

        dropdown.populate(vendorDropdown, data, defaultVal);
      },
    );
  }
  function populateServiceLocations() {
    var serviceLocData = { serviceDate, consumerId: selectedConsumerIds[0] };
    caseNotesAjax.getServiceLocationsForCaseNoteDropDown(serviceLocData, function (results) {
      var data = results.map(r => {
        return {
          value: r.code,
          text: r.caption,
        };
      });
      data.unshift({ value: '', text: '' });
      var defaultVal;

      if (rd && rd.servicelocationid) {
        defaultVal = rd.servicelocationid;
      } else {
        //set to '00' if no val
        serviceLocationId = data[0] && data[0].value ? data[0].value : '00';
      }

      if ($.session.applicationName === 'Advisor')
        dropdown.populate(serviceLocationDropdown, data, defaultVal);
    });
  }

  // Case Note Card
  // ----------------------------------------
  function disableCard() {
    // card disabled until consumers are moved over
    // caseNoteCard.classList.add('disabled');
  }
  function enableCard() {
    caseNoteCard.classList.remove('disabled');
    checkRequiredFields();
  }
  // Consumers
  function buildConsumerCard(clone) {
    var card = document.createElement('div');
    card.classList.add('caseNotes__consumer');
    card.appendChild(clone);
    return card;
  }

  function moveConsumerToConsumerSection() {
    //? This function just adds the consumer(s) visibly to note card

    const consumerList = document.querySelector('.consumers-list');
    let activeConsumers = roster2.getActiveConsumers();
    let newSelectedConsumers = roster2.getSelectedConsumersCache();

    //* NEW
    //*-----------------------------------
    if (pageLoaded === 'new') {
      //Remove the 'no consumer message' when adding a consumer. (only visible on new notes)
      var noConsumerMessage = document.getElementById('noConsumerMessage');
      noConsumerMessage.classList.add('hidden');

      //Will always be just 1 selected consumer for a new note
      const sConsumer = activeConsumers[0];
      //clone and build card for note
      var clone = sConsumer.card.cloneNode(true);
      var card = buildConsumerCard(clone);
      card.classList.remove('highlighted');
      consumerList.appendChild(card);

      //remove consumer on click
      card.addEventListener('click', event => {
        var consumerListBtn = document.querySelector('.consumerListBtn');
        var consumer = event.target.getAttribute('data-consumer-id');
        event.target.parentElement.remove();
        selectedConsumerIds = selectedConsumerIds.filter(item => item !== consumer);
        roster2.removeConsumerFromActiveConsumers(consumer);
        if (selectedConsumerIds.length === 0) {
          if (consumerListBtn) consumerListBtn.classList.remove('disabled');
          populateBillerRelatedDropdowns();
          //re show the message when there are no consumer selected
          if (pageLoaded === 'new') {
            var noConsumerMessage = document.getElementById('noConsumerMessage');
            noConsumerMessage.classList.remove('hidden');
          }
        }
        checkRequiredFields();
        checkConsumerForMileage();
        if (pageLoaded === 'review') {
          if (selectedConsumerIds.length === 1) {
            convertToGroupNote = false;
          }
        }
      });

      selectedConsumerIds.push(sConsumer.id);
      checkConsumerForMileage();
    }

    //* REVIEW
    //*-----------------------------------
    if (pageLoaded === 'review') {
      if (!allowGroupNotes) {
        convertToGroupNote = false;
      } else if (!isGroupNote && allowGroupNotes) {
        convertToGroupNote = true;
      }

      if (allowGroupNotes) {
        activeConsumers.forEach(aConsumer => {
          //check if consumer has already been added to note
          if (selectedConsumerIds.filter(id => id === aConsumer.id).length > 0) return;
          // only add newly selected consumers
          const filteredConsumers = newSelectedConsumers.filter(nsc => {
            const isTrue = nsc.id === aConsumer.id;
            return isTrue;
          });
          if (filteredConsumers.length === 0) {
            return;
          }

          //clone and build card for note
          var clone = aConsumer.card.cloneNode(true);
          var card = buildConsumerCard(clone);
          card.classList.remove('highlighted');
          consumerList.appendChild(card);

          //remove consumer on click
          card.addEventListener('click', event => {
            var consumerListBtn = document.querySelector('.consumerListBtn');
            var consumer = event.target.getAttribute('data-consumer-id');
            event.target.parentElement.remove();
            selectedConsumerIds = selectedConsumerIds.filter(item => item !== consumer);
            roster2.removeConsumerFromActiveConsumers(consumer);
            if (selectedConsumerIds.length === 0) {
              if (consumerListBtn) consumerListBtn.classList.remove('disabled');
              populateBillerRelatedDropdowns();
              //re show the message when there are no consumer selected
              if (pageLoaded === 'new') {
                var noConsumerMessage = document.getElementById('noConsumerMessage');
                noConsumerMessage.classList.remove('hidden');
              }
            }
            checkRequiredFields();
            checkConsumerForMileage();
            if (pageLoaded === 'review') {
              if (selectedConsumerIds.length === 1) {
                convertToGroupNote = false;
              }
            }
          });

          selectedConsumerIds.push(aConsumer.id);
          checkConsumerForMileage();
        });
      } else {
        //* Get currently selected consumer
        let selectedConsumerId = activeConsumers[activeConsumers.length - 1].id;
        const selectedConsumerName = activeConsumers[
          activeConsumers.length - 1
        ].card.innerText.replace(/\s/g, '');
        const consumerNameArr = selectedConsumerName.split(',');
        const consumerFN = consumerNameArr[1];
        const consumerLN = consumerNameArr[0];

        //* Create consumer object (with newly selected consumer)
        let consumerobj = null;
        consumerobj = roster2.buildConsumerCard({
          FN: consumerFN,
          LN: consumerLN,
          id: selectedConsumerId,
        });
        consumerobj.classList.remove('disabled');

        // only one consumer
        consumerId = selectedConsumerId;
        consumerName = `${consumerFN} ${consumerLN}`;

        // reset active/selected consumers
        selectedConsumerIds = [selectedConsumerId];
        roster2.clearActiveConsumers();
        roster2.addConsumerToActiveConsumers(consumerobj);

        // update dom with new name
        var cardHeader = document.querySelector('.card__header');
        cardHeader.innerHTML = `<h3>Note Review - ${consumerName}</h3>`;
      }
    }

    // consumer specific dropdowns
    populateVendorDropdown();
    if ($.session.applicationName === 'Advisor') {
      populateServiceLocations();
    } else {
      checkGKRequiredFields('consumerSelect');
    }
    checkRequiredFields(); //To enable save button if possible
  }
  // Details
  function buildDocTime() {
    var docTimeHeader = document.createElement('div');
    var docTimeHeaderText = document.createElement('h3');
    docTimeHeaderText.innerHTML = 'Doc Time';
    docTimeHeader.appendChild(docTimeHeaderText);
    docTimeHeader.classList.add('card__header');
    var docTimeBody = document.createElement('div');
    docTimeBody.classList.add('card__body');

    var docTime = document.createElement('div');
    docTime.id = 'docTime';
    docTime.classList.add('card');
    docTime.appendChild(docTimeHeader);
    docTime.appendChild(docTimeBody);

    DOM.ACTIONCENTER.appendChild(docTime);

    if (serviceId === '' || serviceId === '0') docTime.classList.add('hidden');

    // if default billing code requires Doc Time, display
    if (defaultServiceCode) {
      if (dropdownData[defaultServiceCode].docTimeRequired === 'Y') {
        docTime.classList.remove('hidden');
        //	POPUP.show(docTimePopup);
      }
    }

    var minutesDisplay = document.createElement('div');
    minutesDisplay.classList.add('inputWrap');

    // start/stop buttons
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap', 'cntimerbuttons');
    timerStartBtn = button.build({
      text: 'Start',
      id: 'cnTimerStart',
      style: 'secondary',
      type: 'contained',
      attributes: [{ key: 'data-toggled', value: 'false' }],
      callback: function () {
        // caseNotesTimer.startCaseNoteTimer();
        if (timerRunning === true) return;
        documentationTimer.startTimer(documentationTime);
        timerRunning = true;
        // if editing toggleSaveButton()
      },
    });
    timerStopBtn = button.build({
      text: 'Stop',
      id: 'cnTimerStop',
      style: 'secondary',
      type: 'outlined',
      callback: function () {
        // pauseTimer();
        if (timerRunning === false) return;
        documentationTime = documentationTimer.stopTimer();
        timerRunning = false;
      },
    });

    //PERMISSIONS// Doc Time minutes field is read only when $.session.UpdateCaseNotesDocTime === false
    var docTimeMinVal = rd
      ? rd.totaldoctime
        ? Math.round(Math.floor(parseInt(rd.totaldoctime) / 30) / 2)
        : 0
      : 0;
    docTimeMinutesField = input.build({
      label: 'Doc Time Minutes',
      id: 'docTimeMinutesDisplay',
      type: 'text',
      attributes: [
        { key: 'min', value: '0' },
        { key: 'maxlength', value: '5' },
        {
          key: 'onkeypress',
          value: 'return event.charCode >= 48 && event.charCode <= 57',
        },
      ],
      readonly: $.session.UpdateCaseNotesDocTime === false ? true : false,
      value: String(docTimeMinVal),
    });

    travelTimeMinutesField = input.build({
      label: 'Travel Time Minutes',
      id: 'travelTimeMinutesDisplay',
      attributes: [
        { key: 'min', value: '0' },
        { key: 'maxlength', value: '4' },
        {
          key: 'onkeypress',
          value: 'return event.charCode >= 48 && event.charCode <= 57',
        },
      ],
      value: rd ? (rd.traveltime ? rd.traveltime : '') : '',
      type: 'text',
    });

    //Time field event listeners (to prevent length that is too long)
    docTimeMinutesField.addEventListener('keyup', event => {
      if (event.target.value.length > 5) {
        event.target.value = event.target.value.substr(0, 5);
      }
    });
    travelTimeMinutesField.addEventListener('keyup', event => {
      if (event.target.value.length > 4) {
        event.target.value = event.target.value.substr(0, 4);
      }
    });

    minutesDisplay.appendChild(docTimeMinutesField);
    minutesDisplay.appendChild(travelTimeMinutesField);
    btnWrap.appendChild(timerStartBtn);
    btnWrap.appendChild(timerStopBtn);

    docTimeBody.appendChild(btnWrap);
    docTimeBody.appendChild(minutesDisplay);

    return docTime;
  }
  function parseSessionTimes(dirtyTime) {
    const isAMorPM = dirtyTime.includes('A') ? 'am' : 'pm';
    let time;

    if (isAMorPM === 'am') {
      time = `${dirtyTime.split('A')[0]} AM`;
    } else {
      time = `${dirtyTime.split('P')[0]} PM`;
    }

    time = UTIL.convertToMilitary(time);
    return time.slice(0, -3);
  }
  function checkTimesAreWithinWorkHours() {
    const warnStart = parseSessionTimes($.session.caseNotesWarningStartTime);
    const warnEnd = parseSessionTimes($.session.caseNotesWarningEndTime);

    if (
      $.session.caseNotesWarningStartTime === '00:00' ||
      $.session.caseNotesWarningEndTime === '00:00' ||
      !$.session.caseNotesWarningStartTime ||
      !$.session.caseNotesWarningEndTime ||
      $.session.caseNotesWarningStartTime === 'Null' ||
      $.session.caseNotesWarningEndTime === 'Null'
    ) {
      return true;
    }

    if (startTime < warnStart || startTime > warnEnd || endTime < warnStart || endTime > warnEnd) {
      return false;
    }

    return true;
  }
  function buildCardDetailsSection() {
    async function saveBtnAction(saveAndNew) {
      function preSave() {
        if ($.session.applicationName === 'Gatekeeper' && timerRunning) {
          documentationTime = documentationTimer.stopTimer();
          timerRunning = false;
        }
        // Stop speech to text if running
        if ($.session.sttEnabled && document.querySelectorAll('.stt_listening').length > 0) {
          const listeningNodes = document.querySelectorAll('.stt_listening');
          listeningNodes.forEach(node => {
            node.dispatchEvent(new Event('click'));
          });
        }
      }

      if (
        (tempAttachmentArray.length > 0 || reviewAttachmentArray.length > 0) &&
        convertToGroupNote
      ) {
        const warningMessage = `Attachments on this case note will be lost by 
        converting this single case note to a group case note.`;
        warningPopup(
          warningMessage,
          async () => {
            saveNoteBtn.classList.add('disabled');
            saveAndNewNoteBtn.classList.add('disabled');
            preSave();
            if ($.session.applicationName === 'Gatekeeper') {
              const hoursAreWithinWorkHours = checkTimesAreWithinWorkHours();
              if (hoursAreWithinWorkHours) {
                await noteSaveUpdate(saveAndNew);
              } else {
                warningPopup(
                  `The times you have entered are outside the current normal working hours.
                  Click OK to proceed or cancel to return to the form.`,
                  async () => {
                    await noteSaveUpdate(saveAndNew);
                  },
                  () => {
                    saveNoteBtn.classList.remove('disabled');
                    saveAndNewNoteBtn.classList.remove('disabled');
                    return;
                  },
                );
              }
            } else {
              await noteSaveUpdate(saveAndNew);
            }
          },
          () => {
            return;
          },
        );
      } else {
        saveNoteBtn.classList.add('disabled');
        saveAndNewNoteBtn.classList.add('disabled');
        preSave();
        if ($.session.applicationName === 'Gatekeeper') {
          const hoursAreWithinWorkHours = checkTimesAreWithinWorkHours();
          if (hoursAreWithinWorkHours) {
            await noteSaveUpdate(saveAndNew);
          } else {
            warningPopup(
              `The times you have entered are outside the current normal working hours.
              Click OK to proceed or cancel to return to the form.`,
              async () => {
                await noteSaveUpdate(saveAndNew);
              },
              () => {
                saveNoteBtn.classList.remove('disabled');
                saveAndNewNoteBtn.classList.remove('disabled');
                return;
              },
            );
          }
        } else {
          await noteSaveUpdate(saveAndNew);
        }
      }
    }
    //----------------------------------------------------------------------

    var details = document.createElement('div');
    details.classList.add('card__body', 'caseNoteCard__details');
    //Group Note info area:
    groupNoteDisplay = document.createElement('div');
    groupNoteDisplay.classList.add('groupNoteDisplay');
    groupNoteDisplay.innerHTML = groupConsumers;

    // dropdowns
    var style = 'secondary';

    isCaseNoteReadOnly();

    serviceCodeDropdown = dropdown.build({
      dropdownId: 'serviceCodeDropdown',
      label: $.session.applicationName === 'Gatekeeper' ? 'Bill Code:' : 'Serv. Code:',
      style,
    });
    // serviceCodeDropdown.id = "serviceCodeDropdown"

    locationDropdown = dropdown.build({
      dropdownId: 'locationDropdwn',
      label: 'Location',
      style: 'secondary',
    });
    serviceDropdown = dropdown.build({
      dropdownId: 'serviceDropdwn',
      label: 'Service',
      style: 'secondary',
    });
    if ($.session.applicationName === 'Advisor') {
      serviceLocationDropdown = dropdown.build({
        label: 'Service Location',
        style,
      });
    }
    needDropdown = dropdown.build({
      dropdownId: 'needDropdwn',
      label: 'Need',
      style: 'secondary',
    });
    vendorDropdown = dropdown.build({
      label: 'Vendor',
      style,
    });
    contactDropdown = dropdown.build({
      dropdownId: 'contactDropdwn',
      label: 'Contact',
      style: 'secondary',
    });
    // inputs
    serviceDateInput = input.build({
      label: 'Service Date',
      type: 'date',
      style,
      value: pageLoaded === 'review' ? serviceDate : UTIL.getTodaysDate(),
      attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
    });
    startTimeInput = input.build({
      label: 'Start Time',
      type: 'time',
      style,
      value: startTime,
    });
    endTimeInput = input.build({
      label: 'End Time',
      type: 'time',
      style,
      value: endTime,
    });
    mileageInput = input.build({
      label: 'Mileage',
      style,
      value: mileage === '0' || mileage === '0.00' ? '' : mileage,
      attributes: [{ key: 'min', value: '0' }],
    });
    myPhrasesBtn = button.build({
      id: 'myPhrasesBtn',
      text: 'My Phrases',
      type: 'contained',
      style,
      callback: function () {
        //pass current note input field value
        cnPhrasesPopup();
      },
    });
    noteTextInput = input.build({
      id: 'noteTextField',
      label: 'Note',
      type: 'textarea',
      style,
      classNames: 'autosize',
      value: noteText,
      stt: $.session.sttEnabled && !cnBatched && $.session.CaseNotesUpdate,
    });
    // checkboxes
    confidentialCheckbox = input.buildCheckbox({
      text: 'Confidential',
      isChecked: confidential === 'Y' ? true : false,
    });
    // btns
    attachmentsBtn = button.build({
      text: `Attachments (${attachmentCount})`,
      style,
      type: 'contained',
      icon: 'attachment',
      callback: () => {
        cnAttachment.init(tempAttachmentArray, reviewAttachmentArray, cnBatched, noteId);
      },
    });
    if (attachmentCount > 0) attachmentsBtn.classList.add('hasAttachments');

    var text = pageLoaded === 'new' ? 'Save' : 'Update';
    saveNoteBtn = button.build({
      text,
      style,
      type: 'contained',
      icon: 'save',
      classNames: ['caseNoteSave', 'disabled'],
      callback: () => saveBtnAction(false),
    });
    saveAndNewNoteBtn = button.build({
      text: 'Save & New',
      style,
      type: 'contained',
      icon: 'add',
      classNames: ['caseNoteSave', 'disabled'],
      callback: () => saveBtnAction(true),
    });
    cancelNoteBtn = button.build({
      text: 'cancel',
      style,
      type: 'outlined',
      icon: 'close',
      classNames: ['caseNoteCancel'],
      callback: function () {
        selectedConsumerIds.forEach(cId => {
          roster2.removeConsumerFromActiveConsumers(cId);
        });
        if (timerRunning === true) {
          documentationTimer.stopTimer();
          timerRunning = false;
        }
        notesOverview.init();
      },
    });
    //DELETE ONLY ON REVIEW NOTE
    deleteNoteBtn = button.build({
      text: 'delete',
      style,
      type: 'contained',
      icon: 'delete',
      classNames: ['caseNoteDelete'],
      callback: deleteConfirmation,
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(saveNoteBtn);
    if (pageLoaded === 'review') {
      saveNoteBtn.classList.remove('disabled');
      btnWrap.appendChild(deleteNoteBtn);
    } else {
      btnWrap.appendChild(saveAndNewNoteBtn);
    }

    const btnWrap2 = document.createElement('div');
    btnWrap2.classList.add('btnWrap');
    btnWrap2.appendChild(cancelNoteBtn);
    //End time on new notes is empty, only add class list of error for this case
    if (pageLoaded === 'new') {
      endTimeInput.classList.add('error');
    }

    // group inputs * for desktop later
    var grid_col_1 = document.createElement('div');
    var grid_col_2 = document.createElement('div');

    // build details section
    grid_col_1.appendChild(serviceCodeDropdown);
    grid_col_1.appendChild(locationDropdown);
    grid_col_1.appendChild(serviceDropdown);
    grid_col_1.appendChild(needDropdown);
    grid_col_1.appendChild(contactDropdown);

    if ($.session.applicationName === 'Advisor') {
      grid_col_1.appendChild(serviceLocationDropdown);
    }
    grid_col_1.appendChild(vendorDropdown);

    grid_col_2.appendChild(serviceDateInput);
    grid_col_2.appendChild(startTimeInput);
    grid_col_2.appendChild(endTimeInput);
    if (!cnBatched) grid_col_2.appendChild(myPhrasesBtn);
    grid_col_2.appendChild(noteTextInput);
    grid_col_2.appendChild(mileageInput);
    if ($.session.applicationName === 'Gatekeeper') grid_col_2.appendChild(attachmentsBtn);
    grid_col_2.appendChild(confidentialCheckbox);

    //Hide Mileage Input if they don't have a bill/service code
    if (serviceId === '' || serviceId === '0') mileageInput.classList.add('hidden');

    if (pageLoaded === 'review') {
      if (groupNoteId !== 0) grid_col_2.appendChild(groupNoteDisplay);
      //Last Updated by message (only on review)
      var lastUpdatedDisplay = document.createElement('div');
      lastUpdatedDisplay.classList.add('lastUpdatedDisplay');
      var lastUpdatedMessage = document.createElement('p');
      lastUpdatedMessage.innerHTML = `
      Last Edited On: ${lastUpdated} <br> Entered By: ${enteredBy} (${originalUserName})<br>`;
      lastUpdatedDisplay.appendChild(lastUpdatedMessage);

      var correctedCheckboxDiv = document.createElement('div');
      correctedCheckboxDiv.classList.add('correctedCheckbox');
      correctedCheckbox = input.buildCheckbox({
        text: 'Corrected',
        isChecked: corrected === 'Y' ? true : false,
      });

      correctedCheckboxDiv.appendChild(correctedCheckbox);

      //Review Required Area//////
      var reviewText;
      switch (reviewResults) {
        case 'N':
          reviewText = 'Not Reviewed';
          break;
        case 'P':
          reviewText = 'Passed';
          break;
        case 'R':
          reviewText = 'Rejected';
          break;
        default:
          reviewText = reviewResults;
          break;
      }

      if (reviewRequired === 'Y' && $.session.applicationName === 'Gatekeeper') {
        var reviewMessage = document.createElement('p');
        reviewMessage.classList.add('reviewMessage');
        reviewMessage.innerHTML = `
        <br>Review Required for this Case Note <br> Review Results: ${reviewText} 
        ${reviewRejectReason === '' ? '' : `<br> Rejection Reason: ${reviewRejectReason}`}`;
        if (reviewResults === 'R') reviewMessage.appendChild(correctedCheckboxDiv);
      }

      ////ADV does not have a rejection reason
      if (reviewRequired === 'Y' && $.session.applicationName === 'Advisor') {
        var reviewMessage = document.createElement('p');
        reviewMessage.classList.add('reviewMessage');
        reviewMessage.innerHTML = `
        <br>Review Required for this Case Note <br> Review Results: ${reviewText}`;
        reviewMessage.appendChild(correctedCheckboxDiv);
      }
    }

    grid_col_2.appendChild(btnWrap);
    grid_col_2.appendChild(btnWrap2);
    details.appendChild(grid_col_1);
    details.appendChild(grid_col_2);
    if (pageLoaded === 'review') {
      grid_col_2.appendChild(lastUpdatedDisplay);
      if (reviewRequired === 'Y') grid_col_2.appendChild(reviewMessage);
    }

    if ($.session.applicationName === 'Gatekeeper') buildDocTime();

    DOM.ACTIONCENTER.appendChild(details);

    populateBillerDropdown();
    //ADV check if the consumer on the note has mileage (after populating dropdowns)
    checkConsumerForMileage();
    setupCardEvents();
    checkServiceFunding();
    if ($.session.applicationName === 'Advisor') {
      checkADVRequiredFields();
    }

    DOM.autosizeTextarea();

    return details;
  }
  function buildConsumersList() {
    var consumerList = document.createElement('div');
    consumerList.classList.add('consumers-list');

    return consumerList;
  }

  function buildCaseNoteCard() {
    caseNoteCard = document.createElement('div');
    caseNoteCard.classList.add('card', 'caseNoteCard');

    var cardHeader = document.createElement('div');
    cardHeader.classList.add('card__header');
    cardHeader.innerHTML =
      pageLoaded === 'new' ? `<h3>New Note</h3>` : `<h3>Note Review - ${consumerName}</h3>`;

    var cardDetails = buildCardDetailsSection();

    // note card
    caseNoteCard.appendChild(cardHeader);
    caseNoteCard.appendChild(cardDetails);

    return caseNoteCard;
  }

  function cnPhrasesPopup() {
    cnInsertPhrases.show(noteTextInput.querySelector('.input-field__input').value);
  }
  function cnPhrasesDone(note) {
    noteText = note;
    checkRequiredFields();
  }

  function docTimeRequiredPopup() {
    if (document.getElementById('docTimeRequiredPopup')) return; // Prevent multiple popups
    docTimePopup = POPUP.build({
      id: 'docTimeRequiredPopup',
    });
    var yesBtn = button.build({
      text: 'yes',
      style: 'secondary',
      type: 'contained',
      id: 'cnTimerStart',
      callback: function () {
        documentationTimer.startTimer(documentationTime);
        timerRunning = true;
        POPUP.hide(docTimePopup);
      },
    });
    var noBtn = button.build({
      text: 'no',
      style: 'secondary',
      type: 'outlined',
      id: 'cnTimerStop',
      callback: function () {
        POPUP.hide(docTimePopup);
      },
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    var popupText = document.createElement('p');
    popupText.innerHTML =
      'Documentation Time is allowed for this bill code. Would you like to start the timer now?';
    docTimePopup.appendChild(popupText);
    docTimePopup.appendChild(btnWrap);
    POPUP.show(docTimePopup);
  }

  function checkADVRequiredFields(calledAction) {
    var serviceCodeDropdownOptions = document.getElementById('serviceCodeDropdown');
    serviceCode =
      serviceCodeDropdownOptions.options[serviceCodeDropdownOptions.selectedIndex].value;
    if (serviceCode === '') {
      serviceCodeDropdown.classList.add('error');
      checkRequiredFields();
      return;
    } else serviceCodeDropdown.classList.remove('error');
    advLocationRequired = dropdownData[serviceCode].locationRequired;
    advNeedRequired = dropdownData[serviceCode].needRequired;
    advContactRequired = dropdownData[serviceCode].contactRequired;
    advServiceRequired = dropdownData[serviceCode].serviceRequired;

    var locations = dropdownData[serviceCode].locations;
    if (advLocationRequired === 'Y' && locations.length === 0) {
      locationDropdown.classList.remove('error');
    } else if (advLocationRequired === 'Y' && (locationId === '' || locationId === '0')) {
      locationDropdown.classList.add('error');
    } else locationDropdown.classList.remove('error');

    var needs = dropdownData[serviceCode].needs;
    if (advNeedRequired === 'Y' && needs.length === 0) {
      needDropdown.classList.remove('error');
    } else if (advNeedRequired === 'Y' && (needId === '' || needId === '0')) {
      needDropdown.classList.add('error');
    } else needDropdown.classList.remove('error');

    var contacts = dropdownData[serviceCode].contacts;
    if (advContactRequired === 'Y' && contacts.length === 0) {
      contactDropdown.classList.remove('error');
    } else if (advContactRequired === 'Y' && (contactId === '' || contactId === '0')) {
      contactDropdown.classList.add('error');
    } else contactDropdown.classList.remove('error');

    var services = dropdownData[serviceCode].services;
    if (advServiceRequired === 'Y' && services.length === 0) {
      serviceDropdown.classList.remove('error');
    } else if (advServiceRequired === 'Y' && (serviceId === '' || serviceId === '0')) {
      serviceDropdown.classList.add('error');
    } else serviceDropdown.classList.remove('error');

    //ADV Service Code Not Null
    if ($.session.applicationName === 'Advisor' && (serviceId === '' || serviceId === '0')) {
      serviceCodeDropdown.classList.add('error');
    }

    checkRequiredFields();
  }

  function checkGKRequiredFields(calledAction) {
    var serviceCodeDropdownOptions = document.getElementById('serviceCodeDropdown');
    var consumerListBtn = document.querySelector('.consumerListBtn');
    var docTimeDisplay = document.getElementById('docTime');
    var timerButtons = document.querySelector('.cntimerbuttons');
    var docTimeMinutesField = document.getElementById('docTimeMinutesDisplay');
    var travelTimeMinutesField = document.getElementById('travelTimeMinutesDisplay');
    serviceCode =
      serviceCodeDropdownOptions.options[serviceCodeDropdownOptions.selectedIndex].value;
    if (serviceCode === '') {
      serviceCodeDropdown.classList.add('error');
      checkRequiredFields();
      return;
    } else serviceCodeDropdown.classList.remove('error');
    var docTimeRequired = dropdownData[serviceCode].docTimeRequired;
    var travelTimeRequired = dropdownData[serviceCode].travelTimeRequired;
    gkLocationRequired = dropdownData[serviceCode].locationRequired;
    gkNeedRequired = dropdownData[serviceCode].needRequired;
    gkContactRequired = dropdownData[serviceCode].contactRequired;
    gkAllowGroupNotes = dropdownData[serviceCode].allowGroupNotes;
    gkServiceRequired = dropdownData[serviceCode].serviceRequired;
    gkMileageRequired = dropdownData[serviceCode].mileageRequired;

    //As per original specs No groups where DOC Time is allowed
    if (docTimeRequired === 'Y') gkAllowGroupNotes = 'N';

    //DOCTIME//
    //1) if doc time, or travel time are required, display doc time area.
    if (docTimeRequired === 'Y' || travelTimeRequired === 'Y') {
      docTimeDisplay.classList.remove('hidden');
    } else docTimeDisplay.classList.add('hidden');
    //2) if doc time required show a popup
    //Added calledAction to bypass calling docTimePopup when selecting consumers, only on changing bill codes
    //Also no popup if CN is Batched
    if (
      docTimeRequired === 'Y' &&
      calledAction !== 'consumerSelect' &&
      (cnBatched === '' || cnBatched === null)
    ) {
      //popup doctime required popup
      if (!isReadOnly) docTimeRequiredPopup();
    }
    switch (docTimeRequired) {
      case 'Y':
        docTimeMinutesField.parentElement.classList.remove('hidden');
        timerButtons.classList.remove('hidden');
        break;
      default:
        docTimeMinutesField.parentElement.classList.add('hidden');
        timerButtons.classList.add('hidden');
        docTimeMinutesField.value = '0';
        documentationTimer.stopTimer();
        timerRunning = false;
        documentationTime = '';
        break;
    }
    switch (travelTimeRequired) {
      case 'Y':
        travelTimeMinutesField.parentElement.classList.remove('hidden');
        break;
      default:
        travelTimeMinutesField.parentElement.classList.add('hidden');
        travelTimeMinutesField.value = '0';
        travelTime = '';
        break;
    }
    switch (gkMileageRequired) {
      case 'Y':
        mileageInput.classList.remove('hidden');
        break;
      default:
        mileageInput.classList.add('hidden');
        mileageInput.value = '';
        mileage = '';
        break;
    }

    ////////////////////////////////////

    var locations = dropdownData[serviceCode].locations;
    if (gkLocationRequired === 'Y' && locations.length === 0) {
      locationDropdown.classList.remove('error');
    } else if (gkLocationRequired === 'Y' && (locationId === '' || locationId === '0')) {
      locationDropdown.classList.add('error');
    } else locationDropdown.classList.remove('error');

    var needs = dropdownData[serviceCode].needs;
    if (gkNeedRequired === 'Y' && needs.length === 0) {
      needDropdown.classList.remove('error');
    } else if (gkNeedRequired === 'Y' && (needId === '' || needId === '0')) {
      needDropdown.classList.add('error');
    } else needDropdown.classList.remove('error');

    var contacts = dropdownData[serviceCode].contacts;
    if (gkContactRequired === 'Y' && contacts.length === 0) {
      contactDropdown.classList.remove('error');
    } else if (gkContactRequired === 'Y' && (contactId === '' || contactId === '0')) {
      contactDropdown.classList.add('error');
    } else contactDropdown.classList.remove('error');

    var services = dropdownData[serviceCode].services;
    if (gkServiceRequired === 'Y' && services.length === 0) {
      serviceDropdown.classList.remove('error');
    } else if (gkServiceRequired === 'Y' && (serviceId === '' || serviceId === '0')) {
      serviceDropdown.classList.add('error');
    } else serviceDropdown.classList.remove('error');

    //Mileage
    if (gkMileageRequired === 'Y') {
      mileageInput.classList.remove('hidden');
    } else {
      mileageInput.value = '';
      mileageInput.classList.add('hidden');
    }
    //ADV Service Code Not Null
    if ($.session.applicationName === 'Advisor' && (serviceId === '' || serviceId === '0')) {
      serviceCodeDropdown.classList.add('error');
    }

    // ALLOW GROUP NOTES// if they have a group note made up, but change to billing code that doesn't allow group notes
    // reset all consumers from note - They will need to re-add a consumer// As per Angie allowGroupNotes === "" should allow group notes
    if (gkAllowGroupNotes === 'N') {
      switch (pageLoaded) {
        case 'review':
          if (selectedConsumerIds.length > 1) {
            if (docTimePopup) POPUP.hide(docTimePopup);
            removeAllConsumersFromNote();
            if (consumerListBtn) consumerListBtn.classList.remove('disabled');
          }
          break;
        case 'new':
          if (selectedConsumerIds.length === 1) {
          } else if (selectedConsumerIds.length > 1) {
            removeAllConsumersFromNote();
          }
          break;
        default:
          break;
      }
    } else {
      if (consumerListBtn) consumerListBtn.classList.remove('disabled');
    }
    checkRequiredFields();
  }

  function setupCardEvents() {
    var tmpMileage;
    // dropdowns
    serviceCodeDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      allowGroupNotes = event.target.dataset.allowGroupNotes;
      serviceCode = selectedOption.value;
      // when this changes update following dropdowns
      populateBillerRelatedDropdowns();
      // reset biller related dropdown values when changing service/bill code:
      locationId = '';
      serviceId = '';
      needId = '';
      contactId = '';
      locationDropdown.firstElementChild.selectedIndex = 0;
      serviceDropdown.firstElementChild.selectedIndex = 0;
      needDropdown.firstElementChild.selectedIndex = 0;
      contactDropdown.firstElementChild.selectedIndex = 0;
      checkServiceFunding();
      checkRequiredFields();
      if ($.session.applicationName === 'Gatekeeper') {
        checkGKRequiredFields();
      }
      if ($.session.applicationName === 'Advisor') {
        checkADVRequiredFields();
      }
    });
    locationDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      locationId = selectedOption.value;
      //GK REQUIRED FIELDS//
      //if ($.session.applicationName === 'Gatekeeper' && gkLocationRequired === 'Y') {
      if (advLocationRequired === 'Y' || gkLocationRequired === 'Y') {
        if (locationId === '') {
          locationDropdown.classList.add('error');
        } else locationDropdown.classList.remove('error');
        checkRequiredFields();
      }
      /////
    });
    serviceDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      serviceId = selectedOption.value;
      //GK REQUIRED FIELDS//
      if (advServiceRequired === 'Y' || gkServiceRequired === 'Y') {
        if (serviceId === '') {
          serviceDropdown.classList.add('error');
        } else serviceDropdown.classList.remove('error');
        checkRequiredFields();
      }
      /////
    });
    if ($.session.applicationName === 'Advisor') {
      serviceLocationDropdown.addEventListener('change', event => {
        var selectedOption = event.target.options[event.target.selectedIndex];
        serviceLocationId = selectedOption.value;
        if (serviceLocationId !== '') {
          serviceLocationDropdown.classList.remove('error');
        } else serviceLocationDropdown.classList.add('error');
        checkRequiredFields();
      });
    }
    needDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      needId = selectedOption.value;
      //GK REQUIRED FIELDS//
      if (advNeedRequired === 'Y' || gkNeedRequired === 'Y') {
        if (needId === '') {
          needDropdown.classList.add('error');
        } else needDropdown.classList.remove('error');
        checkRequiredFields();
      }
      /////
    });
    vendorDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      vendorId = selectedOption.value;
    });
    contactDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      contactId = selectedOption.value;
      //GK REQUIRED FIELDS//
      if (advContactRequired === 'Y' || gkContactRequired === 'Y') {
        if (contactId === '') {
          contactDropdown.classList.add('error');
        } else contactDropdown.classList.remove('error');
        checkRequiredFields();
      }
      /////
    });
    // setup input events
    serviceDateInput.addEventListener('change', event => {
      var validObj = validateTimesWhenDateChange();
      var sameDate = checkIfSameDates();

      var tempServiceDate = serviceDate;
      var currentTime = UTIL.getCurrentTime();

      if (validObj.isValid && sameDate) {
        $.session.caseNoteTimeCheck = 'pass';
      } else {
        $.session.caseNoteTimeCheck = 'fail';
      }

      serviceDate = event.target.value;
      if (serviceDate > UTIL.getTodaysDate() || serviceDate === '') {
        serviceDateInput.classList.add('error');
        serviceDate = tempServiceDate;
      } else serviceDateInput.classList.remove('error');

      if (sameDate && currentTime < startTime) {
        validObj.startTime = false;
      }
      if (sameDate && currentTime < endTime) {
        validObj.endTime = false;
      }

      if (validObj.isValid) {
        startTimeInput.classList.remove('error');
        endTimeInput.classList.remove('error');
      } else {
        if (!validObj.startTime) startTimeInput.classList.add('error');
        if (!validObj.endTime) endTimeInput.classList.add('error');
      }

      populateVendorDropdown(); // Vendor is based off of date

      // toggleSaveButton
      checkRequiredFields();
    });
    startTimeInput.addEventListener('change', event => {
      var isValid = validateStartEndTimes('startCheck');
      startTime = event.target.value;
      if (!isValid) {
        saveNoteBtn.classList.add('disabled');
        saveAndNewNoteBtn.classList.add('disabled');
        startTimeInput.classList.add('error');
        return;
      } else {
        startTimeInput.classList.remove('error');
        if (validateStartEndTimes('endCheck')) {
          endTimeInput.classList.remove('error');
        }
      }
      // toggleSaveButton
      checkRequiredFields();
    });

    endTimeInput.addEventListener('change', event => {
      var isValid = validateStartEndTimes('endCheck');
      endTime = event.target.value;
      // toggleSaveButton
      if (!isValid) {
        // show error
        endTimeInput.classList.add('error');
        saveNoteBtn.classList.add('disabled');
        saveAndNewNoteBtn.classList.add('disabled');
        return;
      } else {
        endTimeInput.classList.remove('error');
        if (validateStartEndTimes('startCheck')) {
          startTimeInput.classList.remove('error');
        }
      }
      checkRequiredFields();
    });

    mileageInput.addEventListener('keypress', event => {
      //In GK milage is stored to the hundredth so need to check for decimal
      tmpMileage = event.target.value;
      if (event.key === '.' && event.target.value.indexOf('.') !== -1) {
        // event.target.value = event.target.value.substr(0, (event.target.value.length - 1))
        event.preventDefault();
        return;
      }

      //Prevent all but numbers and dec - DEC is only for GK
      if ($.session.applicationName === 'Gatekeeper') {
        if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode !== 46) {
          event.preventDefault();
          return;
        }
      } else {
        if (event.keyCode < 48 || event.keyCode > 57) {
          event.preventDefault();
          return;
        }
      }
    });
    if ($.session.applicationName === 'Advisor') {
      //ADV Mileage 10 numbers no dec point
      mileageInput.addEventListener('keyup', event => {
        if (event.target.value.length > 10) event.target.value = tmpMileage;
        mileage = event.target.value;
      });
    }

    if ($.session.applicationName === 'Gatekeeper') {
      //GK Mileage can have dec point. 5 before dec and 2 after dec point (12345.67)
      mileageInput.addEventListener('keyup', event => {
        var splitTime = event.target.value.split('.');
        if (splitTime[0].length > 5) event.target.value = tmpMileage;
        if (splitTime[1] && splitTime[1].length > 2) event.target.value = tmpMileage;

        mileage = parseFloat(event.target.value).toFixed(2);
      });

      docTimeMinutesField.addEventListener('change', event => {
        documentationTime = parseInt(event.target.value) * 60; //Stored as seconds in DB
      });
      travelTimeMinutesField.addEventListener('change', event => {
        travelTime = event.target.value; //Stored as Minutes in DB
      });
    }
    noteTextInput.addEventListener('input', event => {
      noteText = event.target.value;
      checkRequiredFields();
    });
    // checkboxes
    confidentialCheckbox.addEventListener('change', event => {
      confidential = event.target.checked ? 'Y' : 'N';
    });
    if (pageLoaded === 'review' && reviewRequired === 'Y' && reviewResults === 'R') {
      correctedCheckbox.addEventListener('change', event => {
        corrected = event.target.checked ? 'Y' : 'N';
      });
    }
  }
  // required fields/permissions
  function checkRequiredFields() {
    var serviceCodeDropdownOptions = document.getElementById('serviceCodeDropdown');
    serviceCode =
      serviceCodeDropdownOptions.options[serviceCodeDropdownOptions.selectedIndex].value;

    var noteInput = noteTextInput.querySelector('textarea');
    var consumers = document.querySelectorAll('.consumer-selected');

    if (noteInput.value === '') {
      noteTextInput.classList.add('error');
    } else {
      noteTextInput.classList.remove('error');
    }

    if (serviceCode === '') {
      serviceCodeDropdown.classList.add('error');
    } else {
      serviceCodeDropdown.classList.remove('error');
    }

    if (selectedConsumerIds.length > 1) {
      attachmentsBtn.classList.add('disabled');
      tempAttachmentArray = [];
    } else {
      attachmentsBtn.classList.remove('disabled');
    }

    var errors = document.querySelectorAll('.error');
    if (errors.length > 0) {
      saveNoteBtn.classList.add('disabled');
      saveAndNewNoteBtn.classList.add('disabled');
    } else if (selectedConsumerIds.length > 0 || pageLoaded === 'review') {
      saveNoteBtn.classList.remove('disabled');
      saveAndNewNoteBtn.classList.remove('disabled');
    } else {
      saveNoteBtn.classList.add('disabled');
      saveAndNewNoteBtn.classList.add('disabled');
    }

    if (isReadOnly) {
      saveNoteBtn.classList.add('disabled');
      saveAndNewNoteBtn.classList.add('disabled');
      deleteNoteBtn.classList.add('disabled');
    }
  }

  function checkConsumerForMileage() {
    if ($.session.applicationName === 'Gatekeeper') return;
    var mileageAllowed = false;
    consumersThatCanHaveMileage.forEach(c => {
      selectedConsumerIds.forEach(cId => {
        if (c === cId) {
          mileageAllowed = true;
        }
      });
    });
    switch (mileageAllowed) {
      case true:
        mileageInput.classList.remove('hidden');
        break;

      default:
        mileageInput.classList.add('hidden');
        mileage = '';
        break;
    }
  }

  function getTimeFromInactivity(time) {
    timerRunning = false;
    documentationTime = time;
  }

  function removeAllConsumersFromNote() {
    var cards = document.querySelectorAll('.consumerCard');
    cards.forEach(card => {
      var cId = card.getAttribute('data-consumer-id');
      selectedConsumerIds = selectedConsumerIds.filter(item => item !== cId);
      card.parentElement.remove();
      roster2.removeConsumerFromActiveConsumers(cId);
    });
    populateBillerRelatedDropdowns();
    warningPopup(
      'You have selected a bill code that does not allow group notes. Please select only one consumer.',
      null,
      null,
      false,
    );
  }

  function deleteConfirmation() {
    var popup = POPUP.build({
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
        POPUP.hide(popup);
        if (timerRunning) {
          documentationTimer.stopTimer();
          timerRunning = false;
        }
        pendingSave.show('Deleting Note...');
        await caseNotesAjax.deleteExistingCaseNote(noteId);
        pendingSave.fulfill('Deleted');
        setTimeout(function () {
          successfulSave.hide();
          notesOverview.init();
        }, 1000);
      },
    });
    var noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      icon: 'close',
      callback: function () {
        POPUP.hide(popup);
      },
    });
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = 'Are you sure you would like to delete this case note?';
    popup.appendChild(warningMessage);
    popup.appendChild(btnWrap);
    POPUP.show(popup);
  }

  async function singleNoteToGroupNote() {
    await caseNotesAjax.deleteExistingCaseNote(noteId);
    pageLoaded = 'new';
    isGroupNote = true;
    noteId = 0;
    convertToGroupNote = null;
    //fix shit
    if (travelTime === null) travelTime = 0;
    if (documentationTime === null) documentationTime = 0;
    endTime = endTime.substring(0, 5);
    startTime = startTime.substring(0, 5);
  }

  function setGroupData() {
    //remove consumers from active list if they are part of the group
    groupConsumers = 'Other consumers part of this group ';
    for (let [id, name] of Object.entries(groupData[groupNoteId])) {
      var splitName = name.split(',');
      var consumer = roster2.buildConsumerCard({
        FN: splitName[1],
        LN: splitName[0],
        id: id,
      });
      roster2.addConsumerToActiveConsumers(consumer);
      if (id !== consumerId) groupConsumers += ` | ${name} `;
    }
  }

  function setPermissions() {
    //caseNotesUpdate === True means they have view only permisison
    //Can't create new notes or update/delete notes.
    //Here View Only is the oppsite of update (update = true so viewonly = false)
    viewOnly = !$.session.CaseNotesUpdate;
    // IF view only permisisons OR the note is batched (batched notes are read only). A batched case note has the batched ID in cnBatched
    //if cnBatched is not "" it IS batched -- CHECKING IF IT IS BATCHED  -- IF NOT EMPTY, THEN IT IS BATCHED
    if (viewOnly || (cnBatched && cnBatched !== '')) setInputstoReadOnly();

    // in GK Anywhere, if case note is NOT batched, then check that user has the Case Notes Update Entered permission
    // CHECKING IF IT IS NOT BATCHED -- EMPTY STRING IS NOT BATCHED
    if ($.session.applicationName === 'Gatekeeper' && (!cnBatched || cnBatched === '')) {
      if ($.session.CaseNotesUpdate) {
        if (
          !$.session.CaseNotesUpdateEntered ||
          ($.session.CaseNotesUpdateEntered && caseManagerId === $.session.PeopleId)
        ) {
          isReadOnly = false; //can edit (correct alignment of Update and UpdateEntered Case Notes permissions)
        } else {
          isReadOnly = true; //can not edit (with UpdateEntered permission, can't edit other people's case notes)
        }
      } else {
        isReadOnly = true; //can not edit (no overall update permission)
      }
    }

    if (isReadOnly) setInputstoReadOnly();

    //Set Permissions is the last thing that gets called. Adding Dashboard New CN Events here.
    if (fromDashboard) {
      moveConsumerToConsumerSection(dashboardConsumer);
    }
  }

  function setInputstoReadOnly() {
    //Set inputs to read only
    serviceDateInput.querySelector('.input-field__input').setAttribute('readonly', true);
    startTimeInput.querySelector('.input-field__input').setAttribute('readonly', true);
    endTimeInput.querySelector('.input-field__input').setAttribute('readonly', true);
    noteTextInput.querySelector('.input-field__input').setAttribute('readonly', true);
    mileageInput.querySelector('.input-field__input').setAttribute('readonly', true);
    //Disable Dropdowns/Checkbox
    serviceCodeDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    locationDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    serviceDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    if (serviceLocationDropdown)
      serviceLocationDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    needDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    vendorDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    contactDropdown.querySelector('.dropdown__select').setAttribute('disabled', true);
    confidentialCheckbox.firstChild.setAttribute('disabled', true);

    if (docTimeMinutesField)
      docTimeMinutesField.querySelector('.input-field__input').setAttribute('readonly', true);
    if (travelTimeMinutesField)
      travelTimeMinutesField.querySelector('.input-field__input').setAttribute('readonly', true);
    //Remove delete and save buttons
    deleteNoteBtn.remove();
    saveNoteBtn.remove();
    //Remove Start and Stop Doc time buttons
    if (timerStopBtn) timerStopBtn.remove();
    if (timerStartBtn) timerStartBtn.remove();
    //disable consumer list button
    var consumerListBtn = document.querySelector('.consumerListBtn');
    if (consumerListBtn) {
      consumerListBtn.classList.add('disabled');
    }
  }

  function addAttachmentsToCN(attachments, reviewAttachments) {
    reviewAttachmentArray = reviewAttachments;
    attachments.forEach(attachment => {
      tempAttachmentArray.push(attachment);
    });
    attachmentCount = tempAttachmentArray.length + reviewAttachmentArray.length;
    attachmentsBtn.getElementsByTagName('span')[0].innerText = `ATTACHMENTS (${attachmentCount})`;
    if (attachmentCount > 0) {
      attachmentsBtn.classList.add('hasAttachments');
    } else attachmentsBtn.classList.remove('hasAttachments');
  }

  function removeAttachmentFromTempAttachmentArray(attachmentName) {
    tempAttachmentArray = tempAttachmentArray.filter(
      attachment => attachment.description !== attachmentName,
    );
  }

  function checkConfidential() {
    if (confidential === 'Y' && caseManagerId !== $.session.PeopleId) {
      noteTextInput.querySelector('.input-field__input').value = 'This is a confidential note.';
      noteTextInput.querySelector('.input-field__input').setAttribute('readonly', true);
      confidentialCheckbox.firstChild.setAttribute('disabled', true);
    }
  }

  function clearAllGlobalVariables() {
    mileage = null;
    reviewRequired = null;
    confidential = null;
    corrected = null;
    cnBatched = null;
    tempAttachmentArray = [];
    reviewAttachmentArray = [];
  }

  function loadPage(dashConsumer) {
    const advPromises = [];
    const gkPromises = [];
    const dropdownDataPromise = new Promise(function (resolve, reject) {
      caseNotesAjax.getDropdownData(function (dropdownData) {
        dealWithDropdownDataHugeString(dropdownData);
        resolve('success');
      });
    });
    advPromises.push(dropdownDataPromise);
    gkPromises.push(dropdownDataPromise);

    const getBillersListPromise = new Promise(function (resolve, reject) {
      caseNotesAjax.getBillersListForDropDown(function (results) {
        billers = results;
        resolve('success');
      });
    });
    advPromises.push(getBillersListPromise);
    gkPromises.push(getBillersListPromise);

    //ADV Only
    if ($.session.applicationName === 'Advisor') {
      const getConsumersThatCanHaveMileagePromise = new Promise(function (resolve, reject) {
        caseNotesAjax.getConsumersThatCanHaveMileage(function (results) {
          consumersThatCanHaveMileage = [];
          results.forEach(c => {
            consumersThatCanHaveMileage.push(c.consumerid);
          });
          resolve('success');
        });
      });
      advPromises.push(getConsumersThatCanHaveMileagePromise);
    }

    const getReviewRequiredForCaseManagerPromise = new Promise(function (resolve, reject) {
      caseNotesAjax.getReviewRequiredForCaseManager($.session.PeopleId, function (results) {
        reviewRequired = results[0].reviewrequired === '' ? 'N' : results[0].reviewrequired;
        defaultServiceCode = results[0].serviceid;
        resolve('success');
      });
    });
    advPromises.push(getReviewRequiredForCaseManagerPromise);
    gkPromises.push(getReviewRequiredForCaseManagerPromise);

    //GK Only - review only
    if ($.session.applicationName === 'Gatekeeper' && pageLoaded === 'review') {
      const getAttachmentsPromise = new Promise(function (resolve, reject) {
        caseNotesAjax.getCaseNoteAttachmentsList(noteId, res => {
          reviewAttachmentArray = res;
          attachmentCount = reviewAttachmentArray.length;
          resolve('success');
        });
      });
      gkPromises.push(getAttachmentsPromise);
    }

    if ($.session.applicationName === 'Advisor') {
      Promise.all(advPromises).then(function () {
        if (pageLoaded === 'new') {
          if (dashConsumer) {
            const consumerName = dashConsumer.name.split(',');
            const consumer = roster2.buildConsumerCard({
              FN: consumerName[1],
              LN: consumerName[0],
              id: dashConsumer.id,
            });
            roster2.addConsumerToActiveConsumers(consumer);
            dashboardConsumer = roster2.getActiveConsumers();
            newNote.init(dashConsumer);
            return;
          } else {
            newNote.init();
            return;
          }
        }
        if (pageLoaded === 'review') {
          if (groupNoteId !== 0) {
            setGroupData(); //Group Note
          } else {
            //Add current consumer to roster active list so they can not be re-selected
            var splitName = rd.consumername.split(' ');
            // roster2.refreshRosterList()
            var consumer = roster2.buildConsumerCard({
              FN: splitName[0],
              LN: splitName[1],
              id: consumerId,
            });
            roster2.addConsumerToActiveConsumers(consumer);
          }
          reviewNote.init();
          return;
        }
      });
    } else {
      Promise.all(gkPromises).then(function () {
        if (pageLoaded === 'new') {
          if (dashConsumer) {
            const consumerName = dashConsumer.name.split(',');
            const consumer = roster2.buildConsumerCard({
              FN: consumerName[1],
              LN: consumerName[0],
              id: dashConsumer.id,
            });
            roster2.addConsumerToActiveConsumers(consumer);
            dashboardConsumer = roster2.getActiveConsumers();
            newNote.init(dashConsumer);
            return;
          } else {
            newNote.init();
            return;
          }
        }
        if (pageLoaded === 'review') {
          if (groupNoteId !== 0) {
            setGroupData(); //Group Note
          } else {
            //Add current consumer to roster active list so they can not be re-selected
            var splitName = rd.consumername.split(' ');
            var consumer = roster2.buildConsumerCard({
              FN: splitName[0],
              LN: splitName[1],
              id: consumerId,
            });
            roster2.addConsumerToActiveConsumers(consumer);
          }
          reviewNote.init();
          return;
        }
      });
    }
  }
  /**
   * GEN init func
   * @param {string} pageToLoad 'new' or 'review'
   * @param {[object]} reviewNoteData used when page to load = review
   * @param {*} gd used when paget to load = review
   * @param {object} consumerFromDash used when loading a new note from the dashboard
   */
  function init(pageToLoad, reviewNoteData, gd, consumerFromDash) {
    if (consumerFromDash) {
      fromDashboard = true;
    } else fromDashboard = false;
    selectedConsumerIds.forEach(cId => {
      roster2.removeConsumerFromActiveConsumers(cId);
    });
    //Below removes users from the group from the active list
    if (groupData && groupNoteId !== 0) {
      for (let [id, name] of Object.entries(groupData[groupNoteId])) {
        roster2.removeConsumerFromActiveConsumers(id);
      }
    }
    consumerListBtn = document.querySelector('.consumerListBtn');
    if (consumerListBtn) consumerListBtn.classList.remove('disabled');
    groupData = gd;
    rd = null;
    mileage = null;
    reviewRequired = null;
    confidential = null;
    corrected = null;
    cnBatched = null;
    travelTime = 0;
    timerRunning = false;
    documentationTime = 0;
    selectedConsumerIds = [];
    tempAttachmentArray = [];
    reviewAttachmentArray = [];
    attachmentCount = 0;
    pageLoaded = pageToLoad;
    setNoteValues(reviewNoteData);
    loadPage(consumerFromDash);
  }

  return {
    checkRequiredFields,
    // build
    buildCaseNoteCard,
    buildConsumersList,
    buildDocTime,
    // populate
    populateBillerDropdown,
    // other
    disableCard,
    enableCard,
    moveConsumerToConsumerSection,
    checkGKRequiredFields,
    checkConfidential,
    checkIfBatched,
    checkIfCredit,
    getTimeFromInactivity,
    // Phrases
    cnPhrasesDone,
    //permissions
    setPermissions,
    //RESET VALS
    clearAllGlobalVariables,
    //ATTACHMENTS
    addAttachmentsToCN,
    removeAttachmentFromTempAttachmentArray,
    //Dropdown Data for Overview Filter
    dealWithDropdownDataHugeString,
    // init
    init,
  };
})();
