//TODO: 1. logic for updating char count value

(function (global, factory) {
  global = global || self;
  global.Input = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    showcount: false,
  };

  /**
   * Merge default options with user options
   * @param {Object}  userOptions  User defined options object
   * @return {Object}              Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  /**
   * Separate HTML attributes from options obj
   * @param {Object}  options  Options object
   * @return {Object}          Separated options object
   */
  const separateHTMLAttribrutes = options => {
    const props = ['label', 'note', 'showcount'];

    const [a, b] = Object.entries(options).reduce(
      ([matching, leftover], [key, value]) =>
        props.includes(key)
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return { ...a, attributes: { ...b } };
  };

  /**
   * @class Radio API
   * @param {Object} options
   */

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * required, disabled
   * events, change, keyup, focus in/out
   */
  /**
   * @class INPUT
   * @param {Object} options
   * @param {String} [options.id]     Id for input, use to link it with label
   * @param {String} [options.type]   HTML Input type
   * @param {String} [options.name]   Name of form control, submitted with form as name/value pair
   * @param {String} [options.label]  Text for label input
   * @param {String} [options.note]   Text for input note/message, displayed underneath input field
   */
  function Input(options) {
    this.options = separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
  }

  Input.prototype.build = function () {
    this.inputWrap = _DOM.createElement('div', {
      class: ['input', `${this.options.attributes.type}`],
    });

    const inputEle = _DOM.createElement('input', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputNote', text: this.options.note });
      this.inputWrap.appendChild(inputNote);
      this.inputWrap.classList.add('withNote');
    }

    if (this.options.showcount) {
      const countMarkup = this.options.attributes.maxlength
        ? { html: `${0}<span>/</span>${this.options.attributes.maxlength}` }
        : { text: '0' };
      const inputCount = _DOM.createElement('div', { class: 'charCount', ...countMarkup });
      this.inputWrap.appendChild(inputCount);
    }

    this.inputWrap.appendChild(inputEle);
    this.inputWrap.appendChild(labelEle);

    return this;
  };

  Input.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Input;
});
