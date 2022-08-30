class EditResponsibleRelationshipsComponent {
    
    constructor(workflowId, people, callback){
        this.workflowId = workflowId;
        this.people = people;
        this.callback = callback; 
        this.createPopup();
        this.cache = {};
    }
   
    editResponsibleRelationshipsFinished(){
        let {cache, workflowId, callback} = this;
        POPUP.hide(wfStepPopup);                     
        return callback(workflowId, cache);   
        // update this call to pass the values that changed          
    }

    editResponsibleRelationshipsCancelled(){
        POPUP.hide(wfStepPopup);  
    }

    enableButton(button, enable){
        enable ? button.classList.remove("disabled") : button.classList.add("disabled");//
    }

    containsErrors() {
        //MAT 2/12/2021 Seems to fix the Done button shading issue. Leaving old here in case other issues are caused
        //let errors = document.querySelectorAll(".error");
        let errors = wfStepPopup.querySelectorAll(".error");
        return errors.length !== 0;
    }

   async createPopup() {
       // let {description, dueDate, startDate, doneDate, responsiblePartyId, comments} = this.step;
                   
        
        async function getResponsibleParties(workflowId) {
            let responsibleData = await WorkflowViewerAjax.getWFResponsibleParties({
                token: $.session.Token,
                workflowId: workflowId ? workflowId : 0,
              });
        
            return responsibleData;
          }

          let responsibleData = await getResponsibleParties(this.workflowId);

          let wfStepPopup = POPUP.build({
            header: (responsibleData.length == 0) ? "There are no Responsible Parties defined for this workflow" : "Workflow Responsibility Relationship Assignments",
            hideX: true,
            id: "wfStepPopup"
        });

          for(let i = 0; i < responsibleData.length; i++) {

            let dropDownList = dropdown.build({
                label: responsibleData[i].description,
                dropdownId: `responsibledropDownList_${responsibleData[i].responsiblePartyType}`,
            });

            this.cache[`responsibledropDownList_${responsibleData[i].responsiblePartyType}`] = {original : responsibleData[i].responsiblePartyId, modified : ""};

            dropDownList.addEventListener("change", (e)=> {
                let originalvalues = this.cache;
                let modifiedvalue = e.target.value;
                let clickedddl = e.target.id;

                for (const ddl in originalvalues) {
                    let ddlobjects = this.cache[ddl];
                    if (ddl == clickedddl) {
                        ddlobjects.modified = modifiedvalue;
                    }      
                }

            });

            wfStepPopup.appendChild(dropDownList);

           // populateDropdown(dropDownList, responsiblePartyId, this.people);
            let data = this.people.map((person) => ({
                id: person.peopleId, 
                value: person.peopleId,
                text: person.lastName + ", " + person.firstName
            })); 
            data.unshift({ id: null, value: null, text: 'PLEASE SELECT A RESPONSIBLE PARTY' }); //ADD Blank value         
            dropdown.populate(dropDownList, data, responsibleData[i].responsiblePartyId); 
          }

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
         
        let doneBtn = button.build({
            id: "wfStepDoneBtn",
            text: "done",
            type: "contained",
            style: "secondary",
            callback: this.editResponsibleRelationshipsFinished.bind(this)          
        });
        this.doneButton = doneBtn;

        let cancelBtn = button.build({
            id: "wfStepCancelBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: this.editResponsibleRelationshipsCancelled.bind(this)
        });
        
        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        if (responsibleData.length > 0) btnWrap.appendChild(doneBtn);
        btnWrap.appendChild(cancelBtn);             
        wfStepPopup.appendChild(btnWrap);
        
        wfStepPopup.addEventListener("errorRaised", (event) => {
            
            this.enableButton(doneBtn, false);   
        });

        wfStepPopup.addEventListener("errorCleared", () => {
            this.enableButton(doneBtn, !this.containsErrors());
        });

        POPUP.show(wfStepPopup);
    }
    
}