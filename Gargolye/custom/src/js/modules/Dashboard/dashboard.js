var dashboard = (function () {
  var widgets;
  var setupFuncs;
  var widgetSettings;

  // Widget Markup
  var html = {
    absent: `
      <div class="widget__header">
        <h3>Absent Consumers</h3>
      </div>
      <div class="widget__body">
        <div class="totalAbsentConsumers"></div>
        <div class="absentConsumerList"></div>
      </div>
    `,
    adminSingleEntry: `
      <div class='widget__header'>
        <h3 id='dashadminlabel'>Time Entry Review</h3>
      </div>
      <div class="widget__body"></div>
    `,
    customLinks: `
      <div class="widget__header">
        <h3>Custom Links</h3>
      </div>
      <div class="widget__body">
        <div class="customLinksList"></div>
      </div>
    `,
    clockedIn: `
      <div class="widget__header">
        <h3>Day Services</h3>
      </div>
      <div class="widget__body"></div>
    `,
    goals: `
      <div class="widget__header">
        <h3>Daily Services</h3>
      </div>
      <div class="widget__body">
        <div class="widget__body-nav">
          <p class="total-services bold">Total Remaining Services: <span id="goalsCount"></span></p>
          <p class="total-consumers bold">Total Consumers: <span id="goalsConsumerCount"></span></p>
        </div>
        <ul id="goalsUL"></ul>
      </div>
    `,
    hoursWorked: `
      <div class="widget__header">
        <h3>Hours Worked <span id="hoursWorkedTotal"></span></h3>
      </div>
      <div class="widget__body">
        <div id="hoursWorkedLists"></div>
      </div>
    `,
    incidentTracking: `
      <div class="widget__header">
        <h3>Incident Tracking</h3>
      </div>
      <div class="widget__body"></div>
    `,
    infal: `
      <div class='widget__header'>
        <h3>Infal Time Clock</h3>
      </div>
      <div class="widget__body">
      </div>
    `,
    timeClock: `
      <div class="widget__header">
        <h3>Day Service Time Clock</h3>
      </div>
      <div class="widget__body">
        <button class="btn btn--secondary btn--contained clockInOutBtn"></button>
        <div class="overlapError"></div>
        <div class="widget__results"></div>
      </div>
    `,
    schedule: `
      <div class="widget__header">
        <h3>My Schedule<span id="scheduleHoursTotal"></span></h3>
      </div>
      <div class="widget__body">
        <div id="scheduleWorkedLists"></div>
      </div>
    `,
    singleEntry: `
      <div class="widget__header">
        <h3 id="dashsingentrylabel">My Unapproved Time Entries</h3>
      </div>
      <div class="widget__body"></div>
    `,
    systemMessages: `
      <div class="widget__header">
        <h3>System Messages</h3>
      </div>
      <div class="widget__body">
        <div class="messagesList"></div>
      </div>
    `,
    consumerProgressNotes: `
      <div class="widget__header">
        <h3>Consumer Progress Notes</h3>
      </div>
      <div class="widget__body">
        <div id="progressNoteList"></div>
      </div>
    `,
    unreadLocationNotes: `
    <div class="widget__header">
      <h3>Location Progress Notes</h3>
    </div>
    <div class="widget__body">
      <div id="locationProgressNoteList"></div>
    </div>
  `,
    caseNotesProductivity: `
    <div class="widget__header">
      <h3>Case Note Productivity</h3>
    </div>
    <div class="widget__body">
      <div id="cn_productivity"></div>
    </div>
  `,
    caseNotesCaseLoad: `
  <div class="widget__header">
    <h3>My Case Load</h3>
  </div>
  <div class="widget__body">
    <div id="cn_caseLoad"></div>
  </div>
`,
    caseNotesRejected: `
  <div class="widget__header">
    <h3>Rejected Case Notes</h3>
  </div>
  <div class="widget__body">
    <div id="cn_rejected"></div>
  </div>
`,
    planWorkflow: `
  <div class="widget__header">
    <h3>Plan To-Do List</h3>
  </div>
  <div class="widget__body">
    <div id="plan-workflow-tasks"></div>
  </div>
`,
  };

  // Global Dash Functions
  function appendFilterButton(widgetId, btnId) {
    var filterBtn = document.getElementById(btnId);
    if (!filterBtn) {
      var headerSelector = `#${widgetId} .widget__header`;
      var widgetHeader = document.querySelector(headerSelector);
      filterBtn = button.build({
        id: btnId,
        text: 'Filter',
        style: 'primary',
        type: 'text',
        icon: 'filter',
        iconPos: 'right',
        callback: function () {
          var filtersSelector = `#${widgetId} .widget__filters`;
          var widgetFilters = document.querySelector(filtersSelector);
          overlay.show();
          bodyScrollLock.disableBodyScroll(widgetFilters);
          widgetFilters.classList.add('visible');
        },
      });
      widgetHeader.appendChild(filterBtn);
    }
  }
  function buildFilterPopup() {
    var filterPopup = document.createElement('div');
    filterPopup.classList.add(
      'widget__filters',
      'popup',
      'popup--static',
      'popup--filter',
    );
    filterPopup.setAttribute('data-popup', 'true');

    return filterPopup;
  }

  // Widget Init Functions
  function initAbsentWidget() {
    if (infalOnly == false) {
      (function loadAbsentWidget() {
        var div = document.createElement('div');
        div.id = 'dashabsentconsumers';
        div.classList.add('widget');
        div.classList.add('absentWidget');
        div.innerHTML = html.absent;
        widgets.push(div);
        setupFuncs.push(absentWidget.init);
      })();
    }
  }
  function initLinksAndMessagesWidget() {
    (function loadSysMessagesAndCustomLinksWidget() {
      var div = document.createElement('div');
      var div2 = document.createElement('div');
      div.id = 'dashsystemmessagewidget';
      div2.id = 'dashcustomlinks';
      div.classList.add('widget');
      div.classList.add('systemMessagesWidget');
      div2.classList.add('widget');
      div2.classList.add('customLinksWidget');
      div.innerHTML = html.systemMessages;
      div2.innerHTML = html.customLinks;
      widgets.push(div);
      widgets.push(div2);
      setupFuncs.push(linksAndMessages.init);
    })();
  }
  function initSingleEntryWidget() {
    if (
      $.session.applicationName !== 'Gatekeeper' &&
      $.session.SingleEntryView &&
      $.session.singleEntryPermission === 'Anywhere_SingleEntry'
    ) {
      // Single Entry
      (function loadAdminSingleEntryWidget() {
        var div = document.createElement('div');
        div.id = 'dashsingleentrywidget';
        div.classList.add('widget');
        div.classList.add('singleEntryWidget');
        div.innerHTML = html.singleEntry;
        widgets.push(div);
        setupFuncs.push(singleEntryCountWidget.init);
      })();
    }
  }
  function initAdminSingleEntryWidget() {
    if (
      $.session.applicationName !== 'Gatekeeper' &&
      $.session.ViewAdminSingleEntry &&
      $.session.SEViewAdminWidget
    ) {
      //TODO needs added to if  $.session.singleEntryPermission == "Anywhere_SingleEntry"
      (function loadSingleEntryWidget() {
        var div = document.createElement('div');
        div.id = 'admindashsingleentrywidget';
        div.classList.add('widget');
        div.classList.add('adminSingleEntryWidget');
        div.innerHTML = html.adminSingleEntry;
        widgets.push(div);
        setupFuncs.push(adminSingleEntryWidget.init);
      })();
    }
  }
  function initTimeClockWidget() {
    if (
      $.session.isPSI == false &&
      $.session.DayServiceUpdate &&
      $.session.dayServicesPermission === 'Anywhere_DayServices'
    ) {
      (function loadEmployeeDayServicesWidget() {
        var div = document.createElement('div');
        div.id = 'dashtimeclockwidget';
        div.classList.add('widget');
        div.classList.add('timeClockWidget');
        div.innerHTML = html.timeClock;
        widgets.push(div);
        setupFuncs.push(timeClock.init);
      })();
    }
  }
  function initHoursWorkedWidget() {
    if (
      $.session.SEViewAdminWidget === true ||
      ($.session.DayServiceUpdate &&
        $.session.dayServicesPermission === 'Anywhere_DayServices')
    ) {
      (function loadHoursWorkedWidget() {
        var div = document.createElement('div');
        div.id = 'dashhoursworkedwidget';
        div.classList.add('widget');
        div.classList.add('hoursWorkedWidget');
        div.innerHTML = html.hoursWorked;
        widgets.push(div);
        setupFuncs.push(hoursWorkedWidget.init);
      })();
    }
  }
  function initScheduleWidget() {
    if (
      $.session.applicationName !== 'Gatekeeper' &&
      $.session.schedulingPermission === 'Scheduling'
    ) {
      (function loadScheduleWidget() {
        var div = document.createElement('div');
        div.id = 'dashschedulewidget';
        div.classList.add('widget');
        div.classList.add('scheduleWidget');
        div.innerHTML = html.schedule;
        widgets.push(div);
        setupFuncs.push(schedule.init);
      })();
    }
  }
  function initDailyServicesWidget() {
    if (
      $.session.GoalsView &&
      $.session.outcomesPermission === 'Anywhere_Outcomes' &&
      !$.session.removeGoalsWidget
    ) {
      (function loadDailyServicesWidget() {
        var div = document.createElement('div');
        div.id = 'dashgoalswidget';
        div.classList.add('widget');
        div.classList.add('goalsWidget');
        div.innerHTML = html.goals;
        widgets.push(div);

        function widgetSetup() {
          //remainingDailyServicesWidgetAjax.populateFilteredList('%', '%', '%');
          remainingDailyServicesWidget.init();
        }

        setupFuncs.push(widgetSetup);
      })();
    }
  }
  function initClockedInWidget() {
    if (
      $.session.DayServiceView &&
      $.session.dayServicesPermission === 'Anywhere_DayServices'
    ) {
      (function loadDayServicesWidget() {
        var div = document.createElement('div');
        div.id = 'dashdsclockedin';
        div.classList.add('widget');
        div.classList.add('clockedInWidget');
        div.innerHTML = html.clockedIn;
        widgets.push(div);
        setupFuncs.push(clockedInWidget.init);
      })();
    }
  }
  function initIncidentTrackingWidget() {
    if (
      ($.session.isASupervisor || $.session.isPSI == true) &&
      $.session.incidentTrackingPermission === 'Anywhere_Incident_Tracking'
    ) {
      (function loadIncidentTrackingWidget() {
        var div = document.createElement('div');
        div.id = 'incidenttrackingwidget';
        div.classList.add('widget');
        div.classList.add('incidentWidget');
        div.innerHTML = html.incidentTracking;
        widgets.push(div);
        setupFuncs.push(incidentTrackingWidget.init);
      })();
    }
  }
  function initConsumerProgressNotesWidget() {
    if ($.session.isPSI == true || $.session.useProgressNotes === 'Y') {
      (function loadConsumerProgressNotesWidget() {
        var div = document.createElement('div');
        div.id = 'consumerprogressnoteswidget';
        div.classList.add('widget');
        div.classList.add('consumerProgressNoteWidget');
        div.innerHTML = html.consumerProgressNotes;
        widgets.push(div);
        setupFuncs.push(consumerProgresNotes.init);
      })();
    }
  }
  function initLocationProgressNotesWidget() {
    if ($.session.isPSI == true || $.session.useProgressNotes === 'Y') {
      (function loadLocationProgressNotesWidget() {
        var div = document.createElement('div');
        div.id = 'locationprogressnoteswidget';
        div.classList.add('widget');
        div.classList.add('locationProgressNoteWidget');
        div.innerHTML = html.unreadLocationNotes;
        widgets.push(div);
        setupFuncs.push(unreadLocationNotes.init);
      })();
    }
  }
  function initCaseNotesProductivityWidget() {
    if (
      ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
      (getWidgetSettings('1').showHide === 'Y' &&
        $.session.caseNotesPermission === 'Anywhere_CaseNotes' &&
        $.session.applicationName === 'Gatekeeper')
    ) {
      (function loadCaseNotesProdictivityWidget() {
        var div = document.createElement('div');
        div.id = 'casenotesprodictivitywidget';
        div.classList.add('widget');
        div.classList.add('caseNotesProductivityWidget');
        div.innerHTML = html.caseNotesProductivity;
        widgets.push(div);
        setupFuncs.push(CN_ProductivityWidget.init);
      })();
    }
  }
  function initCaseNotesCaseLoadWidget() {
    if (
      ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
      (getWidgetSettings('2').showHide === 'Y' &&
        $.session.caseNotesPermission === 'Anywhere_CaseNotes' &&
        $.session.applicationName === 'Gatekeeper')
    ) {
      (function loadCaseNotesCaseLoadWidget() {
        var div = document.createElement('div');
        div.id = 'casenotescaseload';
        div.classList.add('widget');
        div.classList.add('caseNotesCaseLoadWidget');
        div.innerHTML = html.caseNotesCaseLoad;
        widgets.push(div);
        setupFuncs.push(CN_CaseLoadWidget.init);
      })();
    }
  }

  function initCaseNotesRejectedWidget() {
    if (
      ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
      (getWidgetSettings('3').showHide === 'Y' &&
        $.session.caseNotesPermission === 'Anywhere_CaseNotes' &&
        $.session.applicationName === 'Gatekeeper')
    ) {
      (function loadCaseNotesCaseLoadWidget() {
        var div = document.createElement('div');
        div.id = 'casenotesrejected';
        div.classList.add('widget');
        div.classList.add('caseNotesRejectedWidget');
        div.innerHTML = html.caseNotesRejected;
        widgets.push(div);
        setupFuncs.push(CN_RejectedWidget.init);
      })();
    }
  }

  function initPlanWorkflowWidget() {
    if (
      ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
      (getWidgetSettings('4').showHide === 'Y' &&
        $.session.anywherePlanPermission == 'Anywhere_Plan' &&
        $.session.applicationName === 'Gatekeeper')
    ) {
      (function loadPlanWorkflowWidget() {
        var div = document.createElement('div');
        div.id = 'planworkflow';
        div.classList.add('widget');
        div.classList.add('planWorkflowWidget');
        div.innerHTML = html.planWorkflow;
        widgets.push(div);
        setupFuncs.push(planWorkflowWidget.init);
      })();
    }
  }

  function initInfalWidget() {
    if (
      $.session.infalOnly &&
      $.session.applicationName == 'Gatekeeper' &&
      $.session.infalHasConnectionString == true
    ) {
      (function anonymousFunction() {
        var div = document.createElement('div');
        div.id = 'dashinfaltimeclockwidget';
        div.classList.add('widget');
        div.classList.add('infalWidget');
        div.innerHTML = html.infal;
        widgets.push(div);

        setupFuncs.push(infalTimeClockWidget.init);
      })();
    }
  }

  function loadDashboardWidgets() {
    var actioncenter = document.getElementById('actioncenter');
    actioncenter.innerHTML = '';

    // Check for invalid defaults while widgets load in background
    defaults.getInvalidDefaultLocations();


    // The order of the function calls below determines the order of widgets
    initLinksAndMessagesWidget(); // System Messages & Custom Links
    initAbsentWidget(); // Absent Consumers
    initCaseNotesProductivityWidget(); // Case Notes Producitivity (GK Only) --- WidgetId 1
    initCaseNotesCaseLoadWidget(); // Case Notes Case Load (GK Only) --- WidgetId 2
    initCaseNotesRejectedWidget(); // Case Notes Rejected (GK Only) --- WidgetId 2
    initPlanWorkflowWidget(); // Plan Workflow To Do List Widget
    initLocationProgressNotesWidget(); //Location Progress Notes Widget
    initSingleEntryWidget(); // Unapproved Time Entries - Single Entry
    initConsumerProgressNotesWidget(); //Consumer Progress Note Widget
    initAdminSingleEntryWidget(); // Supervisor Time Entry Review - Admin Single Entry
    initTimeClockWidget(); // Employee Day Service Time Clock
    initHoursWorkedWidget(); // Hours Worked
    initScheduleWidget(); // My Schedule
    initDailyServicesWidget(); // Remaining Daily Services
    initClockedInWidget(); // Day Services Clocked In
    initIncidentTrackingWidget(); // Incident Tracking
    initInfalWidget(); // InfalTimeClock Widget
    var actioncenter = document.getElementById('actioncenter');
    widgets.forEach(widget => {
      actioncenter.appendChild(widget);
    });

    setupFuncs.forEach(func => func());
  }

  function getWidgetSettings(widgetId) {
    const settingForWidget = widgetSettings.filter(
      widget => widget.widgetId === widgetId,
    )[0];
    if (settingForWidget) {
      return {
        widgetId: settingForWidget.widgetId,
        showHide: settingForWidget.showHide,
        widgetConfig:
          settingForWidget.widgetConfig === ''
            ? null
            : JSON.parse(settingForWidget.widgetConfig),
        widgetName: settingForWidget.widgetName,
      };
    } else {
      return {
        widgetId: widgetId,
        showHide: 'Y',
        widgetConfig: null,
        widgetName: null,
      };
    }
  }

  async function refreshWidgetSettings() {
    widgetSettings = (await widgetSettingsAjax.getWidgetSettings())
      .getUserWidgetSettingsResult;
  }

  async function preLoadWidget() {
    widgetSettings = (await widgetSettingsAjax.getWidgetSettings())
      .getUserWidgetSettingsResult;

    function getSetting(widgetId) {
      return widgetSettings.filter(widget => {
        if (widget.widgetId === widgetId) return widget;
      })[0];
    }

    loadDashboardWidgets();

    return {
      getSetting: getSetting,
    };
  }

  function init() {
    remainingDailyServicesWidget.filter.outcomeType = '%';
    remainingDailyServicesWidget.filter.location = '%';
    remainingDailyServicesWidget.filter.group = '%';
    widgets = [];
    setupFuncs = [];
    preLoadWidget();
  }

  return {
    appendFilterButton,
    buildFilterPopup,
    getWidgetSettings,
    refreshWidgetSettings,
    load: init,
  };
})();
