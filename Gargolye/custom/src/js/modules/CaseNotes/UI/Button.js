(function (global, factory) {
  global.Button = factory();
})(this, function () {
  //=========================
  // MAIN LIB
  //-------------------------
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
   * @constructor
   * @param {Object} options
   * @param {String} options.text
   * @param {String} [options.type]
   * @param {String} [options.icon]
   * @param {String} [options.style]
   * @param {String} [options.styleType]
   * @returns {Button}
   */
  function Button(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));

    // DOM Ref
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
      name: this.options.attributes.name,
    });

    if (this.options.icon) {
      this.button.innerHTML = `<span>${this.options.text}</span>`;
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
      if (cbFunc) cbFunc(e);
    });
  };

  /**
   * Toggles button disabled state, if true input is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  Button.prototype.toggleDisabled = function (isDisbled) {
    this.button.disabled = isDisbled;
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
