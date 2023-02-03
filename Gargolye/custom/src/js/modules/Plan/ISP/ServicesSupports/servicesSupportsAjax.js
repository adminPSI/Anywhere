const servicesSupportsAjax = (() => {
  // GET
  //------------------------------------
  async function getServicesAndSupports(retrieveData) {
    // string token, anywAssessmentId
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
          '/getServicesAndSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getServicesAndSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }

  // ADD PAID SUPPORT Popup -- Vendors/Providers DDL
  async function getPaidSupportsVendors(fundingSourceName, serviceName) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPaidSupportsVendors/',
        data: JSON.stringify({
          fundingSourceName: fundingSourceName,
          serviceName: serviceName,
          areInSalesForce: $.session.areInSalesForce,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  // INSERT
  //------------------------------------
  async function insertSSModifications(retrieveData) {
    // token, anywAssessmentId, medicalRate, behaviorRate, icfRate,
    // complexRate, developmentalRate, childIntensiveRate

    retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);

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
          '/insertSSModifications/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertSSModificationsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertProfessionalReferral(retrieveData) {
    // string token, anywAssessmentId, assessmentAreaId,
    // newOrExisting, whoSupports, reasonForReferral, rowOrder

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.assessmentAreaId !== '') {
      retrieveData.assessmentAreaId = parseInt(retrieveData.assessmentAreaId);
    }
    if (retrieveData.rowOrder !== '') {
      retrieveData.rowOrder = parseInt(retrieveData.rowOrder);
    }

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
          '/insertProfessionalReferral/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertProfessionalReferralResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertAdditionalSupports(retrieveData) {
    // string token, anywAssessmentId, assessmentAreaId, whoSupports,
    // whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText, rowOrder

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.assessmentAreaId !== '') {
      retrieveData.assessmentAreaId = parseInt(retrieveData.assessmentAreaId);
    }
    if (retrieveData.howOftenFrequency !== '') {
      retrieveData.howOftenFrequency = parseInt(retrieveData.howOftenFrequency);
    }
    if (retrieveData.rowOrder !== '') {
      retrieveData.rowOrder = parseInt(retrieveData.rowOrder);
    }

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
          '/insertAdditionalSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertAdditionalSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPaidSupports(retrieveData) {
    // token, anywAssessmentId, providerId, assessmentAreaId,
    // serviceNameId, scopeOfService, howOftenValue, howOftenFrequency,
    // howOftenText, beginDate, endDate, fundingSource, fundingSourceText, rowOrder
    // serviceNameOther

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.providerId !== '') {
      retrieveData.providerId = parseInt(retrieveData.providerId);
    }
    if (retrieveData.assessmentAreaId !== '') {
      retrieveData.assessmentAreaId = parseInt(retrieveData.assessmentAreaId);
    }
    if (retrieveData.serviceNameId !== '') {
      retrieveData.serviceNameId = parseInt(retrieveData.serviceNameId);
    }
    if (retrieveData.howOftenFrequency !== '') {
      retrieveData.howOftenFrequency = parseInt(retrieveData.howOftenFrequency);
    }
    if (retrieveData.fundingSource !== '') {
      retrieveData.fundingSource = parseInt(retrieveData.fundingSource);
    }
    if (retrieveData.rowOrder !== '') {
      retrieveData.rowOrder = parseInt(retrieveData.rowOrder);
    }

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
          '/insertPaidSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPaidSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }

  // UPDATE
  //------------------------------------
  async function updateSSModifications(retrieveData) {
    // token, modificationsId, anywAssessmentId, medicalRate, behaviorRate, icfRate,
    // complexRate, developmentalRate, childIntensiveRate

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.modificationsId !== '') {
      retrieveData.modificationsId = parseInt(retrieveData.modificationsId);
    }

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
          '/updateSSModifications/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateSSModificationsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateProfessionalReferral(retrieveData) {
    // string token, professionalReferralId, anywAssessmentId,
    // assessmentAreaId, newOrExisting, whoSupports, reasonForReferral

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.assessmentAreaId !== '') {
      retrieveData.assessmentAreaId = parseInt(retrieveData.assessmentAreaId);
    }
    if (retrieveData.professionalReferralId !== '') {
      retrieveData.professionalReferralId = parseInt(retrieveData.professionalReferralId);
    }
    if (retrieveData.rowOrder !== '') {
      retrieveData.rowOrder = parseInt(retrieveData.rowOrder);
    }

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
          '/updateProfessionalReferral/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateProfessionalReferralResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateAdditionalSupports(retrieveData) {
    // token, additionalSupportsId, anywAssessmentId, assessmentAreaId,
    // whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.assessmentAreaId !== '') {
      retrieveData.assessmentAreaId = parseInt(retrieveData.assessmentAreaId);
    }
    if (retrieveData.additionalSupportsId !== '') {
      retrieveData.additionalSupportsId = parseInt(retrieveData.additionalSupportsId);
    }
    if (retrieveData.howOftenFrequency !== '') {
      retrieveData.howOftenFrequency = parseInt(retrieveData.howOftenFrequency);
    }
    if (retrieveData.rowOrder !== '') {
      retrieveData.rowOrder = parseInt(retrieveData.rowOrder);
    }

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
          '/updateAdditionalSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateAdditionalSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePaidSupports(retrieveData) {
    // token, paidSupportsId, anywAssessmentId, providerId,
    // assessmentAreaId, serviceNameId, scopeOfService, howOftenValue,
    // howOftenFrequency, howOftenText, beginDate, endDate,
    // fundingSource, fundingSourceText, serviceNameOther

    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }
    if (retrieveData.paidSupportsId !== '') {
      retrieveData.paidSupportsId = parseInt(retrieveData.paidSupportsId);
    }
    if (retrieveData.assessmentAreaId !== '') {
      retrieveData.assessmentAreaId = parseInt(retrieveData.assessmentAreaId);
    }
    if (retrieveData.providerId !== '') {
      retrieveData.providerId = parseInt(retrieveData.providerId);
    }
    if (retrieveData.serviceNameId !== '') {
      retrieveData.serviceNameId = parseInt(retrieveData.serviceNameId);
    }
    if (retrieveData.howOftenFrequency !== '') {
      retrieveData.howOftenFrequency = parseInt(retrieveData.howOftenFrequency);
    }
    if (retrieveData.fundingSource !== '') {
      retrieveData.fundingSource = parseInt(retrieveData.fundingSource);
    }
    if (retrieveData.rowOrder !== '') {
      retrieveData.rowOrder = parseInt(retrieveData.rowOrder);
    }

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
          '/updatePaidSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePaidSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateMultiPaidSupports(retrieveData) {
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
          '/updateMultiPaidSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateMultiPaidSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }
  // row re-order
  //------------------
  async function updatePaidSupportsRowOrder(retrieveData) {
    // string token, long assessmentId, long supportId, int newPos, int oldPos
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
          '/updatePaidSupportsRowOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePaidSupportsRowOrderResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateAdditionalSupportsRowOrder(retrieveData) {
    // string token, long assessmentId, long addSupportId, int newPos, int oldPos
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
          '/updateAdditionalSupportsRowOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateAdditionalSupportsRowOrderResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateServiceReferralRowOrder(retrieveData) {
    // string token, long assessmentId, long refrerralId, int newPos, int oldPos
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
          '/updateServiceReferralRowOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateServiceReferralRowOrderResult;
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE
  //------------------------------------
  async function deleteSSModifications(retrieveData) {
    // string token, string modificationsId

    retrieveData.modificationsId = parseInt(retrieveData.modificationsId);

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
          '/deleteSSModifications/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deleteSSModificationsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteProfessionalReferral(retrieveData) {
    // string token, string professionalReferralId

    retrieveData.professionalReferralId = parseInt(retrieveData.professionalReferralId);

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
          '/deleteProfessionalReferral/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deleteProfessionalReferralResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteAdditionalSupports(retrieveData) {
    // string token, long additionalSupportsId

    retrieveData.additionalSupportsId = parseInt(retrieveData.additionalSupportsId);

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
          '/deleteAdditionalSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deleteAdditionalSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deletePaidSupports(retrieveData) {
    // string token, long paidSupportsId

    retrieveData.paidSupportsId = parseInt(retrieveData.paidSupportsId);

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
          '/deletePaidSupports/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePaidSupportsResult;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getServicesAndSupports,
    getPaidSupportsVendors,
    insertSSModifications,
    insertAdditionalSupports,
    insertProfessionalReferral,
    insertPaidSupports,
    updatePaidSupports,
    updateProfessionalReferral,
    updateSSModifications,
    updateAdditionalSupports,
    updatePaidSupportsRowOrder,
    updateServiceReferralRowOrder,
    updateAdditionalSupportsRowOrder,
    updateMultiPaidSupports,
    deleteProfessionalReferral,
    deleteAdditionalSupports,
    deleteSSModifications,
    deletePaidSupports,
  };
})();
