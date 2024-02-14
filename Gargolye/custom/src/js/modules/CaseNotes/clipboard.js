// when calling [input].setValue() we need to run insert/update assessment anwser
// lock form down until they select a consumer

// The individual has unmet..." should always be uneditable and also be selected if ALL of the following are true:
//      a.  All Questions on the CONDITIONS page have an answer of "YES"
//      b.  "Is there an immediate need identified…" is YES on the IMMEDIATE NEEDS page
//      c.  "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
// 3.  "The individual has needs..." should always be uneditable and also should be selected if ALL of the following are true:
//      a.   All Questions on the CONDITIONS page have an answer of "YES"
//      b.  "Does the individual have an identified need?" is YES on the CURRENT NEEDS page
//      c.  "If 'Yes', will any of those needs…" is YES on the CURRENT NEEDS page
//      d.  "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
// 4.  "The individual does not require waiver..." should always be uneditable and also should be selected if ALL of the following are true:
//      a. "Will the unmet immeidate need…" is NO on the WAIVER ENROLLMENT page
// 5.  "The individual is not eligible..." should always be uneditable and also should be selected if ALL of the following are true:
//      a.  Any of the questions on the CONDITIONS page have an answer of "NO"
// 6.  The following fields should always be editable:
//      a.  Name of person determining conclusion
//      b.  Title of person determining conclusion
//      c.  Date of conclusion determined
//      d.  Anticipated Waiver Type
// 7.  Show red exclamation point in table of contents until all enabled questions are answered.
// 8.  The following fields should not be editable by the user:
//      a. "The individual has unmet needs that required…"
//      b.  "The individual has needs that are likely…"
//      c.  "The individual does not require waiver…"
//      d.  "The individual is not eligible…"
