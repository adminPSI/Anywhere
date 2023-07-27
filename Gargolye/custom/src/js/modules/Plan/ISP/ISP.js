const ISP = (function () {
  let ispData;
  let planId;
  let ispDiv;
  let ispNav;
  let ispBody;
  let readOnly;
  let validationCheck;

  const sections = [
    {
      title: 'Summary',
      id: 0,
      markup: () => planSummary.getMarkup(),
    },
    {
      title: 'Outcomes',
      id: 1,
      markup: () => planOutcomes.getMarkup(),
    },
    {
      title: 'Services',
      id: 2,
      markup: () => servicesSupports.getMarkup(),
    },
    {
      title: 'Restrictive Measures',
      id: 3,
      markup: () => planRestrictiveMeasures.getMarkup(),
    },
    {
      title: 'Sign / Consent',
      id: 4,
      markup: () => planConsentAndSign.getMarkup(),
    },
    {
      title: 'Contacts',
      id: 5,
      markup: () => contactInformation.getSectionMarkup(),
    },
    {
      title: 'Introduction',
      id: 6,
      markup: () => planIntroduction.getMarkup(),
    },
  ];

  // Utils
  //---------------------------------------------
  async function getInitialData() {
    ispData = {};

    ispData.servicesSupports = await servicesSupportsAjax.getServicesAndSupports({
      token: $.session.Token,
      anywAssessmentId: planId,
    });
  }
  async function refreshISP(planID) {
    planId = planID;

    const ispWrap = document.getElementById('planISP');

    const loadingBar = PROGRESS.SPINNER.get('Loading ISP...');
    ispWrap.innerHTML = '';
    ispWrap.appendChild(loadingBar);

    const newIspMarkup = await getMarkup();

    ispWrap.innerHTML = '';
    ispWrap.appendChild(newIspMarkup);

    DOM.autosizeTextarea();
  }
  function toggleActiveNavItem(selectedNavItem) {
    const activeNavItem = ispNav.querySelector('.active');

    if (activeNavItem) {
      activeNavItem.classList.remove('active');
    }

    selectedNavItem.classList.add('active');
  }
  function toggleActiveSection(sectionId) {
    const activeSection = ispBody.querySelector('.active');
    const targetSection = ispBody.querySelector(`[data-section-id="${sectionId}"]`);

    if (activeSection) {
      activeSection.classList.remove('active');
    }

    targetSection.classList.add('active');
  }
  function showDeleteWarning(popup, message, callback) {
    popup.classList.add('deleteActive');

    const deleteWarning = document.createElement('div');
    deleteWarning.classList.add('deleteWarning');

    const warningMessage = document.createElement('p');
    warningMessage.innerHTML = `${message}`;

    const yesBtn = button.build({
      text: 'Yes',
      style: 'danger',
      type: 'contained',
      callback: async () => {
        popup.removeChild(deleteWarning);
        popup.classList.remove('deleteActive');
        popup.style.overflow = 'auto';
        callback();
        POPUP.hide(popup);
      },
    });
    const noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        popup.removeChild(deleteWarning);
        popup.classList.remove('deleteActive');
        popup.style.overflow = 'auto';
      },
    });
    const closeWarningBtn = button.build({
      type: 'text',
      style: 'secondary',
      icon: 'close',
      classNames: 'closeWarningBtn',
      callback: function () {
        popup.removeChild(deleteWarning);
        popup.classList.remove('deleteActive');
        popup.style.overflow = 'auto';
        POPUP.hide(popup);
      },
    });

    // popup.style.overflow = 'hidden';
    deleteWarning.appendChild(closeWarningBtn);
    deleteWarning.appendChild(warningMessage);
    deleteWarning.appendChild(yesBtn);
    deleteWarning.appendChild(noBtn);

    popup.appendChild(deleteWarning);
  }

  // Markup
  //---------------------------------------------
  function buildNavigation() {
    const nav = document.createElement('div');
    nav.classList.add('planISP__nav');

    sections.forEach(async (section, index) => {
      const sectionId = section.id;

      const navItem = document.createElement('div');
      navItem.classList.add('planISP__navItem');
      navItem.innerHTML = `${section.title}`;

      // if the section is 'Outcomes' run an initial validation check on the section
      if (section.title === 'Outcomes') {
        const outcomesAlertDiv = document.createElement('div');
        outcomesAlertDiv.classList.add('outcomesAlertDiv');
        outcomesAlertDiv.id = 'outcomesAlert';
        outcomesAlertDiv.innerHTML = `${icons.error}`;
        navItem.appendChild(outcomesAlertDiv);
        outcomesAlertDiv.style.display = 'none';

        // creates and shows a tip when hovering over the visible alert div
        planValidation.createTooltip(
          'There is data missing on this tab that is required by DODD',
          outcomesAlertDiv,
        );

        // If a plan returns an error on the validation check, show the alert div
        if (validationCheck.complete === false) {
          outcomesAlertDiv.style.display = 'flex';
        }
      }

      if (index === 0) {
        navItem.classList.add('active');
      }

      navItem.addEventListener('click', e => {
        toggleActiveNavItem(navItem);
        toggleActiveSection(sectionId);
        DOM.autosizeTextarea();
      });

      nav.appendChild(navItem);
    });

    return nav;
  }
  async function buildBody() {
    const body = document.createElement('div');
    body.classList.add('planISP__body');

    // refresh data for relationships in dropdown data
    planData.refreshDropdownData();

    await getInitialData();

    servicesSupports.init({ planId, readOnly, data: ispData.servicesSupports });

    // eventually remove await and place data GET into getInitialData()
    await planSummary.init({ planId, readOnly });
    await planOutcomes.init({ planId, readOnly });
    await planConsentAndSign.init({ planId, readOnly });
    await planRestrictiveMeasures.init({ planId, readOnly });
    await contactInformation.init(planId);
    await planIntroduction.init({ planId, readOnly });

    sections.forEach((section, index) => {
      const sectionId = section.id;
      const sectionMarkup = section.markup();
      sectionMarkup.setAttribute('data-section-id', sectionId);
      sectionMarkup.classList.add('planISP__section');

      if (index === 0) {
        sectionMarkup.classList.add('active');
      }

      body.appendChild(sectionMarkup);
    });

    return body;
  }

  async function getMarkup() {
    ispDiv = document.createElement('div');
    ispDiv.classList.add('planISP');

    const status = plan.getPlanStatus();
    const isPlanComplete = status === 'C' ? true : false;
    const isPlanActive = plan.getPlanActiveStatus();
    const hasUpdatePermission = $.session.planUpdate;
    if (!isPlanActive || isPlanComplete || !hasUpdatePermission) {
      readOnly = true;
      ispDiv.classList.add('readOnly');
    } else {
      readOnly = false;
    }

    validationCheck = plan.getISPValidation();
    planValidation.getAssessmentValidation(planId);

    ispNav = buildNavigation();
    ispDiv.appendChild(ispNav);

    ispBody = await buildBody();
    ispDiv.appendChild(ispBody);

    return ispDiv;
  }

  return {
    refreshISP,
    getMarkup,
    showDeleteWarning,
  };
})();
