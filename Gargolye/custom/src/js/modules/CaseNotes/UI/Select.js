(function (global, factory) {
  global.Select = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {
    data: [],
    hidden: false,
    note: null,
    required: false,
    includeBlankOption: false,
  };

  /**
   * Constructor function for creating a Select component.
   *
   * @constructor
   * @param {Object} options
   * @param {String} options.id Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.label Text for label select
   * @param {Boolean} [options.required] Whether select is required for submission
   * @param {String} [options.note] Text for select note/message, displayed underneath select field
   * @param {Boolean} [options.hidden] Whether to show or hide the select
   * @param {Boolean} [options.includeBlankOption]
   * @returns {Select}
   *
   * @example
   * const dropdown = new Select({
   *   label: 'Locations',
   *   id: 'locations'
   * });
   */
  function Select(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));
    this.options.attributes.name = this.options.attributes.id;

    // DOM Ref
    this.rootElement = null;
    this.inputWrap = null;
    this.select = null;
    this.inputNote = null;

    this._build();
  }

  /**
   * Builds the Select component HTML
   *
   * @function
   */
  Select.prototype._build = function () {
    const classArray = ['inputGroup', 'select', `${this.options.attributes.id}`];
    this.rootElement = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'inputGroup--hidden'] : classArray,
    });

    this.inputWrap = _DOM.createElement('div', { class: 'inputGroup__inputWrap' });
    this.select = _DOM.createElement('select', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    this.inputWrap.appendChild(this.select);
    this.inputWrap.appendChild(Icon.getIcon('chevron'));

    this.rootElement.appendChild(labelEle);
    this.rootElement.appendChild(this.inputWrap);

    this.inputNote = _DOM.createElement('div', { class: 'inputGroup__note', text: this.options.note ?? '' });
    this.rootElement.appendChild(this.inputNote);

    this.populate();
  };

  /**
   * Populates the select with <options>
   *
   * @function
   * @param {Array} [data] Data to populate select with
   */
  Select.prototype.populate = function (data, defaultValue) {
    if (data && Array.isArray(data)) this.options.data = [...data];

    this.select.innerHTML = '';

    if (this.options.data.length > 0) {
      if (this.options.includeBlankOption) {
        this.options.data.unshift({ value: '', text: '' });
      }

      this.options.data.sort(_UTIL.sortByProperty('text')).forEach(d => {
        const optionEle = _DOM.createElement('option', { value: d.value, text: d.text });
        this.select.appendChild(optionEle);
      });
    }

    //! If data is emtpy we set dropdown to disabled
    if (!this.options.data || this.options.data.length === 0) {
      this.toggleDisabled(true);
    } else {
      this.toggleDisabled(false);
    }

    const dv = defaultValue ? defaultValue : this.options.defaultValue;
    this.select.value = dv;
  };

  /**
   * Sets value of select
   *
   * @function
   * @param {String} Value
   */
  Select.prototype.setValue = function (value) {
    this.select.value = value;
  };

  /**
   * Gets value of select
   *
   * @function
   * @returns {*} Value of select
   */
  Select.prototype.getValue = function () {
    return this.select.value;
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
   * Sets Custom Validity on select
   *
   * @function
   * @param {String} message Empty string will unset invalid status
   */
  Select.prototype.setValidtyError = function (message) {
    this.select.setCustomValidity(message);
  };

  /**
   * Adds error icon to end of select and updates note text with given error message
   *
   * @function
   * @param {String} message
   */
  Input.prototype.showError = function (message) {
    this.inputNote.innerHTML = message;
    //this.inputNote.append(Icon.getIcon('error'), message);
  };

  /**
   * Adds warning icon to end of select and updates note text with given warning message
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
    this.inputNote.innerText = this.options.note ?? '';
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
    this.select.readOnly = isDisbled;
  };

  /**
   * Handles select change event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
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
   * @param {Node} node DOM node to render the select to
   * @returns {Select} Returns the current instances for chaining
   */
  Select.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return Select;
});
