// NEEDS  (wla_circumstances, wla_physical_needs, wla_medical_needs, wla_risks)
// 1.  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//     AND "Is action required within the next 30 days..." is NO on the Primary Caregiver page.

// ICF DISCHARGE  (wla_circumstances, wla_icf_discharges)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//  AND "Is action required within the next 30 days..." has an answer of NO on the RISK MITIGATION page

//* INTERMITTENT SUPPORTS  (wla_circumstances, wla_intermitent_supports)
//*  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//*  AND any question on the ICF DISCHARGE page has an answer of NO
//* [icfDetermination, icfIsICFResident, icfIsNoticeIssued, icfIsActionRequiredIn30Days]

// CHILD PROTECTION AGENCY  (wla_circumstances, wla_child_protection_agencies)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//  AND "Is action required within the next 30 days..." has an answer of NO on the RISK MITIGATION page

// ADULT DAY/EMPLOYMENT  (wla_circumstances, wla_require_waiver_fundings)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//  AND "Is action required within the next 30 days..." has an answer of NO on the RISK MITIGATION page

// DISCHARGE PLAN (wla_circumstances, wla_discharge_plans)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//  AND "Is action required within the next 30 days..." has an answer of NO on the RISK MITIGATION page

//--------------------

// CHILD PROTECTION AGENCY  (wla_circumstances, wla_child_protection_agencies)
// 1. Page should only be enabled if the INTERMITTENT SUPPORTS page is also enabled

// ADULT DAY/EMPLOYMENT  (wla_circumstances, wla_require_waiver_fundings)
// 1. Page should only be enabled if the INTERMITTENT SUPPORTS page is also enabled

// DISCHARGE PLAN (wla_circumstances, wla_discharge_plans)
// 1. Page should only be enabled if the INTERMITTENT SUPPORTS page is also enabled

//--------------------

// ICF DISCHARGE  (wla_circumstances, wla_icf_discharges)
// 2.  Set "Is the individual a resident..." to "YES" if all radio-button answers on this page are "Yes".. Otherwise, set to "NO"

//--------------------

// await _UTIL.fetchData('deleteFromWaitingList', {
//   properties: [`${wlFormInfo[formName].id}|${wlFormInfo[formName].dbtable}`]
// });

//--------------------

// const onChangeCallbacks = {
//   //* waitingListInfo
//   currentLivingArrangement: async ({ value }) => {
//     wlForms['waitingListInfo'].inputs['livingArrangementOther'].toggleDisabled(value === 'Other' ? false : true);

//     if (value !== 'Other') {
//       wlForms['waitingListInfo'].inputs['livingArrangementOther'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'livingArrangementOther',
//         type: 'text',
//         formName: 'waitingListInfo',
//       });
//     }
//   },
//   //* currentAvailableServices
//   isOtherService: async ({ value }) => {
//     wlForms['currentAvailableServices'].inputs['otherDescription'].toggleDisabled(value === 'yes' ? false : true);

//     if (value !== 'yes') {
//       wlForms['currentAvailableServices'].inputs['otherDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'otherDescription',
//         type: 'text',
//         formName: 'currentAvailableServices',
//       });
//     }
//   },
//   //* primaryCaregiver
//   isPrimaryCaregiverUnavailable: async ({ value }) => {
//     wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].toggleDisabled(value === 'yes' ? false : true);
//     wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].toggleDisabled(value === 'yes' ? false : true);
//     wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(value === 'no' ? false : true);

//     if (value !== 'yes') {
//       wlForms['primaryCaregiver'].inputs['unavailableDocumentation'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'unavailableDocumentation',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });

//       wlForms['primaryCaregiver'].inputs['isActionRequiredIn30Days'].setValue('');
//       await insertUpdateAssessment({
//         value: 'no',
//         name: 'isActionRequiredIn30Days',
//         type: 'radio',
//         formName: 'primaryCaregiver',
//       });

//       wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'actionRequiredDescription',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });

//       wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(true);
//     } else {
//       wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].setValue('');
//       await insertUpdateAssessment({
//         value: 'no',
//         name: 'isIndividualSkillsDeclined',
//         type: 'radio',
//         formName: 'primaryCaregiver',
//       });

