const csVendor = (() => {
    let selectedMemberData;
    let isNew;
    let isSigned;
    let readOnly;
    let importedFromRelationship;
    let vendorData;

    // DOM
    let csVendorPopup; // main popup
    let vendorDropdown;
    let teamMemberDropdown;
    let buildingNumberInput;
    let signatureTypeDropdown;
    let radioDiv;
    let participatedYesRadio;
    let participatedNoRadio;
    let saveTeamMemberBtn;
  
    //*------------------------------------------------------
    //* UTIL
    //*------------------------------------------------------
    function checkcsVendorPopupForErrors() {
      const errors = csVendorPopup.querySelectorAll('.error');
      const isConsentable = planConsentAndSign.isTeamMemberConsentable(selectedMemberData.teamMember);
  
      if (
        errors.length > 0 ||
        ($.session.applicationName === 'Gatekeeper' &&
          selectedMemberData.csContactProviderVendorId === '' &&
          isConsentable)
      ) {
        saveTeamMemberBtn.classList.add('disabled');
      } else if (selectedMemberData.csContactProviderVendorId === '' || selectedMemberData.participationRadios === '' || selectedMemberData.signatureType === '' || selectedMemberData.participated === '') {
        saveTeamMemberBtn.classList.add('disabled');
      } else {
        saveTeamMemberBtn.classList.remove('disabled');
      }
    }

    function getSelectedVendorRel(vendorName) {
        let selectedVendorData = vendorData.find(function(vendor) {
            return vendor.vendorName === vendorName;
          });

          
        if (selectedVendorData) {
            return selectedVendor = {vendorName: selectedVendorData.vendorName, vendorId: selectedVendorData.vendorId, vendorAddress: selectedVendorData.vendorAddress};
        } 
    }

    async function populateVendorDropdownData(teamMember) {
        vendorData = await consentAndSignAjax.getAllActiveVendors({
            token: $.session.Token,
          });
          
        let vendorDropdownData = [{text: "", value: ""}];
        vendorDropdownData = vendorDropdownData.concat(vendorData.map(vendor => ({text: vendor.vendorName, value: vendor.vendorName})));
        
        dropdown.populate(vendorDropdown, vendorDropdownData, teamMember)
    }

    function populateTeamMemberDropdown(teamMemberDropdown, teamMember) {
        const existingTeamMemberType = teamMember.split(" ", 2).join(" ");
      const dropdownData = [
        { text: '', value: '' },
        { text: 'Home Provider Vendor', value: 'Home Provider Vendor' },
        { text: 'Day Provider Vendor', value: 'Day Provider Vendor' },
        { text: 'Other Vendor', value: 'Other Vendor' },
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
  
    async function saveTeamMember() {  
      csVendorPopup.style.display = 'none';
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

        let rd = await planConsentAndSign.insertNewTeamMember(selectedMemberData, true);
        rd = rd ? rd[0] : {};
  
        if (rd.existingPeopleId) {
          const pendingSavePopup = document.querySelector('.pendingSavePopup');
          pendingSavePopup.style.display = 'none';
  
          csRelationship.showExistingPopup(selectedMemberData, async usePerson => {
            if (usePerson) {
              pendingSavePopup.style.display = 'block';
              selectedMemberData.peopleId = rd.existingPeopleId;
              await planConsentAndSign.insertNewTeamMember(selectedMemberData, true);
              success = true;
  
              if (success) {
                pendingSave.fulfill('Saved');
                setTimeout(() => {
                  const savePopup = document.querySelector('.successfulSavePopup');
                  DOM.ACTIONCENTER.removeChild(savePopup);
                  POPUP.hide(csVendorPopup);
                  planConsentAndSign.refreshTable();
                }, 700);
              } else {
                pendingSave.reject('Failed to save, please try again.');
                console.error(res);
                setTimeout(() => {
                  const failPopup = document.querySelector('.failSavePopup');
                  DOM.ACTIONCENTER.removeChild(failPopup);
                  csVendorPopup.style.removeProperty('display');
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
  
              POPUP.hide(csVendorPopup);
              planConsentAndSign.refreshTable();
            }, 700);
          } else {
            pendingSave.reject('Failed to save, please try again.');
            console.error(res);
            setTimeout(() => {
              const failPopup = document.querySelector('.failSavePopup');
              DOM.ACTIONCENTER.removeChild(failPopup);
              csVendorPopup.style.removeProperty('display');
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
            POPUP.hide(csVendorPopup);
            planConsentAndSign.refreshTable();
          }, 700);
        } else {
          pendingSave.reject('Failed to save, please try again.');
          console.error(res);
          setTimeout(() => {
            const failPopup = document.querySelector('.failSavePopup');
            DOM.ACTIONCENTER.removeChild(failPopup);
            csVendorPopup.style.removeProperty('display');
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
          checkcsVendorPopupForErrors();
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
          checkcsVendorPopupForErrors();
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
          POPUP.hide(csVendorPopup);
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
          planConsentAndSign.deleteTeamMember(selectedMemberData.signatureId, csVendorPopup);
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
  
    //* link btn popups
  
    //*------------------------------------------------------
    //* MAIN
    //*------------------------------------------------------
    async function showPopup({ isNewMember, isReadOnly, memberData, currentTeamMemberData }) {
      isNew = isNewMember;
      isSigned = memberData.dateSigned !== '';
      readOnly = isReadOnly;
      showConsentStatments = planConsentAndSign.isTeamMemberConsentable(memberData.teamMember);
      selectedMemberData = { ...memberData };
      // TOOD 94246: IF the LIMITED NUMBER OF GUARDIANS or Parent Guardians have been reached, then REMOVE 'Guardians' from the teamMember DDL
      currentTeamMemberList = currentTeamMemberData;
  
      // if (!isNew && $.session.applicationName === 'Advisor') {
      //   selectedMemberData.csChangeMindSSAPeopleId = $.session.UserId;
      // }
  
      //*--------------------------------------
      //* POPUP
      //*--------------------------------------
      csVendorPopup = POPUP.build({
        id: 'sig_mainPopup',
        hideX: true,
        header:  isNew ? 'Add Vendor' : 'Update Vendor',
      });
  
      //* INPUTS
      //*------------------------------
      // Vendor
      vendorDropdown = dropdown.build({
        dropdownId: 'sigPopup_vendor',
        label: 'Vendor',
        readonly: isSigned || readOnly,
        callback: async event => {
            
          selectedMemberData.name = event.target.value;
          const vendorRel = getSelectedVendorRel(selectedMemberData.name)
          selectedMemberData.buildingNumber = vendorRel.vendorAddress;

          buildingNumberInput.childNodes[0].value = selectedMemberData.buildingNumber.substring(0, 4);
          buildingNumberInput.classList.add('disabled');
  
          // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
          setStateofPopupFields();
  
          // inserting/removing the conditional fields based on teamMemberDropdown selection
          //insertingConditionalFieldsintoPopup();
  
          checkcsVendorPopupForErrors();
        }, // end callback
      }); // end DROP DOWN BUILD

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
  
          checkcsVendorPopupForErrors();
        }, // end callback
      }); // end DROP DOWN BUILD
  
      // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
      function setStateofPopupFields() {
        if ($.session.planInsertNewTeamMember) {
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
          if (selectedMemberData.signatureType === '') {
            signatureTypeDropdown.classList.add('error');
          } else {
            signatureTypeDropdown.classList.remove('error');
          }
          if (selectedMemberData.participated === '') {
            console.log("here")
            participationRadios.classList.add('error');
          } else {
            participationRadios.classList.remove('error');
          }
        }
      }
  
      // inserting/removing the conditional fields based on teamMemberDropdown selection
      function insertingConditionalFieldsintoPopup() {
        if (selectedMemberData.teamMember === '') {
          // team member has NOT been selected
  
          teamMemberDropdown.classList.add('error');

        }  //end if -- team member has been selected
      } // end if -- function insertingConditionalFieldsintoPopup()
  
  
      teamMemberDropdown.classList.add('teamMemberDropdown');
  
      // Building Number
      buildingNumberInput = input.build({
        label: 'Building Number',
        value: selectedMemberData.buildingNumber,
        readonly: isSigned || readOnly,
        callbackType: 'input',
        callback: event => {
          selectedMemberData.buildingNumber = event.target.value;
  
          checkcsVendorPopupForErrors();
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
  
          checkcsVendorPopupForErrors();
        },
      });
  
      //* GLOBAL CONSENT QUESTIONS
      //*------------------------------
    //   if (showConsentStatments) {
    //     changeMindQuestion = getChangeMindMarkup();
    //     complaintQuestion = await getContactMarkup();
    //   }
  
      //* BUTTONS
      //*------------------------------
      const btns = buildActionBtns();
  
      //* Date Signed Display
      //*------------------------------
      const dateSignedDisplay = buildDateSignedDisplay();
  
      //* Disabled Fields
      //*------------------------------
      if (selectedMemberData.buildingNumber) {
        buildingNumberInput.classList.add('disabled');
      }
  
      // initial display of Form/popup before a teamMember designations is selected
  
      if ($.session.planInsertNewTeamMember) {
        teamMemberDropdown.classList.add('error');
        buildingNumberInput.classList.add('disabled');
        participatedYesRadio.classList.add('disabled');
        participatedNoRadio.classList.add('disabled');
        radioDiv.classList.remove('error');
        signatureTypeDropdown.classList.add('disabled');
        saveTeamMemberBtn.classList.add('disabled');//
      }
  
      //* Add elements to popup
      //*------------------------------
      if (isSigned) {
        csVendorPopup.appendChild(dateSignedDisplay);
      }

      csVendorPopup.appendChild(vendorDropdown);
      csVendorPopup.appendChild(teamMemberDropdown);
      csVendorPopup.appendChild(buildingNumberInput);
      csVendorPopup.appendChild(participationRadios);
      csVendorPopup.appendChild(signatureTypeDropdown);
      csVendorPopup.appendChild(btns);
 
      await populateVendorDropdownData(selectedMemberData.name);
      populateTeamMemberDropdown(teamMemberDropdown, selectedMemberData.teamMember);
      populateSignatureTypeDropdown(signatureTypeDropdown, selectedMemberData.signatureType);

  
      POPUP.show(csVendorPopup);
  
      if ($.session.planInsertNewTeamMember) {
        checkcsVendorPopupForErrors();
      }
    }
  
    return {
      showPopup,
      getSignatureTypeByID,
    };
  })();