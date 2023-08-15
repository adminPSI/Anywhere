const widgetSettings = (function () {
  let widgetSettingsPage;

  const sections = {
    // pre existing, need new ids, idk what that'll do to existing data?
    1: {
      name: 'Case Note Productivity',
      settings: { productivityThreshold: 60, daysBack: 7, workHoursPerDay: 7 },
      showHide: '',
      application: 'gk',
      build: function () {
        const that = this;
        const saveID = 1;
        const widgetBody = document.createElement('div');
        widgetBody.classList.add('widgetBody__Inner');

        const group1 = document.createElement('div');
        group1.classList.add('group1');
        const group2 = document.createElement('div');
        group2.classList.add('group2');
        const percentSymb = document.createElement('p');
        percentSymb.innerText = '%';
        percentSymb.style.color = 'black';
        percentSymb.style.position = 'absolute';
        percentSymb.style.marginLeft = '252px';
        percentSymb.style.marginTop = '-99px';

        // build inputs
        const daysBackInput = input.build({
          id: 'cnProductivityDaysBack',
          label: 'Days Back',
          type: 'number',
          style: 'secondary',
          value: that.settings.daysBack,
          attributes: [
            { key: 'min', value: '1' },
            { key: 'max', value: '14' },
            {
              key: 'onkeypress',
              value: 'return event.charCode >= 48 && event.charCode <= 57',
            },
          ],
        });
        const productivityThresholdPercentage = input.build({
          id: 'productivityThresholdPercentage',
          label: 'Productivity Threshold',
          type: 'number',
          style: 'secondary',
          value: that.settings.productivityThreshold,
          attributes: [
            { key: 'min', value: '0' },
            { key: 'max', value: '100' },
            {
              key: 'onkeypress',
              value: 'return event.charCode >= 48 && event.charCode <= 57',
            },
          ],
        });
        const workHoursPerDay = input.build({
          id: 'cnProductivityWorkHoursPerDay',
          label: 'Work Hours/Day',
          type: 'number',
          style: 'secondary',
          value: that.settings.workHoursPerDay,
          attributes: [
            { key: 'min', value: '1' },
            { key: 'max', value: '24' },
          ],
        });
        const saveBtn = button.build({
          id: 'cnProductivitySave',
          text: 'Save',
          type: 'contained',
          style: 'secondary',
          classNames: ['widgetSettingsSaveBtn'],
          callback: async () => {
            const newDaysBack = parseInt(daysBackInput.firstElementChild.value);
            const newProductivity = parseInt(
              productivityThresholdPercentage.firstElementChild.value,
            );
            const newWorkHours = parseFloat(workHoursPerDay.firstElementChild.value);
            if (newDaysBack >= 1 && newDaysBack <= 14) {
              that.settings.daysBack = newDaysBack;
            }
            if (newProductivity >= 0 && newProductivity <= 100) {
              that.settings.productivityThreshold = newProductivity;
            }
            if (newWorkHours >= 0.1 && newWorkHours <= 24) {
              that.settings.workHoursPerDay = newWorkHours;
            }
            // config string to json
            const configString = JSON.stringify(that.settings);

            // style saved button
            saveBtn.innerText = 'saved';
            saveBtn.classList.add('saved');
            setTimeout(() => {
              saveBtn.classList.remove('saved');
              saveBtn.innerText = 'save';
            }, 1600);

            // update settings
            await widgetSettingsAjax.setWidgetSettingConfig(saveID, configString, that.showHide);
            dashboard.refreshWidgetSettings();
          },
        });

        group1.appendChild(daysBackInput);
        group1.appendChild(workHoursPerDay);
        group2.appendChild(productivityThresholdPercentage);

        widgetBody.appendChild(group1);
        widgetBody.appendChild(group2);
        widgetBody.appendChild(saveBtn);

        return widgetBody;
      },
    },
    2: {
      name: 'My Case Load',
      settings: {
        viewNotesDaysBack: 30,
        lastNoteEnteredDaysBack: 30,
        viewEnteredByOtherUsers: 'N',
      },
      showHide: '',
      application: 'gk',
      build: function () {
        const saveID = 2;
        const that = this;
        const widgetBody = document.createElement('div');
        widgetBody.classList.add('widgetBody__Inner');

        const viewNotesByOtherUsersCheckBox = input.buildCheckbox({
          text: 'View Notes Entered by Other Users',
          style: 'secondary',
          isChecked: that.settings.viewEnteredByOtherUsers === 'Y' ? true : false,
        });
        viewNotesByOtherUsersCheckBox.classList.add('settingsCheckBox');
        viewNotesByOtherUsersCheckBox.addEventListener('change', event => {
          if (event.target.checked && $.session.CaseNotesViewEntered) {
            that.settings.viewEnteredByOtherUsers = 'Y';
          } else {
            that.settings.viewEnteredByOtherUsers = 'N';
          }
        });

        const lastNoteDaysBackInput = input.build({
          id: 'cnCaseLoadLastNoteDaysBack',
          label: 'Last Note Entered Days Back',
          type: 'number',
          style: 'secondary',
          value: that.settings.lastNoteEnteredDaysBack,
          attributes: [
            { key: 'min', value: '1' },
            { key: 'max', value: '60' },
            {
              key: 'onkeypress',
              value: 'return event.charCode >= 48 && event.charCode <= 57',
            },
          ],
        });
        const reviewNotesDaysBackInput = input.build({
          id: 'cnCaseLoadLastNoteDaysBack',
          label: 'Review Notes Days Back',
          type: 'number',
          style: 'secondary',
          value: that.settings.viewNotesDaysBack,
          attributes: [
            { key: 'min', value: '1' },
            { key: 'max', value: '60' },
            {
              key: 'onkeypress',
              value: 'return event.charCode >= 48 && event.charCode <= 57',
            },
          ],
        });

        const saveBtn = button.build({
          id: 'cnCaseLoadSave',
          text: 'Save',
          type: 'contained',
          style: 'secondary',
          classNames: ['widgetSettingsSaveBtn'],
          callback: async () => {
            // get input field values
            const newViewNotesDaysBack = parseInt(reviewNotesDaysBackInput.firstElementChild.value);
            const newLastNoteEnteredDaysBack = parseInt(
              lastNoteDaysBackInput.firstElementChild.value,
            );
            let newViewEnteredByOthers = 'N';
            if ($.session.CaseNotesViewEntered) {
              newViewEnteredByOthers = viewNotesByOtherUsersCheckBox.firstElementChild.checked
                ? 'Y'
                : 'N';
            }

            if (newViewNotesDaysBack >= 1 && newViewNotesDaysBack <= 60) {
              that.settings.viewNotesDaysBack = newViewNotesDaysBack;
            }
            if (newLastNoteEnteredDaysBack >= 1 && newLastNoteEnteredDaysBack <= 60) {
              that.settings.lastNoteEnteredDaysBack = newLastNoteEnteredDaysBack;
            }

            that.settings.viewEnteredByOtherUsers = newViewEnteredByOthers;

            // config string to json
            const configString = JSON.stringify(that.settings);

            // style saved button
            saveBtn.innerText = 'saved';
            saveBtn.classList.add('saved');
            setTimeout(() => {
              saveBtn.classList.remove('saved');
              saveBtn.innerText = 'save';
            }, 1600);

            // update settings
            await widgetSettingsAjax.setWidgetSettingConfig(saveID, configString, that.showHide);
            dashboard.refreshWidgetSettings();
          },
        });

        if ($.session.CaseNotesViewEntered) {
          widgetBody.appendChild(viewNotesByOtherUsersCheckBox);
        } else {
          this.settings.viewEnteredByOtherUsers = 'N';
        }

        widgetBody.appendChild(viewNotesByOtherUsersCheckBox);
        widgetBody.appendChild(lastNoteDaysBackInput);
        widgetBody.appendChild(reviewNotesDaysBackInput);
        widgetBody.appendChild(saveBtn);

        return widgetBody;
      },
    },
    3: {
      name: 'Rejected Case Notes',
      settings: { daysBack: 60 },
      showHide: '',
      application: 'gk',
      build: function () {
        const saveID = 3;
        const that = this;
        const widgetBody = document.createElement('div');
        widgetBody.classList.add('widgetBody__Inner');

        const daysBackInput = input.build({
          id: 'cnRejectedDaysBack',
          label: 'Rejected Notes Days Back',
          type: 'number',
          style: 'secondary',
          value: that.settings.daysBack,
          attributes: [
            { key: 'min', value: '1' },
            { key: 'max', value: '60' },
            {
              key: 'onkeypress',
              value: 'return event.charCode >= 48 && event.charCode <= 57',
            },
          ],
        });
        const saveBtn = button.build({
          id: 'cnRejectedSave',
          text: 'Save',
          type: 'contained',
          style: 'secondary',
          classNames: ['widgetSettingsSaveBtn'],
          callback: async () => {
            console.log(that);
            // get input field values
            const newDaysBack = parseInt(daysBackInput.firstElementChild.value);
            if (newDaysBack >= 1 && newDaysBack <= 60) {
              that.settings.daysBack = newDaysBack;
            }

            // config string to json
            const configString = JSON.stringify(that.settings);

            // style saved button
            saveBtn.innerText = 'saved';
            saveBtn.classList.add('saved');
            setTimeout(() => {
              saveBtn.classList.remove('saved');
              saveBtn.innerText = 'save';
            }, 1600);

            // update settings
            await widgetSettingsAjax.setWidgetSettingConfig(saveID, configString, that.showHide);
            dashboard.refreshWidgetSettings();
          },
        });

        widgetBody.appendChild(daysBackInput);
        widgetBody.appendChild(saveBtn);

        return widgetBody;
      },
    },
    4: {
      name: 'Plan To-Do List',
      settings: { dueDate: 'today' },
      showHide: '',
      application: 'gk',
      build: function () {
        const saveID = 4;
        const that = this;
        const widgetBody = document.createElement('div');
        widgetBody.classList.add('widgetBody__Inner');

        const dueDateDropdown = dropdown.build({
          label: 'Due Date',
          style: 'secondary',
          dropdownId: 'dueDateDropdown',
        });
        dueDateDropdown.addEventListener('change', e => {
          that.settings.dueDate = e.target.value;
        });
        dropdown.populate(
          dueDateDropdown,
          [
            { id: 1, value: 'today', text: 'Today' },
            { id: 2, value: 'next 7 days', text: 'Next 7 Days' },
            { id: 3, value: 'next 30 days', text: 'Next 30 Days' },
            { id: 4, value: 'prior 7 days', text: 'Prior 7 Days' },
            { id: 5, value: 'prior 30 days', text: 'Prior 30 Days' },
          ],
          that.settings.dueDate,
        );

        const saveBtn = button.build({
          id: 'wfPlanSave',
          text: 'Save',
          type: 'contained',
          style: 'secondary',
          classNames: ['widgetSettingsSaveBtn'],
          callback: async () => {
            // config string to json
            const configString = JSON.stringify(that.settings);

            // style saved button
            saveBtn.innerText = 'saved';
            saveBtn.classList.add('saved');
            setTimeout(() => {
              saveBtn.classList.remove('saved');
              saveBtn.innerText = 'save';
            }, 1600);

            // update settings
            await widgetSettingsAjax.setWidgetSettingConfig(saveID, configString, that.showHide);
            dashboard.refreshWidgetSettings();
          },
        });

        widgetBody.appendChild(dueDateDropdown);
        widgetBody.appendChild(saveBtn);

        return widgetBody;
      },
    },
    // new widgets
    5: { name: 'Custom Links', settings: {}, showHide: '', application: 'gk,adv' },
    6: {
      name: 'Absent Consumers',
      settings: {},
      showHide: '',
      application: 'gk,adv',
    },
    7: {
      name: 'Location Progress Notes',
      settings: {},
      showHide: '',
      application: 'gk,adv',
    },
    8: {
      name: 'Consumer Progress Notes',
      settings: {},
      showHide: '',
      application: 'gk,adv',
    },
    9: {
      name: 'Day Service Time Clock',
      settings: {},
      showHide: '',
      application: 'gk,adv',
    },
    10: { name: 'Hours Worked', settings: {}, showHide: '', application: 'gk,adv' },
    11: {
      name: 'Daily Services',
      settings: {},
      showHide: '',
      application: 'gk,adv',
    },
    12: { name: 'Day Services', settings: {}, showHide: '', application: 'gk,adv' },
    13: {
      name: 'My Unapproved Time Entries',
      settings: {},
      showHide: '',
      application: 'adv',
    },
    14: {
      name: 'Time Entry Review',
      settings: {},
      showHide: '',
      application: 'adv',
    },
    15: { name: 'My Schedule', settings: {}, showHide: '', application: 'adv' },
    16: {
      name: 'Incident Tracking',
      settings: {},
      showHide: '',
      application: 'adv',
    },
    17: {
      name: 'Plans Missing Signatures',
      settings: {},
      showHide: '',
      application: 'gk,adv',
    },
  };

  function setWidgetSettings(widgetId) {
    let settings = dashboard.getWidgetSettings(widgetId);

    if (settings.widgetConfig !== null) {
      sections[widgetId].settings = { ...settings.widgetConfig };
    }

    sections[widgetId].showHide = settings.showHide;
  }

  function buildWidgetBodyInnerHTML(sec) {
    const settingHTML = sections[sec].build();
    return settingHTML;
  }

  function populatePage() {
    const appName = $.session.applicationName === 'Advisor' ? 'adv' : 'gk';
    const widgetsContainer = document.createElement('div');
    widgetsContainer.classList.add('widgetsContainer');

    for (const sec in sections) {
      if (!sections[sec].application.includes(appName)) {
        continue;
      }

      setWidgetSettings(sec);

      const sectionWrap = document.createElement('div');
      sectionWrap.classList.add(
        'widgetWrap',
        `${sections[sec].name.replaceAll(' ', '').toLowerCase()}`,
      );

      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('widgetHeader');

      const sectionBody = document.createElement('div');
      sectionBody.classList.add('widgetBody');

      const title = document.createElement('p');
      title.innerText = sections[sec].name;

      const checkbox = input.buildCheckbox({
        text: 'show',
        isChecked: sections[sec].showHide === 'Y' ? true : false,
      });
      checkbox.addEventListener('change', async e => {
        sections[sec].showHide = e.target.checked ? 'Y' : 'N';

        const configString = JSON.stringify(sections[sec].settings);
        const sectionID = parseInt(sec);
        await widgetSettingsAjax.setWidgetSettingConfig(
          sectionID,
          configString,
          sections[sec].showHide,
        );
        dashboard.refreshWidgetSettings();

        // update widget data-show attribute
        const widget = document.querySelector(`[data-widgetId='${sec}']`);
        widget.setAttribute('data-show', sections[sec].showHide);
      });

      sectionHeader.appendChild(title);
      sectionHeader.appendChild(checkbox);

      if (sections[sec].build) {
        sectionBody.appendChild(buildWidgetBodyInnerHTML(sec));
      }

      sectionWrap.appendChild(sectionHeader);
      sectionWrap.appendChild(sectionBody);

      widgetsContainer.appendChild(sectionWrap);

      sectionHeader.addEventListener('click', e => {
        if (sectionBody.classList.contains('active')) {
          sectionBody.classList.remove('active');
        } else {
          const currAct = widgetSettingsPage.querySelector('.active');
          if (currAct) currAct.classList.remove('active');
          sectionBody.classList.add('active');
        }
      });
    }

    widgetSettingsPage.appendChild(widgetsContainer);
  }

  function buildPage() {
    widgetSettingsPage = document.querySelector('.util-menu__widgetSettings');
    widgetSettingsPage.innerHTML = '';

    const currMenu = document.createElement('p');
    currMenu.innerText = 'Widget Settings';
    currMenu.classList.add('menuTopDisplay');

    const backButton = button.build({
      text: 'Back',
      icon: 'arrowBack',
      type: 'text',
      attributes: [{ key: 'data-action', value: 'back' }],
    });

    widgetSettingsPage.appendChild(currMenu);
    widgetSettingsPage.appendChild(backButton);
  }

  function init() {
    buildPage();
    populatePage();
  }

  return {
    init,
  };
})();
