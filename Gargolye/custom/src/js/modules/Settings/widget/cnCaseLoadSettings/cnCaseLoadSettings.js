//Widget ID = 2

const cnCaseLoadSettings = (function () {
  // Data
  let CN_CASELOAD_SETTINGS;
  let showHide;
  // HTML
  let showHideCheckBox,
    viewNotesEnteredByOtherUsersCheckBox,
    lastNoteDaysBackInput,
    reviewNotesDaysBackInput,
    saveBtn;

  //settings needed:
  // show hide - Y/N, default Y
  // view notes days back - min 1, max 60, default 30
  // last note entered days back - min 1, max 60, default 30
  // view notes entered by other users (permisison based) - Y/N, default N, forced N for case notes view entered === true

  function getSettings() {
    let widgetSettings = dashboard.getWidgetSettings('2');
    showHide = widgetSettings.showHide;
    if (widgetSettings.widgetConfig === null) {
      CN_CASELOAD_SETTINGS = {
        viewNotesDaysBack: 30,
        lastNoteEnteredDaysBack: 30,
        viewEnteredByOtherUsers: 'N',
      };
    } else {
      CN_CASELOAD_SETTINGS = widgetSettings.widgetConfig;
    }
  }

  function buildCNCaseLoadSettings() {
    getSettings();

    const section = document.getElementById('CN_CaseLoad');
    section.classList.add('cnCaseLoad');

    showHideCheckBox = input.buildCheckbox({
      text: 'Show',
      style: 'secondary',
      isChecked: showHide === 'Y' ? true : false,
    });
    showHideCheckBox.classList.add('settingsCheckBox');

    viewNotesEnteredByOtherUsersCheckBox = input.buildCheckbox({
      text: 'View Notes Entered by Other Users',
      style: 'secondary',
      isChecked: CN_CASELOAD_SETTINGS.viewEnteredByOtherUsers === 'Y' ? true : false,
    });
    viewNotesEnteredByOtherUsersCheckBox.classList.add('settingsCheckBox');
    lastNoteDaysBackInput = input.build({
      id: 'cnCaseLoadLastNoteDaysBack',
      label: 'Last Note Entered Days Back',
      type: 'number',
      style: 'secondary',
      value: CN_CASELOAD_SETTINGS.lastNoteEnteredDaysBack,
      attributes: [
        { key: 'min', value: '1' },
        { key: 'max', value: '60' },
        {
          key: 'onkeypress',
          value: 'return event.charCode >= 48 && event.charCode <= 57',
        },
      ],
    });
    reviewNotesDaysBackInput = input.build({
      id: 'cnCaseLoadLastNoteDaysBack',
      label: 'Review Notes Days Back',
      type: 'number',
      style: 'secondary',
      value: CN_CASELOAD_SETTINGS.viewNotesDaysBack,
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
      id: 'cnCaseLoadSave',
      text: 'Save',
      type: 'contained',
      style: 'secondary',
      classNames: ['widgetSettingsSaveBtn'],
      callback: setSettings,
    });

    if ($.session.CaseNotesView) section.appendChild(showHideCheckBox);
    section.appendChild(showHideCheckBox);
    section.appendChild(lastNoteDaysBackInput);
    section.appendChild(reviewNotesDaysBackInput);
    if ($.session.CaseNotesViewEntered) {
      section.appendChild(viewNotesEnteredByOtherUsersCheckBox);
    } else {
      CN_CASELOAD_SETTINGS.viewEnteredByOtherUsers = 'N';
    }
    section.appendChild(saveBtn);

    eventListeners();
  }

  async function setSettings() {
    getInputFieldValues();
    const configString = JSON.stringify(CN_CASELOAD_SETTINGS);
    styleSaveBtnOnSave();
    await widgetSettingsAjax.setWidgetSettingConfig(2, configString, showHide);
    dashboard.refreshWidgetSettings();
  }

  function getInputFieldValues() {
    const newViewNotesDaysBack = parseInt(reviewNotesDaysBackInput.firstElementChild.value);
    const newLastNoteEnteredDaysBack = parseInt(lastNoteDaysBackInput.firstElementChild.value);
    let newViewEnteredByOthers = 'N';
    if ($.session.CaseNotesViewEntered) {
      newViewEnteredByOthers = viewNotesEnteredByOtherUsersCheckBox.firstElementChild.checked
        ? 'Y'
        : 'N';
    }

    if (newViewNotesDaysBack >= 1 && newViewNotesDaysBack <= 60) {
      CN_CASELOAD_SETTINGS.viewNotesDaysBack = newViewNotesDaysBack;
    }
    if (newLastNoteEnteredDaysBack >= 1 && newLastNoteEnteredDaysBack <= 60) {
      CN_CASELOAD_SETTINGS.lastNoteEnteredDaysBack = newLastNoteEnteredDaysBack;
    }
    CN_CASELOAD_SETTINGS.viewEnteredByOtherUsers = newViewEnteredByOthers;
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
    viewNotesEnteredByOtherUsersCheckBox.addEventListener('change', event => {
      if (event.target.checked && $.session.CaseNotesViewEntered) {
        CN_CASELOAD_SETTINGS.viewEnteredByOtherUsers = 'Y';
      } else CN_CASELOAD_SETTINGS.viewEnteredByOtherUsers = 'N';
    });
  }

  return {
    buildCNCaseLoadSettings,
  };
})();
