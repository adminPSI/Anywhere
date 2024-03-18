const WorkflowViewerComponent = (function () {
  let viewerContainer;
  let formTemplates;

  // NEW
  //-----------------------------------------
  function buildWorkflowComponents(data) {
    workflowsComponent = new WorkflowsComponent(data);
    return workflowsComponent.render();
  }
  async function getWorkflowData(processId, referenceId) {

    const attachmentInputs = document.querySelector('.generalInfo');
    var peopleId = attachmentInputs.dataset.peopleId;

    const {
      getPeopleNamesResult: people,
    } = await WorkflowViewerAjax.getPeopleNamesAsync(peopleId, '0');

    const { getWorkflowsResult: workflows } = await WorkflowViewerAjax.getWorkflowsAsync(
      processId,
      referenceId,
    );

    const {
      getFormTemplatesResult: templates,
    } = await WorkflowViewerAjax.getFormTemplatesAsync();


    workflowData = {
      people: people,
      workflows: workflows,
      templates: templates,
    };
    formTemplates = templates;

    return workflowData;
  }

  // retrieves templates from function buildWorkflowComponents
  getTemplates = () => formTemplates;

  async function loadData(processId, referenceId) {
    try {
      const data = await getWorkflowData(processId, referenceId);
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
      // Removing return. Don't know what this might break.
      // Removing for refresing the workflow tab when adding a new workflow.
      // return;
    }

    container = document.createElement('div');
    container.id = 'workflow-viewer';

    // let closeButton = document.createElement('div');
    // closeButton.classList.add('workflow-viewer-close-btn');
    // closeButton.innerHTML = `${icons['close']}`;
    // container.appendChild(closeButton);

    // closeButton.addEventListener('click', e => {
    //   container.remove();
    // });

    return container;
  }
  async function get(processId, ref_id) {
    if (Object.keys(WorkflowProcess).find(key => WorkflowProcess[key] === processId)) {
      viewerContainer = buildViewer();
      await loadData(processId, ref_id);
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

    // let closeButton = document.createElement('div');
    // closeButton.classList.add('workflow-viewer-close-btn');
    // closeButton.innerHTML = `${icons['close']}`;
    // viewerContainer.appendChild(closeButton);

    // closeButton.addEventListener('click', e => {
    //   viewerContainer.remove();
    // });
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
      const {
        getPeopleNamesResult: people,
      } = await WorkflowViewerAjax.getPeopleNamesAsync(peopleId,'0');
      const {
        getWorkflowsResult: workflows,
      } = await WorkflowViewerAjax.getWorkflowsAsync(processId, referenceId);
      const workflowData = {
        people: people,
        workflows: workflows,
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
