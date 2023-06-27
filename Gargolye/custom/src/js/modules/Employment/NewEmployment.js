//const NewEmployment = (() => {
//    // dropdown and inputs declaration

//    let newPathEmploymentVal;

//    async function init() {
//        buildNewEmploymentForm();
//    }
//    async function buildNewEmploymentForm() {
 

//        positionStartDate = input.build({
//            id: 'positionStartDate',
//            type: 'date',
//            label: 'Start Date',
//            style: 'secondary',
//            //value: filterValues.positionStartDate,
//        });

//        positionEndDate = input.build({
//            id: 'positionEndDate',
//            type: 'date',
//            label: 'End Date',
//            style: 'secondary',
//            //value: filterValues.positionEndDate,
//        });

//        positionDropdown = dropdown.build({
//            id: 'positionDropdown',
//            label: "Position",
//            dropdownId: "positionDropdown",
//        });

//        jobStandingDropdown = dropdown.build({
//            id: 'jobStandingDropdown',
//            label: "Job Standing",
//            dropdownId: "jobStandingDropdown",
//        });

//        EmployerDropdown = dropdown.build({
//            id: 'employerDropdown',
//            label: "Employer",
//            dropdownId: "employerDropdown",
//        });

//        TransportationDropdown = dropdown.build({
//            id: 'transportationDropdown',
//            label: "Transportation",
//            dropdownId: "transportationDropdown",
//        });

//        TypeOfWorkDropdown = dropdown.build({
//            id: 'typeOfWorkDropdown',
//            label: "Type Of Work",
//            dropdownId: "typeOfWorkDropdown",
//        });

//        isSelfEmployed = input.buildCheckbox({
//            text: 'Self-Employed?',
//            id: 'chkisSelfEmployed',
//            // callback: () => setCheckForInactiveUser(event.target),
//            isChecked: false,
//        });

//        nameInput = input.build({
//            id: 'nameInput',
//            label: 'Name',
//            type: 'text',
//            style: 'secondary',
//        });

//        phoneInput = input.build({
//            id: 'phoneInput',
//            label: 'Phone',
//            type: 'number',
//            style: 'secondary',
//            attributes: [{ key: 'maxlength', value: '12' }],
//        });

//        emailInput = input.build({
//            id: 'emailInput',
//            label: 'Email',
//            type: 'text',
//            style: 'secondary',
//        });

//        // Save button
//        SAVE_BTN = button.build({
//            text: 'Save',
//            style: 'secondary',
//            type: 'contained',
//        });
//        CANCEL_BTN = button.build({
//            text: 'Cancel',
//            style: 'secondary',
//            type: 'outlined',
//            // callback: () => filterPopupCancelBtn()
//        });
//        UPDATE_BTN = button.build({
//            text: 'Update',
//            style: 'secondary',
//            type: 'contained',
//            callback: () => updatePathPopupBtn()
//        });

//        DOM.clearActionCenter();
//        var LineBr = document.createElement('br');

//        const message = document.createElement('b');
//        message.style.marginTop = '1%';
//        message.innerText = 'Path to Employment : I Want a job! I need help to find one.';

//        var msgWrap = document.createElement('div');
//        msgWrap.classList.add('employmentMsgWrap');

//        msgWrap.appendChild(message);
//        UPDATE_BTN.style.marginLeft = '1%';
//        msgWrap.appendChild(UPDATE_BTN);
//        DOM.ACTIONCENTER.appendChild(msgWrap);

//        const column1 = document.createElement('div')
//        column1.classList.add('col-1')
//        const addNewCard = document.createElement("div");
//        addNewCard.classList.add("card");
//        const addNewCardBody = document.createElement("div");
//        addNewCardBody.classList.add("card__body");
//        addNewCard.innerHTML = `<div class="card__header">Employment Information</div>`;
//        addNewCard.appendChild(addNewCardBody)
//        column1.appendChild(addNewCard)
//        addNewCardBody.appendChild(EmployerDropdown);
//        addNewCardBody.appendChild(positionDropdown);

//        var dropWrap = document.createElement('div');
//        dropWrap.classList.add('employmentDTWrap');
//        jobStandingDropdown.style.width = '27%';
//        dropWrap.appendChild(jobStandingDropdown);
//        TransportationDropdown.style.width = '27%';
//        dropWrap.appendChild(TransportationDropdown);
//        positionStartDate.style.width = '20%';
//        dropWrap.appendChild(positionStartDate);
//        positionEndDate.style.width = '20%';
//        dropWrap.appendChild(positionEndDate);
//        addNewCardBody.appendChild(dropWrap);

