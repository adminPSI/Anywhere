const covidLanding = (function() {
  let rosterLocations

  function loadCovidLanding(params) {
    const myChecklist = button.build({
      text: "My Covid Checklist",
      style: "secondary",
      type: 'contained',
      callback: () => {
        covidChecklist.init('employee')
        
      }
    });
    const consumerChecklists = button.build({
      text: "Consumer Covid Checklist",
      style: "secondary",
      type: 'contained',
      callback: () => {
        covidChecklist.init('consumer')
      }
    });

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('landingBtnWrap');
    btnWrap.appendChild(myChecklist);
    btnWrap.appendChild(consumerChecklists);
    DOM.ACTIONCENTER.appendChild(btnWrap);
  }

  function locations() {
    return [...rosterLocations]
  }

  async function init() {
    setActiveModuleSectionAttribute(null)
    if (!rosterLocations) {
      PROGRESS.init()
      PROGRESS.SPINNER.show('Gathering Data...')
      rosterLocations = (await rosterAjax.getRosterLocations()).getLocationsJSONResult;  
      const spinner = document.querySelector('.spinner');
      spinner.remove();
    }
    const miniRosterBtn = document.querySelector('.consumerListBtn');
    if (miniRosterBtn) {
      miniRosterBtn.remove();
      DOM.toggleNavLayout();
    }
    loadCovidLanding()
  }
  return {
    init,
    locations
  }
})();