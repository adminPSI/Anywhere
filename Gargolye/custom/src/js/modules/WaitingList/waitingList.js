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
  let wlForms = {};

  // ROSTER
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data;
    await wlData.fetchReviewDataByConsumer(selectedConsumer[0]);
    const tableData = wlData.getReviewDataByConsumer();
    wlReviewTable.populate(tableData);
  }

  // FORM
  //--------------------------------------------------
  const formElements = {
    waitingListInfo: [],
    conditions: [],
    currentAvailableServices: [],
    contributingCircumstances: [],
    primaryCaregiver: [],
    needs: [],
    riskMitigation: [
      {
        type: 'checkboxgroup',
        id: 'openInvestigation',
        groupLabel: 'There is currently an open investigation with: (Check all that apply)',
        fields: [
          { type: 'checkbox', label: 'Not applicable; there is currently no open investigation', id: 'notApplicable' },
          { type: 'checkbox', label: 'Adult Protective Services', id: 'adultProtectiveServices' },
          { type: 'checkbox', label: 'County Board', id: 'countyBoard' },
          { type: 'checkbox', label: 'Law Enforcement', id: 'popo' },
          { type: 'checkbox', label: 'Other', id: 'other' },
        ],
      },
      {
        label: 'Describe incident under investigation and supports needed to reduce the risk:',
        id: 'describeIncident',
        fullscreen: true,
        type: 'textarea',
      },
      {
        type: 'radiogroup',
        id: 'actionRequired',
        groupLabel: 'Is action required within the next 30 days to reduce risk?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes' },
          { type: 'radio', label: 'No', value: 'no' },
        ],
      },
    ],
    icfDischarge: [],
    intermittentSupports: [],
    childProtectionAgency: [],
    adultDayEmployment: [],
    dischargePlan: [],
    immediateNeeds: [],
    currentNeeds: [],
    waiverEnrollment: [],
  };

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    rosterPicker.onConsumerSelect(onConsumerSelect);
  }
  async function populatePage() {
    await rosterPicker.fetchConsumers();
    rosterPicker.populate();
  }
  async function loadPage() {
    rosterPicker.renderTo(moduleWrap);
    wlReviewTable.renderTo(moduleWrap);

    for (form in wlForms) {
      wlForms[form].renderTo(moduleWrap);
    }
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

    // Review Table
    wlReviewTable = new Table({
      columnSortable: true,
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

    // Forms - MOVE THESE SOMEWHERE ELSE????
    for (formElement in formElements) {
      if (formElements[formElement].length === 0) continue;

      console.log('Before new Form:', formElements[formElement]);

      wlForms[formElement] = new Form({
        hideAllButtons: true,
        fields: formElements[formElement],
      });

      console.log('After new Form:', formElements[formElement]);
    }
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
