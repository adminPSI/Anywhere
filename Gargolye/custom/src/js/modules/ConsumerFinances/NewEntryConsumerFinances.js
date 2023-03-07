const NewEntryCF = (() => {
    // dropdown and inputs declaration
    let newDateInput;
    let newAmountInput;
    let newAccountDropdown;
    let newPayeeDropdown;
    let ADD_NEW_PAYEE_BTN;
    let newCategoryDropdown;
    let newSubCategoryDropdown;
    let newCheckNoInput;
    let newDescriptionInput;
    let newAttachmentInput;
    let newReceiptInput;
    let NEW_SAVE_BTN;
    let NEW_CANCEL_BTN;

    let CategoryID;
    let Description;
    let BtnName;
    let regId;

    let inputElement;

    async function init() {
        buildNewEntryForm();
    }

    async function buildNewEntryForm(registerId) {
        if (registerId != undefined) {
            BtnName = 'UPDATE'
            regId = registerId;
            const result = await ConsumerFinancesAjax.getAccountEntriesByIDAsync(registerId);
            const { getAccountEntriesByIdResult } = result;
            date = UTIL.getTodaysDate();//UTIL.formatDateFromIso(getAccountEntriesByIdResult[0].activityDate);
            amount = getAccountEntriesByIdResult[0].amount;
            account = getAccountEntriesByIdResult[0].account;
            payee = getAccountEntriesByIdResult[0].payee;
            category = getAccountEntriesByIdResult[0].category;
            subCategory = getAccountEntriesByIdResult.subCategory;
            checkNo = getAccountEntriesByIdResult[0].checkno;
            description = getAccountEntriesByIdResult[0].description;
            attachment = '';
            receipt = getAccountEntriesByIdResult[0].receipt;
            accountID = getAccountEntriesByIdResult[0].accountID;
        }
        else {
            BtnName = 'SAVE'
            date = UTIL.getTodaysDate();
            amount = '';
            account = '';
            payee = '';
            category = '';
            subCategory = '';
            checkNo = '';
            description = '';
            attachment = '';
            receipt = '';
            accountID = '';
        }
        DOM.clearActionCenter();

        const column1 = document.createElement('div')
        const column2 = document.createElement('div')
        column1.classList.add('col-1')
        column2.classList.add('col-2')



        newDateInput = input.build({
            id: 'newDateInput',
            type: 'date',
            label: 'Date',
            style: 'secondary',
            value: (date) ? date : '',
        });

        newAmountInput = input.build({
            id: 'newAmountInput',
            type: 'number',
            label: 'Amount',
            style: 'secondary',
            value: (amount) ? amount : '',
        });

        newAccountDropdown = dropdown.build({
            id: 'newAccountDropdown',
            label: "Account",
            dropdownId: "newAccountDropdown",
            value: (account) ? account : '',
        });

        newPayeeDropdown = dropdown.build({
            id: 'newPayeeDropdown',
            label: "Payee",
            dropdownId: "newPayeeDropdown",
            value: (payee) ? payee : '',
        });

        ADD_NEW_PAYEE_BTN = button.build({
            text: 'ADD NEW PAYEE',
            style: 'secondary',
            type: 'contained',
            callback: () => buildNewPayeePopUp()
        });

        newCategoryDropdown = dropdown.build({
            id: 'newCategoryDropdown',
            label: "Category",
            dropdownId: "newCategoryDropdown",
            value: (category) ? category : '',
        });

        newSubCategoryDropdown = dropdown.build({
            id: 'newSubCategoryDropdown',
            label: "Sub Category",
            dropdownId: "newSubCategoryDropdown",
            value: (subCategory) ? subCategory : '',
        });

        newCheckNoInput = input.build({
            type: 'text',
            label: 'Check No.',
            style: 'secondary',
            value: (checkNo) ? checkNo : '',
        });

        newDescriptionInput = input.build({
            type: 'textarea',
            label: 'Description',
            style: 'secondary',
            value: (description) ? description : '',
        });

        newAttachmentInput = input.build({
            id: 'selectfile',
            label: 'Choose File',
            type: 'file',
            accept: '*',
            style: 'secondary',
            attributes: [{ key: 'multiple', value: 'false' }],
            value: (attachment) ? attachment : '',
        });

        newReceiptInput = input.build({
            type: 'text',
            label: 'Receipt',
            style: 'secondary',
            value: (receipt) ? receipt : '',
        });

        NEW_SAVE_BTN = button.build({
            text: BtnName,
            style: 'secondary',
            type: 'contained',
            callback: () => saveNewAccount()
        });
        NEW_CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { ConsumerFinances.loadConsumerFinanceLanding() },
        });

        NEW_DELETE_BTN = button.build({
            text: 'Delete',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { ConsumerFinances.loadConsumerFinanceLanding() },
        });

        // Billing Radios //
        expenseRadio = input.buildRadio({
            id: `expenseRadio`,
            text: "Expense",
            name: "amountType",
            isChecked: true,
        });
        depositRadio = input.buildRadio({
            id: `depositRadio`,
            text: "Deposit",
            name: "amountType",
            isChecked: false,
        });

        const radioDiv = document.createElement("div");
        radioDiv.classList.add("addRouteRadioDiv");
        radioDiv.appendChild(expenseRadio);
        radioDiv.appendChild(depositRadio);
        /////////////////

        var space = document.createElement('h3');
        space.innerHTML = '';
        var LineBr = document.createElement('br');

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(NEW_SAVE_BTN);

        if (registerId != undefined) {
            btnWrap.appendChild(NEW_DELETE_BTN);
        }
        btnWrap.appendChild(NEW_CANCEL_BTN);

        var dropWrap = document.createElement('div');
        dropWrap.classList.add('vehicleInspectionDTWrap');
        dropWrap.appendChild(newDateInput);
        dropWrap.appendChild(newAmountInput);

        var radioWrap = document.createElement('div');
        radioWrap.classList.add('vehicleInspectionDTWrap');
        radioWrap.appendChild(space);
        radioWrap.appendChild(radioDiv);

        // New Entry  Card//
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">New Entry</div>`;
        addNewCard.appendChild(addNewCardBody)

        column1.appendChild(addNewCard)
        addNewCardBody.appendChild(LineBr);
        addNewCardBody.appendChild(dropWrap);
        addNewCardBody.appendChild(radioWrap);
        addNewCardBody.appendChild(LineBr);
        addNewCardBody.appendChild(newAccountDropdown);
        addNewCardBody.appendChild(newPayeeDropdown);
        addNewCardBody.appendChild(ADD_NEW_PAYEE_BTN);
        addNewCardBody.appendChild(newCategoryDropdown);
        addNewCardBody.appendChild(newSubCategoryDropdown);
        addNewCardBody.appendChild(newCheckNoInput);

        const addRightCard = document.createElement("div");
        const addRightHeader = document.createElement("div");
        const addRightBody = document.createElement("div");
        addRightCard.classList.add("card");
        addRightHeader.classList.add("card__header");
        addRightBody.classList.add("card__body");
        addRightBody.id = 'consumerOnRouteSection';
        addRightCard.appendChild(addRightBody);

        addRightBody.appendChild(newDescriptionInput);
        addRightBody.appendChild(newAttachmentInput);
        addRightBody.appendChild(newReceiptInput);
        addRightBody.appendChild(btnWrap);

        column2.appendChild(addRightCard);

        DOM.ACTIONCENTER.appendChild(column1);
        DOM.ACTIONCENTER.appendChild(column2);
        eventListeners();

        populateAccountDropdown();
        populatePayeeDropdown();
        populateCategoryDropdown(CategoryID);
        populateSubCategoryDropdown(CategoryID);
        checkRequiredFieldsOfNewEntry();
    }

    function checkRequiredFieldsOfNewEntry() {
        var date = newDateInput.querySelector('#newDateInput');
        var amount = newAmountInput.querySelector('#newAmountInput');
        var account = newAccountDropdown.querySelector('#newAccountDropdown');
        var payee = newPayeeDropdown.querySelector('#newPayeeDropdown');
        var category = newCategoryDropdown.querySelector('#newCategoryDropdown');
        var subCategory = newSubCategoryDropdown.querySelector('#newSubCategoryDropdown');

        if (date.value === '') {
            newDateInput.classList.add('error');
        } else {
            newDateInput.classList.remove('error');
        }

        if (amount.value === '') {
            newAmountInput.classList.add('error');
        } else {
            newAmountInput.classList.remove('error');
        }

        if (account.value === '') {
            newAccountDropdown.classList.add('error');
        } else {
            newAccountDropdown.classList.remove('error');
        }

        if (payee.value === '') {
            newPayeeDropdown.classList.add('error');
        } else {
            newPayeeDropdown.classList.remove('error');
        }

        if (category.value === '') {
            newCategoryDropdown.classList.add('error');
        } else {
            newCategoryDropdown.classList.remove('error');
        }
        //if (subCategory.value === '') {
        //    newSubCategoryDropdown.classList.add('error');
        //} else {
        //    newSubCategoryDropdown.classList.remove('error');
        //}

        setBtnStatusOfNewEntry();
    }

    function setBtnStatusOfNewEntry() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            NEW_SAVE_BTN.classList.add('disabled');
            return;
        } else {
            NEW_SAVE_BTN.classList.remove('disabled');
        }

    }

    function eventListeners() {
        newDateInput.addEventListener('input', event => {
            date = event.target.value;
            checkRequiredFieldsOfNewEntry();

        });
        newAmountInput.addEventListener('input', event => {
            amount = event.target.value;
            checkRequiredFieldsOfNewEntry();

        });
        newPayeeDropdown.addEventListener('change', event => {
            CategoryID = event.target.value;
            payee = event.target.options[event.target.selectedIndex].text;
            populateCategoryDropdown(CategoryID);
            populateSubCategoryDropdown(CategoryID);
            checkRequiredFieldsOfNewEntry();
        });
        newAccountDropdown.addEventListener('change', event => {
            accountID = event.target.value;
            account = event.target.options[event.target.selectedIndex].text;
            checkRequiredFieldsOfNewEntry();
        });
        newCategoryDropdown.addEventListener('change', event => {
            CategoryID = event.target.value;
            category = event.target.options[event.target.selectedIndex].text;
            checkRequiredFieldsOfNewEntry();
        });
        newSubCategoryDropdown.addEventListener('change', event => {
            CategoryID = event.target.value;
            subCategory = event.target.options[event.target.selectedIndex].text;
            checkRequiredFieldsOfNewEntry();
        });
        newCheckNoInput.addEventListener('input', event => {
            checkNo = event.target.value;
        });
        newDescriptionInput.addEventListener('input', event => {
            Description = event.target.value;
        });
        newReceiptInput.addEventListener('input', event => {
            receipt = event.target.value;
        });


        newAttachmentInput.addEventListener('change', event => {
            inputElement = event.target;
            if (!isAttachmentValid(inputElement)) {
                event.target.value = ""; // clear file input value after adding it
                return;
            };

        });
    }

    function isAttachmentValid(target) {
        const fileType = target.files[0].type;
        const reFileTypeTest = new RegExp('(audio\/)|(video\/)')
        if (reFileTypeTest.test(fileType)) {
            alert('Anywhere currently does not accept audio or video files')
            target.value = '';
        }
        return target.value !== '';
    }

    async function saveNewAccount() {
        debugger; 
        const amountType = document.getElementById("expenseRadio").checked ? "E" : "D";
        const attachmentObj = {};

        if (inputElement == undefined) {

            const result = await ConsumerFinancesAjax.insertAccountAsync(date, amount, amountType, accountID, payee, CategoryID, subCategory, checkNo, description, null, null, receipt, BtnName, regId);
            const { insertAccountResult } = result;
            if (insertAccountResult.accountID != null) {
                ConsumerFinances.loadConsumerFinanceLanding();
            }
        }
        else {
            const attPromise = new Promise(resolve => {
                const attachmentFile = inputElement.files.item(0);
                const attachmentName = attachmentFile.name;
                const attachmentType = attachmentFile.name.split(".").pop();
                attachmentObj.description = attachmentName;
                attachmentObj.type = attachmentType;
                // new Response(file) was added for Safari compatibility 
                new Response(attachmentFile).arrayBuffer().then(res => {
                    attachmentObj.arrayBuffer = res;
                    resolve();
                });
            })

            attPromise.then(async () => {
                try {
                    const result = await ConsumerFinancesAjax.insertAccountAsync(date, amount, amountType, accountID, payee, CategoryID, subCategory, checkNo, description, attachmentObj.type, attachmentObj.arrayBuffer, receipt, BtnName, regId);
                    const { insertAccountResult } = result;

                    if (insertAccountResult.accountID != null) {
                        ConsumerFinances.loadConsumerFinanceLanding();
                    }
                } catch (error) {
                    throw (error);
                }
            });

        }
    }

    // Populate the Account DDL 
    async function populateAccountDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync();
        let data = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountName,
            text: account.accountName
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newAccountDropdown", data,account );
    }

    async function populatePayeeDropdown() {
        const {
            getPayeesResult: Payees,
        } = await ConsumerFinancesAjax.getPayeesAsync();
        let data = Payees.map((payees) => ({
            id: payees.CategoryID,
            value: payees.Description,
            text: payees.Description
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newPayeeDropdown", data, payee);
    }

    async function populateCategoryDropdown(CategoryID) {
        const {
            getCatogoriesResult: Category,
        } = await ConsumerFinancesAjax.getCategoriesAsync(CategoryID);
        let data = Category.map((category) => ({
            id: category.CategoryID,
            value: category.CategoryDescription,
            text: category.CategoryDescription
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newCategoryDropdown", data, category); 
    }

    async function populateSubCategoryDropdown(CategoryID) {
        const {
            getSubCatogoriesResult: SubCategory,
        } = await ConsumerFinancesAjax.getSubCategoriesAsync(CategoryID);
        let data = SubCategory.map((subCategory) => ({
            id: subCategory.CategoryID,
            value: subCategory.SubCategoryDescription,
            text: subCategory.SubCategoryDescription
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newSubCategoryDropdown", data, subCategory);
        checkRequiredFieldsOfNewEntry();  
    }


    // build payee pop-up used for adding payee information
    async function buildNewPayeePopUp() {

        payeeId = '';
        payeeName = '';
        payeeaddress1 = '';
        payeeaddress2 = '';
        payeecity = '';
        payeestate = 'OH';
        payeezipcode = '';


        let addPayeePopup = POPUP.build({
            header: "Add payee",
            hideX: true,
            id: "addPayeePopup"
        });

        payeeInput = input.build({
            id: 'payeeInput',
            label: 'Name',
            value: (payeeName) ? payeeName : '',
        });

        address1Input = input.build({
            id: 'address1Input',
            label: 'Address 1',
            value: (payeeaddress1) ? payeeaddress1 : '',

        });

        address2Input = input.build({
            label: 'Address 2',
            value: (payeeaddress2) ? payeeaddress2 : '',
        });

        cityInput = input.build({
            id: 'cityInput',
            label: 'City',
            value: (payeecity) ? payeecity : '',
        });

        stateInput = input.build({
            id: 'stateInput',
            label: 'State',
            attributes: [{ key: 'maxlength', value: '2' }],
            value: (payeestate) ? payeestate : '',

        });

        zipcodeInput = input.build({
            id: 'zipcodeInput',
            label: 'Zip Code',
            type: 'text',
            style: 'secondary',
            classNames: ['zip'],
            attributes: [{ key: 'maxlength', value: '9' }],
            value: (payeezipcode) ? payeezipcode : '',
        });

        saveBtn = button.build({
            id: "addpayeeSaveBtn",
            text: "save",
            type: "contained",
            style: "secondary",
            classNames: 'disabled',
            callback: () => addPayeePopupDoneBtn()
        });

        cancelBtn = button.build({
            id: "addpayeeCancelBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: () => POPUP.hide(addPayeePopup)
        });

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(cancelBtn);

        addPayeePopup.appendChild(payeeInput);
        addPayeePopup.appendChild(address1Input);
        addPayeePopup.appendChild(address2Input);
        addPayeePopup.appendChild(cityInput);
        addPayeePopup.appendChild(stateInput);
        addPayeePopup.appendChild(zipcodeInput);
        addPayeePopup.appendChild(btnWrap);

        popUpEventHandlers();

        POPUP.show(addPayeePopup);

        checkRequiredFields();

    }

    function popUpEventHandlers() {

        payeeInput.addEventListener('input', event => {
            payeeName = event.target.value;
            checkRequiredFields();

        });

        address1Input.addEventListener('input', event => {
            payeeaddress1 = event.target.value;
            checkRequiredFields();
        });

        address2Input.addEventListener('input', event => {
            payeeaddress2 = event.target.value;
            checkRequiredFields();
        });

        cityInput.addEventListener('input', event => {
            payeecity = event.target.value;
            checkRequiredFields();
        });

        stateInput.addEventListener('input', event => {
            payeestate = event.target.value;
            checkRequiredFields();
        });

        zipcodeInput.addEventListener('input', event => {
            payeezipcode = event.target.value;
            checkRequiredFields();
        });

    }

    function checkRequiredFields() {

        var payee = payeeInput.querySelector('#payeeInput');
        var address1 = address1Input.querySelector('#address1Input');
        var city = cityInput.querySelector('#cityInput');
        var state = stateInput.querySelector('#stateInput');
        var zipcode = zipcodeInput.querySelector('#zipcodeInput');

        if (payee.value === '') {
            payeeInput.classList.add('error');
        } else {
            payeeInput.classList.remove('error');
        }

        if (address1.value === '') {
            address1Input.classList.add('error');
        } else {
            address1Input.classList.remove('error');
        }

        if (city.value === '') {
            cityInput.classList.add('error');
        } else {
            cityInput.classList.remove('error');
        }

        if (state.value === '') {
            stateInput.classList.add('error');
        } else {
            stateInput.classList.remove('error');
        }

        if (zipcode.value === '') {
            zipcodeInput.classList.add('error');
        } else {
            zipcodeInput.classList.remove('error');
        }

        setBtnStatus();
    }

    function setBtnStatus() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            saveBtn.classList.add('disabled');
            return;
        } else {
            saveBtn.classList.remove('disabled');
        }

    }

    async function addPayeePopupDoneBtn() {
        const result = await ConsumerFinancesAjax.insertPayeeAsync(payeeName, payeeaddress1, payeeaddress2, payeecity, payeestate, payeezipcode);
        const { insertPayeeResult } = result;
        let regionID = insertPayeeResult.RegionID;
        POPUP.hide(addPayeePopup);
        populatePayeeDropdown();
    }

    return {
        init,
        buildNewEntryForm,
    };
})(); 