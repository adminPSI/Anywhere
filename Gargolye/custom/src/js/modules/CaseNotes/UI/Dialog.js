(function (global, factory) {
  global.Dialog = factory();
})(this, function () {
  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    isModal: true,
  };

  /**
   * Constructor function for creating a Dialog component.
   *
   * @constructor
   * @param {Object} options
   * @param {Boolean} [options.isModal] Whether to display as basic dialog or modal dialog
   * @returns {Dialog}
   *
   * @example
   * const popup = new Dialog();
   */
  function Dialog(options) {
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));

    this.dialog = null;

    this.build();
    this.setupEvents();
  }

  /**
   * Builds the Dialog element component HTML
   *
   * @function
   * @returns {Dialog} Returns the current instances for chaining
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
   * Sets up events for Dialog Box
   *
   * @function
   */
  Dialog.prototype.setupEvents = function () {
    this.dialog.addEventListener('click', e => {
      const dialogDimensions = this.dialog.getBoundingClientRect();

      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        this.close();
      }
    });
  };

  /**
   * Renders the built Dialog element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the dialog to
   * @returns {Dialog} Returns the current instances for chaining
   */
  Dialog.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog);
    }

    return this;
  };

  return Dialog;
});
