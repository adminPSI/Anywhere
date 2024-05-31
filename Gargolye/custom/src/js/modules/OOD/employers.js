const OODEmployers = (() => {

    let addNewEmployerBtn;
    let rtnOODMainPageBtn;

    // insert/update employer data
    let employerId;
    let employerName = '';
    let employeraddress1 = '';
    let employeraddress2 = '';
    let employercity = '';
    let employerstate = '';
    let employerzipcode = '';

    //employer inputs 
    let employerInput;
    let address1Input;
    let address2Input;
    let cityInput;
    let stateInput;
    let zipcodeInput;

    let saveBtn;
    let cancelBtn;

    async function init() {

        DOM.clearActionCenter();
        document.querySelectorAll('.consumerListBtn').forEach(e => e.remove());



        let container = document.createElement("div");
        // container.classList.add("btnWrap");
        var LineBr = document.createElement('br');

        addNewEmployerBtn = button.build({
            text: 'Add New Employer',
            style: 'secondary',
            type: 'contained',
            // icon: 'save',
            classNames: !$.session.OODInsert ? ['caseNoteSave', 'disabled'] : ['caseNoteSave'],
            callback: async () => { buildEmployerPopUp({}, 'insert') },
        });

        rtnOODMainPageBtn = button.build({
            text: 'Return to OOD Main Page',
            style: 'secondary',
            type: 'contained',
            // icon: 'save',
            classNames: ['caseNoteSave'],
            callback: async () => { OOD.loadOODLanding() },
        });

        OODEmployersTable = await buildEmployersTable();

        container.appendChild(addNewEmployerBtn);
        container.appendChild(LineBr);
        container.appendChild(OODEmployersTable);
        container.appendChild(LineBr);
        container.appendChild(rtnOODMainPageBtn);


        DOM.ACTIONCENTER.appendChild(container);
    }

    // build the listing of OOD Entries (based off of filter settings)
    async function buildEmployersTable() {
        const tableOptions = {
            plain: false,
            tableId: 'OODEmployersTable',
            columnHeadings: ['Employer', 'Address', 'City', 'State', 'Zip Code'],
            endIcon: true,
            // endIcon : ($.session.formsDelete) ? `${icons['delete']}` : null,

        };

        // FAKE DATA : build table data -- see forms.js line 93
        // const tableData = [{ values : ['My Employer', '123 State St', 'Kyzyl', 'OH'], endIcon : `${icons['delete']}`, onClick : async () => {buildEmployerPopUp()} }, 
        //                     { values : ['Your Employer', '456 Main St', 'Santa Clause', 'IN'], endIcon : `${icons['delete']}`,onClick : async () => {buildEmployerPopUp()} } ];


        const { getActiveEmployersResult: activeEmployers } = await OODAjax.getActiveEmployersAsync();

        var filteredActiveEmployers = activeEmployers.filter((x) => x.employerId != 0);

        let tableData = filteredActiveEmployers.map((employer) => ({
            values: [employer.employerName, employer.address1 + ' ' + employer.address2, employer.city, employer.state, employer.zipcode],
            attributes: [{ key: 'employerId', value: employer.employerId }],
            endIcon: ((employer.isEmployerIdReferenced == '0') && $.session.OODDelete) ? `${icons['delete']}` : ' ',
            id: employer.employerId,
            endIconCallback: e => {
                e.stopPropagation();
                // alert('Delete')
                try {
                    let tableRow = document.getElementById(employer.employerId)
                    deleteConfirmation(employer.employerId, tableRow);
                    return;
                } catch (err) {
                    console.error("error: ", err);
                }
            },
            onClick: (e) => {
                if ($.session.OODUpdate) {
                    OODAjax.getEmployer(employer.employerId, function (results) {
                        buildEmployerPopUp(results, 'update');
                    });
                }
            },

        }));


        const oTable = table.build(tableOptions);
        table.populate(oTable, tableData);

        return oTable;
    }


    // build Employer pop-up used for adding/editing Employer information
    async function buildEmployerPopUp(employerdata, postType) {

        if (employerdata && Object.keys(employerdata).length !== 0) {

            employerId = employerdata[0].employerId;
            employerName = employerdata[0].employerName;
            employeraddress1 = employerdata[0].address1;
            employeraddress2 = employerdata[0].address2;
            employercity = employerdata[0].city;
            employerstate = employerdata[0].state;
            employerzipcode = employerdata[0].zipcode;

        } else {

            employerId = '';
            employerName = '';
            employeraddress1 = '';
            employeraddress2 = '';
            employercity = '';
            employerstate = '';
            employerzipcode = '';

        }

        let editEmployerPopup = POPUP.build({
            header: "Edit this Employer",
            hideX: true,
            id: "editEmployerPopup"
        });

        employerInput = input.build({
            id: 'employerInput',
            label: 'Employer',
            // value: (employerdata) ? employerdata[0].employerName  : '',
            value: (employerName) ? employerName : '',
        });

        address1Input = input.build({
            label: 'Address',
            // value: (employerdata) ? employerdata[0].address1  : '',
            value: (employeraddress1) ? employeraddress1 : '',

        });

        address2Input = input.build({
            label: 'Address 2',
            //value: (employerdata) ? employerdata[0].address2  : '',
            value: (employeraddress2) ? employeraddress2 : '',

        });

        cityInput = input.build({
            label: 'City',
            // value: (employerdata) ? employerdata[0].city : '',
            value: (employercity) ? employercity : '',
        });

        stateInput = input.build({
            label: 'State',
            // value: (employerdata) ? employerdata[0].state  : '',
            value: (employerstate) ? employerstate : '',

        });

        zipcodeInput = input.build({
            label: 'Zip Code',
            // value: (employerdata) ? employerdata[0].state  : '',
            value: (employerzipcode) ? employerzipcode : '',

        });

        saveBtn = button.build({
            id: "addEmployerSaveBtn",
            text: "save",
            type: "contained",
            style: "secondary",
            classNames: 'disabled',
            //callback: () => POPUP.hide(editEmployerPopup)  
            callback: () => editEmployerPopupDoneBtn(postType)
        });
        //  this.saveButton = saveBtn;

        cancelBtn = button.build({
            id: "addEmployerCancelBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: () => POPUP.hide(editEmployerPopup)
        });

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(cancelBtn);
        //  editEmployerPopup.appendChild(servicesDropdown);
        editEmployerPopup.appendChild(employerInput);
        editEmployerPopup.appendChild(address1Input);
        editEmployerPopup.appendChild(address2Input);
        editEmployerPopup.appendChild(cityInput);
        editEmployerPopup.appendChild(stateInput);
        editEmployerPopup.appendChild(zipcodeInput);
        editEmployerPopup.appendChild(btnWrap);

        popUpEventHandlers();

        POPUP.show(editEmployerPopup);

        checkRequiredFields();

    }

    function popUpEventHandlers() {

        employerInput.addEventListener('input', event => {
            employerName = event.target.value.trim(); 
            checkRequiredFields();

        });

        address1Input.addEventListener('input', event => {
            employeraddress1 = event.target.value;

        });

        address2Input.addEventListener('input', event => {
            employeraddress2 = event.target.value;

        });

        cityInput.addEventListener('input', event => {
            employercity = event.target.value;

        });

        stateInput.addEventListener('input', event => {
            employerstate = event.target.value;

        });

        zipcodeInput.addEventListener('input', event => {
            employerzipcode = event.target.value;

        });

    }

    function checkRequiredFields() { 
        var employrInput = employerInput.querySelector('#employerInput');

        if (employrInput.value.trim() === '') { 
            employerInput.classList.add('error');
        } else {
            employerInput.classList.remove('error');
        }

        setBtnStatus();
    }

    function setBtnStatus() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            saveBtn.classList.add('disabled');
            return;
        } else {
            saveBtn.classList.remove('disabled');
        }

        if ($.session.OODInsert || $.session.OODUpdate) {
            saveBtn.classList.remove('disabled');
        } else {
            saveBtn.classList.add('disabled');
        }
    }

    // Event for Done BTN on the Edit Employer Popup Window
    async function editEmployerPopupDoneBtn(postType) {

        if (postType == 'insert') {

            const result = await OODAjax.insertEmployerAsync(employerName, employeraddress1, employeraddress2, employercity, employerstate, employerzipcode);
            const { insertEmployerResult } = result;
            let employerID = insertEmployerResult.employerId;

            if (employerID == '0') {
                warningPopup();
            } else {
                POPUP.hide(editEmployerPopup)
                successfulSave.show();
                setTimeout(function () {
                    successfulSave.hide();
                    OODEmployers.init();
                }, 2000);
            }

        } else {  //'update'
            POPUP.hide(editEmployerPopup)
            const result = await OODAjax.updateEmployerAsync(employerId, employerName, employeraddress1, employeraddress2, employercity, employerstate, employerzipcode);
            const { updateEmployerResult: { employerID } } = result;
            successfulSave.show();
            setTimeout(function () {
                successfulSave.hide();
                OODEmployers.init();
            }, 2000);
        }
    }

    function deleteConfirmation(employerId, tableRow) {
        var deletepopup = POPUP.build({
            id: 'deleteWarningPopup',
            classNames: 'warning',
        });
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var yesBtn = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
            icon: 'checkmark',
            callback: async function () {
                POPUP.hide(deletepopup);
                let result = await OODAjax.deleteEmployerAsync(employerId);
                if (result.deleteEmployerResult === "1") {
                    tableRow.remove();
                }
            },
        });
        var noBtn = button.build({
            text: 'No',
            style: 'secondary',
            type: 'contained',
            icon: 'close',
            callback: function () {
                POPUP.hide(deletepopup);
            },
        });
        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        var warningMessage = document.createElement('p');
        warningMessage.innerHTML = 'Are you sure you want to delete this employer?';
        deletepopup.appendChild(warningMessage);
        deletepopup.appendChild(btnWrap);
        POPUP.show(deletepopup);
    }

    function warningPopup() {
        var popup = POPUP.build({
            id: 'warningPopup',
            classNames: 'warning',
        });
        var OKBtn = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                overlay.show();
            },
        });
        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(OKBtn);

        var warningMessage = document.createElement('p');
        warningMessage.innerHTML = "This employer already exists.";
        popup.appendChild(warningMessage);
        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }

    return {
        init,

    };
})(); 