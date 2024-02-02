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
  const DEFAULT_OPTIONS = {
    isReadOnly: false,
    hideAllButtons: false,
    formName: '',
  };

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
    this.inputs = {};
    this.buttons = {};

    // DOM Ref
    this.form = null;

    this._build();
    this._setupEvents();
  }

  /**
   * Builds the Form element HTML
   *
   * @function
   */
  Form.prototype._build = function () {
    this.form = _DOM.createElement('form', { name: this.options.formName, id: this.options.formName });

    // Build form input fields
    this.options.fields.forEach(ele => {
      const fieldType = ele.type.toLowerCase();
      let inputInstance;

      switch (fieldType) {
        case 'radiogroup': {
          inputInstance = new RadioGroup({ ...ele });
          break;
        }
        case 'checkbox': {
          inputInstance = new Checkbox({ ...ele });
          break;
        }
        case 'checkboxgroup': {
          inputInstance = new CheckboxGroup({ ...ele });
          break;
        }
        case 'select': {
          const tmpFix = { ...ele };
          delete tmpFix.type; // only needed for Form

          inputInstance = new Select({ ...tmpFix });
          break;
        }
        case 'textarea': {
          const tmpFix = { ...ele };
          delete tmpFix.type; // only needed for Form
          inputInstance = new Textarea({ ...tmpFix });
          break;
        }
        case 'attachment': {
          const tmpFix = { ...ele };
          delete tmpFix.type; // only needed for Form
          inputInstance = new Attachments({ ...tmpFix });
          break;
        }
        default: {
          inputInstance = new Input({ ...ele });
        }
      }

      if (typeof this.options.onChange === 'function') {
        // this ties together the change events between form and inputs
        inputInstance.onChange(this.options.onChange);
      }

      this.form.appendChild(inputInstance.rootElement);

      if (fieldType === 'checkboxgroup') {
        this.inputs = { ...this.inputs, ...inputInstance.inputs };
      } else {
        this.inputs[ele.id] = inputInstance;
      }
    });

    if (!this.options.hideAllButtons) {
      const btnWrap = _DOM.createElement('div', { class: 'formButtons' });
      // Add default save button for all forms
      const submitButton = new Button({
        type: 'submit',
        text: 'Save',
        name: 'save',
        icon: 'save',
      }).renderTo(btnWrap);
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

      // Add default delete button for all forms (hidden by default)
      const deleteButton = new Button({
        type: 'button',
        text: 'Delete',
        name: 'delete',
        icon: 'delete',
        style: 'danger',
        styleType: 'outlined',
        hidden: true,
      }).renderTo(btnWrap);
      this.buttons['delete'] = deleteButton;

      // Add default cancel button for all forms
      const cancelButton = new Button({
        type: 'reset',
        text: 'Cancel',
        name: 'cancel',
        style: 'primary',
        styleType: 'outlined',
      }).renderTo(btnWrap);
      this.buttons['cancel'] = cancelButton;

      this.form.appendChild(btnWrap);
    }

    // if (this.options.isReadOnly) {
    //   this.disableFormInputs();
    // }
  };

  Form.prototype._setupEvents = function () {
    this.form.addEventListener('change', e => {
      const customEvent = new CustomEvent('onChange', { detail: e });
      this.form.dispatchEvent(customEvent);
    });

    this.form.addEventListener(
      'keyup',
      _UTIL.debounce(e => {
        const customEvent = new CustomEvent('onKeyup', { detail: e });
        this.form.dispatchEvent(customEvent);
      }, 100),
    );

    if (this.buttons['delete']) {
      this.buttons['delete'].onClick(e => {
        const customEvent = new CustomEvent('onDelete', { detail: e });
        this.form.dispatchEvent(customEvent);
      });
    }
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

      cbFunc(data, e.submitter);
    });
  };

  /**
   * Handles reset event on form
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Form.prototype.onReset = function (cbFunc) {
    this.form.addEventListener('reset', e => {
      e.preventDefault();

      this.clear();

      cbFunc(data, e.submitter);
    });
  };

  /**
   * Handles delete event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Form.prototype.onDelete = function (cbFunc) {
    this.form.addEventListener('onDelete', e => {
      e.preventDefault();

      this.clear();

      cbFunc(data, e.submitter);
    });
  };

  /**
   * Handles change event on form inputs
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Form.prototype.onChange = function (cbFunc) {
    this.form.addEventListener('onChange', e => {
      cbFunc(e.detail);
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
      'onKeyup',
      _UTIL.debounce(e => {
        cbFunc(e.detail);
      }, 100),
    );
  };

  /**
   * Handles file delete event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Form.prototype.onFileDelete = function (cbFunc) {
    this.form.addEventListener('fileDelete', e => {
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
    for (inputName in this.inputs) {
      this.inputs[inputName].clear();
    }
  };

  /**
   * Disables all inputs within form
   *
   * @function
   */
  Form.prototype.disableFormInputs = function (disable = true) {
    for (inputName in this.inputs) {
      this.inputs[inputName].toggleDisabled(disable);
    }
  };

  Form.prototype.toggleFormDisabled = function (disable) {
    this.form.classList.toggle('readonly', disable);
  };

  /**
   * Populates form fields with given data
   *
   * @function
   * @param {Object} data
   */
  Form.prototype.populate = function (data) {
    this.clear();

    this.formData = data;

    for (inputName in data) {
      this.inputs[inputName].setValue(data[inputName]);
    }
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
