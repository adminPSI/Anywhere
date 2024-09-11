var ACTION_NAV = (function () {
    var nav;
    // Private
    function setColumns(count) {
        switch (count) {
            case 1: {
                nav.classList.remove('twoCol');
                nav.classList.remove('threeCol');
                break;
            }
            case 2: {
                nav.classList.add('twoCol');
                nav.classList.remove('oneCol');
                nav.classList.remove('threeCol');
                break;
            }
            case 3: {
                nav.classList.add('threeCol');
                nav.classList.remove('oneCol');
                nav.classList.remove('twoCol');
                break;
            }
        }
    }

    // Public
    function hide() {
        nav.classList.remove('visible');
    }
    function show() {
        nav.classList.add('visible');
    }
    function clear() {
        nav.innerHTML = '';
    }
    function populate(elements) {
        clear();
        setColumns(elements.length);

        elements.forEach(ele => {
            nav.appendChild(ele);
        });

        show();
    }

    // Action Nav Brains
    async function handleNavEvents(event) {
        var target = event.target;

        if (!target.dataset.actionNav) return;

        var activeModule = actioncenter.dataset.activeModule;
        var activeSection = actioncenter.dataset.activeSection;

        switch (activeModule) {
            case 'home': {
                break;
            }
            case 'casenotes': {
                if (activeSection === 'caseNotes-new') {
                    newNote.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                if (activeSection === 'caseNotesSSA-new') {
                    newNoteSSA.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                if (activeSection === 'caseNotes-review') {
                    reviewNote.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'dayservices': {
                if (activeSection === 'dayServices') {
                    dayServices.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'outcomes': {
                if (activeSection === 'outcomes-review') {
                    outcomesReview.handleActionNavEvent(target);
                } else {
                    outcomes.handleActionNavEvent(target);
                }
                
                clear();
                hide();
                break;
            }
            case 'incidenttracking': {
                if (activeSection === 'incidentTracking-new') {
                    newIncident.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'roster': {
                if (activeSection === 'roster-absent') {
                    rosterAbsent.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                else if (activeSection === 'roster-GroupIndividuals') {
                    rosterGroupIndividuals.handleActionNavEvent(target);
                    clear();
                    hide();
                } else {
                    roster.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'schedule': {
                break;
            }
            case 'timeEntry': {
                if (activeSection === 'timeEntry-new') {
                    timeEntryCard.handleActionNavEvent(target, true);
                    clear();
                    hide();
                }
                if (activeSection === 'timeEntry-edit') {
                    timeEntryCard.handleActionNavEvent(target, false);
                    clear();
                    hide();
                }
                if (activeSection === 'timeEntry-review') {
                    timeEntryReview.handleActionNavEvent(target);
                }
                if (activeSection === 'timeEntry-approval') {
                    timeApproval.handleActionNavEvent(target);
                }
                break;
            }
            case 'workshop': {
                if (activeSection === 'workshop') {
                    workshop.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'authorizations': {
                if (activeSection === 'assessmentHistory') {
                    await assessmentHistory.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                if (activeSection === 'authorizations') {
                    await authorizations.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'plan': {
                await plan.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
            case 'covid': {
                covidChecklist.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
            case 'transportation': {
                if (activeSection === 'routeDocumentation') {
                    TRANS_routeDocumentation.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                if (activeSection === 'editRoute') {
                    TRANS_manageEditRoute.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                if (activeSection === 'addroute') {
                    TRANS_addRoute.handleActionNavEvent(target);
                    clear();
                    hide();
                }
                break;
            }
            case 'forms': {
                forms.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
            case 'OOD': {
                OOD.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
            case 'resetPassword': {
                resetPassword.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
            case 'ConsumerFinances': {
                ConsumerFinances.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }                
            case 'CFEditAccount': {
                CFEditAccount.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
            case 'Employment': {
                Employment.handleActionNavEvent(target);
                clear();
                hide();
                break;
            }
        }

        var miniRosterBtn = document.querySelector('.consumerListBtn');
        if (miniRosterBtn && activeSection !== 'caseNotes-new') {
            miniRosterBtn.classList.remove('disabled');
        }
    }

    function init() {
        nav = document.querySelector('.action__nav');

        nav.addEventListener('click', handleNavEvents);
    }

    return {
        clear,
        hide,
        show,
        populate,
        init,
    };
})();
