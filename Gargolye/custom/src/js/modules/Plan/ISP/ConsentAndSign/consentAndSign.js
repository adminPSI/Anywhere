const planConsentAndSign = (() => {
  let selectedConsumer;
  let readOnly;
  let planId; // aka: assessmentId
  let effStartDate;
  let effEndDate;
  // DATA
  let teamMemberData;
  let paidSupportProviders;
  let providerDropdownData;
  let ssaDropdownData;
  // for important ppl popup
  let names;
  // GLOBALS
  let csSSAPeopleIdGlobal;
  let csrVendorIdGlobal;
  let csContactInputGlobal;
  // DOM
  let teamMemberTable;

  //*------------------------------------------------------
  //* Rando
  //*------------------------------------------------------
  function getTeamMembersHowTheyExistOnPlanNowWhileWeWaitOnDamnStateToMakeUpTheirMinds() {
    const data = teamMemberData.map(d => {
      return {
        value: d.name,
        text: d.name,
        caseManager: d.teamMember === 'Case Manager' ? true : false,
        contactId: d.contactId ? d.contactId : '0',
        isSigned: d.dateSigned !== '' ? true : false,
      };
    });
    return data;
  }
  function planStatusChange() {
    const planStatus = plan.getPlanStatus();
    const planActiveStatus = plan.getPlanActiveStatus();
    const addMemberBtn = document.getElementById('sig_addMember');

    if (planActiveStatus && planStatus === 'D' && $.session.planUpdate) {
      readOnly = false;
      addMemberBtn.classList.remove('disabled');
    } else {
      readOnly = true;
      addMemberBtn.classList.add('disabled');
    }
    refreshTable();
  }
  function getConsentGlobalValues() {
    return {
      SSA: csSSAPeopleIdGlobal,
      VENDOR: csrVendorIdGlobal,
      CONTACT: csContactInputGlobal,
    };
  }
  function isTeamMemberConsentable(teamMember) {
    return teamMember === 'Person Supported' ||
      teamMember === 'Parent/Guardian' ||
      teamMember === 'Guardian'
      ? true
      : false;
  }
  function getNames() {
    return names;
  }
  function getTeamMemberData() {
    return teamMemberData;
  }

  //*------------------------------------------------------
  //* INSERT/UPDATE/DELETE
  //*------------------------------------------------------
  async function insertNewTeamMember(selectedMemberData) {
    // UNSAVABLE NOTE TEXT IS REMOVED IN BACKEND ON INSERTS
    const data = {
      token: $.session.Token,
      assessmentId: planId,
      consumerId: selectedConsumer.id,
      // member
      teamMember: selectedMemberData.teamMember,
      name: selectedMemberData.name,
      lastName: selectedMemberData.lastName,
      participated: selectedMemberData.participated,
      // sign/disent
      signature: selectedMemberData.signature,
      signatureType: selectedMemberData.signatureType,
      dissentAreaDisagree: selectedMemberData.dissentAreaDisagree,
      dissentHowToAddress: selectedMemberData.dissentHowToAddress,
      // consent
      csAgreeToPlan: selectedMemberData.csAgreeToPlan,
      csChangeMind: selectedMemberData.csChangeMind,
      csChangeMindSSAPeopleId: selectedMemberData.csChangeMindSSAPeopleId,
      csContact: selectedMemberData.csContact,
      csContactInput: selectedMemberData.csContactInput,
      csContactProviderVendorId: selectedMemberData.csContactProviderVendorId,
      csDueProcess: selectedMemberData.csDueProcess,
      csFCOPExplained: selectedMemberData.csFCOPExplained,
      csResidentialOptions: selectedMemberData.csResidentialOptions,
      csRightsReviewed: selectedMemberData.csRightsReviewed,
      csSupportsHealthNeeds: selectedMemberData.csSupportsHealthNeeds,
      csTechnology: selectedMemberData.csTechnology,
      // new
      contactId: selectedMemberData.contactId,
      salesforceId: !selectedMemberData.salesforceId ? '' : selectedMemberData.salesforceId,
      peopleId: selectedMemberData.peopleId,
      buildingNumber: selectedMemberData.buildingNumber,
      dateOfBirth: UTIL.formatDateToIso(dates.removeTimestamp(selectedMemberData.dateOfBirth)),
      planYearStart: effStartDate,
      planYearEnd: effEndDate,
      useExisting: '',
      relationshipImport: selectedMemberData.relationshipImport,
      createRelationship: selectedMemberData.createRelationship,
      // attachments for signature
      hasWetSignature: selectedMemberData.hasWetSignature,
      description: selectedMemberData.description ? selectedMemberData.description : '',
      attachment: selectedMemberData.attachment ? selectedMemberData.attachment : '',
      attachmentType: selectedMemberData.attachmentType ? selectedMemberData.attachmentType : '',
      // ignore
      section: '',
      questionId: '0',
    };

    let stuff = await consentAndSignAjax.insertTeamMember(data);

    // if first insert set global values
    const isMemberConsentable = isTeamMemberConsentable(selectedMemberData.teamMember);
    if (teamMemberData.length === 0) {
      if (isMemberConsentable) {
        csSSAPeopleIdGlobal = selectedMemberData.csChangeMindSSAPeopleId;
        csrVendorIdGlobal = selectedMemberData.csContactProviderVendorId;
        csContactInputGlobal = selectedMemberData.csContactInput;
      }
    } else {
      if (isMemberConsentable) {
        const shouldUpdateSSA =
          csSSAPeopleIdGlobal !== selectedMemberData.csChangeMindSSAPeopleId ? true : false;
        const shouldUpdateVendor =
          csrVendorIdGlobal !== selectedMemberData.csContactProviderVendorId ? true : false;
        const shouldUpdateContact =
          csContactInputGlobal !== selectedMemberData.csContactInput ? true : false;

        if (shouldUpdateSSA || shouldUpdateVendor || shouldUpdateContact) {
          csSSAPeopleIdGlobal = selectedMemberData.csChangeMindSSAPeopleId;
          csrVendorIdGlobal = selectedMemberData.csContactProviderVendorId;
          csContactInputGlobal = selectedMemberData.csContactInput;

          await updateTeamMebersGlobals({
            newSSA: selectedMemberData.csChangeMindSSAPeopleId,
            newVendor: selectedMemberData.csContactProviderVendorId,
            newContact: selectedMemberData.csContactInput,
          });
        }
      }
    }

    return stuff;
  }
  async function updateTeamMember(selectedMemberData) {
    const data = {
      token: $.session.Token,
      assessmentId: planId,
      consumerId: selectedConsumer.id,
      // member
      teamMember: selectedMemberData.teamMember,
      name: selectedMemberData.name,
      lastName: selectedMemberData.lastName,
      participated: selectedMemberData.participated,
      // sign/disent
      signatureId: selectedMemberData.signatureId,
      signature: selectedMemberData.signature,
      signatureType: selectedMemberData.signatureType,
      dissentAreaDisagree: selectedMemberData.dissentAreaDisagree,
      dissentHowToAddress: selectedMemberData.dissentHowToAddress,
      // new
      contactId: selectedMemberData.contactId,
      salesforceId: !selectedMemberData.salesForceId ? '' : selectedMemberData.salesForceId,
      peopleId: selectedMemberData.peopleId,
      buildingNumber: selectedMemberData.buildingNumber,
      dateOfBirth: UTIL.formatDateToIso(dates.removeTimestamp(selectedMemberData.dateOfBirth)),
      planYearStart: effStartDate,
      planYearEnd: effEndDate,
      useExisting: '',
      relationshipImport: selectedMemberData.relationshipImport,
      createRelationship: selectedMemberData.createRelationship,
      // attachments for signature
      hasWetSignature: selectedMemberData.hasWetSignature,
      description: selectedMemberData.description ? selectedMemberData.description : '',
      attachment: selectedMemberData.attachment ? selectedMemberData.attachment : '',
      attachmentType: selectedMemberData.attachmentType ? selectedMemberData.attachmentType : '',
      // ignore
      section: '',
      questionId: '0',
    };
    const data2 = {
      token: $.session.Token,
      signatureId: selectedMemberData.signatureId,
      // consent
      csAgreeToPlan: selectedMemberData.csAgreeToPlan,
      csChangeMind: selectedMemberData.csChangeMind,
      csChangeMindSSAPeopleId: selectedMemberData.csChangeMindSSAPeopleId,
      csContact: selectedMemberData.csContact,
      csContactInput: selectedMemberData.csContactInput,
      csContactProviderVendorId: selectedMemberData.csContactProviderVendorId,
      csDueProcess: selectedMemberData.csDueProcess,
      csFCOPExplained: selectedMemberData.csFCOPExplained,
      csResidentialOptions: selectedMemberData.csResidentialOptions,
      csRightsReviewed: selectedMemberData.csRightsReviewed,
      csSupportsHealthNeeds: selectedMemberData.csSupportsHealthNeeds,
      csTechnology: selectedMemberData.csTechnology,
    };
    await consentAndSignAjax.updateTeamMember(data);
    await consentAndSignAjax.updatePlanConsentStatements(data2);

    const isMemberConsentable = isTeamMemberConsentable(selectedMemberData.teamMember);
    if (teamMemberData.length > 1) {
      if (isMemberConsentable) {
        const shouldUpdateSSA =
          csSSAPeopleIdGlobal !== selectedMemberData.csChangeMindSSAPeopleId ? true : false;
        const shouldUpdateVendor =
          csrVendorIdGlobal !== selectedMemberData.csContactProviderVendorId ? true : false;
        const shouldUpdateContact =
          csContactInputGlobal !== selectedMemberData.csContactInput ? true : false;

        if (shouldUpdateSSA || shouldUpdateVendor || shouldUpdateContact) {
          csSSAPeopleIdGlobal = selectedMemberData.csChangeMindSSAPeopleId;
          csrVendorIdGlobal = selectedMemberData.csContactProviderVendorId;
          csContactInputGlobal = selectedMemberData.csContactInput;

          await updateTeamMebersGlobals({
            newSSA: selectedMemberData.csChangeMindSSAPeopleId,
            newVendor: selectedMemberData.csContactProviderVendorId,
            newContact: selectedMemberData.csContactInput,
            idToIgnore: selectedMemberData.signatureId,
          });
        }
      }
    }
  }
  async function deleteTeamMember(id, teamMemberPopup) {
    teamMemberPopup.style.display = 'none';

    async function deleteAccept() {
      pendingSave.show('Deleting...');

      const res = await consentAndSignAjax.deleteTeamMember({
        token: $.session.Token,
        signatureId: id,
      });

      if (res === '[]') {
        pendingSave.fulfill('Deleted');
        setTimeout(() => {
          successfulSave.hide();
          POPUP.hide(teamMemberPopup);
          refreshTable();
        }, 700);
      } else {
        pendingSave.reject('Failed to delete. Please try again.');
        console.error(res);
        setTimeout(() => {
          failSave.hide();
        }, 1000);
      }
    }

    UTIL.warningPopup({
      message: 'Are you sure you would like to remove this team member?',
      accept: {
        text: 'Yes',
        callback: deleteAccept,
      },
      reject: {
        text: 'No',
        callback: () => {
          overlay.show();
          teamMemberPopup.style.removeProperty('display');
        },
      },
    });
  }
  //* Master Update For Global Questions
  async function updateTeamMebersGlobals({ newSSA, newVendor, newContact, ...rest }) {
    // loop through all and update
    teamMemberData.forEach(async member => {
      // const isMemberConsentable = isTeamMemberConsentable(member.teamMember);
      // if (!isMemberConsentable) return;
      if (member.signatureId === rest.idToIgnore) return;

      await consentAndSignAjax.updatePlanConsentStatements({
        token: $.session.Token,
        signatureId: member.signatureId,
        // consent
        csAgreeToPlan: member.csAgreeToPlan,
        csChangeMind: member.csChangeMind,
        csChangeMindSSAPeopleId: newSSA,
        csContact: member.csContact,
        csContactInput: newContact,
        csContactProviderVendorId: newVendor,
        csDueProcess: member.csDueProcess,
        csFCOPExplained: member.csFCOPExplained,
        csResidentialOptions: member.csResidentialOptions,
        csRightsReviewed: member.csRightsReviewed,
        csSupportsHealthNeeds: member.csSupportsHealthNeeds,
        csTechnology: member.csTechnology,
      });
    });
  }

  //*------------------------------------------------------
  //* DROPDOWNS
  //*------------------------------------------------------
  function getSSAById(ssaId) {
    const filteredSSA = ssaDropdownData.filter(ssa => ssa.id === ssaId);
    return filteredSSA.length > 0 ? filteredSSA[0].name : '';
  }
  // get/sort data
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
  // populate
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
  // set/update width
  function setSSADropdownInitialWidth(popup, csChangeMindSSAPeopleId) {
    const ssaDropdown = popup.querySelector('#isp_ic_ssaDropdown');
    ssaDropdown.value = csChangeMindSSAPeopleId;
    let ssaWidth = 150;
    if (ssaDropdown.selectedIndex !== -1) {
      ssaWidth = ssaDropdown.options[ssaDropdown.selectedIndex].text.length * 10;
    }
    ssaDropdown.style.width = `${ssaWidth}px`;
  }
  function setVendorDropdownInitialWidth(popup, csContactProviderVendorId) {
    const vendorContactDropdown = popup.querySelector('#isp_ic_vendorContactDropdown');
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
  // load data
  async function loadDropdownData() {
    providerDropdownData = await consentAndSignAjax.getPlanInformedConsentVendors({
      token: $.session.Token,
      peopleid: selectedConsumer.id,
    });
    ssaDropdownData = await consentAndSignAjax.getPlanInformedConsentSSAs({
      token: $.session.Token,
    });
  }

  //*------------------------------------------------------
  //* GLOBAL CONSENT QUESTIONS
  //*------------------------------------------------------
  //* Change Mind - SSA
  function buildChangeMindRadios(csChangeMind) {
    //Radio Container
    const radioContainer = document.createElement('div');
    radioContainer.classList.add('ic_questionRadioContainer');

    //Radios
    const yesRadio = input.buildRadio({
      id: 'CS_Change_Mind-yes',
      text: 'Yes',
      name: 'CS_Change_Mind',
      isChecked: csChangeMind === 'Y',
      isDisabled: readOnly,
    });
    const noRadio = input.buildRadio({
      id: 'CS_Change_Mind-no',
      text: 'No',
      name: 'CS_Change_Mind',
      isChecked: csChangeMind === 'N',
      isDisabled: readOnly,
    });

    // init required fields
    if (csChangeMind === '') {
      radioContainer.classList.add('error');
    }

    radioContainer.appendChild(yesRadio);
    radioContainer.appendChild(noRadio);

    return radioContainer;
  }
  function buildChangeMindQuestion(data, popup, isSigned) {
    // popup === 'member' || 'sign'

    //Question Container
    const changeMindQuestion = document.createElement('div');
    changeMindQuestion.classList.add('changeMindQuestion');
    changeMindQuestion.classList.add('ic_questionContainer');

    //Question Text Element, Will contain dropdown too
    const csChangeMindQuestionText = document.createElement('div');
    csChangeMindQuestionText.classList.add('changeMindQuestionText');

    //SSA Inline Dropdown
    const csChangeMindQuestionDropdown = dropdown.inlineBuild({
      dropdownId: 'isp_ic_ssaDropdown',
    });
    if (readOnly || popup === 'sign' || isSigned) {
      csChangeMindQuestionDropdown.classList.add('disabled');
    }
    // populate
    populateDropdownSSA(csChangeMindQuestionDropdown, data.csChangeMindSSAPeopleId);

    // Build Out Question with dropdown
    csChangeMindQuestionText.innerHTML = `<span>I understand that I can change my mind at any time. I just need to let</span> `;
    csChangeMindQuestionText.appendChild(csChangeMindQuestionDropdown);
    csChangeMindQuestionText.innerHTML += ` <span>know.</span>`;
    changeMindQuestion.appendChild(csChangeMindQuestionText);

    // required fields
    if (data.csChangeMindSSAPeopleId === '' && !isSigned) {
      changeMindQuestion.classList.add('error');
    }

    //* IF popup === 'member' DO NOT BUILD RADIOS
    if (popup === 'member') return changeMindQuestion;

    changeMindQuestion.classList.add('withRadios');

    const changeMindRadios = buildChangeMindRadios(data.csChangeMind);

    if (readOnly || isSigned) {
      changeMindRadios.classList.add('disabled');
    }

    changeMindQuestion.appendChild(changeMindRadios);

    return changeMindQuestion;
  }
  //* Contact/Complaint - Vendor
  function buildContactRadios(csContact) {
    //Radio Container
    const radioWrap = document.createElement('div');
    radioWrap.classList.add('ic_questionRadioContainer');
    //Radios
    const yesRadio = input.buildRadio({
      id: 'CS_Contact-yes',
      text: 'Yes',
      name: 'CS_Contact',
      isChecked: csContact === 'Y',
      isDisabled: readOnly,
    });
    const noRadio = input.buildRadio({
      id: 'CS_Contact-no',
      text: 'No',
      name: 'CS_Contact',
      isChecked: csContact === 'N',
      isDisabled: readOnly,
    });

    if (csContact === '') {
      radioWrap.classList.add('error');
    }

    radioWrap.appendChild(yesRadio);
    radioWrap.appendChild(noRadio);

    return radioWrap;
  }
  function buildContactQuestion(data, popup, isSigned) {
    // popup === 'member' || 'sign'

    //Question Container
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
    populateDropdownVendor(csContactQuestionDropdown, data.csContactProviderVendorId);

    // Build Out Question with dropdown
    contactQuestionText.innerHTML = `I understand I can contact someone at `;
    contactQuestionText.appendChild(csContactQuestionDropdown);
    contactQuestionText.innerHTML += ' if I want to file a complaint.';
    wrap.appendChild(contactQuestionText);
    contactQuestion.appendChild(wrap);

    //Contact Input
    const contactInputValue = getSSAById(data.ssaId);
    const contactInput = input.build({
      id: 'CS_Contact_Input',
      label: 'Contact',
      value: contactInputValue,
      readonly: true,
      callbackType: 'input',
    });
    contactInput.classList.add('csContactInput');
    contactQuestion.appendChild(contactInput);

    // readyonly / disabled check / required fields
    if (readOnly || popup === 'sign' || isSigned) {
      //contactQuestion.classList.add('disabled');
      contactQuestionText.classList.add('disabled');
      csContactQuestionDropdown.classList.add('disabled');
    } else {
      if ($.session.applicationName === 'Gatekeeper') {
        //contactQuestion.classList.add('disabled');
        contactQuestionText.classList.add('disabled');
        csContactQuestionDropdown.classList.add('disabled');
      } else {
        if (data.csContactProviderVendorId === '') {
          contactQuestionText.classList.add('error');
        }
      }
    }

    if (popup === 'member') return contactQuestion;

    contactQuestion.classList.add('withRadios');

    const radioWrap = buildContactRadios(data.csContact);
    if (readOnly || isSigned) {
      radioWrap.classList.add('disabled');
    }

    wrap.appendChild(radioWrap);

    return contactQuestion;
  }

  //*------------------------------------------------------
  //* TABLE
  //*------------------------------------------------------
  async function refreshTable() {
    const parentNode = teamMemberTable.parentNode;
    const oldTable = teamMemberTable;

    PROGRESS__ANYWHERE.init();
    PROGRESS__ANYWHERE.SPINNER.show(parentNode, 'Gathering Team Members...');

    teamMemberData = await consentAndSignAjax.getConsentAndSignData({
      token: $.session.Token,
      assessmentId: planId,
    });

    if (teamMemberData.length !== 0) {
      csSSAPeopleIdGlobal = teamMemberData[0].csChangeMindSSAPeopleId;
      csrVendorIdGlobal = teamMemberData[0].csContactProviderVendorId;
      csContactInputGlobal = teamMemberData[0].csContactInput;
    } else {
      csSSAPeopleIdGlobal = $.session.PeopleId;
      csrVendorIdGlobal = '';
      csContactInputGlobal = '';
    }

    PROGRESS__ANYWHERE.SPINNER.hide(parentNode);

    const newTable = buildTeamMemberTable();
    parentNode.replaceChild(newTable, oldTable);
    teamMemberTable = newTable;

    // after table refresh update planData
    planData.refreshDropdownData();
  }
  function buildTeamMemberTable() {
    const isSortable = !$.session.planUpdate || readOnly ? false : true;
    names = [];

    const teamMemberTable = table.build({
      tableId: 'signaturesTable',
      columnHeadings: ['Team Member', 'Name', 'Participated', 'Signature Type'],
      headline: 'Team Members',
      endIcon: true,
      sortable: isSortable,
      onSortCallback: res => {
        consentAndSignAjax.updateTableRowOrder({
          assessmentId: planId,
          signatureId: res.row.id.split('-')[1],
          newPos: res.newIndex,
        });
      },
    });

    if (teamMemberData) {
      const tableData = teamMemberData.map(m => {
        const isSigned = m.dateSigned !== '';
        const teamMember = m.teamMember;
        const name = contactInformation.cleanName({
          lastName: m.lastName,
          firstName: m.name,
          middleName: '',
        });
        const participated = m.participated === '' ? '' : m.participated === 'Y' ? 'Yes' : 'No';
        const signatureType = csTeamMember.getSignatureTypeByID(m.signatureType);

        names.push(name);

        const tableOBJ = {
          values: [teamMember, name, participated, signatureType],
          id: `sig-${m.signatureId}`,
          attributes: [{ key: 'data-signed', value: isSigned }],
          onClick: e => {
            csTeamMember.showPopup({
              isNewMember: false,
              isReadOnly: readOnly,
              memberData: m,
            });
          },
        };

        if (signatureType !== 'No Signature Required') {
          // show icon
          tableOBJ.endIcon = icons.edit;
          // set icon callback
          tableOBJ.endIconCallback = e => {
            csSignature.showPopup({
              isNewMember: false,
              isReadOnly: readOnly,
              memberData: m,
            });
          };
        }

        return tableOBJ;
      });

      table.populate(teamMemberTable, tableData, isSortable);
    }

    return teamMemberTable;
  }

  //*------------------------------------------------------
  //* MAIN
  //*------------------------------------------------------
  function getSectionMarkup() {
    // section
    const section = document.createElement('div');
    section.classList.add('ispSignaturesAndConsent');
    // heading
    const heading = document.createElement('h2');
    heading.innerHTML = 'Signature / Consent';
    heading.classList.add('sectionHeading');
    heading.style.marginBottom = '6px';
    // table
    const tableWrap = document.createElement('div');
    tableWrap.id = 'ispSignature_tableWrap';
    teamMemberTable = buildTeamMemberTable();

    const addMemberBtn = button.build({
      id: 'sig_addMember',
      text: 'ADD TEAM MEMBER',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        csTeamMember.showPopup({
          isNewMember: true,
          isReadOnly: readOnly,
          memberData: {
            teamMember: '',
            name: '',
            lastName: '',
            participated: '',
            // sign/disent
            signature: '',
            signatureType: '',
            dissentAreaDisagree: '',
            dissentHowToAddress: '',
            dateSigned: '',
            dissentDate: '',
            // consent
            csAgreeToPlan: '',
            csChangeMind: '',
            csChangeMindSSAPeopleId: csSSAPeopleIdGlobal,
            csContact: '',
            csContactInput: csContactInputGlobal,
            csContactProviderVendorId: csrVendorIdGlobal,
            csDueProcess: '',
            csFCOPExplained: '',
            csResidentialOptions: '',
            csRightsReviewed: '',
            csSupportsHealthNeeds: '',
            csTechnology: '',
            // new
            contactId: '',
            peopleId: '',
            buildingNumber: '',
            dateOfBirth: '',
            planYearStart: '',
            planYearEnd: '',
          },
        });
      },
    });
    tableWrap.appendChild(addMemberBtn);
    tableWrap.appendChild(teamMemberTable);

    if (readOnly) {
      teamMemberTable.classList.add('disableDrag');
      addMemberBtn.classList.add('disabled');
    }

    // build it
    section.appendChild(heading);
    section.appendChild(tableWrap);

    return section;
  }

  function invalidContactProviderVendorIdCheck() {
    const dropdownData = getVendorDropdownData();

    teamMemberData.forEach(member => {
      const filteredValue = dropdownData.filter(d => d.value === member.csContactProviderVendorId);
      if (filteredValue.length === 0) {
        teamMemberData[member].csContactProviderVendorId = '';
      }
    });
  }

  async function init(data) {
    planId = data.planId;
    readOnly = data.readOnly;
    paidSupportProviders = servicesSupports.getSelectedVendorIds();
    effStartDate = planDates.getEffectiveStartDate();
    effEndDate = planDates.getEffectiveEndDate();
    selectedConsumer = plan.getSelectedConsumer();

    teamMemberData = await consentAndSignAjax.getConsentAndSignData({
      token: $.session.Token,
      assessmentId: planId,
    });

    if (teamMemberData && teamMemberData.length !== 0) {
      csSSAPeopleIdGlobal = teamMemberData[0].csChangeMindSSAPeopleId;
      csrVendorIdGlobal = teamMemberData[0].csContactProviderVendorId;
      csContactInputGlobal = teamMemberData[0].csContactInput;
    } else {
      csSSAPeopleIdGlobal = $.session.PeopleId;
      csrVendorIdGlobal = '';
      csContactInputGlobal = '';
    }

    await loadDropdownData();

    invalidContactProviderVendorIdCheck();
  }

  return {
    init,
    refreshTable,
    getMarkup: getSectionMarkup,
    insertNewTeamMember,
    updateTeamMember,
    deleteTeamMember,
    buildChangeMindQuestion,
    buildContactQuestion,
    updateSSADropdownWidth,
    updateVendorDropdownWidth,
    setSSADropdownInitialWidth,
    setVendorDropdownInitialWidth,
    getConsentGlobalValues,
    planStatusChange,
    isTeamMemberConsentable,
    getTeamMembersHowTheyExistOnPlanNowWhileWeWaitOnDamnStateToMakeUpTheirMinds,
    getNames,
    getTeamMemberData,
  };
})();
