var editTimeEntry = (function () {
  // DOM
  var timeCard;
  let seActivityElement;
  // Data
  var timeEntryData;
  var consumersPresent;
  var payPeriod;
  // Values
  var isAdminEdit;
  var isOrginUser;

  function clearAllGlobalVariables() {
    timeEntryData = undefined;
    consumersPresent = undefined;
  }

  async function loadPage() {
    DOM.clearActionCenter();

    timeCard = await timeEntryCard.build(
      { isEdit: true, isAdminEdit },
      timeEntryData,
      consumersPresent,
      payPeriod,
    );
    DOM.ACTIONCENTER.appendChild(timeCard);
    if (seActivityElement && typeof seActivityElement === 'object')
      timeCard.querySelector('.card__body').appendChild(seActivityElement);

    var useAllWorkCodes = isAdminEdit && !isOrginUser ? true : false;
    timeEntryCard.populate(useAllWorkCodes);

    //resize rejection reason box
    const tx = document.getElementById('rejectionReason');
    if (tx) tx.setAttribute('style', 'height:' + tx.scrollHeight + 'px;overflow-y:hidden;');
  }

  function init(data) {
    setActiveModuleSectionAttribute('timeEntry-edit');
    DOM.clearActionCenter();
    roster2.miniRosterinit(null, {
      hideDate: true,
    });

    timeEntryData = data.entry;
    consumersPresent = data.consumers;
    isAdminEdit = data.isAdminEdit;
    payPeriod = data.payPeriod;
    seActivityElement = data.recordActivityElement;
    isOrginUser = data.isOrginUser ? true : false;

    loadPage();
  }

  return {
    init,
    loadPage,
    clearAllGlobalVariables,
  };
})();
