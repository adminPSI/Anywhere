const EmploymentInformation = (() => {
    // dropdown and inputs declaration
    var employmentPath;
    async function init() {
        buildNewEmploymentForm();
    }
    async function buildNewEmploymentForm(positionId) {

        if (positionId) {

            const result = await EmploymentAjax.getEmployeeInfoByIDAsync(positionId);
            const { getEmployeeInfoByIDResult } = result;

            startDatePosition = getEmployeeInfoByIDResult[0].positionStartDate;
            endDatePosition = getEmployeeInfoByIDResult[0].positionEndDate;
            position = getEmployeeInfoByIDResult[0].position;
            jobStanding = getEmployeeInfoByIDResult[0].jobStanding;
            employer = getEmployeeInfoByIDResult[0].employer;
            transportation = getEmployeeInfoByIDResult[0].transportation;
            typeOfWork = getEmployeeInfoByIDResult[0].typeOfWork;
            selfEmployed = getEmployeeInfoByIDResult[0].selfEmployed;
            name = getEmployeeInfoByIDResult[0].name;
            phone = getEmployeeInfoByIDResult[0].phone;
            email = getEmployeeInfoByIDResult[0].email;
            employmentPath = getEmployeeInfoByIDResult[0].employmentPath;
        }
        else {
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
            employmentPath = '';
        }

        positionStartDate = input.build({
            id: 'positionStartDate',
            type: 'date',
            label: 'Start Date',
            style: 'secondary',
            value: (startDatePosition) ? UTIL.formatDateFromIso(startDatePosition) : '',
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

        TransportationDropdown = dropdown.build({
            id: 'transportationDropdown',
            label: "Transportation",
            dropdownId: "transportationDropdown",
            value: (transportation) ? transportation : '',
        });

        TypeOfWorkDropdown = dropdown.build({
            id: 'typeOfWorkDropdown',
            label: "Type Of Work",
            dropdownId: "typeOfWorkDropdown",
            value: (typeOfWork) ? typeOfWork : '',
        });

        isSelfEmployed = input.buildCheckbox({
            text: 'Self-Employed?',
            id: 'chkisSelfEmployed',
            isChecked: selfEmployed == '' ? false : true,
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
            text: 'Save',
            style: 'secondary',
            type: 'contained',
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { CancleEmploymentInfoPopup(); },
        });
        UPDATE_BTN = button.build({
            text: 'Update',
            style: 'secondary',
            type: 'contained',
            callback: () => updatePathPopupBtn()
        });

        DOM.clearActionCenter();
        var LineBr = document.createElement('br');

        const message = document.createElement('b');
        message.style.marginTop = '1%';

        if (employmentPath = '1')
            message.innerText = 'I have a job but would like a better one or to move up.';
        else if (employmentPath = '2')
            message.innerText = 'I want a job! I need help to fine one.';
        else if (employmentPath = '3')
            message.innerText = "I'm not sure about work. I need help to learn more.";
        else if (employmentPath = '4')
            message.innerText = "I don't think I want to work, but I may not know enough.";
        else
            message.innerText = '';

        var msgWrap = document.createElement('div');
        msgWrap.classList.add('employmentMsgWrap');

        msgWrap.appendChild(message);
        UPDATE_BTN.style.marginLeft = '1%';
        msgWrap.appendChild(UPDATE_BTN);
        DOM.ACTIONCENTER.appendChild(msgWrap);

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
        TransportationDropdown.style.width = '27%';
        dropWrap.appendChild(TransportationDropdown);
        positionStartDate.style.width = '20%';
        dropWrap.appendChild(positionStartDate);
        positionEndDate.style.width = '20%';
        dropWrap.appendChild(positionEndDate);
        addNewCardBody.appendChild(dropWrap);

        var drWrap = document.createElement('div');
        drWrap.classList.add('employmentDTWrap');
        TypeOfWorkDropdown.style.width = '35%';
        drWrap.appendChild(TypeOfWorkDropdown);
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
        DOM.ACTIONCENTER.appendChild(column1);
        checkRequiredFieldsOfEmployeeInfo();
    }

    function enableDisabledInputs() {
        if ($.session.EmploymentUpdate) {
            positionStartDate.classList.remove('disabled');
            positionEndDate.classList.remove('disabled');
            positionDropdown.classList.remove('disabled');
            jobStandingDropdown.classList.remove('disabled');
            employerDropdown.classList.remove('disabled');
            TransportationDropdown.classList.remove('disabled');
            TypeOfWorkDropdown.classList.remove('disabled');
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
            TransportationDropdown.classList.add('disabled');
            TypeOfWorkDropdown.classList.add('disabled');
            isSelfEmployed.classList.add('disabled');
            nameInput.classList.add('disabled');
            phoneInput.classList.add('disabled');
            emailInput.classList.add('disabled');
            UPDATE_BTN.classList.add('disabled');
            SAVE_BTN.classList.add('disabled');
        }

    }

    function checkRequiredFieldsOfEmployeeInfo() {
        var startDate = newDateInput.querySelector('#positionStartDate');
        var position = newAmountInput.querySelector('#positionDropdown');
        var employer = newAccountDropdown.querySelector('#employerDropdown');
        var jobStanding = newPayeeDropdown.querySelector('#jobStandingDropdown');


        if (startDate.value === '') {
            positionStartDate.classList.add('error');
        } else {
            positionStartDate.classList.remove('error');
        }

        if (position.value === '') {
            positionDropdown.classList.add('error');
        } else {
            positionDropdown.classList.remove('error');
        }

        if (employer.value === '') {
            employerDropdown.classList.add('error');
        } else {
            employerDropdown.classList.remove('error');
        }

        if (jobStanding.value === '') {
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
        });
        positionEndDate.addEventListener('input', event => {
            endDatePosition = event.target.value;
        });
        positionDropdown.addEventListener('change', event => {
            position = event.target.value;
        });
        jobStandingDropdown.addEventListener('change', event => {
            jobStanding = event.target.value;
        });
        employerDropdown.addEventListener('change', event => {
            employer = event.target.value;
        });
        TransportationDropdown.addEventListener('change', event => {
            transportation = event.target.value;
        });
        TypeOfWorkDropdown.addEventListener('change', event => {
            typeOfWork = event.target.value;
        });
        isSelfEmployed.addEventListener('change', event => {
            selfEmployed = event.target.value;
        });
        nameInput.addEventListener('input', event => {
            name = event.target.value;
        });
        phoneInput.addEventListener('input', event => {
            phone = event.target.value;
        });
        emailInput.addEventListener('input', event => {
            email = event.target.value;
        });
    }

    async function populateDropdowns() {
        const {
            getPositionsResult: Positions,
        } = await EmploymentAjax.getPositionsAsync();
        let positionsData = Positions.map((positions) => ({
            id: positions.positionId,
            value: positions.positionName,
            text: positions.positionName
        }));
        dropdown.populate("positionDropdown", positionsData, position);

        const {
            getEmployersResult: Employer,
        } = await EmploymentAjax.getEmployersAsync();
        let data = Employer.map((employer) => ({
            id: employer.employerId,
            value: employer.employerName,
            text: employer.employerName
        }));
        dropdown.populate("employerDropdown", data, employer);

        const {
            getJobStandingsResult: JobStanding,
        } = await EmploymentAjax.getJobStandingsAsync();
        let jobStandingData = JobStanding.map((jobStanding) => ({
            id: jobStanding.jobStandingId,
            value: jobStanding.jobStandingName,
            text: jobStanding.jobStandingName
        }));

        dropdown.populate("jobStandingDropdown", jobStandingData, jobStanding);
    }


    function updatePathPopupBtn() {
        employmentPath = '';
        currentEndDate = '';
        newStartDate = '';
        newEndDate = '';

        updatePathPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
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
            label: 'New Path Strat Date',
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
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });

        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        //APPLY_BTN.style.width = '100%';
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
        });
        currentPathEndDate.addEventListener('input', event => {
            currentEndDate = event.target.value;
            checkRequiredFieldsOfEmploymentPath();
        });


        APPLY_BTN.addEventListener('click', () => {
            //updateFilterData({
            //    tmpEmployer,
            //    tmpPosition,
            //    tmpJobStanding,
            //    tmpStartDate,
            //    tmpEndDate
            //});

            POPUP.hide(updatePathPopup);

        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(updatePathPopup);
        });
    }

    function checkRequiredFieldsOfEmploymentPath() {
        var newPathEmployment = newDateInput.querySelector('#newPathEmploymentDropdown');
        var newStartDate = newAmountInput.querySelector('#newPathStartDate');
        var newEndDate = newAccountDropdown.querySelector('#newPathEndDate');
        var CurrentEndDate = newPayeeDropdown.querySelector('#currentPathEndDate');

        if (newPathEmployment.value === '') {
            newPathEmploymentDropdown.classList.add('errorPopup');
        } else {
            newPathEmploymentDropdown.classList.remove('errorPopup');
        }

        if (newStartDate.value === '') {
            newPathStartDate.classList.add('errorPopup');
        } else {
            newPathStartDate.classList.remove('errorPopup');
        }

        if (CurrentEndDate.value === '') {
            currentPathEndDate.classList.add('errorPopup');
        } else {
            currentPathEndDate.classList.remove('errorPopup');
        }

        if (newStartDate.value >= CurrentEndDate.value) {
            newPathStartDate.classList.add('errorPopup');
        } else {
            newPathStartDate.classList.remove('errorPopup');
        }


        setBtnStatusOfEmploymentPath();
    }

    function setBtnStatusOfEmploymentPath() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            NEW_SAVE_BTN.classList.add('disabled');
            return;
        } else {
            NEW_SAVE_BTN.classList.remove('disabled');
        }
    }

    function populateNewPathEmploymentDropdown() {
        const condfidentialDropdownData = ([
            { id: 1, value: 1, text: "I have a job but would like a better one or to move up." },
            { id: 2, value: 2, text: "I want a job! I need help to fine one." },
            { id: 3, value: 3, text: "I'm not sure about work. I need help to learn more." },
            { id: 4, value: 4, text: "I don't think I want to work, but I may not know enough." },
        ]);
        dropdown.populate("newPathEmploymentDropdown", condfidentialDropdownData, employmentPath);
    }



    async function saveNewPathPopup() {

    }

    async function saveEmployeeInfo() {

    }

    function CancleEmploymentInfoPopup() {

        const confirmPopup = POPUP.build({
            hideX: true,
        });
        const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(confirmPopup);
                Employment.loadEmploymentLanding();  
            },
        });
        okBtn.style.width = '100%';
        const message = document.createElement('p');

        message.innerText = 'Any changes you have made will not be saved. Do you wish to continue?';


        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        confirmPopup.appendChild(message);
        confirmPopup.appendChild(okBtn);
        okBtn.focus();
        POPUP.show(confirmPopup);
    }

    // Populate the Account DDL




    return {
        init,
        buildNewEmploymentForm,

    };
})(); 