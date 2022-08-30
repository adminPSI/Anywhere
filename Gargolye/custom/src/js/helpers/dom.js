// Layout API
// Handles DOM Manipulation
const DOM = (function () {
  var BODY = document.body;
  var GRID_CONTAINER = document.querySelector('.grid-container');
  var ACTIONCENTER = document.getElementById('actioncenter');

  function autosizeTextarea(textarea) {
    // autosizeTextarea() takes a callback incase you need to call
    // a function after the textarea has been resized.
    // ---------------------------------------------------------------
    // if (textarea) {
    //   textarea.style.height = textarea.scrollHeight + 'px';
    //   textarea.addEventListener('input', () => {
    //     textarea.style.height = 'auto';
    //     textarea.style.height = textarea.scrollHeight + 'px';
    //   });
    //   return;
    // }

    var textareas = [].slice.call(document.querySelectorAll('textarea.autosize'));
    textareas.forEach(area => {
      area.style.height = area.scrollHeight + 'px';
      area.addEventListener('input', () => {
        area.style.height = 'auto';
        area.style.height = area.scrollHeight + 'px';
      });
    });
  }

  function clearActionCenter() {
    var actioncenter = document.getElementById('actioncenter');
    actioncenter.innerHTML = '';
  }

  function toggleHeaderOpacity() {
    var header = document.querySelector('.site-header');
    header.classList.toggle('fadeOut');
  }

  function toggleNavLayout() {
    if (isMobile) {
      // only for mobile navigation
      var actionBtn = document.querySelector('.floatingActionBtn');
      var nav = document.querySelector('.nav__mobile');
      if (actionBtn && !actionBtn.classList.contains('hidden')) {
        nav.classList.add('actionBtnActive');
      } else {
        nav.classList.remove('actionBtnActive');
      }
    }
  }

  function requestAnimFrame(cb) {
    return (
      window.requestAnimationFrame(cb) ||
      window.webkitRequestAnimationFrame(cb) ||
      window.mozRequestAnimationFrame(cb) ||
      window.msRequestAnimationFrame(cb) ||
      function (cb) {
        setTimeout(cb, 0);
      }
    );
  }

  function scrollToTopOfPage() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome & IE
  }

  return {
    // dome elements
    BODY,
    GRID_CONTAINER,
    ACTIONCENTER,
    // functions
    autosizeTextarea,
    clearActionCenter,
    toggleHeaderOpacity,
    toggleNavLayout,
    requestAnimFrame,
    scrollToTopOfPage,
  };
})();
