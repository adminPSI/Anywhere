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
    type: 'button',
    icon: null,
    style: 'primary',
    styleType: 'contained',
  };

  /**
   * Constructor function for creating a Button component.
   *
   * @constructor
   * @param {Object} options
   * @param {String} [options.text] button text
   * @param {String} [options.type] submit or button (don't use reset)
   * @param {String} [options.icon] icon to include
   * @param {String} [options.style] primary(blue), secondary(green), danger(red), warning(yellow)
   * @param {String} [options.styleType] contained(filled), outlined(border, no fill), text(no fill/border)
   * @returns {Button}
   *
   * @example
   * const saveButton = new Button({
   *   text: 'save',
   * });
   */
  function Button(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));

    // DOM Ref
    this.button = null;

    this.build();
  }

  /**
   * Builds the Button element component HTML
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
      if (this.options.text) {
        this.button.innerHTML = `<span>${this.options.text}</span>`;
        this.button.insertBefore(Icon.getIcon(this.options.icon), this.button.firstChild);
        this.button.classList.add('button--icon');
      } else {
        this.button.appendChild(Icon.getIcon(this.options.icon));
        this.button.classList.add('button--icon-only');
      }
    } else {
      this.button.innerText = this.options.text;
    }

    return this;
  };

  /**
   * Handles button click event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
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
   * @param {Node} node DOM node to render the Button to
   * @returns {Button} Returns the current instances for chaining
   */
  Button.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.button);
    }

    return this;
  };

  return Button;
});
