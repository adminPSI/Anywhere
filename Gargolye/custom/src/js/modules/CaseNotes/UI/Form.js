(function (global, factory) {
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
        case 'textarea': {
          delete ele.type; // only needed for Form
          inputInstance = new Textarea({ ...ele }).build();
          if (typeof this.options.onKeyup === 'function') {
            inputInstance.onKeyup(this.options.onKeyup);
          }
          break;
        }
        default: {
          inputInstance = new Input({ ...ele }).build();
          if (typeof this.options.onKeyup === 'function') {
            inputInstance.onKeyup(this.options.onKeyup);
          }
        }
      }

      if (typeof this.options.onChange === 'function') {
        inputInstance.onChange(this.options.onChange);
      }

      this.form.appendChild(inputInstance.inputWrap);
      this.inputs[ele.id] = inputInstance;
    });

    const btn = _DOM.createElement('button', { type: 'submit', text: 'Save', class: 'button' });
    this.form.appendChild(btn);

    return this;
  };

  /**
   * Handles change event on form inputs
   *
   * @function
   */
  Form.prototype.onSubmit = function (cbFunc) {
    this.form.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(this.form);
      const entries = formData.entries();
      const data = Object.fromEntries(entries);

      cbFunc(data);
    });
  };

  /**
   * Handles change event on form inputs
   *
   * @function
   */
  Form.prototype.onChange = function (cbFunc) {
    this.form.addEventListener('change', e => {
      cbFunc(e);
    });
  };

  /**
   * Handles keyup event on form inputs
   *
   * @function
   */
  Form.prototype.onKeyup = function (cbFunc) {
    this.form.addEventListener('keyup', e => {
      cbFunc(e);
    });
  };

  /**
   * Clears value from all inputs within form
   *
   * @function
   */
  Form.prototype.clear = function () {
    // clear all values from form inputs
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
