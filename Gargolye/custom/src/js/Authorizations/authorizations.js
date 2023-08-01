const authorizations = (function () {
  // DATA
  let selectedConsumer;
  // DOM
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

    const applyBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        updateFilteredBy();
        POPUP.hide(popup);
      },
    });

    filterPopup.appendChild(planTypeDropdown);
    filterPopup.appendChild(vendorDropdown);
    filterPopup.appendChild(matchSourceDropdown);
    filterPopup.appendChild(dateWrap);
    filterPopup.appendChild(applyBtn);

    POPUP.show(filterPopup);

    populatePlanTypeDropdown();
    populateVendorDropdown();
    populateMatchSourceDropdown();

    setupFilterEvents();
  }
  function populatePlanTypeDropdown() {
    const data = [].map((b, index) => {
      return {
        value: b.billerId,
        text: b.billerName,
      };
    });
    data.unshift({ value: '%', text: 'All' });
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
    planTypeDropdown.addEventListener('change', e => {});
    vendorDropdown.addEventListener('change', e => {});
    matchSourceDropdown.addEventListener('change', e => {});
    completedDateStart.addEventListener('change', e => {});
    completedDateEnd.addEventListener('change', e => {});
    yearStartStart.addEventListener('change', e => {});
    yearStartEnd.addEventListener('change', e => {});
    yearEndStart.addEventListener('change', e => {});
    yearEndEnd.addEventListener('change', e => {});
  }
  function updateFilteredBy() {}

  function buildConsumerCard() {
    selectedConsumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(selectedConsumer.card);

    return wrap;
  }
  function buildOverviewTable() {}

  function loadPage() {
    DOM.clearActionCenter();

    const pageWrap = document.createElement('div');
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
