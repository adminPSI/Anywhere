const TRANS_myRoute = (function() {
  let routeSection, dateInput, warningDisp;
  let selectedDate, trips, tripsStatus;

  function buildPage() {
    ////////////
    // TOP SECTION
    const topSection = document.createElement('div');
    const backButton = button.build({
      id: 'myRouteBackButton',
      text: 'Back',
      style: 'secondary',
      type: 'text',
      icon: 'arrowBack',
      callback: () => {
        setActiveModuleSectionAttribute(null);
        TRANS_mainLanding.init();
      }
    });
    dateInput = input.build({
      id: "myRouteDate",
      label: "Date",
      type: "date",
      style: "secondary",
      value: UTIL.getTodaysDate(),
      attributes: [{'max': UTIL.getTodaysDate()}]
    })
    // Warning display for 'no routes, or future date'
    warningDisp = document.createElement('p');
    warningDisp.style.color = '#DB162f';
    warningDisp.style.textAlign = 'center';
    warningDisp.style.marginBottom = '10px';
    // set selected date to today:
    selectedDate = UTIL.getTodaysDate();
    topSection.appendChild(backButton);
    topSection.appendChild(dateInput);
    topSection.appendChild(warningDisp);
    /////////////////
    // Route Button section
    routeSection = document.createElement('div')
    routeSection.classList.add('myRouteButtonSection')

    DOM.ACTIONCENTER.appendChild(topSection)
    DOM.ACTIONCENTER.appendChild(routeSection)
    eventListeners()

  }

  function buildRouteBtn(route) {
    const { tripName, tripsCompletedId, tripInspection } = route
    const routeBtn = document.createElement('div');
    const status = tripsStatus.get(tripsCompletedId)
    let statusText;
    switch (status) {
      case 'C':
        statusText = 'Complete'
        break;
      case 'IP':
        statusText = 'In Progress'
        break;
      case 'NS':
        statusText = 'Not Started'
        break;
      default:
        break;
    }
    const inspIcon = tripInspection !== '' ? icons.checkmark : icons.close;
    const inspColor = tripInspection !== '' ? 'white' : 'red';
    routeBtn.classList.add('routeBtn', `status__${status}`)
    routeBtn.setAttribute('id', `route-${tripsCompletedId}`)
    routeBtn.innerHTML = `
    <div class="routeBtnText tripName">${tripName}</div>
    <div class="routeBtnText tripStatus">${statusText}</div>
    <div class="routeBtnText inspectionStatus inspectionStatus--${inspColor}">${inspIcon} Inspection</div>

    `;
    routeBtn.addEventListener(
      "click",
      () => {
        TRANS_selectedRoutePopup.init(route, selectedDate);
      }
    );
    routeSection.appendChild(routeBtn);
  }

  function eventListeners() {
    dateInput.addEventListener('input', event => {
      selectedDate = event.target.value;
      if (Date.parse(event.target.value) > UTIL.getTodaysDate(true)) {
        warningDisp.innerText = 'Notice: Future dates are read only'
      } else {
        warningDisp.innerText = ''
      }
      getData(event.target.value);
    })
  }

  async function getData(date) {
    routeSection.innerHTML = ''
    PROGRESS__ANYWHERE.init()
    PROGRESS__ANYWHERE.SPINNER.show(routeSection, 'Gathering Trips...');
    try {
      const tripsResp =  (await TRANS_myRotueAjax.getTrips(date)).getTripsResult
      let tempTrips = new Map();
      tripsResp.forEach(trip => {
        tempTrips.set(trip.tripsCompletedId, trip);
      })
      trips = tempTrips;
      determineTripStatus()
      routeSection.innerHTML = ''
      if (trips.size === 0) {
        warningDisp.innerText = 'No routes have been found for this date'
      } else {
        for (const [key, value] of trips) {
          buildRouteBtn(value);
         }
      }
    } catch (error) {
      PROGRESS__ANYWHERE.SPINNER.hide(routeSection)
      console.error(error)
      console.error('Error gathering routes. Check for valid date, and users permissions')
    }
  }

  function determineTripStatus() {
    const tempStatusMap = new Map()
    trips.forEach((val,key,map) => {
      const { endTime, odoStart, odoStop, startTime, tripType, totalConsumersOnRecord, consumerNoStatus } = val; 
      let status;


      // First break down into Miles or Trip. Miles and Trip have different definitions of being complete.
      switch (tripType) {
        case 'M':
          if (endTime === "" && startTime === "" && odoStart === "" && odoStop === "" && consumerNoStatus === totalConsumersOnRecord) {
            // Nothing has been completed, so the trip has not started = NS
            status = "NS"
          } else if (endTime !== "" && startTime !== "" && odoStart !== "" && odoStop !== "" && consumerNoStatus == 0) {
            // Everything has been completed, so the trip is complete = C
            status = "C"
          } else {
            // If something is completed... but not everything, its still in progress = IP
            status = "IP"
          }
          break;
        case 'T':
          if (endTime === "" && startTime === "" && consumerNoStatus === totalConsumersOnRecord) {
            // Nothing has been completed, so the trip has not started = NS
            status = "NS"
          } else if (endTime !== "" && startTime !== "" && consumerNoStatus == 0) {
            // Everything has been completed, so the trip is complete = C
            status = "C"
          } else {
            // If something is completed... but not everything, its still in progress = IP
            status = "IP"
          }
          break;
      
        default:
          console.error('There was a problem determining the completion status of the trip. No Miles/Trip Billing_Type found!')
          console.log('Setting to NOT STARTED')
          status = 'NS'
          break;
      }

      tempStatusMap.set(key, status)
    })
    tripsStatus = tempStatusMap;
  }

  function init() {
    DOM.scrollToTopOfPage();
    DOM.clearActionCenter();
    setActiveModuleSectionAttribute("myroute");

    buildPage()
    getData(UTIL.getTodaysDate())
  }
  return {
    init
  }
})();