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
    this.reviewData = null;
  }

  // FETCH DATA
  //---------------------------------------
  WaitingListData.prototype.fetchReviewDataByConsumer = async function (consumerId) {
    const data = await _UTIL.fetchData('getLandingPageForConsumer', {
      consumerId,
    });
    this.reviewData = data.getLandingPageForConsumerResult;

    return this;
  };

  // DATA GETTERS
  //---------------------------------------
  WaitingListData.prototype.getReviewDataByConsumer = async function () {
    // this.reviewData = [{ wlInfoId, interviewDate, conclusionResult, conclusionDate, sentToDODD }]
    // TODO-ASH: replace conclusionResult id with name, get from dropdown data
    return this.reviewData.map(rd => {
      return {
        ...rd,
      };
    });
  };

  return WaitingListData;
});
