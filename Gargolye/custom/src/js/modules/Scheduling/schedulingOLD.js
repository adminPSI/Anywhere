var scheduling = (function () {
  function loadSchedulingLanding() {
    let schedulingCalendarBtn = button.build({
      text: 'View Calendar',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-calendar');
        PROGRESS.SPINNER.show('Loading Schedule...');
        schedulingCalendar.init();
      },
    });
    let schedulingRequestTimeOffBtn = button.build({
      text: 'Request Time Off',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-requestTimeOff');
        PROGRESS.SPINNER.show('Loading...');
        schedulingRequestTimeOff.init();
      },
    });
    let schedulingApproveRequestBtn = button.build({
      text: 'Approve Requests',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        setActiveModuleSectionAttribute('scheduling-approveRequests');
        PROGRESS.SPINNER.show('Loading...');
        schedulingApproveRequest.init();
      },
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('landingBtnWrap');

    btnWrap.appendChild(schedulingCalendarBtn);

    if ($.session.schedulingView === true && $.session.schedulingUpdate === false) {
    } else {
      btnWrap.appendChild(schedulingRequestTimeOffBtn);
      btnWrap.appendChild(schedulingApproveRequestBtn);
    }

    DOM.ACTIONCENTER.appendChild(btnWrap);
  }

  function init() {
    //NEW
    //PERMISSION = SCHEDULE VIEW ONLY
    // if (!$.session.schedulingUpdate) {
    //   setActiveModuleSectionAttribute('scheduling-calendar');
    //   schedulingCalendar.init();
    // } else {
    //   loadSchedulingLanding();
    // }
  }

  return {
    init,
  };
})();

// Open Shifts: EVENT_TYPE 3
//-----------------------------------------------------------------------
function showOpenShiftPopup(data) {
  const shiftDate = data.serviceDate.split(' ')[0];
  let startTime = data.startTime;
  let endTime = data.endTime;
  startTime = dates.convertFromMilitary(startTime);
  endTime = dates.convertFromMilitary(endTime);
  const consumers = data.consumerNames;
  const location = data.locationName;
  const shiftNotes = data.shiftNotes;
  const workCode = `${data.workCode} - ${data.workCodeDescription}`;
  let shiftType = data.shiftType;
  shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
  shiftDateForCall = shiftDate;

  const popup = POPUP.build({
    classNames: 'openShiftDetails',
    attributes: [{ key: 'shiftId', value: data.shiftId }],
  });

  wrap = document.createElement('div');
  wrap.innerHTML = `
      <div class="detailsHeading">
        <h2>Shift Details</h2>
        <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
      </div>
      <hr>
      <div class="detailsBody">
        <div class="location popupDetailsLine">
          <h4 class="label">Location:</h4>
          <p>${location}</p>
        </div>
        <hr>
        <div class="time popupDetailsLine">
          <h4 class="label">Time:</h4>
          <p>${startTime} - ${endTime}</p>
        </div>
        <hr>
        <div class="employee popupDetailsLine">
          <h4 class="label">Consumers:</h4>
          <p>${consumers}</p>
        </div>
        <hr>
        <div class="workCode popupDetailsLine">
          <h4 class="label">Work Code:</h4>
          <p>${workCode}</p>
        </div>
        <hr>
        <div class="shiftType popupDetailsLine">
          <h4 class="label">Shift Type:</h4>
          <p>${shiftType}</p>
        </div>
        <hr>
        <div class="shiftNotes popupDetailsLine">
          <h4 class="label">Notes:</h4>
          <p>${shiftNotes}</p>
        </div>
      </div>
  `;
  popup.appendChild(wrap);

  if ($.session.schedRequestOpenShifts === 'N' || $.session.isPSI) {
  } else if (!$.session.schedulingUpdate || !$.session.schedulingView) {
  } else {
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');

    const requestShiftBtn = button.build({
      text: 'Request Shift',
      style: 'secondary',
      type: 'contained',
      callback: async function () {
        POPUP.hide(popup);

        const { getOverlapStatusforSelectedShiftResult: overlapWithExistingShift } =
          await schedulingAjax.getOverlapStatusforSelectedShiftAjax(data.shiftId, $.session.PeopleId);

        if (overlapWithExistingShift == 'NoOverLap') {
          renderSendShiftRequestPopup({
            token: $.session.Token,
            shiftId: data.shiftId,
            personId: $.session.PeopleId,
            status: 'P',
            notifiedEmployeeId: null,
          });
        } else {
          displayOverlapPopup(overlapWithExistingShift);
          return;
        }
      },
    });

    btnWrap.appendChild(requestShiftBtn);
    popup.appendChild(btnWrap);
  }

  POPUP.show(popup);
}

