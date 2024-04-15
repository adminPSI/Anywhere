const WaitingListAssessment = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let selectedConsumer;
  let wlData;
  let wlLinkID;
  let wlCircID;
  let wlNeedID;
  let wlDocuments;
  let wlParticipants;
  //--------------------------
  // PERMISSIONS
  //--------------------------
  let isReadOnly;
  //--------------------------
  // DOM
  //--------------------------
  let assessmentWrap;
  let tableOfContents;
  let contributingCircumstancesWrap;
  let needsWrap;
  let tocLinks;
  let doucmentsList;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlForms;

  let participantsTable;

  let sendEmailButton;
  let sendEmailPopup;
  let sendEmailForm;

  let documentsButton;
  let documentsForm;
  let documentsPopup;

  const sections = {
    waitingListInfo: {
      name: 'Waiting List Information',
      dbtable: 'WLA_Waiting_List_Information',
      enabled: true,
      formElements: [
        {
          id: 'personCompleting',
          label: 'Name of person completing assessment',
          type: 'text',
          required: true,
        },
        {
          id: 'personCompletingTitle',
          label: 'Title of person completing assessment',
          type: 'text',
          required: true,
        },
        {
          id: 'currentLivingArrangement',
          label: 'Describe the current living arrangement',
          type: 'select',
          required: true,
          data: [
            { value: '', text: '' },
            { value: 'Lives Alone', text: 'Lives Alone' },
            { value: 'Lives with Family or Other Caregivers', text: 'Lives with Family or Other Caregivers' },
            { value: 'Lives With Others Who Are Not Caregivers', text: 'Lives With Others Who Are Not Caregivers' },
            { value: 'Lives in an Intermediate Care Facility', text: 'Lives in an Intermediate Care Facility' },
            { value: 'Lives in a Nursing Facility', text: 'Lives in a Nursing Facility' },
            { value: 'Other', text: 'Other' },
          ],
        },
        {
          id: 'livingArrangementOther',
          label: 'Describe Other Living Arrangement',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
        },
        {
          id: 'areasPersonNeedsHelp',
          label: 'In what areas does person report needing help?',
          fullscreen: true,
          type: 'textarea',
          required: true,
        },
      ],
    },
    participants: {
      name: 'Participants',
      enabled: true,
    },
    conditions: {
      name: 'Conditions',
      dbtable: 'WLA_Conditions',
      enabled: true,
      formElements: [
        {
          id: 'otherThanMentalHealth',
          type: 'radiogroup',
          required: true,
          groupLabel: `Does this person have a condition that is attributable to a mental or physical impairment or combination of mental and physical impairments, other than an impairment cuased solely by mental illness?`,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'otherThanMentalHealthyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'otherThanMentalHealthno' },
          ],
        },
        {
          id: 'before22',
          type: 'radiogroup',
          required: true,
          groupLabel: `Was the condition present before age 22?`,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'before22yes' },
            { type: 'radio', label: 'No', value: 'no', id: 'before22no' },
          ],
        },
        {
          id: 'isConditionIndefinite',
          type: 'radiogroup',
          required: true,
          groupLabel: `Is the condition likely to continue indefinitely?`,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isConditionIndefiniteyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isConditionIndefiniteno' },
          ],
        },
      ],
    },
    currentAvailableServices: {
      name: 'Current/Available Services',
      dbtable: 'WLA_Active_Services',
      enabled: false,
      formElements: [
        {
          type: 'radiogroup',
          id: 'isCountyBoardFunding',
          groupLabel: 'County Board services / funding',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isCountyBoardFundingyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isCountyBoardFundingno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isOhioEarlyInterventionService',
          groupLabel: 'Help Me Grow / Ohio Early Intervention',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isOhioEarlyInterventionServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isOhioEarlyInterventionServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isBCMHService',
          groupLabel: 'Bureau for Children with Medical Handicaps',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isBCMHServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isBCMHServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isFCFCService',
          groupLabel: 'Family and Children First Council',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isFCFCServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isFCFCServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isODEService',
          groupLabel: 'Ohio Department of Education',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isODEServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isODEServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isOODService',
          groupLabel: 'Vocational Rehabilitation / Opportunities for Ohioans with Disabilities',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isOODServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isOODServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isChildrenServices',
          groupLabel: 'Children Services',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isChildrenServicesyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isChildrenServicesno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isMedicaidStatePlanHomeHealthAideservice',
          groupLabel: 'Medicaid State Plan Home Health Aide',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isMedicaidStatePlanHomeHealthAideserviceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isMedicaidStatePlanHomeHealthAideserviceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isMedicaidStatePlanHomeHealthNursingService',
          groupLabel: 'Medicaid State Plan Home Health Nursing',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isMedicaidStatePlanHomeHealthNursingServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isMedicaidStatePlanHomeHealthNursingServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isMedicaidStatePlanService',
          groupLabel: 'Medicaid State Plan Private Duty Nursing',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isMedicaidStatePlanServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isMedicaidStatePlanServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isOhioHomeCareWaiverservice',
          groupLabel: 'Ohio Home Care Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isOhioHomeCareWaiverserviceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isOhioHomeCareWaiverserviceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isPassportWaiverService',
          groupLabel: 'PASSPORT Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isPassportWaiverServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isPassportWaiverServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isAssistedLivingWaiverService',
          groupLabel: 'Assisted Living Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isAssistedLivingWaiverServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isAssistedLivingWaiverServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isMYCarewaiverService',
          groupLabel: 'MyCare Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isMYCarewaiverServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isMYCarewaiverServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isSelfWaiverService',
          groupLabel: 'Self-Empowered Life Funding Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isSelfWaiverServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isSelfWaiverServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isLevelOneWaiverService',
          groupLabel: 'Level One Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'isLevelOneWaiverServiceyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'isLevelOneWaiverServiceno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isOtherService',
          groupLabel: 'Other',
          required: true,
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
          required: true,
        },
      ],
    },
    contributingCircumstances: {
      name: 'Contributing Circumstances',
      enabled: false,
      children: [
        'primaryCaregiver',
        'needs',
        'riskMitigation',
        'icfDischarge',
        'intermittentSupports',
        'childProtectionAgency',
        'adultDayEmployment',
        'dischargePlan',
      ],
    },
    primaryCaregiver: {
      name: 'Primary Caregiver',
      dbtable: 'WLA_Primary_Caregivers',
      enabled: false,
      formElements: [
        {
          type: 'radiogroup',
          id: 'isPrimaryCaregiverUnavailable',
          required: true,
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
          required: true,
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
          required: true,
        },
        {
          label: 'Describe the action required:',
          id: 'actionRequiredDescription',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
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
          required: true,
        },
        {
          label: 'Describe decline:',
          id: 'declinedSkillsDescription',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
        },
        {
          label: 'Additional comments:',
          id: 'additionalCommentsForUnavailable',
          fullscreen: true,
          type: 'textarea',
          required: true,
        },
      ],
    },
    needs: {
      name: 'Needs',
      enabled: false,
    },
    behavioral: {
      name: 'Behavioral',
      dbtable: 'WLA_Risks',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'risksIsRiskToSelf',
          groupLabel:
            'Is the individual a child / adult currently engaging in a pattern of behavior that creates a substantial risk to self / others?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'risksIsRiskToSelfyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'risksIsRiskToSelfno' },
          ],
        },
        {
          type: 'checkboxgroup',
          id: 'risksIs',
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
          required: true,
        },
        {
          label: 'Describe type, frequency, and intensity of behavioral needs:',
          id: 'risksFrequencyDescription',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
        },
        {
          type: 'checkboxgroup',
          id: 'risksHas',
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
          required: true,
        },
        {
          label: 'Other:',
          id: 'risksOtherDocumentDescription',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
        },
      ],
    },
    physical: {
      name: 'Physical',
      dbtable: 'WLA_Physical_Needs',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'physicalNeedsIsPhysicalCareNeeded',
          groupLabel: 'Is the individual a child / adult with significant physical care needs?',
          note: 'This will be selected automatically as the information below is entered.',
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
          required: true,
        },
        {
          label: 'Describe type, frequency, and intensity of physical care needs:',
          id: 'physicalNeedsDescription',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
        },
      ],
    },
    medical: {
      name: 'Medical',
      dbtable: 'WLA_Medical_Needs',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'medicalNeedsIsLifeThreatening',
          groupLabel: 'Is the individual a child / adult with significant or life-threatening medical needs?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'medicalNeedsIsLifeThreateningyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'medicalNeedsIsLifeThreateningno' },
          ],
        },
        {
          type: 'checkboxgroup',
          id: 'medicalNeeds',
          required: true,
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
          required: true,
        },
      ],
    },
    other: {
      name: 'Other',
      dbtable: 'WLA_Needs',
      enabled: false,
      formElements: [
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
          required: true,
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
          required: true,
        },
      ],
    },
    riskMitigation: {
      name: 'Risk Mitigation',
      dbtable: 'WLA_Risk_Mitigations',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'rMIsSupportNeeded',
          groupLabel:
            'Is the individual an adult who has been subjected to abuse, neglect, or exploitation and requires support to reduce risk?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rMIsSupportNeededyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rMIsSupportNeededno' },
          ],
        },
        {
          type: 'checkboxgroup',
          id: 'rMIs',
          required: true,
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
          required: true,
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
          required: true,
        },
      ],
    },
    icfDischarge: {
      name: 'ICF Discharge',
      dbtable: 'WLA_ICF_Discharges',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'icfDetermination',
          groupLabel:
            'Is the individual a resident of an ICFIID or Nursing Facility who has either been issued a 30-day notice of intent to discharge or received an adverse Resident Review determination?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'icfDeterminationyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'icfDeterminationno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'icfIsICFResident',
          required: true,
          groupLabel: 'Is the individual currently a resident of an ICFIID or Nursing Facility?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'icfIsICFResidentyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'icfIsICFResidentno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'icfIsNoticeIssued',
          required: true,
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
          required: true,
          groupLabel: 'Is action required with the next 30 days to reduce the risk?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'icfIsActionRequiredIn30Daysyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'icfIsActionRequiredIn30Daysno' },
          ],
        },
      ],
    },
    intermittentSupports: {
      name: 'Intermittent Supports',
      dbtable: 'WLA_Intermitent_Supports',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'intSupDetermination',
          groupLabel:
            'Does the individual have an ongoing need for limited / intermittent supports to address behavioral, physical, or medical needs in order to sustain existing caregivers and remain in the current living with.',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupDeterminationyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'intSupDeterminationno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'intSupIsSupportNeededIn12Months',
          required: true,
          groupLabel: 'Does the individual have a need for limited or intermittent supports within the next 12 months?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupIsSupportNeededIn12Monthsyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'intSupIsSupportNeededIn12Monthsno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'intSupIsStayingLivingArrangement',
          required: true,
          groupLabel: 'Does the individual desire to remain in the current living environment?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupIsStayingLivingArrangementyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'intSupIsStayingLivingArrangementno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'intSupIsActionRequiredIn30Days',
          required: true,
          groupLabel:
            'Are existing caregivers willing AND able to continue to provide supports, if some relief were provided?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'intSupIsActionRequiredIn30Daysyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'intSupIsActionRequiredIn30Daysno' },
          ],
        },
      ],
    },
    childProtectionAgency: {
      name: 'Child Protection Agency',
      dbtable: 'WLA_Child_Protection_Agencies',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'cpaDetermination',
          groupLabel:
            'Is the individual reaching the age of majority and being released from the custody of a child protective agency within the next 12 months and has needs that cannot be addressed through alternative services?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaDeterminationyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'cpaDeterminationno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'cpaIsReleasedNext12Months',
          required: true,
          groupLabel:
            'Is the individual being released from the custody of a child protective agency within the next 12 months? ',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaIsReleasedNext12Monthsyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'cpaIsReleasedNext12Monthsno' },
          ],
        },
        {
          id: 'cpaAnticipateDate',
          type: 'date',
          label: 'Anticipated Date',
          disabled: true,
          required: true,
        },
        {
          type: 'radiogroup',
          id: 'cpaHasUnaddressableNeeds',
          required: true,
          groupLabel: 'Does the individual have needs that cannot be addressed through alternative services?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaHasUnaddressableNeedsyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'cpaHasUnaddressableNeedsno' },
          ],
        },
      ],
    },
    adultDayEmployment: {
      name: 'Adult Day/Employment',
      dbtable: 'WLA_Require_Waiver_Fundings',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'rwfWaiverFundingRequired',
          groupLabel: 'Does the individual require waiver funding for adult day or employment-related services?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfWaiverFundingRequiredyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rwfWaiverFundingRequiredno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'rwfNeedsMoreFrequency',
          required: true,
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
          required: true,
          groupLabel:
            'Are the needed services beyond what is available to the individual through the local school district / Individuals with Disabilities Education Act?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsServiceNotMetIDEAyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsServiceNotMetIDEAno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'rwfNeedsServicesNotMetOOD',
          required: true,
          groupLabel:
            'Are the needed services beyond what is available to the individual through Vocational Rehabilitation / Opportunities for Ohioans with Disabilities or other resources?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsServicesNotMetOODyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsServicesNotMetOODno' },
          ],
        },
      ],
    },
    dischargePlan: {
      name: 'Discharge Plan',
      dbtable: 'WLA_Discharge_Plans',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'dischargeDetermination',
          groupLabel:
            'Does the individual have a viable discharge plan from the current facility in which he / she resides?',
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeDeterminationyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'dischargeDeterminationno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'dischargeIsICFResident',
          required: true,
          groupLabel: 'Is the individual currently a resident of an ICFIID or Nursing Facility?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeIsICFResidentyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'dischargeIsICFResidentno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'dischargeIsInterestedInMoving',
          required: true,
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
          required: true,
          groupLabel: `Is the individual's team developing a discharge plan that addresses barries to community living, such as housing and availability of providers?`,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'dischargeHasDischargePlanyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'dischargeHasDischargePlanno' },
          ],
        },
      ],
    },
    immediateNeeds: {
      name: 'Immediate Needs',
      dbtable: 'WLA_Immediate_Needs',
      enabled: false,
      formElements: [
        {
          type: 'radiogroup',
          id: 'immNeedsRequired',
          required: true,
          groupLabel: `Is there an immediate need identified that requires an action plan with 30 days to reduce the risk?`,
          note: 'This will be selected automatically as the information below is entered.',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'immNeedsRequiredyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'immNeedsRequiredno' },
          ],
          disabled: true,
        },
        {
          label: `if "Yes", describe the immediate need:`,
          id: 'immNeedsDescription',
          fullscreen: true,
          type: 'textarea',
          required: true,
          disabled: true,
        },
      ],
    },
    currentNeeds: {
      name: 'Current Needs',
      dbtable: 'WLA_Unmet_Needs',
      enabled: false,
      formElements: [
        {
          disabled: true,
          type: 'radiogroup',
          id: 'unmetNeedsHas',
          groupLabel: 'Does the individual have an identified need?',
          note: 'This will be selected automatically as the information below is entered.',
          required: true,
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
          required: true,
        },
        {
          label: `if "Yes", describe the unmet need:`,
          id: 'unmetNeedsDescription',
          fullscreen: true,
          type: 'textarea',
          disabled: true,
          required: true,
        },
      ],
    },
    waiverEnrollment: {
      name: 'Waiver Enrollment',
      dbtable: 'WLA_Waiver_Enrollments',
      enabled: false,
      formElements: [
        {
          type: 'radiogroup',
          id: 'waivEnrollWaiverEnrollmentIsRequired',
          required: true,
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
          required: true,
        },
      ],
    },
    conclusion: {
      name: 'Conclusion',
      enabled: true,
      formElements: [
        {
          type: 'checkboxgroup',
          id: 'conclusions',
          groupLabel:
            'The options below are selected automatically based on answers provided throughout the assessment.',
          disabled: true,
          fields: [
            {
              type: 'checkbox',
              label:
                'The individual has unmet needs that require enrollment in a waiver at this time to address circumstances presenting an immmediate risk of harm',
              id: 'conclusionUnmetNeeds',
            },
            {
              type: 'checkbox',
              label:
                'The individual has needs that are likely to require waiver-funded supports within the next 12 months and will be placed on the waiting list for Home and Community-Based Services at this time.',
              id: 'conclusionWaiverFunded12Months',
            },
            {
              type: 'checkbox',
              label:
                'The individual does not require waiver enrollment or placement on the waiting list for Home and Community-Based Services as either there are no assessed needs or alternate services are available to meet assessed needs.',
              id: 'conclusionDoesNotRequireWaiver',
            },
            {
              type: 'checkbox',
              label:
                'The individual is not eligible for waiver enrollment or placement on the Waiting List for Home and Community-Based Services, as he/she has no qualifying condition.',
              id: 'conclusionNotEligibleForWaiver',
            },
          ],
        },
        {
          type: 'text',
          id: 'conclussionDeterminedBy',
          label: 'Name of person determining conclusion:',
          required: true,
        },
        {
          type: 'text',
          id: 'conclusionDeterminedByTitle',
          label: 'Title of person determining conclusion:',
          required: true,
        },
        {
          id: 'conclusionDeterminedOn',
          type: 'date',
          label: 'Date conclusion determined:',
          required: true,
        },
        {
          label: 'Anticipated Waiver Type',
          id: 'fundingSourceId',
          type: 'select',
          required: true,
          includeBlankOption: true,
        },
      ],
    },
  };
  const sectionResets = {
    currentAvailableServices: async () => {
      wlForms['currentAvailableServices'].clear();

      wlForms['currentAvailableServices'].inputs['otherDescription'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['currentAvailableServices'].id}|${wlFormInfo['currentAvailableServices'].dbtable}`],
      });
    },
    primaryCaregiver: async () => {
      wlForms['primaryCaregiver'].clear();

      wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].toggleDisabled(true);
      wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].toggleDisabled(true);
      wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(true);
      wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(true);
      wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(true);
      wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['primaryCaregiver'].id}|${wlFormInfo['primaryCaregiver'].dbtable}`],
      });
    },
    behavioral: async () => {
      wlForms['behavioral'].clear();

      wlForms['behavioral'].inputs['risksFrequencyDescription'].toggleDisabled(true);
      wlForms['behavioral'].inputs['risksOtherDocumentDescription'].toggleDisabled(true);

      // checkboxes set 1
      wlForms['behavioral'].inputs['risksIsNone'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksIsPhysicalAggression'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksIsSelfInjury'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksIsFireSetting'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksIsElopement'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksIsSexualOffending'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksIsOther'].toggleDisabled(false);
      //
      wlForms['behavioral'].inputs['risksIsNone'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksIsPhysicalAggression'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksIsSelfInjury'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksIsFireSetting'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksIsElopement'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksIsSexualOffending'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksIsOther'].toggleRequired(true);
      // checkbox set 2
      wlForms['behavioral'].inputs['risksHasNoDocument'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksHasPoliceReport'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksHasIncidentReport'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksHasBehaviorTracking'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].toggleDisabled(false);
      wlForms['behavioral'].inputs['risksHasOtherDocument'].toggleDisabled(false);
      //
      wlForms['behavioral'].inputs['risksHasNoDocument'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksHasPoliceReport'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksHasIncidentReport'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksHasBehaviorTracking'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].toggleRequired(true);
      wlForms['behavioral'].inputs['risksHasOtherDocument'].toggleRequired(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['behavioral'].id}|${wlFormInfo['behavioral'].dbtable}`],
      });
    },
    physical: async () => {
      wlForms['physical'].clear();

      wlForms['physical'].inputs['physicalNeedsDescription'].toggleDisabled(true);

      // checkboxes
      wlForms['physical'].inputs['physicalNeedsIsNone'].toggleDisabled(false);
      wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].toggleDisabled(false);
      wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].toggleDisabled(false);
      wlForms['physical'].inputs['physicalNeedsIsOther'].toggleDisabled(false);
      //
      wlForms['physical'].inputs['physicalNeedsIsNone'].toggleRequired(true);
      wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].toggleRequired(true);
      wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].toggleRequired(true);
      wlForms['physical'].inputs['physicalNeedsIsOther'].toggleRequired(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['physical'].id}|${wlFormInfo['physical'].dbtable}`],
      });
    },
    medical: async () => {
      wlForms['medical'].clear();

      wlForms['medical'].inputs['medicalNeedsDescription'].toggleDisabled(true);

      // checkboxes
      wlForms['medical'].inputs['medicalNeedsIsNone'].toggleDisabled(false);
      wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].toggleDisabled(false);
      wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].toggleDisabled(false);
      wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].toggleDisabled(false);
      wlForms['medical'].inputs['medicalNeedsIsOther'].toggleDisabled(false);
      //
      wlForms['medical'].inputs['medicalNeedsIsNone'].toggleRequired(true);
      wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].toggleRequired(true);
      wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].toggleRequired(true);
      wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].toggleRequired(true);
      wlForms['medical'].inputs['medicalNeedsIsOther'].toggleRequired(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['medical'].id}|${wlFormInfo['medical'].dbtable}`],
      });
    },
    other: async () => {
      wlForms['other'].clear();

      wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(true);
      wlForms['other'].inputs['needsIsContinuousSupportRequired'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['other'].id}|${wlFormInfo['other'].dbtable}`],
      });
    },
    riskMitigation: async () => {
      wlForms['riskMitigation'].clear();

      wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(true);
      wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(true);

      // checkboxes
      wlForms['riskMitigation'].inputs['rMIsNone'].toggleDisabled(false);
      wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].toggleDisabled(false);
      wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].toggleDisabled(false);
      wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].toggleDisabled(false);
      wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].toggleDisabled(false);
      //
      wlForms['riskMitigation'].inputs['rMIsNone'].toggleRequired(true);
      wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].toggleRequired(true);
      wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].toggleRequired(true);
      wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].toggleRequired(true);
      wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].toggleRequired(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['riskMitigation'].id}|${wlFormInfo['riskMitigation'].dbtable}`],
      });
    },
    icfDischarge: async () => {
      wlForms['icfDischarge'].clear();

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['icfDischarge'].id}|${wlFormInfo['icfDischarge'].dbtable}`],
      });
    },
    intermittentSupports: async () => {
      wlForms['intermittentSupports'].clear();

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['intermittentSupports'].id}|${wlFormInfo['intermittentSupports'].dbtable}`],
      });
    },
    childProtectionAgency: async () => {
      wlForms['childProtectionAgency'].clear();

      wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['childProtectionAgency'].id}|${wlFormInfo['childProtectionAgency'].dbtable}`],
      });
    },
    adultDayEmployment: async () => {
      wlForms['adultDayEmployment'].clear();

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['adultDayEmployment'].id}|${wlFormInfo['adultDayEmployment'].dbtable}`],
      });
    },
    dischargePlan: async () => {
      wlForms['dischargePlan'].clear();

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['dischargePlan'].id}|${wlFormInfo['dischargePlan'].dbtable}`],
      });
    },
    immediateNeeds: async () => {
      wlForms['immediateNeeds'].clear();

      wlForms['immediateNeeds'].inputs['immNeedsDescription'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['immediateNeeds'].id}|${wlFormInfo['immediateNeeds'].dbtable}`],
      });
    },
    currentNeeds: async () => {
      wlForms['currentNeeds'].clear();

      wlForms['currentNeeds'].inputs['unmetNeedsSupports'].toggleDisabled(true);
      wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['currentNeeds'].id}|${wlFormInfo['currentNeeds'].dbtable}`],
      });
    },
    waiverEnrollment: async () => {
      wlForms['waiverEnrollment'].clear();

      wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(true);

      await _UTIL.fetchData('deleteFromWaitingList', {
        properties: [`${wlFormInfo['waiverEnrollment'].id}|${wlFormInfo['waiverEnrollment'].dbtable}`],
      });
    },
  };

  // UTILS
  //--------------------------------------------------
  function findFieldTypeById(formElements, targetId) {
    let fieldtype;

    for (const element of formElements) {
      if (element.id === targetId) {
        fieldtype = element.type;
        break;
      }
      if (element.type === 'checkboxgroup') {
        if (element.fields.some(f => f.id === targetId)) {
          fieldtype = 'checkboxgroup';
          break;
        }
      }
    }

    return fieldtype;
  }
  function addNewDocumentToList({ documentId, fileName }) {
    const documentItem = _DOM.createElement('p', { class: 'docList__Item', text: fileName });
    const deleteIcon = Icon.getIcon('delete');
    documentItem.appendChild(deleteIcon);

    documentItem.addEventListener('click', async e => {
      if (e.target === deleteIcon) {
        await _UTIL.fetchData('deleteSupportingDocument', { attachmentId: documentId });
        return;
      }

      var form = document.createElement('form');
      form.setAttribute(
        'action',
        `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewWaitingListAttachment/`,
      );
      form.setAttribute('method', 'POST');
      form.setAttribute('target', '_blank');
      form.setAttribute('enctype', 'application/json');
      form.setAttribute('success', () => {});
      var tokenInput = document.createElement('input');
      tokenInput.setAttribute('name', 'token');
      tokenInput.setAttribute('value', $.session.Token);
      tokenInput.id = 'token';
      var attachmentInput = document.createElement('input');
      attachmentInput.setAttribute('name', 'attachmentId');
      attachmentInput.setAttribute('value', documentId);
      attachmentInput.id = 'attachmentId';

      form.appendChild(tokenInput);
      form.appendChild(attachmentInput);
      form.style.position = 'absolute';
      form.style.opacity = '0';
      document.body.appendChild(form);

      form.submit();
    });

    doucmentsList.appendChild(documentItem);
  }
  function toggleTocLinksDisabledStatus(links, disable) {
    links.forEach(link => {
      tocLinks[link].classList.toggle('hiddenPage', disable);
    });
  }
  function updateFormCompletionStatus(formName) {
    const requiredInputs = [
      ...wlForms[formName].form.querySelectorAll(
        'input:required:not([disabled]), select:required:not([disabled]), textarea:required:not([disabled])',
      ),
    ];

    let isFormComplete = true;
    if (requiredInputs.length) {
      isFormComplete = requiredInputs.map(input => input.checkValidity()).every(isValid => isValid);
    }

    tocLinks[formName].classList.toggle('formComplete', isFormComplete);
  }
  function toggleSendEmailDisabledStatus() {
    const incompleteSections = tocLinks.filter(link => {
      return !link.classList.contains('hiddenPage') && !link.classList.contains('formComplete');
    });

    sendEmailButton.toggleDisabled(incompleteSections.length > 0 || !$.session.sendWaitingListemail);
  }

  // DATA
  //--------------------------------------------------
  async function insertNewWaitingListAssessment(consumerId) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id: 0,
      linkId: 0,
      propertyName: 'consumerId',
      value: consumerId,
      valueTwo: '',
      insertOrUpdate: 'I',
    });

    return JSON.parse(data.insertUpdateWaitingListValueResult);
  }
  async function insertAssessmentData({ id, linkId, propertyName, value, valueTwo = '' }) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id,
      linkId,
      propertyName,
      value,
      valueTwo,
      insertOrUpdate: 'I',
    });

    return JSON.parse(data.insertUpdateWaitingListValueResult);
  }
  async function updateAssessmentData({ id, linkId = 0, propertyName, value, valueTwo = '' }) {
    const data = await _UTIL.fetchData('insertUpdateWaitingListValue', {
      id,
      linkId,
      propertyName,
      value,
      valueTwo,
      insertOrUpdate: 'U',
    });

    return data.insertUpdateWaitingListValueResult;
  }
  async function insertUpdateAssessment({ value, name, type, formName }) {
    // set radio/checkbox value
    if (type === 'radio' || type === 'checkbox') {
      value = value === 'yes' || value === 'on' ? 1 : 0;
    }

    // determine if we use wlLinkID or wlCircID or wlNeedID
    let linkIdForSaveUpdate;

    if (
      [
        'primaryCaregiver',
        'riskMitigation',
        'icfDischarge',
        'intermittentSupports',
        'childProtectionAgency',
        'adultDayEmployment',
        'dischargePlan',
        'other',
      ].includes(formName)
    ) {
      linkIdForSaveUpdate = wlCircID;
    } else if (['behavioral', 'physical', 'medical'].includes(formName)) {
      linkIdForSaveUpdate = wlNeedID;
    } else {
      linkIdForSaveUpdate = wlLinkID;
    }

    // save / update
    let hasId = false;
    hasId = !wlFormInfo[formName].id ? false : true;

    try {
      if (!hasId) {
        const resp = await insertAssessmentData({
          id: 0,
          linkId: linkIdForSaveUpdate,
          propertyName: name,
          value: value,
        });

        wlFormInfo[formName].id = resp[0].newRecordId;
      } else {
        await updateAssessmentData({
          id: formName === 'other' ? wlNeedID : wlFormInfo[formName].id,
          linkId: formName === 'waitingListInfo' || formName === 'conclusion' ? 0 : linkIdForSaveUpdate,
          propertyName: name,
          value: value,
        });
      }
    } catch (error) {
      console.log(error, { propertyName: name, insertOrUpdate: hasId ? 'U' : 'I' });
    }
  }
  async function getFundingSources() {
    const resp = await _UTIL.fetchData('getWaitingListFundingSources');
    const fundingSources = resp.getWaitingListFundingSourcesResult;
    return fundingSources.map(fs => {
      return {
        value: fs.fundingSourceId,
        text: fs.description,
      };
    });
  }
  async function saveDocument(attachDetails) {
    const resp = await _UTIL.fetchData('addWlSupportingDocument', {
      waitingListInformationId: wlLinkID,
      description: attachDetails.description,
      includeOnEmail: data['email'] === 'on' ? 'Y' : 'N',
      attachmentType: attachDetails.type,
      attachment: attachDetails.attachment,
    });
    return resp.addWLSupportingDocumentResult[0].supportingDocumentId;
  }

  // REVIEW / EDIT
  //--------------------------------------------------
  function mapDataBySection(assessmentData) {
    if (!assessmentData) return '';

    wlLinkID = assessmentData.wlInfoId;
    wlCircID = assessmentData.circumstanceId;
    wlNeedID = assessmentData.needId;

    wlParticipants = {};
    if (assessmentData.participants) {
      for (const participantData of assessmentData.participants.split('||')) {
        const particpant = participantData.split('|');
        wlParticipants[particpant[2]] = {
          id: particpant[2],
          values: [particpant[0], particpant[1]],
        };
      }
    }

    wlFormInfo['waitingListInfo'].id = wlLinkID;
    wlFormInfo['conditions'].id = assessmentData.conditionId;
    wlFormInfo['currentAvailableServices'].id = assessmentData.activeServiceId;
    wlFormInfo['primaryCaregiver'].id = assessmentData.primaryCaregiverId;
    wlFormInfo['behavioral'].id = assessmentData.riskId;
    wlFormInfo['physical'].id = assessmentData.physicalNeedId;
    wlFormInfo['medical'].id = assessmentData.medicalNeedId;
    wlFormInfo['other'].id = wlNeedID;
    wlFormInfo['riskMitigation'].id = assessmentData.riskMitigationId;
    wlFormInfo['icfDischarge'].id = assessmentData.icfDischargeId;
    wlFormInfo['intermittentSupports'].id = assessmentData.intermitentSupportsId;
    wlFormInfo['childProtectionAgency'].id = assessmentData.childProtectionId;
    wlFormInfo['adultDayEmployment'].id = assessmentData.requireWaiverFundingId;
    wlFormInfo['dischargePlan'].id = assessmentData.dischargePlanId;
    wlFormInfo['immediateNeeds'].id = assessmentData.immediateNeedId;
    wlFormInfo['currentNeeds'].id = assessmentData.unmetNeedId;
    wlFormInfo['waiverEnrollment'].id = assessmentData.waiverEnrollmentId;
    wlFormInfo['conclusion'].id = wlLinkID;

    const data = {
      waitingListInfo: {
        personCompleting: assessmentData.personCompleting,
        personCompletingTitle: assessmentData.personCompletingTitle,
        currentLivingArrangement: assessmentData.currentLivingArrangement,
        livingArrangementOther: assessmentData.livingArrangementOther,
        areasPersonNeedsHelp: assessmentData.areasPersonNeedsHelp,
      },
      conditions: {
        otherThanMentalHealth: assessmentData.otherThanMentalHealth,
        before22: assessmentData.before22,
        isConditionIndefinite: assessmentData.isConditionIndefinite,
      },
      currentAvailableServices: {
        isCountyBoardFunding: assessmentData.isCountyBoardFunding,
        isOhioEarlyInterventionService: assessmentData.isOhioEarlyInterventionService,
        isBCMHService: assessmentData.isBCMHService,
        isFCFCService: assessmentData.isFCFCService,
        isODEService: assessmentData.isODEService,
        isOODService: assessmentData.isOODService,
        isChildrenServices: assessmentData.isChildrenServices,
        isMedicaidStatePlanHomeHealthAideservice: assessmentData.isMedicaidStatePlanHomeHealthAideservice,
        isMedicaidStatePlanHomeHealthNursingService: assessmentData.isMedicaidStatePlanHomeHealthNursingService,
        isMedicaidStatePlanService: assessmentData.isMedicaidStatePlanService,
        isOhioHomeCareWaiverservice: assessmentData.isOhioHomeCareWaiverservice,
        isPassportWaiverService: assessmentData.isPassportWaiverService,
        isAssistedLivingWaiverService: assessmentData.isAssistedLivingWaiverService,
        isMYCarewaiverService: assessmentData.isMYCarewaiverService,
        isSelfWaiverService: assessmentData.isSelfWaiverService,
        isLevelOneWaiverService: assessmentData.isLevelOneWaiverService,
        isOtherService: assessmentData.isOtherService,
        otherDescription: assessmentData.otherDescription,
      },
      primaryCaregiver: {
        isPrimaryCaregiverUnavailable: assessmentData.isPrimaryCaregiverUnavailable,
        unavailableDocumentation: assessmentData.unavailableDocumentation,
        isActionRequiredIn30Days: assessmentData.isActionRequiredIn30Days,
        actionRequiredDescription: assessmentData.actionRequiredDescription,
        isIndividualSkillsDeclined: assessmentData.isIndividualSkillsDeclined,
        declinedSkillsDocumentation: assessmentData.declinedSkillsDocumentation,
        declinedSkillsDescription: assessmentData.declinedSkillsDescription,
        additionalCommentsForUnavailable: assessmentData.additionalCommentsForUnavailable,
      },
      behavioral: {
        risksIsRiskToSelf: assessmentData.risksIsRiskToSelf,
        risksIsPhysicalAggression: assessmentData.risksIsPhysicalAggression,
        risksIsSelfInjury: assessmentData.risksIsSelfInjury,
        risksIsFireSetting: assessmentData.risksIsFireSetting,
        risksIsElopement: assessmentData.risksIsElopement,
        risksIsSexualOffending: assessmentData.risksIsSexualOffending,
        risksIsOther: assessmentData.risksIsOther,
        risksFrequencyDescription: assessmentData.risksFrequencyDescription,
        risksHasNoDocument: assessmentData.risksHasNoDocument,
        risksHasPoliceReport: assessmentData.risksHasPoliceReport,
        risksHasIncidentReport: assessmentData.risksHasIncidentReport,
        risksHasBehaviorTracking: assessmentData.risksHasBehaviorTracking,
        risksHasPsychologicalAssessment: assessmentData.risksHasPsychologicalAssessment,
        risksHasOtherDocument: assessmentData.risksHasOtherDocument,
        risksOtherDocumentDescription: assessmentData.risksOtherDocumentDescription,
      },
      physical: {
        physicalNeedsIsPhysicalCareNeeded: assessmentData.physicalNeedsIsPhysicalCareNeeded,
        physicalNeedsIsNone: assessmentData.physicalNeedsIsNone,
        physicalNeedsIsPersonalCareNeeded: assessmentData.physicalNeedsIsPersonalCareNeeded,
        physicalNeedsIsRiskDuringPhysicalCare: assessmentData.physicalNeedsIsRiskDuringPhysicalCare,
        physicalNeedsIsOther: assessmentData.physicalNeedsIsOther,
        physicalNeedsDescription: assessmentData.physicalNeedsDescription,
      },
      medical: {
        medicalNeedsIsLifeThreatening: assessmentData.medicalNeedsIsLifeThreatening,
        medicalNeedsIsNone: assessmentData.medicalNeedsIsNone,
        medicalNeedsIsFrequentEmergencyVisit: assessmentData.medicalNeedsIsFrequentEmergencyVisit,
        medicalNeedsIsOngoingMedicalCare: assessmentData.medicalNeedsIsOngoingMedicalCare,
        medicalNeedsIsSpecializedCareGiveNeeded: assessmentData.medicalNeedsIsSpecializedCareGiveNeeded,
        medicalNeedsIsOther: assessmentData.medicalNeedsIsOther,
        medicalNeedsDescription: assessmentData.medicalNeedsDescription,
      },
      other: {
        needsIsActionRequiredRequiredIn30Days: assessmentData.needsIsActionRequiredRequiredIn30Days,
        needsIsContinuousSupportRequired: assessmentData.needsIsContinuousSupportRequired,
      },
      riskMitigation: {
        rMIsSupportNeeded: assessmentData.rMIsSupportNeeded,
        rMIsNone: assessmentData.rMIsNone,
        rMIsAdultProtectiveServiceInvestigation: assessmentData.rMIsAdultProtectiveServiceInvestigation,
        rMIsCountyBoardInvestigation: assessmentData.rMIsCountyBoardInvestigation,
        rMIsLawEnforcementInvestigation: assessmentData.rMIsLawEnforcementInvestigation,
        rMIsOtherInvestigation: assessmentData.rMIsOtherInvestigation,
        rMdescription: assessmentData.rMdescription,
        rMIsActionRequiredIn3oDays: assessmentData.rMIsActionRequiredIn3oDays,
      },
      icfDischarge: {
        icfDetermination: assessmentData.icfDetermination,
        icfIsICFResident: assessmentData.icfIsICFResident,
        icfIsNoticeIssued: assessmentData.icfIsNoticeIssued,
        icfIsActionRequiredIn30Days: assessmentData.icfIsActionRequiredIn30Days,
      },
      intermittentSupports: {
        intSupDetermination: assessmentData.intSupDetermination,
        intSupIsSupportNeededIn12Months: assessmentData.intSupIsSupportNeededIn12Months,
        intSupIsStayingLivingArrangement: assessmentData.intSupIsStayingLivingArrangement,
        intSupIsActionRequiredIn30Days: assessmentData.intSupIsActionRequiredIn30Days,
      },
      childProtectionAgency: {
        cpaDetermination: assessmentData.cpaDetermination,
        cpaIsReleasedNext12Months: assessmentData.cpaIsReleasedNext12Months,
        cpaAnticipateDate: assessmentData.cpaAnticipateDate ? assessmentData.cpaAnticipateDate.split(' ')[0] : '',
        cpaHasUnaddressableNeeds: assessmentData.cpaHasUnaddressableNeeds,
      },
      adultDayEmployment: {
        rwfWaiverFundingRequired: assessmentData.rwfWaiverFundingRequired,
        rwfNeedsMoreFrequency: assessmentData.rwfNeedsMoreFrequency,
        rwfNeedsServiceNotMetIDEA: assessmentData.rwfNeedsServiceNotMetIDEA,
        rwfNeedsServicesNotMetOOD: assessmentData.rwfNeedsServicesNotMetOOD,
      },
      dischargePlan: {
        dischargeDetermination: assessmentData.dischargeDetermination,
        dischargeIsICFResident: assessmentData.dischargeIsICFResident,
        dischargeIsInterestedInMoving: assessmentData.dischargeIsInterestedInMoving,
        dischargeHasDischargePlan: assessmentData.dischargeHasDischargePlan,
      },
      immediateNeeds: {
        immNeedsRequired: assessmentData.immNeedsRequired,
        immNeedsDescription: assessmentData.immNeedsDescription,
      },
      currentNeeds: {
        unmetNeedsHas: assessmentData.unmetNeedsHas,
        unmetNeedsSupports: assessmentData.unmetNeedsSupports,
        unmetNeedsDescription: assessmentData.unmetNeedsDescription,
      },
      waiverEnrollment: {
        waivEnrollWaiverEnrollmentIsRequired: assessmentData.waivEnrollWaiverEnrollmentIsRequired,
        waivEnrollWaiverEnrollmentDescription: assessmentData.waivEnrollWaiverEnrollmentDescription,
      },
      conclusion: {
        conclusionUnmetNeeds: assessmentData.conclusionUnmetNeeds,
        conclusionWaiverFunded12Months: assessmentData.conclusionWaiverFunded12Months,
        conclusionDoesNotRequireWaiver: assessmentData.conclusionDoesNotRequireWaiver,
        conclusionNotEligibleForWaiver: assessmentData.conclusionNotEligibleForWaiver,
        conclussionDeterminedBy: assessmentData.conclussionDeterminedBy,
        conclusionDeterminedByTitle: assessmentData.conclusionDeterminedByTitle,
        conclusionDeterminedOn: assessmentData.conclusionDeterminedOn,
        fundingSourceId: assessmentData.fundingSourceId,
      },
    };

    for (d in data) {
      for (dd in data[d]) {
        const fieldType = findFieldTypeById(sections[d].formElements, dd);

        if (fieldType === 'radiogroup') {
          if (data[d][dd] === '0') {
            data[d][dd] = `${dd}no`;
          }

          if (data[d][dd] === '1') {
            data[d][dd] = `${dd}yes`;
          }
        }

        if (fieldType === 'checkboxgroup') {
          if (data[d][dd] === '' || data[d][dd] === '0') {
            data[d][dd] = false;
          }

          if (data[d][dd] === '1') {
            data[d][dd] = true;
          }
        }
      }
    }

    return data;
  }
  function enableSectionsForReview() {
    const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
    const isBefore22Yes = wlData.conditions.before22.includes('yes');
    const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');

    if (!isOtherThanMentalHealthYes || !isBefore22Yes || !isConditionIndefiniteYes) {
      return;
    }

    contributingCircumstancesWrap.classList.remove('hiddenPage');
    wlForms['primaryCaregiver'].form.parentElement.classList.remove('hiddenPage');
    wlForms['waiverEnrollment'].form.parentElement.classList.remove('hiddenPage');
    wlForms['currentAvailableServices'].form.parentElement.classList.remove('hiddenPage');

    tocLinks['contributingCircumstances'].classList.remove('hiddenPage');
    tocLinks['primaryCaregiver'].classList.remove('hiddenPage');
    tocLinks['waiverEnrollment'].classList.remove('hiddenPage');
    tocLinks['currentAvailableServices'].classList.remove('hiddenPage');

    const isActionRequiredIn30DaysNo = wlData.primaryCaregiver.isActionRequiredIn30Days.includes('no');

    if (isActionRequiredIn30DaysNo) {
      needsWrap.classList.remove('hiddenPage');
      wlForms['behavioral'].form.parentElement.classList.remove('hiddenPage');
      wlForms['physical'].form.parentElement.classList.remove('hiddenPage');
      wlForms['medical'].form.parentElement.classList.remove('hiddenPage');
      wlForms['other'].form.parentElement.classList.remove('hiddenPage');
      tocLinks['needs'].classList.remove('hiddenPage');
      tocLinks['behavioral'].classList.remove('hiddenPage');
      tocLinks['physical'].classList.remove('hiddenPage');
      tocLinks['medical'].classList.remove('hiddenPage');
      tocLinks['other'].classList.remove('hiddenPage');
    }

    const isNeedActionRequiredYes = wlData.other.needsIsActionRequiredRequiredIn30Days.includes('yes');

    if (isNeedActionRequiredYes) {
      wlForms['riskMitigation'].form.parentElement.classList.remove('hiddenPage');
      tocLinks['riskMitigation'].classList.remove('hiddenPage');
    }

    const isRMActionRequiredNo = wlData.riskMitigation.rMIsActionRequiredIn3oDays.includes('no');
    const isRMActionRequiredYes = wlData.riskMitigation.rMIsActionRequiredIn3oDays.includes('yes');

    if (isRMActionRequiredNo) {
      wlForms['icfDischarge'].form.parentElement.classList.remove('hiddenPage');
      tocLinks['icfDischarge'].classList.remove('hiddenPage');
    }

    if (
      (!isRMActionRequiredYes && wlData.riskMitigation.rMIsActionRequiredIn3oDays !== '') ||
      (!isNeedActionRequiredYes && wlData.other.needsIsActionRequiredRequiredIn30Days !== '')
    ) {
      wlForms['currentNeeds'].form.parentElement.classList.remove('hiddenPage');
      tocLinks['currentNeeds'].classList.remove('hiddenPage');
    }

    const isAdultProtectiveServiceInvestigationChecked = wlData.riskMitigation.rMIsAdultProtectiveServiceInvestigation;
    const isCountyBoardInvestigationChecked = wlData.riskMitigation.rMIsCountyBoardInvestigation;
    const isLawEnforcementInvestigationChecked = wlData.riskMitigation.rMIsLawEnforcementInvestigation;
    const isOtherInvestigationChecked = wlData.riskMitigation.rMIsOtherInvestigation;
    const isNeedsActionRequiredIn30Days = wlData.other.needsIsActionRequiredRequiredIn30Days;

    if (
      ((isAdultProtectiveServiceInvestigationChecked ||
        isCountyBoardInvestigationChecked ||
        isLawEnforcementInvestigationChecked ||
        isOtherInvestigationChecked) &&
        isRMActionRequiredYes) ||
      isNeedActionRequiredYes
    ) {
      wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
      tocLinks['immediateNeeds'].classList.remove('hiddenPage');
    }

    const icfIsICFResident = wlData.icfDischarge.icfIsICFResident.includes('no');
    const icfIsNoticeIssued = wlData.icfDischarge.icfIsNoticeIssued.includes('no');
    const icfIsActionRequiredIn30Days = wlData.icfDischarge.icfIsActionRequiredIn30Days.includes('no');

    if (icfIsICFResident || icfIsNoticeIssued || icfIsActionRequiredIn30Days) {
      ['intermittentSupports', 'childProtectionAgency', 'adultDayEmployment', 'dischargePlan'].forEach(page => {
        wlForms[page].form.parentElement.classList.remove('hiddenPage');
        tocLinks[page].classList.remove('hiddenPage');
      });
    }
  }
  function enableInputsForReview() {
    // waitingListInfo
    //-------------------------------
    if (wlData.waitingListInfo.currentLivingArrangement === 'Other') {
      wlForms.waitingListInfo.inputs['livingArrangementOther'].toggleDisabled(false);
    }

    // currentAvailableServices
    //-------------------------------
    if (wlData.currentAvailableServices.isOtherService.includes('yes')) {
      wlForms['currentAvailableServices'].inputs['otherDescription'].toggleDisabled(false);
    }

    // primaryCaregiver
    //-------------------------------
    if (wlData.primaryCaregiver.isPrimaryCaregiverUnavailable.includes('yes')) {
      wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].toggleDisabled(false);
      wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].toggleDisabled(false);
    } else {
      wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(false);
    }
    if (wlData.primaryCaregiver.isActionRequiredIn30Days.includes('yes')) {
      wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(false);
    }
    if (wlData.primaryCaregiver.isIndividualSkillsDeclined.includes('yes')) {
      wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(false);
      wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(false);
    }

    // needs
    //-------------------------------
    const hasCheckBehavioral = [
      wlData.behavioral.risksIsPhysicalAggression,
      wlData.behavioral.risksIsSelfInjury,
      wlData.behavioral.risksIsFireSetting,
      wlData.behavioral.risksIsElopement,
      wlData.behavioral.risksIsSexualOffending,
      wlData.behavioral.risksIsOther,
    ].some(value => value === true);
    const hasCheckBehavioralDocs = [
      wlData.behavioral.risksHasPoliceReport,
      wlData.behavioral.risksHasIncidentReport,
      wlData.behavioral.risksHasBehaviorTracking,
      wlData.behavioral.risksHasPsychologicalAssessment,
      wlData.behavioral.risksHasOtherDocument,
    ].some(value => value === true);
    const hasCheckPhysical = [
      wlData.physical.physicalNeedsIsPersonalCareNeeded,
      wlData.physical.physicalNeedsIsRiskDuringPhysicalCare,
      wlData.physical.physicalNeedsIsOther,
    ].some(value => value === true);
    const hasCheckMedical = [
      wlData.medical.medicalNeedsIsFrequentEmergencyVisit,
      wlData.medical.medicalNeedsIsOngoingMedicalCare,
      wlData.medical.medicalNeedsIsSpecializedCareGiveNeeded,
      wlData.medical.medicalNeedsIsOther,
    ].some(value => value === true);

    if (hasCheckBehavioral) {
      wlForms['behavioral'].inputs['risksFrequencyDescription'].toggleDisabled(false);

      wlForms['behavioral'].inputs['risksIsNone'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksIsPhysicalAggression'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksIsSelfInjury'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksIsFireSetting'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksIsElopement'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksIsSexualOffending'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksIsOther'].toggleRequired(false);
    }
    if (hasCheckBehavioralDocs) {
      wlForms['behavioral'].inputs['risksHasNoDocument'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksHasPoliceReport'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksHasIncidentReport'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksHasBehaviorTracking'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].toggleRequired(false);
      wlForms['behavioral'].inputs['risksHasOtherDocument'].toggleRequired(false);
    }
    if (hasCheckPhysical) {
      wlForms['physical'].inputs['physicalNeedsDescription'].toggleDisabled(false);

      wlForms['physical'].inputs['physicalNeedsIsNone'].toggleRequired(false);
      wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].toggleRequired(false);
      wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].toggleRequired(false);
      wlForms['physical'].inputs['physicalNeedsIsOther'].toggleRequired(false);
    }
    if (hasCheckMedical) {
      wlForms['medical'].inputs['medicalNeedsDescription'].toggleDisabled(false);

      wlForms['medical'].inputs['medicalNeedsIsNone'].toggleRequired(false);
      wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].toggleRequired(false);
      wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].toggleRequired(false);
      wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].toggleRequired(false);
      wlForms['medical'].inputs['medicalNeedsIsOther'].toggleRequired(false);
    }
    if (hasCheckBehavioral && hasCheckBehavioralDocs && hasCheckPhysical && hasCheckMedical) {
      wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(false);
    }

    if (wlData.behavioral.risksHasOtherDocument) {
      wlForms['behavioral'].inputs['risksOtherDocumentDescription'].toggleDisabled(false);
    }
    if (wlData.other.needsIsActionRequiredRequiredIn30Days.includes('yes')) {
      wlForms['other'].inputs['needsIsContinuousSupportRequired'].toggleDisabled(false);
    }

    // riskMitigation
    //-------------------------------
    const hasCheckRisksMitigation = [
      wlData.behavioral.rMIsAdultProtectiveServiceInvestigation,
      wlData.behavioral.rMIsCountyBoardInvestigation,
      wlData.behavioral.rMIsLawEnforcementInvestigation,
      wlData.behavioral.rMIsOtherInvestigation,
    ].some(value => value === true);

    if (hasCheckRisksMitigation) {
      wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(false);
      wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(false);

      wlForms['riskMitigation'].inputs['rMIsNone'].toggleRequired(false);
      wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].toggleRequired(false);
      wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].toggleRequired(false);
      wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].toggleRequired(false);
      wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].toggleRequired(false);
    }

    // childProtectionAgency
    //-------------------------------
    if (wlData.childProtectionAgency.cpaIsReleasedNext12Months.includes('yes')) {
      wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].toggleDisabled(false);
    }

    // currentNeeds
    //-------------------------------
    if (wlData.currentNeeds.unmetNeedsHas.includes('yes')) {
      wlForms['currentNeeds'].inputs['unmetNeedsSupports'].toggleDisabled(false);
    }
    if (wlData.currentNeeds.unmetNeedsSupports.includes('yes')) {
      wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(false);
    }

    // immediateNeeds
    //-------------------------------
    const isNeedActionRequiredYes = wlData.other.needsIsActionRequiredRequiredIn30Days.includes('yes');
    const isRMActionRequiredYes = wlData.riskMitigation.rMIsActionRequiredIn3oDays.includes('yes');
    const isAdultProtectiveServiceInvestigationChecked = wlData.riskMitigation.rMIsAdultProtectiveServiceInvestigation;
    const isCountyBoardInvestigationChecked = wlData.riskMitigation.rMIsCountyBoardInvestigation;
    const isLawEnforcementInvestigationChecked = wlData.riskMitigation.rMIsLawEnforcementInvestigation;
    const isOtherInvestigationChecked = wlData.riskMitigation.rMIsOtherInvestigation;
    if (
      ((isAdultProtectiveServiceInvestigationChecked ||
        isCountyBoardInvestigationChecked ||
        isLawEnforcementInvestigationChecked ||
        isOtherInvestigationChecked) &&
        isRMActionRequiredYes) ||
      isNeedActionRequiredYes
    ) {
      wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
      tocLinks['immediateNeeds'].classList.remove('hiddenPage');
    }

    // waiverEnrollment
    //-------------------------------
    if (wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('yes')) {
      wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(false);
    }
  }
  function setConclusionUnmetNeedsReview() {
    const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
    const isBefore22Yes = wlData.conditions.before22.includes('yes');
    const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');
    const isImmNeedsRequiredYes = wlData.immediateNeeds.immNeedsRequired.includes('yes');
    const isWaiverEnrollRequiredYes = wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('yes');

    const isChecked =
      isOtherThanMentalHealthYes &&
      isBefore22Yes &&
      isConditionIndefiniteYes &&
      isWaiverEnrollRequiredYes &&
      isImmNeedsRequiredYes;
    wlForms['conclusion'].inputs['conclusionUnmetNeeds'].setValue(isChecked);
  }
  function setConclusionWaiverFunded12MonthsReview() {
    const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
    const isBefore22Yes = wlData.conditions.before22.includes('yes');
    const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');
    const isUnmetNeedsHasYes = wlData.currentNeeds.unmetNeedsHas.includes('yes');
    const isUnmetNeedsSupportsYes = wlData.currentNeeds.unmetNeedsSupports.includes('yes');
    const isWaiverEnrollRequiredYes = wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('yes');

    const isChecked =
      isOtherThanMentalHealthYes &&
      isBefore22Yes &&
      isConditionIndefiniteYes &&
      isUnmetNeedsHasYes &&
      isUnmetNeedsSupportsYes &&
      isWaiverEnrollRequiredYes;
    wlForms['conclusion'].inputs['conclusionWaiverFunded12Months'].setValue(isChecked);
  }
  function setConclusionDoesNotRequireWaiverReview() {
    const isWaiverEnrollRequiredNo = wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('no');

    wlForms['conclusion'].inputs['conclusionDoesNotRequireWaiver'].setValue(isWaiverEnrollRequiredNo);
  }
  function setConclusionNotEligibleForWaiverReview() {
    const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
    const isBefore22Yes = wlData.conditions.before22.includes('yes');
    const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');

    const isChecked = !isOtherThanMentalHealthYes || !isBefore22Yes || !isConditionIndefiniteYes;
    wlForms['conclusion'].inputs['conclusionNotEligibleForWaiver'].setValue(isChecked);
  }

  // EVENTS
  //--------------------------------------------------
  async function showHideNeedsPages() {
    const promises = [];
    const isPrimaryCaregiverUnavailable =
      wlForms['primaryCaregiver'].inputs['isPrimaryCaregiverUnavailable'].getValue();
    const isActionRequiredIn30Days = wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].getValue();
    const showHide = isPrimaryCaregiverUnavailable && isActionRequiredIn30Days;

    needsWrap.classList.toggle('hiddenPage', showHide);
    tocLinks['needs'].classList.toggle('hiddenPage', showHide);

    ['behavioral', 'physical', 'medical', 'other'].forEach(page => {
      wlForms[page].form.parentElement.classList.toggle('hiddenPage', showHide);
      tocLinks[page].classList.toggle('hiddenPage', showHide);

      promises.push(
        new Promise(async resolve => {
          await sectionResets[page]();
          resolve();
        }),
      );
    });

    await Promise.allSettled(promises).then(results => {
      return;
    });
  }
  async function showHidePagesRelatedToICF() {
    const promises = [];

    const icfIsNoticeIssued = wlForms['icfDischarge'].inputs['icfIsNoticeIssued'].getValue();
    const icfIsICFResident = wlForms['icfDischarge'].inputs['icfIsICFResident'].getValue();
    const icfIsActionRequiredIn30Days = wlForms['icfDischarge'].inputs['icfIsActionRequiredIn30Days'].getValue();

    const icfAnyNo = [icfIsNoticeIssued, icfIsICFResident, icfIsActionRequiredIn30Days].some(answer =>
      answer.includes('no'),
    );

    ['intermittentSupports', 'childProtectionAgency', 'adultDayEmployment', 'dischargePlan'].forEach(page => {
      wlForms[page].form.parentElement.classList.toggle('hiddenPage', !icfAnyNo);
      tocLinks[page].classList.toggle('hiddenPage', !icfAnyNo);
      promises.push(
        new Promise(async resolve => {
          await sectionResets[page]();
          resolve();
        }),
      );
    });

    await Promise.allSettled(promises).then(results => {
      return;
    });
  }
  async function showHideImmediateNeeds() {
    const isRMChecked = isAnyCheckboxCheckedRiskMitigation();
    const isRMActionRequiredIn3oDays = wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue();
    const isNeedsActionRequiredIn30Days = wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].getValue();
    const showImmediateNeeds =
      isNeedsActionRequiredIn30Days.includes('yes') && isRMActionRequiredIn3oDays.includes('yes') && isRMChecked;

    wlForms['immediateNeeds'].form.parentElement.classList.toggle('hiddenPage', !showImmediateNeeds);
    tocLinks['immediateNeeds'].classList.toggle('hiddenPage', !showImmediateNeeds);
    wlForms['immediateNeeds'].inputs['immNeedsDescription'].toggleDisabled(!showImmediateNeeds);

    if (showImmediateNeeds) {
      wlForms['immediateNeeds'].inputs['immNeedsRequired'].setValue('immNeedsRequiredyes');
      await insertUpdateAssessment({
        value: 'yes',
        name: 'immNeedsRequired',
        type: 'radio',
        formName: 'immediateNeeds',
      });
    } else {
      await sectionResets['immediateNeeds']();
    }
  }
  //--------------------------------------------------
  function isConditionInputsAllYes() {
    return [
      wlForms['conditions'].inputs['otherThanMentalHealth'].getValue('otherThanMentalHealthyes'),
      wlForms['conditions'].inputs['before22'].getValue('before22yes'),
      wlForms['conditions'].inputs['isConditionIndefinite'].getValue('isConditionIndefiniteyes'),
    ].every(element => element === true);
  }
  function isAnyCheckboxCheckedRiskMitigation() {
    return [
      wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].getValue(),
    ].some(element => element === true);
  }
  function isAnyCheckboxCheckedBehaviors() {
    return [
      wlForms['behavioral'].inputs['risksIsPhysicalAggression'].getValue(),
      wlForms['behavioral'].inputs['risksIsSelfInjury'].getValue(),
      wlForms['behavioral'].inputs['risksIsFireSetting'].getValue(),
      wlForms['behavioral'].inputs['risksIsElopement'].getValue(),
      wlForms['behavioral'].inputs['risksIsSexualOffending'].getValue(),
      wlForms['behavioral'].inputs['risksIsOther'].getValue(),
    ].some(element => element === true);
  }
  function isAnyCheckboxCheckedBehaviorsDocs() {
    return [
      wlForms['behavioral'].inputs['risksHasPoliceReport'].getValue(),
      wlForms['behavioral'].inputs['risksHasIncidentReport'].getValue(),
      wlForms['behavioral'].inputs['risksHasBehaviorTracking'].getValue(),
      wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].getValue(),
      wlForms['behavioral'].inputs['risksHasOtherDocument'].getValue(),
    ].some(element => element === true);
  }
  function isAnyCheckboxCheckedPhysical() {
    return [
      wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].getValue(),
      wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].getValue(),
      wlForms['physical'].inputs['physicalNeedsIsOther'].getValue(),
    ].some(element => element === true);
  }
  function isAnyCheckboxCheckedMedical() {
    return [
      wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].getValue(),
      wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].getValue(),
      wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].getValue(),
      wlForms['medical'].inputs['medicalNeedsIsOther'].getValue(),
    ].some(element => element === true);
  }
  //--------------------------------------------------
  async function needsOtherCheck() {
    const hasCheckBehaviorOne = isAnyCheckboxCheckedBehaviors();
    const hasCheckBehaviorTwo = isAnyCheckboxCheckedBehaviorsDocs();
    const hasCheckPhysical = isAnyCheckboxCheckedPhysical();
    const hasCheckMedical = isAnyCheckboxCheckedMedical();

    const needsIsActionDisabled = (hasCheckBehaviorOne && hasCheckBehaviorTwo) || hasCheckPhysical || hasCheckMedical;
    wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(needsIsActionDisabled === false);

    if (!needsIsActionDisabled) {
      wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].setValue('');
      await insertUpdateAssessment({
        value: '',
        name: 'physicalNeedsDescription',
        type: 'text',
        formName: 'physical',
      });
    }
  }
  //--------------------------------------------------
  async function intermittentSupportsDetermination() {
    const data = [
      wlForms['intermittentSupports'].inputs['intSupIsSupportNeededIn12Months'].getValue(
        'intSupIsSupportNeededIn12Monthsyes',
      ),
      wlForms['intermittentSupports'].inputs['intSupIsStayingLivingArrangement'].getValue(
        'intSupIsStayingLivingArrangementyes',
      ),
      wlForms['intermittentSupports'].inputs['intSupIsActionRequiredIn30Days'].getValue(
        'intSupIsActionRequiredIn30Daysyes',
      ),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'intSupDeterminationyes' : 'intSupDeterminationno';

    wlForms['intermittentSupports'].inputs['intSupDetermination'].setValue(inputId);
    await insertUpdateAssessment({
      value: allHaveCheck ? 'yes' : 'no',
      name: 'intSupDetermination',
      type: 'radio',
      formName: 'intermittentSupports',
    });

    await currentNeedsDetermination();
  }
  async function icfDischargeDetermination() {
    const data = [
      wlForms['icfDischarge'].inputs['icfIsICFResident'].getValue('icfIsICFResidentyes'),
      wlForms['icfDischarge'].inputs['icfIsNoticeIssued'].getValue('icfIsNoticeIssuedyes'),
      wlForms['icfDischarge'].inputs['icfIsActionRequiredIn30Days'].getValue('icfIsActionRequiredIn30Daysyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'icfDeterminationyes' : 'icfDeterminationno';

    wlForms['icfDischarge'].inputs['icfDetermination'].setValue(inputId);
    await insertUpdateAssessment({
      value: allHaveCheck ? 'yes' : 'no',
      name: 'icfDetermination',
      type: 'radio',
      formName: 'icfDischarge',
    });
  }
  async function childProtectionAgencyDetermination() {
    const data = [
      wlForms['childProtectionAgency'].inputs['cpaIsReleasedNext12Months'].getValue('cpaIsReleasedNext12Monthsyes'),
      wlForms['childProtectionAgency'].inputs['cpaHasUnaddressableNeeds'].getValue('cpaHasUnaddressableNeedsyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'cpaDeterminationyes' : 'cpaDeterminationno';

    wlForms['childProtectionAgency'].inputs['cpaDetermination'].setValue(inputId);

    await insertUpdateAssessment({
      value: allHaveCheck ? 'yes' : 'no',
      name: 'cpaDetermination',
      type: 'radio',
      formName: 'childProtectionAgency',
    });

    await currentNeedsDetermination();
  }
  async function adultDayEmploymentDetermination() {
    const data = [
      wlForms['adultDayEmployment'].inputs['rwfNeedsMoreFrequency'].getValue('rwfNeedsMoreFrequencyyes'),
      wlForms['adultDayEmployment'].inputs['rwfNeedsServiceNotMetIDEA'].getValue('rwfNeedsServiceNotMetIDEAyes'),
      wlForms['adultDayEmployment'].inputs['rwfNeedsServicesNotMetOOD'].getValue('rwfNeedsServicesNotMetOODyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'rwfWaiverFundingRequiredyes' : 'rwfWaiverFundingRequiredno';

    wlForms['adultDayEmployment'].inputs['rwfWaiverFundingRequired'].setValue(inputId);

    await insertUpdateAssessment({
      value: allHaveCheck ? 'yes' : 'no',
      name: 'rwfWaiverFundingRequired',
      type: 'radio',
      formName: 'adultDayEmployment',
    });

    await currentNeedsDetermination();
  }
  async function dischargePlanDetermination() {
    const data = [
      wlForms['dischargePlan'].inputs['dischargeIsICFResident'].getValue('dischargeIsICFResidentyes'),
      wlForms['dischargePlan'].inputs['dischargeIsInterestedInMoving'].getValue('dischargeIsInterestedInMovingyes'),
      wlForms['dischargePlan'].inputs['dischargeHasDischargePlan'].getValue('dischargeHasDischargePlanyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'dischargeDeterminationyes' : 'dischargeDeterminationno';

    wlForms['dischargePlan'].inputs['dischargeDetermination'].setValue(inputId);

    await insertUpdateAssessment({
      value: allHaveCheck ? 'yes' : 'no',
      name: 'dischargeDetermination',
      type: 'radio',
      formName: 'dischargePlan',
    });

    await currentNeedsDetermination();
  }
  async function currentNeedsDetermination() {
    const isPrimaryCaregiverUnavailable =
      wlForms['primaryCaregiver'].inputs['isPrimaryCaregiverUnavailable'].getValue();
    const isActionRequiredIn30Days = wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].getValue();
    const isIndividualSkillsDeclined = wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].getValue();
    const risksIsRiskToSelf = wlForms['behavioral'].inputs['risksIsRiskToSelf'].getValue();
    const physicalNeedsIsPhysicalCareNeeded =
      wlForms['physical'].inputs['physicalNeedsIsPhysicalCareNeeded'].getValue();
    const medicalNeedsIsLifeThreatening = wlForms['medical'].inputs['medicalNeedsIsLifeThreatening'].getValue();
    const needsIsContinuousSupportRequired = wlForms['other'].inputs['needsIsContinuousSupportRequired'].getValue();
    const intSupDetermination = wlForms['intermittentSupports'].inputs['intSupDetermination'].getValue();
    const cpaDetermination = wlForms['childProtectionAgency'].inputs['cpaDetermination'].getValue();
    const rwfWaiverFundingRequired = wlForms['adultDayEmployment'].inputs['rwfWaiverFundingRequired'].getValue();
    const dischargeDetermination = wlForms['dischargePlan'].inputs['dischargeDetermination'].getValue();

    const conditions = [
      isPrimaryCaregiverUnavailable.includes('yes') && isActionRequiredIn30Days.includes('no'),
      isPrimaryCaregiverUnavailable.includes('no') && isIndividualSkillsDeclined.includes('yes'),
      risksIsRiskToSelf.includes('yes'),
      physicalNeedsIsPhysicalCareNeeded.includes('yes'),
      medicalNeedsIsLifeThreatening.includes('yes') && needsIsContinuousSupportRequired.includes('yes'),
      intSupDetermination.includes('yes'),
      cpaDetermination.includes('yes'),
      rwfWaiverFundingRequired.includes('yes'),
      dischargeDetermination.includes('yes'),
    ];

    let updateTo = 'no';

    for (const condition of conditions) {
      if (condition) {
        updateTo = 'yes';
      }
    }

    wlForms['currentNeeds'].inputs['unmetNeedsHas'].setValue(`unmetNeedsHas${updateTo}`);
    wlForms['currentNeeds'].inputs['unmetNeedsSupports'].toggleDisabled(updateTo === 'yes' ? false : true);

    if (updateTo === 'no') {
      wlForms['currentNeeds'].inputs['unmetNeedsSupports'].setValue('');
      wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(true);
      wlForms['currentNeeds'].inputs['unmetNeedsDescription'].setValue('');

      await insertUpdateAssessment({
        value: 'off',
        name: 'unmetNeedsSupports',
        type: 'radio',
        formName: 'currentNeeds',
      });

      await insertUpdateAssessment({
        value: '',
        name: 'unmetNeedsDescription',
        type: 'text',
        formName: 'currentNeeds',
      });
    }

    await insertUpdateAssessment({
      value: updateTo,
      name: 'unmetNeedsHas',
      type: 'radio',
      formName: 'currentNeeds',
    });

    updateFormCompletionStatus('currentNeeds');
    setConclusionWaiverFunded12Months();
  }
  //--------------------------------------------------
  function setConclusionUnmetNeeds() {
    const conditionPageAllYes = isConditionInputsAllYes();
    const isImmNeedsRequiredYes = wlForms['immediateNeeds'].inputs['immNeedsRequired'].getValue('immNeedsRequiredyes');
    const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
      'waivEnrollWaiverEnrollmentIsRequired'
    ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

    const isChecked = conditionPageAllYes && isWaiverEnrollRequiredYes && isImmNeedsRequiredYes;
    wlForms['conclusion'].inputs['conclusionUnmetNeeds'].setValue(isChecked);
  }
  function setConclusionWaiverFunded12Months() {
    const conditionPageAllYes = isConditionInputsAllYes();
    const isUnmetNeedsHasYes = wlForms['currentNeeds'].inputs['unmetNeedsHas'].getValue('unmetNeedsHasyes');
    const isUnmetNeedsSupportsYes =
      wlForms['currentNeeds'].inputs['unmetNeedsSupports'].getValue('unmetNeedsSupportsyes');
    const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
      'waivEnrollWaiverEnrollmentIsRequired'
    ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

    const isChecked = conditionPageAllYes && isUnmetNeedsHasYes && isUnmetNeedsSupportsYes && isWaiverEnrollRequiredYes;
    wlForms['conclusion'].inputs['conclusionWaiverFunded12Months'].setValue(isChecked);
  }
  function setConclusionDoesNotRequireWaiver() {
    const isWaiverEnrollRequiredNo = wlForms['waiverEnrollment'].inputs[
      'waivEnrollWaiverEnrollmentIsRequired'
    ].getValue('waivEnrollWaiverEnrollmentIsRequiredno');

    wlForms['conclusion'].inputs['conclusionDoesNotRequireWaiver'].setValue(isWaiverEnrollRequiredNo);
  }
  function setConclusionNotEligibleForWaiver() {
    const conditionPageAllYes = isConditionInputsAllYes();

    wlForms['conclusion'].inputs['conclusionNotEligibleForWaiver'].setValue(!conditionPageAllYes);
  }
  //--------------------------------------------------
  const onChangeCallbacks = {
    //* waitingListInfo
    currentLivingArrangement: async ({ value }) => {
      wlForms['waitingListInfo'].inputs['livingArrangementOther'].toggleDisabled(value !== 'Other');

      if (value !== 'Other') {
        wlForms['waitingListInfo'].inputs['livingArrangementOther'].setValue('');
        await insertUpdateAssessment({
          value: '',
          name: 'livingArrangementOther',
          type: 'text',
          formName: 'waitingListInfo',
        });
      }
    },
    //* currentAvailableServices
    isOtherService: async ({ value }) => {
      wlForms['currentAvailableServices'].inputs['otherDescription'].toggleDisabled(value === 'yes' ? false : true);

      if (value !== 'yes') {
        wlForms['currentAvailableServices'].inputs['otherDescription'].setValue('');
        await insertUpdateAssessment({
          value: '',
          name: 'otherDescription',
          type: 'text',
          formName: 'currentAvailableServices',
        });
      }
    },
    //* primaryCaregiver
    isPrimaryCaregiverUnavailable: async ({ value }) => {
      const promises = [];

      wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].toggleDisabled(value === 'yes' ? false : true);
      wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].toggleDisabled(value === 'yes' ? false : true);
      wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(value === 'no' ? false : true);

      if (value !== 'yes') {
        wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].setValue('');
        wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].setValue('');
        wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].setValue('');
        wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(true);

        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'unavailableDocumentation',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: 'no',
              name: 'isActionRequiredIn30Days',
              type: 'radio',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'actionRequiredDescription',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
      } else {
        wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].setValue('');
        wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].setValue('');
        wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].setValue('');
        wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(true);
        wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(true);

        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: 'no',
              name: 'isIndividualSkillsDeclined',
              type: 'radio',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'declinedSkillsDocumentation',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'declinedSkillsDescription',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
      }

      promises.push(
        new Promise(async resolve => {
          await showHideNeedsPages();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    isActionRequiredIn30Days: async ({ value }) => {
      const promises = [];

      wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(value === 'yes' ? false : true);
      wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(value === 'no' ? false : true);

      if (value !== 'yes') {
        wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'actionRequiredDescription',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
      } else {
        wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: 'no',
              name: 'isIndividualSkillsDeclined',
              type: 'radio',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
      }

      promises.push(
        new Promise(async resolve => {
          await showHideNeedsPages();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    isIndividualSkillsDeclined: async ({ value }) => {
      const promises = [];

      wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(value === 'yes' ? false : true);
      wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(value === 'yes' ? false : true);

      if (value !== 'yes') {
        wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].setValue('');
        wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'declinedSkillsDocumentation',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'declinedSkillsDescription',
              type: 'text',
              formName: 'primaryCaregiver',
            });
            resolve();
          }),
        );
      }

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    //* behavioral
    risksIs: async ({ name, value }) => {
      const promises = [];

      const isNotAppChecked = name === 'risksIsNone' && value === 'on';
      const hasCheck = isNotAppChecked ? false : isAnyCheckboxCheckedBehaviors();
      const hasCheckDocs = isAnyCheckboxCheckedBehaviorsDocs();
      const risksIsRiskToSelfInputId = hasCheck && hasCheckDocs ? 'risksIsRiskToSelfyes' : 'risksIsRiskToSelfno';

      wlForms['behavioral'].inputs['risksFrequencyDescription'].toggleDisabled(!hasCheck);
      if (!hasCheck) {
        wlForms['behavioral'].inputs['risksFrequencyDescription'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'risksFrequencyDescription',
              type: 'text',
              formName: 'behavioral',
            });
            resolve();
          }),
        );
      }

      wlForms['behavioral'].inputs['risksIsRiskToSelf'].setValue(risksIsRiskToSelfInputId);
      promises.push(
        new Promise(async resolve => {
          await insertUpdateAssessment({
            value: hasCheck && hasCheckDocs ? 'yes' : 'no',
            name: 'risksIsRiskToSelf',
            type: 'radio',
            formName: 'behavioral',
          });
          resolve();
        }),
      );

      [
        'risksIsNone',
        'risksIsPhysicalAggression',
        'risksIsSelfInjury',
        'risksIsFireSetting',
        'risksIsElopement',
        'risksIsSexualOffending',
        'risksIsOther',
      ].forEach(inputId => {
        wlForms['behavioral'].inputs[inputId].toggleRequired(hasCheck || isNotAppChecked ? false : true);

        if (wlForms['behavioral'].inputs[inputId].getValue()) {
          if (inputId === 'risksIsNone' && hasCheck) {
            wlForms['behavioral'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'behavioral',
                });
                resolve();
              }),
            );
          } else if (isNotAppChecked && inputId !== 'risksIsNone') {
            wlForms['behavioral'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'behavioral',
                });
                resolve();
              }),
            );
          }
        }
      });

      promises.push(
        new Promise(async resolve => {
          await needsOtherCheck();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    risksHas: async ({ name, value }) => {
      const promises = [];

      const isNotAppChecked = name === 'risksHasNoDocument' && value === 'on';
      const hasCheck = isAnyCheckboxCheckedBehaviors();
      const hasCheckDocs = isNotAppChecked ? false : isAnyCheckboxCheckedBehaviorsDocs();
      const risksIsRiskToSelfInputId = hasCheck && hasCheckDocs ? 'risksIsRiskToSelfyes' : 'risksIsRiskToSelfno';

      wlForms['behavioral'].inputs['risksIsRiskToSelf'].setValue(risksIsRiskToSelfInputId);
      promises.push(
        new Promise(async resolve => {
          await insertUpdateAssessment({
            value: hasCheck && hasCheckDocs ? 'yes' : 'no',
            name: 'risksIsRiskToSelf',
            type: 'radio',
            formName: 'behavioral',
          });
          resolve();
        }),
      );

      [
        'risksHasNoDocument',
        'risksHasPoliceReport',
        'risksHasIncidentReport',
        'risksHasBehaviorTracking',
        'risksHasPsychologicalAssessment',
        'risksHasOtherDocument',
      ].forEach(inputId => {
        wlForms['behavioral'].inputs[inputId].toggleRequired(hasCheck || isNotAppChecked ? false : true);

        if (wlForms['behavioral'].inputs[inputId].getValue()) {
          if (hasCheck && inputId === 'risksHasNoDocument') {
            wlForms['behavioral'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'behavioral',
                });
                resolve();
              }),
            );
          } else if (isNotAppChecked && inputId !== 'risksHasNoDocument') {
            wlForms['behavioral'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'behavioral',
                });
                resolve();
              }),
            );
          }
        }
      });

      promises.push(
        new Promise(async resolve => {
          await needsOtherCheck();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    risksHasOtherDocument: async ({ name, value }) => {
      wlForms['behavioral'].inputs['risksOtherDocumentDescription'].toggleDisabled(value === 'on' ? false : true);

      if (value !== 'on') {
        wlForms['behavioral'].inputs['risksOtherDocumentDescription'].setValue('');
        await insertUpdateAssessment({
          value: 'off',
          name: 'risksOtherDocumentDescription',
          type: 'text',
          formName: 'behavioral',
        });
      }
    },
    //* physical
    physicalNeeds: async ({ name, value }) => {
      const promises = [];

      const isNotAppChecked = name === 'physicalNeedsIsNone' && value === 'on';
      const hasCheck = isNotAppChecked ? false : isAnyCheckboxCheckedPhysical();
      const isPhysicalCareNeededInputId = hasCheck
        ? 'physicalNeedsIsPhysicalCareNeededyes'
        : 'physicalNeedsIsPhysicalCareNeededno';

      wlForms['physical'].inputs['physicalNeedsDescription'].toggleDisabled(!hasCheck);
      if (!hasCheck) {
        wlForms['physical'].inputs['physicalNeedsDescription'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'physicalNeedsDescription',
              type: 'text',
              formName: 'physical',
            });
            resolve();
          }),
        );
      }

      wlForms['physical'].inputs['physicalNeedsIsPhysicalCareNeeded'].setValue(isPhysicalCareNeededInputId);
      promises.push(
        new Promise(async resolve => {
          await insertUpdateAssessment({
            value: hasCheck ? 'yes' : 'no',
            name: 'physicalNeedsIsPhysicalCareNeeded',
            type: 'radio',
            formName: 'physical',
          });
          resolve();
        }),
      );

      [
        'physicalNeedsIsNone',
        'physicalNeedsIsPersonalCareNeeded',
        'physicalNeedsIsRiskDuringPhysicalCare',
        'physicalNeedsIsOther',
      ].forEach(inputId => {
        wlForms['physical'].inputs[inputId].toggleRequired(hasCheck || isNotAppChecked ? false : true);

        if (wlForms['physical'].inputs[inputId].getValue()) {
          if (hasCheck && inputId === 'physicalNeedsIsNone') {
            wlForms['physical'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'physical',
                });
                resolve();
              }),
            );
          } else if (isNotAppChecked && inputId !== 'physicalNeedsIsNone') {
            wlForms['physical'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'physical',
                });
                resolve();
              }),
            );
          }
        }
      });

      promises.push(
        new Promise(async resolve => {
          await needsOtherCheck();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    //* medical
    medicalNeeds: async ({ name, value }) => {
      const promises = [];

      const isNotAppChecked = name === 'medicalNeedsIsNone' && value === 'on';
      const hasCheck = isNotAppChecked ? false : isAnyCheckboxCheckedMedical();
      const inputId = hasCheck ? 'medicalNeedsIsLifeThreateningyes' : 'medicalNeedsIsLifeThreateningno';

      wlForms['medical'].inputs['medicalNeedsDescription'].toggleDisabled(!hasCheck);
      if (!hasCheck) {
        wlForms['medical'].inputs['medicalNeedsDescription'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'medicalNeedsDescription',
              type: 'text',
              formName: 'medical',
            });
            resolve();
          }),
        );
      }

      wlForms['medical'].inputs['medicalNeedsIsLifeThreatening'].setValue(inputId);
      promises.push(
        new Promise(async resolve => {
          await insertUpdateAssessment({
            value: hasCheck ? 'yes' : 'no',
            name: 'medicalNeedsIsLifeThreatening',
            type: 'radio',
            formName: 'medical',
          });
          resolve();
        }),
      );

      [
        'medicalNeedsIsNone',
        'medicalNeedsIsFrequentEmergencyVisit',
        'medicalNeedsIsOngoingMedicalCare',
        'medicalNeedsIsSpecializedCareGiveNeeded',
        'medicalNeedsIsOther',
      ].forEach(inputId => {
        wlForms['medical'].inputs[inputId].toggleRequired(hasCheck || isNotAppChecked ? false : true);

        if (wlForms['medical'].inputs[inputId].getValue()) {
          if (hasCheck && inputId === 'medicalNeedsIsNone') {
            wlForms['medical'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'medical',
                });
                resolve();
              }),
            );
          } else if (isNotAppChecked && inputId !== 'medicalNeedsIsNone') {
            wlForms['medical'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'medical',
                });
                resolve();
              }),
            );
          }
        }
      });

      promises.push(
        new Promise(async resolve => {
          await needsOtherCheck();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(async results => {
        await currentNeedsDetermination();
        return;
      });
    },
    //* other
    needsIsActionRequiredRequiredIn30Days: async ({ value }) => {
      const promises = [];

      const isNeedsActionRequiredYes = value === 'yes';
      const isRisksActionRequired = wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue();
      const showCurrentNeeds = !isNeedsActionRequiredYes || isRisksActionRequired.includes('no');

      wlForms['other'].inputs['needsIsContinuousSupportRequired'].toggleDisabled(isNeedsActionRequiredYes);
      if (isNeedsActionRequiredYes) {
        wlForms['other'].inputs['needsIsContinuousSupportRequired'].setValue('');
        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: 'no',
              name: 'needsIsContinuousSupportRequired',
              type: 'radio',
              formName: 'other',
            });
            resolve();
          }),
        );
      }

      wlForms['riskMitigation'].form.parentElement.classList.toggle('hiddenPage', isNeedsActionRequiredYes);
      tocLinks['riskMitigation'].classList.toggle('hiddenPage', isNeedsActionRequiredYes);
      if (isNeedsActionRequiredYes) {
        promises.push(
          new Promise(async resolve => {
            await sectionResets['riskMitigation']();
            resolve();
          }),
        );
      }

      wlForms['currentNeeds'].form.parentElement.classList.toggle('hiddenPage', !showCurrentNeeds);
      tocLinks['currentNeeds'].classList.toggle('hiddenPage', !showCurrentNeeds);
      if (!showCurrentNeeds) {
        promises.push(
          new Promise(async resolve => {
            await sectionResets['currentNeeds']();
            resolve();
          }),
        );
      }

      promises.push(
        new Promise(async resolve => {
          await showHideImmediateNeeds();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(results => {
        return;
      });
    },
    needsIsContinuousSupportRequired: async () => {
      await currentNeedsDetermination();
    },
    //* riskMitigation
    rMIs: async () => {
      const promises = [];

      const isNotAppChecked = name === 'rMIsNone' && value === 'on';
      const isRMChecked = isNotAppChecked ? false : isAnyCheckboxCheckedRiskMitigation();

      wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(!isRMChecked);
      wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(!isRMChecked);

      if (!isRMChecked) {
        wlForms['riskMitigation'].inputs['rMdescription'].setValue('');
        wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].setValue('');

        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: '',
              name: 'rMdescription',
              type: 'text',
              formName: 'riskMitigation',
            });
            resolve();
          }),
        );

        promises.push(
          new Promise(async resolve => {
            await insertUpdateAssessment({
              value: 'no',
              name: 'rMIsActionRequiredIn3oDays',
              type: 'radio',
              formName: 'riskMitigation',
            });
            resolve();
          }),
        );
      }

      [
        'rMIsNone',
        'rMIsAdultProtectiveServiceInvestigation',
        'rMIsCountyBoardInvestigation',
        'rMIsLawEnforcementInvestigation',
        'rMIsOtherInvestigation',
      ].forEach(inputId => {
        wlForms['riskMitigation'].inputs[inputId].toggleRequired(hasCheck || isNotAppChecked ? false : true);

        if (wlForms['riskMitigation'].inputs[inputId].getValue()) {
          if (hasCheck && inputId === 'rMIsNone') {
            wlForms['riskMitigation'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'riskMitigation',
                });
                resolve();
              }),
            );
          } else if (isNotAppChecked && inputId !== 'rMIsNone') {
            wlForms['riskMitigation'].inputs[inputId].setValue(false);
            promises.push(
              new Promise(async resolve => {
                await insertUpdateAssessment({
                  value: 'off',
                  name: inputId,
                  type: 'checkbox',
                  formName: 'riskMitigation',
                });
                resolve();
              }),
            );
          }
        }
      });

      promises.push(
        new Promise(async resolve => {
          await showHideImmediateNeeds();
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(results => {
        return;
      });
    },
    rMIsActionRequiredIn3oDays: async ({ value }) => {
      const promises = [];

      const isRisksActionRequired = value;
      const isNeedsActionRequired = wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].getValue();
      const showCurrentNeeds = isRisksActionRequired.includes('no') || isNeedsActionRequired.includes('no');
      const showICF = isRisksActionRequired.includes('no');
      const inputId = isRisksActionRequired.includes('yes') ? 'rMIsSupportNeededyes' : 'rMIsSupportNeededno';

      // Hide/Show Sections
      wlForms['icfDischarge'].form.parentElement.classList.toggle('hiddenPage', !showICF);
      tocLinks['icfDischarge'].classList.toggle('hiddenPage', !showICF);
      if (!showICF) {
        promises.push(
          new Promise(async resolve => {
            await sectionResets['icfDischarge']();
            resolve();
          }),
        );
      }

      wlForms['currentNeeds'].form.parentElement.classList.toggle('hiddenPage', !showCurrentNeeds);
      tocLinks['currentNeeds'].classList.toggle('hiddenPage', !showCurrentNeeds);
      if (!showCurrentNeeds) {
        promises.push(
          new Promise(async resolve => {
            await sectionResets['currentNeeds']();
            resolve();
          }),
        );
      }

      promises.push(
        new Promise(async resolve => {
          await showHideImmediateNeeds();
          resolve();
        }),
      );

      // Set Input
      wlForms['riskMitigation'].inputs['rMIsSupportNeeded'].setValue(inputId);
      promises.push(
        new Promise(async resolve => {
          await insertUpdateAssessment({
            value: isRisksActionRequired ? 'yes' : 'no',
            name: 'rMIsSupportNeeded',
            type: 'radio',
            formName: 'riskMitigation',
          });
          resolve();
        }),
      );

      await Promise.allSettled(promises).then(results => {
        return;
      });
    },
    //* icfDischarge
    icfIsICFResident: async ({ value }) => {
      await showHidePagesRelatedToICF();
      await icfDischargeDetermination();
    },
    icfIsNoticeIssued: async ({ value }) => {
      await showHidePagesRelatedToICF();
      await icfDischargeDetermination();
    },
    icfIsActionRequiredIn30Days: async ({ value }) => {
      await showHidePagesRelatedToICF();
      await icfDischargeDetermination();
    },
    //* intermittentSupports
    intSupIsSupportNeededIn12Months: intermittentSupportsDetermination,
    intSupIsStayingLivingArrangement: intermittentSupportsDetermination,
    intSupIsActionRequiredIn30Days: intermittentSupportsDetermination,
    //* childProtectionAgency
    cpaIsReleasedNext12Months: async ({ value }) => {
      wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].toggleDisabled(value === 'yes' ? false : true);

      if (value !== 'yes') {
        wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].setValue('');
        await insertUpdateAssessment({
          value: '',
          name: 'cpaAnticipateDate',
          type: 'date',
          formName: 'childProtectionAgency',
        });
      }

      await childProtectionAgencyDetermination();
    },
    cpaHasUnaddressableNeeds: childProtectionAgencyDetermination,
    //* adultDayEmployment
    rwfNeedsMoreFrequency: adultDayEmploymentDetermination,
    rwfNeedsServiceNotMetIDEA: adultDayEmploymentDetermination,
    rwfNeedsServicesNotMetOOD: adultDayEmploymentDetermination,
    //* dischargePlan
    dischargeIsICFResident: dischargePlanDetermination,
    dischargeIsInterestedInMoving: dischargePlanDetermination,
    dischargeHasDischargePlan: dischargePlanDetermination,
    //* currentNeeds
    unmetNeedsSupports: async ({ value }) => {
      wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(value === 'yes' ? false : true);

      setConclusionWaiverFunded12Months();

      if (value !== 'yes') {
        wlForms['currentNeeds'].inputs['unmetNeedsDescription'].setValue('');
        await insertUpdateAssessment({
          value: '',
          name: 'unmetNeedsDescription',
          type: 'text',
          formName: 'currentNeeds',
        });
      }
    },
    //* immediateNeeds
    immNeedsRequired: setConclusionUnmetNeeds,
    //* waiverEnrollment
    waivEnrollWaiverEnrollmentIsRequired: async ({ value }) => {
      wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(
        value === 'no' ? false : true,
      );

      setConclusionUnmetNeeds();
      setConclusionWaiverFunded12Months();
      setConclusionDoesNotRequireWaiver();

      if (value !== 'no') {
        wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].setValue('');
        await insertUpdateAssessment({
          value: '',
          name: 'waivEnrollWaiverEnrollmentDescription',
          type: 'text',
          formName: 'waiverEnrollment',
        });
      }
    },
  };
  const onChangeCallbacksFormWatch = {
    conditions: async ({ name, value }) => {
      const conditionPageAllYes = isConditionInputsAllYes();

      if (!conditionPageAllYes) {
        let promises = [];
        let formsToDelete = [];

        [
          'behavioral',
          'physical',
          'medical',
          'other',
          'waiverEnrollment',
          'riskMitigation',
          'icfDischarge',
          'intermittentSupports',
          'childProtectionAgency',
          'adultDayEmployment',
          'dischargePlan',
          'immediateNeeds',
          'currentNeeds',
          'currentAvailableServices',
          'primaryCaregiver',
        ].forEach(formName => {
          wlForms[formName].form.parentElement.classList.add('hiddenPage');
          tocLinks[formName].classList.add('hiddenPage');
          wlForms[formName].clear();
          tocLinks[formName].classList.remove('formComplete');
          if (sectionResets[formName]) {
            promises.push(
              new Promise(async resolve => {
                await sectionResets[formName]();
                resolve();
              }),
            );
          }

          if (wlFormInfo[formName].id) {
            formsToDelete.push(`${wlFormInfo[formName].id}|${wlFormInfo[formName].dbtable}`);
            wlFormInfo[formName].id = '';
          }
        });

        contributingCircumstancesWrap.classList.add('hiddenPage');
        needsWrap.classList.add('hiddenPage');

        toggleTocLinksDisabledStatus(['contributingCircumstances', 'needs'], true);

        if (formsToDelete.length) {
          promises.push(
            new Promise(async resolve => {
              await _UTIL.fetchData('deleteFromWaitingList', { properties: formsToDelete });
              resolve();
            }),
          );
          wlCircID = '';
          wlNeedID = '';
        }

        setConclusionUnmetNeeds();
        setConclusionWaiverFunded12Months();
        setConclusionNotEligibleForWaiver();

        await Promise.allSettled(promises).then(results => {
          return;
        });

        return;
      }

      contributingCircumstancesWrap.classList.remove('hiddenPage');
      wlForms['primaryCaregiver'].form.parentElement.classList.remove('hiddenPage');
      wlForms['waiverEnrollment'].form.parentElement.classList.remove('hiddenPage');
      wlForms['currentAvailableServices'].form.parentElement.classList.remove('hiddenPage');

      toggleTocLinksDisabledStatus(
        ['contributingCircumstances', 'primaryCaregiver', 'waiverEnrollment', 'currentAvailableServices'],
        false,
      );

      // get circumstance id
      if (!wlCircID) {
        const resp = await insertAssessmentData({
          id: 0,
          linkId: wlLinkID,
          propertyName: 'getCircumstanceId',
          value: '',
        });

        wlCircID = resp[0].newRecordId;
      }
      // get needs id
      if (!wlNeedID && wlCircID) {
        const resp = await insertAssessmentData({
          id: 0,
          linkId: wlCircID,
          propertyName: 'needsIsActionRequiredRequiredIn30Days',
          value: '',
        });
        wlNeedID = resp[0].newRecordId;
        wlFormInfo['other'].id = wlNeedID;
      }

      setConclusionUnmetNeeds();
      setConclusionWaiverFunded12Months();
      setConclusionNotEligibleForWaiver();
    },
  };
  async function onFormChange(event) {
    const type = event.target.type;
    const name = event.target.name;
    const id = event.target.id;
    const formName = event.target.form.name;
    let value = event.target.value;
    let checkboxGroupId;

    if (type === 'checkbox') {
      value = event.target.checked ? 'on' : 'off';
      checkboxGroupId = event.target.closest('fieldset')?.id;
    }

    await insertUpdateAssessment({ value, name, type, formName });

    if (onChangeCallbacks[name]) {
      await onChangeCallbacks[name]({ value, name });
    }

    if (onChangeCallbacks[checkboxGroupId]) {
      await onChangeCallbacks[checkboxGroupId]({ value, name });
    }

    if (onChangeCallbacksFormWatch[formName]) {
      await onChangeCallbacksFormWatch[formName]({
        value,
        name,
        formName,
      });
    }

    updateFormCompletionStatus(formName);
    toggleSendEmailDisabledStatus();
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    sendEmailButton.onClick(async () => {
      sendEmailPopup.show();
    });
    sendEmailForm.onSubmit(async (data, submitter) => {
      let resp = await _UTIL.fetchData('generateWaitingListAssessmentReport', {
        waitingListId: wlLinkID,
      });
      resp = resp.generateWaitingListAssessmentReportResult;

      const resp2 = await _UTIL.fetchData('sendWaitingListAssessmentReport', {
        header: data['emailHeader'],
        body: data['emailBody'],
        reportScheduleId: resp,
        waitingListId: wlLinkID,
      });

      sendEmailPopup.close();
    });
    sendEmailForm.onReset(() => {
      sendEmailPopup.close();
    });

    documentsButton.onClick(() => {
      documentsPopup.show();
    });
    documentsForm.onSubmit(async (data, submitter, formId) => {
      const attachDetails = await _DOM.getAttachmentDetails(data['test']);

      const documentId = await saveDocument(attachDetails);

      const fileName = _UTIL.truncateFilename(attachDetails.description, 10);
      wlDocuments[documentId] = {
        id: documentId,
        values: [fileName, attachDetails.type],
      };

      addNewDocumentToList({ documentId, fileName });

      documentsForm.clear();
    });
    documentsForm.onReset(() => {
      documentsPopup.close();
    });

    participantsForm.onSubmit(async (data, submitter, formId) => {
      if (formId) {
        await updateAssessmentData({
          id: formId,
          linkId: wlLinkID,
          propertyName: 'participants',
          value: data.participantName,
          valueTwo: data.participantRelationship,
        });
        wlParticipants[formId].values = [data.participantName, data.participantRelationship];
      } else {
        const resp = await insertAssessmentData({
          id: 0,
          linkId: wlLinkID,
          propertyName: 'participants',
          value: data.participantName,
          valueTwo: data.participantRelationship,
        });
        const participantId = resp[0].newRecordId;

        wlParticipants[participantId] = {
          id: participantId,
          values: [data.participantName, data.participantRelationship],
        };
      }

      // clear form
      participantsForm.clear();

      // repop table
      participantsTable.populate(Object.values(wlParticipants));

      tocLinks['participants'].classList.toggle('formComplete', Object.values(wlParticipants).length);
    });
    participantsTable.onRowClick(rowId => {
      const rowData = wlParticipants[rowId];
      participantsForm.populate(
        {
          participantName: rowData.values[0],
          participantRelationship: rowData.values[1],
        },
        rowId,
      );
    });
    participantsTable.onRowDelete(async rowId => {
      await _UTIL.fetchData('deleteWaitingListParticipant', {
        participantId: parseInt(rowId),
      });

      delete wlParticipants[rowId];

      participantsTable.populate(Object.values(wlParticipants));

      tocLinks['participants'].classList.toggle('formComplete', Object.values(wlParticipants).length);
    });

    backButton.onClick(() => {
      WaitingListOverview.init({ moduleHeader, moduleBody, selectedConsumer });
    });
  }
  function loadPage() {
    // Header
    consumerCard.renderTo(moduleHeader);
    const primaryButtonWrap = _DOM.createElement('div');
    backButton.renderTo(primaryButtonWrap);
    sendEmailButton.renderTo(primaryButtonWrap);
    documentsButton.renderTo(primaryButtonWrap);
    moduleHeader.appendChild(primaryButtonWrap);

    sendEmailForm.renderTo(sendEmailPopup.dialog);
    sendEmailPopup.renderTo(_DOM.ACTIONCENTER);

    doucmentsList = _DOM.createElement('div', { class: 'docList' });
    documentsPopup.dialog.appendChild(doucmentsList);
    documentsForm.renderTo(documentsPopup.dialog);
    documentsPopup.renderTo(_DOM.ACTIONCENTER);

    // Assessment
    for (section in sections) {
      const isContributingCircumstancesSubSection = [
        'needs',
        'primaryCaregiver',
        'riskMitigation',
        'icfDischarge',
        'intermittentSupports',
        'childProtectionAgency',
        'adultDayEmployment',
        'dischargePlan',
      ].includes(section);
      const isNeedsSubSection = ['behavioral', 'physical', 'medical', 'other'].includes(section);

      // Build TOC
      const className = isContributingCircumstancesSubSection || isNeedsSubSection ? 'subsection' : 'section';
      const tocSection = _DOM.createElement('p', { class: [className, section] });
      const tocSectionLink = _DOM.createElement('a', { href: `#${section}`, text: sections[section].name });
      const statusIcon = Icon.getIcon('error');
      tocSection.appendChild(tocSectionLink);
      tocSection.appendChild(statusIcon);
      tableOfContents.appendChild(tocSection);
      tocSection.classList.toggle('hiddenPage', !sections[section].enabled);
      tocLinks[section] = tocSection;

      // Build Form
      const sectionWrap = _DOM.createElement('div', { id: section, class: 'wlPage' });
      const sectionHeader = _DOM.createElement('h2', {
        text: section === 'icfDischarge' ? 'ICF Discharge' : _UTIL.convertCamelCaseToTitle(section),
      });
      sectionWrap.appendChild(sectionHeader);
      sectionWrap.classList.toggle('hiddenPage', !sections[section].enabled);

      if (section === 'participants') {
        participantsTable.renderTo(sectionWrap);
        participantsForm.renderTo(sectionWrap);
        assessmentWrap.appendChild(sectionWrap);
        continue;
      }

      if (section === 'contributingCircumstances') {
        contributingCircumstancesWrap = sectionWrap;
      }
      if (section === 'needs') {
        needsWrap = sectionWrap;
      }

      if (sections[section].formElements) {
        wlForms[section] = new Form({
          hideAllButtons: true,
          fields: sections[section].formElements,
          formName: section,
        });

        wlForms[section].renderTo(sectionWrap);
        wlForms[section].onChange(onFormChange);
      }

      if (isContributingCircumstancesSubSection) {
        contributingCircumstancesWrap.appendChild(sectionWrap);
      } else if (isNeedsSubSection) {
        needsWrap.appendChild(sectionWrap);
      } else {
        assessmentWrap.appendChild(sectionWrap);
      }
    }
  }
  function loadPageSkeleton() {
    moduleBody.innerHTML = '';
    moduleHeader.innerHTML = '';

    tableOfContents = _DOM.createElement('div', { class: 'waitingListTableOFContents' });
    assessmentWrap = _DOM.createElement('div', { class: 'waitingListAssessment' });

    moduleBody.appendChild(tableOfContents);
    moduleBody.appendChild(assessmentWrap);
  }

  // INIT (data & defaults)
  //--------------------------------------------------
  function initFormInfo() {
    return {
      waitingListInfo: { dbtable: 'WLA_Waiting_List_Information' },
      conditions: { dbtable: 'WLA_Conditions' },
      primaryCaregiver: { dbtable: 'WLA_Primary_Caregivers' },
      adultDayEmployment: { dbtable: 'WLA_Require_Waiver_Fundings' },
      childProtectionAgency: { dbtable: 'WLA_Child_Protection_Agencies' },
      currentAvailableServices: { dbtable: 'WLA_Active_Services' },
      currentNeeds: { dbtable: 'WLA_Unmet_Needs' },
      dischargePlan: { dbtable: 'WLA_Discharge_Plans' },
      icfDischarge: { dbtable: 'WLA_ICF_Discharges' },
      intermittentSupports: { dbtable: 'WLA_Intermitent_Supports' },
      immediateNeeds: { dbtable: 'WLA_Immediate_Needs' },
      riskMitigation: { dbtable: 'WLA_Risk_Mitigations' },
      waiverEnrollment: { dbtable: 'WLA_Waiver_Enrollments' },
      behavioral: { dbtable: 'WLA_Risks' },
      physical: { dbtable: 'WLA_Physical_Needs' },
      medical: { dbtable: 'WLA_Medical_Needs' },
      other: { dbtable: 'WLA_Needs' },
      conclusion: { dbtable: 'WLA_Waiting_List_Information' },
    };
  }
  function initComponents() {
    // Participants
    participantsTable = new Table({
      columnSortable: true,
      allowDelete: true,
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
    participantsForm = new Form({
      fields: [
        {
          type: 'text',
          label: 'Name of Participant',
          id: 'participantName',
          required: true,
        },
        {
          type: 'text',
          label: 'Relationship to Individual',
          id: 'participantRelationship',
          required: true,
        },
      ],
    });

    // Reports
    sendEmailButton = new Button({
      text: 'Send Report',
      style: 'primary',
      styleType: 'contained',
    });
    sendEmailForm = new Form({
      fields: [
        {
          type: 'text',
          label: 'Email Header',
          id: 'emailHeader',
        },
        {
          type: 'text',
          label: 'Email Body',
          id: 'emailBody',
        },
      ],
    });
    sendEmailPopup = new Dialog({ className: 'wlEmailPopup' });

    // Documents
    documentsButton = new Button({
      text: 'Add New Documentation',
      style: 'primary',
      styleType: 'contained',
    });
    documentsForm = new Form({
      fields: [
        { type: 'file', id: 'test', label: 'Document Upload' },
        { type: 'checkbox', id: 'email', label: 'Include in email?' },
      ],
    });
    documentsPopup = new Dialog({ className: 'wlDocumentPopup' });

    // Back to overview
    backButton = new Button({
      text: 'Back',
      style: 'primary',
      styleType: 'outlined',
    });

    // consumer card
    consumerCard = new RosterCard({
      consumerId: selectedConsumer.id,
      firstName: selectedConsumer.firstName,
      middleName: selectedConsumer.middleName,
      lastName: selectedConsumer.lastName,
    });
  }

  async function init(opts) {
    wlCircID = '';
    wlNeedID = '';
    wlForms = {};
    tocLinks = {};
    wlDocuments = [];
    wlParticipants = {};
    wlFormInfo = initFormInfo();
    wlData = mapDataBySection(opts.wlData);
    selectedConsumer = opts.selectedConsumer;
    moduleHeader = opts.moduleHeader;
    moduleBody = opts.moduleBody;

    loadPageSkeleton();
    initComponents();
    loadPage();
    attachEvents();

    const fundingSources = await getFundingSources();

    if (wlData) {
      enableSectionsForReview();
      enableInputsForReview();

      for (section in wlData) {
        wlForms[section].populate(wlData[section]);
        updateFormCompletionStatus(section);
      }

      participantsTable.populate(Object.values(wlParticipants));
      tocLinks['participants'].classList.toggle('formComplete', Object.values(wlParticipants).length);

      wlForms['conclusion'].inputs['fundingSourceId'].populate(fundingSources, wlData['conclusion'].fundingSourceId);

      setConclusionUnmetNeedsReview();
      setConclusionWaiverFunded12MonthsReview();
      setConclusionDoesNotRequireWaiverReview();
      setConclusionNotEligibleForWaiverReview();

      toggleSendEmailDisabledStatus();

      const docResp = await _UTIL.fetchData('getWLSupportingDocumentList', { waitingListInformationId: wlLinkID });
      for (const doc of docResp.getWLSupportingDocumentListResult) {
        const fileName = _UTIL.truncateFilename(doc.description, 10);
        wlDocuments[doc.supportingDocumentId] = {
          id: doc.supportingDocumentId,
          values: [fileName, doc.type],
        };

        addNewDocumentToList({ documentId: doc.supportingDocumentId, fileName });
      }

      return;
    }

    const resp = await insertNewWaitingListAssessment(selectedConsumer.id);
    wlLinkID = resp[0].newRecordId;
    wlFormInfo['waitingListInfo'].id = wlLinkID;
    wlFormInfo['conclusion'].id = wlLinkID;
    wlForms['conclusion'].inputs['fundingSourceId'].populate(fundingSources);
  }

  return { init };
})();