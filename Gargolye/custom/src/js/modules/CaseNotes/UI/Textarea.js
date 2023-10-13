(function (global, factory) {
  global.Textarea = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    showcount: false,
    note: null,
    fullscreen: false,
  };

  /**
   * Merge default options with user options
   *
   * @function
   * @param {Object}  userOptions - User defined options object
   * @return {Object} - Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    userOptions.name = userOptions.id;
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  /**
   * @class Radio API
   * @param {Object} options
   */

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * required, disabled
   * events, change, keyup, focus in/out
   */
  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for textarea, use to link it with label. Also used for name attribute.
   * @param {String} options.label - Text for label
   * @param {Boolean} [options.required] - Whether textarea is required for submission
   * @param {String} [options.note] - Text for textarea note/message, displayed underneath textarea field
   * @param {Boolean} [options.showCount] - Whether to show char count or not
   * @param {String} [options.minlength] - min char count
   * @param {String} [options.maxlength] - max char count
   * @param {Boolean} [options.hidden] - Whether to show or hide the input
   * @returns {Textarea}
   */
  function Textarea(options) {
    this.options = _UTIL.FORM.separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
    this.input = null;
    this.fullScreenToggleBtn = null;
  }

  /**
   * Builds the Textarea element structure
   *
   * @function
   * @returns {Textarea} - Returns the current instances for chaining
   */
  Textarea.prototype.build = function () {
    this.inputWrap = _DOM.createElement('div', {
      class: this.options.hidden ? ['input', 'textarea', 'hidden'] : ['input', 'textarea'],
    });

    // INPUT & LABEL
    this.input = _DOM.createElement('textarea', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    // INPUT NOTE
    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputNote', text: this.options.note });
      this.inputWrap.appendChild(inputNote);
      this.inputWrap.classList.add('withNote');
    }

    // CHAR COUNTER
    if (this.options.showcount) {
      const countMarkup = this.options.attributes.maxlength
        ? { html: `${0}<span>/</span>${this.options.attributes.maxlength}` }
        : { text: '0' };
      const inputCount = _DOM.createElement('div', { class: 'charCount', ...countMarkup });
      this.inputWrap.appendChild(inputCount);
    }

    // FULLSCREEN MODE
    if (this.options.fullscreen) {
      //TODO: add fullscreen icon, setup its events
      this.fullScreenToggleBtn = _DOM.createElement('div', {
        class: 'fullscreenToggleBtn',
        'data-target': 'fullscreen',
        node: Icon.getIcon('openFullScreen'),
      });
      this.inputWrap.appendChild(this.fullScreenToggleBtn);
    }

    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(labelEle);

    return this;
  };

  /**
   * Sets value of textarea
   *
   * @function
   * @param {*} value
   */
  Textarea.prototype.setValue = function (value) {
    this.input.value = value;
  };

  /**
   * Clears textarea value, sets it to ''
   *
   * @function
   */
  Textarea.prototype.clear = function () {
    this.input.value = '';
  };

  /**
   * Toggles textarea required state, if true input is required
   *
   * @function
   * @param {Boolean} isRequired
   */
  Textarea.prototype.toggleRequired = function (isRequired) {
    this.input.required = isRequired;
  };

  /**
   * Toggles inputs disabled state, if true input is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  Textarea.prototype.toggleDisabled = function (isDisbled) {
    this.input.disabled = isDisbled;
  };

  /**
   * Handles textarea change event
   *
   * @function
   */
  Textarea.prototype.onChange = function (cbFunc) {
    this.input.addEventListener('change', e => {
      cbFunc(e);
    });
  };

  /**
   * Handles textarea keyup event
   *
   * @function
   */
  Textarea.prototype.onKeyup = function (cbFunc) {
    this.input.addEventListener('keyup', e => {
      cbFunc(e);
    });
  };

  /**
   *
   *
   * @function
   */
  Textarea.prototype.toggleFullscreenMode = function () {};

  /**
   * Renders the built Textarea element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the textarea to
   * @returns {Textarea} - Returns the current instances for chaining
   */
  Textarea.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Textarea;
});
