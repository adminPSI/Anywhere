const EmploymentInformation = (() => {
    var employmentPath;
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
    let name;
    let positionName;
    let selectedConsumersName;
    let getEmployeepath = [];
    let existingEndDate;

    async function init(positionId, Name, PositionName, SelectedConsumersName, ConsumersId) {
        PositionId = positionId;
        consumersID = ConsumersId;
        name = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;
        getEmployeepath = await EmploymentAjax.getEmployeementPathAsync(ConsumersId);
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
            BtnName = 'SAVE'
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
            employmentPath = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].employmentPath;
            peopleID = getEmployeeInfoByID.getEmployeeInfoByIDResult[0].peopleId;
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
            employmentPath = getEmployeepath.getEmployeementPathResult[0].employmentPath;
            peopleID = consumersID;
        }
        existingEndDate = moment(getEmployeepath.getEmployeementPathResult[0].existingEndDate).format('YYYY-MM-DD'); 
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
            callback: async () => { saveEmployeeInfo() },
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { CancleValidate() },
        });
        UPDATE_BTN = button.build({
            text: 'Update',
            style: 'secondary',
            type: 'contained',
            callback: () => updatePathPopupBtn()
        });

        var LineBr = document.createElement('br');

        const message = document.createElement('b');
        message.style.marginTop = '1%';

        if (employmentPath == '1')
            message.innerText = 'Path to Employment: I have a job but would like a better one or to move up.';
        else if (employmentPath == '2')
            message.innerText = 'Path to Employment: I want a job! I need help to find one.';
        else if (employmentPath == '3')
            message.innerText = "Path to Employment: I'm not sure about work. I need help to learn more.";
        else if (employmentPath == '4')
            message.innerText = "Path to Employment: I don't think I want to work, but I may not know enough.";
        else
            message.innerText = 'Path to Employment:';

        var msgWrap = document.createElement('div');
        msgWrap.classList.add('employmentMsgWrap');

        msgWrap.appendChild(message);

        if ($.session.EmploymentUpdate) {
            UPDATE_BTN.style.marginLeft = '1%';
            msgWrap.appendChild(UPDATE_BTN);
        }

        employeeInfoDiv.appendChild(msgWrap);

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Employment Information</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)
        addNewCardBody.appendChild(employerDropdown);
        addNewCardBody.appendChild(positionDropdown);

        var dropWrap = document.createElement('div');
        dropWrap.classList.add('employmentDTWrap');
        jobStandingDropdown.style.width = '27%';
        dropWrap.appendChild(jobStandingDropdown);
        transportationDropdown.style.width = '27%';
        dropWrap.appendChild(transportationDropdown);
        positionStartDate.style.width = '20%';
        dropWrap.appendChild(positionStartDate);
        positionEndDate.style.width = '20%';
        dropWrap.appendChild(positionEndDate);
        addNewCardBody.appendChild(dropWrap);

        var drWrap = document.createElement('div');
        drWrap.classList.add('employmentDTWrap');
        typeOfWorkDropdown.style.width = '35%';
        drWrap.appendChild(typeOfWorkDropdown);
        isSelfEmployed.style.width = '25%';
        isSelfEmployed.style.marginRight = '35%';
        drWrap.appendChild(isSelfEmployed);
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
        nameInput.style.width = '30%';
        infoWrap.appendChild(nameInput);
        phoneInput.style.width = '32%';
        infoWrap.appendChild(phoneInput);
        emailInput.style.width = '32%';
        infoWrap.appendChild(emailInput);
        addNewCardBody.appendChild(infoWrap);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('employmentDTWrap');
        btnWrap.style.marginLeft = '25%';
        btnWrap.style.width = '50%';

        if ($.session.EmploymentUpdate) {
            SAVE_BTN.style.width = '48%';
            btnWrap.appendChild(SAVE_BTN);
        }

        CANCEL_BTN.style.width = '48%';
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
            return;
        } else {
            SAVE_BTN.classList.remove('disabled');
        }
    }

    function eventListeners() {
        positionStartDate.addEventListener('input', event => {
            startDatePosition = event.target.value;
            tempstartDatePosition = event.target.value;
            getRequiredFieldsOfEmployeeInfo();
        });
        positionEndDate.addEventListener('input', event => {
            endDatePosition = event.target.value;
            tempendDatePosition = event.target.value;
            getRequiredFieldsOfEmployeeInfo();  
        });
        positionDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            position = selectedConsumerOption.id;
            tempposition = event.target.value;
            getRequiredFieldsOfEmployeeInfo();
        });
        jobStandingDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            jobStanding = selectedConsumerOption.id;
            tempjobStanding = event.target.value;
            getRequiredFieldsOfEmployeeInfo();
        });
        employerDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            employer = selectedConsumerOption.id;
            tempemployer = event.target.value;
            getRequiredFieldsOfEmployeeInfo();
        });
        transportationDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            transportation = selectedConsumerOption.id;
            temptransportation = event.target.value;
        });
        typeOfWorkDropdown.addEventListener('change', event => {
            var selectedConsumerOption = event.target.options[event.target.selectedIndex];
            typeOfWork = selectedConsumerOption.id;
            temptypeOfWork = event.target.value;
        });
        isSelfEmployed.addEventListener('change', event => {
            selfEmployed = event.target.checked == true ? 'Y' : 'N';
            tempselfEmployed = event.target.value;
        });
        nameInput.addEventListener('input', event => {
            name = event.target.value;
            tempname = event.target.value;
        });
        phoneInput.addEventListener('input', event => {
            phone = event.target.value;
            tempphone = event.target.value;
        });
        emailInput.addEventListener('input', event => {
            email = event.target.value;
            tempemail = event.target.value;
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
    }


    function updatePathPopupBtn() {
        employmentPath = '';
        currentEndDate = existingEndDate;
        newStartDate = '';
        newEndDate = '';

        updatePathPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '20px';
        heading.innerText = 'Update Path to Employment';

        // dropdowns & inputs
        currentPathEndDate = input.build({
            id: 'currentPathEndDate',
            type: 'date',
            label: 'Current Path End Date',
            style: 'secondary',
            value: currentEndDate,
        });

        newPathEmploymentDropdown = dropdown.build({
            id: 'newPathEmploymentDropdown',
            label: "New Path to Employment",
            dropdownId: "newPathEmploymentDropdown",
        });

        newPathStartDate = input.build({
            id: 'newPathStartDate',
            type: 'date',
            label: 'New Path Start Date',
            style: 'secondary',
            value: newStartDate,
        });

        newPathEndDate = input.build({
            id: 'newPathEndDate',
            type: 'date',
            label: 'New Path End Date',
            style: 'secondary',
            value: newEndDate,
        });

        APPLY_BTN = button.build({
            text: 'APPLY',
            style: 'secondary',
            type: 'contained',
            callback: () => saveNewPathPopup()
        });

        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        updatePathPopup.appendChild(heading);
        updatePathPopup.appendChild(currentPathEndDate);

        updatePathPopup.appendChild(newPathEmploymentDropdown);
        updatePathPopup.appendChild(newPathStartDate);
        updatePathPopup.appendChild(newPathEndDate);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(APPLY_BTN);
        popupbtnWrap.appendChild(CANCEL_BTN);
        updatePathPopup.appendChild(popupbtnWrap);

        POPUP.show(updatePathPopup);
        PopupEventListeners();
        populateNewPathEmploymentDropdown();
        checkRequiredFieldsOfEmploymentPath();
    }

    function PopupEventListeners() {
        newPathEmploymentDropdown.addEventListener('change', event => {
            employmentPath = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });

        newPathStartDate.addEventListener('input', event => {
            newStartDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });
        newPathEndDate.addEventListener('input', event => {
            newEndDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });
        currentPathEndDate.addEventListener('input', event => {
            currentEndDate = event.target.value;
            existingEndDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(updatePathPopup);
        });
    }

    function checkRequiredFieldsOfEmploymentPath() {
        var newPathEmployment = newPathEmploymentDropdown.querySelector('#newPathEmploymentDropdown');
        var newStartDate = newPathStartDate.querySelector('#newPathStartDate');
        var newEndDate = newPathEndDate.querySelector('#newPathEndDate');
        var CurrentEndDate = currentPathEndDate.querySelector('#currentPathEndDate');

        if (newPathEmployment.value === '') {
            newPathEmploymentDropdown.classList.add('errorPopup');
        } else {
            newPathEmploymentDropdown.classList.remove('errorPopup');
        }

        if (CurrentEndDate.value === '') {
            currentPathEndDate.classList.add('errorPopup');
        } else {
            currentPathEndDate.classList.remove('errorPopup');
        }

        if (newStartDate.value === '' || newStartDate.value <= existingEndDate || (newEndDate.value != '' && newStartDate.value > newEndDate.value)) {
            newPathStartDate.classList.add('errorPopup');
        } else {
            newPathStartDate.classList.remove('errorPopup');
        }

        setBtnStatusOfEmploymentPath();
    }

    function setBtnStatusOfEmploymentPath() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            APPLY_BTN.classList.add('disabled');
            return;
        } else {
            APPLY_BTN.classList.remove('disabled');
        }
    }

    function populateNewPathEmploymentDropdown() {
        const condfidentialDropdownData = ([
            { id: 1, value: 1, text: "I have a job but would like a better one or to move up." },
            { id: 2, value: 2, text: "I want a job! I need help to find one." },
            { id: 3, value: 3, text: "I'm not sure about work. I need help to learn more." },
            { id: 4, value: 4, text: "I don't think I want to work, but I may not know enough." },
        ]);
        condfidentialDropdownData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newPathEmploymentDropdown", condfidentialDropdownData, employmentPath);
    }



    async function saveNewPathPopup() {
        const result = await EmploymentAjax.insertEmploymentPathAsync(employmentPath, newStartDate, newEndDate, currentEndDate, consumersID, $.session.UserId);
        const { insertEmploymentPathResult } = result;
        if (insertEmploymentPathResult.pathId != null) {
            NewEmployment.refreshEmployment(PositionId, name, positionName, selectedConsumersName, consumersID);
        }
        POPUP.hide(updatePathPopup);
    }

    async function saveEmployeeInfo() {
        const result = await EmploymentAjax.insertEmploymentInfoAsync(startDatePosition, endDatePosition, position, jobStanding, employer, transportation, typeOfWork, selfEmployed, name, phone, email, consumersID, $.session.UserId, PositionId);
        const { insertEmploymentInfoResult } = result;
        if (insertEmploymentInfoResult.positionID != null) {
            Employment.loadEmploymentLanding();
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
            || tempemail != '') {
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