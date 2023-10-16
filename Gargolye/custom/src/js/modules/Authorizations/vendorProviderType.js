const vendorProviderType = (() => {
    let vendorID;
    let providerTypeEntries;

    async function init(vendorId) {
        vendorID = vendorId;
        providerTypeEntries = await authorizationsAjax.getProviderTypeEntriesAsync(vendorID);
    }

    function getMarkup() {
        const vendorProviderWrap = document.createElement('div');
        vendorProviderWrap.classList.add('planSummary');

        const importantTables = buildNewVendorProviderTypeForm();
        vendorProviderWrap.appendChild(importantTables);

        return vendorProviderWrap;
    }

    function buildNewVendorProviderTypeForm() {
        const vendorProviderDiv = document.createElement('div');
        vendorProviderDiv.classList.add('additionalQuestionWrap');

        providerTypeEntriesTable = buildProviderTypeEntriesTable();

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Provider Type</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        addNewCardBody.appendChild(providerTypeEntriesTable);
        vendorProviderDiv.appendChild(column1);
        return vendorProviderDiv;
    }

    function buildProviderTypeEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'vendorInfoTable',
            columnHeadings: ['Provider Type', 'Start Date', 'End Date', 'Notes'],
            endIcon: false,
        };

        let tableData = providerTypeEntries.getProviderTypeEntriesResult.map((entry) => ({
            values: [entry.ProviderType, entry.startDate == '' ? '' : moment(entry.startDate).format('MM/DD/YYYY'), entry.endDate == '' ? '' : moment(entry.endDate).format('MM/DD/YYYY'), entry.Notes],
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    return {
        init,
        buildNewVendorProviderTypeForm,
        getMarkup,
    };
})(); 