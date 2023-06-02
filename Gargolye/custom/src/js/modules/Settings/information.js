const information = (function () {
  let demographicInfo;
  let updateData;
  let mobileCarriersData;
  let emailError = false;
  // DOM
  let infoPage;
  let address1Input;
  let address2Input;
  let cityInput;
  let stateInput;
  let zipInput;
  let phoneInput;
  let carrierDropdown;
  let emailInput;

  async function getStaffDemographicInformation() {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/GetDemographicInformation/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.GetDemographicInformationResult[0];
    } catch (error) {
      console.log(error);
    }
  }
  async function updateStaffDemographicInformation() {
    const mergeUpdateWithDemo = { ...demographicInfo, ...updateData };

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/UpdateDemographicInformation/',
        data: JSON.stringify({
          token: $.session.Token,
          ...mergeUpdateWithDemo,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.UpdateDemographicInformationResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getMobileCarrierDropdown() {
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getMobileCarrierDropdown/',
        data: JSON.stringify({
          token: $.session.Token,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.getMobileCarrierDropdownResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateInformationData() {
    const newDemoInfo = await getStaffDemographicInformation();

    if (updateData.email && updateData.email !== newDemoInfo.email && !emailError) {
      emailError = true;
      // show error by email
      const emailSectionBody = document.querySelector('.emailSection .informationSection__body');
      const errorEle = document.createElement('p');
      errorEle.innerText = 'Unable to update email due to EMAR';
      emailSectionBody.appendChild(errorEle);
      input.disableInputField(emailInput);
    }

    const updatedKeys = Object.keys(updateData);
    if (updatedKeys.length === 1 && updatedKeys[0] === 'email' && emailError) {
      // do nothing
    } else {
      const saveEle = successfulSave.get('Information Updated.', true);
      infoPage.appendChild(saveEle);
      setTimeout(() => {
        infoPage.removeChild(saveEle);
      }, 1000);
    }

    demographicInfo = newDemoInfo;
    updateData = {};

    address1Input.querySelector('input').value = demographicInfo.addressOne;
    address2Input.querySelector('input').value = demographicInfo.addressTwo;
    cityInput.querySelector('input').value = demographicInfo.city;
    stateInput.querySelector('input').value = demographicInfo.state;
    zipInput.querySelector('input').value = demographicInfo.zipCode;
    phoneInput.querySelector('input').value = formatPhoneNumber(demographicInfo.mobilePhone);
    emailInput.querySelector('input').value = demographicInfo.email;
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
  function formatZipCode(zipCode) {
    const zip = zipCode.replace(/[^\w\s]/gi, '').replaceAll(' ', '');
    if (zip.length <= 5) {
      return zip;
    } else {
      return zip.slice(0, 5) + '-' + zip.slice(5);
    }
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
  function stringAdd(string, start, newSubStr) {
    return string.slice(0, start) + newSubStr + string.slice(start);
  }

  function populateCarrierDropdown(dropdownEle) {
    const data = mobileCarriersData.map(carrier => {
      return {
        value: carrier.carrierId,
        text: carrier.carrierName,
      };
    });
    data.sort((a, b) => (a.text < b.text ? -1 : 1));
    data.unshift({
      value: '',
      text: '',
    });

    dropdown.populate(dropdownEle, data, demographicInfo.carrier);
  }

  function buildAddressSection() {
    const addressSection = document.createElement('div');
    addressSection.classList.add('addressSection', 'informationSection');

    const heading = document.createElement('p');
    heading.innerText = 'Address';

    const body = document.createElement('div');
    body.classList.add('informationSection__body');

    address1Input = input.build({
      label: 'Address 1',
      type: 'text',
      style: 'secondary',
      classNames: ['address1'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: demographicInfo.addressOne,
      callback: e => {
        updateData.addressOne = e.target.value;
      },
    });
    address2Input = input.build({
      label: 'Address 2',
      type: 'text',
      style: 'secondary',
      classNames: ['address2'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: demographicInfo.addressTwo,
      callback: e => {
        updateData.addressTwo = e.target.value;
      },
    });
    cityInput = input.build({
      label: 'City',
      type: 'text',
      style: 'secondary',
      classNames: ['city'],
      attributes: [{ key: 'maxlength', value: '27' }],
      value: demographicInfo.city,
      callback: e => {
        updateData.city = e.target.value;
      },
    });
    stateInput = input.build({
      label: 'State',
      type: 'text',
      style: 'secondary',
      classNames: ['state'],
      attributes: [{ key: 'maxlength', value: '2' }],
      value: demographicInfo.state,
      callback: e => {
        updateData.state = e.target.value;
      },
    });
    zipInput = input.build({
      label: 'Zip Code',
      type: 'text',
      style: 'secondary',
      classNames: ['zip'],
      attributes: [{ key: 'maxlength', value: '9' }],
      value: formatZipCode(demographicInfo.zipCode),
      callback: e => {
        updateData.zipCode = e.target.value;
      },
    });

    if (!$.session.UpdateMyInformation) {
      input.disableInputField(address1Input);
      input.disableInputField(address2Input);
      input.disableInputField(cityInput);
      input.disableInputField(stateInput);
      input.disableInputField(zipInput);
    }

    const stateZipWrap = document.createElement('div');
    stateZipWrap.classList.add('stateZipWrap');
    stateZipWrap.appendChild(stateInput);
    stateZipWrap.appendChild(zipInput);

    body.appendChild(address1Input);
    body.appendChild(address2Input);
    body.appendChild(cityInput);
    body.appendChild(stateZipWrap);

    addressSection.appendChild(heading);
    addressSection.appendChild(body);

    return addressSection;
  }
  function buildNumbersSection() {
    let validPhone = false;

    const numberSection = document.createElement('div');
    numberSection.classList.add('numberSection', 'informationSection');

    const heading = document.createElement('p');
    heading.innerText = 'Phone Numbers';

    const body = document.createElement('div');
    body.classList.add('informationSection__body');

    phoneInput = input.build({
      label: 'Mobile',
      type: 'tel',
      style: 'secondary',
      classNames: ['phone'],
      value: formatPhoneNumber(demographicInfo.mobilePhone),
      callback: e => {
        if (e.target.value === '' || !validPhone) {
          updateData.mobilePhone = '';
          return;
        }

        let splitNumber = e.target.value.split(' ');

        let phoneNumber = splitNumber[0].replace(/[^\w\s]/gi, '');
        let phoneExt = splitNumber[1] ? splitNumber[1].replace('(', '').replace(')', '') : '';

        saveValue = phoneExt ? `${phoneNumber}${phoneExt}` : `${phoneNumber}`;

        updateData.mobilePhone = saveValue;
      },
    });
    phoneInput.addEventListener('keyup', e => {
      let value = e.target.value
        .replace(/[^\w\s]/gi, '')
        .replaceAll(' ', '')
        .slice(0, 15);

      let phoneNumber;

      if (value.length === 0) {
        validPhone = true;
        return;
      }
      if (value.length >= 4 && value.length <= 6) {
        phoneNumber = stringAdd(value, 3, '-');
        e.target.value = phoneNumber;
      }
      if (value.length >= 7 && value.length < 10) {
        phoneNumber = stringAdd(value, 3, '-');
        phoneNumber = stringAdd(phoneNumber, 7, '-');
        e.target.value = phoneNumber;
      }
      if (value.length >= 10) {
        phoneNumber = stringAdd(value, 3, '-');
        phoneNumber = stringAdd(phoneNumber, 7, '-');
        phoneNumber = stringAdd(phoneNumber, 12, ' (');
        phoneNumber = stringAdd(phoneNumber, phoneNumber.length + 1, ')');
        e.target.value = phoneNumber;

        setCaretPosition(e.target, phoneNumber.length - 1);

        validPhone = true;
      }
      if (!validPhone) {
        phoneInput.classList.add('error');
      } else {
        phoneInput.classList.remove('error');
      }
    });

    carrierDropdown = dropdown.build({
      dropdownId: 'carrierDropdown',
      label: 'Carrier',
      style: 'secondary',
      callback: e => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        updateData.carrier = selectedOption.value;
      },
    });

    if (!$.session.UpdateMyInformation) {
      input.disableInputField(phoneInput);
      input.disableInputField(carrierDropdown);
    }

    populateCarrierDropdown(carrierDropdown);

    body.appendChild(phoneInput);
    body.appendChild(carrierDropdown);

    numberSection.appendChild(heading);
    numberSection.appendChild(body);

    return numberSection;
  }
  function buildEmailSection() {
    const emailSection = document.createElement('div');
    emailSection.classList.add('emailSection', 'informationSection');

    const heading = document.createElement('p');
    heading.innerText = 'Email Address';

    const body = document.createElement('div');
    body.classList.add('informationSection__body');

    emailInput = input.build({
      label: 'Email',
      type: 'email',
      style: 'secondary',
      value: demographicInfo.email,
      callback: e => {
        updateData.email = e.target.value;
      },
    });
    if (!$.session.UpdateMyInformation) {
      input.disableInputField(emailInput);
    }

    body.appendChild(emailInput);

    emailSection.appendChild(heading);
    emailSection.appendChild(body);

    return emailSection;
  }

  function buildPage() {
    infoPage = document.querySelector('.util-menu__info');
    infoPage.innerHTML = '';

    const currMenu = document.createElement('p');
    currMenu.innerText = 'My Information';
    currMenu.classList.add('menuTopDisplay');

    const backButton = button.build({
      text: 'Back',
      icon: 'arrowBack',
      type: 'text',
      attributes: [{ key: 'data-action', value: 'back' }],
    });

    const updateButton = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'updateInformationBtn',
      callback: async () => {
        await updateStaffDemographicInformation();
        await updateInformationData();
      },
    });

    const phoneNumberSection = buildNumbersSection();
    const emailSection = buildEmailSection();

    infoPage.appendChild(currMenu);
    infoPage.appendChild(backButton);
    if ($.session.UpdateMyInformation) {
      infoPage.appendChild(updateButton);
    }

    if ($.session.applicationName === 'Advisor') {
      const addressSection = buildAddressSection();
      infoPage.appendChild(addressSection);
    }

    infoPage.appendChild(phoneNumberSection);
    infoPage.appendChild(emailSection);
  }

  async function init() {
    demographicInfo = await getStaffDemographicInformation();
    mobileCarriersData = await getMobileCarrierDropdown();
    updateData = {};
    if (!demographicInfo) {
      demographicInfo = {
        addressOne: '',
        addressTwo: '',
        city: '',
        state: '',
        zipCode: '',
        mobilePhone: '',
        carrier: '',
        email: '',
      };
    }
    buildPage();
  }

  return {
    init,
  };
})();
