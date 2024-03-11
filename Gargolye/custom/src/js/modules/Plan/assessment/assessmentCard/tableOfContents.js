const tableOfContents = (function () {
  let toc;
  let tocInner;
  let sections = {};
  let subSections = {};

  // Utils
  //------------------------------------
  function clearData() {
    sections = {};
    subSections = {};
  }
  function toggleVisibility() {
    if (toc.classList.contains('visible')) {
      toc.classList.remove('visible');
      // document.body.style.overflow = 'auto';
      body;
    } else {
      toc.classList.add('visible');
      // document.body.style.overflow = 'hidden';
    }
  }
  function toggleApplicability(sectionId, isApplicable) {
    const sectionGroup = document.getElementById(`toc-sectionGroup${sectionId}`);
    if (!isApplicable) {
      sectionGroup.classList.add('nonApplicable');
    } else {
      sectionGroup.classList.remove('nonApplicable');
    }
  }

  // Unanswered Questions
  //------------------------------------
  function validateTableHasAtLeastOneRowAnswered(tableQuestions) {
    let tableHasAtLeastOneRowAnsered = false;

    const rowOrderKeys = Object.keys(tableQuestions);
    rowOrderKeys.forEach(rowOrderKey => {
      if (tableQuestions[rowOrderKey].atLeastOneColumnAnswered) {
        tableHasAtLeastOneRowAnsered = true;
      }
    });

    return tableHasAtLeastOneRowAnsered;
  }
  function showUnansweredQuestionCount() {
    const questionCountObj = mainAssessment.getSectionQuestionCount();
    const sectionKeys = Object.keys(questionCountObj);
    const sectionUnawnseredQuestions = {};

    sectionKeys.forEach(sectionKey => {
      const questionSetKeys = Object.keys(questionCountObj[sectionKey]);
      const section = document.getElementById(`toc-section${sectionKey}`);
      const numOfQuestionsUnawnseredWrapDiv = section.querySelector(
        '.numOfQuestionsUnawnseredWrap',
      );
      const numOfQuestionsUnawnseredDiv = section.querySelector('.numOfQuestionsUnawnsered');
      let numOfQuestionsUnawnsered = 0;
      let tableQuestionSets;
      if (!sectionUnawnseredQuestions[sectionKey]) sectionUnawnseredQuestions[sectionKey] = 0;

      questionSetKeys.forEach(questionSetKey => {
        const questionKeys = Object.keys(questionCountObj[sectionKey][questionSetKey]);

        questionKeys.forEach(questionKey => {
          const { answered, required, rowOrder, leaveblank } =
            questionCountObj[sectionKey][questionSetKey][questionKey];
          if (!rowOrder) {
            if (!answered && required) {
              if (leaveblank !== null && !leaveblank) {
              numOfQuestionsUnawnsered++;
              sectionUnawnseredQuestions[sectionKey]++;
              }
            }
          } else {
            if (!tableQuestionSets) tableQuestionSets = {};
            if (!tableQuestionSets[questionSetKey]) tableQuestionSets[questionSetKey] = {};
            if (!tableQuestionSets[questionSetKey][rowOrder]) {
              tableQuestionSets[questionSetKey][rowOrder] = {
                atLeastOneColumnAnswered: false,
              }
              if (leaveblank !== null && !leaveblank && !answered) {
                numOfQuestionsUnawnsered++;
                sectionUnawnseredQuestions[sectionKey]++;
                }
              }
           // };
            if (answered || leaveblank)
              tableQuestionSets[questionSetKey][rowOrder].atLeastOneColumnAnswered = true;

          }
        });
      });

      if (tableQuestionSets) {
        const tableQuestionSetsKeys = Object.keys(tableQuestionSets);
        if (tableQuestionSetsKeys.length > 0) {
          tableQuestionSetsKeys.forEach(setKey => {
            const tableHasAtLeastOneRowAnsered = validateTableHasAtLeastOneRowAnswered(
              tableQuestionSets[setKey],
            );
            if (!tableHasAtLeastOneRowAnsered) numOfQuestionsUnawnsered++;
          });
        }
      }

      if (numOfQuestionsUnawnsered > 0) {
        numOfQuestionsUnawnseredDiv.innerText = numOfQuestionsUnawnsered;
        numOfQuestionsUnawnseredWrapDiv.classList.remove('hidden');
      } else {
        numOfQuestionsUnawnseredWrapDiv.classList.add('hidden');
      }

      const isWorkingSectionComplete = planValidation.returnAssessmentValidationData();
      if (sectionKey === '41') {
        numOfQuestionsUnawnsered = 0;
        numOfQuestionsUnawnseredWrapDiv.classList.add('hidden');
      }
    });
  }

  // Sections
  //------------------------------------
  function buildSectionMarkup(title, id, sectionNumber, applicable) {
    const section = document.createElement('div');
    section.id = `toc-sectionGroup${id}`;
    section.classList.add('tableOfContents__sectionGroup');
    if (!applicable) {
      section.classList.add('nonApplicable');
    }

    const sectionHeading = document.createElement('p');
    sectionHeading.id = `toc-section${id}`;
    sectionHeading.classList.add('tableOfContents__sectionHeading');
    sectionHeading.innerHTML = `
      <!-- <span class="sectionNumber">${sectionNumber + 1}.</span> -->
      <a href="#sec${id}" class="fullHeading">${title}</a> 
      <a href="#sec${id}" class="abrvHeading">${title.substr(0, 5 - 1) + ' &hellip;'}</a>
      <p class="numOfQuestionsUnawnseredWrap"><span class="numOfQuestionsUnawnsered"></span></p>
    `;

    const tocSectionAlertDiv = document.createElement('div');
    tocSectionAlertDiv.classList.add('workingAlertDiv');
    tocSectionAlertDiv.id = `${id}alert`;
    tocSectionAlertDiv.innerHTML = `${icons.error}`;
    sectionHeading.appendChild(tocSectionAlertDiv);

    planValidation.createTooltip(
      'This section is missing an Outcome, Support, or Referral',
      tocSectionAlertDiv,
    );

    tocSectionAlertDiv.style.display = 'none';

    if (title === 'WORKING/ NOT WORKING') {
      const workingAlertDivCase1 = document.createElement('div');
      workingAlertDivCase1.classList.add('workingAlertDivCase1');
      workingAlertDivCase1.id = `workingAlert1`;
      workingAlertDivCase1.innerHTML = `${icons.error}`;
      sectionHeading.appendChild(workingAlertDivCase1);

      planValidation.createTooltip(
        "There must be at least one record for What's Working/What's Not Working",
        workingAlertDivCase1,
      );

      workingAlertDivCase1.style.display = 'none';

      const workingAlertDivCase2 = document.createElement('div');
      workingAlertDivCase2.classList.add('workingAlertDivCase2');
      workingAlertDivCase2.id = `workingAlert2`;
      workingAlertDivCase2.innerHTML = `${icons.error}`;
      sectionHeading.appendChild(workingAlertDivCase2);

      planValidation.createTooltip(
        "Each record must include at least one 'What's Working' or 'What's Not Working', along with a 'Who Said It?' entry",
        workingAlertDivCase2,
      );

      workingAlertDivCase2.style.display = 'none';

      if (assessmentValidationCheck.workingSectionComplete === false) {
        let workingSectionCaseValue = planValidation.returnWorkingSectionCaseValue();
        if (workingSectionCaseValue === 1) {
          workingAlertDivCase1.style.display = 'inline-block';
        }
        else if (workingSectionCaseValue === 2) {
          workingAlertDivCase2.style.display = 'inline-block';
        }
      }
    }

    section.appendChild(sectionHeading);

    return section;
  }
  function addSection({ order, title, id, sectionNumber, applicable }) {
    const markup = buildSectionMarkup(title, id, sectionNumber, applicable);

    if (!sections[order]) sections[order] = { id, markup };
  }

  // Sub Sections
  //------------------------------------
  function buildSubSectionMarkup(title, id) {
    const subSection = document.createElement('div');
    subSection.classList.add('tableOfContents__subSectionGroup');

    const subSectionHeading = document.createElement('p');
    subSectionHeading.classList.add('tableOfContents__subSectionHeading');
    subSectionHeading.innerHTML = `<a href="#subsec${id}">${title}</a>`;

    subSection.appendChild(subSectionHeading);

    return subSection;
  }
  function addSubSection(order, title, id, sectionId) {
    const markup = buildSubSectionMarkup(title, id);

    if (!subSections[sectionId]) subSections[sectionId] = {};
    if (!subSections[sectionId][order]) subSections[sectionId][order] = { id, markup };
  }

  function build() {
    const sectionOrderKeys = Object.keys(sections);
    sectionOrderKeys.forEach(soKey => {
      const { id: sectionId, markup: sectionMarkup } = sections[soKey];
      tocInner.appendChild(sectionMarkup);

      const subSectionOrderKeys = subSections[sectionId]
        ? Object.keys(subSections[sectionId])
        : null;
      if (!subSectionOrderKeys) return;

      subSectionOrderKeys.forEach(ssoKey => {
        const { markup: subSectionMarkup } = subSections[sectionId][ssoKey];
        sectionMarkup.appendChild(subSectionMarkup);
      });
    });

    return toc;
  }

  function init() {
    toc = document.createElement('div');
    toc.classList.add('tableOfContents');
    toc.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        toc.classList.remove('visible');
        // document.body.style.overflow = 'auto';
      }
    });

    tocInner = document.createElement('div');
    tocInner.classList.add('tableOfContents__inner');

    let assessmentValidationCheck = planValidation.returnAssessmentValidationData();

    const tocHeader = document.createElement('h2');
    tocHeader.classList.add('tableOfContents__heading');
    tocHeader.innerHTML = `Table Of Contents`;

    const tocAlertDiv = document.createElement('div');
    tocAlertDiv.classList.add('tocAlertDiv');
    tocAlertDiv.id = 'tocAlert';
    tocHeader.appendChild(tocAlertDiv);
    tocAlertDiv.innerHTML = `${icons.error}`;

    // creates and shows a tip when hovering over the visible alert div
    planValidation.createTooltip(
      'At least one section of the Assessment must be selected',
      tocAlertDiv,
    );

    if (assessmentValidationCheck.hasASectionApplicable === true) {
     tocAlertDiv.style.display = 'none';
    }

    const tocMain = document.createElement('div');
    tocMain.classList.add('tableOfContents__main');

    const tocToggle = document.createElement('div');
    tocToggle.classList.add('tableOfContents__toggle');
    tocToggle.setAttribute('data-toggle', 'open');
    tocToggle.innerHTML = icons.keyArrowLeft;
    tocToggle.addEventListener('click', e => {
      const assessmentNavMarkupWrap = document.querySelector('.assessmentNavMarkupWrap');
      const currToggleState = e.target.dataset.toggle === 'open' ? 'open' : 'closed';

      if (currToggleState === 'open') {
        e.target.dataset.toggle = 'closed';
        tocHeader.innerHTML = `TOC`;
        toc.classList.add('toggleClosed');
        assessmentNavMarkupWrap.classList.add('toggleClosed');
        tocToggle.innerHTML = icons.keyArrowRight;
      } else {
        e.target.dataset.toggle = 'open';
        tocHeader.innerHTML = `Table Of Contents`;
        toc.classList.remove('toggleClosed');
        assessmentNavMarkupWrap.classList.remove('toggleClosed');
        tocToggle.innerHTML = icons.keyArrowLeft;
      }
    });

    const tocClose = document.createElement('span');
    tocClose.classList.add('tableOfContents__close');
    tocClose.innerHTML = icons.close;

    tocClose.addEventListener('click', () => {
      toc.classList.remove('visible');
    });

    tocInner.appendChild(tocClose);

    tocMain.appendChild(tocInner);
    tocMain.appendChild(tocToggle);

    toc.appendChild(tocHeader);
    toc.appendChild(tocMain);

    // planValidation.tocAssessmentCheck(assessmentValidationCheck);
  }

  return {
    init,
    build,
    addSection,
    addSubSection,
    clearData,
    toggleVisibility,
    toggleApplicability,
    showUnansweredQuestionCount,
  };
})();
