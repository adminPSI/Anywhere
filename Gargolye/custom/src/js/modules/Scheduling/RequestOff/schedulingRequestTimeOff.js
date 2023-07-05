var schedulingRequestTimeOff = (function() {
  var actioncenter;

  // UTIL
  //-------------------------------------------------
  function eachDateOfInterval(dirtyInterval) {
    const interval = dirtyInterval || {};

    if (interval.start === interval.end)
      return interval.start.split(",").join("/");

    const startDate = cloneDate(interval.start);
    const endDate = cloneDate(interval.end);

    const endTime = endDate.getTime();

    if (!(startDate.getTime() <= endTime)) return;

    let dates = [];

    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {
      dates.push(cloneDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return dates;
  }
  function timeOverlapCheck(fromTime, toTime) {
    var startTimeMilliseconds = new Date("01/01/2019 " + fromTime).getTime();
    var endTimeMilliseconds = new Date("01/01/2019 " + toTime).getTime();
    var timeDifference = endTimeMilliseconds - startTimeMilliseconds;
    return timeDifference < 0 ? false : true;
  }
  function cloneDate(argument) {
    const argStr = Object.prototype.toString.call(argument);

    if (
      argument instanceof Date ||
      (typeof argument === "object" && argStr === ["object Date"])
    ) {
      return new Date(argument.getTime());
    } else if (typeof argument === "number" || argStr === ["object Number"]) {
      return new Date(argument);
    } else {
      argument = argument.split(",");
      return new Date(
        parseInt(argument[0]),
        parseInt(argument[1] - 1),
        parseInt(argument[2])
      );
    }
  }

  // ERROR POPUPS
  var errorPopup = POPUP.build({
    header: "ERROR",
    classNames: "popup__error",
    id: "errorPopup"
  });
  var errorPopupText = document.createElement("h3");
  errorPopup.appendChild(errorPopupText);
  //=============================================
  
  //REST
  //-------------------------------------------------
  function populateEmployeesDropdown(results) {
    results = [{ employeeId: "%", employeeName: "" }, ...results];
    var employeeData = results.map(r => {
      var id = r.employeeId;
      var value = r.employeeName;
      var text = r.employeeName;
      return {
        id,
        value,
        text
      };
    });
    dropdown.populate("employeeDropdown", employeeData);
    employeeId = employeeData[0].id;
  }

  function populateReasonsDropdown(results) {
    results.sort((a, b) => (a.reasonName < b.reasonName ? -1 : 1));
    results = [{ reasonId: "%", reasonName: "" }, ...results];
    var dropdownData = results.map(r => {
      var id = r.reasonId;
      var value = r.reasonName;
      var text = r.reasonName;
      return {
        id,
        value,
        text
      };
    });
    dropdown.populate("reasonDropdown", dropdownData);
    reasonId = dropdownData[0].id;
  }

  function overlapAlert(requestData) {

    var alertPopup = POPUP.build({
      id: 'saveAlertPopup',
      classNames: 'warning',
    });
    var alertbtnWrap = document.createElement('div');
    alertbtnWrap.classList.add('btnWrap');
    var alertokBtn = button.build({
      text: 'OK',
      style: 'secondary',
      type: 'contained',
      icon: 'checkmark',
      callback: async function() {
        POPUP.hide(alertPopup);
       // overlay.show();
        
      },
    });

    alertbtnWrap.appendChild(alertokBtn);

    var Date = `${requestData.serviceDate.split(' ')[0]}`;
    var startTime = `${UTIL.convertFromMilitary(requestData.startTime)}`;
    var endTime = `${UTIL.convertFromMilitary(requestData.endTime)}`;

    // Create the alert message
    const alertMessage = document.createElement('p');
    alertMessage.innerHTML = `This request overlaps an existing day off request on ${Date} ${startTime}-${endTime} and could not be processed.`;
    
    // Append the alert message and button wrapper to the alert popup
    alertPopup.appendChild(alertMessage);
    alertPopup.appendChild(alertbtnWrap);
    
    // Show the alert popup
    POPUP.show(alertPopup);
	
  }

  async function submitRequest() {
    reasonId = reasonId === "%" ? null : reasonId;
    employeeId = employeeId === "%" ? null : employeeId;
    if (reasonId === null || employeeId === null) {
      POPUP.show(errorPopup);
      errorPopupText.innerHTML = "Reason and notified employee fields are required";
      return;
    }
    var startDate = document
      .getElementById("fromDate")
      .value.split("-")
      .join(",");
    var endDate = document
      .getElementById("toDate")
      .value.split("-")
      .join(",");
    var dateInterval = eachDateOfInterval({ start: startDate, end: endDate });
    // check date overlap:
    var areDatesValid = !dateInterval ? false : true;
    if (!areDatesValid) {
      POPUP.show(errorPopup);
      errorPopupText.innerHTML = "From Date cannot be after To Date";
      return;
    } else {
      if (typeof dateInterval === "string") {
        var dateArray = dateInterval;
      } else {
        var dateArray = dateInterval
          .map(date => {
            var year = date.getFullYear();
            var month = UTIL.leadingZero(date.getMonth() + 1);
            var day = UTIL.leadingZero(date.getDate());

            return `${year}/${month}/${day}`;
          })
          .toString();
      }
    }

    var fromTime = document.getElementById("fromTime");
    var toTime = document.getElementById("toTime");
    fromTimeVal = fromTime.value === "" ? "00:00:00" : fromTime.value;
    toTimeVal = toTime.value === "" ? "23:59:59" : toTime.value;
    // check time overlap - ONLY CHECK TIME OVERLAP ON REQUEST OFF FOR 1 DAY. TO TIME CAN COME BEFORE FROM TIME
    // IF REQUESTING MULTIPLE DAYS OFF IN A ROW.
    if (typeof dateInterval === "string") {
      var areTimesValid = timeOverlapCheck(fromTimeVal, toTimeVal);
      if (!areTimesValid) {
        POPUP.show(errorPopup);
        errorPopupText.innerHTML = "To Time cannot come before From Time"
        return;
      } else {
        fromTime = fromTimeVal === "" ? "00:00:00" : fromTimeVal;
        toTime = toTimeVal === "" ? "23:59:59" : toTimeVal;
      }
    } else {
      fromTime = fromTimeVal === "" ? "00:00:00" : fromTimeVal;
      toTime = toTimeVal === "" ? "23:59:59" : toTimeVal;
    }

    var data = {
      token: $.session.Token,
      personId: $.session.PeopleId,
      dates: dateArray,
      fromTime: fromTimeVal,
      toTime: toTimeVal,
      reasonId: reasonId,
      employeeNotifiedId: employeeId,
      status: "P"
    };
    const requestResult = await schedulingAjax.requestDaysOffSchedulingAjax(data);
    if (requestResult.requestDaysOffSchedulingResult.length > 0)
    {
      overlapAlert(requestResult.requestDaysOffSchedulingResult[0])
    } else {
      // Add verification/popup that the request has been sent?
    DOM.clearActionCenter();
    scheduling.init();
    }
  }

  function buildRequestTimeOff() {
    var today = new Date();
    var dd = UTIL.leadingZero(today.getDate());
    var mm = UTIL.leadingZero(today.getMonth() + 1);
    var yyyy = today.getFullYear();

    actioncenter = document.getElementById("actioncenter");

    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card__header");

    let cardBody = document.createElement("div");
    cardBody.classList.add("card__body");

    let dateWrap = document.createElement("div");
    dateWrap.classList.add('requestOffCard__date')

    let timeWrap = document.createElement("div");
    timeWrap.classList.add('requestOffCard__time')

    let btnWrap = document.createElement("div");
    btnWrap.classList.add("requestOffBtnWrap");

    let headerText = document.createElement("h3");
    headerText.innerHTML = "Request Time Off";

    let card = document.createElement('div');
    card.classList.add('card', 'requestOffCard');

    let fromDateInput = input.build({
      id: "fromDate",
      label: "From Date",
      type: "date",
      style: "secondary"
    });
    let toDateInput = input.build({
      id: "toDate",
      label: "To Date",
      type: "date",
      style: "secondary"
    });
    let fromTimeInput = input.build({
      id: "fromTime",
      label: "From Time",
      type: "time",
      style: "secondary"
    });
    let toTimeInput = input.build({
      id: "toTime",
      label: "To Time",
      type: "time",
      style: "secondary"
    });
    let reasonDropdown = dropdown.build({
      dropdownId: "reasonDropdown",
      label: "Reason",
      classNames: 'error',
      style: "secondary"
    });
    let employeeDropdown = dropdown.build({
      dropdownId: "employeeDropdown",
      label: "Employee To Notify",
      classNames: 'error',
      style: "secondary"
    });
    let cancelBtn = button.build({
      text: "Cancel",
      style: "secondary",
      type: "outlined",
      icon: 'close',
      callback: function() {
        DOM.clearActionCenter();
        scheduling.init();
      }
    });
    let submitRequestBtn = button.build({
      id: "submitRequestBtn",
      text: "Submit Request",
      style: "secondary",
      type: "contained",
      classNames: "disabled",
      icon: 'send',
      callback: function() {
        submitRequest();
      }
    });

    dateWrap.appendChild(fromDateInput);
    dateWrap.appendChild(fromTimeInput);
    cardBody.appendChild(dateWrap);

    timeWrap.appendChild(toDateInput);
    timeWrap.appendChild(toTimeInput);
    cardBody.appendChild(timeWrap);

    cardBody.appendChild(reasonDropdown);
    cardBody.appendChild(employeeDropdown);

    btnWrap.appendChild(submitRequestBtn);
    btnWrap.appendChild(cancelBtn);
    cardBody.appendChild(btnWrap)

    cardHeader.appendChild(headerText);
    
    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    actioncenter.appendChild(card);

    //EVENT LISTENERS TO FOR REQIRED AND ENABELING SUBMIT BTN
    fromDateInput.classList.add("error");
    toDateInput.classList.add("error");
    reasonDropdown.classList.add('error')
    employeeDropdown.classList.add('error')

    var fromDateField = document.getElementById("fromDate");
    var toDateField = document.getElementById("toDate");
    var reasonDropdownField = document.getElementById("reasonDropdown");
    var employeeDropdownField = document.getElementById("employeeDropdown");

    fromDateInput.addEventListener("change", function() {
      if (fromDateField.value === "") {
        fromDateInput.classList.add("error");
      } else {
        fromDateInput.classList.remove("error");
      }
      if (fromDateField.value === "" || toDateField.value === "" || reasonDropdownField.selectedIndex === 0 || employeeDropdownField.selectedIndex === 0) {
        submitRequestBtn.classList.add("disabled");
      } else {
        submitRequestBtn.classList.remove("disabled");
      }
    });
    toDateInput.addEventListener("change", function() {      
      if (toDateField.value === "") {
        toDateInput.classList.add("error");
      } else {
        toDateInput.classList.remove("error");
      }
      if (fromDateField.value === "" || toDateField.value === "" || reasonDropdownField.selectedIndex === 0 || employeeDropdownField.selectedIndex === 0) {
        submitRequestBtn.classList.add("disabled");
      } else {
        submitRequestBtn.classList.remove("disabled");
      }
    });
    reasonDropdown.addEventListener("change", function() {
      var selectedOption = event.target.options[event.target.selectedIndex];
      reasonId = selectedOption.id;
      if (reasonDropdownField.selectedIndex === 0) {
        reasonDropdown.classList.add("error");
      } else {
        reasonDropdown.classList.remove("error");
      }
      if (fromDateField.value === "" || toDateField.value === "" || reasonDropdownField.selectedIndex === 0 || employeeDropdownField.selectedIndex === 0) {
        submitRequestBtn.classList.add("disabled");
      } else {
        submitRequestBtn.classList.remove("disabled");
      }
    });
    employeeDropdown.addEventListener("change", function() {
      var selectedOption = event.target.options[event.target.selectedIndex];
      employeeId = selectedOption.id;
      if (employeeDropdownField.selectedIndex === 0) {
        employeeDropdown.classList.add("error");
      } else {
        employeeDropdown.classList.remove("error");
      }
      if (fromDateField.value === "" || toDateField.value === "" || reasonDropdownField.selectedIndex === 0 || employeeDropdownField.selectedIndex === 0) {
        submitRequestBtn.classList.add("disabled");
      } else {
        submitRequestBtn.classList.remove("disabled");
      }
    });


    schedulingAjax.getRequestTimeOffDropdownEmployees(populateEmployeesDropdown);
    schedulingAjax.getCallOffDropdownReasonsAjax(populateReasonsDropdown);
  }

  function init() {
    actioncenter = document.getElementById("actioncenter");
    DOM.clearActionCenter();
    buildRequestTimeOff();
  }

  return {
    init
  };
})();
