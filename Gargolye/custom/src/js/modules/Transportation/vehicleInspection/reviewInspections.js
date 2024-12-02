const TRANS_inspectionReview = (function () {

    let inspectionTable, filterOpts;

    let fromDate;
    let toDate;
    let enteredBy;
    let vehicleNumber;
    let today;
    let defaultFromDate;

    let btnWrap;
    let fromDateBtnWrap;
    let vehicleNumberBtnWrap;
    let enteredByBtnWrap;


    function buildPage(resetFilter) {

        today = new Date();
        defaultFromDate = new Date();
        defaultFromDate.setDate(defaultFromDate.getDate() - 7);

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

        // FILTERED BY DISPLAY //
        const filteredByDisplay = buildFilteredBy();
        inspectionTable = table.build({
            tableId: "vehicleInspectionTable",
            headline: "Completed Inspections",
            columnHeadings: ["Vehicle Number", "Date", "Time", "Last Update", "Route"],
        })

        // Set the data type for each header, for sorting purposes
        const headers = inspectionTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Vehicle Number
        headers[1].setAttribute('data-type', 'date'); // Date
        headers[2].setAttribute('data-type', 'date'); //Time
        headers[3].setAttribute('data-type', 'string'); // Last Update 
        headers[4].setAttribute('data-type', 'string'); // Route

        DOM.ACTIONCENTER.appendChild(backButton)
        DOM.ACTIONCENTER.appendChild(filteredByDisplay)
        DOM.ACTIONCENTER.appendChild(inspectionTable)

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(inspectionTable);

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
        inspections.forEach((val, key, map) => {
            const { enteredById, inspectionDate, inspectionTime, routeName, vehicleNumber } = val;
            const readDate = UTIL.abbreviateDateYear(inspectionDate);
            const readTime = UTIL.formatTimeString(inspectionTime);
            const values = [vehicleNumber, readDate, readTime, enteredById, routeName]
            tableData.push({
                values: values,
                id: key,
                onClick: () => {
                    TRANS_vehicleInspection.init({ enterPath: 'reviewInspections', vId: val.vehicleId, rId: val.routeId, edit: true, editData: val, routeName: routeName });
                }
            })
        });
        table.populate(inspectionTable, tableData)
    }

    function filterApply(opts) {
        filterOpts = opts;
        buildFilteredBy();
        getData(filterOpts);
    }

    function buildFilteredBy() {
        let filteredBy = document.querySelector(".filteredByData");

        if (!filteredBy) {
            filteredBy = document.createElement("div");
            filteredBy.classList.add("filteredByData");
            filterButtonSet()
            filteredBy.appendChild(btnWrap);
        }
        const driverLookup = TRANS_mainLanding.driverLookup(filterOpts.userId);
        const vehicleLookup = TRANS_mainLanding.vehicleLookup(filterOpts.vehicleInfoId);

        fromDate = UTIL.abbreviateDateYear(UTIL.formatDateFromIso(filterOpts.fromDate, '/'));
        toDate = UTIL.abbreviateDateYear(UTIL.formatDateFromIso(filterOpts.toDate, '/'));
        enteredBy = driverLookup ? `${driverLookup.Last_Name}, ${driverLookup.First_Name}` : 'All';
        vehicleNumber = vehicleLookup !== 'Non-Existant Vehicle!' ? `${vehicleLookup.vehicleNumber}` : 'All';


        if (document.getElementById('fromDateBtn') != null)
            document.getElementById('fromDateBtn').innerHTML = 'Inspection Dates: ' + fromDate + ' - ' + toDate;

        if (vehicleNumber === '%' || vehicleNumber === 'All') {
            btnWrap.appendChild(vehicleNumberBtnWrap);
            btnWrap.removeChild(vehicleNumberBtnWrap);
        } else {
            btnWrap.appendChild(vehicleNumberBtnWrap);
            if (document.getElementById('vehicleNumberBtn') != null)
                document.getElementById('vehicleNumberBtn').innerHTML = 'Vehicle: ' + vehicleNumber;
        }

        if (enteredBy === '%' || enteredBy === 'All') {
            btnWrap.appendChild(enteredByBtnWrap);
            btnWrap.removeChild(enteredByBtnWrap);
        } else {
            btnWrap.appendChild(enteredByBtnWrap);
            if (document.getElementById('enteredByBtn') != null)
                document.getElementById('enteredByBtn').innerHTML = 'Entered By: ' + enteredBy;
        }

        return filteredBy;
    }

    function filterButtonSet() {
        filterBtn = button.build({
            text: 'Filter',
            style: 'secondary',
            type: 'contained',
            icon: 'filter',
            classNames: 'filterBtnNew',
            callback: () => {
                TRANS_reviewInspectionFilter.init(filterOpts, 'ALL');
            },
        });

        fromDateBtn = button.build({
            id: 'fromDateBtn',
            text: 'Inspection Dates: ' + UTIL.abbreviateDateYear(UTIL.formatDateFromIso(filterOpts.fromDate, '/')) + ' - ' + UTIL.abbreviateDateYear(UTIL.formatDateFromIso(filterOpts.toDate, '/')),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_reviewInspectionFilter.init(filterOpts, 'fromDateBtn') },
        });

        vehicleNumberBtn = button.build({
            id: 'vehicleNumberBtn',
            text: 'Vehicle: ' + vehicleNumber,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_reviewInspectionFilter.init(filterOpts, 'vehicleNumberBtn') },
        });
        vehicleNumberCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('vehicleNumberBtn') },
        });

        enteredByBtn = button.build({
            id: 'enteredByBtn',
            text: 'Entered By: ' + enteredBy,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { TRANS_reviewInspectionFilter.init(filterOpts, 'enteredByBtn') },
        });
        enteredByCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('enteredByBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        fromDateBtnWrap = document.createElement('div');
        fromDateBtnWrap.classList.add('filterSelectionBtnWrap');
        fromDateBtnWrap.appendChild(fromDateBtn);
        btnWrap.appendChild(fromDateBtnWrap);

        vehicleNumberBtnWrap = document.createElement('div');
        vehicleNumberBtnWrap.classList.add('filterSelectionBtnWrap');
        vehicleNumberBtnWrap.appendChild(vehicleNumberBtn);
        vehicleNumberBtnWrap.appendChild(vehicleNumberCloseBtn);
        btnWrap.appendChild(vehicleNumberBtnWrap);

        enteredByBtnWrap = document.createElement('div');
        enteredByBtnWrap.classList.add('filterSelectionBtnWrap');
        enteredByBtnWrap.appendChild(enteredByBtn);
        enteredByBtnWrap.appendChild(enteredByCloseBtn);
        btnWrap.appendChild(enteredByBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'enteredByBtn') {
            filterOpts.userId = '%';
        }
        if (closeFilter == 'vehicleNumberBtn') {
            filterOpts.vehicleInfoId = '%';
        }
        buildFilteredBy();
        getData(filterOpts);
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