(function (global, factory) {
  global.CaseNotesData = factory();
})(this, function () {
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

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Constructor function for creating a Case Notes Data set.
   *
   * @constructor
   * @returns {CaseNotesData}
   */
  function CaseNotesData() {
    // Review Data
    this.caseLoadOnly = $.session.CaseNotesCaseloadRestrictions;
    this.viewEntered = $.session.CaseNotesViewEntered;
    this.caseLoadRestrictions = null;
    this.reviewGroups = {};
    this.reviewConsumers = [];

    // Dropdown Data
    this.dropdownData = {};
    this.vendorDropdownData = [];
    this.serviceLocationDropdownData = [];

    // case manager related
    this.caseManagerReview = {};
    this.reviewRequired = null;
    this.defaultServiceCode = null;

    // Other Data
    this.consumersThatCanHaveMileage = [];
    this.attachmentList = null;
    this.overlapData = null;
  }

  // FETCH DATA
  //---------------------------------------
  /**
   * @function
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchDropdownData = async function () {
    const data = await _UTIL.fetchData('populateDropdownData');
    this.dropdownData = dealWithDropdownDataHugeString(data.populateDropdownDataResult);

    return this;
  };
  /**
   * @function
   * @param {String} selectedConsumerId
   * @param {Date} selectedDate
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchVendorDropdownData = async function ({ consumerId, serviceDate }) {
    const data = await _UTIL.fetchData('getConsumerSpecificVendorsJSON', {
      consumerId,
      serviceDate,
    });
    this.vendorDropdownData = data.getConsumerSpecificVendorsJSONResult;

    return this;
  };
  /**
   * @function
   * @param {String} selectedConsumerId
   * @param {Date} selectedDate
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchServiceLocationDropdownData = async function ({ consumerId, serviceDate }) {
    const data = await _UTIL.fetchData('getServiceLocationsForCaseNoteDropdown', {
      consumerId,
      serviceDate,
    });
    this.serviceLocationDropdownData = data.getServiceLocationsForCaseNoteDropDownResult;

    return this;
  };
  /**
   * @function
   * @param {String} caseManagerId
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchCaseManagerReviewData = async function (caseManagerId) {
    const data = await _UTIL.fetchData('getReviewRequiredForCaseManager', {
      caseManagerId,
    });
    this.caseManagerReview = data.getReviewRequiredForCaseManagerResult[0];
    this.reviewRequired = !this.caseManagerReview.reviewrequired ? 'N' : 'Y';
    this.defaultServiceCode = this.caseManagerReview.serviceid;

    return this;
  };
  /**
   * @function
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchConsumersThatCanHaveMileage = async function () {
    //* GATEKEEPER ALL CONSUMERS CAN HAVE MILEAGE
    //if ($.session.applicationName === 'Gatekeeper') return this;

    let data = await _UTIL.fetchData('getConsumersThatCanHaveMileageJSON');
    data = data.getConsumersThatCanHaveMileageJSONResult;
    this.consumersThatCanHaveMileage = data.map(({ consumerid }) => consumerid);

    return this;
  };
  /**
   * @function
   * @param {String} caseNoteId
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchAttachmentsGK = async function (caseNoteId) {
    // const data = await _UTIL.fetchData('getCaseNoteAttachmentsList', { caseNoteId });
    // this.attachmentList = data.getCaseNoteAttachmentsListResult;
    // console.log(data);

    const data2 = await _UTIL.fetchData('getCaseNoteAttachmentsListForGroupNote', { caseNoteId });
    this.attachmentList = data2.getCaseNoteAttachmentsListForGroupNoteResult;
    console.log(data2);

    return this;
  };
  /**
   * @function
   * @param {Object} retrieveData
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchTimeOverlapData = async function (retrieveData) {
    const data = await _UTIL.fetchData('caseNoteOverlapCheck', { ...retrieveData });
    this.overlapData = JSON.parse(data.caseNoteOverlapCheckResult);

    return this;
  };
  /**
   * @function
   * @param {Object} retrieveData
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchReviewData = async function (retrieveData) {
    if (this.caseLoadOnly) {
      const restrictionsResponse = await _UTIL.fetchData('getCaseLoadRestriction');
      this.caseLoadRestrictions = restrictionsResponse.getCaseLoadRestrictionResult;
    }

    const data = await _UTIL.fetchData('caseNotesFilteredSearchJSON', {
      ...retrieveData,
    });
    this.caseNoteReviewData = data.caseNotesFilteredSearchJSONResult;

    return this;
  };
  /**
   * @function
   * @param {Object} retrieveData
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.fetchNoteData = async function (retrieveData) {
    return this;
  };

  // DROPDOWN DATA MAPPING
  //---------------------------------------
  CaseNotesData.prototype.getServiceBillCodeDropdownData = function () {
    let data = [];

    for (serviceId in this.dropdownData) {
      data.push({
        value: serviceId,
        text: UTIL.removeQuotes(this.dropdownData[serviceId].serviceCode),
      });
    }

    return data;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Array}
   */
  CaseNotesData.prototype.getLocationDropdownData = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].locations.map(location => {
      return {
        value: location.locCode,
        text: location.locName,
      };
    });
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Array}
   */
  CaseNotesData.prototype.getServicesDropdownData = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].services.map(service => {
      return {
        value: service.serviceCode,
        text: service.serviceName,
      };
    });
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Array}
   */
  CaseNotesData.prototype.getContactsDropdownData = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].contacts.map(contact => {
      return {
        value: contact.contactCode,
        text: contact.contactName,
      };
    });
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Array}
   */
  CaseNotesData.prototype.getNeedsDropdownData = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].needs.map(need => {
      return {
        value: need.needCode,
        text: need.needName,
      };
    });
  };
  /**
   * @function
   * @returns {Array}
   */
  CaseNotesData.prototype.getVendorDropdownData = function () {
    return this.vendorDropdownData.map(vendor => {
      return {
        value: vendor.vendorId,
        text: vendor.vendorName,
      };
    });
  };
  /**
   * @function
   * @returns {Array}
   */
  CaseNotesData.prototype.getServiceLocationDropdownData = function () {
    return this.serviceLocationDropdownData.map(location => {
      return {
        value: location.code,
        text: location.caption,
      };
    });
  };

  // DATA GETTERS
  //---------------------------------------
  /**
   * @function
   * @param {Object} retrieveData
   * @returns {CaseNotesData}
   */
  CaseNotesData.prototype.getReviewData = async function (retrieveData) {
    return this.caseNoteReviewData.filter(data => {
      // GROUPING
      if (data.numberInGroup !== '1') {
        const groupNoteId = data.groupnoteid.split('.')[0];
        const consumerId = data.consumerid.split('.')[0];
        const name = `${data.lastname}, ${data.firstname}`;

        this.reviewGroups[groupNoteId] = this.reviewGroups[groupNoteId] ?? {};
        this.reviewGroups[groupNoteId][consumerId] = name;
      }

      // TABLE CONSUMERS
      this.reviewConsumers.push({
        id: data.casenoteid.split('.')[0],
        FirstName: data.firstname,
        LastName: data.lastname,
      });

      // FOR VIEW ENTERED & CASELOAD ONLY
      if (this.viewEntered && this.caseLoadOnly) {
        const enteredByUser = data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
        const onCaseload = this.caseLoadRestrictions.some(
          cl => cl.id.toUpperCase() === data.consumerid.split('.')[0].toUpperCase(),
        );
        return enteredByUser || onCaseload;
      }

      // FOR VIEW ENTERED ONLY
      if (this.viewEntered) {
        return data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
      }

      // FOR CASELOAD ONLY
      if (this.caseLoadOnly) {
        return this.caseLoadRestrictions.some(cl => cl.id === data.consumerid.split('.')[0]);
      }

      return true; // If no conditions met, return the data as is
    });
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isLocationRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].locationRequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isNeedRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].needRequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isContactRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].contactRequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isServiceRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].serviceRequired === 'Y' ? true : false;
  };
  /**
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isMileageRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].mileageRequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isTravelTimeRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].travelTimeRequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isDocTimeRequired = function (selectedServiceCode) {
    return this.dropdownData[selectedServiceCode].docTimeRequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isServiceFunding = function (selectedServiceCode) {
    const serviceCode = selectedServiceCode ? selectedServiceCode : this.defaultServiceCode;
    return this.dropdownData[serviceCode].serviceFunding === 'Y' ? true : false;
  };
  /**
   * @function
   * @returns {Boolean}
   */
  CaseNotesData.prototype.isReviewRequired = function () {
    return this.caseManagerReview.reviewrequired === 'Y' ? true : false;
  };
  /**
   * @function
   * @param {String} selectedServiceCode
   * @returns {Boolean}
   */
  CaseNotesData.prototype.allowGroupNotes = function (selectedServiceCode) {
    const serviceCode = selectedServiceCode ? selectedServiceCode : this.defaultServiceCode;
    return this.dropdownData[serviceCode].allowGroupNotes === 'Y' ? true : false;
  };
  /**
   * @function
   * @returns {String}
   */
  CaseNotesData.prototype.getDefaultServiceCode = function () {
    return this.defaultServiceCode;
  };
  /**
   * @function
   * @param {String} serviceCode
   * @returns {String}
   */
  CaseNotesData.prototype.getMainServiceCodeNameById = function (serviceCode) {
    return this.dropdownData[serviceCode].serviceCode;
  };
  /**
   * @function
   * @returns {Array}
   */
  CaseNotesData.prototype.getOverlapData = function () {
    if (this.overlapData && this.overlapData.length > 0) {
      return this.overlapData.map(d => d.consumername);
    }

    return '';
  };
  /**
   * @function
   * @returns {Array}
   */
  CaseNotesData.prototype.getAttachmentsList = function () {
    return this.attachmentList.map(att => {
      return {
        description: att.description,
        type: att.attachmentType,
        attachment: att.attachment,
      };
    });
  };
  /**
   * @function
   * @param {String} consumerId
   * @returns {Boolean}
   */
  CaseNotesData.prototype.canConsumerHaveMileage = function (consumerId) {
    return this.consumersThatCanHaveMileage.includes(consumerId);
  };

  return CaseNotesData;
});
