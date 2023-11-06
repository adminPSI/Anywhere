(function (global, factory) {
  global.Spinner = factory();
})(this, function () {
  //TODO-ASH: bring in web animation api for more control

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
   * Constructor function for creating a spinner UI component.
   *
   * @constructor
   * @param {Object} options
   * @param {Number} [options.speed] - The speed ms, spin speed in milliseconds
   * @param {String} [options.size] - The size of spinner
   * @returns {Spinner}
   *
   * @example
   * var mySpinner = new Spinner();
   */
  function Spinner(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);

    // DOM Ref
    this.spinnerWrap = null;
    this.spinner = null;

    this.build();
  }

  /**
   * Builds the Spinner component HTML
   *
   * @function
   */
  Spinner.prototype.build = function () {
    this.spinnerWrap = _DOM.createElement('div', { class: 'loadingSpinner' });
    this.spinner = _DOM.createElement('div', { class: 'loadingSpinner__bar' });

    this.spinnerWrap.appendChild(this.spinner);
  };

  /**
   * Removes Element From DOM
   *
   * @function
   */
  Spinner.prototype.removeElement = function () {
    this.spinnerWrap.remove();
  };

  /**
   * Replaces Element with new one
   *
   * @function
   * @param {Node} node DOM node to replace element with
   */
  Spinner.prototype.replaceWith = function (node) {
    this.spinnerWrap.replaceWith(node);
  };

  /**
   * Renders the built Spinner element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the Loading Animation to
   * @returns {Spinner} Returns the current instances for chaining
   */
  Spinner.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.spinnerWrap);
    }

    return this;
  };

  return Spinner;
});
