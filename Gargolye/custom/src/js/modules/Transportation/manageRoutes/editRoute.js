const TRANS_manageEditRoute = (function () {
    let driverDropdown, routeNameInput, locationDropdown, otherRiderDropdown, vehicleDropdown, routeStartOdo, routeEndOdo, routeStartInput, routeEndInput, tripIntegratedEmploymentCheckbox, originationInput, destinationInput ;
    let milesRadio, tripsRadio;
    let consumerSectionBody, noConsumerWarning;
    let tripInfo;
    let consumersOnRecord = new Map();
    let consumersToRemove;
    let ro, isAddHoc, isBatched;
    let selectedDate, selectedRouteId, selectedRouteName, selectedLocationName, vehicleInspection, deleteInspection, selectedIntegratedEmployment;
    let notTodeleteConsumers = [];
    function buildPage() {
        const column1 = document.createElement('div')
        const column2 = document.createElement('div')
        column1.classList.add('col-1')
        column2.classList.add('col-2')
        const selectedRouteInformation = document.createElement('div');
        selectedRouteInformation.classList.add('editRouteHeader')
        const readableDate = UTIL.formatDateFromIso(selectedDate);

        const batchedWarninig = document.createElement('h4');
        batchedWarninig.classList.add('error');
        batchedWarninig.innerText = 'This route has been batched. No changes can be made.';
        batchedWarninig.style.marginBottom = '10px';
        batchedWarninig.style.textAlign = 'center';

        if (isAddHoc) {
            selectedRouteInformation.innerHTML = `
      <h4>Date:  <span class="highlightBlue">${readableDate}</span></h4>
      `;
        } else {
            selectedRouteInformation.innerHTML = `
      <h4>Route: <span class="highlightBlue">${selectedRouteName}</span></h4>
      <h4>Location: <span class="highlightBlue">${selectedLocationName}</span></h4>
      <h4>Date: <span class="highlightBlue">${readableDate}</span></h4>
      `;
        };

        // Route Info Card//
        const routeInfoCard = document.createElement("div");
        routeInfoCard.classList.add("card");
        const routeInfoCardBody = document.createElement("div");
        routeInfoCardBody.classList.add("card__body");
        routeInfoCard.innerHTML = `
    <div class="card__header">Route Information</div>
    `;
        routeInfoCard.appendChild(routeInfoCardBody)

        routeNameInput = input.build({
            id: "routeNameInput",
            label: "Route Name",
            charLimit: 60,
            readonly: ro,
            value: selectedRouteName
        });

        tripIntegratedEmploymentCheckbox = input.buildCheckbox({
            text: 'Trip To/From Integrated Employment',
            id: 'tripIntegratedEmploymentCheckbox',
            readonly: ro,
            //isChecked: false,
            isChecked: selectedIntegratedEmployment === 'Y' ? true : false,
        });
        
        locationDropdown = dropdown.build({
            dropdownId: "locationDropdown",
            label: "Location",
            readonly: ro,
            style: "secondary",
        });

        routeStartInput = input.build({
            id: "routeStartTime",
            label: "Route Start Time",
            type: "time",
            style: "secondary",
            readonly: ro,
            value: tripInfo.startTime
        });
        routeEndInput = input.build({
            id: "routeEndTime",
            label: "Route End Time",
            type: "time",
            style: "secondary",
            readonly: ro,
            value: tripInfo.endTime
        });
        routeStartOdo = input.build({
            id: "routeStartOdo",
            type: "number",
            label: "Starting Odometer",
            style: "secondary",
            readonly: ro,
            value: tripInfo.odometerStart
        });
        routeEndOdo = input.build({
            id: "routeEndOdo",
            type: "number",
            label: "Ending Odometer",
            style: "secondary",
            readonly: ro,
            value: tripInfo.odometerStop
        });
        driverDropdown = dropdown.build({
            dropdownId: "driverDropdown",
            label: "Driver",
            readonly: ro,
            style: "secondary",
        });
        otherRiderDropdown = dropdown.build({
            dropdownId: "otherRiderDropdown",
            label: "Other Rider",
            readonly: ro,
            style: "secondary",
        });
        vehicleDropdown = dropdown.build({
            dropdownId: "vehicleDropdown",
            label: "Vehicle",
            readonly: ro,
            style: "secondary",
        });

        //152264 - ADV-ANY-TR: Add Origination and Destination fields to Anywhere Transportation//
        originationInput = input.build({
            id: "originationInput",
            label: "Origination",
            type: "textarea",
            value: tripInfo.origination
        })

        destinationInput = input.build({
            id: "destinationInput",
            label: "Destination",
            type: "textarea",
            value: tripInfo.destination
        })
        /////////

        // Billing Radios //
        milesRadio = input.buildRadio({
            id: `milesRadio`,
            text: "Miles",
            name: "billingType",
            isDisabled: ro,
            isChecked: tripInfo.billingType === 'M' ? true : false,
        });
        tripsRadio = input.buildRadio({
            id: `tripsRadio`,
            text: "Trips",
            name: "billingType",
            isDisabled: ro,
            isChecked: tripInfo.billingType === 'T' ? true : false,
        });

        // Disable inputs for read only;
        if (ro) {
            routeNameInput.classList.add('disabled')
            tripIntegratedEmploymentCheckbox.classList.add('disabled')
            locationDropdown.classList.add('disabled')
            routeStartInput.classList.add('disabled')
            routeEndInput.classList.add('disabled')
            routeStartOdo.classList.add('disabled')
            routeEndOdo.classList.add('disabled')
            driverDropdown.classList.add('disabled')
            otherRiderDropdown.classList.add('disabled')
            vehicleDropdown.classList.add('disabled')
            originationInput.classList.add('disabled')
            destinationInput.classList.add('disabled') 
        }
        const radioDiv = document.createElement("div");
        radioDiv.classList.add("addRouteRadioDiv");
        radioDiv.appendChild(milesRadio);
        radioDiv.appendChild(tripsRadio);
        /////////////////
        // * Time Wrap
        const timeDiv = document.createElement("div");
        timeDiv.classList.add("odometerDiv");
        timeDiv.appendChild(routeStartInput);
        timeDiv.appendChild(routeEndInput);
        // * Odometer Wrap
        const odometerDiv = document.createElement("div");
        odometerDiv.classList.add("odometerDiv");
        odometerDiv.appendChild(routeStartOdo);
        odometerDiv.appendChild(routeEndOdo);
        //
        const updateBtn = button.build({
            id: "updateBtn",
            text: "Update",
            style: "secondary",
            type: "contained",
            icon: 'save',
            callback: () => {
                if (!updateBtn.classList.contains('disabled')) {
                    saveData();
                }
            },
        });
        const deleteBtn = button.build({
            id: "deleteBtn",
            classNames: 'trans_DeleteBtn',
            text: "Delete",
            style: "secondary",
            type: "contained",
            icon: 'delete',
            callback: () => deleteRoute(),
        });
        const cancelBtn = button.build({
            id: "cancelBtn",
            text: "Cancel",
            style: "secondary",
            type: "outlined",
            icon: 'close',
            callback: () => {
                roster2.clearActiveConsumers();
                roster2.removeMiniRosterBtn();
                TRANS_manageRoutes.init(false);
            },
        });
        const btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        if (!ro) btnWrap.appendChild(updateBtn);
        btnWrap.appendChild(cancelBtn);
        ///////////////////
        // Append to Main Section //
        if (isBatched) column1.appendChild(batchedWarninig)
        column1.appendChild(selectedRouteInformation);
        column1.appendChild(routeInfoCard);
        if (isAddHoc) routeInfoCardBody.appendChild(routeNameInput)
        routeInfoCardBody.appendChild(tripIntegratedEmploymentCheckbox);    
        routeInfoCardBody.appendChild(timeDiv);
        routeInfoCardBody.appendChild(odometerDiv);
        routeInfoCardBody.appendChild(driverDropdown);
        routeInfoCardBody.appendChild(otherRiderDropdown);
        routeInfoCardBody.appendChild(vehicleDropdown);
        if (isAddHoc) routeInfoCardBody.appendChild(locationDropdown)
        routeInfoCardBody.appendChild(originationInput);
        routeInfoCardBody.appendChild(destinationInput);
        routeInfoCardBody.appendChild(radioDiv);
        ////////////////////
        // Consumer Section //
        const consumerSectionCard = document.createElement("div");
        const consumerSectionHeader = document.createElement("div");
        consumerSectionBody = document.createElement("div");
        consumerSectionCard.classList.add("card", "consumerSectionCard");
        consumerSectionHeader.classList.add("card__header");
        consumerSectionBody.classList.add("card__body");
        consumerSectionHeader.innerText = "Consumers on Route";
        consumerSectionCard.appendChild(consumerSectionHeader);
        consumerSectionCard.appendChild(consumerSectionBody);
        // No Consumer Warning //
        noConsumerWarning = document.createElement('p');
        noConsumerWarning.style.color = 'red';
        noConsumerWarning.id = 'noConsumerWarningMessage';
        consumerSectionBody.appendChild(noConsumerWarning)
        noConsumerWarning.style.display = 'none';
        // Too many Consumer Warning //
        tooManyConsumersWarning = document.createElement('p');
        tooManyConsumersWarning.style.color = 'red';
        tooManyConsumersWarning.id = 'tooManyConsumersWarning';
        tooManyConsumersWarning.innerText = 'You must select only one consumer for this route.'
        tooManyConsumersWarning.style.display = 'none';

        column2.appendChild(consumerSectionCard)
        column2.appendChild(btnWrap);
        if (!ro) column2.appendChild(deleteBtn);
        column2.appendChild(tooManyConsumersWarning)
        ///////////////////////
        DOM.ACTIONCENTER.appendChild(column1);
        DOM.ACTIONCENTER.appendChild(column2);

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
        if (TripIntegratedEmploymentCheckbox.checked == true) {
            noConsumerWarning.innerText = 'You must select one consumer for the route.'
        } else {
            noConsumerWarning.innerText = 'You must select at least one consumer for the route.'
        }

        populateDropdowns()
        buildConsumerCards()
        eventListeners()

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
        if (TripIntegratedEmploymentCheckbox.checked == true) {
            if (consumersOnRecord.size > 0) {
                roster2.toggleMiniRosterBtnVisible(false);
            } else {
                roster2.toggleMiniRosterBtnVisible(true);
            }
            checkRequiredFields();
        }


        setBtnStatusOfAddRoute()
    }

    function buildConsumerCards() {
    consumersOnRecord.forEach((val,key, map) => {
            // transportationCard = TRANS_consumerDocCard.createCard(key, val, ro);
            transportationCard = TRANS_consumerDocCard.createCard(key, val, ro);
            consumerSectionBody.appendChild(transportationCard)
        })
    }

    function populateDropdowns() {
        if (isAddHoc) {
            const locationDropdownData = []
            const locations = TRANS_mainLanding.getLocations();
      locations.forEach((val,key,map) => {
                locationDropdownData.push({
                    value: key,
                    text: val.Name
                })
            });
            dropdown.populate(locationDropdown, locationDropdownData, tripInfo.locationId);
        }
        const vehicleDropdownData = []
        const driverDropdownData = []
        const otherRiderDropdownData = []
        const vehicles = TRANS_mainLanding.getVehicles();
        const drivers = TRANS_mainLanding.getAllDrivers();

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

    otherRiderDropdownData.unshift({ value: '', text: 'NONE'})

        dropdown.populate(vehicleDropdown, vehicleDropdownData, tripInfo.vehicleInformationId);
        dropdown.populate(driverDropdown, driverDropdownData, tripInfo.driverId);
        dropdown.populate(otherRiderDropdown, otherRiderDropdownData, tripInfo.otherRider);
    }

    function odoCheck() {
        const startVal = parseInt(routeStartOdo.querySelector('input').value)
        const endVal = parseInt(routeEndOdo.querySelector('input').value)
        //Odo can be null, check to see if they are numbers (NaN when they are null)
  if (typeof(startVal) !== 'number' && typeof(endVal) !== 'number') {
            routeStartOdo.classList.remove('error');
            routeEndOdo.classList.remove('error')
            return
        }
        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
        if (TripIntegratedEmploymentCheckbox.checked == true) {

            if (isNaN(startVal) && isNaN(endVal)) {
                routeStartOdo.classList.add('error');
                routeEndOdo.classList.add('error');
                setBtnStatusOfAddRoute();
                return;
            } else {
                if (isNaN(startVal)) {
                    routeStartOdo.classList.add('error');
                    setBtnStatusOfAddRoute();
                    return;
                }
                if (isNaN(endVal)) {
                    routeEndOdo.classList.add('error');
                    setBtnStatusOfAddRoute();
                    return;
                }
            }

            if (consumersOnRecord.size > 1) {
                roster2.toggleMiniRosterBtnVisible(false);
                tooManyConsumersWarning.style.display = 'block'; 
             } else if (consumersOnRecord.size == 1) {
               roster2.toggleMiniRosterBtnVisible(false);
               tooManyConsumersWarning.style.display = 'none';
            } else {
                roster2.toggleMiniRosterBtnVisible(true);
                tooManyConsumersWarning.style.display = 'none';
            }
          //  setBtnStatusOfRouteDocumentation();

        } else {  //TripIntegratedEmploymentCheckbox.checked == false

            roster2.toggleMiniRosterBtnVisible(true);
            tooManyConsumersWarning.style.display = 'none';
         //   setBtnStatusOfRouteDocumentation();
        }

        const dif = endVal - startVal;
        if (dif < 0) {
            routeStartOdo.classList.add('error');
            routeEndOdo.classList.add('error')
        } else {
            routeStartOdo.classList.remove('error');
            routeEndOdo.classList.remove('error')
        }
        setBtnStatusOfAddRoute();
    }

    function eventListeners() {
        routeStartInput.addEventListener('change', event => {
            const totalHours = UTIL.calculateTotalHours(routeStartInput.firstChild.value, routeEndInput.querySelector('input').value)
            if (totalHours < 0) {
                routeStartInput.classList.add('error')
            } else {
                routeStartInput.classList.remove('error')
                routeEndInput.classList.remove('error')
            }
            setBtnStatusOfAddRoute();
        })
        routeEndInput.addEventListener('change', event => {
            const totalHours = UTIL.calculateTotalHours(routeStartInput.querySelector('input').value, routeEndInput.firstChild.value)
            if (totalHours < 0) {
                routeEndInput.classList.add('error')
            } else {
                routeStartInput.classList.remove('error')
                routeEndInput.classList.remove('error')
            }
            setBtnStatusOfAddRoute();
        })
        routeStartOdo.addEventListener('change', () => odoCheck());
        routeEndOdo.addEventListener('change', () => odoCheck());

        routeNameInput.addEventListener('change', event => {
            if (event.target.value.trim() === "") {
                routeNameInput.classList.add('error');
            } else {
                routeNameInput.classList.remove('error');
            }
            selectedRouteName = event.target.value;
            setBtnStatusOfAddRoute();
        });

        tripIntegratedEmploymentCheckbox.addEventListener('change', event => {
            selectedIntegratedEmployment = event.target.checked ? 'Y' : 'N';
            // alert("Yep, that's it");
           // integratedEmployment: tripInfo.integratedEmployment
            var noConsumerWarningMessage = document.getElementById("noConsumerWarningMessage");
            var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
            var MilesRadio = document.getElementById("milesRadio");
            var TripsRadio = document.getElementById("tripsRadio");

            if (TripIntegratedEmploymentCheckbox.checked == true) {
              //  var MilesRadio = document.getElementById("milesRadio");
               TripsRadio.checked = true;  
               TripsRadio.disabled = true;
               MilesRadio.disabled = true;

               TripsRadio.classList.add('disabled');
               MilesRadio.classList.add('disabled');

               if (consumersOnRecord.size > 1) {
                noConsumerWarningMessage.innerText = 'You must select one consumer for the route.'
                roster2.toggleMiniRosterBtnVisible(false);
               // noConsumerWarningMessage.classList.add('error');
               // noConsumerWarning.classList.add('error');
               tooManyConsumersWarning.style.display = 'block';
               // alert('You have selected multiple consumers. Only one consumer is allowed for Integrated Employment. Please update your consumers and try again.');
                
             } else if (consumersOnRecord.size == 1) {
                noConsumerWarningMessage.innerText = 'You must select one consumer for the route.'
               roster2.toggleMiniRosterBtnVisible(false);
             //  noConsumerWarningMessage.classList.remove('error');
               tooManyConsumersWarning.style.display = 'none';
            } else {
                noConsumerWarningMessage.innerText = 'You must select one consumer for the route.'
               // noConsumerWarningMessage.classList.remove('error');
                // noConsumerWarning.classList.remove('error');
                roster2.toggleMiniRosterBtnVisible(true);
                tooManyConsumersWarning.style.display = 'none';
               }
               
               setBtnStatusOfAddRoute();



            } else {
               // var TripsRadio = document.getElementById("tripsRadio");
               MilesRadio.checked = true;   
               TripsRadio.disabled = false;
               MilesRadio.disabled = false;
               TripsRadio.classList.remove('disabled');
               MilesRadio.classList.remove('disabled');

               noConsumerWarningMessage.innerText = 'You must select at least one consumer for the route.'
               tooManyConsumersWarning.style.display = 'none';
               roster2.toggleMiniRosterBtnVisible(true);
               setBtnStatusOfAddRoute();
            }
 
            var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
            if (TripIntegratedEmploymentCheckbox.checked == true) {
                if (consumersOnRecord.size > 0) {
                    roster2.toggleMiniRosterBtnVisible(false);
                } else {
                    roster2.toggleMiniRosterBtnVisible(true);
                }
                
            } else {
                roster2.toggleMiniRosterBtnVisible(true);
            }
            checkRequiredFields();
        });

        driverDropdown.addEventListener('change', event => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            tripInfo.driverId = selectedOption.value;
        })
        otherRiderDropdown.addEventListener('change', event => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            tripInfo.otherRider = selectedOption.value;
        })
        vehicleDropdown.addEventListener('change', event => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            if (vehicleInspection !== "") {
                UTIL.warningPopup({
                    message: "This trip has an inspection completed for it. Changing the vehicle will result in the inspection being deleted. Continue?",
                    accept: {
                        text: "Yes",
                        callback: () => {
                            tripInfo.vehicleInformationId = selectedOption.value;
                            deleteInspection = true;
                        }
                    },
                    reject: {
                        text: 'No',
                        callback: () => {
                            event.target.value = tripInfo.vehicleInformationId;
                        }
                    }
                })
            } else {
                tripInfo.vehicleInformationId = selectedOption.value;
            }
        })
        locationDropdown.addEventListener('change', event => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            tripInfo.locationId = selectedOption.value;
        })
    }


    
    function checkRequiredFields() {

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");

        if (TripIntegratedEmploymentCheckbox.checked == true) {
               tripsRadio.checked = true;  
               tripsRadio.disabled = true;
               milesRadio.disabled = true;

               tripsRadio.classList.add('disabled');
               milesRadio.classList.add('disabled');

        } else {

               milesRadio.checked = true;   
               tripsRadio.disabled = false;
               milesRadio.disabled = false;
               tripsRadio.classList.remove('disabled');
               milesRadio.classList.remove('disabled');
        }

        odoCheck();
        setBtnStatusOfAddRoute()
    }

    function setBtnStatusOfAddRoute() {

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
        if (TripIntegratedEmploymentCheckbox.checked == true) {
            if (consumersOnRecord.size > 1) {
                updateBtn.classList.add('disabled');
                return;
            } else if (consumersOnRecord.size == 1) {
                updateBtn.classList.remove('disabled');
            }else {
                updateBtn.classList.add('disabled'); 
                return;
            }
        } else {
            if (consumersOnRecord.size == 0) {
                updateBtn.classList.add('disabled');
                return;
            } else {
                updateBtn.classList.remove('disabled'); 
            }
        }

        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            updateBtn.classList.add('disabled');
            return;
        } else {
            if ($.session.transportationUpdate)
                updateBtn.classList.remove('disabled');
            else
                updateBtn.classList.add('disabled');
        }
    }

    function loadData(routeID) {
        function cleanData(getTripInformationResult, getTripConsumersResult) {
            tripInfo = getTripInformationResult[0];
            getTripConsumersResult.forEach(consumer => {
                consumer.batchId = tripInfo.batchId;  
                consumersOnRecord.set(consumer.consumerId, consumer);
                // Roster Required Info:
                const consumerobj = roster2.buildConsumerCard({
                    FN: consumer.firstName,
                    LN: consumer.lastName,
                    id: consumer.consumerId
                });
                roster2.addConsumerToActiveConsumers(consumerobj);
            })
            buildPage();
        }

        //Get data for the route
        const routeInfo = TRANS_routeDocumentationAjax.getRouteInformation(routeID)
        const consumerInfo = TRANS_routeDocumentationAjax.getRouteConsumers(routeID)
        Promise.all([routeInfo, consumerInfo]).then(val => {
            const getTripInformationResult = val[0].getTripInformationResult
            const getTripConsumersResult = val[1].getTripConsumersResult
            cleanData(getTripInformationResult, getTripConsumersResult);
        })
    }
    function consumerRemoveAction(consumerId) {
        consumersOnRecord.delete(consumerId)
        consumersToRemove.push(consumerId)

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");

        if (consumersOnRecord.size > 0) {
            noConsumerWarning.style.display = 'none';
        } else {
            
            if (TripIntegratedEmploymentCheckbox.checked == true) {
                noConsumerWarningMessage.innerText = 'You must select one consumer for the route.'
            } else {
                noConsumerWarningMessage.innerText = 'You must select at least one consumer for the route.'
            }
            noConsumerWarning.style.display = 'block';
        }

        if (TripIntegratedEmploymentCheckbox.checked == true) {
            if (consumersOnRecord.size > 1) {
                tooManyConsumersWarning.style.display = 'block';
                roster2.toggleMiniRosterBtnVisible(false);
            } else if (consumersOnRecord.size == 1) {
                roster2.toggleMiniRosterBtnVisible(false);
                tooManyConsumersWarning.style.display = 'none';
            }else {
                roster2.toggleMiniRosterBtnVisible(true);
                tooManyConsumersWarning.style.display = 'none';
            }
        } else {
            roster2.toggleMiniRosterBtnVisible(true);
            tooManyConsumersWarning.style.display = 'none';
        }

        
        setBtnStatusOfAddRoute();
    }
    function updateConsumerData(data) {
        const { consumerId, key, value } = data
        consumersOnRecord.get(consumerId)[key] = value;
    }
    function retrieveConsumerData(consumerId, key) {
        return consumersOnRecord.get(consumerId)[key];
    }

    function deleteRoute() {
        /*
        When Deleting a route:
          * can only delete non-batched routes
          * Warn before delete
          * If there is a vehicle inspection completed for the route also warn that it will be deleted
        */
        function deleteRouteAccept() {
            pendingSave.show('Deleting Route...');
            try {
                const deleteProms = []
                //Delete Inspection:
                if (vehicleInspection !== "") deleteProms.push(TRANS_vehicleInspectionAjax.deleteVehicleInspection(vehicleInspection));
                //Delete Route
                deleteProms.push(TRANS_manageRoutesAjax.deleteTrip(selectedRouteId))
                Promise.all(deleteProms).then(() => {
                    pendingSave.fulfill('Deleted');
                    setTimeout(() => {
                        successfulSave.hide();
                        roster2.clearActiveConsumers();
                        roster2.removeMiniRosterBtn();
                        TRANS_manageRoutes.init(false);
                    }, 1000)
                })
            } catch (error) {
                console.error(error)
                pendingSave.reject('Failed to delete Route.')
                setTimeout(() => {
                    failSave.hide();
                    roster2.clearActiveConsumers();
                    roster2.removeMiniRosterBtn();
                    TRANS_manageRoutes.init(false);
                }, 1000)
            }
        }
        const warningMessage = vehicleInspection === "" ?
            "You are sure you would like to delete this Route?" :
            "Are you sure you would like to delete this Route and Vehicle Inspection?"
        UTIL.warningPopup({
            message: warningMessage,
            hideX: true,
            accept: {
                callback: deleteRouteAccept,
                text: 'YES'
            },
            reject: {
        callback: () => {},
                text: 'NO'
            }
        });

    }

    function saveData() {
        notTodeleteConsumers = [];
        pendingSave.show('Saving Route...')
        try {
            // Check for errors first
            const errors = document.querySelectorAll('.error');
            if (errors.length > 0) throw "err exist"
            const routeName = routeNameInput.querySelector('input').value;
            const startTime = routeStartInput.querySelector('input').value
            const endTime = routeEndInput.querySelector('input').value
            const odoStart = routeStartOdo.querySelector('input').value
            const odoEnd = routeEndOdo.querySelector('input').value;
            const originationVal = originationInput.querySelector('textarea').value;
            const destinationVal = destinationInput.querySelector('textarea').value; 

      const billingType = document.getElementById("milesRadio").checked ? "M":"T";
            const dbCallArr = [];
            const tripData = {
                token: $.session.Token,
                tripsCompletedId: selectedRouteId,
                odometerStart: odoStart,
                odometerStop: odoEnd,
                startTime: startTime,
                endTime: endTime,
                driverId: tripInfo.driverId,
                otherRiderId: tripInfo.otherRider,
                vehicleId: tripInfo.vehicleInformationId,
                locationId: tripInfo.locationId,
                billingType: billingType,
                tripName: UTIL.removeUnsavableNoteText(routeName),
               // integratedEmployment: tripInfo.integratedEmployment
                integratedEmployment: selectedIntegratedEmployment,
                origination: originationVal,
                destination: destinationVal 
            };
            dbCallArr.push(TRANS_manageRoutesAjax.updateManageTripDetails(tripData));
            if (deleteInspection) dbCallArr.push(TRANS_vehicleInspectionAjax.deleteVehicleInspection(vehicleInspection))            
            consumersOnRecord.forEach((val,key,map) => {
                notTodeleteConsumers.push(key);
                const { alternateAddress, completedDetailId, directions, pickupOrder, notes, riderStatus, scheduledTime, specialInstructions, totalTravelTime } = val
                const consumerDetailSubmit = {
                    token: $.session.Token,
                    tripDetailId: completedDetailId ? completedDetailId : '',
          tripsCompletedId:  selectedRouteId,
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
                dbCallArr.push(TRANS_routeDocumentationAjax.insertUpdateTripConsumers(consumerDetailSubmit));
            });
            consumersToRemove.forEach(consumer => {  
                let IsSameInsertedConsumerFind = notTodeleteConsumers.includes(consumer);
                const data = {
                    tripsCompletedId: selectedRouteId,
                    consumerId: consumer
                }
                if (!IsSameInsertedConsumerFind) {
                    dbCallArr.push(TRANS_routeDocumentationAjax.deleteConsumerFromTrip(data))
                }            
            }); 
            Promise.all(dbCallArr).then(() => {
                // Get Alt Addresses from DB Again:
                TRANS_mainLanding.updateAltAddress();
                pendingSave.fulfill('Save Successful');
                setTimeout(() => {
                    successfulSave.hide();
                    roster2.clearActiveConsumers();
                    roster2.removeMiniRosterBtn();
                    TRANS_manageRoutes.init(false);
                }, 1000)
            })
        } catch (error) {
            if (error === 'err exist') {
                pendingSave.reject('Failed to save. Please correct any errors that exist on the route.')
                console.error('Failing due to odometer or time overlap. Check odometer and time overlaps.')
            } else {
                pendingSave.reject('Failed to save. Please try again.')
            }
            console.error(error)
            setTimeout(() => failSave.hide(), 3000)
        }
    }
    function handleActionNavEvent(target) {
        const targetAction = target.dataset.actionNav;
        switch (targetAction) {
            case "miniRosterDone": {
                const selectedConsumers = roster2.getSelectedConsumersMiniRoster();
                selectedConsumers.forEach(async consumer => {
                    const consumerDetails = (await TRANS_routeDocumentationAjax.getConsumerDetails(consumer.id)).getConsumerDetailsResult[0];
                    consumersOnRecord.set(consumer.id, consumerDetails);
                    consumersOnRecord.get(consumer.id)['riderStatus'] = '';
                    const transportationCard = TRANS_consumerDocCard.createCard(consumer.id, consumerDetails);
                    consumerSectionBody.appendChild(transportationCard);

                    var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");

                    if (consumersOnRecord.size > 0) {
                        noConsumerWarning.style.display = 'none';
                    } else { 
                        if (TripIntegratedEmploymentCheckbox.checked == true) {
                            noConsumerWarningMessage.innerText = 'You must select one consumer for the route.'
                        } else {
                            noConsumerWarningMessage.innerText = 'You must select at least one consumer for the route.'
                        }
                        noConsumerWarning.style.display = 'block';
                    }

                    if (TripIntegratedEmploymentCheckbox.checked == true) {
                        if (consumersOnRecord.size > 1) {
                            tooManyConsumersWarning.style.display = 'block';
                            roster2.toggleMiniRosterBtnVisible(false);
                        } else if (consumersOnRecord.size == 1) {
                            roster2.toggleMiniRosterBtnVisible(false);
                            tooManyConsumersWarning.style.display = 'none';
                        }else {
                            roster2.toggleMiniRosterBtnVisible(true);
                            tooManyConsumersWarning.style.display = 'none';
                        }
                    } else {
                        roster2.toggleMiniRosterBtnVisible(true);
                        tooManyConsumersWarning.style.display = 'none';
                    }

                    

                    setBtnStatusOfAddRoute();
                })
                break;
            }
            case "miniRosterCancel": {
                DOM.toggleNavLayout();
                roster2.clearSelectedConsumers();
                break;
            }
        }
    }
    function init(opts) {
        const { batched, routeId, date, routeName, locationName, addHocRoute, vehicleInspectionId, integratedEmployment} = opts
        selectedRouteId = routeId;
        selectedDate = date;
        selectedRouteName = routeName;
        selectedLocationName = locationName;
        isAddHoc = addHocRoute;
        vehicleInspection = vehicleInspectionId;
        deleteInspection = false;
        selectedIntegratedEmployment = integratedEmployment;
        isBatched = batched;
        if (batched) {
            ro = true;
            console.warn("Route is batched. No changes can be made")
        } else {
            ro = false;
        }
        if (isAddHoc) {
            console.info('This is an Add Hoc Route. Changes to route name and location are allowed')
        } else {
            console.info('This is not an Add Hoc Route. No changes to route name or location allowed')
        }
        consumersOnRecord.clear();
        consumersToRemove = [];
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        roster2.miniRosterinit(null, { hideDate: true });
        roster2.updateSelectedDate(selectedDate);
        setActiveModuleSectionAttribute("editRoute");
        loadData(selectedRouteId)
    }
    return {
        init,
        handleActionNavEvent,
        consumerRemoveAction,
        updateConsumerData,
        retrieveConsumerData
    };
})();
