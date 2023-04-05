var incident = (function () {
  var updateData = {
    token: null,

    incidentTypeId: null, // Incident Details
    incidentTypeDesc: null, // Incident Details
    incidentDate: null, // Incident Details - incident date
    incidentTime: null, // Incident Details - incident time
    reportedDate: null, // Incident Details - reported date
    reportedTime: null, // Incident Details - reported time
    subcategoryId: null, // Incident Details - incident category
    locationDetailId: null, // Incident Details - location detail
    serviceLocationId: null, // ????????????
    summary: null, // Incident Details - summary of incident
    note: null, // Incident Details - immediate acction
    prevention: null, // Incident Details - preventive plan
    contributingFactor: null, // Incident Details - cause & contributing factors

    consumerIdString: null, // Consumers Involved - consumer id
    includeInCount: null, // Consumers Involved - PPI checkbox
    involvementId: null, // Consumers Involved - involvement type id
    consumerIncidentLocationIdString: null, // Consumers Involved - incident location id
    consumerInvolvedIdString: null,

    employeeIdString: null, // Employees Involved
    notifyEmployeeString: null, // Employees Involved
    employeeInvolvementIdString: null, // Employees Involved

    othersInvolvedNameString: null, // Others Involved
    othersInvolvedCompanyString: null, // Others Involved
    othersInvolvedAddress1String: null, // Others Involved
    othersInvolvedAddress2String: null, // Others Involved
    othersInvolvedCityString: null, // Others Involved
    othersInvolvedStateString: null, // Others Involved
    othersInvolvedZipCodeString: null, // Others Involved
    othersInvolvedPhoneString: null, // Others Involved
    othersInvolvedInvolvementTypeIdString: null, // Others Involved
    othersInvolvedInvolvementDescriptionString: null, // Others Involved - ????

    updateIncidentId: null, // set for update only. else make 0
    saveUpdate: 'Update', // set either Save or Update
  };
  var isNewIncident;
  var consumersInvolvedIds;
  var newConsumersInvolvedIds;

  function clearUpdateData() {
    var datakeys = Object.keys(updateData);
    datakeys.forEach(key => {
      updateData[key] = null;
    });
  }

  function getIncidentId() {
    return updateData.updateIncidentId;
  }

  function setNewConsumerInvolvedIds(involvementIds) {
    // when saving new incident this handles the new consumerInvolement Ids coming back
    newConsumersInvolvedIds = [];

    involvementIds.forEach(ids => {
      var idArray = ids.split('|');
      var consumerId = idArray[0];
      var involvementId = idArray[1];

      newConsumersInvolvedIds.push({
        id: consumerId,
        involvedId: involvementId,
      });
    });
  }

  //-----------------------------------------------------------
  // Saving/Updating Incident Card
  //-----------------------------------------------------------
  function setUpdateIncidentId(incidentId) {
    updateData.updateIncidentId = incidentId;
  }
  // Gather Data From Each Section
  function getConsumersInvolvedUpdateData() {
    var consumerIds = [];
    var involvementIds = [];
    var locationIds = [];
    var includeInCount = [];
    var consumerInvolvementIds = [];

    var consumersInvolvedIds = itConsumerSection.getConsumersInvolvedIds();

    var data = consumerInvolvement.getData();

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach((key, index) => {
      var consumerData = data[key];
      var consumerInvolvementId;

      if (consumersInvolvedIds) {
        consumerInvolvementId = consumersInvolvedIds.find(e => e.id === key);
        consumerInvolvementId = consumerInvolvementId ? consumerInvolvementId.involvedId : 0;
      } else {
        consumerInvolvementId = 0;
      }

      consumerIds.push(key);
      involvementIds.push(consumerData.involvementId);
      locationIds.push(consumerData.locationId);
      includeInCount.push(consumerData.includeInCount);
      consumerInvolvementIds.push(consumerInvolvementId);
    });

    updateData.consumerIdString = consumerIds.join(',');
    updateData.involvementId = involvementIds.join('|');
    updateData.consumerIncidentLocationIdString = locationIds.join('|');
    updateData.includeInCount = includeInCount.join('|');
    updateData.consumerInvolvedIdString = consumerInvolvementIds.join('|');
  }
  function getEmployeesInvolvedUpdateData() {
    var section = document.querySelector('.incidentSection[data-card-page="employees"]');
    var employeeRows = [].slice.call(section.querySelectorAll('.employeeRow'));

    var employeeIds = [];
    var involvementTypes = [];
    var toNotify = [];

    employeeRows.forEach((row, index) => {
      var employeeNameDropdown = row.querySelector('.employeeNameDropdown');
      var involvementDropdown = row.querySelector('.involvmentTypeDropdown');
      var notifyCheckbox = row.querySelector('.checkbox');
      var notifyInput = notifyCheckbox.querySelector('input');
      var employeeNameDropdownSelectedValue =
        employeeNameDropdown.options[employeeNameDropdown.selectedIndex];

      var name = employeeNameDropdownSelectedValue.dataset.employeeid;
      var involvement = involvementDropdown.value;
      var notify = notifyInput.checked ? 'Y' : 'N';

      employeeIds.push(name);
      involvementTypes.push(involvement);
      toNotify.push(notify);
    });

    updateData.employeeIdString = employeeIds.join('|');
    updateData.employeeInvolvementIdString = involvementTypes.join('|');
    updateData.notifyEmployeeString = toNotify.join('|');
  }
  function getPeopleInvolvedUpdateData() {
    var section = document.querySelector('.incidentSection[data-card-page="people"]');
    var peopleRows = [].slice.call(section.querySelectorAll('.peopleRow'));

    var names = [];
    var companies = [];
    var addresses1 = [];
    var addresses2 = [];
    var cities = [];
    var states = [];
    var zips = [];
    var phones = [];
    var involevmentTypes = [];
    var involevmentDescriptions = [];

    peopleRows.forEach((person, index) => {
      var nameInput = person.querySelector('.name');
      var companyInput = person.querySelector('.company');
      var address1Input = person.querySelector('.address1');
      var address2Input = person.querySelector('.address2');
      var cityInput = person.querySelector('.city');
      var stateInput = person.querySelector('.state');
      var zipInput = person.querySelector('.zip');
      var phoneInput = person.querySelector('.phone');
      var typeDropdown = person.querySelector('.involvmentTypeDropdown');

      var name = UTIL.removeUnsavableNoteText(nameInput.value);
      var company = UTIL.removeUnsavableNoteText(companyInput.value);
      var address1 = UTIL.removeUnsavableNoteText(address1Input.value);
      var address2 = UTIL.removeUnsavableNoteText(address2Input.value);
      var city = UTIL.removeUnsavableNoteText(cityInput.value);
      var state = stateInput.value;
      var zip = zipInput.value;
      var phone = phoneInput.value;
      var type = typeDropdown.value;

      names.push(name);
      companies.push(company);
      addresses1.push(address1);
      addresses2.push(address2);
      cities.push(city);
      states.push(state);
      zips.push(zip);
      phones.push(phone);
      involevmentTypes.push(type);
    });

    updateData.othersInvolvedNameString = names.join('|');
    updateData.othersInvolvedCompanyString = companies.join('|');
    updateData.othersInvolvedAddress1String = addresses1.join('|');
    updateData.othersInvolvedAddress2String = addresses2.join('|');
    updateData.othersInvolvedCityString = cities.join('|');
    updateData.othersInvolvedStateString = states.join('|');
    updateData.othersInvolvedZipCodeString = zips.join('|');
    updateData.othersInvolvedPhoneString = phones.join('|');
    updateData.othersInvolvedInvolvementTypeIdString = involevmentTypes.join('|');
  }
  function getIncidentDetailsUpdateData(details) {
    var section = document.querySelector('.incidentSection[data-card-page="details"]');
    var iDate = section.querySelector('.iDate');
    var iTime = section.querySelector('.iTime');
    var rDate = section.querySelector('.rDate');
    var rTime = section.querySelector('.rTime');
    var category = section.querySelector('.categoryDropdown');
    var location = section.querySelector('.locationDropdown');
    var summary = section.querySelector('.summary');
    var action = section.querySelector('.action');

    updateData.incidentDate = iDate.value;
    updateData.incidentTime = iTime.value;
    updateData.reportedDate = rDate.value;
    updateData.reportedTime = rTime.value;
    updateData.subcategoryId = category.value;
    updateData.locationDetailId = location.value;
    updateData.summary = UTIL.removeUnsavableNoteText(summary.value);
    updateData.note = UTIL.removeUnsavableNoteText(action.value);
    updateData.prevention = '';
    updateData.contributingFactor = '';

    if ($.session.incidentTrackingShowPreventionPlan) {
      var prevention = section.querySelector('.prevention');
      updateData.prevention = UTIL.removeUnsavableNoteText(prevention.value);
    }
    if ($.session.incidentTrackingShowCauseAndContributingFactors) {
      var factors = section.querySelector('.factors');
      updateData.contributingFactor = UTIL.removeUnsavableNoteText(factors.value);
    }

    if (details) {
      updateData.incidentTypeId = details.incidentTypeId === '' ? null : details.incidentTypeId;
      updateData.incidentTypeDesc =
        details.incidentTypeDesc === '' ? null : details.incidentTypeDesc;
    }
  }

  function updateIncidentSaveEditData() {
    getConsumersInvolvedUpdateData();
    getEmployeesInvolvedUpdateData();
    getPeopleInvolvedUpdateData();
    getIncidentDetailsUpdateData();
    updateData.token = $.session.Token;
    updateData.saveUpdate = isNewIncident ? 'Save' : 'Update';
  }

  function saveIncident(isNew) {
    isNewIncident = isNew;
    // update save data
    updateIncidentSaveEditData();
    // tell roster to clear out its active consumers
    roster2.clearActiveConsumers();
    // fire ajax save
    incidentTrackingAjax.saveUpdateITIncident(updateData, function (involvementIds) {
      setNewConsumerInvolvedIds(involvementIds);
      // load review page
      incidentOverview.init();
      saveConsumerData();
      deleteConsumerData();
      clearUpdateData();
    });
  }
  function deleteIncident() {
    var deleteIncidentWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete this incident?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        incidentTrackingAjax.deleteITIncident(updateData.updateIncidentId);
        clearUpdateData();
        POPUP.hide(deleteIncidentWarningPopup);
        incidentOverview.init();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        clearUpdateData();
        POPUP.hide(deleteIncidentWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteIncidentWarningPopup.appendChild(message);
    deleteIncidentWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteIncidentWarningPopup);
  }
  function cancelIncident() {
    // clear active consumers
    roster2.clearActiveConsumers();
    // clear data
    itConsumerSection.clearData();
    // load review page
    incidentOverview.init();
  }

  //-----------------------------------------------------------
  // Saving/Updating Consumer Involved Sub Sections
  //-----------------------------------------------------------
  function saveConsumerData() {
    consumersInvolvedIds = itConsumerSection.getConsumersInvolvedIds();

    var followUpData = consumerFollowUp.getData();
    var injuryData = consumerInjuries.getData();
    var interventionsData = consumerIntervention.getData();
    var reviewData = consumerReview.getData();
    var reportData = consumerReporting.getData();
    //var behaviorData = consumerBehavior.getData();

    var fupPromises = saveConsumerFollowUps(followUpData);
    var injPromises = saveConsumerInjuries(injuryData);
    var intPromises = saveConsumerInterventions(interventionsData);
    var revPromises = saveConsumerReviews(reviewData);
    var repPromises = saveConsumerReports(reportData);
    //var behavPromises = saveConsumerBehaviors(behaviorData);

    var consumerDataSavePromises = [
      ...fupPromises,
      ...injPromises,
      ...intPromises,
      ...revPromises,
      ...repPromises,
      //...behavPromises,
    ];

    Promise.all(consumerDataSavePromises).then(() => {
      itConsumerSection.clearData();
    });
  }
  function saveConsumerFollowUps(data) {
    var savePromises = [];

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach(key => {
      var saveData = {
        token: $.session.Token,
        consumerInvolvedId: '',
        consumerFollowUpIdArray: [],
        followUpTypeIdArray: [],
        personResponsibleArray: [],
        dueDateArray: [],
        completedDateArray: [],
        notesArray: [],
      };

      var involvementId;

      if (consumersInvolvedIds) involvementId = consumersInvolvedIds.find(e => e.id === key);
      if (!involvementId) involvementId = newConsumersInvolvedIds.find(e => e.id === key);
      saveData.consumerInvolvedId = involvementId.involvedId;

      var idKeys = Object.keys(data[key]);
      idKeys.forEach(idKey => {
        var fuData = data[key][idKey];
        if (!fuData.updated) return;

        var isNew = idKey.includes('new');

        var itConsumerFollowUpId = isNew ? '' : idKey;
        var followUpTypeId = fuData.followUpTypeId ? fuData.followUpTypeId : '';
        var personResponsible = fuData.personResponsible
          ? UTIL.removeUnsavableNoteText(fuData.personResponsible)
          : '';
        var dueDate = fuData.dueDate ? fuData.dueDate : '';
        var dateCompleted = fuData.dateCompleted ? fuData.dateCompleted : '';
        var notes = fuData.notes ? UTIL.removeUnsavableNoteText(fuData.notes) : '';

        saveData.consumerFollowUpIdArray.push(itConsumerFollowUpId);
        saveData.followUpTypeIdArray.push(followUpTypeId);
        saveData.personResponsibleArray.push(personResponsible);
        saveData.dueDateArray.push(dueDate);
        saveData.completedDateArray.push(dateCompleted);
        saveData.notesArray.push(notes);
      });

      var savePromise = new Promise((fulfill, reject) => {
        incidentTrackingAjax.saveUpdateITConsumerFollowUp(saveData, () => {
          fulfill();
        });
      });

      savePromises.push(savePromise);
    });

    return savePromises;
  }
  function saveConsumerInjuries(data) {
    var savePromises = [];

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach(key => {
      var saveData = {
        token: $.session.Token,
        consumerInvolvedId: '',
        itConsumerInjuryIdArray: [],
        checkedByNurseArray: [],
        checkedDateArray: [],
        detailsArray: [],
        itInjuryLocationIdArray: [],
        itInjuryTypeIdArray: [],
        treatmentArray: [],
      };

      var involvementId;

      if (consumersInvolvedIds) involvementId = consumersInvolvedIds.find(e => e.id === key);
      if (!involvementId) involvementId = newConsumersInvolvedIds.find(e => e.id === key);
      saveData.consumerInvolvedId = involvementId.involvedId;

      var idKeys = Object.keys(data[key]);
      idKeys.forEach(idKey => {
        var iData = data[key][idKey];
        if (!iData.updated) return;

        var isNew = idKey.includes('new');

        var itConsumerInjuryId = isNew ? '' : idKey;
        var checkedByNurse = iData.checkedByNurse ? iData.checkedByNurse : '';
        var checkedDate = iData.checkedDate ? iData.checkedDate : '';
        var injuryDetails = iData.injuryDetails
          ? UTIL.removeUnsavableNoteText(iData.injuryDetails)
          : '';
        var injuryLocationId = iData.injuryLocationId ? iData.injuryLocationId : '';
        var injuryTypeId = iData.injuryTypeId ? iData.injuryTypeId : '';
        var injuryTreatment = iData.injuryTreatment
          ? UTIL.removeUnsavableNoteText(iData.injuryTreatment)
          : '';

        saveData.itConsumerInjuryIdArray.push(itConsumerInjuryId);
        saveData.checkedByNurseArray.push(checkedByNurse);
        saveData.checkedDateArray.push(checkedDate);
        saveData.detailsArray.push(injuryDetails);
        saveData.itInjuryLocationIdArray.push(injuryLocationId);
        saveData.itInjuryTypeIdArray.push(injuryTypeId);
        saveData.treatmentArray.push(injuryTreatment);
      });

      var savePromise = new Promise((fulfill, reject) => {
        incidentTrackingAjax.saveUpdateITConsumerInjuries(saveData, () => {
          fulfill();
        });
      });

      savePromises.push(savePromise);
    });

    return savePromises;
  }
  function saveConsumerInterventions(data) {
    var savePromises = [];

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach(key => {
      var saveData = {
        token: $.session.Token,
        consumerInvolvedId: '',
        itConsumerInterventionIdArray: [],
        aversiveArray: [],
        itConsumerInterventionTypeIdArray: [],
        notesArray: [],
        startTimeArray: [],
        stopTimeArray: [],
        timeLengthArray: [],
      };

      var involvementId;

      if (consumersInvolvedIds) involvementId = consumersInvolvedIds.find(e => e.id === key);
      if (!involvementId) involvementId = newConsumersInvolvedIds.find(e => e.id === key);
      saveData.consumerInvolvedId = involvementId.involvedId;

      var idKeys = Object.keys(data[key]);
      idKeys.forEach(idKey => {
        var iData = data[key][idKey];
        if (!iData.updated) return;

        var isNew = idKey.includes('new');

        var itConsumerInterventionId = isNew ? '' : idKey;
        var aversive = iData.aversive ? iData.aversive : '';
        var interventionType = iData.interventionType ? iData.interventionType : '';
        var interventionNotes = iData.interventionNotes
          ? UTIL.removeUnsavableNoteText(iData.interventionNotes)
          : '';
        var startTime = iData.startTime ? iData.startTime : '';
        var stopTime = iData.stopTime ? iData.stopTime : '';
        var timeLength = iData.timeLength ? iData.timeLength : '';

        saveData.itConsumerInterventionIdArray.push(itConsumerInterventionId);
        saveData.aversiveArray.push(aversive);
        saveData.itConsumerInterventionTypeIdArray.push(interventionType);
        saveData.notesArray.push(interventionNotes);
        saveData.startTimeArray.push(startTime);
        saveData.stopTimeArray.push(stopTime);
        saveData.timeLengthArray.push(timeLength);
      });

      var savePromise = new Promise((fulfill, reject) => {
        incidentTrackingAjax.saveUpdateITConsumerInterventions(saveData, () => {
          fulfill();
        });
      });

      savePromises.push(savePromise);
    });

    return savePromises;
  }
  function saveConsumerReviews(data) {
    var savePromises = [];

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach(key => {
      var saveData = {
        token: $.session.Token,
        consumerInvolvedId: '',
        itConsumerReviewIdArray: [],
        reviewedByArray: [],
        reviewedDateArray: [],
        noteArray: [],
      };

      var involvementId;

      if (consumersInvolvedIds) involvementId = consumersInvolvedIds.find(e => e.id === key);
      if (!involvementId) involvementId = newConsumersInvolvedIds.find(e => e.id === key);
      saveData.consumerInvolvedId = involvementId.involvedId;

      var idKeys = Object.keys(data[key]);
      idKeys.forEach(idKey => {
        var rData = data[key][idKey];
        if (!rData.updated) return;

        var isNew = idKey.includes('new');

        var itConsumerReviewId = isNew ? '' : idKey;
        var reviewedBy = rData.reviewedBy ? rData.reviewedBy : '';
        var reviewedDate = rData.reviewedDate ? rData.reviewedDate : '';
        var notes = rData.notes ? UTIL.removeUnsavableNoteText(rData.notes) : '';

        saveData.itConsumerReviewIdArray.push(itConsumerReviewId);
        saveData.reviewedByArray.push(reviewedBy);
        saveData.reviewedDateArray.push(reviewedDate);
        saveData.noteArray.push(notes);
      });

      var savePromise = new Promise((fulfill, reject) => {
        incidentTrackingAjax.saveUpdateITConsumerReviews(saveData, () => {
          fulfill();
        });
      });

      savePromises.push(savePromise);
    });

    return savePromises;
  }
  function saveConsumerReports(data) {
    var savePromises = [];

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach(key => {
      var saveData = {
        token: $.session.Token,
        consumerInvolvedId: '',
        consumerReportIdArray: [],
        reportDateArray: [],
        reportTimeArray: [],
        reportingCategoryIdArray: [],
        reportToArray: [],
        reportByArray: [],
        reportMethodArray: [],
        notesArray: [],
      };

      var involvementId;

      if (consumersInvolvedIds) involvementId = consumersInvolvedIds.find(e => e.id === key);
      if (!involvementId) involvementId = newConsumersInvolvedIds.find(e => e.id === key);
      saveData.consumerInvolvedId = involvementId.involvedId;

      var idKeys = Object.keys(data[key]);
      idKeys.forEach(idKey => {
        var rData = data[key][idKey];
        if (!rData.updated) return;

        var isNew = idKey.includes('new');

        var itConsumerReportId = isNew ? '' : idKey;
        var dateReported = rData.dateReported ? rData.dateReported : '';
        var timeReported = rData.timeReported ? rData.timeReported : '';
        var reportingCategoryID = rData.reportingCategoryID ? rData.reportingCategoryID : '';
        var reportTo = rData.reportTo ? UTIL.removeUnsavableNoteText(rData.reportTo) : '';
        var reportBy = rData.reportBy ? UTIL.removeUnsavableNoteText(rData.reportBy) : '';
        var reportMethod = rData.reportMethod
          ? UTIL.removeUnsavableNoteText(rData.reportMethod)
          : '';
        var notes = rData.notes ? UTIL.removeUnsavableNoteText(rData.notes) : '';

        saveData.consumerReportIdArray.push(itConsumerReportId);
        saveData.reportDateArray.push(dateReported);
        saveData.reportTimeArray.push(timeReported);
        saveData.reportingCategoryIdArray.push(reportingCategoryID);
        saveData.reportToArray.push(reportTo);
        saveData.reportByArray.push(reportBy);
        saveData.reportMethodArray.push(reportMethod);
        saveData.notesArray.push(notes);
      });

      var savePromise = new Promise((fulfill, reject) => {
        incidentTrackingAjax.saveUpdateITConsumerReporting(saveData, () => {
          fulfill();
        });
      });

      savePromises.push(savePromise);
    });

    return savePromises;
  }
  function saveConsumerBehaviors(data) {
    var savePromises = [];

    var consumerIdKeys = Object.keys(data);
    consumerIdKeys.forEach(key => {
      var saveData = {
        token: $.session.Token,
        consumerInvolvedId: '',
        itConsumerBehaviorIdArray: [],
        startTimeArray: [],
        endTimeArray: [],
        occurrencesArray: [],
      };

      var involvementId;

      if (consumersInvolvedIds) involvementId = consumersInvolvedIds.find(e => e.id === key);
      if (!involvementId) involvementId = newConsumersInvolvedIds.find(e => e.id === key);
      saveData.consumerInvolvedId = involvementId.involvedId;

      var idKeys = Object.keys(data[key]);
      idKeys.forEach(idKey => {
        var rData = data[key][idKey];
        if (!rData.updated) return;

        var isNew = idKey.includes('new');

        var itConsumerBehaviorId = isNew ? '' : idKey;
        var startTime = rData.startTime ? rData.startTime : '';
        var endTime = rData.endTime ? rData.endTime : '';
        var occurrences = rData.occurrences ? rData.occurrences : '';

        saveData.itConsumerBehaviorIdArray.push(itConsumerBehaviorId);
        saveData.startTimeArray.push(startTime);
        saveData.endTimeArray.push(endTime);
        saveData.occurrencesArray.push(occurrences);
      });

      var savePromise = new Promise((fulfill, reject) => {
        incidentTrackingAjax.saveUpdateITConsumerBehaviors(saveData, () => {
          fulfill();
        });
      });

      savePromises.push(savePromise);
    });

    return savePromises;
  }

  function deleteConsumerData() {
    var followUpDeletes = consumerFollowUp.getDeleteData();
    var injuryDeletes = consumerInjuries.getDeleteData();
    var interventionDeletes = consumerIntervention.getDeleteData();
    var reviewDeletes = consumerReview.getDeleteData();
    var reportDeletes = consumerReporting.getDeleteData();
    //var behaviorDeletes = consumerBehavior.getDeleteData();

    if (followUpDeletes) {
      var fuKeys = Object.keys(followUpDeletes);
      fuKeys.forEach(fuKey => {
        var keys = Object.keys(followUpDeletes[fuKey]);
        keys.forEach(key => {
          incidentTrackingAjax.itDeleteConsumerFollowUp(key, () => {});
        });
      });
    }
    if (injuryDeletes) {
      var injKeys = Object.keys(injuryDeletes);
      injKeys.forEach(injKey => {
        var keys = Object.keys(injuryDeletes[injKey]);
        keys.forEach(key => {
          incidentTrackingAjax.itDeleteConsumerInjuries(key, () => {});
        });
      });
    }
    if (interventionDeletes) {
      var intKeys = Object.keys(interventionDeletes);
      intKeys.forEach(intKey => {
        var keys = Object.keys(interventionDeletes[intKey]);
        keys.forEach(key => {
          incidentTrackingAjax.itDeleteConsumerInterventions(key, () => {});
        });
      });
    }
    if (reviewDeletes) {
      var revKeys = Object.keys(reviewDeletes);
      revKeys.forEach(revKey => {
        var keys = Object.keys(reviewDeletes[revKey]);
        keys.forEach(key => {
          incidentTrackingAjax.itDeleteConsumerReviews(key, () => {});
        });
      });
    }
    if (reportDeletes) {
      var repKeys = Object.keys(reportDeletes);
      repKeys.forEach(repKey => {
        var keys = Object.keys(reportDeletes[repKey]);
        keys.forEach(key => {
          incidentTrackingAjax.itDeleteConsumerReporting(key, () => {});
        });
      });
    }
    // if (behaviorDeletes) {
    //   var bhKeys = Object.keys(behaviorDeletes);
    //   bhKeys.forEach(fuKey => {
    //     var keys = Object.keys(behaviorDeletes[fuKey]);
    //     keys.forEach(key => {
    //       incidentTrackingAjax.itDeleteConsumerBehavior(key, () => {});
    //     });
    //   });
    // }
  }

  return {
    save: saveIncident,
    delete: deleteIncident,
    cancel: cancelIncident,
    setUpdateIncidentId,
    saveConsumerData,
    getIncidentId,
  };
})();
