(function (global, factory) {
  global.CaseNotesReviewTable = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Constructor function for creating the Case Notes Review Table component.
   *
   * @constructor
   * @returns {CaseNotesReviewTable}
   */
  function CaseNotesReviewTable(cnData) {
    // Data Init
    this.cnData = cnData;
    this.caseLoadOnly = $.session.CaseNotesCaseloadRestrictions;
    this.viewEntered = $.session.CaseNotesViewEntered;
    this.reviewGroups = {};
    this.reviewConsumers = [];

    this.caseLoadRestrictions = null;
    this.caseLoadReviewData = [];

    // DOM Ref

    this._build();
  }

  /**
   * @function
   */
  CaseNotesReviewTable.prototype._build = function () {
    this.rootElement = _DOM.createElement('div');

    this.reviewTable = new Table({
      data: {
        headings: [
          {
            text: 'Service Date',
            type: 'date',
          },
          {
            text: 'Start Time',
            type: 'time',
          },
          {
            text: 'End Time',
            type: 'time',
          },
          {
            text: 'Name',
            type: 'string',
          },
          {
            text: 'Created',
            type: 'date',
          },
          {
            text: 'User Updated',
            type: 'string',
          },
        ],
      },
    });

    this.reviewTable.renderTo(this.rootElement);
  };

  /**
   * @function
   */
  CaseNotesReviewTable.prototype.fetchData = async function (selectedDate) {
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
   * Renders Case Notes Review Table markup to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render case notes review table to
   * @returns {CaseNotesReviewTable} Returns the current instances for chaining
   */
  CaseNotesReviewTable.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return CaseNotesReviewTable;
});
