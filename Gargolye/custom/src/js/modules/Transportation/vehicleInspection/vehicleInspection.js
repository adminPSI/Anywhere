const TRANS_vehicleInspection = (function () {
  let selectedVehicle, selectedRoute, selectedRouteName, selectedRouteDate, saveBtn;
  let dateInput, timeInput, noteInput, vehicleDropdown, inspectionQuestionBody;
  let isEdit, questionResponses, vehicleInspectionId, readOnly, enteredByOtherUser, inspectionEnterPath, routeInspection;
  let currentlySelectedVehicle;
  let allQuestionsAnswered = true;

  function buildPage(editData) {
    const inspectionDate = isEdit ? 
    UTIL.formatDateToIso(editData.inspectionDate.split(' ')[0]) :
    routeInspection ? 
    selectedRouteDate : UTIL.getTodaysDate();
    const inspectionTIme = isEdit ? editData.inspectionTime : UTIL.getCurrentTime();
    const inspectionNote = isEdit ? editData.note : '';

    // inspection Info Card//
    const inspectionInfoCard = document.createElement("div");
    inspectionInfoCard.classList.add("card");
    const inspectionInfoBody = document.createElement("div");
    inspectionInfoBody.classList.add("card__body");
    inspectionInfoCard.innerHTML = `
    <div class="card__header">Inspection Information</div>
    `;
    inspectionInfoCard.appendChild(inspectionInfoBody)

    //let saveBtn
    let deleteBtn

    if (!readOnly) {
      saveBtn = button.build({
        id: 'saveInspectionBtn',
        text: isEdit ? 'Update' : 'Save',
        style: 'secondary',
        type: 'contained',
        icon: 'save',
        callback: () => {saveInspection()}
      });
      if (isEdit) {
        deleteBtn = button.build({
          id: 'deleteInspectionBtn',
          classNames: 'trans_DeleteBtn',
          text: 'Delete',
          style: 'secondary',
          type: 'contained',
          icon: 'delete',
          callback: () => {deleteInspection()}
        });
      }
    }

    const cancelBtn = button.build({
      id: 'cancelInspectionBtn',
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      icon: 'close',
      callback: () => {
        setActiveModuleSectionAttribute(null);
        switch (inspectionEnterPath) {
          case 'inspectionLanding':
            TRANS_vehicleInspectionLanding.init();
            break;
          case 'addRoute':
          case 'reviewInspections':
              TRANS_inspectionReview.init(false)
              break;
          case 'routeSelection':
            TRANS_myRoute.init()
            break;
          default:
            TRANS_vehicleInspectionLanding.init();
            break;
        }
      }
    });
    dateInput = input.build({
      id: "vehicleInspectionDate",
      label: "Date",
      type: "date",
      style: "secondary",
      value: inspectionDate,
      readonly: readOnly || routeInspection,
      attributes: [{ max: UTIL.getTodaysDate() }],
    });
    timeInput = input.build({
      id: "vehicleInspectionTime",
      label: "Time",
      type: "time",
      value: inspectionTIme,
      readonly: readOnly,
      style: "secondary",
    });
    vehicleDropdown = dropdown.build({
      id: 'vehicleDropdown',
      dropdownId: 'vehicleDropdown',
      readonly: readOnly || routeInspection,
      label: 'Vehicle'
    });
    noteInput = input.build({
      id: 'vehicleInspectionNote',
      classNames: ['autosize'],
      label: 'Note',
      type: 'textarea',
      style: 'secondary',
      value: inspectionNote,
      readonly: readOnly
    });
    // Grid Columns
    const col1 = document.createElement('div');
    col1.classList.add('col-1')
    const col2 = document.createElement('div');
    col2.classList.add('col-2')
    // Route Name Display
    const routeNameDisp = document.createElement('h3');
    routeNameDisp.classList.add('routeNameDisp')
    routeNameDisp.innerHTML = `This inspection is for the route: <span style="color:#366A98">${selectedRouteName}</span>`
    // Entered By Other User Display
    const otherUserDisp = document.createElement('h4');
    otherUserDisp.classList.add('otherUserDisp')
    otherUserDisp.innerHTML = `This inspection was entered by another user. No changes can be made.`
    // Date and time Wrap //
    const dtWrap = document.createElement("div");
    dtWrap.classList.add("vehicleInspectionDTWrap");
    dtWrap.appendChild(dateInput);
    dtWrap.appendChild(timeInput);
    // Save/Cancel button wrap //
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    if (saveBtn) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);
    // Creating inspection item card //
    const inspectionQuestionCard = document.createElement("div");
    const inspectionQuestionHeader = document.createElement("div");
    inspectionQuestionBody = document.createElement("div");
    inspectionQuestionBody.classList.add("card__body");
    inspectionQuestionBody.classList.add("inspectionItemSection");
    inspectionQuestionHeader.classList.add("card__header");
    inspectionQuestionHeader.innerText = "Inspection Items";
    inspectionQuestionCard.classList.add("card");
    inspectionQuestionCard.classList.add("inspectionItemCard");
    inspectionQuestionCard.appendChild(inspectionQuestionHeader);
    inspectionQuestionCard.appendChild(inspectionQuestionBody);
    ///////////////////
    // Append to Grid Columns

    if (selectedRouteName) col1.appendChild(routeNameDisp);
    if (enteredByOtherUser) col1.appendChild(otherUserDisp);
    inspectionInfoBody.appendChild(dtWrap);
    inspectionInfoBody.appendChild(vehicleDropdown);
    inspectionInfoBody.appendChild(noteInput);
    //
    col1.appendChild(inspectionInfoCard)
    col2.appendChild(inspectionQuestionCard);
    col2.appendChild(btnWrap);
    if (deleteBtn) col2.appendChild(deleteBtn);

    DOM.ACTIONCENTER.appendChild(col1)
    DOM.ACTIONCENTER.appendChild(col2)

    DOM.autosizeTextarea();

    populateDropdown()
    buildInspectionQuestions(editData);
    eventListeners()
    checkForAllRequiredFields();
  }

  function eventListeners() {
    dateInput.addEventListener('change', event => {
      if (Date.parse(event.target.value) > UTIL.getTodaysDate(true)) {
        console.warn('future date not allowed')
        UTIL.warningPopup({
          message: 'Future dates are not allowed',
          accept: {
            text: 'Ok'
          },
        })
        event.target.value = UTIL.getTodaysDate();
      }
    });
    vehicleDropdown.addEventListener('change', event => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      currentlySelectedVehicle = selectedOption.value;
      if (selectedOption.value === '') {
        vehicleDropdown.classList.add('error');
        console.warn('No vehicle selected.')
      } else {
        vehicleDropdown.classList.remove('error');
      }
      checkForAllRequiredFields();
    });
  }

  async function buildInspectionQuestions(editData) {
    let completedStatus;
    if (isEdit) {
        completedStatus = await getInspectionDetailsForEdit(editData.inspectionId)
    }
    const questions = TRANS_mainLanding.getCategories();
    questionResponses = new Map();
    questions.forEach((val, key) => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('questionWrapWord'); 
        const questionTitle = document.createElement('h4');
        questionTitle.innerText = val.desc;
        let passCheck = false; 
        let failCheck = false;
        let naCheck = false;
        let allowNA = val.allowNA === 'Y' ? true : false;
        if (isEdit) {
            switch (completedStatus.get(key)) {
                case 'P':
                    passCheck = true;
                    questionResponses.set(key, 'P');
                    break;
                case 'N':
                    naCheck = true;
                    questionResponses.set(key, 'N');
                    break;
                default:
                    failCheck = true;
                    questionResponses.set(key, 'F');
                    break;
            }
        } else {
            questionResponses.set(key, '');
            allQuestionsAnswered = false; // If not in edit mode, mark as not all questions answered
        }
        const passRadio = input.buildRadio({
            id: `${key}-pass`,
            text: "Pass",
            name: key,
            isChecked: passCheck,
            isDisabled: readOnly
        });
        const failRadio = input.buildRadio({
            id: `${key}-fail`,
            text: "Fail",
            name: key,
            isChecked: failCheck,
            isDisabled: readOnly
        });
        passRadio.addEventListener('change', () => {
            questionResponses.set(key, 'P');
            checkAllQuestionsAnswered();
        });
        failRadio.addEventListener('change', () => {
            questionResponses.set(key, 'F');
            checkAllQuestionsAnswered();
        });

        const radioDiv = document.createElement('div');
        radioDiv.classList.add('inspection_radioDiv');
        radioDiv.appendChild(passRadio);
        radioDiv.appendChild(failRadio);
        
        // NA OPTION (only displayed if the inspection category is set to allow NA)
        if (allowNA) {
            const allowNARadio = input.buildRadio({
                id: `${key}-na`,
                text: "N/A",
                name: key,
                isChecked: naCheck,
                isDisabled: readOnly
            });
            allowNARadio.addEventListener('change', () => {
                questionResponses.set(key, 'N');
                checkAllQuestionsAnswered();
            });
            radioDiv.appendChild(allowNARadio);
        }
        questionContainer.appendChild(questionTitle);
        questionContainer.appendChild(radioDiv);
        var lineBR = document.createElement('br');
        questionContainer.appendChild(lineBR);

        inspectionQuestionBody.appendChild(questionContainer);
    });

    // Function to check if all questions are answered
    function checkAllQuestionsAnswered() {
        allQuestionsAnswered = true; // Reset the flag
        questionResponses.forEach(value => {
            if (value === '') {
                allQuestionsAnswered = false;
                return; // Exit forEach loop early if any question is unanswered
            }
        });

        checkForAllRequiredFields();
    }

    // Return the result indicating if all questions are answered
    return allQuestionsAnswered;
}


  async function getInspectionDetailsForEdit(vehicleInspectionId) {
    const completedDetails = (await TRANS_vehicleInspectionAjax.getVehicleInspectionDetails(vehicleInspectionId)).getVehicleInspectionDetailsResult
    const completedDetailsMap = new Map();
    completedDetails.forEach(cat => {
      completedDetailsMap.set(cat.inspectionCategory, cat.categoryStatus);
    })
    return completedDetailsMap
  }

  function populateDropdown() {
    vehicleDropdownData = []
    const vehicles = TRANS_mainLanding.getVehicles();

    vehicles.forEach((val,key,map) => {
      vehicleDropdownData.push({
        value: key,
        text: val.vehicleNumber
      });
    })

    vehicleDropdownData.unshift({value: '', text: ''})
    dropdown.populate(vehicleDropdown, vehicleDropdownData, selectedVehicle)
    currentlySelectedVehicle = selectedVehicle
    if (!selectedVehicle) vehicleDropdown.classList.add('error')
  }

 async function saveInspection() {
   // Date Time Vehicle are required
   // Check if inspection categories are complete
   const inspectionCategories = []
   const inspectionStatus = []
   pendingSave.show('Saving Inspection...')
   try {
    // Check for errors first
    const errors = document.querySelectorAll('.error');
    if (errors.length > 0) throw "err exist"
    // Check that all inspection items have been answered
    questionResponses.forEach((val,key,map) => {
      if (val === "") {
        console.error(`Save Failed. Inspection category id ${key} is registering as not complete`)
        throw "You must complete all Inspection Items"
      } else {
        inspectionCategories.push(key)
        inspectionStatus.push(val)
      }
    })
    const note = noteInput.querySelector('textarea').value
    const date = dateInput.querySelector('input').value
    const time = timeInput.querySelector('input').value
    const vddElement = document.getElementById('vehicleDropdown');
    const vehicleId = vddElement.options[vddElement.selectedIndex].value;

    const mainData = {
      token: $.session.Token,
      vehicleInspectionId: vehicleInspectionId,
      vehicleInformationId: vehicleId,
      tripCompletedId: selectedRoute ? selectedRoute : '',
      inspectionDate: date,
      inspectionTime: time,
      notes: UTIL.removeUnsavableNoteText(note)
    }
    if (isEdit) {
      await TRANS_vehicleInspectionAjax.updateVehicleInspection(mainData)
    } else {
      vehicleInspectionId = (await TRANS_vehicleInspectionAjax.insertVehicleInspection(mainData)).insertVehicleInspectionResult[0].vehicleInspectionId;
    }

    const detailData = {
      token: $.session.Token,
      vehicleInspectionId: vehicleInspectionId,
      inspectionCatString: inspectionCategories.join("|"),
      inspectionStatusString: inspectionStatus.join("|")
    }
    await TRANS_vehicleInspectionAjax.insertUpdateVehicleInspectionDetails(detailData)
    pendingSave.fulfill('Save Successful')
    setTimeout(() => {
      successfulSave.hide()
      // What happens after a succesful save depends on how the entered the module
      switch (inspectionEnterPath) {
        case 'inspectionLanding':
          // If they came from the inspection landing page, go back to the landing page
          TRANS_vehicleInspectionLanding.init();
          break;
        case 'addRoute':
        case 'reviewInspections':
            // If they just added a new route, or were reviewing an inspection, take them to the review table
            TRANS_inspectionReview.init(false)
            break;
        case 'routeSelection':
          // If they came from the my route selection popup, take them back to my routes
          TRANS_myRoute.init()
          break;
        default:
          init({enterPath: 'inspectionLanding'})
          break;
      }
    }, 2000);
   } catch (error) {
    if (error === 'err exist') {
      pendingSave.reject('Failed to save. Please correct any errors that exist on the route.');
      console.error('Failing due to option highlighted in red. Check to make sure all required items have been completed.');
    } else {
      pendingSave.reject(`Failed to save inspection. ${error}`);
      console.error('Unspecified Error');
      console.error(error);
    }
     setTimeout(() => failSave.hide(), 4000);
   }
  }

  function deleteInspection() {
    async function acceptDelete() {
      pendingSave.show('Deleting Inspection...')
      try {
        await TRANS_vehicleInspectionAjax.deleteVehicleInspection(vehicleInspectionId)
        pendingSave.fulfill('Inspection Deleted')
        setTimeout(() => {
          successfulSave.hide()
          // What happens after a delete depends on how the entered the module
          switch (inspectionEnterPath) {
            case 'inspectionLanding':
              // If they came from the inspection landing page, clear, and start a new inspection
              TRANS_vehicleInspectionLanding.init();
              break;
            case 'addRoute':
            case 'reviewInspections':
                // If they just added a new route, or were reviewing an inspection, take them to the review table
                TRANS_inspectionReview.init(false)
                break;
            case 'routeSelection':
              // If they came from the my route selection popup, take them back to my routes
              TRANS_myRoute.init()
              break;
            default:
              TRANS_vehicleInspectionLanding.init();
              break;
          }
        }, 2000);
      } catch (error) {
        pendingSave.reject(error)
        setTimeout(() => failSave.hide(), 2000);
      }
    }
    UTIL.warningPopup({
      message: 'Are you sure you would like to delete this vehicle inspection?',
      hideX: true,
      accept: {
        text: 'Delete',
        callback: acceptDelete
      },
      reject: {
        text: 'Cancel'
      }
    })
  }

  function clearVar() {
    selectedVehicle =  null;
    selectedRoute =  null;
    isEdit =  null;
    questionResponses =  null;
    vehicleInspectionId =  null;
    readOnly =  null;
    enteredByOtherUser = null;
    currentlySelectedVehicle = null;
  }

  function checkForAllRequiredFields() {
    if (readOnly) {
      return;
    }

    if (!currentlySelectedVehicle || currentlySelectedVehicle === '' || allQuestionsAnswered === false) {
        // If no vehicle is selected, disable the save button and add the 'disabled' class
        saveBtn.disabled = true;
        saveBtn.classList.add('disabled');
    } else {
        // If a vehicle is selected, enable the save button and remove the 'disabled' class
        saveBtn.disabled = false;
        saveBtn.classList.remove('disabled');
    }
}

  /**
   *
   * @param {object} opts
   * @param {string} opts.vehicleId
   * @param {string} [opts.routeId]
   */
  function init(opts = {rId: null, vId: null, edit: false, editData: null, routeName: null, routeDate: null, batchedRoute: false}) {
    clearVar();
    const { vId, rId, editData, edit, enterPath, routeName, routeDate, batchedRoute } = opts
    selectedVehicle = vId;
    selectedRoute = rId;
    routeInspection = rId ? true : false;
    selectedRouteDate = routeDate;
    selectedRouteName = routeName;
    isEdit = edit;
    inspectionEnterPath = enterPath;

    DOM.scrollToTopOfPage();
    DOM.clearActionCenter();
    setActiveModuleSectionAttribute("vehicleInspection");

    if (edit) {
      vehicleInspectionId = editData.inspectionId
      if (batchedRoute) {
        readOnly = true;
      } else if (editData.enteredById.toLowerCase() !== $.session.UserId.toLowerCase()) {
        readOnly = true;
      } else if ($.session.transportationUpdate === false) {
        readOnly = true;
      } else {
        readOnly = false;
      }
      enteredByOtherUser = editData.enteredById.toLowerCase() === $.session.UserId.toLowerCase() ? false : true;
    } else {
      readOnly = false;
    }

    buildPage(editData);
  }
  return {
    init,
  };
})();
