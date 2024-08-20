const importServices = (() => {

    //DATA
    let extractionData;
    let existingOutcomesData;
    let existingOutcomesVendorData;
    let selectedOutcomes = [];

    //ELEMENTS 
    let importSelectedServicesPopup;

    // TABLES
    let knownAndLikelyRisksTable;
    let experiencesTable;
    let paidSupportsTable;
    let additionalSupportsTable;
    let professionalReferralsTable;
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

    async function init(pdfFile, outcomesServicesData) {
        const token = $.session.Token

        extractionData = await _UTIL.uploadFile('importedOutcomesPDFData', {token, pdfFile});
        existingOutcomesVendorData = outcomesServicesData.pageDataParent.map(outcome => ({
            value: outcome.outcomeStatement,
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
        
            // Check if the target is the checkbox itself
            if (checkbox.type !== 'checkbox') {
                // If not, assume we're in the div and select the checkbox within the startIcon div
                checkbox = event.target.querySelector('input[type="checkbox"]');
            }
        
            if (checkbox && checkbox.checked) {
                selectedOutcomes.push(rowData);
            } else {
                selectedOutcomes = selectedOutcomes.filter(
                    selectedRow => selectedRow !== rowData
                );
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
    
            dropdown.populate('existingOutcomeDropdown', existingOutcomesVendorData, existingOutcomesVendorData[0]?.value);

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
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#planRisksTable .startIcon input[type="checkbox"]', '#planRisksTable'),
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
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#experiencesTable .startIcon input[type="checkbox"]', '#experiencesTable'),
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
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#paidSupportsTable .startIcon input[type="checkbox"]', '#paidSupportsTable'),
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
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#additionalSupportsTable .startIcon input[type="checkbox"]', '#additionalSupportsTable'),
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
            startIconHeaderCallback: () => handleHeaderCheckboxSelection('#professionalReferralsTable .startIcon input[type="checkbox"]', '#professionalReferralsTable'),
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
            callback: () => {},
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
                callback: () => {POPUP.hide(importSelectedServicesPopup)},
            });

            const token = $.session.Token;
            const importedTables = selectedOutcomes;

            const importSelectedServicesResult = await _UTIL.fetchData('importSelectedServices', {token, importedTables});
            //const importSelectedServicesResult = 'success';

            if (importSelectedServicesResult === 'success') {
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

        const whatIsRisk = ra.WhatIsRisk;
        const whatSupportMustLookLike = ra.WhatSupportMustLookLike;
        const riskRequiresSupervision = ra.RiskRequiresSupervision;
        const whoIsResponsible = ra.WhoIsResponsible;

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
        const whatNeedsToHappen = ex.WhatNeedsToHappen;
        const howItShouldHappen = ex.HowItShouldHappen;
        const whoIsResponsible = ex.whoIsResponsible;
        const WhenHowOften = ex.HowOftenHowMuch;

        const section = 'Experiences';

        return {
            tableValues: [
                whatNeedsToHappen,
                howItShouldHappen,
                whoIsResponsible,
                WhenHowOften,
            ],
            exData: {
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

        const serviceName = ps.ServiceName;
        const scopeOfService = ps.ScopeOfService;
        const howOftenValue = ps.HowOftenHowMuch;
        const howOftenFrequencyText = ps.HowOftenHowMuch;
        const howOftenText = ps.HowOftenHowMuch;
        const fundingSourceDesc = ps.FundingSource;
        const fundingSourceText = ps.FundingSource;
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

        const whoSupports = as.WhoSupports;
        const whoSupportsText = as.WhoSupports;
        const whatSupportLooksLike = as.WhatSupportLooksLike
        const howOftenValue = as.WhenHowOften;
        const howOftenFrequency = as.WhenHowOften;
        const howOftenText = as.WhenHowOften;
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

        const newOrExisting = pr.NewOrExisting;
        const whoSupports = pr.WhoSupports;
        const reasonForReferral = pr.ReasonForReferral
        const howOftenValue = pr.WhenHowOften;
        const howOftenFrequency = pr.WhenHowOften;
        const howOftenText = pr.WhenHowOften;
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