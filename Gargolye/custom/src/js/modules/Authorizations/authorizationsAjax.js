const authorizationsAjax = (function () {
  async function getPageData(retrieveData) {
    // token
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
          '/getAuthorizationPageData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getAuthorizationPageDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getLandingPageData() {
    // token
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
          '/getAuthorizationLandingPageData/',
        data: JSON.stringify({
            token: $.session.Token
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getAuthorizationLandingPageDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getFilterDropdownData(retrieveData) {
    // token
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
          '/getAuthorizationFilterData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getAuthorizationFilterDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getAssessmentEntriesAsync(
    consumerIds,
    methodology,
    score,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
    priorAuthApplFrom,
    priorAuthApplTo,
    priorAuthRecFrom,
    priorAuthRecTo,
    priorAuthAmtFrom,
    priorAuthAmtTo,
  ) {
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
          '/getAssessmentEntries/',
        data:
          '{"token":"' +
          $.session.Token +
          '", "consumerIds":"' +
          consumerIds +
          '", "methodology":"' +
          methodology +
          '", "score":"' +
          score +
          '", "startDateFrom":"' +
          startDateFrom +
          '", "startDateTo":"' +
          startDateTo +
          '", "endDateFrom":"' +
          endDateFrom +
          '", "endDateTo":"' +
          endDateTo +
          '", "priorAuthApplFrom":"' +
          priorAuthApplFrom +
          '", "priorAuthApplTo":"' +
          priorAuthApplTo +
          '", "priorAuthRecFrom":"' +
          priorAuthRecFrom +
          '", "priorAuthRecTo":"' +
          priorAuthRecTo +
          '", "priorAuthAmtFrom":"' +
          priorAuthAmtFrom +
          '", "priorAuthAmtTo":"' +
          priorAuthAmtTo +
          '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getScoreAsync(MethodologyID) {
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
          '/getScore/',
        data: JSON.stringify({
          token: $.session.Token,
          methodologyID: MethodologyID,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getVendorInfoAsync(dataObj, callback) {
    $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getVendorInfo/',
      data:
        '{"token":"' +
        $.session.Token +
        '","vendor":"' +
        dataObj.vendor +
        '","DDNumber":"' +
        dataObj.DDNumber +
        '","localNumber":"' +
        dataObj.localNumber +
        '","goodStanding":"' +
        dataObj.goodStanding +
        '","homeServices":"' +
        dataObj.homeServices +
        '","takingNewReferrals":"' +
        dataObj.takingNewReferrals +
        '","fundingSource":"' +
        dataObj.fundingSource +
        '","serviceCode":"' +
        dataObj.serviceCode +
        '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response) {
        var res = response.getVendorInfoResult;
        callback(res);
      },
    });
  }

  async function getVendorAsync() {
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
          '/getVendor/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getFundingSourceAsync() {
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
          '/getFundingSource/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getServiceCodeAsync() {
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
          '/getServiceCode/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getVendorEntriesByIdAsync(vendorID) {
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
          '/getVendorEntriesById/',
        data: '{"token":"' + $.session.Token + '", "vendorID":"' + vendorID + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getVenderServicesEntriesAsync(vendorID) {
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
          '/getVenderServicesEntries/',
        data: '{"token":"' + $.session.Token + '", "vendorID":"' + vendorID + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getVenderUCREntriesAsync(vendorID) {
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
          '/getVenderUCREntries/',
        data: '{"token":"' + $.session.Token + '", "vendorID":"' + vendorID + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getProviderTypeEntriesAsync(vendorID) {
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
          '/getProviderTypeEntries/',
        data: '{"token":"' + $.session.Token + '", "vendorID":"' + vendorID + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getVenderCertificationEntriesAsync(vendorID) {
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
          '/getVenderCertificationEntries/',
        data: '{"token":"' + $.session.Token + '", "vendorID":"' + vendorID + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getVenderLocationReviewEntriesAsync(vendorID) {
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
          '/getVenderLocationReviewEntries/',
        data: '{"token":"' + $.session.Token + '", "vendorID":"' + vendorID + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  return {
    getPageData,
    getLandingPageData,
    getFilterDropdownData,
    getAssessmentEntriesAsync,
    getScoreAsync,
    getVendorInfoAsync,
    getVendorAsync,
    getFundingSourceAsync,
    getServiceCodeAsync,
    getVendorEntriesByIdAsync,
    getVenderServicesEntriesAsync,
    getVenderUCREntriesAsync,
    getProviderTypeEntriesAsync,
    getVenderCertificationEntriesAsync,
    getVenderLocationReviewEntriesAsync,
  };
})();