//        var drWrap = document.createElement('div');
//        drWrap.classList.add('employmentDTWrap');
//        TypeOfWorkDropdown.style.width = '35%';
//        drWrap.appendChild(TypeOfWorkDropdown);
//        isSelfEmployed.style.width = '25%';
//        isSelfEmployed.style.marginRight = '35%';
//        drWrap.appendChild(isSelfEmployed);
//        addNewCardBody.appendChild(drWrap);

//        const consumerNameDisplay = document.createElement("p");
//        consumerNameDisplay.classList.add("heading");
//        consumerNameDisplay.innerHTML = `<span>${'Supervisor Information'}</span>`;
//        consumerNameDisplay.style.marginLeft = '10px';
//        addNewCardBody.appendChild(consumerNameDisplay);
//        addNewCardBody.appendChild(LineBr);
//        addNewCardBody.appendChild(LineBr);

//        var infoWrap = document.createElement('div');
//        infoWrap.classList.add('employmentDTWrap');
//        nameInput.style.width = '30%';
//        infoWrap.appendChild(nameInput);
//        phoneInput.style.width = '32%';
//        infoWrap.appendChild(phoneInput);
//        emailInput.style.width = '32%';
//        infoWrap.appendChild(emailInput);
//        addNewCardBody.appendChild(infoWrap);

//        var btnWrap = document.createElement('div');
//        btnWrap.classList.add('employmentDTWrap');
//        btnWrap.style.marginLeft = '25%';
//        btnWrap.style.width = '50%';
//        SAVE_BTN.style.width = '48%';
//        btnWrap.appendChild(SAVE_BTN);
//        CANCEL_BTN.style.width = '48%';
//        btnWrap.appendChild(CANCEL_BTN);
//        addNewCardBody.appendChild(btnWrap);

//        DOM.ACTIONCENTER.appendChild(column1);
//    }


//    function updatePathPopupBtn() {

//        updatePathPopup = POPUP.build({
//            classNames: ['rosterFilterPopup'],
//            hideX: true,
//        });

//        const heading = document.createElement('h2');
//        heading.innerText = 'Update Path to Employment';

//        // dropdowns & inputs 
//        currentPathEndDate = input.build({
//            id: 'currentPathEndDate',
//            type: 'date',
//            label: 'Current Path End Date',
//            style: 'secondary',
//        });

//        newPathEmployment = dropdown.build({
//            id: 'newPathEmployment',
//            label: "New Path to Employment",
//            dropdownId: "newPathEmployment",
//            value: newPathEmploymentVal,
//        });

//        newPathStartDate = input.build({
//            id: 'newPathStartDate',
//            type: 'date',
//            label: 'New Path Strat Date',
//            style: 'secondary',
//        });

//        newPathEndDate = input.build({
//            id: 'newPathEndDate',
//            type: 'date',
//            label: 'New Path End Date',
//            style: 'secondary',
//        });

//        APPLY_BTN = button.build({
//            text: 'Apply',
//            style: 'secondary',
//            type: 'contained',
//        });
//        APPLY_BTN.style.width = '100%';
//        updatePathPopup.appendChild(heading);  
//        updatePathPopup.appendChild(currentPathEndDate);
//        updatePathPopup.appendChild(newPathEmployment);
//        updatePathPopup.appendChild(newPathStartDate);
//        updatePathPopup.appendChild(newPathEndDate);
//        updatePathPopup.appendChild(APPLY_BTN);
//        POPUP.show(updatePathPopup);
//    }

//    function eventListeners() {

//    }

//    async function populateNewPathEmploymentDropdown() {
//        const condfidentialDropdownData = ([
//            { text: "I have a job but would like a better one or to move up.", value: '1' },
//            { text: "I want a job! I need help to fine one.", value: '2' },
//            { text: "I'm not sure about work. I need help to learn more.", value: '3' },
//            { text: "I don't think I want to work, but I may not know enough.", value: '4' }, 
//        ]);
//        dropdown.populate("newPathEmployment", condfidentialDropdownData, newPathEmploymentVal);
//    }



//    async function saveNewAccount() {

//    }

//    // Populate the Account DDL 







//    return {
//        init,
//        buildNewEmploymentForm,

//    };
//})(); 