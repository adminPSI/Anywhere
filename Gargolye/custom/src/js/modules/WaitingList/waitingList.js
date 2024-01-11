const WaitingList = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  //--------------------------
  // PERMISSIONS
  //--------------------------
  let isReadOnly;
  //--------------------------
  // DOM
  //--------------------------
  let moduleWrap;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let rosterPicker;
  let wlForms;

  // ROSTER
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data;
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {}
  async function populatePage() {}
  async function loadPage() {
    rosterPicker.renderTo(moduleWrap);
    wlReviewTable.renderTo(moduleWrap);
  }
  function loadPageSkeleton() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    // build DOM skeleton
    moduleWrap = _DOM.createElement('div', { class: 'waitingListModule' });

    _DOM.ACTIONCENTER.appendChild(moduleWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  function initComponents() {
    // Roster Picker
    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
      consumerRequired: true,
    });

    wlReviewTable = new Table({
      headings: [
        {
          text: 'Interview',
          type: 'date',
        },
        {
          text: 'Conclusion',
          type: 'string',
        },
        {
          text: 'Conclusion',
          type: 'date',
        },
        {
          text: 'Snet To DODD',
          type: 'date',
        },
      ],
    });
  }

  async function init() {
    loadPageSkeleton();

    initComponents();
    await loadPage();
    await populatePage();
  }

  return {
    init,
  };
})();
