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
  let wlRosterWrap;
  let wlOverview;
  let newAssessmentBtn;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let rosterPicker;
  let wlForms = {};

  // ROSTER
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data;
    await wlData.fetchReviewDataByConsumer(selectedConsumer[0]);
    const tableData = wlData.getReviewDataByConsumer();
    wlReviewTable.populate(tableData);
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    rosterPicker.onConsumerSelect(onConsumerSelect);
    newAssessmentBtn.onClick();
  }
  async function populatePage() {
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();
  }
  async function loadPage() {
    wlReviewTable.renderTo(wlOverviewWrap);
    rosterPicker.renderTo(wlRosterWrap);
  }
  function loadPageSkeleton() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';
    _DOM.ACTIONCENTER.setAttribute('data-UI', true);
    _DOM.setActiveModuleAttribute('waitingList');

    // build DOM skeleton
    moduleWrap = _DOM.createElement('div', { class: 'waitingListModule' });
    wlRosterWrap = _DOM.createElement('div', { class: 'waitingListRosterPicker' });
    wlOverviewWrap = _DOM.createElement('div', { class: 'waitingListOverview' });

    moduleWrap.appendChild(wlOverviewWrap);
    moduleWrap.appendChild(wlRosterWrap);

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

    // Review Table
    newAssessmentBtn = new Button({
      text: 'New Assessment',
      style: 'primary',
      styleType: 'contained',
    });

    wlReviewTable = new Table({
      columnSortable: true,
      headings: [
        {
          text: 'Interview Date',
          type: 'date',
        },
        {
          text: 'Conclusion',
          type: 'string',
        },
        {
          text: 'Conclusion Date',
          type: 'date',
        },
        {
          text: 'Sent To DODD',
          type: 'date',
        },
      ],
    });
  }

  async function init() {
    loadPageSkeleton();

    // init data
    wlData = new WaitingListData();

    initComponents();
    await loadPage();
    await populatePage();
    attachEvents();
  }

  return {
    init,
  };
})();
