var simpleMar = (function () {
  let simpleMarModuleButton;

  function showEMARfailurePopup() {
    const signOnFailerPop = POPUP.build({
      id: 'warningPopup',
      classNames: ['emarSignOnFailerPop', 'warning'],
      hideX: true,
    });

    const message = document.createElement('p');
    message.innerText = 'Single sign-on failed. Please contact your system administrator.';

    const okBtn = button.build({
      text: 'Ok',
      style: 'secondary',
      type: 'contained',
      callback: e => {
        POPUP.hide(signOnFailerPop);
        simpleMarModuleButton.classList.remove('disabled');
      },
    });

    signOnFailerPop.appendChild(message);
    signOnFailerPop.appendChild(okBtn);

    POPUP.show(signOnFailerPop);
  }

  async function simpleMarLogin() {
    simpleMarModuleButton = document.getElementById('emarButton');
    simpleMarModuleButton.classList.add('disabled');

    try {
      const success = await simpleMarAjax.simpleMarLogin();
      simpleMarModuleButton.classList.remove('disabled');
    } catch (error) {
      showEMARfailurePopup();
    }
  }

  return {
    simpleMarLogin,
    showEMARfailurePopup,
  };
})();
