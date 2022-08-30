const TRANS_inspectionReview = (function() {

  let inspectionTable, filterOpts;

  function buildPage(resetFilter) {

    const today = new Date();
    const defaultFromDate = new Date();
    defaultFromDate.setDate( defaultFromDate.getDate() - 7);

    if (resetFilter) {
      filterOpts = {
        token: $.session.Token,
        fromDate: UTIL.formatDateFromDateObj(defaultFromDate),
        toDate: UTIL.formatDateFromDateObj(today),
        vehicleInfoId: '%',
        userId: '%',
      }
    }

    const backButton = button.build({
      id: "myRouteBackButton",
      text: "Back",
      style: "secondary",
      type: "text",
      icon: "arrowBack",
      callback: () => {
        setActiveModuleSectionAttribute(null);
        TRANS_vehicleInspectionLanding.init();
      },
    });
    const filterBtn = button.build({
      text: "Filter",
      style: "secondary",
      type: "contained",
      icon: "filter",
      callback: () => {
        TRANS_reviewInspectionFilter.init(filterOpts);
      },
    });
    // FILTERED BY DISPLAY //
    const filteredByDisplay = buildFilteredBy();
    inspectionTable = table.build({
      tableId: "vehicleInspectionTable",
      headline: "Completed Inspections",
      columnHeadings: ["Vehicle Number", "Date", "Time", "Last Update", "Route"],
    })

    DOM.ACTIONCENTER.appendChild(backButton)
    DOM.ACTIONCENTER.appendChild(filterBtn)
    DOM.ACTIONCENTER.appendChild(filteredByDisplay)
    DOM.ACTIONCENTER.appendChild(inspectionTable)

    getData(filterOpts)
  }

  async function getData(opts) {
    table.clear(inspectionTable);
    PROGRESS__ANYWHERE.init()
    PROGRESS__ANYWHERE.SPINNER.show(DOM.ACTIONCENTER, "Gathering Vehicle Inspections...");
    const tmpInsp = (await TRANS_vehicleInspectionAjax.getCompletedInspections(opts)).getCompletedInspectionsResult;
    const inspMap = new Map()
    tmpInsp.forEach(insp => {
      inspMap.set(insp.inspectionId, insp)
    })
    PROGRESS__ANYWHERE.SPINNER.hide(DOM.ACTIONCENTER)
    populateTable(inspMap)
  }

  function populateTable(inspections) {
    const tableData = [];
    inspections.forEach((val,key,map) => {
      const { enteredById, inspectionDate, inspectionTime, routeName, vehicleNumber } = val;
      const readDate = UTIL.abbreviateDateYear(inspectionDate);
      const readTime = UTIL.formatTimeString(inspectionTime);
      const values = [vehicleNumber, readDate, readTime, enteredById, routeName]
      tableData.push({
        values: values,
        id: key,
        onClick: () => {
          TRANS_vehicleInspection.init({enterPath: 'reviewInspections', vId: val.vehicleId, rId: val.routeId, edit: true, editData: val, routeName: routeName});
        }
      })
    });
    table.populate(inspectionTable, tableData)
  }

  function filterApply(opts) {
    filterOpts = opts
    buildFilteredBy()
    getData(filterOpts)
  }

  function buildFilteredBy() {
    let filteredBy = document.querySelector(".widgetFilteredBy");

    if (!filteredBy) {
      filteredBy = document.createElement("div");
      filteredBy.classList.add("widgetFilteredBy");
    }
    const driverLookup = TRANS_mainLanding.driverLookup(filterOpts.userId);
    const vehicleLookup = TRANS_mainLanding.vehicleLookup(filterOpts.vehicleInfoId);

    const fromDate = UTIL.abbreviateDateYear(UTIL.formatDateFromIso(filterOpts.fromDate, '/'));
    const toDate = UTIL.abbreviateDateYear(UTIL.formatDateFromIso(filterOpts.toDate, '/'));
    const enteredBy = driverLookup ? `${driverLookup.Last_Name}, ${driverLookup.First_Name}` : 'All';
    const vehicleNumber = vehicleLookup !== 'Non-Existant Vehicle!' ? `${vehicleLookup.vehicleNumber}` : 'All';
    filteredBy.innerHTML = `
      <div class="filteredByData">
        <p><span>Inspection Dates:</span> ${fromDate}-${toDate}</p>
        <p><span>Vehicle Number:</span> ${vehicleNumber}</p>
        <p><span>Entered By:</span> ${enteredBy}</p>
      </div>
    `;

    return filteredBy;
  }
/** Vehicle Inspection Init Function
 * @param {boolean} [resetFilter=True] False will not reset filter values
 */
  function init(resetFilter = true) {
    DOM.scrollToTopOfPage();
    DOM.clearActionCenter();
    setActiveModuleSectionAttribute("reviewinspections");
    buildPage(resetFilter);
  }
  return {
    init,
    filterApply
  }
})();