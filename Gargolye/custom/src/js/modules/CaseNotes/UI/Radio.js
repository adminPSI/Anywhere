(function (global, factory) {
  global.Radio = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {};

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
   * @param {Array}  options.radios - Radio inputs
   * @param {String} options.id - Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.label - Text for label input
   * @param {String} options.groupLabel - Radio group label text
   * @param {String} [options.note] - Text for input note/message, displayed underneath input field
   */
  function Radio(options) {
    this.options = mergOptionsWithDefaults(options);
    this.inputs = {};
  }

  /**
   * Builds the Radio element structure
   *
   * @function
   * @returns {Radio} - Returns the current instances for chaining
   */
  Radio.prototype.build = function () {
    this.inputGroup = _DOM.createElement('div', { class: 'inputGroup' });

    const groupLabel = _DOM.createElement('div', {
      class: 'inputGroup__label',
      text: this.options.groupLabel,
    });

    this.inputGroup.appendChild(groupLabel);

    this.options.radios.forEach(radio => {
      const newInput = new Input({ ...radio }).build();
      const input = newInput.inputWrap;
      this.inputGroup.appendChild(input);

      this.inputs[radio.id] = input;
    });

    return this;
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
      node.appendChild(this.inputGroup);
    }

    return this;
  };

  return Radio;
});
