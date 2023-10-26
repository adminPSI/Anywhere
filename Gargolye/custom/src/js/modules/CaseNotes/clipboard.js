// // let groupNoteId = await _UTIL.fetchData('getGroupNoteId');
// // groupNoteId = groupNoteId.getGroupNoteIdResult;

// // DATA
// //---------------
// const enteredBy = `${rd.enteredby} (${rd.originalUserFullName})`;
// const isConfidential = rd.confidential === 'Y' ? true : false;
// const name = `${rd.lastname}, ${rd.firstname}`;
// const location = rd.locationName;
// const service = rd.serviceName;
// const note = rd.caseNote;
// const starttime = UTIL.convertFromMilitary(rd.starttime);
// const endtime = UTIL.convertFromMilitary(rd.endtime);
// const timeSpan = `
//         <span class="time">${starttime.split(' ')[0]}</span>
//         <span class="timeMeridiem">${starttime.split(' ')[1]}</span>
//         <span class="separator">-</span>
//         <span class="time">${endtime.split(' ')[0]}</span>
//         <span class="timeMeridiem">${endtime.split(' ')[1]}</span>
//         <span class="separator">|</span>
//       `;
// const timeDifference = _UTIL.getMilitaryTimeDifference(rd.starttime, rd.endtime);

// let mostRecentUpdate = new Intl.DateTimeFormat('en-US', {
//   day: 'numeric',
//   month: 'numeric',
//   year: '2-digit',
//   hour: 'numeric',
//   minute: 'numeric',
//   weekday: 'long',
// }).format(new Date(rd.mostrecentupdate));
// mostRecentUpdate = mostRecentUpdate.split(', ');
// mostRecentUpdate = `${mostRecentUpdate[0].substring(0, 3)}, ${mostRecentUpdate[1]} at ${mostRecentUpdate[2]}`;

// //* GK ONLY
// const attachmentCount = rd.attachcount; // if > 0 then will show gree attachment icon

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

// CaseNotesInsertPhrases.prototype.build = function () {
//   this.phraseWrap = _DOM.createElement('div', { class: 'caseNotesPhrases' });

//   this.phraseDropdown = new Select({
//     id: 'phrases',
//     label: 'Phrases',
//     data: this.phrasesData,
//     includeBlankOption: true,
//   });

//   this.phraseInsertBtn = new Button({ type: 'button', text: 'Add' });

//   this.phraseDropdown.build().renderTo(this.phraseWrap);
//   this.phraseInsertBtn.build().renderTo(this.phraseWrap);

//   this.setupEvents();

//   return this;
// };

// this.showAllPhrasesToggle.onChange(async e => {
//   this.showAllPhrases = e.target.checked ? true : false;

//   await this.fetchData();

//   this.phraseDropdown.populate(this.phrasesData);

//
// });