// Pending Open Shifts: EVENT_TYPE 4
//-----------------------------------------------------------------------
function showPendingOpenShiftsPopup(data) {
  const shiftDate = data.serviceDate.split(' ')[0];
  let startTime = data.startTime;
  let endTime = data.endTime;
  startTime = dates.convertFromMilitary(startTime);
  endTime = dates.convertFromMilitary(endTime);
  const consumers = data.consumerNames;
  const location = data.locationName;
  const shiftNotes = data.shiftNotes;
  const workCode = `${data.workCode} - ${data.workCodeDescription}`;
  let shiftType = data.shiftType;
  shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
  shiftDateForCall = shiftDate;

  const popup = POPUP.build({
    classNames: 'pendingOpenShiftPopup',
    attributes: [{ key: 'shiftId', value: data.shiftId }],
  });

  wrap = document.createElement('div');
  wrap.innerHTML = `
      <div class="detailsHeading">
        <h2>Shift Details</h2>
        <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
      </div>
      
      <div class="detailsBody">
        <div class="location popupDetailsLine">
          <h4 class="label">Location:</h4>
          <p>${location}</p>
        </div>
        <hr>
        <div class="time popupDetailsLine">
          <h4 class="label">Time:</h4>
          <p>${startTime} - ${endTime}</p>
        </div>
        <hr>
        <div class="employee popupDetailsLine">
          <h4 class="label">Consumers:</h4>
          <p>${consumers}</p>
        </div>
        <hr>
        <div class="workCode popupDetailsLine">
          <h4 class="label">Work Code:</h4>
          <p>${workCode}</p>
        </div>
        <hr>
        <div class="shiftType popupDetailsLine">
          <h4 class="label">Shift Type:</h4>
          <p>${shiftType}</p>
        </div>
        <hr>
        <div class="shiftNotes popupDetailsLine">
          <h4 class="label">Notes:</h4>
          <p>${shiftNotes}</p>
        </div>
      </div>
  `;

  popup.appendChild(wrap);

  if (data.requestedById === $.session.PeopleId) {
    const cancelRequestBtn = button.build({
      id: 'cancelRequestBtn',
      attributes: [{ shiftId: data.shiftId }],
      text: 'Cancel Request',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        const shiftId = data.shiftId;
        schedulingAjax.cancelRequestOpenShiftSchedulingAjax(shiftId);
        POPUP.hide(popup);

        //TODO: ? reload the calendar ?
        //? I think we just want to remove this event from the calendar
        // _scheduleView = 'mine';
        // _currentView = 'week';
        // init();
      },
    });

    let btnWrap = document.createElement('div');
    btnWrap.classList.add('popupBtnWrap');
    btnWrap.appendChild(cancelRequestBtn);
    popup.appendChild(btnWrap);
  }

  POPUP.show(popup);
}

// Call Off Shifts: EVENT_TYPE 5
//-----------------------------------------------------------------------
function showPendingCallOffShiftsPopup(data) {
  const shiftDate = data.serviceDate.split(' ')[0];
  let startTime = data.startTime;
  let endTime = data.endTime;
  startTime = data.convertFromMilitary(startTime);
  endTime = data.convertFromMilitary(endTime);
  const consumers = data.consumerNames;
  const location = data.locationName;
  const shiftNotes = data.shiftNotes;
  const workCode = `${data.workCode} - ${data.workCodeDescription}`;
  let shiftType = data.shiftType;
  shiftType = shiftType === 'A' ? 'Awake' : shiftType === 'N' ? 'Night' : shiftType === 'D' ? 'Day' : '';
  shiftDateForCall = shiftDate;

  const popup = POPUP.build({
    classNames: 'pendingCallOffDetails',
    attributes: [{ key: 'shiftId', value: details.shiftId }],
  });

  const wrap = document.createElement('div');
  wrap.innerHTML = `
      <div class="detailsHeading">
        <h2>Shift Details</h2>
        <p class="smallDetail font-mediumEmphasis">${shiftDate}</p>
      </div>
      <div class="detailsBody">
        <div class="location popupDetailsLine">
          <h4 class="label">Location:  </h4>
          <p>${location}</p>
        </div>
        <hr>
        <div class="time popupDetailsLine">
          <h4 class="label">Time:  </h4>
          <p>${startTime} - ${endTime}</p>
        </div>
        <hr>
        <div class="employee popupDetailsLine">
          <h4 class="label">Consumers:  </h4>
          <p>${consumers}</p>
        </div>
        <hr>
        <div class="workCode popupDetailsLine">
          <h4 class="label">Work Code:  </h4>
          <p>${workCode}</p>
        </div>
        <hr>
        <div class="shiftType popupDetailsLine">
          <h4 class="label">Shift Type:  </h4>
          <p>${shiftType}</p>
        </div>
        <hr>
        <div class="shiftNotes popupDetailsLine">
          <h4 class="label">Notes:  </h4>
          <p>${shiftNotes}</p>
        </div>
      </div>
    `;
  popup.appendChild(wrap);

  POPUP.show(popup);
}
