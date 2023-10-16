(function (global, factory) {
  global.Button = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    text: null,
    type: 'button', // submit or button (don't use reset)
    icon: null,
  };

  /**
   * Merge default options with user options
   *
   * @function
   * @param {Object}  userOptions - User defined options object
   * @return {Object} - Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * @constructor
   * @param {Object} options
   * @returns {Dialog}
   */
  function Button(options) {
    this.options = _DOM.separateHTMLAttribrutes(mergOptionsWithDefaults(options));

    this.button = null;

    this.build();
  }

  /**
   * Builds the Button element structure
   *
   * @function
   * @returns {Button} - Returns the current instances for chaining
   */
  Button.prototype.build = function () {
    this.button = _DOM.createElement('button', { class: 'button', text: this.options.text });

    return this;
  };

  Button.prototype.onClick = function () {};

  /**
   * Renders the built Button element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the Button to
   * @returns {Button} - Returns the current instances for chaining
   */
  Button.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.button);
    }

    return this;
  };

  return Button;
});
