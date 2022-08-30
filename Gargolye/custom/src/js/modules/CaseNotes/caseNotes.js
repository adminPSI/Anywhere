var caseNotes = (function() {  
  function loadCaseNotesLanding() {
    let newBtn = button.build({
      text: 'New Note',
      style: 'secondary',
      type: 'contained',
      callback: function() {
        note.init('new');
      }
    });
    let newSSABtn = button.build({
      text: 'New SSA Note',
      style: 'secondary',
      type: 'contained',
      callback: function() {
        noteSSA.init('new');
      }
    });

    let overviewBtn = button.build({
      text: 'Review Notes',
      style: 'secondary',
      type: 'contained',
      callback: notesOverview.init
    });
    let editPhrasesBtn = button.build({
      text: 'Edit My Phrases',
      style: 'secondary',
      type: 'contained',
      callback: cnEditPhrases.init
      });//
      //

    var btnWrap = document.createElement('div');//
    btnWrap.classList.add('landingBtnWrap');
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
    if(!$.session.CaseNotesUpdate) {
      notesOverview.init();
      return;
    }
    loadCaseNotesLanding();
  }

  return {
    load: init
  }
})();