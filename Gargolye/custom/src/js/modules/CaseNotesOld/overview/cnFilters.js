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
    let btnWrap;
    let billerBtnWrap;
    let consumerBtnWrap;
    let billingServiceBtnWrap;
    let reviewStatusBtnWrap;
    let correctedBtnWrap;
    let serviceDatesBtnWrap;
    let createdDatesBtnWrap;
    let locationBtnWrap;
    let serviceBtnWrap;
    let needBtnWrap;
    let contactBtnWrap;
    let confidentialBtnWrap;
    let billedBtnWrap;
    let attachmentsBtnWrap;
    let showOverlapsBtnWrap;
    let noteTextBtnWrap;
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

    function buildFilterPopup(IsShow) {
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
        addAdditionalFilters(IsShow);
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
        if (IsShow == 'ALL' || IsShow == 'showOverlapsBtn')
            popup.appendChild(showOverlapscCbox);
        if (IsShow == 'ALL' || IsShow == 'billerBtn')
            popup.appendChild(billersDropdown);
        if (IsShow == 'ALL' || IsShow == 'consumerBtn')
            popup.appendChild(consumerDropdown);
        if (IsShow == 'ALL' || IsShow == 'billingServiceCodeBtn')
            popup.appendChild(billingCodeDropdown);
        if (IsShow == 'ALL' || IsShow == 'reviewStatusBtn')
            popup.appendChild(reviewStatusDropdown);
        if ($.session.applicationName === 'Gatekeeper' && (IsShow == 'ALL' || IsShow == 'correctedBtn')) popup.appendChild(correctedDropdown);

        if (IsShow == 'ALL' || IsShow == 'serviceDatesBtn')
            popup.appendChild(serviceDateWrap);
        if (IsShow == 'ALL' || IsShow == 'createdDatesBtn')
            popup.appendChild(createDateWrap);

        popup.appendChild(additionalFilterContainer);

        if (IsShow == 'ALL')
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
                buildFilterPopup('ALL');
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

        if (!activeAdditionalFilters.location) closeFilter('locationBtn');
        if (!activeAdditionalFilters.service) closeFilter('serviceBtn');
        if (!activeAdditionalFilters.need) closeFilter('needBtn');
        if (!activeAdditionalFilters.contact) closeFilter('contactBtn');
        if (!activeAdditionalFilters.confidential) closeFilter('confidentialBtn');
        if (!activeAdditionalFilters.billed) closeFilter('billedBtn');
        if ($.session.applicationName === 'Gatekeeper' && !activeAdditionalFilters.attachments) closeFilter('billedBtn')
        if (!activeAdditionalFilters.noteText) closeFilter('noteTextBtn');
    }

    function addAdditionalFilters(IsShow) {
        if (activeAdditionalFilters.location && (IsShow == 'ALL' || IsShow == 'locationBtn')) additionalFilterContainer.appendChild(locationDropdown);
        if (activeAdditionalFilters.service && (IsShow == 'ALL' || IsShow == 'serviceBtn')) additionalFilterContainer.appendChild(serviceDropdown);
        if (activeAdditionalFilters.need && (IsShow == 'ALL' || IsShow == 'needBtn')) additionalFilterContainer.appendChild(needDropdown);
        if (activeAdditionalFilters.contact && (IsShow == 'ALL' || IsShow == 'contactBtn')) additionalFilterContainer.appendChild(contactDropdown);
        if (activeAdditionalFilters.confidential && (IsShow == 'ALL' || IsShow == 'confidentialBtn'))
            additionalFilterContainer.appendChild(confidentialDropdown);
        if (activeAdditionalFilters.billed && (IsShow == 'ALL' || IsShow == 'billedBtn')) additionalFilterContainer.appendChild(billedDropdown);
        if ($.session.applicationName === 'Gatekeeper' && activeAdditionalFilters.attachments && (IsShow == 'ALL' || IsShow == 'attachmentsBtn'))
            additionalFilterContainer.appendChild(attachmentsDropdown);
        if (activeAdditionalFilters.noteText && (IsShow == 'ALL' || IsShow == 'noteTextBtn')) {
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
        var currentFilterDisplay = document.querySelector('.filteredByData');
        const billerName =
            billersDropdown == undefined ? 'All' : billersDropdown.firstChild.options[billersDropdown.firstChild.selectedIndex].innerText;
        if (filterValues != undefined) filterValues.billerName = billerName;
        const consumerName =
            consumerDropdown == undefined ? 'All' : consumerDropdown.firstChild.options[consumerDropdown.firstChild.selectedIndex].innerText;
        if (filterValues != undefined) filterValues.consumerName = consumerName;
        const billCodeText =
            billingCodeDropdown == undefined ? 'All' : billingCodeDropdown.firstChild.options[billingCodeDropdown.firstChild.selectedIndex]
                .innerText;
        if (filterValues != undefined) filterValues.billCodeText = billCodeText;
        const reviewStatusText =
            reviewStatusDropdown == undefined ? 'All' : reviewStatusDropdown.firstChild.options[reviewStatusDropdown.firstChild.selectedIndex]
                .innerText;
        const correctedText =
            correctedDropdown == undefined ? 'All' : correctedDropdown.firstChild.options[correctedDropdown.firstChild.selectedIndex]
                .innerText;
        const locationText =
            locationDropdown != undefined && locationDropdown.firstChild.options[locationDropdown.firstChild.selectedIndex] != undefined ? locationDropdown.firstChild.options[locationDropdown.firstChild.selectedIndex].innerText : 'All';
        if (filterValues != undefined) filterValues.locationText = locationText;
        const serviceText =
            serviceDropdown != undefined && serviceDropdown.firstChild.options[serviceDropdown.firstChild.selectedIndex] != undefined ? serviceDropdown.firstChild.options[serviceDropdown.firstChild.selectedIndex].innerText : 'All';
        if (filterValues != undefined) filterValues.serviceText = serviceText;
        const needText =
            needDropdown != undefined && needDropdown.firstChild.options[needDropdown.firstChild.selectedIndex] != undefined ? needDropdown.firstChild.options[needDropdown.firstChild.selectedIndex].innerText : 'All';
        const contactText =
            contactDropdown != undefined && contactDropdown.firstChild.options[contactDropdown.firstChild.selectedIndex] != undefined ? contactDropdown.firstChild.options[contactDropdown.firstChild.selectedIndex].innerText : 'All';
        const confidentialText =
            confidentialDropdown != undefined && confidentialDropdown.firstChild.options[confidentialDropdown.firstChild.selectedIndex] != undefined ? confidentialDropdown.firstChild.options[confidentialDropdown.firstChild.selectedIndex]
                .innerText : 'All';
        const billedText =
            billedDropdown != undefined && billedDropdown.firstChild.options[billedDropdown.firstChild.selectedIndex] != undefined ? billedDropdown.firstChild.options[billedDropdown.firstChild.selectedIndex].innerText : 'All';
        let attachmentsText;
        if ($.session.applicationName === 'Gatekeeper') {
            attachmentsText =
                attachmentsDropdown != undefined && attachmentsDropdown.firstChild.options[attachmentsDropdown.firstChild.selectedIndex] != undefined ? attachmentsDropdown.firstChild.options[attachmentsDropdown.firstChild.selectedIndex]
                    .innerText : 'All';
            attachmentsText = attachmentsText ? attachmentsText : 'All';// 
        }
        let showOverlapsText = 'No';
        if (checkOverlaps === 'N') {
            showOverlapsText = 'No';
        } else {
            showOverlapsText = 'Yes';
        }
        const noteTextText =
            noteTextDropdown != undefined && noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex] != undefined ? noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex].innerText ===
                'Contains'
                ? `Contains: ${noteTextInput.firstChild.value}`
                : noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex].innerText : 'All';

        const dispalyServiceDateStart = serviceDateStartInput != undefined && filterValues.serviceDateStart != '' ? UTIL.formatDateFromIso(filterValues.serviceDateStart) : filterValues.serviceDateStart;
        const dispalyServiceDateEnd = serviceDateEndInput != undefined && filterValues.serviceDateEnd != '' ? UTIL.formatDateFromIso(filterValues.serviceDateEnd) : filterValues.serviceDateEnd;
        const displayDateEnteredStart = enteredDateStartInput != undefined && filterValues.enteredDateStart != '' ? UTIL.formatDateFromIso(filterValues.enteredDateStart) : filterValues.enteredDateStart;
        const dispalyDatesEnteredEnd = enteredDateEndInput != undefined && filterValues.enteredDateEnd != '' ? UTIL.formatDateFromIso(filterValues.enteredDateEnd) : filterValues.enteredDateEnd;

        ShowHideFilter(billerName, consumerName, billCodeText, reviewStatusText, correctedText, dispalyServiceDateStart, dispalyServiceDateEnd, displayDateEnteredStart, dispalyDatesEnteredEnd,
            locationText, serviceText, needText, contactText, confidentialText, billedText, attachmentsText, showOverlapsText, noteTextText);

    }

    function ShowHideFilter(billerName, consumerName, billCodeText, reviewStatusText, correctedText, dispalyServiceDateStart, dispalyServiceDateEnd, displayDateEnteredStart, dispalyDatesEnteredEnd,
        locationText, serviceText, needText, contactText, confidentialText, billedText, attachmentsText, showOverlapsText, noteTextText) {

        if (!filterValues) {
            filterValues = {
                billerId: $.session.PeopleId,
                consumer: '%',
                consumerName: 'All',
                billingCode: '%',
                reviewStatus: '%',
                serviceDateStart: dispalyServiceDateStart,
                serviceDateEnd: dispalyServiceDateEnd,
                enteredDateStart: displayDateEnteredStart,
                enteredDateEnd: dispalyDatesEnteredEnd,
                location: '%',
                service: '%',
                need: '%',
                contact: '%',
                confidential: '%',
                corrected: '%',
                billed: '%',
                attachments: '%',
                overlaps: 'N',
                noteText: '%',
                noteTextValue: '',
            };
        }

        if (billerName === '%' || billerName === 'All') {
            btnWrap.appendChild(billerBtnWrap);
            btnWrap.removeChild(billerBtnWrap);
        }
        else {
            btnWrap.appendChild(billerBtnWrap);
            if (document.getElementById('billerBtn') != null)
                document.getElementById('billerBtn').innerHTML = 'Biller: ' + billerName;
        }

        if (consumerName === '%' || consumerName === 'All') {
            btnWrap.appendChild(consumerBtnWrap);
            btnWrap.removeChild(consumerBtnWrap);
        }
        else {
            btnWrap.appendChild(consumerBtnWrap);
            if (document.getElementById('consumerBtn') != null)
                document.getElementById('consumerBtn').innerHTML = 'Consumer: ' + consumerName;
        }

        if (billCodeText === '%' || billCodeText === 'All') {
            btnWrap.appendChild(billingServiceBtnWrap);
            btnWrap.removeChild(billingServiceBtnWrap);
        }
        else {
            btnWrap.appendChild(billingServiceBtnWrap);
            if (document.getElementById('billingServiceCodeBtn') != null)
                document.getElementById('billingServiceCodeBtn').innerHTML = $.session.applicationName === 'Gatekeeper' ? 'Billing Code: ' : 'Service Code: ' + billCodeText;
        }

        if (reviewStatusText === '%' || reviewStatusText === 'All') {
            btnWrap.appendChild(reviewStatusBtnWrap);
            btnWrap.removeChild(reviewStatusBtnWrap);
        }
        else {
            btnWrap.appendChild(reviewStatusBtnWrap);
            if (document.getElementById('reviewStatusBtn') != null)
                document.getElementById('reviewStatusBtn').innerHTML = 'Review Status: ' + reviewStatusText;
        }
        if ($.session.applicationName === 'Gatekeeper') {
            if (correctedText === '%' || correctedText === 'All') {
                btnWrap.appendChild(correctedBtnWrap);
                btnWrap.removeChild(correctedBtnWrap);
            }
            else {
                btnWrap.appendChild(correctedBtnWrap);
                if (document.getElementById('correctedBtn') != null)
                    document.getElementById('correctedBtn').innerHTML = 'Corrected: ' + correctedText;
            }
        }

        if (dispalyServiceDateStart === '' && dispalyServiceDateEnd === '') { 
            btnWrap.appendChild(serviceDatesBtnWrap);
            btnWrap.removeChild(serviceDatesBtnWrap);
        }
        else {
            btnWrap.appendChild(serviceDatesBtnWrap);
            if (document.getElementById('serviceDatesBtn') != null)
                document.getElementById('serviceDatesBtn').innerHTML = 'Service Dates: ' + dispalyServiceDateStart + ' - ' + dispalyServiceDateEnd;
        }

        if (displayDateEnteredStart === '' && dispalyDatesEnteredEnd === '') { 
            btnWrap.appendChild(createdDatesBtnWrap);
            btnWrap.removeChild(createdDatesBtnWrap);
        }
        else {
            btnWrap.appendChild(createdDatesBtnWrap);
            if (document.getElementById('createdDatesBtn') != null)
                document.getElementById('createdDatesBtn').innerHTML = 'Created Dates: ' + displayDateEnteredStart + ' - ' + dispalyDatesEnteredEnd;
        }

        if (locationText === '%' || locationText === 'All') {
            btnWrap.appendChild(locationBtnWrap);
            btnWrap.removeChild(locationBtnWrap);
        }
        else {
            btnWrap.appendChild(locationBtnWrap);
            if (document.getElementById('locationBtn') != null)
                document.getElementById('locationBtn').innerHTML = 'Location: ' + locationText;
        }

        if (serviceText === '%' || serviceText === 'All') {
            btnWrap.appendChild(serviceBtnWrap);
            btnWrap.removeChild(serviceBtnWrap);
        }
        else {
            btnWrap.appendChild(serviceBtnWrap);
            if (document.getElementById('serviceBtn') != null)
                document.getElementById('serviceBtn').innerHTML = 'Service: ' + serviceText;
        }

        if (needText === '%' || needText === 'All') {
            btnWrap.appendChild(needBtnWrap);
            btnWrap.removeChild(needBtnWrap);
        }
        else {
            btnWrap.appendChild(needBtnWrap);
            if (document.getElementById('needBtn') != null)
                document.getElementById('needBtn').innerHTML = 'Need: ' + needText;
        }

        if (contactText === '%' || contactText === 'All') {
            btnWrap.appendChild(contactBtnWrap);
            btnWrap.removeChild(contactBtnWrap);
        }
        else {
            btnWrap.appendChild(contactBtnWrap);
            if (document.getElementById('contactBtn') != null)
                document.getElementById('contactBtn').innerHTML = 'Contact: ' + contactText;
        }

        if (confidentialText === '%' || confidentialText === 'All') {
            btnWrap.appendChild(confidentialBtnWrap);
            btnWrap.removeChild(confidentialBtnWrap);
        }
        else {
            btnWrap.appendChild(confidentialBtnWrap);
            if (document.getElementById('confidentialBtn') != null)
                document.getElementById('confidentialBtn').innerHTML = 'Confidential: ' + confidentialText;
        }

        if (billedText === '%' || billedText === 'All') {
            btnWrap.appendChild(billedBtnWrap);
            btnWrap.removeChild(billedBtnWrap);
        }
        else {
            btnWrap.appendChild(billedBtnWrap);
            if (document.getElementById('billedBtn') != null)
                document.getElementById('billedBtn').innerHTML = 'Billed: ' + billedText;
        }

        if ($.session.applicationName === 'Gatekeeper') {
            if (attachmentsText === '%' || attachmentsText === 'All') {
                btnWrap.appendChild(attachmentsBtnWrap);
                btnWrap.removeChild(attachmentsBtnWrap);
            }
            else {
                btnWrap.appendChild(attachmentsBtnWrap);
                if (document.getElementById('attachmentsBtn') != null)
                    document.getElementById('attachmentsBtn').innerHTML = 'Attachments: ' + attachmentsText;
            }
        }

        btnWrap.appendChild(showOverlapsBtnWrap);
        if (document.getElementById('showOverlapsBtn') != null)
            document.getElementById('showOverlapsBtn').innerHTML = 'Show Overlaps: ' + showOverlapsText;

        if (noteTextText === '%' || noteTextText === 'All') {
            btnWrap.appendChild(noteTextBtnWrap);
            btnWrap.removeChild(noteTextBtnWrap);
        }
        else {
            btnWrap.appendChild(noteTextBtnWrap);
            if (document.getElementById('noteTextBtn') != null)
                document.getElementById('noteTextBtn').innerHTML = 'Note Text: ' + noteTextText;
        }
        return btnWrap;
    }

    function filterButtonSet(billerName, displayConsumerName, billCodeText, reviewStatusText, correctedText, dispalyServiceDateStart, dispalyServiceDateEnd, displayDateEnteredStart, dispalyDatesEnteredEnd,
        locationText, serviceText, needText, contactText, confidentialText, billedText, attachmentsText, showOverlapsText, noteTextText, filterValues) {
        filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtnNew',
            callback: () => { cnFilters.init(filterValues, 'ALL') },
        });

        billerBtn = button.build({
            id: 'billerBtn',
            text: 'Biller: ' + billerName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'billerBtn') },
        });
        billerCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('billerBtn') },
        });

        consumerBtn = button.build({
            id: 'consumerBtn',
            text: 'Consumer: ' + displayConsumerName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'consumerBtn') },
        });
        consumerCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('consumerBtn') },
        });

        billingServiceCodeBtn = button.build({
            id: 'billingServiceCodeBtn',
            text: $.session.applicationName === 'Gatekeeper' ? 'Billing Code: ' : 'Service Code: ' + billCodeText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'billingServiceCodeBtn') },
        });
        billingServiceCodeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('billingServiceCodeBtn') },
        });

        reviewStatusBtn = button.build({
            id: 'reviewStatusBtn',
            text: 'Review Status: ' + reviewStatusText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'reviewStatusBtn') },
        });
        reviewStatusCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('reviewStatusBtn') },
        });

        correctedBtn = button.build({
            id: 'correctedBtn',
            text: 'Corrected: ' + correctedText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'correctedBtn') },
        });
        correctedCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('correctedBtn') },
        });

        serviceDatesBtn = button.build({
            id: 'serviceDatesBtn',
            text: 'Service Dates: ' + dispalyServiceDateStart + ' - ' + dispalyServiceDateEnd,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'serviceDatesBtn') },
        });

        createdDatesBtn = button.build({
            id: 'createdDatesBtn',
            text: 'Created Dates: ' + displayDateEnteredStart + ' - ' + dispalyDatesEnteredEnd,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'createdDatesBtn') },
        });

        locationBtn = button.build({
            id: 'locationBtn',
            text: 'Location: ' + locationText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'locationBtn') },
        });
        locationCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('locationBtn') },
        });

        serviceBtn = button.build({
            id: 'serviceBtn',
            text: 'Service: ' + serviceText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'serviceBtn') },
        });
        serviceCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('serviceBtn') },
        });

        needBtn = button.build({
            id: 'needBtn',
            text: 'Need: ' + needText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'needBtn') },
        });
        needCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('needBtn') },
        });

        contactBtn = button.build({
            id: 'contactBtn',
            text: 'Contact: ' + contactText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'contactBtn') },
        });
        contactCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('contactBtn') },
        });

        confidentialBtn = button.build({
            id: 'confidentialBtn',
            text: 'Confidential: ' + confidentialText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'confidentialBtn') },
        });
        confidentialCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('confidentialBtn') },
        });

        attachmentsBtn = button.build({
            id: 'attachmentsBtn',
            text: 'Attachments: ' + attachmentsText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'attachmentsBtn') },
        });
        attachmentsCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('attachmentsBtn') },
        });

        billedBtn = button.build({
            id: 'billedBtn',
            text: 'Billed: ' + billedText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'billedBtn') },
        });
        billedCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('billedBtn') },
        });


        showOverlapsBtn = button.build({
            id: 'showOverlapsBtn',
            text: 'Show Overlaps: ' + showOverlapsText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'showOverlapsBtn') },
        });

        noteTextBtn = button.build({
            id: 'noteTextBtn',
            text: 'Note Text: ' + noteTextText,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { cnFilters.init(filterValues, 'noteTextBtn') },
        });
        noteTextCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('noteTextBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        billerBtnWrap = document.createElement('div');
        billerBtnWrap.classList.add('filterSelectionBtnWrap');
        billerBtnWrap.appendChild(billerBtn);
        billerBtnWrap.appendChild(billerCloseBtn);
        btnWrap.appendChild(billerBtnWrap);

        consumerBtnWrap = document.createElement('div');
        consumerBtnWrap.classList.add('filterSelectionBtnWrap');
        consumerBtnWrap.appendChild(consumerBtn);
        consumerBtnWrap.appendChild(consumerCloseBtn);
        btnWrap.appendChild(consumerBtnWrap);

        billingServiceBtnWrap = document.createElement('div');
        billingServiceBtnWrap.classList.add('filterSelectionBtnWrap');
        billingServiceBtnWrap.appendChild(billingServiceCodeBtn);
        billingServiceBtnWrap.appendChild(billingServiceCodeCloseBtn);
        btnWrap.appendChild(billingServiceBtnWrap);

        reviewStatusBtnWrap = document.createElement('div');
        reviewStatusBtnWrap.classList.add('filterSelectionBtnWrap');
        reviewStatusBtnWrap.appendChild(reviewStatusBtn);
        reviewStatusBtnWrap.appendChild(reviewStatusCloseBtn);
        btnWrap.appendChild(reviewStatusBtnWrap);


        correctedBtnWrap = document.createElement('div');
        correctedBtnWrap.classList.add('filterSelectionBtnWrap');
        correctedBtnWrap.appendChild(correctedBtn);
        correctedBtnWrap.appendChild(correctedCloseBtn);
        if ($.session.applicationName === 'Gatekeeper') {
            btnWrap.appendChild(correctedBtnWrap);
        }

        serviceDatesBtnWrap = document.createElement('div');
        serviceDatesBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceDatesBtnWrap.appendChild(serviceDatesBtn);
        btnWrap.appendChild(serviceDatesBtnWrap);

        createdDatesBtnWrap = document.createElement('div');
        createdDatesBtnWrap.classList.add('filterSelectionBtnWrap');
        createdDatesBtnWrap.appendChild(createdDatesBtn);
        btnWrap.appendChild(createdDatesBtnWrap);

        locationBtnWrap = document.createElement('div');
        locationBtnWrap.classList.add('filterSelectionBtnWrap');
        locationBtnWrap.appendChild(locationBtn);
        locationBtnWrap.appendChild(locationCloseBtn);
        btnWrap.appendChild(locationBtnWrap);


        serviceBtnWrap = document.createElement('div');
        serviceBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceBtnWrap.appendChild(serviceBtn);
        serviceBtnWrap.appendChild(serviceCloseBtn);
        btnWrap.appendChild(serviceBtnWrap);

        needBtnWrap = document.createElement('div');
        needBtnWrap.classList.add('filterSelectionBtnWrap');
        needBtnWrap.appendChild(needBtn);
        needBtnWrap.appendChild(needCloseBtn);
        btnWrap.appendChild(needBtnWrap);

        contactBtnWrap = document.createElement('div');
        contactBtnWrap.classList.add('filterSelectionBtnWrap');
        contactBtnWrap.appendChild(contactBtn);
        contactBtnWrap.appendChild(contactCloseBtn);
        btnWrap.appendChild(contactBtnWrap);

        confidentialBtnWrap = document.createElement('div');
        confidentialBtnWrap.classList.add('filterSelectionBtnWrap');
        confidentialBtnWrap.appendChild(confidentialBtn);
        confidentialBtnWrap.appendChild(confidentialCloseBtn);
        btnWrap.appendChild(confidentialBtnWrap);

        billedBtnWrap = document.createElement('div');
        billedBtnWrap.classList.add('filterSelectionBtnWrap');
        billedBtnWrap.appendChild(billedBtn);
        billedBtnWrap.appendChild(billedCloseBtn);
        btnWrap.appendChild(billedBtnWrap);


        attachmentsBtnWrap = document.createElement('div');
        attachmentsBtnWrap.classList.add('filterSelectionBtnWrap');
        attachmentsBtnWrap.appendChild(attachmentsBtn);
        attachmentsBtnWrap.appendChild(attachmentsCloseBtn);
        if ($.session.applicationName === 'Gatekeeper') {
            btnWrap.appendChild(attachmentsBtnWrap);
        }

        showOverlapsBtnWrap = document.createElement('div');
        showOverlapsBtnWrap.classList.add('filterSelectionBtnWrap');
        showOverlapsBtnWrap.appendChild(showOverlapsBtn);
        btnWrap.appendChild(showOverlapsBtnWrap);

        noteTextBtnWrap = document.createElement('div');
        noteTextBtnWrap.classList.add('filterSelectionBtnWrap');
        noteTextBtnWrap.appendChild(noteTextBtn);
        noteTextBtnWrap.appendChild(noteTextCloseBtn);
        btnWrap.appendChild(noteTextBtnWrap);

        return btnWrap;
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'billerBtn') {
            filterValues.billerId = '%';
            if (billersDropdown != undefined) {
                billersDropdown.firstChild.value = 'All';
                billersDropdown.firstChild.options[billersDropdown.firstChild.selectedIndex].innerText = 'All';
            }

        }
        if (closeFilter == 'consumerBtn') {
            filterValues.consumer = '%';
            consumerDropdown.firstChild.value = 'All';
            consumerDropdown.firstChild.options[consumerDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'billingServiceCodeBtn') {
            filterValues.billingCode = '%';
            billingCodeDropdown.firstChild.value = 'All';
            billingCodeDropdown.firstChild.options[billingCodeDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'reviewStatusBtn') {
            filterValues.reviewStatus = '%';
            reviewStatusDropdown.firstChild.value = 'All';
            reviewStatusDropdown.firstChild.options[reviewStatusDropdown.firstChild.selectedIndex].innerText = 'All';
        }

        if (closeFilter == 'correctedBtn') {
            filterValues.corrected = '%';
            correctedDropdown.firstChild.value = 'All';
            correctedDropdown.firstChild.options[correctedDropdown.firstChild.selectedIndex].innerText = 'All';
        }

        if (closeFilter == 'locationBtn') {
            filterValues.location = '%';
            locationDropdown.firstChild.value = 'All';
            if (locationDropdown.firstChild.options[locationDropdown.firstChild.selectedIndex] != undefined)
                locationDropdown.firstChild.options[locationDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'serviceBtn') {
            filterValues.service = '%';
            serviceDropdown.firstChild.value = 'All';
            if (serviceDropdown.firstChild.options[serviceDropdown.firstChild.selectedIndex] != undefined)
                serviceDropdown.firstChild.options[serviceDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'needBtn') {
            filterValues.need = '%';
            needDropdown.firstChild.value = 'All';
            if (needDropdown.firstChild.options[needDropdown.firstChild.selectedIndex] != undefined)
                needDropdown.firstChild.options[needDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'contactBtn') {
            filterValues.contact = '%';
            contactDropdown.firstChild.value = 'All';
            if (contactDropdown.firstChild.options[contactDropdown.firstChild.selectedIndex] != undefined)
                contactDropdown.firstChild.options[contactDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'confidentialBtn') {
            filterValues.confidential = '%';
            confidentialDropdown.firstChild.value = 'All';
            if (confidentialDropdown.firstChild.options[confidentialDropdown.firstChild.selectedIndex] != undefined)
                confidentialDropdown.firstChild.options[confidentialDropdown.firstChild.selectedIndex].innerText = 'All';
        }
        if (closeFilter == 'billedBtn') {
            filterValues.billed = '%';
            billedDropdown.firstChild.value = 'All';
            if (billedDropdown.firstChild.options[billedDropdown.firstChild.selectedIndex] != undefined)
                billedDropdown.firstChild.options[billedDropdown.firstChild.selectedIndex].innerText = 'All';
        }

        if (closeFilter == 'attachmentsBtn') {
            filterValues.attachments = '%';
            attachmentsDropdown.firstChild.value = 'All';
            if (attachmentsDropdown.firstChild.options[attachmentsDropdown.firstChild.selectedIndex] != undefined)
                attachmentsDropdown.firstChild.options[attachmentsDropdown.firstChild.selectedIndex].innerText = 'All';
        }

        if (closeFilter == 'noteTextBtn') {
            filterValues.noteText = '%';
            noteTextDropdown.firstChild.value = 'All';
            if (noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex] != undefined)
                noteTextDropdown.firstChild.options[noteTextDropdown.firstChild.selectedIndex].innerText = 'All';
        }

        updateCurrentFilterDisplay();
        notesOverview.setFilterValFromPopup(filterValues);
    }

    function init(overviewFilterValues, IsShow) {
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
        Promise.race([consumerPromise, billerPromise]).then(() => { });
        getServiceDepententData(filterValues.billingCode);
        populateStaticFilters();
        createMoreFilterOptionElements();
        buildFilterPopup(IsShow);
    }

    return {
        init,
        filterButtonSet,
        ShowHideFilter,
    };
})();
