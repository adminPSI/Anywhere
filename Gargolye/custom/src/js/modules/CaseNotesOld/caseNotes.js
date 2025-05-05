//test df
var caseNotes = (function () {
    let cnPhrases;
    function loadCaseNotesLanding() {
        let newBtn = button.build({
            text: 'New Note',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                note.init('new');
            },
        });
        let newSSABtn = button.build({
            text: 'New SSA Note',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                noteSSA.init('new');
            },
        });//test

        let overviewBtn = button.build({
            text: 'Review Notes',
            style: 'secondary',
            type: 'contained',
            callback: notesOverview.init,
        });
        let editPhrasesBtn = button.build({
            text: 'Edit My Phrases',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                _DOM.ACTIONCENTER.setAttribute('data-UI', true);
                _DOM.setActiveModuleAttribute('casenotes2.0');
                cnPhrases = new CaseNotesPhrases();
                cnPhrases.renderTo(_DOM.ACTIONCENTER);
                await cnPhrases.InsertPhrases.fetchData();
                cnPhrases.InsertPhrases.populate();
                cnPhrases.InsertPhrases.show();
                cnPhrases.InsertPhrases.onPhraseSelect();   

                // below code for when user click outside of popup , popup will closed and change module new caseload to old caseload
                document.addEventListener('click', function (event) {
                    const dialog = document.getElementsByClassName('insertPhrases');
                    if (dialog != null && dialog[0] != undefined && dialog[0].className === event.target.className) {
                        _DOM.ACTIONCENTER.removeAttribute('data-ui');                       
                        setActiveModuleAttribute('casenotes');
                        DOM.clearActionCenter();
                        caseNotes.load();  
                    } 
                });

            },
        });
        let tryNewCaseNotes = button.build({
            text: 'NEW! Case Note Entry',
            style: 'secondary',
            type: 'contained',
            callback: CaseNotes.init,
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('landingBtnWrap');
        btnWrap.appendChild(tryNewCaseNotes);
        if ($.session.CaseNotesUpdate && $.session.CaseNotesSSANotes) btnWrap.appendChild(newSSABtn);
        if ($.session.CaseNotesUpdate) btnWrap.appendChild(newBtn);
        btnWrap.appendChild(overviewBtn);
        btnWrap.appendChild(editPhrasesBtn);
        DOM.ACTIONCENTER.appendChild(btnWrap);
    }

    function init() {
        DOM.clearActionCenter();
        //PERMISSION// caseNotesUpdate === false means they have view only permisison
        //Can't create new notes or update/delete notes. -- Skip the landing, and just load the overview page
        if (!$.session.CaseNotesUpdate) {
            notesOverview.init();
            return;
        }
        loadCaseNotesLanding();
    }

    return {
        load: init,
    };
})();
