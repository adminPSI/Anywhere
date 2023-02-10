const assessment = (function () {
  // Data
  let sectionData;
  let subsectionData;
  let questionSetData;
  let questionData;
  let conditionalQuestionData;

  // Applicable Sections
  //------------------------------------
  let applicableSections;

  function getApplicableSections() {
    return applicableSections;
  }
  function showApplicableWarningMessage(callback) {
    const warningPopup = POPUP.build({
      classNames: 'applicableWarningMessage',
    });

    const header = document.createElement('h3');
    header.innerHTML =
      'Marking this section Not Applicable will remove all information for this section, including answers to assessment questions, assessment summary information, and assessment area names on supports. Do you want to proceed?';

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    const yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      callback: async e => {
        // Delete answers to questions for the selected section
        // Null out Assessment Area values
        callback('yes');
        POPUP.hide(warningPopup);
      },
    });

    const noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'contained',
      callback: e => {
        callback('no');
        POPUP.hide(warningPopup);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    warningPopup.appendChild(header);
    warningPopup.appendChild(btnWrap);

    POPUP.show(warningPopup);
  }
  async function toggleIsSectionApplicable(sectionId, isApplicable) {
    // isApplicable === true || false
    const planId = plan.getCurrentPlanId();
    await planAjax.updatePlanSectionApplicable({
      token: $.session.Token,
      planId: parseInt(planId),
      sectionId: parseInt(sectionId),
      applicable: isApplicable ? 'Y' : 'N',
    });

    applicableSections[sectionId] = isApplicable;
    tableOfContents.toggleApplicability(sectionId, isApplicable);
  }

  // Utils
  //------------------------------------
  function getConditionalQuestions(conditionalQuestionId) {
    return conditionalQuestionData[conditionalQuestionId];
  }
  function getQuestionDataById(id) {
    return questionData[id];
  }
  function sortAssessmentDetails(data) {
    if (!data) return;
    // answerId: "686614946860364"
    // answerRow: "1"
    // answerText: ""
    // questionAnswerOptions: ""
    // questionAnswerStyle: "TEXT"
    // questionConditionalAnswerText: ""
    // questionConditionalQuestionId: ""
    // questionDefaultAnswer: ""
    // questionId: "9"
    // questionOrder: "1"
    // questionPrompt: ""
    // questionRequiresAnswer: "True"
    // questionSetAllowMultirowInserts: "False"
    // questionSetId: "3"
    // questionSetOrder: "1"
    // questionSetTitle: ""
    // questionSetType: "LIST"
    // questionTag: "contributors_consumerName"
    // questionText: "Individual’s First Name & Last Initial"
    // sectionId: "2"
    // sectionName: "CONTRIBUTORS"
    // sectionOrder: "0"
    // subsectionId: ""
    // subsectionName: ""
    // subsectionOrder: ""
    // applicable: "Y" || "N"
    // assessment: "Y" || "N"

    sectionData = {};
    subsectionData = {};
    questionSetData = {};
    questionData = {};
    answerData = {};
    conditionalQuestionData = {};
    applicableSections = {};

    data.forEach(({ sectionId, subsectionId, questionId, questionSetId, ...otherData }) => {
      // Sections
      if (!sectionData[sectionId]) {
        const isApplicable = otherData.applicable === '' ? 'Y' : otherData.applicable;
        sectionData[sectionId] = {
          order: otherData.sectionOrder,
          title: otherData.sectionName,
          applicable: isApplicable === 'Y' ? true : false,
          isAssessment: otherData.assessment,
        };

        if (!applicableSections[sectionId] && otherData.assessment) {
          if (otherData.assessment === 'Y') {
            applicableSections[sectionId] = isApplicable === 'Y' ? true : false;
          }
        }
      }
      // SubSections
      if (subsectionId && !subsectionData[subsectionId]) {
        subsectionData[subsectionId] = {
          sectionId,
          order: otherData.subsectionOrder,
          title: otherData.subsectionName,
        };
      }
      // Question Sets
      if (!questionSetData[questionSetId]) {
        questionSetData[questionSetId] = {
          id: questionSetId,
          sectionId,
          subsectionId,
          order: otherData.questionSetOrder,
          setType: otherData.questionSetType,
          allowRowInsert: otherData.questionSetAllowMultirowInserts,
          defaultAnswer: otherData.questionDefaultAnswer,
          questions: {},
        };
      }
      // Questions
      if (otherData.questionSetType === 'GRID') {
        if (!questionSetData[questionSetId].questions[otherData.answerRow]) {
          questionSetData[questionSetId].questions[otherData.answerRow] = {};
        }
        if (
          !questionSetData[questionSetId].questions[otherData.answerRow][otherData.questionOrder]
        ) {
          questionSetData[questionSetId].questions[otherData.answerRow][otherData.questionOrder] = {
            answerId: otherData.answerId,
            answerText: otherData.answerText,
            answerStyle: otherData.questionAnswerStyle,
            answerOptions: otherData.questionAnswerOptions,
            id: questionId,
            prompt: otherData.questionPrompt,
            requiredAnswer: otherData.questionRequiresAnswer,
            tag: otherData.questionTag,
            text: otherData.questionText,
          };
        }
      } else {
        if (!questionSetData[questionSetId].questions[otherData.questionOrder]) {
          questionSetData[questionSetId].questions[otherData.questionOrder] = {
            answerId: otherData.answerId,
            answerText: otherData.answerText,
            answerStyle: otherData.questionAnswerStyle,
            answerOptions: otherData.questionAnswerOptions,
            conditionalAnswerText: otherData.questionConditionalAnswerText,
            conditionalQuestionId: otherData.questionConditionalQuestionId,
            id: questionId,
            order: otherData.questionOrder,
            prompt: otherData.questionPrompt,
            requiredAnswer: otherData.questionRequiresAnswer,
            text: otherData.questionText,
            tag: otherData.questionTag,
          };
        }
        if (!questionData[questionId]) {
          questionData[questionId] = {
            answerId: otherData.answerId,
            answerText: otherData.answerText,
            answerStyle: otherData.questionAnswerStyle,
            answerOptions: otherData.questionAnswerOptions,
            conditionalAnswerText: otherData.questionConditionalAnswerText,
            conditionalQuestionId: otherData.questionConditionalQuestionId,
            id: questionId,
            order: otherData.questionOrder,
            prompt: otherData.questionPrompt,
            requiredAnswer: otherData.questionRequiresAnswer,
            text: otherData.questionText,
            tag: otherData.questionTag,
          };
        }

        if (otherData.questionConditionalQuestionId === '') return;

        if (!conditionalQuestionData[otherData.questionConditionalQuestionId]) {
          conditionalQuestionData[otherData.questionConditionalQuestionId] = [];
        }

        conditionalQuestionData[otherData.questionConditionalQuestionId].push({
          answerId: otherData.answerId,
          questionId: questionId,
          answerText: otherData.answerText,
          conditionalQuestionId: otherData.questionConditionalQuestionId,
          conditionalAnswerText: otherData.questionConditionalAnswerText,
        });
      }
    });

    return { sectionData, subsectionData, questionSetData };
  }
  function showSaveWarning(continueCallback) {
    const isActive = plan.getPlanActiveStatus();
    const status = plan.getPlanStatus();

    if (!$.session.planUpdate || !isActive || status === 'C') {
      continueCallback();
      return;
    }

    const savePopup = POPUP.build({
      classNames: 'saveWarningPopup',
      hideX: true,
    });

    const header = document.createElement('h3');
    header.innerHTML = 'Click Save to save changes before leaving the Assessment.';

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    const saveBtn = button.build({
      text: 'Save',
      style: 'secondary',
      type: 'contained',
      callback: async e => {
        const saveBar = PROGRESS.SPINNER.get('Saving Assessment...');
        savePopup.insertBefore(saveBar, btnWrap);

        const answersArray = mainAssessment.getAnswers();
        const success = await assessment.updateAnswers(answersArray);

        if (success !== undefined && success !== null && success !== 'error') {
          const successDiv = successfulSave.get('Assessment Saved', true);
          savePopup.removeChild(saveBar);
          savePopup.insertBefore(successDiv, btnWrap);
          POPUP.hide(savePopup);
          continueCallback();
        }
      },
    });

    const continueBtn = button.build({
      text: 'Continue Without Saving',
      style: 'secondary',
      type: 'contained',
      callback: e => {
        POPUP.hide(savePopup);
        continueCallback();
      },
    });

    btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(continueBtn);

    savePopup.appendChild(header);
    savePopup.appendChild(btnWrap);

    POPUP.show(savePopup);
  }
  // BELOW IS NOW AUTOSAVE
  async function autoSaveAssessment(continueCallback) {
    const isActive = plan.getPlanActiveStatus();
    const status = plan.getPlanStatus();

    if (!$.session.planUpdate || !isActive || status === 'C') {
      continueCallback();
      return;
    }

    const savePopup = POPUP.build({
      classNames: 'saveWarningPopup',
      hideX: true,
    });
    const saveBar = PROGRESS.SPINNER.get('Saving Assessment...');
    savePopup.appendChild(saveBar);
    POPUP.show(savePopup);

    const answersArray = mainAssessment.getAnswers();
    const success = await assessment.updateAnswers(answersArray);
    savePopup.removeChild(saveBar);

    if (success !== undefined && success !== null && success !== 'error') {
      const successDiv = successfulSave.get('Assessment Saved', true);
      savePopup.appendChild(successDiv);

      setTimeout(() => {
        POPUP.hide(savePopup);
        continueCallback();
      }, 1500);
    }
  }

  // Data
  //------------------------------------
  // TODO: refactor ajax calls to return data
  // TODO: remove below functions once ^^ is done
  async function getAssessmentData(planId) {
    try {
      const data = (
        await assessmentAjax.getConsumerAssessment({
          token: $.session.Token,
          consumerPlanId: planId,
        })
      ).getConsumerAssessmentResult;
      return sortAssessmentDetails(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getConsumerRelationshipsData(consumerId, effectiveStartDate, effectiveEndDate) {
    try {
      const data = (
        await assessmentAjax.getConsumerRelationships({
          token: $.session.Token,
          consumerId,
          effectiveStartDate,
          effectiveEndDate,
        })
      ).getConsumerRelationshipsResult;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function getConsumerNameInfoData(consumerId) {
    try {
      const data = (
        await assessmentAjax.getConsumerNameInfo({
          token: $.session.Token,
          consumerId,
        })
      ).getConsumerNameInfoResult;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function getServiceAndSupportsData() {
    try {
      const data = (
        await assessmentAjax.getServiceAndSupportsData({
          token: $.session.Token,
        })
      ).getServiceAndSupportsDataResult;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function generateReport(assessmentID, versionID, extraSpace) {
    try {
      const success = (
        await assessmentAjax.getPlanAssessmentReport({
          token: $.session.Token,
          userId: $.session.PeopleId,
          assessmentID,
          versionID,
          extraSpace: extraSpace,
          isp: true, //new
        })
      ).getPlanAssessmentReportResult;

      const arr = success._buffer;
      const byteArray = new Uint8Array(arr);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      if ($.session.browser === 'Explorer' || $.session.browser === 'Mozilla') {
        window.navigator.msSaveOrOpenBlob(blob, 'report.pdf');
      } else {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      }

      reports.handledProcessedReport();
      return 'success';
    } catch (error) {
      return error.statusText;
    }
  }
  function generateReportWithAttachments(//TODO Nathan. Add flag if to DODD
    assessmentID,
    versionID,
    extraSpace,
    planAttachmentIds,
    wfAttachmentIds,
    sigAttachmentIds,
    DODDFlag,
  ) {
    assessmentAjax.getPlanAssessmentReportWithAttachments(//Testgd
      {
        token: $.session.Token,
        userId: $.session.PeopleId,
        assessmentID,
        versionID,
        extraSpace: extraSpace,
        isp: true,
        planAttachmentIds,
        wfAttachmentIds,
        sigAttachmentIds,
        DODDFlag,
      },
      () => {
        const arr = success._buffer;
        const byteArray = new Uint8Array(arr);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        if ($.session.browser === 'Explorer' || $.session.browser === 'Mozilla') {
          window.navigator.msSaveOrOpenBlob(blob, 'report.pdf');
        } else {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        }

        reports.handledProcessedReport();
        return 'success';
      },
    );
  }

  async function transeferPlanReportToONET(assessmentID, versionID) {
    //PROGRESS.SPINNER.show('Tranferring Report...');
    try {
      const success = (
        await assessmentAjax.getPlanAssessmentReport({
          token: $.session.Token,
          userId: $.session.PeopleId,
          assessmentID,
          versionID,
          extraSpace: 'false',
          isp: true, //
        })
      ).getPlanAssessmentReportResult;

      const arr = success._buffer;
      const byteArray = new Uint8Array(arr);

      insertPlanReportToBeTranferredToONET(byteArray, assessmentID);
    } catch (error) {
      console.log(error.statusText);
    }
  }
  async function insertPlanReportToBeTranferredToONET(byteArray, assessmentID) {
    var binary = '';
    var len = byteArray.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    let abString = window.btoa(binary);
    try {
      const response = (
        await assessmentAjax.insertPlanReportToBeTranferredToONET({
          token: $.session.Token,
          report: abString,
          planId: assessmentID,
        })
      ).insertPlanReportToBeTranferredToONETResult;
      //return response;
      if (response === 'Success') {
        //PROGRESS.SPINNER.hide();
        successfulSave.show('Plan Sent');
        setTimeout(function () {
          //successfulSave.hide();
          const savePopup = document.querySelector('.successfulSavePopup');
          DOM.ACTIONCENTER.removeChild(savePopup);
        }, 1000);
      }
      // return planId;
    } catch (error) {
      console.log(error.statusText);
    }
  }
  async function insertAssessmentGridRowAnswers(consumerPlanId, assessmentQuestionSetId) {
    try {
      const newRowData = (
        await assessmentAjax.insertAssessmentGridRowAnswers({
          token: $.session.Token,
          consumerPlanId,
          assessmentQuestionSetId,
        })
      ).insertAssessmentGridRowAnswersResult;

      return newRowData;
      // return planId;
    } catch (error) {
      console.log(error.statusText);
    }
  }
  async function updateAnswers(answerArray) {
    try {
      const success = (
        await assessmentAjax.updateConsumerAssessmentAnswers({
          token: $.session.Token,
          answers: answerArray,
        })
      ).updateAssessmentAnswersResult;
      return success;
    } catch (error) {
      console.log(error.statusText);
    }
  }
  async function deleteGridRows(planId, questionSetId, rowsToDelete) {
    try {
      const success = (
        await assessmentAjax.deleteAssessmentGridRowAnswers({
          token: $.session.Token,
          consumerPlanId: planId,
          assessmentQuestionSetId: questionSetId,
          rowsToDelete,
        })
      ).deleteAssessmentGridRowAnswersResult;
      return success;
    } catch (error) {
      console.log(error.statusText);
    }
  }

  return {
    getAssessmentData,
    getConditionalQuestions,
    getQuestionDataById,
    getConsumerRelationshipsData,
    getConsumerNameInfoData,
    getServiceAndSupportsData,
    generateReport,
    generateReportWithAttachments,
    insertAssessmentGridRowAnswers,
    updateAnswers,
    deleteGridRows,
    transeferPlanReportToONET,
    showSaveWarning,
    autoSaveAssessment,
    // applicable stuff
    showApplicableWarningMessage,
    toggleIsSectionApplicable,
    getApplicableSections,
  };
})();
