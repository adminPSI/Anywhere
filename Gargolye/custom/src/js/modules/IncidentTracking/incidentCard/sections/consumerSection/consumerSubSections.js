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
        // case 'Behavior Details': {
        //   incidentTrackingAjax.getitConsumerBehavior(selectedConsumerId, incidentId, res => {
        //     console.log(res);
        //     consumerBehavior.populate(res, selectedConsumerId);
        //   });
        //   break;
        // }
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
        // case 'Behavior Details': {
        //   consumerBehavior.populate(null, selectedConsumerId);
        //   break;
        // }
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
    // behaviorSection = consumerBehavior.build();

    sectionsInner.appendChild(sectionsMenu);
    // sectionsInner.appendChild(behaviorSection);
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
