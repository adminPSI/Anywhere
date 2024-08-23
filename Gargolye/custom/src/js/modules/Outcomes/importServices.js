const importServices = (() => {

    //DATA
    let extractionData;
    let currentlySelectedConsumer;
    let existingOutcomesVendorData;
    let selectedOutcomes = [];
    let assessmentAreas =         
        {
            'Communication' : 34,
            'Advocacy & Engagement' : 35,
            'Safety and Security' : 36,
            'Social and Spirituality' : 37,
            'Daily Life and Employment' : 38,
            'Community Living' : 39,
            'Healthy Living' : 40
        }
    const sectionToTableMap = {
    'Known & Likely Risks': 'importedPlanRisksTable',
    'Experiences': 'importedExperiencesTable',
    'Paid Supports': 'importedPaidSupportsTable',
    'Additional Supports': 'importedAdditionalSupportsTable',
    'Professional Referrals': 'importedProfessionalReferralsTable',
        };  

    //ELEMENTS 
    let importSelectedServicesPopup;

    // TABLES
    let knownAndLikelyRisksTable;
    let experiencesTable;
    let paidSupportsTable;
    let additionalSupportsTable;
    let professionalReferralsTable;

    async function init(file, outcomesServicesData, selectedConsumer) {
        const token = $.session.Token
        currentlySelectedConsumer = selectedConsumer;

        extractionData = await _UTIL.fetchData('importedOutcomesPDFData', {token, file});
        existingOutcomesVendorData = outcomesServicesData.pageDataParent.map(outcome => ({
            value: outcome.goal_id,
            text: outcome.outcomeStatement,
        }))
        buildImportSections();
    }

    // Build New Outcomes Page 
    async function buildImportSections() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        landingPage = document.createElement('div');
        DOM.ACTIONCENTER.appendChild(landingPage);

        var headerCheckbox = document.createElement('input');
        headerCheckbox.type = 'checkbox';
        headerCheckbox.style.zIndex = '999999';
        headerCheckbox.style.pointerEvents = 'all';
        headerCheckbox.style.position = 'relative';

        var rowCheckbox = document.createElement('input');
        rowCheckbox.type = 'checkbox';
        rowCheckbox.classList.add('row-checkbox');
        rowCheckbox.style.zIndex = '999999';
        rowCheckbox.style.pointerEvents = 'all';
        rowCheckbox.style.position = 'relative';

        function handleCheckboxSelection(event, rowData) {
            let checkbox = event.target;
            const tableWrapper = checkbox.closest('.table');
            const outcomeRowContainer = tableWrapper.querySelector('.addToExistingOutcomesRowContainer');
        
            // Check if the target is the checkbox itself
            if (checkbox.type !== 'checkbox') {
                // If not, assume we're in the div and select the checkbox within the startIcon div
                checkbox = event.target.querySelector('input[type="checkbox"]');
            }
        
            if (checkbox && checkbox.checked) {
                // add the newly checked row data to the selected outcomes array
                selectedOutcomes.push(rowData);

                // show the existing outcomes div at the bottom of the table
                outcomeRowContainer.style.display = 'flex';

            } else {
                // remove the now unselected row data from the selected outcomes array
                selectedOutcomes = selectedOutcomes.filter(
                    selectedRow => selectedRow !== rowData
                );

                //check if any row in the table is checked 
                const anyRowsChecked = Array.from(tableWrapper.querySelectorAll('.row-checkbox'))
                                            .some(cb => cb.checked);

                // hide the exising outcomes div if no rows are checked
                if (!anyRowsChecked) {
                    outcomeRowContainer.style.display = 'none';
                }
            }
        }

        function handleHeaderCheckboxSelection(headerCheckboxSelector, tableSelector) {
            const headerCheckbox = document.querySelector(headerCheckboxSelector);
            const rowCheckboxes = document.querySelectorAll(`${tableSelector} .row-checkbox`);
        
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = headerCheckbox.checked;

                // Find the cell that contains this checkbox
                const cell = checkbox.closest('.startIcon');

                // Dispatch the click event on the cell to trigger the callback
                if (cell) {
                    cell.dispatchEvent(new Event('click'));
                }
            });
        }

        function createAddToExistingOutcomesRow(tableDiv) {
            const exitingOutcomDropdown = dropdown.build({
                id: 'existingOutcomeDropdown',
                label: 'Add to Existing Outcome',
                dropdownId: 'existingOutcomeDropdown',
            });

            const serviceDateStartInput = input.build({
                type: 'date',
                label: 'Service Date Start',
                style: 'secondary',
                //value: filterValues.serviceDateStart,
            });

             const serviceDateEndInput = input.build({
                type: 'date',
                label: 'Service Date End',
                style: 'secondary',
                //value: filterValues.serviceDateEnd,
            });

            const createAddToExistingOutcomesRowContainerDiv = document.createElement('div');
            createAddToExistingOutcomesRowContainerDiv.classList.add('addToExistingOutcomesRowContainer')
            createAddToExistingOutcomesRowContainerDiv.appendChild(exitingOutcomDropdown);
            createAddToExistingOutcomesRowContainerDiv.appendChild(serviceDateStartInput);
            createAddToExistingOutcomesRowContainerDiv.appendChild(serviceDateEndInput);
            tableDiv.appendChild(createAddToExistingOutcomesRowContainerDiv);

            dropdown.populate(exitingOutcomDropdown, existingOutcomesVendorData, existingOutcomesVendorData[0]?.value);

            createAddToExistingOutcomesRowContainerDiv.style.display = 'none';
        };

        knownAndLikelyRisksTable = table.build({
            tableId: `importedPlanRisksTable`,
            headline: `Know & Likely Risks`,
            columnHeadings: [
              'Assessment Area',
              'What is the risk, what it looks like, where it occurs',
              'What support must look like, why the person needs this support',
              'Does this risk require supervision?',
              'Who is responsible',
            ],
            sortable: false,
            startIcon: true,
            startIconHeader: headerCheckbox.outerHTML,
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#importedPlanRisksTable .startIcon input[type="checkbox"]', '#importedPlanRisksTable'),
          });

        if (extractionData.importedOutcomesPDFDataResult.riskAssessments) {
            const tableData = extractionData.importedOutcomesPDFDataResult.riskAssessments
                .map((ra, i) => {
                    const { tableValues, raData } = mapRiskAssessmentsDataForTable(ra);
                    const rowId = i + 1;

                    return {
                        id: rowId,
                        values: tableValues,
                        attributes: [{ key: 'sectionId', value: raData.assessmentAreaId }],
                        startIcon: rowCheckbox.outerHTML,
                        startIconCallback: (event) => handleCheckboxSelection(event, raData),
                        onClick: event => {},
                    };
                });

            table.populate(knownAndLikelyRisksTable, tableData, false);
        };

        createAddToExistingOutcomesRow(knownAndLikelyRisksTable);
  
        // Experiences Table
         experiencesTable = table.build({
            tableId: `importedExperiencesTable`,
            headline: `Experiences: <span>In order to accomplish the outcome, what experiences does the person need to have?</span>`,
            columnHeadings: [
                'What needs to happen',
                'How should it happen?',
                'Who is responsible?',
                'When / How Often?',
            ],
            sortable: false,
            startIcon: true,
            startIconHeader: headerCheckbox.outerHTML,
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#importedExperiencesTable .startIcon input[type="checkbox"]', '#importedExperiencesTable'),
        });

        if (extractionData.importedOutcomesPDFDataResult.experiences) {
            const tableData = extractionData.importedOutcomesPDFDataResult.experiences
                .map((ex, i) => {  
                    const { tableValues, exData } = mapExperiencesDataForTable(ex);
                    const rowId = i + 1; 
        
                    return {
                        id: rowId,
                        values: tableValues,
                        attributes: [{ key: 'sectionId', value: exData.assessmentAreaId }],
                        startIcon: rowCheckbox.outerHTML,
                        startIconCallback: (event) => handleCheckboxSelection(event, exData),
                        onClick: () => {},
                    };
                });
        
            table.populate(experiencesTable, tableData, false);
        }

        createAddToExistingOutcomesRow(experiencesTable);
  
        // Paid Supports Table
        paidSupportsTable = table.build({
            tableId: 'importedPaidSupportsTable',
            headline: 'Paid Supports',
            columnHeadings: [
                'Assessment Area',
                'Funding Source',
                'Service Name',
                'Provider Name',
                'Scope of Service/ What support looks like',
                'How Often / How Much',
                'Begin Date',
                'End Date',
            ],
            sortable: false,
            startIcon: true,
            startIconHeader: headerCheckbox.outerHTML,
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#importedPaidSupportsTable .startIcon input[type="checkbox"]', '#importedPaidSupportsTable'),
        });

        if (extractionData.importedOutcomesPDFDataResult.paidSupports) {
            const tableData = extractionData.importedOutcomesPDFDataResult.paidSupports
                .map((ps, i) => {
                    const { tableValues, psData } = mapPaidSupportDataForTable(ps);
                    const rowId = i + 1;

                    return {
                        id: rowId,
                        values: tableValues,
                        attributes: [{ key: 'sectionId', value: psData.assessmentAreaId }],
                        startIcon: rowCheckbox.outerHTML,
                        startIconCallback: (event) => handleCheckboxSelection(event, psData),
                        onClick: event => {},
                    };
                });

            table.populate(paidSupportsTable, tableData, false, true);
        };

        createAddToExistingOutcomesRow(paidSupportsTable);
        
        // Additional Supports Table
        additionalSupportsTable = table.build({
            tableId: 'importedAdditionalSupportsTable',
            headline: `Additional Supports: <span>Family, friends, community resources, technology, etc.</span>`,
            columnHeadings: [
                'Assessment Area',
                'Who Supports',
                'What Support Looks Like',
                'When/How Often',
            ],
            endIcon: false,
            sortable: false,
            startIcon: true,
            startIconHeader: headerCheckbox.outerHTML,
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#importedAdditionalSupportsTable .startIcon input[type="checkbox"]', '#importedAdditionalSupportsTable'),
        });

        if (extractionData.importedOutcomesPDFDataResult.additionalSupports) {
            const tableData = extractionData.importedOutcomesPDFDataResult.additionalSupports
                .map((as, i) => {  
                    const { tableValues, asData } = mapAdditionalSupportDataForTable(as);
                    const rowId = i + 1; 
        
                    return {
                        id: rowId,
                        values: tableValues,
                        attributes: [{ key: 'sectionId', value: asData.assessmentAreaId }],
                        startIcon: rowCheckbox.outerHTML,
                        startIconCallback: (event) => handleCheckboxSelection(event, asData),
                        onClick: () => {},
                    };
                });
        
            table.populate(additionalSupportsTable, tableData, false);
        }
        
        createAddToExistingOutcomesRow(additionalSupportsTable);
  
        // Professional Referrals Table
        professionalReferralsTable = table.build({
            tableId: 'importedProfessionalReferralsTable',
            headline: `Professional Referrals: <span>Medical professionals, therapists, etc.</span>`,
            columnHeadings: [
                'Assessment Area',
                'New or Existing',
                'Who Supports',
                'Reason for Referral',
            ],
            sortable: false,
            startIcon: true,
            startIconHeader: headerCheckbox.outerHTML,
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#importedProfessionalReferralsTable .startIcon input[type="checkbox"]', '#importedProfessionalReferralsTable'),
        });

        if (extractionData.importedOutcomesPDFDataResult.professionalReferrals) {
            const tableData = extractionData.importedOutcomesPDFDataResult.professionalReferrals
                .map((pr, i) => {  
                    const { tableValues, prData } = mapProfessionalReferralsDataForTable(pr);
                    const rowId = i + 1; 
        
                    return {
                        id: rowId,
                        values: tableValues,
                        attributes: [{ key: 'sectionId', value: prData.assessmentAreaId }],
                        startIcon: rowCheckbox.outerHTML,
                        startIconCallback: (event) => handleCheckboxSelection(event, prData),
                        onClick: () => {}
                    }
                });
        
            table.populate(professionalReferralsTable, tableData, false);
        }

        createAddToExistingOutcomesRow(professionalReferralsTable);

        const importSelectedSerivcesAndCancelBtnWrap = document.createElement('div');
        const importSelectedServicesBtn = button.build({
            id: 'importSelectedServicesBtn',
            text: 'Import Selected Services',
            style: 'secondary',
            type: 'contained',
            classNames: 'importSelectedServicesBtn',
            callback: async () => {showImportSelectedServicesPopup()},
        });

        const cancelBtn = button.build({
            id: 'cancelBtn',
            text: 'Cancel',
            style: 'secondary',
            type: 'contained',
            classNames: 'cancelBtn',
            callback: () => {
                selectedOutcomes = [];
                addEditOutcomeServices.init(currentlySelectedConsumer);
            },
        });

        importSelectedSerivcesAndCancelBtnWrap.appendChild(importSelectedServicesBtn);
        importSelectedSerivcesAndCancelBtnWrap.appendChild(cancelBtn);

        async function showImportSelectedServicesPopup() {
            importSelectedServicesPopup = POPUP.build({
                classNames: 'importSelectedServicesPopup',
            })

            let importSelectedServicesPopupMessage = document.createElement('p');

            const okBtn = button.build({
                id: 'okBtn',
                text: 'Ok',
                style: 'secondary',
                type: 'contained',
                classNames: 'okBtn',
                callback: () => {
                    selectedOutcomes = [];
                    POPUP.hide(importSelectedServicesPopup)
                    addEditOutcomeServices.init(currentlySelectedConsumer);
                },
            });

            const token = $.session.Token;

            // Define the properties of ImportedTables with default values
            function createDefaultImportedTable(rowData) {
                return {
                    assessmentAreaId: rowData.assessmentAreaId || null,
                    assessmentArea: rowData.assessmentArea || "",
                    whatIsRisk: rowData.whatIsRisk || "",
                    whatSupportLooksLike: rowData.whatSupportLooksLike || "",
                    riskRequiresSupervision: rowData.riskRequiresSupervision || "",
                    whatNeedsToHappen: rowData.whatNeedsToHappen || "",
                    howItShouldHappen: rowData.howItShouldHappen || "",
                    whoIsResponsible: rowData.whoIsResponsible || "",
                    whenHowOften: rowData.whenHowOften || "",
                    providerName: rowData.providerName || "",
                    scopeOfService: rowData.scopeOfService || "",
                    howOftenValue: rowData.howOftenValue || "",
                    howOftenText: rowData.howOftenText || "",
                    howOftenFrequency: rowData.howOftenFrequency || "",
                    whoSupports: rowData.whoSupports || "",
                    newOrExisting: rowData.newOrExisting || "",
                    reasonForReferral: rowData.reasonForReferral || "",
                    section: rowData.section || "",
                    existingOutcomeGoalId: rowData.existingOutcomeGoalId || "",
                    serviceDateStart: rowData.serviceDateStart || "",
                    serviceDateEnd: rowData.serviceDateEnd || ""
                };
            }

            // Gather all selected rows with additional data
            const importedTables = selectedOutcomes.map((rowData) => {
                // Use the sectionToTableMap to get the tableId
                const tableId = sectionToTableMap[rowData.section];
                const tableDiv = document.getElementById(tableId);

                const dropdown = tableDiv.querySelector('.addToExistingOutcomesRowContainer .dropdown select');
                const serviceDateStart = tableDiv.querySelector('.addToExistingOutcomesRowContainer input[type="date"]:first-of-type');
                const serviceDateEnd = tableDiv.querySelector('.addToExistingOutcomesRowContainer input[type="date"]:last-of-type');

                const additionalData = {
                    existingOutcomeGoalId: dropdown ? dropdown.value : null,
                    serviceDateStart: serviceDateStart ? serviceDateStart.value : null,
                    serviceDateEnd: serviceDateEnd ? serviceDateEnd.value : null
                };

                // Create a default ImportedTable object and merge with additional data
                return createDefaultImportedTable({ ...rowData, ...additionalData });
            });

            const importSelectedServicesResult = await _UTIL.fetchData('importSelectedServices', {token, importedTables});

            if (importSelectedServicesResult.importSelectedServicesResult.length === 0) {
                importSelectedServicesPopupMessage.innerText = 'Your outcomes have been successfully imported.'
            } else {
                importSelectedServicesPopupMessage.innerText = 'Something went wrong when trying to import your services. Please Try again.'
            }

            importSelectedServicesPopup.appendChild(importSelectedServicesPopupMessage);
            importSelectedServicesPopup.appendChild(okBtn);

            POPUP.show(importSelectedServicesPopup);
        }
  
        landingPage.appendChild(knownAndLikelyRisksTable);
        landingPage.appendChild(experiencesTable);
        landingPage.appendChild(paidSupportsTable);
        landingPage.appendChild(additionalSupportsTable);
        landingPage.appendChild(professionalReferralsTable);
        landingPage.appendChild(importSelectedSerivcesAndCancelBtnWrap);
    }

    // Match string of imported table assessment area to get the associated assessment area id
    function getAssessmentAreaId(targetKey) {
        return assessmentAreas.hasOwnProperty(targetKey) ? assessmentAreas[targetKey] : '';
    }
    

    // map the know and likely risks data into the format needed for populating the table
    function mapRiskAssessmentsDataForTable(ra) {
        let provderId = '';

        const whatIsRisk = ra.WhatIsRisk || "";
        const whatSupportMustLookLike = ra.WhatSupportMustLookLike || "";
        const riskRequiresSupervision = ra.RiskRequiresSupervision || "";
        const whoIsResponsible = ra.WhoIsResponsible || "";

        const assessmentAreaId = getAssessmentAreaId(ra.AssessmentArea);
        const assessmentArea = ra.AssessmentArea;

        const section = 'Known & Likely Risks';

        return {
            tableValues: [
                assessmentArea,
                whatIsRisk,
                whatSupportMustLookLike,
                riskRequiresSupervision,
                whoIsResponsible,
            ],
            raData: {
                assessmentAreaId,
                assessmentArea,
                whatIsRisk,
                whatSupportMustLookLike,
                riskRequiresSupervision,
                whoIsResponsible,
                section
            },
        };
    }

    // map the experiences data into the format needed for populating the table
    function mapExperiencesDataForTable(ex) {
        const whatNeedsToHappen = ex.WhatNeedsToHappen || "";
        const howItShouldHappen = ex.HowItShouldHappen || "";
        const whoIsResponsible = ex.whoIsResponsible || "";
        const WhenHowOften = ex.HowOftenHowMuch || "";

        const section = 'Experiences';
        const assessmentAreaId = getAssessmentAreaId(ex.AssessmentArea);
        const assessmentArea = ex.AssessmentArea;

        return {
            tableValues: [
                whatNeedsToHappen,
                howItShouldHappen,
                whoIsResponsible,
                WhenHowOften,
            ],
            exData: {
                assessmentAreaId,
                assessmentArea,
                whatNeedsToHappen,
                howItShouldHappen,
                whoIsResponsible,
                WhenHowOften,
                section
            },
        };
    }

    // map the paid support data into the format needed for populating the table
    function mapPaidSupportDataForTable(ps) {
        // Split the string into two parts
        const [bDate, eDate] = (ps.BeginDateEndDate).split(/(?<=\d{4})\s+/);

        let provderId = '';

        const serviceName = ps.ServiceName || "";
        const scopeOfService = ps.ScopeOfService || "";
        const howOftenValue = ps.HowOftenHowMuch || "";
        const howOftenFrequencyText = ps.HowOftenHowMuch || "";
        const howOftenText = ps.HowOftenHowMuch || "";
        const fundingSourceDesc = ps.FundingSource || "";
        const fundingSourceText = ps.FundingSource || "";
        const paidSupportsId = '';

        const assessmentAreaId = getAssessmentAreaId(ps.AssessmentArea);
        const assessmentArea = ps.AssessmentArea;

        const providerName = '';

        const section = 'Paid Supports';

        let howOften = '';
        if (howOftenValue) howOften += howOftenValue;
        // if (howOftenFrequency && howOftenFrequency !== '4') {
        //   howOften += ` x `;
        // }

        if (howOftenText) howOften += ` ${howOftenText}`;

        return {
            tableValues: [
                assessmentArea,
                fundingSourceText,
                serviceName,
                providerName,
                scopeOfService,
                howOftenText,
                bDate,
                eDate,
            ],
            psData: {
                assessmentAreaId,
                //providerId,
                providerName,
                //serviceNameId,
                //serviceNameOther,
                scopeOfService,
                howOftenValue,
                //howOftenFrequency,
                howOftenText,
                bDate,
                eDate,
                //fundingSource,
                fundingSourceText,
                paidSupportsId,
                section
            },
        };
    }

    // map the additional supports data into the format needed for populating the table
    function mapAdditionalSupportDataForTable(as) {
        let assessmentAreaId;
        let assessmentArea;

        const whoSupports = as.WhoSupports || "";
        const whoSupportsText = as.WhoSupports || "";
        const whatSupportLooksLike = as.WhatSupportLooksLike || "";
        const howOftenValue = as.WhenHowOften || "";
        const howOftenFrequency = as.WhenHowOften || "";
        const howOftenText = as.WhenHowOften || "";
        const additionalSupportsId = '';

        assessmentAreaId = getAssessmentAreaId(as.AssessmentArea);
        assessmentArea =  as.AssessmentArea;

        const section = 'Additional Supports';

        const whenHowOftenDesc = '';
        let howOften = '';
        if (howOftenValue) howOften += howOftenValue;
        if (howOftenFrequency && howOftenFrequency !== '4') {
            howOften += ` ${whenHowOftenDesc}`;
        } else {
            if (howOftenText) howOften += ` ${howOftenText}`;
        }

        return {
            tableValues: [
                assessmentArea, 
                whoSupportsText, 
                whatSupportLooksLike, 
                howOften,
            ],
            asData: {
                assessmentAreaId,
                whoSupports,
                whatSupportLooksLike,
                howOftenValue,
                howOftenFrequency,
                howOftenText,
                additionalSupportsId,
                section
            },
        };
    }

    // map the professional referrals data into the format needed for populating the table
    function mapProfessionalReferralsDataForTable(pr) {
        let assessmentAreaId;
        let assessmentArea;

        const newOrExisting = pr.NewOrExisting || "";
        const whoSupports = pr.WhoSupports || "";
        const reasonForReferral = pr.ReasonForReferral || "";
        const howOftenValue = pr.WhenHowOften || "";
        const howOftenFrequency = pr.WhenHowOften || "";
        const howOftenText = pr.WhenHowOften || "";
        const additionalSupportsId = '';

        assessmentAreaId = getAssessmentAreaId(pr.AssessmentArea);
        assessmentArea =  pr.AssessmentArea;

        const section = 'Professional Referrals';

        const whenHowOftenDesc = '';
        let howOften = '';
        if (howOftenValue) howOften += howOftenValue;
        if (howOftenFrequency && howOftenFrequency !== '4') {
            howOften += ` ${whenHowOftenDesc}`;
        } else {
            if (howOftenText) howOften += ` ${howOftenText}`;
        }

        return {
            tableValues: [
                assessmentArea, 
                newOrExisting, 
                whoSupports, 
                reasonForReferral,
            ],
            prData: {
                assessmentAreaId,
                assessmentArea, 
                newOrExisting, 
                whoSupports, 
                reasonForReferral,
                section
            },
        };
    }

    return {
        init,
    };
})(); 