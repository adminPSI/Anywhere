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
    disabled: false,
    class: [],
  };

  /**
   * Constructor function for creating a Button component.
   *
   * @constructor
   * @param {Object} options
   * @param {String} options.type submit or button (don't use reset)
   * @param {String} [options.text] button text
   * @param {String} [options.name] button name
   * @param {String} [options.value] button value
   * @param {String} [options.icon] icon to include
   * @param {String} [options.style] primary(blue), secondary(green), danger(red), warning(yellow)
   * @param {String} [options.styleType] contained(filled), outlined(border, no fill), text(no fill/border)
   * @param {Array} [options.class] additional css classes to add ['class1', 'class2']
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

    this._build();
  }

  /**
   * Builds the Button element component HTML
   *
   * @function
   */
  Button.prototype._build = function () {
    const classes = ['button', this.options.style, this.options.styleType, ...this.options.class];
    this.button = _DOM.createElement('button', {
      class: this.options.hidden ? [...classes, 'button--hidden'] : classes,
      type: this.options.attributes.type,
      name: this.options.attributes.name,
      value: this.options.attributes.value,
      disabled: this.options.attributes.disabled,
    });

    if (this.options.icon) {
      if (this.options.text) {
        const textNode = document.createTextNode(this.options.text);
        this.button.append(Icon.getIcon(this.options.icon), textNode);
        this.button.classList.add('button--icon');
      } else {
        this.button.appendChild(Icon.getIcon(this.options.icon));
        this.button.classList.add('button--icon-only');
      }
    } else {
      this.button.innerText = this.options.text;
    }
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
   * Toggles button visibility state, if true input is hidden
   *
   * @function
   * @param {Boolean} isHidden
   */
  Button.prototype.toggleVisibility = function (isHidden) {
    this.button.classList.toggle('button--hidden', isHidden);
  };

  Button.prototype.updateText = function (newText) {
    this.button.innerText = '';

    const textNode = document.createTextNode(newText);

    if (this.options.icon) {
      this.button.append(Icon.getIcon(this.options.icon));
    }

    this.button.append(textNode);
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
