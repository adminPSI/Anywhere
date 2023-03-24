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
  let locationId = '';
  let duplicateconsumerIds;
  let consumerswithUniqueLocations;
  let consumerswithMultipleLocations;

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
        singleEntryAjax.preInsertSingleEntry(saveData, function (results) {
    
          if (results.length > 1) { 
            
              getConsumerswithOverlappingLocations(results);
              if (consumerswithMultipleLocations.length > 1) displayOverlapLocationsPopup();
          
          } else if (results.length = 1) {
              successfulSave.show('SAVED');
              setTimeout(function () {
              successfulSave.hide();
              timeEntryCard.clearAllGlobalVariables();
              roster2.clearActiveConsumers();
              newTimeEntry.init();
                  }, 1000);
          } else {
            alert("There was a problem with Save process. Entry was not saved.");
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
        consumerswithUniqueLocations = consumerlocatons.filter(e => !duplicateconsumerIds[e.consumerId]);

         // this is a list for OISP Tenebruso -- 4219 of overlapping locations 
        // she is the only one with multiple locations in the returned list of consumers/locations -- two selected consumers  
        //TODO JOE -- what if there is more than one consumer with overlapping locations 
        consumerswithMultipleLocations = consumerlocatons.filter(e => duplicateconsumerIds[e.consumerId]);
  }

  function displayOverlapLocationsPopup() {

    //  getConsumerswithOverlappingLocations(results);

    // build overlapLocation Popup
    overlapLocationsPopup = POPUP.build( {
        header: `Overlapped locations for a selected consumer.`,
        hideX: false,
        id: "overlapLocationsPopup"
      });

    overlapLocationsDropdown = dropdown.build({
      label: "Locations",
      dropdownId: "overlapLocationsDropdown",
    });   

    overlapLocationsDoneBtn = button.build({
      id: "overlapLocationsDoneBtn",
      text: "done",
      type: "contained",
      style: "secondary",
      classNames: 'disabled',
      callback: () => {    
        // save Entry with a selected Location from the overlapLocationsDropdown
        var saveData = timeEntryCard.getSaveUpdateData();
        if (locationId !== '') {
        saveData.locationId = locationId;
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
      }
    });
    this.doneButton = overlapLocationsDoneBtn;

    let cancelBtn = button.build({
      id: "overlapLocationsCancelBtn",
      text: "cancel",
      type: "outlined",
      style: "secondary",
       callback: () => {
        locationId = '';
        POPUP.hide(overlapLocationsPopup);  
       }
    });

   // if submission included consumers with both unique and overlapping locations -- this section processes/Saves the entries with consumers with non-overlapping location  
   // TODO JOE:  What if one of these fails  -- need to track results of each Save and display the results on the Overlap Popup 
   let savedEntriesMessage = document.createElement('p');

   if (consumerswithUniqueLocations.length > 0) {
    consumerswithUniqueLocations.forEach(function (location) {
      var locationid = location.locationId
      var saveData = timeEntryCard.getSaveUpdateData();
      saveData.locationId = locationid;
      
      singleEntryAjax.insertSingleEntryNew(saveData, function (results) {
          // TODO JOE: need to attach the Save results to each consumer and then display on POPUP -- see below
          });
    }); 
      // display on the Overlap popup a list of the Consumers whose Entries were saved (with the results of each save)  -- see abov
      savedEntriesMessage.innerHTML = `The following consumer(s) have had their time entry(ies) saved.<br>`;
      consumerswithUniqueLocations.forEach(function (obj) { 
        savedEntriesMessage.innerHTML = savedEntriesMessage.innerHTML + ` -- ` + obj.consumerName + `<br>` 
      });
      savedEntriesMessage.innerHTML = savedEntriesMessage.innerHTML + `<br>` 
   }

   // for consumer with overlapping locations -- display consumerName 
    let overlappedLocationsEntriesMessage = document.createElement('p');
	  overlappedLocationsEntriesMessage.innerHTML = `Consumer ${consumerswithMultipleLocations[0].consumerName} has two locations for this date. Please select the location where these services are being provided. <br>`;

    let btnWrap = document.createElement("div");
			btnWrap.classList.add("btnWrap");
			btnWrap.appendChild(overlapLocationsDoneBtn);
			btnWrap.appendChild(cancelBtn);        
      if (consumerswithUniqueLocations.length > 0) overlapLocationsPopup.appendChild(savedEntriesMessage);
      overlapLocationsPopup.appendChild(overlappedLocationsEntriesMessage);
			overlapLocationsPopup.appendChild(overlapLocationsDropdown);
			overlapLocationsPopup.appendChild(btnWrap);

      populateOverlapLocationsDropdown();       

      overlapLocationsDropdown.addEventListener('change', event => {
				var selectedOption = event.target.options[event.target.selectedIndex];
			 
				  if (selectedOption.value !== "SELECT") {
            locationId = selectedOption.value;
            overlapLocationsDropdownRequired();

          } 
					
        });
        
        overlapLocationsDropdownRequired();

        POPUP.show(overlapLocationsPopup);

        function overlapLocationsDropdownRequired() {
          if (!locationId || locationId === '') {
            overlapLocationsDropdown.classList.add('error');
            overlapLocationsDoneBtn.classList.add('disabled');
      
            } else {
              overlapLocationsDropdown.classList.remove('error');
            overlapLocationsDoneBtn.classList.remove('disabled');
            }
        }

      }

      function populateOverlapLocationsDropdown() {

        let data = consumerswithMultipleLocations.map((location) => ({
          id: location.consumerId,   
          value: location.locationId, 
          text: location.consumerName + " -- " + location.locationName,
        })); 
        data.unshift({ id: '', value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
        dropdown.populate(overlapLocationsDropdown, data);  

      }


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

  // Landing Page
  //------------------------------------
  function loadNewTimeEntryPage() {
    $.session.singleEntrycrossMidnight = false;
    newTimeEntry.init();
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
