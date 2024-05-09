class WorkflowStepComponent {
    constructor({stepId, groupId, stepOrder, isChecklist, allowStepEdit, description, dueDate, startDate, doneDate, responsiblePartyId, responsiblePartytype, comments, isApplicable, documents}, people, responsiblePeople) {
        this.stepId = stepId;
        this.groupId = groupId;
        this.stepOrder = stepOrder;
        this.isChecklist = isChecklist; 
        this.allowStepEdit = allowStepEdit;
        this.description = description;
        this.dueDate = dueDate? dueDate.split(" ")[0] : "";
        this.startDate = startDate? startDate.split(" ")[0] : "";
        this.doneDate = doneDate? doneDate.split(" ")[0] : "";
        this.responsiblePartyId = responsiblePartyId;
        this.responsiblePartytype = responsiblePartytype;
        this.comments = comments;
        this.isApplicable = isApplicable;
        this.documents = documents;
        this.people = people;
        this.isExpanded = false;
        this.responsiblePeople = responsiblePeople;
    }

    getFirstAndLastName(peopleId, people){
        const person = people.find((p) => {
            return (p.peopleId === peopleId);
        });
        return (person) ? (person.firstName + " " + person.lastName) : "";
    }

    isAttachmentValid(target) {
        const fileType = target.files[0].type;
        const reFileTypeTest = new RegExp('(audio\/)|(video\/)')
        if (reFileTypeTest.test(fileType)) {
            alert('Anywhere currently does not accept audio or video files')
            target.value = '';
        }
        return target.value !== '';
    }

    addStepDocument(inputElement) {

        const attachmentObj = {};

        const attPromise = new Promise(resolve => {
            const attachmentFile = inputElement.files.item(0);
            const attachmentName = attachmentFile.name;
            const attachmentType = attachmentFile.name.split(".").pop();
            attachmentObj.description = attachmentName;
            attachmentObj.type = attachmentType;
            // new Response(file) was added for Safari compatibility
            new Response(attachmentFile).arrayBuffer().then(res => {
                attachmentObj.arrayBuffer = res;
                resolve();
            });
        })

        attPromise.then(async () => {
            try {
                const docOrder = this.documents.length + 1;
                let documentEdited = "0"; // documentEdited = F
                const result = await WorkflowViewerAjax.insertStepDocumentAsync(this.stepId, docOrder, attachmentObj.description, attachmentObj.type, attachmentObj.arrayBuffer, documentEdited);
                const {insertWorkflowStepDocumentResult: {attachmentId, documentId}} = result;

                const newDocObj = {
                    documentId: documentId,
                    stepId: this.stepId,
                    docOrder: `"${docOrder}"`,
                    description: attachmentObj.description,
                    attachmentId: attachmentId,
                    documentEdited: documentEdited,
                    attachmentType: attachmentObj.type,
                }

                this.documents = [...this.documents].concat(newDocObj);

                const newStepDocComponent = new WorkflowDocumentComponent(newDocObj).render();

                // Get the List Element on page so we can add new document element                
                const stepsContainer = document.querySelector(`.wf-steps-container[data-id='${this.stepId}']`);
                const documentsList = stepsContainer.querySelector(".wf-documents-list");

                documentsList.appendChild(newStepDocComponent);

                let cache = {eventTypeId : this.stepId, eventType : "step", eventId : 10};
                let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache);
                let stepActionsCompleted = JSON.parse(processEvent.processWorkflowStepEventResult);

            } catch (error) {
                throw (error);
            }
        });
    }

    render(){        
        let {
            description,
            stepId,
            dueDate,
            startDate,
            doneDate,
            responsiblePartyId,
            responsiblePartytype,
            comments,
            events,
            documents,
            isExpanded,
            people,
            getFirstAndLastName,
            responsiblePeople 
        } = this;


        let stepsGrid = document.createElement("div");
        stepsGrid.classList.add("step-grid");

        let stepsGridColumn1 =  document.createElement("div");
        stepsGridColumn1.classList.add("step-grid-column-1");

        let stepExpandButton = document.createElement("button");
        stepExpandButton.classList.add("expand-button");
        stepExpandButton.innerHTML = icons['keyArrowRight'];
            if (this.isExpanded){
            stepExpandButton.classList.add("expanded");
        }
        stepExpandButton.addEventListener("click", (e) => {
            this.isExpanded = !this.isExpanded;
        });

        stepsGridColumn1.appendChild(stepExpandButton);

        let stepsGridColumn2 =  document.createElement("div");
        stepsGridColumn2.classList.add("step-grid-column-2");

        let stepSummaryContainer = document.createElement("div");
        stepSummaryContainer.classList.add("step-summary-container");

        let stepDescriptionContainer = document.createElement("div");
        stepDescriptionContainer.classList.add("step-description-container");

        let stepCompleteCheckbox = input.buildCheckbox({
            //text: description,
            isChecked: doneDate
        });
        stepCompleteCheckbox.classList.add("step-checkbox-container");

        stepDescriptionContainer.appendChild(stepCompleteCheckbox);

        let stepDescription = document.createElement("div");
        stepDescription.classList.add("step-description");
        stepDescription.innerHTML = `<h4>${description}</h4>`;
        stepDescriptionContainer.appendChild(stepDescription);
        stepSummaryContainer.appendChild(stepDescriptionContainer);

        let summaryComponent;

        summaryComponent = document.createElement("div");
        summaryComponent.classList.add("wf-column", "step-summary-component");
        summaryComponent.innerHTML = `
                    <h4>Due</h4>
                    <p class="wf-step-due-date">${dueDate? dueDate : ''}</p>
            `;
        stepSummaryContainer.appendChild(summaryComponent);

        summaryComponent = document.createElement("div");
        summaryComponent.classList.add("wf-column", "step-summary-component");
        summaryComponent.innerHTML = `
                    <h4>Start</h4>
                    <p class="wf-step-start-date">${startDate? startDate : ''}</p>
            `;
        stepSummaryContainer.appendChild(summaryComponent);

        summaryComponent = document.createElement("div");
        summaryComponent.classList.add("wf-column", "step-summary-component");
        summaryComponent.innerHTML = `
                    <h4>Done</h4>
                    <p class="wf-step-done-date">${doneDate? doneDate : ''}</p>
            `;
        stepSummaryContainer.appendChild(summaryComponent);



        let stepDetailContainer = document.createElement("div");
        stepDetailContainer.classList.add("step-detail-container");
        if (isExpanded) {
            stepDetailContainer.style = "display: block;"
        } else {
            stepDetailContainer.style = "display: none;"
        }

        const editBtnOpts = {
            text: 'Edit Step',
            style: 'secondary',
            type: 'contained',
            classNames: ['step-edit-button'],
            icon: 'edit',
            callback: () => {
                new EditWorkflowStepComponent(new WorkflowStepComponent(this, people, responsiblePeople), async (editedData, cache)=>{
                    try {
                        let result = await WorkflowViewerAjax.updateStepAsync(editedData)
                                if (Object.values(result)[0] === "1"){
                            let existingNode = document.querySelector(`.wf-steps-container[data-id='${stepId}']`);
                            if (existingNode) {
                                editedData.isExpanded = this.isExpanded;
                                // editedData.startDate = '01/01/2021';
                                existingNode.parentNode.replaceChild(editedData.render(), existingNode);
                            };
                        }
                        // get the associated Actions for the current Step events (in cache)
                        for (const stepobjt in cache) {
                            let stepobject = cache[stepobjt];
                            let processEvent = await WorkflowViewerAjax.processStepEventsAsync(stepobject);
                            let stepActionData = JSON.parse(processEvent.processWorkflowStepEventResult);
                            // update the UI with the returned step Action data for the current step event
                            for (var i = 0; i < stepActionData.length; i++) {

                                if (stepActionData[i].length > 1) {

                                    let stepActionObj = JSON.parse(stepActionData[i])
                                    let existingNode = document.querySelector(`.wf-steps-container[data-id='${stepId}']`);
                                    if (existingNode) {
                                        editedData.isExpanded = this.isExpanded;
                                        if (stepActionObj.ActionId == "6") {
                                            editedData.startDate = UTIL.formatDateFromIso(stepActionObj.ActionDate, '/');  //display date with step
                                            this.startDate = UTIL.formatDateFromIso(stepActionObj.ActionDate, '/'); //display date in the edit pop-up
                                        } else if (stepActionObj.ActionId == "5") {
                                            editedData.dueDate = UTIL.formatDateFromIso(stepActionObj.ActionDate, '/');
                                            this.dueDate = UTIL.formatDateFromIso(stepActionObj.ActionDate, '/');
                                        } else if (stepActionObj.ActionId == "1") {
                                                    const statusDropdown = document.getElementById('statusDropdown - ' + stepActionObj.workflowId );
                                            statusDropdown.value = stepActionObj.wfStatusId;
                                        }
                                        existingNode.parentNode.replaceChild(editedData.render(), existingNode);
                                    };
                                }


                            }

                        }


                        return;
                            } catch(err) {                            
                        console.error("error: ", err);
                    }
                });
            }
        };
        const stepBtnEdit = button.build(editBtnOpts);

        const deleteBtnOpts = {
            text: 'Delete Step',
            style: 'danger',
            type: 'outlined',
            classNames: ['step-delete-button'],
            icon: 'delete',
            callback: async () => {
                try {
                    var answer = confirm(
                        "Are you sure you want to delete this step?"
                    );
                    if (answer) {
                        let result = await WorkflowViewerAjax.deleteStepAsync(this.stepId);
                                if (Object.values(result)[0] === "1"){
                            stepsContainer.remove();
                        }
                    }
                    return;
                        } catch(err) {                            
                    console.error("error: ", err);
                }
            }
        };
        const stepBtnDelete = button.build(deleteBtnOpts);

        let reponsiblePartyContainer = document.createElement("div");
        reponsiblePartyContainer.classList.add("wf-column");
        reponsiblePartyContainer.classList.add(`responsiblePartytype_${responsiblePartytype}`);
        reponsiblePartyContainer.innerHTML = `
                    <h4>Responsible Party</h4>
                    <hr>
                   <p>${getFirstAndLastName(responsiblePartyId, responsiblePeople)}</p>  
                `;

        let commentsContainer = document.createElement("div");
        commentsContainer.classList.add("wf-column");
        commentsContainer.innerHTML = `
                    <h4>Comments</h4>
                    <hr>
                    <p class="comments">${comments === undefined ? '' : comments}</p>
                `;

        let documentsContainer = document.createElement("div");
        documentsContainer.classList.add("wf-column");
        documentsContainer.innerHTML = `
                    <h4 class="wf-documents-header">Documents</h4>
                    <hr>                        
                `;

        const addDocBtnOpts = {
            text: 'Upload Document',
            style: 'secondary',
            type: 'outlined',
            classNames: ['step-edit-button'],
            icon: 'add'
        };

        const addFormBtnOpts = {
            text: 'Add Form',
            style: 'secondary',
            type: 'outlined',
            classNames: ['step-edit-button'],
            icon: 'add',
            callback: () => {
                // forms.displayPopup();
                const docOrder = this.documents.length + 1;
                new FormsWorkflowStepComponent(new WorkflowStepComponent(this, people, responsiblePeople), docOrder); // new FormsWorkflowStepComponent
                // alert('Test2');
            } // callback
        }; // addFormBtnOpts

        let attachmentInput = document.createElement("input");
        attachmentInput.type = "file";
        attachmentInput.name = "file";
        attachmentInput.id = `stepId-${this.stepId}`;
        attachmentInput.classList.add('inputfile');
        attachmentInput.onchange = (event) => {
            const attachment = event.target;
                    if (this.isAttachmentValid(attachment)){
                const newDocumentComponent = this.addStepDocument(attachment);
                event.target.value = ""; // clear file input value after adding it
            };
        }

        let attachmentLabelAddDoc = document.createElement("label");
        //  attachmentLabel.classList.add("step-add-document-container");
              attachmentLabelAddDoc.setAttribute("for",attachmentInput.id);  

        let addDocumentBtn = button.build(addDocBtnOpts);
        let addFormBtn = button.build(addFormBtnOpts);

        // TODOJOE: Upload Document and Display Form buttons -- need to size the AddDocbtn
        attachmentLabelAddDoc.appendChild(addDocumentBtn);
        //  attachmentLabel.appendChild(addFormBtn);

        let attachmentLabelAddForm = document.createElement("label");
        attachmentLabelAddForm.appendChild(addFormBtn);

        // documentsContainer.appendChild(attachmentInput);

        let btnWrap = document.createElement("div");
        btnWrap.classList.add("step-action-container");
        btnWrap.appendChild(attachmentInput);
        btnWrap.appendChild(attachmentLabelAddDoc);
        btnWrap.appendChild(attachmentLabelAddForm);


        documentsContainer.appendChild(btnWrap);

        // documentsContainer.appendChild(attachmentLabel);
        // documentsContainer.appendChild(addFormBtn);

        let documentsList = document.createElement("ul");
        documentsList.classList.add("wf-documents-list");

                if (documents && documents.length > 0){
            documents.map(d => {
                documentsList.appendChild(new WorkflowDocumentComponent(d).render());
            });
        }

        documentsContainer.appendChild(documentsList);

        let actionContainer = document.createElement("div");
        actionContainer.classList.add("step-action-container");
        actionContainer.appendChild(stepBtnEdit);
        actionContainer.appendChild(stepBtnDelete);
        if (this.allowStepEdit === 'False') {
            stepBtnDelete.classList.add("disabled");
            stepBtnDelete.classList.remove("btn--danger");
        }
        stepDetailContainer.appendChild(actionContainer);
        stepDetailContainer.appendChild(reponsiblePartyContainer);
        stepDetailContainer.appendChild(commentsContainer);
        stepDetailContainer.appendChild(documentsContainer);

        stepsGridColumn2.appendChild(stepSummaryContainer);
        stepsGridColumn2.appendChild(stepDetailContainer);

        let stepsGridColumn3 =  document.createElement("div");
        stepsGridColumn3.classList.add("step-grid-column-3");

        //  let stepDragHandle = document.createElement("div");
        // stepDragHandle.classList.add("drag-handle");           
        // stepDragHandle.innerHTML = icons['drag'];
        // stepsGridColumn3.appendChild(stepDragHandle);            

        stepsGrid.appendChild(stepsGridColumn1);
        stepsGrid.appendChild(stepsGridColumn2);
        stepsGrid.appendChild(stepsGridColumn3);

        let stepsContainer = document.createElement("div");
        stepsContainer.classList.add("wf-steps-container");
        stepsContainer.setAttribute('data-id', stepId);

        stepsContainer.addEventListener('click', async (e)=> {
            if (e.target.type === "checkbox"){
                let doneDate = e.target.checked ? moment(UTIL.getTodaysDate(), "YYYY-MM-DD").format("M/D/YYYY") : null;
                // update the database and get response
                let result = await WorkflowViewerAjax.setStepDoneDateAsync(this.stepId, doneDate);
                if (Object.values(result)[0] === "1") {
                    // set the state of this object's done date
                    this.doneDate = doneDate;
                    // update the html
                    let stepsContainer = e.target.closest(".wf-steps-container");
                    let doneDateElement = stepsContainer.getElementsByClassName('wf-step-done-date')[0];
                    doneDateElement.innerHTML = doneDate? doneDate : '';
                    // EVENT -- this step done date is set
                    let cache = {modified : doneDate, eventTypeId : this.stepId, eventType : "step", eventId : 6};
                    let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache);
                    let stepActionData = JSON.parse(processEvent.processWorkflowStepEventResult);
                    // ACTION -- if Action is 'set WorkFlow Status' (Action = 1), then update UI to reflect Action 
                    for (var i = 0; i < stepActionData.length; i++) {
                        if (stepActionData[i].length > 1) {
                            let stepActionObj = JSON.parse(stepActionData[i])
                            if (stepActionObj.ActionId == "1") {
                                const statusDropdown = document.getElementById('statusDropdown - ' + stepActionObj.workflowId );
                                statusDropdown.value = stepActionObj.wfStatusId;
                            }
                        }
                    }
                }
                return;
            }
        });

        stepsContainer.appendChild(stepsGrid);

        new Sortable(documentsList, {
            handle: '.drag-handle',
            draggable: 'li',
            onSort: function (evt){ 
                const stepDocuments = Array.from(documentsList.getElementsByTagName("LI"));
                if (stepDocuments){
                    const orderArray = stepDocuments.map((doc, index) => ({
                        id: doc.getAttribute("data-document-id"),
                        order: index.toString()
                    }));
                    try {
                        WorkflowViewerAjax.setDocumentOrderAsync(orderArray);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        });

        return stepsContainer;
    }

}