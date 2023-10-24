//! QUESTIONS FOR JOSH
//1. do we want to update the roster list of consumers on date change?
//2. how exactly do the '___ required' values we get from dropdown data effect the inputs

//? Thoughts
//1. checkbox to toggle between seing only yours vs everyones notes in overview
//2. list vs card view for overview on mobile?

//TODO: NO GROUP NOTES IF DOC TIME IS ALLOWED

// MAIN
const CaseNotes = (() => {
  // SESSION DATA
  //--------------------------
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
  let caseManagerId;
  // group notes
  let allowGroupNotes;
  let isGroupNote;
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

  // UI INSTANCES
  //--------------------------
  let dateNavigation;
  let rosterPicker;
  let cnForm;
  let cnOverview;
  let cnPhrases;

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
  function isTimeValid(dirtyTime) {
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
  // SAVE/UPDATE
  async function saveNote(formData) {
    if (selectedConsumers.length > 1) {
      //TODO: get group note ID
      //TODO: set group note ID to saveData
      //TODO: -- SAVE GROUP --
      //TODO: do overlap check
      //TODO: if overlap show popup
    } else {
      // Overlap check
      let overlap = await _UTIL.fetchData('caseNoteOverlapCheck', {
        caseManagerId,
        consumerId: selectedConsumers[0],
        endTime: formData.endTime,
        groupNoteId: 0,
        noteId: 0,
        serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
        startTime: formData.startTime,
      });
      overlap = overlap.caseNoteOverlapCheckResult;

      if (overlap) {
        //TODO show warning popup
        console.log('OVERLAP WARNING!!!!');
      } else {
        await _UTIL.fetchData('saveCaseNote', {
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
          servieOrBillingCodeId: formData.servieOrBillingCodeId,
          startTime: formData.startTime,
          vendorId: formData.vendorId,
        });
      }
      //TODO: if GK save attachments after note save
    }
  }
  async function updateNote() {
    //TODO: clean start time and end time:
    // endTime = endTime.length === 8 ? endTime.substring(0, 5) : endTime;
    // startTime = startTime.length === 8 ? startTime.substring(0, 5) : startTime;
    //? Different props from saveData
    // add -> groupNoteId, consumerId
    // remove -> reviewRequired
  }
  // DELETE
  async function deleteNote(noteId) {
    await _UTIL.fetchData('deleteExistingCaseNote', {
      noteId: noteId,
    });
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
    const data = await _UTIL.fetchData('getConsumersThatCanHaveMileageJSON');
    data = data.getConsumersThatCanHaveMileageJSONResult;
    return data.map(({ consumerid }) => consumerid);
  }
  async function getAttachmentsGK() {
    const data = await _UTIL.fetchData('getCaseNoteAttachmentsList', { caseNoteId: null });
    return data.getCaseNoteAttachmentsListResult;
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

    return;

    if ($.session.applicationName === 'Gatekeeper' && false) {
      attachmentList = await getAttachmentsGK();
    }
  }

  // MAIN
  //--------------------------------------------------
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
    location: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    service: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    serviceLocation: ({ event, value, name, input }) => {
      // adv only
      console.log('value:', value, 'name:', name);
    },
    need: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    vendor: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    contact: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    startTime: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
      const endTimeVal = cnForm.inputs['endTime'].getValue();

      const isStartBeforeEnd = isStartTimeBeforeEndTime(value, endTimeVal);
      const isValid = isTimeValid(value);

      if (!isStartBeforeEnd || !isValid) {
        isStartTimeValid = true;
        input.setValidtyError('Start Time is invalid');
      } else {
        isStartTimeValid = false;
        input.setValidtyError('');
      }
    },
    endTime: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
      const startTimeVal = cnForm.inputs['startTime'].getValue();

      const isStartBeforeEnd = isStartTimeBeforeEndTime(startTimeVal, value);
      const isValid = isTimeValid(value);

      if (!isStartBeforeEnd || !isValid) {
        isEndTimeValid = true;
        input.setValidtyError('End Time is invalid');
      } else {
        isEndTimeValid = false;
        input.setValidtyError('');
      }
    },
    mileage: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
      return;

      const hasDecimal = event.key === '.' && value.indexOf('.') === 1 ? true : false;
    },
    noteText: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    confidential: ({ event, value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
  };

  // INIT/LOAD? (data & defaults)
  //--------------------------------------------------
  async function init() {
    moduleWrap = _DOM.createElement('div', { class: 'caseNotesModule' });

    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('casenotes2.0');
    _DOM.ACTIONCENTER.appendChild(moduleWrap);

    await getInitialData();

    // DATE NAVIGATION
    //--------------------------------------------------
    dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
      async onDateChange(newDate) {
        selectedDate = newDate;

        //TODO: re validate times when date change

        //re populate overview section when date change
        await cnOverview.fetchData(selectedDate);
        cnOverview.populate();
      },
    });
    dateNavigation.build().renderTo(moduleWrap);

    // ROSTER PICKER
    //--------------------------------------------------
    rosterPicker = new RosterPicker({
      allowMultiSelect: true,
      async onConsumerSelect(data) {
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
          console.log(serviceLocationDropdownData);
          const servLocData = getServiceLocationDropdownData();
          cnForm.inputs['serviceLocation'].populate(servLocData);
        }
      },
    });
    await rosterPicker.fetchConsumers();
    rosterPicker.build().renderTo(moduleWrap);

    // FORM
    //--------------------------------------------------
    cnForm = new Form({
      elements: [
        {
          type: 'checkbox',
          label: 'Confidential',
          id: 'confidential',
        },
        {
          type: 'time',
          label: 'Start Time',
          id: 'startTime',
          required: true,
        },
        {
          type: 'time',
          label: 'End Time',
          id: 'endTime',
          required: true,
        },
        {
          type: 'select',
          label: $.session.applicationName === 'Gatekeeper' ? 'Bill Code:' : 'Serv. Code:',
          id: 'serviceCode',
          required: true,
          data: getServiceBillCodeDropdownData(),
          defaultValue: null,
          includeBlankOption: true,
        },
        {
          type: 'select',
          label: 'Location',
          id: 'location',
          disabled: true,
        },
        {
          type: 'select',
          label: 'Service',
          id: 'service',
          disabled: true,
        },
        {
          type: 'select',
          label: 'Need',
          id: 'need',
          disabled: true,
        },
        {
          type: 'select',
          label: 'Contact',
          id: 'contact',
          disabled: true,
        },
        {
          type: 'select',
          label: 'Vendor',
          id: 'vendor',
        },
        {
          type: 'select',
          label: 'Service Location',
          id: 'serviceLocation',
          hidden: $.session.applicationName === 'Gatekeeper',
        },
        {
          type: 'textarea',
          label: 'Note',
          id: 'noteText',
          required: true,
          fullscreen: true,
        },
        {
          type: 'number',
          label: 'Mileage',
          id: 'mileage',
          disabled: true,
        },
      ],
    });
    cnForm.build().renderTo(moduleWrap);
    cnForm.onChange(event => {
      const value = event.target.value;
      const name = event.target.name;
      const input = cnForm.inputs[name];

      if (!onChangeCallbacks[name]) return;

      onChangeCallbacks[name]({
        event,
        value,
        name,
        input,
      });
    });
    cnForm.onSubmit(data => {
      console.log('onSubmit ', data);

      preSaveValidation({
        caseNote: data.noteText ?? '',
        casenotemileage: data.mileage ?? '0',
        confidential: data.confidential === 'on' ? 'Y' : 'N',
        contactCode: data.contact ?? '',
        endTime: data.endTime ?? '',
        locationCode: data.location ?? '',
        needCode: data.need ?? '',
        serviceCode: data.service ?? '',
        serviceLocationCode: data.serviceLocation ?? '',
        servieOrBillingCodeId: data.serviceCode ?? '',
        startTime: data.startTime ?? '',
        vendorId: data.vendor ?? '',
      });
    });

    // PHRASES
    //--------------------------------------------------
    // const showAllPhrases = _UTIL.localStorageHandler.get('casenotes-showAllPhrases');
    // cnPhrases = new CaseNotesPhrases({
    //   formNote: cnForm.inputs['noteText'],
    //   showAllPhrases: showAllPhrases === 'Y' ? true : false,
    // });
    // cnPhrases.build().renderTo(cnForm.inputs['noteText'].fullscreen.fullScreenDialog.dialog);
    // await cnPhrases.fetchData();

    // TIMERS
    //--------------------------------------------------

    // OVERVIEW
    //--------------------------------------------------
    cnOverview = new CaseNotesOverview();
    cnOverview.build().renderTo(moduleWrap);
    await cnOverview.fetchData(selectedDate);
    cnOverview.populate();
  }

  return {
    init,
  };
})();
