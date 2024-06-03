const plan = (function () {
  // DOM
  // -----------------
  // plan landing
  let landingPage;
  let overviewTable;
  let newPlanBtn;
  let assignCaseLoadBtn;
  let downloadPlanBtn;
  // new plan setup
  let planSetupPage;
  let setupWrap;
  let prevPlanTable;
  let datesBoxDiv;
  let doneBtn;
  let addedMemberPopup;
  // main plan page
  let planHeader;
  let planHeaderButtons;
  let planHeaderGeneralInfoBar;
  let morePopup;
  let morePopupMenu;
  let editDatesScreen;
  let updateStatusScreen;
  let deleteScreen;
  let reactivateScreen;
  let addWorkflowScreen;
  let reportsScreen;
  let reportsAttachmentScreen;
  let DODDScreen;
  let portalScreen;
  let sendToDODDScreen;
  let changePlanTypeScreen;
  let generalInfoBar;

  // DATA
  // -----------------
  let previousPlansData;
  let dropdownData;
  let retrieveData;
  // general info
  let selectedConsumer;
  let planId;
  let planType;
  let planStatus;
  let planActiveStatus;
  let revisionNumber;
  let sentToOnet;
  let downloadedFromSalesforce;
  // prior plan data
  let hasPreviousPlans;
  let priorConsumerPlanId;
  let thisPreviousPlanId = 0;
  // more popup
  let selectedWorkflows;
  //let selectedPreviousWfForms;
  let addWorkflowDoneBtn;
  let planAttBody;
  let workflowAttBody;
  let signatureAttBody;
  let portalPlanAttBody;
  let portalWorkflowAttBody;
  let portalSignatureAttBody;
  let DODDplanAttBody;
  let DODDsignAttBody;
  let DODDworkflowAttBody;
  // runReports screen
  let include = 'N';
  let includeCheckbox; //
  // plan validation
  let ISPValidationCheck;

  async function launchWorkflowViewer() {
    let processId =
      planType === 'Revision' ? WorkflowProcess.CONSUMER_PLAN_REVISION : WorkflowProcess.CONSUMER_PLAN_ANNUAL;
    await WorkflowViewerComponent.open(processId, planId);
  }
  async function dashHandler(consumer, pId, stepId) {
    function pageLoadCallback() {
      let target = document.querySelector(`.wf-steps-container[data-id='${stepId}']`);
      let container = document.querySelector('.planWorkflow');
      if (target) container.scrollTop = target.offsetTop;
    }
    let {
      consumer: { consumerId, consumerFirstName, consumerLastName },
    } = consumer;

    setActiveModuleAttribute('plan');
    $.loadedApp = 'plan';
    DOM.clearActionCenter();
    DOM.scrollToTopOfPage();
    UTIL.toggleMenuItemHighlight('plan');

    // mock consumerCard
    let card = roster2.buildConsumerCard({
      FN: consumerFirstName,
      LN: consumerLastName,
      id: consumerId,
    });

    selectedConsumer = { card: card, id: consumerId };

    const plans = await planAjax.getConsumerPlans({
      token: $.session.Token,
      consumerId: selectedConsumer.id,
    });
    const pd = plans.filter(p => p.consumerPlanId === pId)[0];
    const assessmentData = await assessment.getAssessmentData(pd.consumerPlanId);
    const type = pd.planType === 'A' ? 'a' : 'r';
    const effectiveStart = pd.effectiveStart.split(' ')[0];
    const effectiveEnd = pd.effectiveEnd.split(' ')[0];
    const isActive = pd.active === 'True' ? true : false;

    planId = pd.consumerPlanId;
    planType = type;
    planStatus = pd.planStatus ? pd.planStatus : 'D';
    planActiveStatus = isActive;

    // TODO: below will need changed to call buildPlanPage()
    planDates.dashHandler({
      planYearStartDate: new Date(pd.planYearStart.split(' ')[0]),
      planYearEndDate: new Date(pd.planYearEnd.split(' ')[0]),
      effectiveStartDate: new Date(pd.effectiveStart.split(' ')[0]),
      effectiveEndDate: new Date(pd.effectiveEnd.split(' ')[0]),
      planReviewDate: pd.reviewDate ? new Date(pd.reviewDate.split(' ')[0]) : '',
    });
    await buildPlanPage(['w', 'a', 'i'], pageLoadCallback);
    // TODO: end

    // setTimeout(() => {

    // }, 1000);
  }

  // Helpers
  //---------------------------------------------
  function handleActionNavEvent(target) {
    const targetAction = target.dataset.actionNav;

    switch (targetAction) {
      case 'miniRosterDone': {
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        selectedConsumer = roster2.getActiveConsumers()[0];
        if ($.session.applicationName === 'Advisor') {
          planAjax.getConsumerPeopleId(selectedConsumer.id, function (results) {
            $.session.planPeopleId = results[0].id;
            selectedConsumer.consumerId = selectedConsumer.id;
            selectedConsumer.id = $.session.planPeopleId;
            loadLandingPage();
            DOM.toggleNavLayout();
          });
        } else {
          loadLandingPage();
          DOM.toggleNavLayout();
        }
        break;
      }
      case 'miniRosterCancel': {
        DOM.toggleNavLayout();
        loadApp('home');
        break;
      }
    }
  }
  //-- get
  function getSelectedConsumer() {
    return selectedConsumer;
  }
  function getCurrentPlanId() {
    return planId;
  }
  function getCurrentPlanType() {
    return planType;
  }
  function getPlanStatus() {
    return planStatus;
  }
  function getPlanActiveStatus() {
    return planActiveStatus;
  }
  function getPlanDropdownData() {
    return dropdownData;
  }
  function getHasPreviousPlans() {
    return previousPlansData ? (previousPlansData.length > 0 ? true : false) : false;
  }
  function getISPValidation() {
    return ISPValidationCheck;
  }
  //-- set
  function setSelectedConsumer(consumer) {
    selectedConsumer = consumer;
  }
  function setPlanId(newPlanId) {
    planId = newPlanId;
  }
  function setPlanType(newPlanType) {
    planType = newPlanType;
  }
  function setPlanStatus(newPlanStatus) {
    if (planStatus !== newPlanStatus) {
      planStatus = newPlanStatus;

      if (planStatus === 'D') {
        // do stuff
      } else {
        // do stuff
      }

      //isp informed consent
      // informedConsent.planStatusChange();
      //isp signatures
      // planSignature.planStatusChange();
      //isp contact information
      // contactInformation.planStatusChange();
    }
  }
  function setRevisionNumber(revNum) {
    revisionNumber = revNum;
  }
  function setPlanActiveStatus(newActiveStatus) {
    planActiveStatus = newActiveStatus;
  }
  //-- clear
  function clearAllData() {
    selectedConsumer = undefined;
    clearAllDataKeepConsumer();
  }
  function clearAllDataKeepConsumer() {
    planId = undefined;
    planType = undefined;
    planStatus = undefined;
    planActiveStatus = undefined;
    revisionNumber = undefined;
    downloadedFromSalesforce = undefined;

    hasPreviousPlans = undefined;
    priorConsumerPlanId = undefined;

    landingPage = undefined;
    overviewTable = undefined;
    newPlanBtn = undefined;
    planSetupPage = undefined;
    setupWrap = undefined;
    prevPlanTable = undefined;
    datesBoxDiv = undefined;
    doneBtn = undefined;
    planHeader = undefined;
    planHeaderButtons = undefined;
    planHeaderGeneralInfoBar = undefined;
    morePopup = undefined;
    morePopupMenu = undefined;
    editDatesScreen = undefined;
    updateStatusScreen = undefined;
    deleteScreen = undefined;
    reactivateScreen = undefined;
    addWorkflowScreen = undefined;
    sentToOnet = '';

    planDates.clearData();
    assessmentCard.clearData();
  }
  function clearPlanId() {
    planId = undefined;
  }

  // Plan Page - Q&A, ISP, Workflow, etc...
  //---------------------------------------------
  // more popup
  function refreshMoreMenu() {
    const newMorePopupMenu = buildMorePopupMenu();
    menuInnerWrap.replaceChild(newMorePopupMenu, morePopupMenu);
    morePopupMenu = newMorePopupMenu;
  }
  function buildEditDatesScreen() {
    const screen = document.createElement('div');
    screen.id = 'editDatesScreen';
    screen.classList.add('screen');

    const validDates = isValid => {
      if (isValid) {
        updateBtn.classList.remove('disabled');
        updateBtn.disabled = false;
      } else {
        updateBtn.classList.add('disabled');
        updateBtn.disabled = true;
      }
    };
    const dateBoxDiv = planDates.buildDatesBox(validDates);

    const updateBtn = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        const success = await planDates.updatePlanDates(planId, planType);
        // const message = success === 1 ? 'Dates successfully changed.' : 'Plan dates were not able to be changed.';
        const message = 'Dates successfully changed.';
        const successDiv = successfulSave.get(message, true);
        // if (success !== 1) successDiv.classList.add('error');

        dateBoxDiv.style.display = 'none';
        btnWrap.style.display = 'none';
        screen.appendChild(successDiv);

        setTimeout(() => {
          screen.removeChild(successDiv);

          dateBoxDiv.removeAttribute('style');
          btnWrap.removeAttribute('style');

          screen.classList.remove('visible');
          morePopupMenu.classList.add('visible');

          refreshGeneralInfo();
          assessmentCard.refreshAssessmentCard({
            planStatus,
            planId,
            isActive: planActiveStatus,
          });
          ISP.refreshISP(planId);
        }, 1000);
        //  let cache = {eventTypeId : planId, eventType : "plan", eventId : 13};
        //  let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        planDates.resetPlanDatesToOriginal();
        planDates.updateBoxDateValues();
        screen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    btnWrap.appendChild(updateBtn);
    btnWrap.appendChild(cancelBtn);

    screen.appendChild(dateBoxDiv);
    screen.appendChild(btnWrap);

    return screen;
  }
  function buildUpdateStatusScreen() {
    let newStatus;

    const screen = document.createElement('div');
    screen.id = 'updateStatusScreen';
    screen.classList.add('screen');

    const currentStatus = document.createElement('div');
    currentStatus.classList.add('currentStatus');
    currentStatus.innerHTML = `
      <p>Current Status:</p> ${planStatus === 'D' ? '<p>Draft</p>' : '<p>Complete</p>'}
    `;

    const statusDropdown = dropdown.build({
      className: `statusDropdown`,
      label: 'Status',
      style: 'secondary',
    });
    const dropdownData = [
      { value: 'D', text: 'Draft' },
      { value: 'C', text: 'Complete' },
    ];
    dropdown.populate(statusDropdown, dropdownData, planStatus);
    statusDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      newStatus = selectedOption.value;
      if (newStatus === planStatus) {
        updateBtn.classList.add('disabled');
      } else {
        updateBtn.classList.remove('disabled');
      }
    });

    const updateBtn = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        let success;

        if (newStatus !== planStatus) {
          success = await planAjax.updateConsumerPlanSetStatus({
            token: $.session.Token,
            consumerPlanId: planId,
            status: newStatus,
          });
          planStatus = newStatus;
        }

        const message = success === 1 ? 'Status successfully updated.' : 'Status was not able to be updated.';
        const successDiv = successfulSave.get(message, true);
        if (success !== 1) successDiv.classList.add('error');

        currentStatus.style.display = 'none';
        statusDropdown.style.display = 'none';
        btnWrap.style.display = 'none';
        screen.appendChild(successDiv);

        setTimeout(() => {
          screen.removeChild(successDiv);

          currentStatus.removeAttribute('style');
          statusDropdown.removeAttribute('style');
          btnWrap.removeAttribute('style');

          refreshMoreMenu();
          screen.classList.remove('visible');
          morePopupMenu.classList.add('visible');

          if (success === 1) {
            assessmentCard.refreshAssessmentCard({
              planStatus,
              planId,
              isActive: planActiveStatus,
            });
            ISP.refreshISP(planId);
          }
        }, 1000);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        screen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    btnWrap.appendChild(updateBtn);
    btnWrap.appendChild(cancelBtn);

    screen.appendChild(currentStatus);
    screen.appendChild(statusDropdown);
    screen.appendChild(btnWrap);

    return screen;
  }
  function buildDeleteScreen() {
    const screen = document.createElement('div');
    screen.id = 'deleteScreen';
    screen.classList.add('screen');

    const warningMessage = document.createElement('div');
    warningMessage.classList.add('warningMessage');

    const effectiveStart = planDates.getEffectiveStartDate();
    const formatedDate = UTIL.formatDateFromDateObj(effectiveStart);
    const splitFormatedDate = formatedDate.split('-');
    let esDate = `${splitFormatedDate[1]}/${splitFormatedDate[2]}/${splitFormatedDate[0].substring(2)}`;

    if (planType === 'Annual' || planType === 'a') {
      warningMessage.innerHTML = `
        <p>Are you sure you want to delete the entire Annual plan effective on ${esDate} for 
        ${getConsumerNameFromCard(selectedConsumer)}?</p>
      `;
    } else {
      warningMessage.innerHTML = `
        <p>Are you sure you want to delete the entire Revision ${revisionNumber} plan effective on ${esDate} for 
        ${getConsumerNameFromCard(selectedConsumer)}?</p>
      `;
    }

    const yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        const success = await planAjax.deletePlan({
          token: $.session.Token,
          consumerPlanId: planId,
        });
        const message = success === 'success' ? 'Plan was deleted.' : 'Unable to delete plan.';
        const successDiv = successfulSave.get(message, true);
        if (success !== 'success') {
          successDiv.classList.add('error');
          return;
        }

        const outcomes = [...document.querySelectorAll('.outcome')];
        outcomes.forEach(async outcome => {
          const isNew = outcome.dataset.newOutcome;
          const outcomeId = outcome.id;

          if (isNew === 'false') {
            await planOutcomesAjax.deletePlanOutcome({
              token: $.session.Token,
              outcomeId: outcomeId,
            });
          }
        });

        warningMessage.style.display = 'none';
        btnWrap.style.display = 'none';
        screen.appendChild(successDiv);

        setTimeout(function () {
          screen.removeChild(successDiv);

          warningMessage.removeAttribute('style');
          btnWrap.removeAttribute('style');

          screen.classList.remove('visible');
          morePopupMenu.classList.add('visible');

          if (success === 'success') {
            POPUP.hide(morePopup);
            loadLandingPage();
          }
        }, 1000);
        // let cache27 = {eventTypeId : planId, eventType : "plan", eventId : 27};
        // let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache27);
        // let cache28 = {eventTypeId : planId, eventType : "plan", eventId : 28};
        // let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache28);
      },
    });

    const noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        screen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    screen.appendChild(warningMessage);
    screen.appendChild(btnWrap);

    return screen;
  }
  function buildReactivateScreen() {
    const screen = document.createElement('div');
    screen.id = 'reactivateScreen';
    screen.classList.add('screen');

    const warningMessage = document.createElement('div');
    warningMessage.classList.add('warningMessage');
    warningMessage.innerHTML = '<p>Are you sure you want to reactivate this plan?</p>';

    const yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        const success = await planAjax.updateConsumerPlanReactivate({
          token: $.session.Token,
          consumerPlanId: planId,
        });

        const message = success === 1 ? 'Plan successfully reactivated.' : 'Unable to reactivate plan.';
        const successDiv = successfulSave.get(message, true);
        if (success !== 1) successDiv.classList.add('error');

        warningMessage.style.display = 'none';
        btnWrap.style.display = 'none';
        screen.appendChild(successDiv);

        setTimeout(() => {
          screen.removeChild(successDiv);

          warningMessage.removeAttribute('style');
          btnWrap.removeAttribute('style');

          screen.classList.remove('visible');
          morePopupMenu.classList.add('visible');

          if (success === 1) {
            planActiveStatus = !planActiveStatus;
            assessmentCard.refreshAssessmentCard({
              planStatus,
              planId,
              isActive: planActiveStatus,
            });
            ISP.refreshISP(planId);
          }
        }, 1000);
      },
    });
    const noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        screen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    screen.appendChild(warningMessage);
    screen.appendChild(btnWrap);

    return screen;
  }
  function buildAddWorkflowScreen() {
    const screen = document.createElement('div');
    screen.id = 'addWorkflowScreen';
    screen.classList.add('screen');

    screen.addEventListener('click', e => {
      if (e.target.classList.contains('workflowListItem')) {
        const templateID = e.target.dataset.templateId;

        if (!e.target.classList.contains('selected')) {
          e.target.classList.add('selected');
          selectedWorkflows.push(templateID);
        } else {
          e.target.classList.remove('selected');
          selectedWorkflows = selectedWorkflows.filter(wf => wf !== templateID);
        }

        selectedWorkflows.length > 0
          ? addWorkflowDoneBtn.classList.remove('disabled')
          : addWorkflowDoneBtn.classList.add('disabled');
      }
    });

    return screen;
  }
  async function populateAddWorkflowScreen() {
    const processId = planWorkflow.getProcessId(planType);
    selectedWorkflows = [];

    const screen = document.getElementById('addWorkflowScreen');
    screen.innerHTML = '';

    const title = document.createElement('h2');
    title.innerHTML = 'Select workflow(s) to attach.';
    screen.appendChild(title);

    const wfvData = await planWorkflow.getWorkflowList(processId, planId);
    if (wfvData && wfvData.length > 0) {
      const list = planWorkflow.buildWorkflowList(wfvData);
      screen.appendChild(list);
    }

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        addWorkflowDoneBtn.classList.add('disabled');
        screen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });
    addWorkflowDoneBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary',
      classNames: ['copySelectedBtn', 'disabled'],
      callback: () => {
        addWorkflowDoneBtn.classList.add('disabled');
        cancelBtn.classList.add('disabled');

        if (selectedWorkflows && selectedWorkflows.length > 0) {
          selectedWorkflows.forEach(workflowTemplateId => {
            WorkflowViewerAjax.copyWorkflowtemplateToRecord({
              token: $.session.Token,
              templateId: workflowTemplateId,
              referenceId: planId,
              peopleId: selectedConsumer.id,
            });
          });

          const message = 'Workflows Added';
          const successDiv = successfulSave.get(null, true);
          screen.appendChild(successDiv);

          setTimeout(() => {
            screen.removeChild(successDiv);
            screen.classList.remove('visible');
            morePopupMenu.classList.add('visible');
          }, 1000);
        }
      },
    });

    btnWrap.appendChild(addWorkflowDoneBtn);
    btnWrap.appendChild(cancelBtn);
    screen.appendChild(btnWrap);
  }
  function buildReportsScreen() {
    const screen = document.createElement('div');
    screen.id = 'reportsScreen';
    screen.classList.add('screen');

    const attachmentsWrap = document.createElement('div');
    attachmentsWrap.classList.add('attachmentsWrap');
    const attachHeading = document.createElement('p');
    attachHeading.classList.add('attachmentsHeading');
    attachHeading.innerText = `Please select the attachment(s) that should be included with the report.`;
    attachmentsWrap.appendChild(attachHeading);

    const planAttWrap = document.createElement('div');
    planAttWrap.classList.add('planAttWrap');
    const workflowAttWrap = document.createElement('div');
    workflowAttWrap.classList.add('workflowAttWrap');
    const signatureAttWrap = document.createElement('div');
    signatureAttWrap.classList.add('signatureAttWrap');
    attachmentsWrap.appendChild(planAttWrap);
    attachmentsWrap.appendChild(workflowAttWrap);
    attachmentsWrap.appendChild(signatureAttWrap);

    const planHeading = document.createElement('h2');
    const workflowHeading = document.createElement('h2');
    const signHeading = document.createElement('h2');
    planHeading.innerText = 'Plan Attachments';
    workflowHeading.innerText = 'Workflow Attachments';
    signHeading.innerText = 'Signature Attachments';
    planAttWrap.appendChild(planHeading);
    workflowAttWrap.appendChild(workflowHeading);
    signatureAttWrap.appendChild(signHeading);

    planAttBody = document.createElement('div');
    signatureAttBody = document.createElement('div');
    workflowAttBody = document.createElement('div');
    planAttWrap.appendChild(planAttBody);
    signatureAttWrap.appendChild(signatureAttBody);
    workflowAttWrap.appendChild(workflowAttBody);

    screen.appendChild(attachmentsWrap);

    return screen;
  }
  function buildReportsAttachmentsScreen() {
    const screen = document.createElement('div');
    screen.id = 'reportsAttachmentScreen';
    screen.classList.add('screen');

    return screen;
  }
  function buildDODDScreen() {
    const screen = document.createElement('div');
    screen.id = 'DODDScreen';
    screen.classList.add('screen');

    //const message = document.createElement('p');
    //message.classList.add('doddMessage');
    //screen.appendChild(message);

    const attachmentsWrap = document.createElement('div');
    attachmentsWrap.classList.add('attachmentsWrap');
    const attachHeading = document.createElement('p');
    attachHeading.classList.add('attachmentsHeading');
    attachHeading.innerText = `Please select the attachment(s) that should be sent to DODD with the plan.`;
    attachmentsWrap.appendChild(attachHeading);

    const DODDplanAttWrap = document.createElement('div');
    DODDplanAttWrap.classList.add('planAttWrap');
    const DODDsignatureAttWrap = document.createElement('div');
    DODDsignatureAttWrap.classList.add('signatureAttWrap');
    const DODDworkflowAttWrap = document.createElement('div');
    DODDworkflowAttWrap.classList.add('workflowAttWrap');
    attachmentsWrap.appendChild(DODDplanAttWrap);
    attachmentsWrap.appendChild(DODDsignatureAttWrap);
    attachmentsWrap.appendChild(DODDworkflowAttWrap);

    const planHeading = document.createElement('h2');
    const signHeading = document.createElement('h2');
    const workflowHeading = document.createElement('h2');
    planHeading.innerText = 'Plan and Assessment Attachments';
    signHeading.innerText = 'Signature Attachments';
    workflowHeading.innerText = 'Workflow Attachments';
    DODDplanAttWrap.appendChild(planHeading);
    DODDsignatureAttWrap.appendChild(signHeading);
    DODDworkflowAttWrap.appendChild(workflowHeading);

    DODDplanAttBody = document.createElement('div');
    DODDsignAttBody = document.createElement('div');
    DODDworkflowAttBody = document.createElement('div');
    DODDplanAttWrap.appendChild(DODDplanAttBody);
    DODDsignatureAttWrap.appendChild(DODDsignAttBody);
    DODDworkflowAttWrap.appendChild(DODDworkflowAttBody);

    screen.appendChild(attachmentsWrap);

    return screen;
  }
  function buildPortalScreen() {
    const screen = document.createElement('div');
    screen.id = 'portalScreen';
    screen.classList.add('screen');

    const attachmentsWrap = document.createElement('div');
    attachmentsWrap.classList.add('attachmentsWrap');
    const attachHeading = document.createElement('p');
    attachHeading.classList.add('attachmentsHeading');
    attachHeading.innerText = `Please select the attachment(s) that should be included with the report.`;
    attachmentsWrap.appendChild(attachHeading);

    const portalPlanAttWrap = document.createElement('div');
    portalPlanAttWrap.classList.add('planAttWrap');
    const portalWorkflowAttWrap = document.createElement('div');
    portalWorkflowAttWrap.classList.add('workflowAttWrap');
    const portalSignatureAttWrap = document.createElement('div');
    portalSignatureAttWrap.classList.add('signatureAttWrap');
    attachmentsWrap.appendChild(portalPlanAttWrap);
    attachmentsWrap.appendChild(portalWorkflowAttWrap);
    attachmentsWrap.appendChild(portalSignatureAttWrap);

    const planHeading = document.createElement('h2');
    const workflowHeading = document.createElement('h2');
    const signHeading = document.createElement('h2');
    planHeading.innerText = 'Plan Attachments';
    workflowHeading.innerText = 'Workflow Attachments';
    signHeading.innerText = 'Signature Attachments';
    portalPlanAttWrap.appendChild(planHeading);
    portalWorkflowAttWrap.appendChild(workflowHeading);
    portalSignatureAttWrap.appendChild(signHeading);

    portalPlanAttBody = document.createElement('div');
    portalSignatureAttBody = document.createElement('div');
    portalWorkflowAttBody = document.createElement('div');
    portalPlanAttWrap.appendChild(portalPlanAttBody);
    portalSignatureAttWrap.appendChild(portalSignatureAttBody);
    portalWorkflowAttWrap.appendChild(portalWorkflowAttBody);

    screen.appendChild(attachmentsWrap);

    return screen;
  }
  function buildSendToDODDScreen() {
    const screen = document.createElement('div');
    screen.id = 'sendToDODDScreen';
    screen.classList.add('screen');

    const message = document.createElement('p');
    message.classList.add('doddMessage');
    screen.appendChild(message);

    return screen;
  }
  function buildChangePlanTypeScreen() {
    let origDateCache;
    let origType;
    let newType;
    let previousPlansTable;
    let datesBoxDiv;
    // data from prev plan
    let newPlan, newPlanData;

    const screen = document.createElement('div');
    screen.id = 'changePlanTypeScreen';
    screen.classList.add('screen');

    // current type
    const currentType = document.createElement('div');
    currentType.classList.add('currentType');
    currentType.innerHTML = `
      <p>Current Type:</p> ${planType === 'a' ? '<p>Annual</p>' : '<p>Revision</p>'}
    `;

    // dropdown
    const typeDropdown = dropdown.build({
      className: `typeDropdown`,
      label: 'Type',
      style: 'secondary',
    });
    dropdown.populate(
      typeDropdown,
      [
        { value: 'a', text: 'Annual' },
        { value: 'r', text: 'Revision' },
      ],
      planType,
    );
    typeDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      newType = selectedOption.value;
      if (newType === planType) {
        updateBtn.classList.add('disabled');
      } else {
        updateBtn.classList.remove('disabled');

        if (newType === 'r') {
          // prev plans table
          previousPlansTable = buildPreviousPlansTable(true, (selectedPlan, planData) => {
            newPlan = selectedPlan;
            newPlanData = planData;

            origType = planType;
            origDateCache = planDates.setRevisionPlanDates(newPlanData);
            planType = newType;

            const previouslySeletedRow = previousPlansTable.querySelector('.selected');
            if (previouslySeletedRow) previouslySeletedRow.classList.remove('selected');
            selectedPlan.classList.add('selected');

            if (screen.contains(datesBoxDiv)) screen.removeChild(datesBoxDiv);
            datesBoxDiv = planDates.buildDatesBox(isValid => {
              if (isValid) {
                updateBtn.classList.remove('disabled');
              } else {
                updateBtn.classList.add('disabled');
              }
            }, true);
            screen.insertBefore(datesBoxDiv, btnWrap);
          });
          screen.insertBefore(previousPlansTable, btnWrap);
        } else {
          if (previousPlansTable) screen.removeChild(previousPlansTable);
          if (datesBoxDiv) screen.removeChild(datesBoxDiv);
          if (origDateCache) planDates.resetPlanDatesFromChangeTypeMenu(origDateCache);
        }
      }
    });

    // btns
    const updateBtn = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        const success = await planAjax.updatePlanType({
          token: $.session.Token,
          consumerPlanId: planId,
          prevPlanId: newType === 'a' ? planId : newPlanData.consumerPlanId,
          planType: newType.toUpperCase(),
          revisionNumber: newType === 'r' ? parseInt(newPlanData.revisionNumber) + 1 : '',
          planYearStart: UTIL.formatDateToIso(dates.formatISO(planDates.getPlanYearStartDate()).split('T')[0]),
          planYearEnd: UTIL.formatDateToIso(dates.formatISO(planDates.getPlanYearEndDate()).split('T')[0]),
          effectiveStartDate: UTIL.formatDateToIso(dates.formatISO(planDates.getEffectiveStartDate()).split('T')[0]),
          effectiveEndDate: UTIL.formatDateToIso(dates.formatISO(planDates.getEffectiveEndDate())).split('T')[0],
          reviewDate: UTIL.formatDateToIso(dates.formatISO(planDates.getPlanReviewDate())).split('T')[0],
        });

        if (success === 'Success') {
          currentType.innerHTML = `<p>Current Type:</p> ${planType === 'a' ? '<p>Annual</p>' : '<p>Revision</p>'}`;
        }

        const message = success === 'Success' ? 'Type successfully updated.' : 'Type was not able to be updated.';
        const successDiv = successfulSave.get(message, true);
        if (success !== 'Success') successDiv.classList.add('error');

        currentType.style.display = 'none';
        typeDropdown.style.display = 'none';
        btnWrap.style.display = 'none';
        screen.appendChild(successDiv);

        setTimeout(() => {
          screen.removeChild(successDiv);

          currentType.removeAttribute('style');
          typeDropdown.removeAttribute('style');
          btnWrap.removeAttribute('style');

          refreshMoreMenu();
          screen.classList.remove('visible');
          morePopupMenu.classList.add('visible');

          if (success === 'Success') {
            refreshGeneralInfo();
            assessmentCard.refreshAssessmentCard({
              planStatus,
              planId,
              isActive: planActiveStatus,
            });
            ISP.refreshISP(planId);
          } else {
            if (previousPlansTable) screen.removeChild(previousPlansTable);
            if (datesBoxDiv) screen.removeChild(datesBoxDiv);

            // reset type dropdown value
            const typeSelect = typeDropdown.querySelector('select');
            typeSelect.value = planType;
            // reset dates
            if (origDateCache) planDates.resetPlanDatesFromChangeTypeMenu(origDateCache);
            // reset type
            plantype = origType;
          }
        }, 1000);
      },
    });
    updateBtn.classList.add('disabled');
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        if (previousPlansTable) screen.removeChild(previousPlansTable);
        if (datesBoxDiv) screen.removeChild(datesBoxDiv);

        // reset type dropdown value
        const typeSelect = typeDropdown.querySelector('select');
        typeSelect.value = planType;
        // reset dates
        if (origDateCache) planDates.resetPlanDatesFromChangeTypeMenu(origDateCache);
        // reset type
        plantype = origType;

        screen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    btnWrap.appendChild(updateBtn);
    btnWrap.appendChild(cancelBtn);

    screen.appendChild(currentType);
    screen.appendChild(typeDropdown);
    screen.appendChild(btnWrap);

    return screen;
  }
  function getAttachmentIds(attachments) {
    const idArray = [];

    for (const prop in attachments) {
      idArray.push(attachments[prop].attachmentId);
    }

    return idArray;
  }

  function getwfstepdocIds(attachments) {
    const idArray = [];

    for (const prop in attachments) {
      idArray.push(attachments[prop].workflowstepdocId);
    }

    return idArray;
  }

  async function runReportScreen(extraSpace) {
    const selectedAttachmentsPlan = {};
    const selectedAttachmentsWorkflow = {};
    const selectedAttachmentsSignature = {};

    // clear out body before each run to prevent dups
    planAttBody.innerHTML = '';
    workflowAttBody.innerHTML = '';
    signatureAttBody.innerHTML = '';

    // Show Attachements
    const attachments = await planAjax.getPlanAndWorkFlowAttachments({
      token: $.session.Token,
      assessmentId: planId, //TODO
    });

    let index = 0;

    if (attachments) {
      for (const prop in attachments) {
        attachments[prop].order = index;
        const a = attachments[prop];
        const attachment = document.createElement('div');
        attachment.classList.add('attachment');
        const description = document.createElement('p');
        description.innerText = a.description;
        attachment.appendChild(description);

        attachment.addEventListener('click', () => {
          if (!attachment.classList.contains('selected')) {
            attachment.classList.add('selected');
            if (a.sigAttachmentId) {
              selectedAttachmentsSignature[a.order] = { ...a };
            } else if (a.whereFrom === 'Plan') {
              selectedAttachmentsPlan[a.order] = { ...a };
            } else {
              selectedAttachmentsWorkflow[a.order] = { ...a };
            }
          } else {
            attachment.classList.remove('selected');
            if (a.sigAttachmentId) {
              delete selectedAttachmentsSignature[a.order];
            } else if (a.whereFrom === 'Plan') {
              delete selectedAttachmentsPlan[a.order];
            } else {
              delete selectedAttachmentsWorkflow[a.order];
            }
          }
        });

        if (a.sigAttachmentId) {
          signatureAttBody.appendChild(attachment);
        } else if (a.whereFrom === 'Plan') {
          planAttBody.appendChild(attachment);
        } else {
          workflowAttBody.appendChild(attachment);
        }

        index++;
      }
    }

    // checkbox
    includeCheckbox = input.buildCheckbox({
      id: 'reportCheckbox',
      // className: 'reportCheckbox',
      isChecked: include === 'Y' ? true : false,
    });

    includeCheckbox.addEventListener('change', event => {
      include = event.target.checked ? 'Y' : 'N';
    });

    const doneBtn = button.build({
      text: 'Done',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        let isSuccess;
        // build & show spinner
        const spinner = PROGRESS.SPINNER.get('Building Report...');
        const screenInner = reportsScreen.querySelector('.attachmentsWrap');
        reportsScreen.removeChild(doneBtn);
        reportsScreen.removeChild(checkboxArea);
        reportsScreen.removeChild(screenInner);
        reportsScreen.appendChild(spinner);
        // generate report
        if (
          Object.keys(selectedAttachmentsPlan).length > 0 ||
          Object.keys(selectedAttachmentsWorkflow).length > 0 ||
          Object.keys(selectedAttachmentsSignature).length > 0
        ) {
          const planAttachmentIds = getAttachmentIds(selectedAttachmentsPlan);
          const wfAttachmentIds = getAttachmentIds(selectedAttachmentsWorkflow);
          const sigAttachmentIds = getAttachmentIds(selectedAttachmentsSignature);
          isSuccess = assessment.generateReportWithAttachments(
            planId,
            '1',
            extraSpace,
            planAttachmentIds,
            wfAttachmentIds,
            sigAttachmentIds,
            'false', //DODDFlag
            'false', //signatureOnly
            include, // 'Y' or 'N' -- Include Important to, Important For, Skills and Abilities, and Risks in assessment
          );
        } else {
          //isSuccess = await assessment.generateReport(planId, '1', extraSpace);
          const planAttachmentIds = getAttachmentIds(selectedAttachmentsPlan);
          const wfAttachmentIds = getAttachmentIds(selectedAttachmentsWorkflow);
          const sigAttachmentIds = getAttachmentIds(selectedAttachmentsSignature);
          isSuccess = assessment.generateReportWithAttachments(
            planId,
            '1',
            extraSpace,
            planAttachmentIds,
            wfAttachmentIds,
            sigAttachmentIds,
            'false', //DODDFlag
            'false', //signatureOnly
            include, // 'Y' or 'N' -- Include Important to, Important For, Skills and Abilities, and Risks in assessment
          );
        }

        // remove spinner
        reportsScreen.removeChild(spinner);
        reportsScreen.appendChild(screenInner);
        reportsScreen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    // add checkbox
    // const checkboxCheck = document.createElement('div');
    //  checkboxCheck.appendChild(includeCheckbox);
    const checkboxText = document.createElement('div');
    checkboxText.innerHTML = 'Include Important to, Important For, Skills and Abilities, and Risks in assessment';
    const checkboxArea = document.createElement('div');
    checkboxArea.classList.add('checkboxWrap');
    checkboxArea.appendChild(includeCheckbox);
    checkboxArea.appendChild(checkboxText);
    reportsScreen.appendChild(checkboxArea);
    reportsScreen.appendChild(doneBtn);
  }

  async function runPortalScreen(extraSpace) {
    const selectedAttachmentsPlan = {};
    const selectedAttachmentsWorkflow = {};
    const selectedAttachmentsSignature = {};

    // clear out body before each run to prevent dups
    portalPlanAttBody.innerHTML = '';
    portalWorkflowAttBody.innerHTML = '';
    portalSignatureAttBody.innerHTML = '';

    // Show Attachements
    const attachments = await planAjax.getPlanAndWorkFlowAttachments({
      token: $.session.Token,
      assessmentId: planId,
    });

    let index = 0;

    if (attachments) {
      for (const prop in attachments) {
        attachments[prop].order = index;
        const a = attachments[prop];
        const attachment = document.createElement('div');
        attachment.classList.add('attachment');
        const description = document.createElement('p');
        description.innerText = a.description;
        attachment.appendChild(description);

        attachment.addEventListener('click', () => {
          if (!attachment.classList.contains('selected')) {
            attachment.classList.add('selected');
            if (a.sigAttachmentId) {
              selectedAttachmentsSignature[a.order] = { ...a };
            } else if (a.whereFrom === 'Plan') {
              selectedAttachmentsPlan[a.order] = { ...a };
            } else {
              selectedAttachmentsWorkflow[a.order] = { ...a };
            }
          } else {
            attachment.classList.remove('selected');
            if (a.sigAttachmentId) {
              delete selectedAttachmentsSignature[a.order];
            } else if (a.whereFrom === 'Plan') {
              delete selectedAttachmentsPlan[a.order];
            } else {
              delete selectedAttachmentsWorkflow[a.order];
            }
          }
        });

        if (a.sigAttachmentId) {
          portalSignatureAttBody.appendChild(attachment);
        } else if (a.whereFrom === 'Plan') {
          portalPlanAttBody.appendChild(attachment);
        } else {
          portalWorkflowAttBody.appendChild(attachment);
        }

        index++;
      }
    }

    // checkbox
    includeCheckbox = input.buildCheckbox({
      id: 'portalCheckbox',
      isChecked: include === 'Y' ? true : false,
    });

    includeCheckbox.addEventListener('change', event => {
      include = event.target.checked ? 'Y' : 'N';
    });

    const doneBtn = button.build({
      text: 'Done',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        let sendSuccess;
        // build & show spinner
        const spinner = PROGRESS.SPINNER.get('Sending Plan to OhioDD.net');
        const screenInner = portalScreen.querySelector('.attachmentsWrap');
        portalScreen.removeChild(doneBtn);
        portalScreen.removeChild(checkboxArea);
        portalScreen.removeChild(screenInner);
        portalScreen.appendChild(spinner);
        // send report to ohiodd.net
        if (
          Object.keys(selectedAttachmentsPlan).length > 0 ||
          Object.keys(selectedAttachmentsWorkflow).length > 0 ||
          Object.keys(selectedAttachmentsSignature).length > 0
        ) {
          const planAttachmentIds = getAttachmentIds(selectedAttachmentsPlan);
          const wfAttachmentIds = getAttachmentIds(selectedAttachmentsWorkflow);
          const sigAttachmentIds = getAttachmentIds(selectedAttachmentsSignature);
          sendSuccess = await assessment.transeferPlanReportToONET(
            planId,
            '1',
            extraSpace,
            planAttachmentIds,
            wfAttachmentIds,
            sigAttachmentIds,
            'false', //DODDFlag
            'false', //signatureOnly
            include, // 'Y' or 'N' -- Include Important to, Important For, Skills and Abilities, and Risks in assessment
          );
        } else {
          const planAttachmentIds = getAttachmentIds(selectedAttachmentsPlan);
          const wfAttachmentIds = getAttachmentIds(selectedAttachmentsWorkflow);
          const sigAttachmentIds = getAttachmentIds(selectedAttachmentsSignature);
          sendSuccess = await assessment.transeferPlanReportToONET(
            planId,
            '1',
            extraSpace,
            planAttachmentIds,
            wfAttachmentIds,
            sigAttachmentIds,
            'false', //DODDFlag
            'false', //signatureOnly
            include, // 'Y' or 'N' -- Include Important to, Important For, Skills and Abilities, and Risks in assessment
          );
        }

        sendToPortalAlert(sendSuccess);

        // remove spinner
        portalScreen.removeChild(spinner);
        portalScreen.appendChild(screenInner);
        portalScreen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });

    const checkboxText = document.createElement('div');
    checkboxText.innerHTML = 'Include Important to, Important For, Skills and Abilities, and Risks in assessment';
    const checkboxArea = document.createElement('div');
    checkboxArea.classList.add('checkboxWrap');
    checkboxArea.appendChild(includeCheckbox);
    checkboxArea.appendChild(checkboxText);
    portalScreen.appendChild(checkboxArea);
    portalScreen.appendChild(doneBtn);
  }

  async function runDODDScreen(extraSpace) {
    const selectedAttachmentsPlan = {};
    const selectedAttachmentsWorkflow = {};
    const selectedAttachmentsSignature = {};

    // clear out body before each run to prevent dups
    DODDplanAttBody.innerHTML = '';
    DODDsignAttBody.innerHTML = '';
    DODDworkflowAttBody.innerHTML = '';

    // Show Attachements
    const attachments = await planAjax.getPlanAndWorkFlowAttachments({
      token: $.session.Token,
      assessmentId: planId, //TODO
    });

    let index = 0;

    if (attachments) {
      for (const prop in attachments) {
        attachments[prop].order = index;
        const a = attachments[prop];
        const attachment = document.createElement('div');
        attachment.classList.add('attachment');
        const description = document.createElement('p');
        description.innerText = a.description;
        attachment.appendChild(description);
        // attachment.setAttribute('data-WF-stepdocId', a.workflowstepdocId);
        //  attachment.setAttribute('data-attachmentId', a.attachmentId);

        attachment.addEventListener('click', () => {
          if (!attachment.classList.contains('selected')) {
            attachment.classList.add('selected');
            if (a.sigAttachmentId) {
              selectedAttachmentsSignature[a.order] = { ...a };
            } else if (a.whereFrom === 'Plan') {
              selectedAttachmentsPlan[a.order] = { ...a };
            } else {
              selectedAttachmentsWorkflow[a.order] = { ...a };
            }
          } else {
            attachment.classList.remove('selected');
            if (a.sigAttachmentId) {
              delete selectedAttachmentsSignature[a.order];
            } else if (a.whereFrom === 'Plan') {
              delete selectedAttachmentsPlan[a.order];
            } else {
              delete selectedAttachmentsWorkflow[a.order];
            }
          }
        });

        if (a.sigAttachmentId) {
          DODDsignAttBody.appendChild(attachment);
        } else if (a.whereFrom === 'Plan') {
          DODDplanAttBody.appendChild(attachment);
        } else {
          DODDworkflowAttBody.appendChild(attachment);
        }

        index++;
      }
    }

    const doneBtn = button.build({
      text: 'Send To DODD',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        //Send plan to DODD
        // runSendToDODDScreen();

        //Send the selected plan attachments to DODD by calling the same function the report uses
        let sendSuccess = [];
        // build & show spinner
        const spinner = PROGRESS.SPINNER.get('Sending to DODD...');
        const screenInner = DODDScreen.querySelector('.attachmentsWrap');
        DODDScreen.removeChild(doneBtn);
        DODDScreen.removeChild(screenInner);
        DODDScreen.appendChild(spinner);
        // generate report
        // if (
        //   Object.keys(selectedAttachmentsPlan).length > 0 ||
        //   Object.keys(selectedAttachmentsWorkflow).length > 0 ||
        //   Object.keys(selectedAttachmentsSignature).length > 0
        // ) {
        const planAttachmentIds = getAttachmentIds(selectedAttachmentsPlan);
        const wfAttachmentIds = getwfstepdocIds(selectedAttachmentsWorkflow);
        const sigAttachmentIds = getAttachmentIds(selectedAttachmentsSignature);
        try {
          // await needed to allow spinner to spin while request is being made
          // try catch added to prevent code from stopping on ajax error
          sendSuccess = await assessmentAjax.sendSelectedAttachmentsToDODD({
            token: $.session.Token,
            planAttachmentIds: planAttachmentIds,
            wfAttachmentIds: wfAttachmentIds,
            sigAttachmentIds: sigAttachmentIds,
            planId: planId,
            consumerId: selectedConsumer.id,
          });
        } catch (error) {
          console.log(error.statusText);
        }
        //* if we need to upload to dodd after sending attachments
        //* below was old code from old sendToDODD screen
        // const success = await planAjax.uploadPlanToDODD({
        //   consumerId: selectedConsumer.id,
        //   planId,
        // });
        // }

        if (
          sendSuccess &&
          (sendSuccess[0] === 'Successfully sent Plan to DODD.' ||
            sendSuccess[0] === 'Successfully sent Plan and selected Attachments to DODD.')
        ) {
          sendtoDODDSuccessMessage(sendSuccess);
        } else {
          sendtoDODDGeneralErrorMessage(sendSuccess);
        }

        DODDScreen.removeChild(spinner);
        DODDScreen.appendChild(screenInner);
        DODDScreen.classList.remove('visible');
        morePopupMenu.classList.add('visible');

        //TODO set date_sent_to_dodd column when the attachment is successfully uploaded to DODD
      },
    });

    DODDScreen.appendChild(doneBtn);
  }

  function sendtoDODDGeneralErrorMessage(sendtoDODDResponse) {
    var generalMessagePopup = POPUP.build({
      id: 'saveAlertPopup',
      classNames: 'warning',
      hideX: true,
    });
    var generalBtnWrap = document.createElement('div');
    generalBtnWrap.classList.add('btnWrap');
    var closeBtnWrap = document.createElement('div');
    closeBtnWrap.classList.add('btnWrap');
    var alertokBtn = button.build({
      text: 'Copy Error to Clipboard',
      style: 'secondary',
      type: 'contained',
      //  icon: 'checkmark',
      callback: async function () {
        navigator.clipboard.writeText(sendtoDODDResponse[0]);
        // POPUP.hide(generalMessagePopup);
        overlay.show();
        showOKPopup();
      },
    });
    var displayDetailBtn = button.build({
      text: 'Show Error Details',
      style: 'secondary',
      type: 'contained',

      //icon: 'checkmark',
      callback: async function () {
        POPUP.hide(generalMessagePopup);
        overlay.show();
        sendtoDODDDetailErrorMessage(sendtoDODDResponse);
      },
    });
    var closeBtn = button.build({
      text: 'Close',
      style: 'secondary',
      type: 'contained',
      // classNames: 'btnWrap',
      // icon: 'checkmark',
      callback: async function () {
        POPUP.hide(generalMessagePopup);
        overlay.show();
      },
    });

    generalBtnWrap.appendChild(alertokBtn);
    generalBtnWrap.appendChild(displayDetailBtn);
    closeBtnWrap.appendChild(closeBtn);
    var generalMessage = document.createElement('p');
    generalMessage.innerHTML = sendtoDODDResponse[0];
    generalMessagePopup.appendChild(generalMessage);
    generalMessagePopup.appendChild(generalBtnWrap);
    generalMessagePopup.appendChild(closeBtnWrap);
    POPUP.show(generalMessagePopup);
  }

  function sendtoDODDDetailErrorMessage(sendtoDODDResponse) {
    // alert(sendtoDODDResponse[1]);
    var detailMessagePopup = POPUP.build({
      id: 'saveAlertPopup',
      classNames: 'warning',
      hideX: true,
    });
    var detailBtnWrap = document.createElement('div');
    detailBtnWrap.classList.add('btnWrap');
    var closeBtnWrap = document.createElement('div');
    closeBtnWrap.classList.add('btnWrap');
    var alertokBtn = button.build({
      text: 'Copy Error to Clipboard',
      style: 'secondary',
      type: 'contained',
      // icon: 'checkmark',
      callback: async function () {
        navigator.clipboard.writeText(sendtoDODDResponse[0] + '        ' + sendtoDODDResponse[1]);
        // POPUP.hide(detailMessagePopup);
        overlay.show();
        showOKPopup();
      },
    });
    var displayGeneralBtn = button.build({
      text: 'Hide Error Details',
      style: 'secondary',
      type: 'contained',
      //icon: 'checkmark',
      callback: async function () {
        POPUP.hide(detailMessagePopup);
        overlay.show();
        sendtoDODDGeneralErrorMessage(sendtoDODDResponse);
      },
    });
    var closeBtn = button.build({
      text: 'Close',
      style: 'secondary',
      type: 'contained',
      // classNames: 'btnWrap',
      // icon: 'checkmark',
      callback: async function () {
        POPUP.hide(detailMessagePopup);
        overlay.show();
      },
    });

    detailBtnWrap.appendChild(alertokBtn);
    detailBtnWrap.appendChild(displayGeneralBtn);
    closeBtnWrap.appendChild(closeBtn);
    var detailMessage = document.createElement('p');
    detailMessage.innerHTML = sendtoDODDResponse[0] + '</br></br>' + sendtoDODDResponse[1];
    detailMessagePopup.appendChild(detailMessage);
    detailMessagePopup.appendChild(detailBtnWrap);
    detailMessagePopup.appendChild(closeBtnWrap);
    POPUP.show(detailMessagePopup);
  }

  function showOKPopup() {
    var OKPopup = POPUP.build({
      id: 'saveAlertPopup',
      classNames: 'warning',
      hideX: true,
    });
    var OKBtnWrap = document.createElement('div');
    OKBtnWrap.classList.add('btnWrap');
    var alertokBtn = button.build({
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      // icon: 'checkmark',
      callback: async function () {
        POPUP.hide(OKPopup);
        overlay.show();
      },
    });

    OKBtnWrap.appendChild(alertokBtn);
    var OKMessage = document.createElement('p');
    OKMessage.innerHTML = 'Error Copied to Clipboard';
    OKPopup.appendChild(OKMessage);
    OKPopup.appendChild(OKBtnWrap);
    POPUP.show(OKPopup);
  }

  function sendtoDODDSuccessMessage(sendtoDODDResponse) {
    var sendtoDODDSuccessPopup = POPUP.build({
      id: 'saveAlertPopup',
      classNames: 'warning',
      hideX: true,
    });
    var OKBtnWrap = document.createElement('div');
    OKBtnWrap.classList.add('btnWrap');
    var alertokBtn = button.build({
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      // icon: 'checkmark',
      callback: async function () {
        POPUP.hide(sendtoDODDSuccessPopup);
        overlay.show();
      },
    });

    OKBtnWrap.appendChild(alertokBtn);
    var sendtoDODDSuccessMesssage = document.createElement('p');
    sendtoDODDSuccessMesssage.innerHTML = sendtoDODDResponse[0];
    sendtoDODDSuccessPopup.appendChild(sendtoDODDSuccessMesssage);
    sendtoDODDSuccessPopup.appendChild(OKBtnWrap);
    POPUP.show(sendtoDODDSuccessPopup);
  }

  function sendToPortalAlert(sendtoPortalResponse) {
    var alertPopup = POPUP.build({
      id: 'saveAlertPopup',
      classNames: 'warning',
    });
    var alertbtnWrap = document.createElement('div');
    alertbtnWrap.classList.add('btnWrap');
    var alertokBtn = button.build({
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: async function () {
        POPUP.hide(alertPopup);
        overlay.show();
      },
    });

    alertbtnWrap.appendChild(alertokBtn);
    var alertMessage = document.createElement('p');
    alertMessage.innerHTML = sendtoPortalResponse;
    alertPopup.appendChild(alertMessage);
    alertPopup.appendChild(alertbtnWrap);
    POPUP.show(alertPopup);
  }

  function buildMorePopupMenu() {
    const morepopupmenu = document.createElement('div');
    morepopupmenu.classList.add('moreMenuPopup__menu', 'visible');

    const reportBtn = button.build({
      text: 'Report',
      style: 'secondary',
      type: 'contained',
      classNames: ['reportBtn'],
    });
    const reportBtn2 = button.build({
      text: 'Report with notes',
      style: 'secondary',
      type: 'contained',
      classNames: ['reportBtn2'],
    });

    const reportSignatureBtn = button.build({
      text: 'Print Signature Page',
      style: 'secondary',
      type: 'contained',
      classNames: ['reportBtn2'],
      callback: async () => {
        let isSuccess;
        const selectedAttachmentsPlan = {};
        const selectedAttachmentsWorkflow = {};
        const selectedAttachmentsSignature = {};
        let extraSpace = 'false';

        // build & show spinner
        //  const spinner = PROGRESS.SPINNER.show('Building Report...');
        //const screenInner = reportsScreen.querySelector('.attachmentsWrap');
        // reportsScreen.removeChild(doneBtn);
        // reportsScreen.removeChild(screenInner);
        //  reportsScreen.appendChild(spinner);
        // generate report
        const planAttachmentIds = getAttachmentIds(selectedAttachmentsPlan);
        const wfAttachmentIds = getAttachmentIds(selectedAttachmentsWorkflow);
        const sigAttachmentIds = getAttachmentIds(selectedAttachmentsSignature);
        isSuccess = assessment.generateReportWithAttachments(
          planId,
          '1',
          extraSpace,
          planAttachmentIds,
          wfAttachmentIds,
          sigAttachmentIds,
          'false', //DODDFlag
          'true', //signatureOnly
          'N', // 'Y' or 'N' -- Include Important to, Important For, Skills and Abilities, and Risks in assessment
        );
      },
    });

    const reportBtn3 = button.build({
      text: 'Report with attachments',
      style: 'secondary',
      type: 'contained',
      classNames: ['reportBtn2'],
    });
    const sendtoPortalBtn = button.build({
      text: 'Send To Portal',
      style: 'secondary',
      type: 'contained',
      classNames:
        planStatus === 'C' && $.session.webPermission === 'Web' ? ['sendtoPortalBtn'] : ['sendtoPortalBtn', 'disabled'],
    });
    const sendToDODDBtn = button.build({
      text: 'Send To DODD',
      style: 'secondary',
      type: 'contained',
      classNames: planStatus === 'C' && $.session.sendToDODD ? ['sendToDODDBtn'] : ['sendToDODDBtn', 'disabled'],
    });
    const editDatesBtn = button.build({
      text: 'Change Dates',
      style: 'secondary',
      type: 'contained',
      classNames:
        planActiveStatus && $.session.planUpdate && planStatus !== 'C'
          ? ['editDatesBtn']
          : ['editDatesBtn', 'disabled'],
    });
    const statusBtn = button.build({
      text: 'Change Status',
      style: 'secondary',
      type: 'contained',
      classNames: planActiveStatus && $.session.planUpdate ? ['statusBtn'] : ['statusBtn', 'disabled'],
    });
    const deleteBtn = button.build({
      text: 'Delete Plan',
      style: 'secondary',
      type: 'contained',
      classNames: downloadedFromSalesforce
        ? $.session.planDelete
          ? ['deleteBtn']
          : ['deleteBtn', 'disabled']
        : planStatus === 'D' && planActiveStatus && $.session.planUpdate && $.session.planDelete
        ? ['deleteBtn']
        : ['deleteBtn', 'disabled'],
    });
    const reactivateBtn = button.build({
      text: 'Reactivate Plan',
      style: 'secondary',
      type: 'contained',
      classNames: downloadedFromSalesforce
        ? ['reactivateBtn', 'disabled']
        : !planActiveStatus && $.session.planUpdate
        ? ['reactivateBtn']
        : ['reactivateBtn', 'disabled'],
    });
    const changeTypeBtn = button.build({
      text: 'Change Plan Type',
      style: 'secondary',
      type: 'contained',
      classNames: downloadedFromSalesforce ? ['planTypeBtn', 'disabled'] : ['planTypeBtn'],
    });

    //morepopupmenu.appendChild(addWorkflowBtn);
    morepopupmenu.appendChild(reportBtn);
    morepopupmenu.appendChild(reportBtn2);
    morepopupmenu.appendChild(reportSignatureBtn);
    morepopupmenu.appendChild(sendtoPortalBtn);

    if (sentToOnet !== '') {
      const sentToOnetPDiv = document.createElement('div');
      sentToOnetPDiv.classList.add('sentToOnetDateDiv');
      sentToOnetPDiv.innerHTML = `<p>Previously sent on: ${sentToOnet}`;
      morepopupmenu.appendChild(sentToOnetPDiv);
    }

    morepopupmenu.appendChild(sendToDODDBtn);
    morepopupmenu.appendChild(editDatesBtn);
    morepopupmenu.appendChild(statusBtn);
    morepopupmenu.appendChild(deleteBtn);
    morepopupmenu.appendChild(reactivateBtn);
    morepopupmenu.appendChild(changeTypeBtn);

    morepopupmenu.addEventListener('click', async e => {
      e.target.classList.add('disabled');

      let targetScreen;

      switch (e.target) {
        case reportBtn:
        case reportBtn2: {
          targetScreen = 'reportsScreen';
          break;
        }
        case reportSignatureBtn: {
          //targetScreen = 'reportsScreen';
          break;
        }
        case reportBtn3: {
          // Below 'targetScreen' will be for when we need to select attatchments
          targetScreen = 'reportsAttachmentScreen';
          retrieveData = {
            token: $.session.Token,
            assessmentId: getCurrentPlanId(),
          };
          break;
        }
        case sendtoPortalBtn: {
          // Below 'targetScreen' will be for when we need to select attatchments
          targetScreen = 'portalScreen';
          retrieveData = {
            token: $.session.Token,
            assessmentId: getCurrentPlanId(),
          };
          //assessment.transeferPlanReportToONET(planId, '1');
          break;
        }
        case sendToDODDBtn: {
          //Nathan TODO call ajax
          targetScreen = 'DODDScreen';
          retrieveData = {
            token: $.session.Token,
            assessmentId: getCurrentPlanId(),
          };
          break;
        }
        case editDatesBtn: {
          targetScreen = 'editDatesScreen';
          break;
        }
        case statusBtn: {
          targetScreen = 'updateStatusScreen';
          break;
        }
        case deleteBtn: {
          targetScreen = 'deleteScreen';
          break;
        }
        case reactivateBtn: {
          targetScreen = 'reactivateScreen';
          break;
        }
        case changeTypeBtn: {
          targetScreen = 'changePlanTypeScreen';
        }
        default: {
          break;
        }
      }
      e.target.classList.remove('disabled');

      if (targetScreen) {
        const targetScreenElement = document.getElementById(targetScreen);
        morePopupMenu.classList.remove('visible');
        targetScreenElement.classList.add('visible');
      }

      if (targetScreen === 'DODDScreen') {
        const extraSpace = e.target === sendToDODDBtn ? 'false' : 'true';
        //  DODDScreen = buildDODDScreen();
        runDODDScreen(extraSpace);
      }

      if (targetScreen === 'reportsScreen') {
        const extraSpace = e.target === reportBtn ? 'false' : 'true';
        runReportScreen(extraSpace);
      }

      if (targetScreen === 'portalScreen') {
        const extraSpace = e.target === sendtoPortalBtn ? 'false' : 'true';
        runPortalScreen(extraSpace);
      }
    });

    return morepopupmenu;
  }
  async function showMorePopup() {
    //sentToOnet = await assessmentAjax.getSentToONETDate({
    //  token: $.session.Token,
    //  assessmentId: planId,
    //});
    //sentToOnet = sentToOnet[0].sentDate;
    morePopup = POPUP.build({
      classNames: 'moreMenuPopup',
    });

    menuInnerWrap = document.createElement('div');
    menuInnerWrap.classList.add('moreMenuPopup__innerWrap');

    morePopupMenu = buildMorePopupMenu();
    editDatesScreen = buildEditDatesScreen();
    updateStatusScreen = buildUpdateStatusScreen();
    deleteScreen = buildDeleteScreen();
    reactivateScreen = buildReactivateScreen();
    addWorkflowScreen = buildAddWorkflowScreen();
    reportsScreen = buildReportsScreen();
    reportsAttachmentScreen = buildReportsAttachmentsScreen();
    DODDScreen = buildDODDScreen();
    changePlanTypeScreen = buildChangePlanTypeScreen();
    portalScreen = buildPortalScreen();

    menuInnerWrap.appendChild(morePopupMenu);
    menuInnerWrap.appendChild(editDatesScreen);
    menuInnerWrap.appendChild(updateStatusScreen);
    menuInnerWrap.appendChild(deleteScreen);
    menuInnerWrap.appendChild(reactivateScreen);
    menuInnerWrap.appendChild(addWorkflowScreen);
    menuInnerWrap.appendChild(reportsScreen);
    menuInnerWrap.appendChild(reportsAttachmentScreen);
    menuInnerWrap.appendChild(DODDScreen);
    menuInnerWrap.appendChild(changePlanTypeScreen);
    menuInnerWrap.appendChild(portalScreen);

    morePopup.appendChild(menuInnerWrap);

    POPUP.show(morePopup);
  }

  // Plan Finalization
  function handleReportStream(report) {
    const arr = report;
    const byteArray = new Uint8Array(arr);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    if ($.session.browser == 'Explorer' || $.session.browser == 'Mozilla') {
      window.navigator.msSaveOrOpenBlob(blob, 'report.pdf');
    } else {
      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    }
  }
  function mapResultsObj(results) {
    const obj = {};

    results.forEach(r => {
      const [action, result] = r.split(' ');
      obj[action] = result;
    });

    return obj;
  }
  async function showFinalizePopup() {
    let currScreen = 1;
    let checkboxesSelected = [];
    let finalizationResults;
    let includeInAssessment = 'false';

    const finalizePopup = POPUP.build({
      classNames: 'finalizePopup',
    });

    const screen1 = document.createElement('div');
    const screen2 = document.createElement('div');
    const screen3 = document.createElement('div');
    screen1.classList.add('finalizeSelect', 'finalizeScreen', 'visible');
    screen2.classList.add('finalizeAttachments', 'finalizeScreen');
    screen3.classList.add('screenThree', 'finalizeScreen');

    const heading1 = document.createElement('p');
    const heading2 = document.createElement('p');
    heading1.classList.add('finalizeheading');
    heading2.classList.add('finalizeheading');
    heading1.innerHTML = 'Please select the actions that should take place';
    heading2.innerHTML = 'Please select the attachment(s) that should be included with the report.';

    screen1.appendChild(heading1);
    screen2.appendChild(heading2);

    const actionBtn = button.build({
      text: 'Next',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        if (currScreen === 1) {
          if (selectedCheckboxes.selectAllCheck) {
            checkboxesSelected = ['selectAllCheck'];
          } else {
            checkboxesSelected = Object.entries(selectedCheckboxes)
              .filter(([key, value]) => {
                // return key === 'selectAllCheck'
                if (key === 'selectAllCheck') return false;
                if (value) return true;
              })
              .map(([key, value]) => {
                return key;
              });
          }

          currScreen = 2;
          screen1.classList.remove('visible');
          screen2.classList.add('visible');

          return;
        }

        if (currScreen === 2) {
          currScreen = 3;
          screen2.classList.remove('visible');
          screen3.classList.add('visible');
          actionBtn.textContent = 'Done';

          finalizationResults = await assessmentAjax.finalizationActions({
            token: $.session.Token,
            planAttachmentIds: getAttachmentIds(selectedAttachmentsPlan),
            wfAttachmentIds: getAttachmentIds(selectedAttachmentsSignature),
            sigAttachmentIds: getAttachmentIds(selectedAttachmentsWorkflow),
            userId: $.session.UserId,
            assessmentID: planId,
            peopleId: selectedConsumer.id,
            emailAddresses: [...Object.values(selectedEmails)],
            checkBoxes: [...checkboxesSelected],
            extraSpace: 'false',
            toONET: false,
            isp: false,
            oneSpan: false,
            signatureOnly: false,
            include: includeInAssessment,
            versionID: '1',
          });
          console.table(finalizationResults);

          handleReportStream(finalizationResults.report);
          const resultsObj = mapResultsObj(finalizationResults.actions);
          console.log('actions', finalizationResults.actions);
          console.log('resultsObj', resultsObj);

          // TODO: once we get results update screen 3 icons
          // icons.checkmark || icons.close
          if (selectedCheckboxes.selectAllCheck) {
            sendToDODDStatusIcon.innerHTML = resultsObj.DODD === 'success' ? icons.checkmark : icons.close;
            sendToDODDStatusIcon.classList.toggle(resultsObj.DODD === 'success', 'success');
            sendToOhioNetStatusIcon.innerHTML = resultsObj.ONET === 'success' ? icons.checkmark : icons.close;
            sendToDODDStatusIcon.classList.toggle(resultsObj.ONET === 'success', 'success');
            downloadReportStatusIcon.innerHTML = resultsObj.REPORT === 'success' ? icons.checkmark : icons.close;
            sendToDODDStatusIcon.classList.toggle(resultsObj.REPORT === 'success', 'success');
            emailReportStatusIcon.innerHTML = icons.checkmark ? resultsObj.EMAIL === 'success' : icons.close;
            sendToDODDStatusIcon.classList.toggle(resultsObj.EMAIL === 'success', 'success');
            console.log('ONET', resultsObj.ONET);
            console.log('DODD', resultsObj.DODD);
            console.log('REPORT', resultsObj.REPORT);
            console.log('EMAIL', resultsObj.EMAIL);
          } else {
            if (selectedCheckboxes.sendToDODDCheck) {
              sendToDODDStatusIcon.innerHTML = resultsObj.DODD === 'success' ? icons.checkmark : icons.close;
              sendToDODDStatusIcon.classList.toggle(resultsObj.DODD === 'success', 'success');
              console.log('DODD', resultsObj.DODD);
            }
            if (selectedCheckboxes.sendToOhioNetCheck) {
              sendToOhioNetStatusIcon.innerHTML = resultsObj.ONET === 'success' ? icons.checkmark : icons.close;
              sendToDODDStatusIcon.classList.toggle(resultsObj.ONET === 'success', 'success');
              console.log('ONET', resultsObj.ONET);
            }
            if (selectedCheckboxes.downloadReportCheck) {
              downloadReportStatusIcon.innerHTML = resultsObj.REPORT === 'success' ? icons.checkmark : icons.close;
              sendToDODDStatusIcon.classList.toggle(resultsObj.REPORT === 'success', 'success');
              console.log('REPORT', resultsObj.REPORT);
            }
            if (selectedCheckboxes.emailReportCheck) {
              emailReportStatusIcon.innerHTML = icons.checkmark ? resultsObj.EMAIL === 'success' : icons.close;
              sendToDODDStatusIcon.classList.toggle(resultsObj.EMAIL === 'success', 'success');
              console.log('EMAIL', resultsObj.EMAIL);
            }
          }

          return;
        }

        if (currScreen === 3) {
          actionBtn.textContent = 'Next';
          POPUP.hide(finalizePopup);
        }
      },
    });

    finalizePopup.appendChild(screen1);
    finalizePopup.appendChild(screen2);
    finalizePopup.appendChild(screen3);
    finalizePopup.appendChild(actionBtn);

    //----------------------------------------------
    // screen 1
    //----------------------------------------------
    const selectedCheckboxes = {
      selectAllCheck: true,
      sendToDODDCheck: true,
      sendToOhioNetCheck: true,
      downloadReportCheck: true,
      emailReportCheck: true,
    };
    const selectedEmails = {};
    const emails = await assessmentAjax.getDefaultEmailsForFinalization();
    const checkboxWrap = document.createElement('div');
    checkboxWrap.classList.add('checkboxes');

    const selectAllCheck = input.buildCheckbox({
      id: 'selectAll',
      text: 'Select All',
      isChecked: true,
      callback: e => {
        selectedCheckboxes.selectAllCheck = e.target.checked;

        if (selectedCheckboxes.selectAllCheck) {
          sendToDODDCheck.querySelector('input').checked = true;
          sendToOhioNetCheck.querySelector('input').checked = true;
          downloadReportCheck.querySelector('input').checked = true;
          emailReportCheck.querySelector('input').checked = true;

          selectedCheckboxes.sendToDODDCheck = true;
          sendToOhioNetCheck.sendToDODDCheck = true;
          downloadReportCheck.sendToDODDCheck = true;
          emailReportCheck.sendToDODDCheck = true;
        }
      },
    });
    const sendToDODDCheck = input.buildCheckbox({
      id: 'sendToDODD',
      text: 'Send To DODD',
      isChecked: true,
      callback: e => {
        selectedCheckboxes.sendToDODDCheck = e.target.checked;

        if (!e.target.checked) {
          selectAllCheck.querySelector('input').checked = false;
          selectedCheckboxes.selectAllCheck = false;
        }
      },
    });
    const sendToOhioNetCheck = input.buildCheckbox({
      id: 'sendToOhioNet',
      text: 'Send to OhioDD.net',
      isChecked: true,
      callback: e => {
        selectedCheckboxes.sendToOhioNetCheck = e.target.checked;

        if (!e.target.checked) {
          selectAllCheck.querySelector('input').checked = false;
          selectedCheckboxes.selectAllCheck = false;
        }
      },
    });
    const downloadReportCheck = input.buildCheckbox({
      id: 'downloadReport',
      text: 'Download Report',
      isChecked: true,
      callback: e => {
        selectedCheckboxes.downloadReportCheck = e.target.checked;

        if (!e.target.checked) {
          selectAllCheck.querySelector('input').checked = false;
          selectedCheckboxes.selectAllCheck = false;
        }
      },
    });
    const emailReportCheck = input.buildCheckbox({
      id: 'emailReport',
      text: 'Email Report',
      isChecked: true,
      callback: e => {
        selectedCheckboxes.emailReportCheck = e.target.checked;

        if (!e.target.checked) {
          selectAllCheck.querySelector('input').checked = false;
          selectedCheckboxes.selectAllCheck = false;
        }
      },
    });

    const addEmailBtn = button.build({
      text: 'Add Email',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        //if (Object.values(selectedEmails).length === 5) return;

        const id = _UTIL.autoIncrementId(`email-${Object.values(selectedEmails).length}`);
        selectedEmails[id] = '';

        const wrap = document.createElement('div');
        wrap.classList.add('emailWrap');

        const emailInput = input.build({
          label: 'Email',
          type: 'email',
          callback: e => {
            selectedEmails[id] = e.target.value;
          },
        });

        const deleteEmail = document.createElement('span');
        deleteEmail.innerHTML = icons.delete;
        deleteEmail.addEventListener('click', () => {
          wrap.remove();
          delete selectedEmails[id];
          addEmailBtn.classList.toggle(Object.values(selectedEmails).length === 5, 'disabled');
        });

        wrap.appendChild(emailInput);
        wrap.appendChild(deleteEmail);
        screen1.appendChild(wrap);
        
        addEmailBtn.classList.toggle(Object.values(selectedEmails).length === 5, 'disabled');
      },
    });

    screen1.appendChild(checkboxWrap);
    screen1.appendChild(addEmailBtn);
    checkboxWrap.appendChild(selectAllCheck);
    checkboxWrap.appendChild(sendToDODDCheck);
    checkboxWrap.appendChild(sendToOhioNetCheck);
    checkboxWrap.appendChild(downloadReportCheck);
    checkboxWrap.appendChild(emailReportCheck);

    if (emails) {
      emails.forEach((email, index) => {
        if (email.setting_value === '') {
          return;
        }

        const id = _UTIL.autoIncrementId(`email-${index + 1}`);
        selectedEmails[id] = email.setting_value;

        const wrap = document.createElement('div');
        wrap.classList.add('emailWrap');

        const emailInput = input.build({
          label: 'Email',
          type: 'email',
          value: email.setting_value,
          callback: e => {
            selectedEmails[id] = e.target.value;
          },
        });

        const deleteEmail = document.createElement('span');
        deleteEmail.innerHTML = icons.delete;
        deleteEmail.addEventListener('click', () => {
          wrap.remove();
          delete selectedEmails[id];
          addEmailBtn.classList.toggle(Object.values(selectedEmails).length === 5, 'disabled');
        });

        wrap.appendChild(emailInput);
        wrap.appendChild(deleteEmail);
        screen1.appendChild(wrap);
      });
    }

    //----------------------------------------------
    // screen 2
    //----------------------------------------------
    const selectedAttachmentsPlan = {};
    const selectedAttachmentsSignature = {};
    const selectedAttachmentsWorkflow = {};

    const planAttBody = document.createElement('div');
    const workflowAttBody = document.createElement('div');
    const signatureAttBody = document.createElement('div');
    planAttBody.classList.add('attachWrap');
    workflowAttBody.classList.add('attachWrap');
    signatureAttBody.classList.add('attachWrap');
    const planHeading = document.createElement('h2');
    const workflowHeading = document.createElement('h2');
    const signHeading = document.createElement('h2');
    planHeading.innerText = 'Plan Attachments';
    workflowHeading.innerText = 'Workflow Attachments';
    signHeading.innerText = 'Signature Attachments';
    planAttBody.appendChild(planHeading);
    workflowAttBody.appendChild(workflowHeading);
    signatureAttBody.appendChild(signHeading);
    screen2.appendChild(planAttBody);
    screen2.appendChild(workflowAttBody);
    screen2.appendChild(signatureAttBody);

    const attachments = await planAjax.getPlanAndWorkFlowAttachments({
      token: $.session.Token,
      assessmentId: planId,
    });

    let index = 0;

    if (attachments) {
      for (const prop in attachments) {
        attachments[prop].order = index;
        const a = attachments[prop];
        const attachment = document.createElement('div');
        attachment.classList.add('attachment');
        const description = document.createElement('p');
        description.innerText = a.description;
        attachment.appendChild(description);

        attachment.addEventListener('click', () => {
          if (!attachment.classList.contains('selected')) {
            attachment.classList.add('selected');
            if (a.sigAttachmentId) {
              selectedAttachmentsSignature[a.order] = { ...a };
            } else if (a.whereFrom === 'Plan') {
              selectedAttachmentsPlan[a.order] = { ...a };
            } else {
              selectedAttachmentsWorkflow[a.order] = { ...a };
            }
          } else {
            attachment.classList.remove('selected');
            if (a.sigAttachmentId) {
              delete selectedAttachmentsSignature[a.order];
            } else if (a.whereFrom === 'Plan') {
              delete selectedAttachmentsPlan[a.order];
            } else {
              delete selectedAttachmentsWorkflow[a.order];
            }
          }
        });

        if (a.sigAttachmentId) {
          signatureAttBody.appendChild(attachment);
        } else if (a.whereFrom === 'Plan') {
          planAttBody.appendChild(attachment);
        } else {
          workflowAttBody.appendChild(attachment);
        }

        index++;
      }
    }

    const includeInAssessmentCheck = input.buildCheckbox({
      id: 'includeInAssessmentCheck',
      text: 'Include Important to, Important For, Skills and Abilities, and Risks in assessment',
      isChecked: false,
      callback: e => {
        includeInAssessment = e.target.checked ? 'true' : 'false';
      },
    });
    screen2.appendChild(includeInAssessmentCheck);

    //----------------------------------------------
    // screen 3
    //----------------------------------------------
    const sendToDODDStatus = document.createElement('div');
    const sendToOhioNetStatus = document.createElement('div');
    const downloadReportStatus = document.createElement('div');
    const emailReportStatus = document.createElement('div');
    sendToDODDStatus.classList.add('finalizeStatus');
    sendToOhioNetStatus.classList.add('finalizeStatus');
    downloadReportStatus.classList.add('finalizeStatus');
    emailReportStatus.classList.add('finalizeStatus');
    sendToDODDStatus.innerHTML = '<p>Send to DODD</p>';
    sendToOhioNetStatus.innerHTML = '<p>Send to OhioDD.net</p>';
    downloadReportStatus.innerHTML = '<p>Download Report</p>';
    emailReportStatus.innerHTML = '<p>Email Report</p>';
    const sendToDODDStatusIcon = document.createElement('span');
    const sendToOhioNetStatusIcon = document.createElement('span');
    const downloadReportStatusIcon = document.createElement('span');
    const emailReportStatusIcon = document.createElement('span');
    sendToDODDStatus.appendChild(sendToDODDStatusIcon);
    sendToOhioNetStatus.appendChild(sendToOhioNetStatusIcon);
    downloadReportStatus.appendChild(downloadReportStatusIcon);
    emailReportStatus.appendChild(emailReportStatusIcon);

    if (selectedCheckboxes.selectAllCheck) {
      screen3.appendChild(sendToDODDStatus);
      screen3.appendChild(sendToOhioNetStatus);
      screen3.appendChild(downloadReportStatus);
      screen3.appendChild(emailReportStatus);
    } else {
      if (selectedCheckboxes.sendToDODDCheck) {
        screen3.appendChild(sendToDODDStatus);
      }
      if (selectedCheckboxes.sendToOhioNetCheck) {
        screen3.appendChild(sendToOhioNetStatus);
      }
      if (selectedCheckboxes.downloadReportCheck) {
        screen3.appendChild(downloadReportStatus);
      }
      if (selectedCheckboxes.emailReportCheck) {
        screen3.appendChild(emailReportStatus);
      }
    }

    POPUP.show(finalizePopup);
  }

  // plan header
  function refreshGeneralInfo() {
    planHeader.removeChild(planHeaderGeneralInfoBar);

    planHeaderGeneralInfoBar = buildGeneralInfoBar();
    planHeader.insertBefore(planHeaderGeneralInfoBar, planHeaderButtons);
  }
  function getConsumerNameFromCard({ card, firstName, lastName }) {
    if (!card) {
      return `${lastName} ${firstName}`;
    }

    const firstName2 = card.querySelector('.name_first');
    const lastName2 = card.querySelector('.name_last');

    if (!firstName2 || !lastName2) return;

    return `${lastName2.innerText} ${firstName2.innerText}`;
  }
  function buildGeneralInfoBar() {
    let type;

    if (planType === 'r') {
      type = 'Revision';
    } else if (planType === 'a') {
      type = 'Annual';
    }

    const PlanStartDate = planDates.getPlanYearStartDate();
    const PlanEndDate = planDates.getPlanYearEndDate();
    const EffectiveStartDate = planDates.getEffectiveStartDate();
    const EffectiveEndDate = planDates.getEffectiveEndDate();

    const formatedDate = UTIL.formatDateFromDateObj(EffectiveStartDate);
    const splitFormatedDate = formatedDate.split('-');
    let esDate = `${splitFormatedDate[1]}/${splitFormatedDate[2]}/${splitFormatedDate[0].substring(2)}`;

    const formatedDate2 = UTIL.formatDateFromDateObj(EffectiveEndDate);
    const splitFormatedDate2 = formatedDate2.split('-');
    let edDate = `${splitFormatedDate2[1]}/${splitFormatedDate2[2]}/${splitFormatedDate2[0].substring(2)}`;

    const formatedDate3 = UTIL.formatDateFromDateObj(PlanStartDate);
    const splitFormatedDate3 = formatedDate3.split('-');
    let starDate = `${splitFormatedDate3[1]}/${splitFormatedDate3[2]}/${splitFormatedDate3[0].substring(2)}`;

    const formatedDate4 = UTIL.formatDateFromDateObj(PlanEndDate);
    const splitFormatedDate4 = formatedDate4.split('-');
    let endDate = `${splitFormatedDate4[1]}/${splitFormatedDate4[2]}/${splitFormatedDate4[0].substring(2)}`;

    generalInfoBar = document.createElement('div');
    generalInfoBar.classList.add('generalInfo');
    generalInfoBar.setAttribute('data-people-id', `${selectedConsumer.id}`);

    const consumerName = `<p>${getConsumerNameFromCard(selectedConsumer)}</p>`;
    const dateSpan = `<p>Span: ${starDate} - ${endDate}</p>`;
    const dateSpanEff = `<p>Eff: ${esDate} - ${edDate}</p>`;
    const typeAndNum = revisionNumber > 0 ? `<p>${type} ${revisionNumber}</p>` : `<p>${type}</p>`;

    generalInfoBar.innerHTML = `
      <div class="generalInfo__row1">${consumerName}${typeAndNum}</div>
      <div class="generalInfo__row2">${dateSpan}${dateSpanEff}</div>
    `;

    return generalInfoBar;
  }
  function buildButtonBar() {
    const buttonBar = document.createElement('div');
    buttonBar.classList.add('buttonBar');

    const moreBtn = button.build({
      text: 'More',
      style: 'secondary',
      type: 'contained',
      callback: showMorePopup,
    });
    const finalizeBtn = button.build({
      text: 'Finalize Plan',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        //if (planStatus === 'C') {
        showFinalizePopup();
        //}
      },
    });
    const backBtn = button.build({
      text: 'Back',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        clearAllDataKeepConsumer();
        loadLandingPage();
      },
    });

    buttonBar.appendChild(moreBtn);
    buttonBar.appendChild(finalizeBtn);
    buttonBar.appendChild(backBtn);

    return buttonBar;
  }
  function buildPlanHeader() {
    planHeader = document.createElement('div');
    planHeader.classList.add('planHeader');

    planHeaderGeneralInfoBar = buildGeneralInfoBar();
    planHeaderButtons = buildButtonBar();

    planHeader.appendChild(planHeaderGeneralInfoBar);
    planHeader.appendChild(planHeaderButtons);

    return planHeader;
  }
  // main build
  async function getWorkflowMarkup() {
    const workflowMarkup = document.createElement('div');
    workflowMarkup.classList.add('planWorkflow');

    const processId = planWorkflow.getProcessId(planType);
    const workflowViewer = await WorkflowViewerComponent.get(processId, planId);
    const addWorkflowBtn = button.build({
      id: 'workflow_addWorkflowBtn',
      text: 'Add Workflow(s)',
      style: 'secondary',
      type: 'contained',
      classNames: ['addWorkflowBtn'],
      callback: () => {
        planWorkflow.addWorkflowPopup();
      },
    });

    workflowMarkup.appendChild(addWorkflowBtn);
    workflowMarkup.appendChild(workflowViewer);

    return workflowMarkup;
  }
  async function buildPlanPage(loadingOrder, workflowDashboardCallback) {
    // loadingOrder = ['a', 'i', 'w']
    document.body.classList.add('planActive');

    const planHeading = buildPlanHeader();
    const loadingBar = PROGRESS.SPINNER.get('Loading Plan...');
    DOM.clearActionCenter();
    DOM.ACTIONCENTER.appendChild(planHeading);
    DOM.ACTIONCENTER.appendChild(loadingBar);
    // init data for tab sections
    await planData.init(planId);
    await planAttachment.getAttachments(planId);

    // build tab section wraps
    const assessmentWrap = document.createElement('div');
    const ispWrap = document.createElement('div');
    const workflowWrap = document.createElement('div');
    assessmentWrap.id = 'planAssessment';
    ispWrap.id = 'planISP';
    workflowWrap.id = 'planWorkflow';

    const firstToLoad = loadingOrder ? loadingOrder[0] : 'a';
    let defaultActiveTab = firstToLoad === 'a' ? 0 : firstToLoad === 'i' ? 1 : 2;

    // Build Tabs Markup
    const tabs = TABS.build(
      {
        navOnClick: async targetTabIndex => {
          if (targetTabIndex === '0') {
            $.loadedAppPage = 'planAssessment';
            TABS.toggleNavStatus(tabs, 'disable');
            await assessmentCard.refreshAssessmentCard({
              planStatus,
              planId,
              isActive: planActiveStatus,
            });
            TABS.toggleNavStatus(tabs, 'enable');
          } else if (targetTabIndex === '1') {
            TABS.toggleNavStatus(tabs, 'disable');

            $.loadedAppPage = 'planISP';
            await ISP.refreshISP(planId);
            TABS.toggleNavStatus(tabs, 'enable');
            DOM.autosizeTextarea();
          } else if (targetTabIndex === '2') {
            TABS.toggleNavStatus(tabs, 'disable');

            $.loadedAppPage = 'planWorkflow';
            const workflowLoadingBar = PROGRESS.SPINNER.get('Loading Workflow...');
            workflowWrap.innerHTML = '';
            workflowWrap.appendChild(workflowLoadingBar);
            const newWorkflowMarkup = await getWorkflowMarkup();
            workflowWrap.innerHTML = '';
            workflowWrap.appendChild(newWorkflowMarkup);
            TABS.toggleNavStatus(tabs, 'enable');
          }
          DOM.autosizeTextarea();
        },
        active: defaultActiveTab,
      },
      [
        {
          heading: 'Assessment',
          markup: assessmentWrap,
        },
        {
          heading: 'ISP',
          markup: ispWrap,
        },
        {
          heading: 'Workflow',
          markup: workflowWrap,
        },
      ],
    );

    // initial load by ordering

    switch (firstToLoad) {
      case 'a': {
        $.loadedAppPage = 'planAssessment';
        defaultActiveTab = 0;

        const assessmentData = await assessment.getAssessmentData(planId);
        const assessmentMarkup = await assessmentCard.build(assessmentData, {
          selectedConsumer,
          planStatus,
          planId,
          isActive: planActiveStatus,
        });
        assessmentWrap.appendChild(assessmentMarkup);

        break;
      }
      case 'i': {
        $.loadedAppPage = 'planISP';
        defaultActiveTab = 1;

        await ISP.refreshISP(planId);
        TABS.toggleNavStatus(tabs, 'enable');
        break;
      }
      case 'w': {
        $.loadedAppPage = 'planWorkflow';
        defaultActiveTab = 2;

        const workflowLoadingBar = PROGRESS.SPINNER.get('Loading ISP...');
        workflowWrap.innerHTML = '';
        workflowWrap.appendChild(workflowLoadingBar);
        const newWorkflowMarkup = await getWorkflowMarkup();
        workflowWrap.innerHTML = '';
        workflowWrap.appendChild(newWorkflowMarkup);
        TABS.toggleNavStatus(tabs, 'enable');
        break;
      }
    }

    DOM.ACTIONCENTER.removeChild(loadingBar);
    DOM.ACTIONCENTER.appendChild(tabs);
    TABS.toggleNavStatus(tabs, 'enable');

    if (workflowDashboardCallback) workflowDashboardCallback();

    if (defaultActiveTab === 0) {
      mainAssessment.markUnansweredQuestions();
      tableOfContents.showUnansweredQuestionCount();
    }

    DOM.autosizeTextarea();

    //sentToOnet = await assessmentAjax.getSentToONETDate({
    //  token: $.session.Token,
    //  assessmentId: planId,
    //});
    //sentToOnet = sentToOnet[0].sentDate;
  }

  // New Plan Setup Page
  //---------------------------------------------
  function sortPreviousPlans(previousPlansData) {
    return [...previousPlansData].sort((a, b) => {
      const aStart = new Date(a.planYearStart.split(' ')[0]);
      const bStart = new Date(b.planYearStart.split(' ')[0]);

      if (aStart === bStart) return 0;

      return aStart > bStart ? -1 : 1;
    });
  }
  async function handleTypeChange(e) {
    const selectedOption = e.target.options[e.target.selectedIndex];
    planType = selectedOption.value;

    if (setupWrap.contains(prevPlanTable)) setupWrap.removeChild(prevPlanTable);
    if (setupWrap.contains(datesBoxDiv)) setupWrap.removeChild(datesBoxDiv);

    if (planType === 'a') {
      await planDates.setAnnualPlanDates(previousPlansData);
      plan.setPlanType('a');
      datesBoxDiv = planDates.buildDatesBox(isValid => {
        if (isValid) {
          doneBtn.classList.remove('disabled');
        } else {
          doneBtn.classList.add('disabled');
        }
      });
      setupWrap.insertBefore(datesBoxDiv, doneBtn);
      doneBtn.classList.remove('disabled');
    }

    if (planType === 'r') {
      prevPlanTable = buildPreviousPlansTable();
      plan.setPlanType('r');
      setupWrap.insertBefore(prevPlanTable, doneBtn);
      doneBtn.classList.add('disabled');
    }
  }
  async function handleDoneBtnClick(selectedConsumer) {
    if (doneBtn.classList.contains('disabled')) {
      return;
    }

    PROGRESS__BTN.SPINNER.show('annualRevisionDoneBtn', '', true);
    const processId = planWorkflow.getProcessId(planType);
    const wfvData = await planWorkflow.getWorkflowList(processId, 0);

    if (!wfvData || wfvData.length === 0) {
      createNewPlan(selectedConsumer, processId);
      return;
    }

    //const foo = async (selectedWorkflows) => {
    //  const workflowCallback = selectedWorkflows  => {
    const workflowCallback = async selectedWorkflows => {
      PROGRESS__BTN.SPINNER.show('workflowContinueBtn', '', false);
      // TODO 100969 -- display list of User Forms for the selected Workflows

      if ($.session.planFormCarryover) {
        let selectedwfForms = [];

        const wfvPopup = document.querySelector('.workflowListPopup');
        if (wfvPopup) {
          POPUP.hide(wfvPopup);
        }

        // *********FAKE DATA for Step Docs in a Workflow*****Albert Annual 6/23******Annual -- 279, Antnio -- 934*******************
        //  const wfFormsData2 = [{ docId : 6052 , description : 'Expert 15 test.pdf', WFId: 934, wfName: 'Antinono 3' },
        // { docId : 6053 , description : 'FORMS -- General.pdf', WFId: 934, wfName: 'Antinono 3' },
        // { docId : 1836 , description : 'Medication -- Med Assessment.pdf', WFId: 279, wfName: 'Annual - Waver'},
        ///  { docId : 3201 , description : 'Signed_Plan.pdf', WFId: 279, wfName: 'Annual - Waver'} ];

        let thisannual_plan;
        // inserting a new plan based on a selected prior plan
        if (priorConsumerPlanId && priorConsumerPlanId !== '') {
          thisPreviousPlanId = priorConsumerPlanId;
        } else {
          // // inserting a new plan based on the most recent existing plan
          thisannual_plan = previousPlansData.filter(wf => wf.active === 'True');
          if (thisannual_plan && thisannual_plan.length > 0) {
            thisPreviousPlanId = thisannual_plan[0].consumerPlanId;
          }
        }

        const wfFormsData = await WorkflowViewerAjax.getWorkFlowFormsfromPreviousPlan({
          token: $.session.Token,
          selectedWFTemplateIds: selectedWorkflows.join(', '),
          previousPlanId: thisPreviousPlanId,
        });

        const wfFormsPopup = POPUP.build({
          classNames: ['wfFormsPopup'],
        });

        const title = document.createElement('h2');
        title.innerHTML = 'Select forms to attach.</br>';
        const linebr = document.createElement('div');
        linebr.innerHTML = '</br>';
        wfFormsPopup.appendChild(title);
        wfFormsPopup.appendChild(linebr);

        const doneBtn = button.build({
          id: 'wfFormsContinueBtn',
          text: 'Continue',
          type: 'contained',
          style: 'secondary',
          // classNames: ['copySelectedBtn', 'disabled'],
          classNames: 'copySelectedBtn',
          callback: () => {
            var selectedPreviousWfForms = planWorkflow.getselectedWorkFlowForms();
            var wf_template_selected = selectedWorkflows;

            POPUP.hide(wfFormsPopup);
            createNewPlan(selectedConsumer, processId, selectedWorkflows, selectedPreviousWfForms);
          },
        });

        if (wfFormsData && wfFormsData.length > 0) {
          const list = planWorkflow.buildWorkflowFormList(wfFormsData);
          wfFormsPopup.appendChild(list);
          wfFormsPopup.appendChild(doneBtn);
          POPUP.show(wfFormsPopup);
        } else {
          createNewPlan(selectedConsumer, processId, selectedWorkflows);
        }
      } else {
        // if ($.session.planFormCarryover
        createNewPlan(selectedConsumer, processId, selectedWorkflows);
      }
    };
    planWorkflow.showWorkflowListPopup(wfvData, workflowCallback);
  }
  function getSelectedConsumerName(selectedConsumer) {
    const last = selectedConsumer.card.querySelector('.name_last');
    const first = selectedConsumer.card.querySelector('.name_first');
    return `${first.innerText} ${last.innerText}`;
  }
  async function createNewPlan(selectedConsumer, processId, selectedWorkflows, selectedPreviousWfForms) {
    const EffectiveEndDate = planDates.getEffectiveEndDate();
    let edDate = UTIL.formatDateFromDateObj(EffectiveEndDate);

    let currentPlanId;
    let workflowId;
    let insertedSSA;
    const workflowIds = [];
    const wfDocIds = [];

    //var selectedConsumer = plan.getSelectedConsumer();
    var salesForceCaseManagerId = await consentAndSignAjax.getStateCaseManagerforConsumer({
      peopleId: selectedConsumer.id,
    });

    if (planType === 'a') {
      const planYearStartDate = planDates.getPlanYearStartDate();
      const planYearReviewDate = planDates.getPlanReviewDate();

      let returnString = await planAjax.insertAnnualPlan({
        token: $.session.Token,
        consumerId: selectedConsumer.id,
        planYearStart: UTIL.formatDateFromDateObj(planYearStartDate),
        reviewDate: UTIL.formatDateFromDateObj(planYearReviewDate),
        salesForceCaseManagerId: salesForceCaseManagerId,
      });

      returnString = returnString.split(',');
      currentPlanId = returnString[0];
      insertedSSA = returnString[1];
    } else {
      const EffectiveStartDate = planDates.getEffectiveStartDate();
      const esDate = UTIL.formatDateFromDateObj(EffectiveStartDate);
      const planYearReviewDate = planDates.getPlanReviewDate();

      let returnString = await planAjax.insertRevisedPlan({
        token: $.session.Token,
        priorConsumerPlanId,
        effectiveStart: esDate,
        effectiveEnd: edDate,
        reviewDate: UTIL.formatDateFromDateObj(planYearReviewDate),
        useLatestPlanVersion: true,
        salesForceCaseManagerId: salesForceCaseManagerId,
      });

      returnString = returnString.split(',');
      currentPlanId = returnString[0];
      insertedSSA = returnString[1];
    }
    // handle selected workflows
    if (selectedWorkflows && selectedWorkflows.length > 0) {
      for (i = 0; i < selectedWorkflows.length; i++) {
        let wftemplateId = selectedWorkflows[i];
        // does this have any attached WF Forms, if so then wantedFormIds: selectedPreviousWfForms, otherwise wantedFormDescriptions: ""
        let thiswfForms;

        // handle selected forms
        if (selectedPreviousWfForms && selectedPreviousWfForms.length > 0) {
          let thiswfFormslist = [];
          for (j = 0; j < selectedPreviousWfForms.length; j++) {
            if (wftemplateId === selectedPreviousWfForms[j].WFtemplateId) {
              //thiswfFormslist.push(selectedPreviousWfForms[j].description);
              thiswfFormslist.push(selectedPreviousWfForms[j].attachmentId);
            }
          }
          if (thiswfFormslist && thiswfFormslist.length > 0) {
            thiswfForms = thiswfFormslist.join(',');
          } else {
            thiswfForms = '';
          }
        } else {
          thiswfForms = '';
        }

        workflowId = await WorkflowViewerAjax.copyWorkflowtemplateToRecord({
          token: $.session.Token,
          templateId: wftemplateId,
          referenceId: currentPlanId,
          peopleId: selectedConsumer.id,
          wantedFormAttachmentIds: thiswfForms,
          priorConsumerPlanId: thisPreviousPlanId,
        });
        workflowIds.push(workflowId);
      }
    }

    // START: Josh's WF ------------------
    const autoworkflowIds = await planAjax.insertAutomatedWorkflows({
      token: $.session.Token,
      processId,
      peopleId: selectedConsumer.id,
      referenceId: currentPlanId,
      priorConsumerPlanId: thisPreviousPlanId,
    });
    var autoWFIds = autoworkflowIds.split(',');
    workflowIds.push(...autoWFIds);
    // END: Josh's WF ---------------------

    const wfvPopup = document.querySelector('.workflowListPopup');
    if (wfvPopup) {
      // PROGRESS__BTN.SPINNER.hide('workflowContinueBtn');
      POPUP.hide(wfvPopup);
    }

    PROGRESS.SPINNER.show('Building Plan...');

    setActiveModuleSectionAttribute('plan-questionsAndAnswers-edit');

    planId = currentPlanId;
    planType = planType;
    planStatus = 'D';
    planActiveStatus = true;
    revisionNumber = undefined;

    if (salesForceCaseManagerId === '0') {
      // const wfvPopup = document.querySelector('.workflowListPopup');
      // if (wfvPopup) {
      //   // PROGRESS__BTN.SPINNER.hide('workflowContinueBtn');
      //   POPUP.hide(wfvPopup);
      // }
      const consumer = getSelectedConsumerName(selectedConsumer);
      showAddedToTeamMemberNoCasemanagerFoundPopup(consumer, () => {
        POPUP.hide(addedMemberNoCaseManagerPopup);
        planWorkflow.displayWFwithMissingResponsibleParties(workflowIds);
        buildPlanPage();
      });
    } else if (salesForceCaseManagerId === '-1') {
      // const wfvPopup = document.querySelector('.workflowListPopup');
      // if (wfvPopup) {
      //   // PROGRESS__BTN.SPINNER.hide('workflowContinueBtn');
      //   POPUP.hide(wfvPopup);
      // }
      const consumer = getSelectedConsumerName(selectedConsumer);
      showAddedToTeamMemberPopup(consumer, insertedSSA, () => {
        POPUP.hide(addedMemberPopup);
        planWorkflow.displayWFwithMissingResponsibleParties(workflowIds);
        buildPlanPage();
      });
    } else {
      const consumer = getSelectedConsumerName(selectedConsumer);
      showAddedToTeamMemberPopup(consumer, insertedSSA, () => {
        POPUP.hide(addedMemberPopup);
        planWorkflow.displayWFwithMissingResponsibleParties(workflowIds);
        buildPlanPage();
      });
    }
  }

  function buildPreviousPlansTable(forChangeType, callbackForChangeType) {
    const tableOptions = {
      plain: true,
      columnHeadings: ['Type', 'Rev #', 'PY Start', 'Eff Start', 'Review'],
      tableId: forChangeType ? 'previousPlanTableMoreMenu' : 'previousPlanTable',
      headline: 'Select a plan below for revision',
    };

    const tableData = previousPlansData
      .filter(prevPlan => {
        return prevPlan.active === 'True';
      })
      .map(prevPlan => {
        const type = prevPlan.planType === 'A' ? 'Ann' : 'Rev';
        const revisionNum = prevPlan.revisionNumber !== '0' ? prevPlan.revisionNumber : '';
        const start = prevPlan.planYearStart.split(' ')[0];
        const effectiveStart = prevPlan.effectiveStart.split(' ')[0];
        const reviewDate = prevPlan.reviewDate ? prevPlan.reviewDate.split(' ')[0] : 'n/a';

        return {
          values: [type, revisionNum, start, effectiveStart, reviewDate],
          attributes: [{ key: 'data-plan-id', value: prevPlan.consumerPlanId }],
          onClick: e => {
            if (!forChangeType) {
              const row = e.target;
              const previouslySeletedRow = prevPlanTable.querySelector('.selected');
              if (previouslySeletedRow) previouslySeletedRow.classList.remove('selected');

              row.classList.add('selected');

              planDates.setRevisionPlanDates(prevPlan);

              priorConsumerPlanId = prevPlan.consumerPlanId;

              if (setupWrap.contains(datesBoxDiv)) setupWrap.removeChild(datesBoxDiv);
              datesBoxDiv = planDates.buildDatesBox(isValid => {
                if (isValid) {
                  doneBtn.classList.remove('disabled');
                } else {
                  doneBtn.classList.add('disabled');
                }
              });
              setupWrap.insertBefore(datesBoxDiv, prevPlanTable);
            } else {
              callbackForChangeType(e.target, prevPlan);
            }
          },
        };
      });

    const previousPlansTable = table.build(tableOptions);
    table.populate(previousPlansTable, tableData);

    return previousPlansTable;
  }
  function toggleNewPlanDoneBtn(disable) {
    if (disable) {
      if (doneBtn) doneBtn.classList.add('disabled');
      return;
    }

    if (doneBtn) doneBtn.classList.remove('disabled');
  }
  async function buildNewPlanSetupPage(selectedConsumer) {
    setupWrap = document.createElement('div');
    setupWrap.classList.add('planSetupPage');

    hasPreviousPlans = previousPlansData && previousPlansData.length > 0 ? true : false;

    typeDropdown = dropdown.build({
      label: 'Type',
      style: 'secondary',
      className: 'planTypeDropdown',
    });

    let typeData;

    if (hasPreviousPlans) {
      planType = '%';
      typeData = [
        { value: '%', text: '' },
        { value: 'a', text: 'Annual' },
        { value: 'r', text: 'Revision' },
      ];
    } else {
      planType = 'a';
      typeData = [{ value: 'a', text: 'Annual' }];
    }

    dropdown.populate(typeDropdown, typeData);

    typeDropdown.addEventListener('change', handleTypeChange);

    doneBtn = button.build({
      id: 'annualRevisionDoneBtn',
      text: 'Done',
      type: 'contained',
      style: 'secondary',
      classNames: ['setupDoneBtn', 'disabled'],
      callback: () => handleDoneBtnClick(selectedConsumer),
    });

    setupWrap.appendChild(typeDropdown);

    if (!hasPreviousPlans) {
      plan.setPlanType('a');
      await planDates.setAnnualPlanDates(previousPlansData);
      datesBoxDiv = planDates.buildDatesBox(isValid => {
        if (isValid) {
          doneBtn.classList.remove('disabled');
        } else {
          doneBtn.classList.add('disabled');
        }
      });
      setupWrap.appendChild(datesBoxDiv);
    }

    setupWrap.appendChild(doneBtn);

    return setupWrap;
  }

  // Plan Landing Page
  //---------------------------------------------
  function showInvalidSalesForceWarningPopup() {
    const warningPopup = POPUP.build({
      id: 'importRelationshipPopup',
      // closeCallback: () => {
      //   POPUP.hide(warningPopup);
      // },
    });

    const message = document.createElement('p');
    message.innerText = `This consumer does not have a Resident Number or a SalesForce ID. Please insert the Resident Number or confirm that it is a valid number in the Desktop before inserting a Plan.`;

    warningPopup.appendChild(message);

    POPUP.show(warningPopup);
  }
  function showAddedToTeamMemberPopup(consumer, ssa, callback) {
    addedMemberPopup = POPUP.build({
      id: 'importRelationshipPopup',
      hideX: true,
    });

    if (ssa) {
      addedMemberPopup.innerHTML += `<p>${consumer} and ${ssa} have been added as a Team Member to this plan.</p>`;
    } else {
      addedMemberPopup.innerHTML += `<p>${consumer} has been added as a Team Member to this plan.</p>`;
      // addedMemberPopup.innerHTML += `<p>${consumer} has been added as a Team Member to this plan.</p>
      // <p>No SSA/QIDP assigned to this consumer in Salesforce. Please assign SSA/QIDP.</p>
      // `;
    }

    const okButton = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: callback,
    });

    addedMemberPopup.appendChild(okButton);

    POPUP.show(addedMemberPopup);
  }

  function showAddedToTeamMemberNoCasemanagerFoundPopup(consumer, callback) {
    addedMemberNoCaseManagerPopup = POPUP.build({
      id: 'importRelationshipPopup',
      hideX: true,
    });

    addedMemberNoCaseManagerPopup.innerHTML += `<p>${consumer} has been added as a Team Member to this plan.</p>
      <p>No SSA/QIDP assigned to this consumer in Salesforce. Please assign SSA/QIDP.</p>`;

    const okButton = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: callback,
    });

    addedMemberNoCaseManagerPopup.appendChild(okButton);

    POPUP.show(addedMemberNoCaseManagerPopup);
  }

  function buildNewPlanBtn() {
    return button.build({
      text: 'Add New Plan',
      style: 'secondary',
      type: 'contained',
      classNames: !$.session.planUpdate ? ['disabled'] : ['newPlanBtn'],
      callback: async () => {
        if (newPlanBtn.innerText === 'ADD NEW PLAN') {
          PROGRESS__BTN.SPINNER.show(newPlanBtn);

          if ($.session.areInSalesForce) {
            // validate salesforce
            isValidSalesforce = await consentAndSignAjax.validateConsumerForSalesForceId({
              consumerId: selectedConsumer.id,
            });
            if (!isValidSalesforce) {
              PROGRESS__BTN.SPINNER.hide(newPlanBtn);
              showInvalidSalesForceWarningPopup();
              return;
            }
          }

          planSetupPage = await buildNewPlanSetupPage(selectedConsumer);

          landingPage.removeChild(overviewTable);
          landingPage.appendChild(planSetupPage);

          PROGRESS__BTN.SPINNER.hide(newPlanBtn);
          newPlanBtn.innerText = 'Back';

          if (assignCaseLoadBtn) {
            assignCaseLoadBtn.style.display = 'none';
          }
        } else {
          landingPage.removeChild(planSetupPage);
          landingPage.appendChild(overviewTable);

          newPlanBtn.innerText = 'Add New Plan';
          if (assignCaseLoadBtn) {
            assignCaseLoadBtn.style.display = 'block';
          }
        }
      },
    });
  }

  function buildAssignCaseloadBtn() {
    return button.build({
      id: 'assign-case-load-btn',
      text: $.session.applicationName === 'Gatekeeper' ? 'ASSIGN CASE LOAD' : 'ASSIGN QIDP',
      style: 'secondary',
      type: 'contained',
      classNames: !$.session.planUpdate ? ['disabled'] : ['newPlanBtn'],
      callback: () => {
        csAssignCaseload.showAssignCaseLoadPopup();
      },
    });
  }

  function buildDownloadPlanBtn() {
    return button.build({
      text: 'DOWNLOAD PLAN',
      style: 'secondary',
      type: 'contained',
      classNames: ['downloadPlanBtn'],
      callback: downloadPlanFromSalesforceProgress,
    });
  }

  async function downloadPlanFromSalesforceProgress() {
    pendingSave.show('Downloading Plan...');

    const sentStatus = await planAjax.downloadPlanFromSalesforce({
      token: $.session.Token,
      consumerId: selectedConsumer.id,
      userId: $.session.UserId,
    });

    if (sentStatus === 'Download complete') {
      success = true;
    } else {
      success = false;
    }

    const pendingSavePopup = document.querySelector('.pendingSavePopup');
    pendingSavePopup.style.display = 'none';

    // Handles popup actions based on whether the One Span delivery was successsful
    if (success) {
      pendingSave.fulfill('Download Successful!');
      setTimeout(() => {
        const savePopup = document.querySelector('.successfulSavePopup');
        DOM.ACTIONCENTER.removeChild(savePopup);
        overlay.hide();

        loadLandingPage();
      }, 700);
    } else {
      pendingSave.reject('Failed to download plan, please try again.');
      setTimeout(() => {
        const failPopup = document.querySelector('.failSavePopup');
        DOM.ACTIONCENTER.removeChild(failPopup);
        overlay.hide();
      }, 2000);
    }
  }

  function buildConsumerCard() {
    selectedConsumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(selectedConsumer.card);

    return wrap;
  }
  function buildOverviewTable() {
    const tableOptions = {
      plain: false,
      columnHeadings: ['Type', 'Rev #', 'Downloaded', 'PY Start', 'Eff Start', 'Review', 'Sent To DODD'],
      tableId: 'planOverviewTable',
    };

    const tableData = previousPlansData.map(pd => {
      const type = pd.planType === 'A' ? 'Annual' : 'Revision';
      const revisionNum = pd.revisionNumber !== '0' ? pd.revisionNumber : '';
      const downloadedDate = pd.downloadDate ? pd.downloadDate.split(' ')[0] : '';
      const startDate = pd.planYearStart.split(' ')[0];
      const endDate = pd.planYearEnd.split(' ')[0];
      const effectiveStart = pd.effectiveStart.split(' ')[0];
      const effectiveEnd = pd.effectiveEnd.split(' ')[0];
      let isActive = pd.active === 'True' ? true : false;
      const reviewDate = pd.reviewDate ? pd.reviewDate.split(' ')[0] : 'n/a';
      let sentToDODD = pd.dateSentDODD ? pd.dateSentDODD : '';
      sentToDODD = `${pd.userSentDODD} - ${sentToDODD}`;
      if (downloadedDate !== '') {
        downloadPlanBtn.classList.add('disabled');
      }

      return {
        values: [type, revisionNum, downloadedDate, startDate, effectiveStart, reviewDate, sentToDODD],
        attributes: [
          { key: 'data-plan-active', value: isActive },
          { key: 'data-plan-id', value: pd.consumerPlanId },
        ],
        onClick: async () => {
          planId = pd.consumerPlanId;
          planType = pd.planType.toLowerCase();
          planStatus = pd.planStatus ? pd.planStatus : 'D';
          planActiveStatus = isActive;
          revisionNumber = pd.revisionNumber;
          downloadedFromSalesforce = downloadedDate ? true : false;

          planDates.setReviewPlanDates({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            effectiveStart: new Date(effectiveStart),
            effectiveEnd: new Date(effectiveEnd),
            reviewDate: new Date(reviewDate),
          });

          buildPlanPage();
        },
      };
    });

    const oTable = table.build(tableOptions);
    table.populate(oTable, tableData);

    return oTable;
  }
  async function loadLandingPage() {
    DOM.clearActionCenter();

    landingPage = document.createElement('div');
    landingPage.classList.add('planLandingPage');

    const consumerCard = buildConsumerCard();
    newPlanBtn = buildNewPlanBtn();
    assignCaseLoadBtn = buildAssignCaseloadBtn();
    downloadPlanBtn = buildDownloadPlanBtn();

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('topOutcomeWrap');

    btnWrap.appendChild(newPlanBtn);
    if ($.session.planAssignCaseload) btnWrap.appendChild(assignCaseLoadBtn);

    if ($.session.downloadPlans && $.session.areInSalesForce) {
      // validate salesforce
      isValidSalesforce = await consentAndSignAjax.validateConsumerForSalesForceId({
        consumerId: selectedConsumer.id,
      });

      if (isValidSalesforce) {
        btnWrap.appendChild(downloadPlanBtn);
      }
    }

    landingPage.appendChild(consumerCard);
    landingPage.appendChild(btnWrap);
    DOM.ACTIONCENTER.appendChild(landingPage);

    const spinner = PROGRESS.SPINNER.get('Gathering Plans...');
    landingPage.appendChild(spinner);

    previousPlansData = await planAjax.getConsumerPlans({
      token: $.session.Token,
      consumerId: selectedConsumer.id,
    });
    previousPlansData.sort((a, b) => {
      const aDate = a.effectiveStart.split(' ')[0];
      const bDate = b.effectiveStart.split(' ')[0];
      const aDateObj = new Date(aDate);
      const bDateObj = new Date(bDate);

      return bDateObj - aDateObj;
    });

    landingPage.removeChild(spinner);

    overviewTable = buildOverviewTable();
    landingPage.appendChild(overviewTable);
  }

  function init() {
    planAjax.checkForSalesForce();
    setActiveModuleAttribute('plan');
    DOM.clearActionCenter();
    roster2.showMiniRoster();
  }

  return {
    clearAllData,
    clearPlanId,
    dashHandler,
    getCurrentPlanId,
    getSelectedConsumer,
    getCurrentPlanType,
    getPlanStatus,
    getPlanActiveStatus,
    getPlanDropdownData,
    getWorkflowMarkup,
    getHasPreviousPlans,
    setSelectedConsumer,
    setRevisionNumber,
    getISPValidation,
    setPlanType,
    setPlanId,
    setPlanStatus,
    setPlanActiveStatus,
    toggleNewPlanDoneBtn,
    handleActionNavEvent,
    buildPlanPage,
    buildPreviousPlansTable,
    loadLanding: loadLandingPage,
    init,
  };
})();
