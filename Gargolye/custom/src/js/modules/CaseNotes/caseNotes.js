//! QUESTIONS FOR JOSH
//1. do we want to update the roster list of consumers on date change?
//2. how exactly do the '___ required' values we get from dropdown data effect the inputs

//? Thoughts
//1. checkbox to toggle between seing only yours vs everyones notes in overview
//2. list vs card view for overview on mobile?

// MAIN
const CaseNotes = (() => {
  //==================
  // FORM & FRIENDS
  //------------------
  // Session Data
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
  // Data from fetch
  let dropdownData;
  let billerDropdownData = [];
  let vendorDropdownData = [];
  let serviceLocationDropdownData = [];
  let caseManagerReview;
  let consumersThatCanHaveMileage;
  let attachmentList;
  // DOM
  let moduleWrap;
  // UI Instances
  let dateNavigation;
  let rosterPicker;
  let cnForm;

  //*==================================================
  //* OVERVIEW
  //*--------------------------------------------------
  // Session Data
  let caseLoadOnly;
  let viewEntered;
  let reviewGroups = {};
  let reviewConsumers = [];
  // Data from fetch
  let caseLoadRestrictions;
  let caseLoadReviewData = [];

  // UTILS
  //--------------------------------------------------
  function setGroupsAndTableConsumers(data) {
    // GROUPING
    if (data.numberInGroup !== 1) {
      const groupNoteId = data.groupnoteid.split('.')[0];
      const consumerId = data.consumerid.split('.')[0];
      const name = `${data.lastname}, ${data.firstname}`;

      groups[groupNoteId] = groups[groupNoteId] ?? {};
      groups[groupNoteId][consumerId] = name;
    }

    // TABLE CONSUMERS
    tableConsumers.push({
      id: data.casenoteid.split('.')[0],
      FirstName: data.firstname,
      LastName: data.lastname,
    });
  }

  // MAIN
  //--------------------------------------------------
  function loadOverviewPage() {
    const overviewWrap = _DOM.createElement('div', { class: 'caseNotesOverview', node: [overviewSearch] });

    const overviewSearch = new Input({
      type: 'search',
      id: 'overviewSearch',
      name: 'overviewSearch',
      placeholder: 'Search...',
    });

    const overviewCardsWrap = _DOM.createElement('div', { class: 'overviewCardsWrap' });

    caseLoadReviewData.forEach(rd => {
      // DATA
      //---------------
      const starttime = UTIL.convertFromMilitary(rd.starttime);
      const endtime = UTIL.convertFromMilitary(rd.endtime);
      const timeSpan = `${starttime} - ${endtime}`;
      const timeDifference = _UTIL.getMilitaryTimeDifference(rd.starttime, rd.endtime);
      const name = `${rd.lastname}, ${rd.firstname}`;
      const enteredBy = `${rd.enteredby} (lastname, firstname)`; // this is user name as of now
      const mostRecentUpdate = rd.mostrecentupdate; // need to format this badboy

      //* GK ONLY
      const attachmentCount = rd.attachcount; // if > 0 then will show gree attachment icon

      // DOM
      //---------------
      // card items
      const timeSpanEle = _DOM.createElement('p', { class: '', text: timeSpan });
      const totalTimeEle = _DOM.createElement('p', { class: '', text: timeDifference });
      const consumerNameEle = _DOM.createElement('p', { class: '', text: name });
      const editButton = new Button({
        text: 'edit',
      });
      const deleteButton = new Button({
        text: 'delete',
      });

      // card layout
      const cardLeft = _DOM.createElement('div', {
        class: 'overviewCard__Left',
        node: [timeSpanEle, totalTimeEle, editButton, deleteButton],
      });
      const cardCenter = _DOM.createElement('div', { class: 'overviewCard__Center', node: [consumerNameEle] });
      const cardRight = _DOM.createElement('div', { class: 'overviewCard__Right' });

      const overviewCard = _DOM.createElement('div', {
        class: 'overviewCard',
        node: [cardLeft, cardCenter, cardRight],
      });

      overviewCardsWrap.appendChild(overviewCard);
    });

    moduleWrap.appendChild(overviewWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  async function initOverview() {
    caseLoadOnly = $.session.CaseNotesCaseloadRestrictions;
    viewEntered = $.session.CaseNotesViewEntered;

    if (caseLoadOnly) {
      caseLoadRestrictions = await _UTIL.fetchData('getCaseLoadRestriction');
      caseLoadRestrictions = caseLoadRestrictions.getCaseLoadRestrictionResult;
    }

    caseLoadReviewData = await _UTIL.fetchData('caseNotesFilteredSearchJSON', {
      applicationName: $.session.applicationName,
      attachments: '%',
      billerId: $.session.PeopleId,
      billingCode: '%',
      billed: '%',
      consumerId: '%',
      contact: '%',
      confidential: '%',
      corrected: '%',
      dateEnteredStart: dates.formatISO(selectedDate, { representation: 'date' }),
      dateEnteredEnd: dates.formatISO(selectedDate, { representation: 'date' }),
      location: '%',
      need: '%',
      noteText: '%%%',
      overlaps: 'N',
      reviewStatus: '%',
      service: '%',
      serviceStartDate: dates.formatISO(selectedDate, { representation: 'date' }),
      serviceEndDate: dates.formatISO(selectedDate, { representation: 'date' }),
    });
    caseLoadReviewData = caseLoadReviewData.caseNotesFilteredSearchJSONResult;
    caseLoadReviewData = caseLoadReviewData.filter(data => {
      setGroupsAndTableConsumers(data, groups, tableConsumers);

      // For VIEW ENTERED & CASELOAD ONLY
      if (viewEntered && caseloadOnly) {
        const enteredByUser = data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
        const onCaseload = caseLoadRestriction.some(
          cl => cl.id.toUpperCase() === data.consumerid.split('.')[0].toUpperCase(),
        );
        return enteredByUser || onCaseload;
      }

      // For VIEW ENTERED only
      if (viewEntered) {
        return data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
      }

      // For CASELOAD ONLY
      if (caseloadOnly) {
        return caseLoadRestriction.some(cl => cl.id === data.consumerid.split('.')[0]);
      }

      return true; // If no conditions met, return the data as is
    });

    loadOverviewPage();
  }

  //*==================================================

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
  function checkServiceFunding() {
    //! ADV ONLY
    // based off selected servBillCode
    // check its service funding value
    // if funding value is "N" - disable service location dropdown
    // else - enable dropdown, make required
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

      let mileageRequired, docTimeRequired, travelTimeRequired, allowGroupNotes;

      if ($.session.applicationName === 'Gatekeeper') {
        mileageRequired = dropdownData[selectedServiceCode].mileageRequired;
        docTimeRequired = dropdownData[selectedServiceCode].docTimeRequired;
        travelTimeRequired = dropdownData[selectedServiceCode].travelTimeRequired;
        allowGroupNotes = dropdownData[selectedServiceCode].allowGroupNotes;

        cnForm.inputs['mileage'].toggleDisabled(mileageRequired !== 'Y');
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

      if (
        isStartTimeBeforeEndTime(value, endTimeVal) &&
        isTimeValid(value) &&
        areTimesWithinWorkHours(value, endTimeVal)
      ) {
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

      if (
        isStartTimeBeforeEndTime(startTimeVal, value) &&
        isTimeValid(value) &&
        areTimesWithinWorkHours(startTimeVal, value)
      ) {
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
  async function loadPage() {
    // DATE NAVIGATION
    //--------------------------------------------------
    dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
      onDateChange(newDate) {
        selectedDate = newDate;
        //TODO: re validate times based off new date
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
        console.log(vendorDropdownData);
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
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  async function init() {
    moduleWrap = _DOM.createElement('div', { id: 'UI', class: 'caseNotesModule' });
    DOM.clearActionCenter();
    DOM.ACTIONCENTER.appendChild(moduleWrap);

    const today = dates.getTodaysDateObj();
    today.setHours(0, 0, 0, 0);
    selectedDate = today;

    dropdownData = await _UTIL.fetchData('populateDropdownData');
    dropdownData = dealWithDropdownDataHugeString(dropdownData.populateDropdownDataResult);
    console.log(dropdownData);

    caseManagerReview = await _UTIL.fetchData('getReviewRequiredForCaseManager', {
      caseManagerId: $.session.PeopleId,
    });
    caseManagerReview = caseManagerReview.getReviewRequiredForCaseManagerResult;
    reviewRequired = !caseManagerReview.reviewrequired ? 'N' : 'Y';
    console.log(caseManagerReview);

    // ADVISOR ONLY
    if ($.session.applicationName === 'Advisor') {
      //! GATEKEEPER ALL CONSUMERS CAN HAVE MILEAGE
      //? For now going to leave this init, if init gets slow this can be moved to
      //? rosterPicker event and setup to only run once.
      consumersThatCanHaveMileage = await _UTIL.fetchData('getConsumersThatCanHaveMileageJSON');
      consumersThatCanHaveMileage = consumersThatCanHaveMileage.getConsumersThatCanHaveMileageJSONResult;
      consumersThatCanHaveMileage = consumersThatCanHaveMileage.map(({ consumerid }) => consumerid);

      console.log(consumersThatCanHaveMileage);
    }

    await loadPage();

    initOverview();

    return;
    // GK & REVIEW ONLY
    if ($.session.applicationName === 'Gatekeeper' && false) {
      attachmentList = await _UTIL.fetchData('getCaseNoteAttachmentsList', { caseNoteId: null });
      attachmentList = attachmentList.getCaseNoteAttachmentsListResult;
    }
  }

  return {
    init,
    onChangeCallbacks,
  };
})();
