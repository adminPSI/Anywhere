const CaseNotes = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let caseNoteId = null;
  let caseNoteEditData = {};
  let caseManagerId;
  let isGroupNote = false;
  let isNewNote = true;
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
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

  function resetModule() {
    //TODO-ASH
    _DOM.ACTIONCENTER.removeAttribute('data-ui');
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
    const allowGroupNotes = cnData.allowGroupNotes(selectedServiceCode);
    //TODO-ASH: NO GROUP NOTES IF DOC TIME IS ALLOWED
    rosterPicker.toggleMultiSelectOption(allowGroupNotes === 'Y' ? true : false);
  }
  function extractCaseNoteId(xmlString) {
    const match = xmlString.match(/<caseNoteId>(\d+)<\/caseNoteId>/);
    return match ? match[1] : null;
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

    let areTimesWithinWorkHours;

    if (!isWarningStartTimeValid || !isWarningEndTimeValid) {
      // session warning times don't matter
      areTimesWithinWorkHours = true;
    }

    const warnStart = parseSessionTime($.session.caseNotesWarningStartTime);
    const warnEnd = parseSessionTime($.session.caseNotesWarningEndTime);

    if (startTime < warnStart || startTime > warnEnd || endTime < warnStart || endTime > warnEnd) {
      areTimesWithinWorkHours = false;
    } else {
      areTimesWithinWorkHours = true;
    }

    if (areTimesWithinWorkHours) {
      // cnValidation.showWarning({
      //   name: 'workhours',
      //   message:
      //     'The times you have entered are outside the current normal working hours. Click OK to proceed or cacnel to return to the form.',
      // });
    } else {
      // cnValidation.hide('workhours');
    }
  }
  function isTimePastOrPresent(dirtyTime) {
    //If selectedDate is not today then time dosen't matter
    const isToday = new Date().setHours(0, 0, 0, 0) !== new Date(selectedDate).setHours(0, 0, 0, 0);
    if (!isToday || !dirtyTime) {
      return true;
    }

    const currentDate = new Date();
    const selectedDateClone = new Date(selectedDate);

    // CHECKS IF TIME IS IN FURUTRE
    dirtyTime = dirtyTime.split(':');
    selectedDateClone.setHours(dirtyTime[0], dirtyTime[1], 0, 0);
    return !dates.isAfter(selectedDateClone, currentDate);
  }
  function isStartTimeBeforeEndTime(startTime, endTime) {
    if (!startTime || !endTime) return true;

    return startTime < endTime ? true : false;
  }
  async function timeOverlapCheck(startTime, endTime) {
    const overlap = await cnData
      .fetchTimeOverlapData({
        caseManagerId,
        consumerId: selectedConsumers[0],
        endTime: endTime,
        groupNoteId: 0,
        noteId: 0,
        serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
        startTime: startTime,
      })
      .getOverlapData();

    if (overlap) {
      // cnValidation.showWarning({
      //   name: 'overlap',
      //   message: 'Overlap :(',
      // });
    } else {
      // cnValidation.hide('overlap');
    }
  }

  // VALIDATION / REQUIRED FIELDS
  //--------------------------------------------------
  function areAllFormFieldsValid() {
    const invalidControls = cnForm.form.querySelectorAll(':invalid');

    if (invalidControls.length > 0) {
      return false;
    }

    return true;
  }
  function checkRequiredFields() {
    const isFormValid = areAllFormFieldsValid();
    let isSaveDisabled = false;

    if (selectedConsumers.length === 0) {
      isSaveDisabled = true;
    } else {
      isSaveDisabled = false;
    }

    // if (isSaveDisabled || !isFormValid) {
    //   cnForm.buttons['submit'].toggleDisabled(true);
    //   cnForm.buttons['saveNew'].toggleDisabled(true);
    // } else {
    //   cnForm.buttons['submit'].toggleDisabled(false);
    //   cnForm.buttons['saveNew'].toggleDisabled(false);
    // }
  }

  // CRUD
  //--------------------------------------------------
  async function deleteNote(noteId) {
    const response = await _UTIL.fetchData('deleteExistingCaseNote', {
      noteId: noteId,
    });

    return response.deleteExistingCaseNoteResults;
  }
  async function saveAttachments(saveCaseNoteResults, attachmentsForSave) {
    const parser = new DOMParser();
    const respDoc = parser.parseFromString(saveCaseNoteResults, 'text/xml');
    const caseNoteId = respDoc.getElementsByTagName('caseNoteId')[0].childNodes[0].nodeValue;
    const cnID = extractCaseNoteId(saveCaseNoteResults);

    const saveAttachmentPromises = [];

    // Store promises in array so we can handle each attachment individually
    for (attachment in attachmentsForSave) {
      const promise = _UTIL
        .fetchData('addCaseNoteAttachment', {
          caseNoteId: caseNoteId,
          description: attachmentsForSave[attachment].description,
          attachmentType: attachmentsForSave[attachment].type,
          attachment: attachmentsForSave[attachment].arrayBuffer,
        })
        .then(result => ({ status: 'fulfilled', value: result }))
        .catch(error => ({ status: 'rejected', reason: error, attachment: attachmentsForSave[attachment] }));

      saveAttachmentPromises.push(promise);
    }

    // Loop through to check for any failed attachment saves
    const failedSaves = [];
    const saveAttachmentResults = await Promise.allSettled(saveAttachmentPromises);
    saveAttachmentResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedSaves.push(result.attachment.description);
      }
    });

    if (failedSaves.length === 0) {
      return 'success';
    } else {
      return 'error';
    }
  }
  async function updateGroupNote(formData) {
    const savePromises = [];
    selectedConsumers.forEach(consumerId => {
      formData.consumerId = consumerId;

      if (caseNoteEditData.consumerid === consumerId) {
        // A: for consumer already on note
        formData.noteId = caseNoteEditData.noteid;

        const saveNotePromise = _UTIL.fetchData('saveCaseNote', saveData);
        const updateGroupPromise = _UTIL.fetchData('updateGroupNoteValues', {
          groupNoteId: caseNoteEditData.groupid,
          noteId: caseNoteId,
          serviceOrBillingCodeId: saveData.serviceOrBillingCodeId,
          serviceDate: saveData.serviceDate,
          startTime: saveData.startTime,
          endTime: saveData.endTime,
        });

        savePromises.push(saveNotePromise);
        savePromises.push(updateGroupPromise);
      } else {
        // B: for newly added consumer
        formData.noteId = 0;

        const saveNotePromise = _UTIL.fetchData('saveAdditionalGroupCaseNote', saveData);
        const updateGroupPromise = _UTIL.fetchData('updateGroupNoteValues', {
          groupNoteId: caseNoteEditData.groupid,
          noteId: caseNoteId,
          serviceOrBillingCodeId: saveData.serviceOrBillingCodeId,
          serviceDate: saveData.serviceDate,
          startTime: saveData.startTime,
          endTime: saveData.endTime,
        });

        savePromises.push(saveNotePromise);
        savePromises.push(updateGroupPromise);
      }
    });

    const failedSaves = [];
    const groupSaveResults = await Promise.allSettled(savePromises);
    groupSaveResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedSaves.push(consumerId);
      }
    });

    if (failedSaves.length === 0) {
      return 'success';
    } else {
      return 'error';
    }
  }
  async function saveGroupNote(formData) {
    await deleteNote(caseNoteId);

    const groupNoteId = await _UTIL.fetchData('getGroupNoteId');
    const consumerGroupCount = selectedConsumers.length;

    const savePromises = [];
    selectedConsumers.forEach(consumerId => {
      const promise = _UTIL
        .fetchData('saveGroupCaseNote', {
          ...formData,
          consumerId,
          consumerGroupCount,
          groupNoteId,
        })
        .then(result => ({ status: 'fulfilled', value: result }))
        .catch(error => ({ status: 'rejected', reason: error }));

      savePromises.push(promise);
    });

    const failedSaves = [];
    const groupSaveResults = await Promise.allSettled(savePromises);
    groupSaveResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedSaves.push(consumerId);
      }
    });

    if (failedSaves.length === 0) {
      return 'success';
    } else {
      return 'error';
    }
  }

  // FORM
  //--------------------------------------------------
  // CHANGE
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
  function onServiceCodeChange() {
    if (caseNoteId) {
      checkGroupNotesPermission();
    }

    if ($.session.applicationName === 'Gatekeeper' && selectedServiceCode !== '') {
      const mileageRequired = cnData.isMileageRequired(selectedServiceCode);
      const isTravelTimeRequired = cnData.isTravelTimeRequired(selectedServiceCode);
      const isDocTimeRequired = cnData.isDocTimeRequired(selectedServiceCode);

      if (isDocTimeRequired) {
        cnDocTimer.showAutoStartPopup();
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
        if ($.session.applicationName === 'Gatekeeper') {
          timesWithinWorkHoursCheck(value, endTimeVal);
        }
        //timeOverlapCheck(value, endTimeVal);
      } else {
        // cnValidation.hide('overlap');
        // cnValidation.hide('workhours');
      }
    },
    endTime: ({ event, value, name, input }) => {
      const startTimeVal = cnForm.inputs['startTime'].getValue();

      const isEndValid = onEndTimeChange(startTimeVal, value);
      const isStartValid = onStartTimeChange(startTimeVal, value);

      if (isStartValid && isEndValid) {
        if ($.session.applicationName === 'Gatekeeper') {
          timesWithinWorkHoursCheck(startTimeVal, value);
        }
        //timeOverlapCheck(startTimeVal, value);
      } else {
        // cnValidation.hide('overlap');
        // cnValidation.hide('workhours');
      }
    },
    mileage: ({ event, value, name, input }) => {
      return;

      const hasDecimal = event.key === '.' && value.indexOf('.') === 1 ? true : false;
    },
    travelTime: ({ event, value, name, input }) => {},
    noteText: ({ event, value, name, input }) => {},
    confidential: ({ event, value, name, input }) => {},
  };
  function onFormChange(event) {
    const value = event.target.value;
    let name = event.target.name;
    const input = cnForm.inputs[name];

    if (!onChangeCallbacks[name]) return;

    onChangeCallbacks[name]({
      event,
      value,
      name,
      input,
    });

    checkRequiredFields();
  }
  // KEYUP
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

    if (!onKeyupCallbacks[name]) return;

    onKeyupCallbacks[name]({
      event,
      value,
      name,
      input,
    });

    checkRequiredFields();
  }
  // ATTACHMENT DELETE
  async function onFileDelete(e) {
    console.log(e.target);
    console.log('File delete from form', e.detail);
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
  async function onFormSubmit(data, submitter) {
    const attachmentsForSave = await processAttachmentsForSave(data);

    let saveCaseNoteResults, updateGroupValuesResults;

    const saveData = {
      caseManagerId,
      caseNote: data.noteText ? _UTIL.removeUnsavableNoteText(data.noteText) : '',
      casenotemileage: data.mileage ?? '0',
      casenotetraveltime: data.travelTime ?? '',
      consumerId: selectedConsumers[0],
      confidential: data.confidential === 'on' ? 'Y' : 'N',
      contactCode: data.contact ?? '',
      corrected: 'N',
      documentationTime: $.session.applicationName === 'Gatekeeper' ? cnDocTimer.getTime() : '',
      endTime: data.endTime ? data.endTime.substring(0, 5) : '',
      locationCode: data.location ?? '',
      noteId: caseNoteId ?? 0,
      needCode: data.need ?? '',
      reviewRequired: '',
      serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
      serviceCode: data.service ?? '',
      serviceLocationCode: data.serviceLocation ?? '',
      serviceOrBillingCodeId: data.serviceCode ?? '',
      startTime: data.startTime ? data.startTime.substring(0, 5) : '',
      vendorId: data.vendor ?? '',
    };

    if (selectedConsumers.length === 1) {
      reqVisualizer.show('Saving Case Note...');
      saveCaseNoteResults = (await _UTIL.fetchData('saveCaseNote', saveData)).saveCaseNoteResult;
      caseNoteId = extractCaseNoteId(saveCaseNoteResults);

      if (caseNoteEditData.groupid) {
        updateGroupValuesResults = (
          await _UTIL.fetchData('updateGroupNoteValues', {
            groupNoteId: caseNoteEditData.groupid,
            noteId: caseNoteId,
            serviceOrBillingCodeId: saveData.serviceOrBillingCodeId,
            serviceDate: saveData.serviceDate,
            startTime: saveData.startTime,
            endTime: saveData.endTime,
          })
        ).updateGroupNoteValuesResult;
      }

      if (saveCaseNoteResults) {
        reqVisualizer.fullfill('success', 'Case Note Saved!', 2000);

        caseNoteEditData = (
          await _UTIL.fetchData('getCaseNoteEditJSON', {
            noteId: caseNoteId,
          })
        ).getCaseNoteEditJSONResult[0];
      } else {
        reqVisualizer.fullfill('error', 'Error Saving Case Note', 2000);
      }
    } else {
      let saveGroupResults, updateGroupResults;

      if (!caseNoteEditData.groupid) {
        saveGroupResults = await saveGroupNote(saveData);
      } else {
        updateGroupResults = await updateGroupNote(saveData);
      }

      if (saveGroupResults === 'success' || updateGroupResults === 'success') {
        reqVisualizer.fullfill('success', 'Case Note Saved!', 2000);
      } else {
        reqVisualizer.fullfill('error', 'Error Saving Case Note', 2000);
      }
    }

    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();

    if (submitter.name.toLowerCase() === 'saveandnew') {
      cnForm.clear();
      caseNoteId = null;
      caseNoteEditData = {};
      caseManagerId = $.session.PeopleId;
    }
  }

  // ROSTER
  //--------------------------------------------------
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

    //TODO-ASH: re validate times when date change

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
    //TODO-ASH: crete checkbox for corrected (review only)

    // scroll to form
    _DOM.scrollToTop();

    // get edit data
    const editData = await _UTIL.fetchData('getCaseNoteEditJSON', {
      noteId: caseNoteId,
    });
    console.log(editData.getCaseNoteEditJSONResult[0]);

    caseNoteEditData = editData.getCaseNoteEditJSONResult[0];
    caseNoteId = noteId;
    caseManagerId = caseNoteEditData.casemanagerid;

    // set selected consumer
    selectedConsumers = [caseNoteEditData.consumerid];
    rosterPicker.setSelectedConsumers(selectedConsumers);

    // handle consumer related dropdowns
    await updateVendorDropdownByConsumer();
    if ($.session.applicationName === 'Advisor') {
      await updateServiceLocationDropdownByConsumer();

      if (cnData.canConsumerHaveMileage(selectedConsumers[0])) {
        cnForm.inputs['mileage'].toggleDisabled(false);
      }
    }

    // handle service/billing code related drodowns
    selectedServiceCode = caseNoteEditData.mainbillingorservicecodeid;
    onServiceCodeChange();

    // populate form with data
    cnForm.populate({
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
      confidential: caseNoteEditData.confidential === 'Y' ? true : false,
    });

    // display attachments
    if ($.session.applicationName === 'Gatekeeper') {
      await cnData.fetchAttachmentsGK(caseNoteId);
      const attachmentList = cnData.getAttachmentsList();
      cnForm.inputs['attachment'].addAttachments(attachmentList);
    }

    checkRequiredFields();
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    dateNavigation.onDateChange(onDateChange);
    rosterPicker.onConsumerSelect(onConsumerSelect);
    cnForm.onChange(onFormChange);
    cnForm.onKeyup(onFormKeyup);
    cnForm.onSubmit(onFormSubmit);
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
    cnForm.renderTo(cnFormWrap);
    cnOverview.renderTo(moduleWrap);
    cnPhrases.renderTo(_DOM.ACTIONCENTER);

    //*------------------------------------------
    //* CASE NOTES REVIEW BUTTON
    // const caseNotesReviewButton = new Button({
    //   type: 'submit',
    //   text: 'Review',
    //   name: 'cnreview',
    // }).renderTo(cnHeader);
    // caseNotesReviewButton.onClick(e => {
    //   cnReviewTable = new CaseNotesReviewTable();

    //   moduleWrap.innerHTML = '';

    //   cnReviewTable.renderTo(moduleWrap);
    // });
    //* CASE NOTES REVIEW BUTTON
    //*------------------------------------------

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
      ],
    });
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
