(function (global, factory) {
  global.Toast = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    autoClose: false,
    waitDuration: null,
  };

  /**
   * Constructor function for Toast Notifications.
   *
   * Toast allow you to display a message to user that will not enterfear with user workflow.
   * || Example usage would be to show that a report is being generated.
   *
   * @constructor
   * @param {Object} options
   * @param {Boolean} [options.autoClose] if true, toast will hide after waitDuration
   * @param {Number} [options.waitDuration] how long to show toast, ms
   * @returns {Toast}
   */
  function Toast(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    this.displayStatus = null;

    // Instance Ref
    this.dialog = null;

    // DOM Ref
    this.closeToastButton = null;
    this.messageEle = null;

    this._build();
  }

  /**
   * @function
   */
  Toast.prototype._build = function () {
    this.dialog = new Dialog({ className: 'toast', isModal: false });

    this.messageEle = _DOM.createElement('p', {
      class: 'toast__message',
    });

    this.closeToastButton = new Button({ icon: 'close', style: 'secondary', styleType: 'text' });

    this.dialog.dialog.appendChild(this.messageEle);
    this.closeToastButton.renderTo(this.dialog.dialog);
  };

  /**
   * @function
   */
  Toast.prototype.show = function (message) {
    if (this.displayStatus === 'open') return;

    if (message) this.messageEle.innerText = message;
    this.dialog.show();
    this.displayStatus = 'open';
  };

  /**
   * @function
   */
  Toast.prototype.close = function () {
    this.dialog.close();
    this.displayStatus = 'closed';
  };

  /**
   * Renders the built Toast Notification element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the Toast Notification to
   * @returns {Toast} Returns the current instances for chaining
   */
  Toast.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  return Toast;
});
