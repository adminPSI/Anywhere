(function (global, factory) {
    global.CaseNotesPhrases = factory();
})(this, function () {
    //=======================================
    // ADDING NEW PHRASES
    //---------------------------------------
    /**
     * Constructor function for creating the Case Notes Add Phrases component.
     *
     * @constructor
     * @returns {CaseNotesAddPhrases}
     */
    function CaseNotesAddPhrases(phrasesInstance) {
        // Data Init
        // Instances
        this.dialog = null;
        this.addPhraseForm = null;
        this.PhrasesInstance = phrasesInstance;
        // DOM Ref
    }

    /**
     * @function
     * @returns {CaseNotesAddPhrases} - Returns the current instances for chaining
     */
    CaseNotesAddPhrases.prototype.build = function () {
        this.dialog = new Dialog({ className: 'addPhrases' });

        this.addPhraseForm = new Form({
            fields: [
                {
                    type: 'checkbox',
                    label: 'Publicly Available',
                    id: 'public',
                },
                {
                    type: 'text',
                    label: 'shortcut',
                    id: 'shortcut',
                    required: true,
                    maxlength: 10,
                    //showCount: true,
                },
                {
                    type: 'textarea',
                    label: 'phrase',
                    id: 'phrase',
                    required: true,
                },
            ],
            // buttons: [
            //   {
            //     text: 'Cancel',
            //     icon: 'cancel',
            //     style: 'primary',
            //     styleType: 'outlined',
            //     name: 'cancel',
            //   },
            // ],
        });

        this.addPhraseForm.renderTo(this.dialog.dialog);

        this.setupEvents();

        return this;
    };

    /**
     * @function
     */
    CaseNotesAddPhrases.prototype.show = function () {
        this.dialog.show();
    };

    /**
     * @function
     */
    CaseNotesAddPhrases.prototype.close = function () {
        this.dialog.close();
    };

    /**
     * @function
     */
    CaseNotesAddPhrases.prototype.setupEvents = function () {
        this.addPhraseForm.onSubmit(async formData => {
            const data = await _UTIL.fetchData('insertCustomPhrase', {
                shortcut: formData.shortcut,
                phrase: formData.phrase,
                makePublic: formData.public === 'on' ? 'Y' : 'N',
            });
            const success = data.insertCustomPhraseResult;
 
            this.addPhraseForm.clear();
            this.close();            
            
            // update phrases list for inserting
            await this.PhrasesInstance.InsertPhrases.fetchData();
            this.PhrasesInstance.InsertPhrases.populate();
        });
        this.addPhraseForm.onChange(event => {
            const value = event.target.value;
            const name = event.target.name;
            const input = this.addPhraseForm.inputs[name];
        });
        this.addPhraseForm.onReset(event => {
            this.close();
        });
    };

    /**
     * Renders Case Notes Phrase makrup to the specified DOM node.
     *
     * @function
     * @param {Node} node - DOM node to render case notes phrases to
     * @returns {CaseNotesAddPhrases} - Returns the current instances for chaining
     */
    CaseNotesAddPhrases.prototype.renderTo = function (node) {
        if (node instanceof Node) {
            node.appendChild(this.dialog.dialog);
        }

        return this;
    };

    //=======================================
    // INSERTING PHRASES
    //---------------------------------------
    /**
     * Constructor function for creating the Case Notes Insert Phrases component.
     *
     * @constructor
     * @returns {CaseNotesInsertPhrases}
     */
    function CaseNotesInsertPhrases(phrasesInstance) {
        // Data Init
        this.phrasesData = [];
        this.showAllPhrases = null;

        // Instance Ref
        this.PhrasesInstance = phrasesInstance;

        // DOM Ref
        this.dialog = null;
        this.showAllPhrasesToggle = null;
        this.addPhraseButton = null;
        this.phraseWrap = null;
    }

    /**
     * @function
     * @returns {CaseNotesInsertPhrases} - Returns the current instances for chaining
     */
    CaseNotesInsertPhrases.prototype.build = function () {
        this.showAllPhrases = _UTIL.localStorageHandler.get('casenotes-showAllPhrases');
        this.showAllPhrases = this.showAllPhrases === 'Y' ? true : false;

        this.dialog = new Dialog({ className: 'insertPhrases' });

        this.showAllPhrasesToggle = new Checkbox({
            id: 'phraseView',
            label: 'Show All Phrases',
            toggle: true,
            checked: this.showAllPhrases,
        });
        this.showAllPhrasesToggle.renderTo(this.dialog.dialog);

        this.phraseWrap = _DOM.createElement('div', { class: 'phraseWrap' });
        this.dialog.dialog.appendChild(this.phraseWrap);

        this.addPhraseButton = new Button({ text: 'New Phrase', icon: 'add' }).renderTo(this.dialog.dialog);

        this.setupEvents();

        return this;
    };

    /**
     * @function
     */
    CaseNotesInsertPhrases.prototype.populate = function () {
        this.phraseWrap.innerHTML = '';

        const sortedKeys = Object.keys(this.phrasesData).sort((a, b) => {
            return this.phrasesData[a].shortcut.localeCompare(this.phrasesData[b].shortcut);
        });

        sortedKeys.forEach(id => {
            const phrase = this.phrasesData[id].phrase;
            const shortcut = this.phrasesData[id].shortcut;

            const phraseEle = _DOM.createElement('p', {
                id,
                html: `<span class="shortcut">${shortcut}</span><span class="phraseText">${phrase.slice(0, 35)}...</span>`,
                class: 'phrase',
                'data-target': 'phrase',
            });

            this.phraseWrap.appendChild(phraseEle);
        });
    };

    /**
     * @function
     */
    CaseNotesInsertPhrases.prototype.show = function () {
        this.dialog.show();
    };

    /**
     * @function
     */
    CaseNotesInsertPhrases.prototype.close = function () {
        this.dialog.close();
    };

    /**
     * @function
     */
    CaseNotesInsertPhrases.prototype.onPhraseSelect = function (cb) {
        const handleClick = e => {
            if (e.target.dataset.target === 'phrase') {
                cb(this.phrasesData[e.target.id].phrase);
                this.phraseWrap.removeEventListener('click', handleClick);
            }
        };

        this.phraseWrap.addEventListener('click', handleClick);
    };

    /**
     * @function
     */
    CaseNotesInsertPhrases.prototype.setupEvents = function () {
        // PHRASE LIST TOGGLE
        this.showAllPhrasesToggle.onChange(async e => {
            this.showAllPhrases = e.target.checked ? true : false;
            _UTIL.localStorageHandler.set('casenotes-showAllPhrases', this.showAllPhrases ? 'Y' : 'N');

            await this.fetchData();

            this.populate();
        });

        // ADD NEW PHRASE BUTTON CLICK
        this.addPhraseButton.onClick(async e => {
            this.PhrasesInstance.AddPhrases.show();
        });
    };

    /**
     * @function
     */
    CaseNotesInsertPhrases.prototype.fetchData = async function () {
        const data = await _UTIL.fetchData('getCustomPhrases', {
            showAll: this.showAllPhrases ? 'Y' : 'N',
        });

        this.phrasesData = data.getCustomPhrasesResult.reduce((obj, phrase) => {
            if (!obj[phrase.phrase_id]) {
                obj[phrase.phrase_id] = {
                    shortcut: phrase.phrase_shortcut,
                    phrase: phrase.phrase,
                };
            }

            return obj;
        }, {});
    };

    /**
     * Renders Case Notes Phrase makrup to the specified DOM node.
     *
     * @function
     * @param {Node} node DOM node to render case notes phrases to
     * @returns {CaseNotesInsertPhrases} Returns the current instances for chaining
     */
    CaseNotesInsertPhrases.prototype.renderTo = function (node) {
        if (node instanceof Node) {
            node.appendChild(this.dialog.dialog);
        }

        return this;
    };

    //=======================================
    // MAIN LIB
    //---------------------------------------
    /**
     * Constructor function for creating the Case Notes Phrases component.
     *
     * @constructor
     * @returns {CaseNotesPhrases}
     */
    function CaseNotesPhrases() {
        // Data Init
        this.AddPhrases = new CaseNotesAddPhrases(this);
        this.InsertPhrases = new CaseNotesInsertPhrases(this);

        this._build();
    }

    /**
     * @function
     *
     * @returns {CaseNotesPhrases} Returns the current instances for chaining
     */
    CaseNotesPhrases.prototype._build = function () {
        this.AddPhrases.build();
        this.InsertPhrases.build();
    };

    /**
     * Renders Case Notes Phrase Dialogs to the specified DOM node.
     *
     * @function
     * @param {Node} node DOM node to render case notes phrases to
     * @returns {CaseNotesPhrases} Returns the current instances for chaining
     */
    CaseNotesPhrases.prototype.renderTo = function (node) {
        this.AddPhrases.renderTo(node);
        this.InsertPhrases.renderTo(node);
    };

    return CaseNotesPhrases;
});
