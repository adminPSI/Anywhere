//TODO: Build date navigation
//TODO: Build new roster picker (new mini roster)
//TODO: Build Overview Table

// const cnForm = CaseNotesForm.init();
// cnForm.build().render(wrapForNewUI);

//? only thing i need from datenavigation ref is
//? selectedDate

// MAIN
const CaseNotes = (() => {
  function loadPage() {
    const wrapForNewUI = _DOM.createElement('div', { id: 'UI' });

    const dateNavigation = new DateNavigation({
      onDateChange() {
        // do stuff with newly selected date
      },
    });

    dateNavigation.build().renderTo(wrapForNewUI);

    DOM.ACTIONCENTER.appendChild(wrapForNewUI);
  }

  function init() {
    DOM.clearActionCenter();

    loadPage();
  }

  return {
    init,
  };
})();
