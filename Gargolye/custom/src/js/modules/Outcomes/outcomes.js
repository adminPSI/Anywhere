var outcomes = (function () {
    var OUTCOMES_SECTION;

    // Filter DOM
    var filterPopup;
    var filterButton;
    var dateInput;
    var serviceDropdown;
    var outcomeDropdown;
    var applyButton;
    //const currentFilterDisplay = document.createElement("div");
    // Filter Values
    var currDate;
    var currService;
    var currOutcome;
    var currOutcomeId;
    // Data
    //----------------------------
    var selectedConsumerObj;
    var selectedConsumerId;
    let selectedConsume;
    // front card data
    var outcomesDataObj;
    var outcomesPrompts;
    var outcomesLocations;
    // back card dom (popup)
    var detailsPopup;
    var primaryLocationDropdown;
    var secondaryLocationDropdown;
    var resultsDropdown;
    var promptsDropdown;
    var attemptsDropdown;
    var cIDropdown;
    var timeInputs;
    var saveBtn;
    var deleteBtn;
    var noteInput;
    var enteredByUser;
    var edit__lastEditedByDetails;
    // back card data
    var ciData;
    var successObj;
    var successType;
    var successDetails;
    var currResult = "";
    var currReason = "";
    var currAttempts = "";
    var currPrompt = "";
    var currCI = "";
    var currNote = "";
    var currStartTime = "";
    var currEndTime = "";
    var defaultObjLocationId;
    var defaultGoalLocationId;
    // save/update data
    var personId;
    var objectiveId;
    var activityId;
    var objdate;
    var success;
    var goalnote;
    var promptType;
    var promptNumber;
    var locationId;
    var locationSecondaryId;
    var goalStartTime;
    var goalEndTime;
    var goalCILevel;
    // other
    var dateSpanMessage;
    var daysBack;
    var daysBackDate;
    var useConsumerLocation;
    var defaultPrimaryLocation;
    var currentSection;
    var todaysDateToDisplay;
    var firstDayOfWeek;
    var lastDayOfWeek;
    var firstDayOfMonth;
    var lastDayOfMonth;
    var yearOfCurrentDay;
    var dailyAbsent = false;
    var consumerName;
    const todaysDate = UTIL.getTodaysDate();
    let initLoad

    let btnWrap;
    let serviceBtnWrap;
    let outcomeTypeBtnWrap;
    var tmpService;
    var tmpOutcome;
    var tmpOutcomeId;
    let editOutcomeBtn;

    // Workers
    //------------------------------------
    function disableNewOutcomeFields() {
        attemptsDropdown.classList.add("disabled");
        promptsDropdown.classList.add("disabled");
        cIDropdown.classList.add("disabled");
        timeInputs.start.classList.add("disabled");
        timeInputs.end.classList.add("disabled");
        //noteInput.classList.add('disabled');
    }
    function disableOutcomeFieldsOtherUser() {
        primaryLocationDropdown.classList.add("disabled");
        secondaryLocationDropdown.classList.add("disabled");
        resultsDropdown.classList.add("disabled");
        attemptsDropdown.classList.add("disabled");
        promptsDropdown.classList.add("disabled");
        cIDropdown.classList.add("disabled");
        timeInputs.start.classList.add("disabled");
        timeInputs.end.classList.add("disabled");
        // noteInput.classList.add('disabled');
        noteInput
            .querySelector(".input-field__input")
            .setAttribute("readonly", "true");
        saveBtn.classList.add("disabled");
        deleteBtn.classList.add("disabled");
    }

    function clearBackCardValues() {
        //ciData = '';
        successObj = "";
        successType = "";
        successDetails = "";
        currReason = "";
        currAttempts = "";
        currPrompt = "";
        currCI = "";
        currNote = "";
        currStartTime = "";
        currEndTime = "";
        goalnote = "";
        promptType = null;
        promptNumber = null;
        locationId = null;
        locationSecondaryId = null;
        goalStartTime = null;
        goalEndTime = null;
        goalCILevel = null;
    }
    function sortOutcomes(results) {
        outcomesDataObj = {};

        results.forEach(res => {
            var occurrence = res.Objective_Recurrance
                ? res.Objective_Recurrance
                : "NF";

            if (!outcomesDataObj[occurrence]) {
                outcomesDataObj[occurrence] = [];
            }

            res.nullHourDaySuccesses =
                res.nullHourDaySuccesses !== ""
                    ? res.nullHourDaySuccesses.split(",")
                    : [];
            res.weekSuccesses =
                res.weekSuccesses !== "" ? res.weekSuccesses.split(",") : [];
            res.monthSuccesses =
                res.monthSuccesses !== "" ? res.monthSuccesses.split(",") : [];
            res.yearSuccesses =
                res.yearSuccesses !== "" ? res.yearSuccesses.split(",") : [];

            outcomesDataObj[occurrence].push(res);
        });
    }
    function sortOutcomeLocations(results) {
        outcomesLocations = {};

        results.forEach(res => {
            if (!outcomesLocations[res.type]) {
                outcomesLocations[res.type] = [];
            }

            outcomesLocations[res.type].push(res);
        });
        outcomesLocations["Primary"].sort(function (a, b) {
            if (a.description < b.description) {
                return -1;
            }
            if (a.description > b.description) {
                return 1;
            }
            return 0;
        });

        if (outcomesLocations.Secondary) {
            outcomesLocations["Secondary"].sort(function (a, b) {
                if (a.description < b.description) {
                    return -1;
                }
                if (a.description > b.description) {
                    return 1;
                }
                return 0;
            });
        }
    }
    function sortSuccessTypes(results) {
        unOrderedSuccessObj = {};
        successObj = {};

        results.forEach(st => {
            var label = st.Objective_Success_Description;
            if (!unOrderedSuccessObj[label]) {
                unOrderedSuccessObj[label] = st;
            }
        });

        Object.keys(unOrderedSuccessObj)
            .sort()
            .forEach(key => {
                successObj[key] = unOrderedSuccessObj[key];
            });
    }
    function getObjectiveActivities(outcome) {
        var objectiveRecurrance = outcome.Objective_Recurrance;
        if (objectiveRecurrance === "") objectiveRecurrance = "NF";
        var activities;

        switch (objectiveRecurrance) {
            case "NF": {
                activities = outcome.nullHourDaySuccesses;
                break;
            }
            case "H": {
                activities = outcome.nullHourDaySuccesses;
                break;
            }
            case "D": {
                activities = outcome.nullHourDaySuccesses;
                break;
            }
            case "W": {
                activities = outcome.weekSuccesses;
                break;
            }
            case "M": {
                activities = outcome.monthSuccesses;
                break;
            }
            case "Y": {
                activities = outcome.yearSuccesses;
                break;
            }
        }

        return activities;
    }
    // Save/Update/Delete
    //------------------------------------
    function initSaveData(outcome) {
        personId = selectedConsumerId;
        activityId = 0;
        objectiveId = outcome.Objective_id;
        objdate = currDate;
    }
    function saveNewOutcome() {
        getInputValues();
        goalnote = UTIL.removeUnsavableNoteText(goalnote); //fix note with bad text
        var newOutcomeData = {
            personId,
            objectiveId,
            activityId,
            objdate,
            success,
            goalnote: !goalnote ? "" : goalnote,
            promptType: !promptType ? "0" : promptType,
            promptNumber: !promptNumber ? "0" : promptNumber,
            locationId,
            locationSecondaryId: !locationSecondaryId ? 0 : locationSecondaryId,
            goalStartTime: !goalStartTime ? "" : goalStartTime,
            goalEndTime: !goalEndTime ? "" : goalEndTime,
            goalCILevel: !goalCILevel ? "" : goalCILevel
        };
        var section = document.querySelector(".tabs__nav--item.active");
        currentSection = section.innerHTML;
        POPUP.hide(detailsPopup);
        successfulSave.show();
        outcomesAjax.saveGoals(newOutcomeData, function () {
            resetOutcomeSaveData();
            getConsumersWithRemainingGoals();
            locationSecondaryId = 0;
            setTimeout(function () {
                successfulSave.hide();
                loadCardView(selectedConsumerObj);
            }, 1000);
        });
    }
    function resetOutcomeSaveData() {
        success = "";
        promptType = "0";
        promptNumber = 0;
        goalnote = "";
        goalStartTime = "";
        goalEndTime = "";
        goalCILevel = "";
        locationSecondaryId = 0;
    }
    function getInputValues() {
        var promptTypeInput = promptsDropdown.querySelector(".dropdown__select");
        var promptNumberInput = attemptsDropdown.querySelector(".dropdown__select");
        var goalnoteInput = noteInput.querySelector(".input-field__input");
        promptType = promptTypeInput[promptTypeInput.selectedIndex].value;
        promptNumber = promptNumberInput[promptNumberInput.selectedIndex].value;
        goalnote = goalnoteInput.value;
    }
    function deleteObjectiveActivity() {
        outcomesAjax.deleteGoal(
            activityId,
            selectedConsumerId,
            currDate,
            function () {
                POPUP.hide(detailsPopup);
                loadCardView(selectedConsumerObj);
            }
        );
    }

    function updateCurrentFilterDisplay(service = "All", outcomeType = "All") {
        var currentFilterDisplay = document.querySelector('.filteredByData');

        if (!currentFilterDisplay) {
            currentFilterDisplay = document.createElement('div');
            currentFilterDisplay.classList.add('filteredByData');
            filterButtonSet(service, outcomeType);
            currentFilterDisplay.appendChild(btnWrap);
        }

        currentFilterDisplay.style.maxWidth = '100%';

        if (service === '%' || service === 'All') {
            btnWrap.appendChild(serviceBtnWrap);
            btnWrap.removeChild(serviceBtnWrap);
        } else {
            btnWrap.appendChild(serviceBtnWrap);
            if (document.getElementById('serviceBtn') != null)
                document.getElementById('serviceBtn').innerHTML = 'Service: ' + service;

        }
 
        if (outcomeType === '%' || outcomeType === 'All') {
            btnWrap.appendChild(outcomeTypeBtnWrap);
            btnWrap.removeChild(outcomeTypeBtnWrap);
        } else {
            btnWrap.appendChild(outcomeTypeBtnWrap);
            if (document.getElementById('outcomeTypeBtn') != null)
                document.getElementById('outcomeTypeBtn').innerHTML = 'Outcome Type: ' + outcomeType;

        }
        return currentFilterDisplay
    }

    function filterButtonSet(service = "All", outcomeType = "All") {
        filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtnNew',
            callback: () => { showFilterPopup('ALL') },
        });

        serviceBtn = button.build({
            id: 'serviceBtn',
            text: 'Service: ' + service,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('serviceBtn') },
        });
        serviceCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('serviceBtn') },
        });

        outcomeTypeBtn = button.build({
            id: 'outcomeTypeBtn',
            text: 'Outcome Type: ' + outcomeType,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { showFilterPopup('outcomeTypeBtn') },
        });
        outcomeTypeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('outcomeTypeBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        serviceBtnWrap = document.createElement('div');
        serviceBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceBtnWrap.appendChild(serviceBtn);
        serviceBtnWrap.appendChild(serviceCloseBtn);
        btnWrap.appendChild(serviceBtnWrap);

        outcomeTypeBtnWrap = document.createElement('div');
        outcomeTypeBtnWrap.classList.add('filterSelectionBtnWrap');
        outcomeTypeBtnWrap.appendChild(outcomeTypeBtn);
        outcomeTypeBtnWrap.appendChild(outcomeTypeCloseBtn);
        btnWrap.appendChild(outcomeTypeBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'serviceBtn') {
            tmpService = 'All';
        }
        if (closeFilter == 'outcomeTypeBtn') {
            tmpOutcome = 'All';
            tmpOutcomeId = '%'; 
        }
        applyOutComeFilter();
    }

    // Required Fields
    //------------------------------------
    function checkRequiredFields() {
        var showAttempts = successDetails.Show_Attempts;
        var showPrompts = successDetails.Show_Prompts;
        var showTime = successDetails.Show_Time;
        var showCI = successDetails.Show_Community_Integration;

        var attemptsRequired = successDetails.Attempts_Required;
        var promptsRequired = successDetails.Prompt_Required;
        var timeRequired = successDetails.Times_Required;
        var ciRequired = successDetails.Community_Integration_Required;
        var noteRequired = successDetails.Notes_Required;

        var errorFree = true;

        // attempts
        if (showAttempts === "Y") {
            attemptsDropdown.classList.remove("hidden");
            attemptsDropdown.classList.remove("disabled");
            if (attemptsRequired === "Y") {
                if (!currAttempts || currAttempts === "") {
                    attemptsDropdown.classList.add("error");
                    errorFree = false;
                } else {
                    attemptsDropdown.classList.remove("error");
                }
            } else {
                attemptsDropdown.classList.remove("error");
            }
        } else {
            attemptsDropdown.classList.add("hidden");
            attemptsDropdown.classList.add("disabled");
        }
        // prompts
        if (showPrompts === "Y") {
            promptsDropdown.classList.remove("hidden");
            promptsDropdown.classList.remove("disabled");
            if (promptsRequired === "Y") {
                if (!currPrompt || currPrompt === "") {
                    promptsDropdown.classList.add("error");
                    errorFree = false;
                } else {
                    promptsDropdown.classList.remove("error");
                }
            } else {
                promptsDropdown.classList.remove("error");
            }
        } else {
            promptsDropdown.classList.add("hidden");
            promptsDropdown.classList.add("disabled");
        }
        // community integration
        if (showCI === "Y") {
            cIDropdown.classList.remove("hidden");
            cIDropdown.classList.remove("disabled");
            if (ciRequired === "Y") {
                if (!currCI || currCI === "") {
                    cIDropdown.classList.add("error");
                    errorFree = false;
                } else {
                    cIDropdown.classList.remove("error");
                }
            } else {
                cIDropdown.classList.remove("error");
            }
        } else {
            cIDropdown.classList.add("hidden");
            cIDropdown.classList.add("disabled");
        }
        // start and end time
        if (showTime === "Y") {
            timeInputs.start.classList.remove("disabled");
            timeInputs.end.classList.remove("disabled");
            if (timeRequired === "Y") {
                if (currStartTime === "") {
                    timeInputs.start.classList.add("error");
                    errorFree = false;
                } else {
                    timeInputs.start.classList.remove("error");
                }
                if (currEndTime === "") {
                    timeInputs.end.classList.add("error");
                    errorFree = false;
                } else {
                    timeInputs.end.classList.remove("error");
                }
            } else {
                timeInputs.start.classList.remove("error");
                timeInputs.end.classList.remove("error");
            }
        } else {
            timeInputs.start.classList.add("disabled");
            timeInputs.end.classList.add("disabled");
        }
        // note
        if (noteRequired === "Y") {
            if (!currNote || currNote === "") {
                noteInput.classList.add("error");
                errorFree = false;
            } else {
                noteInput.classList.remove("error");
            }
        } else {
            noteInput.classList.remove("error");
        }

        if (showTime === "Y") validateStartEndTimes();

        checkErrors();
        // if (errorFree) {
        // 	saveBtn.classList.remove('disabled');
        // } else {
        // 	saveBtn.classList.add('disabled');
        // }
    }
    function validateStartEndTimes() {
        var timeRequired = successDetails.Times_Required;
        var startInput = timeInputs.start.querySelector("input");
        var endInput = timeInputs.end.querySelector("input");
        var startTime = startInput.value;
        var endTime = endInput.value;

        if (timeRequired === "N" && startTime === "" && endTime === "") return;

        if (endTime === "00:00") {
            timeInputs.end.classList.add("error"); //error on 12am end time
        }

        if (timeRequired === "N") {
            if (startTime === "" && endTime !== "") {
                timeInputs.start.classList.add("error");
            }
            if (endTime === "" && startTime !== "") {
                timeInputs.end.classList.add("error");
            }
        }
        // if ((startTime === "" && timeRequired === "N") && endTime !== "") {
        //   timeInputs.start.classList.add("error")
        // } else timeInputs.start.classList.remove("error")
        // if ((endTime === "" && timeRequired === "N") && startTime !== "") {
        //   timeInputs.end.classList.add("error")
        // }
        if (startTime >= endTime) {
            timeInputs.end.classList.add("error");
        } else {
            timeInputs.end.classList.remove("error");
        }
        if (startTime <= endTime && startTime !== "") {
            timeInputs.start.classList.remove("error");
        } else {
            timeInputs.start.classList.add("error");
        }
    }

    function checkShowFields() {
        var showAttempts = successObj[Object.keys(successObj)[0]].Show_Attempts;
        var showPrompts = successObj[Object.keys(successObj)[0]].Show_Prompts;
        var showTime = successObj[Object.keys(successObj)[0]].Show_Time;
        var showCI =
            successObj[Object.keys(successObj)[0]].Show_Community_Integration;

        if (showAttempts === "Y") {
            attemptsDropdown.classList.remove("hidden");
        } else {
            attemptsDropdown.classList.add("hidden");
        }
        if (showPrompts === "Y") {
            promptsDropdown.classList.remove("hidden");
        } else {
            promptsDropdown.classList.add("hidden");
        }
        if (showTime === "Y") {
            timeInputs.start.classList.remove("hidden");
            timeInputs.end.classList.remove("hidden");
        } else {
            timeInputs.start.classList.add("hidden");
            timeInputs.end.classList.add("hidden");
        }
        if (showCI === "Y") {
            cIDropdown.classList.remove("hidden");
        } else {
            cIDropdown.classList.add("hidden");
        }
    }

    function checkErrors() {
        var errors = document.querySelectorAll(".error");
        if (errors.length === 0) {
            saveBtn.classList.remove("disabled");
        } else {
            saveBtn.classList.add("disabled");
        }
    }
    // Action Nav
    //------------------------------------
    function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case "rosterDone": {
                roster.selectedConsumersToEnabledList();
                PROGRESS.SPINNER.show("Loading Outcomes...");
                loadLandingPage();
                roster.clearActiveConsumers();
                break;
            }
            case "rosterCancel": {
                var outcomeModuleBtn = document.getElementById("goalssettingsbutton");
                var dashButton = document.getElementById("singlebutton");
                outcomeModuleBtn.classList.remove("active");
                dashButton.classList.add("active");
                unloadApp($.loadedApp);
                setActiveModuleAttribute("home");
                DOM.clearActionCenter();
                DOM.ACTIONCENTER.removeAttribute("data-active-section");
                dashboard.load();
                break;
            }
            case "miniRosterDone": {
                initLoad = false;
                var activeConsumers = roster2.getActiveConsumers();
                if (activeConsumers.length > 0) {
                    activeConsumers.forEach(consumer => {
                        roster2.removeConsumerFromActiveConsumers(consumer.id);
                    })

                }
                selectedConsumerObj = activeConsumers[activeConsumers.length - 1];
                consumerName = activeConsumers[activeConsumers.length - 1].card.innerText;
                selectedConsumerId = activeConsumers[activeConsumers.length - 1].id;
                DOM.toggleNavLayout();

                PROGRESS.SPINNER.show(`Loading Outcomes For ${consumerName}`);
                resetFilter();
                updateCurrentFilterDisplay();
                outcomesAjax.getOutcomesPrompts(function (results) {
                    outcomesPrompts = results;
                    outcomesAjax.getGoalsCommunityIntegrationLevelDropdown(function (
                        ciResults
                    ) {
                        ciData = ciResults;
                        outcomesAjax.getDaysBackForEditingGoalsAndUseConsumerLocation(
                            selectedConsumerId,
                            function (results) {
                                daysBack = results[0].setting_value;
                                daysBackDate = convertDaysBack(daysBack);
                                useConsumerLocation = results[0].outcomes_use_consumer_location;
                                defaultPrimaryLocation = results[0].consumer_location;
                                loadCardView(activeConsumers[activeConsumers.length - 1]);
                            }
                        );
                    });
                });
                break;
            }
            case "miniRosterCancel": {
                if (initLoad) {
                    loadApp('home')

                } else DOM.toggleNavLayout();
                break;
            }
        }
    }
    //Set up spans to display
    function setUpOutcomesTabSpans() {
        //Create date to use for calculations
        var dateForCalculations = new Date(UTIL.formatDateFromIso(currDate));
        var day = dateForCalculations.getDay() + 1;
        //Single date
        todaysDateToDisplay = UTIL.formatDateFromIso(currDate);
        //week the date is in
        //first day
        firstDayOfWeek = new Date(
            dateForCalculations.getFullYear(),
            dateForCalculations.getMonth(),
            dateForCalculations.getDate() + (day == 0 ? -7 : 1) - day
        );
        firstDayOfWeek = UTIL.getFormattedDateFromDate(firstDayOfWeek);
        //lastDayOfWeek
        lastDayOfWeek = new Date(
            dateForCalculations.getFullYear(),
            dateForCalculations.getMonth(),
            dateForCalculations.getDate() + (day == 0 ? 0 : 7) - day
        );
        lastDayOfWeek = UTIL.getFormattedDateFromDate(lastDayOfWeek);
        //first day of month
        firstDayOfMonth = new Date(
            dateForCalculations.getFullYear(),
            dateForCalculations.getMonth(),
            1
        );
        firstDayOfMonth = UTIL.getFormattedDateFromDate(firstDayOfMonth);
        //last day of month
        lastDayOfMonth = new Date(
            dateForCalculations.getFullYear(),
            dateForCalculations.getMonth() + 1,
            0
        );
        lastDayOfMonth = UTIL.getFormattedDateFromDate(lastDayOfMonth);
        //year of current day
        yearOfCurrentDay = dateForCalculations.getFullYear();
    }

    // Filtering
    //------------------------------------
    function getOutcomeCompletion(outcome) {
        var recurrance = outcome.Objective_Recurrance;
        var occurance = outcome.Frequency_Occurance;
        var freqModifier = outcome.Frequency_Modifier;
        var successArray;
        var isComplete;

        if (recurrance === "NF" || recurrance === "H" || recurrance === "D") {
            successArray = outcome.nullHourDaySuccesses;
        }
        if (recurrance === "W") successArray = outcome.weekSuccesses;
        if (recurrance === "M") successArray = outcome.monthSuccesses;
        if (recurrance === "Y") successArray = outcome.yearSuccesses;

        switch (freqModifier) {
            case "OBJFMEX":
                if (successArray && successArray.length >= occurance) {
                    isComplete = true;
                } else {
                    isComplete = false;
                }
                break;
            case "OBJFMAL":
                if (successArray && successArray.length >= occurance) {
                    isComplete = true;
                } else {
                    isComplete = false;
                }
                break;
            case "OBJFMAN":
                isComplete = true;
                break;
            case "OBJFMAR":
                isComplete = true;
                break;
            case "OBJFMNM":
                isComplete = true;
                break;
            case "":
                isComplete = true;
                break;
            default:
                isComplete = false;
                break;
        }

        return isComplete ? "Complete" : "Incomplete";
    }
    function filterOutcomes(filterByData) {
        var service = filterByData.currService;
        var outcomeId = filterByData.currOutcomeId;
        var filteredOutcomesDataObj = {};

        function filterObject() {
            var freqKeys = Object.keys(outcomesDataObj);

            freqKeys.forEach(key => {
                var data = outcomesDataObj[key].filter(od => {
                    var completion = getOutcomeCompletion(od);

                    switch (service) {
                        case "All":
                            if (currOutcomeId === "%") return true;
                            return od.Goal_Type_ID === outcomeId;
                        case "Incomplete":
                        case "Complete":
                            if (currOutcomeId !== "%")
                                return od.Goal_Type_ID === outcomeId && completion === service;
                            return completion === service;
                        default:
                            break;
                    }

                    // if (currService === 'All' && currOutcomeId === '%') return true;
                    // if (service && outcomeId) return od.Goal_Type_ID === outcomeId && completion === service;
                    // if (service && !outcomeId) return completion === service;
                    // if (!service && outcomeId) return od.Goal_Type_ID === outcomeId;
                });
                filteredOutcomesDataObj[key] = data;
            });
        }

        if (filterByData.tmpDate) {
            outcomesAjax.getGoals(selectedConsumerId, currDate, function (results) {
                sortOutcomes(results);
                filterObject();
            });
        } else {
            filterObject();
        }

        populateOutcomes(filteredOutcomesDataObj);
    }
    function setupFilterEvents() {


        serviceDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpService = selectedOption.value;
        });
        outcomeDropdown.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            tmpOutcomeId = selectedOption.value;
            tmpOutcome = selectedOption.innerHTML;
        });
        applyButton.addEventListener("click", () => {
            //if (tmpDate) {
            //	currDate = tmpDate;
            //} else {
            //	currDate = currDate;
            //}
            applyOutComeFilter();
            POPUP.hide(filterPopup);
        });
    }

    function applyOutComeFilter() {
        if (tmpService) {
            currService = tmpService;
        } else {
            currService = currService ? currService : "All";
        }
        if (tmpOutcome) {
            currOutcome = tmpOutcome;
            currOutcomeId = tmpOutcomeId;
        } else if (!currOutcomeId) {
            currOutcome = "All";
            currOutcomeId = "%";
        }

        if (tmpService || tmpOutcome) {
            filterOutcomes({ currService, currOutcomeId });
        }

        let outcomeDd = document.getElementById('outcomeDropdown');
        let outcomeTypeText = outcomeDd == null ? currOutcome : outcomeDd.options[outcomeDd.selectedIndex].innerHTML;
        updateCurrentFilterDisplay(currService ? currService : "All", outcomeTypeText)

        setUpOutcomesTabSpans();
    }
    function populateServiceDropdown() {
        var data = [
            { value: "All", text: "All" },
            { value: "Complete", text: "Complete" },
            { value: "Incomplete", text: "Incomplete" }
        ];
        if (currService === undefined) {
            currService = "All";
        } else {
            currService = currService;
        }
        dropdown.populate(serviceDropdown, data, currService);
    }
    function populateOutcomeTypesDropdown(results) {
        // Goal_Type_ID: "114"
        // goal_type_description: "Actions"
        var data = results.map(res => {
            return {
                value: res.Goal_Type_ID,
                text: res.goal_type_description
            };
        });
        if (currOutcomeId === undefined) {
            currOutcomeId = "%";
            currOutcome = "All";
        } else {
            currOutcomeId = currOutcomeId;
            currOutcome = currOutcome;
        }
        data.unshift({ value: "%", text: "All" });
        dropdown.populate(outcomeDropdown, data, currOutcomeId);
    }
    function populateDropdowns() {
        populateServiceDropdown();
        outcomesAjax.getOutcomeTypeForFilter(
            {
                consumerId: selectedConsumerId,
                selectedDate: currDate,
                token: $.session.Token
            },
            populateOutcomeTypesDropdown
        );
    }
    function showFilterPopup(IsShow) {
        filterPopup = POPUP.build({});

        serviceDropdown = dropdown.build({
            label: "Service",
            style: "secondary",
            readonly: false
        });
        outcomeDropdown = dropdown.build({
            dropdownId: "outcomeDropdown",
            label: "Outcome Type",
            style: "secondary",
            readonly: false
        });
        applyButton = button.build({
            text: "Apply",
            style: "secondary",
            type: "contained"
        });

        applyButton.classList.add("singleBtn");
        if (IsShow == 'ALL' || IsShow == 'serviceBtn')
            filterPopup.appendChild(serviceDropdown);
        if (IsShow == 'ALL' || IsShow == 'outcomeTypeBtn')
            filterPopup.appendChild(outcomeDropdown);
        filterPopup.appendChild(applyButton);

        populateDropdowns();
        setupFilterEvents();

        POPUP.show(filterPopup);
    }
    function resetFilter() {
        currService = null;
        currOutcomeId = null;
    }

    // FUCKING DATE INPUT
    //------------------------------------
    function buildFuckingDateInput() {
        var dateinput = input.build({
            id: "outcomeDatePicker",
            label: "Date",
            type: "date",
            style: "secondary",
            value: currDate,
            classNames: ["dateInput"],
            attributes: [
                { key: "min", value: daysBackDate },
                { key: "max", value: UTIL.getTodaysDate() }
            ]
        });

        dateinput.addEventListener("change", event => {
            var currDateCache = currDate;
            currDate = event.target.value;
            var currDateCheck = new Date(
                currDate.split("-")[0],
                currDate.split("-")[1] - 1,
                currDate.split("-")[2]
            );
            var daysBackDateCheck = new Date(
                daysBackDate.split("-")[0],
                daysBackDate.split("-")[1] - 1,
                daysBackDate.split("-")[2]
            );
            if (
                currDateCheck < daysBackDateCheck ||
                currDate === "" ||
                currDateCheck > new Date()
            ) {
                dateinput.classList.add("error");
                currDate = currDateCache;
                return;
            } else dateinput.classList.remove("error");
            currService = "All";
            currOutcomeId = "%";
            currOutcome = "All";
            roster2.updateSelectedDate(currDate)
            setUpOutcomesTabSpans(currDate);
            outcomesAjax.getGoals(selectedConsumerId, currDate, loadOutcomesCards);
            getConsumersWithRemainingGoals();
        });
        dateinput.addEventListener("keydown", event => {
            event.preventDefault();
            event.stopPropagation();
        });
        return dateinput;
    }

    // Build Outcome Cards
    //------------------------------------
    function buildConsumerCard(clone, consumerId) {
        var card = document.createElement("div");
        card.classList.add("outcomes__consumer");
        card.appendChild(clone);
        return card;
    }
    // card details (old back)
    function buildPrimaryLocationDropdown(locId) {
        var select = dropdown.build({
            label: "Primary Location",
            style: "secondary"
        });
        var data = outcomesLocations.Primary.map(pl => {
            return {
                value: pl.Location_ID,
                text: pl.description
            };
        });

        if (locId) {
            dropdown.populate(select, data, locId);
            locationId = locId;
        } else {
            if (defaultObjLocationId !== "") {
                var defaultLocation = defaultObjLocationId;
            } else if (defaultGoalLocationId !== "") {
                var defaultLocation = defaultGoalLocationId;
            } else if (useConsumerLocation) {
                var defaultLocation = defaultPrimaryLocation;
            } else {
                var defaultLocation = "";
            }
            // var defaultLocation = useConsumerLocation ? defaultPrimaryLocation : '';
            dropdown.populate(select, data, defaultLocation);
            locationId = defaultLocation === "" ? data[0].value : defaultLocation;
        }

        select.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            locationId = selectedOption.value;
            rePopSecondaryLocationDropdown(locationId);
        });

        return select;
    }
    function rePopSecondaryLocationDropdown(locId) {
        var filteredOutcomesLocations = { Primary: [], Secondary: [] };

        outcomesLocations.Secondary.forEach(sl => {
            if (sl.primaryLocId === locId) {
                let obj = {
                    Location_ID: sl.Location_ID,
                    description: sl.description,
                    primaryLocId: sl.primaryLocId
                };
                filteredOutcomesLocations["Secondary"].push(obj);
            }
        });

        var data = filteredOutcomesLocations.Secondary.map(sl => {
            return {
                value: sl.Location_ID,
                text: sl.description,
                attributes: [{ key: "data-primary-loc-id", value: sl.primaryLocId }]
            };
        });
        var defaultVal = {
            value: "",
            text: ""
        };
        data.unshift(defaultVal);
        dropdown.populate(secondaryLocationDropdown, data);
        locationSecondaryId = data[0].value;
    }

    function buildSecondaryLocationDropdown(locId) {
        var select = dropdown.build({
            label: "Secondary Location",
            style: "secondary"
        });

        if (!outcomesLocations.Secondary || outcomesLocations.Secondary.legnth < 1)
            return select;

        var filteredOutcomesLocations = { Primary: [], Secondary: [] };

        outcomesLocations.Secondary.forEach(sl => {
            if (sl.primaryLocId === locationId) {
                let obj = {
                    Location_ID: sl.Location_ID,
                    description: sl.description,
                    primaryLocId: sl.primaryLocId
                };
                filteredOutcomesLocations["Secondary"].push(obj);
            }
        });

        var data = filteredOutcomesLocations.Secondary.map(sl => {
            return {
                value: sl.Location_ID,
                text: sl.description,
                attributes: [{ key: "data-primary-loc-id", value: sl.primaryLocId }]
            };
        });

        var defaultVal = {
            value: "",
            text: ""
        };
        data.unshift(defaultVal);

        if (locId) {
            dropdown.populate(select, data, locId);
            locationSecondaryId = locId;
        } else {
            dropdown.populate(select, data);
            locationSecondaryId = data[0].value;
        }

        select.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            locationSecondaryId = selectedOption.value;
        });

        return select;
    }
    function buildResultsDropdown(result) {
        var select = dropdown.build({
            label: "Results",
            style: "secondary"
        });

        var data = Object.values(successObj).map(r => {
            return {
                value: r.Objective_Success_Description,
                text: `${r.Objective_Success} ${r.Objective_Success_Description}`,
                attributes: [{ key: "data-success", value: r.Objective_Success }]
            };
        });
        var defaultVal = {
            value: "",
            text: ""
        };
        data.unshift(defaultVal);

        currResult = data[0].value;

        if (result) {
            dropdown.populate(select, data, result);
            successType = result;
            successDetails = successObj[successType];
            success = successDetails.Objective_Success;
        } else {
            select.classList.add("error");
            dropdown.populate(select, data);
            successType = data[0].value;
            successDetails = successObj[successType];
            success = successType;
        }

        select.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            successType = selectedOption.value;
            if (successType === "") {
                resultsDropdown.classList.add("error");
            } else resultsDropdown.classList.remove("error");
            successDetails = successObj[successType];
            success = selectedOption.dataset.success;
            checkErrors();
            checkRequiredFields();
        });

        return select;
    }
    function buildPromptsDropdown(code) {
        var select = dropdown.build({
            label: "Prompts",
            style: "secondary"
        });
        var data = outcomesPrompts.map(op => {
            return {
                value: op.Code,
                text: `${op.Code} ${op.Caption}`
            };
        });
        var defaultVal = {
            value: "",
            text: ""
        };
        data.unshift(defaultVal);
        if (code) {
            dropdown.populate(select, data, code);
            currPrompt = code;
        } else {
            dropdown.populate(select, data);
        }

        select.addEventListener("change", event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            currPrompt = selectedOption.value;
            promptType = currPrompt;
            //promptNumber;
            checkRequiredFields();
        });

        return select;
    }
    function buildAttemptsDropdown(attempt) {
        var select = dropdown.build({
            label: "Attempts",
            style: "secondary"
        });
        var data = [
            { value: "", text: "" },
            // { value: '', text: '&#216' },
            // { value: '0', text: '0' },
            { value: "1", text: "1" },
            { value: "2", text: "2" },
            { value: "3", text: "3" },
            { value: "4", text: "4" },
            { value: "5", text: "5" },
            { value: "6", text: "6" },
            { value: "7", text: "7" },
            { value: "8", text: "8" },
            { value: "9", text: "9" }
        ];
        dropdown.populate(select, data, attempt);
        if (attempt) currAttempts = attempt;

        select.addEventListener("change", event => {
            currAttempts = event.target.value;
            promptNumber = currAttempts;
            checkRequiredFields();
        });

        return select;
    }
    function buildCommunityIntegrationDropdown(ciLevel) {
        var select = dropdown.build({
            label: "Community Integration",
            style: "secondary"
        });
        var data = ciData.map(ci => {
            return {
                value: ci.code,
                text: `${ci.code} ${ci.captionname}`
            };
        });
        var defaultVal = {
            value: "",
            text: ""
        };
        data.unshift(defaultVal);

        if (ciLevel) {
            dropdown.populate(select, data, ciLevel);
            goalCILevel = ciLevel;
            currCI = ciLevel;
        } else {
            dropdown.populate(select, data);
        }

        select.addEventListener("change", event => {
            goalCILevel = event.target.value;
            currCI = event.target.value;
            checkRequiredFields();
        });

        return select;
    }
    function buildTimeInputs(startTime, endTime) {
        var start = input.build({
            label: "Start Time",
            style: "secondary",
            type: "time",
            value: startTime
        });
        var end = input.build({
            label: "End Time",
            style: "secondary",
            type: "time",
            value: endTime
        });

        if (startTime) {
            goalStartTime = startTime;
            currStartTime = startTime;
        }
        if (endTime) {
            goalEndTime = endTime;
            currEndTime = endTime;
        }

        start.addEventListener("change", event => {
            goalStartTime = event.target.value;
            currStartTime = startTime;
            checkRequiredFields();
            checkErrors();
        });
        end.addEventListener("change", event => {
            goalEndTime = event.target.value;
            currEndTime = endTime;
            checkRequiredFields();
            // if (validateStartEndTimes()) {
            //   end.classList.remove('error')
            // } else end.classList.add('error')
            checkErrors();
        });

        return {
            start,
            end
        };
    }
    function buildNoteInput(note) {
        var noteInput = input.build({
            label: "Note",
            style: "secondary",
            type: "textarea",
            value: note
        });

        if (note) {
            currNote = note;
            goalnote = note;
        }

        if (
            note !== undefined &&
            enteredByUser &&
            enteredByUser.toUpperCase() !== $.session.UserId.toUpperCase()
        ) {
            return noteInput;
        }
        noteInput.addEventListener("keyup", () => {
            currNote = event.target.value;
            goalnote = currNote;
            checkRequiredFields();
        });

        return noteInput;
    }
    function buildSaveButton(isEdit) {
        var text = isEdit ? "Update" : "Save";
        var btn = button.build({
            text,
            style: "secondary",
            type: "contained",
            classNames: "disabled",
            callback: saveNewOutcome
        });

        return btn;
    }
    function buildDeleteButton() {
        var btn = button.build({
            text: "Delete",
            style: "secondary",
            type: "contained",
            //callback: deleteObjectiveActivity,
            callback: deleteIncident
        });

        return btn;
    }
    function deleteIncident() {
        var popup = document.createElement("div");
        popup.classList.add("popup");
        popup.classList.add("warning");
        popup.setAttribute("data-popup", "true");

        var message = document.createElement("p");
        message.innerHTML = "Are you sure you want to delete this activity?";

        var btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        var yesBtn = button.build({
            text: "Yes",
            type: "contained",
            style: "secondary",
            callback: function () {
                deleteObjectiveActivity();
                // hide popup
                actioncenter.removeChild(popup);
                overlay.hide();
                bodyScrollLock.enableBodyScroll(popup);
                // clear active consumers
                // roster.clearActiveConsumers();
                // re-get Users with remaining goals
                getConsumersWithRemainingGoals();
            }
        });
        var noBtn = button.build({
            text: "No",
            type: "contained",
            style: "secondary",
            callback: function () {
                // hide popup
                actioncenter.removeChild(popup);
                // overlay.hide()
                // bodyScrollLock.enableBodyScroll(popup);
            }
        });

        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);

        popup.appendChild(message);
        popup.appendChild(btnWrap);

        // show overlay
        overlay.show();
        // show popup
        actioncenter.appendChild(popup);
        // disable scrolling
        bodyScrollLock.disableBodyScroll(popup);
    }
    function buildCardDetails(editData) {
        detailsPopup = POPUP.build({
            classNames: ["card", "objectiveDetails"]
        });

        if (editData) {
            editData = editData[0];
            personId = selectedConsumerId;
            objectiveId = editData.Objective_ID;
            objdate = currDate;
            let lastEditedTime = editData.Last_Update.split(" ")[1];
            let lastEditHH = lastEditedTime.split(":")[0];
            let lastEditMM = UTIL.leadingZero(lastEditedTime.split(":")[1]);
            lastEditedTime = `${lastEditHH}:${lastEditMM} ${editData.Last_Update.split(" ")[2]
                }`;

            var lastEditedDate = editData.Last_Update.split(" ")[0];
            var lastEdited = `${lastEditedDate} ${lastEditedTime}`;

            primaryLocationDropdown = buildPrimaryLocationDropdown(
                editData.Location_ID
            );
            secondaryLocationDropdown = buildSecondaryLocationDropdown(
                editData.Locations_Secondary_ID
            );
            resultsDropdown = buildResultsDropdown(
                editData.objective_success_description
            );
            promptsDropdown = buildPromptsDropdown(editData.Prompt_Type);
            attemptsDropdown = buildAttemptsDropdown(editData.Prompt_Number);
            cIDropdown = buildCommunityIntegrationDropdown(
                editData.community_integration_level
            );
            timeInputs = buildTimeInputs(editData.start_time, editData.end_time);
            enteredByUser = editData.submitted_by_user_id;
            noteInput = buildNoteInput(editData.Objective_Activity_Note);
            saveBtn = buildSaveButton(true);
            deleteBtn = buildDeleteButton();
            edit__lastEditedByDetails = buildCardEnteredByDetails(
                enteredByUser,
                lastEdited
            );
        } else {
            primaryLocationDropdown = buildPrimaryLocationDropdown();
            secondaryLocationDropdown = buildSecondaryLocationDropdown();
            resultsDropdown = buildResultsDropdown();
            promptsDropdown = buildPromptsDropdown();
            attemptsDropdown = buildAttemptsDropdown();
            cIDropdown = buildCommunityIntegrationDropdown();
            timeInputs = buildTimeInputs();
            noteInput = buildNoteInput();
            saveBtn = buildSaveButton(false);
            deleteBtn = undefined;
        }

        checkShowFields();

        var btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(saveBtn);
        if (deleteBtn) btnWrap.appendChild(deleteBtn);

        var timeWrap = document.createElement("div");
        timeWrap.appendChild(timeInputs.start);
        timeWrap.appendChild(timeInputs.end);

        detailsPopup.appendChild(primaryLocationDropdown);
        if (outcomesLocations.Secondary)
            detailsPopup.appendChild(secondaryLocationDropdown);
        detailsPopup.appendChild(resultsDropdown);
        detailsPopup.appendChild(promptsDropdown);
        detailsPopup.appendChild(attemptsDropdown);
        if ($.session.applicationName !== "Gatekeeper") {
            detailsPopup.appendChild(cIDropdown);
            detailsPopup.appendChild(timeWrap);
        }
        detailsPopup.appendChild(noteInput);
        detailsPopup.appendChild(btnWrap);

        if (editData) checkRequiredFields();
        if (editData) detailsPopup.appendChild(edit__lastEditedByDetails);
        if (
            editData &&
            enteredByUser &&
            enteredByUser.toUpperCase() !== $.session.UserId.toUpperCase()
        ) {
            disableOutcomeFieldsOtherUser();
            btnWrap.classList.add("hidden");
        }
        if (dailyAbsent) {
            //  disableOutcomeFieldsOtherUser();
        }

        POPUP.show(detailsPopup);
    }
    // card overview (old front)
    function buildActivityTracker(outcome) {
        var activities = getObjectiveActivities(outcome);
        var activityCount;
        var activityLimit =
            outcome.Frequency_Occurance !== ""
                ? parseInt(outcome.Frequency_Occurance, 10)
                : 0;

        activities = activities.filter(o => {
            // var type = o.split('|')[0];
            let isAbsent = o.split("|")[2];
            return isAbsent !== "Y";
        });
        activityCount = activities.length;

        // set frequency modifier & path color
        var frequencyModifier = outcome.Frequency_Modifier.replace("OBJFM", "");
        var frequencySeparator;
        var pathColor;

        // color and modifier
        switch (frequencyModifier) {
            case "AN":
            case "AR":
                // As Needed & As Requested
                frequencySeparator = ">";
                if (activityLimit === 0 && activityCount > activityLimit) {
                    pathColor = "rgb(129,185,65)"; //green
                    break;
                } else if (activityLimit === 0 && activityCount === 0) {
                    //no color
                    break;
                }
                if (activityCount === activityLimit) {
                    pathColor = "rgb(129,185,65)"; //green
                    break;
                }
                pathColor = "rgb(238,132,52)"; //orange
                break;
            case "AL":
                // At Least
                frequencySeparator = ">";
                if (activityCount === 0 || activityCount < activityLimit) {
                    pathColor = "rgb(219,22,47)"; //red
                } else if (activityCount >= activityLimit) {
                    pathColor = "rgb(129,185,65)"; //green
                }
                break;
            case "EX":
                // Exactly
                frequencySeparator = "of";
                if (activityCount === 0 || activityCount < activityLimit) {
                    pathColor = "rgb(219,22,47)"; //red
                } else if (activityCount > activityLimit) {
                    pathColor = "rgb(238,132,52)"; //orange
                } else if (activityCount === activityLimit) {
                    pathColor = "rgb(129,185,65)"; //green
                }
                break;
            case "NM":
                // No More Than
                frequencySeparator = "<";
                if (activityCount <= activityLimit) {
                    pathColor = "rgb(129,185,65)"; //green
                } else {
                    pathColor = "rgb(238,132,52)"; //orange
                }
                break;
            case "":
                frequencySeparator = "";
                if (activityLimit === 0) {
                    pathColor = "rgb(129,185,65)"; //green
                } else if (activityCount < activityLimit) {
                    pathColor = "rgb(219,22,47)"; //red
                } else if (activityCount > activityLimit) {
                    pathColor = "rgb(238,132,52)"; //orange
                } else if (activityCount === activityLimit) {
                    pathColor = "rgb(129,185,65)"; //green
                }
                break;
            default:
                break;
        }

        // get percent complete

        // Dashoffset values vv
        // 301.635 = 0/ no circle
        // 0 = a full circle

        // var percentComplete = activityCount === 0 || activityLimit === 0 ? 0 : activityLimit / activityCount / 100;
        var percentComplete =
            activityCount === 0 || activityLimit === 0
                ? 0
                : activityCount / activityLimit;
        var dashOffset = 301.635 - percentComplete * 301.635;
        dashOffset = dashOffset === 0 ? 301.635 : dashOffset;
        // if (frequencySeparator === '') {
        // 	dashOffset = 0;
        // }
        if (percentComplete >= 1) {
            // dashOffset 0 = full circle. Anything 100% or over is a full circle
            dashOffset = 0;
        }
        if (activityCount > activityLimit) {
            dashOffset = 0;
        }
        var path2Style = `stroke-dashoffset: ${dashOffset};`;

        // cool circle thing
        var circle = document.createElement("div");
        circle.classList.add("progressCircle");
        circle.innerHTML = `
      <svg viewBox="0 0 100 100" style="display: block; width: 100%;">
        <path class="path1" d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"></path>
        <path class="path2" style="${path2Style} stroke:${pathColor};" d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"></path>
      </svg>
      ${frequencySeparator !== ""
                ? `<p class="progressCircle__text" style="color:${pathColor}">${activityCount} ${frequencySeparator} ${activityLimit}</p>`
                : activityLimit > 0
                    ? `<p class="progressCircle__text" style="color:${pathColor}">${activityCount}</p>`
                    : `<p class="progressCircle__text" style="color:rgb(129,185,65)">${activityCount}</p>`
            }
    `;

        return circle;
    }
    function buildSuccessPopup(success) {
        var popup = POPUP.build({});
        var successPopupText = document.createElement("p");
        popup.appendChild(successPopupText);
        var successText = success.replace(/(\r\n|\n|\r)/g, "<br />");
        successPopupText.innerHTML += `${successText}`;
        POPUP.show(popup);
        //return popup;
    }
    function buildMethodPopup(method) {
        var popup = POPUP.build({});
        var methodPopupText = document.createElement("p");
        popup.appendChild(methodPopupText);
        var methodText = method.replace(/(\r\n|\n|\r)/g, "<br />");
        methodPopupText.innerHTML += `${methodText}`;
        POPUP.show(popup);
        //return popup;
    }
    function buildObjectiveActivities(outcome) {
        var objectiveActivities = getObjectiveActivities(outcome);
        var outcomeRecurrance = outcome.Objective_Recurrance;
        if (objectiveActivities.length === 0) return null;
        // if (outcome.Objective_Statement === "") return null;

        var activities = document.createElement("div");
        activities.classList.add("activities");

        objectiveActivities.forEach(activity => {
            activity = activity.split("|");
            dailyAbsent = false;
            let label = activity[0];
            let id = activity[1];
            let isAbsent = activity[2];
            var ele = document.createElement("span");
            if (outcomeRecurrance === "D" && isAbsent === "Y") {
                dailyAbsent = true;
            }
            ele.classList.add("activity");
            ele.setAttribute("data-activity-id", id);
            ele.innerHTML = label;
            activities.appendChild(ele);
        });
        //if (!dailyAbsent) {
        activities.addEventListener("click", event => {
            activityId = event.target.dataset.activityId;
            if (activityId) {
                outcomesAjax.getObjectiveActivity(activityId, function (results) {
                    outcomesAjax.getOutcomesSuccessTypes(outcome.Goal_Type_ID, function (
                        successTypes
                    ) {
                        outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(
                            selectedConsumerId,
                            currDate,
                            function (locations) {
                                sortSuccessTypes(successTypes);
                                sortOutcomeLocations(locations);
                                buildCardDetails(results);
                            }
                        );
                    });
                });
            }
        });
        //}
        return activities;
    }
    function buildCardOverview(outcome) {
        if (outcome.Objective_Statement === "") return;
        //PERMISSIONS - if $.session.viewableGoalTypeIds does not contain this cards goal type ID, do not display the card.
        var hasPermission = false;
        $.session.viewableGoalTypeIds.forEach(id => {
            if (outcome.Goal_Type_ID === id) {
                hasPermission = true;
                return;
            }
        });
        if (!hasPermission) return false;
        //////////
        var overviewCard = document.createElement("div");
        overviewCard.classList.add("card", "objectiveOverview");

        // card values
        var typeDescription = outcome.goal_type_description;
        var goalStatement = outcome.Objective_Statement.replace(
            /(\r\n|\n|\r)/g,
            "<br />"
        ); //outcome.Goal_Statement;
        var success = outcome.Success_Determination;
        var method = outcome.Objective_Method;
        var lastUpdateBy = outcome.lastUpdatedBy;

        // build card
        var description = document.createElement("h3");
        description.classList.add("description");
        description.innerHTML = typeDescription;

        var editIconBtn = button.build({
            icon: 'edit',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { addServicesForm.init(selectedConsume, outcome.Objective_id ,0) },
        });

        var statement = document.createElement("p");
        statement.classList.add("statement");
        statement.innerHTML = goalStatement;
        var lastUpdated = document.createElement("div");
        lastUpdated.classList.add("lastUpdated");
        if (lastUpdateBy !== "") {
            lastUpdated.innerHTML = `
      <p>Last update by ${lastUpdateBy.split(" ")[0]} ${lastUpdateBy.split(" ")[1]
                }</p>
      <p>on ${UTIL.formatDateFromIso(lastUpdateBy.split(" ")[2])}</p>
    `;
        } else {
            lastUpdated.innerHTML = ``;
        }

        // activity tracker
        var activityTracker = buildActivityTracker(outcome);
        // btns
        var newBtn = button.build({
            text: "New",
            style: "secondary",
            type: "contained",
            icon: "outcomeNew",
            callback: function () {
                outcomesAjax.getOutcomesSuccessTypes(outcome.Goal_Type_ID, function (
                    successTypes
                ) {
                    outcomesAjax.getOutcomesPrimaryAndSecondaryLocations(
                        selectedConsumerId,
                        currDate,
                        function (locations) {
                            defaultObjLocationId = outcome.objLocationId;
                            defaultGoalLocationId = outcome.Location_ID;
                            sortSuccessTypes(successTypes);
                            sortOutcomeLocations(locations);
                            buildCardDetails();
                            initSaveData(outcome);
                            successType = null;
                            successDetails = null;
                            disableNewOutcomeFields();
                        }
                    );
                });
            }
        });
        var successBtn = button.build({
            text: "Success",
            style: "secondary",
            type: "contained",
            callback: function () {
                var popup = buildSuccessPopup(success);
                POPUP.show(popup);
            }
        });
        var methodBtn = button.build({
            text: "Method",
            style: "secondary",
            type: "contained",
            callback: function () {
                var popup = buildMethodPopup(method);
                POPUP.show(popup);
            }
        });
        dailyAbsent = false;
        var objectiveActivities = buildObjectiveActivities(outcome);
        if (dailyAbsent) {
            newBtn.classList.add("disabled");
        }

        var successMethodWrap = document.createElement("div");
        successMethodWrap.classList.add("btnWrap");
        if (success !== "") successMethodWrap.appendChild(successBtn);
        if (method !== "") successMethodWrap.appendChild(methodBtn);

        var wrap1 = document.createElement("div");
        wrap1.classList.add("row", "progressAndNew");
        wrap1.appendChild(activityTracker);
        wrap1.appendChild(newBtn);

        var wrapEdit = document.createElement("div");
        wrapEdit.classList.add("editBtnWrap");
        wrapEdit.appendChild(description);
        if ($.session.UpdateServices == true) {
            wrapEdit.appendChild(editIconBtn);
        }  
        overviewCard.appendChild(wrapEdit);
        overviewCard.appendChild(wrap1);
        overviewCard.appendChild(statement);
        overviewCard.appendChild(successMethodWrap);
        if (objectiveActivities) overviewCard.appendChild(objectiveActivities);
        if (lastUpdateBy !== "") overviewCard.appendChild(lastUpdated);

        return overviewCard;
    }
    function buildCardEnteredByDetails(enteredBy, lastUpdatedDate) {
        let txtArea = document.createElement("p");
        txtArea.classList.add("enteredByDetail");
        txtArea.innerHTML = `Entered By: ${enteredBy} <br>Last Updated: ${lastUpdatedDate}`;
        return txtArea;
    }
    // main card
    function buildCardContainer(consumer) {

        OUTCOMES_SECTION.innerHTML = "";

        consumer.card.classList.remove("highlighted");
        var clone = consumer.card.cloneNode(true);
        var card = buildConsumerCard(clone, consumer.id);

        OUTCOMES_SECTION.appendChild(card);

        return OUTCOMES_SECTION;
    }

    // Populate Outcome Card
    //------------------------------------
    function populateNoFreqOutcomes(outcomes) {
        // aka NONE
        var section = document.getElementById("no frequency");
        section.innerHTML = "";
        outcomes.forEach(oc => {
            var card = buildCardOverview(oc);
            if (card) section.appendChild(card);
        });
    }
    function populateHourlyOutcomes(outcomes) {
        var section = document.getElementById("hourly");
        section.innerHTML = "";
        outcomes.forEach(oc => {
            var card = buildCardOverview(oc);
            if (card) section.appendChild(card);
        });
    }
    function populateDailyOutcomes(outcomes) {
        var section = document.getElementById("daily");
        section.innerHTML = "";
        outcomes.forEach(oc => {
            var card = buildCardOverview(oc);
            if (card) section.appendChild(card);
        });
    }
    function populateWeeklyOutcomes(outcomes) {
        var section = document.getElementById("weekly");
        section.innerHTML = "";
        outcomes.forEach(oc => {
            var card = buildCardOverview(oc);
            if (card) section.appendChild(card);
        });
    }
    function populateMonthlyOutcomes(outcomes) {
        var section = document.getElementById("monthly");
        section.innerHTML = "";
        outcomes.forEach(oc => {
            var card = buildCardOverview(oc);
            if (card) section.appendChild(card);
        });
    }
    function populateYearlyOutcomes(outcomes) {
        var section = document.getElementById("yearly");
        section.innerHTML = "";
        outcomes.forEach(oc => {
            var card = buildCardOverview(oc);
            if (card) section.appendChild(card);
        });
    }

    function populateOutcomes(od) {
        outcomesData = sortOutcomesAlpha(od);
        var sections = [];
        var noFreqOutcomes = outcomesData["NF"];
        var hourlyOutcomes = outcomesData["H"];
        var dailyOutcomes = outcomesData["D"];
        var weeklyOutcomes = outcomesData["W"];
        var monthlyOutcomes = outcomesData["M"];
        var yearlyOutcomes = outcomesData["Y"];

        if (noFreqOutcomes) sections.push("No Frequency");
        if (hourlyOutcomes) sections.push("Hourly");
        if (dailyOutcomes) sections.push("Daily");
        if (weeklyOutcomes) sections.push("Weekly");
        if (monthlyOutcomes) sections.push("Monthly");
        if (yearlyOutcomes) sections.push("Yearly");

        //currentSection
        var defaultActiveSection;
        sections.forEach((sec, index) => {
            if (sec === currentSection) defaultActiveSection = index;
        });

        defaultActiveSection = defaultActiveSection ? defaultActiveSection : 0;
        currentSection = sections[defaultActiveSection];

        OUTCOMES_SECTION.innerHTML = "";
        var outcomeTabs = tabs.build({
            sections,
            active: defaultActiveSection,
            tabNavCallback: function (data) {
                currentSection = data.activeSection;
                setUpOutcomesTabSpans();
            }
        });
        OUTCOMES_SECTION.appendChild(outcomeTabs);

        if (noFreqOutcomes) populateNoFreqOutcomes(noFreqOutcomes);
        if (hourlyOutcomes) populateHourlyOutcomes(hourlyOutcomes);
        if (dailyOutcomes) populateDailyOutcomes(dailyOutcomes);
        if (weeklyOutcomes) populateWeeklyOutcomes(weeklyOutcomes);
        if (monthlyOutcomes) populateMonthlyOutcomes(monthlyOutcomes);
        if (yearlyOutcomes) populateYearlyOutcomes(yearlyOutcomes);
        setUpOutcomesTabSpans();
    }

    //Handle navigation from dashboard widget to module
    function dashHandler(myconsumerId) {
        let myval = { id: "34275", card: "div.consumerCard.consumer-selected.highlighted" };
        selectedConsumerId = "34275";
        currDate = "2020-03-30";
        consumerName = "Joe Meyer";
        daysBack = "13";

        loadCardView(myval);
    }


    function loadCardView(selectedConsumer) {
        // DOM.scrollToTopOfPage();
        selectedConsume = selectedConsumer;
        DOM.clearActionCenter();
        clearBackCardValues();
        //Filter and date wrap
        var topFilterDateWrap = document.createElement("div");
        topFilterDateWrap.classList.add("topOutcomeWrap");
        //Fucking Date Input
        var date_Input = document.querySelector(".dateInput");
        if (!date_Input) {
            dateInput = buildFuckingDateInput();
            topFilterDateWrap.appendChild(dateInput);
        }

        function getFilterValues() {
            return (filterValues = {
                outcomesService: currService ? currService : 'All',
                outcomesType: currOutcomeId ? currOutcomeId : '0',
                outcomesConsumer: selectedConsumerId,
                outcomesDate: currDate
            });
        }
        // Helper function to create the main reports button on the module page
        function createMainReportButton(buttonsData) {
            return button.build({
                text: 'Reports',
                icon: 'add',
                style: 'secondary',
                type: 'contained',
                classNames: 'reportBtn',
                callback: function () {
                    // Iterate through each item in the buttonsData array
                    buttonsData.forEach(function (buttonData) {
                        buttonData.filterValues = getFilterValues();
                    });

                    generateReports.showReportsPopup(buttonsData);
                },
            });
        }

        function editOutcomesServicesButton() {
            return button.build({
                text: 'EDIT OUTCOMES/SERVICES',
                icon: 'add',
                style: 'secondary',
                type: 'contained',
                classNames: 'reportBtn',
                callback: async () => {
                    if (!editOutcomeBtn.classList.contains('disabled')) {
                        addEditOutcomeServices.init(selectedConsume)
                    } 
                },
            });
        }

        let filterValues = {
            // outcomesService: outcome.Objective_id,
            outcomesConsumer: selectedConsumerId,
            outcomesDate: currDate
        };

        reportsBtn = createMainReportButton([{ text: 'Documentation - Completed With Percentages', filterValues }, { text: 'Outcome Activity - With Community Integration by Employee, Consumer, Date', filterValues }])
        editOutcomeBtn = editOutcomesServicesButton();
        topFilterDateWrap.appendChild(editOutcomeBtn);
        if ($.session.InsertOutcomes == true || $.session.UpdateOutcomes == true || $.session.InsertServices == true || $.session.UpdateServices == true) {
            editOutcomeBtn.classList.remove('disabled');
        }
        else {
            editOutcomeBtn.classList.add('disabled'); 
        } 
        
        if ($.session.applicationName === 'Advisor') {
            topFilterDateWrap.appendChild(reportsBtn);
        }

        if (!document.querySelector(".topOutcomeWrap")) {
            DOM.ACTIONCENTER.appendChild(topFilterDateWrap);
        }


        var documentingForDiv = document.createElement("div");
        documentingForDiv.innerHTML = `<p class="currConsumerDisp">Documenting for: <span>${consumerName} </span></p>`;
        DOM.ACTIONCENTER.appendChild(documentingForDiv);

        var dayBackDateSpanWrap = document.createElement("div");
        dayBackDateSpanWrap.classList.add("dayBackDateSpanWrap");
        //Days back message
        var daysBackDiv = document.createElement("div");
        daysBackDiv.innerHTML = `<p class="daysBackMessage">You can document up to <span>${daysBack}</span> days back</p>`;
        dayBackDateSpanWrap.appendChild(daysBackDiv);

        DOM.ACTIONCENTER.appendChild(dayBackDateSpanWrap);

        const filteredBy = updateCurrentFilterDisplay();
        DOM.ACTIONCENTER.appendChild(filteredBy);

        //Main section & tabs
        var outcomesTabs = buildCardContainer(selectedConsumer);
        //Build and populate card overview
        outcomesAjax.getGoals(selectedConsumerId, currDate, res =>
            loadOutcomesCards(res)
        );

        DOM.ACTIONCENTER.appendChild(outcomesTabs);
    }
    function loadOutcomesCards(results) {
        sortOutcomes(results);
        populateOutcomes(outcomesDataObj);
    }

    function sortOutcomesAlpha(outcomesData) {
        Object.keys(outcomesData).forEach(occur => {
            outcomesData[occur].sort((a, b) =>
                a.goal_type_description.toUpperCase() >
                    b.goal_type_description.toUpperCase()
                    ? 1
                    : a.goal_type_description.toUpperCase() ===
                        b.goal_type_description.toUpperCase()
                        ? a.Objective_Statement.toUpperCase() >
                            b.Objective_Statement.toUpperCase()
                            ? 1
                            : -1
                        : -1
            );
        });
        return outcomesData;
    }

    function buildAllowedConsumersObj(
        userIdsWithGoals,
        userIdsWithRemainingGoals
    ) {
        var remainingGoalsIds = {};
        userIdsWithGoals.forEach(user => {
            userIdsWithRemainingGoals.every(userReminingGoal => {
                if (user.id === userReminingGoal.ID) {
                    remainingGoalsIds[user.id] = true;
                    return false;
                } else {
                    remainingGoalsIds[user.id] = false;
                    return true;
                }
            });
        });

        var consumerIds = userIdsWithGoals.map(userId => {
            var showAlert = remainingGoalsIds[parseInt(userId.id)];
            return {
                consumer_id: userId.id,
                showAlertIcon: showAlert
            };
        });

        roster2.setAllowedConsumers(consumerIds);
        if (initLoad) {
            roster2.miniRosterinit(null, {
                hideDate: true
            });
            roster2.showMiniRoster({
                hideDate: true,
            })
        }
    }

    function getConsumersWithRemainingGoals() {
        var getUserIdPromise = new Promise(function (resolve, reject) {
            outcomesAjax.getUserIdsWithGoalsByDate(currDate, res => {
                userIdsWithGoals = res;
                resolve("success");
            });
        });
        var getRemainingDailyGoalsPromise = new Promise(function (resolve, reject) {
            outcomesAjax.getRemainingDailyGoals(currDate, res => {
                userIdsWithRemainingGoals = res;
                resolve("success");
            });
        });

        Promise.all([getUserIdPromise, getRemainingDailyGoalsPromise]).then(
            function () {
                buildAllowedConsumersObj(userIdsWithGoals, userIdsWithRemainingGoals);
            }
        );
    }
    function loadLandingPage() {
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        PROGRESS.SPINNER.show("Loading Outcomes...");

        OUTCOMES_SECTION = document.createElement("div");
        OUTCOMES_SECTION.classList.add("outcomes");

        // var message = document.createElement("h2");
        // message.classList.add("landingMessage");
        // message.innerHTML = `Please select a consumer to get started.`;

        // OUTCOMES_SECTION.appendChild(message);
        DOM.ACTIONCENTER.appendChild(OUTCOMES_SECTION);


        currDate = UTIL.getTodaysDate();
        outcomesAjax.getViewableGoalIdsByPermission(getConsumersWithRemainingGoals);
    }

    // function appendMiniRoster(miniRoster) {
    //   DOM.clearActionCenter();
    //   DOM.ACTIONCENTER.appendChild(miniRoster);
    // }

    function init() {
        initLoad = true
        // var enabledConsumers = roster.getEnabledConsumers();

        // if (enabledConsumers.length === 0) {
        //   // display mini roster for consumer selection
        //   PROGRESS.SPINNER.show("Please wait while we gather everyone up...");
        //   roster.buildRoster(true, false, appendMiniRoster, true);
        // } else {
        //   PROGRESS.SPINNER.show("Loading Outcomes...");
        //   loadLandingPage();
        // }
        loadLandingPage();
    }

    return {
        handleActionNavEvent,
        dashHandler,
        init
    };
})();
