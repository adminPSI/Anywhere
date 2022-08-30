var incidentTracking = (function() {
  // DATA
	//---------------------
	var involvementTypes;
  var incidentLocations;
	var categories;
  var employeeNames;

  function getInvolvementTypes() {
    if (involvementTypes) return [...involvementTypes];
  }
  function getLocations() {
    if (incidentLocations) return [...incidentLocations];
  }
  function getCategories() {
    if (categories) return [...categories];
  }
  function getEmployeeNames() {
    if (employeeNames) return [...employeeNames];
  }
  function getDropdownData(callback) {
    // gets all the data needed for dropdowns
    var getInvolvementTypesPromise = new Promise((fulfill, reject) => {
      incidentTrackingAjax.getInvolvementTypeData(results => {
        involvementTypes = results;
        fulfill();
      });
    });
    var getIncidentCategoriesPromise = new Promise((fulfill, reject) => {
      incidentTrackingAjax.getIncidentCategories(results => {
        categories = results;
        fulfill();
      });
    });
    var getIncidentLocationDetailPromise = new Promise((fulfill, reject) => {
      incidentTrackingAjax.getIncidentLocationDetail(results => {
        incidentLocations = results;
        fulfill();
      });
    });
    var getEmployeesInvolvedEmployeeDropdownPromise = new Promise((fulfill, reject) => {
      incidentTrackingAjax.getEmployeesInvolvedEmployeeDropdown(results => {
        employeeNames = results;
        fulfill();
      });
    });

    Promise.all([
      getInvolvementTypesPromise,
      getIncidentCategoriesPromise,
      getIncidentLocationDetailPromise,
      getEmployeesInvolvedEmployeeDropdownPromise
    ]).then(() => {
      callback();
    });
  }

  function loadLandingPage() {
    var newIncidentBtn = button.build({
      text: 'New Incident',
      style: 'secondary',
      type: 'contained',
      callback: newIncident.init
    });
    var overviewBtn = button.build({
      text: 'Review Incidents',
      style: 'secondary',
      type: 'contained',
      callback: incidentOverview.init
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('landingBtnWrap');

    btnWrap.appendChild(newIncidentBtn);
    btnWrap.appendChild(overviewBtn);

    PROGRESS.SPINNER.show('Loading Incident Tracking...');
    getDropdownData(() => {
      DOM.clearActionCenter();
      DOM.ACTIONCENTER.appendChild(btnWrap);
    });
  }

  return {
    getInvolvementTypes,
    getLocations,
    getCategories,
    getEmployeeNames,
    loadLandingPage,
    getDropdownData, //For Dashboard
  }
})();