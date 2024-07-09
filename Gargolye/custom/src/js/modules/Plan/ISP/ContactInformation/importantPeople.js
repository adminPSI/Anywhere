const isp_ci_importantPeople = (() => {
    let cID;
    let rawPeopleTableData;
    let gkRelationships;
    let readOnly;
    let nameInput;
    let relationshipInput;
    let addressInput;
    let phoneInput;
    let phoneInput2;
    let phoneExt;
    let phone2Ext;
    let emailInput;
    let typeDropdown;
    let typeOtherInput;
    let saveBtn;

    function popFromRelationships() {
        const mainPopup = document.getElementById('isp-ciip-mainPopup');
        mainPopup.style.display = 'none';

        const importPopup = POPUP.build({
            id: 'isp-ciip-importPopup',
            closeCallback: () => {
                overlay.show();
                mainPopup.style.removeProperty('display');
            },
        });
        const relationshipSection = document.createElement('div');

        gkRelationships.forEach(rel => {
            const name = contactInformation.cleanName(rel);
            const address = contactInformation.cleanAddress(rel, true);
            const cityStateZip = contactInformation.cleanCityStateZip(rel);

            const relationshipDisp = document.createElement('div');
            // relationshipDisp.innerHTML = `Name: <span>${name}</span><br>Relationship: <span>${rel.relationship}</span>`;
            relationshipDisp.innerHTML = `Name: <span>${name}</span>`;
            relationshipDisp.classList.add('isp_ciip_gkRelationships');

            relationshipDisp.addEventListener('click', () =>
                applyGKRelationship({
                    name: name,
                    relationship: rel.relationship,
                    address: address,
                    cityStateZip: cityStateZip,
                    phone: rel.phone,
                    popup: importPopup,
                    email: rel.email,
                }),
            );

            relationshipSection.appendChild(relationshipDisp);
        });

        importPopup.appendChild(relationshipSection);
        POPUP.show(importPopup);
    }
    function popFromSignatures() {
        const mainPopup = document.getElementById('isp-ciip-mainPopup');
        mainPopup.style.display = 'none';

        const importPopup = POPUP.build({
            id: 'isp-ciip-importPopup2',
            closeCallback: () => {
                overlay.show();
                mainPopup.style.removeProperty('display');
            },
        });
        const signaturesSection = document.createElement('div');

        const signatureNames = planConsentAndSign.getNames();
        signatureNames.forEach(name => {
            const sigDiv = document.createElement('div');
            sigDiv.innerHTML = `Name: <span>${name}</span>`;
            sigDiv.classList.add('isp_ciip_gkSignautres');

            sigDiv.addEventListener('click', () => {
                POPUP.hide(importPopup);
                overlay.show();
                const mainPopup = document.getElementById('isp-ciip-mainPopup');
                mainPopup.style.removeProperty('display');

                nameInput.querySelector('input').value = name;
                if (name === '') {
                    nameInput.classList.add('error');
                } else {
                    nameInput.classList.remove('error');
                }

                checkForErrors();
            });

            signaturesSection.appendChild(sigDiv);
        });

        importPopup.appendChild(signaturesSection);
        POPUP.show(importPopup);
    }

    function applyGKRelationship(opts) {
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
        // RELATIONSHIP
        // relationshipInput.querySelector('input').value = opts.relationship;
        // if (opts.relationship === '') {
        //   relationshipInput.classList.add('error');
        // } else {
        //   relationshipInput.classList.remove('error');
        // }
        // ADDRESS
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
            const relationshipVal = '';
            const addressVal = document.getElementById('isp-ciip-addressInput').value;
            const phoneVal = contactInformation.formatPhone(
                document.getElementById('isp-ciip-phoneInput').value,
            ).val;
            const phoneVal2 = contactInformation.formatPhone(
                document.getElementById('isp-ciip-phoneInput2').value,
            ).val;
            const extVal = document.getElementById('isp-ciip-extinput').value;
            const extVal2 = document.getElementById('isp-ciip-extinput2').value;
            const emailVal = document.getElementById('isp-ciip-emailInput').value;
            const typeOtherVal = document.getElementById('isp-ciip-typeOther').value;


            let thisPhone = (extVal !== '') ? UTIL.formatPhoneNumber(phoneVal) + '  ext. ' + extVal : UTIL.formatPhoneNumber(phoneVal);
            let thisPhone2 = (phoneVal2 !== '') ? UTIL.formatPhoneNumber(phoneVal2) : '';
            thisPhone2 = (extVal2 !== '') ? UTIL.formatPhoneNumber(phoneVal2) + '  ext. ' + extVal2 : UTIL.formatPhoneNumber(phoneVal2);


            if (isNew) {
                //Insert
                // UNSAVABLE NOTE TEXT IS REMOVED IN BACKEND ON INSERTS
                const data = {
                    token: $.session.Token,
                    contactId: cID,
                    type: typeVal,
                    name: nameVal,
                    relationship: relationshipVal,
                    address: addressVal,
                    phone: phoneVal,
                    phone2: phoneVal2,
                    phoneExt: extVal,
                    phone2Ext: extVal2,
                    email: emailVal,
                    typeOther: typeOtherVal,
                };
                const importantPersonId = await contactInformationAjax.insertPlanContactImportantPeople(
                    data,
                );
                data.importantPersonId = importantPersonId;
                data.token = null;

                let typeValueUpdate = typeVal;
                if (typeVal == 'Other' && typeOtherVal != '') {
                    typeValueUpdate = typeVal + ' - ' + typeOtherVal;
                }

                table.addRows(
                    'isp_ci_importantPeopleTable',
                    [
                        {
                            values: [typeValueUpdate, nameVal, addressVal, emailVal, thisPhone + '\n' + thisPhone2],
                            id: `ci-impPeople-${importantPersonId}`,
                            onClick: () => {
                                tablePopup(data, false);
                            },
                        },
                    ],
                    true,
                );
            } else {
                //Update

                // Validation check for rows with type other. places red '!' in row if no value is typeOther
                if (typeVal === 'Other' && typeOtherVal === '') {
                    typeValValidated =
                        `<span style="color: red; position: relative; top: 3px;"><span style="display: inline-block; width: 20px; height: 20px;">${icons.error}</span></span> ${typeVal}`;
                } else {
                    typeValValidated = typeVal;
                }

                const data = {
                    token: $.session.Token,
                    importantPersonId: popupData.importantPersonId,
                    type: typeVal,
                    name: UTIL.removeUnsavableNoteText(nameVal),
                    relationship: UTIL.removeUnsavableNoteText(relationshipVal),
                    address: UTIL.removeUnsavableNoteText(addressVal),
                    phone: UTIL.removeUnsavableNoteText(phoneVal),
                    phone2: UTIL.removeUnsavableNoteText(phoneVal2),
                    phoneExt: extVal,
                    phone2Ext: extVal2,
                    email: emailVal,
                    typeOther: UTIL.removeUnsavableNoteText(typeOtherVal),
                };
                await contactInformationAjax.updatePlanContactImportantPeople(data);
                data.token = null;

                let typeValueUpdate = typeValValidated;
                if (typeVal == 'Other' && typeOtherVal != '') {
                    typeValueUpdate = typeValValidated + ' - ' + typeOtherVal;
                }

                table.updateRows(
                    'isp_ci_importantPeopleTable',
                    [

                        {

                            values: [typeValueUpdate, nameVal, addressVal, emailVal, thisPhone + '\n' + thisPhone2],
                            id: `ci-impPeople-${popupData.importantPersonId}`,
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
                importantId: popupData.importantPersonId,
                type: 2,
            };
            const tableRow = document.getElementById(`ci-impPeople-${popupData.importantPersonId}`);
            tableRow.remove();
            await contactInformationAjax.deletePlanContactImportant(data);
        }

        if (isNew) {
            popupData = {
                type: '',
                typeOther: '',
                name: '',
                relationship: '',
                address: '',
                phone: '',
                email: '',
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
            { text: 'Case Manager', value: 'Case Manager' },
            { text: 'Emergency Contact', value: 'Emergency Contact' },
            { text: 'Family', value: 'Family' },
            { text: 'Friend', value: 'Friend' },
            { text: 'Guardian of Person', value: 'Guardian of Person' },
            { text: 'Guardian of Estate', value: 'Guardian of Estate' },
            { text: 'Guardian of Person AND Estate', value: 'Guardian of Person AND Estate' },
            { text: 'Home Provider', value: 'Home Provider' },
            { text: 'Medical Provider', value: 'Medical Provider' },
            { text: 'Other', value: 'Other' },
            { text: 'Partner', value: 'Partner' },
            { text: 'Payee', value: 'Payee' },
            { text: 'Primary Doctor', value: 'Primary Doctor' },
            { text: 'Support Broker', value: 'Support Broker' },
        ];

        if (popupData.type.includes('Other')) {
            popupData.type = 'Other';
        }
        dropdown.populate(typeDropdown, typeDropdownValues, popupData.type);

        typeOtherInput = input.build({
            label: 'Type Other',
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

        const importFromRelationshipsBtn = button.build({
            text: 'Import from Relationships',
            type: 'contained',
            style: 'secondary',
            callback: () => {
                popFromRelationships();
            },
        });
        importFromRelationshipsBtn.style.width = '100%';
        const importFromSignaturesBtn = button.build({
            text: 'Import from Signatures',
            type: 'contained',
            style: 'secondary',
            callback: () => {
                popFromSignatures();
            },
        });
        importFromSignaturesBtn.style.width = '100%';

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
            type: 'textarea',
            id: `isp-ciip-addressInput`,
            readonly: readOnly,
            classNames: 'autosize',
        });
        if (popupData.address === '') addressInput.classList.add('error');

        phoneInput = input.build({
            label: '*Phone',
            value: UTIL.formatPhoneNumber(popupData.phone),
            id: `isp-ciip-phoneInput`,
            readonly: readOnly,
            type: 'tel',
            attributes: [
                { key: 'maxlength', value: '12' },
                { key: 'pattern', value: '[0-9]{3}-[0-9]{3}-[0-9]{4}' },
                { key: 'placeholder', value: '888-888-8888' },
            ],
        });
        if (popupData.phone === '') phoneInput.classList.add('error');

        phoneInput2 = input.build({
            label: 'Phone 2',
            value: UTIL.formatPhoneNumber(popupData.phone2),
            id: `isp-ciip-phoneInput2`,
            readonly: readOnly,
            type: 'tel',
            attributes: [
                { key: 'maxlength', value: '12' },
                { key: 'pattern', value: '[0-9]{3}-[0-9]{3}-[0-9]{4}' },
                { key: 'placeholder', value: '888-888-8888' },
            ],
        });

        phoneExt = input.build({
            label: 'Ext.',
            value: popupData.phoneExt,
            readonly: readOnly,
            type: 'number',
            id: 'isp-ciip-extinput',
            attributes: [{ key: 'maxlength', value: '5' }],
        });

        phone2Ext = input.build({
            label: 'Ext.',
            value: popupData.phone2Ext,
            readonly: readOnly,
            type: 'number',
            id: 'isp-ciip-extinput2',
            attributes: [{ key: 'maxlength', value: '5' }],
        });

        emailInput = input.build({
            label: 'Email',
            value: popupData.email,
            id: `isp-ciip-emailInput`,
            readonly: readOnly,
            type: 'email',
        });

        // Wrap up Phones w/Ext.
        const phoneWrap = document.createElement('div');
        const phoneWrap2 = document.createElement('div');
        phoneWrap.classList.add('phoneWrap');
        phoneWrap2.classList.add('phoneWrap');
        phoneWrap.appendChild(phoneInput);
        phoneWrap.appendChild(phoneExt);
        phoneWrap2.appendChild(phoneInput2);
        phoneWrap2.appendChild(phone2Ext);

        // Action Buttons
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
        if (!readOnly) popup.appendChild(importFromRelationshipsBtn);
        if (!readOnly) popup.appendChild(importFromSignaturesBtn);
        popup.appendChild(nameInput);
        // popup.appendChild(relationshipInput);
        popup.appendChild(addressInput);
        popup.appendChild(emailInput);
        popup.appendChild(phoneWrap);
        popup.appendChild(phoneWrap2);
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

        phoneInput2.addEventListener('input', event => {
            if (event.target.value !== '' && contactInformation.validatePhone(event.target.value)) {
                const phnDisp = contactInformation.formatPhone(event.target.value).disp;
                event.target.value = phnDisp;
            }

            if (event.target.value === '' || contactInformation.validatePhone(event.target.value)) {
                phoneInput2.classList.remove('error');
            } else {
                phoneInput2.classList.add('error');
            }

            checkForErrors();
        });

        phoneExt.addEventListener('input', event => {
            if (event.target.value.length > 5) {
                const value = event.target.value;
                const slicedValue = value.slice(0, 5);
                event.target.value = slicedValue;
            }
        });
        phone2Ext.addEventListener('input', event => {
            if (event.target.value.length > 5) {
                const value = event.target.value;
                const slicedValue = value.slice(0, 5);
                event.target.value = slicedValue;
            }
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
        const peopleTable = table.build({
            tableId: 'isp_ci_importantPeopleTable',
            headline: 'Important People',
            columnHeadings: ['Type', 'Name', 'Address', 'Email', 'Phone'],
            sortable: true,
            onSortCallback: res => {
                contactInformationAjax.updatePlanContactImportantOrder({
                    contactId: cID,
                    importantId: res.row.id.split('-')[2],
                    newPos: res.newIndex,
                    oldPos: res.oldIndex,
                    type: 2,
                });
            },
        });

        // Set the data type for each header, for sorting purposes
        let number = 0;
        const headers = peopleTable.querySelectorAll('.header div');
        if (headers.length > 5)
            number = 1;
        headers[0 + number].setAttribute('data-type', 'string'); // Type
        headers[1 + number].setAttribute('data-type', 'string'); // Name
        headers[2 + number].setAttribute('data-type', 'string'); // Address
        headers[3 + number].setAttribute('data-type', 'string'); // Email
        headers[4 + number].setAttribute('data-type', 'number'); // Phone

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(peopleTable);


        if (readOnly) peopleTable.classList.add('disableDrag');

        if (rawPeopleTableData) {
            const tableData = rawPeopleTableData.map(d => {
                let thisPhone = (d.phoneExt !== '') ? UTIL.formatPhoneNumber(d.phone) + '  ext. ' + d.phoneExt : UTIL.formatPhoneNumber(d.phone);
                let thisPhone2 = (d.phone2 !== '') ? UTIL.formatPhoneNumber(d.phone2) : '';
                thisPhone2 = (d.phone2Ext !== '') ? UTIL.formatPhoneNumber(d.phone2) + '  ext. ' + d.phone2Ext : UTIL.formatPhoneNumber(d.phone2);

                // Validation check for rows with type other. places red '!' in row if no value is typeOther
                if (d.type === 'Other' && d.typeOther === '') {
                    d.typeValidated =
                        `<span style="color: red; position: relative; top: 3px;"><span style="display: inline-block; width: 20px; height: 20px;">${icons.error}</span></span> ${d.type}`;
                } else {
                    d.typeValidated = d.type;
                }
                return {
                    values: [d.typeValidated, d.name, d.address, d.email, thisPhone + '\n' + thisPhone2],
                    id: `ci-impPeople-${d.importantPersonId}`,
                    onClick: () => {
                        tablePopup(d, false);
                    },
                };
            });
            table.populate(peopleTable, tableData, true);
        }

        return peopleTable;
    }

    function buildSection(tableData, contactId, ro, relationships) {
        readOnly = ro;
        cID = contactId;
        rawPeopleTableData = tableData;
        gkRelationships = relationships;
        const ipSection = document.createElement('div');

        const addPersonBtn = button.build({
            text: 'Add Person',
            style: 'secondary',
            type: 'contained',
            callback: () => tablePopup(null, true),
        });

        if (readOnly) addPersonBtn.classList.add('disabled');

        const table = buildTableMarkup();
        ipSection.appendChild(table);
        ipSection.appendChild(addPersonBtn);

        return ipSection;
    }

    return {
        buildSection,
    };
})();
