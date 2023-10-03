// DATA
const URL_BASE = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}`;

async function fetchData(service, retrieveData) {
  const URL = `${URL_BASE}/${service}/`;

  try {
    let response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: $.session.Token, ...retrieveData }),
    });

    if (!response.ok) {
      throw new Error('Issue with network, response was not OK');
    }

    let data = response.json();
    return data;
  } catch (error) {
    console.log(`There was a problem with ${service}`, error.message);
  }
}

// UI
const CaseNoteForm = new FORM({
  elements: [
    {
      type: 'select',
      label: 'Service Code',
    },
  ],
});

// MAIN
const CaseNotes = (() => {
  function init() {
    DOM.clearActionCenter();
  }

  return {
    init,
  };
})();
