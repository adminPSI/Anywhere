(function (global, factory) {
  global.Tutorial = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {};

  /**
   * Merge default options with user options
   *
   * @function
   * @param {Object}  userOptions - User defined options object
   * @return {Object} - Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  //=========================
  // TUTORIAL SATE
  //-------------------------
  /**
   * Represents the state management system for the tutorial.
   * Initializes with default state values if no initial state is provided.
   * @constructor
   * @param {Object} [initialState] - The initial state of the tutorial.
   * @param {number} [initialState.currentStep=1] - The current step of the tutorial.
   * @param {number} [initialState.totalSteps=5] - The total number of steps in the tutorial.
   */
  function TutorialState(initialState = { currentStep: 1, totalSteps: 5 }) {
    this.currentStep = initialState.currentStep;
    this.totalSteps = initialState.totalSteps;
    this.observers = [];
  }

  /**
   * Subscribe a new observer function.
   *
   * @param {Function} observerFunction - The function to notify when the state changes.
   */
  TutorialState.prototype.subscribe = function (observerFunction) {
    this.observers.push(observerFunction);
  };

  /**
   * Unsubscribe an existing observer function.
   *
   * @param {Function} observerFunction - The function to remove from the observer list.
   */
  TutorialState.prototype.unsubscribe = function (observerFunction) {
    const index = this.observers.indexOf(observerFunction);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  };

  /**
   * Update the tutorial state and notify all observers.
   * @param {Object} newState - The new state to merge with the current state.
   */
  TutorialState.prototype.setState = function (newState) {
    Object.assign(this, newState);
    this.observers.forEach(observerFunction => observerFunction(this));
  };

  /**
   * Move to the next step in the tutorial if not at the last step.
   */
  TutorialState.prototype.next = function () {
    if (this.currentStep < this.totalSteps) {
      this.setState({ currentStep: this.currentStep + 1 });
    }
  };

  /**
   * Move to the previous step in the tutorial if not at the first step.
   */
  TutorialState.prototype.back = function () {
    if (this.currentStep > 1) {
      this.setState({ currentStep: this.currentStep - 1 });
    }
  };

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @constructor
   * @param {Object} options
   */
  function Tutorial(options) {
    // Data Init
    this.options = mergOptionsWithDefaults(options);
    this.initialState = { currentStep: 1, totalSteps: 5 };
    this.tutorialState = new TutorialState(initialState);

    // DOM Ref
    this.tutorial = null;
  }

  /**
   * Builds the Tutorial element structure
   *
   * @function
   * @returns {Tutorial} - Returns the current instances for chaining
   */
  Tutorial.prototype.build = function () {
    this.tutorial = _DOM.createElement('div');

    // Subscribe to state changes
    this.tutorialState.subscribe(function render(state) {
      // Logic to render the current popup based on `state.currentStep`
    });

    // Event listeners for Next and Back buttons
    // this.nextButton.onClick = tutorialState.next();
    // this.backButton.onClick = tutorialState.back();

    return this;
  };

  /**
   * Renders the built Tutorial element to the specified DOM node.
   *
   * @function
   * @param {Node} node - DOM node to render the tutorial to
   * @returns {Tutorial} - Returns the current instances for chaining
   */
  Tutorial.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.tutorial);
    }

    return this;
  };

  return Tutorial;
});
