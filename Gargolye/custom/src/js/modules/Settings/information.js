const information = (function () {
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

      return data.GetDemographicInformationResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function updateStaffDemographicInformation(data) {
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
          ...data,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      return data.UpdateDemographicInformationResult;
    } catch (error) {
      console.log(error);
    }
  }

  function buildAddressSection() {
    const addressSection = document.createElement('div');
    addressSection.classList.add('addressSection', 'informationSection');

    const heading = document.createElement('p');
    heading.innerText = 'Address';

    const body = document.createElement('div');

    const address1Input = input.build({
      label: 'Address 1',
      type: 'text',
      style: 'secondary',
      classNames: ['address1'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: '',
      callback: e => {
        address1 = e.target.value;
      },
    });
    const address2Input = input.build({
      label: 'Address 2',
      type: 'text',
      style: 'secondary',
      classNames: ['address2'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: '',
      callback: e => {
        address2 = e.target.value;
      },
    });
    const cityInput = input.build({
      label: 'City',
      type: 'text',
      style: 'secondary',
      classNames: ['city'],
      attributes: [{ key: 'maxlength', value: '27' }],
      value: '',
      callback: e => {
        city = e.target.value;
      },
    });
    const stateInput = input.build({
      label: 'State',
      type: 'text',
      style: 'secondary',
      classNames: ['state'],
      attributes: [{ key: 'maxlength', value: '2' }],
      value: '',
      callback: e => {
        state = e.target.value;
      },
    });
    const zipInput = input.build({
      label: 'Zip Code',
      type: 'text',
      style: 'secondary',
      classNames: ['zip'],
      attributes: [{ key: 'maxlength', value: '9' }],
      value: '',
      callback: e => {
        zipcode = e.target.value;
      },
    });

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
    const numberSection = document.createElement('div');
    numberSection.classList.add('numberSection', 'informationSection');

    const heading = document.createElement('p');
    heading.innerText = 'Phone Numbers';

    const body = document.createElement('div');

    const phoneInput = input.build({
      label: 'Mobile',
      type: 'tel',
      style: 'secondary',
      classNames: ['phone'],
      attributes: [{ key: 'maxlength', value: '14' }],
      value: '',
      callback: e => {
        phone = e.target.value;
      },
    });
    const carrierInput = dropdown.build({
      dropdownId: 'carrierDropdown',
      label: 'Carrier',
      style: 'secondary',
      callback: e => {
        carrier = e.target.value;
      },
    });

    body.appendChild(phoneInput);
    body.appendChild(carrierInput);

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

    const emailInput = input.build({
      label: 'Email',
      type: 'email',
      style: 'secondary',
      callback: e => {
        email = e.target.value;
      },
    });

    body.appendChild(emailInput);

    emailSection.appendChild(heading);
    emailSection.appendChild(body);

    return emailSection;
  }

  function buildPage() {
    const infoPage = document.querySelector('.util-menu__info');
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
      callback: () => {
        // update information
      },
    });

    const phoneNumberSection = buildNumbersSection();
    const emailSection = buildEmailSection();

    infoPage.appendChild(currMenu);
    infoPage.appendChild(backButton);
    infoPage.appendChild(updateButton);

    if ($.session.applicationName === 'Advisor') {
      const addressSection = buildAddressSection();
      infoPage.appendChild(addressSection);
    }

    infoPage.appendChild(phoneNumberSection);
    infoPage.appendChild(emailSection);
  }

  async function init() {
    await getStaffDemographicInformation();
    buildPage();
  }

  return {
    init,
  };
})();
