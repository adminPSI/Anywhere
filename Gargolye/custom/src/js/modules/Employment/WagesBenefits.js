const WagesBenefits = (() => {
    let WagesEntriesTable = [];
    let PositionId;
    let EmploymentsEntries;
    let wagesID;
    let CheckBoxEntries;
    let vacationSickChk;
    let retirementChk;
    let medicialChk;
    let DiscountChk;
    let otherChk;
    let otherValue;
    let isOverLapRecord = false;

    async function init(positionId) {
        PositionId = positionId;
        if (PositionId != undefined) {
            EmploymentsEntries = await EmploymentAjax.getWagesEntriesAsync(PositionId);
            CheckBoxEntries = await EmploymentAjax.getWagesCheckboxEntriesAsync(PositionId);
        }
    }


    function getMarkup() {
        const wagesInfoWrap = document.createElement('div');
        wagesInfoWrap.classList.add('planSummary');

        if (PositionId != undefined) {
            const importantTables = buildNewWagesBenefitsForm();
            wagesInfoWrap.appendChild(importantTables);
        }
        else {
            const heading = document.createElement('h2');
            heading.innerHTML = 'Wages & Benefits';
            heading.classList.add('sectionHeading');
            wagesInfoWrap.appendChild(heading);
        }
        return wagesInfoWrap;
    }

    function buildNewWagesBenefitsForm() {
        const wagesDiv = document.createElement('div');
        wagesDiv.classList.add('additionalQuestionWrap');
        otherInputText = '';

        vacationSickChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].vacationSick;
        retirementChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].medical;
        medicialChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].retirement;
        DiscountChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].empDiscount;
        otherChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].other;
        otherValue = CheckBoxEntries.getWagesCheckboxEntriesResult[0].otherText;

        vacationSickchkBox = input.buildCheckbox({
            text: 'Vacation/Sick',
            id: 'chkVacationSick',
            isChecked: vacationSickChk == 'Y' ? true : false,
            style: 'secondary',
            callback: () => saveWagesChecked('VacationSick', event.target.checked, null),
        });

        medicalVisionchkbox = input.buildCheckbox({
            text: 'Medical/Dental/Vision',
            id: 'chkmedicalVision',
            isChecked: medicialChk == 'Y' ? true : false,
            style: 'secondary',
            callback: () => saveWagesChecked('Medical', event.target.checked, null),
        });

        retirementchkBox = input.buildCheckbox({
            text: 'Retirement',
            id: 'chkRetirement',
            isChecked: retirementChk == 'Y' ? true : false,
            style: 'secondary',
            callback: () => saveWagesChecked('Retirement', event.target.checked, null),
        });

        empDiscountchkBox = input.buildCheckbox({
            text: 'Employee Discount',
            id: 'chkEmpDiscount',
            isChecked: DiscountChk == 'Y' ? true : false,
            style: 'secondary',
            callback: () => saveWagesChecked('empDiscount', event.target.checked, null),
        });

        otherchkBox = input.buildCheckbox({
            text: 'Other',
            id: 'chkOther',
            isChecked: otherChk == 'Y' ? true : false,
            style: 'secondary',
            callback: () => otherChecked(event.target.checked),
        });

        otherInput = input.build({
            type: 'text',
            id: 'otherInput',
            style: 'secondary',
            value: otherValue,
        });

        NEW_WAGES_BTN = button.build({
            text: '+ NEW WAGES',
            style: 'secondary',
            type: 'contained',
            callback: () => addWagesPopupBtn()
        });
        WagesEntriesTable = buildWagesEntriesTable();

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Wages & Benefits</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        if ($.session.EmploymentUpdate) {
            addNewCardBody.appendChild(NEW_WAGES_BTN);
        }

        addNewCardBody.appendChild(WagesEntriesTable);

        const consumerNameDisplay = document.createElement("p");
        consumerNameDisplay.classList.add("headline");
        consumerNameDisplay.innerHTML = `<h2>${'Benefits'}</h2>`;
        consumerNameDisplay.style.marginTop = '20px';
        addNewCardBody.appendChild(consumerNameDisplay);

        var chkDiv = document.createElement('div');
        chkDiv.style.marginTop = '20px'
        chkDiv.appendChild(vacationSickchkBox);
        addNewCardBody.appendChild(chkDiv);


        var chkDiv1 = document.createElement('div');
        chkDiv1.appendChild(medicalVisionchkbox);
        addNewCardBody.appendChild(chkDiv1);

        var chkDiv2 = document.createElement('div');
        chkDiv2.appendChild(retirementchkBox);
        addNewCardBody.appendChild(chkDiv2);

        var chkDiv3 = document.createElement('div');
        chkDiv3.appendChild(empDiscountchkBox);
        addNewCardBody.appendChild(chkDiv3);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('employmentMsgWrap');
        btnWrap.appendChild(otherchkBox);
        otherInput.style.width = '80%';
        otherInput.style.marginLeft = '2%';
        btnWrap.appendChild(otherInput);
        addNewCardBody.appendChild(btnWrap);

        wagesDiv.appendChild(column1);
        eventListeners();
        disableCheckBox();
        return wagesDiv;

    }

    function eventListeners() {
        otherInput.addEventListener('focusout', event => {
            otherInputText = event.target.value;
            saveWagesChecked('other', true, otherInputText);
        });
    }

    function disableCheckBox() {
        if ($.session.EmploymentUpdate) {
            vacationSickchkBox.classList.remove('disabled');
            medicalVisionchkbox.classList.remove('disabled');
            retirementchkBox.classList.remove('disabled');
            empDiscountchkBox.classList.remove('disabled');
            otherchkBox.classList.remove('disabled');
        }
        else {
            vacationSickchkBox.classList.add('disabled');
            medicalVisionchkbox.classList.add('disabled');
            retirementchkBox.classList.add('disabled');
            empDiscountchkBox.classList.add('disabled');
            otherchkBox.classList.add('disabled');

        }
        otherInput.classList.add('disabled');
    }

    function buildWagesEntriesTable() {

        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            columnHeadings: ['Hours/Week', 'Hourly Wages', 'Start Date', 'End Date'],
        };

        let tableData = EmploymentsEntries.getWagesEntriesResult.map((entry) => ({
            values: [entry.hoursPerWeek, entry.wagesPerHour, entry.startDate, entry.endDate],
            attributes: [{ key: 'wagesId', value: entry.wagesId }],
            onClick: (e) => {
                handleAccountTableEvents(e.target.attributes.wagesId.value)
            },
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    function handleAccountTableEvents(wagesId) {
        addWagesPopupBtn(wagesId)
    }

    function addWagesPopupBtn(wagesId) {
        if (wagesId == 0 || wagesId == undefined) {
            hoursWeek = '';
            hoursWages = '';
            startDate = '';
            endDate = '';
        }
        else {
            let empValue = EmploymentsEntries.getWagesEntriesResult.find(x => x.wageId == wagesId);
            hoursWeek = empValue.hoursPerWeek;
            hoursWages = empValue.wagesPerHour;
            startDate = moment(empValue.startDate).format('YYYY-MM-DD');
            endDate = moment(empValue.endDate).format('YYYY-MM-DD');
        }


        addWagesPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '20px';
        if (wagesId) {
            heading.innerText = 'Update Wage/Hours';
            wagesID = wagesId;
        }
        else {
            heading.innerText = 'Add Wage/Hours';
            wagesID = 0;
        }


        // dropdowns & inputs
        weekHours = input.build({
            id: 'weekHours',
            type: 'text',
            label: 'Hours Per Week',
            style: 'secondary',
            value: hoursWeek,
        });

        wagesHours = input.build({
            id: 'wagesHours',
            type: 'text',
            label: 'Wages Per Hour',
            style: 'secondary',
            value: '$' + hoursWages,
        });

        newStartDate = input.build({
            id: 'newStartDate',
            type: 'date',
            label: 'New Path Strat Date',
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

        addWagesPopup.appendChild(heading);

        addWagesPopup.appendChild(weekHours);
        addWagesPopup.appendChild(wagesHours);
        addWagesPopup.appendChild(newStartDate);
        addWagesPopup.appendChild(newEndDate);


        var confirmMessage = document.createElement('div');
        confirmMessage.innerHTML = `<h3 id="confirmMessage" class="confirmMessage password-warning"></h3>`;
        addWagesPopup.appendChild(confirmMessage);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        if ($.session.EmploymentUpdate) {
            popupbtnWrap.appendChild(APPLY_BTN);
        }
        popupbtnWrap.appendChild(CANCEL_BTN);
        addWagesPopup.appendChild(popupbtnWrap);

        POPUP.show(addWagesPopup);
        PopupEventListeners();
        checkRequiredFieldsOfPopup();
    }

    function PopupEventListeners() {
        weekHours.addEventListener('input', event => {
            hoursWeek = event.target.value;
            if (hoursWeek.includes('.') && (hoursWeek.match(/\./g).length > 1 || hoursWeek.toString().split('.')[1].length > 2)) {
                document.getElementById('weekHours').value = hoursWeek.substring(0, hoursWeek.length - 1);
                return;
            }
            checkRequiredFieldsOfPopup();
        });

        wagesHours.addEventListener('input', event => {
            hoursWages = event.target.value;
            if (hoursWages.includes('.') && (hoursWages.match(/\./g).length > 1 || hoursWages.toString().split('.')[1].length > 2)) {
                document.getElementById('wagesHours').value = hoursWages.substring(0, hoursWages.length - 1);
                return;
            }
            checkRequiredFieldsOfPopup();
        });
        newStartDate.addEventListener('input', event => {
            startDate = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        newEndDate.addEventListener('input', event => {
            endDate = event.target.value;
        });

        APPLY_BTN.addEventListener('click', () => {
            saveNewWagesPopup();
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(addWagesPopup);
        });
    }

    function checkRequiredFieldsOfPopup() {
        var weekPerHour = weekHours.querySelector('#weekHours');
        var wagesPerHour = wagesHours.querySelector('#wagesHours');
        var startDate = newStartDate.querySelector('#newStartDate');

        if (weekPerHour.value === '') {
            weekHours.classList.add('errorPopup');
        } else {
            weekHours.classList.remove('errorPopup');
        }

        if (wagesPerHour.value === '' || wagesPerHour.value === '$') {
            wagesHours.classList.add('errorPopup');
        } else {
            wagesHours.classList.remove('errorPopup');
        }

        if (startDate.value === '') {
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

    function otherChecked(event) {
        if (event == true) {
            otherInput.classList.remove('disabled');
        } else {
            otherInput.classList.add('disabled');
            otherValue = '';
            otherInput.querySelector('#otherInput').value = '';
            saveWagesChecked('other', false, '');

        }
    }

    async function saveNewWagesPopup() {
        const result = await EmploymentAjax.insertWagesAsync(hoursWeek, hoursWages.replace('$', ''), startDate, endDate, PositionId, wagesID, $.session.UserId);
        const { insertWagesResult } = result;
        var messagetext = document.getElementById('confirmMessage');
        messagetext.innerHTML = ``;
        if (insertWagesResult.wagesId == '-1') {
            messagetext.innerHTML = 'This record overlaps with an existing record. Changes cannot saved.';
            messagetext.classList.add('password-error');
        }
        else {
            buildNewWagesBenefitsForm()
            POPUP.hide(addWagesPopup);
        }

    }

    async function saveWagesChecked(chkboxName, event, textboxValue) {
        let IsChacked = event == true ? 'Y' : 'N';
        const result = await EmploymentAjax.saveCheckboxWagesAsync(chkboxName, IsChacked, PositionId, textboxValue, $.session.UserId);
        const { saveCheckboxWagesResult } = result;

    }

    return {
        init,
        buildNewWagesBenefitsForm,
        getMarkup,
    };
})(); 