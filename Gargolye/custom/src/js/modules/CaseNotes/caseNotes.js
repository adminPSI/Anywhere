//TODO: Build new roster picker (new mini roster)
//TODO: Build Overview Table

// const cnForm = CaseNotesForm.init();
// cnForm.build().render(wrapForNewUI);

// MAIN
const CaseNotes = (() => {
  async function loadPage() {
    const wrapForNewUI = _DOM.createElement('div', { id: 'UI' });

    // DATE NAVIGATION
    //--------------------------------------------------
    const dateNavigation = new DateNavigation({
      onDateChange(selectedDate) {
        // do stuff with newly selected date
        console.log('From CaseNotes.js', selectedDate);
      },
    });

    dateNavigation.build().renderTo(wrapForNewUI);

    // ROSTER PICKER
    //--------------------------------------------------
    const rosterPicker = new RosterPicker();
    await rosterPicker.fetchConsumers({
      groupCode: 'ALL',
      retrieveId: '0',
      serviceDate: '2023-10-05',
      daysBackDate: '2023-06-28',
    });
    rosterPicker.build().renderTo(wrapForNewUI);

    DOM.ACTIONCENTER.appendChild(wrapForNewUI);
  }

  async function init() {
    DOM.clearActionCenter();

    loadPage();
  }

  return {
    init,
  };
})();
