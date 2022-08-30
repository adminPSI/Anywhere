class FormsWorkflowStepComponent {
   
    constructor(step, docOrder){
        this.step = step;
        // this.callback = callback; 
        this.docOrder = docOrder; 
        this.templateId;
        this.templateName;
        this.createPopup();
        this.populateDropdown();
    }

    formsWorkflowStepFinished(){
        let {step, cache, callback} = this;
        POPUP.hide(selectTemplatePopup);  
        let isTemplate = true;   
        let documentEdited = "0"; //   document not previously edited              
       // return callback(step, cache);   
        let activeConsumers = roster2.getActiveConsumers();   
        let activeConsumerId = activeConsumers[0].id;
       forms.displayWFStepFormPopup(this.templateId, this.templateName, this.step.stepId, this.docOrder, isTemplate, documentEdited, activeConsumerId);        
    }

    formsWorkflowStepCancelled(){
        POPUP.hide(selectTemplatePopup);  
    }

    enableButton(button, enable){
        enable ? button.classList.remove("disabled") : button.classList.add("disabled"); 
    }

    containsErrors() {
        //MAT 2/12/2021 Seems to fix the Done button shading issue. Leaving old here in case other issues are caused
        //let errors = document.querySelectorAll(".error");
        let errors = selectTemplatePopup.querySelectorAll(".error");
        return errors.length !== 0;
    }

    createPopup() { 
        let selectTemplatePopup = POPUP.build({
            header: "Template Select",
            hideX: true,
            id: "selectTemplatePopup"
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

      
        let templateDropdown = dropdown.build({
            label: "Form Templates",
            dropdownId: "templateDropdown",
        });   

        templateDropdown.addEventListener("change", (e)=> {
            this.templateId = e.target.value;
            var templateddl = document.getElementById("templateDropdown");
            this.templateName = templateddl.options[templateddl.selectedIndex].innerHTML;
            
            // responsiblePartyId
         
        });

      
        let doneBtn = button.build({
            id: "wfStepDoneBtn",
            text: "done",
            type: "contained",
            style: "secondary",
            callback: this.formsWorkflowStepFinished.bind(this)            
        });
        this.doneButton = doneBtn;

        let cancelBtn = button.build({
            id: "wfStepCancelBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: this.formsWorkflowStepCancelled.bind(this)
        });
        
        let btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");
        btnWrap.appendChild(doneBtn);
        btnWrap.appendChild(cancelBtn);        
        selectTemplatePopup.appendChild(templateDropdown);
        selectTemplatePopup.appendChild(btnWrap);

        
        selectTemplatePopup.addEventListener("errorRaised", (event) => {
            
            this.enableButton(doneBtn, false);
        });

        selectTemplatePopup.addEventListener("errorCleared", () => {
            this.enableButton(doneBtn, !this.containsErrors());
        });

        POPUP.show(selectTemplatePopup);
    }

    populateDropdown() { 

        const templates = WorkflowViewerComponent.getTemplates();
        let data = templates.map((template) => ({
            id: template.formTemplateId, 
            value: template.formTemplateId,
            text: template.formType + " -- " + template.formDescription
        })); 
        data.unshift({ id: null, value: '', text: '' }); //ADD Blank value         
        dropdown.populate("templateDropdown", data);        
    }

    
}