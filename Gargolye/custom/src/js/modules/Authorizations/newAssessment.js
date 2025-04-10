const NewAssessment = (() => {
    // dropdown and inputs declaration
    let startDateInput;
    let endDateInput;
    let methodologyDropdown;
    let scoreDropdown;
    let behaviorModifierDropdown;
    let medicalModifierDropdown;
    let DCModifierDropdown;
    let complexCareModifierDropdown;
    let priorAuthAppliedDateInput;
    let priorAuthReceivedDateInput;
    let priorAuthAmountInput;
    let fundingRangeLowInput;
    let fundingRangeMaxInput;
    let SAVE_BTN;
    let NEW_CANCEL_BTN;
    let SAVE_NEW_BTN;

    let BtnName;
    let pageName;
    let regId;

    let startDate;
    let endDate;
    let methodology;
    let score;
    let behaviorModifier;
    let medicalModifier;
    let DCModifier;
    let complexCareModifier;
    let priorAuthReceivedDate;
    let priorAuthAppliedDate;
    let priorAuthAmount;
    let selectedConsumer;
    let isChangedValue = false;
    let lastUpdateDate;
    let highFundingRange;
    let lowFundingRange;
    let messagetext;
    let messageErrortext;


    async function init(selectedConsumers, registerId = undefined, lastUpdate = '') {
        selectedConsumer = selectedConsumers;
        await buildNewAssessmentForm(registerId, lastUpdate);
        if (registerId)
            await findFundingRange();
    }

    async function buildNewAssessmentForm(registerId, lastUpdate) {
        if (registerId) {
            BtnName = 'UPDATE';
            pageName = 'Update';
            regId = registerId;
            lastUpdateDate = lastUpdate;
            const result = await authorizationsAjax.getAssessmentEntriesByIDAsync(registerId, lastUpdate);
            const { getAssessmentEntriesByIdResult } = result;

            startDate = getAssessmentEntriesByIdResult[0].startDate != '' ? moment(getAssessmentEntriesByIdResult[0].startDate).format('YYYY-MM-DD') : '';
            endDate = getAssessmentEntriesByIdResult[0].endDate != '' ? moment(getAssessmentEntriesByIdResult[0].endDate).format('YYYY-MM-DD') : '';
            methodology = getAssessmentEntriesByIdResult[0].methodology;
            score = getAssessmentEntriesByIdResult[0].score;
            behaviorModifier = getAssessmentEntriesByIdResult[0].behaviorMod;
            medicalModifier = getAssessmentEntriesByIdResult[0].medicalMod;
            DCModifier = getAssessmentEntriesByIdResult[0].DCMod;
            complexCareModifier = getAssessmentEntriesByIdResult[0].CCMod;
            priorAuthReceivedDate = getAssessmentEntriesByIdResult[0].priorAuthReceived != '' ? moment(getAssessmentEntriesByIdResult[0].priorAuthReceived).format('YYYY-MM-DD') : '';
            priorAuthAppliedDate = getAssessmentEntriesByIdResult[0].priorAuthApplied != '' ? moment(getAssessmentEntriesByIdResult[0].priorAuthApplied).format('YYYY-MM-DD') : '';
            priorAuthAmount = getAssessmentEntriesByIdResult[0].priorAuthAmount;
            isChangedValue = false;
        }
        else {
            regId = selectedConsumer.id;
            lastUpdateDate = '';
            BtnName = 'SAVE';
            pageName = 'New';
            startDate = '';
            endDate = '';
            methodology = '';
            score = '';
            behaviorModifier = '';
            medicalModifier = '';
            DCModifier = '';
            complexCareModifier = '';
            priorAuthReceivedDate = '';
            priorAuthAppliedDate = '';
            priorAuthAmount = '';
            highFundingRange = '';
            lowFundingRange = '';
        }

        DOM.clearActionCenter();

        const consumerCard = buildConsumerCard();

        startDateInput = input.build({
            id: 'startDateInput',
            type: 'date',
            label: 'Start Date',
            style: 'secondary',
            value: (startDate) ? startDate : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        endDateInput = input.build({
            id: 'endDateInput',
            type: 'date',
            label: 'End Date',
            style: 'secondary',
            value: (endDate) ? endDate : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        methodologyDropdown = dropdown.build({
            id: 'methodologyDropdown',
            label: "Methodology",
            dropdownId: "methodologyDropdown",
            value: (methodology) ? methodology : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        scoreDropdown = dropdown.build({
            id: 'scoreDropdown',
            label: "Score",
            dropdownId: "scoreDropdown",
            value: (score) ? score : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });
        behaviorModifierDropdown = dropdown.build({
            id: 'behaviorModifierDropdown',
            label: "Behavior Modifier",
            dropdownId: "behaviorModifierDropdown",
            value: (behaviorModifier) ? behaviorModifier : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });
        medicalModifierDropdown = dropdown.build({
            id: 'medicalModifierDropdown',
            label: "Medical Modifier",
            dropdownId: "medicalModifierDropdown",
            value: (medicalModifier) ? medicalModifier : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });
        DCModifierDropdown = dropdown.build({
            id: 'DCModifierDropdown',
            label: "DC Modifier",
            dropdownId: "DCModifierDropdown",
            value: (DCModifier) ? DCModifier : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });
        complexCareModifierDropdown = dropdown.build({
            id: 'complexCareModifierDropdown',
            label: "Complex Care Modifier",
            dropdownId: "complexCareModifierDropdown",
            value: (complexCareModifier) ? complexCareModifier : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        priorAuthAppliedDateInput = input.build({
            id: 'priorAuthAppliedDateInput',
            type: 'date',
            label: 'Prior Auth Applied Date',
            style: 'secondary',
            value: (priorAuthAppliedDate) ? priorAuthAppliedDate : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        priorAuthReceivedDateInput = input.build({
            id: 'priorAuthReceivedDateInput',
            type: 'date',
            label: 'Prior Auth Received Date',
            style: 'secondary',
            value: (priorAuthReceivedDate) ? priorAuthReceivedDate : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        priorAuthAmountInput = input.build({
            id: 'priorAuthAmountInput',
            type: 'number',
            label: 'Prior Auth Amount',
            style: 'secondary',
            value: (priorAuthAmount) ? priorAuthAmount : '',
            readonly: BtnName == 'UPDATE' && !$.session.updateAssessmentHistory,
        });

        fundingRangeLowInput = input.build({
            id: 'fundingRangeLowInput',
            type: 'text',
            label: 'Funding Range Low',
            style: 'secondary',
            readonly: true,
        });

        fundingRangeMaxInput = input.build({
            id: 'fundingRangeMaxInput',
            type: 'text',
            label: 'Funding Range Max',
            style: 'secondary',
            readonly: true,
        });

        SAVE_BTN = button.build({
            text: BtnName,
            style: 'secondary',
            type: 'contained',
            icon: 'save',
        });
        NEW_CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            icon: 'close',
            callback: assessmentHistory.loadAssessmentHistoryLanding
        });

        SAVE_NEW_BTN = button.build({
            text: 'SAVE & NEW',
            style: 'secondary',
            type: 'outlined',
            icon: 'add',
        });


        const column1 = document.createElement('div')
        column1.classList.add('col-1')

        // New Assessment Card//
        SAVE_BTN.style.width = '49%';
        SAVE_NEW_BTN.style.width = '49%';
        NEW_CANCEL_BTN.style.width = '100%';

        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">${pageName} Assessment</div>`;
        addNewCard.appendChild(addNewCardBody)

        var Wrap1 = document.createElement('div');
        Wrap1.classList.add('assessmentPageWrap');
        Wrap1.appendChild(startDateInput);
        Wrap1.appendChild(endDateInput);

        var Wrap2 = document.createElement('div');
        Wrap2.classList.add('assessmentPageWrap');
        Wrap2.appendChild(methodologyDropdown);
        Wrap2.appendChild(scoreDropdown);

        var Wrap3 = document.createElement('div');
        Wrap3.classList.add('assessmentPageWrap');
        Wrap3.appendChild(behaviorModifierDropdown);
        Wrap3.appendChild(medicalModifierDropdown);

        var Wrap4 = document.createElement('div');
        Wrap4.classList.add('assessmentPageWrap');
        Wrap4.appendChild(DCModifierDropdown);
        Wrap4.appendChild(complexCareModifierDropdown);

        var Wrap5 = document.createElement('div');
        Wrap5.classList.add('assessmentPageWrap');
        Wrap5.appendChild(priorAuthAppliedDateInput);
        Wrap5.appendChild(priorAuthReceivedDateInput);

        var Wrapbtn = document.createElement('div');
        Wrapbtn.classList.add('assessmentPageWrap');
        if (BtnName == 'UPDATE' && $.session.updateAssessmentHistory)
            Wrapbtn.appendChild(SAVE_BTN);
        else if (BtnName == 'SAVE')
            Wrapbtn.appendChild(SAVE_BTN);
        if (registerId) {
            NEW_CANCEL_BTN.style.width = '49%';
            Wrapbtn.appendChild(NEW_CANCEL_BTN);
        } else {
            Wrapbtn.appendChild(SAVE_NEW_BTN);
        }


        var Wrap6 = document.createElement('div');
        Wrap6.classList.add('assessmentPageWrap');
        Wrap6.appendChild(priorAuthAmountInput);
        Wrap6.appendChild(Wrapbtn);


        var Wrap7 = document.createElement('div');
        Wrap7.classList.add('assessmentPageWrap');
        Wrap7.appendChild(fundingRangeLowInput);
        Wrap7.appendChild(fundingRangeMaxInput);

        var Wrap8 = document.createElement('div');
        Wrap8.classList.add('assessmentPageWrap');
        if (!registerId) {
            Wrap8.appendChild(NEW_CANCEL_BTN);
        }

        var Wrap9 = document.createElement('div');
        Wrap9.classList.add('assessmentPageWrap');
        Wrap9.appendChild(Wrap7);
        Wrap9.appendChild(Wrap8);


        column1.appendChild(addNewCard)
        addNewCardBody.appendChild(Wrap1);
        addNewCardBody.appendChild(Wrap2);
        addNewCardBody.appendChild(Wrap3);
        addNewCardBody.appendChild(Wrap4);
        addNewCardBody.appendChild(Wrap5);
        addNewCardBody.appendChild(Wrap6);
        var fundingRangeMaxErrorMsg = document.createElement('div');
        fundingRangeMaxErrorMsg.innerHTML = `<p id="fundingRangeMaxErrorMsg" class="confirmMessage password-warning errorStyle"></p>`;
        addNewCardBody.appendChild(fundingRangeMaxErrorMsg);

        addNewCardBody.appendChild(Wrap9);
        var fundingRangeErrorMsg = document.createElement('div');
        fundingRangeErrorMsg.innerHTML = `<p id="fundingRangeErrorMsg" class="confirmMessage password-warning errorStyle"></p>`;
        addNewCardBody.appendChild(fundingRangeErrorMsg);

        DOM.ACTIONCENTER.appendChild(consumerCard);
        DOM.ACTIONCENTER.appendChild(column1);

        eventListeners();
        populateAssessmentsDropdown();
        populateAssessmentsScoreDropdown(methodology);
        checkRequiredFieldsOfNewAssessment();
        enableDisabledInputs();
    }

    function enableDisabledInputs() {
        if (priorAuthAppliedDate == '') {
            priorAuthReceivedDateInput.querySelector('.input-field__input').setAttribute('readonly', true);
            priorAuthReceivedDateInput.classList.add('disabled');
        }
        else {
            priorAuthReceivedDateInput.querySelector('.input-field__input').removeAttribute('readonly');
            priorAuthReceivedDateInput.classList.remove('disabled');
        }

        if (priorAuthReceivedDate == '') {
            priorAuthAmountInput.querySelector('.input-field__input').setAttribute('readonly', true);
            priorAuthAmountInput.classList.add('disabled');
        }
        else {
            priorAuthAmountInput.querySelector('.input-field__input').removeAttribute('readonly');
            priorAuthAmountInput.classList.remove('disabled');
        }
    }

    async function findFundingRange() {
        const fundingRangeResult = await authorizationsAjax.getFundingRangeAsync(selectedConsumer.id, methodology, score, startDate);
        const { getFundingRangeResult } = fundingRangeResult;

        messagetext = document.getElementById('fundingRangeErrorMsg');
        messagetext.innerHTML = ``;

        if (getFundingRangeResult.length > 0) {
            highFundingRange = getFundingRangeResult[0].fundingRangeHigh;
            lowFundingRange = getFundingRangeResult[0].fundingRangeLow;
            document.getElementById('fundingRangeMaxInput').value = highFundingRange;
            document.getElementById('fundingRangeLowInput').value = lowFundingRange;
            messagetext.classList.remove('error');
        }
        else {
            highFundingRange = '';
            lowFundingRange = '';
            document.getElementById('fundingRangeMaxInput').value = '';
            document.getElementById('fundingRangeLowInput').value = '';
            messagetext.innerHTML = 'Funding Range Cannot be Found';
            messagetext.style.fontSize = '13px';
            messagetext.classList.add('error');
            messagetext.classList.add('password-error');
        }
        fundingRangeMaxValueErrorMsg();
        checkRequiredFieldsOfNewAssessment();
    }

    function buildConsumerCard() {
        selectedConsumer.card.classList.remove('highlighted');

        const wrap = document.createElement('div');
        wrap.classList.add('planConsumerCard');

        wrap.appendChild(selectedConsumer.card);

        return wrap;
    }

    function checkRequiredFieldsOfNewAssessment() {

        var dateStart = startDateInput.querySelector('#startDateInput');
        var dateEnd = endDateInput.querySelector('#endDateInput');
        var method = methodologyDropdown.querySelector('#methodologyDropdown');
        var scoreDrop = scoreDropdown.querySelector('#scoreDropdown');
        var behaviorMod = behaviorModifierDropdown.querySelector('#behaviorModifierDropdown');
        var medicalMod = medicalModifierDropdown.querySelector('#medicalModifierDropdown');
        var DCMod = DCModifierDropdown.querySelector('#DCModifierDropdown');
        var complexCareMod = complexCareModifierDropdown.querySelector('#complexCareModifierDropdown');
        var priorAuthRec = priorAuthReceivedDateInput.querySelector('#priorAuthReceivedDateInput');
        var priorAuthApp = priorAuthAppliedDateInput.querySelector('#priorAuthAppliedDateInput');

        if (dateStart.value === '') {
            startDateInput.classList.add('error');
        } else {
            startDateInput.classList.remove('error');
        }

        if (dateEnd.value === '' || dateStart.value > dateEnd.value) {
            endDateInput.classList.add('error');
        } else {
            endDateInput.classList.remove('error');
        }

        if (method.value === '') {
            methodologyDropdown.classList.add('error');
        } else {
            methodologyDropdown.classList.remove('error');
        }

        if (scoreDrop.value === '') {
            scoreDropdown.classList.add('error');
        } else {
            scoreDropdown.classList.remove('error');
        }

        if (behaviorMod.value === '') {
            behaviorModifierDropdown.classList.add('error');
        } else {
            behaviorModifierDropdown.classList.remove('error');
        }

        if (medicalMod.value === '') {
            medicalModifierDropdown.classList.add('error');
        } else {
            medicalModifierDropdown.classList.remove('error');
        }

        if (DCMod.value === '') {
            DCModifierDropdown.classList.add('error');
        } else {
            DCModifierDropdown.classList.remove('error');
        }

        if (complexCareMod.value === '') {
            complexCareModifierDropdown.classList.add('error');
        } else {
            complexCareModifierDropdown.classList.remove('error');
        }
  
        if ((priorAuthRec.value != '' && priorAuthRec.value > dateEnd.value) || (priorAuthRec.value != '' && priorAuthApp.value != '' && priorAuthApp.value > priorAuthRec.value) ){ 
            priorAuthReceivedDateInput.classList.add('error');
        } else {
            priorAuthReceivedDateInput.classList.remove('error');
        } 

        setBtnStatusOfNewEntry();
    }

    function setBtnStatusOfNewEntry() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            SAVE_BTN.classList.add('disabled');
            SAVE_NEW_BTN.classList.add('disabled');
            return;
        } else {
            if (isChangedValue) {
                SAVE_BTN.classList.remove('disabled');
                SAVE_NEW_BTN.classList.remove('disabled');
            }
            else {
                SAVE_BTN.classList.add('disabled');
                SAVE_NEW_BTN.classList.add('disabled');
            }
        }
    }

    function eventListeners() {
        SAVE_BTN.addEventListener('click', event => {
            if (!SAVE_BTN.classList.contains('disabled')) {
                saveNewAssessment(true);
            }
        });

        SAVE_NEW_BTN.addEventListener('click', event => {
            if (!SAVE_NEW_BTN.classList.contains('disabled')) {
                saveNewAssessment(false);
            }
        });

        startDateInput.addEventListener('input', event => {
            startDate = event.target.value;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
        });
        endDateInput.addEventListener('input', event => {
            endDate = event.target.value;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
        });

        methodologyDropdown.addEventListener('change', event => {
            methodology = event.target.options[event.target.selectedIndex].id;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
            score = '';
            populateAssessmentsScoreDropdown(methodology);
        });

        scoreDropdown.addEventListener('change', event => {
            score = event.target.options[event.target.selectedIndex].value;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
            findFundingRange();
        });

        behaviorModifierDropdown.addEventListener('change', event => {
            behaviorModifier = event.target.options[event.target.selectedIndex].id;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
        });

        medicalModifierDropdown.addEventListener('change', event => {
            medicalModifier = event.target.options[event.target.selectedIndex].id;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
        });

        DCModifierDropdown.addEventListener('change', event => {
            DCModifier = event.target.options[event.target.selectedIndex].id;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
        });

        complexCareModifierDropdown.addEventListener('change', event => {
            complexCareModifier = event.target.options[event.target.selectedIndex].id;
            isChangedValue = true;
            checkRequiredFieldsOfNewAssessment();
        });

        priorAuthAppliedDateInput.addEventListener('input', event => {
            priorAuthAppliedDate = event.target.value;
            isChangedValue = true;
            if (priorAuthAppliedDate == '') {
                document.getElementById('priorAuthReceivedDateInput').value = '';
                priorAuthReceivedDate = '';
                document.getElementById('priorAuthAmountInput').value = '';
                priorAuthAmount = '';
            }
            enableDisabledInputs();
            checkRequiredFieldsOfNewAssessment();
        });
        priorAuthReceivedDateInput.addEventListener('input', event => {
            priorAuthReceivedDate = event.target.value;
            isChangedValue = true;
            if (priorAuthReceivedDate == '') {
                document.getElementById('priorAuthAmountInput').value = '';
                priorAuthAmount = '';
            }
            enableDisabledInputs();
            checkRequiredFieldsOfNewAssessment();
        });

        priorAuthAmountInput.addEventListener('input', event => {
            priorAuthAmount = event.target.value;
            isChangedValue = true;
            fundingRangeMaxValueErrorMsg();
            checkRequiredFieldsOfNewAssessment();
        });
    }

    function fundingRangeMaxValueErrorMsg() {
        messageErrortext = document.getElementById('fundingRangeMaxErrorMsg');
        messageErrortext.innerHTML = ``;
        if (priorAuthAmount != '' && highFundingRange != '' && Number(priorAuthAmount) < Number(highFundingRange)) {
            messageErrortext.innerHTML = 'Amount is lower than Funding Range Max';
            messageErrortext.style.fontSize = '13px';
            messageErrortext.classList.add('password-error');
        }
    }

    async function saveNewAssessment(IsSave) {
        const result = await authorizationsAjax.insertUpdateAssessmentInfo({
            regId: regId,
            startDate: startDate,
            endDate: endDate,
            methodology: methodology,
            score: score,
            behaviorModifier: behaviorModifier,
            medicalModifier: medicalModifier,
            DCModifier: DCModifier,
            complexCareModifier: complexCareModifier,
            priorAuthReceivedDate: priorAuthReceivedDate,
            priorAuthAppliedDate: priorAuthAppliedDate,
            priorAuthAmount: priorAuthAmount,
            userId: $.session.UserId,
            lastUpdateDate: lastUpdateDate
        });

        const { insertUpdateAssessmentInfoResult } = result;
        if (insertUpdateAssessmentInfoResult[0].isExistingRecord == '-1')
            overlapConfirmPopup();
        else {
            if (IsSave)
                assessmentHistory.loadAssessmentHistoryLanding();
            else
                NewAssessment.buildNewAssessmentForm(undefined, '');
        }

    }

    // Populate the DDL 
    async function populateAssessmentsDropdown() {
        const dropDownData = ([
            { id: 'N', value: 'N', text: 'No' },
            { id: 'Y', value: 'Y', text: 'Yes' },
        ]);
        dropDownData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("behaviorModifierDropdown", dropDownData, behaviorModifier);
        dropdown.populate("medicalModifierDropdown", dropDownData, medicalModifier);
        dropdown.populate("DCModifierDropdown", dropDownData, DCModifier);
        dropdown.populate("complexCareModifierDropdown", dropDownData, complexCareModifier);


        const methodologyDropDownData = ([
            { id: 'D', value: 'D', text: 'Day Services' },
            { id: 'L', value: 'L', text: 'Level One Waiver' },
            { id: 'S', value: 'S', text: 'Self Waiver' },
            { id: 'W', value: 'W', text: 'Waiver Reimbursement' },
        ]);
        methodologyDropDownData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("methodologyDropdown", methodologyDropDownData, methodology);

        checkRequiredFieldsOfNewAssessment();
    }

    async function populateAssessmentsScoreDropdown(methodology) {
        let scoreDropDownData;
        if (methodology == 'D') {
            scoreDropDownData = ([
                { id: 'D', value: '1', text: 'A' },
                { id: 'D', value: '2', text: 'A1' },
                { id: 'D', value: '3', text: 'B' },
                { id: 'D', value: '4', text: 'C' },
            ]);
        } else if (methodology == 'L' || methodology == 'S') {
            scoreDropDownData = ([
                { id: 'L', value: '2', text: 'Adult' },
                { id: 'L', value: '1', text: 'Child' },
            ]);
        } else if (methodology == 'W') {
            scoreDropDownData = ([
                { id: 'W', value: '0', text: '0' },
                { id: 'W', value: '1', text: '1' },
                { id: 'W', value: '2', text: '2' },
                { id: 'W', value: '3', text: '3' },
                { id: 'W', value: '4', text: '4' },
                { id: 'W', value: '5', text: '5' },
                { id: 'W', value: '6', text: '6' },
                { id: 'W', value: '7', text: '7' },
                { id: 'W', value: '8', text: '8' },
                { id: 'W', value: '9', text: '9' },
            ]);
        }
        else {
            scoreDropDownData = ([]);
        }
        scoreDropDownData.unshift({ id: null, value: '', text: '' });
        dropdown.populate("scoreDropdown", scoreDropDownData, score);

        checkRequiredFieldsOfNewAssessment();
    }

    function overlapConfirmPopup() {
        const confirmPopup = POPUP.build({
            hideX: true,
            classNames: ['warning', 'popupSize'],
        });

        YES_BTN = button.build({
            text: 'OK',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(confirmPopup);
            },
        });


        const message = document.createElement('p');

        message.innerText = 'This assessment overlaps with an existing assessment.';
        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        YES_BTN.style.width = '100%';
        confirmPopup.appendChild(message);
        confirmPopup.appendChild(YES_BTN);
        YES_BTN.focus();
        POPUP.show(confirmPopup);
    }

    return {
        init,
        buildNewAssessmentForm,
    };
})(); 