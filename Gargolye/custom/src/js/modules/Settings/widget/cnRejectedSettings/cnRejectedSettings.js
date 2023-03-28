//Widget ID = 3

const cnRejectedSettings = (function () {
  // Data
  let CN_REJECTED_SETTINGS;
  let showHide;
  // HTML
  let showHideCheckBox, daysBackInput, saveBtn;

  function getSettings() {
    let widgetSettings = dashboard.getWidgetSettings('3');
    showHide = widgetSettings.showHide;
    if (widgetSettings.widgetConfig === null) {
      CN_REJECTED_SETTINGS = {
        daysBack: 60,
      };
    } else {
      CN_REJECTED_SETTINGS = widgetSettings.widgetConfig;
    }
  }

  function buildCNRejectedSettings() {
    getSettings();

    const section = document.getElementById('CN_Rejected');
    section.classList.add('cnRejected');

    showHideCheckBox = input.buildCheckbox({
      text: 'Show',
      style: 'secondary',
      isChecked: showHide === 'Y' ? true : false,
    });
    showHideCheckBox.classList.add('settingsCheckBox');

    daysBackInput = input.build({
      id: 'cnRejectedDaysBack',
      label: 'Rejected Notes Days Back',
      type: 'number',
      style: 'secondary',
      value: CN_REJECTED_SETTINGS.daysBack,
      attributes: [
        { key: 'min', value: '1' },
        { key: 'max', value: '60' },
        {
          key: 'onkeypress',
          value: 'return event.charCode >= 48 && event.charCode <= 57',
        },
      ],
    });
    saveBtn = button.build({
      id: 'cnRejectedSave',
      text: 'Save',
      type: 'contained',
      style: 'secondary',
      classNames: ['widgetSettingsSaveBtn'],
      callback: setSettings,
    });

    if ($.session.CaseNotesView) section.appendChild(showHideCheckBox);
    section.appendChild(showHideCheckBox);
    section.appendChild(daysBackInput);

    section.appendChild(saveBtn);

    eventListeners();
  }

  async function setSettings() {
    getInputFieldValues();
    const configString = JSON.stringify(CN_REJECTED_SETTINGS);
    styleSaveBtnOnSave();
    await widgetSettingsAjax.setWidgetSettingConfig(3, configString, showHide);
    dashboard.refreshWidgetSettings();
  }

  function getInputFieldValues() {
    const newDaysBack = parseInt(daysBackInput.firstElementChild.value);

    if (newDaysBack >= 1 && newDaysBack <= 60) {
      CN_REJECTED_SETTINGS.daysBack = newDaysBack;
    }
  }

  function styleSaveBtnOnSave() {
    saveBtn.innerText = 'saved';
    saveBtn.classList.add('saved');
    setTimeout(() => {
      saveBtn.classList.remove('saved');
      saveBtn.innerText = 'save';
    }, 1600);
  }

  function eventListeners() {
    showHideCheckBox.addEventListener('change', event => {
      if (event.target.checked) {
        showHide = 'Y';
      } else showHide = 'N';
    });
  }

  return {
    buildCNRejectedSettings,
    buildWidgetBody,
  };
})();
