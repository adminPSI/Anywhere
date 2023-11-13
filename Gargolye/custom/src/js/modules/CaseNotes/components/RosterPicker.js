(function (global, factory) {
  global.RosterPicker = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    allowMultiSelect: false,
  };

  /**
   * Constructor function for creating a Roster Picker component.
   *
   * @constructor
   * @param {Object} options
   * @param {Boolean} [options.allowMultiSelect]
   * @returns {RosterPicker}
   */
  function RosterPicker(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    this.consumers = [];
    this.selectedConsumers = {};
    this.failedImageCache = new Set();
    this.groupCode = 'ALL';

    // DOM Ref
    this.rootElement = null;
    this.rosterWrapEle = null;
    this.rosterSearchInput = null;
    this.rosterCaseLoadInput = null;
    this.consumerCards = null;

    this._build();
  }

  /**
   * Builds the Roster Picker component HTML
   *
   * @function
   */
  RosterPicker.prototype._build = function () {
    this.rootElement = _DOM.createElement('div', { class: 'rosterPicker' });
    this.rosterWrapEle = _DOM.createElement('div', { class: 'rosterPicker__cardsWrap' });

    this.rosterSearchInput = new Input({
      type: 'search',
      id: 'rosterPickerSearch',
      name: 'rosterPickerSearch',
      placeholder: 'Search...',
    });

    this.rosterCaseLoadInput = new Checkbox({
      label: 'Only show caseload',
      id: 'caseloadtoggle',
      name: 'caseload',
      checked: false,
    });

    this.rosterSearchInput.build().renderTo(this.rootElement);
    this.rosterCaseLoadInput.build().renderTo(this.rootElement);
    this.rootElement.appendChild(this.rosterWrapEle);

    this._setupEvents();
  };

  /**
   * Sets up events for roster picker
   *
   * @function
   */
  RosterPicker.prototype._setupEvents = function () {
    this.rosterWrapEle.addEventListener('click', e => {
      if (e.target.dataset.target === 'pinCardIcon') {
        if (!e.target.parentNode.parentNode.classList.contains('pinned')) {
          e.target.parentNode.parentNode.classList.add('pinned');
        } else {
          e.target.parentNode.parentNode.classList.remove('pinned');
        }

        return;
      }
      if (e.target.dataset.target === 'rosterCard') {
        if (this.options.allowMultiSelect) {
          if (!e.target.parentNode.classList.contains('selected')) {
            e.target.parentNode.classList.add('selected');
            this.selectedConsumers[e.target.dataset.id] = e.target;
          } else {
            e.target.parentNode.classList.remove('selected');
            delete this.selectedConsumers[e.target.dataset.id];
          }
        } else {
          if (e.target.parentNode.classList.contains('selected')) {
            e.target.parentNode.classList.remove('selected');
            delete this.selectedConsumers[e.target.dataset.id];
          } else {
            this.clearSelectedConsumers();

            e.target.parentNode.classList.add('selected');
            this.selectedConsumers[e.target.dataset.id] = e.target;
          }
        }

        const customEvent = new CustomEvent('onConsumerSelect');
        this.rosterWrapEle.dispatchEvent(customEvent);

        return;
      }
    });

    this.rosterWrapEle.addEventListener('error', e => {
      if (e.target.tagName === 'IMG') {
        this.failedImageCache.add(e.target.src);
      }
    });

    this.rosterSearchInput.onKeyup(
      _UTIL.debounce(e => {
        this._filterConsumersOnSearch(e);
      }, 500),
    );

    this.rosterSearchInput.onChange(e => {
      this._filterConsumersOnSearch(e);
    });

    this.rosterCaseLoadInput.onChange(async e => {
      this.groupCode = e.target.checked ? 'CAS' : 'ALL';
      await this.fetchConsumers();
      this.populate();
    });
  };

  /**
   * Filters roster picker on search
   *
   * @function
   * @param {Event} e
   */
  RosterPicker.prototype._filterConsumersOnSearch = function (e) {
    this.consumers.forEach(consumer => {
      const firstName = consumer.FN.toLowerCase().trim();
      const middleName = consumer.MN.toLowerCase().trim();
      const lastName = consumer.LN.toLowerCase().trim();

      const nameCombinations = [
        `${firstName} ${middleName} ${lastName}`,
        `${lastName} ${firstName} ${middleName}`,
        `${firstName} ${lastName}`,
        `${lastName} ${firstName}`,
        `${firstName} ${middleName}`,
        `${middleName} ${lastName}`,
      ];

      const isMatch = nameCombinations.some(combo => combo.indexOf(e.target.value.toLowerCase()) !== -1);
      if (isMatch) {
        consumer.cardEle.parentNode.classList.remove('isClosed');
      } else {
        consumer.cardEle.parentNode.classList.add('isClosed');
      }
    });
  };

  /**
   * Populate consumer roster cards
   *
   * @function
   */
  RosterPicker.prototype.populate = function () {
    this.rosterWrapEle.innerHTML = '';

    this.consumers.forEach(c => {
      // ROSTER CARD
      const gridAnimationWrapper = _DOM.createElement('div', { class: 'rosterCardWrap' });

      const rosterCard = new RosterCard({
        consumerId: c.id,
        firstName: c.FN,
        middleName: c.MN,
        lastName: c.LN,
      });
      rosterCard.renderTo(gridAnimationWrapper);

      // PIN ICON
      const pinCardIcon = Icon.getIcon('pin');
      pinCardIcon.setAttribute('data-target', 'pinCardIcon');
      rosterCard.rootElement.appendChild(pinCardIcon);

      // BUILD
      this.rosterWrapEle.appendChild(gridAnimationWrapper);

      // SET REFERENCE TO DOM NODE ON DATA OBJ
      c.cardEle = rosterCard.rootElement;
    });
  };

  /**
   * On consumer select method
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  RosterPicker.prototype.onConsumerSelect = function (cbFunc) {
    this.rosterWrapEle.addEventListener('onConsumerSelect', () => {
      cbFunc(Object.keys(this.selectedConsumers));
    });
  };

  /**
   * Fetches consumers data by date, group and location
   *
   * @function
   * @param {Object} retrieveData
   */
  RosterPicker.prototype.fetchConsumers = async function () {
    try {
      const todaysDate = dates.getTodaysDateObj();
      todaysDate.setHours(0, 0, 0, 0);

      let daysBackDate = dates.subDays(todaysDate, $.session.defaultProgressNoteReviewDays);

      const data = await _UTIL.fetchData('getConsumersByGroupJSON', {
        groupCode: this.groupCode,
        retrieveId: '0',
        serviceDate: dates.formatISO(todaysDate, { representation: 'date' }),
        daysBackDate: daysBackDate,
      });
      this.consumers = data.getConsumersByGroupJSONResult;
    } catch (error) {
      console.log('uh oh something went horribly wrong :(', error.message);
    }

    return this;
  };

  /**
   * Updates the allowMultiSelect option property with given value
   *
   * @function
   * @param {Boolean} allowMultiSelect
   */
  RosterPicker.prototype.toggleMultiSelectOption = function (allowMultiSelect) {
    this.options.allowMultiSelect = allowMultiSelect;
  };

  /**
   * Removes selected consumer
   *
   * @function
   */
  RosterPicker.prototype.clearSelectedConsumers = function () {
    for (consumer in this.selectedConsumers) {
      this.selectedConsumers[consumer].parentNode.classList.remove('selected');
      delete this.selectedConsumers[consumer];
    }
  };

  /**
   * Renders the built Roster Picker component to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the roster picker to
   * @returns {RosterPicker} Returns the current instances for chaining
   */
  RosterPicker.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return RosterPicker;
});
