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
    userOptions.name = userOptions.id;
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
    this.dialog = _DOM.createElement('dialog');

    return this;
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
      node.appendChild();
    }

    return this;
  };

  return Dialog;
});
