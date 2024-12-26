const planAttachment = (() => {
  let attachments;
  let planId;

  /** Class for attachments in Plan Module */
  class PlanAttachment {
    /**
     * Create a new attachment instance
     * @param {[string]} header Header for Attachment Popup
     * @param {string} questionId question ID the attachment button is assoicated with
     * @param {string} assessmentId Assessment ID
     */
    constructor(header, questionId, assessmentId) {
      this.attachmentsForQuestion = [];
      this.header = header;
      this.questionId = questionId;
      this.assessmentId = assessmentId;
    }

    buildAttachmentButton() {
      if (attachments.has(this.questionId))
        this.attachmentsForQuestion = attachments.get(this.questionId);

      const attachmentButton = button.build({
        id: `attach-${this.questionId}`,
        text: `ATTACHMENTS (${this.attachmentsForQuestion.length})`,
        style: 'secondary',
        type: 'contained',
        callback: () => {
          this.attachmentPopup();
        },
      });

      attachmentButton.classList.add('attachmentBtn');
      if (this.attachmentsForQuestion.length > 0) attachmentButton.classList.add('hasAttachments');

      return attachmentButton;
    }

    attachmentPopup() {
      const questionId = this.questionId;
      const assessmentId = this.assessmentId;
      const attachmentsForQuestion = this.attachmentsForQuestion;
      const attachmentsToDelete = [];
      const attachmentsAdded = [];
      // PERMISSIONS
      let ro;
      const planStatus = plan.getPlanStatus();
      const planActiveStatus = plan.getPlanActiveStatus();

      if (planActiveStatus && planStatus === 'D' && $.session.planUpdate) {
        ro = false;
      } else {
        ro = true;
      }
      // =========================
      // UTIL FUNCTIONS
      // =============================
      // Adds attachments to the existing attachments section in popup
      function populateExistingAttachments() {
        const header = document.createElement('h5');
        header.innerText = 'Existing Attachments:';
        reviewAttachmentList.appendChild(header);

        attachmentsForQuestion.forEach(attachment => {
          const fileContainer = document.createElement('div');
          fileContainer.classList.add('reviewAttachmentContainer');
          fileContainer.setAttribute('id', attachment.planAttachmentId);
          fileContainer.setAttribute('delete', false);
          const removeAttachmentBtn = button.build({
            style: 'secondary',
            type: 'text',
            icon: 'delete',
            callback: event => addRemoveAttachmentToDeleteList(event.target.parentElement),
          });
          const file = document.createElement('p');
          file.innerText = attachment.description;
          if (!ro) fileContainer.appendChild(removeAttachmentBtn);
          fileContainer.appendChild(file);
          file.addEventListener('click', event => {
            const attachmentId = event.target.parentElement.id;
            planAjax.viewPlanAttachment(attachmentId, '');
          });
          reviewAttachmentList.appendChild(fileContainer);
        });
      }
      // CB for clicking the delete button on attachments in existing attachment section
      function addRemoveAttachmentToDeleteList(attachmentElement) {
        const currentDeleteStatus = attachmentElement.getAttribute('delete');
        const attachmentId = attachmentElement.getAttribute('id');
        switch (currentDeleteStatus) {
          case 'false':
            attachmentElement.classList.add('deleteAttachment');
            attachmentsToDelete.push(attachmentId);
            attachmentElement.setAttribute('delete', true);
            break;
          case 'true':
            attachmentElement.classList.remove('deleteAttachment');
            attachmentsToDelete = attachmentsToDelete.filter(
              attachment => attachment !== attachmentId,
            );
            attachmentElement.setAttribute('delete', false);
            break;
          default:
            break;
        }
      }
      // checks file is a valid type
      function fileValidation(target) {
        const fileType = target.files[0].type;
        const reFileTypeTest = new RegExp('(audio/)|(video/)');
        if (reFileTypeTest.test(fileType)) {
          alert('Anywhere currently does not accept audio or video files');
          target.value = '';
          return false;
        }
      }
      // CB for clicking the add attachment button. doesn't do anything if they haven't yet chosen an
      // attachment for existing add attachment input.
      function addNewAttachment() {
        function addRemoveAttachmentEventListener(btn) {
          btn.addEventListener('click', event => {
            const fileInput = event.target.parentElement.getElementsByTagName('input')[0];
            if (fileInput !== '') {
              event.target.parentElement.remove();
            }
          });
        }
        // Don't add new attachment input if the last attachment is empty
        const form = document.getElementById('attachmentForm');
        const lastAttachment = form.lastChild;
        if (lastAttachment && lastAttachment.querySelector('.attachmentInput').value === '') {
          return;
        }
        const newFileContainer = attachmentContainer.cloneNode(true);
        newFileContainer.getElementsByTagName('input')[0].value = ''; //remove file for new container
        newFileContainer
          .getElementsByTagName('input')[0]
          .addEventListener('change', evt => fileValidation(evt.target));
        attachmentList.appendChild(newFileContainer);
        addRemoveAttachmentEventListener(newFileContainer.firstElementChild);
        attachmentContainer = newFileContainer;
      }

      // CB for Done Button
      async function saveAction() {
        async function saveAttachmentsToDB() {
          const attachmentSaveArray = [];
          if (attachmentArray.length === 0) return;

          attachmentArray.forEach(attachment => {
            const saveProm = new Promise(resolve => {
              const saveData = {
                token: $.session.Token,
                assessmentId: assessmentId,
                description: attachment.description,
                attachmentType: attachment.type,
                attachment: attachment.arrayBuffer,
                section: '',
                questionId: questionId,
              };
              planAjax.addPlanAttachment(saveData).then(res => resolve(res));
            });
            attachmentSaveArray.push(saveProm);
          });

          const attSaveRes = await Promise.all(attachmentSaveArray);
          attSaveRes.forEach(att => {
            attachmentsAdded.push(att[0]);
          });
        }
        // DELETE ATTACHMENTS
        attachmentsToDelete.forEach(attachment => {
          planAjax.deletePlanAttachment(assessmentId, attachment);
        });

        // ADD ATTACHMENTS
        const attachmentInputs = document.querySelectorAll('.attachmentInput');
        if (attachmentInputs.length === 0) {
          console.log('no attachments to add');
          return;
        }

        let attachmentProms = [];
        let attachmentArray = [];
        attachmentInputs.forEach(inputElement => {
          if (inputElement.value === '') {
            return;
          }
          const attPromise = new Promise(resolve => {
            const attachmentObj = {};
            const attachmentFile = inputElement.files.item(0);
            const attachmentName = attachmentFile.name;
            const attachmentType = attachmentFile.name.split('.').pop();
            attachmentObj.description = attachmentName;
            attachmentObj.type = attachmentType;
            // new Response(file) was added for Safari compatibility
            new Response(attachmentFile).arrayBuffer().then(res => {
              attachmentObj.arrayBuffer = res;
              attachmentArray.push(attachmentObj);
              resolve();
            });
          });

          attachmentProms.push(attPromise);
        });

        await Promise.all(attachmentProms);
        await saveAttachmentsToDB();
      }
      //===========================================
      //===========================================

      const popup = POPUP.build({
        header: this.header,
        id: 'planAttachmentPopup',
      });

      const addAttachmentBtn = button.build({
        text: 'Add Attachment',
        style: 'secondary',
        type: 'text',
        icon: 'add',
        callback: () => addNewAttachment(),
      });
      addAttachmentBtn.type = 'button';

      const removeAttachmentBtn = button.build({
        style: 'secondary',
        type: 'text',
        icon: 'delete',
      });
      removeAttachmentBtn.type = 'button';

      const saveBtn = button.build({
        id: 'attachmentSave',
        text: 'Save',
        style: 'secondary',
        type: 'contained',
        callback: async () => {
          try {
            popup.style.display = 'none';
            pendingSave.show('Saving Attachment Changes');
            await saveAction();
            await this.cleanAttachmentLists(attachmentsAdded, attachmentsToDelete);
            pendingSave.fulfill('Saved');
            setTimeout(async () => {
              successfulSave.hide(false);
              // popup.remove();
              POPUP.hide(popup);
              // refresh attachments
              attachments = new Map();
              const res = await planAjax.getPlanAttachmentsList({
                token: $.session.Token,
                planId,
                section: '',
              });
              res.forEach(attachment => {
                let attArray = [];
                if (attachments.has(attachment.questionId)) {
                  attArray = attachments.get(attachment.questionId);
                }
                attArray.push(attachment);
                attachments.set(attachment.questionId, attArray);
              });
              // build new button
              // const newAttachmentBtn = this.buildAttachmentButton();
              // const oldAttachmentBtn = document.getElementById(`attach-${this.questionId}`);
              // const attachmentParent = oldAttachmentBtn.parentElement;
              // attachmentParent.removeChild(oldAttachmentBtn);
              // attachmentParent.appendChild(newAttachmentBtn);
            }, 2000);
          } catch (error) {
            pendingSave.reject('Error saving attachment changes');
            setTimeout(() => {
              failSave.hide(false);
              popup.style.removeProperty('display');
            }, 2000);
            console.error(error);
          }
        },
      });
      const cancelBtn = button.build({
        id: 'attachmentCancel',
        text: ro ? 'close' : 'cancel',
        style: 'secondary',
        type: 'outlined',
        callback: () => {
          POPUP.hide(popup);
        },
      });
      const reviewAttachmentList = document.createElement('div');
      reviewAttachmentList.classList.add('reviewAttachmentList');
      const newAttachmentList = document.createElement('div');
      newAttachmentList.classList.add('newAttachmentList');
      const newAttachmentsHeader = document.createElement('h5');
      newAttachmentsHeader.innerText = 'Attachments to be added:';
      newAttachmentList.appendChild(newAttachmentsHeader);

      const attachmentInput = document.createElement('input');
      attachmentInput.type = 'file';
      attachmentInput.classList.add('input-field__input', 'attachmentInput');
      attachmentInput.addEventListener('change', evt => fileValidation(evt.target));

      let attachmentContainer = document.createElement('div');
      attachmentContainer.classList.add('attachmentContainer');
      const attachmentList = document.createElement('form');
      attachmentList.setAttribute('id', 'attachmentForm');
      attachmentList.appendChild(attachmentContainer);
      attachmentContainer.appendChild(removeAttachmentBtn);
      attachmentContainer.appendChild(attachmentInput);

      const btnWrap = document.createElement('div');
      btnWrap.classList.add('btnWrap');

      popup.appendChild(reviewAttachmentList);
      if (!ro) {
        popup.appendChild(newAttachmentList);
        popup.appendChild(attachmentList);
        popup.appendChild(addAttachmentBtn);
        btnWrap.appendChild(saveBtn);
      }

      btnWrap.appendChild(cancelBtn);
      popup.appendChild(btnWrap);

      if (attachmentsForQuestion.length > 0) populateExistingAttachments();

      POPUP.show(popup);
    }

    /**
     * Gets the attachment button element
     * @return {HTMLButtonElement} Attachment Button Element
     */
    get attachmentButton() {
      return this.buildAttachmentButton();
    }

    cleanAttachmentLists(attachmentsToAdd, attachmentsToRemove) {
      attachmentsToRemove.forEach(attachmentId => {
        let list = attachments.get(this.questionId);
        let newList = list.filter(a => a.planAttachmentId !== attachmentId);
        attachments.set(this.questionId, newList);
      });
      attachmentsToAdd.forEach(attachment => {
        let list = [];
        if (attachments.has(this.questionId)) {
          list = attachments.get(this.questionId);
        }
        list.push(attachment);
        attachments.set(this.questionId, list);
      });
      if (attachments.has(this.questionId)) {
        this.attachmentsForQuestion = attachments.get(this.questionId);
      } else {
        this.attachmentsForQuestion = [];
      }

      const attachmentBtn = document.getElementById(`attach-${this.questionId}`);
      attachmentBtn.innerText = `ATTACHMENTS (${this.attachmentsForQuestion.length})`;

      const relativeCheckbox = attachmentBtn.parentElement.querySelector('.input-field__input');

      if (this.attachmentsForQuestion.length > 0) {
        attachmentBtn.classList.add('hasAttachments');
        attachmentBtn.classList.remove('error');
      } else {
        attachmentBtn.classList.remove('hasAttachments');
        if (relativeCheckbox.checked) {
          attachmentBtn.classList.add('error');
        } else {
          attachmentBtn.classList.remove('error');
        }
      }
    }
  }

  async function getAttachments(planID) {
    planId = planID;
    attachments = new Map();

    const retData = {
      token: $.session.Token,
      planId,
      section: '',
    };
    const res = await planAjax.getPlanAttachmentsList(retData);
    res.forEach(attachment => {
      let attArray = [];
      if (attachments.has(attachment.questionId)) {
        attArray = attachments.get(attachment.questionId);
      }
      attArray.push(attachment);
      attachments.set(attachment.questionId, attArray);
    });
  }

  return {
    PlanAttachment,
    getAttachments,
  };
})();
