var newTimeEntry = (function () {
  var timeCard;

  async function loadPage() {
    DOM.clearActionCenter();

    timeCard = await timeEntryCard.build({
      isEdit: false,
    });
    DOM.ACTIONCENTER.appendChild(timeCard);

    await timeEntryCard.populate();
  }

  function init() {
    setActiveModuleSectionAttribute('timeEntry-new');
    DOM.clearActionCenter();
    roster2.miniRosterinit(null, {
      hideDate: true,
    });
    roster2.toggleMiniRosterBtnVisible(false);
    loadPage();
  }

  return {
    init,
    loadPage,
  };
})();
