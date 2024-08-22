var CN_ProductivityWidget = (function() {
    let cnProductivityChart
    let groupNotes = {}
    let timeObj = {}
    let widgetSettings
    let daysBackWidgetSetting

    function getDates() {
        let dateArr = []

    for (let i = 0; i <= (daysBackWidgetSetting - 1); i++ ) {
            const date = new Date()
            date.setDate(date.getDate() - i);
            dateArr.push(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`)
        }
        return dateArr
    }

    function addChartData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }

    async function getData() {
        daysBackWidgetSetting = widgetSettings.widgetConfig.daysBack
        const response = (await CN_ProductivityWidgetAjax.getCaseNoteProductivity(daysBackWidgetSetting)).getDashboardCaseNoteProductivityResult;
        preBuildDataObj()
        response.forEach(note => {
            const serviceDate = note.Service_Date.split(" ")[0]
            const originalEnteredDate = note.Original_Update.split(" ")[0]
            if (note.Case_Note_Group_ID !== "") {
                groupNotes[note.Case_Note_Group_ID] = note
                return;
            }
            // If the service date is outside of days back, but entered date is note, and it has doc time, 
            // ONLY calculate doc time.
            if (!timeObj[serviceDate] && timeObj[originalEnteredDate]) {
                calculateDocTime(note, originalEnteredDate)
                return
            }
            timeObj[serviceDate].noteTime += parseInt(note.diffMinutes);
            if (note.Travel_Time !== "") {
                timeObj[serviceDate].travelTime += parseInt(note.Travel_Time);
            }
            // NOTE: Doc Time calculation goes towards Original Update date, NOT service date
            if (note.Total_Doc_Time !== "" && timeObj[originalEnteredDate]) {
                calculateDocTime(note, originalEnteredDate)
            }
        })
    if(Object.keys(groupNotes).length > 0) {
            Object.keys(groupNotes).forEach(noteID => {
                const serviceDate = groupNotes[noteID].Service_Date.split(" ")[0]
                const originalEnteredDate = groupNotes[noteID].Original_Update.split(" ")[0]
                // If the service date is outside of days back, but entered date is note, and it has doc time, 
                // ONLY calculate doc time.
                if ((!timeObj[serviceDate] && timeObj[originalEnteredDate]) && groupNotes[noteID].Total_Doc_Time !== "") {
                    timeObj[originalEnteredDate].docTime += Math.round(Math.floor(groupNotes[noteID].Total_Doc_Time/30) / 2)
                    return
                }
                timeObj[serviceDate].noteTime += parseInt(groupNotes[noteID].diffMinutes);
                if (groupNotes[noteID].Travel_Time !== "") {
                    timeObj[serviceDate].travelTime += parseInt(groupNotes[noteID].Travel_Time);
                }
                // NOTE: Doc Time calculation goes towards Original Update date, NOT service date
                if (groupNotes[noteID].Total_Doc_Time !== "" && timeObj[originalEnteredDate]) {
                    timeObj[originalEnteredDate].docTime += Math.round(Math.floor(groupNotes[noteID].Total_Doc_Time/30) / 2)
                }
            })
        }
        initChart()
    }
    /** 
     * Calculates Documentation time for time table
     * @param {object} caseNoteData - Note data from getCaseNoteProductivity AJAX call
     * @param {string} orgDate - date ISO format of the original entered date of the case note
     */
    function calculateDocTime(caseNoteData, orgDate) {
        if (caseNoteData.Total_Doc_Time === "") return
            timeObj[orgDate].docTime += Math.round(Math.floor(caseNoteData.Total_Doc_Time/30) / 2)
    }

    function preBuildDataObj() {
        let dateArr = getDates();
        dateArr.forEach(date => {
            timeObj[date] = {noteTime: 0, travelTime: 0, docTime: 0}
        })
    }

    function calculateBackgroundColor(productivityPercentage) {
        const productivityThreshold = widgetSettings.widgetConfig.productivityThreshold
        let colors
        //first element of color array is Note Time, second is travel, third is doc
        if (productivityPercentage < productivityThreshold) {
            //Red Bars
            colors = [
                "rgba(219, 22, 47, .8)",
                "rgba(219, 22, 47, .5)",
                "rgba(219, 22, 47, .2)",
            ]
        } else {
            //Green Bars
            colors = [
                "rgba(129, 185, 65, .8)",
                "rgba(129, 185, 65, .5)",
                "rgba(129, 185, 65, .2)",
            ]
        }
        return colors
    }

    function reconfigureDataForChart(workHoursPerDay = 7) {
        const minForProductivity = 60 * widgetSettings.widgetConfig.workHoursPerDay;
        let noteTimeDataset = {label: 'Note Time (%)', data:[], backgroundColor: [], order: 0}
        let travelTimeDataset = {label: 'Travel Time (%)', data:[], backgroundColor: [], order: 1}
        let docTimeDataset = {label: 'Documentation Time (%)', data:[], backgroundColor: [], order: 2}
        Object.keys(timeObj).forEach(date => {
            let totalTime = timeObj[date].noteTime + timeObj[date].travelTime + timeObj[date].docTime
            let productivityPercentage = Math.round((totalTime/minForProductivity) * 100)
            let colorArr = calculateBackgroundColor(productivityPercentage);
            noteTimeDataset.backgroundColor.push(colorArr[0])
            travelTimeDataset.backgroundColor.push(colorArr[1])
            docTimeDataset.backgroundColor.push(colorArr[2])
            noteTimeDataset.data.push(Math.round((timeObj[date].noteTime/minForProductivity) * 100))
            travelTimeDataset.data.push(Math.round((timeObj[date].travelTime/minForProductivity) * 100))
            docTimeDataset.data.push(Math.round((timeObj[date].docTime/minForProductivity) * 100))
        })
        return [noteTimeDataset, travelTimeDataset, docTimeDataset]
    }


    function initChart() {
        // this code for height setting of widget 
        var height = 225; 
        if (daysBackWidgetSetting > 14 && daysBackWidgetSetting < 29)
            height = 450;
        if (daysBackWidgetSetting > 29 && daysBackWidgetSetting < 43)
            height = 750;
        if (daysBackWidgetSetting > 43)
            height = 1000; 
   
        const widgetBody = document.getElementById('cn_productivity');
        const canvas = document.createElement('canvas');
        canvas.width = 290;
        canvas.height = height;  


        widgetBody.appendChild(canvas)

        const options = {
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked:true,
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        stepSixe: 10,
                        precision: 10,
                        callback: function (value) {
                            return value + '%';
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage'
                    }
                }]
            },
            legend: {
                display: false,
            }
        }

        cnProductivityChart = new Chart(canvas, {
            type: 'horizontalBar',
            data: {
                labels: getDates(),
                datasets: reconfigureDataForChart()
            },
            options: options,
        })
    }

    function setDefaultIfConfigNull() {
        widgetSettings.widgetConfig = {
            productivityThreshold: 60,
            daysBack: 60,
            workHoursPerDay: 7
        }
        widgetSettingsAjax.setWidgetSettingConfig(1, JSON.stringify(widgetSettings.widgetConfig), widgetSettings.showHide)
    }
    function init() {
        widgetSettings = dashboard.getWidgetSettings('1')
        if (widgetSettings.widgetConfig === null) setDefaultIfConfigNull()
        getData()
    }

    return {
        init
    };
})();
