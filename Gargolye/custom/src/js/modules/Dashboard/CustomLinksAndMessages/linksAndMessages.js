var linksAndMessages = (function () {
    var linksWidget;
    var messagesWidget;
    var links = [];
    var messages = [];

    // New System Message
    //-----------------------
    var addMessagePopup;
    var employeeDropdown;
    var EmployeeListWrap;
    var EmployeeNameList = [];
    var saveBtn;
    var cancelBtn;
    var selectMoreEmployeeBtn;
    var expirationDate;
    var expirationTime;
    var messageInput;
    let textMessage;
    let timeOfExpiration;
    let dateOfExpiration;
    let selectedEmployee = [];

    // Employee Selection Popup
    //-----------------------
    let consumerswithEmployeeIds;
    let currentconsumersSelected = [];
    let assignEmployeePopup;
    let assignBtn;
    let isMultiSelection;
    let nameHeading;
    let nameList;

    function loadCustomLinks() {
        var linksList = linksWidget.querySelector('.customLinksList');
        linksList.innerHTML = '';
        if (links.length < 1) return;
        links.forEach(l => {
            var link = document.createElement('a');
            link.href = l.linkaddress;
            link.innerHTML = l.linkname;
            link.setAttribute('target', l.linktarget);
            linksList.appendChild(link);
            if (l.linkname.indexOf('CaraSolva') !== -1) {
                link.addEventListener('click', linksAndMessagesWidgetAjax.loadCaraSolva);
            }
        });
    }

    function loadSystemMessages() {
        var messageList = messagesWidget.querySelector('.messagesList');
        messageList.innerHTML = '';
        if (messages.length < 1) return;
        messages.forEach(m => {
            var message = document.createElement('p');
            message.innerHTML = m.description;
            messageList.appendChild(message);
        });
    }

    function separateLinksAndMessages(results) {
        results.forEach(r => {
            if (r.description === '') {
                links.push(r);
            } else {
                messages.push(r);
            }
        });
    }

    function buildAddMessagePopup() {
        isMultiSelection = false;
        addMessagePopup = POPUP.build({
            id: 'sig_addMessagePopup',
            classNames: 'assignEmployeePopup',
            hideX: true,
        });

        employeeDropdown = dropdown.build({
            dropdownId: 'employeesDropdown',
            label: 'Employee to Notify',
            style: 'secondary',
        });

        selectMoreEmployeeBtn = button.build({
            text: 'Select More Employees',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                if (isMultiSelection)
                    POPUP.show(assignEmployeePopup);
                else
                    await showAssignEmployeePopup();

                saveBtn.classList.add('disabled');
                cancelBtn.classList.add('disabled');
            },
        });
        selectMoreEmployeeBtn.style.width = '100%';
        let today = UTIL.getTodaysDate(true);
        let tomorrowDate = moment(dates.addDays(today, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
        dateOfExpiration = tomorrowDate;
        expirationDate = input.build({
            id: 'expirationDate',
            type: 'date',
            label: 'Expiration Date',
            style: 'secondary',
            value: tomorrowDate,
            attributes: [
                { key: 'min', value: UTIL.getTodaysDate() },
            ],
        });
        timeOfExpiration = UTIL.getCurrentTime();
        expirationTime = input.build({
            id: 'expirationTime',
            type: 'time',
            label: 'Expiration Time',
            style: 'secondary',
            value: UTIL.getCurrentTime(),
        });

        messageInput = input.build({
            id: 'messageInput',
            type: 'textarea',
            label: 'Message',
            style: 'secondary',
            classNames: 'autosize',
        });

        saveBtn = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
        });
        cancelBtn = button.build({
            text: 'CANCEL',
            style: 'secondary',
            type: 'outlined',
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(cancelBtn);
        nameHeading = document.createElement('b');
        nameHeading.classList.add('boldfont');
        nameHeading.innerText = 'Selected Employees: ';
        nameList = document.createElement('p');
        nameList.classList.add('nameListFont');
        nameList.innerText = EmployeeNameList.toString().replace(/,/g, ', ');
        EmployeeListWrap = document.createElement('div');
        EmployeeListWrap.classList.add('nameListWrap');
        EmployeeListWrap.appendChild(nameHeading);
        EmployeeListWrap.appendChild(nameList);
        EmployeeListWrap.style.marginBottom = '10px';

        addMessagePopup.appendChild(employeeDropdown);
        addMessagePopup.appendChild(EmployeeListWrap);
        addMessagePopup.appendChild(selectMoreEmployeeBtn);
        addMessagePopup.appendChild(expirationDate);
        addMessagePopup.appendChild(expirationTime);
        addMessagePopup.appendChild(messageInput);
        addMessagePopup.appendChild(btnWrap);
        messageInput.classList.add('error');
        saveBtn.classList.add('disabled');
        eventSetup();
        populateEmployeeDropdown();
        EmployeeListWrap.style.display = 'none'; 
        POPUP.show(addMessagePopup);
    }

    function eventSetup() {
        employeeDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            selectedEmployee = [];
            currentconsumersSelected = []; 
            selectedEmployee.push(selectedOption.id);
            isMultiSelection = false;
        });
        saveBtn.addEventListener('click', async () => {
            if (selectedEmployee.length > 1)
                selectedEmployee.push($.session.UserId); 
            const result = await linksAndMessagesWidgetAjax.addSystemMessageAsync(textMessage, timeOfExpiration, dateOfExpiration, selectedEmployee);
            const { addSystemMessageResult } = result;
            if (addSystemMessageResult[0].NoteID != null) {
                POPUP.hide(addMessagePopup);
                selectedEmployee = [];
                currentconsumersSelected = [];
                EmployeeNameList = [];
                dashboard.load();
            }
        });

        cancelBtn.addEventListener('click', () => {
            selectedEmployee = [];
            currentconsumersSelected = [];
            EmployeeNameList = [];
            POPUP.hide(addMessagePopup);
        });
        messageInput.addEventListener('input', event => {
            textMessage = event.target.value;
            checkRequiredFieldsOfNewMessage();
        });
        expirationDate.addEventListener('input', event => {
            dateOfExpiration = event.target.value;
            checkRequiredFieldsOfNewMessage();
        });
        expirationTime.addEventListener('input', event => {
            timeOfExpiration = event.target.value;
            checkRequiredFieldsOfNewMessage();
        });
    }

    function checkRequiredFieldsOfNewMessage() {
        var date = expirationDate.querySelector('#expirationDate');
        var time = expirationTime.querySelector('#expirationTime');
        var message = messageInput.querySelector('#messageInput');

        if (date.value === '') {
            expirationDate.classList.add('error');
        } else {
            expirationDate.classList.remove('error');
        }

        if (time.value === '') {
            expirationTime.classList.add('error');
        } else {
            expirationTime.classList.remove('error');
        }

        if (message.value.trim() === '') {
            messageInput.classList.add('error');
        } else {
            messageInput.classList.remove('error');
        }
        setBtnStatusOfNewMessage();
    }

    function setBtnStatusOfNewMessage() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            saveBtn.classList.add('disabled');
            return;
        } else {
            saveBtn.classList.remove('disabled');
        }
    }

    async function populateEmployeeDropdown() {
        const {
            getEmployeeListResult: Employer,
        } = await linksAndMessagesWidgetAjax.getEmployersAsync();
        consumerswithEmployeeIds = Employer;
        selectedEmployee.push(Employer[0].employerId);
        let data = Employer.map((employer) => ({
            id: employer.employerId,
            value: employer.employerId,
            text: employer.employerName
        }));
        dropdown.populate("employeesDropdown", data);
    }

    function toggleAssignButton() {
        if (currentconsumersSelected.length === 0) {
            assignBtn.classList.add('disabled');
            return;
        }
        assignBtn.classList.remove('disabled');
    }

    async function showAssignEmployeePopup() {
        // Popup        
        assignEmployeePopup = POPUP.build({
            id: 'sig_assignEmployeePopup',
            classNames: 'assignEmployeePopup',
            hideX: true,
            header: 'Select Employees',
        });
        const popupMessage = document.createElement('p');
        popupMessage.classList.add('popupMessage');
        popupMessage.innerText = '*Must select at least one employee before clicking Save button.';

        const innerWrap = document.createElement('div');
        innerWrap.classList.add('peopleListWrap');

        // Consumers
        const consumersContainer = document.createElement('div');
        consumersContainer.classList.add('assignPeopleList');

        const cHeading = document.createElement('p');
        cHeading.innerText = 'Select one (or multiple) users';

        C_SEARCH_BTN = button.build({
            id: 'searchBtn',
            text: 'Search',
            icon: 'search',
            style: 'secondary',
            type: 'contained',
        });

        C_SEARCH_WRAP = document.createElement('div');
        C_SEARCH_WRAP.classList.add('consumerSearch');
        C_SEARCH_INPUT = document.createElement('input');
        C_SEARCH_INPUT.setAttribute('placeholder', 'search consumers');
        C_SEARCH_WRAP.appendChild(C_SEARCH_BTN);
        C_SEARCH_WRAP.appendChild(C_SEARCH_INPUT);
        C_filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtn',
            callback: () => {
                cnFilters.init(filterValues);
            },
        });

        const multiSelectBodyC = document.createElement('div');
        consumerswithEmployeeIds.forEach(person => {
            let consumer = document.createElement('p');
            consumer.setAttribute('data-personId', person.employerId);
            consumer.innerText = person.employerName;
            multiSelectBodyC.appendChild(consumer);

            consumer.addEventListener('click', e => {
                //* Multiple consumers can be selected
                const isSelected = e.target.classList.contains('selected');
                if (isSelected) {
                    e.target.classList.remove('selected');
                    currentconsumersSelected = currentconsumersSelected.filter(emp => emp !== person.employerId);
                    EmployeeNameList = EmployeeNameList.filter(empName => empName !== person.employerName.replace(/,/g, ''));
                } else {
                    e.target.classList.add('selected');
                    currentconsumersSelected.push(person.employerId);
                    EmployeeNameList.push(person.employerName.replace(/,/g, ''));
                }
                toggleAssignButton();
            });
        });

        consumersContainer.appendChild(cHeading);

        var C_btnWrap = document.createElement('div');
        C_btnWrap.classList.add('cnbtnWrap');
        C_btnWrap.appendChild(C_filterBtn);

        consumersContainer.appendChild(C_SEARCH_WRAP);

        consumersContainer.appendChild(multiSelectBodyC);

        C_SEARCH_BTN.addEventListener('click', event => {
            C_SEARCH_WRAP.classList.toggle('searchOpen');
            C_SEARCH_INPUT.value = '';
            C_SEARCH_INPUT.focus();
        });
        C_SEARCH_INPUT.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                consumerSearch(event.target.value);
            }
        });

        C_SEARCH_INPUT.addEventListener('input', event => {
            if (event.target.value === '') {
                consumerSearch(event.target.value);
            }
        });

        // Action Buttons
        assignBtn = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
            callback: async function () {
                selectedEmployee = [];
                selectedEmployee = currentconsumersSelected; 

                POPUP.hide(assignEmployeePopup);
                saveBtn.classList.remove('disabled');
                checkRequiredFieldsOfNewMessage();
                cancelBtn.classList.remove('disabled');
                isMultiSelection = true;
                overlay.show();
                if (selectedEmployee.length > 1) {
                    nameList.innerText = EmployeeNameList.toString().replace(/,/g, ', ');
                    EmployeeListWrap.style.display = 'block';
                    employeeDropdown.style.display = 'none'
                }
                else {
                    EmployeeListWrap.style.display = 'none';
                    employeeDropdown.style.display = 'flex'
                    document.getElementById('employeesDropdown').value = selectedEmployee[0];
                }

            },
        });
        assignBtn.classList.add('disabled');

        var cancelSelectBtn = button.build({
            text: 'CANCEL',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(assignEmployeePopup);
                saveBtn.classList.remove('disabled');
                checkRequiredFieldsOfNewMessage();
                cancelBtn.classList.remove('disabled');
                overlay.show();
                currentconsumersSelected = [];
                isMultiSelection = true;
            },
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(assignBtn);
        btnWrap.appendChild(cancelSelectBtn);
        innerWrap.appendChild(consumersContainer);
        assignEmployeePopup.appendChild(popupMessage);
        assignEmployeePopup.appendChild(innerWrap);
        assignEmployeePopup.appendChild(btnWrap);
        POPUP.show(assignEmployeePopup);
    }

    function consumerSearch(searchValue) {
        searchValue = searchValue.toLowerCase();
        // gather all names shown
        //reset the array containing list of consumers that are being displayed 
        displayedConsumers = [searchValue];
        consumerswithEmployeeIds.forEach(consumer => {
            var fullName = consumer.employerName.toLowerCase();
            var matchesName = fullName.indexOf(searchValue);
            var thisConsumer = document.querySelector(`[data-personid="${consumer.employerId}"]`);

            if (matchesName !== -1) {
                thisConsumer.classList.remove('hidden');
                displayedConsumers.push(consumer.employerId);
            } else {
                thisConsumer.classList.add('hidden');
                var index = displayedConsumers.indexOf(consumer.employerId);
                if (index > -1) displayedConsumers.splice(index, 1);
            }
        });
    }

    function init() {
        messagesWidget = document.getElementById('dashsystemmessagewidget');
        linksWidget = document.getElementById('dashcustomlinks');

        // append add message button
        dashboard.appendAddMessageButton('dashsystemmessagewidget', 'addMessageFilterBtn');

        if (links.length > 0 || messages.length > 0) {
            links = [];
            messages = [];
        }
        linksAndMessagesWidgetAjax.getSystemMessagesAndCustomLinks(function (results, error) {
            if (error) {
                var messageError = messagesWidget.querySelector('.widget__error');
                var linkError = linksWidget.querySelector('.widget__error');
                messageError.classList.add('visible');
                linkError.classList.add('visible');
                return;
            }
            separateLinksAndMessages(results);
            loadSystemMessages();
            loadCustomLinks();
        });
    }

    return {
        init,
        buildAddMessagePopup
    }
}());