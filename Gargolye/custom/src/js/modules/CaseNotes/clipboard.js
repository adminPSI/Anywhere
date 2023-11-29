// let reviewRequired;
// reviewRequired = cnData.isReviewRequired();

// group notes
// let allowGroupNotes = false;
// let isGroupNote = false;
// allowGroupNotes = cnData.allowGroupNotes();
// allowGroupNotes = cnData.allowGroupNotes(selectedServiceCode);

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

// if (this.options.allowMultiSelect) {
//   if (!e.target.parentNode.classList.contains('selected')) {
//     e.target.parentNode.classList.add('selected');
//     this.selectedConsumers[e.target.dataset.id] = e.target;
//   } else {
//     e.target.parentNode.classList.remove('selected');
//     delete this.selectedConsumers[e.target.dataset.id];
//   }
// } else {
//   if (e.target.parentNode.classList.contains('selected')) {
//     e.target.parentNode.classList.remove('selected');
//     delete this.selectedConsumers[e.target.dataset.id];
//   } else {
//     this.clearSelectedConsumers();

//     e.target.parentNode.classList.add('selected');
//     this.selectedConsumers[e.target.dataset.id] = e.target;
//   }
// }

// if (saveCaseNoteResults) {
//   if ($.session.applicationName === 'Gatekeeper' && Object.keys(attachmentsForSave).length) {
//     await reqVisualizer.showSuccess('Case Note Saved!', 2000);

//     // save attachments
//     reqVisualizer.showPending('Saving Note Attachments');
//     const saveAttachmentsResults = await saveAttachments(saveCaseNoteResults);
//     if (saveAttachmentsResults === 'success') {
//       reqVisualizer.fullfill('success', 'Attachments Saved!', 2000);
//     } else {
//       reqVisualizer.fullfill('error', 'Error Saving Note Attachments', 2000);
//     }
//   } else {
//     reqVisualizer.fullfill('success', 'Case Note Saved!', 2000);
//   }
// } else {
//   reqVisualizer.fullfill('error', 'Error Saving Case Note', 2000);
// }

//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------

// if (selectedConsumers.length === 1 && !caseNoteId) {
//   // save single case note
//   // procedure => saveCaseNote()
// }

// if (selectedConsumers.length === 1 && caseNoteId && !caseNoteEditData.groupid) {
//   // save single case note
//   // procedure => saveCaseNote()
// }

// if (selectedConsumers.length === 1 && caseNoteId && caseNoteEditData.groupid) {
//   // save single case note
//   // procedure => saveCaseNote()
//   // save group values
//   // procedure => updateGroupNoteValues()
// }

// if (selectedConsumers.length > 1 && caseNoteId && !caseNoteEditData.groupid) {
//   // delete existing note
//   // for each consumer
//   // save group case note
//   // procedure => saveGroupCaseNote()
// }

// if (selectedConsumers.length > 1 && caseNoteId && caseNoteEditData.groupid) {
//   // A: for consumer already on note
//   // save single case note
//   // procedure => saveCaseNote()
//   // save group values
//   // procedure => updateGroupNoteValues()
//   //------------------------------------------------
//   // B: for newly added consumer
//   // save additional group case note
//   // procedure => saveAdditionalGroupCaseNote()
//   // save group values
//   // procedure => updateGroupNoteValues()
// }

// if (selectedConsumers.length === 1) {
//   // save/update single note
//   saveData.consumerId = selectedConsumers[0];
//   await saveNote(saveData, attachmentsForSave);
// } else {
//   if (!caseNoteEditData.groupid) {
//     await saveGroupNote(saveData, attachmentsForSave);
//   } else {
//     selectedConsumers.forEach(async consumerId => {
//       saveData.consumerId = consumerId;

//       if (caseNoteEditData.consumerid === consumerId) {
//         saveData.noteId = caseNoteEditData.noteid;
//         await saveNote(saveData, attachmentsForSave);
//         await updateGroupNote();
//       } else {
//         saveData.noteId = 0;
//         await saveAdditionGroupNote();
//         await updateGroupNote();
//       }
//     });
//   }
// }
