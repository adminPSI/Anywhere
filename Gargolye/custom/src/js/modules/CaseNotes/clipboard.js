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

// wlInfoId
// consumerId
// circumstanceId
// interviewDate

// participants

// async function updatePageActiveStatus() {
//   const conditionsInputValues = [
//     wlForms['conditions'].inputs['otherThanMentalHealth'].getValue('otherThanMentalHealthyes'),
//     wlForms['conditions'].inputs['before22'].getValue('before22yes'),
//     wlForms['conditions'].inputs['isConditionIndefinite'].getValue('isConditionIndefiniteyes'),
//   ];

//   if (!conditionsInputValues.every(element => element === true)) {
//     // conditions page inputs are NOT all YES
//     let formsToDelete = [];

//     [
//       'behavioral',
//       'physical',
//       'medical',
//       'other',
//       'waiverEnrollment',
//       'riskMitigation',
//       'icfDischarge',
//       'intermittentSupports',
//       'childProtectionAgency',
//       'adultDayEmployment',
//       'dischargePlan',
//       'immediateNeeds',
//       'currentNeeds',
//       'currentAvailableServices',
//       'primaryCaregiver',
//     ].forEach(formName => {
//       // hide form

//       wlForms[formName].form.parentElement.classList.add('hiddenPage');
//       tocLinks[formName].classList.add('hiddenPage');

//       if (wlFormInfo[formName].id) {
//         formsToDelete.push(`${wlFormInfo[formName].id}|${wlFormInfo[formName].dbtable}`);
//         wlFormInfo[formName].id = '';
//       }
//     });

//     contributingCircumstancesWrap.classList.add('hiddenPage');
//     needsWrap.classList.add('hiddenPage');

//     if (formsToDelete.length === 0) return;

//     await _UTIL.fetchData('deleteFromWaitingList', { properties: formsToDelete });
//     wlCircID = '';
//     wlNeedID = '';

//     return;
//   }

//   // conditions page all inputs are yes
//   contributingCircumstancesWrap.classList.remove('hiddenPage');
//   needsWrap.classList.remove('hiddenPage');
//   wlForms['primaryCaregiver'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['behavioral'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['physical'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['medical'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['other'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['waiverEnrollment'].form.parentElement.classList.remove('hiddenPage');
//   wlForms['currentAvailableServices'].form.parentElement.classList.remove('hiddenPage');

//   tocLinks['contributingCircumstances'].classList.remove('hiddenPage');
//   tocLinks['primaryCaregiver'].classList.remove('hiddenPage');
//   tocLinks['needs'].classList.remove('hiddenPage');
//   tocLinks['behavioral'].classList.remove('hiddenPage');
//   tocLinks['physical'].classList.remove('hiddenPage');
//   tocLinks['medical'].classList.remove('hiddenPage');
//   tocLinks['other'].classList.remove('hiddenPage');
//   tocLinks['waiverEnrollment'].classList.remove('hiddenPage');
//   tocLinks['currentAvailableServices'].classList.remove('hiddenPage');

//   // get circumstance id
//   if (!wlCircID) {
//     const resp = await insertAssessmentData({
//       id: 0,
//       linkId: wlLinkID,
//       propertyName: 'getCircumstanceId',
//       value: '',
//     });
//     wlCircID = resp[0].newRecordId;
//   }
//   // get needs id
//   if (!wlNeedID && wlCircID) {
//     const resp = await insertAssessmentData({
//       id: 0,
//       linkId: wlCircID,
//       propertyName: 'needsIsActionRequiredRequiredIn30Days',
//       value: '',
//     });
//     wlNeedID = resp[0].newRecordId;
//   }

//   //-------------------------------------------------------------------------------------------------------
//   const needsIsActionRequiredRequiredIn30DaysYES = wlForms['other'].inputs[
//     'needsIsActionRequiredRequiredIn30Days'
//   ].getValue('needsIsActionRequiredRequiredIn30Daysyes');
//   const needsIsActionRequiredRequiredIn30DaysNO = wlForms['other'].inputs[
//     'needsIsActionRequiredRequiredIn30Days'
//   ].getValue('needsIsActionRequiredRequiredIn30Daysno');
//   const rMIsActionRequiredIn3oDaysYES = wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue(
//     'rMIsActionRequiredIn3oDaysyes',
//   );
//   const rMIsActionRequiredIn3oDaysNO =
//     wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].getValue('rMIsActionRequiredIn3oDaysno');
//   const riskMitigationCheckboxValues = [
//     wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
//     wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].getValue(),
//     wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].getValue(),
//     wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].getValue(),
//   ];

