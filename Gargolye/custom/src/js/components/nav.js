const NAVIGATION = (() => {
  function init() {
    NAV_MOBILE.init();
    MODULE_MENU.init();
    UTIL_MENU.init();
  }

  return { init };
})();

const NAV_MOBILE = (function () {
  let mobileNav;

  function handleNavClick(event) {
    const moduleMenu = document.querySelector('.module-menu');
    const utilMenu = document.querySelector('.util-menu');
    const isNavItem = event.target.classList.contains('nav__item');
    if (!isNavItem) return;

    const currentlyOpen = document.querySelector('.menu.menu-visible');
    const targetMenu = event.target.dataset.menu === 'module' ? moduleMenu : utilMenu;

    if (currentlyOpen) {
      if (targetMenu === currentlyOpen) {
        const subMenu = [].slice.call(document.querySelectorAll('.submenu.menu-visible'));
        if (subMenu && subMenu.length) {
          subMenu[0].classList.remove('menu-visible');
        }

        currentlyOpen.classList.remove('menu-visible');
      } else {
        currentlyOpen.classList.remove('menu-visible');
        targetMenu.classList.add('menu-visible');
      }
    } else {
      targetMenu.classList.add('menu-visible');
    }
  }

  function init() {
    mobileNav = document.querySelector('.nav__mobile');
    if (mobileNav) mobileNav.addEventListener('click', handleNavClick);
  }

  return { init };
})();

const MODULE_MENU = (function () {
  const gridContainer = document.querySelector('.grid-container');
  const actionNav = document.querySelector('.action__nav');
  const utilMenu = document.querySelector('.util-menu');
  let moduleMenu;

  async function handleMenuClick(event) {
    const target = event.target;

    if (target.classList.contains('menu__button')) {
      /* eMAR:
          currently eMAR just opens a link to https://login.simplemar.com/
          Don't want to do any other module related switching with the emar button,
          so after opening the url, we will just leave the module menu open and not do anything else.
      */
      if (target.dataset.loadModule === 'emar') {
        simpleMar.simpleMarLogin();
        return;
      }
      if ($.loadedApp === 'plan' && $.loadedAppPage === 'planAssessment') {
        assessment.autoSaveAssessment(() => {
          moduleMenu.classList.remove('menu-visible');
          bodyScrollLock.enableBodyScroll(moduleMenu);
          loadApp(target.dataset.loadModule);
        });
      } else {
        moduleMenu.classList.remove('menu-visible');
        bodyScrollLock.enableBodyScroll(moduleMenu);
        loadApp(target.dataset.loadModule);
      }

      return;
    }

    if (target.classList.contains('menu__toggle')) {
      const currToggleState = target.dataset.toggle === 'open' ? 'open' : 'closed';

      if (currToggleState === 'open') {
        target.dataset.toggle = 'closed';
        moduleMenu.classList.add('toggleClosed');
        gridContainer.classList.add('toggleClosed');
        actionNav.classList.add('toggleClosed');
        utilMenu.classList.add('toggleClosed');
        target.innerHTML = icons.keyArrowRight;
      } else {
        target.dataset.toggle = 'open';
        moduleMenu.classList.remove('toggleClosed');
        gridContainer.classList.remove('toggleClosed');
        actionNav.classList.remove('toggleClosed');
        utilMenu.classList.remove('toggleClosed');
        target.innerHTML = icons.keyArrowLeft;
      }
    }
  }

  function init() {
    moduleMenu = document.querySelector('.module-menu');
    if (moduleMenu) moduleMenu.addEventListener('click', handleMenuClick);
  }

  return { init };
})();

