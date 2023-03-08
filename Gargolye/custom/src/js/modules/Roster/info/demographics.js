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
    const currentEdit = [...sectionInner.querySelectorAll('.editMode')];
    if (currentEdit && currentEdit.length > 0) {
      currentEdit.forEach(ce => {
        ce.classList.remove('editMode');
        // clear icon here so its only removed if they click on another field
        const saveIcon = ce.querySelector('.saveIcon');
        saveIcon.innerHTML = '';
      });
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
    const email = data.emailAddress;

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
    viewElement.innerText = value ? value : '';

    // edit element
    let editElement;
    if (!unEditabled.includes(name)) {
      editElement = document.createElement('div');
      editElement.classList.add('edit');

      const label = document.createElement('label');
      label.setAttribute('for', name);
      label.innerText = formatLabelText(name);
      const input = document.createElement('input');
      input.id = name;
      input.placeholder = value ? value : '';
      const saveIcon = document.createElement('span');
      saveIcon.classList.add('saveIcon');

      input.addEventListener('focusout', async e => {
        // show spinner
        PROGRESS__ANYWHERE.init();
        PROGRESS__ANYWHERE.SPINNER.show(saveIcon);
        // save value
        // await rosterAjax.updateDemographicsValue({token: $.session.token, consumerId: '', fieldName: name, newValue: e.target.value})
        // show save icon
        setTimeout(() => {
          saveIcon.innerHTML = icons['checkmark'];
          // set timeout mimic ajax call for now
          e.stopPropagation();
        }, 3000);
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
        if (gkOnly.includes(prop)) break;
      }
      const propValue = demoData.address[prop];
      const { inputGroup, viewEle } = buildInputGroup(prop, propValue);
      if (prop === 'city') viewEle.innerText += ', ';
      groupWrap.appendChild(inputGroup);
    }

    return groupWrap;
  }
  function buildContactInfo() {
    const groupWrap = buildInputGroupWrap('Contact Info');

    for (const prop in demoData.contact) {
      // GK Only Check
      if ($.session.applicationName === 'Advisor') {
        if (gkOnly.includes(prop)) break;
      }
      const propValue = demoData.contact[prop];
      const { inputGroup, viewEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerHTML = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;
      if (prop === 'primaryPhone' || prop === 'secondaryPhone' || prop === 'cellPhone') {
      }

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
        if (gkOnly.includes(prop)) break;
      }
      const propValue = demoData.additional[prop];
      const { inputGroup, viewEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerHTML = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;

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
        if (gkOnly.includes(prop)) break;
      }
      const propValue = demoData.organization[prop];
      const { inputGroup, viewEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerHTML = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;

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
        if (gkOnly.includes(prop)) break;
      }
      const propValue = demoData.demographic[prop];
      const { inputGroup, viewEle } = buildInputGroup(prop, propValue);
      // set label for view elements
      viewEle.innerHTML = `<span>${formatLabelText(prop)}:</span> ${viewEle.innerText}`;

      // event
      inputGroup.addEventListener('click', e => {});

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
