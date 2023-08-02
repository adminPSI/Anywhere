var itDetailsSection = (function () {
  // DOM
  //---------------------
  var section;
  var sectionBody;
  // DATA
  //---------------------
  var reviewData;
  var involvementTypes;
  var incidentLocations;
  var categories;
  var employeeNames;
  // Values
  //---------------------
  var incidentDate;
  var incidentTime;
  var reportedDate;
  var reportedTime;
  var categoryId;
  var locationId;
  var summaryText;
  var actionText;
  var preventionText;
  var factorsText;
  // Inputs
  var incidentDateInput;
  var incidentTimeInput;
  var reportedDateInput;
  var reportedTimeInput;

  var summaryTextarea;
  var actionTextarea;
  var preventionTextarea;
  var causeTextarea;
  var categoryDropdown;
  var locationDetailDropdown;

  function getSectionData() {
    categories = incidentTracking.getCategories();
    incidentLocations = incidentTracking.getLocations();
  }
  function setSectionValues() {
    if (reviewData) {
      var rd = reviewData[0];
      // reviewData = {iDate, iTime, rDate, rTime, category, location, summary, action, factor}
      incidentDate = rd.incidentDate ? UTIL.formatDateToIso(rd.incidentDate.split(' ')[0]) : '';
      incidentTime = rd.incidentTime ? rd.incidentTime : '';
      reportedDate = rd.reportedDate ? UTIL.formatDateToIso(rd.reportedDate.split(' ')[0]) : '';
      reportedTime = rd.reportedTime ? rd.reportedTime : '';
      categoryId = rd.subcategoryId ? rd.subcategoryId : '';
      locationId = rd.locationId ? rd.locationId : '';
      summaryText = rd.summary ? rd.summary : '';
      actionText = rd.note ? rd.note : '';
      preventionText = rd.prevention ? rd.prevention : '';
      factorsText = rd.contributingFactor ? rd.contributingFactor : '';
    } else {
      var defaultCategory = categories.filter(c => c.incidentCategory === 'New Incident');
      $.session.incidentTrackingPopulateIncidentDate === 'Y'
        ? (incidentDate = UTIL.getTodaysDate())
        : (incidentDate = '');
      $.session.incidentTrackingPopulateIncidentTime === 'Y'
        ? (incidentTime = UTIL.getCurrentTime())
        : (incidentTime = '');
      $.session.incidentTrackingPopulateReportedDate === 'Y'
        ? (reportedDate = UTIL.getTodaysDate())
        : (reportedDate = '');
      $.session.incidentTrackingPopulateReportedTime === 'Y'
        ? (reportedTime = UTIL.getCurrentTime())
        : (reportedTime = '');
      categoryId = defaultCategory[0].subcategoryId;
      locationId = '';
      summaryText = '';
      actionText = '';
      preventionText = '';
      factorsText = '';
    }
  }
  function showTextErrorPopup() {
    const errorPop = POPUP.build({
      classNames: 'textErrorPopup',
    });

    const message = document.createElement('p');
    message.innerText = `You are not allowed to edit previously entered text.`;

    var okButton = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(errorPop);
      },
    });

    errorPop.appendChild(message);
    errorPop.appendChild(okButton);

    POPUP.show(errorPop);
  }

  // Section
  //-----------------------------------------------
  function buildDateTimeInputs() {
    var incidentDateTimeWrap = document.createElement('div');
    var reportedDateTimeWrap = document.createElement('div');
    incidentDateTimeWrap.classList.add('incidentDateTimeWrap');
    reportedDateTimeWrap.classList.add('reportedDateTimeWrap');

    incidentDateInput = input.build({
      label: 'Incident Date',
      id: 'incidentDateInpt',
      type: 'date',
      style: 'secondary',
      classNames: ['iDate'],
      attributes: [{ key: 'max', value: '9999-12-31' }],
      value: incidentDate,
    });
    incidentTimeInput = input.build({
      label: 'Incident Time',
      type: 'time',
      style: 'secondary',
      classNames: ['iTime'],
      value: incidentTime,
    });
    reportedDateInput = input.build({
      label: 'Reported Date',
      type: 'date',
      style: 'secondary',
      classNames: ['rDate'],
      attributes: [{ key: 'max', value: '9999-12-31' }],
      value: reportedDate,
    });
    reportedTimeInput = input.build({
      label: 'Reported Time',
      type: 'time',
      style: 'secondary',
      classNames: ['rTime'],
      value: reportedTime,
    });

    incidentDateTimeWrap.appendChild(incidentDateInput);
    incidentDateTimeWrap.appendChild(incidentTimeInput);
    reportedDateTimeWrap.appendChild(reportedDateInput);
    reportedDateTimeWrap.appendChild(reportedTimeInput);

    return {
      incidentDateTime: incidentDateTimeWrap,
      reportedDateTime: reportedDateTimeWrap,
    };
  }
  function buildDropdowns() {
    var dropdownWrap = document.createElement('div');
    dropdownWrap.classList.add('dropdownWrap');
    // build markup
    categoryDropdown = dropdown.build({
      className: 'categoryDropdown',
      label: 'Incident Category',
    });
    locationDetailDropdown = dropdown.build({
      className: 'locationDropdown',
      label: 'Location Detail',
    });

    // get/set data
    var categoryData = categories.map(c => {
      if (c.incidentCategory === 'New Incident') {
        categoryId;
      }
      return {
        value: c.subcategoryId,
        text: c.incidentCategory,
      };
    });
    var locationData = incidentLocations.map(l => {
      return {
        value: l.itLocationId,
        text: l.description,
      };
    });

    var defaultDropdownOption = { value: '', text: '' };
    locationData.unshift(defaultDropdownOption);

    // populate
    dropdown.populate(categoryDropdown, categoryData, categoryId);
    dropdown.populate(locationDetailDropdown, locationData, locationId);

    // append
    dropdownWrap.appendChild(categoryDropdown);
    dropdownWrap.appendChild(locationDetailDropdown);

    return dropdownWrap;
  }
  function buildTextAreas() {
    summaryTextarea = input.build({
      label: 'Summary Of Incident',
      style: 'secondary',
      type: 'textarea',
      classNames: ['autosize', 'summary'],
      value: summaryText,
    });
    actionTextarea = input.build({
      label: 'Immediate Action',
      style: 'secondary',
      type: 'textarea',
      classNames: ['autosize', 'action'],
      value: actionText,
    });
    preventionTextarea = input.build({
      label: 'Prevention Plan',
      style: 'secondary',
      type: 'textarea',
      classNames: ['autosize', 'prevention'],
      value: preventionText,
    });
    causeTextarea = input.build({
      label: 'Cause & Contributing Factors',
      style: 'secondary',
      type: 'textarea',
      classNames: ['autosize', 'factors'],
      value: factorsText,
    });

    return {
      summary: summaryTextarea,
      action: actionTextarea,
      prevention: preventionTextarea,
      cause: causeTextarea,
    };
  }

  function buildSection(options, data) {
    var opts = options;
    reviewData = data;

    section = document.createElement('div');
    section.classList.add('incidentSection');
    section.setAttribute('data-card-page', 'details');
    section.setAttribute('data-page-num', opts.pageNumber);

    var heading = document.createElement('div');
    heading.classList.add('incidentSection__header');
    heading.innerHTML = `<h3>Incident Details</h3>`;

    sectionBody = document.createElement('div');
    sectionBody.classList.add('incidentSection__body');

    getSectionData();
    setSectionValues();

    var dateTimeInputs = buildDateTimeInputs();
    var dropdowns = buildDropdowns();
    var textAreas = buildTextAreas();

    sectionBody.appendChild(dateTimeInputs.incidentDateTime);
    sectionBody.appendChild(dateTimeInputs.reportedDateTime);
    sectionBody.appendChild(dropdowns);
    sectionBody.appendChild(textAreas.summary);
    sectionBody.appendChild(textAreas.action);

    if ($.session.incidentTrackingShowPreventionPlan) sectionBody.appendChild(textAreas.prevention);
    if ($.session.incidentTrackingShowCauseAndContributingFactors)
      sectionBody.appendChild(textAreas.cause);

    section.appendChild(heading);
    section.appendChild(sectionBody);

    setupEvents();
    incidentCard.checkEntireIncidentCardforErrors();

    return section;
  }

  function setupEvents() {
    incidentDateInput.addEventListener('change', e => {
      incidentDate = e.target.value;
      incidentCard.checkEntireIncidentCardforErrors();
    });
    incidentTimeInput.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });
    reportedDateInput.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });
    reportedTimeInput.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });

    // $.session.updateIncidentSummaryText
    // $.session.updateIncidentActionText
    // $.session.updateIncidentPreventionText
    // $.session.updateIncidentCauseText

    summaryTextarea.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });

    summaryTextarea.addEventListener('change', e => {
      if ($.session.updateIncidentSummaryText) {
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      const newText = e.target.value;
      if (!newText.includes(summaryText)) {
        summaryTextarea.classList.add('error');
        incidentCard.checkEntireIncidentCardforErrors();
        showTextErrorPopup();
      }
    });
    actionTextarea.addEventListener('change', e => {
      if ($.session.updateIncidentActionText) {
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      const newText = e.target.value;
      if (!newText.includes(actionText)) {
        summaryTextarea.classList.add('error');
        incidentCard.checkEntireIncidentCardforErrors();
        showTextErrorPopup();
      }
    });
    preventionTextarea.addEventListener('change', e => {
      if ($.session.updateIncidentPreventionText) {
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      const newText = e.target.value;
      if (!newText.includes(preventionText)) {
        summaryTextarea.classList.add('error');
        incidentCard.checkEntireIncidentCardforErrors();
        showTextErrorPopup();
      }
    });
    causeTextarea.addEventListener('change', e => {
      if ($.session.updateIncidentCauseText) {
        incidentCard.checkEntireIncidentCardforErrors();
        return;
      }

      const newText = e.target.value;
      if (!newText.includes(causeText)) {
        summaryTextarea.classList.add('error');
        incidentCard.checkEntireIncidentCardforErrors();
        showTextErrorPopup();
      }
    });
    categoryDropdown.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });
    locationDetailDropdown.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });
  }

  function checkRequiredFields() {
    var incidentDateInpt = document.getElementById('incidentDateInpt');

    if (incidentDateInpt) {
      if (!incidentDate || incidentDate === '') {
        incidentDateInpt.classList.add('error');
      } else {
        incidentDateInpt.classList.remove('error');
      }
    }

    // number of selected Consumers with an error ; length = 0 on initial display
    var selectedErroredConsumers = [].slice.call(
      document.querySelectorAll('.consumersWrap .consumerCard.error'),
    );

    // hasNoErrors = 0 means the "Select a Consumer" message is displayed
    var hasNoErrors = document.getElementsByClassName('consumerError hidden');

    if (hasNoErrors.length === 0) return true;

    var detailshasErrors = [].slice.call(section.querySelectorAll('.error'));

    if (detailshasErrors.length !== 0 || selectedErroredConsumers.length !== 0) {
      return true; // true means do disable the Save BTN
    } else {
      return false; // false means don't disable the Save BTN
    }
  }

  return {
    build: buildSection,
    checkRequiredFields,
  };
})();
