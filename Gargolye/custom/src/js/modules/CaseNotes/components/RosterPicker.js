(function (global, factory) {
  global.RosterPicker = factory();
})(this, function () {
  //TODO: keep track of selected consumers (option to allow multiple consumers to be selected)

  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    allowMultiSelect: false,
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

  /**
   * @constructor
   * @param {Object} options
   * @param {Boolean} [options.allowMultiSelect]
   * @param {Function} options.onConsumerSelect
   */
  function RosterPicker(options) {
    // Data Init
    this.options = mergOptionsWithDefaults(options);
    this.consumers = [];
    this.selectedConsumers = {};

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
    this.setupEvents();

    return this;
  };

  /**
   * Populate consumer roster cards
   *
   * @function
   */
  RosterPicker.prototype.populate = function () {
    this.consumers.forEach(c => {
      const rosterCard = _DOM.createElement('div', {
        class: 'rosterCard',
        'data-id': c.id,
        'data-target': 'rosterCard',
      });

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
    this.rosterWrapEle.addEventListener('click', e => {
      if (e.target.dataset.target === 'rosterCard') {
        if (this.options.allowMultiSelect) {
          if (!e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            this.selectedConsumers[e.target.dataset.id] = e.target;
          } else {
            e.target.classList.remove('selected');
            delete this.selectedConsumers[e.target.dataset.id];
          }
        } else {
          if (e.target.classList.contains('selected')) {
            e.target.classList.remove('selected');
            delete this.selectedConsumers[e.target.dataset.id];
          } else {
            for (consumer in this.selectedConsumers) {
              this.selectedConsumers[consumer].classList.remove('selected');
              delete this.selectedConsumers[consumer];
            }

            e.target.classList.add('selected');
            this.selectedConsumers[e.target.dataset.id] = e.target;
          }
        }

        this.options.onConsumerSelect(Object.keys(this.selectedConsumers));
      }
    });
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
  RosterPicker.prototype.fetchConsumers = async function () {
    try {
      const data = await _UTIL.fetchData('getConsumersByGroupJSON', {
        // groupCode: 'CAS' for caseload only
        groupCode: 'ALL',
        retrieveId: '0',
        serviceDate: '2023-10-11',
        daysBackDate: '2023-07-03',
      });
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
