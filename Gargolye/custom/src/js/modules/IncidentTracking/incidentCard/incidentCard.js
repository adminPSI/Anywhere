var incidentCard = (function () {
  // DOM
  //---------------------
  var incidentCard;
  //*sections
  var consumersSection;
  var detailsSection;
  var employeeSection;
  var peopleSection;
  //*nav buttons
  var nextBtn;
  var prevBtn;
  //*action buttons
  var cardActionBtns;
  var saveBtn;
  var deleteBtn;
  var cancelBtn;
  // DATA
  //---------------------
  var sections = [
    'Consumers Involved',
    'Incident Details',
    'Employees Involved',
    'People Involved',
  ];
  var itConsumerInvolved;
  var itReviewData;
  var itEmployeesInvolved;
  var itOthersInvolved;
  // Values
  //---------------------
  var isNewIncident;
  var currentSectionNumber;

  function toggleSaveBtnStatus(disableBtn) {
    if (disableBtn) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function toggleActionBtns(hide) {
    if (hide) {
      cardActionBtns.classList.add('hidden');
    } else {
      cardActionBtns.classList.remove('hidden');
    }
  }
  function toggleNavBtns() {
    if (currentSectionNumber === 3) {
      // disable next btn
      nextBtn.classList.remove('visible');
    } else {
      nextBtn.classList.add('visible');
    }
    if (currentSectionNumber === 0) {
      // disable prev btn
      prevBtn.classList.remove('visible');
    } else {
      prevBtn.classList.add('visible');
    }
  }
  function showSection(e) {
    if (e.target === nextBtn) currentSectionNumber++;
    if (e.target === prevBtn) currentSectionNumber--;

    var currentlyVisibleSection = incidentCard.querySelector('.incidentSection.visible');
    var targetSectionSelector = `[data-page-num="${currentSectionNumber}"]`;
    var targetSection = incidentCard.querySelector(targetSectionSelector);

    currentlyVisibleSection.classList.remove('visible');
    targetSection.classList.add('visible');

    var nextSectionName = sections[currentSectionNumber + 1];
    nextBtn.innerHTML = nextSectionName ? nextSectionName : '';

    DOM.autosizeTextarea();

    toggleNavBtns();
  }

  function buildNav() {
    currentSectionNumber = 0;

    var nav = document.createElement('div');
    nav.classList.add('incidentCard__nav');

    nextBtn = button.build({
      text: sections[currentSectionNumber + 1],
      style: 'secondary',
      type: 'text',
      classNames: ['nextBtn', 'visible'],
      callback: showSection,
    });
    prevBtn = button.build({
      text: 'prev',
      style: 'secondary',
      type: 'text',
      classNames: 'prevBtn',
      callback: showSection,
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);

    return nav;
  }
  function buildActionBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap', 'incidentCard__actionBtns');

    saveBtn = button.build({
      text: isNewIncident ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: ['incidentSave', 'disabled'],
      callback: function () {
        saveBtn.classList.add('disabled');
        incident.save(isNewIncident);
      },
    });
    deleteBtn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'contained',
      callback: incident.delete,
    });
    cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: incident.cancel,
    });

    if ($.session.incidentTrackingUpdate || $.session.incidentTrackingInsert) {
      btnWrap.appendChild(saveBtn);
    }
    if (!isNewIncident && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      btnWrap.appendChild(deleteBtn);
    }
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildSections() {
    var wrap = document.createElement('div');
    wrap.classList.add('incidentCard__sections');

    consumersSection = itConsumerSection.build({ pageNumber: '0' }, itConsumerInvolved);
    detailsSection = itDetailsSection.build({ pageNumber: '1' }, itReviewData);
    employeeSection = itEmployeeSection.build({ pageNumber: '2' }, itEmployeesInvolved);
    peopleSection = itPeopleSection.build({ pageNumber: '3' }, itOthersInvolved);

    wrap.appendChild(consumersSection);
    wrap.appendChild(detailsSection);
    wrap.appendChild(employeeSection);
    wrap.appendChild(peopleSection);

    return wrap;
  }

  function buildCard(data) {
    if (!data) {
      isNewIncident = true;
      reviewData = undefined;
      itConsumerInvolved = undefined;
      itReviewData = undefined;
      itEmployeesInvolved = undefined;
      itOthersInvolved = undefined;
    } else {
      isNewIncident = false;
      reviewData = data;
      itConsumerInvolved = reviewData.itConsumerInvolved;
      itReviewData = reviewData.itReviewData;
      itEmployeesInvolved = reviewData.itEmployeesInvolved;
      itOthersInvolved = reviewData.itOthersInvolved;
    }

    incidentCard = document.createElement('div');
    incidentCard.classList.add('incidentCard');

    var cardNav = buildNav();
    cardActionBtns = buildActionBtns();
    var cardSections = buildSections();

    incidentCard.appendChild(cardNav);
    incidentCard.appendChild(cardSections);
    incidentCard.appendChild(cardActionBtns);

    var consumerSectionHasError = checkforRequiredConsumer();
    toggleSaveBtnStatus(consumerSectionHasError);

    return incidentCard;
  }

  function checkforRequiredConsumer() {
    // number of selected Consumers with an error ; length = 0 on initial display
    var selectedErroredConsumers = [].slice.call(
      document.querySelectorAll('.consumersWrap .consumerCard.error'),
    );
    // hasNoErrors = 0 means the "Select a Consumer" message is displayed
    var hasNoErrors = document.getElementsByClassName('consumerError hidden');

    if (hasNoErrors.length === 0) return true;

    if (selectedErroredConsumers.length === 0 || itConsumerInvolved) {
      return false; // false means don't disable the Save BTN
    } else {
      return true; // true means do disable the Save BTN
    }
  }
  function checkEntireIncidentCardforErrors() {
    var detailSectionHasErrors = itDetailsSection.checkRequiredFields();
    var peopleSectionHasErrors = itPeopleSection.checkRequiredFields();
    var consumerSectionHasErrors = checkforRequiredConsumer();

    if (detailSectionHasErrors || peopleSectionHasErrors || consumerSectionHasErrors) {
      toggleSaveBtnStatus(true);
    } else {
      toggleSaveBtnStatus(false);
    }
  }

  return {
    build: buildCard,
    toggleSave: toggleSaveBtnStatus,
    checkforRequiredConsumer,
    checkEntireIncidentCardforErrors,
    toggleActionBtns,
  };
})();
