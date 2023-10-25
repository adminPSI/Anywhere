// let groupNoteId = await _UTIL.fetchData('getGroupNoteId');
// groupNoteId = groupNoteId.getGroupNoteIdResult;

// let overlap = await _UTIL.fetchData('caseNoteOverlapCheck', {
//   caseManagerId,
//   consumerId: selectedConsumers[0],
//   endTime: formData.endTime,
//   groupNoteId: groupNoteId,
//   noteId: 0,
//   serviceDate: dates.formatISO(selectedDate, { representation: 'date' }),
//   startTime: formData.startTime,
// });
// overlap = overlap.caseNoteOverlapCheckResult;

// if (overlap) {
//   console.log('OVERLAP WARNING!!!!');
// } else {
//   await _UTIL.fetchData('saveGroupCaseNote', {});
// }
