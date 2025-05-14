const CFEditAccount = (() => {
    //Inputs
    let CFConsumerBtns;
    let consumerRow;
    let consumerElement;
    var selectedConsumers;
    var selectedConsumersName;
    var selectedConsumersId;

    //filter
    let accountId = '0';
    let BtnName;
    let page;
    let load;
    let IsDisabledAccount = false;
    let accountPermission;
    let tempAccountPer;
    let backPage;

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
                page = 'Update';
                backPage = 1;
                load = 1;
                account = '';
                accountId = '0';
                await loadCFEditLanding();
                DOM.toggleNavLayout();
                break;
            }
            case 'miniRosterCancel': {
                DOM.toggleNavLayout();
                loadApp('home');
                break;
            }
        }
    }

    async function loadCFEditFromAccountRegister(Consumers) {
        setActiveModuleAttribute('CFEditAccount');
        backPage = 2;
        DOM.clearActionCenter();
        selectedConsumers = Consumers;
        page = 'Update';
        load = 1;
        await loadCFEditLanding();
        DOM.toggleNavLayout();
    }

    // Build OOD Module Landing Page
    async function loadCFEditLanding() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();

        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

        landingPage = document.createElement('div');
        var LineBr = document.createElement('br');
        getaccountPermission();
        selectedConsumersId = selectedConsumers[selectedConsumers.length - 1].id;
        const name = (
            await ConsumerFinancesAjax.getConsumerNameByID({
                token: $.session.Token,
                consumerId: selectedConsumersId,
            })
        ).getConsumerNameByIDResult;

        selectedConsumersName = name[selectedConsumers.length - 1].FullName;

        const resultAccount = await ConsumerFinancesAjax.getEditAccountAsync(selectedConsumersId, accountPermission);
        const { getEditAccountResult } = resultAccount;
        if (getEditAccountResult.length > 0 && load == 1) {
            account = getEditAccountResult[0].accountName;
            accountId = getEditAccountResult[0].accountId;
        }

        if (page == 'Update') {
            const topButton = buildHeaderButton();
            landingPage.appendChild(topButton);
            border = document.createElement('div');
            border.classList.add('borderLine');
            landingPage.appendChild(LineBr);
            landingPage.appendChild(LineBr);
            landingPage.appendChild(border);
            landingPage.appendChild(LineBr);
        }

        const importantAccountForm = await buildAccountForm();
        landingPage.appendChild(importantAccountForm);
        populateAccountDropdown();
        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // build display of Account and button
    function buildHeaderButton() {
        consumerElement = document.createElement('div');
        consumerRow = document.createElement('div');
        consumerRow.classList.add('consumerHeader');
        CFConsumerBtns = buildButtonBar();
        consumerRow.appendChild(CFConsumerBtns);
        consumerElement.appendChild(consumerRow);
        return consumerElement;
    }

    // build display of "New Account"
    function buildButtonBar() {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');
        buttonBar.style.maxHeight = '50px';
        buttonBar.style.minWidth = '100%';

        const dropdownButtonBar = document.createElement('div');
        const entryButtonBar = document.createElement('div');
        dropdownButtonBar.style.width = '40%';
        entryButtonBar.style.width = '32%';

        accountDropdown = dropdown.build({
            label: 'Accounts:',
            dropdownId: 'accountDropdown',
        });

        accountDropdown.addEventListener('change', event => {
            accountId = event.target.value;
            account = event.target.options[event.target.selectedIndex].id;
            page = 'Update';
            load = 2;
            loadCFEditLanding();
        });

        const entryBtn = button.build({
            text: 'ADD ACCOUNT',
            style: 'secondary',
            type: 'contained',
            classNames: 'newEntryBtn',
            readonly: $.session.CFInsertAccounts,
            callback: async () => {
                if (!entryBtn.classList.contains('disabled')) {
                    page = 'Add';
                    loadCFEditLanding();
                }
            },
        });
        if ($.session.CFInsertAccounts) {
            entryBtn.classList.remove('disabled');
        } else {
            entryBtn.classList.add('disabled');
        }
        entryBtn.style.height = '50px';
        entryBtn.style.minWidth = '100%';
        accountDropdown.style.minWidth = '100%';
        dropdownButtonBar.appendChild(accountDropdown);
        entryButtonBar.appendChild(entryBtn);
        entryButtonBar.style.marginLeft = '10%';
        buttonBar.appendChild(dropdownButtonBar);
        buttonBar.appendChild(entryButtonBar);
        return buttonBar;
    }

    async function buildAccountForm() {
        disabledEnabledAccounts();
        const employeeInfoDiv = document.createElement('div');
        employeeInfoDiv.classList.add('additionalQuestionWrap');

        name = '';
        number = '';
        type = '';
        status = '';
        classofAccount = null;
        dateClosed = null;
        lastReconciled = '';
        openingBalance = '';
        balance = '';
        description = '';
        dateOpened = null;

        nameTemp = '';
        numberTemp = '';
        typeTemp = '';
        statusTemp = '';
        classofAccountTemp = '';
        dateOpenedTemp = '';
        dateClosedTemp = '';
        openingBalanceTemp = '';
        descriptionTemp = '';

        if (page == 'Update') {
            if (accountId != '' && accountId != '0') {
                const result = await ConsumerFinancesAjax.getEditAccountInfoByIdAsync(accountId);
                const { getEditAccountInfoByIdResult } = result;
                name = getEditAccountInfoByIdResult[0].name;
                number = getEditAccountInfoByIdResult[0].number;
                type = getEditAccountInfoByIdResult[0].type;
                status = getEditAccountInfoByIdResult[0].status;
                classofAccount = getEditAccountInfoByIdResult[0].classofAccount;
                dateOpened =
                    getEditAccountInfoByIdResult[0].dateOpened == ''
                        ? null
                        : moment(getEditAccountInfoByIdResult[0].dateOpened).format('YYYY-MM-DD');
                dateClosed =
                    getEditAccountInfoByIdResult[0].dateClosed == ''
                        ? null
                        : moment(getEditAccountInfoByIdResult[0].dateClosed).format('YYYY-MM-DD');
                lastReconciled =
                    getEditAccountInfoByIdResult[0].lastReconciled == ''
                        ? null
                        : moment(getEditAccountInfoByIdResult[0].lastReconciled).format('YYYY-MM-DD');
                openingBalance = getEditAccountInfoByIdResult[0].openingBalance;
                balance = getEditAccountInfoByIdResult[0].balance;
                description = getEditAccountInfoByIdResult[0].description;
            } else {
                account = '';
            }
            BtnName = 'UPDATE';
        } else {
            BtnName = 'SAVE';
            dateOpened = UTIL.getTodaysDate();
            accountId = '0';
            account = '';
        }

        inputName = input.build({
            id: 'inputName',
            type: 'text',
            label: 'Name',
            style: 'secondary',
            readonly: IsDisabledAccount,
            value: name ? name : '',
        });
        inputNumber = input.build({
            id: 'inputNumber',
            type: 'number',
            label: 'Number',
            style: 'secondary',
            readonly: IsDisabledAccount,
            value: number ? number : '',
        });
        typeDropdown = dropdown.build({
            id: 'typeDropdown',
            label: 'Type',
            dropdownId: 'typeDropdown',
            readonly: IsDisabledAccount,
            value: type ? type : '',
        });
        statusDropdown = dropdown.build({
            id: 'statusDropdown',
            label: 'Status',
            dropdownId: 'statusDropdown',
            readonly: IsDisabledAccount,
            value: status ? status : '',
        });
        classDropdown = dropdown.build({
            id: 'classDropdown',
            label: 'Class',
            dropdownId: 'classDropdown',
            readonly: IsDisabledAccount,
            value: classofAccount ? classofAccount : '',
        });
        opendDate = input.build({
            id: 'opendDate',
            type: 'date',
            label: 'Date Opened',
            style: 'secondary',
            readonly: IsDisabledAccount,
            value: dateOpened ? dateOpened : '',
        });
        closeDate = input.build({
            id: 'closeDate',
            type: 'date',
            label: 'Date Closed',
            style: 'secondary',
            readonly: IsDisabledAccount,
            value: dateClosed ? dateClosed : '',
        });
        lastReconciledDate = input.build({
            id: 'lastReconciledDate',
            type: 'date',
            label: 'Last Reconciled',
            style: 'secondary',
            readonly: true,
            value: lastReconciled ? lastReconciled : '',
        });
        inputOpeningBal = input.build({
            id: 'inputOpeningBal',
            type: 'text',
            label: 'Opening Balance',
            style: 'secondary',
            readonly: IsDisabledAccount,
            value: openingBalance ? '$' + openingBalance : '',
        });
        inputBal = input.build({
            id: 'inputBal',
            type: 'text',
            label: 'Balance',
            style: 'secondary',
            readonly: true,
            value: balance ? '$' + balance : '',
        });

        inputDesc = input.build({
            id: 'inputDesc',
            type: 'text',
            label: 'Description',
            style: 'secondary',
            readonly: IsDisabledAccount,
            value: description ? description : '',
        });

        // button
        SAVE_BTN = button.build({
            text: BtnName,
            style: 'secondary',
            type: 'contained',
            icon: 'save',
            readonly: IsDisabledAccount,
            callback: async () => {
                if (!SAVE_BTN.classList.contains('disabled')) {
                    SAVE_BTN.classList.add('disabled');
                    await saveUpdateAccount();
                }
            },
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: async () => {
                if (backPage == 1) cancleAccount();
                else {
                    ConsumerFinances.backFromConsumerFinanceEditAccount(selectedConsumers);
                }
            },
        });

        const column1 = document.createElement('div');
        column1.classList.add('col-1');
        const addNewCard = document.createElement('div');
        addNewCard.classList.add('card');
        const addNewCardBody = document.createElement('div');
        addNewCardBody.classList.add('card__body');
        if (page == 'Add') {
            addNewCard.innerHTML = `<div class="card__header">${selectedConsumersName} </div>`;
        } else {
            addNewCard.innerHTML = `<div class="card__header">${selectedConsumersName} <br> Account : ${account} </div>`;
        }

        addNewCard.appendChild(addNewCardBody);
        column1.appendChild(addNewCard);

        var drWrap = document.createElement('div');
        drWrap.classList.add('editAccountDTWrap');
        inputName.classList.add('width23Per');
        drWrap.appendChild(inputName);
        inputNumber.classList.add('width23Per');
        drWrap.appendChild(inputNumber);
        typeDropdown.classList.add('width16Per');
        drWrap.appendChild(typeDropdown);
        statusDropdown.classList.add('width16Per');
        drWrap.appendChild(statusDropdown);
        classDropdown.classList.add('width16Per');
        drWrap.appendChild(classDropdown);
        addNewCardBody.appendChild(drWrap);

        var drWrap1 = document.createElement('div');
        drWrap1.classList.add('editAccountDTWrap');
        drWrap1.classList.add('width50Per');
        opendDate.classList.add('width32Per');
        drWrap1.appendChild(opendDate);
        inputOpeningBal.classList.add('width32Per');
        drWrap1.appendChild(inputOpeningBal);
        closeDate.classList.add('width32Per');
        drWrap1.appendChild(closeDate);
        addNewCardBody.appendChild(drWrap1);

        var drWrap2 = document.createElement('div');
        drWrap2.classList.add('editAccountDTWrap');
        drWrap2.classList.add('width33Per');

        lastReconciledDate.classList.add('width50Per');
        drWrap2.appendChild(lastReconciledDate);
        inputBal.classList.add('width50Per');
        drWrap2.appendChild(inputBal);
        //addNewCardBody.appendChild(drWrap2);  //Due to new requirenment hide reconciled and opening balance

        var drWrap3 = document.createElement('div');
        drWrap3.classList.add('editAccountDTWrap');
        inputDesc.classList.add('width50Per');
        drWrap3.appendChild(inputDesc);
        addNewCardBody.appendChild(drWrap3);

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('editAccountBtnWrap');
        btnWrap.style.marginLeft = '25%';
        btnWrap.style.width = '50%';

        SAVE_BTN.style.width = '52%';
        btnWrap.appendChild(SAVE_BTN);

        CANCEL_BTN.style.width = '52%';
        CANCEL_BTN.style.marginLeft = '5%';
        btnWrap.appendChild(CANCEL_BTN);
        addNewCardBody.appendChild(btnWrap);

        employeeInfoDiv.appendChild(column1);
        populateDropdown();
        eventListeners();

        checkRequiredFieldsOfAccountInfo(name, type, status, dateOpened, dateClosed, classofAccount);
        return employeeInfoDiv;
    }

    function disabledEnabledAccounts() {
        if ($.session.CFUpdateEditAccounts && page == 'Update') {
            IsDisabledAccount = false;
        } else if ($.session.CFInsertAccounts && page == 'Add') {
            IsDisabledAccount = false;
        } else {
            IsDisabledAccount = true;
        }
    }
    // Populate the Account DDL
    async function populateAccountDropdown() {
        const { getEditAccountResult: accounts } = await ConsumerFinancesAjax.getEditAccountAsync(
            selectedConsumersId,
            accountPermission,
        );

        let dataAccount = accounts.map(account => ({
            id: account.accountName,
            value: account.accountId,
            text: account.accountName + ' - $' + (account.totalBalance == '' ? '0.00' : account.totalBalance),
        }));
        dropdown.populate('accountDropdown', dataAccount, accountId);
    }

    async function populateDropdown() {
        const { getAccountClassResult: classAccount } = await ConsumerFinancesAjax.getAccountClassAsync();
        let dataClass = classAccount.map(accountClass => ({
            id: accountClass.SystemClass,
            value: accountClass.accountClass,
            text: accountClass.accountClass,
        }));
        dataClass.unshift({ id: null, value: '', text: '' }); //ADD Blank value
        dropdown.populate('classDropdown', dataClass, classofAccount);

        const typeData = [
            { id: 1, value: 'A', text: 'Asset ' },
            { id: 2, value: 'L', text: 'Liability' },
        ];
        typeData.unshift({ id: null, value: '', text: '' });
        dropdown.populate('typeDropdown', typeData, type);

        const statusData = [
            { id: 1, value: 'O', text: 'Open' },
            { id: 2, value: 'I', text: 'Inactive' },
            { id: 3, value: 'C', text: 'Closed' },
        ];
        statusData.unshift({ id: null, value: '', text: '' });
        dropdown.populate('statusDropdown', statusData, status);
    }

    function eventListeners() {
        inputName.addEventListener('input', event => {
            nameTemp = 'Changed';
            name = event.target.value.trim();
            getRequiredFieldsOfAccountInfo();
        });
        inputNumber.addEventListener('input', event => {
            numberTemp = 'Changed';
            number = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
        opendDate.addEventListener('input', event => {
            dateOpenedTemp = 'Changed';
            dateOpened = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
        closeDate.addEventListener('input', event => {
            dateClosedTemp = 'Changed';
            dateClosed = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
        inputDesc.addEventListener('input', event => {
            descriptionTemp = 'Changed';
            description = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
        inputOpeningBal.addEventListener('input', event => {
            let minAmount = event.target.value;
            var reg = new RegExp('^[0-9 . $ -]+$');
            if (!reg.test(minAmount) && minAmount != '') {
                document.getElementById('inputOpeningBal').value = minAmount.substring(0, minAmount.length - 1);
                return;
            } else if (
                minAmount.includes('.') &&
                (minAmount.match(/\./g).length > 1 || minAmount.toString().split('.')[1].length > 2)
            ) {
                document.getElementById('inputOpeningBal').value = minAmount.substring(0, minAmount.length - 1);
                return;
            }
            openingBalance = minAmount.replace('$', '');
            openingBalanceTemp = 'Changed';
            getRequiredFieldsOfAccountInfo();
        });
        typeDropdown.addEventListener('change', event => {
            typeTemp = 'Changed';
            type = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
        statusDropdown.addEventListener('change', event => {
            statusTemp = 'Changed';
            status = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
        classDropdown.addEventListener('change', event => {
            classofAccountTemp = 'Changed';
            classofAccount = event.target.value;
            getRequiredFieldsOfAccountInfo();
        });
    }

    function getRequiredFieldsOfAccountInfo() {
        var openDateVal = opendDate.querySelector('#opendDate');
        var closeDateVal = closeDate.querySelector('#closeDate');
        var nameVal = inputName.querySelector('#inputName');
        var typeVal = typeDropdown.querySelector('#typeDropdown');
        var statusVal = statusDropdown.querySelector('#statusDropdown');
        var classval = classDropdown.querySelector('#classDropdown');
        checkRequiredFieldsOfAccountInfo(
            nameVal.value,
            typeVal.value,
            statusVal.value,
            openDateVal.value,
            closeDateVal.value,
            classval.value
        );
    }

    function checkRequiredFieldsOfAccountInfo(nameVal, typeVal, statusVal, openDateVal, closeDateVal, classVal) {
        if (nameVal.trim() === '') {
            inputName.classList.add('error');
        } else {
            inputName.classList.remove('error');
        }

        if (typeVal === '') {
            typeDropdown.classList.add('error');
        } else {
            typeDropdown.classList.remove('error');
        }

        if (statusVal === '') {
            statusDropdown.classList.add('error');
        } else {
            statusDropdown.classList.remove('error');
        }

        if (openDateVal === '') {
            opendDate.classList.add('error');
        } else {
            opendDate.classList.remove('error');
        }

        if (closeDateVal != null && closeDateVal != '' && openDateVal > closeDateVal) {
            closeDate.classList.add('error');
        } else {
            closeDate.classList.remove('error');
        }

        if (classVal === '' || classVal == null) {  
            classDropdown.classList.add('error');
        } else {
            classDropdown.classList.remove('error');  
        }
        setBtnStatusOfAccountInfo();
    }

    function setBtnStatusOfAccountInfo() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            SAVE_BTN.classList.add('disabled');
            return;
        } else {
            if (
                nameTemp != '' ||
                numberTemp != '' ||
                typeTemp != '' ||
                statusTemp != '' ||
                classofAccountTemp != '' ||
                dateOpenedTemp != '' ||
                dateClosedTemp != '' ||
                openingBalanceTemp != '' ||
                descriptionTemp != ''
            ) {
                if (accountId == '0' && page == 'Update') {
                    SAVE_BTN.classList.add('disabled');
                } else {
                    SAVE_BTN.classList.remove('disabled');
                }
            } else {
                SAVE_BTN.classList.add('disabled');
            }
        }
    }

    function cancleAccount() {
        if (page == 'Add') {
            page = 'Update';
            load = 1;
            loadCFEditLanding();
        } else {
            roster2.clearSelectedConsumers();
            roster2.clearActiveConsumers();
            CFEditAccount.init();
        }
    }

    async function saveUpdateAccount() {
        if (page == 'Add') {
            accountId = '0';
        }

        if (dateClosed == '') dateClosed = null;
        const result = await ConsumerFinancesAjax.insertEditRegisterAccountAsync(
            selectedConsumersId,
            accountId,
            name,
            number == '' ? null : number,
            type,
            status,
            classofAccount == '' ? null : classofAccount,
            dateOpened,
            dateClosed,
            openingBalance,
            description == '' ? null : description,
        );
        const { insertEditRegisterAccountResult } = result;
        if (insertEditRegisterAccountResult.accountId != null) {
            page = 'Update';
            loadCFEditLanding();
        }
    }

    function init() {
        setActiveModuleAttribute('CFEditAccount');
        DOM.clearActionCenter();
        let defaultCFLocation = defaults.getLocation('moneyManagement');
        if (defaultCFLocation === '') {
            defaults.setLocation('moneyManagement', 0);
            defaultCFLocation = '0';
        }
        roster2.miniRosterinit(
            {
                locationId: defaultCFLocation,
                locationName: '',
            },
            {
                hideDate: true,
            },
        );

        roster2.showMiniRoster();
    }

    function getaccountPermission() {
        accountPermission = '';
        tempAccountPer = [];
        if ($.session.CFViewChecking) tempAccountPer.push('Checking');

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

        if ($.session.CFViewChristmasClub) {
            tempAccountPer.push('Christmas Club');
        }
        if ($.session.CFViewSystem20183A) {
            tempAccountPer.push('System 2018.3A');
        }
        if ($.session.CFViewSystem20183) {
            tempAccountPer.push('System 2018.3');
        }
        if ($.session.CFViewOhioEBT) {
            tempAccountPer.push('Ohio EBT');
        }
        if ($.session.CFViewViewFoodStampDebitCardEBT) {
            tempAccountPer.push('Food Stamp Debit Card EBT');
        }

        if (tempAccountPer.length > 0) {
            accountPermission = tempAccountPer.toString();
        } else accountPermission = '';
    }

    return {
        init,
        handleActionNavEvent,
        loadCFEditLanding,
        loadCFEditFromAccountRegister,
    };
})();