const UTIL_MENU = (function () {
  function init() {
    const utilMenu = document.querySelector('.util-menu');
    const utilMenuBtn = document.querySelector('.desktopUtilMenuBtn');
    const modalOverlay = document.querySelector('.overlay');

    utilMenuBtn.addEventListener('click', () => {
      if (utilMenu.classList.contains('menu-visible')) {
        var subMenu = document.getElementsByClassName('submenu menu-visible');
        utilMenu.classList.remove('menu-visible');
        utilMenuBtn.classList.remove('menu-visible');
        modalOverlay.classList.remove('modal')
        if (subMenu && subMenu.length) subMenu[0].classList.remove('menu-visible');
        bodyScrollLock.enableBodyScroll(utilMenu);
      } else {  
    // Add event listener to overlay close the menu when clicking outside of it
    modalOverlay.addEventListener('click', function(event) {
        var subMenu = document.getElementsByClassName('submenu menu-visible');
        utilMenu.classList.remove('menu-visible');
        utilMenuBtn.classList.remove('menu-visible');
        modalOverlay.classList.remove('modal');
        if (subMenu && subMenu.length) subMenu[0].classList.remove('menu-visible');
        bodyScrollLock.enableBodyScroll(utilMenu);        
    });
        utilMenu.classList.add('menu-visible');
        utilMenuBtn.classList.add('menu-visible');
        modalOverlay.classList.add('modal');
        bodyScrollLock.disableBodyScroll(utilMenu);
      }
    });

    if (utilMenu) {
      const mainMenu = document.querySelector('.util-menu__main');
      const defaultsMenu = document.querySelector('.util-menu__defaults');
      const settings = document.querySelector('.util-menu__settings');
      const widgetSettingsMenu = document.querySelector('.util-menu__widgetSettings');
      const helpMenu = document.querySelector('.util-menu__help');

      utilMenu.addEventListener('click', function (event) {
        if (event.target.dataset.action === 'back') {
          document.querySelector('.submenu.menu-visible').classList.remove('menu-visible');
          return;
        }
        if (event.target.dataset.action === 'trainingVideos') {
          const url =
            $.session.applicationName === 'Advisor'
              ? 'http://www.primarysolutions.net/customercare/65465489432134874230-2/'
              : 'http://www.primarysolutions.net/customercare/6546541321877453120-14861520/';
          // var win = window.open('http://www.primarysolutions.net/customercare/?page_id=109545', '_blank');
          const win = window.open(url, '_blank');
          win.focus();
        }

        let targetMenu;

        switch (event.target.dataset.menu) {
          case 'defaults':
            targetMenu = defaultsMenu;
            defaults.init();
            break;
          case 'help':
            targetMenu = helpMenu;
            help.buildPage();
            break;
          case 'settings': //Currently settings window goes straight ot widget settings
            targetMenu = widgetSettingsMenu;
            widgetSettings.init();
            break;
          default:
            break;
        }
        try {
          targetMenu.classList.add('menu-visible');
        } catch (error) {}
      });
    }
  }

  return {
    init,
  };
})();

const MINI_MODULE_MENU = (function () {
  var actioncenter;
  var menuClone;

  function show() {
    DOM.clearActionCenter();
    actioncenter.appendChild(menuClone);
  }
  function hide() {
    actioncenter = document.getElementById('actioncenter');
    actioncenter.removeChild(menuClone);
  }

  function build() {
    actioncenter = document.getElementById('actioncenter');
    var moduleMenu = document.querySelector('.module-menu');

    if (!menuClone) {
      menuClone = moduleMenu.cloneNode(true);
      menuClone.classList.add('menuAsCard');
      // build header
      var menuHeader = document.createElement('h2');
      menuHeader.classList.add('menu__header');
      menuHeader.innerHTML = 'Please select one of these modules from the left.';

      var menuInner = menuClone.querySelector('.menu__inner');

      menuClone.insertBefore(menuHeader, menuInner);

      menuClone.addEventListener('click', e => {
        const appName = e.target.dataset.loadModule;

        if ($.loadedApp === 'plan' && $.loadedAppPage === 'planAssessment') {
          assessment.autoSaveAssessment(e => {
            loadApp(appName);
          });
        } else {
          loadApp(appName);
        }
      });
    }

    show();
  }

  return {
    show,
    hide,
    build,
  };
})();
