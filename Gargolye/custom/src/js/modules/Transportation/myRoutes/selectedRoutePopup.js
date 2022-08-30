const TRANS_selectedRoutePopup = (function() {
  // let routeId, routeName;

  function buildPopup(opts, selectedDate) {
    const { tripsCompletedId, tripName, vehicleInfoId, tripInspection, tripInspectionEnteredBy, inspectionTime, inspectionNote, batchNumber } = opts;

    const batched = batchNumber === '' ? false : true;
    let futureDate = false
    if (Date.parse(selectedDate) > UTIL.getTodaysDate(true)) {
      futureDate = true
    }
    let ro = batched || futureDate ? true : false;

    const warnDisp = document.createElement('h4');
    if (batched) {
      warnDisp.innerText = 'Selected Route is Batched.';
    } else if (futureDate) {
      warnDisp.innerHTML = 'The date you have selected is a future date.<br>Vehicle Inspections can not be created for future dates.';
    }
    warnDisp.style.color = '#DB162f';
    warnDisp.style.textAlign = 'center';

    const popup = POPUP.build({
      id: `route-${vehicleInfoId}`,
      header: tripName,
      classNames: 'selectedRoutePopup'
    });
    const documentBtn = button.build({
      id: `document-${vehicleInfoId}`,
      text: batched || futureDate || $.session.transportationUpdate === false ? 'Review Route' : 'Document',
      style: 'secondary',
      type: 'contained',
      classNames: 'docBtn',
      callback: () => {
        POPUP.hide(popup);
        TRANS_routeDocumentation.init({date: selectedDate, routeID: tripsCompletedId, routeName: tripName, vehicleInfoId: vehicleInfoId, readOnly: ro})
      }
    });
    const vehicleInspBtn = button.build({
      id: `inspection-${vehicleInfoId}`,
      text: tripInspection !== '' ?  'Review Vehicle Inspection' : 'Vehicle Inspection',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(popup);
        if (tripInspection === '') {
          // If there is no inspection, add a new one
          TRANS_vehicleInspection.init({enterPath: 'routeSelection', vId: vehicleInfoId, rId: tripsCompletedId, routeName: tripName, routeDate: selectedDate})
        } else {
          // Else, review the one that exists
          TRANS_vehicleInspection.init({enterPath: 'routeSelection', vId: vehicleInfoId, rId: tripsCompletedId, routeName: tripName, edit: true, batchedRoute: batched,
          editData: {
            inspectionId: tripInspection, 
            enteredById: tripInspectionEnteredBy,
            inspectionDate: UTIL.formatDateFromIso(selectedDate),
            inspectionTime: inspectionTime,
            note: inspectionNote
          },
          routeDate: selectedDate})
        }
      }
    });
    if (futureDate || (batched && tripInspection === '') || ($.session.transportationUpdate === false && tripInspection === ''))  {
      // Vehicle inspections can't be created for future dates Or batched routes or they do not have Update permission
      // except if there is already a inspection, then they can review it.
      vehicleInspBtn.classList.add('disabled')
    }
    documentBtn.style.width = '100%'
    vehicleInspBtn.style.width = '100%'
    if (batched || futureDate) popup.appendChild(warnDisp)
    popup.appendChild(documentBtn)
    popup.appendChild(vehicleInspBtn);
    POPUP.show(popup)
  }

  /**
   * 
   * @param {object} opts 
   * @param {string} opts.tripsCompletedId Selected Route Id
   * @param {string} opts.tripName Name of selected route
   * @param {string} opts.vehicleInfoId Vehicle Info Id for the route
   * @param {string} opts.tripInspection Inspection tied to route, or ''
   * @param {string} date Date they have selected
   */
  function init(opts, date) {
    buildPopup(opts, date)
  }
  return {
    init
  }
})();