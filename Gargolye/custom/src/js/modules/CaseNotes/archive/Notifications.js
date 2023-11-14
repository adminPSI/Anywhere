(function (global, factory) {
  global.Notifications = factory();
})(this, function () {
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

    // DOM Ref
    this.rootElement = null;

    this._build();
  }

  /**
   * @function
   */
  Notifications.prototype._build = function () {
    this.rootElement = _DOM.createElement('div', { class: 'notifications' });
  };

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
