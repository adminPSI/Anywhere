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
    clickOutToClose: true,
    className: null,
    isModal: true,
    isConfirmation: false,
    confirmationMessage: null,
  };

  /**
   * Constructor function for creating a Dialog component.
   *
   * @constructor
   * @param {Object} options
   * @param {Boolean} [options.isModal] Whether to display as basic dialog or modal dialog
   * @param {String} [options.isConfirmation]
   * @param {String} [options.confirmationMessage]
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

    // Instance Ref
    this.dialog = null;

    // DOM Ref
    this.confirmationButtons = null;

    this._build();
  }

  /**
   * Builds the Dialog element component HTML
   *
   * @function
   * @returns {Dialog} Returns the current instances for chaining
   */
  Dialog.prototype._build = function () {
    let classArray = ['dialog'];
    if (this.options.isModal) classArray.push('modal');
    if (this.options.className) classArray.push(this.options.className);

    this.dialog = _DOM.createElement('dialog', {
      class: classArray,
    });

    if (this.options.isConfirmation) {
      const messageEle = _DOM.createElement('p', {
        text: this.options.message,
      });

      this.confirmationButtons = _DOM.createElement('div', { class: 'button-wrap' });
      const yesButton = new Button({ text: 'yes', 'data-target': 'yes' });
      const noButton = new Button({ text: 'no', styleType: 'outlined', 'data-target': 'no' });
      yesButton.renderTo(this.confirmationButtons);
      noButton.renderTo(this.confirmationButtons);

      this.dialog.dialog.append(messageEle, this.confirmationButtons);
    }

    this._setupEvents();
  };

  /**
   * Sets up events for Dialog Box
   *
   * @function
   */
  Dialog.prototype._setupEvents = function () {
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

    if (this.options.isConfirmation) {
      this.confirmationButtons.addEventListener('click', e => {
        this.dialog.close();

        const customEvent = new CustomEvent('onConfirmationClick', {
          bubbles: true,
          cancelable: true,
          detail: e.target.dataset.target === 'yes' ? true : false,
        });
        this.confirmationButtons.dispatchEvent(customEvent);
      });
    }
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
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Dialog.prototype.onConfirmationClick = function (cbFunc) {
    this.confirmationButtons.addEventListener('onConfirmationClick', e => {
      cbFunc(e.detail);
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
