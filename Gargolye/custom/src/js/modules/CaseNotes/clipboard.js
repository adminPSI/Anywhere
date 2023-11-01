// // let groupNoteId = await _UTIL.fetchData('getGroupNoteId');
// // groupNoteId = groupNoteId.getGroupNoteIdResult;

// function showWarningModal(messageText, continueFunc) {
//   const message = _DOM.createElement('p', { text: messageText });

//   const warningModal = new Dialog({ isModal: true, node: message });

//   const continueBtn = new Button({
//     text: 'Continue',
//     style: 'primary',
//     styleType: 'contained',
//   });
//   const cancelBtn = new Button({
//     text: 'Cancel',
//     style: 'primary',
//     styleType: 'outlined',
//   });

//   continueBtn.renderTo(warningModal);
//   cancelBtn.renderTo(warningModal);

//   continueBtn.onClick(() => {
//     warningModal.close();
//     continueFunc();
//   });
//   cancelBtn.onClick(() => {
//     warningModal.close();
//   });

//   warningModal.renderTo(moduleWrap);

//   warningModal.show();
// }
