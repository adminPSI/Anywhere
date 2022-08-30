var PROGRESS = (function () {
  var actioncenter;

  function _show(progressBar) {
    DOM.clearActionCenter();
    actioncenter.appendChild(progressBar);
    progressBar.style.removeProperty('display');
  }
  function _hide(progressBar, spinnerMessage) {
    var parent = progressBar.parentElement;
    parent.removeChild(progressBar);
    parent.removeChild(spinnerMessage);
  }

  var SPINNER = (function () {
    var spinnerWrap;
    var spinnerMessage;
    let spinnerBar;

    function show(message) {
      if (message) {
        spinnerMessage.innerHTML = message;
        spinnerMessage.classList.add('visible');
      }
      _show(spinnerWrap);
    }
    function hide() {
      _hide(spinnerBar, spinnerMessage);
    }
    function build() {
      spinnerWrap = document.createElement('div');
      spinnerWrap.classList.add('spinner');
      spinnerMessage = document.createElement('h2');
      spinnerMessage.classList.add('spinner__message');
      spinnerBar = document.createElement('div');
      spinnerBar.classList.add('spinner__bar');
      spinnerWrap.appendChild(spinnerMessage);
      spinnerWrap.appendChild(spinnerBar);
    }
    function get(message) {
      const newSpinner = spinnerWrap.cloneNode(true);
      if (message) {
        const spinnerMessageElement = newSpinner.querySelector('.spinner__message')
        spinnerMessageElement.innerHTML = message
        spinnerMessageElement.classList.add('visible');
      }
      return newSpinner;
    }

    function init() {
      speed = 0;
      build();
    }

    return {
      init,
      show,
      hide,
      get,
    };
  })();

  function init() {
    actioncenter = document.getElementById('actioncenter');
    SPINNER.init();
  }

  return {
    SPINNER,
    init,
  };
})();

//PROGRESS__ANYWHERE USE:
//1) PROGRESS__ANYWHERE.init()
//2) PROGRESS__ANYWHERE.SPINNER.show(ELEMENT YOU WANT THE PROGRESS BAR TO BE ADDED TO, MESSAGE);
//3) PROGRESS__ANYWHERE.SPINNER.hide(ELEMENT YOU ADDED PROGRESS BAR TO)

/**
 * Placing a progress bar anywhere. Example is in
 * Unread Progress and Location Note Widget.
 * 1) SPINNER.init
 * 2) SPINNER.show
 * 3) SPINNER.hide
 */

const PROGRESS__ANYWHERE = (function () {
  let insertElement;

  function _show(progressBar, insertElement) {
    insertElement.appendChild(progressBar);
  }
  function _hide(progressBar, spinnerMessage, containingElement) {
    if (containingElement) {
      progressBar = containingElement.querySelector('.spinner__bar', '.small');
      spinnerMessage = containingElement.querySelector('.spinner__message', '.small');
    }
    var parent = progressBar.parentElement;
    parent.removeChild(progressBar);
    parent.removeChild(spinnerMessage);
  }

  /**
   * Main spinner functions
   */
  const SPINNER = (function () {
    let smallSpinnerWrap;
    let spinnerMessage;
    let smallSpinnerBar;
    /**
     * Shows the spinner until hide function is called.
     * @param {HTMLElement} element the html element where you would like the spinner to be placed
     * @param {string} message what you want the spinner to say
     */
    function show(element, message) {
      insertElement = element;
      if (message) {
        spinnerMessage.innerHTML = message;
        spinnerMessage.classList.add('visible');
      }
      _show(smallSpinnerWrap, insertElement);
    }
    /**
     * Hides the spinner from spinner.show
     * @param {HTMLElement} parentElement html element that contains the spinner. Use the same element that was passed in SPINNER.show
     */
    function hide(parentElement) {
      _hide(smallSpinnerBar, spinnerMessage, parentElement);
    }
    function build() {
      smallSpinnerWrap = document.createElement('div');
      smallSpinnerWrap.classList.add('spinner__small');
      spinnerMessage = document.createElement('h2');
      spinnerMessage.classList.add('spinner__message', 'small');
      smallSpinnerBar = document.createElement('div');
      smallSpinnerBar.classList.add('spinner__bar', 'small');
      smallSpinnerWrap.appendChild(spinnerMessage);
      smallSpinnerWrap.appendChild(smallSpinnerBar);
    }
    /**
     * Call this before spinner.show. Creates all necessary spinner elements.
     */
    function init() {
      speed = 0;
      build();
    }

    return {
      init,
      show,
      hide,
    };
  })();

  function init() {
    SPINNER.init();
  }

  return {
    SPINNER,
    init,
  };
})();

