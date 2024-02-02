const WaitingList = (() => {
  function loadPageSkeleton() {
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    moduleWrap = _DOM.createElement('div', { class: 'waitingList' });
    moduleHeader = _DOM.createElement('div', { class: 'waitingList__header' });
    moduleBody = _DOM.createElement('div', { class: 'waitingList__body' });
    moduleWrap.appendChild(moduleHeader);
    moduleWrap.appendChild(moduleBody);

    _DOM.ACTIONCENTER.appendChild(moduleWrap);
  }

  async function init() {
    loadPageSkeleton();

    wlData = new WaitingListData();

    WaitingListAssessment.init({ wlData, moduleWrap, moduleHeader, moduleBody });
  }

  return {
    init,
  };
})();
