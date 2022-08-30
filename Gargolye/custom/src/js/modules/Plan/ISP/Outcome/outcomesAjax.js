const planOutcomesAjax = (() => {
  // GET
  //------------------------------------
  async function getPlanSpecificOutcomes(retrieveData) {
    // string token, string assessmentId, integer targetAssessmentVersionId
    retrieveData.targetAssessmentVersionId = 0;
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanSpecificOutcomes/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getPlanSpecificOutcomesResult;
    } catch (error) {
      console.log(error);
    }
  }

  // INSERT
  //------------------------------------
  async function insertPlanOutcomeProgressSummary(retrieveData) {
    // will return progress summary id
    // string token,
    // integer planId,
    // string progressSummary
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanOutcomeProgressSummary/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanOutcomeProgressSummaryResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPlanOutcome(retrieveData) {
    // string token,
    // string assessmentId,
    // string outcome,
    // string details,
    // string history,
    // string sectionId,
    // string outcomeOrder
    // int status,
    // string carryOverReason

    retrieveData.status = parseInt(retrieveData.status);

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanOutcome/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanOutcomeResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPlanOutcomesExperience(retrieveData) {
    // string token,
    // string outcomeId,
    // string[] howHappened,
    // string[] whatHappened,
    // string[] experienceOrder
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanOutcomesExperience/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanOutcomesExperienceResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPlanOutcomeExperienceResponsibility(retrieveData) {
    // string token,
    // string experienceId,
    // int[] responsibleContact,
    // int[] responsibleProvider,
    // int[] whenHowOftenFrequency,
    // string[] whenHowOftenValue,
    // string[] whenHowOftenText,
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanOutcomeExperienceResponsibility/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanOutcomeExperienceResponsibilityResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function insertPlanOutcomesReview(retrieveData) {
    // long outcomeId,
    // string[] whatWillHappen,
    // string[] whenToCheckIn,
    // string[] whoReview,
    // string[] reviewOrder
    // integer[] contactId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertPlanOutcomesReview/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.insertPlanOutcomesReviewResult;
    } catch (error) {
      console.log(error);
    }
  }

  // UPDATE
  //------------------------------------
  async function updatePlanOutcomeProgressSummary(retrieveData) {
    // string token,
    // integer progressSummaryId,
    // string progressSummary
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcomeProgressSummary/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomeProgressSummaryResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanOutcome(retrieveData) {
    // string token,
    // string assessmentId,
    // string outcomeId, (new)
    // string sectionId,
    // string outcome,
    // string details,
    // string history,
    // int status,
    // string carryOverReason

    retrieveData.status = parseInt(retrieveData.status);

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcome/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomeResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanOutcomesExperience(retrieveData) {
    // string token,
    // string outcomeId,
    // string[] experienceIds,
    // string[] howHappened,
    // string[] whatHappened,
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcomesExperience/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomesExperienceResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanOutcomeExperienceResponsibility(retrieveData) {
    // int[] responsibilityIds,
    // int[] responsibleContact,
    // int[] responsibleProvider,
    // string[] whenHowOftenValue,
    // int[] whenHowOftenFrequency,
    // string[] whenHowOftenText,
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcomeExperienceResponsibility/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomeExperienceResponsibilityResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanOutcomesReview(retrieveData) {
    // long outcomeId,
    // string[] reviewIds,
    // string[] whatWillHappen,
    // string[] whenToCheckIn,
    // string[] whoReview,
    // integer[] contactId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcomesReview/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomesReviewResult;
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE
  //------------------------------------
  async function deletePlanOutcomeProgressSummary(retrieveData) {
    // string token,
    // integer progressSummaryId,
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deletePlanOutcomeProgressSummary/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePlanOutcomeProgressSummaryResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deletePlanOutcome(retrieveData) {
    // string token,
    // string outcomeId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deletePlanOutcome/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePlanOutcomeResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deletePlanOutcomeExperience(retrieveData) {
    // string token,
    // string outcomeId,
    // string experienceId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deletePlanOutcomeExperience/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePlanOutcomeExperienceResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deletePlanOutcomeExperienceResponsibility(retrieveData) {
    // string token,
    // string responsibilityId,
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deletePlanOutcomeExperienceResponsibility/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePlanOutcomeExperienceResponsibilityResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function deletePlanOutcomeReview(retrieveData) {
    // string token,
    // string outcomeId,
    // string reviewId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deletePlanOutcomeReview/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.deletePlanOutcomeReviewResult;
    } catch (error) {
      console.log(error);
    }
  }

  // row re-order
  //------------------
  async function updateOutcomesReviewOrder(retrieveData) {
    // string token,
    // integer outcomeId,
    // integer reviewId
    // integer newPos,
    // integer oldPos

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcomesReviewOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomesReviewOrderResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updatePlanOutcomesExperienceOrder(retrieveData) {
    // string token,
    // integer outcomeId,
    // integer experienceId
    // integer newPos,
    // integer oldPos

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanOutcomesExperienceOrder/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanOutcomesExperienceOrderResult;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getPlanSpecificOutcomes,
    insertPlanOutcome,
    insertPlanOutcomesExperience,
    insertPlanOutcomeExperienceResponsibility,
    insertPlanOutcomesReview,
    updatePlanOutcome,
    updatePlanOutcomesExperience,
    updatePlanOutcomeExperienceResponsibility,
    updatePlanOutcomesReview,
    deletePlanOutcome,
    deletePlanOutcomeExperience,
    deletePlanOutcomeReview,
    deletePlanOutcomeExperienceResponsibility,
    updateOutcomesReviewOrder,
    updatePlanOutcomesExperienceOrder,
    deletePlanOutcomeProgressSummary,
    updatePlanOutcomeProgressSummary,
    insertPlanOutcomeProgressSummary,
  };
})();
