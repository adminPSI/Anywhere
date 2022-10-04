var schedulingApproveRequest = (function() {
  var actioncenter;
  var daysOffTable;
  var callOffTable;
  var openShiftTable;


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

function toInteger(dirtyNumber) {  
  var number = Number(dirtyNumber)

  if (isNaN(number)) {
    return number
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number)
}

//REST
//---------------------

  function buildApproveRequestPage() {


      //Header
      actioncenter = document.getElementById("actioncenter");
      let header = document.createElement("div");
      header.classList.add("approveRequestHeader");
      let headerText = document.createElement("h2");
      headerText.innerHTML = "Request Approvals";

      schedulingAjax.getScheduleMyApprovalDataAjax({
        token: $.session.Token,
        personId: $.session.isPSI ? 0 : $.session.PeopleId
      }, populateApprovalPage);
  }

  function populateApprovalPage(results) {
    actioncenter = document.getElementById("actioncenter");
    var selectedShiftCounter = 0;

    //Table with requests - Table will cycle between colors (green(approve), red(deny), white(no action)) when clicked
    // There is curently a table for each type of request, these will eventually be tabs
    var requestData = {
      daysOff: [],
      callOff: [],
      openShift: []
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
      columnHeadings:[
        'Employee',
        'Start Date/Time',
        'End Data/Time',
        'Reason',
        'Approve/Deny'
      ],
      tableId: 'daysOffTable',
      callback: function () {
        cycleApprovalStatus(event.target);
      }
      
    }
    var openShiftTableOpts = {
      headline: 'Open Shift Requests',
      columnHeadings:[
        'Employee',
        'Date/Time',
        'Location',
        'Reason',//Reason Needed?
        'Approve/Deny'
      ],
      tableId: 'openShiftTable',
      callback: function () {
        cycleApprovalStatus(event.target);
      }
    }
    
    var callOffTableOpts = {
      headline: 'Call Offs',
      columnHeadings:[
        'Employee',
        'Date/Time',
        'Location',
        'Reason',
        'Approve/Deny'
      ],
      tableId: 'callOffTable',
      callback: function () {
        cycleApprovalStatus(event.target);
      }
    }


    if (requestData.daysOff.length > 0) {
      daysOffTable = table.build(daysOffTableOpts);
      let data = renderDaysOffSectionBody(requestData.daysOff);
      actioncenter.appendChild(daysOffTable);
      table.populate('daysOffTable', data)
    }
    
    if (requestData.callOff.length > 0) {
      callOffTable = table.build(callOffTableOpts);
      let data = dataForCallOffandOpenShifts(requestData.callOff);
      actioncenter.appendChild(callOffTable);
      table.populate('callOffTable', data);
    }

    if (requestData.openShift.length > 0) {
      openShiftTable = table.build(openShiftTableOpts);
      let data = dataForCallOffandOpenShifts(requestData.openShift);
      actioncenter.appendChild(openShiftTable);
      table.populate('openShiftTable', data);
    }

    //MESSAGE TO DISPLAY WHEN THERE ARE NO REQUESTS TO APPROVE
    if (requestData.daysOff.length === 0 && requestData.callOff.length === 0 && requestData.openShift.length === 0) {
      noRequestsMessage();
    }

    function cycleApprovalStatus(element) {
      if (!element.classList.contains('table') && !element.classList.contains('header')) {
        let status = element.dataset.approvalStatus;
        if (status === undefined){
          element.setAttribute('data-approval-status', 'approve');
          element.lastChild.innerHTML = 'Approve';
          selectedShiftCounter ++;
        } else if (status === 'approve') {
          element.setAttribute('data-approval-status', 'deny');
          element.lastChild.innerHTML = 'Deny';
        } else if (status === 'deny') {
          element.removeAttribute('data-approval-status')
          element.lastChild.innerHTML = '';
          selectedShiftCounter --;
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
        
        if(!lastSubArray || !areDatesConsecutive || !consecutiveReason) {
          total.push([]);
        }
        
        total[total.length - 1].push(cv);
        
        return total;

      }, []);
      //return;

      let tableData = groupedShifts.map(group => {
        var startDate = `${group[0].day.split(' ')[0]} ${UTIL.convertFromMilitary(group[0].fromTime)}`;
        var endDate = `${group[group.length - 1].day.split(' ')[0]} ${UTIL.convertFromMilitary(group[group.length - 1].toTime)}`;
        var shiftIds = [];
        group.forEach(shift => shiftIds.push(shift.dayOffId))
        return {
          values: [
            group[0].name,
            startDate,
            endDate,
            group[0].reasonName,
            ''
          ],
          id: shiftIds
        }
      });

      
      return tableData;
      
    }

    function noRequestsMessage() {
      var backBtn = button.build({
        text: 'Back',
        style: 'secondary',
        type: 'text',
        icon: 'arrowBack',
        callback: function() {
          DOM.clearActionCenter();
          scheduling.init();
        }
      })
      var messageElement = document.createElement('h2');
      messageElement.innerHTML = "You have no pending requests to review."
      DOM.ACTIONCENTER.appendChild(backBtn);
      DOM.ACTIONCENTER.appendChild(messageElement);
    }

    function setupActionNav() {
      var submitBtn = button.build({
        text: 'Submit',
        style: 'secondary',
        type: 'contained',
        icon: 'send',
        callback: function() {
          submitApproveDenyRequest()
          // ADD POPUP? OR TRANSITION?
          ACTION_NAV.hide();
          DOM.clearActionCenter();
          scheduling.init();
        }
      })

      var cancelBtn = button.build({
        text: 'Cancel',
        style: 'secondary',
        type: 'outlined',
        icon: 'close',
        callback: function() {
          //ADD TRANSITION?
          DOM.clearActionCenter();
          ACTION_NAV.hide();
          scheduling.init();
        }
      })

      ACTION_NAV.populate([submitBtn, cancelBtn]);
      ACTION_NAV.hide();
    }
    setupActionNav();

    function dataForCallOffandOpenShifts(shifts) {
      let tableData = shifts.map((shift, index) => {
        let day = `${shift.day.split(' ')[0]} ${UTIL.convertFromMilitary(shift.fromTime)} - ${UTIL.convertFromMilitary(shift.toTime)}`
        return {
          values: [
            shift.name,
            day,
            shift.locationName,
            shift.reasonName,
            ''
          ],
          id: shift.shiftId
        }
      })
      return tableData;
    }
    
  }

  async function submitApproveDenyRequest() {
    
    if (openShiftTable) {
      openShiftTable = openShiftTable.querySelector('.table__body');
      var openShiftRequests = Array.prototype.slice.call(openShiftTable.querySelectorAll('.table__row'));
    }
    if (callOffTable) {
      callOffTable = callOffTable.querySelector('.table__body');
      var callOffRequests = Array.prototype.slice.call(callOffTable.querySelectorAll('.table__row'));
    }
    if (daysOffTable) {
      daysOffTable = daysOffTable.querySelector('.table__body');
      var daysOffRequests = Array.prototype.slice.call(daysOffTable.querySelectorAll('.table__row'));
    }

    // var openShiftTable = document.getElementById('openShiftTable');
    // var callOffTable = document.getElementById('callOffTable');
    // var daysOffTable = document.getElementById('daysOffTable');

    if (openShiftRequests) {
      openShiftRequests.forEach(request => {
        var shiftId = request.id;
        var decision = request.dataset.approvalStatus;
        decision = decision === 'approve' ? 'A' : decision === 'deny' ? 'D' : '';
        if (decision !== '') {
          //token, requestedShiftId, decision

        //  const { getOverlapDataforSelectedShiftResult: overlapWithExistingShiftData } =
				//	await schedulingAjax.getOverlapDataforSelectedShiftAjax(shiftId);

           //   if (overlapWithExistingShiftData = "NoOverLap") {    // requestedapprovedshiftId overlaps with existingapprovedshiftId
                schedulingAjax.approveDenyOpenShiftRequestSchedulingAjax({
                  token: $.session.Token,
                  requestedShiftId: shiftId,
                  decision: decision
                });  //ajax
                  
            //  } else {

           //     buildthePopUpexplaingtheconflicts();

           //   }  // if requestedapprovedshiftId overlaps with existingapprovedshiftId
        
        } // if decision 

      });  // for loop

    } // if openShiftRequests

    // if (true) {   // there are overlaps
    //   displayPopUpexplaingtheconflict()
    // }

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
            decision: decision
          });
        }
        
      });
    }

    if (daysOffRequests) {
      daysOffRequests.forEach(request => {  
          var shiftIds = request.id;
          var decision = request.dataset.approvalStatus;
          decision = decision === 'approve' ? 'A' : decision === 'deny' ? 'D' : '';
          if (decision !== '') {
          //token, daysOffIdString(comma separated), decision
          schedulingAjax.approveDenyDaysOffRequestSchedulingAjax({
            token: $.session.Token,
            daysOffIdString: shiftIds,
            decision: decision
          });
        }


      });
    }

    //OLD
    // if (daysOffRequests) {
    //   daysOffRequests.forEach(request => {
    //     var shiftIds = request.getAttribute('shiftId');
    //     var decisionDropdown = request.querySelector('.approveDenyDropdown');
    //     var decision = decisionDropdown.options[decisionDropdown.selectedIndex].value;
    //     decision = decision === 'approve' ? 'A' : decision === 'deny' ? 'D' : '';
    //     if (decision !== '') {
    //       //token, daysOffIdString(comma separated), decision
    //       schedulingAjax.approveDenyDaysOffRequestSchedulingAjax({
    //         token: $.session.Token,
    //         daysOffIdString: shiftIds,
    //         decision: decision
    //       });
    //     }
    //   });
    // }
  }

  
  function init() {
    daysOffTable = null;
    callOffTable = null;
    openShiftTable = null;
    actioncenter = document.getElementById("actioncenter");
    DOM.clearActionCenter();
    buildApproveRequestPage()
  }

  return {
    init
  };
})();
