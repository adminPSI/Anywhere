const cnProductivitySettings = (function() {
  //DATA
  let CN_PRODUCTIVITY_SETTINGS = {};
  let showHide
  //HTML ELEMENTS
  let showHideCheckBox;
  let daysBackInput;
  let productivityThresholdPercentage;
  let workHoursPerDay;
  let saveBtn;

  function getSettings() {
    let widgetSettings = dashboard.getWidgetSettings('1')
    showHide = widgetSettings.showHide
    if (widgetSettings.widgetConfig === null) {
      CN_PRODUCTIVITY_SETTINGS = {
        productivityThreshold: 60,
        daysBack: 7,
        workHoursPerDay: 7
      };
    } else {
      CN_PRODUCTIVITY_SETTINGS = widgetSettings.widgetConfig
    }
  }

  async function setSettings() {
    getInputFieldValues()
    const configString = JSON.stringify(CN_PRODUCTIVITY_SETTINGS);
    styleSaveBtnOnSave();
    await widgetSettingsAjax.setWidgetSettingConfig(1, configString, showHide);
    dashboard.refreshWidgetSettings();
  }

  function getInputFieldValues() {
    const newDaysBack = parseInt(daysBackInput.firstElementChild.value);
    const newProductivity = parseInt(productivityThresholdPercentage.firstElementChild.value);
    const newWorkHours = parseFloat(workHoursPerDay.firstElementChild.value);
    if (newDaysBack >= 1 && newDaysBack <= 14) {
      CN_PRODUCTIVITY_SETTINGS.daysBack = newDaysBack
    }
    if (newProductivity >= 0 && newProductivity <= 100) {
      CN_PRODUCTIVITY_SETTINGS.productivityThreshold = newProductivity
    }
    if (newWorkHours >= 0.1 && newWorkHours <= 24) {
      CN_PRODUCTIVITY_SETTINGS.workHoursPerDay = newWorkHours
    }
  }

  function styleSaveBtnOnSave() {
    saveBtn.innerText = 'saved'
    saveBtn.classList.add('saved')
    setTimeout(() => {
      saveBtn.classList.remove('saved')
      saveBtn.innerText = 'save'
    }, 1600)
  }

  function buildCNProductivity() {
    getSettings()

    const section = document.getElementById("CN_Productivity");
    section.classList.add("cnProductivity");
    const group1 = document.createElement("div");
    group1.classList.add("group1");
    const group2 = document.createElement("div");
    group2.classList.add("group2");
    const percentSymb = document.createElement("p");
    percentSymb.innerText = "%";
    percentSymb.style.color = "black";
    percentSymb.style.position = "absolute";
    percentSymb.style.marginLeft = "252px";
    percentSymb.style.marginTop = "-99px";

    showHideCheckBox = input.buildCheckbox({
      text: "Show",
      className: "showHide",
      style: "secondary",
      isChecked: showHide === "Y" ? true : false
    });
    daysBackInput = input.build({
      id: "cnProductivityDaysBack",
      label: "Days Back",
      type: "number",
      style: "secondary",
      value: CN_PRODUCTIVITY_SETTINGS.daysBack,
      attributes: [
        { key: "min", value: "1" },
        { key: "max", value: "14" },
        {
          key: "onkeypress",
          value: "return event.charCode >= 48 && event.charCode <= 57"
        }
      ]
    });
    productivityThresholdPercentage = input.build({
      id: "productivityThresholdPercentage",
      label: "Productivity Threshold",
      type: "number",
      style: "secondary",
      value: CN_PRODUCTIVITY_SETTINGS.productivityThreshold,
      attributes: [
        { key: "min", value: "0" },
        { key: "max", value: "100" },
        {
          key: "onkeypress",
          value: "return event.charCode >= 48 && event.charCode <= 57"
        }
      ]
    });
    workHoursPerDay = input.build({
      id: "cnProductivityWorkHoursPerDay",
      label: "Work Hours/Day",
      type: "number",
      style: "secondary",
      value: CN_PRODUCTIVITY_SETTINGS.workHoursPerDay,
      attributes: [
        { key: "min", value: "1" },
        { key: "max", value: "24" }
      ]
    });
    saveBtn = button.build({
      id: 'cnProductivitySave',
      text: "Save",
      type: "contained",
      style: "secondary",
      classNames: ['widgetSettingsSaveBtn'],
      callback: setSettings
    })

    // display min a max of each input?

    if ($.session.CaseNotesView) section.appendChild(showHideCheckBox);
    group1.appendChild(daysBackInput);
    group1.appendChild(workHoursPerDay);
    group2.appendChild(productivityThresholdPercentage);
    section.appendChild(group1);
    section.appendChild(group2);
    section.appendChild(saveBtn);
    section.appendChild(percentSymb);

    eventListeners();
  }

  function eventListeners() {
    showHideCheckBox.addEventListener("change", event => {
      if (event.target.checked) {
        showHide = "Y"
      } else showHide = "N"
    });
  }

  return {
    buildCNProductivity,
    setSettings
  };
})();
