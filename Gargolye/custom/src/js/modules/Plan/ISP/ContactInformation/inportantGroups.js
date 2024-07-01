const isp_ci_importantGroups = (() => {
    let cID;
    let rawGroupsTableData;
    let readOnly;
    let statusDropdown
    let nameInput
    let addressInput
    let phoneInput
    let saveBtn

    function tablePopup(popupData, isNew) {
        const popup = POPUP.build({ id: 'isp-ciig-mainPopup' });

        async function saveData() {
            popup.style.display = 'none';
            pendingSave.show('Saving...');

            const statusDD = document.getElementById('isp-ciig-statusDropdown');
            const statusVal = statusDD.options[statusDD.selectedIndex].value;
            const nameVal = document.getElementById('isp-ciig-nameInput').value;
            const addressVal = document.getElementById('isp-ciig-addressInput').value;
            const phoneVal = contactInformation.formatPhone(document.getElementById('isp-ciig-phoneInput').value).val;
            const meetingInfoVal = document.getElementById('isp-ciig-meetingInfoInput').value;
            const whoHelpsVal = document.getElementById('isp-ciig-whoHelpsInput').value;

            if (isNew) {
                //Insert
                // UNSAVABLE NOTE TEXT IS REMOVED IN BACKEND ON INSERTS
                const data = {
                    token: $.session.Token,
                    contactId: cID,
                    status: statusVal,
                    name: nameVal,
                    address: addressVal,
                    phone: phoneVal,
                    meetingInfo: meetingInfoVal,
                    whoHelps: whoHelpsVal,
                }
                const importantGroupId = await contactInformationAjax.insertPlanContactImportantGroup(data);
                data.importantGroupId = importantGroupId;
                data.token = null;
                table.addRows('isp_ci_importantGroupsTable', [{
                    values: [statusVal, nameVal, addressVal, UTIL.formatPhoneNumber(phoneVal), meetingInfoVal, whoHelpsVal],
                    id: `ci-impGroups-${data.importantGroupId}`,
                    onClick: () => {
                        tablePopup(data, false);
                    },
                }], true)
            } else {
                //Update
                const data = {
                    token: $.session.Token,
                    importantGroupId: popupData.importantGroupId,
                    status: statusVal,
                    name: UTIL.removeUnsavableNoteText(nameVal),
                    address: UTIL.removeUnsavableNoteText(addressVal),
                    phone: UTIL.removeUnsavableNoteText(phoneVal),
                    meetingInfo: UTIL.removeUnsavableNoteText(meetingInfoVal),
                    whoHelps: UTIL.removeUnsavableNoteText(whoHelpsVal),
                }
                await contactInformationAjax.updatePlanContactImportantGroup(data);
                data.token = null;
                table.updateRows('isp_ci_importantGroupsTable', [{
                    values: [statusVal, nameVal, addressVal, UTIL.formatPhoneNumber(phoneVal), meetingInfoVal, whoHelpsVal],
                    id: `ci-impGroups-${popupData.importantGroupId}`,
                    onClick: () => {
                        tablePopup(data, false);
                    },
                }], true)
            }
            pendingSave.fulfill('Saved');
            setTimeout(() => {
                const savePopup = document.querySelector('.successfulSavePopup');
                DOM.ACTIONCENTER.removeChild(savePopup);
                POPUP.hide(popup);
            }, 700);
        }

        async function deleteData() {
            const data = {
                token: $.session.Token,
                importantId: popupData.importantGroupId,
                type: 1
            }
            const tableRow = document.getElementById(`ci-impGroups-${popupData.importantGroupId}`)
            tableRow.remove()
            await contactInformationAjax.deletePlanContactImportant(data)
        }

        if (isNew) {
            popupData = {
                status: '',
                name: '',
                address: '',
                phone: '',
                meetingInfo: '',
                whoHelps: '',
            }
        }
        statusDropdown = dropdown.build({
            dropdownId: 'isp-ciig-statusDropdown',
            label: 'Status',
            readonly: readOnly,
        });
        if (popupData.status === '') statusDropdown.classList.add('error');

        const statusDropdownValues = [
            { text: '', value: '' },
            { text: 'Current', value: 'Current' },
            { text: 'New/Interested In', value: 'New/Interested In' },
        ];

        dropdown.populate(statusDropdown, statusDropdownValues, popupData.status);

        nameInput = input.build({
            label: 'Name',
            value: popupData.name,
            id: `isp-ciig-nameInput`,
            readonly: readOnly,
        });
        if (popupData.name === '') nameInput.classList.add('error');

        addressInput = input.build({
            label: 'Address',
            value: popupData.address,
            id: `isp-ciig-addressInput`,
            type: 'textarea',
            readonly: readOnly,
            classNames: 'autosize',
        });
        if (popupData.address === '') addressInput.classList.add('error');

        phoneInput = input.build({
            label: 'Phone',
            value: UTIL.formatPhoneNumber(popupData.phone),
            id: `isp-ciig-phoneInput`,
            readonly: readOnly,
            attributes: [
                { key: 'maxlength', value: '12' },
                { key: 'pattern', value: '[0-9]{3}-[0-9]{3}-[0-9]{4}' },
                { key: 'placeholder', value: '888-888-8888' },
            ],
        });
        if (popupData.phone === '') phoneInput.classList.add('error');

        const meetingInfoInput = input.build({
            label: 'When / Meeting Info',
            value: popupData.meetingInfo,
            id: `isp-ciig-meetingInfoInput`,
            readonly: readOnly,
        });
        const whoHelpsInput = input.build({
            label: 'Who Helps',
            value: popupData.whoHelps,
            id: `isp-ciig-whoHelpsInput`,
            readonly: readOnly,
        });

        saveBtn = button.build({
            text: 'save',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                saveData()
            }
        });
        const cancelBtn = button.build({
            text: 'cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(popup)
            }
        });
        const deleteBtn = button.build({
            text: 'delete',
            style: 'danger',
            type: 'contained',
            callback: () => {
                popup.style.display = 'none';
                UTIL.warningPopup({
                    message: 'Are you sure you would like to delete this entry?',
                    accept: {
                        text: 'Yes',
                        callback: () => {
                            deleteData()
                            POPUP.hide(popup)
                        },
                    },
                    reject: {
                        text: 'No',
                        callback: () => {
                            overlay.show();
                            popup.style.removeProperty('display');
                        },
                    },
                });
            }
        });

        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        const btnWrap2 = document.createElement('div');
        btnWrap2.classList.add('btnWrap');


        if (isNew) {
            btnWrap.appendChild(saveBtn);
            btnWrap.appendChild(cancelBtn);
        } else if (readOnly) {
            btnWrap.appendChild(cancelBtn);
        } else if (!isNew) {
            btnWrap.appendChild(saveBtn);
            btnWrap.appendChild(deleteBtn);
            btnWrap2.appendChild(cancelBtn);
        }

        popup.appendChild(statusDropdown);
        popup.appendChild(nameInput);
        popup.appendChild(addressInput);
        popup.appendChild(phoneInput);
        popup.appendChild(meetingInfoInput);
        popup.appendChild(whoHelpsInput);
        popup.appendChild(btnWrap);
        if (!isNew && !readOnly) popup.appendChild(btnWrap2);

        setupEvents();

        POPUP.show(popup);
        checkForErrors()
        DOM.autosizeTextarea();

    }

    function setupEvents() {
        phoneInput.addEventListener('input', event => {
            if (event.target.value !== "" && contactInformation.validatePhone(event.target.value)) {
                const phnDisp = contactInformation.formatPhone(event.target.value).disp;
                event.target.value = phnDisp;
                phoneInput.classList.remove('error');
            } else {
                phoneInput.classList.add('error');
            }
            checkForErrors()
        });
        statusDropdown.addEventListener('change', event => {
            if (event.target.value === "") {
                statusDropdown.classList.add('error')
            } else {
                statusDropdown.classList.remove('error')
            }
            checkForErrors()
        });
        nameInput.addEventListener('input', event => {
            if (event.target.value === "") {
                nameInput.classList.add('error')
            } else {
                nameInput.classList.remove('error')
            }
            checkForErrors()
        });
        addressInput.addEventListener('input', event => {
            if (event.target.value === "") {
                addressInput.classList.add('error')
            } else {
                addressInput.classList.remove('error')
            }
            checkForErrors()
        });
    }

    function checkForErrors() {
        const errors = document.getElementById('isp-ciig-mainPopup').querySelectorAll('.error');
        if (errors.length > 0) {
            saveBtn.classList.add('disabled')
        } else saveBtn.classList.remove('disabled')
    }

    function buildTableMarkup() {
        const peopleTable = table.build({
            tableId: 'isp_ci_importantGroupsTable',
            headline: 'Important Clubs, Groups, and Organizations',
            columnHeadings: ['Status', 'Name', 'Address', 'Phone', 'Meeting info', 'Who helps'],
            sortable: true,
            onSortCallback: res => {
                contactInformationAjax.updatePlanContactImportantOrder({
                    contactId: cID,
                    importantId: res.row.id.split("-")[2],
                    newPos: res.newIndex,
                    oldPos: res.oldIndex,
                    type: 1
                })
            }
        });

        // Set the data type for each header, for sorting purposes
        let number = 0;
        const headers = peopleTable.querySelectorAll('.header div');
        if (headers.length > 6)
            number = 1;
        headers[0 + number].setAttribute('data-type', 'string'); // Status
        headers[1 + number].setAttribute('data-type', 'string'); // Name
        headers[2 + number].setAttribute('data-type', 'string'); // Address
        headers[3 + number].setAttribute('data-type', 'number'); // Phone
        headers[4 + number].setAttribute('data-type', 'string'); // Meeting info
        headers[5 + number].setAttribute('data-type', 'string'); // Who helps

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(peopleTable);


        if (readOnly) peopleTable.classList.add('disableDrag');

        if (rawGroupsTableData) {
            const tableData = rawGroupsTableData.map(d => {
                return {
                    values: [d.status, d.name, d.address, UTIL.formatPhoneNumber(d.phone), d.meetingInfo, d.whoHelps],
                    id: `ci-impGroups-${d.importantGroupId}`,
                    onClick: () => {
                        tablePopup(d, false)
                    }
                }
            });
            table.populate(peopleTable, tableData, true)
        }

        return peopleTable
    }

    function buildSection(tableData, contactId, ro) {
        readOnly = ro;
        cID = contactId;
        rawGroupsTableData = tableData;

        const igSection = document.createElement('div');
        const addGroupBtn = button.build({
            text: 'Add Club/Group/Organization',
            style: 'secondary',
            type: 'contained',
            callback: () => tablePopup(null, true)
        })
        if (readOnly) addGroupBtn.classList.add('disabled');

        const table = buildTableMarkup()

        igSection.appendChild(table);
        igSection.appendChild(addGroupBtn);

        return igSection
    }

    return {
        buildSection
    }
})();