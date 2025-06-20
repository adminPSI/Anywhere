const planValidation = (function () {
  let planId;
  let assessmentValidationCheck;
  //let assessmentValidationCheck = {
  //    sectionsApplicable: [],
  //    servicesAndSupports: {},
  //    servicesAndSupportsChecked: {
  //        34: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //        35: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //        36: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //        37: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //        38: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //        39: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //        40: { noSupport: false, paidSupport: false, naturalSupport: false, technology: false, communitResource: false, professionalReferral: false, potentialOutcome: false },
  //    },
  //    hasASectionApplicable: true,
  //    servicesAndSupportsError: false,
  //    complete: false
  //};

  const servicesAndSupportsQuestionIds = {
    //noSupportQuestionIds: ['509', '526', '84', '95', '162', '500', '575'],
    noSupportQuestionIds: [
      '509',
      '526',
      '540',
      '557',
      '575',
      '588',
      '772',
      '84',
      '95',
      '162',
      '195',
      '241',
      '266',
      '335',
      '500',
      '781',
      '798',
      '812',
      '829',
      '847',
      '860',
    ],
    //paidSupportQuestionIds: ['631', '612', '637', '648', '663', '674', '689', '376', '395', '401', '412', '427', '438', '453'],
    paidSupportQuestionIds: [
      '612',
      '631',
      '637',
      '648',
      '663',
      '674',
      '689',
      '376',
      '395',
      '401',
      '412',
      '427',
      '438',
      '453',
      '884',
      '903',
      '909',
      '920',
      '935',
      '946',
      '961',
    ],
    //professionalReferralQuestionIds: ['693', '678', '667', '652', '641', '627', '616', '457', '442', '431', '416', '405', '391', '380'],
    professionalReferralQuestionIds: [
      '616',
      '627',
      '641',
      '652',
      '667',
      '678',
      '693',
      '380',
      '391',
      '405',
      '416',
      '431',
      '442',
      '457',
      '888',
      '899',
      '913',
      '924',
      '939',
      '950',
      '965',
    ],
    //potentialOutcomeQuestionIds: ['510', '527', '541', '558', '576', '589', '85', '96', '163', '196', '242', '267', '336', '501'],
    potentialOutcomeQuestionIds: [
      '510',
      '527',
      '541',
      '558',
      '576',
      '589',
      '773',
      '85',
      '96',
      '163',
      '196',
      '242',
      '267',
      '336',
      '501',
      '782',
      '799',
      '813',
      '830',
      '848',
      '861',
    ],
    additionalSupportQuestionIds: {
      //naturalSupportQuestionIds: ['624', '613', '638', '649', '664', '675', '690', '377', '388', '402', '413', '428', '439', '454'],
      naturalSupportQuestionIds: [
        '613',
        '624',
        '638',
        '649',
        '664',
        '675',
        '690',
        '377',
        '388',
        '402',
        '413',
        '428',
        '439',
        '454',
        '885',
        '896',
        '910',
        '921',
        '936',
        '947',
        '962',
      ],
      //technologyQuestionIds: ['614', '625', '639', '650', '665', '676', '691', '378', '389', '403', '414', '429', '440', '455'],
      technologyQuestionIds: [
        '614',
        '625',
        '639',
        '650',
        '665',
        '676',
        '691',
        '378',
        '389',
        '403',
        '414',
        '429',
        '440',
        '455',
        '886',
        '897',
        '911',
        '922',
        '937',
        '948',
        '963',
      ],
      //communityQuestionIds: ['615', '626', '640', '651', '666', '677', '692', '379', '390', '404', '415', '430', '441', '456'],
      communityQuestionIds: [
        '615',
        '626',
        '640',
        '651',
        '666',
        '677',
        '692',
        '379',
        '390',
        '404',
        '415',
        '430',
        '441',
        '456',
        '887',
        '898',
        '912',
        '923',
        '938',
        '949',
        '964',
      ],
    },
  };

  async function getAssessmentValidation(planId, planVersionNumber) {
    // reset the values of the validation for each consumer
    if ($.session.planVersionNumber === '3') {
      assessmentValidationCheck = {
        sectionsApplicable: [],
        servicesAndSupports: {},
        servicesAndSupportsChecked: {
          42: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          43: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          44: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          45: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          46: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          47: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          48: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
        },
        hasASectionApplicable: true,
        servicesAndSupportsError: false,
        complete: false,
      };
    } else {
      assessmentValidationCheck = {
        sectionsApplicable: [],
        servicesAndSupports: {},
        servicesAndSupportsChecked: {
          34: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          35: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          36: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          37: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          38: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          39: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
          40: {
            noSupport: false,
            paidSupport: false,
            naturalSupport: false,
            technology: false,
            communitResource: false,
            professionalReferral: false,
            potentialOutcome: false,
          },
        },
        hasASectionApplicable: true,
        servicesAndSupportsError: false,
        complete: false,
      };
    }

    // Gathers the data from the database
    servicesAndSupportsData = await planValidationAjax.getAssessmentValidationData(planId);

    // SECTIONS APPLICABLE
    // check each section for the plan and see if any are selected
    const { sectionsApplicable } = servicesAndSupportsData;
    assessmentValidationCheck.sectionsApplicable = sectionsApplicable;
    let hasASectionApplicable = sectionsApplicable.some(obj => obj.applicable === 'Y');

    // In the case the table is missing the planId
    if (!sectionsApplicable.length) hasASectionApplicable = true;

    // if no section is checked, set value to false
    assessmentValidationCheck.hasASectionApplicable = hasASectionApplicable;

    // SERVICES AND SUPPORTS
    const { additionalSupport, paidSupport, professionalReferral, assessmentOutcomes } = servicesAndSupportsData;
    assessmentValidationCheck.servicesAndSupports.additionalSupportCounts = countOccurrences(additionalSupport);
    assessmentValidationCheck.servicesAndSupports.paidSupportCounts = countOccurrences(paidSupport);
    assessmentValidationCheck.servicesAndSupports.professionalReferralCounts = countOccurrences(professionalReferral);
    assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts = countOccurrences(assessmentOutcomes);

    // check if all sections are complete
    allAssessmentAreasComplete(assessmentValidationCheck);
  }

  let IspValidationCheck = {
    complete: true,
    details: [],
    missingExperiences: [],
    missingReviews: [],
    planProgressSummary: false,
    outcome: [],
    selectedProviders: [],
    paidSupportsProviders: [],
    paidSupportsValidDates: true,
    invalidProviders: [],
    contactSectionComplete: true,
    summaryRisksValidation: true,
    continuousMonitoring: null
  };

  let contactsValidation = {
    importantPeople: true,
    importantPlaces: true,
    bestWayToConnect: true,
    moreDetail: true,
  };

  function setPlanId(newPlanId) {
    planId = newPlanId;
  }

  //* TOOLTIPS
  function createTooltip(message, attachedDiv) {
    attachedDiv.classList.add('tooltip');

    const tooltipText = document.createElement('div');
    tooltipText.classList.add('tooltiptext');
    tooltipText.innerHTML = message;

    attachedDiv.addEventListener('mousemove', event => {
      const x = event.clientX;
      const y = event.clientY;

      tooltipText.style.left = `${x}px`;
      tooltipText.style.top = `${y}px`;
    });

    attachedDiv.appendChild(tooltipText);
  }

  //* ASSESSMENT INITIAL CHECK
  function returnAssessmentValidationData() {
    return assessmentValidationCheck;
  }

  function allAssessmentAreasComplete() {
    if (
      assessmentValidationCheck.hasASectionApplicable === true &&
      assessmentValidationCheck.servicesAndSupportsError === false
    ) {
      assessmentValidationCheck.complete = true;
    } else {
      assessmentValidationCheck.complete = false;
    }
  }

  // ASSESSMENT DATA UPDATE CHECK
  function updatedAssessmenteValidation() {
    const tocAlertDiv = document.getElementById('tocAlert');
    const tocMobileAlertDiv = document.getElementById('tocAlertMobile');
    const navAlertDiv = document.getElementById('navAlertAssessment');

    //check sections applicable
    tocAssessmentCheck(assessmentValidationCheck);

    //Check services and supports
    servicesAndSupportsAllVisibleSectionsCheck(assessmentValidationCheck);
    updateTocSectionHeaders(assessmentValidationCheck);

    //Check status of Assessment page
    allAssessmentAreasComplete(assessmentValidationCheck);

    // Set alert divs display value
    // If a section is not applied, show the alerts in the Table of Contents and the Nav
    if (!assessmentValidationCheck.hasASectionApplicable) {
      if (tocAlertDiv) {
        tocAlertDiv.style.display = 'flex';
      }
      if (tocMobileAlertDiv) {
        tocMobileAlertDiv.style.display = 'flex';
      }
    } else {
      if (tocAlertDiv) {
        tocAlertDiv.style.display = 'none';
      }
      if (tocMobileAlertDiv) {
        tocMobileAlertDiv.style.display = 'none';
      }
    }

    // If the assessment page has an error, show the nav alert
    if (assessmentValidationCheck.complete === false) {
      if (navAlertDiv) {
        navAlertDiv.style.display = 'flex';
      }
    } else {
      if (navAlertDiv) {
        navAlertDiv.style.display = 'none';
      }
    }
  }

  // ASSESSMENT TABLE OF CONTENTS
  function tocAssessmentCheck() {
    const hasASectionApplicable = assessmentValidationCheck.sectionsApplicable.some(obj => obj.applicable === 'Y');

    if (hasASectionApplicable) {
      assessmentValidationCheck.hasASectionApplicable = true;
    } else {
      assessmentValidationCheck.hasASectionApplicable = false;
    }
  }

  function updateTocSectionHeaders() {
    if ($.session.planVersionNumber === '3') {
      for (let id = 42; id <= 48; id++) {
        let tocSectionHeader = document.getElementById(`${id}alert`);
        let paidSupportCount = assessmentValidationCheck.servicesAndSupports.paidSupportCounts[id] || 0;
        let additionalSupportCount = assessmentValidationCheck.servicesAndSupports.additionalSupportCounts[id] || 0;
        let professionalReferralCounts =
          assessmentValidationCheck.servicesAndSupports.professionalReferralCounts[id] || 0;
        let potentialOutcomeCount = assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts[id] || 0;

        if (
          (assessmentValidationCheck.servicesAndSupportsChecked[id].paidSupport && paidSupportCount === 0) ||
          ((assessmentValidationCheck.servicesAndSupportsChecked[id].naturalSupport ||
            assessmentValidationCheck.servicesAndSupportsChecked[id].technology ||
            assessmentValidationCheck.servicesAndSupportsChecked[id].communityResource) &&
            additionalSupportCount === 0) ||
          (assessmentValidationCheck.servicesAndSupportsChecked[id].professionalReferral &&
            professionalReferralCounts === 0) ||
          (assessmentValidationCheck.servicesAndSupportsChecked[id].potentialOutcome && potentialOutcomeCount === 0)
        ) {
          if (tocSectionHeader) {
            tocSectionHeader.style.display = 'inline-block';
          }
        } else {
          if (tocSectionHeader) {
            tocSectionHeader.style.display = 'none';
          }
        }
      }
    } else {
      for (let id = 34; id <= 40; id++) {
        let tocSectionHeader = document.getElementById(`${id}alert`);
        let paidSupportCount = assessmentValidationCheck.servicesAndSupports.paidSupportCounts[id] || 0;
        let additionalSupportCount = assessmentValidationCheck.servicesAndSupports.additionalSupportCounts[id] || 0;
        let professionalReferralCounts =
          assessmentValidationCheck.servicesAndSupports.professionalReferralCounts[id] || 0;
        let potentialOutcomeCount = assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts[id] || 0;

        if (
          (assessmentValidationCheck.servicesAndSupportsChecked[id].paidSupport && paidSupportCount === 0) ||
          ((assessmentValidationCheck.servicesAndSupportsChecked[id].naturalSupport ||
            assessmentValidationCheck.servicesAndSupportsChecked[id].technology ||
            assessmentValidationCheck.servicesAndSupportsChecked[id].communityResource) &&
            additionalSupportCount === 0) ||
          (assessmentValidationCheck.servicesAndSupportsChecked[id].professionalReferral &&
            professionalReferralCounts === 0) ||
          (assessmentValidationCheck.servicesAndSupportsChecked[id].potentialOutcome && potentialOutcomeCount === 0)
        ) {
          if (tocSectionHeader) {
            tocSectionHeader.style.display = 'inline-block';
          }
        } else {
          if (tocSectionHeader) {
            tocSectionHeader.style.display = 'none';
          }
        }
      }
    }
  }

  // ASSESSMENT SERVICES AND SUPPORTS
  function servicesAndSupportsBtnCheck() {
    const idsToCheck = [34, 35, 36, 37, 38, 39, 40];

    idsToCheck.forEach(id => {
      let paidSupportBtn = document.getElementById(`paidSupportBtn${id}`);
      let additionalSupportBtn = document.getElementById(`additionalSupportBtn${id}`);
      let profRefBtn = document.getElementById(`profRefBtn${id}`);
      let outcomesBtn = document.getElementById(`outcomesBtn${id}`);

      // number of services and supports attached to each section
      let paidSupportCount = assessmentValidationCheck.servicesAndSupports.paidSupportCounts[id] || 0;
      let additionalSupportCount = assessmentValidationCheck.servicesAndSupports.additionalSupportCounts[id] || 0;
      let professionalReferralCounts =
        assessmentValidationCheck.servicesAndSupports.professionalReferralCounts[id] || 0;
      let potentialOutcomeCount = assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts[id] || 0;

      // returns true if the section has been checked
      let paidSupportChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].paidSupport;
      let additionalSupportChecked =
        assessmentValidationCheck.servicesAndSupportsChecked[id].naturalSupport ||
        assessmentValidationCheck.servicesAndSupportsChecked[id].technology ||
        assessmentValidationCheck.servicesAndSupportsChecked[id].communityResource;
      let professionalReferralChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].professionalReferral;
      let potentialOutcomeChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].potentialOutcome;

      // Add error class to buttons that are checked and have 0 outcomes attached to them
      // if the btn already has the error and no longer meets criteria to contain the error class, remove the error class
      const sections = [
        {
          checkboxChecked: paidSupportChecked,
          count: paidSupportCount,
          button: paidSupportBtn,
          errorText: 'Add Paid Support',
        },
        {
          checkboxChecked: additionalSupportChecked,
          count: additionalSupportCount,
          button: additionalSupportBtn,
          errorText: 'Add Additional Support',
        },
        {
          checkboxChecked: professionalReferralChecked,
          count: professionalReferralCounts,
          button: profRefBtn,
          errorText: 'Add Professional Referral',
        },
        {
          checkboxChecked: potentialOutcomeChecked,
          count: potentialOutcomeCount,
          button: outcomesBtn,
          errorText: 'Add Outcome',
        },
      ];

      assessmentValidationCheck.servicesAndSupportsError = false;

      sections.forEach(section => {
        if (section.checkboxChecked && section.count === 0) {
          section.button.classList.add('error');
          assessmentValidationCheck.servicesAndSupportsError = true;
        } else {
          if (section.button.classList.contains('error')) {
            section.button.classList.remove('error');
          }
          section.button.innerHTML = `${section.errorText} (${section.count})`;
        }
      });
    });

    // if any of the classes have an error then add the alert if it is not already there
    if (assessmentValidationCheck.servicesAndSupportsError === true) {
      assessmentValidationCheck.complete = false;
    }

    updatedAssessmenteValidation();
  }

  function servicesAndSupportsAllVisibleSectionsCheck() {
    const allSections = document.getElementsByClassName('assessment__section');

    // Get only the sections that are selected on the assessment
    const applicableSections = Array.from(allSections).filter(section => !section.classList.contains('nonApplicable'));

    // Check if any of the buttons within the applicable sections have the class "error"
    const hasError = Array.from(applicableSections).some(section => {
      const buttons = section.querySelectorAll('.sectionFooter .btn.btn--secondary.btn--contained');
      return Array.from(buttons).some(button => button.classList.contains('error'));
    });

    if (hasError) {
      assessmentValidationCheck.servicesAndSupportsError = true;
    } else {
      // No buttons with the class "error" found
      assessmentValidationCheck.servicesAndSupportsError = false;
    }
  }

  function findQuestionIdCategory(questionId) {
    if (servicesAndSupportsQuestionIds.noSupportQuestionIds.includes(questionId)) {
      return 'noSupport';
    } else if (servicesAndSupportsQuestionIds.paidSupportQuestionIds.includes(questionId)) {
      return 'paidSupport';
    } else if (servicesAndSupportsQuestionIds.professionalReferralQuestionIds.includes(questionId)) {
      return 'professionalReferral';
    } else if (servicesAndSupportsQuestionIds.potentialOutcomeQuestionIds.includes(questionId)) {
      return 'potentialOutcome';
    } else if (
      servicesAndSupportsQuestionIds.additionalSupportQuestionIds.naturalSupportQuestionIds.includes(questionId)
    ) {
      return 'naturalSupport';
    } else if (servicesAndSupportsQuestionIds.additionalSupportQuestionIds.technologyQuestionIds.includes(questionId)) {
      return 'technology';
    } else if (servicesAndSupportsQuestionIds.additionalSupportQuestionIds.communityQuestionIds.includes(questionId)) {
      return 'communityResource';
    } else {
      return 'Variable not found in the object';
    }
  }

  function countOccurrences(array) {
    const counts = {};
    array.forEach(item => {
      const assessmentAreaId = item.assessmentAreaId;
      counts[assessmentAreaId] = (counts[assessmentAreaId] || 0) + 1;
    });
    return counts;
  }

  function updateSectionApplicability(sectionID, applied) {
    // Find the object with matching sectionId and obtain the index
    const matchingIndex = assessmentValidationCheck.sectionsApplicable.findIndex(obj => obj.sectionId === sectionID);

    // Update the value if a match is found
    if (matchingIndex !== -1) {
      assessmentValidationCheck.sectionsApplicable[matchingIndex].applicable = applied;
      // Toggle the value between 'Y' and 'N'
      assessmentValidationCheck.sectionsApplicable[matchingIndex].applicable = applied;
      assessmentValidationCheck.sectionsApplicable[matchingIndex].applicable === 'Y' ? 'N' : 'Y';
    }

    // checks entire assessments for validation errors
    updatedAssessmenteValidation();
  }

  function updateAssessmentValidationSection(key, value) {
    assessmentValidationCheck[key] = value;

    updatedAssessmenteValidation();
  }

  function updateAssessmentValidationProperty(sectionId, questionIdCategory, value) {
    assessmentValidationCheck.servicesAndSupportsChecked[sectionId][questionIdCategory] = value;

    updatedAssessmenteValidation();
  }

  //* ISP
  async function ISPValidation(planId) {
    // Set state of check to neutral before running to remove cached data
    IspValidationCheck = {
      complete: true,
      details: [],
      missingExperiences: [],
      missingReviews: [],
      planProgressSummary: false,
      outcome: [],
      selectedProviders: [],
      paidSupportsProviders: [],
      invalidProviders: [],
      continuousMonitoring: null
    };

    outcomesData = await planValidationAjax.getISPValidationData({
      token: $.session.Token,
      assessmentId: planId,
    });

    IspValidationCheck.outcomesData = outcomesData;

    for (const item of outcomesData.planOutcomeExperiences) {
      for (const responsibility of item.planExperienceResponsibilities) {
        const responsibleProvider = responsibility.responsibleProvider;
        IspValidationCheck.selectedProviders.push(responsibleProvider);
      }
    }

    const paidSupportsIds = outcomesData.paidSupports.map(obj => obj.providerId);
    IspValidationCheck.paidSupportsProviders = paidSupportsIds;

    const invalidProviders = IspValidationCheck.selectedProviders.filter(
      number =>
        number !== '' &&
        number !== '%' &&
        !IspValidationCheck.paidSupportsProviders.includes(number) &&
        !IspValidationCheck.outcomesData.planOutcomeExperiences.some(outcome =>
          Object.values(outcome.planExperienceResponsibilities).some(
            responsibility =>
              responsibility.responsibleProvider === number && responsibility.isSalesforceLocation === 'True',
          ),
        ),
    );
    IspValidationCheck.invalidProviders = invalidProviders;

    // get a list of the unique outcomeIds
    var uniqueOutcomeIds = Array.from(new Set(outcomesData.planOutcome.map(obj => obj.outcomeId)));

    // if any outcome is missing the 'Details to Know' or 'Outcome' section, return false on the validation check
    for (let i = 0; i < outcomesData.planOutcome.length; i++) {
      if (outcomesData.planOutcome[i].details === '') {
        IspValidationCheck.details.push(outcomesData.planOutcome[i].outcomeId);
      }
      if (outcomesData.planOutcome[i].outcome === '') {
        IspValidationCheck.outcome.push(outcomesData.planOutcome[i].outcomeId);
      }
    }

    for (let i = 0; i < outcomesData.planReviews.length; i++) {
      if (outcomesData.planReviews[i].whenToCheckIn === '') {
        IspValidationCheck.missingReviews.push(outcomesData.planReviews[i].outcomeId);
        //IspValidationCheck.complete = false;
      }
    }

    // makes list of all the outcomeIds from the plan outcome experiences and reviews
    const outcomeExperienceOutcomeIds = outcomesData.planOutcomeExperiences.map(obj => obj.outcomeId);
    const outcomeReviewOutcomeIds = outcomesData.planReviews.map(obj => obj.outcomeId);

    // checks for outcomeIds that may be missing in experiences and reviews (if values are returned, that outcome is missing data)
    const missingOutcomeExperiences = uniqueOutcomeIds.filter(num => !outcomeExperienceOutcomeIds.includes(num));
    const missingOutcomeReviews = uniqueOutcomeIds.filter(num => !outcomeReviewOutcomeIds.includes(num));

    IspValidationCheck.missingExperiences = missingOutcomeExperiences;
    //   IspValidationCheck.missingReviews = missingOutcomeReviews;
    IspValidationCheck.missingReviews.push(...missingOutcomeReviews);

    // if an outcome is missing a review or experience, return false on the validation check
    if (missingOutcomeReviews.length > 0 || missingOutcomeExperiences.length > 0) {
      IspValidationCheck.complete = false;
    }

    // check the plan progress summary value
    if (outcomesData.planProgressSummary[0]) {
      IspValidationCheck.planProgressSummary = outcomesData.planProgressSummary[0].progressSummary !== '';
    }

    if (IspValidationCheck.outcomesData.planOutcome.length < 1) {
      IspValidationCheck.planProgressSummary = true;
    }

    // if there are invalid providers, return false on the validaton check
    if (IspValidationCheck.invalidProviders.length > 0) {
      IspValidationCheck.complete = false;
    }

    // checks if all required data on the page has been filled out
    checkAllOutcomesComplete(IspValidationCheck);

    ispValidationContactCheck();

    await summaryRisksValidationCheck();

    validatePaidSupportsALlRows(outcomesData.paidSupports);

    //IspValidationCheck = validationCheck;
    return IspValidationCheck;
  }

  function returnIspValidation() {
    return IspValidationCheck;
  }
  // sets the alerts status based on the completion of the ISP outcomes data
  function updatedIspOutcomesSetAlerts(validationCheck) {
    //checkExperienceProviders(validationCheck);
    checkAllOutcomesComplete(validationCheck);
    //
    // ISP Main Nav and ISP Outcomes Tab
    const ISPAlertDiv = document.getElementById('navAlertISP');
    const outcomesNav = document.getElementById('outcomesAlert');
    const servicesAlertDiv = document.getElementById('servicesAlert');

    // Handle outcomesNav visibility (only the first two conditions)
    if (validationCheck.missingExperiences.length > 0 || validationCheck.missingReviews.length > 0) {
      outcomesNav.style.display = 'block';
    } else {
      outcomesNav.style.display = 'none';
    }

    // Handle servicesAlertDiv visibility (only the last condition)
    if (validationCheck.paidSupportsValidDates === false || !validationCheck.continuousMonitoring) {
      servicesAlertDiv.style.display = 'flex';
    } else {
      servicesAlertDiv.style.display = 'none';
    }

    // Handle ISPAlertDiv visibility (all three conditions)
    if (
      validationCheck.missingExperiences.length > 0 ||
      validationCheck.missingReviews.length > 0 ||
      validationCheck.paidSupportsValidDates === false ||
      !validationCheck.continuousMonitoring
    ) {
      ISPAlertDiv.style.display = 'flex';
    } else {
      ISPAlertDiv.style.display = 'none';
    }

    return validationCheck;
  }

  // Checks if all fields on the ISP outcomes are completed
  function checkAllOutcomesComplete(validationCheck) {
    validationCheck.complete =
      validationCheck.details.length === 0 &&
      validationCheck.missingExperiences.length === 0 &&
      validationCheck.missingReviews.length === 0 &&
      validationCheck.planProgressSummary &&
      validationCheck.outcome.length === 0 &&
      validationCheck.invalidProviders.length === 0;

    return validationCheck;
  }

  // ISP DETAILS TO KNOW
  // adds the outcomeId to a list of unfinished outcomes if the value is an empty string, if the value is not empty it will remove that id from the list
  function updateOutcomeDetails(outcomeId, validationCheck, emptyString) {
    if (emptyString) {
      validationCheck.details.push(outcomeId);
    } else {
      // removes this outcome id from the details array in the validation check
      validationCheck.details = validationCheck.details.filter(id => id !== outcomeId);
    }

    return validationCheck;
  }

  // ISP OUTCOME FIELD
  // adds the outcomeId to a list of unfinished outcomes if the value is an empty string, if the value is not empty it will remove that id from the list
  function updateOutcome(outcomeId, validationCheck, emptyString) {
    if (emptyString) {
      validationCheck.outcome.push(outcomeId);
    } else {
      // Remove this outcome ID from the outcome array in the validation check
      validationCheck.outcome = validationCheck.outcome.filter(id => id !== outcomeId);
    }

    return validationCheck;
  }

  // ISP REVIEWS
  //checks if the outcome has a review, if not, set the alert next to the add review button
  function reviewsValidationCheck(validationCheck, outcomeId, alertDiv) {
    const display = validationCheck.missingReviews.includes(outcomeId) ? 'flex' : 'none';
    alertDiv.style.display = display;
  }

  //ISP EXPERIENCES
  //checks if the outcome has an experience, if not, set the alert next to the add experience button
  function experiencesValidationCheck(validationCheck, outcomeId, alertDiv) {
    // Checks each experience and compares repsonsible party Ids with the invalid providers array
    function checkResponsibleProvider(outcomesData, outcomeID, presetArray) {
      for (const planOutcomeExperience of outcomesData.planOutcomeExperiences) {
        if (planOutcomeExperience.outcomeId === outcomeID) {
          for (const experienceResponsibility of planOutcomeExperience.planExperienceResponsibilities) {
            if (presetArray.includes(experienceResponsibility.responsibleProvider)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    const invalidProvidersCheck = checkResponsibleProvider(
      validationCheck.outcomesData,
      outcomeId,
      validationCheck.invalidProviders,
    );

    const display = validationCheck.missingExperiences.includes(outcomeId) || invalidProvidersCheck ? 'flex' : 'none';
    alertDiv.style.display = display;
    //validationCheck.invalidProviders.length > 0
  }

  //ISP CONTACTS
  async function contactsValidationCheck() {
    const contactData = await planValidationAjax.getContactValidationData(planId);

    const bestWayToConnect = contactData[0]?.bestWayToConnect || '';
    const moreDetail = contactData[0]?.moreDetail || '';

    const importantPeopleData = contactData.map(item => ({
      type: item.importantPeopleType,
      typeOther: item.importantPeopleTypeOther,
    }));

    const importantPlacesData = contactData.map(item => ({
      type: item.importantPlacesType,
      typeOther: item.importantPlacesTypeOther,
    }));

    checkImportantPeople(importantPeopleData);
    checkImportantPlaces(importantPlacesData);
    checkBestWayToConnect(bestWayToConnect);
    checkMoreDetail(bestWayToConnect, moreDetail);

    checkContactsValidation();
  }

  // PAID SUPPORTS DATES
  function validatePaidSupportsALlRows(paidSupports) {
    const planStartDate = UTIL.formatDateFromDateObj(planDates.getPlanYearStartDate());
    const planEndDate = UTIL.formatDateFromDateObj(planDates.getPlanYearEndDate());

    // Helper function to extract only the date
    function extractDate(dateString) {
      return dateString.split(' ')[0]; // Gets only the date portion
    }

    // Start assuming all rows are valid
    let allRowsValid = true;

    for (const support of paidSupports) {
      const beginDate = UTIL.formatDateFromDateObj(extractDate(support.beginDate));
      const endDate = UTIL.formatDateFromDateObj(extractDate(support.endDate));

      // Validate each row
      if (!validatePaidSupportsDates(beginDate, endDate, planStartDate, planEndDate)) {
        allRowsValid = false; // If any row is invalid, set the flag to false
        IspValidationCheck.complete = false;
        break;
      }
    }

    // Update global state based on the final validation result
    IspValidationCheck.paidSupportsValidDates = allRowsValid;
  }

  function validatePaidSupportsDates(beginDate, endDate) {
    const planStartDate = UTIL.formatDateFromDateObj(planDates.getPlanYearStartDate());
    const planEndDate = UTIL.formatDateFromDateObj(planDates.getPlanYearEndDate());

    // Ensure Begin Date and End Date are provided
    if (!beginDate || isNaN(new Date(beginDate)) || !endDate || isNaN(new Date(endDate))) {
      return false; // Invalid if either date is missing or not valid
    }

    const begin = new Date(beginDate);
    const end = new Date(endDate);
    const planStart = new Date(planStartDate);
    const planEnd = new Date(planEndDate);

    // Begin Date must be within the Plan Span
    if (begin < planStart || begin > planEnd) {
      return false;
    }

    // End Date cannot be before Begin Date
    if (end < begin) {
      return false;
    }

    // End Date must be within the Plan Span
    if (end > planEnd) {
      return false;
    }

    // All validations passed for this row
    return true;
  }

  function checkImportantPeople(importantPeopleData) {
    // Loop through each item in the array
    for (const contact of importantPeopleData) {
      if (contact.type === 'Other' && contact.typeOther === '') {
        contactsValidation.importantPeople = false;
        return;
      }
    }

    contactsValidation.importantPeople = true;
  }

  function checkImportantPlaces(importantPlacesData) {
    // Loop through each item in the array
    for (const place of importantPlacesData) {
      if (place.type === 'Other' && place.typeOther === '') {
        contactsValidation.importantPlaces = false;
        return;
      }
    }

    contactsValidation.importantPlaces = true;
  }

  function checkBestWayToConnect(bestWayToConnect) {
    // #110673 - SH - ANY - PL: Add default settings in SET DEFAULTS for plan
    if (bestWayToConnect === '' && ($.session.defaultContact == '' || $.session.defaultContact == undefined)) {
      contactsValidation.bestWayToConnect = false;
      return;
    }

    contactsValidation.bestWayToConnect = true;
  }

  function checkMoreDetail(bestWayToConnect, moreDetail) {
    // #155257 - SH-ANY-PL: Add indicators if "More Detail" value is missing on Contacts tab
    if (bestWayToConnect === '7' && moreDetail.trim() === '') {
      contactsValidation.moreDetail = false;
      return;
    }

    contactsValidation.moreDetail = true;
  }

  function getContactValidation() {
    return contactsValidation;
  }

  function checkContactsValidation() {
    const ISPAlertDiv = document.getElementById('navAlertISP');
    const alertDiv = document.querySelector('.contactsAlertDiv');
    const bestWayToConnectAlertDiv = document.querySelector('.bestWaytoConnectAlert');

    // Check if the alertDiv exists and if any validation condition is false
    if (
      alertDiv &&
      (!contactsValidation.importantPeople ||
        !contactsValidation.importantPlaces ||
        !contactsValidation.bestWayToConnect ||
        !contactsValidation.moreDetail)
    ) {
      alertDiv.style.display = 'flex';
    } else if (alertDiv) {
      alertDiv.style.display = 'none';
    }

    if (bestWayToConnectAlertDiv && !contactsValidation.bestWayToConnect) {
      bestWayToConnectAlertDiv.style.display = 'flex';
    } else if (bestWayToConnectAlertDiv) {
      bestWayToConnectAlertDiv.style.display = 'none';
    }

    if (
      ISPAlertDiv &&
      (!contactsValidation.importantPeople ||
        !contactsValidation.importantPlaces ||
        !contactsValidation.bestWayToConnect ||
        !contactsValidation.moreDetail)
    ) {
      ISPAlertDiv.style.display = 'flex';
    } else if (ISPAlertDiv) {
      ISPAlertDiv.style.display = 'none';
    }

    // sets isp validation check variable value regardless of UI
    ispValidationContactCheck();
  }

  function ispValidationContactCheck() {
    if (
      !contactsValidation.importantPeople ||
      !contactsValidation.importantPlaces ||
      !contactsValidation.bestWayToConnect ||
      !contactsValidation.moreDetail
    ) {
      IspValidationCheck.contactSectionComplete = false;
    } else {
      IspValidationCheck.contactSectionComplete = true;
    }
  }

  // checks if the provider selected for the experience is also in the paid supports
  function checkExperienceProviders(validationCheck) {
    // Extract the first values from the second array objects
    const secondValues = validationCheck.paidSupportsProviders.map(obj => obj.value);

    // Create a list of values from the first array that don't exist in the second array
    const invalidProviders = validationCheck.selectedProviders.filter(
      value =>
        value !== '' &&
        value !== '%' &&
        !secondValues.includes(value) &&
        !validationCheck.outcomesData.planOutcomeExperiences.some(outcome =>
          Object.values(outcome.planExperienceResponsibilities).some(
            responsibility =>
              responsibility.responsibleProvider === value && responsibility.isSalesforceLocation === 'True',
          ),
        ),
    );

    validationCheck.invalidProviders = invalidProviders;
    return validationCheck;
  }

  function checkExperiencesAfterAddingNewPaidSupport(validationCheck) {
    // Find all divs with classname 'experiencesAlert'
    const divs = document.querySelectorAll('.experiencesAlert');

    // Loop over the resulting array and run your function on each div
    if (divs.length > 0) {
      divs.forEach(div => {
        // Extract the number from the id using a regular expression
        const regex = /experienceAlert(\d{1,5})/;
        const matches = div.id.match(regex);
        const number = matches ? Number(matches[1]) : null;

        // Check each div to see if the alert is needed or not
        experiencesValidationCheck(validationCheck, number, div);
      });
    }
  }

  // Summary Risks
  async function summaryRisksValidationCheck() {
    let summaryValidationData = await planValidationAjax.getSummaryRiskValidationData(planId);

    let groupedByQuestionSetId = summaryValidationData.reduce((acc, obj) => {
      const key = obj.QuestionSetId;
      (acc[key] ? acc[key] : (acc[key] = [])).push(obj);
      return acc;
    }, {});

    // Check if any answer in the group is null or empty
    function hasNullOrEmptyAnswer(group) {
      return group.some(item => item.Answer === '' || item.Answer === null || item.Answer === '%');
    }

    // Iterate over each group and perform the necessary checks
    for (let group of Object.values(groupedByQuestionSetId)) {
      // Check if there is at least one non-empty answer for the specified question text
      let hasNonEmptyAnswer = group.some(
        item => item.Answer !== '' && item.QuestionText === 'What is the risk, what it looks like, where it occurs:',
      );
      if (hasNonEmptyAnswer) {
        // If there's a non-empty answer for the specified question text,
        // check if any other answer in the group is null or empty
        let hasNullOrEmpty = hasNullOrEmptyAnswer(group);
        if (hasNullOrEmpty) {
          // If any answer is null or empty, set the flag and exit the function
          IspValidationCheck.summaryRisksValidation = false;
          return;
        }
      }
    }

    // If no null or empty answers were found, set the flag to true
    IspValidationCheck.summaryRisksValidation = true;
  }

  function returnSummaryRisksValidation() {
    return IspValidationCheck.summaryRisksValidation;
  }

  function setSummaryRiskValidation(hasErrors) {
    IspValidationCheck.summaryRisksValidation = hasErrors;
  }

  async function alertCheckSummaryRisksValidation() {
    const ISPAlertDiv = document.getElementById('navAlertISP');
    const summaryAlertDiv = document.querySelector('.summaryAlertDiv');

    if (summaryAlertDiv && !IspValidationCheck.summaryRisksValidation) {
      summaryAlertDiv.style.display = 'flex';
    } else if (summaryAlertDiv) {
      summaryAlertDiv.style.display = 'none';
    }

    const isEverythingComplete = await ISPValidation(planId);

    if (
      ISPAlertDiv &&
      (!isEverythingComplete.complete ||
        !isEverythingComplete.contactSectionComplete ||
        !isEverythingComplete.summaryRisksValidation)
    ) {
      ISPAlertDiv.style.display = 'flex';
    } else if (ISPAlertDiv) {
      ISPAlertDiv.style.display = 'none';
    }
  }

  async function init(newPlanId, planVersionNumber) {
    planId = newPlanId;

    await contactsValidationCheck(planId, planVersionNumber);

    await ISPValidation(planId, planVersionNumber);

    await getAssessmentValidation(planId, planVersionNumber);
  }

  return {
    setPlanId,
    createTooltip,
    returnAssessmentValidationData,
    getAssessmentValidation,
    updateTocSectionHeaders,
    updatedAssessmenteValidation,
    updateSectionApplicability,
    updateAssessmentValidationSection,
    updateAssessmentValidationProperty,
    ISPValidation,
    returnIspValidation,
    checkAllOutcomesComplete,
    updatedIspOutcomesSetAlerts,
    reviewsValidationCheck,
    experiencesValidationCheck,
    tocAssessmentCheck,
    findQuestionIdCategory,
    servicesAndSupportsBtnCheck,
    updateOutcome,
    updateOutcomeDetails,
    checkExperienceProviders,
    checkExperiencesAfterAddingNewPaidSupport,
    contactsValidationCheck,
    getContactValidation,
    returnSummaryRisksValidation,
    setSummaryRiskValidation,
    alertCheckSummaryRisksValidation,
    summaryRisksValidationCheck,
    validatePaidSupportsDates,

    init,
  };
})();
