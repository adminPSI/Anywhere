const demographics = (function () {
  let demoData;
  let sectionInner;
  let unEditabled = [
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

  function formatPhoneNumber(number) {
    if (!number) return;
    const splitNumber = number.split('%');
    const phoneNumber = UTIL.formatPhoneNumber(splitNumber[0].trim());
    const phoneType = splitNumber.length > 1 ? splitNumber[1] : '';
    const phone = `${phoneNumber} ${phoneType}`;

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
      case 'zip': {
        return value;
      }
      default: {
        return `<span>${formatLabelText(name)}:</span> ${value}`;
      }
    }
  }
  function formatOrganizationAddress(add1, add2, city, zip) {
    return `${add1 ? add1 : ''} ${add2 ? add2 : ''}, ${city ? city : ''} ${zip ? zip : ''}`;
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

  function formatDataForDisplay(data) {
    const pathToEmployment = data.pathToEmployment;

    // Address
    const addressOne = data.addressone;
    const addressTwo = data.addresstwo;
    const city = data.mailcity;
    const state = data.mailstate;
    const zip = data.mailzipcode ? data.mailzipcode.trim() : data.mailzipcode;

    // Contact Info
    const primaryPhone = formatPhoneNumber(data.primaryphone);
    const secondaryPhone = formatPhoneNumber(data.secondaryphone);
    let cellPhone = data.cellPhone ? data.cellphone.trim() : undefined;
    cellPhone = cellPhone !== '%' ? UTIL.formatPhoneNumber(cellPhone) : '';
    const email = data.email;

    // Additional Info
    const dateOfBirth = formatDOB(data.DOB);
    const medicaidNumber = data.MedicaidNumber;
    const medicareNumber = data.MedicareNumber;
    const residentNumber = data.ResidentNumber;

    // Organization Info
    const county = data.county;
    const organization = data.orgName;
    const organizationAddress = formatOrganizationAddress(
      data.orgAdd1,
      data.orgAdd2,
      data.city,
      data.orgZipCode,
    );
    const organizationPhone = formatPhoneNumber(data.orgPrimaryPhone);

    // Demographic Info
    const name = `${data.firstname} ${data.lastname}`;
    const generation = data.generation;
    const age = getAgeFromDOB(data.DOB);
    const race = data.race;
    const maritalStatus = data.maritalStatus;
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
    wrap.classList.add('inputGroupWrap', `${title.split(' ')[0].toLowerCase()}`);

    const heading = document.createElement('h3');
    heading.innerText = title;

    wrap.appendChild(heading);

    wrap.addEventListener('click', e => {
      if (e.target.classList.contains('inputGroup')) {
        console.log('click from wrap');
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
          const validatePhone = phone => {
            return phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
            //return phone.replace(/[^0-9.]/g, '').length === 10;
          };
          if (!validatePhone(e.target.value)) {
            editElement.classList.add('invalid');
          } else {
            editElement.classList.remove('invalid');
          }
        }
      });

      input.addEventListener('focusout', async e => {
        console.log('focusout from input');
        // show spinner
        PROGRESS__ANYWHERE.init();
        PROGRESS__ANYWHERE.SPINNER.show(saveIcon);
        // save value
        const success = await rosterAjax.updateConsumerDemographics({
          field: name,
          newValue: e.target.value,
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
      // set label for view elements

      // append
      groupWrap.appendChild(inputGroup);
    }

    return groupWrap;
  }
  function buildAdditionalInfo() {
    const groupWrap = buildInputGroupWrap('Additional Info');

    for (const prop in demoData.additional) {
      // GK Only Check
      if ($.session.applicationName === 'Advisor') {
        if (gkOnly.includes(prop)) continue;
      }
      const propValue = demoData.additional[prop];
      const { inputGroup } = buildInputGroup(prop, propValue);

      // append
      groupWrap.appendChild(inputGroup);
    }

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

    // TODO: refactor below code *also show details button need changed to naked style
    document.getElementById('infoButton').addEventListener('click', function (e) {
      if (e.target.value === 'Show Details') {
        e.target.value = 'Hide Details';

        document.getElementById('DOB').textContent = `DOB: ${formatDOB}`;
        document.getElementById('SSN').textContent = `SSN: ${demoData.SSN}`;
        document.getElementById('Medicaid').textContent = `Medicaid: ${demoData.MedicaidNumber}`;
      } else {
        e.target.value = 'Show Details';
        document.getElementById('DOB').textContent = 'DOB:';
        document.getElementById('SSN').textContent = 'SSN:';
        document.getElementById('Medicaid').textContent = 'Medicaid:';
      }
    });
  }

  function populateDemographicsSection(section, data, consumerID) {
    consumerId = consumerID;
    demoData = formatDataForDisplay(data);
    isGK = $.session.applicationName === 'Gatekeeper';

    sectionInner = section.querySelector('.sectionInner');
    sectionInner.innerHTML = '';

    const addressInfo = buildAddressInfo();
    const contactInfo = buildContactInfo();
    const additionalInfo = buildAdditionalInfo();
    const organizationInfo = buildOrganizationInfo();
    const demographicInfo = buildDemographicInfo();

    sectionInner.appendChild(addressInfo);
    sectionInner.appendChild(contactInfo);
    sectionInner.appendChild(additionalInfo);
    sectionInner.appendChild(organizationInfo);
    sectionInner.appendChild(demographicInfo);
  }

  return {
    populate: populateDemographicsSection,
  };
})();
