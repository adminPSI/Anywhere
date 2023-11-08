//? QUESTIONS FOR JOSH
//1. Since we are letting them doc time even if its not required,
//   how will this work with no group notes if doc time is allowed?
//2.

//TODO-ASH: NO GROUP NOTES IF DOC TIME IS ALLOWED
//TODO-ASH: preSave() stops timer and speech to text
//TODO-ASH:: add checkbox to toggle between seing only yours vs everyones notes in overview
//TODO-ASH: create logic to update charcount on keyup, input

//? REVIEW ONLY
//-----------------------------
//TODO: crete checkbox for corrected (review only)

// let reviewRequired;
// reviewRequired = cnData.isReviewRequired();

// group notes
// let allowGroupNotes = false;
// let isGroupNote = false;
// allowGroupNotes = cnData.allowGroupNotes();
// allowGroupNotes = cnData.allowGroupNotes(selectedServiceCode);

// function convertSingleNoteToGroupNote() {
//   //TODO-ASH: 1. convertToGroupNotes === true | only if !isGroupNote && allowGroupNotes
//   //TODO-ASH: 2. allowGroupNotes | this gets set on from service code dropdown event
//   //TODO-ASH: 3. isGroupNote | set when singleNotToGroupNote is called

//   if (!isGroupNote && allowGroupNotes) {
//     //* SINGLE NOTE TO GROUP NOTE LOGIC
//     //TODO-ASH: delete existing case note
//     //TODO-ASH: isGroupNote = true
//     //TODO-ASH: set noteId = 0?
//     //TODO-ASH: if (travelTime === null) travelTime = 0;
//     //TODO-ASH: if (documentationTime === null) documentationTime = 0;
//     //TODO-ASH: endTime = endTime.substring(0, 5);
//     //TODO-ASH: startTime = startTime.substring(0, 5);
//     //TODO-ASH: set page load to new?
//   }
// }

// async function updateNote() {
//   //TODO-ASH: clean start time and end time:
//   // endTime = endTime.length === 8 ? endTime.substring(0, 5) : endTime;
//   // startTime = startTime.length === 8 ? startTime.substring(0, 5) : startTime;
//   //? Different props from saveData
//   // add -> groupNoteId, consumerId
//   // remove -> reviewRequired
// }

// (function (global, factory) {
//   global.RosterCard = factory();
// })(this, function () {});
