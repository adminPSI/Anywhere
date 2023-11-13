(function (global, factory) {
  global.ConfirmationPopup = factory();
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
   * @constructor
   */
  function ConfirmationPopup(options) {
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    // Instance Ref
    this.dialog = null;

    // DOM Ref
    this.yesButton = null;
    this.noButton = null;

    this._build();
  }

  ConfirmationPopup.prototype._build = function () {
    this.dialog = new Dialog({ className: 'inactivityWarning' });

    const messageEle = _DOM.createElement('p', {
      text: this.options.message,
    });

    const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
    this.yesButton = new Button({ text: 'yes' });
    this.noButton = new Button({ text: 'no', styleType: 'outlined' });
    this.yesButton.renderTo(btnWrap);
    this.noButton.renderTo(btnWrap);

    this.dialog.dialog.appendChild(messageEle);
    this.dialog.dialog.appendChild(btnWrap);
  };

  /**
   * @function
   */
  ConfirmationPopup.prototype.onClick = function (cbFunc) {
    this.yesButton.onClick(e => {
      this.dialog.close();
    });
    this.noButton.onClick(e => {
      this.dialog.close();
    });
  };

  /**
   * Shows the confirmation popup/dialog
   *
   * @function
   */
  ConfirmationPopup.prototype.show = function () {
    this.dialog.show();
  };
});
