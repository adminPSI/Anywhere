var CN_RejectedWidget = (function () {
    let cnProductivityChart
    let groupNotes = {}
    let timeObj = {}
    let rejectedNotes
    let widgetSettings
    let daysBack;
    let groups;
    let strgroupids;
    let objgroups = [];
    let groupids = [];

    function getRejectedData(cb) {
        // const response = (await CN_RejectedWidgetAjax.getCaseNotesRejected()).getDashboardCaseNotesRejectedResult;
        daysBack = widgetSettings.widgetConfig.daysBack;
        CN_RejectedWidgetAjax.getCaseNotesRejected(daysBack, res => {
            rejectedNotes = res.map(consumer => {
                const consumerObj = {
                    caseNoteId: consumer.Case_Note_ID,
                    personId: consumer.ID,
                    cnGroupId: consumer.Case_Note_Group_ID,
                    firstName: consumer.first_Name,
                    lastName: consumer.Last_Name,
                    serviceDate: consumer.Service_Date,
                    serviceCode: consumer.Service_Code,
                    endTime: consumer.End_Time,
                    startTime: consumer.Start_Time,
                    lastUpdate: consumer.Last_Update
                };
                return consumerObj;
            });
            getRejectedcnGroups();
            cb();
        });
    }

    function getRejectedcnGroups() {
        groups = {}

        if (getGroupsIds()) {

            strgroupids = groupids.map(g => g).join(",");

            CN_RejectedWidgetAjax.getGroupCaseNotes(strgroupids, res => {
                objgroupids = res.map(grpconsumer => {
                    const grpconsumerObj = {
                        caseNoteId: grpconsumer.Case_Note_ID,
                        personId: grpconsumer.ID,
                        cnGroupId: grpconsumer.Case_Note_Group_ID,
                        firstName: grpconsumer.first_Name,
                        lastName: grpconsumer.Last_Name,
                        serviceDate: grpconsumer.Service_Date,
                        serviceCode: grpconsumer.Service_Code,
                        endTime: grpconsumer.End_Time,
                        startTime: grpconsumer.Start_Time,
                        lastUpdate: grpconsumer.Last_Update
                    };
                    objgroups.push(grpconsumerObj);
                    return grpconsumerObj;
                });
                objgroups.forEach(fn => {
                    if (fn.cnGroupId !== '') {// 
                        // groupids.push(fn.cnGroupId);
                        var consumerId = fn.personId;
                        var name = `${fn.lastName}, ${fn.firstName}`;
                        if (!groups[fn.cnGroupId]) {
                            groups[fn.cnGroupId] = { [consumerId]: name }
                        }
                        groups[fn.cnGroupId][consumerId] = name;
                    }
                })
            });
        }
    }

    function getGroupsIds() {
        rejectedNotes.forEach(fn => {
            if (fn.cnGroupId !== '' && groupids.indexOf(fn.cnGroupId) === -1) {
                groupids.push(fn.cnGroupId);
            }
        })
        if (groupids.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    function populateRejectedWidget() {
        const widget = document.getElementById("casenotesrejected");
        if (!widget) return;
        const widgetBody = widget.querySelector(".widget__body");
        // if (rejectedNotes.length === 0) {
        if (rejectedNotes.length === 0) {
            widgetBody.innerHTML = `<span style="color:#DB162f;">
        There are no rejected case notes during the past ${daysBack} days.
        </span>
        `
            return
        }

        const tableOptions = {
            plain: true,
            columnHeadings: ["Consumer", "Serv Date", "Code", "Start", "End", "Update"],
            tableId: "rejectedWidgetTable"
        };
        const rejectedTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = rejectedTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Consumer
        headers[1].setAttribute('data-type', 'date'); // Serv Date
        headers[2].setAttribute('data-type', 'string'); // Code
        headers[3].setAttribute('data-type', 'date'); // Start
        headers[4].setAttribute('data-type', 'date'); // End
        headers[5].setAttribute('data-type', 'date'); // Update  

        widgetBody.innerHTML = "";
        widgetBody.appendChild(rejectedTable);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(rejectedTable);

        const tableData = rejectedNotes.map(consumer => {
            const name = `${consumer.lastName}, ${consumer.firstName}`;
            // const dateString = consumer.lastNoteDate.split(" ")[0] === "" ? "00/00/0000" : consumer.lastNoteDate.split(" ")[0];

            const caseNoteId = consumer.caseNoteId;
            const serviceDate = consumer.serviceDate.split(" ")[0];
            const serviceCode = `${consumer.serviceCode}`;
            const tmpstartTime = consumer.startTime.split(":");
            const startTime = tmpstartTime.slice(0, -1).join(":");
            const frmtStartTime = UTIL.convertFromMilitary(startTime);
            const tmpendTime = consumer.endTime.split(":");
            const endTime = tmpendTime.slice(0, -1).join(":");
            const frmtEndTime = UTIL.convertFromMilitary(endTime);

            const updateDate = consumer.lastUpdate.split(" ")[0];

            return {
                values: [name, serviceDate, serviceCode, frmtStartTime, frmtEndTime, updateDate],
                id: consumer.caseNoteId,
                onClick: () => {
                    DOM.clearActionCenter();
                    caseNotesAjax.getCaseNoteEdit(caseNoteId, function (results) {
                        setActiveModuleAttribute('casenotes')
                        note.init('review', results, groups);
                    });
                }
            };
        });
        table.populate(rejectedTable, tableData);

        //  window.setTimeout(newNote.checkMicError, 3000);
    }

    // function getCaseNote(caseNoteId) {
    //   var test = caseNotesAjax.getCaseNoteEdit(caseNoteId, function(results) {
    //       note.init('review', results, groups);
    //     });
    //     rowPopup(test);
    // }

    // function rowPopup(test) {
    //   const popup = POPUP.build({
    //     header: nameStr,
    //     id: "caseNotePopup"
    //   });
    //   popup.appendChild(test)

    //   POPUP.show(popup);
    // }

    // function getDaysBackDate(daysBack) {
    //   const daysBackDate = new Date();
    //   daysBackDate.setDate(daysBackDate.getDate() - daysBack);
    //   return daysBackDate;
    // }

    function setDefaultIfConfigNull() {
        widgetSettings.widgetConfig = {
            daysBack: 60
        }
        widgetSettingsAjax.setWidgetSettingConfig(3, JSON.stringify(widgetSettings.widgetConfig), widgetSettings.showHide)
    }

    function cleanSettings() {
        daysBack = widgetSettings.widgetConfig.daysBack;

    }

    function init() {
        widgetSettings = dashboard.getWidgetSettings('3')
        if (widgetSettings.widgetConfig === null) setDefaultIfConfigNull()
        cleanSettings();
        // daysBackDate = getDaysBackDate(daysBack);
        getRejectedData(populateRejectedWidget);

    }

    return {
        init
    };
})();
