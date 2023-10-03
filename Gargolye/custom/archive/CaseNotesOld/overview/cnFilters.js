const cnFilters = (function () {
  //Filter HTML Elements
  let billersDropdown, consumerDropdown, billingCodeDropdown, reviewStatusDropdown, correctedDropdown;
  let serviceDateStartInput, serviceDateEndInput;
  let enteredDateStartInput, enteredDateEndInput;
  let applyBtn;
  let additionalFilterContainer;
  //More Options
  let locationFilterCbox,
    serviceFiltercCbox,
    needFiltercCbox,
    contactFiltercCbox,
    confidentialFiltercCbox,
    showOverlapscCbox;
  let billedFiltercCbox, attachmentsFiltercCbox, noteTextFiltercCbox, selectAllFilterCbox;
  let locationDropdown, serviceDropdown, needDropdown, contactDropdown, confidentialDropdown;
  let billedDropdown, attachmentsDropdown, noteTextDropdown, noteTextInput;
  let activeAdditionalFilters;
  //Filter Values
  let filterValues;
  //Dropdown Data
  let consumerDropdownData;
  let serviceBillingCodes; //Billing Code === Service Code... They are the same thing
  let needDropdownData, serviceDropdownData, locationDropdownData, contactDropdownData;
  let checkOverlaps = 'N';

  function createFilterElements() {
    billersDropdown = dropdown.build({
      dropdownId: 'billerDropdown',
      label: 'Biller',
      style: 'secondary',
    });
    consumerDropdown = dropdown.build({
      dropdownId: 'consumerDropdown',
      label: 'Consumer',
      style: 'secondary',
    });
    billingCodeDropdown = dropdown.build({
      dropdownId: 'billingCodeDropdown',
      label: $.session.applicationName === 'Gatekeeper' ? 'Billing Code' : 'Service Code',
      style: 'secondary',
    });
    reviewStatusDropdown = dropdown.build({
      dropdownId: 'reviewStatusDropdown',
      label: 'Review Status',
      style: 'secondary',
    });
    correctedDropdown = dropdown.build({
      dropdownId: 'correctedDropdown',
      label: 'Corrected',
      style: 'secondary',
    });
    serviceDateStartInput = input.build({
      type: 'date',
      label: 'Service Date Start',
      style: 'secondary',
      value: filterValues.serviceDateStart,
    });
    serviceDateEndInput = input.build({
      type: 'date',
      label: 'Service Date End',
      style: 'secondary',
      value: filterValues.serviceDateEnd,
    });
    enteredDateStartInput = input.build({
      type: 'date',
      label: 'Created Date Start',
      style: 'secondary',
      //value: filterValues.enteredDateStart === '1900-01-01' ? '': filterValues.enteredDateStart
      value: filterValues.enteredDateStart,
    });
    enteredDateEndInput = input.build({
      type: 'date',
      label: 'Created Date End',
      style: 'secondary',
      value: filterValues.enteredDateEnd,
    });
    //EXTRA FILTER OPTIONS
    locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Location',
      style: 'secondary',
    });
    serviceDropdown = dropdown.build({
      dropdownId: 'serviceDropdown',
      label: 'Service',
      style: 'secondary',
    });
    needDropdown = dropdown.build({
      dropdownId: 'needDropdown',
      label: 'Need',
      style: 'secondary',
    });
    contactDropdown = dropdown.build({
      dropdownId: 'contactDropdown',
      label: 'Contact',
      style: 'secondary',
    });
    confidentialDropdown = dropdown.build({
      dropdownId: 'confidentialDropdown',
      label: 'Confidential',
      style: 'secondary',
    });
    billedDropdown = dropdown.build({
      dropdownId: 'billedDropdown',
      label: 'Billed',
      style: 'secondary',
    });
    attachmentsDropdown = dropdown.build({
      dropdownId: 'attachmentsDropdown',
      label: 'Attachments',
      style: 'secondary',
    });
    noteTextDropdown = dropdown.build({
      dropdownId: 'noteTextDropdown',
      label: 'Note Text',
      style: 'secondary',
    });
    noteTextInput = input.build({
      label: 'Note Text',
      style: 'secondary',
    });
  }

  function createMoreFilterOptionElements() {
    selectAllFilterCbox = input.buildCheckbox({
      text: 'Select All',
    });
    locationFilterCbox = input.buildCheckbox({
      text: 'Location',
      isChecked: activeAdditionalFilters.location,
    });
    serviceFiltercCbox = input.buildCheckbox({
      text: 'Service',
      isChecked: activeAdditionalFilters.service,
    });
    needFiltercCbox = input.buildCheckbox({
      text: 'Need',
      isChecked: activeAdditionalFilters.need,
    });
    contactFiltercCbox = input.buildCheckbox({
      text: 'Contact',
      isChecked: activeAdditionalFilters.contact,
    });
    confidentialFiltercCbox = input.buildCheckbox({
      text: 'Confidential',
      isChecked: activeAdditionalFilters.confidential,
    });
    billedFiltercCbox = input.buildCheckbox({
      text: 'Billed',
      isChecked: activeAdditionalFilters.billed,
    });
    attachmentsFiltercCbox = input.buildCheckbox({
      text: 'Attachments',
      isChecked: activeAdditionalFilters.attachments,
    });
    showOverlapscCbox = input.buildCheckbox({
      className: 'checkAlign',
      text: 'Check For Overlaps',
      isChecked: checkOverlaps === 'Y' ? true : false,
      callback: () => setCheckForOverLaps(event.target)
    });
    showOverlapscCbox.id = 'showOverlapCheckbox';
    noteTextFiltercCbox = input.buildCheckbox({
      text: 'Note Text',
      isChecked: activeAdditionalFilters.noteText,
    });

    // Quick inline styles
    selectAllFilterCbox.style.fontSize = '18px';
    selectAllFilterCbox.style.marginBottom = '10px';
  }

  function buildFilterPopup() {
    const popup = POPUP.build({
      classNames: 'caseNoteReviewFilterPopup',
    });

    applyBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setNewFilterValues();
        updateCurrentFilterDisplay();
        POPUP.hide(popup);
        notesOverview.setFilterValFromPopup(filterValues);
      },
    });
    const moreFilterOptBtn = button.build({
      text: 'more filter options',
      style: 'secondary',
      type: 'text',
      callback: () => {
        POPUP.hide(popup);
        moreFilterOptionPopup();
      },
    });

    const filterBtnWrap = document.createElement('div');
    additionalFilterContainer = document.createElement('div');
    addAdditionalFilters();
    filterBtnWrap.classList.add('btnWrap');

    const serviceDateWrap = filterBtnWrap.cloneNode();
    serviceDateWrap.classList.add('filterDateWrap');
    const createDateWrap = filterBtnWrap.cloneNode();
    createDateWrap.classList.add('filterDateWrap');

    filterBtnWrap.appendChild(applyBtn);

    serviceDateWrap.appendChild(serviceDateStartInput);
    serviceDateWrap.appendChild(serviceDateEndInput);

    createDateWrap.appendChild(enteredDateStartInput);
    createDateWrap.appendChild(enteredDateEndInput);
    popup.appendChild(showOverlapscCbox);
    popup.appendChild(billersDropdown);
    popup.appendChild(consumerDropdown);
    popup.appendChild(billingCodeDropdown);
    popup.appendChild(reviewStatusDropdown);
    if ($.session.applicationName === 'Gatekeeper') popup.appendChild(correctedDropdown);

    popup.appendChild(serviceDateWrap);
    popup.appendChild(createDateWrap);

    popup.appendChild(additionalFilterContainer);

    popup.appendChild(moreFilterOptBtn);

    popup.appendChild(filterBtnWrap);

    POPUP.show(popup);
    addEventListeners();
  }

  function moreFilterOptionPopup() {
    const moreFilterPopup = POPUP.build({
      hideX: true,
      classNames: 'caseNoteReviewFilterPopup',
    });

    const applyBtn = button.build({
      text: 'apply',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        checkAdditionalFilters();
        POPUP.hide(moreFilterPopup);
        buildFilterPopup();
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    const cBoxContainer = document.createElement('div');
    cBoxContainer.classList.add('cboxContainer');

    cBoxContainer.appendChild(selectAllFilterCbox);
    cBoxContainer.appendChild(locationFilterCbox);
    cBoxContainer.appendChild(serviceFiltercCbox);
    cBoxContainer.appendChild(needFiltercCbox);
    cBoxContainer.appendChild(contactFiltercCbox);
    cBoxContainer.appendChild(confidentialFiltercCbox);
    cBoxContainer.appendChild(billedFiltercCbox);
    if ($.session.applicationName === 'Gatekeeper')
      cBoxContainer.appendChild(attachmentsFiltercCbox);
    cBoxContainer.appendChild(noteTextFiltercCbox);

    moreFilterPopup.appendChild(cBoxContainer);

    btnWrap.appendChild(applyBtn);
    //Quick inline style:
    btnWrap.style.marginTop = '10px';

    moreFilterPopup.appendChild(btnWrap);

    POPUP.show(moreFilterPopup);
  }

  function checkAdditionalFilters() {
    activeAdditionalFilters.location = locationFilterCbox.firstChild.checked;
    activeAdditionalFilters.service = serviceFiltercCbox.firstChild.checked;
    activeAdditionalFilters.need = needFiltercCbox.firstChild.checked;
    activeAdditionalFilters.contact = contactFiltercCbox.firstChild.checked;
    activeAdditionalFilters.confidential = confidentialFiltercCbox.firstChild.checked;
    activeAdditionalFilters.billed = billedFiltercCbox.firstChild.checked;
    if ($.session.applicationName === 'Gatekeeper')
      activeAdditionalFilters.attachments = attachmentsFiltercCbox.firstChild.checked;
    activeAdditionalFilters.noteText = noteTextFiltercCbox.firstChild.checked;
  }

  function addAdditionalFilters() {
    if (activeAdditionalFilters.location) additionalFilterContainer.appendChild(locationDropdown);
    if (activeAdditionalFilters.service) additionalFilterContainer.appendChild(serviceDropdown);
    if (activeAdditionalFilters.need) additionalFilterContainer.appendChild(needDropdown);
    if (activeAdditionalFilters.contact) additionalFilterContainer.appendChild(contactDropdown);
    if (activeAdditionalFilters.confidential)
      additionalFilterContainer.appendChild(confidentialDropdown);
    if (activeAdditionalFilters.billed) additionalFilterContainer.appendChild(billedDropdown);
    if ($.session.applicationName === 'Gatekeeper' && activeAdditionalFilters.attachments)
      additionalFilterContainer.appendChild(attachmentsDropdown);
    if (activeAdditionalFilters.noteText) {
      additionalFilterContainer.appendChild(noteTextDropdown);
      additionalFilterContainer.appendChild(noteTextInput);
      if (filterValues.noteText === '%' || filterValues.noteText === '') {
        noteTextInput.style.display = 'none';
      } else {
        noteTextInput.querySelector('input').value = filterValues.noteText;
      }
    }
  }

  function addEventListeners() {
    billingCodeDropdown.addEventListener('change', event => {
      // Reset filter values based on service/bill code to all:
      filterValues.location = '%';
      filterValues.service = '%';
      filterValues.need = '%';
      filterValues.contact = '%';
      //Repopulate dropdowns
      getServiceDepententData(event.target.value);
    });
    noteTextDropdown.addEventListener('change', event => {
      if (event.target.value === 'contains') {
        noteTextInput.style.removeProperty('display');
      } else {
        noteTextInput.style.display = 'none';
        noteTextInput.firstChild.value = '';
      }
    });
    selectAllFilterCbox.addEventListener('change', event => {
      if (event.target.checked) {
        locationFilterCbox.firstChild.checked = true;
        serviceFiltercCbox.firstChild.checked = true;
        needFiltercCbox.firstChild.checked = true;
        contactFiltercCbox.firstChild.checked = true;
        confidentialFiltercCbox.firstChild.checked = true;
        billedFiltercCbox.firstChild.checked = true;
        if ($.session.applicationName === 'Gatekeeper')
          attachmentsFiltercCbox.firstChild.checked = true;
        noteTextFiltercCbox.firstChild.checked = true;
      } else {
        locationFilterCbox.firstChild.checked = false;
        serviceFiltercCbox.firstChild.checked = false;
        needFiltercCbox.firstChild.checked = false;
        contactFiltercCbox.firstChild.checked = false;
        confidentialFiltercCbox.firstChild.checked = false;
        billedFiltercCbox.firstChild.checked = false;
        if ($.session.applicationName === 'Gatekeeper')
          attachmentsFiltercCbox.firstChild.checked = false;
        noteTextFiltercCbox.firstChild.checked = false;
      }
    });
  }

  function setNewFilterValues() {
    filterValues.billerId = billersDropdown.firstChild.value;
    filterValues.consumer = consumerDropdown.firstChild.value;
    filterValues.billingCode = billingCodeDropdown.firstChild.value;
    filterValues.reviewStatus = reviewStatusDropdown.firstChild.value;
    filterValues.corrected = correctedDropdown.firstChild.value;
    filterValues.serviceDateStart = serviceDateStartInput.firstChild.value;
    filterValues.serviceDateEnd = serviceDateEndInput.firstChild.value;
    filterValues.enteredDateStart =
      enteredDateStartInput.firstChild.value === ''
        ? '1900-01-01'
        : enteredDateStartInput.firstChild.value;
    filterValues.enteredDateEnd = enteredDateEndInput.firstChild.value;
    filterValues.location = locationDropdown.firstChild.value;
    filterValues.service = serviceDropdown.firstChild.value;
    filterValues.need = needDropdown.firstChild.value;
    filterValues.contact = contactDropdown.firstChild.value;
    filterValues.confidential = confidentialDropdown.firstChild.value;
    filterValues.billed = billedDropdown.firstChild.value;
    if ($.session.applicationName === 'Gatekeeper')
    filterValues.attachments = attachmentsDropdown.firstChild.value;
    filterValues.overlaps = checkOverlaps;
    switch (noteTextDropdown.firstChild.value) {
      case 'contains':
        filterValues.noteText = noteTextInput.firstChild.value;
        break;
      case 'blank':
        filterValues.noteText = '';
        break;
      case '%':
        filterValues.noteText = '%';
        break;
      default:
        break;
    }
  }

  function populateStaticFilters() {
    const reviewStatusDropdownData = [
      { text: 'All', value: '%' },
      { text: 'Not Reviewed', value: 'N' },
      { text: 'Passed', value: 'P' },
      { text: 'Rejected', value: 'R' },
    ];
    const condfidentialDropdownData = (billedDropdownData = attachmentDropdownData = correctedDropdownData = [
      { text: 'All', value: '%' },
      { text: 'Yes', value: 'Y' },
      { text: 'No', value: 'N' },
    ]);
    const noteTextDropdownData = [
      { text: 'All', value: '%' },
      { text: 'Blank', value: 'blank' },
      { text: 'Contains', value: 'contains' },
    ];
    // Note text work:
    let noteTextDefault;
    if (filterValues.noteText === '%') {
      noteTextDefault = filterValues.noteText;
    } else if (filterValues.noteText === '') {
      noteTextDefault = 'blank';
    } else {
      noteTextDefault = 'contains';
    }
    dropdown.populate(reviewStatusDropdown, reviewStatusDropdownData, filterValues.reviewStatus);
    dropdown.populate(correctedDropdown, correctedDropdownData, filterValues.corrected);
    dropdown.populate(confidentialDropdown, condfidentialDropdownData, filterValues.confidential);
    dropdown.populate(billedDropdown, billedDropdownData, filterValues.billed);
    if ($.session.applicationName === 'Gatekeeper')
      dropdown.populate(attachmentsDropdown, attachmentDropdownData, filterValues.attachments);
    dropdown.populate(noteTextDropdown, noteTextDropdownData, noteTextDefault);
  }

  function populateConsumerFilter() {
    populateDropdownData = consumerDropdownData.map(el => {
      return {
        text: `${el.LN}, ${el.FN}`,
        value: el.id,
      };
    });
    populateDropdownData.unshift({ text: 'All', value: '%' });
    dropdown.populate(consumerDropdown, populateDropdownData, filterValues.consumer);
  }

  function populateBillersDropdown(billers) {
    var data = billers.map((b, index) => {
      if (index === 1) {
        caseManagerId = b.billerId;
      }
      return {
        value: b.billerId,
        text: b.billerName,
      };
    });
    data.unshift({ value: '%', text: 'All' });
    //If biller ID has not already been set:
    if (!filterValues.billerId) filterValues.billerId = $.session.PeopleId;
    dropdown.populate(billersDropdown, data, filterValues.billerId);
  }

  function populateDropdownsBasedOnServiceCode(selectedServiceBillCode) {
    serviceBillingCodes.unshift({ value: '%', text: 'All' });
    needDropdownData.unshift({ value: '%', text: 'All' });
    serviceDropdownData.unshift({ value: '%', text: 'All' });
    contactDropdownData.unshift({ value: '%', text: 'All' });
    locationDropdownData.unshift({ value: '%', text: 'All' });
    dropdown.populate(billingCodeDropdown, serviceBillingCodes, selectedServiceBillCode);
    dropdown.populate(locationDropdown, locationDropdownData, filterValues.location);
    dropdown.populate(serviceDropdown, serviceDropdownData, filterValues.service);
    dropdown.populate(needDropdown, needDropdownData, filterValues.need);
    dropdown.populate(contactDropdown, contactDropdownData, filterValues.contact);
  }

  async function getServiceDepententData(selectedServiceBillCode) {
    const rawDropdownData = (
      await caseNotesAjax.getCNPopulateFilterDropdowns(selectedServiceBillCode)
    ).getCNPopulateFilterDropdownsResult;
    sortRawDropdownData(rawDropdownData);
    populateDropdownsBasedOnServiceCode(selectedServiceBillCode);
  }

  function getConsumerDropdownData() {
    return new Promise((resolve, reject) => {
      caseNotesAjax.getConsumersForCNFilter(res => {
        consumerDropdownData = res;
        populateConsumerFilter();
        resolve('success');
      });
    });
  }

  function setCheckForOverLaps(input) {
      var isChecked = input.checked;
      if (isChecked) {
          checkOverlaps = 'Y';
      } else {
          checkOverlaps = 'N';
      }

  }

  function getBillersDropdownData() {
    return new Promise((resolve, reject) => {
      caseNotesAjax.getBillersListForDropDown(res => {
        populateBillersDropdown(res);
        resolve('success');
      });
    });
  }

  function sortRawDropdownData(rawDropdownData) {
    serviceBillingCodes = [];
    needDropdownData = [];
    serviceDropdownData = [];
    locationDropdownData = [];
    contactDropdownData = [];
    //Alphabetize Everything
    rawDropdownData.sort(function (a, b) {
      if (a.caption.toUpperCase() < b.caption.toUpperCase()) {
        return -1;
      }
      if (a.caption.toUpperCase() > b.caption.toUpperCase()) {
        return 1;
      }
      return 0;
    });
    //Sort to proper dropdown array
    rawDropdownData.forEach(el => {
      switch (el.dropdown) {
        case 'ServiceCode':
          serviceBillingCodes.push({ text: el.caption, value: el.note_code });
          break;
        case 'Need':
          needDropdownData.push({ text: el.caption, value: el.note_code });
          break;
        case 'Service':
          serviceDropdownData.push({ text: el.caption, value: el.note_code });
          break;
        case 'Contact':
          contactDropdownData.push({ text: el.caption, value: el.note_code });
          break;
        case 'Location':
          locationDropdownData.push({ text: el.caption, value: el.note_code });
          break;
        default:
          break;
      }
    });
  }

  // filterValues = {
  //   billerId: '',
  //   consumer: '',
  //     consumerName: '',
  //   billingCode: '',
  //   reviewStatus: '',
  //   serviceDateStart: serviceDateStart,
  //   serviceDateEnd: serviceDateEnd,
  //   enteredDateStart: datesEnteredStart,
  //   enteredDateEnd: datesEnteredEnd,
  //   location: '',
  //   service: '',
  //   need: '',
  //   contact: '',
  //   confidential: '',
  //   billed: '',
  //   attachments: '',
  //   noteText: '',
  //   noteTextValue: '',
  //   filterDisplayHTML: ''
  // }

  function updateCurrentFilterDisplay() {
    const currentFilterDisplay = document.querySelector('.filteredByData');

    const billerName =
      billersDropdown.firstChild.options[billersDropdown.firstChild.selectedIndex].innerText;
    filterValues.billerName = billerName;
    const consumerName =
      consumerDropdown.firstChild.options[consumerDropdown.firstChild.selectedIndex].innerText;
    filterValues.consumerName = consumerName;
    const billCodeText =
      billingCodeDropdown.firstChild.options[billingCodeDropdown.firstChild.selectedIndex]
        .innerText;
    filterValues.billCodeText = billCodeText;
    const reviewStatusText =
      reviewStatusDropdown.firstChild.options[reviewStatusDropdown.firstChild.selectedIndex]
        .innerText;
    const correctedText =
        correctedDropdown.firstChild.options[correctedDropdown.firstChild.selectedIndex]
          .innerText;
    const locationText =
      locationDropdown.firstChild.options[locationDropdown.firstChild.selectedIndex].innerText;
    filterValues.locationText = locationText;
    const serviceText =
      serviceDropdown.firstChild.options[serviceDropdown.firstChild.selectedIndex].innerText;
    filterValues.serviceText = serviceText;
    const needText =
      needDropdown.firstChild.options[needDropdown.firstChild.selectedIndex].innerText;
    const contactText =
      contactDropdown.firstChild.options[contactDropdown.firstChild.selectedIndex].innerText;
    const confidentialText =
      confidentialDropdown.firstChild.options[confidentialDropdown.firstChild.selectedIndex]
        .innerText;
    const billedText =
      billedDropdown.firstChild.options[billedDropdown.firstChild.selectedIndex].innerText;
    let attachmentsText;
    if ($.session.applicationName === 'Gatekeeper') {
      attachmentsText =
        attachmentsDropdown.firstChild.options[attachmentsDropdown.firstChild.selectedIndex]
          .innerText;
      attachmentsText = attachmentsText ? attachmentsText : 'All';//
    }
      let showOverlapsText = 'No';
      if (checkOverlaps === 'N') {
          showOverlapsText = 'No';
      } else {
          showOverlapsText = 'Yes';
      }
    const noteTextText =
      noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex].innerText ===
      'Contains'
        ? `Contains: ${noteTextInput.firstChild.value}`
        : noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex].innerText;

    const dispalyServiceDateStart = UTIL.formatDateFromIso(filterValues.serviceDateStart);
    const dispalyServiceDateEnd = UTIL.formatDateFromIso(filterValues.serviceDateEnd);
    const displayDateEnteredStart = UTIL.formatDateFromIso(filterValues.enteredDateStart);
    const dispalyDatesEnteredEnd = UTIL.formatDateFromIso(filterValues.enteredDateEnd);

    currentFilterDisplay.innerHTML = `
    <p><span>Biller: </span> ${billerName} </P>
    <p><span>Consumer: </span> ${consumerName} </P>
    <p><span>${
      $.session.applicationName === 'Gatekeeper' ? 'Billing Code: ' : 'Service Code: '
    }</span> ${billCodeText} </P>
    <p><span>Review Status: </span> ${reviewStatusText} </P>
    <p><span>Corrected: </span> ${correctedText} </P>
    <p><span>Service Dates:</span> ${dispalyServiceDateStart} - ${dispalyServiceDateEnd} </p>
    <p><span>Created Dates:</span> ${displayDateEnteredStart} - ${dispalyDatesEnteredEnd} </p >
    <p><span>Location: </span> ${locationText} </P>
    <p><span>Service: </span> ${serviceText} </P>
    <p><span>Need: </span> ${needText} </P>
    <p><span>Contact: </span> ${contactText} </P>
    <p><span>Confidential: </span> ${confidentialText} </P>
    <p><span>Billed: </span> ${billedText} </P>
    ${
      $.session.applicationName === 'Gatekeeper'
        ? `<p><span>Attachments: </span> ${attachmentsText} </P>`
        : ''
    }
    <p><span>Show Overlaps: </span> ${showOverlapsText} </P>
    <p><span>Note Text: </span> ${noteTextText} </P>
    `;
  }

  function init(overviewFilterValues) {
      filterValues = overviewFilterValues;
      if (filterValues.overlaps === 'N') {
          checkOverlaps = 'N';
      }
    if (!activeAdditionalFilters) {
      activeAdditionalFilters = {
        location: false,
        service: false,
        need: false,
        contact: false,
        confidential: false,
        billed: false,
        attachments: false,
        noteText: false,
      };
    }
    createFilterElements();
    const consumerPromise = getConsumerDropdownData();
    const billerPromise = getBillersDropdownData();
    Promise.race([consumerPromise, billerPromise]).then(() => {});
    getServiceDepententData(filterValues.billingCode);
    populateStaticFilters();
    createMoreFilterOptionElements();
    buildFilterPopup();
  }

  return {
    init,
  };
})();
