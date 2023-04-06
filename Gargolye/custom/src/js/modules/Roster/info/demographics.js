const demographics = (function () {
  let demoData;
  let sectionInner;
  let unEditabled = [
    'pathToEmployment',
    'county',
    'organization',
    'organizationAddress',
    'organizationPhone',
    'name',
    'generation',
    'age',
    'race',
    'maritalStatus',
    'gender',
    'primaryLanguage',
    'educationLevel',
  ];
  let gkOnly = ['cellPhone', 'generation'];

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

  function formatMaritalStatus(status) {
    switch (status) {
      case 'M':
        return 'Married';
      case 'S':
        return 'Single';
      case 'U':
        return 'Unkown';
    }
  }
  function formatPhoneNumber(number) {
    if (!number) return;
    const splitNumber = number.split('%');
    const splitNumber2 = splitNumber[0].split('x');

    const phoneNumber = UTIL.formatPhoneNumber(splitNumber2[0].trim());
    const phoneExt = splitNumber2[1];

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
  function formatOrganizationAddress(add1, add2, city, zip) {
    return `${add1 ? add1 : ''} ${add2 ? add2 : ''}, ${city ? city : ''}</br>${zip ? zip : ''} ${
      zip ? zip : ''
    }`;
  }
  function formatZipCode(zipCode) {
    const zip = zipCode ? zipCode.trim() : zipCode;
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
      name === 'residentNumber'
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

  function formatDataForDisplay(data) {
    const pathToEmployment = data.pathToEmployment;

    // Address
    const addressOne = data.addressone;
    const addressTwo = data.addresstwo;
    const city = data.mailcity;
    const state = data.mailstate;
    const zip = formatZipCode(data.mailzipcode);

    // Contact Info
    const primaryPhone = formatPhoneNumber(data.primaryphone);
    const secondaryPhone = formatPhoneNumber(data.secondaryphone);
    let cellPhone = data.cellphone ? data.cellphone.trim() : undefined;
    cellPhone = cellPhone !== '%' ? formatPhoneNumber(cellPhone) : '';
    const email = data.email;

    // Additional Info
    const dateOfBirth = formatDOB(data.DOB);
    const socialSecurityNumber = data.SSN;
    const medicaidNumber = data.MedicaidNumber;
    const medicareNumber = data.MedicareNumber;
    const residentNumber = data.ResidentNumber;

    // Organization Info
    const county = data.County;
    const organization = data.orgName;
    const organizationAddress = formatOrganizationAddress(
      data.orgAdd1,
      data.orgAdd2,
      data.city,
      data.orgZipCode,
      data.orgState,
    );
    const organizationPhone = formatPhoneNumber(data.orgPrimaryPhone);

    // Demographic Info
    const name = `${data.firstname} ${data.lastname}`;
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
    if (!unEditabled.includes(name)) {
      editElement = document.createElement('div');
      editElement.classList.add('edit');

      if (!value || value === ' ') {
        value = '';
      } else {
        if (name.includes('Phone')) {
          value = value.replace(' ', '');
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
        if (name === 'primaryPhone' || name === 'secondaryPhone' || name === 'cellPhone') {
          const splitNumber = e.target.value.split(' ');
          const phoneNumber = splitNumber[0];
          let phoneExt = splitNumber[1].replace('(', '').replace(')', '');

          const validatePhone = phone => {
            return phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
          };

          const isPhoneValid = validatePhone(phoneNumber);
          const isExtValid = phoneExt.length <= 5 ? true : false;

          if (!isPhoneValid || !isExtValid) {
            editElement.classList.add('invalid');
          } else {
            editElement.classList.remove('invalid');
          }
        }
      });

      input.addEventListener('focusout', async e => {
        let saveValue = e.target.value;
        // show spinner
        PROGRESS__ANYWHERE.init();
        PROGRESS__ANYWHERE.SPINNER.show(saveIcon);
        if (name === 'primaryPhone' || name === 'secondaryPhone' || name === 'cellPhone') {
          const splitNumber = e.target.value.split(' ');
          const phoneNumber = splitNumber[0];
          let phoneExt = splitNumber[1].replace('(', '').replace(')', '');

          saveValue = `${phoneNumber}x${phoneExt}`;
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
        prop === 'residentNumber'
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
        viewElements['ssn'].classList.remove('hidden');
      } else {
        e.target.innerText = 'Show Details';

        viewElements['dateOfBirth'].classList.add('hidden');
        viewElements['medicaidNumber'].classList.add('hidden');
        viewElements['medicareNumber'].classList.add('hidden');
        viewElements['residentNumber'].classList.add('hidden');
        viewElements['ssn'].classList.add('hidden');
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
