(function (global, factory) {
  global.LoadingAnimation = factory();
})(this, function () {
  //TODO ASH: bring in web animation api for more control

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    speed: 'normal',
    size: 'large',
  };
  /**
   * @constructor
   * @param {Object} options
   * @param {String} [options.speed] - how fast spinner spins
   * @param {String} [options.size] - size of spinner
   */
  function LoadingAnimation(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);

    // DOM Ref
    this.spinnerWrap = null;
    this.spinner = null;
  }

  /**
   * Builds the Loading Animation element structure
   *
   * @function
   * @returns {LoadingAnimation} - Returns the current instances for chaining
   */
  LoadingAnimation.prototype.build = function () {
    this.spinnerWrap = _DOM.createElement('div', { class: 'loadingAnimation' });
    this.spinner = _DOM.createElement('div', { class: 'loadingAnimation__spinner' });

    this.spinnerWrap.appendChild(this.spinner);

    return this;
  };

  /**
   * Removes Element From DOM
   *
   * @function
   */
  LoadingAnimation.prototype.removeElement = function () {
    this.spinnerWrap.remove();
  };

  /**
   * Replaces Element with new one
   *
   * @function
   * @param {Node} node - DOM node to replace element with
   */
  LoadingAnimation.prototype.replaceWith = function (node) {
    this.spinnerWrap.replaceWith(node);
  };

  /**
   * Renders the built Loading Animation to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the Loading Animation to
   * @returns {LoadingAnimation} - Returns the current instances for chaining
   */
  LoadingAnimation.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.spinnerWrap);
    }

    return this;
  };

  return LoadingAnimation;
});
