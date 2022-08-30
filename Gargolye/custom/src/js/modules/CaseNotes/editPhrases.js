const cnEditPhrases = (function() {
  //DOM
  let cardBody;
  let shortcutInput;
  let phraseInput;
  let pubCheckbox;
  let saveBtn;

  function buildCard() {
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card__header");
    cardHeader.innerHTML = "Edit My Phrases";

    cardBody = document.createElement("div");
    cardBody.classList.add("card__body");

    let card = document.createElement("div");
    card.classList.add("card", "editPhrases");

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    DOM.ACTIONCENTER.appendChild(card);
  }

  function buildInputs() {
    shortcutInput = input.build({
      label: "Shortcut",
      style: "secondary",
      charLimit: 10
    });
    phraseInput = input.build({
      label: "Phrase",
      type: "textarea",
      style: "secondary"
    });
    pubCheckbox = input.buildCheckbox({
      text: "Publicly Available"
    });
    saveBtn = button.build({
      id: "phraseEditSaveBtn",
      text: "Save",
      type: "contained",
      style: "secondary",
      callback: savePhrase
    });
    saveBtn.classList.add("disabled")

    let cancelBtn = button.build({
      id: "phraseEditCancelBtn",
      text: "cancel",
      type: "outlined",
      style: "secondary",
      callback: caseNotes.load
    });

    shortcutInput.classList.add("error")
    phraseInput.classList.add("error")

    let btnWrap = document.createElement("div");
    btnWrap.classList.add("btnWrap");
    btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);


    cardBody.appendChild(shortcutInput);
    cardBody.appendChild(phraseInput);
    cardBody.appendChild(pubCheckbox);
    cardBody.appendChild(btnWrap);
    eventListeners()
  }

  function eventListeners() {
    shortcutInput.addEventListener("keyup", event => {
      if (event.target.value.length > 10 || event.target.value.length === 0) {
        shortcutInput.classList.add("error")
      } else shortcutInput.classList.remove("error")
      checkForError()
    })
    shortcutInput.addEventListener("paste", event => {
      if ((event.target.value.length + event.clipboardData.getData("text/plain").length) > 10){
        shortcutInput.classList.add("error")
      } else shortcutInput.classList.remove("error")
      checkForError()
    })
    phraseInput.addEventListener("keyup", event => {
      if (event.target.value.length === 0) {
        phraseInput.classList.add("error")
      } else phraseInput.classList.remove("error")
      checkForError()
    })
  }

  function checkForError() {
    errors = document.querySelectorAll(".error");
    if (errors.length !== 0) {
      saveBtn.classList.add("disabled")
    } else saveBtn.classList.remove("disabled")
  }

  function savePhrase() {
    pendingSave.show("Saving Phrase...")
    
    shortcut = UTIL.removeUnsavableNoteText(shortcutInput.querySelector(".input-field__input").value)
    phrase = UTIL.removeUnsavableNoteText(phraseInput.querySelector(".input-field__input").value)
    makePublic = pubCheckbox.getElementsByTagName("input")[0].checked ? "Y" : "N";

    caseNotesAjax.insertCustomPhrases(shortcut, phrase, makePublic, res => {
      pendingSave.fulfill();
      setTimeout(function() {
        successfulSave.hide();
        caseNotes.load()          
      }, 1000);
    })
  }

  function init() {
    DOM.clearActionCenter();
    buildCard();
    buildInputs();
  }

  return {
    init
  };
})();
