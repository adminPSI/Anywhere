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

    const elementsWithClass = document.querySelectorAll('.route-link');

    // Add an event listener to each element
    elementsWithClass.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
        });
    });
        
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

            moduleMenu.classList.remove('menu-visible');
            bodyScrollLock.enableBodyScroll(moduleMenu);
            loadApp(target.dataset.loadModule);

            // Get a reference to the overlay element
            const overlay = document.querySelector('.overlay');

            if (overlay.classList.contains('visible')) {
                overlay.classList.remove('visible');
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
                addAttr();
                   
            } else {
                target.dataset.toggle = 'open';
                moduleMenu.classList.remove('toggleClosed');
                gridContainer.classList.remove('toggleClosed');
                actionNav.classList.remove('toggleClosed');
                utilMenu.classList.remove('toggleClosed');
                target.innerHTML = icons.keyArrowLeft;
                removeAttr();
            }
        }
    }

    function init() {  
        moduleMenu = document.querySelector('.module-menu');
        if (moduleMenu) moduleMenu.addEventListener('click', handleMenuClick);
    }

    function removeAttr() {
        document.getElementById('singlebutton').removeAttribute("title");
        document.getElementById('rostersettingsbutton').removeAttribute("title");
        document.getElementById('dayservicesettingsbutton').removeAttribute("title");
        document.getElementById('goalssettingsbutton').removeAttribute("title");
        document.getElementById('casenotesbutton').removeAttribute("title");
        document.getElementById('singleentrybutton').removeAttribute("title");
        document.getElementById('workshopbutton').removeAttribute("title");
        document.getElementById('incidenttrackingbutton').removeAttribute("title");
        document.getElementById('scheduleButton').removeAttribute("title");
        document.getElementById('authorizationsButton').removeAttribute("title");
        document.getElementById('planButton').removeAttribute("title");
        document.getElementById('covidButton').removeAttribute("title");
        document.getElementById('transportationButton').removeAttribute("title");
        document.getElementById('emarButton').removeAttribute("title");
        document.getElementById('PDFFormsButton').removeAttribute("title");
        document.getElementById('EmploymentButton').removeAttribute("title");
        document.getElementById('OODButton').removeAttribute("title");
        document.getElementById('CFButton').removeAttribute("title");
        document.getElementById('AdminButton').removeAttribute("title");
        document.getElementById('resetButton').removeAttribute("title");
        document.getElementById('accountButton').removeAttribute("title");
        document.getElementById('editaccountButton').removeAttribute("title");
    }

    function addAttr() {
        document.getElementById('singlebutton').setAttribute("title", "Dashboard");
        document.getElementById('rostersettingsbutton').setAttribute("title", "Roster");
        document.getElementById('dayservicesettingsbutton').setAttribute("title", "Day Services");
        document.getElementById('goalssettingsbutton').setAttribute("title", "Outcomes");
        document.getElementById('casenotesbutton').setAttribute("title", "Case Notes");
        document.getElementById('singleentrybutton').setAttribute("title", "Time Entry");
        document.getElementById('workshopbutton').setAttribute("title", "Workshop");
        document.getElementById('incidenttrackingbutton').setAttribute("title", "Incident Tracking");
        document.getElementById('scheduleButton').setAttribute("title", "Scheduling");
        document.getElementById('authorizationsButton').setAttribute("title", "Authorizations");
        document.getElementById('planButton').setAttribute("title", "Plan");
        document.getElementById('covidButton').setAttribute("title", "COVID Checklist");
        document.getElementById('transportationButton').setAttribute("title", "Transportation");
        document.getElementById('emarButton').setAttribute("title", "eMAR");
        document.getElementById('PDFFormsButton').setAttribute("title", "Forms");
        document.getElementById('EmploymentButton').setAttribute("title", "Employment");
        document.getElementById('OODButton').setAttribute("title", "OOD");
        document.getElementById('CFButton').setAttribute("title", "Money Management");
        document.getElementById('AdminButton').setAttribute("title", "Administration");
        document.getElementById('resetButton').setAttribute("title", "Reset Passwords");
        document.getElementById('accountButton').setAttribute("title", "Account Register");
        document.getElementById('editaccountButton').setAttribute("title", "Edit Account");
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
                modalOverlay.classList.remove('modal');
                if (subMenu && subMenu.length) subMenu[0].classList.remove('menu-visible');
                bodyScrollLock.enableBodyScroll(utilMenu);
            } else {
                // Add event listener to overlay close the menu when clicking outside of it
                modalOverlay.addEventListener('click', function (event) {
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
            const informationMenu = document.querySelector('.util-menu__info');
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
                            ? 'https://primarysolutions.net/technology/advisor-support/'
                            : 'https://primarysolutions.net/technology/gatekeeper-support/';

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
                    case 'settings': {
                        //Currently settings window goes straight ot widget settings
                        targetMenu = widgetSettingsMenu;
                        widgetSettings.init();
                        break;
                    }
                    case 'information': {
                        targetMenu = informationMenu;
                        information.init();
                        break;
                    }
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
                loadApp(appName);
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
