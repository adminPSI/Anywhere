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
    clickOutToClose: true,
    className: null,
  };

  /**
   * Constructor function for creating a Dialog component.
   *
   * @constructor
   * @param {Object} options
   * @param {Boolean} [options.isModal] Whether to display as basic dialog or modal dialog
   * @param {String} [options.className] Class name for <dialog> Element
   * @param {Boolean} [options.clickOutToClose] Whether modal closes with backdrop click
   * @param {Function} [options.clickOutToCloseCallback] Function to call when modal closes on backdrop click
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
    let classArray = ['dialog'];
    if (this.options.isModal) classArray.push('modal');
    if (this.options.className) classArray.push(this.options.className);

    this.dialog = _DOM.createElement('dialog', {
      class: classArray,
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
    if (this.options.clickOutToClose) {
      this.dialog.addEventListener('click', e => {
        const dialogDimensions = this.dialog.getBoundingClientRect();

        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          this.close();
          this.options.clickOutToCloseCallback();
        }
      });
    }
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
