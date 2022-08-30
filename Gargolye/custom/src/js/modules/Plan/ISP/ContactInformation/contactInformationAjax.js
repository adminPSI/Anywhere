const contactInformationAjax = (() => {
  // GET
  // ===============================
  async function getPlanContactInformation(retrieveData) {
    // string token, stirng assessmentId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanContact/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanContactResult[0];
    } catch (error) {
      console.log(error);
    }
  }
  async function importExistingContactInfo(retrieveData) {
    // string token, stirng peopleId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/importExistingContactInfo/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.importExistingContactInfoResult[0];
    } catch (error) {
      console.log(error);
    }
  }
  async function getConsumerRelationships(retrieveData) {
    //token, consumerId, effectiveStartDate, effectiveEndDate
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerRelationshipsCI/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getConsumerRelationshipsCIResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPlanImportantPeople(retrieveData) {
    // string token, stirng contactId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanContactImportantPeople/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanContactImportantPeopleResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPlanImportantPlaces(retrieveData) {
    // string token, stirng contactId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanContactImportantPlaces/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanContactImportantPlacesResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPlanImportantGroups(retrieveData) {
    // string token, stirng contactId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanContactImportantGroups/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanContactImportantGroupsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPlanContactFundingSources(retrieveData) {
    // string assessmentId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanContactFundingSources/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanContactFundingSourcesResult;
    } catch (error) {
      console.log(error);
    }
  }

  // INSERT
  // ===============================
  async function insertPlanContactImportantPeople(retrieveData) {
    // token, contactId, type, name, relationship, address, phone
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanContactImportantPeople/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanContactImportantPeopleResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPlanContactImportantGroup(retrieveData) {
    // token, contactId, status, name, address, phone, meetingInfo, whoHelps
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanContactImportantGroup/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanContactImportantGroupResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPlanContactImportantPlaces(retrieveData) {
    // token, contactId, type, name, address, phone, schedule, acuity
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanContactImportantPlaces/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanContactImportantPlacesResult;
    } catch (error) {
      console.log(error);
    }
  }
  // UPDATE
  // ===============================
  async function updatePlanContactImportantPeople(retrieveData) {
    // token, importantPersonId, type, name, relationship, address, phone
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanContactImportantPeople/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanContactImportantPeopleResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanContactImportantGroup(retrieveData) {
    // token, importantGroupId, status, name, address, phone, meetingInfo, whoHelps
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanContactImportantGroup/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanContactImportantGroupResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanContactImportantPlaces(retrieveData) {
    // token, importantPlacesId, type, name, address, phone, schedule, acuity
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanContactImportantPlaces/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanContactImportantPlacesResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanContactImportantOrder(retrieveData) {
    // contactId, importantId, newPos, oldPos, type
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanContactImportantOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanContactImportantOrderResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanContact(retrieveData) {
    // token, contactId, ohiInfo, ohiPhone, ohiPolicy
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanContact/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanContactResult;
    } catch (error) {
      console.log(error);
    }
  }
  // DELETE
  // ===============================
  async function deletePlanContactImportant(retrieveData) {
    /* token, importantId, type
    type: 
      1 = Groups
      2 = People
      3 = Places
    */
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deletePlanContactImportant/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanContactImportantPlacesResult;
    } catch (error) {
      console.log(error);
    }
  }
  return {
    importExistingContactInfo,
    getPlanContactInformation,
    getConsumerRelationships,
    getPlanImportantPeople,
    getPlanImportantPlaces,
    getPlanImportantGroups,
    getPlanContactFundingSources,
    insertPlanContactImportantPeople,
    insertPlanContactImportantGroup,
    insertPlanContactImportantPlaces,
    updatePlanContactImportantPeople,
    updatePlanContactImportantGroup,
    updatePlanContactImportantPlaces,
    updatePlanContactImportantOrder,
    updatePlanContact,
    deletePlanContactImportant,
  };
})();
