const multiTabs = (function () {
    function notifyOtherTabs(message) {
        userActivityChannel.postMessage({ type: 'update' });
    }

    function newTabOpen(message) {
        userActivityChannel.postMessage({ type: 'newTab' });
    }

    return {
        notifyOtherTabs,
        newTabOpen
    };
})();

const userActivityChannel = new BroadcastChannel('userActivityChannel');

localStorage.setItem('activeChannel', true);

let isOriginalTab = true;

function autoLogout() {
  var isPopupVisible = false;
  var idleTime = 0;
  var logoutInterval = setInterval(timerIncrement, 60000);

  function timerIncrement() {
    var timeLimit = parseInt($.session.anywhereMinutestotimeout);
    idleTime++;
    if (idleTime === timeLimit - 1) {
      POPUP.show(logoutPopup);
      isPopupVisible = true;
    }
    if (idleTime === timeLimit) setCookieOnFail('');
  }

  var logoutMessage = `You've been inactive for a while. For security purposes, we will automatically sign you out in approximately 1 minute.`;
  var logoutPopup = POPUP.build({});
  logoutPopup.innerHTML += logoutMessage;

  // Broadcast mouse movement event to other tabs
  document.addEventListener('mousemove', () => {
    if (isPopupVisible) {
      POPUP.hide(logoutPopup);
      isPopupVisible = false;
    }
    idleTime = 0;
    clearInterval(logoutInterval);
    logoutInterval = setInterval(timerIncrement, 60000);

    // Broadcast mouse movement event to other tabs
    userActivityChannel.postMessage({ type: 'mouseMove' });
  });

  // Broadcast keyboard activity event to other tabs
  document.addEventListener('keydown', () => {
    if (isPopupVisible) {
      POPUP.hide(logoutPopup);
      isPopupVisible = false;
    }
    idleTime = 0;
    clearInterval(logoutInterval);
    logoutInterval = setInterval(timerIncrement, 60000);

    // Broadcast keyboard activity event to other tabs
    userActivityChannel.postMessage({ type: 'keyPress' });
  });

  userActivityChannel.addEventListener('message', function (event) {
    const message = event.data;

    if (message.type === 'mouseMove' || message.type === 'keyPress') {
      // Reset idleTime to zero when there's user activity in other tabs
      idleTime = 0;
    } else if (message.type === 'buttonClick') {
      unloadApp($.loadedApp);
      setCookieOnFail('');
    } else if (message.type === 'newTab') {
      const element = document.getElementById('newTabsPopup');

      if (!element) {
        const newTabsPopup = POPUP.build({
          id: 'newTabsPopup',
          header: 'Attention!',
          hideX: true,
        });

        const message = document.createElement('p');
        message.classList.add('message');
        message.innerText =
          'Opening multiple tabs simultaneously may lead to potential data corruption. For optimal system performance and to avoid any issues, please refrain from making changes in multiple tabs simultaneously.';

        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        const continueBtn = button.build({
          text: 'Continue',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            POPUP.hide(newTabsPopup);
          },
        });

        btnWrap.appendChild(continueBtn);
        newTabsPopup.appendChild(message);
        newTabsPopup.appendChild(btnWrap);

        POPUP.show(newTabsPopup);
      }
    }
  });
}

function handleLogoutButtonClick() {
    unloadApp($.loadedApp);
    setCookieOnFail('');

    // Broadcast the button click event to other tabs
    userActivityChannel.postMessage({ type: 'buttonClick' });
}