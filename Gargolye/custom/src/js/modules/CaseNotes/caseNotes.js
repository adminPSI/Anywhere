//TODO: Finsih UI Form Component
//TODO: - events for individual inputs for validation, etc..
//TODO: - input default values
//TODO: - clear form method
//TODO: - ability to populate form after its been built/appended to DOM
//TODO: Need a textarea input function (like select)

// MAIN
const CaseNotes = (() => {
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
    let dropdownData = {};

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

    //dropdownDataKeys = Object.keys(dropdownData);
    return dropdownData;
  }

  async function loadPage() {
    const moduleWrap = _DOM.createElement('div', { id: 'UI', class: 'caseNotesModule' });

    // DATE NAVIGATION
    //--------------------------------------------------
    const dateNavigation = new DateNavigation({
      onDateChange(selectedDate) {
        // do stuff with newly selected date
        console.log('onDateChange', selectedDate);
      },
    });

    dateNavigation.build().renderTo(moduleWrap);

    // ROSTER PICKER
    //--------------------------------------------------
    const rosterPicker = new RosterPicker();
    //groupCode: 'CAS' for caseload only
    // move retrieve data for fetchConsumers inside RosterPIcker
    await rosterPicker.fetchConsumers({
      groupCode: 'ALL',
      retrieveId: '0',
      serviceDate: '2023-10-05',
      daysBackDate: '2023-06-28',
      onConsumerSelect(data) {
        console.log('Selected Consumer(s)', data);
      },
    });
    rosterPicker.build().renderTo(moduleWrap);

    // FORM
    //--------------------------------------------------
    const cnForm = new Form({
      elements: [
        {
          type: 'select',
          label: $.session.applicationName === 'Gatekeeper' ? 'Bill Code:' : 'Serv. Code:',
          id: 'serviceCode',
          required: true,
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
          label: 'Service Location',
          id: 'serviceLocation',
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
          type: 'checkbox',
          label: 'Confidential',
          id: 'confidential',
        },
      ],
      onSubmit(data) {
        console.log('onSubmit ', data);
      },
      onChange(target, targetValue) {
        console.log('onChange ', target, targetValue);
      },
    });
    cnForm.build().renderTo(moduleWrap);
    console.log(cnForm);

    DOM.ACTIONCENTER.appendChild(moduleWrap);
  }

  async function init() {
    DOM.clearActionCenter();

    // { tons of shit }
    let dropdownData = await _UTIL.fetchData('populateDropdownData');
    dropdownData = dealWithDropdownDataHugeString(dropdownData.populateDropdownDataResult);
    console.log(dropdownData);

    // { billerId, billerName }
    let billerDropdownData = await _UTIL.fetchData('getBillersListForDropDownJSON');
    billerDropdownData = billerDropdownData.getBillersListForDropDownJSONResult;
    console.log(billerDropdownData);

    // {}
    // let vendorDropdownData = await _UTIL.fetchData('getConsumerSpecificVendorsJSON', {
    //   consumerId: null,
    //   serviceDate: null,
    // });
    // vendorDropdownData = vendorDropdownData.getConsumerSpecificVendorsJSONResult;
    // console.log(vendorDropdownData);

    // {}
    // let serviceLocationDropdownData = await _UTIL.fetchData('getConsumerSpecificVendorsJSON', {
    //   consumerId: null,
    //   serviceDate: null,
    // });
    // serviceLocationDropdownData = serviceLocationDropdownData.getConsumerSpecificVendorsJSONResult;
    // console.log(serviceLocationDropdownData);

    // { reviewrequired, servicecode, serviceid }
    let caseManagerReview = await _UTIL.fetchData('getReviewRequiredForCaseManager', {
      caseManagerId: $.session.PeopleId,
    });
    caseManagerReview = caseManagerReview.getReviewRequiredForCaseManagerResult;
    console.log(caseManagerReview);

    // ADVISOR ONLY
    if ($.session.applicationName === 'Advisor') {
      let consumersThatCanHaveMileage = await _UTIL.fetchData('getConsumersThatCanHaveMileageJSON');
      consumersThatCanHaveMileage = consumersThatCanHaveMileage.getConsumersThatCanHaveMileageJSONResult;
      console.log(consumersThatCanHaveMileage);
    }

    // GK & REVIEW ONLY
    if ($.session.applicationName === 'Gatekeeper' && false) {
      let attachmentList = await _UTIL.fetchData('getCaseNoteAttachmentsList', { caseNoteId: null });
      attachmentList = attachmentList.getCaseNoteAttachmentsListResult;
    }

    loadPage();
  }

  return {
    init,
  };
})();
