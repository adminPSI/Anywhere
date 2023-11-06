(function (global, factory) {
  global.AsyncRequestVisualizer = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   * @param {Number} [options.duration] - how long to show popup after success/error
   * @param {String} [options.messagePending] - message while you wait
   * @param {String} [options.messageSuccess] - message on success
   * @param {String} [options.messageError] - message on error
   */
  const DEFAULT_OPTIONS = {
    messagePending: 'Loading...',
    messageSuccess: 'Success!',
    messageError: 'Error :(',
    duration: 2000,
  };

  /**
   * Constructor function for creating a Async Request Visualizer component.
   *
   * @constructor
   * @returns {AsyncRequestVisualizer}
   */
  function AsyncRequestVisualizer(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);

    // Instance Ref
    this.dialog = null;
    this.spinner = null;

    // DOM Ref
    this.visualizerWrap = null;
    this.messageEle = null;

    this.build();
  }

  /**
   * Builds the AsyncRequestVisualizer component HTML
   *
   * @function
   */
  AsyncRequestVisualizer.prototype.build = function () {
    this.dialog = new Dialog({
      clickOutToClose: false,
      className: 'asyncRequestVisualizer',
    });

    this.visualizerWrap = _DOM.createElement('div');
    this.dialog.dialog.appendChild(this.visualizerWrap);

    this.spinner = new Spinner();
    this.spinner.renderTo(this.visualizerWrap);

    this.messageEle = _DOM.createElement('p');
    this.dialog.dialog.appendChild(this.messageEle);
  };

  /**
   * Default function for showing visualizer, use showPending to chain saves
   *
   * @function
   * @param {String} message
   */
  AsyncRequestVisualizer.prototype.show = function (message) {
    this.messageEle.innerText = message;
    this.dialog.show();
  };

  /**
   * Shows pending message, shows spinner
   *
   * @function
   * @param {String} message
   */
  AsyncRequestVisualizer.prototype.showPending = function (message) {
    this.messageEle.innerText = message;
    this.visualizerWrap.childNodes[0].remove();
    this.visualizerWrap.appendChild(this.spinner.spinnerWrap);
  };

  /**
   * Shows success message/icon but leaves dialog open for chaining saves
   *
   * @function
   * @param {String} message
   */
  AsyncRequestVisualizer.prototype.showSuccess = async function (message, duration = 2000) {
    this.messageEle.innerText = message;
    this.spinner.replaceWith(Icon.getIcon('checkmark'));

    await _UTIL.asyncSetTimeout(() => {}, duration);
  };

  /**
   * Shows error message/icon
   *
   * @function
   * @param {String} message
   */
  AsyncRequestVisualizer.prototype.showError = function (message) {
    this.messageEle.innerText = message;
    this.spinner.replaceWith(Icon.getIcon('error'));
  };

  /**
   * Handle async request completion
   *
   * @function
   * @param {Boolean} isSuccess
   * @param {String} message
   */
  AsyncRequestVisualizer.prototype.fullfill = async function (status, message, duration = 2000) {
    // set icon and message
    if (status === 'success') {
      this.showSuccess(message);
    } else {
      this.showError(message);
    }

    await _UTIL.asyncSetTimeout(() => {
      this.dialog.close();
    }, duration);
  };

  /**
   * Renders the built AsyncRequestVisualizer to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the AsyncRequestVisualizer to
   * @returns {AsyncRequestVisualizer} Returns the current instances for chaining
   */
  AsyncRequestVisualizer.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  return AsyncRequestVisualizer;
});
