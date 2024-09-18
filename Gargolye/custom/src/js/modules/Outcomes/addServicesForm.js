const addServicesForm = (() => {
    //Inputs
    var selectedConsumers;
    var selectedConsumerId;
    let startDate;
    let endDate;
    let outcomeType;
    let outcomeTypeName;
    let servicesStatement;
    let ServiceType;
    let ServiceTypeName;
    let method;
    let success;
    let frequencyModifier;
    let frequency;
    let frequencyPeriod;
    let objectiveId;
    let BtnName;
    let outcomeGoalId;
    let duration;
    let location;
    let SAVE_BTN;  

    async function init(selectedConsume, ObjectiveID , goalId) {
        selectedConsumers = selectedConsume;
        objectiveId = ObjectiveID;
        outcomeGoalId = goalId > 0 ? goalId : '';
        await buildNewServicesForm();
        SAVE_BTN.classList.add('disabled');   
    }

    // Build New Outcomes Page 
    async function buildNewServicesForm() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        landingPage = document.createElement('div');
        selectedConsumerId = selectedConsumers.id;
        const importantOutcomeForm = await buildServicesForm();
        landingPage.appendChild(importantOutcomeForm);
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    async function buildServicesForm() {
        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');
        if (objectiveId > 0) {
            const result = await outcomesAjax.getObjectiveEntriesByIdAsync(objectiveId);
            const { getObjectiveEntriesByIdResult } = result;

            startDate = getObjectiveEntriesByIdResult[0].serviceStartDate == '' ? UTIL.getTodaysDate() : moment(getObjectiveEntriesByIdResult[0].serviceStartDate).format('YYYY-MM-DD');
            endDate = getObjectiveEntriesByIdResult[0].serviceEndDate == '' ? '' : moment(getObjectiveEntriesByIdResult[0].serviceEndDate).format('YYYY-MM-DD');
            outcomeType = getObjectiveEntriesByIdResult[0].goal_id;
            servicesStatement = getObjectiveEntriesByIdResult[0].serviceStatement;
            ServiceType = getObjectiveEntriesByIdResult[0].objective_type;
            method = getObjectiveEntriesByIdResult[0].objective_method;
            success = getObjectiveEntriesByIdResult[0].success_determination;
            frequencyModifier = getObjectiveEntriesByIdResult[0].frequency_modifier;
            frequency = getObjectiveEntriesByIdResult[0].frequency_occurance;
            frequencyPeriod = getObjectiveEntriesByIdResult[0].frequency_peroid;
            duration = getObjectiveEntriesByIdResult[0].duration;
            location = getObjectiveEntriesByIdResult[0].location;
            BtnName = 'UPDATE';
        }
        else {
            const result = await outcomesAjax.getGoalEntriesByIdAsync(outcomeGoalId);
            const { getGoalEntriesByIdResult } = result;

            startDate = UTIL.getTodaysDate();
            endDate = '';
            outcomeType = outcomeGoalId;  
            servicesStatement = '';
            ServiceType = '';
            method = '';
            success = '';
            frequencyModifier = '';
            frequency = '';
            frequencyPeriod = '';
            duration = '';
            location = getGoalEntriesByIdResult[0].location;
            BtnName = 'SAVE';
        }

        outcomeDropdown = dropdown.build({
            id: 'outcomeDropdown',
            label: "Outcome",
            dropdownId: "outcomeDropdown",
            value: outcomeType,
        });

        ServiceTypeDropdown = dropdown.build({
            id: 'ServiceTypeDropdown',
            label: "Service Type",
            dropdownId: "ServiceTypeDropdown",
            value: ServiceType,
        });

        servicesStatementInput = input.build({
            id: 'servicesStatementInput',
            type: 'textarea',
            label: 'Service Statement',
            style: 'secondary',
            classNames: 'autosize',
            value: servicesStatement,
        });

        methodInput = input.build({
            id: 'methodInput',
            type: 'textarea',
            label: 'Method',
            style: 'secondary',
            classNames: 'autosize',
            value: method,
        });

        successInput = input.build({
            id: 'successInput',
            type: 'textarea',
            label: 'Success',
            style: 'secondary',
            classNames: 'autosize',
            value: success,
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
        locationDropdown = dropdown.build({
            id: 'locationDropdown',
            label: "Location",
            dropdownId: "locationDropdown",
            value: location,
        });

        frequencyModifierDropdown = dropdown.build({
            id: 'frequencyModifierDropdown',
            label: "Frequency Modifier",
            dropdownId: "frequencyModifierDropdown",
            value: frequencyModifier,
        });

        frequencyInput = input.build({
            id: 'frequencyInput',
            type: 'number',
            label: 'Frequency',
            style: 'secondary',
            value: frequency,
            attributes: [        
                { key: 'min', value: '0' }, 
                {
                    key: 'onkeypress',
                    value: 'return event.charCode >= 48 && event.charCode <= 57',
                },
            ],
        });

        frequencyPeriodDropdown = dropdown.build({
            id: 'frequencyPeriodDropdown',
            label: "Frequency Period",
            dropdownId: "frequencyPeriodDropdown",
            value: frequencyPeriod,
        });

        durationInput = input.build({
            id: 'durationInput',
            type: 'text',
            label: 'Duration',
            style: 'secondary',
            value: duration,         
        });

        // button
        SAVE_BTN = button.build({
            text: BtnName,
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (!SAVE_BTN.classList.contains('disabled')) {
                    SAVE_BTN.classList.add('disabled');
                    await saveUpdateOutcomesService();
                }
            },
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { addEditOutcomeServices.init(selectedConsumers) },
        });
        var LineBr = document.createElement('br');
        const column1 = document.createElement('div');
        column1.classList.add('col-1');
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Outcome</div>`;
        addNewCard.appendChild(addNewCardBody);
        column1.appendChild(addNewCard);

        const addNewServiceCard = document.createElement("div");
        addNewServiceCard.classList.add("card");  
        const addNewServiceCardBody = document.createElement("div");
        addNewServiceCardBody.classList.add("card__body");
        addNewServiceCard.innerHTML = `<div class="card__header">Service</div>`;
        addNewServiceCard.appendChild(addNewServiceCardBody)
        column1.appendChild(addNewServiceCard)

        const consumerNameDisplay = document.createElement("p");
        consumerNameDisplay.classList.add("heading");
        consumerNameDisplay.innerHTML = `<span>${'Frequency'}</span>`;
        consumerNameDisplay.style.marginLeft = '10px';

        addNewCardBody.appendChild(outcomeDropdown);

        addNewServiceCardBody.appendChild(ServiceTypeDropdown);
        addNewServiceCardBody.appendChild(servicesStatementInput);
        addNewServiceCardBody.appendChild(methodInput);
        addNewServiceCardBody.appendChild(successInput);

        var dateWrap = document.createElement('div');
        dateWrap.classList.add('addOutcomedateWrap');
        dateWrap.appendChild(dateStart);
        dateEnd.style.marginLeft = '2%';
        dateWrap.appendChild(dateEnd);
        locationDropdown.style.marginLeft = '2%';
        dateWrap.appendChild(locationDropdown);
        addNewServiceCardBody.appendChild(dateWrap);

        addNewServiceCardBody.appendChild(consumerNameDisplay);
        addNewServiceCardBody.appendChild(LineBr);
        addNewServiceCardBody.appendChild(LineBr);

        var infoWrap = document.createElement('div');
        infoWrap.classList.add('frequencyDTWrap');
        frequencyModifierDropdown.classList.add('width30Per');
        infoWrap.appendChild(frequencyModifierDropdown);
        frequencyInput.classList.add('width32Per');
        infoWrap.appendChild(frequencyInput);
        frequencyPeriodDropdown.classList.add('width32Per');
        infoWrap.appendChild(frequencyPeriodDropdown);
        addNewServiceCardBody.appendChild(infoWrap);

        var durationWrap = document.createElement('div');
        durationWrap.classList.add('frequencyDTWrap');
        durationInput.classList.add('width32Per');
        durationWrap.appendChild(durationInput);
        addNewServiceCardBody.appendChild(durationWrap); 

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('addOutcomeBtnWrap');
        btnWrap.style.marginLeft = '25%';
        btnWrap.style.width = '50%';

        SAVE_BTN.style.width = '52%';
        btnWrap.appendChild(SAVE_BTN);

        CANCEL_BTN.style.width = '52%';
        CANCEL_BTN.style.marginLeft = '5%';
        btnWrap.appendChild(CANCEL_BTN);
        addNewServiceCardBody.appendChild(btnWrap);

        employeeInfoDiv.appendChild(column1);
        populateOutcomeDropdown();
        eventListeners();
        populatefrequencyModifierDropdown();
        RequiredFieldsOfAddServiceForm(outcomeType, servicesStatement, startDate, endDate);
        return employeeInfoDiv;
    }  

    async function populatefrequencyModifierDropdown() {
        const {
            getServiceFrequencyTypeDropDownResult: ServiceFrequency,
        } = await outcomesAjax.getServiceFrequencyTypeDropDownAsync('frequency');
        let ServiceFrequencyData = ServiceFrequency.map((serviceFrequency) => ({
            id: serviceFrequency.serviceFrequencyType_id,
            value: serviceFrequency.serviceFrequencyType_id,
            text: serviceFrequency.serviceFrequencyType_name
        }));
        ServiceFrequencyData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("frequencyModifierDropdown", ServiceFrequencyData, frequencyModifier);
    }

    async function populateOutcomeDropdown() {
        const {
            getOutcomeServiceDropDownResult: OutcomeType,
        } = await outcomesAjax.getOutcomeServiceDropDownAsync(selectedConsumerId, startDate);

        let outcomeTypeData = OutcomeType.map(outcomeTypes => ({
          id: outcomeTypes.goal_id,
          value: outcomeTypes.goal_id,
          text: outcomeTypes.goal_serviceStatement,
        })).sort((a, b) => {
          if (a.text < b.text) return -1;
          if (a.text > b.text) return 1;
          return 0;
        });

        outcomeTypeData.unshift({ id: null, value: '', text: '' });
        dropdown.populate('outcomeDropdown', outcomeTypeData, outcomeType);

        const { getServiceFrequencyTypeDropDownResult: ServiceFrequencyType } =
          await outcomesAjax.getServiceFrequencyTypeDropDownAsync('service');

        let ServiceFrequencyData = ServiceFrequencyType.map(serviceFrequencyType => ({
          id: serviceFrequencyType.serviceFrequencyType_id,
          value: serviceFrequencyType.serviceFrequencyType_id,
          text: serviceFrequencyType.serviceFrequencyType_name,
        })).sort((a, b) => {
          if (a.text < b.text) return -1;
          if (a.text > b.text) return 1;
          return 0;
        });
        ServiceFrequencyData.unshift({ id: null, value: '', text: '' });
        dropdown.populate('ServiceTypeDropdown', ServiceFrequencyData, ServiceType);

        const frequencyPeriodDropdownData = [
          { id: 'H', value: 'H', text: 'per Hour' },
          { id: 'D', value: 'D', text: 'per Day' },
          { id: 'W', value: 'W', text: 'per Week' },
          { id: 'M', value: 'M', text: 'per Month' },
          { id: 'Y', value: 'Y', text: 'per Year' },
        ];
        frequencyPeriodDropdownData.unshift({ id: null, value: '', text: '' });
        dropdown.populate('frequencyPeriodDropdown', frequencyPeriodDropdownData, frequencyPeriod);

        const { getLocationDropDownResult: locationDrop } = await outcomesAjax.getLocationDropDownAsync();

        let locationData = locationDrop
          .map(locationDrops => ({
            id: locationDrops.locationID,
            value: locationDrops.locationID,
            text: locationDrops.locationDescription,
          }))
          .sort((a, b) => {
            if (a.text < b.text) return -1;
            if (a.text > b.text) return 1;
            return 0;
          });
        locationData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("locationDropdown", locationData, location);  
    }

    function eventListeners() {
        outcomeDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            outcomeType = selectedOption.value;
            outcomeTypeName = selectedOption.innerHTML;
            getRequiredFieldsOfAddServiceForm();
        });

        ServiceTypeDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            ServiceType = selectedOption.value;
            ServiceTypeName = selectedOption.innerHTML;  
            getRequiredFieldsOfAddServiceForm(); 
        });

        servicesStatementInput.addEventListener('input', event => {
            servicesStatement = event.target.value.trim();  
            getRequiredFieldsOfAddServiceForm();
        });

        methodInput.addEventListener('input', event => {
            method = event.target.value.trim();
            getRequiredFieldsOfAddServiceForm();
        });

        successInput.addEventListener('input', event => {
            success = event.target.value.trim();
            getRequiredFieldsOfAddServiceForm();
        });

        frequencyInput.addEventListener('input', event => {
            frequency = event.target.value;
            getRequiredFieldsOfAddServiceForm();
        });

        dateStart.addEventListener('input', event => {
            startDate = event.target.value;
            getRequiredFieldsOfAddServiceForm();
        });
        dateEnd.addEventListener('input', event => {
            endDate = event.target.value;
            getRequiredFieldsOfAddServiceForm();
        });

        frequencyModifierDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            frequencyModifier = selectedOption.value;
            getRequiredFieldsOfAddServiceForm();
        });

        frequencyPeriodDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            frequencyPeriod = selectedOption.value;
            getRequiredFieldsOfAddServiceForm();
        });

        durationInput.addEventListener('input', event => {
            duration = event.target.value.trim();
            getRequiredFieldsOfAddServiceForm();
        });

        locationDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            location = selectedOption.value;
            getRequiredFieldsOfAddServiceForm();
        });
    }


    function getRequiredFieldsOfAddServiceForm() {
        var startDateVal = dateStart.querySelector('#dateStart');
        var endDateVal = dateEnd.querySelector('#dateEnd');
        var servicesStatementVal = servicesStatementInput.querySelector('#servicesStatementInput');
        var outComeVal = outcomeDropdown.querySelector('#outcomeDropdown');
        RequiredFieldsOfAddServiceForm(outComeVal.value, servicesStatementVal.value, startDateVal.value, endDateVal.value);
    }

    function RequiredFieldsOfAddServiceForm(outComeVal, servicesStatementVal, startDateVal, endDateVal) {
        if (outComeVal === '') {
            outcomeDropdown.classList.add('error');
        } else {
            outcomeDropdown.classList.remove('error');
        }
         
        if (servicesStatementVal.trim() === '') { 
            servicesStatementInput.classList.add('error');
        } else {
            servicesStatementInput.classList.remove('error');
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
        if (hasErrors.length > 0) {
            SAVE_BTN.classList.add('disabled');
            return;
        } else {
            SAVE_BTN.classList.remove('disabled');
        }
    }

    async function saveUpdateOutcomesService() {
        const result = await outcomesAjax.insertOutcomeServiceInfoAsync(startDate, endDate, outcomeType, UTIL.removeUnsavableNoteText(servicesStatement), ServiceType, UTIL.removeUnsavableNoteText(method), UTIL.removeUnsavableNoteText(success), frequencyModifier, frequency, frequencyPeriod, $.session.UserId, objectiveId, selectedConsumerId, location, duration);
        const { insertOutcomeServiceInfoResult } = result;
        if (insertOutcomeServiceInfoResult[0].objective_Id != '0') {
            addEditOutcomeServices.init(selectedConsumers)
        } 
    }


    return {
        init,
        buildNewServicesForm,
    };
})(); 
