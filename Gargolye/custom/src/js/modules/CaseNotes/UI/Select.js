(function (global, factory) {
  global = global || self;
  global.Select = factory();
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

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @class Select
   * @param {Object} options
   */
  function Select(options) {
    this.options = separateHTMLAttribrutes(mergOptionsWithDefaults(options));
  }

  Select.prototype.build = function () {
    this.inputWrap = _DOM.createElement('div', {
      class: ['input', `${this.options.attributes.type}`],
    });

    this.input = _DOM.createElement('select', { ...this.options.attributes });
    this.label = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputNote', text: this.options.note });
      this.inputWrap.appendChild(inputNote);
      this.inputWrap.classList.add('withNote');
    }

    this.inputWrap.appendChild(this.input);
    this.inputWrap.appendChild(this.label);
    return this;
  };

  Select.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.inputWrap);
    }

    return this;
  };

  return Select;
});
