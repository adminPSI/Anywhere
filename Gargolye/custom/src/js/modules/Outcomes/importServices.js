const importServices = (() => {

    //DATA
    let extractionData;
    // TABLES
    let knownAndLikelyRisksTable;
    let experiencesTable;
    let paidSupportsTable;
    let additionalSupportsTable;
    let professionalReferralsTable;

    async function init(pdfFiles) {
        const token = $.session.Token
        extractionData = await _UTIL.fetchData('importedOutcomesPDFData', {token, pdfFiles});
        buildImportSections();
    }

    // Build New Outcomes Page 
    async function buildImportSections() {
        DOM.clearActionCenter();
        DOM.scrollToTopOfPage();
        landingPage = document.createElement('div');
        DOM.ACTIONCENTER.appendChild(landingPage);

        // Initialize the table with headers
         knownAndLikelyRisksTable = table.build({
            tableId: 'knownAndLikelyRisksTable',
            headline: 'Known and Likely Risks',
            columnHeadings: [
                'Assessment Area',
                'What is the risk, what it looks like, where it occurs',
                'What support must look like, why the person needs this support',
                'Does this risk require supervision?',
                'Who is responsible',
            ],
            endIcon: false,
            secondendIcon: false,
        });
  
        // Populate the table with data
        // table.populate(knownAndLikelyRisksTable, 
        //     extractionData.importedOutcomesPDFDataResult.riskAssessments
        // );
        
        // Similarly create and populate other tables
        
        // Experiences Table
         experiencesTable = table.build({
            tableId: 'experiencesTable',
            headline: 'Experiences',
            columnHeadings: [
            'Assessment Area',
            'What Needs to Happen',
            'How It Should Happen',
            'When/How Often'
            ],
            sortable: true,
            endIcon: false,
            secondendIcon: false,
            allowCopy: false
        });
        table.populate(experiencesTable, [
            { id: 'row1', values: ['Area 1', 'Need 1', 'How 1', 'Often 1'], attributes: [{ key: 'data-example', value: 'value1' }] },
            { id: 'row2', values: ['Area 2', 'Need 2', 'How 2', 'Often 2'], attributes: [{ key: 'data-example', value: 'value2' }] }
        ]);
  
        // Paid Supports Table
         paidSupportsTable = table.build({
            tableId: 'paidSupportsTable',
            headline: 'Paid Supports',
            columnHeadings: [
            'Assessment Area',
            'Scope of Service',
            'How Often/Much',
            'Effective Dates'
            ],
            sortable: true,
            endIcon: false,
            secondendIcon: false,
            allowCopy: false
        });
        table.populate(paidSupportsTable, [
            { id: 'row1', values: ['Area 1', 'Service 1', 'Often 1', '2021-01-01'], attributes: [{ key: 'data-example', value: 'value1' }] },
            { id: 'row2', values: ['Area 2', 'Service 2', 'Often 2', '2022-02-02'], attributes: [{ key: 'data-example', value: 'value2' }] }
        ]);
        
        // Additional Supports Table
         additionalSupportsTable = table.build({
            tableId: 'additionalSupportsTable',
            headline: 'Additional Supports',
            columnHeadings: [
                'Assessment Area',
                'Who Supports',
                'What Support Looks Like',
                'When/How Often',
            ],
            sortable: true,
            endIcon: false,
            secondendIcon: false,
            allowCopy: false
        });
        table.populate(additionalSupportsTable, [
            { id: 'row1', values: ['Area 1', 'Support 1', 'Often 1'], attributes: [{ key: 'data-example', value: 'value1' }] },
            { id: 'row2', values: ['Area 2', 'Support 2', 'Often 2'], attributes: [{ key: 'data-example', value: 'value2' }] }
        ]);
  
        // Professional Referrals Table
         professionalReferralsTable = table.build({
            tableId: 'professionalReferralsTable',
            headline: 'Professional Referrals',
            columnHeadings: [
            'Assessment Area',
            'New or Existing?',
            'Reason for Referral'
            ],
            sortable: true,
            endIcon: false,
            secondendIcon: false,
            allowCopy: false
        });
        table.populate(professionalReferralsTable, [
            { id: 'row1', values: ['Area 1', 'New', 'Reason 1'], attributes: [{ key: 'data-example', value: 'value1' }] },
            { id: 'row2', values: ['Area 2', 'Existing', 'Reason 2'], attributes: [{ key: 'data-example', value: 'value2' }] }
        ]);
  
        landingPage.appendChild(knownAndLikelyRisksTable);
        landingPage.appendChild(experiencesTable);
        landingPage.appendChild(paidSupportsTable);
        landingPage.appendChild(additionalSupportsTable);
        landingPage.appendChild(professionalReferralsTable);
    }

    return {
        init,
    };
})(); 