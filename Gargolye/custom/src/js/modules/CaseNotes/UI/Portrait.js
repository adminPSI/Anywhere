(function (global, factory) {
  global.Portrait = factory();
})(this, function () {
  /**
   * Constructor function for creating a Portrait component.
   *
   * @constructor
   * @returns {RosterCard}
   */
  function Portrait(options) {
    this.options = options;

    this.rootElement = null;

    this.build();
  }

  /**
   * Builds the Portrait component HTML
   *
   * @function
   */
  Portrait.prototype.build = function () {
    const imgSource = `./images/portraits/${this.options.consumerId}.png?${new Date().setHours(0, 0, 0, 0)}`;
    const defaultImgSource = `this.src='./images/new-icons/default.jpg'`;

    const image = _DOM.createElement('img', {
      src: imgSource,
      onerror: defaultImgSource,
      loading: 'lazy',
    });

    this.rootElement = _DOM.createElement('div', { class: 'portrait', node: image });
  };

  /**
   * Renders the built Portrait component to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the portrait to
   * @returns {RosterCard} Returns the current instances for chaining
   */
  Portrait.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return Portrait;
});
