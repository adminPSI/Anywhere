(function (global, factory) {
  global.Button = factory();
})(this, function () {
  //TODO: add icons

  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    text: null,
    type: 'button', // submit or button (don't use reset)
    icon: null,
    style: 'primary', // primary(blue), danger(red), warning(yellow)
    styleType: 'contained', // contained(filled), outlined(border, no fill), text(no fill/border)
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
    this.button = _DOM.createElement('button', {
      class: ['button', this.options.style, this.options.styleType],
      type: this.options.attributes.type,
    });

    if (this.options.icon) {
      this.button.innerText = this.options.text;
      this.button.insertBefore(Icon.getIcon(this.options.icon), this.button.firstChild);
      this.button.classList.add('icon');
    } else {
      this.button.innerText = this.options.text;
    }

    return this;
  };

  /**
   * Handles button click event
   *
   * @function
   * @param {Function} cbFunc - Callback function to call
   */
  Button.prototype.onClick = function (cbFunc) {
    this.button.addEventListener('click', e => {
      e.preventDefault();
      cbFunc(e);
    });
  };

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
