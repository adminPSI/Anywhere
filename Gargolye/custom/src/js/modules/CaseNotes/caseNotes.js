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
    const dateNav = new DateNavigation();
  }

  return {
    init,
  };
})();
