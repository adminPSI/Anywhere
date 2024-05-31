var overlay = (function() {
  var overlay;

  function hide() {
    overlay.classList.remove('visible');
  }
  function show() {
    overlay.classList.add('visible');
  }
  function init() {
    multiTabs.newTabOpen();
    overlay = document.querySelector('.overlay');
    overlay.addEventListener('click', event => {
      // Special code for IE
      if (isIE) return;
      //---- end ie code ----------
      
      // if you don't want the click on overlay to hide popup remove class visible from your popup
      var popup = document.querySelector('.visible[data-popup="true"]');

      if (!popup) return;
      
      if (popup.classList.contains('popup--static')) {
        popup.classList.remove('visible');        
      } else {
        // if popup is not static, remove it from DOM
        var parent = popup.parentElement;
        parent.removeChild(popup);
      }
      // hide overlay
      hide();
      bodyScrollLock.enableBodyScroll(popup);
    });
  }

  return {
    hide,
    show,
    init
  }
})();