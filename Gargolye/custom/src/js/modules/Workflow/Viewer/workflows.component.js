class WorkflowsComponent {
    constructor({workflows, people}){
        this.workflows = workflows;
        this.people = people;
    }

    render() {
        let {people} = this;
        let workflowsComponent = document.createElement('div');   
        if (this.workflows.length > 0){
            this.workflows.map(w => { 
                workflowsComponent.appendChild(new WorkflowComponent(w, people).render())                
            });    
        } else {
            workflowsComponent.innerHTML = `There are no workflows attached to this record`;
        }
        return workflowsComponent;
    }
    
}