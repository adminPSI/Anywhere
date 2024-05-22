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
    let consumersID;
    let name;
    let positionName;
    let selectedConsumersName;
    let eligibleBenefits;

    //CheckBoxs
    let eligibleBenefitschkBox;
    let vacationSickchkBox;
    let medicalVisionchkbox;
    let retirementchkBox;
    let empDiscountchkBox;
    let otherchkBox;
    let otherInput;

    async function init(positionId, Name, PositionName, SelectedConsumersName, ConsumersId) {
        PositionId = positionId;
        consumersID = ConsumersId;
        name = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;
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
        retirementChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].retirement;
        medicialChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].medical;
        DiscountChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].empDiscount;
        otherChk = CheckBoxEntries.getWagesCheckboxEntriesResult[0].other;
        otherValue = CheckBoxEntries.getWagesCheckboxEntriesResult[0].otherText;
        eligibleBenefits = CheckBoxEntries.getWagesCheckboxEntriesResult[0].eligibleBenefits;

        eligibleBenefitschkBox = input.buildCheckbox({
            text: 'Eligible For Benefits',
            id: 'chkEligibleBenefits',
            isChecked: eligibleBenefits == 'Y' ? true : false,
            style: 'secondary',
            callback: event => {
                saveWagesChecked('EligibleForBenifit', event.target.checked, null);
                eligibleBenefits = event.target.checked == true ? 'Y' : 'N';
                if (event.target.checked == false) {
                    checkBoxValidation();
                }
                disableCheckBox();
            }
        });

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

        var chk1Div = document.createElement('div');
        chk1Div.style.marginTop = '20px';
        chk1Div.appendChild(eligibleBenefitschkBox);
        addNewCardBody.appendChild(chk1Div);

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
            if (!otherInput.classList.contains('disabled')) {
                otherInputText = event.target.value;
                saveWagesChecked('other', true, otherInputText);
            }
        });
    }

    function disableCheckBox() {
        if ($.session.EmploymentUpdate && eligibleBenefits == 'Y') {
            vacationSickchkBox.classList.remove('disabled');
            medicalVisionchkbox.classList.remove('disabled');
            retirementchkBox.classList.remove('disabled');
            empDiscountchkBox.classList.remove('disabled');
            otherchkBox.classList.remove('disabled');
            if (otherChk == 'Y') {
                otherInput.classList.remove('disabled');
            } else {
                otherInput.classList.add('disabled');
            }
        }
        else {
            vacationSickchkBox.classList.add('disabled');
            medicalVisionchkbox.classList.add('disabled');
            retirementchkBox.classList.add('disabled');
            empDiscountchkBox.classList.add('disabled');
            otherchkBox.classList.add('disabled');
            otherInput.classList.add('disabled');
        }
    }

    function buildWagesEntriesTable() {

        const tableOptions = {
            plain: false,
            tableId: 'employmentCommonTable',
            columnHeadings: ['Avg Hours Per Week', 'Avg Wages Per Week', 'Start Date', 'End Date'],
            endIcon: $.session.EmploymentDelete == true ? true : false,
        };

        let tableData = EmploymentsEntries.getWagesEntriesResult.map((entry) => ({
            values: [entry.hoursPerWeek, '$' + parseFloat(entry.wagesPerHour).toFixed(2), moment(entry.startDate).format('MM/DD/YYYY'), entry.endDate == '' ? '' : moment(entry.endDate).format('MM/DD/YYYY')],
            attributes: [{ key: 'wagesId', value: entry.wagesId }],
            onClick: (e) => {
                if ($.session.EmploymentUpdate) {
                    handleAccountTableEvents(e.target.attributes.wagesId.value)
                }
            },
            endIcon: $.session.EmploymentDelete == true ? `${icons['delete']}` : '',
            endIconCallback: (e) => {
                deleteWagesBenefitsPOPUP(entry.wagesId);
            },
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    function handleAccountTableEvents(wagesId) {
        addWagesPopupBtn(wagesId)
    }

    function deleteWagesBenefitsPOPUP(wagesId) {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                deleteWagesBenefits(wagesId, confirmPopup);
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

        message.innerText = 'Are you sure you would like to remove this Wage & Benefit record?';
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

    function deleteWagesBenefits(wagesId, confirmPopup) {
        EmploymentAjax.deleteWagesBenefits(
            {
                wagesID: wagesId
            },
            function (results) {
                if (results = 'sucess') {
                    POPUP.hide(confirmPopup);
                    NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID, tabPositionIndex = 1);
                }
            },
        );
    }

    function addWagesPopupBtn(wagesId) {
        if (wagesId == 0 || wagesId == undefined) {
            hoursWeek = '';
            hoursWages = '';
            startDate = '';
            endDate = '';
        }
        else {
            let empValue = EmploymentsEntries.getWagesEntriesResult.find(x => x.wagesId == wagesId);
            hoursWeek = empValue.hoursPerWeek;
            hoursWages = parseFloat(empValue.wagesPerHour).toFixed(2);
            startDate = moment(empValue.startDate).format('YYYY-MM-DD');
            endDate = empValue.endDate == '' ? '' : moment(empValue.endDate).format('YYYY-MM-DD');
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
            type: 'number',
            label: 'Hours Per Week',
            style: 'secondary',
            value: hoursWeek,
            attributes: [
                { key: 'min', value: '0' }
            ],
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
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(hoursWeek)) {
                document.getElementById('weekHours').value = '';
            }
            else if (hoursWeek.includes('.') && (hoursWeek.match(/\./g).length > 1 || hoursWeek.toString().split('.')[1].length > 2)) {
                document.getElementById('weekHours').value = '';
            }
            if (hoursWeek.includes('-') || hoursWeek.includes(' ')) {
                document.getElementById('weekHours').value = '';
            }
            checkRequiredFieldsOfPopup();
        });

        wagesHours.addEventListener('input', event => {
            hoursWages = event.target.value;
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(hoursWages)) {
                document.getElementById('wagesHours').value = '$';
            }
            else if (hoursWages.includes('.') && (hoursWages.match(/\./g).length > 1 || hoursWages.toString().split('.')[1].length > 2)) {
                document.getElementById('wagesHours').value = '$';
            }
            if (hoursWages.includes('-') || hoursWages.includes(' ')) {
                document.getElementById('wagesHours').value = '$';
            }
            if (hoursWages.includes('$') && hoursWages.match(/\$/g).length > 1) {
                document.getElementById('wagesHours').value = '$';
            }  
            checkRequiredFieldsOfPopup();
        });
        newStartDate.addEventListener('input', event => {
            startDate = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        newEndDate.addEventListener('input', event => {
            endDate = event.target.value;
            checkRequiredFieldsOfPopup();
        });

        APPLY_BTN.addEventListener('click', () => {
            if (!APPLY_BTN.classList.contains('disabled')) {
                saveNewWagesPopup();
            }
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(addWagesPopup);
        });
    }

    function checkRequiredFieldsOfPopup() {
        var weekPerHour = weekHours.querySelector('#weekHours');
        var wagesPerHour = wagesHours.querySelector('#wagesHours');
        var startDate = newStartDate.querySelector('#newStartDate');
        var endDate = newEndDate.querySelector('#newEndDate');
        var reg = new RegExp('^[0-9 . $ -]+$');

        if (weekPerHour.value === '' || weekPerHour.value.includes('-') || !reg.test(weekPerHour.value)) {
            weekHours.classList.add('errorPopup');
        } else {
            weekHours.classList.remove('errorPopup');
        }
   
        if (wagesPerHour.value === '' || wagesPerHour.value === '$' || wagesPerHour.value.includes('-') || !reg.test(wagesPerHour.value)) {
            wagesHours.classList.add('errorPopup');
        } else {
            wagesHours.classList.remove('errorPopup');
        } 

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

    function otherChecked(event) {
        if ($.session.EmploymentUpdate) {
            if (event == true) {
                otherInput.classList.remove('disabled');
                saveWagesChecked('other', true, '');
            } else {
                otherInput.classList.add('disabled');
                otherValue = '';
                otherInput.querySelector('#otherInput').value = '';
                saveWagesChecked('other', false, '');

            }
        }
    }

    async function saveNewWagesPopup() {
        const result = await EmploymentAjax.insertWagesAsync(hoursWeek, hoursWages.replace('$', ''), startDate, endDate, PositionId, wagesID, $.session.UserId);
        const { insertWagesResult } = result;
        var messagetext = document.getElementById('confirmMessage');
        messagetext.innerHTML = ``;
        if (insertWagesResult.wagesId == '-1') {
            messagetext.innerHTML = 'This record overlaps with an existing record. Changes cannot be saved.';
            messagetext.classList.add('password-error');
        }
        else {
            NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID, tabPositionIndex = 1);
            POPUP.hide(addWagesPopup);
        }

    }

    async function saveWagesChecked(chkboxName, event, textboxValue) {
        if ($.session.EmploymentUpdate) {
            let IsChacked = event == true ? 'Y' : 'N';
            const result = await EmploymentAjax.saveCheckboxWagesAsync(chkboxName, IsChacked, PositionId, textboxValue, $.session.UserId);
            const { saveCheckboxWagesResult } = result;
        }
    }

    function checkBoxValidation() {
        var vacationSick = vacationSickchkBox.querySelector('#chkVacationSick');
        var medicalVision = medicalVisionchkbox.querySelector('#chkmedicalVision');
        var retirement = retirementchkBox.querySelector('#chkRetirement');
        var empDiscount = empDiscountchkBox.querySelector('#chkEmpDiscount');
        var other = otherchkBox.querySelector('#chkOther');

        if (eligibleBenefits == 'N' && (vacationSick.checked || medicalVision.checked || retirement.checked || empDiscount.checked || other.checked)) {
            eligibleForBenifitConfirmPOPUP();
        }
    }

    function eligibleForBenifitConfirmPOPUP() {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                await saveWagesChecked('VacationSick', false, null);
                await saveWagesChecked('Medical', false, null);
                await saveWagesChecked('empDiscount', false, null);
                await saveWagesChecked('Retirement', false, null);
                await saveWagesChecked('Medical', false, null);
                await saveWagesChecked('other', false, '');

                vacationSickchkBox.querySelector('#chkVacationSick').checked = false;
                medicalVisionchkbox.querySelector('#chkmedicalVision').checked = false;
                retirementchkBox.querySelector('#chkRetirement').checked = false;
                empDiscountchkBox.querySelector('#chkEmpDiscount').checked = false;
                otherchkBox.querySelector('#chkOther').checked = false;
                otherInput.querySelector('#otherInput').value = '';
                disableCheckBox();
                POPUP.hide(confirmPopup);
            },
        });

        NO_BTN = button.build({
            text: 'NO',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(confirmPopup);
                eligibleBenefits = 'Y';
                eligibleBenefitschkBox.querySelector('#chkEligibleBenefits').checked = true;
                saveWagesChecked('EligibleForBenifit', true, null);
                disableCheckBox();
            },
        });

        const message = document.createElement('p');

        message.innerText = 'All benefits that this person is eligible for will be removed.  Do you want to continue?';
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

    return {
        init,
        buildNewWagesBenefitsForm,
        getMarkup,
    };
})(); 