/*
PROGRESS__BTN USE: 
Like Progress anywhere but to use with buttons that are awaiting a response
1) PROGRESS__ANYWHERE.SPINNER.show(BTN, MESSAGE, true/false);
2) PROGRESS__ANYWHERE.SPINNER.hide(BTN)
*/

/**
 * Placing a progress bar anywhere. Example is in
 * Unread Progress and Location Note Widget.
 * 1) SPINNER.show
 * 2) SPINNER.hide
 */
const PROGRESS__BTN = (function () {
  let insertElement;

  function _show(progressBar, insertElement) {
    insertElement.appendChild(progressBar);
  }
  function _hide(progressBar, spinnerMessage, containingElement) {
    if (containingElement) {
      progressBar = containingElement.querySelector('.spinner__bar', '.small_btn');
      spinnerMessage = containingElement.querySelector('.spinner__message', '.small_btn');
    }
    var parent = progressBar.parentElement;
    parent.removeChild(progressBar);
    parent.removeChild(spinnerMessage);
  }

  const SPINNER = (function () {
    let btnSpinnerWrap;
    let spinnerMessage;
    let smallSpinnerBar;
    const buttonTextCache = new Map();

    /**
     * Shows the spinner until hide function is called.
     * @param {HTMLElement|string} btnElement the btn element where you would like the spinner to be placed
     * @param {string} message what you want the spinner to say
     * @param {boolean} cache cache the message and corresponding element for hiding progress.
     */
    function show(btnElement, message, cache = true) {
      //Move INIT to show
      speed = 0;
      build();
      //
      if (typeof(btnElement) === 'string') btnElement = document.getElementById(btnElement)
      insertElement = btnElement;
      if (cache) buttonTextCache.set(btnElement, btnElement.innerText);
      if (message) {
        spinnerMessage.innerHTML = message;
        spinnerMessage.classList.add('visible');
      }
      btnElement.classList.add('disabled')
      btnElement.style.width = btnElement.clientWidth + 'px';
      btnElement.innerHTML = '';
      _show(btnSpinnerWrap, insertElement);
    }
    /**
     * Hides the spinner from spinner.show
     * @param {HTMLElement|string} btnElement html element, OR id of button in string form that contains the spinner. Use the same element that was passed in SPINNER.show
     */
    function hide(btnElement) {
      if (typeof(btnElement) === 'string') btnElement = document.getElementById(btnElement)
      btnElement.classList.remove('disabled')
      btnElement.style.removeProperty('width');
      _hide(smallSpinnerBar, spinnerMessage, btnElement);
      btnElement.innerText = buttonTextCache.get(btnElement);
      buttonTextCache.delete(btnElement);
    }
    function build() {
      btnSpinnerWrap = document.createElement('div');
      btnSpinnerWrap.classList.add('spinner__btn');
      spinnerMessage = document.createElement('h2');
      spinnerMessage.classList.add('spinner__message', 'small_btn');
      smallSpinnerBar = document.createElement('div');
      smallSpinnerBar.classList.add('spinner__bar', 'small_btn', 'faster');
      btnSpinnerWrap.appendChild(spinnerMessage);
      btnSpinnerWrap.appendChild(smallSpinnerBar);
    }
    return {
      show,
      hide,
    };
  })();

  return {
    SPINNER,
  };
})();