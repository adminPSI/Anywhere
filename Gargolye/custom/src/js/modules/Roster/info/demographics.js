const demographics = (function () {
  let demoData;

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

    // Additional Info
    const dateOfBirth = formatDOB(data.DOB);
    const medicaidNumber = data.MedicaidNumber;
    const medicareNumber = data.MedicareNumber;
    const residentNumber = data.residentNumber;

    // Organization Info
    const county = data.county;
    const organization = data.organization;
    const organizationAddress = data.organizationAddress;
    const organizationPhone = formatPhoneNumber(data.organizationPhone);

    // Demographic Info
    const name = data.name;
    const generation = data.generation;
    const age = data.age;
    const race = data.race;
    const maritalStatus = data.maritalStatus;
    const gender = data.gender;
    const primaryLanguage = data.primaryLanguage;
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

  //? THOUGHTS:
  // clicking on any part of address will enable editing for all, separate input for each city, state, etc..
  // everything else can have click contained

  function buildInputGroupWrap(title) {
    const wrap = document.createElement('div');
    wrap.classList.add('inputGroupWrap', `${title.split(' ')[0].toLowerCase()}`);
    const heading = document.createElement('h3');
    heading.innerText = title;
    wrap.appendChild(heading);
    return wrap;
  }
  function buildInputGroup(name, value) {
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('inputGroup', `${name.match(/([A-Z]?[^A-Z]*)/g)[0]}`);

    // view element
    const viewElement = document.createElement('p');
    viewElement.classList.add('view', name);
    viewElement.innerText = value ? value : '';

    // edit element
    const editElement = document.createElement('div');
    editElement.classList.add('edit', name);

    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerText = formatLabelText(name);
    const input = document.createElement('input');
    input.id = name;
    input.placeholder = value ? value : '';

    editElement.appendChild(label);
    editElement.appendChild(input);

    inputGroup.appendChild(viewElement);
    inputGroup.appendChild(editElement);

    return { inputGroup, viewEle: viewElement, editEle: input };
  }

  function buildAddressInfo() {
    const groupWrap = buildInputGroupWrap('Address');

    for (const prop in demoData.address) {
      const propValue = demoData.address[prop];
      const { inputGroup, viewEle, editEle } = buildInputGroup(prop, propValue);
      if (prop === 'city') viewEle.innerText += ', ';
      groupWrap.appendChild(inputGroup);
    }

    groupWrap.addEventListener('click', e => {
      if (e.target.classList.contains('inputGroup')) {
        groupWrap.classList.add('editMode');
      }
    });

    return groupWrap;
  }
  function buildContactInfo() {
    const groupWrap = buildInputGroupWrap('Contact Info');

    for (const prop in demoData.contact) {
      const propValue = demoData.contact[prop];
      const { inputGroup, viewEle, editEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerText = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;
      if (prop === 'primaryPhone' || prop === 'secondaryPhone' || prop === 'cellPhone') {
      }

      // event
      inputGroup.addEventListener('click', e => {
        if (!e.target.classList.contains('editMode')) {
          e.target.classList.add('editMode');
        }
      });

      // append
      groupWrap.appendChild(inputGroup);
    }

    return groupWrap;
  }
  function buildAdditionalInfo() {
    const groupWrap = buildInputGroupWrap('Additional Info');

    for (const prop in demoData.additional) {
      const propValue = demoData.additional[prop];
      const { inputGroup, viewEle, editEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerText = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;

      // event
      inputGroup.addEventListener('click', e => {
        if (!e.target.classList.contains('editMode')) {
          e.target.classList.add('editMode');
        }
      });

      // append
      groupWrap.appendChild(inputGroup);
    }

    return groupWrap;
  }
  function buildOrganizationInfo() {
    const groupWrap = buildInputGroupWrap('Organization Info');

    for (const prop in demoData.organization) {
      const propValue = demoData.organization[prop];
      const { inputGroup, viewEle, editEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerText = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;

      // event
      inputGroup.addEventListener('click', e => {
        if (!e.target.classList.contains('editMode')) {
          e.target.classList.add('editMode');
        }
      });

      // append
      groupWrap.appendChild(inputGroup);
    }

    return groupWrap;
  }
  function buildDemographicInfo() {
    const groupWrap = buildInputGroupWrap('Demographic Info');

    for (const prop in demoData.demographic) {
      const propValue = demoData.demographic[prop];
      const { inputGroup, viewEle, editEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerText = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;

      // event
      inputGroup.addEventListener('click', e => {
        if (!e.target.classList.contains('editMode')) {
          e.target.classList.add('editMode');
        }
      });

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

  function populateDemographicsSection(section, data) {
    demoData = formatDataForDisplay(data);
    isGK = $.session.applicationName === 'Gatekeeper';

    const sectionInner = section.querySelector('.sectionInner');
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
