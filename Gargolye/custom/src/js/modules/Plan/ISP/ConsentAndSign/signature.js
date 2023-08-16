const csSignature = (() => {
  let selectedMemberData;
  let isNew;
  let isSigned;
  let readOnly;
  let showConsentStatments;
  let signatureType;
  // dom
  let signaturePopup;
  let signatureSection;
  let changeMindQ;
  let complaintQ;
  let dissentAreaDisagree;
  let dissentHowToAddress;
  let standardQuestions; // these are all the radio questions
  let sigPad;
  let sigBody;
  let sigCanvas;
  let saveBtn;
  // other
  let allowSignClear;
  let clearSignature = false;
  let characterLimits;
  let prevDissentData = {};

  //*------------------------------------------------------
  //* UTIL
  //*------------------------------------------------------
  function checkSignautrePopupForErrors() {
    const errors = signaturePopup.querySelectorAll('.error');

    if (errors.length > 0) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function parseSignatureData() {
    if (sigPad === undefined) {
      return '';
    }
    const dataUrl = sigPad.toDataURL();
    const signatureDataUrl = dataUrl.replace('data:image/png;base64,', '');
    if (sigPad.isEmpty()) return '';
    return signatureDataUrl;
  }
  async function saveFromSignature(sigPadData) {
    let insertSuccess;

    pendingSave.show('Saving...');

    if (sigPadData === emptySignatureDataURL || sigPadData === '') {
      sigPadData = '';
    } else {
      selectedMemberData.signature = sigPadData;
    }

    if (isNew) {
      insertSuccess = await planConsentAndSign.insertNewTeamMember(selectedMemberData);
    } else {
      selectedMemberData.dateSigned = UTIL.formatDateToIso(
        dates.removeTimestamp(selectedMemberData.dateSigned),
      );
      await planConsentAndSign.updateTeamMember(selectedMemberData);
      insertSuccess = true;
    }

    if (insertSuccess) {
      pendingSave.fulfill('Saved');
      setTimeout(() => {
        const savePopup = document.querySelector('.successfulSavePopup');
        DOM.ACTIONCENTER.removeChild(savePopup);
        POPUP.hide(signaturePopup);
        planConsentAndSign.refreshTable();
      }, 700);
    } else {
      pendingSave.reject('Failed to save, please try again.');
      console.error(insertSuccess);
      setTimeout(() => {
        const failPopup = document.querySelector('.failSavePopup');
        DOM.ACTIONCENTER.removeChild(failPopup);
        document.getElementById('sig_signPopup').style.removeProperty('display');
      }, 2000);
    }
  }
  function showWarningPopup(sigPadData) {
    UTIL.warningPopup({
      message:
        'Once the ISP signature is submitted you will not be able to change it.  Do you want to proceed?',
      hideX: true,
      accept: {
        text: 'Yes',
        callback: () => saveFromSignature(sigPadData),
      },
      reject: {
        text: 'No',
        callback: () => {
          overlay.show();
          signaturePopup.style.removeProperty('display');
        },
      },
    });
  }
  function checkForAllowClearSignature() {
    if (!isSigned) return false;

    const planStatus = plan.getPlanStatus();
    const activePlan = plan.getPlanActiveStatus();

    if ($.session.planClearSignature && planStatus === 'D' && activePlan === true) {
      if ($.session.oneSpan && signatureType === '1') {
        return false;
      }

      return true;
    }

    return false;
  }
  function clearInputsOnSignatureClear() {
    const dissentAreaInput = dissentAreaDisagree.querySelector('.input-field__input');
    const dissentHowToInput = dissentHowToAddress.querySelector('.input-field__input');
    dissentAreaInput.value = '';
    dissentHowToInput.value = '';
    dissentAreaInput.style.pointerEvents = 'all';
    dissentHowToInput.style.pointerEvents = 'all';
    dissentAreaInput.removeAttribute('readonly');
    dissentHowToInput.removeAttribute('readonly');
    dissentAreaDisagree.classList.remove('disabled');
    dissentHowToAddress.classList.remove('disabled');

    if (signatureType === '1') {
      const allRadios = [...signaturePopup.querySelectorAll('.ic_questionRadioContainer')];

      // if this works remove below for each's
      allRadios.forEach(radio => {
        radio.classList.remove('disabled');
        radio.classList.add('error');
        const radios = [...radio.querySelectorAll('.radio')];
        radios.forEach(radio => {
          const input = radio.querySelector('input');
          input.checked = false;
        });
      });
    }

    const prompt = document.createElement('p');
    prompt.innerText = `By checking the boxes below, I agree that this plan reflects actions, services, and supports as requested by the person listed. As a provider, I agree to the services listed in this plan for which I am named a responsible party. I understand that I may revoke my consent at any time verbally or in writing in accordance with DODD rules.`;
    prompt.style.marginBottom = '14px';
    signaturePopup.insertBefore(prompt, signatureSection);

    checkSignautrePopupForErrors();
  }
  function clearMemberDataOnClear() {
    isSigned = false;

    selectedMemberData.attachmentId = '';
    selectedMemberData.dateSigned = '';
    selectedMemberData.description = '';
    selectedMemberData.csChangeMind = '';
    selectedMemberData.csContact = '';
    selectedMemberData.csSupportsHealthNeeds = '';
    selectedMemberData.csRightsReviewed = '';
    selectedMemberData.csAgreeToPlan = '';
    selectedMemberData.csTechnology = '';
    selectedMemberData.csFCOPExplained = '';
    selectedMemberData.csDueProcess = '';
    selectedMemberData.csResidentialOptions = '';
    selectedMemberData.dissentAreaDisagree = '';
    selectedMemberData.dissentHowToAddress = '';
  }
  function resizeSigCanvas(sigWrap) {
    // <h3 class=\"h3Title\">Signature</h3>
    // <div class=\"signature-pad\">
    //    <div class=\"signature-pad--body\">
    //        <canvas class=\"ispCanvas\" width=\"0\" style=\"touch-action: none;\"></canvas>
    //    </div >
    // </div >
    // <button class=\"btn btn--secondary btn--outlined\">clear</button>"

    const sigBody = sigWrap.querySelector('.signature-pad--body');
    const sigCanvas = sigWrap.querySelector('.ispCanvas');

    sigCanvas.width = sigBody.offsetWidth;
  }

  //*------------------------------------------------------
  //* MARKUP
  //*------------------------------------------------------

  function showClearConfirmationPopup() {
    const confirmPop = POPUP.build({
      id: 'clearSignConfirmPopup',
      hideX: true,
    });
    const message = document.createElement('p');
    message.innerText = `Are you sure you would like to remove this signature and any associated consent and dissenting opinions? This cannot be undone.`;

    const yesBtn = button.build({
      text: 'yes',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        yesBtn.classList.add('disabled');
        const planId = plan.getCurrentPlanId();
        const attachmentId = selectedMemberData.attachmentId;
        clearSignature = true;
        clearMemberDataOnClear();
        clearInputsOnSignatureClear();
        const updatedSignatureSection = buildSignatureSection();
        signaturePopup.replaceChild(updatedSignatureSection, signatureSection);
        signatureSection = updatedSignatureSection;
        resizeSigCanvas(updatedSignatureSection);
        await planConsentAndSign.updateTeamMember(selectedMemberData, clearSignature);
        if (signatureType === '2') {
          planAjax.deletePlanAttachment(planId, attachmentId);
        }
        yesBtn.classList.remove('disabled');
        DOM.ACTIONCENTER.removeChild(confirmPop);
        planConsentAndSign.refreshTable();
      },
    });
    const noBtn = button.build({
      text: 'no',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        DOM.ACTIONCENTER.removeChild(confirmPop);
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    confirmPop.appendChild(message);
    confirmPop.appendChild(btnWrap);

    POPUP.show(confirmPop);
  }
  function buildSignatureSection() {
    const signatureWrap = document.createElement('div');
    signatureWrap.classList.add('signatureWrap');
    const signatureTitle = document.createElement('h3');
    signatureTitle.classList.add('h3Title');
    signatureTitle.innerText = 'Signature';
    signatureWrap.appendChild(signatureTitle);

    if (selectedMemberData.description) {
      const innerWrap = document.createElement('div');
      innerWrap.classList.add('innerWrap');

      const attachmentDesc = document.createElement('p');
      attachmentDesc.innerText = selectedMemberData.description;
      attachmentDesc.classList.add('signAttachmentDesc');

      attachmentDesc.addEventListener('click', () => {
        var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/viewPlanAttachment/`;
        var successFunction = function (resp) {
          var res = JSON.stringify(response);
        };

        var form = document.createElement('form');
        form.setAttribute('action', action);
        form.setAttribute('method', 'POST');
        form.setAttribute('target', '_blank');
        form.setAttribute('enctype', 'application/json');
        form.setAttribute('success', successFunction);
        var tokenInput = document.createElement('input');
        tokenInput.setAttribute('name', 'token');
        tokenInput.setAttribute('value', $.session.Token);
        tokenInput.id = 'token';
        var attachmentInput = document.createElement('input');
        attachmentInput.setAttribute('name', 'attachmentId');
        attachmentInput.setAttribute('value', selectedMemberData.attachmentId);
        attachmentInput.id = 'attachmentId';
        var sectionInput = document.createElement('input');
        sectionInput.setAttribute('name', 'section');
        sectionInput.setAttribute('value', 'junk');
        sectionInput.id = 'section';

        form.appendChild(tokenInput);
        form.appendChild(attachmentInput);
        form.appendChild(sectionInput);
        form.style.position = 'absolute';
        form.style.opacity = '0';
        document.body.appendChild(form);

        form.submit();
        form.remove();
      });
      innerWrap.appendChild(attachmentDesc);

      // signature date
      let signDate = UTIL.formatDateToIso(dates.removeTimestamp(selectedMemberData.dateSigned));
      const date = input.build({
        type: 'date',
        label: 'Signature Date',
        style: 'secondary',
        value: signDate,
        classNames: 'disabled',
      });
      if (
        selectedMemberData.signatureType === 'In-Person' ||
        selectedMemberData.signatureType === '2'
      ) {
        innerWrap.appendChild(date);
      }

      signatureWrap.appendChild(innerWrap);
      return signatureWrap;
    } else if (
      selectedMemberData.signatureType === 'In-Person' ||
      selectedMemberData.signatureType === '2'
    ) {
      selectedMemberData.hasWetSignature = false;

      const innerWrap = document.createElement('div');
      innerWrap.classList.add('innerWrap');

      // signature attachment
      const attachmentInput = document.createElement('input');
      attachmentInput.type = 'file';
      attachmentInput.classList.add('input-field__input', 'attachmentInput');
      attachmentInput.addEventListener('change', async e => {
        const attPromise = new Promise(resolve => {
          const target = e.target;
          const file = target.files.item(0);
          const fileName = file.name;
          const fileType = fileName.split('.').pop();

          selectedMemberData.description = fileName;
          selectedMemberData.attachmentType = fileType;
          selectedMemberData.hasWetSignature = true;

          new Response(file).arrayBuffer().then(res => {
            selectedMemberData.attachment = res;
            resolve();
          });
        });

        await Promise.all([attPromise]);
      });

      // signature date
      let signDate = selectedMemberData.dateSigned
        ? UTIL.formatDateToIso(dates.removeTimestamp(selectedMemberData.dateSigned))
        : null;
      const date = input.build({
        type: 'date',
        label: 'Signature Date',
        style: 'secondary',
        value: signDate ? signDate : '',
        callback: e => {
          selectedMemberData.dateSigned = e.target.value;

          if (!selectedMemberData.dateSigned) {
            date.classList.add('error');
            if (signDate) {
              date.classList.remove('error');
            }
          } else {
            date.classList.remove('error');
          }

          checkSignautrePopupForErrors();
        },
      });

      if (!signDate) {
        date.classList.add('error');
      }

      innerWrap.appendChild(attachmentInput);
      innerWrap.appendChild(date);

      signatureWrap.appendChild(innerWrap);

      return signatureWrap;
    } else {
      selectedMemberData.description = '';
      selectedMemberData.attachmentType = '';
      selectedMemberData.hasWetSignature = false;
      selectedMemberData.attachment = '';
    }

    const sigDiv = document.createElement('div');
    sigDiv.classList.add('signature-pad');

    sigBody = document.createElement('div');
    sigBody.classList.add('signature-pad--body');
    sigDiv.appendChild(sigBody);

    if (readOnly) {
      sigBody.classList.add('disabled');
    }

    if (!isSigned) {
      sigCanvas = document.createElement('canvas');
      sigCanvas.classList.add('ispCanvas');
      sigBody.appendChild(sigCanvas);
      sigPad = new SignaturePad(sigCanvas);
    } else {
      const sigImage = document.createElement('img');
      sigImage.src = selectedMemberData.signature;
      sigImage.addEventListener('contextmenu', event => {
        event.preventDefault();
        return false;
      });
      sigImage.addEventListener('mousedown', event => {
        event.preventDefault();
        return false;
      });
      sigImage.style.pointerEvents = 'none';
      sigBody.appendChild(sigImage);
    }

    // this clear signature button is only for the sig pad canvas
    const clearSignatureBtn = button.build({
      id: '',
      text: 'clear',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        sigPad.clear();
      },
    });

    signatureWrap.appendChild(sigDiv);
    if (!isSigned && !readOnly) {
      signatureWrap.appendChild(clearSignatureBtn);
    }

    return signatureWrap;
  }
  function buildDissentSection() {
    const dissentWrap = document.createElement('div');
    dissentWrap.classList.add('dissentWrap');
    const dissentTitle = document.createElement('h3');
    dissentTitle.classList.add('h3Title');
    dissentTitle.innerText = 'Dissenting Opinion';
    // questions
    dissentAreaDisagree = input.build({
      label: 'Area Team Member Disagrees',
      value: selectedMemberData.dissentAreaDisagree,
      type: 'textarea',
      readonly: isSigned || readOnly,
      classNames: 'autosize',
      charLimit: characterLimits.dissentAreaDisagree,
      forceCharLimit: true,
      callback: event => {
        selectedMemberData.dissentAreaDisagree = event.target.value;
      },
    });
    dissentHowToAddress = input.build({
      label: 'How to Address',
      value: selectedMemberData.dissentHowToAddress,
      type: 'textarea',
      readonly: isSigned || readOnly,
      classNames: 'autosize',
      charLimit: characterLimits.dissentHowToAddress,
      forceCharLimit: true,
      callback: event => {
        selectedMemberData.dissentHowToAddress = event.target.value;
      },
    });
    dissentWrap.appendChild(dissentTitle);
    dissentWrap.appendChild(dissentAreaDisagree);
    dissentWrap.appendChild(dissentHowToAddress);

    if (isSigned || readOnly) {
      dissentAreaDisagree.classList.add('disabled');
      dissentHowToAddress.classList.add('disabled');
    }

    return dissentWrap;
  }
  function buildStandardQuestionSet() {
    const standardQuestions = [
      {
        id: 'csSupportsHealthNeeds',
        text: 'I agree this plan contains supports to meet my health and welfare needs.',
        options: ['Yes', 'No'],
        defaultVal: selectedMemberData.csSupportsHealthNeeds,
      },
      {
        id: 'csRightsReviewed',
        text: 'Individual rights have been reviewed with me.',
        options: ['Yes', 'No'],
        defaultVal: selectedMemberData.csRightsReviewed,
      },
      {
        id: 'csAgreeToPlan',
        text: 'I understand the purpose, benefits, and potential risks. I agree and consent to this entire plan.',
        options: ['Yes', 'No'],
        defaultVal: selectedMemberData.csAgreeToPlan,
      },
      {
        id: 'csTechnology',
        text: 'Technology solutions have been explored with my team and me.',
        options: ['Yes', 'No'],
        defaultVal: selectedMemberData.csTechnology,
      },
      {
        id: 'csFCOPExplained',
        text: 'Free Choice Of Provider has been explained to me.',
        options: ['Yes', 'No', 'N/A'],
        defaultVal: selectedMemberData.csFCOPExplained,
      },
      {
        id: 'csDueProcess',
        text: 'I have been given my due process rights.',
        options: ['Yes', 'No', 'N/A'],
        defaultVal: selectedMemberData.csDueProcess,
      },
      {
        id: 'csResidentialOptions',
        text: 'I have been given information on residential options.',
        options: ['Yes', 'No', 'N/A'],
        defaultVal: selectedMemberData.csResidentialOptions,
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
      if (readOnly || isSigned) {
        questionRadioContainer.classList.add('disabled');
      }

      if (question.defaultVal === '') {
        questionRadioContainer.classList.add('error');
      }

      question.options.forEach(option => {
        let checked;
        switch (question.defaultVal) {
          case 'Y':
            if (option === 'Yes') {
              checked = true;
            } else checked = false;
            break;
          case 'N':
            if (option === 'No') {
              checked = true;
            } else checked = false;
            break;
          case 'NA':
            if (option === 'N/A') {
              checked = true;
            } else checked = false;
            break;
          default:
            checked = false;
            break;
        }
        const radio = input.buildRadio({
          id: `${question.id}-${option}`,
          text: option,
          name: question.id,
          isChecked: checked,
          isDisabled: this.readOnly,
          callback: () => {
            let dbVal;
            switch (option) {
              case 'Yes':
                dbVal = 'Y';
                break;
              case 'No':
                dbVal = 'N';
                break;
              case 'N/A':
                dbVal = 'NA';
                break;
              default:
                dbVal = '';
                break;
            }
            questionRadioContainer.classList.remove('error');
            checkSignautrePopupForErrors();
            selectedMemberData[question.id] = dbVal;
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
  function getChangeMindMarkup() {
    // get markup
    const changeMindQuestion = planConsentAndSign.buildChangeMindQuestion(
      {
        csChangeMindSSAPeopleId: selectedMemberData.csChangeMindSSAPeopleId,
        csChangeMind: selectedMemberData.csChangeMind,
      },
      'sign',
      isSigned,
    );

    // set event
    changeMindQuestion.addEventListener('change', event => {
      const target = event.target;
      const targetId = target.id;

      if (targetId === 'CS_Change_Mind-yes' || targetId === 'CS_Change_Mind-no') {
        selectedMemberData.csChangeMind = targetId === 'CS_Change_Mind-yes' ? 'Y' : 'N';
        target.parentNode.parentNode.classList.remove('error');
      }

      checkSignautrePopupForErrors();
    });

    // set default bc populatedropdown won't
    const select = changeMindQuestion.querySelector('select');
    select.value = selectedMemberData.csChangeMindSSAPeopleId;

    return changeMindQuestion;
  }
  function getContactMarkup() {
    // get markup
    const contactQuestion = planConsentAndSign.buildContactQuestion(
      {
        csContactProviderVendorId: selectedMemberData.csContactProviderVendorId,
        csContactInput: selectedMemberData.csContactInput,
        csContact: selectedMemberData.csContact,
        ssaId: selectedMemberData.csChangeMindSSAPeopleId,
      },
      'sign',
      isSigned,
    );

    // set event
    contactQuestion.addEventListener('change', event => {
      const target = event.target;
      const targetId = target.id;

      if (targetId === 'CS_Contact-yes' || targetId === 'CS_Contact-no') {
        selectedMemberData.csContact = targetId === 'CS_Contact-yes' ? 'Y' : 'N';
        target.parentNode.parentNode.classList.remove('error');
      }

      checkSignautrePopupForErrors();
    });

    // set default bc populatedropdown won't
    const select = contactQuestion.querySelector('select');
    select.value = selectedMemberData.csContactProviderVendorId;

    return contactQuestion;
  }
  function buildConsentSection() {
    const consentWrap = document.createElement('div');
    consentWrap.classList.add('consentWrap');

    const consentHeader = document.createElement('h3');
    consentHeader.classList.add('h3Title');
    consentHeader.innerText = 'Consent Statements';
    consentWrap.appendChild(consentHeader);

    standardQuestions = buildStandardQuestionSet();

    if (showConsentStatments) {
      changeMindQ = getChangeMindMarkup();
      complaintQ = getContactMarkup();
      consentWrap.appendChild(changeMindQ);
      consentWrap.appendChild(complaintQ);
    }

    consentWrap.appendChild(standardQuestions);

    return consentWrap;
  }

  //*------------------------------------------------------
  //* MAIN
  //*------------------------------------------------------
  function showPopup({ isNewMember, isReadOnly, memberData }) {
    isNew = isNewMember;
    const prevDateSigned = memberData.dateSigned;
    isSigned = memberData.dateSigned !== '';
    clearSignature = false;
    signatureType = memberData.signatureType;

    if (memberData.signatureType === '2' && memberData.description === '') {
      isSigned = false;
    }
    readOnly = isReadOnly;
    selectedMemberData = memberData;
    prevDissentData = {
      dissentHowToAddress: selectedMemberData.dissentHowToAddress,
      dissentAreaDisagree: selectedMemberData.dissentAreaDisagree,
    };
    showConsentStatments = planConsentAndSign.isTeamMemberConsentable(memberData.teamMember);
    characterLimits = planData.getISPCharacterLimits('consentAndSign');

    //*--------------------------------------
    //* POPUP
    //*--------------------------------------
    signaturePopup = POPUP.build({
      id: 'sig_signPopup',
      hideX: true,
    });

    //* PROMPT
    //*------------------------------
    const prompt = document.createElement('p');
    prompt.innerText = `By checking the boxes below, I agree that this plan reflects actions, services, and supports as requested by the person listed. As a provider, I agree to the services listed in this plan for which I am named a responsible party. I understand that I may revoke my consent at any time verbally or in writing in accordance with DODD rules.`;
    prompt.style.marginBottom = '14px';

    //* SIGNATURE
    signatureSection = buildSignatureSection();

    //* DISSENT
    const dissentSection = buildDissentSection();

    //* CONSENT
    const consentSection = buildConsentSection();

    //* SAVE/CANCEL BUTTONS
    //*------------------------------
    allowSignClear = checkForAllowClearSignature(memberData.signatureType);
    const clearSignatureBtn = button.build({
      id: 'clearSigBtn',
      text: 'clear',
      style: 'danger',
      type: 'contained',
      callback: () => {
        clearSignatureBtn.classList.add('disabled');
        showClearConfirmationPopup();
        clearSignatureBtn.classList.remove('disabled');
      },
    });
    saveBtn = button.build({
      id: 'saveSigBtn',
      text: allowSignClear ? 'update' : 'save',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        let sigPadData = parseSignatureData();
        signaturePopup.style.display = 'none';

        if (
          selectedMemberData.signatureType === 'In-Person' ||
          selectedMemberData.signatureType === '2'
        ) {
          if (!selectedMemberData.description || selectedMemberData.description === '') {
            saveFromSignature();
          } else {
            showWarningPopup();
          }
        } else {
          if (sigPadData === emptySignatureDataURL || sigPadData === '') {
            saveFromSignature();
          } else {
            showWarningPopup(sigPadData);
          }
        }
      },
    });
    const cancelText = (isSigned || readOnly) && !allowSignClear ? 'close' : 'cancel';
    const cancelBtn = button.build({
      text: cancelText,
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        selectedMemberData.dissentAreaDisagree = prevDissentData.dissentAreaDisagree;
        selectedMemberData.dissentHowToAddress = prevDissentData.dissentHowToAddress;

        if (!isSigned) {
          selectedMemberData.dateSigned = prevDateSigned;
          selectedMemberData.description = '';
          selectedMemberData.attachmentType = '';
          selectedMemberData.hasWetSignature = false;
          selectedMemberData.attachment = '';
        }

        POPUP.hide(signaturePopup);
      },
    });

    const saveCancelWrap = document.createElement('div');
    saveCancelWrap.classList.add('btnWrap');

    if (allowSignClear) {
      saveCancelWrap.appendChild(clearSignatureBtn);
      saveCancelWrap.appendChild(saveBtn);
    } else {
      if (!isSigned && !readOnly) saveCancelWrap.appendChild(saveBtn);
    }
    saveCancelWrap.appendChild(cancelBtn);

    //* BUILD IT
    //*------------------------------
    if (!isSigned && !readOnly) {
      signaturePopup.appendChild(prompt);
    }

    signaturePopup.appendChild(signatureSection);

    if (showConsentStatments) {
      signaturePopup.appendChild(consentSection);

      planConsentAndSign.setSSADropdownInitialWidth(
        signaturePopup,
        selectedMemberData.csChangeMindSSAPeopleId,
      );
      planConsentAndSign.setVendorDropdownInitialWidth(
        signaturePopup,
        selectedMemberData.csContactProviderVendorId,
      );
    }

    signaturePopup.appendChild(dissentSection);
    signaturePopup.appendChild(saveCancelWrap);

    POPUP.show(signaturePopup);

    DOM.autosizeTextarea();

    checkSignautrePopupForErrors();
    if (allowSignClear && (isSigned || readOnly)) {
      saveBtn.classList.add('disabled');
    }

    if (sigCanvas) {
      sigCanvas.width = sigBody.offsetWidth;
    }
  }

  return {
    showPopup,
  };
})();
