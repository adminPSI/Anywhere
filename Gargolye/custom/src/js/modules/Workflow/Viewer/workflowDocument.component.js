class WorkflowDocumentComponent {
    constructor({documentId, stepId, docOrder, description, attachmentId, documentEdited, attachmentType}){
        this.documentId = documentId;
        this.stepId = stepId;
        this.docOrder = docOrder;
        this.description = description;
        this.attachmentId = attachmentId;
        this.documentEdited = documentEdited;
        this.attachmentType = attachmentType;
    }
   
    render(){

        let documentElement = document.createElement('li');
        documentElement.classList.add("wf-document");
        documentElement.setAttribute("data-document-id", this.documentId);
        documentElement.setAttribute("data-attachment-id", this.attachmentId);  
        documentElement.setAttribute("data-document-edited", this.documentEdited); 
        documentElement.setAttribute("data-attachment-type", this.attachmentType); 

        let documentDescription = document.createElement('label');
        documentDescription.innerHTML = `
            ${this.description}
        `;

        let documentDeleteBtn = document.createElement('button');
        documentDeleteBtn.classList.add("wf-document-delete-btn");
        documentDeleteBtn.innerHTML = `
            ${icons['close']}
        `;

        documentDeleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            try {   
                this.deleteConfirmation(this.documentId, documentElement);    
                return;                                   
            } catch(err) {                            
                console.error("error: ", err);                            
            }   
        });

        let documentDragBtn = document.createElement('button');
        documentDragBtn.classList.add("wf-document-drag-btn");
        documentDragBtn.classList.add("drag-handle");  
        documentDragBtn.innerHTML = `
        ${icons['drag']}
    `;

        documentElement.appendChild(documentDragBtn);
        documentElement.appendChild(documentDescription);
        documentElement.appendChild(documentDeleteBtn);
        

        documentElement.addEventListener("click", (e) => {
            let docDesc = this.description;            
            let slug = slugify(docDesc);
                      
            function slugify(myString) {
                let s = myString.replace(/[^\w\s-]/g, '').trim().toLowerCase();
                s = s.replace(/[-\s]+/g, '-');
                return s;
            }

            if (documentElement.getAttribute("data-attachment-type") == 'pdf') {
                let isTemplate = false;
                let templateName = "";
                let documntEdited = documentElement.getAttribute("data-document-edited"); 
               
                let activeConsumers = roster2.getActiveConsumers();   
                let activeConsumerId = activeConsumers[0].id;
                 forms.displayWFStepFormPopup(this.documentId, templateName, this.stepId, this.docOrder, isTemplate, documntEdited, activeConsumerId); 
            } else {             
                 const resp = WorkflowViewerAjax.downloadAttachment(this.attachmentId, slug);
            }      
        });

        return documentElement;
    }

    deleteConfirmation(documentId, documentElement) {
		var popup = POPUP.build({
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
			callback: async function() {
                POPUP.hide(popup);
                let result = await WorkflowViewerAjax.deleteDocumentAsync(documentId);  
                if (result.deleteWorkflowStepDocumentResult === "1"){
                        documentElement.remove();                    
                }
			},
		});
		var noBtn = button.build({
			text: 'No',
			style: 'secondary',
			type: 'contained',
			icon: 'close',
			callback: function() {
				POPUP.hide(popup);
			},
		});
		btnWrap.appendChild(yesBtn);
		btnWrap.appendChild(noBtn);
		var warningMessage = document.createElement('p');
		warningMessage.innerHTML = 'Are you sure you want to delete this step document?';
		popup.appendChild(warningMessage);
		popup.appendChild(btnWrap);
		POPUP.show(popup);
	}
}