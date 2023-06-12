const planDates = (function () {
  // DOM
  let datesBoxDiv;
  let startDateInput;
  let endDateInput;
  let effectiveStartDateInput;
  let effectiveEndDateInput;
  let reviewDateInput;
  let dateErrorMessage;
  // Data
  let planYearInfo;
  let selectedConsumer;
  // Values
  let planYearStartDate;
  let planYearEndDate;
  let effectiveStartDate;
  let effectiveEndDate;
  let planReviewDate;
  // values changed?
  let dateChanged;
  let reviewDateChanged;
  // cahced dated vals
  let origPlanYearStartDate;
  let origPlanYearEndDate;
  let origEffectiveStartDate;
  let origEffectiveEndDate;
  let origPlanReviewDate;
  // prior plan data
  let priorPlanYearEndDate;
  let priorPlanYearStartDate;
  let priorEffectiveStartDate;
   let reviewDateOpts

  let onChangeCallback;

  function clearData() {
    datesBoxDiv = undefined;
    startDateInput = undefined;
    endDateInput = undefined;
    effectiveStartDateInput = undefined;
    effectiveEndDateInput = undefined;

    planYearInfo = undefined;
    selectedConsumer = undefined;
    planYearStartDate = undefined;
    planYearEndDate = undefined;
    effectiveStartDate = undefined;
    effectiveEndDate = undefined;
    planReviewDate = undefined;
    priorPlanYearEndDate = undefined;
    priorEffectiveStartDate = undefined;
    priorPlanYearStartDate = undefined;
  }
  function showReviewDateWarningPopup() {
    const warningPop = POPUP.build({
      id: 'reviewDateWraningPopup',
      hideX: true,
    });
    const message = document.createElement('p');
    message.innerText = `Review date must fall between effective start date and effective end date.`;

    const okBtn = button.build({
      text: 'ok',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(warningPop);
      },
    });

    warningPop.appendChild(message);
    warningPop.appendChild(okBtn);

    POPUP.show(warningPop);
  }

  // Dates
  //------------------------------------
  function setRevisionPlanDates(planDates) {
    let { effectiveEnd, effectiveStart, planYearStart, planYearEnd, reviewDate } = planDates;
    const today = UTIL.getTodaysDate(true);
    today.setHours(0, 0, 0, 0);

    // split dates and get obj
    effectiveStart = effectiveStart.split(' ')[0];
    effectiveEnd = effectiveEnd.split(' ')[0];
    planYearStart = planYearStart.split(' ')[0];
    planYearEnd = planYearEnd.split(' ')[0];
    reviewDate = reviewDate.split(' ')[0];

    effectiveStartDate = today;
    effectiveEndDate = new Date(effectiveEnd);
    planYearStartDate = new Date(planYearStart);
    planYearEndDate = new Date(planYearEnd);
    //planReviewDate = new Date(reviewDate);
    planReviewDate = dates.addMonths(effectiveEndDate, -1);

    priorPlanYearEndDate = planYearEndDate;
    priorPlanYearStartDate = planYearStartDate;
    priorEffectiveStartDate = new Date(effectiveStart);
  }
  async function setAnnualPlanDates(previousPlans) {
    selectedConsumer = plan.getSelectedConsumer();

    if (!planYearInfo) {
      planYearInfo = await planAjax.getConsumerPlanYearInfo({
        token: $.session.Token,
        consumerId: selectedConsumer.id,
      });
    }

    const { startDay, startMonth } = planYearInfo;
    let latestActivePlan;
    let previousPlanStartDate;
    let previousPlanCreatedOnDate;
    let planStartDate;
    let planEndDate;
    let newReviewDate;

    if (previousPlans && previousPlans.length > 0) {
      const activeConsumerPlans = previousPlans.filter(p => p.active === 'True');
      latestActivePlan = activeConsumerPlans.reduce((a, b) => {
        return new Date(a.planYearStart) > new Date(b.planYearStart) ? a : b;
      });

      previousPlanStartDate = new Date(latestActivePlan.planYearStart);
      previousPlanCreatedOnDate = new Date(latestActivePlan.createdOn);
    }

    if (previousPlanStartDate) {
      planStartDate = dates.addYears(previousPlanStartDate, 1);
      const today = new Date();
      //newReviewDate = dates.addMonths(today, 1);
    } else {
      const today = new Date();

      if (!startDay || !startMonth) {
        planStartDate = today;
      } else {
        const currentYear = today.getFullYear();
        planStartDate = new Date(currentYear, startMonth - 1, startDay, 0);
      }

      //newReviewDate = dates.addYears(today, 1);
    }

    planEndDate = dates.addYears(planStartDate, 1);
    planEndDate = dates.subDays(planEndDate, 1);

    newReviewDate = dates.addMonths(planEndDate, -1);

    planYearStartDate = planStartDate;
    planYearEndDate = planEndDate;
    effectiveStartDate = planYearStartDate;
    effectiveEndDate = planYearEndDate;
    planReviewDate = newReviewDate;
  }
  function setReviewPlanDates(dates) {
    const { startDate, endDate, effectiveStart, effectiveEnd, reviewDate } = dates;

    planYearStartDate = startDate;
    planYearEndDate = endDate;
    effectiveStartDate = effectiveStart;
    effectiveEndDate = effectiveEnd;
    planReviewDate = reviewDate;


    origPlanYearStartDate = startDate;
    origPlanYearEndDate = endDate;
    origEffectiveStartDate = effectiveStart;
    origEffectiveEndDate = effectiveEnd;
    origPlanReviewDate = reviewDate;
  }
  async function updatePlanDates(planId, planType) {
    let success;

    if (reviewDateChanged) {
      const newPlanReviewDate = UTIL.formatDateFromDateObj(planReviewDate);
      await planAjax.updateConsumerPlanReviewDate({
        token: $.session.Token,
        planId: parseInt(planId),
        reviewDate: newPlanReviewDate,
      });
      origPlanReviewDate = planReviewDate;
    }

    if ((planType === 'Annual' || planType === 'a') && dateChanged) {
      const newPlanYearStartDate = UTIL.formatDateFromDateObj(planYearStartDate);
      success = await planAjax.updateConsumerPlanSetAnnualDates({
        token: $.session.Token,
        consumerPlanId: planId,
        newPlanYearStart: newPlanYearStartDate,
      });
      origPlanYearStartDate = planYearStartDate;
      // let cache13 = {eventTypeId : planId, eventType : "plan", eventId : 13};
      //  let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache13);
      //  let cache20 = {eventTypeId : planId, eventType : "plan", eventId : 20};
      // let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache20);
      //  let cache17 = {eventTypeId : planId, eventType : "plan", eventId : 17};
      // let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache17);
    } else if ((planType === 'Revision' || planType === 'r') && dateChanged) {
      const newEffectiveStartDate = UTIL.formatDateFromDateObj(effectiveStartDate);
      const newEffectiveEndDate = UTIL.formatDateFromDateObj(effectiveEndDate);
      success = await planAjax.updateConsumerPlanSetRevisionEffectiveDates({
        token: $.session.Token,
        consumerPlanId: planId,
        newEffectiveStart: newEffectiveStartDate,
        newEffectiveEnd: newEffectiveEndDate,
      });
      origEffectiveStartDate = effectiveStartDate;
      origEffectiveEndDate = effectiveEndDate;
      // let cache14 = {eventTypeId : planId, eventType : "plan", eventId : 14};
      //  let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache14);
      //  let cache19 = {eventTypeId : planId, eventType : "plan", eventId : 19};
      // let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache19);
      //  let cache18 = {eventTypeId : planId, eventType : "plan", eventId : 18};
      // let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache18);
    }

    dateChanged = false;
    reviewDateChanged = false;

    return success;
  }
  function resetPlanDatesToOriginal() {
    planYearStartDate = origPlanYearStartDate;
    planYearEndDate = origPlanYearEndDate;
    effectiveStartDate = origEffectiveStartDate;
    effectiveEndDate = origEffectiveEndDate;
    planReviewDate = origPlanReviewDate;
    
    dateChanged = false;
    reviewDateChanged = false;
  }
  function getPlanYearStartDate() {
    return planYearStartDate;
  }
  function getPlanYearEndDate() {
    return planYearEndDate;
  }
  function getEffectiveStartDate() {
    return effectiveStartDate;
  }
  function getEffectiveEndDate() {
    return effectiveEndDate;
  }
  function getPlanReviewDate() {
    return planReviewDate;
  }

  function dashHandler(dates) {
    planYearStartDate = dates.planYearStartDate;
    planYearEndDate = dates.planYearEndDate;
    effectiveStartDate = dates.effectiveStartDate;
    effectiveEndDate = dates.effectiveEndDate;
    planReviewDate = dates.planReviewDate;
  }

  // Date Box
  //------------------------------------
  function toggleDateInputDisable() {
    let startInput = startDateInput.querySelector('input');
    let endInput = endDateInput.querySelector('input');
    let effectiveStartInput = effectiveStartDateInput.querySelector('input');
    let effectiveEndInput = effectiveEndDateInput.querySelector('input');
    let planType = plan.getCurrentPlanType();

    if (!planType) {
      startDateInput.classList.add('disabled');
      endDateInput.classList.add('disabled');
      effectiveStartDateInput.classList.add('disabled');
      effectiveEndDateInput.classList.add('disabled');

      startInput.setAttribute('tabIndex', '-1');
      endInput.setAttribute('tabIndex', '-1');
      effectiveStartInput.setAttribute('tabIndex', '-1');
      effectiveEndInput.setAttribute('tabIndex', '-1');
      return;
    }

    if (planType === 'a') {
      startDateInput.classList.remove('disabled');

      endDateInput.classList.add('disabled');
      effectiveStartDateInput.classList.add('disabled');
      effectiveEndDateInput.classList.add('disabled');

      startInput.setAttribute('tabIndex', '0');
      endInput.setAttribute('tabIndex', '-1');
      effectiveStartInput.setAttribute('tabIndex', '-1');
      effectiveEndInput.setAttribute('tabIndex', '-1');
      return;
    }

    if (planType === 'r') {
      startDateInput.classList.add('disabled');
      endDateInput.classList.add('disabled');

      effectiveStartDateInput.classList.remove('disabled');
      effectiveEndDateInput.classList.remove('disabled');

      startInput.setAttribute('tabIndex', '-1');
      endInput.setAttribute('tabIndex', '-1');
      effectiveStartInput.setAttribute('tabIndex', '0');
      effectiveEndInput.setAttribute('tabIndex', '0');
      return;
    }
  }
  function validateAnnualDates() {
    const startInput = startDateInput.querySelector('input');
    const planStartTime = planYearStartDate.getTime();
    const templateStartDate = new Date('2020', '0', '1', 0).getTime();

    if (startInput.value === '' || planStartTime < templateStartDate) {
      startDateInput.classList.add('error');
      plan.toggleNewPlanDoneBtn(true);
      return 'error';
    } else {
      startDateInput.classList.remove('error');
      plan.toggleNewPlanDoneBtn();
      return 'success';
    }
  }
  function validateRevisionDates() {
    const effectiveStartInput = effectiveStartDateInput.querySelector('input');
    const effectiveEndInput = effectiveEndDateInput.querySelector('input');
    const priorEffectiveStartTime = priorEffectiveStartDate && priorEffectiveStartDate.getTime();
    const planStartTime = planYearStartDate.getTime();
    const priorStartTime = priorPlanYearStartDate && priorPlanYearStartDate.getTime();
    const planEndTime = planYearEndDate.getTime();
    const effectiveStartTime = effectiveStartDate.getTime();
    const effectiveEndTime = effectiveEndDate.getTime();

    let startTimeError;
    let endTimeError;

    if (priorEffectiveStartTime && effectiveStartTime <= priorEffectiveStartTime) {
      startTimeError = true;
    }
    if (effectiveStartTime < planStartTime) {
      startTimeError = true;
    }
    if (effectiveStartTime > planEndTime) {
      startTimeError = true;
    }
    if (priorStartTime && effectiveStartTime <= priorStartTime) {
      startTimeError = true;
    }
    if (effectiveEndTime < effectiveStartTime) {
      endTimeError = true;
    }
    if (effectiveEndTime > planEndTime) {
      endTimeError = true;
    }

    if (startTimeError) {
      effectiveStartInput.classList.add('error');
    } else {
      effectiveStartInput.classList.remove('error');
    }

    if (endTimeError) {
      effectiveEndInput.classList.add('error');
    } else {
      effectiveEndInput.classList.remove('error');
    }

    if (startTimeError || endTimeError) {
      plan.toggleNewPlanDoneBtn(true);
      return 'error';
    } else {
      plan.toggleNewPlanDoneBtn();
      return 'success';
    }
  }
  function checkRequiredFields() {
    if (!datesBoxDiv) return;

    let planType = plan.getCurrentPlanType();

    if (!planType || planType === '%') {
      plan.toggleNewPlanDoneBtn(true);
      return 'error';
    }

    if (planType === 'a') {
      return validateAnnualDates(planType);
    }

    return validateRevisionDates(planType);
  }
  function handleDateBoxChange(e) {
    const target = e.target.parentElement;

    const isValidDate = UTIL.validateDateFromInput(e.target.value);
    let planType = plan.getCurrentPlanType();
    let hasError = false;

    switch (target) {
      case startDateInput: {
        if (e.target.value && planType === 'a') {
          if (!isValidDate) {
            startDateInput.classList.add('error');
            hasError = true;
            return;
          } else {
            startDateInput.classList.remove('error');
          }

          let newStartDate = e.target.value.split('-');
          newStartDate = new Date(newStartDate[0], newStartDate[1] - 1, newStartDate[2], 0);

          let newEndDate = dates.addYears(newStartDate, 1);
          newEndDate = dates.subDays(newEndDate, 1);

          // set new dates
          planYearStartDate = newStartDate;
          planYearEndDate = newEndDate;
          effectiveStartDate = planYearStartDate;
          effectiveEndDate = planYearEndDate;

          // check review date
          // const isBeforeEnd = dates.isBefore(planReviewDate, effectiveEndDate);
          // const isAfterStart = dates.isAfter(planReviewDate, effectiveStartDate);
          // if (!isBeforeEnd || !isAfterStart) {
          //   showReviewDateWarningPopup();
          //   reviewDateInput.classList.add('error');
          //   hasError = true;
          //   // use below if we want to reset date for them to orig requirements
          //   //planReviewDate = dates.addMonths(effectiveEndDate, -1);
          // }

          const endInput = endDateInput.querySelector('input');
          const effectiveEndInput = effectiveEndDateInput.querySelector('input');
          const effectiveStartInput = effectiveStartDateInput.querySelector('input');

          endInput.value = UTIL.formatDateFromDateObj(newEndDate);
          effectiveEndInput.value = UTIL.formatDateFromDateObj(newEndDate);
          effectiveStartInput.value = UTIL.formatDateFromDateObj(newStartDate);

          dateChanged = true;
        }
        break;
      }
      case effectiveStartDateInput: {
          if (!isValidDate) {
            const effectiveStartInput = effectiveStartDateInput.querySelector('input');
            effectiveStartInput.classList.add('error');
            if (onChangeCallback) onChangeCallback(false);
            hasError = true;
            return;
          }
          const newEffectiveStartDate = e.target.value.split('-');
          effectiveStartDate = new Date(
            newEffectiveStartDate[0],
            newEffectiveStartDate[1] - 1,
            newEffectiveStartDate[2],
            0,
          );

          // make sure review date falls between effective start and effective end dates
          const isBeforeEnd = dates.isBefore(planReviewDate, effectiveEndDate);
          const isAfterStart = dates.isAfter(planReviewDate, effectiveStartDate);
          if (!isBeforeEnd || !isAfterStart) {
            dateErrorMessage.innerText = `Review date must fall between effective start date and effective end date.`;
            dateErrorMessage.classList.remove('hidden');
            reviewDateInput.classList.add('error');
            hasError = true;
            break;
          } else {
            reviewDateInput.classList.remove('error');
            dateErrorMessage.innerText = '';
            dateErrorMessage.classList.add('hidden');
          }

          dateChanged = true;

        break;
      }
      case effectiveEndDateInput: {
          if (!isValidDate) {
            const effectiveEndInput = effectiveEndDateInput.querySelector('input');
            effectiveEndInput.classList.add('error');
            if (onChangeCallback) onChangeCallback(false);
            hasError = true;
            return;
          }
          const newEffectiveEndDate = e.target.value.split('-');
          effectiveEndDate = new Date(
            newEffectiveEndDate[0],
            newEffectiveEndDate[1] - 1,
            newEffectiveEndDate[2],
            0,
          );

          // make sure review date falls between effective start and effective end dates
          const isBeforeEnd = dates.isBefore(planReviewDate, effectiveEndDate);
          const isAfterStart = dates.isAfter(planReviewDate, effectiveStartDate);
          if (!isBeforeEnd || !isAfterStart) {
            dateErrorMessage.innerText = `Review date must fall between effective start date and effective end date.`;
            dateErrorMessage.classList.remove('hidden');
            reviewDateInput.classList.add('error');
            hasError = true;
            break;
          } else {
            reviewDateInput.classList.remove('error');
            dateErrorMessage.innerText = '';
            dateErrorMessage.classList.add('hidden');
          }

          dateChanged = true;
          
        break;
      }
      case reviewDateInput: {
        // effectiveStartDate = planYearStartDate;
        // effectiveEndDate = planYearEndDate;
          if (!isValidDate) {
            dateErrorMessage.innerText = `Review date must fall between effective start date and effective end date.`;
            dateErrorMessage.classList.remove('hidden');
            reviewDateInput.classList.add('error');
            hasError = true;
            break;
          }

          let newReviewDate = e.target.value.split('-');
          newReviewDate = new Date(newReviewDate[0], newReviewDate[1] - 1, newReviewDate[2], 0);

          // make sure review date falls between effective start and effective end dates
          const isBeforeEnd = dates.isBefore(newReviewDate, effectiveEndDate);
          const isAfterStart = dates.isAfter(newReviewDate, effectiveStartDate);
          if (!isBeforeEnd || !isAfterStart) {
            dateErrorMessage.innerText = `Review date must fall between effective start date and effective end date.`;
            dateErrorMessage.classList.remove('hidden');
            reviewDateInput.classList.add('error');
            hasError = true;
            break;
          } else {
            reviewDateInput.classList.remove('error');
            dateErrorMessage.innerText = '';
            dateErrorMessage.classList.add('hidden');
          }

          // cache original date
          //origPlanReviewDate = planReviewDate;
          // set new date
          planReviewDate = newReviewDate;

          const reviewInput = reviewDateInput.querySelector('input');
          reviewInput.value = UTIL.formatDateFromDateObj(newReviewDate);
          reviewDateChanged = true;
      }
    }

    const fieldsValid = checkRequiredFields();
    const isValid = fieldsValid === 'error' || hasError ? false : true;
    if (onChangeCallback) onChangeCallback(isValid);
  }
  function buildDatesBox(callback) {
    datesBoxDiv = document.createElement('div');
    datesBoxDiv.classList.add('planSetupDates');
    if (callback) onChangeCallback = callback;

    let startDateOpts = {
      label: 'Plan Start',
      type: 'date',
      attributes: [{ key: 'data-plan-date-input', value: 'startDateInput' }],
    };
    let endDateOpts = {
      label: 'Plan End',
      type: 'date',
      attributes: [{ key: 'data-plan-date-input', value: 'endDateInput' }],
    };
    let effectiveStartDateOpts = {
      label: 'Effective Start',
      type: 'date',
      attributes: [{ key: 'data-plan-date-input', value: 'effectiveStartDateInput' }],
    };
    let effectiveEndDateOpts = {
      label: 'Effective End',
      type: 'date',
      attributes: [{ key: 'data-plan-date-input', value: 'effectiveEndDateInput' }],
    };
    reviewDateOpts = {
      label: 'Review',
      type: 'date',
      attributes: [{ key: 'data-plan-date-input', value: 'reviewDateInput' }],
    };

    if (planYearStartDate) {
      let formatedSD = UTIL.formatDateFromDateObj(origPlanYearStartDate);
      if (!origPlanYearStartDate) {
        formatedSD = UTIL.formatDateFromDateObj(planYearStartDate);
      }
      startDateOpts.value = formatedSD;
    }
    if (effectiveStartDate) {
      let formatedESD = UTIL.formatDateFromDateObj(origEffectiveStartDate);
      if (!origEffectiveStartDate) {
        formatedESD = UTIL.formatDateFromDateObj(effectiveStartDate);
      }
      effectiveStartDateOpts.value = formatedESD;
    }
    if (planYearEndDate) {
      let formatedED = UTIL.formatDateFromDateObj(origPlanYearEndDate);
      if (!origPlanYearEndDate) {
        formatedED = UTIL.formatDateFromDateObj(planYearEndDate);
      }
      endDateOpts.value = formatedED;
    }
    if (effectiveEndDate) {
      let formatedEED = UTIL.formatDateFromDateObj(origEffectiveEndDate);
      if (!origEffectiveEndDate) {
        formatedEED = UTIL.formatDateFromDateObj(effectiveEndDate);
      }
      effectiveEndDateOpts.value = formatedEED;
    }
    if (planReviewDate) {
      let formatedRD = UTIL.formatDateFromDateObj(origPlanReviewDate);
      if (!origPlanReviewDate) {
        formatedRD = UTIL.formatDateFromDateObj(planReviewDate);
      }
      reviewDateOpts.value = formatedRD;
    }

    startDateInput = input.build(startDateOpts);
    endDateInput = input.build(endDateOpts);
    effectiveStartDateInput = input.build(effectiveStartDateOpts);
    effectiveEndDateInput = input.build(effectiveEndDateOpts);
    reviewDateInput = input.build(reviewDateOpts);
    dateErrorMessage = document.createElement('p');
    dateErrorMessage.classList.add('dateErrorMessage', 'hidden');

    datesBoxDiv.appendChild(startDateInput);
    datesBoxDiv.appendChild(endDateInput);
    datesBoxDiv.appendChild(effectiveStartDateInput);
    datesBoxDiv.appendChild(effectiveEndDateInput);
    datesBoxDiv.appendChild(reviewDateInput);
    datesBoxDiv.appendChild(dateErrorMessage);

    toggleDateInputDisable();
    checkRequiredFields();

    datesBoxDiv.addEventListener('change', handleDateBoxChange);

    return datesBoxDiv;
  }

  function updateBoxDateValues() {
    const startDateInput = document.querySelector('[data-plan-date-input="startDateInput"]');
    const formatedSD = UTIL.formatDateFromDateObj(origPlanYearStartDate);
    startDateInput.value = formatedSD;

    const endDateIinput = document.querySelector('[data-plan-date-input="endDateInput"]');
    const formatedED = UTIL.formatDateFromDateObj(origPlanYearEndDate);
    endDateIinput.value = formatedED;

    const effectiveStartDateInput = document.querySelector('[data-plan-date-input="effectiveStartDateInput"]');
    const formatedESD = UTIL.formatDateFromDateObj(origEffectiveStartDate);
    effectiveStartDateInput.value = formatedESD;

    const effectiveEndDateInput = document.querySelector('[data-plan-date-input="effectiveEndDateInput"]');
    const formatedEED = UTIL.formatDateFromDateObj(origEffectiveEndDate);
    effectiveEndDateInput.value = formatedEED;

    const reviewDateInput = document.querySelector('[data-plan-date-input="reviewDateInput"]');
    const formatedRD = UTIL.formatDateFromDateObj(origPlanReviewDate);
    reviewDateInput.value = formatedRD;
  }

  return {
    buildDatesBox,
    updateBoxDateValues,
    clearData,
    checkRequiredFields,
    dashHandler,
    getPlanYearStartDate,
    getPlanYearEndDate,
    getEffectiveStartDate,
    getEffectiveEndDate,
    getPlanReviewDate,
    setAnnualPlanDates,
    setRevisionPlanDates,
    setReviewPlanDates,
    resetPlanDatesToOriginal,
    toggleDateInputDisable,
    updatePlanDates,
    validateAnnualDates,
    validateRevisionDates,
  };
})();
