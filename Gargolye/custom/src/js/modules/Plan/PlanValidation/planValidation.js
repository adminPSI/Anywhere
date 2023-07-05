const planValidation = (function() {
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

      function checkAllOutcomesComplete(validationCheck) {
        // checks if plan has an outcome and plan summary, and all outcomes have an experience and review
        if (validationCheck.details.length === 0 && validationCheck.experiences.length === 0 && validationCheck.reviews.length === 0 && validationCheck.planProgressSummary === true && outcomesData.planOutcome.length > 0) {
            validationCheck.complete = true;
        } else {
            validationCheck.complete = false;
        }

        return validationCheck;
      }

      function checkPlanProgressSummary (validationCheck, progressSummaryText) {
        if (progressSummaryText !== '') {
            validationCheck.planProgressSummary = true;
          }

          return validationCheck;
      }

      function reviewsValidationCheck(validationCheck, outcomeId, alertDiv) {
        // if an outcome is missing a review, add alert/ else remove alert
        if (validationCheck.reviews.includes(outcomeId)) {
          alertDiv.style.display = 'flex';
        } else {
          alertDiv.style.display = 'none';
        }
      }

      function experiencesValidationCheck(validationCheck, outcomeId, alertDiv) {
        // if an outcome is missing an experience, add alert/ else remove alert
        if (validationCheck.experiences.includes(outcomeId)) {
            alertDiv.style.display = 'flex';
        } else {
            alertDiv.style.display = 'none';
        }
      }

      function updateOutcomeDetails(outcomeId, validationCheck, emptyString) {
        if (emptyString) {
            validationCheck.details.push(outcomeId)
        } else {
            // removes this outcome id from the details array in the validation check
            validationCheck.details = (validationCheck.details).filter(id => id !== outcomeId);
        }

        return validationCheck;
      }
      
    async function outcomesValidation(planId) {
        let validationCheck = {
            details: [],
            experiences: [],
            reviews: [],
            planProgressSummary : false
        }; 
        validationCheck.complete = true;

       outcomesData = await planOutcomesAjax.getPlanSpecificOutcomes({
        token: $.session.Token,
        assessmentId: planId,
      });
    
      validationCheck.outcomesData = outcomesData;

      // get a list of the unique outcomeIds
      var uniqueOutcomeIds = Array.from(new Set((outcomesData.planOutcome).map(obj => obj.outcomeId)));

      

      // if any outcome is missing the 'Details to Know' section, return false on the validation check
      for (let i = 0; i < (outcomesData.planOutcome).length; i++) {
        if ((outcomesData.planOutcome)[i].details === '') {
            validationCheck.complete = false;
            validationCheck.details.push((outcomesData.planOutcome)[i].outcomeId);
        }
      }

      // makes list of all the outcomeIds from the plan outcome experiences and reviews
      const outcomeExperienceOutcomeIds = (outcomesData.planOutcomeExperiences).map(obj => obj.outcomeId);
      const outcomeReviewOutcomeIds = (outcomesData.planReviews).map(obj => obj.outcomeId);

      // checks for outcomeIds that may be missing in experiences and reviews (if values are returned, that outcome is missing data)
      const missingOutcomeExperiences = uniqueOutcomeIds.filter(num => !outcomeExperienceOutcomeIds.includes(num));
      const missingOutcomeReviews = uniqueOutcomeIds.filter(num => !outcomeReviewOutcomeIds.includes(num));

      validationCheck.experiences = missingOutcomeExperiences;
      validationCheck.reviews = missingOutcomeReviews;

      // if an outcome is missing a review or experience, return false on the validation check
      if (missingOutcomeReviews.length > 0 || missingOutcomeExperiences.length > 0) {
        validationCheck.complete = false;
      }

      checkPlanProgressSummary(validationCheck, (outcomesData.planOutcome)[0].progressSummary);

      checkAllOutcomesComplete(validationCheck)

      return validationCheck;
    }

    function outcomeTabsValidationCheck(outcomeId, validationCheck, overrideCheck, emptyString) {
      checkAllOutcomesComplete(validationCheck);

      const ISPnav = document.getElementById('tabNav1');
      const pDiv = ISPnav.querySelector('p');
      const outcomesNav = document.getElementById('outcomesAlert');

      // if override is true, then set alerts to show/ if false remove the alerts
      if (overrideCheck === true) {
        updateOutcomeDetails(outcomeId, validationCheck, emptyString);
        checkAllOutcomesComplete(validationCheck);

        // if the details section for this outcome is set to an empty string, set the alerts
        if (validationCheck.details.length > 0) {
            outcomesNav.style.display = 'block';
            pDiv.innerHTML = `<p>ISP ${icons.error}<p>`;
        }

        // if the details array in the validation check is not 0, and the rest of the outcome is not complete, then the alerts should still be there
        if (validationCheck.details.length === 0 && validationCheck.complete === true) {
          outcomesNav.style.display = 'none';
          pDiv.innerHTML = `<p>ISP<p>`;
        }
      } else {
        if (validationCheck.complete === true) {
          outcomesNav.style.display = 'none';
          pDiv.innerHTML = `<p>ISP<p>`;
        } else {
          outcomesNav.style.display = 'block';
          pDiv.innerHTML = `<p>ISP ${icons.error}<p>`;
        }
      }

      return validationCheck;
    }

    return {
        createTooltip,
        outcomesValidation,
        outcomeTabsValidationCheck,
        reviewsValidationCheck,
        experiencesValidationCheck
      };
})();