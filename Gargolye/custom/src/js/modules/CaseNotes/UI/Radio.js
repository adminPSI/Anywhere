'use-strict';

(function (global, factory) {
  global = global || self;
  global.RADIO = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {};

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @class RADIO
   * @param {Object} options
   * @param {String} [options.groupLabel]   Radio group label text
   * @param {Array}  [options.radios]       Radio inputs
   */
  function RADIO(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.inputs = {};
  }

  RADIO.prototype.build = function () {
    this.inputGroup = _DOM.createElement('div', { class: 'inputGroup' });

    const groupLabel = _DOM.createElement('div', {
      class: 'inputGroup__label',
      text: this.options.groupLabel,
    });

    this.inputGroup.appendChild(groupLabel);

    this.options.radios.forEach(radio => {
      const newInput = new INPUT({ ...radio }).build();
      const input = newInput.inputWrap;
      this.inputGroup.appendChild(input);

      this.inputs[radio.id] = input;
    });

    return this;
  };

  RADIO.prototype.render = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputGroup);
    }

    document.body.appendChild(this.inputGroup);

    return this;
  };

  return RADIO;
});

const newInput2 = new RADIO({
  groupLabel: 'Radio inputs',
  radios: [
    { id: 'r1', label: 'No', type: 'radio', name: 'radioSet' },
    { id: 'r2', label: 'Yes', type: 'radio', name: 'radioSet' },
  ],
});
