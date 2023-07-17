const signatureWidget = (function () {
  let missingSignatureData;
  // cached data
  let signaturePlanStatus;
  let signatureWidgetGroupId;
  let signatureWidgetGroupName;
  let signatureWidgetGroupCode;
  // DOM
  //-----------------------
  let widget;
  let widgetBody;
  let missingSignaturesList;
  let filterPopup;
  let applyFiltersBtn;
  let cancelFilterBtn;
  let planStatusDropdown;
  let groupDropdown;

  function populatePlanStatusDropdown() {
    var data = [
      { value: '%', text: 'All' },
      { value: 'D', text: 'Draft' },
      { value: 'C', text: 'Complete' },
    ];

    dropdown.populate(planStatusDropdown, data, signaturePlanStatus);
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

    populatePlanStatusDropdown();
  }
  function eventSetup() {
    let oldSignaturePlanStatus;
    let oldSignatureWidgetGroupId;
    let oldSignatureWidgetGroupName;
    let oldSignatureWidgetGroupCode;

    planStatusDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      // cache old values
      oldSignaturePlanStatus = signaturePlanStatus;
    });
    groupDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      // cache old values
      oldSignatureWidgetGroupId = signatureWidgetGroupId;
      oldSignatureWidgetGroupCode = signatureWidgetGroupCode;
      oldSignatureWidgetGroupName = signatureWidgetGroupName;
      // update variables
      signatureWidgetGroupId = selectedOption.value;
      signatureWidgetGroupCode = selectedOption.id;
      signatureWidgetGroupName = selectedOption.innerHTML;
    });
    applyFiltersBtn.addEventListener('click', event => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);

      if (signaturePlanStatus === '%') {
        populateMissingSignatures(missingSignatureData);
      } else {
        filteredSignatures = missingSignatureData.filter(
          ms => (ms.planStatus = signaturePlanStatus),
        );
        populateMissingSignatures(filteredSignatures);
      }
    });
    cancelFilterBtn.addEventListener('click', event => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);

      signaturePlanStatus = oldSignaturePlanStatus;
      signatureWidgetGroupId = oldSignatureWidgetGroupId;
      signatureWidgetGroupName = oldSignatureWidgetGroupName;
      signatureWidgetGroupCode = oldSignatureWidgetGroupCode;
    });
  }
  function displayFilteredBy() {
    var filteredBy = widget.querySelector('.widgetFilteredBy');

    if (!filteredBy) {
      filteredBy = document.createElement('div');
      filteredBy.classList.add('widgetFilteredBy');
      widgetBody.insertBefore(filteredBy, missingSignaturesList);
    }

    const statusName =
      signaturePlanStatus === '%' ? 'All' : signaturePlanStatus === 'D' ? 'Draft' : 'Complete';

    filteredBy.innerHTML = `<div class="filteredByData">
      <p><span>Plan Status:</span> ${statusName}</p>
      <p><span>Group:</span> ${signatureWidgetGroupName}</p>
    </div>`;
  }

  function populateMissingSignatures(data) {
    const tableOptions = {
      plain: true,
      columnHeadings: ['Individual', 'PY Start Date', 'Plan Type'],
      tableId: 'missingSignaturesWidgetTable',
    };

    const tableData = [];

    data.forEach(d => {
      const type = d.planType === 'A' ? 'Annual' : 'Revision';
      const startDate = d.planYearStart.split(' ')[0];
      const endDate = d.planYearEnd.split(' ')[0];
      const effectiveStart = d.effectiveStart.split(' ')[0];
      const effectiveEnd = d.effectiveEnd.split(' ')[0];
      const reviewDate = d.reviewDate ? d.reviewDate.split(' ')[0] : 'n/a';

      const individuals = d.individual.split(',');
      individuals.forEach(i => {
        tableData.push({
          values: [i, startDate, type],
          onClick: async () => {
            if ($.session.applicationName === 'Advisor') {
              const newId = await planAjax.getConsumerPeopleIdAsync(d.consumerId);
              if (newId.length) {
                $.session.planPeopleId = newId[0].id;
                plan.setSelectedConsumer({
                  id: $.session.planPeopleId,
                  consumerId: d.consumerId,
                });
              } else {
                plan.setSelectedConsumer({
                  id: d.consumerId,
                });
              }
            } else {
              plan.setSelectedConsumer({
                id: d.consumerId,
              });
            }

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
            DOM.clearActionCenter();
            setActiveModuleAttribute('plan');
            UTIL.toggleMenuItemHighlight('plan');
            plan.buildPlanPage(['a']);
          },
        });
      });
    });

    const sigTable = table.build(tableOptions);
    table.populate(sigTable, tableData);
    widgetBody.appendChild(sigTable);
  }

  function init() {
    if (!signaturePlanStatus) signaturePlanStatus = '%';
    if (!signatureWidgetGroupId) signatureWidgetGroupId = '0';
    if (!signatureWidgetGroupName) signatureWidgetGroupName = 'Everyone';
    if (!signatureWidgetGroupCode) signatureWidgetGroupCode = 'ALL';

    widget = document.getElementById('dashmissingsignatures');
    widgetBody = widget.querySelector('.widget__body');
    missingSignaturesList = document.querySelector('.missingSignatures');

    // append filter button
    dashboard.appendFilterButton('dashmissingsignatures', 'missingSignaturesFilterBtn');

    buildFilterPopup();
    displayFilteredBy();
    eventSetup();

    missingSignatureAjax.getMissingPlanSignatures({ token: $.session.Token }, res => {
      missingSignatureData = res;
      populateMissingSignatures(missingSignatureData);
    });
  }

  return {
    init,
  };
})();
