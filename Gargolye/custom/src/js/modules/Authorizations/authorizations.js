const authorizations = (function () {
  // DATA
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

  // Filter Popup
  //----------------------------------------
  function initFilterValues() {
    filterValues = {
      planType: '%',
      vendor: '%',
      matchSource: '%',
      completedDateStart: dates
        .formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 2))
        .slice(0, 10),
      completedDateEnd: dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
      yearStartStart: dates
        .formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 2))
        .slice(0, 10),
      yearStartEnd: dates
        .formatISO(dates.addYears(new Date(new Date().setHours(0, 0, 0, 0)), 1))
        .slice(0, 10),
      yearEndStart: '',
      yearEndEnd: '',
    };
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
  function populateVendorDropdown() {
    const data = [].map((b, index) => {
      return {
        value: b.billerId,
        text: b.billerName,
      };
    });
    data.unshift({ value: '%', text: 'All' });
    dropdown.populate(vendorDropdown, data, filterValues.vendor);
  }
  function populateMatchSourceDropdown() {
    const data = [].map((b, index) => {
      return {
        value: b.billerId,
        text: b.billerName,
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
    });
    completedDateEnd.addEventListener('change', e => {
      newFilterValues.completedDateEnd = e.target.value;
    });
    yearStartStart.addEventListener('change', e => {
      newFilterValues.yearStartStart = e.target.value;
    });
    yearStartEnd.addEventListener('change', e => {
      newFilterValues.yearStartEnd = e.target.value;
    });
    yearEndStart.addEventListener('change', e => {
      newFilterValues.yearEndStart = e.target.value;
    });
    yearEndEnd.addEventListener('change', e => {
      newFilterValues.yearEndEnd = e.target.value;
    });
    applyFilterBtn.addEventListener('click', async e => {
      POPUP.hide(filterPopup);
      filterValues = newFilterValues;

      authData = await authorizationsAjax.getPageData({
        token: $.session.Token,
        code: '',
        matchSource: filterValues.matchSource,
        vendorId: filterValues.vendor,
        planType: filterValues.planType,
        planYearStartStart: filterValues.yearStartStart,
        planYearStartEnd: filterValues.yearStartEnd,
        planYearEndStart: filterValues.yearEndStart,
        planYearEndEnd: filterValues.yearEndEnd,
        completedDateStart: filterValues.completedDateStart,
        completedDateEnd: filterValues.completedDateEnd,
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
    console.table(authData);
    overviewTable = document.createElement('div');

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
      code: filterValues.vendor,
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
