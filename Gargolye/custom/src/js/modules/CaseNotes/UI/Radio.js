(function (global, factory) {
  global.RadioGroup = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {
    disabled: false,
    required: false,
  };

  /**
   * @constructor
   * @param {String} id
   * @param {String} type
   * @param {String} label
   * @param {Boolean} [options.disabled]
   * @param {Boolean} [options.required]
   */
  function Radio(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));
    this.options.attributes.type = 'radio';

    // DOM Ref
    this.rootElement = null;
    this.input = null;
    this.labelEle = null;

    this._build();
  }

  /**
   * Builds the Radio element structure
   *
   * @function
   */
  Radio.prototype._build = function () {
    // RADIO WRAP
    const classArray = ['inputGroup', 'radio', `${this.options.attributes.id}`];
    this.rootElement = _DOM.createElement('div', {
      class: classArray,
    });

    // RADIO & LABEL
    this.input = _DOM.createElement('input', { ...this.options.attributes });
    this.labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });
    this.rootElement.appendChild(this.input);
    this.rootElement.appendChild(this.labelEle);
  };

  /**
   * Sets value of radio
   *
   * @function
   * @param {String | Number} value
   */
  Radio.prototype.setValue = function (value) {
    this.input.checked = value;
  };

  /**
   * Returns value of radio
   *
   * @function
   * @returns {*} Value of radio
   */
  Radio.prototype.getValue = function () {
    return this.input.checked;
  };

  /**
   * Renders the built Radio element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the radio to
   * @returns {Radio} - Returns the current instances for chaining
   */
  Radio.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS_2 = {
    disabled: false,
    required: false,
  };

  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for inputs
   * @param {String} options.groupLabel - Text for label input
   * @param {Array}  options.fields - Radio inputs
   * @param {Boolean} [options.disabled]
   * @param {Boolean} [options.required]
   */
  function RadioGroup(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS_2, options);
    this.inputs = {};

    // DOM Ref
    this.rootElement = null;
    this.groupLabelEle = null;

    this._build();
  }

  /**
   * Builds the Radio element structure
   *
   * @function
   */
  RadioGroup.prototype._build = function () {
    this.rootElement = _DOM.createElement('fieldset');
    this.groupLabelEle = _DOM.createElement('legend', { text: this.options.groupLabel });
    this.rootElement.appendChild(this.groupLabelEle);

    this.options.fields.forEach(field => {
      const inputInstance = new Radio({
        ...field,
        name: this.options.id,
        disabled: this.options.disabled,
        required: this.options.required,
      });
      this.rootElement.appendChild(inputInstance.rootElement);
      this.inputs[field.id] = inputInstance;
    });

    this.inputNote = _DOM.createElement('div', { class: 'inputGroup__note', text: this.options.note ?? '' });
    this.rootElement.append(this.inputNote);
  };

  /**
   * Set radio input checked status by id
   *
   * @function
   * @param {String | Number} value
   */
  RadioGroup.prototype.setValue = function (inputId) {
    this.inputs[inputId].setValue(true);
  };

  /**
   * Get radio input checked status by id
   *
   * @function
   * @param {String | Number} value
   */
  RadioGroup.prototype.getValue = function (inputId) {
    if (!inputId) {
      let checkedInputId;

      for (inputId in this.inputs) {
        if (this.inputs[inputId].getValue()) {
          checkedInputId = this.inputs[inputId].input.id;
        }
      }

      return checkedInputId ? checkedInputId : '';
    }

    return this.inputs[inputId].getValue();
  };

  /**
   * Toggles inputs disabled state, if true input is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  RadioGroup.prototype.toggleDisabled = function (isDisbled) {
    for (inputId in this.inputs) {
      this.inputs[inputId].input.disabled = isDisbled;
    }
  };

  return RadioGroup;
});
