const assessmentCard = (function () {
  // DOM
  let assessmentContainer;
  let assessmentMarkup;
  let assessmentNav;
  let tocMarkup;
  let tableOfContentsBtn;
  let saveBtn;
  let unansweredQuestionToggleBtn;
  // DATA
  let sectionData;
  let subsectionData;
  let questionSetData;
  let planId;
  let planStatus;
  let readOnly;

  // Utils
  //------------------------------------
  function clearData() {
    assessmentContainer = undefined;
    assessmentMarkup = undefined;
    assessmentNav = undefined;
    tocMarkup = undefined;
    tableOfContentsBtn = undefined;
    saveBtn = undefined;
    unansweredQuestionToggleBtn = undefined;

    sectionData = undefined;
    subsectionData = undefined;
    questionSetData = undefined;
    planId = undefined;
    planStatus = undefined;

    mainAssessment.clearData();
    tableOfContents.clearData();
  }
  async function refreshAssessmentCard(assessmentGeneralInfo) {
    const assessmentWrap = document.getElementById('planAssessment');

    const loadingBar = PROGRESS.SPINNER.get('Refreshing Assessment...');
    assessmentWrap.innerHTML = '';
    assessmentWrap.appendChild(loadingBar);

    // * Assessment Data below... When coming from dash widget planId isn't set yet
    // * use 'assessmentGeneralInfo.planId' if there is no 'planId'
    const assessmentData = await assessment.getAssessmentData(
      planId || assessmentGeneralInfo.planId,
    );
    let newAssessmentMarkup;
    if (assessmentGeneralInfo) {
      newAssessmentMarkup = await build(assessmentData, {
        ...assessmentGeneralInfo,
      });
    }

    assessmentWrap.innerHTML = '';
    assessmentWrap.appendChild(newAssessmentMarkup);

    mainAssessment.markUnansweredQuestions();
    tableOfContents.showUnansweredQuestionCount();
  }

  // Navigation Bar
  //------------------------------------
  async function handleNavbarEvents(e) {
    switch (e.target) {
      case tableOfContentsBtn: {
        tableOfContents.toggleVisibility();
        break;
      }
      case saveBtn: {
        const answersArray = mainAssessment.getAnswers();
        const success = await assessment.updateAnswers(answersArray);

        if (success !== undefined && success !== null && success !== 'error') {
          successfulSave.show();
          setTimeout(function () {
            successfulSave.hide();
          }, 1000);
        }
        break;
      }
      case unansweredQuestionToggleBtn: {
        const innerTextValue = unansweredQuestionToggleBtn.innerText.toLowerCase();
        if (innerTextValue === 'show unanswered') {
          unansweredQuestionToggleBtn.innerText = 'Show All';
          mainAssessment.toggleUnansweredQuestionFilter('hide');
        } else {
          unansweredQuestionToggleBtn.innerText = 'Show Unanswered';
          mainAssessment.toggleUnansweredQuestionFilter('show');
        }

        break;
      }
      default: {
        break;
      }
    }
  }
  function buildTopNavBar() {
    saveBtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      classNames: ['assessmentSaveBtn', 'assessmentNavBtn'],
      callback: handleNavbarEvents,
    });
    tableOfContentsBtn = button.build({
      text: 'T.O.C.',
      style: 'secondary',
      type: 'outlined',
      classNames: ['tableOfContentsBtn', 'assessmentNavBtn'],
      callback: handleNavbarEvents,
    });
    unansweredQuestionToggleBtn = button.build({
      text: 'Show Unanswered',
      style: 'secondary',
      type: 'outlined',
      classNames: ['unansweredQuestionToggleBtn', 'assessmentNavBtn'],
      callback: handleNavbarEvents,
    });

    const tocAlertDiv = document.createElement('div');
    tocAlertDiv.classList.add('tocAlertDiv');
    tocAlertDiv.id = 'tocAlertMobile';
    tableOfContentsBtn.appendChild(tocAlertDiv);
    tocAlertDiv.innerHTML = `${icons.error}`;

    // creates and shows a tip when hovering over the visible alert div
    // planValidation.createTooltip(
    //   'At least one section of the Assessment must be selected',
    //   tocAlertDiv,
    // );

    // if (assessmentValidationCheck.hasASectionApplicable === true) {
    //   tocAlertDiv.style.display = 'none';
    // }

    const navBar = document.createElement('div');
    navBar.classList.add('assessmentNavigation');

    navBar.appendChild(saveBtn);
    navBar.appendChild(tableOfContentsBtn);
    navBar.appendChild(unansweredQuestionToggleBtn);

    return navBar;
  }

  // Main
  //------------------------------------
  function addSections() {
    const sectionIdKeys = Object.keys(sectionData);
    sectionIdKeys.forEach((id, index) => {
      const { order, title, applicable } = sectionData[id];
      mainAssessment.addSection({ ...sectionData[id], id });
      tableOfContents.addSection({ order, title, id, index, applicable });
    });
  }
  function addSubSections() {
    const subsectionIdKeys = Object.keys(subsectionData);
    subsectionIdKeys.forEach(subsectionId => {
      const { order, title, sectionId } = subsectionData[subsectionId];
      mainAssessment.addSubSection(order, title, subsectionId, sectionId);
      tableOfContents.addSubSection(order, title, subsectionId, sectionId);
    });
  }
  function addQuestions() {
    const questionSetIdKeys = Object.keys(questionSetData);
    questionSetIdKeys.forEach(async qsKey => {
      mainAssessment.addQuestionSet(questionSetData[qsKey], readOnly);
    });
  }
  function buildAssessment() {
    assessmentContainer = document.createElement('div');
    assessmentContainer.classList.add('assessmentContainer');

    tocMarkup = tableOfContents.build();
    // generalInfoBar = buildGeneralInfoBar();
    assessmentNav = buildTopNavBar();
    assessmentMarkup = mainAssessment.build();

    const assessmentNavMarkupWrap = document.createElement('div');
    assessmentNavMarkupWrap.classList.add('assessmentNavMarkupWrap');
    assessmentNavMarkupWrap.appendChild(assessmentNav);
    // assessmentNavMarkupWrap.appendChild(generalInfoBar);
    assessmentNavMarkupWrap.appendChild(assessmentMarkup);

    if (readOnly || !$.session.planUpdate) {
      assessmentNavMarkupWrap.classList.add('readOnly');
    } else {
      assessmentNavMarkupWrap.classList.remove('readOnly');
    }

    assessmentContainer.appendChild(tocMarkup);
    assessmentContainer.appendChild(assessmentNavMarkupWrap);

    return assessmentContainer;
  }
  async function build(assessmentData, generalInfo) {
    ({ sectionData, subsectionData, questionSetData } = assessmentData);

    ({ planId, planStatus, isActive } = generalInfo);

    readOnly = planStatus === 'C' || !isActive ? true : false;

    setActiveModuleSectionAttribute('plan-questionsAndAnswers');

    // init markup for toc and assessment
    await mainAssessment.init(planId, readOnly);
    tableOfContents.init();

    // add/sort data to assessment & toc
    addSections();
    addSubSections();
    addQuestions();

    // populate/build assessment
    const markup = buildAssessment();
    return markup;
  }

  return {
    build,
    clearData,
    refreshAssessmentCard,
  };
})();
