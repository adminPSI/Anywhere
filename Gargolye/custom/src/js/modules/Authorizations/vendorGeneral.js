const vendorGeneral = (() => {
    let vendorID;
    let vendorEntriesById;

    async function init(vendorId) {
        vendorID = vendorId;
        vendorEntriesById = await authorizationsAjax.getVendorEntriesByIdAsync(vendorID);
    }

    function getMarkup() {
        const workScheduleWrap = document.createElement('div');
        workScheduleWrap.classList.add('planSummary');

        const importantTables = buildVendorGeneralForm();
        workScheduleWrap.appendChild(importantTables);

        return workScheduleWrap;
    }

    function buildVendorGeneralForm() {
        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');


        nameInput = input.build({
            id: 'nameInput',
            type: 'text',
            label: 'Name',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].name,
        });
        contactNameInput = input.build({
            id: 'contactNameInput',
            type: 'text',
            label: 'Contact Name',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].contactName,
        });
        contactPhoneInput = input.build({
            id: 'contactPhoneInput',
            type: 'text',
            label: 'Contact Phone',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].contactPhone,
        });
        contactEmailInput = input.build({
            id: 'contactEmailInput',
            type: 'text',
            label: 'Contact Email',
            readonly: true,
            style: 'secondary',
            value: vendorEntriesById.getVendorEntriesByIdResult[0].contactEmail,
        });
        address1Input = input.build({
            id: 'address1Input',
            type: 'text',
            label: 'Address 1',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].address1,
        });
        address2Input = input.build({
            id: 'address2Input',
            type: 'text',
            label: 'Address 2',
            readonly: true,
            style: 'secondary',
            value: vendorEntriesById.getVendorEntriesByIdResult[0].address2,
        });
        cityInput = input.build({
            id: 'cityInput',
            type: 'text',
            label: 'City',
            readonly: true,
            style: 'secondary',
            value: vendorEntriesById.getVendorEntriesByIdResult[0].city,
        });
        stateInput = input.build({
            id: 'ststeInput',
            type: 'text',
            label: 'State',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].state,
        });
        zipInput = input.build({
            id: 'zipInput',
            type: 'text',
            label: 'Zip Code',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].zipCode,
        });
        phoneInput = input.build({
            id: 'phoneInput',
            type: 'text',
            label: 'Phone',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].primaryPhone,
        });
        firstNameInput = input.build({
            id: 'Input',
            type: 'text',
            label: 'First Name',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].providerFirstName,
        });
        lastNameInput = input.build({
            id: 'lastNameInput',
            type: 'text',
            label: 'Last Name',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].providerLastName,
        });
        birthDateInput = input.build({
            id: 'birthDateInput',
            type: 'text',
            label: 'Birth Date',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].providerBirthDate,
        });
        buildingNumberInput = input.build({
            id: 'buildingNumberInput',
            type: 'text',
            label: 'Building Number',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].providerBuildingNumber,
        });
        salesforceIDInput = input.build({
            id: 'salesforceIDInput',
            type: 'text',
            label: 'Salesforce ID',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].salesforceId,
        });
        DDStateNumberInput = input.build({
            id: 'DDStateNumberInput',
            type: 'text',
            label: 'DD State Number',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].DDStateNumber,
        });
        einInput = input.build({
            id: 'einInput',
            type: 'text',
            label: 'EIN',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].ein,
        });
        submitterInput = input.build({
            id: 'submitterInput',
            type: 'text',
            label: 'Submitter',
            readonly: true,
            style: 'secondary',
            value: vendorEntriesById.getVendorEntriesByIdResult[0].submitterId,
        });
        localNumberInput = input.build({
            id: 'localNumberInput',
            type: 'text',
            label: 'Local Number',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].LocalNumber,
        });
        SSNInput = input.build({
            id: 'SSNInput',
            type: 'text',
            label: 'SSN',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].ssn,
        });
        senderInput = input.build({
            id: 'senderInput',
            type: 'text',
            label: 'Sender ',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].sender,
        });
        MHStateNumberInput = input.build({
            id: 'MHStateNumberInput',
            type: 'text',
            label: 'MH State Number',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].MHStateNumber,
        });
        TDDStateNumberInput = input.build({
            id: 'TDDStateNumberInput',
            type: 'text',
            label: 'TDD State Number',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].TDDStateNumber,
        });
        NPIInput = input.build({
            id: 'NPIInput',
            type: 'text',
            label: 'NPI',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].NPI,
        });
        MHNPIInput = input.build({
            id: 'MHNPIInput',
            type: 'text',
            label: 'MH NPI',
            style: 'secondary',
            readonly: true,
            value: vendorEntriesById.getVendorEntriesByIdResult[0].MHNPI,
        });

        inGoodStandingchkBox = input.buildCheckbox({
            text: 'In Good Standing',
            id: 'chkinGoodStanding',
            isChecked: vendorEntriesById.getVendorEntriesByIdResult[0].goodStanding == 'Y' ? true : false,
            isDisabled: true,
            style: 'secondary',
        });
        takingNewReferralschkBox = input.buildCheckbox({
            text: 'Taking New Referrals',
            id: 'chktakingNewReferrals',
            isChecked: vendorEntriesById.getVendorEntriesByIdResult[0].takingNewReferrals == 'Y' ? true : false,
            isDisabled: true,
            style: 'secondary',
        });
        FSSVendorchkBox = input.buildCheckbox({
            text: 'FSS Vendor',
            id: 'chkFSSVendor',
            isChecked: vendorEntriesById.getVendorEntriesByIdResult[0].FSSVendor == 'Y' ? true : false,
            isDisabled: true,
            style: 'secondary',
        });
        sanctionsAdministeredchkBox = input.buildCheckbox({
            text: 'Sanctions Administered',
            id: 'chkSanctionsAdministered',
            isChecked: vendorEntriesById.getVendorEntriesByIdResult[0].sanctionsAdministered == 'Y' ? true : false,
            isDisabled: true,
            style: 'secondary',
        });
        inHomeServiceschkBox = input.buildCheckbox({
            text: 'In Home Services',
            id: 'chkInHomeServices',
            isChecked: vendorEntriesById.getVendorEntriesByIdResult[0].homeServices == 'Y' ? true : false,
            isDisabled: true,
            style: 'secondary',
        });


        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">General</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        const consumerNameDisplay = document.createElement("p");
        consumerNameDisplay.classList.add("heading");
        consumerNameDisplay.innerHTML = `<span>${'Contact Information'}</span>`;
        addNewCardBody.appendChild(consumerNameDisplay);

        nameInput.classList.add('marginTop2Per');
        addNewCardBody.appendChild(nameInput);

        var dropWrap = document.createElement('div');
        dropWrap.classList.add('vendorDTWrap');
        contactNameInput.classList.add('width40Per');
        dropWrap.appendChild(contactNameInput);
        contactPhoneInput.classList.add('width32Per');
        dropWrap.appendChild(contactPhoneInput);
        contactEmailInput.classList.add('width32Per');
        dropWrap.appendChild(contactEmailInput);
        addNewCardBody.appendChild(dropWrap);

        var dropWrap1 = document.createElement('div');
        dropWrap1.classList.add('vendorDTWrap');
        address1Input.classList.add('width50Per');
        dropWrap1.appendChild(address1Input);
        address2Input.classList.add('width50Per');
        dropWrap1.appendChild(address2Input);
        addNewCardBody.appendChild(dropWrap1);

        var dropWrap2 = document.createElement('div');
        dropWrap2.classList.add('vendorDTWrap');
        cityInput.classList.add('width30Per');
        dropWrap2.appendChild(cityInput);
        stateInput.classList.add('width10Per');
        dropWrap2.appendChild(stateInput);
        zipInput.classList.add('width20Per');
        dropWrap2.appendChild(zipInput);
        phoneInput.classList.add('width32Per');
        dropWrap2.appendChild(phoneInput);
        addNewCardBody.appendChild(dropWrap2);

        const consumerNameDisplay1 = document.createElement("p");
        consumerNameDisplay1.classList.add("heading");
        consumerNameDisplay1.innerHTML = `<span>${'Ohio ISP Information'}</span>`;
        addNewCardBody.appendChild(consumerNameDisplay1);

        var dropWrap3 = document.createElement('div');
        dropWrap3.classList.add('marginTop2Per');
        dropWrap3.classList.add('vendorDTWrap');
        firstNameInput.classList.add('width25Per');
        dropWrap3.appendChild(firstNameInput);
        lastNameInput.classList.add('width23Per');
        dropWrap3.appendChild(lastNameInput);
        birthDateInput.classList.add('width23Per');
        dropWrap3.appendChild(birthDateInput);
        buildingNumberInput.classList.add('width23Per');
        dropWrap3.appendChild(buildingNumberInput);
        addNewCardBody.appendChild(dropWrap3);

        var dropWrap4 = document.createElement('div');
        dropWrap4.classList.add('vendorDTWrap');
        salesforceIDInput.classList.add('width40Per');
        dropWrap4.appendChild(salesforceIDInput);
        addNewCardBody.appendChild(dropWrap4);

        const consumerNameDisplay2 = document.createElement("p");
        consumerNameDisplay2.classList.add("heading");
        consumerNameDisplay2.innerHTML = `<span>${'Billing/Authorization'}</span>`;
        addNewCardBody.appendChild(consumerNameDisplay2);

        var dropWrap5 = document.createElement('div');
        dropWrap5.classList.add('marginTop2Per');
        dropWrap5.classList.add('vendorDTWrap');
        DDStateNumberInput.classList.add('width19Per');
        dropWrap5.appendChild(DDStateNumberInput);
        einInput.classList.add('width18Per');
        dropWrap5.appendChild(einInput);
        submitterInput.classList.add('width18Per');
        dropWrap5.appendChild(submitterInput);
        localNumberInput.classList.add('width18Per');
        dropWrap5.appendChild(localNumberInput);
        SSNInput.classList.add('width18Per');
        dropWrap5.appendChild(SSNInput);
        addNewCardBody.appendChild(dropWrap5);

        var dropWrap6 = document.createElement('div');
        dropWrap6.classList.add('vendorDTWrap');
        senderInput.classList.add('width19Per');
        dropWrap6.appendChild(senderInput);
        MHStateNumberInput.classList.add('width18Per');
        dropWrap6.appendChild(MHStateNumberInput);
        TDDStateNumberInput.classList.add('width18Per');
        dropWrap6.appendChild(TDDStateNumberInput);
        NPIInput.classList.add('width18Per');
        dropWrap6.appendChild(NPIInput);
        MHNPIInput.classList.add('width18Per');
        dropWrap6.appendChild(MHNPIInput);
        addNewCardBody.appendChild(dropWrap6);

        const consumerNameDisplay3 = document.createElement("p");
        consumerNameDisplay3.classList.add("heading");
        consumerNameDisplay3.innerHTML = `<span>${'Miscellaneous'}</span>`;
        addNewCardBody.appendChild(consumerNameDisplay3);

        var chkDiv = document.createElement('div');
        chkDiv.classList.add('marginTop2Per');
        chkDiv.appendChild(inGoodStandingchkBox);
        addNewCardBody.appendChild(chkDiv);

        var chkDiv1 = document.createElement('div');
        chkDiv1.appendChild(takingNewReferralschkBox);
        addNewCardBody.appendChild(chkDiv1);

        var chkDiv2 = document.createElement('div');
        chkDiv2.appendChild(FSSVendorchkBox);
        addNewCardBody.appendChild(chkDiv2);

        var chkDiv3 = document.createElement('div');
        chkDiv3.appendChild(sanctionsAdministeredchkBox);
        addNewCardBody.appendChild(chkDiv3);

        var chkDiv4 = document.createElement('div');
        chkDiv4.appendChild(inHomeServiceschkBox);
        addNewCardBody.appendChild(chkDiv4);

        employeeInfoDiv.appendChild(column1);
        return employeeInfoDiv;
    }

    return {
        init,
        buildVendorGeneralForm,
        getMarkup,
    };
})(); 