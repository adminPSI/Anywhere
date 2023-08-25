const generateReports = (() =>  {
  let reportRunning = false;

  // Helper function to create the main reports button on the module page
  function createMainReportButton(buttonsData) {
    return button.build({
      text: 'Reports',
      icon: 'add',
      style: 'secondary',
      type: 'contained',
      classNames: 'reportBtn',
      callback: function () {
        showReportsPopup(buttonsData);
      },
    });
  }

  function passFilterValuesForReport(reportType, filterValues) {
    generateReportsAjax.generateReport(reportType, filterValues, checkIfReportIsReadyInterval);
  }

  // Helper function to create report buttons
  function createIndividualReportButton(text, filterValues) {
    return button.build({
      text,
      style: 'secondary',
      type: 'contained',
      callback: function () {
        //Hide the popup after it is clicked
        let popup = document.getElementById('generateReportsPopup');
        POPUP.hide(popup);
        overlay.hide();
        bodyScrollLock.enableBodyScroll(popup);

        // set report running to true to stop mulitple reports being ran, run report, then show popup while report runs in background
        reportRunning = true;
        passFilterValuesForReport(text, filterValues);
        showWarningPopup(text, filterValues);
      },
    });
  }

  function showReportsPopup(buttonsData) {
    // Popup
    const popup = POPUP.build({
      id: `generateReportsPopup`,
      hideX: true,
      classNames: ['popup',
        'visible',
        'popup--filter',
        buttonsData.text,
        'generateReportsPopup']
    });

    popup.setAttribute('data-popup', 'true');

    // Header
    const header = document.createElement('h5');
    header.innerHTML = 'Select A Report To View';

    // Create buttons dynamically using the helper function
    // example: [{ text: 'Detail Report', callback: passFilterValuesForDetailReport },{ text: 'Time Analysis Report', callback: passFilterValuesForTimeEntryReport }];
    const buttons = buttonsData.map(({ text, filterValues }) =>
      createIndividualReportButton(text, filterValues),
    );

    // Disable buttons if the report is running
    if (reportRunning) {
      buttons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');
      });
    }

    popup.appendChild(header);
    buttons.forEach(button => {
      popup.appendChild(button);
    });

    // Append to DOM
    bodyScrollLock.disableBodyScroll(popup);
    overlay.show();
    actioncenter.appendChild(popup);
  }

  // Function to generate the warning popup
  function showWarningPopup(reportType) {
    const reportWarningPopup = POPUP.build({
      id: `reportWarningPopup${reportType}`,
      hideX: true,
      classNames: 'warning',
    });

    const warningMessage = document.createElement('p');
    warningMessage.innerHTML = `Your ${reportType} report is being generated and will be downloaded when finished, in the meantime you may continue with your work.`;

    const acceptBtn = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(reportWarningPopup);
        overlay.hide();

        let popup = document.querySelector('.generateReportsPopup');

        bodyScrollLock.enableBodyScroll(popup);
      },
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(acceptBtn);

    reportWarningPopup.appendChild(warningMessage);
    reportWarningPopup.appendChild(btnWrap);
    POPUP.show(reportWarningPopup);
  }

  // Function to check if a report is ready at a specified interval
  function checkIfReportIsReadyInterval(res) {
    // Get the interval in seconds from the session and convert it to milliseconds
    seconds = parseInt($.session.reportSeconds);
    intSeconds = seconds * 1000;

    // Set up an interval to execute the checkCNReportExists function periodically
    interval = setInterval(async () => {
      await checkIfReportExists(res); // Call the function to check if the report exists
    }, intSeconds); // The interval in milliseconds between checks
  }

  // Async function to check if a report exists
  async function checkIfReportExists(res) {
    // Call function to check if the report exists
    // Once the promise is resolved, the callReport function will handle the result.
    await generateReportsAjax.checkIfReportExists(res, callReport);
  }

  function callReport(res, reportScheduleId) {
    if (res.indexOf('1') === -1) {
      //do nothing
    } else {
      generateReportsAjax.viewReport(reportScheduleId);
      clearInterval(interval);
      reportRunning = false;
    }
  }

  return {
    createMainReportButton,
    passFilterValuesForReport,
    showReportsPopup,
    createIndividualReportButton,
    checkIfReportIsReadyInterval,
    checkIfReportExists,
    callReport,
  };
})();
