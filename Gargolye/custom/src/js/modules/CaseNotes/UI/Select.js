(function (global, factory) {
  global.Select = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {
    data: [],
    hidden: false,
    note: null,
    requried: false,
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

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.label - Text for label select
   * @param {Boolean} [options.required] - Whether select is required for submission
   * @param {String} [options.note] - Text for select note/message, displayed underneath select field
   * @param {Boolean} [options.hidden] - Whether to show or hide the select
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
      class: this.options.hidden ? ['input', 'select', 'hidden'] : ['input', 'select'],
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

    this.populate();

    return this;
  };

  /**
   * Populates the select with <options>
   *
   * @function
   * @param {Array} [data] data to populate select with
   */
  Select.prototype.populate = function (data) {
    if (data && Array.isArray(data)) this.options.data = data;

    this.select.innerHTML = '';

    if (this.options.data.length > 0) {
      this.options.data.unshift({ value: '', text: '' });
      this.options.data.sort(_UTIL.sortByProperty('text')).forEach(d => {
        const optionEle = _DOM.createElement('option', { value: d.value, text: d.text });
        this.select.appendChild(optionEle);
      });
    }
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
   * Toggles select required state, if true input is required
   *
   * @function
   * @param {Boolean} onOff
   */
  Select.prototype.toggleRequired = function (onOff) {
    this.select.required = onOff;
  };

  /**
   * Toggles select disabled state, if true input is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  Select.prototype.toggleDisabled = function (isDisbled) {
    this.select.disabled = isDisbled;
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