//       wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'declinedSkillsDocumentation',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });

//       wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'declinedSkillsDescription',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });

//       wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(true);
//       wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(true);
//     }

//     await currentNeedsDetermination();
//   },
//   isActionRequiredIn30Days: async ({ value }) => {
//     needsWrap.classList.toggle('hiddenPage', value === 'yes');
//     tocLinks['needs'].classList.toggle('hiddenPage', value === 'yes');
//     ['behavioral', 'physical', 'medical', 'other'].forEach(page => {
//       wlForms[page].form.parentElement.classList.toggle('hiddenPage', value === 'yes');
//       tocLinks[page].classList.toggle('hiddenPage', value === 'yes');
//       if (sectionResets[page]) {
//         sectionResets[page]();
//       }
//     });

//     wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].toggleDisabled(value === 'yes' ? false : true);
//     wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].toggleDisabled(value === 'no' ? false : true);

//     if (value !== 'yes') {
//       wlForms['primaryCaregiver'].inputs['actionRequiredDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'actionRequiredDescription',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });
//     } else {
//       wlForms['primaryCaregiver'].inputs['isIndividualSkillsDeclined'].setValue('');
//       await insertUpdateAssessment({
//         value: 'no',
//         name: 'isIndividualSkillsDeclined',
//         type: 'radio',
//         formName: 'primaryCaregiver',
//       });
//     }

//     await currentNeedsDetermination();
//   },
//   isIndividualSkillsDeclined: async ({ value }) => {
//     wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].toggleDisabled(value === 'yes' ? false : true);
//     wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].toggleDisabled(value === 'yes' ? false : true);

//     if (value !== 'yes') {
//       wlForms['primaryCaregiver'].inputs['declinedSkillsDocumentation'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'declinedSkillsDocumentation',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });
//       wlForms['primaryCaregiver'].inputs['declinedSkillsDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'declinedSkillsDescription',
//         type: 'text',
//         formName: 'primaryCaregiver',
//       });
//     }

//     await currentNeedsDetermination();
//   },
//   //* behavioral
//   risksIs: async props => {
//     const promises = [];
//     const hasCheck = isAnyCheckboxCheckedBehaviors();
//     const hasCheckDocs = isAnyCheckboxCheckedBehaviorsDocs();
//     const risksIsRiskToSelfInputId = hasCheck && hasCheckDocs ? 'risksIsRiskToSelfyes' : 'risksIsRiskToSelfno';
//     const isNotAppChecked = wlForms['behavioral'].inputs['risksIsNone'].getValue();
//     const isRequired = hasCheck || isNotAppChecked ? false : true;

//     wlForms['behavioral'].inputs['risksFrequencyDescription'].toggleDisabled(!hasCheck);
//     if (!hasCheck) {
//       wlForms['behavioral'].inputs['risksFrequencyDescription'].setValue('');
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: '',
//             name: 'risksFrequencyDescription',
//             type: 'text',
//             formName: 'behavioral',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['behavioral'].inputs['risksIsRiskToSelf'].setValue(risksIsRiskToSelfInputId);
//     promises.push(
//       new Promise(async resolve => {
//         await insertUpdateAssessment({
//           value: hasCheck && hasCheckDocs ? 'yes' : 'no',
//           name: 'risksIsRiskToSelf',
//           type: 'radio',
//           formName: 'behavioral',
//         });
//         resolve();
//       }),
//     );

//     if (hasCheck && isNotAppChecked) {
//       wlForms['behavioral'].inputs['risksIsNone'].setValue(false);
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: 'off',
//             name: 'risksIsNone',
//             type: 'checkbox',
//             formName: 'behavioral',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['behavioral'].inputs['risksIsNone'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksIsPhysicalAggression'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksIsSelfInjury'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksIsFireSetting'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksIsElopement'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksIsSexualOffending'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksIsOther'].toggleRequired(isRequired);

