const OOD = (() => {
  //Inputs
  let serviceDateInput;
  let serviceDate;
  const CLEAREDSERVICEDATE = '1970-01-01';

  let newFilterBtn;
  let editEmployersBtn;
  let createFormsBtn;
  let filterRow;
  let newEntryBtn;
  let newSummaryBtn;
  let OODEntriesTable;
  let OODConsumerBtns;
  let consumerRow;
  let consumerElement;
  let filterPopup;

  // New Roster
  //let initRosterSelection;
  var enabledConsumers;
  var selectedConsumers;

  //filter
  let serviceDateStartInput;
  let serviceDateEndInput;
  let employeeDropdown;
  let servicesDropdown;
  let referenceNumbersDropdown;
  let filterValues;

  //service filter options
  const OODENTRIESFILTER = 'OODEntriesFilter';
  const FORM4MONTHLYSUMMARYSERVICES = 'Form4MonthlySummary';

  let consumerServicesDropdown;
  let consumerServicesDoneBtn;
  let selectConsumerServicePopup;
  let selectedConsumerServiceId;
  let selectedConsumerReferenceNumber;
  let selectedConsumerServiceType;
  let selectedConsumerServiceName;
  let summaryServicesDropdown;
  let summaryServicesDoneBtn;
  let selectSummaryServicePopup;

  let selectedConsumerIds;
  //let consumerServices;

  // get the Consumers selected from the Roster
  async function handleActionNavEvent(target) {
    var targetAction = target.dataset.actionNav;

    switch (targetAction) {
      case 'miniRosterDone': {
        selectedConsumers = roster2.getActiveConsumers();
        await loadOODLanding();
        DOM.toggleNavLayout();
        //		roster2.clearActiveConsumers();
        break;
      }
      case 'miniRosterCancel': {
        DOM.toggleNavLayout();
        loadApp('home');
        break;
      }
    }
  }

  // Build OOD Module Landing Page
  async function loadOODLanding() {
    DOM.clearActionCenter();
    DOM.scrollToTopOfPage();
    if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

    landingPage = document.createElement('div');

    var LineBr = document.createElement('br');

    selectedConsumers.forEach(consumer => {
      const consumerCard = buildConsumerCard(consumer);
      landingPage.appendChild(consumerCard);
    });

    filterRow = document.createElement('div');
    filterRow.classList.add('filterElement');

    const filteredBy = buildFilteredBy();

    // editEmployersBtn = buildEditEmployersBtn();

    // filterRow.appendChild(newFilterBtn);
    filterRow.appendChild(filteredBy);
    // filterRow.appendChild(editEmployersBtn);

    landingPage.appendChild(LineBr);
    landingPage.appendChild(LineBr);
    landingPage.appendChild(filterRow);
    landingPage.appendChild(LineBr);
    OODEntriesTable = await buildOODEntriesTable(filterValues);
    landingPage.appendChild(OODEntriesTable);

    DOM.ACTIONCENTER.appendChild(landingPage);
  }

  // build the listing of OOD Entries (based off of filter settings)
  async function buildOODEntriesTable(filterValues) {
    const tableOptions = {
      plain: false,
      tableId: 'OODEntriesTable',
      columnHeadings: [
        'Service Date',
        'Consumer',
        'Service',
        'Reference No',
        'User Updated',
        'Employer',
      ],
      endIcon: false,
    };

    // FAKE DATA : build table data -- see forms.js line 93
    //const tableData = [{ values : ['11/09/2021', 'Aaron, Aaron', 'LPA'], onClick : () => {OODForm4MonthlyPlacement.init(currentConsumer)}, attributes : [{ key: 'consumerId', value: '10000030' }, { key: 'contactsId', value: '686614946775283' } ]},
    //					{ values : ['11/11/2021', 'Abrams, Jackie', 'IPA'], onClick : () => {OODForm4MonthlyPlacement.init(currentConsumer)}, attributes : [{ key: 'consumerId', value: '10000241' }, { key: 'reviewId', value: '686614946775290' } ]} ];

    selectedConsumerIds = selectedConsumers.map(function (x) {
      return x.id;
    });
    //TODO JOE: FORM 8 -- Need to include in OODEntries serviceType: T1 and T2 -- Need to UpdateSP _OODEntries with EM_Service_Names.Template_Num
    const { getOODEntriesResult: OODEntries } = await OODAjax.getOODEntriesAsync(
      selectedConsumerIds.join(', '),
      filterValues.serviceDateStart,
      filterValues.serviceDateEnd,
      filterValues.userId,
      filterValues.serviceId,
      filterValues.referenceNumber, //reference number
    );

    // format the Completion Dates
    OODEntries.forEach(function (entry) {
      let newDate = new Date(entry.serviceDate);
      let theMonth = newDate.getMonth() + 1;
      let formatServiceDate =
        UTIL.leadingZero(theMonth) +
        '/' +
        UTIL.leadingZero(newDate.getDate()) +
        '/' +
        newDate.getFullYear();
      entry.serviceDate = formatServiceDate;
    });

    let tableData = OODEntries.map(entry => ({
      values: [
        entry.serviceDate,
        entry.consumerName,
        entry.serviceCode,
        entry.referenceNumber,
        entry.userUpdated,
        entry.employerName,
      ],
      //TODO JOE: add key: ServiceType value: entry.serviceType (T1 and T2)
      attributes: [
        {
          key: 'OODReportType',
          value: entry.employerName == 'Monthly Review' ? 'monthlySummary' : 'newEntry',
        },
        { key: 'consumerId', value: entry.consumerId },
        { key: 'Id', value: entry.ID },
        { key: 'userId', value: entry.userUpdated },
        { key: 'serviceType', value: entry.serviceType },
      ],
      onClick: e => {
        var rowConsumer = selectedConsumers.filter(function (x) {
          return x.id == entry.consumerId;
        });
        //TODO JOE: add to the if clause below (Form4) and add two more ifs to cover the Form 8 ---
        //TODO JOE:   if (rowConsumer[0] && e.target.attributes.OODReportType.value === 'newEntry' && e.target.attributes.serviceType.value === 'T1')
        // TODO JOE: Will also need two new SP to get the Form 8 data
        if (
          rowConsumer[0] &&
          e.target.attributes.OODReportType.value === 'newEntry' &&
          e.target.attributes.serviceType.value === 'T1'
        ) {
          OODAjax.getForm4MonthlyPlacementEditData(
            e.target.attributes.Id.value,
            function (results) {
              OODForm4MonthlyPlacement.init(
                results,
                rowConsumer[0],
                undefined,
                undefined,
                e.target.attributes.userId.value,
                undefined,
              );
            },
          );
        }
        if (
          rowConsumer[0] &&
          e.target.attributes.OODReportType.value === 'monthlySummary' &&
          e.target.attributes.serviceType.value === 'T1'
        ) {
          OODAjax.getForm4MonthlySummary(e.target.attributes.Id.value, function (results) {
            OODForm4MonthlySummary.init(
              results,
              rowConsumer[0],
              undefined,
              e.target.attributes.userId.value,
            );
          });
        }
        if (
          rowConsumer[0] &&
          e.target.attributes.OODReportType.value === 'newEntry' &&
          e.target.attributes.serviceType.value === 'T2'
        ) {
          OODAjax.getForm8CommunityBasedAssessment(
            e.target.attributes.Id.value,
            function (results) {
              communityBasedAssessmentForm.init(
                results,
                rowConsumer[0],
                undefined,
                results[0].serviceName,
                undefined,
                e.target.attributes.userId.value,
                undefined,
              );
            },
          );
        }
        if (
          rowConsumer[0] &&
          e.target.attributes.OODReportType.value === 'monthlySummary' &&
          e.target.attributes.serviceType.value === 'T2'
        ) {
          OODAjax.getForm8MonthlySummary(e.target.attributes.Id.value, function (results) {
            communityBasedAssessmentSummaryForm.init(
              results,
              rowConsumer[0],
              undefined,
              e.target.attributes.userId.value,
            );
          });
        }
        if (
          rowConsumer[0] &&
          e.target.attributes.OODReportType.value === 'newEntry' &&
          e.target.attributes.serviceType.value === 'T10'
        ) {
          OODAjax.getForm10TransportationData(
            e.target.attributes.Id.value,
            function (results) {
              OODFormTransportation.init(
                results,
                rowConsumer[0],
                undefined,
                undefined,
                e.target.attributes.userId.value,
                undefined,
              );
            },
          );
        }
      },
    }));

    const oTable = table.build(tableOptions);
    table.populate(oTable, tableData);

    return oTable;
  }

  // build display of selected consumers with their associated "Entry" buttons
  function buildConsumerCard(consumer) {
    consumerElement = document.createElement('div');
    consumerRow = document.createElement('div');
    consumerRow.classList.add('consumerHeader');

    consumer.card.classList.remove('highlighted');

    const consumerCard = document.createElement('div');
    consumerCard.classList.add('OODConsumerCard');

    consumerCard.appendChild(consumer.card);

    consumerCard.addEventListener('click', event => {
      var consumerId = event.target.dataset.consumerId;
      selectedConsumerIds = selectedConsumerIds.filter(id => id !== consumerId);
      selectedConsumers = selectedConsumers.filter(function (x) {
        return x.id !== consumerId;
      });
      roster2.removeConsumerFromActiveConsumers(consumerId);
      var activeConsumers = roster2.getActiveConsumers();
      activeConsumers.length === 0 ? roster2.showMiniRoster() : loadOODLanding();
      // event.target.parentElement.parentElement.remove();
    });

    consumerRow.appendChild(consumerCard);

    OODConsumerBtns = buildButtonBar(consumer);

    consumerRow.appendChild(OODConsumerBtns);
    var LineBr = document.createElement('br');

    consumerElement.appendChild(consumerRow);
    // consumerElement.appendChild(LineBr);

    return consumerElement;
  }

  // build display of "Entry" Buttons -- "New Entry" and "New Monthly Summary"
  function buildButtonBar(consumer) {
    const buttonBar = document.createElement('div');
    buttonBar.classList.add('OODbuttonBar');

    const entryBtn = button.build({
      text: 'New Entry',
      style: 'secondary',
      type: 'contained',
      attributes: [
        { key: 'consumerId', value: consumer.id },
        { key: 'btnType', value: 'newEntry' },
      ],
      classNames: !$.session.OODInsert ? ['newEntryBtn', 'disabled'] : ['newEntryBtn'],
      callback: () =>
        buildEntryServicePopUp(
          entryBtn.attributes.consumerid.value,
          entryBtn.attributes.btnType.value,
        ),
    });
    const summaryBtn = button.build({
      text: 'New Monthly Summary',
      style: 'secondary',
      type: 'contained',
      attributes: [
        { key: 'consumerId', value: consumer.id },
        { key: 'btnType', value: 'monthlySummary' },
      ],
      classNames: !$.session.OODInsert
        ? ['newMonthlySummaryBtn', 'disabled']
        : ['newMonthlySummaryBtn'],
      callback: () =>
        buildSummaryServicePopUp(
          summaryBtn.attributes.consumerid.value,
          summaryBtn.attributes.btnType.value,
        ),
    });
    editEmployersBtn = buildEditEmployersBtn();
    createFormsBtn = buildCreateFormsBtn();
    newFilterBtn = buildNewFilterBtn();

    const oodBtnsWrap = document.createElement('div');
    oodBtnsWrap.classList.add('OODbuttonBar__btnWrap');
    oodBtnsWrap.appendChild(entryBtn);
    oodBtnsWrap.appendChild(summaryBtn);
    oodBtnsWrap.appendChild(editEmployersBtn);
    oodBtnsWrap.appendChild(createFormsBtn);

    buttonBar.appendChild(newFilterBtn);
    buttonBar.appendChild(oodBtnsWrap);

    return buttonBar;
  }

  // build Services pop-up that displays when an "Entry" button is clicked
  async function buildEntryServicePopUp(consumerId, btnType) {
    serviceDate = UTIL.getTodaysDate();
    //	serviceDate = '2021-03-22';
    // TODO: the results of this AJAX call should be used in the call to function populateConsumerServiceCodeDropdown()
    const {
      //TODO JOE: Alter SP ANYW_OOD_getConsumerServiceCodes to include T1 (Form4) and T2 (Form8) services AND pass back T1 or T2 to include in the DDL items
      getConsumerServiceCodesResult: consumerServices,
    } = await OODAjax.getConsumerServiceCodesAsync(consumerId, serviceDate);

    if (consumerServices === undefined || consumerServices.length == 0) {
      buildNoServicesPopup(consumerId, btnType);
    } else {
      // services exist

      selectConsumerServicePopup = POPUP.build({
        header: 'Select a Service',
        hideX: true,
        id: 'selectServicePopup',
      });

      serviceDateInput = input.build({
        type: 'date',
        label: 'Service Date',
        style: 'secondary',
        value: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
        attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
      });

      serviceDateInput.addEventListener('focusout', async event => {
        serviceDate = event.target.value;
        if (serviceDate === '') {
          serviceDate = CLEAREDSERVICEDATE;
          selectedConsumerServiceId = '';
          selectedConsumerServiceType = '';
          selectedConsumerServiceName = '';
          selectedConsumerReferenceNumber = '';
          await populateConsumerServiceCodeDropdown(consumerId, serviceDate);
        } else {
          const { getConsumerServiceCodesResult: consumerServices } =
            await OODAjax.getConsumerServiceCodesAsync(consumerId, serviceDate);

          if (consumerServices === undefined || consumerServices.length == 0) {
            servicePopupCancelBtn(btnType);
            buildNoServicesPopup(consumerId, btnType);
          } else {
            populateConsumerServiceCodeDropdown(consumerId, serviceDate);
          }
        }

        serviceDateInputRequired();
        consumerServicesDropDownRequired();
      });

      // serviceDateInput.addEventListener('keydown', event => {
      // 	event.preventDefault();
      // 	event.stopPropagation();
      // });

      consumerServicesDropdown = dropdown.build({
        label: 'Services',
        dropdownId: 'consumerServicesDropdown',
      });

      consumerServicesDoneBtn = button.build({
        id: 'consumerServicesDoneBtn',
        text: 'done',
        type: 'contained',
        style: 'secondary',
        classNames: 'disabled',
        callback: () => servicePopupDoneBtn(consumerId, btnType),
      });
      this.doneButton = consumerServicesDoneBtn;

      let cancelBtn = button.build({
        id: 'consumerServicesCancelBtn',
        text: 'cancel',
        type: 'outlined',
        style: 'secondary',
        callback: () => servicePopupCancelBtn(btnType),
      });

      let btnWrap = document.createElement('div');
      var LineBr = document.createElement('br');
      btnWrap.classList.add('btnWrap');
      btnWrap.appendChild(consumerServicesDoneBtn);
      btnWrap.appendChild(cancelBtn);
      selectConsumerServicePopup.appendChild(LineBr);
      selectConsumerServicePopup.appendChild(serviceDateInput);
      selectConsumerServicePopup.appendChild(consumerServicesDropdown);
      selectConsumerServicePopup.appendChild(btnWrap);

      populateConsumerServiceCodeDropdown(consumerId, serviceDate);

      consumerServicesDropdown.addEventListener('change', event => {
        var selectedOption = event.target.options[event.target.selectedIndex];

        if (selectedOption.value == 'SELECT') {
          selectedConsumerServiceId = '';
          selectedConsumerServiceType = '';
          selectedConsumerServiceName = '';
          selectedConsumerReferenceNumber = '';
        } else {
          // TODO JOE: selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
          selectedConsumerServiceId = selectedOption.value;
          selectedConsumerServiceType = selectedOption.id;
          selectedConsumerServiceName = selectedOption.text;
          selectedConsumerReferenceNumber = selectedOption.text.split('# ')[1];
        }

        serviceDateInputRequired();
        consumerServicesDropDownRequired();
      });

      serviceDateInputRequired();
      consumerServicesDropDownRequired();

      POPUP.show(selectConsumerServicePopup);

      function consumerServicesDropDownRequired() {
        if (!selectedConsumerServiceId || selectedConsumerServiceId === '') {
          consumerServicesDropdown.classList.add('error');
          consumerServicesDoneBtn.classList.add('disabled');
        } else {
          consumerServicesDropdown.classList.remove('error');
          consumerServicesDoneBtn.classList.remove('disabled');
          serviceDateInputRequired();
        }
      }

      function serviceDateInputRequired() {
        var todayDate = new Date(UTIL.getTodaysDate().split('-').join('/'));
        var thisServiceDate = new Date(serviceDate.split('-').join('/'));
        if (
          !serviceDate ||
          serviceDate === CLEAREDSERVICEDATE ||
          dates.isAfter(thisServiceDate, todayDate)
        ) {
          serviceDateInput.classList.add('error');
          consumerServicesDoneBtn.classList.add('disabled');
        } else {
          serviceDateInput.classList.remove('error');
          consumerServicesDoneBtn.classList.remove('disabled');
        }
      }
    }
  }

  function buildNoServicesPopup(consumerId, btnType) {
    // no services for Monthly Placemnet form (ie, after clicking a consumer  "Entry" btn)
    let noServicesPopup = POPUP.build({
      header: 'No Services found',
      hideX: true,
      id: 'noServicePopup',
    });

    let OKBtn = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(noServicesPopup);
        loadOODLanding();
        //buildEntryServicePopUp(consumerId, btnType)
      },
    });

    let btnWrap = document.createElement('div');
    let warningMessage = document.createElement('p');
    warningMessage.innerHTML =
      'There are no authorized services for the selected consumer. Please contact your Advisor OOD Administrator to enter an authorization or select a different consumer.';
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(OKBtn);
    //noServicesPopup.appendChild(consumerServicesDropdown);
    noServicesPopup.appendChild(warningMessage);
    noServicesPopup.appendChild(btnWrap);
    overlay.show();
    POPUP.show(noServicesPopup);
  }

  // build Services pop-up that displays when an "Monthly Summary" button is clicked
  async function buildSummaryServicePopUp(consumerId, btnType) {
    selectSummaryServicePopup = POPUP.build({
      header: 'Select a Service',
      hideX: true,
      id: 'selectSummaryServicePopup',
    });

    summaryServicesDropdown = dropdown.build({
      label: 'Services',
      dropdownId: 'summaryServicesDropdown',
    });

    summaryServicesDoneBtn = button.build({
      id: 'summaryServicesDoneBtn',
      text: 'done',
      type: 'contained',
      style: 'secondary',
      classNames: 'disabled',
      callback: () => servicePopupDoneBtn(consumerId, btnType),
    });
    this.doneButton = summaryServicesDoneBtn;

    let cancelBtn = button.build({
      id: 'summaryServiceCancelBtn',
      text: 'cancel',
      type: 'outlined',
      style: 'secondary',
      callback: () => servicePopupCancelBtn(btnType),
    });

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(summaryServicesDoneBtn);
    btnWrap.appendChild(cancelBtn);
    selectSummaryServicePopup.appendChild(summaryServicesDropdown);
    selectSummaryServicePopup.appendChild(btnWrap);

    populateMonthlySummaryServiceCodeDropdown(consumerId);

    summaryServicesDropdown.addEventListener('change', event => {
      selectedConsumerServiceId = event.target.value;
      selectedConsumerServiceType = event.target.id;
      selectedConsumerServiceName = event.target.text;
    });

    summaryServicesDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];

      if (selectedOption.value == 'SELECT') {
        selectedConsumerServiceId = '';
        selectedConsumerServiceType = '';
        selectedConsumerServiceName = '';
      } else {
        // TODO JOE: selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
        selectedConsumerServiceId = selectedOption.value;
        selectedConsumerServiceType = selectedOption.id;
        selectedConsumerServiceName = selectedOption.text;
      }
      summaryServicesDropDownRequired();
    });

    summaryServicesDropDownRequired();

    POPUP.show(selectSummaryServicePopup);

    function summaryServicesDropDownRequired() {
      if (!selectedConsumerServiceId || selectedConsumerServiceId === '') {
        summaryServicesDropdown.classList.add('error');
        summaryServicesDoneBtn.classList.add('disabled');
      } else {
        summaryServicesDropdown.classList.remove('error');
        summaryServicesDoneBtn.classList.remove('disabled');
      }
    }
  }

  // Event for Done BTN on the Services Popup Window
  function servicePopupDoneBtn(consumerId, btnType) {
    if (btnType === 'newEntry') {
      POPUP.hide(selectServicePopup);
    } else {
      POPUP.hide(selectSummaryServicePopup);
    }

    // find the array element with consumerId
    var thisConsumer = selectedConsumers.filter(consumer => {
      return consumer.id === consumerId;
    });
    var thisselectedConsumerServiceId = selectedConsumerServiceId;
    var thisselectedConsumerReferenceNumber = selectedConsumerReferenceNumber;
    var thisselectedConsumerServiceType = selectedConsumerServiceType;
    var thisselectedConsumerServiceName = selectedConsumerServiceName.substr(4).split('- Ref #')[0];
    selectedConsumerServiceId = '';
    selectedConsumerServiceType = '';
    // TODO JOE: selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
    // TODO JOE: Need to add to the two ifs below to include selectedConsumerServiceType
    // TODO JOE: Need to add two more if statements to call init() for the two Form 8 Forms
    if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerServiceType === 'T1')
      OODForm4MonthlyPlacement.init(
        {},
        thisConsumer[0],
        thisselectedConsumerServiceId,
        thisselectedConsumerReferenceNumber,
        $.session.UserId,
        serviceDate,
        btnType,
      );
      
    if (thisConsumer && btnType === 'monthlySummary' && thisselectedConsumerServiceType === 'T1')
      OODForm4MonthlySummary.init(
        {},
        thisConsumer[0],
        thisselectedConsumerServiceId,
        $.session.UserId,
        btnType,
      );
    if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerServiceType === 'T2')
      communityBasedAssessmentForm.init(
        {},
        thisConsumer[0],
        thisselectedConsumerServiceId,
        thisselectedConsumerServiceName,
        thisselectedConsumerReferenceNumber,
        $.session.UserId,
        serviceDate,
        btnType,
      );
    if (thisConsumer && btnType === 'monthlySummary' && thisselectedConsumerServiceType === 'T2')
      communityBasedAssessmentSummaryForm.init(
        {},
        thisConsumer[0],
        thisselectedConsumerServiceId,
        $.session.UserId,
        btnType,
      );
      if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerServiceType === 'T10')
      OODFormTransportation.init(
        {},
        thisConsumer[0],
        thisselectedConsumerServiceId,
        thisselectedConsumerReferenceNumber,
        $.session.UserId,
        serviceDate,
        btnType,
      );
    // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
  }

  // Event for Cancel BTN on the Services Popup Window
  function servicePopupCancelBtn(btnType) {
    selectedConsumerServiceId = '';
    selectedConsumerReferenceNumber = '';
    if (btnType === 'newEntry') {
      POPUP.hide(selectServicePopup);
      loadOODLanding();
    } else {
      POPUP.hide(selectSummaryServicePopup);
      loadOODLanding();
    }
    // OODForm4MonthlyPlacement.init();
    // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
  }

  async function generateAndTrackFormProgress(formNumber) {
    // Hide createOODFormPopup and show the "Generating Form..." message
    //createOODFormPopup.style.display = 'none';
    pendingSave.show('Generating Form...');
  
    // Prepare data for form generation
    let data = {
      referenceNumber: filterValues.referenceNumber,
      peopleId: selectedConsumerIds[0],
      serviceCodeId: filterValues.serviceId,
      startDate: filterValues.serviceDateStart,
      endDate: filterValues.serviceDateEnd,
      userId: filterValues.userId
    };
  
    // Generate the form based on the formNumber
    let sentStatus = '';
    let success = false;
  
    switch (formNumber) {
      case 4:
        sentStatus = await OODAjax.generateForm4(data);
        success = sentStatus.generateForm4Result === 'Success' ? true : false;
        break;
  
      case 8:
        sentStatus = await OODAjax.generateForm8(data);
        success = sentStatus.generateForm8Result === 'Success' ? true : false;
        break;
  
      case 10:
        sentStatus = await OODAjax.generateForm10(data);
        success = sentStatus.generateForm10Result === 'Success' ? true : false;
        break;
    }
  
    // Hide the pendingSavePopup
    const pendingSavePopup = document.querySelector('.pendingSavePopup');
    pendingSavePopup.style.display = 'none';
  
    // Handle popup actions based on success
    if (success) {
      pendingSave.fulfill('All Done!');
      setTimeout(() => {
        const savePopup = document.querySelector('.successfulSavePopup');
        DOM.ACTIONCENTER.removeChild(savePopup);
        //POPUP.hide(createOODFormPopup);
      }, 700);
    } else {
      pendingSave.reject('Failed to Generate, please try again.');
      setTimeout(() => {
        const failPopup = document.querySelector('.failSavePopup');
        DOM.ACTIONCENTER.removeChild(failPopup);
        //createOODFormPopup.style.removeProperty('display');
      }, 2000);
    }
  }

  // build Filter button, which filters the data displayed on the OOD Entries Table
  function buildNewFilterBtn() {
    if (!filterValues)
      filterValues = {
        token: $.session.Token,
        serviceDateStart: UTIL.formatDateFromDateObj(dates.subDays(new Date(), 30)),
        serviceDateEnd: UTIL.getTodaysDate(),
        userId: $.session.UserId,
        userName: $.session.LName + ', ' + $.session.Name,
        serviceId: '%',
        serviceName: '',
        referenceNumber: '%',
      };

    return button.build({
      text: 'Filter',
      style: 'secondary',
      type: 'contained',
      // classNames: !$.session.formsInsert ? ['disabled'] : ['newPlanBtn'],
      // classNames: ['newPlanBtn'],
      callback: () => buildFilterPopUp(filterValues),
    });
  }

  // build Edit Employers  button,
  function buildEditEmployersBtn() {
    return button.build({
      text: 'Edit Employers',
      style: 'secondary',
      type: 'contained',
      id: editEmployersBtn,
      //classNames: !$.session.formsInsert ? ['disabled'] : ['newPlanBtn'],
      classNames:
        $.session.OODUpdate || $.session.OODInsert || $.session.OODView
          ? ['editEmployersBtn']
          : ['editEmployersBtn', 'disabled'],
      callback: async () => {
        OODEmployers.init();
      },
    });
  }

  // build Each Form Button button,
  function buildIndividualFormBtn(formText, formNumber) {
    return button.build({
      text: formText,
      style: 'secondary',
      type: 'contained',
      id: `OODForm${formNumber}Btn`,
      classNames: `OODForm${formNumber}Btn`,
      callback: async () => {
        generateAndTrackFormProgress(formNumber);
      },
    });
  }

  // build Create Forms button,
  function buildCreateFormsBtn() {
    return button.build({
      text: 'Create OOD Forms',
      style: 'secondary',
      type: 'contained',
      id: createFormsBtn,
      classNames: 'createFormsBtn',
      callback: () => {
        showCreateFormsPopup();
      },
    });
  }

  function showCreateFormsPopup() {
    // Popup
    const popup = POPUP.build({
      id: `createOODFormsPopup`,
      hideX: true,
      classNames: [
        'popup',
        'visible',
        'popup--filter',
        'createOODFormsPopup']
    });

    popup.setAttribute('data-popup', 'true');

    // Header
    // const header = document.createElement('h5');
    // header.innerHTML = 'Select A Form To Generate';

    const form4Btn = buildIndividualFormBtn('Form 4 - Monthly Job & Site Development', 4);
    const form8Btn = buildIndividualFormBtn('Form 8 - Work Activities and Assessment', 8);
    const form10Btn = buildIndividualFormBtn('Form 10 - Transportation', 10);

    popup.appendChild(form4Btn);
    popup.appendChild(form8Btn);
    popup.appendChild(form10Btn);

    // Append to DOM
    bodyScrollLock.disableBodyScroll(popup);
    overlay.show();
    actioncenter.appendChild(popup);
  }

  // build the display of the current Filter Settings (next to the Filter button)
  function buildFilteredBy() {
    var filteredBy = document.querySelector('.widgetFilteredBy');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
    }

    // var splitDate = selectedDate.split('-');
    var splitDate = '2021-12-28'.split('-');
    var filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(
      splitDate[2],
    )}/${splitDate[0].slice(2, 4)}`;

    const serviceStartDate = moment(filterValues.serviceDateStart, 'YYYY-MM-DD').format('M/D/YYYY');
    const serviceEndDate = moment(filterValues.serviceDateEnd, 'YYYY-MM-DD').format('M/D/YYYY');

    filteredBy.innerHTML = `
		  <div class="filteredByData">
			<p><span>Service Start Date:</span> ${serviceStartDate}&nbsp;&nbsp;&nbsp;
			<span>Service End Date:</span> ${serviceEndDate}</p>
			<p><span>Employee:</span> ${filterValues.userId == '%' ? 'ALL' : filterValues.userName}</p>
			<p><span>Service:</span> ${filterValues.serviceId == '%' ? 'ALL' : filterValues.serviceName}</p>
			<p><span>Reference Number:</span> ${
        filterValues.referenceNumber == '%' ? 'ALL' : filterValues.referenceNumber
      }</p>
		  </div>
		`;

    return filteredBy;
  }

  // build Filter pop-up that displays when an "Filter" button is clicked
  function buildFilterPopUp(filterValues) {
    // popup
    filterPopup = POPUP.build({
      classNames: ['rosterFilterPopup'],
      hideX: true,
    });
    // dropdowns & inputs
    employeeDropdown = dropdown.build({
      label: 'Employee',
      dropdownId: 'employeeDropdown',
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

    servicesDropdown = dropdown.build({
      label: 'Services',
      dropdownId: 'servicesDropdown',
    });

    referenceNumbersDropdown = dropdown.build({
      label: 'Reference Number',
      dropdownId: 'referenceNumbersDropdown',
    });

    // apply filters button
    APPLY_BTN = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
      callback: async () => filterPopupDoneBtn(),
    });
    CANCEL_BTN = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => filterPopupCancelBtn(),
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(APPLY_BTN);
    btnWrap.appendChild(CANCEL_BTN);

    // build popup

    filterPopup.appendChild(employeeDropdown);
    filterPopup.appendChild(serviceDateStartInput);
    filterPopup.appendChild(serviceDateEndInput);
    filterPopup.appendChild(servicesDropdown);
    filterPopup.appendChild(referenceNumbersDropdown);
    filterPopup.appendChild(btnWrap);

    populateEmployeeDropdown();
    populateServiceCodeDropdown();
    populateReferenceNumberDropdown();
    eventListeners();
    // setupFilterEvent();

    //return filterPopup;
    POPUP.show(filterPopup);
  }

  // Populate the employee DDL on the Filter Popup Window
  async function populateEmployeeDropdown() {
    const { getActiveEmployeesResult: employees } = await OODAjax.getActiveEmployeesAsync();
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = employees.map(employee => ({
      id: employee.userId,
      value: employee.userId,
      text: employee.userName,
    }));
    data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
    dropdown.populate('employeeDropdown', data, filterValues.userId);
  }

  // Populate the Service Code DDL on the Filter Popup Window
  async function populateServiceCodeDropdown() {
    const { getActiveServiceCodesResult: services } = await OODAjax.getActiveServiceCodesAsync(
      OODENTRIESFILTER,
    );
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = services.map(service => ({
      id: service.serviceType,
      value: service.serviceId,
      text: service.serviceName,
    }));
    data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
    dropdown.populate('servicesDropdown', data, filterValues.serviceId);
  }

  // Populate the Reference Number DDL on the Filter Popup Window
  async function populateReferenceNumberDropdown() {
    var consumerIds = selectedConsumerIds.join(', ');

    const { getConsumerReferenceNumbersResult: referencenumbers } =
      await OODAjax.getConsumerReferenceNumbersAsync(consumerIds);
    // const templates = WorkflowViewerComponent.getTemplates();
    let data = referencenumbers.map(referencenumber => ({
      id: referencenumber.referenceNumber,
      value: referencenumber.referenceNumber,
      text: referencenumber.referenceNumber,
    }));
    data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
    dropdown.populate('referenceNumbersDropdown', data, filterValues.referenceNumber);
  }

  // Populate the Service Code DDL for the 'Entry' Service Popup Window
  async function populateConsumerServiceCodeDropdown(consumerId, serviceDate) {
    const { getConsumerServiceCodesResult: services } = await OODAjax.getConsumerServiceCodesAsync(
      consumerId,
      serviceDate,
    );
    // const templates = WorkflowViewerComponent.getTemplates();

    //TODO JOE: id: should use selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
    let data = services.map(service => ({
      id: (service.serviceType === '') ? 'T10' : service.serviceType, // replace with selectedConsumerServiceType to get T1 and T2 info
      value: service.serviceId,
      text: service.serviceName + ' - Ref # ' + service.referenceNumber,
    }));
    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('consumerServicesDropdown', data);
    //selectedConsumerServiceId = '';
    // consumerServicesDropDownRequired();
    consumerServicesDoneBtn.classList.add('disabled');
    consumerServicesDropdown.classList.add('error');
  }

  // Populate the Service Code DDL for the 'Monthly Summary' Service Popup Window
  async function populateMonthlySummaryServiceCodeDropdown(consumerId) {
    const { getActiveServiceCodesResult: services } = await OODAjax.getActiveServiceCodesAsync(
      FORM4MONTHLYSUMMARYSERVICES,
    );
    // const templates = WorkflowViewerComponent.getTemplates();
    //TODO JOE: id: should use selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
    let data = services.map(service => ({
      id: service.serviceType, // replace with selectedConsumerServiceType to get T1 and T2 info
      value: service.serviceId,
      text: service.serviceName,
    }));
    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
    dropdown.populate('summaryServicesDropdown', data);
  }

  function eventListeners() {
    serviceDateStartInput.addEventListener('change', event => {
      if (UTIL.validateDateFromInput(event.target.value)) {
        filterValues.serviceDateStart = event.target.value;
      } else {
        event.target.value = filterValues.serviceDateStart;
      }
    });
    serviceDateEndInput.addEventListener('change', event => {
      if (UTIL.validateDateFromInput(event.target.value)) {
        filterValues.serviceDateEnd = event.target.value;
      } else {
        event.target.value = filterValues.serviceDateEnd;
      }
    });
    employeeDropdown.addEventListener('change', event => {
      filterValues.userId = event.target.value;
      filterValues.userName = event.target.options[event.target.selectedIndex].text;
    });
    servicesDropdown.addEventListener('change', event => {
      filterValues.serviceId = event.target.value;
      filterValues.serviceName = event.target.options[event.target.selectedIndex].text;
    });
    referenceNumbersDropdown.addEventListener('change', event => {
      filterValues.referenceNumber = event.target.value;
    });
    //routeStatusDropdown.addEventListener('change', event => {
    //  filterOpts.routeStatus = event.target.value;
    // });
  }

  async function filterPopupDoneBtn() {
    POPUP.hide(filterPopup);
    eventListeners();
    loadOODLanding();

    //let OODtable = document.getElementById('OODEntriesTable')
    // OODEntriesTable = await buildOODEntriesTable(filterValues);
    //OODtable.remove();
    // DOM.ACTIONCENTER.appendChild(OODEntriesTable);
  }

  function filterPopupCancelBtn() {
    POPUP.hide(filterPopup);
    // OODForm4MonthlyPlacement.init();
    // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
  }

  function init() {
    //DOM.clearActionCenter();
    // PROGRESS.SPINNER.show('Loading PDF Forms...');
    //loadPDFFormsLanding();

    setActiveModuleAttribute('OOD');
    DOM.clearActionCenter();
    roster2.showMiniRoster();
  }

  return {
    init,
    handleActionNavEvent,
    loadOODLanding,
    buildEntryServicePopUp,
    buildSummaryServicePopUp,
  };
})();
