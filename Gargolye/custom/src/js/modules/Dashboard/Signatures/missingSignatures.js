const signatureWidget = (function () {
  let missingSignatureData;
  let locationDropdownData;
  let groupDropdownData;
  // cached data
  let signaturePlanStatus;
  let signatureWidgetGroupId;
  let signatureWidgetGroupName;
  let signatureWidgetGroupCode;
  let signatureWidgetLocationId;
  let signatureWidgetLocationName;
  // DOM
  //-----------------------
  let widget;
  let widgetBody;
  let missingSignaturesList;
  let filterPopup;
  let applyFiltersBtn;
  let cancelFilterBtn;
  let planStatusDropdown;
  let locationDropdown;
  let groupDropdown;

  function populatePlanStatusDropdown() {
    var data = [
      { value: '%', text: 'All' },
      { value: 'D', text: 'Draft' },
      { value: 'C', text: 'Complete' },
    ];

    dropdown.populate(planStatusDropdown, data, signaturePlanStatus);
  }
  function populateLocationDropdown(locData) {
    locData = locData ? locData : locationDropdownData;

    const dropdownData = locData.map(data => {
      return {
        value: data.ID,
        text: data.Name,
      };
    });

    const defaultLocation = {
      id: '%',
      value: '%',
      text: 'ALL',
    };
    dropdownData.unshift(defaultLocation);

    dropdown.populate(locationDropdown, dropdownData, signatureWidgetLocationId);
  }
  function populateGroupDropdown(groupData) {
    groupData = groupData ? groupData : groupDropdownData;

    const dropdownData = groupData.map(function (data) {
      return {
        //value: data.RetrieveID,
        value: data.GroupCode,
        text: data.GroupName,
      };
    });

    // UTIL.findAndSlice(dropdownData, 'Caseload', 'text');
    // UTIL.findAndSlice(dropdownData, 'Needs Attention', 'text');
    // UTIL.findAndSlice(dropdownData, 'Everyone', 'text');

    // const defaultGroup = {
    //   id: '%',
    //   value: '%',
    //   text: 'EVERYONE',
    // };
    // dropdownData.unshift(defaultGroup);

    dropdown.populate(groupDropdown, dropdownData, signatureWidgetGroupCode);
  }

  function splitName(fullName) {
    const [last, first] = fullName.split(', ');
    return { first, last };
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
    locationDropdown = dropdown.build({
      dropdownId: 'missingSignaturesLocation',
      label: 'Location',
      style: 'secondary',
      readonly: false,
    });
    // groupDropdown = dropdown.build({
    //   dropdownId: 'missingSignaturesGroup',
    //   label: 'Group',
    //   style: 'secondary',
    //   readonly: false,
    // });
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
    filterPopup.appendChild(locationDropdown);
    //filterPopup.appendChild(groupDropdown);
    filterPopup.appendChild(btnWrap);
    widget.insertBefore(filterPopup, widgetBody);

    populatePlanStatusDropdown();
  }
  function eventSetup() {
    let oldSignaturePlanStatus;
    let oldSignatureWidgetGroupId;
    let oldSignatureWidgetGroupName;
    let oldSignatureWidgetGroupCode;
    let oldSignatureWidgetLocationId;
    let oldSignatureWidgetLocationName;

    planStatusDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      // cache
      oldSignaturePlanStatus = signaturePlanStatus;
      // update
      signaturePlanStatus = selectedOption.value;
    });
    locationDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      // cache
      oldSignatureWidgetLocationId = signatureWidgetLocationId;
      oldSignatureWidgetLocationName = signatureWidgetLocationName;
      // update
      signatureWidgetLocationId = selectedOption.value;
      signatureWidgetLocationName = selectedOption.innerHTML;
    });
    // groupDropdown.addEventListener('change', event => {
    //   const selectedOption = event.target.options[event.target.selectedIndex];
    //   // cache
    //   oldSignatureWidgetGroupId = signatureWidgetGroupId;
    //   oldSignatureWidgetGroupCode = signatureWidgetGroupCode;
    //   oldSignatureWidgetGroupName = signatureWidgetGroupName;
    //   // update
    //   signatureWidgetGroupId = selectedOption.value;
    //   signatureWidgetGroupCode = selectedOption.id;
    //   signatureWidgetGroupName = selectedOption.innerHTML;
    // });
    applyFiltersBtn.addEventListener('click', event => {
      filterPopup.classList.remove('visible');
      overlay.hide();
      bodyScrollLock.enableBodyScroll(filterPopup);

      filteredSignatures = missingSignatureData.filter(ms => {
        return (
          (ms.planStatus === signaturePlanStatus || signaturePlanStatus === '%') &&
          (ms.locationId === signatureWidgetLocationId || signatureWidgetLocationId === '%')
        );
      });
      populateMissingSignatures(filteredSignatures);
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
      <p><span>Location:</span> ${signatureWidgetLocationName}</p>
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

    data.sort((a, b) => {
      const aname = splitName(a.individual);
      const bname = splitName(b.individual);

      if (aname.last !== bname.last) {
        return aname.last.localeCompare(bname.last);
      }
      if (aname.first !== bname.first) {
        return aname.first.localeCompare(bname.first);
      }
      const aDate = new Date(a.planYear).getTime();
      const bDate = new Date(b.planYear).getTime();
      return aDate < bDate ? -1 : 1;
    });
    data.forEach(d => {
      const type = d.planType === 'A' ? 'Annual' : 'Revision';
      const startDate = d.planYearStart.split(' ')[0];
      const endDate = d.planYearEnd.split(' ')[0];
      const effectiveStart = d.effectiveStart.split(' ')[0];
      const effectiveEnd = d.effectiveEnd.split(' ')[0];
      const reviewDate = d.reviewDate ? d.reviewDate.split(' ')[0] : 'n/a';
      const revisionNumber = d.revisionNumber ? d.revisionNumber : '';
      const locationID = d.locationId;

      const planType = d.planType === 'R' ? `${type} ${revisionNumber}` : type;

      const individual = d.individual;
      const { first, last } = splitName(individual);

      tableData.push({
        values: [individual, startDate, planType],
        onClick: async () => {
          if ($.session.applicationName === 'Advisor') {
            const newId = await planAjax.getConsumerPeopleIdAsync(d.consumerId);
            if (newId.length) {
              $.session.planPeopleId = newId[0].id;
              plan.setSelectedConsumer({
                id: $.session.planPeopleId,
                consumerId: d.consumerId,
                firstName: first,
                lastName: last,
              });
            } else {
              plan.setSelectedConsumer({
                id: d.consumerId,
                firstName: first,
                lastName: last,
              });
            }
          } else {
            plan.setSelectedConsumer({
              id: d.consumerId,
              firstName: first,
              lastName: last,
            });
          }

          plan.setPlanId(d.planID);
          plan.setPlanType(d.planType.toLowerCase());
          plan.setPlanStatus(d.planStatus);
          plan.setRevisionNumber(d.revisionNumber);
          // planActiveStatus??

          planDates.setReviewPlanDates({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            effectiveStart: new Date(effectiveStart),
            effectiveEnd: new Date(effectiveEnd),
            reviewDate: new Date(reviewDate),
          });

          $.loadedApp = 'plan';
          setActiveModuleAttribute('plan');
          DOM.scrollToTopOfPage();
          //document.body.classList.add('planActive');
          //DOM.clearActionCenter();
          //setActiveModuleSectionAttribute('plan-questionsAndAnswers');
          UTIL.toggleMenuItemHighlight('plan');
          plan.buildPlanPage(['a']);
        },
      });
    });

    const sigTable = table.build(tableOptions);
    table.populate(sigTable, tableData);
    missingSignaturesList.innerHTML = '';
    missingSignaturesList.appendChild(sigTable);
  }

  function init() {
    if (!signaturePlanStatus) signaturePlanStatus = '%';
    if (!signatureWidgetGroupId) signatureWidgetGroupId = '0';
    if (!signatureWidgetGroupName) signatureWidgetGroupName = 'Everyone';
    if (!signatureWidgetGroupCode) signatureWidgetGroupCode = 'ALL';
    if (!signatureWidgetLocationId) signatureWidgetLocationId = '%';
    if (!signatureWidgetLocationName) signatureWidgetLocationName = 'ALL';

    widget = document.getElementById('dashmissingsignatures');
    widgetBody = widget.querySelector('.widget__body');
    missingSignaturesList = document.querySelector('.missingSignatures');

    // append filter button
    dashboard.appendFilterButton('dashmissingsignatures', 'missingSignaturesFilterBtn');

    buildFilterPopup();
    displayFilteredBy();
    eventSetup();

    missingSignatureAjax.getMissingPlanSignatures({ token: $.session.Token }, async res => {
      missingSignatureData = res;
      populateMissingSignatures(missingSignatureData);
      locationDropdownData = await missingSignatureAjax.getLocationDropdownData();
      // groupDropdownData = await missingSignatureAjax.getGroupsDropdownData(
      //   signatureWidgetLocationId,
      // );
      populateLocationDropdown(locationDropdownData);
      //populateGroupDropdown(groupDropdownData);
    });
  }

  return {
    init,
  };
})();
