const summerYouthWorkExperienceSummaryForm = (() => {
  // Inputs
  let monthYearDropdown; // Default Month using the existing logic for current Monthly Summary form.  Use same (existing) logic to determine values in dropdown.
  let referenceNumberDropdown; // Default Reference number using the existing logic for current Monthly Summary form.  
  // Dropdown list should show values from consumer_services_master.reference_number where services.ood_form = 16 
  // AND the consumer_services_master row is valid for the selected month.  For example, if I pick 01/2024 as the month, 
  // I should see a list of consumer_services_master.reference_number values where the associated service (in services table) 
  // has ood_form_number = 16 and consumer_services_master.from_date <= 1/1/2024 AND consumer_services_master.to_date >= 1/1/2024.

  let nextScheduledReviewInput; // Default Next Scheduled Review to null.  Required field.  Validate that this value is > the first day of the selected month in the Month field.
  let selfAssessmentInput; // Default Individual's Self Assessment to null.  Required field
  let providerAssessmentInput; // rename -- maybe -- Default Provider's Summary & Recommendations to null.  Required field.
  let reviewVTSDropdown; // Default Has the Vocational Training Stipend… to null.  Required field.  
  // Show values for YES and NO (this is currently found in the Form 8 Monthly Summary form)
  let wasOfferedHoursNotWorkedDropdown; // add -- Default Was the individual offered additional hours that weren't worked?  to null.  Required field.  
  // This value will not be stored in the database.
  let offeredHoursNotWorkedInput; // add -- Default Additional Hours Offered to null.  Should only be visible if radio button above is answered Yes.  
  // If visible, it is a required field.

  // values
  let consumerId;
  let emReviewId;
  let emReviewDate; // monthYearDropdown -- Month = em_review.em_review_date (set value to first day of selected month)
  let emReviewDateDBValue; // monthYearDropdown -- Month = em_review.em_review_date (set value to first day of selected month)
  let emReferenceNumber; // referenceNumberDropdown -- Reference Number = em_review.reference_num
  let emNextScheduledReview; //  nextScheduledReviewInput -- Next Scheduled Review = em_review.em_review_next_date
  let emSummaryIndivSelfAssessment; //  rename -- maybe -- selfAssessmentInput -- Individual's Self Assessment = em_review.em_sum_ind_self_assess
  let emSummaryIndivProviderAssessment; // //  rename -- maybe --providerAssessmentInput -- Provider's Summary & Recommendations = em_review.em_sum_provider_assess
  let emReviewVTS; // reviewVTSDropdown -- Has the Vocational Training Stipend… = em_review.vts_review
  let offeredHoursNotWorked; // offeredHoursNotWorkedInput -- Additional Hours Offered = em_review.add_hours_offered (new column - see associated task on this ticket)
  let emOfferedHoursNotWorkNumber; 
  // buttons
  let saveBtn;
  let saveAndNewBtn;
  let cancelBtn;
  let updateBtn;
  let deleteBtn;

  //Review Data
  //let caseManagerId;
  let userId;
  let serviceId;
  let reviewStartDate;
  let reviewEndDate;

  let formReadOnly = false;
  const FORMNUMBER = '8'; // Form 8

  let OODMonthlySummariesTable; // To be added in future release

  async function init(
    emReviewData,
    currentConsumer,
    selectedServiceId,
    currentRecordUserId,
    clickSource = 'OODGrid',
  ) {
    DOM.clearActionCenter();
    document.querySelectorAll('.consumerListBtn').forEach(e => e.remove());

    let todaysdate = new Date();
    var thisMonthFirstDay = new Date(todaysdate.getFullYear(), todaysdate.getMonth(), 1);

    consumerId = currentConsumer.id;
    currentEntryUserId = currentRecordUserId;

    if (emReviewData && Object.keys(emReviewData).length !== 0) {
      userId = $.session.UserId;
      emReviewId = emReviewData.emReviewId;
      emReviewDate = getShortDate(emReviewData.emReviewDate);
      emReviewDateDBValue = new Date(emReviewData.emReviewDate);
      emReferenceNumber = emReviewData.emReferenceNumber;
      emNextScheduledReview = emReviewData.emNextScheduledReview;
      emSummaryIndivSelfAssessment = emReviewData.emSummaryIndivSelfAssessment;
      emSummaryIndivProviderAssessment = emReviewData.emSummaryIndivProviderAssessment;
      emReviewVTS = emReviewData.emReviewVTS;
    } else {
      userId = $.session.UserId;
      serviceId = selectedServiceId;
      emReviewId = '0';
      emReviewDate = ('0' + (todaysdate.getMonth() + 1)).slice(-2) + '/' + todaysdate.getFullYear();
      emReviewDateDBValue = new Date(todaysdate.getFullYear(), todaysdate.getMonth(), 1);
      emReferenceNumber = '';
      emNextScheduledReview = '';
      emSummaryIndivSelfAssessment = '';
      emSummaryIndivProviderAssessment = '';
      emReviewVTS = '';
    }

    if (clickSource === 'OODGrid' && !$.session.OODUpdate) {
      formReadOnly = true;
    }

    if (clickSource === 'monthlySummary' && !$.session.OODInsert) {
      formReadOnly = true;
    }

    if (userId !== currentRecordUserId) {
      formReadOnly = true;
    }

    let myconsumer = buildConsumerCard(currentConsumer);

    let container = document.createElement('div');
    container.classList.add('monthlyForm');
    var LineBr = document.createElement('br');

    const heading = document.createElement('h2');
    heading.innerHTML = 'Summer Youth Work Experience - OOD Form 16 Monthly Summary';
    heading.classList.add('OODsectionHeading');

    container.appendChild(myconsumer);
    // container.appendChild(LineBr);
    container.appendChild(LineBr);
    container.appendChild(heading);
    container.appendChild(LineBr);

    //var date = new Date();
    monthYearDropdown = dropdown.build({
      label: 'Month',
      //classNames: 'monthYear',
      dropdownId: 'monthYearDropdown',
      value: emReviewDate,
      readonly: formReadOnly,
      // value: ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
      //readonly: true,
    });

    referenceNumberDropdown = dropdown.build({
      label: 'Reference Number',
      dropdownId: 'referenceNumberDropdown',
      value: emReferenceNumber,
      readonly: formReadOnly,
      // readonly: (userId !== currentRecordUserId) ? true : false,
    });

    nextScheduledReviewInput = input.build({
      type: 'date',
      label: 'Next Scheduled Review',
      style: 'secondary',
      // classNames: 'nextScheduledReviewInput',
      value: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
      readonly: formReadOnly,
      //value: filterValues.serviceDateStart
    });

    // selfAssessmentInput textarea
    selfAssessmentInput = input.build({
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: emSummaryIndivSelfAssessment,
      readonly: formReadOnly,
      // charLimit: 256,
      // forceCharLimit: true,
    });
    // selfAssessmentInput.classList.add('OODTextArea');

    // providerAssessment textarea
    providerAssessmentInput = input.build({
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: emSummaryIndivProviderAssessment,
      readonly: formReadOnly,
    });
    //  providerAssessmentInput.classList.add('introTextArea');

    // reviewVTS textarea
    reviewVTSDropdown = dropdown.build({
      dropdownId: 'reviewVTSDropdown',
      value: emReviewVTS,
      readonly: formReadOnly,
    });
    //  reviewVTSDropdown.classList.add('introTextArea');

     // wasOfferedHoursNotWorkedDropdown
     wasOfferedHoursNotWorkedDropdown = dropdown.build({
      dropdownId: 'wasOfferedHoursNotWorkedDropdown',
      value: offeredHoursNotWorked,
      readonly: formReadOnly,
    });
    
    offeredHoursNotWorkedInput = input.build({
      label: 'Additional Hours Offered',
      type: 'number',
      style: 'secondary',
      value: emOfferedHoursNotWorkNumber === '0' || emOfferedHoursNotWorkNumber === '0.00' ? '' : emOfferedHoursNotWorkNumber,
      readonly: formReadOnly,
      attributes: [{ key: 'min', value: '0' }],
    });
  

    saveBtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      icon: 'save',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => {
        insertFormData('save');
      },
    });
    saveAndNewBtn = button.build({
      text: 'Save & New',
      style: 'secondary',
      type: 'contained',
      icon: 'add',
      classNames: ['caseNoteSave', 'disabled'],
      callback: async () => {
        insertFormData('saveandNew');
      },
    });
    updateBtn = button.build({
      text: 'update',
      style: 'secondary',
      type: 'contained',
      icon: 'add',
      //  classNames: 'disabled',
      callback: async () => {
        updateFormData();
      },
    });
    deleteBtn = button.build({
      text: 'Delete',
      style: 'secondary',
      type: 'contained',
      icon: 'delete',
      // classNames: 'disabled',
      callback: async () => {
        deleteConfirmation(emReviewId);
      },
    });
    cancelBtn = button.build({
      text: 'cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      classNames: ['caseNoteCancel'],
      callback: async () => {
        OOD.loadOODLanding();
      },
    });

    setupEvents();

    const inputContainer1 = document.createElement('div');
    inputContainer1.classList.add('ood_form8monthlysummary_inputContainer1');

    inputContainer1.appendChild(monthYearDropdown);
    inputContainer1.appendChild(referenceNumberDropdown);
    // inputContainer1.appendChild(referenceNumberDropdown);

    //inputContainer1.appendChild(nextScheduledReviewInput);

    const nextScheduledReviewInputDIV = document.createElement('div');
    nextScheduledReviewInputDIV.classList.add('nextScheduledReviewInput');
    nextScheduledReviewInputDIV.appendChild(nextScheduledReviewInput);

    inputContainer1.appendChild(nextScheduledReviewInputDIV);

    container.appendChild(inputContainer1);

    const selfAssessmentLabel = document.createElement('p');
    selfAssessmentLabel.innerHTML = `<span style="font-weight: 500; font-size: 14px">Individual's Self-Assessment</span>`;

    const providerAssessmentLabel = document.createElement('p');
    providerAssessmentLabel.innerHTML = `<span style="font-weight: 500; font-size: 14px">Provider's Summary & Recommendations</span>`;

    const reviewVTSDropdownLabel = document.createElement('p');
    reviewVTSDropdownLabel.innerHTML = `<span style="font-weight: 500; font-size: 14px">Has the Vocational Training Stipend (VTS) been reviewed with the individual? Does it only reflect the time the individual participated? Does the individual agree to the amount of the VTS? </span>`;

    const wasOfferedHoursNotWorkedDropdownLabel = document.createElement('p');
    wasOfferedHoursNotWorkedDropdownLabel.innerHTML = `<span style="font-weight: 500; font-size: 14px">Was the Individual offered additional hours that weren't worked? </span>`;

    container.appendChild(selfAssessmentLabel);
    container.appendChild(selfAssessmentInput);
    container.appendChild(providerAssessmentLabel);
    container.appendChild(providerAssessmentInput);
    
    container.appendChild(reviewVTSDropdownLabel);
    container.appendChild(reviewVTSDropdown);

    container.appendChild(wasOfferedHoursNotWorkedDropdownLabel);
    container.appendChild(wasOfferedHoursNotWorkedDropdown);
    container.appendChild(offeredHoursNotWorkedInput);

    let updatecontainer = document.createElement('div');
    updatecontainer.classList.add('updatecontainer');

    let updatemessage = document.createElement('div');
    updatemessage.classList.add('updatemessage');
    updatemessage.innerHTML = `<span style="color: red">This record was created by another user therefore no edits can be made.</span>`;
    updatecontainer.appendChild(updatemessage);

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    emReviewId == '0' ? btnWrap.appendChild(saveBtn) : btnWrap.appendChild(updateBtn);
    emReviewId == '0' ? btnWrap.appendChild(saveAndNewBtn) : btnWrap.appendChild(deleteBtn);

    let btnWrap2 = document.createElement('div');
    btnWrap2.classList.add('btnWrap');
    btnWrap2.appendChild(cancelBtn);

    let btnRow = document.createElement('div');
    btnRow.classList.add('btnRow');
    btnRow.appendChild(btnWrap);
    btnRow.appendChild(btnWrap2);
    if (userId !== currentEntryUserId) btnRow.appendChild(updatecontainer);
    container.appendChild(btnRow);

    var LineBr = document.createElement('br');
    var LineBr2 = document.createElement('br');
    var LineBr3 = document.createElement('br');
    container.appendChild(LineBr);
    container.appendChild(LineBr2);
    container.appendChild(LineBr3);

    // NOTE: This summary table will be added in a later release; will need this code eventually -- JMM 02/05/2022
    //  OODMonthlySummariesTable = await buildOODMonthlySummariesTable();
    // container.appendChild(OODMonthlySummariesTable);

    // populateStaticDropDowns();

    DOM.ACTIONCENTER.appendChild(container);

    DOM.autosizeTextarea();

    populateStaticDropDowns();
    populateReferenceNumberDropdown();

    checkRequiredFields();
  }

  function getShortDate(fullDate) {
    var thisDate = new Date(fullDate);
    var thisShortDate =
      (thisDate.getMonth() + 1).toString().padStart(2, '0') + '/' + thisDate.getFullYear();
    return thisShortDate;
  }

  function setReviewStartandEndDates() {
    var dateparts = emReviewDate.split('/');
    var thisMonth = dateparts[0];

    var daysinMonth = dates.getDaysInMonth(emReviewDateDBValue);
    var thisYear = emReviewDateDBValue.getFullYear();

    reviewStartDate = thisYear + '-' + thisMonth + '-01';
    reviewEndDate = thisYear + '-' + thisMonth + '-' + daysinMonth;
  }

  function displaynoReferenceNumberPopup() {
    // no reference Numbers
    let noReferenceNumberPopup = POPUP.build({
      header: 'No Reference Numbers Found',
      hideX: true,
      id: 'noReferenceNumberPopup',
    });

    let OKBtn = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(noReferenceNumberPopup);
        // overlay.hide();
      },
    });

    let btnWrap = document.createElement('div');
    let warningMessage = document.createElement('p');
    warningMessage.innerHTML =
      'There are no reference numbers for this consumer and date combination. Please change the Month/Year to see a list of valid reference numbers or contact your Advisor Administrator to enter an OOD Authorization for the selected consumer.';
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(OKBtn);
    //noServicesPopup.appendChild(consumerServicesDropdown);
    noReferenceNumberPopup.appendChild(warningMessage);
    noReferenceNumberPopup.appendChild(btnWrap);
    overlay.show();
    POPUP.show(noReferenceNumberPopup);
  }

  async function populateReferenceNumberDropdown() {
    setReviewStartandEndDates();

    const { getConsumerReferenceNumbersResult: referencenumbers } =
      await OODAjax.getConsumerReferenceNumbersAsync(
        consumerId,
        reviewStartDate,
        reviewEndDate,
        FORMNUMBER,
      );
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = referencenumbers.map(referencenumber => ({
      id: referencenumber.referenceNumber,
      value: referencenumber.referenceNumber,
      text: referencenumber.referenceNumber,
    }));

    if (data.length == 0) {
      displaynoReferenceNumberPopup();
    }

    // if creating a new record and there is only one referenceNumber in the data, then automatically select it in the DDL
    if (emReferenceNumber == '' && data.length == 1) {
      emReferenceNumber = data[0].value;
    }

    if (!emReferenceNumber || emReferenceNumber === '') {
      referenceNumberDropdown.classList.add('error');
    } else {
      referenceNumberDropdown.classList.remove('error');
    }

    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('referenceNumberDropdown', data, emReferenceNumber);
  }

  // for monthYearDropdown DDL
  function populateStaticDropDowns() {
    const yesNoDropdownData = [
      { text: 'SELECT', value: 'SELECT' },
      { text: 'Yes', value: 'Y' },
      { text: 'No', value: 'N' },
    ];

    var mydate = new Date();
    var arrayDates = [];

    for (let i = 0; i < 24; i++) {
      var firstDay = new Date(mydate.getFullYear() - 1, mydate.getMonth() + i, 1);
      arrayDates.push({
        partialdate:
          (firstDay.getMonth() + 1).toString().padStart(2, '0') +
          '/' +
          firstDay.getFullYear().toString(),
        fulldate: firstDay.toDateString(),
      });
    }

    let data = arrayDates.map(thisDate => ({
      id: thisDate.fulldate,
      value: thisDate.partialdate,
      text: thisDate.partialdate,
    }));
    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('monthYearDropdown', data, emReviewDate);

    dropdown.populate(reviewVTSDropdown, yesNoDropdownData, emReviewVTS);
    dropdown.populate(wasOfferedHoursNotWorkedDropdown, yesNoDropdownData, offeredHoursNotWorked);
  }

  function checkRequiredFields() {
    if (!emReviewDate || emReviewDate === '') {
      monthYearDropdown.classList.add('error');
    } else {
      monthYearDropdown.classList.remove('error');
    }

    if (!emReferenceNumber || emReferenceNumber === '') {
      referenceNumberDropdown.classList.add('error');
    } else {
      referenceNumberDropdown.classList.remove('error');
    }

    if (!emNextScheduledReview || emNextScheduledReview === '') {
      nextScheduledReviewInput.classList.add('error');
    } else {
      nextScheduledReviewInput.classList.remove('error');
    }

    var selfAssessmentInpt = selfAssessmentInput.querySelector('textarea');
    if (selfAssessmentInpt.value === '') {
      selfAssessmentInput.classList.add('error');
    } else {
      selfAssessmentInput.classList.remove('error');
    }

    // provider
    var providerAssessmentInpt = providerAssessmentInput.querySelector('textarea');
    if (providerAssessmentInpt.value === '') {
      providerAssessmentInput.classList.add('error');
    } else {
      providerAssessmentInput.classList.remove('error');
    }

    // var reviewVTSInpt = reviewVTSInput.querySelector('textarea');
    // if (reviewVTSInpt.value === '') {
    //   reviewVTSInput.classList.add('error');
    // } else {
    //   reviewVTSInput.classList.remove('error');
    // }

    if (!emReviewVTS || emReviewVTS === '') {
      reviewVTSDropdown.classList.add('error');
    } else {
      reviewVTSDropdown.classList.remove('error');
    }

    
    if (!emOfferedHoursNotWorked || emOfferedHoursNotWorked === '') {
      wasOfferedHoursNotWorkedDropdown.classList.add('error');
    } else {
      wasOfferedHoursNotWorkedDropdown.classList.remove('error');
    }

    var numofferedHoursNotWorkedInput = offeredHoursNotWorkedInput.querySelector('input');

    if (numofferedHoursNotWorkedInput.value === '' || numofferedHoursNotWorkedInput.value === 0 || numofferedHoursNotWorkedInput.value <= 0) {
      offeredHoursNotWorkedInput.classList.add('error');
    } else {
      offeredHoursNotWorkedInput.classList.remove('error');
    }


    setBtnStatus();
  }

  function checknextScheduledReviewDateInput() {
    let todaydate = new Date();
    let thisNextReviewDate = new Date(emNextScheduledReview);

    var isDateBefore = dates.isBefore(thisNextReviewDate, todaydate);

    if (isDateBefore) {
      nextScheduledReviewInput.classList.add('error');
    } else {
      nextScheduledReviewInput.classList.remove('error');
    }
  }

  function setBtnStatus() {
    var hasErrors = [].slice.call(document.querySelectorAll('.error'));
    if (hasErrors.length !== 0 || formReadOnly) {
      saveBtn.classList.add('disabled');
      saveAndNewBtn.classList.add('disabled');
      updateBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
      saveAndNewBtn.classList.remove('disabled');
      updateBtn.classList.remove('disabled');
    }

    if (userId !== currentEntryUserId || !$.session.OODDelete) {
      deleteBtn.classList.add('disabled');
    } else {
      deleteBtn.classList.remove('disabled');
    }
  }

  function setupEvents() {
    monthYearDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      var dateparts = selectedOption.value.split('/');
      var updatedFullDate = new Date(dateparts[1], dateparts[0] - 1, 1);
      emReviewDateDBValue = updatedFullDate;

      if (selectedOption.value == 'SELECT') {
        emReviewDate = '';
      } else {
        emReviewDate = selectedOption.value;
      }

      emReferenceNumber = '';
      populateReferenceNumberDropdown();
      checkRequiredFields();
    });

    referenceNumberDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        emReferenceNumber = '';
      } else {
        emReferenceNumber = selectedOption.value;
      }
      checkRequiredFields();
    });

    nextScheduledReviewInput.addEventListener('change', event => {
      emNextScheduledReview = event.target.value;
      checknextScheduledReviewDateInput();
      setBtnStatus();
    });

    selfAssessmentInput.addEventListener('input', event => {
      emSummaryIndivSelfAssessment = event.target.value;
      checkRequiredFields();
    });

    // provider
    providerAssessmentInput.addEventListener('input', event => {
      emSummaryIndivProviderAssessment = event.target.value;
      checkRequiredFields();
    });

    reviewVTSDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        emReviewVTS = '';
      } else {
        emReviewVTS = selectedOption.value;
      }
      checkRequiredFields();
    });

    wasOfferedHoursNotWorkedDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        emOfferedHoursNotWorked = '';
      } else {
        emOfferedHoursNotWorked = selectedOption.value;
      }
      checkRequiredFields();
    });


    offeredHoursNotWorkedInput.addEventListener('input', event => {
      offeredHoursNotWorkCount = event.target.value;
      checkRequiredFields();
    });
	
	
    offeredHoursNotWorkedInput.addEventListener('keypress', event => {
      offeredHoursNotWorkCount = event.target.value;
      if (event.key === '.' && event.target.value.indexOf('.') !== -1) {
        // event.target.value = event.target.value.substr(0, (event.target.value.length - 1))
        event.preventDefault();
        return;
      }
        if (event.keyCode < 48 || event.keyCode > 57) {
          event.preventDefault();
          return;
      }
    });

    saveAndNewBtn.addEventListener('click', event => {
      // event.target.classList.add('disabled');
      saveAndNewBtn.classList.add('disabled');
      saveBtn.classList.add('disabled');
    });

    saveBtn.addEventListener('click', event => {
      // event.target.classList.add('disabled');
      saveAndNewBtn.classList.add('disabled');
      saveBtn.classList.add('disabled');
    });
  }
  // build the listing of OOD Entries (based off of filter settings) -- Note: will be used in future release -- JMM 02/05/2022
  async function buildOODMonthlySummariesTable() {
    const tableOptions = {
      plain: false,
      tableId: 'OODMonthlySummaryTable',
      columnHeadings: [
        'Month',
        'Individual Input on Search',
        'Potential Issues/Concerns with Progress',
        'Plan/Goals for Next Month',
      ],
      endIcon: false,
    };

    // FAKE DATA : build table data -- see forms.js line 93
    const tableData = [
      { values: ['11/2021', 'This is my input', 'This is my concern', 'Got no plans, bucko'] },
      {
        values: [
          '11/2021',
          'No, this is my input',
          'Yes, this is my concern',
          'No plans here either',
        ],
      },
    ];

    const oTable = table.build(tableOptions);
    table.populate(oTable, tableData);

    return oTable;
  }

  // build display of selected consumers with their associated "Entry" buttons
  function buildConsumerCard(consumer) {
    const consumerRow = document.createElement('div');
    var LineBr = document.createElement('br');

    consumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(consumer.card);

    consumerRow.appendChild(wrap);
    consumerRow.appendChild(LineBr);
    //  wrap.appendChild(LineBr);

    return consumerRow;
  }

  function updateFormData() {
    //var myserviceDate ="2/7/2022 12:00:00 AM";
    // '2022-02-07'
    var data = {
      consumerId,
      emReviewId,
      emReviewDate:
        emReviewDateDBValue.getFullYear() +
        '-' +
        (emReviewDateDBValue.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        '01',
      emReferenceNumber,
      // emReviewDate: UTIL.formatDateToIso(emReviewDateDBValue.split(' ')[0]),
      emNextScheduledReview: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
      emSummaryIndivSelfAssessment,
      emSummaryIndivProviderAssessment,
      emReviewVTS,
      emOfferedHoursNotWorkNumber,
      userId,
    };
    // TODO JOE: need new C# and SP for Form 8
    OODAjax.updateForm16MonthlySummary(data, function (results) {
      successfulSave.show();
      setTimeout(function () {
        successfulSave.hide();
        OOD.loadOODLanding();
      }, 2000);
    });

    function getReviewDate(DBValue) {
      if (DBValue instanceof Date && !isNaN(DBValue.valueOf())) {
        return (
          DBValue.getFullYear() + '-' + DBValue.getMonth().toString().padStart(2, '0') + '-' + '1'
        );
      } else {
        return UTIL.formatDateToIso(DBValue.split(' ')[0]);
      }
    }
  }

  function insertFormData(saveType) {
    var data = {
      consumerId,
      emReviewId,
      emReviewDate:
        emReviewDateDBValue.getFullYear() +
        '-' +
        (emReviewDateDBValue.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        '01',
      // emNextScheduledReview: emNextScheduledReviewDBValue.getFullYear() + '-' + (emNextScheduledReviewDBValue.getMonth()).toString().padStart(2, "0") + '-' + '01',
      emReferenceNumber,
      emNextScheduledReview: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
      emSummaryIndivSelfAssessment,
      emSummaryIndivProviderAssessment,
      emReviewVTS,
      emOfferedHoursNotWorkNumber,
      userId,
      serviceId,
    };
    // TODO JOE: need new C# and SP for Form 8
    OODAjax.insertForm16MonthlySummary(data, function (results) {
      successfulSave.show();
      if (saveType == 'saveandNew') {
        setTimeout(function () {
          successfulSave.hide();
          overlay.show();
          OOD.buildSummaryServicePopUp(consumerId, 'monthlySummary');
        }, 2000);
      } else {
        //save
        setTimeout(function () {
          successfulSave.hide();
          OOD.loadOODLanding();
        }, 2000);
      }
    });
  }
  // TODO JOE: need new C# and SP for Form 8 ???
  function deleteConfirmation(emReviewId) {
    var deletepopup = POPUP.build({
      id: 'deleteWarningPopup',
      classNames: 'warning',
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: async function () {
        POPUP.hide(deletepopup);
        let result = await OODAjax.deleteFormMonthlySummaryAsync(emReviewId);
        if (result.deleteFormMonthlySummaryResult === '1') {
          OOD.loadOODLanding();
        }
      },
    });
    var noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      icon: 'close',
      callback: function () {
        POPUP.hide(deletepopup);
      },
    });
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);
    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = 'Are you sure you want to delete this record?';
    deletepopup.appendChild(warningMessage);
    deletepopup.appendChild(btnWrap);
    POPUP.show(deletepopup);
  }

  return {
    init,
  };
})();
