var reports = (function(){
  var reportCurrentlyProcessing = false;
  var startDate;
  var endDate;
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

    reportsAjax.getEmpSingleEntryDetailReportAjax(userId, startDate, endDate);
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

  function init(payPeriod) {
    actioncenter = document.getElementById('actioncenter');
    startDate = payPeriod.start;
    endDate = payPeriod.end;

    showReportsPopup();
  }

  return {
    init,
    handledProcessedReport
  }
})();
