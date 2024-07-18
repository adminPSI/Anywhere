(function (global, factory) {
  global.Input = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    showcount: false,
    note: null,
    value: null,
  };

  /**
   * Constructor function for creating an Input component.
   *
   * Use for text, number, date, time
   *
   * @constructor
   * @param {Object} options
   * @param {String} options.id Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.type HTML Input type
   * @param {String} options.label Text for label input
   * @param {Boolean} [options.required] Whether input is required for submission
   * @param {String} [options.note] Text for input note/message, displayed underneath input field
   * @param {Boolean} [options.showCount] Whether to show char count or not
   * @param {String} [options.minlength] Min char count
   * @param {String} [options.maxlength] Max char count
   * @param {Boolean} [options.hidden] Whether to show or hide the input
   * @returns {Input}
   *
   * @example
   * const fnInput = new Input({
   *   type: 'text',
   *   label: 'First Name',
   *   id: 'firstName'
   * });
   */
  function Input(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));
    this.options.attributes.name = this.options.attributes.id;

    // DOM Ref
    this.rootElement = null;
    this.input = null;
    this.labelEle = null;
    this.inputNote = null;

    this._build();

    if (this.options.value) {
      this.setValue(this.options.value);
    }
  }

  /**
   * Builds the Input component HTML
   *
   * @function
   * @returns {Input} Current instances for chaining
   */
  Input.prototype._build = function () {
    // INPUT WRAP
    const classArray = ['inputGroup', `${this.options.attributes.type}`, `${this.options.attributes.id}`];
    const inputGroup = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'inputGroup--hidden'] : classArray,
    });

    // INPUT & LABEL
    const inputWrap = _DOM.createElement('div', { class: 'inputGroup__inputWrap' });
    this.input = _DOM.createElement('input', { ...this.options.attributes });
    this.labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });
    inputWrap.append(this.input);

    inputGroup.append(this.labelEle, inputWrap);

    // INPUT NOTE
    this.inputNote = _DOM.createElement('div', { class: 'inputGroup__note', text: this.options.note ?? '' });
    inputGroup.append(this.inputNote);

    // CHAR COUNTER
    if (this.options.showcount) {
      const countMarkup = this.options.attributes.maxlength
        ? { html: `${0}<span>/</span>${this.options.attributes.maxlength}` }
        : { text: '0' };
      const inputCount = _DOM.createElement('div', { class: 'inputGroup__charCount', ...countMarkup });
      inputGroup.append(inputCount);
    }

    this.rootElement = inputGroup;

    return this;
  };

  /**
   * Sets value of input
   *
   * @function
   * @param {String | Number} value
   */
  Input.prototype.setValue = function (value) {
    if (this.options.attributes.type === 'date') {
      if (!value) {
        this.input.value = '';
        return;
      }

      value = value.split(' ')[0];

      const dateformat = dates.checkFormat(value);
      if (dateformat === 'standard') {
        value = dates.formateToISO(value);
      }
    }

    this.input.value = value;
  };

  /**
   * Returns value of input
   *
   * @function
   * @returns {*} Value of input
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
    this.input.readOnly = isDisbled;
  };

  /**
   * Sets Custom Validity on input
   *
   * @function
   * @param {String} message Empty string will unset invalid status
   */
  Input.prototype.setValidtyError = function (message) {
    this.input.setCustomValidity(message);
  };

  /**
   * Adds error icon to end of input and updates note text with given error message
   *
   * @function
   * @param {String} message
   */
  Input.prototype.showError = function (message) {
    this.inputNote.innerHTML = message;
    //this.inputNote.append(Icon.getIcon('error'), message);
  };

  /**
   * Adds warning icon to end of input and updates note text with given warning message
   *
   * @function
   * @param {String} message
   */
  Input.prototype.showWarning = function (message) {
    this.inputNote.innerHTML = message;
    //this.inputNote.append(Icon.getIcon('warning'), message);
  };

  /**
   * @function
   */
  Input.prototype.clearErrorOrWarning = function () {
    this.inputNote.innerText = this.options.note;
  };

  /**
   * Handles input change event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Input.prototype.onChange = function (cbFunc) {
    this.input.addEventListener('onchange', e => {
      if (cbFunc) cbFunc(e);
    });
  };

  /**
   * Handles input keyup event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Input.prototype.onKeyup = function (cbFunc) {
    this.input.addEventListener('keyup', e => {
      if (cbFunc) cbFunc(e);
    });
  };

  /**
   * Handles input click event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Input.prototype.onClick = function (cbFunc) {
    this.input.addEventListener('click', e => {
      if (cbFunc) cbFunc(e);
    });
  };

  /**
   * Updates the text inside label element
   *
   * @param {String} newValue
   */
  Input.prototype.updateLableValue = function (newValue) {
    if (_DOM.stringContainsHTML(newValue)) {
      this.labelEle.innerHTML = newValue;

      return;
    }

    this.labelEle.innerText = newValue;
  };

  /**
   * Renders the built Input element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the input to
   * @returns {Input} Returns the current instances for chaining
   */
  Input.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return Input;
});
