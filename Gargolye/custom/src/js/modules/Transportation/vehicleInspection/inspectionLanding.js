const TRANS_vehicleInspectionLanding = (function() {

    function loadVehicleInspectionLanding(params) {
      const backButton = button.build({
        id: "inspectionLandingBackButton",
        text: "Back",
        style: "secondary",
        type: "text",
        icon: "arrowBack",
        callback: () => TRANS_mainLanding.init()
      });
      const newInspectionBtn = button.build({
        text: 'COMPLETE AN INSPECTION',
        style: 'secondary',
        type: 'contained',
        callback: () => TRANS_vehicleInspection.init({enterPath: 'inspectionLanding'})
      })
      const reviewInspectionsBtn = button.build({
        text: 'REVIEW INSPECTIONS',
        style: 'secondary',
        type: 'contained',
        callback: () => TRANS_inspectionReview.init()
      })
      const btnWrap = document.createElement('div');
      btnWrap.classList.add('landingBtnWrap');
      if ($.session.transportationUpdate === true) btnWrap.appendChild(newInspectionBtn);
      btnWrap.appendChild(reviewInspectionsBtn);
      DOM.ACTIONCENTER.appendChild(backButton);
      DOM.ACTIONCENTER.appendChild(btnWrap);
    }

  
    function init() {
      setActiveModuleSectionAttribute(null);
      DOM.scrollToTopOfPage();
      DOM.clearActionCenter();
      const miniRosterBtn = document.querySelector('.consumerListBtn');
      if (miniRosterBtn) {
        miniRosterBtn.remove();
        DOM.toggleNavLayout();
      }
      loadVehicleInspectionLanding()
    }

    return {
      init,
    }
  })();