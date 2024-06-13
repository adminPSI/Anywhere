const csTeamMember = (() => {
  let selectedMemberData;
  let isNew;
  let isSigned;
  let readOnly;
  let insertAllowed;
  let importedFromRelationship;
  let stateGuardiansObj;
  let selectedStateGuardian = '';
  let selectedStateGuardianSalesForceId = '';
  let DBteamMemberswithStateSalesForceId;
  // DOM
  let teamMemberPopup; // main popup
  let currentTeamMemberList;
  let linkToRelationshipBtn;
  let linkToSalesforceBtn;
  let teamMemberDropdown;
  let stateGuardianDropdown;
  let nameInput;
  let lNameInput;
  let dateOfBirthInput;
  let buildingNumberInput;
  let emailInput;
  let relationshipTypeInput;
  let signatureTypeDropdown;
  let radioDiv;
  let radioDiv2;
  let participatedYesRadio;
  let participatedNoRadio;
  let parentOfMinorYesRadio;
  let parentOfMinorNoRadio;
  let saveTeamMemberBtn;

  //*------------------------------------------------------
  //* UTIL
  //*------------------------------------------------------
  function checkTeamMemberPopupForErrors() {
    const errors = teamMemberPopup.querySelectorAll('.error');
    const isConsentable = planConsentAndSign.isTeamMemberConsentable(selectedMemberData.teamMember);

    if (
      errors.length > 0 ||
      ($.session.applicationName === 'Gatekeeper' &&
        selectedMemberData.csContactProviderVendorId === '' &&
        isConsentable)
    ) {
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
        //{ text: 'E-Digital', value: '4' },
      ],
      type,
    );
  }

  async function populateGuardiansDropDown() {
    var selectedConsumer = plan.getSelectedConsumer();
    stateGuardiansObj = await consentAndSignAjax.getStateGuardiansforConsumer({
      peopleId: selectedConsumer.id,
    });

    let guarddata;
    if (stateGuardiansObj && stateGuardiansObj.length !== 0) {
      guarddata = stateGuardiansObj.map(dd => {
        return {
          value: dd.Id,
          text: dd.FirstName + ' ' + dd.LastName,
        };
      });
      guarddata.unshift({ value: '', text: 'SELECT MATCHING STATE GUARDIAN' });
    } else {
      guarddata = [{ value: '', text: 'NO STATE GUARDIANS FOUND' }];
    }

    dropdown.populate(stateGuardianDropdown, guarddata);
  }

  function calculateAge(dobStr) {
    const dob = new Date(dobStr);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  function isDateBefore1900(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Get the year from the Date object
    const year = date.getFullYear();
  
    // Compare the year with 1900
    return year < 1900;
  }

  async function applySelectedRelationship(relData) {
    importedFromRelationship = true;

    selectedMemberData.salesForceId = !relData.salesForceId ? '' : relData.salesForceId;
    selectedMemberData.contactId = relData.contactId;
    selectedMemberData.peopleId = relData.peopleId;
    selectedMemberData.dateOfBirth = relData.dateOfBirth;
    selectedMemberData.buildingNumber = relData.buildingNumber;
    selectedMemberData.name = relData.firstName;
    selectedMemberData.lastName = relData.lastName.split('|')[0];
    selectedMemberData.relationship = relData.relationship;
    selectedMemberData.email = relData.email;

    // update inputs with selected data
    nameInput.childNodes[0].value = selectedMemberData.name;
    lNameInput.childNodes[0].value = selectedMemberData.lastName;
    buildingNumberInput.childNodes[0].value = selectedMemberData.buildingNumber;
    emailInput.childNodes[0].value = selectedMemberData.email ?? '';
    if (selectedMemberData.dateOfBirth) {
      dateOfBirthInput.childNodes[0].value = UTIL.formatDateToIso(
        dates.removeTimestamp(selectedMemberData.dateOfBirth),
      );
    }

    // build new relationship type input
    relationshipTypeInput = input.build({
      label: 'Relationship Type',
      value: selectedMemberData.relationship,
      readonly: isSigned || readOnly,
      callbackType: 'input',
      callback: event => {
        selectedMemberData.relationship = event.target.value;

        checkTeamMemberPopupForErrors();
      },
    });
    buildingNumberInput.after(relationshipTypeInput);
    emailInput.after(buildingNumberInput);

    // remove errors from inputs
    nameInput.classList.remove('error');
    lNameInput.classList.remove('error');
    buildingNumberInput.classList.remove('error');
    emailInput.classList.remove('error');
    //dateOfBirthInput.classList.remove('error');

    // make name and relationship readonly
    nameInput.classList.add('disabled');
    lNameInput.classList.add('disabled');
    relationshipTypeInput.classList.add('disabled');
    if (!$.session.planSignatureUpdateDOB) {
      dateOfBirthInput.classList.add('disabled');
    }
    if (!$.session.planSignatureUpdateBuildingNumber) {
      buildingNumberInput.classList.add('disabled');
    }
    if (!$.session.updateEmail) {
      emailInput.classList.add('disabled');
    }

    teamMemberPopup.style.removeProperty('display');

    if (!$.session.planInsertNewTeamMember) {
      // if above is false we know popup was temp disabled
      if ($.session.planSignatureUpdateDOB) {
        dateOfBirthInput.classList.remove('disabled');
      }
      if ($.session.planSignatureUpdateBuildingNumber) {
        buildingNumberInput.classList.remove('disabled');
      }
      if ($.session.updateEmail) {
        emailInput.classList.remove('disabled');
      }
      teamMemberDropdown.classList.remove('disabled');
      participatedYesRadio.classList.remove('disabled');
      participatedNoRadio.classList.remove('disabled');
      parentOfMinorYesRadio.classList.remove('disabled');
      parentOfMinorNoRadio.classList.remove('disabled');
      // signatureTypeDropdown.classList.remove('disabled');
      // set errors
      if (selectedMemberData.teamMember === '') {
        teamMemberDropdown.classList.add('error');
      }
      if (selectedMemberData.signatureType === '') {
        signatureTypeDropdown.classList.add('error');
      }
      radioDiv.classList.add('error');
    }

    if ($.session.planUpdate) {
      signatureTypeDropdown.classList.remove('disabled');
    } else {
      signatureTypeDropdown.classList.add('disabled');
    }

    checkTeamMemberPopupForErrors();

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
    if (
      (selectedMemberData.teamMember === 'Guardian' || selectedMemberData.teamMember === 'Parent/Guardian') &&
      $.session.areInSalesForce === true
    ) {
     //   if (selectedStateGuardianSalesForceId === '') selectedStateGuardianSalesForceId = selectedMemberData.salesForceId;
     if (isNew) {
      var continueGuardianSave = await continueSaveofGuardianTeamMember();
      if (!continueGuardianSave) return;
     }
     
    }

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
                if (
                  selectedMemberData.teamMember === 'Guardian' ||
                  selectedMemberData.teamMember === 'Parent/Guardian' ||
                  selectedMemberData.teamMember === 'Case Manager'
                ) {
                  //Do Nothing
                } else {
                  consentAndSignAjax.GetSalesForceId(selectedMemberData.peopleId);
                }
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
            if (
              selectedMemberData.teamMember === 'Guardian' ||
              selectedMemberData.teamMember === 'Parent/Guardian' ||
              selectedMemberData.teamMember === 'Case Manager'
            ) {
              //Do Nothing
            } else {
              consentAndSignAjax.GetSalesForceId(selectedMemberData.peopleId);
            }
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
    } else {  //edit
      await planConsentAndSign.updateTeamMember(selectedMemberData);
      success = true;

      if (success) {
        pendingSave.fulfill('Saved');
        setTimeout(() => {
          const savePopup = document.querySelector('.successfulSavePopup');
          DOM.ACTIONCENTER.removeChild(savePopup);
          POPUP.hide(teamMemberPopup);
          planConsentAndSign.refreshTable();
          if (
            selectedMemberData.teamMember === 'Guardian' ||
            selectedMemberData.teamMember === 'Parent/Guardian' ||
            selectedMemberData.teamMember === 'Case Manager'
          ) {
            //Do Nothing
          } else {
            consentAndSignAjax.GetSalesForceId(selectedMemberData.peopleId);
          }
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

  // Handling of selection of teamMember == Guardian or teamMember == Parent/Guardian
  async function continueSaveofGuardianTeamMember() {
    // Ensure that the same saleForceId is not added twice as a TeamMember for a Plan   
    if (hasSalesForceIdBeenUsed(selectedStateGuardianSalesForceId) && $.session.areInSalesForce === true) {
      alert(
        `This team Member will not be saved. This State Guardian has already been used for a team Member in this Plan.`,
      );
      return false;
    }

    // A -- No State Guardian in Dropdown (stateGuardianDropdown) -- you can't save
    if (!selectedStateGuardianSalesForceId && $.session.areInSalesForce === true) {
      alert(`A Guardian is not listed in Salesforce for this individual and must be entered on SalesForce Portal.`);
      return false;
    }

    // B -- Imported Guardian and Selected State Guardian have matching SaleForceIDs
    if (
      selectedStateGuardianSalesForceId &&
      selectedMemberData.salesForceId === selectedStateGuardianSalesForceId &&
      $.session.areInSalesForce === true
    ) {
      return true;
    }

    // 1 -- Imported Guardian and Selected State Guardian do not have matching SaleForceIDs, BUT there is a SalesforceID in the People table that matches the selected State Guardian.
    if (
      selectedMemberData.salesForceId &&
      selectedMemberData.salesForceId !== '' &&
      selectedStateGuardianSalesForceId !== '' &&
      selectedMemberData.salesForceId !== selectedStateGuardianSalesForceId &&
      DBteamMemberswithStateSalesForceId &&
      DBteamMemberswithStateSalesForceId.length === 1 &&
      $.session.areInSalesForce === true
    ) {
      // Ensure that the same saleForceId is not added twice as a TeamMember for a Plan
      if (hasSalesForceIdBeenUsed(DBteamMemberswithStateSalesForceId[0].salesForceId)) {
        alert(
          `This team Member will not be saved. No salesForceIds are available to be used for this team Member in this Plan.`,
        );
        return false;
      }

      let Scenario1ConfirmText = `The Imported Guardian and selected State Guardian do not have matching SalesForceIDs. 
      However, the following Guardian was found in the local database that matches the SalesforceID 
      of the selected State Guardian: ${DBteamMemberswithStateSalesForceId[0].name} ${DBteamMemberswithStateSalesForceId[0].lastName}.
      Do you wish to save ${DBteamMemberswithStateSalesForceId[0].name} ${DBteamMemberswithStateSalesForceId[0].lastName} 
      as the Guardian for this particular Added Team Member?`;

      if (confirm(Scenario1ConfirmText)) {
        selectedMemberData.name = DBteamMemberswithStateSalesForceId[0].name;
        selectedMemberData.lastName = DBteamMemberswithStateSalesForceId[0].lastName;
        selectedMemberData.buildingNumber = DBteamMemberswithStateSalesForceId[0].buildingNumber;
        selectedMemberData.dateOfBirth = DBteamMemberswithStateSalesForceId[0].dateOfBirth;
        selectedMemberData.salesForceId = DBteamMemberswithStateSalesForceId[0].salesForceId;
        selectedMemberData.peopleId = DBteamMemberswithStateSalesForceId[0].peopleId;
        return true;
      } else {
        alert(
          `The Imported Guardian does not match the State Guardian listed in Salesforce and must be entered in Salesforce Portal.`,
        );
        return false;
      }
    }

    // 2 -- Imported Guardian and Selected State Guardian do not have matching SaleForceIDs, AND there is NO SalesforceID in the People table that matches the selected State Guardian.
    if (
      selectedMemberData.salesForceId &&
      selectedMemberData.salesForceId !== '' &&
      selectedStateGuardianSalesForceId !== '' &&
      selectedMemberData.salesForceId !== selectedStateGuardianSalesForceId &&
      (!DBteamMemberswithStateSalesForceId ||
        (DBteamMemberswithStateSalesForceId && DBteamMemberswithStateSalesForceId.length === 0))
    ) {
      // let Scenario2ConfirmText = `The Imported Guardian and selected State Guardian do not have matching SalesForceIDs.
      // Do you wish to save the selected State Guardian as the Guardian for this particular Added Team Member?`

      // if (
      //   confirm(Scenario2ConfirmText)
      // ) {
      //   var fullName = selectedStateGuardian.split(' ');
      //   selectedMemberData.name = fullName[0];
      //   selectedMemberData.lastName = fullName[fullName.length - 1];
      //   selectedMemberData.buildingNumber = '';
      //   selectedMemberData.dateOfBirth = '';
      //   selectedMemberData.salesForceId = selectedStateGuardianSalesForceId;
      //   return true;
      // } else {
      alert(
        `Imported Guardian selected is not listed in Salesforce for this individual and must be entered on Salesforce portal.`,
      );
      return false;
    }
    // }

    // 3 -- Imported Guardian has NO SaleforceID, but the Selected State Guardian does have a SaleForceID, BUT there is a SalesforceID in the People table that matches the selected State Guardian.
    if (
      (selectedMemberData.salesForceId === '' || !selectedMemberData.salesForceId) &&
      selectedStateGuardianSalesForceId !== '' &&
      DBteamMemberswithStateSalesForceId &&
      DBteamMemberswithStateSalesForceId.length === 1
    ) {
      // Ensure that the same saleForceId is not added twice as a TeamMember for a Plan
      if (hasSalesForceIdBeenUsed(DBteamMemberswithStateSalesForceId[0].salesForceId)) {
        alert(
          `This team Member will not be saved. No salesForceIds are available to be used for this team Member in this Plan.`,
        );
        return false;
      }

      let Scenario3ConfirmText = `The Imported Guardian does NOT have a SalesForceID, but the selected State Guardian does. 
    However, the following Guardian was found in the local database that matches the SalesforceID 
    of the selected State Guardian: ${DBteamMemberswithStateSalesForceId[0].name} ${DBteamMemberswithStateSalesForceId[0].lastName}.
    Do you wish to save ${DBteamMemberswithStateSalesForceId[0].name} ${DBteamMemberswithStateSalesForceId[0].lastName} 
    as the Guardian for this particular Added Team Member?`;

      if (confirm(Scenario3ConfirmText)) {
        selectedMemberData.name = DBteamMemberswithStateSalesForceId[0].name;
        selectedMemberData.lastName = DBteamMemberswithStateSalesForceId[0].lastName;
        selectedMemberData.buildingNumber = DBteamMemberswithStateSalesForceId[0].buildingNumber;
        selectedMemberData.dateOfBirth = DBteamMemberswithStateSalesForceId[0].dateOfBirth;
        selectedMemberData.salesForceId = DBteamMemberswithStateSalesForceId[0].salesForceId;
        selectedMemberData.peopleId = DBteamMemberswithStateSalesForceId[0].peopleId;
        return true;
      } else {
        alert(
          `The Imported Guardian does not match the State Guardian listed in the Salesforce and must be entered in Salesforce Portal.`,
        );
        return false;
      }
    }

    // 4 --Imported Guardian has NO SaleforceID, but the Selected State Guardian does have a SaleForceID, AND there is NO SalesforceID in the People table that matches the selected State Guardian.
    if (
      (selectedMemberData.salesForceId === '' || !selectedMemberData.salesForceId) &&
      selectedStateGuardianSalesForceId !== '' &&
      (!DBteamMemberswithStateSalesForceId ||
        (DBteamMemberswithStateSalesForceId && DBteamMemberswithStateSalesForceId.length === 0))
    ) {
      if (confirm('Is the selected State Guardian the same person as the Imported Guardian in the form?')) {
        // YES -- Continue
      } else {
        alert(
          `The Imported Guardian does not match the State Guardian listed in the Salesforce and must be entered in Salesforce Portal.`,
        );
        return false;
      }

      let Scenario4ConfirmText = `The Imported Guardian does NOT have a SalesForceID, but the selected State Guardian does. 
    Do you wish to assign the selected State SalesforceID to the Imported Guardian (${selectedMemberData.name} ${selectedMemberData.lastName}) and then save
    ${selectedMemberData.name} ${selectedMemberData.lastName} as the Guardian for this particular Added Team Member? `;

      let updatesuccess;

      if (confirm(Scenario4ConfirmText)) {
        // update the imported/manually entered member with the State SaleforceID
        try {
          await consentAndSignAjax.setSalesForceIdForTeamMemberUpdate({
            peopleId: selectedMemberData.contactId,
            salesForceId: selectedStateGuardianSalesForceId,
          });
          updatesuccess = true;
        } catch (error) {
          updatesuccess = false;
        }

        if (updatesuccess) {
          selectedMemberData.salesForceId = selectedStateGuardianSalesForceId;
          return true;
        } else {
          alert(
            'Assigning the selected State SalesforceID to the Imported Guardian failed; therefore, inserting this Guardian will not be attempted.',
          );
          return false;
        }
      } else {
        alert(
          `The Imported Guardian does not match the State Guardian listed in the Salesforce and must be entered in Salesforce Portal.`,
        );
        return false;
      }
    }

    // Final Guard Clause and Message for a failed attempt to Save New team Member
    if (DBteamMemberswithStateSalesForceId && DBteamMemberswithStateSalesForceId.length > 1) {
      alert(
        `Unable to save Team Member. There were multiple people in your local Database with the SalesForceID: ${DBteamMemberswithStateSalesForceId[0].salesForceId}. Correct this issue before continuing.`,
      );
      return false;
    } else {
      alert(
        `The Imported Guardian does not match the State Guardian listed in the Salesforce and must be entered in Salesforce Portal.`,
      );
      return false;
    }

    function hasSalesForceIdBeenUsed(selectedSalesForceID) {
      let isSaleForceIdUsed = false;

      if (currentTeamMemberList && currentTeamMemberList.length > 0) {
        currentTeamMemberList.forEach(p => {
          if (selectedSalesForceID === p.salesForceId) isSaleForceIdUsed = true;
        });
      }
      return isSaleForceIdUsed;
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
      // case '4': {
      //   return 'E-Digital';
      // }
      default: {
        return '';
      }
    }
  }

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

    radioDiv = document.createElement('div');
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

  function buildParentOfMinorRadios() {
    const isNoChecked = isNew ? true : selectedMemberData.parentOfMinor === 'N';
    const isYesChecked = isNew ? false : selectedMemberData.parentOfMinor === 'Y';

    radioContainer = document.createElement('div');
    radioContainer.classList.add('sig_radioContainer');

    const radioContainerTitle = document.createElement('p');
    radioContainerTitle.innerText = 'Parent of Minor?';

    parentOfMinorYesRadio = input.buildRadio({
      text: 'Yes',
      name: 'pomRadioSet',
      isChecked: isYesChecked,
      isDisabled: true,
      callback: () => {
        selectedMemberData.parentOfMinor = 'Y';
        //radioDiv.classList.remove('error');
        checkTeamMemberPopupForErrors();
      },
    });
    parentOfMinorNoRadio = input.buildRadio({
      text: 'No',
      name: 'pomRadioSet',
      isChecked: isNoChecked,
      isDisabled: true,
      callback: () => {
        selectedMemberData.parentOfMinor = 'N';
        //radioDiv.classList.remove('error');
        checkTeamMemberPopupForErrors();
      },
    });

    radioDiv2 = document.createElement('div');
    radioDiv2.classList.add('signatures_radioDiv');
    radioDiv2.appendChild(parentOfMinorYesRadio);
    radioDiv2.appendChild(parentOfMinorNoRadio);

    if (isNew) {
      radioContainer.style.display = 'none';
    }

    radioContainer.appendChild(radioContainerTitle);
    radioContainer.appendChild(radioDiv2);

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
        selectedStateGuardian = '';
      },
    });
    const cancelBtn = button.build({
      id: 'sigPopup_cancel',
      text: isSigned || readOnly ? 'close' : 'cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(teamMemberPopup);
        selectedStateGuardian = '';
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
    } else if (!isNew && !readOnly && selectedMemberData.signatureType === '3') {
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

          // ID check for vendors/providers
          const doesIdExistInVendors = planConsentAndSign.doesIdExistInVendors(data[0].orgId);
          const vendorDropdown = document.getElementById('isp_ic_vendorContactDropdown');
          if (doesIdExistInVendors) {
            vendorDropdown.value = data[0].orgId;
            selectedMemberData.csContactProviderVendorId = data[0].orgId;
          } else {
            vendorDropdown.value = '';
            selectedMemberData.csContactProviderVendorId = '';
          }
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
      var selectedConsumer = plan.getSelectedConsumer();

      const data = await consentAndSignAjax.getConsumerOrganizationId({
        // peopleId: selectedMemberData.csChangeMindSSAPeopleId,  -- this was changed to below with the idea that selectedMemberData.csChangeMindSSAPeopleId could be set to ''
        peopleId: selectedConsumer.id,
      });

      // ID check for vendors/providers
      const doesIdExistInVendors = planConsentAndSign.doesIdExistInVendors(data[0].orgId);
      if (doesIdExistInVendors) {
        selectedMemberData.csContactProviderVendorId = data[0].orgId;
      } else {
        selectedMemberData.csContactProviderVendorId = '';
      }
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

    // const vendorDropdown = contactQuestion.querySelector('#isp_ic_vendorContactDropdown');
    // vendorDropdown.value = selectedMemberData.csContactProviderVendorId;

    return contactQuestion;
  }

  //* link btn popups

  //*------------------------------------------------------
  //* MAIN
  //*------------------------------------------------------
  async function showPopup({ isNewMember, isReadOnly, memberData, currentTeamMemberData }) {
    const selectedTeamMember = plan.getSelectedConsumer();
    const age = calculateAge(selectedTeamMember.card.dataset.dob);
    const isMinor = age < 18 ? true : false;
    isNew = isNewMember;
    isSigned = memberData.dateSigned !== '';
    readOnly = isReadOnly;
    importedFromRelationship = false;
    showConsentStatments = planConsentAndSign.isTeamMemberConsentable(memberData.teamMember);
    showStateGuardians = planConsentAndSign.isTeamMemberGuardian(memberData.teamMember);
    selectedMemberData = { ...memberData };
    // TOOD 94246: IF the LIMITED NUMBER OF GUARDIANS or Parent Guardians have been reached, then REMOVE 'Guardians' from the teamMember DDL
    currentTeamMemberList = currentTeamMemberData;

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
        planSignatureUpdateDOB;
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

        // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
        setStateofPopupFields();

        // inserting/removing the conditional fields based on teamMemberDropdown selection
        insertingConditionalFieldsintoPopup();

        checkTeamMemberPopupForErrors();
      },
    });
    teamMemberDropdown.classList.add('teamMemberDropdown');

    // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
    function setStateofPopupFields() {
      if ($.session.planInsertNewTeamMember) {
        linkToRelationshipBtn.classList.remove('disabled');
        nameInput.classList.remove('disabled');
        lNameInput.classList.remove('disabled');
        participatedYesRadio.classList.remove('disabled');
        participatedNoRadio.classList.remove('disabled');
        parentOfMinorYesRadio.classList.remove('disabled');
        parentOfMinorNoRadio.classList.remove('disabled');
        // signatureTypeDropdown.classList.remove('disabled');
      }

      if ($.session.planUpdate) {
        signatureTypeDropdown.classList.remove('disabled');
      } else {
        signatureTypeDropdown.classList.add('disabled');
      }

      if ($.session.planSignatureUpdateDOB) {
        dateOfBirthInput.classList.remove('disabled');
      }
      if ($.session.planSignatureUpdateBuildingNumber) {
        buildingNumberInput.classList.remove('disabled');
      }
      if ($.session.updateEmail) {
        emailInput.classList.remove('disabled');
      }

      //* Required Fields
      //*------------------------------
      if ($.session.planInsertNewTeamMember) {
        const checkIfDateBefore1900 = isDateBefore1900(dateOfBirthInput.value);
        const teamMember = selectedMemberData.teamMember;
        const isRequired =
        teamMember !== 'Guardian' && teamMember !== 'Parent/Guardian' && teamMember !== 'Case Manager' && teamMember !== '';

        if (checkIfDateBefore1900 || (isRequired && selectedMemberData.dateOfBirth === '')) {
          dateOfBirthInput.classList.add('error');
        } else {
          dateOfBirthInput.classList.remove('error');
        }

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

      if (selectedMemberData.teamMember === 'Parent') {
        radioContainer.style.display = 'flex';
        selectedMemberData.parentOfMinor = isMinor ? 'Y' : 'N';
        parentOfMinorYesRadio.querySelector('input').checked = isMinor ? true : false;
        parentOfMinorNoRadio.querySelector('input').checked = isMinor ? false : true;
      } else {
        selectedMemberData.parentOfMinor = 'N';
        //parentOfMinorYesRadio.querySelector('input').checked = false;
        //parentOfMinorNoRadio.querySelector('input').checked = true;
        radioContainer.style.display = 'none';
      }
    }

    // inserting/removing the conditional fields based on teamMemberDropdown selection
    async function insertingConditionalFieldsintoPopup() {
      if (selectedMemberData.teamMember === '') {
        // team member has NOT been selected

        teamMemberDropdown.classList.add('error');
        // remove consent statements from DOM
        if (showConsentStatments) {
          changeMindQuestion.parentNode.removeChild(changeMindQuestion);
          complaintQuestion.parentNode.removeChild(complaintQuestion);
          showConsentStatments = false;
        }
        // remove guardians DDL from DOM
        if (showStateGuardians) {
          stateGuardianDropdown.parentNode.removeChild(stateGuardianDropdown);
          showStateGuardians = false;
        }

        // reset consent statement radios to default
        // selectedMemberData.csChangeMind = '';
        // selectedMemberData.csContact = '';
      } else {
        // team member has been selected

        teamMemberDropdown.classList.remove('error');

        const isSelectedTeamMemberConsentable = planConsentAndSign.isTeamMemberConsentable(
          selectedMemberData.teamMember,
        );

        insertingFieldsBasedonConsentable(isSelectedTeamMemberConsentable);

        const isSelectedTeamMemberGuardian = planConsentAndSign.isTeamMemberGuardian(selectedMemberData.teamMember);

        await insertingFieldsBasedonGuardian(isSelectedTeamMemberGuardian);
      } //end if -- team member has been selected
    } // end if -- function insertingConditionalFieldsintoPopup()

    async function insertingFieldsBasedonConsentable(isSelectedTeamMemberConsentable) {
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
          //
          // width them
          planConsentAndSign.setSSADropdownInitialWidth(teamMemberPopup, selectedMemberData.csChangeMindSSAPeopleId);
          planConsentAndSign.setVendorDropdownInitialWidth(
            teamMemberPopup,
            selectedMemberData.csContactProviderVendorId,
          );
        }
      } else {
        // if NOT isSelectedTeamMemberConsentable

        if (showConsentStatments) {
          changeMindQuestion.parentNode.removeChild(changeMindQuestion);
          complaintQuestion.parentNode.removeChild(complaintQuestion);
          // if (showStateGuardians) stateGuardianDropdown.parentNode.removeChild(stateGuardianDropdown);
          showConsentStatments = false;
          // selectedMemberData.csChangeMindSSAPeopleId = '';
          // selectedMemberData.csContactProviderVendorId = '';
          // selectedMemberData.csContactInput = '';
        }
      } // end if -- isSelectedTeamMemberConsentable///
    }

    async function insertingFieldsBasedonGuardian(isSelectedTeamMemberGuardian) {
      if (isSelectedTeamMemberGuardian && $.session.areInSalesForce === true) {
        // show guardan DDL only if it's not there
        if (!showStateGuardians) {
          showStateGuardians = true;
          await populateGuardiansDropDown();
          teamMemberPopup.insertBefore(stateGuardianDropdown, nameInput);
          if (selectedStateGuardian === '') stateGuardianDropdown.classList.add('error');
        }
      } else {
        // if NOT isSelectedTeamMemberGuardian

        if (showStateGuardians) {
          stateGuardianDropdown.parentNode.removeChild(stateGuardianDropdown);
          showStateGuardians = false;
        }
      } // end if -- isSelectedTeamMemberGuardian
    }


    // State Guradian
    stateGuardianDropdown = dropdown.build({
      dropdownId: 'sigPopup_stateGuardian',
      label: 'State Guardian',
      readonly: isSigned || readOnly,
      callback: async event => {
        selectedStateGuardian = event.target.options[event.target.selectedIndex].innerHTML;
        selectedStateGuardianSalesForceId = event.target.value;

        if (event.target.value === '') {
          stateGuardianDropdown.classList.add('error');
        } else {
          stateGuardianDropdown.classList.remove('error');
        }

        DBteamMemberswithStateSalesForceId = await consentAndSignAjax.getTeamMemberBySalesForceId({
          salesForceId: selectedStateGuardianSalesForceId,
        });

        checkTeamMemberPopupForErrors();
      },
    });

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

        const checkIfDateBefore1900 = isDateBefore1900(event.target.value);
        const teamMember = selectedMemberData.teamMember;
        const isRequired =
          teamMember !== 'Guardian' && teamMember !== 'Parent/Guardian' && teamMember !== 'Case Manager' && teamMember !== '';

        if (checkIfDateBefore1900 || (isRequired && selectedMemberData.dateOfBirth === '')) {
          dateOfBirthInput.classList.add('error');
        } else {
          dateOfBirthInput.classList.remove('error');
        }

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

    //Email
    emailInput = input.build({
      label: 'Email',
      value: selectedMemberData.email ?? '',
      readonly: isSigned || readOnly,
      callbackType: 'input',
      callback: event => {
        let validEmail = validateEmail(event.target.value);

        if (validEmail) {
          selectedMemberData.email = event.target.value;
          emailInput.classList.remove('error');
        } else {
          // email input is not required currently
          // selectedMemberData.email = '';
          // emailInput.classList.add('error');
        }

        checkTeamMemberPopupForErrors();
      },
    });
    // Relationship Type
    relationshipTypeInput = input.build({
      label: 'Relationship Type',
      value: selectedMemberData.relationship,
      readonly: isSigned || readOnly,
      callbackType: 'input',
      callback: event => {
        selectedMemberData.relationship = event.target.value;

        checkTeamMemberPopupForErrors();
      },
    });
    // Participate Yes/NO
    const participationRadios = buildParticipationRadios();
    const parentOfMinorRadios = buildParentOfMinorRadios();

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

    function validateEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(email);
    }

    //* BUTTONS
    //*------------------------------
    const btns = buildActionBtns();

    //* Date Signed Display
    //*------------------------------
    const dateSignedDisplay = buildDateSignedDisplay();

    //* Disabled Fields
    //*------------------------------
    if (selectedMemberData.dateOfBirth) {
      dateOfBirthInput.classList.add('disabled');
    }
    if (selectedMemberData.buildingNumber) {
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

    // initial display of Form/popup before a teamMember designations is selected

    if (!$.session.planInsertNewTeamMember) {
      teamMemberDropdown.classList.add('disabled');
      nameInput.classList.add('disabled');
      lNameInput.classList.add('disabled');
      // nameInput.classList.remove('error');
      // lNameInput.classList.remove('error');
      dateOfBirthInput.classList.add('disabled');
      buildingNumberInput.classList.add('disabled');
      participatedYesRadio.classList.add('disabled');
      participatedNoRadio.classList.add('disabled');
      parentOfMinorYesRadio.classList.add('disabled');
      parentOfMinorNoRadio.classList.add('disabled');
      // radioDiv.classList.remove('error');
      // signatureTypeDropdown.classList.add('disabled');
      saveTeamMemberBtn.classList.add('disabled');
      emailInput.classList.add('disabled');
    }

    //* Required Fields
    //*------------------------------
    if ($.session.planInsertNewTeamMember) {
      const checkIfDateBefore1900 = isDateBefore1900(dateOfBirthInput.value);
      const teamMember = selectedMemberData.teamMember;
      const isRequired = teamMember !== 'Guardian' && teamMember !== 'Parent/Guardian' && teamMember !== 'Case Manager' && teamMember !== '';
      if (checkIfDateBefore1900 || (isRequired && selectedMemberData.dateOfBirth === '')) {
        dateOfBirthInput.classList.add('error');
      } else {
        dateOfBirthInput.classList.remove('error');
      }
      // email input is not currently required
      // if (selectedMemberData.email) {
      //   emailInput.classList.remove('error');
      // } else {
      //   emailInput.classList.add('error');
      // }
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

      if ($.session.planUpdate) {
        participatedYesRadio.classList.remove('disabled');
        participatedNoRadio.classList.remove('disabled');
        parentOfMinorYesRadio.classList.remove('disabled');
        parentOfMinorNoRadio.classList.remove('disabled');
        // signatureTypeDropdown.classList.remove('disabled');
      }

      if (!$.session.updateEmail) {
        emailInput.classList.add('disabled');
      }
    }

    if ($.session.planUpdate) {
      signatureTypeDropdown.classList.remove('disabled');
    } else {
      signatureTypeDropdown.classList.add('disabled');
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
      if ($.session.areInSalesForce && !selectedMemberData.salesForceId && selectedMemberData.contactId) {
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
    teamMemberPopup.appendChild(emailInput);
    if (!isNew && selectedMemberData.relationship) {
      teamMemberPopup.appendChild(relationshipTypeInput);
      relationshipTypeInput.classList.add('disabled');
    }
    teamMemberPopup.appendChild(participationRadios);
    teamMemberPopup.appendChild(parentOfMinorRadios); //
    teamMemberPopup.appendChild(signatureTypeDropdown);

    if (showConsentStatments) {
      teamMemberPopup.appendChild(changeMindQuestion);
      teamMemberPopup.appendChild(complaintQuestion);

      planConsentAndSign.setSSADropdownInitialWidth(teamMemberPopup, selectedMemberData.csChangeMindSSAPeopleId);
      planConsentAndSign.setVendorDropdownInitialWidth(teamMemberPopup, selectedMemberData.csContactProviderVendorId);
    }

    teamMemberPopup.appendChild(btns);

    populateTeamMemberDropdown(teamMemberDropdown, selectedMemberData.teamMember);
    populateSignatureTypeDropdown(signatureTypeDropdown, selectedMemberData.signatureType);

    if (showStateGuardians) {
      populateGuardiansDropDown();
    }

    POPUP.show(teamMemberPopup);

    if ($.session.planInsertNewTeamMember) {
      checkTeamMemberPopupForErrors();
    }
  }

  return {
    showPopup,
    applySelectedRelationship,
    linkToSalesForce,
    getSignatureTypeByID,
  };
})();
