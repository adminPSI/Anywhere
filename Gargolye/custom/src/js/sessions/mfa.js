const mfa = (function() {
  let mfaPopup, submitBtn, codeInput, messageArea;

  function buildPopup() {
    const mainElement = document.getElementsByTagName("main")[0];
    mfaPopup = POPUP.build({
      header: "Please enter your verification code below",
      id: "mfaPopup",
      hideX: true
    });
    codeInput = input.build({
      id: "codeInput",
      label: "Code"
    });
    submitBtn = button.build({
      id: "submitBtn",
      text: "Submit",
      style: "secondary",
      type: "contained",
      callback: () => submitCode()
    });
    const cancelBtn = button.build({
      id: "cancleBtn",
      text: "Cancel",
      callback: () => {
        mainElement.removeChild(mfaPopup);
        overlay.hide();
        bodyScrollLock.enableBodyScroll(mfaPopup);
        document.body.style.overflow = "visible";
      }
    });
    messageArea = document.createElement('div')
    const btnWrap = document.createElement("div");
    btnWrap.classList.add("btnWrap");

    mfaPopup.appendChild(codeInput);
    btnWrap.appendChild(submitBtn);
    btnWrap.appendChild(cancelBtn);
    mfaPopup.appendChild(btnWrap);
    mfaPopup.appendChild(messageArea)
    // disable scrolling
    bodyScrollLock.disableBodyScroll(mfaPopup);
    // show overlay
    const overlayElement = document.querySelector(".overlay");
    overlayElement.style.zIndex = "2";
    mfaPopup.style.zIndex = "3";
    mfaPopup.style.top = "40%";
    overlay.show();
    eventListeners()
    mainElement.appendChild(mfaPopup);
    setTimeout(() => {codeInput.firstChild.focus();}, 500)
  }

  function submitCode() {
    messageArea.innerHTML = ''
    submitBtn.classList.add('disabled')
    const pleaseWait = document.createElement('p')
    pleaseWait.style.textAlign = 'center'
    pleaseWait.innerText = 'Please Wait'
    messageArea.appendChild(pleaseWait)
    const code = codeInput
    .querySelector(".input-field__input")
    .value.trim();
    authenticatedLogin(code);
  }

  function eventListeners() {
    codeInput.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        submitCode()
      }
    })
  }

  function mfaReject(errorReason) {

    let clearUNPW = false; 
    let errorMessage;
    switch (errorReason) {
      case "Too many failed attempts":
        clearUNPW = true;
        errorMessage = "Too many failed attempts. Your account has been disabled. Please contact a system administrator."
        break;
      case "Expired key":
        clearUNPW = true;
        errorMessage = "The verification code entered has expired. Please go back to the login screen and enter your credentials to generate a new code."
        break;
      default:
        errorMessage = "Invalid Code. Please try again.";
        submitBtn.classList.remove('disabled');
        break;
    }

    messageArea.innerHTML = ''
    const errorBox = document.createElement("div");
    errorBox.classList.add("error");
    errorBox.style.display = "block";
    errorBox.setAttribute("id", "mfaErrorBox");
    errorBox.innerHTML = `<p class="error__text">${errorMessage}</p>`;
    messageArea.appendChild(errorBox);

    if (clearUNPW) {
      const unInput = document.getElementById('username');
      const pwInput = document.getElementById('password1');
      unInput.value = '';
      pwInput.value = '';
    }
    codeInput.firstChild.focus()
    codeInput.firstChild.select()
  }

  function init() {
    overlay.init();
    buildPopup();
  }
  return {
    init,
    mfaReject
  };
})();
