const consentAndSignAjax = (() => {
  // GET
  //-------------------------------------
  async function getConsentAndSignData(retrieveData) {
    // string token, string assessmentId
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
          '/getPlanSignatures/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getSignaturesResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPlanInformedConsentSSAs(retrieveData) {
    // string token
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
          '/getPlanInformedConsentSSAs/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanInformedConsentSSAsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPlanInformedConsentVendors(retrieveData) {
    // string token
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
          '/getPlanInformedConsentVendors/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanInformedConsentVendorsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function GetSalesForceId() {
    // token, signatureId
    const retrieveData = {
      token: $.session.Token,
      consumerId: parseInt('17080'),
      peopleId: parseInt('1'),
    };
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
          '/GetSalesForceId/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.GetSalesForceIdResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getTeamMemberListFromState(retrieveData) {
    //peopleId should be an integer in the retrieveData
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
          '/getTeamMemberListFromState/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getTeamMemberListFromStateResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function getStateGuardiansforConsumer(peopleIdData) {
    //cosumerId as a string in retrieveData
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
          '/getStateGuardiansforConsumer/',
       data: JSON.stringify(peopleIdData),
       //data: '{"peopleId":"' + peopleId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getStateGuardiansforConsumerResult;
    } catch (error) {
      console.log(error);
    }
  }
  
  async function getTeamMemberBySalesForceId(retrieveData) {
    // string salesForceId
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
          '/getTeamMemberBySalesForceId/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getTeamMemberBySalesForceIdResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function getConsumerOrganizationId(retrieveData) {
    //peopleId
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
          '/getConsumerOrganizationId/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getConsumerOrganizationIdResult;
    } catch (error) {
      console.log(error);
    }
  }

  // INSERT
  //-------------------------------------
  async function insertTeamMember(retrieveData) {
    //* NO NEED TO REMOVE UNSAVABLE NOTE TEXT, THIS IS DONE IN BACKEND
    //*--------------------------------------------------------------------
    // token, assessmentId
    // teamMember, name, lastName, relationship, participated,
    // signature, dateSigned, dissentAreaDisagree, dissentHowToAddress, dissentDate
    // contactId, peopleId, buildingNumber, dateOfBirth, planYearStart, planYearEnd
    // csChangeMind, csChangeMindSSAPeopleId, csContact, csContactProviderVendorId, csContactInput
    // csRightsReviewed, csAgreeToPlan, csFCOPExplained, csDueProcess, csResidentialOptions, csSupportsHealthNeeds, csTechnology,
    // useExisting, relationshipImport, consumerId, createRelationship
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
          '/insertTeamMember/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanTeamMemberResult;
    } catch (error) {
      console.log(error);
    }
  }

  // UPDATE
  //-------------------------------------
  async function updateTeamMember(retrieveData) {
    //! THIS WILL ONLY UPDATE THE FOLLOWING DATA
    // token, signatureId, teamMember, name, lastName, relationship, participated,
    // dissentAreaDisagree, dissentHowToAddress, dissentDate, signature, contactId, buildingNumber, dateOfBirth, salesForceId, consumerId
    //! USE updatePlanConsentStatements() FOR CS DATA

    //moved functionality to C# - MAT
    //if (retrieveData.name !== '') {
    //  retrieveData.name = UTIL.removeUnsavableNoteText(retrieveData.name);
    //}
    //if (retrieveData.relationship !== '') {
    //  retrieveData.relationship = UTIL.removeUnsavableNoteText(retrieveData.relationship);
    //}
    //if (retrieveData.dissentAreaDisagree !== '') {
    //  retrieveData.dissentAreaDisagree = UTIL.removeUnsavableNoteText(
    //    retrieveData.dissentAreaDisagree,
    //  );
    //}
    //if (retrieveData.dissentHowToAddress !== '') {
    //  retrieveData.dissentHowToAddress = UTIL.removeUnsavableNoteText(
    //    retrieveData.dissentHowToAddress,
    //  );
    //}

      try {
          var binary = '';
          var bytes = new Uint8Array(retrieveData.attachment);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
          }
          let abString = window.btoa(binary);
          retrieveData.attachment = abString;

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
          '/updatePlanTeamMember/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanTeamMemberResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanConsentStatements(retrieveData) {
    /*  token, signatureId, csChangeMind, csChangeMindSSAPeopleId, csContact,
        csContactProviderVendorId, csContactInput, csRightsReviewed, csAgreeToPlan, 
        csFCOPExplained, csDueProcess, csResidentialOptions, csSupportsHealthNeeds, csTechnology
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
          '/updatePlanConsentStatements/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanConsentStatementsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateTableRowOrder(retrieveData) {
    // assessmentId, signatureId, newPos
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
          '/updatePlanSignatureOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanSignatureOrderResult;
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE
  //-------------------------------------
  async function deleteTeamMember(retrieveData) {
    // token, signatureId
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
          '/deletePlanSignature/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePlanSignatureResult;
    } catch (error) {
      console.log(error);
    }
  }

  // OTHER
  //-------------------------------------
  async function setSalesForceIdForTeamMemberUpdate(retrieveData) {
    //peopleId and salesForceId both strings
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
          '/setSalesForceIdForTeamMemberUpdate/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.setSalesForceIdForTeamMemberUpdateResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function validateConsumerForSalesForceId(retrieveData) {
    //cosumerId as a string in retrieveData
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
          '/validateConsumerForSalesForceId/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.validateConsumerForSalesForceIdResult;
    } catch (error) {
      console.log(error);
    }
  }



  return {
    getConsentAndSignData,
    getPlanInformedConsentSSAs,
    getPlanInformedConsentVendors,
    getTeamMemberBySalesForceId,
    getConsumerOrganizationId,
    updateTeamMember,
    updatePlanConsentStatements,
    updateTableRowOrder,
    insertTeamMember,
    deleteTeamMember,
    GetSalesForceId,
    getTeamMemberListFromState,
    setSalesForceIdForTeamMemberUpdate,
    validateConsumerForSalesForceId,
    getStateGuardiansforConsumer,
  };
})();
