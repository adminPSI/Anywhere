(function (global, factory) {
  global.CaseNotesReports = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Constructor function for Case Notes Reports.
   *
   * @constructor
   * @returns {CaseNotesReports}
   */
  function CaseNotesReports() {
    // Instance Ref
    this.dialog = null;

    // DOM Ref

    this._build();
  }

  /**
   * @function
   */
  CaseNotesReports.prototype._build = function () {
    this.dialog = new Dialog({ className: 'addPhrases' });

    //TODO-ASH: build form to allow user to select criteria for report
    this.detailReportForm = new Form({
      elements: [
        {
          type: 'time',
          label: 'Start Time',
          id: 'startTime',
          required: true,
        },
      ],
    });
    this.timeAnalysisReportForm = new Form({
      elements: [
        {
          type: 'time',
          label: 'Start Time',
          id: 'startTime',
          required: true,
        },
      ],
    });

    this._setupEvents();
  };

  /**
   * @function
   */
  CaseNotesReports.prototype._setupEvents = function () {
    this.detailReportForm.onSubmit(data => {
      this.generateDetailReport();
    });
    this.timeAnalysisReportForm.onSubmit(data => {
      this.generateTimeAnalysisReport();
    });
  };

  /**
   * @function
   */
  CaseNotesReports.prototype.show = function () {
    this.dialog.show();
  };

  /**
   * @function
   */
  CaseNotesReports.prototype.close = function () {
    this.dialog.close();
  };

  /**
   * @function
   */
  CaseNotesReports.prototype.generateDetailReport = async function () {
    const success = await _UTIL.fetchData('generateCNDetailReport', {
      userId: $.session.UserId,
    });

    const debounceTime = parseInt($.session.reportSeconds) * 1000;
    _UTIL.debounce(
      (async () => {
        const doesReportExist = await _UTIL.fetchData('checkIfCNReportExists', {
          reportScheduleId: success[0].reportScheduleId,
        });

        if (doesReportExist.indexOf('1') !== -1) {
          this.viewReport(success[0].reportScheduleId);
        }
      })(),
      debounceTime,
    );
  };

  /**
   * @function
   */
  CaseNotesReports.prototype.generateTimeAnalysisReport = async function () {
    const success = await _UTIL.fetchData('generateCNTimeAnalysisReport', {
      userId: $.session.UserId,
    });
  };

  /**
   * @function
   */
  CaseNotesReports.prototype.viewReport = async function (reportScheduleId) {
    const action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewCaseNoteReport/`;

    var form = document.createElement('form');
    form.style.position = 'absolute';
    form.style.opacity = '0';
    form.setAttribute('action', action);
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.setAttribute('enctype', 'application/json');
    form.setAttribute('success', () => {
      form.remove();
    });

    var tokenInput = document.createElement('input');
    tokenInput.setAttribute('name', 'token');
    tokenInput.setAttribute('value', $.session.Token);
    tokenInput.id = 'token';

    var attachmentInput = document.createElement('input');
    attachmentInput.setAttribute('name', 'reportScheduleId');
    attachmentInput.setAttribute('value', reportScheduleId);
    attachmentInput.id = 'reportScheduleId';

    form.appendChild(tokenInput);
    form.appendChild(attachmentInput);

    document.body.appendChild(form);

    form.submit();
  };

  /**
   * Renders Case Notes Report Popup markup to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render case notes report popup to
   * @returns {CaseNotesReports} Returns the current instances for chaining
   */
  CaseNotesReports.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  return CaseNotesReports;
});
