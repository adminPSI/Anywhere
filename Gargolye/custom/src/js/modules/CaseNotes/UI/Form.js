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
   */
  function Form(options) {
    // Data Init
    this.options = mergOptionsWithDefaults(options);
    this.inputs = {};

    // Callbacks
    this.onSubmit = options.onSubmit;
  }

  /**
   * Builds the Form element structure
   *
   * @function
   * @returns {Form} - Returns the current instances for chaining
   */
  Form.prototype.build = function () {
    this.form = _DOM.createElement('form');

    this.options.elements.forEach(ele => {
      let inputInstance;

      switch (ele.type.toLowerCase()) {
        case 'radio': {
          inputInstance = new Radio({ ...ele }).build();
          break;
        }
        case 'select': {
          delete ele.type; // only needed for Form
          inputInstance = new Select({ ...ele }).build();
          break;
        }
        default: {
          inputInstance = new Input({ ...ele }).build();
        }
      }

      this.form.appendChild(inputInstance.inputWrap);
      this.inputs[ele.id] = inputInstance;
    });

    //temp
    const btn = _DOM.createElement('button', { type: 'submit', text: 'Save' });
    this.form.appendChild(btn);
    //end temp

    return this;
  };

  /**
   * Setsup events for form
   *
   * @function
   */
  Form.prototype.setupEvents = function () {
    this.form.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(this.form);
      const entries = formData.entries();
      const data = Object.fromEntries(entries);

      this.onSubmit(data);
    });
  };

  /**
   * Renders the built Form element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the form to
   * @returns {Form} - Returns the current instances for chaining
   */
  Form.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.form);
    }

    return this;
  };

  return Form;
});
