var authorizationLanding = (function () {
    function loadAuthorizationLanding() {
        let pasBtn = button.build({
            text: 'PAS',
            style: 'secondary',
            type: 'contained',
            callback: authorizations.init
        });

        let assessmentHistoryBtn = button.build({
            text: 'ASSESSMENT HISTORY',
            style: 'secondary',
            type: 'contained',
            callback: assessmentHistory.init
        });
        let vendorInfoBtn = button.build({
            text: 'VENDOR INFO',
            style: 'secondary',
            type: 'contained',
        });


        var btnWrap = document.createElement('div');
        btnWrap.classList.add('landingBtnWrap');
        btnWrap.appendChild(pasBtn);
        btnWrap.appendChild(assessmentHistoryBtn);
        btnWrap.appendChild(vendorInfoBtn);
        DOM.ACTIONCENTER.appendChild(btnWrap);
    }

    function init() {
        $.loadedApp = 'authorizations';
        setActiveModuleAttribute('authorizations');
        DOM.clearActionCenter();
        loadAuthorizationLanding();
    }

    return {
        load: init,
    }
})();