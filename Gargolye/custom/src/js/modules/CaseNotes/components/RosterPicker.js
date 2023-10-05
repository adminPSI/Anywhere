(function (global, factory) {
  global.RosterPicker = factory();
})(this, function () {
  /**
   * @class
   */
  function RosterPicker() {
    this.consumers = [];

    this.rosterPickerEle = null;
  }

  RosterPicker.prototype.build = function () {
    this.rosterPickerEle = _DOM.createElement('div');

    this.consumers.forEach(c => {
      const consumerCard = _DOM.createElement('div');

      // PORTRAIT
      const portrait = _DOM.createElement('img', {
        src: `./images/portraits/${c.id}.png?${new Date().setHours(0, 0, 0, 0)}`,
        onerror: `this.src='./images/new-icons/default.jpg'`,
        loading: 'lazy',
      });

      // DETAILS
      const fragment = new DocumentFragment();
      const firstName = _DOM.createElement('p', {
        text: `${c.FN.trim()} ${c.MN?.trim() || ''}`.trim(),
      });
      const lastName = _DOM.createElement('p', { text: `${c.LN.trim()},` });
      fragment.append(lastName, firstName);

      const details = _DOM.createElement('div', { node: fragment });

      consumerCard.appendChild(portrait);
      consumerCard.appendChild(details);

      this.rosterPickerEle.appendChild(consumerCard);
    });

    return this;
  };

  /**
   * Fetches consumers data by date, group and location
   */
  RosterPicker.prototype.fetchConsumers = async function (retrieveData) {
    try {
      const data = await _UTIL.fetchData('getConsumersByGroupJSON', retrieveData);
      this.consumers = data.getConsumersByGroupJSONResult;
    } catch (error) {
      console.log('uh oh something went horribly wrong :(', error.message);
    }

    return this;
  };

  /**
   *
   * @param {Node} node DOM node to render the roster picker to
   * @returns {DateNavigation} Returns the current instances for chaining
   */
  RosterPicker.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rosterPickerEle);
    }

    return this;
  };

  return RosterPicker;
});
