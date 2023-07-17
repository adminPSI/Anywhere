const planOutcomes = (() => {
  let isReadOnly;
  let isSortable;
  let planId; // aka: assessmentId
  let progressSummaryId;
  let progressSummary;
  let outcomesData;
  let dropdownData;
  let outcomesWrap;
  let outcomesProgressSummary;
  let addOutcomeBtn;
  let addExpTableBtn;
  let teamMembers;
  let hasPreviousPlan;
  let charLimits;
  let responseIdCache = {};
  // Selected Vendors => Experiences/WhoResponsible
  let selectedVendors = {};
  let validationCheck;
  function getSelectedVendors() {
    return Object.values(selectedVendors);
  }
  //*------------------------------------------------------
  //* UTILS
  //*------------------------------------------------------
  function refreshDropdownData(newDropdownData) {
    dropdownData = newDropdownData;
  }
  function mapOutcomesDetails(data) {
    if (!data || data.planOutcome.length === 0) return {};

    const outcomes = {};

    data.planOutcome.forEach(o => {
      if (!outcomes[o.outcomeId]) {
        outcomes[o.outcomeId] = {
          sectionId: o.sectionId,
          outcomeId: o.outcomeId,
          outcomeOrder: o.outcomeOrder,
          outcome: o.outcome,
          details: o.details,
          history: o.history,
          status: o.status,
          carryOverReason: o.carryOverReason,
          experiences: {},
          reviews: {},
        };
      }
    });
    data.planOutcomeExperiences.forEach(o => {
      const oc = outcomes[o.outcomeId];
      if (!oc) return 'error: outcome or outcomeId is invalid or missing';

      if (!oc.experiences[o.experienceId]) {
        oc.experiences[o.experienceId] = {
          experienceIds: o.experienceId,
          experienceOrder: o.experienceOrder,
          outcomeId: o.outcomeId,
          whatHappened: o.whatHappened,
          howHappened: o.howHappened,
          responsibilities: {},
        };
        o.planExperienceResponsibilities.forEach((resp, index) => {
          if (!oc.experiences[o.experienceId].responsibilities[index]) {
            oc.experiences[o.experienceId].responsibilities[index] = {
              responsibilityIds: resp.responsibilityId,
              responsibleContact: !resp.responsibleContact ? '%' : resp.responsibleContact,
              responsibleProvider: !resp.responsibleProvider ? '%' : resp.responsibleProvider,
              whenHowOftenValue: resp.whenValue,
              whenHowOftenFrequency: resp.whenFrequency,
              whenHowOftenText: resp.whenOther,
            };
          }
        });
      }
    });
    data.planReviews.forEach(o => {
      const oc = outcomes[o.outcomeId];
      if (!oc) return 'error: outcome or outcomeId is invalid or missing';

      if (!oc.reviews[o.outcomeReviewId]) {
        oc.reviews[o.outcomeReviewId] = {
          whatWillHappen: o.whatWillHappen,
          whenToCheckIn: o.whenToCheckIn,
          whoReview: o.who,
          reviewIds: o.outcomeReviewId,
          whoResponsible: o.whoResponsible,
          contactId: o.contactId,
          reviewOrder: o.reviewOrder,
          outcomeId: o.outcomeId,
        };
      }
    });

    return outcomes;
  }
  function sortOutcomesByOrder(outcomeData) {
    return [...outcomeData].sort((objA, objB) => {
      if (objA.outcomeOrder === objB.outcomeOrder) return 0;

      return objA.outcomeOrder < objB.outcomeOrder ? -1 : 1;
    });
  }
  function checkIfSummaryRequired() {
    const outcomes = [...document.querySelectorAll('.outcome')];

    if (outcomes.length > 0 && progressSummary === '') {
      outcomesProgressSummary.classList.add('error');
    } else {
      outcomesProgressSummary.classList.remove('error');
    }
  }

  //*------------------------------------------------------
  //* DROPDOWNS
  //*------------------------------------------------------
  //-- populate -------
  function populateAssessmentAreaDropdown(dropdownEle, defaultValue) {
    const a = assessment.getApplicableSections();

    const data = dropdownData.assessmentAreas
      .filter(dd => a[dd.assessmentAreaId])
      .map(dd => {
        return {
          value: dd.assessmentAreaId,
          text: dd.assessmentArea,
        };
      });

    data.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    data.unshift({ value: '%', text: '' });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateStatusDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.outcomeStatus.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateExperiencesHowOftenDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.howOFtenExperiences.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateReviewsWhoDropdown(dropdownEle, defaultValue) {
    //  teamMembers = planConsentAndSign.getTeamMembersHowTheyExistOnPlanNowWhileWeWaitOnDamnStateToMakeUpTheirMinds();

    teamMembers = planData.getDropdownData().relationships.map(dd => {
      return {
        peopleId: dd.peopleId,
        text: `${dd.lastName}, ${dd.firstName}`,
      };
    });

    let data;
    if (teamMembers) {
      data = teamMembers.map(dd => {
        return {
          value: dd.peopleId,
          text: dd.text,
        };
      });

      data.sort((a, b) => {
        const textA = a.text.toUpperCase();
        const textB = b.text.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      data.unshift({ value: '%', text: '' });
    } else {
      data = [{ value: '%', text: '' }];
    }

    dropdown.populate(dropdownEle, data, defaultValue);
  }

  async function populateResponsibleProviderDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.serviceVendors.map(dd => {
      return {
        value: dd.vendorId,
        text: dd.vendorName,
      };
    });

    // const selectedVendorIds = servicesSupports.getSelectedVendorIds();

    const { getPlanOutcomesPaidSupportProvidersResult: selectedVendors } =
      await planOutcomesAjax.getPlanOutcomesPaidSupportProviders(planId);

    const selectedVendorIds = getSelectedVendorIds();

    const nonPaidSupportData = data.filter(provider => !selectedVendorIds.includes(provider.value));
    const paidSupportData = data.filter(provider => selectedVendorIds.includes(provider.value));

    const nonPaidSupportDropdownData = nonPaidSupportData.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });
    const paidSupportDropdownData = paidSupportData.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    nonPaidSupportDropdownData.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    paidSupportDropdownData.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    const nonGroupedDropdownData = [{ value: '', text: '[SELECT A PROVIDER]' }];
    const paidSupportGroup = {
      groupLabel: 'Paid Support Providers',
      groupId: 'isp_ss_providerDropdown_paidSupportProviders',
      dropdownValues: paidSupportDropdownData,
    };
    const nonPaidSupportGroup = {
      groupLabel: 'Other Providers',
      groupId: 'isp_ss_providerDropdown_nonPaidSupportProviders',
      dropdownValues: nonPaidSupportDropdownData,
    };

    const groupDropdownData = [];
    if (paidSupportDropdownData.length > 0) {
      groupDropdownData.push(paidSupportGroup);
    }

    //if there's no default value, and only one option, make that option the default
    if (!defaultValue) {
      const tempData = [...nonPaidSupportDropdownData, ...paidSupportDropdownData];
      if (tempData.length === 1) {
        defaultValue = tempData[0].value;
        saveUpdateProvider = defaultValue;
        dropdownEle.classList.remove('error');
      }
    }

    groupDropdownData.push(nonPaidSupportGroup);

    dropdown.groupingPopulate({
      dropdown: dropdownEle,
      data: groupDropdownData,
      nonGroupedData: nonGroupedDropdownData,
      defaultVal: defaultValue,
    });

    function getSelectedVendorIds() {
      return selectedVendors.reduce((acc, vendor) => {
        acc.push(vendor.vendorId);
        return acc;
      }, []);
    }
    // data.sort((a, b) => {
    //   const textA = a.text.toUpperCase();
    //   const textB = b.text.toUpperCase();
    //   return textA < textB ? -1 : textA > textB ? 1 : 0;
    // });
    // data.unshift({ value: '%', text: '' });

    // dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateResponsibleContactDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.relationships.map(dd => {
      return {
        value: dd.contactId,
        text: `${dd.lastName}, ${dd.firstName}`,
      };
    });

    data.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    data.unshift({ value: '%', text: '' });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  //-- map id to name -------
  function getWhenHowOFtenFrequencyById(id) {
    const filteredFrequency = dropdownData.howOFtenExperiences.filter(dd => dd.value === id);
    return filteredFrequency.length > 0 ? filteredFrequency[0].text : '';
  }
  function getWhoTypeById(id) {
    // teamMembers = planData.getDropdownData().relationships.map(dd => {
    //   return {
    //     peopleId: dd.peopleId,
    //     text: `${dd.lastName}, ${dd.firstName}`,
    //   };
    // });
    const filteredWho = dropdownData.relationships.filter(dd => dd.contactId === id);
    if (filteredWho && filteredWho.length > 0) {
      return filteredWho[0].teamMember === 'Case Manager' ? true : false;
    }
  }

  //*------------------------------------------------------
  //* OUTCOME, DETAILS & HISTORY
  //*------------------------------------------------------
  async function insertOutcome(saveData, fromAssessment) {
    if (fromAssessment) {
      planId = plan.getCurrentPlanId();
    }

    const outcomeId = await planOutcomesAjax.insertPlanOutcome({
      token: $.session.Token,
      assessmentId: planId,
      outcome: saveData.outcome,
      details: saveData.details,
      history: saveData.history,
      sectionId: saveData.sectionId,
      outcomeOrder: saveData.outcomeOrder,
      status: saveData.status,
      carryOverReason: saveData.carryOverReason,
    });

    if (fromAssessment) return;

    outcomesData[outcomeId] = {};
    outcomesData[outcomeId].outcome = saveData.outcome;
    outcomesData[outcomeId].details = saveData.details;
    outcomesData[outcomeId].history = saveData.history;
    outcomesData[outcomeId].sectionId = saveData.sectionId;
    outcomesData[outcomeId].outcomeOrder = saveData.outcomeOrder;
    outcomesData[outcomeId].status = saveData.status;
    outcomesData[outcomeId].carryOverReason = saveData.carryOverReason;

    return outcomeId;
  }
  async function updateOutcome(updateData) {
    if ($.session.planUpdate) {
      await planOutcomesAjax.updatePlanOutcome({
        token: $.session.Token,
        assessmentId: planId,
        outcomeId: updateData.outcomeId,
        outcome: updateData.outcome,
        details: updateData.details,
        history: updateData.history,
        sectionId: updateData.sectionId,
        outcomeOrder: updateData.outcomeOrder,
        status: updateData.status,
        carryOverReason: updateData.carryOverReason,
      });

      outcomesData[updateData.outcomeId].outcome = updateData.outcome;
      outcomesData[updateData.outcomeId].details = updateData.details;
      outcomesData[updateData.outcomeId].history = updateData.history;
      outcomesData[updateData.outcomeId].sectionId = updateData.sectionId;
      outcomesData[updateData.outcomeId].outcomeOrder = updateData.outcomeOrder;
      outcomesData[updateData.outcomeId].status = updateData.status;
      outcomesData[updateData.outcomeId].carryOverReason = updateData.carryOverReason;
    }
  }
  async function deleteOutcome(outcomeId) {
    await planOutcomesAjax.deletePlanOutcome({
      token: $.session.Token,
      outcomeId,
    });

    if (outcomesData[outcomeId].experiences) {
      Object.values(outcomesData[outcomeId].experiences).forEach(exp => {
        Object.values(exp.responsibilities).forEach(resp => {
          delete selectedVendors[resp.responsibilityIds];
        });
      });
    }

    if (responseIdCache[outcomeId]) {
      responseIdCache[outcomeId].forEach(respId => {
        delete selectedVendors[respId];
      });
    }

    validationCheck = await planValidation.ISPValidation(planId);
    planValidation.updatedIspOutcomesSetAlerts(validationCheck);
  }
  //-- Markup ---------
  function toggleAddNewOutcomePopupDoneBtn() {
    const inputsWithErrors = document.querySelector('.newOutcomePopup .error');
    const doneBtn = document.querySelector('.newOutcomePopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showAddNewOutcomePopup(sectionId, charLimits) {
    if (!dropdownData) {
      dropdownData = planData.getDropdownData();
    }
    // This is only for adding outcome from inside assessment
    let hasInitialErros;
    let outcomeText = '';
    let detailsText = '';
    let historyText = '';
    let status = '0';
    let carryOverReason = '';

    const newOutcomePopup = POPUP.build({
      header: 'Add Outcome',
      classNames: 'newOutcomePopup',
      hideX: true,
    });

    // Assessment Area *for display only!!!
    const assessmentAreaDropdown = dropdown.build({
      // dropdownId: 'assessmentAreaDropdown',
      label: 'Assessment Area',
      style: 'secondary',
    });
    assessmentAreaDropdown.classList.add('disabled');

    // Status
    const statusDropdown = dropdown.build({
      // dropdownId: 'statusDropdown',
      label: 'Status',
      style: 'secondary',
      callback: (e, selectedOption) => {
        status = selectedOption.value;

        // if (status === '' || status === '%') {
        //   statusDropdown.classList.add('error');
        // } else {
        //   statusDropdown.classList.remove('error');
        // }

        // toggleAddNewOutcomePopupDoneBtn();
      },
    });
    // Carryover
    const carryoverInput = input.build({
      label: 'Carryover Reason',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: '',
      charLimit: charLimits.carryOverReason,
      forceCharLimit: true,
    });
    carryoverInput.classList.add('carryoverTextInput');
    carryoverInput.addEventListener('input', e => {
      carryOverReason = e.target.value;
      if (hasPreviousPlan && status === '1' && carryOverReason === '') {
        carryoverInput.classList.add('error');
      } else {
        carryoverInput.classList.remove('error');
      }

      toggleAddNewOutcomePopupDoneBtn();
    });
    // Outcome
    const outcomeTextInput = input.build({
      label: 'Outcome',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: '',
      charLimit: charLimits.description,
      forceCharLimit: true,
    });
    outcomeTextInput.classList.add('outcomeTextInput');
    outcomeTextInput.addEventListener('input', e => {
      outcomeText = e.target.value;
      if (outcomeText === '') {
        outcomeTextInput.classList.add('error');
      } else {
        outcomeTextInput.classList.remove('error');
      }

      toggleAddNewOutcomePopupDoneBtn();
    });
    // Details
    const detailsTextInput = input.build({
      label: 'Details To Know',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: '',
      charLimit: charLimits.details,
      forceCharLimit: true,
    });
    detailsTextInput.classList.add('detailsTextInput');
    detailsTextInput.addEventListener('onchange', e => {
      detailsText = e.target.value;

      if (detailsText === '') {
        detailsTextInput.classList.add('error');
        planValidation.updateOutcomeDetails(outcomeId, validationCheck, true);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      } else {
        detailsTextInput.classList.remove('error');
        planValidation.updateOutcomeDetails(outcomeId, validationCheck, false);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      }

      toggleAddNewOutcomePopupDoneBtn();
    });
    // History
    const historyTextInput = input.build({
      label: 'Important and Relevant History',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: '',
      charLimit: charLimits.history,
      forceCharLimit: true,
    });
    historyTextInput.classList.add('historyTextInput');
    historyTextInput.addEventListener('input', e => {
      historyText = e.target.value;

      if (historyText === '') {
        historyTextInput.classList.add('error');
      } else {
        historyTextInput.classList.remove('error');
      }

      toggleAddNewOutcomePopupDoneBtn();
    });

    const doneBtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');

        if (!planId) {
          planId = plan.getCurrentPlanId();
        }

        await insertOutcome(
          {
            token: $.session.Token,
            assessmentId: planId,
            outcome: outcomeText,
            details: detailsText,
            history: historyText,
            sectionId: sectionId,
            status: status,
            carryOverReason: carryOverReason,
            outcomeOrder: 0,
          },
          true,
        );

        doneBtn.classList.remove('disabled');
        POPUP.hide(newOutcomePopup);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(newOutcomePopup);
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (outcomeText === '') {
      hasInitialErros = true;
      outcomeTextInput.classList.add('error');
    }
    if (detailsText === '') {
      hasInitialErros = true;
      detailsTextInput.classList.add('error');
    }
    if (historyText === '') {
      hasInitialErros = true;
      historyTextInput.classList.add('error');
    }
    if (hasPreviousPlan && status === '1' && carryOverReason === '') {
      hasInitialErros = true;
      carryoverInput.classList.add('error');
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    newOutcomePopup.appendChild(assessmentAreaDropdown);
    newOutcomePopup.appendChild(statusDropdown);
    newOutcomePopup.appendChild(carryoverInput);
    newOutcomePopup.appendChild(outcomeTextInput);
    newOutcomePopup.appendChild(detailsTextInput);
    newOutcomePopup.appendChild(historyTextInput);
    newOutcomePopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, sectionId);
    populateStatusDropdown(statusDropdown, status);

    POPUP.show(newOutcomePopup);
    DOM.autosizeTextarea();
  }

  //*------------------------------------------------------
  //* EXPERIENCES TABLE
  //*------------------------------------------------------
  async function insertOutcomeExperience(saveData, expTableWrap) {
    const newTableData = [];
    const outcomeId = saveData.outcomeId;
    const whatHappened = saveData.whatHappened;
    const howHappened = saveData.howHappened;
    const experienceOrder = `${saveData.experienceOrder + 1}`;

    //* Insert Experience
    //*---------------------------
    const experienceId = await planOutcomesAjax.insertPlanOutcomesExperience({
      token: $.session.Token,
      outcomeId: outcomeId,
      experienceOrder: [experienceOrder],
      whatHappened: [whatHappened],
      howHappened: [howHappened],
    });
    saveData.experienceIds = experienceId;

    //* Insert Responsibilites
    //*---------------------------
    const respData = {
      token: $.session.Token,
      experienceId: experienceId,
      responsibleContact: [],
      responsibleProvider: [],
      whenHowOftenValue: [],
      whenHowOftenFrequency: [],
      whenHowOftenText: [],
    };

    Object.values(saveData.responsibilities).forEach(resp => {
      if (resp.responsibleContact === '%') {
        respData.responsibleContact.push(0);
      } else {
        respData.responsibleContact.push(parseInt(resp.responsibleContact));
      }
      if (resp.responsibleProvider === '%') {
        respData.responsibleProvider.push(0);
      } else {
        respData.responsibleProvider.push(parseInt(resp.responsibleProvider));
      }

      respData.whenHowOftenFrequency.push(parseInt(resp.whenHowOftenFrequency));
      respData.whenHowOftenValue.push(resp.whenHowOftenValue);
      respData.whenHowOftenText.push(resp.whenHowOftenText);
    });

    const respIds = await planOutcomesAjax.insertPlanOutcomeExperienceResponsibility(respData);
    respIds.forEach((id, index) => {
      saveData.responsibilities[index].responsibilityIds = id;

      const whoResponsible = getColTextForWhoResponsible(
        saveData.responsibilities[index].responsibleContact,
        saveData.responsibilities[index].responsibleProvider,
      );
      const whenHowOften = getColTextForWhenHowOften(
        saveData.responsibilities[index].whenHowOftenFrequency,
        saveData.responsibilities[index].whenHowOftenValue,
        saveData.responsibilities[index].whenHowOftenText,
      );

      const vendorID =
        saveData.responsibilities[index].responsibleContact === '%'
          ? saveData.responsibilities[index].responsibleProvider
          : saveData.responsibilities[index].responsibleContact;
      const respId = saveData.responsibilities[index].responsibilityIds;
      selectedVendors[respId] = vendorID;

      if (index === 0) {
        newTableData.push({
          // id: `resp${id}`,
          attributes: [{ key: 'data-mainrow', value: 'true' }],
          values: [whatHappened, howHappened, whoResponsible, whenHowOften],
        });
      } else {
        newTableData.push({
          // id: `resp${id}`,
          attributes: [{ key: 'data-mainrow', value: 'false' }],
          values: ['', '', whoResponsible, whenHowOften],
        });
      }
    });

    //* Cache responsIDs
    responseIdCache[outcomeId] = [...respIds];

    //* New Table
    //*---------------------------
    const tableOptions = {
      tableId: `experiencesTable${experienceId}`,
      headline: `Experiences: <span>In order to accomplish the outcome, what experiences does the person need to have?</span>`,
      columnHeadings: [
        'What needs to happen',
        'How should it happen?',
        'Who is responsible?',
        'When / How Often?',
      ],
      sortable: false,
      callback: () => showExperiencesPopup({ ...saveData }, false),
    };
    //* Build Table
    const experiencesTable = table.build(tableOptions);
    experiencesTable.classList.add(`experiencesTable`);
    experiencesTable.classList.add('sortableTable');
    //* Populate Table
    table.populate(experiencesTable, newTableData, isSortable);

    const experiencesDummyTable = document.querySelector(`#experiencesTableDummy${outcomeId}`);

    // Make tables sortable
    Sortable.create(experiencesDummyTable, {
      handle: '.experiencesTable', // Set the handle to the table class
      draggable: '.experiencesTable', // Set the draggable elements to the table class
      onEnd: async sortData => {
        const experienceId = sortData.item.id.replace('experiencesTable', '');
        await planOutcomesAjax.updatePlanOutcomesExperienceOrder({
          token: $.session.Token,
          outcomeId: parseInt(outcomeId),
          experienceId: parseInt(experienceId),
          newPos: parseInt(sortData.newDraggableIndex),
          oldPos: parseInt(sortData.oldDraggableIndex),
        });
      },
    });

    //* Append Table
    experiencesDummyTable.appendChild(experiencesTable);
    const addExpTableBtn = expTableWrap.querySelector('.btn');
    expTableWrap.insertBefore(experiencesTable, addExpTableBtn);
  }
  async function updateOutcomeExperience(updateData, respPartysToDelete) {
    const newTableData = [];
    const outcomeId = updateData.outcomeId;
    const experienceIds = updateData.experienceIds;
    const experienceOrder = updateData.experienceOrder;
    const howHappened = updateData.howHappened;
    const whatHappened = updateData.whatHappened;

    //* Update Experience
    //*--------------------------------------------
    await planOutcomesAjax.updatePlanOutcomesExperience({
      token: $.session.Token,
      outcomeId,
      experienceIds: [experienceIds],
      experienceOrder: [experienceOrder],
      howHappened: [howHappened],
      whatHappened: [whatHappened],
    });

    //* Update/Insert/Delete Responsibilites
    //*--------------------------------------------
    const respData = {
      responsibilityIds: [],
      responsibleContact: [],
      responsibleProvider: [],
      whenHowOftenValue: [],
      whenHowOftenFrequency: [],
      whenHowOftenText: [],
    };

    Object.entries(updateData.responsibilities).map(async ([key, resp]) => {
      const isRespPartyForDelete = respPartysToDelete.includes(key);
      if (isRespPartyForDelete) {
        delete updateData.responsibilities[key];

        if (resp.responsibilityIds) {
          await planOutcomesAjax.deletePlanOutcomeExperienceResponsibility({
            token: $.session.Token,
            responsibilityId: parseInt(resp.responsibilityIds),
          });

          const respId = resp.responsibilityIds;
          delete selectedVendors[respId];
        }
      }
    });
    Object.entries(updateData.responsibilities).map(async ([key, resp], index) => {
      const responsibleContact =
        resp.responsibleContact === '%' ? 0 : parseInt(resp.responsibleContact);
      const responsibleProvider =
        resp.responsibleProvider === '%' ? 0 : parseInt(resp.responsibleProvider);
      const whenHowOftenFrequency = parseInt(resp.whenHowOftenFrequency);
      const whenHowOftenValue = resp.whenHowOftenValue;
      const whenHowOftenText = resp.whenHowOftenText;

      //* push to new table data
      const whoResponsible = getColTextForWhoResponsible(
        `${responsibleContact}`,
        `${responsibleProvider}`,
      );
      const whenHowOften = getColTextForWhenHowOften(
        `${whenHowOftenFrequency}`,
        whenHowOftenValue,
        whenHowOftenText,
      );

      const vendorID =
        resp.responsibleContact === '%' ? resp.responsibleProvider : resp.responsibleContact;
      const respId = resp.responsibilityIds;
      selectedVendors[respId] = vendorID;

      if (index === 0) {
        newTableData.push({
          // id: `resp${id}`,
          attributes: [{ key: 'data-mainrow', value: 'true' }],
          values: [whatHappened, howHappened, whoResponsible, whenHowOften],
        });
      } else {
        newTableData.push({
          attributes: [{ key: 'data-mainrow', value: 'false' }],
          values: ['', '', whoResponsible, whenHowOften],
        });
      }
      //* end push

      // set respData *retrieve data
      if (resp.responsibilityIds) {
        const responsibilityIds = parseInt(resp.responsibilityIds);
        respData.responsibilityIds.push(responsibilityIds);
        respData.responsibleContact.push(responsibleContact);
        respData.responsibleProvider.push(responsibleProvider);
        respData.whenHowOftenFrequency.push(whenHowOftenFrequency);
        respData.whenHowOftenValue.push(whenHowOftenValue);
        respData.whenHowOftenText.push(whenHowOftenText);
      } else {
        const respIds = await planOutcomesAjax.insertPlanOutcomeExperienceResponsibility({
          token: $.session.Token,
          experienceId: experienceIds,
          responsibleContact: [responsibleContact],
          responsibleProvider: [responsibleProvider],
          whenHowOftenValue: [whenHowOftenValue],
          whenHowOftenFrequency: [whenHowOftenFrequency],
          whenHowOftenText: [whenHowOftenText],
        });
        updateData.responsibilities[key].responsibilityIds = respIds[0];
      }
    });

    //* Cache responsIDs
    responseIdCache[outcomeId] = [...respData.responsibilityIds];

    await planOutcomesAjax.updatePlanOutcomeExperienceResponsibility(respData);

    //* Build New Table
    //*---------------------------
    const tableOptions = {
      tableId: `experiencesTable${experienceIds}`,
      headline: `Experiences: <span>In order to accomplish the outcome, what experiences does the person need to have?</span>`,
      columnHeadings: [
        'What needs to happen',
        'How should it happen?',
        'Who is responsible?',
        'When / How Often?',
      ],
      sortable: false,
      callback: () => showExperiencesPopup({ ...updateData }, false),
    };
    //* Build Table
    const newExperiencesTable = table.build(tableOptions);
    newExperiencesTable.classList.add(`experiencesTable`);
    newExperiencesTable.classList.add('sortableTable');
    //* Populate Table
    table.populate(newExperiencesTable, newTableData, isSortable);
    //* Replace Old Table w/New Table
    const oldExperiencesTable = document.getElementById(`experiencesTable${experienceIds}`);
    oldExperiencesTable.parentNode.replaceChild(newExperiencesTable, oldExperiencesTable);
  }
  async function deleteOutcomeExperience(outcomeId, experienceId) {
    await planOutcomesAjax.deletePlanOutcomeExperience({
      token: $.session.Token,
      outcomeId: outcomeId,
      experienceId: experienceId,
    });

    if (outcomesData[outcomeId].experiences) {
      Object.values(outcomesData[outcomeId].experiences).forEach(exp => {
        Object.values(exp.responsibilities).forEach(resp => {
          delete selectedVendors[resp.responsibilityIds];
        });
      });
    }

    const outcomeDiv = document.querySelector(`.outcome${outcomeId}`);
    const expTableWrap = outcomeDiv.querySelector(`#experiencesTableDummy${outcomeId}`);
    const expTable = expTableWrap.querySelector(`#experiencesTable${experienceId}`);

    expTableWrap.removeChild(expTable);
    
     // grabs the review alert for this specific outcome
     const alertDiv = document.getElementById(`experienceAlert${outcomeId}`);

     // retrieves new data from database
     validationCheck = await planValidation.ISPValidation(planId);

     // displays or removes alert for button depending on validationCheck
     planValidation.experiencesValidationCheck(validationCheck, outcomeId, alertDiv);

     // displays or removes alerts for tabs in the navs depending on validationCheck
     planValidation.updatedIspOutcomesSetAlerts(validationCheck);
  }
  //-- Helpers --------
  function getColTextForWhenHowOften(freq, value, text) {
    let whenHowOften = '';
    if (freq !== '3') {
      const frequency = getWhenHowOFtenFrequencyById(freq);
      whenHowOften = `${value} ${frequency}`;
    } else {
      whenHowOften = `${value} ${text}`;
    }

    return whenHowOften;
  }
  function getColTextForWhoResponsible(responsibleContact, responsibleProvider) {
    if (responsibleProvider !== '%' && responsibleProvider !== '0') {
      const filteredVendor = dropdownData.serviceVendors.filter(
        dd => dd.vendorId === responsibleProvider,
      );
      return filteredVendor.length > 0 ? filteredVendor[0].vendorName : '';
    } else {
      if (dropdownData.relationships) {
        const filteredRelationship = dropdownData.relationships.filter(
          dd => dd.contactId === responsibleContact,
        );
        return filteredRelationship.length > 0
          ? `${filteredRelationship[0].lastName}, ${filteredRelationship[0].firstName}`
          : '';
      }

      return '';
    }
  }
  //-- Markup ---------
  function toggleExperiencesPopupDoneBtn() {
    const inputsWithErrors = document.querySelector('.experiencesPopup .error');
    const doneBtn = document.querySelector('.experiencesPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showExperiencesPopup(data, isNew) {
    let hasInitialErros;
    const saveUpdateData = {
      outcomeId: data.outcomeId,
      experienceOrder: data.experienceOrder,
      howHappened: data.howHappened ? data.howHappened : '',
      whatHappened: data.whatHappened ? data.whatHappened : '',
      responsibilities: {},
    };
    const respPartysToDelete = [];

    const experiencesPopup = POPUP.build({
      header: isNew ? 'Add Experience' : 'Edit Experience',
      classNames: 'experiencesPopup',
      hideX: true,
    });

    if (!isNew) {
      saveUpdateData.experienceIds = data.experienceIds;
      saveUpdateData.responsibilities = { ...data.responsibilities };
      experiencesPopup.classList.add('update');
    }

    //*--------------------------------
    //* MAIN
    //*--------------------------------
    const mainWrap = document.createElement('div');
    mainWrap.classList.add('experiencesPopup__main');
    // What Needs To Happen
    const whatHappenedInput = input.build({
      label: 'What needs to happen',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.whatHappened,
      charLimit: charLimits.whatNeedsToHappen,
      forceCharLimit: true,
    });
    whatHappenedInput.classList.add('whatHappenedInput');
    whatHappenedInput.addEventListener('input', e => {
      saveUpdateData.whatHappened = e.target.value;
      if (saveUpdateData.whatHappened === '') {
        whatHappenedInput.classList.add('error');
      } else {
        whatHappenedInput.classList.remove('error');
      }

      toggleExperiencesPopupDoneBtn();
    });
    // How Should It Happen
    const howHappenedInput = input.build({
      label: 'How should it happen?',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.howHappened,
      charLimit: charLimits.howItShouldHappen,
      forceCharLimit: true,
    });
    howHappenedInput.classList.add('howHappenedInput');
    howHappenedInput.addEventListener('input', e => {
      saveUpdateData.howHappened = e.target.value;
      if (saveUpdateData.howHappened === '') {
        howHappenedInput.classList.add('error');
      } else {
        howHappenedInput.classList.remove('error');
      }

      toggleExperiencesPopupDoneBtn();
    });

    //*--------------------------------
    //* RESPONSIBLE PARTY
    //*--------------------------------
    function buildResponsiblePartyInputs(saveUpdateDataRef, dataRefKey) {
      const inputsWrap = document.createElement('div');

      if (saveUpdateDataRef.responsibilityIds) {
        inputsWrap.id = `resp${saveUpdateDataRef.responsibilityIds}`;
      }

      //* BUILD INPUTS
      //*--------------------------------
      // Who Is Responsible
      const whoReponsibleWrap = document.createElement('div');
      const wrapHeading = document.createElement('div');
      whoReponsibleWrap.classList.add('whoResponsibleWrap');
      wrapHeading.innerHTML =
        '<h2>Who Is Responsible?</h2><p>Choose either a Responsible Person or Provider.</p>';

      const responsiblePersonDropdown = dropdown.build({
        dropdownId: 'responsiblePersonDropdown',
        label: 'Responsible Person',
        style: 'secondary',
        callback: (e, selectedOption) => {
          saveUpdateDataRef.responsibleContact = selectedOption.value;

          if (saveUpdateDataRef.responsibleContact !== '%') {
            whoReponsibleWrap.classList.remove('error');
            responsiblePersonDropdown.classList.remove('error');
            // if not empty clear error and value from other dropdown
            responsibleProviderDropdown.classList.remove('error');
            const respDropdown = responsibleProviderDropdown.querySelector('select');
            respDropdown.value = '%';
            saveUpdateDataRef.responsibleProvider = '%';
          } else {
            // if emtpy check if other dropdown is emtpy
            if (saveUpdateDataRef.responsibleProvider === '%') {
              responsiblePersonDropdown.classList.add('error');
              responsibleProviderDropdown.classList.add('error');
              whoReponsibleWrap.classList.add('error');
            }
          }

          toggleExperiencesPopupDoneBtn();
        },
      });
      const responsibleProviderDropdown = dropdown.build({
        dropdownId: 'responsibleProviderDropdown',
        label: 'Responsible Provider',
        style: 'secondary',
        callback: (e, selectedOption) => {
          saveUpdateDataRef.responsibleProvider = selectedOption.value;

          if (saveUpdateDataRef.responsibleProvider !== '%') {
            whoReponsibleWrap.classList.remove('error');
            responsibleProviderDropdown.classList.remove('error');
            // if not empty clear error and value from other dropdown
            responsiblePersonDropdown.classList.remove('error');
            const respDropdown = responsiblePersonDropdown.querySelector('select');
            respDropdown.value = '%';
            saveUpdateDataRef.responsibleContact = '%';
          } else {
            // if emtpy check if other dropdown is emtpy
            if (saveUpdateDataRef.responsibleContact === '%') {
              responsibleProviderDropdown.classList.add('error');
              responsiblePersonDropdown.classList.add('error');
              whoReponsibleWrap.classList.add('error');
            }
          }

          toggleExperiencesPopupDoneBtn();
        },
      });
      whoReponsibleWrap.appendChild(wrapHeading);
      whoReponsibleWrap.appendChild(responsiblePersonDropdown);
      whoReponsibleWrap.appendChild(responsibleProviderDropdown);
      // When/How OFten
      const whenHowOftenValueInput = input.build({
        type: 'textarea',
        label: 'When/How Often',
        style: 'secondary',
        classNames: 'autosize',
        value: saveUpdateDataRef.whenHowOftenValue,
        charLimit: charLimits.whenHowOften,
        forceCharLimit: true,
      });
      whenHowOftenValueInput.classList.add('whenHowOftenValueInput');
      whenHowOftenValueInput.addEventListener('input', e => {
        saveUpdateDataRef.whenHowOftenValue = e.target.value;

        if (saveUpdateDataRef.whenHowOftenValue === '') {
          whenHowOftenValueInput.classList.add('error');
        } else {
          whenHowOftenValueInput.classList.remove('error');
        }

        toggleExperiencesPopupDoneBtn();
      });
      // When/How Often Freq
      const whenHowOftenFrequencyDropdown = dropdown.build({
        dropdownId: 'whenHowOFtenFrequencyExperiences',
        label: 'When/How Often Frequency',
        style: 'secondary',
        callback: (e, selectedOption) => {
          saveUpdateDataRef.whenHowOftenFrequency = selectedOption.value;

          const whenHowOftenTextInputField =
            whenHowOftenTextInput.querySelector('.input-field__input');

          if (
            saveUpdateDataRef.whenHowOftenFrequency === '' ||
            saveUpdateDataRef.whenHowOftenFrequency === '%'
          ) {
            whenHowOftenFrequencyDropdown.classList.add('error');
          } else {
            whenHowOftenFrequencyDropdown.classList.remove('error');
          }

          if (saveUpdateDataRef.whenHowOftenFrequency === '3') {
            whenHowOftenTextInput.classList.remove('disabled');
            whenHowOftenTextInputField.removeAttribute('tabindex');

            if (saveUpdateDataRef.whenHowOftenText === '') {
              whenHowOftenTextInput.classList.add('error');
            } else {
              whenHowOftenTextInput.classList.remove('error');
            }
          } else {
            whenHowOftenTextInput.classList.remove('error');
            whenHowOftenTextInput.classList.add('disabled');
            whenHowOftenTextInputField.setAttribute('tabindex', '-1');
            saveUpdateDataRef.whenHowOftenText = '';
            const textInput = whenHowOftenTextInput.querySelector('.input-field__input');
            textInput.value = '';
          }

          toggleExperiencesPopupDoneBtn();
        },
      });
      // When/How Often Other
      const whenHowOftenTextInput = input.build({
        label: 'When/How Often Other',
        type: 'textarea',
        style: 'secondary',
        classNames: 'autosize',
        value: saveUpdateDataRef.whenHowOftenText,
        charLimit: charLimits.whenHowOftenOther,
        forceCharLimit: true,
      });
      whenHowOftenTextInput.classList.add('whenHowOftenTextInput');
      whenHowOftenTextInput.addEventListener('input', e => {
        saveUpdateDataRef.whenHowOftenText = e.target.value;

        if (saveUpdateDataRef.whenHowOftenFrequency === '3') {
          if (saveUpdateDataRef.whenHowOftenText === '') {
            whenHowOftenTextInput.classList.add('error');
          } else {
            whenHowOftenTextInput.classList.remove('error');
          }
        }

        toggleExperiencesPopupDoneBtn();
      });
      if (saveUpdateDataRef.whenHowOftenFrequency !== '3') {
        const whenHowOftenTextInputField =
          whenHowOftenTextInput.querySelector('.input-field__input');
        whenHowOftenTextInput.classList.add('disabled');
        whenHowOftenTextInputField.setAttribute('tabindex', '-1');
      }

      //* DELETE RESP PARTY
      //*--------------------------------
      const deleteBtn = button.build({
        text: 'Delete Above Party',
        style: 'danger',
        type: 'contained',
        callback: () => {
          if (isNew) {
            delete saveUpdateData.responsibilities[dataRefKey];
          } else {
            respPartysToDelete.push(dataRefKey);
          }

          respPartyWrap.removeChild(inputsWrap);
          toggleExperiencesPopupDoneBtn();
        },
      });

      //* INIT REQUIRED FIELDS
      //*--------------------------------
      if (
        saveUpdateDataRef.responsibleContact === '%' &&
        saveUpdateDataRef.responsibleProvider === '%'
      ) {
        whoReponsibleWrap.classList.add('error');
        responsiblePersonDropdown.classList.add('error');
        responsibleProviderDropdown.classList.add('error');
        hasInitialErros = true;
      }
      if (saveUpdateDataRef.whenHowOftenValue === '') {
        hasInitialErros = true;
        whenHowOftenValueInput.classList.add('error');
      }
      if (
        saveUpdateDataRef.whenHowOftenFrequency === '' ||
        saveUpdateDataRef.whenHowOftenFrequency === '%'
      ) {
        whenHowOftenFrequencyDropdown.classList.add('error');
        hasInitialErros = true;
      }
      if (saveUpdateDataRef.whenHowOftenFrequency === '3') {
        if (saveUpdateDataRef.whenHowOftenText === '') {
          whenHowOftenTextInput.classList.add('error');
          hasInitialErros = true;
        }
      }

      populateExperiencesHowOftenDropdown(
        whenHowOftenFrequencyDropdown,
        saveUpdateDataRef.whenHowOftenFrequency,
      );
      populateResponsibleProviderDropdown(
        responsibleProviderDropdown,
        saveUpdateDataRef.responsibleProvider,
      );
      planData.populateRelationshipDropdown(
        responsiblePersonDropdown,
        saveUpdateDataRef.responsibleContact,
      );

      //* ASSEMBLE
      //*--------------------------------
      inputsWrap.appendChild(whoReponsibleWrap);
      inputsWrap.appendChild(whenHowOftenValueInput);
      inputsWrap.appendChild(whenHowOftenFrequencyDropdown);
      inputsWrap.appendChild(whenHowOftenTextInput);
      inputsWrap.appendChild(deleteBtn);

      return inputsWrap;
    }

    // initial load
    const respPartyWrap = document.createElement('div');
    respPartyWrap.classList.add('experiencesPopup__respParty');
    if (!isNew) {
      // loop out and build them
      Object.keys(saveUpdateData.responsibilities).forEach(key => {
        // build & append it
        const respParty = buildResponsiblePartyInputs(saveUpdateData.responsibilities[key], key);
        respPartyWrap.appendChild(respParty);
      });
    } else {
      // setup default resp party
      // init data
      saveUpdateData.responsibilities[0] = {
        responsibleContact: '%',
        responsibleProvider: '%',
        whenHowOftenValue: '',
        whenHowOftenFrequency: '',
        whenHowOftenText: '',
      };
      // build & append it
      const respParty = buildResponsiblePartyInputs(saveUpdateData.responsibilities[0], 0);
      respPartyWrap.appendChild(respParty);
    }

    //*--------------------------------
    //* ACTION BUTTONS
    //*--------------------------------
    const addRespPartyBtn = button.build({
      text: 'Add Responsible Party',
      style: 'secondary',
      type: 'contained',
      classNames: 'addRespPartyBtn',
      callback: () => {
        // init data
        const respLength = Object.keys(saveUpdateData.responsibilities).length;
        saveUpdateData.responsibilities[respLength] = {
          responsibleContact: '%',
          responsibleProvider: '%',
          whenHowOftenValue: '',
          whenHowOftenFrequency: '',
          whenHowOftenText: '',
        };
        // build & append it
        const respParty = buildResponsiblePartyInputs(
          saveUpdateData.responsibilities[respLength],
          respLength,
        );
        respPartyWrap.appendChild(respParty);
        toggleExperiencesPopupDoneBtn();
      },
    });
    const doneBtn = button.build({
      text: isNew ? 'Save Experience' : 'Update Experience',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async() => {
        doneBtn.classList.add('disabled');

        if (isNew) {
          const outcome = document.querySelector(`.outcome${saveUpdateData.outcomeId}`);
          const expTableWrap = document.querySelector(
            `#experiencesTableDummy${saveUpdateData.outcomeId}`,
          );
          const expTables = [...expTableWrap.querySelectorAll('.table')];
          saveUpdateData.experienceOrder = expTables.length;
          await insertOutcomeExperience({ ...saveUpdateData }, expTableWrap);
        } else {
          await updateOutcomeExperience({ ...saveUpdateData }, respPartysToDelete);
        }

        doneBtn.classList.remove('disabled');
        POPUP.hide(experiencesPopup);

        // grabs the experience alert for this specific outcome
        const alertDiv = document.getElementById(`experienceAlert${saveUpdateData.outcomeId}`);

        // checks for missing data
        validationCheck = await planValidation.ISPValidation(planId);

        // displays or removes button alert depending on validationCheck
        planValidation.experiencesValidationCheck(validationCheck, saveUpdateData.outcomeId, alertDiv);

        // displays or removes alerts for tabs in the navs depending on validationCheck
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(experiencesPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete Experience',
      style: 'danger',
      type: 'contained',
      callback: async () => {
        const message = 'Do you want to delete this Experience?';
        ISP.showDeleteWarning(experiencesPopup, message, () => {
          deleteOutcomeExperience(saveUpdateData.outcomeId, saveUpdateData.experienceIds);
        });
      },
    });
    // wrap done, cancel & delete btns
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(addRespPartyBtn);
    const mainBtns = document.createElement('div');
    mainBtns.classList.add('mainBtns');
    mainBtns.appendChild(doneBtn);
    if (!isNew) {
      mainBtns.appendChild(deleteBtn);
    }
    mainBtns.appendChild(cancelBtn);
    btnWrap.appendChild(mainBtns);

    //*--------------------------------
    //* INIT REQUIRED FIELDS
    //*--------------------------------
    if (saveUpdateData.whatHappened === '') {
      hasInitialErros = true;
      whatHappenedInput.classList.add('error');
    }
    if (saveUpdateData.howHappened === '') {
      hasInitialErros = true;
      howHappenedInput.classList.add('error');
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }

    //*--------------------------------
    //* ASSEMBLE
    //*--------------------------------
    mainWrap.appendChild(whatHappenedInput);
    mainWrap.appendChild(howHappenedInput);

    experiencesPopup.appendChild(mainWrap);
    experiencesPopup.appendChild(respPartyWrap);
    experiencesPopup.appendChild(btnWrap);

    if (isReadOnly) {
      whatHappenedInput.classList.add('disabled');
      howHappenedInput.classList.add('disabled');
      whoReponsibleInput.classList.add('disabled');
      whenHowOftenValueInput.classList.add('disabled');
      whenHowOftenFrequencyDropdown.classList.add('disabled');
      whenHowOftenTextInput.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    POPUP.show(experiencesPopup);
    DOM.autosizeTextarea();
  }
  function addExperienceTable(outcomeId) {
    showExperiencesPopup({ outcomeId }, true);
  }
  function buildExperiencesTables(outcomeId) {
    const experiencesDiv = document.createElement('div');
    experiencesDiv.classList.add('experiencesTablesWrap');

    const addExpTableBtn = button.build({
      text: 'Add Experience',
      style: 'secondary',
      type: 'contained',
      callback: () => addExperienceTable(outcomeId),
    });
    if (isReadOnly) {
      addExpTableBtn.classList.add('disabled');
    }

    // adding dummy top table so col headings always show
    experiencesDummyTable = table.build({
      tableId: `experiencesTableDummy${outcomeId}`,
      headline: `Experiences: <span>In order to accomplish the outcome, what experiences does the person need to have?</span>`,
      columnHeadings: [
        'What needs to happen',
        'How should it happen?',
        'Who is responsible?',
        'When / How Often?',
      ],
      sortable: isSortable,
    });
    experiencesDummyTable.classList.add(`experiencesTable`);
    experiencesDiv.appendChild(experiencesDummyTable);
    // end dummy table

    if (outcomesData[outcomeId] && outcomesData[outcomeId].experiences) {
      Object.values(outcomesData[outcomeId].experiences)
        .sort((a, b) => {
          return a.experienceOrder < b.experienceOrder
            ? -1
            : a.experienceOrder > b.experienceOrder
            ? 1
            : 0;
        })
        .map((td, index) => {
          const tableData = [];
          const whatHappened = td.whatHappened;
          const howHappened = td.howHappened;
          const respObj = {};

          // checking for responsibilities
          Object.values(td.responsibilities).forEach((resp, index) => {
            const respId = resp.responsibilityIds;
            const responsibleContact = resp.responsibleContact;
            const responsibleProvider = resp.responsibleProvider;
            const whenHowOftenValue = resp.whenHowOftenValue;
            const whenHowOftenFrequency = resp.whenHowOftenFrequency;
            const whenHowOftenText = resp.whenHowOftenText;

            respObj[index] = {
              responsibilityIds: respId,
              responsibleContact: responsibleContact,
              responsibleProvider: responsibleProvider,
              whenHowOftenValue: whenHowOftenValue,
              whenHowOftenFrequency: whenHowOftenFrequency,
              whenHowOftenText: whenHowOftenText,
            };

            const vendorID = responsibleContact === '%' ? responsibleProvider : responsibleContact;
            selectedVendors[respId] = vendorID;

            const whoResponsible = getColTextForWhoResponsible(
              responsibleContact,
              responsibleProvider,
            );
            const whenHowOften = getColTextForWhenHowOften(
              whenHowOftenFrequency,
              whenHowOftenValue,
              whenHowOftenText,
            );

            if (index === 0) {
              tableData.push({
                // id: `resp${respId}`,
                attributes: [{ key: 'data-mainrow', value: 'true' }],
                values: [whatHappened, howHappened, whoResponsible, whenHowOften],
              });
            } else {
              tableData.push({
                // id: `resp${respId}`,
                attributes: [{ key: 'data-mainrow', value: 'false' }],
                values: ['', '', whoResponsible, whenHowOften],
              });
            }
          });

          //*--------------------------------
          //* Table
          //*--------------------------------
          const tableOptions = {
            tableId: `experiencesTable${td.experienceIds}`,
            headline: `Experiences: <span>In order to accomplish the outcome, what experiences does the person need to have?</span>`,
            columnHeadings: [
              '<div class="draghandle"></div>',
              'What needs to happen',
              'How should it happen?',
              'Who is responsible?',
              'When / How Often?',
            ],
            sortable: false,
            callback: () =>
              showExperiencesPopup(
                {
                  outcomeId: td.outcomeId,
                  experienceIds: td.experienceIds,
                  experienceOrder: td.experienceOrder,
                  whatHappened: whatHappened,
                  howHappened: howHappened,
                  responsibilities: {
                    ...respObj,
                  },
                },
                false,
              ),
          };

          validationCheck.selectedProviders.push(respObj[0].responsibleProvider);

          const experiencesTable = table.build(tableOptions);
          experiencesTable.classList.add('experiencesTable');
          experiencesTable.classList.add('sortableTable');

          // Populate Table
          table.populate(experiencesTable, tableData, isSortable);

          // Append experiencesTable to experiencesDummyTable
          experiencesDummyTable.appendChild(experiencesTable);

          // Make tables sortable
          Sortable.create(experiencesDummyTable, {
            handle: '.experiencesTable', // Set the handle to the table class
            draggable: '.experiencesTable', // Set the draggable elements to the table class
            onEnd: async sortData => {
              const experienceId = sortData.item.id.replace('experiencesTable', '');
              await planOutcomesAjax.updatePlanOutcomesExperienceOrder({
                token: $.session.Token,
                outcomeId: parseInt(outcomeId),
                experienceId: parseInt(experienceId),
                newPos: parseInt(sortData.newDraggableIndex) + 1,
                oldPos: parseInt(sortData.oldDraggableIndex) + 1,
              });
            },
          });

          experiencesDummyTable.appendChild(experiencesTable);
        });
    }

    // create wrapper div for button and alert
    const experienceBtnAlertDiv = document.createElement('div');
    experienceBtnAlertDiv.classList.add('btnAlertContainer');

    // create div for the alert
    const experienceAlertDiv = document.createElement('div');
    experienceAlertDiv.innerHTML = `${icons.error}`;
    experienceAlertDiv.id = `experienceAlert${outcomeId}`;
    experienceAlertDiv.classList.add(`experiencesAlert`);

    // creates and shows a tip when hovering over the visible alert div
    planValidation.createTooltip('At least one experience must be entered for each outcome', experienceAlertDiv);

    experienceBtnAlertDiv.appendChild(addExpTableBtn);
    experienceBtnAlertDiv.appendChild(experienceAlertDiv);
    experiencesDiv.appendChild(experienceBtnAlertDiv);
   
    // checks if alert should be visible
    planValidation.experiencesValidationCheck(validationCheck, outcomeId, experienceAlertDiv); 

    // checks if providers are in paid supports providers
    planValidation.checkExperienceProviders(validationCheck);

    return experiencesDiv;
  }

  //*------------------------------------------------------
  //* REVIEWS TABLE
  //*------------------------------------------------------
  async function insertOutcomeReview(saveData) {
    const outcomeId = saveData.outcomeId;
    const whatWillHappen = saveData.whatWillHappen;
    const whenToCheckIn = saveData.whenToCheckIn;
    const whoReview = saveData.whoReview;
    const reviewOrder = `${saveData.reviewOrder}`;
    const contactId = parseInt(saveData.contactId);

    const reviewId = await planOutcomesAjax.insertPlanOutcomesReview({
      token: $.session.Token,
      outcomeId: outcomeId,
      whatWillHappen: [whatWillHappen],
      whenToCheckIn: [whenToCheckIn],
      whoReview: [whoReview],
      reviewOrder: [reviewOrder],
      contactId: [contactId],
    });

    const tableID = `reviewsTable${outcomeId}`;
    const rowId = `reviews${reviewId}`;

    table.addRows(
      tableID,
      [
        {
          id: rowId,
          values: [whatWillHappen, whoReview, whenToCheckIn],
          onClick: () => {
            showReviewsPopup(
              {
                whatWillHappen,
                whenToCheckIn,
                whoReview,
                reviewOrder,
                reviewIds: reviewId,
                outcomeId,
                contactId,
              },
              false,
            );
          },
        },
      ],
      isSortable,
    );
  }
  async function updateOutcomeReview(updateData) {
    const outcomeId = updateData.outcomeId;
    const reviewIds = updateData.reviewIds;
    const whatWillHappen = updateData.whatWillHappen;
    const whenToCheckIn = updateData.whenToCheckIn;
    const whoReview = updateData.whoReview;
    //const reviewOrder = updateData.reviewOrder;
    const contactId = updateData.contactId;

    await planOutcomesAjax.updatePlanOutcomesReview({
      token: $.session.Token,
      outcomeId,
      reviewIds: [reviewIds],
      whatWillHappen: [whatWillHappen],
      whenToCheckIn: [whenToCheckIn],
      whoReview: [whoReview],
      contactId: [contactId],
      // reviewOrder: [reviewOrder],
    });

    const rowId = `reviews${reviewIds}`;

    table.updateRows(
      `reviewsTable${outcomeId}`,
      [
        {
          id: rowId,
          values: [whatWillHappen, whoReview, whenToCheckIn],
          onClick: () => {
            showReviewsPopup(
              {
                outcomeId,
                reviewIds,
                whatWillHappen,
                whenToCheckIn,
                whoReview,
                contactId,
                //reviewOrder,
              },
              false,
            );
          },
        },
      ],
      isSortable,
    );
  }
  async function deleteOutcomeReview(outcomeId, reviewId) {
    await planOutcomesAjax.deletePlanOutcomeReview({
      token: $.session.Token,
      outcomeId: outcomeId,
      reviewId: reviewId,
    });

    table.deleteRow(`reviews${reviewId}`);

    // grabs the review alert for this specific outcome
    const alertDiv = document.getElementById(`reviewsAlert${outcomeId}`);

    // checks for missing data
    validationCheck = await planValidation.ISPValidation(planId);

    // displays or removes button alert depending on validationCheck
    planValidation.reviewsValidationCheck(validationCheck, outcomeId, alertDiv);

    // displays or removes alerts for tabs in the navs depending on validationCheck
    planValidation.updatedIspOutcomesSetAlerts(validationCheck);
  }
  //-- Markup ---------
  function toggleReviewsPopupDoneBtn() {
    const inputsWithErrors = document.querySelector('.reviewsPopup .error');
    const doneBtn = document.querySelector('.reviewsPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showReviewsPopup(popupData, isNew) {
    let hasInitialErros;

    const saveUpdateData = {
      outcomeId: popupData.outcomeId,
      whatWillHappen: popupData.whatWillHappen ? popupData.whatWillHappen : '',
      whenToCheckIn: popupData.whenToCheckIn ? popupData.whenToCheckIn : '',
      whoReview: popupData.whoReview ? popupData.whoReview : '',
      reviewOrder: popupData.reviewOrder ? popupData.reviewOrder : '',
      contactId: popupData.contactId ? popupData.contactId : '',
    };

    if (!isNew) {
      saveUpdateData.reviewIds = popupData.reviewIds;
    }

    const reviewsPopup = POPUP.build({
      header: isNew ? 'Add Review' : 'Edit Review',
      classNames: 'reviewsPopup',
      hideX: true,
    });

    // What Will Happen
    const whatWillHappenInput = input.build({
      label: `What will progress look like?`,
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.whatWillHappen,
      charLimit: charLimits.whatWillHappen,
      forceCharLimit: true,
    });
    whatWillHappenInput.classList.add('whatWillHappen');
    whatWillHappenInput.addEventListener('input', e => {
      saveUpdateData.whatWillHappen = e.target.value;

      if (saveUpdateData.whatWillHappen === '') {
        whatWillHappenInput.classList.add('error');
      } else {
        whatWillHappenInput.classList.remove('error');
      }

      toggleReviewsPopupDoneBtn();
    });
    // Who Review
    const whoReviewDropdown = dropdown.build({
      dropdownId: '',
      label: 'Who?',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.contactId = selectedOption.value;
        saveUpdateData.whoReview = selectedOption.text;

        const isCaseManager = getWhoTypeById(saveUpdateData.contactId);
        const whenToCheckInInputField = whenToCheckInInput.querySelector('.input-field__input');
        if (isCaseManager) {
          whenToCheckInInputField.value = 'Monthly';
          saveUpdateData.whenToCheckIn = 'Monthly';
        } else {
          whenToCheckInInputField.value = '';
          saveUpdateData.whenToCheckIn = '';
        }

        if (saveUpdateData.whoReview === '' || saveUpdateData.whoReview === '%') {
          whoReviewDropdown.classList.add('error');
        } else {
          whoReviewDropdown.classList.remove('error');
        }

        toggleReviewsPopupDoneBtn();
      },
    });
    // When To Check In
    const whenToCheckInInput = input.build({
      label: 'When To Check In?',
      type: 'text',
      style: 'secondary',
      value: saveUpdateData.whenToCheckIn,
      charLimit: charLimits.whenToCheckIn,
      forceCharLimit: true,
      attributes: [{ key: 'tabindex', value: '-1' }],
    });
    whenToCheckInInput.classList.add('disabled');

    const doneBtn = button.build({
      text: isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async() => {
        doneBtn.classList.add('disabled');
        if (isNew) {
          const tableId = `reviewsTable${saveUpdateData.outcomeId}`;
          const rowOrder = table.getRowCount(tableId) + 1;
          saveUpdateData.reviewOrder = rowOrder;
          insertOutcomeReview(saveUpdateData);
        } else {
          updateOutcomeReview(saveUpdateData);
        }

        doneBtn.classList.remove('disabled');
        POPUP.hide(reviewsPopup);

    // grabs the review alert for this specific outcome
    const alertDiv = document.getElementById(`reviewsAlert${saveUpdateData.outcomeId}`);

    // checks for missing data
    validationCheck = await planValidation.ISPValidation(planId);

    // displays or removes button alert depending on validationCheck
    planValidation.reviewsValidationCheck(validationCheck, saveUpdateData.outcomeId, alertDiv);

    // displays or removes alerts for tabs in the navs depending on validationCheck
    planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(reviewsPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: () => {
        const message = 'Do you want to delete this Review?';
        ISP.showDeleteWarning(reviewsPopup, message, () => {
          deleteOutcomeReview(saveUpdateData.outcomeId, saveUpdateData.reviewIds);
        });
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (saveUpdateData.whatWillHappen === '') {
      whatWillHappenInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.whoReview === '' || saveUpdateData.whoReview === '%') {
      whoReviewDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    if (isReadOnly) {
      whatWillHappenInput.classList.add('disabled');
      whoReviewDropdown.classList.add('disabled');
      whenToCheckInInput.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    reviewsPopup.appendChild(whatWillHappenInput);
    reviewsPopup.appendChild(whoReviewDropdown);
    reviewsPopup.appendChild(whenToCheckInInput);
    reviewsPopup.appendChild(btnWrap);

    //populateReviewsWhoDropdown(whoReviewDropdown, saveUpdateData.contactId);
    planData.populateRelationshipDropdown(whoReviewDropdown, saveUpdateData.contactId);

    POPUP.show(reviewsPopup);
    DOM.autosizeTextarea();
  }
  function addReviewRow(outcomeId) {
    showReviewsPopup({ outcomeId }, true);
  }
  function buildReviewsTable(outcomeId) {
    const reviewsDiv = document.createElement('div');

    const reviewsTable = table.build({
      tableId: `reviewsTable${outcomeId}`,
      headline: 'Reviews',
      columnHeadings: [
        `What will progress look like? How will we know it's happening?`,
        'Who?',
        'When to check in?',
      ],
      sortable: isSortable,
      onSortCallback: async sortData => {
        const reviewId = sortData.row.id.replace('reviews', '');
        sortData.newIndex = sortData.newIndex + 1;
        sortData.oldIndex = sortData.oldIndex + 1;
        await planOutcomesAjax.updateOutcomesReviewOrder({
          token: $.session.Token,
          outcomeId: parseInt(outcomeId),
          reviewId: parseInt(reviewId),
          newPos: parseInt(sortData.newIndex),
          oldPos: parseInt(sortData.oldIndex),
        });
      },
    });
    reviewsTable.classList.add('reviewsTable');

    const addRowBtn = button.build({
      text: 'Add Review',
      style: 'secondary',
      type: 'contained',
      callback: () => addReviewRow(outcomeId),
    });
    if (isReadOnly) {
      addRowBtn.classList.add('disabled');
    }

    if (outcomesData[outcomeId] && outcomesData[outcomeId].reviews) {
      const tableData = Object.values(outcomesData[outcomeId].reviews)
        .sort((a, b) => {
          return a.reviewOrder < b.reviewOrder ? -1 : a.reviewOrder > b.reviewOrder ? 1 : 0;
        })
        .map(td => {
          const whatWillHappen = td.whatWillHappen;
          const whoReview = td.whoReview;
          const whenToCheckIn = td.whenToCheckIn;
          const rowId = `reviews${td.reviewIds}`;

          return {
            id: rowId,
            values: [whatWillHappen, whoReview, whenToCheckIn],
            onClick: () =>
              showReviewsPopup(
                {
                  whatWillHappen: whatWillHappen,
                  whenToCheckIn: whenToCheckIn,
                  whoReview: whoReview,
                  reviewOrder: td.reviewOrder + 1,
                  reviewIds: td.reviewIds,
                  outcomeId: td.outcomeId,
                  contactId: td.contactId,
                },
                false,
              ),
          };
        });

      table.populate(reviewsTable, tableData, isSortable);
    }

    reviewsDiv.appendChild(reviewsTable);

    const reviewsBtnAlertDiv = document.createElement('div');
    reviewsBtnAlertDiv.classList.add('btnAlertContainer');

    const reviewAlertDiv = document.createElement('div');
    reviewAlertDiv.innerHTML = `${icons.error}`;
    reviewAlertDiv.id = `reviewsAlert${outcomeId}`;
    reviewAlertDiv.classList.add('reviewsAlert');

    // creates and shows a tip when hovering over the visible alert div
    planValidation.createTooltip('At least one review must be entered for each outcome', reviewAlertDiv);
    
    reviewsBtnAlertDiv.appendChild(addRowBtn);
    reviewsBtnAlertDiv.appendChild(reviewAlertDiv);
    reviewsDiv.appendChild(reviewsBtnAlertDiv);

    planValidation.reviewsValidationCheck(validationCheck, outcomeId, reviewAlertDiv)

    return reviewsDiv;
  }

  //*------------------------------------------------------
  //* MAIN
  //*------------------------------------------------------
  function buildQuestion({ text, prompt, awnser, callback, maxChars }) {
    const question = document.createElement('div');
    question.classList.add('question');
    question.setAttribute('data-question-name', text.toLowerCase());

    question.innerHTML = `<p class="question__text">${text}</p>`;
    if (prompt) {
      question.innerHTML += `<p class="question__prompt">${prompt}</p>`;
    }

    const questionInput = input.build({
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: awnser,
      charLimit: maxChars,
      forceCharLimit: true,
      callback: e => {
        callback(e);
      },
    });
    question.appendChild(questionInput);

    if (isReadOnly) {
      questionInput.classList.add('disabled');
    }

    return question;
  }
  function buildOutcome({ outcomeId, ...outcomeData }) {
    const outcomesUpdateData = {
      outcome: outcomeData.outcome ? outcomeData.outcome : '',
      details: outcomeData.details ? outcomeData.details : '',
      history: outcomeData.history ? outcomeData.history : '',
      status: outcomeData.status ? outcomeData.status : '',
      carryOverReason: outcomeData.carryOverReason ? outcomeData.carryOverReason : '',
      sectionId: outcomeData.sectionId ? outcomeData.sectionId : '',
      outcomeOrder: outcomeData.outcomeOrder ? outcomeData.outcomeOrder : '',
      outcomeId,
    };

    const outcome = document.createElement('div');
    outcome.classList.add('outcome', `outcome${outcomeId}`);
    outcome.id = outcomeId;
    outcome.setAttribute('data-order', `${outcomesUpdateData.outcomeOrder}`);

    const deleteOutcomeBtn = button.build({
      text: 'Delete Outcome',
      type: 'contained',
      style: 'secondary',
      classNames: 'deleteOutcomeBtn',
      callback: () => {
        const deleteWarningPopup = POPUP.build({
          header: 'Do you want to delete this Outcome and its Experiences and Reviews?',
          classNames: 'deleteWarningPopup',
          hideX: true,
        });

        const yesBtn = button.build({
          text: 'Yes',
          style: 'danger',
          type: 'contained',
          callback: async () => {
            deleteOutcome(outcomeId);
            outcome.parentNode.removeChild(outcome);
            POPUP.hide(deleteWarningPopup);
            checkIfSummaryRequired();

            validationCheck = await planValidation.ISPValidation(planId);
            planValidation.updatedIspOutcomesSetAlerts(validationCheck);
          },
        });
        const noBtn = button.build({
          text: 'No',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            POPUP.hide(deleteWarningPopup);
          },
        });
        const closeWarningBtn = button.build({
          type: 'text',
          style: 'secondary',
          icon: 'close',
          classNames: 'closeWarningBtn',
          callback: function () {
            POPUP.hide(deleteWarningPopup);
          },
        });

        deleteWarningPopup.appendChild(closeWarningBtn);
        deleteWarningPopup.appendChild(yesBtn);
        deleteWarningPopup.appendChild(noBtn);

        POPUP.show(deleteWarningPopup);
      },
    });

    // Outcome Order
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('outcomeOrder');
    orderDiv.innerHTML = `<p>${outcomesUpdateData.outcomeOrder}</p>`;
    // Assessment Area
    const assessmentAreaDropdown = dropdown.build({
      // dropdownId: 'assessmentAreaDropdown',
      label: 'Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        outcomesUpdateData.sectionId = selectedOption.value;
        updateOutcome({
          status: outcomesUpdateData.status,
          carryOverReason: outcomesUpdateData.carryOverReason,
          outcome: outcomesUpdateData.outcome,
          details: outcomesUpdateData.details,
          history: outcomesUpdateData.history,
          outcomeOrder: outcomesUpdateData.outcomeOrder,
          outcomeId: outcomesUpdateData.outcomeId,
          sectionId: outcomesUpdateData.sectionId,
        });
      },
    });
    // Status
    const statusDropdown = dropdown.build({
      // dropdownId: 'statusDropdown',
      label: 'Status',
      style: 'secondary',
      callback: (e, selectedOption) => {
        outcomesUpdateData.status = selectedOption.value;

        updateOutcome({
          status: outcomesUpdateData.status,
          carryOverReason: outcomesUpdateData.carryOverReason,

          outcome: outcomesUpdateData.outcome,
          details: outcomesUpdateData.details,
          history: outcomesUpdateData.history,
          outcomeOrder: outcomesUpdateData.outcomeOrder,
          outcomeId: outcomesUpdateData.outcomeId,
          sectionId: outcomesUpdateData.sectionId,
        });
      },
    });
    // Carryover
    const carryoverInput = buildQuestion({
      text: 'Carryover Reason',
      awnser: outcomesUpdateData.carryOverReason,
      maxChars: charLimits.carryOverReason,
      callback: e => {
        updateOutcome({
          status: outcomesUpdateData.status,
          carryOverReason: outcomesUpdateData.carryOverReason,

          outcome: outcomesUpdateData.outcome,
          details: outcomesUpdateData.details,
          history: outcomesUpdateData.history,
          outcomeOrder: outcomesUpdateData.outcomeOrder,
          outcomeId: outcomesUpdateData.outcomeId,
          sectionId: outcomesUpdateData.sectionId,
        });
      },
    });
    carryoverInput.classList.add('carryoverTextInput');
    carryoverInput.addEventListener('input', e => {
      outcomesUpdateData.carryOverReason = e.target.value;
      if (
        hasPreviousPlan &&
        outcomesUpdateData.status === '1' &&
        outcomesUpdateData.carryOverReason === ''
      ) {
        carryoverInput.classList.add('error');
      } else {
        carryoverInput.classList.remove('error');
      }
    });
    // Outcome
    const outcomeInput = buildQuestion({
      text: 'Outcome',
      prompt: 'What does the person want to accomplish and why?',
      awnser: outcomesUpdateData.outcome,
      maxChars: charLimits.description,
      callback: e => {
        updateOutcome({
          status: outcomesUpdateData.status,
          carryOverReason: outcomesUpdateData.carryOverReason,

          outcome: outcomesUpdateData.outcome,
          details: outcomesUpdateData.details,
          history: outcomesUpdateData.history,
          outcomeOrder: outcomesUpdateData.outcomeOrder,
          outcomeId: outcomesUpdateData.outcomeId,
          sectionId: outcomesUpdateData.sectionId,
        });
      },
    });
    outcomeInput.classList.add('outcomeTextInput');
    outcomeInput.addEventListener('input', e => {
      outcomesUpdateData.outcome = e.target.value;
      if (outcomesUpdateData.outcome === '') {
        outcomeInput.classList.add('error');
        planValidation.updateOutcome(outcomeId, validationCheck, true);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      } else {
        outcomeInput.classList.remove('error');
        planValidation.updateOutcome(outcomeId, validationCheck, false);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      }
    });
    // Details
    const detailsInput = buildQuestion({
      text: 'Details to Know',
      awnser: outcomesUpdateData.details,
      maxChars: charLimits.details,
      callback: e => {
        updateOutcome({
          status: outcomesUpdateData.status,
          carryOverReason: outcomesUpdateData.carryOverReason,

          outcome: outcomesUpdateData.outcome,
          details: outcomesUpdateData.details,
          history: outcomesUpdateData.history,
          outcomeOrder: outcomesUpdateData.outcomeOrder,
          outcomeId: outcomesUpdateData.outcomeId,
          sectionId: outcomesUpdateData.sectionId,
        });
      },
    });
    detailsInput.classList.add('detailsTextInput');
    detailsInput.addEventListener('input', e => {
      outcomesUpdateData.details = e.target.value;
      if (outcomesUpdateData.details === '') {
        detailsInput.classList.add('error');
        planValidation.updateOutcomeDetails(outcomeId, validationCheck, true);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      } else {
        detailsInput.classList.remove('error');
        planValidation.updateOutcomeDetails(outcomeId, validationCheck, false);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      }
    });
    // History
    const historyInput = buildQuestion({
      text: 'Important and Relevant History', //
      prompt:
        'Remember to only include history that may impact a persons life, support and achievement of outcomes.',
      awnser: outcomesUpdateData.history,
      maxChars: charLimits.history,
      callback: e => {
        updateOutcome({
          status: outcomesUpdateData.status,
          carryOverReason: outcomesUpdateData.carryOverReason,

          outcome: outcomesUpdateData.outcome,
          details: outcomesUpdateData.details,
          history: outcomesUpdateData.history,
          outcomeOrder: outcomesUpdateData.outcomeOrder,
          outcomeId: outcomesUpdateData.outcomeId,
          sectionId: outcomesUpdateData.sectionId,
        });
      },
    });
    historyInput.classList.add('historyTextInput');
    historyInput.addEventListener('input', e => {
      outcomesUpdateData.history = e.target.value;

      if (outcomesUpdateData.history === '') {
        historyInput.classList.add('error');
      } else {
        historyInput.classList.remove('error');
      }
    });

    // Tables
    const experiencesTable = buildExperiencesTables(outcomeId);
    const reviewTable = buildReviewsTable(outcomeId);

    // init required fields
    if (outcomesUpdateData.outcome === '') {
      outcomeInput.classList.add('error');
    }
    if (outcomesUpdateData.details === '') {
      detailsInput.classList.add('error');
    }
    if (outcomesUpdateData.history === '') {
      historyInput.classList.add('error');
    }
    if (
      hasPreviousPlan &&
      outcomesUpdateData.status === '1' &&
      outcomesUpdateData.carryOverReason === ''
    ) {
      carryoverInput.classList.add('error');
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      deleteOutcomeBtn.classList.add('disabled');
    }

    // outcome assemble!
    const topRow = document.createElement('div');
    topRow.classList.add('outcomeToprow');
    topRow.appendChild(orderDiv);
    topRow.appendChild(assessmentAreaDropdown);
    topRow.appendChild(statusDropdown);
    outcome.appendChild(topRow);
    outcome.appendChild(carryoverInput);
    outcome.appendChild(outcomeInput);
    outcome.appendChild(detailsInput);
    outcome.appendChild(experiencesTable);
    outcome.appendChild(reviewTable);
    outcome.appendChild(historyInput);
    outcome.appendChild(deleteOutcomeBtn);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, outcomesUpdateData.sectionId);
    populateStatusDropdown(statusDropdown, outcomesUpdateData.status);

    return outcome;
  }
  function getMarkup() {
    const outcomesDataValues = Object.values(outcomesData);

    outcomesWrap = document.createElement('div');
    outcomesWrap.classList.add('planOutcomes');

    const heading = document.createElement('h2');
    heading.innerHTML = 'Outcomes';
    heading.classList.add('sectionHeading');
    outcomesWrap.appendChild(heading);

    // outcome summary
    outcomesProgressSummary = buildQuestion({
      text: 'Summary of Progress Outcomes:',
      prompt: 'Share accomplishments, progress, how success is to be celebrated.',
      awnser: progressSummary,
      maxChars: 2500,
      callback: e => {
        progressSummary = e.target.value;
        checkIfSummaryRequired();
        const textForSave = e.target.value;
        planOutcomesAjax.updatePlanOutcomeProgressSummary({
          token: $.session.Token,
          progressSummary: textForSave,
          progressSummaryId: progressSummaryId,
        });

        if (e.target.value === '') {
          validationCheck.planProgressSummary = false;
        } else {
          validationCheck.planProgressSummary = true;
        }
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);
      },
    });
    outcomesProgressSummary.classList.add('summaryOutcomesTextInput');
    outcomesWrap.appendChild(outcomesProgressSummary);

    // add outcome
    addOutcomeBtn = button.build({
      text: 'Add Outcome',
      type: 'contained',
      style: 'secondary',
      classNames: 'addRowBtn',
      callback: async () => {
        const outcomes = [...document.querySelectorAll('.outcome')];
        const outcomeOrder = outcomes.length + 1;

        const outcomeId = await insertOutcome({
          outcome: '',
          details: '',
          history: '',
          sectionId: '',
          status: '0',
          carryOverReason: '',
          assessmentId: planId,
          outcomeOrder: 0, //need this to  keep from first one defaulting to 2
        });

        validationCheck = await planValidation.ISPValidation(planId);
        planValidation.updatedIspOutcomesSetAlerts(validationCheck);

        const outcome = buildOutcome({ outcomeId, outcomeOrder, status: '0' });
        outcomesWrap.insertBefore(outcome, addOutcomeBtn);
        checkIfSummaryRequired();
      },
    });
    outcomesWrap.appendChild(addOutcomeBtn);
    if (isReadOnly) {
      addOutcomeBtn.classList.add('disabled');
    }

    // load existing outcomes
    if (outcomesDataValues.length > 0) {
      const sortedOutcomes = sortOutcomesByOrder(outcomesDataValues);
      sortedOutcomes.forEach(pyid => {
        const outcome = buildOutcome(pyid);
        outcomesWrap.insertBefore(outcome, addOutcomeBtn);
      });
      if (progressSummary === '') {
        outcomesProgressSummary.classList.add('error');
      }
    }

    return outcomesWrap;
  }

  async function init(data) {
    // data = { planId, readOnly }
    planId = data.planId;
    isReadOnly = data.readOnly;
    charLimits = planData.getISPCharacterLimits('outcomes');

    if (!$.session.planUpdate) {
      isSortable = false;
    } else {
      isSortable = isReadOnly ? false : true;
    }

    validationCheck = await planValidation.ISPValidation(planId);
     
    const planOutcomesData = validationCheck.outcomesData;

    if (
      !planOutcomesData.planProgressSummary ||
      planOutcomesData.planProgressSummary.length === 0
    ) {
      let summaryId = await planOutcomesAjax.insertPlanOutcomeProgressSummary({
        token: $.session.Token,
        planId: parseInt(planId),
        progressSummary: '',
      });
      summaryId = summaryId.split(':');
      summaryId = summaryId[1];
      summaryId = summaryId.replace('}]', '').replace('"', '');

      progressSummary = '';
      progressSummaryId = summaryId;
    } else {
      progressSummary = planOutcomesData.planProgressSummary[0].progressSummary;
      progressSummaryId = planOutcomesData.planProgressSummary[0].progressSummaryId;
    }

    dropdownData = planData.getDropdownData();
    outcomesData = mapOutcomesDetails(planOutcomesData);
    hasPreviousPlan = plan.getHasPreviousPlans();

    const ddData = dropdownData.serviceVendors.map(dd => {
      return {
        value: dd.vendorId,
        text: dd.vendorName,
      };
    });

    const { getPlanOutcomesPaidSupportProvidersResult: selectedVendors } =
      await planOutcomesAjax.getPlanOutcomesPaidSupportProviders(planId);
      
      function getSelectedVendorIds() {
        return selectedVendors.reduce((acc, vendor) => {
          acc.push(vendor.vendorId);
          return acc;
        }, []);
      }

    const selectedVendorIds = getSelectedVendorIds();

    const paidSupportData = ddData.filter(provider => selectedVendorIds.includes(provider.value));

    validationCheck.paidSupportsProviders = paidSupportData;

    return validationCheck;
  }

  return {
    init,
    getMarkup,
    showAddNewOutcomePopup,
    refreshDropdownData,
    getSelectedVendors,
  };
})();
