const planAjax = (function () {
  // GET
  //------------------------------------
  async function getConsumerPlans(retrieveData) {
    // token, consumerId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerPlans/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getConsumerPlansResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function getConsumerPlanYearInfo(retrieveData) {
    //token, answerObj array
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerPlanYearInfo/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getConsumerPlanYearInfoResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function getPlanDropdownData(retrieveData) {
    // TODO: this function can be removed, it lives in planData now

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getServiceAndSupportsData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return {
        ...data.getServiceAndSupportsDataResult,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function getPlanAndWorkFlowAttachments(retrieveData) {
    //string token, string assessmentId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanAndWorkFlowAttachments/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return {
        ...data.getPlanAndWorkFlowAttachmentsResult,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // INSERT
  //------------------------------------
  async function insertAnnualPlan(retrieveData) {
    // token, consumerId, planYearStart
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertConsumerPlanAnnual/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      const planId = data.insertConsumerPlanAnnualResult;
      plan.setPlanId(planId);
      return planId;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function insertRevisedPlan(retrieveData) {
    // priorConsumerPlanId, effectiveStart, effectiveEnd, useLatestAssessmentVersion
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertConsumerPlanRevision/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      const planId = data.insertConsumerPlanRevisionResult;
      plan.setPlanId(planId);
      return planId;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function insertAutomatedWorkflows(retrieveData) {
    // token, processId, peopleId, referenceId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/insertAutomatedWorkflows/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.insertAutomatedWorkflowsResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function addSelectedAttachmentsToReport(retrieveData) {
    // string token, string[] attachmentIds, string userId, string assessmentID,,
    // string versionID, string extraSpace, bool isp
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/addSelectedAttachmentsToReport/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.addSelectedAttachmentsToReportResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  // UPDATE
  //------------------------------------
  async function updateConsumerPlanReactivate(retrieveData) {
    // token, consumerPlanId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateConsumerPlanReactivate/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.updateConsumerPlanReactivateResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function updateConsumerPlanSetStatus(retrieveData) {
    // token, consumerPlanId, status
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateConsumerPlanSetStatus/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.updateConsumerPlanSetStatusResult;
    } catch (error) {
      console.log(error.responseText);
      return { hasError: true, message: error.statusText };
    }
  }
  async function updateConsumerPlanSetAnnualDates(retrieveData) {
    // token, consumerPlanId, newPlanYearStart
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateConsumerPlanSetAnnualDates/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.updateConsumerPlanSetAnnualDatesResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function updateConsumerPlanSetRevisionEffectiveDates(retrieveData) {
    // token, consumerPlanId, newEffectiveStart, newEffectiveEnd
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateConsumerPlanSetRevisionEffectiveDates/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.updateConsumerPlanSetRevisionEffectiveDatesResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function updateConsumerPlanReviewDate(retrieveData) {
    // token, reviewDate, planId (make a integer)
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updateConsumerPlanReviewDate/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.updateConsumerPlanReviewDateResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function uploadPlanToDODD(retrieveData) {
    // consumerId(peopleId), planId)
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/uploadPlanToDODD/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.uploadPlanToDODDResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function updatePlanType(retrieveData) {
    // token, consumerPlanId, planType
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/switchPlanType/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.switchPlanTypeResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  // DELETE
  //------------------------------------
  async function deletePlan(retrieveData) {
    // token, consumerPlanId
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/deleteConsumerPlan/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      mainAssessment.clearData();
      plan.clearPlanId();
      return data.deleteConsumerPlanResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  // ATTACHMENTS
  // ----------------------------------
  function viewPlanAttachment(attachmentId, section) {
    data = {
      attachmentId: attachmentId,
    };
    var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewPlanAttachment/`;
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
    var attachmentInput = document.createElement('input');
    attachmentInput.setAttribute('name', 'attachmentId');
    attachmentInput.setAttribute('value', attachmentId);
    attachmentInput.id = 'attachmentId';
    var sectionInput = document.createElement('input');
    sectionInput.setAttribute('name', 'section');
    sectionInput.setAttribute('value', section);
    sectionInput.id = 'section';

    form.appendChild(tokenInput);
    form.appendChild(attachmentInput);
    form.appendChild(sectionInput);
    form.style.position = 'absolute';
    form.style.opacity = '0';
    document.body.appendChild(form);

    form.submit();
    form.remove();
  }

  async function addPlanAttachment(retrieveData) {
    // let abString = btoa(String.fromCharCode.apply(null, new Uint8Array(buf)))
    try {
      var binary = '';
      var bytes = new Uint8Array(retrieveData.attachment);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let abString = window.btoa(binary);
      retrieveData.attachment = abString;
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/addPlanAttachment/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.addPlanAttachmentResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  function deletePlanAttachment(planId, attachmentId) {
    data = {
      token: $.session.Token,
      planId: planId, //long
      attachmentId: attachmentId, //long
    };
    $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/deletePlanAttachment/',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.deletePlanAttachmentResult;
      },
      error: function (xhr, status, error) {},
    });
  }
  async function getPlanAttachmentsList(retrieveData) {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getPlanAttachmentsList/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getPlanAttachmentsListResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  // OTHER
  // ----------------------------------
  function getConsumerPeopleId(consumerId, callback) {
    $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getConsumerPeopleId/',
      data: '{"consumerId":"' + consumerId + '"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        var res = response.getConsumerPeopleIdResult;
        return callback(res);
      },
    });
  }
  async function getConsumerPeopleIdAsync(consumerId, callback) {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getConsumerPeopleId/',
        data: JSON.stringify({ consumerId: consumerId }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getConsumerPeopleIdResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  async function updatePlanSectionApplicable(retrieveData) {
    // string token, long planId, long sectionId, string applicable)
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/updatePlanSectionApplicable/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlanSectionApplicableResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }
  function checkForSalesForce() {
    $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/checkForSalesForce/',
      data: '{}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (response, status, xhr) {
        if (response.checkForSalesForceResult === 'true') {
          $.session.areInSalesForce = true;
        } else {
          $.session.areInSalesForce = false;
        }
      },
      error: function (xhr, status, error) {
        //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
      },
    });
  }
  async function runReOrderSQL() {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/runReOrderSQL/',
        data: JSON.stringify({}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.runReOrderSQLResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  return {
    getConsumerPlans,
    getConsumerPlanYearInfo,
    getPlanDropdownData,
    getPlanAndWorkFlowAttachments,
    insertAnnualPlan,
    insertRevisedPlan,
    insertAutomatedWorkflows,
    addSelectedAttachmentsToReport,
    updateConsumerPlanReactivate,
    updateConsumerPlanSetStatus,
    updateConsumerPlanSetAnnualDates,
    updateConsumerPlanSetRevisionEffectiveDates,
    updateConsumerPlanReviewDate,
    updatePlanSectionApplicable,
    updatePlanType,
    deletePlan,
    viewPlanAttachment,
    addPlanAttachment,
    deletePlanAttachment,
    getPlanAttachmentsList,
    uploadPlanToDODD,
    checkForSalesForce,
    getConsumerPeopleId,
    getConsumerPeopleIdAsync,
    runReOrderSQL,
  };
})();
