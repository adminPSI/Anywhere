const WaitingListAssessment = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer = null;
  let lockdownRosterPicker = false;
  //--------------------------
  // PERMISSIONS
  //--------------------------
  let isReadOnly;
  //--------------------------
  // DOM
  //--------------------------
  let formWrap;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlForms = {};
  let rosterPicker;
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
      },
      // OTHER
      {
        type: 'radiogroup',
        id: 'needsIsActionRequiredRequiredIn30Days',
        groupLabel: 'Is the individual a child / adult with significant physical care needs?',
        fields: [
          { type: 'radio', label: 'Yes', value: 'yes', id: 'needsIsActionRequiredRequiredIn30Daysyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'needsIsActionRequiredRequiredIn30Daysno' },
        ],
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
      },
      {
        label: `if "Yes", describe the unmet need:`,
        id: 'unmetNeedsDescription',
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
          { type: 'radio', label: 'Yes', value: 'yes', id: 'waivEnrollWaiverEnrollmentIsRequiredyes' },
          { type: 'radio', label: 'No', value: 'no', id: 'waivEnrollWaiverEnrollmentIsRequiredno' },
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

  // EVENTS
  //--------------------------------------------------
  async function onConsumerSelect(data) {
    selectedConsumer = data[0];
  }
  const onChangeCallbacks = {
    //* currentAvailableServices
    isOtherService: ({ name, value, formName }) => {
      // (ENABLE) [otherDescription] the text field under "Other" only (IF) [isOtherService] the answer is "Yes" to Other
      wlForms[formName].inputs[inputname];
    },
    //* primaryCaregiver
    isPrimaryCaregiverUnavailable: ({ name, value, formName }) => {
      // (ENABLE) [unavailableDocumentation] "List documentation used to verify presence of declining..." textbox   (IF) [isPrimaryCaregiverUnavailable] question above it is "Yes"
      // (ENABLE) [isActionRequiredIn30Days] "Is action required..." radio buttons                                  (IF) [isPrimaryCaregiverUnavailable] "Is there evidence that the primary caregiver..." question is "Yes"
      // (ENABLE) [isIndividualSkillsDeclined] "Is there evidence of declining..."                                  (IF) [isPrimaryCaregiverUnavailable] "Is there evidence that the primary caregiver..." answer is "No".
      wlForms[formName].inputs[inputname];
    },
    isActionRequiredIn30Days: ({ name, value, formName }) => {
      // (ENABLE) [actionRequiredDescription] "Describe action required." textbox                                   (IF) [isActionRequiredIn30Days] "Is action required..." question is "Yes"
      wlForms[formName].inputs[inputname];
    },
    isIndividualSkillsDeclined: ({ name, value, formName }) => {
      // (ENABLE) [declinedSkillsDocumentation] "List documentation used to verify presence..." textbox             (IF) [isIndividualSkillsDeclined] "Is there evidence of declining..." question is "Yes".
      // (ENABLE) [declinedSkillsDescription] "Describe decline." textbox                                           (IF) [isIndividualSkillsDeclined] "Is there evidence of declining..." question is "Yes".
      wlForms[formName].inputs[inputname];
    },
    //* riskMitigation
    rMIsActionRequiredIn3oDays: ({ name, value, formName }) => {
      // (SET) [rMIsSupportNeeded] "Is the individual an adult who..." to "YES" (IF) [rMIsActionRequiredIn3oDays] the "Is action required..." radio button at the bottom of the page is set to "YES".  Otherwise, set to "NO"
      wlForms[formName].inputs[inputname];
    },
    openInvestigation: ({ name, value, formName }) => {
      //! checkbox group need to do something about ids
      // (ENABLE) [rMdescription] the "Describe incident under..." textbox               (IF) [openInvestigation] any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
      // (ENABLE) [rMIsActionRequiredIn3oDays] the "Is action required..." radio buttons (IF) [openInvestigation] any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
      wlForms[formName].inputs[inputname];
    },
    //TODO-ASH: icfDischarge
    TODO: ({ name, value, formName }) => {
      // AI FIELD
      // (SET) [icfDetermination] "Is the individual a resident..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
      //* going to have to check all inputs in form "icfDischarge" before setting below
      wlForms[formName].inputs[inputname];
    },
    //TODO-ASH: intermittentSupports
    TODO2: ({ name, value, formName }) => {
      // AI FIELD
      // (SET) [intSupDetermination] "Does the individual have an..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
      //* going to have to check all inputs in form "intermittentSupports" before setting below
      wlForms[formName].inputs[inputname];
    },
    //TODO-ASH: childProtectionAgency
    TODO3: ({ name, value, formName }) => {
      // AI FIELD
      // (SET) [cpaDetermination] "Is the individual reaching..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
      //* going to have to check all inputs in form "childProtectionAgency" before setting below
      wlForms[formName].inputs[inputname];
    },
    cpaIsReleasedNext12Months: ({ name, value, formName }) => {
      // (ENABLE) [cpaAnticipatedDate] the "Anticipated Date" field only (IF) [cpaIsReleasedNext12Months] "Is individual being released..." is answered "Yes".
      wlForms[formName].inputs[inputname];
    },
    //TODO-ASH: adultDayEmployment
    TODO5: ({ name, value, formName }) => {
      // AI FIELD
      // (SET) [rwfWaiverFundingRequired] "Does the individual require..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
      //* going to have to check all inputs in form "adultDayEmployment" before setting below
      wlForms[formName].inputs[inputname];
    },
    //TODO-ASH: dischargePlan
    TODO6: ({ name, value, formName }) => {
      // AI FIELD
      // (SET) [dischargeDetermination] "Does the individual have a viable..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"
      //* going to have to check all inputs in form "dischargePlan" before setting below
      wlForms[formName].inputs[inputname];
    },
    //TODO-ASH: immediateNeeds
    TODO6: ({ name, value, formName }) => {
      // (SET) [immNeedsRequired] "Is there an immediate need..." to YES only when the page is enabled.  Otherwise, set it to NO
      wlForms[formName].inputs[inputname];
    },
    //* waiverEnrollment
    waivEnrollWaiverEnrollmentIsRequired: ({ name, value, formName }) => {
      // (ENABLE) [waivEnrollWaiverEnrollmentDescription] the "If 'No', describe the...' textbox only (IF) [waivEnrollWaiverEnrollmentIsRequired] "Will the unmet need..." is YES on the same page.
      wlForms[formName].inputs[inputname];
    },
  };
  function onFormChange(form) {
    const formName = form;

    return function inputChange(event) {
      const value = event.target.value;
      const name = event.target.name;

      if (onChangeCallbacks[name]) {
        console.log(value, name, formName);

        onChangeCallbacks[name]({
          value,
          name,
          formName,
        });
      }
    };
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    rosterPicker.onConsumerSelect(onConsumerSelect);
    reviewAssessmentBtn.onClick(() => {});
  }
  function populateForms() {
    for (form in wlForms) {
      wlForms[form].populate({});
    }
  }
  function loadPage() {
    // FORMS
    for (formElement in formElements) {
      if (formElements[formElement].length === 0) continue;

      const formHeader = _DOM.createElement('h2', { text: _UTIL.convertCamelCaseToTitle(formElement) });

      wlForms[formElement] = new Form({
        hideAllButtons: true,
        fields: formElements[formElement],
        formName: formElement,
      });

      formWrap.appendChild(formHeader);
      wlForms[formElement].renderTo(formWrap);

      wlForms[formElement].onChange(onFormChange(formElement));
    }

    // ROSTER PICKER
    rosterPicker.renderTo(rosterWrap);
  }
  function loadPageSkeleton() {
    // prep actioncenter
    _DOM.ACTIONCENTER.innerHTML = '';

    // build DOM skeleton
    formWrap = _DOM.createElement('div', { class: 'waitingListForm' });
    rosterWrap = _DOM.createElement('div', { class: 'waitingListForm__roster' });

    _DOM.ACTIONCENTER.appendChild(formWrap);
    _DOM.ACTIONCENTER.appendChild(rosterWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  function initComponents() {
    // Roster Picker
    rosterPicker = new RosterPicker({
      allowMultiSelect: false,
      consumerRequired: true,
    });

    reviewAssessmentBtn = new Button({
      text: 'Review Assessments',
      style: 'primary',
      styleType: 'contained',
    });
  }

  async function load() {
    const test = await wlData.insertNewAssessmentInitial(selectedConsumer);
  }

  async function init(wlDataInstance) {
    wlData = wlDataInstance;

    loadPageSkeleton();
    initComponents();
    loadPage();

    await rosterPicker.fetchConsumers();
    rosterPicker.populate();

    attachEvents();
  }

  return { init };
})();
