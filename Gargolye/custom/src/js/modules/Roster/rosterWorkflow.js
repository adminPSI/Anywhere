const rosterWorkflow = (() => {
  let selectedConsumerId;
  let selectedWorkflows = [];

  async function displayWFwithMissingResponsibleParties(workflowIds) {
    if (workflowIds.length == 0) return false;

    let strWorkflowIds = workflowIds.toString();
    const convertedstrWorkFlowIds = strWorkflowIds.replaceAll(',', '|');
    // convertedstrWorkFlowIds += '|';

    async function getWFwithMissingResponsibleParties(constrWorkFlowIds) {
      let responsibleData = await WorkflowViewerAjax.getWFwithMissingResponsibleParties({
        workflowIds: constrWorkFlowIds.toString(),
      });

      return responsibleData;
    }

    let responsibleData = await getWFwithMissingResponsibleParties(convertedstrWorkFlowIds);

    const workflowNames = [];
    if (responsibleData.length > 0) {
      for (let i = 0; i < responsibleData.length; i++) {
        workflowNames.push(responsibleData[i].name);
      }
      var strWorkflowNames = workflowNames.join(', ');
      missingResponsiblePartyAlert(strWorkflowNames);
    }
  }
  function missingResponsiblePartyAlert(workflowNames) {
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
      },
    });

    alertbtnWrap.appendChild(alertokBtn);
    var alertMessage = document.createElement('p');
    alertMessage.innerHTML =
      'There are missing responsible party relationship assignments for the following new workflows: ' + workflowNames;
    alertPopup.appendChild(alertMessage);
    alertPopup.appendChild(alertbtnWrap);
    POPUP.show(alertPopup);
  }

  async function showAddWorkflowPopup() {
    const wfPopup = POPUP.build({
      header: 'Select workflow(s) to attach.',
      id: 'rosterworkflow_addWorkflowPopup',
    });

    // Workflow List
    //-----------------------
    const wfvData = await WorkflowViewerAjax.getManualWorkflowList({
      token: $.session.Token,
      processId: 4,
      referenceId: 0,
    });

    const workflowList = document.createElement('div');
    workflowList.classList.add('workflowList');

    wfvData.forEach(obj => {
      const wfvItem = document.createElement('div');
      wfvItem.classList.add('workflowListItem');
      wfvItem.setAttribute('data-template-id', obj.workflowTemplateId);
      wfvItem.innerHTML = `<h4>${obj.templateName}</h4> <p>${obj.description}</p>`;
      workflowList.appendChild(wfvItem);
    });
    
    workflowList.addEventListener('click', e => {
      if (e.target.classList.contains('workflowListItem')) {
        const templateID = e.target.dataset.templateId;

        if (!e.target.classList.contains('selected')) {
          e.target.classList.add('selected');
          selectedWorkflows.push(templateID);
        } else {
          e.target.classList.remove('selected');
          selectedWorkflows = selectedWorkflows.filter(wf => wf !== templateID);
        }

        selectedWorkflows.length > 0 ? doneBtn.classList.remove('disabled') : doneBtn.classList.add('disabled');
      }
    });

    // Buttons
    //-----------------------
    const doneBtn = button.build({
      text: 'Done',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: async () => {
        const workflowIds = [];

        if (selectedWorkflows && selectedWorkflows.length > 0) {
          try {
            for (i = 0; i < selectedWorkflows.length; i++) {
              let wftemplateId = selectedWorkflows[i];
              let workflowId = await WorkflowViewerAjax.copyWorkflowtemplateToRecord({
                token: $.session.Token,
                templateId: wftemplateId,
                referenceId: 0,
                peopleId: selectedConsumerId,
              });
              workflowIds.push(workflowId);
            }

            const newScreen = await buildWorkflowScreen();
            onResetViewer(newScreen);
          } catch (error) {
            console.error('error inserting workflows');
          }

          await displayWFwithMissingResponsibleParties(workflowIds);
        }
      }
    });
    const cancelBtn = button.build({
      id: 'addWorkflowCancelBtn',
      text: 'CANCEL',
      style: 'secondary',
      type: 'outlined',
      callback: () => POPUP.hide(wfPopup),
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    btnWrap.appendChild(cancelBtn);


    wfPopup.appendChild(workflowList);
    wfPopup.appendChild(btnWrap);

    POPUP.show(wfPopup);
  }
  
  async function buildWorkflowScreen() {
    const workflowViewer = await WorkflowViewerComponent.get(4, 0, selectedConsumerId);

    const addWorkflowBtn = button.build({
      text: 'Add Workflow(s)',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        showAddWorkflowPopup();
      },
    });

    return {workflowViewer, addWorkflowBtn};
  }

  async function getWorkflowScreen() {
    const newScreen = await buildWorkflowScreen();

    return newScreen
  }

  function init(consumerId, onResetViewerFunc) {
    onResetViewer = onResetViewerFunc;
    selectedConsumerId = consumerId;
  }

  return {
    init,
    getWorkflowScreen,
    showAddWorkflowPopup
  }
})();
