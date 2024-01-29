const WaitingListOverview = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer = null;
  //--------------------------
  // DOM
  //--------------------------
  let moduleWrap;
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
    newAssessmentBtn.renderTo(wlOverviewWrap);
    wlReviewTable.renderTo(wlOverviewWrap);
    rosterPicker.renderTo(wlRosterWrap);
  }
  function loadPageSkeleton() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';

    // build DOM skeleton
    moduleWrap = _DOM.createElement('div', { class: 'waitingListOverview' });
    wlRosterWrap = _DOM.createElement('div', { class: 'waitingListOverview__roster' });
    wlOverviewWrap = _DOM.createElement('div', { class: 'waitingListOverview__table' });

    moduleWrap.appendChild(wlOverviewWrap);
    moduleWrap.appendChild(wlRosterWrap);

    _DOM.ACTIONCENTER.appendChild(moduleWrap);
  }
  async function reloadPage() {
    _DOM.ACTIONCENTER.innerHTML = '';

    // build DOM skeleton
    moduleWrap = _DOM.createElement('div', { class: 'waitingListModule' });
    wlRosterWrap = _DOM.createElement('div', { class: 'waitingListRosterPicker' });
    wlOverviewWrap = _DOM.createElement('div', { class: 'waitingListOverview' });

    moduleWrap.appendChild(wlOverviewWrap);
    moduleWrap.appendChild(wlRosterWrap);

    _DOM.ACTIONCENTER.appendChild(moduleWrap);

    await loadPage();
    await populatePage();
    attachEvents();
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

  async function init(consumerId) {
    loadPageSkeleton();

    // init data
    selectedConsumer = consumerId;

    initComponents();
    await loadPage();
    await populatePage();
    attachEvents();
  }

  return {
    init,
  };
})();
