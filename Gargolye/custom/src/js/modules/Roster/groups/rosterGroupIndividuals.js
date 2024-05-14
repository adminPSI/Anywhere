const rosterGroupIndividuals = (function () {

    let selectedConsumerIDs = [];
    let groupId;
    async function handleActionNavEvent(target) {
        const targetAction = target.dataset.actionNav;
        switch (targetAction) {
            case "miniRosterDone": {
                const selectedConsumers = roster2.getSelectedConsumersMiniRoster()
                selectedConsumers.forEach(async consumer => {
                    selectedConsumerIDs.push(consumer.id);
                })
                await customGroupsAjax.addConsumerToCustomGroup(selectedConsumerIDs, groupId);   
                roster2.clearSelectedConsumers();  
                roster2.clearActiveConsumers();  
                customGroups.loadManageGroupsPage();              
                break;
            }
            case "miniRosterCancel": {
                roster2.clearSelectedConsumers();
                customGroups.loadManageGroupsPage();
                break;
            }
        }
    }

    async function init(newGroupID) {
        selectedConsumerIDs = [];
        groupId = newGroupID;
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        setActiveModuleSectionAttribute("roster-GroupIndividuals");
        await roster2.miniRosterinit(null, { hideDate: true, locationDisabled: true });
        document.getElementById('mini_roster').click();
    }
    return {
        init,
        handleActionNavEvent,
    };
})();
