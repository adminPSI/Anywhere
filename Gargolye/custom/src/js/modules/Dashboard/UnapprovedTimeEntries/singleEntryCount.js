var singleEntryCountWidget = (function() {
  var widget;
  var entriesObj;
  var statuses = {
    "A": 'Needs Approval',
    "P": 'Pending',
    "R": 'Rejected'
  };

  function getEntryInfo(dateRange, code) {
    var userId = $.session.UserId;
    var startDate = dateRange[0].split('/');
    var endDate = dateRange[1].split('/');
    startDate = `${startDate[2]}-${UTIL.leadingZero(startDate[0])}-${UTIL.leadingZero(startDate[1])}`;
    endDate = `${endDate[2]}-${UTIL.leadingZero(endDate[0])}-${UTIL.leadingZero(endDate[1])}`;

    timeEntryReview.loadReviewPage(startDate, endDate);
    //getSingleEntryByDate(userId, startDate, endDate, '%', code, buildSingleEntryTable);
  }

  function populateSingleEntryCountInfo(data) {
    var pendingSection = widget.querySelector('.pending-section');
    var rejectedSection = widget.querySelector('.rejected-section');
    var approvalSection = widget.querySelector('.needsapproval-section');
    pendingSection.innerHTML = '';
    rejectedSection.innerHTML = '';
    approvalSection.innerHTML = '';

    var entryGroups = Object.keys(data);
    entryGroups.forEach(group => {
      var dateRanges = Object.keys(data[group]);
      dateRanges.sort((a,b) => {
        var dateA = a.split('{*}')[0];
        var dateB = b.split('{*}')[0];
        dateA = new Date(dateA);
        dateB = new Date(dateB);

        if (dateA > dateB) {
          return -1;
        } else if (dateA < dateB) {
          return 1;
        } else {
          return 0;
        }
      });
      dateRanges.forEach(range => {
        var text = range.split('{*}').join(' - ');
        var count = data[group][range].count;
        var p = document.createElement('p');
        p.innerHTML = `${text} - <span>${count}</span>`;
        p.setAttribute("start-date", range.split('{*}')[0])
        p.setAttribute("end-date", range.split('{*}')[1])
        p.classList.add('customLink')
        if (group === 'P') {
          pendingSection.appendChild(p);
          p.addEventListener("click", event => {
            let startDate = event.target.getAttribute("start-date")
            let endDate = event.target.getAttribute("end-date")
            let status = "P"
            setActiveModuleSectionAttribute('timeEntry-review');
            actioncenter.dataset.activeModule = "timeEntry"
            UTIL.toggleMenuItemHighlight("timeEntry")
            DOM.clearActionCenter();
            DOM.scrollToTopOfPage();
            timeEntry.getInitialData(() => {
              timeEntryReview.dashHandler(startDate, endDate, status)
            })
          })
        } else if (group === 'R') {
          rejectedSection.appendChild(p);
          p.addEventListener("click", event => {
              let startDate = event.target.getAttribute("start-date")
              let endDate = event.target.getAttribute("end-date")
              let status = "R"
              setActiveModuleSectionAttribute('timeEntry-review');
              actioncenter.dataset.activeModule = "timeEntry"
              UTIL.toggleMenuItemHighlight("timeEntry")
              DOM.clearActionCenter();
              DOM.scrollToTopOfPage();
              timeEntry.getInitialData(() => {
                timeEntryReview.dashHandler(startDate, endDate, status)
              })
          })
        } else if (group === 'A') {
          approvalSection.appendChild(p);
          p.addEventListener("click", event => {
              let startDate = event.target.getAttribute("start-date")
              let endDate = event.target.getAttribute("end-date")
              let status = "A"
              setActiveModuleSectionAttribute('timeEntry-review');
              actioncenter.dataset.activeModule = "timeEntry"
              UTIL.toggleMenuItemHighlight("timeEntry")
              DOM.clearActionCenter();
              DOM.scrollToTopOfPage();
              timeEntry.getInitialData(() => {
                timeEntryReview.dashHandler(startDate, endDate, status)
              })
          })
        }
      });
    });
  }
  

  function buildWidgetTabs() {
    var widgetTabs = widgetBody.querySelector('.tabs');
    if (!widgetTabs) {
      var tabOptions = {
        sections: ['Pending', 'Rejected', 'Needs Approval']
      };
  
      widgetTabs = tabs.build(tabOptions);
  
      widgetBody.appendChild(widgetTabs);
    }
  }

  function groupSingleEntryCountInfo(results) {
    entriesObj = {};
    results.forEach(r => {
      if (statuses[r.Anywhere_Status]) {
        var startDate = r.startdate.split(' ')[0];
        var endDate = r.enddate.split(' ')[0];
        var dateString = `${startDate}{*}${endDate}`;

        if (!entriesObj[r.Anywhere_Status]) {
          entriesObj[r.Anywhere_Status] = {};
        }
        if (!entriesObj[r.Anywhere_Status][dateString]) {
          entriesObj[r.Anywhere_Status][dateString] = {count: 0};
        }
        entriesObj[r.Anywhere_Status][dateString].count++;
      }
    });
  }

  function init() {
    widget = document.getElementById('dashsingleentrywidget');
    widgetBody = widget.querySelector('.widget__body');
    widgetBody.innerHTML = '';

    singleEntryCountWidgetAjax.getSingleEntryCountInfo(function(err, res) {
      if (err) {
        $('#dashsingleentrywidget .dashboarderror').show();
        return;
      }
      groupSingleEntryCountInfo(res);
      buildWidgetTabs();
      populateSingleEntryCountInfo(entriesObj);
    });
  }

  return {
    init
  }
}());