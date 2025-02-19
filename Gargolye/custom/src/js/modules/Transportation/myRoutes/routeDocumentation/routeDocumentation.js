const TRANS_routeDocumentation = (function () {
    /* Page Components
        Route and Vehicle Display
        Route/Vehicle Start/End Time and Start/End ODO
        Consumer Section
          Consumer Card
            Pic
            full name
            Address/Alternate  Address
            Scheduled Time
            Travel Min
            Status
            Notes
            Directions
            Special Instructions
        Save and Cancel btns
    */

    let routeStartInput, routeEndInput, routeStartOdo, routeEndOdo, tripIntegratedEmploymentCheckbox, ro;
    let consumerDocCardBody;

    // * Data storage
    let consumersOnRecord = new Map() //{consumerId: {consumer data}}
    let consumersToRemove
    let tripInfo, tripsCompletedId, dateOfService, routeVehicle;


    function buildPage(params) {
        const column1 = document.createElement('div');
        column1.classList.add('col-1')
        const column2 = document.createElement('div');
        column2.classList.add('col-2')

        const routeVehicleDisplay = document.createElement("div");
        const vehicleOnRoute = TRANS_mainLanding.vehicleLookup(routeVehicle)
        // Convert date to readable date:
        const readableDate = UTIL.formatDateFromIso(params.date)
        const otherRider = tripInfo.otherRider !== "" ? TRANS_mainLanding.driverLookup(tripInfo.otherRider) : ""
        let otherRiderElement = '';
        if (otherRider) {
            otherRiderElement = `<h3>Other Rider: <span class="highlightBlue">${otherRider.Last_Name}, ${otherRider.First_Name}</span><h3>`;
        };
        routeVehicleDisplay.innerHTML = `
    <h3>Route: <span class="highlightBlue">${params.routeName}</span></h3>
    <h3>Vehicle: <span class="highlightBlue">${vehicleOnRoute.vehicleDescription}</span></h3>
    <h3>Date: <span class="highlightBlue">${readableDate}</span></h3>
    ${otherRider ? otherRiderElement : ''}
    `;
        column1.appendChild(routeVehicleDisplay);

        // Route Documentation Card//
        const routeDocCard = document.createElement("div");
        routeDocCard.classList.add("card");
        const routeDocCardBody = document.createElement("div");
        routeDocCardBody.classList.add("card__body");
        routeDocCard.innerHTML = `
    <div class="card__header">Route Documentation</div>
    `;
        routeDocCard.appendChild(routeDocCardBody);
        // inputs for route doc card
        routeStartInput = input.build({
            id: "routeStartTime",
            label: "Route Start Time",
            type: "time",
            style: "secondary",
            value: tripInfo.startTime
        });
        routeEndInput = input.build({
            id: "routeEndTime",
            label: "Route End Time",
            type: "time",
            style: "secondary",
            value: tripInfo.endTime
        });
        routeStartOdo = input.build({
            id: "routeStartOdo",
            type: 'number',
            label: "Starting Odometer",
            style: "secondary",
            value: tripInfo.odometerStart
        });
        routeEndOdo = input.build({
            id: "routeEndOdo",
            type: 'number',
            label: "Ending Odometer",
            style: "secondary",
            value: tripInfo.odometerStop
        });

        tripIntegratedEmploymentCheckbox = input.buildCheckbox({
            text: 'Trip To/From Integrated Employment',
            id: 'tripIntegratedEmploymentCheckbox',
            //readonly: ro,
            isChecked: false,
            style: "secondary",
            isChecked: tripInfo.integratedEmployment === 'Y' ? true : false,
        });

        tripIntegratedEmploymentCheckbox.style = "padding-bottom: 15px;";   

        if (ro) {
            routeStartInput.classList.add('disabled')
            routeEndInput.classList.add('disabled')
            routeStartOdo.classList.add('disabled')
            routeEndOdo.classList.add('disabled')
        }
        routeDocCardBody.appendChild(routeStartInput);
        routeDocCardBody.appendChild(tripIntegratedEmploymentCheckbox);
        routeDocCardBody.appendChild(routeStartOdo);
        routeDocCardBody.appendChild(routeEndInput);
        routeDocCardBody.appendChild(routeEndOdo);
        column1.appendChild(routeDocCard);
        // ! Consumer Section //
        const consumerDocCard = document.createElement("div");
        consumerDocCard.classList.add("card");
        consumerDocCardBody = document.createElement("div");
        consumerDocCardBody.classList.add("card__body");
        consumerDocCard.innerHTML = `
    <div class="card__header">Consumers</div>
    `;
        consumerDocCard.appendChild(consumerDocCardBody);
        column2.appendChild(consumerDocCard);
        // Save Cancel Btn //
        const saveBtn = button.build({
            id: 'saveBtn',
            text: 'Save',
            style: 'secondary',
            type: 'contained',
            icon: 'save',
      callback: () => {saveData()}
        });
        const saveCloseBtn = button.build({
            id: 'saveCloseBtn',
            text: 'Save & Close',
            style: 'secondary',
            type: 'contained',
            icon: 'save',
      callback: () => {saveData(true)}
        });
        const cancelBtn = button.build({
            id: 'cancelBtn',
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            icon: 'close',
            callback: () => {
                roster2.clearActiveConsumers();
                roster2.removeMiniRosterBtn()
                TRANS_myRoute.init()
            }
        });
        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        if (!ro) {
            btnWrap.appendChild(saveBtn);
            btnWrap.appendChild(saveCloseBtn);
            column2.appendChild(btnWrap);
        }
        column2.appendChild(cancelBtn)
        cancelBtn.style.width = '100%';
        /////////////////////
        DOM.ACTIONCENTER.appendChild(column1)
        DOM.ACTIONCENTER.appendChild(column2)
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
            setBtnStatusOfRouteDocumentation();

        }
    }

    function eventListeners() {
        function odoCheck() {

            const startVal = parseInt(routeStartOdo.querySelector('input').value)
            const endVal = parseInt(routeEndOdo.querySelector('input').value)

            var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
            
            routeStartOdo.classList.remove('error');
            routeEndOdo.classList.remove('error');

            //Odo can be null, check to see if they are numbers (NaN when they are null)
            if (typeof(startVal) !== 'number' && typeof(endVal) !== 'number') {
                routeStartOdo.classList.remove('error');
                routeEndOdo.classList.remove('error');
                setBtnStatusOfRouteDocumentation();
                return
            }

        if (TripIntegratedEmploymentCheckbox.checked == true) {

            if (isNaN(startVal) && isNaN(endVal)) {
                routeStartOdo.classList.add('error');
                routeEndOdo.classList.add('error');
                setBtnStatusOfRouteDocumentation();
                return;
            } else {
                if (isNaN(startVal)) {
                    routeStartOdo.classList.add('error');
                    setBtnStatusOfRouteDocumentation();
                    return;
                }
                if (isNaN(endVal)) {
                    routeEndOdo.classList.add('error');
                    setBtnStatusOfRouteDocumentation();
                    return;
                }
            }

        }

        const dif = endVal - startVal;
        if (dif < 0) {
            routeStartOdo.classList.add('error');
            routeEndOdo.classList.add('error')
        } else {
             routeStartOdo.classList.remove('error');
             routeEndOdo.classList.remove('error')
                }
            setBtnStatusOfRouteDocumentation();
            
        } //end odoCheck()

        routeStartInput.addEventListener('click', event => {
            event.target.value = UTIL.getCurrentTime();
            routeStartInput.dispatchEvent(new Event('change'))
            }, {once: true})

        routeEndInput.addEventListener('click', event => {
            event.target.value = UTIL.getCurrentTime();
            routeEndInput.dispatchEvent(new Event('change'))
            }, {once: true})

        routeStartInput.addEventListener('change', event => {
            const totalHours = UTIL.calculateTotalHours(routeStartInput.firstChild.value, routeEndInput.querySelector('input').value)
            if (totalHours < 0) {
                routeStartInput.classList.add('error')
            } else {
                routeStartInput.classList.remove('error')
                routeEndInput.classList.remove('error')
            }

        })
        routeEndInput.addEventListener('change', event => {
            const totalHours = UTIL.calculateTotalHours(routeStartInput.querySelector('input').value, routeEndInput.firstChild.value)
            if (totalHours < 0) {
                routeEndInput.classList.add('error')
            } else {
                routeStartInput.classList.remove('error')
                routeEndInput.classList.remove('error')
            }
        })

        routeStartOdo.addEventListener('change', () => odoCheck())
        routeEndOdo.addEventListener('change', () => odoCheck())

        tripIntegratedEmploymentCheckbox.addEventListener('change', event => {

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
    }

    function checkRequiredFields() {

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");

        if (TripIntegratedEmploymentCheckbox.checked == true) {

            routeStartOdo.classList.remove('error');
            routeEndOdo.classList.remove('error');

            const startVal = parseInt(routeStartOdo.querySelector('input').value)
            const endVal = parseInt(routeEndOdo.querySelector('input').value)

            if (isNaN(startVal) && isNaN(endVal)) {
                routeStartOdo.classList.add('error');
                routeEndOdo.classList.add('error');
                setBtnStatusOfRouteDocumentation();
                return;
            } else {
                if (isNaN(startVal)) {
                    routeStartOdo.classList.add('error');
                    setBtnStatusOfRouteDocumentation();
                    return;
                }
                if (isNaN(endVal)) {
                    routeEndOdo.classList.add('error');
                    setBtnStatusOfRouteDocumentation();
                    return;
                }
            }
            setBtnStatusOfRouteDocumentation()

        } else {
            routeStartOdo.classList.remove('error');
            routeEndOdo.classList.remove('error');
            setBtnStatusOfRouteDocumentation()
        }
    
    }

    function setBtnStatusOfRouteDocumentation() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            saveBtn.classList.add('disabled');
            saveCloseBtn.classList.add('disabled');
            return;
        } else {
            if ($.session.transportationUpdate) {
                saveBtn.classList.remove('disabled');
                saveCloseBtn.classList.remove('disabled');
            } else {
                saveBtn.classList.add('disabled');
                saveCloseBtn.classList.add('disabled');
             }
        }

    }

    function buildConsumerCards() {
    consumersOnRecord.forEach((val,key, map) => {
            transportationCard = TRANS_consumerDocCard.createCard(key, val, ro);
            consumerDocCardBody.appendChild(transportationCard)
        })

        var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
        if (TripIntegratedEmploymentCheckbox.checked == true) {
            if (consumersOnRecord.size > 0) {
                roster2.toggleMiniRosterBtnVisible(false);
            } else {
                roster2.toggleMiniRosterBtnVisible(true);
            }
        }
        
    }

    function loadData(routeID, routeName, date) {
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
      buildPage({routeName: routeName, date: date});
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
        consumersOnRecord.delete(consumerId);
        consumersToRemove.push(consumerId);

       var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
       if (TripIntegratedEmploymentCheckbox.checked == true) {
           if (consumersOnRecord.size > 0) {
               roster2.toggleMiniRosterBtnVisible(false);
           } else {
               roster2.toggleMiniRosterBtnVisible(true);
           }
       }

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
                    consumerDocCardBody.appendChild(transportationCard)

                   var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
                   if (TripIntegratedEmploymentCheckbox.checked == true) {
                       if (consumersOnRecord.size > 0) {
                           roster2.toggleMiniRosterBtnVisible(false);
                       } else {
                           roster2.toggleMiniRosterBtnVisible(true);
                       }
                   }
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
    function saveData(closeTrip = false) {
        pendingSave.show('Saving Route...')
        // debugger
        try {
            // Check for errors first
            const errors = document.querySelectorAll('.error');
            if (errors.length > 0) throw "err exist"

            const startTime = routeStartInput.querySelector('input').value
            const endTime = routeEndInput.querySelector('input').value
            const odoStart = routeStartOdo.querySelector('input').value
            const odoEnd = routeEndOdo.querySelector('input').value
            var tripIntegratedEmployment;
            var TripIntegratedEmploymentCheckbox = document.getElementById("tripIntegratedEmploymentCheckbox");
            if (TripIntegratedEmploymentCheckbox.checked == true) {
                tripIntegratedEmployment = 'Y';
            } else {
                tripIntegratedEmployment = 'N';
            }

            
            const dbCallArr = []
            const tripDetailSubmit = {
                token: $.session.Token,
                tripsCompletedId: tripsCompletedId,
                odometerStart: odoStart,
                odometerStop: odoEnd,
                startTime: startTime,
                endTime: endTime,
                integratedEmployment: tripIntegratedEmployment
            }
            dbCallArr.push(TRANS_routeDocumentationAjax.updateTripDetails(tripDetailSubmit))
      consumersOnRecord.forEach((val,key,map) => {
        const { alternateAddress, completedDetailId, directions, pickupOrder, notes, riderStatus, scheduledTime, specialInstructions, totalTravelTime } = val
                const consumerDetailSubmit = {
                    token: $.session.Token,
                    tripDetailId: completedDetailId ? completedDetailId : '',
          tripsCompletedId:  tripsCompletedId,
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
            consumersToRemove.forEach(consumer => {
                const data = {
                    tripsCompletedId: tripsCompletedId,
                    consumerId: consumer
                }
                dbCallArr.push(TRANS_routeDocumentationAjax.deleteConsumerFromTrip(data))
            })
            Promise.all(dbCallArr).then(() => {
                pendingSave.fulfill('Save Successful');
                setTimeout(() => {
                    successfulSave.hide()
                    if (closeTrip) {
                        roster2.clearActiveConsumers();
                        roster2.removeMiniRosterBtn()
                        TRANS_myRoute.init()
                    }
                }, 1000);
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
    /**
     *
     * @param {object} opts Options
     * @param {string} opts.date Selected Date
     * @param {string} opts.routeID Selected Route ID
     * @param {string} opts.routeName Selected Route ID
     * @param {boolean} [opts.ro] Read Only. True when batched, future date is selected, or based on permissions?
     */
    function init(opts) {
    const { date, routeID, routeName, readOnly, vehicleInfoId} = opts
        ro = readOnly
        // No Update permission = read only
        if ($.session.transportationUpdate === false) {
            ro = true;
        }
        // Reset Values:
        consumersOnRecord.clear();
        consumersToRemove = [];
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        setActiveModuleSectionAttribute("routeDocumentation");
        tripsCompletedId = routeID;
        dateOfService = date;
        routeVehicle = vehicleInfoId;
        loadData(routeID, routeName, date)
        // Mini roster
        if (!ro) {
      roster2.miniRosterinit(null, {hideDate: true})
            roster2.updateSelectedDate(date)
        }
    }
    return {
        init,
        handleActionNavEvent,
        consumerRemoveAction,
        updateConsumerData,
        retrieveConsumerData
    };
})();
