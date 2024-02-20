const WaitingListOverview = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer;
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

    const conclusionResults = {
      0: 'No qualifying condition',
      1: 'Immediate Need',
      2: 'Current Need',
      3: 'Neither Immediate Need nor Current Need',
    };

    let alreadyHasAssessmentForToday = false;

    const tableData = data.getLandingPageForConsumerResult.map(
      ({ wlInfoId, interviewDate, conclusionResult, conclusionDate, sentToDODD }) => {
        const isToday = new Date().setHours(0, 0, 0, 0) === new Date(interviewDate).setHours(0, 0, 0, 0);
        if (isToday) alreadyHasAssessmentForToday = true;

        return {
          id: wlInfoId,
          values: [
            UTIL.formatDateToIso(interviewDate.split(' ')[0]),
            conclusionResults[conclusionResult],
            UTIL.formatDateToIso(conclusionDate.split(' ')[0]),
            UTIL.formatDateToIso(sentToDODD.split(' ')[0]),
          ],
        };
      },
    );

    return { tableData, alreadyHasAssessmentForToday };
  }

  // EVENTS
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data[0];

    wlReviewTable.clear();
    newAssessmentBtn.toggleDisabled(!selectedConsumer);

    if (!selectedConsumer) return;

    const { tableData, alreadyHasAssessmentForToday } = await getReviewDataByConsumer(selectedConsumer);
    wlReviewTable.populate(tableData);
    newAssessmentBtn.toggleDisabled(false);
    newAssessmentBtn.toggleDisabled(alreadyHasAssessmentForToday);
  }
  function attachEvents() {
    newAssessmentBtn.onClick(() => {
      WaitingListAssessment.init({ selectedConsumer, moduleHeaderEle, moduleBodyEle });
    });
    rosterPicker.onConsumerSelect(onConsumerSelect);
    wlReviewTable.onRowClick(async e => {
      // do stuff
      // const resp = await _UTIL.fetchData('', {});
    });
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
