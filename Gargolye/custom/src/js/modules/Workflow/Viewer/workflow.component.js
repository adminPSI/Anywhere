class WorkflowComponent {
  constructor(
    { workflowId, name, processName, description, currentStatusId, statuses, groups, addedToPlan },
    people,
    responsiblePeople,
  ) {
    this.workflowId = workflowId;
    this.name = name;
    this.processName = processName;
    this.description = description;
    this.currentStatusId = currentStatusId;
    this.statuses = statuses;
    this.groups = groups;
    this.people = people;
    this.responsiblePeople = responsiblePeople;
    this.addedToPlan = addedToPlan;
  }

  async setStatusAsync(workflowId, statusId) {
    try {
      const result = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/setWorkflowStatus/',
        data: '{"token":"' + $.session.Token + '", "workflowId":"' + workflowId + '", "statusId":"' + statusId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  getFirstAndLastName(peopleId, people) {
    const person = people.find(p => {
      return p.peopleId === peopleId;
    });
    return person ? person.firstName + ' ' + person.lastName : '';
  }

  render() {
    let {
      workflowId,
      name,
      currentStatusId,
      description,
      processName,
      groups,
      statuses,
      people,
      setStatusAsync,
      getFirstAndLastName,
      responsiblePeople,
      addedToPlan
    } = this;

    let workflowContainer = document.createElement('div');
    workflowContainer.classList.add('card', 'workflow');
    workflowContainer.setAttribute('data-id', workflowId);

    let workflowSummaryContainer = document.createElement('div');
    workflowSummaryContainer.classList.add('card__header', 'wf-summary');

    let workflowNameContainer = document.createElement('div');
    workflowNameContainer.classList.add('wf-column', 'workflow-name-container');
    workflowNameContainer.innerHTML = `
        <h3>Workflow</h3>
        <p>${name}</p>
        ${addedToPlan ? `<p>Added to plan on ${addedToPlan.split(' ')[0]}</p>` : ''}
    `;

    workflowNameContainer.addEventListener('click', e => {
      let workflowDescriptionPopop = POPUP.build({
        header: 'Worfklow Description',
        hideX: false,
        id: 'wfDescPopup',
      });

      let workFlowDescription = document.createElement('div');
      workFlowDescription.innerHTML = `${description}`;

      workflowDescriptionPopop.appendChild(workFlowDescription);

      POPUP.show(workflowDescriptionPopop);
    });

    let responsiblePartyContainer = document.createElement('div');
    responsiblePartyContainer.classList.add('wf-column', 'responsible-container');
    responsiblePartyContainer.innerHTML = icons.peopleGroup;

    responsiblePartyContainer.addEventListener('click', e => {
      new EditResponsibleRelationshipsComponent(workflowId, people, async (workflowId, ddlcache) => {
        try {
          for (const ddl in ddlcache) {
            if (ddlcache[ddl].modified != '') {
              let workflowResponsibilityType = ddl.split('_')[1];
              let peopleId = await WorkflowViewerAjax.updateRelationshipResponsiblePartyID(
                ddlcache[ddl].modified,
                workflowId,
                workflowResponsibilityType,
              );
              // update UI step with the returned data
              var workflow = document.querySelectorAll(`[data-id="${workflowId}"]`)[0];
              var workflowSteps = workflow.getElementsByClassName('wf-steps-container');
              for (var i = 0; i < workflowSteps.length; i++) {
                if (
                  workflowSteps[i].getElementsByClassName(`responsiblePartytype_${workflowResponsibilityType}`)[0] !=
                  undefined
                ) {
                  if (workflowSteps[i].getElementsByClassName('wf-step-done-date')[0].innerText == '') {
                    let responsiblestep = workflowSteps[i].getElementsByClassName(
                      `responsiblePartytype_${workflowResponsibilityType}`,
                    )[0];
                    responsiblestep.getElementsByTagName('p')[0].innerText = getFirstAndLastName(
                      ddlcache[ddl].modified,
                      people,
                    );
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error('error: ', err);
        }
      });
    });

    let statusDropdown = dropdown.build({
      label: 'Status',
      dropdownId: 'statusDropdown - ' + workflowId,
    });

    let statusContainer = document.createElement('div');
    statusContainer.classList.add('wf-column', 'status-container');
    statusContainer.setAttribute('data-id', workflowId);
    statusContainer.appendChild(statusDropdown);

    statusDropdown.addEventListener('change', async e => {
      const setStatus = setStatusAsync(workflowId, e.target.value);
      setStatus
        .then(() => {
          currentStatusId = e.target.value;
        })
        .catch(error => {
          // reset drop down to previous value
          e.target.value = currentStatusId;
          statusDropdown.classList.add('error');
          console.error(error);
        });

      let changed = currentStatusId === e.target.value ? false : true;

      let cache = {
        original: currentStatusId,
        modified: e.target.value,
        isChanged: changed,
        eventTypeId: workflowId,
        eventType: 'workflow',
        eventId: 12,
      };
      // get the associated Actions for the Workflow status change event (in cache)
      let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache);
      var wfActionsCompleted = JSON.parse(processEvent.processWorkflowStepEventResult);
      var displaySteps = document.getElementsByClassName('wf-steps-container');
      // update the UI with the returned Action data (wfActionsCompleted) for the Workflow status change Event
      for (var j = 0; j < wfActionsCompleted.length; j++) {
        for (var i = 0; i < displaySteps.length; i++) {
          var wfActionCompleted;
          if (wfActionsCompleted[j].length > 10) {
            wfActionCompleted = JSON.parse(wfActionsCompleted[j]);
            if (displaySteps[i].dataset.id == wfActionCompleted.StepId) {
              if (wfActionCompleted.ActionId == '6') {
                var startDate = UTIL.formatDateFromIso(wfActionCompleted.ActionDate, '/');
                displaySteps[i].getElementsByClassName('wf-step-start-date')[0].innerHTML = startDate;
              } else if (wfActionCompleted.ActionId == '5') {
                var dueDate = UTIL.formatDateFromIso(wfActionCompleted.ActionDate, '/');
                displaySteps[i].getElementsByClassName('wf-step-due-date')[0].innerHTML = dueDate;
              }
            }
          }
        }
      }
    });

    dropdown.populate(
      statusDropdown,
      statuses.map(s => ({ id: s.statusId, value: s.statusId, text: s.description })),
      currentStatusId,
    );

    let workflowProcessContainer = document.createElement('div');
    workflowProcessContainer.classList.add('wf-column', 'process-container');
    workflowProcessContainer.innerHTML = `
            <h3>Process</h3>
            <p>${processName}</p>
        `;

    let workflowDeleteContainer = document.createElement('div');
    workflowDeleteContainer.classList.add('wf-column');
    workflowDeleteContainer.innerHTML = `${icons['delete']}`;

    workflowDeleteContainer.addEventListener('click', e => {
      e.stopPropagation();
      try {
        this.deleteConfirmation(workflowId, workflowContainer);
        return;
      } catch (err) {
        console.error('error: ', err);
      }
    });

    async function appendWorkflowDeleteContainer(workflowName) {
      let result = await WorkflowViewerAjax.isWorkflowAutoCreatedAsync(name);
      if (result.isWorkflowAutoCreatedResult !== '1') {
        workflowSummaryContainer.appendChild(workflowDeleteContainer);
      }
    }

    workflowSummaryContainer.appendChild(workflowNameContainer);
    workflowSummaryContainer.appendChild(responsiblePartyContainer);
    workflowSummaryContainer.appendChild(statusContainer);
    workflowSummaryContainer.appendChild(workflowProcessContainer);
    appendWorkflowDeleteContainer(name);

    let workflowDetailContainer = document.createElement('div');
    workflowDetailContainer.classList.add('card__body', 'wf-details');

    if (groups) {
      groups.map(g => {
        workflowDetailContainer.innertHtml = `${new WorkflowGroupComponent(
          workflowDetailContainer,
          g,
          people,
          responsiblePeople,
        ).render()}`;
      });
    }

    workflowContainer.appendChild(workflowSummaryContainer);
    workflowContainer.appendChild(workflowDetailContainer);

    return workflowContainer;
  }

  deleteConfirmation(workflowId, workflowContainer) {
    var popup = POPUP.build({
      id: 'deleteWarningPopup',
      classNames: 'warning',
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: async function () {
        POPUP.hide(popup);
        let result = await WorkflowViewerAjax.deleteWorkflowAsync(workflowId);
        if (result.deleteWorkflowResult === '1') {
          workflowContainer.remove();
          let workflowsRemaining = document.querySelectorAll('.card.workflow');
          let workflowsContainer = document.getElementById('workflow-viewer');
          if (workflowsRemaining.length == 0)
            workflowsContainer.innerHTML = `There are no workflows attached to this record`;
        }
      },
    });
    var noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      icon: 'close',
      callback: function () {
        POPUP.hide(popup);
      },
    });
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = 'Are you sure you want to delete this workflow?';
    popup.appendChild(warningMessage);
    popup.appendChild(btnWrap);
    POPUP.show(popup);
  }
}
