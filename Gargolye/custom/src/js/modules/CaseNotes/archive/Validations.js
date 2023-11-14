(function (global, factory) {
  global.ValidationCenter = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Validation center is used for grouping error and warning messages together,
   * should not be used for Form Input validation, form will handle that for you.
   *
   * @constructor
   */
  function ValidationCenter(options) {
    // Data Init
    this.options = { ...options };
    this.items = {};
    // DOM Ref
    this.validationWrap = null;
    this.errorsWrap = null;
    this.warningsWrap = null;
  }

  /**
   * @function
   * @returns {ValidationCenter} - Returns the current instances for chaining
   */
  ValidationCenter.prototype.build = function () {
    this.validationWrap = _DOM.createElement('div', { class: 'validations' });

    this.errorsWrap = _DOM.createElement('div', { class: 'validationErros' });

    this.warningsWrap = _DOM.createElement('div', { class: 'validationWarnings' });

    this.validationWrap.appendChild(this.errorsWrap);
    this.validationWrap.appendChild(this.warningsWrap);

    return this;
  };
  /**
   * Builds warning message markup, this will auto show
   *
   * @function
   */
  ValidationCenter.prototype.addWarning = function ({ name, message }) {
    if (this.items[name]) {
      console.error(`name: ${name}, is already being used by another error/warning message`);
    }

    const itemInstance = new ValidationMessage({
      name,
      message,
      type: 'warning',
    });

    itemInstance.renderTo(this.warningsWrap);

    this.items[name] = itemInstance;
  };
  /**
   * Shows warning message
   *
   * @function
   */
  ValidationCenter.prototype.showWarning = function ({ name, ...rest }) {
    if (!this.items[name]) {
      this.addWarning({ name, ...rest });
    }

    this.items[name].itemEle.classList.remove('hidden');
  };
  /**
   * Builds error message markup, this will auto show
   *
   * @function
   */
  ValidationCenter.prototype.addError = function ({ name, message }) {
    if (this.items[name]) {
      console.error(`name: ${name}, is already being used by another error/warning message`);
    }

    const itemInstance = new ValidationMessage({
      name,
      message,
      type: 'error',
    });

    itemInstance.renderTo(this.errorsWrap);

    this.items[name] = itemInstance;
  };
  /**
   * Shows error message
   *
   * @function
   */
  ValidationCenter.prototype.showError = function ({ name, ...rest }) {
    if (!this.items[name]) {
      this.addError({ name, ...rest });
    }

    this.items[name].itemEle.classList.remove('hidden');
  };
  /**
   * Hides warning/error message
   *
   * @function
   */
  ValidationCenter.prototype.hide = function (name) {
    if (!this.items[name]) return;
    this.items[name].itemEle.classList.add('hidden');
  };
  /**
   * Sets the status of the error to valid/invalid
   *
   * @function
   */
  ValidationCenter.prototype.toggleErrorStatus = function (name, isError) {
    if (isError) {
      this.items[name].itemEle.classList.remove('valid');
    } else {
      this.items[name].itemEle.classList.add('valid');
    }
  };

  /**
   * Renders ValidationCenter markup to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render case notes feedback to
   * @returns {ValidationCenter} - Returns the current instances for chaining
   */
  ValidationCenter.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.validationWrap);
    }

    return this;
  };

  return ValidationCenter;
});
