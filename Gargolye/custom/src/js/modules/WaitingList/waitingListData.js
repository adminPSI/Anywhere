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
  function WaitingListData() {}

  WaitingListData.prototype.insertNewAssessmentInitial = async function (consumerId) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id: 0,
      propertyName: 'consumerId',
      value: consumerId,
      insertOrUpdate: 'I',
    });

    return data.insertUpdateWaitingListValueResult;
  };

  WaitingListData.prototype.insertUpdateAssessmentData = async function ({ id, propertyName, value, insertOrUpdate }) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id,
      propertyName,
      value,
      insertOrUpdate,
    });

    return data.getLandingPageForConsumerResult;
  };

  WaitingListData.prototype.getReviewDataByConsumer = async function (consumerId) {
    const data = await _UTIL.fetchData('getLandingPageForConsumer', {
      consumerId,
    });

    // this.reviewData =
    // string wlInfoId
    // string interviewDate
    // string conclusionResult
    // string conclusionDate
    // string sentToDODD

    // TODO-ASH: replace conclusionResult id with name, get from dropdown data
    return data.getLandingPageForConsumerResult.map(rd => {
      return {
        ...rd,
      };
    });
  };

  return WaitingListData;
});
