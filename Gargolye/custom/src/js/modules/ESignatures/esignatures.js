const esignatures = (function () {
  let questions;
  let submitBtn;
  let esignerData = {};
  let formData = {};

  function generateReportDownload(tempUserId) {
    esignaturesAjax.downloadReportAfterSigning({ tempUserId },
      () => {
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
      },
    );
  }

  async function displayFormPopup(tempUserId) {
    const testDiv = document.createElement('div');
    testDiv.classList.add('test');
    testDiv.style.height = 'auto';

    const popup = document.createElement('div');
    popup.id = 'formPopup';
    popup.classList.add('popup');

    const viewerContainer = document.createElement('div');
    viewerContainer.id = 'viewer';
    viewerContainer.style.width = '800px';
    viewerContainer.style.height = '500px';
    viewerContainer.style.margin = '0';

    popup.appendChild(viewerContainer);

    const formContainer = document.createElement('div');
    formContainer.classList.add('formContainer');

    function buildDissentSection() {
      const dissentWrap = document.createElement('div');
      dissentWrap.classList.add('dissentWrap');
      const dissentTitle = document.createElement('h3');
      dissentTitle.classList.add('h3Title');
      dissentTitle.innerText = 'Dissenting Opinion';

      dissentAreaDisagree = input.build({
        label: 'Area Team Member Disagrees',
        value: "",
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
        value: "",
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

    function buildStandardQuestionSet() {
      const standardQuestions = [
        {
          id: 'csChangeMind',
          text: `I understand that I can change my mind at any time. I just need to let ${esignerData.ssaName} know`,
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csContact',
          text: `I understand I can contact someone at ${esignerData.vendorName} if I want to file a complaint.`,
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csSupportsHealthNeeds',
          text: 'I agree this plan contains supports to meet my health and welfare needs.',
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csSupportsHealthNeeds',
          text: 'I agree this plan contains supports to meet my health and welfare needs.',
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csRightsReviewed',
          text: 'Individual rights have been reviewed with me.',
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csAgreeToPlan',
          text: 'I understand the purpose, benefits, and potential risks. I agree and consent to this entire plan.',
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csTechnology',
          text: 'Technology solutions have been explored with my team and me.',
          options: ['Yes', 'No'],
          defaultVal: ""
        },
        {
          id: 'csFCOPExplained',
          text: 'Free Choice Of Provider has been explained to me.',
          options: ['Yes', 'No', 'N/A'],
          defaultVal: ""
        },
        {
          id: 'csDueProcess',
          text: 'I have been given my due process rights.',
          options: ['Yes', 'No', 'N/A'],
          defaultVal: ""
        },
        {
          id: 'csResidentialOptions',
          text: 'I have been given information on residential options.',
          options: ['Yes', 'No', 'N/A'],
          defaultVal: ""
        },
      ];
    
      const standardQuestionsWrap = document.createElement('div');
      standardQuestionsWrap.classList.add('standardQuestionsWrap');
    
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
    
      let allFilled = true;
    
      radios.forEach(radio => {
        const name = radio.name;
        if (!document.querySelector(`input[name="${name}"]:checked`)) {
          allFilled = false;
        }
      });
    
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
        downloadExitPopup.classList.add('popup');

        var paragraph = document.createElement('p');
        paragraph.textContent = 'You have successfully signed this plan! You will receive a confirmation email shortly. The Case Manager will also be notified that you signed the plan.';

        const downloadPlanBtn = button.build({
          id: 'downloadPlanBtn',
          text: 'Download Plan',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            generateReportDownload(tempUserId);
          },
        });

        const exitBtn = button.build({
          id: 'exitBtn',
          text: 'Exit',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            window.location.href = 'about:blank';
          },
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(paragraph);
        btnWrap.appendChild(downloadPlanBtn);
        btnWrap.appendChild(exitBtn);

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

    if (esignerData.teamMemberType === 'Parent/Guardian' || esignerData.teamMemberType === 'Parent' || esignerData.teamMemberType === 'Guardian') {
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

    signatureInput.addEventListener('input', function (event) {
      validateForm();
      signatureDisplay.textContent = event.target.value;
    });
    

    formContainer.appendChild(signatureDisplay);
    formContainer.appendChild(signatureInput);

    popup.appendChild(formContainer);
    formContainer.appendChild(submitBtn);

    testDiv.appendChild(popup);
    document.body.appendChild(testDiv);
    //document.body.appendChild(popup);

    popup.style.display = 'block';

    esignaturesAjax.openESignaturesPDFEditor(tempUserId);
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
      applicationName: esignerData.applicationName
    };

    displayFormPopup(tempUserId);
  }

  return {
    init,
  };
})();
