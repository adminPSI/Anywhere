var reports = (function(){
  var reportCurrentlyProcessing = false;
  var startDate;
  var endDate;
  var filterValues;
  var isTimeApproval = false;
  // DOM elements
  var actioncenter;
  var reportPopup;

  function handledProcessedReport() {
    reportCurrentlyProcessing = false;
  }

  function showTimeEntryReport() {
    if (!startDate || !endDate) return

    reportCurrentlyProcessing = true;
    var userId = $.session.UserId;

    if (!isTimeApproval) {
      reportsAjax.getEmpSingleEntryDetailReportAjax(userId, startDate, endDate);
    } else {
      reportsAjax.getEmpSingleEntrySupervisorDetailReportAjax(userId, filterValues);
    }
  }


  function showOverlapReport() {
    if (!startDate || !endDate) return

    reportCurrentlyProcessing = true;
    var userId = $.session.UserId;

    reportsAjax.getOverlapSingleEntryDetailReportAjax(userId, startDate, endDate);
  }

  function showReportsPopup() {
    // popup
    var popup = document.createElement('div');
    popup.classList.add('popup', 'visible', 'popup--filter', 'timeEntryReportsPopup');
    popup.setAttribute('data-popup', 'true');
    // header
    var header = document.createElement('h5');
    header.innerHTML = `Select A Report To View`;
    // reports list
    var reports = `
      <ul>
      </ul>
    `;
    var timeEntryBtn = button.build({
      text: 'Time Entry Report',
      style: 'secondary',
      type: 'contained',
      callback: function() {
        overlay.hide();
        bodyScrollLock.enableBodyScroll(popup);
        actioncenter.removeChild(popup);
        showTimeEntryReport();
      }
    });
    var overlapBtn = button.build({
      text: 'Overlap Report',
      style: 'secondary',
      type: 'contained',
      callback: function() {
        overlay.hide();
        bodyScrollLock.enableBodyScroll(popup);
        actioncenter.removeChild(popup);
        showOverlapReport();
      }
    });

    popup.appendChild(header);
    popup.appendChild(timeEntryBtn);
    popup.appendChild(overlapBtn);

    // append to dom
    bodyScrollLock.disableBodyScroll(popup);
    overlay.show();
    actioncenter.appendChild(popup);
  }

  //optional paramters used to show it is a supervisor running report with different values needed
  function init(payPeriod, timeApproval, filterData) {
    actioncenter = document.getElementById('actioncenter');
    startDate = payPeriod.start;
    endDate = payPeriod.end;

    isTimeApproval = timeApproval;

    if (filterData && timeApproval) {
      filterValues = filterData;
    }

    showReportsPopup();
    
  }

  return {
    init,
    handledProcessedReport
  }
})();
