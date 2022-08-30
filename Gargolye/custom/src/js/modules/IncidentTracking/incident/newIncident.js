var newIncident = (function() {
	// DATA
	//---------------------
	// Values
  //---------------------

  // Action Nav Event Handler
  function handleActionNavEvent(target) {
    var targetAction = target.dataset.actionNav;

    switch(targetAction) {
      // case 'rosterDone': {
      //   roster.selectedConsumersToEnabledList();
      //   loadPage();
      //   break;
      // }
      // case 'rosterCancel': {
      //   incidentTracking.loadLandingPage();
      //   break;
      // }
      case 'miniRosterDone': {
        var selectedConsumers = roster2.getActiveConsumers();
        // roster.selectedConsumersToActiveList();
        itConsumerSection.addConsumers(selectedConsumers);
        DOM.toggleNavLayout();
        break;
      }
      case 'miniRosterCancel': {
        DOM.toggleNavLayout();
        break;
      }
    }
  }
 
  function loadPage() {
    DOM.clearActionCenter();
    roster2.setAllowedConsumers(['%']);
    roster2.miniRosterinit();

    var newIncidentCard = incidentCard.build();

    DOM.ACTIONCENTER.appendChild(newIncidentCard);

    DOM.autosizeTextarea();
  }

  function init() {
    setActiveModuleSectionAttribute('incidentTracking-new');
    loadPage();

    // var enabledConsumers = roster.getEnabledConsumers();

    // if (enabledConsumers.length === 0) {
    //   PROGRESS.SPINNER.show('Please wait while we gather everyone up...');
    //   roster.buildRoster(true, false, rosterList => {
    //     DOM.clearActionCenter();
    //     DOM.ACTIONCENTER.appendChild(rosterList);
    //   }, true);
    // } else {
    //   loadPage();
    // }
  }

  return {
    handleActionNavEvent,
    init
  }
})();