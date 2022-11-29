const contactInformation = (() => {
  let mainCIData;
  let bestWayToConnectData;
  let contactId;
  let assessmentId;
  let readOnly;
  let uniqueFundingSources;
  let allFundingSources;
  let fundingSourceList;
  // Table Data
  let importantPeopleData, importantGroupsData, importantPlacesData, gkDemographicsData;
  let gkRelationships;
  let communicationType;
  //Inputs
  let nameInput;
  let prefNameInput;
  let addressInput;
  let cityStateZipInput;
  let countyInput;
  let emailInput;
  let phoneInput;
  let sexInput;
  let maritalStatusInput;
  let charLimits;

  function refreshDropdownData(newDropdownData) {
    dropdownData = newDropdownData;
  }

  function populateBestWayToConnectDropdown(dropdownEle, defaultValue) {
    const data = communicationType.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    dropdown.populate(dropdownEle, data, defaultValue);
  }

  function buildContactInputs() {
    const inputSection = document.createElement('div');

    const dateFundingSoureContainer = document.createElement('div');
    dateFundingSoureContainer.classList.add('isp_ci_dateFundingSourceContainer');

    const ispDatesSection = document.createElement('div');
    ispDatesSection.classList.add('ispSpanDateContainer');
    const ispDatesHeader = document.createElement('h4');
    ispDatesHeader.innerText = 'ISP Span Dates:';
    ispDatesSection.appendChild(ispDatesHeader);
    const effStartDate = UTIL.getFormattedDateFromDate(planDates.getEffectiveStartDate());
    const effEndDate = UTIL.getFormattedDateFromDate(planDates.getEffectiveEndDate());
    const dateDisplay = document.createElement('p');
    dateDisplay.innerText = `${effStartDate} - ${effEndDate}`;
    ispDatesSection.appendChild(dateDisplay);

    const ispFundingSuourcesSection = document.createElement('div');
    ispFundingSuourcesSection.classList.add('ispFSContainer');
    const ispFundingSuourcesHeader = document.createElement('h4');
    ispFundingSuourcesSection.appendChild(ispFundingSuourcesHeader);
    ispFundingSuourcesHeader.innerText = 'Funding Sources:';
    const fsContainer = document.createElement('div');
    ispFundingSuourcesSection.appendChild(fsContainer);
    fundingSourceList = document.createElement('p');
    fundingSourceList.id = 'isp_ci_fundingSourcesList';
    fundingSourceList.innerText = uniqueFundingSources.join(', ');
    fsContainer.appendChild(fundingSourceList);

    dateFundingSoureContainer.appendChild(ispDatesSection);
    dateFundingSoureContainer.appendChild(ispFundingSuourcesSection);

    nameInput = input.build({
      label: 'Name',
      readonly: true,
    });
    prefNameInput = input.build({
      label: 'Preferred Name',
      readonly: true,
    });

    addressInput = input.build({
      label: 'Address',
      readonly: true,
    });

    cityStateZipInput = input.build({
      label: 'City, State, Zip',
      readonly: true,
    });

    countyInput = input.build({
      label: 'County',
      readonly: true,
    });

    emailInput = input.build({
      label: 'Email',
      readonly: true,
      type: 'email',
    });

    phoneInput = input.build({
      label: 'Phone',
      readonly: true,
      type: 'tel',
      attributes: [
        { key: 'maxlength', value: '12' },
        { key: 'pattern', value: '[0-9]{3}-[0-9]{3}-[0-9]{4}' },
      ],
    });

    sexInput = input.build({
      label: 'Sex',
      readonly: true,
      type: '',
      attributes: [{ key: 'maxlength', value: '1' }],
    });

    maritalStatusInput = input.build({
      label: 'Marital Status',
      readonly: true,
    });

    const inputContainer1 = document.createElement('div');
    inputContainer1.classList.add('isp_ci_inputContainer1');
    inputContainer1.appendChild(addressInput);
    inputContainer1.appendChild(cityStateZipInput);
    inputContainer1.appendChild(countyInput);

    const inputContainer2 = document.createElement('div');
    inputContainer2.classList.add('isp_ci_inputContainer2');
    inputContainer2.appendChild(emailInput);
    inputContainer2.appendChild(phoneInput);
    inputContainer2.appendChild(sexInput);
    inputContainer2.appendChild(maritalStatusInput);

    const bestWayToConnectDropdown = dropdown.build({
      dropdownId: 'connectDropdown',
      label: 'Best way to connect with the person',
      style: 'secondary',
      readonly: readOnly,
      callback: async (e, selectedOption) => {
        bestWayToConnectData.bestWayToConnect = selectedOption.value;

        if (bestWayToConnectData.bestWayToConnect === '7') {
          if (bestWayToConnectData.moreDetail === '') {
            otherTextInput.classList.add('error');
          }
        } else {
          otherTextInput.classList.remove('error');
        }
        // update dropdown value to DB
        await summaryAjax.updateBestWayToConnect({
          token: $.session.Token,
          anywAssessmentId: assessmentId,
          bestWayId: selectedOption.value,
        });
      },
    });
    populateBestWayToConnectDropdown(
      bestWayToConnectDropdown,
      bestWayToConnectData.bestWayToConnect,
    );
    const otherTextInput = input.build({
      label: 'More Detail',
      type: 'textarea',
      style: 'secondary',
      readonly: readOnly,
      classNames: 'autosize',
      value: bestWayToConnectData.moreDetail,
      charLimit: charLimits.moreDetail,
      forceCharLimit: true,
      callback: async e => {
        bestWayToConnectData.moreDetail = e.target.value;

        if (bestWayToConnectData.bestWayToConnect === '7') {
          if (bestWayToConnectData.moreDetail === '') {
            otherTextInput.classList.add('error');
          } else {
            otherTextInput.classList.remove('error');
          }
        }
        await summaryAjax.updateMoreDetail({
          token: $.session.Token,
          anywAssessmentId: assessmentId,
          detail: e.target.value,
        });
      },
    });

    inputSection.appendChild(nameInput);
    inputSection.appendChild(prefNameInput);
    inputSection.appendChild(inputContainer1);
    inputSection.appendChild(inputContainer2);
    inputSection.appendChild(bestWayToConnectDropdown);
    inputSection.appendChild(otherTextInput);
    inputSection.appendChild(dateFundingSoureContainer);

    return inputSection;
  }

  function cleanName(val) {
    const fName = val.firstName ? val.firstName.trim() : '';
    const mName = val.middleName ? val.middleName.trim() : '';
    const lName = val.lastName ? val.lastName.trim() : '';

    let combinedName = '';

    if (mName === '') {
      combinedName = `${fName} ${lName}`;
    } else {
      combinedName = `${fName} ${mName} ${lName}`;
    }
    return combinedName;
  }

  function cleanAddress(val, addNewLine = false) {
    const address1 = val.address1.trim();
    const address2 = val.address2.trim();
    let combinedAddress = '';
    if (addNewLine) {
      combinedAddress = `${address1}${address2 !== '' ? '\n' + address2 : ''}`;
    } else {
      combinedAddress = `${address1} ${address2}`;
    }
    return combinedAddress.trim();
  }

  function cleanCityStateZip(val) {
    const city = val.city.trim();
    const state = val.state.trim();
    const zip = val.zip.trim();

    let cityStateZip = '';

    if (city !== '') {
      cityStateZip = city;
    }
    if (state !== '') {
      cityStateZip += `, ${state}`;
    }
    if (zip !== '') {
      cityStateZip += ` ${zip}`;
    }

    return cityStateZip.trim();
  }

  function updateInputsWithDeomgraphicsData() {
    try {
      const name = cleanName(gkDemographicsData);
      const nickName = gkDemographicsData.nickName;
      const address = cleanAddress(gkDemographicsData);
      const cityStateZip = cleanCityStateZip(gkDemographicsData);
      const county = gkDemographicsData.county.trim();
      const phone = gkDemographicsData.phone.trim();
      const email = gkDemographicsData.email;
      const sex = gkDemographicsData.sex.trim();
      const status = gkDemographicsData.status.trim();

      const ph = formatPhone(phone);

      let statusName;
      switch (status) {
        case 'S':
          statusName = 'Single';
          break;
        case 'M':
          statusName = 'Married';
          break;
        case 'D':
          statusName = 'Divorced';
          break;
        case 'P':
          statusName = 'Separated';
          break;
        case 'W':
          statusName = 'Widowed';
          break;
        case 'U':
          statusName = 'Unknown';
          break;
        default:
          statusName = '';
          break;
      }

      // NAME
      nameInput.querySelector('input').value = name;
      // PREF NAME
      prefNameInput.querySelector('input').value = nickName;
      // ADDRESS
      addressInput.querySelector('input').value = address;
      // CITY STATE ZIP
      cityStateZipInput.querySelector('input').value = cityStateZip;
      // COUNTY
      countyInput.querySelector('input').value = county;
      // PHONE
      phoneInput.querySelector('input').value = ph.disp;
      // EMAIL
      emailInput.querySelector('input').value = email;
      // SEX
      sexInput.querySelector('input').value = sex;
      // MARITAL STATUS
      maritalStatusInput.querySelector('input').value = statusName;
    } catch (error) {
      console.warn('ERROR PARSING CONTACT INFORMATION FROM GK');
      console.error(error);
    }
  }

  function validatePhone(val) {
    if (val === '') return true;

    const genTelRegEx = new RegExp(/^\d{3}[- ]?\d{3}[- ]?\d{4}( x\d{4})?|x\d{4}$/im);
    return genTelRegEx.test(val);
  }

  function formatPhone(phNum) {
    if (phNum === '' || !validatePhone(phNum)) return { val: '', disp: '' };
    const phoneDigits = new RegExp(/\d+/g);
    rawNumber = phNum.match(phoneDigits).join('');
    const pos1 = rawNumber.substr(0, 3);
    const pos2 = rawNumber.substr(3, 3);
    const pos3 = rawNumber.substr(6, 4);
    const pos4 = rawNumber.substr(10, 4);
    return {
      val: rawNumber,
      disp: `${pos1}-${pos2}-${pos3} ${pos4}`,
    };
  }

  async function updateFundingSources() {
    const allFundingSources = await contactInformationAjax.getPlanContactFundingSources({
      assessmentId: assessmentId,
    });
    const fsSort = allFundingSources.map(fs => {
      if (isNaN(parseInt(fs.fundingSource))) {
        return fs.fundingSource;
      } else return servicesSupports.getFundingSourceById(fs.fundingSource);
    });
    uniqueFundingSources = fsSort.filter(onlyUnique);
    fundingSourceList.innerText = uniqueFundingSources.join(', ');
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function getSectionMarkup() {
    const fsSort = allFundingSources.map(fs => {
      if (isNaN(parseInt(fs.fundingSource))) {
        return fs.fundingSource;
      } else return servicesSupports.getFundingSourceById(fs.fundingSource);
    });
    uniqueFundingSources = fsSort.filter(onlyUnique);

    const contactSection = document.createElement('div');
    contactSection.classList.add('contactInformation');
    contactSection.id = 'isp_contactInformationSection';
    const heading = document.createElement('h2');
    heading.innerHTML = 'Contact Information';
    heading.classList.add('sectionHeading');
    heading.style.marginBottom = '15px';
    contactSection.appendChild(heading);

    const inputSection = buildContactInputs();
    contactSection.appendChild(inputSection);

    updateInputsWithDeomgraphicsData();

    const importantPeopleSection = isp_ci_importantPeople.buildSection(
      importantPeopleData,
      contactId,
      readOnly,
      gkRelationships,
    );
    contactSection.appendChild(importantPeopleSection);
    const importantGroupsSection = isp_ci_importantGroups.buildSection(
      importantGroupsData,
      contactId,
      readOnly,
    );
    contactSection.appendChild(importantGroupsSection);
    const importantPlacesSection = isp_ci_importantPlaces.buildSection(
      importantPlacesData,
      contactId,
      readOnly,
    );
    contactSection.appendChild(importantPlacesSection);

    return contactSection;
  }

  function planStatusChange() {
    const planStatus = plan.getPlanStatus();
    const planActiveStatus = plan.getPlanActiveStatus();

    if (planActiveStatus && planStatus === 'D' && $.session.planUpdate) {
      readOnly = false;
    } else {
      readOnly = true;
    }

    const contactInformationSection = document.getElementById('isp_contactInformationSection');
    contactInformationSection.innerHTML = '';

    const contactSection = getSectionMarkup();
    contactInformationSection.appendChild(contactSection);
  }

  async function init(pID) {
    assessmentId = pID;
    const planStatus = plan.getPlanStatus();
    const planActiveStatus = plan.getPlanActiveStatus();
    const consumer = plan.getSelectedConsumer();
    const peopleId = consumer.id;
    gkRelationships = planData.getDropdownData().relationships;
    communicationType = planData.getDropdownData().communicationType;
    charLimits = planData.getISPCharacterLimits('contactInfo');

    if (planActiveStatus && planStatus === 'D' && $.session.planUpdate) {
      readOnly = false;
    } else {
      readOnly = true;
    }

    mainCIData = await contactInformationAjax.getPlanContactInformation({
      token: $.session.Token,
      assessmentId: pID,
    });
    const AdditionalSummaryData = await summaryAjax.getAdditionalAssessmentSummaryQuestions({
      anywAssessmentId: assessmentId,
    });
    if (AdditionalSummaryData) {
      if (AdditionalSummaryData.length > 0) {
        bestWayToConnectData = { ...AdditionalSummaryData[0] };
        if (
          bestWayToConnectData.bestWayToConnect === '' ||
          bestWayToConnectData.bestWayToConnect === '0'
        ) {
          bestWayToConnectData.bestWayToConnect = '%';
        }
      }
    } else {
      bestWayToConnectData = {
        moreDetail: '',
        bestWayToConnect: '%',
      };
    }

    contactId = mainCIData.contactId;

    const gkDemographicsDataProm = contactInformationAjax
      .importExistingContactInfo({
        token: $.session.Token,
        peopleId: peopleId,
      })
      .then(res => (gkDemographicsData = res));

    const importantPeopleDataProm = contactInformationAjax
      .getPlanImportantPeople({
        token: $.session.Token,
        contactId: contactId,
      })
      .then(res => (importantPeopleData = res));
    const importantGroupsDataProm = contactInformationAjax
      .getPlanImportantGroups({
        token: $.session.Token,
        contactId: contactId,
      })
      .then(res => (importantGroupsData = res));
    const importantPlacesDataProm = contactInformationAjax
      .getPlanImportantPlaces({
        token: $.session.Token,
        contactId: contactId,
      })
      .then(res => (importantPlacesData = res));

    const fundingSourceProm = contactInformationAjax
      .getPlanContactFundingSources({
        assessmentId: pID,
      })
      .then(res => {
        allFundingSources = res;
      });

    await Promise.all([
      gkDemographicsDataProm,
      importantPeopleDataProm,
      importantGroupsDataProm,
      importantPlacesDataProm,
      fundingSourceProm,
    ]);
  }

  return {
    init,
    getSectionMarkup,
    cleanName,
    cleanAddress,
    cleanCityStateZip,
    formatPhone,
    validatePhone,
    planStatusChange,
    updateFundingSources,
    refreshDropdownData,
  };
})();
