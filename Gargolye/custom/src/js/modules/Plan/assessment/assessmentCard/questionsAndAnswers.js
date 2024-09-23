const mainAssessment = (function () {
  const customSectionIds = [];

  // DOM
  let assessmentWrap;
  // DATA
  let sections;
  let subSections;
  let questionSectionSets;
  let questionSubSectionSets;
  let sectionQuestionCount;
  let assessmentId;
  let subSectionsWithAttachments;
  let additionalSummaryData;
  // dropdowns
  let assessmentDropdownData;
  let colNameDropdownMap = {
    AssessmentArea: 'assessmentAreas',
    ProviderName: 'serviceVendors',
    ServiceName: 'serviceTypes',
    FundingSource: 'fundingSource',
    NewOrExisting: 'newOrExisting',
    'WhoSaidIt?': 'relationships',
  };

  let charLimits = {};
  let deleteRowsActive = false;
  let selectedRow;
  let isSortable;
  let readonly;
  let hideOrShowStatus;

  const observerCallback = entries => {
    console.log(`Observer callback fired.`);
    entries.forEach(entry => {
      console.log(`Observing entry ${entry.target.id}`);
      if (entry.isIntersecting) {
        if (!entry.target.classList.contains('nonApplicable')) {
          const sectionId = entry.target.id;
          console.log(`${sectionId} is in view`);
          tableOfContents.highlightLink(sectionId.replace('section', ''));
        }
      }
    });
  };

  if (!('IntersectionObserver' in window)) {
    alert('Intersection Observer API is not available')
  }

  const observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '50px 0px 50px 0px',
    threshold: 0.12,
  });

  function checkArrayConsistency(arr) {
    if (arr.length === 0) {
      return 'noMatch'; // or you can return null or undefined based on your use case
    }

    const firstElement = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] !== firstElement) {
        return 'noMatch';
      }
    }

    return firstElement;
  }
  function updateRowOrderAfterDelete(grid, questionSetId) {
    // grab all rows inside grid after delete
    const gridBody = grid.querySelector('.grid__body');
    const rows = [...gridBody.querySelectorAll('.grid__row')];
    rows.forEach((row, i) => {
      const order = parseInt(row.id.replaceAll('roworder', ''));
      // check row for gap in order
      if (order !== i + 1) {
        // grab inputs to gather answerIds
        const inputs = [...row.querySelectorAll('.input-field__input')];
        let answerIds = inputs.map(input => input.id);
        answerIds = answerIds.join('|');
        // update the row order in DB
        //assessmentAjax.updateAssessmentAnswerRowOrder({
        //  ///
        //  token: $.session.Token,
        //  assessmentId: parseInt(assessmentId),
        //  questionSetId: parseInt(questionSetId),
        //  answerIds: answerIds,
        //  newPos: parseInt(i + 1),
        //  oldPos: parseInt(order),
        //});
        // update row id
        row.id = `roworder${i + 1}`;
      }
      // if no gap do nothing
    });
  }

  // Utils
  //------------------------------------
  async function addAnswer(id, answer, answerRow, skipped) {
    assessmentAjax.updateConsumerAssessmentAnswer({
      answerId: id,
      answerText: answer ? answer : '',
      answerRow: answerRow ? answerRow : '',
      skipped: skipped ? skipped : 'N',
    });
  }
  function clearData() {
    sections = {};
    subSections = {};
    questionSectionSets = {};
    questionSubSectionSets = {};
    sectionQuestionCount = {};
    subSectionsWithAttachments = [];
  }
  function getSectionQuestionCount() {
    return sectionQuestionCount;
  }
  function relationshipDropdownData() {
    const data = planData.getDropdownData().relationships.map(dd => {
      return {
        id: dd.contactId,
        text: `${dd.lastName}, ${dd.firstName}`,
      };
    });

    data.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    const removeDups = data => {
      const flag = {};
      const unique = [];
      data.forEach(el => {
        if (!flag[el.id]) {
          flag[el.id] = true;
          unique.push(el);
        }
      });
      return unique;
    };
    return removeDups(data);
  }
  function toggleIntentionallyBlankCheckbox(answerId, setID, disable) {
    let checkbox = document.getElementById(`intentionallyBlankCheckbox${answerId}`);
    checkbox = checkbox ? checkbox : document.getElementById(`intentionallyBlankCheckbox${setID}`);
    if (!checkbox) return;

    if (disable) {
      input.disableInputField(checkbox.parentElement);
    } else {
      input.enableInputField(checkbox.parentElement);
    }
  }
  // Conditional Questions
  function toggleConditionalQuestion(answer, type, conditionalQuestions) {
    if (conditionalQuestions.length === 1) {
      const questionId = conditionalQuestions[0].questionId;

      const question = document.getElementById(`question${questionId}`);
      const section = question.closest('.assessment__section');
      const questionSet = question.closest('.questionSet');
      const inputWrap = question.querySelector('.input-field');
      const inputEle = question.querySelector('.input-field__input');

      // check for radios
      if (!inputWrap) inputWrap = question.querySelector('.radioWrap');
      if (!inputEle) inputEle = question.querySelector('input');

      const sectionId = section.id.replace('section', '');
      const setId = questionSet.id.replace('set', '');
      const answerId = inputEle.id;

      if (conditionalQuestions[0].conditionalAnswerText !== answer) {
        sectionQuestionCount[sectionId][setId][questionId].answered = false;
        sectionQuestionCount[sectionId][setId][questionId].required = false;
        input.disableInputField(inputWrap);
        if (type === 'checkbox') {
          inputEle.checked = false;
        } else {
          inputEle.value = '';
          const radios = [...inputWrap.querySelectorAll('input')];
          if (radios.length !== 0) {
            radios.forEach(radio => (radio.checked = false));
          }
        }
        addAnswer(answerId);
      } else {
        input.enableInputField(inputWrap);
        sectionQuestionCount[sectionId][setId][questionId].answered = false;
        sectionQuestionCount[sectionId][setId][questionId].required = true;
      }
    } else {
      conditionalQuestions.forEach(q => {
        const { questionId, conditionalAnswerText } = q;

        const question = document.getElementById(`question${questionId}`);
        const section = question.closest('.assessment__section');
        const questionSet = question.closest('.questionSet');
        let inputWrap = question.querySelector('.input-field');
        let inputEle = question.querySelector('.input-field__input');

        // check for radios
        if (!inputWrap) inputWrap = question.querySelector('.radioWrap');
        if (!inputEle) inputEle = question.querySelector('input');

        const sectionId = section.id.replace('section', '');
        const setId = questionSet.id.replace('set', '');
        const answerId = inputEle.id;

        if (conditionalAnswerText !== answer) {
          sectionQuestionCount[sectionId][setId][questionId].answered = false;
          sectionQuestionCount[sectionId][setId][questionId].required = false;
          input.disableInputField(inputWrap);
          if (type === 'checkbox') {
            inputEle.checked = false;
          } else {
            inputEle.value = '';
            const radios = [...inputWrap.querySelectorAll('input')];
            if (radios.length !== 0) {
              radios.forEach(radio => (radio.checked = false));
            }
          }

          addAnswer(answerId);
        } else {
          input.enableInputField(inputWrap);
          sectionQuestionCount[sectionId][setId][questionId].answered = false;
          sectionQuestionCount[sectionId][setId][questionId].required = true;
        }
      });
    }

    markUnansweredQuestions();
  }
  // Unanswered Questions
  function markUnansweredQuestions() {
    const sectionKeys = Object.keys(sectionQuestionCount);

    sectionKeys.forEach(sectionKey => {
      const questionSetKeys = Object.keys(sectionQuestionCount[sectionKey]);
      let tableQuestionSets;

      questionSetKeys.forEach(questionSetKey => {
        const questionKeys = Object.keys(sectionQuestionCount[sectionKey][questionSetKey]);

        questionKeys.forEach(questionKey => {
          const { answered, required, rowOrder, leaveblank } =
            sectionQuestionCount[sectionKey][questionSetKey][questionKey];
          let questionDiv;

          if (!rowOrder) {
            // Text, Textarea, Checkbox, Radio Questions
            questionDiv = document.getElementById(`question${questionKey}`);
            if (!questionDiv) return;
            if (answered && required) questionDiv.classList.remove('unawnsered');
            if (!answered && required) questionDiv.classList.add('unawnsered');
            if (!answered && required && !leaveblank) questionDiv.classList.add('unawnsered');

            if (!required) questionDiv.classList.remove('unawnsered');
          } else {
            // Table Questions
            if (!tableQuestionSets) tableQuestionSets = {};
            if (!tableQuestionSets[questionSetKey]) tableQuestionSets[questionSetKey] = {};
            if (!tableQuestionSets[questionSetKey][rowOrder]) {
              questionDiv = document.getElementById(`question${questionKey}`);
              if (!questionDiv) return;
              const rowElement = questionDiv.closest('.grid__row');

              tableQuestionSets[questionSetKey][rowOrder] = {
                atLeastOneColumnAnswered: false,
                rowElement,
              };
            }
            if (answered || leaveblank) tableQuestionSets[questionSetKey][rowOrder].atLeastOneColumnAnswered = true;
          }
        });

        if (tableQuestionSets) {
          const tableQuestionSetsKeys = Object.keys(tableQuestionSets);
          if (tableQuestionSetsKeys.length > 0) {
            tableQuestionSetsKeys.forEach(setKey => {
              let tableHasAtLeastOneRowAnsered = false;
              let tableElement;

              const rowOrderKeys = Object.keys(tableQuestionSets[setKey]);
              rowOrderKeys.forEach((rowOrderKey, index) => {
                if (index === 0) {
                  tableElement = tableQuestionSets[setKey][rowOrderKey].rowElement.closest('.grid');
                }

                if (tableQuestionSets[setKey][rowOrderKey].atLeastOneColumnAnswered) {
                  tableQuestionSets[setKey][rowOrderKey].rowElement.classList.remove('unawnsered');
                  tableHasAtLeastOneRowAnsered = true;
                } else {
                  tableQuestionSets[setKey][rowOrderKey].rowElement.classList.add('unawnsered');
                }
              });

              if (!tableHasAtLeastOneRowAnsered) {
                tableElement.classList.add('unawnsered');
                tableElement.classList.remove('awnsered');
              } else {
                tableElement.classList.remove('unawnsered');
                tableElement.classList.add('awnsered');
              }
            });
          }
        }
      });
    });

    tableOfContents.showUnansweredQuestionCount();
  }
  function toggleUnansweredQuestionFilter(hideOrShow) {
    hideOrShowStatus = hideOrShow;

    const awnseredQuestions = [...document.querySelectorAll('.question:not(.unawnsered)')];
    const awnseredTables = [...document.querySelectorAll('.grid:not(.unawnsered)')];

    awnseredQuestions.forEach(q => {
      if (!q.classList.contains('intentionallyDisabled')) return;

      if (hideOrShow === 'hide') {
        q.style.display = 'none';
      } else {
        q.removeAttribute('style');
      }
    });

    awnseredTables.forEach(t => {
      if (t.classList.contains('unawnsered') && !t.classList.contains('intentionallyDisabled')) return;

      if (hideOrShow === 'hide') {
        t.style.display = 'none';
      } else {
        t.removeAttribute('style');
      }
    });
  }
  // Events
  async function handleAssessmentChangeEvents(e) {
    if (e.target.id.includes('applicable')) {
      let target = e.target.id;
      let sectionID = target.match(/\d+/)[0];
      let applied = e.target.checked ? 'Y' : 'N';

      planValidation.updateSectionApplicability(sectionID, applied);

      return;
    }
    if (e.target.id.includes('intentionallyBlankCheckbox')) {
      const isChecked = e.target.checked;
      const skipped = isChecked ? 'Y' : 'N';
      const isForRow = e.target.dataset.isforrow;
      
      let answerId = e.target.dataset.answerid;
      let questionId = e.target.dataset.questionid;
      let setId = e.target.dataset.setid;
      let sectionID = e.target.dataset.sectionid;

      if (isForRow === 'false') {
        addAnswer(answerId, '', '', skipped);

        const textAreaInput = document.getElementById(answerId);
        if (isChecked) {
          textAreaInput.value = '';
          input.disableInputField(textAreaInput);
          textAreaInput.parentNode.closest('.question').classList.add('intentionallyDisabled');
          sectionQuestionCount[sectionID][setId][questionId].leaveblank = true;
        } else {
          input.enableInputField(textAreaInput);
          textAreaInput.parentNode.closest('.question').classList.remove('intentionallyDisabled');
          sectionQuestionCount[sectionID][setId][questionId].leaveblank = false;
        }
      } else {
        const questionSet = document.getElementById(`set${setId}`);
        let sectionID = questionSet.parentElement.parentElement.id;
        sectionID = sectionID.replace(/\D/g, '');
        const questionSetGridRows = [...questionSet.querySelectorAll('.grid__row:not(.grid__rowHeader)')];
        const questionSetActionButtons = [...questionSet.querySelectorAll('.gridActionRow button')];
        let questionSetId = e.target.dataset.setid;

        const grid = questionSet.querySelector('.grid');
        if (isChecked) {
          grid.classList.add('intentionallyDisabled');
        } else {
          grid.classList.remove('intentionallyDisabled');
        }

        questionSetGridRows.forEach(row => {
          const rowCells = row.querySelectorAll('.grid__cell');

          rowCells.forEach(cell => {
            const cellInput = cell.querySelector('.input-field__input');
            let questionRowId = cell.id;
            questionRowId = questionRowId.replace(/\D/g, '');

            addAnswer(cellInput.id, '', '', skipped);

            if (isChecked) {
              cellInput.value = '';
              input.disableInputField(cellInput);
              sectionQuestionCount[sectionID][questionSetId][questionRowId].leaveblank = true;
            } else {
              input.enableInputField(cellInput);
              sectionQuestionCount[sectionID][questionSetId][questionRowId].leaveblank = false;
            }
          });
        });
        questionSetActionButtons.forEach(btn => {
          if (e.target.checked) {
            btn.classList.add('disabled');
          } else {
            btn.classList.remove('disabled');
          }
        });
      }

      if (hideOrShowStatus === 'hide') {
        toggleUnansweredQuestionFilter(hideOrShowStatus);
      }
      
      tableOfContents.showUnansweredQuestionCount();

      return;
    }

    const tagName = e.target.tagName;
    const type = e.target.type;

    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
      let questionDiv = e.target.closest('.question');
      if (!questionDiv) questionDiv = e.target.closest('.grid__cell');

      let sectionDiv;
      let questionSetDiv;
      let sectionId;
      let setId;
      let questionId;
      let conditionalQuestions;

      if (questionDiv) {
        sectionDiv = e.target.closest('.assessment__section');
        sectionId = sectionDiv.id.replace('section', '');

        const isCustomSection = customSectionIds.includes(sectionId);
        if (isCustomSection) return;

        questionSetDiv = e.target.closest('.questionSet');
        setId = questionSetDiv.id.replace('set', '');
        questionId = questionDiv ? questionDiv.id.replace('question', '') : null;
        conditionalQuestions = questionId ? assessment.getConditionalQuestions(questionId) : null;
      }

      const answerId = e.target.id;

      let answer;

      if (type === 'checkbox') {
        answer = e.target.checked === true ? '1' : '0';
        addAnswer(answerId, answer);
        sectionQuestionCount[sectionId][setId][questionId].answered = e.target.checked === true ? true : false;

        const questionIdCategory = planValidation.findQuestionIdCategory(questionId);

        let assessmentValidationCheck = planValidation.returnAssessmentValidationData();

        if (questionIdCategory !== 'Variable not found in the object' && questionIdCategory !== 'noSupport') {
          planValidation.updateAssessmentValidationProperty(sectionId, questionIdCategory, e.target.checked);
        }

        if (questionIdCategory === 'noSupport') {
          planValidation.updateAssessmentValidationProperty(sectionId, 'noSupport', true);

          for (const key in assessmentValidationCheck.servicesAndSupportsChecked[sectionId]) {
            if (key !== 'noSupport') {
              planValidation.updateAssessmentValidationProperty(sectionId, key, false);
            }
          }
        }

        // checks the status of the buttons and adds/removes error class if needed for specific section
        planValidation.servicesAndSupportsBtnCheck(sectionId);

        // checks entire assessments for validation errors
        planValidation.updatedAssessmenteValidation();
      }
      if (type === 'radio') {
        const radioLabelText = e.target.nextSibling.innerHTML;
        answer = radioLabelText === 'yes' ? '1' : '0';
        addAnswer(answerId, answer);
        sectionQuestionCount[sectionId][setId][questionId].answered = true;
      }
      if (type === 'text' || type === 'textarea') {
        answer = e.target.value;

        if (answer !== '') {
          await addAnswer(answerId, answer);

          if (!conditionalQuestions || conditionalQuestions.length === 0) {
            if (!sectionQuestionCount[sectionId][setId][questionId]) return;
            sectionQuestionCount[sectionId][setId][questionId].answered = true;
          }
        } else {
          await addAnswer(answerId);

          if (!conditionalQuestions || conditionalQuestions.length === 0) {
            if (!sectionQuestionCount[sectionId][setId][questionId]) return;
            sectionQuestionCount[sectionId][setId][questionId].answered = false;
          }
        }

        if (sectionId === '41') {
          await planValidation.updateAnswerWorkingSection(assessmentId);
          tableOfContents.showUnansweredQuestionCount();
        }
      }
      if (type === 'select-one') {
        if (e.target.id === 'pathDropdown') return;

        const selectedOption = e.target.options[e.target.selectedIndex];
        answer = selectedOption.value;

        if (answer !== '') {
          addAnswer(answerId, answer);
          if (!conditionalQuestions || conditionalQuestions.length === 0) {
            if (!sectionQuestionCount[sectionId][setId][questionId]) return;
            sectionQuestionCount[sectionId][setId][questionId].answered = true;
          }

          planValidation.updateAnswerWorkingSection(assessmentId);
        } else {
          addAnswer(answerId);
          if (!conditionalQuestions || conditionalQuestions.length === 0) {
            if (!sectionQuestionCount[sectionId][setId][questionId]) return;
            sectionQuestionCount[sectionId][setId][questionId].answered = false;
          }

          planValidation.updateAnswerWorkingSection(assessmentId);
        }
      }
      if (type === 'date') {
        answer = e.target.value;

        if (answer !== '') {
          addAnswer(answerId, answer);
        } else {
          addAnswer(answerId);
        }
      }

      if (conditionalQuestions && conditionalQuestions.length > 0) {
        toggleConditionalQuestion(answer, type, conditionalQuestions);
        return;
      }

      markUnansweredQuestions();

      if (type === 'textarea') {
        if (!questionSetDiv.classList.contains('questionSet__grid')) {
          const hideCheckbox = answer !== '' ? true : false;
          toggleIntentionallyBlankCheckbox(answerId, setId, hideCheckbox);
        } else {
          const setGrid = questionSetDiv.querySelector('.grid');
          if (setGrid.classList.contains('awnsered')) {
            toggleIntentionallyBlankCheckbox(answerId, setId, true);
          } else {
            toggleIntentionallyBlankCheckbox(answerId, setId, false);
          }
        }
      }

      tableOfContents.showUnansweredQuestionCount();

      return;
    }
  }

  // Sections
  //------------------------------------
  function addSection({ order, title, id, applicable, isAssessment }) {
    const isCustomSection = customSectionIds.includes(id);
    let markup;

    if (!isCustomSection) {
      markup = buildSectionMarkup({ title, id, applicable, isAssessment });
    }

    if (!sections[order]) sections[order] = { id, markup };
  }
  function buildSectionMarkup({ title, id, applicable, isAssessment }) {
    const section = document.createElement('div');
    section.classList.add('assessment__section');
    section.id = `section${id}`;

    const sectionHeading = document.createElement('div');
    sectionHeading.classList.add('sectionHeading');
    sectionHeading.id = `sec${id}`;

    const sectionHeadingInner = document.createElement('div');
    sectionHeadingInner.classList.add('sectionHeading__inner');

    const applicableCheckbox = input.buildNativeCheckbox({
      id: `applicable${id}`,
      isChecked: applicable,
      isDisabled: false,
      className: 'applicableCheckbox',
      callback: e => {
        if (e.target.checked) {
          section.classList.remove('nonApplicable');
        } else {
          section.classList.add('nonApplicable');
        }

        assessment.toggleIsSectionApplicable(id, e.target.checked);
      },
    });

    if (readonly || !$.session.planUpdate) {
      input.disableInputField(applicableCheckbox);
    }

    const sectionTitle = document.createElement('h2');
    sectionTitle.innerText = title;

    if (isAssessment === 'Y') {
      sectionHeadingInner.appendChild(applicableCheckbox);
      if (!applicable) {
        section.classList.add('nonApplicable');
      }
    }

    sectionHeadingInner.appendChild(sectionTitle);
    sectionHeading.appendChild(sectionHeadingInner);
    section.appendChild(sectionHeading);

    if (title === 'WORKING/ NOT WORKING') {
      const sectionPrompt = document.createElement('p');
      sectionPrompt.classList.add('sectionPrompt');
      sectionPrompt.innerText = 'Be sure to include Working/Not Working technology solutions.';
      section.appendChild(sectionPrompt);
    }

    observer.observe(section);

    return section;
  }
  function buildSectionFooter(id) {
    const footer = document.createElement('div');
    footer.classList.add('sectionFooter');

    const planStatus = plan.getPlanStatus();
    const planActiveStatus = plan.getPlanActiveStatus();
    let readOnly;

    if (planActiveStatus && planStatus === 'D' && $.session.planUpdate) {
      readOnly = false;
    } else {
      readOnly = true;
    }

    //number of paid supports attached to this section
    let assessmentValidationCheck = planValidation.returnAssessmentValidationData();

    let paidSupportCount = assessmentValidationCheck.servicesAndSupports.paidSupportCounts[id] || 0;
    let additionalSupportCount = assessmentValidationCheck.servicesAndSupports.additionalSupportCounts[id] || 0;
    let professionalReferralCounts = assessmentValidationCheck.servicesAndSupports.professionalReferralCounts[id] || 0;
    let potentialOutcomeCount = assessmentValidationCheck.servicesAndSupports.potentialOutcomeCounts[id] || 0;

    // returns true if the section has been checked
    let paidSupportChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].paidSupport;
    let additionalSupportChecked =
      assessmentValidationCheck.servicesAndSupportsChecked[id].naturalSupport ||
      assessmentValidationCheck.servicesAndSupportsChecked[id].technology ||
      assessmentValidationCheck.servicesAndSupportsChecked[id].communityResource;
    let professionalReferralChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].professionalReferral;
    let potentialOutcomeChecked = assessmentValidationCheck.servicesAndSupportsChecked[id].potentialOutcome;

    const outcomesBtn = button.build({
      //text: `Add Outcome (${potentialOutcomeCount})`,
      text: `Add Outcome`,
      style: 'secondary',
      type: 'contained',
      id: `outcomesBtn${id}`,
      callback: () => {
        planOutcomes.showAddNewOutcomePopup(id, charLimits.outcomes);
      },
    });
    const paidSupportBtn = button.build({
      //text: `Add Paid Support (${paidSupportCount})`,
      text: 'Add Paid Support',
      style: 'secondary',
      type: 'contained',
      id: `paidSupportBtn${id}`,
      callback: () => {
        servicesSupports.showAddPaidSupportPopup({
          popupData: { assessmentAreaId: id },
          isNew: true,
          fromAssessment: true,
          charLimits: charLimits.servicesSupports,
        });
      },
    });
    const additionalSupportBtn = button.build({
      /*text: `Add Additional Support (${additionalSupportCount})`,*/
      text: 'Add Additional Support',
      style: 'secondary',
      type: 'contained',
      id: `additionalSupportBtn${id}`,
      callback: () => {
        servicesSupports.showAddAdditionalSupportPopup(
          { assessmentAreaId: id },
          true,
          true,
          charLimits.servicesSupports,
        );
      },
    });
    const profRefBtn = button.build({
      /*text: `Add Professional Referral (${professionalReferralCounts})`,*/
      text: 'Add Professional Referral',
      style: 'secondary',
      type: 'contained',
      id: `profRefBtn${id}`,
      callback: () => {
        servicesSupports.showAddProfessionalReferralPopup(
          { assessmentAreaId: id },
          true,
          true,
          charLimits.servicesSupports,
        );
      },
    });

    if (readOnly) {
      outcomesBtn.classList.add('disabled');
      paidSupportBtn.classList.add('disabled');
      additionalSupportBtn.classList.add('disabled');
      profRefBtn.classList.add('disabled');
    }

    //Add error class to buttons that are checked and have 0 outcomes attached to them
    if (paidSupportChecked && paidSupportCount === 0) {
      paidSupportBtn.classList.add('error');
      planValidation.updateAssessmentValidationSection('complete', false);
    }

    if (additionalSupportChecked && additionalSupportCount === 0) {
      additionalSupportBtn.classList.add('error');
      planValidation.updateAssessmentValidationSection('complete', false);
    }

    if (professionalReferralChecked && professionalReferralCounts === 0) {
      profRefBtn.classList.add('error');
      planValidation.updateAssessmentValidationSection('complete', false);
    }

    if (potentialOutcomeChecked && potentialOutcomeCount === 0) {
      outcomesBtn.classList.add('error');
      planValidation.updateAssessmentValidationSection('complete', false);
    }

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(outcomesBtn);
    btnWrap.appendChild(paidSupportBtn);
    btnWrap.appendChild(additionalSupportBtn);
    btnWrap.appendChild(profRefBtn);

    footer.appendChild(btnWrap);

    return footer;
  }

  // Sub Sections
  //------------------------------------
  function addSubSection(order, title, id, sectionId) {
    const markup = buildSubSectionMarkup(title, id);

    if (!subSections[sectionId]) subSections[sectionId] = {};
    if (!subSections[sectionId][order]) subSections[sectionId][order] = { id, markup };
    if (title.match(/Specialized tools*/g)) subSectionsWithAttachments.push(id);
  }
  function buildSubSectionMarkup(title, id) {
    const subSection = document.createElement('div');
    subSection.classList.add('assessment__subSection');

    const subSectionHeading = document.createElement('h2');
    // subSectionHeading.innerHTML = `<span>${title}</span>`;
    subSectionHeading.innerHTML = `${title}`;
    subSectionHeading.classList.add('subSectionHeading');
    subSectionHeading.id = `subsec${id}`;

    subSection.appendChild(subSectionHeading);

    return subSection;
  }

  // Question Sets & Grids
  //------------------------------------
  // Grids
  //---------
  async function deleteSelectedRows(grid, gridBody, questionSetId) {
    const planId = plan.getCurrentPlanId();
    const successfulDelete = await assessment.deleteGridRows(planId, questionSetId, [selectedRow.id]);
    gridBody.removeChild(selectedRow.target);
    addAnswer(selectedRow.id);

    //* TEMP -REMOVE THIS ONCE HANDELED IN BACKEND
    updateRowOrderAfterDelete(grid, questionSetId);
    //* END TEMP
  }
  function buildGridHeaderRow() {
    const gridHeaderRow = document.createElement('div');
    gridHeaderRow.classList.add('grid__row', 'grid__rowHeader');
    return gridHeaderRow;
  }
  function buildGridHeaderCell(text, prompt) {
    const gridHeaderCell = document.createElement('div');
    gridHeaderCell.classList.add('grid__cell');
    gridHeaderCell.innerHTML = `<p class="text">${text}</p>`;
    gridHeaderCell.innerHTML += `<p class="prompt">${prompt}</p>`;

    if (text.toLowerCase().includes('date')) {
      gridHeaderCell.setAttribute('data-cellType', 'date');
    }
    return gridHeaderCell;
  }
  function buildGridRow(rok) {
    const gridRow = document.createElement('div');
    gridRow.classList.add('grid__row');
    gridRow.id = `roworder${rok}`;
    return gridRow;
  }
  function buildGridRowCell(data) {
    const { answerStyle, answerId, answerText, questionRowId, colName } = data;

    const gridCell = document.createElement('div');
    gridCell.classList.add('grid__cell');
    gridCell.id = `question${questionRowId}`;

    let questionInput;
    let hasStaticText;

    let textAreaCharLimit = 10000;

    switch (answerStyle) {
      case 'TEXTAREA': {
        // For text areas with colName "What’s Working" and "What's Not Working"
        if (colName.trim().split(' ').pop() === 'Working') {
          textAreaCharLimit = 1000;
        } else if (colName === 'Who Said it?') {
          textAreaCharLimit = 250;
        }

        questionInput = input.build({
          type: 'textarea',
          style: 'secondary',
          id: answerId,
          value: answerText ? answerText : '',
          charLimit: textAreaCharLimit,
          forceCharLimit: true,
          classNames: ['autosize', `${data.questionId}`],
        });
        break;
      }
      case 'TEXT': {
        questionInput = input.build({
          type: 'text',
          style: 'secondary',
          id: answerId,
          value: answerText ? answerText : '',
          charLimit: 10000,
          forceCharLimit: true,
        });
        break;
      }
      case 'DROPDOWN': {
        questionInput = dropdown.build({
          dropdownId: answerId,
          style: 'secondary',
        });

        const colKey = UTIL.camelize(colName);
        const dataKey = colNameDropdownMap[colKey];

        if (!colKey || !dataKey) break;

        if (dataKey === 'relationships') {
          const includeSupports = false;
          planData.populateRelationshipDropdown(questionInput, answerText, includeSupports);
          break;
        }

        const data = assessmentDropdownData[dataKey].map(d => {
          let dID, dText;

          if (Object.keys(d)[0].toLowerCase().includes('id')) {
            dID = Object.keys(d)[0];
            dText = Object.keys(d)[1];
          } else {
            dID = Object.keys(d)[1];
            dText = Object.keys(d)[0];
          }

          return {
            value: d[dID],
            text: d[dText],
          };
        });
        data.sort((a, b) => {
          const textA = a.text.toUpperCase();
          const textB = b.text.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        data.unshift({ value: '%', text: '' });

        dropdown.populate(questionInput, data, answerText);
        break;
      }
      case 'DATE': {
        gridCell.setAttribute('data-cellType', 'date');
        questionInput = input.build({
          type: 'date',
          style: 'secondary',
          id: answerId,
          value: answerText,
        });
        break;
      }
      case 'STATICTEXT': {
        gridCell.classList.add('staticCell');
        gridCell.innerHTML = `<p>${answerText}</p>`;
        hasStaticText = true;
        break;
      }
    }

    if (questionInput) gridCell.appendChild(questionInput);
    if (readonly || !$.session.planUpdate) {
      if (questionInput) input.disableInputField(questionInput);
    }

    return { markup: gridCell, hasStaticText };
  }
  function buildQuestionGridMarkup(questions, questionSetId, allowRowInsert, sectionId) {
    let addRowBtn, deleteRowsBtn, cancelDeleteRowsBtn;
    let hasStaticText = false;
    let areAllGridAnswersEmpty = true;
    let questionIds = [];

    const COL_NAME_MAP = {};
    sectionQuestionCount[sectionId][questionSetId] = {};

    const columnHeadings = [];
    const tableRowData = {};

    Object.entries(questions).forEach(([rowKey, rowQuestions], rowIndex) => {
      if (!tableRowData[rowKey]) {
        tableRowData[rowKey] = [];
      }

      Object.entries(rowQuestions).forEach(([questionKey, questionData], index) => {
        const { id: questionId, text, answerText, answerId, answerStyle, skipped } = questionData;
        const questionRowId = `${questionId}${rowKey}`;

        if (rowIndex === 0) {
          COL_NAME_MAP[index] = text;
          columnHeadings.push(text);
        }

        if (answerStyle !== 'STATICTEXT') {
          sectionQuestionCount[sectionId][questionSetId][questionRowId] = {
            answered: answerText && answerText !== '' ? true : false,
            required: false,
            rowOrder: rowKey,
            leaveblank: skipped === 'N' ? false : true,
          };
        }

        const cellData = {
          cellId: `question${questionRowId}`,
          inputId: answerId,
          inputValue: answerText,
          inputType: answerStyle,
          columnName: text,
        };

        if (answerStyle === 'DROPDOWN') {
          const colKey = UTIL.camelize(COL_NAME_MAP[index]);
          const dataKey = colNameDropdownMap[colKey];

          const data = assessmentDropdownData[dataKey].map(d => {
            let dID, dText;

            if (Object.keys(d)[0].toLowerCase().includes('id')) {
              dID = Object.keys(d)[0];
              dText = Object.keys(d)[1];
            } else {
              dID = Object.keys(d)[1];
              dText = Object.keys(d)[0];
            }

            return {
              value: d[dID],
              text: d[dText],
            };
          });

          cellData.inputData = data;
        }

        tableRowData[rowKey].push(cellData);
      });
    });

    const grid = document.createElement('div');
    grid.classList.add('grid');

    const gridBody = document.createElement('div');
    gridBody.classList.add('grid__body');

    if (isSortable) {
      new Sortable(gridBody, {
        handle: '.dragHandle',
        draggable: '>.grid__row',
        onSort: evt => {
          const gridCells = [...evt.item.querySelectorAll('.input-field__input')];

          let cellIds = gridCells.map(cell => cell.id);
          cellIds = cellIds.join(',');

          const oldPos = evt.oldIndex + 1;
          const newPos = evt.newIndex + 1;

          evt.item.id = `roworder${newPos}`;

          assessmentAjax.updateAssessmentAnswerRowOrder({
            token: $.session.Token,
            assessmentId: parseInt(assessmentId),
            questionSetId: parseInt(questionSetId),
            answerIds: cellIds,
            oldPos: parseInt(oldPos),
            newPos: parseInt(newPos),
          });

          const rows = [...gridBody.querySelectorAll('.grid__row')];
          rows.forEach((row, i) => {
            const order = parseInt(row.id.replaceAll('roworder', ''));
            // check row for gap in order
            if (order !== i + 1) {
              // update row id
              row.id = `roworder${i + 1}`;
            }
            // if no gap do nothing
          });
        },
      });

      grid.classList.add('sortableTable');
    }

    let isLeftBlankCheckboxChecked = [];
    const rowOrderKeys = Object.keys(questions);
    rowOrderKeys.forEach((rok, rowIndex) => {
      const gridHeaderRow = buildGridHeaderRow();
      const gridRow = buildGridRow(rok);

      const questionOrderKeys = Object.keys(questions[rok]);
      questionOrderKeys.forEach((qok, questionIndex) => {
        const { id: questionId, text, answerText, answerId, answerStyle, prompt, skipped } = questions[rok][qok];

        const questionRowId = `${questionId}${rok}`;

        isLeftBlankCheckboxChecked.push(skipped);

        if (answerStyle !== 'STATICTEXT') {
          sectionQuestionCount[sectionId][questionSetId][questionRowId] = {
            answered: false,
            required: false,
            rowOrder: rok,
            leaveblank: skipped === 'N' ? false : true,
          };

          if (answerText && answerText !== '') {
            sectionQuestionCount[sectionId][questionSetId][questionRowId].answered = true;
            areAllGridAnswersEmpty = false;
          }
        }

        if (rowIndex === 0) {
          questionIds.push(questionId);

          COL_NAME_MAP[questionIndex] = text;

          const gridHeaderCell = buildGridHeaderCell(text, prompt);
          gridHeaderCell.style.width = `${100 / questionOrderKeys.length}%`;

          if (questionIndex === 0 && isSortable) {
            var td = document.createElement('div');
            td.classList.add('dragHandle');
            gridHeaderRow.appendChild(td);
          }

          gridHeaderRow.appendChild(gridHeaderCell);
        }

        const gridCell = buildGridRowCell({
          questionId,
          answerStyle,
          answerId,
          answerText,
          questionRowId,
          colName: COL_NAME_MAP[questionIndex],
        });
        gridCell.markup.style.width = `${100 / questionOrderKeys.length}%`;

        hasStaticText = gridCell.hasStaticText;

        if (questionIndex === 0 && isSortable) {
          var cell = document.createElement('div');
          cell.classList.add('dragHandle');
          cell.innerHTML = icons.drag;

          gridRow.appendChild(cell);
        }

        gridRow.appendChild(gridCell.markup);
      });

      if (rowIndex === 0) {
        grid.appendChild(gridHeaderRow);
      }
      gridBody.appendChild(gridRow);
    });
    rowOrderKeys.forEach((rok, rowIndex) => {
      const questionOrderKeys = Object.keys(questions[rok]);
      questionOrderKeys.forEach((qok, questionIndex) => {
        const { id: questionId, text, answerText, answerId, answerStyle, prompt, skipped } = questions[rok][qok];
        const questionRowId = `${questionId}${rok}`;

        if (!areAllGridAnswersEmpty && skipped === 'Y') {
          addAnswer(answerId, answerText, rok, 'N');
          sectionQuestionCount[sectionId][questionSetId][questionRowId].leaveblank = false;
        }
      });
    });
    grid.appendChild(gridBody);

    if (allowRowInsert === 'True') {
      const gridActionRow = document.createElement('div');
      gridActionRow.classList.add('gridActionRow');

      addRowBtn = button.build({
        text: 'Add Row',
        type: 'contained',
        style: 'secondary',
        classNames: 'addRowBtn',
      });
      deleteRowsBtn = button.build({
        text: 'Delete Row',
        type: 'contained',
        style: 'secondary',
        id: 'deleteRowBtn',
        classNames: 'deleteRowBtn',
      });
      cancelDeleteRowsBtn = button.build({
        text: 'Cancel Delete',
        type: 'contained',
        style: 'secondary',
        id: 'cancelDeleteRowsBtn',
        classNames: ['cancelDeleteRowsBtn', 'hidden'],
      });

      gridActionRow.appendChild(addRowBtn);
      gridActionRow.appendChild(deleteRowsBtn);
      gridActionRow.appendChild(cancelDeleteRowsBtn);
      grid.appendChild(gridActionRow);

      let currentRowOrder;

      grid.addEventListener('click', async e => {
        const gridRows = [...grid.querySelectorAll('.grid__body .grid__row')];

        const target = e.target;

        if (deleteRowsActive && target.classList.contains('grid__row')) {
          if (gridRows.length === 1) return;

          const isSeleted = target.classList.contains('selected');
          const rowId = target.id.replace('roworder', '');

          if (!isSeleted) {
            const prevSelectedRow = document.querySelector('.grid__row.selected');
            if (prevSelectedRow) prevSelectedRow.classList.remove('selected');
            // set new selecrted row
            selectedRow = {
              id: rowId,
              target,
            };
            target.classList.add('selected');
          } else {
            target.classList.remove('selected');
            selectedRow = undefined;
          }
        }

        if (target === addRowBtn) {
          const gridBody = target.closest('.grid').querySelector('.grid__body');
          const planId = plan.getCurrentPlanId();
          const newRowData = await assessment.insertAssessmentGridRowAnswers(planId, questionSetId);
          const gridRow = document.createElement('div');
          gridRow.classList.add('grid__row');
          currentRowOrder = gridBody.querySelectorAll('.grid__row').length + 1;
          gridRow.id = `roworder${currentRowOrder}`;

          if (isSortable) {
            var cell = document.createElement('div');
            cell.classList.add('dragHandle');
            cell.innerHTML = icons.drag;

            gridRow.appendChild(cell);
          }

          newRowData.forEach((nrd, index) => {
            let { answerId, answerRow, answerText, answerStyle, questionId, hideOnAssessment, skipped } = nrd;
            const isAnswered = answerText && answerText !== '' ? true : false;
            const questionRowId = `${questionId}${currentRowOrder}`;
            if (hideOnAssessment === '1') return;

            sectionQuestionCount[sectionId][questionSetId][questionRowId] = {
              answered: false,
              rowOrder: currentRowOrder,
              leaveblank: skipped === 'N' ? false : true,
            };

            const colName = COL_NAME_MAP[index];

            //if (index === 0) gridRow.id = `roworder${answerRow}`;

            const gridCell = document.createElement('div');
            gridCell.classList.add('grid__cell');
            gridCell.id = `question${questionRowId}`;

            let textAreaCharLimit = 10000;

            switch (answerStyle) {
              case 'TEXTAREA': {
                if (data.colName === 'What’s Working' || data.colName === 'What’s Not Working') {
                  textAreaCharLimit = 1000;
                }

                const questionInput = input.build({
                  type: 'textarea',
                  style: 'secondary',
                  classNames: isAnswered ? 'autosize' : ['autosize', 'unawnsered'],
                  id: answerId,
                  value: answerText ? answerText : '',
                  charLimit: textAreaCharLimit,
                  forceCharLimit: true,
                  attributes: [{ key: 'data-answer-row', value: answerRow }],
                });
                if (readonly || !$.session.planUpdate) {
                  input.disableInputField(questionInput);
                }

                gridCell.appendChild(questionInput);
                break;
              }
              case 'TEXT': {
                const questionInput = input.build({
                  type: 'text',
                  style: 'secondary',
                  classNames: isAnswered ? 'unawnsered' : '',
                  id: answerId,
                  value: answerText ? answerText : '',
                  charLimit: 1000,
                  forceCharLimit: true,
                  attributes: [{ key: 'data-answer-row', value: answerRow }],
                });
                if (readonly || !$.session.planUpdate) {
                  input.disableInputField(questionInput);
                }

                gridCell.appendChild(questionInput);
                break;
              }
              case 'DROPDOWN': {
                const questionInput = dropdown.build({
                  dropdownId: answerId,
                  style: 'secondary',
                });
                if (readonly || !$.session.planUpdate) {
                  input.disableInputField(questionInput);
                }

                const colKey = UTIL.camelize(colName);
                const dataKey = colNameDropdownMap[colKey];

                if (dataKey === 'relationships') {
                  const includeSupports = false;
                  planData.populateRelationshipDropdown(questionInput, answerText, includeSupports);
                  gridCell.appendChild(questionInput);
                  break;
                }

                const data = assessmentDropdownData[dataKey].map(d => {
                  let dID, dText;

                  if (Object.keys(d)[0].toLowerCase().includes('id')) {
                    dID = Object.keys(d)[0];
                    dText = Object.keys(d)[1];
                  } else {
                    dID = Object.keys(d)[1];
                    dText = Object.keys(d)[0];
                  }

                  return {
                    value: d[dID],
                    text: d[dText],
                  };
                });
                data.sort((a, b) => {
                  const textA = a.text.toUpperCase();
                  const textB = b.text.toUpperCase();
                  return textA < textB ? -1 : textA > textB ? 1 : 0;
                });
                data.unshift({ value: '%', text: '' });

                dropdown.populate(questionInput, data, answerText);

                gridCell.appendChild(questionInput);
                break;
              }
              case 'DATE': {
                return;
              }
            }

            addAnswer(answerId, answerText, answerRow);

            gridRow.appendChild(gridCell);
          });

          gridBody.appendChild(gridRow);
          DOM.autosizeTextarea();

          let firstCol;

          if (isSortable) {
            firstCol = gridRow.children[1];
          } else {
            firstCol = gridRow.children[0];
          }
          const colInput = firstCol.querySelector('.input-field__input');
          colInput.focus();

          if (sectionId === '41') {
            await planValidation.updateAnswerWorkingSection(assessmentId);
            tableOfContents.showUnansweredQuestionCount();
          }
        }
        if (target === deleteRowsBtn) {
          if (deleteRowsActive) {
            await deleteSelectedRows(grid, gridBody, questionSetId);

            questionIds.forEach(qId => {
              const key = `${qId}${selectedRow.id}`;
              delete sectionQuestionCount[sectionId][questionSetId][key];
            });

            let isGridEmptyNow = true;

            Object.values(sectionQuestionCount[sectionId][questionSetId]).forEach(q => {
              if (q.answered) {
                isGridEmptyNow = false;
              }
            });

            if (isGridEmptyNow) {
              grid.classList.add('unanswered');
              toggleIntentionallyBlankCheckbox('', questionSetId, false);
            }

            if (sectionId === '41') {
              await planValidation.updateAnswerWorkingSection(assessmentId);
              tableOfContents.showUnansweredQuestionCount();
            }
          }

          currentRowOrder = gridBody.querySelectorAll('.grid__row').length + 1;
          deleteRowsActive = !deleteRowsActive;

          if (deleteRowsActive) {
            grid.classList.add('delteActive');
            selectedRow = undefined;
            deleteRowsBtn.innerText = 'Delete Selected Row';
            deleteRowsBtn.classList.add('selected');
            cancelDeleteRowsBtn.classList.remove('hidden');
          } else {
            grid.classList.remove('delteActive');
            deleteRowsBtn.innerText = 'Delete Row';
            deleteRowsBtn.classList.remove('selected');
            cancelDeleteRowsBtn.classList.add('hidden');
          }
        }
        if (target === cancelDeleteRowsBtn) {
          selectedRow = undefined;
          deleteRowsActive = false;
          const row = grid.querySelector('.grid__row.selected');
          if (row) row.classList.remove('selected');
          grid.classList.remove('delteActive');
          deleteRowsBtn.innerText = 'Delete Row';
          deleteRowsBtn.classList.remove('selected');
          cancelDeleteRowsBtn.classList.add('hidden');
        }
      });
    }

    if (questionSetId !== '182') {
      // intentionally blank checkbox
      let isChecked = checkArrayConsistency(isLeftBlankCheckboxChecked);
      isChecked = !areAllGridAnswersEmpty ? 'N' : isChecked;

      const intentionallyBlankCheckbox = input.buildCheckbox({
        text: 'Intentionally left blank',
        id: `intentionallyBlankCheckbox${questionSetId}`,
        className: 'intentionallyBlankCheckbox',
        isChecked: isChecked === 'Y' ? true : false,
        isDisabled: readonly,
        attributes: [
          { key: 'data-setid', value: questionSetId },
          { key: 'data-isforrow', value: true },
        ],
      });

      grid.appendChild(intentionallyBlankCheckbox);

      if (!areAllGridAnswersEmpty) {
        input.disableInputField(intentionallyBlankCheckbox);
      }
    }

    if (hasStaticText) grid.classList.add('staticText');

    return grid;
  }
  // Text, checkboxes, radio
  //---------
  function buildTextInput(data) {
    const { answerId, answerText, conditionalQuestionId, conditionalAnswerText, sectionId, setId, questionId } = data;

    const questionInputMarkup = input.build({
      type: 'text',
      style: 'secondary',
      id: answerId,
      value: answerText,
      charLimit: 10000,
      forceCharLimit: true,
    });

    if (conditionalQuestionId !== '') {
      const parentQuestion = assessment.getQuestionDataById(conditionalQuestionId);
      const parentAnswerText = parentQuestion && parentQuestion.answerText;

      if (parentAnswerText !== conditionalAnswerText) {
        //questionInputMarkup.classList.add('disabled');
        input.disableInputField(questionInputMarkup);
        sectionQuestionCount[sectionId][setId][questionId].answered = false;
        sectionQuestionCount[sectionId][setId][questionId].required = false;
      } else {
        if (readonly || !$.session.planUpdate) {
          input.disableInputField(questionInputMarkup);
        }
        sectionQuestionCount[sectionId][setId][questionId].answered = answerText === '' ? false : true;
        sectionQuestionCount[sectionId][setId][questionId].required = true;
      }
    } else {
      sectionQuestionCount[sectionId][setId][questionId].answered = answerText === '' ? false : true;
      sectionQuestionCount[sectionId][setId][questionId].required = true;
      if (readonly || !$.session.planUpdate) {
        input.disableInputField(questionInputMarkup);
      }
    }

    return questionInputMarkup;
  }
  function buildTextareaInput(data) {
    const { answerId, answerText, conditionalQuestionId, conditionalAnswerText, sectionId, setId, questionId } = data;

    let charLimit = 10000;

    const questionInputMarkup = input.build({
      type: 'textarea',
      style: 'secondary',
      id: answerId,
      value: answerText,
      charLimit,
      forceCharLimit: true,
      classNames: 'autosize',
    });

    if (conditionalQuestionId !== '') {
      const parentQuestion = assessment.getQuestionDataById(conditionalQuestionId);
      const parentAnswerText = parentQuestion && parentQuestion.answerText;

      if (parentAnswerText !== conditionalAnswerText) {
        //questionInputMarkup.classList.add('disabled');
        input.disableInputField(questionInputMarkup);
        sectionQuestionCount[sectionId][setId][questionId].answered = false;
        sectionQuestionCount[sectionId][setId][questionId].required = false;
      } else {
        if (readonly || !$.session.planUpdate) {
          input.disableInputField(questionInputMarkup);
        }
        sectionQuestionCount[sectionId][setId][questionId].answered = answerText === '' ? false : true;
        sectionQuestionCount[sectionId][setId][questionId].required = true;
      }
    } else {
      sectionQuestionCount[sectionId][setId][questionId].answered = answerText === '' ? false : true;
      sectionQuestionCount[sectionId][setId][questionId].required = true;
      if (readonly || !$.session.planUpdate) {
        input.disableInputField(questionInputMarkup);
      }
    }

    return questionInputMarkup;
  }
  function buildCheckboxInput(data) {
    const {
      answerId,
      answerText,
      conditionalQuestionId,
      conditionalAnswerText,
      readOnly,
      sectionId,
      setId,
      questionId,
    } = data;

    const isChecked = answerText && answerText === '1' ? true : false;

    const questionIdCategory = planValidation.findQuestionIdCategory(questionId);

    if (questionIdCategory !== 'Variable not found in the object' && questionIdCategory !== 'noSupport') {
      planValidation.updateAssessmentValidationProperty(sectionId, questionIdCategory, isChecked);
    }

    const questionInputMarkup = input.buildNativeCheckbox({
      id: answerId,
      isChecked,
      isDisabled: readOnly,
    });

    if (conditionalQuestionId !== '') {
      const parentQuestion = assessment.getQuestionDataById(conditionalQuestionId);
      const parentAnswerText = parentQuestion && parentQuestion.answerText;

      if (parentAnswerText !== conditionalAnswerText) {
        //questionInputMarkup.classList.add('disabled');
        input.disableInputField(questionInputMarkup);
        sectionQuestionCount[sectionId][setId][questionId].answered = false;
        sectionQuestionCount[sectionId][setId][questionId].required = false;
      } else {
        if (readonly || !$.session.planUpdate) {
          input.disableInputField(questionInputMarkup);
        }
        sectionQuestionCount[sectionId][setId][questionId].answered = isChecked;
        sectionQuestionCount[sectionId][setId][questionId].required = false;
      }
    } else {
      sectionQuestionCount[sectionId][setId][questionId].answered = isChecked;
      sectionQuestionCount[sectionId][setId][questionId].required = false;
      if (readonly || !$.session.planUpdate) {
        input.disableInputField(questionInputMarkup);
      }
    }

    return questionInputMarkup;
  }
  function buildRadioInput(data) {
    const { sectionId, setId, questionId, answerOptions, answerId, answerText, readOnly } = data;

    const questionInputMarkup = document.createElement('div');
    questionInputMarkup.classList.add('radioWrap');

    sectionQuestionCount[sectionId][setId][questionId].required = true;

    const options = answerOptions.split(',');
    options.forEach(option => {
      const btnOpts = {
        style: 'secondary',
        name: questionId,
        id: answerId,
        isDisabled: readOnly,
      };

      if (answerText === option) {
        btnOpts.isChecked = true;
        sectionQuestionCount[sectionId][setId][questionId].answered = true;
      }

      switch (option) {
        case '0': {
          btnOpts.text = 'no';
          break;
        }
        case '1': {
          btnOpts.text = 'yes';
          break;
        }
        case '2': {
          btnOpts.text = 'N/A';
          break;
        }
        default: {
          btnOpts.text = option;
          break;
        }
      }

      const radioInput = input.buildRadio(btnOpts);
      questionInputMarkup.appendChild(radioInput);
    });

    const eraser = document.createElement('div');
    eraser.innerHTML += icons.eraser;
    questionInputMarkup.appendChild(eraser);

    eraser.addEventListener('click', () => {
      // clear out answer
      addAnswer(answerId, '');
      // mark unanswered
      sectionQuestionCount[sectionId][setId][questionId].answered = false;
      // clear radios
      const radios = [...questionInputMarkup.querySelectorAll('input')];
      radios.forEach(radio => (radio.checked = false));
      // clear conditionals
      const conditionalQuestions = assessment.getConditionalQuestions(questionId);
      toggleConditionalQuestion('', 'radio', conditionalQuestions);
    });

    return questionInputMarkup;
  }
  function buildDateInput(data) {
    const { answerId, answerText, sectionId, setId, questionId } = data;

    const questionInputMarkup = input.build({
      type: 'date',
      style: 'secondary',
      id: answerId,
      value: answerText,
    });

    sectionQuestionCount[sectionId][setId][questionId].answered = answerText === '' ? false : true;
    sectionQuestionCount[sectionId][setId][questionId].required = true;

    return questionInputMarkup;
  }
  function buildQuestionMarkup(setId, questionData, sectionId, readOnly, subSectionId) {
    const {
      answerOptions,
      answerStyle,
      answerText,
      answerId,
      conditionalAnswerText,
      conditionalQuestionId,
      id: questionId,
      prompt,
      requiredAnswer,
      text,
      skipped,
    } = questionData;

    let addAttachmentButton = false;

    if (subSectionId && subSectionsWithAttachments.includes(subSectionId)) addAttachmentButton = true;

    sectionQuestionCount[sectionId][setId][questionId] = {
      answered: null,
      required: null,
      leaveblank: skipped === 'N' ? false : true,
    };

    const question = document.createElement('div');
    question.classList.add('question');
    question.id = `question${questionId}`;
    if (conditionalQuestionId !== '') {
      question.classList.add('conditional');
    }

    let questionInputMarkup;

    switch (answerStyle) {
      case 'TEXT': {
        questionInputMarkup = buildTextInput({
          answerId,
          answerText,
          conditionalQuestionId,
          conditionalAnswerText,
          sectionId,
          setId,
          questionId,
        });
        question.innerHTML = `<p class="question__text">${text}</p>`;
        if (prompt) question.innerHTML += `<p class="question__prompt">${prompt}</p>`;
        question.appendChild(questionInputMarkup);
        break;
      }
      case 'TEXTAREA': {
        questionInputMarkup = buildTextareaInput({
          answerId,
          answerText,
          conditionalQuestionId,
          conditionalAnswerText,
          sectionId,
          setId,
          questionId,
          text,
        });
        question.innerHTML = `<p class="question__text">${text}</p>`;
        if (prompt) question.innerHTML += `<p class="question__prompt">${prompt}</p>`;
        question.appendChild(questionInputMarkup);

        // intentionally blank checkbox
        const intentionallyBlankCheckbox = input.buildCheckbox({
          text: 'Intentionally left blank',
          id: `intentionallyBlankCheckbox${answerId}`,
          className: 'intentionallyBlankCheckbox',
          isChecked: skipped === 'Y' ? true : false,
          isDisabled: readOnly,
          attributes: [
            { key: 'data-setid', value: setId },
            { key: 'data-sectionid', value: sectionId },
            { key: 'data-questionid', value: questionId },
            { key: 'data-answerid', value: answerId },
            { key: 'data-isforrow', value: false },
          ],
        });
        question.appendChild(intentionallyBlankCheckbox);
        if (answerText) {
          input.disableInputField(intentionallyBlankCheckbox);
        }
        if (skipped === 'Y') {
          input.disableInputField(questionInputMarkup);
          question.classList.add('intentionallyDisabled');
        }
        break;
      }
      case 'CHECKOPTION': {
        questionInputMarkup = buildCheckboxInput({
          answerId,
          answerText,
          conditionalQuestionId,
          conditionalAnswerText,
          readOnly,
          sectionId,
          setId,
          questionId,
        });
        question.appendChild(questionInputMarkup);
        question.innerHTML += `<p class="question__text">${text}</p>`;
        if (prompt) question.innerHTML += `<p class="question__prompt">${prompt}</p>`;

        if (addAttachmentButton) {
          const planId = plan.getCurrentPlanId();
          const questionAttachment = new planAttachment.PlanAttachment('', questionId, planId);
          question.appendChild(questionAttachment.attachmentButton);
        }

        break;
      }
      case 'RADIO': {
        question.innerHTML += `<p class="question__text">${text}</p>`;
        if (prompt) question.innerHTML += `<p class="question__prompt">${prompt}</p>`;
        questionInputMarkup = buildRadioInput({
          sectionId,
          setId,
          questionId,
          answerOptions,
          answerId,
          answerText,
          readOnly,
        });
        question.appendChild(questionInputMarkup);
        break;
      }
      case 'DATE': {
        questionInputMarkup = buildDateInput({
          answerId,
          answerText,
          sectionId,
          setId,
          questionId,
        });
        question.innerHTML = `<p class="question__text">${text}</p>`;

        if (prompt) {
          question.innerHTML += `<p class="question__prompt">${prompt}</p>`;
        }

        question.appendChild(questionInputMarkup);
      }

      default: {
        break;
      }
    }

    return question;
  }
  // question
  function buildQuestionSetMarkup(setType, id) {
    const questionSet = document.createElement('div');
    questionSet.id = `set${id}`;
    questionSet.classList.add('questionSet', `questionSet__${setType.toLowerCase()}`);
    questionSet.setAttribute('data-set-type', setType.toLowerCase());
    return questionSet;
  }
  function addQuestionSet({ questions, ...setData }, readOnly) {
    const { id: setId, sectionId, subsectionId, order, setType, allowRowInsert } = setData;

    if (!sectionQuestionCount[sectionId]) sectionQuestionCount[sectionId] = {};
    sectionQuestionCount[sectionId][setId] = {};

    const questionSetWrap = buildQuestionSetMarkup(setType, setId);

    if (setType !== 'GRID') {
      const questionOrderKeys = Object.keys(questions);
      questionOrderKeys.forEach(qoKey => {
        const questionWrap = buildQuestionMarkup(setId, questions[qoKey], sectionId, readOnly, subsectionId);
        questionSetWrap.appendChild(questionWrap);
      });
    } else {
      const questionGrid = buildQuestionGridMarkup(questions, setId, allowRowInsert, sectionId);
      questionSetWrap.appendChild(questionGrid);
    }

    if (setId === '208' || setId === '141') {
      // build dropdown
      const placeOnPathDropdown = dropdown.build({
        dropdownId: 'pathDropdown',
        label: 'Place on path to community employment',
        style: 'secondary',
        callback: async (e, selectedOption) => {
          await summaryAjax.updatePlaceOnPath({
            token: $.session.Token,
            anywAssessmentId: assessmentId,
            placeId: selectedOption.value,
          });
        },
      });
      // handle dropdown data
      const { dailyLifeDropdownType } = planData.getDropdownData();
      const data = dailyLifeDropdownType.map(dd => {
        return {
          value: dd.value,
          text: dd.text,
        };
      });
      // populate dropdown
      dropdown.populate(placeOnPathDropdown, data, additionalSummaryData.placeOnPath);
      // append to assessment
      questionSetWrap.appendChild(placeOnPathDropdown);
    }

    const belongsToSection = subsectionId ? false : true;
    if (belongsToSection) {
      if (!questionSectionSets[sectionId]) questionSectionSets[sectionId] = {};
      if (!questionSectionSets[sectionId][order]) {
        questionSectionSets[sectionId][order] = {
          id: setId,
          markup: questionSetWrap,
        };
      }
    } else {
      if (!questionSubSectionSets[subsectionId]) questionSubSectionSets[subsectionId] = {};
      if (!questionSubSectionSets[subsectionId][order]) {
        questionSubSectionSets[subsectionId][order] = {
          id: setId,
          markup: questionSetWrap,
        };
      }
    }
  }

  // Main
  //------------------------------------
  function addSectionQuestions(sectionId, sectionMarkup) {
    const questionSectionSetsOrderKeys = questionSectionSets[sectionId]
      ? Object.keys(questionSectionSets[sectionId])
      : null;
    if (questionSectionSetsOrderKeys) {
      questionSectionSetsOrderKeys.forEach(qssoKey => {
        const { markup: questionSetMarkup } = questionSectionSets[sectionId][qssoKey];
        sectionMarkup.appendChild(questionSetMarkup);
      });
    }
  }
  function addSubSectionQuestions(sectionId, sectionMarkup) {
    const subSectionOrderKeys = subSections[sectionId] ? Object.keys(subSections[sectionId]) : null;

    if (subSectionOrderKeys) {
      subSectionOrderKeys.forEach(ssoKey => {
        const { markup: subSectionMarkup, id: subSectionId } = subSections[sectionId][ssoKey];

        const questionSubSectionSetsOrderKeys = questionSubSectionSets[subSectionId]
          ? Object.keys(questionSubSectionSets[subSectionId])
          : null;

        if (questionSubSectionSetsOrderKeys) {
          questionSubSectionSetsOrderKeys.forEach(qssoKey => {
            const { markup: questionSetMarkup } = questionSubSectionSets[subSectionId][qssoKey];

            subSectionMarkup.appendChild(questionSetMarkup);
          });
        }

        sectionMarkup.appendChild(subSectionMarkup);

        if (sectionId !== '33' && sectionId !== '2') {
          const subSectionHeading = subSectionMarkup.querySelector('.subSectionHeading');
          const subSectionTitle = subSectionHeading.innerText;
          if (subSectionTitle === 'Services, Supports, Outcomes') {
            const footerMarkup = buildSectionFooter(sectionId);
            sectionMarkup.appendChild(footerMarkup);
          }
        }
      });
    }
  }
  function build() {
    const sectionOrderKeys = Object.keys(sections);
    sectionOrderKeys.forEach(soKey => {
      const { id: sectionId, markup: sectionMarkup } = sections[soKey];
      if (sectionMarkup) {
        assessmentWrap.appendChild(sectionMarkup);
        addSectionQuestions(sectionId, sectionMarkup);
        addSubSectionQuestions(sectionId, sectionMarkup);
      }
    });

    assessmentWrap.addEventListener('change', handleAssessmentChangeEvents);
    assessmentWrap.addEventListener('paste', e => {
      setTimeout(() => {
        handleAssessmentChangeEvents(e);
      }, 100);
    });

    return assessmentWrap;
  }

  async function init(planId, readOnly) {
    assessmentId = planId;
    sections = {};
    subSections = {};
    questionSectionSets = {};
    questionSubSectionSets = {};
    sectionQuestionCount = {};
    subSectionsWithAttachments = [];
    charLimits = planData.getAllISPcharacterLimts();
    readonly = readOnly;
    assessmentValidationCheck = await planValidation.returnAssessmentValidationData();

    if (!$.session.planUpdate) {
      isSortable = false;
    } else {
      isSortable = readonly ? false : true;
    }

    assessmentDropdownData = {};
    assessmentDropdownData.newOrExisting = [
      { id: 'n', text: 'New' },
      { id: 'e', text: 'Existing' },
    ];
    assessmentDropdownData.relationships = [...relationshipDropdownData()];

    assessmentWrap = document.createElement('div');
    assessmentWrap.classList.add('assessment');

    const AdditionalSummaryData = await summaryAjax.getAdditionalAssessmentSummaryQuestions({
      anywAssessmentId: assessmentId,
    });
    if (AdditionalSummaryData && AdditionalSummaryData.length > 0) {
      additionalSummaryData = AdditionalSummaryData[0];
      if (additionalSummaryData.placeOnPath === '' || additionalSummaryData.placeOnPath === '0') {
        additionalSummaryData.placeOnPath = '%';
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
  }

  return {
    init,
    addSection,
    addSubSection,
    addQuestionSet,
    build,
    clearData,
    getSectionQuestionCount,
    markUnansweredQuestions,
    toggleUnansweredQuestionFilter,
  };
})();
