const csTeamMember = (() => {
  let selectedMemberData;
  let isNew;
  let isSigned;
  let readOnly;
  let insertAllowed;
  let importedFromRelationship;
  // DOM
  let teamMemberPopup; // main popup
  let linkToRelationshipBtn;
  let linkToSalesforceBtn;
  let teamMemberDropdown;
  let nameInput;
  let lNameInput;
  let dateOfBirthInput;
  let buildingNumberInput;
  let relationshipInput;
  let signatureTypeDropdown;
  let participatedYesRadio;
  let participatedNoRadio;
  let saveTeamMemberBtn;

  //*------------------------------------------------------
  //* UTIL
  //*------------------------------------------------------
  function checkTeamMemberPopupForErrors() {
    const errors = teamMemberPopup.querySelectorAll('.error');

    if (errors.length > 0) {
      saveTeamMemberBtn.classList.add('disabled');
    } else {
      saveTeamMemberBtn.classList.remove('disabled');
    }
  }
  function populateTeamMemberDropdown(teamMemberDropdown, teamMember) {
    const dropdownData = [
      { text: '', value: '' },
      { text: 'Person Supported', value: 'Person Supported' },
      { text: 'Parent/Guardian', value: 'Parent/Guardian' },
      { text: 'Guardian', value: 'Guardian' },
      { text: 'Parent', value: 'Parent' },
      { text: 'Home Provider', value: 'Home Provider' },
      { text: 'Day Provider', value: 'Day Provider' },
      { text: 'Case Manager', value: 'Case Manager' },
      { text: 'Other', value: 'Other' },
    ];
    dropdown.populate(teamMemberDropdown, dropdownData, teamMember);
  }
  function populateSignatureTypeDropdown(signatureTypeDropdown, type) {
    dropdown.populate(
      signatureTypeDropdown,
      [
        { text: '', value: '' },
        { text: 'Digital', value: '1' },
        { text: 'In-Person', value: '2' },
        { text: 'No Signature Required', value: '3' },
      ],
      type,
    );
  }
  async function applySelectedRelationship(relData) {
    importedFromRelationship = true;

    selectedMemberData.salesforceId = !relData.salesforceId ? '' : relData.salesforceId;
    selectedMemberData.contactId = relData.contactId;
    selectedMemberData.peopleId = relData.peopleId;
    selectedMemberData.dateOfBirth = relData.dateOfBirth;
    selectedMemberData.buildingNumber = relData.buildingNumber;
    selectedMemberData.name = relData.firstName;
    selectedMemberData.lastName = relData.lastName;

    // update inputs with selected data
    nameInput.childNodes[0].value = selectedMemberData.name;
    lNameInput.childNodes[0].value = selectedMemberData.lastName;
    buildingNumberInput.childNodes[0].value = selectedMemberData.buildingNumber;
    dateOfBirthInput.childNodes[0].value = UTIL.formatDateToIso(
      dates.removeTimestamp(selectedMemberData.dateOfBirth),
    );

    // remove errors from inputs
    nameInput.classList.remove('error');
    lNameInput.classList.remove('error');
    buildingNumberInput.classList.remove('error');
    dateOfBirthInput.classList.remove('error');

    // make name and relationship readonly
    nameInput.classList.add('disabled');
    lNameInput.classList.add('disabled');

    teamMemberPopup.style.removeProperty('display');

    checkTeamMemberPopupForErrors();

    if (!$.session.planInsertNewTeamMember) {
      // if above is false we know popup was temp disabled
      teamMemberDropdown.classList.remove('disabled');
      dateOfBirthInput.classList.remove('disabled');
      buildingNumberInput.classList.remove('disabled');
      participatedYesRadio.classList.remove('disabled');
      participatedNoRadio.classList.remove('disabled');
      signatureTypeDropdown.classList.remove('disabled');
      //saveTeamMemberBtn.classList.remove('disabled');
    }

    // save team member if readOnly
    if (readOnly) {
      saveTeamMember();
      return;
    }
  }
  async function linkToSalesForce(selectedSalesforceId) {
    let success;

    pendingSave.show('Linking to Salesforce...');

    try {
      await consentAndSignAjax.setSalesForceIdForTeamMemberUpdate({
        peopleId: selectedMemberData.contactId,
        salesForceId: selectedSalesforceId,
      });
      success = true;
    } catch (error) {}

    if (success) {
      pendingSave.fulfill('Linked');
      const savePopup = document.querySelector('.successfulSavePopup');
      DOM.ACTIONCENTER.removeChild(savePopup);
      overlay.hide();
      planConsentAndSign.refreshTable();
    } else {
      pendingSave.reject('Failed to link, please try again.');
      const failPopup = document.querySelector('.failSavePopup');
      overlay.hide();
      DOM.ACTIONCENTER.removeChild(failPopup);
    }
  }
  async function saveTeamMember() {
    teamMemberPopup.style.display = 'none';
    pendingSave.show('Saving...');

    let res = null;
    let success;

    // Gather Data
    if (isNew) {
      if (importedFromRelationship) {
        selectedMemberData.relationshipImport = 'T';
        selectedMemberData.createRelationship = 'F';
      } else {
        selectedMemberData.relationshipImport = 'F';
        selectedMemberData.createRelationship = 'T';
      }
      let rd = await planConsentAndSign.insertNewTeamMember(selectedMemberData);
      rd = rd ? rd[0] : {};

      // TODO: 2022.5
      // if (rd.hasSomeGuardians) {
      //   showGuardiansPopup(rd.guardiansData);
      // }

      if (rd.existingPeopleId) {
        const pendingSavePopup = document.querySelector('.pendingSavePopup');
        pendingSavePopup.style.display = 'none';

        csRelationship.showExistingPopup(selectedMemberData, async usePerson => {
          if (usePerson) {
            pendingSavePopup.style.display = 'block';
            selectedMemberData.peopleId = rd.existingPeopleId;
            await planConsentAndSign.insertNewTeamMember(selectedMemberData);
            success = true;

            if (success) {
              pendingSave.fulfill('Saved');
              setTimeout(() => {
                const savePopup = document.querySelector('.successfulSavePopup');
                DOM.ACTIONCENTER.removeChild(savePopup);
                POPUP.hide(teamMemberPopup);
                planConsentAndSign.refreshTable();
              }, 700);
            } else {
              pendingSave.reject('Failed to save, please try again.');
              console.error(res);
              setTimeout(() => {
                const failPopup = document.querySelector('.failSavePopup');
                DOM.ACTIONCENTER.removeChild(failPopup);
                teamMemberPopup.style.removeProperty('display');
              }, 2000);
            }
          } else {
            pendingSave.hide();
            overlay.show();
          }
        });
      } else {
        success = true;

        if (success) {
          pendingSave.fulfill('Saved');
          setTimeout(() => {
            const savePopup = document.querySelector('.successfulSavePopup');
            DOM.ACTIONCENTER.removeChild(savePopup);
            POPUP.hide(teamMemberPopup);
            planConsentAndSign.refreshTable();
          }, 700);
        } else {
          pendingSave.reject('Failed to save, please try again.');
          console.error(res);
          setTimeout(() => {
            const failPopup = document.querySelector('.failSavePopup');
            DOM.ACTIONCENTER.removeChild(failPopup);
            teamMemberPopup.style.removeProperty('display');
          }, 2000);
        }
      }
    } else {
      await planConsentAndSign.updateTeamMember(selectedMemberData);
      success = true;

      if (success) {
        pendingSave.fulfill('Saved');
        setTimeout(() => {
          const savePopup = document.querySelector('.successfulSavePopup');
          DOM.ACTIONCENTER.removeChild(savePopup);
          POPUP.hide(teamMemberPopup);
          planConsentAndSign.refreshTable();
        }, 700);
      } else {
        pendingSave.reject('Failed to save, please try again.');
        console.error(res);
        setTimeout(() => {
          const failPopup = document.querySelector('.failSavePopup');
          DOM.ACTIONCENTER.removeChild(failPopup);
          teamMemberPopup.style.removeProperty('display');
        }, 2000);
      }
    }
  }
  function getSignatureTypeByID(id) {
    switch (id) {
      case '1': {
        return 'Digital';
      }
      case '2': {
        return 'In-Person';
      }
      case '3': {
        return 'No Signature Required';
      }
      default: {
        return '';
      }
    }
  }

  //*------------------------------------------------------
  //* MARKUP
  //*------------------------------------------------------
  // TODO: 2022.5
  // function showGuardiansPopup(guardiansData) {
  //   if (!guardiansData) {
  //     guardianPopup = POPUP.build({
  //       id: 'guardianPopup',
  //       hideX: true,
  //       header: `There is no guardian listed in Salesforce for this individual`,
  //     });

  //     const doneBtn = button.build({
  //       id: 'guardianPopup_cancel',
  //       text: 'ok',
  //       style: 'secondary',
  //       type: 'outlined',
  //       callback: () => {
  //         POPUP.hide(guardianPopup);
  //         teamMemberPopup.display.block;
  //       },
  //     });

  //     guardianPopup.appendChild(doneBtn);

  //     teamMemberPopup.display.none;
  //     POPUP.show(guardianPopup);
  //     return;
  //   }

  //   let selectedGuardian;

  //   guardianPopup = POPUP.build({
  //     id: 'guardianPopup',
  //     hideX: true,
  //     header: `This is the valid Guardian(S) listed in Salesforce. Please select a guardian from the list that matches the Team Member`,
  //   });

  //   const guardiansWrap = document.createElement('div');

  //   guardiansData.forEach(g => {
  //     const guardianDiv = document.createElement('div');
  //     guardianDiv.classList.add('guardianDiv');

  //     guardianDiv.addEventListener('click', e => {
  //       const selectedG = guardiansWrap.querySelector('.guardianDiv.selected');
  //       if (selectedG) selectedG.classList.remove('selected');
  //       e.target.classList.add('selected');

  //       selectedGuardian = g;
  //     });

  //     guardiansWrap.appendChild(guardianDiv);
  //   });

  //   const doneBtn = button.build({
  //     id: 'guardianPopup_cancel',
  //     text: 'ok',
  //     style: 'secondary',
  //     type: 'outlined',
  //     callback: () => {
  //       // do stuff
  //       // saveGuardianOrsomething(selectedGuardian);
  //     },
  //   });
  //   const cancelBtn = button.build({
  //     id: 'guardianPopup_cancel',
  //     text: 'cancel',
  //     style: 'secondary',
  //     type: 'outlined',
  //     callback: () => {
  //       POPUP.hide(guardianPopup);
  //       teamMemberPopup.display.block;
  //     },
  //   });
  //   const btnWrap = document.createElement('div');
  //   btnWrap.classList.add('btnWrap');
  //   btnWrap.appendChild(doneBtn);
  //   btnWrap.appendChild(cancelBtn);

  //   guardianPopup.appendChild(guardiansWrap);
  //   guardianPopup.appendChild(btnWrap);

  //   teamMemberPopup.display.none;
  //   POPUP.show(guardianPopup);
  // }
  function buildParticipationRadios() {
    const radioContainer = document.createElement('div');
    radioContainer.classList.add('sig_radioContainer');

    const radioContainerTitle = document.createElement('p');
    radioContainerTitle.innerText = 'Participated in Planning?';

    participatedYesRadio = input.buildRadio({
      text: 'Yes',
      name: 'pipRadioSet',
      isChecked: selectedMemberData.participated === 'Y',
      isDisabled: isSigned || readOnly,
      callback: () => {
        selectedMemberData.participated = 'Y';
        radioDiv.classList.remove('error');
        checkTeamMemberPopupForErrors();
      },
    });
    participatedNoRadio = input.buildRadio({
      text: 'No',
      name: 'pipRadioSet',
      isChecked: selectedMemberData.participated === 'N',
      isDisabled: isSigned || readOnly,
      callback: () => {
        selectedMemberData.participated = 'N';
        radioDiv.classList.remove('error');
        checkTeamMemberPopupForErrors();
      },
    });

    const radioDiv = document.createElement('div');
    radioDiv.classList.add('signatures_radioDiv');
    radioDiv.appendChild(participatedYesRadio);
    radioDiv.appendChild(participatedNoRadio);

    if (isNew && $.session.planInsertNewTeamMember) {
      radioDiv.classList.add('error');
    }

    radioContainer.appendChild(radioContainerTitle);
    radioContainer.appendChild(radioDiv);

    return radioContainer;
  }
  function buildDateSignedDisplay() {
    const dateSignedDisplay = document.createElement('p');
    dateSignedDisplay.classList.add('ispSignature_DateSigned');
    dateSignedDisplay.style.marginBottom = '15px';
    if (isSigned) {
      const dateSignedParsed = selectedMemberData.dateSigned.split(' ')[0];
      dateSignedDisplay.innerText = `Signed off by Team Member on: ${dateSignedParsed}`;
    }

    return dateSignedDisplay;
  }
  function buildActionBtns() {
    const mainWrap = document.createElement('div');

    saveTeamMemberBtn = button.build({
      id: 'sigPopup_save',
      text: 'save',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        saveTeamMember();
      },
    });
    const cancelBtn = button.build({
      id: 'sigPopup_cancel',
      text: isSigned || readOnly ? 'close' : 'cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(teamMemberPopup);
      },
    });
    // Delete only visable if isNew = false
    const deleteBtn = button.build({
      id: 'sigPopup_delete',
      text: 'delete',
      style: 'danger',
      type: 'contained',
      callback: () => {
        planConsentAndSign.deleteTeamMember(selectedMemberData.signatureId, teamMemberPopup);
      },
    });
    // Button Wrap 2
    const btnWrap2 = document.createElement('div');
    btnWrap2.classList.add('btnWrap');
    if (!isSigned && !readOnly) {
      btnWrap2.appendChild(saveTeamMemberBtn);
    }
    btnWrap2.appendChild(cancelBtn);
    // Button Wrap 3
    const btnWrap3 = document.createElement('div');
    btnWrap3.classList.add('btnWrap', 'deleteWrap');
    btnWrap3.appendChild(deleteBtn);

    if (isNew) {
      saveTeamMemberBtn.classList.add('disabled');
    }

    mainWrap.appendChild(btnWrap2);
    if (!isSigned && !isNew && !readOnly) {
      mainWrap.appendChild(btnWrap3);
    }

    return mainWrap;
  }
  //* global consent
  function getChangeMindMarkup() {
    // get markup
    const changeMindQuestion = planConsentAndSign.buildChangeMindQuestion(
      {
        csChangeMindSSAPeopleId: selectedMemberData.csChangeMindSSAPeopleId,
        csChangeMind: selectedMemberData.csChangeMind,
      },
      'member',
      isSigned,
    );

    // set event
    changeMindQuestion.addEventListener('change', async event => {
      const target = event.target;
      const targetId = target.id;

      if (targetId === 'isp_ic_ssaDropdown') {
        selectedMemberData.csChangeMindSSAPeopleId = event.target.value;

        if (selectedMemberData.csChangeMindSSAPeopleId === '') {
          changeMindQuestion.classList.add('error');
        } else {
          changeMindQuestion.classList.remove('error');
        }

        planConsentAndSign.updateSSADropdownWidth(teamMemberPopup);

        // set vendor dropdown
        if ($.session.applicationName === 'Gatekeeper') {
          const data = await consentAndSignAjax.getConsumerOrganizationId({
            peopleId: selectedMemberData.csChangeMindSSAPeopleId,
          });

          const vendorDropdown = document.getElementById('isp_ic_vendorContactDropdown');
          vendorDropdown.value = data[0].orgId;
          selectedMemberData.csContactProviderVendorId = data[0].orgId;
        }

        // update contact input field
        const contactInput = document.getElementById('CS_Contact_Input');
        contactInput.value = event.target.selectedOptions[0].innerText;
      }

      checkTeamMemberPopupForErrors();
    });

    // set default bc populatedropdown won't
    const select = changeMindQuestion.querySelector('select');
    select.value = selectedMemberData.csChangeMindSSAPeopleId;

    return changeMindQuestion;
  }
  async function getContactMarkup() {
    if ($.session.applicationName === 'Gatekeeper') {
      const data = await consentAndSignAjax.getConsumerOrganizationId({
        peopleId: selectedMemberData.csChangeMindSSAPeopleId,
      });

      selectedMemberData.csContactProviderVendorId = data[0].orgId;
    }
    // get markup
    const contactQuestion = planConsentAndSign.buildContactQuestion(
      {
        csContactProviderVendorId: selectedMemberData.csContactProviderVendorId,
        csContactInput: selectedMemberData.csContactInput,
        ssaId: selectedMemberData.csChangeMindSSAPeopleId,
      },
      'member',
      isSigned,
    );

    // set event
    contactQuestion.addEventListener('change', event => {
      const target = event.target;
      const targetId = target.id;

      if (targetId === 'isp_ic_vendorContactDropdown') {
        const contactQuestionText = teamMemberPopup.querySelector('.contactQuestionText');
        selectedMemberData.csContactProviderVendorId = event.target.value;

        if (selectedMemberData.csContactProviderVendorId === '') {
          contactQuestionText.classList.add('error');
        } else {
          contactQuestionText.classList.remove('error');
        }

        planConsentAndSign.updateVendorDropdownWidth(teamMemberPopup);
      }

      checkTeamMemberPopupForErrors();
    });

    // set default bc populatedropdown won't
    const select = contactQuestion.querySelector('select');
    select.value = selectedMemberData.csContactProviderVendorId;

    return contactQuestion;
  }
  //* link btn popups

  //*------------------------------------------------------
  //* MAIN
  //*------------------------------------------------------
  async function showPopup({ isNewMember, isReadOnly, memberData }) {
    isNew = isNewMember;
    isSigned = memberData.dateSigned !== '';
    readOnly = isReadOnly;
    showConsentStatments = planConsentAndSign.isTeamMemberConsentable(memberData.teamMember);
    selectedMemberData = { ...memberData };

    // if (!isNew && $.session.applicationName === 'Advisor') {
    //   selectedMemberData.csChangeMindSSAPeopleId = $.session.UserId;
    // }

    let changeMindQuestion;
    let complaintQuestion;

    //*--------------------------------------
    //* POPUP
    //*--------------------------------------
    teamMemberPopup = POPUP.build({
      id: 'sig_mainPopup',
      hideX: true,
      header: isNew ? 'Add Team Member' : 'Update Team Member',
    });

    //* LINK BUTTONS
    //*------------------------------
    linkToRelationshipBtn = button.build({
      id: 'linkToRelationshipBtn',
      text: isNew ? 'Import From Relationships' : 'Link To Relationship',
      style: 'secondary',
      type: 'contained',
      classNames: ['linkBtn', 'relationshipLink'],
      callback: () => {
        linkToRelationshipBtn.classList.add('disabled');
        csRelationship.showMainPopup();
      },
    });
    linkToSalesforceBtn = button.build({
      id: 'linkToSalesforceBtn',
      text: 'Link To Salesforce',
      style: 'secondary',
      type: 'contained',
      classNames: ['linkBtn', 'salesforceLink'],
      callback: async () => {
        linkToSalesforceBtn.classList.add('disabled');
        await csSalesforce.showPopup();
      },
    });

    //* INPUTS
    //*------------------------------
    // Team Member
    teamMemberDropdown = dropdown.build({
      dropdownId: 'sigPopup_teamMember',
      label: 'Team Member',
      readonly: isSigned || readOnly,
      callback: async event => {
        selectedMemberData.teamMember = event.target.value;

        if (event.target.value === '') {
          teamMemberDropdown.classList.add('error');
          // remove consent statements from DOM
          if (showConsentStatments) {
            changeMindQuestion.parentNode.removeChild(changeMindQuestion);
            complaintQuestion.parentNode.removeChild(complaintQuestion);
            showConsentStatments = false;
          }
          // reset consent statement radios to default
          // selectedMemberData.csChangeMind = '';
          // selectedMemberData.csContact = '';
        } else {
          teamMemberDropdown.classList.remove('error');

          const isSelectedTeamMemberConsentable = planConsentAndSign.isTeamMemberConsentable(
            event.target.value,
          );
          if (isSelectedTeamMemberConsentable) {
            // show consent statments only if they are not there
            if (!showConsentStatments) {
              showConsentStatments = true;
              // reset default values
              const globals = planConsentAndSign.getConsentGlobalValues();
              selectedMemberData.csChangeMindSSAPeopleId = globals.SSA;
              selectedMemberData.csContactProviderVendorId = globals.VENDOR;
              selectedMemberData.csContactInput = globals.CONTACT;
              // rebuild them
              changeMindQuestion = getChangeMindMarkup();
              complaintQuestion = await getContactMarkup();
              // show them
              teamMemberPopup.insertBefore(changeMindQuestion, participationRadios);
              teamMemberPopup.insertBefore(complaintQuestion, participationRadios);
              // width them
              planConsentAndSign.setSSADropdownInitialWidth(
                teamMemberPopup,
                selectedMemberData.csChangeMindSSAPeopleId,
              );
              planConsentAndSign.setVendorDropdownInitialWidth(
                teamMemberPopup,
                selectedMemberData.csContactProviderVendorId,
              );
            }
          } else {
            if (showConsentStatments) {
              changeMindQuestion.parentNode.removeChild(changeMindQuestion);
              complaintQuestion.parentNode.removeChild(complaintQuestion);
              showConsentStatments = false;
              // selectedMemberData.csChangeMindSSAPeopleId = '';
              // selectedMemberData.csContactProviderVendorId = '';
              // selectedMemberData.csContactInput = '';
            }
          }
        }

        checkTeamMemberPopupForErrors();
      },
    });
    teamMemberDropdown.classList.add('teamMemberDropdown');
    // Name ()
    nameInput = input.build({
      label: 'First Name',
      value: selectedMemberData.name,
      readonly: isSigned || readOnly,
      callbackType: 'input',
      callback: event => {
        selectedMemberData.name = event.target.value;

        if (event.target.value === '') {
          nameInput.classList.add('error');
        } else {
          nameInput.classList.remove('error');
        }

        checkTeamMemberPopupForErrors();
      },
    });
    lNameInput = input.build({
      label: 'Last Name',
      value: selectedMemberData.lastName,
      readonly: isSigned || readOnly,
      callbackType: 'input',
      callback: event => {
        selectedMemberData.lastName = event.target.value;

        if (event.target.value === '') {
          lNameInput.classList.add('error');
        } else {
          lNameInput.classList.remove('error');
        }

        checkTeamMemberPopupForErrors();
      },
    });
    // Date of Birth
    dateOfBirthInput = input.build({
      type: 'date',
      label: 'Date of Birth',
      //value: selectedMemberData.dateOfBirth,
      value: UTIL.formatDateToIso(dates.removeTimestamp(selectedMemberData.dateOfBirth)),
      readonly: isSigned || readOnly,
      callback: event => {
        selectedMemberData.dateOfBirth = event.target.value;

        checkTeamMemberPopupForErrors();
      },
    });
    // Building Number
    buildingNumberInput = input.build({
      label: 'Building Number',
      value: selectedMemberData.buildingNumber,
      readonly: isSigned || readOnly,
      callbackType: 'input',
      callback: event => {
        selectedMemberData.buildingNumber = event.target.value;

        checkTeamMemberPopupForErrors();
      },
    });
    // Participate Yes/NO
    const participationRadios = buildParticipationRadios();

    // Signature Type
    signatureTypeDropdown = dropdown.build({
      dropdownId: 'sigPopup_signType',
      label: 'Signature Type',
      readonly: isSigned || readOnly,
      callback: event => {
        selectedMemberData.signatureType = event.target.value;

        if (event.target.value === '') {
          signatureTypeDropdown.classList.add('error');
        } else {
          signatureTypeDropdown.classList.remove('error');
        }

        checkTeamMemberPopupForErrors();
      },
    });

    //* GLOBAL CONSENT QUESTIONS
    //*------------------------------
    if (showConsentStatments) {
      changeMindQuestion = getChangeMindMarkup();
      complaintQuestion = await getContactMarkup();
    }

    //* BUTTONS
    //*------------------------------
    const btns = buildActionBtns();

    //* Date Signed Display
    //*------------------------------
    const dateSignedDisplay = buildDateSignedDisplay();

    //* Disabled Fields
    //*------------------------------
    // TODO: delete below sessions once set by TJ
    // $.session.planUpdateDOB = true;
    // $.session.planUpdateAddress = true;
    if (selectedMemberData.dateOfBirth /*|| $.session.planUpdateDOB*/) {
      dateOfBirthInput.classList.add('disabled');
    }
    if (selectedMemberData.buildingNumber /*|| $.session.planUpdateAddress*/) {
      buildingNumberInput.classList.add('disabled');
    }
    if (!isNew) {
      if (selectedMemberData.name !== '') {
        nameInput.classList.add('disabled');
      }
      if (selectedMemberData.lastName !== '') {
        lNameInput.classList.add('disabled');
      }
    }
    if (!$.session.planInsertNewTeamMember) {
      teamMemberDropdown.classList.add('disabled');
      nameInput.classList.add('disabled');
      lNameInput.classList.add('disabled');
      dateOfBirthInput.classList.add('disabled');
      buildingNumberInput.classList.add('disabled');
      participatedYesRadio.classList.add('disabled');
      participatedNoRadio.classList.add('disabled');
      signatureTypeDropdown.classList.add('disabled');
      saveTeamMemberBtn.classList.add('disabled');
    }

    //* Required Fields
    //*------------------------------
    if ($.session.planInsertNewTeamMember) {
      if (selectedMemberData.teamMember === '') {
        teamMemberDropdown.classList.add('error');
      } else {
        teamMemberDropdown.classList.remove('error');
      }
      if (selectedMemberData.name === '') {
        nameInput.classList.add('error');
      } else {
        nameInput.classList.remove('error');
      }
      if (selectedMemberData.signatureType === '') {
        signatureTypeDropdown.classList.add('error');
      } else {
        signatureTypeDropdown.classList.remove('error');
      }
      if (isNew) {
        if (selectedMemberData.lastName === '') {
          lNameInput.classList.add('error');
        }
      }
    }

    //* Add elements to popup
    //*------------------------------
    if (isSigned) {
      teamMemberPopup.appendChild(dateSignedDisplay);
    }
    if (isNew) {
      teamMemberPopup.appendChild(linkToRelationshipBtn);
    } else {
      if (!selectedMemberData.contactId) {
        teamMemberPopup.appendChild(linkToRelationshipBtn);
      }
      if (
        $.session.areInSalesForce &&
        !selectedMemberData.salesForceId &&
        selectedMemberData.contactId
      ) {
        teamMemberPopup.appendChild(linkToSalesforceBtn);
      }
    }
    teamMemberPopup.appendChild(teamMemberDropdown);
    teamMemberPopup.appendChild(nameInput);
    if (isNew) {
      teamMemberPopup.appendChild(lNameInput);
    } else {
      if (selectedMemberData.lastName !== '') teamMemberPopup.appendChild(lNameInput);
    }
    teamMemberPopup.appendChild(dateOfBirthInput);
    teamMemberPopup.appendChild(buildingNumberInput);
    teamMemberPopup.appendChild(participationRadios);
    teamMemberPopup.appendChild(signatureTypeDropdown);

    if (showConsentStatments) {
      teamMemberPopup.appendChild(changeMindQuestion);
      teamMemberPopup.appendChild(complaintQuestion);

      planConsentAndSign.setSSADropdownInitialWidth(
        teamMemberPopup,
        selectedMemberData.csChangeMindSSAPeopleId,
      );
      planConsentAndSign.setVendorDropdownInitialWidth(
        teamMemberPopup,
        selectedMemberData.csContactProviderVendorId,
      );
    }

    teamMemberPopup.appendChild(btns);

    populateTeamMemberDropdown(teamMemberDropdown, selectedMemberData.teamMember);
    populateSignatureTypeDropdown(signatureTypeDropdown, selectedMemberData.signatureType);

    POPUP.show(teamMemberPopup);

    checkTeamMemberPopupForErrors();
  }

  return {
    showPopup,
    applySelectedRelationship,
    linkToSalesForce,
    getSignatureTypeByID,
  };
})();
