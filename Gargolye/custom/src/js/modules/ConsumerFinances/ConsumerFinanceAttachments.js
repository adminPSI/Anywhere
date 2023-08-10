const consumerFinanceAttachment = (() => {
    let attachments = [];
    class ConsumerFinanceAttachment {

        constructor(header, regId, IsDisabled, attachID) {
            this.attachmentsForQuestion = header;
            this.regId = regId;
            this.IsDisabledBtn = IsDisabled;
            this.attachID = attachID;
        }

        buildAttachmentButton() {
            const attachmentButton = button.build({
                id: `attachConsumer`,
                text: `ATTACHMENTS (${this.attachmentsForQuestion.length})`,
                style: 'secondary',
                type: 'contained',
                callback: () => {
                    this.attachmentPopup();
                },
            });

            attachmentButton.classList.add('attachmentBtn');
            if (this.attachmentsForQuestion.length > 0)
                attachmentButton.classList.add('hasAttachments');

            return attachmentButton;
        }

        attachmentPopup() {
            const regId = this.regId;
            const attachmentsForQuestion = this.attachmentsForQuestion;
            const attachmentsToDelete = [];
            const attachmentsAdded = [];

            // Adds attachments to the existing attachments section in popup
            function populateExistingAttachments() {

                const header = document.createElement('h5');
                header.innerText = 'Existing Attachments:';
                reviewAttachmentList.appendChild(header);

                attachmentsForQuestion.forEach(attachment => {
                    const fileContainer = document.createElement('div');
                    fileContainer.classList.add('reviewAttachmentContainer');
                    fileContainer.setAttribute('id', attachment.attachmentID);
                    fileContainer.setAttribute('delete', false);
                    const removeAttachmentBtn = button.build({
                        style: 'secondary',
                        type: 'text',
                        icon: 'delete',
                        callback: event => addRemoveAttachmentToDeleteList(event.target.parentElement),
                    });
                    const file = document.createElement('p');
                    file.innerText = attachment.description;
                    fileContainer.appendChild(removeAttachmentBtn);
                    fileContainer.appendChild(file);
                    file.addEventListener('click', event => {
                        const attachmentId = event.target.parentElement.id;
                        ConsumerFinancesAjax.viewCFAttachment(attachmentId, '');
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
                                attachmentType: attachment.type,
                                attachment: attachment.arrayBuffer,
                                regId: regId,
                            };

                            ConsumerFinancesAjax.addCFAttachment(saveData).then(res => resolve(res));
                        });
                        attachmentSaveArray.push(saveProm);
                    });

                    const attSaveRes = await Promise.all(attachmentSaveArray);
                    let count = 0;
                    attSaveRes.forEach(att => {
                        attachmentsAdded.push(att);
                    });
                    attachmentArray.forEach(att => {
                        att.attachmentID = attSaveRes[count];
                        attachments.push(att);
                        count++;
                    });

                }
                // DELETE ATTACHMENTS
                attachmentsToDelete.forEach(attachment => {
                    ConsumerFinancesAjax.deleteCFAttachment(attachment);
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
                        attachmentObj.attachmentID = 0;
                        attachmentObj.registerID = 0;
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

                POPUP.hide(popup);
                //NewEntryCF.buildNewEntryForm(regId, attachmentsForQuestion, attachmentsAdded) 
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
                        await saveAction();
                        await this.cleanAttachmentLists(attachmentsAdded, attachmentsToDelete);
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
                text: 'cancel',
                style: 'secondary',
                type: 'outlined',
                callback: () => {
                    POPUP.hide(popup);
                },
            });

            if (this.IsDisabledBtn == true) {
                removeAttachmentBtn.classList.add('disabled');
                saveBtn.classList.add('disabled');
                addAttachmentBtn.classList.add('disabled');
            }
            else {
                removeAttachmentBtn.classList.remove('disabled');
                saveBtn.classList.remove('disabled');
                addAttachmentBtn.classList.remove('disabled');
            }

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

            popup.appendChild(newAttachmentList);
            popup.appendChild(attachmentList);
            popup.appendChild(addAttachmentBtn);
            btnWrap.appendChild(saveBtn);


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
            if (attachmentsToRemove.length > 0) {
                attachments = this.attachmentsForQuestion;
            }
            attachmentsToRemove.forEach(attId => {
                attachments.forEach(attach => {
                    if (attach.attachmentID == attId) {
                        const index = attachments.indexOf(attach);
                        attachments.splice(index, 1)
                        this.attachmentsForQuestion = attachments;
                    }
                });
            });

            attachmentsToAdd.forEach(attId => {
                attachments.forEach(attach => {
                    let isAttacExist = this.attachmentsForQuestion.filter(a => a.attachmentID === attId);
                    if (attach.attachmentID == attId && isAttacExist.length == 0) {
                        this.attachmentsForQuestion.push(attach);
                    }
                });
            });


            const attachmentBtn = document.getElementById(`attachConsumer`);
            attachmentBtn.innerText = `ATTACHMENTS (${this.attachmentsForQuestion.length})`;

            if (this.attachmentsForQuestion.length > 0) {
                attachmentBtn.classList.add('hasAttachments');
            } else {
                attachmentBtn.classList.remove('hasAttachments');
            }

            NewEntryCF.buildNewEntryForm(this.regId, this.attachmentsForQuestion, attachmentsToAdd)
        }
    }

    async function getConsumerFinanceAttachments(regID) {
        attachments = [];
        const retData = {
            token: $.session.Token,
            regId: regID,
        };
        const res = await ConsumerFinancesAjax.getCFAttachmentsList(retData);
        res.forEach(attachment => {
            attachments.push(attachment);
        });
        return attachments;
    }

    return {
        ConsumerFinanceAttachment,
        getConsumerFinanceAttachments,
    };
})();
