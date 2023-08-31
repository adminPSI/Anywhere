const authorizations = (function () {
  // DATA
  let authData;
  let filterDropdownData;
  let selectedConsumer;
  let filterValues;
  // DOM
  let pageWrap;
  let overviewTable;
  //--
  let filterPopup;
  let planTypeDropdown;
  let vendorDropdown;
  let matchSourceDropdown;
  let completedDateStart;
  let completedDateEnd;
  let yearStartStart;
  let yearStartEnd;
  let yearEndStart;
  let yearEndEnd;
  let applyFilterBtn;

  function handleActionNavEvent(target) {
    const targetAction = target.dataset.actionNav;

    switch (targetAction) {
      case 'miniRosterDone': {
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        selectedConsumer = roster2.getActiveConsumers()[0];
        DOM.clearActionCenter();
        loadPage();
        DOM.toggleNavLayout();

        break;
      }
      case 'miniRosterCancel': {
        DOM.toggleNavLayout();
        loadApp('home');
        break;
      }
    }
  }
  function groupChildData() {
    const groupedChildren = authData.pageDataChild.reduce((obj, child) => {
      if (!obj[child.pas_id]) {
        obj[child.pas_id] = [];
        obj[child.pas_id].push(child);
      } else {
        obj[child.pas_id].push(child);
      }

      return obj;
    }, {});

    authData.pageDataChild = { ...groupedChildren };
  }

  // Filter Popup
  //----------------------------------------
  function initFilterValues() {
    filterValues = {
      planType: '%',
      vendor: '%',
      matchSource: '%',
      completedDateStart: dates
        .formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 3))
        .slice(0, 10),
      completedDateEnd: dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
      yearStartStart: dates
        .formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 3))
        .slice(0, 10),
      yearStartEnd: dates
        .formatISO(dates.addYears(new Date(new Date().setHours(0, 0, 0, 0)), 1))
        .slice(0, 10),
      yearEndStart: '',
      yearEndEnd: '',
    };
  }
  function checkFilterPopForErrors() {
    const errors = filterPopup.querySelectorAll('.error');
    const hasErrors = errors.legnth > 0 ? true : false;

    if (hasErrors) {
      applyFilterBtn.classList.add('disabled');
    } else {
      applyFilterBtn.classList.remove('disabled');
    }
  }
  function showFilterPopup() {
    filterPopup = POPUP.build({
      classNames: 'authorizationsReviewFilterPopup',
    });

    // Dropdowns
    planTypeDropdown = dropdown.build({
      dropdownId: 'planTypeDropdown',
      label: 'Plan Type',
      style: 'secondary',
    });
    vendorDropdown = dropdown.build({
      dropdownId: 'vendorDropdown',
      label: 'PL Vendor',
      style: 'secondary',
    });
    matchSourceDropdown = dropdown.build({
      dropdownId: 'matchSourceDropdown',
      label: 'Match Source',
      style: 'secondary',
    });

    // Date Inputs
    const dateWrap = document.createElement('div');
    completedDateStart = input.build({
      type: 'date',
      label: 'Completed Date (Start)',
      style: 'secondary',
      value: filterValues.completedDateStart,
    });
    completedDateEnd = input.build({
      type: 'date',
      label: 'Completed Date (End)',
      style: 'secondary',
      value: filterValues.completedDateEnd,
    });
    yearStartStart = input.build({
      type: 'date',
      label: 'Year Start (Start)',
      style: 'secondary',
      value: filterValues.yearStartStart,
    });
    yearStartEnd = input.build({
      type: 'date',
      label: 'Year Start (End)',
      style: 'secondary',
      value: filterValues.yearStartEnd,
    });
    yearEndStart = input.build({
      type: 'date',
      label: 'Year End (Start)',
      style: 'secondary',
      value: filterValues.yearEndStart,
    });
    yearEndEnd = input.build({
      type: 'date',
      label: 'Year End (End)',
      style: 'secondary',
      value: filterValues.yearEndEnd,
    });
    dateWrap.appendChild(completedDateStart);
    dateWrap.appendChild(completedDateEnd);
    dateWrap.appendChild(yearStartStart);
    dateWrap.appendChild(yearStartEnd);
    dateWrap.appendChild(yearEndStart);
    dateWrap.appendChild(yearEndEnd);

    const btnWrap = document.createElement('div');
    applyFilterBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    const cancelFilterBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: function () {
        POPUP.hide(filterPopup);
      },
    });
    btnWrap.appendChild(applyFilterBtn);
    btnWrap.appendChild(cancelFilterBtn);

    filterPopup.appendChild(planTypeDropdown);
    filterPopup.appendChild(vendorDropdown);
    filterPopup.appendChild(matchSourceDropdown);
    filterPopup.appendChild(dateWrap);
    filterPopup.appendChild(btnWrap);

    POPUP.show(filterPopup);

    populatePlanTypeDropdown();
    populateVendorDropdown();
    populateMatchSourceDropdown();

    setupFilterEvents();
  }
  function populatePlanTypeDropdown() {
    const data = [
      { value: '%', text: 'All' },
      { text: 'Final', value: 'F' },
      { text: 'Initial', value: 'I' },
      { text: 'Revision', value: 'V' },
      { text: 'Redetermination', value: 'R' },
    ];
    dropdown.populate(planTypeDropdown, data, filterValues.planType);
  }
  function getPlanTypeFullName(value) {
    switch (value) {
      case 'F': {
        return 'Final';
      }
      case 'I': {
        return 'Initial';
      }
      case 'V': {
        return 'Revision';
      }
      case 'R': {
        return 'Redetermination';
      }
      default: {
        return 'All';
      }
    }
  }
  function populateVendorDropdown() {
    const data = filterDropdownData.planVendors.map(pv => {
      return {
        value: pv.vendorId,
        text: pv.vendorName,
      };
    });
    data.unshift({ value: '%', text: 'All' });
    dropdown.populate(vendorDropdown, data, filterValues.vendor);
  }
  function populateMatchSourceDropdown() {
    const data = filterDropdownData.matchSources.map(ms => {
      return {
        value: ms.code,
        text: ms.caption,
      };
    });
    data.unshift({ value: '%', text: 'All' });
    dropdown.populate(matchSourceDropdown, data, filterValues.matchSource);
  }
  function setupFilterEvents() {
    const newFilterValues = {};

    planTypeDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      newFilterValues.planType = selectedOption.value;
    });
    vendorDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      newFilterValues.vendor = selectedOption.value;
    });
    matchSourceDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      newFilterValues.matchSource = selectedOption.value;
    });
    completedDateStart.addEventListener('change', e => {
      newFilterValues.completedDateStart = e.target.value;
      if (e.target.value === '') {
        completedDateStart.classList.add('error');
      } else {
        completedDateStart.classList.remove('error');
      }
      checkFilterPopForErrors();
    });
    completedDateEnd.addEventListener('change', e => {
      newFilterValues.completedDateEnd = e.target.value;
      if (e.target.value === '') {
        completedDateEnd.classList.add('error');
      } else {
        completedDateEnd.classList.remove('error');
      }
      checkFilterPopForErrors();
    });
    yearStartStart.addEventListener('change', e => {
      newFilterValues.yearStartStart = e.target.value;
      if (e.target.value === '') {
        yearStartStart.classList.add('error');
      } else {
        yearStartStart.classList.remove('error');
      }
      checkFilterPopForErrors();
    });
    yearStartEnd.addEventListener('change', e => {
      newFilterValues.yearStartEnd = e.target.value;
      if (e.target.value === '') {
        yearStartEnd.classList.add('error');
      } else {
        yearStartEnd.classList.remove('error');
      }
      checkFilterPopForErrors();
    });
    yearEndStart.addEventListener('change', e => {
      newFilterValues.yearEndStart = e.target.value;
    });
    yearEndEnd.addEventListener('change', e => {
      newFilterValues.yearEndEnd = e.target.value;
    });
    applyFilterBtn.addEventListener('click', async e => {
      POPUP.hide(filterPopup);
      filterValues = { ...filterValues, ...newFilterValues };

      authData = await authorizationsAjax.getPageData({
        token: $.session.Token,
        selectedConsumerId: selectedConsumer.id,
        code: '%',
        matchSource: filterValues.matchSource,
        vendorId: filterValues.vendor,
        planType: filterValues.planType,
        planYearStartStart: UTIL.formatDateToIso(filterValues.yearStartStart),
        planYearStartEnd: UTIL.formatDateToIso(filterValues.yearStartEnd),
        planYearEndStart: UTIL.formatDateToIso(filterValues.yearEndStart),
        planYearEndEnd: UTIL.formatDateToIso(filterValues.yearEndEnd),
        completedDateStart: UTIL.formatDateToIso(filterValues.completedDateStart),
        completedDateEnd: UTIL.formatDateToIso(filterValues.completedDateEnd),
      });

      updateFilteredBy();
      buildOverviewTable();
    });
  }
  function updateFilteredBy() {}

  //----------------------------------------
  function buildConsumerCard() {
    selectedConsumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(selectedConsumer.card);

    return wrap;
  }
  function buildOverviewTable() {
    groupChildData();

    overviewTable = document.createElement('div');
    overviewTable.classList.add('authTable');

    const mainHeading = document.createElement('div');
    mainHeading.classList.add('authTable__header');
    mainHeading.innerHTML = `
      <div>Completed</div>
      <div>Year Start</div>
      <div>Year End</div>
      <div>Plan Type</div>
      <div>PL Vendor</div>
      <div>Match Source</div>
    `;
    overviewTable.appendChild(mainHeading);

    authData.pageDataParent.forEach(parent => {
      const pasID = parent.pas_id;

      const rowWrap = document.createElement('div');
      rowWrap.classList.add('authTable__subTableWrap');

      // TOP LEVEL ROW
      //---------------------------------
      const mainDataRow = document.createElement('div');
      mainDataRow.classList.add('authTable__mainDataRow', 'authTable__dataRow');
      mainDataRow.innerHTML = `
        <div>${UTIL.formatDateFromIso(parent.CompletionDate.split('T')[0])}</div>
        <div>${UTIL.formatDateFromIso(parent.plan_year_start.split('T')[0])}</div>
        <div>${UTIL.formatDateFromIso(parent.plan_year_end.split('T')[0])}</div>
        <div>${getPlanTypeFullName(parent.plantype)}</div>
        <div>${parent.plVendorId ? parent.plVendorId : ''}</div>
        <div>${parent.sourceAndCaption}</div>
      `;
      rowWrap.appendChild(mainDataRow);

      // SUB ROWS
      //---------------------------------
      const subRowWrap = document.createElement('div');
      subRowWrap.classList.add('authTable__subRowWrap');

      const subHeading = document.createElement('div');
      subHeading.classList.add('authTable__subHeader');
      subHeading.innerHTML = `
        <div>#</div>
        <div>Service</div>
        <div>Service Code</div>
        <div>Begin Date</div>
        <div>End Date</div>
        <div>Units</div>
        <div>Frequency</div>
        <div>Vendor</div>
        <div>Auth Cost FY1</div>
        <div>Auth Cost FY2</div>
      `;
      subRowWrap.appendChild(subHeading);

      authData.pageDataChild[pasID].sort((a, b) => {
        return parseInt(a.itemnum) - parseInt(b.itemnum);
      });

      authData.pageDataChild[pasID].forEach(child => {
        const subDataRow = document.createElement('div');
        subDataRow.classList.add('authTable__subDataRow', 'authTable__dataRow');
        subDataRow.innerHTML = `
          <div>${child.itemnum}</div>
          <div>${child.description}</div>
          <div>${child.service_code}</div>
          <div>${UTIL.abbreviateDateYear(
            UTIL.formatDateFromIso(child.BeginDate.split('T')[0]),
          )}</div>
          <div>${UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.EndDate.split('T')[0]))}</div>
          <div>${child.MaxUnits}</div>
          <div>${child.frequency}</div>
          <div>${child.vendorName}</div>
          <div>${child.authCostFY1}</div>
          <div>${child.authCostFY2}</div>
        `;
        subRowWrap.appendChild(subDataRow);
      });

      // EVENT
      //---------------------------------
      mainDataRow.addEventListener('click', e => {
        if (subRowWrap.classList.contains('active')) {
          subRowWrap.classList.remove('active');
        } else {
          subRowWrap.classList.add('active');
        }
      });

      // ASSEMBLY
      //---------------------------------
      rowWrap.appendChild(subRowWrap);
      overviewTable.appendChild(rowWrap);
    });

    if (overviewTable) pageWrap.removeChild(overviewTable);
    pageWrap.appendChild(overviewTable);
  }

  async function loadPage() {
    initFilterValues();

    pageWrap = document.createElement('div');
    const consumerCard = buildConsumerCard();

    filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtn',
      callback: showFilterPopup,
    });

    pageWrap.appendChild(consumerCard);
    pageWrap.appendChild(filterBtn);
    DOM.ACTIONCENTER.appendChild(pageWrap);

    authData = await authorizationsAjax.getPageData({
      token: $.session.Token,
      selectedConsumerId: selectedConsumer.id,
      code: '%',
      matchSource: filterValues.vendor,
      vendorId: filterValues.vendor,
      planType: filterValues.planType,
      planYearStartStart: filterValues.yearStartStart,
      planYearStartEnd: filterValues.yearStartEnd,
      planYearEndStart: filterValues.yearEndStart,
      planYearEndEnd: filterValues.yearEndEnd,
      completedDateStart: filterValues.completedDateStart,
      completedDateEnd: filterValues.completedDateEnd,
    });
    filterDropdownData = await authorizationsAjax.getFilterDropdownData({
      token: $.session.Token,
    });

    buildOverviewTable();
  }

  function init() {
    setActiveModuleAttribute('authorizations');
    DOM.clearActionCenter();
    roster2.showMiniRoster();
  }

  return {
    handleActionNavEvent,
    init,
  };
})();
