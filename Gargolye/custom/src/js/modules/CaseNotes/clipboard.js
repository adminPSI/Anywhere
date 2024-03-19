// (SET) "Does the individual have an identified need?" to YES only when one of the following is true:
//   a. ("Is there evidence that the primary" is YES (AND) "Is action required…" is NO on the Primary Caregiver page) { OR }
//      ("Is there evidence that the primary" is NO (AND) "Is there evidence of declining skills…" is YES on the Primary Caregiver page)
//   b.  ("Is the individual a child / adult currently engaging…" is YES on the Needs page { OR }
//       ("Is the individual a child / adult with significant physical…" is YES on the Needs page { OR }
//       ("Is the individual a child / adult with significant life-threatening…" is YES on the Needs page) (AND)
//       ("If No, do the significant behavioral, physical care, and / or medical needs…" is YES on the Needs page)
//   c. "Does the individual have an ongoing need…" is YES on the Intermittent Supports page
//   d. "Is the individual reaching the age…" is YES on the Child Protection Agency page
//   e. "Does the individual require funding…" is YES on the Adult Day/Employment page
//   f. "Does the individual have a viable…" is YES on the Discharge Plan page
//
// currentNeedsDetermination();
//-----------------------------------------------------------------------------------------------------------------------------------
// (SET) [unmetNeedsHas] "Does the individual have an identified need?" to {YES}
// (IF)
//  [isPrimaryCaregiverUnavailable] "Is there evidence that the primary…" is {YES}
//    (AND)
//  [isActionRequiredIn30Days] "Is action required…" is {NO}
//    (OR)
//  [isPrimaryCaregiverUnavailable] "Is there evidence that the primary…" is {NO}
//    (AND)
//  [isIndividualSkillsDeclined] "Is there evidence of declining skills…" is {YES}
//-----------------------------------------------------------------------------------------------------------------------------------
//  [risksIsRiskToSelf] ("Is the individual a child / adult currently engaging…" is {YES} on the Needs page
//    (OR)
//  [physicalNeedsIsPhysicalCareNeeded] ("Is the individual a child / adult with significant physical…" is {YES} on the Needs page
//    (OR)
//  [medicalNeedsIsLifeThreatening] ("Is the individual a child / adult with significant life-threatening…" is {YES} on the Needs page)
//    (AND)
//  [needsIsContinuousSupportRequired] ("If No, do the significant behavioral, physical care, and / or medical needs…" is {YES} on the Needs page)
//-----------------------------------------------------------------------------------------------------------------------------------
//   [intSupDetermination] "Does the individual have an ongoing need…" is {YES} on the Intermittent Supports page
//   [cpaDetermination] "Is the individual reaching the age…" is {YES} on the Child Protection Agency page
//   [rwfWaiverFundingRequired] "Does the individual require funding…" is {YES} on the Adult Day/Employment page
//   [dischargeDetermination] "Does the individual have a viable…" is {YES} on the Discharge Plan page
//
//===================================================================================================================================
// IF [isPrimaryCaregiverUnavailable] "Is there evidence that the primary caregiver has a declining or chronic condition or is facing"
// is answered NO
//? OR ====================================================
// IF [isPrimaryCaregiverUnavailable] "Is there evidence that the primary caregiver has a declining or chronic condition or is facing"
// is answered YES
// AND [isActionRequiredIn30Days] "Is action required within the next 30 days due to the caregiver's inability to care for the individual?"
// is answered NO
//?====================================================
// THEN [isIndividualSkillsDeclined] "Is there evidence of declining skills the individual has experienced as a result of either the caregiver's"
// should be enabled.

// async function currentNeedsDetermination() {
//   const isPrimaryCaregiverUnavailable =
//     wlForms['primaryCaregiver'].inputs['isPrimaryCaregiverUnavailable'].getValue();
//   const isActionRequiredIn30Days = wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].getValue();
//   const isIndividualSkillsDeclined = wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].getValue();

//   if (
//     (isPrimaryCaregiverUnavailable.includes('yes') && isActionRequiredIn30Days.includes('no')) ||
//     (isPrimaryCaregiverUnavailable.includes('no') && isIndividualSkillsDeclined.includes('yes'))
//   ) {
//     wlForms['currentNeeds'].inputs['unmetNeedsHas'].setValue('unmetNeedsHasyes');
//     await insertUpdateAssessment({
//       value: 'yes',
//       name: 'unmetNeedsHas',
//       type: 'radio',
//       formName: 'currentNeeds',
//     });
//     return;
//   }

//   const risksIsRiskToSelf = wlForms['behavioral'].inputs['risksIsRiskToSelf'].getValue();
//   const physicalNeedsIsPhysicalCareNeeded =
//     wlForms['physical'].inputs['physicalNeedsIsPhysicalCareNeeded'].getValue();
//   const medicalNeedsIsLifeThreatening = wlForms['medical'].inputs['medicalNeedsIsLifeThreatening'].getValue();
//   const needsIsContinuousSupportRequired = wlForms['other'].inputs['needsIsContinuousSupportRequired'].getValue();

//   if (
//     risksIsRiskToSelf.includes('yes') ||
//     physicalNeedsIsPhysicalCareNeeded.includes('yes') ||
//     (medicalNeedsIsLifeThreatening.includes('yes') && needsIsContinuousSupportRequired.includes('yes'))
//   ) {
//     wlForms['currentNeeds'].inputs['unmetNeedsHas'].setValue('unmetNeedsHasyes');
//     await insertUpdateAssessment({
//       value: 'yes',
//       name: 'unmetNeedsHas',
//       type: 'radio',
//       formName: 'currentNeeds',
//     });
//     return;
//   }

//   const intSupDetermination = wlForms['intermittentSupports'].inputs['intSupDetermination'].getValue();
//   const cpaDetermination = wlForms['childProtectionAgency'].inputs['cpaDetermination'].getValue();
//   const rwfWaiverFundingRequired = wlForms['adultDayEmployment'].inputs['rwfWaiverFundingRequired'].getValue();
//   const dischargeDetermination = wlForms['dischargePlan'].inputs['dischargeDetermination'].getValue();

//   if (
//     intSupDetermination.includes('yes') ||
//     cpaDetermination.includes('yes') ||
//     rwfWaiverFundingRequired.includes('yes') ||
//     dischargeDetermination.includes('yes')
//   ) {
//     wlForms['currentNeeds'].inputs['unmetNeedsHas'].setValue('unmetNeedsHasyes');
//     await insertUpdateAssessment({
//       value: 'yes',
//       name: 'unmetNeedsHas',
//       type: 'radio',
//       formName: 'currentNeeds',
//     });
//     return;
//   }

//   wlForms['currentNeeds'].inputs['unmetNeedsHas'].setValue('unmetNeedsHasno');
//   await insertUpdateAssessment({
//     value: 'no',
//     name: 'unmetNeedsHas',
//     type: 'radio',
//     formName: 'currentNeeds',
//   });
// }
