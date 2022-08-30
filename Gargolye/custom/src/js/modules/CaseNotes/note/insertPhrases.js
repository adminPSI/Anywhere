const cnInsertPhrases = (function() {
  //DOM
  let phraseDropdown;
  let allPhraseCheckbox;
  let phraseNoteTextInput;
  let insertPhraseBtn;
  const fullPhraseDisplay = document.createElement("p");
  fullPhraseDisplay.classList.add("fullPhraseDisplay")
  //data
  let customPhrases = {};
  let selectedPhraseId;
  let currentNote;
  let cursorSelection;
  let showAllPhrases;

  let isSSANote;

  function show(note, SSANote = false) {
    isSSANote = SSANote;
    currentNote = note;
    cursorSelection = null;
    selectedPhraseId = null;
    fullPhraseDisplay.innerHTML = "";
    switch (cn_PhraseLS.get()) {
      case "true":
        showAllPhrases = true;
        break;
      case "false":
        showAllPhrases = false;
        break;
      default:
        showAllPhrases = false;
        break;
    }
    createPopup();
    getData(populateDropdown);
  }

  function getData(cb) {
    showAll = showAllPhrases === true ? "Y" : "N";
    const getPhrases = new Promise(function(resolve, reject) {
      caseNotesAjax.getCustomPhrases(showAll, res => {
        res.forEach(phrase => {
          let obj = { phrase: phrase.phrase, shortcut: phrase.phrase_shortcut };
          customPhrases[phrase.phrase_id] = obj;
        });
        resolve("Done");
      });
    });
    Promise.all([getPhrases]).then(function() {
      cb();
    });
  }

  function createPopup() {
    let phrasesPopup = POPUP.build({
      header: "Phrases",
      hideX: true,
      id: "phrasesPopup"
    });

    phraseDropdown = dropdown.build({
      label: "Phrases",
      dropdownId: "phraseDropdown"
    });

    phraseNoteTextInput = input.build({
      label: "Note",
      type: "textarea",
      style: "secondary",
      value: currentNote
    });

    insertPhraseBtn = button.build({
      id: "phraseInsertBtn",
      text: "insert",
      type: "contained",
      style: "secondary",
      callback: function() {
        insertPhrase();
      }
    });

    let doneBtn = button.build({
      id: "phraseDoneBtn",
      text: "done",
      type: "contained",
      style: "secondary",
      callback: function() {
        phraseDone();
      }
    });

    let cancelBtn = button.build({
      id: "phraseCancelBtn",
      text: "cancel",
      type: "outlined",
      style: "secondary",
      callback: function() {
        POPUP.hide(phrasesPopup);
      }
    });

    let allPhraseRadioDiv = document.createElement("div")
    allPhraseRadioDiv.classList.add("cn__phraseRadioDiv")
    allPhraseRadioDiv.innerHTML = `
    <div><input id="myPhraseRadio" type="radio" name="allPh" value="myPhrases"> My Phrases</div>
    <div><input id="allPhraseRadio" type="radio" name="allPh" value="allPhrases"> All Phrases</div>
    `

    let btnWrap = document.createElement("div");
    btnWrap.classList.add("btnWrap");
    btnWrap.appendChild(doneBtn);
    btnWrap.appendChild(cancelBtn);
    phrasesPopup.appendChild(allPhraseRadioDiv);
    phrasesPopup.appendChild(phraseDropdown);
    phrasesPopup.appendChild(fullPhraseDisplay);
    phrasesPopup.appendChild(insertPhraseBtn);
    phrasesPopup.appendChild(phraseNoteTextInput);
    phrasesPopup.appendChild(btnWrap);

    
    POPUP.show(phrasesPopup);
    addEventListeners();
    initialCheckRadio()
  }

  function initialCheckRadio() {
    let myPhraseRadio = document.getElementById("myPhraseRadio")
    let allPhraseRadio = document.getElementById("allPhraseRadio")
    if (showAllPhrases) {
      allPhraseRadio.checked = true;
    } else myPhraseRadio.checked = true;
  }

  function populateDropdown() {
    let data = Object.keys(customPhrases).map(key => {
      let fullPhrase = customPhrases[key].phrase;
      let trimedPhrase =
        fullPhrase.length > 35
          ? fullPhrase.slice(0, 35) + " . . ."
          : fullPhrase;
      return {
        value: key,
        text: `${customPhrases[key].shortcut} - ${trimedPhrase}`
      };
    });
    data.unshift({ value: "0", text: "" }); //ADD Blank value

    data.sort(function(a, b) {
      // alphabetize
      if (a.text < b.text) {
        return -1;
      }
      if (a.text > b.text) {
        return 1;
      }
      return 0;
    });
    dropdown.populate(phraseDropdown, data);
  }

  function addEventListeners() {
    phraseDropdown.addEventListener("change", event => {
      selectedPhraseId = event.target.options[event.target.selectedIndex].value;
      fullPhraseDisplay.innerHTML =
        selectedPhraseId === "0" ? "" : customPhrases[selectedPhraseId].phrase;
    });
    phraseNoteTextInput.addEventListener("mouseup", event => {
      cursorSelection = {
        start: event.target.selectionStart,
        end: event.target.selectionEnd
      };
    });
    phraseNoteTextInput.addEventListener("keyup", event => {
      currentNote = event.target.value;
      cursorSelection = {
        start: event.target.selectionStart,
        end: event.target.selectionEnd
      };
    });

    let myPhraseRadio = document.getElementById("myPhraseRadio")
    myPhraseRadio.addEventListener("change", event => {
      showAllPhrases = false;
      cn_PhraseLS.set(showAllPhrases)
      customPhrases = {};
      selectedPhraseId = null;
      fullPhraseDisplay.innerHTML = "";
      getData(populateDropdown);
    })
    let allPhraseRadio = document.getElementById("allPhraseRadio")
    allPhraseRadio.addEventListener("change", event => {
      showAllPhrases = true;
      cn_PhraseLS.set(showAllPhrases)
      customPhrases = {};
      selectedPhraseId = null;
      fullPhraseDisplay.innerHTML = "";
      getData(populateDropdown);
    })
  }

  function insertPhrase() {
    if (selectedPhraseId === "0") return;
    let insertPoint = [];
    if (cursorSelection === null) {
      insertPoint = [currentNote.length, currentNote.length];
    } else {
      insertPoint = [cursorSelection.start, cursorSelection.end];
    }
    let noteStart = currentNote.substr(0, insertPoint[0]).trim();
    let noteInsert = customPhrases[selectedPhraseId].phrase.trim();
    let noteEnd = currentNote.substr(insertPoint[1]).trim();

    currentNote = `${noteStart} ${noteInsert} ${noteEnd}`.trim();
    phraseNoteTextInput.querySelector(
      ".input-field__input"
    ).value = currentNote;
  }

  function phraseDone() {
    currentNote = phraseNoteTextInput.querySelector(".input-field__input")
      .value;
    POPUP.hide(phrasesPopup);
    let cnNoteField = document.getElementById("noteTextField");
    cnNoteField.value = currentNote;

    (isSSANote) ? noteSSA.cnPhrasesDone(currentNote) : note.cnPhrasesDone(currentNote)
  }

  const cn_PhraseLS = (function() {
    function get() {
      let user = $.session.UserId
      return localStorage.getItem(`user:${user} cn_showAllPhrases`)
    }
    function set(showAll) {
      let user = $.session.UserId
      localStorage.setItem(`user:${user} cn_showAllPhrases`, showAll)
    }
    return {
      get: get,
      set: set
    }
  })()

  return {
    show,
    phraseDone
  };
})();
