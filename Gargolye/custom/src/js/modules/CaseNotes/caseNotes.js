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

  // DATA
  //--------------------------------------------------
  // SAVE/UPDATE
  // var overlapData = {
  //   consumerId,
  //   startTime,
  //   endTime,
  //   serviceDate,
  //   caseManagerId,
  //   noteId: 0,
  //   groupNoteId: 0,
  // };
  // var saveData = {
  //   caseManagerId,
  //   noteId,
  //   // dropdowns
  //   serviceOrBillingCodeId: serviceCode,
  //   locationCode: locationId,
  //   serviceCode: serviceId,
  //   needCode: needId,
  //   serviceDate,
  //   startTime,
  //   endTime,
  //   vendorId: vendorInput.options[vendorInput.selectedIndex].value,
  //   contactCode: contactId,
  //   serviceLocationCode: serviceLocationId,
  //   caseNote: noteText, // from note input
  //   confidential, // from checkbox
  //   corrected, // from checkbox
  //   casenotemileage: String(mileage) === 'null' ? '0' : String(mileage),
  //   casenotetraveltime: String(travelTime),
  //   documentationTime: String(documentationTime),
  //   reviewRequired,
  // };
  async function saveNote() {}
  async function updateNote() {
    //TODO: clean start time and end time:
    // endTime = endTime.length === 8 ? endTime.substring(0, 5) : endTime;
    // startTime = startTime.length === 8 ? startTime.substring(0, 5) : startTime;
    //? Different props from saveData
    // add -> groupNoteId, consumerId
    // remove -> reviewRequired
  }
  // DELETE
  // GET
  async function getDropdownData() {
    const data = await _UTIL.fetchData('populateDropdownData');
    return dealWithDropdownDataHugeString(data.populateDropdownDataResult);
  }
  async function getCaseManagerReviewData() {
    const data = await _UTIL.fetchData('getReviewRequiredForCaseManager', {
      caseManagerId: $.session.PeopleId,
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
  /**
   * Sets default selected date and fetchs initial data for case
   * notes form including dropdown data, case manager review permissions
   * and consumers that can have mileage
   *
   * @function
   */
  async function getInitialDataForForm() {
    selectedDate = setDefaultSelectedDate();

    dropdownData = await getDropdownData();

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

  // FORM ON CHANGE CALLBACKS
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

      if (isStartTimeBeforeEndTime(value, endTimeVal) && isTimeValid(value)) {
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

      if (isStartTimeBeforeEndTime(startTimeVal, value) && isTimeValid(value)) {
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

  // MAIN
  //--------------------------------------------------

  // INIT/LOAD? (data & defaults)
  //--------------------------------------------------
  async function init() {
    moduleWrap = _DOM.createElement('div', { id: 'UI', class: 'caseNotesModule' });

    DOM.clearActionCenter();
    DOM.ACTIONCENTER.appendChild(moduleWrap);

    await getInitialDataForForm();

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
    cnForm.onSubmit(data => {
      console.log('onSubmit ', data);
      console.log(cnForm);

      //TODO: preSave() stops timer and speech to text
      //TODO: areTimesWithinWorkHours();
      //TODO: UTIL.removeUnsavableNoteText

      if (!isGroupNote && allowGroupNotes) {
        //TODO: delete existing case note
        //TODO: isGroupNote = true
        //TODO: set noteId = 0?
        //TODO: if (travelTime === null) travelTime = 0;
        //TODO: if (documentationTime === null) documentationTime = 0;
        //TODO: endTime = endTime.substring(0, 5);
        //TODO: startTime = startTime.substring(0, 5);
        //TODO: set page load to new?
      }

      //TODO: call saveNote or updateNote
    });
    cnForm.onChange(event => {
      const value = event.target.value;
      const name = event.target.name;
      const input = cnForm.inputs[name];

      onChangeCallbacks[name]({
        event,
        value,
        name,
        input,
      });
    });

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
