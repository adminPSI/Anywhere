// NEEDS  (wla_circumstances, wla_physical_needs, wla_medical_needs, wla_risks)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"

// RISK MITIGATION (wla_circumstances, wla_risk_mitigations)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//  AND "Is action required within the next 30 days..." has an answer of NO on the NEEDS page

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

// IMMEDIATE NEEDS  (wla_immediate_needs)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//  AND one of the following is true:
//    a.  "Is action required within the next 30 days…" has an answer of YES on the NEEDS page OR
//    b.  "Is action required within the next 30 days…" has an answer of YES on the RISK MITIGATION page
//        AND any checkbox is checked on the RISK MITIGATION page(except the "Not applicable…" checkbox)

// CURRENT NEEDS  (wla_needs)
//  Page should only be enabled if all questions on CONDITIONS page have answer of "YES"
//   AND one of the following is true:
//     a. "Is action required within the next 30 days…" has an answer of NO on the NEEDS page OR
//     b. "Is action required within the next 30 days…" has an answer of NO on the RISK MITIGATION page
