const WaitingList = (() => {
  let wlData;

  async function init() {
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    wlData = new WaitingListData();

    WaitingListAssessment.init(wlData);
    //WaitingListOverview.init(wlData);
  }

  return {
    init,
  };
})();
