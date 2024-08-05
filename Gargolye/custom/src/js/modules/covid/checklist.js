const covidChecklist = (function () {
    let inputs, checklistTable, tableContainer;
    let completedChecklistData, activeChecklistId, rosterLocations;
    let checklistMode; //'update' || 'insert'
    let typeOfChecklist; // 'employee' || 'consumer'
    let initialLoad;
    let consumer;

    function buildEmployeePage() {
        ////////////////////
        // Main Checklist Card Element
        const checklistCard = document.createElement("div");
        checklistCard.classList.add("card", "checklistCard");
        ////////////////////
        // Heading for checklist card
        const mainHeading = document.createElement("div");
        mainHeading.classList.add("card__header");
        mainHeading.innerHTML =
            typeOfChecklist === "employee"
                ? "<h2>My Covid-19 Checklist</h2>"
                : "<h2>Consumer Covid-19 Checklist</h2>";
        checklistCard.appendChild(mainHeading);
        ////////////////////
        // Consumer Name display (Consumer Checklist only)
        if (typeOfChecklist === "consumer") {
            const consumerNameDisplay = document.createElement("p");
            consumerNameDisplay.classList.add("currConsumerDisp");
            consumerNameDisplay.innerHTML = `Checklist for: <span>${consumer.name}</span>`;
            checklistCard.appendChild(consumerNameDisplay);
        }
        ////////////////////
        //Top Questions
        const mainSection = document.createElement("div");
        mainSection.classList.add("card__body", "covidEmployeeCard_details");
        checklistCard.appendChild(mainSection);
        mainSection.appendChild(inputs.dateInput);
        mainSection.appendChild(inputs.timeInput);
        mainSection.appendChild(inputs.locationDropdown);
        mainSection.appendChild(inputs.settingInput);
        ////////////////////
        // Symptom Questions
        const symptomHeading = document.createElement("h3");
        symptomHeading.classList.add("covidSubHeading");
        symptomHeading.innerText = "Symptoms";
        const symptomSection = document.createElement("div");
        symptomSection.classList.add("symptomSection");
        mainSection.appendChild(symptomHeading);
        inputs.symptomElements.forEach((el) => {
            symptomSection.appendChild(el);
        });
        symptomSection.appendChild(inputs.otherInput);
        mainSection.appendChild(symptomSection);
        ////////////////////
        // Buttons
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("btnWrap");
        const buttonDiv2 = buttonDiv.cloneNode();
        buttonDiv2.id = "editButtonDiv";
        buttonDiv2.style.display = "none";
        buttonDiv.appendChild(inputs.saveBtn);
        buttonDiv.appendChild(inputs.cancelBtn);
        buttonDiv2.appendChild(inputs.deleteBtn);
        mainSection.appendChild(buttonDiv);
        mainSection.appendChild(buttonDiv2);
        ////////////////////
        // Warning about not a checklist you didn't create
        // (consumer only, they can't edit or delete them)
        if (typeOfChecklist === "consumer") {
            const noEditWarning = document.createElement("div");
            noEditWarning.innerHTML = `<p>This record was created by another user. 
      Deleting and editing is disabled.</p>`;
            noEditWarning.classList.add("covidNoEdit");
            noEditWarning.style.display = "none";
            mainSection.appendChild(noEditWarning);
        }
        ////////////////////
        // Adding Card and table to action center
        DOM.ACTIONCENTER.appendChild(checklistCard);
        tableContainer = document.createElement("div");
        tableContainer.classList.add("covidTableContainer");
        DOM.ACTIONCENTER.appendChild(tableContainer);
        tableContainer.appendChild(checklistTable);
        ////////////////////
        // After Build actions
        populateLocationDropdown();
        populateTable(UTIL.getTodaysDate(false));
    }

    function buildEmployeeChecklistTable() {
        const date = UTIL.formatDateFromIso(UTIL.getTodaysDate());
        checklistTable = table.build({
            tableId: "employeeChecklistTable",
            headline: `Completed Checklists for ${date}`,
            columnHeadings: ["Time", "Location", "Setting"],
        });

        // Set the data type for each header, for sorting purposes
        const headers = checklistTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'date'); // Time
        headers[1].setAttribute('data-type', 'string'); // Location
        headers[2].setAttribute('data-type', 'string'); //Setting


        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(checklistTable);
    }

    async function populateTable(date) {
        try {
            completedChecklistData = {};
            const peopleId =
                typeOfChecklist === "employee" ? $.session.PeopleId : consumer.id;
            const consumerChecklist = typeOfChecklist === 'consumer' ? 'T' : 'F';
            const checklistResult = (
                await covidAjax.getCovidChecklists(peopleId, date, consumerChecklist)
            ).getIndividualsCovidDetailsResult;
            // Update Table Header //
            const displayDate = UTIL.formatDateFromIso(date);
            const tableHeader = document
                .getElementById("employeeChecklistTable")
                .querySelector(".table__headline")
                .getElementsByTagName("h2")[0];
            tableHeader.innerText = `Completed Checklists for ${displayDate}`;
            ///////////////////
            // Break Down Data //
            checklistResult.forEach((checklist) => {
                //Create Completed Checklist Object//
                const checklistData = {
                    enteredBy: checklist.enteredBy,
                    time: checklist.assessmentTime,
                    locationId: checklist.locationId,
                    setting: checklist.settingType,
                    cough: checklist.cough,
                    diarrhea: checklist.diarrhea,
                    fever: checklist.fever,
                    malaise: checklist.malaise,
                    nasalCong: checklist.nasalCong,
                    nausea: checklist.nausea,
                    tasteAndSmell: checklist.tasteAndSmell,
                    other: checklist.notes,
                    shortnessBreath: checklist.shortnessBreath,
                    soreThroat: checklist.soreThroat,
                };
                completedChecklistData[checklist.assessmentId] = checklistData;
            });
            // Create Table Data for populating table //
            let tableData = []
            checklistResult.forEach((checklist) => {
                let location
                try {
                    location = rosterLocations[checklist.locationId].name;
                } catch (error) {
                    console.info(`NOTICE: skipping record ${checklist.assessmentId}. User might not have permission to locaiton ${checklist.locationId}`)
                    return;
                }
                const time = UTIL.formatTimeString(checklist.assessmentTime);
                const setting = checklist.settingType;
                tableData.push({
                    values: [time, location, setting],
                    id: checklist.assessmentId,
                    onClick: () => {
                        // Clicking on row of a table goes into edit mode //
                        activeChecklistId = checklist.assessmentId;
                        covidChecklistActions.loadChecklist(
                            checklist.assessmentId,
                            completedChecklistData,
                            inputs
                        );
                        inputs.saveBtn.innerText = "Update";
                        inputs.saveBtn.setAttribute("data-function", "update");
                        checklistMode = "update";
                        // If they didn't create the checklist they can't make changes to it
                        if (typeOfChecklist === "consumer") {
                            if (checklist.enteredBy.toLowerCase() !== $.session.UserId.toLowerCase()) {
                                inputs.saveBtn.classList.add("disabled");
                                document.querySelector(".covidNoEdit").style.display = "block";
                                document.getElementById("editButtonDiv").style.display = "none";
                            } else {
                                inputs.saveBtn.classList.remove("disabled");
                                document.querySelector(".covidNoEdit").style.display = "none";
                                document.getElementById("editButtonDiv").style.display = "flex";
                            }
                        } else {
                            inputs.saveBtn.classList.remove("disabled");
                            document.getElementById("editButtonDiv").style.display = "flex";
                        }
                    },
                });
            });

            table.populate(checklistTable, tableData);
        } catch (error) {
            console.error(error);
        }
    }

    function populateLocationDropdown() {
        const rawLocations = covidLanding.locations();
        rosterLocations = {};

        const dropdownData = rawLocations.map((location) => {
            const id = location.ID;
            const name = location.Name;
            // rosterLocations Object is used for getting the Name of the location
            // in the Completed checklist table
            rosterLocations[id] = { name: name };

            return {
                text: name,
                value: id,
            };
        });
        const defaultLocation = defaults.getLocation('roster')
        dropdown.populate(inputs.locationDropdown, dropdownData, defaultLocation);
    }

    function eventListeners() {
        // changing date re-populates the completed checklist table for that date
        inputs.dateInput.addEventListener("input", () => {
            const newDate = inputs.dateInput.firstChild.value
            roster2.updateSelectedDate(newDate);
            populateTable(newDate);
        });
        // After records are saved, or deleted the checklist gets reset to default values
        inputs.saveBtn.addEventListener("click", () => {
            const peopleId =
                typeOfChecklist === "employee" ? $.session.PeopleId : consumer.id;
            covidChecklistActions.insertUpdateChecklist(
                inputs,
                activeChecklistId,
                peopleId,
                typeOfChecklist,
                resetChecklist
            );
        });
        /* 
          When in 'edit mode' the cancel button resets any changes
          sets the checklist back to defaults, and sets the mode to 'insert'.
          When in 'insert new record mode' cancel button goes
          back to the covid landing page.
         */
        inputs.cancelBtn.addEventListener("click", () => {
            if (checklistMode === "update") {
                resetChecklist();
            } else {
                covidChecklistActions.cancel();
            }
        });
        inputs.deleteBtn.addEventListener("click", () => deleteConfirmation());
    }
    // Resets the checkist back to the way it was when first entering the page.
    function resetChecklist() {
        covidChecklistActions.clearChecklist(inputs);
        activeChecklistId = null;
        inputs.saveBtn.innerText = "Save";
        inputs.saveBtn.setAttribute("data-function", "insert");
        checklistMode = "insert";
        if (typeOfChecklist === "consumer") {
            inputs.saveBtn.classList.remove("disabled");
            document.querySelector(".covidNoEdit").style.display = "none";
        }
        document.getElementById("editButtonDiv").style.display = "none";
    }

    async function deleteChecklist() {
        try {
            pendingSave.show("Deleting...");
            await covidAjax.deleteCovidChecklist(activeChecklistId);
            resetChecklist();
            pendingSave.fulfill("Delete Successful");
            setTimeout(() => {
                successfulSave.hide();
            }, 1000);
        } catch (err) {
            console.error(err);
            pendingSave.reject("Delete Failed. Please Try Again.");
            setTimeout(() => failSave.hide(), 2000);
            resetChecklist();
        }
    }

    function deleteConfirmation() {
        const popup = POPUP.build({
            id: "deleteWarningPopup",
            classNames: "warning",
        });
        const btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        const yesBtn = button.build({
            text: "Yes",
            style: "secondary",
            type: "contained",
            icon: "checkmark",
            callback: function () {
                POPUP.hide(popup);
                deleteChecklist();
            },
        });
        const noBtn = button.build({
            text: "No",
            style: "secondary",
            type: "contained",
            icon: "close",
            callback: function () {
                POPUP.hide(popup);
            },
        });
        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        const warningMessage = document.createElement("p");
        warningMessage.innerHTML =
            "Are you sure you would like to delete this completed COVID-19 Checklist?";
        popup.appendChild(warningMessage);
        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }

    function handleActionNavEvent(target) {
        const targetAction = target.dataset.actionNav;
        switch (targetAction) {
            case "miniRosterDone": {
                if (initialLoad) {
                    initialLoad = false;
                    const activeConsumer = roster2.getActiveConsumers();
                    activeConsumer.forEach((consumer) => {
                        roster2.removeConsumerFromActiveConsumers(consumer.id);
                    });
                    consumer.name = activeConsumer[0].card.innerText;
                    consumer.id = activeConsumer[0].id;
                    DOM.toggleNavLayout();
                    buildEmployeeChecklistTable();
                    buildEmployeePage();
                    eventListeners();
                } else {
                    const activeConsumer = roster2.getActiveConsumers();
                    if (activeConsumer.length > 0) {
                        activeConsumer.forEach((consumer) => {
                            roster2.removeConsumerFromActiveConsumers(consumer.id);
                        });
                    }
                    consumer.name = activeConsumer[0].card.innerText;
                    consumer.id = activeConsumer[0].id;
                    document.querySelector('.currConsumerDisp').innerHTML = `Checklist for: <span>${consumer.name}</span>`
                    DOM.toggleNavLayout();
                    resetChecklist();
                }
                break;
            }
            case "miniRosterCancel": {
                if (initialLoad) {
                    covidLanding.init();
                } else {
                    DOM.toggleNavLayout();
                    roster2.clearActiveConsumers();
                }
                break;
            }
        }
    }

    function init(type) {
        typeOfChecklist = type;
        checklistMode = "insert";
        initialLoad = true;
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        inputs = covidChecklistElements.init();
        switch (typeOfChecklist) {
            case "employee":
                setActiveModuleSectionAttribute("checklist");
                buildEmployeeChecklistTable();
                buildEmployeePage();
                eventListeners();
                break;
            case "consumer":
                consumer = {};
                setActiveModuleSectionAttribute("checklist");
                roster2.miniRosterinit(null, {hideDate: true})
                roster2.showMiniRoster({ hideDate: true });
                break;
            default:
                covidLanding.init();
                break;
        }
    }
    return {
        init,
        handleActionNavEvent,
    };
})();
