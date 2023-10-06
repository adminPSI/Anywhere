(function (global, factory) {
  global = global || self;
  global.Radio = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {};

  /**
   * Merge default options with user options
   * @param {Object}  userOptions  User defined options object
   * @return {Object}              Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @class Radio
   * @param {Object} options
   * @param {String} [options.groupLabel]   Radio group label text
   * @param {Array}  [options.radios]       Radio inputs
   */
  function Radio(options) {
    this.options = mergOptionsWithDefaults(options);
    this.inputs = {};
  }

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

  Radio.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputGroup);
    }

    return this;
  };

  return Radio;
});
