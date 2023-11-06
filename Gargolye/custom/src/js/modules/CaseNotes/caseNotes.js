//? Thoughts
//1. checkbox to toggle between seing only yours vs everyones notes in overview

//TODO-ASH: NO GROUP NOTES IF DOC TIME IS ALLOWED
//TODO-ASH: preSave() stops timer and speech to text
//TODO-ASH: when you click outside modal re enable textarea for fullscreen mode

const CaseNotes = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let caseNoteId = null;
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
  let caseManagerId;
  let reviewRequired;
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
  // other
  let mileageRequired;
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
  let cnNotifications;
  let cnDocTimer;

  function resetModule() {
    //TODO ASH
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
  function checkServiceFundingADV() {
    //! ADV ONLY
    // based off selected servBillCode
    // check its service funding value
    // if funding value is "N" - disable service location dropdown
    // else - enable dropdown, make required
  }
  // TIME HELPERS
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
  function checkRequiredFields() {
    const isFormValid = areAllFormFieldsValid();
    let isSaveDisabled = false;

    if (selectedConsumers.length === 0) {
      // cnValidation.showError({
      //   name: 'consumer',
      //   message: 'Consumer is required',
      // });
      // cnValidation.toggleErrorStatus('consumer', true);
      isSaveDisabled = true;
    } else {
      // cnValidation.toggleErrorStatus('consumer', false);
    }

    if (isSaveDisabled && !isFormValid) {
      cnForm.buttons['submit'].toggleDisabled(true);
    } else {
      cnForm.buttons['submit'].toggleDisabled(false);
    }
  }

  // DATA
  //--------------------------------------------------
  function convertSingleNoteToGroupNote() {
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
  async function deleteNote(noteId) {
    await _UTIL.fetchData('deleteExistingCaseNote', {
      noteId: noteId,
    });
  }
  async function updateNote() {
    //TODO: clean start time and end time:
    // endTime = endTime.length === 8 ? endTime.substring(0, 5) : endTime;
    // startTime = startTime.length === 8 ? startTime.substring(0, 5) : startTime;
    //? Different props from saveData
    // add -> groupNoteId, consumerId
    // remove -> reviewRequired
  }
  async function saveAttachments(saveCaseNoteResults) {
    const parser = new DOMParser();
    const respDoc = parser.parseFromString(saveCaseNoteResults, 'text/xml');
    const caseNoteId = respDoc.getElementsByTagName('caseNoteId')[0].childNodes[0].nodeValue;

    try {
      const saveAttachmentPromises = [];

      // Store promises in array so we can handle each attachment individually
      for (attachment in attachmentsForSave) {
        const promise = await _UTIL
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
        reqVisualizer.fullfill('success', 'Attachments Saved!', 2000);
      } else {
        reqVisualizer.fullfill('error', 'Error Saving Note Attachments', 2000);
      }
    } catch (error) {
      console.log('An unexpected error occurred:', error);
    }
  }
  async function saveNote(formData) {
    // let groupNoteId = await _UTIL.fetchData('getGroupNoteId');
    // groupNoteId = groupNoteId.getGroupNoteIdResult;
    const reqVisualizer = new AsyncRequestVisualizer();
    reqVisualizer.renderTo(_DOM.ACTIONCENTER);

    if (isNewNote) {
      reqVisualizer.show('Saving Case Note...');

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

      if (saveCaseNoteResults) {
        if ($.session.applicationName === 'Gatekeeper' && Object.keys(attachmentsForSave).length) {
          await reqVisualizer.showSuccess('Case Note Saved!', 2000);

          // save attachments
          reqVisualizer.showPending('Saving Note Attachments');

          await saveAttachments(saveCaseNoteResults);
        } else {
          reqVisualizer.fullfill('success', 'Case Note Saved!', 2000);
        }
      } else {
        reqVisualizer.fullfill('error', 'Error Saving Case Note', 2000);
      }
    }
  }

  // EVENTS & CALLBACKS
  //--------------------------------------------------
  function setupEventsForInstances() {
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
      await cnData.fetchVendorDropdownData({
        consumerId: selectedConsumers[0],
        serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
      });
      const vendorData = cnData.getVendorDropdownData();
      cnForm.inputs['vendor'].populate(vendorData);
      if (vendorData.length === 1) {
        cnForm.inputs['vendor'].setValue(vendorData[0].value);
      }

      if ($.session.applicationName === 'Advisor') {
        //* GATEKEEPER ALL CONSUMERS CAN HAVE MILEAGE
        if (cnData.canConsumerHaveMileage()) {
          cnForm.inputs['mileage'].toggleDisabled(false);
        }

        // Get Serv Locations By Consumer
        await cnData.fetchServiceLocationDropdownData({
          consumerId: selectedConsumers[0],
          serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
        });
        const servLocData = cnData.getServiceLocationDropdownData();
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
  function areAllFormFieldsValid() {
    const invalidControls = cnForm.form.querySelectorAll(':invalid');

    if (invalidControls.length === 0) {
      return false;
    }

    return true;
  }
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

      if ($.session.applicationName === 'Gatekeeper' && selectedServiceCode !== '') {
        mileageRequired = cnData.isMileageRequired(selectedServiceCode);
        isTravelTimeRequired = cnData.isTravelTimeRequired(selectedServiceCode);
        isDocTimeRequired = cnData.isDocTimeRequired(selectedServiceCode);
        allowGroupNotes = cnData.allowGroupNotes(selectedServiceCode);

        cnForm.inputs['mileage'].toggleDisabled(!mileageRequired);
        cnForm.inputs['travelTime'].toggleDisabled(!isTravelTimeRequired);
      } else {
        allowGroupNotes = true;

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
        timeOverlapCheck(value, endTimeVal);
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
        timeOverlapCheck(startTimeVal, value);
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
    attachments: async ({ event, value, name, input }) => {
      if (value) {
        // check file type
        const forbiddenTypes = new RegExp('(audio/)|(video/)');
        const isFileTypeValid = _UTIL.validateFileType(event, forbiddenTypes);

        if (!isFileTypeValid) return;

        // data for saving attachment
        const attachmentObj = await _DOM.getAttachmentDetails(event);
        attachmentsForSave[attachmentObj.description] = attachmentObj;

        // cache current id and update attachment id count
        const currentAttachmentId = attachmentCountForIDs === 0 ? 'attachments' : `attachments${attachmentCountForIDs}`;
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
        input.rootElement.insertAdjacentElement('beforebegin', newInputInstance.rootElement);

        // update label of new attachment
        input.rootElement.classList.add('hasFile');
        input.labelEle.innerText = _UTIL.truncateFilename(attachmentObj.description);
        const deleteIcon = Icon.getIcon('delete');
        input.labelEle.insertBefore(deleteIcon, input.labelEle.firstChild);
        deleteIcon.addEventListener('click', e => {
          e.stopPropagation();
          delete attachmentsForSave[attachmentObj.description];
          delete cnForm.inputs[currentAttachmentId];
          input.rootElement.remove();
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

  // MAIN
  //--------------------------------------------------
  async function loadPage() {
    // LOAD INSTANCES / BUILD & RENDER
    //-----------------------------------------
    // Notifications (error/warning messages)
    cnNotifications = new Notifications();

    // Date Navigation
    dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
      allowFutureDate: false,
    });
    dateNavigation.renderTo(cnDateNavWrap);

    // Roster Picker
    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
    });
    rosterPicker.renderTo(cnRosterWrap);

    // Documentation Timer
    cnDocTimer = new CaseNotesTimer();
    cnDocTimer.renderTo(cnFormWrap);

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

    // Overview
    cnOverview = new CaseNotesOverview();
    cnOverview.renderTo(moduleWrap);

    // Phrases
    cnPhrases = new CaseNotesPhrases();
    cnPhrases.renderTo(_DOM.ACTIONCENTER);

    // FETCH DATA / POPULATE
    //-----------------------------------------
    await cnPhrases.InsertPhrases.fetchData();
    cnPhrases.InsertPhrases.populate();
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();
    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();

    // EVENTS / CALLBACKS
    //-----------------------------------------
    setupEventsForInstances();
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

  // INIT/LOAD? (data & defaults)
  //--------------------------------------------------
  async function init() {
    loadPageSkeleton();

    // 1) init module data
    selectedDate = dates.getTodaysDateObj();
    caseManagerId = $.session.PeopleId;

    // 2) init case notes data
    cnData = new CaseNotesData();
    await cnData.fetchDropdownData();
    await cnData.fetchCaseManagerReviewData(caseManagerId);
    await cnData.fetchConsumersThatCanHaveMileage();
    reviewRequired = cnData.isReviewRequired();
    allowGroupNotes = cnData.allowGroupNotes();

    // 3) Load Case Notes w/Data
    await loadPage();

    checkRequiredFields();

    return;
    if ($.session.applicationName === 'Gatekeeper' && isReview) {
      await cnData.fetchAttachmentsGK(caseNoteId);
      attachmentList = cnData.getAttachmentsList();
    }
  }

  return {
    init,
    resetModule,
  };
})();
