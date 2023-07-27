var tabs = (function () {
  function build(options) {
    var active = options.active ? options.active : 0;
    // options = {sections=[], active=num, tabNavCallback}
    var tabWrap = document.createElement('div');
    var tabNav = document.createElement('div');
    var tabBody = document.createElement('div');
    tabWrap.classList.add('tabs');
    tabNav.classList.add('tabs__nav');
    tabBody.classList.add('tabs__body');

    options.sections.forEach((sec, index) => {
      // build nav item
      var navItem = document.createElement('div');
      navItem.classList.add('tabs__nav--item');
      navItem.setAttribute('section', sec.toLowerCase());
      navItem.innerHTML = sec;
      // build tab section
      var section = document.createElement('div');
      var secClass = `${sec.toLowerCase().replace(/ /g, '')}-section`;
      section.classList.add('tabs__body--section', secClass);
      section.id = sec.toLowerCase();
      if (index === active) {
        navItem.classList.add('active');
        section.classList.add('active');
      }
      // append them
      tabNav.appendChild(navItem);
      tabBody.appendChild(section);
    });

    tabWrap.appendChild(tabNav);
    tabWrap.appendChild(tabBody);

    tabNav.addEventListener('click', event => {
      if (!event.target.classList.contains('tabs__nav--item')) return;

      var activeTab = tabNav.querySelector('.active');
      var activeSection = tabBody.querySelector('.active');
      var targetSection = `.${event.target.innerHTML.toLowerCase().replace(/ /g, '')}-section`;
      targetSection = tabBody.querySelector(targetSection);

      activeTab.classList.remove('active');
      event.target.classList.add('active');
      activeSection.classList.remove('active');
      targetSection.classList.add('active');

      if (options.tabNavCallback)
        options.tabNavCallback({
          activeSection: event.target.innerHTML,
        });
    });

    return tabWrap;
  }

  return {
    build,
  };
})();

const TABS = (function () {
  const buildTabs = () => {
    const tabs = document.createElement('div');
    tabs.classList.add('tabs');
    return tabs;
  };
  const buildTabsNav = () => {
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabsNav');
    return tabsNav;
  };
  const buildTabsBody = () => {
    const tabsBody = document.createElement('div');
    tabsBody.classList.add('tabsBody');
    return tabsBody;
  };
  const buildNavItem = (navText, isActive, index) => {
    let ISPValidationCheck = plan.getISPValidation();
    let assessmentValidtaionCheck = plan.getAssessmentValidation();

    const navItem = document.createElement('div');
    navItem.classList.add('tabsNav__item');
    navItem.id = `tabNav${index}`;
    navItem.innerHTML = `<p>${navText}</p>`;

    // create alert div
    const navAlertDiv = document.createElement('div');
    navAlertDiv.classList.add('tocAlertDiv');
    navAlertDiv.id = `navAlert${navText}`;
    navAlertDiv.innerHTML = `${icons.error}`;
    navItem.appendChild(navAlertDiv);

    planValidation.createTooltip(
      'There is data missing on this tab that is required by DODD',
      navAlertDiv,
    );

    navAlertDiv.style.display = 'none';

    if (isActive) navItem.classList.add('active');

    // DIsplay Assessment Nav Validation if their are validation errors
    if (navText === 'Assessment' && assessmentValidtaionCheck.complete === false) {
      navAlertDiv.style.display = 'flex';
    }

    // DIsplay ISP Nav Validation if their are validation errors
    if (navText === 'ISP' && ISPValidationCheck.complete === false) {
      navAlertDiv.style.display = 'flex';
    }

    return navItem;
  };
  const buildTabSection = (sectionMarkup, isActive, index) => {
    const tabSection = document.createElement('div');
    tabSection.classList.add('tabsBody__sec');
    tabSection.id = `tab${index}`;
    tabSection.appendChild(sectionMarkup);
    if (isActive) tabSection.classList.add('active');

    return tabSection;
  };

  // PUBLIC
  //============================================
  const build = (options, tabsData) => {
    // options = {
    //   navOnClick: function()
    // }
    // tabsData = [
    //   {
    //     heading: 'Tab 1',
    //     markup: 'tab 1 markup',
    //   },
    // ];
    const active = options.active ? options.active : 0;

    const tabs = buildTabs();
    const tabsNav = buildTabsNav();
    const tabsBody = buildTabsBody();

    tabsData.forEach((td, index) => {
      const isActive = index === active;
      const navItem = buildNavItem(td.heading, isActive, index);
      const tabSection = buildTabSection(td.markup, isActive, index);

      tabsNav.appendChild(navItem);
      tabsBody.appendChild(tabSection);
    });

    tabsNav.addEventListener('click', e => {
      if (!e.target.classList.contains('tabsNav__item') || tabsNav.classList.contains('disabled')) {
        return;
      }

      const targetTab = e.target;
      const targetTabIndex = targetTab.id.replace('tabNav', '');
      const targetSectionId = `#tab${targetTabIndex}`;
      const targetSection = document.querySelector(targetSectionId);
      const activeTab = tabsNav.querySelector('.active');
      const activeSection = tabsBody.querySelector('.tabsBody > .active');

      activeTab.classList.remove('active');
      activeSection.classList.remove('active');

      targetTab.classList.add('active');
      targetSection.classList.add('active');

      options.navOnClick(targetTabIndex);
    });

    tabsNav.classList.add('disabled');

    tabs.appendChild(tabsNav);
    tabs.appendChild(tabsBody);

    return tabs;
  };
  const toggleNavStatus = (tabs, status) => {
    const tabsNav = tabs.querySelector('.tabsNav');

    if (status === 'enable') {
      tabsNav.classList.remove('disabled');
    } else {
      tabsNav.classList.add('disabled');
    }
  };

  return {
    build,
    toggleNavStatus,
  };
})();
