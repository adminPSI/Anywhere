// Widget id = 20
const rosterToDoListWidget = (function () {
    // Data
    let rosterWorkflows, widgetSettings;
    let widget, widgetBody, planTasks;
    let filterPopup;
    let consumers = [],
        tasks = [];
    let filter = {
        dueDateRange: 'today',
        dueDateFrom: UTIL.getTodaysDate(),
        dueDateTo: UTIL.getTodaysDate(),
        consumer: 'all',
        task: 'all',
    };

    async function init() {
        widget = document.getElementById('rosterToDoList');
        widgetBody = widget.querySelector('.widget__body');
        planTasks = widget.querySelector('#roster-workflow-tasks');
        widgetSettings = dashboard.getWidgetSettings('20');
        if (widgetSettings.widgetConfig === null) setDefaultIfConfigNull();

        // append filter button
        dashboard.appendFilterButton('rosterToDoList', 'rosterToDoFilterBtn');

        var filterDateRangeDefaultValue = await widgetSettingsAjax.getWidgetFilter('rosterToDoList', 'dueDate');
        filter.dueDateRange = filterDateRangeDefaultValue.getWidgetFilterResult;
        var filterDateFromDefaultValue = await widgetSettingsAjax.getWidgetFilter('rosterToDoList', 'dueDateFrom');
        filter.dueDateFrom = filterDateFromDefaultValue.getWidgetFilterResult;
        var filterDateToDefaultValue = await widgetSettingsAjax.getWidgetFilter('rosterToDoList', 'dueDateTo');
        filter.dueDateTo = filterDateToDefaultValue.getWidgetFilterResult;
        var filterConsumerDefaultValue = await widgetSettingsAjax.getWidgetFilter('rosterToDoList', 'consumer');
        filter.consumer = filterConsumerDefaultValue.getWidgetFilterResult;
        var filterTaskDefaultValue = await widgetSettingsAjax.getWidgetFilter('rosterToDoList', 'task');
        filter.task = filterTaskDefaultValue.getWidgetFilterResult;

        if (!filter.consumer) filter.consumer = 'all';
        if (!filter.task) filter.task = 'all';
        if (!filter.dueDateRange) filter.dueDateRange = 'today';
        if (!filter.dueDateFrom) filter.dueDateFrom = UTIL.getTodaysDate();
        if (!filter.dueDateTo) filter.dueDateTo = UTIL.getTodaysDate();

        let data = await getData();
        rosterWorkflows = data;

        consumers = Object.values(
            rosterWorkflows.reduce(
                (
                    acc,
                    { consumerId, consumerLastName, consumerFirstName, consumerMiddleName, ...wf },
                ) => {
                    if (!acc[consumerId]) {
                        acc[consumerId] = {
                            consumerId,
                            consumerFullName: `${consumerLastName}, ${consumerFirstName} ${consumerMiddleName}`,
                        };
                    }

                    return acc;
                },
                {},
            ),
        );

        consumers.sort((a, b) => {
            const textA = a.consumerFullName.toUpperCase();
            const textB = b.consumerFullName.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        tasks = [...new Set(rosterWorkflows.map(c => c.workflowStepDescription))];

        if (filter.dueDateRange == '') filter.dueDateRange = widgetSettings.widgetConfig.dueDate
        setFilterDueDates(filter.dueDateRange);
        applyFilter(filter);
        buildFilterPopup();
    }

    function setFilterDueDates(dateRangeText) {
        let today = UTIL.getTodaysDate(true);
        let dueDates = {};
        switch (dateRangeText.toUpperCase()) {
            case 'TODAY':
                dueDates = {
                    from: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                    to: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                };
                break;
            case 'NEXT 7 DAYS':
                dueDates = {
                    from: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                    to: moment(dates.addDays(today, 7), 'YYYY-MM-DD').format('YYYY-MM-DD'),
                };
                break;
            case 'NEXT 30 DAYS':
                dueDates = {
                    from: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                    to: moment(dates.addDays(today, 30), 'YYYY-MM-DD').format('YYYY-MM-DD'),
                };
                break;
            case 'PRIOR 7 DAYS':
                dueDates = {
                    from: moment(dates.addDays(today, -7), 'YYYY-MM-DD').format('YYYY-MM-DD'),
                    to: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                };
                break;
            case 'PRIOR 30 DAYS':
                dueDates = {
                    from: moment(dates.addDays(today, -30), 'YYYY-MM-DD').format('YYYY-MM-DD'),
                    to: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                };
                break;
            default:
                dueDates = {
                    from: filter.dueDateFrom,
                    to: filter.dueDateTo,
                };
                break;
        }
        filter = {
            dueDateRange: dateRangeText.toLowerCase(),
            dueDateFrom: dueDates.from,
            dueDateTo: dueDates.to,
            consumer: filter.consumer,
            task: filter.task,
        };
    }

    function setDefaultIfConfigNull() {
        widgetSettings.widgetConfig = {
            dueDate: filter.dueDateRange,
        };
        widgetSettingsAjax.setWidgetSettingConfig(
            20,
            JSON.stringify(widgetSettings.widgetConfig),
            widgetSettings.showHide,
        );
    }

    function populatePlanWorkflowWidget(data) {
        if (!widget) return;
        planTasks.innerHTML = '';
        if (data.length === 0) {
            planTasks.innerHTML = `<span style="color:#DB162f;">No tasks are currently due</span>`;
        } else {
            buildHtmlFromData(planTasks, data);
        }
    }

    function buildFilterPopup() {
        let widgetFilter = widget.querySelector('.widget__filters');
        if (widgetFilter) return;
        filterPopup = dashboard.buildFilterPopup();
        const showCustomDates = show => {
            if (show) {
                fromDateInput.classList.remove('hidden');
                toDateInput.classList.remove('hidden');
            } else {
                if (fromDateInput.classList.contains('hidden')) return; // don't add it again
                fromDateInput.classList.add('hidden');
                toDateInput.classList.add('hidden');
            }
        };

        let dueDateDropDownValue = filter.dueDateRange;
        let fromDateInputValue = filter.dueDateFrom;
        let toDateInputValue = filter.dueDateTo;
        let consumersDropDownValue = filter.consumer;
        let tasksDropDownValue = filter.task;

        let dueDateDropDown = dropdown.build({
            id: 'planToDoWidgetDueDates',
            label: 'Due Date Range',
            type: 'date',
            style: 'secondary',
        });

        let fromDateInput = input.build({
            id: 'planToDoWidgetFromDate',
            label: 'From',
            type: 'date',
            style: 'secondary',
            value: fromDateInputValue,
        });

        let toDateInput = input.build({
            id: 'planToDoWidgetToDate',
            label: 'To',
            type: 'date',
            style: 'secondary',
            value: toDateInputValue,
        });

        let consumersDropdown = dropdown.build({
            dropdownId: 'planToDoWidgetConsumers',
            label: 'Consumer',
            style: 'secondary',
            readonly: false,
        });

        let tasksDropdown = dropdown.build({
            dropdownId: 'planToDoWidgetTasks',
            label: 'Task',
            style: 'secondary',
            readonly: false,
        });

        let applyFiltersBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
        });

        let cancelFilterBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        let btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(applyFiltersBtn);
        btnWrap.appendChild(cancelFilterBtn);

        filterPopup.appendChild(dueDateDropDown);
        filterPopup.appendChild(fromDateInput);
        filterPopup.appendChild(toDateInput);
        filterPopup.appendChild(consumersDropdown);
        filterPopup.appendChild(tasksDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);

        const dueDateRangeDropDownData = [
            {
                id: 1,
                value: 'custom',
                text: 'Custom',
            },
            {
                id: 2,
                value: 'today',
                text: 'Today',
            },
            {
                id: 3,
                value: 'next 7 days',
                text: 'Next 7 Days',
            },
            {
                id: 4,
                value: 'next 30 days',
                text: 'Next 30 Days',
            },
            {
                id: 5,
                value: 'prior 7 days',
                text: 'Prior 7 Days',
            },
            {
                id: 6,
                value: 'prior 30 days',
                text: 'Prior 30 Days',
            },
        ];
        dropdown.populate(dueDateDropDown, dueDateRangeDropDownData, dueDateDropDownValue);
        showCustomDates(dueDateDropDownValue.toUpperCase() === 'CUSTOM');

        const consumerDropdownData = consumers.map(c => {
            return {
                id: c.consumerId,
                value: c.consumerId,
                text: c.consumerFullName,
            };
        });
        consumerDropdownData.unshift({ id: 0, value: 'all', text: 'ALL' }); //ADD ALL value
        dropdown.populate(consumersDropdown, consumerDropdownData, consumersDropDownValue);

        const taskDropdownData = tasks.map((t, i) => {
            return {
                id: i,
                value: t,
                text: t,
            };
        });
        taskDropdownData.sort((a, b) =>
            a.value.toUpperCase() < b.value.toUpperCase() ? -1 : 1,
        );
        taskDropdownData.unshift({ id: 0, value: 'all', text: 'ALL' }); //ADD ALL value
        dropdown.populate(tasksDropdown, taskDropdownData, tasksDropDownValue);

        // event listeners
        dueDateDropDown.addEventListener('change', e => {
            dueDateDropDownValue = e.target.value;
            showCustomDates(dueDateDropDownValue.toUpperCase() === 'CUSTOM');
            setFilterDueDates(dueDateDropDownValue.toUpperCase());
            fromDateInputValue = filter.dueDateFrom;
            toDateInputValue = filter.dueDateTo;
        });

        fromDateInput.addEventListener('change', e => {
            fromDateInputValue = e.target.value;
        });

        toDateInput.addEventListener('change', e => {
            toDateInputValue = e.target.value;
        });

        consumersDropdown.addEventListener('change', e => {
            consumersDropDownValue = e.target.value;
        });

        tasksDropdown.addEventListener('change', e => {
            tasksDropDownValue = e.target.value;
        });

        applyFiltersBtn.addEventListener('click', e => {
            filter = {
                dueDateRange: dueDateDropDownValue,
                dueDateFrom: fromDateInputValue,
                dueDateTo: toDateInputValue,
                consumer: consumersDropDownValue,
                task: tasksDropDownValue,
            };
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
            applyFilter(filter);

            widgetSettingsAjax.setWidgetFilter('rosterToDoList', 'dueDate', filter.dueDateRange)
            widgetSettingsAjax.setWidgetFilter('rosterToDoList', 'dueDateFrom', filter.dueDateFrom)
            widgetSettingsAjax.setWidgetFilter('rosterToDoList', 'dueDateTo', filter.dueDateTo)
            widgetSettingsAjax.setWidgetFilter('rosterToDoList', 'consumer', filter.consumer)
            widgetSettingsAjax.setWidgetFilter('rosterToDoList', 'task', filter.task)
        });

        cancelFilterBtn.addEventListener('click', e => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
        });
    }

    const applyFilter = filter => {
        let fromDate = Date.parse(filter.dueDateFrom);
        let toDate = Date.parse(filter.dueDateTo);
        let filteredData = rosterWorkflows.filter(p => {
            let dueDate = Date.parse(p.workflowStepDueDate);
            return dueDate >= fromDate && dueDate <= toDate; // filter by dates
        });
        filteredData =
            filter.consumer.toUpperCase() === 'ALL'
                ? filteredData
                : filteredData.filter(d => {
                    return d.consumerId === filter.consumer; // filter by consumer
                });
        filteredData =
            filter.task.toUpperCase() === 'ALL'
                ? filteredData
                : filteredData.filter(d => {
                    return d.workflowStepDescription === filter.task; // filter by task
                });
        populatePlanWorkflowWidget(filteredData);
        displayFilteredBy();
    };

    function buildHtmlFromData(parent, data) {
        const buildPlanWorkflowHTML = (parent, plans) => {
            const buildWorkflowStepHTML = (consumer, workflowName, step, dueDate) => {
                let stepHTML = document.createElement('div');

                stepHTML.setAttribute(
                    'style',
                    'display: flex; flex-wrap: nowrap; padding-bottom: 5px; cursor: pointer',
                );

                stepHTML.innerHTML = `
					<div style="display: flex; padding-left: 10px; ">- ${step}</div>
					<div style="display: flex; margin-left: auto; text-align: right; padding-left: 10px">${dueDate ? dueDate.split(' ')[0] : ''
                    }</div>
				`;
                stepHTML.addEventListener('click', e => {
                    //plan.dashHandler(consumer, workflowName, stepId);
                });
                return stepHTML;
            };

            if (plans.length > 0) {
                let planTypeContainerHtml = document.createElement('div');
                planTypeContainerHtml.setAttribute('style', 'display: flex; flex-wrap: nowrap;');

                let planTypeHtml = document.createElement('div');
                planTypeHtml.setAttribute('style', 'display: flex; font-weight: 500;');
                planTypeHtml.innerHTML = `
					${plans[0].workflowName}  
				`;

                let dueDateLabelHtml = document.createElement('div');
                dueDateLabelHtml.setAttribute(
                    'style',
                    'display: flex; margin-left: auto; text-align: right; font-weight: 500;',
                );
                dueDateLabelHtml.innerHTML = 'Due Date';

                planTypeContainerHtml.appendChild(planTypeHtml);
                planTypeContainerHtml.appendChild(dueDateLabelHtml);
                parent.appendChild(planTypeContainerHtml);

                for (record in plans) {
                    let {
                        consumerId,
                        consumerFirstName,
                        consumerLastName,
                        consumerMiddleName,
                        responsiblePartyId,
                        workflowStepId,
                        workflowStepDescription,
                        workflowStepDueDate,
                        workflowName,
                        ...rest
                    } = plans[record];
                    let consumerPlanInfo = document.createElement('div');
                    consumerPlanInfo.setAttribute(
                        'style',
                        'font-weight: bold; padding-bottom: 5px;',
                    );
                    consumerPlanInfo.innerHTML = `${consumerLastName}, ${consumerFirstName} ${consumerMiddleName}`;
                    parent.appendChild(consumerPlanInfo);
                    parent.appendChild(
                        buildWorkflowStepHTML(
                            {
                                consumer: {
                                    consumerId,
                                    consumerFirstName,
                                    consumerLastName,
                                    consumerMiddleName,
                                },
                            },
                            workflowName,
                            workflowStepDescription,
                            workflowStepDueDate,
                        ),
                    );
                }
                return parent;
            }
        };
        if (data.length > 0) buildPlanWorkflowHTML(parent, data);
        return parent;
    }

    function displayFilteredBy() {
        let filteredBy = widget.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
            widgetBody.insertBefore(filteredBy, planTasks);
        }

        const dueDateRange = filter.dueDateRange.toUpperCase();
        const dueDateFrom = moment(filter.dueDateFrom, 'YYYY-MM-DD').format('M/D/YYYY');
        const dueDateTo = moment(filter.dueDateTo, 'YYYY-MM-DD').format('M/D/YYYY');
        const filterConsumerBy = filter.consumer.toUpperCase();
        const task = filter.task.toUpperCase();

        const getFilteredConsumer = () => {
            return consumers.find(c => {
                return c.consumerId === filter.consumer;
            });
        };
 
        // console.log(consumers, " consumer: ", filter.consumer);
        filteredBy.innerHTML = `<div class="filteredByData">
		  <p><span>Due Date:</span> ${dueDateRange === 'CUSTOM' ? `${dueDateFrom} - ${dueDateTo}` : dueDateRange
            }</p>
		  <p><span>Consumer:</span> ${filterConsumerBy === 'ALL' ? 'ALL' : getFilteredConsumer().consumerFullName
            }</p>
		  <p><span>Task:</span> ${task}</p>
		</div>`;
    }

    async function getData() {
        try {
            let {
                getRosterToDoListWidgetDataResult: result,
            } = await rosterToDoListWidgetAjax.getRosterToDoListWidgetData($.session.PeopleId);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        init,
    };
})();