//   // needs page [needsIsActionRequiredRequiredIn30Days] is YES
//   if (needsIsActionRequiredRequiredIn30DaysNO) {
//     wlForms['riskMitigation'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['riskMitigation'].classList.remove('hiddenPage');
//   } else {
//     wlForms['riskMitigation'].form.parentElement.classList.add('hiddenPage');
//     tocLinks['riskMitigation'].classList.add('hiddenPage');
//   }

//   // riskMitigation page [rMIsActionRequiredIn3oDays] is YES
//   if (rMIsActionRequiredIn3oDaysYES) {
//     wlForms['icfDischarge'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['intermittentSupports'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['childProtectionAgency'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['adultDayEmployment'].form.parentElement.classList.remove('hiddenPage');
//     wlForms['dischargePlan'].form.parentElement.classList.remove('hiddenPage');

//     tocLinks['icfDischarge'].classList.remove('hiddenPage');
//     tocLinks['intermittentSupports'].classList.remove('hiddenPage');
//     tocLinks['childProtectionAgency'].classList.remove('hiddenPage');
//     tocLinks['adultDayEmployment'].classList.remove('hiddenPage');
//     tocLinks['dischargePlan'].classList.remove('hiddenPage');
//   } else {
//     wlForms['icfDischarge'].form.parentElement.classList.add('hiddenPage');
//     wlForms['intermittentSupports'].form.parentElement.classList.add('hiddenPage');
//     wlForms['childProtectionAgency'].form.parentElement.classList.add('hiddenPage');
//     wlForms['adultDayEmployment'].form.parentElement.classList.add('hiddenPage');
//     wlForms['dischargePlan'].form.parentElement.classList.add('hiddenPage');

//     tocLinks['icfDischarge'].classList.add('hiddenPage');
//     tocLinks['intermittentSupports'].classList.add('hiddenPage');
//     tocLinks['childProtectionAgency'].classList.add('hiddenPage');
//     tocLinks['adultDayEmployment'].classList.add('hiddenPage');
//     tocLinks['dischargePlan'].classList.add('hiddenPage');
//   }

//   // needs page [needsIsActionRequiredRequiredIn30Days] is NO ||
//   // riskMitigation page [rMIsActionRequiredIn3oDays] is NO
//   if (needsIsActionRequiredRequiredIn30DaysNO || rMIsActionRequiredIn3oDaysNO) {
//     wlForms['currentNeeds'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['currentNeeds'].classList.remove('hiddenPage');
//   } else {
//     wlForms['currentNeeds'].form.parentElement.classList.add('hiddenPage');

//     tocLinks['currentNeeds'].classList.add('hiddenPage');
//   }
//   // needs page [needsIsActionRequiredRequiredIn30Days] is YES ||
//   // riskMitigation page [rMIsActionRequiredIn3oDays] is YES &&
//   // any checkbox is checked on riskMitigation page except not applicable
//   if (
//     (needsIsActionRequiredRequiredIn30DaysYES || rMIsActionRequiredIn3oDaysYES) &&
//     riskMitigationCheckboxValues.some(element => element === true)
//   ) {
//     wlForms['immediateNeeds'].form.parentElement.classList.remove('hiddenPage');
//     tocLinks['immediateNeeds'].classList.remove('hiddenPage');
//   } else {
//     wlForms['immediateNeeds'].form.parentElement.classList.add('hiddenPage');
//     tocLinks['immediateNeeds'].classList.add('hiddenPage');
//   }
// }

// function riskMitigationCheckboxes() {
//   const data = [
//     wlForms['riskMitigation'].inputs['rMIsAdultProtectiveServiceInvestigation'].getValue(),
//     wlForms['riskMitigation'].inputs['rMIsCountyBoardInvestigation'].getValue(),
//     wlForms['riskMitigation'].inputs['rMIsLawEnforcementInvestigation'].getValue(),
//     wlForms['riskMitigation'].inputs['rMIsOtherInvestigation'].getValue(),
//   ];

//   const hasCheck = data.some(element => element === true);

//   // (ENABLE) [rMdescription] the "Describe incident under..." textbox (IF)
//   // any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
//   wlForms['riskMitigation'].inputs['rMdescription'].toggleDisabled(!hasCheck);

//   // (ENABLE) [rMIsActionRequiredIn3oDays] the "Is action required..." radio buttons (IF)
//   // any of the checkboxes are checked EXCEPT the "Not applicable..." checkbox.
//   wlForms['riskMitigation'].inputs['rMIsActionRequiredIn3oDays'].toggleDisabled(!hasCheck);
// }

// rMIsAdultProtectiveServiceInvestigation: riskMitigationCheckboxes,
// rMIsCountyBoardInvestigation: riskMitigationCheckboxes,
// rMIsLawEnforcementInvestigation: riskMitigationCheckboxes,
// rMIsOtherInvestigation: riskMitigationCheckboxes,
