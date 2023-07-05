var reviewIncident = (function () {
  function loadPage(reviewData, incidentId) {
    DOM.clearActionCenter();

    var newIncidentCard = incidentCard.build(reviewData);

    DOM.ACTIONCENTER.appendChild(newIncidentCard);

    incidentPermissions.permissions(reviewData.itReviewData[0].originallyEnteredByUserId);

    DOM.autosizeTextarea();
  }

  function init(incidentId) {
    incidentTrackingAjax.getIncidentEditReviewDataAllObjects(incidentId, results => {
      incident.setUpdateIncidentId(incidentId);
      loadPage(results, incidentId);
    });
  }

  return {
    init,
  };
})();
