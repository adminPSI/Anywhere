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
          '/authorizationGetPageData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.authorizationGetPageDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  return {
    getPageData,
  };
})();
