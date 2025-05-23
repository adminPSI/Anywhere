const PositionTask = (() => {

    let PositionEntriesTable = [];
    let PositionId;
    let jobTaskID;
    let PositionEntries;
    let LastTaskNumber;
    let consumersID;
    let name;
    let positionName;
    let selectedConsumersName;
    let actualTaskNumber;

    async function init(positionId, Name, PositionName, SelectedConsumersName, ConsumersId) {
        PositionId = positionId;
        consumersID = ConsumersId;
        name = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;
        if (PositionId != undefined) {
            PositionEntries = await EmploymentAjax.getPositionTaskEntriesAsync(PositionId);
            LastTaskNumber = await EmploymentAjax.getLastTaskNumberAsync(PositionId);
        }
    }


    function getMarkup() {
        const positionWrap = document.createElement('div');
        positionWrap.classList.add('planSummary');

        if (PositionId != undefined) {
            const importantTables = buildNewPositionForm();
            positionWrap.appendChild(importantTables);
        }
        else {
            const heading = document.createElement('h2');
            heading.innerHTML = 'Position Task';
            heading.classList.add('sectionHeading');
            positionWrap.appendChild(heading);
        }

        return positionWrap;
    }

    function buildNewPositionForm() {
        const positionDiv = document.createElement('div');
        positionDiv.classList.add('additionalQuestionWrap');

        NEW_POSITION_BTN = button.build({
            text: '+ NEW POSITION TASK',
            style: 'secondary',
            type: 'contained',
            callback: () => addPositionPopupBtn()
        });
        PositionEntriesTable = buildPositionEntriesTable();

        //  DOM.clearActionCenter();

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Position Task</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)
        if ($.session.EmploymentUpdate) {
            addNewCardBody.appendChild(NEW_POSITION_BTN);
        }
        addNewCardBody.appendChild(PositionEntriesTable);
        positionDiv.appendChild(column1);
        return positionDiv;
    }

    function buildPositionEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'employmentPositionTable',
            columnHeadings: ['Task #', 'Description', 'Start Date', 'End Date', 'Initial Performance', 'Initial Performance Notes', 'Employer Standard'],
            endIcon: $.session.EmploymentDelete == true ? true :false,
        };

        let tableData = PositionEntries.getPositionTaskEntriesResult.map((entry) => ({
            values: [entry.task, entry.description, entry.startDate == '' ? '' : moment(entry.startDate).format('MM/DD/YY'), entry.endDate == '' ? '' : moment(entry.endDate).format('MM/DD/YY'), entry.initialPerformance, entry.initialPerformanceNotes, entry.employeeStandard],
            attributes: [{ key: 'jobTaskId', value: entry.jobTaskId }],
            onClick: (e) => {
                if ($.session.EmploymentUpdate) {
                    handleAccountTableEvents(e.target.attributes.jobTaskId.value)
                }                   
            },
            endIcon: $.session.EmploymentDelete == true ? `${icons['delete']}` : '',
            endIconCallback: (e) => {
                deletePositionTaskPOPUP(entry.jobTaskId);
            },
        }));
        const oTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = oTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'number'); // Task
        headers[1].setAttribute('data-type', 'string'); // Description
        headers[2].setAttribute('data-type', 'date'); // Start Date
        headers[3].setAttribute('data-type', 'date'); // End Date
        headers[4].setAttribute('data-type', 'string'); // Initial Performance
        headers[5].setAttribute('data-type', 'string'); // Initial Performance Notes
        headers[6].setAttribute('data-type', 'string'); // Employer Standard

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(oTable);

        table.populate(oTable, tableData);

        return oTable;
    }

    function handleAccountTableEvents(jobTaskId) {
        addPositionPopupBtn(jobTaskId)
    }

    function deletePositionTaskPOPUP(jobTaskId) {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                deletePositionTask(jobTaskId, confirmPopup);
            },
        });

        NO_BTN = button.build({
            text: 'NO',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(confirmPopup);
            },
        });

        const message = document.createElement('p');

        message.innerText = 'Are you sure you would like to delete this Position Task?';
        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        confirmPopup.appendChild(message);
        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(YES_BTN);
        popupbtnWrap.appendChild(NO_BTN);
        confirmPopup.appendChild(popupbtnWrap);
        YES_BTN.focus();
        POPUP.show(confirmPopup);
    }

    function deletePositionTask(jobTaskId, confirmPopup) {
        EmploymentAjax.deletePostionTask(
            {
                jobTaskID: jobTaskId,
                PositionID: PositionId,
            },
            function (results) {
                if (results = 'sucess') {
                    POPUP.hide(confirmPopup);
                    NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID, tabPositionIndex = 2);
                }
            },
        );
    }

    function addPositionPopupBtn(jobTaskId) {
        if (jobTaskId == 0 || jobTaskId == undefined) {
            actualTaskNumber = LastTaskNumber.getLastTaskNumberResult[0] == undefined ? 1 : LastTaskNumber.getLastTaskNumberResult[0].lastTaskNumber;
            task = LastTaskNumber.getLastTaskNumberResult[0] == undefined ? 1 : LastTaskNumber.getLastTaskNumberResult[0].lastTaskNumber > 7 ? LastTaskNumber.getLastTaskNumberResult[0].lastTaskNumber - 7 : LastTaskNumber.getLastTaskNumberResult[0].lastTaskNumber;
            description = '';
            startDate = LastTaskNumber.getLastTaskNumberResult[0] == undefined ? '' : UTIL.formatDateFromDateObj(LastTaskNumber.getLastTaskNumberResult[0].startDate);
            endDate = '';
            initialPerformance = '';
            initialPerformanceNotes = '';
            employeeStandard = '';
            initialPerformanceID = '';
        }
        else {
            let positionValue = PositionEntries.getPositionTaskEntriesResult.find(x => x.jobTaskId == jobTaskId);
            actualTaskNumber = positionValue.task;
            task = positionValue.task;
            description = positionValue.description;
            startDate = moment(positionValue.startDate).format('YYYY-MM-DD');
            endDate = positionValue.endDate == '' ? '' : moment(positionValue.endDate).format('YYYY-MM-DD');
            initialPerformance = positionValue.initialPerformanceID;
            initialPerformanceNotes = positionValue.initialPerformanceNotes;
            employeeStandard = positionValue.employeeStandard;
            initialPerformanceID = positionValue.initialPerformanceID
        }


        addPositionPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '20px';
        if (jobTaskId) {
            heading.innerText = 'Update Position Task';
            jobTaskID = jobTaskId;
        }
        else {
            heading.innerText = 'New Position Task';
            jobTaskID = 0;
        }

        // dropdowns & inputs
        taskInput = input.build({
            id: 'taskInput',
            type: 'text',
            label: 'Task Number',
            style: 'secondary',
            value: task,
        });

        descriptionInput = input.build({
            id: 'descriptionInput',
            type: 'text',
            label: 'Description',
            style: 'secondary',
            value: description,
        });

        newStartDate = input.build({
            id: 'newStartDate',
            type: 'date',
            label: 'Start Date',
            style: 'secondary',
            value: startDate,
        });

        newEndDate = input.build({
            id: 'newEndDate',
            type: 'date',
            label: 'End Date',
            style: 'secondary',
            value: endDate,
        });

        initialPerformanceDropdown = dropdown.build({
            id: 'initialPerformanceDropdown',
            label: "Initial Performance",
            dropdownId: "initialPerformanceDropdown",
            value: (initialPerformanceID) ? initialPerformanceID : '',
        });

        initialPerformanceNotesInput = input.build({
            id: 'initialPerformanceNotesInput',
            type: 'textarea',
            label: 'Initial Performance Notes',
            style: 'secondary',
            classNames: 'autosize',
            value: initialPerformanceNotes,
        });

        employeeStandardInput = input.build({
            id: 'employeeStandardInput',
            type: 'textarea',
            label: 'Employer Standard',
            style: 'secondary',
            classNames: 'autosize',
            value: employeeStandard,
        });


        APPLY_BTN = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
        });

        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        addPositionPopup.appendChild(heading);

        addPositionPopup.appendChild(taskInput);
        addPositionPopup.appendChild(descriptionInput);
        addPositionPopup.appendChild(newStartDate);
        addPositionPopup.appendChild(newEndDate);
        addPositionPopup.appendChild(initialPerformanceDropdown);
        addPositionPopup.appendChild(initialPerformanceNotesInput);
        addPositionPopup.appendChild(employeeStandardInput);
        taskInput.classList.add('disabled');

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        if ($.session.EmploymentUpdate) {
            popupbtnWrap.appendChild(APPLY_BTN);
        }
        popupbtnWrap.appendChild(CANCEL_BTN);
        addPositionPopup.appendChild(popupbtnWrap);

        POPUP.show(addPositionPopup);
        PopupEventListeners();
        populateDropdowns();
        checkRequiredFieldsOfPopup();
    }

    function PopupEventListeners() {
        taskInput.addEventListener('input', event => {
            task = event.target.value;
        });

        descriptionInput.addEventListener('input', event => {
            description = event.target.value;
        });
        newStartDate.addEventListener('input', event => {
            startDate = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        newEndDate.addEventListener('input', event => {
            endDate = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        initialPerformanceDropdown.addEventListener('change', event => {
            initialPerformanceID = event.target.value;
        });

        initialPerformanceNotesInput.addEventListener('input', event => {
            initialPerformanceNotes = event.target.value;
        });

        employeeStandardInput.addEventListener('input', event => {
            employeeStandard = event.target.value;
        });

        APPLY_BTN.addEventListener('click', () => {
            APPLY_BTN.classList.add('disabled');
            saveNewPositionPopup();
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(addPositionPopup);
        });
    }

    function checkRequiredFieldsOfPopup() {
        var startDate = newStartDate.querySelector('#newStartDate');
        var endDate = newEndDate.querySelector('#newEndDate');

        if (startDate.value === '' || (endDate.value != '' && startDate.value > endDate.value)) {
            newStartDate.classList.add('errorPopup');
        } else {
            newStartDate.classList.remove('errorPopup');
        }

        setBtnStatusOfPopup();
    }

    function setBtnStatusOfPopup() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            APPLY_BTN.classList.add('disabled');
            return;
        } else {
            APPLY_BTN.classList.remove('disabled');
        }
    }

    async function populateDropdowns() {
        const {
            getInitialPerformanceDropdownResult: InitialPerformance,
        } = await EmploymentAjax.getInitialPerformanceDropdownAsync();
        let initialPerformanceData = InitialPerformance.map((initialPerformance) => ({
            id: initialPerformance.initialPerformanceId,
            value: initialPerformance.initialPerformanceId,
            text: initialPerformance.initialPerformanceName
        }));
        initialPerformanceData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("initialPerformanceDropdown", initialPerformanceData, initialPerformance);
    }

    async function saveNewPositionPopup() {
        const result = await EmploymentAjax.insertPositionTaskAsync(actualTaskNumber, description, startDate, endDate, initialPerformanceID, initialPerformanceNotes, employeeStandard, PositionId, jobTaskID, $.session.UserId);
        const { insertPositionTaskResult } = result;

        if (insertPositionTaskResult.jobTaskId != null) {
            NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID, tabPositionIndex = 2);
        }
        POPUP.hide(addPositionPopup);
    }

    return {
        init,
        buildNewPositionForm,
        getMarkup,
    };
})(); 