var emptySignatureDataURL = `iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC`;

function clearSavedSignaturesAndNotes() {
    $.session.evvDataCache = {};
}
function removeConsumerFromEVVCache(consumerId) {
    delete $.session.evvDataCache[consumerId];
}

function saveSignatureAndNote(savedSingleEntryId) {
    var savedSignaturesAndNotes = [];

    for (var prop in $.session.evvDataCache) {
        var singleEntryId;

        if (Array.isArray(savedSingleEntryId)) {
            var currerntConsumer = $.session.evvDataCache[prop]._consumerID;
            savedSingleEntryId.forEach(entry => {
                if (entry.consumerId.indexOf(currerntConsumer) !== -1) {
                    singleEntryId = entry.singleEntryId;
                }
            });
        } else {
            singleEntryId = savedSingleEntryId;
        }

        $.session.evvDataCache[prop]._signatureDataUrl = $.session.evvDataCache[prop]._signatureDataUrl.replace("data:image/png;base64,", "");

        savedSignaturesAndNotes.push({
            token: $.session.Token,
            singleEntryId: singleEntryId,
            consumerId: $.session.evvDataCache[prop]._consumerID,
            note: UTIL.removeUnsavableNoteText($.session.evvDataCache[prop]._noteDataString),
            signatureImage: $.session.evvDataCache[prop]._signatureDataUrl
        });
    }

    if (savedSignaturesAndNotes.length > 0) {
        savedSignaturesAndNotes.forEach(evvEntry => {
            signatureAjax.singleEntrySaveSignatureAndNote(evvEntry);
        });
    }

    //clearSavedSignaturesAndNotes();
}

function validateEVV() {
    var signRequired = $.session.singleEntryShowConsumerSignature === 'Y' ? true : false;
    var noteRequired = $.session.singleEntryShowConsumerNote === 'Y' ? true : false;
    var consumersArray = Array.prototype.slice.call(document.querySelectorAll('.consumer.singleentryselected'));
    var isValidEVV = true;

    if (signRequired || noteRequired) {
        if (consumersArray.length > 0) {
            var hasSignature, hasNote;
            consumersArray.forEach(consumer => {
                if (consumer.id in $.session.evvDataCache) {
                    // if consumer has EVV grab it
                    var consumerEVV = $.session.evvDataCache[consumer.id];
                    // check consumerEVV for signature and note values
                    hasSignature = consumerEVV._signatureDataUrl === '' ? false : true;
                    hasNote = consumerEVV._noteDataString === '' ? false : true;
                    if (signRequired && hasSignature === false) isValidEVV = false;
                    if (noteRequired && hasNote === false) isValidEVV = false;
                } else {
                    // if any consumer is selected but dosen't have an EVV
                    isValidEVV = false;
                }
            });
        }
    }

    return isValidEVV;
}

class EVV {
    constructor(options) {
        this._actionBtn;
        this._evvContainer;
        // signature coming from db?
        this._fromSave = options.fromSave ? true : false;
        // signature pad brains
        this._signaturePad;
        // save data
        this._consumerID = options.consumerId;
        this._signatureDataUrl = options.signatureDataUrl;
        this._noteDataString = options.noteDataString;
        // dom references
        this._consumerSECard;
        this._consumerCard = options.consumer;
        // popup markup
        this._signatureImageMarkup;
        this._signatureMarkup;
        this._noteMarkup;
        this._evvActionMarkup;
        // temp signature data storage for cancel button
        this._tempSigData

        this._init();
    }

    // PRIVATE METHODS - DO NOT TOUCH OR CALL!
    //==========================================
    _init() {
        // check for null Consumer Card
        if (!this._consumerCard) {
            var consumers = Array.prototype.slice.call(document.querySelectorAll('.consumer-selected'));
            consumers.forEach(consumer => {
                if (consumer.dataset.consumerId === this._consumerID) {
                    this._consumerCard = consumer;
                }
            });
        }
        // build popups and save reference
        this._signatureMarkup = this._renderEVVMarkup('sign');
        this._signatureImageMarkup = this._renderEVVMarkup('img');
        this._noteMarkup = this._renderEVVMarkup('note');
        this._evvActionMarkup = this._renderEVVActionMarkup();
        // init signature pad
        this._initSignaturePad();
        // add events
        this._popupEvents();
        this._signatureEvents();
        // initial cache if new single entry
        if (!this._fromSave) {
            $.session.evvDataCache[this._consumerID] = this;
        }
    }
    _initSignaturePad() {
        var canvas = this._signatureMarkup.querySelector('.evvCanvas');
        if (!canvas) return;
        this._signaturePad = new SignaturePad(canvas);
    }
    _dataURLToBlob(dataURL) {
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    }

    // CRUD METHODS
    //--------------------------------
    _saveSignatureData() {
        if (this._signaturePad.isEmpty()) {
            this._tempSigData = '';
        } else {
            var dataUrl = this._signaturePad.toDataURL();
            this._signatureDataUrl = dataUrl.replace("data:image/png;base64,", "");
        }
    }
    _saveNoteData() {
        var noteText = this._noteMarkup.querySelector('.evv-note--pad');
        this._noteDataString = noteText.value;
    }
    _saveEVVInstance() {
        $.session.evvDataCache[this._consumerID] = this;
    }

