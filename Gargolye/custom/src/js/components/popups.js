// WORK IN PROGRESS
/**
 * Popups
 * - POPUP.build() creates the popup element.
 * - POPUP.show() shows the popup.
 * - POPUP.hide() hides the popup.
 */
const POPUP = (function () {
  /**
   * Anywhere Popup Element
   * @typedef {HTMLDivElement} PopupElement
   * @param {Object} opts - Options to define the popup.
   * @param {Object[]} [opts.attributes] - Can define popup element data attributes.
   * @param {string} opts.attributes.key - Data attribute key.
   * @param {string} opts.attributes.value - Data attribute value.
   * @param {(string|string[])} [opts.classNames] - Single string or array of strings that set the class names for the popup element.
   * @param {string} [opts.header] - Heading at the top of the popup.
   * @param {string} [opts.id] - Sets popup elemnet id.
   * @param {boolean} [opts.hideX] - True = hide the x close button to close the popup.
   * @param {function} [opts.closeCallback] - Action to perform when x close button is clicked.
   * @param {function} [opts.onChangeCallback] - Action to perform when an input is changed
   * - X close button removes the popup so only include actions you want performed after the popup
   * is closed to this callback
   * @returns {PopupElement} Returns the popup element with the given options.
   */
  function build(opts) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.setAttribute('data-popup', 'true');

    // add heading
    if (opts.header) {
      popup.innerHTML = `<p class="popup__header">${opts.header}</p>`;
    }
    // set id
    if (opts.id) {
      popup.setAttribute('id', opts.id);
    }

    // set attributes
    if (opts.attributes && opts.attributes.length > 0) {
      opts.attributes.forEach(a => {
        popup.setAttribute(a.key, a.value);
      });
    }
    // set class
    if (opts.classNames) {
      if (Array.isArray(opts.classNames)) {
        opts.classNames.forEach(c => {
          popup.classList.add(c);
        });
      } else {
        popup.classList.add(opts.classNames);
      }
    }

    // onchange event
    if (opts.onChangeCallback) {
      popup.addEventListener('change', e => opts.onChangeCallback(e));
    }

    // add 'x' for alternative popup closing abilities
    const closePopBtn = button.build({
      type: 'text',
      style: 'secondary',
      icon: 'close',
      classNames: 'closePopupBtn',
      callback: function (e) {
        DOM.ACTIONCENTER.removeChild(popup);
        overlay.hide();
        bodyScrollLock.enableBodyScroll(popup);
        document.body.style.overflow = 'visible';
        if (opts.closeCallback) opts.closeCallback(e);
      },
    });

    if (!opts.hideX) popup.appendChild(closePopBtn);

    return popup;
  }
  /**
   * Used to show a popup created with POPUP.build()
   * @param {PopupElement} popup - Popup from POPUP.build()
   * @param {HTMLDivElement} [appendTo] - Can specify a specific element where you would like the popup do be appended to.
   * - If undefined, popup appends to the action center.
   */
  function show(popup, appendTo) {
    // disable scrolling
    bodyScrollLock.disableBodyScroll(popup);
    // show overlay
    overlay.show();
    // show popup
    if (appendTo) {
      appendTo.appendChild(popup);
    } else {
      DOM.ACTIONCENTER.appendChild(popup);
    }
  }
  /**
   * Used to hide a popup created with POPUP.build()
   * @param {PopupElement} popup - Popup from POPUP.build()
   * @param {HTMLDivElement} [removeFrom] - If you used appendTo in above show function add it here as well
   * - If undefined, popup appends to the action center.
   */
  function hide(popup, removeFrom) {
    // enable scrolling
    bodyScrollLock.enableBodyScroll(popup);
    document.body.style.overflow = 'auto';
    // hide overlay
    overlay.hide();
    // hide popup
    if (removeFrom) {
      removeFrom.removeChild(popup);
    } else {
      DOM.ACTIONCENTER.removeChild(popup);
    }
  }

  return {
    build,
    show,
    hide,
  };
})();

