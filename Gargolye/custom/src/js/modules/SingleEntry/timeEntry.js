var timeEntry = (function () {
  var adminPayPeriods = [];
  var payPeriods = [];
  var currentAdminPayPeriod;
  var currentPayPeriod;
  var currentAdminDate;
  var currentDate;
  var locations;
  var residenceLocations;
  var workCodes;
  var evvReasonCodes;
  var crossmidnightisadminedit;
  var crossmidnightpayperiod;
  let saveAndSubmit;
  // required fields
  var requiredFields = {
    isDestinationRequired: '',
    isNoteRequired: '',
    isOdometerRequired: '',
    isLicensePlateRequired: '',
    isReasonRequired: '',
    supervisorApproval: '',
    reconfigImportFile: '',
    useFiveCharWorkCode: '',
  };

  // overlapping locations variables
  let overlapLocationsPopup;
  let overlapLocationsDropdown;
  let overlapLocationsDoneBtn;
  //let locationId = '';
  let duplicateconsumerIds;
  let consumerswithUniqueLocations;
  let consumerswithMultipleLocations;
  let overlapconsumerlocationdata;
  let selectedOverlapLocIds = {};
  let overlapSavedLocationsSingleEntryPairs = [];
  
  //let seletedOverlapLocationId = '';
  //let selectedOverlapConsumerId;

  // Save, Update, Delete
  //------------------------------------
  function showOverlapPopup(updateorsave = 'save') {
    var popup = POPUP.build({});
    var message = document.createElement('p');
    message.style.marginBottom = '2em';
    message.innerHTML = `There is an overlap with an existing Time Entry record. Do you wish to proceed?`;

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    var yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup);
        if ($.session.singleEntrycrossMidnight && updateorsave === 'save') {
          showMultipleEntriesPopup();
        }
        if (!$.session.singleEntrycrossMidnight && updateorsave === 'save') {
          getEntryData('', saveAndSubmit);
        }
        if ($.session.singleEntrycrossMidnight && updateorsave === 'update') {
          showMultipleEntriesPopup('update');
        }
        if (!$.session.singleEntrycrossMidnight && updateorsave === 'update') {
          updateEntry('', '', '', saveAndSubmit);
        }
      },
    });
    var noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup);
      },
    });

    popup.appendChild(message);
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
  }
  function showDeleteEntryWarningPopup(messageText, callback) {
    var popup = POPUP.build({ classNames: ['warning'], hideX: true });
    var message = document.createElement('p');
    message.innerHTML = messageText;
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: function () {
        POPUP.hide(popup);
        callback();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: function () {
        POPUP.hide(popup);
        timeEntryCard.enableSaveButtons();
      },
    });
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    popup.appendChild(message);
    popup.appendChild(btnWrap);

    POPUP.show(popup);
  }

  function showMultipleEntriesPopup(updateorsave = 'save') {
    var popup2 = POPUP.build({});
    var message2 = document.createElement('p');
    message2.innerHTML = `You have entered an End Time that crosses over midnight. Two separate entries will be created when this record is saved. Do you wish to proceed?`;
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn2 = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup2);
        updateorsave === 'save'
          ? getEntryData('', saveAndSubmit)
          : updateEntry('', '', '', saveAndSubmit);
      },
    });
    var noBtn2 = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup2);
      },
    });
    btnWrap.appendChild(yesBtn2);
    btnWrap.appendChild(noBtn2);
    popup2.appendChild(message2);
    popup2.appendChild(btnWrap);
    //	popup2.appendChild(noBtn2);

    POPUP.show(popup2);
  }

  function getEntryData(keyStartStop, saveAndSubmitBool) {
    saveAndSubmit = saveAndSubmitBool;
    if (keyStartStop === 'Y') {
      var overlapData = timeEntryCard.getOverlapData();
      singleEntryAjax.singleEntryOverlapCheck(overlapData, function (results) {
        if (results.length > 0) {
          showOverlapPopup();
        } else {
          $.session.singleEntrycrossMidnight
            ? showMultipleEntriesPopup()
            : getEntryData('', saveAndSubmit);
        }
      });

      return;
    }

    var saveData = timeEntryCard.getSaveUpdateData();

    if ($.session.singleEntrycrossMidnight === false || !saveData.endTime) {
      saveEntryData(saveData);
    } else {
      // entry crosses midnight, meaning two entries need tp be saved to DB

      // first day entry in the database
      saveData = timeEntryCard.getSaveUpdateData();
      saveData.checkHours = saveData.crossMidnightCheckHours[0].day1TotalHours;
      saveData.endTime = '00:00';

      if (!saveData.defaultStartTimeChanged) {
        saveData.evvReason = '';
        checkDeviceType() === 'Mobile'
          ? (saveData.deviceType = 'Mobile')
          : (saveData.deviceType = 'Other');
      }

      saveEntryData(saveData);

      // second day entry in the database
      saveData = timeEntryCard.getSaveUpdateData();
      saveData.checkHours = saveData.crossMidnightCheckHours[1].day2TotalHours;
      saveData.startTime = '00:00';

      // transportation only saved with the first day entry
      saveData.destination = '';
      saveData.licensePlateNumber = '';
      saveData.odometerEnd = '';
      saveData.odometerStart = '';
      saveData.reason = '';
      saveData.transportationReimbursable = '';
      saveData.transportationUnits = 0;

      // * Date Constructor Doc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
      // * Note on constructing date on date string is highly discouraged due to browser differences and inconsistencies.
      // * This was the issue for the crossing over midnight issue in older versions of safari.
      const year = parseInt(saveData.dateOfService.split('-')[0]);
      const month = parseInt(saveData.dateOfService.split('-')[1]);
      const day = parseInt(saveData.dateOfService.split('-')[2]);
      var nextDay = new Date(year, month - 1, day);
      nextDay.setDate(nextDay.getDate() + 1);

      var dd = ('0' + nextDay.getDate()).slice(-2);
      var mm = ('0' + (nextDay.getMonth() + 1)).slice(-2);
      var yyyy = nextDay.getFullYear();

      saveData.dateOfService = yyyy + '-' + mm + '-' + dd;

      if (!saveData.defaultEndTimeChanged) {
        saveData.evvReason = '';
        checkDeviceType() === 'Mobile'
          ? (saveData.deviceType = 'Mobile')
          : (saveData.deviceType = 'Other');
      }

      saveEntryData(saveData);
    }
  }

  function saveEntryData(saveData) {
    var test = saveData;
    if (saveData.locationId !== '' || saveData.consumerId === '') {
      if (saveAndSubmit) {
        var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;

        showDeleteEntryWarningPopup(warningMessage, () => {
          singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
            var entryId = results[1].replace('</', '');
            var updateObj = {
              token: $.session.Token,
              singleEntryIdString: entryId,
              newStatus: 'S',
            };

            singleEntryAjax.updateSingleEntryStatus(updateObj, function () {
              successfulSave.show('SAVED & SUBMITTED');
              setTimeout(function () {
                successfulSave.hide();
                timeEntryCard.clearAllGlobalVariables();
                roster2.clearActiveConsumers();
                newTimeEntry.init(true);
              }, 1000);
            });
          });
        });
      } else {
        singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
          successfulSave.show('SAVED');
          setTimeout(function () {
            successfulSave.hide();
            timeEntryCard.clearAllGlobalVariables();
            roster2.clearActiveConsumers();
            newTimeEntry.init(true);
          }, 1000);
        });
      }
    } else {
      // if (saveData.locationId !== '' || saveData.consumerId === '')
      if (saveAndSubmit) {
        var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;

        showDeleteEntryWarningPopup(warningMessage, () => {
          singleEntryAjax.preInsertSingleEntry(saveData, function (results) {
            const idArray = results.map(r => r.singleEntryId);
            var updateObj = {
              token: $.session.Token,
              singleEntryIdString: idArray.join(','),
              newStatus: 'S',
            };

            singleEntryAjax.updateSingleEntryStatus(updateObj, function () {
              successfulSave.show('SAVED & SUBMITTED');
              setTimeout(function () {
                successfulSave.hide();
                timeEntryCard.clearAllGlobalVariables();
                roster2.clearActiveConsumers();
                newTimeEntry.init();
              }, 1000);
            });
          });
        });
      } else {
        // Just the save BTN -- if (saveData.locationId !== '' || saveData.consumerId === '')

        // 1. Grab the consumer/location data
        singleEntryAjax.getSelectedConsumerLocations(saveData, function (results) {
          overlapconsumerlocationdata = results;
          // });
          // no location overlaps for any selected consumer
          if (overlapconsumerlocationdata.length === 0) {
            singleEntryAjax.preInsertSingleEntry(saveData, function (results) {
              successfulSave.show('SAVED');
              setTimeout(function () {
                successfulSave.hide();
                timeEntryCard.clearAllGlobalVariables();
                roster2.clearActiveConsumers();
                newTimeEntry.init();
              }, 1000);
            });
          } else {
            // location overlaps exist for a selected consumer
            displayOverlapLocationsPopup(results);
          }

        });
      }
    }
  }

  function getConsumerswithOverlappingLocations(consumerlocatons) {
    // get lookup list of objects that have the same consumerId (ie, consumers with overlappng locations)
    duplicateconsumerIds = consumerlocatons.reduce((a, e) => {
      a[e.consumerId] = ++a[e.consumerId] || 0;
      return a;
    }, {});

    // this is a list for OISP Sinopoli -- 4225 of non-overlapping locations
    consumerswithUniqueLocations = consumerlocatons.filter(
      e => !duplicateconsumerIds[e.consumerId],
    );

    // this is a list for OISP Tenebruso -- 4219 of overlapping locations
    // she is the only one with multiple locations in the returned list of consumers/locations -- two selected consumers
    //TODO JOE -- what if there is more than one consumer with overlapping locations
    consumerswithMultipleLocations = consumerlocatons.filter(
      e => duplicateconsumerIds[e.consumerId],
    );
  }

  function checkOverlapPopupForErrors() {
    const erros = [...overlapLocationsPopup.querySelectorAll('.error')];

    if (erros.length > 0) {
      overlapLocationsDoneBtn.classList.add('disabled');
    } else {
      overlapLocationsDoneBtn.classList.remove('disabled');
    }
  }

  function buildOverlapLocationsDropdown(consumer, index) {
    const wrap = document.createElement('div');

    const overlappedLocationsEntriesMessage = document.createElement('p');
    overlappedLocationsEntriesMessage.innerHTML = `Consumer ${consumer.consumerName} has two locations for this date. Please select the location where these services are being provided. <br>`;

    const overlapLocationsDropdown = dropdown.build({
      label: 'Locations',
      dropdownId: `overlapLocationsDropdown${index}`,
    });
    
    overlapLocationsDropdown.classList.add('error');

    overlapLocationsDropdown.addEventListener('change', event => {
          var selectedOption = event.target.options[event.target.selectedIndex];

          const seletedOverlapLocId = selectedOption.value;
          selectedOverlapLocIds[consumer.consumerId] = seletedOverlapLocId;
          // selectedOverlapConsumerId
          if (!seletedOverlapLocId || seletedOverlapLocId === 'SELECT') {
            overlapLocationsDropdown.classList.add('error');
          } else {
            overlapLocationsDropdown.classList.remove('error');
          }
          checkOverlapPopupForErrors();
    });

    populateOverlapLocationsDropdown(overlapLocationsDropdown, consumer);

    wrap.appendChild(overlappedLocationsEntriesMessage);
    wrap.appendChild(overlapLocationsDropdown);

    return wrap;
  }

  function displayOverlapLocationsPopup(results) {
    getConsumerswithOverlappingLocations(results);

    // seletedOverlapLocationId

    // build overlapLocation Popup
    overlapLocationsPopup = POPUP.build({
      header: `Overlapped locations for a selected consumer.`,
      hideX: false,
      id: 'overlapLocationsPopup',
    });

    let overlapConsumerlist = consumerswithMultipleLocations.map(item => ({ consumerId: item.consumerId, consumerName: item.consumerName})).
    filter((value, index, self) => self.indexOf(value) === index);

    overlapConsumerlist = overlapConsumerlist.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.consumerId === value.consumerId && t.consumerName === value.consumerName)));

      overlapConsumerlist.forEach((consumer, index) => {
      const markup = buildOverlapLocationsDropdown(consumer, index);
      overlapLocationsPopup.appendChild(markup);
    });

    overlapLocationsDoneBtn = button.build({
      id: 'overlapLocationsDoneBtn',
      text: 'done',
      type: 'contained',
      style: 'secondary',
      classNames: 'disabled',
      callback: async () => {
     
        var listofSingleEntryIdsSaved = await saveSingleEntrywithLocationOverlaps();
        var test = listofSingleEntryIdsSaved;
        
        POPUP.hide(overlapLocationsPopup);
        successfulSave.show('SAVED');
        setTimeout(function () {
          successfulSave.hide();
          timeEntryCard.clearAllGlobalVariables();
          roster2.clearActiveConsumers();
          newTimeEntry.init();
        }, 1000);

      },
    });
    this.doneButton = overlapLocationsDoneBtn;

    let cancelBtn = button.build({
      id: 'overlapLocationsCancelBtn',
      text: 'cancel',
      type: 'outlined',
      style: 'secondary',
      callback: () => {

        selectedOverlapLocIds = {};
        // seletedOverlapLocationId = '';
        // selectedOverlapConsumerId = '';
        POPUP.hide(overlapLocationsPopup);
      },
    });

    // for consumer with overlapping locations -- display consumerName
    // let overlappedLocationsEntriesMessage = document.createElement('p');
    // overlappedLocationsEntriesMessage.innerHTML = `Consumer ${consumerswithMultipleLocations[0].consumerName} has two locations for this date. Please select the location where these services are being provided. <br>`;

    // def keep below
    selectedOverlapConsumerId = consumerswithMultipleLocations[0].consumerId;
    let btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(overlapLocationsDoneBtn);
    btnWrap.appendChild(cancelBtn);
    // if (consumerswithUniqueLocations.length > 0) overlapLocationsPopup.appendChild(savedEntriesMessage);
    // overlapLocationsPopup.appendChild(overlappedLocationsEntriesMessage);
    // overlapLocationsPopup.appendChild(overlapLocationsDropdown);
    overlapLocationsPopup.appendChild(btnWrap);

    // populateOverlapLocationsDropdown();

    // overlapLocationsDropdown.addEventListener('change', event => {
    //   var selectedOption = event.target.options[event.target.selectedIndex];

    //   if (selectedOption.value !== 'SELECT') {
    //     seletedOverlapLocationId = selectedOption.value;
    //     // selectedOverlapConsumerId
    //     overlapLocationsDropdownRequired();
    //   }
    // });

    // overlapLocationsDropdownRequired();

    POPUP.show(overlapLocationsPopup);

    // function overlapLocationsDropdownRequired() {
    //   if (!seletedOverlapLocationId || seletedOverlapLocationId === '') {
    //     overlapLocationsDropdown.classList.add('error');
    //     overlapLocationsDoneBtn.classList.add('disabled');
    //   } else {
    //     overlapLocationsDropdown.classList.remove('error');
    //     overlapLocationsDoneBtn.classList.remove('disabled');
    //   }
    // }
  }

  function populateOverlapLocationsDropdown(locDrop, consumer) {
    
    let thisconsumersLocations = consumerswithMultipleLocations.filter(val => val.consumerId === consumer.consumerId)

    let data = thisconsumersLocations.map(location => ({
      id: location.consumerId,
      value: location.locationId,
      text: location.consumerName + ' -- ' + location.locationName,
    }));
    data.unshift({ id: '', value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate(locDrop, data);
  }

  async function saveSingleEntrywithLocationOverlaps() {
    let savedLocationsSingleEntryPairs = [];
    
    // looking through the consumers with non-overlapping locationsIds (consumerswithUniqueLocations)
    //  and finding the consumers with the same locationId (duplocationIds)
    // TODO JOE: LOOP through multiple sets of consumers with each set containing a shared locationId
    var duplocationIds = consumerswithUniqueLocations.reduce((a, e) => {
      a[e.locationId] = ++a[e.locationId] || 0;
      return a;
    }, {});

    // 1. filtering the consumers with non-overlapping locationsIds (consumerswithUniqueLocations)
    // getting the subset list of consumers that share a locationId -- final result being a list of consumerIds for the shared locationId
    // TODO JOE -- what if you have more than one set of duplicate locations IDs
    var nonoverlapconsumerswithsamelocation;
    nonoverlapconsumerswithsamelocation = consumerswithUniqueLocations.filter(
      e => duplocationIds[e.locationId],
    );

    if (nonoverlapconsumerswithsamelocation.length > 0) {
      var strConsumerIds = '';
      var locationid;
      // putting together list of consumers with a shared location
      nonoverlapconsumerswithsamelocation.forEach(function (item) {
        strConsumerIds = strConsumerIds + item.consumerId + ',';
        locationid = item.locationId;
      });
      
      strConsumerIds = strConsumerIds.slice(0, -1);

      saveData = timeEntryCard.getSaveUpdateData();
      saveData.locationId = locationid;
      saveData.consumerId = strConsumerIds;

      // A. NON-Overlapping Location SAVE -- saving the SingleEntry that has multiple consumers who share a single location
      // SAVED -- one record in the SingleEntr Table and multiple records in the AA_Consumers_Present table
      let singleentryid;
      await singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
        singleentryid = results[1].slice(0, -2);
      });
      savedLocationsSingleEntryPairs.push({
        locationId: saveData.locationId,
        singleEntryId: singleentryid,
      });
    }

    // 2. filtering Entries that are non-overlapping (consumerswithUniqueLocations) and have a unique location per unique consumer
    var nonoverlapconsumerswithUniqueLocations;
    nonoverlapconsumerswithUniqueLocations = consumerswithUniqueLocations.filter(
      e => !duplocationIds[e.locationId],
    );

    // B. NON-Overlapping Location SAVE -- saving the SingleEntry that has a single location with an associated single consumer
    // SAVED -- one record in the SingleEntr Table and assocciated Single record in the AA_Consumers_Present table
    if (nonoverlapconsumerswithUniqueLocations.length > 0) {
      for (const item of nonoverlapconsumerswithUniqueLocations) {
        saveData = timeEntryCard.getSaveUpdateData();
        saveData.locationId = item.locationId;
        saveData.consumerId = item.consumerId;
        let singleentryid;
        await singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
          singleentryid = results[1].slice(0, -2);
        });
        savedLocationsSingleEntryPairs.push({
          locationId: saveData.locationId,
          singleEntryId: singleentryid,
        });
      }
    }
    // 3. Saves of non-overlapping locations happened in 1A and 2B; therefore take into account already saved locations when saving the overlap location entity
    // if any non-overlapping locations were saved, then we need to determine how to save the overlapping locations
    if (savedLocationsSingleEntryPairs.length > 0 || overlapSavedLocationsSingleEntryPairs.length > 0) {
      
      // loop through all the selected locations for the overlapping locations 
      for (prop in selectedOverlapLocIds) {
        let foundlocation = false;
        let seletedOverlapLocationId = selectedOverlapLocIds[prop];
        let selectedOverlapConsumerId = prop;

        if (overlapSavedLocationsSingleEntryPairs.length > 0) {

          // loop through all the SAVED 'Overlapping location" Single Entries (all the overlapping location saves)
          for (const item of overlapSavedLocationsSingleEntryPairs) {
            // if the current location has already been saved, then just save the Consumer in the AA_Consumers_Present table
           if (item.locationId === seletedOverlapLocationId) {
              foundlocation = true;
              let saveData = timeEntryCard.getSaveUpdateData();
              consumerData = {
                token: $.session.Token,
                singleEntryId: item.singleEntryId,
                consumerId: selectedOverlapConsumerId,
                deviceType: saveData.deviceType,
                evvReason: saveData.evvReason,
              };
              // Single Entry Record already exists for this location
              // C. INSERT INTO into consumersPresent (singleEntryId amd ConsumerID and devices)
              await singleEntryAjax.insertConsumerforSavedSingleEntry(consumerData, function (res) {
             
              });
            }   // end if (item.locationId === seletedOverlapLocationId)
          } //  end for -- all the saved Single Entries (all the non-overlapping location saves) 


        } else {
          
            // loop through all the SAVED Single Entries (all the NON-overlapping location saves)
          for (const item of savedLocationsSingleEntryPairs) {
            // if the current location has already been saved, then just save the Consumer in the AA_Consumers_Present table
           if (item.locationId === seletedOverlapLocationId) {
              foundlocation = true;
              let saveData = timeEntryCard.getSaveUpdateData();
              consumerData = {
                token: $.session.Token,
                singleEntryId: item.singleEntryId,
                consumerId: selectedOverlapConsumerId,
                deviceType: saveData.deviceType,
                evvReason: saveData.evvReason,
              };
              // Single Entry Record already exists for this location
              // C. INSERT INTO into consumersPresent (singleEntryId amd ConsumerID and devices)
              await singleEntryAjax.insertConsumerforSavedSingleEntry(consumerData, function (res) {
             
              });
            }   // end if (item.locationId === seletedOverlapLocationId)

          } //  end for -- all the saved Single Entries (all the non-overlapping location saves) 
        } // end if/else -- overlapSavedLocationsSingleEntryPairs.length > 0    
 
            // if the location has NOT already been Saved, so just save the overlapping location
            if (!foundlocation) await saveOverlapLocationasSingleEntry();

      } //  end for -- the selected locations for the overlapping locations
   
    } else {  // there were NO locations saved, so just save the overlapping location 
      // (savedLocationsSingleEntryPairs.length > 0 || overlapSavedLocationsSingleEntryPairs.length > 0)
      // Single Entry Record DOES NOT exist for this location
      await saveOverlapLocationasSingleEntry();
    }
        // nested function -- handles each new Single Entry Insert
        async function saveOverlapLocationasSingleEntry() {
          
          saveData = timeEntryCard.getSaveUpdateData();
          // cycle through the selected locations for each of the consumers that have an overlapping location
            for (prop in selectedOverlapLocIds) {
                  let singleentryid;
                  const seletedOverlapLocationId = selectedOverlapLocIds[prop];
                  const selectedOverlapConsumerId = prop;
                  saveData.locationId = seletedOverlapLocationId;
                  saveData.consumerId = selectedOverlapConsumerId;
                
              await singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
                singleentryid = results[1].slice(0, -2);
                overlapSavedLocationsSingleEntryPairs.push({
                  locationId: saveData.locationId,
                  singleEntryId: singleentryid,
              });
              
            });
            
      
        }
        } // end of nested function -- async function saveOverlapLocationasSingleEntry()

    // put together full list of new Single Entry Inserts
    var concatsavedLocationsSingleEntryPairs = savedLocationsSingleEntryPairs.concat(overlapSavedLocationsSingleEntryPairs);
    return concatsavedLocationsSingleEntryPairs;
  } // end of containing function -- function populateOverlapLocationsDropdown(locDrop, consumer)



  function updateEntry(isAdminEdit, payPeriod, keyStartStop, saveAndSubmitBool) {
    saveAndSubmit = saveAndSubmitBool;

    if (keyStartStop === 'Y') {
      if ($.session.singleEntrycrossMidnight) {
        crossmidnightisadminedit = isAdminEdit;
        crossmidnightpayperiod = payPeriod;
        showMultipleEntriesPopup('update');
        return;
      }
    }

    var saveData = timeEntryCard.getSaveUpdateData('Save');
    var updateData = timeEntryCard.getSaveUpdateData('Update');
    // update an entry that crosses midnight, results in update of original entry and a save of the new entry
    if ($.session.singleEntrycrossMidnight) {
      // may need overlapcheck on crossmidnight Update because saved record (2nd entry) may overlap with previous edits
      // if (keyStartStop === 'Y') {
      // 	var overlapData = timeEntryCard.getOverlapData();
      // 	singleEntryAjax.singleEntryOverlapCheck(overlapData, function(results) {
      // 		if (results.length > 0) {
      // 			showOverlapPopup('update');
      // 		}
      // 	});
      // 	return;
      // }

      // second day entry in the database -- SAVE
      saveData.checkHours = saveData.crossMidnightCheckHours[1].day2TotalHours;
      saveData.startTime = '00:00';

      // transportation only saved with the first day entry
      saveData.destination = '';
      saveData.licensePlateNumber = '';
      saveData.odometerEnd = '';
      saveData.odometerStart = '';
      saveData.reason = '';
      saveData.transportationReimbursable = '';
      saveData.transportationUnits = 0;

      if (!saveData.defaultEndTimeChanged) {
        saveData.evvReason = '';
        checkDeviceType() === 'Mobile'
          ? (saveData.deviceType = 'Mobile')
          : (saveData.deviceType = 'Other');
      }
      // * Date Constructor Doc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
      // * Note on constructing date on date string is highly discouraged due to browser differences and inconsistencies.
      // * This was the issue for the crossing over midnight issue in older versions of safari.
      const year = parseInt(saveData.dateOfService.split('-')[0]);
      const month = parseInt(saveData.dateOfService.split('-')[1]);
      const day = parseInt(saveData.dateOfService.split('-')[2]);
      var nextDay = new Date(year, month - 1, day);
      nextDay.setDate(nextDay.getDate() + 1);

      var dd = ('0' + nextDay.getDate()).slice(-2);
      var mm = ('0' + (nextDay.getMonth() + 1)).slice(-2);
      var yyyy = nextDay.getFullYear();

      saveData.dateOfService = yyyy + '-' + mm + '-' + dd;

      saveEntryData(saveData);

      // first day entry in the database -- UPDATE
      updateData.checkHours = saveData.crossMidnightCheckHours[0].day1TotalHours;
      updateData.endTime = '00:00';
      updateSingleEntry(crossmidnightisadminedit, crossmidnightpayperiod, updateData);
    } else {
      updateSingleEntry(isAdminEdit, payPeriod, updateData);
    }
  }

  function updateSingleEntry(isAdminEdit, payPeriod, updateData) {
    singleEntryAjax.updateSingleEntry(updateData, function (results) {
      if (!saveAndSubmit) {
        // Orig Update
        if (!$.session.singleEntrycrossMidnight) {
          successfulSave.show('UPDATED');
        }
        setTimeout(function () {
          if (!$.session.singleEntrycrossMidnight) {
            successfulSave.hide();
          }
          roster2.clearActiveConsumers();
          timeEntryCard.clearAllGlobalVariables();

          if (isAdminEdit) {
            timeApproval.refreshPage(payPeriod);
          } else {
            timeEntryReview.refreshPage(payPeriod);
          }
        }, 1000);
      } else {
        // Update w/Submit
        var updateObj = {
          token: $.session.Token,
          singleEntryIdString: updateData.singleEntryId,
          newStatus: 'S',
        };
        var warningMessage = `By clicking Yes, you are confirming that you have reviewed this entry and it is correct to the best of your knowledge.`;

        showDeleteEntryWarningPopup(warningMessage, () => {
          singleEntryAjax.updateSingleEntryStatus(updateObj, () => {
            if (!$.session.singleEntrycrossMidnight) {
              successfulSave.show('UPDATED & SUBMITTED');
            }
            setTimeout(function () {
              if (!$.session.singleEntrycrossMidnight) {
                successfulSave.hide();
              }
              roster2.clearActiveConsumers();
              timeEntryCard.clearAllGlobalVariables();

              if (isAdminEdit) {
                timeApproval.refreshPage(payPeriod);
              } else {
                timeEntryReview.refreshPage(payPeriod);
              }
            }, 1000);
          });
        });
      }
    });
  }

  function deleteEntry(entryId, isAdminEdit, payperiod) {
    if (!entryId) return;

    singleEntryAjax.deleteSingleEntryRecord(entryId, function (results) {
      successfulSave.show('DELETED');
      setTimeout(function () {
        successfulSave.hide();
        if (isAdminEdit) {
          timeApproval.refreshPage(payPeriod);
        } else {
          timeEntryReview.refreshPage(payperiod);
        }
      }, 1000);
    });
  }

  // Util/CRUD
  //
  //
  //------------------------------------
  function checkDeviceType() {
    if ($.session.OS === 'iPhone/iPod' || $.session.OS === 'Linux') {
      return 'Mobile';
    } else return 'Other';
  }

  function setRequiredFields(results) {
    var res = results[0];

    requiredFields.isDestinationRequired = res.destinationrequired;
    requiredFields.isNoteRequired = res.noterequired;
    requiredFields.isOdometerRequired = res.odometerrequired;
    requiredFields.isLicensePlateRequired = res.licenseplaterequired;
    requiredFields.isReasonRequired = res.reasonrequired;
    requiredFields.supervisorApproval = res.supervisorapproval;
    requiredFields.reconfigImportFile = res.reconfigimportfile;
    requiredFields.useFiveCharWorkCode = res.use5characterworkcode;
  }
  function setSelectedPayPeriod(dirtyStart, dirtyEnd, dateString) {
    // start and end format must be YYYY-MM-DD
    var tmpStart = dirtyStart;
    var tmpEnd = dirtyEnd;

    return {
      start: tmpStart,
      end: tmpEnd,
      dateString,
    };
  }
  function sortPayPeriods(results) {
    var adminDatesSet = false;
    var datesSet = false;
    var adminDefaultDates;
    var defaultDates;
    var now = new Date();
    now.setHours(0, 0, 0, 0);

    results.forEach((r, i) => {
      var anywhereClosed = r.anywhereclosed;
      var sendEvvData = r.sendevvdata;
      var startDate = r.startdate.split(' ')[0]; //  MM/DD/YYYY
      var endDate = r.enddate.split(' ')[0]; //  MM/DD/YYYY
      var startDateIso = UTIL.formatDateToIso(startDate); //  YYYY-MM-DD
      var endDateIso = UTIL.formatDateToIso(endDate); //  YYYY-MM-DD

      var dateString = `${startDate} - ${endDate}`; // for dropdown text only
      var newObj = {
        start: startDateIso,
        end: endDateIso,
        dateString,
        sendEvvData: sendEvvData,
      };

      var startDateObj = new Date(startDate);
      var endDateObj = new Date(endDate);

      if (i === 0) {
        adminDefaultDates = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
      }
      if (anywhereClosed === 'False' && !defaultDates) {
        defaultDates = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
      }

      // getting the current date & pay period
      if (now >= startDateObj && now <= endDateObj) {
        currentAdminDate = UTIL.formatDateToIso(
          `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
        );
        currentAdminPayPeriod = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
        adminDatesSet = true;

        if (anywhereClosed === 'False') {
          currentDate = UTIL.formatDateToIso(
            `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
          );
          currentPayPeriod = setSelectedPayPeriod(startDateIso, endDateIso, dateString);
          datesSet = true;
        }
      }
      // sorting pay periods
      adminPayPeriods.push(newObj);
      if (anywhereClosed === 'False') {
        payPeriods.push(newObj);
      }
    });

    if (!adminDatesSet) {
      currentAdminDate = adminDefaultDates.start;
      currentAdminPayPeriod = adminDefaultDates;
    }
    if (!datesSet) {
      currentDate = defaultDates.start;
      currentPayPeriod = defaultDates;
    }
  }
  function getPayPeriods(admin) {
    if (admin) {
      return [...adminPayPeriods];
    } else {
      return [...payPeriods];
    }
  }
  function getCurrentPayPeriod(admin) {
    if (admin) {
      return UTIL.iterationCopy(currentAdminPayPeriod);
    } else {
      return UTIL.iterationCopy(currentPayPeriod);
    }
  }
  function getCurrentDate(admin) {
    if (admin) {
      return currentAdminDate;
    } else {
      return currentDate;
    }
  }
  function getLocations() {
    return [...locations];
  }
  function getEvvReasonCodes() {
    return [...evvReasonCodes];
  }
  function getResidenceLocations() {
    if (!residenceLocations) return [];
    return [...residenceLocations];
  }
  function getWorkCodes() {
    return [...workCodes];
  }
  function getRequiredFields() {
    return UTIL.iterationCopy(requiredFields);
  }
  function getInitialData(callback) {
    if (
      payPeriods.length === 0 ||
      adminPayPeriods.length === 0 ||
      !locations ||
      !workCodes ||
      !evvReasonCodes
    ) {
      let promises = [];

      const getSingleEntryPayPeriods = new Promise((resolve, reject) => {
        singleEntryAjax.getSingleEntryPayPeriods(results => {
          sortPayPeriods(results);
          resolve('getSingleEntryPayPeriods DONE');
        });
      });
      promises.push(getSingleEntryPayPeriods);

      const getSingleEntryLocations = new Promise((resolve, reject) => {
        singleEntryAjax.getSingleEntryLocations(results => {
          locations = results;
          resolve('getSingleEntryLocations DONE');
        });
      });
      promises.push(getSingleEntryLocations);

      const getRequiredSingleEntryFields = new Promise((resolve, reject) => {
        singleEntryAjax.getRequiredSingleEntryFields(results => {
          setRequiredFields(results);
          resolve('getRequiredSingleEntryFields DONE');
        });
      });
      promises.push(getRequiredSingleEntryFields);

      const getWorkCodes = new Promise((resolve, reject) => {
        singleEntryAjax.getWorkCodes(results => {
          workCodes = results;
          resolve('getWorkCodes DONE');
        });
      });
      promises.push(getWorkCodes);

      const getLocationsAndResidences = new Promise((resolve, reject) => {
        singleEntryAjax.getLocationsAndResidences(results => {
          residenceLocations = results;
          resolve('getWorkCodes DONE');
        });
      });
      promises.push(getLocationsAndResidences);

      const getEvvReasonCodes = new Promise((resolve, reject) => {
        singleEntryAjax.getEvvReasonCodes(results => {
          evvReasonCodes = results;
          resolve('getEvvReasonCodes DONE');
        });
      });
      promises.push(getEvvReasonCodes);

      Promise.all(promises).then(() => {
        callback();
      });

      // singleEntryAjax.getSingleEntryPayPeriods(function getSingleEntryPayPeriods(results) {
      // 	sortPayPeriods(results);

      // 	singleEntryAjax.getSingleEntryLocations(function getSingleEntryLocations(results) {
      // 		locations = results;

      // 		singleEntryAjax.getRequiredSingleEntryFields(function getRequiredSingleEntryFields(results) {
      // 			setRequiredFields(results);

      // 			singleEntryAjax.getWorkCodes(function getWorkCodes(results) {
      //         workCodes = results;

      //         singleEntryAjax.getLocationsAndResidences(function getLocationsAndResidence(results) {
      //           residenceLocations = results;
      //           callback();
      //         });
      // 			});
      // 		});
      // 	});
      // });
    } else {
      callback();
    }
  }

  function checkLocationServicesEnabled() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // if location services are on, continue with normal functionality
          $.session.singleEntrycrossMidnight = false;
          newTimeEntry.init();
        },
        function (error) {
          // If location services are off, show popup
          const locationsWarningpopup = POPUP.build({
            id: 'warningPopup',
            hideX: false,
            classNames: 'warning',
          });

          const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: function () {
              POPUP.hide(locationsWarningpopup);
            },
          });
          const btnWrap = document.createElement('div');
          btnWrap.classList.add('btnWrap');
          btnWrap.appendChild(okBtn);

          const warningMessage = document.createElement('p');
          warningMessage.innerHTML =
            "Location services must be enabled on this device to save a new time entry record.  Please contact your company's IT team for assistance.";
          locationsWarningpopup.appendChild(warningMessage);
          locationsWarningpopup.appendChild(btnWrap);
          POPUP.show(locationsWarningpopup);
        },
      );
    } else {
      // If location services are not supported, show popup
      const locationsWarningpopup = POPUP.build({
        id: 'warningPopup',
        hideX: false,
        classNames: 'warning',
      });

      const okBtn = button.build({
        text: 'OK',
        style: 'secondary',
        type: 'contained',
        callback: function () {
          POPUP.hide(locationsWarningpopup);
        },
      });
      const btnWrap = document.createElement('div');
      btnWrap.classList.add('btnWrap');
      btnWrap.appendChild(okBtn);

      const warningMessage = document.createElement('p');
      warningMessage.innerHTML =
        "Location services must be enabled on this device to save a new time entry record.  Please contact your company's IT team for assistance.";
      locationsWarningpopup.appendChild(warningMessage);
      locationsWarningpopup.appendChild(btnWrap);
      POPUP.show(locationsWarningpopup);
    }
  }

  // Landing Page
  //------------------------------------
  function loadNewTimeEntryPage() {
    if ($.session.singleEntryLocationRequired === 'Y') {
      // If location settings are required, check location settings
      checkLocationServicesEnabled();
    } else {
      // If location settings are not required, resume normal funcionality
      $.session.singleEntrycrossMidnight = false;
      newTimeEntry.init();
    }
  }
  function loadTimeEntryReviewPage() {
    $.session.singleEntrycrossMidnight = false;
    setActiveModuleSectionAttribute('timeEntry-review');
    timeEntryReview.init();
  }
  function loadTimeEntryApprovalPage() {
    setActiveModuleSectionAttribute('timeEntry-approval');
    timeApproval.init();
  }
  function loadSingleEntryLanding() {
    var timeEntryBtn = button.build({
      text: 'New Entry',
      style: 'secondary',
      type: 'contained',
      callback: loadNewTimeEntryPage,
    });
    var timeReviewBtn = button.build({
      text: 'Time Review',
      style: 'secondary',
      type: 'contained',
      callback: loadTimeEntryReviewPage,
    });
    var timeApprovalBtn = button.build({
      text: 'Time Approval',
      style: 'secondary',
      type: 'contained',
      callback: loadTimeEntryApprovalPage,
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('landingBtnWrap');

    btnWrap.appendChild(timeEntryBtn);
    btnWrap.appendChild(timeReviewBtn);
    if ($.session.ViewAdminSingleEntry && $.session.SEViewAdminWidget) {
      btnWrap.appendChild(timeApprovalBtn);
    }

    DOM.clearActionCenter();
    DOM.ACTIONCENTER.appendChild(btnWrap);
  }
  function init() {
    DOM.clearActionCenter();
    PROGRESS.SPINNER.show('Loading Time Entry...');
    getInitialData(loadSingleEntryLanding);
  }

  return {
    setSelectedPayPeriod,
    getPayPeriods,
    getCurrentPayPeriod,
    getCurrentDate,
    getLocations,
    getResidenceLocations,
    getWorkCodes,
    getRequiredFields,
    getInitialData,
    getEvvReasonCodes,
    getEntryData,
    updateEntry,
    deleteEntry,
    init,
  };
})();
