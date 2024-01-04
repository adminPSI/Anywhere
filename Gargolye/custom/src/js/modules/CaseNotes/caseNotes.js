const CaseNotes = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let caseNoteId = null;
  let caseNoteGroupId = null;
  let caseNoteEditData = {};
  let caseNoteAttachmentsEditData = [];
  let attachmentsForDelete = [];
  let caseManagerId;
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
  let updatedInputs = {};
  //--------------------------
  // DOM
  //--------------------------
  let moduleWrap;
  let cnHeader;
  let cnDateNavWrap;
  let cnFormWrap;
  let cnRosterWrap;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let dateNavigation;
  let rosterPicker;
  let cnForm;
  let cnOverview;
  let cnPhrases;
  let cnDocTimer;
  let reqVisualizer;

  function resetModuleData() {
    _DOM.ACTIONCENTER.removeAttribute('data-ui');

    moduleWrap = undefined;
    cnHeader = undefined;
    cnDateNavWrap = undefined;
    cnFormWrap = undefined;
    cnRosterWrap = undefined;
    dateNavigation = undefined;
    rosterPicker = undefined;
    cnForm = undefined;
    cnOverview = undefined;
    cnPhrases = undefined;
    cnDocTimer = undefined;
    reqVisualizer = undefined;

    resetNoteData();
  }
  function resetNoteData() {
    caseNoteId = null;
    caseNoteGroupId = null;
    caseNoteEditData = {};
    caseNoteAttachmentsEditData = [];
    attachmentsForDelete = [];
    caseManagerId;
    selectedConsumers = [];
    selectedServiceCode;
    updatedInputs = {};
  }
  function resetModule() {
    resetModuleData();
    resetNoteData();
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

    let isReadOnly;

    //TODO-ASH: check if case note is batched | *ONLY FOR REVIEW*
    // batched notes are readonly, if batched status === '' it is NOT BATCHED

    //! GK ONLY
    //? If note is batched then we shouldn't hit this if bc note is read only
    if ($.session.applicationName === 'Gatekeeper') {
      if ($.session.CaseNotesUpdate) {
        if (
          !$.session.CaseNotesUpdateEntered ||
          ($.session.CaseNotesUpdateEntered && caseManagerId === $.session.PeopleId)
        ) {
          //can edit (correct alignment of Update and UpdateEntered Case Notes permissions)
          isReadOnly = false;
        } else {
          //can not edit (with UpdateEntered permission, can't edit other people's case notes)
          isReadOnly = true;
        }
      } else {
        isReadOnly = true; //can not edit (no overall update permission)
      }
    }
  }
  function checkServiceFundingADV() {
    //! ADV ONLY
    // based off selected servBillCode
    // check its service funding value
    // if funding value is "N" - disable service location dropdown
    // else - enable dropdown, make required
  }
  function checkGroupNotesPermission() {
    let allowGroupNotes;

    if ($.session.applicationName === 'Gatekeeper') {
      allowGroupNotes = cnData.allowGroupNotes(selectedServiceCode);
    } else {
      allowGroupNotes = true;
    }

    rosterPicker.toggleMultiSelectOption(allowGroupNotes);
  }
  function extractCaseNoteId(xmlString) {
    const match = xmlString.match(/<caseNoteId>(\d+)<\/caseNoteId>/);
    return match ? match[1] : null;
  }
  function checkRequiredFields() {
    // const isFormValid = areAllFormFieldsValid();
    let isSaveDisabled = false;

    if (selectedConsumers.length === 0) {
      isSaveDisabled = true;
    } else {
      isSaveDisabled = false;
    }

    if (isSaveDisabled) {
      cnForm.buttons['submit'].toggleDisabled(true);
      cnForm.buttons['saveAndNew'].toggleDisabled(true);
      cnForm.buttons['update'].toggleDisabled(true);
    } else {
      cnForm.buttons['submit'].toggleDisabled(false);
      cnForm.buttons['saveAndNew'].toggleDisabled(false);
      cnForm.buttons['update'].toggleDisabled(false);
    }
  }

  // TIME HELPERS
  //--------------------------------------------------
  function parseSessionTime(dirtyTime) {
    let time = `${dirtyTime.slice(0, -2)} ${dirtyTime.slice(-2)}`;
    time = UTIL.convertToMilitary(time);
    return time.slice(0, -3);
  }
  function timesWithinWorkHoursCheck(startTime, endTime) {
    const valuesToCheck = [undefined, null, '', '00:00', 'Null'];
    const isWarningStartTimeValid = valuesToCheck.includes($.session.caseNotesWarningStartTime) ? false : true;
    const isWarningEndTimeValid = valuesToCheck.includes($.session.caseNotesWarningStartTime) ? false : true;

    if (!isWarningStartTimeValid || !isWarningEndTimeValid) {
      // session warning times don't matter
      return true;
    }

    const warnStart = parseSessionTime($.session.caseNotesWarningStartTime);
    const warnEnd = parseSessionTime($.session.caseNotesWarningEndTime);

    const validStart = (startTime < warnStart || startTime > warnEnd) && startTime !== '' ? false : true;
    const validEnd = (endTime < warnStart || endTime > warnEnd) && endTime !== '' ? false : true;

    return { validStart, validEnd };
  }
  function isFutureTime(dirtyTime) {
    //If selectedDate is not today then time dosen't matter
    const isToday = new Date().setHours(0, 0, 0, 0) !== new Date(selectedDate).setHours(0, 0, 0, 0);
    if (!isToday || !dirtyTime) {
      return false;
    }

    const currentDate = new Date();
    const selectedDateClone = new Date(selectedDate);

    // CHECKS IF TIME IS IN FURUTRE
    dirtyTime = dirtyTime.split(':');
    selectedDateClone.setHours(dirtyTime[0], dirtyTime[1], 0, 0);
    return dates.isAfter(selectedDateClone, currentDate);
  }
  function isStartTimeBeforeEndTime(startTime, endTime) {
    if (!startTime || !endTime) return true;

    return startTime < endTime ? true : false;
  }
  async function timeOverlapCheck(startTime, endTime) {
    await cnData.fetchTimeOverlapData({
      caseManagerId,
      consumerId: selectedConsumers[0],
      endTime: endTime,
      groupNoteId: caseNoteGroupId ?? 0,
      noteId: caseNoteId ?? 0,
      serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
      startTime: startTime,
    });

    const overlap = cnData.getOverlapData();
    console.log(overlap);

    return overlap;
  }

  // CRUD
  //--------------------------------------------------
  async function deleteNote(noteId) {
    const response = await _UTIL.fetchData('deleteExistingCaseNote', {
      noteId: noteId,
    });

    return response.deleteExistingCaseNoteResults;
  }
  async function saveAttachments(attachmentsForSave) {
    const saveAttachmentPromises = [];

    // Store promises in array so we can handle each attachment individually
    for (attachment in attachmentsForSave) {
      const promise = _UTIL
        .fetchData('addCaseNoteAttachment', {
          caseNoteId: caseNoteId,
          description: attachmentsForSave[attachment].description,
          attachmentType: attachmentsForSave[attachment].type,
          attachment: attachmentsForSave[attachment].attachment,
        })
        .then(result => ({ status: 'fulfilled', value: result }))
        .catch(error => ({ status: 'rejected', reason: error, attachment: attachmentsForSave[attachment] }));

      saveAttachmentPromises.push(promise);
    }

    // Loop through to check for any failed attachment saves
    const saveAttachmentResults = await Promise.allSettled(saveAttachmentPromises);
    const failedSaves = saveAttachmentResults.reduce((acc, result) => {
      if (result.status === 'rejected') {
        acc.push(result.attachment.description);
      }
      return acc;
    }, []);

    return failedSaves.length === 0 ? 'success' : 'error';
  }
  async function saveGroup(data) {
    const savePromises = [];
    let newGroupId;
    let consumerGroupCount;

    if (!caseNoteGroupId) {
      deleteNote(caseNoteId);
      caseNoteId = null;
      const response = await _UTIL.fetchData('getGroupNoteId');
      newGroupId = JSON.parse(response.getGroupNoteIdResult);
      newGroupId = newGroupId[0].groupNoteId;
      consumerGroupCount = selectedConsumers.length;
    }

    selectedConsumers.forEach(consumerId => {
      if (!caseNoteGroupId) {
        savePromises.push(
          _UTIL
            .fetchData('saveGroupCaseNote', {
              ...data,
              consumerId,
              consumerGroupCount,
              groupNoteId: newGroupId,
              noteId: 0,
            })
            .then(result => ({ status: 'fulfilled', value: result }))
            .catch(error => ({ status: 'rejected', reason: error })),
        );

        return;
      }

      if (caseNoteEditData.consumerid === consumerId) {
        savePromises.push(
          _UTIL
            .fetchData('saveCaseNote', data)
            .then(result => ({ status: 'fulfilled', value: result }))
            .catch(error => ({ status: 'rejected', reason: error })),
        );
      } else {
        data.consumerId = consumerId;
        savePromises.push(
          _UTIL
            .fetchData('saveAdditionalGroupCaseNote', data)
            .then(result => ({ status: 'fulfilled', value: result }))
            .catch(error => ({ status: 'rejected', reason: error })),
        );
      }
    });

    if (caseNoteGroupId) {
      savePromises.push(
        _UTIL
          .fetchData('updateGroupNoteValues', {
            groupNoteId: caseNoteGroupId,
            noteId: caseNoteId,
            serviceOrBillingCodeId: data.serviceOrBillingCodeId,
            serviceDate: data.serviceDate,
            startTime: data.startTime,
            endTime: data.endTime,
          })
          .then(result => ({ status: 'fulfilled', value: result }))
          .catch(error => ({ status: 'rejected', reason: error })),
      );
    }

    const groupSaveResults = await Promise.allSettled(savePromises);
    const failedSaves = groupSaveResults.reduce((acc, result) => {
      if (result.status === 'rejected') {
        acc.push('fail');
      }
      return acc;
    }, []);

    if (!caseNoteGroupId && caseNoteAttachmentsEditData.length) {
      // re saving attachments back to orig note
      saveAttachments(caseNoteAttachmentsEditData);
    }

    if (newGroupId) {
      caseNoteGroupId = newGroupId;
    }

    const success = failedSaves.length === 0 ? 'success' : 'error';
    return {
      success,
      newGroup: newGroupId ? true : false,
    };
  }
  async function saveNote(data, attachments) {
    let saveResponse,
      isNewGroup = false;

    reqVisualizer.show('Saving Case Note...');

    if (selectedConsumers.length === 1 && !caseNoteGroupId) {
      // NEW NOTE or EDIT NON GROUP NOTE
      const response = (await _UTIL.fetchData('saveCaseNote', data)).saveCaseNoteResult;
      caseNoteId = caseNoteId ? caseNoteId : extractCaseNoteId(response);
      saveResponse = caseNoteId ? 'success' : 'error';
      isNewGroup = false;

      // SAVE ATTACHMENTS
      if ($.session.applicationName === 'Gatekeeper' && Object.keys(attachments).length > 0) {
        const attachSaveResponse = saveAttachments(attachments);
        if (attachSaveResponse === 'error') {
          reqVisualizer.fullfill('error', 'Error Saving Attachments', 2000);
          return;
        }
      }
    } else {
      const resp = await saveGroup(data);
      saveResponse = resp.success;
      isNewGroup = resp.newGroup;
    }

    if (saveResponse === 'success') {
      reqVisualizer.fullfill('success', 'Case Note Saved!', 2000);
    } else {
      reqVisualizer.fullfill('error', 'Error Saving Case Note', 2000);
    }

    return { saveResponse, isNewGroup };
  }

  // FORM
  //--------------------------------------------------
  function areAllFormFieldsValid() {
    const invalidControls = cnForm.form.querySelectorAll(':invalid');

    if (invalidControls.length > 0) {
      return false;
    }

    return true;
  }
  function checkFormForUnsavedChanges(inputName, newValue) {
    const originalNoteDataMap = {
      serviceCode: caseNoteEditData.mainbillingorservicecodeid,
      location: caseNoteEditData.locationcode,
      serviceLocation: caseNoteEditData.servicelocationid,
      need: caseNoteEditData.serviceneedcode,
      vendor: caseNoteEditData.vendorid,
      contact: caseNoteEditData.contactcode,
      startTime: caseNoteEditData.starttime,
      endTime: caseNoteEditData.endtime,
      mileage: caseNoteEditData.totalmiles,
      travelTime: caseNoteEditData.traveltime,
      noteText: caseNoteEditData.casenote,
      confidential: caseNoteEditData.confidential,
    };

    if (originalNoteDataMap[inputName] !== newValue) {
      updatedInputs[inputName] = true;
    } else {
      delete updatedInputs[inputName];
    }

    if (Object.keys(updatedInputs).length) {
      cnFormToast.show(`You have unsaved changes. Click 'Update' to keep them or 'Cancel' to discard.`);
    } else {
      cnFormToast.close();
    }
  }
  function toggleFormButtonShowHide() {
    cnForm.buttons['submit'].toggleVisibility(caseNoteId ? true : false);
    cnForm.buttons['saveAndNew'].toggleVisibility(caseNoteId ? true : false);
    cnForm.buttons['update'].toggleVisibility(caseNoteId ? false : true);
    cnForm.buttons['delete'].toggleVisibility(caseNoteId ? false : true);
  }
  // DROPDOWNS
  async function updateVendorDropdownByConsumer() {
    await cnData.fetchVendorDropdownData({
      consumerId: selectedConsumers[0],
      serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
    });

    const vendorData = cnData.getVendorDropdownData();
    cnForm.inputs['vendor'].populate(vendorData);

    if (vendorData.length === 1) {
      cnForm.inputs['vendor'].setValue(vendorData[0].value);
    }
  }
  async function updateServiceLocationDropdownByConsumer() {
    await cnData.fetchServiceLocationDropdownData({
      consumerId: selectedConsumers[0],
      serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
    });

    const servLocData = cnData.getServiceLocationDropdownData();
    cnForm.inputs['serviceLocation'].populate(servLocData);
  }
  async function setConsumerRelatedDropdowns() {
    await updateVendorDropdownByConsumer();

    if ($.session.applicationName === 'Advisor') {
      await updateServiceLocationDropdownByConsumer();

      if (cnData.canConsumerHaveMileage(selectedConsumers[0])) {
        cnForm.inputs['mileage'].toggleDisabled(false);
      }
    }
  }
  // ATTACHMENT DELETE
  async function onFileDelete(e) {
    console.log(e.target);
    console.log('File delete from form', e.detail);

    attachmentsForDelete.push(e.detail);
    console.log(attachmentsForDelete);
  }
  // CHANGE \ KEYUP
  function onTimeChange(target) {
    const inputKey = target === 'start' ? 'startTime' : 'endTime';
    const startTimeVal = cnForm.inputs['startTime'].getValue();
    const endTimeVal = cnForm.inputs['endTime'].getValue();

    if (startTimeVal === '' && endTimeVal === '') {
      return;
    }

    if (target) {
      const isTimeFuture = isFutureTime(target === 'start' ? startTimeVal : endTimeVal);
      if (isTimeFuture) {
        cnForm.inputs[inputKey].setValidtyError('error');
        cnForm.inputs[inputKey].showError('Time can not be in future.');
        return;
      }
    } else {
      const isStartTimeFuture = isFutureTime(startTimeVal);
      const isEndTimeFuture = isFutureTime(endTimeVal);
      if (isStartTimeFuture) {
        cnForm.inputs['startTime'].setValidtyError('error');
        cnForm.inputs['startTime'].showError('Time can not be in future.');
      }
      if (isEndTimeFuture) {
        cnForm.inputs['endTime'].setValidtyError('error');
        cnForm.inputs['endTime'].showError('Time can not be in future.');
      }
      if (isStartTimeFuture || isEndTimeFuture) return;
    }

    const isStartBeforeEnd = isStartTimeBeforeEndTime(startTimeVal, endTimeVal);
    if (!isStartBeforeEnd) {
      cnForm.inputs['startTime'].setValidtyError(`error`);
      cnForm.inputs['startTime'].showError(`Start time can't be after end time.`);
      return;
    }

    cnForm.inputs['startTime'].setValidtyError('');
    cnForm.inputs['endTime'].setValidtyError('');

    let validStart = true;
    let validEnd = true;
    if ($.session.applicationName === 'Gatekeeper') {
      ({ validStart, validEnd } = timesWithinWorkHoursCheck(startTimeVal, endTimeVal));

      if (!validStart) {
        cnForm.inputs['startTime'].showWarning(`Time is outside normal working hours.`);
      }

      if (!validEnd) {
        cnForm.inputs['endTime'].showWarning(`Time is outside normal working hours.`);
      }
    }

    if (validStart) {
      cnForm.inputs['startTime'].clearErrorOrWarning();
    }
    if (validEnd) {
      cnForm.inputs['endTime'].clearErrorOrWarning();
    }
  }
  function onServiceCodeChange(documentationTime = 0) {
    if (caseNoteId) {
      checkGroupNotesPermission();
    }

    if ($.session.applicationName === 'Gatekeeper' && selectedServiceCode !== '') {
      const mileageRequired = cnData.isMileageRequired(selectedServiceCode);
      const isTravelTimeRequired = cnData.isTravelTimeRequired(selectedServiceCode);
      const isDocTimeRequired = cnData.isDocTimeRequired(selectedServiceCode);

      if (isDocTimeRequired) {
        cnDocTimer.showAutoStartPopup(parseInt(documentationTime));
      }

      cnForm.inputs['mileage'].toggleDisabled(!mileageRequired);
      cnForm.inputs['travelTime'].toggleDisabled(!isTravelTimeRequired);
    } else {
      const isServiceFunding = cnData.isServiceFunding(selectedServiceCode);
      cnForm.inputs['serviceLocation'].toggleDisabled(!isServiceFunding);
    }

    if (selectedServiceCode !== '') {
      // get required fields
      const locationRequired = cnData.isLocationRequired(selectedServiceCode);
      const needRequired = cnData.isNeedRequired(selectedServiceCode);
      const contactRequired = cnData.isContactRequired(selectedServiceCode);
      const serviceRequired = cnData.isServiceRequired(selectedServiceCode);
      // enable dropdowns
      cnForm.inputs['location'].toggleDisabled(!locationRequired);
      cnForm.inputs['service'].toggleDisabled(!serviceRequired);
      cnForm.inputs['need'].toggleDisabled(!needRequired);
      cnForm.inputs['contact'].toggleDisabled(!contactRequired);
      // set required fields
      cnForm.inputs['location'].toggleRequired(locationRequired);
      cnForm.inputs['service'].toggleRequired(serviceRequired);
      cnForm.inputs['need'].toggleRequired(needRequired);
      cnForm.inputs['contact'].toggleRequired(contactRequired);
      //populate dropdowns tied to this one
      cnForm.inputs['location'].populate(cnData.getLocationDropdownData(selectedServiceCode));
      cnForm.inputs['service'].populate(cnData.getServicesDropdownData(selectedServiceCode));
      cnForm.inputs['need'].populate(cnData.getNeedsDropdownData(selectedServiceCode));
      cnForm.inputs['contact'].populate(cnData.getContactsDropdownData(selectedServiceCode));
    } else {
      // set required to false
      cnForm.inputs['location'].toggleRequired(false);
      cnForm.inputs['service'].toggleRequired(false);
      cnForm.inputs['need'].toggleRequired(false);
      cnForm.inputs['contact'].toggleRequired(false);
      // disable dropdowns
      cnForm.inputs['location'].toggleDisabled(true);
      cnForm.inputs['service'].toggleDisabled(true);
      cnForm.inputs['need'].toggleDisabled(true);
      cnForm.inputs['contact'].toggleDisabled(true);
      //clear dropdown values
      cnForm.inputs['location'].populate([]);
      cnForm.inputs['service'].populate([]);
      cnForm.inputs['need'].populate([]);
      cnForm.inputs['contact'].populate([]);
    }
  }
  const onChangeCallbacks = {
    serviceCode: ({ event, value, name, input }) => {
      selectedServiceCode = value;
      onServiceCodeChange();
    },
    serviceLocation: ({ event, value, name, input }) => {
      // adv only
    },
    startTime: () => {
      onTimeChange('start');
    },
    endTime: () => {
      onTimeChange('end');
    },
    mileage: ({ event, value, name, input }) => {
      return;

      const hasDecimal = event.key === '.' && value.indexOf('.') === 1 ? true : false;
    },
  };
  function onFormChange(event) {
    const value = event.target.value;
    let name = event.target.name;
    const input = cnForm.inputs[name];

    if (onChangeCallbacks[name]) {
      onChangeCallbacks[name]({
        event,
        value,
        name,
        input,
      });
    }

    checkRequiredFields();

    // if (caseNoteId) {
    //   checkFormForUnsavedChanges(name, value);
    // }
  }
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

      if (event.detail) {
        // check for the #ph
        if (words.includes('#ph')) {
          // if (cnPhrases.InsertPhrases.dialog.dialog.parentNode !== input.fullscreen.fullScreenDialog.dialog) {
          //   cnPhrases.InsertPhrases.renderTo(input.fullscreen.fullScreenDialog.dialog);
          // }

          // get textarea clone in fullscreen popup
          const textareaInput = input.fullscreen.textareaClone.querySelector('textarea');

          // disable textarea and close buton
          textareaInput.disabled = true;
          input.fullscreen.disableCloseButon(true);

          // show phrases dialog
          cnPhrases.InsertPhrases.show();

          cnPhrases.InsertPhrases.onPhraseSelect(phraseText => {
            // Replace #ph with user-generated text
            const textValue = value.replace('#ph', phraseText);
            // Update the textarea's value
            input.setValue(textValue);
            textareaInput.value = textValue;
            // re enable input
            textareaInput.disabled = false;
            // close dialog
            cnPhrases.InsertPhrases.close();
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
          // temp disable input
          input.toggleDisabled(true);

          // show phrases dialog
          cnPhrases.InsertPhrases.show();

          cnPhrases.InsertPhrases.onPhraseSelect(phraseText => {
            // Replace #ph with user-generated text
            const textValue = value.replace('#ph', phraseText);
            // Update the textarea's value
            input.setValue(textValue);
            input.fullscreen.updateCloneValue(textValue);
            // re enable input
            input.toggleDisabled(false);
            // close dialog
            cnPhrases.InsertPhrases.close();
            // focus on textarea
            input.setFocus();
          });
        }
      }
    },
  };
  function onFormKeyup(event) {
    const value = event.target.value;
    let name = event.target.name;
    const input = cnForm.inputs[name];

    if (onKeyupCallbacks[name]) {
      onKeyupCallbacks[name]({
        event,
        value,
        name,
        input,
      });
    }

    checkRequiredFields();
  }
  // SUBMIT
  async function processAttachmentsForSave(data) {
    const attachmentsForSave = {};

    for (const key in data) {
      if (key.includes('attachment')) {
        if (data[key].name) {
          const attachmentDetails = await _DOM.getAttachmentDetails(data[key]);
          attachmentsForSave[attachmentDetails.description] = attachmentDetails;
        }
      }
    }

    return attachmentsForSave;
  }
  function onFormReset() {
    resetNoteData();
    cnFormToast.close();
    rosterPicker.setSelectedConsumers([]);

    if ($.session.applicationName === 'Gatekeeper') {
      cnDocTimer.clear();
    }
  }
  async function onFormDelete() {
    resetNoteData();
    cnForm.clear();
    cnFormToast.close();
    rosterPicker.setSelectedConsumers([]);

    await deleteNote(caseNoteId);

    if ($.session.applicationName === 'Gatekeeper') {
      cnDocTimer.clear();
    }
  }
  async function onFormSubmit(data, submitter) {
    const buttonName = submitter.name.toLowerCase();

    const overlaps = await timeOverlapCheck(data.startTime, data.endTime);
    if (overlaps.length) {
      const continueSave = await overlapPopup.show(
        `The times you have entered for this note overlap with the following consumer(s), ${overlaps.join(
          ',',
        )}. Click OK to continue with save or CANCEL to go back to note.`,
      );

      if (continueSave === 'cancel') {
        return;
      }
    }

    const saveData = {
      caseManagerId,
      caseNote: data.noteText ? _UTIL.removeUnsavableNoteText(data.noteText) : '',
      casenotemileage: data.mileage ?? '0',
      casenotetraveltime: data.travelTime ?? '',
      consumerId: selectedConsumers[0],
      confidential: data.confidential === 'on' ? 'Y' : 'N',
      contactCode: data.contact ?? '',
      corrected: 'N',
      documentationTime: $.session.applicationName === 'Gatekeeper' ? cnDocTimer.stop().getTime() : '',
      endTime: data.endTime.substring(0, 5),
      locationCode: data.location ?? '',
      noteId: caseNoteId ?? 0,
      needCode: data.need ?? '',
      reviewRequired: '',
      serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
      serviceCode: data.service ?? '',
      serviceLocationCode: data.serviceLocation ?? '',
      serviceOrBillingCodeId: data.serviceCode ?? '',
      startTime: data.startTime.substring(0, 5),
      vendorId: data.vendor ?? '',
    };
    const attachmentsForSave = await processAttachmentsForSave(data);

    const { isNewGroup } = await saveNote(saveData, attachmentsForSave);

    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();
    cnFormToast.close();

    if (buttonName === 'saveandnew' || isNewGroup) {
      resetNoteData();
      cnForm.clear();
      rosterPicker.setSelectedConsumers([]);

      if ($.session.applicationName === 'Gatekeeper') {
        cnDocTimer.clear();
      }
    } else {
      if ($.session.applicationName === 'Gatekeeper') {
        cnDocTimer.start(saveData.documentationTime);
      }
    }
  }

  // ROSTER
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumers = data;

    await updateVendorDropdownByConsumer();

    if ($.session.applicationName === 'Advisor') {
      if (cnData.canConsumerHaveMileage(selectedConsumers[0])) {
        cnForm.inputs['mileage'].toggleDisabled(false);
      }

      await updateServiceLocationDropdownByConsumer();
    }

    checkRequiredFields();
  }

  // DATE NAV
  //--------------------------------------------------
  async function onDateChange(newDate) {
    selectedDate = newDate;

    onTimeChange();

    //re populate overview section when date change
    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();
  }

  // OVERVIEW CARDS
  //--------------------------------------------------
  async function onOverviewCardDelete(caseNoteId) {
    console.log('delete', caseNoteId);
    deleteNote(caseNoteId);
  }
  async function onOverviewCardEdit(noteId) {
    _DOM.scrollToTop();

    let data = await _UTIL.fetchData('getCaseNoteEditJSON', {
      noteId: noteId,
    });
    caseNoteEditData = data.getCaseNoteEditJSONResult[0];
    console.log(caseNoteEditData);

    caseNoteId = noteId;
    caseNoteGroupId = caseNoteEditData.groupid;
    caseManagerId = caseNoteEditData.casemanagerid;
    selectedConsumers = [caseNoteEditData.consumerid];
    selectedServiceCode = caseNoteEditData.mainbillingorservicecodeid;
    attachmentsForDelete = [];

    rosterPicker.setSelectedConsumers(selectedConsumers, true);
    setConsumerRelatedDropdowns();
    onServiceCodeChange(caseNoteEditData.documentationTime);

    cnForm.populate({
      serviceCode: caseNoteEditData.mainbillingorservicecodeid,
      location: caseNoteEditData.locationcode,
      serviceLocation: caseNoteEditData.servicelocationid,
      service: caseNoteEditData.servicecode,
      need: caseNoteEditData.serviceneedcode,
      vendor: caseNoteEditData.vendorid,
      contact: caseNoteEditData.contactcode,
      startTime: caseNoteEditData.starttime,
      endTime: caseNoteEditData.endtime,
      mileage: caseNoteEditData.totalmiles,
      travelTime: caseNoteEditData.traveltime,
      noteText: caseNoteEditData.casenote,
      confidential: caseNoteEditData.confidential === 'Y' ? true : false,
    });

    if ($.session.applicationName === 'Gatekeeper') {
      await cnData.fetchAttachmentsGK(caseNoteId);
      caseNoteAttachmentsEditData = cnData.getAttachmentsList();
      cnForm.inputs['attachment'].addAttachments(caseNoteAttachmentsEditData);
    }

    //TODO-ASH: Add entered by (caseNoteEditData.originaluserfullname, caseNoteEditData.originaluserid)
    //TODO-ASH: Add last edit on (caseNoteEditData.lastupdate)
    //cnFormWrap

    toggleFormButtonShowHide();
    checkRequiredFields();
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    dateNavigation.onDateChange(onDateChange);
    rosterPicker.onConsumerSelect(onConsumerSelect);
    cnForm.onChange(onFormChange);
    cnForm.onKeyup(onFormKeyup);
    cnForm.onDelete(onFormDelete);
    cnForm.onSubmit(onFormSubmit);
    cnForm.onReset(onFormReset);
    cnForm.onFileDelete(onFileDelete);
    cnOverview.onCardEdit(onOverviewCardEdit);
    cnOverview.onCardDelete(onOverviewCardDelete);
  }
  async function populatePage() {
    await cnPhrases.InsertPhrases.fetchData();
    cnPhrases.InsertPhrases.populate();
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();
    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();
  }
  async function loadPage() {
    dateNavigation.renderTo(cnDateNavWrap);
    rosterPicker.renderTo(cnRosterWrap);
    cnFormToast.renderTo(cnFormWrap);
    cnForm.renderTo(cnFormWrap);
    cnOverview.renderTo(moduleWrap);
    cnPhrases.renderTo(_DOM.ACTIONCENTER);

    attachEvents();
  }
  function loadPageSkeleton() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('casenotes2.0');

    // build DOM skeleton
    moduleWrap = _DOM.createElement('div', { class: 'caseNotesModule' });
    cnHeader = _DOM.createElement('div', { class: 'caseNotesHeader', html: `<h1>Case Notes</h1>` });
    cnDateNavWrap = _DOM.createElement('div', { class: 'caseNotesDateNav' });
    cnFormWrap = _DOM.createElement('div', { class: 'caseNotesForm' });
    cnRosterWrap = _DOM.createElement('div', { class: 'caseNotesRosterPicker' });

    moduleWrap.appendChild(cnHeader);
    moduleWrap.appendChild(cnDateNavWrap);
    moduleWrap.appendChild(cnRosterWrap);
    moduleWrap.appendChild(cnFormWrap);
    _DOM.ACTIONCENTER.appendChild(moduleWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  function initComponents() {
    // Date Navigation
    dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
      allowFutureDate: false,
    });

    // Roster Picker
    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
      consumerRequired: true,
    });

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
          data: cnData.getServiceBillCodeDropdownData(),
          defaultValue: cnData.getDefaultServiceCode(),
          includeBlankOption: true,
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
          note: 'Requires a consumer(s) to be selected',
        },
        //serviceLocation
        {
          type: 'select',
          label: 'Service Location',
          id: 'serviceLocation',
          hidden: $.session.applicationName === 'Gatekeeper',
          disabled: true,
        },
        //noteText
        {
          type: 'textarea',
          label: 'Note',
          id: 'noteText',
          required: true,
          fullscreen: true,
          speechToText: true,
          note: `Use the new quick insert key for phrases, type #ph. (#ph must not be apart of another word)`,
        },
        //mileage
        {
          type: 'number',
          label: 'Mileage',
          id: 'mileage',
          disabled: $.session.applicationName === 'Gatekeeper' ? true : false,
        },
        //travelTime
        {
          type: 'number',
          label: 'Travel Time',
          id: 'travelTime',
          hidden: $.session.applicationName === 'Advisor',
          disabled: true,
        },
        //attachment
        {
          type: 'attachment',
          label: 'Add Attachment',
          id: 'attachment',
          hidden: $.session.applicationName === 'Advisor',
        },
      ],
      buttons: [
        {
          type: 'submit',
          text: 'Save & New',
          icon: 'add',
          name: 'saveAndNew',
          style: 'primary',
          styleType: 'outlined',
        },
        {
          type: 'submit',
          text: 'Update',
          icon: 'save',
          name: 'update',
          hidden: true,
        },
      ],
    });
    cnFormToast = new Toast();

    // Overview Cards
    cnOverview = new CaseNotesOverview(cnData);

    // Phrases
    cnPhrases = new CaseNotesPhrases();

    // Documentation Timer
    if ($.session.applicationName === 'Gatekeeper') {
      cnDocTimer = new CaseNotesTimer();
      cnDocTimer.renderTo(cnFormWrap);
    }

    // Req Visualizer
    reqVisualizer = new AsyncRequestVisualizer();
    reqVisualizer.renderTo(_DOM.ACTIONCENTER);

    // Overlap Popup
    overlapPopup = new ConfirmationPopup({ className: 'overlapWarning' });
    overlapPopup.renderTo(_DOM.ACTIONCENTER);
  }
  async function init() {
    selectedDate = dates.getTodaysDateObj();
    caseManagerId = $.session.PeopleId;

    loadPageSkeleton();

    // init case notes data
    cnData = new CaseNotesData();
    await cnData.fetchDropdownData();
    await cnData.fetchCaseManagerReviewData(caseManagerId);
    if ($.session.applicationName === 'Advisor') {
      await cnData.fetchConsumersThatCanHaveMileage();
    }

    initComponents();
    await loadPage();
    await populatePage();

    checkRequiredFields();
  }

  return {
    init,
    resetModule,
  };
})();
