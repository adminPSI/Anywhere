const widgetSettings = (function() {
  //order in sections[] determines display order
  const sections = [
    {
      heading: "Case Note Productivity",
      id: 'CN_Productivity',
      application: 'Gatekeeper'
    },
    {
      heading: "My Case Load",
      id: 'CN_CaseLoad',
      application: 'Gatekeeper'
    },
    {
      heading: "Plan To-Do List",
      id: 'WF_Plan',
      application: 'Gatekeeper'
    },
    {
      heading: "Rejected Case Notes",
      id: 'CN_Rejected',
      application: 'Gatekeeper'
    },
    
  ];

  function buildWidgetSection(section) {
    const settingSection = document.createElement("div");
    const settingSectionHeader = document.createElement("h3");
    settingSection.classList.add("settingMenuCard");
    settingSectionHeader.classList.add("header");
    settingSectionHeader.innerText = section.heading;
    settingSection.id = section.id
    settingSection.appendChild(settingSectionHeader);
    return settingSection
  }

  function buildPage() {
    const widgetSettingsPage = document.querySelector(
      ".util-menu__widgetSettings"
    );
    widgetSettingsPage.innerHTML = "";

    const currMenu = document.createElement("p");
    currMenu.innerText = "Widget Settings";
    currMenu.classList.add("menuTopDisplay");

    const backButton = button.build({
      text: "Back",
      icon: "arrowBack",
      type: "text",
      attributes: [{ key: "data-action", value: "back" }]
    });

    widgetSettingsPage.appendChild(currMenu);
    widgetSettingsPage.appendChild(backButton);
    // Create each setting section outline. 
    sections.forEach(section => {
      if (section.application === $.session.applicationName || section.application === 'All') {
        const sectionSection = buildWidgetSection(section)
        widgetSettingsPage.appendChild(sectionSection)  
      }
    });

    //Populate each section with specific inputs/data
    if ($.session.applicationName === 'Gatekeeper') cnProductivitySettings.buildCNProductivity();
    if ($.session.applicationName === 'Gatekeeper') cnCaseLoadSettings.buildCNCaseLoadSettings();
    if ($.session.applicationName === 'Gatekeeper') wfPlanSettings.buildWfPlanSettings();
    if ($.session.applicationName === 'Gatekeeper') cnRejectedSettings.buildCNRejectedSettings();
  }

  function init() {
    buildPage();
  }
  return {
    init
  };
})();
