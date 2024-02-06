const WaitingListAssessment = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer;
  let wlLinkID;
  //--------------------------
  // PERMISSIONS
  //--------------------------
  let isReadOnly;
  //--------------------------
  // DOM
  //--------------------------
  let assessmentWrap;
  let moduleWrap;
  let moduleHeader;
  let moduleBody;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlForms;
  let participantsTable;
  let wlData;
  let rosterPicker;
  let sendEmailButton;
  let reviewAssessmentBtn;

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
        id: 'livingArrangementOther',
        label: 'Describe Other Living Arrangement',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
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
        id: 'otherThanMentalHealth',
        groupLabel: `Does this person have a condition that is attributable to a mental or physical impairment or combination of mental and physical impairments, other than an impairment cuased solely by mental illness?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'otherThanMentalHealthyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'otherThanMentalHealthno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'before22',
        groupLabel: `Was the condition present before age 22?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'before22yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'before22no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isConditionIndefinite',
        groupLabel: `Is the condition likely to continue indefinitely?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isConditionIndefiniteyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isConditionIndefiniteno' },
        ],
      },
    ],
    currentAvailableServices: [
      {
        type: 'radiogroup',
        id: 'isCountyBoardFunding',
        groupLabel: 'County Board services / funding',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isCountyBoardFundingyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isCountyBoardFundingno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isOhioEarlyInterventionService',
        groupLabel: 'Help Me Grow / Ohio Early Intervention',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'radiogroupyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'radiogroupno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isBCMHService',
        groupLabel: 'Bureau for Children with Medical Handicaps',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isBCMHServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isBCMHServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isFCFCService',
        groupLabel: 'Family and Children First Council',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isFCFCServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isFCFCServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isODEService',
        groupLabel: 'Ohio Department of Education',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isODEServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isODEServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isOODService',
        groupLabel: 'Vocational Rehabilitation / Opportunities for Ohioans with Disabilities',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isOODServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isOODServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isChildrenServices',
        groupLabel: 'Children Services',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isChildrenServicesyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isChildrenServicesno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isMedicaidStatePlanHomeHealthAideservice',
        groupLabel: 'Medicaid State Plan Home Health Aide',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isMedicaidStatePlanHomeHealthAideserviceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isMedicaidStatePlanHomeHealthAideserviceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isMedicaidStatePlanHomeHealthNursingService',
        groupLabel: 'Medicaid State Plan Home Health Nursing',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isMedicaidStatePlanHomeHealthNursingServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isMedicaidStatePlanHomeHealthNursingServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isMedicaidStatePlanService',
        groupLabel: 'Medicaid State Plan Private Duty Nursing',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isMedicaidStatePlanServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isMedicaidStatePlanServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isOhioHomeCareWaiverservice',
        groupLabel: 'Ohio Home Care Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isOhioHomeCareWaiverserviceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isOhioHomeCareWaiverserviceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isPassportWaiverService',
        groupLabel: 'PASSPORT Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isPassportWaiverServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isPassportWaiverServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isAssistedLivingWaiverService',
        groupLabel: 'Assisted Living Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isAssistedLivingWaiverServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isAssistedLivingWaiverServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isMYCarewaiverService',
        groupLabel: 'MyCare Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isMYCarewaiverServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isMYCarewaiverServiceno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'unknownId1',
        groupLabel: 'Self-Empowered Life Funding Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'unknownId1yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'unknownId1no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'unknownId2',
        groupLabel: 'Level One Waiver',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'unknownId2yes' },
          { type: 'radio', label: 'No', value: 'no', id: 'unknownId2no' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'isOtherService',
        groupLabel: 'Other',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isOtherServiceyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isOtherServiceno' },
        ],
      },
      {
        label: 'Other:',
        id: 'otherDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
    ],
    contributingCircumstances: [
      // This is a parent page so I think its empty except for its children
    ],
    primaryCaregiver: [
      {
        type: 'radiogroup',
        id: 'isPrimaryCaregiverUnavailable',
        groupLabel:
          'Is there evidence that the primary caregiver has a declining or chronic condition or is facing other unforseen circumstances that will limit his or her ability to care for the individual?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isPrimaryCaregiverUnavailableyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isPrimaryCaregiverUnavailableno' },
        ],
      },
      {
        label:
          'List documentation used to verify presence of declining or chronic condition or unforeseen circumstances.',
        id: 'unavailableDocumentation',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      {
        type: 'radiogroup',
        id: 'isActionRequiredIn30Days',
        groupLabel: `Is action required within the next 30 days due to the caregiver's inability to care for the individual?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isActionRequiredIn30Daysyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isActionRequiredIn30Daysno' },
        ],
        disabled: true,
      },
      {
        label: 'Describe the action required:',
        id: 'actionRequiredDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      {
        type: 'radiogroup',
        id: 'isIndividualSkillsDeclined',
        groupLabel: `Is there evidence of declining skills the individual has experienced as a result of either the caregiver's condition or insufficient caregivers to meet the individual's current needs?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'isIndividualSkillsDeclinedyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'isIndividualSkillsDeclinedno' },
        ],
        disabled: true,
      },
      {
        label: `List documentation used to verify presence of caregiver's condition,if not already described above: `,
        id: 'declinedSkillsDocumentation',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      {
        label: 'Describe decline:',
        id: 'declinedSkillsDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      {
        label: 'Additional comments:',
        id: 'additionalCommentsForUnavailable',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
    ],
    needs: [
      // BEHAVIRAL NEEDS
      {
        disabled: true,
        type: 'radiogroup',
        id: 'risksIsRiskToSelf',
        groupLabel:
          'Is the individual a child / adult currently engaging in a pattern of behavior that creates a substantial risk to self / others?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'risksIsRiskToSelfyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'risksIsRiskToSelfno' },
        ],
      },
      {
        type: 'checkboxgroup',
        id: 'behavioral',
        groupLabel: 'Check all that apply:',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there is currently no pattern of behavior that creates a substantial risk.',
            id: 'risksIsNone',
          },
          { type: 'checkbox', label: 'Physical Aggression', id: 'risksIsPhysicalAggression' },
          { type: 'checkbox', label: 'Self-Injury', id: 'risksIsSelfInjury' },
          { type: 'checkbox', label: 'Fire-setting', id: 'risksIsFireSetting' },
          { type: 'checkbox', label: 'Elopement', id: 'risksIsElopement' },
          { type: 'checkbox', label: 'Sexual Offending', id: 'risksIsSexualOffending' },
          { type: 'checkbox', label: 'Other', id: 'risksIsOther' },
        ],
      },
      {
        label: 'Describe type, frequency, and intensity of behavioral needs:',
        id: 'risksFrequencyDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      {
        type: 'checkboxgroup',
        id: 'unknownId3',
        groupLabel: 'Documentation available (Select at least one):',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there is currently no pattern of behavior that creats a substantial risk',
            id: 'risksHasNoDocument',
          },
          { type: 'checkbox', label: 'Police Report(s)', id: 'risksHasPoliceReport' },
          { type: 'checkbox', label: 'Incident Report(s)', id: 'risksHasIncidentReport' },
          { type: 'checkbox', label: 'Behavior Tracking Sheets(s)', id: 'risksHasBehaviorTracking' },
          { type: 'checkbox', label: 'Psychological Assessment', id: 'risksHasPsychologicalAssessment' },
          { type: 'checkbox', label: 'Other', id: 'risksHasOtherDocument' },
        ],
      },
      {
        label: 'Other:',
        id: 'risksOtherDocumentDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      // PHYSICAL NEEDS
      {
        disabled: true,
        type: 'radiogroup',
        id: 'physicalNeedsIsPhysicalCareNeeded',
        groupLabel: 'Is the individual a child / adult with significant physical care needs?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'physicalNeedsIsPhysicalCareNeededyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'physicalNeedsIsPhysicalCareNeededno' },
        ],
      },
      {
        type: 'checkboxgroup',
        id: 'physicalNeeds',
        groupLabel: 'Check all that apply:',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there are no significant physical care needs',
            id: 'physicalNeedsIsNone',
          },
          {
            type: 'checkbox',
            label: 'Frequent hands-on support required with activities of daily living throughout the day and night',
            id: 'physicalNeedsIsPersonalCareNeeded',
          },
          {
            type: 'checkbox',
            label: 'Size / Condition of the individual creates a risk of injury during physical care',
            id: 'physicalNeedsIsRiskDuringPhysicalCare',
          },
          { type: 'checkbox', label: 'Other', id: 'physicalNeedsIsOther' },
        ],
      },
      {
        label: 'Describe type, frequency, and intensity of physical care needs:',
        id: 'physicalNeedsDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      // MEDICAL NEEDS
      {
        disabled: true,
        type: 'radiogroup',
        id: 'medicalNeedsIsLifeThreatening',
        groupLabel: 'Is the individual a child / adult with significant or life-threatening medical needs?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'medicalNeedsIsLifeThreateningyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'medicalNeedsIsLifeThreateningno' },
        ],
      },
      {
        type: 'checkboxgroup',
        id: 'medicalNeedsCheckboxes',
        groupLabel: ' (Check all that apply)',
        fields: [
          {
            type: 'checkbox',
            label: 'Not applicable; there are no significant or life-threatening medical needs',
            id: 'medicalNeedsIsNone',
          },
          {
            type: 'checkbox',
            label: 'Frequent hospitalizations or emergency room visits for life-sustaining treatment',
            id: 'medicalNeedsIsFrequentEmergencyVisit',
          },
          {
            type: 'checkbox',
            label:
              'Ongoing medical care provided by caregivers to prevent hospitalization or emergency room intervention',
            id: 'medicalNeedsIsOngoingMedicalCare',
          },
          {
            type: 'checkbox',
            label: 'Need for specialized training of caregivers to prevent emergency medical intervention',
            id: 'medicalNeedsIsSpecializedCareGiveNeeded',
          },
          { type: 'checkbox', label: 'Other', id: 'medicalNeedsIsOther' },
        ],
      },
      {
        label: 'Describe type, frequency, and intensity of medical needs:',
        id: 'medicalNeedsDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      // OTHER
      {
        type: 'radiogroup',
        id: 'needsIsActionRequiredRequiredIn30Days',
        groupLabel:
          'Is action required within the next 30 days to reduce the risk(s) presented by the behaviorl, physical, and / or medical needs?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'needsIsActionRequiredRequiredIn30Daysyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'needsIsActionRequiredRequiredIn30Daysno' },
        ],
        disabled: true,
      },
      {
        type: 'radiogroup',
        id: 'needsIsContinuousSupportRequired',
        groupLabel:
          'If No, do the significant behavioral, physical care, and / or medical needs identified require continuous support to reduce risk?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'needsIsContinuousSupportRequiredyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'needsIsContinuousSupportRequiredno' },
        ],
        disabled: true,
      },
    ],
    riskMitigation: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'rMIsSupportNeeded',
        groupLabel:
          'Is the individual an adult who has been subjected to abuse, neglect, or exploitation and requires support to reduce risk?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'rMIsSupportNeededyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'rMIsSupportNeededno' },
        ],
      },
      {
        type: 'checkboxgroup',
        id: 'openInvestigation',
        groupLabel: 'There is currently an open investigation with: (Check all that apply):',
        fields: [
          { type: 'checkbox', label: 'Not applicable; there is currently no open investigation', id: 'rMIsNone' },
          { type: 'checkbox', label: 'Adult Protective Services', id: 'rMIsAdultProtectiveServiceInvestigation' },
          { type: 'checkbox', label: 'County Board', id: 'rMIsCountyBoardInvestigation' },
          { type: 'checkbox', label: 'Law Enforcement', id: 'rMIsLawEnforcementInvestigation' },
          { type: 'checkbox', label: 'Other', id: 'rMIsOtherInvestigation' },
        ],
      },
      {
        label: 'Describe incident under investigation and supports needed to reduce the risk:',
        id: 'rMdescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
      {
        type: 'radiogroup',
        id: 'rMIsActionRequiredIn3oDays',
        groupLabel: 'Is action required within the next 30 days to reduce risk?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'rMIsActionRequiredIn3oDaysyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'rMIsActionRequiredIn3oDaysno' },
        ],
        disabled: true,
      },
    ],
    icfDischarge: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'icfDetermination',
        groupLabel:
          'Is the individual a resident of an ICFIID or Nursing Facility who has either been issued a 30-day notice of intent to discharge or received an adverse Resident Review determination?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'icfDeterminationyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'icfDeterminationno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'icfIsICFResident',
        groupLabel: 'Is the individual currently a resident of an ICFIID or Nursing Facility?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'icfIsICFResidentyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'icfIsICFResidentno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'icfIsNoticeIssued',
        groupLabel:
          'Has the individual been issued a 30-day notice of intent to discharge or received an adverse Resident Review determination?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'icfIsNoticeIssuedyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'icfIsNoticeIssuedno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'icfIsActionRequiredIn30Days',
        groupLabel: 'Is action required with the next 30 days to reduce the risk?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'icfIsActionRequiredIn30Daysyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'icfIsActionRequiredIn30Daysno' },
        ],
      },
    ],
    intermittentSupports: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'intSupDetermination',
        groupLabel:
          'Does the individual have an ongoing need for limited / intermittent supports to address behavioral, physical, or medical needs in order to sustain existing caregivers and remain in the current living with.',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupDeterminationyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'intSupDeterminationno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'intSupIsSupportNeededIn12Months',
        groupLabel: 'Does the individual have a need for limited or intermittent supports within the next 12 months?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupIsSupportNeededIn12Monthsyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'intSupIsSupportNeededIn12Monthsno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'intSupIsStayingLivingArrangement',
        groupLabel: 'Does the individual desire to remain in the current living environment?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupIsStayingLivingArrangementyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'intSupIsStayingLivingArrangementno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'intSupIsActionRequiredIn30Days',
        groupLabel:
          'Are existing caregivers willing AND able to continue to provide supports, if some relief were provided?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupIsActionRequiredIn30Daysyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'intSupIsActionRequiredIn30Daysno' },
        ],
      },
    ],
    childProtectionAgency: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'cpaDetermination',
        groupLabel:
          'Is the individual reaching the age of majority and being released from the custody of a child protective agency within the next 12 months and has needs that cannot be addressed through alternative services?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaDeterminationyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'cpaDeterminationno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'cpaIsReleasedNext12Months',
        groupLabel:
          'Is the individual being released from the custody of a child protective agency within the next 12 months? ',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaIsReleasedNext12Monthsyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'cpaIsReleasedNext12Monthsno' },
        ],
      },
      {
        id: 'cpaAnticipatedDate',
        type: 'date',
        label: 'Anticipated Date',
        disabled: true,
      },
      {
        type: 'radiogroup',
        id: 'cpaHadUnaddressableNeeds',
        groupLabel: 'Does the individual have needs that cannot be addressed through alternative services?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaHadUnaddressableNeedsyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'cpaHadUnaddressableNeedsno' },
        ],
      },
    ],
    adultDayEmployment: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'rwfWaiverFundingRequired',
        groupLabel: 'Does the individual require waiver funding for adult day or employment-related services?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfWaiverFundingRequiredyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'rwfWaiverFundingRequiredno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'rwfNeedsMoreFrequency',
        groupLabel:
          'Are the needed services required at a level or frequency that exceeds what is able to be sustained through local County Board resources',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsMoreFrequencyyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsMoreFrequencyno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'rwfNeedsServiceNotMetIDEA',
        groupLabel:
          'Are thhe needed services beyond what is available to the individual through the local school district / Individuals with Disabilities Education Act?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsServiceNotMetIDEAyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsServiceNotMetIDEAno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'rwfNeedsServiceNotMetOOD',
        groupLabel:
          'Are the needed services beyond what is available to the individual through Vocational Rehabilitation / Opportunities for Ohioans with Disabilities or other resources?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsServiceNotMetOODyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsServiceNotMetOODno' },
        ],
      },
    ],
    dischargePlan: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'dischargeDetermination',
        groupLabel:
          'Does the individual have a viable discharge plan from the current facility in which he / she resides?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeDeterminationyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'dischargeDeterminationno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'dischargeIsICFResident',
        groupLabel: 'Is the individual currently a resident of an ICFIID or Nursing Facility?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeIsICFResidentyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'dischargeIsICFResidentno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'dischargeIsInterestedInMoving',
        groupLabel:
          'Has the individual / guardian expressed an interest in moving to a community-based setting within the next 12 months?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeIsInterestedInMovingyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'dischargeIsInterestedInMovingno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'dischargeHasDischargePlan',
        groupLabel: `Is the individual's team developing a discharge plan that addresses barries to community living, such as housing and availability of providers?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeHasDischargePlanyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'dischargeHasDischargePlanno' },
        ],
      },
    ],
    immediateNeeds: [
      {
        type: 'radiogroup',
        id: 'immNeedsRequired',
        groupLabel: `Is there an immediate need identified that requires an action plan with 30 days to reduce the risk?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'immNeedsRequiredyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'immNeedsRequiredno' },
        ],
      },
      {
        label: `if "Yes", describe the immediate need:`,
        id: 'immNeedsDescription',
        fullscreen: true,
        type: 'textarea',
      },
    ],
    currentNeeds: [
      {
        disabled: true,
        type: 'radiogroup',
        id: 'unmetNeedsHas',
        groupLabel: 'Does the individual have an identified need?',
        note: 'This field is filled out by AI',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'unmetNeedsHasyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'unmetNeedsHasno' },
        ],
      },
      {
        type: 'radiogroup',
        id: 'unmetNeedsSupports',
        groupLabel: `If "Yes", will any of those needs be unmet by existing supports / resources within the next 12 months?`,
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'unmetNeedsSupportsyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'unmetNeedsSupportsno' },
        ],
        disabled: true,
      },
      {
        label: `if "Yes", describe the unmet need:`,
        id: 'unmetNeedsDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
    ],
    waiverEnrollment: [
      {
        type: 'radiogroup',
        id: 'waivEnrollWaiverEnrollmentIsRequired',
        groupLabel:
          'Will the unmet immediate need or unmet current need require enrollment in a waiver due to the lack of community-based alternative services to address the need?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'waivEnrollWaiverEnrollmentIsRequiredyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'waivEnrollWaiverEnrollmentIsRequiredno' },
        ],
      },
      {
        label: `If "No", describe the community-based alternative services that can address the unmet need:`,
        id: 'waivEnrollWaiverEnrollmentDescription',
        fullscreen: true,
        type: 'textarea',
        disabled: true,
      },
    ],
  };

  // EVENTS
  //--------------------------------------------------
  async function onReviewAssessmentBtnClick() {
    WaitingListOverview.init({
      wlData,
      moduleWrapEle: moduleWrap,
      moduleHeaderEle: moduleHeader,
      moduleBodyEle: moduleBody,
      consumerId: selectedConsumer ? selectedConsumer : '',
    });
  }
  async function onConsumerSelect(data) {
    selectedConsumer = data[0];

    rosterPicker.toggleRosterDisabled(true, true);

    const resp = await wlData.insertWaitingListAssessment(selectedConsumer);
    wlLinkID = resp[0].newRecordId;
    wlFormInfo['waitingListInfo'].id = wlLinkID;
  }
  function riskMitigationCheckboxes({ name, value, formName }) {
    const data = [
      wlForms[formName].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
      wlForms[formName].inputs['rMIsCountyBoardInvestigation'].getValue(),
      wlForms[formName].inputs['rMIsLawEnforcementInvestigation'].getValue(),
      wlForms[formName].inputs['rMIsOtherInvestigation'].getValue(),
    ];
    const hasCheck = data.some(element => element === true);

    // (ENABLE) [rMdescription] the "Describe incident under..." textbox (IF)
    // any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
    wlForms[formName].inputs['rMdescription'].toggleDisabled(!hasCheck);
    // (ENABLE) [rMIsActionRequiredIn3oDays] the "Is action required..." radio buttons (IF)
    // any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
    wlForms[formName].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(!hasCheck);
  }
  function behavioralNeedsCheckboxes({ name, value, formName }) {
    const checkboxGroupOne = [
      wlForms[formName].inputs['risksIsPhysicalAggression'].getValue(),
      wlForms[formName].inputs['risksIsSelfInjury'].getValue(),
      wlForms[formName].inputs['risksIsFireSetting'].getValue(),
      wlForms[formName].inputs['risksIsElopement'].getValue(),
      wlForms[formName].inputs['risksIsSexualOffending'].getValue(),
      wlForms[formName].inputs['risksIsOther'].getValue(),
    ];

    const checkboxGroupTwo = [
      wlForms[formName].inputs['risksHasPoliceReport'].getValue(),
      wlForms[formName].inputs['risksHasIncidentReport'].getValue(),
      wlForms[formName].inputs['risksHasBehaviorTracking'].getValue(),
      wlForms[formName].inputs['risksHasPsychologicalAssessment'].getValue(),
      wlForms[formName].inputs['risksHasOtherDocument'].getValue(),
    ];

    const hasCheckGroupOne = checkboxGroupOne.some(element => element === true);
    const hasCheckGroupTwo = checkboxGroupTwo.some(element => element === true);

    // (ENABLE) [risksFrequencyDescription] the "Describe type, frequency, and intensity of behavioral..." textbox (IF)
    // any of the checkboxes are checked in the first group of checkboxes EXCEPT the "Not applicable...checkbox"
    wlForms[formName].inputs['risksFrequencyDescription'].toggleDisabled(!hasCheckGroupOne);
    // (ENABLE) [risksOtherDocumentDescription] the second textbox (under the second group of checkboxes" as long as the "Other" checkbox is checked in the second group of checkboxes.
    wlForms[formName].inputs['risksOtherDocumentDescription'].toggleDisabled(
      wlForms[formName].inputs['risksHasOtherDocument'].getValue() === true ? false : true,
    );
    // (ENABLE) [needsIsActionRequiredRequiredIn30Days] the "Is action required within the next 30 days..." radio buttons only (IF)
    //  A checkbox is checked in each of the first two groups of checkboxes (not including the "Not applicable…" checkboxes in each group)
    wlForms[formName].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(
      !hasCheckGroupOne && !hasCheckGroupTwo,
    );
    // (SET) [risksIsRiskToSelf] "Is the individual a child / adult currently engaging..." to "YES" (IF)
    // There is at least one checkbox checked in each of the first two groups of checkboxes NOT including the "Not applicable…" checkboxes
    const inputId = hasCheckGroupOne && hasCheckGroupTwo ? 'risksIsRiskToSelfyes' : 'risksIsRiskToSelfno';
    wlForms[formName].inputs['risksIsRiskToSelf'].setValue(inputId);
  }
  function physicalNeedsCheckboxes({ name, value, formName }) {
    const data = [
      wlForms[formName].inputs['physicalNeedsIsPersonalCareNeeded'].getValue(),
      wlForms[formName].inputs['physicalNeedsIsRiskDuringPhysicalCare'].getValue(),
      wlForms[formName].inputs['physicalNeedsIsOther'].getValue(),
    ];
    const hasCheck = data.some(element => element === true);

    // (ENABLE) [physicalNeedsDescription] the "Describe type, frequency, and intensity of physical..." textbox (IF)
    // any of the checkboxes are checked in the third group of checkboxes EXCEPT the "Not applicable...checkbox"
    wlForms[formName].inputs['physicalNeedsDescription'].toggleDisabled(!hasCheck);
    // (ENABLE) [needsIsActionRequiredRequiredIn30Days] the "Is action required within the next 30 days..." radio buttons only (IF)
    // A checkbox is checked in the third group of checkboxes (not including the "Not applicable…" checkbox)
    wlForms[formName].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(!hasCheck);
    // (SET) [physicalNeedsIsPhysicalCareNeeded] "Is the individual a child/adult with significant physical care needs?" to "YES" (IF)
    // There is at least one checkbox checked in the third group of checkboxes NOT including the "Not applicable…" checkboxes
    const inputId = hasCheck ? 'physicalNeedsIsPhysicalCareNeededyes' : 'physicalNeedsIsPhysicalCareNeededno';
    wlForms[formName].inputs['physicalNeedsIsPhysicalCareNeeded'].setValue(inputId);
  }
  function medicalNeedsCheckboxes({ name, value, formName }) {
    const data = [
      wlForms[formName].inputs['medicalNeedsIsFrequentEmergencyVisit'].getValue(),
      wlForms[formName].inputs['medicalNeedsIsOngoingMedicalCare'].getValue(),
      wlForms[formName].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].getValue(),
      wlForms[formName].inputs['medicalNeedsIsOther'].getValue(),
    ];
    const hasCheck = data.some(element => element === true);

    // (ENABLE) [medicalNeedsDescription] the "Describe type, frequency, and intensity of medical..." textbox (IF)
    // any of the checkboxes are checked in the fourth group of checkboxes EXCEPT the "Not applicable..." checkbox
    wlForms[formName].inputs['medicalNeedsDescription'].toggleDisabled(!hasCheck);
    // (ENABLE) [needsIsActionRequiredRequiredIn30Days] the "Is action required within the next 30 days..." radio buttons only (IF)
    // A checkbox is checked in the fourth group of checkboxes (not including the "Not applicable…" checkbox)
    wlForms[formName].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(!hasCheck);
    // (SET) [medicalNeedsIsLifeThreatening] "Is the individual a child/adult with significant or life-threatening medical needs?" to "YES" (IF)
    // There is at least one checkbox checked in the fourth group of checkboxes NOT including the "Not applicable…" checkboxes
    const inputId = hasCheck ? 'medicalNeedsIsLifeThreateningyes' : 'medicalNeedsIsLifeThreateningno';
    wlForms[formName].inputs['medicalNeedsIsLifeThreatening'].setValue(inputId);
  }
  function intermittentSupportsDetermination({ name, value, formName }) {
    // AI FIELD
    // (SET) [intSupDetermination] "Does the individual have an..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
    const data = [
      wlForms[formName].inputs['intSupIsSupportNeededIn12Months'].getValue('intSupIsSupportNeededIn12Monthsyes'),
      wlForms[formName].inputs['intSupIsStayingLivingArrangement'].getValue('intSupIsStayingLivingArrangementyes'),
      wlForms[formName].inputs['intSupIsActionRequiredIn30Days'].getValue('intSupIsActionRequiredIn30Daysyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'intSupDeterminationyes' : 'intSupDeterminationno';
    wlForms[formName].inputs['intSupDetermination'].setValue(inputId);
  }
  function icfDischargeDetermination({ name, value, formName }) {
    // AI FIELD
    // (SET) [icfDetermination] "Is the individual a resident..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
    const data = [
      wlForms[formName].inputs['icfIsICFResident'].getValue('icfIsICFResidentyes'),
      wlForms[formName].inputs['icfIsNoticeIssued'].getValue('icfIsNoticeIssuedyes'),
      wlForms[formName].inputs['icfIsActionRequiredIn30Days'].getValue('icfIsActionRequiredIn30Days'),
    ];
    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'icfDeterminationyes' : 'icfDeterminationno';
    wlForms[formName].inputs['icfDetermination'].setValue(inputId);
  }
  function childProtectionAgencyDetermination({ name, value, formName }) {
    // AI FIELD
    // (SET) [cpaDetermination] "Is the individual reaching..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
    const data = [
      wlForms[formName].inputs['cpaIsReleasedNext12Months'].getValue('cpaIsReleasedNext12Monthsyes'),
      wlForms[formName].inputs['cpaHadUnaddressableNeeds'].getValue('cpaHadUnaddressableNeedsyes'),
    ];
    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'cpaDeterminationyes' : 'cpaDeterminationno';
    wlForms[formName].inputs['cpaDetermination'].setValue(inputId);
  }
  function adultDayEmploymentDetermination({ name, value, formName }) {
    // AI FIELD
    // (SET) [rwfWaiverFundingRequired] "Does the individual require..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
    const data = [
      wlForms[formName].inputs['rwfNeedsMoreFrequency'].getValue('rwfNeedsMoreFrequencyyes'),
      wlForms[formName].inputs['rwfNeedsServiceNotMetIDEA'].getValue('rwfNeedsServiceNotMetIDEAyes'),
      wlForms[formName].inputs['rwfNeedsServiceNotMetOOD'].getValue('rwfNeedsServiceNotMetOODyes'),
    ];
    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'rwfWaiverFundingRequiredyes' : 'rwfWaiverFundingRequiredno';
    wlForms[formName].inputs['rwfWaiverFundingRequired'].setValue(inputId);
  }
  function dischargePlanDetermination({ name, value, formName }) {
    // AI FIELD
    // (SET) [dischargeDetermination] "Does the individual have a viable..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
    const data = [
      wlForms[formName].inputs['dischargeIsICFResident'].getValue('dischargeIsICFResidentyes'),
      wlForms[formName].inputs['dischargeIsInterestedInMoving'].getValue('dischargeIsInterestedInMovingyes'),
      wlForms[formName].inputs['dischargeHasDischargePlan'].getValue('dischargeHasDischargePlanyes'),
    ];
    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'dischargeDeterminationyes' : 'dischargeDeterminationno';
    wlForms[formName].inputs['dischargeDetermination'].setValue(inputId);
  }
  function immediateNeedsDetermination({ name, value, formName }) {
    // AI FIELD ??
    // (SET) [immNeedsRequired] "Is there an immediate need..." to YES only when the page is enabled.  Otherwise, set it to NO
    wlForms[formName].inputs['immNeedsRequired'].setValue();
  }
  const onChangeCallbacks = {
    //* waitingListInfo
    currentLivingArrangement: ({ name, value, formName }) => {
      // (ENABLE) [] the "Other Living Arrangement" field only (IF) [currentLivingArrangement] "Other" is selected in the "Describe Current Living Arrangement" drodown
      const data = wlForms[formName].inputs['currentLivingArrangement'].getValue();
      wlForms[formName].inputs['livingArrangementOther'].toggleDisabled(data === '0' ? false : true);
    },
    //* currentAvailableServices
    isOtherService: ({ name, value, formName, id }) => {
      // (ENABLE) [otherDescription] the text field under "Other" only (IF) [isOtherService] the answer is "Yes" to Other
      const isYesChecked = wlForms[formName].inputs['isOtherService'].getValue('isOtherServiceyes');
      wlForms[formName].inputs['otherDescription'].toggleDisabled(!isYesChecked);
    },
    //* primaryCaregiver
    isPrimaryCaregiverUnavailable: ({ name, value, formName }) => {
      // (ENABLE) [unavailableDocumentation] "List documentation used to verify presence of declining..."  (IF) [isPrimaryCaregiverUnavailable] question above it is "Yes"
      // (ENABLE) [isActionRequiredIn30Days] "Is action required..." radio buttons                         (IF) [isPrimaryCaregiverUnavailable] "Is there evidence that the primary caregiver..." question is "Yes"
      // (ENABLE) [isIndividualSkillsDeclined] "Is there evidence of declining..."                         (IF) [isPrimaryCaregiverUnavailable] "Is there evidence that the primary caregiver..." answer is "No".
      const isYesChecked = wlForms[formName].inputs['isPrimaryCaregiverUnavailable'].getValue(
        'isPrimaryCaregiverUnavailableyes',
      );
      const isNoChecked = wlForms[formName].inputs['isPrimaryCaregiverUnavailable'].getValue(
        'isPrimaryCaregiverUnavailableno',
      );
      wlForms[formName].inputs['unavailableDocumentation'].toggleDisabled(!isYesChecked);
      wlForms[formName].inputs['isActionRequiredIn30Days'].toggleDisabled(!isYesChecked);
      wlForms[formName].inputs['isIndividualSkillsDeclined'].toggleDisabled(!isNoChecked);
    },
    isActionRequiredIn30Days: ({ name, value, formName }) => {
      // (ENABLE) [actionRequiredDescription] "Describe action required." textbox (IF) [isActionRequiredIn30Days] "Is action required..." question is "Yes"
      const isYesChecked = wlForms[formName].inputs['isActionRequiredIn30Days'].getValue('isActionRequiredIn30Daysyes');
      wlForms[formName].inputs['actionRequiredDescription'].toggleDisabled(!isYesChecked);
    },
    isIndividualSkillsDeclined: ({ name, value, formName }) => {
      // (ENABLE) [declinedSkillsDocumentation] "List documentation used to verify presence..." textbox  (IF) [isIndividualSkillsDeclined] "Is there evidence of declining..." question is "Yes".
      // (ENABLE) [declinedSkillsDescription] "Describe decline." textbox                                (IF) [isIndividualSkillsDeclined] "Is there evidence of declining..." question is "Yes".
      const isYesChecked = wlForms[formName].inputs['isIndividualSkillsDeclined'].getValue(
        'isIndividualSkillsDeclinedyes',
      );
      wlForms[formName].inputs['declinedSkillsDocumentation'].toggleDisabled(!isYesChecked);
      wlForms[formName].inputs['declinedSkillsDescription'].toggleDisabled(!isYesChecked);
    },
    //* needs
    // (IF) "Is action required within the next 30 days..." radio buttons are disabled, the value of "No" should be selected, and the user should not be able to change it or delete it.
    // (IF) "If No, do the significant..." radio buttons are disabled, the value of "No" should be selected, and the user should not be able to change it or delete it.
    // behavioral checkbox group 1
    risksIsPhysicalAggression: behavioralNeedsCheckboxes,
    risksIsSelfInjury: behavioralNeedsCheckboxes,
    risksIsFireSetting: behavioralNeedsCheckboxes,
    risksIsElopement: behavioralNeedsCheckboxes,
    risksIsSexualOffending: behavioralNeedsCheckboxes,
    risksIsOther: behavioralNeedsCheckboxes,
    // behavioral checkbox group 2
    risksHasPoliceReport: behavioralNeedsCheckboxes,
    risksHasIncidentReport: behavioralNeedsCheckboxes,
    risksHasBehaviorTracking: behavioralNeedsCheckboxes,
    risksHasPsychologicalAssessment: behavioralNeedsCheckboxes,
    risksHasOtherDocument: behavioralNeedsCheckboxes,
    // physical checkbox group
    physicalNeedsIsPersonalCareNeeded: physicalNeedsCheckboxes,
    physicalNeedsIsRiskDuringPhysicalCare: physicalNeedsCheckboxes,
    physicalNeedsIsOther: physicalNeedsCheckboxes,
    // medical checkbox group
    medicalNeedsIsFrequentEmergencyVisit: medicalNeedsCheckboxes,
    medicalNeedsIsOngoingMedicalCare: medicalNeedsCheckboxes,
    medicalNeedsIsSpecializedCareGiveNeeded: medicalNeedsCheckboxes,
    medicalNeedsIsOther: medicalNeedsCheckboxes,
    // needs other section
    needsIsActionRequiredRequiredIn30Days: ({ name, value, formName }) => {
      // (ENABLE) [needsIsContinuousSupportRequired] the "If No, do the significant..." radio buttons only (IF) the following are ALL true:
      // needsIsActionRequiredRequiredIn30Days
      //   a. The "Is action required within the next 30 days…" radio buttons are enabled AND
      //   b.  The answer to "Is action required within the next 30 days…" is "No"
      const isNoChecked = wlForms[formName].inputs['needsIsActionRequiredRequiredIn30Days'].getValue(
        'needsIsActionRequiredRequiredIn30Daysno',
      );
      wlForms[formName].inputs['needsIsContinuousSupportRequired'].toggleDisabled(!isNoChecked);
    },
    //* riskMitigation
    rMIsActionRequiredIn3oDays: ({ name, value, formName }) => {
      // (SET) [rMIsSupportNeeded] "Is the individual an adult who..." to "YES"
      // (IF) [rMIsActionRequiredIn3oDays] the "Is action required..." radio button at the bottom of the page is set to "YES".Otherwise, set to "NO"
      const isYesChecked = wlForms[formName].inputs['rMIsActionRequiredIn3oDays'].getValue(
        'rMIsActionRequiredIn3oDaysyes',
      );

      wlForms[formName].inputs['rMIsSupportNeeded'].setValue();
    },
    rMIsAdultProtectiveServiceInvestigation: riskMitigationCheckboxes,
    rMIsCountyBoardInvestigation: riskMitigationCheckboxes,
    rMIsLawEnforcementInvestigation: riskMitigationCheckboxes,
    rMIsOtherInvestigation: riskMitigationCheckboxes,
    //* icfDischarge [AI]
    icfIsICFResident: icfDischargeDetermination,
    icfIsNoticeIssued: icfDischargeDetermination,
    icfIsActionRequiredIn30Days: icfDischargeDetermination,
    //* intermittentSupports [AI]
    intSupIsSupportNeededIn12Months: intermittentSupportsDetermination,
    intSupIsStayingLivingArrangement: intermittentSupportsDetermination,
    intSupIsActionRequiredIn30Days: intermittentSupportsDetermination,
    //* childProtectionAgency [AI]
    cpaIsReleasedNext12Months: ({ name, value, formName }) => {
      // (ENABLE) [cpaAnticipatedDate] the "Anticipated Date" field only
      // (IF) [cpaIsReleasedNext12Months] "Is individual being released..." is answered "Yes".
      const isYesChecked =
        wlForms[formName].inputs['cpaIsReleasedNext12Months'].getValue('cpaIsReleasedNext12Monthsyes');
      wlForms[formName].inputs['cpaAnticipatedDate'].toggleDisabled(!isYesChecked);
    },
    cpaIsReleasedNext12Months: childProtectionAgencyDetermination,
    cpaHadUnaddressableNeeds: childProtectionAgencyDetermination,
    //* adultDayEmployment [AI]
    rwfNeedsMoreFrequency: adultDayEmploymentDetermination,
    rwfNeedsServiceNotMetIDEA: adultDayEmploymentDetermination,
    rwfNeedsServiceNotMetOOD: adultDayEmploymentDetermination,
    //* dischargePlan [AI]
    dischargeIsICFResident: dischargePlanDetermination,
    dischargeIsInterestedInMoving: dischargePlanDetermination,
    dischargeHasDischargePlan: dischargePlanDetermination,
    //TODO-ASH: immediateNeeds [AI??]
    TODO6: ({ name, value, formName }) => {},
    //* currentNeeds
    unmetNeedsSupports: ({ name, value, formName }) => {
      // (ENABLE) [unmetNeedsDescription] "If 'Yes', describe the unmet need:" text box only
      // (IF)[unmetNeedsSupports] "If 'Yes', will any of those needs..." is YES
      const isYesChecked = wlForms[formName].inputs['unmetNeedsSupports'].getValue('unmetNeedsSupportsyes');
      wlForms[formName].inputs['unmetNeedsDescription'].toggleDisabled(isYesChecked);
    },
    unmetNeedsHas: ({ name, value, formName }) => {
      // (ENABLE) [unmetNeedsSupports] "If 'Yes', will any of those needs..." only
      // (IF)[unmetNeedsHas] "Does the individual have an identified need?" is YES
      const isYesChecked = wlForms[formName].inputs['unmetNeedsHas'].getValue('unmetNeedsHasyes');
      wlForms[formName].inputs['unmetNeedsSupports'].toggleDisabled(isYesChecked);
    },
    // (SET) [unmetNeedsHas] "Does the individual have an identified need?" to YES only when one of the following is true:
    //   a. ("Is there evidence that the primary…" is YES (AND) "Is action required…" is NO on the Primary Caregiver page) { OR }
    //      ("Is there evidence of declining…" is NO (AND) "Is there evidence of declining skills…" is YES on the Primary Caregiver page)
    //
    //   b. ("Is the individual a child/adult currently engaging…" is YES on the Needs page { OR }
    //      ("Is the individual a child/adult with significant physical…" is YES on the Needs page { OR }
    //      ("Is the individual a child/adult with significant { OR }
    //      (life- threatening…" is YES on the Needs page) (AND) ("If No, do the significant behavioral, physical care, and / or medical needs…" is YES on the Needs page)
    //
    //   c. "Does the individual have an ongoing need…" is YES on the Intermittent Supports page
    //   d. "Is the individual reaching the age…" is YES on the Child Protection Agency page
    //   e. "Does the individual require funding…" is YES on the Adult Day/Employment page
    //   f. "Does the individual have a viable…" is YES on the Discharge Plan page
    //* waiverEnrollment
    waivEnrollWaiverEnrollmentIsRequired: ({ name, value, formName }) => {
      // (ENABLE) [waivEnrollWaiverEnrollmentDescription] the "If 'No', describe the...' textbox only
      // (IF)[waivEnrollWaiverEnrollmentIsRequired] "Will the unmet need..." is YES on the same page.
      const isYesChecked = wlForms[formName].inputs['waivEnrollWaiverEnrollmentIsRequired'].getValue(
        'waivEnrollWaiverEnrollmentIsRequiredyes',
      );
      wlForms[formName].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(isYesChecked);
    },
  };
  function updatePageActiveStatus() {
    const conditionsInputValues = [
      wlForms['conditions'].inputs['otherThanMentalHealth'].getValue('otherThanMentalHealthyes'),
      wlForms['conditions'].inputs['before22'].getValue('before22yes'),
      wlForms['conditions'].inputs['isConditionIndefinite'].getValue('isConditionIndefiniteyes'),
    ];

    if (!conditionsInputValues.every(element => element === true)) {
      // conditions page inputs are NOT all YES
      let formsToDelete = [];

      [
        'needs',
        'waiverEnrollment',
        'riskMitigation',
        'icfDischarge',
        'intermittentSupports',
        'childProtectionAgency',
        'adultDayEmployment',
        'dischargePlan',
        'immediateNeeds',
        'currentNeeds',
      ].forEach(formName => {
        // hide form
        wlForms[formName].form.parentElement.classList.add('hiddenPage');

        // needs is special
        if (formName === 'needs') {
          if (wlFormInfo.needs.behavioral.id) {
            formsToDelete.push(`${wlFormInfo.needs.behaviorl.id}|${wlFormInfo.needs.behaviorl.dbtable}`);
            wlFormInfo.needs.behavioral.id = '';
          }
          if (wlFormInfo.needs.physical.id) {
            formsToDelete.push(`${wlFormInfo.needs.physical.id}|${wlFormInfo.needs.physical.dbtable}`);
            wlFormInfo.needs.physical.id = '';
          }
          if (wlFormInfo.needs.medical.id) {
            formsToDelete.push(`${wlFormInfo.needs.medical.id}|${wlFormInfo.needs.medical.dbtable}`);
            wlFormInfo.needs.medical.id = '';
          }
          if (wlFormInfo.needs.other.id) {
            formsToDelete.push(`${wlFormInfo.needs.other.id}|${wlFormInfo.needs.other.dbtable}`);
            wlFormInfo.needs.other.id = '';
          }
        } else {
          if (wlFormInfo[formName].id) {
            formsToDelete.push(`${wlFormInfo[formName].id}|${wlFormInfo[formName].dbtable}`);
            wlFormInfo[formName].id = '';
          }
        }

        //TODO-ASH: delete forms formsToDelete
      });

      return;
    }

    // conditions page all inputs are yes
    wlForms['needs'].form.parentElement.classList.add('hiddenPage');
    wlForms['waiverEnrollment'].form.parentElement.classList.add('hiddenPage');

    //-------------------------------------------------------------------------------------------------------
    const needsIsActionRequiredRequiredIn30DaysYES = wlForms['conditions'].inputs[
      'needsIsActionRequiredRequiredIn30Days'
    ].getValue('needsIsActionRequiredRequiredIn30Daysyes');
    const needsIsActionRequiredRequiredIn30DaysNO = wlForms['conditions'].inputs[
      'needsIsActionRequiredRequiredIn30Days'
    ].getValue('needsIsActionRequiredRequiredIn30Daysno');
    const rMIsActionRequiredIn3oDaysYES = wlForms['conditions'].inputs['rMIsActionRequiredIn3oDays'].getValue(
      'rMIsActionRequiredIn3oDaysyes',
    );
    const rMIsActionRequiredIn3oDaysNO =
      wlForms['conditions'].inputs['rMIsActionRequiredIn3oDays'].getValue('rMIsActionRequiredIn3oDaysno');
    const riskMitigationCheckboxValues = [
      wlForms[formName].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
      wlForms[formName].inputs['rMIsCountyBoardInvestigation'].getValue(),
      wlForms[formName].inputs['rMIsLawEnforcementInvestigation'].getValue(),
      wlForms[formName].inputs['rMIsOtherInvestigation'].getValue(),
    ];

    // needs page [needsIsActionRequiredRequiredIn30Days] is YES
    if (needsIsActionRequiredRequiredIn30DaysYES) {
      wlForms['riskMitigation'].form.parentElement.classList.remove('hiddenPage');
    } else {
      wlForms['riskMitigation'].form.parentElement.classList.add('hiddenPage');
    }

    // riskMitigation page [rMIsActionRequiredIn3oDays] is YES
    if (rMIsActionRequiredIn3oDays) {
      wlForms['icfDischarge'].form.parentElement.classList.remove('hiddenPage');
      wlForms['intermittentSupports'].form.parentElement.classList.remove('hiddenPage');
      wlForms['childProtectionAgency'].form.parentElement.classList.remove('hiddenPage');
      wlForms['adultDayEmployment'].form.parentElement.classList.remove('hiddenPage');
      wlForms['dischargePlan'].form.parentElement.classList.remove('hiddenPage');
    } else {
      wlForms['icfDischarge'].form.parentElement.classList.add('hiddenPage');
      wlForms['intermittentSupports'].form.parentElement.classList.add('hiddenPage');
      wlForms['childProtectionAgency'].form.parentElement.classList.add('hiddenPage');
      wlForms['adultDayEmployment'].form.parentElement.classList.add('hiddenPage');
      wlForms['dischargePlan'].form.parentElement.classList.add('hiddenPage');
    }

    // needs page [needsIsActionRequiredRequiredIn30Days] is NO ||
    // riskMitigation page [rMIsActionRequiredIn3oDays] is NO
    if (needsIsActionRequiredRequiredIn30DaysNO || rMIsActionRequiredIn3oDaysNO) {
      wlForms['currentNeeds'].form.parentElement.classList.remove('hiddenPage');
    } else {
      wlForms['currentNeeds'].form.parentElement.classList.remove('hiddenPage');
    }
    // needs page [needsIsActionRequiredRequiredIn30Days] is YES ||
    // riskMitigation page [rMIsActionRequiredIn3oDays] is YES &&
    // any checkbox is checked on riskMitigation page except not applicable
    if (
      (needsIsActionRequiredRequiredIn30DaysYES || rMIsActionRequiredIn3oDaysYES) &&
      riskMitigationCheckboxValues.some(element => element === true)
    ) {
      wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
    } else {
      wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
    }
  }
  const onChangeCallbacksFormWatch = {
    conditions: updatePageActiveStatus,
    needs: updatePageActiveStatus,
    riskMitigation: updatePageActiveStatus,
  };
  function onFormChange(form) {
    const formName = form;

    return async function inputChange(event) {
      const value = event.target.value;
      const name = event.target.name;
      const id = event.target.id;

      if (onChangeCallbacks[name]) {
        onChangeCallbacks[name]({
          value,
          name,
          formName,
          id,
        });
      }

      if (onChangeCallbacksFormWatch[formName]) {
        onChangeCallbacksFormWatch[formName]({
          value,
          name,
          formName,
        });
      }

      // Save/Update
      if (wlFormInfo[formElement].id === '') {
        wlFormInfo[formElement].id = await wlData.insertAssessmentData({
          id: 0,
          linkId: wlLinkID,
          propertyName: name,
          value: value,
        });
      } else {
        await wlData.updateAssessmentData({
          id: wlFormInfo[formElement].id,
          linkId: formName === 'waitingListInfo' ? 0 : wlLinkID,
          propertyName: name,
          value: value,
        });
      }
    };
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    rosterPicker.onConsumerSelect(onConsumerSelect);
    reviewAssessmentBtn.onClick(onReviewAssessmentBtnClick);
    sendEmailButton.onClick(async () => {
      const resp = await _UTIL.fetchData('generateWaitingListAssessmentReport', {
        waitingListId: '10',
      });

      if (resp !== '1') return;

      const resp2 = await _UTIL.fetchData('sendWaitingListAssessmentReport', {
        header: 'Test header for WLID: 10',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu orci, cursus sit amet nunc nec, faucibus cursus metus. Suspendisse potenti. Curabitur blandit mauris ac tempor vulputate. ',
      });
    });
    documentsButton.onClick(() => {});
  }
  function loadPage() {
    // ROSTER PICKER
    reviewAssessmentBtn.renderTo(moduleHeader);
    sendEmailButton.renderTo(moduleHeader);
    documentsButton.renderTo(moduleHeader);

    // FORMS
    for (formElement in formElements) {
      if (formElements[formElement].length === 0) continue;

      const formWrap = _DOM.createElement('div', { id: formElement, class: 'wlPage' });
      const formHeader = _DOM.createElement('h2', { text: _UTIL.convertCamelCaseToTitle(formElement) });
      formWrap.appendChild(formHeader);
      assessmentWrap.appendChild(formWrap);

      if (!wlFormInfo[formElement].enabled) {
        formWrap.classList.add('hiddenPage');
      }

      wlForms[formElement] = new Form({
        hideAllButtons: true,
        fields: formElements[formElement],
        formName: formElement,
      });

      wlForms[formElement].renderTo(formWrap);

      wlForms[formElement].onChange(onFormChange(formElement));

      if (formElement === 'needs') {
        wlFormInfo.needs.behavioral.id = '';
        wlFormInfo.needs.physical.id = '';
        wlFormInfo.needs.medical.id = '';
        wlFormInfo.needs.other.id = '';
      } else {
        wlFormInfo[formElement].id = '';
      }
    }

    const tableWrap = _DOM.createElement('div', { id: 'participants', class: 'wlPage' });
    const header = _DOM.createElement('h2', { text: 'Participants' });
    tableWrap.appendChild(header);
    participantsTable.renderTo(tableWrap);
    assessmentWrap.appendChild(tableWrap);

    // ROSTER PICKER
    rosterPicker.renderTo(rosterWrap);
  }
  function loadPageSkeleton() {
    moduleHeader.innerHTML = '';
    moduleBody.innerHTML = '';

    assessmentWrap = _DOM.createElement('div', { class: 'waitingListAssessment' });
    rosterWrap = _DOM.createElement('div', { class: 'waitingListRoster' });

    moduleBody.appendChild(assessmentWrap);
    moduleBody.appendChild(rosterWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  function initFormInfo() {
    return {
      adultDayEmployment: { enabled: false, dbtable: 'WLA_Require_Waiver_Fundings' },
      childProtectionAgency: { enabled: false, dbtable: 'WLA_Child_Protection_Agencies' },
      conditions: { enabled: true, dbtable: 'WLA_Conditions' },
      currentAvailableServices: { enabled: false, dbtable: 'WLA_Active_Services' },
      currentNeeds: { enabled: false, dbtable: 'WLA_Unmet_Needs' },
      dischargePlan: { enabled: false, dbtable: 'WLA_Discharge_Plans' },
      icfDischarge: { enabled: false, dbtable: 'WLA_ICF_Discharges' },
      intermittentSupports: { enabled: false, dbtable: 'WLA_Intermitent_Supports' },
      immediateNeeds: { enabled: false, dbtable: 'WLA_Immediate_Needs' },
      primaryCaregiver: { enabled: true, dbtable: 'WLA_Primary_Caregivers' },
      riskMitigation: { enabled: false, dbtable: 'WLA_Risk_Mitigations' },
      waitingListInfo: { enabled: true, dbtable: 'WLA_Waiting_List_Information' },
      waiverEnrollment: { enabled: false, dbtable: 'WLA_Waiver_Enrollments' },
      needs: {
        enabled: false,
        behavioral: { dbtable: 'WLA_Risks' },
        physical: { dbtable: 'WLA_Physical_Needs' },
        medical: { dbtable: 'WLA_Medical_Needs' },
        other: { dbtable: 'WLA_Needs' },
      },
      //------
    };
  }
  function initComponents() {
    participantsTable = new Table({
      columnSortable: true,
      headings: [
        {
          text: 'Name of Participant',
          type: 'string',
        },
        {
          text: 'Relationship to Individual',
          type: 'string',
        },
      ],
    });

    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
      consumerRequired: true,
    });

    reviewAssessmentBtn = new Button({
      text: 'Review Assessments',
      style: 'primary',
      styleType: 'contained',
    });

    sendEmailButton = new Button({
      text: 'Send Email',
      style: 'primary',
      styleType: 'contained',
    });

    documentsButton = new Button({
      text: 'Add New Documentation',
      style: 'primary',
      styleType: 'contained',
    });
  }

  async function init(data) {
    wlForms = {};
    wlFormInfo = initFormInfo();
    wlData = data.wlData;
    moduleWrap = data.moduleWrapEle;
    moduleHeader = data.moduleHeaderEle;
    moduleBody = data.moduleBodyEle;

    loadPageSkeleton();
    initComponents();
    loadPage();

    await rosterPicker.fetchConsumers();
    rosterPicker.populate();

    attachEvents();
  }

  return { init, formElements };
})();
