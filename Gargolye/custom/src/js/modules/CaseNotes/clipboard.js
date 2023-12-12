// let reviewRequired;
// reviewRequired = cnData.isReviewRequired();

//TODO-ASH: NO GROUP NOTES IF DOC TIME IS ALLOWED
//TODO-ASH: crete checkbox for corrected (review only)
//TODO-ASH: You have selected a bill code that does not allow group notes. Please select only one consumer.

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
//const parser = new DOMParser();
// const respDoc = parser.parseFromString(saveCaseNoteResults, 'text/xml');
// let caseNoteId = respDoc.getElementsByTagName('caseNoteId')[0].childNodes[0].nodeValue;
// let cnID = extractCaseNoteId(saveCaseNoteResults);

// (function (global, factory) {
//   global.Alert = factory();
// })(this, function () {
//   //? WARNINGS
//   //1. Attachments on this case note will be lost by converting this single note to a group note.
//   //2. The times you have entered are outside the current normal working hours.

//   //! ERROS
//   //1. You have selected a bill code that does not allow group notes. Please select only one consumer.
//   //2. Please select a consumer to get started.

//   //=======================================
//   // MAIN LIB
//   //---------------------------------------
//   /**
//    * @constructor
//    * @param {Object} options
//    * @param {String} options.type
//    * @param {String} options.message
//    * @param {String} options.name
//    * @returns {Alert}
//    */
//   function Alert(options) {
//     // Data Init
//     this.type = options.type;
//     this.message = options.message;
//     this.name = options.name;

//     // DOM Ref
//     this.rootElement = null;

//     this._build();
//   }

//   /**
//    * @function
//    */
//   Alert.prototype._build = function () {
//     this.rootElement = _DOM.createElement('div', { class: ['alert'] });

//     let iconWrap;
//     if (this.type === 'error') {
//       const iconInner = _DOM.createElement('div', {
//         class: 'iconInner',
//         node: [Icon.getIcon('error'), Icon.getIcon('checkmark')],
//       });
//       iconWrap = _DOM.createElement('div', {
//         class: ['iconWrap', 'flippable'],
//         node: iconInner,
//       });
//     } else {
//       iconWrap = _DOM.createElement('div', { class: 'iconWrap', node: Icon.getIcon('warning') });
//     }

//     this.messageEle = _DOM.createElement('p', { class: 'alert__message', text: this.message });

//     this.rootElement.appendChild(iconWrap);
//     this.rootElement.appendChild(this.messageEle);
//   };

//   /**
//    * @function
//    */
//   Alert.prototype.setMessage = function (message) {
//     this.messageEle.innerText = message;
//   };

//   /**
//    * Sets the status of the error to valid/invalid
//    *
//    * @function
//    */
//   Alert.prototype.setErrorStatus = function (isError) {
//     if (isError) {
//       this.rootElement.classList.remove('valid');
//     } else {
//       this.rootElement.classList.add('valid');
//     }
//   };

//   /**
//    * @function
//    */
//   Alert.prototype.hide = function () {
//     this.rootElement.classList.add('hidden');
//   };

//   /**
//    * @function
//    */
//   Alert.prototype.show = function () {
//     this.rootElement.classList.remove('hidden');
//   };

//   /**
//    * Renders Alert markup to the specified DOM node.
//    *
//    * @function
//    * @param {Node} node DOM node to render alert element to
//    * @returns {Alert} Returns the current instances for chaining
//    */
//   Alert.prototype.renderTo = function (node) {
//     if (node instanceof Node) {
//       node.appendChild(this.rootElement);
//     }

//     return this;
//   };

//   return Alert;
// });
