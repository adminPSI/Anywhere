(function (global, factory) {
  global.CaseNotesOverview = factory();
})(this, function () {
  function buildMostRecentUpdateElement(dateObj) {
    let mostRecentUpdate = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
    }).format(new Date(dateObj));
    mostRecentUpdate = mostRecentUpdate.split(', ');
    mostRecentUpdate = `${mostRecentUpdate[0].substring(0, 3)}, ${mostRecentUpdate[1]} at ${mostRecentUpdate[2]}`;
    return _DOM.createElement('p', { class: 'noteText', text: mostRecentUpdate });
  }
  function buildEnteredByElement(enteredBy, originalUserFullName) {
    return _DOM.createElement('div', {
      class: 'withLabelWrap',
      html: `<p class="enteredBy withLabel">${enteredBy} (${originalUserFullName})</p>`,
    });
  }
  function buildLocationElement(location) {
    return _DOM.createElement('div', {
      class: 'withLabelWrap',
      html: `<p class="location withLabel">${location}</p>`,
    });
  }
  function buildStartTimeElement(dirtyStart) {
    const time = UTIL.convertFromMilitary(dirtyStart);
    return _DOM.createElement('div', {
      class: 'withLabelWrap',
      html: `
        <p class="startTime withLabel">
          <span>${time.split(' ')[0]}</span>
          <span>${time.split(' ')[1]}</span>
        </p>
      `,
    });
  }
  function buildEndTimeElement(dirtyEnd) {
    const time = UTIL.convertFromMilitary(dirtyEnd);
    return _DOM.createElement('div', {
      class: 'withLabelWrap',
      html: `
        <p class="endTime withLabel">
          <span>${time.split(' ')[0]}</span>
          <span>${time.split(' ')[1]}</span>
        </p>
      `,
    });
  }
  function buildTimeDiffElement(dirtyStart, dirtyEnd) {
    const timDiff = dates.getMilitaryTimeDifference(dirtyStart, dirtyEnd, true);
    return _DOM.createElement('div', {
      class: 'withLabelWrap',
      html: `<p class="duration withLabel">${timDiff}</p>`,
    });
  }
  function buildConsumerElement(id, firstname, lastname) {
    const consumerFullName = `${lastname}, ${firstname}`;

    const consumerNameEle = _DOM.createElement('div', {
      class: 'consumer',
      html: `<p class="name">${consumerFullName}</p>`,
    });
    const portrait = new Portrait(id);
    portrait.renderTo(consumerNameEle);

    return consumerNameEle;
  }
  function buildServiceInfoElement(mainService, service) {
    return _DOM.createElement('p', {
      class: 'serviceInfo',
      text: `${mainService} - ${service}`,
    });
  }
  function buildNoteElement(noteText) {
    const note = noteText.length > 100 ? `${noteText.replace(/(\r\n|\n|\r)/gm, '').slice(0, 100)}...` : noteText;
    return _DOM.createElement('p', { class: 'noteText', text: note });
  }

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Constructor function for creating the Case Notes Overview component.
   *
   * @constructor
   * @returns {CaseNotesOverview}
   */
  function CaseNotesOverview(cnData) {
    // Data Init
    this.cnData = cnData;
    this.caseLoadOnly = $.session.CaseNotesCaseloadRestrictions;
    this.viewEntered = $.session.CaseNotesViewEntered;
    this.reviewGroups = {};
    this.reviewConsumers = [];
    this.showAllNotes = false;

    this.caseLoadRestrictions = null;
    this.caseLoadReviewData = [];

    // DOM Ref
    this.overviewWrap = null;
    this.overviewSearch = null;
    this.showAllNotesToggle = null;
    this.overviewCardsWrap = null;
    this.overviewCards = {};

    this._init();
    this._build();
    this._setupEvents();
  }

  /**
   * @function
   */
  CaseNotesOverview.prototype._init = function () {
    const showAllNotesLS = _UTIL.localStorageHandler.get('casenotes-showAllNotes');
    this.showAllNotes = showAllNotesLS === 'Y' ? true : false;
  };

  /**
   * Builds the CaseNotesOverview component HTML
   *
   * @function
   */
  CaseNotesOverview.prototype._build = function () {
    this.overviewWrap = _DOM.createElement('div', { class: 'caseNotesOverview' });

    // Header
    //---------------------------------
    const overviewHeader = _DOM.createElement('div', { class: 'caseNotesOverview__header' });
    this.overviewWrap.appendChild(overviewHeader);

    // search
    //---------------------------------
    this.overviewSearch = new Input({
      type: 'search',
      id: 'overviewSearch',
      placeholder: 'Search...',
    });
    this.overviewSearch.renderTo(overviewHeader);

    // all notes toggle
    //---------------------------------
    this.showAllNotesToggle = new Checkbox({
      id: 'notesView',
      label: 'My Notes',
      toggle: true,
      checked: !this.showAllNotes,
    });
    this.showAllNotesToggle.renderTo(overviewHeader);

    // Cards
    //---------------------------------
    this.overviewCardsWrap = _DOM.createElement('div', { class: 'caseNotesOverview__cardsWrap' });
    this.overviewWrap.appendChild(this.overviewCardsWrap);
  };

  /**
   * @function
   */
  CaseNotesOverview.prototype._setupEvents = function () {
    this.showAllNotesToggle.onChange(async e => {
      this.showAllNotes = e.target.checked ? true : false;
      _UTIL.localStorageHandler.set('casenotes-showAllNotes', this.showAllNotes ? 'Y' : 'N');

      await this.fetchData();

      this.populate();
    });
  };

  /**
   * Populates the overview page
   *
   * @function
   */
  CaseNotesOverview.prototype.populate = function () {
    this.overviewCardsWrap.innerHTML = '';

    this.caseLoadReviewData
      .sort((a, b) => {
        if (a.starttime < b.starttime) return 1;
        if (a.starttime > b.starttime) return -1;
        if (a.endtime < b.endtime) return 1;
        if (a.endtime > b.endtime) return -1;
        return 0;
      })
      .forEach(rd => {
        //console.table(rd);
        // Review Data
        //---------------------------------
        const caseNoteId = rd.casenoteid.split('.')[0];
        const consumerId = rd.consumerid.split('.')[0];
        const mainService = this.cnData.getMainServiceCodeNameById(rd.mainbillingorservicecodeid.split('.')[0]);
        const isConfidential = rd.confidential === 'Y' ? true : false;
        const attachmentCountGK = rd.attachcount;

        // Overview Card
        //---------------------------------
        const overviewCard = _DOM.createElement('div', {
          class: 'caseNotesOverview__overviewCard',
          'data-noteid': caseNoteId,
        });

        // IDK YET??
        const mostRecentUpdateEle = buildMostRecentUpdateElement(rd.mostrecentupdate);
        const enteredByEle = buildEnteredByElement(rd.enteredby, rd.originalUserFullName);

        // BUTTONS
        const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
        const editButton = new Button({
          text: 'edit',
          style: 'primary',
          styleType: 'contained',
          icon: 'edit',
        });
        const deleteButton = new Button({
          text: 'delete',
          style: 'danger',
          styleType: 'outlined',
          icon: 'delete',
        });
        editButton.renderTo(btnWrap);
        deleteButton.renderTo(btnWrap);
        editButton.onClick(e => {
          const customEvent = new CustomEvent('onCardEdit', {
            bubbles: true,
            cancelable: true,
            detail: { caseNoteId },
          });
          this.overviewCardsWrap.dispatchEvent(customEvent);
        });
        deleteButton.onClick(e => {
          const customEvent = new CustomEvent('onCardDelete', {
            bubbles: true,
            cancelable: true,
            detail: { caseNoteId },
          });
          this.overviewCardsWrap.dispatchEvent(customEvent);
        });

        // TOP
        const startTimeEle = buildStartTimeElement(rd.starttime);
        const endTimeEle = buildEndTimeElement(rd.endtime);
        const timeDurationEle = buildTimeDiffElement(rd.starttime, rd.endtime);
        const locationEle = buildLocationElement(rd.locationName);
        overviewCard.appendChild(startTimeEle);
        overviewCard.appendChild(endTimeEle);
        overviewCard.appendChild(timeDurationEle);
        overviewCard.appendChild(locationEle);
        overviewCard.appendChild(btnWrap);

        // MAIN
        const consumerNameEle = buildConsumerElement(consumerId, rd.firstname, rd.lastname);
        const serviceInfoEle = buildServiceInfoElement(mainService, rd.serviceName, rd.locationName);
        const noteTextEle = buildNoteElement(rd.caseNote);
        overviewCard.appendChild(consumerNameEle);
        overviewCard.appendChild(serviceInfoEle);
        overviewCard.appendChild(noteTextEle);
        // overviewCard.appendChild(enteredByEle);
        // overviewCard.appendChild(mostRecentUpdateEle);

        //---------------------------------
        this.overviewCards[caseNoteId] = overviewCard;
        this.overviewCardsWrap.appendChild(overviewCard);
      });
  };

  /**
   * @function
   */
  CaseNotesOverview.prototype.fetchData = async function (selectedDate) {
    if (this.caseLoadOnly) {
      const restrictionsResponse = await _UTIL.fetchData('getCaseLoadRestriction');
      this.caseLoadRestrictions = restrictionsResponse.getCaseLoadRestrictionResult;
    }

    const filteredSearchResponse = await _UTIL.fetchData('caseNotesFilteredSearchJSON', {
      applicationName: $.session.applicationName,
      attachments: '%',
      billerId: this.showAllNotes ? '%' : $.session.PeopleId,
      billingCode: '%',
      billed: '%',
      consumerId: '%',
      contact: '%',
      confidential: '%',
      corrected: '%',
      dateEnteredStart: '1900-01-01',
      dateEnteredEnd: dates.formatISO(dates.getTodaysDateObj(), { representation: 'date' }),
      location: '%',
      need: '%',
      noteText: '%%%',
      overlaps: 'N',
      reviewStatus: '%',
      service: '%',
      serviceStartDate: dates.formatISO(selectedDate, { representation: 'date' }),
      serviceEndDate: dates.formatISO(selectedDate, { representation: 'date' }),
    });

    this.caseLoadReviewData = filteredSearchResponse.caseNotesFilteredSearchJSONResult.filter(data => {
      // GROUPING
      if (data.numberInGroup !== '1') {
        const groupNoteId = data.groupnoteid.split('.')[0];
        const consumerId = data.consumerid.split('.')[0];
        const name = `${data.lastname}, ${data.firstname}`;

        this.reviewGroups[groupNoteId] = this.reviewGroups[groupNoteId] ?? {};
        this.reviewGroups[groupNoteId][consumerId] = name;
      }

      // TABLE CONSUMERS
      this.reviewConsumers.push({
        id: data.casenoteid.split('.')[0],
        FirstName: data.firstname,
        LastName: data.lastname,
      });

      // FOR VIEW ENTERED & CASELOAD ONLY
      if (this.viewEntered && this.caseLoadOnly) {
        const enteredByUser = data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
        const onCaseload = this.caseLoadRestrictions.some(
          cl => cl.id.toUpperCase() === data.consumerid.split('.')[0].toUpperCase(),
        );
        return enteredByUser || onCaseload;
      }

      // FOR VIEW ENTERED only
      if (this.viewEntered) {
        return data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
      }

      // FOR CASELOAD ONLY
      if (this.caseLoadOnly) {
        return this.caseLoadRestrictions.some(cl => cl.id === data.consumerid.split('.')[0]);
      }

      return true; // If no conditions met, return the data as is
    });
  };

  /**
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  CaseNotesOverview.prototype.onCardEdit = function (cbFunc) {
    this.overviewCardsWrap.addEventListener('onCardEdit', e => {
      cbFunc(e.detail.caseNoteId);
    });
  };

  /**
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  CaseNotesOverview.prototype.onCardDelete = function (cbFunc) {
    this.overviewCardsWrap.addEventListener('onCardDelete', e => {
      // remove data
      const noteId = e.detail.caseNoteId;
      const index = this.caseLoadReviewData.findIndex(obj => obj.casenoteid === noteId);
      this.caseLoadReviewData.splice(index, 1);

      // remove card
      this.overviewCards[noteId].remove();
      delete this.overviewCards[noteId];

      cbFunc(noteId);
    });
  };

  /**
   * Renders Case Notes Overview markup to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render case notes overview to
   * @returns {CaseNotesOverview} Returns the current instances for chaining
   */
  CaseNotesOverview.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.overviewWrap);
    }

    return this;
  };

  return CaseNotesOverview;
});
