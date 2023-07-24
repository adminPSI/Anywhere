const missingSignatureAjax = (function () {
  function getMissingPlanSignatures(retrieveData, callback) {
    // This function is not async bc it needs to work with other
    // dashboard functions that are not async,
    // if you refactor this you refactor all
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
        '/getMissingPlanSignatures/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getMissingPlanSignaturesResult;
        callback(res);
      },
      error: function (xhr, status, error) {},
    });
  }
  async function getLocationDropdownData() {
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
          '/populateLocationsRemainingServicesWidgetFilter/',
        data: JSON.stringify({ token: $.session.Token }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.populateLocationsRemainingServicesWidgetFilterResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function getGroupsDropdownData(locationId) {
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
          '/populateGroupsRemainingServicesWidgetFilter/',
        data: JSON.stringify({ token: $.session.Token, locationId: locationId }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.populateGroupsRemainingServicesWidgetFilterResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  return {
    getMissingPlanSignatures,
    getLocationDropdownData,
    getGroupsDropdownData,
  };
})();
