const vendorUCR = (() => {

    let vendorID;
    let UCREntries;


    async function init(vendorId) {
        vendorID = vendorId;
        UCREntries = await authorizationsAjax.getVenderUCREntriesAsync(vendorID);
    }


    function getMarkup() {
        const vendorUCRWrap = document.createElement('div');
        vendorUCRWrap.classList.add('planSummary');

        const importantTables = buildNewVendorUCRForm();
        vendorUCRWrap.appendChild(importantTables);

        return vendorUCRWrap;
    }

    function buildNewVendorUCRForm() {
        const vendorUCRDiv = document.createElement('div');
        vendorUCRDiv.classList.add('additionalQuestionWrap');

        UCREntriesTable = buildUCREntriesTable();

        const headers = UCREntriesTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Service
        headers[1].setAttribute('data-type', 'string'); // Group Size
        headers[2].setAttribute('data-type', 'string'); // Service Location 
        headers[3].setAttribute('data-type', 'string'); // CDB Category 
        headers[4].setAttribute('data-type', 'string'); //  Assessment/ Acuity Score
        headers[5].setAttribute('data-type', 'date'); // Start Date
        headers[6].setAttribute('data-type', 'date'); // End Date 
        headers[7].setAttribute('data-type', 'amount'); //  UCR


        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">UCR</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        addNewCardBody.appendChild(UCREntriesTable);
        vendorUCRDiv.appendChild(column1);

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(UCREntriesTable); 

        return vendorUCRDiv;
    }

    function buildUCREntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'vendorInfoUCRTable',
            columnHeadings: ['Service ', 'Group Size', 'Service Location', 'CDB Category', 'Assessment/ Acuity Score', 'Start Date', 'End Date', 'UCR'],
            endIcon: false,
        };

        let tableData = UCREntries.getVenderUCREntriesResult.map((entry) => ({
            values: [entry.service, entry.groupSize, entry.serviceLocation, entry.CDBCategory, entry.assessmentAcuityScore, entry.startDate == '' ? '' : moment(entry.startDate).format('MM/DD/YYYY'), entry.endDate == '' ? '' : moment(entry.endDate).format('MM/DD/YYYY'), entry.UCR == '' ? entry.UCR : '$' + entry.UCR],
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }


    return {
        init,
        buildNewVendorUCRForm,
        getMarkup,
    };
})(); 