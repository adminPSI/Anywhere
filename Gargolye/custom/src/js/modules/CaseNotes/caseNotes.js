//! QUESTIONS FOR JOSH
//1. do we want to update the roster list of consumers on date change? ***MAYBE
//2. how do we want to handle ssa notes, toggle button? ***DON'T KNOW YET
//3. with new validations do we want to upate error messages to success messages or just remove them?

//? Thoughts
//1. checkbox to toggle between seing only yours vs everyones notes in overview
//2. list vs card view for overview on mobile?

//TODO: NO GROUP NOTES IF DOC TIME IS ALLOWED
//TODO: if GK save attachments after note save
//TODO: preSave() stops timer and speech to text
//TODO: make sure im clearing out selected consumer on module leave/form submit

const CaseNotes = (() => {
  // SESSION DATA
  //--------------------------
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
  let caseManagerId;
  let isNewNote = true;
  // attachments
  let attachmentsForSave = {};
  let attachmentCountForIDs = 0;
  // phrases
  let showAllPhrases;
  // group notes
  let allowGroupNotes = false;
  let isGroupNote = false;
  // timers
  let isDocTimeRequired;
  let isTravelTimeRequired;

  // FETCH DATA
  //--------------------------
  let dropdownData;
  let billerDropdownData = [];
  let vendorDropdownData = [];
  let serviceLocationDropdownData = [];
  let caseManagerReview;
  let consumersThatCanHaveMileage;
  let attachmentList;

  // DOM
  //--------------------------
  let moduleWrap;
  let cnFormWrap;

  // UI INSTANCES
  //--------------------------
  let dateNavigation;
  let rosterPicker;
  let cnForm;
  let cnOverview;
  let cnInsertPhrases;

  function resetModule() {
    selectedConsumers = [];
    selectedDate = null;
    selectedServiceCode;
    caseManagerId = undefined;
    isNewNote = true;
    attachmentCountForIDs = 0;
    showAllPhrases = undefined;
    allowGroupNotes = false;
    isGroupNote = false;
    isDocTimeRequired = undefined;
    isTravelTimeRequired = undefined;
    dropdownData = undefined;
    billerDropdownData = [];
    vendorDropdownData = [];
    serviceLocationDropdownData = [];
    caseManagerReview = undefined;
    consumersThatCanHaveMileage = undefined;
    attachmentList = undefined;
    moduleWrap = undefined;
    cnFormWrap = undefined;
    dateNavigation = undefined;
    rosterPicker = undefined;
    cnForm = undefined;
    cnOverview = undefined;
    cnInsertPhrases = undefined;
  }

  // UTILS
  //--------------------------------------------------
  function isReadOnly(credit) {
    // isReadyonly does same thing as checkIfCredit
    // credit comes from review data
    return credit === 'Y' || credit === '-1' ? true : false;
  }
  function isNoteConfidential() {
    // old function = checkConfidential
  }
  function setPermissions() {
    const viewOnly = $.session.CaseNotesUpdate ? false : true;

    //TODO: check if case note is batched | *ONLY FOR REVIEW*
    // batched notes are readonly, if batched status === '' it is NOT BATCHED

    //! GK ONLY
    //? If note is batched then we shouldn't hit this if bc note is read only
    if ($.session.applicationName === 'Gatekeeper') {
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
  }
  function setDefaultSelectedDate() {
    const today = dates.getTodaysDateObj();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  function isTimePastOrPresent(dirtyTime) {
    const currentDate = new Date();
    const selectedDateClone = new Date(selectedDate);

    //If selectedDate is not today then time dosen't matter
    if (currentDate.setHours(0, 0, 0, 0) === selectedDateClone.setHours(0, 0, 0, 0)) {
      return true;
    }

    // CHECKS IF TIME IS IN FURUTRE
    dirtyTime = dirtyTime.split(':');
    selectedDateClone.setHours(dirtyTime[0], dirtyTime[1], 0, 0);
    return dates.isAfter(selectedDateClone, currentDate);
  }
  function isStartTimeBeforeEndTime(startTime, endTime) {
    if (!startTime || !endTime) return true;

    return startTime < endTime ? true : false;
  }
  function parseSessionTime(dirtyTime) {
    let time = `${dirtyTime.slice(0, -2)} ${dirtyTime.slice(-2)}`;
    time = UTIL.convertToMilitary(time);
    return time.slice(0, -3);
  }
  function areTimesWithinWorkHours(startTime, endTime) {
    const valuesToCheck = [undefined, null, '', '00:00', 'Null'];
    const isWarningStartTimeValid = valuesToCheck.includes($.session.caseNotesWarningStartTime) ? false : true;
    const isWarningEndTimeValid = valuesToCheck.includes($.session.caseNotesWarningStartTime) ? false : true;

    if (!isWarningStartTimeValid || !isWarningEndTimeValid) {
      // session warning times don't matter
      return true;
    }

    const warnStart = parseSessionTime($.session.caseNotesWarningStartTime);
    const warnEnd = parseSessionTime($.session.caseNotesWarningEndTime);

    if (startTime < warnStart || startTime > warnEnd || endTime < warnStart || endTime > warnEnd) {
      return false;
    }

    return true;
  }
  async function doesTimeOverlap(startTime, endTime) {
    const overlap = await getOverlapCheckData({
      caseManagerId,
      consumerId: selectedConsumers[0],
      endTime: endTime,
      groupNoteId: 0,
      noteId: 0,
      serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
      startTime: startTime,
    });

    if (overlap) {
      cnValidation.showWarning({
        name: 'overlap',
        message: 'Overlap :(',
      });
    } else {
      cnValidation.hide('overlap');
    }
  }
  function checkServiceFundingADV() {
    //! ADV ONLY
    // based off selected servBillCode
    // check its service funding value
    // if funding value is "N" - disable service location dropdown
    // else - enable dropdown, make required
  }

  // DROPDOWNS
  //--------------------------------------------------
  function dealWithDropdownDataHugeString(res) {
    function decipherXML(res) {
      const xmlDoc = UTIL.parseXml('<?xml version="1.0" encoding="UTF-8"?>' + res);
      const data = [];

      const billingCodes = [].slice.call(xmlDoc.getElementsByTagName('billingcode'));
      billingCodes.forEach(bc => {
        const tmpServiceCode = [].slice.call(bc.getElementsByTagName('codename'))[0];
        const tmpServiceId = [].slice.call(bc.getElementsByTagName('serviceid'))[0];
        const tmpServiceFunding = [].slice.call(bc.getElementsByTagName('includeinfunding'))[0];
        const tmpServiceRequired = [].slice.call(bc.getElementsByTagName('servicerequired'))[0];
        const tmpLocationRequired = [].slice.call(bc.getElementsByTagName('locationrequired'))[0];
        const tmpNeedRequired = [].slice.call(bc.getElementsByTagName('needrequired'))[0];
        const tmpContactRequired = [].slice.call(bc.getElementsByTagName('contactrequired'))[0];
        const tmpAllowGroupNotes = [].slice.call(bc.getElementsByTagName('allowgroupnotes'))[0];
        const tmpMileageRequired = [].slice.call(bc.getElementsByTagName('mileagerequired'))[0];
        const tmpDocTimeRequired = [].slice.call(bc.getElementsByTagName('doctimerequired'))[0];
        const tmpTravelTimeRequired = [].slice.call(bc.getElementsByTagName('traveltimerequired'))[0];
        const locations = [].slice.call(bc.getElementsByTagName('location'));
        const contacts = [].slice.call(bc.getElementsByTagName('contact'));
        const services = [].slice.call(bc.getElementsByTagName('service'));
        const needs = [].slice.call(bc.getElementsByTagName('need'));

        const tmpObject = {};
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
        tmpObject.travelTimeRequired = tmpTravelTimeRequired ? tmpTravelTimeRequired.textContent : '';
        tmpObject.locations = [];
        tmpObject.contacts = [];
        tmpObject.services = [];
        tmpObject.needs = [];

        locations.forEach(loc => {
          const tmpLocName = [].slice.call(loc.getElementsByTagName('locname'))[0].textContent;
          const tmpLocCode = [].slice.call(loc.getElementsByTagName('loccode'))[0].textContent;
          tmpObject.locations.push({
            locName: tmpLocName,
            locCode: tmpLocCode,
          });
        });
        contacts.forEach(loc => {
          const tmpContactName = [].slice.call(loc.getElementsByTagName('contactname'))[0].textContent;
          const tmpContactCode = [].slice.call(loc.getElementsByTagName('contactcode'))[0].textContent;
          tmpObject.contacts.push({
            contactName: tmpContactName,
            contactCode: tmpContactCode,
          });
        });
        services.forEach(loc => {
          const tmpServiceName = [].slice.call(loc.getElementsByTagName('servicename'))[0].textContent;
          const tmpServiceCode = [].slice.call(loc.getElementsByTagName('servicecode'))[0].textContent;
          tmpObject.services.push({
            serviceName: tmpServiceName,
            serviceCode: tmpServiceCode,
          });
        });
        needs.forEach(loc => {
          const tmpNeedName = [].slice.call(loc.getElementsByTagName('needname'))[0].textContent;
          const tmpNeedCode = [].slice.call(loc.getElementsByTagName('needcode'))[0].textContent;
          tmpObject.needs.push({
            needName: tmpNeedName,
            needCode: tmpNeedCode,
          });
        });

        data.push(tmpObject);
      });

      return data;
    }

    const beautifulObject = decipherXML(res);
    let dropdownDataObj = {};

    // create object for quick access
    beautifulObject.forEach(dd => {
      // create object for each billercode
      if (!dropdownDataObj[dd.serviceId]) {
        dropdownDataObj[dd.serviceId] = {
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

    //dropdownDataKeys = Object.keys(dropdownDataObj);
    return dropdownDataObj;
  }
  function getServiceBillCodeDropdownData() {
    //TODO: caseManagerReview.serviceid = DEFAULT VALUE
    let data = [];

    for (serviceId in dropdownData) {
      data.push({
        value: serviceId,
        text: UTIL.removeQuotes(dropdownData[serviceId].serviceCode),
      });
    }

    return data;
  }
  function getLocationDropdownData() {
    return dropdownData[selectedServiceCode].locations.map(location => {
      return {
        value: location.locCode,
        text: location.locName,
      };
    });
  }
  function getServicesDropdownData() {
    return dropdownData[selectedServiceCode].services.map(service => {
      return {
        value: service.serviceCode,
        text: service.serviceName,
      };
    });
  }
  function getContactsDropdownData() {
    return dropdownData[selectedServiceCode].contacts.map(contact => {
      return {
        value: contact.contactCode,
        text: contact.contactName,
      };
    });
  }
  function getNeedsDropdownData() {
    return dropdownData[selectedServiceCode].needs.map(need => {
      return {
        value: need.needCode,
        text: need.needName,
      };
    });
  }
  function getVendorDropdownData() {
    // consumer specific dropdown triggered when consumer is selected
    return vendorDropdownData.map(vendor => {
      return {
        value: vendor.vendorId,
        text: vendor.vendorName,
      };
    });
  }
  function getServiceLocationDropdownData() {
    return serviceLocationDropdownData.map(location => {
      return {
        value: location.code,
        text: location.caption,
      };
    });
  }

  // VALIDATION / REQUIRED FIELDS
  //--------------------------------------------------
  function checkRequiredFields() {
    if (selectedConsumers.length === 0) {
      cnValidation.addError({
        name: 'consumer',
        message: 'Consumer is required',
      });
    } else {
      cnValidation.hide('consumer');
      // or
      // cnValidation.toggleErrorStatus('consumer', false)
    }
  }

  // DATA
  //--------------------------------------------------
  function showWarningModal(messageText, continueFunc) {
    const message = _DOM.createElement('p', { text: messageText });

    const warningModal = new Dialog({ isModal: true, node: message });

    const continueBtn = new Button({
      text: 'Continue',
      style: 'primary',
      styleType: 'contained',
    });
    const cancelBtn = new Button({
      text: 'Cancel',
      style: 'primary',
      styleType: 'outlined',
    });

    continueBtn.renderTo(warningModal);
    cancelBtn.renderTo(warningModal);

    continueBtn.onClick(() => {
      warningModal.close();
      continueFunc();
    });
    cancelBtn.onClick(() => {
      warningModal.close();
    });

    warningModal.renderTo(moduleWrap);

    warningModal.show();
  }
  function preSaveValidation(formData) {
    if ($.session.applicationName === 'Gatekeeper') {
      // check times are within work hours
      const timesWithinWorkHours = areTimesWithinWorkHours(formData.startTime, formData.endTime);

      if (!timesWithinWorkHours) {
        showWarningModal(
          `The times you have entered are outside the current normal working hours. Click OK to proceed or cacnel to return to the form.`,
          () => {
            saveNote(formData);
          },
        );
      }
    } else {
      saveNote(formData);
    }
  }
  function updateSingleNoteToGroupNote() {
    // 1. convertToGroupNotes === true | only if !isGroupNote && allowGroupNotes
    // 2. allowGroupNotes | this gets set on from service code dropdown event
    // 3. isGroupNote | set when singleNotToGroupNote is called

    if (!isGroupNote && allowGroupNotes) {
      //* SINGLE NOTE TO GROUP NOTE LOGIC
      //TODO: delete existing case note
      //TODO: isGroupNote = true
      //TODO: set noteId = 0?
      //TODO: if (travelTime === null) travelTime = 0;
      //TODO: if (documentationTime === null) documentationTime = 0;
      //TODO: endTime = endTime.substring(0, 5);
      //TODO: startTime = startTime.substring(0, 5);
      //TODO: set page load to new?
    }
  }
  // GET
  async function getDropdownData() {
    const data = await _UTIL.fetchData('populateDropdownData');
    return dealWithDropdownDataHugeString(data.populateDropdownDataResult);
  }
  async function getCaseManagerReviewData() {
    const data = await _UTIL.fetchData('getReviewRequiredForCaseManager', {
      caseManagerId,
    });
    return data.getReviewRequiredForCaseManagerResult;
  }
  async function getconsumersThatCanHaveMileage() {
    let data = await _UTIL.fetchData('getConsumersThatCanHaveMileageJSON');
    data = data.getConsumersThatCanHaveMileageJSONResult;
    return data.map(({ consumerid }) => consumerid);
  }
  async function getAttachmentsGK() {
    const data = await _UTIL.fetchData('getCaseNoteAttachmentsList', { caseNoteId: null });
    return data.getCaseNoteAttachmentsListResult;
  }
  async function getOverlapCheckData(retrieveData) {
    let data = await _UTIL.fetchData('caseNoteOverlapCheck', { ...retrieveData });
    if (data.caseNoteOverlapCheckResult && data.caseNoteOverlapCheckResult.length > 0) {
      return data.caseNoteOverlapCheckResult.map(d => d.consumername);
    }

    return '';
  }
  async function getInitialData() {
    selectedDate = setDefaultSelectedDate();

    dropdownData = await getDropdownData();

    caseManagerId = $.session.PeopleId;
    caseManagerReview = await getCaseManagerReviewData();
    reviewRequired = !caseManagerReview.reviewrequired ? 'N' : 'Y';

    if ($.session.applicationName === 'Advisor') {
      //! GATEKEEPER ALL CONSUMERS CAN HAVE MILEAGE
      //? For now going to leave this init, if init gets slow this can be moved to
      //? rosterPicker event and setup to only run once.
      consumersThatCanHaveMileage = await getconsumersThatCanHaveMileage();
    }

    showAllPhrases = _UTIL.localStorageHandler.get('casenotes-showAllPhrases');
    showAllPhrases = showAllPhrases === 'Y' ? true : false;

    return;

    if ($.session.applicationName === 'Gatekeeper' && false) {
      attachmentList = await getAttachmentsGK();
    }
  }
  // DELETE
  async function deleteNote(noteId) {
    await _UTIL.fetchData('deleteExistingCaseNote', {
      noteId: noteId,
    });
  }
  // UPDATE
  async function updateNote() {
    //TODO: clean start time and end time:
    // endTime = endTime.length === 8 ? endTime.substring(0, 5) : endTime;
    // startTime = startTime.length === 8 ? startTime.substring(0, 5) : startTime;
    //? Different props from saveData
    // add -> groupNoteId, consumerId
    // remove -> reviewRequired
  }
  // SAVE
  async function saveAttachments(caseNoteId) {
    for (attachment in attachmentsForSave) {
      try {
        console.log('save attach start');
        const saveAttachmentResults = await _UTIL.fetchData('addCaseNoteAttachment', {
          caseNoteId: caseNoteId,
          description: attachmentsForSave[attachment].description,
          attachmentType: attachmentsForSave[attachment].type,
          attachment: attachmentsForSave[attachment].arrayBuffer,
        });
        console.log('save attach end');
        console.log(saveAttachmentResults);
      } catch (error) {
        console.log('error saving attachment', attachment);
      }
    }
  }
  async function saveNote(formData) {
    if (isNewNote) {
      const saveCaseNoteResults = await _UTIL.fetchData('saveCaseNote', {
        caseManagerId,
        caseNote: _UTIL.removeUnsavableNoteText(formData.caseNote),
        casenotemileage: formData.casenotemileage,
        casenotetraveltime: formData.casenotetraveltime,
        confidential: formData.confidential,
        contactCode: formData.contactCode,
        corrected: 'N', //TODO: crete checkbox for this (review only)
        consumerId: selectedConsumers[0],
        documentationTime: '',
        endTime: formData.endTime,
        locationCode: formData.locationCode,
        needCode: formData.needCode,
        noteId: 0,
        reviewRequired: '',
        serviceCode: formData.serviceCode,
        serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
        serviceLocationCode: formData.serviceLocationCode,
        serviceOrBillingCodeId: formData.serviceOrBillingCodeId,
        startTime: formData.startTime,
        vendorId: formData.vendorId,
      });
      console.log(saveCaseNoteResults);

      if ($.session.applicationName === 'Gatekeeper') {
        await saveAttachments();
      }
    }
  }

  // EVENTS & CALLBACKS
  //--------------------------------------------------
  function onStartTimeChange(startTimeVal, endTimeVal) {
    const isStartBeforeEnd = isStartTimeBeforeEndTime(startTimeVal, endTimeVal);
    const isValid = isTimePastOrPresent(startTimeVal);

    if (!isStartBeforeEnd || !isValid) {
      cnForm.inputs['startTime'].setValidtyError('Start Time is invalid');
      return false;
    } else {
      cnForm.inputs['startTime'].setValidtyError('');
      return true;
    }
  }
  function onEndTimeChange(startTimeVal, endTimeVal) {
    const isStartBeforeEnd = isStartTimeBeforeEndTime(startTimeVal, endTimeVal);
    const isValid = isTimePastOrPresent(endTimeVal);

    if (!isStartBeforeEnd || !isValid) {
      cnForm.inputs['endTime'].setValidtyError('End Time is invalid');
      return false;
    } else {
      cnForm.inputs['endTime'].setValidtyError('');
      return true;
    }
  }
  const onChangeCallbacks = {
    serviceCode: ({ event, value, name, input }) => {
      // set selectedServiceCode
      selectedServiceCode = value;

      // get required fields
      const locationRequired = dropdownData[selectedServiceCode].locationRequired;
      const needRequired = dropdownData[selectedServiceCode].needRequired;
      const contactRequired = dropdownData[selectedServiceCode].contactRequired;
      const serviceRequired = dropdownData[selectedServiceCode].serviceRequired;

      let mileageRequired;

      if ($.session.applicationName === 'Gatekeeper') {
        mileageRequired = dropdownData[selectedServiceCode].mileageRequired;
        isTravelTimeRequired = dropdownData[selectedServiceCode].travelTimeRequired;
        isDocTimeRequired = dropdownData[selectedServiceCode].docTimeRequired;
        allowGroupNotes = dropdownData[selectedServiceCode].allowGroupNotes === 'Y' ? true : false;

        cnForm.inputs['mileage'].toggleDisabled(mileageRequired !== 'Y');
        cnForm.inputs['travelTime'].toggleDisabled(mileageRequired !== 'Y');
      } else {
        allowGroupNotes = true;
      }

      //populate dropdowns tied to this one
      if (selectedServiceCode !== '') {
        cnForm.inputs['location'].populate(getLocationDropdownData());
        cnForm.inputs['service'].populate(getServicesDropdownData());
        cnForm.inputs['need'].populate(getNeedsDropdownData());
        cnForm.inputs['contact'].populate(getContactsDropdownData());
      } else {
        cnForm.inputs['location'].populate([]);
        cnForm.inputs['service'].populate([]);
        cnForm.inputs['need'].populate([]);
        cnForm.inputs['contact'].populate([]);
      }

      // enable dropdowns
      cnForm.inputs['location'].toggleDisabled(selectedServiceCode === '');
      cnForm.inputs['service'].toggleDisabled(selectedServiceCode === '');
      cnForm.inputs['need'].toggleDisabled(selectedServiceCode === '');
      cnForm.inputs['contact'].toggleDisabled(selectedServiceCode === '');

      // set required fields
      cnForm.inputs['location'].toggleRequired(locationRequired === 'Y');
      cnForm.inputs['service'].toggleRequired(serviceRequired === 'Y');
      cnForm.inputs['need'].toggleRequired(needRequired === 'Y');
      cnForm.inputs['contact'].toggleRequired(contactRequired === 'Y');
    },
    location: ({ event, value, name, input }) => {},
    service: ({ event, value, name, input }) => {},
    serviceLocation: ({ event, value, name, input }) => {
      // adv only
    },
    need: ({ event, value, name, input }) => {},
    vendor: ({ event, value, name, input }) => {},
    contact: ({ event, value, name, input }) => {},
    startTime: ({ event, value, name, input }) => {
      const endTimeVal = cnForm.inputs['endTime'].getValue();

      const isStartValid = onStartTimeChange(value, endTimeVal);
      const isEndValid = onEndTimeChange(value, endTimeVal);

      if (isStartValid && isEndValid) {
        //_UTIL.debounce(doesTimeOverlap, 200);
        doesTimeOverlap();
      } else {
        cnValidation.hide('overlap');
      }
    },
    endTime: ({ event, value, name, input }) => {
      const startTimeVal = cnForm.inputs['startTime'].getValue();

      const isEndValid = onEndTimeChange(startTimeVal, value);
      const isStartValid = onStartTimeChange(startTimeVal, value);

      if (isStartValid && isEndValid) {
        //_UTIL.debounce(doesTimeOverlap, 200);
        doesTimeOverlap();
      } else {
        cnValidation.hide('overlap');
      }
    },
    mileage: ({ event, value, name, input }) => {
      return;

      const hasDecimal = event.key === '.' && value.indexOf('.') === 1 ? true : false;
    },
    travelTime: ({ event, value, name, input }) => {},
    noteText: ({ event, value, name, input }) => {},
    confidential: ({ event, value, name, input }) => {},
    attachments: async ({ event, value, name, input }) => {
      if (value) {
        // check file type
        const forbiddenTypes = new RegExp('(audio/)|(video/)');
        const isFileTypeValid = _UTIL.validateFileType(event, forbiddenTypes);

        if (!isFileTypeValid) return;

        // for saving attachment
        const attachmentObj = await _DOM.getAttachmentDetails(event);
        attachmentsForSave[attachmentObj.description] = attachmentObj;

        attachmentCountForIDs = attachmentCountForIDs + 1;
        // on file upload create new Input type attachment
        const newInputInstance = new Input({
          type: 'file',
          label: 'Add Attachment',
          id: `attachments${attachmentCountForIDs}`,
        });
        newInputInstance.build();

        // set input instance to cnForm.inputs
        cnForm.inputs[`attachments${attachmentCountForIDs}`] = newInputInstance;

        // insert new attachment input next to current one
        input.inputWrap.insertAdjacentElement('beforebegin', newInputInstance.inputWrap);

        // update label of new attachment
        input.inputWrap.classList.add('hasFile');
        input.labelEle.innerText = attachmentObj.description;
        const deleteIcon = Icon.getIcon('delete');
        input.labelEle.insertBefore(deleteIcon, input.labelEle.firstChild);
        deleteIcon.addEventListener('click', e => {
          e.stopPropagation();
          delete attachmentsForSave[attachmentObj.description];
          delete cnForm.inputs[`attachments${attachmentCountForIDs}`];
          newInputInstance.inputWrap.remove();
        });
      }
    },
  };
  const onKeyupCallbacks = {
    travelTime: ({ event, value, name, input }) => {
      if (value.length > 4) {
        event.target.value = value.substr(0, 4);
      }
    },
    /**
     * @param {Object} data
     * @param {Event} data.event - event obj
     * @param {string} data.value - value of input
     * @param {Event} data.name - name of input
     * @param {Instance} data.input - noteText input instance
     */
    noteText: ({ event, value, name, input }) => {
      const words = value.split(/\s+/);

      let cursorIndex;

      if (event.detail) {
        // check for the #ph
        if (words.includes('#ph')) {
          if (cnInsertPhrases.dialog.dialog.parentNode !== input.fullscreen.fullScreenDialog.dialog) {
            cnInsertPhrases.renderTo(input.fullscreen.fullScreenDialog.dialog);
          }

          // get textarea clone in fullscreen popup
          const textareaInput = input.fullscreen.textareaClone.querySelector('textarea');

          // disable textarea and close buton
          textareaInput.disabled = true;
          input.fullscreen.disableCloseButon(true);

          // show phrases dialog
          cnInsertPhrases.show();

          cnInsertPhrases.onPhraseSelect(phraseText => {
            // Replace #ph with user-generated text
            const textValue = value.replace('#ph', phraseText);
            // Update the textarea's value
            input.setValue(textValue);
            textareaInput.value = textValue;
            // re enable input
            textareaInput.disabled = false;
            // close dialog
            cnInsertPhrases.close();
            // disable textarea and close buton
            textareaInput.disabled = false;
            input.fullscreen.disableCloseButon(false);
            // focus on textarea
            textareaInput.focus();
          });
        }
      } else {
        // check for the #ph
        if (words.includes('#ph')) {
          if (cnInsertPhrases.dialog.dialog.parentNode !== cnForm.inputs['noteText'].inputWrap) {
            cnInsertPhrases.renderTo(cnForm.inputs['noteText'].inputWrap);
          }

          // temp disable input
          input.toggleDisabled(true);

          // show phrases dialog
          cnInsertPhrases.show();

          cnInsertPhrases.onPhraseSelect(phraseText => {
            // Replace #ph with user-generated text
            const textValue = value.replace('#ph', phraseText);
            // Update the textarea's value
            input.setValue(textValue);
            input.fullscreen.updateCloneValue(textValue);
            // re enable input
            input.toggleDisabled(false);
            // close dialog
            cnInsertPhrases.close();
            // focus on textarea
            input.setFocus();
          });
        }
      }

      // PHRASES
      //--------------------------------------------------
      // _UTIL.localStorageHandler.get('casenotes-showAllPhrases');
      // _UTIL.localStorageHandler.set('casenotes-showAllPhrases', 'N');
    },
  };

  // MAIN
  //--------------------------------------------------
  async function loadPage() {
    // LOAD INSTANCES / BUILD / RENDER
    //-----------------------------------------
    // Date Navigation
    dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
    });
    dateNavigation.build().renderTo(moduleWrap);

    // Validation Center
    cnValidation = new ValidationCenter({});
    cnValidation.build().renderTo(moduleWrap);

    // Roster Picker
    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
    });
    rosterPicker.build().renderTo(moduleWrap);

    // Form
    cnForm = new Form({
      elements: [
        //confidential
        {
          type: 'checkbox',
          label: 'Confidential',
          id: 'confidential',
        },
        //startTime
        {
          type: 'time',
          label: 'Start Time',
          id: 'startTime',
          required: true,
        },
        //endTime
        {
          type: 'time',
          label: 'End Time',
          id: 'endTime',
          required: true,
        },
        //serviceCode
        {
          type: 'select',
          label: $.session.applicationName === 'Gatekeeper' ? 'Bill Code:' : 'Serv. Code:',
          id: 'serviceCode',
          required: true,
          data: getServiceBillCodeDropdownData(),
          defaultValue: null,
          includeBlankOption: true,
          note: 'Im some helpful text',
        },
        //location
        {
          type: 'select',
          label: 'Location',
          id: 'location',
          disabled: true,
        },
        //service
        {
          type: 'select',
          label: 'Service',
          id: 'service',
          disabled: true,
        },
        //need
        {
          type: 'select',
          label: 'Need',
          id: 'need',
          disabled: true,
        },
        //contact
        {
          type: 'select',
          label: 'Contact',
          id: 'contact',
          disabled: true,
        },
        //vendor
        {
          type: 'select',
          label: 'Vendor',
          id: 'vendor',
        },
        //serviceLocation
        {
          type: 'select',
          label: 'Service Location',
          id: 'serviceLocation',
          hidden: $.session.applicationName === 'Gatekeeper',
        },
        //noteText
        {
          type: 'textarea',
          label: 'Note',
          id: 'noteText',
          required: true,
          fullscreen: true,
          textToSpeech: true,
          note: `Use the new quick insert key for phrases, type #ph. (#ph must not be apart of another word)`,
        },
        //mileage
        {
          type: 'number',
          label: 'Mileage',
          id: 'mileage',
          disabled: true,
        },
        //travelTime
        {
          type: 'number',
          label: 'Travel Time',
          id: 'travelTime',
          hidden: $.session.applicationName === 'Advisor',
          disabled: true,
        },
        //attachments
        {
          type: 'file',
          label: 'Add Attachment',
          id: 'attachments',
          hidden: $.session.applicationName === 'Advisor',
        },
      ],
    });
    cnForm.build().renderTo(cnFormWrap);

    // Phrases
    cnInsertPhrases = new CaseNotesInsertPhrases({
      showAllPhrases: showAllPhrases,
    });
    cnInsertPhrases.build();

    // Overview
    cnOverview = new CaseNotesOverview();
    cnOverview.build().renderTo(moduleWrap);

    // FETCH DATA / POPULATE
    //-----------------------------------------
    await cnInsertPhrases.fetchData();
    cnInsertPhrases.populate();
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();
    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();

    // EVENTS / CALLBACKS
    //-----------------------------------------
    dateNavigation.onDateChange(async newDate => {
      selectedDate = newDate;

      //TODO: re validate times when date change

      //re populate overview section when date change
      await cnOverview.fetchData(selectedDate);
      cnOverview.populate();
    });
    rosterPicker.onConsumerSelect(async data => {
      selectedConsumers = data;

      // Get Vendors By Consumer
      vendorDropdownData = await _UTIL.fetchData('getConsumerSpecificVendorsJSON', {
        consumerId: selectedConsumers[0],
        serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
      });
      vendorDropdownData = vendorDropdownData.getConsumerSpecificVendorsJSONResult;
      const vendorData = getVendorDropdownData();
      cnForm.inputs['vendor'].populate(vendorData);

      if ($.session.applicationName === 'Advisor') {
        // Check Selected Consumer For Mileage
        const canConsumerHaveMileage = consumersThatCanHaveMileage.includes(selectedConsumers[0]);
        if (canConsumerHaveMileage) {
          cnForm.inputs['mileage'].toggleDisabled(false);
        }

        // Get Serv Locations By Consumer
        serviceLocationDropdownData = await _UTIL.fetchData('getServiceLocationsForCaseNoteDropdown', {
          consumerId: selectedConsumers[0],
          serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
        });
        serviceLocationDropdownData = serviceLocationDropdownData.getServiceLocationsForCaseNoteDropdownResult;
        const servLocData = getServiceLocationDropdownData();
        cnForm.inputs['serviceLocation'].populate(servLocData);
      }

      checkRequiredFields();
    });
    cnForm.onChange(event => {
      const value = event.target.value;
      let name = event.target.name;
      const input = cnForm.inputs[name];

      const isAttachment = name.includes('attachments');

      if (isAttachment) name = 'attachments';
      if (!onChangeCallbacks[name]) return;

      onChangeCallbacks[name]({
        event,
        value,
        name,
        input,
      });
    });
    cnForm.onKeyup(event => {
      const value = event.target.value;
      let name = event.target.name;
      const input = cnForm.inputs[name];

      const isAttachment = name.includes('attachments');

      if (isAttachment) name = 'attachments';
      if (!onKeyupCallbacks[name]) return;

      onKeyupCallbacks[name]({
        event,
        value,
        name,
        input,
      });
    });
    cnForm.onSubmit(async data => {
      //TODO: return succes or failure from SaveNote so I can display to user
      await saveNote({
        caseNote: data.noteText ?? '',
        casenotemileage: data.mileage ?? '0',
        casenotetraveltime: data.travelTime ?? '',
        confidential: data.confidential === 'on' ? 'Y' : 'N',
        contactCode: data.contact ?? '',
        endTime: data.endTime ?? '',
        locationCode: data.location ?? '',
        needCode: data.need ?? '',
        serviceCode: data.service ?? '',
        serviceLocationCode: data.serviceLocation ?? '',
        serviceOrBillingCodeId: data.serviceCode ?? '',
        startTime: data.startTime ?? '',
        vendorId: data.vendor ?? '',
      });

      await cnOverview.fetchData(selectedDate);
      cnOverview.populate();
    });
  }

  // INIT/LOAD? (data & defaults)
  //--------------------------------------------------
  async function init() {
    moduleWrap = _DOM.createElement('div', { class: 'caseNotesModule' });
    cnFormWrap = _DOM.createElement('div', { class: 'caseNotesForm' });
    moduleWrap.appendChild(cnFormWrap);

    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('casenotes2.0');
    _DOM.ACTIONCENTER.appendChild(moduleWrap);

    await getInitialData();

    await loadPage();

    checkRequiredFields();
  }

  return {
    init,
    resetModule,
  };
})();
