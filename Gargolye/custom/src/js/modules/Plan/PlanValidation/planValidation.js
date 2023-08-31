const planValidation = (function () {
    let assessmentValidationCheck = {
      workingNotWorking: [],
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
      workingSectionComplete: false,
      servicesAndSupportsError: false,
      complete: false
    };
    const servicesAndSupportsQuestionIds = {
      noSupportQuestionIds: ['509', '526', '84', '95', '162', '500', '575'],
      paidSupportQuestionIds: [
        '631',
        '612',
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
      ],
      professionalReferralQuestionIds: [
        '693',
        '678',
        '667',
        '652',
        '641',
        '627',
        '616',
        '457',
        '442',
        '431',
        '416',
        '405',
        '391',
        '380',
      ],
      potentialOutcomeQuestionIds: [
        '510',
        '527',
        '541',
        '558',
        '576',
        '589',
        '85',
        '96',
        '163',
        '196',
        '242',
        '267',
        '336',
        '501',
      ],
      additionalSupportQuestionIds: {
        naturalSupportQuestionIds: [
          '624',
          '613',
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
        ],
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
        ],
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
        ],
      },
    };
  
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
    async function getAssessmentValidation(planId) {
      // Gathers the data from the database
      servicesAndSupportsData = await servicesSupportsAjax.getServicesAndSupports({
        token: $.session.Token,
        anywAssessmentId: planId,
      });
  
      // WORKING/NOT WORKING
      assessmentValidationCheck.workingNotWorking = servicesAndSupportsData.workingNotWorking;
      workingSectionCheck(assessmentValidationCheck);
  
      // SECTIONS APPLICABLE
      // check each section fo rthe plan and see if any are selected, if at least one is selected, return true
      assessmentValidationCheck.sectionsApplicable = servicesAndSupportsData.sectionsApplicable;
      const hasASectionApplicable = assessmentValidationCheck.sectionsApplicable.some(
        obj => obj.applicable === 'Y',
      );
  
      // if no section is checked, set value to false
      if (!hasASectionApplicable) {
        assessmentValidationCheck.hasASectionApplicable = false;
      }
  
      // SERVICES AND SUPPORTS
      // Count occurrences of assessmentAreaId in each service and supports category
      assessmentValidationCheck.servicesAndSupports.additionalSupportCounts = countOccurrences(servicesAndSupportsData.additionalSupport);
      assessmentValidationCheck.servicesAndSupports.paidSupportCounts = countOccurrences(servicesAndSupportsData.paidSupport);
      assessmentValidationCheck.servicesAndSupports.professionalReferralCounts = countOccurrences(servicesAndSupportsData.professionalReferral);
      assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts = countOccurrences(servicesAndSupportsData.assessmentOutcomes);
  
      // check if all sections are complete
      allAssessmentAreasComplete(assessmentValidationCheck);
  
      return assessmentValidationCheck;
    }
  
    function allAssessmentAreasComplete(assessmentValidationCheck) {
      if (assessmentValidationCheck.hasASectionApplicable === true && assessmentValidationCheck.workingSectionComplete === true && assessmentValidationCheck.servicesAndSupportsError === false) {
          assessmentValidationCheck.complete = true;
      } else {
          assessmentValidationCheck.complete = false;
      }
  
      return assessmentValidationCheck;
    }
  
    // ASSESSMENT DATA UPDATE CHECK
    function updatedAssessmenteValidation(assessmentValidationCheck) {
      const workingAlertDiv = document.getElementById('workingAlert');
      const tocAlertDiv = document.getElementById('tocAlert');
      const tocMobileAlertDiv = document.getElementById('tocAlertMobile');
      const navAlertDiv = document.getElementById('navAlertAssessment');
  
      //Check working/ not working section
      workingSectionCheck(assessmentValidationCheck);
  
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
  
      // If the working/not working section does not have a completed row, show the alert
      if (!assessmentValidationCheck.workingSectionComplete) {
        if (workingAlertDiv) {
          workingAlertDiv.style.display = 'inline-block';
        }
      } else {
        if (workingAlertDiv) {
          workingAlertDiv.style.display = 'none';
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
  
      return assessmentValidationCheck;
    }
  
    // ASSESSMENT WORKING/NOT WORKING
    function workingSectionCheck(assessmentValidationCheck) {
      // Group objects by answerRow
        var groups = {};
        (assessmentValidationCheck.workingNotWorking).forEach(function(obj) {
            var answerRow = obj.answerRow;
            if (!groups[answerRow]) {
                groups[answerRow] = [];
            }
            groups[answerRow].push(obj);
        });

        // Check if any group has all three objects with non-empty answer values
        var hasGroupWithNonEmptyAnswers = Object.values(groups).some(function(group) {
            return group.length === 3 && group.every(function(obj) {
                return obj.answer !== "";
            });
        });

        if (hasGroupWithNonEmptyAnswers) {
            assessmentValidationCheck.workingSectionComplete = true;
        } else {
            assessmentValidationCheck.workingSectionComplete = false;
        }
  
      return assessmentValidationCheck;
    }
  
    function updateAnswerWorkingSection(assessmentValidationCheck, answer, answerId) {
      for (let i = 0; i < assessmentValidationCheck.workingNotWorking.length; i++) {
        if (assessmentValidationCheck.workingNotWorking[i].answerid === answerId) {
          assessmentValidationCheck.workingNotWorking[i].answer = answer;
          break;
        }
      }
  
      return assessmentValidationCheck;
    }
  
    // ASSESSMENT TABLE OF CONTENTS
    function tocAssessmentCheck(assessmentValidationCheck) {
      const hasASectionApplicable = assessmentValidationCheck.sectionsApplicable.some(
        obj => obj.applicable === 'Y',
      );
  
      if (hasASectionApplicable) {
        assessmentValidationCheck.hasASectionApplicable = true;
      } else {
        assessmentValidationCheck.hasASectionApplicable = false;
      }
  
      return assessmentValidationCheck;
    }

    function updateTocSectionHeaders(assessmentValidationCheck) {
        for (let id = 34; id <= 40; id++) {
          let tocSectionHeader = document.getElementById(`${id}alert`);
          let paidSupportCount = assessmentValidationCheck.servicesAndSupports.paidSupportCounts[id] || 0;
          let additionalSupportCount = assessmentValidationCheck.servicesAndSupports.additionalSupportCounts[id] || 0;
          let professionalReferralCounts = assessmentValidationCheck.servicesAndSupports.professionalReferralCounts[id] || 0;
          let potentialOutcomeCount = assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts[id] || 0;
      
          if (
            (assessmentValidationCheck.servicesAndSupportsChecked[id].paidSupport && paidSupportCount === 0) ||
            ((assessmentValidationCheck.servicesAndSupportsChecked[id].naturalSupport || assessmentValidationCheck.servicesAndSupportsChecked[id].technology || assessmentValidationCheck.servicesAndSupportsChecked[id].communityResource) && additionalSupportCount === 0) ||
            (assessmentValidationCheck.servicesAndSupportsChecked[id].professionalReferral && professionalReferralCounts === 0) ||
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
      
        return assessmentValidationCheck;
    }
  
    // ASSESSMENT SERVICES AND SUPPORTS
    function servicesAndSupportsBtnCheck(assessmentValidationCheck) {
      const idsToCheck = [34, 35, 36, 37, 38, 39, 40];

      idsToCheck.forEach(id => {
        let paidSupportBtn = document.getElementById(`paidSupportBtn${id}`);
        let additionalSupportBtn = document.getElementById(`additionalSupportBtn${id}`);
        let profRefBtn = document.getElementById(`profRefBtn${id}`);
        let outcomesBtn = document.getElementById(`outcomesBtn${id}`);

        // number of services and supports attached to each section
        let paidSupportCount = assessmentValidationCheck.servicesAndSupports.paidSupportCounts[id] || 0;
        let additionalSupportCount = assessmentValidationCheck.servicesAndSupports.additionalSupportCounts[id] || 0;
        let professionalReferralCounts = assessmentValidationCheck.servicesAndSupports.professionalReferralCounts[id] || 0;
        let potentialOutcomeCount = assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts[id] || 0;;

        // returns true if the section has been checked 
        let paidSupportChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].paidSupport;
        let additionalSupportChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].naturalSupport || assessmentValidationCheck.servicesAndSupportsChecked[id].technology || assessmentValidationCheck.servicesAndSupportsChecked[id].communityResource;
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

      return assessmentValidationCheck;
    }

    function servicesAndSupportsAllVisibleSectionsCheck(assessmentValidationCheck) {
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

        return assessmentValidationCheck;
    }

    function findQuestionIdCategory(questionId) {
      if (servicesAndSupportsQuestionIds.noSupportQuestionIds.includes(questionId)) {
        return 'noSupport';
      } else if (servicesAndSupportsQuestionIds.paidSupportQuestionIds.includes(questionId)) {
        return 'paidSupport';
      } else if (
        servicesAndSupportsQuestionIds.professionalReferralQuestionIds.includes(questionId)
      ) {
        return 'professionalReferral';
      } else if (servicesAndSupportsQuestionIds.potentialOutcomeQuestionIds.includes(questionId)) {
        return 'potentialOutcome';
      } else if (
        servicesAndSupportsQuestionIds.additionalSupportQuestionIds.naturalSupportQuestionIds.includes(
          questionId,
        )
      ) {
        return 'naturalSupport';
      } else if (
        servicesAndSupportsQuestionIds.additionalSupportQuestionIds.technologyQuestionIds.includes(
          questionId,
        )
      ) {
        return 'technology';
      } else if (
        servicesAndSupportsQuestionIds.additionalSupportQuestionIds.communityQuestionIds.includes(
          questionId,
        )
      ) {
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

    //* ISP
    async function ISPValidation(planId) {
      // Set state of check to neutral before running check to remove chached data
      let validationCheck = {
        complete: true,
        details: [],
        missingExperiences: [],
        missingReviews: [],
        planProgressSummary: false,
        outcome: [],
        selectedProviders: [],
        paidSupportsProviders: [],
        invalidProviders: []
      };
  

      outcomesData = await planOutcomesAjax.getPlanSpecificOutcomes({
        token: $.session.Token,
        assessmentId: planId,
      });

      validationCheck.outcomesData = outcomesData;

      for (const item of outcomesData.planOutcomeExperiences) {
        for (const responsibility of item.planExperienceResponsibilities) {
          const responsibleProvider = responsibility.responsibleProvider;
          (validationCheck.selectedProviders).push(responsibleProvider);
        }
      }

      const paidSupportsIds = outcomesData.paidSupports.map(obj => obj.providerId);
      validationCheck.paidSupportsProviders = paidSupportsIds;

      const invalidProviders = (validationCheck.selectedProviders).filter(number => number !== "" && number !== "%" && !(validationCheck.paidSupportsProviders).includes(number));
      validationCheck.invalidProviders = invalidProviders;
  
      // get a list of the unique outcomeIds
      var uniqueOutcomeIds = Array.from(new Set(outcomesData.planOutcome.map(obj => obj.outcomeId)));
  
      // if any outcome is missing the 'Details to Know' or 'Outcome' section, return false on the validation check
      for (let i = 0; i < outcomesData.planOutcome.length; i++) {
        if (outcomesData.planOutcome[i].details === '') {
          validationCheck.details.push(outcomesData.planOutcome[i].outcomeId);
        }
        if (outcomesData.planOutcome[i].outcome === '') {
          validationCheck.outcome.push(outcomesData.planOutcome[i].outcomeId);
        }
      }
  
      // makes list of all the outcomeIds from the plan outcome experiences and reviews
      const outcomeExperienceOutcomeIds = outcomesData.planOutcomeExperiences.map(
        obj => obj.outcomeId,
      );
      const outcomeReviewOutcomeIds = outcomesData.planReviews.map(obj => obj.outcomeId);
  
      // checks for outcomeIds that may be missing in experiences and reviews (if values are returned, that outcome is missing data)
      const missingOutcomeExperiences = uniqueOutcomeIds.filter(
        num => !outcomeExperienceOutcomeIds.includes(num),
      );
      const missingOutcomeReviews = uniqueOutcomeIds.filter(
        num => !outcomeReviewOutcomeIds.includes(num),
      );
  
      validationCheck.missingExperiences = missingOutcomeExperiences;
      validationCheck.missingReviews = missingOutcomeReviews;
  
      // if an outcome is missing a review or experience, return false on the validation check
      if (missingOutcomeReviews.length > 0 || missingOutcomeExperiences.length > 0) {
        validationCheck.complete = false;
      }
  
      // check the plan progress summary value
      if (outcomesData.planProgressSummary[0]) {
        validationCheck.planProgressSummary = (outcomesData.planProgressSummary[0].progressSummary !== '');
      }

      // if there are invalid providers, return false on the validaton check
      if (validationCheck.invalidProviders.length > 0) {
        validationCheck.complete = false;
      }
  
     // checks if all required data on the page has been filled out
     checkAllOutcomesComplete(validationCheck);
  
      return validationCheck;
    }

    // sets the alerts status based on the completion of the ISP outcomes data
    function updatedIspOutcomesSetAlerts(validationCheck) {
      //checkExperienceProviders(validationCheck);
      checkAllOutcomesComplete(validationCheck);

      // ISP Main Nav and ISP Outcomes Tab 
      const ISPAlertDiv = document.getElementById('navAlertISP');
      const outcomesNav = document.getElementById('outcomesAlert');

      if (validationCheck.complete === true) {
        outcomesNav.style.display = 'none';
        ISPAlertDiv.style.display = 'none';
      } else {
        outcomesNav.style.display = 'block';
        ISPAlertDiv.style.display = 'flex';
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
        outcomesData.planOutcome.length > 0 &&
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

    const invalidProvidersCheck = checkResponsibleProvider(validationCheck.outcomesData, outcomeId, validationCheck.invalidProviders);

      const display = (validationCheck.missingExperiences.includes(outcomeId) || invalidProvidersCheck) ? 'flex' : 'none';
      alertDiv.style.display = display;
      //validationCheck.invalidProviders.length > 0
    }

    // checks if the provider selected for the experience is also in the paid supports
    function checkExperienceProviders(validationCheck) {
      // Extract the first values from the second array objects
      const secondValues = (validationCheck.paidSupportsProviders).map(obj => obj.value);

      // Create a list of values from the first array that don't exist in the second array
      const invalidProviders = validationCheck.selectedProviders.filter(value => value !== '' && value !== '%' && !secondValues.includes(value));
      
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
  
    async function init(planId) {
      ISPValidation(planId);
  
      assessmentValidation(planId);
    }
  
    return {
      createTooltip,
      getAssessmentValidation,
      updateTocSectionHeaders,
      updatedAssessmenteValidation,
      ISPValidation,
      checkAllOutcomesComplete,
      updatedIspOutcomesSetAlerts,
      reviewsValidationCheck,
      experiencesValidationCheck,
      workingSectionCheck,
      updateAnswerWorkingSection,
      tocAssessmentCheck,
      findQuestionIdCategory,
      servicesAndSupportsBtnCheck,
      updateOutcome,
      updateOutcomeDetails,
      checkExperienceProviders,
      checkExperiencesAfterAddingNewPaidSupport,
      init,
    };
  })();