const addOutcomes = (() => {
    //Inputs
    var selectedConsumers;
    var selectedConsumerId;
    let startDate;
    let endDate;
    let outcomeType;
    let outcomeTypeName;
    let outcomeStatement;
    let currDate;

    async function init(selectedConsume) {
        selectedConsumers = selectedConsume;
        buildNewOutcomes();
    }

    // Build New Outcomes Page 
    async function buildNewOutcomes() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        landingPage = document.createElement('div');
        selectedConsumerId = selectedConsumers.id; 
        currDate = "2010-03-30";
        const importantOutcomeForm = await buildOutComeForm();
        landingPage.appendChild(importantOutcomeForm);
        DOM.ACTIONCENTER.appendChild(landingPage);  
    }

    async function buildOutComeForm() {
        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');

        startDate = UTIL.getTodaysDate();
        endDate = '';
        outcomeType = '';
        outcomeStatement = '';

        outcomeDropdown = dropdown.build({
            id: 'outcomeDropdown',
            label: "Outcome Type",
            dropdownId: "outcomeDropdown",
            value: outcomeType,
        });
        outcomeStatementInput = input.build({
            id: 'outcomeStatementInput',
            type: 'text',
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
            text: 'Save',
            style: 'secondary',
            type: 'contained',
            icon: 'save',
            callback: async () => {
                if (!SAVE_BTN.classList.contains('disabled')) {
                    SAVE_BTN.classList.add('disabled');
                    await saveUpdateAccount();
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
        dateWrap.classList.add('addOutcomeBtnWrap');
        dateWrap.appendChild(dateStart);
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
        populateDropdown();
        eventListeners();

        checkRequiredFieldsOfAddOutcome(outcomeType, outcomeStatement, startDate, endDate);
        return employeeInfoDiv;
    }

    function populateDropdown() {
        outcomesAjax.getOutcomeTypeForFilter(
            {
                consumerId: selectedConsumerId,
                selectedDate: currDate, 
                token: $.session.Token
            },
            populateOutcomeTypesDropdown
        );
    }

    function populateOutcomeTypesDropdown(results) {
        var data = results.map(res => {
            return {
                value: res.Goal_Type_ID,
                text: res.goal_type_description
            };
        });
        dropdown.populate(outcomeDropdown, data);
    }

    function eventListeners() {
        outcomeDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            outcomeType = selectedOption.value;
            outcomeTypeName = selectedOption.innerHTML;
            getRequiredFieldsOfAddOutcome();
        });

        outcomeStatementInput.addEventListener('input', event => {
            outcomeStatement = event.target.value.trim();
            getRequiredFieldsOfAddOutcome();
        });
        dateStart.addEventListener('input', event => {
            startDate = event.target.value;
            getRequiredFieldsOfAddOutcome();
        });
        dateEnd.addEventListener('input', event => {
            endDate = event.target.value;
            getRequiredFieldsOfAddOutcome();
        });
    }


    function getRequiredFieldsOfAddOutcome() {
        var startDateVal = dateStart.querySelector('#dateStart');
        var endDateVal = dateEnd.querySelector('#dateEnd');
        var outcomeStatementVal = outcomeStatementInput.querySelector('#outcomeStatementInput');
        var outComeVal = outcomeDropdown.querySelector('#outcomeDropdown');
        checkRequiredFieldsOfAddOutcome(outComeVal.value, outcomeStatementVal.value, startDateVal.value, endDateVal.value)
    }

    function checkRequiredFieldsOfAddOutcome(outcomeTypeVal, outcomeStatementVal, startDateVal, endDateVal) {
        if (outcomeTypeVal.trim() === '') {
            outcomeDropdown.classList.add('error');
        } else {
            outcomeDropdown.classList.remove('error');
        }

        if (outcomeStatementVal === '') {
            outcomeStatementInput.classList.add('error');
        } else {
            outcomeStatementInput.classList.remove('error');
        }

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
        setBtnStatusOfAddOutcome();
    }

    function setBtnStatusOfAddOutcome() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            SAVE_BTN.classList.add('disabled');
            return;
        } else {
            SAVE_BTN.classList.remove('disabled');
        }
    }

    async function saveUpdateAccount() {

    }


    return {
        init,
        buildNewOutcomes,
    };
})(); 
