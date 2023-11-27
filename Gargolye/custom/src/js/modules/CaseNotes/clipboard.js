//? QUESTIONS FOR JOSH
//1. what all causes overlap?
//TODO-ASH: stop speech to text on save
//TODO-ASH: after they save a note, if they don't hit save and clear, allow them to immediatley convert note to a group note

//? REVIEW ONLY
//-----------------------------
//? QUESTIONS FOR JOSH
//1. Since we are letting them doc time even if its not required,
//   how will this work with no group notes if doc time is allowed?
//TODO: crete checkbox for corrected (review only)
//TODO-ASH: NO GROUP NOTES IF DOC TIME IS ALLOWED

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
//   /**
//    * @constructor
//    */
//   function Attachment() {}

//   /**
//    * @function
//    */
//   Attachment.prototype._build = function () {};

//   return Attachment;
// });

// const customEvent = new CustomEvent('onCardEdit', {
//   bubbles: true,
//   cancelable: true,
//   detail: { caseNoteId },
// });
// this.overviewCardsWrap.dispatchEvent(customEvent);

// _UTIL.localStorageHandler.get('casenotes-showAllPhrases');
// _UTIL.localStorageHandler.set('casenotes-showAllPhrases', value);

// view
//---------------------------------
// const densitySmallButton = _DOM.createElement('div', {
//   class: ['densitySmall'],
//   node: Icon.getIcon('densitySmall'),
// });
// const densityMediumButton = _DOM.createElement('div', {
//   class: ['densityMedium'],
//   node: Icon.getIcon('densityMedium'),
// });

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

// (function (global, factory) {
//   global.ConfirmationPopup = factory();
// })(this, function () {
//   //=========================
//   // MAIN LIB
//   //-------------------------
//   /**
//    * Default configuration
//    * @type {Object}
//    */
//   const DEFAULT_OPTIONS = {
//     style: 'default', // warning, error
//   };

//   /**
//    * @constructor
//    */
//   function ConfirmationPopup(options) {
//     this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
//     // Instance Ref
//     this.dialog = null;

//     // DOM Ref
//     this.confirmationButtons = null;
//     this.yesButton = null;
//     this.noButton = null;

//     this._build();
//   }

//   ConfirmationPopup.prototype._build = function () {
//     this.dialog = new Dialog({ className: 'inactivityWarning' });

//     const messageEle = _DOM.createElement('p', {
//       text: this.options.message,
//     });

//     this.confirmationButtons = _DOM.createElement('div', { class: 'button-wrap' });
//     this.yesButton = new Button({ text: 'yes' });
//     this.noButton = new Button({ text: 'no', styleType: 'outlined' });
//     this.yesButton.renderTo(this.confirmationButtons);
//     this.noButton.renderTo(this.confirmationButtons);

//     this.dialog.dialog.appendChild(messageEle);
//     this.dialog.dialog.appendChild(this.confirmationButtons);
//   };

//   /**
//    * Sets up events for Dialog Box
//    *
//    * @function
//    */
//   ConfirmationPopup.prototype._setupEvents = function () {
//     this.confirmationButtons.addEventListener('click', e => {
//       this.dialog.close();

//       const customEvent = new CustomEvent('onConfirmationClick', {
//         bubbles: true,
//         cancelable: true,
//         detail: e.target.dataset.target === 'yes' ? true : false,
//       });
//       this.confirmationButtons.dispatchEvent(customEvent);
//     });
//   };

//   /**
//    * @function
//    * @param {Function} cbFunc Callback function to call
//    */
//   ConfirmationPopup.prototype.onClick = function (cbFunc) {
//     this.confirmationButtons.addEventListener('onConfirmationClick', e => {
//       cbFunc(e.detail);
//     });
//   };

//   /**
//    * Shows the confirmation popup/dialog
//    *
//    * @function
//    */
//   ConfirmationPopup.prototype.show = function () {
//     this.dialog.show();
//   };

//   return ConfirmationPopup;
// });
