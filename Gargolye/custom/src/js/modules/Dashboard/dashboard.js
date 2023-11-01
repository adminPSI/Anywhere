var dashboard = (function () {
    var widgets;
    var setupFuncs;
    var widgetSettings;

    var widgetIds = {
        caseNotesProductivity: 1,
        caseNotesCaseLoad: 2,
        caseNotesRejected: 3,
        planWorkflow: 4,
        customLinks: 5,
        absent: 6,
        unreadLocationNotes: 7,
        consumerProgressNotes: 8,
        timeClock: 9,
        hoursWorked: 10,
        goals: 11,
        clockedIn: 12,
        singleEntry: 13,
        adminSingleEntry: 14,
        schedule: 15,
        incidentTracking: 16,
        missingSignatures: 17,
        moneyManagement: 18,
        infal: null,
        systemMessages: null,
    };

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
        missingSignatures: `
    <div class="widget__header">
      <h3>Plans Missing Signatures</h3>
    </div>
    <div class="widget__body">
    <div class="missingSignatures"></div>
    </div>
    `,
        moneyManagement: `
    <div class="widget__header">
      <h3>Money Management</h3>
    </div>
    <div class="widget__body"></div>
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
        filterPopup.classList.add('widget__filters', 'popup', 'popup--static', 'popup--filter');
        filterPopup.setAttribute('data-popup', 'true');

        return filterPopup;
    }

    // Widget Init Functions
    function initAbsentWidget() {
        const showHide = getWidgetSettings(widgetIds.absent).showHide;
        if (!infalOnly) {
            (function loadAbsentWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.absent);
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
        const showHideCustomLinks = getWidgetSettings(widgetIds.customLinks).showHide;
        const showHideMessages = getWidgetSettings(widgetIds.systemMessages).showHide;

        (function loadSysMessagesAndCustomLinksWidget() {
            var div = document.createElement('div');
            var div2 = document.createElement('div');
            div.setAttribute('data-show', showHideMessages);
            div.setAttribute('data-widgetId', widgetIds.systemMessages);
            div2.setAttribute('data-show', showHideCustomLinks);
            div2.setAttribute('data-widgetId', widgetIds.customLinks);
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
        const showHide = getWidgetSettings(widgetIds.singleEntry).showHide;
        if (
            $.session.applicationName !== 'Gatekeeper' &&
            $.session.SingleEntryView &&
            $.session.singleEntryPermission === 'Anywhere_SingleEntry'
        ) {
            // Single Entry
            (function loadAdminSingleEntryWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.singleEntry);
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
        const showHide = getWidgetSettings(widgetIds.adminSingleEntry).showHide;
        if (
            $.session.applicationName !== 'Gatekeeper' &&
            $.session.ViewAdminSingleEntry &&
            $.session.SEViewAdminWidget
        ) {
            //TODO needs added to if  $.session.singleEntryPermission == "Anywhere_SingleEntry"
            (function loadSingleEntryWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.adminSingleEntry);
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
        const showHide = getWidgetSettings(widgetIds.timeClock).showHide;
        if (
            $.session.isPSI == false &&
            $.session.DayServiceUpdate &&
            $.session.dayServicesPermission === 'Anywhere_DayServices'
        ) {
            (function loadEmployeeDayServicesWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.timeClock);
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
        const showHide = getWidgetSettings(widgetIds.hoursWorked).showHide;
        if (
            $.session.SEViewAdminWidget === true ||
            ($.session.DayServiceUpdate && $.session.dayServicesPermission === 'Anywhere_DayServices')
        ) {
            (function loadHoursWorkedWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.hoursWorked);
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
        const showHide = getWidgetSettings(widgetIds.schedule).showHide;
        if (
            $.session.applicationName !== 'Gatekeeper' &&
            $.session.schedulingPermission === 'Scheduling'
        ) {
            (function loadScheduleWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.schedule);
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
        const showHide = getWidgetSettings(widgetIds.goals).showHide;
        if (
            $.session.GoalsView &&
            $.session.outcomesPermission === 'Anywhere_Outcomes' &&
            !$.session.removeGoalsWidget
        ) {
            (function loadDailyServicesWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.goals);
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
        const showHide = getWidgetSettings(widgetIds.clockedIn).showHide;
        if ($.session.DayServiceView && $.session.dayServicesPermission === 'Anywhere_DayServices') {
            (function loadDayServicesWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.clockedIn);
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
        const showHide = getWidgetSettings(widgetIds.incidentTracking).showHide;
        if (
            ($.session.isASupervisor || $.session.isPSI == true) &&
            $.session.incidentTrackingPermission === 'Anywhere_Incident_Tracking'
        ) {
            (function loadIncidentTrackingWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.incidentTracking);
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
        const showHide = getWidgetSettings(widgetIds.consumerProgressNotes).showHide;
        if ($.session.isPSI == true || $.session.useProgressNotes === 'Y') {
            (function loadConsumerProgressNotesWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.consumerProgressNotes);
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
        const showHide = getWidgetSettings(widgetIds.unreadLocationNotes).showHide;
        if ($.session.isPSI == true || $.session.useProgressNotes === 'Y') {
            (function loadLocationProgressNotesWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.unreadLocationNotes);
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
        const isPSI =
            $.session.isPSI == true && $.session.applicationName === 'Gatekeeper' ? true : false;
        const hasPerm =
            $.session.caseNotesPermission === 'Anywhere_CaseNotes' &&
                $.session.applicationName === 'Gatekeeper'
                ? true
                : false;
        const showHide = getWidgetSettings(widgetIds.caseNotesProductivity).showHide;

        if (isPSI || hasPerm) {
            (function loadCaseNotesProdictivityWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.caseNotesProductivity);
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
        const showHide = getWidgetSettings(widgetIds.caseNotesCaseLoad).showHide;
        if (
            ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
            ($.session.caseNotesPermission === 'Anywhere_CaseNotes' &&
                $.session.applicationName === 'Gatekeeper')
        ) {
            (function loadCaseNotesCaseLoadWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.caseNotesCaseLoad);
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
        const showHide = getWidgetSettings(widgetIds.caseNotesRejected).showHide;
        if (
            ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
            ($.session.caseNotesPermission === 'Anywhere_CaseNotes' &&
                $.session.applicationName === 'Gatekeeper')
        ) {
            (function loadCaseNotesCaseLoadWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.caseNotesRejected);
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
        const showHide = getWidgetSettings(widgetIds.planWorkflow).showHide;
        if (
            ($.session.isPSI == true && $.session.applicationName === 'Gatekeeper') ||
            ($.session.anywherePlanPermission == 'Anywhere_Plan' &&
                $.session.applicationName === 'Gatekeeper')
        ) {
            (function loadPlanWorkflowWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.planWorkflow);
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
        const showHide = getWidgetSettings(widgetIds.infal).showHide;
        if (
            $.session.infalOnly &&
            $.session.applicationName == 'Gatekeeper' &&
            $.session.infalHasConnectionString == true
        ) {
            (function anonymousFunction() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.infal);
                div.id = 'dashinfaltimeclockwidget';
                div.classList.add('widget');
                div.classList.add('infalWidget');
                div.innerHTML = html.infal;
                widgets.push(div);

                setupFuncs.push(infalTimeClockWidget.init);
            })();
        }
    }
    function initSignaturesWidget() {
        const showHide = getWidgetSettings(widgetIds.missingSignatures).showHide;
        if (!$.session.planView) return;
        if (!infalOnly) {
            (function loadSignatureWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.missingSignatures);
                div.id = 'dashmissingsignatures';
                div.classList.add('widget');
                div.classList.add('missingSignaturesWidget');
                div.innerHTML = html.missingSignatures;
                widgets.push(div);
                setupFuncs.push(signatureWidget.init);
            })();
        }
    }

    function initMoneyManagementWidget() {
        const showHide = getWidgetSettings(widgetIds.moneyManagement).showHide;
        if (
            $.session.anywhereConsumerFinancesPermission === 'Anywhere_Consumer_Finances' 
        ) {
            (function loadMoneyManagementWidget() {
                var div = document.createElement('div');
                div.setAttribute('data-show', showHide);
                div.setAttribute('data-widgetId', widgetIds.moneyManagement);
                div.id = 'dashMoneyManagementwidget';
                div.classList.add('widget');
                div.classList.add('absentWidget');
                div.innerHTML = html.moneyManagement;
                widgets.push(div);
                setupFuncs.push(consumerFinancesWidget.init);
            })();
        }
    }

    function loadDashboardWidgets() {
        var actioncenter = document.getElementById('actioncenter');
        actioncenter.innerHTML = '';

        // Check for invalid defaults while widgets load in background
        defaults.getInvalidDefaultLocations();

    // The order of the function calls below determines the order of widgets
    /*1*/ initLinksAndMessagesWidget(); // System Messages & Custom Links
    /*2*/ initAbsentWidget(); // Absent Consumers
    /*3*/ initCaseNotesProductivityWidget(); // Case Notes Producitivity (GK Only) --- WidgetId 1
    /*4*/ initCaseNotesCaseLoadWidget(); // Case Notes Case Load (GK Only) --- WidgetId 2
    /*5*/ initCaseNotesRejectedWidget(); // Case Notes Rejected (GK Only) --- WidgetId 2
    /*6*/ initPlanWorkflowWidget(); // Plan Workflow To Do List Widget
    /*7*/ initLocationProgressNotesWidget(); //Location Progress Notes Widget
    /*8*/ initSingleEntryWidget(); // Unapproved Time Entries - Single Entry
    /*9*/ initConsumerProgressNotesWidget(); //Consumer Progress Note Widget
    /*10*/ initAdminSingleEntryWidget(); // Supervisor Time Entry Review - Admin Single Entry
    /*11*/ initTimeClockWidget(); // Employee Day Service Time Clock
    /*12*/ initHoursWorkedWidget(); // Hours Worked
    /*13*/ initScheduleWidget(); // My Schedule
    /*14*/ initDailyServicesWidget(); // Remaining Daily Services
    /*15*/ initClockedInWidget(); // Day Services Clocked In
    /*16*/ initIncidentTrackingWidget(); // Incident Tracking
    /*17*/ initInfalWidget(); // InfalTimeClock Widget
        /*18*/ //initSignaturesWidget(); // Missing Signatures Widget
    /*18*/ initMoneyManagementWidget(); // Money Management Widget 

        var actioncenter = document.getElementById('actioncenter');
        widgets.forEach(widget => {
            actioncenter.appendChild(widget);
        });

        setupFuncs.forEach(func => func());
    }

    function getWidgetSettings(widgetId) {
        if (!widgetId) {
            // if no widget id means no settings so go ahead and set showHide to Y
            return {
                showHide: 'Y',
            };
        }

        const settingForWidget = widgetSettings.filter(
            widget => parseInt(widget.widgetId) === parseInt(widgetId),
        )[0];
        if (settingForWidget) {
            return {
                widgetId: settingForWidget.widgetId,
                showHide: settingForWidget.showHide,
                widgetConfig:
                    settingForWidget.widgetConfig === '' ? null : JSON.parse(settingForWidget.widgetConfig),
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
        widgetSettings = (await widgetSettingsAjax.getWidgetSettings()).getUserWidgetSettingsResult;
    }

    async function preLoadWidget() {
        widgetSettings = (await widgetSettingsAjax.getWidgetSettings()).getUserWidgetSettingsResult;

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
