(function (global, factory) {
  global.Input = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    showcount: false,
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

  /**
   * Separate HTML attributes from options obj
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes
   *
   * @function
   * @param {Object}  options - Options object
   * @return {Object} - Separated options object
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

    b.name = b.id;

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
   * @constructor
   * @param {Object} options
   * @param {String} options.id - Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.type - HTML Input type
   * @param {String} options.label - Text for label input
   * @param {Boolean} [options.required] - Whether input is required for submission
   * @param {String} [options.note] - Text for input note/message, displayed underneath input field
   * @param {Boolean} [options.showCount] - Whether to show char count or not
   * @param {String} [options.minlength] - min char count
   * @param {String} [options.maxlength] - max char count
   * @returns {Input}
   */
  function Input(options) {
    this.options = separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
    this.input = null;
  }

  /**
   * Builds the Input element structure
   *
   * @function
   * @returns {Input} - Returns the current instances for chaining
   */
  Input.prototype.build = function () {
    this.inputWrap = _DOM.createElement('div', {
      class: ['input', `${this.options.attributes.type}`],
    });

    this.input = _DOM.createElement('input', { ...this.options.attributes });
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

    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(labelEle);

    return this;
  };

  /**
   * Sets value of input
   *
   * @function
   */
  Input.prototype.setValue = function (value) {};

  /**
   * Clears input value, sets it to ''
   *
   * @function
   */
  Input.prototype.clear = function () {};

  /**
   * Handles input change event
   *
   * @function
   */
  Input.prototype.onChange = function () {};

  /**
   * Handles input keyup event
   *
   * @function
   */
  Input.prototype.onKeyup = function () {};

  /**
   * Renders the built Input element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the input to
   * @returns {Input} - Returns the current instances for chaining
   */
  Input.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Input;
});
