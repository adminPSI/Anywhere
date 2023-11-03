(function (global, factory) {
  global.Form = factory();
})(this, function () {
  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {};

  /**
   * Constructor function for creating a Form component.
   *
   * @constructor
   * @param {Object} options
   * @returns {Form}
   *
   * @example
   * const myForm = new Form({
   *  elements: [],
   *  buttons: []
   * })
   */
  function Form(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    //this.options.elements = separateButtonElements(this.options.elements);
    this.inputs = {};
    this.buttons = {};

    // DOM Ref
    this.form = null;
  }

  /**
   * Builds the Form element HTML
   *
   * @function
   * @returns {Form} Returns the current instances for chaining
   */
  Form.prototype.build = function () {
    this.form = _DOM.createElement('form');

    // Build form input elements
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
        // this ties together the change events between form and inputs
        inputInstance.onChange(this.options.onChange);
      }

      this.form.appendChild(inputInstance.inputWrap);
      this.inputs[ele.id] = inputInstance;
    });

    // Add default save button for all forms
    const btnWrap = _DOM.createElement('div', { class: 'formButtons' });
    const submitButton = new Button({ type: 'submit', text: 'Save', name: 'save', icon: 'save' }).renderTo(btnWrap);
    this.buttons['submit'] = submitButton;

    // Add additional form buttons
    if (this.options.buttons) {
      this.options.buttons.forEach(button => {
        const newButton = new Button({ ...button }).renderTo(btnWrap);
        if (button.name) {
          this.buttons[button.name] = newButton;
        }
      });
    }

    this.form.appendChild(btnWrap);

    return this;
  };

  /**
   * Handles change event on form inputs
   *
   * @function
   * @param {Function} cbFunc Callback function to call
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
   * @param {Function} cbFunc Callback function to call
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
   * @param {Function} cbFunc Callback function to call
   */
  Form.prototype.onKeyup = function (cbFunc) {
    this.form.addEventListener(
      'keyup',
      _UTIL.debounce(e => {
        cbFunc(e);
      }, 100),
    );
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
   * @param {Node} node DOM node to render the form to
   * @returns {Form} Returns the current instances for chaining
   */
  Form.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.form);
    }

    return this;
  };

  return Form;
});
