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
        this.consumerId = options.consumerId;
        this.firstName = options.firstName;
        this.middleName = options.middleName;
        this.lastName = options.lastName;
        this.isInactive = options.isInactive;
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
            'data-id': this.consumerId,
            'data-target': 'rosterCard',
        });

        // PORTRAIT
        const portrait = new Portrait(this.consumerId);

        // DETAILS
        const firstName = _DOM.createElement('p', {
            text: `${this.firstName.trim()} ${this.middleName?.trim() || ''}`.trim(),
        });
        const lastName = _DOM.createElement('p', { text: `${this.lastName.trim()},` });

        const fragment = new DocumentFragment();
        fragment.append(lastName, firstName);


        const details = this.isInactive == true ? _DOM.createElement('div', { class: 'inactiveDetails', node: fragment }) : _DOM.createElement('div', { class: 'details', node: fragment });

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
