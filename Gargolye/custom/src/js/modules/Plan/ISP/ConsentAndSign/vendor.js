const csVendor = (() => {
  let selectedMemberData;
  let currentTeamMemberList;
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
    //const isConsentable = planConsentAndSign.isTeamMemberConsentable(selectedMemberData.teamMember);

    if (errors.length > 0) {
      saveTeamMemberBtn.classList.add('disabled');
    } else if (
      selectedMemberData.name === '' ||
      selectedMemberData.teamMember === '' ||
      selectedMemberData.signatureType === '' ||
      selectedMemberData.participated === ''
    ) {
      saveTeamMemberBtn.classList.add('disabled');
    } else {
      saveTeamMemberBtn.classList.remove('disabled');
    }
  }

  function getSelectedVendorRel(vendorData, vendorName) {
    const cleanedVendorName = vendorName.trim();
    let selectedVendorData = vendorData.find(function (vendor) {
      return vendor.vendorName === cleanedVendorName;
    });

    if (selectedVendorData) {
      return (selectedVendor = {
        vendorName: selectedVendorData.vendorName,
        vendorId: selectedVendorData.vendorId,
        vendorAddress: selectedVendorData.vendorAddress,
      });
    }
  }
  const removeDups = data => {
    const flag = {};
    const unique = [];
    data.forEach(id => {
      if (!flag[id]) {
        flag[id] = true;
        unique.push(id);
      }
    });
    return unique;
  };
  function removeV(ids) {
    return ids.map(id => id.replace('V', ''));
  }
 async function populateVendorDropdownData(vendorData, vendorDropdown, teamMember) {
    // get vendors from the following
    // (Add Risk -> Who Is Responsible) on the Summary tab
    // (Add Experience -> Responsible Provider) on the Outcomes tab
    // (Add Paid Support -> Provider Name) on the Services tab
    const summaryVendors = planSummary.getSelectedVendors();
    const outcomesVendors = planOutcomes.getSelectedVendors();
    const servicesVendors = removeV(servicesSupports.getSelectedVendorIds());

    let selectedVendors = [...summaryVendors, ...outcomesVendors, ...servicesVendors];
    selectedVendors = removeDups(selectedVendors);
    
    // 'facilities' and 'location' are used interchangeably in vendor.js and outcomes.js 
    const facilitiesGroup = {
      groupLabel: 'Facilities',
      groupId: 'facilitiesGroup',
      dropdownValues: [],
    };

    const vendorGroup = {
      groupLabel: 'Plan Vendor',
      groupId: 'vendorGroup',
      dropdownValues: [],
    };
    const nonVendorGroup = {
      groupLabel: 'Not a Vendor on this Plan',
      groupId: 'nonVendorGroup',
      dropdownValues: [],
    };

    vendorData.forEach(vendor => {
      let isSelected = selectedVendors.includes(vendor.vendorId);
      if (isSelected) {
        vendorGroup.dropdownValues.push({ text: vendor.vendorName, value: vendor.vendorName });
      } else {
        nonVendorGroup.dropdownValues.push({ text: vendor.vendorName, value: vendor.vendorName });
      }
    });

    
    const locationData = await consentAndSignAjax.getLocationswithSalesforceId();

    // remove the locations that are already selected and displayed on the teammember screen
    if (locationData) {
      currentTeamMemberList.forEach(member => {
        for (let i = 0; i < locationData.length; i++) {
          if (member.locationId === locationData[i].ID) {
            locationData.splice(i,1);
          }
        }
      });
    }
    

    const groupDropdownData = [];

    if ($.session.applicationName !== 'Gatekeeper') {  
      //var theseLocations = locationData.filter(member => member.locationId !== '');
      facilitiesGroup.dropdownValues = locationData.map(ps => {
        return {
          value: `${ps.Name}LOCATIONID:${ps.ID}L`,
          text: ps.Name,
        };
      });

     // facilitiesGroup.dropdownValues = removeDups(facilitiesGroup.dropdownValues);
      facilitiesGroup.dropdownValues.sort((a, b) => {
        const textA = a.text.toUpperCase();
        const textB = b.text.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      groupDropdownData.push(facilitiesGroup);
    }

    //const groupDropdownData = [];
   // groupDropdownData.push(facilitiesGroup);
    groupDropdownData.push(vendorGroup);
    groupDropdownData.push(nonVendorGroup);

    if (facilitiesGroup.dropdownValues.length > 0) {
      for (let i = 0; i < facilitiesGroup.dropdownValues.length; i++) {
        if (facilitiesGroup.dropdownValues[i].text.trim() === teamMember.trim()){
          teamMember = facilitiesGroup.dropdownValues[i].value;
        }
      }
    }

    dropdown.groupingPopulate({
      dropdown: vendorDropdown,
      data: groupDropdownData,
      nonGroupedData: [{ value: '', text: '' }],
      defaultVal: teamMember.trim(),
    });
  }

  function populateTeamMemberDropdown(teamMemberDropdown, teamMember) {
    const dropdownData = [
      { text: '', value: '' },
      { text: 'Home Provider', value: 'Home Provider Vendor' },
      { text: 'Day Provider', value: 'Day Provider Vendor' },
      { text: 'Other', value: 'Other Vendor' },
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
      await planConsentAndSign.insertNewTeamMember(selectedMemberData);
      success = true;
      const pendingSavePopup = document.querySelector('.pendingSavePopup');
      pendingSavePopup.style.display = 'none';

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
  async function showPopup({
    isNewMember,
    isReadOnly,
    memberData,
    currentTeamMemberData,
    vendorData,
  }) {
    isNew = isNewMember;
    isSigned = memberData.dateSigned !== '';
    readOnly = isReadOnly;
    showConsentStatments = planConsentAndSign.isTeamMemberConsentable(memberData.teamMember);
    selectedMemberData = { ...memberData };
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
      header: isNew ? 'Add Vendor' : 'Update Vendor',
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


        if (event.target.value === '') {
          vendorDropdown.classList.add('error');
        } else {
          vendorDropdown.classList.remove('error');
        }

        if (selectedMemberData.name.includes('LOCATIONID:')) {
          
          arr = event.target.value.split("LOCATIONID:");
          selectedMemberData.name = arr[0];
          selectedMemberData.locationId = arr[1];
          selectedMemberData.vendorId = arr[1];
          
        } else {

          const vendorRel = getSelectedVendorRel(vendorData, selectedMemberData.name);
          if (selectedMemberData.name === '') {
            selectedMemberData.buildingNumber = '';
            selectedMemberData.vendorId = '';
          } else {
            selectedMemberData.buildingNumber = vendorRel.vendorAddress;
            selectedMemberData.vendorId = vendorRel.vendorId;
          }

        }
        

        buildingNumberInput.childNodes[0].value = selectedMemberData.buildingNumber.substring(0, 4);
        buildingNumberInput.classList.add('disabled');

        // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
        setStateofPopupFields();

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

        if (event.target.value === '') {
          teamMemberDropdown.classList.add('error');
        } else {
          teamMemberDropdown.classList.remove('error');
        }

        checkcsVendorPopupForErrors();
      }, // end callback
    }); // end DROP DOWN BUILD

    // Enabling/Disabling fields depending upon teamMemberDropdown selection -- Guardian or not
    function setStateofPopupFields() {
      //* Required Fields
      //*------------------------------
      if (selectedMemberData.name === '') {
        vendorDropdown.classList.add('error');
      } else {
        vendorDropdown.classList.remove('error');
      }
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
        radioDiv.classList.add('error');
      } else {
        radioDiv.classList.remove('error');
      }
    }

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
        a;
      },
    });
    buildingNumberInput.classList.add('disabled');

    input.disableInputField(buildingNumberInput);
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

    //* Required Fields
    //*------------------------------
    if (selectedMemberData.name === '') {
      vendorDropdown.classList.add('error');
    } else {
      vendorDropdown.classList.remove('error');
    }
    if (selectedMemberData.teamMember === '') {
      teamMemberDropdown.classList.add('error');
    } else {
      teamMemberDropdown.classList.remove('error');
    }
    if (selectedMemberData.participated === '') {
      radioDiv.classList.add('error');
    } else {
      radioDiv.classList.remove('error');
    }
    if (selectedMemberData.signatureType === '') {
      signatureTypeDropdown.classList.add('error');
    } else {
      signatureTypeDropdown.classList.remove('error');
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

    populateVendorDropdownData(vendorData, vendorDropdown, selectedMemberData.name);
    populateTeamMemberDropdown(teamMemberDropdown, selectedMemberData.teamMember);
    populateSignatureTypeDropdown(signatureTypeDropdown, selectedMemberData.signatureType);

    const vendorRel = getSelectedVendorRel(vendorData, selectedMemberData.name);
    if (vendorRel !== undefined) {
      buildingNumberInputValue = vendorRel.vendorAddress.substring(0, 4);
      buildingNumberInput.childNodes[0].value = buildingNumberInputValue;
    }

    POPUP.show(csVendorPopup);

    // if ($.session.planInsertNewTeamMember) {
    //   checkcsVendorPopupForErrors();
    // }
  }

  return {
    showPopup,
    getSignatureTypeByID,
    getSelectedVendorRel,
  };
})();
