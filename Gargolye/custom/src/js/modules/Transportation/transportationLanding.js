const TRANS_mainLanding = (function() {
  //TRANSPORTATION SHARED DATA
  let drivers, inspectionCategories, vehicles, locations, altAddresses;

  function loadTransportationLanding(params) {
    const myRoutesBtn = button.build({
      text: 'MY ROUTES',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        TRANS_myRoute.init()
      }
    })
    const manageRoutesBtn = button.build({
      text: 'MANAGE ROUTES',
      style: 'secondary',
      type: 'contained',
      callback: () => TRANS_manageRoutes.init()
    })
    const newRouteBtn = button.build({
      text: 'ADD NEW ROUTE',
      style: 'secondary',
      type: 'contained',
      callback: () => TRANS_addRoute.init()
    })
    const vehicleInspectionBtn = button.build({
      text: 'VEHICLE INSPECTION',
      style: 'secondary',
      type: 'contained',
      callback: () => TRANS_vehicleInspectionLanding.init()
    })
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('landingBtnWrap');
    btnWrap.appendChild(myRoutesBtn);
    if ($.session.transportationManageRoute === true ) btnWrap.appendChild(manageRoutesBtn);
    if ($.session.transportationAddRoute === true ) btnWrap.appendChild(newRouteBtn);
    btnWrap.appendChild(vehicleInspectionBtn);
    DOM.ACTIONCENTER.appendChild(btnWrap);
  }

  function getCategories() {
    return inspectionCategories
  }
  function getVehicles() {
    return new Map([...vehicles].filter(([k,v]) => v.Active === 'Y'))
  }
  function getLocations() {
    return locations
  }
  function getAlternateAddress(consumerId) {
    return altAddresses.get(consumerId)
  }

  function updateAltAddress() {
    TRANS_mainLandingAjax.getAltAddresses().then(res => {
      const tempAltAddresses = res.getAlternateAddressesResult
      let tempAltAddressesMap = new Map();
      tempAltAddresses.forEach(address => {
        if (tempAltAddressesMap.has(address.consumerId)) {
          const addArr = tempAltAddressesMap.get(address.consumerId);
          addArr.push(address);
          tempAltAddressesMap.set(address.consumerId, addArr)
        } else {
          tempAltAddressesMap.set(address.consumerId, [address]);
        }
      })
      altAddresses = tempAltAddressesMap;
    })
  }

  function getAllDrivers(filteredDate) {
    // Pass Date Object as filtered Date
    if (!filteredDate) filteredDate = UTIL.getTodaysDate(true)
    return new Map(
      [...drivers].filter(([k,v]) => {
        const catEndDate = new Date(v.catEndDate)
        const catStartDate = new Date(v.catStartDate)
        const termDate = new Date(v.termDate)
        return (
          (catEndDate >= filteredDate || v.catEndDate === "") &&
          (termDate >= filteredDate || v.termDate === "") && 
          (catStartDate <= filteredDate)
          )
      })
    )
  }

  function driverLookup(id) {
    return drivers.get(id)
  }
  function vehicleLookup(id) {
    const ret = vehicles.has(id) ? vehicles.get(id) : 'Non-Existant Vehicle!';
    if (ret === 'Non-Existant Vehicle!' && id !== '%') console.error(`Vehicle ID: ${id} does not exist in the database!`)
    return ret
  }
  function locationLookup(id) {
    return locations.get(id)
  }
   function vehicleFilteredLookup(id) {
     return vehicles.get(id)
   }

  async function getData() {
    PROGRESS.init()
    PROGRESS.SPINNER.show('Gathering Data...')
    function gatherComplete(res) {
      const tmpDrivers = res[0].getDriversResult
      const tempCategories = res[1].getInspectionCategoriesResult
      const tempVehicles = res[2].getVehicleDropdownResult
      const tempLocations = res[3].getLocationsJSONResult
      const tempAltAddresses = res[4].getAlternateAddressesResult

      let tmpDriversMap = new Map();
      let tempCategoriesMap = new Map();
      let tempVehiclesMap = new Map();
      let tempLocationsMap = new Map();
      let tempAltAddressesMap = new Map();

      tmpDrivers.forEach(driver => {
        tmpDriversMap.set(driver.Person_ID, driver);
      })
      tempCategories.forEach(category => {
        tempCategoriesMap.set(category.categoryID, {desc: category.description, allowNA: category.allowNA});
      })
      tempVehicles.forEach(vehicle => {
        tempVehiclesMap.set(vehicle.vehicleInformationId, vehicle);
      })
      tempLocations.forEach(location => {
        // Only N residence locaitons
        if (location.Residence === 'N') tempLocationsMap.set(location.ID, location);
      })
      tempAltAddresses.forEach(address => {
        if (tempAltAddressesMap.has(address.consumerId)) {
          const addArr = tempAltAddressesMap.get(address.consumerId);
          addArr.push(address);
          tempAltAddressesMap.set(address.consumerId, addArr)
        } else {
          tempAltAddressesMap.set(address.consumerId, [address]);
        }
      })

      drivers = tmpDriversMap;
      inspectionCategories = tempCategoriesMap;
      vehicles = tempVehiclesMap;
      locations = tempLocationsMap;
      altAddresses = tempAltAddressesMap;
    }

    const promises = []

    const driversProm =  TRANS_mainLandingAjax.getDrivers()
    promises.push(driversProm)
    const categoryProm =  TRANS_vehicleInspectionAjax.getInspectionCategories()
    promises.push(categoryProm)
    const vehicleProm =  TRANS_mainLandingAjax.getVehicles()
    promises.push(vehicleProm);
    const locationProm = rosterAjax.getRosterLocations()
    promises.push(locationProm)
    const altAddressProm = TRANS_mainLandingAjax.getAltAddresses()
    promises.push(altAddressProm)

    await Promise.all(promises)
    .then(res => gatherComplete(res))
    .catch(err => console.error('ERROR GATHERING DATA! MODULE WILL NOT WORK PROPERLY: ' + err))
  }

  async function init() {
    if (!drivers || !vehicles || !inspectionCategories) {
      await getData()
    }
    DOM.scrollToTopOfPage();
    DOM.clearActionCenter();
    const miniRosterBtn = document.querySelector('.consumerListBtn');
    if (miniRosterBtn) {
      miniRosterBtn.remove();
      DOM.toggleNavLayout();
    }
    loadTransportationLanding()
    if ($.session.transportationUpdate === false) console.info('User does not have update permissions. My Route and Vehicle Inspections will be read only')
  }
  return {
    init,
    getAllDrivers,
    driverLookup,
    getCategories,
    getVehicles,
    vehicleLookup,
    getLocations,
    getAlternateAddress,
    locationLookup,
    vehicleFilteredLookup,
    updateAltAddress
  }
})();