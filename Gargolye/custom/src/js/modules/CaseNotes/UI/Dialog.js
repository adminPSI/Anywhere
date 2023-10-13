(function (global, factory) {
  global.Dialog = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    isModal: true,
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
   * @returns {Dialog}
   */
  function Dialog(options) {
    this.options = _UTIL.FORM.separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.dialog = null;
  }

  /**
   * Builds the Dialog element structure
   *
   * @function
   * @returns {Dialog} - Returns the current instances for chaining
   */
  Dialog.prototype.build = function () {
    this.dialog = _DOM.createElement('dialog', {
      class: this.options.isModal ? ['dialog', 'modal'] : ['dialog'],
    });

    return this;
  };

  /**
   * Shows dialog element
   *
   * @function
   */
  Dialog.prototype.show = function () {
    if (this.options.isModal) {
      this.dialog.showModal();
    } else {
      this.dialog.show();
    }
  };

  /**
   * Closes dialog element
   *
   * @function
   */
  Dialog.prototype.close = function () {
    this.dialog.close();
  };

  /**
   * Renders the built Dialog element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the dialog to
   * @returns {Dialog} - Returns the current instances for chaining
   */
  Dialog.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog);
    }

    return this;
  };

  return Dialog;
});
