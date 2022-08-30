const TRANS_updatePopup = (function() {

  let updateDropdown, currentDisplay, saveBtn;
  let updateType, routes;

  function createPopupElements() {
    switch (updateType) {
      case 'Driver':
        updateDropdown = dropdown.build({
          dropdownId: 'updateDropdown',
          label: 'Update selected routes driver to:',
          style: 'secondary'
        })
        break;
      case 'Vehicle':
        updateDropdown = dropdown.build({
          dropdownId: 'updateDropdown',
          label: 'Update selected routes vehicle to:',
          style: 'secondary'
        })
        break;
      default:
        break;
    }
  }

  function createCurrentDisplay() {
    currentDisplay = document.createElement('div');
    currentDisplay.classList.add('transCurrentDisplay');
    const updateDescription = document.createElement('h4');
    updateDescription.innerText = updateType === 'Driver' ? 
    'Selected Routes, and current drivers assigned:' :
    'Selected Routes, and current vehicles assigned:';
    updateDescription.style.paddingBottom = '10px';
    currentDisplay.appendChild(updateDescription)
    routes.forEach((val, key, map) => {
      const driverLookup = TRANS_mainLanding.driverLookup(val.driverId);
      const vehicleLookup = TRANS_mainLanding.vehicleLookup(val.vehicleInfoId)

      const routeDisp = document.createElement('p');
      const driverDisp = `${driverLookup.Last_Name}, ${driverLookup.First_Name}`;
      const vehicleDisp = `${vehicleLookup.vehicleNumber}`;
      routeDisp.innerHTML = `${val.tripName}: <span style="color:#366A98;">${updateType === 'Driver' ? driverDisp : vehicleDisp}</span>`
      currentDisplay.appendChild(routeDisp)
    })
  }

  function buildFilterPopup() {
    const popup = POPUP.build({
      header: `Update ${updateType}`,
      classNames: 'updateRoutePopup'
    })

    saveBtn = button.build({
      text: 'SAVE',
      style: 'secondary',
      type: 'contained',
      icon: 'save',
      classNames: 'disabled',
      callback: () => {
        POPUP.hide(popup)
        saveData()
      }
    });
    saveBtn.style.width = '100%'
    popup.appendChild(currentDisplay)
    popup.appendChild(updateDropdown)
    popup.appendChild(saveBtn);
    POPUP.show(popup)

    populateDropdown();
    eventListener();
  }

  function eventListener() {
    updateDropdown.addEventListener('change', event => {
      if (event.target.value === "") {
        saveBtn.classList.add("disabled")
      } else {
        saveBtn.classList.remove("disabled")
      }
    })
  }

  function populateDropdown(params) {
    const dropdownData = []
    switch (updateType) {
      case 'Driver':
        const drivers = TRANS_mainLanding.getAllDrivers();
        drivers.forEach((val,key,map) => {
          dropdownData.push({
            value: key,
            text: `${val.Last_Name}, ${val.First_Name}`
          });
        });
        break;
      case 'Vehicle':
        const vehicles = TRANS_mainLanding.getVehicles();
        vehicles.forEach((val,key,map) => {
          dropdownData.push({
            value: key,
            text: val.vehicleNumber
          });
        })
        break;
      default:
        break;
    }
    dropdownData.unshift({ value: '', text: ''});
    dropdown.populate(updateDropdown, dropdownData);
  }

  async function saveData() {
    pendingSave.show('Updating Routes...')
    try {
      const routeIdConcat = Array.from(routes.keys()).join("|");
      const newUpdateVal = updateDropdown.firstChild.options[updateDropdown.firstChild.selectedIndex].value;
      const updateData = {
        token: $.session.Token,
        method: updateType,
        routeIdString: routeIdConcat,
        updateVal: newUpdateVal
      }
      await TRANS_manageRoutesAjax.massUpdateDriverVehicle(updateData);
      pendingSave.fulfill('Routes have been updated');
      setTimeout(() => {
        successfulSave.hide();
        TRANS_manageRoutes.massUpdateCallback();
      }, 3000)
    } catch (error) {
      pendingSave.reject('Failed to update routes. Please try again.')
      console.warn('Error saving updates');
      console.error(error);
      setTimeout(() => failSave.hide(), 3000)
    }
  }

  /**
   * 
   * @param {object} opts 
   * @param {string} opts.updateType driver or vehicle
   * @param {string} opts.currentValue the current driver or vehicle
   * @param {array} opts.selectedRoutes Routes that are selected from the route dropdown
   */
  function init(opts) {
    updateType = UTIL.capitalize(opts.updateType);
    routes = opts.selectedRoutes;
    createPopupElements();
    createCurrentDisplay()
    buildFilterPopup()
  }
  return {
    init
  }
})();