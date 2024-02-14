const WaitingList = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let activeWindow = 'form';
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlData;
  let rosterPicker;
  //--------------------------
  // DOM
  //--------------------------
  let moduleWrapEle;
  let moduleHeaderEle;
  let moduleBodyEle;
  let moduleBodyRosterWrapEle;
  let moduleBodyMainWrapEle;

  function getRosterPickerInstance() {
    return rosterPicker;
  }
  function getDataInstance() {
    return wlData;
  }
  function getHTML() {
    return {
      moduleHeader: moduleHeaderEle,
      moduleBodyMain: moduleBodyMainWrapEle,
    };
  }

  function setActiveWindow(active) {
    // active = form || table
    activeWindow = active;
  }

  function loadPageSkeleton() {
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    moduleWrapEle = _DOM.createElement('div', { class: 'waitingList' });
    moduleHeaderEle = _DOM.createElement('div', { class: 'waitingList__header' });
    moduleBodyEle = _DOM.createElement('div', { class: 'waitingList__body' });
    moduleBodyMainWrapEle = _DOM.createElement('div', { class: 'waitingList__main' });
    moduleBodyRosterWrapEle = _DOM.createElement('div', { class: 'waitingList__roster' });

    moduleWrapEle.appendChild(moduleHeaderEle);
    moduleWrapEle.appendChild(moduleBodyEle);
    moduleBodyEle.appendChild(moduleBodyMainWrapEle);
    moduleBodyEle.appendChild(moduleBodyRosterWrapEle);

    _DOM.ACTIONCENTER.appendChild(moduleWrapEle);
  }

  async function init() {
    loadPageSkeleton();

    wlData = new WaitingListData();

    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
      consumerRequired: true,
    });
    rosterPicker.renderTo(moduleBodyRosterWrapEle);
    rosterPicker.mobileRosterBtn.renderTo(_DOM.ACTIONCENTER);

    rosterPicker.onConsumerSelect(consumerId => {
      if (activeWindow === 'form') {
        WaitingListAssessment.onConsumerSelect(consumerId);
        return;
      }

      WaitingListOverview.onConsumerSelect(consumerId);
    });

    await rosterPicker.fetchConsumers();
    rosterPicker.populate();

    WaitingListAssessment.init();

    //TODO-ASH: MOVE THIS TO ROSTER??
    if (document.body.dataset.mobile) {
      const nav = document.getElementById('navigation');
      nav.classList.add('actionBtnActive');
    }
  }

  return {
    init,
    setActiveWindow,
    getRosterPickerInstance,
    getDataInstance,
    getHTML,
  };
})();
