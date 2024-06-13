const rosterWorkflow = (() => {
  let selectedConsumerId;

  //const workflowViewer = await WorkflowViewerComponent.get('4', 'peopleId');

  async function showAddWorkflowPopup() {
    let selectedWorkflowForms = [];

    const wfvData = await getWorkflowList('4', consumerId);

    const workflowList = document.createElement('div');
    workflowList.classList.add('workflowList');

    const doneBtn = button.build({
      text: 'Done',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: async () => {

      }
    });

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
  }

  function init(consumerId) {
    selectedConsumerId = consumerId;
  }

  return {
    init,
    showAddWorkflowPopup
  }
})();
