//? Thoughts
//? inputs, submit callback, required fields, permissions,

(function (global, factory) {
  global = global || self;
  global.FORM = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {
    style: 'default',
  };

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @class FORM
   * @param {Object} options
   */
  function FORM(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.inputs = {};
  }

  FORM.prototype.build = function () {
    this.form = _DOM.createElement('form');

    this.options.elements.forEach(ele => {
      let input, inputInstance;

      if (ele.type.toLowerCase() === 'radio') {
        inputInstance = new RADIO({ ...ele }).build();
      } else if (ele.type.toLowerCase() === 'select') {
        inputInstance = new SELECT({ ...ele }).build();
      } else {
        inputInstance = new INPUT({ ...ele }).build();
      }

      input = inputInstance.inputWrap;
      this.form.appendChild(input);
      this.inputs[ele.id] = input;
    });

    this.form.addEventListener('submit', e => {
      e.preventDefault();

      console.log(e.target.elements);

      const formData = new FormData(this.form);
      const entries = formData.entries();
      const data = Object.fromEntries(entries);
    });

    return this;
  };

  FORM.prototype.render = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.form);
    }

    return this;
  };

  return FORM;
});
