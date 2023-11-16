(function (global, factory) {
  global.Checkbox = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    note: null,
  };

  /**
   * Constructor function for creating a Checkbox component.
   *
   * @constructor
   * @param {Object} options
   * @param {String} options.id Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.label Text for label input
   * @param {Boolean} [options.required] Whether input is required for submission
   * @param {String} [options.note] Text for input note/message, displayed underneath input field
   * @param {Boolean} [options.hidden] Whether to show or hide the input
   * @param {Boolean} [options.toggle] *Checkbox only (instead of checkbox you will get a toggle button)
   * @returns {Input}
   *
   * @example
   * const fnInput = new Checkbox({
   *   label: 'First Name',
   *   id: 'firstName'
   * });
   */
  function Checkbox(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));
    this.options.attributes.name = this.options.attributes.id;
    this.options.attributes.type = 'checkbox';

    // DOM Ref
    this.rootElement = null;
    this.inputWrap = null;
    this.input = null;
  }

  /**
   * Builds the checkbox component HTML
   *
   * @function
   * @returns {Checkbox} Current instances for chaining
   */
  Checkbox.prototype.build = function () {
    // CHECKBOX WRAP
    const classArray = ['inputGroup', `${this.options.attributes.id}`];
    this.options.toggle ? classArray.push('checkbox_toggle') : classArray.push('checkbox');
    this.rootElement = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'inputGroup--hidden'] : classArray,
    });

    // CHECKBOX & LABEL
    this.input = _DOM.createElement('input', { ...this.options.attributes, type: 'checkbox' });
    this.labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });
    this.rootElement.appendChild(this.input);
    this.rootElement.appendChild(this.labelEle);

    // CHECKBOX NOTE
    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputGroup__note', text: this.options.note });
      this.rootElement.appendChild(inputNote);
    }

    return this;
  };

  /**
   * Sets value of checkbox
   *
   * @function
   * @param {String | Number} value
   */
  Checkbox.prototype.setValue = function (value) {
    this.input.checked = value;
  };

  /**
   * Returns value of checkbox
   *
   * @function
   * @returns {String} Value of checkbox
   */
  Checkbox.prototype.getValue = function () {
    return this.input.checked;
  };

  /**
   * Clears checkbox value, sets it to ''
   *
   * @function
   */
  Checkbox.prototype.clear = function () {
    this.input.checked = false;
  };

  /**
   * Toggles inputs required state, if true input is required
   *
   * @function
   * @param {Boolean} isRequired
   */
  Checkbox.prototype.toggleRequired = function (isRequired) {
    this.input.required = isRequired;
  };

  /**
   * Toggles checkbox disabled state, if true checkbox is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  Checkbox.prototype.toggleDisabled = function (isDisbled) {
    this.input.disabled = isDisbled;
  };

  /**
   * Sets Custom Validity on checkbox
   *
   * @function
   * @param {String} message Empty string will unset invalid status
   */
  Checkbox.prototype.setValidtyError = function (message) {
    this.input.setCustomValidity(message);
  };

  /**
   * Handles checkbox change event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Checkbox.prototype.onChange = function (cbFunc) {
    this.input.addEventListener('input', e => {
      if (this.options.toggle) e.preventDefault();
      if (cbFunc) cbFunc(e);
    });
  };

  /**
   * Updates the text inside label element
   *
   * @param {String} newValue
   */
  Checkbox.prototype.updateLableValue = function (newValue) {
    if (_DOM.stringContainsHTML(newValue)) {
      this.labelEle.innerHTML = newValue;

      return;
    }

    this.labelEle.innerText = newValue;
  };

  /**
   * Renders the built checkbox element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the input to
   * @returns {Checkbox} Returns the current instances for chaining
   */
  Checkbox.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return Checkbox;
});
