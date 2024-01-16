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
    waitingListInfo: [
      {
        label: 'Name of person completing assessment',
        id: 'personCompleting',
        type: 'text',
      },
      {
        label: 'Title of person completing assessment',
        id: 'personCompletingTitle',
        type: 'text',
      },
      {
        label: 'Describe the current living arrangement',
        id: 'currentLivingArrangement',
        type: 'select',
        data: [
          { value: '1', text: 'Lives Alone' },
          { value: '2', text: 'Lives with Family or Other Caregivers' },
          { value: '3', text: 'Lives With Others Who Are Not Caregivers' },
          { value: '4', text: 'Lives in an Intermediate Care Facility' },
          { value: '5', text: 'Lives in a Nursing Facility' },
          { value: '0', text: 'Other' },
        ],
      },
      {
        label: 'In what areas does person report needing help?',
        id: 'areasPersonNeedsHelp',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    conditions: [
      {
        type: 'radiogroup',
        id: 'TODO-MIKE',
        groupLabel: `Does this person have a condition that is attributable to a mental or physical impairment or combination of mental and physical impairments, other than an impairment cuased solely by mental illness?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'before22',
        groupLabel: `Was the condition present before age 22?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isConditionIndefinite',
        groupLabel: `Is the condition likely to continue indefinitely?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    currentAvailableServices: [
      {
        type: 'radiogroup',
        id: 'countyBoard',
        groupLabel: 'County Board services / funding',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'helpMeGrow',
        groupLabel: 'Help Me Grow / Ohio Early Intervention',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'bureauForChildren',
        groupLabel: 'Bureau for Children with Medical Handicaps',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'firstCouncil',
        groupLabel: 'Family and Children First Council',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'ode',
        groupLabel: 'Ohio Department of Education',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'rehabOpportunities',
        groupLabel: 'Vocational Rehabilitation / Opportunities for Ohioans with Disabilities',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'childrenServices',
        groupLabel: 'Children Services',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'medicaidStatePlanAide',
        groupLabel: 'Medicaid State Plan Home Health Aide',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'medicaidStatePlanNurse',
        groupLabel: 'Medicaid State Plan Home Health Nursing',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'medicaidStatePlanPrivate',
        groupLabel: 'Medicaid State Plan Private Duty Nursing',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'homeCareWaiver',
        groupLabel: 'Ohio Home Care Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'passportWaiver',
        groupLabel: 'PASSPORT Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'assistedLivingWaiver',
        groupLabel: 'Assisted Living Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'mycareWaiver',
        groupLabel: 'MyCare Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'fundingWaiver',
        groupLabel: 'Self-Empowered Life Funding Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'levelOneWaiver',
        groupLabel: 'Level One Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'caOther',
        groupLabel: 'Other',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label: 'Other:',
        id: 'caOtherNote',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    contributingCircumstances: [
      // This is a parent page so I think its empty except for its children
    ],
    primaryCaregiver: [
      {
        type: 'radiogroup',
        id: 'isThereEvidence',
        groupLabel:
          'Is there evidence that the primary caregiver has a declining or chronic condition or is facing other unforseen circumstances that will limit his or her ability to care for the individual?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label:
          'List documentation used to verify presence of declining or chronic condition or unforeseen circumstances.',
        id: 'listDocumentation',
        fullscreen: true,
        type: 'textarea',
      },
      {
        type: 'radiogroup',
        id: 'actionRequired',
        groupLabel: `Is action required within the next 30 days due to the caregiver's inability to care for the individual?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label: 'Describe the action required:',
        id: 'actionRequiredNote',
        fullscreen: true,
        type: 'textarea',
      },
      {
        type: 'radiogroup',
        id: 'actionRequired',
        groupLabel: `Is there evidence of declining skills the individual has experienced as a result of either the caregiver's condition or insufficient caregivers to meet the individual's current needs?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label: `List documentation used to verify presence of caregiver's condition,if not already described above: `,
        id: 'actionRequiredNote',
        fullscreen: true,
        type: 'textarea',
      },
      {
        label: 'Describe decline:',
        id: 'describeDecline',
        fullscreen: true,
        type: 'textarea',
      },
      {
        label: 'Additional comments:',
        id: 'additionalComments',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    needs: [
      {
        type: 'checkboxgroup',
        id: 'behaviorlaNeedsRisk',
        groupLabel: 'Check all that apply:',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there is currently no pattern of behavior that creates a substantial risk.',
            id: 'notApplicable',
          },
          { type: 'checkbox', label: 'Physical Aggression', id: 'other' },
          { type: 'checkbox', label: 'Self-Injury', id: 'selfInjury' },
          { type: 'checkbox', label: 'Fire-setting', id: 'fireSetting' },
          { type: 'checkbox', label: 'Elopement', id: 'elopement' },
          { type: 'checkbox', label: 'Sexual Offending', id: 'sexualOffending' },
          { type: 'checkbox', label: 'Other', id: 'other' },
        ],
      },
      {
        label: 'Describe type, frequency, and intensity of behavioral needs:',
        id: 'describeBehavioralNeeds',
        fullscreen: true,
        type: 'textarea',
      },
      {
        type: 'checkboxgroup',
        id: 'behaviorlaNeedsDocs',
        groupLabel: 'Documentation available (Select at least one):',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there is currently no pattern of behavior that creats a substantial risk',
            id: 'notApplicable',
          },
          { type: 'checkbox', label: 'Police Report(s)', id: 'policeReports' },
          { type: 'checkbox', label: 'Incident Report(s)', id: 'incidentReports' },
          { type: 'checkbox', label: 'Behavior Tracking Sheets(s)', id: 'behaviorTrackingSheets' },
          { type: 'checkbox', label: 'Psychological Assessment', id: 'psycAssessment' },
          { type: 'checkbox', label: 'Other', id: 'other' },
        ],
      },
      {
        label: 'Other:',
        id: 'documentationAvailableOther',
        fullscreen: true,
        type: 'textarea',
      },
      {
        type: 'checkboxgroup',
        id: 'physicalNeeds',
        groupLabel: 'Check all that apply:',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there are no significant physical care needs',
            id: 'notApplicable',
          },
          {
            type: 'checkbox',
            label: 'Frequent hands-on support required with activities of daily living throughout the day and night',
            id: 'handsOnSupport',
          },
          {
            type: 'checkbox',
            label: 'Size / Condition of the individual creates a risk of injury during physical care',
            id: 'bigBoy',
          },
          { type: 'checkbox', label: 'Other', id: 'other' },
        ],
      },
      {
        label: 'Describe type, frequency, and intensity of physical care needs:',
        id: 'describeCareNeeds',
        fullscreen: true,
        type: 'textarea',
      },
      {
        type: 'checkboxgroup',
        id: 'medicalNeeds',
        groupLabel: ' (Check all that apply)',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there are no significant or life-threatening medical needs',
            id: 'notApplicable',
          },
          {
            type: 'checkbox',
            label: 'Frequent hospitalizations or emergency room visits for life-sustaining treatment',
            id: 'lifeSustainingTreatment',
          },
          {
            type: 'checkbox',
            label:
              'Ongoing medical care provided by caregivers to prevent hospitalization or emergency room intervention',
            id: 'erIntervention',
          },
          {
            type: 'checkbox',
            label: 'Need for specialized training of caregivers to prevent emergency medical intervention',
            id: 'specializedTraining',
          },
          { type: 'checkbox', label: 'Other', id: 'other' },
        ],
      },
      {
        label: 'Describe type, frequency, and intensity of medical needs:',
        id: 'describeCareNeeds',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    riskMitigation: [
      {
        type: 'checkboxgroup',
        id: 'openInvestigation',
        groupLabel: 'There is currently an open investigation with: (Check all that apply):',
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
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    icfDischarge: [
      {
        type: 'radiogroup',
        id: 'icfDischarge1',
        groupLabel: 'Is the individual currently a resident of an ICFIID or Nursing Facility?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'icfDischarge2',
        groupLabel:
          'Has the individual been issued a 30-day notice of intent to discharge or received an adverse Resident Review determination?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'icfDischarge3',
        groupLabel: 'Is action required with the next 30 days to reduce the risk?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    intermittentSupports: [
      {
        type: 'radiogroup',
        id: 'intermittentSupports1',
        groupLabel: 'Does the individual have a need for limited or intermittent supports within the next 12 months?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'intermittentSupports2',
        groupLabel: 'Does the individual desire to remain in the current living environment?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'intermittentSupports3',
        groupLabel:
          'Are existing caregivers willing AND able to continue to provide supports, if some relief were provided?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    childProtectionAgency: [
      {
        type: 'radiogroup',
        id: 'childProtectionAgency1',
        groupLabel:
          'Is the individual being rleased from the custody of a child protective agency within the next 12 months? ',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        id: 'anticipatedDate',
        type: 'date',
        label: 'Anticipated Date',
      },
      {
        type: 'radiogroup',
        id: 'childProtectionAgency2',
        groupLabel: 'Does the individual have needs that cannot be addressed through alternative services?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    adultDayEmployment: [
      {
        type: 'radiogroup',
        id: 'adultDayEmployment1',
        groupLabel:
          'Are the needed services required at a level or frequency that exceeds what is able to be sustained through local County Board resources',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'adultDayEmployment2',
        groupLabel:
          'Are thhe needed services beyond what is available to the individual through the local school district / Individuals with Disabilities Education Act?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'adultDayEmployment3',
        groupLabel:
          'Are the needed services beyond what is available to the individual through Vocational Rehabilitation / Opportunities for Ohioans with Disabilities or other resources?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    dischargePlan: [
      {
        type: 'radiogroup',
        id: 'dischargePlan1',
        groupLabel: 'Is the individual currently a resident of an ICFIID or Nursing Facility?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'dischargePlan2',
        groupLabel:
          'Has the individual / guardian expressed an interest in moving to a community-based setting within the next 12 months?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'dischargePlan3',
        groupLabel: `Is the individual's team developing a discharge plan that addresses barries to community living, such as housing and availability of providers?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
    ],
    immediateNeeds: [
      {
        type: 'radiogroup',
        id: 'immediateNeeds',
        groupLabel: `Is there an immediate need identified that requires an action plan with 30 days to reduce the risk?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label: `if "Yes", describe the immediate need:`,
        id: 'immediateNeedsNote',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    currentNeeds: [
      {
        type: 'radiogroup',
        id: 'currentNeeds',
        groupLabel: `If "Yes", will any of those needs be unmet by existing supports / resources within the next 12 months?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label: `if "Yes", describe the unmet need:`,
        id: 'currentNeedsNote',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    waiverEnrollment: [
      {
        type: 'radiogroup',
        id: 'waivEnrollWaiverEnrollmentIsRequired',
        groupLabel:
          'Will the unmet immediate need or unmet current need require enrollment in a waiver due to the lack of community-based alternative services to address the need?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'no' },
        ],
      },
      {
        label: `If "No", describe the community-based alternative services that can address the unmet need:`,
        id: 'waivEnrollWaiverEnrollmentDescription',
        fullscreen: true,
        type: 'textarea',
      },
    ],
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
      const formHeader = _DOM.createElement('h2', { text: _UTIL.convertCamelCaseToTitle(form) });
      moduleWrap.appendChild(formHeader);
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

      wlForms[formElement] = new Form({
        hideAllButtons: true,
        fields: formElements[formElement],
      });
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
