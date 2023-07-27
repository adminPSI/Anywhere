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
          }
      })
    }

    function passFilterValuesForReport(reportType, filterValues) {
        generateReportsAjax.generateReport(reportType, filterValues, checkIfReportIsReadyInterval);
      }
  
    // Helper function to create report buttons
    function createIndividualReportButton(text, callback) {
      return button.build({
        text,
        style: 'secondary',
        type: 'contained',
        callback: function () {
          showWarningPopup(text, callback);
        },
      });
    }
  
    function showReportsPopup(buttonsData) {
      // Popup
      const popup = document.createElement('div');
      popup.classList.add('popup', 'visible', 'popup--filter', buttonsData.text, 'generateReportsPopup');
      popup.setAttribute('data-popup', 'true');
    
      // Header
      const header = document.createElement('h5');
      header.innerHTML = 'Select A Report To View';
    
      // Reports list
      const reports = '<ul></ul>';
    
      // Create buttons dynamically using the helper function
      // example: [{ text: 'Detail Report', callback: passFilterValuesForDetailReport },{ text: 'Time Analysis Report', callback: passFilterValuesForTimeEntryReport }];
      const buttons = buttonsData.map(({ text, callback }) => createIndividualReportButton(text, callback));
    
      // Disable buttons if the report is running
      if (reportRunning) {
        buttons.forEach(button => {
          button.disabled = true;
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
    function showWarningPopup(reportType, callback) {
      if (reportRunning) return;
  
      reportRunning = true;
      const reportWarningPopup = POPUP.build({
        id: `reportWarningPopup${reportType}`,
        hideX: false,
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
          actioncenter.removeChild(popup);
          passFilterValuesForReport(reportType, filterValues);
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
        await checkCNReportExists(res); // Call the function to check if the report exists
      }, intSeconds); // The interval in milliseconds between checks
    }
  
    // Async function to check if a report exists
    async function checkIfReportExists(res) {
      // Call function to check if the report exists
      // Once the promise is resolved, the callReport function will handle the result.
      await reportsAjax.checkIfReportExists(res, callReport);
    }
  
    function callReport(res, reportScheduleId) {
      if (res.indexOf('1') === -1) {
        //do nothing
      } else {
        caseNotesAjax.viewCaseNoteReport(reportScheduleId);
        clearInterval(interval);
        reportRunning = false;
      }
    }
  
    //* AJAX CALLS
    function checkIfReportExists(res, callback) {
      data = {
        token: $.session.Token,
        reportScheduleId: res[0].reportScheduleId,
      };
      $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/checkIfCNReportExists/',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response, status, xhr) {
          var res = response.checkIfCNReportExistsResult;
          callback(res, data.reportScheduleId);
        },
        error: function (xhr, status, error) {
          //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
      });
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
  