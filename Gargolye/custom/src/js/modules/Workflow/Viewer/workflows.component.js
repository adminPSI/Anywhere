class WorkflowsComponent {
    constructor({ workflows, people, responsiblePeople }){
        this.workflows = workflows;
        this.people = people;
        this.responsiblePeople = responsiblePeople;
    }

    render() {
        let { people, responsiblePeople } = this;
        let workflowsComponent = document.createElement('div');   
        if (this.workflows.length > 0){
            this.workflows.map(w => { 
                workflowsComponent.appendChild(new WorkflowComponent(w, people, responsiblePeople).render())                
            });    
        } else {
            workflowsComponent.innerHTML = `There are no workflows attached to this record`;
        }
        return workflowsComponent;
    }
    
}