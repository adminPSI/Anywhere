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

    return data.insertUpdateWaitingListValueResult;
  };

  WaitingListData.prototype.updateAssessmentData = async function ({ id, propertyName, value }) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id,
      propertyName,
      value,
      insertOrUpdate: 'U',
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
