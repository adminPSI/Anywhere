class EditWorkflowStepComponent {

    constructor(step, callback){
        this.step = step;
        this.callback = callback;
        this.createPopup();
        this.populateDropdown();
        this.populateResponsiblePartyClassificationDropdown();
        this.cache = {};
    }

    editWorkflowStepFinished(){
        let {step, cache, callback} = this;
        POPUP.hide(wfStepPopup);
        return callback(step, cache);
    }

    editWorkflowStepCancelled(){
        POPUP.hide(wfStepPopup);
    }

    enableButton(button, enable){
        enable ? button.classList.remove("disabled") : button.classList.add("disabled");
    }

    containsErrors() {
        //MAT 2/12/2021 Seems to fix the Done button shading issue. Leaving old here in case other issues are caused
        //let errors = document.querySelectorAll(".error");
        let errors = wfStepPopup.querySelectorAll(".error");
        return errors.length !== 0;
    }

    createPopup() {
        let {description, dueDate, startDate, doneDate, responsiblePartyId, comments} = this.step;
        let wfStepPopup = POPUP.build({
            header: "Workflow Step",
            hideX: true,
            id: "wfStepPopup"
        });

        const raiseError = (element, errorMsg) => {
            if (!element.classList.contains("error")){
                element.classList.add("error");
                const event = new CustomEvent("errorRaised", { bubbles: true, detail: { errorMsg }});
                element.dispatchEvent(event);
            }
        }

        const clearError = (element) => {
            if (element.classList.contains("error")){
                element.classList.remove("error");
                const event = new CustomEvent("errorCleared", { bubbles: true });
                element.dispatchEvent(event);
            }
        }

        const isMaxLengthExceeded = (maxChars, length) => {
            return (length > maxChars);
        }

        const isEmpty = (inputValue) => {
            return inputValue === "" || inputValue === undefined || inputValue === null;
        }

        const descriptionCharLimit = 100;

        let descriptionTextInput = input.build({
            id: "step-description",
            label: "Description",
            type: "textarea",
            style: "secondary",
            value: description,
            initialLength: description? description.length : 0,
            charLimit: descriptionCharLimit
        });

        descriptionTextInput.addEventListener("change", (e)=> {
            this.step.description = e.target.value;
        });

        descriptionTextInput.addEventListener("keyup", event => {
            return validateDescription(event.target.value);
        });

        descriptionTextInput.addEventListener("paste", event => {
            let combinedText = event.target.value + event.clipboardData.getData("text/plain");
            return validateDescription(combinedText);
        });
        if (this.step.allowStepEdit === 'False') {
            descriptionTextInput.classList.add("disabled");
        }

        const validateDescription = (inputValue) => {
            if (isEmpty(inputValue)) {
                raiseError(descriptionTextInput, "step description is required");
                return false;
            } else {
                if (isMaxLengthExceeded(descriptionCharLimit, inputValue.length)) {
                    raiseError(descriptionTextInput, "step description cannot exceed " + descriptionCharLimit + " characters");
                    return false;
                }
            }
            clearError(descriptionTextInput);
            return true;
        };

        let dueDateInput = input.build({
            label: 'Due Date',
            type: 'date',
            value: moment(dueDate, "M/D/YYYY").format("YYYY-MM-DD")
        });

        dueDateInput.addEventListener("change", (e)=> {
            if (e.target.value === ""){
                this.step.dueDate = null;
            } else {
                this.step.dueDate = moment(e.target.value, "YYYY-MM-DD").format("M/D/YYYY");
                let changed = (dueDate === this.step.dueDate) ? false : true;
                let wfeventid = (dueDate === null || dueDate === "") ? 4 : 5; // setting due date is workflow eventid = 4, updating due date is workflow eventid = 5
                this.cache["stepDueDate"] = {original : dueDate, modified : this.step.dueDate, isChanged : changed, eventTypeId : this.step.stepId, eventType : "step", eventId : wfeventid};
            }

        });

        let startDateInput = input.build({
            label: 'Start Date',
            type: 'date',
            value: moment(startDate, "M/D/YYYY").format("YYYY-MM-DD"),
            attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
        });

        startDateInput.addEventListener("change", (e)=> {
            if (e.target.value === ""){
                this.step.startDate = null;
            } else {
                this.step.startDate = moment(e.target.value, "YYYY-MM-DD").format("M/D/YYYY");
                let changed = (startDate === this.step.startDate) ? false : true;
                let wfeventid = (startDate === null || startDate === "") ? 2 : 3; // setting start date is workflow eventid = 2, updating start date is workflow eventid = 3
                this.cache["stepStartDate"] = {original : startDate, modified : this.step.startDate, isChanged : changed, eventTypeId : this.step.stepId, eventType : "step", eventId : wfeventid};
            }
        });

        let doneDateInput = input.build({
            label: 'Done Date',
            type: 'date',
            value: moment(doneDate, "M/D/YYYY").format("YYYY-MM-DD"),
            attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
        });

        doneDateInput.addEventListener("change", (e)=> {
            if (e.target.value === ""){
                this.step.doneDate = null;
            } else {
                this.step.doneDate = moment(e.target.value, "YYYY-MM-DD").format("M/D/YYYY");
                let changed = (doneDate === this.step.doneDate) ? false : true;
                let wfeventid = (doneDate === null || doneDate === "") ? 6 : 7; // setting done date is workflow eventid = 6, updating done date is workflow eventid = 7
                this.cache["stepDoneDate"] = {original : doneDate, modified : this.step.doneDate, isChanged : changed, eventTypeId : this.step.stepId, eventType : "step", eventId : wfeventid};
            }
        });

        let responsiblePartyClassificationDropdown = dropdown.build({
            label: "Responsible Party Classification",
            dropdownId: "responsiblePartyClassificationDropdown",
        });

        responsiblePartyClassificationDropdown.addEventListener("change", (e) => {
            let typeID = e.target.value;
            this.poplateResponsibleDropDownbyTypeID(typeID)
        });

        let responsibleDropdown = dropdown.build({
            label: "Responsible",
            dropdownId: "responsibleDropdown",
        });

        responsibleDropdown.addEventListener("change", (e)=> {
            this.step.responsiblePartyId = e.target.value;
            // responsiblePartyId
            let changed = (responsiblePartyId === this.step.responsiblePartyId) ? false : true;
            let wfeventid = (responsiblePartyId === null  || responsiblePartyId === "") ? 8 : 9; // setting responsiblePartyId is workflow eventid = 8, updating responsiblePartyId is workflow eventid = 9
            this.cache["stepResponsiblePartyId"] = {original : responsiblePartyId, modified : this.step.responsiblePartyId, isChanged : changed, eventTypeId : this.step.stepId, eventType : "step", eventId : wfeventid};
        });

        let commentsTextInput = input.build({
            label: "Comments",
            type: "textarea",
            style: "secondary",
            value: comments
        });

        commentsTextInput.addEventListener("change", (e)=> {
            this.step.comments = e.target.value;
            let changed = (comments === this.step.comments) ? false : true;
            this.cache["stepComments"] = {original : comments, modified : this.step.comments, isChanged : changed, eventTypeId : this.step.stepId, eventType : "step", eventId : 11};

        });

        let doneBtn = button.build({
            id: "wfStepDoneBtn",
            text: "done",
            type: "contained",
            style: "secondary",
            callback: this.editWorkflowStepFinished.bind(this)
        });
        this.doneButton = doneBtn;

        let cancelBtn = button.build({
            id: "wfStepCancelBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: this.editWorkflowStepCancelled.bind(this)
        });

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(doneBtn);
        btnWrap.appendChild(cancelBtn);
        wfStepPopup.appendChild(descriptionTextInput);
        wfStepPopup.appendChild(dueDateInput);
        wfStepPopup.appendChild(startDateInput);
        wfStepPopup.appendChild(doneDateInput);
        wfStepPopup.appendChild(responsiblePartyClassificationDropdown);
        wfStepPopup.appendChild(responsibleDropdown);
        wfStepPopup.appendChild(commentsTextInput);
        wfStepPopup.appendChild(btnWrap);

        wfStepPopup.addEventListener("errorRaised", (event) => {

            this.enableButton(doneBtn, false);
        });

        wfStepPopup.addEventListener("errorCleared", () => {
            this.enableButton(doneBtn, !this.containsErrors());
        });

        POPUP.show(wfStepPopup);

        validateDescription(description);
    }

    async populateDropdown() {
        let responsibleParty = await WorkflowViewerAjax.getResponsiblePartyIdforThisEditStep({
            stepId: this.step.stepId,
        });

        let {responsiblePartyId, people} = this.step;  
        let data = this.step.people.map((person) => ({
            id: person.peopleId,
            value: person.peopleId,
            text: person.lastName + ", " + person.firstName
        }));
        data.unshift({ id: null, value: '', text: '' }); //ADD Blank value  
        if (responsibleParty.length > 0) {
            dropdown.populate("responsibleDropdown", data, responsibleParty[0].responsiblePartyId);
        } else {
            dropdown.populate("responsibleDropdown", data, '');
        }
    }

    async populateResponsiblePartyClassificationDropdown() {
        let responsiblePartyClassification = await WorkflowViewerAjax.getResponsiblePartyClassification();
        let responsiblePartyClassificationData = responsiblePartyClassification.map((responsibleParty) => ({
            id: responsibleParty.typeID,
            value: responsibleParty.typeID,
            text: responsibleParty.description
        }));
        responsiblePartyClassificationData.unshift({ id: null, value: '0', text: 'ALL' });
        dropdown.populate("responsiblePartyClassificationDropdown", responsiblePartyClassificationData, '');
    }

    async poplateResponsibleDropDownbyTypeID(typeID) {
        const { 
            getPeopleNamesResult: people,
        } = await WorkflowViewerAjax.getPeopleNamesAsync('0', typeID);  
        let data = people.map((person) => ({
            id: person.peopleId,
            value: person.peopleId,
            text: person.lastName + ", " + person.firstName
        }));
        data.unshift({ id: null, value: '', text: '' }); //ADD Blank value  
        dropdown.populate("responsibleDropdown", data, '');
    }


}