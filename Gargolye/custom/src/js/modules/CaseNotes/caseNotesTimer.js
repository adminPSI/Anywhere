(function (global, factory) {
  global.CaseNotesTimer = factory();
})(this, function () {
  //=======================================
  // INACTIVITY
  //---------------------------------------
  /**
   * @constructor
   */
  function InactivityWarningPopup() {
    this.dialog = null;

    this.yesButton = null;
    this.noButton = null;

    this.build();
  }

  /**
   * @function
   */
  InactivityWarningPopup.prototype.build = function () {
    // Inactivity Warning
    this.dialog = new Dialog({ className: 'inactivityWarning' });

    const messageEle = _DOM.createElement('p', {
      text: 'Your documentation timer has been paused. Continue timing?',
    });

    const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
    this.yesButton = new Button({ text: 'yes' });
    this.noButton = new Button({ text: 'no', styleType: 'outlined' });
    this.yesButton.renderTo(btnWrap);
    this.noButton.renderTo(btnWrap);

    this.dialog.dialog.appendChild(messageEle);
    this.dialog.dialog.appendChild(btnWrap);

    return this;
  };

  /**
   * Shows the inactivity warning dialog
   *
   * @function
   */
  InactivityWarningPopup.prototype.show = function () {
    this.dialog.show();
  };

  /**
   * @function
   */
  InactivityWarningPopup.prototype.onClick = function (cbFunc) {
    this.yesButton.onClick(e => {
      cbFunc(true);
      this.dialog.close();
    });
    this.noButton.onClick(e => {
      cbFunc(false);
      this.dialog.close();
    });
  };

  /**
   * Renders the built InactivityWarningPopup element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the Inactivity Warning Popup to
   * @returns {InactivityWarningPopup} Returns the current instances for chaining
   */
  InactivityWarningPopup.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  //=======================================
  // AUTO START
  //---------------------------------------
  /**
   * @constructor
   */
  function TimerAutoStartPopup() {
    this.prevDocumentationTime = 0;
    this.dialog = null;

    this.yesButton = null;
    this.noButton = null;

    this.build();
  }

  /**
   * @function
   */
  TimerAutoStartPopup.prototype.build = function () {
    this.dialog = new Dialog({ className: 'timerAutoStart' });

    const messageEle = _DOM.createElement('p', {
      text: 'Documentation Time is allowed for this bill code. Would you like to start the timer now?',
    });

    const btnWrap = _DOM.createElement('div', { class: 'button-wrap' });
    this.yesButton = new Button({ text: 'yes' });
    this.noButton = new Button({ text: 'no', styleType: 'outlined' });
    this.yesButton.renderTo(btnWrap);
    this.noButton.renderTo(btnWrap);

    this.dialog.dialog.appendChild(messageEle);
    this.dialog.dialog.appendChild(btnWrap);

    return this;
  };

  /**
   * Shows the auto start dialog
   *
   * @function
   */
  TimerAutoStartPopup.prototype.show = function (prevDocumentationTime) {
    this.prevDocumentationTime = prevDocumentationTime;
    this.dialog.show();
  };

  /**
   * @function
   */
  TimerAutoStartPopup.prototype.onClick = function (cbFunc) {
    this.yesButton.onClick(e => {
      cbFunc(true, this.prevDocumentationTime);
      this.dialog.close();
      this.prevDocumentationTime = 0;
    });
    this.noButton.onClick(e => {
      cbFunc(false);
      this.dialog.close();
      this.prevDocumentationTime = 0;
    });
  };

  /**
   * Renders the built TimerAutoStartPopup element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the Timer Auto Start Popup to
   * @returns {TimerAutoStartPopup} Returns the current instances for chaining
   */
  TimerAutoStartPopup.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.dialog.dialog);
    }

    return this;
  };

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Constructor function for creating the Case Notes Timer component.
   *
   * @constructor
   * @returns {CaseNotesTimer}
   */
  function CaseNotesTimer() {
    this.startTime = null; // To store the time when the timer starts
    this.timeOffset = 0; // To store additional time in seconds
    this.elapsedTimeInSeconds = 0; // To store the elapsed time in seconds

    this.intervalId = null; // To store the ID of the timer interval
    this.inactivityIntervalId = null; // to store the ID of the inactivity timeout

    // Instance Ref
    this.inactivityWarningDialog = null;

    // DOM Ref
    this.rootElement = null;
    this.timeDisplay = null;
    this.playButton = null;
    this.stopButton = null;

    this._build();
  }

  /**
   * Builds the Case Notes Timer element component HTML
   *
   * @function
   * @private
   * @returns {CaseNotesTimer} Returns the current instances for chaining
   */
  CaseNotesTimer.prototype._build = function () {
    this.rootElement = _DOM.createElement('div', { class: 'caseNotesTimer' });

    this.playButton = new Button({ icon: 'play', style: 'secondary', styleType: 'outlined' });
    this.stopButton = new Button({ icon: 'stop', style: 'danger', styleType: 'outlined' });
    this.timeDisplay = _DOM.createElement('p', { text: dates.formatSecondsToFullTime(this.elapsedTimeInSeconds) });

    this.rootElement.appendChild(this.timeDisplay);
    this.playButton.renderTo(this.rootElement);
    this.stopButton.renderTo(this.rootElement);

    // Inactivity Warning
    this.inactivityWarningPopup = new InactivityWarningPopup();
    this.inactivityWarningPopup.renderTo(_DOM.ACTIONCENTER);

    // Auto Start
    this.timerAutoStartPopup = new TimerAutoStartPopup();
    this.timerAutoStartPopup.renderTo(_DOM.ACTIONCENTER);

    this._setupEvents();

    return this;
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype._setupEvents = function () {
    this.playButton.onClick(e => {
      this.start(this.elapsedTimeInSeconds);
      this.playButton.toggleDisabled(true);
    });
    this.stopButton.onClick(e => {
      this.stop();
      this.playButton.toggleDisabled(false);

      if (this.inactivityTimeoutId) {
        clearTimeout(this.inactivityTimeoutId);
      }
    });
    this.inactivityWarningPopup.onClick(continueTimer => {
      if (continueTimer) {
        this.start(this.elapsedTimeInSeconds);
      }
    });
    this.timerAutoStartPopup.onClick((autoStart, prevDocTime) => {
      if (autoStart) {
        this.start(prevDocTime);
      }
    });
  };

  /**
   * Starts the Doc Timer.
   * Should not be used to start timer after its been stopped
   *
   * @function
   * @param {Number} options
   */
  CaseNotesTimer.prototype.start = function (additionalTimeInSeconds = 0) {
    this.startTime = Date.now(); // Capture the start time
    this.timeOffset = additionalTimeInSeconds; // Store the additional time

    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Start a new interval
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      this.elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000) + this.timeOffset;
      this.timeDisplay.innerText = dates.formatSecondsToFullTime(this.elapsedTimeInSeconds);
      //console.log(`Elapsed Time: ${this.elapsedTimeInSeconds} seconds`);
    }, 1000);

    // clear existing inactivity interval
    if (this.inactivityIntervalId) {
      clearTimeout(this.inactivityIntervalId);
    }
    // Start inactivity timer
    this.inactivityIntervalId = setTimeout(() => {
      this.stop();
      this.inactivityWarningPopup.show();
    }, 120000);
  };

  /**
   * Stops the Doc Timer. (aka pause)
   *
   * @function
   * @returns {CaseNotesTimer} Returns the current instances for chaining
   */
  CaseNotesTimer.prototype.stop = function () {
    clearInterval(this.intervalId);
    clearTimeout(this.inactivityTimeoutId);
    this.intervalId = null;
    this.inactivityTimeoutId = null;

    return this;
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.clear = function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
    }

    this.startTime = null;
    this.timeOffset = 0;
    this.intervalId = null;
    this.inactivityTimeoutId = null;
    this.elapsedTimeInSeconds = 0;
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.getTime = function () {
    return this.elapsedTimeInSeconds;
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.showAutoStartPopup = function (prevDocumentationTime) {
    if (this.intervalId) return;

    this.timerAutoStartPopup.show(prevDocumentationTime);
  };

  /**
   * Renders Case Notes Timer makrup to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render case notes timer to
   * @returns {CaseNotesTimer} Returns the current instances for chaining
   */
  CaseNotesTimer.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return CaseNotesTimer;
});
