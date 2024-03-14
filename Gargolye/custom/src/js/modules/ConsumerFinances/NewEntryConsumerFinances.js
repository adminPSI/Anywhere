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
    let newReceiptInput;
    let NEW_SAVE_BTN;
    let NEW_CANCEL_BTN;

    let attachmentArray = [];
    let prevAttachmentArray = [];
    let attachmentId = [];
    let attachmentDesc = [];
    let categoryID;
    let Description;
    let BtnName;
    let regId;
    let IsDisabledBtn = false;
    let lastUpdateBy;
    let IsReconciled = 'N';
    let IsAddNewPayDisable = true;
    let IsSaveDisable = true;
    let IsDeleteDisable = true;
    let splitAmountInputN = [];
    let splitCategoryDropdownN = [];
    let splitDescriptionInputN = [];
    let categoryOldVal;
    let totalAmount;
    let regTotalAmount;
    let numberOfRows;
    let splitAmount = [];
    let splitTransPopup;
    let tempAmountval;
    let tempSplit;
    let tempAmouts;
    let totalAmountSaved;
    let accountPermission;
    let tempAccountPer;

    async function init() {
        buildNewEntryForm(registerId = undefined, attachment = undefined, attachmentID = undefined);
    }

    async function buildNewEntryForm(registerId, attachment, attachmentID) {
        prevAttachmentArray = [];
        numberOfRows = 5;
        if (registerId) {
            splitAmount = [];
            totalAmountSaved = 0;
            prevAttachmentArray = await consumerFinanceAttachment.getConsumerFinanceAttachments(registerId);
            BtnName = 'UPDATE'
            regId = registerId;
            const result = await ConsumerFinancesAjax.getAccountEntriesByIDAsync(registerId);
            const { getAccountEntriesByIdResult } = result;
            date = moment(getAccountEntriesByIdResult[0].activityDate).format('YYYY-MM-DD');
            amount = getAccountEntriesByIdResult[0].amount != '' ? parseFloat(getAccountEntriesByIdResult[0].amount).toFixed(2) : '';
            tempAmountval = getAccountEntriesByIdResult[0].amount;
            account = getAccountEntriesByIdResult[0].account;
            payee = getAccountEntriesByIdResult[0].payee;
            category = getAccountEntriesByIdResult[0].category;
            subCategory = getAccountEntriesByIdResult[0].subCategory;
            checkNo = getAccountEntriesByIdResult[0].checkno;
            description = getAccountEntriesByIdResult[0].description;
            receipt = getAccountEntriesByIdResult[0].receipt;
            accountID = getAccountEntriesByIdResult[0].accountID;
            accountType = getAccountEntriesByIdResult[0].accountType;
            IsReconciled = getAccountEntriesByIdResult[0].reconciled;
            lastUpdateBy = getAccountEntriesByIdResult[0].lastUpdateBy;
            categoryOldVal = category;
            const SplitDataresult = await ConsumerFinancesAjax.getSplitRegisterAccountEntriesByIDAsync(registerId);
            const { getSplitRegisterAccountEntriesByIDResult } = SplitDataresult;
            splitAmount = getSplitRegisterAccountEntriesByIDResult;
            var sum = 0;
            for (var i = 0; i < splitAmount.length; i++) {
                if (splitAmount[i].amount != '')
                    sum += parseFloat(splitAmount[i].amount);
            }
            totalAmount = sum.toFixed(2);
            totalAmountSaved = totalAmount;  
        }
        else if (registerId == 0 && attachmentID) {
            regId = 0;
            BtnName = 'SAVE';
        }
        else {
            regId = 0;
            BtnName = 'SAVE';
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
            accountType = 'E';
            IsReconciled = 'N';
            IsDisabledBtn = false;
            categoryOldVal = '';
            totalAmount = 0;
            tempAmountval = 0;
            splitAmount = [];
            totalAmountSaved = 0;
        }

        tempdate = '';
        tempamount = '';
        tempaccount = '';
        tempaccountType = '';
        temppayee = '';
        tempcategory = '';
        tempsubCategory = '';
        tempcheckNo = '';
        tempdescription = '';
        tempattachment = '';
        tempreceipt = '';
        tempSplit = '';
        if (attachment) {
            attachmentArray = attachment;
            attachmentId = attachmentID;
            attachment.forEach(att => {
                if (att.registerID == 0) {
                    attachmentDesc.push(att.description);
                    tempattachment = attachmentID;
                }
            });

        }
        else {
            attachmentArray = [];
            attachmentId = [];
            attachmentDesc = [];
            prevAttachmentArray.forEach(att => {
                attachmentArray.push(att);
            });
        }
        getaccountPermission();
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
        });

        newCategoryDropdown = dropdown.build({
            id: 'newCategoryDropdown',
            label: "Category",
            dropdownId: "newCategoryDropdown",
            value: (category) ? category : '',
        });

        SPLIT_BTN = button.build({
            id: 'SPLIT_BTN',
            text: 'Split',
            style: 'secondary',
            type: 'contained',
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
            classNames: 'autosize',
            value: (description) ? description : '',
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
        });
        NEW_CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => { ConsumerFinances.loadConsumerFinanceLanding() },
        });

        NEW_DELETE_BTN = button.build({
            text: 'DELETE ENTRY',
            style: 'secondary',
            type: 'outlined',
        });

        // Billing Radios //
        expenseRadio = input.buildRadio({
            id: `expenseRadio`,
            text: "Expense",
            name: "amountType",
            isChecked: accountType == 'D' ? false : true,
        });
        depositRadio = input.buildRadio({
            id: `depositRadio`,
            text: "Deposit",
            name: "amountType",
            isChecked: accountType == 'D' ? true : false,
        });

        const radioDiv = document.createElement("div");
        radioDiv.classList.add("addCFRadioDiv");
        radioDiv.appendChild(expenseRadio);
        radioDiv.appendChild(depositRadio);
        /////////////////

        var space = document.createElement('h3');
        space.innerHTML = '';
        var LineBr = document.createElement('br');

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');


        if (registerId) {
            btnWrap.appendChild(NEW_SAVE_BTN);
            btnWrap.appendChild(NEW_DELETE_BTN);

            if (payee == 'Opening Balance') {
                DisabledAllInputs();
            }
            else {
                enableDisabledInputs();
            }
        }
        else {
            btnWrap.appendChild(NEW_SAVE_BTN);
            btnWrap.appendChild(NEW_CANCEL_BTN);
            if ($.session.CFADDPayee) {
                ADD_NEW_PAYEE_BTN.classList.remove('disabled');
            }
            else {
                ADD_NEW_PAYEE_BTN.classList.add('disabled');
            }
        }

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
        addNewCardBody.appendChild(SPLIT_BTN);
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
        const questionAttachment = new consumerFinanceAttachment.ConsumerFinanceAttachment(attachmentArray, regId, IsDisabledBtn, attachmentId);
        addRightBody.appendChild(questionAttachment.attachmentButton);

        addRightBody.appendChild(newReceiptInput);
        if (registerId) {
            addRightBody.appendChild(btnWrap);
            NEW_CANCEL_BTN.style.width = '100%';
            addRightBody.appendChild(NEW_CANCEL_BTN);
        }
        else {
            addRightBody.appendChild(btnWrap);
        }

        column2.appendChild(addRightCard);

        DOM.ACTIONCENTER.appendChild(column1);
        DOM.ACTIONCENTER.appendChild(column2);
        eventListeners();

        populateAccountDropdown();
        populatePayeeDropdown();
        populateCategoryDropdown(categoryID);
        populateSubCategoryDropdown(category);
        checkRequiredFieldsOfNewEntry();

        if (category == '--Split--') {
            document.getElementById('SPLIT_BTN').style.display = 'block';
        }
        else {
            document.getElementById('SPLIT_BTN').style.display = 'none';
        }
    }

    async function getSplitdata() {
        const SplitDataresult = await ConsumerFinancesAjax.getSplitRegisterAccountEntriesByIDAsync(regId);
        const { getSplitRegisterAccountEntriesByIDResult } = SplitDataresult;
        splitAmount = getSplitRegisterAccountEntriesByIDResult;

        buildSplitTransectionPopUp();
        if (splitAmount.length > 0) {
            document.getElementById('SPLIT_BTN').style.display = 'block';
        }
    }

    function enableDisabledInputs() {
        if (IsReconciled == 'Y') {
            DisabledAllInputs();
        } else if (IsReconciled == 'N') {
            if (!$.session.CFUpdate) {
                DisabledAllInputs();
            }
            else if (!$.session.CFEditAccountEntries && lastUpdateBy != $.session.UserId) {
                DisabledAllInputs();
            }
            else if (($.session.CFDelete || $.session.CFUpdate || $.session.CFView) && lastUpdateBy == $.session.UserId) {
                EnabledAllInputs();
                if (!$.session.CFDelete) {
                    NEW_DELETE_BTN.classList.add('disabled');
                }
                if (!$.session.CFADDPayee) {
                    ADD_NEW_PAYEE_BTN.classList.add('disabled');
                }
                if (!$.session.CFUpdate) {
                    NEW_SAVE_BTN.classList.add('disabled');
                }
            }
            else if ($.session.CFDelete || $.session.CFUpdate || $.session.CFView || $.session.CFEditAccountEntries) {
                EnabledAllInputs();
                if (!$.session.CFDelete) {
                    NEW_DELETE_BTN.classList.add('disabled');
                }
                if (!$.session.CFADDPayee) {
                    ADD_NEW_PAYEE_BTN.classList.add('disabled');
                }
                if (!$.session.CFUpdate) {
                    NEW_SAVE_BTN.classList.add('disabled');
                }
            }
            else {
                DisabledAllInputs();
            }
        }
        else {
            DisabledAllInputs();
        }
    }

    function DisabledAllInputs() {
        NEW_SAVE_BTN.classList.add('disabled');
        newDateInput.classList.add('disabled');
        newAmountInput.classList.add('disabled');
        newAccountDropdown.classList.add('disabled');
        newPayeeDropdown.classList.add('disabled');
        ADD_NEW_PAYEE_BTN.classList.add('disabled');
        newCategoryDropdown.classList.add('disabled');
        newSubCategoryDropdown.classList.add('disabled');
        newCheckNoInput.classList.add('disabled');
        newDescriptionInput.classList.add('disabled');
        newReceiptInput.classList.add('disabled');
        NEW_DELETE_BTN.classList.add('disabled');
        expenseRadio.classList.add('disabled');
        depositRadio.classList.add('disabled');
        IsDisabledBtn = true;
    }

    function EnabledAllInputs() {
        NEW_SAVE_BTN.classList.remove('disabled');
        newDateInput.classList.remove('disabled');
        newAmountInput.classList.remove('disabled');
        newAccountDropdown.classList.remove('disabled');
        newPayeeDropdown.classList.remove('disabled');
        newCategoryDropdown.classList.remove('disabled');
        newSubCategoryDropdown.classList.remove('disabled');
        newCheckNoInput.classList.remove('disabled');
        newDescriptionInput.classList.remove('disabled');
        newReceiptInput.classList.remove('disabled');
        NEW_DELETE_BTN.classList.remove('disabled');
        expenseRadio.classList.remove('disabled');
        depositRadio.classList.remove('disabled');
        IsDisabledBtn = false;
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

        if (payee.value === '' || payee.value === 'Opening Balance') {
            newPayeeDropdown.classList.add('error');
        } else {
            newPayeeDropdown.classList.remove('error');
        }

        if (category.value === '') {
            newCategoryDropdown.classList.add('error');
        } else {
            newCategoryDropdown.classList.remove('error');
        }

        if (IsReconciled == 'N') {
            setBtnStatusOfNewEntry();
        }
    }

    function setBtnStatusOfNewEntry() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            NEW_SAVE_BTN.classList.add('disabled');
            return;
        } else {
            if (tempdate != '' || tempamount != '' || tempaccount != '' || tempaccountType != '' || temppayee != '' || tempcategory != '' || tempsubCategory != '' || tempcheckNo != '' || tempdescription != '' || tempattachment != '' || tempreceipt != '' || tempSplit != '') {
                NEW_SAVE_BTN.classList.remove('disabled');
            }
            else {
                NEW_SAVE_BTN.classList.add('disabled');
            }
        }
    }

    function eventListeners() {
        ADD_NEW_PAYEE_BTN.addEventListener('keypress', event => {
            if (event.keyCode === 13 && ADD_NEW_PAYEE_BTN.classList.contains('disabled')) {
                IsAddNewPayDisable = false;
            }
        });
        ADD_NEW_PAYEE_BTN.addEventListener('click', event => {
            if (IsAddNewPayDisable) {
                buildNewPayeePopUp();
            }
            IsAddNewPayDisable = true;
        });
        SPLIT_BTN.addEventListener('click', event => {
            buildSplitTransectionPopUp();
        });
        NEW_SAVE_BTN.addEventListener('keypress', event => {
            if (event.keyCode === 13 && NEW_SAVE_BTN.classList.contains('disabled')) {
                NEW_SAVE_BTN.classList.add('disabled');
                IsSaveDisable = false;
            }
        });
        NEW_SAVE_BTN.addEventListener('click', event => {
            if (IsSaveDisable) {
                NEW_SAVE_BTN.classList.add('disabled');
                saveNewAccount();
            }
            IsSaveDisable = true;
        });
        NEW_DELETE_BTN.addEventListener('keypress', event => {
            if (event.keyCode === 13 && NEW_DELETE_BTN.classList.contains('disabled')) {
                IsDeleteDisable = false;
            }
        });
        NEW_DELETE_BTN.addEventListener('click', event => {
            if (IsDeleteDisable) {
                deleteAccountPOPUP();
            }
            IsDeleteDisable = true;
        });

        newDateInput.addEventListener('input', event => {
            if (!newDateInput.classList.contains('disabled')) {
                date = event.target.value;
                tempdate = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        newAmountInput.addEventListener('input', event => {
            if (!newAmountInput.classList.contains('disabled')) {
                amount = event.target.value;
                if (amount.includes('.') && (amount.match(/\./g).length > 1 || amount.toString().split('.')[1].length > 2)) {
                    document.getElementById('newAmountInput').value = amount.substring(0, amount.length - 1);
                    return;
                }
                tempamount = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });

        newAmountInput.addEventListener('focusout', event => {  
            if (totalAmountSaved > 0 && totalAmountSaved != event.target.value) {
                errorPopup(2);
            }
            if (document.getElementById('newAmountInput').value != '')
                document.getElementById('newAmountInput').value = parseFloat(document.getElementById('newAmountInput').value).toFixed(2);
        });

        newPayeeDropdown.addEventListener('change', event => {
            if (!newPayeeDropdown.classList.contains('disabled')) {
                categoryID = event.target.options[event.target.selectedIndex].id;
                if (categoryID != '') {
                    getCategorySubCategorybyPayee(categoryID);
                }
                payee = event.target.options[event.target.selectedIndex].text;
                temppayee = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        newAccountDropdown.addEventListener('change', event => {
            if (!newAccountDropdown.classList.contains('disabled')) {
                accountID = event.target.options[event.target.selectedIndex].id;
                account = event.target.options[event.target.selectedIndex].text;
                tempaccount = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        newCategoryDropdown.addEventListener('change', event => {
            if (!newCategoryDropdown.classList.contains('disabled')) {
                categoryID = event.target.options[event.target.selectedIndex].id;
                category = event.target.options[event.target.selectedIndex].text;
                if (category == '--Split--') {
                    getSplitdata();
                }
                else {
                    document.getElementById('SPLIT_BTN').style.display = 'none';
                    totalAmountSaved = '';
                    splitAmount = [];
                }
                tempcategory = 'ChangedValue';
                subCategory = '';
                populateSubCategoryDropdown(category);
                checkRequiredFieldsOfNewEntry();
            }
        });
        newSubCategoryDropdown.addEventListener('change', event => {
            if (!newSubCategoryDropdown.classList.contains('disabled')) {
                categoryID = event.target.options[event.target.selectedIndex].id;
                subCategory = event.target.options[event.target.selectedIndex].text;
                tempsubCategory = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        newCheckNoInput.addEventListener('input', event => {
            if (!newCheckNoInput.classList.contains('disabled')) {
                checkNo = event.target.value;
                tempcheckNo = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        newDescriptionInput.addEventListener('input', event => {
            if (!newDescriptionInput.classList.contains('disabled')) {
                description = event.target.value;
                tempdescription = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        newReceiptInput.addEventListener('input', event => {
            if (!newReceiptInput.classList.contains('disabled')) {
                receipt = event.target.value;
                tempreceipt = 'ChangedValue';
                checkRequiredFieldsOfNewEntry();
            }
        });
        expenseRadio.addEventListener('change', event => {
            if (!expenseRadio.classList.contains('disabled')) {
                accountType = 'E';
                tempaccountType = 'E';
                checkRequiredFieldsOfNewEntry();
            }
        });
        depositRadio.addEventListener('change', event => {
            if (!depositRadio.classList.contains('disabled')) {
                accountType = 'D';
                tempaccountType = 'D';
                checkRequiredFieldsOfNewEntry();
            }
        });
    }

    async function saveNewAccount() {
        if (document.getElementById('newCategoryDropdown').value != '--Split--') {
            splitAmount = [];
        }
        const amountType = document.getElementById("expenseRadio").checked ? "E" : "D";
        if (attachmentArray == undefined || attachmentArray.length == 0) {
            const result = await ConsumerFinancesAjax.insertAccountAsync(date, amount, amountType, accountID, payee, category, subCategory, checkNo, description, null, null, receipt, BtnName, regId, splitAmount, categoryID);
            const { insertAccountResult } = result;
            if (insertAccountResult.registerId != null) {
                ConsumerFinances.loadConsumerFinanceLanding();
            }
        }
        else {
            const result = await ConsumerFinancesAjax.insertAccountAsync(date, amount, amountType, accountID, payee, category, subCategory, checkNo, description, attachmentId, attachmentDesc, receipt, BtnName, regId, splitAmount, categoryID);
            const { insertAccountResult } = result;

            if (insertAccountResult.registerId != null) {
                splitAmount = [];
                ConsumerFinances.loadConsumerFinanceLanding();
            }
        }
    }

    function deleteAccountPOPUP() {
        const confirmPopup = POPUP.build({
            hideX: true,
            classNames: ['warning'],
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                deleteAccount(confirmPopup);
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

        message.innerText = 'Are you sure you would like to delete this record?';
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

    async function deleteAccount(confirmPopup) {
        await ConsumerFinancesAjax.deleteConsumerFinanceAccountAsync(regId);
        POPUP.hide(confirmPopup);
        ConsumerFinances.loadConsumerFinanceLanding();
    }

    async function getCategorySubCategorybyPayee(categoryID) {
        const {
            getCategoriesSubCategoriesByPayeeResult: CategoriesSubCategory,
        } = await ConsumerFinancesAjax.getCategoriesSubCategoriesByPayeeAsync(categoryID);

        if (payee == 'Opening Balance') {
            category = '';
        } else {
            category = CategoriesSubCategory[0].CategoryDescription;
        }
        subCategory = CategoriesSubCategory[0].SubCategoryDescription;
        populateCategoryDropdown(categoryID);
        populateSubCategoryDropdown(category);
        checkRequiredFieldsOfNewEntry();
    }

    // Populate the Account DDL 
    async function populateAccountDropdown() {
        const {
            getActiveAccountResult: accounts,
        } = await ConsumerFinancesAjax.getActiveAccountAsync($.session.consumerId, accountPermission);
        let data = accounts.map((account) => ({
            id: account.accountId,
            value: account.accountName,
            text: account.accountName
        }));
        if (data.length == 1) {
            account = data[0].value;
            accountID = data[0].id;
        }
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newAccountDropdown", data, account);
        checkRequiredFieldsOfNewEntry();
    }

    async function populatePayeeDropdown() {
        const {
            getPayeesResult: Payees,
        } = await ConsumerFinancesAjax.getPayeesAsync($.session.consumerId);
        let data = Payees.map((payees) => ({
            id: payees.CategoryID,
            value: payees.Description,
            text: payees.Description
        }));
        data.unshift({ id: null, value: 'Opening Balance', text: 'Opening Balance' });
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newPayeeDropdown", data, payee);
        checkRequiredFieldsOfNewEntry();
    }

    async function populateCategoryDropdown(categoryID) {
        const {
            getCatogoriesResult: Category,
        } = await ConsumerFinancesAjax.getCategoriesAsync(categoryID);
        let data = Category.map((category) => ({
            id: category.CategoryID,
            value: category.CategoryDescription,
            text: category.CategoryDescription
        }));

        data.unshift({ id: null, value: '--Split--', text: '--Split--' });
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("newCategoryDropdown", data, category);
        if (category == '--Split--' && document.getElementById('SPLIT_BTN').style.display == 'none' && payee != 'Opening Balance') {
            buildSplitTransectionPopUp();
        }
        checkRequiredFieldsOfNewEntry();
    }

    async function populateSubCategoryDropdown(category) {
        const {
            getSubCatogoriesResult: SubCategory,
        } = await ConsumerFinancesAjax.getSubCategoriesAsync(category);
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
            attributes: [{ key: 'maxlength', value: '10' }],
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

        var confirmMessage = document.createElement('div');
        confirmMessage.innerHTML = `<h3 id="confirmMessage" class="confirmMessage password-warning"></h3>`;
        addPayeePopup.appendChild(confirmMessage);

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
            var reg = new RegExp('^[0-9 -]+$');
            if (payeezipcode) {
                if (!reg.test(payeezipcode)) {
                    document.getElementById('zipcodeInput').value = payeezipcode.substring(0, payeezipcode.length - 1);
                    return;
                }
                payeezipcode = payeezipcode.split('-').join('');
                let finalVal = payeezipcode.match(/.{1,5}/g).join('-');
                document.getElementById('zipcodeInput').value = finalVal;
            }
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
            payeeInput.classList.add('errorPopup');
        } else {
            payeeInput.classList.remove('errorPopup');
        }

        if (address1.value === '') {
            address1Input.classList.add('errorPopup');
        } else {
            address1Input.classList.remove('errorPopup');
        }

        if (city.value === '') {
            cityInput.classList.add('errorPopup');
        } else {
            cityInput.classList.remove('errorPopup');
        }

        if (state.value === '') {
            stateInput.classList.add('errorPopup');
        } else {
            stateInput.classList.remove('errorPopup');
        }

        if (zipcode.value === '') {
            zipcodeInput.classList.add('errorPopup');
        } else {
            zipcodeInput.classList.remove('errorPopup');
        }
        setBtnStatus();
    }

    function setBtnStatus() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
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

        var messagetext = document.getElementById('confirmMessage');
        messagetext.innerHTML = ``;
        if (insertPayeeResult.RegionID == '-1') {
            duplicatePayeErrorPopup();

        }
        else {
            POPUP.hide(addPayeePopup);
            payee = payeeName;
            document.getElementById('newCategoryDropdown').value = '';
            document.getElementById('newSubCategoryDropdown').value = '';
            temppayee = 'ChangedValue';
            populatePayeeDropdown();
        }

    }

    function duplicatePayeErrorPopup() {
        const duplicatePayeErrorConfPOPUP = POPUP.build({
            hideX: true,
            classNames: ['warning'],
        });
        const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(duplicatePayeErrorConfPOPUP);
                POPUP.show(addPayeePopup);
            },
        });
        okBtn.style.width = '100%';
        const message = document.createElement('p');
        message.innerText = 'You are trying to add a payee that already exists, please select the existing payee or enter a new payee with a different name.';
        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        duplicatePayeErrorConfPOPUP.appendChild(message);
        duplicatePayeErrorConfPOPUP.appendChild(okBtn);
        okBtn.focus();
        POPUP.show(duplicatePayeErrorConfPOPUP);
    }

    async function buildSplitTransectionPopUp() {
        if (splitAmount.length > 3) {
            numberOfRows = splitAmount.length + 2;
        }

        regTotalAmount = document.getElementById('newAmountInput').value != '' ? parseFloat(document.getElementById('newAmountInput').value).toFixed(2) : 0;
        splitTransPopup = POPUP.build({
            header: "Split Transaction",
            hideX: true,
            id: "splitTransPopup"
        });

        splitTransPopup.style.maxWidth = '900px';

        for (let i = 0; i < numberOfRows; i++) {
            splitCategoryDropdownN[i] = dropdown.build({
                id: 'splitCategoryDropdownN' + i,
                label: "Category",
                dropdownId: "splitCategoryDropdownN" + i,
            });

            splitDescriptionInputN[i] = input.build({
                id: 'splitDescriptionInputN' + i,
                type: 'text',
                label: 'Description',
                style: 'secondary',
                classNames: 'autosize',
                value: splitAmount[i] != undefined ? splitAmount[i].description : '',
            });

            splitAmountInputN[i] = input.build({
                id: 'splitAmountInputN' + i,
                type: 'number',
                label: 'Amount',
                style: 'secondary',
                value: splitAmount[i] != undefined ? splitAmount[i].amount : '',
            });

            btnWrapInputsN = document.createElement("div");
            btnWrapInputsN.classList.add("cFInputWrap");
            splitCategoryDropdownN[i].classList.add('width37Per');
            btnWrapInputsN.appendChild(splitCategoryDropdownN[i]);
            splitDescriptionInputN[i].classList.add('width37Per');
            btnWrapInputsN.appendChild(splitDescriptionInputN[i]);
            splitAmountInputN[i].classList.add('width21Per');
            btnWrapInputsN.appendChild(splitAmountInputN[i]);
            splitTransPopup.appendChild(btnWrapInputsN);
        }


        regAmountTotalInput = input.build({
            id: 'regAmountTotalInput',
            type: 'number',
            label: 'Register Total',
            style: 'secondary',
            readonly: true,
            value: regTotalAmount,
        });

        amountTotalInput = input.build({
            id: 'amountTotalInput',
            type: 'number',
            label: 'Total',
            style: 'secondary',
            readonly: true,
            value: totalAmount,
        });

        let totalBtnWrapInputs = document.createElement("div");
        totalBtnWrapInputs.classList.add("cFInputWrap");
        regAmountTotalInput.classList.add('width21Per');
        regAmountTotalInput.classList.add('marginLeft50Per');
        totalBtnWrapInputs.appendChild(regAmountTotalInput);
        amountTotalInput.classList.add('width21Per');
        totalBtnWrapInputs.appendChild(amountTotalInput);
        splitTransPopup.appendChild(totalBtnWrapInputs);

        saveSplitBtn = button.build({
            id: "saveSplitBtn",
            text: "save",
            type: "contained",
            style: "secondary",
            classNames: 'disabled',
            callback: () => splitTransPopupSaveBtn()
        });

        cancelSplitBtn = button.build({
            id: "cancelSplitBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: () => {
                document.getElementById('newCategoryDropdown').value = categoryOldVal;
                document.getElementById('newAmountInput').value = tempAmountval;
                amount = tempAmountval;
                POPUP.hide(splitTransPopup);
                checkRequiredFieldsOfNewEntry();
            },
        });

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(saveSplitBtn);
        btnWrap.appendChild(cancelSplitBtn);
        splitTransPopup.appendChild(btnWrap);
        popUpSplitTransectionEventHandlers();
        POPUP.show(splitTransPopup);
        populateSplitCategoryDropdown('');
        splitAmountTotal();
    }

    function popUpSplitTransectionEventHandlers() {
        for (let i = 0; i < numberOfRows; i++) {
            splitAmountInputN[i].addEventListener('input', event => {
                tempAmouts = event.target.value;
                if (tempAmouts.includes('.') && (tempAmouts.match(/\./g).length > 1 || tempAmouts.toString().split('.')[1].length > 2)) {
                    splitAmountInputN[i].querySelector('#splitAmountInputN' + i).value = tempAmouts.substring(0, tempAmouts.length - 1);
                    return;
                }
                checkRequiredFieldsSplitTransection();
                splitAmountTotal();
            });
            splitAmountInputN[i].addEventListener('focusout', event => {
                if (splitAmountInputN[i].querySelector('#splitAmountInputN' + i).value != '')
                    splitAmountInputN[i].querySelector('#splitAmountInputN' + i).value = parseFloat(splitAmountInputN[i].querySelector('#splitAmountInputN' + i).value).toFixed(2);
            });

            splitDescriptionInputN[i].addEventListener('input', event => {
                checkRequiredFieldsSplitTransection();
            });

            splitCategoryDropdownN[i].addEventListener('change', event => {
                checkRequiredFieldsSplitTransection();
            });
        }
    }

    function checkRequiredFieldsSplitTransection() {
        for (let i = 0; i < 2; i++) {
            var SplitCategory = splitCategoryDropdownN[i].querySelector('#splitCategoryDropdownN' + i);
            var splitAmt = splitAmountInputN[i].querySelector('#splitAmountInputN' + i);
            if (SplitCategory.value === '') {
                splitCategoryDropdownN[i].classList.add('errorPopup');
            } else {
                splitCategoryDropdownN[i].classList.remove('errorPopup');
            }

            if (splitAmt.value === '') {
                splitAmountInputN[i].classList.add('errorPopup');
            } else {
                splitAmountInputN[i].classList.remove('errorPopup');
            }
        }

        for (let i = 2; i < numberOfRows; i++) {
            var SplitCategory = splitCategoryDropdownN[i].querySelector('#splitCategoryDropdownN' + i);
            var splitAmt = splitAmountInputN[i].querySelector('#splitAmountInputN' + i);
            if (SplitCategory.value !== '' && splitAmt.value === '') {
                splitAmountInputN[i].classList.add('errorPopup');
            } else {
                splitAmountInputN[i].classList.remove('errorPopup');
            }
            if (SplitCategory.value === '' && splitAmt.value !== '') {
                splitCategoryDropdownN[i].classList.add('errorPopup');
            } else {
                splitCategoryDropdownN[i].classList.remove('errorPopup');
            }
        }

        setBtnStatusSplitTransection();
    }

    function setBtnStatusSplitTransection() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            saveSplitBtn.classList.add('disabled');
            return;
        } else {
            saveSplitBtn.classList.remove('disabled');
        }
    }

    async function populateSplitCategoryDropdown(categoryID) {
        const {
            getCatogoriesResult: Category,
        } = await ConsumerFinancesAjax.getCategoriesAsync(categoryID);
        let data = Category.map((category) => ({
            id: category.CategoryID,
            value: category.CategoryDescription,
            text: category.CategoryDescription
        }));
        data.unshift({ id: null, value: '', text: '' });
        for (let i = 0; i < numberOfRows; i++) {
            dropdown.populate("splitCategoryDropdownN" + i, data, splitAmount[i] != undefined ? splitAmount[i].category : '');
        }
        checkRequiredFieldsSplitTransection();
    }

    function splitAmountTotal() {
        var sum = 0;
        for (var i = 0; i < numberOfRows; i++) {
            if (splitAmountInputN[i].querySelector('#splitAmountInputN' + i).value != '')
                sum += parseFloat(splitAmountInputN[i].querySelector('#splitAmountInputN' + i).value);
        }
        totalAmount = sum;
        document.getElementById('amountTotalInput').value = sum.toFixed(2);
        if (document.getElementById('newAmountInput').value == '') {
            document.getElementById('newAmountInput').value = sum.toFixed(2);
            document.getElementById('regAmountTotalInput').value = sum.toFixed(2);
            amount = sum.toFixed(2);
        }
    }

    async function splitTransPopupSaveBtn() {
        if (regTotalAmount != totalAmount) {
            errorPopup(1);
        }
        else {
            splitTransSaveData();
            POPUP.hide(splitTransPopup);
        }
    }

    function errorPopup(errorCode) {
        const errorConfPOPUP = POPUP.build({
            hideX: true,
            classNames: ['warning', 'popupSize'],
        });
        const yesBtn = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                cancelSplitBtn.classList.remove('disabled'); 
                if (errorCode == 1) {
                    POPUP.hide(errorConfPOPUP);
                    POPUP.hide(splitTransPopup);
                    document.getElementById('newAmountInput').value = parseFloat(totalAmount).toFixed(2);
                    amount = parseFloat(totalAmount).toFixed(2); 
                    splitTransSaveData();
                }
                else {
                    POPUP.hide(errorConfPOPUP);
                    buildSplitTransectionPopUp();
                }
            },
        });
        const noBtn = button.build({
            text: 'No',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                cancelSplitBtn.classList.remove('disabled');
                if (errorCode == 1) {
                    POPUP.hide(errorConfPOPUP);
                    POPUP.show(splitTransPopup);
                } else {
                    document.getElementById('newAmountInput').value = parseFloat(totalAmount).toFixed(2);
                    amount = parseFloat(totalAmount).toFixed(2);
                    POPUP.hide(errorConfPOPUP);
                }
            },
        });

        const message = document.createElement('p');
        if (errorCode == 1)
            message.innerText = 'The total of this split transaction dose not match the total entered on the New Entry form. Would you like to change the total on the New Entry form.';
        else
            message.innerText = 'The Amount entered does not equal the total amount for this split transaction. Would you like to edit the split transaction?';

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        errorConfPOPUP.appendChild(message);
        errorConfPOPUP.appendChild(btnWrap);
        POPUP.show(errorConfPOPUP);
        cancelSplitBtn.classList.add('disabled');
    }

    async function splitTransSaveData() {
        splitAmount = [];
        for (let i = 0; i < numberOfRows; i++) {
            var SplitCategory = splitCategoryDropdownN[i].querySelector('#splitCategoryDropdownN' + i);
            var desc = splitDescriptionInputN[i].querySelector('#splitDescriptionInputN' + i);
            var splitAmt = splitAmountInputN[i].querySelector('#splitAmountInputN' + i);
            if (SplitCategory.value !== '') {
                splitAmount.push({
                    "itemNumber": i + 1,
                    "categoryId": SplitCategory.options[SplitCategory.selectedIndex].id,
                    "category": SplitCategory.options[SplitCategory.selectedIndex].value,
                    "description": desc.value,
                    "amount": splitAmt.value
                });
            }
        }
        document.getElementById('SPLIT_BTN').style.display = 'block';
        tempSplit = 'ChangedValue';
        tempAmountval = totalAmount;
        totalAmountSaved = totalAmount;
        categoryOldVal = document.getElementById('newCategoryDropdown').value;
        checkRequiredFieldsOfNewEntry();
    }

    function getaccountPermission() {
        accountPermission = '';
        tempAccountPer = [];
        if ($.session.CFViewChecking)
            tempAccountPer.push('Checking');

        if ($.session.CFViewCraditCard) {
            tempAccountPer.push('Credit Card');
        }

        if ($.session.CFViewFoodStamp) {
            tempAccountPer.push('Food Stamps');
        }

        if ($.session.CFViewPettyCash) {
            tempAccountPer.push('Petty Cash');
        }

        if ($.session.CFViewShaving) {
            tempAccountPer.push('Savings');
        }

        if (tempAccountPer.length > 0)
            accountPermission = tempAccountPer.toString();
        else
            accountPermission = '';
    }

    return {
        init,
        buildNewEntryForm,
        populatePayeeDropdown,
        populateCategoryDropdown,
        populateAccountDropdown,
    };
})(); 