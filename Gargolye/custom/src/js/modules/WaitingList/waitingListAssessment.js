const WaitingListAssessment = (() => {
  //--------------------------
  // SESSION DATA
  //--------------------------
  let wlData;
  let wlLinkID;
  let wlCircID;
  let wlNeedID;
  //--------------------------
  // PERMISSIONS
  //--------------------------
  let isReadOnly;
  //--------------------------
  // DOM
  //--------------------------
  let assessmentWrap;
  let tableOfContents;
  let contributingCircumstancesFormsWrap;
  let needsWrap;
  let tocLinks;
  //--------------------------
  // UI INSTANCES
  //--------------------------
  let wlForms;
  let participantsTable;
  let sendEmailButton;

  const sections = {
    waitingListInfo: {
      name: 'Waiting List Information',
      dbtable: 'WLA_Waiting_List_Information',
      enabled: true,
      formElements: [
        {
          label: 'Name of person completing assessment',
          id: 'personCompleting',
          type: 'text',
          required: true,
        },
        {
          label: 'Title of person completing assessment',
          id: 'personCompletingTitle',
          type: 'text',
          required: true,
        },
        {
          label: 'Describe the current living arrangement',
          id: 'currentLivingArrangement',
          type: 'select',
          required: true,
          data: [
            { value: '0', text: '' },
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
          required: true,
        },
        {
          label: 'In what areas does person report needing help?',
          id: 'areasPersonNeedsHelp',
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
          type: 'radiogroup',
          id: 'otherThanMentalHealth',
          required: true,
          groupLabel: `Does this person have a condition that is attributable to a mental or physical impairment or combination of mental and physical impairments, other than an impairment cuased solely by mental illness?`,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'otherThanMentalHealthyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'otherThanMentalHealthno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'before22',
          required: true,
          groupLabel: `Was the condition present before age 22?`,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'before22yes' },
            { type: 'radio', label: 'No', value: 'no', id: 'before22no' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isConditionIndefinite',
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
            { type: 'radio', label: 'Yes', value: 'yes', id: 'radiogroupyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'radiogroupno' },
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
            { type: 'radio', label: 'Yes', value: 'yes', id: 'unknownId1yes' },
            { type: 'radio', label: 'No', value: 'no', id: 'unknownId1no' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'isLevelOneWaiverService',
          groupLabel: 'Level One Waiver',
          required: true,
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'unknownId2yes' },
            { type: 'radio', label: 'No', value: 'no', id: 'unknownId2no' },
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
          disabled: true,
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
          note: 'This field is filled out by AI',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'medicalNeedsIsLifeThreateningyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'medicalNeedsIsLifeThreateningno' },
          ],
        },
        {
          type: 'checkboxgroup',
          id: 'medicalNeedsCheckboxes',
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
          note: 'This field is filled out by AI',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rMIsSupportNeededyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rMIsSupportNeededno' },
          ],
        },
        {
          type: 'checkboxgroup',
          id: 'openInvestigation',
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
          note: 'This field is filled out by AI',
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
          note: 'This field is filled out by AI',
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
          note: 'This field is filled out by AI',
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
          id: 'cpaAnticipatedDate',
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
            { type: 'radio', label: 'Yes', value: 'yes', id: 'cpaHadUnaddressableNeedsyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'cpaHadUnaddressableNeedsno' },
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
          note: 'This field is filled out by AI',
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
            'Are thhe needed services beyond what is available to the individual through the local school district / Individuals with Disabilities Education Act?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsServiceNotMetIDEAyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsServiceNotMetIDEAno' },
          ],
        },
        {
          type: 'radiogroup',
          id: 'rwfNeedsServiceNotMetOOD',
          required: true,
          groupLabel:
            'Are the needed services beyond what is available to the individual through Vocational Rehabilitation / Opportunities for Ohioans with Disabilities or other resources?',
          fields: [
            { type: 'radio', label: 'Yes', value: 'yes', id: 'rwfNeedsServiceNotMetOODyes' },
            { type: 'radio', label: 'No', value: 'no', id: 'rwfNeedsServiceNotMetOODno' },
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
          note: 'This field is filled out by AI',
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
          required: true,
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
          note: 'This field is filled out by AI',
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
        // conclussionDeterminedBy
        // conclusionDeterminedByTitle
        // conclusionDeterminedOn
        // conclusionResult
        {
          type: 'checkboxgroup',
          id: 'conclusion',
          groupLabel:
            'The options below is selected automatically based on answers provided throughout the assessment.',
          note: 'This field is filled out by AI',
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

  // UTILS
  //--------------------------------------------------

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
  async function insertUpdateAssessment({ value, name, type, formName, subFormName }) {
    // set radio/checkbox value
    if (type === 'radio' || type === 'checkbox') {
      value = value === 'yes' ? 1 : 0;
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
      ].includes(formName)
    ) {
      linkIdForSaveUpdate = wlCircID;
    } else if (['other', 'behavioral', 'physical', 'medical'].includes(formName)) {
      linkIdForSaveUpdate = wlNeedID;
    } else {
      linkIdForSaveUpdate = wlLinkID;
    }

    // save / update
    let hasId = false;
    hasId = wlFormInfo[formName].id === '' ? false : true;

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
        id: wlFormInfo[formName].id,
        linkId: formName === 'waitingListInfo' || formName === 'conclusion' ? 0 : linkIdForSaveUpdate,
        propertyName: name,
        value: value,
      });
    }
  }

  // EVENTS
  //--------------------------------------------------
  function isConditionInputsAllYes() {
    const conditionsInputValues = [
      wlForms['conditions'].inputs['otherThanMentalHealth'].getValue('otherThanMentalHealthyes'),
      wlForms['conditions'].inputs['before22'].getValue('before22yes'),
      wlForms['conditions'].inputs['isConditionIndefinite'].getValue('isConditionIndefiniteyes'),
    ];

    return conditionsInputValues.every(element => element === true);
  }
  function riskMitigationCheckboxes() {
    const data = [
      wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].getValue(),
    ];

    const hasCheck = data.some(element => element === true);

    // (ENABLE) [rMdescription] the "Describe incident under..." textbox (IF)
    // any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
    wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(!hasCheck);

    // (ENABLE) [rMIsActionRequiredIn3oDays] the "Is action required..." radio buttons (IF)
    // any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
    wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(!hasCheck);
  }
  function needsCheckboxes() {
    const behaviorCheckboxGroupOne = [
      wlForms['behavioral'].inputs['risksIsPhysicalAggression'].getValue(),
      wlForms['behavioral'].inputs['risksIsSelfInjury'].getValue(),
      wlForms['behavioral'].inputs['risksIsFireSetting'].getValue(),
      wlForms['behavioral'].inputs['risksIsElopement'].getValue(),
      wlForms['behavioral'].inputs['risksIsSexualOffending'].getValue(),
      wlForms['behavioral'].inputs['risksIsOther'].getValue(),
    ];

    const behaviorCheckboxGroupTwo = [
      wlForms['behavioral'].inputs['risksHasPoliceReport'].getValue(),
      wlForms['behavioral'].inputs['risksHasIncidentReport'].getValue(),
      wlForms['behavioral'].inputs['risksHasBehaviorTracking'].getValue(),
      wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].getValue(),
      wlForms['behavioral'].inputs['risksHasOtherDocument'].getValue(),
    ];
    const physicalCheckboxGroup = [
      wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].getValue(),
      wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].getValue(),
      wlForms['physical'].inputs['physicalNeedsIsOther'].getValue(),
    ];
    const medicalCheckboxGroup = [
      wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].getValue(),
      wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].getValue(),
      wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].getValue(),
      wlForms['medical'].inputs['medicalNeedsIsOther'].getValue(),
    ];

    const hasCheckBehaviorOne = behaviorCheckboxGroupOne.some(element => element === true);
    const hasCheckBehaviorTwo = behaviorCheckboxGroupTwo.some(element => element === true);
    const hasCheckPhysical = physicalCheckboxGroup.some(element => element === true);
    const hasCheckMedical = medicalCheckboxGroup.some(element => element === true);

    // (ENABLE) [risksFrequencyDescription] the "Describe type, frequency, and intensity of behavioral..." textbox (IF)
    // any of the checkboxes are checked in the first group of checkboxes EXCEPT the "Not applicable...checkbox"
    wlForms['behavioral'].inputs['risksFrequencyDescription'].toggleDisabled(!hasCheckBehaviorOne);

    // (ENABLE) [risksOtherDocumentDescription] the second textbox (under the second group of checkboxes" as long as the "Other" checkbox is checked in the second group of checkboxes.
    wlForms['behavioral'].inputs['risksOtherDocumentDescription'].toggleDisabled(
      wlForms['behavioral'].inputs['risksHasOtherDocument'].getValue() === true ? false : true,
    );

    // (SET) [risksIsRiskToSelf] "Is the individual a child / adult currently engaging..." to "YES" (IF)
    // There is at least one checkbox checked in each of the first two groups of checkboxes NOT including the "Not applicable…" checkboxes
    const risksIsRiskToSelfInputId =
      hasCheckBehaviorOne && hasCheckBehaviorTwo ? 'risksIsRiskToSelfyes' : 'risksIsRiskToSelfno';
    wlForms['behavioral'].inputs['risksIsRiskToSelf'].setValue(risksIsRiskToSelfInputId);

    // (ENABLE) [physicalNeedsDescription] the "Describe type, frequency, and intensity of physical..." textbox (IF)
    // any of the checkboxes are checked in the third group of checkboxes EXCEPT the "Not applicable...checkbox"
    wlForms['physical'].inputs['physicalNeedsDescription'].toggleDisabled(!hasCheckPhysical);

    // (SET) [physicalNeedsIsPhysicalCareNeeded] "Is the individual a child/adult with significant physical care needs?" to "YES" (IF)
    // There is at least one checkbox checked in the third group of checkboxes NOT including the "Not applicable…" checkboxes
    const physicalNeedsIsPhysicalCareNeededInputId = hasCheckPhysical
      ? 'physicalNeedsIsPhysicalCareNeededyes'
      : 'physicalNeedsIsPhysicalCareNeededno';
    wlForms['physical'].inputs['physicalNeedsIsPhysicalCareNeeded'].setValue(physicalNeedsIsPhysicalCareNeededInputId);

    // (ENABLE) [medicalNeedsDescription] the "Describe type, frequency, and intensity of medical..." textbox (IF)
    // any of the checkboxes are checked in the fourth group of checkboxes EXCEPT the "Not applicable..." checkbox
    wlForms['medical'].inputs['medicalNeedsDescription'].toggleDisabled(!hasCheckMedical);

    // (SET) [medicalNeedsIsLifeThreatening] "Is the individual a child/adult with significant or life-threatening medical needs?" to "YES" (IF)
    // There is at least one checkbox checked in the fourth group of checkboxes NOT including the "Not applicable…" checkboxes
    const inputId = hasCheckMedical ? 'medicalNeedsIsLifeThreateningyes' : 'medicalNeedsIsLifeThreateningno';
    wlForms['medical'].inputs['medicalNeedsIsLifeThreatening'].setValue(inputId);

    // (ENABLE) [needsIsActionRequiredRequiredIn30Days] the "Is action required within the next 30 days..." radio buttons only (IF)
    // A checkbox is checked in each of the first two groups of checkboxes (not including the "Not applicable…" checkboxes in each group) (OR)
    // A checkbox is checked in the third group of checkboxes (not including the "Not applicable…" checkbox) (OR)
    // A checkbox is checked in the fourth group of checkboxes (not including the "Not applicable…" checkbox) (OR)
    const needsIsActionDisabled = (hasCheckBehaviorOne && hasCheckBehaviorTwo) || hasCheckPhysical || hasCheckMedical;
    wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(!needsIsActionDisabled);
  }
  function intermittentSupportsDetermination() {
    // AI FIELD
    // (SET) [intSupDetermination] "Does the individual have an..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"

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
  }
  function icfDischargeDetermination() {
    // AI FIELD
    // (SET) [icfDetermination] "Is the individual a resident..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"

    const data = [
      wlForms['icfDischarge'].inputs['icfIsICFResident'].getValue('icfIsICFResidentyes'),
      wlForms['icfDischarge'].inputs['icfIsNoticeIssued'].getValue('icfIsNoticeIssuedyes'),
      wlForms['icfDischarge'].inputs['icfIsActionRequiredIn30Days'].getValue('icfIsActionRequiredIn30Daysyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'icfDeterminationyes' : 'icfDeterminationno';

    wlForms['icfDischarge'].inputs['icfDetermination'].setValue(inputId);
  }
  function childProtectionAgencyDetermination() {
    // AI FIELD
    // (SET) [cpaDetermination] "Is the individual reaching..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"

    const data = [
      wlForms['childProtectionAgency'].inputs['cpaIsReleasedNext12Months'].getValue('cpaIsReleasedNext12Monthsyes'),
      wlForms['childProtectionAgency'].inputs['cpaHadUnaddressableNeeds'].getValue('cpaHadUnaddressableNeedsyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'cpaDeterminationyes' : 'cpaDeterminationno';

    wlForms['childProtectionAgency'].inputs['cpaDetermination'].setValue(inputId);
  }
  function adultDayEmploymentDetermination() {
    // AI FIELD
    // (SET) [rwfWaiverFundingRequired] "Does the individual require..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"

    const data = [
      wlForms['adultDayEmployment'].inputs['rwfNeedsMoreFrequency'].getValue('rwfNeedsMoreFrequencyyes'),
      wlForms['adultDayEmployment'].inputs['rwfNeedsServiceNotMetIDEA'].getValue('rwfNeedsServiceNotMetIDEAyes'),
      wlForms['adultDayEmployment'].inputs['rwfNeedsServiceNotMetOOD'].getValue('rwfNeedsServiceNotMetOODyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'rwfWaiverFundingRequiredyes' : 'rwfWaiverFundingRequiredno';

    wlForms['adultDayEmployment'].inputs['rwfWaiverFundingRequired'].setValue(inputId);
  }
  function dischargePlanDetermination() {
    // AI FIELD
    // (SET) [dischargeDetermination] "Does the individual have a viable..." to "YES" (IF) all radio-button answers on this page are "Yes".. Otherwise, set to "NO"

    const data = [
      wlForms['dischargePlan'].inputs['dischargeIsICFResident'].getValue('dischargeIsICFResidentyes'),
      wlForms['dischargePlan'].inputs['dischargeIsInterestedInMoving'].getValue('dischargeIsInterestedInMovingyes'),
      wlForms['dischargePlan'].inputs['dischargeHasDischargePlan'].getValue('dischargeHasDischargePlanyes'),
    ];

    const allHaveCheck = data.every(element => element === true);
    const inputId = allHaveCheck ? 'dischargeDeterminationyes' : 'dischargeDeterminationno';

    wlForms['dischargePlan'].inputs['dischargeDetermination'].setValue(inputId);
  }
  function immediateNeedsDetermination() {
    // AI FIELD ??
    // (SET) [immNeedsRequired] "Is there an immediate need..." to YES only when the page is enabled.  Otherwise, set it to NO

    wlForms['immediateNeeds'].inputs['immNeedsRequired'].setValue();
  }
  //
  async function updatePageActiveStatus(subForm) {
    const conditionsInputValues = [
      wlForms['conditions'].inputs['otherThanMentalHealth'].getValue('otherThanMentalHealthyes'),
      wlForms['conditions'].inputs['before22'].getValue('before22yes'),
      wlForms['conditions'].inputs['isConditionIndefinite'].getValue('isConditionIndefiniteyes'),
    ];

    if (!conditionsInputValues.every(element => element === true)) {
      // conditions page inputs are NOT all YES
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
        // hide form

        wlForms[formName].form.parentElement.classList.add('hiddenPage');

        if (wlFormInfo[formName].id) {
          formsToDelete.push(`${wlFormInfo[formName].id}|${wlFormInfo[formName].dbtable}`);
          wlFormInfo[formName].id = '';
        }
      });

      if (formsToDelete.length === 0) return;

      await _UTIL.fetchData('deleteFromWaitingList', { properties: formsToDelete });
      wlCircID = '';
      wlNeedID = '';

      return;
    }

    // conditions page all inputs are yes
    contributingCircumstancesFormsWrap.classList.remove('hiddenPage');
    wlForms['primaryCaregiver'].form.parentElement.classList.remove('hiddenPage');
    needsWrap.classList.remove('hiddenPage');
    wlForms['behavioral'].form.parentElement.classList.remove('hiddenPage');
    wlForms['physical'].form.parentElement.classList.remove('hiddenPage');
    wlForms['medical'].form.parentElement.classList.remove('hiddenPage');
    wlForms['other'].form.parentElement.classList.remove('hiddenPage');
    wlForms['waiverEnrollment'].form.parentElement.classList.remove('hiddenPage');

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
    }

    //-------------------------------------------------------------------------------------------------------
    const needsIsActionRequiredRequiredIn30DaysYES = wlForms['other'].inputs[
      'needsIsActionRequiredRequiredIn30Days'
    ].getValue('needsIsActionRequiredRequiredIn30Daysyes');
    const needsIsActionRequiredRequiredIn30DaysNO = wlForms['other'].inputs[
      'needsIsActionRequiredRequiredIn30Days'
    ].getValue('needsIsActionRequiredRequiredIn30Daysno');
    const rMIsActionRequiredIn3oDaysYES = wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue(
      'rMIsActionRequiredIn3oDaysyes',
    );
    const rMIsActionRequiredIn3oDaysNO =
      wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue('rMIsActionRequiredIn3oDaysno');
    const riskMitigationCheckboxValues = [
      wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].getValue(),
      wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].getValue(),
    ];

    // needs page [needsIsActionRequiredRequiredIn30Days] is YES
    if (needsIsActionRequiredRequiredIn30DaysNO) {
      wlForms['riskMitigation'].form.parentElement.classList.remove('hiddenPage');
    } else {
      wlForms['riskMitigation'].form.parentElement.classList.add('hiddenPage');
    }

    // riskMitigation page [rMIsActionRequiredIn3oDays] is YES
    if (rMIsActionRequiredIn3oDaysYES) {
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
      wlForms['currentNeeds'].form.parentElement.classList.add('hiddenPage');
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
      wlForms['immediateNeeds'].form.parentElement.classList.add('hiddenPage');
    }
  }
  //
  function setConclusionUnmetNeeds() {
    // [conclusionUnmetNeeds] "The individual has unmet..." should always be uneditable and also be selected if ALL of the following are true:
    //   a.  All Questions on the CONDITIONS page have an answer of "YES"
    const conditionPageAllYes = isConditionInputsAllYes();
    //   b.  [immNeedsRequired] "Is there an immediate need identified…" is YES on the IMMEDIATE NEEDS page
    //   c.  [waivEnrollWaiverEnrollmentIsRequired] "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
    const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
      'waivEnrollWaiverEnrollmentIsRequired'
    ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

    const isChecked = conditionPageAllYes && isWaiverEnrollRequiredYes;
    wlForms['conclusion'].inputs['conclusionUnmetNeeds'].setValue(isChecked);
  }
  function setConclusionWaiverFunded12Months() {
    // [conclusionWaiverFunded12Months] "The individual has needs..." should always be uneditable and also should be selected if ALL of the following are true:
    //   a.   All Questions on the CONDITIONS page have an answer of "YES"
    const conditionPageAllYes = isConditionInputsAllYes();
    //   b.  [unmetNeedsHas] "Does the individual have an identified need?" is YES on the CURRENT NEEDS page
    const isUnmetNeedsHasYes = wlForms['currentNeeds'].inputs['unmetNeedsHas'].getValue('unmetNeedsHasyes');
    //   c.  [unmetNeedsSupports] "If 'Yes', will any of those needs…" is YES on the CURRENT NEEDS page
    const isUnmetNeedsSupportsYes =
      wlForms['currentNeeds'].inputs['unmetNeedsSupports'].getValue('unmetNeedsSupportsyes');
    //   d.  [waivEnrollWaiverEnrollmentIsRequired] "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
    const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
      'waivEnrollWaiverEnrollmentIsRequired'
    ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

    const isChecked = conditionPageAllYes && isUnmetNeedsHasYes && isUnmetNeedsSupportsYes && isWaiverEnrollRequiredYes;
    wlForms['conclusion'].inputs['conclusionWaiverFunded12Months'].setValue(isChecked);
  }
  function setConclusionDoesNotRequireWaiver() {
    // [conclusionDoesNotRequireWaiver] "The individual does not require waiver..." should always be uneditable and also should be selected if ALL of the following are true:
    //   a. [waivEnrollWaiverEnrollmentIsRequired] "Will the unmet immeidate need…" is NO on the WAIVER ENROLLMENT page
    const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
      'waivEnrollWaiverEnrollmentIsRequired'
    ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

    wlForms['conclusion'].inputs['conclusionDoesNotRequireWaiver'].setValue(isWaiverEnrollRequiredYes);
  }
  function setConclusionNotEligibleForWaiver() {
    // [conclusionNotEligibleForWaiver] "The individual is not eligible..." should be selected if ALL of the following are true:
    //   a.  Any of the questions on the CONDITIONS page have an answer of "NO"
    const conditionPageAllYes = isConditionInputsAllYes();

    wlForms['conclusion'].inputs['conclusionNotEligibleForWaiver'].setValue(conditionPageAllYes);
  }
  //
  const onChangeCallbacks = {
    //* waitingListInfo
    currentLivingArrangement: ({ name, value, formName }) => {
      // (ENABLE) [livingArrangementOther] the "Other Living Arrangement" field only (IF)
      // [currentLivingArrangement] "Other" is selected in the "Describe Current Living Arrangement" drodown

      const data = wlForms['waitingListInfo'].inputs['currentLivingArrangement'].getValue();
      wlForms['waitingListInfo'].inputs['livingArrangementOther'].toggleDisabled(data === '0' ? false : true);
    },
    //* currentAvailableServices
    isOtherService: ({ name, value, formName, id }) => {
      // (ENABLE) [otherDescription] the text field under "Other" only (IF)
      // [isOtherService] the answer is "Yes" to Other

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
      // (ENABLE) [declinedSkillsDocumentation] "List documentation used to verify presence..." textbox (IF)
      // [isIndividualSkillsDeclined] "Is there evidence of declining..." question is "Yes".
      // (ENABLE) [declinedSkillsDescription] "Describe decline." textbox (IF)
      // [isIndividualSkillsDeclined] "Is there evidence of declining..." question is "Yes".

      const isYesChecked = wlForms[formName].inputs['isIndividualSkillsDeclined'].getValue(
        'isIndividualSkillsDeclinedyes',
      );

      wlForms[formName].inputs['declinedSkillsDocumentation'].toggleDisabled(!isYesChecked);
      wlForms[formName].inputs['declinedSkillsDescription'].toggleDisabled(!isYesChecked);
    },
    //* needs
    // behavioral checkbox group 1
    risksIsPhysicalAggression: needsCheckboxes,
    risksIsSelfInjury: needsCheckboxes,
    risksIsFireSetting: needsCheckboxes,
    risksIsElopement: needsCheckboxes,
    risksIsSexualOffending: needsCheckboxes,
    risksIsOther: needsCheckboxes,
    // behavioral checkbox group 2
    risksHasPoliceReport: needsCheckboxes,
    risksHasIncidentReport: needsCheckboxes,
    risksHasBehaviorTracking: needsCheckboxes,
    risksHasPsychologicalAssessment: needsCheckboxes,
    risksHasOtherDocument: needsCheckboxes,
    // physical checkbox group
    physicalNeedsIsPersonalCareNeeded: needsCheckboxes,
    physicalNeedsIsRiskDuringPhysicalCare: needsCheckboxes,
    physicalNeedsIsOther: needsCheckboxes,
    // medical checkbox group
    medicalNeedsIsFrequentEmergencyVisit: needsCheckboxes,
    medicalNeedsIsOngoingMedicalCare: needsCheckboxes,
    medicalNeedsIsSpecializedCareGiveNeeded: needsCheckboxes,
    medicalNeedsIsOther: needsCheckboxes,
    // needs other section
    needsIsActionRequiredRequiredIn30Days: ({ name, value, formName }) => {
      // (ENABLE) [needsIsContinuousSupportRequired] the "If No, do the significant..." radio buttons only (IF) the following are ALL true:
      // needsIsActionRequiredRequiredIn30Days
      //   a. The "Is action required within the next 30 days…" radio buttons are enabled AND
      //   b.  The answer to "Is action required within the next 30 days…" is "No"

      const isNoChecked = wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].getValue(
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

      const inputId = isYesChecked ? 'rMIsSupportNeededyes' : 'rMIsSupportNeededno';
      wlForms[formName].inputs['rMIsSupportNeeded'].setValue(inputId);
    },
    rMIsAdultProtectiveServiceInvestigation: riskMitigationCheckboxes,
    rMIsCountyBoardInvestigation: riskMitigationCheckboxes,
    rMIsLawEnforcementInvestigation: riskMitigationCheckboxes,
    rMIsOtherInvestigation: riskMitigationCheckboxes,
    //* icfDischarge
    icfIsICFResident: icfDischargeDetermination,
    icfIsNoticeIssued: icfDischargeDetermination,
    icfIsActionRequiredIn30Days: icfDischargeDetermination,
    //* intermittentSupports
    intSupIsSupportNeededIn12Months: intermittentSupportsDetermination,
    intSupIsStayingLivingArrangement: intermittentSupportsDetermination,
    intSupIsActionRequiredIn30Days: intermittentSupportsDetermination,
    //* childProtectionAgency
    cpaIsReleasedNext12Months: ({ name, value, formName }) => {
      // (ENABLE) [cpaAnticipatedDate] the "Anticipated Date" field only
      // (IF) [cpaIsReleasedNext12Months] "Is individual being released..." is answered "Yes".

      const isYesChecked =
        wlForms[formName].inputs['cpaIsReleasedNext12Months'].getValue('cpaIsReleasedNext12Monthsyes');

      wlForms[formName].inputs['cpaAnticipatedDate'].toggleDisabled(!isYesChecked);
    },
    cpaIsReleasedNext12Months: childProtectionAgencyDetermination,
    cpaHadUnaddressableNeeds: childProtectionAgencyDetermination,
    //* adultDayEmployment
    rwfNeedsMoreFrequency: adultDayEmploymentDetermination,
    rwfNeedsServiceNotMetIDEA: adultDayEmploymentDetermination,
    rwfNeedsServiceNotMetOOD: adultDayEmploymentDetermination,
    //* dischargePlan
    dischargeIsICFResident: dischargePlanDetermination,
    dischargeIsInterestedInMoving: dischargePlanDetermination,
    dischargeHasDischargePlan: dischargePlanDetermination,
    //* currentNeeds
    unmetNeedsSupports: ({ name, value, formName }) => {
      // (ENABLE) [unmetNeedsDescription] "If 'Yes', describe the unmet need:" text box only
      // (IF)[unmetNeedsSupports] "If 'Yes', will any of those needs..." is YES

      const isYesChecked = wlForms[formName].inputs['unmetNeedsSupports'].getValue('unmetNeedsSupportsyes');
      wlForms[formName].inputs['unmetNeedsDescription'].toggleDisabled(isYesChecked);

      setConclusionWaiverFunded12Months({ name, value, formName });
    },
    unmetNeedsHas: ({ name, value, formName }) => {
      // (ENABLE) [unmetNeedsSupports] "If 'Yes', will any of those needs..." only
      // (IF) [unmetNeedsHas] "Does the individual have an identified need?" is YES

      const isYesChecked = wlForms[formName].inputs['unmetNeedsHas'].getValue('unmetNeedsHasyes');
      wlForms[formName].inputs['unmetNeedsSupports'].toggleDisabled(isYesChecked);

      setConclusionWaiverFunded12Months({ name, value, formName });
    },
    //* immediateNeeds
    immNeedsRequired: setConclusionUnmetNeeds,
    //* waiverEnrollment
    waivEnrollWaiverEnrollmentIsRequired: ({ name, value, formName }) => {
      // (ENABLE) [waivEnrollWaiverEnrollmentDescription] the "If 'No', describe the...' textbox only
      // (IF)[waivEnrollWaiverEnrollmentIsRequired] "Will the unmet need..." is YES on the same page.
      const isYesChecked = wlForms[formName].inputs['waivEnrollWaiverEnrollmentIsRequired'].getValue(
        'waivEnrollWaiverEnrollmentIsRequiredyes',
      );
      wlForms[formName].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(isYesChecked);

      setConclusionUnmetNeeds({ name, value, formName });
      setConclusionWaiverFunded12Months({ name, value, formName });
      setConclusionDoesNotRequireWaiver({ name, value, formName });
    },
  };
  const onChangeCallbacksFormWatch = {
    conditions: ({ name, value, formName, subForm }) => {
      updatePageActiveStatus(subForm);
      setConclusionUnmetNeeds({ name, value, formName, subForm });
      setConclusionWaiverFunded12Months({ name, value, formName, subForm });
      setConclusionNotEligibleForWaiver({ name, value, formName, subForm });
    },
    behavioral: ({ name, value, formName, subForm }) => {
      updatePageActiveStatus(subForm);
    },
    physical: ({ name, value, formName, subForm }) => {
      updatePageActiveStatus(subForm);
    },
    medical: ({ name, value, formName, subForm }) => {
      updatePageActiveStatus(subForm);
    },
    other: ({ name, value, formName, subForm }) => {
      updatePageActiveStatus(subForm);
    },
    riskMitigation: ({ name, value, formName, subForm }) => {
      updatePageActiveStatus(subForm);
    },
  };
  function handleInputSpecificOnChange({ value, name, formName, subForm, id }) {
    if (onChangeCallbacks[name]) {
      onChangeCallbacks[name]({
        value,
        name,
        formName,
        subForm,
        id,
      });
    }
  }
  function handleFormSpecificOnChange({ value, name, formName, subForm }) {
    if (onChangeCallbacksFormWatch[formName]) {
      onChangeCallbacksFormWatch[formName]({
        value,
        name,
        formName,
        subForm,
      });
    }
  }
  function onFormChange(form, subForm) {
    const formName = form;
    const subFormName = subForm;

    return async function inputChange(event) {
      let value = event.target.value;
      const name = event.target.name;
      const id = event.target.id;
      const type = event.target.type;

      handleInputSpecificOnChange({ value, name, formName, subForm, id });

      await insertUpdateAssessment({ value, name, type, formName, subFormName });

      handleFormSpecificOnChange({ value, name, formName, subForm });
    };
  }

  // MAIN
  //--------------------------------------------------
  function attachEvents() {
    sendEmailButton.onClick(async () => {
      const emailDialog = new Dialog({});
      const emailForm = new Form({
        fields: [
          {
            type: 'text',
            label: 'Email Header',
            name: 'emailHeader',
          },
          {
            type: 'text',
            label: 'Email Body',
            name: 'emailBody',
          },
        ],
      });

      emailForm.onSubmit(async (data, submitter) => {
        const resp = await _UTIL.fetchData('generateWaitingListAssessmentReport', {
          waitingListId: '10',
        });

        if (resp !== '1') return;

        const resp2 = await _UTIL.fetchData('sendWaitingListAssessmentReport', {
          header: 'Test header for WLID: 10',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu orci, cursus sit amet nunc nec, faucibus cursus metus. Suspendisse potenti. Curabitur blandit mauris ac tempor vulputate. ',
        });
      });
    });

    documentsButton.onClick(() => {
      const docPopup = new Dialog({ className: 'wlDocumentPopup' });
      const docForm = new Form({ fields: [{ type: 'file', id: 'test' }] });
      docForm.renderTo(docPopup);
      docPopup.renderTo(moduleHeader);
      docPopup.show();

      docForm.onSubmit(data => {
        // _UTIL.fetchData('addWlSupportingDocument', {
        //   waitingListInformationId: '',
        //   description: '',
        //   includeOnEmail: '',
        //   attachmentType: '',
        //   attachment: '',
        // });

        docPopup.close();
        docPopup.dialog.remove();
      });
    });

    let partCache = [];

    participantsForm.onSubmit(async (data, submitter) => {
      // save particpants
      const newParticiapntID = await insertAssessmentData({
        id: 0,
        linkId: wlLinkID,
        propertyName: 'participants',
        value: data.participantName,
        valueTwo: data.participantRelationship,
      });

      partCache.push({
        id: newParticiapntID,
        values: [data.participantName, data.participantRelationship],
      });

      // clear form
      participantsForm.clear();

      // repop table
      participantsTable.clear();
      participantsTable.populate(partCache);
    });
  }
  function loadPage() {
    // Header
    sendEmailButton.renderTo(moduleHeader);
    documentsButton.renderTo(moduleHeader);

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
      const className = isContributingCircumstancesSubSection ? 'subsection' : 'section';
      const tocSection = _DOM.createElement('p', { class: className });
      const tocSectionLink = _DOM.createElement('a', { href: `#${section}`, text: sections[section].name });
      tocSection.appendChild(tocSectionLink);
      tableOfContents.appendChild(tocSection);
      tocSection.classList.toggle('hiddenPage', !sections[section].enabled);
      tocLinks[section] = tocSection;

      // Build Form
      const sectionWrap = _DOM.createElement('div', { id: section, class: 'wlPage' });
      const sectionHeader = _DOM.createElement('h2', { text: _UTIL.convertCamelCaseToTitle(section) });
      sectionWrap.appendChild(sectionHeader);
      sectionWrap.classList.toggle('hiddenPage', !sections[section].enabled);

      if (section === 'participants') {
        participantsTable.renderTo(sectionWrap);
        participantsForm.renderTo(sectionWrap);
        assessmentWrap.appendChild(sectionWrap);
        continue;
      }

      if (section === 'contributingCircumstances') {
        contributingCircumstancesFormsWrap = sectionWrap;
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
        wlForms[section].onChange(onFormChange(section));
        wlFormInfo[section].id = '';
      }

      if (isContributingCircumstancesSubSection) {
        contributingCircumstancesFormsWrap.appendChild(sectionWrap);
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
      //------
      conclusion: { dbtable: 'WLA_Waiting_List_Information' },
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
    participantsForm = new Form({
      fields: [
        {
          type: 'text',
          label: 'Name of Participant',
          id: 'participantName',
        },
        {
          type: 'text',
          label: 'Relationship to Individual',
          id: 'participantRelationship',
        },
      ],
    });
    sendEmailButton = new Button({
      text: 'Send Report',
      style: 'primary',
      styleType: 'contained',
    });
    sendEmailForm = new Form({
      hideAllButtons: true,
      fields: [
        {
          label: 'Document',
          type: 'file',
        },
      ],
    });
    documentsButton = new Button({
      text: 'Add New Documentation',
      style: 'primary',
      styleType: 'contained',
    });
  }

  async function init(opts) {
    wlForms = {};
    tocLinks = {};
    wlFormInfo = initFormInfo();
    wlData = opts.wlData;
    selectedConsumer = opts.selectedConsumer;
    moduleHeader = opts.moduleHeaderEle;
    moduleBody = opts.moduleBodyEle;

    loadPageSkeleton();
    initComponents();
    loadPage();
    attachEvents();

    const resp = await insertNewWaitingListAssessment(selectedConsumer);
    wlLinkID = resp[0].newRecordId;
    wlFormInfo['waitingListInfo'].id = wlLinkID;
    wlFormInfo['conclusion'].id = wlLinkID;

    const resp2 = await _UTIL.fetchData('getWaitingListFundingSources');
    const fundingSources = resp2.getWaitingListFundingSourcesResult;
    wlForms['conclusion'].inputs['fundingSourceId'].populate(
      fundingSources.map(fs => {
        return {
          value: fs.fundingSourceId,
          text: fs.description,
        };
      }),
    );
  }

  return { init };
})();
