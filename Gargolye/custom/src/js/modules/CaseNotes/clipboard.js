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

// async function getReviewTableData() {
//   const data = await outcomesAjax.getReviewTableData({
//     consumerId: selectedConsumerId,
//     objectiveDate: '2023/01/01',
//   });

//   outcomesDataRaw = {};

//   outcomesData = data.reduce((a, d) => {
//     const occurrence = d.objectiveRecurrance || 'NF';
//     const objID = d.objectiveId;
//     const date = d.objective_date.split(' ')[0];
//     const staffId = d.staffId;

//     if (!outcomesDataRaw[occurrence]) {
//       outcomesDataRaw[occurrence] = [];
//     }
//     outcomesDataRaw[occurrence].push(d);

//     if (!a[occurrence]) {
//       a[occurrence] = {};
//     }

//     if (!a[occurrence][objID]) {
//       a[occurrence][objID] = {
//         reviewDates: {},
//       };
//     }

//     if (!a[occurrence][objID].reviewDates[date]) {
//       a[occurrence][objID].reviewDates[date] = {};
//     }

//     if (!a[occurrence][objID].reviewDates[date][staffId]) {
//       a[occurrence][objID].reviewDates[date][staffId] = {};
//     }

//     // main row
//     a[occurrence][objID].individual = d.consumerName;
//     a[occurrence][objID].serviceStatement = d.objectiveStatement;
//     a[occurrence][objID].frequency = `${d.frequencyModifier} ${d.objectiveIncrement} ${d.objectiveRecurrance}`;
//     a[occurrence][objID].timesDoc = d.timesDocumented;
//     a[occurrence][objID].successRate = d.objectiveSuccess;

//     // detail row
//     a[occurrence][objID].reviewDates[date][staffId].employee = d.employee;
//     a[occurrence][objID].reviewDates[date][staffId].result = `${d.objectiveSuccessSymbol } ${d.objectiveSuccessDescription }`;
//     a[occurrence][objID].reviewDates[date][staffId].attempts = d.promptNumber;
//     a[occurrence][objID].reviewDates[date][staffId].prompts = d.promptType;
//     a[occurrence][objID].reviewDates[date][staffId].note = d.objectiveActivityNote;
//     // data for detail popup
//     a[occurrence][objID].reviewDates[date][staffId].activityId = d.objectiveActivityId;
    
//     return a;
//   }, {});
// }
// function buildTable(data) {
//   const table = _DOM.createElement('div');
//   table.classList.add('outcomesReviewTable');

//   const mainHeading = _DOM.createElement('div', { class: ['heading', 'heading-main'] });
//   mainHeading.innerHTML = `
//     <div></div>
//     <div>Individual</div>
//     <div>Service Statement</div>
//     <div>Frequency</div>
//     <div>Times Documented</div>  
//     <div>Success Rate</div>
//   `;
//   table.appendChild(mainHeading);

//   for (const objId in data) {
//     const d = data[objId];
    
//     const mainRowWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-main'] });
//     table.appendChild(mainRowWrap);
    
//     const mainRow = _DOM.createElement('div', { class: ['row', 'row-main'] });
//     const mainTI = buildToggleIcon();
//     mainTI.classList.add('mainToggle');
//     mainRow.appendChild(mainTI);
//     mainRow.innerHTML += `
//       <div>${d.individual}</div>
//       <div>${d.serviceStatement}</div>
//       <div>${d.frequency}</div>
//       <div>${d.timesDoc}</div>
//       <div>${d.successRate}</div>
//     `;
//     mainRowWrap.appendChild(mainRow);

//     const mainRowSubWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-main-sub', 'hidden'] });
//     mainRowWrap.appendChild(mainRowSubWrap);
    
//     mainRow.addEventListener('click', e => {
//       const target = e.target;

//       if (!target.classList.contains('mainToggle')) return;

//       const showChildren = target.classList.contains('closed');

//       if (showChildren) {
//         target.innerHTML = icons.keyArrowDown;
//         target.classList.remove('closed');
//         mainRowSubWrap.classList.remove('hidden');
//       } else {
//         target.innerHTML = icons.keyArrowRight;
//         target.classList.add('closed');
//         mainRowSubWrap.classList.add('hidden');
//       }
//     });

//     for (const date in data[objId].reviewDates) {
//       const dateRowWrap = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-date'] });
//       mainRowSubWrap.appendChild(dateRowWrap);

//       const dateRow = _DOM.createElement('div', { class: ['row', 'row-date'] });
//       const dateTI = buildToggleIcon();
//       dateTI.classList.add('subToggle');
//       dateRow.appendChild(dateTI);
//       dateRow.innerHTML += `<div>${date}</div>`;
//       dateRowWrap.appendChild(dateRow);
      
//       const detailsTable = _DOM.createElement('div', { class: ['rowWrap', 'rowWrap-date-sub', 'hidden'] });
//       dateRowWrap.appendChild(detailsTable);

//       dateRow.addEventListener('click', e => {
//         const target = e.target;

//         if (!target.classList.contains('subToggle')) return;
  
//         const showChildren = target.classList.contains('closed');

//         if (showChildren) {
//           target.innerHTML = icons.keyArrowDown;
//           target.classList.remove('closed');
//           detailsTable.classList.remove('hidden');
//         } else {
//           target.innerHTML = icons.keyArrowRight;
//           target.classList.add('closed');
//           detailsTable.classList.add('hidden');
//         }
//       });

//       // const detailsHeading = _DOM.createElement('div', { class: ['heading', 'heading-details'] });
//       // detailsHeading.innerHTML = `
//       //   <div>Employee</div>
//       //   <div>Result</div>
//       //   <div>Attempts</div>
//       //   <div>Prompts</div>  
//       //   <div>Note</div>
//       // `;
//       // detailsTable.appendChild(detailsHeading);

//       // for (const staffId in data[objId].reviewDates[date]) {
//       //   const details = data[objId].reviewDates[date][staffId];
//       //   const detailRow = _DOM.createElement('div', { class: ['row', 'row-details'] });
//       //   detailRow.innerHTML = `
//       //     <div>${details.employee}</div>
//       //     <div>${details.result}</div>
//       //     <div>${details.attempts}</div>
//       //     <div>${details.prompts}</div>
//       //     <div>${details.note}</div>
//       //   `;
//       //   detailsTable.appendChild(detailRow);

//       //   detailRow.addEventListener('click', () => {
//       //     console.log('detail row click', details.activityId);
//       //     onDetailRowClick({goalTypeID: objId, activityId: details.activityId, date: date});
//       //   });
//       // }
//     }
//   }

//   return table;
// }

// Constants
// const NO_FREQ = 'No Frequency';
// const HOUR = 'Hourly';
// const DAY = 'Daily';
// const WEEK = 'Weekly';
// const MONTH = 'Monthly';
// const YEAR = 'Yearly';

// let selectedDateSpan = { to: null, from: null };

// const dateInputs = `
// <div class="daysBack active">
//   <label for="daysBack">${unitType} Back:</label>
//   <input type="number" id="daysBack" name="daysBack" min="1" value="${spanLength}" />
// </div>

// <div class="dateRange">
//   <div>
//     <label for="fromDate">From:</label>
//     <input type="date" id="fromDate" name="fromDate" />
//   </div>
//   <div>
//     <label for="toDate">To:</label>
//     <input type="date" id="toDate" name="toDate" />
//   </div>
// </div>
// `;