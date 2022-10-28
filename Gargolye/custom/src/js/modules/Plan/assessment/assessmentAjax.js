const assessmentAjax = (function () {
  function getConsumerAssessment(retrieveData) {
    //token, consumerId
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getConsumerAssessment/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }
  function getPlanAssessmentReport(retrieveData) {
    //token, userId, assessmentID, versionID, extraSpace, isp(boolean)
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getPlanAssessmentReport/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
    }
    //function getPlanAssessmentReportWithAttachments(retrieveData) {
    //    //token, userId, assessmentID, versionID, extraSpace, isp(boolean)
    //    return $.ajax({
    //        type: 'POST',
    //        url:
    //            $.webServer.protocol +
    //            '://' +
    //            $.webServer.address +
    //            ':' +
    //            $.webServer.port +
    //            '/' +
    //            $.webServer.serviceName +
    //            '/addSelectedAttachmentsToReport/',
    //        data: JSON.stringify(retrieveData),
    //        contentType: 'application/json; charset=utf-8',
    //        dataType: 'json',
    //    });
    //}
    function getPlanAssessmentReportWithAttachments(retrieveData) {
        var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/addSelectedAttachmentsToReport/`;
        var successFunction = function (resp) {
            var res = JSON.stringify(response);
        };

        var form = document.createElement('form');
        form.setAttribute('action', action);
        form.setAttribute('method', 'POST');
        form.setAttribute('target', '_blank');
        form.setAttribute('enctype', 'bare');
        form.setAttribute('success', successFunction);//
        var tokenInput = document.createElement('input');
        tokenInput.setAttribute('name', 'token');
        tokenInput.setAttribute('value', $.session.Token);
        tokenInput.id = 'token';
        var userIdInput = document.createElement('input');
        userIdInput.setAttribute('name', 'userId');
        userIdInput.setAttribute('value', retrieveData.userId);
        userIdInput.id = 'userId';
        var assessmentIDInput = document.createElement('input');
        assessmentIDInput.setAttribute('name', 'assessmentID');
        assessmentIDInput.setAttribute('value', retrieveData.assessmentID);
        assessmentIDInput.id = 'assessmentID';
        var versionIDInput = document.createElement('input');
        versionIDInput.setAttribute('name', 'versionID');
        versionIDInput.setAttribute('value', retrieveData.versionID);
        versionIDInput.id = 'versionID';
        var extraSpaceInput = document.createElement('input');
        extraSpaceInput.setAttribute('name', 'extraSpace');
        extraSpaceInput.setAttribute('value', retrieveData.extraSpace);
        extraSpaceInput.id = 'extraSpace';
        var ispInput = document.createElement('input');
        ispInput.setAttribute('name', 'isp');
        ispInput.setAttribute('value', retrieveData.isp);
        ispInput.id = 'isp';
        var attachmentIdsInput = document.createElement('input');
        attachmentIdsInput.setAttribute('name', 'attachmentIds');
        attachmentIdsInput.setAttribute('value', retrieveData.attachmentIds);
        attachmentIdsInput.id = 'attachmentIds';

        form.appendChild(tokenInput);
        form.appendChild(userIdInput);
        form.appendChild(assessmentIDInput);
        form.appendChild(versionIDInput);
        form.appendChild(extraSpaceInput);
        form.appendChild(ispInput);
        form.appendChild(attachmentIdsInput);
        
        form.style.position = 'absolute';
        form.style.opacity = '0';
        document.body.appendChild(form);

        form.submit();
    }
  function getConsumerRelationships(retrieveData) {
    //token, consumerId, effectiveStartDate, effectiveEndDate
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getConsumerRelationships/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }
  function getConsumerNameInfo(retrieveData) {
    //token, consumerId
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/getConsumerNameInfo/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  function updateConsumerAssessmentAnswers(retrieveData, callback) {
    //token, answerObj array
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/updateAssessmentAnswers/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  function insertAssessmentGridRowAnswers(retrieveData) {
    // token, consumerPlanId, assessmentQuestionSetId
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/insertAssessmentGridRowAnswers/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  function deleteAssessmentGridRowAnswers(retrieveData) {
    // token, consumerPlanId, assessmentQuestionSetId, rowsToDelete[]
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/deleteAssessmentGridRowAnswers/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  // TODO: Delete below function
  function getServiceAndSupportsData(retrieveData) {
    return $.ajax({
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
  }

  function insertPlanReportToBeTranferredToONET(retrieveData) {
    //token, reort, planId
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/insertPlanReportToBeTranferredToONET/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  function transferPlanReportToONET(retrieveData) {
    //token, planId
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/transferPlanReportToONET/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  function updateAssessmentAnswerRowOrder(retrieveData) {
    // string token, string answerIds, long assessmentId, long questionSetId, int newPos, int oldPos
    // Pipe delimit the answerIds with no spaces
    return $.ajax({
      type: 'POST',
      url:
        $.webServer.protocol +
        '://' +
        $.webServer.address +
        ':' +
        $.webServer.port +
        '/' +
        $.webServer.serviceName +
        '/updateAssessmentAnswerRowOrder/',
      data: JSON.stringify(retrieveData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    });
  }

  return {
    getConsumerAssessment,
    getPlanAssessmentReport,
    getConsumerRelationships,
    getConsumerNameInfo,
    updateConsumerAssessmentAnswers,
    insertAssessmentGridRowAnswers,
    deleteAssessmentGridRowAnswers,
    getServiceAndSupportsData,
    insertPlanReportToBeTranferredToONET,
    transferPlanReportToONET,
      updateAssessmentAnswerRowOrder,
      getPlanAssessmentReportWithAttachments,
  };
})();
