// function enableSectionsForReview2() {
//   const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
//   const isBefore22Yes = wlData.conditions.before22.includes('yes');
//   const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');

//   if (!isOtherThanMentalHealthYes || !isBefore22Yes || !isConditionIndefiniteYes) {
//     return;
//   }

//   contributingCircumstancesWrap.classList.remove('hiddenPage');
//   wlForms['primaryCaregiver'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['waiverEnrollment'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['currentAvailableServices'].form.parentElement.classList.remove('hiddenPage');

//   tocLinks['contributingCircumstances'].classList.remove('hiddenPage');
//   tocLinks['primaryCaregiver'].classList.remove('hiddenPage');
//   tocLinks['waiverEnrollment'].classList.remove('hiddenPage');
//   tocLinks['currentAvailableServices'].classList.remove('hiddenPage');

//   const isActionRequiredIn30DaysNo = wlData.primaryCaregiver.isActionRequiredIn30Days.includes('no');
//   const isPrimaryCaregiverUnavailableYes = wlData.primaryCaregiver.isPrimaryCaregiverUnavailable.includes('yes');

//   if (isActionRequiredIn30DaysNo && isPrimaryCaregiverUnavailableYes) {
//     needsWrap.classList.remove('hiddenPage');
//     wlForms['behavioral'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['physical'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['medical'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['needs'].classList.remove('hiddenPage');
//     tocLinks['behavioral'].classList.remove('hiddenPage');
//     tocLinks['physical'].classList.remove('hiddenPage');
//     tocLinks['medical'].classList.remove('hiddenPage');
//   }

//   const isNeedActionRequiredYes = wlData.other.needsIsActionRequiredRequiredIn30Days.includes('yes');
//   const isNeedActionRequiredNo = wlData.other.needsIsActionRequiredRequiredIn30Days.includes('no');

//   if (isNeedActionRequiredNo) {
//     wlForms['riskMitigation'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['riskMitigation'].classList.remove('hiddenPage');
//   }

//   const isRMActionRequiredNo = wlData.riskMitigation.rMIsActionRequiredIn3oDays.includes('no');
//   const isRMActionRequiredYes = wlData.riskMitigation.rMIsActionRequiredIn3oDays.includes('yes');

//   if (isRMActionRequiredNo) {
//     wlForms['icfDischarge'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['icfDischarge'].classList.remove('hiddenPage');
//   }

//   if (
//     (!isRMActionRequiredYes && wlData.riskMitigation.rMIsActionRequiredIn3oDays !== '') &&
//     (!isNeedActionRequiredYes && wlData.other.needsIsActionRequiredRequiredIn30Days !== '')
//   ) {
//     wlForms['currentNeeds'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['currentNeeds'].classList.remove('hiddenPage');
//   }

//   const isAdultProtectiveServiceInvestigationChecked = wlData.riskMitigation.rMIsAdultProtectiveServiceInvestigation;
//   const isCountyBoardInvestigationChecked = wlData.riskMitigation.rMIsCountyBoardInvestigation;
//   const isLawEnforcementInvestigationChecked = wlData.riskMitigation.rMIsLawEnforcementInvestigation;
//   const isOtherInvestigationChecked = wlData.riskMitigation.rMIsOtherInvestigation;

//   if (
//     ((isAdultProtectiveServiceInvestigationChecked ||
//       isCountyBoardInvestigationChecked ||
//       isLawEnforcementInvestigationChecked ||
//       isOtherInvestigationChecked) &&
//       isRMActionRequiredYes) ||
//     isNeedActionRequiredYes
//   ) {
//     wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['immediateNeeds'].classList.remove('hiddenPage');
//   }

//   const icfIsICFResident = wlData.icfDischarge.icfIsICFResident.includes('no');
//   const icfIsNoticeIssued = wlData.icfDischarge.icfIsNoticeIssued.includes('no');
//   const icfIsActionRequiredIn30Days = wlData.icfDischarge.icfIsActionRequiredIn30Days.includes('no');