//     needsOtherCheck();
//     await currentNeedsDetermination();

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   risksHas: async props => {
//     const promises = [];

//     const hasCheck = isAnyCheckboxCheckedBehaviors();
//     const hasCheckDocs = isAnyCheckboxCheckedBehaviorsDocs();
//     const risksIsRiskToSelfInputId = hasCheck && hasCheckDocs ? 'risksIsRiskToSelfyes' : 'risksIsRiskToSelfno';
//     const isNotAppChecked = wlForms['behavioral'].inputs['risksHasNoDocument'].getValue();
//     const isRequired = hasCheckDocs || isNotAppChecked ? false : true;

//     wlForms['behavioral'].inputs['risksIsRiskToSelf'].setValue(risksIsRiskToSelfInputId);
//     promises.push(
//       new Promise(async resolve => {
//         await insertUpdateAssessment({
//           value: hasCheck && hasCheckDocs ? 'yes' : 'no',
//           name: 'risksIsRiskToSelf',
//           type: 'radio',
//           formName: 'behavioral',
//         });
//         resolve();
//       }),
//     );

//     if (hasCheckDocs && isNotAppChecked) {
//       wlForms['behavioral'].inputs['risksHasNoDocument'].setValue(false);
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: 'off',
//             name: 'risksHasNoDocument',
//             type: 'checkbox',
//             formName: 'behavioral',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['behavioral'].inputs['risksHasNoDocument'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksHasPoliceReport'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksHasIncidentReport'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksHasBehaviorTracking'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksHasPsychologicalAssessment'].toggleRequired(isRequired);
//     wlForms['behavioral'].inputs['risksHasOtherDocument'].toggleRequired(isRequired);

//     needsOtherCheck();
//     await currentNeedsDetermination();

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   risksIsNone: async ({ value }) => {
//     const promises = [];

//     [
//       'risksIsPhysicalAggression',
//       'risksIsSelfInjury',
//       'risksIsFireSetting',
//       'risksIsElopement',
//       'risksIsSexualOffending',
//       'risksIsOther',
//     ].forEach(inputId => {
//       wlForms['behavioral'].inputs[inputId].toggleRequired(value === 'on' ? false : true);

//       if (value === 'on' && wlForms['behavioral'].inputs[inputId].getValue()) {
//         wlForms['behavioral'].inputs[inputId].setValue(false);

//         promises.push(
//           new Promise(async resolve => {
//             await insertUpdateAssessment({
//               value: 'off',
//               name: inputId,
//               type: 'checkbox',
//               formName: 'behavioral',
//             });
//             resolve();
//           }),
//         );
//       }
//     });

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   risksHasNoDocument: async ({ value }) => {
//     const promises = [];

//     [
//       'risksHasPoliceReport',
//       'risksHasIncidentReport',
//       'risksHasBehaviorTracking',
//       'risksHasPsychologicalAssessment',
//       'risksHasOtherDocument',
//     ].forEach(inputId => {
//       wlForms['behavioral'].inputs[inputId].toggleRequired(value === 'on' ? false : true);

//       if (value === 'on' && wlForms['behavioral'].inputs[inputId].getValue()) {
//         wlForms['behavioral'].inputs[inputId].setValue(false);

//         promises.push(
//           new Promise(async resolve => {
//             await insertUpdateAssessment({
//               value: 'off',
//               name: inputId,
//               type: 'checkbox',
//               formName: 'behavioral',
//             });
//             resolve();
//           }),
//         );
//       }
//     });

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   risksHasOtherDocument: async ({ name, value }) => {
//     // (ENABLE) [risksOtherDocumentDescription] the second textbox (under the second group of checkboxes" as long as the
//     // "Other" checkbox is checked in the second group of checkboxes.

//     wlForms['behavioral'].inputs['risksOtherDocumentDescription'].toggleDisabled(value === 'on' ? false : true);
//     if (value !== 'on') {
//       wlForms['behavioral'].inputs['risksOtherDocumentDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: 'off',
//         name: 'risksOtherDocumentDescription',
//         type: 'text',
//         formName: 'behavioral',
//       });
//     }
//   },
//   //* physical
//   physicalNeeds: async () => {
//     const promises = [];
//     const hasCheck = isAnyCheckboxCheckedPhysical();
//     const physicalNeedsIsPhysicalCareNeededInputId = hasCheck
//       ? 'physicalNeedsIsPhysicalCareNeededyes'
//       : 'physicalNeedsIsPhysicalCareNeededno';
//     const isNotAppChecked = wlForms['physical'].inputs['physicalNeedsIsNone'].getValue();
//     const isRequired = hasCheck || isNotAppChecked ? false : true;

//     wlForms['physical'].inputs['physicalNeedsDescription'].toggleDisabled(!hasCheck);
//     if (!hasCheck) {
//       wlForms['physical'].inputs['physicalNeedsDescription'].setValue('');
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: '',
//             name: 'physicalNeedsDescription',
//             type: 'text',
//             formName: 'physical',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['physical'].inputs['physicalNeedsIsPhysicalCareNeeded'].setValue(
//       physicalNeedsIsPhysicalCareNeededInputId,
//     );
//     promises.push(
//       new Promise(async resolve => {
//         await insertUpdateAssessment({
//           value: hasCheck ? 'yes' : 'no',
//           name: 'physicalNeedsIsPhysicalCareNeeded',
//           type: 'radio',
//           formName: 'physical',
//         });
//         resolve();
//       }),
//     );

//     if (hasCheck && isNotAppChecked) {
//       wlForms['physical'].inputs['physicalNeedsIsNone'].setValue(false);
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: 'off',
//             name: 'physicalNeedsIsNone',
//             type: 'checkbox',
//             formName: 'physical',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['physical'].inputs['physicalNeedsIsNone'].toggleRequired(isRequired);
//     wlForms['physical'].inputs['physicalNeedsIsPersonalCareNeeded'].toggleRequired(isRequired);
//     wlForms['physical'].inputs['physicalNeedsIsRiskDuringPhysicalCare'].toggleRequired(isRequired);
//     wlForms['physical'].inputs['physicalNeedsIsOther'].toggleRequired(isRequired);

//     needsOtherCheck();
//     await currentNeedsDetermination();

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   physicalNeedsIsNone: async ({ value }) => {
//     const promises = [];

//     ['physicalNeedsIsPersonalCareNeeded', 'physicalNeedsIsRiskDuringPhysicalCare', 'physicalNeedsIsOther'].forEach(
//       inputId => {
//         wlForms['physical'].inputs[inputId].toggleRequired(value === 'on' ? false : true);

//         if (value === 'on' && wlForms['physical'].inputs[inputId].getValue()) {
//           wlForms['physical'].inputs[inputId].setValue(false);

//           promises.push(
//             new Promise(async resolve => {
//               await insertUpdateAssessment({
//                 value: 'off',
//                 name: inputId,
//                 type: 'checkbox',
//                 formName: 'physical',
//               });
//               resolve();
//             }),
//           );
//         }
//       },
//     );

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   //* medical
//   medicalNeeds: async () => {
//     const promises = [];

//     const hasCheck = isAnyCheckboxCheckedMedical();
//     const inputId = hasCheck ? 'medicalNeedsIsLifeThreateningyes' : 'medicalNeedsIsLifeThreateningno';
//     const isNotAppChecked = wlForms['medical'].inputs['medicalNeedsIsNone'].getValue();
//     const isRequired = hasCheck || isNotAppChecked ? false : true;

//     wlForms['medical'].inputs['medicalNeedsDescription'].toggleDisabled(!hasCheck);
//     if (!hasCheck) {
//       wlForms['medical'].inputs['medicalNeedsDescription'].setValue('');
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: '',
//             name: 'medicalNeedsDescription',
//             type: 'text',
//             formName: 'medical',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['medical'].inputs['medicalNeedsIsLifeThreatening'].setValue(inputId);

//     promises.push(
//       new Promise(async resolve => {
//         await insertUpdateAssessment({
//           value: hasCheck ? 'yes' : 'no',
//           name: 'medicalNeedsIsLifeThreatening',
//           type: 'radio',
//           formName: 'medical',
//         });
//         resolve();
//       }),
//     );

//     if (hasCheck && isNotAppChecked) {
//       wlForms['medical'].inputs['medicalNeedsIsNone'].setValue(false);
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: 'off',
//             name: 'medicalNeedsIsNone',
//             type: 'checkbox',
//             formName: 'medical',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['medical'].inputs['medicalNeedsIsNone'].toggleRequired(isRequired);
//     wlForms['medical'].inputs['medicalNeedsIsFrequentEmergencyVisit'].toggleRequired(isRequired);
//     wlForms['medical'].inputs['medicalNeedsIsOngoingMedicalCare'].toggleRequired(isRequired);
//     wlForms['medical'].inputs['medicalNeedsIsSpecializedCareGiveNeeded'].toggleRequired(isRequired);
//     wlForms['medical'].inputs['medicalNeedsIsOther'].toggleRequired(isRequired);

//     needsOtherCheck();

//     await currentNeedsDetermination();

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   medicalNeedsIsNone: async ({ value }) => {
//     const promises = [];

//     [
//       'medicalNeedsIsFrequentEmergencyVisit',
//       'medicalNeedsIsOngoingMedicalCare',
//       'medicalNeedsIsSpecializedCareGiveNeeded',
//       'medicalNeedsIsOther',
//     ].forEach(async inputId => {
//       wlForms['medical'].inputs[inputId].toggleRequired(value === 'on' ? false : true);

//       if (value === 'on' && wlForms['medical'].inputs[inputId].getValue()) {
//         wlForms['medical'].inputs[inputId].setValue(false);

//         promises.push(
//           new Promise(async resolve => {
//             await insertUpdateAssessment({
//               value: 'off',
//               name: inputId,
//               type: 'checkbox',
//               formName: 'medical',
//             });
//             resolve();
//           }),
//         );
//       }
//     });

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   //* other
//   needsIsActionRequiredRequiredIn30Days: async ({ value }) => {
//     const isNeedsActionRequiredYes = value === 'yes';
//     const isRisksActionRequired = wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue();
//     const showCurrentNeeds = !isNeedsActionRequiredYes || isRisksActionRequired.includes('no');
//     const isRMChecked = isAnyCheckboxCheckedRiskMitigation();
//     const showImmediateNeeds = (isNeedsActionRequiredYes || isRisksActionRequired.includes('yes')) && isRMChecked;

//     wlForms['other'].inputs['needsIsContinuousSupportRequired'].toggleDisabled(isNeedsActionRequiredYes);

//     if (isNeedsActionRequiredYes) {
//       wlForms['other'].inputs['needsIsContinuousSupportRequired'].setValue('');
//       await insertUpdateAssessment({
//         value: 'no',
//         name: 'needsIsContinuousSupportRequired',
//         type: 'radio',
//         formName: 'other',
//       });
//     }

//     wlForms['riskMitigation'].form.parentElement.classList.toggle('hiddenPage', isNeedsActionRequiredYes);
//     tocLinks['riskMitigation'].classList.toggle('hiddenPage', isNeedsActionRequiredYes);

//     if (isNeedsActionRequiredYes) {
//       if (sectionResets['riskMitigation']) {
//         sectionResets['riskMitigation']();
//       }
//     }

//     wlForms['currentNeeds'].form.parentElement.classList.toggle('hiddenPage', !showCurrentNeeds);
//     tocLinks['currentNeeds'].classList.toggle('hiddenPage', !showCurrentNeeds);
//     if (!showCurrentNeeds) {
//       if (sectionResets['currentNeeds']) {
//         sectionResets['currentNeeds']();
//       }
//     }

//     wlForms['immediateNeeds'].form.parentElement.classList.toggle('hiddenPage', !showImmediateNeeds);
//     tocLinks['immediateNeeds'].classList.toggle('hiddenPage', !showImmediateNeeds);
//   },
//   needsIsContinuousSupportRequired: async () => {
//     await currentNeedsDetermination();
//   },
//   //* riskMitigation
//   rMIs: async () => {
//     const promises = [];

//     const isRMChecked = isAnyCheckboxCheckedRiskMitigation();
//     const isNeedsActionRequired = wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].getValue();
//     const isRisksActionRequired = wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue();
//     const showImmediateNeeds =
//       (isNeedsActionRequired.includes('yes') || isRisksActionRequired.includes('yes')) && isRMChecked;
//     const isNotAppChecked = wlForms['riskMitigation'].inputs['rMIsNone'].getValue();
//     const isRequired = isRMChecked || isNotAppChecked ? false : true;
//     const inputId = showImmediateNeeds ? 'immNeedsRequiredyes' : 'immNeedsRequiredno';

//     wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(!isRMChecked);
//     wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(!isRMChecked);

//     if (!isRMChecked) {
//       wlForms['riskMitigation'].inputs['rMdescription'].setValue('');
//       wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].setValue('');

//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: '',
//             name: 'rMdescription',
//             type: 'text',
//             formName: 'riskMitigation',
//           });
//           resolve();
//         }),
//       );

//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: 'no',
//             name: 'rMIsActionRequiredIn3oDays',
//             type: 'radio',
//             formName: 'riskMitigation',
//           });
//           resolve();
//         }),
//       );
//     }

//     if (isRMChecked && isNotAppChecked) {
//       wlForms['riskMitigation'].inputs['rMIsNone'].setValue(false);
//       promises.push(
//         new Promise(async resolve => {
//           await insertUpdateAssessment({
//             value: 'off',
//             name: 'rMIsNone',
//             type: 'checkbox',
//             formName: 'riskMitigation',
//           });
//           resolve();
//         }),
//       );
//     }

//     wlForms['riskMitigation'].inputs['rMIsNone'].toggleRequired(isRequired);
//     wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].toggleRequired(isRequired);
//     wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].toggleRequired(isRequired);
//     wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].toggleRequired(isRequired);
//     wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].toggleRequired(isRequired);

//     wlForms['immediateNeeds'].form.parentElement.classList.toggle('hiddenPage', !showImmediateNeeds);
//     tocLinks['immediateNeeds'].classList.toggle('hiddenPage', !showImmediateNeeds);
//     if (!showImmediateNeeds) {
//       sectionResets['immediateNeeds']();
//     }
//     wlForms['immediateNeeds'].inputs['immNeedsRequired'].setValue(inputId);
//     wlForms['immediateNeeds'].inputs['immNeedsDescription'].toggleDisabled(inputId.includes('yes') ? false : true);
//     promises.push(
//       new Promise(async resolve => {
//         await insertUpdateAssessment({
//           value: showImmediateNeeds ? 'yes' : 'no',
//           name: 'immNeedsRequired',
//           type: 'radio',
//           formName: 'immediateNeeds',
//         });
//         resolve();
//       }),
//     );

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   rMIsNone: async ({ value }) => {
//     const promises = [];

//     [
//       'rMIsAdultProtectiveServiceInvestigation',
//       'rMIsCountyBoardInvestigation',
//       'rMIsLawEnforcementInvestigation',
//       'rMIsOtherInvestigation',
//     ].forEach(async inputId => {
//       wlForms['riskMitigation'].inputs[inputId].toggleRequired(value === 'on' ? false : true);

//       if (value === 'on' && wlForms['riskMitigation'].inputs[inputId].getValue()) {
//         wlForms['riskMitigation'].inputs[inputId].setValue(false);

//         promises.push(
//           new Promise(async resolve => {
//             await insertUpdateAssessment({
//               value: 'off',
//               name: inputId,
//               type: 'checkbox',
//               formName: 'riskMitigation',
//             });
//             resolve();
//           }),
//         );
//       }
//     });

//     await Promise.allSettled(promises).then(results => {
//       return;
//     });
//   },
//   rMIsActionRequiredIn3oDays: async ({ value }) => {
//     const isRisksActionRequired = value;
//     const isNeedsActionRequired = wlForms['other'].inputs['needsIsActionRequiredRequiredIn30Days'].getValue();
//     const isRMChecked = isAnyCheckboxCheckedRiskMitigation();
//     const showCurrentNeeds = isRisksActionRequired.includes('no') || isNeedsActionRequired.includes('no');
//     const showImmediateNeeds =
//       isNeedsActionRequired.includes('yes') || (isRisksActionRequired.includes('yes') && isRMChecked);
//     const inputId = isRisksActionRequired.includes('yes') ? 'rMIsSupportNeededyes' : 'rMIsSupportNeededno';

//     // Hide/Show Sections
//     wlForms['icfDischarge'].form.parentElement.classList.toggle('hiddenPage', isRisksActionRequired.includes('yes'));
//     tocLinks['icfDischarge'].classList.toggle('hiddenPage', isRisksActionRequired.includes('yes'));
  
//     wlForms['currentNeeds'].form.parentElement.classList.toggle('hiddenPage', !showCurrentNeeds);
//     tocLinks['currentNeeds'].classList.toggle('hiddenPage', !showCurrentNeeds);
//     if (!showCurrentNeeds) {
//       if (sectionResets['currentNeeds']) {
//         sectionResets['currentNeeds']();
//       }
//     }

//     wlForms['immediateNeeds'].form.parentElement.classList.toggle('hiddenPage', !showImmediateNeeds);
//     tocLinks['immediateNeeds'].classList.toggle('hiddenPage', !showImmediateNeeds);

//     // Set Input
//     wlForms['riskMitigation'].inputs['rMIsSupportNeeded'].setValue(inputId);

//     await insertUpdateAssessment({
//       value: isRisksActionRequired ? 'yes' : 'no',
//       name: 'rMIsSupportNeeded',
//       type: 'radio',
//       formName: 'riskMitigation',
//     });
//   },
//   //* icfDischarge
//   icfIsICFResident: async ({ value }) => {
//     ShowHidePagesRelatedToICF();
//     icfDischargeDetermination();
//   },
//   icfIsNoticeIssued: async ({ value }) => {
//     ShowHidePagesRelatedToICF();
//     icfDischargeDetermination();
//   },
//   icfIsActionRequiredIn30Days: async ({ value }) => {
//     ShowHidePagesRelatedToICF();
//     icfDischargeDetermination();
//   },
//   //* intermittentSupports
//   intSupIsSupportNeededIn12Months: intermittentSupportsDetermination,
//   intSupIsStayingLivingArrangement: intermittentSupportsDetermination,
//   intSupIsActionRequiredIn30Days: intermittentSupportsDetermination,
//   //* childProtectionAgency
//   cpaIsReleasedNext12Months: async ({ value }) => {
//     wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].toggleDisabled(value === 'yes' ? false : true);

//     if (value !== 'yes') {
//       wlForms['childProtectionAgency'].inputs['cpaAnticipateDate'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'cpaAnticipateDate',
//         type: 'date',
//         formName: 'childProtectionAgency',
//       });
//     }

//     await childProtectionAgencyDetermination();
//   },
//   cpaHasUnaddressableNeeds: childProtectionAgencyDetermination,
//   //* adultDayEmployment
//   rwfNeedsMoreFrequency: adultDayEmploymentDetermination,
//   rwfNeedsServiceNotMetIDEA: adultDayEmploymentDetermination,
//   rwfNeedsServicesNotMetOOD: adultDayEmploymentDetermination,
//   //* dischargePlan
//   dischargeIsICFResident: dischargePlanDetermination,
//   dischargeIsInterestedInMoving: dischargePlanDetermination,
//   dischargeHasDischargePlan: dischargePlanDetermination,
//   //* currentNeeds
//   unmetNeedsSupports: async ({ value }) => {
//     wlForms['currentNeeds'].inputs['unmetNeedsDescription'].toggleDisabled(value === 'yes' ? false : true);

//     setConclusionWaiverFunded12Months();

//     if (value !== 'yes') {
//       wlForms['currentNeeds'].inputs['unmetNeedsDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'unmetNeedsDescription',
//         type: 'text',
//         formName: 'currentNeeds',
//       });
//     }
//   },
//   //* immediateNeeds
//   immNeedsRequired: setConclusionUnmetNeeds,
//   //* waiverEnrollment
//   waivEnrollWaiverEnrollmentIsRequired: async ({ value }) => {
//     wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].toggleDisabled(
//       value === 'no' ? false : true,
//     );

//     setConclusionUnmetNeeds();
//     setConclusionWaiverFunded12Months();
//     setConclusionDoesNotRequireWaiver();

//     if (value !== 'no') {
//       wlForms['waiverEnrollment'].inputs['waivEnrollWaiverEnrollmentDescription'].setValue('');
//       await insertUpdateAssessment({
//         value: '',
//         name: 'waivEnrollWaiverEnrollmentDescription',
//         type: 'text',
//         formName: 'waiverEnrollment',
//       });
//     }
//   },
// };
