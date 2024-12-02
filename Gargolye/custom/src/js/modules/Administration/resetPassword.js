const resetPassword = (function () {
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
    var isChecked;

    function init() {
        DOM.clearActionCenter();
        const topNav = buildRosterTopNav();
        userTable = buildTable();

        // Set the data type for each header, for sorting purposes
        const headers = userTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // User Name
        headers[1].setAttribute('data-type', 'string'); // Last Name
        headers[2].setAttribute('data-type', 'string'); // First Name 
       
        DOM.ACTIONCENTER.appendChild(topNav);          
        DOM.ACTIONCENTER.appendChild(userTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(userTable);
       
        SEARCH_BTN.addEventListener('click', event => {
            SEARCH_WRAP.classList.toggle('searchOpen');
            SEARCH_INPUT.value = '';
            SEARCH_INPUT.focus();
        });

        SEARCH_INPUT.addEventListener('keyup', event => {
            tableUserSearch(event.target.value);
        });
        isChecked = $.session.isActiveUsers;
        loadReviewPage(isChecked);
        document.getElementById('searchBtn').click();  
    }

    function buildSearchBtn() {
        return button.build({
            id: 'searchBtn',
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
            text: 'Show Inactives',
            id: 'chkInacive',
            callback: () => setCheckForInactiveUser(event.target),
            isChecked: $.session.isActiveUsers,
        });
    }

    function buildActiveChkBox(checked) {
        return input.buildCheckbox({
            isChecked: checked === 'Y' ? true : false,
            callback: () => setCheckForInactiveUser(event.target),
        });
    }

    function buildTable() {
        var tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            columnHeadings: ['User Name', 'Last Name', 'First Name'],
            endIcon: true,
            secondendIconHeading: 'Active',
            secondendIcon: true,
        };

        return table.build(tableOptions);
    }

    function buildChangePasswordPopup(userId, userFirstName, UserLastName) {
        selectedUserID = userId;
        var popupClassNames = isCardDisabled
            ? ['resetPasswordPopup', 'popup--filter', 'disabled']
            : ['resetPasswordPopup', 'popup--filter'];

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
        document.getElementById('newPasswordInput').focus();      
     
        strongPassword = $.session.strongPassword;
        if (strongPassword === 'Y') {
            //is password strong?            
            var messagetext = document.getElementById('confirmMessage');
            messagetext.innerHTML = ``;
            let specialCharDisplay = $.session.passwordSpecialCharacters.replaceAll(`\\\\`, `\\`);
            specialCharDisplay = specialCharDisplay.replaceAll(`\\"`, `"`);
            messagetext.innerHTML = `Passwords must meet all of the following requirements: Be at least ${$.session.advancedPasswordLength} characters long, 
                                        have a special character(${specialCharDisplay}), have a number, and include upper and lower case letters.`;
            messagetext.classList.remove('password-error');
        }
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
        var messagetext = document.getElementById('confirmMessage');
        messagetext.innerHTML = ``;
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
                    messagetext.innerHTML = 'Your new password does not meet your organizations password reuse rules. Please use a different password.';
                    messagetext.classList.add('password-error');
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
                message.innerText = 'Password has been successfully changed for the selected user.';
                message.style.textAlign = 'center';
                message.style.marginBottom = '15px';
                passwordChangeConfPOPUP.appendChild(message);
                passwordChangeConfPOPUP.appendChild(okBtn);
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
        }

        //Extra condition for whether or not a strong password is required
        if (strongPassword === 'N') {
            if (pass1.value === '' || pass2.value === '') {
                message.innerHTML = 'Please enter and confirm a new password.';
                message.classList.add('password-error');
                document.getElementById('savePasswordBtn').classList.add('disabled');
                return 0;
            }
            //passwords match?
            if (pass1.value !== pass2.value) {
                message.innerHTML = 'Passwords Do Not Match!';
                message.classList.add('password-error');
                document.getElementById('savePasswordBtn').classList.add('disabled');
                return 0;
            } else {
                message.innerHTML = '';
                message.classList.remove('password-error');
                document.getElementById('savePasswordBtn').classList.remove('disabled');
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
                document.getElementById('savePasswordBtn').classList.add('disabled');
                return 0;
            }

            //is password strong?
            if (IsPasswordStrong(pass1.value) !== 1) {
                // specialCharDisplay. Remove the escape from backslash and quote.
                let specialCharDisplay = $.session.passwordSpecialCharacters.replaceAll(`\\\\`, `\\`);
                specialCharDisplay = specialCharDisplay.replaceAll(`\\"`, `"`);
                message.innerHTML = `Passwords must meet all of the following requirements: Be at least ${$.session.advancedPasswordLength} characters long, 
                                        have a special character(${specialCharDisplay}), have a number, and include upper and lower case letters.`;
                document.getElementById('savePasswordBtn').classList.add('disabled');
                message.classList.add('password-error');
                return 0;
            }

            //passwords match?
            if (pass1.value === '' || pass2.value === '') {
                message.innerHTML = 'Please enter and confirm a new password.'; 
                message.classList.add('password-error');
                document.getElementById('savePasswordBtn').classList.add('disabled');
                return 0;
            }
            //passwords match?
            if (pass1.value !== pass2.value) {
                message.innerHTML = 'Passwords Do Not Match!';
                message.classList.add('password-error');
                document.getElementById('savePasswordBtn').classList.add('disabled');
                return 0;
            } else {
                message.innerHTML = '';
                message.classList.remove('password-error');
                document.getElementById('savePasswordBtn').classList.remove('disabled');
                return 1;
            }
        }
        document.getElementById('savePasswordBtn').classList.remove('disabled');
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
        if (/\d/.test(password) === false) return 0;

        return 1;
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

            additionalInformation.style = 'margin-top: -10px; width: 200px;';
            const activeCheckbox = buildActiveChkBox(Active);
            activeCheckbox.style = "padding-top: 2px; margin-left: 10px;";    
            if ($.session.ResetPasswordUpdate) {  
                activeCheckbox.classList.remove('disabled'); 
                additionalInformation.classList.remove('disabled');
            } else {
                activeCheckbox.classList.add('disabled');
                additionalInformation.classList.add('disabled');
            }

            return {
                id: userID,
                endIcon: additionalInformation.outerHTML,
                secondendIcon: activeCheckbox.outerHTML,
                FirstName: FirstName,
                LastName: LastName,
                Active: Active,
                values: [userID, LastName, FirstName],
                attributes: [
                    { key: 'data-status', value: Active },
                    { key: 'data-consumer-id', value: userID },
                ],
                endIconCallback: e => {
                    if ($.session.ResetPasswordUpdate) {
                        buildChangePasswordPopup(userID, FirstName, LastName);
                    }
                },
                secondendIconCallback: e => {
                    if ($.session.ResetPasswordUpdate) {
                        setCheckUpdateUserStatus(Active, userID); 
                    } 
                },
            };
        });
        if (IsFirstLoad) {
            tempUserTableData = userTableData;
        }
        table.populate(userTable, userTableData, false, true);
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

        INACTIVE_CHKBOX.classList.add('chkBoxStyle');  
        var wrap1 = document.createElement('div');
        wrap1.classList.add('btnWrap');
        wrap1.appendChild(INACTIVE_CHKBOX);
        wrap1.appendChild(SEARCH_WRAP);

        INACTIVE_CHKBOX.addEventListener('change', event => {
            isChecked = event.target.checked;
            $.session.isActiveUsers = isChecked;
        });

        btnWrap.appendChild(wrap1);
        return btnWrap;
    }

    function setCheckForInactiveUser(input) {
        if (input.checked) {
            isChecked = true;
        } else {
            isChecked = false;
        }
        loadReviewPage(isChecked);
    }

    function setCheckUpdateUserStatus(active, id) {
        resetPasswordAjax.updateActiveInactiveUser(
            {
                isActive: active == 'Y' ? 'N' : 'Y',
                userId: id,
            },
            function (results, error) {
                populateTable(results, true);
            },
        );


        const passwordChangeConfPOPUP = POPUP.build({
            hideX: true,
        });
        const okBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(passwordChangeConfPOPUP);
                loadReviewPage(isChecked);
            },
        });
        okBtn.style.width = '100%';
        const message = document.createElement('p');
        if (active == 'Y') {
            message.innerText = 'The user has been de-activated and can no longer login to the website.';
        } else {
            message.innerText = 'The user has been reactivated and can login to the website.';
        }

        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        passwordChangeConfPOPUP.appendChild(message);
        passwordChangeConfPOPUP.appendChild(okBtn);
        okBtn.focus();
        POPUP.show(passwordChangeConfPOPUP);
    }

    function tableUserSearch(searchValue) {
        searchValue = searchValue.toLowerCase();
        displayedUsers = [];
        tempUserTableData.forEach(consumer => {
            var firstName = consumer.FirstName.toLowerCase();
            var lastName = consumer.LastName.toLowerCase();
            var userId = consumer.id.toLowerCase();
            var fullName = `${firstName} ${lastName} ${userId}`;
            var fullNameReversed = `${lastName} ${firstName} ${userId}`;
            var matchesName = fullName.indexOf(searchValue);
            var matchesNameReverse = fullNameReversed.indexOf(searchValue);

            if (matchesName !== -1 || matchesNameReverse !== -1) {
                consumerObj = {
                    User_ID: consumer.id,
                    First_Name: consumer.FirstName,
                    Last_Name: consumer.LastName,
                    Active: consumer.Active,
                };
                displayedUsers.push(consumerObj);
            }
        });
        populateTable(displayedUsers, false);
    }

    // load
    function loadReviewPage(active) {
        active = document.getElementById('chkInacive').checked;
        resetPasswordAjax.getActiveInactiveUserlist(
            {
                isActive: active == true ? 'N' : 'Y',
            },
            function (results, error) {
                populateTable(results, true);
            },
        );
    }

    return {
        init,
    };
})();
