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
   * @constructor
   */
  function CaseNotesOverview() {
    // Data Init
    this.caseLoadOnly = $.session.CaseNotesCaseloadRestrictions;
    this.viewEntered = $.session.CaseNotesViewEntered;
    this.reviewGroups = {};
    this.reviewConsumers = [];

    this.caseLoadRestrictions;
    this.caseLoadReviewData = [];

    // DOM Ref
    this.overviewWrap;
    this.overviewSearch;
    this.overviewCardsWrap;
  }

  /**
   * @function
   * @returns {CaseNotesOverview} - Returns the current instances for chaining
   */
  CaseNotesOverview.prototype.build = function () {
    this.overviewWrap = _DOM.createElement('div', { class: 'caseNotesOverview' });

    this.overviewSearch = new Input({
      type: 'search',
      id: 'overviewSearch',
      placeholder: 'Search...',
    });

    this.overviewCardsWrap = _DOM.createElement('div', { class: 'overviewCardsWrap' });

    this.overviewSearch.build().renderTo(this.overviewWrap);
    this.overviewWrap.appendChild(this.overviewCardsWrap);

    return this;
  };

  /**
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
        const consumerFullName = `${rd.lastname}, ${rd.firstname}`;
        const location = rd.locationName;
        const service = rd.serviceName;
        const note = rd.caseNote;
        const starttime = UTIL.convertFromMilitary(rd.starttime);
        const endtime = UTIL.convertFromMilitary(rd.endtime);
        const timeDifference = _UTIL.getMilitaryTimeDifference(rd.starttime, rd.endtime);
        const mostRecentUpdate = formatMostRecentUpdateDate(rd.mostrecentupdate);
        const enteredBy = `${rd.enteredby} (${rd.originalUserFullName})`;
        const isConfidential = rd.confidential === 'Y' ? true : false;
        const attachmentCountGK = rd.attachcount;

        // Overview Card
        const overviewCard = _DOM.createElement('div', { class: 'overviewCard' });

        // Card Details
        const consumerNameEle = _DOM.createElement('p', { class: 'consumerName', text: name });

        //------------------------------------------------------------
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
      dateEnteredStart: dates.formatISO(selectedDate, { representation: 'date' }),
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
   * @param {Node} node - DOM node to render case notes overview to
   * @returns {CaseNotesOverview} - Returns the current instances for chaining
   */
  CaseNotesOverview.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.overviewWrap);
    }

    return this;
  };

  return CaseNotesOverview;
});
