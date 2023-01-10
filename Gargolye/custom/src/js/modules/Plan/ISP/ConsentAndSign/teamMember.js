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
  let stateChangeMindObj;
  let selectedStateChangeMind = '';
  let selectedStateChangeMindSalesForceId = '';
  // DOM
  let teamMemberPopup; // main popup
  let linkToRelationshipBtn;
  let linkToSalesforceBtn;
  let teamMemberDropdown;
  let stateGuardianDropdown;
  let stateChangeMindDropdown;
  let nameInput;
  let lNameInput;
  let dateOfBirthInput;
  let buildingNumberInput;
  let relationshipInput;
  let signatureTypeDropdown;
  let radioDiv;
  let participatedYesRadio;
  let participatedNoRadio;
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
    if (stateGuardiansObj) {
      guarddata = stateGuardiansObj.map(dd => {
        return {
          value: dd.Id,
          text: dd.FirstName + ' ' + dd.LastName,
        };
      });
      guarddata.unshift({ value: '', text: 'SELECT MATCHING STATE GUARDIAN' });
    } else {
      guarddata = [{ value: '', text: 'No Guardians' }];
    }

    dropdown.populate(stateGuardianDropdown, guarddata);
  }

  async function populateStateChangeMindDropDown() {

    var selectedConsumer = plan.getSelectedConsumer();
    //TODO 92768: CALL different OISP function to get the change mind contacts
    stateChangeMindObj = await consentAndSignAjax.getStateGuardiansforConsumer({
      peopleId: selectedConsumer.id,
    });

    let data;
    if (stateChangeMindObj) {
      data = stateChangeMindObj.map(dd => {
        return {
          value: dd.Id,
          text: dd.FirstName + ' ' + dd.LastName,
        };
      });
      data.unshift({ value: '', text: 'SELECT MATCHING STATE CONTACT' });
    } else {
      data = [{ value: '', text: 'No Contacts' }];
    }

    dropdown.populate(stateChangeMindDropdown, data);
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
    if (!$.session.planSignatureUpdateDOB) {
      dateOfBirthInput.classList.add('disabled');
    }
    if (!$.session.planSignatureUpdateBuildingNumber) {
      buildingNumberInput.classList.add('disabled');
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
      teamMemberDropdown.classList.remove('disabled');
      participatedYesRadio.classList.remove('disabled');
      participatedNoRadio.classList.remove('disabled');
      signatureTypeDropdown.classList.remove('disabled');
      // set errors
      if (selectedMemberData.teamMember === '') {
        teamMemberDropdown.classList.add('error');
      }
      if (selectedMemberData.signatureType === '') {
        signatureTypeDropdown.classList.add('error');
      }
      radioDiv.classList.add('error');
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

if (selectedMemberData.teamMember === 'Guardian' || selectedMemberData.teamMember === 'Parent/Guardian' ) {
    var continueGuardianSave = await continueSaveofGuardianTeamMember();
    if (!continueGuardianSave) return;
 }  
  
 // TODO 92768 -- uncomment to await continueSaveofConsentableTeamMember -- from consentandSign.js -- function isTeamMemberConsentable(teamMember)
 if (selectedMemberData.teamMember === 'Guardian' || selectedMemberData.teamMember === 'Parent/Guardian' || selectedMemberData.teamMember === 'Person Supported') {
   //  var continueConsentableSave = await continueSaveofConsentableTeamMember();
  //    if (!continueConsentableSave) return;
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

// Handling of selection of teamMember == Guardian or teamMember == Parent/Guardian 
// TODO 94246: All these alerts/consfirms -- do we need to make them into Anywhere style
  async function continueSaveofGuardianTeamMember() {

    let updatesuccess;

        if (confirm('Is the selected State Guardian the same person as the entered Guardian in the form?')) {
            // YES -- Continue
        } else {
          alert(`Guardian not listed in Salesforce for this individual and must be entered on SalesForce Portal.`);
          return false;
        };
        // selected imported/manually entered SalesForceID has a value, AND selectedStateGuardianSalesForceId has a value -- AND -- they are equal
        if (selectedStateGuardianSalesForceId && selectedMemberData.salesforceId === selectedStateGuardianSalesForceId) { 

          alert('Its a match. Continue saving new team member.');
          return true;
          
        // selected imported/manually entered SalesForceID has NO value, AND selectedStateGuardianSalesForceId has a value
        } else if (!selectedMemberData.salesforceId && selectedStateGuardianSalesForceId) {  

          alert(`Update the GK people.SalesForce_ID for  ${selectedMemberData.lastName} with the StateSalesForceId from the State`);
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
                selectedMemberData.salesforceId = selectedStateGuardianSalesForceId;
                return true;
              } else {
                alert('Update of GK people.SalesForceID failed; therefore, inserting this Guardian will not be attempted.');
                return false;
              }
          // selected imported/manually entered SalesForceID has a value, AND selectedStateGuardianSalesForceId has a value --BUT-- they are NOT equal
        } else if ((selectedMemberData.salesforceId && selectedStateGuardianSalesForceId) && (selectedMemberData.salesforceId !== selectedStateGuardianSalesForceId )) {  

          if (confirm(`These salesForceIds do not match. Do you want to Insert the selected State Guardian ${selectedStateGuardian} into the GK Database and save the selected State Guardian as a new Team Member?`)) {
              var fullName = selectedStateGuardian.split(' ');
              selectedMemberData.firstName = fullName[0];
              selectedMemberData.lastName = fullName[fullName.length - 1];
              selectedMemberData.buildingNumber = '';
              selectedMemberData.dateOfBirth = '';
              selectedMemberData.salesforceId = selectedStateGuardianSalesForceId; 
              return true;    
          } else {
            alert(`Guardian not listed in Salesforce for this individual and must be entered on SalesForce Portal.`);
            return false;
          };
        // selectedStateGuardianSalesForceId has NO value
        } else {  

          alert(`Guardian not listed in Salesforce for this individual and must be entered on SalesForce Portal.`); 
          return false;

        } // end if processing salesforceID 
  }

  // Handling of selection of teamMember == Guardian or teamMember == Parent/Guardian or teamMember == Person Supported
// TODO 92768: All these alerts/consfirms -- do we need to make them into Anywhere style  
// TODO 92768: Need to check if the selectedMemberData.csChangeMindSSAPeopleId in the People table has a saleForceId
async function continueSaveofConsentableTeamMember() {

  // csChangeMind: selectedMemberData.csChangeMind,
  // csChangeMindSSAPeopleId: selectedMemberData.csChangeMindSSAPeopleId,

  // TODO 92768: Get the GK SalesForceID for the local SSA selected -- selectedLocalSSASalesForceId -- this will probably need to be global
  var selectedLocalSSASalesForceId = '';

    if (confirm('Is the selected State Contact the same person as the selected local Contact in the form?')) {
        // YES -- Continue
    } else {
      alert(`Contact not listed in Salesforce for this individual and must be entered on SalesForce Portal.`);
      return false;
    };

    // selected local contact/SSA SalesForceID has a value, AND selectedStateChangeMindSalesForceId has a value -- AND -- they are equal
    if (selectedStateChangeMindSalesForceId && selectedLocalSSASalesForceId === selectedStateChangeMindSalesForceId) { 
 
      alert('Its a match. Continue saving new team member.');
      return true;

     // THIS SCENARIO NOT POSSIBLE -- selected local contact/SSA SalesForceID has a NO value, AND selectedStateChangeMindSalesForceId has a value
    } else if (!selectedLocalSSASalesForceId && selectedStateChangeMindSalesForceId) {

      alert(`Update the GK people.SalesForce_ID for the selectedLocalSSAPeopleID with the StateSalesForceId from the State`);
    
    // selected local contact/SSA SalesForceID has a value, AND selectedStateChangeMindSalesForceId has a value --BUT-- they are NOT equal
    // TODO 92768: ???? unassign the current SSA/consumer relationship at salesforce and assign a new SSA/consumer relationship at salesforce for the given SSA/QIDP and consumer.
    // MY BEST GUESS -- assign the SalesForceID from the STATE (in stateChangeMindDropdown ) to the selected SSA in changeMindQuestion
    } else if ((selectedLocalSSASalesForceId && selectedStateChangeMindSalesForceId) && (selectedLocalSSASalesForceId !== selectedStateChangeMindSalesForceId)) { 

      if (confirm(`These salesForceIds do not match. Do you want to Update the GK people.SalesForce_ID for the selectedLocalSSAPeopleID with the StateSalesForceId from the State and save the selected State Guardian as a new Team Member?`)) {
        // TODO 92768: REVIEW THIS 
        //TODO 92768: modify newSAlesForceId in PlanSignatureWorker.cs (line 192) -- psdg.createRelationship(token, planYearStart, planYearEnd, consumerId, peopleId, newSalesForceId);
        // TODO 92768: NOT SURE WHAT THE FOLLOWING MEANS TO THE DATA BEING SAVED
        // POSSIBILITY A SECOND UPDATE TO THE PEOPLE TABLE FOR THE SELECTED LOCAL SSA -- Update the salesforce_id in the people table in GK for the SSA to match the value found in the STATE SSA DDL (stateChangeMindDropdown).
        // IF this update is successful then return true; otherwise return the messsage below saying the contact couldn't be saved and therefore the entire record can't be saved
        selectedLocalSSASalesForceId = selectedStateChangeMindSalesForceId;
        return true;
      } else {
        alert(`Contact not listed in Salesforce for this individual and must be entered on SalesForce Portal.`);
        return false;

      }
    // selectedStateChangeMindSalesForceId has NO value
    } else {
   
      alert(`Contact not listed in Salesforce for this individual and must be entered on SalesForce Portal.`); 
      return false;

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
    }

    return mainWrap;
  }

  //* global consent
  function getChangeMindMarkup() {
    // get markup
    
    //TODO 92768: SELECT the SalesForceID for csChangeMindSSAPeopleId -- ASSUMPTION IF THERE IS A SALESForCEID FOR THIS PEOPLEID, THEN WE CAN CONTINE WITH function continueSaveofConsentableTeamMember()
    // If SalesForceID for selectedMemberData.csChangeMindSSAPeopleId is NULL
    //    THEN  -->  selectedMemberData.csChangeMindSSAPeopleId = ''; -- this will make the DDL RED and NO Value selected
    //  ELSE --> continue

   // selectedMemberData.csChangeMindSSAPeopleId = '';

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

        // TODO 92768: WE ARE HERE BECAUSE -- Either the user is changing SSA OR No default SSA was selected becuase the default didn't have a SalesForceID
        // Upon a new Selection of SSA, the following happens with the NEW selectedMemberData.csChangeMindSSAPeopleId
        // GO TO DB AND SELECT the SalesForceID for selectedMemberData.csChangeMindSSAPeopleId
        // If SalesForceID for csChangeMindSSAPeopleId is MULL
        //    THEN  --> show a POPUP LIST of values from the anyw_isp_case_manager_options table in a pop up  
        //               a.  Only show records that have a salesforce_id NOT in the people table
        //               b.  Values should show as "LastName, FirstName" and sort by last name then first name
        //               c.  User selects SSA/QIDP from the list and clicks OK to the pop up, then...
        //               d.  Update the salesforce_id in the people table in GK for the SSA to match the value found in the anyw_isp_case_manager table for the selected SSA.
        //               NOW -- THE NEW SELECTION (FROM changeMindQuestion) HAS NOW BEEN UPDATED WITH THE SALESFORCEID FROM THE POPUP LIST (anyw_isp_case_manager_options)
	 
        //  ELSE --> continue -- ASSUMPTION IF THERE IS A SALESForCEID FOR THIS PEOPLEID, THEN WE CAN CONTINE WITH function continueSaveofConsentableTeamMember()


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
    isNew = isNewMember;
    isSigned = memberData.dateSigned !== '';
    readOnly = isReadOnly;
    showConsentStatments = planConsentAndSign.isTeamMemberConsentable(memberData.teamMember);
    showStateGuardians = planConsentAndSign.isTeamMemberGuardian(memberData.teamMember);
    selectedMemberData = { ...memberData };
    // TOOD 94246: IF the LIMITED NUMBER OF GUARDIANS or Parent Guardians have been reached, then REMOVE 'Guardians' from the teamMember DDL
    var test = currentTeamMemberData;

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
       
        // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
        setStateofPopupFields();

        // inserting/removing the conditional fields based on teamMemberDropdown selection
        insertingConditionalFieldsintoPopup();
   
        checkTeamMemberPopupForErrors();
      },  // end callback
     
    });  // end DROP DOWN BUILD

    // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
    function setStateofPopupFields() {

    if ($.session.planInsertNewTeamMember) {
      linkToRelationshipBtn.classList.remove('disabled');
      nameInput.classList.remove('disabled');
      lNameInput.classList.remove('disabled');
      dateOfBirthInput.classList.remove('disabled');
      buildingNumberInput.classList.remove('disabled');
      participatedYesRadio.classList.remove('disabled');
      participatedNoRadio.classList.remove('disabled');
      radioDiv.classList.add('error');
      signatureTypeDropdown.classList.remove('disabled');
      
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


    }

  // inserting/removing the conditional fields based on teamMemberDropdown selection
    function insertingConditionalFieldsintoPopup() {

            if (selectedMemberData.teamMember === '') {   // team member has NOT been selected

              teamMemberDropdown.classList.add('error');
              // remove consent statements from DOM
              if (showConsentStatments) {
                changeMindQuestion.parentNode.removeChild(changeMindQuestion);
                stateChangeMindDropdown.parentNode.removeChild(stateChangeMindDropdown);
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

        } else {  // team member has been selected

          teamMemberDropdown.classList.remove('error');

          const isSelectedTeamMemberConsentable = planConsentAndSign.isTeamMemberConsentable(
            selectedMemberData.teamMember,
          );

          insertingFieldsBasedonConsentable(isSelectedTeamMemberConsentable);

          const isSelectedTeamMemberGuardian = planConsentAndSign.isTeamMemberGuardian(
            selectedMemberData.teamMember,
          );

          insertingFieldsBasedonGuardian(isSelectedTeamMemberGuardian);
        
        }  //end if -- team member has been selected

    }  // end if -- function insertingConditionalFieldsintoPopup()

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
            // teamMemberPopup.insertBefore(stateChangeMindDropdown, participationRadios);
              teamMemberPopup.insertBefore(complaintQuestion, participationRadios);
              if (selectedStateChangeMind === '') stateChangeMindDropdown.classList.add('error');
            //  
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

      } else {  // if NOT isSelectedTeamMemberConsentable

            if (showConsentStatments) {
              changeMindQuestion.parentNode.removeChild(changeMindQuestion);
           //   stateChangeMindDropdown.parentNode.removeChild(stateChangeMindDropdown);
              complaintQuestion.parentNode.removeChild(complaintQuestion);
            // if (showStateGuardians) stateGuardianDropdown.parentNode.removeChild(stateGuardianDropdown);
              showConsentStatments = false;
              // selectedMemberData.csChangeMindSSAPeopleId = '';
              // selectedMemberData.csContactProviderVendorId = '';
              // selectedMemberData.csContactInput = '';
            }
      } // end if -- isSelectedTeamMemberConsentable

    }

    function insertingFieldsBasedonGuardian(isSelectedTeamMemberGuardian) {

      if (isSelectedTeamMemberGuardian) {
        // show guardan DDL only if it's not there
        if (!showStateGuardians) {

            showStateGuardians = true;      
            teamMemberPopup.insertBefore(stateGuardianDropdown, nameInput);
            if (selectedStateGuardian === '') stateGuardianDropdown.classList.add('error');
        
        }

      } else {  // if NOT isSelectedTeamMemberGuardian

            if (showStateGuardians) {
      
              stateGuardianDropdown.parentNode.removeChild(stateGuardianDropdown);
              showStateGuardians = false;
              
            }
      } // end if -- isSelectedTeamMemberGuardian

    }

    teamMemberDropdown.classList.add('teamMemberDropdown');

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

        // const teamMemberData = await consentAndSignAjax.getTeamMemberBySalesForceId({
        //   salesForceId: selectedStateGuardianSalesForceId,
        // });
    
        // let test = teamMemberData;

        // if (teamMemberData && teamMemberData.length !== 0) {
        // }


        checkTeamMemberPopupForErrors();
      },
    });

    // State Change Mind
    stateChangeMindDropdown = dropdown.build({
      dropdownId: 'sigPopup_stateChangeMind',
      label: 'State Change Mind',
      readonly: isSigned || readOnly,
      callback: event => {
        selectedStateChangeMind = event.target.options[event.target.selectedIndex].innerHTML;
        selectedStateChangeMindSalesForceId = event.target.value;

        if (event.target.value === '') {
          stateChangeMindDropdown.classList.add('error');
        } else {
          stateChangeMindDropdown.classList.remove('error');
        }

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

    if ($.session.planInsertNewTeamMember) {
      teamMemberDropdown.classList.add('error');
      linkToRelationshipBtn.classList.add('disabled');
      nameInput.classList.add('disabled');
      lNameInput.classList.add('disabled');
      nameInput.classList.remove('error');
      lNameInput.classList.remove('error');
      dateOfBirthInput.classList.add('disabled');
      buildingNumberInput.classList.add('disabled');
      participatedYesRadio.classList.add('disabled');
      participatedNoRadio.classList.add('disabled');
      radioDiv.classList.remove('error');
      signatureTypeDropdown.classList.add('disabled');
      saveTeamMemberBtn.classList.add('disabled');
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
    await populateGuardiansDropDown();
   // await populateStateChangeMindDropDown();

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
