(function (global, factory) {
  global = global || self;
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
   * @param {Object}  userOptions  User defined options object
   * @return {Object}              Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  /**
   * Separate HTML attributes from options obj
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attributes
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

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.label Text for label input
   * @param {Boolean} [options.required] Whether input is required for submission
   * @param {String} [options.note] Text for input note/message, displayed underneath input field
   */
  function Select(options) {
    this.options = separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.inputWrap = null;
    this.input = null;
  }

  /**
   * Builds the Select element structure
   *
   * @function
   * @returns {Select} Returns the current instances for chaining
   */
  Select.prototype.build = function () {
    this.inputWrap = _DOM.createElement('div', {
      class: ['input', 'select'],
    });

    this.input = _DOM.createElement('select', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputNote', text: this.options.note });
      this.inputWrap.appendChild(inputNote);
      this.inputWrap.classList.add('withNote');
    }

    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(labelEle);
    return this;
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
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Select;
});
