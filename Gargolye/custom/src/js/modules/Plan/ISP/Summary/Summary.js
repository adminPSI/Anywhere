const planSummary = (function () {
  let isReadOnly;
  let isSortable;
  let planId; // aka: assessmentId
  let charLimits;
  // data
  let summaryData;
  let dropdownData;
  let additionalSummaryData;
  // data map
  let sectionIdMap = {};
  let sectionOrderMap = {};
  let questionIdMap = {};
  let questionSetIdMap = {};
  let tablesToHide = {};
  // Summary additional questions
  let amountOfTimeQuestion;
  let backupPlanQuestion;
  let hasPaidSupports;
  // Selected Vendors => Risks/WhoResponsible
  let selectedVendors = {};

  // UTILS
  //----------------------------------
  function refreshDropdownData(newDropdownData) {
    dropdownData = newDropdownData;
  }
  function mapSummaryData(data) {
    if (!data) return [];

    return data.reduce(
      (acc, val) => {
        let dataName;
        const questionText = val.questionText;

        if (questionText.includes('Important')) {
          dataName = 'importantTableData';
        } else if (
          questionText.includes('Skills') ||
          questionText.includes('Best way to connect') ||
          questionText.includes('Place on path to')
        ) {
          dataName = 'skillsTableData';
        } else {
          dataName = 'risksTableData';
        }

        const sectionId = val.sectionId;
        const sectionTitle = val.sectionTitle;
        const sectionOrder = val.sectionOrder;
        const row = val.answerRow;
        const answer = val.answer;
        const answerId = val.answerId;
        const answerStyle = val.answerStyle;
        const questionId = val.questionId;
        const questionSetId = val.questionSetId;

        if (!acc[dataName][sectionTitle]) acc[dataName][sectionTitle] = {};
        if (!acc[dataName][sectionTitle][row]) acc[dataName][sectionTitle][row] = {};

        let questionCol;

        if (questionText.includes('Important')) {
          questionCol = questionText.includes('Important To') ? 'importantTo' : 'importantFor';
        } else {
          questionCol = questionText.includes('Best way to connect with the person')
            ? 'communication'
            : questionText.includes('Place on path to')
            ? 'dailyLife'
            : questionText.includes('Skills')
            ? 'skillAbility'
            : questionText.includes('What is the risk, what it looks like')
            ? 'whatIsRisk'
            : questionText.includes('What support must look like')
            ? 'whatSupportLooksLike'
            : questionText.includes('Does this risk require supervision')
            ? 'riskSupervision'
            : 'whoResponsible';
        }

        acc[dataName][sectionTitle][row][questionCol] = {
          answer,
          answerId,
          answerStyle,
          questionId,
          questionSetId,
        };

        // Section Order Map
        if (!sectionOrderMap[sectionOrder]) {
          sectionOrderMap[sectionOrder] = sectionTitle;
        }

        // Section Id Map
        if (!sectionIdMap[sectionTitle]) {
          sectionIdMap[sectionTitle] = sectionId;
        }

        // Question ID Map
        if (!questionIdMap[dataName]) {
          questionIdMap[dataName] = {};
        }
        if (!questionIdMap[dataName][sectionTitle]) {
          questionIdMap[dataName][sectionTitle] = {};
        }
        if (!questionIdMap[dataName][sectionTitle][questionCol]) {
          questionIdMap[dataName][sectionTitle][questionCol] = questionId;
        }
        // QuestionSet ID Map
        if (!questionSetIdMap[dataName]) {
          questionSetIdMap[dataName] = {};
        }
        if (!questionSetIdMap[dataName][sectionTitle]) {
          questionSetIdMap[dataName][sectionTitle] = questionSetId;
        }

        return acc;
      },
      {
        importantTableData: {},
        skillsTableData: {},
        risksTableData: {},
      },
    );
  }
  async function deleteTableRow(questionSetId, rowsToDelete, rowId) {
    await assessmentAjax.deleteAssessmentGridRowAnswers({
      token: $.session.Token,
      consumerPlanId: planId,
      assessmentQuestionSetId: questionSetId,
      rowsToDelete: [rowsToDelete],
    });

    const rowToDelete = document.getElementById(rowId);
    const tableBody = rowToDelete.parentNode;

    table.deleteRow(rowId);

    //* FOR RE-ORDERING ROWS ON DELETE
    const rowsLeftOver = [...tableBody.querySelectorAll('.table__row')];
    rowsLeftOver.forEach(async (row, i) => {
      const rowIdText = row.id.replace(/[0-9]/g, '');
      const order = parseInt(row.id.replaceAll(/\D+/g, ''));
      // check row for gap in order
      if (order !== i + 1) {
        //    // update the row order in DB
        //    await assessmentAjax.updateAssessmentAnswerRowOrder({
        //      token: $.session.Token,
        //      assessmentId: parseInt(planId),
        //      questionSetId: parseInt(questionSetId),
        //      answerIds: row.dataset.answerids,
        //      newPos: parseInt(i + 1),
        //      oldPos: parseInt(order),
        //    });
        //    // update row id
        row.id = `${rowIdText}${i + 1}`;
      }
      // if no gap do nothing
    });
  }
  function updateRowOrder(evt) {
    const newPos = evt.newIndex + 1;
    const oldPos = evt.oldIndex + 1;

    assessmentAjax.updateAssessmentAnswerRowOrder({
      token: $.session.Token,
      assessmentId: parseInt(planId),
      questionSetId: parseInt(evt.row.dataset.questionsetid),
      answerIds: evt.row.dataset.answerids,
      newPos: parseInt(newPos),
      oldPos: parseInt(oldPos),
    });

    const tableBody = evt.row.parentNode;
    const rowsLeftOver = [...tableBody.querySelectorAll('.table__row')];
    rowsLeftOver.forEach((row, i) => {
      const rowIdText = row.id.replace(/[0-9]/g, '');
      const order = parseInt(row.id.replaceAll(/\D+/g, ''));
      // check row for gap in order
      if (order !== i + 1) {
        // update row id
        row.id = `${rowIdText}${i + 1}`; //
      }
      // if no gap do nothing
    });
  }
  function getSelectedVendors() {
    return Object.keys(selectedVendors);
  }

  // DROPDOWNS
  //----------------------------------
  //-- populate -------
  function populateAssessmentAreaDropdown(dropdownEle, defaultValue) {
    const a = assessment.getApplicableSections();

    const data = dropdownData.assessmentAreas
      .filter(dd => a[dd.assessmentAreaId])
      .map(dd => {
        return {
          value: dd.assessmentArea,
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
  function populateBestWayToConnectDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.communicationType.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateDailyLifeDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.dailyLifeDropdownType.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateLevelsOfSupervisionDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.levelsOfSupervision.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  //-- map id to name -------
  function getLevelOfSupervisionById(id) {
    const filteredData = dropdownData.levelsOfSupervision.filter(dd => dd.value === id);
    return filteredData.length > 0 ? filteredData[0].text : '';
  }
  function getCommicationById(id) {
    const filteredData = dropdownData.communicationType.filter(dd => dd.value === id);
    return filteredData.length > 0 ? filteredData[0].text : '';
  }
  function getDailyLifeById(id) {
    const filteredData = dropdownData.dailyLifeDropdownType.filter(dd => dd.value === id);
    return filteredData.length > 0 ? filteredData[0].text : '';
  }

  // IMPORTANT TO/FOR TABLES
  //--------------------------------------------------------------------
  function addImportantTableRow(data) {
    const sectionTitle = data.sectionTitle;
    const secTitle = sectionTitle.replaceAll(' ', '');
    const row = data.row;
    const importantTo = data.importantTo.answer;
    const importantFor = data.importantFor.answer;
    const questionSetId = data.questionSetId;
    const rowId = `planImportantTable${secTitle}${row}`;

    table.addRows(
      `planImportantTable${secTitle}`,
      [
        {
          id: rowId,
          values: [sectionTitle, importantTo, importantFor],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: `${data.importantTo.answerId}|${data.importantFor.answerId}`,
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planImportantTable${secTitle}`, '');
            showImportantTablePopup(
              {
                ...data,
                row: rowOrderFromID,
              },
              false,
            );
          },
        },
      ],
      isSortable,
    );
  }
  function updateImportantTableRow(data) {
    const sectionTitle = data.sectionTitle;
    const secTitle = sectionTitle.replaceAll(' ', '');
    const row = data.row;
    const importantTo = data.importantTo.answer;
    const importantFor = data.importantFor.answer;
    const questionSetId = data.questionSetId;
    const rowId = `planImportantTable${secTitle}${row}`;

    table.updateRows(
      `planImportantTable${secTitle}`,
      [
        {
          id: rowId,
          values: [sectionTitle, importantTo, importantFor],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: `${data.importantTo.answerId}|${data.importantFor.answerId}`,
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planImportantTable${secTitle}`, '');
            showImportantTablePopup(
              {
                ...data,
                row: rowOrderFromID,
              },
              false,
            );
          },
        },
      ],
      isSortable,
    );
  }
  // markup
  //------------------
  function toggleImportantDoneBtn() {
    const inputsWithErrors = document.querySelector('.importantPopup .error');
    const doneBtn = document.querySelector('.importantPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showImportantTablePopup(popupData, isNew) {
    let hasInitialErros;

    let sectionTitle = popupData.sectionTitle ? popupData.sectionTitle : '';
    let importantTo = popupData.importantTo ? popupData.importantTo.answer : '';
    let importantFor = popupData.importantFor ? popupData.importantFor.answer : '';
    let row = popupData.row;

    let importantToAnswerId, importantForAnswerId;

    if (!isNew) {
      importantToAnswerId = popupData.importantTo.answerId;
      importantForAnswerId = popupData.importantFor.answerId;
    }

    const importantPopup = POPUP.build({
      header: isNew ? 'Add Important To/For' : 'Edit Important To/For',
      classNames: 'importantPopup',
      hideX: true,
    });

    // Assessment Area
    const assessmentAreaDropdown = dropdown.build({
      dropdownId: 'assessmentAreaDropdownITF',
      label: 'Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        sectionTitle = selectedOption.value;

        if (sectionTitle === '' || sectionTitle === '%') {
          assessmentAreaDropdown.classList.add('error');
        } else {
          assessmentAreaDropdown.classList.remove('error');
        }

        toggleImportantDoneBtn();
      },
    });
    if (!isNew) {
      assessmentAreaDropdown.classList.add('disabled');
    }
    // Important To
    const importantToTextarea = input.build({
      label: 'Important To',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: importantTo,
      charLimit: charLimits.importantTo,
      forceCharLimit: true,
      callback: e => {
        importantTo = e.target.value;
      },
    });
    importantToTextarea.classList.add('importantTo');
    // Important For
    const importantForTextarea = input.build({
      label: 'Important For',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: importantFor,
      charLimit: charLimits.importantFor,
      forceCharLimit: true,
      callback: e => {
        importantFor = e.target.value;
      },
    });
    importantForTextarea.classList.add('importantFor');

    const doneBtn = button.build({
      text: isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');
        let questionSetId = questionSetIdMap['importantTableData'][sectionTitle];

        if (isNew) {
          const secTitle = sectionTitle.replaceAll(' ', '');
          let rowOrder = table.getRowCount(`planImportantTable${secTitle}`);
          const questionIds = questionIdMap['importantTableData'][sectionTitle];
          rowOrder = rowOrder + 1;
          const answerIds = await summaryAjax.insertAssessmentSummaryAnswers({
            token: $.session.Token,
            userId: $.session.UserId,
            anywAssessmentId: parseInt(planId),
            answerRow: [rowOrder, rowOrder],
            anywQuestionIds: [
              parseInt(questionIds.importantTo),
              parseInt(questionIds.importantFor),
            ],
            answers: [
              UTIL.removeUnsavableNoteText(importantTo),
              UTIL.removeUnsavableNoteText(importantFor),
            ],
          });

          addImportantTableRow({
            sectionTitle,
            row: rowOrder,
            questionSetId,
            importantTo: {
              answer: importantTo,
              answerId: answerIds[questionIds.importantTo],
            },
            importantFor: {
              answer: importantFor,
              answerId: answerIds[questionIds.importantFor],
            },
          });
        } else {
          await summaryAjax.updateAssessmentSummaryAnswers({
            token: $.session.Token,
            userId: $.session.UserId,
            anywAssessmentId: parseInt(planId),
            answerRow: [row, row],
            anywAnswerIds: [parseInt(importantToAnswerId), parseInt(importantForAnswerId)],
            answers: [
              UTIL.removeUnsavableNoteText(importantTo),
              UTIL.removeUnsavableNoteText(importantFor),
            ],
          });

          updateImportantTableRow({
            sectionTitle,
            row,
            questionSetId,
            importantTo: {
              answer: importantTo,
              answerId: importantToAnswerId,
            },
            importantFor: {
              answer: importantFor,
              answerId: importantForAnswerId,
            },
          });
        }

        doneBtn.classList.remove('disabled');
        POPUP.hide(importantPopup);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(importantPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: async () => {
        const message = 'Do you want to delete this entry?';
        ISP.showDeleteWarning(importantPopup, message, async () => {
          const secTitle = sectionTitle.replaceAll(' ', '');
          let rowCount = table.getRowCount(`planImportantTable${secTitle}`);
          const setId = questionSetIdMap['importantTableData'][sectionTitle];

          if (rowCount > 1) {
            deleteTableRow(setId, row, `planImportantTable${secTitle}${row}`);
          } else {
            importantTo = '';
            importantFor = '';
            await summaryAjax.updateAssessmentSummaryAnswers({
              token: $.session.Token,
              userId: $.session.UserId,
              anywAssessmentId: parseInt(planId),
              answerRow: [row, row],
              anywAnswerIds: [parseInt(importantToAnswerId), parseInt(importantForAnswerId)],
              answers: [importantTo, importantFor],
            });

            updateImportantTableRow({
              sectionTitle,
              row,
              questionSetId: setId,
              importantTo: {
                answer: importantTo,
                answerId: importantToAnswerId,
              },
              importantFor: {
                answer: importantFor,
                answerId: importantForAnswerId,
              },
            });
          }
        });
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (sectionTitle === '' || sectionTitle === '%') {
      assessmentAreaDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      importantToTextarea.classList.add('disabled');
      importantForTextarea.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    importantPopup.appendChild(assessmentAreaDropdown);
    importantPopup.appendChild(importantToTextarea);
    importantPopup.appendChild(importantForTextarea);
    importantPopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, sectionTitle);

    POPUP.show(importantPopup);
    DOM.autosizeTextarea();
  }
  function buildImportTableBySection(data) {
    let tableData = [];

    const secTitle = Object.keys(data)[0].replaceAll(' ', '');

    const importantTable = table.build({
      tableId: `planImportantTable${secTitle}`,
      columnHeadings: [
        'Assessment Area',
        'Important To: What makes the person feel satisfied, content',
        'Important For: Health, safety, valued member / social role',
      ],
      sortable: isSortable,
      onSortCallback: evt => {
        updateRowOrder(evt);
      },
    });

    Object.entries(data).forEach(([sectionTitle, rowData]) => {
      Object.entries(rowData).forEach(([rowId, val]) => {
        const importantTo = val.importantTo.answer;
        const importantFor = val.importantFor.answer;
        const secTitle = sectionTitle.replaceAll(' ', '');
        const questionSetId = val.importantFor.questionSetId;

        tableData.push({
          id: `planImportantTable${secTitle}${rowId}`,
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: `${val.importantTo.answerId}|${val.importantFor.answerId}`,
            },
          ],
          values: [sectionTitle, importantTo, importantFor],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planImportantTable${secTitle}`, '');
            showImportantTablePopup(
              {
                sectionTitle,
                row: rowOrderFromID,
                questionSetId,
                importantTo: {
                  answer: importantTo,
                  answerId: val.importantTo.answerId,
                },
                importantFor: {
                  answer: importantFor,
                  answerId: val.importantFor.answerId,
                },
              },
              false,
            );
          },
        });
      });
    });

    table.populate(importantTable, tableData, isSortable);

    return importantTable;
  }
  function getImportantTablesMarkup(importantTableData) {
    const importantDiv = document.createElement('div');
    importantDiv.classList.add('importantTablesWrap');

    const heading = document.createElement('h3');
    heading.innerHTML = 'Important To / Important For';
    importantDiv.appendChild(heading);

    const a = assessment.getApplicableSections();

    if (importantTableData) {
      Object.entries(sectionOrderMap).forEach(([key, val], index) => {
        if (a[sectionIdMap[val]]) {
          const tableData = importantTableData[val];
          const importantTable = buildImportTableBySection({ [val]: tableData });
          if (index === 0) importantTable.classList.add('main');
          importantDiv.appendChild(importantTable);
        }
      });
    }

    const addRowBtn = button.build({
      text: 'Add Important To/For',
      style: 'secondary',
      type: 'contained',
      callback: () => showImportantTablePopup({}, true),
    });
    if (isReadOnly) addRowBtn.classList.add('disabled');
    importantDiv.appendChild(addRowBtn);

    return importantDiv;
  }

  // SKILLS & ABILITIES TABLES
  //--------------------------------------------------------------------
  function addSkillsTableRow(data) {
    const sectionTitle = data.sectionTitle;
    const secTitle = sectionTitle.replaceAll(' ', '');
    const skillAbility = data.skillAbility.answer;
    const questionSetId = data.questionSetId;
    const row = data.row;
    const answerIds = [data.skillAbility.answerId];
    const rowId = `planSkillsTable${secTitle}${row}`;

    let colText;

    const popupData = {
      sectionTitle,
      questionSetId,
      row,
      skillAbility: {
        answer: skillAbility,
        answerId: data.skillAbility.answerId,
      },
    };

    colText = skillAbility;

    table.addRows(
      `planSkillsTable${secTitle}`,
      [
        {
          id: rowId,
          values: [sectionTitle, colText],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: answerIds.join('|'),
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planSkillsTable${secTitle}`, '');
            showSkillsTablePopup(
              {
                ...popupData,
                row: rowOrderFromID,
              },
              false,
            );
          },
        },
      ],
      isSortable,
    );
  }
  function updateSkillsTableRow(data) {
    const sectionTitle = data.sectionTitle;
    const secTitle = sectionTitle.replaceAll(' ', '');
    const skillAbility = data.skillAbility.answer;
    const questionSetId = data.questionSetId;
    const row = data.row;
    const answerIds = [data.skillAbility.answerId];
    const rowId = `planSkillsTable${secTitle}${row}`;
    let colText;

    const popupData = {
      sectionTitle,
      questionSetId,
      row,
      skillAbility: {
        answer: skillAbility,
        answerId: data.skillAbility.answerId,
      },
    };

    colText = skillAbility;

    table.updateRows(
      `planSkillsTable${secTitle}`,
      [
        {
          id: rowId,
          values: [sectionTitle, colText],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: answerIds.join('|'),
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planSkillsTable${secTitle}`, '');
            showSkillsTablePopup(
              {
                ...popupData,
                row: rowOrderFromID,
              },
              false,
            );
          },
        },
      ],
      isSortable,
    );
  }
  // markup
  //------------------
  function toggleSkillsDoneBtn() {
    const inputsWithErrors = document.querySelector('.skillsPopup .error');
    const doneBtn = document.querySelector('.skillsPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showSkillsTablePopup(popupData, isNew) {
    let hasInitialErros;

    let sectionTitle = popupData.sectionTitle ? popupData.sectionTitle : '';
    let skillAbility = popupData.skillAbility ? popupData.skillAbility.answer : '';
    let row = popupData.row;

    let skillAbilityId;

    if (!isNew) {
      skillAbilityId = popupData.skillAbility.answerId;
      communicationId = popupData.communication ? popupData.communication.answerId : '';
      dailyLifeId = popupData.dailyLife ? popupData.dailyLife.answerId : '';
    }

    const skillsPopup = POPUP.build({
      header: isNew ? 'Add Skill/Ability' : 'Edit Skill/Ability',
      classNames: 'skillsPopup',
      hideX: true,
    });

    // Assessment Area Dropdown
    const assessmentAreaDropdown = dropdown.build({
      dropdownId: 'assessmentAreaDropdownSA',
      label: 'Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        sectionTitle = selectedOption.value;

        if (sectionTitle === '' || sectionTitle === '%') {
          assessmentAreaDropdown.classList.add('error');
        } else {
          assessmentAreaDropdown.classList.remove('error');
        }

        toggleSkillsDoneBtn();
      },
    });
    if (!isNew) {
      assessmentAreaDropdown.classList.add('disabled');
    }
    // Text Input
    const defaultTextInput = input.build({
      label: 'What is this person good at?',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: skillAbility,
      charLimit: charLimits.skillsAndAbilities,
      forceCharLimit: true,
      callback: e => {
        skillAbility = e.target.value;

        if (skillAbility === '') {
          defaultTextInput.classList.add('error');
        } else {
          defaultTextInput.classList.remove('error');
        }

        toggleSkillsDoneBtn();
      },
    });
    defaultTextInput.classList.add('skillAbility');
    defaultTextInput.addEventListener('keyup', e => {
      skillAbility = e.target.value;

      if (skillAbility === '') {
        defaultTextInput.classList.add('error');
      } else {
        defaultTextInput.classList.remove('error');
      }

      toggleSkillsDoneBtn();
    });

    const doneBtn = button.build({
      text: isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');
        let questionSetId = questionSetIdMap['skillsTableData'][sectionTitle];

        if (isNew) {
          const secTitle = sectionTitle.replaceAll(' ', '');
          let rowOrder = table.getRowCount(`planSkillsTable${secTitle}`);
          const questionIds = questionIdMap['skillsTableData'][sectionTitle];
          rowOrder = rowOrder + 1;

          const retrieveData = {
            token: $.session.Token,
            userId: $.session.UserId,
            anywAssessmentId: parseInt(planId),
            answerRow: [rowOrder],
            anywQuestionIds: [parseInt(questionIds.skillAbility)],
            answers: [UTIL.removeUnsavableNoteText(skillAbility)],
          };

          const answerIds = await summaryAjax.insertAssessmentSummaryAnswers({
            ...retrieveData,
          });

          const popupData = {
            sectionTitle,
            row: rowOrder,
            questionSetId,
            skillAbility: {
              answer: skillAbility,
              answerId: answerIds[questionIds.skillAbility],
            },
          };

          addSkillsTableRow({
            ...popupData,
          });
        } else {
          const retrieveData = {
            token: $.session.Token,
            userId: $.session.UserId,
            anywAssessmentId: parseInt(planId),
            answerRow: [row],
            anywAnswerIds: [parseInt(skillAbilityId)],
            answers: [UTIL.removeUnsavableNoteText(skillAbility)],
          };
          const popupData = {
            sectionTitle,
            questionSetId,
            row,
            skillAbility: {
              answer: skillAbility,
              answerId: skillAbilityId,
            },
          };

          await summaryAjax.updateAssessmentSummaryAnswers({
            ...retrieveData,
          });

          updateSkillsTableRow({
            ...popupData,
          });
        }

        doneBtn.classList.remove('disabled');
        POPUP.hide(skillsPopup);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(skillsPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: async () => {
        const message = 'Do you want to delete this entry?';
        ISP.showDeleteWarning(skillsPopup, message, async () => {
          const secTitle = sectionTitle.replaceAll(' ', '');
          let rowCount = table.getRowCount(`planSkillsTable${secTitle}`);
          const setId = questionSetIdMap['skillsTableData'][sectionTitle];

          if (rowCount > 1) {
            deleteTableRow(setId, row, `planSkillsTable${secTitle}${row}`);
          } else {
            skillAbility = '';

            const retrieveData = {
              token: $.session.Token,
              userId: $.session.UserId,
              anywAssessmentId: parseInt(planId),
              answerRow: [row],
              anywAnswerIds: [parseInt(skillAbilityId)],
              answers: [skillAbility],
            };
            const popupData = {
              sectionTitle,
              questionSetId: setId,
              row,
              skillAbility: {
                answer: skillAbility,
                answerId: skillAbilityId,
              },
            };

            await summaryAjax.updateAssessmentSummaryAnswers({
              ...retrieveData,
            });

            updateSkillsTableRow({
              ...popupData,
            });
          }
        });
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (sectionTitle === '' || sectionTitle === '%') {
      assessmentAreaDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (skillAbility === '') {
      defaultTextInput.classList.add('error');
      hasInitialErros = true;
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      defaultTextInput.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    skillsPopup.appendChild(assessmentAreaDropdown);
    skillsPopup.appendChild(defaultTextInput);
    skillsPopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, popupData.sectionTitle);

    POPUP.show(skillsPopup);
    DOM.autosizeTextarea();
  }
  function buildSkillsTableBySection(data) {
    let tableData = [];

    const secTitle = Object.keys(data)[0].replaceAll(' ', '');

    const skillsTable = table.build({
      tableId: `planSkillsTable${secTitle}`,
      columnHeadings: [
        'Assessment Area',
        'What is the person good at, what can they do on their own, what do they have to contribute',
      ],
      sortable: isSortable,
      onSortCallback: evt => {
        updateRowOrder(evt);
      },
    });

    Object.entries(data).forEach(([sectionTitle, rowData]) => {
      Object.entries(rowData).forEach(([rowId, val]) => {
        const secTitle = sectionTitle.replaceAll(' ', '');
        const skillAbility = val.skillAbility.answer;
        const questionSetId = val.skillAbility.questionSetId;
        let colText;

        const popupData = {
          sectionTitle,
          row: rowId,
          questionSetId,
          skillAbility: {
            answer: skillAbility,
            answerId: val.skillAbility.answerId,
          },
        };

        const answerIds = [val.skillAbility.answerId];

        colText = skillAbility;

        tableData.push({
          id: `planSkillsTable${secTitle}${rowId}`,
          values: [sectionTitle, colText],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: answerIds.join('|'),
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planSkillsTable${secTitle}`, '');
            showSkillsTablePopup(
              {
                ...popupData,
                row: rowOrderFromID,
              },
              false,
            );
          },
        });
      });
    });

    table.populate(skillsTable, tableData, isSortable);

    return skillsTable;
  }
  function getSkillsTablesMarkup(skillsTableData) {
    const skillsDiv = document.createElement('div');
    skillsDiv.classList.add('skillsTablesWrap');

    const heading = document.createElement('h3');
    heading.innerHTML = 'Skills & Abilities';
    skillsDiv.appendChild(heading);

    const a = assessment.getApplicableSections();

    if (skillsTableData) {
      Object.entries(sectionOrderMap).forEach(([key, val], index) => {
        if (a[sectionIdMap[val]]) {
          const tableData = skillsTableData[val];
          const skillsTable = buildSkillsTableBySection({ [val]: tableData });
          if (index === 0) skillsTable.classList.add('main');
          skillsDiv.appendChild(skillsTable);
        }
      });
    }

    const addRowBtn = button.build({
      text: 'Add Skill/Ability',
      style: 'secondary',
      type: 'contained',
      callback: () => showSkillsTablePopup({}, true),
    });
    if (isReadOnly) addRowBtn.classList.add('disabled');
    skillsDiv.appendChild(addRowBtn);

    //* Added Questions
    if (additionalSummaryData.bestWayToConnect === '%') {
      //TODO: have backend set default
      additionalSummaryData.bestWayToConnect = '1';
      summaryAjax.updateBestWayToConnect({
        token: $.session.Token,
        anywAssessmentId: planId,
        bestWayId: '1',
      });
    }

    const questionsWrap = document.createElement('div');
    questionsWrap.classList.add('additionalQuestionWrap');
    // const bestWayToConnectDropdown = dropdown.build({
    //   dropdownId: 'connectDropdown',
    //   label: 'Best way to connect with the person',
    //   style: 'secondary',
    //   callback: async (e, selectedOption) => {
    //     additionalSummaryData.bestWayToConnect = selectedOption.value;

    //     if (additionalSummaryData.bestWayToConnect === '7') {
    //       if (additionalSummaryData.moreDetail === '') {
    //         otherTextInput.classList.add('error');
    //       }
    //     } else {
    //       otherTextInput.classList.remove('error');
    //     }

    //     // update dropdown value to DB
    //     await summaryAjax.updateBestWayToConnect({
    //       token: $.session.Token,
    //       anywAssessmentId: planId,
    //       bestWayId: selectedOption.value,
    //     });
    //   },
    // });
    // const otherTextInput = input.build({
    //   label: 'More Detail',
    //   type: 'textarea',
    //   style: 'secondary',
    //   classNames: 'autosize',
    //   value: additionalSummaryData.moreDetail,
    //   charLimit: '1000',
    //   forceCharLimit: true,
    //   callback: async e => {
    //     additionalSummaryData.moreDetail = e.target.value;

    //     if (additionalSummaryData.bestWayToConnect === '7') {
    //       if (additionalSummaryData.moreDetail === '') {
    //         otherTextInput.classList.add('error');
    //       } else {
    //         otherTextInput.classList.remove('error');
    //       }
    //     }

    //     await summaryAjax.updateMoreDetail({
    //       token: $.session.Token,
    //       anywAssessmentId: planId,
    //       detail: e.target.value,
    //     });
    //   },
    // });
    const placeOnPathDropdown = dropdown.build({
      dropdownId: 'pathDropdown',
      label: 'Place on path to community employment',
      style: 'secondary',
      callback: async (e, selectedOption) => {
        additionalSummaryData.placeOnPath = selectedOption.value;

        await summaryAjax.updatePlaceOnPath({
          token: $.session.Token,
          anywAssessmentId: planId,
          placeId: selectedOption.value,
        });
      },
    });

    // questionsWrap.appendChild(bestWayToConnectDropdown);
    // questionsWrap.appendChild(otherTextInput);
    questionsWrap.appendChild(placeOnPathDropdown);
    skillsDiv.appendChild(questionsWrap);

    if (isReadOnly) {
      // bestWayToConnectDropdown.classList.add('disabled');
      // otherTextInput.classList.add('disabled');
      placeOnPathDropdown.classList.add('disabled');
    }

    //* Required fields for added questions
    // if (additionalSummaryData.bestWayToConnect === '7') {
    //   if (additionalSummaryData.moreDetail === '') {
    //     otherTextInput.classList.add('error');
    //   }
    // }

    // populateBestWayToConnectDropdown(
    //   bestWayToConnectDropdown,
    //   additionalSummaryData.bestWayToConnect,
    // );
    populateDailyLifeDropdown(placeOnPathDropdown, additionalSummaryData.placeOnPath);

    return skillsDiv;
  }

  // KNOWN & LIKELY RISKS TABLES
  //--------------------------------------------------------------------
  function addRisksTableRow(data) {
    const sectionTitle = data.sectionTitle;
    const secTitle = sectionTitle.replaceAll(' ', '');
    const row = data.row;
    const riskSupervision = data.riskSupervision.answer;
    const whatIsRisk = data.whatIsRisk.answer;
    const whatSupportLooksLike = data.whatSupportLooksLike.answer;
    const whoResponsible = data.whoResponsible.answer;
    const whoResponsibleText = planData.getRelationshipNameById(whoResponsible);
    const levelOfSupervision = getLevelOfSupervisionById(riskSupervision);
    const questionSetId = data.questionSetId;
    const rowId = `planRisksTable${secTitle}${row}`;

    if (whoResponsible) {
      if (selectedVendors[whoResponsible]) {
        selectedVendors[whoResponsible] = selectedVendors[whoResponsible] + 1;
      } else {
        selectedVendors[whoResponsible] = 1;
      }
    }

    table.addRows(
      `planRisksTable${secTitle}`,
      [
        {
          id: rowId,
          values: [
            sectionTitle,
            whatIsRisk,
            whatSupportLooksLike,
            levelOfSupervision,
            whoResponsibleText,
          ],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: `${data.whatIsRisk.answerId}|${data.whatSupportLooksLike.answerId}|${data.riskSupervision.answerId}|${data.whoResponsible.answerId}`,
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planRisksTable${secTitle}`, '');
            showRisksTablePopup(
              {
                ...data,
                row: rowOrderFromID,
              },
              false,
              false,
            );
          },
          onCopyClick: e => {
            if (isReadOnly) return;

            showRisksTablePopup(
              {
                sectionTitle,
                row: '',
                questionSetId,
                whatIsRisk: {
                  answer: whatIsRisk,
                },
                whatSupportLooksLike: {
                  answer: whatSupportLooksLike,
                },
                riskSupervision: {
                  answer: riskSupervision,
                },
                whoResponsible: {
                  answer: whoResponsible,
                },
              },
              true,
              true,
            );
          },
        },
      ],
      isSortable,
    );
  }
  function updateRisksTableRow(data, oldData) {
    const sectionTitle = data.sectionTitle;
    const secTitle = sectionTitle.replaceAll(' ', '');
    const row = data.row;
    const riskSupervision = data.riskSupervision.answer;
    const whatIsRisk = data.whatIsRisk.answer;
    const whatSupportLooksLike = data.whatSupportLooksLike.answer;
    const whoResponsible = data.whoResponsible.answer;
    const whoResponsibleText = planData.getRelationshipNameById(whoResponsible);
    const levelOfSupervision = getLevelOfSupervisionById(riskSupervision);
    const questionSetId = data.questionSetId;
    const rowId = `planRisksTable${secTitle}${row}`;

    if (oldData.whoResponsible.answer !== whoResponsible) {
      // remove old
      if (oldData.whoResponsible.answer !== '') {
        if (selectedVendors[oldData.whoResponsible.answer] === 1) {
          delete selectedVendors[oldData.whoResponsible.answer];
        } else {
          selectedVendors[oldData.whoResponsible.answer] = selectedVendors[whoResponsible] - 1;
        }
      }
      // add new
      if (whoResponsible) {
        if (selectedVendors[whoResponsible]) {
          selectedVendors[whoResponsible] = selectedVendors[whoResponsible] + 1;
        } else {
          selectedVendors[whoResponsible] = 1;
        }
      }
    }

    table.updateRows(
      `planRisksTable${secTitle}`,
      [
        {
          id: rowId,
          values: [
            sectionTitle,
            whatIsRisk,
            whatSupportLooksLike,
            levelOfSupervision,
            whoResponsibleText,
          ],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: `${data.whatIsRisk.answerId}|${data.whatSupportLooksLike.answerId}|${data.riskSupervision.answerId}|${data.whoResponsible.answerId}`,
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planRisksTable${secTitle}`, '');
            showRisksTablePopup(
              {
                ...data,
                row: rowOrderFromID,
              },
              false,
              false,
            );
          },
          onCopyClick: e => {
            if (isReadOnly) return;
            showRisksTablePopup(
              {
                sectionTitle,
                row: '',
                questionSetId,
                whatIsRisk: {
                  answer: whatIsRisk,
                },
                whatSupportLooksLike: {
                  answer: whatSupportLooksLike,
                },
                riskSupervision: {
                  answer: riskSupervision,
                },
                whoResponsible: {
                  answer: whoResponsible,
                },
              },
              true,
              true,
            );
          },
        },
      ],
      isSortable,
    );
  }
  // markup
  //------------------
  function toggleRisksDoneBtn() {
    const inputsWithErrors = document.querySelector('.risksPopup .error');
    const doneBtn = document.querySelector('.risksPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showRisksTablePopup(popupData, isNew, isCopy) {
    let hasInitialErros;

    let dataCache = popupData;

    let sectionTitle = popupData.sectionTitle ? popupData.sectionTitle : '';
    let whatIsRisk = popupData.whatIsRisk ? popupData.whatIsRisk.answer : '';
    let whatSupportLooksLike = popupData.whatSupportLooksLike
      ? popupData.whatSupportLooksLike.answer
      : '';
    let riskSupervision = popupData.riskSupervision ? popupData.riskSupervision.answer : '';
    let whoResponsible = popupData.whoResponsible ? popupData.whoResponsible.answer : '';
    let row = popupData.row;

    if (!isNew) {
      whatIsRiskId = popupData.whatIsRisk.answerId;
      whatSupportLooksLikeId = popupData.whatSupportLooksLike.answerId;
      riskSupervisionId = popupData.riskSupervision.answerId;
      whoResponsibleId = popupData.whoResponsible.answerId;
    }

    const risksPopup = POPUP.build({
      header: isNew ? 'Add Risk' : 'Edit Risk',
      classNames: 'risksPopup',
      hideX: true,
    });

    // Assessment Area
    const assessmentAreaDropdown = dropdown.build({
      dropdownId: 'assessmentAreaDropdownSA',
      label: 'Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        sectionTitle = selectedOption.value;

        if (sectionTitle === '' || sectionTitle === '%') {
          assessmentAreaDropdown.classList.add('error');
        } else {
          assessmentAreaDropdown.classList.remove('error');
        }

        toggleRisksDoneBtn();
      },
    });
    if (!isNew) {
      assessmentAreaDropdown.classList.add('disabled');
    }
    // What is Risk
    const whatIsRiskTextarea = input.build({
      label: 'What is the risk, what it looks like, where it occurs',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: whatIsRisk,
      charLimit: charLimits.whatIsRisk,
      forceCharLimit: true,
      callback: e => {
        whatIsRisk = e.target.value;
        if (whatIsRisk === '') {
          whatIsRiskTextarea.classList.add('error');
        } else {
          whatIsRiskTextarea.classList.remove('error');
        }
        toggleRisksDoneBtn();
      },
    });
    whatIsRiskTextarea.classList.add('whatIsRiskTextarea');
    whatIsRiskTextarea.addEventListener('keyup', e => {
      whatIsRisk = e.target.value;
      if (whatIsRisk === '') {
        whatIsRiskTextarea.classList.add('error');
      } else {
        whatIsRiskTextarea.classList.remove('error');
      }
      toggleRisksDoneBtn();
    });
    // What Support Looks Like
    const whatSupportLooksLikeTextarea = input.build({
      label: 'What support must look like',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: whatSupportLooksLike,
      charLimit: charLimits.whatSupportLooksLike,
      forceCharLimit: true,
      callback: e => {
        whatSupportLooksLike = e.target.value;
        if (whatSupportLooksLike === '') {
          whatSupportLooksLikeTextarea.classList.add('error');
        } else {
          whatSupportLooksLikeTextarea.classList.remove('error');
        }
        toggleRisksDoneBtn();
      },
    });
    whatSupportLooksLikeTextarea.classList.add('whatSupportLooksLike');
    whatSupportLooksLikeTextarea.addEventListener('keyup', e => {
      whatSupportLooksLike = e.target.value;
      if (whatSupportLooksLike === '') {
        whatSupportLooksLikeTextarea.classList.add('error');
      } else {
        whatSupportLooksLikeTextarea.classList.remove('error');
      }
      toggleRisksDoneBtn();
    });
    // Levels of Supervision
    const levelsOfSupervisionDropdown = dropdown.build({
      dropdownId: 'levelsOfSupervisionDropdownSA',
      label: 'Levels Of Supervision',
      style: 'secondary',
      callback: (e, selectedOption) => {
        riskSupervision = selectedOption.value;
        if (riskSupervision === '%' || riskSupervision === '') {
          levelsOfSupervisionDropdown.classList.add('error');
        } else {
          levelsOfSupervisionDropdown.classList.remove('error');
        }
        toggleRisksDoneBtn();
      },
    });
    const whoResponsibleDropdown = dropdown.build({
      label: 'Who is Responsible',
      dropdownId: 'whoResponsibleDropdown',
      readonly: isReadOnly,
      callback: (e, selectedOption) => {
        whoResponsible = selectedOption.value;
        if (selectedOption === '') {
          whoResponsibleDropdown.classList.add('error');
        } else {
          whoResponsibleDropdown.classList.remove('error');
        }
        toggleRisksDoneBtn();
      },
    });

    const doneBtn = button.build({
      text: isCopy ? 'Save Copy' : isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');
        let questionSetId = questionSetIdMap['risksTableData'][sectionTitle];

        if (isNew) {
          const secTitle = sectionTitle.replaceAll(' ', '');
          let rowOrder = table.getRowCount(`planRisksTable${secTitle}`);
          const questionIds = questionIdMap['risksTableData'][sectionTitle];
          rowOrder = rowOrder + 1;
          const answerIds = await summaryAjax.insertAssessmentSummaryAnswers({
            token: $.session.Token,
            userId: $.session.UserId,
            anywAssessmentId: parseInt(planId),
            answerRow: [rowOrder, rowOrder, rowOrder, rowOrder],
            anywQuestionIds: [
              parseInt(questionIds.whatIsRisk),
              parseInt(questionIds.whatSupportLooksLike),
              parseInt(questionIds.riskSupervision),
              parseInt(questionIds.whoResponsible),
            ],
            answers: [
              UTIL.removeUnsavableNoteText(whatIsRisk),
              UTIL.removeUnsavableNoteText(whatSupportLooksLike),
              riskSupervision,
              UTIL.removeUnsavableNoteText(whoResponsible),
            ],
          });

          addRisksTableRow({
            sectionTitle,
            row: rowOrder,
            questionSetId,
            whatIsRisk: {
              answer: whatIsRisk,
              answerId: answerIds[questionIds.whatIsRisk],
            },
            whatSupportLooksLike: {
              answer: whatSupportLooksLike,
              answerId: answerIds[questionIds.whatSupportLooksLike],
            },
            riskSupervision: {
              answer: riskSupervision,
              answerId: answerIds[questionIds.riskSupervision],
            },
            whoResponsible: {
              answer: whoResponsible,
              answerId: answerIds[questionIds.whoResponsible],
            },
          });
        } else {
          await summaryAjax.updateAssessmentSummaryAnswers({
            token: $.session.Token,
            userId: $.session.UserId,
            anywAssessmentId: parseInt(planId),
            answerRow: [row, row, row, row],
            anywAnswerIds: [
              parseInt(whatIsRiskId),
              parseInt(whatSupportLooksLikeId),
              parseInt(riskSupervisionId),
              parseInt(whoResponsibleId),
            ],
            answers: [
              UTIL.removeUnsavableNoteText(whatIsRisk),
              UTIL.removeUnsavableNoteText(whatSupportLooksLike),
              riskSupervision,
              UTIL.removeUnsavableNoteText(whoResponsible),
            ],
          });

          updateRisksTableRow(
            {
              sectionTitle,
              row,
              questionSetId,
              whatIsRisk: {
                answer: whatIsRisk,
                answerId: whatIsRiskId,
              },
              whatSupportLooksLike: {
                answer: whatSupportLooksLike,
                answerId: whatSupportLooksLikeId,
              },
              riskSupervision: {
                answer: riskSupervision,
                answerId: riskSupervisionId,
              },
              whoResponsible: {
                answer: whoResponsible,
                answerId: whoResponsibleId,
              },
            },
            dataCache,
          );
        }

        doneBtn.classList.remove('disabled');
        POPUP.hide(risksPopup);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(risksPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: async () => {
        const message = 'Do you want to delete this entry?';
        ISP.showDeleteWarning(risksPopup, message, async () => {
          const secTitle = sectionTitle.replaceAll(' ', '');
          let rowCount = table.getRowCount(`planRisksTable${secTitle}`);
          const setId = questionSetIdMap['risksTableData'][sectionTitle];

          if (rowCount > 1) {
            deleteTableRow(setId, row, `planRisksTable${secTitle}${row}`);
          } else {
            whatIsRisk = '';
            whatSupportLooksLike = '';
            riskSupervision = '';
            whoResponsible = '';

            await summaryAjax.updateAssessmentSummaryAnswers({
              token: $.session.Token,
              userId: $.session.UserId,
              anywAssessmentId: parseInt(planId),
              answerRow: [row, row, row, row],
              anywAnswerIds: [
                parseInt(whatIsRiskId),
                parseInt(whatSupportLooksLikeId),
                parseInt(riskSupervisionId),
                parseInt(whoResponsibleId),
              ],
              answers: [whatIsRisk, whatSupportLooksLike, riskSupervision, whoResponsible],
            });

            updateRisksTableRow({
              sectionTitle,
              row,
              questionSetId: setId,
              whatIsRisk: {
                answer: whatIsRisk,
                answerId: whatIsRiskId,
              },
              whatSupportLooksLike: {
                answer: whatSupportLooksLike,
                answerId: whatSupportLooksLikeId,
              },
              riskSupervision: {
                answer: riskSupervision,
                answerId: riskSupervisionId,
              },
              whoResponsible: {
                answer: whoResponsible,
                answerId: whoResponsibleId,
              },
            });
          }
        });
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (sectionTitle === '' || sectionTitle === '%') {
      assessmentAreaDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (whatIsRisk === '') {
      whatIsRiskTextarea.classList.add('error');
      hasInitialErros = true;
    }
    if (whatSupportLooksLike === '') {
      whatSupportLooksLikeTextarea.classList.add('error');
      hasInitialErros = true;
    }
    if (whoResponsible === '') {
      whoResponsibleDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (riskSupervision === '') {
      levelsOfSupervisionDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      whatIsRiskTextarea.classList.add('disabled');
      whatSupportLooksLikeTextarea.classList.add('disabled');
      levelsOfSupervisionDropdown.classList.add('disabled');
      whoResponsibleDropdown.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    risksPopup.appendChild(assessmentAreaDropdown);
    risksPopup.appendChild(whatIsRiskTextarea);
    risksPopup.appendChild(whatSupportLooksLikeTextarea);
    risksPopup.appendChild(levelsOfSupervisionDropdown);
    risksPopup.appendChild(whoResponsibleDropdown);
    risksPopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, sectionTitle);
    populateLevelsOfSupervisionDropdown(levelsOfSupervisionDropdown, riskSupervision);
    planData.populateRelationshipDropdown(
      whoResponsibleDropdown,
      whoResponsible,
      (includeSupports = true),
    );

    POPUP.show(risksPopup);
    DOM.autosizeTextarea();
  }
  function buildRisksTableBySection(data) {
    let tableData = [];

    const secTitle = Object.keys(data)[0].replaceAll(' ', '');

    const risksTable = table.build({
      tableId: `planRisksTable${secTitle}`,
      columnHeadings: [
        'Assessment Area',
        'What is the risk, what it looks like, where it occurs',
        'What support must look like, why the person needs this support',
        'Does this risk require supervision?',
        'Who is responsible',
      ],
      sortable: isSortable,
      onSortCallback: evt => {
        updateRowOrder(evt);
      },
      allowCopy: true,
    });

    Object.entries(data).forEach(([sectionTitle, rowData]) => {
      Object.entries(rowData).forEach(([rowId, val]) => {
        const riskSupervision = val.riskSupervision.answer;
        const whatIsRisk = val.whatIsRisk.answer;
        const whatSupportLooksLike = val.whatSupportLooksLike.answer;
        const whoResponsible = val.whoResponsible.answer;
        const whoResponsibleText = planData.getRelationshipNameById(whoResponsible);
        const levelOfSupervision = getLevelOfSupervisionById(riskSupervision);
        const secTitle = sectionTitle.replaceAll(' ', '');
        const questionSetId = val.whatIsRisk.questionSetId;

        if (whoResponsible) {
          if (selectedVendors[whoResponsible]) {
            selectedVendors[whoResponsible] = selectedVendors[whoResponsible] + 1;
          } else {
            selectedVendors[whoResponsible] = 1;
          }
        }

        const isRowEmpty = [
          whatIsRisk,
          whatSupportLooksLike,
          riskSupervision,
          whoResponsible,
        ].every(e => e === '');

        tableData.push({
          id: `planRisksTable${secTitle}${rowId}`,
          values: [
            sectionTitle,
            whatIsRisk,
            whatSupportLooksLike,
            levelOfSupervision,
            whoResponsibleText,
          ],
          attributes: [
            { key: 'data-questionSetId', value: questionSetId },
            {
              key: 'data-answerIds',
              value: `${val.whatIsRisk.answerId}|${val.whatSupportLooksLike.answerId}|${val.riskSupervision.answerId}|${val.whoResponsible.answerId}`,
            },
          ],
          onClick: e => {
            const rowOrderFromID = e.target.id.replace(`planRisksTable${secTitle}`, '');
            showRisksTablePopup(
              {
                sectionTitle,
                row: rowOrderFromID,
                questionSetId,
                whatIsRisk: {
                  answer: whatIsRisk,
                  answerId: val.whatIsRisk.answerId,
                },
                whatSupportLooksLike: {
                  answer: whatSupportLooksLike,
                  answerId: val.whatSupportLooksLike.answerId,
                },
                riskSupervision: {
                  answer: riskSupervision,
                  answerId: val.riskSupervision.answerId,
                },
                whoResponsible: {
                  answer: whoResponsible,
                  answerId: val.whoResponsible.answerId,
                },
              },
              false,
              false,
            );
          },
          onCopyClick: isRowEmpty
            ? false
            : e => {
                if (isRowEmpty || isReadOnly) return;

                showRisksTablePopup(
                  {
                    sectionTitle,
                    row: '',
                    questionSetId,
                    whatIsRisk: {
                      answer: whatIsRisk,
                    },
                    whatSupportLooksLike: {
                      answer: whatSupportLooksLike,
                    },
                    riskSupervision: {
                      answer: riskSupervision,
                    },
                    whoResponsible: {
                      answer: whoResponsible,
                    },
                  },
                  true,
                  true,
                );
              },
        });
      });
    });

    table.populate(risksTable, tableData, isSortable);

    return risksTable;
  }
  function buildDropdownLegend() {
    const legend = document.createElement('div');
    legend.classList.add('riskSupervisionDropdownLegend');

    legend.innerHTML = `
      <h4>Levels of Supervision and Definitions:</h4>
      <ul>
        <li>1. <span>No Paid Supports</span> The person can be alone and does not require any paid/remote support to ensure safety.</li>
        <li>2. <span>General</span> Staff must be able to hear/contact the person if they called for help, and respond within a few minutes.</li>
        <li>3. <span>Auditory</span> Staff must be able to hear the person if they called for help and respond quickly.</li>
        <li>4. <span>Visual</span> Staff must be able to see the person and be able to provide support or direction.</li>
        <li>5. <span>Close & Constant</span> Staff may never leave the person, and must always be able to respond immediately.</li>
        <li>6. <span>Technology</span> Describe technology solutions in conjunction with 1 - 5.</li>
      </ul>
    `;

    return legend;
  }
  function getRisksTablesMarkup(risksTableData) {
    const risksWrap = document.createElement('div');
    risksWrap.classList.add('risksWrap');

    const heading = document.createElement('h3');
    heading.innerHTML = `Known & Likely Risks: <span>Include any MUI trends and preventative measures</span>`;
    risksWrap.appendChild(heading);

    const dropdownLegend = buildDropdownLegend();
    risksWrap.appendChild(dropdownLegend);

    const risksDiv = document.createElement('div');
    risksDiv.classList.add('risksTablesWrap');

    const a = assessment.getApplicableSections();

    if (risksTableData) {
      Object.entries(sectionOrderMap).forEach(([key, val], index) => {
        if (a[sectionIdMap[val]]) {
          const tableData = risksTableData[val];
          const risksTable = buildRisksTableBySection({ [val]: tableData });
          if (index === 0) risksTable.classList.add('main');
          risksDiv.appendChild(risksTable);
        }
      });
    }

    const addRowBtn = button.build({
      text: 'Add Known & Likely Risk',
      style: 'secondary',
      type: 'contained',
      callback: () => showRisksTablePopup({}, true, false),
    });
    if (isReadOnly) addRowBtn.classList.add('disabled');

    risksDiv.appendChild(addRowBtn);
    risksWrap.appendChild(risksDiv);

    return risksWrap;
  }

  function checkForPaidSupports(numOfPaidSupports) {
    hasPaidSupports = numOfPaidSupports > 0;
    if (hasPaidSupports) {
      if (additionalSummaryData.aloneTimeAmount === '') {
        amountOfTimeQuestion.classList.add('error');
      }
      if (additionalSummaryData.providerBackUp === '') {
        backupPlanQuestion.classList.add('error');
      }
    } else {
      amountOfTimeQuestion.classList.remove('error');
      backupPlanQuestion.classList.remove('error');
    }
  }
  function getAdditionalSummaryQuestionMarkup() {
    const additionalQuestionDiv = document.createElement('div');
    additionalQuestionDiv.classList.add('additionalQuestionWrap');

    hasPaidSupports = servicesSupports.getHasPaidSupports();

    // Amount of time person can be left alone
    const amountOfTimeWrap = document.createElement('div');
    const amountOfTimePrompt = document.createElement('p');
    amountOfTimePrompt.innerText = 'Amount of time the person can safely be alone';

    amountOfTimeQuestion = input.build({
      id: 'amountOfTime',
      value: additionalSummaryData.aloneTimeAmount,
      type: 'textarea',
      charLimit: charLimits.aloneTime,
      forceCharLimit: true,
      classNames: 'autosize',
      onBlurCallback: event => {
        additionalSummaryData.aloneTimeAmount = event.target.value;
        if (hasPaidSupports) {
          if (additionalSummaryData.aloneTimeAmount === '') {
            amountOfTimeQuestion.classList.add('error');
          } else amountOfTimeQuestion.classList.remove('error');
        } else amountOfTimeQuestion.classList.remove('error');
        const submitData = {
          anywAssessmentId: planId,
          aloneTimeAmount: UTIL.removeUnsavableNoteText(additionalSummaryData.aloneTimeAmount),
          providerBackUp: UTIL.removeUnsavableNoteText(additionalSummaryData.providerBackUp),
        };
        summaryAjax.updateAdditionalAssessmentSummaryAnswers(submitData);
      },
    });
    amountOfTimeQuestion.addEventListener('keyup', e => {
      if (hasPaidSupports) {
        if (e.target.value === '') {
          amountOfTimeQuestion.classList.add('error');
        } else amountOfTimeQuestion.classList.remove('error');
      } else {
        amountOfTimeQuestion.classList.remove('error');
      }
    });
    amountOfTimeWrap.appendChild(amountOfTimePrompt);
    amountOfTimeWrap.appendChild(amountOfTimeQuestion);

    // Provide back-up plan
    const backupPlanWrap = document.createElement('div');
    const backupPlanPrompt = document.createElement('p');
    backupPlanPrompt.innerText = 'Provider Back-up Plan';

    backupPlanQuestion = input.build({
      id: 'backupPlan',
      type: 'textarea',
      value: additionalSummaryData.providerBackUp,
      charLimit: 10000,
      classNames: 'autosize',
      forceCharLimit: true,
      onBlurCallback: event => {
        additionalSummaryData.providerBackUp = event.target.value;
        if (hasPaidSupports) {
          if (additionalSummaryData.providerBackUp === '') {
            backupPlanQuestion.classList.add('error');
          } else backupPlanQuestion.classList.remove('error');
        } else {
          backupPlanQuestion.classList.remove('error');
        }
        const submitData = {
          anywAssessmentId: planId,
          aloneTimeAmount: UTIL.removeUnsavableNoteText(additionalSummaryData.aloneTimeAmount),
          providerBackUp: UTIL.removeUnsavableNoteText(additionalSummaryData.providerBackUp),
        };
        summaryAjax.updateAdditionalAssessmentSummaryAnswers(submitData);
      },
    });
    backupPlanQuestion.addEventListener('keyup', e => {
      if (hasPaidSupports) {
        if (e.target.value === '') {
          backupPlanQuestion.classList.add('error');
        } else backupPlanQuestion.classList.remove('error');
      } else {
        backupPlanQuestion.classList.remove('error');
      }
    });

    backupPlanWrap.appendChild(backupPlanPrompt);
    backupPlanWrap.appendChild(backupPlanQuestion);

    additionalQuestionDiv.appendChild(amountOfTimeWrap);
    additionalQuestionDiv.appendChild(backupPlanWrap);

    if (hasPaidSupports && !isReadOnly) {
      if (additionalSummaryData.aloneTimeAmount === '') {
        amountOfTimeQuestion.classList.add('error');
      }
      if (additionalSummaryData.providerBackUp === '') {
        backupPlanQuestion.classList.add('error');
      }
    }

    if (isReadOnly) {
      amountOfTimeQuestion.classList.add('disabled');
      backupPlanQuestion.classList.add('disabled');
    }

    return additionalQuestionDiv;
  }
  function getMarkup() {
    const summaryWrap = document.createElement('div');
    summaryWrap.classList.add('planSummary');

    const heading = document.createElement('h2');
    heading.innerHTML = 'Discovery Assessment Summary';
    heading.classList.add('sectionHeading');

    const importantTables = getImportantTablesMarkup(summaryData.importantTableData);
    const skillsTables = getSkillsTablesMarkup(summaryData.skillsTableData);
    const risksTables = getRisksTablesMarkup(summaryData.risksTableData);
    const additionalSummaryMarkup = getAdditionalSummaryQuestionMarkup();

    summaryWrap.appendChild(heading);
    summaryWrap.appendChild(importantTables);
    summaryWrap.appendChild(skillsTables);
    summaryWrap.appendChild(risksTables);
    summaryWrap.appendChild(additionalSummaryMarkup);

    return summaryWrap;
  }

  async function init(data) {
    // data = { planId, readOnly }
    planId = data.planId;
    isReadOnly = data.readOnly;
    charLimits = planData.getISPCharacterLimits('summary');

    if (!$.session.planUpdate) {
      isSortable = false;
    } else {
      isSortable = isReadOnly ? false : true;
    }

    dropdownData = planData.getDropdownData();

    const SummaryData = await summaryAjax.getAssessmentSummaryQuestions({
      token: $.session.Token,
      anywAssessmentId: planId,
    });

    const AdditionalSummaryData = await summaryAjax.getAdditionalAssessmentSummaryQuestions({
      anywAssessmentId: planId,
    });

    if (AdditionalSummaryData) {
      if (AdditionalSummaryData.length > 0) {
        additionalSummaryData = { ...AdditionalSummaryData[0] };

        if (additionalSummaryData.placeOnPath === '' || additionalSummaryData.placeOnPath === '0') {
          additionalSummaryData.placeOnPath = '%';
        }
        if (
          additionalSummaryData.bestWayToConnect === '' ||
          additionalSummaryData.bestWayToConnect === '0'
        ) {
          additionalSummaryData.bestWayToConnect = '%';
        }
      }
    } else {
      additionalSummaryData = {
        aloneTimeAmount: '',
        providerBackUp: '',
        moreDetail: '',
        placeOnPath: '%',
        bestWayToConnect: '%',
      };
    }

    const mappedSummaryData = mapSummaryData(SummaryData);
    summaryData = mappedSummaryData;
  }

  return {
    init,
    getMarkup,
    checkForPaidSupports,
    refreshDropdownData,
    getSelectedVendors,
  };
})();
