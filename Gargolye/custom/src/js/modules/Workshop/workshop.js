var workshop = (function () {
    //DOM ELEMENTS
    var locationDropdown;
    var jobDropdown;
    var supervisorDropdown;
    var multiSelectBtn;
    var clockOutNavBtn;
    var consumerListBtn;
    var filterBtn;
    //DROPDOWN DATA
    var locationDropdownData;
    var locationFilterDropdownData;
    var jobDropdownData;
    var updateJobFilterDropdownData;
    var jobFilterDropdownData;
    var supervisorDropdownData;

    var enableMultiEdit = false;
    //Values
    var locationID;
    var selectedBatchId;
    var enabledConsumers;
    var selectedConsumers = [];
    var multiConsumerSelect = [];
    var minStart;
    var minDateIso;
    var maxDateIso;
    var maxEnd;
    var displayDateIso;
    var workshopFilterListData = {
        token: "",
        selectedDate: "",
        consumerIds: enabledConsumers,
        locationId: 0,
        jobStepId: 0,
        application: "",
        batchId: selectedBatchId,
        locationName: ""
    };
    var filterCache = {
        locationSelectedOpt: 0,
        jobStepSelectedOpt: 0
    };
    var mainTableData = {};
    var mainJobData = {};
    var mainLocationData = {};
    let initalRosterLoad
    let activeModulesConsumers = []

    let btnWrap;
    let locationBtnWrap;
    let jobStepBtnWrap;
    let serviceDateBtnWrap;


    //UTIL =====================================
    function compareSupList(a, b) {
        const nameA = a.text.toUpperCase();
        const nameB = b.text.toUpperCase();

        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    }

    function checkRequiredFields(btn) {
        var hasErrors = [].slice.call(document.querySelectorAll(".error"));
        if (hasErrors.length === 0) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }
    }

    // ERROR POPUPS
    var errorPopup = POPUP.build({
        header: "ERROR",
        id: "errorPopup",
        classNames: "error"
    });
    var errorPopupText = document.createElement("p");
    errorPopupText.classList.add("errorTextArea");
    errorPopup.appendChild(errorPopupText);
    //=============================================

    // Action Nav
    //------------------------------------
    function setupActionNav() {
        // show clockout button
        clockOutNavBtn = button.build({
            text: "Clock Out",
            style: "secondary",
            type: "contained",
            classNames: "disabled",
            callback: function () {
                multiConsumerSelect.forEach(consumer => {
                    let obj = {};
                    obj["id"] = consumer;
                    selectedConsumers.push(obj);
                });
                clockInOutActionPopup("out");
                //Reset Stuff
                consumerListBtn = document.querySelector(".consumerListBtn");
                ACTION_NAV.hide();
                enableMultiEdit = false;
                multiConsumerSelect = [];
                filterBtn.classList.remove("disabled");
                multiSelectBtn.classList.remove("enabled");
                consumerListBtn.classList.remove("disabled");
                //Un-select elements
                var selectedElms = document.querySelectorAll(".selected");
                [].forEach.call(selectedElms, function (el) {
                    el.classList.remove("selected");
                });
            }
        });

        ACTION_NAV.clear();
        ACTION_NAV.populate([clockOutNavBtn]);
        ACTION_NAV.hide();
    }

    function checkOpenBatches() {
        workshopAjax.WorkshopPreBatchLoad(d => {
            var openBatches;
            openBatches = d;
            let batchPickerPopup = document.createElement("div");
            batchPickerPopup.classList.add("popup", "visable", "batchPicker");

            let header = document.createElement("h2");
            header.classList.add("popupHeader");
            batchPickerPopup.appendChild(header);

            if (openBatches.length == 1) {
                selectedBatchId = openBatches[0].id;
                minStart = openBatches[0].startdate;
                maxEnd = openBatches[0].enddate;
                initPageLoad();
            } else if (openBatches.length > 1) {
                header.innerHTML = "Please Select A Batch";
                let applyBtn = button.build({
                    id: "apply",
                    text: "Apply",
                    style: "secondary",
                    type: "contained",
                    icon: "checkmark",
                    callback: function () {
                        selectedBatchId =
                            selectedBatchId === "" ? openBatches[0].id : selectedBatchId;
                        for (var x = 0; x < openBatches.length; x++) {
                            if (openBatches[x].id === selectedBatchId) {
                                minStart = openBatches[x].startdate;
                                maxEnd = openBatches[x].enddate;
                            }
                        }
                        DOM.ACTIONCENTER.removeChild(batchPickerPopup);
                        overlay.hide();
                        initPageLoad();
                    }
                });

                let batchDropdown = dropdown.build({
                    dropdownId: "batchDropdown",
                    label: "Batch",
                    style: "secondary"
                });
                let today = UTIL.getTodaysDate();
                let defaultId = 0;
                today = new Date(today.replace(/-/g, '\/'));
                openBatches.forEach(findCorrectDates);
                function findCorrectDates(ele) {
                    let startDate = new Date(ele.startdate);
                    let endDate = new Date(ele.enddate);
                    if (today >= startDate && today <= endDate) {
                        defaultId = ele.id;
                        openBatches.splice(openBatches.indexOf(ele), 1);
                        openBatches.unshift(ele);
                    }
                }
                let dropdownData = openBatches.map(b => {
                    var id = b.id;
                    var value = b.id;
                    var text = b.name;
                    return {
                        id,
                        value,
                        text
                    };
                });

                batchPickerPopup.appendChild(batchDropdown);
                batchPickerPopup.appendChild(applyBtn);
                DOM.ACTIONCENTER.appendChild(batchPickerPopup);
                dropdown.populate("batchDropdown", dropdownData);
                batchDropdown.addEventListener("change", () => {
                    var selectedOption = event.target.options[event.target.selectedIndex];
                    selectedBatchId = selectedOption.id;
                    selectedBatchId = parseInt(selectedBatchId);
                });
                overlay.show();
            } else {
                header.innerHTML =
                    "There are no batches available for this date.  Please contact your workshop administrator.";
                let exitBtn = button.build({
                    id: "exit",
                    text: "Exit",
                    style: "secondary",
                    type: "contained",
                    callback: function () {
                        DOM.ACTIONCENTER.removeChild(batchPickerPopup);
                        overlay.hide();
                        loadApp('home')
                    }
                });
                overlay.show();
                batchPickerPopup.appendChild(exitBtn);
                DOM.ACTIONCENTER.appendChild(batchPickerPopup);
            }
        });
    }

    function breakDownConsumerList(consumerArray) {
        var consumerIdList = consumerArray.map(c => c.id).join(",");
        return consumerIdList;
    }

    function buildSelectionFields() {
        minDateIso = UTIL.formatDateToIso(minStart.split(" ")[0]);
        maxDateIso = UTIL.formatDateToIso(maxEnd.split(" ")[0]);
        let today = UTIL.getTodaysDate();

        if (today < minDateIso || today > maxDateIso) {
            displayDateIso = minDateIso;
        } else {
            displayDateIso = today;
        }
        //dropdown supervisor
        supervisorDropdown = dropdown.build({
            dropdownId: "supervisorDropdown",
            label: "Supervisor",
            style: "secondary"
        });
        dateSelection = input.build({
            id: "date",
            label: "Date",
            type: "date",
            style: "secondary",
            value: displayDateIso,
            attributes: [
                { key: "min", value: minDateIso },
                { key: "max", value: maxDateIso }
            ]
        });

        dateSelection.addEventListener("keydown", event => {
            event.preventDefault();
            event.stopPropagation();
        })

        dateSelection.addEventListener("change", event => {
            workshopFilterListData.selectedDate = event.target.value; 
        })

    }

    function initialData() {
        // Initial Date: if todays date is in the current batch, initial date is today.
        // else, Initial date is the first day of the batch(minStart).
        minDateIso = UTIL.formatDateToIso(minStart.split(" ")[0]);
        maxDateIso = UTIL.formatDateToIso(maxEnd.split(" ")[0]);
        let today = UTIL.getTodaysDate();
        let defaultWorkshopLocation = defaults.getLocation("workshop");
        if (defaultWorkshopLocation === "") defaultWorkshopLocation = 0;
        locationID = defaultWorkshopLocation;
        if (today < minDateIso || today > maxDateIso) {
            displayDateIso = minDateIso;
        } else {
            displayDateIso = today;
        }
        roster2.updateSelectedDate(displayDateIso)
        workshopFilterListData.selectedDate = displayDateIso;
        workshopFilterListData.batchId = selectedBatchId;
        workshopFilterListData.token = $.session.Token;
        workshopFilterListData.application = $.session.applicationName;
        workshopFilterListData.consumerIds = breakDownConsumerList(
            activeModulesConsumers
        );
        //Only allow  enabled consumers - Date, LocaitonID, returns consumers (called employee_id).
        workshopAjax.getEnabledConsumersForWorkshop(
            displayDateIso,
            defaultWorkshopLocation,
            res => {
                const allowedConsumers = []
                res.forEach(r => {
                    var consumer_id = r.employee_id;
                    const filteredConsumer = activeModulesConsumers.filter(consumer => consumer.id === consumer_id);
                    if (filteredConsumer.length !== 0) allowedConsumers.push({ 'consumer_id': consumer_id })
                });
                roster2.setAllowedConsumers(allowedConsumers);
            }
        );

        workshopAjax.WorkshopLocations(displayDateIso, r => {
            r.forEach(r => {
                if (!mainLocationData[r.id]) {
                    obj = {
                        locName: r.name
                    };
                    mainLocationData[r.id] = obj;
                }
            });

            locationDropdownData = r.map(r => {
                var id = `loc${r.id}`;
                var value = r.id;
                var text = r.name;
                return {
                    id,
                    value,
                    text
                };
            });
            locationFilterDropdownData = [...locationDropdownData];
            locationFilterDropdownData.unshift({ id: "loc0", value: 0, text: "All" });
            locationDropdownData.unshift({ id: "loc0", value: 0, text: "" });
        });

        workshopAjax.WorkshopGetSupervisors(displayDateIso, r => {
            supervisorDropdownData = r.map(r => {
                var id = `sup${r.id}`;
                var value = r.id;
                var text = r.name;
                return {
                    id,
                    value,
                    text
                };
            });
            supervisorDropdownData.sort(compareSupList);
            supervisorDropdownData.unshift({ id: "sup0", value: 0, text: "" });
        });

        workshopAjax.WorkshopGetJobCode(displayDateIso, 0, r => {
            r.forEach(r => {
                if (!mainJobData[r.jobstepid]) {
                    obj = {
                        activityType: r.activitytype,
                        jobStepId: r.jobstepid,
                        jobString: r.shortdescription
                    };
                    mainJobData[r.jobstepid] = obj;
                }
            });

            jobDropdownData = r.map(r => {
                var id = `job${r.jobstepid}`;
                var value = r.jobstepid;
                var text = `${r.customercode} - ${r.jobcode} - ${r.jobstep} - ${r.shortdescription}`;
                return {
                    id,
                    value,
                    text
                };
            });
            jobFilterDropdownData = [...jobDropdownData];
            jobFilterDropdownData.unshift({ id: "job0", value: 0, text: "All" });
            jobDropdownData.unshift({ id: "job0", value: "%", text: "" });
        });
    }

    function updateJobDropdown(locationId, forFilter) {
        workshopAjax.WorkshopGetJobCode(displayDateIso, locationId, r => {
            if (forFilter) {
                updateJobFilterDropdownData = r.map(r => {
                    var id = `job${r.jobstepid}`;
                    var value = r.jobstepid;
                    var text = `${r.customercode} - ${r.jobcode} - ${r.jobstep} - ${r.shortdescription}`;
                    return {
                        id,
                        value,
                        text
                    };
                });
                updateJobFilterDropdownData.unshift({
                    id: "job0",
                    value: 0,
                    text: "All"
                });
                dropdown.populate("filterJobDropdown", updateJobFilterDropdownData);
            } else {
                var updateJobDropdownData = r.map(r => {
                    var id = `job${r.jobstepid}`;
                    var value = r.jobstepid;
                    var text = `${r.customercode} - ${r.jobcode} - ${r.jobstep} - ${r.shortdescription}`;
                    return {
                        id,
                        value,
                        text
                    };
                });
                updateJobDropdownData.unshift({ id: "job0", value: "%", text: "" });
                dropdown.populate("timeClockJobDropdown", updateJobDropdownData);
            }
        });
    }

    function buildWorkshopTable(data, callback) {
        var tableData = data;

        multiSelectBtn = button.build({
            id: "multiSelect",
            text: "Multi select",
            icon: "multiSelect",
            style: "secondary",
            type: "contained",
            classNames: "multiSelectBtn",
            callback: function () {
                enableMultiEditRows(multiSelectBtn);
                filterBtn.classList.toggle("disabled");
            }
        });

        function getFilterValues() {
            return (filterValues = {
                workshopLocation: workshopFilterListData.locationId,
                workshopJob: workshopFilterListData.jobStepId,
                workshopDate: workshopFilterListData.selectedDate,
                workshopStartDate: minDateIso,
                workshopEndDate: maxDateIso
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

        reportsBtn = createMainReportButton([{ text: 'Job Activity Detail Report by Employee and Job' }])

        var workshopTableOpts = {
            headline: `Batch Period:  ${UTIL.formatDateFromIso(
                minDateIso
            )} - ${UTIL.formatDateFromIso(
                maxDateIso
            )} <br>Date: ${UTIL.formatDateFromIso(displayDateIso)}`,
            columnHeadings: [
                "Consumer",
                "Start Time",
                "End Time",
                "Job Code",
                "Job Step",
                "Hours",
                "Quantity",
                "Supervisor"
            ],
            tableId: "workshopTable",
            // callback: handleWorkshopTableEvents
        };

        data.forEach(d => {
            if (!mainTableData[d.jobactid]) {
                obj = {
                    startTime: d.starttime,
                    endTime: d.endtime,
                    quantity: d.quantity,
                    consumer: d.name,
                    consumerid: d.consumerid,
                    isPieceRate: d.activitytype === "P" ? true : false
                };
                mainTableData[d.jobactid] = obj;
            }
        });

        tableData = data.map(d => {
            consumerName = `${d.name.split(" ")[1]}, ${d.name.split(" ")[0]}`;
            trimedHour = d.hours.slice(0, -2);
            if (d.hours !== "") {
                trimedHour = Number(trimedHour);
            }
            //if ($.session.WorkshopUpdate) {
            return {
                values: [
                    consumerName,
                    UTIL.convertFromMilitary(d.starttime),
                    d.endtime === "" ? icons.error : UTIL.convertFromMilitary(d.endtime),
                    d.jobcode,
                    d.jobstep,
                    trimedHour === "" ? "-" : trimedHour,
                    d.activitytype !== "P"
                        ? "-"
                        : d.quantity === "" || d.quantity === "0"
                            ? icons.error
                            : d.quantity,
                    d.supervisor === " " ? "-" : d.supervisor
                ],
                id: `jobAct${d.jobactid}`,
                attributes: [{ key: "data-job-activity", value: d.jobactid }],
                onClick: handleWorkshopTableEvents
                //  }
                //}
                //  else {
                //    return {
                //      values: [
                //        consumerName,
                //        UTIL.convertFromMilitary(d.starttime),
                //        d.endtime === "" ? icons.error : UTIL.convertFromMilitary(d.endtime),
                //        d.jobcode,
                //        d.jobstep,
                //        trimedHour === "" ? "-" : trimedHour,
                //        d.activitytype !== "P"
                //          ? "-"
                //          : d.quantity === "" || d.quantity === "0"
                //          ? icons.error
                //          : d.quantity,
                //        d.supervisor === " " ? "-" : d.supervisor
                //      ],
                //      id: `jobAct${d.jobactid}` 
                //     // attributes: [{ key: "data-job-activity", value: d.jobactid }],
                //     // onClick: handleWorkshopTableEvents
                //    }
            }
        });

        DOM.clearActionCenter();

        filterSelectReportBtnWrap = document.createElement("div");
        filterSelectReportBtnWrap.classList.add("btnWrap", "filterSelectReportBtnWrap");

        filterSelectReportBtnWrap.appendChild(multiSelectBtn);
        filterSelectReportBtnWrap.appendChild(reportsBtn);

        DOM.ACTIONCENTER.appendChild(filterSelectReportBtnWrap);

        const filteredBy = updateCurrentFilterDisplay();
        DOM.ACTIONCENTER.appendChild(filteredBy);
        var workshopTable = table.build(workshopTableOpts);
        DOM.ACTIONCENTER.appendChild(workshopTable);
        table.populate("workshopTable", tableData);

        // //permission
        if (!$.session.WorkshopUpdate) {
            multiSelectBtn.classList.add("disabled")
            multiSelectBtn.classList.remove("enabled")
            toggleMiniRosterBtnVisible(false)
        }
        if (callback) {
            callback();
        }
    }

    function handleWorkshopTableEvents(event) {
        var isRow = event.target.classList.contains("table__row");
        var jobAct = event.target.dataset.jobActivity;
        if (!isRow) return; // if not row return
        if (!$.session.WorkshopUpdate) return;  // 

        if (enableMultiEdit) {
            if (mainTableData[jobAct].endTime) return; // If they already clocked out, do nothing
            event.target.classList.toggle("selected");
            //Add if row is being selected
            if (event.target.classList.contains("selected")) {
                //and if it doesn't exist in the array
                if (!multiConsumerSelect.includes(mainTableData[jobAct].consumerid)) {
                    multiConsumerSelect.push(mainTableData[jobAct].consumerid);
                }
            } else {
                //Remove the consumer id if it is being deselected
                multiConsumerSelect.splice(
                    multiConsumerSelect.indexOf(mainTableData[jobAct].consumerid),
                    1
                );
            }
            //disable clock out button if nothing is selected
            if (multiConsumerSelect.length === 0) {
                clockOutNavBtn.classList.add("disabled");
            } else {
                clockOutNavBtn.classList.remove("disabled");
            }
        } else if (!enableMultiEdit) {
            tableRowPopup(event.target);
        }
    }

    function enableMultiEditRows(multiBtn) {
        setupActionNav();
        miniRosterBtn = document.querySelector(".consumerListBtn");
        enableMultiEdit = !enableMultiEdit;
        multiBtn.classList.toggle("enabled");
        miniRosterBtn.classList.toggle("disabled");

        if (enableMultiEdit) {
            ACTION_NAV.show();
        } else {
            selectedConsumers = [];
            ACTION_NAV.hide();
        }

        var highlightedRows = [].slice.call(
            document.querySelectorAll(".table__row.selected")
        );
        highlightedRows.forEach(row => row.classList.remove("selected"));
    }

    function tableRowPopup(row) {
        // var isPieceRate = row.dataset.pieceRate == "true";
        jobActivity = row.dataset.jobActivity;
        jobActivity = parseInt(jobActivity);
        var isPieceRate = mainTableData[jobActivity].isPieceRate;
        let rowPopup = POPUP.build({
            classNames: "workshopTableRowPopup",
            header: mainTableData[jobActivity].consumer,
            id: `jobAct${jobActivity}`
        });

        let startTimeField = input.build({
            id: "startTime",
            label: "Start Time",
            type: "time",
            style: "secondary",
            value: mainTableData[jobActivity].startTime
        });

        let endTimeField = input.build({
            id: "endTime",
            label: "End Time",
            type: "time",
            style: "secondary",
            value: mainTableData[jobActivity].endTime
        });

        //only show if they have piece rate
        let quantityField = input.build({
            id: "pieceRateQuantity",
            label: "Quantity",
            type: "number",
            style: "secondary",
            attributes: [
                { key: "min", value: "0" },
                { key: "max", value: "90000" },
                { key: "onkeypress", value: "return event.charCode >= 48 && event.charCode <= 57" }
            ],
            value: mainTableData[jobActivity].quantity
        });
        //enable when there are changes to apply
        let saveBtn = button.build({
            id: "save",
            text: "Save",
            style: "secondary",
            type: "contained",
            icon: "save",
            // classNames: 'disabled',
            callback: function () {
                tableRowApplyChange(jobActivity, row, rowPopup);
            }
        });

        let deleteEntryBtn = button.build({
            id: "deleteEntry",
            text: "Delete Entry",
            style: "secondary",
            type: "outlined",
            icon: "delete",
            callback: function () {
                deleteConfirmation(
                    rowPopup,
                    (res = () => {
                        if (res) {
                            workshopAjax.deleteWorkshopEntry(jobActivity);
                            var parent = row.parentElement;
                            parent.removeChild(row);
                        }
                    })
                );
            }
        });

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("rowPopupBtnWrap");
        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(deleteEntryBtn);

        rowPopup.appendChild(startTimeField);
        rowPopup.appendChild(endTimeField);
        if (isPieceRate) rowPopup.appendChild(quantityField);
        rowPopup.appendChild(btnWrap);

        POPUP.show(rowPopup);
    }

    function deleteConfirmation(rowPopup, callback) {
        POPUP.hide(rowPopup);
        var confPopup = POPUP.build({
            classNames: "warning"
        });
        var cancelBtn = button.build({
            text: "Cancel",
            style: "secondary",
            type: "contained",
            icon: "no",
            callback: function () {
                POPUP.hide(confPopup);
                POPUP.show(rowPopup);
                callback((res = false));
            }
        });
        var confirmBtn = button.build({
            text: "Delete Entry",
            style: "secondary",
            type: "outlined",
            id: "confDeleteBtn",
            icon: "delete",
            callback: function () {
                POPUP.hide(confPopup);
                callback((res = true));
            }
        });
        var btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(cancelBtn);
        btnWrap.appendChild(confirmBtn);

        var textArea = document.createElement("p");
        textArea.classList.add("warningTextArea");
        textArea.innerHTML = "Are you sure you want to delete this record?";
        confPopup.appendChild(textArea);
        confPopup.appendChild(btnWrap);
        POPUP.show(confPopup);
    }

    function tableRowApplyChange(jobActivity, row, popup) {
        //get time out if exists
        //get time in
        //get quantity if exists
        //clock out if time out exists and is different from previous clockout
        //update clock in if time is is different from previous clockin
        //update quantity if exists and is different

        var changedStartTime = document.getElementById("startTime").value;
        var startTime = mainTableData[jobActivity].startTime;
        var endTimeField = document.getElementById("endTime");
        var quantityField = document.getElementById("pieceRateQuantity");

        if (endTimeField.value) {
            var enteredEndTime = endTimeField.value;
            if (enteredEndTime.length < 8) {
                enteredEndTime += ":00";
            }
        }
        if (quantityField) {
            if (quantityField.value) { var quantity = quantityField.value; }
            else var quantity = "0";
        }

        if (changedStartTime === enteredEndTime) {
            POPUP.hide(popup);
            POPUP.show(errorPopup);
            errorPopupText.innerHTML = "Start Time cannot be the same as End Time.";
            return;
        }

        //UPDATE CLOCKIN TIME IF IT HAS CHANGED
        //workshopajax.updateworkshopclockin
        if (startTime !== document.getElementById("startTime").value) {
            var changedStartTime = document.getElementById("startTime").value;
            if (changedStartTime.length < 8) {
                changedStartTime += ":00";
            }
            if (!enteredEndTime || changedStartTime < enteredEndTime) {
                workshopAjax.updateWorkshopClockIn(
                    jobActivity,
                    changedStartTime,
                    res => {
                        try {
                            if (res.indexOf("Start Overlap") != -1) {
                                throw "OverlapError";
                            }
                            mainTableData[jobActivity].startTime = changedStartTime;
                            let changedStartTimeDISPLAY = UTIL.convertFromMilitary(
                                changedStartTime
                            );
                            row.children[1].innerHTML = changedStartTimeDISPLAY;
                            row.classList.remove("overlapError"); //If they are saving from Overlap
                            hours = Number(
                                UTIL.calculateTotalHours(
                                    mainTableData[jobActivity].startTime,
                                    mainTableData[jobActivity].endTime
                                )
                            );
                            row.children[5].innerHTML = hours;
                        } catch (e) {
                            if (e === "OverlapError") {
                                POPUP.show(errorPopup);
                                errorPopupText.innerHTML =
                                    "Changes overlap with existing record";
                            }
                        }
                    }
                );
            } else {
                POPUP.hide(popup);
                POPUP.show(errorPopup);
                errorPopupText.innerHTML = "Start Time cannot be set after End Time";
                return;
            }
        }

        //CLOCK OUT/UPDATE CLOCK OUT TIME
        if (enteredEndTime) {
            if (
                enteredEndTime > mainTableData[jobActivity].startTime &&
                enteredEndTime !== mainTableData[jobActivity].endTime
            ) {
                mainTableData[jobActivity].endTime = enteredEndTime;
                workshopAjax.clockoutWorkshopSingle(
                    jobActivity,
                    enteredEndTime,
                    res => {
                        try {
                            if (res.indexOf("End Overlap") != -1) {
                                throw "OverlapError";
                            }
                            enteredEndTimeDISPLAY = UTIL.convertFromMilitary(enteredEndTime);
                            row.children[2].innerHTML = enteredEndTimeDISPLAY;
                            row.classList.remove("overlapError"); //If they are saving from Overlap
                            hours = Number(
                                UTIL.calculateTotalHours(
                                    mainTableData[jobActivity].startTime,
                                    mainTableData[jobActivity].endTime
                                )
                            );
                            row.children[5].innerHTML = hours;
                        } catch (e) {
                            POPUP.show(errorPopup);
                            errorPopupText.innerHTML = "Changes overlap with existing record";
                        }
                    }
                );
            } else if (enteredEndTime < startTime) {
                POPUP.hide(popup);
                POPUP.show(errorPopup);
                errorPopupText.innerHTML = "End Time cannot be set before Start Time";
                return;
            }
        }

        //UPDATE QUANTITY
        if (quantity && quantity !== mainTableData[jobActivity].quantity) {
            mainTableData[jobActivity].quantity = quantity;
            workshopAjax.updateWorkshopQuantity(quantity, jobActivity);
            row.children[6].innerHTML = quantity === "0" ? icons.error : quantity;
        }
        POPUP.hide(popup);
    }

    function tableFilterPopup(IsShow) {
        var filterPopup = POPUP.build({
            header: "Table Filter",
            id: "workhshopFilterTablePopup"
        });

        //dropdown location (needs the selected date)
        locationDropdown = dropdown.build({
            dropdownId: "locationDropdown",
            label: "Location",
            style: "secondary"
        });

        locationDropdown.addEventListener("change", () => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            locationID = selectedOption.value;
            filterCache.locationSelectedOpt = event.target.selectedIndex;
            workshopFilterListData.locationName = selectedOption.innerHTML;
            updateJobDropdown(locationID, true);
        });

        //dropdown job
        jobDropdown = dropdown.build({
            dropdownId: "filterJobDropdown",
            label: "Job",
            style: "secondary"
        });

        let filterApplyBtn = button.build({
            id: "filterApply",
            text: "Apply",
            style: "secondary",
            type: "contained",
            icon: "checkmark",
            callback: function () {
                filterApplyAction();
                POPUP.hide(filterPopup);
            }
        });

        if (IsShow == 'ALL' || IsShow == 'locationBtn')
            filterPopup.appendChild(locationDropdown);
        if (IsShow == 'ALL' || IsShow == 'jobStepBtn')
            filterPopup.appendChild(jobDropdown);
        if (IsShow == 'ALL' || IsShow == 'serviceDateBtn')
            filterPopup.appendChild(dateSelection);
        filterPopup.appendChild(filterApplyBtn);
        POPUP.show(filterPopup);
        updateJobDropdown(locationID, true);

        locationDropdownSelect = document.getElementById("locationDropdown");
        jobDropdownSelect = document.getElementById("filterJobDropdown"); 

        //Populate Dropdowns and Cache the selection
        dropdown.populate(
            "locationDropdown",
            locationFilterDropdownData,
            locationID
        );
        // locationDropdownSelect.options.selectedIndex =
        //   filterCache.locationSelectedOpt;
        jobFilterDropdownData[0].text = "All";
        jobFilterDropdownData[0].value = 0;
        updateJobFilterDropdownData
            ? dropdown.populate("filterJobDropdown", updateJobFilterDropdownData)
            : dropdown.populate("filterJobDropdown", jobFilterDropdownData);
        jobDropdownSelect.options.selectedIndex = filterCache.jobStepSelectedOpt;
    }

    function filterApplyAction() {
        displayDateIso = document.getElementById("date").value;
        locationDropdown = document.getElementById("locationDropdown");
        jobDropdown = document.getElementById("filterJobDropdown");

        locationID = locationDropdown.options[locationDropdown.selectedIndex].value;
        if (defaults.rememberLastLocation("workshop"))
            defaults.setLocation("workshop", locationID);

        workshopFilterListData.selectedDate = displayDateIso;
        workshopFilterListData.locationId =
            locationDropdown.options[locationDropdown.selectedIndex].value;
        workshopFilterListData.jobStepId =
            jobDropdown.options[jobDropdown.selectedIndex].value;
        filterCache.jobStepSelectedOpt = jobDropdown.selectedIndex;
        filterCache.locationSelectedOpt = locationDropdown.selectedIndex;
        //Refresh roster date:
        roster2.updateSelectedDate(displayDateIso)
        //Update active Consumers based on filter - Date, LocaitonID, returns consumers (called employee_id).
        workshopAjax.getEnabledConsumersForWorkshop(
            displayDateIso,
            workshopFilterListData.locationId,
            res => {
                const allowedConsumers = []
                res.forEach(r => {
                    var consumer_id = r.employee_id;
                    const filteredConsumer = activeModulesConsumers.filter(consumer => consumer.id === consumer_id);
                    if (filteredConsumer.length !== 0) allowedConsumers.push({ 'consumer_id': consumer_id })
                });
                roster2.setAllowedConsumers(allowedConsumers);
            }
        );
        workshopAjax.WorkshopFilterList(workshopFilterListData, buildWorkshopTable);
        updateCurrentFilterDisplay();
    }

    function updateCurrentFilterDisplay() { 
        var currentFilterDisplay = document.querySelector('.filteredByData');
        if (!currentFilterDisplay) {
            workshopFilterListData.locationName = locationID == 0 ? "All" : mainLocationData[locationID].locName;
            workshopFilterListData.locationId = locationID;
            currentFilterDisplay = document.createElement('div');
            currentFilterDisplay.classList.add('filteredByData');
            filterButtonSet();
            currentFilterDisplay.appendChild(btnWrap);
        } 

        currentFilterDisplay.style.maxWidth = '100%';

        if (workshopFilterListData.locationId == '0') {
            btnWrap.appendChild(locationBtnWrap);
            btnWrap.removeChild(locationBtnWrap);
        } else {
            if (document.getElementById('locationBtn') != null)
                document.getElementById('locationBtn').innerHTML = 'Location: ' + workshopFilterListData.locationName;
            btnWrap.appendChild(locationBtnWrap);
        }

        if (workshopFilterListData.jobStepId === '0' || workshopFilterListData.jobStepId === 0) {
            btnWrap.appendChild(jobStepBtnWrap);
            btnWrap.removeChild(jobStepBtnWrap);
        } else {
            if (document.getElementById('jobStepBtn') != null)
                document.getElementById('jobStepBtn').innerHTML = workshopFilterListData.jobStepId == '0' ? 'Job: All' : 'Job: ' + mainJobData[workshopFilterListData.jobStepId].jobString;
            btnWrap.appendChild(jobStepBtnWrap);
        }

        if (document.getElementById('serviceDateBtn') != null)
            document.getElementById('serviceDateBtn').innerHTML = 'Date: ' + workshopFilterListData.selectedDate;


        return currentFilterDisplay;
    }

    function filterButtonSet() {
        filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtnNew',
            callback: () => { tableFilterPopup('ALL') },
        });

        locationBtn = button.build({
            id: 'locationBtn',
            text: 'Location: ' + workshopFilterListData.locationName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { tableFilterPopup('locationBtn') },
        });
        locationCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('locationBtn') },
        });

        jobStepBtn = button.build({
            id: 'jobStepBtn',
            text: workshopFilterListData.jobStepId == '0' || workshopFilterListData.jobStepId === 0 ? 'Job: All' : 'Job: ' + mainJobData[workshopFilterListData.jobStepId].jobString,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { tableFilterPopup('jobStepBtn') },
        });
        jobStepCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('jobStepBtn') },
        });

        serviceDateBtn = button.build({
            id: 'serviceDateBtn',
            text: 'Date: ' + workshopFilterListData.selectedDate,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { tableFilterPopup('serviceDateBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        locationBtnWrap = document.createElement('div');
        locationBtnWrap.classList.add('filterSelectionBtnWrap');
        locationBtnWrap.appendChild(locationBtn);
        locationBtnWrap.appendChild(locationCloseBtn);
        btnWrap.appendChild(locationBtnWrap);

        jobStepBtnWrap = document.createElement('div');
        jobStepBtnWrap.classList.add('filterSelectionBtnWrap');
        jobStepBtnWrap.appendChild(jobStepBtn);
        jobStepBtnWrap.appendChild(jobStepCloseBtn);
        btnWrap.appendChild(jobStepBtnWrap);

        serviceDateBtnWrap = document.createElement('div');
        serviceDateBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceDateBtnWrap.appendChild(serviceDateBtn);
        btnWrap.appendChild(serviceDateBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'jobStepBtn') {
            workshopFilterListData.jobStepId = 0; 
        }
        if (closeFilter == 'locationBtn') {
            workshopFilterListData.locationId = '0'; 
        }
        filterApplyAction();
    }

    function clockInOutChoicePopup() {
        let popup = POPUP.build({
            header: "Please Choose an Option",
            id: "clockInOutChoicePopup"
        });

        let clockInBtn = button.build({
            text: "Clock In",
            style: "secondary",
            type: "contained",
            callback: function () {
                POPUP.hide(popup);
                clockInOutActionPopup("in");
            }
        });
        let clockOutBtn = button.build({
            text: "Clock Out",
            style: "secondary",
            type: "contained",
            callback: function () {
                POPUP.hide(popup);
                clockInOutActionPopup("out");
            }
        });
        let btnWrap = document.createElement("div");
        btnWrap.classList.add("choiceBtnWrap");
        btnWrap.appendChild(clockInBtn);
        btnWrap.appendChild(clockOutBtn);
        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }

    function clockInOutActionPopup(choice) {
        //Display the Date and Location that were selected from the Filter.
        let locationDisplay = document.createElement("h4");
        locationDisplay.innerHTML = `Location: ${locationID == 0
            ? "No location specified"
            : mainLocationData[locationID].locName
            }`;
        // locationDisplay.innerHTML = `Location: ${
        //   workshopFilterListData.locationId == 0
        //     ? "No location specified"
        //     : mainLocationData[workshopFilterListData.locationId].locName
        // }`;
        let dateDisplay = document.createElement("h4");
        dateDisplay.innerHTML = `Selected Date: ${UTIL.formatDateFromIso(
            displayDateIso
        )}`;

        timeClockJobDropdown = dropdown.build({
            dropdownId: "timeClockJobDropdown",
            label: "Job",
            style: "secondary"
        });

        timeClockLocationDropdown = dropdown.build({
            dropdownId: "timeClockLocationDropdown",
            label: "Location",
            style: "secondary"
        });

        let inPopup = POPUP.build({
            header: "Clock In",
            id: "clockInOutPopup"
        });

        let outPopup = POPUP.build({
            header: "Clock Out",
            id: "clockInOutPopup"
        });

        let timeInField = input.build({
            id: "inTime",
            label: "In Time",
            type: "time",
            style: "secondary",
            callback: function () { }
        });
        timeInField.classList.add("error");

        let timeOutField = input.build({
            id: "outTime",
            label: "Out Time",
            type: "time",
            style: "secondary"
        });
        timeOutField.classList.add("error");

        let clockInBtn = button.build({
            text: "Clock In",
            style: "secondary",
            classNames: "disabled",
            type: "contained",
            id: "clockInBtn",
            callback: function () {
                clockIn();
                POPUP.hide(inPopup);
                //Clock in function
            }
        });

        let clockOutBtn = button.build({
            text: "Clock Out",
            style: "secondary",
            classNames: "disabled",
            type: "contained",
            callback: function () {
                clockOut();
                roster2.clearActiveConsumers();
                POPUP.hide(outPopup);
                //clock out function
            }
        });

        let inCancelBtn = button.build({
            text: "Cancel",
            style: "secondary",
            type: "outlined",
            callback: function () {
                roster2.clearActiveConsumers();
                POPUP.hide(inPopup);
            }
        });

        let outCancelBtn = button.build({
            text: "Cancel",
            style: "secondary",
            type: "outlined",
            callback: function () {
                roster2.clearActiveConsumers();
                POPUP.hide(outPopup);
            }
        });

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");

        timeInField.addEventListener("change", function () {
            let inTimeField = document.getElementById("inTime");
            if (inTimeField.value === "") {
                timeInField.classList.add("error");
            } else {
                timeInField.classList.remove("error");
            }
            checkRequiredFields(clockInBtn);
        });
        timeOutField.addEventListener("change", function () {
            let outTimeField = document.getElementById("outTime");
            if (outTimeField.value === "") {
                timeOutField.classList.add("error");
            } else {
                timeOutField.classList.remove("error");
            }
            checkRequiredFields(clockOutBtn);
        });
        timeClockJobDropdown.classList.add("error");
        timeClockJobDropdown.addEventListener("change", function () {
            let timeClockJobDropdownField = document.getElementById(
                "timeClockJobDropdown"
            );
            if (
                timeClockJobDropdownField.options[
                    timeClockJobDropdownField.selectedIndex
                ].value === "%"
            ) {
                timeClockJobDropdown.classList.add("error");
            } else {
                timeClockJobDropdown.classList.remove("error");
            }
            checkRequiredFields(clockInBtn);
        });

        switch (choice) {
            case "in": {
                inPopup.appendChild(dateDisplay);
                inPopup.appendChild(locationDisplay);
                inPopup.appendChild(timeClockJobDropdown);
                inPopup.appendChild(supervisorDropdown);
                inPopup.appendChild(timeInField);
                btnWrap.appendChild(clockInBtn);
                btnWrap.appendChild(inCancelBtn);
                inPopup.appendChild(btnWrap);
                POPUP.show(inPopup);

                updateJobDropdown(locationID, false);
                // updateJobDropdown(workshopFilterListData.locationId, false);

                // jobFilterDropdownData[0].text = "";
                // jobFilterDropdownData[0].value = "%";

                dropdown.populate("timeClockJobDropdown", jobFilterDropdownData);
                dropdown.populate(
                    "supervisorDropdown",
                    supervisorDropdownData,
                    $.session.PeopleId
                ); // default supervisor to the clocked in user (if supervisor)
                break;
            }
            case "out": {
                outPopup.appendChild(timeOutField);
                btnWrap.appendChild(clockOutBtn);
                btnWrap.appendChild(outCancelBtn);
                outPopup.appendChild(btnWrap);
                POPUP.show(outPopup);
                break;
            }
        }
    }

    function clockIn() {
        var supervisorID;
        let jobDropdownSelect = document.getElementById("timeClockJobDropdown");
        let jobStepIdInt = parseInt(
            jobDropdownSelect.options[jobDropdownSelect.selectedIndex].value
        );
        // let locationID = workshopFilterListData.locationId;
        let supervisorSelect = document.getElementById("supervisorDropdown");
        let supSelectedIndex = supervisorSelect.selectedIndex;
        if (supSelectedIndex !== -1) {
            supervisorID =
                supervisorSelect.options[supervisorSelect.selectedIndex].value;
        } else {
            supervisorID = "0";
        }
        let inTimeField = document.getElementById("inTime");
        let inTime = inTimeField.value + ":00";

        inData = {
            batchId: selectedBatchId,
            consumerids: selectedConsumers.map(e => e.id).join("|"),
            jobActType: mainJobData[jobStepIdInt].activityType,
            jobStepId: mainJobData[jobStepIdInt].jobStepId,
            jobString: mainJobData[jobStepIdInt].jobString,
            location: locationID,
            selectedDate: displayDateIso,
            startOrEnd: "Start",
            supervisor: supervisorID,
            time: inTime,
            token: $.session.Token
        };

        workshopFilterListData.jobStepId = 0;

        workshopAjax.WorkshopClockIn(inData, res => {
            if (res.length > 0) {
                // There are overlaps
                overlapErrorPopup(res, "in");
            } else {
                selectedConsumers = [];
                mainTableData = {};
                workshopAjax.WorkshopFilterList(
                    workshopFilterListData,
                    buildWorkshopTable
                );
            }

            roster2.clearActiveConsumers();
        });
    }

    function clockOut() {
        let outTimeField = document.getElementById("outTime");
        let outTime = outTimeField.value + ":00";
        outData = {
            batchId: selectedBatchId,
            consumerids: selectedConsumers.map(e => e.id).join("|"),
            jobActType: "",
            jobStepId: "0",
            jobString: "",
            location: "0",
            selectedDate: displayDateIso,
            startOrEnd: "End",
            supervisor: "0",
            time: outTime,
            token: $.session.Token
        };

        workshopFilterListData.jobStepId = 0;

        workshopAjax.WorkshopClockOut(outData, res => {
            if (res.length > 0) {
                overlapErrorPopup(res, "out");
            } else {
                selectedConsumers = [];
                mainTableData = {};
                workshopAjax.WorkshopFilterList(
                    workshopFilterListData,
                    buildWorkshopTable
                );
            }
        });
    }

    function overlapErrorPopup(overlapRecords, inOutString) {
        let clockedInConsumers = selectedConsumers.length - overlapRecords.length;

        let overlapErrorPopup = POPUP.build({
            header: `
      ${clockedInConsumers} ${clockedInConsumers !== 1 ? "consumers" : "consumer"
                } clocked ${inOutString}. 
      There ${overlapRecords.length === 1 ? "Is" : "Are"} ${overlapRecords.length
                } ${overlapRecords.length === 1 ? "Overlap." : "Overlaps."}
      `,
            id: "overlapErrorPopup"
        });

        let overlapDescriptionWrap = document.createElement("div");

        overlapRecords.forEach(r => {
            let overlapRecord = document.createElement("p");
            overlapRecord.innerHTML = `<h4>${mainTableData[r].consumer}</h4><br>
      Time in: ${UTIL.convertFromMilitary(mainTableData[r].startTime)} -
      Time out: ${UTIL.convertFromMilitary(mainTableData[r].endTime)}<br><hr>
      `;
            overlapDescriptionWrap.appendChild(overlapRecord);
        });

        let correctBtn = button.build({
            text: "Correct Overlaps",
            style: "secondary",
            type: "contained",
            callback: function () {
                POPUP.hide(overlapErrorPopup);
                overlapCorrection(overlapRecords);
            }
        });
        let continueBtn = button.build({
            text: "Continue",
            style: "secondary",
            type: "contained",
            callback: function () {
                mainTableData = {};
                workshopAjax.WorkshopFilterList(
                    workshopFilterListData,
                    buildWorkshopTable
                );
                POPUP.hide(overlapErrorPopup);
            }
        });
        selectedConsumers = [];
        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(correctBtn);
        btnWrap.appendChild(continueBtn);
        overlapErrorPopup.appendChild(overlapDescriptionWrap);
        overlapErrorPopup.appendChild(btnWrap);

        POPUP.show(overlapErrorPopup);
    }

    function overlapCorrection(overlapRecords) {
        workshopFilterListData.consumerIds = overlapRecords
            .map(r => mainTableData[r].consumerid)
            .join(",");

        workshopAjax.WorkshopFilterList(workshopFilterListData, res => {
            workshopFilterListData.consumerIds = breakDownConsumerList(
                activeModulesConsumers
            );
            buildWorkshopTable(res, callback => {
                overlapRecords.forEach(r => {
                    row = document.getElementById(`jobAct${r}`);
                    row.classList.add("overlapError");
                });
            });
        });
    }

    function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;
        var miniRoster = document.querySelector('[data-roster="waiting"]');
        var consumerList = document.querySelector('[data-roster="enabled"]');
        consumerListBtn = document.querySelector(".consumerListBtn");

        switch (targetAction) {
            // case "rosterDone": {
            //   roster.selectedConsumersToEnabledList();
            //   checkOpenBatches();
            //   enabledConsumers = roster.getEnabledConsumers();
            //   workshopFilterListData.consumerIds = breakDownConsumerList(
            //     enabledConsumers
            //   );
            //   break;
            // }
            // case "rosterCancel": {
            //   unloadApp($.loadedApp);
            //   setActiveModuleAttribute("home");
            //   DOM.clearActionCenter();
            //   DOM.ACTIONCENTER.removeAttribute("data-active-section");
            //   dashboard.load();
            //   break;
            // }
            case "miniRosterDone": {
                if (initalRosterLoad) {
                    activeModulesConsumers = roster2.getActiveConsumers();
                    initalRosterLoad = false
                    setActiveModuleSectionAttribute("workshop");
                    DOM.toggleNavLayout();
                    roster2.clearActiveConsumers();
                    workshopFilterListData.consumerIds = breakDownConsumerList(
                        activeModulesConsumers
                    );
                    checkOpenBatches();
                } else {
                    selectedConsumers = roster2.getActiveConsumers();
                    DOM.toggleNavLayout();
                    clockInOutChoicePopup();
                    roster2.clearActiveConsumers();
                }
                break;
            }
            case "miniRosterCancel": {
                if (initalRosterLoad) {
                    loadApp('home')
                } else {
                    DOM.toggleNavLayout();
                    roster2.clearActiveConsumers();
                }
                break;
            }
        }
    }

    function initPageLoad() {
        DOM.clearActionCenter();
        PROGRESS.init();
        PROGRESS.SPINNER.init();
        PROGRESS.SPINNER.show("Gathering Data");

        buildSelectionFields();
        initialData();
        workshopAjax.WorkshopFilterList(workshopFilterListData, buildWorkshopTable);
    }

    function init() {
        //RESET FILTERS
        filterCache = {
            locationSelectedOpt: 0,
            jobStepSelectedOpt: 0
        };
        workshopFilterListData.jobStepId = 0;
        selectedBatchId = "";
        enableMultiEdit = false;
        //--------
        let defaultWorkshopLocation = defaults.getLocation('workshop');
        if (defaultWorkshopLocation === '') {
            defaults.setLocation('workshop', 0);
            defaultWorkshopLocation = "0";
        }
        roster2.miniRosterinit({
            locationId: defaultWorkshopLocation,
            locationName: '',
        }, {
            hideDate: true,
        });

        initalRosterLoad = true
        sitenav = document.querySelector(".nav");
        setActiveModuleSectionAttribute("workshop");

        roster2.showMiniRoster({ hideDate: true })



        // enabledConsumers = roster.getEnabledConsumers();

        // if (enabledConsumers.length === 0) {
        //   // display mini roster for consumer selection
        //   roster.buildRoster(true, false, function appendMiniRoster(miniRoster) {
        //     DOM.ACTIONCENTER.appendChild(miniRoster);
        //   }, true);
        // } else {
        //   checkOpenBatches();
        // }
    }

    return {
        init,
        handleActionNavEvent
    };
})();
