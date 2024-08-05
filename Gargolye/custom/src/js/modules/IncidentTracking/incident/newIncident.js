var newIncident = (function() {
  // Action Nav Event Handler
  function handleActionNavEvent(target) {
    var targetAction = target.dataset.actionNav;

    switch(targetAction) {
      case 'miniRosterDone': {
        var selectedConsumers = roster2.getActiveConsumers();
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
  }

  return {
    handleActionNavEvent,
    init
  }
})();