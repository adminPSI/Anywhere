(function (global, factory) {
  global.Textarea = factory();
})(this, function () {
  //TODO-ASH: create logic to update charcount on keyup, input

  //=======================================
  // TEXT TO SPEECH
  //---------------------------------------

  /**
   * @constructor
   * @param {Instance} textareaInstance
   * @returns {SpeechToText}
   */
  function SpeechToText(textareaInstance) {
    this.textareaInstance = textareaInstance;

    this.speechConfig = null;
    this.audioConfig = null;
    this.isSpeechInitialized = false;
    this.isListening = false;
  }

  /**
   * @function
   */
  SpeechToText.prototype.init = function () {
    try {
      this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription($.session.azureSTTApi, 'eastus');
      this.speechConfig.speechRecognitionLanguage = 'en-US';
      this.speechConfig.enableDictation();
      this.speechConfig.setServiceProperty(
        'punctuation',
        'explicit',
        SpeechSDK.ServicePropertyChannel.UriQueryParameter,
      );
      this.audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      this.isSpeechInitialized = true;
    } catch (error) {
      if (error.message === 'throwIfNullOrWhitespace:subscriptionKey') {
        const errorMessage =
          'Error initalizing Speech to Text. No API Key found, or API Key has been entered incorrectly. Please contact system administrator to add Azure Speech API Key.';
        console.log(errorMessage);
        return this;
      }

      const errorMessage =
        'Error initalizing Speech to Text. Please contact system administrator to make sure you have a valid Speech to Text connection.';
      console.log(errorMessage);
    }

    if (this.isSpeechInitialized) {
      this.initSpeechRecognizer();
      this.mutationObserver();
    }
  };

  /**
   * Builds the SpeechToText component HTML
   *
   * @function
   */
  SpeechToText.prototype.initSpeechRecognizer = function () {
    this.speechRecognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, this.audioConfig);

    this.speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == SpeechSDK.ResultReason.RecognizedSpeech) {
        const currValue = this.textareaInstance.getValue();
        const newValue = `${currValue} ${e.result.text} `;
        this.textareaInstance.setValue(newValue);
        this.textareaInstance.input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.log('NOMATCH: Speech could not be recognized.');
      }
    };
    this.speechRecognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      if (e.reason == CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log('CANCELED: Did you update the subscription info?');
      }
    };
  };

  /**
   * @function
   */
  SpeechToText.prototype.startSpeechRecognizer = function () {
    this.speechRecognizer.startContinuousRecognitionAsync();
  };

  /**
   * @function
   */
  SpeechToText.prototype.stopSpeechRecognizer = function () {
    this.speechRecognizer.stopContinuousRecognitionAsync();
  };

  /**
   * @function
   */
  SpeechToText.prototype.closeSpeechRecognizer = function () {
    this.speechRecognizer.close();
  };

  /**
   * @function
   */
  SpeechToText.prototype.mutationObserver = function () {
    // Mutation Observer for leaving section to disconnect STT API Call
    const observer = new MutationObserver(function (mutationList, observer) {
      for (let mutation of mutationList) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'data-active-section') {
            observer.disconnect();
            this.closeSpeechRecognizer();
          }
        }
      }
    });

    observer.observe(_DOM.ACTIONCENTER, { attributes: true });
  };

  //=======================================
  // FULLSCREEN MODE
  //---------------------------------------
  /**
   * Contructor function for creating fullscreen textarea component
   *
   * @constructor
   * @param {Textarea} textareaInstance
   * @returns {FullscreenTextarea}
   */
  function FullscreenTextarea(textareaInstance) {
    this.textareaInstance = textareaInstance;

    this.fullScreenDialog = null;
    this.fullScreenCloseBtn = null;
    this.textareaClone = null;

    this.build();
  }

  /**
   * Builds the FullscreenTextarea component HTML
   *
   * @function
   */
  FullscreenTextarea.prototype.build = function () {
    // get new Dialog
    this.fullScreenDialog = new Dialog({
      className: 'fullscreenTextarea',
    });
    this.fullScreenDialog.renderTo(_DOM.ACTIONCENTER);

    // clone textarea for dialog
    this.textareaClone = this.textareaInstance.rootElement.cloneNode(true);

    // build and append dialog close button to textareaClone
    this.fullScreenCloseBtn = _DOM.createElement('div', {
      class: ['fullscreenToggleBtn', 'close'],
      node: Icon.getIcon('exitFullScreen'),
    });
    this.textareaClone.appendChild(this.fullScreenCloseBtn);

    // remove showBtn from textareaClone
    const dupShowModalBtn = this.textareaClone.querySelector('.fullscreenToggleBtn.show');
    this.textareaClone.removeChild(dupShowModalBtn);

    // append textareaClone to dialog
    this.fullScreenDialog.dialog.appendChild(this.textareaClone);

    this.setupEvents();
  };

  /**
   * @function
   */
  FullscreenTextarea.prototype.setupEvents = function () {
    this.textareaInstance.fullScreenShowBtn.addEventListener('click', e => {
      this.fullScreenDialog.show();
    });
    this.fullScreenCloseBtn.addEventListener('click', e => {
      this.fullScreenDialog.close();
    });
    this.textareaClone.addEventListener('input', e => {
      // update value of orig textarea
      this.textareaInstance.setValue(e.target.value);
    });
    this.textareaClone.addEventListener(
      'keyup',
      _UTIL.debounce(e => {
        // update value of orig textarea
        this.textareaInstance.setValue(e.target.value);
        // trigger change event of orig textarea
        const event = new CustomEvent('keyup', {
          bubbles: true,
          cancelable: true,
          detail: true,
        });
        this.textareaInstance.input.dispatchEvent(event);
      }, 100),
    );
    this.fullScreenDialog.onClose(() => {
      this.textareaInstance.toggleDisabled(false);
    });
  };

  /**
   * @function
   */
  FullscreenTextarea.prototype.updateCloneValue = function (value) {
    const inputClone = this.textareaClone.querySelector('textarea');
    inputClone.value = value;
  };

  /**
   * @function
   */
  FullscreenTextarea.prototype.disableCloseButon = function (isDisbled) {
    this.fullScreenCloseBtn.style.pointerEvents = isDisbled ? 'none' : 'all';
  };

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    showcount: false,
    note: null,
    fullscreen: false,
  };

  /**
   * Constructor function for creating a Textarea component.
   *
   * @constructor
   * @param {Object} options
   * @param {String} options.id Id for textarea, use to link it with label. Also used for name attribute.
   * @param {String} options.label Text for label
   * @param {Boolean} [options.required] Whether textarea is required for submission
   * @param {String} [options.note] Text for textarea note/message, displayed underneath textarea field
   * @param {Boolean} [options.showCount] Whether to show char count or not
   * @param {String} [options.minlength] Min char count
   * @param {String} [options.maxlength] Max char count
   * @param {Boolean} [options.hidden] Whether to show or hide the input
   * @param {Boolean} [options.fullscreen] Enables textarea to enter fullscreen mode
   * @param {Boolean} [options.speechToText] Enables speech to text
   * @returns {Textarea}
   *
   * @example
   * const note = new Textarea({
   *   label: 'Note',
   *   id: 'note'
   * });
   */
  function Textarea(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(_UTIL.mergeObjects(DEFAULT_OPTIONS, options));
    this.options.attributes.name = this.options.attributes.id;

    // DOM Ref
    this.rootElement = null;
    this.inputWrap = null;
    this.input = null;
    this.fullscreen = null;
    this.fullScreenShowBtn = null;
    this.speechToTextBtn = null;

    this._build();
    this._setupEvents();
  }

  /**
   * Builds the Textarea component HTML
   *
   * @function
   */
  Textarea.prototype._build = function () {
    const classArray = ['inputGroup', 'textarea', `${this.options.attributes.id}`];
    this.rootElement = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'inputGroup--hidden'] : classArray,
    });

    // INPUT & LABEL
    this.inputWrap = _DOM.createElement('div', { class: 'inputGroup__inputWrap' });
    this.input = _DOM.createElement('textarea', { ...this.options.attributes });
    const labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });
    this.inputWrap.appendChild(this.input);

    this.rootElement.appendChild(labelEle);
    this.rootElement.appendChild(this.inputWrap);

    // INPUT NOTE
    if (this.options.note) {
      const inputNote = _DOM.createElement('div', { class: 'inputGroup__note', text: this.options.note });
      this.rootElement.appendChild(inputNote);
    }

    // CHAR COUNTER
    if (this.options.showcount) {
      const countMarkup = this.options.attributes.maxlength
        ? { html: `${0}<span>/</span>${this.options.attributes.maxlength}` }
        : { text: '0' };
      const inputCount = _DOM.createElement('div', { class: 'charCount', ...countMarkup });
      this.rootElement.appendChild(inputCount);
    }

    // FULLSCREEN MODE
    if (this.options.fullscreen) {
      this.input.classList.add('fullscreen');
      // add open fullscreen to orign textarea
      this.fullScreenShowBtn = _DOM.createElement('div', {
        class: ['fullscreenToggleBtn', 'show', 'iconButton'],
        node: Icon.getIcon('openFullScreen'),
      });
      this.rootElement.appendChild(this.fullScreenShowBtn);

      // build fullscreenmode
      this.fullscreen = new FullscreenTextarea(this);
    }

    // SPEECH TO TEXT
    if (this.options.speechToText) {
      this.input.classList.add('speechToText');
      this.speechToTextBtn = _DOM.createElement('div', {
        class: ['speechToTextBtn', 'off', 'iconButton'],
        node: Icon.getIcon('micOff'),
      });
      this.rootElement.appendChild(this.speechToTextBtn);

      // init speech to text
      this.speechToText = new SpeechToText(this);
      this.speechToText.init();
    }

    if (this.options.fullscreen || this.options.speechToText) {
      this.rootElement.classList.add('inputGroup--top-icons');
    }
  };

  /**
   * Sets up events for textarea
   *
   * @function
   */
  Textarea.prototype._setupEvents = function () {
    if (this.options.fullscreen) {
      this.input.addEventListener('change', e => {
        this.fullscreen.updateCloneValue(e.target.value);
      });
    }

    if (this.options.speechToText && this.speechToText.isSpeechInitialized) {
      this.speechToTextBtn.addEventListener('click', e => {
        this.speechToText.isListening = !this.speechToText.isListening;

        if (this.speechToText.isListening) {
          this.speechToText.startSpeechRecognizer(() => {
            // this.speechToTextBtn
            this.speechToTextBtn.innerHTML = '';
            // set icon to micOn
            this.speechToTextBtn.appendChild(Icon.getIcon('micOn'));
            // remove class 'off'
            this.speechToTextBtn.classList.remove('off');
          });
        } else {
          this.speechToText.stopSpeechRecognizer(() => {
            // this.speechToTextBtn
            this.speechToTextBtn.innerHTML = '';
            // set icon to micOff
            this.speechToTextBtn.appendChild(Icon.getIcon('micOff'));
            // add class 'off'
            this.speechToTextBtn.classList.add('off');
          });
        }
      });
    }
  };

  /**
   * Sets value of textarea
   *
   * @function
   * @param {String} value
   */
  Textarea.prototype.setValue = function (value) {
    this.input.value = value;
    if (this.options.fullscreen) {
      this.fullscreen.updateCloneValue(value);
    }
  };

  /**
   * Returns value of textarea
   *
   * @function
   * @param {String} value
   */
  Textarea.prototype.getValue = function () {
    return this.input.value;
  };

  /**
   * Clears textarea value, sets it to ''
   *
   * @function
   */
  Textarea.prototype.clear = function () {
    this.input.value = '';
    if (this.options.fullscreen) {
      this.fullscreen.updateCloneValue('');
    }
  };

  /**
   * Sets Custom Validity on textarea
   *
   * @function
   * @param {String} message Empty string will unset invalid status
   */
  Textarea.prototype.setValidtyError = function (message) {
    this.input.setCustomValidity(message);
  };

  /**
   * Sets focus to element
   *
   * @function
   */
  Textarea.prototype.setFocus = function () {
    this.input.focus();
  };

  /**
   * Toggles textarea required state, if true input is required
   *
   * @function
   * @param {Boolean} isRequired
   */
  Textarea.prototype.toggleRequired = function (isRequired) {
    this.input.required = isRequired;
  };

  /**
   * Toggles inputs disabled state, if true input is disabled
   *
   * @function
   * @param {Boolean} isDisbled
   */
  Textarea.prototype.toggleDisabled = function (isDisbled) {
    this.input.disabled = isDisbled;
    this.input.readOnly = isDisbled;
  };

  /**
   * Handles textarea change event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Textarea.prototype.onChange = function (cbFunc) {
    this.input.addEventListener('input', e => {
      if (cbFunc) cbFunc(e);

      if (this.options.fullscreen) {
        this.fullscreen.updateCloneValue(e.target.value);
      }
    });
  };

  /**
   * Handles textarea keyup event
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Textarea.prototype.onKeyup = function (cbFunc) {
    this.input.addEventListener('keyup', e => {
      if (cbFunc) cbFunc(e);

      if (this.options.fullscreen) {
        this.fullscreen.updateCloneValue(e.target.value);
      }
    });
  };

  /**
   * Renders the built Textarea element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the textarea to
   * @returns {Textarea} Returns the current instances for chaining
   */
  Textarea.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return Textarea;
});
