(function (global, factory) {
  global.Radio = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS_2 = {};

  /**
   * @constructor
   */
  function RadioGroup(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS_2, options);

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
  };

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {};

  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for inputs
   * @param {String} options.groupLabel - Text for label input
   * @param {Array}  options.fields - Radio inputs
   * @param {String} fields.id
   * @param {String} fields.type
   * @param {String} fields.label Text for label input
   */
  function Radio(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    this.inputs = {};

    // DOM Ref
    this.rootElement = null;

    this._build();
  }

  /**
   * Builds the Radio element structure
   *
   * @function
   */
  Radio.prototype._build = function () {
    const radioGroup = new RadioGroup({
      groupLabel: this.options.groupLabel,
    });

    this.rootElement = radioGroup.rootElement;

    this.options.fields.forEach(field => {
      const fieldOptions = _DOM.separateHTMLAttribrutes(field);
      const newInput = new Input({ ...fieldOptions });
      this.rootElement.appendChild(newInput.rootElement);
    });
  };

  /**
   * Handles radio change event
   *
   * @function
   */
  Radio.prototype.onChange = function () {};

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

  return Radio;
});
