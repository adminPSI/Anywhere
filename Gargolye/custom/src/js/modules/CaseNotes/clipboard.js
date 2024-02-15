// when calling [input].setValue() we need to run insert/update assessment anwser
// lock form down until they select a consumer

// The individual has unmet..." should always be uneditable and also be selected if ALL of the following are true:
//   a.  All Questions on the CONDITIONS page have an answer of "YES"
//   b.  "Is there an immediate need identified…" is YES on the IMMEDIATE NEEDS page
//   c.  "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
// 3.  "The individual has needs..." should always be uneditable and also should be selected if ALL of the following are true:
//   a.   All Questions on the CONDITIONS page have an answer of "YES"
//   b.  "Does the individual have an identified need?" is YES on the CURRENT NEEDS page
//   c.  "If 'Yes', will any of those needs…" is YES on the CURRENT NEEDS page
//   d.  "Will the unmet immeidate need…" is YES on the WAIVER ENROLLMENT page
// 4.  "The individual does not require waiver..." should always be uneditable and also should be selected if ALL of the following are true:
//   a. "Will the unmet immeidate need…" is NO on the WAIVER ENROLLMENT page
// 5.  "The individual is not eligible..." should always be uneditable and also should be selected if ALL of the following are true:
//   a.  Any of the questions on the CONDITIONS page have an answer of "NO"
