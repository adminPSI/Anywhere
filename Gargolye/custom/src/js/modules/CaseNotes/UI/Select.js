(function (global, factory) {
  global.Select = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {
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
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.label - Text for label input
   * @param {Boolean} [options.required] - Whether input is required for submission
   * @param {String} [options.note] - Text for input note/message, displayed underneath input field
   */
  function Select(options) {
    this.options = _UTIL.FORM.separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
    this.select = null;
  }

  /**
   * Builds the Select element structure
   *
   * @function
   * @returns {Select} - Returns the current instances for chaining
   */
  Select.prototype.build = function () {
    this.inputWrap = _DOM.createElement('div', {
      class: ['input', 'select'],
    });

    this.select = _DOM.createElement('select', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputNote', text: this.options.note });
      this.inputWrap.appendChild(inputNote);
      this.inputWrap.classList.add('withNote');
    }

    this.inputWrap.appendChild(this.select);
    this.inputWrap.appendChild(labelEle);
    return this;
  };

  /**
   * Populates the select with <options>
   *
   * @function
   */
  Select.prototype.populate = function (data) {
    data.forEach(d => {
      const optionEle = _DOM.createElement('option', { value: d.value, text: d.text });
      this.select.appendChild(optionEle);
    });
  };

  /**
   * Sets value of select
   *
   * @function
   * @param {*} value
   */
  Select.prototype.setValue = function (value) {
    this.select.value = value;
  };

  /**
   * Clears select value, sets it to ''
   *
   * @function
   */
  Select.prototype.clear = function () {
    this.select.value = '';
  };

  /**
   * Handles select change event
   *
   * @function
   */
  Select.prototype.onChange = function (cbFunc) {
    this.select.addEventListener('change', e => {
      cbFunc(e);
    });
  };

  /**
   * Renders the built Select element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the select to
   * @returns {Select} - Returns the current instances for chaining
   */
  Select.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Select;
});
