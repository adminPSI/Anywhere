
const resetPassword = function () {

    let SEARCH_WRAP;
    let SEARCH_BTN;
    let SEARCH_INPUT;
    let INACTIVE_CHKBOX;
    let userTableData = [];
    let tempUserTableData = [];
    let displayedUsers = [];

    var userTable;
    var changePasswordPopup;
    var savePasswordBtn;
    var cancelPasswordBtn;
    var confirmPasswordInput;
    var newPasswordInput;
    var isCardDisabled = false;
    var newPasswordValue = null;
    var confirmPasswordValue = null;
    var selectedUserID;

    function init() {
        DOM.clearActionCenter();
        const topNav = buildRosterTopNav();
        userTable = buildTable();
        DOM.ACTIONCENTER.appendChild(topNav);
        DOM.ACTIONCENTER.appendChild(userTable);

        SEARCH_BTN.addEventListener('click', event => {
            SEARCH_WRAP.classList.toggle('searchOpen');
            SEARCH_INPUT.value = '';
            SEARCH_INPUT.focus();
        });

        SEARCH_INPUT.addEventListener('keyup', event => {
            tableUserSearch(event.target.value);
        });
        loadReviewPage(true);
    }

    function buildSearchBtn() {
        return button.build({
            text: 'Search',
            icon: 'search',
            style: 'secondary',
            type: 'contained',
            classNames: ['searchBtn'],
        });
    }

    function changePasswordBtn() {
        return button.build({
            text: 'Change Password',
            style: 'secondary',
            type: 'contained',
        });
    }

    function buildInactiveChkBox() {
        return input.buildCheckbox({
            text: "Show Inactives",
            callback: () => setCheckForInactiveUser(event.target)
        });
    }

    function buildActiveChkBox(checked) {
        return input.buildCheckbox({
            isChecked: checked === 'Y' ? true : false,
        });
    }

    function buildTable() {
        var tableOptions = {
            tableId: 'singleEntryAdminReviewTable',
            columnHeadings: [
                'User Name',
                'Last Name',
                'First Name',
                '',
                'Active'
            ],
            callback: handleUserTableEvents
        };

        return table.build(tableOptions);
    }

    function buildChangePasswordPopup(userId, userFirstName, UserLastName) {

        selectedUserID = userId;
        var popupClassNames = isCardDisabled
            ? ['timeEntryTransportationPopup', 'popup--filter', 'disabled']
            : ['timeEntryTransportationPopup', 'popup--filter'];

        changePasswordPopup = POPUP.build({
            classNames: popupClassNames,
            hideX: true,
        });

        newPasswordInput = input.build({
            id: 'newPasswordInput',
            label: 'New Password',
            type: 'password',
            style: 'secondary',
            value: newPasswordValue,
        });

        confirmPasswordInput = input.build({
            id: 'confirmPasswordInput',
            label: 'Confirm Password',
            type: 'password',
            style: 'secondary',
            class: 'input-field__input',
            value: confirmPasswordValue,
        });

        savePasswordBtn = button.build({
            id: 'savePasswordBtn',
            text: 'Change',
            type: 'contained',
            style: 'secondary',
            classNames: 'disabled',
        });

        cancelPasswordBtn = button.build({
            text: 'Cancel',
            type: 'outlined',
            style: 'secondary',
            classNames: 'cancelTransBtn',
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(savePasswordBtn);
        btnWrap.appendChild(cancelPasswordBtn);

        var header = document.createElement('h3');
        header.innerHTML = userId + ` - ` + userFirstName + ' ' + UserLastName;
        var headerSpace = document.createElement('h3');
        headerSpace.innerHTML = '';

        var errortext = document.createElement('div');
        errortext.innerHTML = `<h3 id="errortext" class="error__text"></h3>`;

        var confirmMessage = document.createElement('div');
        confirmMessage.innerHTML = `<h3 id="confirmMessage" class="confirmMessage password-warning"></h3>`;

        changePasswordPopup.appendChild(header);
        changePasswordPopup.appendChild(headerSpace);
        changePasswordPopup.appendChild(newPasswordInput);
        changePasswordPopup.appendChild(confirmPasswordInput);
        changePasswordPopup.appendChild(errortext);
        changePasswordPopup.appendChild(confirmMessage);
        changePasswordPopup.appendChild(btnWrap);

        setupChangePasswordEvents();
        POPUP.show(changePasswordPopup);
    }

    function setupChangePasswordEvents() {

        savePasswordBtn.addEventListener('click', () => {
            savePassword();
        });
        cancelPasswordBtn.addEventListener('click', () => {
            POPUP.hide(changePasswordPopup);
        });

        newPasswordInput.addEventListener('keyup', event => {
            checkPassword();
        });
        confirmPasswordInput.addEventListener('keyup', event => {
            checkPassword();
        });
    }

    function savePassword() {
        const changeBtn = document.getElementById('savePasswordBtn');
        if (checkPassword() == 0) return;
        changeBtn.classList.add('disabled');

        let newPW = $('#newPasswordInput').val();
        let confirmPW = $('#confirmPasswordInput').val();
        newPW = newPW.replaceAll(`\\`, `\\\\`);
        newPW = newPW.replaceAll(`"`, `\\"`);
        newPW = newPW.replaceAll(`'`, `''`);

        let passwordChangeError = false;
        let inactiveUser = false;
        let passwordReuseError = false;
        // blur focus to prevent messages from getting removed too quickly
        document.activeElement.blur();

        resetPasswordAjax.changeUserPassword(
            {
                UserID: selectedUserID,
                newPW: newPW,
                confirmPW: confirmPW,
            },
            function (results, error) {
                // success
                if (results.indexOf('Not active') != -1) {
                    const message = `
				Your account is inactive. Please contact your System Administrator to enable your account. 
				`;
                    $('#errortext').text(message);
                    inactiveUser = true;
                    return;
                }
                if (results.indexOf('Error:611') > -1) {
                    passwordReuseError = true;
                    const message = `
				Your new password does not meet your organizations password reuse rules. Please use a different password.
				`;
                    $('#errortext').text(message);
                    return;
                } else if (results.indexOf('Error:610') > -1) {
                    passwordChangeError = true;
                } else {
                    passwordChangeError = false;
                }

                changeBtn.classList.remove('disabled');

                if (inactiveUser || passwordReuseError) {
                    return;
                }
                if (passwordChangeError) {
                    const message = `Invalid user name or password. `;
                    $('#errortext').text(message);
                    return;
                }

                const passwordChangeConfPOPUP = POPUP.build({
                    hideX: true,
                });
                const okBtn = button.build({
                    text: 'OK',
                    style: 'secondary',
                    type: 'contained',
                    callback: () => {
                        POPUP.hide(passwordChangeConfPOPUP);
                    },
                });
                okBtn.style.width = '100%';
                const message = document.createElement('p');
                message.innerText = 'Password has been changed. You may now log in with your new password.';
                message.style.textAlign = 'center';
                message.style.marginBottom = '15px';
                passwordChangeConfPOPUP.appendChild(message);
                passwordChangeConfPOPUP.appendChild(okBtn);
                bodyScrollLock.disableBodyScroll(passwordChangeConfPOPUP);
                const overlayElement = document.querySelector('.overlay');
                overlayElement.style.zIndex = '2';
                passwordChangeConfPOPUP.style.zIndex = '3';
                passwordChangeConfPOPUP.style.top = '40%';
                okBtn.focus();
                POPUP.hide(changePasswordPopup);
                POPUP.show(passwordChangeConfPOPUP);
            },
        );
    }

    function checkPassword() {
        var pass1 = document.getElementById('newPasswordInput');
        var pass2 = document.getElementById('confirmPasswordInput');
        var message = document.getElementById('confirmMessage');

        message.innerHTML = ``;
        $('#errortext').text(``);
        strongPassword = $.session.strongPassword;
        // PW Can't contain more than one backslash in a row
        if (pass1.value.match(/\\{2,}/g)) {
            $('#errortext').text(`Your password can't contain more than one \\ in a row.`);
            document.getElementById('savePasswordBtn').classList.add('disabled');
            return 0;
        } else {
            $('#errortext').text(``);
            document.getElementById('savePasswordBtn').classList.remove('disabled');
        }

        //Extra condition for whether or not a strong password is required
        if (strongPassword === 'N') {
            if (pass1.value === '' || pass2.value === '') {
                message.innerHTML = 'Please enter and confirm a new password.';
                message.classList.add('password-error');
                return 0;
            }
            //passwords match?
            if (pass1.value !== pass2.value) {
                message.innerHTML = 'Passwords Do Not Match!';
                message.classList.add('password-error');
                return 0;
            } else {
                message.innerHTML = '';
                message.classList.remove('password-error');
                return 1;
            }
        } else {
            //if both are null
            if (
                pass1.value.length === 0 &&
                pass2.value.length === 0 &&
                $.session.changePasswordLinkSelected === ''
            ) {
                message.innerHTML = 'Please enter and confirm a new password.';
                return 0;
            }

            //is password strong?
            if (IsPasswordStrong(pass1.value) !== 1) {
                // specialCharDisplay. Remove the escape from backslash and quote.
                let specialCharDisplay = $.session.passwordSpecialCharacters.replaceAll(`\\\\`, `\\`);
                specialCharDisplay = specialCharDisplay.replaceAll(`\\"`, `"`);
                message.innerHTML = `Passwords must: Be at least ${$.session.advancedPasswordLength} characters long, 
                                        have a special character(${specialCharDisplay}), upper and lower case letters.`;
                return 0;
            }

            //passwords match?
            if (pass1.value === '' || pass2.value === '') {
                message.innerHTML = 'Please enter and confirm a new password.';
                message.classList.add('password-error');
                return 0;
            }
            //passwords match?
            if (pass1.value !== pass2.value) {
                message.innerHTML = 'Passwords Do Not Match!';
                message.classList.add('password-error');
                return 0;
            } else {
                message.innerHTML = '';
                message.classList.remove('password-error');
                return 1;
            }
        }
        return 1;
    }

    function IsPasswordStrong(password) {
        let preSpecialCharCheckString = $.session.passwordSpecialCharacters;
        // Remove the escapes, and re-add escapes after the string has been re-joined with commas.
        preSpecialCharCheckString = preSpecialCharCheckString.replaceAll(`\\\\`, `\\`);
        preSpecialCharCheckString = preSpecialCharCheckString.replaceAll(`\\"`, `"`);
        const specCharNoCommas = preSpecialCharCheckString.split('');
        let withCommas = specCharNoCommas.join((separator = ','));
        // Add in escapes
        withCommas = withCommas.replaceAll(`\\`, `\\\\`);
        withCommas = withCommas.replaceAll(`/`, `\\/`);
        withCommas = withCommas.replaceAll(`-`, `\\-`);
        withCommas = withCommas.replaceAll(`]`, `\\]`);
        withCommas = withCommas.replaceAll(`[`, `\\[`);
        const specChar = new RegExp(`[${withCommas}]`, 'g');

        if (password.length < $.session.advancedPasswordLength) return 0;
        if (!password.match(/[a-z]/) || !password.match(/[A-Z]/)) return 0;
        if (!password.match(specChar)) return 0;
        return 1;
    }

    // events
    function handleUserTableEvents() {
        var userId = event.target.id;
        var rowLastName = event.target.childNodes[1].innerText;
        var rowFirstName = event.target.childNodes[2].innerText;

        buildChangePasswordPopup(userId, rowFirstName, rowLastName);
    }

    //populate
    function populateTable(results, IsFirstLoad) {
        userTableData = results.map(td => {
            var userID = td.User_ID;
            var LastName = td.Last_Name;
            var FirstName = td.First_Name;
            var Active = td.Active;

            const additionalInformation = changePasswordBtn();
            additionalInformation.innerHTML = 'CHANGE PASSWORD';

            const activeCheckbox = buildActiveChkBox(Active);

            return {
                id: userID,
                FirstName: FirstName,
                LastName: LastName,
                Active: Active,
                values: [
                    userID,
                    LastName,
                    FirstName,
                    additionalInformation.outerHTML,
                    activeCheckbox.outerHTML,
                ],
                attributes: [
                    { key: 'data-status', value: userID },
                    { key: 'data-consumer-id', value: userID },
                ],
            };
        });
        if (IsFirstLoad) {
            tempUserTableData = userTableData;
        }
        table.populate(userTable, userTableData);
    }



    function buildRosterTopNav() {
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('roster-top-nav');

        SEARCH_BTN = buildSearchBtn();
        INACTIVE_CHKBOX = buildInactiveChkBox();

        // custom search stuff
        SEARCH_WRAP = document.createElement('div');
        SEARCH_WRAP.classList.add('rosterSearch');
        SEARCH_INPUT = document.createElement('input');
        SEARCH_INPUT.setAttribute('placeholder', 'search users');
        SEARCH_WRAP.appendChild(SEARCH_BTN);
        SEARCH_WRAP.appendChild(SEARCH_INPUT);

        INACTIVE_CHKBOX.style = "margin-right: 400px";
        var wrap1 = document.createElement('div');
        wrap1.classList.add('btnWrap');
        wrap1.appendChild(INACTIVE_CHKBOX);
        wrap1.appendChild(SEARCH_WRAP);

        btnWrap.appendChild(wrap1);
        return btnWrap;
    }

    function setCheckForInactiveUser(input) {
        var isChecked;
        if (input.checked) {
            isChecked = false;
        } else {
            isChecked = true;
        }
        loadReviewPage(isChecked)
    }

    function tableUserSearch(searchValue) {
        searchValue = searchValue.toLowerCase();
        displayedUsers = [];
        tempUserTableData.forEach(consumer => {
            var firstName = consumer.FirstName.toLowerCase();
            var lastName = consumer.LastName.toLowerCase();
            var fullName = `${firstName} ${lastName}`;
            var fullNameReversed = `${lastName} ${firstName}`;
            var matchesName = fullName.indexOf(searchValue);
            var matchesNameReverse = fullNameReversed.indexOf(searchValue);

            if (matchesName !== -1 || matchesNameReverse !== -1) {

                consumerObj = {
                    User_ID: consumer.id,
                    First_Name: consumer.FirstName,
                    Last_Name: consumer.LastName,
                    Active: consumer.Active
                };
                displayedUsers.push(consumerObj);
            }
        });
        populateTable(displayedUsers, false)
    }


    // load
    function loadReviewPage(active) {
        resetPasswordAjax.getActiveInactiveUserlist(
            {
                isActive: active == true ? 'Y' : 'N',
            },
            function (results, error) {
                populateTable(results, true);
            },
        );
    }

    return {
        init
    };
}();



