const covidChecklistActions = (function () {
  function loadChecklist(id, completedChecklists, inputs) {
    inputs.timeInput.firstChild.value = completedChecklists[id].time;
    inputs.locationDropdown.firstChild.value = completedChecklists[id].locationId;
    inputs.settingInput.firstChild.value = completedChecklists[id].setting;
    inputs.otherInput.firstChild.value = completedChecklists[id].other;
    inputs.settingInput.firstChild.dispatchEvent(new Event('keyup'));
    inputs.otherInput.firstChild.dispatchEvent(new Event('keyup'));


    //symptoms
    //cough
    completedChecklists[id].cough === "Y"
      ? document.getElementById("cough-yes").checked = true
      : document.getElementById("cough-no").checked = true;
    //diarrhea
    completedChecklists[id].diarrhea === "Y"
      ? document.getElementById("diarrhea-yes").checked = true
      : document.getElementById("diarrhea-no").checked = true;
    //fever
    completedChecklists[id].fever === "Y"
      ? document.getElementById("fever-yes").checked = true
      : document.getElementById("fever-no").checked = true;
    //malaise
    completedChecklists[id].malaise === "Y"
      ? document.getElementById("malaise-yes").checked = true
      : document.getElementById("malaise-no").checked = true;
    //nasalCong
    completedChecklists[id].nasalCong === "Y"
      ? document.getElementById("nasal_congestion-yes").checked = true
      : document.getElementById("nasal_congestion-no").checked = true;
    //nausea
    completedChecklists[id].nausea === "Y"
      ? document.getElementById("nausea-yes").checked = true
      : document.getElementById("nausea-no").checked = true;
    //shortnessBreath
    completedChecklists[id].shortnessBreath === "Y"
      ? document.getElementById("shortness_of_breath-yes").checked = true
      : document.getElementById("shortness_of_breath-no").checked = true;
    //soreThroat
    completedChecklists[id].soreThroat === "Y"
      ? document.getElementById("sore_throat-yes").checked = true
      : document.getElementById("sore_throat-no").checked = true;
    //tasteAndSmell
    completedChecklists[id].tasteAndSmell === "Y"
      ? document.getElementById("taste_and_smell-yes").checked = true
      : document.getElementById("taste_and_smell-no").checked = true;
  }
  
 async function insertUpdateChecklist(inputs, checklistId, peopleId, checklistType, callback) {
    const action = document.getElementById("covidSaveUpdate").getAttribute('data-function');
    const date = inputs.dateInput.firstChild.value;
    const time = inputs.timeInput.firstChild.value;
    const location = inputs.locationDropdown.firstChild.value;
    const setting = UTIL.removeUnsavableNoteText(inputs.settingInput.firstChild.value);
    const other = UTIL.removeUnsavableNoteText(inputs.otherInput.firstChild.value);

    const cough = document.getElementById("cough-yes").checked ? "Y":"N";
    const diarrhea = document.getElementById("diarrhea-yes").checked ? "Y":"N";
    const fever = document.getElementById("fever-yes").checked ? "Y":"N";
    const malaise = document.getElementById("malaise-yes").checked ? "Y":"N";
    const nasalCong = document.getElementById("nasal_congestion-yes").checked ? "Y":"N";
    const nausea = document.getElementById("nausea-yes").checked ? "Y":"N";
    const shortnessBreath = document.getElementById("shortness_of_breath-yes").checked ? "Y":"N";
    const soreThroat = document.getElementById("sore_throat-yes").checked ? "Y":"N";
    const tasteAndSmell = document.getElementById("taste_and_smell-yes").checked ? "Y":"N";
    const data = {
      token: $.session.Token,
      assesmentDate: date,
      assessmentTime: time,
      cough: cough,
      diarrhea: diarrhea,
      fever: fever,
      locationId: location,
      malaise: malaise,
      nasalCong: nasalCong,
      nausea: nausea,
      tasteAndSmell: tasteAndSmell,
      notes: other,
      peopleId: peopleId,
      settingType: setting,
      shortnessBreath: shortnessBreath,
      soreThroat: soreThroat,
      assessmentId: checklistId,
      isConsumer: checklistType === 'consumer' ? 'T' : 'F'
    }
    pendingSave.show('Saving Checklist...')
    switch (action) {
      case "insert":
        try {
          data.assessmentId = '0'
          await covidAjax.insertUpdateCovidChecklists(data);
          pendingSave.fulfill("Saved")
          setTimeout(() => {
            successfulSave.hide()
            if (callback) callback()
          }, 1000)
        } catch (err) {
          pendingSave.reject('Error Saving Checklist. Please Try Again.')
          setTimeout(() => failSave.hide(), 2000)
        }
        break;
      case "update":
        try {
          await covidAjax.insertUpdateCovidChecklists(data);
          pendingSave.fulfill("Saved")
          setTimeout(() => {
            successfulSave.hide()
            if (callback) callback()
          }, 1000)
        } catch (err) {
          pendingSave.reject('Error Updating Checklist. Please Try Again.')
          setTimeout(() => failSave.hide(), 2000)
        }
        break;
      default:
        break;
    }
  }

  function clearChecklist(inputs) {
    inputs.dateInput.firstChild.value = UTIL.getTodaysDate(false)
    inputs.dateInput.dispatchEvent(new Event('input'))
    inputs.timeInput.firstChild.value = UTIL.getCurrentTime();
    // No longer re-setting location. Keep location from checklist to checklist
    // inputs.locationDropdown.firstChild.selectedIndex = "0";
    inputs.settingInput.firstChild.value = "";
    inputs.settingInput.firstChild.dispatchEvent(new Event('keyup'));
    inputs.otherInput.firstChild.value = "";
    inputs.otherInput.firstChild.dispatchEvent(new Event('keyup'));
    //symptoms
    document.getElementById("cough-no").checked = true;
    document.getElementById("diarrhea-no").checked = true;
    document.getElementById("fever-no").checked = true;
    document.getElementById("malaise-no").checked = true;
    document.getElementById("nasal_congestion-no").checked = true;
    document.getElementById("nausea-no").checked = true;
    document.getElementById("shortness_of_breath-no").checked = true;
    document.getElementById("sore_throat-no").checked = true;
    document.getElementById("taste_and_smell-no").checked = true;
  }

  function cancel() {
    DOM.scrollToTopOfPage();
    DOM.clearActionCenter();
    setActiveModuleSectionAttribute(null);
    covidLanding.init()
  }
  return {
    insertUpdateChecklist,
    loadChecklist,
    clearChecklist,
    cancel
  };
})();
