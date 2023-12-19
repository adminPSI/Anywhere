(function (global, factory) {
  global.ConfirmationPopup = factory();
})(this, function () {
  function ConfirmationPopup() {
    this.displayStatus = null;

    // DOM Ref
    this.dialog = null;
    this.messageEle = null;
    this.confirmButton = null;
    this.cancelButton = null;

    this._build();
  }

  ConfirmationPopup.prototype._build = function () {
    this.dialog = new Dialog({ className: this.options.className });

    this.messageEle = _DOM.createElement('p', {
      class: 'confirmation__message',
      //text: this.options.message,
    });

    const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
    this.confirmButton = new Button({
      text: 'Ok',
      //icon: 'save',
      name: 'confirm',
    });
    this.cancelButton = new Button({
      text: 'Cancel',
      //icon: 'cancel',
      styleType: 'outlined',
      name: 'cancel',
    });

    this.confirmButton.renderTo(btnWrap);
    this.cancelButton.renderTo(btnWrap);

    this.dialog.dialog.appendChild(this.messageEle);
    this.dialog.dialog.appendChild(btnWrap);
  };

  /**
   * @function
   */
  ConfirmationPopup.prototype._setupEvents = function (cbFunc) {
    this.dialog.dialog.addEventListener('click', e => {
      // e.target is confirm or cancel?
      cbFunc();
    });
  };

  /**
   * @function
   */
  ConfirmationPopup.prototype.show = function (message) {
    if (this.displayStatus === 'open') return;

    if (message) this.messageEle.innerText = message;
    this.dialog.show();
    this.displayStatus = 'open';

    return new Promise((resolve, reject) => {
      const callbackFunction = e => {
        // e.target is confirm or cancel?
        this.dialog.dialog.removeEventListener('click', callbackFunction);
        this.close();
        resolve(e.target.name);
      };

      this.dialog.dialog.addEventListener('click', callbackFunction);
    });
  };

  /**
   * @function
   */
  ConfirmationPopup.prototype.close = function () {
    this.dialog.close();
    this.displayStatus = 'closed';
  };

  /**
   * Renders the built Confirmation Popup element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the Confirmation Popup to
   * @returns {ConfirmationPopup} Returns the current instances for chaining
   */
  ConfirmationPopup.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  return ConfirmationPopup;
});
