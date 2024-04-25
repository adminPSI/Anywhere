// function setConclusionUnmetNeedsReview() {
//   const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
//   const isBefore22Yes = wlData.conditions.before22.includes('yes');
//   const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');
//   const isImmNeedsRequiredYes = wlData.immediateNeeds.immNeedsRequired.includes('yes');
//   const isWaiverEnrollRequiredYes = wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('yes');

//   const isChecked =
//     isOtherThanMentalHealthYes &&
//     isBefore22Yes &&
//     isConditionIndefiniteYes &&
//     isWaiverEnrollRequiredYes &&
//     isImmNeedsRequiredYes;
//   wlForms['conclusion'].inputs['conclusionUnmetNeeds'].setValue(isChecked);
// }
// function setConclusionWaiverFunded12MonthsReview() {
//   const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
//   const isBefore22Yes = wlData.conditions.before22.includes('yes');
//   const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');
//   const isUnmetNeedsHasYes = wlData.currentNeeds.unmetNeedsHas.includes('yes');
//   const isUnmetNeedsSupportsYes = wlData.currentNeeds.unmetNeedsSupports.includes('yes');
//   const isWaiverEnrollRequiredYes = wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('yes');

//   const isChecked =
//     isOtherThanMentalHealthYes &&
//     isBefore22Yes &&
//     isConditionIndefiniteYes &&
//     isUnmetNeedsHasYes &&
//     isUnmetNeedsSupportsYes &&
//     isWaiverEnrollRequiredYes;
//   wlForms['conclusion'].inputs['conclusionWaiverFunded12Months'].setValue(isChecked);
// }
// function setConclusionDoesNotRequireWaiverReview() {
//   const isWaiverEnrollRequiredNo = wlData.waiverEnrollment.waivEnrollWaiverEnrollmentIsRequired.includes('no');

//   wlForms['conclusion'].inputs['conclusionDoesNotRequireWaiver'].setValue(isWaiverEnrollRequiredNo);
// }
// function setConclusionNotEligibleForWaiverReview() {
//   const isOtherThanMentalHealthYes = wlData.conditions.otherThanMentalHealth.includes('yes');
//   const isBefore22Yes = wlData.conditions.before22.includes('yes');
//   const isConditionIndefiniteYes = wlData.conditions.isConditionIndefinite.includes('yes');

//   const isChecked = !isOtherThanMentalHealthYes || !isBefore22Yes || !isConditionIndefiniteYes;
//   wlForms['conclusion'].inputs['conclusionNotEligibleForWaiver'].setValue(isChecked);
// }
// function setConclusionUnmetNeeds() {
//   const conditionPageAllYes = isConditionInputsAllYes();

//   const isImmNeedsRequiredYes = wlForms['immediateNeeds'].inputs['immNeedsRequired'].getValue('immNeedsRequiredyes');
//   const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
//     'waivEnrollWaiverEnrollmentIsRequired'
//   ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

//   const isChecked = conditionPageAllYes && isWaiverEnrollRequiredYes && isImmNeedsRequiredYes;
//   wlForms['conclusion'].inputs['conclusionUnmetNeeds'].setValue(isChecked);
// }
// function setConclusionWaiverFunded12Months() {
//   const conditionPageAllYes = isConditionInputsAllYes();

//   const isUnmetNeedsHasYes = wlForms['currentNeeds'].inputs['unmetNeedsHas'].getValue('unmetNeedsHasyes');
//   const isUnmetNeedsSupportsYes =
//     wlForms['currentNeeds'].inputs['unmetNeedsSupports'].getValue('unmetNeedsSupportsyes');
//   const isWaiverEnrollRequiredYes = wlForms['waiverEnrollment'].inputs[
//     'waivEnrollWaiverEnrollmentIsRequired'
//   ].getValue('waivEnrollWaiverEnrollmentIsRequiredyes');

//   const isChecked = conditionPageAllYes && isUnmetNeedsHasYes && isUnmetNeedsSupportsYes && isWaiverEnrollRequiredYes;
//   wlForms['conclusion'].inputs['conclusionWaiverFunded12Months'].setValue(isChecked);
// }
// function setConclusionDoesNotRequireWaiver() {
//   const isWaiverEnrollRequiredNo = wlForms['waiverEnrollment'].inputs[
//     'waivEnrollWaiverEnrollmentIsRequired'
//   ].getValue('waivEnrollWaiverEnrollmentIsRequiredno');

//   wlForms['conclusion'].inputs['conclusionDoesNotRequireWaiver'].setValue(isWaiverEnrollRequiredNo);
// }
// function setConclusionNotEligibleForWaiver() {
//   const conditionPageAllYes = isConditionInputsAllYes();

//   wlForms['conclusion'].inputs['conclusionNotEligibleForWaiver'].setValue(!conditionPageAllYes);
// }
