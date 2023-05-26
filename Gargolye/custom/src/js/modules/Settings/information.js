const information = (function () {
  let demographicInfo;
  let updateData;
  let mobileCarriersData;

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
  async function updateStaffDemographicInformation() {
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
          ...updateData,
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

  function populateCarrierDropdown(dropdownEle) {
    const data = mobileCarriersData.map(carrier => {
      return {
        value: carrier.carrierId,
        text: carrier.carrierName,
      };
    });
    data.sort((a, b) => (a.text < b.text ? -1 : 1));

    dropdown.populate(dropdownEle, data, demographicInfo.carrier);
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
      value: demographicInfo.addressOne,
      callback: e => {
        updateData.addressOne = e.target.value;
      },
    });
    const address2Input = input.build({
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
    const cityInput = input.build({
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
    const stateInput = input.build({
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
    const zipInput = input.build({
      label: 'Zip Code',
      type: 'text',
      style: 'secondary',
      classNames: ['zip'],
      attributes: [{ key: 'maxlength', value: '9' }],
      value: demographicInfo.zipCode,
      callback: e => {
        updateData.zipCode = e.target.value;
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
      value: demographicInfo.mobilePhone,
      callback: e => {
        updateData.mobilePhone = e.target.value;
      },
    });
    const carrierDropdown = dropdown.build({
      dropdownId: 'carrierDropdown',
      label: 'Carrier',
      style: 'secondary',
      callback: e => {
        updateData.carrier = e.target.value;
      },
    });

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

    const emailInput = input.build({
      label: 'Email',
      type: 'email',
      style: 'secondary',
      value: demographicInfo.email,
      callback: e => {
        updateData.email = e.target.value;
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
        updateStaffDemographicInformation();
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
    demographicInfo = await getStaffDemographicInformation();
    mobileCarriersData = await getMobileCarrierDropdown();
    updateData = {};
    buildPage();
  }

  return {
    init,
  };
})();
