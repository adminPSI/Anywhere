// MAIN
const CaseNotes = (() => {
  // Session Data
  let selectedConsumers = [];
  let selectedDate = null;
  let selectedServiceCode;
  let allowGroupNotes;
  let reviewRequired;
  let locationRequired;
  let needRequired;
  let contactRequired;
  let serviceRequired;
  let mileageRequired;
  let docTimeRequired;
  let travelTimeRequired;
  // Data from fetch
  let dropdownData;
  let billerDropdownData;
  let vendorDropdownData;
  let serviceLocationDropdownData;
  let caseManagerReview;
  let consumersThatCanHaveMileage;
  let attachmentList;
  // DOM
  let moduleWrap;
  // UI Instances
  let dateNavigation;
  let rosterPicker;
  let cnForm;

  // UTILS
  //--------------------------------------------------
  function isReadOnly(credit) {
    // credit comes from review data
    return credit === 'Y' || credit === '-1' ? true : false;
  }
  function validateTime(dirtyTime) {
    const currentDate = new Date();
    let selectedDate = new Date(selectedDate);
    dirtyTime = dirtyTime.split(':');
    selectedDate.setHours(dirtyTime[0], dirtyTime[1], 0, 0);
    return dates.isAfter(selectedDate, currentDate);
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
    //caseManagerReview.serviceid = DEFAULT VALUE
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
    serviceCode: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
      //TODO: set selectedServiceCode
      selectedServiceCode = value;
      //TODO: set required fields
      locationRequired = dropdownData[selectedServiceCode].locationRequired;
      needRequired = dropdownData[selectedServiceCode].needRequired;
      contactRequired = dropdownData[selectedServiceCode].contactRequired;
      serviceRequired = dropdownData[selectedServiceCode].serviceRequired;
      if ($.session.applicationName === 'Gatekeeper') {
        mileageRequired = dropdownData[selectedServiceCode].mileageRequired;
        docTimeRequired = dropdownData[selectedServiceCode].docTimeRequired;
        travelTimeRequired = dropdownData[selectedServiceCode].travelTimeRequired;
        allowGroupNotes = dropdownData[selectedServiceCode].allowGroupNotes;
      }
      //TODO: toggle required attribute on inputs based on above, make sure to check if dropdowns have values if not remove required
      //TODO: populate dropdowns tied to this one
      cnForm.inputs['location'].populate(getLocationDropdownData());
      cnForm.inputs['service'].populate(getServicesDropdownData());
      cnForm.inputs['need'].populate(getNeedsDropdownData());
      cnForm.inputs['contact'].populate(getContactsDropdownData());
      //TODO: checkServiceFunding()
      //TODO: ? checkRequiredFields()
    },
    location: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    service: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    serviceLocation: ({ value, name, input }) => {
      // adv only
      console.log('value:', value, 'name:', name);
    },
    need: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    vendor: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    contact: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    startTime: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
      validateTime(value);
    },
    endTime: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
      validateTime(value);
    },
    mileage: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    noteText: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
    confidential: ({ value, name, input }) => {
      console.log('value:', value, 'name:', name);
    },
  };

  // MAIN
  //--------------------------------------------------
  async function loadPage() {
    moduleWrap = _DOM.createElement('div', { id: 'UI', class: 'caseNotesModule' });

    // DATE NAVIGATION
    //--------------------------------------------------
    dateNavigation = new DateNavigation({
      selectedDate: selectedDate,
      onDateChange(newDate) {
        selectedDate = newDate;
      },
    });
    dateNavigation.build().renderTo(moduleWrap);

    // ROSTER PICKER
    //--------------------------------------------------
    rosterPicker = new RosterPicker({
      allowMultiSelect: true,
      async onConsumerSelect(data) {
        selectedConsumers = data;

        vendorDropdownData = await _UTIL.fetchData('getConsumerSpecificVendorsJSON', {
          consumerId: selectedConsumers[0],
          serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
        });
        vendorDropdownData = vendorDropdownData.getConsumerSpecificVendorsJSONResult;
        console.log(vendorDropdownData);
        const ddData = getVendorDropdownData();
        cnForm.inputs['vendor'].populate(ddData);
      },
    });
    await rosterPicker.fetchConsumers();
    rosterPicker.build().renderTo(moduleWrap);

    // FORM
    //--------------------------------------------------
    cnForm = new Form({
      elements: [
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
        },
        {
          type: 'select',
          label: 'Service',
          id: 'service',
        },
        {
          type: 'select',
          label: 'Need',
          id: 'need',
        },
        {
          type: 'select',
          label: 'Vendor',
          id: 'vendor',
        },
        {
          type: 'select',
          label: 'Contact',
          id: 'contact',
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
          type: 'number',
          label: 'Mileage',
          id: 'mileage',
        },
        {
          type: 'text',
          label: 'Note',
          id: 'noteText',
          required: true,
        },
        {
          type: 'select',
          label: 'Service Location',
          id: 'serviceLocation',
          hidden: $.session.applicationName === 'Advisor',
        },
        {
          type: 'checkbox',
          label: 'Confidential',
          id: 'confidential',
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
        value,
        name,
        input,
      });
    });

    //---------------------------------------------------
    DOM.ACTIONCENTER.appendChild(moduleWrap);
  }

  async function init() {
    DOM.clearActionCenter();

    const today = dates.getTodaysDateObj();
    selectedDate = today;

    dropdownData = await _UTIL.fetchData('populateDropdownData');
    dropdownData = dealWithDropdownDataHugeString(dropdownData.populateDropdownDataResult);
    console.log(dropdownData);

    caseManagerReview = await _UTIL.fetchData('getReviewRequiredForCaseManager', {
      caseManagerId: $.session.PeopleId,
    });
    caseManagerReview = caseManagerReview.getReviewRequiredForCaseManagerResult;
    reviewRequired = caseManagerReview.reviewrequired ? 'N' : 'Y';
    console.log(caseManagerReview);

    // serviceLocationDropdownData = await _UTIL.fetchData('getServiceLocationsForCaseNoteDropdown', {
    //   consumerId: null,
    //   serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
    // });
    // serviceLocationDropdownData = serviceLocationDropdownData.getServiceLocationsForCaseNoteDropdownResult;
    // console.log(serviceLocationDropdownData);

    // ADVISOR ONLY
    if ($.session.applicationName === 'Advisor') {
      // consumersThatCanHaveMileage = await _UTIL.fetchData('getConsumersThatCanHaveMileageJSON');
      // consumersThatCanHaveMileage = consumersThatCanHaveMileage.getConsumersThatCanHaveMileageJSONResult;
      // console.log(consumersThatCanHaveMileage);
    }

    // GK & REVIEW ONLY
    if ($.session.applicationName === 'Gatekeeper' && false) {
      // attachmentList = await _UTIL.fetchData('getCaseNoteAttachmentsList', { caseNoteId: null });
      // attachmentList = attachmentList.getCaseNoteAttachmentsListResult;
    }

    loadPage();
  }

  return {
    init,
    onChangeCallbacks,
  };
})();
