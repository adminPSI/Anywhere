// consumerId: '4365';
// consumerName: 'Carol Brady';        || TOP ROW - individual
// objectiveStatement: 'Washing Hair'; || TOP ROW - service statement
// frequencyModifier: 'OBJFMEX';       || TOP ROW - frequency
// objectiveIncrement: '1';            || TOP ROW - frequency
// objectiveRecurrance: 'D';           || TOP ROW - frequency
// timesDocumented                     || TOP ROW - times documented
// objectiveSuccess: 'C';              || TOP ROW - success rate ?

// objective_date: '8/20/2024 12:00:00 AM'; || MID ROW - date (no column headings)

// employee: 'Jennifer Keiser'; || BOTTOM ROW - employee
// promptNumber: '';            || BOTTOM ROW - attempts
// promptType: 'p';             || BOTTOM ROW - prompts

// objectiveActivityId: '189';
// objectiveId: '238';
// staffId: '7853';

//* TOP ROW
// individual, service statement, frequency, times doced, success rate
//* Mid Row
// date
//* Bottom Row
// employee, result, attempts, prompts, note

//TODO: If the user has the Review key for Anywhere Service Activity, display the Review Outcomes/Services button
//TODO: date filter
// If user lands on No Frequency, set value to "Last 7 days".
// If user lands on Hourly, set value to "Last 24 hours".
// If user lands on Daily, set to "Last 2 days".
// If user lands on Weekly, set to "Last 1 week".
// If user lands on Monthly, set to "Last 2 months".
// If user lands on Yearly, set to "Last 2 years".

// - Whenever the user changes radio buttons or values within the radio buttons, update the grid
// -  The middle tier should show all segments for the options selected at the top.  For example, if I select "Last 3 months" and today is July 27, 2024, I should see May, 2024; June, 2024; July, 2024.
// -  The No Frequency tab should show "Last XX days" or a date range (just like the Daily tab shown above in mockup #2). User should be able to provide a value for XX.
// -  The Hourly tab should show "Last XX hours" or a time range. User should be able to provide a value for XX.
// -  The Daily tab should show "Last XX days" or a date range (just like above in mockup #2). User should be able to provide a value for XX.
// -  The Weekly tab should show "Last XX weeks" or a date range (just like above in mockup #2). User should be able to provide a value for XX.  If user selects a date range, the Start Date must be a Sunday and the End Date must be a Saturday
// -  The Monthly tab should show "Last XX months" or a date range (just like above in mockup #2). User should be able to provide a value for XX.  If user selects a date range, the Start Date must be the first day of a month and the End Date must be the last day of a month.
// -  The yearly tab should show "Last XX years" or a date range (just like above in mockup #2). User should be able to provide a value for XX.  If the user selects a date range, the Start Date must be the first day of a year and the End Date must be the last day of a year.