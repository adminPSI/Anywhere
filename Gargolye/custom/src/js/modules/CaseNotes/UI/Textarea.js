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

  //=======================================
  // FULLSCREEN MODE
  //---------------------------------------
  /**
   * Gives textarea fullscreen mode funtionality
   *
   * @constructor
   * @param {Textarea} textareaInstance
   * @returns {FullscreenTextarea}
   */
  function FullscreenTextarea(textareaInstance) {
    this.textareaInstance = textareaInstance;

    this.fullScreenDialog = null;
    this.textareaClone = null;

    this.build();
  }

  FullscreenTextarea.prototype.build = function () {
    // get new Dialog
    this.fullScreenDialog = new Dialog();

    // build and append dialog
    this.fullScreenDialog.renderTo(_DOM.ACTIONCENTER);
    this.fullScreenDialog.dialog.classList.add('withFullscreenTextarea');

    // clone textarea for dialog
    this.textareaClone = this.textareaInstance.inputWrap.cloneNode(true);

    // build and append dialog close button to textareaClone
    this.fullScreenCloseBtn = _DOM.createElement('div', {
      class: ['fullscreenToggleBtn', 'close'],
      node: Icon.getIcon('exitFullScreen'),
    });
    this.textareaClone.appendChild(this.fullScreenCloseBtn);

    // remove showBtn from textareaClone
    const dupShowModalBtn = this.textareaClone.querySelector('.fullscreenToggleBtn.show');
    this.textareaClone.removeChild(dupShowModalBtn);

    // append textareaClone to dialog
    this.fullScreenDialog.dialog.appendChild(this.textareaClone);

    this.setupEvents();
  };

  FullscreenTextarea.prototype.updateCloneValue = function (value) {
    const inputClone = this.textareaClone.querySelector('textarea');
    inputClone.value = value;
  };

  FullscreenTextarea.prototype.setupEvents = function () {
    this.textareaInstance.fullScreenShowBtn.addEventListener('click', e => {
      this.fullScreenDialog.show();
    });
    this.fullScreenCloseBtn.addEventListener('click', e => {
      this.fullScreenDialog.close();
    });
    this.textareaClone.addEventListener('change', e => {
      this.textareaInstance.setValue(e.target.value);
    });
  };

  //=======================================
  // MAIN LIB
  //---------------------------------------
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
   * @param {Boolean} [options.fullscreen] - Whether to show or hide the input
   * @returns {Textarea}
   */
  function Textarea(options) {
    this.options = _DOM.separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
    this.input = null;
    this.fullscreen = null;
    this.fullScreenShowBtn = null;
  }

  /**
   * Builds the Textarea element structure
   *
   * @function
   * @returns {Textarea} - Returns the current instances for chaining
   */
  Textarea.prototype.build = function () {
    const classArray = ['input', 'textarea', `${this.options.attributes.id}`];
    this.inputWrap = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'hidden'] : classArray,
    });

    // INPUT & LABEL
    this.input = _DOM.createElement('textarea', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });
    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(labelEle);

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
      this.input.classList.add('fullscreen');
      // add open fullscreen to orign textarea
      this.fullScreenShowBtn = _DOM.createElement('div', {
        class: ['fullscreenToggleBtn', 'show'],
        node: Icon.getIcon('openFullScreen'),
      });
      this.inputWrap.appendChild(this.fullScreenShowBtn);

      // build fullscreenmode
      this.fullscreen = new FullscreenTextarea(this);
    }

    this.setupEvents();

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
   * Sets Custom Validity on textarea
   *
   * @function
   * @param {String} message - empty string will unset invalid status
   */
  Textarea.prototype.setValidtyError = function (message) {
    this.input.setCustomValidity(message);
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
   * Sets up events for textarea
   *
   * @function
   */
  Textarea.prototype.setupEvents = function () {
    if (this.options.fullscreen) {
      this.input.addEventListener('change', e => {
        this.fullscreen.updateCloneValue(e.target.value);
      });
    }
  };

  /**
   * Handles textarea change event
   *
   * @function
   */
  Textarea.prototype.onChange = function (cbFunc) {
    this.input.addEventListener('change', e => {
      cbFunc(e);

      if (this.options.fullscreen) {
        this.fullscreen.updateCloneValue(e.target.value);
      }
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
