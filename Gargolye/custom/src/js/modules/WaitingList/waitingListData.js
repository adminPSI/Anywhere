(function (global, factory) {
  global.WaitingListData = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Constructor function
   *
   * @constructor
   * @returns {WaitingListData}
   */
  function WaitingListData() {
    this.linkId = 0;
  }

  WaitingListData.prototype.insertWaitingListAssessment = async function (consumerId) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id: 0,
      linkId: 0,
      propertyName: 'consumerId',
      value: consumerId,
      insertOrUpdate: 'I',
    });

    return JSON.parse(data.insertUpdateWaitingListValueResult);
  };

  WaitingListData.prototype.insertAssessmentData = async function ({ id, linkId, propertyName, value }) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id,
      linkId,
      propertyName,
      value,
      insertOrUpdate: 'I',
    });

    return data.insertUpdateWaitingListValueResult;
  };

  WaitingListData.prototype.updateAssessmentData = async function ({ id, linkId = 0, propertyName, value }) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id,
      linkId,
      propertyName,
      value,
      insertOrUpdate: 'U',
    });

    return data.insertUpdateWaitingListValueResult;
  };

  WaitingListData.prototype.getReviewDataByConsumer = async function (consumerId) {
    const data = await _UTIL.fetchData('getLandingPageForConsumer', {
      consumerId,
    });

    // string wlInfoId
    // string interviewDate
    // string conclusionResult
    // string conclusionDate
    // string sentToDODD

    // TODO-ASH: replace conclusionResult id with name, get from dropdown data
    return data.getLandingPageForConsumerResult.map(
      ({ wlInfoId, interviewDate, conclusionResult, conclusionDate, sentToDODD }) => {
        return {
          id: wlInfoId,
          values: [
            UTIL.formatDateToIso(interviewDate.split(' ')[0]),
            conclusionResult,
            conclusionDate,
            UTIL.formatDateToIso(sentToDODD.split(' ')[0]),
          ],
        };
      },
    );
  };

  return WaitingListData;
});
