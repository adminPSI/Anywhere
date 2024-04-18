function enableSectionsForReview2() {
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
function enableInputsForReview2() {
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
function setConclusionUnmetNeeds2() {
  // [conclusionUnmetNeeds] "The individual has unmet..." should be selected if ALL of the following are true:
  //  a. All Questions on the CONDITIONS page have an answer of "YES"
  const conditionPageAllYes = isConditionInputsAllYes();
  //  b. "Is there an immediate need identified…" is YES on the IMMEDIATE NEEDS page
  const isImmNeedsRequiredYes = wlForms['immediateNeeds'].inputs['immNeedsRequired'].getValue('immNeedsRequiredyes');
  //  c. "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
  const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentIsRequired'].getValue(
    'waivEnrollWaiverEnrollmentIsRequiredyes',
  );

  const isChecked = conditionPageAllYes && isWaiverEnrollRequiredYes && isImmNeedsRequiredYes;
  wlForms['conclusion'].inputs['conclusionUnmetNeeds'].setValue(isChecked);
}
function setConclusionWaiverFunded12Months2() {
  // [conclusionWaiverFunded12Months] "The individual has needs..." should be selected if ALL of the following are true:
  //   a. All Questions on the CONDITIONS page have an answer of "YES"
  const conditionPageAllYes = isConditionInputsAllYes();
  //   b. [unmetNeedsHas] "Does the individual have an identified need?" is YES on the CURRENT NEEDS page
  const isUnmetNeedsHasYes = wlForms['currentNeeds'].inputs['unmetNeedsHas'].getValue('unmetNeedsHasyes');
  //   c. [unmetNeedsSupports] "If 'Yes', will any of those needs…" is YES on the CURRENT NEEDS page
  const isUnmetNeedsSupportsYes =
    wlForms['currentNeeds'].inputs['unmetNeedsSupports'].getValue('unmetNeedsSupportsyes');
  //   d. [waivEnrollWaiverEnrollmentIsRequired] "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
  const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentIsRequired'].getValue(
    'waivEnrollWaiverEnrollmentIsRequiredyes',
  );

  const isChecked = conditionPageAllYes && isUnmetNeedsHasYes && isUnmetNeedsSupportsYes && isWaiverEnrollRequiredYes;
  wlForms['conclusion'].inputs['conclusionWaiverFunded12Months'].setValue(isChecked);
}
function setConclusionDoesNotRequireWaiver2() {
  // [conclusionDoesNotRequireWaiver] "The individual does not require waiver..." should be selected
  // (IF) [waivEnrollWaiverEnrollmentIsRequired] "Will the unmet immeidate need…" is NO on the WAIVER ENROLLMENT page
  const isWaiverEnrollRequiredNo = wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentIsRequired'].getValue(
    'waivEnrollWaiverEnrollmentIsRequiredno',
  );

  wlForms['conclusion'].inputs['conclusionDoesNotRequireWaiver'].setValue(isWaiverEnrollRequiredNo);
}
function setConclusionNotEligibleForWaiver2() {
  // [conclusionNotEligibleForWaiver] "The individual is not eligible..." should be selected
  // (IF) Any of the questions on the CONDITIONS page have an answer of "NO"
  const conditionPageAllYes = isConditionInputsAllYes();

  wlForms['conclusion'].inputs['conclusionNotEligibleForWaiver'].setValue(!conditionPageAllYes);
}
//==========================================================================================
