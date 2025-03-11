const EditFamilyInformation = (() => {
    let getFamilyInfoByID = [];
    let familyID;
    let headingName;
    let IsValueChanged = false;

    let familyName;
    let address1;
    let address2;
    let city; 
    let state;
    let zip;
    let primaryPhone;
    let secondaryPhone;
    let email;
    let notes;
    let active; 


    async function init(familyId, name) {
        familyID = familyId;
        headingName = name;

        if (familyID != undefined) {
            getFamilyInfoByID = await FSSAjax.getFamilyInfoByID(familyID);
        }

    }

    function getMarkup() {
        const familyInfoWrap = document.createElement('div');
        familyInfoWrap.classList.add('planSummary');
        const importantTables = buildFamilyForm();
        familyInfoWrap.appendChild(importantTables);
        return familyInfoWrap;
    }

    function buildFamilyForm() {

        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');

        familyName = getFamilyInfoByID.getFamilyInfoByIDResult[0].familyName;
        address1 = getFamilyInfoByID.getFamilyInfoByIDResult[0].address1;
        address2 = getFamilyInfoByID.getFamilyInfoByIDResult[0].address2;
        city = getFamilyInfoByID.getFamilyInfoByIDResult[0].city;
        state = getFamilyInfoByID.getFamilyInfoByIDResult[0].state;
        zip = getFamilyInfoByID.getFamilyInfoByIDResult[0].zip;
        primaryPhone = getFamilyInfoByID.getFamilyInfoByIDResult[0].primaryPhone;
        secondaryPhone = getFamilyInfoByID.getFamilyInfoByIDResult[0].secondaryPhone;
        email = getFamilyInfoByID.getFamilyInfoByIDResult[0].email;
        notes = getFamilyInfoByID.getFamilyInfoByIDResult[0].notes;
        active = getFamilyInfoByID.getFamilyInfoByIDResult[0].active;


        familyNameInput = input.build({
            id: 'familyNameInput',
            type: 'text',
            label: 'Name',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (familyName) ? familyName : '',
        });

        address1Input = input.build({
            id: 'address1Input',
            type: 'text',
            label: 'Address1',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (address1) ? address1 : '',
        });

        address2Input = input.build({
            id: 'address2Input',
            type: 'text',
            label: 'Address2',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (address2) ? address2 : '',
        });

        cityInput = input.build({
            id: 'cityInput',
            type: 'text',
            label: 'City',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (city) ? city : '',
        });

        stateInput = input.build({
            id: 'stateInput',
            type: 'text',
            label: 'State',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (state) ? state : '',
        });

        zipInput = input.build({
            id: 'zipInput',
            type: 'text',
            label: 'Zip',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (zip) ? zip : '',
        });

        primaryPhoneInput = input.build({
            id: 'primaryPhoneInput',
            type: 'number',
            label: 'Primary Phone',
            style: 'secondary',
            attributes: [{ key: 'maxlength', value: '12' }],
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (primaryPhone) ? primaryPhone : '',
        });

        secondaryPhoneInput = input.build({
            id: 'secondaryPhoneInput',
            type: 'number',
            label: 'Secondary Phone',
            style: 'secondary',
            attributes: [{ key: 'maxlength', value: '12' }],
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (secondaryPhone) ? secondaryPhone : '',
        });

        activeChk = input.buildCheckbox({
            text: 'Active?',
            id: 'activeChk',
            isChecked: active == 'Y' ? true : false,
            readonly: $.session.FSSUpdate == true ? false : true,
        });

        emailInput = input.build({
            id: 'emailInput',
            label: 'Email',
            type: 'text',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (email) ? email : '',
        });

        notesInput = input.build({
            id: 'notesInput',
            label: 'Notes',
            type: 'textarea',
            style: 'secondary',
            readonly: $.session.FSSUpdate == true ? false : true,
            value: (notes) ? notes : '',
        });

        // Save button
        SAVE_BTN = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
            readonly: $.session.FSSUpdate == true ? false : true,
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
            callback: async () => { EditFamilies.init() },
        });

        var LineBr = document.createElement('br');
        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Family</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        const familyBtnWrap = document.createElement('div');
        familyBtnWrap.classList.add('familyDTWrap');
        familyNameInput.classList.add('width65Per');
        familyBtnWrap.appendChild(familyNameInput);
        activeChk.classList.add('width32Per');
        familyBtnWrap.appendChild(activeChk);
        addNewCardBody.appendChild(familyBtnWrap);

        const addressNameDisplay = document.createElement("p");
        addressNameDisplay.classList.add("heading");
        addressNameDisplay.innerHTML = `<span>${'Address Information'}</span>`;
        addressNameDisplay.style.marginLeft = '10px';
        addressNameDisplay.style.marginBottom = '15px';
        addNewCardBody.appendChild(addressNameDisplay);
        addNewCardBody.appendChild(LineBr);
        addNewCardBody.appendChild(LineBr);

        var dropWrap = document.createElement('div');
        dropWrap.classList.add('familyDTWrap');
        address1Input.classList.add('width32Per');
        dropWrap.appendChild(address1Input);
        address2Input.classList.add('width32Per');
        dropWrap.appendChild(address2Input);
        cityInput.classList.add('width32Per');
        dropWrap.appendChild(cityInput);
        addNewCardBody.appendChild(dropWrap);

        var drWrap = document.createElement('div');
        drWrap.classList.add('familyDTWrap');
        stateInput.classList.add('width32Per');
        drWrap.appendChild(stateInput);
        zipInput.classList.add('width32Per');
        drWrap.appendChild(zipInput);
        addNewCardBody.appendChild(drWrap);

        const consumerNameDisplay = document.createElement("p");
        consumerNameDisplay.classList.add("heading");
        consumerNameDisplay.innerHTML = `<span>${'Contact Information'}</span>`;
        consumerNameDisplay.style.marginLeft = '10px';
        addNewCardBody.appendChild(consumerNameDisplay);
        addNewCardBody.appendChild(LineBr);
        addNewCardBody.appendChild(LineBr);

        var infoWrap = document.createElement('div');
        infoWrap.classList.add('familyDTWrap');
        primaryPhoneInput.classList.add('width32Per');
        infoWrap.appendChild(primaryPhoneInput);
        secondaryPhoneInput.classList.add('width32Per');
        infoWrap.appendChild(secondaryPhoneInput);
        emailInput.classList.add('width32Per');
        infoWrap.appendChild(emailInput);
        addNewCardBody.appendChild(infoWrap);

        addNewCardBody.appendChild(notesInput);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('familyBtnWrap');
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
        employeeInfoDiv.appendChild(column1);
        checkRequiredFieldsOfEmployeeInfo(familyName);

        return employeeInfoDiv;
    }

    function getRequiredFieldsOfEmployeeInfo() {
        var familyName = familyNameInput.querySelector('#familyNameInput');
        checkRequiredFieldsOfEmployeeInfo(familyName.value)
    }

    function checkRequiredFieldsOfEmployeeInfo(familyName) {
        if (familyName === '') {
            familyNameInput.classList.add('error');
        } else {
            familyNameInput.classList.remove('error');
        }

        setBtnStatusOfEmployeeInfo();
    }

    function setBtnStatusOfEmployeeInfo() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            SAVE_BTN.classList.add('disabled');
            return;
        } else {
            if (IsValueChanged == true) {
                SAVE_BTN.classList.remove('disabled');
            }
            else {
                SAVE_BTN.classList.add('disabled');
            }
        }
    }

    function eventListeners() {
        familyNameInput.addEventListener('input', event => {
            familyName = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        address1Input.addEventListener('input', event => {
            address1 = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        address2Input.addEventListener('input', event => {
            address2 = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        cityInput.addEventListener('input', event => {
            city = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        zipInput.addEventListener('input', event => {
            zip = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        stateInput.addEventListener('input', event => {
            state = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        primaryPhoneInput.addEventListener('input', event => {
            primaryPhone = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        secondaryPhoneInput.addEventListener('input', event => {
            secondaryPhone = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        activeChk.addEventListener('change', event => {
            active = event.target.checked == true ? 'Y' : 'N';
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        emailInput.addEventListener('input', event => {
            email = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
        notesInput.addEventListener('input', event => {
            notes = event.target.value;
            IsValueChanged = true;
            getRequiredFieldsOfEmployeeInfo();
        });
    }

    async function saveEmployeeInfo() {

        await FSSAjax.updateFamilyInfo({
            token: $.session.Token,
            familyName: familyName,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zip: zip,
            primaryPhone: primaryPhone,
            secondaryPhone: secondaryPhone,
            email: email,
            notes: notes,
            active: active,
            userId: $.session.UserId,
            familyID: familyID
        });

        EditFamilyHeader.refreshFamily(familyID, familyName, tabPositionIndex = 0);

    }

    return {
        init,
        buildFamilyForm,
        getMarkup,
    };
})(); 