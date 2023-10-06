//? Thoughts
//? inputs, submit callback, required fields, permissions,

(function (global, factory) {
  global = global || self;
  global.Form = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    style: 'default',
  };

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
   * @class Form
   * @param {Object} options
   */
  function Form(options) {
    this.options = mergOptionsWithDefaults(options);
    this.inputs = {};
  }

  Form.prototype.build = function () {
    this.form = _DOM.createElement('form');

    this.options.elements.forEach(ele => {
      let inputInstance;

      switch (ele.type.toLowerCase()) {
        case 'radio': {
          inputInstance = new Radio({ ...ele }).build();
        }
        case 'select': {
          inputInstance = new Select({ ...ele }).build();
        }
        default: {
          inputInstance = new Input({ ...ele }).build();
        }
      }

      this.form.appendChild(inputInstance.inputWrap);
      this.inputs[ele.id] = inputInstance;
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

  Form.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.form);
    }

    return this;
  };

  return Form;
});
