//TEST FOR JOE

const covidChecklistElements = (function() {

  function createInputs() {
    const dateInput = input.build({
      id: "covidDate",
      label: "Date",
      type: "date",
      style: "secondary",
      value: UTIL.getTodaysDate()
    })
    const timeInput = input.build({
      id: "covidTime",
      label: "Time",
      type: "time",
      style: "secondary",
      value: UTIL.getCurrentTime()
    })
    //*Location drop down - include the locations the user has access to in the Roster 
    const locationDropdown = dropdown.build({
      dropdownId: "covidLocationDropdown",
      label: "Location",
    })
    const settingInput = input.build({
      id: "covidSetting",
      label: "Setting",
      style: "secondary",
      charLimit: 50
    })
    const otherInput = input.build({
      id: "covidOtherSymptom",
      label: "Other",
      type: 'textarea',
      style: "secondary",
      charLimit: 50
    })
    const saveBtn = button.build({
      id: "covidSaveUpdate",
      attributes: [{key: 'data-function', value: 'insert'}],
      text: "Save",
      style: "secondary",
      type: "contained"
    })
    const deleteBtn = button.build({
      id: "covidDeleteChecklist",
      text: "Delete",
      style: "secondary",
      type: "contained"
    })
    const cancelBtn = button.build({
      id: "covidCancel",
      text: "Cancel",
      style: "secondary",
      type: "outlined",
    })
    // Symptom Y/N questions radios
    const symptoms = [
      "fever",
      "cough",
      "sore_throat",
      "shortness_of_breath",
      "malaise",
      "nasal_congestion",
      "nausea",
      "diarrhea",
      "taste_and_smell"
    ]
// need to create a div with the symptom name, and 2 radio buttons one for yes one for no
    const symptomElements = symptoms.map(symptom => {
      let capSymptomNameArr = [];
      const readableSymptomNameBaseArr = symptom.split("_");
      readableSymptomNameBaseArr.forEach(word => {
        const capWord = UTIL.capitalize(word)
        capSymptomNameArr.push(capWord)
      });
      let readableName = capSymptomNameArr.join(" ");
      const yesRadio = input.buildRadio({
        id: `${symptom}-yes`,
        text: "Yes",
        name: symptom,
        
      })
      const noRadio = input.buildRadio({
        id: `${symptom}-no`,
        text: "No",
        name: symptom,
        isChecked: true,
      })
      const symptomTitle = document.createElement('h4');
      if (readableName === 'Fever') {
        readableName = 'Fever > 100&#176F'
      }
      if (readableName === 'Taste And Smell') {
        readableName = 'Loss of Taste and Smell'
      }
      symptomTitle.innerHTML = readableName;
      const symptomContainer = document.createElement('div');
      const radioDiv = document.createElement('div')
      radioDiv.classList.add('covid_radioDiv')
      radioDiv.appendChild(yesRadio)
      radioDiv.appendChild(noRadio)
      symptomContainer.appendChild(symptomTitle)
      symptomContainer.appendChild(radioDiv)

      return symptomContainer
    })

    return {
      dateInput,
      timeInput,
      locationDropdown,
      settingInput,
      otherInput,
      symptomElements,
      saveBtn,
      cancelBtn,
      deleteBtn
    }
  }
  function init() {
    const inputs = createInputs()
    return inputs
  }
  return {
    init
  }
})();