const addEditOutcomeServices = (() => {
  let outcomeServicesData;
  let selectedConsumer;
  let filterValues;
  let newFilterValues;
  let filterRow;
  let addOutCome;
  let backBtn;
  // DOM
  let pageWrap;
  let overviewTable;
  //--
  let filterPopup;
  let outcomeTypeDropdown;
  let effectiveDateStart;
  let effectiveDateEnd;
  let applyFilterBtn;
  let btnWrap;
  let outcomeTypeBtnWrap;
  let effectiveDateBtnWrap;

  async function init(selectedConsume) {
    selectedConsumer = selectedConsume;
    buildNewOutcomeServices();
  }

  async function buildNewOutcomeServices() {
    DOM.clearActionCenter();
    DOM.scrollToTopOfPage();
    initFilterValues();
    document.getElementById('mini_roster').style.display = 'none';
    pageWrap = document.createElement('div');
    const consumerCard = buildConsumerCard();
    const backbtnWrap = document.createElement('div');
    backbtnWrap.classList.add('addOutcomeBtnWrap');

    filteredByData = buildFilteredByData();
    addOutCome = addOutcomesButton();
    backBtn = backButton();
    backbtnWrap.appendChild(addOutCome);
    backbtnWrap.appendChild(backBtn);

    pageWrap.appendChild(consumerCard);
    pageWrap.appendChild(backbtnWrap);
    pageWrap.appendChild(filteredByData);
    DOM.ACTIONCENTER.appendChild(pageWrap);

    if ($.session.InsertOutcomes == true) {
      addOutCome.classList.remove('disabled');
    } else {
      addOutCome.classList.add('disabled');
    }

    const spinner = PROGRESS.SPINNER.get('Gathering Data...');
    pageWrap.appendChild(spinner);

    outcomeServicesData = await outcomesAjax.getOutcomeServicsPageData({
      token: $.session.Token,
      selectedConsumerId: selectedConsumer.id,
      outcomeType: filterValues.outcomeTypeName,
      effectiveDateStart: filterValues.effectiveDateStart,
      effectiveDateEnd: filterValues.effectiveDateEnd,
      appName: $.session.applicationName,
    });

    pageWrap.removeChild(spinner);
    buildOverviewTable();
  }

  function addOutcomesButton() {
    return button.build({
      text: 'ADD NEW OUTCOME',
      style: 'secondary',
      type: 'contained',
      classNames: 'reportBtn',
      callback: async () => {
        if (!addOutCome.classList.contains('disabled')) {
          addOutcomes.init(selectedConsumer, 0);
        }
      },
    });
  }

  function backButton() {
    return button.build({
      text: 'BACK',
      style: 'secondary',
      type: 'outlined',
      callback: async () => {
        document.getElementById('mini_roster').style.display = 'block';
        outcomes.backToOutcomeLoad(selectedConsumer);
      },
    });
  }

  function initFilterValues() {
    filterValues = {
      outcomeType: '%',
      effectiveDateStart: dates.formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 10)).slice(0, 10),
      effectiveDateEnd: dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
      outcomeTypeName: '%',
    };
  }

  function buildConsumerCard() {
    selectedConsumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(selectedConsumer.card);

    return wrap;
  }

  function buildFilteredByData() {
    var currentFilterDisplay = document.querySelector('.filteredByData');

    effectiveDateEnd = `${formatDate(filterValues.effectiveDateEnd)}`;

    if (!currentFilterDisplay) {
      currentFilterDisplay = document.createElement('div');
      currentFilterDisplay.classList.add('filteredByData');
      filterButtonSet();
      currentFilterDisplay.appendChild(btnWrap);
    }

    if (filterValues.outcomeType === '%') {
      btnWrap.appendChild(outcomeTypeBtnWrap);
      btnWrap.removeChild(outcomeTypeBtnWrap);
    } else {
      btnWrap.appendChild(outcomeTypeBtnWrap);
      if (document.getElementById('outcomeTypeBtn') != null)
        document.getElementById('outcomeTypeBtn').innerHTML = 'Outcome Type: ' + filterValues.outcomeTypeName;
    }

    if (effectiveDateEnd == '') {
      btnWrap.appendChild(effectiveDateBtnWrap);
      btnWrap.removeChild(effectiveDateBtnWrap);
    } else {
      btnWrap.appendChild(effectiveDateBtnWrap);
      if (document.getElementById('effectiveDateBtn') != null)
        document.getElementById('effectiveDateBtn').innerHTML =
          'Effective As Of: ' + effectiveDateEnd;
    }

    return currentFilterDisplay;
  }

  function filterButtonSet() {
    filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtnNew',
      callback: () => {
        showFilterPopup('ALL');
      },
    });

    outcomeTypeBtn = button.build({
      id: 'outcomeTypeBtn',
      text: 'Outcome Type: ' + filterValues.outcomeType,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('outcomeTypeBtn');
      },
    });
    outcomeTypeCloseBtn = button.build({
      icon: 'Delete',
      style: 'secondary',
      type: 'text',
      classNames: 'filterCloseBtn',
      callback: () => {
        closeFilter('outcomeTypeBtn');
      },
    });

    effectiveDateBtn = button.build({
      id: 'effectiveDateBtn',
      text: 'Effective As Of: ' + effectiveDateEnd,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('effectiveDateBtn');
      },
    });

    btnWrap = document.createElement('div');
    btnWrap.classList.add('filterBtnWrap');
    btnWrap.appendChild(filterBtn);

    outcomeTypeBtnWrap = document.createElement('div');
    outcomeTypeBtnWrap.classList.add('filterSelectionBtnWrap');
    outcomeTypeBtnWrap.appendChild(outcomeTypeBtn);
    outcomeTypeBtnWrap.appendChild(outcomeTypeCloseBtn);
    btnWrap.appendChild(outcomeTypeBtnWrap);

    effectiveDateBtnWrap = document.createElement('div');
    effectiveDateBtnWrap.classList.add('filterSelectionBtnWrap');
    effectiveDateBtnWrap.appendChild(effectiveDateBtn);
    btnWrap.appendChild(effectiveDateBtnWrap);
  }

  function closeFilter(closeFilter) {
    if (closeFilter == 'outcomeTypeBtn') {
      filterValues.outcomeType = '%';
      filterValues.outcomeTypeName = '%';
      newFilterValues.outcomeType = '%';
      newFilterValues.outcomeTypeName = '%';
    }
    applyFilter();
  }

  function showFilterPopup(IsShow) {
    filterPopup = POPUP.build({});

    // Dropdowns
    outcomeTypeDropdown = dropdown.build({
      dropdownId: 'outcomeTypeDropdown',
      label: 'Outcome Type',
      style: 'secondary',
      value: filterValues.outcomeType,
    });

    // Date Inputs
    const dateWrap = document.createElement('div');
    effectiveDateEndInput = input.build({
      type: 'date',
      label: 'Effective As Of',
      style: 'secondary',
      value: filterValues.effectiveDateEnd,
    });

    if (IsShow == 'ALL' || IsShow == 'effectiveDateBtn') {    
      dateWrap.appendChild(effectiveDateEndInput);
    }

    const btnFilterWrap = document.createElement('div');
    btnFilterWrap.classList.add('btnWrap');
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
    btnFilterWrap.appendChild(applyFilterBtn);
    btnFilterWrap.appendChild(cancelFilterBtn);

    if (IsShow == 'ALL' || IsShow == 'outcomeTypeBtn') filterPopup.appendChild(outcomeTypeDropdown);

    filterPopup.appendChild(dateWrap);
    filterPopup.appendChild(btnFilterWrap);

    POPUP.show(filterPopup);
    populateOutcomeTypeDropdown();
    setupFilterEvents();
  }
  function setupFilterEvents() {
    newFilterValues = {};

    outcomeTypeDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      newFilterValues.outcomeType = selectedOption.value;
      newFilterValues.outcomeTypeName = selectedOption.text;
    });

    effectiveDateEndInput.addEventListener('change', e => {
      if (e.target.value === '') {
        effectiveDateEndInput.classList.add('error');
      } else {
        effectiveDateEndInput.classList.remove('error');
        newFilterValues.effectiveDateEnd = e.target.value;
      }
      checkFilterPopForErrors();
    });
    applyFilterBtn.addEventListener('click', async e => {
      POPUP.hide(filterPopup);
      if (!applyFilterBtn.classList.contains('disabled')) {
        applyFilter();
      }
    });
  }

  async function populateOutcomeTypeDropdown() {
    const { getOutcomeTypeDropDownResult: OutcomeType } = await outcomesAjax.getOutcomeTypeDropDownAsync();
    let outcomeTypeData = OutcomeType.map(outcomeTypes => ({
      id: outcomeTypes.Goal_Type_ID,
      value: outcomeTypes.Goal_Type_ID,
      text: outcomeTypes.goal_type_description,
    }));
    outcomeTypeData.unshift({ id: '%', value: '%', text: 'ALL' });
    dropdown.populate('outcomeTypeDropdown', outcomeTypeData, filterValues.outcomeType);
  }

  function checkFilterPopForErrors() {
    const errors = [...filterPopup.querySelectorAll('.error')];
    const hasErrors = errors.length > 0 ? true : false;

    if (hasErrors) {
      applyFilterBtn.classList.add('disabled');
    } else {
      applyFilterBtn.classList.remove('disabled');
    }
  }

  async function applyFilter() {
    filterValues = { ...filterValues, ...newFilterValues };

    const spinner = PROGRESS.SPINNER.get('Gathering Data...');
    pageWrap.removeChild(overviewTable);
    pageWrap.appendChild(spinner);

    outcomeServicesData = await outcomesAjax.getOutcomeServicsPageData({
      token: $.session.Token,
      selectedConsumerId: selectedConsumer.id,
      outcomeType: filterValues.outcomeTypeName == 'ALL' ? '%' : filterValues.outcomeTypeName,
      effectiveDateStart: filterValues.effectiveDateStart,
      effectiveDateEnd: filterValues.effectiveDateEnd,
      appName: $.session.applicationName,
    });

    pageWrap.removeChild(spinner);

    buildOverviewTable();
    const newfilteredByData = buildFilteredByData();
    pageWrap.replaceChild(newfilteredByData, filteredByData);
    filteredByData = newfilteredByData;
  }

  function buildOverviewTable() {
    groupChildData();

    overviewTable = document.createElement('div');
    overviewTable.classList.add('outcomeTable');

    const mainHeading = document.createElement('div');
    mainHeading.classList.add('outcomeTable__header');
    mainHeading.innerHTML = `
      <div></div>
      <div>Outcome Type</div>
      <div>Outcome Statement</div>
      <div>Start Date</div>
      <div>End Date</div>  
      <div></div>
    `;
    overviewTable.appendChild(mainHeading);

    outcomeServicesData.pageDataParent.forEach(parent => {
      const goalID = parent.goal_id;
      var eventName;
      var startDate =
        parent.effectiveDateStart == null || ''
          ? ''
          : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(parent.effectiveDateStart.split('T')[0]));
      var endDate =
        parent.effectiveDateEnd == null || ''
          ? ''
          : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(parent.effectiveDateEnd.split('T')[0]));
      const rowWrap = document.createElement('div');
      rowWrap.classList.add('outcomeTable__subTableWrap');

      // TOP LEVEL ROW
      //---------------------------------
      const mainDataRow = document.createElement('div');
      mainDataRow.classList.add('outcomeTable__mainDataRow', 'outcomeTable__dataRow');
      mainDataRow.value = parent.goal_id;
      const endIcon = document.createElement('div');
      endIcon.classList.add('outcomeTable__endIcon');

      const toggleIcon = document.createElement('div');
      toggleIcon.id = 'authToggle';
      toggleIcon.classList.add('outcomeTable__endIcon');
      toggleIcon.innerHTML = icons['keyArrowRight'];
      mainDataRow.innerHTML = `       
        <div>${parent.outcomeType}</div>
        <div>${parent.outcomeStatement}</div>
        <div>${startDate}</div>
        <div>${endDate}</div>               
      `;
      mainDataRow.prepend(toggleIcon);
      if ($.session.InsertServices == true) {
        endIcon.innerHTML = icons['add'];
      } else {
        endIcon.innerHTML = `<div></div>`;
      }
      mainDataRow.appendChild(endIcon);
      rowWrap.appendChild(mainDataRow);

      // SUB ROWS
      //---------------------------------
      const subRowWrap = document.createElement('div');
      subRowWrap.classList.add('outcomeTable__subRowWrap');

      const subHeading = document.createElement('div');
      subHeading.classList.add('outcomeTable__subHeader');
      subHeading.innerHTML = `
        <div></div>
        <div>Service Type</div>
        <div>Service Statement</div>
        <div>Frequency</div>
        <div>Start Date</div>
        <div>End Date</div>
      `;
      subRowWrap.appendChild(subHeading);

      if (outcomeServicesData.pageDataChild[goalID]) {
        outcomeServicesData.pageDataChild[goalID].sort((a, b) => {
          return parseInt(a.itemnum) - parseInt(b.itemnum);
        });

        outcomeServicesData.pageDataChild[goalID].forEach(child => {
          const subDataRow = document.createElement('div');
          var startDate =
            child.serviceStartDate == null || ''
              ? ''
              : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.serviceStartDate.split('T')[0]));
          var endDate =
            child.serviceEndDate == null || ''
              ? ''
              : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.serviceEndDate.split('T')[0]));
          var serviceTyp = child.serviceType == null ? '' : child.serviceType;
          subDataRow.classList.add('outcomeTable__subDataRow', 'outcomeTable__dataRow');
          subDataRow.innerHTML = `
            <div></div>
            <div>${serviceTyp}</div>     
            <div>${child.serviceStatement}</div>
            <div>${child.frequency}</div>
            <div>${startDate}</div>
            <div>${endDate}</div>            
          `;
          subRowWrap.appendChild(subDataRow);

          subDataRow.addEventListener('click', e => {
            if ($.session.UpdateServices == true) {
              addServicesForm.init(selectedConsumer, child.objective_Id, 0);
            }
          });
        });
      }

      // EVENT
      //---------------------------------
      mainDataRow.addEventListener('click', e => {
        var goalID = e.currentTarget.value;
        if (eventName != 'toggle' && eventName != 'add') {
          if ($.session.UpdateOutcomes == true) {
            addOutcomes.init(selectedConsumer, goalID);
          }
        }
        eventName = '';
      });

      toggleIcon.addEventListener('click', e => {
        const toggle = document.querySelector('#authToggle');
        eventName = 'toggle';
        if (subRowWrap.classList.contains('active')) {
          // close it
          subRowWrap.classList.remove('active');
          toggleIcon.innerHTML = icons.keyArrowRight;
        } else {
          // open it
          subRowWrap.classList.add('active');
          toggleIcon.innerHTML = icons.keyArrowDown;
        }
      });

      endIcon.addEventListener('click', e => {
        eventName = 'add';
        addServicesForm.init(selectedConsumer, 0, goalID);
      });

      // ASSEMBLY
      //---------------------------------
      rowWrap.appendChild(subRowWrap);
      overviewTable.appendChild(rowWrap);
    });

    pageWrap.appendChild(overviewTable);
  }

  function groupChildData() {
    if (!outcomeServicesData.pageDataChild) {
      return;
    }

    const groupedChildren = outcomeServicesData.pageDataChild.reduce((obj, child) => {
      if (!obj[child.goal_id]) {
        obj[child.goal_id] = [];
        obj[child.goal_id].push(child);
      } else {
        obj[child.goal_id].push(child);
      }

      return obj;
    }, {});

    outcomeServicesData.pageDataChild = { ...groupedChildren };
  }

  function formatDate(date) {
    if (!date) return '';

    return UTIL.abbreviateDateYear(UTIL.formatDateFromIso(date.split('T')[0]));
  }

  return {
    init,
    buildNewOutcomeServices,
  };
})();
