const WorkflowViewerComponent = (function () {
  let viewerContainer;
  let formTemplates;
  let peopleId;

  // NEW
  //-----------------------------------------
  function buildWorkflowComponents(data) {
    workflowsComponent = new WorkflowsComponent(data);
    return workflowsComponent.render();
  }
  async function getWorkflowData(processId, referenceId) {
    const attachmentInputs = document.querySelector('.generalInfo');
    peopleId = attachmentInputs.dataset.peopleId;
    

    const { getPeopleNamesResult: people } = await WorkflowViewerAjax.getPeopleNamesAsync(peopleId, '0');

    const { getPeopleNamesResult: responsiblePeople } = await WorkflowViewerAjax.getPeopleNamesAsync(peopleId, '-1');

    const { getWorkflowsResult: workflows } = await WorkflowViewerAjax.getWorkflowsAsync(processId, referenceId);

    const { getFormTemplatesResult: templates } = await WorkflowViewerAjax.getFormTemplatesAsync();

    workflowData = {
      people: people,
      workflows: workflows,
      templates: templates,
      responsiblePeople: responsiblePeople,
    };
    formTemplates = templates;

    return workflowData;
  }
  async function getWorkflowDataForRoster(processId, referenceId) {
    const { getPeopleNamesResult: people } = await WorkflowViewerAjax.getPeopleNamesAsync(referenceId, '0');

    const { getPeopleNamesResult: responsiblePeople } = await WorkflowViewerAjax.getPeopleNamesAsync(referenceId, '-1');

    const { getWorkflowsResult: workflows } = await WorkflowViewerAjax.getWorkflowsAsync(processId, referenceId);

    const { getFormTemplatesResult: templates } = await WorkflowViewerAjax.getFormTemplatesAsync();

    workflowData = {
      people: people,
      workflows: workflows,
      templates: templates,
      responsiblePeople: responsiblePeople,
    };
    formTemplates = templates;

    return workflowData;
  }

  // retrieves templates from function buildWorkflowComponents
  getTemplates = () => formTemplates;

  async function loadData(processId, referenceId, fromRoster) {
    try {
      const data = fromRoster ? await getWorkflowDataForRoster(processId, referenceId) : await getWorkflowData(processId, referenceId);
      const viewerContent = buildWorkflowComponents(data);
      viewerContainer.appendChild(viewerContent);
    } catch (error) {
      console.error(error);
      viewerContainer.innerHTML = error;
    }
  }
  function buildViewer() {
    let container = document.getElementById('workflow-viewer');

    if (container) {
      container.remove();
    }

    container = document.createElement('div');
    container.id = 'workflow-viewer';

    return container;
  }
  async function get(processId, ref_id, fromRoster) {
    if (Object.keys(WorkflowProcess).find(key => WorkflowProcess[key] === processId)) {
      viewerContainer = buildViewer();
      await loadData(processId, ref_id, fromRoster);
      return viewerContainer;
    } else {
      console.error('Invalid processId');
    }
  }

  // OLD
  //-----------------------------------------
  function open(processId, ref_id) {
    if (Object.keys(WorkflowProcess).find(key => WorkflowProcess[key] === processId)) {
      initializeViewer2();
      loadData2(processId, ref_id);
    } else {
      console.error('Invalid processId');
    }
  }

  function initializeViewer2() {
    // Destroy the workflow viewer component if it exists
    if (viewerContainer) {
      viewerContainer.remove();
    }
    viewerContainer = document.createElement('div');
    viewerContainer.id = 'workflow-viewer';
  }

  async function loadData2(processId, referenceId) {
    try {
      const data = await getWorkflowData2(processId, referenceId);
      let viewerContent = undefined;
      viewerContent = buildWorkflowComponents2(data);
      viewerContainer.appendChild(viewerContent);
    } catch (error) {
      console.error(error);
      viewerContainer.innerHTML = error;
    }
    // render the viewer at the top of the page
    const actionCenter = DOM.ACTIONCENTER;
    const child = actionCenter.firstChild;
    actionCenter.insertBefore(viewerContainer, child);
  }

  function buildWorkflowComponents2(data) {
    workflowsComponent = new WorkflowsComponent(data);
    return workflowsComponent.render();
  }

  async function getWorkflowData2(processId, referenceId) {
    try {
      const attachmentInputs = document.querySelector('.generalInfo');
      var peopleId = attachmentInputs.dataset.peopleId;
      const { getPeopleNamesResult: people } = await WorkflowViewerAjax.getPeopleNamesAsync(peopleId, '0');
      const { getPeopleNamesResult: responsiblePeople } = await WorkflowViewerAjax.getPeopleNamesAsync(peopleId, '-1');
      const { getWorkflowsResult: workflows } = await WorkflowViewerAjax.getWorkflowsAsync(processId, referenceId);
      const workflowData = {
        people: people,
        workflows: workflows,
        responsiblePeople: responsiblePeople,
      };
      return workflowData;
    } catch (error) {
      throw error;
    }
  }

  return {
    get,
    open,
    getTemplates,
  };
})();
