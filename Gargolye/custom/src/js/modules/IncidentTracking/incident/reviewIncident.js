var reviewIncident = (function () {
  function loadPage(reviewData, incidentId) {
    DOM.clearActionCenter();

    var newIncidentCard = incidentCard.build(reviewData);

    DOM.ACTIONCENTER.appendChild(newIncidentCard);

    incidentPermissions.permissions(reviewData.itReviewData[0].originallyEnteredByUserId);

    DOM.autosizeTextarea();

    // TODO ASH: insert record if incident has not been viewed yet by user
    incidentTrackingAjax.updateIncidentViewByUser({
      token: $.session.Token,
      incidentId,
      userId: $.session.UserId,
    });
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
