const vendorCertification = (() => {
    let vendorID;
    let certificationEntries;

    async function init(vendorId) {
        vendorID = vendorId;
        certificationEntries = await authorizationsAjax.getVenderCertificationEntriesAsync(vendorID);
    }


    function getMarkup() {
        const vendorCertificationWrap = document.createElement('div');
        vendorCertificationWrap.classList.add('planSummary');

        const importantTables = buildNewCertificationForm();
        vendorCertificationWrap.appendChild(importantTables);

        return vendorCertificationWrap;
    }

    function buildNewCertificationForm() {
        const vendorCertificationDiv = document.createElement('div');
        vendorCertificationDiv.classList.add('additionalQuestionWrap');

        certificationEntriesTable = buildCertificationEntriesTable();

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Certification</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        addNewCardBody.appendChild(certificationEntriesTable);
        vendorCertificationDiv.appendChild(column1);
        return vendorCertificationDiv;
    }

    function buildCertificationEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'vendorInfoTable', 
            columnHeadings: ['Certification', 'Start Date', 'End Date'],
            endIcon: false,
        };

        let tableData = certificationEntries.getVenderCertificationEntriesResult.map((entry) => ({
            values: [entry.Certifiction, entry.startDate == '' ? '' : moment(entry.startDate).format('MM/DD/YYYY'), entry.endDate == '' ? '' : moment(entry.endDate).format('MM/DD/YYYY')],
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }

    return {
        init,
        buildNewCertificationForm,
        getMarkup,
    };
})(); 