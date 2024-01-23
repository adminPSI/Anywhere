//* WAITING LIST INFORMATION
//*-------------------------------------------------------------------------------------------------------------------------------------------------------------------
// (ENABLE) [] the "Other Living Arrangement" field only (IF) [] "Other" is selected in the "Describe Current Living Arrangement" drodown

//* NEEDS
//*-------------------------------------------------------------------------------------------------------------------------------------------------------------------
// (SET) [] "Is the individual a child/adult currently engaging..." to "YES"                               (IF) There is at least one checkbox checked in each of the first two groups of checkboxes NOT including the "Not applicable…" checkboxes
// (ENABLE) [] the "Describe type, frequency, and intensity of behavioral..." textbox                      (IF) any of the checkboxes are checked in the first group of checkboxes EXCEPT the "Not applicable...checkbox"
// (SET) [] "Is the individual a child/adult with significant physical care needs?" to "YES"               (IF) There is at least one checkbox checked in the third group of checkboxes NOT including the "Not applicable…" checkboxes
// (ENABLE) [] the "Describe type, frequency, and intensity of physical..." textbox                        (IF) any of the checkboxes are checked in the third group of checkboxes EXCEPT the "Not applicable...checkbox"
// (SET) [] "Is the individual a child/adult with significant or life-threatening medical needs?" to "YES" (IF) There is at least one checkbox checked in the fourth group of checkboxes NOT including the "Not applicable…" checkboxes
// (ENABLE) [] the "Describe type, frequency, and intensity of medical..." textbox                         (IF) any of the checkboxes are checked in the fourth group of checkboxes EXCEPT the "Not applicable..." checkbox

// (ENABLE) [] the "Is action required within the next 30 days..." radio buttons only (IF) one of the following is true:
//   a.  A checkbox is checked in each of the first two groups of checkboxes (not including the "Not applicable…" checkboxes in each group) OR
//   b.  A checkbox is checked in the third group of checkboxes (not including the "Not applicable…" checkbox) OR
//   c.  A checkbox is checked in the fourth group of checkboxes (not including the "Not applicable…" checkbox)

// (ENABLE) [] the "If No, do the significant..." radio buttons only (IF) the following are ALL true:
//   a. The "Is action required within the next 30 days…" radio buttons are enabled AND
//   b.  The answer to "Is action required within the next 30 days…" is "No"

// (IF) "Is action required within the next 30 days..." radio buttons are disabled, the value of "No" should be selected, and the user should not be able to change it or delete it.

// (IF) "If No, do the significant..." radio buttons are disabled, the value of "No" should be selected, and the user should not be able to change it or delete it.
// (ENABLE) [] the second textbox (under the second group of checkboxes" as long as the "Other" checkbox is checked in the second group of checkboxes.

//* CURRENT NEEDS
//*-------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 2. (SET) [] "Does the individual have an identified need?" to YES only when one of the following is true:
//    a. ("Is there evidence that the primary…" is YES AND"Is action required…" is NO on the Primary Caregiver page) OR ("Is there evidence of declining…" is NO AND "Is there evidence of declining skills…" is YES on the Primary Caregiver page)
//    b. ("Is the individual a child/adult currently engaging…" is YES on the Needs page OR "Is the individual a child/adult with significant physical…" is YES on the Needs page OR "Is the individual a child/adult with significant or life-threatening…" is YES on the Needs page) AND ("If No, do the significant behavioral, physical care, and/or medical needs…" is YES on the Needs page)
//    c. "Does the individual have an ongoing need…" is YES on the Intermittent Supports page
//    d. "Is the individual reaching the age…" is YES on the Child Protection Agency page
//    e. "Does the individual require funding…" is YES on the Adult Day/Employment page
//    f. "Does the individual have a viable…" is YES on the Discharge Plan page

// 3. (ENABLE) [] "If 'Yes', will any of those needs..." only        (IF) "Does the individual have an identified need?" is YES
// 4. (ENABLE) [] "If 'Yes', describe the unmet need:" text box only (IF) "If 'Yes', will any of those needs..." is YES