const successfulSave = (function () {
  /**
   * Build save checkmark with message
   * @param {string} message
   * @param {boolean} noPopup - True = return w/o popup classname
   */
  function build(message, noPopup) {
    const sspopup = document.createElement('div');
    sspopup.classList.add('successfulSavePopup');
    if (!noPopup) sspopup.classList.add('popup');
    sspopup.innerHTML = `
      ${icons['checkmark']}
      ${message ? `<p>${message}</p>` : ''}
    `;

    return sspopup;
  }
  /**
   * Returns popup as dom node
   * @param {string} message
   */
  function get(message, asPopup) {
    return build(message, asPopup);
  }
  /**
   * Displays successful save popup to actioncenter
   * @param {string} message
   */
  function show(message = 'SAVED') {
    const sspopup = build(message, false);
    overlay.show();
    DOM.ACTIONCENTER.appendChild(sspopup);
  }

  /**
   * Hides successful save popup
   */
  function hide(removeOverlay = true) {
    const successfulSavePopup = document.querySelector('.successfulSavePopup');
    if (removeOverlay) overlay.hide();
    DOM.ACTIONCENTER.removeChild(successfulSavePopup);
  }

  return {
    get,
    show,
    hide,
  };
})();
const failSave = (function () {
  /**
   * Build save checkmark with message
   * @param {string} message
   * @param {boolean} noPopup - True = return w/o popup classname
   */
  function build(message, noPopup) {
    if (!message) message = 'SAVED';
    const sspopup = document.createElement('div');
    sspopup.classList.add('failSavePopup');
    if (!noPopup) sspopup.classList.add('popup');
    sspopup.innerHTML = `
      ${icons['close']}
      <p>${message}</p>
    `;

    return sspopup;
  }
  /**
   * Returns popup as dom node
   * @param {string} message
   */
  function get(message, asPopup) {
    return build(message, asPopup);
  }
  /**
   * Displays successful save popup to actioncenter
   * @param {string} message
   */
  function show(message) {
    const sspopup = build(message, false);
    overlay.show();
    DOM.ACTIONCENTER.appendChild(sspopup);
  }

  /**
   * Hides successful save popup
   */
  function hide(removeOverlay = true) {
    const failSavePopup = document.querySelector('.failSavePopup');
    if (removeOverlay) overlay.hide();
    DOM.ACTIONCENTER.removeChild(failSavePopup);
  }

  return {
    get,
    show,
    hide,
  };
})();
/** Shows a 'saving in progress' popup, that doesn't go away until fulfill is called
 * - Call pendingSave.show() to show data is curently being saved
 * - Call pendingSave.fulfill() once the data has been saved successfully.
 * @todo Should also add a 'reject' function to handle errors saving to the DB
 */
const pendingSave = (function () {
  /**
   * Shows the saving in progress popup with the given message.
   * @param {string} [message='SAVING'] - Message to display when saving is still in progress
   */
  function show(message = 'SAVING') {
    // build
    // PROGRESS.SPINNER.init()
    var popup = document.createElement('div');
    popup.classList.add('pendingSavePopup', 'popup');

    //SPINNER
    spinnerWrap = document.createElement('div');
    spinnerWrap.classList.add('spinner');
    spinnerMessage = document.createElement('h2');
    spinnerMessage.classList.add('spinner__message');
    var spinnerBar = document.createElement('div');
    spinnerBar.classList.add('spinner__bar');
    spinnerMessage.innerHTML = `<p>${message}</p>`;
    spinnerWrap.appendChild(spinnerBar);
    spinnerWrap.appendChild(spinnerMessage);

    popup.appendChild(spinnerWrap);
    // show
    overlay.show();
    // PROGRESS.SPINNER.show()
    DOM.ACTIONCENTER.appendChild(popup);
  }
  /**
   * Call this when your data has been saved.
   * @param {string} message - Successful saved message to display
   */
  function fulfill(message) {
    var popup = document.querySelector('.pendingSavePopup');
    DOM.ACTIONCENTER.removeChild(popup);
    // PROGRESS.SPINNER.hide()
    successfulSave.show(message);
  }
  function reject(message) {
    var popup = document.querySelector('.pendingSavePopup');
    DOM.ACTIONCENTER.removeChild(popup);
    // PROGRESS.SPINNER.hide()
    failSave.show(message);
  }

  function hide(removeOverlay = true) {
    var popup = document.querySelector('.pendingSavePopup');
    if (removeOverlay) overlay.hide();
    DOM.ACTIONCENTER.removeChild(popup);
  }

  return {
    show,
    fulfill,
    reject,
    hide,
  };
})();
