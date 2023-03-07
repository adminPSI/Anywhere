const demographics = (function () {
  let demoData;

  function formatPhoneNumber(number) {
    const splitNumber = number.split('%');
    const phoneNumber = UTIL.formatPhoneNumber(splitNumber[0].trim());
    const phoneType = splitNumber.length > 1 ? splitNumber[1] : '';
    const phone = `${phoneNumber} ${phoneType}`;

    return phone;
  }
  function formatDOB(dob) {
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
      employPath: pathToEmployment,
      // Address
      addressOne,
      addressTwo,
      city,
      state,
      zip,
      // Contact Info
      pPhone: primaryPhone,
      sPhone: secondaryPhone,
      cPhone: cellPhone,
      // Additional Info
      dob: dateOfBirth,
      medicaidNumber,
      medicareNumber,
      residentNumber,
      // Organization Info
      county,
      org: organization,
      orgAddress: organizationAddress,
      orgPhone: organizationPhone,
      // Demographic Info
      name,
      generation,
      age,
      race,
      maritalStatus,
      gender,
      pLanguage: primaryLanguage,
      educationLevel,
    };
  }

  //? THOUGHTS:
  // clicking on any part of address will enable editing for all, separate input for each city, state, etc..
  // everything else can have click contained

  function build() {}

  function populateDemographicsSection(section, data) {
    demoData = formatDataForDisplay(data);
    isGK = $.session.applicationName === 'Gatekeeper';

    var sectionInner = section.querySelector('.sectionInner');
    sectionInner.innerHTML = '';

    sectionInner.innerHTML = `
      <div>
        <h3>Address</h3>
        <p class="addressone">${demoData.addressOne}</p>
        <p class="addresstwo">${demoData.addressTwo}</p>
        <p class="mail">${demoData.city}, ${demoData.state} ${demoData.zip}</p>
      </div>

      <div>
        <h3>Contact Info</h3>
        <p class="primaryphone">Primary:
          <a href=tel:+1-${demoData.pPhone}>${demoData.pPhone}</a>
        </p>
        <p class="secondaryphone">Secondary:
          <a href=tel:+1-${demoData.sPhone}>${demoData.sPhone}</a>
        </p>
        ${
          isGK
            ? `<p class="secondaryphone">Cell: <a href=tel:+1-${demoData.cPhone}>${demoData.cPhone}</a></p>`
            : ''
        }
      </div>

      <div>
        <h3>Additional Info</h3>
        <input type="button" id="infoButton" value="Show Details" class="btn btn--secondary btn--contained" style="float: right;">
        <p class="primaryphone" id="DOB">DOB: </p>
        <p class="primaryphone" id="SSN">SSN: </p>
        <p class="primaryphone" id="Medicaid">Medicaid: </p>
      </div>
    `;

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

  return {
    populate: populateDemographicsSection,
  };
})();
