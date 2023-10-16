const vendorLocationReview = (() => {
    let vendorID;
    let locationReviewEntries;

    async function init(vendorId) {
        vendorID = vendorId;
        locationReviewEntries = await authorizationsAjax.getVenderLocationReviewEntriesAsync(vendorID);
    }

    function getMarkup() {
        const locatationReviewWrap = document.createElement('div');
        locatationReviewWrap.classList.add('planSummary');

        const importantTables = buildNewVendorLocationReviewForm();
        locatationReviewWrap.appendChild(importantTables);

        return locatationReviewWrap;
    }

    function buildNewVendorLocationReviewForm() {
        const locatationReviewDiv = document.createElement('div');
        locatationReviewDiv.classList.add('additionalQuestionWrap');

        locationReviewEntriesTable = buildLocationReviewEntriesTable();

        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Location Review</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)

        addNewCardBody.appendChild(locationReviewEntriesTable);
        locatationReviewDiv.appendChild(column1);
        return locatationReviewDiv;
    }

    function buildLocationReviewEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'vendorInfoTable', 
            columnHeadings: ['Location ', 'Review Type', 'Due Date', 'Completed Date', 'Responsible Staff'],
            endIcon: false,
        };

        let tableData = locationReviewEntries.getVenderLocationReviewEntriesResult.map((entry) => ({
            values: [entry.location, entry.reviewType, entry.dueDate == '' ? '' : moment(entry.dueDate).format('MM/DD/YYYY'), entry.completedDate == '' ? '' : moment(entry.completedDate).format('MM/DD/YYYY'), entry.responsibleStaff],
        }));
        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }


    return {
        init,
        buildNewVendorLocationReviewForm,
        getMarkup,
    };
})(); 