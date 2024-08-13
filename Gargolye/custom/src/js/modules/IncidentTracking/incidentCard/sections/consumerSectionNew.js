var itConsumerSection = (function () {
  // DOM
  // ---------------------
  var section;
  var sectionBody;
  var consumerError;
  var consumersWrap;
  var consumerSections;
  // DATA
  //---------------------
  var activeConsumers = [];
  var consumersInvolved;
  var consumerInvolvedIdArray;
  // Values
  // ---------------------

  function clearData() {
    consumerFollowUp.clearData();
    consumerInjuries.clearData();
    consumerIntervention.clearData();
    consumerInvolvement.clearData();
    consumerReporting.clearData();
    consumerReview.clearData();
    consumerBehavior.clearData();
    activeConsumers = [];
  }
  function deleteConsumerData(consumerId) {
    consumerFollowUp.deleteConsumerData(consumerId);
    consumerInjuries.deleteConsumerData(consumerId);
    consumerIntervention.deleteConsumerData(consumerId);
    consumerInvolvement.deleteConsumerData(consumerId);
    consumerReporting.deleteConsumerData(consumerId);
    consumerReview.deleteConsumerData(consumerId);
    consumerBehavior.deleteConsumerData(consumerId);
  }

  function getConsumersInvolved() {
    if (consumersInvolved) return [...consumersInvolved];
  }
  function getConsumersInvolvedIds() {
    if (consumerInvolvedIdArray && consumerInvolvedIdArray.length > 0) {
      return [...consumerInvolvedIdArray];
    }
  }

  function showConsumersWrap() {
    consumersWrap.classList.add('visible');
    consumerSections.classList.remove('visible');
  }
  function displayCount() {
    var count = activeConsumers.length;
    var countHolder = section.querySelector('span[data-count="consumers"]');
    countHolder.innerHTML = `( ${count} )`;
  }
  function checkForRequiredConsumer() {
    if (activeConsumers.length === 0) {
      consumerError.classList.remove('hidden');
      consumersWrap.classList.remove('visible');
      consumerSections.classList.remove('visible');

      incidentCard.toggleSave(true);
      return;
    }

    consumerError.classList.add('hidden');
    consumersWrap.classList.add('visible');
  }
  function removeConsumerErrors() {
    var consumerCards = [].slice.call(consumersWrap.querySelectorAll('.consumerCard'));
    consumerCards.forEach(card => card.classList.remove('error'));

    var cardHasErrors = itDetailsSection.checkRequiredFields();

    if (cardHasErrors) {
      incidentCard.toggleSave(true);
    } else {
      incidentCard.toggleSave(false);
    }
  }
  function showConsumerError(consumerIdArray) {
    incidentCard.toggleSave(true);

    var consumerCards = [].slice.call(consumersWrap.querySelectorAll('.consumerCard'));

    if (consumerIdArray[0] === '%') {
      // mark all
      // show error "At least one consumer must have PPI checked."
      consumerCards.forEach(card => card.classList.add('error'));
      return;
    }

    consumerCards.forEach(card => {
      var cardId = card.dataset.consumerId;
      if (consumerIdArray.includes(cardId)) {
        card.classList.add('error');
      } else {
        card.classList.remove('error');
      }
    });
  }

  function moveConsumersToConsumersInvolved(consumers) {
    var initPromises = [];

    consumersWrap.classList.add('visible');

    consumers.forEach(consumer => {
      //If consumer is already on the selected consumer list ignore
      if (activeConsumers.filter(actConsumer => actConsumer.id === consumer.id).length > 0) return;
      consumer.card.classList.remove('highlighted');
      var clone = consumer.card.cloneNode(true);
      var card = buildConsumer(clone);
      consumersWrap.appendChild(card);
      var initPromise = consumerInvolvement.initConsumerData(consumer.id);
      initPromises.push(initPromise);
    });

    activeConsumers = roster2.getActiveConsumers();
    checkForRequiredConsumer();
    displayCount();

    Promise.all(initPromises).then(() => {
      consumerInvolvement.checkRequiredFields();
    });

    // Event when you add a consumer
    // 1. Ensure that all required fields are filled in on the  details section
    var detailSectionHasErrors = itDetailsSection.checkRequiredFields();

    if (detailSectionHasErrors) {
      incidentCard.toggleSave(true);
    } else {
      incidentCard.toggleSave(false);
    }
  }
  function removeConsumerFromConsumersInvolved(selectedConsumerId) {
    var consumerCard = document.querySelector(`[data-consumer-id="${selectedConsumerId}"]`).parentElement;
    consumersWrap.removeChild(consumerCard);

    consumerSections.classList.remove('visible');

    incidentCard.toggleActionBtns(false);

    roster2.removeConsumerFromActiveConsumers(selectedConsumerId);
    activeConsumers = roster2.getActiveConsumers();

    deleteConsumerData(selectedConsumerId);

    checkForRequiredConsumer();
    consumerInvolvement.checkRequiredFields();
    displayCount();
    roster2.toggleMiniRosterBtnVisible(true);

    // Event when you remove a consumer
    // 1. Ensure that at least one consumer is selected
    // 2. Ensure that all required fields are filled in on the  details section
    var detailSectionHasErrors = itDetailsSection.checkRequiredFields();
    //var consumerSectionHasErrors = incidentCard.checkforRequiredConsumer();
    // var consumerSectionConsumers = itConsumerSection.getConsumersInvolvedIds();

    if (detailSectionHasErrors || activeConsumers.length === 0) {
      incidentCard.toggleSave(true);
    } else {
      incidentCard.toggleSave(false);
    }
  }

  // Populate
  //-----------------------------------------------
  function populateConsumersWrap() {
    consumerInvolvedIdArray = [];

    consumersInvolved.forEach(c => {
      consumerInvolvedIdArray.push({ id: c.consumerId, involvedId: c.consumerInvolvedId });
      // build consumer card
      var consumer = roster2.buildConsumerCard({
        FN: c.firstName,
        LN: c.lastName,
        id: c.consumerId,
      });
      // build incident card
      var card = buildConsumer(consumer);
      consumersWrap.appendChild(card);
      // move consumer to avtive list
      roster2.addConsumerToActiveConsumers(consumer);
    });

    activeConsumers = roster2.getActiveConsumers();

    consumersWrap.classList.add('visible');

    checkForRequiredConsumer();
    consumerInvolvement.checkRequiredFields();
    displayCount();
  }

  // Consumer Card
  //-----------------------------------------------
  function buildConsumer(consumerCard) {
    function checkInvolvedRequirements() {
      const locationId = consumerInvolvement.involvementDataLookup(consumerCard.dataset.consumerId).locationId;

      const involvementSec = document.querySelector("[data-sectionid='5']");

      if (locationId === '' || consumerInvolvement.checkOneHasPPI() === false) {
        involvementSec.classList.add('sectionError');
      } else {
        involvementSec.classList.remove('sectionError');
      }
    }

    consumerCard.classList.remove('highlighted');

    var cardWrap = document.createElement('div');
    cardWrap.classList.add('incidentCard__consumer');

    // build card
    cardWrap.appendChild(consumerCard);

    // card event
    cardWrap.addEventListener('click', function (event) {
      if (event.target === consumerCard) {
        incidentCard.toggleActionBtns(true);
        consumersWrap.classList.remove('visible');
        consumerSections.classList.add('visible');
        consumerSubSections.showMenu(consumerCard);
        checkInvolvedRequirements();
        if (document.querySelector('.consumerListBtn')) roster2.toggleMiniRosterBtnVisible(false);
      }
    });

    return cardWrap;
  }

  // Section
  //-----------------------------------------------
  function buildSection(options, consumersInvolvedData) {
    var opts = options;
    consumersInvolved = consumersInvolvedData;

    section = document.createElement('div');
    section.classList.add('incidentSection', 'visible');
    section.setAttribute('data-card-page', 'consumers');
    section.setAttribute('data-page-num', opts.pageNumber);

    var heading = document.createElement('div');
    heading.classList.add('incidentSection__header');
    heading.innerHTML = `<h3>Consumers Involved <span data-count="consumers"></span></h3>`;

    sectionBody = document.createElement('div');
    sectionBody.classList.add('incidentSection__body');

    consumerError = document.createElement('p');
    consumerError.classList.add('consumerError');
    consumerError.innerHTML = 'You must select at least one consumer';

    consumersWrap = document.createElement('div');
    consumersWrap.classList.add('consumersWrap');

    consumerSections = consumerSubSections.build(consumersInvolved);

    sectionBody.appendChild(consumerError);
    sectionBody.appendChild(consumersWrap);
    sectionBody.appendChild(consumerSections);

    section.appendChild(heading);
    section.appendChild(sectionBody);

    if (consumersInvolved) {
      populateConsumersWrap();
    } else {
      consumerInvolvedIdArray = undefined;
    }

    return section;
  }

  return {
    build: buildSection,
    addConsumers: moveConsumersToConsumersInvolved,
    removeConsumer: removeConsumerFromConsumersInvolved,
    showConsumersWrap,
    getConsumersInvolved,
    getConsumersInvolvedIds,
    removeConsumerErrors,
    showConsumerError,
    clearData,
  };
})();
var consumerSubSections = (function () {
  // DOM
  //---------------------
  var sectionsContainer;
  var sectionsTopBar;
  var backBtn;
  var sectionsMenu;
  //* sub sections
  var followUpSection;
  var injuriesSection;
  var interventionSection;
  var involvementSection;
  var reportingSection;
  var reviewSection;
  var behaviorSection;
  // DATA
  //---------------------
  // var consumersInvolved;
  var sections = [
    { id: 0, name: 'Remove Consumer' },
    { id: 1, name: 'Behavior Details' },
    { id: 2, name: 'Follow Up' },
    { id: 3, name: 'Injuries' },
    { id: 4, name: 'Intervention' },
    { id: 5, name: 'Involvement' },
    { id: 6, name: 'Reporting' },
    { id: 7, name: 'Review' },
  ];
  // Values
  //---------------------
  var selectedConsumerId;

  // Hide/Show
  //-----------------------------------------------
  function handleBackButtonClick() {
    var visibleSection = sectionsContainer.querySelector('.consumerSections__section.visible');

    if (visibleSection) {
      var visibleSectionHome = visibleSection.querySelector('.consumerSections__section__home');
      if (visibleSectionHome) {
        visibleSectionHome.classList.remove('hidden'); // reshow home page
      }
      visibleSection.classList.remove('visible'); // hide section
      sectionsMenu.classList.add('visible'); // show menu
    } else {
      incidentCard.toggleActionBtns(false);
      itConsumerSection.showConsumersWrap();
      if (document.querySelector('.consumerListBtn')) roster2.toggleMiniRosterBtnVisible(true);
    }
  }
  function hideBackBtn() {
    backBtn.classList.add('hidden');
  }
  function showBackBtn() {
    backBtn.classList.remove('hidden');
  }
  function showSectionMenu() {
    sectionsMenu.classList.add('visible');
  }
  function showSection(sectionName) {
    var targetSection;

    switch (sectionName) {
      case 'Follow Up': {
        targetSection = followUpSection;
        break;
      }
      case 'Injuries': {
        targetSection = injuriesSection;
        break;
      }
      case 'Intervention': {
        targetSection = interventionSection;
        break;
      }
      case 'Involvement': {
        targetSection = involvementSection;
        break;
      }
      case 'Reporting': {
        targetSection = reportingSection;
        break;
      }
      case 'Review': {
        targetSection = reviewSection;
        break;
      }
      case 'Behavior Details': {
        targetSection = behaviorSection;
        break;
      }
    }

    sectionsMenu.classList.remove('visible');
    targetSection.classList.add('visible');
  }

  // Populate
  //-----------------------------------------------
  function populateSection(sectionName) {
    incidentId = incident.getIncidentId();

    if (incidentId) {
      switch (sectionName) {
        case 'Follow Up': {
          incidentTrackingAjax.getitConsumerFollowUps(selectedConsumerId, incidentId, res => {
            consumerFollowUp.populate(res, selectedConsumerId);
          });
          break;
        }
        case 'Injuries': {
          incidentTrackingAjax.getitConsumerInjuries(selectedConsumerId, incidentId, res => {
            consumerInjuries.populate(res, selectedConsumerId);
          });
          break;
        }
        case 'Intervention': {
          incidentTrackingAjax.getitConsumerInterventions(selectedConsumerId, incidentId, res => {
            consumerIntervention.populate(res, selectedConsumerId);
          });
          break;
        }
        case 'Involvement': {
          consumerInvolvement.populate(selectedConsumerId);
          break;
        }
        case 'Reporting': {
          incidentTrackingAjax.getitConsumerReporting(selectedConsumerId, incidentId, res => {
            consumerReporting.populate(res, selectedConsumerId);
          });
          break;
        }
        case 'Review': {
          incidentTrackingAjax.getitConsumerReviews(selectedConsumerId, incidentId, res => {
            consumerReview.populate(res, selectedConsumerId);
          });
          break;
        }
        case 'Behavior Details': {
          incidentTrackingAjax.getitConsumerBehavior(selectedConsumerId, incidentId, res => {
            consumerBehavior.populate(res, selectedConsumerId);
          });
          break;
        }
      }
    } else {
      switch (sectionName) {
        case 'Follow Up': {
          consumerFollowUp.populate(null, selectedConsumerId);
          break;
        }
        case 'Injuries': {
          consumerInjuries.populate(null, selectedConsumerId);
          break;
        }
        case 'Intervention': {
          consumerIntervention.populate(null, selectedConsumerId);
          break;
        }
        case 'Involvement': {
          consumerInvolvement.populate(selectedConsumerId);
          break;
        }
        case 'Reporting': {
          consumerReporting.populate(null, selectedConsumerId);
          break;
        }
        case 'Review': {
          consumerReview.populate(null, selectedConsumerId);
          break;
        }
        case 'Behavior Details': {
          consumerBehavior.populate(null, selectedConsumerId);
          break;
        }
      }
    }
  }

  // Top Bar
  //-----------------------------------------------
  function buildTopBar() {
    var topBar = document.createElement('div');
    topBar.classList.add('topBar');

    backBtn = button.build({
      text: 'Back',
      style: 'secondary',
      type: 'text',
      icon: 'arrowBack',
      classNames: ['backBtn'],
      callback: handleBackButtonClick,
    });

    topBar.appendChild(backBtn);

    return topBar;
  }

  // Menu
  //-----------------------------------------------
  function showMenu(consumerCard) {
    selectedConsumerId = consumerCard.dataset.consumerId;

    sectionsMenu.classList.add('visible');

    // remove old consumer card
    var oldCard = sectionsTopBar.querySelector('.consumerCard');
    if (oldCard) sectionsTopBar.removeChild(oldCard);

    // add selected consumer card
    var cardClone = consumerCard.cloneNode(true);
    sectionsTopBar.appendChild(cardClone);
  }
  function buildMenu() {
    var menu = document.createElement('div');
    menu.classList.add('consumerSections__menu', 'visible');

    sections.forEach(sec => {
      var sectionItem = document.createElement('div');
      sectionItem.classList.add('menuItem');
      sectionItem.innerHTML = sec.name;
      sectionItem.setAttribute('data-sectionId', sec.id);
      if (sec.name === 'Remove Consumer') sectionItem.classList.add('removeConsumer');
      menu.appendChild(sectionItem);
    });

    menu.addEventListener('click', e => {
      var targetSectionName = e.target.innerHTML;

      if (targetSectionName === 'Remove Consumer') {
        itConsumerSection.removeConsumer(selectedConsumerId);
      } else {
        showSection(targetSectionName);
        populateSection(targetSectionName);
      }
    });

    return menu;
  }

  // Main
  //-----------------------------------------------
  function build(consumersInvolvedData) {
    sectionsContainer = document.createElement('div');
    sectionsContainer.classList.add('consumerSections');

    sectionsTopBar = buildTopBar();

    var sectionsInner = document.createElement('div');
    sectionsInner.classList.add('consumerSections__inner');

    sectionsMenu = buildMenu();
    followUpSection = consumerFollowUp.build();
    injuriesSection = consumerInjuries.build();
    interventionSection = consumerIntervention.build();
    involvementSection = consumerInvolvement.build(consumersInvolvedData);
    reportingSection = consumerReporting.build();
    reviewSection = consumerReview.build();
    behaviorSection = consumerBehavior.build();

    sectionsInner.appendChild(sectionsMenu);
    sectionsInner.appendChild(behaviorSection);
    sectionsInner.appendChild(followUpSection);
    sectionsInner.appendChild(injuriesSection);
    sectionsInner.appendChild(interventionSection);
    sectionsInner.appendChild(involvementSection);
    sectionsInner.appendChild(reportingSection);
    sectionsInner.appendChild(reviewSection);

    sectionsContainer.appendChild(sectionsTopBar);
    sectionsContainer.appendChild(sectionsInner);

    return sectionsContainer;
  }

  return {
    build,
    showMenu,
    showSectionMenu,
    showBackBtn,
    hideBackBtn,
  };
})();
var consumerFollowUp = (function () {
  // DOM
  //---------------------
  var section;
  var followUpHome;
  var newFollowUpBtn;
  var followUpReviewTable;
  //*form
  var followUpForm;
  var followUpTypeDropdown;
  var personResponsibleInput;
  var dueDateInput;
  var completedDateInput;
  var notesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var followUpsData; // save/update data
  var followUpsDeleteData;
  var followUpTypes;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedFollowUpId;
  //*form default values
  var dueDate;
  var dateCompleted;
  var followUpTypeId;
  var personResponsible;
  var followUpNote;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return followUpsData;
  }
  function getDataForDelete() {
    return followUpsDeleteData;
  }
  function clearData() {
    followUpsData = undefined;
    followUpsDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedFollowUpId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    // deletes all follow ups
    if (followUpsData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newFollowUpsData } = followUpsData;
      followUpsData = newFollowUpsData;

      if (!followUpsDeleteData[consumerId]) {
        followUpsDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerFollowUpData() {
    if (!selectedFollowUpId.includes('new')) {
      var deletedFollowUp = followUpsData[selectedConsumerId][selectedFollowUpId];
      if (!followUpsDeleteData[selectedConsumerId]) followUpsDeleteData[selectedConsumerId] = {};
      followUpsDeleteData[selectedConsumerId][selectedFollowUpId] = deletedFollowUp;
    }

    delete followUpsData[selectedConsumerId][selectedFollowUpId];

    selectedFollowUpId = undefined;
    var form = section.querySelector('.followUpForm');
    section.removeChild(form);
    followUpHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getitConsumerFollowUpTypes(function (res) {
      followUpTypes = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerFollowUpData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var followUpTypeSelect = followUpTypeDropdown.querySelector('.dropdown__select');
    if (!followUpTypeSelect.value || followUpTypeSelect.value === '%') {
      followUpTypeDropdown.classList.add('error');
      hasErrors = true;
    } else {
      followUpTypeDropdown.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    dueDate = undefined;
    dateCompleted = undefined;
    followUpTypeId = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
    personResponsible = undefined;
    followUpNote = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      dueDate = formData.dueDate;
      dateCompleted = formData.dateCompleted;
      followUpTypeId = formData.followUpTypeId;
      personResponsible = formData.personResponsible;
      followUpNote = formData.notes;
    }
  }
  // events
  function setupFormEvents() {
    var tmpFollowUpTypeId;
    var tmpPersonResponsible;
    var tmpDueDate;
    var tmpCompletedDate;
    var tmpNote;

    followUpTypeDropdown.addEventListener('change', e => {
      tmpFollowUpTypeId = e.target.value;
      checkRequiredFields();
    });
    personResponsibleInput.addEventListener('change', e => {
      tmpPersonResponsible = e.target.value;
    });
    dueDateInput.addEventListener('change', e => {
      tmpDueDate = e.target.value;
    });
    completedDateInput.addEventListener('change', e => {
      tmpCompletedDate = e.target.value;
    });
    notesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!followUpsData[selectedConsumerId]) {
          followUpsData[selectedConsumerId] = {};
        }

        if (!followUpsData[selectedConsumerId][selectedFollowUpId]) {
          var keys = Object.keys(followUpsData[selectedConsumerId]);
          selectedFollowUpId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          followUpsData[selectedConsumerId][selectedFollowUpId] = {
            dateCompleted: '',
            dueDate: '',
            followUpTypeId: '',
            notes: '',
            personResponsible: '',
            updated: '',
          };
        }

        if (tmpCompletedDate || tmpDueDate || tmpFollowUpTypeId || tmpNote || tmpPersonResponsible) {
          followUpsData[selectedConsumerId][selectedFollowUpId].updated = true;
        }

        if (tmpCompletedDate) followUpsData[selectedConsumerId][selectedFollowUpId].dateCompleted = tmpCompletedDate;
        if (tmpDueDate) followUpsData[selectedConsumerId][selectedFollowUpId].dueDate = tmpDueDate;
        if (tmpFollowUpTypeId) followUpsData[selectedConsumerId][selectedFollowUpId].followUpTypeId = tmpFollowUpTypeId;
        if (tmpNote) followUpsData[selectedConsumerId][selectedFollowUpId].notes = tmpNote;
        if (tmpPersonResponsible)
          followUpsData[selectedConsumerId][selectedFollowUpId].personResponsible = tmpPersonResponsible;

        selectedFollowUpId = undefined;

        var form = section.querySelector('.followUpForm');
        section.removeChild(form);
        followUpHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedFollowUpId = undefined;
        var form = section.querySelector('.followUpForm');
        section.removeChild(form);
        followUpHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildFollowUpTypeDropdown() {
    var opts = {
      label: 'Follow Up Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var followUptypeDrop = dropdown.build(opts);

    var data = followUpTypes.map(fu => {
      return {
        value: fu.itFollowUpTypeId,
        text: fu.followUpTypeName,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(followUptypeDrop, data, followUpTypeId);

    return followUptypeDrop;
  }
  function buildPersonResponsibleInput() {
    var opts = {
      label: 'Person Responsible',
      type: 'text',
      style: 'secondary',
      value: personResponsible,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var personInput = input.build(opts);

    return personInput;
  }
  function buildDueDateInput() {
    var inputOptions = {
      label: 'Due Date',
      type: 'date',
      style: 'secondary',
      value: '',
    };

    if (dueDate) inputOptions.value = dueDate;
    if (isEdit && formReadOnly) {
      inputOptions.readonly = true;
    }

    var dateInput = input.build(inputOptions);

    return dateInput;
  }
  function buildCompletedDateInput() {
    var inputOptions = {
      label: 'Date Completed',
      type: 'date',
      style: 'secondary',
      value: '',
    };

    if (dateCompleted) inputOptions.value = dateCompleted;
    if (isEdit && formReadOnly) {
      inputOptions.readonly = true;
    }

    var dateInput = input.build(inputOptions);

    return dateInput;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Note',
      type: 'textarea',
      style: 'secondary',
      value: followUpNote,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var noteInput = input.build(opts);

    return noteInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
      classNames: 'disabled',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewFollowUpForm() {
    var form = document.createElement('div');
    form.classList.add('followUpForm');

    followUpTypeDropdown = buildFollowUpTypeDropdown();
    personResponsibleInput = buildPersonResponsibleInput();
    dueDateInput = buildDueDateInput();
    completedDateInput = buildCompletedDateInput();
    notesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(followUpTypeDropdown);
    form.appendChild(personResponsibleInput);
    form.appendChild(dueDateInput);
    form.appendChild(completedDateInput);
    form.appendChild(notesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    followUpHome.classList.add('hidden');

    followUpForm = buildNewFollowUpForm();
    section.appendChild(followUpForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = followUpReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!followUpsData) return;
    if (!followUpsData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(followUpsData[selectedConsumerId]);
    keys.forEach(key => {
      var followUpData = followUpsData[selectedConsumerId][key];

      var filterFollowUpTypes = followUpTypes.filter(type => type.itFollowUpTypeId === followUpData.followUpTypeId);
      var followUpType = filterFollowUpTypes[0] ? filterFollowUpTypes[0].followUpTypeName : '';
      var personResponsible = followUpData.personResponsible;
      var dueDate = followUpData.dueDate ? followUpData.dueDate.split(' ')[0] : '';
      dueDate = dueDate ? UTIL.formatDateFromIso(dueDate) : dueDate;

      tableData.push({
        id: key,
        values: [followUpType, personResponsible, dueDate],
      });
    });

    table.populate(followUpReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerFollowUpTable',
      columnHeadings: ['Follow Up Type', 'Person Responsible', 'Due Date'],
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedFollowUpId = event.target.id;
        setFormDataDefaults(followUpsData[selectedConsumerId][selectedFollowUpId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    followUpsData = {};
    followUpsDeleteData = {};
    getDropdownData();
  }
  function buildAddNewFollowUpBtn() {
    var btn = button.build({
      text: 'Add New Follow Up',
      type: 'contained',
      style: 'secondary',
    });
    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'followUpSection');

    followUpHome = document.createElement('div');
    followUpHome.classList.add('consumerSections__section__home');

    newFollowUpBtn = buildAddNewFollowUpBtn();
    followUpReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) followUpHome.appendChild(newFollowUpBtn);
    followUpHome.appendChild(followUpReviewTable);

    section.appendChild(followUpHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!followUpsData[selectedConsumerId]) {
          followUpsData[selectedConsumerId] = {};
        }

        if (!followUpsData[selectedConsumerId][d.itConsumerFollowUpId]) {
          followUpsData[selectedConsumerId][d.itConsumerFollowUpId] = d;
          followUpsData[selectedConsumerId][d.itConsumerFollowUpId].updated = false;

          // format dates
          var dateTimeCompleted = followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dateCompleted;
          var dueDateTime = followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dueDate;
          dateCompleted = dateTimeCompleted ? dateTimeCompleted.split(' ')[0] : null;
          dueDate = dueDateTime ? dueDateTime.split(' ')[0] : null;

          if (dateCompleted) {
            followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dateCompleted =
              UTIL.formatDateToIso(dateCompleted);
          }
          if (dueDate) {
            followUpsData[selectedConsumerId][d.itConsumerFollowUpId].dueDate = UTIL.formatDateToIso(dueDate);
          }
        }
      });
    }
    console.table(followUpsData);

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
var consumerInjuries = (function () {
  // DOM
  //---------------------
  var section;
  var injuriesHome;
  var newInjuryBtn;
  var injuriesReviewTable;
  //*form
  var injuryLocationDropdown;
  var injuryTypeDropdown;
  var injuryCauseDropdown;
  var riskOfInjuryDropdown;
  var checkedByNurseCheckbox;
  var detailsInput;
  var treatmentInput;
  var dateCheckedInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var injuryData; // save/update data
  var injuryDeleteData;
  var injuryLocations;
  var injuryTypes;
  var injuryRisks;
  var injuryCauses;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedInjuryId;
  //*form values
  var injuryLocationId;
  var injuryTypeId;
  var injuryCauseId;
  var injuryRiskId;
  var checkedByNurse;
  var details;
  var treatment;
  var dateChecked;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return injuryData;
  }
  function getDataForDelete() {
    return injuryDeleteData;
  }
  function clearData() {
    injuryData = undefined;
    injuryDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedInjuryId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    if (injuryData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newInjuryData } = injuryData;
      injuryData = newInjuryData;

      if (!injuryDeleteData[consumerId]) {
        injuryDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerInjuryData() {
    if (!selectedInjuryId.includes('new')) {
      var deletedInjury = injuryData[selectedConsumerId][selectedInjuryId];
      if (!injuryDeleteData[selectedConsumerId]) injuryDeleteData[selectedConsumerId] = {};
      injuryDeleteData[selectedConsumerId][selectedInjuryId] = deletedInjury;
    }

    delete injuryData[selectedConsumerId][selectedInjuryId];

    selectedInjuryId = undefined;
    var form = section.querySelector('.injuryForm');
    section.removeChild(form);
    injuriesHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getInjuryLocationsDropdown(function (locations) {
      injuryLocations = locations;

      incidentTrackingAjax.getInjuryTypesDropdown(function (types) {
        injuryTypes = types;

        incidentTrackingAjax.getRiskAndCauseDropdown(function (riskAndCause) {
          injuryRisks = riskAndCause.injuryRiskDropdown;
          injuryCauses = riskAndCause.injuryCauseDropdowns;
        });
      });
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerInjuryData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var injuryLocationSelect = injuryLocationDropdown.querySelector('.dropdown__select');
    var injuryTypeSelect = injuryTypeDropdown.querySelector('.dropdown__select');

    if (!injuryLocationSelect.value || injuryLocationSelect.value === '%') {
      injuryLocationDropdown.classList.add('error');
      hasErrors = true;
    } else {
      injuryLocationDropdown.classList.remove('error');
    }

    if (!injuryTypeSelect.value || injuryTypeSelect.value === '%') {
      injuryTypeDropdown.classList.add('error');
      hasErrors = true;
    } else {
      injuryTypeDropdown.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    injuryLocationId = undefined;
    injuryTypeId = undefined;
    injuryCauseId = undefined;
    injuryRiskId = undefined;
    checkedByNurse = undefined;
    details = undefined;
    treatment = undefined;
    dateChecked = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      injuryLocationId = formData.injuryLocationId;
      injuryTypeId = formData.injuryTypeId;
      injuryCauseId = formData.injuryCauseId;
      injuryRiskId = formData.injuryRiskId;
      checkedByNurse = formData.checkedByNurse;
      details = formData.injuryDetails;
      treatment = formData.injuryTreatment;
      dateChecked = formData.checkedDate;
    }
  }
  // events
  function setupFormEvents() {
    let tmpInjuryLocation;
    let tmpInjuryType;
    let tmpInjuryCause;
    let tmpInjuryRisk;
    let tmpCheckedBy;
    let tmpDetails;
    let tmpTreatment;
    let tmpDateChecked;

    injuryLocationDropdown.addEventListener('change', e => {
      tmpInjuryLocation = e.target.value;
      checkRequiredFields();
    });
    injuryTypeDropdown.addEventListener('change', e => {
      tmpInjuryType = e.target.value;
      checkRequiredFields();
    });
    injuryCauseDropdown.addEventListener('change', e => {
      tmpInjuryCause = e.target.value;
    });
    riskOfInjuryDropdown.addEventListener('change', e => {
      tmpInjuryRisk = e.target.value;
    });
    checkedByNurseCheckbox.addEventListener('change', e => {
      tmpCheckedBy = e.target.checked ? 'Y' : 'N';
    });
    detailsInput.addEventListener('change', e => {
      tmpDetails = e.target.value;
    });
    treatmentInput.addEventListener('change', e => {
      tmpTreatment = e.target.value;
    });
    dateCheckedInput.addEventListener('change', e => {
      tmpDateChecked = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!injuryData[selectedConsumerId]) {
          injuryData[selectedConsumerId] = {};
        }

        if (!injuryData[selectedConsumerId][selectedInjuryId]) {
          var keys = Object.keys(injuryData[selectedConsumerId]);
          selectedInjuryId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          injuryData[selectedConsumerId][selectedInjuryId] = {
            injuryLocationId: '',
            injuryTypeId: '',
            checkedByNurse: 'N',
            injuryDetails: '',
            injuryTreatment: '',
            checkedDate: '',
            updated: '',
          };
        }

        if (
          tmpInjuryLocation !== undefined ||
          tmpInjuryType !== undefined ||
          tmpInjuryCause !== undefined ||
          tmpInjuryRisk !== undefined ||
          tmpCheckedBy !== undefined ||
          tmpDetails !== undefined ||
          tmpTreatment !== undefined ||
          tmpDateChecked !== undefined
        ) {
          injuryData[selectedConsumerId][selectedInjuryId].updated = true;
        }

        if (tmpInjuryLocation !== undefined) injuryData[selectedConsumerId][selectedInjuryId].injuryLocationId = tmpInjuryLocation;
        if (tmpInjuryType !== undefined) injuryData[selectedConsumerId][selectedInjuryId].injuryTypeId = tmpInjuryType;
        if (tmpInjuryCause !== undefined) injuryData[selectedConsumerId][selectedInjuryId].injuryCauseId = tmpInjuryCause;
        if (tmpInjuryRisk !== undefined) injuryData[selectedConsumerId][selectedInjuryId].injuryRiskId = tmpInjuryRisk;
        if (tmpCheckedBy !== undefined) injuryData[selectedConsumerId][selectedInjuryId].checkedByNurse = tmpCheckedBy;
        if (tmpDetails !== undefined) injuryData[selectedConsumerId][selectedInjuryId].injuryDetails = tmpDetails;
        if (tmpTreatment !== undefined) injuryData[selectedConsumerId][selectedInjuryId].injuryTreatment = tmpTreatment;
        if (tmpDateChecked !== undefined) injuryData[selectedConsumerId][selectedInjuryId].checkedDate = tmpDateChecked;

        selectedInjuryId = undefined;

        var form = section.querySelector('.injuryForm');
        section.removeChild(form);
        injuriesHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedInjuryId = undefined;
        var form = section.querySelector('.injuryForm');
        section.removeChild(form);
        injuriesHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildInjuryLocationDropdown() {
    var opts = {
      label: 'Injury Location',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iLocDrop = dropdown.build(opts);

    var data = injuryLocations.map(loc => {
      return {
        value: loc.injuryLocationId,
        text: loc.injuryLocation,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(iLocDrop, data, injuryLocationId);

    return iLocDrop;
  }
  function buildInjuryTypeDropdown() {
    var opts = {
      label: 'Injury Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iTypeDrop = dropdown.build(opts);

    var data = injuryTypes.map(type => {
      return {
        value: type.injuryTypeId,
        text: type.injuryType,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(iTypeDrop, data, injuryTypeId);

    return iTypeDrop;
  }
  function buildInjuryCauseDropdown() {
    var opts = {
      label: 'Cause of Injury',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iCauseDrop = dropdown.build(opts);

    var data = injuryCauses.map(type => {
      return {
        value: type.injuryCauseId,
        text: type.injuryCauseDescription,
      };
    });

    data.sort((a, b) => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });

    data.unshift({ value: '', text: '' });
    dropdown.populate(iCauseDrop, data, injuryCauseId);

    return iCauseDrop;
  }
  function buildRiskOfInjuryDropdown() {
    var opts = {
      label: 'Risk of Serious Injury',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iRiskDrop = dropdown.build(opts);

    var data = injuryRisks.map(type => {
      return {
        value: type.injuryRiskId,
        text: type.injuryRiskdescription,
      };
    });

    data.sort((a, b) => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });

    data.unshift({ value: '', text: '' });
    dropdown.populate(iRiskDrop, data, injuryRiskId);

    return iRiskDrop;
  }
  function buildCheckedByCheckbox() {
    var opts = {
      text: 'Checked By Nurse',
      isChecked: checkedByNurse === 'Y' ? true : false,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var checkbox = input.buildCheckbox(opts);

    return checkbox;
  }
  function buildDetailsInput() {
    var opts = {
      label: 'Details',
      type: 'textarea',
      style: 'secondary',
      value: details,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var dInput = input.build(opts);

    return dInput;
  }
  function buildTreatmentInput() {
    var opts = {
      label: 'Treatment',
      type: 'textarea',
      style: 'secondary',
      value: treatment,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var tInput = input.build(opts);

    return tInput;
  }
  function buildDateCheckedInput() {
    var opts = {
      label: 'Date Checked',
      type: 'date',
      style: 'secondary',
      value: dateChecked,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var dcInput = input.build(opts);

    return dcInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewInjuryForm() {
    var form = document.createElement('div');
    form.classList.add('injuryForm');

    injuryLocationDropdown = buildInjuryLocationDropdown();
    injuryTypeDropdown = buildInjuryTypeDropdown();
    injuryCauseDropdown = buildInjuryCauseDropdown();
    riskOfInjuryDropdown = buildRiskOfInjuryDropdown();
    checkedByNurseCheckbox = buildCheckedByCheckbox();
    detailsInput = buildDetailsInput();
    treatmentInput = buildTreatmentInput();
    dateCheckedInput = buildDateCheckedInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(injuryLocationDropdown);
    form.appendChild(injuryTypeDropdown);
    form.appendChild(injuryCauseDropdown);
    form.appendChild(riskOfInjuryDropdown);
    form.appendChild(checkedByNurseCheckbox);
    form.appendChild(detailsInput);
    form.appendChild(treatmentInput);
    form.appendChild(dateCheckedInput);
    form.appendChild(formButtons);

    form.addEventListener('change', () => incidentCard.checkEntireIncidentCardforErrors());

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    injuriesHome.classList.add('hidden');

    var injuryForm = buildNewInjuryForm();
    section.appendChild(injuryForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = injuriesReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!injuryData) return;
    if (!injuryData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(injuryData[selectedConsumerId]);
    keys.forEach(key => {
      var data = injuryData[selectedConsumerId][key];
      var filteredLocations = injuryLocations.filter(iLoc => iLoc.injuryLocationId === data.injuryLocationId);
      var filteredTypes = injuryTypes.filter(iType => iType.injuryTypeId === data.injuryTypeId);
      var injuryLocation = filteredLocations[0].injuryLocation;
      var injuryType = filteredTypes[0].injuryType;
      var nurseChecked = data.checkedByNurse === 'Y' ? 'Yes' : 'No';

      tableData.push({
        id: key,
        values: [injuryLocation, injuryType, nurseChecked],
      });
    });

    table.populate(injuriesReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerInjuriesTable',
      columnHeadings: ['Injury Location', 'Injury Type', 'Checked By Nurse'],
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedInjuryId = event.target.id;
        setFormDataDefaults(injuryData[selectedConsumerId][selectedInjuryId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    injuryData = {};
    injuryDeleteData = {};
    getDropdownData();
  }
  function buildAddNewInjuryBtn() {
    var btn = button.build({
      text: 'Add New Injury',
      type: 'contained',
      style: 'secondary',
    });

    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'injuriesSection');

    injuriesHome = document.createElement('div');
    injuriesHome.classList.add('consumerSections__section__home');

    newInjuryBtn = buildAddNewInjuryBtn();
    injuriesReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) injuriesHome.appendChild(newInjuryBtn);
    injuriesHome.appendChild(injuriesReviewTable);

    section.appendChild(injuriesHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!injuryData[selectedConsumerId]) {
          injuryData[selectedConsumerId] = {};
        }

        if (!injuryData[selectedConsumerId][d.itConsumerInjuryId]) {
          injuryData[selectedConsumerId][d.itConsumerInjuryId] = d;
          injuryData[selectedConsumerId][d.itConsumerInjuryId].updated = false;

          // format dates
          var dateChecked = injuryData[selectedConsumerId][d.itConsumerInjuryId].checkedDate;
          dateChecked = dateChecked ? dateChecked.split(' ')[0] : null;

          if (dateChecked) {
            injuryData[selectedConsumerId][d.itConsumerInjuryId].checkedDate = UTIL.formatDateToIso(dateChecked);
          }
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
var consumerIntervention = (function () {
  // DOM
  //---------------------
  var section;
  var interventionHome;
  var newInterventionBtn;
  var interventionReviewTable;
  //*form
  var interventionTypeDropdown;
  var startTimeInput;
  var endTimeInput;
  var totalTimeInput;
  var aversiveCheckbox;
  var notesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var interventionData; // save/update data
  var interventionDeleteData;
  var interventionTypes;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedInterventionId;
  //*form values
  var interventionTypeId;
  var startTime;
  var endTime;
  var timeLength;
  var aversive;
  var note;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function calculateTotalHours(dirtyStart, dirtyEnd) {
    // must be military time
    if (dirtyStart === '' || dirtyEnd === '' || !dirtyStart || !dirtyEnd) {
      return;
    }

    var startTime = dirtyStart.split(':');
    var endTime = dirtyEnd.split(':');

    var tempDate = new Date();
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth();
    var day = tempDate.getDate();

    var startDate = new Date(year, month, day, startTime[0], startTime[1]);
    var endDate;
    if (dirtyEnd === '00:00') {
      endDate = new Date(year, month, day + 1, endTime[0], endTime[1]);
    } else {
      endDate = new Date(year, month, day, endTime[0], endTime[1]);
    }

    var timeDiff = endDate - startDate;
    var hoursDiff = Math.floor((timeDiff % 86400000) / 3600000);
    var minutesDiff = Math.floor(((timeDiff % 86400000) % 3600000) / 60000);

    return `${UTIL.leadingZero(hoursDiff)}:${UTIL.leadingZero(minutesDiff)}`;
  }
  function calculateTimeLength() {
    var stInput = startTimeInput.querySelector('input');
    var etInput = endTimeInput.querySelector('input');
    var ttInput = totalTimeInput.querySelector('input');

    var sTime = stInput.value;
    var eTime = etInput.value;

    if (!sTime || !eTime) {
      if (!sTime) startTimeInput.classList.remove('error');
      if (!eTime) endTimeInput.classList.remove('error');
      if (!sTime && !eTime) saveBtn.classList.remove('disabled');
      return null;
    }

    var totalTime = calculateTotalHours(sTime, eTime);

    if (totalTime.search('-') === -1) {
      ttInput.value = totalTime;
      startTimeInput.classList.remove('error');
      endTimeInput.classList.remove('error');
      saveBtn.classList.remove('disabled');
      return totalTime;
    } else {
      ttInput.value = '';
      startTimeInput.classList.add('error');
      endTimeInput.classList.add('error');
      saveBtn.classList.add('disabled');
      return null;
    }
  }

  function getDataForSave() {
    return interventionData;
  }
  function getDataForDelete() {
    return interventionDeleteData;
  }
  function clearData() {
    interventionData = undefined;
    interventionDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedInterventionId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    if (interventionData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newInterventionData } = interventionData;
      interventionData = newInterventionData;

      if (!interventionDeleteData[consumerId]) {
        interventionDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerInterventionData() {
    if (!selectedInterventionId.includes('new')) {
      var deletedIntervention = interventionData[selectedConsumerId][selectedInterventionId];
      if (!interventionDeleteData[selectedConsumerId]) interventionDeleteData[selectedConsumerId] = {};
      interventionDeleteData[selectedConsumerId][selectedInterventionId] = deletedIntervention;
    }

    delete interventionData[selectedConsumerId][selectedInterventionId];

    selectedInterventionId = undefined;
    var form = section.querySelector('.interventionForm');
    section.removeChild(form);
    interventionHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getInterventionTypesDropdown(function (res) {
      interventionTypes = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerInterventionData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var interventionTypeSelect = interventionTypeDropdown.querySelector('.dropdown__select');
    if (!interventionTypeSelect.value || interventionTypeSelect.value === '%') {
      interventionTypeDropdown.classList.add('error');
      hasErrors = true;
    } else {
      interventionTypeDropdown.classList.remove('error');
    }

    //var errors = [...followUpForm.querySelectorAll('.error')];
    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    interventionTypeId = undefined;
    startTime = undefined;
    endTime = undefined;
    timeLength = undefined;
    aversive = undefined;
    note = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      var sTime = formData.startTime.split(':');
      var eTime = formData.stopTime.split(':');
      var tTime = formData.timeLength.split(':');

      interventionTypeId = formData.interventionType;
      startTime = `${sTime[0]}:${sTime[1]}`;
      endTime = `${eTime[0]}:${eTime[1]}`;
      timeLength = `${tTime[0]}:${tTime[1]}`;
      aversive = formData.aversive;
      note = formData.interventionNotes;
      lastUpdatedBy = formData.lastUpdatedBy;
      lastUpdatedOn = formData.lastUpdatedOn;
    }
  }
  // events
  function setupFormEvents() {
    var tmpInterventionType;
    var tmpStartTime;
    var tmpEndTime;
    var tmpTimeLength;
    var tmpAversive;
    var tmpNote;

    interventionTypeDropdown.addEventListener('change', e => {
      tmpInterventionType = e.target.value;
      checkRequiredFields();
    });
    startTimeInput.addEventListener('change', e => {
      tmpStartTime = e.target.value;
      tmpTimeLength = calculateTimeLength();
    });
    endTimeInput.addEventListener('change', e => {
      tmpEndTime = e.target.value;
      tmpTimeLength = calculateTimeLength();
    });
    aversiveCheckbox.addEventListener('change', e => {
      tmpAversive = e.target.checked ? 'Y' : 'N';
    });
    notesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!interventionData[selectedConsumerId]) {
          interventionData[selectedConsumerId] = {};
        }

        if (!interventionData[selectedConsumerId][selectedInterventionId]) {
          var keys = Object.keys(interventionData[selectedConsumerId]);
          selectedInterventionId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          interventionData[selectedConsumerId][selectedInterventionId] = {
            interventionType: '',
            startTime: '',
            stopTime: '',
            timeLength: '',
            aversive: '',
            interventionNotes: '',
            updated: '',
          };
        }

        if (tmpInterventionType || tmpStartTime || tmpEndTime || tmpTimeLength || tmpAversive || tmpNote) {
          interventionData[selectedConsumerId][selectedInterventionId].updated = true;
        }

        if (tmpInterventionType)
          interventionData[selectedConsumerId][selectedInterventionId].interventionType = tmpInterventionType;
        if (tmpStartTime) interventionData[selectedConsumerId][selectedInterventionId].startTime = tmpStartTime;
        if (tmpEndTime) interventionData[selectedConsumerId][selectedInterventionId].stopTime = tmpEndTime;
        if (tmpTimeLength) interventionData[selectedConsumerId][selectedInterventionId].timeLength = tmpTimeLength;
        if (tmpAversive) interventionData[selectedConsumerId][selectedInterventionId].aversive = tmpAversive;
        if (tmpNote) interventionData[selectedConsumerId][selectedInterventionId].interventionNotes = tmpNote;

        selectedInterventionId = undefined;

        var form = section.querySelector('.interventionForm');
        section.removeChild(form);
        interventionHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedInterventionId = undefined;
        var form = section.querySelector('.interventionForm');
        section.removeChild(form);
        interventionHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildInterventionTypeDropdown() {
    var opts = {
      label: 'Intervention Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iTypeDrop = dropdown.build(opts);

    var data = interventionTypes.map(it => {
      return {
        value: it.interventionTypeId,
        text: it.description,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(iTypeDrop, data, interventionTypeId);

    return iTypeDrop;
  }
  function buildStartTimeInput() {
    var opts = {
      label: 'Start Time',
      type: 'time',
      style: 'secondary',
      value: startTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var stInput = input.build(opts);

    return stInput;
  }
  function buildEndTimeInput() {
    var opts = {
      label: 'End Time',
      type: 'time',
      style: 'secondary',
      value: endTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var etInput = input.build(opts);

    return etInput;
  }
  function buildTotalTimeInput() {
    var opts = {
      label: 'Total Time',
      type: 'text',
      style: 'secondary',
      readonly: true,
      value: timeLength,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var etInput = input.build(opts);

    return etInput;
  }
  function buildAversiveCheckbox() {
    var opts = {
      text: 'Aversive',
      isChecked: aversive === 'Y' ? true : false,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var checkbox = input.buildCheckbox(opts);

    return checkbox;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
      value: note,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var nInput = input.build(opts);

    return nInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewInterventionForm() {
    var form = document.createElement('div');
    form.classList.add('interventionForm');

    interventionTypeDropdown = buildInterventionTypeDropdown();
    startTimeInput = buildStartTimeInput();
    endTimeInput = buildEndTimeInput();
    totalTimeInput = buildTotalTimeInput();
    aversiveCheckbox = buildAversiveCheckbox();
    notesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(interventionTypeDropdown);
    form.appendChild(startTimeInput);
    form.appendChild(endTimeInput);
    form.appendChild(totalTimeInput);
    form.appendChild(aversiveCheckbox);
    form.appendChild(notesInput);
    form.appendChild(formButtons);

    form.addEventListener('change', () => incidentCard.checkEntireIncidentCardforErrors());

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    interventionHome.classList.add('hidden');

    var interventionForm = buildNewInterventionForm();
    section.appendChild(interventionForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = interventionReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!interventionData) return;
    if (!interventionData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(interventionData[selectedConsumerId]);
    keys.forEach(key => {
      var data = interventionData[selectedConsumerId][key];
      var filteredInterventionTypes = interventionTypes.filter(it => it.interventionTypeId === data.interventionType);
      var interventionType = filteredInterventionTypes[0].description;
      var timeLength = data.timeLength.split(':');
      timeLength = `${timeLength[0]}:${timeLength[1]}`;
      var aversive = data.aversive === 'Y' ? 'Yes' : 'No';

      tableData.push({
        id: key,
        values: [interventionType, timeLength, aversive],
      });
    });

    table.populate(interventionReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerInterventionTable',
      columnHeadings: ['Intervention Type', 'Time Length', 'Aversive'],
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedInterventionId = event.target.id;
        setFormDataDefaults(interventionData[selectedConsumerId][selectedInterventionId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    interventionData = {};
    interventionDeleteData = {};
    getDropdownData();
  }
  function buildAddNewInterventionBtn() {
    var btn = button.build({
      text: 'Add New Intervention',
      type: 'contained',
      style: 'secondary',
    });

    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'interventionSection');

    interventionHome = document.createElement('div');
    interventionHome.classList.add('consumerSections__section__home');

    newInterventionBtn = buildAddNewInterventionBtn();
    interventionReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) interventionHome.appendChild(newInterventionBtn);
    interventionHome.appendChild(interventionReviewTable);

    section.appendChild(interventionHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!interventionData[selectedConsumerId]) {
          interventionData[selectedConsumerId] = {};
        }

        if (!interventionData[selectedConsumerId][d.itConsumerInterventionId]) {
          interventionData[selectedConsumerId][d.itConsumerInterventionId] = d;
          interventionData[selectedConsumerId][d.itConsumerInterventionId].updated = false;
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
var consumerInvolvement = (function () {
  // DOM
  //---------------------
  var section;
  var involvementDropdown;
  var locationDropdown;
  var ppiCheckbox;
  var actionBtns;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var involvementsData;
  var involvementTypes;
  var consumerLocationData;
  // Values
  //---------------------
  var selectedConsumerId;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return involvementsData;
  }

  function deleteConsumerData(consumerId) {
    if (involvementsData[consumerId]) {
      var { [consumerId]: removedConsumer, ...newInvolvementsData } = involvementsData;
      involvementsData = newInvolvementsData;
    }
  }

  function clearData() {
    selectedConsumerId = undefined;
    involvementsData = undefined;
  }

  function setInvolvementsData(data) {
    involvementsData = {};

    if (data) {
      data.forEach(d => {
        involvementsData[d.consumerId] = {
          includeInCount: d.includeInCount,
          involvementId: d.involvementId,
          locationId: d.locationId,
          name: `${d.firstName} ${d.LastName}`,
        };
      });
    }
  }
  function initConsumerInvolvementData(consumerId) {
    // get location data for consumer
    return new Promise((fulfill, reject) => {
      incidentTrackingAjax.getConsumerServiceLocations(consumerId, results => {
        consumerLocationData[consumerId] = results.map(r => {
          return {
            value: r.locationId,
            text: r.description,
          };
        });

        if (!involvementsData[consumerId]) {
          var includeInCount = 'Y';
          var involvementId = involvementTypes[0].involvementId;
          var locationId =
            consumerLocationData[consumerId].length === 1 ? consumerLocationData[consumerId][0].value : '';

          involvementsData[consumerId] = {
            includeInCount,
            involvementId,
            locationId,
          };
        }

        fulfill();
      });
    });
  }

  function toggleSaveDisabled() {
    var errors = [].slice.call(section.querySelectorAll('.error'));

    if (errors.length > 0) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function checkRequiredFields() {
    var allHaveLocation = true;
    var oneHasPPI = false;
    var consumerIds = [];

    var keys = Object.keys(involvementsData);
    keys.forEach(k => {
      var data = involvementsData[k];
      if (data.locationId === '') {
        allHaveLocation = false;
        consumerIds.push(k);
      }
      if (data.includeInCount === 'Y') oneHasPPI = true;
    });

    if (!oneHasPPI) {
      itConsumerSection.showConsumerError(['%'], 'At least one consumer must have PPI checked.');
      return;
    } else {
      if (!allHaveLocation) {
        itConsumerSection.showConsumerError(consumerIds, 'Involvement location is required.');
      } else {
        itConsumerSection.removeConsumerErrors();
      }
    }
  }

  function checkOneHasPPI() {
    let oneHasPPI = false;
    const keys = Object.keys(involvementsData);
    keys.forEach(k => {
      const data = involvementsData[k];
      if (data.includeInCount === 'Y') oneHasPPI = true;
    });
    return oneHasPPI;
  }

  function doesAnotherConsumerHavePPIChecked() {
    var otherConsumerHasPPI = false;

    var keys = Object.keys(involvementsData);

    if (keys.length === 1) {
      return true;
    }

    keys.forEach(k => {
      var data = involvementsData[k];
      if (data.includeInCount === 'Y') otherConsumerHasPPI = true;
    });

    return otherConsumerHasPPI;
  }

  // Events
  //-----------------------------------------------
  function setupEvents() {
    var tmpInvolvementId;
    var tmpLocationId;
    var tmpPpi;

    involvementDropdown.addEventListener('change', e => {
      tmpInvolvementId = e.target.value;
      if (tmpInvolvementId === '') {
        involvementDropdown.classList.add('error');
      } else {
        involvementDropdown.classList.remove('error');
      }
      toggleSaveDisabled();
    });
    locationDropdown.addEventListener('change', e => {
      tmpLocationId = e.target.value;
      if (tmpLocationId === '') {
        locationDropdown.classList.add('error');
      } else {
        locationDropdown.classList.remove('error');
      }
      toggleSaveDisabled();
    });
    ppiCheckbox.addEventListener('change', e => {
      tmpPpi = e.target.checked ? 'Y' : 'N';

      if (tmpPpi === 'Y') {
        ppiCheckbox.classList.remove('error');
      } else {
        if (doesAnotherConsumerHavePPIChecked()) {
          ppiCheckbox.classList.remove('error');
        } else {
          ppiCheckbox.classList.add('error');
        }
      }

      toggleSaveDisabled();
    });

    actionBtns.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (tmpPpi) involvementsData[selectedConsumerId].includeInCount = tmpPpi;
        if (tmpInvolvementId) involvementsData[selectedConsumerId].involvementId = tmpInvolvementId;
        if (tmpLocationId) involvementsData[selectedConsumerId].locationId = tmpLocationId;

        tmpPpi = undefined;
        tmpInvolvementId = undefined;
        tmpLocationId = undefined;

        const locationId = involvementsData[selectedConsumerId].locationId;
        const involvementSec = document.querySelector("[data-sectionid='5']");
        if (locationId === '' || consumerInvolvement.checkOneHasPPI() === false) {
          involvementSec.classList.add('sectionError');
        } else {
          involvementSec.classList.remove('sectionError');
        }

        section.classList.remove('visible');
        consumerSubSections.showSectionMenu();
        checkRequiredFields();
        incidentCard.checkEntireIncidentCardforErrors();
      }

      if (e.target === cancelBtn) {
        section.classList.remove('visible');
        consumerSubSections.showSectionMenu();
      }
    });
  }
  // Populate
  //-----------------------------------------------
  function populateLocationDropdown() {
    function populateDropdown(data) {
      var locationId = involvementsData[selectedConsumerId].locationId;

      if (!locationId && data.length > 1) {
        if (data[0].value !== '') data.unshift({ value: '', text: '' });
        locationDropdown.classList.add('error');
      }

      dropdown.populate(locationDropdown, data, locationId);
    }

    var data = consumerLocationData[selectedConsumerId];

    if (!data) {
      incidentTrackingAjax.getConsumerServiceLocations(selectedConsumerId, results => {
        consumerLocationData[selectedConsumerId] = results.map(r => {
          return {
            value: r.locationId,
            text: r.description,
          };
        });

        populateDropdown(consumerLocationData[selectedConsumerId]);
      });

      return;
    }

    populateDropdown(data);
  }
  function setInvolvmentDropdownValue() {
    var consumerData = involvementsData[selectedConsumerId];
    var involvmentSelect = involvementDropdown.querySelector('select');
    if (consumerData.involvementId !== '') {
      involvmentSelect.value = consumerData.involvementId;
      involvementDropdown.classList.remove('error');
    }
  }
  function setPPICheckboxValue() {
    var consumerData = involvementsData[selectedConsumerId];
    var ppiCheckboxInput = ppiCheckbox.querySelector('input');
    if (consumerData.includeInCount === 'Y' || consumerData.includeInCount === '') {
      ppiCheckboxInput.checked = true;
    } else {
      ppiCheckboxInput.checked = false;
    }
  }
  // Build
  //-----------------------------------------------
  function buildInvolvementDropdown() {
    var opts = {
      className: `involvementDropdown`,
      label: 'Involvement',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var iDropdown = dropdown.build(opts);

    involvementTypes = incidentTracking.getInvolvementTypes();

    var data = involvementTypes.map(it => {
      var involvementId = it.involvementId === '%' ? '' : it.involvementId;
      return { value: involvementId, text: it.description };
    });

    dropdown.populate(iDropdown, data);

    return iDropdown;
  }
  function buildLocationDropdown() {
    var opts = {
      dropdownId: `involvementLocation-${selectedConsumerId}`,
      className: `locationDropdown`,
      label: 'Location',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var lDropdown = dropdown.build(opts);

    return lDropdown;
  }
  function buildCheckbox() {
    var opts = {
      className: 'ppiCheckbox',
      text: 'Include in Counts',
      isChecked: true,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var checkbox = input.buildCheckbox(opts);

    return checkbox;
  }
  function buildBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    var saveText = true ? 'Update' : 'Save';

    saveBtn = button.build({
      text: saveText,
      type: 'contained',
      style: 'secondary',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }

  function involvementDataLookup(consumerId) {
    return involvementsData[consumerId];
  }

  function build(consumersInvolvedData) {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;
    consumerLocationData = {};
    setInvolvementsData(consumersInvolvedData);
    isEdit = consumersInvolvedData ? true : false;

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'involvementSection');

    involvementDropdown = buildInvolvementDropdown();
    locationDropdown = buildLocationDropdown();
    ppiCheckbox = buildCheckbox();
    actionBtns = buildBtns();

    section.appendChild(involvementDropdown);
    section.appendChild(locationDropdown);
    section.appendChild(ppiCheckbox);
    section.appendChild(actionBtns);

    setupEvents();
    toggleSaveDisabled();

    return section;
  }
  function populate(consumerId) {
    selectedConsumerId = consumerId;

    populateLocationDropdown();
    setInvolvmentDropdownValue();
    setPPICheckboxValue();
    checkRequiredFields();
  }

  return {
    build,
    populate,
    checkRequiredFields,
    initConsumerData: initConsumerInvolvementData,
    deleteConsumerData,
    getData: getDataForSave,
    clearData,
    involvementDataLookup,
    checkOneHasPPI,
  };
})();
var consumerReporting = (function () {
  // DOM
  //---------------------
  var section;
  var reportingHome;
  var newReportingBtn;
  var reportingReviewTable;
  //*form
  var reportingCategoryDropdown;
  var reportedByInput;
  var reportedToInput;
  var reportMethodInput;
  var reportDateInput;
  var reportTimeInput;
  var reportNotesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var reportingData;
  var reportingDeleteData;
  var reportingCategories;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedReportId;
  //*form values
  var dateReported;
  var reportTime;
  var reportBy;
  var reportMethod;
  var reportTo;
  var reportingCategoryId;
  var reportNotes;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return reportingData;
  }
  function getDataForDelete() {
    return reportingDeleteData;
  }
  function clearData() {
    reportingData = undefined;
    reportingDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedReportId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    var { [consumerId]: removedConsumerData, ...newReportingData } = reportingData;
    reportingData = newReportingData;

    if (!reportingDeleteData[consumerId]) {
      reportingDeleteData[consumerId] = removedConsumerData;
    }
  }
  function deleteConsumerReportingData() {
    if (!selectedReportId.includes('new')) {
      var deletedReport = reportingData[selectedConsumerId][selectedReportId];
      if (!reportingDeleteData[selectedConsumerId]) reportingDeleteData[selectedConsumerId] = {};
      reportingDeleteData[selectedConsumerId][selectedReportId] = deletedReport;
    }

    delete reportingData[selectedConsumerId][selectedReportId];

    selectedReportId = undefined;
    var form = section.querySelector('.reportForm');
    section.removeChild(form);
    reportingHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getitReportingCategories(function (res) {
      reportingCategories = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerReportingData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var reportCatSelect = reportingCategoryDropdown.querySelector('.dropdown__select');
    if (!reportCatSelect.value || reportCatSelect.value === '%') {
      reportingCategoryDropdown.classList.add('error');
      hasErrors = true;
    } else {
      reportingCategoryDropdown.classList.remove('error');
    }

    var dateInput = reportDateInput.querySelector('input');
    if (!dateInput.value) {
      reportDateInput.classList.add('error');
      hasErrors = true;
    } else {
      reportDateInput.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    dateReported = undefined;
    reportTime = undefined;
    reportBy = undefined;
    reportMethod = undefined;
    reportTo = undefined;
    reportingCategoryId = undefined;
    reportNotes = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    console.table(formData);
    if (formData) {
      dateReported = formData.dateReported;
      reportTime = formData.timeReported; // todo
      reportBy = formData.reportBy;
      reportMethod = formData.reportMethod;
      reportTo = formData.reportTo;
      reportingCategoryId = formData.reportingCategoryID;
      reportNotes = formData.notes;
    }
  }
  // events
  function setupFormEvents() {
    var tmpReportingCategoryId;
    var tmpReportedBy;
    var tmpReportedTo;
    var tmpReportMethod;
    var tmpReportDate;
    var tmpReportTime;
    var tmpNote;

    reportingCategoryDropdown.addEventListener('change', e => {
      tmpReportingCategoryId = e.target.value;
      checkRequiredFields();
    });
    reportedByInput.addEventListener('change', e => {
      tmpReportedBy = e.target.value;
    });
    reportedToInput.addEventListener('change', e => {
      tmpReportedTo = e.target.value;
    });
    reportMethodInput.addEventListener('change', e => {
      tmpReportMethod = e.target.value;
    });
    reportDateInput.addEventListener('change', e => {
      tmpReportDate = e.target.value;
      checkRequiredFields();
    });
    reportTimeInput.addEventListener('change', e => {
      tmpReportTime = e.target.value;
    });
    reportNotesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!reportingData[selectedConsumerId]) {
          reportingData[selectedConsumerId] = {};
        }

        if (!reportingData[selectedConsumerId][selectedReportId]) {
          var keys = Object.keys(reportingData[selectedConsumerId]);
          selectedReportId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          reportingData[selectedConsumerId][selectedReportId] = {
            reportingCategoryID: '',
            reportBy: '',
            reportTo: '',
            reportMethod: '',
            dateReported: '',
            notes: '',
            updated: '',
          };
        }

        if (
          tmpReportingCategoryId ||
          tmpReportedBy ||
          tmpReportedTo ||
          tmpReportMethod ||
          tmpReportDate ||
          tmpReportTime ||
          tmpNote
        ) {
          reportingData[selectedConsumerId][selectedReportId].updated = true;
        }

        if (tmpReportingCategoryId)
          reportingData[selectedConsumerId][selectedReportId].reportingCategoryID = tmpReportingCategoryId;
        if (tmpReportedBy) reportingData[selectedConsumerId][selectedReportId].reportBy = tmpReportedBy;
        if (tmpReportedTo) reportingData[selectedConsumerId][selectedReportId].reportTo = tmpReportedTo;
        if (tmpReportMethod) reportingData[selectedConsumerId][selectedReportId].reportMethod = tmpReportMethod;
        if (tmpReportDate) reportingData[selectedConsumerId][selectedReportId].dateReported = tmpReportDate;
        if (tmpReportTime) reportingData[selectedConsumerId][selectedReportId].timeReported = tmpReportTime;
        if (tmpNote) reportingData[selectedConsumerId][selectedReportId].notes = tmpNote;

        selectedReportId = undefined;

        var form = section.querySelector('.reportForm');
        section.removeChild(form);
        reportingHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedReportId = undefined;
        var form = section.querySelector('.reportForm');
        section.removeChild(form);
        reportingHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildReportingCategoryDropdown() {
    var opts = {
      label: 'Reporting To Category',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rCatDrop = dropdown.build(opts);

    var data = reportingCategories.map(cat => {
      return {
        value: cat.itReportingCategoryId,
        text: cat.itReportingCategoryName,
      };
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(rCatDrop, data, reportingCategoryId);

    return rCatDrop;
  }
  function buildReportedByInput() {
    var opts = {
      label: 'Reported By',
      type: 'text',
      style: 'secondary',
      value: reportBy,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rbInput = input.build(opts);

    return rbInput;
  }
  function buildReportedToInput() {
    var opts = {
      label: 'Reported To',
      type: 'text',
      style: 'secondary',
      value: reportTo,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rtInput = input.build(opts);

    return rtInput;
  }
  function buildReportMethodInput() {
    var opts = {
      label: 'Report Method',
      type: 'text',
      style: 'secondary',
      value: reportMethod,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rmInput = input.build(opts);

    return rmInput;
  }
  function buildReportedDateInput() {
    var opts = {
      label: 'Date Reported',
      type: 'date',
      style: 'secondary',
      value: dateReported,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rdInput = input.build(opts);

    return rdInput;
  }
  function buildReportedTimeInput() {
    var opts = {
      label: 'Reported Time',
      type: 'time',
      style: 'secondary',
      value: reportTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rtInput = input.build(opts);

    return rtInput;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
      value: reportNotes,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var nInput = input.build(opts);

    return nInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewReportingForm() {
    var form = document.createElement('div');
    form.classList.add('reportForm');

    reportingCategoryDropdown = buildReportingCategoryDropdown();
    reportedByInput = buildReportedByInput();
    reportedToInput = buildReportedToInput();
    reportMethodInput = buildReportMethodInput();
    reportDateInput = buildReportedDateInput();
    reportTimeInput = buildReportedTimeInput();
    reportNotesInput = buildNotesInput();
    formButtons = buildFormBtns();

    form.addEventListener('change', () => incidentCard.checkEntireIncidentCardforErrors());

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(reportingCategoryDropdown);
    form.appendChild(reportedByInput);
    form.appendChild(reportedToInput);
    form.appendChild(reportMethodInput);
    form.appendChild(reportDateInput);
    form.appendChild(reportTimeInput);
    form.appendChild(reportNotesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    reportingHome.classList.add('hidden');

    var reportingForm = buildNewReportingForm();
    section.appendChild(reportingForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = reportingReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!reportingData) return;
    if (!reportingData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(reportingData[selectedConsumerId]);
    keys.forEach(key => {
      var data = reportingData[selectedConsumerId][key];
      var filteredCategories = reportingCategories.filter(
        rCat => rCat.itReportingCategoryId === data.reportingCategoryID,
      );
      var reportedCategory = filteredCategories[0].itReportingCategoryName;
      var date = data.dateReported ? data.dateReported.split(' ')[0] : '';
      date = date ? UTIL.formatDateFromIso(date) : date;
      var reportBy = data.reportBy;

      tableData.push({
        id: key,
        values: [reportedCategory, date, reportBy],
      });
    });

    table.populate(reportingReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerReportingTable',
      columnHeadings: ['Reporting Category', 'Date Reported', 'Reported By'],
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedReportId = event.target.id;
        setFormDataDefaults(reportingData[selectedConsumerId][selectedReportId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    reportingData = {};
    reportingDeleteData = {};
    getDropdownData();
  }
  function buildAddNewFollowUpBtn() {
    var btn = button.build({
      text: 'Add New Reporting',
      type: 'contained',
      style: 'secondary',
    });

    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'reportingSection');

    reportingHome = document.createElement('div');
    reportingHome.classList.add('consumerSections__section__home');

    newReportingBtn = buildAddNewFollowUpBtn();
    reportingReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) reportingHome.appendChild(newReportingBtn);
    reportingHome.appendChild(reportingReviewTable);

    section.appendChild(reportingHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!reportingData[selectedConsumerId]) {
          reportingData[selectedConsumerId] = {};
        }

        if (!reportingData[selectedConsumerId][d.itConsumerReportId]) {
          reportingData[selectedConsumerId][d.itConsumerReportId] = d;
          reportingData[selectedConsumerId][d.itConsumerReportId].updated = false;

          // format dates
          if (reportingData[selectedConsumerId][d.itConsumerReportId].dateReported) {
            var dateReported = reportingData[selectedConsumerId][d.itConsumerReportId].dateReported.split(' ')[0];
            reportingData[selectedConsumerId][d.itConsumerReportId].dateReported = UTIL.formatDateToIso(dateReported);
          }
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
var consumerReview = (function () {
  // DOM
  //---------------------
  var section;
  var reviewsHome;
  var newReviewBtn;
  var reviewsReviewTable;
  //*form
  var reviewDateInput;
  var reviewedByDropdown;
  var notesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var reviewData;
  var reviewDeleteData;
  var reviewedByDropdownData;
  // Values
  //---------------------
  var selectedConsumerId;
  var selectedReviewId;
  //*form values
  var reviewedDate;
  var reviewedById;
  var reviewNotes;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;

  function getDataForSave() {
    return reviewData;
  }
  function getDataForDelete() {
    return reviewDeleteData;
  }
  function clearData() {
    reviewData = undefined;
    reviewDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedReviewId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    if (reviewData[consumerId]) {
      var { [consumerId]: removedConsumer, ...newReviewData } = reviewData;
      reviewData = newReviewData;

      if (!reviewDeleteData[consumerId]) {
        reviewDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerReviewData() {
    if (!selectedReviewId.includes('new')) {
      var deletedReview = reviewData[selectedConsumerId][selectedReviewId];
      if (!reviewDeleteData[selectedConsumerId]) reviewDeleteData[selectedConsumerId] = {};
      reviewDeleteData[selectedConsumerId][selectedReviewId] = deletedReview;
    }

    delete reviewData[selectedConsumerId][selectedReviewId];

    selectedReviewId = undefined;
    var form = section.querySelector('.reviewForm');
    section.removeChild(form);
    reviewsHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }

  function getDropdownData() {
    incidentTrackingAjax.getReviewedByDropdown(function (res) {
      reviewedByDropdownData = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerReviewData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var dateInput = reviewDateInput.querySelector('input');
    if (!dateInput.value) {
      reviewDateInput.classList.add('error');
      hasErrors = true;
    } else {
      reviewDateInput.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    reviewedDate = undefined;
    reviewedById = undefined;
    reviewNotes = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      reviewedDate = formData.reviewedDate;
      reviewedById = formData.reviewedBy;
      reviewNotes = formData.notes;
    }
  }
  // events
  function setupFormEvents() {
    var tmpReviewDate;
    var tmpReviewedBy;
    var tmpNote;

    reviewDateInput.addEventListener('change', e => {
      tmpReviewDate = e.target.value;
      checkRequiredFields();
    });
    reviewedByDropdown.addEventListener('change', e => {
      tmpReviewedBy = e.target.value;
    });
    notesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!reviewData[selectedConsumerId]) {
          reviewData[selectedConsumerId] = {};
        }

        if (!reviewData[selectedConsumerId][selectedReviewId]) {
          var keys = Object.keys(reviewData[selectedConsumerId]);
          selectedReviewId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          reviewData[selectedConsumerId][selectedReviewId] = {
            reviewedDate: '',
            reviewedBy: '',
            notes: '',
            updated: '',
          };
        }

        if (tmpReviewDate || tmpReviewedBy || tmpNote) {
          reviewData[selectedConsumerId][selectedReviewId].updated = true;
        }

        if (tmpReviewDate) {
          reviewData[selectedConsumerId][selectedReviewId].reviewedDate = tmpReviewDate;
        }

        if (tmpReviewedBy) {
          reviewData[selectedConsumerId][selectedReviewId].reviewedBy = tmpReviewedBy;
        }
        const currentReviewedBy = reviewData[selectedConsumerId][selectedReviewId].reviewedBy;
        if ($.session.incidentTrackingReviewedBy && (!currentReviewedBy || currentReviewedBy === '')) {
          reviewData[selectedConsumerId][selectedReviewId].reviewedBy = $.session.PeopleId;
        }

        if (tmpNote) {
          reviewData[selectedConsumerId][selectedReviewId].notes = tmpNote;
        }

        selectedReviewId = undefined;

        var form = section.querySelector('.reviewForm');
        section.removeChild(form);
        reviewsHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedReviewId = undefined;
        var form = section.querySelector('.reviewForm');
        section.removeChild(form);
        reviewsHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildReviewDateInput() {
    var opts = {
      label: 'Review Date',
      type: 'date',
      style: 'secondary',
      value: reviewedDate,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var dateInput = input.build(opts);

    return dateInput;
  }
  function buildReviewedByDropdown() {
    var opts = {
      label: 'Reviewed By',
      style: 'secondary',
      classNames: 'reviewedBy',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rbDrop = dropdown.build(opts);

    var data = reviewedByDropdownData.map(rb => {
      return {
        value: rb.employeeId,
        text: rb.employeeName,
      };
    });

    data.unshift({ value: '%', text: '' });

    if (!$.session.incidentTrackingReviewedBy) {
      dropdown.populate(rbDrop, data, reviewedById);
    } else {
      if (isEdit) {
        dropdown.populate(rbDrop, data, reviewedById);
      } else {
        dropdown.populate(rbDrop, data, $.session.PeopleId);
      }

      input.disableInputField(rbDrop);
    }

    return rbDrop;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
      value: reviewNotes,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var nInput = input.build(opts);

    return nInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewReviewForm() {
    var form = document.createElement('div');
    form.classList.add('reviewForm');

    reviewDateInput = buildReviewDateInput();
    reviewedByDropdown = buildReviewedByDropdown();
    notesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(reviewDateInput);
    form.appendChild(reviewedByDropdown);
    form.appendChild(notesInput);
    form.appendChild(formButtons);

    form.addEventListener('change', () => incidentCard.checkEntireIncidentCardforErrors());

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    reviewsHome.classList.add('hidden');

    var reviewForm = buildNewReviewForm();
    section.appendChild(reviewForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = reviewsReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!reviewData) return;
    if (!reviewData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(reviewData[selectedConsumerId]);
    keys.forEach(key => {
      var data = reviewData[selectedConsumerId][key];

      var reviewedBy = reviewedByDropdownData.find(d => d.employeeId === data.reviewedBy);
      reviewedBy = reviewedBy ? reviewedBy.employeeName : '';
      var dateReviewed = UTIL.formatDateFromIso(data.reviewedDate);

      tableData.push({
        id: key,
        values: [reviewedBy, dateReviewed],
      });
    });

    table.populate(reviewsReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerReviewTable',
      columnHeadings: ['Reviewed By', 'Date Reviewed'],
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedReviewId = event.target.id;
        setFormDataDefaults(reviewData[selectedConsumerId][selectedReviewId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    reviewData = {};
    reviewDeleteData = {};
    getDropdownData();
  }
  function buildAddNewReviewBtn() {
    var btn = button.build({
      text: 'Add New Review',
      type: 'contained',
      style: 'secondary',
    });

    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'reviewSection');

    reviewsHome = document.createElement('div');
    reviewsHome.classList.add('consumerSections__section__home');

    newReviewBtn = buildAddNewReviewBtn();
    reviewsReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) reviewsHome.appendChild(newReviewBtn);
    reviewsHome.appendChild(reviewsReviewTable);

    section.appendChild(reviewsHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!reviewData[selectedConsumerId]) {
          reviewData[selectedConsumerId] = {};
        }

        if (!reviewData[selectedConsumerId][d.itConsumerReviewId]) {
          reviewData[selectedConsumerId][d.itConsumerReviewId] = d;
          reviewData[selectedConsumerId][d.itConsumerReviewId].updated = false;

          // format dates
          if (reviewData[selectedConsumerId][d.itConsumerReviewId].reviewedDate) {
            var reviewDate = reviewData[selectedConsumerId][d.itConsumerReviewId].reviewedDate.split(' ')[0];
            reviewData[selectedConsumerId][d.itConsumerReviewId].reviewedDate = UTIL.formatDateToIso(reviewDate);
          }
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
const consumerBehavior = (function () {
  // DOM
  //---------------------
  let section;
  let behaviorHome;
  let newBehaviorBtn;
  let behaviorReviewTable;
  //*form
  let behaviorTypeDropdown;
  let startTimeInput;
  let endTimeInput;
  let occurrencesInput;
  let formButtons;
  let deleteBtn;
  let saveBtn;
  let cancelBtn;
  // DATA
  //---------------------
  let behaviorData; // save/update data
  let behaviorDeleteData;
  let behaviorTypes; // dropdown data
  // Values
  //---------------------
  let selectedConsumerId;
  let selectedBehaviorId;
  //*form default values
  let behaviorType;
  let behaviorTypeId;
  let startTime;
  let endTime;
  let occurrences;

  let isEdit;
  let formReadOnly;

  function getDataForSave() {
    return behaviorData;
  }
  function getDataForDelete() {
    return behaviorDeleteData;
  }
  function clearData() {
    behaviorData = undefined;
    behaviorDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedBehaviorId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    // deletes all follow ups
    if (behaviorData[consumerId]) {
      var { [consumerId]: removedConsumerData, ...newBehaviorData } = behaviorData;
      behaviorData = newBehaviorData;

      if (!behaviorDeleteData[consumerId]) {
        behaviorDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerBehaviorData() {
    if (!selectedBehaviorId.includes('new')) {
      var deletedBehavior = behaviorData[selectedConsumerId][selectedBehaviorId];
      if (!behaviorDeleteData[selectedConsumerId]) behaviorDeleteData[selectedConsumerId] = {};
      behaviorDeleteData[selectedConsumerId][selectedBehaviorId] = deletedBehavior;
    }

    delete behaviorData[selectedConsumerId][selectedBehaviorId];

    selectedBehaviorId = undefined;
    var form = section.querySelector('.behaviorForm');
    section.removeChild(form);
    behaviorHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }
  function formatTime(dirtyTime) {
    dirtyTime.replace('-', '');
    const splitTime = dirtyTime.split(':');
    const hours = splitTime[0].length === 1 ? `0${splitTime[0]}` : splitTime[0];
    const minutes = splitTime[1].length === 1 ? `0${splitTime[1]}` : splitTime[1];
    return `${hours}:${minutes}`;
  }
  function getTimeLength(start, end) {
    if (!start || !end) return '';
    if (start.includes('/')) {
      start = start.split(' ')[1];
    }
    let totalTime = UTIL.calculateTotalHours(start, end, 'hh:mm');
    totalTime = formatTime(totalTime);
    return totalTime;
  }
  function parseStartTime(dirtyStart) {
    const splittime = dirtyStart.split(' ');
    const time = `${splittime[1]} ${splittime[2]}`;
    return UTIL.convertToMilitary(time);
  }

  function getDropdownData() {
    incidentTrackingAjax.getitConsumerBehaviorTypes(function (res) {
      behaviorTypes = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        deleteConsumerBehaviorData();
        POPUP.hide(deleteWarningPopup);
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });
    var noBtn = button.build({
      text: 'No',
      type: 'contained',
      style: 'secondary',
      callback: () => {
        POPUP.hide(deleteWarningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);

    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = [].slice.call(section.querySelectorAll('.error:not(button)'));

    if (hasErrors.length === 0) {
      saveBtn.classList.remove('disabled');
    } else {
      saveBtn.classList.add('disabled');
    }
  }
  function clearFormDataDefaults() {
    behaviorType = undefined;
    behaviorTypeId = undefined;
    startTime = undefined;
    endTime = undefined;
    occurrences = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      behaviorType = formData.behaviorType;
      behaviorTypeId = formData.behaviorTypeId;
      startTime = formData.startTime;
      endTime = formData.endTime;
      occurrences = formData.occurrences;
    }
  }
  // events
  function setupFormEvents() {
    let tmpBehaviorTypeId = null;
    let tmpStartTime = null;
    let tmpEndTime = null;
    let tmpOccurrences = null;

    behaviorTypeDropdown.addEventListener('change', e => {
      if (!e.target.value || e.target.value === '%') {
        behaviorTypeDropdown.classList.add('error');
      } else {
        behaviorTypeDropdown.classList.remove('error');
      }

      tmpBehaviorTypeId = e.target.value;
      checkRequiredFields();
    });
    startTimeInput.addEventListener('change', e => {
      tmpStartTime = e.target.value;
    });
    endTimeInput.addEventListener('change', e => {
      tmpEndTime = e.target.value;
    });
    occurrencesInput.addEventListener('keyup', e => {
      if (e.target.value < 0 || e.target.value.includes('-')) {
        occurrencesInput.classList.add('error');
      } else {
        occurrencesInput.classList.remove('error');
      }
      checkRequiredFields();
    });
    occurrencesInput.addEventListener('change', e => {
      tmpOccurrences = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }

    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (e.target.classList.contains('disabled')) return;

        if (!behaviorData[selectedConsumerId]) {
          behaviorData[selectedConsumerId] = {};
        }

        if (!behaviorData[selectedConsumerId][selectedBehaviorId]) {
          var keys = Object.keys(behaviorData[selectedConsumerId]);
          selectedBehaviorId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          behaviorData[selectedConsumerId][selectedBehaviorId] = {
            behaviorTypeId: '',
            startTime: '',
            endTime: '',
            occurrences: '',
            updated: '',
          };
        }

        if (tmpBehaviorTypeId !== null || tmpStartTime !== null || tmpEndTime !== null || tmpOccurrences !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].updated = true;
        }

        if (tmpBehaviorTypeId !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].behaviorTypeId = tmpBehaviorTypeId;
        }
        if (tmpStartTime !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].startTime = tmpStartTime;
        }
        if (tmpEndTime !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].endTime = tmpEndTime;
        }
        if (tmpOccurrences !== null) {
          behaviorData[selectedConsumerId][selectedBehaviorId].occurrences = tmpOccurrences;
        }

        selectedBehaviorId = undefined;

        var form = section.querySelector('.behaviorForm');
        section.removeChild(form);
        behaviorHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      if (e.target === cancelBtn) {
        selectedBehaviorId = undefined;
        var form = section.querySelector('.behaviorForm');
        section.removeChild(form);
        behaviorHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildBehaviorTypeDropdown() {
    var opts = {
      label: 'Behavior Type',
      style: 'secondary',
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var behaviortypeDrop = dropdown.build(opts);

    var data = behaviorTypes.map(fu => {
      return {
        value: fu.itBehaviorTypeId,
        text: fu.behaviorTypeName,
      };
    });

    data.sort((a, b) => {
      return a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1;
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(behaviortypeDrop, data, behaviorTypeId);

    if (!behaviorTypeId || behaviorTypeId === '%') {
      behaviortypeDrop.classList.add('error');
    } else {
      behaviortypeDrop.classList.remove('error');
    }

    return behaviortypeDrop;
  }
  function buildStartTimeInput() {
    var opts = {
      label: 'Start Time',
      type: 'time',
      style: 'secondary',
      value: startTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var startTimeInput = input.build(opts);

    return startTimeInput;
  }
  function buildEndTimeInput() {
    var opts = {
      label: 'End Time',
      type: 'time',
      style: 'secondary',
      value: endTime,
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var endTimeInput = input.build(opts);

    return endTimeInput;
  }
  function buildOccurrencesInput() {
    var opts = {
      label: 'No. of Occurrences',
      type: 'number',
      style: 'secondary',
      value: occurrences,
      attributes: [
        {
          key: 'min',
          value: 1,
        },
        {
          key: 'step',
          value: 1,
        },
      ],
    };

    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var occurrencesInput = input.build(opts);

    return occurrencesInput;
  }

  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
      classNames: 'disabled',
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary',
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error',
    });

    return btn;
  }
  function buildNewBehaviorForm() {
    let form = document.createElement('div');
    form.classList.add('behaviorForm');

    behaviorTypeDropdown = buildBehaviorTypeDropdown();
    startTimeInput = buildStartTimeInput();
    endTimeInput = buildEndTimeInput();
    occurrencesInput = buildOccurrencesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }

    form.appendChild(behaviorTypeDropdown);
    form.appendChild(startTimeInput);
    form.appendChild(endTimeInput);
    form.appendChild(occurrencesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();

    behaviorHome.classList.add('hidden');

    behaviorForm = buildNewBehaviorForm();
    section.appendChild(behaviorForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = behaviorReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!behaviorData) return;
    if (!behaviorData[selectedConsumerId]) return;

    let tableData = [];

    let keys = Object.keys(behaviorData[selectedConsumerId]);
    keys.forEach(key => {
      let behaviorDATA = behaviorData[selectedConsumerId][key];

      let filterBehaviorTypes = behaviorTypes.filter(type => type.itBehaviorTypeId === behaviorDATA.behaviorTypeId);
      let behaviorType = filterBehaviorTypes[0] ? filterBehaviorTypes[0].behaviorTypeName : '';
      let timeLength = getTimeLength(behaviorDATA.startTime, behaviorDATA.endTime);
      let occurrencesNum = behaviorDATA.occurrences;

      tableData.push({
        id: key,
        values: [behaviorType, timeLength, occurrencesNum],
      });
    });

    table.populate(behaviorReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerBehaviorTable',
      columnHeadings: ['Behavior Type', 'Time Length', 'Occurrences'],
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedBehaviorId = event.target.id;
        setFormDataDefaults(behaviorData[selectedConsumerId][selectedBehaviorId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;

    behaviorData = {};
    behaviorDeleteData = {};
    getDropdownData();
  }
  function buildAddNewBehaviorBtn() {
    var btn = button.build({
      text: 'Add New Behavior Detail',
      type: 'contained',
      style: 'secondary',
    });
    btn.addEventListener('click', () => {
      showForm(false);
    });

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'behaviorSection');

    behaviorHome = document.createElement('div');
    behaviorHome.classList.add('consumerSections__section__home');

    newBehaviorBtn = buildAddNewBehaviorBtn();
    behaviorReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) behaviorHome.appendChild(newBehaviorBtn);
    behaviorHome.appendChild(behaviorReviewTable);

    section.appendChild(behaviorHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!behaviorData[selectedConsumerId]) {
          behaviorData[selectedConsumerId] = {};
        }

        if (!behaviorData[selectedConsumerId][d.itConsumerBehaviorId]) {
          behaviorData[selectedConsumerId][d.itConsumerBehaviorId] = d;
          behaviorData[selectedConsumerId][d.itConsumerBehaviorId].updated = false;
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete,
  };
})();
