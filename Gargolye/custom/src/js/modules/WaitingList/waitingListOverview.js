const WaitingListOverview = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer = null;
  //--------------------------
  // DOM
  //--------------------------
  let overviewWrap;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlReviewTable;

  // EVENTS
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data[0];
    const tableData = await WaitingListAssessment.data.getReviewDataByConsumer(selectedConsumer);
    wlReviewTable.populate(tableData);
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {}
  async function populatePage() {
    if (selectedConsumer) {
      rosterPicker.setSelectedConsumers(selectedConsumer);
      await WaitingListAssessment.data.fetchReviewDataByConsumer(selectedConsumer);
      const tableData = WaitingListAssessment.data.getReviewDataByConsumer();
      wlReviewTable.populate(tableData);
    }
  }
  async function loadPage() {
    wlReviewTable.renderTo(overviewWrap);
  }
  function loadPageSkeleton() {
    moduleHeader.innerHTML = '';
    moduleBodyMain.innerHTML = '';

    overviewWrap = _DOM.createElement('div', { class: 'waitingListOverview' });

    moduleBodyMain.appendChild(overviewWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  function initComponents() {
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

  async function init() {
    wlData = WaitingList.getDataInstance();
    rosterPicker = WaitingList.getRosterPickerInstance();
    const htmlEle = WaitingList.getHTML();
    moduleHeader = htmlEle.moduleHeader;
    moduleBodyMain = htmlEle.moduleBodyMain;

    loadPageSkeleton();

    initComponents();
    await loadPage();
    attachEvents();
  }

  return {
    init,
    onConsumerSelect,
  };
})();
