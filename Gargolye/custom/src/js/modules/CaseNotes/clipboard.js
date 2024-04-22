// const isPrimaryCaregiverUnavailable = wlData.primaryCaregiver.isPrimaryCaregiverUnavailable;
// const isActionRequiredIn30Days = wlData.primaryCaregiver.isActionRequiredIn30Days;
// const isIndividualSkillsDeclined = wlData.primaryCaregiver.isIndividualSkillsDeclined;
// const risksIsRiskToSelf = wlData.behavioral.risksIsRiskToSelf;
// const physicalNeedsIsPhysicalCareNeeded = wlData.physical.physicalNeedsIsPhysicalCareNeeded;
// const medicalNeedsIsLifeThreatening = wlData.medical.medicalNeedsIsLifeThreatening;
// const needsIsContinuousSupportRequired = wlData.other.needsIsContinuousSupportRequired;
// const intSupDetermination = wlData.intermittentSupports.intSupDetermination;
// const cpaDetermination = wlData.childProtectionAgency.cpaDetermination;
// const rwfWaiverFundingRequired = wlData.adultDayEmployment.rwfWaiverFundingRequired;
// const dischargeDetermination = wlData.dischargePlan.dischargeDetermination;
// const conditions = [
//   isPrimaryCaregiverUnavailable.includes('yes') && isActionRequiredIn30Days.includes('no'),
//   isPrimaryCaregiverUnavailable.includes('no') && isIndividualSkillsDeclined.includes('yes'),
//   risksIsRiskToSelf.includes('yes'),
//   physicalNeedsIsPhysicalCareNeeded.includes('yes'),
//   medicalNeedsIsLifeThreatening.includes('yes') && needsIsContinuousSupportRequired.includes('yes'),
//   intSupDetermination.includes('yes'),
//   cpaDetermination.includes('yes'),
//   rwfWaiverFundingRequired.includes('yes'),
//   dischargeDetermination.includes('yes'),
// ];
// let updateTo = 'no';
// for (const condition of conditions) {
//   if (condition) {
//     updateTo = 'yes';
//   }
// }
// wlForms['currentNeeds'].inputs['unmetNeedsSupports'].toggleDisabled(updateTo === 'yes' ? false : true);
// wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(updateTo === 'no' ? true : false);
