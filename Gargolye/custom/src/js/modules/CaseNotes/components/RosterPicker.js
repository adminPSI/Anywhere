(function (global, factory) {
  global.RosterPicker = factory();
})(this, function () {
  //TODO: keep track of selected consumers (option to allow multiple consumers to be selected)

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

  /**
   * @constructor
   * @param {Object} options
   * @param {Function} options.onConsumerSelect
   */
  function RosterPicker(options) {
    // Data Init
    this.consumers = [];
    this.selectedConsumers = {};

    // Callbacks
    this.onConsumerSelect = options.onConsumerSelect;

    // DOM Ref
    this.rosterPickerEle = null;
    this.rosterWrapEle = null;
    this.rosterSearchEle = null;
    this.rosterCaseLoadInput = null;
  }

  /**
   * Builds the Input element structure
   *
   * @function
   * @returns {RosterPicker} - Returns the current instances for chaining
   */
  RosterPicker.prototype.build = function () {
    this.rosterPickerEle = _DOM.createElement('div', { class: 'rosterPicker' });
    this.rosterWrapEle = _DOM.createElement('div', { class: 'rosterCardWrap' });

    this.rosterSearchInput = new Input({
      type: 'search',
      id: 'rosterSearch',
      name: 'rosterSearch',
      placeholder: 'Search...',
    });

    this.rosterCaseLoadInput = new Input({
      type: 'checkbox',
      label: 'Only show caseload',
      id: 'caseloadtoggle',
      name: 'caseload',
    });

    this.rosterSearchInput.build().renderTo(this.rosterPickerEle);
    this.rosterCaseLoadInput.build().renderTo(this.rosterPickerEle);
    this.rosterPickerEle.appendChild(this.rosterWrapEle);

    this.populate();

    return this;
  };

  /**
   * Populate consumer roster cards
   *
   * @function
   */
  RosterPicker.prototype.populate = function () {
    this.consumers.forEach(c => {
      const rosterCard = _DOM.createElement('div', { class: 'rosterCard' });

      // PORTRAIT
      const image = _DOM.createElement('img', {
        src: `./images/portraits/${c.id}.png?${new Date().setHours(0, 0, 0, 0)}`,
        onerror: `this.src='./images/new-icons/default.jpg'`,
        loading: 'lazy',
      });
      const portrait = _DOM.createElement('div', { class: 'portrait', node: image });

      // DETAILS
      const fragment = new DocumentFragment();
      const firstName = _DOM.createElement('p', {
        text: `${c.FN.trim()} ${c.MN?.trim() || ''}`.trim(),
      });
      const lastName = _DOM.createElement('p', { text: `${c.LN.trim()},` });
      fragment.append(lastName, firstName);

      const details = _DOM.createElement('div', { class: 'details', node: fragment });

      rosterCard.appendChild(portrait);
      rosterCard.appendChild(details);

      this.rosterWrapEle.appendChild(rosterCard);
    });
  };

  /**
   * Setsup events for navigation
   *
   * @function
   */
  RosterPicker.prototype.setupEvents = function () {
    this.rosterWrapEle.addEventListener('click', () => {});
  };

  /**
   * Hides/Shows Roster Cards
   *
   * @function
   */
  RosterPicker.prototype.onSearchFilter = function () {};

  /**
   * Fetches consumers data by date, group and location
   *
   * @function
   * @param {Object} retrieveData
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
   * Renders the built Input element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the roster picker to
   * @returns {RosterPicker} - Returns the current instances for chaining
   */
  RosterPicker.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rosterPickerEle);
    }

    return this;
  };

  return RosterPicker;
});