    // EVV
    //--------------------------------
    _renderSignatureMarkup() {
        var markup = `
      <div class="signature-pad--body">
        <p class="extras--label">Signature</p>
        <canvas class="evvCanvas" />
      </div>

      <div class="signature-pad--footer">
        <div class="signature-pad--actions">
          <button type="button" class="btn btn--secondary btn--outlined clear" data-action="clear">Clear</button>
          <button type="button" class="btn btn--secondary btn--outlined" data-action="undo">Undo</button>
        </div>
      </div>
    `;

        return markup;
    }
    _renderSignatureImageMarkup() {
        var markup = `
      <div class="signature-pad--body">
        <p class="extras--label">signature</p>
        <img src="${this._signatureDataUrl}" />
      </div>
    `;

        return markup;
    }
    _renderNoteMarkup() {
        var markup = `
      <p class="extras--label">Note</p>
      <div class="evv-note--pad-wrap">
        <span class="evv-note--icon"></span>
        <textarea class="evv-note--pad"></textarea>
      </div>
    `;

        return markup;
    }
    _renderEVVActionMarkup() {
        var savebtn;
        if ((this._signatureDataUrl === emptySignatureDataURL || this._signatureDataUrl === '' || !this._fromSave) || $.session.singleEntryShowConsumerNote === 'Y') {
            savebtn = '<button type="button" class="btn btn--secondary btn--contained saveEvv" data-action="save">Save</button>';
        } else {
            savebtn = '';
        }
        var markup = `
      <div class="evv--actions">
        ${savebtn}
        <button type="button" class="btn btn--secondary btn--outlined cancelEvv" data-action="cancel">Cancel</button>
      </div>
    `;

        var evvDiv = document.createElement('div');
        evvDiv.innerHTML = markup;
        return evvDiv;
    }
    _renderEVVMarkup(type) {
        var evvDiv = document.createElement('div');
        // evvDiv.setAttribute('data-consumerID', this._consumerID);
        // evvDiv.setAttribute('data-popupType', type);

        if (type === 'sign') {
            evvDiv.classList.add('signature-pad');
            evvDiv.innerHTML = this._renderSignatureMarkup();
            return evvDiv;
        }

        if (type === 'img') {
            evvDiv.classList.add('signature-pad');
            evvDiv.innerHTML = this._renderSignatureImageMarkup();
            return evvDiv;
        }

        if (type === 'note') {
            evvDiv.classList.add('evv-note');
            evvDiv.innerHTML = this._renderNoteMarkup();
            return evvDiv;
        }
    }
    // POPUP EVENTS
    //--------------------------------
    _evvSave() {
        if (this._signatureDataUrl === emptySignatureDataURL || this._signatureDataUrl === '' || !this._fromSave) {
            this._saveSignature();
        }

        this._saveNote();
        this._saveEVVInstance();

        // get dom elements
        this._consumerSECard = this._consumerCard.parentElement;
        this._actionBtn = this._consumerSECard.querySelector('.extrasBtn ');

        if (!this._signaturePad.isEmpty() || this._noteDataString !== '') {
            this._actionBtn.classList.add('evv-highlight');
        } else {
            this._actionBtn.classList.remove('evv-highlight');
        }

        POPUP.hide(this._evvContainer);
    }
    _evvCancel() {
        if (this._tempSigData != undefined)
            this._signaturePad.fromData(this._tempSigData);
        POPUP.hide(this._evvContainer);
    }
    _popupEvents() {
        var saveButton = this._evvActionMarkup.querySelector('[data-action=save]');
        var cancelButton = this._evvActionMarkup.querySelector('[data-action=cancel');

        if (saveButton) saveButton.addEventListener('click', this._evvSave.bind(this));
        cancelButton.addEventListener('click', this._evvCancel.bind(this));
    }
    // Signature Popup
    _saveSignature() {
        if ($.session.singleEntryShowConsumerSignature === 'N') return;
        this._saveSignatureData();
    }
    _undoSignature() {
        var data = this._signaturePad.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            this._signaturePad.fromData(data);
        }
    }
    _clearSignature() {
        this._tempSigData = [...this._signaturePad._data];
        this._signaturePad.clear();
        this._signatureDataUrl = '';
    }
    _signatureEvents() {
        var clearButton = this._signatureMarkup.querySelector('[data-action=clear]');
        var undoButton = this._signatureMarkup.querySelector('[data-action=undo]');

        if (clearButton) clearButton.addEventListener('click', this._clearSignature.bind(this));
        if (undoButton) undoButton.addEventListener('click', this._undoSignature.bind(this));

    }
    // Note Popup
    _saveNote() {
        if ($.session.singleEntryShowConsumerNote === 'N') return;
        this._saveNoteData();
    }

    // PUBLIC METHODS
    //==========================================
    editInit() {
        if (!this._consumerCard) {
            var consumers = Array.prototype.slice.call(document.querySelectorAll('.consumerCard'));
            consumers.filter(consumer => {
                if (consumer.dataset.consumerId === this._consumerID) {
                    this._consumerCard = consumer;
                }
            });
        }
    }
    populatePopup() {
        this._evvContainer = document.getElementById('consumerExtrasPopup');

        const showSignature = $.session.singleEntryShowConsumerSignature === 'Y' ? true : false;
        const showNote = $.session.singleEntryShowConsumerNote === 'Y' ? true : false;

        if (showSignature) {
            this._tempSigData = [...this._signaturePad._data];

            if (this._signatureDataUrl === emptySignatureDataURL || this._signatureDataUrl === '' || !this._fromSave) {
                this._evvContainer.appendChild(this._signatureMarkup);
            } else {
                this._evvContainer.appendChild(this._signatureImageMarkup);
            }
        }

        if (showNote) {
            this._evvContainer.appendChild(this._noteMarkup);
            var note = this._noteMarkup.querySelector('.evv-note--pad');
            note.value = this._noteDataString;
        }
        this._evvContainer.appendChild(this._evvActionMarkup);
    }
}