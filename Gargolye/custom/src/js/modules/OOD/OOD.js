const OOD = (() => {
    //Inputs
    let serviceDateInput;
    let serviceDate;
    const CLEAREDSERVICEDATE = '1970-01-01';

    let editEmployersBtn;
    let createFormsBtn;
    let updateEmploymentGoalBtn;
    let employmentGoalText;
    let filterRow;
    let newEntryBtn;
    let newSummaryBtn;
    let OODEntriesTable;
    let OODConsumerBtns;
    let consumerRow;
    let consumerElement;
    let filterPopup;
    let createfilterPopup;

    // New Roster
    //let initRosterSelection;
    var enabledConsumers;
    var selectedConsumers;
    let selectedConsumerPeopleId;

    //filter
    let serviceDateStartInput;
    let serviceDateEndInput;
    let createServiceDateStartInput;
    let createServiceDateEndInput;
    
    let employeeDropdown;
    let servicesDropdown;
    let referenceNumbersDropdown;
    let createreferenceNumbersDropdown;
    let filterValues;
    let createFilterValues;
    let thisStartDate;
    let thisEndDate;

    let btnWrap;
    let serviceDateStartBtnWrap;
    let serviceDateEndBtnWrap;
    let employeeBtnWrap;
    let serviceBtnWrap;
    let referenceNumberBtnWrap;

    //service filter options
    const OODENTRIESFILTER = 'OODEntriesFilter';
    const FORM4MONTHLYSUMMARYSERVICES = 'Form4MonthlySummary';

    let consumerServicesDropdown;
    let consumerServicesDoneBtn;
    let selectConsumerServicePopup;
    let selectedConsumerServiceId;
    let selectedConsumerReferenceNumber;
    let selectedConsumerServiceType;
    let selectedConsumerFormNumber;
    let selectedConsumerServiceName;
    let summaryServicesDropdown;
    let summaryServicesDoneBtn;
    let selectSummaryServicePopup;

    let selectedConsumerIds;
    //let consumerServices;

    let employmentGoalTextarea;

    // get the Consumers selected from the Roster
    async function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
                await loadOODLanding();
                DOM.toggleNavLayout();
                //		roster2.clearActiveConsumers();
                break;
            }
            case 'miniRosterCancel': {
                DOM.toggleNavLayout();
                loadApp('home');
                break;
            }
        }
    }

    // Build OOD Module Landing Page
    async function loadOODLanding() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit();

        landingPage = document.createElement('div');
        selectedConsumers.forEach(consumer => {
            const consumerCard = buildConsumerCard(consumer);
            landingPage.appendChild(consumerCard);
        });

        filterRow = document.createElement('div');
        filterRow.classList.add('filterElement');

        const filteredBy = buildFilteredBy();

        // editEmployersBtn = buildEditEmployersBtn();

        filterRow.appendChild(filteredBy);
        // filterRow.appendChild(editEmployersBtn);

        
        await planAjax.getConsumerPeopleId(selectedConsumers[0].id, function (results) {
            selectedConsumerPeopleId = results[0].id;
            
        });

        const { getEmploymentGoalResult: EmploymentGoal } = await OODAjax.getEmploymentGoal(
            selectedConsumerPeopleId,
        );

        let employmentGoalDIV = document.createElement('div');

        
        let employmentGoalMessage = document.createElement('p');
        employmentGoalMessage.innerHTML =
            `<b>Employment Goal:</b> ${EmploymentGoal}`;

            updateEmploymentGoalBtn = buildUpdateEmploymentGoalsBtn();
            updateEmploymentGoalBtn.setAttribute('max-width', '100px: !importatnt;');
         

            employmentGoalDIV.classList.add("EmployeeGoal");
            employmentGoalDIV.appendChild(employmentGoalMessage) 
            employmentGoalDIV.appendChild(updateEmploymentGoalBtn)  

           // employmentGoalDIV.appendChild(employmentGoalMessage);
           // employmentGoalDIV.appendChild(updateEmploymentGoalBtn);

        landingPage.appendChild(filterRow);
        landingPage.appendChild(employmentGoalDIV);
        OODEntriesTable = await buildOODEntriesTable(filterValues);
        landingPage.appendChild(OODEntriesTable);

        DOM.ACTIONCENTER.appendChild(landingPage);
    }

    // build the listing of OOD Entries (based off of filter settings)
    async function buildOODEntriesTable(filterValues) {
        const tableOptions = {
            plain: false,
            tableId: 'OODEntriesTable',
            columnHeadings: [
                'Service Date',
                'Consumer',
                'Service',
                'Reference No',
                'User Updated',
                'Employer',
            ],
            endIcon: false,
        };

        // FAKE DATA : build table data -- see forms.js line 93
        //const tableData = [{ values : ['11/09/2021', 'Aaron, Aaron', 'LPA'], onClick : () => {OODForm4MonthlyPlacement.init(currentConsumer)}, attributes : [{ key: 'consumerId', value: '10000030' }, { key: 'contactsId', value: '686614946775283' } ]},
        //					{ values : ['11/11/2021', 'Abrams, Jackie', 'IPA'], onClick : () => {OODForm4MonthlyPlacement.init(currentConsumer)}, attributes : [{ key: 'consumerId', value: '10000241' }, { key: 'reviewId', value: '686614946775290' } ]} ];

        selectedConsumerIds = selectedConsumers.map(function (x) {
            return x.id;
        });
        //TODO JOE: FORM 8 -- Need to include in OODEntries serviceType: T1 and T2 -- Need to UpdateSP _OODEntries with EM_Service_Names.Template_Num
        const { getOODEntriesResult: OODEntries } = await OODAjax.getOODEntriesAsync(
            selectedConsumerIds.join(', '),
            filterValues.serviceDateStart,
            filterValues.serviceDateEnd,
            filterValues.userId,
            filterValues.serviceId,
            filterValues.referenceNumber, //reference number
        );

        // format the Completion Dates
        OODEntries.forEach(function (entry) {
            let newDate = new Date(entry.serviceDate);
            let theMonth = newDate.getMonth() + 1;
            let formatServiceDate =
                UTIL.leadingZero(theMonth) +
                '/' +
                UTIL.leadingZero(newDate.getDate()) +
                '/' +
                newDate.getFullYear();
            entry.serviceDate = formatServiceDate;
        });

        let tableData = OODEntries.map(entry => ({
            values: [
                entry.serviceDate,
                entry.consumerName,
                entry.serviceCode,
                entry.referenceNumber,
                entry.userUpdated,
                entry.employerName,
            ],
            //TODO JOE: add key: ServiceType value: entry.serviceType (T1 and T2)
            attributes: [
                {
                    key: 'OODReportType',
                    value: entry.employerName == 'Monthly Review' ? 'monthlySummary' : 'newEntry',
                },
                { key: 'consumerId', value: entry.consumerId },
                { key: 'Id', value: entry.ID },
                { key: 'userId', value: entry.userUpdated },
                { key: 'formNumber', value: Math.round(entry.formNumber) },
            ],
            onClick: e => {
                var rowConsumer = selectedConsumers.filter(function (x) {
                    return x.id == entry.consumerId;
                });
                //TODO JOE: add to the if clause below (Form4) and add two more ifs to cover the Form 8 ---
                //TODO JOE:   if (rowConsumer[0] && e.target.attributes.OODReportType.value === 'newEntry' && e.target.attributes.serviceType.value === 'T1')
                // TODO JOE: Will also need two new SP to get the Form 8 data
                if (
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'newEntry' &&
                    e.target.attributes.formNumber.value === '4'
                ) {
                    OODAjax.getForm4MonthlyPlacementEditData(
                        e.target.attributes.Id.value,
                        function (results) {
                            OODForm4MonthlyPlacement.init(
                                results,
                                rowConsumer[0],
                                undefined,
                                undefined,
                                e.target.attributes.userId.value,
                                undefined,
                            );
                        },
                    );
                }
                if (
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'monthlySummary' &&
                    e.target.attributes.formNumber.value === '4'
                ) {
                    OODAjax.getForm4MonthlySummary(e.target.attributes.Id.value, function (results) {
                        OODForm4MonthlySummary.init(
                            results,
                            rowConsumer[0],
                            undefined,
                            e.target.attributes.userId.value,
                        );
                    });
                }

                if (   //NEED NEW AJAX TO GET Form 6 
                rowConsumer[0] &&
                e.target.attributes.OODReportType.value === 'newEntry' &&
                e.target.attributes.formNumber.value === '6'
            ) {
                OODAjax.getForm6Tier1andJDPLan(
                    e.target.attributes.Id.value,
                    function (results) {
                        Tier1andJDPlanForm.init(
                            results,
                            rowConsumer[0],
                            undefined,
                            results[0].serviceName,
                            undefined,
                            e.target.attributes.userId.value,
                            undefined,
                        );
                    },
                );
            }
                if (
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'newEntry' &&
                    e.target.attributes.formNumber.value === '8'
                ) {
                    OODAjax.getForm8CommunityBasedAssessment(
                        e.target.attributes.Id.value,
                        function (results) {
                            communityBasedAssessmentForm.init(
                                results,
                                rowConsumer[0],
                                undefined,
                                results[0].serviceName,
                                undefined,
                                e.target.attributes.userId.value,
                                undefined,
                            );
                        },
                    );
                }
                if (
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'monthlySummary' &&
                    e.target.attributes.formNumber.value === '8'
                ) {
                    OODAjax.getForm8MonthlySummary(e.target.attributes.Id.value, function (results) {
                        communityBasedAssessmentSummaryForm.init(
                            results,
                            rowConsumer[0],
                            undefined,
                            e.target.attributes.userId.value,
                        );
                    });
                }
                
                if (
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'newEntry' &&
                    e.target.attributes.formNumber.value === '10'
                ) {
                    OODAjax.getForm10TransportationData(
                        e.target.attributes.Id.value,
                        function (results) {
                            OODFormTransportation.init(
                                results,
                                rowConsumer[0],
                                undefined,
                                undefined,
                                e.target.attributes.userId.value,
                                undefined,
                            );
                        },
                    );
                }

                if (   //NEED NEW AJAX TO GET Form 16 
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'newEntry' &&
                    e.target.attributes.formNumber.value === '16'
                ) {
                    OODAjax.getForm16SummerYouthWorkExperience(
                        e.target.attributes.Id.value,
                        function (results) {
                            summerYouthWorkExperienceForm.init(
                                results,
                                rowConsumer[0],
                                undefined,
                                results[0].serviceName,
                                undefined,
                                e.target.attributes.userId.value,
                                undefined,
                            );
                        },
                    );
                }
                if (    //NEED NEW AJAX TO GET Form 16
                    rowConsumer[0] &&
                    e.target.attributes.OODReportType.value === 'monthlySummary' &&
                    e.target.attributes.formNumber.value === '16'
                ) {
                    OODAjax.getForm16MonthlySummary(e.target.attributes.Id.value, function (results) {
                        summerYouthWorkExperienceSummaryForm.init(
                            results,
                            rowConsumer[0],
                            undefined,
                            e.target.attributes.userId.value,
                        );
                    });
                }
            },
        }));

        const oTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = oTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'date'); // Service date
        headers[1].setAttribute('data-type', 'string'); // Consumer
        headers[2].setAttribute('data-type', 'string'); // Service
        headers[3].setAttribute('data-type', 'number'); // Ref No 
        headers[4].setAttribute('data-type', 'string'); // User Updated 
        headers[5].setAttribute('data-type', 'string'); // Employer

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(oTable);

        table.populate(oTable, tableData);

        return oTable;
    }

    // build display of selected consumers with their associated "Entry" buttons
    function buildConsumerCard(consumer) {
        consumerElement = document.createElement('div');
        consumerRow = document.createElement('div');
        consumerRow.classList.add('consumerHeader');

        consumer.card.classList.remove('highlighted');

        const consumerCard = document.createElement('div');
        consumerCard.classList.add('OODConsumerCard');

        consumerCard.appendChild(consumer.card);

        consumerCard.addEventListener('click', event => {
            var consumerId = event.target.dataset.consumerId;
            selectedConsumerIds = selectedConsumerIds.filter(id => id !== consumerId);
            selectedConsumers = selectedConsumers.filter(function (x) {
                return x.id !== consumerId;
            });
            roster2.removeConsumerFromActiveConsumers(consumerId);
            var activeConsumers = roster2.getActiveConsumers();
            activeConsumers.length === 0 ? roster2.showMiniRoster() : loadOODLanding();
            // event.target.parentElement.parentElement.remove();
        });

        consumerRow.appendChild(consumerCard);

        OODConsumerBtns = buildButtonBar(consumer);

        consumerRow.appendChild(OODConsumerBtns);
        var LineBr = document.createElement('br');

        consumerElement.appendChild(consumerRow);
        // consumerElement.appendChild(LineBr);

        return consumerElement;
    }

    // build display of "Entry" Buttons -- "New Entry" and "New Monthly Summary"
    function buildButtonBar(consumer) {
        const buttonBar = document.createElement('div');
        buttonBar.classList.add('OODbuttonBar');

        const entryBtn = button.build({
            text: 'New Entry',
            style: 'secondary',
            type: 'contained',
            attributes: [
                { key: 'consumerId', value: consumer.id },
                { key: 'btnType', value: 'newEntry' },
            ],
            classNames: !$.session.OODInsert ? ['newEntryBtn', 'disabled'] : ['newEntryBtn'],
            callback: () =>
                buildEntryServicePopUp(
                    entryBtn.attributes.consumerid.value,
                    entryBtn.attributes.btnType.value,
                ),
        });
        const summaryBtn = button.build({
            text: 'New Monthly Summary',
            style: 'secondary',
            type: 'contained',
            attributes: [
                { key: 'consumerId', value: consumer.id },
                { key: 'btnType', value: 'monthlySummary' },
            ],
            classNames: !$.session.OODInsert
                ? ['newMonthlySummaryBtn', 'disabled']
                : ['newMonthlySummaryBtn'],
            callback: () =>
                buildSummaryServicePopUp(
                    summaryBtn.attributes.consumerid.value,
                    summaryBtn.attributes.btnType.value,
                ),
        });
        editEmployersBtn = buildEditEmployersBtn();
        createFormsBtn = buildCreateFormsBtn();
        buildNewFilterBtn();

        const oodBtnsWrap = document.createElement('div');
        oodBtnsWrap.classList.add('OODbuttonBar__btnWrap');
        oodBtnsWrap.appendChild(entryBtn);
        oodBtnsWrap.appendChild(summaryBtn);
        oodBtnsWrap.appendChild(editEmployersBtn);
        oodBtnsWrap.appendChild(createFormsBtn);

        buttonBar.appendChild(oodBtnsWrap);

        return buttonBar;
    }

    // build Services pop-up that displays when an "Entry" button is clicked
    async function buildEntryServicePopUp(consumerId, btnType) {
        serviceDate = UTIL.getTodaysDate();
        //	serviceDate = '2021-03-22';
        // TODO: the results of this AJAX call should be used in the call to function populateConsumerServiceCodeDropdown()
        const {
            //TODO JOE: Alter SP ANYW_OOD_getConsumerServiceCodes to include T1 (Form4) and T2 (Form8) services AND pass back T1 or T2 to include in the DDL items
            getConsumerServiceCodesResult: consumerServices,
        } = await OODAjax.getConsumerServiceCodesAsync(consumerId, serviceDate);

        if (consumerServices === undefined || consumerServices.length == 0) {
            buildNoServicesPopup(consumerId, btnType);
        } else {
            // services exist

            selectConsumerServicePopup = POPUP.build({
                header: 'Select a Service',
                hideX: true,
                id: 'selectServicePopup',
            });

            serviceDateInput = input.build({
                type: 'date',
                label: 'Service Date',
                style: 'secondary',
                value: UTIL.formatDateToIso(serviceDate.split(' ')[0]),
                attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
            });

            serviceDateInput.addEventListener('focusout', async event => {
                serviceDate = event.target.value;
                if (serviceDate === '') {
                    serviceDate = CLEAREDSERVICEDATE;
                    selectedConsumerServiceId = '';
                    // selectedConsumerServiceType = '';
                    selectedConsumerFormNumber = '';
                    selectedConsumerServiceName = '';
                    selectedConsumerReferenceNumber = '';
                    await populateConsumerServiceCodeDropdown(consumerId, serviceDate);
                } else {
                    const { getConsumerServiceCodesResult: consumerServices } =
                        await OODAjax.getConsumerServiceCodesAsync(consumerId, serviceDate);

                    if (consumerServices === undefined || consumerServices.length == 0) {
                        servicePopupCancelBtn(btnType);
                        buildNoServicesPopup(consumerId, btnType);
                    } else {
                        populateConsumerServiceCodeDropdown(consumerId, serviceDate);
                    }
                }

                serviceDateInputRequired();
                consumerServicesDropDownRequired();
            });

            // serviceDateInput.addEventListener('keydown', event => {
            // 	event.preventDefault();
            // 	event.stopPropagation();
            // });

            consumerServicesDropdown = dropdown.build({
                label: 'Services',
                dropdownId: 'consumerServicesDropdown',
            });

            consumerServicesDoneBtn = button.build({
                id: 'consumerServicesDoneBtn',
                text: 'done',
                type: 'contained',
                style: 'secondary',
                classNames: 'disabled',
                callback: () => servicePopupDoneBtn(consumerId, btnType),
            });
            this.doneButton = consumerServicesDoneBtn;

            let cancelBtn = button.build({
                id: 'consumerServicesCancelBtn',
                text: 'cancel',
                type: 'outlined',
                style: 'secondary',
                callback: () => servicePopupCancelBtn(btnType),
            });

            let btnWrap = document.createElement('div');
            var LineBr = document.createElement('br');
            btnWrap.classList.add('btnWrap');
            btnWrap.appendChild(consumerServicesDoneBtn);
            btnWrap.appendChild(cancelBtn);
            selectConsumerServicePopup.appendChild(LineBr);
            selectConsumerServicePopup.appendChild(serviceDateInput);
            selectConsumerServicePopup.appendChild(consumerServicesDropdown);
            selectConsumerServicePopup.appendChild(btnWrap);

            populateConsumerServiceCodeDropdown(consumerId, serviceDate);

            consumerServicesDropdown.addEventListener('change', event => {
                var selectedOption = event.target.options[event.target.selectedIndex];

                if (selectedOption.value == 'SELECT') {
                    selectedConsumerServiceId = '';
                    // selectedConsumerServiceType = '';
                    selectedConsumerFormNumber = '';
                    selectedConsumerServiceName = '';
                    selectedConsumerReferenceNumber = '';
                } else {
                    // TODO JOE: selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
                    selectedConsumerServiceId = selectedOption.value;
                    // selectedConsumerServiceType = selectedOption.id;
                    selectedConsumerFormNumber = selectedOption.id;
                    selectedConsumerServiceName = selectedOption.text;
                    selectedConsumerReferenceNumber = selectedOption.text.split('# ')[1];
                }

                serviceDateInputRequired();
                consumerServicesDropDownRequired();
            });

            serviceDateInputRequired();
            consumerServicesDropDownRequired();

            POPUP.show(selectConsumerServicePopup);

            function consumerServicesDropDownRequired() {
                if (!selectedConsumerServiceId || selectedConsumerServiceId === '') {
                    consumerServicesDropdown.classList.add('error');
                    consumerServicesDoneBtn.classList.add('disabled');
                } else {
                    consumerServicesDropdown.classList.remove('error');
                    consumerServicesDoneBtn.classList.remove('disabled');
                    serviceDateInputRequired();
                }
            }

            function serviceDateInputRequired() {
                var todayDate = new Date(UTIL.getTodaysDate().split('-').join('/'));
                var thisServiceDate = new Date(serviceDate.split('-').join('/'));
                if (
                    !serviceDate ||
                    serviceDate === CLEAREDSERVICEDATE ||
                    dates.isAfter(thisServiceDate, todayDate)
                ) {
                    serviceDateInput.classList.add('error');
                    consumerServicesDoneBtn.classList.add('disabled');
                } else {
                    serviceDateInput.classList.remove('error');
                    consumerServicesDoneBtn.classList.remove('disabled');
                }
            }
        }
    }

    function buildNoServicesPopup(consumerId, btnType) {
        // no services for Monthly Placemnet form (ie, after clicking a consumer  "Entry" btn)
        let noServicesPopup = POPUP.build({
            header: 'No Services found',
            hideX: true,
            id: 'noServicePopup',
        });

        let OKBtn = button.build({
            text: 'Ok',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(noServicesPopup);
                loadOODLanding();
                //buildEntryServicePopUp(consumerId, btnType)
            },
        });

        let btnWrap = document.createElement('div');
        let warningMessage = document.createElement('p');
        warningMessage.innerHTML =
            'There are no authorized services for the selected consumer. Please contact your Advisor OOD Administrator to enter an authorization or select a different consumer.';
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(OKBtn);
        //noServicesPopup.appendChild(consumerServicesDropdown);
        noServicesPopup.appendChild(warningMessage);
        noServicesPopup.appendChild(btnWrap);
        overlay.show();
        POPUP.show(noServicesPopup);
    }

    // build Services pop-up that displays when an "Monthly Summary" button is clicked
    async function buildSummaryServicePopUp(consumerId, btnType) {
        selectSummaryServicePopup = POPUP.build({
            header: 'Select a Service',
            hideX: true,
            id: 'selectSummaryServicePopup',
        });

        summaryServicesDropdown = dropdown.build({
            label: 'Services',
            dropdownId: 'summaryServicesDropdown',
        });

        summaryServicesDoneBtn = button.build({
            id: 'summaryServicesDoneBtn',
            text: 'done',
            type: 'contained',
            style: 'secondary',
            classNames: 'disabled',
            callback: () => servicePopupDoneBtn(consumerId, btnType),
        });
        this.doneButton = summaryServicesDoneBtn;

        let cancelBtn = button.build({
            id: 'summaryServiceCancelBtn',
            text: 'cancel',
            type: 'outlined',
            style: 'secondary',
            callback: () => servicePopupCancelBtn(btnType),
        });

        let btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(summaryServicesDoneBtn);
        btnWrap.appendChild(cancelBtn);
        selectSummaryServicePopup.appendChild(summaryServicesDropdown);
        selectSummaryServicePopup.appendChild(btnWrap);

        populateMonthlySummaryServiceCodeDropdown(consumerId);

        summaryServicesDropdown.addEventListener('change', event => {
            selectedConsumerServiceId = event.target.value;
            // selectedConsumerServiceType = event.target.id;
            selectedConsumerFormNumber = event.target.id;
            selectedConsumerServiceName = event.target.text;
        });

        summaryServicesDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];

            if (selectedOption.value == 'SELECT') {
                selectedConsumerServiceId = '';
                // selectedConsumerServiceType = '';
                selectedConsumerFormNumber = '';
                selectedConsumerServiceName = '';
            } else {
                // TODO JOE: selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
                selectedConsumerServiceId = selectedOption.value;
                // selectedConsumerServiceType = selectedOption.id;
                selectedConsumerFormNumber = selectedOption.id;
                selectedConsumerServiceName = selectedOption.text;
            }
            summaryServicesDropDownRequired();
        });

        summaryServicesDropDownRequired();

        POPUP.show(selectSummaryServicePopup);

        function summaryServicesDropDownRequired() {
            if (!selectedConsumerServiceId || selectedConsumerServiceId === '') {
                summaryServicesDropdown.classList.add('error');
                summaryServicesDoneBtn.classList.add('disabled');
            } else {
                summaryServicesDropdown.classList.remove('error');
                summaryServicesDoneBtn.classList.remove('disabled');
            }
        }
    }

    // Event for Done BTN on the Services Popup Window
    function servicePopupDoneBtn(consumerId, btnType) {
        if (btnType === 'newEntry') {
            POPUP.hide(selectServicePopup);
        } else {
            POPUP.hide(selectSummaryServicePopup);
        }

        // find the array element with consumerId
        var thisConsumer = selectedConsumers.filter(consumer => {
            return consumer.id === consumerId;
        });
        var thisselectedConsumerServiceId = selectedConsumerServiceId;
        var thisselectedConsumerReferenceNumber = selectedConsumerReferenceNumber;
        var thisselectedConsumerServiceType = selectedConsumerServiceType;
        var thisselectedConsumerFormNumber = selectedConsumerFormNumber;
        var thisselectedConsumerServiceName = selectedConsumerServiceName.substr(4).split('- Ref #')[0];
        selectedConsumerServiceId = '';
        //selectedConsumerServiceType = '';
        selectedConsumerFormNumber = '';
        // TODO JOE: selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
        // TODO JOE: Need to add to the two ifs below to include selectedConsumerServiceType
        // TODO JOE: Need to add two more if statements to call init() for the two Form 8 Forms
        if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerFormNumber === '4')
            OODForm4MonthlyPlacement.init(
                {},
                thisConsumer[0],
                thisselectedConsumerServiceId,
                thisselectedConsumerReferenceNumber,
                $.session.UserId,
                serviceDate,
                btnType,
            );

        if (thisConsumer && btnType === 'monthlySummary' && thisselectedConsumerFormNumber === '4')
            OODForm4MonthlySummary.init(
                {},
                thisConsumer[0],
                thisselectedConsumerServiceId,
                $.session.UserId,
                btnType,
            );
        if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerFormNumber === '6')
            Tier1andJDPlanForm.init(
                    {},
                    thisConsumer[0],
                    thisselectedConsumerServiceId,
                    thisselectedConsumerServiceName,
                    thisselectedConsumerReferenceNumber,
                    $.session.UserId,
                    serviceDate,
                    btnType,
        );

        if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerFormNumber === '8')
            communityBasedAssessmentForm.init(
                {},
                thisConsumer[0],
                thisselectedConsumerServiceId,
                thisselectedConsumerServiceName,
                thisselectedConsumerReferenceNumber,
                $.session.UserId,
                serviceDate,
                btnType,
            );
        if (thisConsumer && btnType === 'monthlySummary' && thisselectedConsumerFormNumber === '8')
            communityBasedAssessmentSummaryForm.init(
                {},
                thisConsumer[0],
                thisselectedConsumerServiceId,
                $.session.UserId,
                btnType,
            );
        if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerFormNumber === '10')
            OODFormTransportation.init(
                {},
                thisConsumer[0],
                thisselectedConsumerServiceId,
                thisselectedConsumerReferenceNumber,
                $.session.UserId,
                serviceDate,
                btnType,
            );
            if (thisConsumer && btnType === 'newEntry' && thisselectedConsumerFormNumber === '16')
                summerYouthWorkExperienceForm.init(
                    {},
                    thisConsumer[0],
                    thisselectedConsumerServiceId,
                    thisselectedConsumerServiceName,
                    thisselectedConsumerReferenceNumber,
                    $.session.UserId,
                    serviceDate,
                    btnType,
                );
            if (thisConsumer && btnType === 'monthlySummary' && thisselectedConsumerFormNumber === '16')
                summerYouthWorkExperienceSummaryForm.init(
                    {},
                    thisConsumer[0],
                    thisselectedConsumerServiceId,
                    $.session.UserId,
                    btnType,
                );
        // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
    }

    // Event for Cancel BTN on the Services Popup Window
    function servicePopupCancelBtn(btnType) {
        selectedConsumerServiceId = '';
        selectedConsumerReferenceNumber = '';
        if (btnType === 'newEntry') {
            POPUP.hide(selectServicePopup);
            loadOODLanding();
        } else {
            POPUP.hide(selectSummaryServicePopup);
            loadOODLanding();
        }
        // OODForm4MonthlyPlacement.init();
        // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
    }

    async function generateAndTrackFormProgress(formNumber) {
        // Prepare data for form generation
        let data = {
            referenceNumber: filterValues.referenceNumber,
            peopleId: selectedConsumerIds[0],
            serviceCodeId: filterValues.serviceId,
            startDate: filterValues.serviceDateStart,
            endDate: filterValues.serviceDateEnd,
            userId: filterValues.userId
        };
    
        try {
            switch (formNumber) {
                case 4:
                    sentStatus = await OODAjax.generateForm4(data);
                    break;
    
                case 6:
                    sentStatus = await OODAjax.generateForm6(data);
                    break;

                case 8:
                    sentStatus = await OODAjax.generateForm8(data);
                    break;
    
                case 10:
                    sentStatus = await OODAjax.generateForm10(data);
                    success = true;
                    break;

                case 16:
                    sentStatus = await OODAjax.generateForm16(data);
                    //alert('Form 16 under construction.');
                    break;
            }
        } catch (error) {
            //console.error(error);
            const formsPopup = document.getElementById('createOODFormsPopup');
            formsPopup.remove();
            overlay.hide();
        }
        const formsPopup = document.getElementById('createOODFormsPopup');
        if (formsPopup) formsPopup.remove();
        overlay.hide();
    }
    

    // build Filter button, which filters the data displayed on the OOD Entries Table
    function buildNewFilterBtn() {
        if (!filterValues) {

         
            filterValues = {
                token: $.session.Token,
                serviceDateStart: UTIL.formatDateFromDateObj(dates.subDays(new Date(), 30)),
               serviceDateEnd: UTIL.getTodaysDate(),
              
                userId: $.session.UserId,
                userName: $.session.LName + ', ' + $.session.Name,
                serviceId: '%',
                serviceName: '',
                referenceNumber: '%',
            };
        }
    }

    // build Edit Employers  button,
    function buildEditEmployersBtn() {
        return button.build({
            text: 'Edit Employers',
            style: 'secondary',
            type: 'contained',
            id: 'editEmployersBtn',
            //classNames: !$.session.formsInsert ? ['disabled'] : ['newPlanBtn'],
            classNames:
                $.session.OODUpdate || $.session.OODInsert || $.session.OODView
                    ? ['editEmployersBtn']
                    : ['editEmployersBtn', 'disabled'],
            callback: async () => {
                OODEmployers.init();
            },
        });
    }

    // build Each Form Button button,
    function buildIndividualFormBtn(formText, formNumber) {
        return button.build({
            text: formText,
            style: 'secondary',
            type: 'contained',
            id: `OODForm${formNumber}Btn`,
            classNames: `OODForm${formNumber}Btn`,
            callback: async () => {
                //generateAndTrackFormProgress(formNumber);
                // displayPopup
                 buildCreateFormPopUp(formNumber);
            },
        });
    }

    // build Create Forms button,
    function buildCreateFormsBtn() {
        return button.build({
            text: 'Create OOD Forms',
            style: 'secondary',
            type: 'contained',
            id: 'createFormsBtn',
            classNames: 'createFormsBtn',
            callback: () => {
                showCreateFormsPopup();
            },
        });
    }

    
    // build Update Employment Goals button,
    function buildUpdateEmploymentGoalsBtn() {
        return button.build({
            text: 'Update',
            style: 'secondary',
            type: 'contained',
            id: 'createFormsBtn2',
            callback: () => {
                 buildEmploymentGoalPopUp();
            },
        });
    }

    function showCreateFormsPopup() {
        // Popup
        const popup = POPUP.build({
            id: `createOODFormsPopup`,
            hideX: true,
            classNames: [
                'popup',
                'visible',
                'popup--filter',
                'createOODFormsPopup']
        });

        popup.setAttribute('data-popup', 'true');
        popup.setAttribute('overflow-y', 'unset: !importatnt;');

        const form4Btn = buildIndividualFormBtn('Form 4 - Monthly Job & Site Development', 4);
        const form6Btn = buildIndividualFormBtn('Form 6 - Tier1 and JD Plan', 6);
        const form8Btn = buildIndividualFormBtn('Form 8 - Work Activities and Assessment', 8);
        const form10Btn = buildIndividualFormBtn('Form 10 - Transportation', 10);
        const form16Btn = buildIndividualFormBtn('Form 16 - Summer Youth Experience', 16);

        popup.appendChild(form4Btn);
        popup.appendChild(form6Btn);
        popup.appendChild(form8Btn);
        popup.appendChild(form10Btn);
        popup.appendChild(form16Btn);

        // Append to DOM
        bodyScrollLock.disableBodyScroll(popup);
        overlay.show();
        actioncenter.appendChild(popup);
    }

    // build the display of the current Filter Settings (next to the Filter button)
    function buildFilteredBy() {
        var filteredBy = document.querySelector('.filteredByData');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('filteredByData');
            filterButtonSet()
            filteredBy.appendChild(btnWrap);
        }

        // var splitDate = selectedDate.split('-');
        var splitDate = '2021-12-28'.split('-');
        var filteredDate = `${UTIL.leadingZero(splitDate[1])}/${UTIL.leadingZero(
            splitDate[2],
        )}/${splitDate[0].slice(2, 4)}`;


        if (filterValues.userId === '%' || filterValues.userId === 'ALL') {
            btnWrap.appendChild(employeeBtnWrap);
            btnWrap.removeChild(employeeBtnWrap);
        } else {
            btnWrap.appendChild(employeeBtnWrap);
        }

        if (filterValues.serviceId === '%' || filterValues.serviceId === 'ALL') {
            btnWrap.appendChild(serviceBtnWrap);
            btnWrap.removeChild(serviceBtnWrap);
        } else {
            btnWrap.appendChild(serviceBtnWrap);
        }
        if (filterValues.referenceNumber === '%' || filterValues.referenceNumber === 'ALL') {
            btnWrap.appendChild(referenceNumberBtnWrap);
            btnWrap.removeChild(referenceNumberBtnWrap);
        } else {
            btnWrap.appendChild(referenceNumberBtnWrap);
        }

        return filteredBy;
    }

    function filterButtonSet() {
        filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtnNew',
            callback: () => { buildFilterPopUp('ALL') },
        });

        serviceDateStartBtn = button.build({
            id: 'serviceDateStartBtn',
            text: 'Service Start Date: ' + moment(filterValues.serviceDateStart, 'YYYY-MM-DD').format('M/D/YYYY'),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('serviceDateStartBtn') },
        });

        serviceDateEndBtn = button.build({
            id: 'serviceDateEndBtn',
            text: 'Service End Date: ' + moment(filterValues.serviceDateEnd, 'YYYY-MM-DD').format('M/D/YYYY'),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('serviceDateEndBtn') },
        });

        employeeBtn = button.build({
            id: 'employeeBtn',
            text: 'Employee: ' + filterValues.userName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('employeeBtn') },
        });
        employeeCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('employeeBtn') },
        });

        serviceBtn = button.build({
            id: 'serviceBtn',
            text: 'Service: ' + filterValues.serviceName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('serviceBtn') },
        });
        serviceCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('serviceBtn') },
        });

        referenceNumberBtn = button.build({
            id: 'referenceNumberBtn',
            text: 'Reference Number: ' + filterValues.referenceNumber,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { buildFilterPopUp('referenceNumberBtn') },
        });
        referenceNumberCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('referenceNumberBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        serviceDateStartBtnWrap = document.createElement('div');
        serviceDateStartBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceDateStartBtnWrap.appendChild(serviceDateStartBtn);       
        btnWrap.appendChild(serviceDateStartBtnWrap);

        serviceDateEndBtnWrap = document.createElement('div');
        serviceDateEndBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceDateEndBtnWrap.appendChild(serviceDateEndBtn);
        btnWrap.appendChild(serviceDateEndBtnWrap);

        employeeBtnWrap = document.createElement('div');
        employeeBtnWrap.classList.add('filterSelectionBtnWrap');
        employeeBtnWrap.appendChild(employeeBtn);
        employeeBtnWrap.appendChild(employeeCloseBtn)
        btnWrap.appendChild(employeeBtnWrap);

        serviceBtnWrap = document.createElement('div');
        serviceBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceBtnWrap.appendChild(serviceBtn);
        serviceBtnWrap.appendChild(serviceCloseBtn);
        btnWrap.appendChild(serviceBtnWrap);

        referenceNumberBtnWrap = document.createElement('div');
        referenceNumberBtnWrap.classList.add('filterSelectionBtnWrap');
        referenceNumberBtnWrap.appendChild(referenceNumberBtn);
        referenceNumberBtnWrap.appendChild(referenceNumberCloseBtn);
        btnWrap.appendChild(referenceNumberBtnWrap);
    }

    function closeFilter(closeFilter) {    
        if (closeFilter == 'employeeBtn') {
            filterValues.userId = '%';
        }
        if (closeFilter == 'serviceBtn') {
            filterValues.serviceId = '%';
        }
        if (closeFilter == 'referenceNumberBtn') {
            filterValues.referenceNumber = '%';
        }
        loadOODLanding();
    }  

    // build Filter pop-up that displays when an "Filter" button is clicked
    function buildFilterPopUp(IsShow) {
        // popup
        filterPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });
        // dropdowns & inputs
        employeeDropdown = dropdown.build({
            label: 'Employee',
            dropdownId: 'employeeDropdown',
        });

        serviceDateStartInput = input.build({
            type: 'date',
            label: 'Service Date Start',
            style: 'secondary',
            value: filterValues.serviceDateStart,
        });
        serviceDateEndInput = input.build({
            type: 'date',
            label: 'Service Date End',
            style: 'secondary',
            value: filterValues.serviceDateEnd,
        });

        servicesDropdown = dropdown.build({
            label: 'Services',
            dropdownId: 'servicesDropdown',
        });

        referenceNumbersDropdown = dropdown.build({
            label: 'Reference Number',
            dropdownId: 'referenceNumbersDropdown',
        });

        // apply filters button
        APPLY_BTN = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
            callback: async () => filterPopupDoneBtn(),
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => filterPopupCancelBtn(),
        });
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        // build popup
        if (IsShow == 'ALL' || IsShow == 'employeeBtn')
            filterPopup.appendChild(employeeDropdown);
        if (IsShow == 'ALL' || IsShow == 'serviceDateStartBtn')
            filterPopup.appendChild(serviceDateStartInput);
        if (IsShow == 'ALL' || IsShow == 'serviceDateEndBtn')
            filterPopup.appendChild(serviceDateEndInput);
        if (IsShow == 'ALL' || IsShow == 'serviceBtn')
            filterPopup.appendChild(servicesDropdown);
        if (IsShow == 'ALL' || IsShow == 'referenceNumberBtn')
            filterPopup.appendChild(referenceNumbersDropdown);
        filterPopup.appendChild(btnWrap);

        populateEmployeeDropdown();
        populateServiceCodeDropdown();
        populateReferenceNumberDropdown();
        eventListeners();
        // setupFilterEvent();

        //return filterPopup;
        POPUP.show(filterPopup);
    }

    // Populate the employee DDL on the Filter Popup Window
    async function populateEmployeeDropdown() {
        const { getActiveEmployeesResult: employees } = await OODAjax.getActiveEmployeesAsync();
        // const templates = WorkflowViewerComponent.getTemplates();
        let data = employees.map(employee => ({
            id: employee.userId,
            value: employee.userId,
            text: employee.userName,
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate('employeeDropdown', data, filterValues.userId);
    }

    // Populate the Service Code DDL on the Filter Popup Window
    async function populateServiceCodeDropdown() {
        const { getActiveServiceCodesResult: services } = await OODAjax.getActiveServiceCodesAsync(
            OODENTRIESFILTER,
        );
        // const templates = WorkflowViewerComponent.getTemplates();
        let data = services.map(service => ({
            id: service.serviceType,
            value: service.serviceId,
            text: service.serviceName,
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate('servicesDropdown', data, filterValues.serviceId);
    }

    // Populate the Reference Number DDL on the Filter Popup Window
    async function populateReferenceNumberDropdown() {
        var consumerIds = selectedConsumerIds.join(', ');

        const { getConsumerReferenceNumbersResult: referencenumbers } =
            await OODAjax.getConsumerReferenceNumbersAsync(consumerIds);
        // const templates = WorkflowViewerComponent.getTemplates();
        let data = referencenumbers.map(referencenumber => ({
            id: referencenumber.referenceNumber,
            value: referencenumber.referenceNumber,
            text: referencenumber.referenceNumber,
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
        dropdown.populate('referenceNumbersDropdown', data, filterValues.referenceNumber);
       // dropdown.populate('createreferenceNumbersDropdown', data, filterValues.referenceNumber);
    }

     // Populate the Reference Number DDL on the Filter Popup Window
     async function populatecreateReferenceNumberDropdown(formNumber) {
        var consumerIds = selectedConsumerIds.join(', ');

        const { getConsumerReferenceNumbersResult: referencenumbers } =
            await OODAjax.getConsumerReferenceNumbersAsync(consumerIds, createFilterValues.serviceDateStart, createFilterValues.serviceDateEnd, formNumber);
        // const templates = WorkflowViewerComponent.getTemplates();
        let data = referencenumbers.map(referencenumber => ({
            id: referencenumber.referenceNumber,
            value: referencenumber.referenceNumber,
            text: referencenumber.referenceNumber,
        }));
        data.unshift({ id: null, value: '%', text: 'ALL' }); //ADD Blank value
       // dropdown.populate('referenceNumbersDropdown', data, filterValues.referenceNumber);
        dropdown.populate('createreferenceNumbersDropdown', data, filterValues.referenceNumber);
    }

    // Populate the Service Code DDL for the 'Entry' Service Popup Window
    async function populateConsumerServiceCodeDropdown(consumerId, serviceDate) {
        const { getConsumerServiceCodesResult: services } = await OODAjax.getConsumerServiceCodesAsync(
            consumerId,
            serviceDate,
        );
        // const templates = WorkflowViewerComponent.getTemplates();

        //TODO JOE: id: should use selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
        let data = services.map(service => ({
            // id: (service.serviceType === '') ? 'T10' : service.serviceType, // replace with selectedConsumerServiceType to get T1 and T2 info
            id: service.formNumber,
            value: service.serviceId,
            text: service.serviceName + ' - Ref # ' + service.referenceNumber,
        }));
        data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
        dropdown.populate('consumerServicesDropdown', data);
        //selectedConsumerServiceId = '';
        // consumerServicesDropDownRequired();
        consumerServicesDoneBtn.classList.add('disabled');
        consumerServicesDropdown.classList.add('error');
    }

    // Populate the Service Code DDL for the 'Monthly Summary' Service Popup Window
    async function populateMonthlySummaryServiceCodeDropdown(consumerId) {
        const { getActiveServiceCodesResult: services } = await OODAjax.getActiveServiceCodesAsync(
            FORM4MONTHLYSUMMARYSERVICES,
        );
        // const templates = WorkflowViewerComponent.getTemplates();
        //TODO JOE: id: should use selectedConsumerServiceType -- T1 and T2 -- need this new variable to determine whether the Form 4 (T1) or Form 8 (T2) is opened
        let data = services.map(service => ({
            //id: service.serviceType, // replace with selectedConsumerServiceType to get T1 and T2 info
            id: service.formNumber,
            value: service.serviceId,
            text: service.serviceName,
        }));
        data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value
        dropdown.populate('summaryServicesDropdown', data);
    }

    function eventListeners() {
        serviceDateStartInput.addEventListener('change', event => { 
            if (event.target.value !== '') {
                filterValues.serviceDateStart = event.target.value;
            } else {
                event.target.value = filterValues.serviceDateStart;
            } 
        });
        serviceDateEndInput.addEventListener('change', event => {          
            if (event.target.value !== '') { 
                filterValues.serviceDateEnd = event.target.value;
            } else {
                event.target.value = filterValues.serviceDateEnd;
            }
        });
        employeeDropdown.addEventListener('change', event => {
            filterValues.userId = event.target.value;
            filterValues.userName = event.target.options[event.target.selectedIndex].text;
        });
        servicesDropdown.addEventListener('change', event => {
            filterValues.serviceId = event.target.value;
            filterValues.serviceName = event.target.options[event.target.selectedIndex].text;
        });
        referenceNumbersDropdown.addEventListener('change', event => {
            filterValues.referenceNumber = event.target.value;
        });
        //routeStatusDropdown.addEventListener('change', event => {
        //  filterOpts.routeStatus = event.target.value;
        // });
    }

    async function filterPopupDoneBtn() {
        POPUP.hide(filterPopup);
        eventListeners();
        loadOODLanding();

        //let OODtable = document.getElementById('OODEntriesTable')
        // OODEntriesTable = await buildOODEntriesTable(filterValues);
        //OODtable.remove();
        // DOM.ACTIONCENTER.appendChild(OODEntriesTable);
    }

    function filterPopupCancelBtn() {
        POPUP.hide(filterPopup);
        // OODForm4MonthlyPlacement.init();
        // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
    }

    function employmentGoalPopupCancelBtn() {
        POPUP.hide(employmentGoalPopup);
        // OODForm4MonthlyPlacement.init();
        // forms.displayFormPopup(formId, documentEdited, consumerId, isRefresh, isTemplate);
    }
     // build Create Form  pop-up that displays when a Form is selected
     function buildCreateFormPopUp(formNumber) {

        if (!thisStartDate) {
            thisStartDate = new Date();
            thisStartDate.setDate(1); // Set to the first day of the current month
            thisStartDate.setMonth(thisStartDate.getMonth() - 1); // Go back one month
             thisStartDate.setDate(1); // Ensure it's the first day of the previous month
         }

        if (!thisEndDate) {
            thisEndDate = new Date();
            thisEndDate.setDate(0); // Sets the date to the last day of the previous month
        }

        createFilterValues = {
            token: $.session.Token,
           // serviceDateStart: UTIL.formatDateFromDateObj(dates.subDays(new Date(), 30)),
           // serviceDateEnd: UTIL.getTodaysDate(),
            serviceDateStart: thisStartDate.toISOString().split('T')[0],
            serviceDateEnd: thisEndDate.toISOString().split('T')[0],

            // userId: $.session.UserId,
            // userName: $.session.LName + ', ' + $.session.Name,
            // serviceId: '%',
            // serviceName: '',
            // referenceNumber: '%',
        };


        // popup
        createfilterPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });
        // dropdowns & inputs
        employeeDropdown = dropdown.build({
            label: 'Employee',
            dropdownId: 'employeeDropdown',
        });

        createServiceDateStartInput = input.build({
            type: 'date',
            label: 'Service Date Start',
            style: 'secondary',
            value: createFilterValues.serviceDateStart,
        });
        createServiceDateEndInput = input.build({
            type: 'date',
            label: 'Service Date End',
            style: 'secondary',
            value: createFilterValues.serviceDateEnd,
        });

        createreferenceNumbersDropdown = dropdown.build({
            label: 'Reference Number',
            dropdownId: 'createreferenceNumbersDropdown',
        });

        // apply filters button
        APPLY_BTN = button.build({
            text: `Create Form ${formNumber}`,
            style: 'secondary',
            type: 'contained',
            callback: async () => createfilterPopupDoneBtn(formNumber),
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: () => POPUP.hide(createfilterPopup),
        });
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        // build popup
  
            createfilterPopup.appendChild(employeeDropdown);
   
            createfilterPopup.appendChild(createServiceDateStartInput);
     
            createfilterPopup.appendChild(createServiceDateEndInput);
   
            createfilterPopup.appendChild(createreferenceNumbersDropdown);
            createfilterPopup.appendChild(btnWrap);

        populateEmployeeDropdown();
        populatecreateReferenceNumberDropdown(formNumber);
        createeventListeners(formNumber);
        // setupFilterEvent();

      

        //return filterPopup;
        const formsPopup = document.getElementById('createOODFormsPopup');
            formsPopup.remove();

        POPUP.show(createfilterPopup);

    }

    async function createfilterPopupDoneBtn(formNumber) {
        POPUP.hide(createfilterPopup);
        createeventListeners(formNumber);
        generateAndTrackFormProgress(formNumber);
         
        loadOODLanding();

    }


    function createeventListeners(formNumber) {
        createServiceDateStartInput.addEventListener('input', event => { 
            if (event.target.value !== '') {
                createFilterValues.serviceDateStart = event.target.value;
                populatecreateReferenceNumberDropdown(formNumber);
            } else {
                event.target.value = createFilterValues.serviceDateStart;
                
            } 
        });
        createServiceDateEndInput.addEventListener('input', event => {          
            if (event.target.value !== '') { 
                createFilterValues.serviceDateEnd = event.target.value;
                populatecreateReferenceNumberDropdown(formNumber);
            } else {
                event.target.value = createFilterValues.serviceDateEnd;
                
            }
        });
        employeeDropdown.addEventListener('change', event => {
            filterValues.userId = event.target.value;
            filterValues.userName = event.target.options[event.target.selectedIndex].text;
        });
     
        createreferenceNumbersDropdown.addEventListener('change', event => {
            filterValues.referenceNumber = event.target.value;
        });
        
    }

    function buildEmploymentGoalPopUp() {
        // popup
        employmentGoalPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });
        

	employmentGoalTextarea = input.build({
      label: 'Employment Goal',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
       value: employmentGoalText,
     // charLimit: charLimits.importantTo,
      forceCharLimit: true,
      callback: e => {
        employmentGoalText = e.target.value;  
      },
    });
    employmentGoalTextarea.classList.add('importantTo');
		
        // apply filters button
        APPLY_BTN = button.build({
            text: 'Save',
            style: 'secondary',
            type: 'contained',
             callback: async () => {
               const success = await OODAjax.updateEmploymentGoal(
               { peopleId: selectedConsumerPeopleId, 
                userId: $.session.UserId, 
                ServiceGoal: employmentGoalText,
             });
             POPUP.hide(employmentGoalPopup);
              loadOODLanding();
             },
        });
        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback:  () => {

                 employmentGoalPopupCancelBtn()
                 loadOODLanding();
            },
        });
		
		
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(APPLY_BTN);
        btnWrap.appendChild(CANCEL_BTN);

        let employmentGoalTitle = document.createElement('h2');
        employmentGoalTitle.innerHTML =
            `Update Employment Goal`;

        employmentGoalTitle.style.padding = '10px';

        employmentGoalPopup.appendChild(employmentGoalTitle);
		employmentGoalPopup.appendChild(employmentGoalTextarea);
	    employmentGoalPopup.appendChild(btnWrap);

        //return filterPopup;
        POPUP.show(employmentGoalPopup);
        checkEmploymentGoalRequiredFields();
        checkEmploymentGoalEventListners();
    }

    function checkEmploymentGoalRequiredFields() {
        var employmentGoalInput = employmentGoalPopup.querySelector('textarea');

        if (employmentGoalInput.value === '') {
            employmentGoalTextarea.classList.add('error');
        } else {
            employmentGoalTextarea.classList.remove('error');
        }

        setBtnStatus();
    }
    
    function setBtnStatus() {
        var hasErrors = [].slice.call(employmentGoalPopup.querySelectorAll('.error'));
        if ((hasErrors.length !== 0)) {
            APPLY_BTN.classList.add('disabled');
          } else {
            APPLY_BTN.classList.remove('disabled');
          }
    
      }
      function checkEmploymentGoalEventListners() {
       // var employeeGoalInput = employeeGoalPopup.querySelector('textarea');
       employmentGoalTextarea.addEventListener('input', event => {
            employmentGoalText = event.target.value;
            checkEmploymentGoalRequiredFields();
          });
      }
      

    function init() {
        //DOM.clearActionCenter();
        // PROGRESS.SPINNER.show('Loading PDF Forms...');
        //loadPDFFormsLanding();

        setActiveModuleAttribute('OOD');
        DOM.clearActionCenter();
        roster2.showMiniRoster();
    }

    return {
        init,
        handleActionNavEvent,
        loadOODLanding,
        buildEntryServicePopUp,
        buildSummaryServicePopUp,
    };
})();
