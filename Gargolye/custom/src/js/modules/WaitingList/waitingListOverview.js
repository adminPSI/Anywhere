const WaitingListOverview = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer = null;
  //--------------------------
  // DOM
  //--------------------------
  let rosterWrap;
  let overviewWrap;
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
    wlReviewTable.renderTo(overviewWrap);
    rosterPicker.renderTo(rosterWrap);
  }
  function loadPageSkeleton() {
    moduleHeader.innerHTML = '';
    moduleBody.innerHTML = '';

    overviewWrap = _DOM.createElement('div', { class: 'waitingListOverview' });
    rosterWrap = _DOM.createElement('div', { class: 'waitingListRoster' });

    moduleBody.appendChild(overviewWrap);
    moduleBody.appendChild(rosterWrap);
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

  async function init({ wlData, moduleWrapEle, moduleHeaderEle, moduleBodyEle }) {
    // init data
    selectedConsumer = consumerId;
    wlData = wlDataInstance;
    moduleWrap = moduleWrapEle;
    moduleHeader = moduleHeaderEle;
    moduleBody = moduleBodyEle;

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
