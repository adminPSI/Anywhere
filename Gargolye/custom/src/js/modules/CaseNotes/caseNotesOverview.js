/**
 * @constructor
 */
function CaseNotesOverview() {
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

  this.caseLoadReviewData.forEach(rd => {
    // DATA
    //---------------
    const name = `${rd.lastname}, ${rd.firstname}`;
    const location = rd.locationName;
    const service = rd.serviceName;
    const note = rd.caseNote;
    const starttime = UTIL.convertFromMilitary(rd.starttime);
    const endtime = UTIL.convertFromMilitary(rd.endtime);
    const timeSpan = `${starttime} - ${endtime}`;
    const timeDifference = _UTIL.getMilitaryTimeDifference(rd.starttime, rd.endtime);
    const enteredBy = `${rd.enteredby} (${rd.originalUserFullName})`;
    const isConfidential = rd.confidential === 'Y' ? true : false;
    let mostRecentUpdate = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      // or just
      // dateStyle: 'short',
      // timeStyle: 'short',
    }).format(new Date(rd.mostrecentupdate));
    mostRecentUpdate = mostRecentUpdate.split(', ');
    mostRecentUpdate = `${mostRecentUpdate[0].substring(0, 3)}, ${mostRecentUpdate[1]} at ${mostRecentUpdate[2]}`;

    //* GK ONLY
    const attachmentCount = rd.attachcount; // if > 0 then will show gree attachment icon

    // DOM
    //---------------
    // card items
    const consumerNameEle = _DOM.createElement('p', { class: 'consumerName', text: name });
    const serviceInfoEle = _DOM.createElement('p', {
      class: 'serviceInfoEle',
      html: `${service} | ${location}`,
    });
    const noteTextEle = _DOM.createElement('p', { class: 'noteText', text: note });
    const timeSpanEle = _DOM.createElement('p', { class: 'timeSpan', text: timeSpan });
    const totalTimeEle = _DOM.createElement('p', { class: 'timeDifference', text: timeDifference });
    const lastEditEle = _DOM.createElement('p', {
      class: 'lastEdit',
      html: `<span>Last Edit:</span> ${mostRecentUpdate}`,
    });
    const enteredByEle = _DOM.createElement('p', {
      class: 'enteredBy',
      html: `<span>Entered By:</span> ${enteredBy}`,
    });
    const editButton = new Button({
      text: 'edit',
      style: 'primary',
      styleType: 'contained',
    });
    const deleteButton = new Button({
      text: 'delete',
      style: 'danger',
      styleType: 'outlined',
    });

    // card layout
    const cardLeft = _DOM.createElement('div', {
      class: 'overviewCard__Left',
      node: [timeSpanEle, totalTimeEle, editButton.button, deleteButton.button],
    });
    const cardCenter = _DOM.createElement('div', {
      class: 'overviewCard__Center',
      node: [consumerNameEle, serviceInfoEle, noteTextEle],
    });
    const cardRight = _DOM.createElement('div', { class: 'overviewCard__Right', node: [lastEditEle, enteredByEle] });

    const overviewCard = _DOM.createElement('div', {
      class: 'overviewCard',
      node: [cardLeft, cardCenter, cardRight],
    });

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
 * Renders Case Notes Overview makrup to the specified DOM node.
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
