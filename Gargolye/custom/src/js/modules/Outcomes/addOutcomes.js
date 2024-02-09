const addOutcomes = (() => {
    //Inputs
    var selectedConsumers;
    var selectedConsumerId;
    let startDate;
    let endDate;
    let outcomeType;
    let outcomeTypeName;
    let outcomeStatement;
    let goalId;
    let BtnName;

    async function init(selectedConsume, goalID) {
        selectedConsumers = selectedConsume;
        goalId = goalID;
        buildNewOutcomes();
    }

    // Build New Outcomes Page 
    async function buildNewOutcomes() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        landingPage = document.createElement('div');
        selectedConsumerId = selectedConsumers.id;
        const importantOutcomeForm = await buildOutComeForm();
        landingPage.appendChild(importantOutcomeForm);
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    async function buildOutComeForm() {
        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');

        if (goalId > 0) {
            const result = await outcomesAjax.getGoalEntriesByIdAsync(goalId);
            const { getGoalEntriesByIdResult } = result;

            startDate = getGoalEntriesByIdResult[0].effectiveDateStart == '' ? '' : moment(getGoalEntriesByIdResult[0].effectiveDateStart).format('YYYY-MM-DD');
            endDate = getGoalEntriesByIdResult[0].effectiveDateEnd == '' ? '' : moment(getGoalEntriesByIdResult[0].effectiveDateEnd).format('YYYY-MM-DD');
            outcomeType = getGoalEntriesByIdResult[0].outcomeType;
            outcomeStatement = getGoalEntriesByIdResult[0].outcomeStatement;
            BtnName = 'UPDATE';
        }
        else {
            startDate = UTIL.getTodaysDate();
            endDate = '';
            outcomeType = '';
            outcomeStatement = '';
            BtnName = 'SAVE';
        }

        outcomeDropdown = dropdown.build({
            id: 'outcomeDropdown',
            label: "Outcome Type",
            dropdownId: "outcomeDropdown",
            value: outcomeType,
        });
        outcomeStatementInput = input.build({
            id: 'outcomeStatementInput',
            type: 'textarea',
            label: 'Outcome Statement',
            style: 'secondary',
            classNames: 'autosize',
            value: outcomeStatement,
        });
        dateStart = input.build({
            id: 'dateStart',
            type: 'date',
            label: 'Start Date',
            style: 'secondary',
            value: startDate,
        });
        dateEnd = input.build({
            id: 'dateEnd',
            type: 'date',
            label: 'End Date',
            style: 'secondary',
            value: endDate,
        });

        // button
        SAVE_BTN = button.build({
            text: BtnName,
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (!SAVE_BTN.classList.contains('disabled')) {
                    SAVE_BTN.classList.add('disabled');
                    await saveUpdateOutcomes();
                }
            },
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { addEditOutcomeServices.init(selectedConsumers) },
        });

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Outcome </div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        addNewCardBody.appendChild(outcomeDropdown);
        addNewCardBody.appendChild(outcomeStatementInput);

        var dateWrap = document.createElement('div');
        dateWrap.classList.add('addOutcomedateWrap');
        dateWrap.appendChild(dateStart);
        dateEnd.style.marginLeft = '2%';
        dateWrap.appendChild(dateEnd);
        addNewCardBody.appendChild(dateWrap);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('addOutcomeBtnWrap');
        btnWrap.style.marginLeft = '25%';
        btnWrap.style.width = '50%';

        SAVE_BTN.style.width = '52%';
        btnWrap.appendChild(SAVE_BTN);

        CANCEL_BTN.style.width = '52%';
        CANCEL_BTN.style.marginLeft = '5%';
        btnWrap.appendChild(CANCEL_BTN);
        addNewCardBody.appendChild(btnWrap);

        employeeInfoDiv.appendChild(column1);
        populateOutcomeTypesDropdown();
        eventListeners();
        requiredFieldsOfAddOutcome(startDate, endDate, outcomeType, outcomeStatement);
        return employeeInfoDiv;
    }


    async function populateOutcomeTypesDropdown() {
        const {
            getOutcomeTypeDropDownResult: OutcomeType,
        } = await outcomesAjax.getOutcomeTypeDropDownAsync();
        let outcomeTypeData = OutcomeType.map((outcomeTypes) => ({
            id: outcomeTypes.Goal_Type_ID,
            value: outcomeTypes.Goal_Type_ID,
            text: outcomeTypes.goal_type_description
        }));
        outcomeTypeData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("outcomeDropdown", outcomeTypeData, outcomeType);
    }

    function eventListeners() {
        outcomeDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            outcomeType = selectedOption.value;
            outcomeTypeName = selectedOption.innerHTML;
            checkRequiredFieldsOfAddOutcome();
        });

        outcomeStatementInput.addEventListener('input', event => {
            outcomeStatement = event.target.value.trim();
            checkRequiredFieldsOfAddOutcome();
        });
        dateStart.addEventListener('input', event => {
            startDate = event.target.value;
            checkRequiredFieldsOfAddOutcome();
        });
        dateEnd.addEventListener('input', event => {
            endDate = event.target.value;
            checkRequiredFieldsOfAddOutcome();
        });
    }


    function checkRequiredFieldsOfAddOutcome() {
        var startDateVal = dateStart.querySelector('#dateStart');
        var endDateVal = dateEnd.querySelector('#dateEnd');
        var outcomeStatementVal = outcomeStatementInput.querySelector('#outcomeStatementInput');
        var outComeVal = outcomeDropdown.querySelector('#outcomeDropdown');

        requiredFieldsOfAddOutcome(startDateVal.value, endDateVal.value, outComeVal.value, outcomeStatementVal.value)
    }

    function requiredFieldsOfAddOutcome(startDateVal, endDateVal, outComeVal, outcomeStatementVal) {
        if (startDateVal === '') {
            dateStart.classList.add('error');
        } else {
            dateStart.classList.remove('error');
        }

        if (endDateVal != null && endDateVal != '' && startDateVal > endDateVal) {
            dateEnd.classList.add('error');
        }
        else {
            dateEnd.classList.remove('error');
        }

        if (outComeVal === '') {
            outcomeDropdown.classList.add('error');
        } else {
            outcomeDropdown.classList.remove('error');
        }

        if (outcomeStatementVal.trim() === '') {
            outcomeStatementInput.classList.add('error');
        } else {
            outcomeStatementInput.classList.remove('error');
        }

        setBtnStatusOfAddOutcome();
    }

    function setBtnStatusOfAddOutcome() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length > 0) {
            SAVE_BTN.classList.add('disabled');
            return;
        } else {
            SAVE_BTN.classList.remove('disabled');
        }
    }

    async function saveUpdateOutcomes() {
        const result = await outcomesAjax.insertOutcomeInfoAsync(startDate, endDate, outcomeType, outcomeStatement, $.session.UserId, goalId, selectedConsumerId);
        const { insertOutcomeInfoResult } = result;
        if (insertOutcomeInfoResult[0].goal_id != '0') {
            addEditOutcomeServices.init(selectedConsumers)
        }
    }


    return {
        init,
        buildNewOutcomes,
    };
})(); 
