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
    function getPlanAssessmentReportWithAttachments(retrieveData) {
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
                '/viewISPReportAndAttachments/',
            data: JSON.stringify(retrieveData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
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
      type: 'DELETE',
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
