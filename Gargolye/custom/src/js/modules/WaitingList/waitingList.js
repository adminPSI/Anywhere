const WaitingList = (() => {
  let wlData;
  let moduleWrap = _DOM.createElement('div', { class: 'waitingList' });

  async function init() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    _DOM.ACTIONCENTER.appendChild(moduleWrap);

    wlData = new WaitingListData();

    WaitingListAssessment.init(wlData);
    //WaitingListOverview.init(wlData);
  }

  return {
    init,
    moduleWrap,
  };
})();
