var customGroups = (function(){
    // DOM
    var GROUP_ADMIN_POPUP;
    var GROUP_LIST; // list of custom groups
    // Data & Values
    var rosterGroups;
    var customGroupData;
    var newGroupName;
    var consumerId;
    // selected location data obj
    var location;
    var locationId;
    let newGroupID;

    async function updateCustomGroupData(callback) {
        const results = (await customGroupsAjax.getConsumerGroups(locationId)).getConsumerGroupsJSONResult;
        roster2.setRosterGroups(results);
        customGroupData = results.filter(res => res.GroupCode === 'CST');
        if (callback) callback();
    }
    function showGroupDeleteWarningPopup(groupId) {
        var groupDeleteWarningPop = POPUP.build({
            header: 'Are you sure you want to delete this group?'
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var yesBtn = button.build({
            text: 'Yes',
            style: 'secondary',
            type: 'contained',
      callback: function(event) {
        customGroupsAjax.removeCustomGroup(groupId, async function() {
                    results = (await customGroupsAjax.getConsumerGroups(locationId)).getConsumerGroupsJSONResult;
                    roster2.setRosterGroups(results);

                    customGroupData = results.filter(res => res.GroupCode === 'CST');
                    populateGroupList(true);
                });
                POPUP.hide(groupDeleteWarningPop);
            }
        });
        var noBtn = button.build({
            text: 'No',
            style: 'secondary',
            type: 'contained',
      callback: function() {
                POPUP.hide(groupDeleteWarningPop);
            }
        });

        btnWrap.appendChild(yesBtn);
        btnWrap.appendChild(noBtn);
        groupDeleteWarningPop.appendChild(btnWrap);

        POPUP.show(groupDeleteWarningPop);
    }
    // function handleGroupListEvents() {
    //   // Add Consumer To Group
    //   if (event.target.classList.contains('groupCheckbox')) {
    //     var isChecked = event.target.checked;
    //     var groupId = event.target.dataset.groupId;
    //     // temp disable input until ajax call is done for click happy users
    //     var checkbox = event.target.parentElement;
    //     checkbox.classList.add('disabled');

    //     if (isChecked) {
    //       customGroupsAjax.addConsumerToGroup(groupId, consumerId, function() {
    //         checkbox.classList.remove('disabled');
    //         updateCustomGroupData();
    //       });
    //     } else {
    //       customGroupsAjax.removeConsumerFromGroup(groupId, consumerId, function() {
    //         checkbox.classList.remove('disabled');
    //         updateCustomGroupData();
    //       });
    //     }

    //   }
    //   // Group Admin Page
    //   if (event.target.classList.contains('groupDelete')) {
    //     var groupId = event.target.dataset.groupId;
    //     showGroupDeleteWarningPopup(groupId);
    //     return;
    //   }
    // }

    function groupCheckboxEvent(inputEl, checkboxEl) {
        const isChecked = inputEl.checked;
        const groupId = inputEl.dataset.groupId;
        checkboxEl.classList.add('disabled');

        if (isChecked) {
      customGroupsAjax.addConsumerToGroup(groupId, consumerId, function() {
                checkboxEl.classList.remove('disabled');
                updateCustomGroupData();
            });
        } else {
      customGroupsAjax.removeConsumerFromGroup(groupId, consumerId, function() {
                checkboxEl.classList.remove('disabled');
                updateCustomGroupData();
            });
        }
    };

    function groupDeleteEvent(el) {
        var groupId = el.dataset.groupId;
        showGroupDeleteWarningPopup(groupId);
        return;
    }

    function addToGroupEvent(el) {
        var groupId = el.dataset.groupId;
        rosterGroupIndividuals.init(groupId);
        return;
    }

    function populateGroupList(isAdmin) {
        GROUP_LIST.innerHTML = '';

        //updateCustomGroupData(function() {
        if (customGroupData !== undefined && customGroupData.length > 0) {
            customGroupData.forEach(cg => {
                var item = document.createElement('div');
                item.classList.add('customGroup');

                var text = document.createElement('p');
                text.innerHTML = cg.GroupName;

                var groupMembers = cg.Members.split('|');
                var isConsumerGroupMember = groupMembers.filter(gm => gm === consumerId);

                if (!isAdmin) {
                    var itemAction = input.buildCheckbox({
                        className: 'groupCheckbox',
                        isChecked: isConsumerGroupMember.length > 0 ? true : false,
              attributes: [{key: 'data-group-id', value: cg.RetrieveID}],
              callback: () => groupCheckboxEvent(event.target,itemAction)
                    });
                } else {
                    var itemAction = button.build({
                        icon: 'delete',
                        style: 'secondary',
                        type: 'text',
                        classNames: ['groupDelete'],
              attributes: [{key: 'data-group-id', value: cg.RetrieveID}],
                        callback: () => groupDeleteEvent(itemAction)
                    });

                    var manageConsumerAction = button.build({
                        text: 'Add To Group',
                        type: 'contained',
                        style: 'secondary',
                        attributes: [{ key: 'data-group-id', value: cg.RetrieveID }],
                        callback: () => addToGroupEvent(manageConsumerAction)
                    }); 
                }


                item.appendChild(text);
                if (!isAdmin) {
                    item.appendChild(itemAction);
                }
                else {
                    var btnWrap = document.createElement('div');
                    btnWrap.classList.add('groupBtnWrap');
                    btnWrap.appendChild(manageConsumerAction);
                    btnWrap.appendChild(itemAction);
                    item.appendChild(btnWrap);
                }
                GROUP_LIST.appendChild(item);
            });
        } else {
            GROUP_LIST.innerHTML = `<p>No custom groups found</p>`;
        }
        //});    
    }
    function buildGroupList(isAdmin, consumerID) {
        consumerId = consumerID;
        GROUP_LIST = document.createElement('div');
        GROUP_LIST.classList.add('customGroupList');

        populateGroupList(isAdmin);

        // GROUP_LIST.addEventListener('click', handleGroupListEvents);

        return GROUP_LIST;
    }
    function showAddNewGroupPopup() {
        var newGroupPop = POPUP.build({
            classNames: 'addGroupPopup'
        });

        var addNewGroupInput = input.build({
            label: 'Group Name',
            type: 'text',
            style: 'secondary'
        });
        var addNewGroupBtn = button.build({
            text: 'Add Group',
            style: 'secondary',
            type: 'contained',
            classNames: ['disabled', 'newGroupBtn']
        });

        addNewGroupInput.addEventListener('keyup', event => {
            newGroupName = event.target.value;

            if (newGroupName.length > 0) {
                addNewGroupBtn.classList.remove('disabled');
            } else {
                addNewGroupBtn.classList.add('disabled');
            }
        });
        addNewGroupBtn.addEventListener('click', event => {
            customGroupsAjax.addCustomGroup(newGroupName, locationId, async function (results) {
                newGroupID = results[0].CustomGroupID;
                results = (await customGroupsAjax.getConsumerGroups(locationId)).getConsumerGroupsJSONResult;
                roster2.setRosterGroups(results);

                customGroupData = results.filter(res => res.GroupCode === 'CST');
                populateGroupList(true);

                POPUP.hide(newGroupPop);
                manageGroupPopup();
            });
        });

        newGroupPop.appendChild(addNewGroupInput);
        newGroupPop.appendChild(addNewGroupBtn);

        POPUP.show(newGroupPop);
    }
    function buildManageGroupsPage() {
        var groupsPage = document.createElement('div');
        groupsPage.classList.add('manageGroupsPage');

        var topSection = document.createElement('div');

        var backToRoster = button.build({
            text: 'Back To Roster',
            icon: 'arrowBack',
            type: 'text',
            style: 'secondary',
      callback: function() {
                roster2.loadRosterInfo();
            }
        });

        var locationLabel = document.createElement('div');
        locationLabel.innerHTML = `<h2>${location.locationName}</h2>`;

        topSection.appendChild(backToRoster);
        topSection.appendChild(locationLabel);

        var addNewGroupBtn = button.build({
            text: 'Create New Group',
            style: 'secondary',
            type: 'contained',
            classNames: 'newGroupBtn',
            callback: showAddNewGroupPopup
        });

        var groupsList = buildGroupList(true);

        groupsPage.appendChild(topSection);
        groupsPage.appendChild(addNewGroupBtn);
        groupsPage.appendChild(groupsList);

        return groupsPage;
    }
    function loadManageGroupsPage() {
        DOM.clearActionCenter();
        setActiveModuleSectionAttribute('roster-groups');

        if (!location || !locationId) {
            location = roster2.getSelectedLocationObj();
            locationId = location.locationId;
        }


        var manageGroupsPage = buildManageGroupsPage();

        DOM.ACTIONCENTER.appendChild(manageGroupsPage);
    }

    function manageGroupPopup() {
        const confirmPopup = POPUP.build({
            hideX: true
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                POPUP.hide(confirmPopup);
                rosterGroupIndividuals.init(newGroupID);
            },
        });

        NO_BTN = button.build({
            text: 'NO',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(confirmPopup);
            },
        });

        const message = document.createElement('p');
        message.innerText = 'Your group has been created. Would you like to add individuals to this group now?';
        message.style.textAlign = 'center';
        message.style.marginBottom = '15px';
        confirmPopup.appendChild(message);
        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(YES_BTN);
        popupbtnWrap.appendChild(NO_BTN);
        confirmPopup.appendChild(popupbtnWrap);
        YES_BTN.focus();
        POPUP.show(confirmPopup);
    }

    function init(groupData) {
        customGroupData = groupData.filter(gd => gd.GroupCode === 'CST');
        rosterGroups = groupData;
        location = roster2.getSelectedLocationObj();
        locationId = location.locationId;
        // if (document.getElementById('mini_roster') != null)
        //     document.getElementById('mini_roster').style.display = 'none';
    }

    return {
        init,
        loadManageGroupsPage,
        buildGroupList
    }

})();