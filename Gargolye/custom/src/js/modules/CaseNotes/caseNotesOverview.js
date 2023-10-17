const CaseNotesOverview = (() => {
  // Session Data
  let caseLoadOnly;
  let viewEntered;
  let reviewGroups = {};
  let reviewConsumers = [];
  // Data from fetch
  let caseLoadRestrictions;
  let caseLoadReviewData = [];
  // DOM
  let overviewWrap;
  let overviewSearch;
  let overviewCardsWrap;

  // UTILS
  //--------------------------------------------------
  function setGroupsAndTableConsumers(data) {
    // GROUPING
    if (data.numberInGroup !== '1') {
      const groupNoteId = data.groupnoteid.split('.')[0];
      const consumerId = data.consumerid.split('.')[0];
      const name = `${data.lastname}, ${data.firstname}`;

      reviewGroups[groupNoteId] = reviewGroups[groupNoteId] ?? {};
      reviewGroups[groupNoteId][consumerId] = name;
    }

    // TABLE CONSUMERS
    reviewConsumers.push({
      id: data.casenoteid.split('.')[0],
      FirstName: data.firstname,
      LastName: data.lastname,
    });
  }

  // DATA
  //--------------------------------------------------

  async function init() {
    caseLoadOnly = $.session.CaseNotesCaseloadRestrictions;
    viewEntered = $.session.CaseNotesViewEntered;

    if (caseLoadOnly) {
      caseLoadRestrictions = await _UTIL.fetchData('getCaseLoadRestriction');
      caseLoadRestrictions = caseLoadRestrictions.getCaseLoadRestrictionResult;
    }

    caseLoadReviewData = await _UTIL.fetchData('caseNotesFilteredSearchJSON', {
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
    caseLoadReviewData = caseLoadReviewData.caseNotesFilteredSearchJSONResult;
    caseLoadReviewData = caseLoadReviewData.filter(data => {
      setGroupsAndTableConsumers(data);

      // For VIEW ENTERED & CASELOAD ONLY
      if (viewEntered && caseLoadOnly) {
        const enteredByUser = data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
        const onCaseload = caseLoadRestriction.some(
          cl => cl.id.toUpperCase() === data.consumerid.split('.')[0].toUpperCase(),
        );
        return enteredByUser || onCaseload;
      }

      // For VIEW ENTERED only
      if (viewEntered) {
        return data.enteredby.toUpperCase() === $.session.UserId.toUpperCase();
      }

      // For CASELOAD ONLY
      if (caseLoadOnly) {
        return caseLoadRestriction.some(cl => cl.id === data.consumerid.split('.')[0]);
      }

      return true; // If no conditions met, return the data as is
    });
  }

  // MAIN
  //--------------------------------------------------
  function populate() {
    caseLoadReviewData.forEach(rd => {
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
      const enteredBy = `${rd.enteredby} (lastname, firstname)`; // this is user name as of now
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
      mostRecentUpdate = `${mostRecentUpdate[0]}, ${mostRecentUpdate[1]} at ${mostRecentUpdate[2]}`;

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
      const noteTextEle = _DOM.createElement('p', { class: 'timeSpan', text: note });
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

      overviewCardsWrap.appendChild(overviewCard);
    });
  }

  function build() {
    overviewSearch = new Input({
      type: 'search',
      id: 'overviewSearch',
      name: 'overviewSearch',
      placeholder: 'Search...',
    });
    overviewSearch.build();

    overviewCardsWrap = _DOM.createElement('div', { class: 'overviewCardsWrap' });

    overviewWrap = _DOM.createElement('div', {
      class: 'caseNotesOverview',
      node: [overviewSearch.inputWrap, overviewCardsWrap],
    });

    return overviewWrap;
  }

  return {
    build,
  };
})();
