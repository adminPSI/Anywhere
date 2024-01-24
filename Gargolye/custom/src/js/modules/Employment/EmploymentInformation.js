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
    let employerName;
    let positionName;
    let selectedConsumersName;
    let getEmployeepath = [];
    let existingEndDate;
    let isNewPositionEnable;
    let currentStatus;
    let pathToEmployment;
    let pathToStartDate;
    let temptypeOfEmployment = '';

    async function init(positionId, Name, PositionName, SelectedConsumersName, ConsumersId) {
        PositionId = positionId;
        consumersID = ConsumersId;
        employerName = Name;
        positionName = PositionName;
        selectedConsumersName = SelectedConsumersName;
        getEmployeepath = await EmploymentAjax.getEmployeementPathAsync(ConsumersId);
        if (PositionId != undefined) {
            getEmployeeInfoByID = await EmploymentAjax.getEmployeeInfoByIDAsync(PositionId);
        }

        const result = await EmploymentAjax.isNewPositionEnableAsync(ConsumersId);
        const { isNewPositionEnableResult } = result;
        if (isNewPositionEnableResult[0].IsEmployeeEnable == '0') {
            isNewPositionEnable = true;
        }
        else {
            isNewPositionEnable = false;
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
        if (isNewPositionEnable)
            createEmploymentPathPopupBtn();
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

        employmentPath = getEmployeepath.getEmployeementPathResult.length > 0 ? getEmployeepath.getEmployeementPathResult[0].employmentPath : '';
        existingPathID = getEmployeepath.getEmployeementPathResult[0] == undefined || getEmployeepath.getEmployeementPathResult[0].existingPathID == '' ? '' : getEmployeepath.getEmployeementPathResult[0].existingPathID;
        existingStartDate = getEmployeepath.getEmployeementPathResult[0] == undefined || getEmployeepath.getEmployeementPathResult[0].existingStartDate == '' ? '' : moment(getEmployeepath.getEmployeementPathResult[0].existingStartDate).format('YYYY-MM-DD');
        existingEndDate = getEmployeepath.getEmployeementPathResult[0] == undefined || getEmployeepath.getEmployeementPathResult[0].existingEndDate == '' ? '' : moment(getEmployeepath.getEmployeementPathResult[0].existingEndDate).format('YYYY-MM-DD');
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
            label: "Type Of Work",
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
                SAVE_BTN.classList.add('disabled');
                saveEmployeeInfo()
            },
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
            callback: () => {
                updatePathPopupBtn()
            },
        });

        var LineBr = document.createElement('br');


        const messageHeading = document.createElement('b');
        messageHeading.classList.add('boldfont');
        messageHeading.style.marginTop = '1%';
        messageHeading.innerText = 'Path to Employment: '

        const message = document.createElement('p');
        if (employmentPath == '1')
            message.innerText = ' 1 - I have a job but would like a better one or to move up.';
        else if (employmentPath == '2')
            message.innerText = ' 2 - I want a job! I need help to find one.';
        else if (employmentPath == '3')
            message.innerText = " 3 - I'm not sure about work. I need help to learn more.";
        else if (employmentPath == '4')
            message.innerText = " 4 - I don't think I want to work, but I may not know enough.";
        else
            message.innerText = '';
        message.style.marginTop = '1%';
        message.style.marginLeft = '1%';
        var msgWrap = document.createElement('div');
        msgWrap.classList.add('employmentMsgWrap');

        msgWrap.appendChild(messageHeading);
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
            callback: () => {
                APPLY_BTN.classList.add('disabled');
                saveNewPathPopup();
            }
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

        var confirmMessage = document.createElement('div');
        confirmMessage.innerHTML = `<h3 id="confirmMessage" class="confirmMessage password-warning"></h3>`;
        updatePathPopup.appendChild(confirmMessage);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(APPLY_BTN);
        popupbtnWrap.appendChild(CANCEL_BTN);
        updatePathPopup.appendChild(popupbtnWrap);

        POPUP.show(updatePathPopup);
        PopupEventListeners();
        populateNewPathEmploymentDropdown('updatePath');
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

        if (CurrentEndDate.value === '' || CurrentEndDate.value < existingStartDate) {
            currentPathEndDate.classList.add('errorPopup');
        } else {
            currentPathEndDate.classList.remove('errorPopup');
        }

        if (newStartDate.value === '' || CurrentEndDate.value > newStartDate.value || (newEndDate.value != '' && newStartDate.value > newEndDate.value)) {
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

    function populateNewPathEmploymentDropdown(pathName) {
        const condfidentialDropdownData = ([
            { id: 1, value: 1, text: "1 - I have a job but would like a better one or to move up." },
            { id: 2, value: 2, text: "2 - I want a job! I need help to find one." },
            { id: 3, value: 3, text: "3 - I'm not sure about work. I need help to learn more." },
            { id: 4, value: 4, text: "4 - I don't think I want to work, but I may not know enough." },
        ]);
        condfidentialDropdownData.unshift({ id: null, value: '', text: '' });
        if (pathName == 'updatePath')
            dropdown.populate("newPathEmploymentDropdown", condfidentialDropdownData, employmentPath);
        else
            dropdown.populate("pathToEmploymentDropdown", condfidentialDropdownData, pathToEmployment);
    }



    async function saveNewPathPopup() {
        const result = await EmploymentAjax.insertEmploymentPathAsync(employmentPath, newStartDate, newEndDate, currentEndDate, consumersID, $.session.UserId, existingPathID);
        const { insertEmploymentPathResult } = result;
        var messagetext = document.getElementById('confirmMessage');

        messagetext.innerHTML = ``;
        if (insertEmploymentPathResult.pathId == '-1') {
            messagetext.innerHTML = 'This record overlaps with an existing record. Changes cannot be saved.';
            messagetext.classList.add('password-error');
        }
        else {
            NewEmployment.refreshEmployment(PositionId, employerName, positionName, selectedConsumersName, consumersID);
            POPUP.hide(updatePathPopup);
        }

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


    function createEmploymentPathPopupBtn() {
        pathToStartDate = '';
        pathToEmployment = '';
        currentStatus = '';  

        createPathPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        // dropdowns & inputs
        currentStatusDropdown = dropdown.build({
            id: 'currentStatusDropdown',
            label: "Current Status",
            dropdownId: "currentStatusDropdown",
        });

        pathToEmploymentDropdown = dropdown.build({
            id: 'pathToEmploymentDropdown',
            label: "Path to Employment",
            dropdownId: "pathToEmploymentDropdown",
        });

        pathToEmploymentStartDate = input.build({
            id: 'pathToEmploymentStartDate',
            type: 'date',
            label: 'Path to Employment Start Date',
            style: 'secondary',
        });

        CONTINUE_BTN = button.build({
            text: 'continue',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                CONTINUE_BTN.classList.add('disabled');
                createNewPath();
            }
        });

        CREATE_PATH_CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        createPathPopup.appendChild(currentStatusDropdown);
        createPathPopup.appendChild(pathToEmploymentDropdown);
        createPathPopup.appendChild(pathToEmploymentStartDate);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(CREATE_PATH_CANCEL_BTN);
        popupbtnWrap.appendChild(CONTINUE_BTN);
        createPathPopup.appendChild(popupbtnWrap);

        POPUP.show(createPathPopup);
        pathToEmploymentStartDate.classList.add('disabled');
        createEmploymentPathPopupEventListeners();
        populateNewPathEmploymentDropdown('createPath');
        populateEmploymentStatusDropdowns();
        checkRequiredFieldsOfCreateEmploymentPath();
    }

    function createEmploymentPathPopupEventListeners() {
        currentStatusDropdown.addEventListener('change', event => {
            currentStatus = event.target.value;
            checkRequiredFieldsOfCreateEmploymentPath();
        });
        pathToEmploymentDropdown.addEventListener('change', event => {
            pathToEmployment = event.target.value;
            if (pathToEmployment == '') {
                pathToEmploymentStartDate.classList.add('disabled');
                pathToStartDate = '';
                document.getElementById('pathToEmploymentStartDate').value = '';
            }
            else {
                pathToEmploymentStartDate.classList.remove('disabled');
            }
            checkRequiredFieldsOfCreateEmploymentPath();
        });

        pathToEmploymentStartDate.addEventListener('input', event => {
            pathToStartDate = event.target.value;
            checkRequiredFieldsOfCreateEmploymentPath();
        });

        CREATE_PATH_CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(createPathPopup);
            Employment.loadEmploymentLanding();
        });
    }

    function checkRequiredFieldsOfCreateEmploymentPath() {
        var currentSts = currentStatusDropdown.querySelector('#currentStatusDropdown');
        var pathToEmp = pathToEmploymentDropdown.querySelector('#pathToEmploymentDropdown');
        var pathStartDt = pathToEmploymentStartDate.querySelector('#pathToEmploymentStartDate');

        if (currentSts.value === '') {
            currentStatusDropdown.classList.add('errorPopup');
        } else {
            currentStatusDropdown.classList.remove('errorPopup');
        }

        if (pathToEmp.value != '' && pathStartDt.value === '') {
            pathToEmploymentStartDate.classList.add('errorPopup');
        } else {
            pathToEmploymentStartDate.classList.remove('errorPopup');
        }

        setBtnStatusOfCreateEmploymentPath();
    }

    function setBtnStatusOfCreateEmploymentPath() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            CONTINUE_BTN.classList.add('disabled');
            return;
        } else {
            CONTINUE_BTN.classList.remove('disabled');
        }
    }
    async function populateEmploymentStatusDropdowns() {
        const {
            getEmployeeStatusDropDownResult: EmpStatus,
        } = await EmploymentAjax.getEmployeeStatusDropDownAsync();
        let empStatus = EmpStatus.map((empStatus) => ({
            id: empStatus.empStatusId,
            value: empStatus.empStatusId,
            text: empStatus.empStatusName
        }));
        empStatus.unshift({ id: null, value: '', text: '' });
        dropdown.populate("currentStatusDropdown", empStatus, currentStatus);
    }

    async function createNewPath() {
        const result = await EmploymentAjax.createNewEmploymentPathAsync(currentStatus, pathToEmployment, pathToStartDate, consumersID, $.session.UserId);
        const { createNewEmploymentPathResult } = result;
        if (createNewEmploymentPathResult.pathId != '0') {
            POPUP.hide(createPathPopup);
            NewEmployment.refreshEmployment(PositionId, employerName, positionName, selectedConsumersName, consumersID);

        }
    }

    return {
        init,
        buildNewEmploymentForm,
        getMarkup,
    };
})(); 