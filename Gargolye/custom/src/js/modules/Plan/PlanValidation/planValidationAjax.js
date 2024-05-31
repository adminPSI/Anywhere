const planValidationAjax = (function () {
  async function getAssessmentValidationData(planId) {
    // string token, anywAssessmentId
    const retrieveData = {token: $.session.Token, planId}
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
          '/getAssessmentValidationData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getAssessmentValidationDataResult;
    } catch (error) {
      console.log(error);
    }
  }

    async function getContactValidationData(planId) {
      const retrieveData = {token: $.session.Token, planId}
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
                '/getContactValidationData/',
              data: JSON.stringify(retrieveData),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
            });
      
            return data.getContactValidationDataResult;
          } catch (error) {
            console.log(error);
          }
    }

    async function getSummaryRiskValidationData(planId) {
      const retrieveData = {token: $.session.Token, planId}
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
                '/getSummaryRiskValidationData/',
              data: JSON.stringify(retrieveData),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
            });
      
            return data.getSummaryRiskValidationDataResult;
          } catch (error) {
            console.log(error);
          }
    }
      
    return {
      getAssessmentValidationData,
      getContactValidationData,
      getSummaryRiskValidationData
    };
  })();