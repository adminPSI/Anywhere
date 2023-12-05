// let reviewRequired;
// reviewRequired = cnData.isReviewRequired();

//TODO-ASH: crete checkbox for corrected (review only)

function convertSingleNoteToGroupNote() {
  //TODO-ASH: 1. convertToGroupNotes === true | only if !isGroupNote && allowGroupNotes
  //TODO-ASH: 2. allowGroupNotes | this gets set on from service code dropdown event
  //TODO-ASH: 3. isGroupNote | set when singleNotToGroupNote is called

  if (!isGroupNote && allowGroupNotes) {
    //* SINGLE NOTE TO GROUP NOTE LOGIC
    //TODO-ASH: delete existing case note
    //TODO-ASH: isGroupNote = true
    //TODO-ASH: set noteId = 0?
    //TODO-ASH: if (travelTime === null) travelTime = 0;
    //TODO-ASH: if (documentationTime === null) documentationTime = 0;
    //TODO-ASH: endTime = endTime.substring(0, 5);
    //TODO-ASH: startTime = startTime.substring(0, 5);
    //TODO-ASH: set page load to new?
  }
}

async function updateNote() {
  //? Different props from saveData
  //TODO-ASH: add -> groupNoteId, consumerId
  //TODO-ASH: remove -> reviewRequired
}

// CODE SNIPPETS
//----------------------------------------------
// (function (global, factory) {
//   global.Attachment = factory();
// })(this, function () {
//   function Attachment() {}
//   Attachment.prototype._build = function () {};
//   return Attachment;
// });

// const customEvent = new CustomEvent('onCardEdit', {
//   bubbles: true,
//   cancelable: true,
//   detail: { },
// });
// overviewCardsWrap.dispatchEvent(customEvent);

// _UTIL.localStorageHandler.get('casenotes-showAllPhrases');
// _UTIL.localStorageHandler.set('casenotes-showAllPhrases', value);

// reqVisualizer.show('Saving Case Note...');
// reqVisualizer.fullfill('error', 'Error Saving Case Note', 2000);
// reqVisualizer.fullfill('success', 'Case Note Saved!', 2000);
// await reqVisualizer.showSuccess('Case Note Saved!', 2000);
// if (saveCaseNoteResults) {
//   caseNoteEditData = (
//     await _UTIL.fetchData('getCaseNoteEditJSON', {
//       noteId: caseNoteId,
//     })
//   ).getCaseNoteEditJSONResult[0];
// }

//----------------------------------------------------------
