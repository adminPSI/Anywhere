var incidentOverview = (function () {
  // DOM Elements
  var overviewTable;
  //filters
  var filterPopup;
  var filterBtn;
  var applyFilterBtn;
  var alphaDropdown;
  var locationDropdown;
  var betaDropdown;
  var fromDateInput;
  var toDateInput;
  var categoryDropdown;
  // filter values for remembering
  var filterData = {
    alpha: null,
    alphaName: null,
    beta: null,
    betaName: null,
    location: null,
    locationName: null,
    category: null,
    categoryName: null,
    fromDate: null,
    toDate: null,
  };
  // alpha beta stuff
  var changedSelectedAlphaBetas;
  var alphaBetaData;
  var selectedAlphaId;
  var selectedBetaData = {
    id: '',
    name: '',
  };
  var retrieveData = {
    token: '',
    locationId: '%',
    employeeId: null,
    supervisorId: '',
    subcategoryId: '%',
    fromDate: '',
    toDate: '',
    viewCaseLoad: $.session.incidentTrackingViewCaseLoad,
  };

  // Filtering
  //------------------------------------
  function populateSelectedFilterValues() {
    var selectedFilters = document.querySelector('.filteredByData');
    if (!selectedFilters) {
      selectedFilters = document.createElement('div');
      selectedFilters.classList.add('filteredByData');
      DOM.ACTIONCENTER.appendChild(selectedFilters);
    }
    if (filterData.alphaName === null)
      filterData.alphaName = $.session.LName + ', ' + $.session.Name;
    if (filterData.locationName === null || filterData.locationName === 'All')
      filterData.locationName = 'All Locations';
    if (filterData.betaName === null || filterData.betaName === 'All')
      filterData.betaName = 'All Employees';
    if (filterData.categoryName === null || filterData.categoryName === 'All')
      filterData.categoryName = 'All Categories';
    selectedFilters.innerHTML = `
      <p><span>Supervisor:</span> ${filterData.alphaName}</p>
      <p><span>Location:</span> ${filterData.locationName}</p>
      <p><span>Employee:</span> ${filterData.betaName}</p>
      <p><span>Category/Subcategory:</span> ${filterData.categoryName}</p>
      <p><span>From Date:</span> ${UTIL.formatDateFromIso(filterData.fromDate)}</p>
      <p><span>To Date:</span> ${UTIL.formatDateFromIso(filterData.toDate)}</p>
    `;
  }
  function saveFilterData(data) {
    filterData.alpha = data.alphaId ? data.alphaId : filterData.alpha;
    filterData.alphaName = data.alphaName ? data.alphaName : filterData.alphaName;
    filterData.beta = data.betaId ? data.betaId : filterData.beta;
    filterData.betaName = data.betaName ? data.betaName : filterData.betaName;
    filterData.location = data.locationId ? data.locationId : filterData.location;
    filterData.locationName = data.locationName ? data.locationName : filterData.locationName;
    filterData.category = data.categoryId ? data.categoryId : filterData.category;
    filterData.categoryName = data.categoryName ? data.categoryName : filterData.categoryName;
    filterData.fromDate = data.fromDate ? data.fromDate : filterData.fromDate;
    filterData.toDate = data.toDate ? data.toDate : filterData.toDate;
  }
  function populateFilterDropdowns() {
    incidentTrackingAjax.getReviewPageLocations(populateLocationsDropdown);
    incidentTrackingAjax.getIncidentCategories(populateCategoriesDropdown);
    incidentTrackingAjax.getITReviewPageEmployeeListAndSubList(
      $.session.PeopleId,
      populateUserAndEmployeeDropdowns,
    );
  }
  function getFromDateValue() {
    if (filterData.fromDate) return filterData.fromDate;

    var fromDate = convertDaysBack($.session.defaultIncidentTrackingDaysBack);
    filterData.fromDate = fromDate;
    return fromDate;
  }
  function getToDateValue() {
    if (filterData.toDate) return filterData.toDate;

    var today = UTIL.getTodaysDate();
    filterData.toDate = today;
    return today;
  }
  function buildFilterPopup() {
    filterPopup = POPUP.build({
      classNames: ['incidentTrackingFilterPopup'],
    });

    alphaDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Supervisor',
      style: 'secondary',
    });
    locationDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Location',
      style: 'secondary',
    });
    betaDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Employee',
      style: 'secondary',
    });
    categoryDropdown = dropdown.build({
      dropdownId: 'locationDropdown',
      label: 'Category/Subcategory',
      style: 'secondary',
    });
    fromDateInput = input.build({
      label: 'From Date',
      type: 'date',
      style: 'secondary',
      value: getFromDateValue(),
    });
    toDateInput = input.build({
      label: 'To Date',
      type: 'date',
      style: 'secondary',
      value: getToDateValue(),
    });
    applyFilterBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });

    // Build Popup
    filterPopup.appendChild(alphaDropdown);
    filterPopup.appendChild(locationDropdown);
    filterPopup.appendChild(betaDropdown);
    filterPopup.appendChild(categoryDropdown);
    filterPopup.appendChild(fromDateInput);
    filterPopup.appendChild(toDateInput);
    filterPopup.appendChild(applyFilterBtn);

    // Populate Dropodowns
    populateFilterDropdowns();
  }
  function showFilterPopup() {
    // popup
    buildFilterPopup();
    POPUP.show(filterPopup);
    // Setup Events
    filterDropdownEventSetup();
  }
  function setupFiltering() {
    filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtn',
      callback: showFilterPopup,
    });

    DOM.ACTIONCENTER.appendChild(filterBtn);

    buildFilterPopup();
  }
  function filterDropdownEventSetup() {
    var tmpAlphaId;
    var tmpAlphaName;
    var tmpBetaId;
    var tmpBetaName;
    var tmpLocationId;
    var tmpLocationName;
    var tmpCategoryId;
    var tmpCategoryName;
    var tmpToDate;
    var tmpFromDate;

    alphaDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      selectedAlphaId = selectedOption.value;
      // update retrieveData obj
      retrieveData.supervisorId = selectedAlphaId;
      retrieveData.locationId = '%';
      retrieveData.employeeId = '%';
      retrieveData.subcategoryId = '%';
      retrieveData.viewCaseLoad = $.session.incidentTrackingViewCaseLoad;
      // temp cache data
      tmpAlphaId = selectedAlphaId;
      tmpAlphaName = selectedOption.innerHTML;
      // re populate beta dropwond based off selected alpha
      alphaBetaData.forEach(d => {
        if (d.alpha.personId === selectedAlphaId) {
          changedSelectedAlphaBetas = d.betas;
          populateBetas(d.betas);
        }
      });
    });
    betaDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      selectedBetaData.id = selectedOption.value;
      selectedBetaData.name = selectedOption.innerHTML;
      retrieveData.employeeId = selectedBetaData.id;

      // temp cache data
      tmpBetaId = selectedBetaData.id;
      tmpBetaName = selectedBetaData.name;
    });
    locationDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      retrieveData.locationId = selectedOption.value;
      // temp cache data
      tmpLocationId = selectedOption.value;
      tmpLocationName = selectedOption.innerHTML;
    });
    categoryDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
      retrieveData.subcategoryId = selectedOption.value;
      // temp cache data
      tmpCategoryId = selectedOption.value;
      tmpCategoryName = selectedOption.innerHTML;
    });
    toDateInput.addEventListener('change', event => {
      var selectedDate = event.target.value;
      if (selectedDate === '') {
        toDateInput.classList.add('error');
        applyFilterBtn.classList.add('disabled');
      } else {
        toDateInput.classList.remove('error');
        applyFilterBtn.classList.remove('disabled');
      }
      retrieveData.toDate = selectedDate;
      filterData.toDate = selectedDate;
      toDateVal = selectedDate;
      // temp cache data
      tmpToDate = selectedDate;
    });
    fromDateInput.addEventListener('change', event => {
      var selectedDate = event.target.value;
      if (selectedDate === '') {
        fromDateInput.classList.add('error');
        applyFilterBtn.classList.add('disabled');
      } else {
        fromDateInput.classList.remove('error');
        applyFilterBtn.classList.remove('disabled');
      }
      retrieveData.fromDate = selectedDate;
      // temp cache data
      tmpFromDate = selectedDate;
    });

    applyFilterBtn.addEventListener('click', event => {
      POPUP.hide(filterPopup);
      saveFilterData({
        alphaId: tmpAlphaId,
        alphaName: tmpAlphaName,
        betaId: tmpBetaId,
        betaName: tmpBetaName,
        locationId: tmpLocationId,
        locationName: tmpLocationName,
        categoryId: tmpCategoryId,
        categoryName: tmpCategoryName,
        toDate: tmpToDate,
        fromDate: tmpFromDate,
      });
      populateSelectedFilterValues();
      incidentTrackingAjax.getITReviewTableData(retrieveData, populateOverviewTable);
    });
  }
  // Dropdowns
  //------------------------------------
  function populateAlphas(alphas) {
    var data = alphas.map(a => {
      var value = a.personId;
      var text = `${a.lastName}, ${a.firstName}`;

      return {
        value,
        text,
      };
    });

    if (filterData.alpha) {
      dropdown.populate(alphaDropdown, data, filterData.alpha);
    } else {
      dropdown.populate(alphaDropdown, data);
      filterData.alpha = data[0].value;
      filterData.alphaName = data[0].text;
    }
  }
  function populateBetas(betas) {
    var data = betas.map(b => {
      var value = b.personId;
      var text = `${b.lastName}, ${b.firstName}`;

      return {
        value,
        text,
      };
    });

    var defaultOption = {
      value: '%',
      text: 'All',
    };
    data.unshift(defaultOption);

    var filteredBetas = betas.filter(b => b.personId === filterData.beta);

    if (filteredBetas.length > 0) {
      dropdown.populate(betaDropdown, data, filterData.beta);
    } else {
      dropdown.populate(betaDropdown, data);
      filterData.betaName = 'All Employees';
    }
  }
  function populateUserAndEmployeeDropdowns(res) {
    function decipherXML(res) {
      var xmlDoc,
        allEmployees = [];
      xmlDoc = UTIL.parseXml(
        '<?xml version="1.0" encoding="UTF-8"?>' + res.getITReviewPageEmployeeListAndSubListResult,
      );

      var employeeobjectArray = [].slice.call(xmlDoc.getElementsByTagName('employeeobject'));
      employeeobjectArray.forEach(employeeObject => {
        var alphaNode = [].slice.call(employeeObject.getElementsByTagName('alpha'))[0];
        var betasNode = [].slice.call(employeeObject.getElementsByTagName('beta'));
        var alpha = {
          personId: [].slice.call(alphaNode.getElementsByTagName('personid'))[0].textContent,
          firstName: [].slice.call(alphaNode.getElementsByTagName('firstname'))[0].textContent,
          lastName: [].slice.call(alphaNode.getElementsByTagName('lastname'))[0].textContent,
          userName: [].slice.call(alphaNode.getElementsByTagName('username'))[0].textContent,
        };
        var betas = [];
        if (betasNode !== undefined) {
          betasNode.forEach(betaNode => {
            var beta = {
              personId: [].slice.call(betaNode.getElementsByTagName('personid'))[0].textContent,
              firstName: [].slice.call(betaNode.getElementsByTagName('firstname'))[0].textContent,
              lastName: [].slice.call(betaNode.getElementsByTagName('lastname'))[0].textContent,
              userName: [].slice.call(betaNode.getElementsByTagName('username'))[0].textContent,
            };
            betas.push(beta);
          });
        }
        var alphaAndBeta;
        if (betas.length > 0) {
          alphaAndBeta = {
            alpha: alpha,
            betas: betas,
          };
        } else {
          alphaAndBeta = {
            alpha: alpha,
            betas: [],
          };
        }
        allEmployees.push(alphaAndBeta);
      });
      return allEmployees;
    }

    alphaBetaData = decipherXML(res);
    var defaultAlpha;
    var alphas = [];
    // move default alpha to start
    alphaBetaData = alphaBetaData.filter(d => {
      if (d.alpha.personId === $.session.PeopleId) defaultAlpha = d;
      return d.alpha.personId !== $.session.PeopleId;
    });
    alphaBetaData.unshift(defaultAlpha);
    // set aside alphas
    alphaBetaData.forEach(d => {
      if (d !== undefined) {
        alphas.push(d.alpha);
      }
    });
    // initial population of dropdowns
    populateAlphas(alphas);
    if (!changedSelectedAlphaBetas) {
      populateBetas(alphaBetaData[0].betas);
    } else {
      populateBetas(changedSelectedAlphaBetas);
    }
  }
  function populateLocationsDropdown(res) {
    var data = res.map(r => {
      var value = r.ID;
      var text = r.Name;

      return {
        value,
        text,
      };
    });

    var defaultOption = {
      value: '%',
      text: 'All',
    };
    data.unshift(defaultOption);

    if (filterData.location) {
      dropdown.populate(locationDropdown, data, filterData.location);
    } else {
      dropdown.populate(locationDropdown, data);
      filterData.locationName = 'All Locations';
    }
  }
  function populateCategoriesDropdown(res) {
    var data = res.map(r => {
      var value = r.subcategoryId;
      var text = r.incidentCategory;

      return {
        value,
        text,
      };
    });

    var defaultOption = {
      value: '%',
      text: 'All',
    };
    data.unshift(defaultOption);

    if (filterData.category) {
      dropdown.populate(categoryDropdown, data, filterData.category);
    } else {
      dropdown.populate(categoryDropdown, data);
      filterData.categoryName = 'All Categories';
    }
  }

  // OVERVIEW TABLE
  //------------------------------------
  function buildOverviewTable() {
    populateSelectedFilterValues();

    var tableOptions = {
      tableId: 'incidentOverviewTable',
      heading: 'Incident Overview',
      columnHeadings: ['Location', 'Entered By', 'Date', 'Time', 'Type', 'Consumer(s) Involved'],
    };

    overviewTable = table.build(tableOptions);
    DOM.ACTIONCENTER.appendChild(overviewTable);
  }
  function populateOverviewTable(res) {
    var incidents = {};
    res.forEach(r => {
      if (!incidents[r.incidentId]) {
        incidents[r.incidentId] = r;
      } else {
        if (incidents[r.incidentId].consumerName !== r.consumerName) {
          incidents[r.incidentId].consumerName += `, ${r.consumerName}`;
        }
      }
    });

    var keys = Object.keys(incidents);

    var data = keys.map(key => {
      var obj = incidents[key];

      var rowId = obj.incidentId;
      var location = obj.locationName;
      var enteredBy = obj.supervisorName;
      var date = obj.incidentDate.split(' ')[0];
      var time = UTIL.convertFromMilitary(obj.incidentTime);
      var category = obj.incidentCategory;
      var consumersInvolved = obj.consumerName;
      var viewedOn = obj.viewedOn ? true : false;
      var orginUser =
        obj.originallyEnteredBy.toLowerCase() === $.session.UserId.toLowerCase() ? true : false;
      var showBold;

      if (!orginUser && !viewedOn) {
        showBold = true;
      }

      return {
        id: rowId,
        values: [location, enteredBy, date, time, category, consumersInvolved],
        attributes: [{ key: 'data-viewed', value: showBold }],
        onClick: async event => {
          await incidentTrackingAjax.updateIncidentViewByUser({
            token: $.session.Token,
            incidentId: rowId,
            userId: $.session.UserId,
          });
          DOM.scrollToTopOfPage();
          reviewIncident.init(event.target.id);
        },
      };
    });

    data.sort(function (a, b) {
      var dateOne = UTIL.formatDateToIso(a.values[2]);
      var dateTwo = UTIL.formatDateToIso(b.values[2]);
      dateOne = new Date(dateOne);
      dateTwo = new Date(dateTwo);
      var newDateOne = dateOne.getTime();
      var newDateTwo = dateTwo.getTime();

      var timeOne = a.values[3];
      var timeTwo = b.values[3];
      timeOne = UTIL.convertToMilitary(timeOne);
      timeTwo = UTIL.convertToMilitary(timeTwo);
      timeOne = parseFloat(`${parseInt(timeOne.split(':')[0])}.${parseInt(timeOne.split(':')[1])}`);
      timeTwo = parseFloat(`${parseInt(timeTwo.split(':')[0])}.${parseInt(timeTwo.split(':')[1])}`);

      if (newDateOne === newDateTwo) {
        return timeOne - timeTwo;
      }

      return newDateOne > newDateTwo ? -1 : 1;
    });

    table.populate(overviewTable, data);

    console.log(data);
  }

  function init() {
    setActiveModuleSectionAttribute('incidentTracking-overview');
    DOM.clearActionCenter();

    retrieveData.supervisorId = $.session.PeopleId;
    retrieveData.token = $.session.Token;
    retrieveData.viewCaseLoad = $.session.incidentTrackingViewCaseLoad;
    retrieveData.toDate = getToDateValue();
    retrieveData.fromDate = getFromDateValue();

    setupFiltering();

    //never need mini roster on reviews
    roster2.removeMiniRosterBtn();

    incidentTrackingAjax.getITReviewTableData(retrieveData, function (results) {
      buildOverviewTable();
      populateOverviewTable(results);
    });
  }

  return {
    init,
  };
})();
