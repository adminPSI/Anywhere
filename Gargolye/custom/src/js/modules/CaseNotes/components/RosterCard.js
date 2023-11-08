(function (global, factory) {
  global.RosterCard = factory();
})(this, function () {
  /**
   * Constructor function for creating a Roster Card component.
   *
   * @constructor
   * @returns {RosterCard}
   */
  function RosterCard(options) {
    this.options = options;

    this.rootElement = null;

    this.build();
  }

  /**
   * Builds the Roster Card component HTML
   *
   * @function
   */
  RosterCard.prototype.build = function () {
    this.rootElement = _DOM.createElement('div', {
      class: 'rosterCard',
      'data-id': this.options.consumerId,
      'data-target': 'rosterCard',
    });

    // PORTRAIT
    const portrait = new Portrait({ consumerId: c.id });

    // DETAILS
    const fragment = new DocumentFragment();
    const firstName = _DOM.createElement('p', {
      text: `${c.FN.trim()} ${c.MN?.trim() || ''}`.trim(),
    });
    const lastName = _DOM.createElement('p', { text: `${c.LN.trim()},` });
    fragment.append(lastName, firstName);
    const details = _DOM.createElement('div', { class: 'details', node: fragment });

    // BUILD
    portrait.renderTo(this.rootElement);
    this.rootElement.appendChild(details);
  };

  /**
   * Renders the built Roster Card component to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the roster card to
   * @returns {RosterCard} Returns the current instances for chaining
   */
  RosterCard.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return RosterCard;
});
