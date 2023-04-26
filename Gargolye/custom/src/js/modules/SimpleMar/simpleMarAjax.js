var simpleMarAjax = (function () {
  async function simpleMarLogin() {
    retrieveData = {
      token: $.session.Token,
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
          '/simpleMarLogin/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      loginURL = data.simpleMarLoginResult;
      window.open(loginURL, '_blank');
    } catch (error) {
      console.log(error.responseText);
      simpleMar.showEMARfailurePopup();
    }
  }

  return {
    simpleMarLogin,
  };
})();
