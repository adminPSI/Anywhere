const WaitingList = (() => {
  let wlData;
  let moduleWrap;

  async function init() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    moduleWrap = _DOM.createElement('div', { class: 'waitingList' });
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
