//Widget ID = 4

const wfPlanSettings = (function() {
  // Data
  let WF_PLAN_SETTINGS;
  let showHide;
  // HTML
  let showHideCheckBox, dueDateDropdown, saveBtn;

  //settings needed:
  // show hide - Y/N, default Y
  // due date - dropdown with values: today, next 7 days, next 30 days, prior 7 days, prior 30 days, default today

  function getSettings() {
    let widgetSettings = dashboard.getWidgetSettings('4')
    showHide = widgetSettings.showHide
    if (widgetSettings.widgetConfig === null) {
      WF_PLAN_SETTINGS = {
        dueDate: 'today',  
      };
    } else {
      WF_PLAN_SETTINGS = widgetSettings.widgetConfig
    }
  }


  function buildWfPlanSettings() {
    getSettings()

    const section = document.getElementById("WF_Plan");
    section.classList.add("wfPlan");

    showHideCheckBox = input.buildCheckbox({
      text: "Show",
      style: "secondary",
      isChecked: showHide === "Y" ? true : false
    });
    showHideCheckBox.classList.add('settingsCheckBox')        

    dueDateDropdown = dropdown.build({
      label: "Due Date",
      style: "secondary",
      dropdownId: "dueDateDropdown",
    });

    let data = [
      {id: 1, value: 'today', text: 'Today' }, 
      {id: 2, value: 'next 7 days', text: 'Next 7 Days' },
      {id: 3, value: 'next 30 days', text: 'Next 30 Days' },
      {id: 4, value: 'prior 7 days', text: 'Prior 7 Days' },
      {id: 5, value: 'prior 30 days', text: 'Prior 30 Days' }
    ]             
    dropdown.populate(dueDateDropdown, data, WF_PLAN_SETTINGS.dueDate);       
    
    saveBtn = button.build({
      id: 'wfPlanSave',
      text: "Save",
      type: "contained",
      style: "secondary",
      classNames: ['widgetSettingsSaveBtn'],
      callback: setSettings
    })

    if ($.session.CaseNotesView) section.appendChild(showHideCheckBox);
    section.appendChild(showHideCheckBox)
    section.appendChild(dueDateDropdown)

    section.appendChild(saveBtn)

    eventListeners()
  }

  async function setSettings() {
    const configString = JSON.stringify(WF_PLAN_SETTINGS);
    styleSaveBtnOnSave();
    await widgetSettingsAjax.setWidgetSettingConfig(4, configString, showHide);
    dashboard.refreshWidgetSettings();
  } 
   
  function styleSaveBtnOnSave() {
    saveBtn.innerText = 'saved'
    saveBtn.classList.add('saved')
    setTimeout(() => {
      saveBtn.classList.remove('saved')
      saveBtn.innerText = 'save'
    }, 1600)
  }

  function eventListeners() {
    showHideCheckBox.addEventListener("change", event => {
      if (event.target.checked) {
        showHide = "Y"
      } else showHide = "N"
    });

    dueDateDropdown.addEventListener("change", (e)=> {
       WF_PLAN_SETTINGS.dueDate = e.target.value;      
    });

    dueDateDropdown.addEventListener("click", (e)=> {
      e.stopPropagation();  // stop nav.js from handling the click event for this
   });
  }

  return { 
      buildWfPlanSettings,
  }
})()