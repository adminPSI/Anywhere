const esignatures = (function () {
  let questions;
  let submitBtn;
  let esignerData = {};
  let formData = {};
  let ssaDropdownData;
  let providerDropdownData;
  let paidSupportProviders;
  let progressDiv;
  let viewerContainer;
  let formContainer;

  function generateReportDownload(tempUserId) {
    esignaturesAjax.downloadReportAfterSigning({ tempUserId }, () => {
      const arr = success._buffer;
      const byteArray = new Uint8Array(arr);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      if ($.session.browser === 'Explorer' || $.session.browser === 'Mozilla') {
        window.navigator.msSaveOrOpenBlob(blob, 'report.pdf');
      } else {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      }

      reports.handledProcessedReport();
      return 'success';
    });
  }

  function setSSADropdownInitialWidth(ssaDropdown, csChangeMindSSAPeopleId) {
    //const ssaDropdown = popup.querySelector('#isp_ic_ssaDropdown');
    ssaDropdown.value = csChangeMindSSAPeopleId;
    let ssaWidth = 150;
    if (ssaDropdown.selectedIndex !== -1) {
        ssaWidth = ssaDropdown.options[ssaDropdown.selectedIndex].text.length * 10;
    }
    ssaDropdown.style.width = `${ssaWidth}px`;
}
function setVendorDropdownInitialWidth(vendorContactDropdown, csContactProviderVendorId) {
    //const vendorContactDropdown = popup.querySelector('#isp_ic_vendorContactDropdown');
    vendorContactDropdown.value = csContactProviderVendorId;
    const vendorWidth =
        (vendorContactDropdown.options[vendorContactDropdown.selectedIndex].text.length + 3) * 10;

    vendorContactDropdown.style.width = `${vendorWidth}px`;
}

function updateSSADropdownWidth(popup) {
  const ssaDropdown = popup.querySelector('#isp_ic_ssaDropdown');
  const hidden_opt = popup.querySelector('#isp_ic_ssaDropdown__width_tmp_option');
  hidden_opt.innerHTML = ssaDropdown.options[ssaDropdown.selectedIndex].textContent;
  const hidden_sel = popup.querySelector('#isp_ic_ssaDropdown__width_tmp_select');
  hidden_sel.style.display = 'initial';
  ssaDropdown.style.width = hidden_sel.clientWidth + 22 + 'px';
  hidden_sel.style.display = 'none';
}
function updateVendorDropdownWidth(popup) {
  const vendorContactDropdown = popup.querySelector('#isp_ic_vendorContactDropdown');
  const hidden_opt = popup.querySelector('#isp_ic_vendorContactDropdown__width_tmp_option');
  hidden_opt.innerHTML =
      vendorContactDropdown.options[vendorContactDropdown.selectedIndex].textContent;
  const hidden_sel = popup.querySelector('#isp_ic_vendorContactDropdown__width_tmp_select');
  hidden_sel.style.display = 'initial';
  vendorContactDropdown.style.width = hidden_sel.clientWidth + 22 + 'px';
  hidden_sel.style.display = 'none';
}


  async function displayFormPopup(tempUserId) {
    progressDiv = document.createElement('div');
    progressDiv.classList.add('test');
    progressDiv.style.height = 'auto';

    const popup = document.createElement('div');
    popup.id = 'formPopup';
    popup.classList.add('popup');

    viewerContainer = document.createElement('div');
    viewerContainer.id = 'viewer';
    viewerContainer.style.width = '800px';
    viewerContainer.style.height = '500px';
    viewerContainer.style.margin = '0';

    popup.appendChild(viewerContainer);

    formContainer = document.createElement('div');
    formContainer.classList.add('formContainer');

    function buildDissentSection() {
      const dissentWrap = document.createElement('div');
      dissentWrap.classList.add('dissentWrap');
      const dissentTitle = document.createElement('h3');
      dissentTitle.classList.add('h3Title');
      dissentTitle.innerText = 'Dissenting Opinion';

      dissentAreaDisagree = input.build({
        label: 'Area Team Member Disagrees',
        value: '',
        type: 'textarea',
        readonly: false,
        classNames: 'autosize',
        charLimit: 2500,
        forceCharLimit: true,
        callback: event => {
          formData.dissentAreaDisagree = event.target.value;
        },
      });

      dissentHowToAddress = input.build({
        label: 'How to Address',
        value: '',
        type: 'textarea',
        readonly: false,
        classNames: 'autosize',
        charLimit: 2500,
        forceCharLimit: true,
        callback: event => {
          formData.dissentHowToAddress = event.target.value;
        },
      });

      dissentWrap.appendChild(dissentTitle);
      dissentWrap.appendChild(dissentAreaDisagree);
      dissentWrap.appendChild(dissentHowToAddress);

      return dissentWrap;
    }

    function getVendorDropdownData() {
      const nonPaidSupportData = providerDropdownData.filter(
        provider => paidSupportProviders.indexOf(provider.vendorId) < 0,
      );
      const paidSupportData = providerDropdownData.filter(
        provider => paidSupportProviders.indexOf(provider.vendorId) >= 0,
      );
      const nonPaidSupportDropdownData = nonPaidSupportData.map(dd => {
        return {
          value: dd.vendorId,
          text: dd.vendorName,
        };
      });
      const paidSupportDropdownData = paidSupportData.map(dd => {
        return {
          value: dd.vendorId,
          text: dd.vendorName,
        };
      });
      return {
        paidSupport: paidSupportDropdownData,
        nonPaidSupport: nonPaidSupportDropdownData,
      };
    }
    function getSSADropdownData() {
      const data = ssaDropdownData.map(ssa => {
        return {
          value: ssa.id,
          text: ssa.name,
        };
      });

      if ($.session.applicationName === 'Advisor') {
        data.unshift({ value: '', text: '[SELECT A QIDP]' });
      } else {
        data.unshift({ value: '', text: '[SELECT AN SSA]' });
      }

      return data;
    }

    function populateDropdownSSA(ssaDropdown, csChangeMindSSAPeopleId) {
      const csChangeMindQuestionDropdownData = getSSADropdownData();

      dropdown.populate(ssaDropdown, csChangeMindQuestionDropdownData, csChangeMindSSAPeopleId);
    }

    function populateDropdownVendor(vendorDropdown, csContactProviderVendorId) {
      //* VENDOR DROPDOWN
      const contactQuestionDropdownData = getVendorDropdownData();
      const nonGroupedDropdownData = [{ value: '', text: '[SELECT A PROVIDER]' }];
      const paidSupportGroup = {
        groupLabel: 'Paid Support Providers',
        groupId: 'isp_ic_providerDropdown_paidSupportProviders',
        dropdownValues: contactQuestionDropdownData.paidSupport,
      };
      const nonPaidSupportGroup = {
        groupLabel: 'Other Providers',
        groupId: 'isp_ic_providerDropdown_nonPaidSupportProviders',
        dropdownValues: contactQuestionDropdownData.nonPaidSupport,
      };

      const groupDropdownData = [];
      if (contactQuestionDropdownData.paidSupport.length > 0) {
        groupDropdownData.push(paidSupportGroup);
      }

      groupDropdownData.push(nonPaidSupportGroup);

      dropdown.groupingPopulate({
        dropdown: vendorDropdown,
        data: groupDropdownData,
        nonGroupedData: nonGroupedDropdownData,
        defaultVal: csContactProviderVendorId,
      });
    }

    function buildStandardQuestionSet() {
      const changeMindQuestion = document.createElement('div');
      changeMindQuestion.classList.add('changeMindQuestion');
      changeMindQuestion.classList.add('ic_questionContainer');

      //Question Text Element, Will contain dropdown too
      const csChangeMindQuestionText = document.createElement('div');
      csChangeMindQuestionText.classList.add('changeMindQuestionText');

      const csChangeMindQuestionDropdown = dropdown.inlineBuild({
        dropdownId: 'isp_ic_ssaDropdown',
      });

      populateDropdownSSA(csChangeMindQuestionDropdown, esignerData.ssaPeopleId);

      // Build Out Question with dropdown
      csChangeMindQuestionText.innerHTML = `<span>I understand that I can change my mind at any time. I just need to let</span> `;
      csChangeMindQuestionText.appendChild(csChangeMindQuestionDropdown);
      csChangeMindQuestionText.innerHTML += ` <span>know.</span>`;
      changeMindQuestion.appendChild(csChangeMindQuestionText);

      changeMindQuestion.addEventListener('change', event => {
        // if event.target.value = 'on' then it wont set the formdata value. 'on' means the radio was changed
        if (event.target.value !== 'on') {
          formData.csChangeMindSSAPeopleId = event.target.value;
          updateSSADropdownWidth(formContainer);
          validateForm();
        }
      });

      const csChangeMindRadioContainer = document.createElement('div');
      csChangeMindRadioContainer.classList.add('ic_questionRadioContainer', 'formError');
      ['Yes', 'No'].forEach(option => {
        const radio = input.buildRadio({
          id: `csChangeMind-${option}`,
          text: option,
          name: 'csChangeMind',
          callback: () => {
            formData.csChangeMind = option === 'Yes' ? 'Y' : 'N';
            csChangeMindRadioContainer.classList.remove('formError');
            validateForm();
          },
        });
        csChangeMindRadioContainer.appendChild(radio);
      });
      changeMindQuestion.appendChild(csChangeMindRadioContainer);

      const contactQuestion = document.createElement('div');
      contactQuestion.classList.add('contactQuestion');

      // Inner Wrap for just Dropdown and Radios *for safari
      const wrap = document.createElement('div');
      wrap.classList.add('ic_questionContainer');

      //Question Text Element, Will contain dropdown too
      const contactQuestionText = document.createElement('div');
      contactQuestionText.classList.add('contactQuestionText');

      //SSA Inline Dropdown
      const csContactQuestionDropdown = dropdown.inlineBuild({
        dropdownId: 'isp_ic_vendorContactDropdown',
      });

      // populate
      populateDropdownVendor(csContactQuestionDropdown, esignerData.vendorId);

      contactQuestion.addEventListener('change', event => {
        // if event.target.value = 'on' then it wont set the formdata value. 'on' means the radio was changed
        if (event.target.value !== 'on') {
          formData.csContactProviderVendorId = event.target.value;
          updateVendorDropdownWidth(formContainer);
          validateForm();
        }
      });

      // Build Out Question with dropdown
      contactQuestionText.innerHTML = `I understand I can contact someone at `;
      contactQuestionText.appendChild(csContactQuestionDropdown);
      contactQuestionText.innerHTML += ' if I want to file a complaint.';
      wrap.appendChild(contactQuestionText);
      contactQuestion.appendChild(wrap);

      const csContactRadioContainer = document.createElement('div');
      csContactRadioContainer.classList.add('ic_questionRadioContainer', 'formError');
      ['Yes', 'No'].forEach(option => {
        const radio = input.buildRadio({
          id: `csContact-${option}`,
          text: option,
          name: 'csContact',
          callback: () => {
            formData.csContact = option === 'Yes' ? 'Y' : 'N';
            csContactRadioContainer.classList.remove('formError');
            validateForm();
          },
        });
        csContactRadioContainer.appendChild(radio);
      });
      wrap.appendChild(csContactRadioContainer);

      const standardQuestions = [
        // {
        //   id: 'csChangeMind',
        //   text: `I understand that I can change my mind at any time. I just need to let ${esignerData.ssaName} know`,
        //   options: ['Yes', 'No'],
        //   defaultVal: ""
        // },
        // {
        //   id: 'csContact',
        //   text: `I understand I can contact someone at ${esignerData.vendorName} if I want to file a complaint.`,
        //   options: ['Yes', 'No'],
        //   defaultVal: ""
        // },
        {
          id: 'csSupportsHealthNeeds',
          text: 'I agree this plan contains supports to meet my health and welfare needs.',
          options: ['Yes', 'No'],
          defaultVal: '',
        },
        {
          id: 'csRightsReviewed',
          text: 'Individual rights have been reviewed with me.',
          options: ['Yes', 'No'],
          defaultVal: '',
        },
        {
          id: 'csAgreeToPlan',
          text: 'I understand the purpose, benefits, and potential risks. I agree and consent to this entire plan.',
          options: ['Yes', 'No'],
          defaultVal: '',
        },
        {
          id: 'csTechnology',
          text: 'Technology solutions have been explored with my team and me.',
          options: ['Yes', 'No'],
          defaultVal: '',
        },
        {
          id: 'csFCOPExplained',
          text: 'Free Choice Of Provider has been explained to me.',
          options: ['Yes', 'No', 'N/A'],
          defaultVal: '',
        },
        {
          id: 'csDueProcess',
          text: 'I have been given my due process rights.',
          options: ['Yes', 'No', 'N/A'],
          defaultVal: '',
        },
        {
          id: 'csResidentialOptions',
          text: 'I have been given information on residential options.',
          options: ['Yes', 'No', 'N/A'],
          defaultVal: '',
        },
      ];

      const standardQuestionsWrap = document.createElement('div');
      standardQuestionsWrap.classList.add('standardQuestionsWrap');

      standardQuestionsWrap.appendChild(changeMindQuestion);
      standardQuestionsWrap.appendChild(contactQuestion);

      standardQuestions.forEach(question => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('ic_questionContainer');
        const questionText = document.createElement('p');
        questionText.classList.add('standardQuestionText');
        questionText.innerText = question.text;

        const questionRadioContainer = document.createElement('div');
        questionRadioContainer.classList.add('ic_questionRadioContainer');

        if (question.defaultVal === '') {
          questionRadioContainer.classList.add('formError');
        }

        question.options.forEach(option => {
          const radio = input.buildRadio({
            id: `${question.id}-${option}`,
            text: option,
            name: question.id,
            callback: () => {
              switch (option) {
                case 'Yes':
                  formData[question.id] = 'Y';
                  break;
                case 'No':
                  formData[question.id] = 'N';
                  break;
                case 'N/A':
                  formData[question.id] = 'NA';
                  break;
                default:
                  formData[question.id] = '';
                  break;
              }
              questionRadioContainer.classList.remove('formError');
              validateForm();
            },
          });
          questionRadioContainer.appendChild(radio);
        });

        questionContainer.appendChild(questionText);
        questionContainer.appendChild(questionRadioContainer);

        standardQuestionsWrap.appendChild(questionContainer);
      });

      return standardQuestionsWrap;
    }

    function buildConsentSection() {
      const consentWrap = document.createElement('div');
      consentWrap.classList.add('consentWrap');

      const consentHeader = document.createElement('h3');
      consentHeader.classList.add('h3Title');
      consentHeader.innerText = 'Consent Statements';
      consentWrap.appendChild(consentHeader);

      const standardQuestions = buildStandardQuestionSet();

      consentWrap.appendChild(standardQuestions);

      return consentWrap;
    }

    function validateForm() {
      const radios = document.querySelectorAll('.ic_questionRadioContainer input[type="radio"]');
      const signatureInput = document.getElementById('signatureInput');
      const ssaDropdown = document.getElementById('isp_ic_ssaDropdown');
      const vendorDropdown = document.getElementById('isp_ic_vendorContactDropdown');

      let allFilled = true;

      radios.forEach(radio => {
        const name = radio.name;
        if (!document.querySelector(`input[name="${name}"]:checked`)) {
          allFilled = false;
        }
      });

      if (ssaDropdown && vendorDropdown) {
        if (ssaDropdown.value === '' || vendorDropdown.value === '') {
          allFilled = false;
        }
      }

      if (signatureInput.value === '' || !allFilled) {
        if (!submitBtn.classList.contains('disabled')) {
          submitBtn.classList.add('disabled');
        }
        submitBtn.disabled = true;
      } else {
        submitBtn.classList.remove('disabled');
        submitBtn.disabled = false;
      }
    }

    submitBtn = button.build({
      id: 'eSigSubmitBtn',
      text: 'Sign Document',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        const updateQuestions = await _UTIL.fetchData('updateESignFormValues', { formData });

        const downloadExitPopup = document.createElement('div');
        downloadExitPopup.classList.add('popup', 'downloadExitPopup');

        var paragraph = document.createElement('p');
        paragraph.textContent =
          'You have successfully signed this plan! You will receive a confirmation email shortly. The Case Manager will also be notified that you signed the plan. Please close your browser tab to complete the process.';

        const downloadPlanBtn = button.build({
          id: 'downloadPlanBtn',
          text: 'Download Plan',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            generateReportDownload(tempUserId);
          },
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(paragraph);
        btnWrap.appendChild(downloadPlanBtn);

        downloadExitPopup.appendChild(paragraph);
        downloadExitPopup.appendChild(btnWrap);
        const overlay = document.querySelector('.overlay');
        overlay.classList.add('visible');

        const formPopup = document.getElementById('formPopup');
        formPopup.remove();

        document.body.appendChild(downloadExitPopup);
      },
    });
    submitBtn.classList.add('disabled');

    if (
      esignerData.teamMemberType === 'Parent/Guardian' ||
      esignerData.teamMemberType === 'Parent' ||
      esignerData.teamMemberType === 'Guardian' ||
      esignerData.teamMemberType === 'Person Supported'
    ) {
      questions = buildConsentSection();
      formContainer.appendChild(questions);
    }
    const dissentingSection = buildDissentSection();

    formContainer.appendChild(dissentingSection);

    const signatureDisplay = document.createElement('div');
    signatureDisplay.id = 'signatureDisplay';

    const signatureInput = input.build({
      id: 'signatureInput',
      type: 'input',
      label: 'Name',
      style: 'secondary',
    });

    signatureInput.classList.add('errorPopup')

    signatureInput.addEventListener('input', function (event) {
      const value = event.target.value;
      signatureDisplay.textContent = value;
  
      if (value === '') {
        signatureInput.classList.add('errorPopup');
      } else {
        signatureInput.classList.remove('errorPopup');
      }
  
      validateForm();
  });
  

    formContainer.appendChild(signatureDisplay);
    formContainer.appendChild(signatureInput);

    popup.appendChild(formContainer);
    formContainer.appendChild(submitBtn);

    progressDiv.appendChild(popup);
    document.body.appendChild(progressDiv);
    //document.body.appendChild(popup);

    popup.style.display = 'block';

    esignaturesAjax.openESignaturesPDFEditor(tempUserId, viewerContainer);
  }

  async function init(tempUserId) {
    const eSignerDataResult = await _UTIL.fetchData('getESignerData', { tempUserId });
    esignerData = eSignerDataResult.getESignerDataResult;

    formData = {
      peopleId: esignerData.peopleId,
      planId: esignerData.planId,
      csChangeMind: '',
      csChangeMindSSAPeopleId: '',
      csContact: '',
      csContactProviderVendorId: '',
      csContactInput: '',
      csRightsReviewed: '',
      csAgreeToPlan: '',
      csFCOPExplained: '',
      csDueProcess: '',
      csResidentialOptions: '',
      csSupportsHealthNeeds: '',
      csTechnology: '',
      dissentAreaDisagree: '',
      dissentHowToAddress: '',
      applicationName: esignerData.applicationName,
    };

    async function loadDropdownData() {
      providerDropdownData = await consentAndSignAjax.getPlanInformedConsentVendors({//
        token: $.session.Token,
        peopleid: esignerData.peopleId,
      });
      // this is where the DDL gets its data -- people, user permissions, etc tables
      ssaDropdownData = await consentAndSignAjax.getPlanInformedConsentSSAs({
        token: $.session.Token,
      });
    }

    await loadDropdownData();

    paidSupportProviders = servicesSupports.getSelectedVendorIds();

    displayFormPopup(tempUserId);

    const ssaDropdown = document.getElementById('isp_ic_ssaDropdown');
    const vendorDropdown = document.getElementById('isp_ic_vendorContactDropdown');

    // set the initial value and width of the dropdown value if they 
    if (ssaDropdown) {
      const ssaDropdown = document.getElementById('isp_ic_ssaDropdown');
      setSSADropdownInitialWidth(ssaDropdown, esignerData.ssaPeopleId);
    }
    
    if (vendorDropdown) {
      const vendorDropdown = document.getElementById('isp_ic_vendorContactDropdown');
     setVendorDropdownInitialWidth(vendorDropdown, esignerData.vendorId);
    }
  }

  return {
    init,
  };
})();
