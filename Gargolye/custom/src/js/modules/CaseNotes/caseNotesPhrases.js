/**
 * @constructor
 */
function CaseNotesPhrases(options) {
  // Data Init
  this.showAllPhrases = options.showAllPhrases ? true : false;
  this.phrasesData = [];
  this.selectedPhrase = null;
  // DOM Ref
  this.phraseWrap = null;
  this.showAllPhrasesToggle = null;
  this.phraseDropdown = null;
  this.phraseInsertBtn = null;
}

/**
 * @function
 * @returns {CaseNotesPhrases} - Returns the current instances for chaining
 */
CaseNotesPhrases.prototype.build = function () {
  this.phraseWrap = _DOM.createElement('div', { class: 'caseNotesPhrases' });

  this.phraseDropdown = new Select({
    id: 'phrases',
    label: 'Phrases',
    data: this.phrasesData,
    includeBlankOption: true,
  });

  this.phraseInsertBtn = new Button({ type: 'button', text: 'Add' });

  this.showAllPhrasesToggle = new Input({
    type: 'checkbox',
    id: 'phraseView',
    label: 'Show All Phrases',
    toggle: true,
    checked: this.showAllPhrases,
  });

  this.phraseDropdown.build().renderTo(this.phraseWrap);
  this.phraseInsertBtn.build().renderTo(this.phraseWrap);
  this.showAllPhrasesToggle.build().renderTo(this.phraseWrap);

  this.setupEvents();

  return this;
};

/**
 * @function
 */
CaseNotesPhrases.prototype.setupEvents = function () {
  this.showAllPhrasesToggle.onChange(async e => {
    this.showAllPhrases = e.target.checked ? true : false;

    await this.fetchData();

    this.phraseDropdown.populate(this.phrasesData);

    _UTIL.localStorageHandler.set('casenotes-showAllPhrases', this.showAllPhrases ? 'Y' : 'N');
  });
  this.phraseDropdown.onChange(e => {});
  this.phraseInsertBtn.onClick(e => {});
};

/**
 * @function
 */
CaseNotesPhrases.prototype.fetchData = async function () {
  const data = await _UTIL.fetchData('getCustomPhrases', {
    showAll: this.showAllPhrases ? 'Y' : 'N',
  });
  this.phrasesData = data.getCustomPhrasesResult.map(phrase => {
    return {
      text: `${phrase.phrase_shortcut} - ${phrase.phrase.slice(0, 35)}...`,
      value: phrase.phrase_id,
    };
  });

  console.log(this.phrasesData);
};

/**
 * Renders Case Notes Phrase makrup to the specified DOM node.
 *
 * @function
 * @param {Node} node - DOM node to render case notes phrases to
 * @returns {CaseNotesPhrases} - Returns the current instances for chaining
 */
CaseNotesPhrases.prototype.renderTo = function (node) {
  if (node instanceof Node) {
    node.appendChild(this.phraseWrap);
  }

  return this;
};
