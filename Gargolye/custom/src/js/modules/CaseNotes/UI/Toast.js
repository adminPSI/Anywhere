(function (global, factory) {
  global.ToastNotification = factory();
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
   * @returns {ToastNotification}
   */
  function ToastNotification(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);

    // Instance Ref
    this.dialog = null;

    // DOM Ref
    this.closeToastButton = null;
    this.messageEle = null;

    this.build();
  }

  /**
   * @function
   */
  ToastNotification.prototype.build = function () {
    this.dialog = new Dialog({ className: 'toast' });

    this.messageEle = _DOM.createElement('p', {
      class: 'toast__message',
      text: this.options.message,
    });

    this.closeToastButton = new Button({ icon: 'cancel', style: 'secondary', styleType: 'outlined' });

    this.closeToastButton.renderTo(this.dialog.dialog);
    this.dialog.dialog.appendChild(messageEle);
  };

  /**
   * @function
   */
  ToastNotification.prototype.show = function (message) {
    if (message) this.messageEle.innerText = message;
    this.dialog.show();
  };

  /**
   * @function
   */
  ToastNotification.prototype.close = function () {
    this.dialog.close();
  };

  /**
   * Renders the built Toast Notification element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the Toast Notification to
   * @returns {ToastNotification} Returns the current instances for chaining
   */
  ToastNotification.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  return ToastNotification;
});
