// DATA
// const URL_BASE = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}`;

// async function fetchData(service, retrieveData) {
//   const URL = `${URL_BASE}/${service}/`;

//   try {
//     let response = await fetch(URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ token: $.session.Token, ...retrieveData }),
//     });

//     if (!response.ok) {
//       throw new Error('Issue with network, response was not OK');
//     }

//     let data = response.json();
//     return data;
//   } catch (error) {
//     console.log(`There was a problem with ${service}`, error.message);
//   }
// }

//TODO: Build date navigation
//TODO: Build new roster picker (new mini roster)
//TODO: Build Overview Table

// MAIN
const CaseNotes = (() => {
  function init() {
    DOM.clearActionCenter();
    const wrapForNewUI = _DOM.createElement('div', { id: 'UI' });
    const cnForm = CaseNotesForm.init();
    cnForm.build().render(wrapForNewUI);

    DOM.ACTIONCENTER.appendChild(wrapForNewUI);

    // Init other files for testing
    DateNavigation.init();
  }

  return {
    init,
  };
})();
