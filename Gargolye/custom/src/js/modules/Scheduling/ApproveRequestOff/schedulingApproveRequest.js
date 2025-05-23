var schedulingApproveRequest = (function () {
    var actioncenter;
    var daysOffTable;
    var callOffTable;
    var openShiftTable;
    var overlapWrap;
    var overlapsExist = false;
    var overlapApprovalData;
    var overlapIds = [];
    var daysOffOverlapConfirmed = false;
    // var openShiftRequests;

    //UTIL
    //---------------------

    function areConsecutiveDates(date1, date2) {
        date1 = date1.split(' ')[0].split('/');
        date2 = date2.split(' ')[0].split('/');

        date1[0] = date1[0] - 1;
        date2[0] = date2[0] - 1;

        var dateOne = new Date(date1[2], date1[0], date1[1]);
        var dateTwo = new Date(date2[2], date2[0], date2[1]);

        dateOne = addDays(dateOne, 1);

        return dateOne.getTime() === dateTwo.getTime();
    }

    function addDays(dirtyDate, dirtyAmount) {
        const date = cloneDate(dirtyDate);
        const amount = toInteger(dirtyAmount);
        date.setDate(date.getDate() + amount);
        return date;
    }

    function cloneDate(argument) {
        const argStr = Object.prototype.toString.call(argument);

        if (argument instanceof Date || typeof argument === 'object') {
            return new Date(argument.getTime());
        } else if (typeof argument === 'number') {
            return new Date(argument);
        } else {
            argument = argument.split(',');
            return new Date(parseInt(argument[0]), parseInt(argument[1] - 1), parseInt(argument[2]));
        }
    }

    function toInteger(dirtyNumber) {
        var number = Number(dirtyNumber);

        if (isNaN(number)) {
            return number;
        }
    }


    function addDays(dirtyDate, dirtyAmount) {
        const date = cloneDate(dirtyDate);
        const amount = toInteger(dirtyAmount);
        date.setDate(date.getDate() + amount);
        return date;
    }

    function cloneDate(argument) {
        const argStr = Object.prototype.toString.call(argument);

        if (argument instanceof Date || (typeof argument === 'object' && argStr === ['object Date'])) {
            return new Date(argument.getTime());
        } else if (typeof argument === 'number' || argStr === ['object Number']) {
            return new Date(argument);
        } else {
            argument = argument.split(',');
            return new Date(parseInt(argument[0]), parseInt(argument[1] - 1), parseInt(argument[2]));
        }
    }

    function toInteger(dirtyNumber) {
        var number = Number(dirtyNumber);

        if (isNaN(number)) {
            return number;
        }

        return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    //REST
    //---------------------

    function buildApproveRequestPage() {
        //Header
        actioncenter = document.getElementById('actioncenter');
        let header = document.createElement('div');
        header.classList.add('approveRequestHeader');
        let headerText = document.createElement('h2');
        headerText.innerHTML = 'Request Approvals';

        schedulingAjax.getScheduleMyApprovalDataAjax(
            {
                token: $.session.Token,
                personId: $.session.isPSI ? 0 : $.session.PeopleId,
            },
            populateApprovalPage,
        );
    }

    function populateApprovalPage(results) {
      actioncenter = document.getElementById('actioncenter');
      var selectedShiftCounter = 0;

      //Table with requests - Table will cycle between colors (green(approve), red(deny), white(no action)) when clicked
      // There is curently a table for each type of request, these will eventually be tabs
      var requestData = {
        daysOff: [],
        callOff: [],
        openShift: [],
      };

      results.forEach(res => {
        switch (res.requestType) {
          case 'DayOff':
            requestData.daysOff.push(res);
            break;
          case 'CallOff':
            requestData.callOff.push(res);
            break;
          case 'RequestShift':
            requestData.openShift.push(res);
            break;
          default:
            break;
        }
      });

      var daysOffTableOpts = {
        headline: 'Days Off Requests',
        columnHeadings: ['Employee', 'Start Date/Time', 'End Data/Time', 'Reason', 'Approve/Deny'],
        tableId: 'daysOffTable',
        callback: function () {
          cycleApprovalStatus(event.target);
        },
      };
      var openShiftTableOpts = {
        headline: 'Open Shift Requests',
        columnHeadings: [
          'Employee',
          'Date/Time',
          'Location',
          'Reason', //Reason Needed?
          'Approve/Deny',
        ],
        tableId: 'openShiftTable',
        callback: function () {
          cycleApprovalStatus(event.target);
        },
      };

      var callOffTableOpts = {
        headline: 'Call Offs',
        columnHeadings: ['Employee', 'Date/Time', 'Location', 'Reason', 'Approve/Deny'],
        tableId: 'callOffTable',
        callback: function () {
          cycleApprovalStatus(event.target);
        },
      };

      if (requestData.daysOff.length > 0) {
        daysOffTable = table.build(daysOffTableOpts);

        // Set the data type for each header, for sorting purposes
        const headers = daysOffTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Employee
        headers[1].setAttribute('data-type', 'date'); // Start Date/Time
        headers[2].setAttribute('data-type', 'date'); //End Date/Time
        headers[3].setAttribute('data-type', 'string'); // Reason
        headers[4].setAttribute('data-type', 'string'); // Approve/Deny

        let data = renderDaysOffSectionBody(requestData.daysOff);
        actioncenter.appendChild(daysOffTable);
        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(daysOffTable);

        table.populate('daysOffTable', data);
      }

      if (requestData.callOff.length > 0) {
        callOffTable = table.build(callOffTableOpts);

        // Set the data type for each header, for sorting purposes
        const headers = callOffTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Employee
        headers[1].setAttribute('data-type', 'date'); // Start Date/Time
        headers[2].setAttribute('data-type', 'string'); //Location
        headers[3].setAttribute('data-type', 'string'); // Reason
        headers[4].setAttribute('data-type', 'string'); // Approve/Deny

        let data = dataForCallOffandOpenShifts(requestData.callOff);
        actioncenter.appendChild(callOffTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(callOffTable);

        table.populate('callOffTable', data);
      }

      if (requestData.openShift.length > 0) {
        openShiftTable = table.build(openShiftTableOpts);

        // Set the data type for each header, for sorting purposes
        const headers = openShiftTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Employee
        headers[1].setAttribute('data-type', 'date'); // Start Date/Time
        headers[2].setAttribute('data-type', 'string'); //Location
        headers[3].setAttribute('data-type', 'string'); // Reason
        headers[4].setAttribute('data-type', 'string'); // Approve/Deny

        let data = dataForCallOffandOpenShifts(requestData.openShift);
        actioncenter.appendChild(openShiftTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(openShiftTable);

        table.populate('openShiftTable', data);
      }

      //MESSAGE TO DISPLAY WHEN THERE ARE NO REQUESTS TO APPROVE
      if (requestData.daysOff.length === 0 && requestData.callOff.length === 0 && requestData.openShift.length === 0) {
        noRequestsMessage();
      }

      function cycleApprovalStatus(element) {
        if (!element.classList.contains('table') && !element.classList.contains('header')) {
          let status = element.dataset.approvalStatus;
          if (status === undefined) {
            element.setAttribute('data-approval-status', 'approve');
            element.lastChild.innerHTML = 'Approve';
            selectedShiftCounter++;
          } else if (status === 'approve') {
            element.setAttribute('data-approval-status', 'deny');
            element.lastChild.innerHTML = 'Deny';
          } else if (status === 'deny') {
            element.removeAttribute('data-approval-status');
            element.lastChild.innerHTML = '';
            selectedShiftCounter--;
          }
          selectedShiftCounter > 0 ? ACTION_NAV.show() : ACTION_NAV.hide();
        }
      }

      function renderDaysOffSectionBody(shifts) {
        // make sure shifts are sorted by date and person
        shifts.sort((a, b) => {
          var idA = a.personId;
          var idB = b.personId;
          if (idA === idB) {
            var dateA = a.day.split(' ')[0].split('/');
            var dateB = b.day.split(' ')[0].split('/');
            dateA[0] = dateA[0] - 1;
            dateB[0] = dateB[0] - 1;
            dateA = new Date(dateA[2], dateA[0], dateA[1]);
            dateB = new Date(dateB[2], dateB[0], dateB[1]);
            return dateA - dateB;
          }
          return idA > idB ? 1 : -1;
        });

        // group shifts with consecutive dates AND consecutive reason IDs
        const groupedShifts = shifts.reduce((total, cv) => {
          let lastSubArray;
          let areDatesConsecutive;

          lastSubArray = total[total.length - 1];

          if (lastSubArray) {
            areDatesConsecutive = areConsecutiveDates(lastSubArray[lastSubArray.length - 1].day, cv.day);
            consecutiveReason = lastSubArray[lastSubArray.length - 1].reasonId === cv.reasonId ? true : false;
          } else {
            areDatesConsecutive = false;
          }

          if (!lastSubArray || !areDatesConsecutive || !consecutiveReason) {
            total.push([]);
          }

          total[total.length - 1].push(cv);

          return total;
        }, []);
        //return;

        let tableData = groupedShifts.map(group => {
          var startDate = `${group[0].day.split(' ')[0]} ${UTIL.convertFromMilitary(group[0].fromTime)}`;
          var endDate = `${group[group.length - 1].day.split(' ')[0]} ${UTIL.convertFromMilitary(
            group[group.length - 1].toTime,
          )}`;
          var shiftIds = [];
          group.forEach(shift => shiftIds.push(shift.dayOffId));
          return {
            values: [group[0].name, startDate, endDate, group[0].reasonName, ''],
            id: shiftIds,
          };
        });

        return tableData;
      }

      function noRequestsMessage() {
        var backBtn = button.build({
          text: 'Back',
          style: 'secondary',
          type: 'text',
          icon: 'arrowBack',
          callback: function () {
            DOM.clearActionCenter();
            Scheduling.init();
          },
        });
        var messageElement = document.createElement('h2');
        messageElement.innerHTML = 'You have no pending requests to review.';
        DOM.ACTIONCENTER.appendChild(backBtn);
        DOM.ACTIONCENTER.appendChild(messageElement);
      }

      function setupActionNav() {
        var submitBtn = button.build({
          text: 'Submit',
          style: 'secondary',
          type: 'contained',
          icon: 'send',
          callback: async function () {
            await submitApproveDenyRequest();

            // overlaps exist in approved shifts selected by user
            if (overlapApprovalData !== 'NoOverLap') {
              displayApprovedOverlapPopup();
            } else if (daysOffOverlapConfirmed) {
              overlapAlert(overlapIds);
            } else {
              // overlaps exist between selected shifts and shifts already approved (ie, shifts saved in DB)
              if (overlapsExist) {
                displayOverlapPopup(overlapsExist, overlapWrap);
              } else {
                ACTION_NAV.hide();
                DOM.clearActionCenter();
                Scheduling.init();
              }
            }
          },
        });

        var cancelBtn = button.build({
          text: 'Cancel',
          style: 'secondary',
          type: 'outlined',
          icon: 'close',
          callback: function () {
            //ADD TRANSITION?
            DOM.clearActionCenter();
            ACTION_NAV.hide();
            Scheduling.init();
          },
        });

        ACTION_NAV.populate([submitBtn, cancelBtn]);
        ACTION_NAV.hide();
      }
      setupActionNav();

      function dataForCallOffandOpenShifts(shifts) {
        let tableData = shifts.map((shift, index) => {
          let day = `${shift.day.split(' ')[0]} ${UTIL.convertFromMilitary(
            shift.fromTime,
          )} - ${UTIL.convertFromMilitary(shift.toTime)}`;
          return {
            values: [shift.name, day, shift.locationName, shift.reasonName, ''],
            id: shift.shiftId,
            attributes: [
              { key: 'personId', value: shift.personId },
              { key: 'serviceDate', value: shift.day.split(' ')[0] },
              { key: 'startTime', value: shift.fromTime },
              { key: 'endTime', value: shift.toTime },
              { key: 'userName', value: shift.name },
            ],
          };
        });
        return tableData;
      }
    }

    function overlapApprovedShifts(openShiftRequests) {
      var openShiftRequestList = openShiftRequests.map(request => ({
        shiftId: request.id,
        serviceDate: request.attributes.serviceDate.value,
        personId: request.attributes.personId.value,
        decision: request.dataset.approvalStatus,
        startTime: request.attributes.startTime.value,
        endTime: request.attributes.endTime.value,
        userName: request.attributes.userName.value,
      }));
      var selectedShifts = openShiftRequestList.filter(x => x.decision === 'approve');

      for (const approvedShift of selectedShifts) {
        for (const openShiftRequest of openShiftRequestList) {
          // if its not the same record, then chek for an overlap
          if (approvedShift.shiftId !== openShiftRequest.shiftId) {
            // same person, same date, and openshift = approve, then check for time overlap
            if (
              approvedShift.personId === openShiftRequest.personId &&
              approvedShift.serviceDate === openShiftRequest.serviceDate &&
              openShiftRequest.decision === 'approve'
            ) {
              var selectedStartTime = approvedShift.startTime;
              var selectedEndTime = approvedShift.endTime;
              var existingStartTime = openShiftRequest.startTime;
              var existingEndTime = openShiftRequest.endTime;

              // is there a time overlap
              if (
                (selectedStartTime > existingStartTime && selectedStartTime < existingEndTime) ||
                (selectedEndTime > existingStartTime && selectedEndTime < existingEndTime) ||
                (existingStartTime >= selectedStartTime &&
                  existingStartTime <= selectedEndTime &&
                  existingEndTime >= selectedStartTime &&
                  existingEndTime <= selectedEndTime) ||
                (existingStartTime == selectedStartTime && existingEndTime == selectedEndTime)
              ) {
                return approvedShift.serviceDate + ' ' + approvedShift.userName;
              } //if compare hours
            } //if compare personId/Date
          } //if compare personId/Shift
        } // for openShiftList
      } // for selectedShifts

      return 'NoOverLap';
    }

    function displayApprovedOverlapPopup() {
      var overlapPopup = POPUP.build({
        classNames: 'overlapRequestShiftPopup',
      });
      overlapIntro = document.createElement('div');
      overlapIntro.innerHTML = `
          <div class="detailsHeading">
            <h2>Overlapping Shift Approvals(s)</h2>
            <p>You selected conflicting overlapping approvals for the following: ${overlapApprovalData}. No approvals were processed. Please review your possible approvals and try again.</p></br>
          </div>
      `;
      overlapPopup.appendChild(overlapIntro);
      // requestApprovalOverlapPopup

      let overlapOKBtn = button.build({
        text: 'OK',
        style: 'secondary',
        type: 'contained',
        icon: 'close',
        callback: function () {
          POPUP.hide(overlapPopup);
          // init();
        },
      });

      // overlapPopup.appendChild(overlapWrap);
      overlapPopup.appendChild(overlapOKBtn);
      POPUP.show(overlapPopup);
    }

    function displayOverlapPopup(overlapsExist, overlapWrap) {
      if (overlapsExist) {
        var overlapPopup = POPUP.build({
          classNames: 'overlapRequestShiftPopup',
        });
        overlapIntro = document.createElement('div');
        overlapIntro.innerHTML = `
            <div class="detailsHeading">
              <h2>Overlapping Open Shift Request(s)</h2>
              <p>The following open shift requests overlap with an existing shift the staff already scheduled to work. These shifts cannot be approved.</p></br>
            </div>
        `;
        overlapPopup.appendChild(overlapIntro);
        // requestApprovalOverlapPopup

        let overlapOKBtn = button.build({
          text: 'OK',
          style: 'secondary',
          type: 'contained',
          icon: 'close',
          callback: function () {
            POPUP.hide(overlapPopup);
            init();
          },
        });

        overlapPopup.appendChild(overlapWrap);
        overlapPopup.appendChild(overlapOKBtn);
        POPUP.show(overlapPopup);
      }
    }

    async function submitApproveDenyRequest() {
      if (openShiftTable) {
        var openShiftTableBody = openShiftTable.querySelector('.table__body');
        var openShiftRequests = Array.prototype.slice.call(openShiftTableBody.querySelectorAll('.table__row'));

        // check approved shifts to ensure no overlap (before checking for overlaps with assigned shifts)
        overlapApprovalData = overlapApprovedShifts(openShiftRequests);
        if (overlapApprovalData !== 'NoOverLap') {
          return;
        }
      }
      if (callOffTable) {
        var callOffTableBody = callOffTable.querySelector('.table__body');
        var callOffRequests = Array.prototype.slice.call(callOffTableBody.querySelectorAll('.table__row'));
      }
      if (daysOffTable) {
        var daysOffTableBody = daysOffTable.querySelector('.table__body');
        var daysOffRequests = Array.prototype.slice.call(daysOffTableBody.querySelectorAll('.table__row'));
      }

      if (!overlapApprovalData) {
        overlapApprovalData = 'NoOverLap';
      }

      // check selected shifts against shifts already assigned to the user
      if (openShiftRequests) {
        overlapWrap = document.createElement('div');
        overlapsExist = false;

        for (const request of openShiftRequests) {
          var shiftId = request.id;
          var decision = request.dataset.approvalStatus;
          var personId = request.attributes.personId.value;

          decision = decision === 'approve' ? 'A' : decision === 'deny' ? 'D' : '';

          const { getOverlapDataforSelectedShiftResult: overlapWithExistingShiftData } =
            await schedulingAjax.getOverlapDataforSelectedShiftAjax(shiftId, personId);

          if (overlapWithExistingShiftData === 'NoOverLap' && decision !== '') {
            schedulingAjax.approveDenyOpenShiftRequestSchedulingAjax({
              token: $.session.Token,
              requestedShiftId: shiftId,
              decision: decision,
            });
          } else if (overlapWithExistingShiftData !== 'NoOverLap' && decision === 'D') {
            schedulingAjax.approveDenyOpenShiftRequestSchedulingAjax({
              token: $.session.Token,
              requestedShiftId: shiftId,
              decision: decision,
            }); //ajax
          } else {
            if (overlapWithExistingShiftData != 'NoOverLap' && decision === 'A') {
              overlapsExist = true;
              var overlapShiftData = await JSON.parse(overlapWithExistingShiftData);
              var serviceDate = overlapShiftData.serviceDate.split(' ');
              var startTime = UTIL.convertFromMilitary(overlapShiftData.startTime.slice(0, -3));
              var endTime = UTIL.convertFromMilitary(overlapShiftData.endTime.slice(0, -3));
              overlapWrap.innerHTML += `<p><b>${serviceDate[0]}   ${overlapShiftData.lastName}, ${overlapShiftData.firstName}   ${overlapShiftData.locationName}   ${startTime}-${endTime}</b></p></br>`;
            } // if clause end --  (overlapWithExistingShiftData != "NoOverLap" && decision === 'A')
          } // else clause end -- (overlapWithExistingShiftData == "NoOverLap" && decision !== '')
        } // for loop
      } // if openShiftRequests

      if (callOffRequests) {
        callOffRequests.forEach(request => {
          var shiftId = request.id;
          var decision = request.dataset.approvalStatus;
          decision = decision === 'approve' ? 'A' : decision === 'deny' ? 'D' : '';
          if (decision !== '') {
            //token, callOffShiftId, decision
            schedulingAjax.approveDenyCallOffRequestSchedulingAjax({
              token: $.session.Token,
              callOffShiftId: shiftId,
              decision: decision,
            });
          }
        });
      }

      if (daysOffRequests) {
        for (const request of daysOffRequests) {
          var shiftIds = request.id;
          var decision = request.dataset.approvalStatus;
          decision = decision === 'approve' ? 'A' : decision === 'deny' ? 'D' : '';
          if (decision !== '') {
            var dateTime;
            var startDate = new Date(request.children[1].innerHTML).toLocaleDateString();
            var endDate = new Date(request.children[2].innerHTML).toLocaleDateString();
            var startTime = new Date(request.children[1].innerHTML).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            var endTime = new Date(request.children[2].innerHTML).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            if (startDate === endDate) {
              dateTime =
                startTime == '12:00 AM'
                  ? startDate
                  : endTime == '11:59 PM'
                  ? startDate + ' ' + startTime
                  : startDate + ' ' + startTime + ' - ' + endTime;
            } else {
              dateTime =
                startDate +
                ' ' +
                (startTime == '12:00 AM' ? '' : startTime) +
                ' - ' +
                endDate +
                ' ' +
                (endTime == '11:59 PM' ? '' : endTime);
            }
            //token, daysOffIdString(comma separated), decision
            const approveDenyResponse = await schedulingAjax.approveDenyDaysOffRequestSchedulingAjax({
              token: $.session.Token,
              daysOffIdString: shiftIds,
              decision: decision,
              dateTime: dateTime,
            });

            if (approveDenyResponse !== 'Success') {
              // alert("Overlap found. Please review the days off requests NOT processed. These requests are in conflict with already approved requests.")
              overlapIds.push(approveDenyResponse);
              daysOffOverlapConfirmed = true;
            } else {
              daysOffOverlapConfirmed = false;
            }
          }
        }
      }
    }

    function overlapAlert(idArray) {
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
        callback: async function () {
          POPUP.hide(alertPopup);

          // Reset the overlap Ids
          overlapIds = [];

          ACTION_NAV.hide();
          DOM.clearActionCenter();
          Scheduling.init();
        },
      });

      let requestDataText = [];

      // Loop through each id in the array
      idArray.forEach(id => {
        // Get the parent div element with the current id
        const parentDiv = document.getElementById(id);

        // Get all the nested div elements inside the parent div
        const nestedDivs = parentDiv.getElementsByTagName('div');

        // Create an empty object to store the text content of each nested div
        const nestedDivsObject = {};

        // Loop through each nested div element and add its text content as a property to the object
        for (let i = 0; i < nestedDivs.length; i++) {
          const textContent = nestedDivs[i].textContent;
          nestedDivsObject[`nestedDiv${i + 1}`] = textContent;
        }

        const requestData = `Employee: ${nestedDivsObject.nestedDiv1}, ${nestedDivsObject.nestedDiv2} - ${nestedDivsObject.nestedDiv3}`;
        requestDataText.push(requestData);
      });

      alertbtnWrap.appendChild(alertokBtn);

      const paragraphs = requestDataText.map(item => {
        return `<p>${item}</p>`;
      });

      // Create the alert message
      const alertMessage = document.createElement('p');
      alertMessage.innerHTML = 'The following requests overlap an existing time off request and could not be approved:';

      // Append each paragraph to the alert message
      paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.innerHTML = paragraph;
        alertMessage.appendChild(p);
      });

      // Append the alert message and button wrapper to the alert popup
      alertPopup.appendChild(alertMessage);
      alertPopup.appendChild(alertbtnWrap);

      // Show the alert popup
      POPUP.show(alertPopup);
    }

    function init() {
        daysOffTable = null;
        callOffTable = null;
        openShiftTable = null;
        actioncenter = document.getElementById('actioncenter');
        DOM.clearActionCenter();
        buildApproveRequestPage();
    }

    return {
        init,
    };
})();
