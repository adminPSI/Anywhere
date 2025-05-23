const isp_ci_importantPlaces = (() => {
    let cID;
    let rawPlacesTableData;
    let readOnly;
    let typeDropdown;
    let typeOtherInput;
    let nameInput;
    let addressInput;
    let phoneInput;
    let saveBtn;
    let vendors;
    let importFromVendorBtn

    function popFromVendors() {
        const mainPopup = document.getElementById('isp-ciip-mainPopup');
        mainPopup.style.display = 'none';

        const importVendorPopup = POPUP.build({
            id: 'isp-ciip-importVendorPopup',
            closeCallback: () => {
                overlay.show();
                mainPopup.style.removeProperty('display');
            },
        });
        const vendorSection = document.createElement('div');

        vendors.forEach(rel => {
            const cityStateZip = contactInformation.cleanCityStateZip(rel);
            const vendorDisp = document.createElement('div');
            vendorDisp.innerHTML = `Name: <span>${rel.name}</span>`;
            vendorDisp.classList.add('isp_ciip_gkRelationships');

            vendorDisp.addEventListener('click', () =>
                applyVendor({
                    name: rel.name,
                    address: rel.address,
                    cityStateZip: cityStateZip,
                    phone: rel.phone,
                    popup: importVendorPopup,
                }),
            );

            vendorSection.appendChild(vendorDisp);
        });

        importVendorPopup.appendChild(vendorSection);
        POPUP.show(importVendorPopup);
    }

    function applyVendor(opts) {
        POPUP.hide(opts.popup);
        overlay.show();
        const mainPopup = document.getElementById('isp-ciip-mainPopup');
        mainPopup.style.removeProperty('display');

        let joinedAddress = '';

        if (opts.address !== '') {
            joinedAddress = opts.address;
        }
        if (opts.cityStateZip !== '') {
            joinedAddress += '\n' + opts.cityStateZip;
        }

        const phoneDisp = contactInformation.formatPhone(opts.phone.trim()).disp;
        // NAME
        nameInput.querySelector('input').value = opts.name;
        if (opts.name === '') {
            nameInput.classList.add('error');
        } else {
            nameInput.classList.remove('error');
        }
        // Address
        addressInput.querySelector('textarea').value = joinedAddress.trim();
        if (joinedAddress.trim() === '') {
            addressInput.classList.add('error');
        } else {
            addressInput.classList.remove('error');
        }
        // PHONE
        phoneInput.querySelector('input').value = phoneDisp;
        if (phoneDisp === '') {
            phoneInput.classList.add('error');
        } else {
            phoneInput.classList.remove('error');
        }

        checkForErrors();
    }

    function tablePopup(popupData, isNew) {
        const popup = POPUP.build({ id: 'isp-ciip-mainPopup' });

        async function saveData() {
            popup.style.display = 'none';
            pendingSave.show('Saving...');

            const typeDD = document.getElementById('isp-ciip-typeDropdown');
            const typeVal = typeDD.options[typeDD.selectedIndex].value;
            const nameVal = document.getElementById('isp-ciip-nameInput').value;
            const addressVal = document.getElementById('isp-ciip-addressInput').value;
            const phoneVal = contactInformation.formatPhone(
                document.getElementById('isp-ciip-phoneInput').value,
            ).val;
            const scheduleVal = document.getElementById('isp-ciip-scheduleInput').value;
            const acuityVal = document.getElementById('isp-ciip-acuityInput').value;
            const typeOtherVal = document.getElementById('isp-ciip-typeOther').value;

            if (isNew) {
                //Insert
                // UNSAVABLE NOTE TEXT IS REMOVED IN BACKEND ON INSERTS
                const data = {
                    token: $.session.Token,
                    contactId: cID,
                    type: typeVal,
                    name: nameVal,
                    address: addressVal,
                    phone: phoneVal,
                    schedule: scheduleVal,
                    acuity: acuityVal,
                    typeOther: typeOtherVal,
                };
                const insertId = await contactInformationAjax.insertPlanContactImportantPlaces(data);
                data.importantPlacesId = insertId;
                data.token = null;
                let typeValueUpdate = typeVal;
                if (typeVal == 'Other' && typeOtherVal != '') {
                    typeValueUpdate = typeVal + ' - ' + typeOtherVal;
                }

                table.addRows(
                    'isp_ci_importanPlacesTable',
                    [
                        {
                            values: [
                                typeValueUpdate,
                                nameVal,
                                addressVal,
                                UTIL.formatPhoneNumber(phoneVal),
                                scheduleVal,
                                acuityVal,
                            ],
                            id: `ci-impPlace-${insertId}`,
                            onClick: () => {
                                tablePopup(data, false);
                            },
                        },
                    ],
                    true,
                );
            } else {
                //Update
                const data = {
                    token: $.session.Token,
                    importantPlacesId: popupData.importantPlacesId,
                    type: typeVal,
                    name: UTIL.removeUnsavableNoteText(nameVal),
                    address: UTIL.removeUnsavableNoteText(addressVal),
                    phone: UTIL.removeUnsavableNoteText(phoneVal),
                    schedule: UTIL.removeUnsavableNoteText(scheduleVal),
                    acuity: UTIL.removeUnsavableNoteText(acuityVal),
                    typeOther: UTIL.removeUnsavableNoteText(typeOtherVal),
                };
                await contactInformationAjax.updatePlanContactImportantPlaces(data);

                // Validation check for rows with type other. places red '!' in row if no value is typeOther
                if (typeVal === 'Other' && typeOtherVal === '') {
                    typeValValidated =
                        `<span style="color: red; position: relative; top: 3px;"><span style="display: inline-block; width: 20px; height: 20px;">${icons.error}</span></span> ${typeVal}`;
                } else {
                    typeValValidated = typeVal;
                }

                data.token = null;
                let typeValueUpdate = typeValValidated;
                if (typeVal == 'Other' && typeOtherVal != '') {
                    typeValueUpdate = typeValValidated + ' - ' + typeOtherVal;
                }

                table.updateRows(
                    'isp_ci_importanPlacesTable',
                    [
                        {
                            values: [
                                typeValueUpdate,
                                nameVal,
                                addressVal,
                                UTIL.formatPhoneNumber(phoneVal),
                                scheduleVal,
                                acuityVal,
                            ],
                            id: `ci-impPlace-${popupData.importantPlacesId}`,
                            onClick: () => {
                                tablePopup(data, false);
                            },
                        },
                    ],
                    true,
                );
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
                importantId: popupData.importantPlacesId,
                type: 3,
            };
            const tableRow = document.getElementById(`ci-impPlace-${popupData.importantPlacesId}`);
            tableRow.remove();
            await contactInformationAjax.deletePlanContactImportant(data);
        }

        if (isNew) {
            popupData = {
                type: '',
                typeOther: '',
                name: '',
                address: '',
                phone: '',
                schedule: '',
                acuity: '',
            };
        }
        typeDropdown = dropdown.build({
            dropdownId: 'isp-ciip-typeDropdown',
            label: '*Type',
            readonly: readOnly,
        });
        if (popupData.type === '') typeDropdown.classList.add('error');

        const typeDropdownValues = [
            { text: '', value: '' },
            { text: 'ADS Provider', value: 'ADS Provider' },
            { text: 'Day Provider', value: 'Day Provider' },
            { text: 'Other', value: 'Other' },
            { text: 'Primary Hospital', value: 'Primary Hospital' },
            { text: 'School', value: 'School' },
            { text: 'Work', value: 'Work' },
        ];

        if (popupData.type.includes('Other')) {
            popupData.type = 'Other';
        }
        dropdown.populate(typeDropdown, typeDropdownValues, popupData.type);

        typeOtherInput = input.build({
            label: '*Type Other',
            value: popupData.typeOther,
            id: `isp-ciip-typeOther`,
            readonly: readOnly,
            type: 'textarea',
            charLimit: 100,
            forceCharLimit: true,
            classNames: 'autosize',
        });
        if (popupData.type !== 'Other') {
            typeOtherInput.classList.add('disabled');
        } else {
            if (popupData.typeOther === '') typeOtherInput.classList.add('error');
        }

        importFromVendorBtn = button.build({
            text: 'IMPORT FROM VENDORS',
            type: 'contained',
            style: 'secondary',
            callback: () => {
                popFromVendors();
            },
        });
        importFromVendorBtn.style.width = '100%';

        nameInput = input.build({
            label: '*Name',
            value: popupData.name,
            id: `isp-ciip-nameInput`,
            readonly: readOnly,
        });
        if (popupData.name === '') nameInput.classList.add('error');

        addressInput = input.build({
            label: '*Address',
            value: popupData.address,
            id: `isp-ciip-addressInput`,
            type: 'textarea',
            readonly: readOnly,
            classNames: 'autosize',
        });
        if (popupData.address === '') addressInput.classList.add('error');

        phoneInput = input.build({
            label: '*Phone',
            value: UTIL.formatPhoneNumber(popupData.phone),
            id: `isp-ciip-phoneInput`,
            readonly: readOnly,
            attributes: [
                { key: 'maxlength', value: '12' },
                { key: 'pattern', value: '[0-9]{3}-[0-9]{3}-[0-9]{4}' },
                { key: 'placeholder', value: '888-888-8888' },
            ],
        });
        if (popupData.phone === '') phoneInput.classList.add('error');

        const scheduleInput = input.build({
            label: 'Schedule',
            value: popupData.schedule,
            id: `isp-ciip-scheduleInput`,
            readonly: readOnly,
        });
        const acuityInput = input.build({
            label: 'Acuity',
            value: popupData.acuity,
            id: `isp-ciip-acuityInput`,
            readonly: readOnly,
        });

        saveBtn = button.build({
            text: 'save',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                await saveData();
                await planValidation.contactsValidationCheck();
            },
        });
        const cancelBtn = button.build({
            text: 'cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(popup);
            },
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
                        callback: async () => {
                            await deleteData();
                            POPUP.hide(popup);
                            await planValidation.contactsValidationCheck();
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
            },
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
        popup.appendChild(typeDropdown);
        popup.appendChild(typeOtherInput);
        popup.appendChild(importFromVendorBtn);
        popup.appendChild(nameInput);
        popup.appendChild(addressInput);
        popup.appendChild(phoneInput);
        popup.appendChild(scheduleInput);
        popup.appendChild(acuityInput);
        popup.appendChild(btnWrap);
        if (!isNew && !readOnly) popup.appendChild(btnWrap2);

        setupEvents();

        POPUP.show(popup);
        checkForErrors();
        DOM.autosizeTextarea();
    }

    function setupEvents() {
        phoneInput.addEventListener('input', event => {
            if (event.target.value !== '' && contactInformation.validatePhone(event.target.value)) {
                const phnDisp = contactInformation.formatPhone(event.target.value).disp;
                event.target.value = phnDisp;
                phoneInput.classList.remove('error');
            } else {
                phoneInput.classList.add('error');
            }
            checkForErrors();
        });
        typeDropdown.addEventListener('change', event => {
            if (event.target.value === '') {
                typeDropdown.classList.add('error');
            } else {
                typeDropdown.classList.remove('error');
            }

            if (event.target.value !== 'Other') {
                typeOtherInput.classList.remove('error');
                typeOtherInput.classList.add('disabled');
                typeOtherInput.querySelector('textarea').value = '';
            } else {
                typeOtherInput.classList.remove('disabled');
                typeOtherInput.classList.add('error');
            }
            checkForErrors();
        });
        typeOtherInput.addEventListener('input', event => {
            if (event.target.value.trim() === '') {
                typeOtherInput.classList.add('error');
            } else {
                typeOtherInput.classList.remove('error');
            }
            checkForErrors();
        });
        nameInput.addEventListener('input', event => {
            if (event.target.value === '') {
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            checkForErrors();
        });
        addressInput.addEventListener('input', event => {
            if (event.target.value === '') {
                addressInput.classList.add('error');
            } else {
                addressInput.classList.remove('error');
            }
            checkForErrors();
        });
    }

    function checkForErrors() {
        const errors = document.getElementById('isp-ciip-mainPopup').querySelectorAll('.error');
        if (errors.length > 0) {
            saveBtn.classList.add('disabled');
            saveBtn.disabled = true;
        } else {
            saveBtn.classList.remove('disabled');
            saveBtn.disabled = false;
        }
    }

    function buildTableMarkup() {
        const placesTable = table.build({
            tableId: 'isp_ci_importanPlacesTable',
            headline: 'Important Places',
            columnHeadings: ['Type', 'Name', 'Address', 'Phone', 'Schedule', 'Acuity'],
            sortable: true,
            onSortCallback: res => {
                contactInformationAjax.updatePlanContactImportantOrder({
                    contactId: cID,
                    importantId: res.row.id.split('-')[2],
                    newPos: res.newIndex,
                    oldPos: res.oldIndex,
                    type: 3,
                });
            },
        });

        // Set the data type for each header, for sorting purposes
        let number = 0;
        const headers = placesTable.querySelectorAll('.header div');
        if (headers.length > 6)
            number = 1;
        headers[0 + number].setAttribute('data-type', 'string'); // Type
        headers[1 + number].setAttribute('data-type', 'string'); // Name
        headers[2 + number].setAttribute('data-type', 'string'); // Address
        headers[3 + number].setAttribute('data-type', 'number'); // Phone
        headers[4 + number].setAttribute('data-type', 'string'); // Schedule
        headers[5 + number].setAttribute('data-type', 'string'); // Acuity

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(placesTable);


        if (readOnly) placesTable.classList.add('disableDrag');

        if (rawPlacesTableData) {
            const tableData = rawPlacesTableData.map(d => {
                // Validation check for rows with type other. places red '!' in row if no value is typeOther
                if (d.type === 'Other' && d.typeOther === '') {
                    d.typeValidated =
                        `<span style="color: red; position: relative; top: 3px;"><span style="display: inline-block; width: 20px; height: 20px;">${icons.error}</span></span> ${d.type}`;
                } else {
                    d.typeValidated = d.type;
                }

                return {
                    values: [
                        d.typeValidated,
                        d.name,
                        d.address,
                        UTIL.formatPhoneNumber(d.phone),
                        d.schedule,
                        d.acuity,
                    ],
                    id: `ci-impPlace-${d.importantPlacesId}`,
                    onClick: () => {
                        tablePopup(d, false);
                    },
                };
            });
            table.populate(placesTable, tableData, true);
        }

        return placesTable;
    }

    function buildSection(tableData, contactId, ro, activeVendors) {
        readOnly = ro;
        cID = contactId;
        rawPlacesTableData = tableData;
        vendors = activeVendors;
        const ipSection = document.createElement('div');

        const addPlaceBtn = button.build({
            text: 'Add Place',
            style: 'secondary',
            type: 'contained',
            callback: () => tablePopup(null, true),
        });
        if (readOnly) addPlaceBtn.classList.add('disabled');

        const table = buildTableMarkup();
        ipSection.appendChild(table);
        ipSection.appendChild(addPlaceBtn)

        return ipSection;
    }

    return {
        buildSection,
    };
})();
