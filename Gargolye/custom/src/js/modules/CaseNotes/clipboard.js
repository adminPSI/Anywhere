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

// formsToDelete.push(`${wlFormInfo[formName].id}|${wlFormInfo[formName].dbtable}`);
// await _UTIL.fetchData('deleteFromWaitingList', { properties: formsToDelete });