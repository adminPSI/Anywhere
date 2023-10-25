(function (global, factory) {
  global.Input = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    showcount: false,
    note: null,
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
  // MAIN LIB
  //---------------------------------------
  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.type - HTML Input type
   * @param {String} options.label - Text for label input
   * @param {Boolean} [options.required] - Whether input is required for submission
   * @param {String} [options.note] - Text for input note/message, displayed underneath input field
   * @param {Boolean} [options.showCount] - Whether to show char count or not
   * @param {String} [options.minlength] - min char count
   * @param {String} [options.maxlength] - max char count
   * @param {Boolean} [options.hidden] - Whether to show or hide the input
   * @param {Boolean} [options.toggle] - *Checkbox only (instead of checkbox you will get a toggle button)
   * @returns {Input}
   */
  function Input(options) {
    this.options = _DOM.separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
    this.input = null;
  }

  /**
   * Builds the Input element structure
   *
   * @function
   * @returns {Input} - Returns the current instances for chaining
   */
  Input.prototype.build = function () {
    // INPUT WRAP
    const classArray = ['input', `${this.options.attributes.type}`, `${this.options.attributes.id}`];
    this.inputWrap = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'hidden'] : classArray,
    });

    // INPUT & LABEL
    this.input = _DOM.createElement('input', { ...this.options.attributes });
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

    // CHECKBOX TOGGLE
    if (this.options.toggle) {
      this.inputWrap.classList.add('toggle');
    } else {
      this.inputWrap.classList.add('notoggle');
    }

    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(labelEle);

    return this;
  };

  /**
   * Sets value of input
   *
   * @function
   * @param {*} value
   */
  Input.prototype.setValue = function (value) {
    this.input.value = value;
  };

  /**
   * Returns value of input
   *
   * @function
   * @returns {*} - value of input
   */
  Input.prototype.getValue = function () {
    return this.input.value;
  };

  /**
   * Clears input value, sets it to ''
   *
   * @function
   */
  Input.prototype.clear = function () {
    this.input.value = '';
  };

  /**
   * Sets Custom Validity on input
   *
   * @function
   * @param {String} message - empty string will unset invalid status
   */
  Input.prototype.setValidtyError = function (message) {
    this.input.setCustomValidity(message);
  };

  /**
   * Toggles inputs required state, if true input is required
   *
   * @function
   * @param {Boolean} isRequired
   */
  Input.prototype.toggleRequired = function (isRequired) {
    this.input.required = isRequired;
  };

  /**
   * Toggles inputs disabled state, if true input is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  Input.prototype.toggleDisabled = function (isDisbled) {
    this.input.disabled = isDisbled;
  };

  /**
   * Handles input change event
   *
   * @function
   * @param {Function} cbFunc - Callback function to call
   */
  Input.prototype.onChange = function (cbFunc) {
    this.input.addEventListener('change', e => {
      cbFunc(e);
    });
  };

  /**
   * Handles input keyup event
   *
   * @function
   */
  Input.prototype.onKeyup = function (cbFunc) {
    this.input.addEventListener('keyup', e => {
      cbFunc(e);
    });
  };

  /**
   * Renders the built Input element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the input to
   * @returns {Input} - Returns the current instances for chaining
   */
  Input.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Input;
});
