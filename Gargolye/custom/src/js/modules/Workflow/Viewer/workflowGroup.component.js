class WorkflowGroupComponent {

    constructor(parent, {groupId, groupName, steps}, people){
        this.groupId = groupId;
        this.name = groupName;
        this.steps = steps;  
        this.people = people;
        this.parent = parent;
    }

    render(){

        let {groupId, name, steps, parent, people} = this;

        let groupContainer = document.createElement('div');
        groupContainer.classList.add("wf-group-container");
        groupContainer.setAttribute("data-id", groupId);       

        let groupHeaderGrid = document.createElement('div');
        groupHeaderGrid.classList.add("group-grid");        

        let groupGridColumn1 = document.createElement("div");
        groupGridColumn1.classList.add("group-grid-column-1");

            let groupExpandButton = document.createElement("button");
            groupExpandButton.classList.add("expand-button", "expanded");
            groupExpandButton.innerHTML = icons['keyArrowRight']; 
            groupGridColumn1.appendChild(groupExpandButton);  
        
        let groupGridColumn2 = document.createElement('div');
        groupGridColumn2.classList.add("group-grid-column-2");

            let groupDescription = document.createElement("div");
            groupDescription.classList.add("group-description");
            groupDescription.innerHTML = `${name}`;
            groupGridColumn2.appendChild(groupDescription);  

            const addStepBtnOpts = {
                text: 'Add Step',
                style: 'primary',
                type: 'contained',
                classNames: ['add-step-button'],
                icon: 'add',
                callback: () => {
                    new EditWorkflowStepComponent(new WorkflowStepComponent({groupId: groupId, stepOrder: "" + (steps.length + 1) + ""}, people), async (editedData)=>{
                        try {
                            let result = await WorkflowViewerAjax.insertStepAsync(editedData);
                            const {insertWorkflowStepResult} = result;
                            editedData.stepId = insertWorkflowStepResult;
    
                          //  let cache = {eventTypeId : editedData.groupId, eventType : "group", eventId : 1};
                          //  let processEvent = await WorkflowViewerAjax.processStepEventsAsync(cache); 
                           // let stepActionsCompleted = JSON.parse(processEvent.processWorkflowStepEventResult);
                            
                            let groupNode = document.querySelector(`.wf-group-container[data-id='${groupId}']`);
    
                            if (groupNode){
                                $(groupNode).find(".wf-steps-container").slideDown(); // expand group if it's collapsed
                                groupNode.appendChild(editedData.render());
                            }  
                            return;                                   
                        } catch(err) {                            
                            console.error("error: ", err);                            
                        }                                                         
                    });   
                }
            };
            const groupBntAddStep = button.build(addStepBtnOpts); 
            groupGridColumn2.appendChild(groupBntAddStep);

        groupHeaderGrid.appendChild(groupGridColumn1);
        groupHeaderGrid.appendChild(groupGridColumn2);

        groupContainer.appendChild(groupHeaderGrid);

        groupContainer.addEventListener('click', (e)=> {            
            let button = e.target.closest('button');
            if (button) {  
                if (button.classList.contains('expand-button')){                    
                    let parentDiv = button.closest('div');
                    if (parentDiv.classList.contains("step-grid-column-1")) {
                        let stepGrid = $(parentDiv).parent();
                        console.log(stepGrid);
                        $(stepGrid).find(".step-detail-container").slideToggle();
                    } 
                    if (parentDiv.classList.contains("group-grid-column-1")){
                        let stepContainer = $(parentDiv).parent().parent();
                        $(stepContainer).find(".wf-steps-container").slideToggle();
                    }
                    $(button).toggleClass('expanded');
                    return
                }                  
            }               
        }) 

        parent.appendChild(groupContainer);     

        if (steps){            
            steps.map(s => {
                groupContainer.appendChild(new WorkflowStepComponent(s, people).render());            
            })
        }       

        new Sortable(groupContainer, {
            handle: '.drag-handle',
            draggable: '>.wf-steps-container',
            onSort: function (evt){ 
                const groupSteps = Array.from(groupContainer.getElementsByClassName("wf-steps-container"));
                if (groupSteps){
                    const orderArray = groupSteps.map((step, index) => ({
                        id: step.getAttribute("data-id"),
                        order: index.toString()
                    }));
                    try {
                        WorkflowViewerAjax.setStepOrderAsync(orderArray);
                    } catch (error) {
                        console.error(error);
                    }                    
                }
            }
        });

        return ;     
    }
}