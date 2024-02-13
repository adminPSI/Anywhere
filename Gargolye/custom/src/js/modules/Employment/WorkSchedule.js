const WorkSchedule = (() => {

    let workScheduleEntriesTable = [];
    let PositionId;
    let ScheduleEntries;
    let WorkScheduleID;
    let consumersID;
    let name;
    let positionName;
    let selectedConsumersName;
    let startTime;
    let endTime;
    let weekDaysSelection = [];
    let nameOfEvent;
    let toRemoveWeekName;

    async function init(positionId, Name, PositionName, SelectedConsumersName, ConsumersId) {
        PositionId = positionId;
        consumersID = ConsumersId;
        name = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;
        if (PositionId != undefined) {
            ScheduleEntries = await EmploymentAjax.getWorkScheduleEntriesAsync(PositionId);
            if (ScheduleEntries.getWorkScheduleEntriesResult.length > 0)
                ScheduleEntries.getWorkScheduleEntriesResult.push({ dayOfWeek: '', startTime: '', endTime: '', positionId: null, WorkScheduleId: '', timeInHours: 'Total Hours - ' + ScheduleEntries.getWorkScheduleEntriesResult[0].totalHours, totalHours: '' });
        }
    }

    function toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`;
    }
    function padToTwoDigits(num) {
        return num.toString().padStart(2, "0");
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
            callback: () => addWorkSchedulePopupBtn(0, 'Add')
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
            tableId: 'employmentWorkScheduleTable',
            columnHeadings: ['Day Of Week', 'Start Time', 'End Time', 'Hours'],
            endIcon: $.session.EmploymentUpdate == true ? true : false,
            secondendIcon: $.session.EmploymentDelete == true ? true : false,
        };

        let tableData = ScheduleEntries.getWorkScheduleEntriesResult.map((entry) => ({
            values: [entry.dayOfWeek == 1 ? 'Sunday' : entry.dayOfWeek == 2 ? 'Monday' : entry.dayOfWeek == 3 ? 'Tuesday' : entry.dayOfWeek == 4 ? 'Wednesday' : entry.dayOfWeek == 5 ? 'Thursday' : entry.dayOfWeek == 6 ? 'Friday' : entry.dayOfWeek == 7 ? 'Saturday' : '', UTIL.convertFromMilitary(entry.startTime), UTIL.convertFromMilitary(entry.endTime), entry.timeInHours],
            attributes: [{ key: 'WorkScheduleId', value: entry.WorkScheduleId }, { key: 'data-plan-active', value: entry.startTime == '' ? 'true' : 'false' }, { key: 'deleteHide', value: $.session.EmploymentDelete == true ? 'true' : 'false' }, { key: 'copyHide', value: $.session.EmploymentUpdate == true ? 'true' : 'false' }],
            onClick: (e) => {
                if ($.session.EmploymentUpdate && e.target.attributes[2].value == 'false') {
                    addWorkSchedulePopupBtn(e.target.attributes.WorkScheduleId.value, 'Edit')
                }
            },
            endIcon: $.session.EmploymentUpdate == true && entry.dayOfWeek != '' ? `${icons['copy']}` : `${icons['Empty']}`,
            endIconCallback: (e) => {
                addWorkSchedulePopupBtn(entry.WorkScheduleId, 'Copy');
            },
            secondendIcon: $.session.EmploymentDelete == true && entry.dayOfWeek != '' ? `${icons['delete']}` : `${icons['Empty']}`,
            secondendIconCallback: (e) => {
                deleteWorkSchedulePOPUP(entry.WorkScheduleId);
            },
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    function deleteWorkSchedulePOPUP(WorkScheduleId) {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                deleteWorkSchedule(WorkScheduleId, confirmPopup);
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

        message.innerText = 'Are you sure you would like to remove this Work Schedule record?';
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

    function deleteWorkSchedule(WorkScheduleId, confirmPopup) {
        EmploymentAjax.deleteWorkSchedule(
            {
                WorkScheduleID: WorkScheduleId
            },
            function (results) {
                if (results = 'sucess') {
                    POPUP.hide(confirmPopup);
                    NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID, tabPositionIndex = 3);
                }
            },
        );
    }

    function addWorkSchedulePopupBtn(WorkScheduleId, eventName) {
        if (WorkScheduleId == 0 || WorkScheduleId == undefined) {
            dayOfWeek = '';
            startTime = '';
            endTime = '';
        }
        else {
            let workScheduleValue = ScheduleEntries.getWorkScheduleEntriesResult.find(x => x.WorkScheduleId == WorkScheduleId);
            dayOfWeek = workScheduleValue.dayOfWeek;
            toRemoveWeekName = workScheduleValue.dayOfWeek;
            startTime = workScheduleValue.startTime;
            endTime = workScheduleValue.endTime;
        }
        addWorkSchedulePopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '20px';
        if (eventName == 'Edit') {
            heading.innerText = 'Update Shift';
            WorkScheduleID = WorkScheduleId;
            nameOfEvent = 'Edit'
        }
        else if (eventName == 'Copy') {
            heading.innerText = 'Copy Shift';
            WorkScheduleID = WorkScheduleId;
            nameOfEvent = 'Copy'
        }
        else {
            heading.innerText = 'New Shift';
            WorkScheduleID = 0;
            nameOfEvent = 'Add'
        }

        // Checkbox
        var checkboxlable = document.createElement('div');
        checkboxlable.innerHTML = `<h3 id="checkboxlable" >Day(s) Of Week</h3>`;

        sundaychkBox = input.buildCheckbox({
            text: 'Sun',
            id: 'sundaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });
        mondaychkBox = input.buildCheckbox({
            text: 'Mon',
            id: 'mondaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });
        tuesdaychkBox = input.buildCheckbox({
            text: 'Tue',
            id: 'tuesdaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });
        wednesdaychkBox = input.buildCheckbox({
            text: 'Wed',
            id: 'wednesdaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });
        thursdaychkBox = input.buildCheckbox({
            text: 'Thu',
            id: 'thursdaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });
        fridaychkBox = input.buildCheckbox({
            text: 'Fri',
            id: 'fridaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });
        saturdaychkBox = input.buildCheckbox({
            text: 'Sat',
            id: 'saturdaychkBox',
            isChecked: false,
            style: 'secondary',
            callback: () => checkRequiredFieldsOfPopup(),
        });

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
            label: 'Start Time',
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


        if (WorkScheduleId == 0 || WorkScheduleId == undefined) {
            addWorkSchedulePopup.appendChild(checkboxlable);
            var dayChkWrap = document.createElement('div');
            dayChkWrap.classList.add('chkWrap');
            dayChkWrap.appendChild(sundaychkBox);
            dayChkWrap.appendChild(mondaychkBox);
            dayChkWrap.appendChild(tuesdaychkBox);
            dayChkWrap.appendChild(wednesdaychkBox);
            dayChkWrap.appendChild(thursdaychkBox);
            dayChkWrap.appendChild(fridaychkBox);
            dayChkWrap.appendChild(saturdaychkBox);
            addWorkSchedulePopup.appendChild(dayChkWrap);
        } else {
            addWorkSchedulePopup.appendChild(dayOfWeekDropdown);
        }


        var timebtnWrap = document.createElement('div');
        timebtnWrap.classList.add('btnWrap');
        NewStartTime.style.marginLeft = '1%';
        NewStartTime.style.width = '48%';
        timebtnWrap.appendChild(NewStartTime);
        NewEndTime.style.marginLeft = '2%';
        NewEndTime.style.width = '48%';
        timebtnWrap.appendChild(NewEndTime);
        addWorkSchedulePopup.appendChild(timebtnWrap);

        var confirmMessage = document.createElement('div');
        confirmMessage.innerHTML = `<h3 id="confirmMessage" class="confirmMessage password-warning"></h3>`;
        addWorkSchedulePopup.appendChild(confirmMessage);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        if ($.session.EmploymentUpdate) {
            popupbtnWrap.appendChild(APPLY_BTN);
        }
        popupbtnWrap.appendChild(CANCEL_BTN);
        addWorkSchedulePopup.appendChild(popupbtnWrap);

        POPUP.show(addWorkSchedulePopup);
        PopupEventListeners();
        populateWeekDaysDropdown();
        checkRequiredFieldsOfPopup();
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

        if (nameOfEvent == 'Add') {
            var sundaychk = sundaychkBox.querySelector('#sundaychkBox');
            var mondaychk = mondaychkBox.querySelector('#mondaychkBox');
            var tuesdaychk = tuesdaychkBox.querySelector('#tuesdaychkBox');
            var wednesdaychk = wednesdaychkBox.querySelector('#wednesdaychkBox');
            var thursdaychk = thursdaychkBox.querySelector('#thursdaychkBox');
            var fridaychk = fridaychkBox.querySelector('#fridaychkBox');
            var saturdaychk = saturdaychkBox.querySelector('#saturdaychkBox');

            var chklable = document.getElementById('checkboxlable');

            if (!sundaychk.checked && !mondaychk.checked && !tuesdaychk.checked && !wednesdaychk.checked && !thursdaychk.checked && !fridaychk.checked && !saturdaychk.checked) {
                chklable.classList.add('errorPopup');
                chklable.classList.add('password-error');
            }
            else {
                chklable.classList.remove('errorPopup');
                chklable.classList.remove('password-error');
            }
        } else if (nameOfEvent == 'Edit') {
            if (dayOfWeek === '') {
                dayOfWeekDropdown.classList.add('errorPopup');
            } else {
                dayOfWeekDropdown.classList.remove('errorPopup');
            }
        }
        else {
            if (weekDay.value === '') {
                dayOfWeekDropdown.classList.add('errorPopup');
            } else {
                dayOfWeekDropdown.classList.remove('errorPopup');
            }

        }

        if (timeEnd.value === '' || timeStart.value > timeEnd.value) {
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
        if (nameOfEvent == 'Copy') {
            const index = dayOfWeekDropdownData.findIndex(x => x.value == toRemoveWeekName);
            if (index > -1) {
                dayOfWeekDropdownData.splice(index, 1);
            }
        }
        dropdown.populate("dayOfWeekDropdown", dayOfWeekDropdownData, dayOfWeek);
    }


    async function saveNewWagesPopup() {
        weekDaysSelection = []; 
        if (nameOfEvent == 'Add') {
            if (sundaychkBox.querySelector('#sundaychkBox').checked) weekDaysSelection.push(1)
            if (mondaychkBox.querySelector('#mondaychkBox').checked) weekDaysSelection.push(2)
            if (tuesdaychkBox.querySelector('#tuesdaychkBox').checked) weekDaysSelection.push(3)
            if (wednesdaychkBox.querySelector('#wednesdaychkBox').checked) weekDaysSelection.push(4)
            if (thursdaychkBox.querySelector('#thursdaychkBox').checked) weekDaysSelection.push(5)
            if (fridaychkBox.querySelector('#fridaychkBox').checked) weekDaysSelection.push(6)
            if (saturdaychkBox.querySelector('#saturdaychkBox').checked) weekDaysSelection.push(7)
        } else if (nameOfEvent == 'Edit') {
            weekDaysSelection.push(dayOfWeek)
        } else {
            weekDaysSelection.push(dayOfWeek)
            WorkScheduleID = 0;  
        }

        const result = await EmploymentAjax.insertWorkScheduleAsync(weekDaysSelection, startTime, endTime, PositionId, WorkScheduleID, $.session.UserId);
        const { insertWorkScheduleResult } = result;

        var messagetext = document.getElementById('confirmMessage');
        messagetext.innerHTML = ``;
        if (insertWorkScheduleResult.WorkScheduleId == '-1') {
            messagetext.innerHTML = 'This record overlaps with an existing record. Changes cannot be saved.';
            messagetext.classList.add('password-error');
        }
        else {
            NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID, tabPositionIndex = 3);
            POPUP.hide(addWorkSchedulePopup);
        }
    }

    return {
        init,
        buildNewWorkScheduleForm,
        getMarkup,
    };
})(); 