const WaitingListOverview = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer = null;
  //--------------------------
  // DOM
  //--------------------------
  let moduleWrap;
  let overviewWrap;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlReviewTable;

  // DATA
  //--------------------------------------------------
  async function getReviewDataByConsumer(consumerId) {
    const data = await _UTIL.fetchData('getLandingPageForConsumer', {
      consumerId,
    });

    // string wlInfoId
    // string interviewDate
    // string conclusionResult
    // string conclusionDate
    // string sentToDODD

    // TODO-ASH: replace conclusionResult id with name, get from dropdown data
    return data.getLandingPageForConsumerResult.map(
      ({ wlInfoId, interviewDate, conclusionResult, conclusionDate, sentToDODD }) => {
        return {
          id: wlInfoId,
          values: [
            UTIL.formatDateToIso(interviewDate.split(' ')[0]),
            conclusionResult,
            conclusionDate,
            UTIL.formatDateToIso(sentToDODD.split(' ')[0]),
          ],
        };
      },
    );
  }

  // EVENTS
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data[0];

    wlReviewTable.clear();
    newAssessmentBtn.toggleDisabled(!selectedConsumer);

    if (!selectedConsumer) return;

    const tableData = await getReviewDataByConsumer(selectedConsumer);
    wlReviewTable.populate(tableData);
    newAssessmentBtn.toggleDisabled(false);
  }
  function attachEvents() {
    newAssessmentBtn.onClick(() => {
      WaitingListAssessment.init({ selectedConsumer, moduleHeaderEle, moduleBodyEle });
    });
    rosterPicker.onConsumerSelect(onConsumerSelect);
  }

  // MAIN
  //--------------------------------------------------
  async function loadPage() {
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();
  }
  function loadPageSkeleton() {
    moduleBody.innerHTML = '';
    moduleHeader.innerHTML = '';

    overviewWrap = _DOM.createElement('div', { class: 'waitingListOverview' });

    moduleBody.appendChild(overviewWrap);

    wlReviewTable.renderTo(overviewWrap);
    rosterPicker.renderTo(overviewWrap);
    newAssessmentBtn.renderTo(moduleHeader);
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

    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
      consumerRequired: true,
    });

    newAssessmentBtn = new Button({
      text: 'New Assessment',
      style: 'primary',
      styleType: 'contained',
      disabled: true,
    });
  }
  async function load() {
    initComponents();

    loadPageSkeleton();

    await loadPage();

    attachEvents();
  }

  async function init({ moduleHeaderEle, moduleBodyEle }) {
    moduleHeader = moduleHeaderEle;
    moduleBody = moduleBodyEle;

    load();
  }

  return {
    init,
    onConsumerSelect,
  };
})();
