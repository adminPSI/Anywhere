const restrictiveMeasuresAjax = (() => {
  // GET
  //------------------------------------
  async function getPlanRestrictiveMeasures(retrieveData) {
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
          '/getPlanRestrictiveMeasures/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanRestrictiveMeasuresResult[0];
    } catch (error) {
      console.log(error);
    }
  }

  // Insert
  //--------------------------------------
  async function insertPlanRestrictiveMeasures(retrieveData) {
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
          '/insertPlanRestrictiveMeasures/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanRestrictiveMeasuresResult[0];
    } catch (error) {
      console.log(error);
    }
  }

  // Update
  //--------------------------------------
  async function updatePlanRestrictiveMeasures(retrieveData) {
    /*  string token, string informedConsentId, string rmIdentified, 
        string rmHRCDate, string rmKeepSelfSafe, string rmFadeRestriction, 
        string rmOtherWayHelpGood, string rmOtherWayHelpBad, 
        string rmWhatCouldHappenGood, string rmWhatCouldHappenBad
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
          '/updatePlanRestrictiveMeasures/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanRestrictiveMeasuresResult;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getPlanRestrictiveMeasures,
    insertPlanRestrictiveMeasures,
    updatePlanRestrictiveMeasures,
  };
})();