//   if (icfIsICFResident || icfIsNoticeIssued || icfIsActionRequiredIn30Days) {
//     ['intermittentSupports', 'childProtectionAgency', 'adultDayEmployment', 'dischargePlan'].forEach(page => {
//       wlForms[page].form.parentElement.classList.remove('hiddenPage');
//       tocLinks[page].classList.remove('hiddenPage');
//     });
//   }
// }
// function enableInputsForReview() {
//   // waitingListInfo
//   //-------------------------------
//   if (wlData.waitingListInfo.currentLivingArrangement === 'Other') {
//     wlForms.waitingListInfo.inputs['livingArrangementOther'].toggleDisabled(false);
//   }

//   // currentAvailableServices
//   //-------------------------------
//   if (wlData.currentAvailableServices.isOtherService.includes('yes')) {
//     wlForms['currentAvailableServices'].inputs['otherDescription'].toggleDisabled(false);
//   }

//   // primaryCaregiver
//   //-------------------------------
//   if (wlData.primaryCaregiver.isPrimaryCaregiverUnavailable.includes('yes')) {
//     wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].toggleDisabled(false);
//     wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].toggleDisabled(false);
//   } else {
//     wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(false);
//   }
//   if (wlData.primaryCaregiver.isActionRequiredIn30Days.includes('yes')) {
//     wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(false);
//   }
//   if (wlData.primaryCaregiver.isIndividualSkillsDeclined.includes('yes')) {
//     wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(false);
//     wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(false);
//   }

//   // needs
//   //-------------------------------
//   const hasCheckBehavioral = [
//     wlData.behavioral.risksIsNone,
//     wlData.behavioral.risksIsPhysicalAggression,
//     wlData.behavioral.risksIsSelfInjury,
//     wlData.behavioral.risksIsFireSetting,
//     wlData.behavioral.risksIsElopement,
//     wlData.behavioral.risksIsSexualOffending,
//     wlData.behavioral.risksIsOther,
//   ].some(value => value === true);
//   const hasCheckBehavioralDocs = [
//     wlData.behavioral.risksHasNoDocument,
//     wlData.behavioral.risksHasPoliceReport,
//     wlData.behavioral.risksHasIncidentReport,
//     wlData.behavioral.risksHasBehaviorTracking,
//     wlData.behavioral.risksHasPsychologicalAssessment,
//     wlData.behavioral.risksHasOtherDocument,
//   ].some(value => value === true);
//   const hasCheckPhysical = [
//     wlData.physical.physicalNeedsIsNone,
//     wlData.physical.physicalNeedsIsPersonalCareNeeded,
//     wlData.physical.physicalNeedsIsRiskDuringPhysicalCare,
//     wlData.physical.physicalNeedsIsOther,
//   ].some(value => value === true);
//   const hasCheckMedical = [
//     wlData.medical.medicalNeedsIsNone,
//     wlData.medical.medicalNeedsIsFrequentEmergencyVisit,
//     wlData.medical.medicalNeedsIsOngoingMedicalCare,
//     wlData.medical.medicalNeedsIsSpecializedCareGiveNeeded,
//     wlData.medical.medicalNeedsIsOther,
//   ].some(value => value === true);

//   if (hasCheckBehavioral) {
//     wlForms['behavioral'].inputs['risksFrequencyDescription'].toggleDisabled(wlData.behavioral.risksIsNone);

//     wlForms['behavioral'].inputs['risksIsNone'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksIsPhysicalAggression'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksIsSelfInjury'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksIsFireSetting'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksIsElopement'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksIsSexualOffending'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksIsOther'].toggleRequired(false);
//   }
//   if (hasCheckBehavioralDocs) {
//     wlForms['behavioral'].inputs['risksHasNoDocument'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksHasPoliceReport'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksHasIncidentReport'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksHasBehaviorTracking'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].toggleRequired(false);
//     wlForms['behavioral'].inputs['risksHasOtherDocument'].toggleRequired(false);
//   }
//   if (hasCheckPhysical) {
//     wlForms['physical'].inputs['physicalNeedsDescription'].toggleDisabled(wlData.physical.physicalNeedsIsNone);

