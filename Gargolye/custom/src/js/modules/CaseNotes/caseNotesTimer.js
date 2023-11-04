(function (global, factory) {
  global.CaseNotesTimer = factory();
})(this, function () {
  /**
   * Constructor function for creating the Case Notes Timer component.
   *
   * @constructor
   * @returns {CaseNotesTimer}
   */
  function CaseNotesTimer() {
    this.startTime = null; // To store the time when the timer starts
    this.intervalId = null; // To store the ID of the interval
    this.timeOffset = 0; // To store additional time in seconds
    this.elapsedTimeInSeconds = 0; // To store the elapsed time in seconds

    this.inactivityIntervalId = null;

    //DOM Ref
    this.parentEle = null;

    this.build();
  }

  /**
   * @function
   */
  CaseNotesTimer.prototype.build = function () {
    this.parentEle = _DOM.createElement('div', { class: 'caseNotesTimer' });

    //this.
  };

  /**
   * Starts the Doc Timer.
   * Should not be used to start timer after its been stopped, use restart() instead
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
      const elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000) + this.timeOffset;
      console.log(`Elapsed Time: ${elapsedTimeInSeconds} seconds`);
    }, 1000);

    // Start inactivity tiemr
    // Start the inactivity timer right after
    if (this.inactivityIntervalId) {
      clearInterval(this.inactivityIntervalId);
    }
    const inactivityStartTime = Date.now();
    this.inactivityIntervalId = setInterval(() => {
      const currentTime = Date.now();
      const inactivityTimeInSeconds = Math.floor((currentTime - inactivityStartTime) / 1000);
      console.log(`Inactivity Time: ${inactivityTimeInSeconds} seconds`);
    }, 120000);
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.stop = function () {
    clearInterval(this.intervalId); // Stop the interval
    this.intervalId = null;
    console.log('Timer has stopped.');
    return this.elapsedTimeInSeconds; // Return the elapsed time
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.restart = function () {
    // Clear any existing intervals or timeouts
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
    }

    // Start the main timer again
    this.start(this.elapsedTimeInSeconds);

    console.log('Timer and inactivity timer have been restarted.');
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.reset = function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.startTime = null;
    this.timeOffset = 0;
    this.intervalId = null;
  };

  /**
   * @function
   */
  CaseNotesTimer.prototype.mutationObserver = function () {};

  /**
   * Renders Case Notes Timer makrup to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render case notes timer to
   * @returns {CaseNotesTimer} Returns the current instances for chaining
   */
  CaseNotesTimer.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.parentEle);
    }

    return this;
  };

  return CaseNotesTimer;
});
