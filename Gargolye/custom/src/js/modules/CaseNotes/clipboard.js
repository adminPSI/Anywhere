// // let groupNoteId = await _UTIL.fetchData('getGroupNoteId');
// // groupNoteId = groupNoteId.getGroupNoteIdResult;

// DATA
//---------------
// const timeSpan = `
//         <span class="time">${starttime.split(' ')[0]}</span>
//         <span class="timeMeridiem">${starttime.split(' ')[1]}</span>
//         <span class="separator">-</span>
//         <span class="time">${endtime.split(' ')[0]}</span>
//         <span class="timeMeridiem">${endtime.split(' ')[1]}</span>
//         <span class="separator">|</span>
//       `;
// if > 0 then will show gree attachment icon

// // DOM
// //---------------
// // card items
// const consumerNameEle = _DOM.createElement('p', { class: 'consumerName', text: name });
// const serviceInfoEle = _DOM.createElement('p', {
//   class: 'serviceInfoEle',
//   html: `${service} | ${location}`,
// });
// const noteTextEle = _DOM.createElement('p', { class: 'noteText', text: note });
// const timeSpanEle = _DOM.createElement('div', {
//   class: 'timeSpan',
//   html: `<p class="timeText">${timeSpan}</p><p class="duration">${timeDifference}</p>`,
// });
// const lastEditEle = _DOM.createElement('p', {
//   class: 'lastEdit',
//   html: `<span>Last Edit:</span> ${mostRecentUpdate}`,
// });
// const enteredByEle = _DOM.createElement('p', {
//   class: 'enteredBy',
//   html: `<span>Entered By:</span> ${enteredBy}`,
// });
// const editButton = new Button({
//   text: 'edit',
//   style: 'primary',
//   styleType: 'contained',
//   icon: 'edit',
// });
// const deleteButton = new Button({
//   text: 'delete',
//   style: 'danger',
//   styleType: 'outlined',
//   icon: 'delete',
// });

// // card layout
// const cardOne = _DOM.createElement('div', {
//   node: [timeSpanEle],
// });
// const cardTwo = _DOM.createElement('div', {
//   node: [consumerNameEle],
// });
// const cardThree = _DOM.createElement('div', {
//   node: [editButton.button, deleteButton.button],
//   class: 'cardThree',
// });
