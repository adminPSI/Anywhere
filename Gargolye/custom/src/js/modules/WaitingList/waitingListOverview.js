const WaitingListOverview = (() => {
  let selectedRow, selectedRowId;
  // UI Instances
  let selectedConsumer;
  let overviewWrap;
  let wlReviewTable;
  let deleteWarningPopup;

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

    const tableData = data.getLandingPageForConsumerResult
      .map(({ wlInfoId, interviewDate, conclusionResult, conclusionDate, sentToDODD }) => {
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
      })
      .sort((a, b) => {
        const dateA = new Date(a.values[0]).getTime();
        const dateB = new Date(b.values[0]).getTime();

        if (dateA > dateB) {
          return -1;
        } else if (dateA < dateB) {
          return 1;
        } else {
          return 0;
        }
      });

    return { tableData, alreadyHasAssessmentForToday };
  }

  // EVENTS
  //--------------------------------------------------
  async function populateReviewTable() {
    wlReviewTable.clear();

    if (!selectedConsumer) {
      newAssessmentBtn.toggleDisabled(true);
      return;
    };

    const { tableData, alreadyHasAssessmentForToday } = await getReviewDataByConsumer(selectedConsumer.id);
    wlReviewTable.populate(tableData);
    const isNewAssessmentBtnDisabled = alreadyHasAssessmentForToday || !$.session.waitingListInsert;
    newAssessmentBtn.toggleDisabled(isNewAssessmentBtnDisabled);
  }
  function attachEvents() {
    newAssessmentBtn.onClick(() => {
      WaitingListAssessment.init({ selectedConsumer, moduleHeader, moduleBody }, true);
    });

    rosterPicker.onConsumerSelect(
      data => {
        selectedConsumer = Object.values(data)[0];
        populateReviewTable();
      },
      { idkyet: true },
    );

    wlReviewTable.onRowClick(async rowId => {
      if (!$.session.waitingListView) return;
      const resp = await _UTIL.fetchData('getWaitingListAssessment', { waitingListAssessmentId: parseInt(rowId) });
      WaitingListAssessment.init({
        wlData: resp.getWaitingListAssessmentResult[0],
        selectedConsumer: selectedConsumer,
        moduleHeader,
        moduleBody,
      });
    });
    wlReviewTable.onRowDelete(async (row, rowId) => {
      selectedRow = row;
      selectedRowId = rowId;

      deleteWarningPopup.show();
    });
  }

  // MAIN
  //--------------------------------------------------
  function populateDeleteWarningPopup() {
    const messageEle = _DOM.createElement('p', {
        class: 'confirmation__message',
    });

    const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
    const confirmButton = new Button({
        text: 'Yes',
        name: 'confirm',
        icon: 'checkmark', 
    });
    const cancelButton = new Button({
        text: 'No',
        name: 'cancel',
        icon: 'close',
    });

    confirmButton.onClick(async () => {
      const resp = await _UTIL.fetchData('deleteWaitingListAssessment', {
        waitingListId: parseInt(selectedRowId),
      });

      wlReviewTable.removeRow(selectedRow);

      deleteWarningPopup.close();

      selectedRow = null;
      selectedRowId = null;
    });
    cancelButton.onClick(() => {
      deleteWarningPopup.close();
    });

    confirmButton.renderTo(btnWrap);
    cancelButton.renderTo(btnWrap);

    deleteWarningPopup.dialog.appendChild(messageEle);
    deleteWarningPopup.dialog.appendChild(btnWrap);
  }
  async function loadPage() {
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();

    deleteWarningPopup.renderTo(_DOM.ACTIONCENTER);
    populateDeleteWarningPopup();
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
    wlReviewTable = new Table({
      columnSortable: true,
      allowDelete: $.session.waitingListDelete,
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

    deleteWarningPopup = new Dialog({ className: 'wlDeleteWarningPopup' });
  }
  async function reload() {
    loadPageSkeleton();
    await loadPage();
    attachEvents();
  }
  async function init(opts) {
    moduleHeader = opts.moduleHeader;
    moduleBody = opts.moduleBody;
    selectedConsumer = opts.selectedConsumer;

    initComponents();
    loadPageSkeleton();
    await loadPage();
    attachEvents();

    if (selectedConsumer) {
      populateReviewTable();
      rosterPicker.setSelectedConsumers([selectedConsumer.id]);
    }
  }

  return {
    init,
    reload,
  };
})();
