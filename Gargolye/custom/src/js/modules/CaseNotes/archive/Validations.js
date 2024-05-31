(function (global, factory) {
  global.VallidationController = factory();
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
  function VallidationController(options) {
    // Data Init
    this.options = { ...options };
    this.items = {};
    // DOM Ref
    this.validationWrap = null;
    this.errorsWrap = null;
    this.warningsWrap = null;

    this._build();
  }

  /**
   * @function
   */
  VallidationController.prototype._build = function () {
    this.validationWrap = _DOM.createElement('div', { class: 'validations' });

    this.errorsWrap = _DOM.createElement('div', { class: 'validationErros' });

    this.warningsWrap = _DOM.createElement('div', { class: 'validationWarnings' });

    this.validationWrap.appendChild(this.errorsWrap);
    this.validationWrap.appendChild(this.warningsWrap);
  };
  /**
   * Builds warning message markup, this will auto show
   *
   * @function
   */
  VallidationController.prototype.addWarning = function ({ name, message }) {
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
  VallidationController.prototype.showWarning = function ({ name, ...rest }) {
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
  VallidationController.prototype.addError = function ({ name, message }) {
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
  VallidationController.prototype.showError = function ({ name, ...rest }) {
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
  VallidationController.prototype.hide = function (name) {
    if (!this.items[name]) return;
    this.items[name].itemEle.classList.add('hidden');
  };
  /**
   * Sets the status of the error to valid/invalid
   *
   * @function
   */
  VallidationController.prototype.toggleErrorStatus = function (name, isError) {
    if (isError) {
      this.items[name].itemEle.classList.remove('valid');
    } else {
      this.items[name].itemEle.classList.add('valid');
    }
  };

  /**
   * Renders VallidationController markup to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render case notes feedback to
   * @returns {VallidationController} - Returns the current instances for chaining
   */
  VallidationController.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.validationWrap);
    }

    return this;
  };

  return VallidationController;
});
