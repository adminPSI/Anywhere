const WorkflowViewerAjax = (() => {
  async function deleteDocumentAsync(documentId) {
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
          '/deleteWorkflowStepDocument/',
        data: '{"token":"' + $.session.Token + '", "documentId":"' + documentId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function deleteWorkflowAsync(workflowId) {
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
          '/deleteWorkflow/',
        data: '{"token":"' + $.session.Token + '", "workflowId":"' + workflowId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function deleteStepAsync(stepId) {
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
          '/deleteWorkflowStep/',
        data: '{"token":"' + $.session.Token + '", "stepId":"' + stepId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function downloadAttachment(attachmentid, filename) {
    try {
      var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/getAttachmentWF/`;
      var successFunction = function (resp) {
        var res = JSON.stringify(response);
      };
      var form = document.createElement('form');
      form.setAttribute('action', action);
      form.setAttribute('method', 'POST');
      form.setAttribute('target', '_blank');
      form.setAttribute('enctype', 'application/json');
      form.setAttribute('success', successFunction);
      var tokenInput = document.createElement('input');
      tokenInput.setAttribute('name', 'token');
      tokenInput.setAttribute('value', $.session.Token);
      tokenInput.id = 'token';
      var attachmentId = document.createElement('input');
      attachmentId.setAttribute('name', 'attachmentId');
      attachmentId.setAttribute('value', attachmentid);
      attachmentId.id = 'attachmentId';
      var attachmentFileName = document.createElement('input');
      attachmentFileName.setAttribute('name', 'attachmentId');
      attachmentFileName.setAttribute('value', filename);
      attachmentFileName.id = 'attachmentId';
      form.appendChild(tokenInput);
      form.appendChild(attachmentId);
      form.appendChild(attachmentFileName);
      form.style.position = 'absolute';
      form.style.opacity = '0';
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getPeopleNamesAsync(peopleId, TypeId) {
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
          '/getPeopleNames/',
        data: JSON.stringify({
          token: $.session.Token,
          peopleId: peopleId,
          TypeId: TypeId,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getFormTemplatesAsync() {
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
          '/getFormTemplates/',
        data: '{"token":"' + $.session.Token + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getPlanWorkflowWidgetData(peopleId) {
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
          '/getPlanWorkflowWidgetData/',
        data: JSON.stringify({
          token: $.session.Token,
            responsiblePartyId: peopleId,
            isCaseLoad: $.session.PlanCaseLoad
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getWorkflowsAsync(processId, referenceId) {
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
          '/getWorkflows/',
        data:
          '{"token":"' + $.session.Token + '", "processId":"' + processId + '", "referenceId":"' + referenceId + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function isWorkflowAutoCreatedAsync(workflowName) {
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
          '/isWorkflowAutoCreated/',
        data: '{"token":"' + $.session.Token + '", "workflowName":"' + workflowName + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function insertStepAsync(step) {
    try {
      const { people, events, ...stepData } = step;
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
          '/insertWorkflowStep/',
        data: JSON.stringify({
          token: $.session.Token,
          step: stepData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function insertStepDocumentAsync(stepId, docOrder, description, attachmentType, attachment, documentEdited) {
    try {
      var binary = '';
      var bytes = new Uint8Array(attachment);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let abString = window.btoa(binary);
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
          '/insertWorkflowStepDocument/',
        data: JSON.stringify({
          token: $.session.Token,
          stepId,
          docOrder,
          description,
          attachmentType,
          attachment: abString,
          documentEdited,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function updateStepDocumentAsync(documentId, attachmentType, attachment, documentEdited) {
    try {
      var binary = '';
      var bytes = new Uint8Array(attachment);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let abString = window.btoa(binary);
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
          '/updateWorkflowStepDocument/',
        data: JSON.stringify({
          token: $.session.Token,
          documentId,
          attachmentType,
          attachment: abString,
          documentEdited,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function setStepDoneDateAsync(stepId, doneDate) {
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
          '/setWorkflowStepDoneDate/',
        data: JSON.stringify({
          token: $.session.Token,
          stepId: stepId,
          doneDate: doneDate,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function setStepDueDateAsync(stepId, dueDate) {
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
          '/setWorkflowStepDueDate/',
        data: JSON.stringify({
          token: $.session.Token,
          stepId: stepId,
          dueDate: dueDate,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function setDocumentOrderAsync(documentOrderArray) {
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
          '/setWorkflowStepDocumentOrder/',
        data: JSON.stringify({
          token: $.session.Token,
          orderArray: documentOrderArray,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function setStepOrderAsync(stepOrderArray) {
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
          '/setWorkflowStepOrder/',
        data: JSON.stringify({
          token: $.session.Token,
          orderArray: stepOrderArray,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function updateStepAsync(step) {
    try {
      const { people, events, ...stepData } = step;
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
          '/updateWorkflowStep/',
        data: JSON.stringify({
          token: $.session.Token,
          step: stepData,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function processStepEventsAsync(events) {
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
          '/processWorkflowStepEvent/',
        data: JSON.stringify({
          token: $.session.Token,
          thisEvent: events,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getManualWorkflowList(retrieveData) {
    try {
      // token
      // processId = 2 for annual and 3 for revision
      // planId = aka referenceId
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
          '/getManualWorkflowList/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getManualWorkflowListResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getWorkFlowFormsfromPreviousPlan(retrieveData) {
    try {
      //token, processId
      //processId = 2 for annual and 3 for revision
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
          '/getWorkFlowFormsfromPreviousPlan/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getWorkFlowFormsfromPreviousPlanResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function copyWorkflowtemplateToRecord(retrieveData) {
    try {
      //token, templateId, peopleId, referenceId, wantedFormIds
      //referenceId is isp_consumer_plan_id,
      //priorReferenceId
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
          '/copyWorkflowtemplateToRecord/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      const workflowId = result.copyWorkflowtemplateToRecordResult;
      return workflowId;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getWFwithMissingResponsibleParties(retrieveData) {
    try {
      //token, processId
      //processId = 2 for annual and 3 for revision
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
          '/getWFwithMissingResponsibleParties/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getWFwithMissingResponsiblePartiesResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getResponsiblePartyIdforThisEditStep(retrieveData) {
    try {
      //token, processId
      //processId = 2 for annual and 3 for revision
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
          '/getResponsiblePartyIdforThisEditStep/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getResponsiblePartyIdforThisEditStepResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getWFResponsibleParties(retrieveData) {
    try {
      //token, processId
      //processId = 2 for annual and 3 for revision
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
          '/getWFResponsibleParties/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getWFResponsiblePartiesResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function updateRelationshipResponsiblePartyID(peopleId, WFID, responsiblePartyType) {
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
          '/updateRelationshipResponsiblePartyID/',
        data: JSON.stringify({
          token: $.session.Token,
          peopleId: peopleId,
          WFID: WFID,
          responsiblePartyType: responsiblePartyType,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  async function getResponsiblePartyClassification() {
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
          '/getResponsiblePartyClassification/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return result.getResponsiblePartyClassificationResult;
    } catch (error) {
      throw new Error(error.responseText);
    }
  }

  return {
    deleteDocumentAsync,
    deleteWorkflowAsync,
    deleteStepAsync,
    downloadAttachment,
    getPeopleNamesAsync,
    getFormTemplatesAsync,
    getPlanWorkflowWidgetData,
    getWorkflowsAsync,
    isWorkflowAutoCreatedAsync,
    insertStepAsync,
    insertStepDocumentAsync,
    updateStepDocumentAsync,
    setStepDoneDateAsync,
    setStepDueDateAsync,
    setDocumentOrderAsync,
    setStepOrderAsync,
    updateStepAsync,
    processStepEventsAsync,
    getManualWorkflowList,
    getWorkFlowFormsfromPreviousPlan,
    copyWorkflowtemplateToRecord,
    getWFResponsibleParties,
    updateRelationshipResponsiblePartyID,
    getWFwithMissingResponsibleParties,
    getResponsiblePartyIdforThisEditStep,
    getResponsiblePartyClassification,
  };
})();
