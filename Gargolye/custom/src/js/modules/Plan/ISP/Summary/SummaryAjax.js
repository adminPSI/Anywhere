const summaryAjax = (function () {
  async function getAssessmentSummaryQuestions(retrieveData) {
    // string token, long anywAssessmentId
    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }

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
          '/getAssessmentSummaryQuestions/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getAssessmentSummaryQuestionsResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function getAdditionalAssessmentSummaryQuestions(retrieveData) {
    // string token, long anywAssessmentId
    if (retrieveData.anywAssessmentId !== '') {
      retrieveData.anywAssessmentId = parseInt(retrieveData.anywAssessmentId);
    }

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
          '/getAdditionalAssessmentSummaryQuestions/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getAdditionalAssessmentSummaryQuestionsResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function insertAssessmentSummaryAnswers(retrieveData) {
    // string token, long anywAssessmentId, long[] anywQuestionIds, int[] answerRow, string[] answers, string userId
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
          '/insertAssessmentSummaryAnswers/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return Object.values(
        Object.entries(data.insertAssessmentSummaryAnswersResult).reduce((acc, [key, val]) => {
          key = key.split('Id');
          const type = key[0];
          const num = key[1];

          if (!acc[num]) {
            acc[num] = {};
          }

          if (type === 'answer') {
            acc[num].answerId = val;
          } else {
            acc[num].questionId = val;
          }

          return acc;
        }, {}),
      ).reduce((acc, val) => {
        if (!acc[val.questionId]) {
          acc[val.questionId] = val.answerId;
        }
        return acc;
      }, {});
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAssessmentSummaryAnswers(retrieveData) {
    // string token, long anywAssessmentId, long[] anywAnswerIds, string[] answers, string userId

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
          '/updateAssessmentSummaryAnswers/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateAssessmentSummaryAnswersResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAdditionalAssessmentSummaryAnswers(retrieveData) {
    // long anywAssessmentId, string aloneTimeAmount, string providerBackUp

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
          '/updateAdditionalAssessmentSummaryAnswer/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateAdditionalAssessmentSummaryAnswerResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateBestWayToConnect(retrieveData) {
    // string token, long anywAssessmentId, int bestWayId

    if (retrieveData.bestWayId === '%') {
      retrieveData.bestWayId = 0;
    } else {
      retrieveData.bestWayId = parseInt(retrieveData.bestWayId);
    }

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
          '/updateBestWayToConnect/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateBestWayToConnectResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function updatePlaceOnPath(retrieveData) {
    // string token, long anywAssessmentId, int placeId

    if (retrieveData.placeId === '%') {
      retrieveData.placeId = 0;
    } else {
      retrieveData.placeId = parseInt(retrieveData.placeId);
    }

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
          '/updatePlaceOnPath/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updatePlaceOnPathResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateMoreDetail(retrieveData) {
    // string token, long anywAssessmentId, string detail

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
          '/updateMoreDetail/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.updateMoreDetailResult;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getAssessmentSummaryQuestions,
    getAdditionalAssessmentSummaryQuestions,
    updateAssessmentSummaryAnswers,
    updateAdditionalAssessmentSummaryAnswers,
    insertAssessmentSummaryAnswers,
    updateBestWayToConnect,
    updatePlaceOnPath,
    updateMoreDetail,
  };
})();
