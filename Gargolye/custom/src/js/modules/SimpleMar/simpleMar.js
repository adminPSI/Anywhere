var simpleMar = (function () {
  function showEMARfailurePopup() {
    const signOnFailerPop = POPUP.build({
      id: 'warningPopup',
      classNames: 'warning',
      hideX: true,
    });

    const message = document.createElement('p');
    message.innerText = 'Single sing-on failed. Please contact your system administrator.';

    const okBtn = button.build({
      text: 'Ok',
      callback: e => {
        POPUP.hide(signOnFailerPop);
      },
    });

    signOnFailerPop.appendChild(message);
    signOnFailerPop.appendChild(okBtn);

    POPUP.show(signOnFailerPop);
  }

  async function simpleMarLogin() {
    try {
      await simpleMarAjax.simpleMarLogin();
    } catch (error) {
      showEMARfailurePopup();
    }
  }

  return {
    simpleMarLogin,
  };
})();
