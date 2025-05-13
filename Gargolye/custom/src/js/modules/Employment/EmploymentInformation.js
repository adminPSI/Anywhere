const EmploymentInformation = (() => {  
    let PositionId;
    let getEmployeeInfoByID = [];
    let peopleID;
    let BtnName;
    let tempstartDatePosition = '';
    let tempendDatePosition = '';
    let tempposition = '';
    let tempjobStanding = '';
    let tempemployer = '';
    let temptransportation = '';
    let temptypeOfWork = '';
    let tempselfEmployed = '';
    let tempname = '';
    let tempphone = '';
    let tempemail = '';
    let consumersID;
    let employerName;
    let positionName;
    let selectedConsumersName;   
    let temptypeOfEmployment = '';

    async function init(positionId, Name, PositionName, SelectedConsumersName, ConsumersId) {
        PositionId = positionId;
        consumersID = ConsumersId;
        employerName = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;      
        if (PositionId != undefined) {
            getEmployeeInfoByID = await EmploymentAjax.getEmployeeInfoByIDAsync(PositionId);
        }
       
    }

    function getMarkup() {
        const employeeInforWrap = document.createElement('div');
        employeeInforWrap.classList.add('planSummary');
        const importantTables = buildNewEmploymentForm();
        employeeInforWrap.appendChild(importantTables);
        return employeeInforWrap;
    }

    function buildNewEmploymentForm() {      
        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');

        if (PositionId != undefined) {
            BtnName = 'SAVE';
            startDatePosition = moment(getEmployeeInfoByID.getEmployeeInfoByIDResult[0].positionStartDate).format('YYYY-MM-DD');
            endDatePosition = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].positionEndDate == '' ? '' : moment(getEmployeeInfoByID.getEmployeeInfoByIDResult[0].positionEndDate).format('YYYY-MM-DD');
            position = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].position;
            jobStanding = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].jobStanding;
            employer = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].employer;
            transportation = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].transportation;
            typeOfWork = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].typeOfWork;
            selfEmployed = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].selfEmployed;
            name = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].name;
            phone = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].phone;
            email = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].email;
            peopleID = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].peopleId;
            typeOfEmployment = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].typeOfEmployment;
        }
        else {
            BtnName = 'SAVE';
            // PositionId = 0; 
            startDatePosition = '';
            endDatePosition = '';
            position = '';
            jobStanding = '';
            employer = '';
            transportation = '';
            typeOfWork = '';
            selfEmployed = '';
            name = '';
            phone = '';
            email = '';
            peopleID = consumersID;
            typeOfEmployment = '';
        }

        tempstartDatePosition = '';
        tempendDatePosition = '';
        tempposition = '';
        tempjobStanding = '';
        tempemployer = '';
        temptransportation = '';
        temptypeOfWork = '';
        tempselfEmployed = '';
        tempname = '';
        tempphone = '';
        tempemail = '';
        temptypeOfEmployment = '';

        positionStartDate = input.build({
            id: 'positionStartDate',
            type: 'date',
            label: 'Start Date',
            style: 'secondary',
            value: (startDatePosition) ? startDatePosition : '',
        });

        positionEndDate = input.build({
            id: 'positionEndDate',
            type: 'date',
            label: 'End Date',
            style: 'secondary',
            value: (endDatePosition) ? endDatePosition : '',
        });

        positionDropdown = dropdown.build({
            id: 'positionDropdown',
            label: "Position",
            dropdownId: "positionDropdown",
            value: (position) ? position : '',
        });

        jobStandingDropdown = dropdown.build({
            id: 'jobStandingDropdown',
            label: "Job Standing",
            dropdownId: "jobStandingDropdown",
            value: (jobStanding) ? jobStanding : '',
        });

        employerDropdown = dropdown.build({
            id: 'employerDropdown',
            label: "Employer",
            dropdownId: "employerDropdown",
            value: (employer) ? employer : '',
        });

        transportationDropdown = dropdown.build({
            id: 'transportationDropdown',
            label: "Transportation",
            dropdownId: "transportationDropdown",
            value: (transportation) ? transportation : '',
        });

        typeOfWorkDropdown = dropdown.build({
            id: 'typeOfWorkDropdown',
            label: "Type Of Work",
            dropdownId: "typeOfWorkDropdown",
            value: (typeOfWork) ? typeOfWork : '',
        });

        typeOfEmploymentDropdown = dropdown.build({
            id: 'typeOfEmploymentDropdown',
            label: "Employment Type",
            dropdownId: "typeOfEmploymentDropdown",
            value: (typeOfEmployment) ? typeOfEmployment : '',
        });

        isSelfEmployed = input.buildCheckbox({
            text: 'Self-Employed?',
            id: 'chkisSelfEmployed',
            isChecked: selfEmployed == 'Y' ? true : false,
        });

        nameInput = input.build({
            id: 'nameInput',
            label: 'Name',
            type: 'text',
            style: 'secondary',
            value: (name) ? name : '',
        });

        phoneInput = input.build({
            id: 'phoneInput',
            label: 'Phone',
            type: 'number',
            style: 'secondary',
            attributes: [{ key: 'maxlength', value: '12' }],
            value: (phone) ? phone : '',
        });

        emailInput = input.build({
            id: 'emailInput',
            label: 'Email',
            type: 'text',
            style: 'secondary',
            value: (email) ? email : '',
        });

        // Save button
        SAVE_BTN = button.build({
            text: BtnName,
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (!SAVE_BTN.classList.contains('disabled')) {
                    SAVE_BTN.classList.add('disabled');
                    saveEmployeeInfo()
                }
            },
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { CancleValidate() },
        });
        
        const addEmployerBtn = button.build({
            text: '+ Add Employers',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                const redirectInfo = {
                    positionId: PositionId,
                    empName: employerName,
                    posName: positionName,
                    consumersName: selectedConsumersName,
                    consumersId: consumersID
                };
                if (!addEmployerBtn.classList.contains('disabled')) {
                    addEditEmployers.buildEmployerPopUp({}, 'insert', 'employmentInfo', redirectInfo);
                }
            },
        });

        var LineBr = document.createElement('br');

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Employment Information</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        const employerBtnWrap = document.createElement('div');
        employerBtnWrap.classList.add('employmentBtnWrap');
        employerDropdown.style.width = '80%';
        addEmployerBtn.style.width = '19%';
        if (!$.session.InsertEmployers) {
            addEmployerBtn.classList.add('disabled');
        }
        employerBtnWrap.appendChild(employerDropdown);
        employerBtnWrap.appendChild(addEmployerBtn);

        addNewCardBody.appendChild(employerBtnWrap);
        addNewCardBody.appendChild(positionDropdown);

        var dropWrap = document.createElement('div');
        dropWrap.classList.add('employmentDTWrap');
        jobStandingDropdown.classList.add('width27Per');
        dropWrap.appendChild(jobStandingDropdown);
        transportationDropdown.classList.add('width27Per');
        dropWrap.appendChild(transportationDropdown);
        positionStartDate.classList.add('width20Per');
        dropWrap.appendChild(positionStartDate);
        positionEndDate.classList.add('width20Per');
        dropWrap.appendChild(positionEndDate);
        addNewCardBody.appendChild(dropWrap);

        var drWrap = document.createElement('div');
        drWrap.classList.add('employmentDTWrap');
        typeOfWorkDropdown.classList.add('width39Per');
        drWrap.appendChild(typeOfWorkDropdown);
        isSelfEmployed.classList.add('width22Per');
        drWrap.appendChild(isSelfEmployed);
        typeOfEmploymentDropdown.classList.add('width38Per');
        drWrap.appendChild(typeOfEmploymentDropdown);
        addNewCardBody.appendChild(drWrap);

        const consumerNameDisplay = document.createElement("p");
        consumerNameDisplay.classList.add("heading");
        consumerNameDisplay.innerHTML = `<span>${'Supervisor Information'}</span>`;
        consumerNameDisplay.style.marginLeft = '10px';
        addNewCardBody.appendChild(consumerNameDisplay);
        addNewCardBody.appendChild(LineBr);
        addNewCardBody.appendChild(LineBr);

        var infoWrap = document.createElement('div');
        infoWrap.classList.add('employmentDTWrap');
        nameInput.classList.add('width30Per');
        infoWrap.appendChild(nameInput);
        phoneInput.classList.add('width32Per');
        infoWrap.appendChild(phoneInput);
        emailInput.classList.add('width32Per');
        infoWrap.appendChild(emailInput);
        addNewCardBody.appendChild(infoWrap);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('employmentBtnWrap');
        btnWrap.style.marginLeft = '25%';
        btnWrap.style.width = '50%';

        if ($.session.EmploymentUpdate) {
            SAVE_BTN.style.width = '52%';
            btnWrap.appendChild(SAVE_BTN);
        }

        CANCEL_BTN.style.width = '52%';
        CANCEL_BTN.style.marginLeft = '5%';
        btnWrap.appendChild(CANCEL_BTN);
        addNewCardBody.appendChild(btnWrap);

        eventListeners();
        populateDropdowns();
        enableDisabledInputs();
        employeeInfoDiv.appendChild(column1);
        checkRequiredFieldsOfEmployeeInfo(startDatePosition, position, employer, jobStanding, endDatePosition);

        return employeeInfoDiv;
    }

    function enableDisabledInputs() {
        if ($.session.EmploymentUpdate) {
            positionStartDate.classList.remove('disabled');
            positionEndDate.classList.remove('disabled');
            positionDropdown.classList.remove('disabled');
            jobStandingDropdown.classList.remove('disabled');
            employerDropdown.classList.remove('disabled');
            transportationDropdown.classList.remove('disabled');
            typeOfWorkDropdown.classList.remove('disabled');
            typeOfEmploymentDropdown.classList.remove('disabled');
            isSelfEmployed.classList.remove('disabled');
            nameInput.classList.remove('disabled');
            phoneInput.classList.remove('disabled');
            emailInput.classList.remove('disabled');
            UPDATE_BTN.classList.remove('disabled');
            SAVE_BTN.classList.remove('disabled');
        }
        else {
            positionStartDate.classList.add('disabled');
            positionEndDate.classList.add('disabled');
            positionDropdown.classList.add('disabled');
            jobStandingDropdown.classList.add('disabled');
            employerDropdown.classList.add('disabled');
            transportationDropdown.classList.add('disabled');
            typeOfWorkDropdown.classList.add('disabled');
            typeOfEmploymentDropdown.classList.add('disabled');
            isSelfEmployed.classList.add('disabled');
            nameInput.classList.add('disabled');
            phoneInput.classList.add('disabled');
            emailInput.classList.add('disabled');
            UPDATE_BTN.classList.add('disabled');
            SAVE_BTN.classList.add('disabled');
        }

    }

    function getRequiredFieldsOfEmployeeInfo() {
        var startDate = positionStartDate.querySelector('#positionStartDate');
        var endDate = positionEndDate.querySelector('#positionEndDate');
        var position = positionDropdown.querySelector('#positionDropdown');
        var employer = employerDropdown.querySelector('#employerDropdown');
        var jobStanding = jobStandingDropdown.querySelector('#jobStandingDropdown');
        checkRequiredFieldsOfEmployeeInfo(startDate.value, position.value, employer.value, jobStanding.value, endDate.value)
    }

    function checkRequiredFieldsOfEmployeeInfo(startDate, position, employer, jobStanding, endDate) {
        if (startDate === '' || (endDate != '' && startDate > endDate)) {
            positionStartDate.classList.add('error');
        } else {
            positionStartDate.classList.remove('error');
        }

        if (position === '') {
            positionDropdown.classList.add('error');
        } else {
            positionDropdown.classList.remove('error');
        }

        if (employer === '') {
            employerDropdown.classList.add('error');
        } else {
            employerDropdown.classList.remove('error');
        }

        if (jobStanding === '') {
            jobStandingDropdown.classList.add('error');
        } else {
            jobStandingDropdown.classList.remove('error');
        }
        setBtnStatusOfEmployeeInfo();
    }

    function setBtnStatusOfEmployeeInfo() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            SAVE_BTN.classList.add('disabled');
            BACK_BTN.classList.remove('disabled');
            return;
        } else {
            if (tempstartDatePosition != '' || tempendDatePosition != '' || tempposition != '' || tempjobStanding != '' || tempemployer != '' || temptransportation != '' || temptypeOfWork != '' || tempselfEmployed != '' || tempname != '' || tempphone != '' || tempemail != '' || temptypeOfEmployment != '') {
                SAVE_BTN.classList.remove('disabled');
                BACK_BTN.classList.add('disabled');
            }
            else {
                SAVE_BTN.classList.add('disabled');
                BACK_BTN.classList.remove('disabled');
            }
        }
    }

    function eventListeners() {
        positionStartDate.addEventListener('input', event => {
            startDatePosition = event.target.value;
            tempstartDatePosition = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        positionEndDate.addEventListener('input', event => {
            endDatePosition = event.target.value;
            tempendDatePosition = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        positionDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            position = selectedConsumerOption.id;
            positionName = selectedConsumerOption.text;
            tempposition = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        jobStandingDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            jobStanding = selectedConsumerOption.id;
            tempjobStanding = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        employerDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            employer = selectedConsumerOption.id;
            employerName = selectedConsumerOption.text;
            tempemployer = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        transportationDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            transportation = selectedConsumerOption.id;
            temptransportation = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        typeOfWorkDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            typeOfWork = selectedConsumerOption.id;
            temptypeOfWork = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        typeOfEmploymentDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            typeOfEmployment = selectedConsumerOption.id;
            temptypeOfEmployment = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        isSelfEmployed.addEventListener('change', event => {
            selfEmployed = event.target.checked == true ? 'Y' : 'N';
            tempselfEmployed = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        nameInput.addEventListener('input', event => {
            name = event.target.value;
            tempname = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        phoneInput.addEventListener('input', event => {
            phone = event.target.value;
            tempphone = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
        emailInput.addEventListener('input', event => {
            email = event.target.value;
            tempemail = 'ChangeValue';
            getRequiredFieldsOfEmployeeInfo();
        });
    }

    async function populateDropdowns() {
        const {
            getPositionDropDownResult: Positions,
        } = await EmploymentAjax.getPositionDropDownAsync();
        let positionsData = Positions.map((positions) => ({
            id: positions.positionId,
            value: positions.positionId,
            text: positions.positionName
        }));
        positionsData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("positionDropdown", positionsData, position);

        const {
            getEmployerDropDownResult: Employer,
        } = await EmploymentAjax.getEmployerDropDownAsync();
        let data = Employer.map((employer) => ({
            id: employer.employerId,
            value: employer.employerId,
            text: employer.employerName
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("employerDropdown", data, employer);

        const {
            getJobStandingsDropDownResult: JobStanding,
        } = await EmploymentAjax.getJobStandingsDropDownAsync();
        let jobStandingData = JobStanding.map((jobStanding) => ({
            id: jobStanding.jobStandingId,
            value: jobStanding.jobStandingId,
            text: jobStanding.jobStandingName
        }));
        jobStandingData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("jobStandingDropdown", jobStandingData, jobStanding);

        const {
            getTransportationDropDownResult: Transportation,
        } = await EmploymentAjax.getTransportationDropDownAsync();
        let transportationData = Transportation.map((transportation) => ({
            id: transportation.transportationId,
            value: transportation.transportationId,
            text: transportation.transportationName
        }));
        transportationData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("transportationDropdown", transportationData, transportation);

        const {
            getTypeOfWorkDropDownResult: TypeOfWork,
        } = await EmploymentAjax.getTypeOfWorkDropDownAsync();
        let typeOfWorkData = TypeOfWork.map((typeOfWorks) => ({
            id: typeOfWorks.typeOfWorkId,
            value: typeOfWorks.typeOfWorkId,
            text: typeOfWorks.typeOfWorkName
        }));
        typeOfWorkData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("typeOfWorkDropdown", typeOfWorkData, typeOfWork);

        const {
            getTypeOfEmploymentDropDownResult: TypeOfEmployment,
        } = await EmploymentAjax.getTypeOfEmploymentDropDownAsync();
        let typeOfEmploymentData = TypeOfEmployment.map((typeOfEmployments) => ({
            id: typeOfEmployments.typeOfWorkId,
            value: typeOfEmployments.typeOfWorkId,
            text: typeOfEmployments.typeOfWorkName
        }));
        typeOfEmploymentData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("typeOfEmploymentDropdown", typeOfEmploymentData, typeOfEmployment);


    }

    async function saveEmployeeInfo() {
        const result = await EmploymentAjax.insertEmploymentInfoAsync(startDatePosition, endDatePosition, position, jobStanding, employer, transportation, typeOfWork, selfEmployed, name, phone, email, consumersID, $.session.UserId, PositionId, typeOfEmployment);
        const { insertEmploymentInfoResult } = result;
        if (insertEmploymentInfoResult.positionID != null) {
            NewEmployment.refreshEmployment(insertEmploymentInfoResult.positionID, employerName, positionName, selectedConsumersName, consumersID, tabPositionIndex = 0);
        }
    }

    function CancleValidate() {
        if (tempstartDatePosition != ''
            || tempendDatePosition != ''
            || tempposition != ''
            || tempjobStanding != ''
            || tempemployer != ''
            || temptransportation != ''
            || temptypeOfWork != ''
            || tempselfEmployed != ''
            || tempname != ''
            || tempphone != ''
            || tempemail != ''
            || temptypeOfEmployment != '') {
            CancleEmploymentInfoPopup();
        }
        else {
            Employment.loadEmploymentLanding();
        }
    }

    function CancleEmploymentInfoPopup() {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(confirmPopup);
                Employment.loadEmploymentLanding();
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

        message.innerText = 'Any changes you have made will not be saved. Do you wish to continue?';
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
        buildNewEmploymentForm,
        getMarkup,
    };
})(); 