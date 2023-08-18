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
          '//',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      console.log(data.getAuthorizationPageDataResult);
      return JSON.parse(`${data.getAuthorizationPageDataResult}`);
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
      console.log(data.getAuthorizationFilterDataResult);
      return data.getAuthorizationFilterDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  return {
    getPageData,
    getFilterDropdownData,
  };
})();
