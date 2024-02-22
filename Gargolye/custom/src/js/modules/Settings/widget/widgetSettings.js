const widgetSettings = (function () {
    let widgetSettingsPage;
    let sectionreorder = [];
    let updatedListOrder = [];
    let widgetsContainer;
    let newTable;

    //let sectionBody;
    const sections = {
        // pre existing, need new ids, idk what that'll do to existing data?
        1: {
            id: 1,
            name: 'Case Note Productivity',
            settings: { productivityThreshold: 60, daysBack: 7, workHoursPerDay: 7 },
            showHide: '',
            application: 'gk',
            order: 0,
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
                        dashboard.load();
                    },
                });

                const backBtn = button.build({
                    id: 'cnProductivityBack',
                    text: 'Back',
                    type: 'contained',
                    style: 'secondary',
                    callback: async () => {
                        const toggle = document.querySelector('#build-1');
                        toggle.classList.remove('active');
                        newTable.classList.add('active');
                    },
                });

                const btnWrap = document.createElement("div");
                btnWrap.classList.add("btnWrap");
                btnWrap.appendChild(saveBtn);
                btnWrap.appendChild(backBtn);

                group1.appendChild(daysBackInput);
                group1.appendChild(workHoursPerDay);
                group2.appendChild(productivityThresholdPercentage);

                widgetBody.appendChild(group1);
                widgetBody.appendChild(group2);
                widgetBody.appendChild(btnWrap);

                return widgetBody;
            },
        },
        2: {
            id: 2,
            name: 'My Case Load',
            settings: {
                viewNotesDaysBack: 30,
                lastNoteEnteredDaysBack: 30,
                viewEnteredByOtherUsers: 'N',
            },
            showHide: '',
            application: 'gk',
            order: 0,
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
                        dashboard.load();
                    },
                });

                const backBtn = button.build({
                    id: 'cnCaseLoadBack',
                    text: 'Back',
                    type: 'contained',
                    style: 'secondary',
                    callback: async () => {
                        const toggle = document.querySelector('#build-2');
                        toggle.classList.remove('active');
                        newTable.classList.add('active');
                    },
                });

                const btnWrap = document.createElement("div");
                btnWrap.classList.add("btnWrap");
                btnWrap.appendChild(saveBtn);
                btnWrap.appendChild(backBtn);

                if ($.session.CaseNotesViewEntered) {
                    widgetBody.appendChild(viewNotesByOtherUsersCheckBox);
                } else {
                    this.settings.viewEnteredByOtherUsers = 'N';
                }

                widgetBody.appendChild(viewNotesByOtherUsersCheckBox);
                widgetBody.appendChild(lastNoteDaysBackInput);
                widgetBody.appendChild(reviewNotesDaysBackInput);
                widgetBody.appendChild(btnWrap);

                return widgetBody;
            },
        },
        3: {
            id: 3,
            name: 'Rejected Case Notes',
            settings: { daysBack: 60 },
            showHide: '',
            application: 'gk',
            order: 0,
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
                        dashboard.load();
                    },
                });

                const backBtn = button.build({
                    id: 'cnRejectedBack',
                    text: 'Back',
                    type: 'contained',
                    style: 'secondary',
                    // classNames: ['widgetSettingsSaveBtn'],
                    callback: async () => {
                        const toggle = document.querySelector('#build-3');
                        toggle.classList.remove('active');
                        newTable.classList.add('active');
                    },
                });

                const btnWrap = document.createElement("div");
                btnWrap.classList.add("btnWrap");
                btnWrap.appendChild(saveBtn);
                btnWrap.appendChild(backBtn);

                widgetBody.appendChild(daysBackInput);
                widgetBody.appendChild(btnWrap);

                return widgetBody;
            },
        },
        4: {
            id: 4,
            name: 'Plan To-Do List',
            settings: { dueDate: 'today' },
            showHide: '',
            application: 'gk',
            order: 0,
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
                        dashboard.load();
                    },
                });

                const backBtn = button.build({
                    id: 'wfPlanBack',
                    text: 'Back',
                    type: 'contained',
                    style: 'secondary',
                    callback: async () => {
                        const toggle = document.querySelector('#build-4');
                        toggle.classList.remove('active');
                        newTable.classList.add('active');
                    },
                });

                const btnWrap = document.createElement("div");
                btnWrap.classList.add("btnWrap");
                btnWrap.appendChild(saveBtn);
                btnWrap.appendChild(backBtn);

                widgetBody.appendChild(dueDateDropdown);
                widgetBody.appendChild(btnWrap);

                return widgetBody;
            },
        },
        // new widgets
        5: { id: 5, name: 'Custom Links', settings: {}, showHide: '', application: 'gk,adv', order: 0, },
        6: {
            id: 6,
            name: 'Absent Consumers',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
        7: {
            id: 7,
            name: 'Location Progress Notes',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
        8: {
            id: 8,
            name: 'Consumer Progress Notes',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
        9: {
            id: 9,
            name: 'Day Service Time Clock',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
        10: { id: 10, name: 'Hours Worked', settings: {}, showHide: '', application: 'gk,adv', order: 0, },
        11: {
            id: 11,
            name: 'Daily Services',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
        12: { id: 12, name: 'Day Services', settings: {}, showHide: '', application: 'gk,adv', order: 0, },
        13: {
            id: 13,
            name: 'My Unapproved Time Entries',
            settings: {},
            showHide: '',
            application: 'adv',
            order: 0,
        },
        14: {
            id: 14,
            name: 'Time Entry Review',
            settings: {},
            showHide: '',
            application: 'adv',
            order: 0,
        },
        15: { id: 15, name: 'My Schedule', settings: {}, showHide: '', application: 'adv', order: 0, },
        16: {
            id: 16,
            name: 'Incident Tracking',
            settings: {},
            showHide: '',
            application: 'adv',
            order: 0,
        },
        17: {
            id: 17,
            name: 'Plans Missing Signatures',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
        18: {
            id: 18,
            name: 'Money Management',
            settings: {},
            showHide: '',
            application: 'adv',
            order: 0,
        },
        19: {
            id: 19,
            name: 'System Messages',
            settings: {},
            showHide: '',
            application: 'gk,adv',
            order: 0,
        },
    };

    function setWidgetSettings(widgetId) {
        let settings = dashboard.getWidgetSettings(widgetId);

        if (settings.widgetConfig !== null) {
            sections[widgetId].settings = { ...settings.widgetConfig };
        }
        sections[widgetId].order = parseInt(settings.widgetOrder);
        sections[widgetId].showHide = settings.showHide;
    }

    function buildWidgetBodyInnerHTML(sec) {
        const settingHTML = sections[sec].build();
        return settingHTML;
    }

    function populatePage() {
        const appName = $.session.applicationName === 'Advisor' ? 'adv' : 'gk';
        widgetsContainer = document.createElement('div');
        widgetsContainer.classList.add('widgetsContainer');

        newTable = buildTeamMemberTable();
        newTable.classList.add('active');
        widgetsContainer.appendChild(newTable);

        for (const sec in sections) {
            if (!sections[sec].application.includes(appName)) {
                continue;
            }
            setWidgetSettings(sec);
            if (sections[sec].build) {
                const sectionWrap = document.createElement('div');
                sectionWrap.classList.add('widgetWrap');
                sectionWrap.id = `build-${sections[sec].id}`;

                const sectionHeader = document.createElement('div');
                sectionHeader.classList.add('widgetHeader');

                const sectionBody = document.createElement('div');
                sectionBody.classList.add('widgetBody');
                const title = document.createElement('p');
                title.innerText = sections[sec].name;
                sectionHeader.appendChild(title);
                sectionBody.appendChild(buildWidgetBodyInnerHTML(sec));
                sectionWrap.appendChild(sectionHeader);
                sectionWrap.appendChild(sectionBody);
                widgetsContainer.appendChild(sectionWrap);
            }
        }       
        widgetSettingsPage.appendChild(widgetsContainer);
    }


    function buildTeamMemberTable() {
        const teamMemberTable = table.build({
            tableId: 'settingTable',
            columnHeadings: [],
            endIcon: true,
            sortable: true,
            onSortCallback: async res => {
                var allElmnts = document.querySelectorAll('[id^="sig-"]');
                updatedListOrder = [];
                updatedListOrder.length = allElmnts.length;
                for (var i = 0; i < allElmnts.length; i++) {
                    updatedListOrder[i] = allElmnts[i].innerText.replace('show', '').replace('\n', '');
                }
                await widgetSettingsAjax.setWidgetSettingOrder(updatedListOrder);
                if ($.session.activeModule == 'home')
                    dashboard.load();
            },
        });

        if (sections) {
            const appName = $.session.applicationName === 'Advisor' ? 'adv' : 'gk';
            sectionreorder = [];
            for (const sec in sections) {
                if (!sections[sec].application.includes(appName)) {
                    continue;
                }
                setWidgetSettings(sec);
                sectionreorder.push(sections[sec]);
            };

            let sortedProducts = sectionreorder.sort((a, b) => {
                if (a.order === 0) return 1;
                if (b.order === 0) return -1;
                return a.order - b.order;
            });

            const tableData = sortedProducts.map(m => {
                let name = m.name;
                const activeCheckbox = input.buildCheckbox({
                    id: `chk-${m.id}`,
                    text: 'show',
                    isChecked: m.showHide === 'Y' ? true : false,
                });

                const tableOBJ = {
                    values: [name],
                    id: `sig-${m.id}-${m.order}`,
                    endIcon: m.name == 'System Messages' ? '' : activeCheckbox.outerHTML,
                    onClick: async e => {
                        var id = e.target.id.split('-')[1];
                        if (sections[parseInt(m.id)].build) {
                            const toggle = document.querySelector('#build-' + id);
                            toggle.classList.add('active');
                            newTable.classList.remove('active');
                        }
                    },
                };

                // set checkbox callback
                tableOBJ.endIconCallback = async e => {
                    sec = e.currentTarget.children[0].control.id.split('-')[1];
                    document.getElementById(e.currentTarget.children[0].control.id).checked = sections[sec].showHide == 'Y' ? false : true;
                    sections[sec].showHide = sections[sec].showHide == 'Y' ? 'N' : 'Y';

                    const configString = JSON.stringify(sections[sec].settings);
                    const sectionID = parseInt(sec);
                    await widgetSettingsAjax.setWidgetSettingConfig(
                        sectionID,
                        configString,
                        sections[sec].showHide,
                    );
                    if ($.session.activeModule == 'home')
                        dashboard.load();
                };
                tableOBJ.attributes = [{ key: 'data-signed', value: m.id }];
                return tableOBJ;
            });

            table.populate(teamMemberTable, tableData, true);
        }
        return teamMemberTable;
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
