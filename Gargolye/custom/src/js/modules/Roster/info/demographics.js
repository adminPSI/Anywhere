const demographics = (function () {
    let demoData;
    let sectionInner;
    let unEditabled = [
        'pathToEmployment',
        'county',
        'organization',
        'organizationAddress',
        'organizationPhone',
        'generation',
        'name',
        'age',
        'race',
        'maritalStatus',
        'gender',
        'primaryLanguage',
        'educationLevel',
    ];
    let gkOnly = ['cellPhone', 'generation'];

    let sectionLoad;
    let dataLoad;
    let consumerIDLoad;

    function stringAdd(string, start, newSubStr) {
        return string.slice(0, start) + newSubStr + string.slice(start);
    }

    function setCaretPosition(elem, caretPos) {
        if (elem != null) {
            if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                } else elem.focus();
            }
        }
    }

    function clearCurrentEdit() {
        // check for field in edit mode and switch to view
        const currentEdit = sectionInner.querySelector('.editMode');
        if (currentEdit) {
            // clear icon here so its only removed if they click on another field
            const saveIcons = [...currentEdit.querySelectorAll('.saveIcon')];
            saveIcons.forEach(si => {
                si.innerHTML = '';
            });

            currentEdit.classList.remove('editMode');
        }
    }
    function formatName(f, m, l) {
        const first = f;
        const middle = m ? m : '';
        const last = l;

        return `${first} ${middle} ${last}`;
    }
    function formatMaritalStatus(status) {
        switch (status) {
            case 'M':
                return 'Married';
            case 'S':
                return 'Single';
            case 'P':
                return 'Separated';
            case 'W':
                return 'Widowed';
            case 'D':
                return 'Divorced';
            case 'U':
                return 'Unkown';
        }
    }
    function formatPhoneNumber(number) {
        if (!number) return;
        const splitNumber = number
            .replace(/[^\w\s]/gi, '')
            .replaceAll(' ', '')
            .replaceAll('x', '');

        const phoneNumber = UTIL.formatPhoneNumber(splitNumber.substr(0, 10));
        const phoneExt = splitNumber.substr(10);

        const phone = phoneExt ? `${phoneNumber} (${phoneExt})` : `${phoneNumber}`;

        return phone;
    }
    function formatDOB(dob) {
        if (!dob) return;
        let formatDOB;
        if (dob !== '') {
            let newDate = new Date(dob);
            let theMonth = newDate.getMonth() + 1;
            formatDOB =
                UTIL.leadingZero(theMonth) +
                '/' +
                UTIL.leadingZero(newDate.getDate()) +
                '/' +
                newDate.getFullYear();
        } else {
            formatDOB = '';
        }

        return formatDOB;
    }
    function formatSSN(ssn) {
        let SSN = stringAdd(ssn, 3, '-');
        SSN = stringAdd(SSN, 6, '-');
        return SSN;
    }
    function formatOrganizationAddress(add1, add2, city, state, zip) {
    return `${add1 ? add1 : ''} ${add2 ? add2 : ''}, ${city ? city : ''} ${
      state ? state : ''
            }</br>${zip ? formatZipCode(zip) : ''}`;
    }
    function formatZipCode(zipCode) {
        const zip = zipCode.replace(/[^\w\s]/gi, '').replaceAll(' ', '');
        if (zip.length <= 5) {
            return zip;
        } else {
            return zip.slice(0, 5) + '-' + zip.slice(5);
        }
    }

    function setInputType(input, name) {
        // DATE
        if (name === 'dateOfBirth') {
            input.type = 'date';
            return;
        }
        // EMAIL
        if (name === 'email') {
            input.type = 'email';
            input.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
            return;
        }
        // NUMBER
        if (
            name === 'zip' ||
            name === 'medicaidNumber' ||
            name === 'medicareNumber' ||
            name === 'residentNumber' ||
            name === 'localID'
           // name === 'consumerNumber'
        ) {
            input.type = 'number';
            input.pattern = '/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im';
        }
        // TEL
        if (
            name === 'primaryPhone' ||
            name === 'secondaryPhone' ||
            name === 'cellPhone' ||
            name === 'organizationPhone'
        ) {
            input.type = 'tel';
            return;
        }

        input.type = 'text';
    }
    function getAgeFromDOB(dob) {
        var currentDate = new Date();
        var birthDate = new Date(dob);
        var age = currentDate.getFullYear() - birthDate.getFullYear();
        var monthDiff = currentDate.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    function formatLabelText(text) {
        if (text.toLowerCase() === 'ssn') {
            return text.toUpperCase();
        }
        if (text.toLowerCase() === 'localid') {
            return 'Local ID';
        }
        
        if (text.toLowerCase() === 'consumernumber') {
            return 'Consumer #';
        }
        const splitText = text
            .match(/([A-Z]?[^A-Z]*)/g)
            .slice(0, -1)
            .map(t => UTIL.capitalize(t));
        return splitText.join(' ');
    }
    function formatViewInnerHTML(name, value) {
        if (!value) value = '';

        switch (name) {
            case 'city': {
                return `${value}, `;
            }
            case 'addressOne':
            case 'addressTwo':
            case 'state':
            case 'zip':
            case 'pathToEmployment': {
                return value;
            }
            default: {
                return `<span>${formatLabelText(name)}:</span> ${value}`;
            }
        }
    }

    function checkAlphabets(input) {
        for (const char of input) {
            if ((char >= "a" && char <= "z") ||
                (char >= "A" && char <= "Z")) { 
                return true;
            }
        }
        return false; 
    } 

    function formatDataForDisplay(data) {
        const pathToEmployment = data.pathToEmployment;

        // Address
        const addressOne = data.addressone;
        const addressTwo = data.addresstwo;
        const city = data.mailcity;
        const state = data.mailstate;
        const zip = data.mailzipcode ? formatZipCode(data.mailzipcode) : '';
  
        // Contact Info 
        const formattedPrimaryPhone = data.primaryphone == '' ? '' : formatPhoneNumber(data.primaryphone);       
        primaryPhone = formattedPrimaryPhone == '' || checkAlphabets(formattedPrimaryPhone) == true ? '' : `${formattedPrimaryPhone} <a class="demoPhones" href=tel:+1${data.primaryphone}>${icons.phone}</a>`;

        const formattedSecondaryPhone = data.secondaryphone == '' ? '' : formatPhoneNumber(data.secondaryphone);
        secondaryPhone = formattedSecondaryPhone == '' || checkAlphabets(formattedSecondaryPhone) == true ? '' : `${formattedSecondaryPhone} <a class="demoPhones" href=tel:+1${data.secondaryphone}>${icons.phone}</a>`;

        cellPhone = data.cellphone == '' ? '' : formatPhoneNumber(data.cellphone);
        cellPhone = (cellPhone === '%' || cellPhone === '' || checkAlphabets(cellPhone) == true) ? '' : `${cellPhone} <a class="demoPhones" href=tel:+1${data.cellphone}>${icons.phone}</a>`;

        const email = data.email == '' ? '' : `${data.email} <a class="demoPhones" href = "#" onclick = "emailOnClick('mailto:${data.email}');">${icons.Email}</a>`;

       
        // Additional Info
        const dateOfBirth = formatDOB(data.DOB);
        const socialSecurityNumber = formatSSN(data.SSN);
        const medicaidNumber = data.MedicaidNumber;
        const medicareNumber = data.MedicareNumber;
        const residentNumber = data.ResidentNumber;
        const consumerNumber = data.consumerNumber;
        const localID = data.localID;

        // Organization Info
        const county = data.County;
        const organization = data.orgName;
        const organizationAddress = formatOrganizationAddress(
            data.orgAdd1,
            data.orgAdd2,
            data.orgCity,
            data.orgState,
            data.orgZipCode,
        );
        const formattedOrganizationPhone = data.orgPrimaryPhone == '' ? '' : formatPhoneNumber(data.orgPrimaryPhone);
        organizationPhone = formattedOrganizationPhone == '' || checkAlphabets(formattedOrganizationPhone) == true ? '' : `${formattedOrganizationPhone} <a class="demoPhones" href=tel:+1-${data.orgPrimaryPhone}>${icons.phone}</a>`;

        // Demographic Info
        const name = formatName(data.firstname, data.middlename, data.lastname);
        // const firstName = data.firstname;
        // const middleName = data.middlename;
        // const lastName = data.lastname;

        const generation = data.generation;
        const age = getAgeFromDOB(data.DOB);
        const race = data.race;
        const maritalStatus = formatMaritalStatus(data.maritalStatus);
        const gender = data.gender;
        const primaryLanguage = data.language;
        const educationLevel = data.educationLevel;

        return {
            pathToEmployment,
            // Address
            address: {
                addressOne,
                addressTwo,
                city,
                state,
                zip,
            },
            // Contact Info
            contact: {
                primaryPhone,
                secondaryPhone,
                cellPhone,
                email,
            },
            // Additional Info
            additional: {
                dateOfBirth,
                medicaidNumber,
                medicareNumber,
                residentNumber,
                localID,
                consumerNumber,
                ssn: socialSecurityNumber,
            },
            // Organization Info
            organization: {
                county,
                organization,
                organizationAddress,
                organizationPhone,
            },
            // Demographic Info
            demographic: {
                name,
                generation,
                age,
                race,
                maritalStatus,
                gender,
                primaryLanguage,
                educationLevel,
            },
        };
    }

    function buildInputGroupWrap(title) {
        const wrap = document.createElement('div');
        wrap.classList.add('inputGroupWrap', `${title.replaceAll(' ', '').toLowerCase()}`);

        const heading = document.createElement('h3');
        heading.innerText = title;  
        wrap.appendChild(heading);

        wrap.addEventListener('click', e => {
            if (!$.session.DemographicsUpdate) return;

            // if (title === 'Additional Info') return;

            if (e.target.classList.contains('inputGroup')) {
                if (e.target.classList.contains('unEditabled')) return;
                clearCurrentEdit();
                // set target to edit mode
                if (title !== 'Address') {
                    if (!e.target.classList.contains('editMode')) {
                        e.target.classList.add('editMode');
                    }
                } else {
                    if (!wrap.classList.contains('editMode')) {
                        wrap.classList.add('editMode');
                    }
                }
            }
        });

        return wrap;
    }
    function buildInputGroup(name, value) {
        // Input Group
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('inputGroup', `${name.match(/([A-Z]?[^A-Z]*)/g)[0]}`);

        // view element
        const viewElement = document.createElement('p');
        viewElement.classList.add('view');
        viewElement.innerHTML = formatViewInnerHTML(name, value);

        // edit element
        let editElement;
        if (!unEditabled.includes(name) || !$.session.DemographicsUpdate) {
            editElement = document.createElement('div');
            editElement.classList.add('edit');

            if (!value || value === ' ') {
                value = '';
            } else {
                if (name.includes('Phone') || name.includes('email')) {
                    const phoneNumberEndIndex = value.indexOf('<a class="demoPhones"');
                    if (phoneNumberEndIndex !== -1) {
                        const phoneNumberStartIndex = 0;
                        value = value.slice(phoneNumberStartIndex, phoneNumberEndIndex - 1);
                        value = value.trim();
                    } else {
                        value = '';
                    }
                }
                if (name === 'dateOfBirth') {
                    value = UTIL.formatDateToIso(value);
                }
            }

            const label = document.createElement('label');
            label.setAttribute('for', name);
            label.innerText = formatLabelText(name);
            const input = document.createElement('input');
            input.id = name;
            input.value = value ? value : '';
            input.placeholder = value ? value : '';
            setInputType(input, name);
            const saveIcon = document.createElement('span');
            saveIcon.classList.add('saveIcon');

            input.addEventListener('keyup', e => {
                if (name === 'email') {
                    const validateEmail = email => {
                        return email.match(
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        );
                    };

                    if (!validateEmail(e.target.value)) {
                        editElement.classList.add('invalid');
                    } else {
                        editElement.classList.remove('invalid');
                    }
                }
                if (name === 'ssn') {
                    let validSocial = false;
                    let value = e.target.value.replaceAll('-', '').slice(0, 9);

                    if (value.length === 9) {
                        validSocial = true;
                    }

                    let social;

                    if (value.length >= 4 && value.length <= 5) {
                        social = stringAdd(value, 3, '-');
                        e.target.value = social;
                    }
                    if (value.length >= 6) {
                        social = stringAdd(value, 3, '-');
                        social = stringAdd(social, 6, '-');
                        e.target.value = social;
                    }

                    if (validSocial) {
                        editElement.classList.remove('invalid');
                    } else {
                        editElement.classList.add('invalid');
                    }
                }
                if (name === 'primaryPhone' || name === 'secondaryPhone' || name === 'cellPhone') {
                    let validPhone = false;
                    let value = e.target.value
                        .replace(/[^\w\s]/gi, '')
                        .replaceAll(' ', '')
                        .slice(0, 15);

                    let phoneNumber;

                    if (value.length >= 4 && value.length <= 6) {
                        phoneNumber = stringAdd(value, 3, '-');
                        e.target.value = phoneNumber;
                    }
                    if (value.length >= 7 && value.length <= 10) {
                        phoneNumber = stringAdd(value, 3, '-');
                        phoneNumber = stringAdd(phoneNumber, 7, '-');
                        e.target.value = phoneNumber;
                    }

                    if (value.length > 0) {
                        phoneNumber = stringAdd(value, 3, '-');
                        phoneNumber = stringAdd(phoneNumber, 7, '-');
                        phoneNumber = stringAdd(phoneNumber, 12, ' (');
                        phoneNumber = stringAdd(phoneNumber, phoneNumber.length + 1, ')');
                        e.target.value = phoneNumber;

                        setCaretPosition(e.target, phoneNumber.length - 1);

                        validPhone = true;
                    }
                    // const validatePhone = phone => {
                    //   return phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
                    // };
                    if (!validPhone) {
                        editElement.classList.add('invalid');
                    } else {
                        editElement.classList.remove('invalid');
                    }
                }
            });

            input.addEventListener('focusout', async e => {
                // check for invalid calss
                if (e.target.parentElement.classList.contains('invalid')) return;

                let saveValue = e.target.value;
                // show spinner
                PROGRESS__ANYWHERE.init();
                PROGRESS__ANYWHERE.SPINNER.show(saveIcon);
                if (name === 'primaryPhone' || name === 'secondaryPhone' || name === 'cellPhone') {
                    const splitNumber = e.target.value.split(' ');
                    const phoneNumber = splitNumber[0].replace(/[^\w\s]/gi, '');

                    let phoneExt;
                    if (splitNumber[1] !== undefined) {
                        phoneExt = splitNumber[1].replace('(', '').replace(')', '');
                    }

                    saveValue = `${phoneNumber}${phoneExt}`;
                }
                if (name === 'ssn') {
                    saveValue = e.target.value.replaceAll('-', '');
                }
                if (name === 'localId') {
                    saveValue = e.target.value
                }
                // save value
                const success = await rosterAjax.updateConsumerDemographics({
                    field: name,
                    newValue: saveValue,
                    consumerId,
                    applicationName: $.session.applicationName,
                });
                // show save icon
                if (success) { 
                    saveIcon.innerHTML = icons['checkmark'];
                    saveIcon.classList.add('success');
                    viewElement.innerHTML = formatViewInnerHTML(name, e.target.value);

                    // below code Implement of Phone or email Icon does not immediately show when adding a phone or email #
                    dataLoad.cellphone = name == 'cellPhone' ? saveValue : dataLoad.cellphone;  
                    dataLoad.secondaryphone = name == 'secondaryPhone' ? saveValue : dataLoad.secondaryphone;
                    dataLoad.primaryphone = name == 'primaryPhone' ? saveValue : dataLoad.primaryphone;
                    dataLoad.email = name == 'email' ? saveValue : dataLoad.email;  
                    dataLoad.addressone = name == 'addressOne' ? saveValue : dataLoad.addressone; 
                    dataLoad.addresstwo = name == 'addressTwo' ? saveValue : dataLoad.addresstwo;
                    dataLoad.mailcity = name == 'city' ? saveValue : dataLoad.mailcity; 
                    dataLoad.mailstate = name == 'state' ? saveValue : dataLoad.mailstate;
                    dataLoad.mailzipcode = name == 'zip' ? saveValue : dataLoad.mailzipcode; 
                    dataLoad.MedicaidNumber = name == 'medicaidNumber' ? saveValue : dataLoad.MedicaidNumber; 
                    dataLoad.MedicareNumber = name == 'medicareNumber' ? saveValue : dataLoad.MedicareNumber; 
                    dataLoad.ResidentNumber = name == 'residentNumber' ? saveValue : dataLoad.ResidentNumber; 
                    dataLoad.DOB = name == 'dateOfBirth' ? saveValue : dataLoad.DOB; 
                    dataLoad.SSN = name == 'ssn' ? saveValue : dataLoad.SSN; 
                    populateDemographicsSection(sectionLoad, dataLoad, consumerIDLoad);                         
                } else {
                    saveIcon.innerHTML = icons['error'];
                    saveIcon.classList.add('error');
                }
            });

            editElement.appendChild(label);
            editElement.appendChild(input);
            editElement.appendChild(saveIcon);
        } else {
            inputGroup.classList.add('unEditabled');
        }

        inputGroup.appendChild(viewElement);
        if (!unEditabled.includes(name)) inputGroup.appendChild(editElement);

        return { inputGroup, viewEle: viewElement };
    }

    function buildPathToEmployment() {
        const groupWrap = buildInputGroupWrap('Path To Employment');
        const { inputGroup } = buildInputGroup('pathToEmployment', demoData.pathToEmployment);
        groupWrap.appendChild(inputGroup);

        return groupWrap;
    }
    function buildAddressInfo() {
        const groupWrap = buildInputGroupWrap('Address');

        for (const prop in demoData.address) {
            // GK Only Check
            if ($.session.applicationName === 'Advisor') {
                if (gkOnly.includes(prop)) continue;
            }
            const propValue = demoData.address[prop];
            const { inputGroup } = buildInputGroup(prop, propValue);

            groupWrap.appendChild(inputGroup);
        }

        return groupWrap;
    }
    function buildContactInfo() {
        const groupWrap = buildInputGroupWrap('Contact Info');

        for (const prop in demoData.contact) {
            // GK Only Check
            if ($.session.applicationName === 'Advisor') {
                if (gkOnly.includes(prop)) continue;
            }
            const propValue = demoData.contact[prop];
            const { inputGroup } = buildInputGroup(prop, propValue);
            // append
            groupWrap.appendChild(inputGroup);
        }

        return groupWrap;
    }
    function buildAdditionalInfo() {
        const groupWrap = buildInputGroupWrap('Additional Info');
        const viewElements = {};

        for (const prop in demoData.additional) {
            // GK Only Check
            if ($.session.applicationName === 'Advisor') {
                if (gkOnly.includes(prop)) continue;
            }
            const propValue = demoData.additional[prop];
            const { inputGroup, viewEle } = buildInputGroup(prop, propValue);

            if (
                prop === 'ssn' ||
                prop === 'dateOfBirth' ||
                prop === 'medicaidNumber' ||
                prop === 'medicareNumber' ||
                prop === 'residentNumber' ||
                prop === 'consumerNumber' ||
                prop === 'localID'
            ) {
                viewEle.classList.add('hidden');
            }

            // cache view ele
            viewElements[prop] = viewEle;

            // append
            groupWrap.appendChild(inputGroup);
        }

        const showDetailsoBtn = button.build({
            text: 'Show Details',
            style: 'secondary',
            type: 'outlined',
        });
        groupWrap.appendChild(showDetailsoBtn);

        showDetailsoBtn.addEventListener('click', function (e) {
            if (e.target.innerText.toLowerCase() === 'show details') {
                e.target.innerText = 'Hide Details';

                if ($.session.DemographicsViewDOB) {
                    viewElements['dateOfBirth'].classList.remove('hidden');
                }
                if ($.session.DemographicsViewMedicaid) {
                    viewElements['medicaidNumber'].classList.remove('hidden');
                }
                if ($.session.DemographicsViewMedicare) {
                    viewElements['medicareNumber'].classList.remove('hidden');
                }
                if ($.session.DemographicsViewResident) {
                    viewElements['residentNumber'].classList.remove('hidden');
                }
               if ($.session.DemographicsViewSSN) {
                    viewElements['ssn'].classList.remove('hidden');
               }
                if ($.session.DemographicsViewConsumerNumber) {
                    viewElements['consumerNumber'].classList.remove('hidden');
                }
                if ($.session.DemographicsViewLocalId) {
                    viewElements['localID'].classList.remove('hidden');
                }
            } else {
                e.target.innerText = 'Show Details';

                viewElements['dateOfBirth'].classList.add('hidden');
                viewElements['medicaidNumber'].classList.add('hidden');
                viewElements['medicareNumber'].classList.add('hidden');
                viewElements['residentNumber'].classList.add('hidden');
                viewElements['ssn'].classList.add('hidden');
                viewElements['consumerNumber'].classList.add('hidden');
                viewElements['localID'].classList.add('hidden');
            }
        });

        return groupWrap;
    }
    function buildOrganizationInfo() {
        const groupWrap = buildInputGroupWrap('Organization Info');

        for (const prop in demoData.organization) {
            // GK Only Check
            if ($.session.applicationName === 'Advisor') {
                if (gkOnly.includes(prop)) continue;
            }
            const propValue = demoData.organization[prop];
            const { inputGroup } = buildInputGroup(prop, propValue);

            // append
            groupWrap.appendChild(inputGroup);
        }

        return groupWrap;
    }
    function buildDemographicInfo() {
        const groupWrap = buildInputGroupWrap('Demographic Info');

        for (const prop in demoData.demographic) {
            // GK Only Check
            if ($.session.applicationName === 'Advisor') {
                if (gkOnly.includes(prop)) continue;
            }
            const propValue = demoData.demographic[prop];
            const { inputGroup } = buildInputGroup(prop, propValue);

            // append
            groupWrap.appendChild(inputGroup);
        }

        return groupWrap;
    }

    function populateDemographicsSection(section, data, consumerID) {  
        sectionLoad = section; 
        dataLoad = data;
        consumerIDLoad = consumerID;

        consumerId = consumerID;
        demoData = formatDataForDisplay(data);
        isGK = $.session.applicationName === 'Gatekeeper';

        sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        const pathToEmployment = buildPathToEmployment();
        const addressInfo = buildAddressInfo();
        const contactInfo = buildContactInfo();
        const additionalInfo = buildAdditionalInfo();
        const organizationInfo = buildOrganizationInfo();
        const demographicInfo = buildDemographicInfo();

        sectionInner.appendChild(pathToEmployment);
        sectionInner.appendChild(addressInfo);
        sectionInner.appendChild(contactInfo);
        sectionInner.appendChild(additionalInfo);
        sectionInner.appendChild(organizationInfo);
        sectionInner.appendChild(demographicInfo);

        document.querySelector(".demoPhones").addEventListener("click", function(event) {
            event.stopPropagation(); // Stop event propagation to the outer div
        });

        section.addEventListener('click', e => {
            if (
                !e.target.classList.contains('inputGroup') &&
                e.target.nodeName !== 'INPUT' &&
                e.target.nodeName !== 'LABLE'
            ) {
                clearCurrentEdit();
            }
        });
    }

    return {
        populate: populateDemographicsSection,
    };
})();
