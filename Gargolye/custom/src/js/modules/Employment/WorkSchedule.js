const WorkSchedule = (() => {

    let workScheduleEntriesTable = [];
    let PositionId;
    let ScheduleEntries;
    let WorkScheduleID;

    async function init(positionId) {
        PositionId = positionId;
        if (PositionId != undefined) {
            ScheduleEntries = await EmploymentAjax.getWorkScheduleEntriesAsync(PositionId);
        }
    }


    function getMarkup() {
        const workScheduleWrap = document.createElement('div');
        workScheduleWrap.classList.add('planSummary');

        if (PositionId != undefined) {
            const importantTables = buildNewWorkScheduleForm();
            workScheduleWrap.appendChild(importantTables);
        }
        else {
            const heading = document.createElement('h2');
            heading.innerHTML = 'Work Schedule';
            heading.classList.add('sectionHeading');
            workScheduleWrap.appendChild(heading);
        }



        return workScheduleWrap;
    }

    function buildNewWorkScheduleForm() {
        const workScheduleDiv = document.createElement('div');
        workScheduleDiv.classList.add('additionalQuestionWrap');

        NEW_SHIFT_BTN = button.build({
            text: '+ ADD NEW SHIFT',
            style: 'secondary',
            type: 'contained',
            callback: () => addWorkSchedulePopupBtn()
        });
        workScheduleEntriesTable = buildworkScheduleEntriesTable();


        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Work Schedule</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)
        if ($.session.EmploymentUpdate) {
            addNewCardBody.appendChild(NEW_SHIFT_BTN);
        }
        addNewCardBody.appendChild(workScheduleEntriesTable);
        workScheduleDiv.appendChild(column1);
        return workScheduleDiv;
    }


    function buildworkScheduleEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            columnHeadings: ['Day Of Week', 'Start Time', 'End Time'],
        };

        let tableData = ScheduleEntries.getWorkScheduleEntriesResult.map((entry) => ({
            values: [entry.dayOfWeek, entry.startTime, entry.endTime],
            attributes: [{ key: 'WorkScheduleId', value: entry.WorkScheduleId }],
            onClick: (e) => {
                handleAccountTableEvents(e.target.attributes.WorkScheduleId.value)
            },
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    function handleAccountTableEvents(WorkScheduleId) {
        addWorkSchedulePopupBtn(WorkScheduleId)
    }

    function addWorkSchedulePopupBtn(WorkScheduleId) {
        if (WorkScheduleId == 0 || WorkScheduleId == undefined) {
            dayOfWeek = '';
            startTime = '';
            endTime = '';
        }
        else {
            let workScheduleValue = ScheduleEntries.getWorkScheduleEntriesResult.find(x => x.WorkScheduleId == WorkScheduleId);
            dayOfWeek = workScheduleValue.dayOfWeek;
            startTime = moment(workScheduleValue.startTime).format('YYYY-MM-DD');
            endTime = moment(workScheduleValue.endTime).format('YYYY-MM-DD');
            
           
        }
        addWorkSchedulePopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '20px';
        if (WorkScheduleId) {
            heading.innerText = 'Update Shift';
            WorkScheduleID = WorkScheduleId;
        }
        else {
            heading.innerText = 'New New';
            WorkScheduleID = 0;
        }


        // dropdowns & inputs
        dayOfWeekDropdown = dropdown.build({
            id: 'dayOfWeekDropdown',
            label: "Day Of Week",
            dropdownId: "dayOfWeekDropdown",
            value: (dayOfWeek) ? dayOfWeek : '',
        });

        NewStartTime = input.build({
            id: 'NewStartTime',
            type: 'time',
            label: 'Strat Time',
            style: 'secondary',
            value: startTime,
        });

        NewEndTime = input.build({
            id: 'NewEndTime',
            type: 'time',
            label: 'End Time',
            style: 'secondary',
            value: endTime,
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

        addWorkSchedulePopup.appendChild(heading);

        addWorkSchedulePopup.appendChild(dayOfWeekDropdown);

        var timebtnWrap = document.createElement('div');
        timebtnWrap.classList.add('btnWrap');
        timebtnWrap.appendChild(NewStartTime);
        timebtnWrap.appendChild(NewEndTime);
        addWorkSchedulePopup.appendChild(timebtnWrap);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        if ($.session.EmploymentUpdate) {
            popupbtnWrap.appendChild(APPLY_BTN);
        }
        popupbtnWrap.appendChild(CANCEL_BTN);
        addWorkSchedulePopup.appendChild(popupbtnWrap);

        POPUP.show(addWorkSchedulePopup);
        PopupEventListeners();
        checkRequiredFieldsOfPopup();
        populateWeekDaysDropdown();
    }

    function PopupEventListeners() {
        dayOfWeekDropdown.addEventListener('change', event => {
            dayOfWeek = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        NewStartTime.addEventListener('change', event => {
            startTime = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        NewEndTime.addEventListener('change', event => {
            endTime = event.target.value;
            checkRequiredFieldsOfPopup();
        });

        APPLY_BTN.addEventListener('click', () => {
            saveNewWagesPopup();
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(addWorkSchedulePopup);
        });
    }

    function checkRequiredFieldsOfPopup() {
        var weekDay = dayOfWeekDropdown.querySelector('#dayOfWeekDropdown');
        var timeEnd = NewEndTime.querySelector('#NewEndTime');
        var timeStart = NewStartTime.querySelector('#NewStartTime');

        if (weekDay.value === '') {
            dayOfWeekDropdown.classList.add('errorPopup');
        } else {
            dayOfWeekDropdown.classList.remove('errorPopup');
        }

        if (timeEnd.value === '') {
            NewEndTime.classList.add('errorPopup');
        } else {
            NewEndTime.classList.remove('errorPopup');
        }

        if (timeStart.value === '') {
            NewStartTime.classList.add('errorPopup');
        } else {
            NewStartTime.classList.remove('errorPopup');
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


    function populateWeekDaysDropdown() {
        const dayOfWeekDropdownData = ([
            { id: 1, value: 1, text: 'Sunday' },
            { id: 2, value: 2, text: 'Monday' },
            { id: 3, value: 3, text: 'Tuesday' },
            { id: 4, value: 4, text: 'Wednesday' },
            { id: 5, value: 5, text: 'Thursday' },
            { id: 6, value: 6, text: 'Friday' },
            { id: 7, value: 7, text: 'Saturday' }, 

        ]);
        dayOfWeekDropdownData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("dayOfWeekDropdown", dayOfWeekDropdownData, dayOfWeek);
    }


    async function saveNewWagesPopup() {
        const result = await EmploymentAjax.insertWorkScheduleAsync(dayOfWeek, startTime, endTime, PositionId, WorkScheduleID, $.session.UserId);
        const { insertWagesResult } = result;
        if (insertWagesResult.WorkScheduleId != null) {
            buildNewWorkScheduleForm()
        }
        POPUP.hide(addWorkSchedulePopup);
    }


    return {
        init,
        buildNewWorkScheduleForm,
        getMarkup,
    };
})(); 