var scheduling = (function() {
  function loadSchedulingLanding() {
    let schedulingCalendarBtn = button.build({
      text: "View Calendar",
      style: "secondary",
      type: "contained",
      callback: function() {
        setActiveModuleSectionAttribute('scheduling-calendar');
        PROGRESS.SPINNER.show('Loading Schedule...');
        schedulingCalendar.init();
      }
    });
    let schedulingRequestTimeOffBtn = button.build({
      text: "Request Time Off",
      style: "secondary",
      type: "contained",
      callback: function() {
        setActiveModuleSectionAttribute('scheduling-requestTimeOff');
        PROGRESS.SPINNER.show('Loading...');
        schedulingRequestTimeOff.init();
      }
    });
    let schedulingApproveRequestBtn = button.build({
      text: "Approve Requests",
      style: "secondary",
      type: "contained",
      callback: function() {
        setActiveModuleSectionAttribute('scheduling-approveRequests');
        PROGRESS.SPINNER.show('Loading...');
        schedulingApproveRequest.init();
      }
    });

    var btnWrap = document.createElement("div");
    btnWrap.classList.add("landingBtnWrap");

    btnWrap.appendChild(schedulingCalendarBtn);

    if ($.session.schedulingView === true && $.session.schedulingUpdate === false) {
    } else {
      btnWrap.appendChild(schedulingRequestTimeOffBtn);
      btnWrap.appendChild(schedulingApproveRequestBtn);
    }

    DOM.ACTIONCENTER.appendChild(btnWrap);
  }

  function init() {
    //PERMISSION = SCHEDULE VIEW ONLY
    if (!$.session.schedulingUpdate) {
      setActiveModuleSectionAttribute('scheduling-calendar');
      schedulingCalendar.init();
    } else {
      loadSchedulingLanding();
    }
  }

  return {
    init
  };
})();
