(function (global, factory) {
  global.Notifications = factory();
})(this, function () {
  /**
   * @constructor
   */
  function NotificationMessage(options) {
    this.notification = null;
  }

  NotificationMessage.prototype.build = function () {};

  /**
   * Renders NotificationMessage markup to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render NotificationMessage to
   * @returns {NotificationMessage} - Returns the current instances for chaining
   */
  NotificationMessage.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.notification);
    }

    return this;
  };

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {};
  /**
   * Notifcations builds and stores notification elements,
   * this will build multiple different styles of notifications
   * depending on the options you pass
   *
   * @constructor
   */
  function Notifications(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    this.notifications = {};
  }
  /**
   * @function
   */
  Notifications.prototype.show = function () {
    if (this.notifications) {
    }

    const itemEle = _DOM.createElement('div', { class: ['validationMessage'] });

    return this;
  };

  return Notifications;
});
