(function (global, factory) {
  global.CaseNotesOverview = factory();
})(this, function () {
  function formatMostRecentUpdateDate(dateObj) {
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

    this._build();
  }

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
    this.overviewSearch.build().renderTo(overviewHeader);

    // all notes toggle
    //---------------------------------
    this.showAllNotesToggle = new Checkbox({
      id: 'notesView',
      label: 'My Notes',
      toggle: true,
      checked: !this.showAllNotes,
    });
    this.showAllNotesToggle.build().renderTo(overviewHeader);

    // Cards
    //---------------------------------
    this.overviewCardsWrap = _DOM.createElement('div', { class: 'caseNotesOverview__overview' });
    this.overviewWrap.appendChild(this.overviewCardsWrap);

    return this;
  };

  CaseNotesOverview.prototype.setupEvents = function () {
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
        // Review Data
        //---------------------------------
        const consumerFullName = `${rd.lastname}, ${rd.firstname}`;
        const mainService = cnData.getMainServiceCodeNameById(rd.mainbillingorservicecodeid);
        const location = rd.locationName;
        const service = rd.serviceName;
        const note = `${rd.caseNote.replace(/(\r\n|\n|\r)/gm, '').slice(0, 100)}...`;
        const starttime = UTIL.convertFromMilitary(rd.starttime);
        const endtime = UTIL.convertFromMilitary(rd.endtime);
        const timeDifference = dates.getMilitaryTimeDifference(rd.starttime, rd.endtime);
        const mostRecentUpdate = formatMostRecentUpdateDate(rd.mostrecentupdate);
        const enteredBy = `${rd.enteredby} (${rd.originalUserFullName})`;
        const isConfidential = rd.confidential === 'Y' ? true : false;
        const attachmentCountGK = rd.attachcount;

        // Overview Card
        //---------------------------------
        const overviewCard = _DOM.createElement('div', { class: 'caseNotesOverview__overviewCard' });

        const startTimeEle = _DOM.createElement('div', {
          class: 'withLabelWrap',
          html: `<p class="startTime withLabel">${starttime}</p>`,
        });
        const endTimeEle = _DOM.createElement('div', {
          class: 'withLabelWrap',
          html: `<p class="endTime withLabel">${endtime}</p>`,
        });
        const timeDurationEle = _DOM.createElement('div', {
          class: 'withLabelWrap',
          html: `<p class="duration withLabel">${timeDifference}</p>`,
        });

        const consumerNameEle = _DOM.createElement('div', {
          class: 'consumer',
          html: `<p class="name">${consumerFullName}</p>`,
        });
        const portrait = new Portrait(rd.consumerid.split('.')[0]);
        portrait.renderTo(consumerNameEle);

        const serviceInfoEle = _DOM.createElement('p', {
          class: 'serviceInfo',
          text: `${mainService} - ${service} | ${location}`,
        });
        const noteTextEle = _DOM.createElement('p', { class: 'noteText', text: note });

        const enteredByEle = _DOM.createElement('div', {
          class: 'withLabelWrap',
          html: `<p class="enteredBy withLabel">${enteredBy}</p>`,
        });

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

        overviewCard.appendChild(startTimeEle);
        overviewCard.appendChild(endTimeEle);
        overviewCard.appendChild(timeDurationEle);
        overviewCard.appendChild(consumerNameEle);
        overviewCard.appendChild(serviceInfoEle);
        overviewCard.appendChild(noteTextEle);
        overviewCard.appendChild(btnWrap);

        //---------------------------------

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
      billerId: $.session.PeopleId,
      billingCode: '%',
      billed: '%',
      consumerId: '%',
      contact: '%',
      confidential: '%',
      corrected: '%',
      dateEnteredStart: '1900-01-01',
      dateEnteredEnd: dates.formatISO(selectedDate, { representation: 'date' }),
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
