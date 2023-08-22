const planWorkflow = (() => {

  let selectedWorkflowForms = [];
  function getProcessId(planType) {
    return planType === 'Revision' || planType === 'r'
      ? WorkflowProcess.CONSUMER_PLAN_REVISION
      : WorkflowProcess.CONSUMER_PLAN_ANNUAL;
  }
  async function getWorkflowList(processId, planId) {
    const wfvData = await WorkflowViewerAjax.getManualWorkflowList({
      token: $.session.Token,
      processId,
      planId: planId ? planId : 0,
    });

    workflowListData = wfvData;

    return wfvData;
  }

  // Workflow List
  function buildWorkflowList(wfvData) {
    const workflowList = document.createElement('div');
    workflowList.classList.add('workflowList');

    wfvData.forEach(obj => {
      // description: "A manually inserted workflow"
      // templateName: "A Manual Workflow"
      // workflowProcessId: "2"
      // workflowTemplateId: "3"
      const wfvItem = document.createElement('div');
      wfvItem.classList.add('workflowListItem');
      wfvItem.setAttribute('data-template-id', obj.workflowTemplateId);
      wfvItem.innerHTML = `<h4>${obj.templateName}</h4> <p>${obj.description}</p>`;
      workflowList.appendChild(wfvItem);
    });

    return workflowList;
  }

  // Workflow Form List
  function buildWorkflowFormList(formListData) {
    
    selectedWorkflowForms = [];

    const workflowFormList = document.createElement('div');
    workflowFormList.classList.add('workflowFormList');

    formListData.forEach(obj => {
     
      const formItem = document.createElement('div');
      formItem.classList.add('workflowFormListItem');
      formItem.setAttribute('data-attachment-id', obj.attachmentId);
      formItem.setAttribute('data-workflow-id', obj.workflowId);
      formItem.setAttribute('data-WFTemplate-id', obj.WFTemplateId);
      formItem.setAttribute('data-description', obj.description);
      formItem.innerHTML = `<h4>${obj.wfName}</h4> <p>${obj.description}</p>`;
      workflowFormList.appendChild(formItem);

      formItem.addEventListener('click', e => {
       // if (e.target.classList.contains('workflowFormListItem')) {
          const attachmentID = e.target.dataset.attachmentId;
          const workflowID = e.target.dataset.workflowId;
          const WFTemplateID = e.target.dataset.wftemplateId;
          const description = e.target.dataset.description;
  
          if (!e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            selectedWorkflowForms.push({attachmentId: attachmentID, workflowId: workflowID, WFtemplateId: WFTemplateID, description: description });
          } else {
            e.target.classList.remove('selected');
            selectedWorkflowForms = selectedWorkflowForms.filter(wf => wf !== attachmentID);
          }
        }
      );

    });

    let test = selectedWorkflowForms;
    return workflowFormList;
  }

  function getselectedWorkFlowForms() {
    return selectedWorkflowForms;
  }

  function showWorkflowListPopup(wfvData, callback) {
    let selectedWorkflows = [];

    const wfvPopup = POPUP.build({
      classNames: ['workflowListPopup'],
    });

    const title = document.createElement('h2');
    title.innerHTML = 'Select workflow(s) to attach.';
    wfvPopup.appendChild(title);

    if (wfvData && wfvData.length > 0) {
      const list = buildWorkflowList(wfvData);
      wfvPopup.appendChild(list);
    }

    const doneBtn = button.build({
      id: 'workflowContinueBtn',
      text: 'Continue',
      type: 'contained',
      style: 'secondary',
      // classNames: ['copySelectedBtn', 'disabled'],
      classNames: 'copySelectedBtn',
      callback: () => (callback ? callback(selectedWorkflows) : null),
    });
    wfvPopup.appendChild(doneBtn);

    wfvPopup.addEventListener('click', e => {
      if (e.target.classList.contains('workflowListItem')) {
        const templateID = e.target.dataset.templateId;

        if (!e.target.classList.contains('selected')) {
          e.target.classList.add('selected');
          selectedWorkflows.push(templateID);
        } else {
          e.target.classList.remove('selected');
          selectedWorkflows = selectedWorkflows.filter(wf => wf !== templateID);
        }
      }
    });
    PROGRESS__BTN.SPINNER.hide('annualRevisionDoneBtn');
    POPUP.show(wfvPopup);
  }

  async function addWorkflowPopup() {
    // PROGRESS__BTN.init();
    PROGRESS__BTN.SPINNER.show('workflow_addWorkflowBtn');
    const processId = getProcessId(plan.getCurrentPlanType());
    let selectedWorkflows = [];
    const planId = plan.getCurrentPlanId();

    const popup = POPUP.build({
      header: 'Select workflow(s) to attach.',
      id: 'workflow_addWorkflowPopup'
    })

    const wfvData = await getWorkflowList(processId, planId);
    if (wfvData && wfvData.length > 0) {
      const list = buildWorkflowList(wfvData);
      popup.appendChild(list);

      list.addEventListener('click', e => {
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
            ? doneBtn.classList.remove('disabled')
            : doneBtn.classList.add('disabled');
        }
      })
    }

    const doneBtn = button.build({
      id: 'addWorkflowDoneBtn',
      text: 'DONE',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: async () => {
        // PROGRESS__BTN.init();
        PROGRESS__BTN.SPINNER.show(doneBtn);
        cancelBtn.classList.add('disabled');
        const workflowIds = [];
        const planId = plan.getCurrentPlanId();
        if (selectedWorkflows && selectedWorkflows.length > 0) {
          
          try {
            for (i = 0; i < selectedWorkflows.length; i++) {
              let wftemplateId = selectedWorkflows[i];
              workflowId = await WorkflowViewerAjax.copyWorkflowtemplateToRecord({
                          token: $.session.Token,
                          templateId: wftemplateId,
                          referenceId: planId,
                          peopleId: plan.getSelectedConsumer().id,
                        });
               workflowIds.push(workflowId)

             }

             

            const workflowMarkup = await plan.getWorkflowMarkup();
            const workflowDiv = document.getElementById('planWorkflow');
            workflowDiv.innerHTML = '';
            workflowDiv.appendChild(workflowMarkup);
          } catch (error) {
            console.error('error inserting workflows')
          }
          PROGRESS__BTN.SPINNER.hide(doneBtn);
          POPUP.hide(popup);
          successfulSave.show('Workflows Added');
          setTimeout(() => {
            successfulSave.hide();
          }, 1000);
        }
        // delay 2 seconds
        await new Promise(r => setTimeout(r, 2000));

        await displayWFwithMissingResponsibleParties (workflowIds);
        //overlay.show();//
      }
    });

    const cancelBtn = button.build({
      id: 'addWorkflowCancelBtn',
      text: 'CANCEL',
      style: 'secondary',
      type: 'outlined',
      callback: () => POPUP.hide(popup)
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    btnWrap.appendChild(cancelBtn);

    popup.appendChild(btnWrap);

    PROGRESS__BTN.SPINNER.hide('workflow_addWorkflowBtn');
    document.getElementById('workflow_addWorkflowBtn').innerText = 'Add Workflow(s)';
    POPUP.show(popup);
    
  }

  async function displayWFwithMissingResponsibleParties (workflowIds) {

    if (workflowIds.length == 0 ) return false;

    let strWorkflowIds = workflowIds.toString(); 
     const convertedstrWorkFlowIds = strWorkflowIds.replaceAll(",","|");
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
      
        for(let i = 0; i < responsibleData.length; i++) {
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
      callback: async function() {
        POPUP.hide(alertPopup);
        
      },
    });
    
    alertbtnWrap.appendChild(alertokBtn);
    var alertMessage = document.createElement('p');
    alertMessage.innerHTML = 'There are missing responsible party relationship assignments for the following new workflows: ' + workflowNames;
    alertPopup.appendChild(alertMessage);
    alertPopup.appendChild(alertbtnWrap);
    POPUP.show(alertPopup);
  }

  return {
    getProcessId,
    getWorkflowList,
    buildWorkflowList,
    buildWorkflowFormList,
    showWorkflowListPopup,
    getselectedWorkFlowForms,
    addWorkflowPopup,
    displayWFwithMissingResponsibleParties,
  };
})();
