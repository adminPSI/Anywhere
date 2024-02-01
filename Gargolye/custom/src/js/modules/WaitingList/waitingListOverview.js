const WaitingListOverview = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer = null;
  //--------------------------
  // DOM
  //--------------------------
  let wlRosterWrap;
  let wlOverview;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let rosterPicker;
  let wlForms = {};

  // EVENTS
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data[0];
    // await wlData.fetchReviewDataByConsumer(selectedConsumer);
    // const tableData = wlData.getReviewDataForConsumer();
    // wlReviewTable.populate(tableData);
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    rosterPicker.onConsumerSelect(onConsumerSelect);
    newAssessmentBtn.onClick(onNewAssessmentBtnClick);
  }
  async function populatePage() {
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();

    if (selectedConsumer) {
      rosterPicker.setSelectedConsumers(selectedConsumer);
      await wlData.fetchReviewDataByConsumer(selectedConsumer);
      const tableData = wlData.getReviewDataByConsumer();
      wlReviewTable.populate(tableData);
    }
  }
  async function loadPage() {
    wlReviewTable.renderTo(wlOverviewWrap);
    rosterPicker.renderTo(wlRosterWrap);
  }
  function loadPageSkeleton() {
    moduleWrap.innerHTML = '';

    // build DOM skeleton
    wlOverviewWrap = _DOM.createElement('div', { class: 'waitingListOverview' });
    wlRosterWrap = _DOM.createElement('div', { class: 'waitingListOverview__roster' });

    moduleWrap.appendChild(wlOverviewWrap);
    moduleWrap.appendChild(wlRosterWrap);
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

  async function init(consumerId, wlDataInstance, moduleWrapEle) {
    // init data
    selectedConsumer = consumerId;
    wlData = wlDataInstance;
    moduleWrap = moduleWrapEle;

    loadPageSkeleton();

    initComponents();
    await loadPage();
    await populatePage();
    attachEvents();
  }

  return {
    init,
  };
})();
