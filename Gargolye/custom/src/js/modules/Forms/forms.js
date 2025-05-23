﻿const forms = (function () {
    var defaultval;
    let displayfromBLOBBtn;
    let documntId;
    let landingPage;
    let overviewTable;
    let newFormBtn;
    let selectedConsumer;
    let isFormLocked;

    // values for selectTemplatePopup
    let templateId;
    let typeId;
    let templateDropdown;
    let typeDropdown;
    let doneBtn;
    let formIds = [];

    async function handleActionNavEvent(target) {
        const targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                DOM.scrollToTopOfPage();
                DOM.clearActionCenter();
                selectedConsumer = roster2.getActiveConsumers()[0];
                await loadPDFFormsLanding();
                DOM.toggleNavLayout();
                break;
            }
            case 'miniRosterCancel': {
                DOM.toggleNavLayout();
                loadApp('home');
                break;
            }
        }
    }
    // Build Forms Module Landing Page
    async function loadPDFFormsLanding() {
        DOM.clearActionCenter();

        landingPage = document.createElement('div');
        landingPage.classList.add('planLandingPage');

        const consumerCard = buildConsumerCard();
        newFormBtn = buildNewFormBtn();

        let filterValues = { formsConsumer: selectedConsumer.id };
        reportsBtn = generateReports.createMainReportButton([
            { text: 'Form Listing - By Consumer', filterValues },
        ]);

        const btnWrap = document.createElement('div');
        btnWrap.classList.add('newFormAndReportBtns');

        landingPage.appendChild(consumerCard);
        landingPage.appendChild(btnWrap);
        btnWrap.appendChild(newFormBtn);
        btnWrap.appendChild(reportsBtn);

        overviewTable = await buildOverviewTable();
        landingPage.appendChild(overviewTable);

        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // Build User's table of Forms on the Landing Page
    async function buildOverviewTable() {
        const tableOptions = {
            plain: false,
            tableId: 'consumerFormsTable',
            columnHeadings: ['', 'Type', 'Completion', 'Last Updated', 'User Updated'],
            endIcon: true,
        };

        // FAKE DATA : build table data
        // const tableData = [{ values : ['Test', '03/01/2021'], endIcon : `${icons['delete']}`}, {values : ['Test2', '04/01/2021'], endIcon : `${icons['delete']}` }];
        let hasAssignedFormTypes = $.session.formsFormtype ? '1' : '0';
        const { getconsumerFormsResult: consumerForms } = await formsAjax.getconsumerFormsAsync(
            $.session.UserId,
            selectedConsumer.id,
            hasAssignedFormTypes,
        );
        // format the Completion Dates
        consumerForms.forEach(function (consumerForm) {
            let newDate = new Date(consumerForm.formCompleteDate);
            let theMonth = newDate.getMonth() + 1;
            let formatCompleteDate =
                UTIL.leadingZero(theMonth) +
                '/' +
                UTIL.leadingZero(newDate.getDate()) +
                '/' +
                newDate.getFullYear();
            consumerForm.formCompleteDate = formatCompleteDate;
        });

        let tableData = consumerForms.map(consumerForm => ({
            values: [
                `${icons['PDFForm']}`,
                consumerForm.formType + ' -- ' + consumerForm.formDescription,
                consumerForm.formCompleteDate,
                consumerForm.formLastUpdated,
                consumerForm.formUserUpdated,
            ],
            endIcon: $.session.formsDelete || $.session.formsUpdate ? `${icons['edit']}` : null,
            id: consumerForm.formId,
            attributes: [{ key: 'data-form-id', value: consumerForm.formId }],
            endIconCallback: e => {
                e.stopPropagation();
                try {
                    let tableRow = document.getElementById(consumerForm.formId);
                    formEditPopup(consumerForm.formId, consumerForm.formCompleteDate, tableRow);
                    // deleteConfirmation(consumerForm.formId, tableRow);
                    return;
                } catch (err) {
                    console.error('error: ', err);
                }
            },
            onClick: async () => {
                const checkFormsLockValue = await formsAjax.checkFormsLock(consumerForm.formId, $.session.UserId);
                // if the forms lock value returns a non empty string, display the forms lock popup
                if (checkFormsLockValue !== '') {
                    formLockPopup(checkFormsLockValue, selectedConsumer, consumerForm, displayFormPopup);
                    isFormLocked = true;

                } else {
                    openForm(selectedConsumer, consumerForm, displayFormPopup);
                }

            },
        }));

        const oTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = oTable.querySelectorAll('.header div');
        headers[1].setAttribute('data-type', 'string'); // Type
        headers[2].setAttribute('data-type', 'date'); //Completion 
        headers[3].setAttribute('data-type', 'string'); // Last Update    
        headers[4].setAttribute('data-type', 'string'); // User Updated


        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(oTable);

        table.populate(oTable, tableData);

        return oTable;
    }

    function buildConsumerCard() {
        selectedConsumer.card.classList.remove('highlighted');

        const wrap = document.createElement('div');
        wrap.classList.add('planConsumerCard');

        wrap.appendChild(selectedConsumer.card);

        return wrap;
    }

    function buildNewFormBtn() {
        return button.build({
            text: 'Add New Form',
            style: 'secondary',
            type: 'contained',
            classNames: !$.session.formsInsert ? ['disabled'] : ['newPlanBtn'],
            callback: () => createTemplatePopUp(),
        });
    }

    // Build/Display Popup Window for selecting a Form template from a DDL
    function createTemplatePopUp() {
        let selectTemplatePopup = POPUP.build({
            header: 'Template Select',
            hideX: true,
            id: 'selectTemplatePopup',
        });

        typeDropdown = dropdown.build({
            label: 'Form Type',
            dropdownId: 'typeDropdown',
        });

        templateDropdown = dropdown.build({
            label: 'Form Templates',
            dropdownId: 'templateDropdown',
        });

        let newDate = new Date();
        let theMonth = newDate.getMonth() + 1;
        let formCompleteDate =
            UTIL.leadingZero(theMonth) +
            '/' +
            UTIL.leadingZero(newDate.getDate()) +
            '/' +
            newDate.getFullYear();

        let thisCompleteDate = newDate;

        let completeDateInput = input.build({
            type: 'date',
            label: 'Completion Date',
            style: 'secondary',
            value: UTIL.formatDateToIso(formCompleteDate.split(' ')[0]),
            // readonly: true,
        });

        completeDateInput.addEventListener('change', event => {
            thisCompleteDate = event.target.value;
            // validation of completeDateInput
            if (thisCompleteDate === '') {
                completeDateInput.classList.add('error');
            } else {
                completeDateInput.classList.remove('error');
            }
            setBtnStatus();
        });

        doneBtn = button.build({
            id: 'wfStepDoneBtn',
            text: 'done',
            type: 'contained',
            style: 'secondary',
            callback: () => templatePopupDoneBtn(thisCompleteDate),
        });
        this.doneButton = doneBtn;

        let cancelBtn = button.build({
            id: 'wfStepCancelBtn',
            text: 'cancel',
            type: 'outlined',
            style: 'secondary',
            callback: () => templatePopupCancelBtn(),
        });

        let btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(doneBtn);
        btnWrap.appendChild(cancelBtn);
        selectTemplatePopup.appendChild(typeDropdown);
        selectTemplatePopup.appendChild(templateDropdown);
        selectTemplatePopup.appendChild(completeDateInput);
        selectTemplatePopup.appendChild(btnWrap);

        populateTypeDropdown();
        populateDropdown('0');

        // validation of templateDropdown
        templateId = templateDropdown.value;
        if (templateId === '' || templateId === undefined) {
            templateDropdown.classList.add('error');
        } else templateDropdown.classList.remove('error');

        templateDropdown.addEventListener('change', e => {
            templateId = e.target.value;
            templateDropdownValidation();
            setBtnStatus();
        });

        typeDropdown.addEventListener('change', async e => {
            typeId = e.target.value;
            await populateDropdown(typeId);
            templateDropdownValidation();
            setBtnStatus();
        });

        POPUP.show(selectTemplatePopup);
        setBtnStatus();
    }

    function templateDropdownValidation() {
        var templateDropdownOptions = document.getElementById('templateDropdown');
        templateId = templateDropdownOptions.options[templateDropdownOptions.selectedIndex].value;
        if (templateId === '') {
            templateDropdown.classList.add('error');
            return;
        } else {
            templateDropdown.classList.remove('error');
        }
    }

    function setBtnStatus() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));

        if (hasErrors.length !== 0) {
            doneBtn.classList.add('disabled');
        } else {
            doneBtn.classList.remove('disabled');
        }
    }

    // Event for Done BTN on the Template Form Popup Window
    function templatePopupDoneBtn(completeDate) {
        POPUP.hide(selectTemplatePopup);
        let isTemplate = '1';
        let documentEdited = '0'; //   document not previously edited
        let consumerId = selectedConsumer.id;
        let isRefresh = false;
        let formId = templateId;

        forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate, completeDate);
    }

    // Event for Cancel BTN on the Template Form Popup Window
    function templatePopupCancelBtn() {
        POPUP.hide(selectTemplatePopup);
    }

    // Populate the DDL on the Type Form Popup Window
    async function populateTypeDropdown() {
        const {
            getFormTypeResult: FormType,
        } = await formsAjax.getFormTypeAsync();
        let data = FormType.map((formType) => ({
            id: formType.formTypeId,
            value: formType.formTypeId,
            text: formType.formTypeDescription
        }));
        data.unshift({ id: null, value: '0', text: 'ALL' });
        dropdown.populate("typeDropdown", data, '0');
    }

    // Populate the DDL on the Template Form Popup Window
    async function populateDropdown(typeId) {
        let hasAssignedFormTypes = $.session.formsFormtype ? '1' : '0';
        const { getUserFormTemplatesResult: templates } = await formsAjax.getUserFormTemplatesAsync(
            $.session.UserId,
            hasAssignedFormTypes,
            typeId,
        );

        // Array to store unique template objects
        const uniqueForms = [];
        formIds = [];

        // Iterate over the templates array
        templates.forEach(template => {
            // Check if the formTemplateId already exists in uniqueForms
            const exists = uniqueForms.some(form => form.formTemplateId === template.formTemplateId);
            // If not, add the template to uniqueForms
            if (!exists) {
                uniqueForms.push(template);
            }

            if (typeId != '0')
                formIds.push(template.formTemplateId);
        });

        // Prepare data for dropdown
        const data = uniqueForms.map(template => ({
            id: template.formTemplateId,
            value: template.formTemplateId,
            text: template.formType + ' -- ' + template.formDescription,
        }));

        if (typeId == '0' || templates.length == 0) {
            data.unshift({ id: null, value: '', text: '' }); // Add blank value
            dropdown.populate('templateDropdown', data);
        }
        else {
            data.unshift({ id: null, value: '0', text: 'ALL' }); // Add blank value
            dropdown.populate('templateDropdown', data, '0');
        }
    }


    async function displayFormPopup(
        formId,
        documentEdited,
        consumerId,
        isRefresh,
        isTemplate,
        formCompleteDate,
    ) {
        let formPopup = POPUP.build({
            header: '',
            hideX: true,
            id: 'formPopup',
        });

        const viewer = document.createElement('div');

        var viewerWrap = document.createElement('div');
        viewerWrap.style = 'width: 1300px; height: 600px; margin: 0;';
        viewerWrap.id = 'viewer';

        viewer.appendChild(viewerWrap);

        formPopup.appendChild(viewer);

        POPUP.show(formPopup);


        if (formId == '0') {
            await formsAjax.insertSeveralConsumerFormAsync($.session.UserId, consumerId, formIds, isTemplate, formCompleteDate);
            POPUP.hide(formPopup);
            forms.loadPDFFormsLanding();
        }
        else {
            formsAjax.openFormEditor(
                formId,
                documentEdited,
                consumerId,
                isRefresh,
                isTemplate,
                $.session.applicationName,
                formCompleteDate,
                isFormLocked,
            );
        }

        isFormLocked = false;
    }

    async function displayStepFormPopup(
        formId,
        documentEdited,
        consumerId,
        isRefresh,
        isTemplate,
        formCompleteDate,
        stepId,
        docOrder,
        formName,
    ) {
        let formPopup = POPUP.build({
            header: '',
            hideX: true,
            id: 'formPopup',
        });

        const viewer = document.createElement('div');

        var viewerWrap = document.createElement('div');
        viewerWrap.style = 'width: 1300px; height: 600px; margin: 0;';
        viewerWrap.id = 'viewer';

        viewer.appendChild(viewerWrap);

        formPopup.appendChild(viewer);

        POPUP.show(formPopup);

        // If the form is new, skip the forms lock check
        if (isTemplate !== '1') {
            const checkFormsLockValue = await formsAjax.checkFormsLock(formId, $.session.UserId);

            // if the forms lock value returns a non empty string, display the forms lock popup
            if (checkFormsLockValue !== '') {
                isFormLocked = true;

                const popup = POPUP.build({
                    id: 'formLocksPopup',
                    classNames: 'warning',
                });

                const btnWrap = document.createElement('div');
                btnWrap.classList.add('btnWrap');

                const okBtn = button.build({
                    text: 'OK',
                    style: 'secondary',
                    type: 'contained',
                    icon: 'checkmark',
                    callback: async function () {
                        POPUP.hide(popup);
                        overlay.show();
                    },
                });

                btnWrap.appendChild(okBtn);
                const warningMessage = document.createElement('p');
                warningMessage.innerHTML = `This form is currently locked by ${checkFormsLockValue}. Any changes you make to this form will not be saved.`;
                popup.appendChild(warningMessage);
                popup.appendChild(btnWrap);
                POPUP.show(popup);
            }
        }

        formsAjax.openStepFormEditor(
            formId,
            documentEdited,
            consumerId,
            isRefresh,
            isTemplate,
            $.session.applicationName,
            formCompleteDate,
            isFormLocked,
            stepId,
            docOrder,
            formName,
        );
        isFormLocked = false;
    }

    function displayWFStepFormPopup(
        templateId,
        templateName,
        stepId,
        docOrder,
        isTemplate,
        documntEdited,
        consumerId,
    ) {
        isTemplate ? (documntId = 0) : (documntId = templateId);

        var displayfromBLOBBtn = button.build({
            text: 'Display Selected Form',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                //formsAjax.openEditor(templateId, false);
                // alert("Hi there.");
            },
        });

        let formPopup = POPUP.build({
            header: '',
            hideX: true,
            id: 'formPopup',
        });

        const viewer = document.createElement('div');

        var viewerWrap = document.createElement('div');
        viewerWrap.style = 'width: 1300px; height: 600px; margin: 0;';
        viewerWrap.id = 'viewer';

        viewer.appendChild(viewerWrap);

        formPopup.appendChild(viewer);

        // Display the window that the Form will populate using either openEditor/openPDFEditor
        POPUP.show(formPopup);

        if (isTemplate) {
            formsAjax.openEditor(templateId, templateName, consumerId, stepId, docOrder);
        } else {
            let isRefresh = false;
            formsAjax.openPDFEditor(documntId, documntEdited, consumerId, isRefresh);
        }
        // isTemplate ? formsAjax.openEditor(templateId, templateName) : formsAjax.openPDFEditor(documntId);
    }

    function deleteConfirmation(formId, tableRow) {
        var deletepopup = POPUP.build({
            id: 'deleteWarningPopup',
            classNames: 'warning',
        });
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var yesBtn = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
            icon: 'checkmark',
            callback: async function () {
                POPUP.hide(deletepopup);
                //	POPUP.hide(formeditpopup);
                let result = await formsAjax.deleteConsumerFormAsync(formId);
                if (result.deleteConsumerFormResult === '1') {
                    tableRow.remove();
                }
            },
        });
        var noBtn = button.build({
            text: 'No',
            style: 'secondary',
            type: 'contained',
            icon: 'close',
            callback: function () {
                POPUP.hide(deletepopup);
            },
        });
        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        var warningMessage = document.createElement('p');
        warningMessage.innerHTML = 'Are you sure you want to delete this form?';
        deletepopup.appendChild(warningMessage);
        deletepopup.appendChild(btnWrap);
        POPUP.show(deletepopup);
    }

    function formEditPopup(formId, formCompleteDate, tableRow) {
        const formeditpopup = POPUP.build({
            id: 'formeditpopup',
            classNames: 'miniform',
            hideX: true,
        });
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        let thisCompleteDate = formCompleteDate;

        let completeDateInput = input.build({
            type: 'date',
            label: 'Completion Date',
            style: 'secondary',
            value: UTIL.formatDateToIso(formCompleteDate.split(' ')[0]),
            // readonly: true,
        });

        completeDateInput.addEventListener('change', event => {
            thisCompleteDate = event.target.value;
            // validation of completeDateInput
            if (thisCompleteDate === '') {
                completeDateInput.classList.add('error');
                saveBtn.classList.add('disabled');
            } else {
                completeDateInput.classList.remove('error');
                if ($.session.formsUpdate) saveBtn.classList.remove('disabled');
            }
        });

        var saveBtn = button.build({
            text: 'Save Completion Date',
            style: 'secondary',
            type: 'contained',
            callback: async function () {
                await formsAjax.updateConsumerFormCompletionDateAsync(formId, thisCompleteDate);
                POPUP.hide(formeditpopup);
                // POPUP.hide(formPopup);
                forms.loadPDFFormsLanding();
                // overlay.show();
            },
        });

        var cancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(formeditpopup);
                // overlay.show();
            },
        });

        var deleteBtn = button.build({
            text: 'Delete Form',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(formeditpopup);
                deleteConfirmation(formId, tableRow);
                // overlay.show();
            },
        });

        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(cancelBtn);
        btnWrap.appendChild(deleteBtn);

        var warningMessage = document.createElement('p');
        warningMessage.innerHTML = 'Update Completion Date?';
        formeditpopup.appendChild(completeDateInput);
        formeditpopup.appendChild(warningMessage);
        formeditpopup.appendChild(btnWrap);
        // formeditpopup.appendChild(deleteBtn);

        if (!$.session.formsUpdate) {
            saveBtn.classList.add('disabled');
        } else {
            saveBtn.classList.remove('disabled');
        }

        if (!$.session.formsDelete) {
            deleteBtn.classList.add('disabled');
        } else {
            deleteBtn.classList.remove('disabled');
        }

        POPUP.show(formeditpopup);
    }

    function formLockPopup(checkFormsLockValue, selectedConsumer, consumerForm, displayFormPopup) {

        const popup = POPUP.build({
            id: 'formLocksPopup',
            classNames: 'warning',
        });

        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            icon: 'checkmark',
            callback: async function () {
                POPUP.hide(popup);
                openForm(selectedConsumer, consumerForm, displayFormPopup);
            },
        });

        btnWrap.appendChild(okBtn);
        const warningMessage = document.createElement('p');
        warningMessage.innerHTML = `This form is currently locked by ${checkFormsLockValue}. Any changes you make to this form will not be saved.`;
        popup.appendChild(warningMessage);
        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }

    function openForm(selectedConsumer, consumerForm, displayFormPopup) {
        let isTemplate = '0';
        let documentEdited = '1'; //   document previously edited
        let consumerId = selectedConsumer.id;
        let isRefresh = false;
        let formId = consumerForm.formId;
        let formCompleteDate = consumerForm.formCompleteDate;

        displayFormPopup(
            formId,
            documentEdited,
            consumerId,
            isRefresh,
            isTemplate,
            formCompleteDate
        );
    }

    function init() {
        //DOM.clearActionCenter();
        // PROGRESS.SPINNER.show('Loading PDF Forms...');
        //loadPDFFormsLanding();
        setActiveModuleAttribute('forms');
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        init,
        loadPDFFormsLanding,
        displayWFStepFormPopup,
        displayFormPopup,
        displayStepFormPopup,
        handleActionNavEvent,
    };
})();


