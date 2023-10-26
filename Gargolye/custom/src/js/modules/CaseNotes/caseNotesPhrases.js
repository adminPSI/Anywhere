(function (global, factory) {
  global.CaseNotesInsertPhrases = factory();
})(this, function () {
  /**
   * @constructor
   */
  function CaseNotesInsertPhrases(options) {
    // Data Init
    this.phrasesData = [];
    this.showAllPhrases = options.showAllPhrases;

    // DOM Ref
    this.dialog = null;
    this.showAllPhrasesToggle = null;
    this.phraseWrap = null;
  }

  /**
   * @function
   * @returns {CaseNotesInsertPhrases} - Returns the current instances for chaining
   */
  CaseNotesInsertPhrases.prototype.build = function () {
    this.dialog = new Dialog({ isModal: false });

    this.showAllPhrasesToggle = new Input({
      type: 'checkbox',
      id: 'phraseView',
      label: 'Show All Phrases',
      toggle: true,
      checked: this.showAllPhrases,
    });
    this.showAllPhrasesToggle.build().renderTo(this.dialog.dialog);

    this.phraseWrap = _DOM.createElement('div');
    this.dialog.dialog.appendChild(this.phraseWrap);

    return this;
  };

  /**
   * @function
   */
  CaseNotesInsertPhrases.prototype.populate = function () {
    this.phraseWrap.innerHTML = '';

    for (id in this.phrasesData) {
      const phrase = this.phrasesData[id].phrase;
      const shortcut = this.phrasesData[id].shortcut;

      const phraseEle = _DOM.createElement('p', {
        id,
        text: `${shortcut} - ${phrase.slice(0, 35)}...`,
        'data-target': 'phrase',
      });

      this.phraseWrap.appendChild(phraseEle);
    }
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
   * @param {Node} node - DOM node to render case notes phrases to
   * @returns {CaseNotesInsertPhrases} - Returns the current instances for chaining
   */
  CaseNotesInsertPhrases.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  return CaseNotesInsertPhrases;
});
