const WaitingList = (() => {
  function unload() {
    _DOM.ACTIONCENTER.removeAttribute('data-ui');
  }

  async function load() {
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    moduleWrapEle = _DOM.createElement('div', { class: 'waitingList' });
    moduleHeaderEle = _DOM.createElement('div', { class: 'waitingList__header' });
    moduleBodyEle = _DOM.createElement('div', { class: 'waitingList__body' });

    moduleWrapEle.appendChild(moduleHeaderEle);
    moduleWrapEle.appendChild(moduleBodyEle);
    _DOM.ACTIONCENTER.appendChild(moduleWrapEle);

    WaitingListOverview.init({ moduleHeaderEle, moduleBodyEle });
  }

  return {
    init: load,
    unload,
  };
})();
