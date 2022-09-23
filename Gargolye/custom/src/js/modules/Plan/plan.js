const plan = (function () {
  // DOM
  // -----------------
  // plan landing
  let landingPage;
  let overviewTable;
  let newPlanBtn;
  // new plan setup
  let planSetupPage;
  let setupWrap;
  let prevPlanTable;
  let datesBoxDiv;
  let doneBtn;
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
  let sendToDODDScreen;

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
  // prior plan data
  let hasPreviousPlans;
  let priorConsumerPlanId;
  // more popup
  let selectedWorkflows;
  let addWorkflowDoneBtn;

  async function launchWorkflowViewer() {
    let processId =
      planType === 'Revision'
        ? WorkflowProcess.CONSUMER_PLAN_REVISION
        : WorkflowProcess.CONSUMER_PLAN_ANNUAL;
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
        loadLandingPage();
        DOM.toggleNavLayout();
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
  //-- set
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
      } else {
        updateBtn.classList.add('disabled');
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
      var selectedOption = event.target.options[event.target.selectedIndex];
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

        const message =
          success === 1 ? 'Status successfully updated.' : 'Status was not able to be updated.';
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
    let esDate = `${splitFormatedDate[1]}/${splitFormatedDate[2]}/${splitFormatedDate[0].substring(
      2,
    )}`;

    if (planType === 'Annual' || planType === 'a') {
      warningMessage.innerHTML = `
        <p>Are you sure you want to delete the entire Annual plan effective on ${esDate} for ${getConsumerNameFromCard(
        selectedConsumer.card,
      )}?</p>
      `;
    } else {
      warningMessage.innerHTML = `
        <p>Are you sure you want to delete the entire Revision ${revisionNumber} plan effective on ${esDate} for ${getConsumerNameFromCard(
        selectedConsumer.card,
      )}?</p>
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

        const message =
          success === 1 ? 'Plan successfully reactivated.' : 'Unable to reactivate plan.';
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

    return screen;
  }
  function buildReportsAttachmentsScreen() {
    const screen = document.createElement('div');
    screen.id = 'reportsAttachmentScreen';
    screen.classList.add('screen');

    return screen;
  }
  function buildSendToDODDScreen() {
    const screen = document.createElement('div');
    screen.id = 'DODDScreen';
    screen.classList.add('screen');

    const message = document.createElement('p');
    message.classList.add('doddMessage');

    screen.appendChild(message);

    return screen;
  }
  async function runReportScreen(extraSpace) {
    const showAttachments = false;
    if (showAttachments) {
      // build & show spinner
      const spinner = PROGRESS.SPINNER.get('Building Report...');
      reportsScreen.appendChild(spinner);
      // generate report
      const isSuccess = await assessment.generateReport(planId, '1', extraSpace);
      // remove spinner
      reportsScreen.removeChild(spinner);
      // handle success/error
      if (isSuccess !== 'success') {
        morePopup.classList.add('error');
        // build a show error message
        const message = document.createElement('div'); //
        message.classList.add('warningMessage');
        message.innerHTML = `
        <p>There was an error retrieving your report, please contact Primary Solutions.</p>
      `;
        const okBtn = button.build({
          id: 'rptErrOkBtn',
          text: 'OK',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            reportsScreen.removeChild(message);
            reportsScreen.removeChild(okBtn);
            morePopup.classList.remove('error');
            reportsScreen.classList.remove('visible');
            morePopupMenu.classList.add('visible');
          },
        });
        okBtn.classList.add('okBtn');

        reportsScreen.appendChild(message);
        reportsScreen.appendChild(okBtn);
      } else {
        reportsScreen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      }
    } else {
      const attachmentsWrap = document.createElement('div');
      reportsScreen.appendChild(attachmentsWrap);
    }
  }
  async function runDODDScreen() {
    // build & show spinner
    const spinner = PROGRESS.SPINNER.get('Sending Plan to DODD...');
    sendToDODDScreen.appendChild(spinner);
    // send report
    const success = await planAjax.uploadPlanToDODD({
      consumerId: selectedConsumer.id,
      planId,
    });
    // remove spinner
    sendToDODDScreen.removeChild(spinner);
    // display message & btn
    const message = document.querySelector('#DODDScreen p');
    const okBtn = button.build({
      id: 'sendToDODDbtn',
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        message.innerText = '';
        sendToDODDScreen.removeChild(okBtn);
        morePopup.classList.remove('error');
        sendToDODDScreen.classList.remove('visible');
        morePopupMenu.classList.add('visible');
      },
    });
    message.innerText = success;
    sendToDODDScreen.appendChild(okBtn);
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
        planStatus === 'C' && $.session.webPermission === 'Web'
          ? ['sendtoPortalBtn']
          : ['sendtoPortalBtn', 'disabled'],
    });
    const sendToDODDBtn = button.build({
      text: 'Send To DODD',
      style: 'secondary',
      type: 'contained',
      classNames:
        planStatus === 'C' && $.session.sendToDODD
          ? ['sendToDODDBtn']
          : ['sendToDODDBtn', 'disabled'],
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
      classNames:
        planActiveStatus && $.session.planUpdate ? ['statusBtn'] : ['statusBtn', 'disabled'],
    });
    const deleteBtn = button.build({
      text: 'Delete Plan',
      style: 'secondary',
      type: 'contained',
      classNames:
        planStatus === 'D' && planActiveStatus && $.session.planUpdate
          ? ['deleteBtn']
          : ['deleteBtn', 'disabled'],
    });
    const reactivateBtn = button.build({
      text: 'Reactivate Plan',
      style: 'secondary',
      type: 'contained',
      classNames:
        !planActiveStatus && $.session.planUpdate
          ? ['reactivateBtn']
          : ['reactivateBtn', 'disabled'],
    });

    //morepopupmenu.appendChild(addWorkflowBtn);
    morepopupmenu.appendChild(reportBtn);
    morepopupmenu.appendChild(reportBtn2);
    //morepopupmenu.appendChild(reportBtn3);
    morepopupmenu.appendChild(sendtoPortalBtn);
    morepopupmenu.appendChild(sendToDODDBtn);
    morepopupmenu.appendChild(editDatesBtn);
    morepopupmenu.appendChild(statusBtn);
    morepopupmenu.appendChild(deleteBtn);
    morepopupmenu.appendChild(reactivateBtn);

    morepopupmenu.addEventListener('click', async e => {
      e.target.classList.add('disabled');

      let targetScreen;

      switch (e.target) {
        case reportBtn:
        case reportBtn2: {
          targetScreen = 'reportsScreen';
          break;
        }
        case reportBtn3: {
          // Below 'targetScreen' will be for when we need to select attatchments
          targetScreen = 'reportsAttachmentScreen';
          retrieveData = {
            token: $.session.Token,
            assessmentId: '19',
          };
          const planWFAttachList = await planAjax.getPlanAndWorkFlowAttachments(retrieveData);
          break;
        }
        case sendtoPortalBtn: {
          assessment.transeferPlanReportToONET(planId, '1');
          break;
        }
        case sendToDODDBtn: {
          targetScreen = 'DODDScreen';
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
        runDODDScreen();
      }

      if (targetScreen === 'reportsScreen') {
        const extraSpace = e.target === reportBtn ? 'false' : 'true';
        runReportScreen(extraSpace);
      }
    });

    return morepopupmenu;
  }
  async function showMorePopup() {
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
    sendToDODDScreen = buildSendToDODDScreen();

    menuInnerWrap.appendChild(morePopupMenu);
    menuInnerWrap.appendChild(editDatesScreen);
    menuInnerWrap.appendChild(updateStatusScreen);
    menuInnerWrap.appendChild(deleteScreen);
    menuInnerWrap.appendChild(reactivateScreen);
    menuInnerWrap.appendChild(addWorkflowScreen);
    menuInnerWrap.appendChild(reportsScreen);
    menuInnerWrap.appendChild(reportsAttachmentScreen);
    menuInnerWrap.appendChild(sendToDODDScreen);

    morePopup.appendChild(menuInnerWrap);

    POPUP.show(morePopup);
  }
  // plan header
  function refreshGeneralInfo() {
    planHeader.removeChild(planHeaderGeneralInfoBar);

    planHeaderGeneralInfoBar = buildGeneralInfoBar();
    planHeader.insertBefore(planHeaderGeneralInfoBar, planHeaderButtons);
  }
  function getConsumerNameFromCard(consumerCard) {
    const firstName = consumerCard.querySelector('.name_first');
    const lastName = consumerCard.querySelector('.name_last');

    if (!firstName || !lastName) return;

    return `${lastName.innerText} ${firstName.innerText}`;
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
    let esDate = `${splitFormatedDate[1]}/${splitFormatedDate[2]}/${splitFormatedDate[0].substring(
      2,
    )}`;

    const formatedDate2 = UTIL.formatDateFromDateObj(EffectiveEndDate);
    const splitFormatedDate2 = formatedDate2.split('-');
    let edDate = `${splitFormatedDate2[1]}/${
      splitFormatedDate2[2]
    }/${splitFormatedDate2[0].substring(2)}`;

    const formatedDate3 = UTIL.formatDateFromDateObj(PlanStartDate);
    const splitFormatedDate3 = formatedDate3.split('-');
    let starDate = `${splitFormatedDate3[1]}/${
      splitFormatedDate3[2]
    }/${splitFormatedDate3[0].substring(2)}`;

    const formatedDate4 = UTIL.formatDateFromDateObj(PlanEndDate);
    const splitFormatedDate4 = formatedDate4.split('-');
    let endDate = `${splitFormatedDate4[1]}/${
      splitFormatedDate4[2]
    }/${splitFormatedDate4[0].substring(2)}`;

    const generalInfoBar = document.createElement('div');
    generalInfoBar.classList.add('generalInfo');

    const consumerName = `<p>${getConsumerNameFromCard(selectedConsumer.card)}</p>`;
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
    const backBtn = button.build({
      text: 'Back',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        clearAllDataKeepConsumer();

        if ($.loadedAppPage === 'planAssessment') {
          $.loadedAppPage = '';
          assessment.showSaveWarning(loadLandingPage);
        } else {
          loadLandingPage();
        }
      },
    });

    buttonBar.appendChild(moreBtn);
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
            if ($.loadedAppPage === 'planAssessment') {
              assessment.showSaveWarning(async () => {
                $.loadedAppPage = 'planISP';
                await ISP.refreshISP(planId);
                TABS.toggleNavStatus(tabs, 'enable');
                DOM.autosizeTextarea();
              });
            } else {
              $.loadedAppPage = 'planISP';
              await ISP.refreshISP(planId);
              TABS.toggleNavStatus(tabs, 'enable');
              DOM.autosizeTextarea();
            }
          } else if (targetTabIndex === '2') {
            TABS.toggleNavStatus(tabs, 'disable');
            if ($.loadedAppPage === 'planAssessment') {
              assessment.showSaveWarning(async () => {
                $.loadedAppPage = 'planWorkflow';
                const workflowLoadingBar = PROGRESS.SPINNER.get('Loading ISP...');
                workflowWrap.innerHTML = '';
                workflowWrap.appendChild(workflowLoadingBar);
                const newWorkflowMarkup = await getWorkflowMarkup();
                workflowWrap.innerHTML = '';
                workflowWrap.appendChild(newWorkflowMarkup);
                TABS.toggleNavStatus(tabs, 'enable');
              });
            } else {
              $.loadedAppPage = 'planWorkflow';
              const workflowLoadingBar = PROGRESS.SPINNER.get('Loading Workflow...');
              workflowWrap.innerHTML = '';
              workflowWrap.appendChild(workflowLoadingBar);
              const newWorkflowMarkup = await getWorkflowMarkup();
              workflowWrap.innerHTML = '';
              workflowWrap.appendChild(newWorkflowMarkup);
              TABS.toggleNavStatus(tabs, 'enable');
            }
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
      datesBoxDiv = planDates.buildDatesBox();
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
    PROGRESS__BTN.SPINNER.show('annualRevisionDoneBtn', '', true);
    const processId = planWorkflow.getProcessId(planType);
    const wfvData = await planWorkflow.getWorkflowList(processId, 0);

    if (!wfvData || wfvData.length === 0) {
      createNewPlan(selectedConsumer, processId);
      return;
    }

    const workflowCallback = selectedWorkflows => {
      PROGRESS__BTN.SPINNER.show('workflowContinueBtn', '', false);
      createNewPlan(selectedConsumer, processId, selectedWorkflows);
    };
    planWorkflow.showWorkflowListPopup(wfvData, workflowCallback);
  }
  async function createNewPlan(selectedConsumer, processId, selectedWorkflows) {
    const EffectiveEndDate = planDates.getEffectiveEndDate();
    let edDate = UTIL.formatDateFromDateObj(EffectiveEndDate);

    let currentPlanId;
    let workflowId;
    const workflowIds = [];

    if (planType === 'a') {
      const planYearStartDate = planDates.getPlanYearStartDate();
      const planYearReviewDate = planDates.getPlanReviewDate();

      currentPlanId = await planAjax.insertAnnualPlan({
        token: $.session.Token,
        consumerId: selectedConsumer.id,
        planYearStart: UTIL.formatDateFromDateObj(planYearStartDate),
        reviewDate: UTIL.formatDateFromDateObj(planYearReviewDate),
      });
    } else {
      const EffectiveStartDate = planDates.getEffectiveStartDate();
      const esDate = UTIL.formatDateFromDateObj(EffectiveStartDate);
      const planYearReviewDate = planDates.getPlanReviewDate();

      currentPlanId = await planAjax.insertRevisedPlan({
        token: $.session.Token,
        priorConsumerPlanId,
        effectiveStart: esDate,
        effectiveEnd: edDate,
        reviewDate: UTIL.formatDateFromDateObj(planYearReviewDate),
        useLatestPlanVersion: true,
      });
    }

    if (selectedWorkflows && selectedWorkflows.length > 0) {
      for (i = 0; i < selectedWorkflows.length; i++) {
        let wftemplateId = selectedWorkflows[i];
        workflowId = await WorkflowViewerAjax.copyWorkflowtemplateToRecord({
          token: $.session.Token,
          templateId: wftemplateId,
          referenceId: currentPlanId,
          peopleId: selectedConsumer.id,
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

    planWorkflow.displayWFwithMissingResponsibleParties(workflowIds);

    buildPlanPage();
  }

  function buildPreviousPlansTable() {
    const tableOptions = {
      plain: true,
      columnHeadings: ['Type', 'Rev #', 'PY Start', 'Eff Start', 'Review'],
      tableId: 'previousPlanTable',
      headline: 'Select a plan below for revision',
    };

    const tableData = previousPlansData
      .filter(plan => {
        return plan.active === 'True';
      })
      .map(plan => {
        const type = plan.planType === 'A' ? 'Ann' : 'Rev';
        const revisionNum = plan.revisionNumber !== '0' ? plan.revisionNumber : '';
        const start = plan.planYearStart.split(' ')[0];
        const effectiveStart = plan.effectiveStart.split(' ')[0];
        const reviewDate = plan.reviewDate ? plan.reviewDate.split(' ')[0] : 'n/a';

        return {
          values: [type, revisionNum, start, effectiveStart, reviewDate],
          attributes: [{ key: 'data-plan-id', value: plan.consumerPlanId }],
          onClick: e => {
            const row = e.target;
            const previouslySeletedRow = prevPlanTable.querySelector('.selected');
            if (previouslySeletedRow) previouslySeletedRow.classList.remove('selected');

            row.classList.add('selected');

            priorConsumerPlanId = plan.consumerPlanId;

            planDates.setRevisionPlanDates(plan);

            if (setupWrap.contains(datesBoxDiv)) setupWrap.removeChild(datesBoxDiv);
            datesBoxDiv = planDates.buildDatesBox(isValid => {
              if (isValid) doneBtn.classList.remove('disabled');
            });
            setupWrap.insertBefore(datesBoxDiv, prevPlanTable);
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
      datesBoxDiv = planDates.buildDatesBox();
      setupWrap.appendChild(datesBoxDiv);
    }

    setupWrap.appendChild(doneBtn);

    return setupWrap;
  }

  // Plan Landing Page
  //---------------------------------------------
  function showInvalidSalesForceWarningPop() {
    const warningPopup = POPUP.build({
      id: 'importRelationshipPopup',
      // closeCallback: () => {
      //   POPUP.hide(warningPopup);
      // },
    });

    const message = document.createElement('p');
    message.innerText = `This consumer does not have a Resident Number in Gatekeeper. Please insert Resident Number in Gatekeeper before inserting a Plan.`;

    warningPopup.appendChild(message);

    POPUP.show(warningPopup);
  }
  function buildNewPlanBtn() {
    return button.build({
      text: 'Add New Plan',
      style: 'secondary',
      type: 'contained',
      classNames: !$.session.planUpdate ? ['disabled'] : ['newPlanBtn'],
      callback: async () => {
        if (newPlanBtn.innerText === 'ADD NEW PLAN') {
          // PROGRESS__BTN.init();
          PROGRESS__BTN.SPINNER.show(newPlanBtn);

          if ($.session.areInSalesForce) {
            // validate salesforce
            isValidSalesforce = await consentAndSignAjax.validateConsumerForSalesForceId({
              consumerId: selectedConsumer.id,
            });
            if (!isValidSalesforce) {
              PROGRESS__BTN.SPINNER.hide(newPlanBtn);
              showInvalidSalesForceWarningPop();
              return;
            }
          }

          planSetupPage = await buildNewPlanSetupPage(selectedConsumer);

          landingPage.removeChild(overviewTable);
          landingPage.appendChild(planSetupPage);

          PROGRESS__BTN.SPINNER.hide(newPlanBtn);
          newPlanBtn.innerText = 'Back';
        } else {
          landingPage.removeChild(planSetupPage);
          landingPage.appendChild(overviewTable);

          newPlanBtn.innerText = 'Add New Plan';
        }
      },
    });
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
      columnHeadings: ['Type', 'Rev #', 'PY Start', 'Eff Start', 'Review'],
      tableId: 'planOverviewTable',
    };

    const tableData = previousPlansData.map(pd => {
      const type = pd.planType === 'A' ? 'Annual' : 'Revision';
      const revisionNum = pd.revisionNumber !== '0' ? pd.revisionNumber : '';
      const startDate = pd.planYearStart.split(' ')[0];
      const endDate = pd.planYearEnd.split(' ')[0];
      const effectiveStart = pd.effectiveStart.split(' ')[0];
      const effectiveEnd = pd.effectiveEnd.split(' ')[0];
      const isActive = pd.active === 'True' ? true : false;
      const reviewDate = pd.reviewDate ? pd.reviewDate.split(' ')[0] : 'n/a';

      return {
        values: [type, revisionNum, startDate, effectiveStart, reviewDate],
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

    landingPage.appendChild(consumerCard);
    landingPage.appendChild(newPlanBtn);
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
    setPlanType,
    setPlanId,
    setPlanStatus,
    toggleNewPlanDoneBtn,
    handleActionNavEvent,
    loadLanding: loadLandingPage,
    init,
  };
})();
