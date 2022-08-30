const cnAttachment = (function() {
  // Elements
  let attachmentList,
    attachmentInput,
    attachmentContainer,
    addAttachmentBtn,
    removeAttachmentBtn;
  let reviewAttachmentList, newAttachmentList;
  // Data
  let cnId;
  let attachmentsToDelete, reviewAttachmentArray;

    let isSSANote;
    let isBatched;

  const allowedFileTypes = [
    
  ]

  function attachmentPopup() {
    const popup = POPUP.build({
      header: "Attachments",
      id: "cnAttachmentPopup"
    });

    addAttachmentBtn = button.build({
      text: "Add Attachment",
      style: "secondary",
      type: "text",
      icon: "add",
      callback: addNewAttachment
    });
    addAttachmentBtn.type = "button";
    removeAttachmentBtn = button.build({
      style: "secondary",
      type: "text",
      icon: "delete"
    });
    removeAttachmentBtn.type = "button";
    addRemoveAttachmentEventListener(removeAttachmentBtn);
    const saveBtn = button.build({
      id: "attachmentSave",
      text: "Done",
      style: "secondary",
      type: "contained",
      callback: () => {
        saveAction();
        POPUP.hide(popup);
      }
    });
    const cancelBtn = button.build({
      id: "attachmentCancel",
      text: "cancel",
      style: "secondary",
      type: "outlined",
      callback: () => {
        POPUP.hide(popup);
      }
    });

    reviewAttachmentList = document.createElement("div");
    reviewAttachmentList.classList.add("reviewAttachmentList");
    newAttachmentList = document.createElement("div");
    newAttachmentList.classList.add("newAttachmentList");
    const newAttachmentsHeader = document.createElement("h5");
    newAttachmentsHeader.innerText = "Attachments to be added:";
    if (isBatched === '' || isBatched === null) {
        newAttachmentList.appendChild(newAttachmentsHeader);
    }

    attachmentInput = document.createElement("input");
    attachmentInput.type = "file";
    attachmentInput.classList.add("input-field__input", "attachmentInput");
    attachmentInput.onchange = (event) => fileValidation(event.target);

    attachmentContainer = document.createElement("div");
    attachmentContainer.classList.add("attachmentContainer");
    attachmentList = document.createElement("form");
    attachmentList.setAttribute("id", "attachmentForm");
    if (isBatched === '' || isBatched === null) {
        attachmentList.appendChild(attachmentContainer);
        attachmentContainer.appendChild(removeAttachmentBtn);
        attachmentContainer.appendChild(attachmentInput);
    }
    // attachmentContainer.appendChild(addAttachmentBtn);

    const btnWrap = document.createElement("div");
    btnWrap.classList.add("btnWrap");


    

    popup.appendChild(reviewAttachmentList);
    popup.appendChild(newAttachmentList);
    popup.appendChild(attachmentList);
    if (isBatched === '' || isBatched === null) {
        popup.appendChild(addAttachmentBtn);
    }
    

    btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);
    popup.appendChild(btnWrap);
    POPUP.show(popup);
  }

  function fileValidation(target) {
    const fileType = target.files[0].type;
    const reFileTypeTest = new RegExp('(audio\/)|(video\/)')
    if (reFileTypeTest.test(fileType)) {
      alert('Anywhere currently does not accept audio or video files')
      target.value = '';
      return false
    }
  }

  function addNewAttachment() {
    // Don't add new attachment input if the last attachment is empty
    const form = document.getElementById("attachmentForm");
    const lastAttachment = form.lastChild;
    if (
      lastAttachment &&
      lastAttachment.querySelector(".attachmentInput").value === ""
    ) {
      return;
    }
    const newFileContainer = attachmentContainer.cloneNode(true);
    newFileContainer.getElementsByTagName("input")[0].value = ""; //remove file for new container
    newFileContainer.getElementsByTagName("input")[0].onchange = (event) => fileValidation(event.target);
    attachmentList.appendChild(newFileContainer);
    addRemoveAttachmentEventListener(newFileContainer.firstElementChild);
    attachmentContainer = newFileContainer;
  }

  function addRemoveAttachmentEventListener(btn) {
    btn.addEventListener("click", event => {
      const fileInput = event.target.parentElement.getElementsByTagName(
        "input"
      )[0];
      if (fileInput !== "") {
        event.target.parentElement.remove();
      }
    });
  }

  function saveAction() {
    deleteExistingAttachment()
    const attachmentInputs = document.querySelectorAll(".attachmentInput");
    if (attachmentInputs.length === 0) {
      console.log("no attachments");
      return;
    }

    let attachmentProms = [];
    let attachmentArray = [];
    attachmentInputs.forEach(inputElement => {
      if (inputElement.value === "") {
        return;
      }
      const attPromise = new Promise(resolve => {
        const attachmentObj = {};
        const attachmentFile = inputElement.files.item(0);
        const attachmentName = attachmentFile.name;
        const attachmentType = attachmentFile.name.split(".").pop();
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

    Promise.all(attachmentProms).then(res => {
      attachmentsToDelete.forEach(remAttachment => {
        reviewAttachmentArray = reviewAttachmentArray.filter(attachment => attachment.attachmentId !== remAttachment);
      })
     // 
     if (isSSANote) {
      noteSSA.addAttachmentsToCN(attachmentArray, reviewAttachmentArray);
     } else {
      note.addAttachmentsToCN(attachmentArray, reviewAttachmentArray);
     }
   
    });
   // (isSSANote) ? noteSSA.addAttachmentsToCN(attachmentArray, reviewAttachmentArray) : note.addAttachmentsToCN(attachmentArray, reviewAttachmentArray);
  }

  function addRemoveAttachmentToDeleteList(attachmentElement) {
    const currentDeleteStatus = attachmentElement.getAttribute('delete');
    const attachmentId = attachmentElement.getAttribute('id');
    switch (currentDeleteStatus) {
      case 'false':
        attachmentElement.classList.add('deleteAttachment')
        attachmentsToDelete.push(attachmentId);
        attachmentElement.setAttribute('delete', true)
        break;
      case 'true':
        attachmentElement.classList.remove('deleteAttachment')
        attachmentsToDelete = attachmentsToDelete.filter(attachment => attachment !== attachmentId);
        attachmentElement.setAttribute('delete', false)
        break;
      default:
        break;
    }
  }

  function deleteExistingAttachment() {
    attachmentsToDelete.forEach(attachment => {
      caseNotesAjax.deleteCaseNoteAttachment(cnId, attachment);
    })
  }

  function populateExistingAttachments(reviewAttachments) {
    const header = document.createElement("h5");
    header.innerText = "Existing Attachments:";
    reviewAttachmentList.appendChild(header);
    //console.table(reviewAttachments)

    reviewAttachments.forEach(attachment => {
      const fileContainer = document.createElement("div");
      fileContainer.classList.add("reviewAttachmentContainer");
      fileContainer.setAttribute('id', attachment.attachmentId)
      fileContainer.setAttribute('delete', false)
      
        const removeAttachmentBtn = button.build({
            style: "secondary",
            type: "text",
            icon: "delete",
            callback: event => addRemoveAttachmentToDeleteList(event.target.parentElement)
        });
           
      const file = document.createElement("p");
      file.innerText = attachment.description;
        if (isBatched === '' || isBatched === null) {
            fileContainer.appendChild(removeAttachmentBtn);
        }
      fileContainer.appendChild(file);
      file.addEventListener('click', event => {
        const attachmentId  = event.target.parentElement.id;
        caseNotesAjax.viewCaseNoteAttachment(attachmentId)
      })
      reviewAttachmentList.appendChild(fileContainer);
    }) 
  }

  function populateNewAttachments(newAttachments) {

      newAttachments.forEach(attachment => {
        const fileContainer = document.createElement("div");
        fileContainer.classList.add("newAttachmentContainer");
        if (isSSANote) {
          const removeAttachmentBtn = button.build({
            style: "secondary",
            type: "text",
            icon: "delete",
            callback: event => {
              const attachmentName = event.target.parentElement.getElementsByTagName('p')[0].innerText;
              noteSSA.removeAttachmentFromTempAttachmentArray(attachmentName);
              event.target.parentElement.remove();
            }
          });
        } else {
          const removeAttachmentBtn = button.build({
            style: "secondary",
            type: "text",
            icon: "delete",
            callback: event => {
              const attachmentName = event.target.parentElement.getElementsByTagName('p')[0].innerText;
              note.removeAttachmentFromTempAttachmentArray(attachmentName);
              event.target.parentElement.remove();
            }
          });
        }
        
        const file = document.createElement("p");
        file.innerText = attachment.description;
        if (isBatched === '' || isBatched === null) {
            fileContainer.appendChild(removeAttachmentBtn);
        }
        fileContainer.appendChild(file);
        newAttachmentList.appendChild(fileContainer);
      });
  }

  function init(newAttachments, reviewAttachments, cnBatched, caseNoteId = null, SSANote = false) {
    isSSANote = SSANote;
    cnId = caseNoteId;
    isBatched = cnBatched;
    attachmentsToDelete = []
    reviewAttachmentArray = reviewAttachments;
    attachmentPopup();
    if (newAttachments.length !== 0) populateNewAttachments(newAttachments);
    if (reviewAttachments.length !== 0) populateExistingAttachments(reviewAttachments);
  }

  return {
    init
  };
})();
