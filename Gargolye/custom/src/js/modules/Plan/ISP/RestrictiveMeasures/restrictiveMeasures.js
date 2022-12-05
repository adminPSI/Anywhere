const planRestrictiveMeasures = (() => {
  let readOnly;
  let planId; // aka: assessmentId
  let rmData;
  // DOM
  let rmMainWrap;
  // OTHER
  let charLimits;

  //*------------------------------------------------------
  //* UTIL
  //*------------------------------------------------------
  async function updateRMResponse() {
    const data = {
      token: $.session.Token,
      informedConsentId: rmData.rmID,
      rmIdentified: rmData.rmIdentified,
      rmHRCDate: rmData.rmHRCDate,
      rmKeepSelfSafe: rmData.rmKeepSelfSafe,
      rmFadeRestriction: rmData.rmFadeRestriction,
      rmOtherWayHelpGood: rmData.rmOtherWayHelpGood,
      rmOtherWayHelpBad: rmData.rmOtherWayHelpBad,
      rmWhatCouldHappenGood: rmData.rmWhatCouldHappenGood,
      rmWhatCouldHappenBad: rmData.rmWhatCouldHappenBad,
    };
    const res = await restrictiveMeasuresAjax.updatePlanRestrictiveMeasures(data);
  }
  function toggleRestrictiveMeasureQuestionsVisiblity(show) {
    if (show) {
      const rmQuestions = buildRestrictiveMeasureQuestions();
      rmMainWrap.appendChild(rmQuestions);
    } else {
      const rmQuestions = document.querySelector('.rmQuestionSection');
      rmMainWrap.removeChild(rmQuestions);
    }
  }

  //*------------------------------------------------------
  //* RESTRICTIVE MEASURE QUESTIONS
  //*------------------------------------------------------
  function buildRestrictiveMeasureQuestions() {
    const rmQuestionSection = document.createElement('div');
    rmQuestionSection.classList.add('rmQuestionSection');

    //* HRC APPROVAL DATE
    //*------------------------------------
    const rmHrcApprovalDate = input.build({
      label: 'Date of HRC Approval',
      type: 'date',
      value: UTIL.formatDateToIso(rmData.rmHRCDate.split(' ')[0]),
      readonly: readOnly,
    });
    rmHrcApprovalDate.style.maxWidth = '200px';
    //* RM_KEEP_SELF_SAFE
    //*------------------------------------
    const rmKeepSelfSafeQuestion = document.createElement('div');
    const rmKeepSelfSafeQuestionText = document.createElement('p');
    rmKeepSelfSafeQuestionText.style.marginBottom = '7px';
    rmKeepSelfSafeQuestionText.innerText =
      'What help do I need to keep myself safe? (describe restrictive strategies and why they are needed)';
    const rmKeepSelfSafeQuestionResp = input.build({
      type: 'textarea',
      value: rmData.rmKeepSelfSafe,
      readonly: readOnly,
      charLimit: charLimits.rmKeepSelfSafe,
      forceCharLimit: true,
      classNames: 'autosize',
    });
    rmKeepSelfSafeQuestion.appendChild(rmKeepSelfSafeQuestionText);
    rmKeepSelfSafeQuestion.appendChild(rmKeepSelfSafeQuestionResp);
    //* RM_FADE_RESTRICTION
    //*------------------------------------
    const rmFadeRestrictionQuestion = document.createElement('div');
    const rmFadeRestrictionQuestionText = document.createElement('p');
    rmFadeRestrictionQuestionText.style.marginBottom = '7px';
    rmFadeRestrictionQuestionText.innerText =
      'What is the plan to ensure the restriction is temporary in nature?';
    const rmFadeRestrictionQuestionResp = input.build({
      type: 'textarea',
      value: rmData.rmFadeRestriction,
      readonly: readOnly,
      charLimit: charLimits.rmFadeRestriction,
      forceCharLimit: true,
      classNames: 'autosize',
    });
    rmFadeRestrictionQuestion.appendChild(rmFadeRestrictionQuestionText);
    rmFadeRestrictionQuestion.appendChild(rmFadeRestrictionQuestionResp);
    //* RM_WHAT_COULD_HAPPEN(GOOD/BAD)
    //*------------------------------------
    const rmWhatCouldHappenQuestion = document.createElement('div');
    const rmWhatCouldHappenQuestionText = document.createElement('p');
    rmWhatCouldHappenQuestionText.style.marginBottom = '10px';
    rmWhatCouldHappenQuestionText.innerText = 'What could happen if I allow this help?';
    const rmWhatCouldHappenQuestionContainer = document.createElement('div');
    rmWhatCouldHappenQuestionContainer.classList.add('isp_ic_rmQuestionGroup');
    const rmWhatCouldHappenQuestionGoodResp = input.build({
      type: 'textarea',
      label: 'Good',
      value: rmData.rmWhatCouldHappenGood,
      readonly: readOnly,
      charLimit: charLimits.rmWhatCouldHappenGood,
      forceCharLimit: true,
      classNames: 'autosize',
    });
    const rmWhatCouldHappenQuestionBadResp = input.build({
      type: 'textarea',
      label: 'Bad',
      value: rmData.rmWhatCouldHappenBad,
      readonly: readOnly,
      charLimit: charLimits.rmWhatCouldHappenBad,
      forceCharLimit: true,
      classNames: 'autosize',
    });
    rmWhatCouldHappenQuestionContainer.appendChild(rmWhatCouldHappenQuestionGoodResp);
    rmWhatCouldHappenQuestionContainer.appendChild(rmWhatCouldHappenQuestionBadResp);
    rmWhatCouldHappenQuestion.appendChild(rmWhatCouldHappenQuestionText);
    rmWhatCouldHappenQuestion.appendChild(rmWhatCouldHappenQuestionContainer);
    //* RM_OTHER_WAY_HELP(GOOD/BAD)
    //*------------------------------------
    const rmOtherWayHelpQuestion = document.createElement('div');
    const rmOtherWayHelpQuestionText = document.createElement('p');
    rmOtherWayHelpQuestionText.style.marginBottom = '10px';
    rmOtherWayHelpQuestionText.innerText = `If I don't allow this help, what other ways help me be safe?`;
    const rmOtherWayHelpQuestionContainer = document.createElement('div');
    rmOtherWayHelpQuestionContainer.classList.add('isp_ic_rmQuestionGroup');
    const rmOtherWayHelpQuestionGoodResp = input.build({
      type: 'textarea',
      label: 'Good things about these other options',
      value: rmData.rmOtherWayHelpGood,
      readonly: readOnly,
      charLimit: charLimits.rmOtherWayHelpGood,
      forceCharLimit: true,
      classNames: 'autosize',
    });
    const rmOtherWayHelpQuestionBadResp = input.build({
      type: 'textarea',
      label: 'Bad things about these other options',
      value: rmData.rmOtherWayHelpBad,
      readonly: readOnly,
      charLimit: charLimits.rmOtherWayHelpBad,
      forceCharLimit: true,
      classNames: 'autosize',
    });
    rmOtherWayHelpQuestionContainer.appendChild(rmOtherWayHelpQuestionGoodResp);
    rmOtherWayHelpQuestionContainer.appendChild(rmOtherWayHelpQuestionBadResp);
    rmOtherWayHelpQuestion.appendChild(rmOtherWayHelpQuestionText);
    rmOtherWayHelpQuestion.appendChild(rmOtherWayHelpQuestionContainer);

    //* Required Fields
    //*------------------------------------
    if (rmData.rmHRCDate === '') {
      rmHrcApprovalDate.classList.add('error');
    }
    if (rmData.rmKeepSelfSafe === '') {
      rmKeepSelfSafeQuestionResp.classList.add('error');
    }
    if (rmData.rmFadeRestriction === '') {
      rmFadeRestrictionQuestionResp.classList.add('error');
    }
    if (rmData.rmWhatCouldHappenGood === '') {
      rmWhatCouldHappenQuestionGoodResp.classList.add('error');
    }
    if (rmData.rmWhatCouldHappenBad === '') {
      rmWhatCouldHappenQuestionBadResp.classList.add('error');
    }
    if (rmData.rmOtherWayHelpGood === '') {
      rmOtherWayHelpQuestionGoodResp.classList.add('error');
    }
    if (rmData.rmOtherWayHelpBad === '') {
      rmOtherWayHelpQuestionBadResp.classList.add('error');
    }

    //* Event Setup
    //*------------------------------------
    // HRC APPROVAL DATE
    rmHrcApprovalDate.addEventListener('change', event => {
      rmData.rmHRCDate = event.target.value;
      if (event.target.value !== '') {
        rmHrcApprovalDate.classList.remove('error');
      } else {
        rmHrcApprovalDate.classList.add('error');
      }
      updateRMResponse();
    });
    // RM_KEEP_SELF_SAFE
    rmKeepSelfSafeQuestionResp.addEventListener('input', event => {
      if (event.target.value !== '') {
        rmKeepSelfSafeQuestionResp.classList.remove('error');
      } else {
        rmKeepSelfSafeQuestionResp.classList.add('error');
      }
    });
    rmKeepSelfSafeQuestionResp.addEventListener('focusout', event => {
      rmData.rmKeepSelfSafe = event.target.value;
      updateRMResponse();
    });
    // RM_FADE_RESTRICTION
    rmFadeRestrictionQuestionResp.addEventListener('input', event => {
      if (event.target.value !== '') {
        rmFadeRestrictionQuestionResp.classList.remove('error');
      } else {
        rmFadeRestrictionQuestionResp.classList.add('error');
      }
    });
    rmFadeRestrictionQuestionResp.addEventListener('focusout', event => {
      rmData.rmFadeRestriction = event.target.value;
      updateRMResponse();
    });
    // RM_WHAT_COULD_HAPPEN GOOD
    rmWhatCouldHappenQuestionGoodResp.addEventListener('input', event => {
      if (event.target.value !== '') {
        rmWhatCouldHappenQuestionGoodResp.classList.remove('error');
      } else {
        rmWhatCouldHappenQuestionGoodResp.classList.add('error');
      }
    });
    rmWhatCouldHappenQuestionGoodResp.addEventListener('focusout', event => {
      rmData.rmWhatCouldHappenGood = event.target.value;
      updateRMResponse();
    });
    // RM_WHAT_COULD_HAPPEN BAD
    rmWhatCouldHappenQuestionBadResp.addEventListener('input', event => {
      if (event.target.value !== '') {
        rmWhatCouldHappenQuestionBadResp.classList.remove('error');
      } else {
        rmWhatCouldHappenQuestionBadResp.classList.add('error');
      }
    });
    rmWhatCouldHappenQuestionBadResp.addEventListener('focusout', event => {
      rmData.rmWhatCouldHappenBad = event.target.value;
      updateRMResponse();
    });
    // RM_OTHER_WAY_HELP GOOD
    rmOtherWayHelpQuestionGoodResp.addEventListener('input', event => {
      if (event.target.value !== '') {
        rmOtherWayHelpQuestionGoodResp.classList.remove('error');
      } else {
        rmOtherWayHelpQuestionGoodResp.classList.add('error');
      }
    });
    rmOtherWayHelpQuestionGoodResp.addEventListener('focusout', event => {
      rmData.rmOtherWayHelpGood = event.target.value;
      updateRMResponse();
    });
    // RM_OTHER_WAY_HELP BAD
    rmOtherWayHelpQuestionBadResp.addEventListener('input', event => {
      if (event.target.value !== '') {
        rmOtherWayHelpQuestionBadResp.classList.remove('error');
      } else {
        rmOtherWayHelpQuestionBadResp.classList.add('error');
      }
    });
    rmOtherWayHelpQuestionBadResp.addEventListener('focusout', event => {
      rmData.rmOtherWayHelpBad = event.target.value;
      updateRMResponse();
    });

    //* Build It
    //*------------------------------------
    rmQuestionSection.appendChild(rmHrcApprovalDate);
    rmQuestionSection.appendChild(rmKeepSelfSafeQuestion);
    rmQuestionSection.appendChild(rmFadeRestrictionQuestion);
    rmQuestionSection.appendChild(rmWhatCouldHappenQuestion);
    rmQuestionSection.appendChild(rmOtherWayHelpQuestion);

    return rmQuestionSection;
  }

  //*------------------------------------------------------
  //* TOGGLE QUESTION
  //*------------------------------------------------------
  //* question that decides if RM questions are visible
  //*------------------------------------------------------
  function buildToggleQuestions() {
    const rmSection = document.createElement('div');
    rmSection.classList.add('rmToggleSection');

    //Restriction Identified (YES SHOWS REST OF RM QUESTIONS)
    const rmRestrictionsIdentifiedQuestion = document.createElement('div');
    rmRestrictionsIdentifiedQuestion.classList.add('ic_questionContainer');

    const rmRestrictionsIdentifiedQuestionText = document.createElement('p');
    rmRestrictionsIdentifiedQuestionText.innerText =
      'Were restrictions identified during the planning process?';
    rmRestrictionsIdentifiedQuestion.appendChild(rmRestrictionsIdentifiedQuestionText);

    //Radio Container
    const rmRestrictionsIdentifiedRadioContainer = document.createElement('div');
    rmRestrictionsIdentifiedRadioContainer.classList.add('ic_questionRadioContainer');
    //Radios
    const rmRestrictionsIdentifiedYesRadio = input.buildRadio({
      id: 'RM_Identified-yes',
      text: 'Yes',
      name: 'CS_Identified',
      isChecked: rmData.rmIdentified === 'Y',
      isDisabled: readOnly,
      callback: () => {
        rmData.rmIdentified = 'Y';
        updateRMResponse();
        toggleRestrictiveMeasureQuestionsVisiblity(true);
        rmRestrictionsIdentifiedRadioContainer.classList.remove('error');
        DOM.autosizeTextarea();
      },
    });
    const rmRestrictionsIdentifiedNoRadio = input.buildRadio({
      id: 'CS_Identified-no',
      text: 'No',
      name: 'CS_Identified',
      isChecked: rmData.rmIdentified === 'N',
      isDisabled: readOnly,
      callback: () => {
        if (rmData.rmIdentified === 'Y') {
          UTIL.warningPopup({
            message:
              'Changing this question to NO will result in the restrictive measure question responses to be cleared. Do you want to proceed?',
            hideX: true,
            accept: {
              text: 'Yes',
              callback: () => {
                rmData.rmIdentified = 'N';
                rmData.rmHRCDate = '';
                rmData.rmKeepSelfSafe = '';
                rmData.rmFadeRestriction = '';
                rmData.rmOtherWayHelpGood = '';
                rmData.rmOtherWayHelpBad = '';
                rmData.rmWhatCouldHappenGood = '';
                rmData.rmWhatCouldHappenBad = '';
                updateRMResponse();
                toggleRestrictiveMeasureQuestionsVisiblity(false);
              },
            },
            reject: {
              text: 'No',
              callback: () => {
                document.getElementById('RM_Identified-yes').checked = true;
              },
            },
          });
        } else {
          rmData.rmIdentified = 'N';
          updateRMResponse();
        }

        rmRestrictionsIdentifiedRadioContainer.classList.remove('error');
      },
    });

    if (rmData.rmIdentified === '') {
      rmRestrictionsIdentifiedRadioContainer.classList.add('error');
    }
    rmRestrictionsIdentifiedRadioContainer.appendChild(rmRestrictionsIdentifiedYesRadio);
    rmRestrictionsIdentifiedRadioContainer.appendChild(rmRestrictionsIdentifiedNoRadio);

    rmRestrictionsIdentifiedQuestion.appendChild(rmRestrictionsIdentifiedRadioContainer);
    rmSection.appendChild(rmRestrictionsIdentifiedQuestion);

    return rmSection;
  }

  //*------------------------------------------------------
  //* MAIN
  //*------------------------------------------------------
  function getMarkup() {
    // section
    rmMainWrap = document.createElement('div');
    rmMainWrap.classList.add('ispRestrictiveMeasures');
    // heading
    const heading = document.createElement('h2');
    heading.innerHTML = 'Restrictive Measures';
    heading.classList.add('sectionHeading');
    heading.style.marginBottom = '6px';
    rmMainWrap.appendChild(heading);

    const toggleQuestion = buildToggleQuestions();
    rmMainWrap.appendChild(toggleQuestion);

    if (rmData.rmIdentified === 'Y') {
      const rmQuestions = buildRestrictiveMeasureQuestions();
      rmMainWrap.appendChild(rmQuestions);
    }

    return rmMainWrap;
  }

  async function init(data) {
    planId = data.planId;
    readOnly = data.readOnly;
    charLimits = planData.getISPCharacterLimits('restrictiveMeasures');

    rmData = await restrictiveMeasuresAjax.getPlanRestrictiveMeasures({
      token: $.session.Token,
      assessmentId: planId,
    });

    if (rmData === undefined) {
      const stuff = await restrictiveMeasuresAjax.insertPlanRestrictiveMeasures({
        token: $.session.Token,
        assessmentId: planId,
      });

      rmData = {
        rmID: stuff ? stuff.informedConsentId : '',
        rmIdentified: '',
        rmHRCDate: '',
        rmKeepSelfSafe: '',
        rmFadeRestriction: '',
        rmOtherWayHelpGood: '',
        rmOtherWayHelpBad: '',
        rmWhatCouldHappenGood: '',
        rmWhatCouldHappenBad: '',
      };
    } else {
      rmData.rmID = rmData.informedConsentId;
      delete rmData.informedConsentId;
    }
  }

  return {
    init,
    getMarkup,
  };
})();
