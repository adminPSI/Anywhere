const planIntroductionAjax = (() => {

       // GET
  //------------------------------------
  async function getPlanIntroduction(retrieveData) {
    // string token, string planId, string consumerId
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
          '/getPlanIntroduction/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanIntroductionResult;
    } catch (error) {
      console.log(error);
    }
  }

  // Update
  //------------------------------------
 async function updatePlanIntroduction(
    token,
    planId,
    consumerId, 
    likeAdmire,
    thingsImportantTo,
    thingsImportantFor,
    howToSupport,
    usePlanImage,
    consumerImage
 )  {
    
    // retrieveData.usePlanImage = parseInt(retrieveData.usePlanImage);

    try {
      var binary = '';
      var bytes = new Uint8Array(consumerImage);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let abString = window.btoa(binary);
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
          '/updatePlanIntroduction/',
        data: JSON.stringify({
          token: token,
          planId,
          consumerId, 
          likeAdmire,
          thingsImportantTo,
          thingsImportantFor,
          howToSupport,
          usePlanImage,
          consumerImage: abString,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanIntroductionResult;
    } catch (error) {
      console.log(error);
    }
  }
  
    return {
    getPlanIntroduction,
    updatePlanIntroduction,

  };
  
  })();
