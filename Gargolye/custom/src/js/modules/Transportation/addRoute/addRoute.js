const TRANS_addRoute = (function () {
  /*
  Date
  Route Name
  Driver
  Other Rider
  Location
  Vehicle
  Billing Type (radio: Miles/Trips)
  Consumers
  */

  let dateInput,
    routeNameInput,
    driverDropdown,
    otherRiderDropdown,
    locationDropdown,
    vehicleDropdown;
  let milesRadio, tripsRadio;
  let consumerSectionBody, noConsumerWarning;
  let consumersOnRecord = new Map();

  function buildPage() {
    const column1 = document.createElement('div')
    const column2 = document.createElement('div')
    column1.classList.add('col-1')
    column2.classList.add('col-2')

    // Route Info Card//
    const routeInfoCard = document.createElement("div");
    routeInfoCard.classList.add("card");
    const routeInfoCardBody = document.createElement("div");
    routeInfoCardBody.classList.add("card__body");
    routeInfoCard.innerHTML = `
    <div class="card__header">Route Information</div>
    `;
    routeInfoCard.appendChild(routeInfoCardBody)
    //
    dateInput = input.build({
      id: "addRouteDate",
      label: "Date",
      type: "date",
      style: "secondary",
      value: UTIL.getTodaysDate(),
    });
    routeNameInput = input.build({
      id: "routeNameInput",
      label: "Route Name",
      charLimit: 60
    });
    routeNameInput.autocomplete = 'false'
    routeNameInput.classList.add('error') //Name is required
    driverDropdown = dropdown.build({
      dropdownId: "driverDropdown",
      label: "Driver",
      style: "secondary",
    });
    otherRiderDropdown = dropdown.build({
      dropdownId: "otherRiderDropdown",
      label: "Other Rider",
      style: "secondary",
    });
    vehicleDropdown = dropdown.build({
      dropdownId: "vehicleDropdown",
      label: "Vehicle",
      style: "secondary",
    });
    vehicleDropdown.classList.add('error')
    locationDropdown = dropdown.build({
      dropdownId: "locationDropdown",
      label: "Location",
      style: "secondary",
    });
    locationDropdown.classList.add('error')
    // Billing Radios //
    milesRadio = input.buildRadio({
      id: `milesRadio`,
      text: "Miles",
      name: "billingType",
      isChecked: true,
    });
    tripsRadio = input.buildRadio({
      id: `tripsRadio`,
      text: "Trips",
      name: "billingType",
      isChecked: false,
    });
    const radioDiv = document.createElement("div");
    radioDiv.classList.add("addRouteRadioDiv");
    radioDiv.appendChild(milesRadio);
    radioDiv.appendChild(tripsRadio);
    /////////////////
    const saveBtn = button.build({
      id: 'saveBtn',
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      icon: 'save',
      callback: () => {
        saveRoute()
      }
    });
    const cancelBtn = button.build({
      id: 'cancelBtn',
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: () => {
        // Should probably reset values maybe?? will need to test
        setActiveModuleSectionAttribute(null);
        roster2.clearActiveConsumers()
        TRANS_mainLanding.init();
      }
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);
    ///////////////////
    // Append to first column //
    column1.appendChild(routeInfoCard)
    routeInfoCardBody.appendChild(dateInput);
    routeInfoCardBody.appendChild(routeNameInput);
    routeInfoCardBody.appendChild(driverDropdown);
    routeInfoCardBody.appendChild(otherRiderDropdown);
    routeInfoCardBody.appendChild(vehicleDropdown);
    routeInfoCardBody.appendChild(locationDropdown);
    routeInfoCardBody.appendChild(radioDiv);
    ////////////////////
    // Consumer Section //
    const consumerSectionCard = document.createElement("div");
    const consumerSectionHeader = document.createElement("div");
    consumerSectionBody = document.createElement("div");
    consumerSectionCard.classList.add("card");
    consumerSectionHeader.classList.add("card__header");
    consumerSectionBody.classList.add("card__body");
    consumerSectionBody.id = 'consumerOnRouteSection'
    consumerSectionHeader.innerText = "Consumers on Route";
    consumerSectionCard.appendChild(consumerSectionHeader);
    consumerSectionCard.appendChild(consumerSectionBody);
    // No Consumer Warning //
    noConsumerWarning = document.createElement('p');
    noConsumerWarning.style.color = 'red';
    noConsumerWarning.innerText = 'You must select at least one consumer for the route.'
    consumerSectionBody.appendChild(noConsumerWarning)
    //
    column2.appendChild(consumerSectionCard)
    column2.appendChild(btnWrap)
    DOM.ACTIONCENTER.appendChild(column1)
    DOM.ACTIONCENTER.appendChild(column2)

    populateDropdowns()
    eventListeners()
  }

  function populateDropdowns() {
    const vehicleDropdownData = []
    const driverDropdownData = []
    const otherRiderDropdownData = []
    const locationDropdownData = []
    const vehicles = TRANS_mainLanding.getVehicles();
    const drivers = TRANS_mainLanding.getAllDrivers();
    const locations = TRANS_mainLanding.getLocations();

    vehicles.forEach((val,key,map) => {
      vehicleDropdownData.push({
        value: key,
        text: val.vehicleNumber
      });
    })

    drivers.forEach((val,key,map) => {
      driverDropdownData.push({
        value: key,
        text: `${val.Last_Name}, ${val.First_Name}`
      });
      otherRiderDropdownData.push({
        value: key,
        text: `${val.Last_Name}, ${val.First_Name}`
      });
    });

    locations.forEach((val,key,map) => {
      locationDropdownData.push({
        value: key,
        text: val.Name
      })
    })

    otherRiderDropdownData.unshift({ value: '0', text: 'NONE'})
    vehicleDropdownData.unshift({ value: '', text: ''})
    locationDropdownData.unshift({ value: '', text: ''})

    dropdown.populate(vehicleDropdown, vehicleDropdownData);
    dropdown.populate(driverDropdown, driverDropdownData, $.session.PeopleId);
    // If the person logged in is not classified as a driver, driver dropdown will
    // default to a blank option, and need to be classified as an error untill changed
    if (!drivers.has($.session.PeopleId)) driverDropdown.classList.add('error');
    dropdown.populate(otherRiderDropdown, otherRiderDropdownData);
    dropdown.populate(locationDropdown, locationDropdownData);
  }

  function eventListeners() {
    vehicleDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      if (selectedOption.value === '') {
        vehicleDropdown.classList.add('error');
        console.warn('No vehicle selected.')
      } else {
        vehicleDropdown.classList.remove('error');
      }
    })
    locationDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      if (selectedOption.value === '') {
        locationDropdown.classList.add('error');
        console.warn('No location selected.')
      } else {
        locationDropdown.classList.remove('error');
      }
    })
    driverDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      if (selectedOption.value === '') {
        driverDropdown.classList.add('error');
        console.warn('No driver selected.')
      } else {
        driverDropdown.classList.remove('error');
      }
    })
    routeNameInput.addEventListener('keyup', event => {
      if (event.target.value === '') {
        routeNameInput.classList.add('error')
      } else {
        routeNameInput.classList.remove('error')
      }
    });
    dateInput.addEventListener('change', event => {
      resetPageForNewDate(event.target.value)
    })
  }

  function resetPageForNewDate(newDate) {
    /* When Changing the date, several date dependant items need to be reset.
        Driver/Other Rider - re-populate dropdown with new data based on date
        Consumers - remove all consumers, and reset the day in the mini roster
    */

    // * ROSTER AND CONSUMERS
     roster2.updateSelectedDate(newDate)
     roster2.clearActiveConsumers()
     consumersOnRecord.clear();
     const consumerSection = document.getElementById('consumerOnRouteSection');
     consumerSection.innerHTML = '';
     consumerSection.appendChild(noConsumerWarning)
     noConsumerWarning.style.display = 'block' 
    // *

    // * Driver/Other Rider
    const drivers = TRANS_mainLanding.getAllDrivers(Date.parse(newDate));
    let driverDropdownData = []
    let otherRiderDropdownData = []
    drivers.forEach((val,key,map) => {
      driverDropdownData.push({
        value: key,
        text: `${val.Last_Name}, ${val.First_Name}`
      });
      otherRiderDropdownData.push({
        value: key,
        text: `${val.Last_Name}, ${val.First_Name}`
      });
    });
    otherRiderDropdownData.unshift({ value: '0', text: 'NONE'})
    dropdown.populate(driverDropdown, driverDropdownData, $.session.PeopleId);
    dropdown.populate(otherRiderDropdown, otherRiderDropdownData);
    //*
  }

  function consumerRemoveAction(consumerId) {
    consumersOnRecord.delete(consumerId)
    if (consumersOnRecord.size > 0) {
      noConsumerWarning.style.display = 'none'
    } else noConsumerWarning.style.display = 'block' 
  }
  function updateConsumerData(data) {
    const { consumerId, key, value } = data
    consumersOnRecord.get(consumerId)[key] = value;
  }
  function retrieveConsumerData(consumerId, key) {
    return consumersOnRecord.get(consumerId)[key];
  }
  function handleActionNavEvent(target) {
    const targetAction = target.dataset.actionNav;
    switch (targetAction) {
      case "miniRosterDone": {
        const selectedConsumers = roster2.getSelectedConsumersMiniRoster()
        selectedConsumers.forEach(async consumer => {
          const consumerDetails = (await TRANS_routeDocumentationAjax.getConsumerDetails(consumer.id)).getConsumerDetailsResult[0];
          consumersOnRecord.set(consumer.id, consumerDetails);
          consumersOnRecord.get(consumer.id)['riderStatus'] = '';
          const transportationCard = TRANS_consumerDocCard.createCard(consumer.id, consumerDetails);
          consumerSectionBody.appendChild(transportationCard)
          if (consumersOnRecord.size > 0) {
            noConsumerWarning.style.display = 'none'
          } else noConsumerWarning.style.display = 'block'
        })
        break;
      }
      case "miniRosterCancel": {
        roster2.clearSelectedConsumers();
        DOM.toggleNavLayout();
        break;
      }
    }
  }
  async function saveRoute() {
    pendingSave.show('Creating Route...')
    try {
      // Check for errors first
      const errors = document.querySelectorAll('.error');
      if (errors.length > 0) throw "err exist"
      if (consumersOnRecord.size === 0) throw "no consumers"
      //
      const date = dateInput.querySelector('input').value;
      const routeName = routeNameInput.querySelector('input').value;
      const driverddElement = document.getElementById('driverDropdown');
      const driver = driverddElement.options[driverddElement.selectedIndex].value;
      const otherRiderElement = document.getElementById('otherRiderDropdown');
      const otherRider = otherRiderElement.options[otherRiderElement.selectedIndex].value;
      const vehicleElement = document.getElementById('vehicleDropdown');
      const vehicle = vehicleElement.options[vehicleElement.selectedIndex].value;
      const locationElement = document.getElementById('locationDropdown');
      const location = locationElement.options[locationElement.selectedIndex].value;
      const billingType = document.getElementById("milesRadio").checked ? "M":"T";
      const data = {
        token: $.session.Token,
        tripName: UTIL.removeUnsavableNoteText(routeName),
        driverId: driver,
        otherRider: otherRider,
        dateOfService: date,
        billingType: billingType,
        vehicleInformationId: vehicle,
        locationId: location
      }
      // 1) Save main trip to get the tripCompletedId from DB
      const tripCompletedId = (await TRANS_addRouteAjax.insertTrip(data)).insertTripCompletedResult[0].tripCompletedId
      // 2) Save consumers to the newly created tripCompletedId
      const dbCallArr = []
      consumersOnRecord.forEach((val,key,map) => {
        const { alternateAddress, completedDetailId, directions, pickupOrder, notes, riderStatus, scheduledTime, specialInstructions, totalTravelTime } = val
        const consumerDetailSubmit = {
          token: $.session.Token,
          tripDetailId: completedDetailId ? completedDetailId : '',
          tripsCompletedId:  tripCompletedId,
          consumerId:  key,
          alternateAddress:  alternateAddress ? alternateAddress : '',
          scheduledTime:  scheduledTime ? scheduledTime : '',
          totalTravelTime:  totalTravelTime ? totalTravelTime : '',
          riderStatus:  riderStatus,
          specialInstructions:  specialInstructions ? specialInstructions : '',
          directions:  directions ? directions : '',
          pickupOrder:  pickupOrder ? pickupOrder : '',
          notes:  notes ? notes: '',
        };
        dbCallArr.push(TRANS_routeDocumentationAjax.insertUpdateTripConsumers(consumerDetailSubmit))
      })
      Promise.all(dbCallArr).then(res => {
        pendingSave.fulfill('Route has been created');
        setTimeout(() => {
          successfulSave.hide();
          roster2.clearActiveConsumers()
          /* 
            After saving, if the route is for a future date OR the
            driver on the route is different than the person creating the route,
            then take them to the transportation landing page.
            Otherwise give them the save route popup.
          */
          if (Date.parse(date) > UTIL.getTodaysDate(true) || $.session.PeopleId !== driver) {
            TRANS_mainLanding.init();
          } else {
            saveRoutePopup(tripCompletedId, date, routeName, vehicle)
          }
        }, 3000)
      })
    } catch (error) {
      switch (error) {
        case 'err exist':
          pendingSave.reject('Failed to create route. Please correct any errors that exist on the route.')
          console.error('Failing due to missing required fields.')
          break;
        case 'no consumers':
          pendingSave.reject('Failed to create route. There must be at least on consumer for a route.')
          console.error('Failing due to no consumers added.')
          break;
        default:
          pendingSave.reject('Failed to save. Please try again.')
          console.error(error)
          break;
      }
      setTimeout(() => failSave.hide(), 3000)
    }
  }
  function saveRoutePopup(tripCompletedId, tripDate, tripName, vehicleId) {
    const popup = POPUP.build({
      hideX: true,
      classNames: 'routeSavedPopup'
    });
    const message = document.createElement('div');
    message.style.textAlign = 'center'
    message.innerHTML = `
    <p style='padding-top: 10px; margin-bottom: 20px'>Would you like to document, or do a vehicle inspection for this route?</p>
    `;
    const documentBtn = button.build({      
      text: 'Document',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(popup)
        TRANS_routeDocumentation.init({
          date: tripDate,
          routeID: tripCompletedId,
          routeName: tripName,
          vehicleInfoId: vehicleId
        })
      }
    });
    const vehicleInspectionBtn = button.build({
      text: 'Vehicle Inspection',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(popup)
        TRANS_vehicleInspection.init({
          enterPath: 'addRoute',
          vId: vehicleId,
          rId: tripCompletedId,
          routeName: tripName,
          routeDate: tripDate
        })
      }
    });
    const docLaterBtn = button.build({
      text: 'Document Later',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(popup)
        TRANS_mainLanding.init()
      }
    });
    documentBtn.style.width = '100%';
    vehicleInspectionBtn.style.width = '100%';
    docLaterBtn.style.width = '100%';
    popup.appendChild(message)
    popup.appendChild(documentBtn)
    popup.appendChild(vehicleInspectionBtn)
    popup.appendChild(docLaterBtn)
    POPUP.show(popup)
  }
  function init() {
    consumersOnRecord.clear();
    DOM.scrollToTopOfPage();
    DOM.clearActionCenter();
    setActiveModuleSectionAttribute("addroute");
    roster2.miniRosterinit(null, {hideDate: true})
    buildPage()
  }
  return {
    init,
    handleActionNavEvent,
    consumerRemoveAction,
    updateConsumerData,
    retrieveConsumerData
  };
})();
