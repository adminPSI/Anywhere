var newTimeEntry = (function () {
  // DOM
  var timeCard;

  async function loadPage() {
    DOM.clearActionCenter();
    // roster.removeMiniRosterBtn();

    timeCard = await timeEntryCard.build({
      isEdit: false,
    });
    DOM.ACTIONCENTER.appendChild(timeCard);

    timeEntryCard.populate();

    // var enabledConsumers = roster.getEnabledConsumers();
    // if (enabledConsumers.length !== 0) {
    //   timeEntryCard.setAllowedConsumers(function() {
    //     const miniRosterBtn = document.querySelector(".consumerListBtn");
    //     if (!miniRosterBtn) roster.buildMiniRoster();
    //   });
    // }
  }

  function init() {
    setActiveModuleSectionAttribute('timeEntry-new');
    DOM.clearActionCenter();
    roster2.miniRosterinit(null, {
      hideDate: true,
    });
    roster2.toggleMiniRosterBtnVisible(false);
    loadPage();

    // var enabledConsumers = roster.getEnabledConsumers();
    // if (enabledConsumers.length === 0 && !fromSave) {
    //   PROGRESS.SPINNER.show('Please wait while we gather everyone up...');
    //   roster.buildRoster(true, true, function appendMiniRoster(miniRoster) {
    //     DOM.clearActionCenter();
    //     DOM.ACTIONCENTER.appendChild(miniRoster);
    //   }, true);
    // } else {
    //   loadPage();
    // }
  }

  return {
    init,
    loadPage,
  };
})();
