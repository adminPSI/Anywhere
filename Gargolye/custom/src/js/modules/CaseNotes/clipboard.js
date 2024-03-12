// (SET) [unmetNeedsHas] "Does the individual have an identified need?" to YES only when one of the following is true:
//   a. ("Is there evidence that the primary…" is YES (AND) "Is action required…" is NO on the Primary Caregiver page) { OR }
//      ("Is there evidence of declining…" is NO (AND) "Is there evidence of declining skills…" is YES on the Primary Caregiver page)
//   b. ("Is the individual a child/adult currently engaging…" is YES on the Needs page { OR }
//      ("Is the individual a child/adult with significant physical…" is YES on the Needs page { OR }
//      ("Is the individual a child/adult with significant { OR }
//      (life- threatening…" is YES on the Needs page) (AND) ("If No, do the significant behavioral, physical care, and / or medical needs…" is YES on the Needs page)
//   c. "Does the individual have an ongoing need…" is YES on the Intermittent Supports page
//   d. "Is the individual reaching the age…" is YES on the Child Protection Agency page
//   e. "Does the individual require funding…" is YES on the Adult Day/Employment page
//   f. "Does the individual have a viable…" is YES on the Discharge Plan page
//-----------------------------------------------------------------------------------------------------------------------------------

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