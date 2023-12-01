// let reviewRequired;
// reviewRequired = cnData.isReviewRequired();

// group notes
// let allowGroupNotes = false;
// let isGroupNote = false;
// allowGroupNotes = cnData.allowGroupNotes();
// allowGroupNotes = cnData.allowGroupNotes(selectedServiceCode);

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

//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------

// if (selectedConsumers.length === 1 && !caseNoteId) {
// save single case note
// procedure => saveCaseNote()
// }

// if (selectedConsumers.length === 1 && caseNoteId && !caseNoteEditData.groupid) {
// save single case note
// procedure => saveCaseNote()
// }

// if (selectedConsumers.length === 1 && caseNoteId && caseNoteEditData.groupid) {
// save single case note
// procedure => saveCaseNote()
// save group values
// procedure => updateGroupNoteValues()
// }

// if (selectedConsumers.length > 1 && caseNoteId && !caseNoteEditData.groupid) {
// delete existing note
// for each consumer
// save group case note
// procedure => saveGroupCaseNote()
// }

// if (selectedConsumers.length > 1 && caseNoteId && caseNoteEditData.groupid) {
// A: for consumer already on note
// save single case note
// procedure => saveCaseNote()
// save group values
// procedure => updateGroupNoteValues()
//------------------------------------------------
// B: for newly added consumer
// save additional group case note
// procedure => saveAdditionalGroupCaseNote()
// save group values
// procedure => updateGroupNoteValues()
// }
// async function onFormSubmit(data, submitter) {
//   let saveCaseNoteResults, updateGroupValuesResults;

//   const saveData = {
//     caseManagerId,
//     caseNote: data.noteText ? _UTIL.removeUnsavableNoteText(data.noteText) : '',
//     casenotemileage: data.mileage ?? '0',
//     casenotetraveltime: data.travelTime ?? '',
//     consumerId: selectedConsumers[0],
//     confidential: data.confidential === 'on' ? 'Y' : 'N',
//     contactCode: data.contact ?? '',
//     corrected: 'N',
//     documentationTime: $.session.applicationName === 'Gatekeeper' ? cnDocTimer.getTime() : '',
//     endTime: data.endTime ? data.endTime.substring(0, 5) : '',
//     locationCode: data.location ?? '',
//     noteId: caseNoteId ?? 0,
//     needCode: data.need ?? '',
//     reviewRequired: '',
//     serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
//     serviceCode: data.service ?? '',
//     serviceLocationCode: data.serviceLocation ?? '',
//     serviceOrBillingCodeId: data.serviceCode ?? '',
//     startTime: data.startTime ? data.startTime.substring(0, 5) : '',
//     vendorId: data.vendor ?? '',
//   };

//   if (selectedConsumers.length === 1) {
//     saveCaseNoteResults = (await _UTIL.fetchData('saveCaseNote', saveData)).saveCaseNoteResult;
//   } else {
//     let saveGroupResults, updateGroupResults;

//     if (!caseNoteEditData.groupid) {
//       saveGroupResults = await saveGroupNote(saveData);
//     } else {
//       updateGroupResults = await updateGroupNote(saveData);
//     }
//   }

//   if (caseNoteEditData.groupid) {
//     updateGroupValuesResults = (
//       await _UTIL.fetchData('updateGroupNoteValues', {
//         groupNoteId: caseNoteEditData.groupid,
//         noteId: caseNoteId,
//         serviceOrBillingCodeId: saveData.serviceOrBillingCodeId,
//         serviceDate: saveData.serviceDate,
//         startTime: saveData.startTime,
//         endTime: saveData.endTime,
//       })
//     ).updateGroupNoteValuesResult;
//   }
// }

// async function updateGroupNote(formData) {
//   const savePromises = [];
//   selectedConsumers.forEach(consumerId => {
//     formData.consumerId = consumerId;

//     if (caseNoteEditData.consumerid === consumerId) {
//       // A: for consumer already on note
//       formData.noteId = caseNoteEditData.noteid;

//       const saveNotePromise = _UTIL.fetchData('saveCaseNote', saveData);
//       const updateGroupPromise = _UTIL.fetchData('updateGroupNoteValues', {
//         groupNoteId: caseNoteEditData.groupid,
//         noteId: caseNoteId,
//         serviceOrBillingCodeId: saveData.serviceOrBillingCodeId,
//         serviceDate: saveData.serviceDate,
//         startTime: saveData.startTime,
//         endTime: saveData.endTime,
//       });

//       savePromises.push(saveNotePromise);
//       savePromises.push(updateGroupPromise);
//     } else {
//       // B: for newly added consumer
//       formData.noteId = 0;

//       const saveNotePromise = _UTIL.fetchData('saveAdditionalGroupCaseNote', saveData);
//       const updateGroupPromise = _UTIL.fetchData('updateGroupNoteValues', {
//         groupNoteId: caseNoteEditData.groupid,
//         noteId: caseNoteId,
//         serviceOrBillingCodeId: saveData.serviceOrBillingCodeId,
//         serviceDate: saveData.serviceDate,
//         startTime: saveData.startTime,
//         endTime: saveData.endTime,
//       });

//       savePromises.push(saveNotePromise);
//       savePromises.push(updateGroupPromise);
//     }
//   });

//   const failedSaves = [];
//   const groupSaveResults = await Promise.allSettled(savePromises);
//   groupSaveResults.forEach((result, index) => {
//     if (result.status === 'rejected') {
//       failedSaves.push(consumerId);
//     }
//   });

//   if (failedSaves.length === 0) {
//     return 'success';
//   } else {
//     return 'error';
//   }
// }
// async function saveGroupNote(formData) {
//   await deleteNote(caseNoteId);

//   const groupNoteId = await _UTIL.fetchData('getGroupNoteId');
//   const consumerGroupCount = selectedConsumers.length;

//   const savePromises = [];
//   selectedConsumers.forEach(consumerId => {
//     const promise = _UTIL
//       .fetchData('saveGroupCaseNote', {
//         ...formData,
//         consumerId,
//         consumerGroupCount,
//         groupNoteId,
//       })
//       .then(result => ({ status: 'fulfilled', value: result }))
//       .catch(error => ({ status: 'rejected', reason: error }));

//     savePromises.push(promise);
//   });

//   const failedSaves = [];
//   const groupSaveResults = await Promise.allSettled(savePromises);
//   groupSaveResults.forEach((result, index) => {
//     if (result.status === 'rejected') {
//       failedSaves.push(consumerId);
//     }
//   });

//   if (failedSaves.length === 0) {
//     return 'success';
//   } else {
//     return 'error';
//   }
// }
