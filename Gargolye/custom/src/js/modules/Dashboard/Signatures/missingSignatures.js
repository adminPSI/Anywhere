const signatureWidget = (function () {
  let signaturePlanStatus;
  let signatureWidgetGroupId;
  let signatureWidgetGroupName;
  // DOM
  //-----------------------
  let widget;
  let widgetBody;
  let filterPopup;
  let applyFiltersBtn;
  let cancelFilterBtn;
  let planStatusDropdown;
  let groupDropdown;

  function populatePlanStatusDropdown() {
    var data = [
      { value: '0', text: 'All' },
      { value: '1', text: 'Draft' },
      { value: '2', text: 'Complete' },
    ];

    dropdown.populate('absentWidgetLocations', data, absentWidgetLocationId);
  }

  function buildFilterPopup() {
    var widgetFilter = widget.querySelector('.widget__filters');
    if (widgetFilter) return;

    filterPopup = dashboard.buildFilterPopup();

    planStatusDropdown = dropdown.build({
      dropdownId: 'missingSignaturesPlanStatus',
      label: 'Plan Status',
      style: 'secondary',
      readonly: false,
    });
    groupDropdown = dropdown.build({
      dropdownId: 'missingSignaturesGroup',
      label: 'Group',
      style: 'secondary',
      readonly: false,
    });
    applyFiltersBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    cancelFilterBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(applyFiltersBtn);
    btnWrap.appendChild(cancelFilterBtn);

    filterPopup.appendChild(planStatusDropdown);
    filterPopup.appendChild(groupDropdown);
    filterPopup.appendChild(btnWrap);
    widget.insertBefore(filterPopup, widgetBody);

    populatePlanStatusDropdown(results);
  }
  function displayFilteredBy() {
    var filteredBy = widget.querySelector('.widgetFilteredBy');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
      // TODO: append filteredBy
    }

    filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Plan Status:</span> ${signaturePlanStatus}</p>
      <p><span>Group:</span> ${signatureWidgetGroupName}</p>
    </div>`;
  }

  function populateMissingSignatures(data) {
    const tableOptions = {
      plain: false,
      columnHeadings: ['Individual', 'PY Start Date', 'Plan Type'],
      tableId: 'planOverviewTable',
    };

    const tableData = [];

    data.forEach(d => {
      const type = d.planType === 'A' ? 'Annual' : 'Revision';
      const startDate = d.planYearStart.split(' ')[0];
      const endDate = d.planYearEnd.split(' ')[0];
      const effectiveStart = d.effectiveStart.split(' ')[0];
      const effectiveEnd = d.effectiveEnd.split(' ')[0];
      const reviewDate = pd.reviewDate ? pd.reviewDate.split(' ')[0] : 'n/a';

      const individuals = d.individual.split(',');
      individuals.forEach(i => {
        tableData.push({
          values: [i, startDate, type],
          onClick: () => {
            plan.setPlanId(d.planID);
            plan.setPlanType(d.planType);
            plan.setPlanStatus(d.planStatus);

            planDates.setReviewPlanDates({
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              effectiveStart: new Date(effectiveStart),
              effectiveEnd: new Date(effectiveEnd),
              reviewDate: new Date(reviewDate),
            });

            $.loadedApp = 'plan';
            setActiveModuleAttribute('plan');
            UTIL.toggleMenuItemHighlight('plan');
            DOM.clearActionCenter();
            plan.buildPlanPage(['i']);
          },
        });
      });
    });
  }

  function init() {
    if (!signaturePlanStatus) signaturePlanStatus = '0';
    if (!signatureWidgetGroupId) signatureWidgetGroupId = '0';
    if (!signatureWidgetGroupName) signatureWidgetGroupName = 'Everyone';

    widget = document.getElementById('dashabsentconsumers');
    widgetBody = widget.querySelector('.widget__body');

    buildFilterPopup();
    displayFilteredBy();

    missingSignatureAjax.getMissingPlanSignatures({ token: $.session.Token }, res => {
      console.log(res);
      populateMissingSignatures(res);
    });
  }

  return {
    init,
  };
})();
