const vendorServices = (() => {
    let vendorID;
    let ServicesEntries;

    async function init(vendorId) {
        vendorID = vendorId;
        ServicesEntries = await authorizationsAjax.getVenderServicesEntriesAsync(vendorID);
    }

    function getMarkup() {
        const vendorServicesWrap = document.createElement('div');
        vendorServicesWrap.classList.add('planSummary');

        const importantTables = buildNewVendorServicesForm();
        vendorServicesWrap.appendChild(importantTables);

        return vendorServicesWrap;
    }

    function buildNewVendorServicesForm() {
        const vendorServicesDiv = document.createElement('div');
        vendorServicesDiv.classList.add('additionalQuestionWrap');

        serviceEntriesTable = buildServicesEntriesTable();

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Services</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        addNewCardBody.appendChild(serviceEntriesTable);
        vendorServicesDiv.appendChild(column1);
        return vendorServicesDiv;
    }

    function buildServicesEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'singleEntryAdminReviewTable',
            columnHeadings: ['Funding Source', 'Service Code', 'Service Description'],
            endIcon: false,
        };

        let tableData = ServicesEntries.getVenderServicesEntriesResult.map((entry) => ({
            values: [entry.fundingSource, entry.serviceCode, entry.serviceDescription],                                
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    return {
        init,
        buildNewVendorServicesForm,
        getMarkup,
    };
})(); 