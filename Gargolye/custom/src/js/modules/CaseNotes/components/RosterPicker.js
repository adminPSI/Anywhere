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
   * Displays a list of consumers, contains logic for selecting consumer(s).
   * Use onConsumerSelect passed in {options} to get array of selected consumer IDs.
   *
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
    this.failedImageCache = new Set();
    this.groupCode = 'ALL';

    // DOM Ref
    this.rosterPickerEle = null;
    this.rosterWrapEle = null;
    this.rosterSearchEle = null;
    this.rosterCaseLoadInput = null;
    this.consumerCards = null;
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
      id: 'rosterPickerSearch',
      name: 'rosterPickerSearch',
      placeholder: 'Search...',
    });

    this.rosterCaseLoadInput = new Input({
      type: 'checkbox',
      label: 'Only show caseload',
      id: 'caseloadtoggle',
      name: 'caseload',
      checked: false,
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
    this.rosterWrapEle.innerHTML = '';

    this.consumers.forEach(c => {
      // ROSTER CARD
      const gridAnimationWrapper = _DOM.createElement('div', { class: 'visibilityAnimationWrapper' });
      const rosterCard = _DOM.createElement('div', {
        class: 'rosterCard',
        'data-id': c.id,
        'data-target': 'rosterCard',
      });

      // PORTRAIT
      const imgSource = `./images/portraits/${c.id}.png?${new Date().setHours(0, 0, 0, 0)}`;
      const defaultImgSource = `this.src='./images/new-icons/default.jpg'`;
      const image = _DOM.createElement('img', {
        src: this.failedImageCache.has(imgSource) ? defaultImgSource : imgSource,
        onerror: defaultImgSource,
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

      // BUILD
      rosterCard.appendChild(portrait);
      rosterCard.appendChild(details);
      gridAnimationWrapper.appendChild(rosterCard);

      this.rosterWrapEle.appendChild(gridAnimationWrapper);

      // SET REFERENCE TO DOM NODE ON DATA OBJ
      c.cardEle = rosterCard;
    });
  };

  /**
   * Sets up events for navigation
   *
   * @function
   */
  RosterPicker.prototype.setupEvents = function () {
    this.rosterWrapEle.addEventListener('click', e => {
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
            for (consumer in this.selectedConsumers) {
              this.selectedConsumers[consumer].classList.remove('selected');
              delete this.selectedConsumers[consumer];
            }

            e.target.parentNode.classList.add('selected');
            this.selectedConsumers[e.target.dataset.id] = e.target;
          }
        }

        this.options.onConsumerSelect(Object.keys(this.selectedConsumers));
      }
    });

    this.rosterWrapEle.addEventListener('error', e => {
      if (e.target.tagName === 'IMG') {
        this.failedImageCache.add(e.target.src);
      }
    });

    this.rosterSearchInput.onKeyup(
      _UTIL.debounce(e => {
        this.consumers.forEach(consumer => {
          const firstName = consumer.FN.toLowerCase();
          const middleName = consumer.MN.toLowerCase();
          const lastName = consumer.LN.toLowerCase();

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
      }, 500),
    );

    this.rosterCaseLoadInput.onChange(async e => {
      this.groupCode = e.target.checked ? 'CAS' : 'ALL';
      await this.fetchConsumers();
      this.populate();
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