//     wlForms['physical'].inputs['physicalNeedsIsNone'].toggleRequired(false);
//     wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].toggleRequired(false);
//     wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].toggleRequired(false);
//     wlForms['physical'].inputs['physicalNeedsIsOther'].toggleRequired(false);
//   }
//   if (hasCheckMedical) {
//     wlForms['medical'].inputs['medicalNeedsDescription'].toggleDisabled(wlData.medical.medicalNeedsIsNone);

//     wlForms['medical'].inputs['medicalNeedsIsNone'].toggleRequired(false);
//     wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].toggleRequired(false);
//     wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].toggleRequired(false);
//     wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].toggleRequired(false);
//     wlForms['medical'].inputs['medicalNeedsIsOther'].toggleRequired(false);
//   }
//   if ((hasCheckBehavioral && hasCheckBehavioralDocs) || hasCheckPhysical || hasCheckMedical) {
//     tocLinks['other'].classList.remove('hiddenPage');
//     wlForms['other'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].toggleDisabled(false);
//   }

//   if (wlData.behavioral.risksHasOtherDocument) {
//     wlForms['behavioral'].inputs['risksOtherDocumentDescription'].toggleDisabled(false);
//   }
//   if (wlData.other.needsIsActionRequiredRequiredIn30Days.includes('yes')) {
//     wlForms['other'].inputs['needsIsContinuousSupportRequired'].toggleDisabled(false);
//   }

//   // riskMitigation
//   //-------------------------------
//   const hasCheckRisksMitigation = [
//     wlData.riskMitigation.rMIsNone,
//     wlData.riskMitigation.rMIsAdultProtectiveServiceInvestigation,
//     wlData.riskMitigation.rMIsCountyBoardInvestigation,
//     wlData.riskMitigation.rMIsLawEnforcementInvestigation,
//     wlData.riskMitigation.rMIsOtherInvestigation,
//   ].some(value => value === true);

//   if (hasCheckRisksMitigation) {
//     wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(wlData.riskMitigation.rMIsNone);
//     wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(wlData.riskMitigation.rMIsNone);

//     wlForms['riskMitigation'].inputs['rMIsNone'].toggleRequired(false);
//     wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].toggleRequired(false);
//     wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].toggleRequired(false);
//     wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].toggleRequired(false);
//     wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].toggleRequired(false);
//   }

//   // childProtectionAgency
//   //-------------------------------
//   if (wlData.childProtectionAgency.cpaIsReleasedNext12Months.includes('yes')) {
//     wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].toggleDisabled(false);
//   }

//   // currentNeeds
//   //-------------------------------
//   if (wlData.currentNeeds.unmetNeedsHas.includes('yes')) {
//     wlForms['currentNeeds'].inputs['unmetNeedsSupports'].toggleDisabled(false);
//   }
//   if (wlData.currentNeeds.unmetNeedsSupports.includes('yes')) {
//     wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(false);
//   }

//   // immediateNeeds
//   //-------------------------------
//   const isNeedActionRequiredYes = wlData.other.needsIsActionRequiredRequiredIn30Days.includes('yes');
//   const isRMActionRequiredYes = wlData.riskMitigation.rMIsActionRequiredIn3oDays.includes('yes');
//   const isAdultProtectiveServiceInvestigationChecked = wlData.riskMitigation.rMIsAdultProtectiveServiceInvestigation;
//   const isCountyBoardInvestigationChecked = wlData.riskMitigation.rMIsCountyBoardInvestigation;
//   const isLawEnforcementInvestigationChecked = wlData.riskMitigation.rMIsLawEnforcementInvestigation;
//   const isOtherInvestigationChecked = wlData.riskMitigation.rMIsOtherInvestigation;
//   if (
//     ((isAdultProtectiveServiceInvestigationChecked ||
//       isCountyBoardInvestigationChecked ||
//       isLawEnforcementInvestigationChecked ||
//       isOtherInvestigationChecked) &&
//       isRMActionRequiredYes) ||
//     isNeedActionRequiredYes
//   ) {
//     wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['immediateNeeds'].classList.remove('hiddenPage');
//   }

//   // waiverEnrollment
//   //-------------------------------
//   if (wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('no')) {
//     wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(false);
//   }
// }