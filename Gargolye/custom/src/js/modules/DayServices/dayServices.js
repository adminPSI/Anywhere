const dayServices = (function () {
    //DOM ELEMENTS
    let multiDeleteRecordBtn;
    let multiSelectAllBtn;
    let multiSelectNoneBtn;
    let multiOutRecordBtn;
    let multiInRecordBtn;
    let filterBtn;
    let filterLocationDropdown;
    let filterGroupDropdown;
    let filterPopup;
    let filterDateInput;
    let fitlerApplyBtn;
    let batchedMessageDisplay = document.createElement('h3');
    let mulitSelectBtn;
    let multiSelectAllNoneArea;
    let dsCardArea = document.createElement('div');
    dsCardArea.classList.add('dsCardArea');

    let SEARCH_WRAP;
    let SEARCH_BTN;
    let SEARCH_INPUT;

    let saveBtn;
    let groupDropdown;

    // New Roster
    let initRosterSelection;
    let activeConsumers;

    // Filter Data
    let rosterGroupResults;
    let serviceDate;
    let locationID;
    let filterGroupID;
    let filterGroupRetrieveID;
    let temp__locationID;
    let temp__groupID;
    let temp__retrieveID;
    let temp__serviceDate;
    let btnWrap;
    let locationBtnWrap;
    let serviceDateBtnWrap;
    let selectedGroupNameBtnWrap;

    // DATA
    let displayedConsumers = [];
    let enabledConsumers;
    let noLocationSet;
    let enabledConsumerString;
    let selectedConsumers;
    let currentLocationBatched;
    let locationCache = {};
    let activityCache = {};
    let dsConsumers = [];
    let dsGroupsCache;
    let dsDropdownData;
    let ciDropdownData;
    let groupDropdownData;
    let selectedDSType;
    let selectedGroup;
    let selectedGroupId;
    let locationDropdownData;
    let enableMultiEdit = false;
    let IsSaveBtnDisable = true;
    //permission
    // var PERMISSION__viewOnly = !$.session.DayServiceUpdate;

    const dsTypes = [
        { dsType: 'A', dsText: 'Adult Day' },
        { dsType: 'G', dsText: 'Group Employment' },
        //{ dsType: 'H', dsText: 'Restart Voc. Hab.' },
        //{ dsType: 'R', dsText: 'Restart Adult Day' },
        { dsType: 'X', dsText: 'STEP Voc. Hab.' },
        { dsType: 'S', dsText: 'STEP Adult Day' },
        { dsType: 'D', dsText: 'Virtual Adult Day' },
        { dsType: 'Y', dsText: 'Virtual Voc. Hab.' },
        { dsType: 'V', dsText: 'Voc. Hab.' },
        { dsType: 'N', dsText: 'Non-Billable' },
        //{ dsType: 'C', dsText: 'Combo' },
        //{ dsType: 'E', dsText: 'Enclave' },

        // { dsType: "0", dsText: "Day Service" }
    ];

    // Util
    //-------------------------------------------------------------------------
    function formatConsumersForClockIn(consumerIds) {
        var consumerString = consumerIds.map(c => c.id).join('|');
        consumerString += '|';
        return consumerString;
    }

    function formatConsumersForClockOut(consumerIds) {
        consumerIds = consumerIds.map(c => c.id);
        let consumerString = '';
        consumerIds.forEach(id => {
            activityCache[id].forEach(act => {
                if (act.Stop_Time === '') {
                    consumerString += `${id},${act.Start_Time}|`;
                }
            });
        });
        return consumerString;
    }

    function checkIfBatched() {
        var miniRosterBtn = document.querySelector('.consumerListBtn');
        dayServiceAjax.getDSIsLocationBatched(locationID, serviceDate, res => {
            if (res.length !== 0) {
                currentLocationBatched = true;
            } else {
                currentLocationBatched = false;
            }
            if (currentLocationBatched) {
                if ($.session.DayServiceUpdate) mulitSelectBtn.classList.add('disabled');
                if ($.session.DayServiceUpdate) miniRosterBtn.classList.add('disabled');
                batchedMessageDisplay.classList.remove('hidden');
            } else {
                if ($.session.DayServiceUpdate) mulitSelectBtn.classList.remove('disabled');
                if ($.session.DayServiceUpdate) miniRosterBtn.classList.remove('disabled');
                batchedMessageDisplay.classList.add('hidden');
                checkForNoLocation();
            }
        });
    }

    function checkForNoLocation() {
        if (!$.session.DayServiceUpdate) return; //Don't need to do anything with multiselect or miniroster for view only.
        miniRosterBtn = document.querySelector('.consumerListBtn');
        if (noLocationSet) {
            miniRosterBtn.classList.add('disabled');
            mulitSelectBtn.classList.add('disabled');
        } else {
            miniRosterBtn.classList.remove('disabled');
            mulitSelectBtn.classList.remove('disabled');
        }
    }

    function getDayServiceActivity(callback) {
        activityCache = {};
        var tempDsConsumers = [];
        dsConsumers = [];
        displayedConsumers = [];

        //enabledConsumerString = enabledConsumers.map(c => c.id).join(',');
        enabledConsumerString = enabledConsumers.join(', ');
        if (enabledConsumerString.indexOf(', [object Object]') !== -1) {
            enabledConsumerString = enabledConsumerString.replaceAll(', [object Object]', '');
        }

        dayServiceAjax.getConsumerDayServiceActivity(
            enabledConsumerString,
            serviceDate,
            locationID,
            filterGroupID,
            filterGroupRetrieveID,
            res => {
                res.forEach(res => {
                    obj = {
                        Acuity: res.Acuity,
                        AllowNonBillable: res.AllowNonBillable,
                        Day_Service_Type: res.Day_Service_Type,
                        FirstName: res.FirstName,
                        LastName: res.LastName,
                        Service_Date: res.Service_Date,
                        Start_Time: res.Start_Time,
                        Stop_Time: res.Stop_Time,
                        ciStaffID: res.ciStaffID,
                        isBatched: res.isBatched,
                        dsGroupId: res.Day_service_group_id,
                    };
                    consumerObj = {
                        id: res.ID,
                        FirstName: res.FirstName,
                        LastName: res.LastName,
                    };
                    if (activityCache[res.ID]) {
                        arr = activityCache[res.ID];
                        arr.push(obj);
                        activityCache[res.ID] = arr;
                    } else {
                        activityCache[res.ID] = [obj];
                    }
                    tempDsConsumers.push(consumerObj);
                    selectedGroupId = res.Day_service_group_id;
                });
                //filter out array to only get distinct consumers:
                var dsConsumerMap = new Map();
                for (const item of tempDsConsumers) {
                    if (!dsConsumerMap.has(item.id)) {
                        dsConsumerMap.set(item.id, true);
                        dsConsumers.push({
                            id: item.id,
                            FirstName: item.FirstName,
                            LastName: item.LastName,
                        });
                    }
                }
                //Add all consumers to the displayed consumers array
                dsConsumers.forEach(consumer => {
                    displayedConsumers.push(consumer.id);
                });
                //===
                if (callback) callback();
            },
        );
    }

    function checkForCI(dsType) {
        //Chceks if selectedDSType is a DS type that allows CI returns true if it is.
        //If no dsType is provided function defaults to selectedDSType

        let type = dsType ? dsType : selectedDSType;

        switch (type) {
            case 'A':
                return true;
            case 'V':
                return true;
            case 'N':
                return true;
            case 'H':
                return true;
            case 'R':
                return true;
            case 'X':
                return true;
            case 'S':
                return true;
            default:
                return false;
        }
    }

    function errorPopup(text) {
        var errorPopup = POPUP.build({
            id: 'errorPopup',
            classNames: 'error',
        });
        var errorPopupText = document.createElement('p');
        errorPopupText.classList.add('errorTextArea');
        errorPopup.appendChild(errorPopupText);
        errorPopupText.innerHTML = text;
        POPUP.show(errorPopup);
    }

    // Search
    //-------------------------------------------------------------------------
    function searchDS(searchValue) {
        // gather all names shown
        //reset the array containing list of consumers that are being displayed
        displayedConsumers = [];
        searchValue = searchValue.toLowerCase();
        dsConsumers.forEach(consumer => {
            var firstName = consumer.FirstName.toLowerCase();
            var lastName = consumer.LastName.toLowerCase();
            var fullName = `${lastName}, ${firstName}`;
            var fullNameReversed = `${lastName}, ${firstName}`;
            var matchesName = fullName.indexOf(searchValue);
            var matchesNameReverse = fullNameReversed.indexOf(searchValue);
            var consumerCard = document.querySelector(`[data-consumerid="${consumer.id}"]`);

            if (matchesName !== -1 || matchesNameReverse !== -1) {
                consumerCard.classList.remove('hidden');
                displayedConsumers.push(consumer.id);
            } else {
                consumerCard.classList.add('hidden');
                var index = displayedConsumers.indexOf(consumer.id);
                if (index > -1) displayedConsumers.splice(index, 1);
            }
        });
    }

    function convertDSValueToText(value) {
        var newtext;
        switch (value) {
            case 'C':
                newText = 'Combo';
                break;
            case 'A':
                newText = 'Adult Day';
                break;
            case 'V':
                newText = 'Voc. Hab.';
                break;
            case 'E':
                newText = 'Enclave';
                break;
            case 'N':
                newText = 'Non-Billable';
                break;
            case 'G':
                newText = 'Group Employment';
                break;
            //case 'H':
            //	newText = 'Restart Voc. Hab.';
            //	break;
            //case 'R':
            //	newText = 'Restart Adult Day';
            //	break;
            case 'X':
                newText = 'STEP Voc. Hab.';
                break;
            case 'S':
                newText = 'STEP Adult Day';
                break;
            case 'D':
                newText = 'Virtual Adult Day';
                break;
            case 'Y':
                newText = 'Virtual Voc. Hab.';
                break;
            default:
                newText = 'Day Service';
        }
        return newText;
    }

    function updateCurrentFilterDisplay() {

        var currentFilterDisplay = document.querySelector('.filteredByData');

        if (!currentFilterDisplay) {
            currentFilterDisplay = document.createElement('div');
            currentFilterDisplay.classList.add('filteredByData');
            filterButtonSet();
            currentFilterDisplay.appendChild(btnWrap);
        }

        currentFilterDisplay.style.maxWidth = '100%';

        if (document.getElementById('locationBtn') != null)
            document.getElementById('locationBtn').innerHTML = 'Location: ' + locationCache[locationID].locationName;

        if (document.getElementById('serviceDateBtn') != null)
            document.getElementById('serviceDateBtn').innerHTML = 'Date: ' + UTIL.formatDateFromIso(serviceDate);

        if (selectedGroupName === 'Everyone') {
            selectedGroupNameBtnWrap.style.display = 'none';
        } else {
            if (document.getElementById('groupNameBtn') != null)
                document.getElementById('groupNameBtn').innerHTML = 'Group: ' + selectedGroupName;
            selectedGroupNameBtnWrap.style.display = 'inherit';
        }
        return currentFilterDisplay;
    }

    function filterButtonSet() {
        filterBtn = button.build({
            text: 'Filter',
            icon: 'filter',
            style: 'secondary',
            type: 'contained',
            classNames: 'filterBtnNew',
            callback: () => { dayServicesFilterPopup('ALL') },
        });

        locationBtn = button.build({
            id: 'locationBtn',
            text: 'Location: ' + locationCache[locationID].locationName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { dayServicesFilterPopup('locationBtn') },
        });

        serviceDateBtn = button.build({
            id: 'serviceDateBtn',
            text: 'Date: ' + UTIL.formatDateFromIso(serviceDate),
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { dayServicesFilterPopup('serviceDateBtn') },
        });

        selectedGroupNameBtn = button.build({
            id: 'groupNameBtn',
            text: 'Group: ' + selectedGroupName,
            style: 'secondary',
            type: 'text',
            classNames: 'filterSelectionBtn',
            callback: () => { dayServicesFilterPopup('groupNameBtn') },
        });
        selectedGroupNameCloseBtn = button.build({
            icon: 'Delete',
            style: 'secondary',
            type: 'text',
            classNames: 'filterCloseBtn',
            callback: () => { closeFilter('groupNameBtn') },
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('filterBtnWrap');
        btnWrap.appendChild(filterBtn);

        locationBtnWrap = document.createElement('div');
        locationBtnWrap.classList.add('filterSelectionBtnWrap');
        locationBtnWrap.appendChild(locationBtn);
        btnWrap.appendChild(locationBtnWrap);

        serviceDateBtnWrap = document.createElement('div');
        serviceDateBtnWrap.classList.add('filterSelectionBtnWrap');
        serviceDateBtnWrap.appendChild(serviceDateBtn);
        btnWrap.appendChild(serviceDateBtnWrap);

        selectedGroupNameBtnWrap = document.createElement('div');
        selectedGroupNameBtnWrap.classList.add('filterSelectionBtnWrap');
        selectedGroupNameBtnWrap.appendChild(selectedGroupNameBtn);
        if ($.session.DayServiceCaseLoad === true && $.loadedApp === 'dayservices') { } else {
            selectedGroupNameBtnWrap.appendChild(selectedGroupNameCloseBtn);
        }       
        selectedGroupNameBtnWrap.setAttribute("id", "GroupNameCloseBtn");
        btnWrap.appendChild(selectedGroupNameBtnWrap);
    }

    function closeFilter(closeFilter) {
        if (closeFilter == 'groupNameBtn') {
            selectedGroupName = 'Everyone';
            temp__groupID = 'ALL'; 
        }
        filterApplyAction(filterPopup);
    }

    // Action Nav
    //-------------------------------------------------------------------------
    function handleActionNavEvent(target) {
        var targetAction = target.dataset.actionNav;

        switch (targetAction) {
            case 'miniRosterDone': {
                selectedConsumers = roster2.getActiveConsumers();
                selectedConsumers.forEach(consumer => {
                    const index = enabledConsumers.findIndex(x => x.id == consumer.id);
                    if (index === -1) {
                        //enabledConsumers.push(consumer);
                        enabledConsumers.push(consumer.id);
                    }
                });
                DOM.toggleNavLayout();
                roster2.clearActiveConsumers();
                clockInOutChoicePopup();

                break;
            }
            case 'miniRosterCancel': {
                //if (initRosterSelection) {
                //  loadApp('home');
                //} else {
                DOM.toggleNavLayout();
                //}
                break;
            }
        }
    }
    function setupActionNav() {
        multiSelectBtn = document.getElementById('multiSelectBtn');
        multiDeleteRecordBtn = button.build({
            text: 'Delete Record',
            style: 'secondary',
            type: 'contained',
            classNames: 'disabled',
            callback: function () {
                var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
                multiDeleteRecord(highlightedRows);
                //Reset Stuff
                ACTION_NAV.hide();
                enableMultiEdit = false;
                filterBtn.classList.toggle('disabled');
                multiSelectBtn.classList.toggle('enabled');
                miniRosterBtn.classList.toggle('disabled');
                multiSelectAllNoneArea.classList.add('hidden');
                //Un-select elements
                var selectedElms = document.querySelectorAll('.selected');
                [].forEach.call(selectedElms, function (el) {
                    el.classList.remove('selected');
                });
            },
        });

        multiInRecordBtn = button.build({
            text: 'Clock In',
            style: 'secondary',
            type: 'contained',
            classNames: 'disabled',
            callback: function () {
                var highlightedHeaders = [].slice.call(document.querySelectorAll('.card__header.selected'));
                multiInOutRecord('in', highlightedHeaders);
                //Reset Stuff
                ACTION_NAV.hide();
                enableMultiEdit = false;
                filterBtn.classList.toggle('disabled');
                multiSelectBtn.classList.toggle('enabled');
                miniRosterBtn.classList.toggle('disabled');
                multiSelectAllNoneArea.classList.add('hidden');
                //Un-select elements
                var selectedElms = document.querySelectorAll('.selected');
                [].forEach.call(selectedElms, function (el) {
                    el.classList.remove('selected');
                });
            },
        });

        multiOutRecordBtn = button.build({
            text: 'Clock Out',
            style: 'secondary',
            type: 'contained',
            classNames: 'disabled',
            callback: function () {
                var highlightedHeaders = [].slice.call(document.querySelectorAll('.card__header.selected'));
                multiInOutRecord('out', highlightedHeaders);
                //Reset Stuff
                ACTION_NAV.hide();
                enableMultiEdit = false;
                filterBtn.classList.toggle('disabled');
                multiSelectBtn.classList.toggle('enabled');
                miniRosterBtn.classList.toggle('disabled');
                multiSelectAllNoneArea.classList.add('hidden');
                //Un-select elements
                var selectedElms = document.querySelectorAll('.selected');
                [].forEach.call(selectedElms, function (el) {
                    el.classList.remove('selected');
                });
            },
        });

        ACTION_NAV.clear();
        ACTION_NAV.populate([multiInRecordBtn, multiOutRecordBtn, multiDeleteRecordBtn]);
        ACTION_NAV.hide();
    }

    // Filter
    //-------------------------------------------------------------------------
    function populateFilterGroupDropdown() {
        let groupCodeObj = {};

        const data = rosterGroupResults.map(r => {
            // dataObj for quick lookup
            if (!groupCodeObj[r.GroupCode]) {
                groupCodeObj[r.GroupCode] = {
                    groupCode: r.GroupCode,
                    groupName: r.GroupName,
                    members: r.Members ? r.Members.split('|') : r.Members,
                };
            }

            return {
                //value: `${r.GroupCode}-${r.RetrieveID}`,
                value: r.GroupCode,
                text: r.GroupName,
                attributes: [{ key: 'data-retrieveId', value: r.RetrieveID }],
            };
        });
        if ($.session.DayServiceCaseLoad === true && $.loadedApp === 'dayservices') {
            defaultVal = 'CAS'; 
        } else {
            defaultVal = !filterGroupID || filterGroupID === '%' ? 'ALL' : filterGroupID;
        }        
        dropdown.populate(filterGroupDropdown, data, defaultVal); 
    }
    function dayServicesFilterPopup(IsShow) {
        filterPopup = POPUP.build({
            classNames: 'dayServiceFilterPopup',
            header: 'Filter',
            id: 'dayServiceFilterPopup',
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(fitlerApplyBtn);

        if (IsShow == 'ALL' || IsShow == 'serviceDateBtn')
            filterPopup.appendChild(filterDateInput);
        if (IsShow == 'ALL' || IsShow == 'locationBtn')
            filterPopup.appendChild(filterLocationDropdown);
        if (IsShow == 'ALL' || IsShow == 'groupNameBtn')
            filterPopup.appendChild(filterGroupDropdown);
        filterPopup.appendChild(btnWrap);
        POPUP.show(filterPopup);

        dropdown.populate(filterLocationDropdown, locationDropdownData, locationID);
        populateFilterGroupDropdown();
    }
    function filterApplyAction(popup) {
        //I need to close the filter popup after clicking apply and not in the callback of an AJAX call.
        //Issue is if there is a slow connection the apply button can be clicked multiple times.
 
        if (temp__serviceDate) {
            serviceDate = temp__serviceDate;
            roster2.updateSelectedDate(serviceDate);
        }
        if (temp__groupID) {
            filterGroupID = temp__groupID;
            filterGroupRetrieveID = temp__retrieveID;
        }

        //MAT
        locationName = filterLocationDropdown.firstElementChild.options[filterLocationDropdown.firstElementChild.selectedIndex].innerText;
        locationID = filterLocationDropdown.firstElementChild.options[filterLocationDropdown.firstElementChild.selectedIndex].value;

        roster2.updateSelectedLocationId(locationID, locationName);
        noLocationSet = locationID === '' ? true : false;
        checkForNoLocation();

        // Update Default Location if Remember Last Location is set:
        if (defaults.rememberLastLocation('dayServices'))
            defaults.setLocation('dayServices', locationID);

        updateCurrentFilterDisplay();

        //1) get enabled consumers
        try {
            dayServiceAjax.getDayServiceGetEnabledConsumers(serviceDate, locationID, res => {
                fitlerApplyBtn.disabled = false;

                const allowedConsumers = [];
                res.forEach(r => {
                    const consumer_id = r.consumerId;
                    allowedConsumers.push({ consumer_id: consumer_id });
                    enabledConsumers.push(consumer_id);
                });
                roster2.setAllowedConsumers(allowedConsumers);
                doStuff();
            });
        } catch (error) {
            fitlerApplyBtn.disabled = false;
            POPUP.hide(popup);
        }

        function doStuff() {
            getDayServiceActivity(() => {
                //2.1) Check if location/Date combo is batched
                checkIfBatched();
                dsCardArea.innerHTML = '';
                buildCards();
            });

            //3) get CI staff for new location and date
            //dayServiceAjax.getCiStaff(serviceDate, locationID, (res) => {
            //	ciDropdownData = res.map((ci) => {
            //		var id = `ci-${ci.id}`;
            //		var value = ci.id;
            //		var text = ci.fullName;
            //		return {
            //			id,
            //			value,
            //			text,
            //		};
            //	});
            //	ciDropdownData.unshift({ id: 'ci-0', value: '', text: '' });
            //});

            //4) get groups for new location
            dayServiceAjax.getDayServiceGroups($.session.Token, locationID, res => {
                dsGroupsCache = {};
                groupDropdownData = res.map((group, index) => {
                    var { groupId, groupDescription } = group;
                    if (index === 0) selectedGroupId = groupId;

                    if (!dsGroupsCache[groupId]) {
                        dsGroupsCache[groupId] = {
                            id: groupId,
                            value: groupDescription,
                        };
                    }

                    return {
                        id: groupId,
                        value: groupId,
                        text: groupDescription,
                    };
                });
                groupDropdownData.unshift({ id: '%', value: '', text: '' });
            });
        }
    }

    // DS Cards
    //-------------------------------------------------------------------------
    function handleDayServiceCardEvents(element, consumer) {
        var isRow = event.target.classList.contains('table__row');
        var isHeader = event.target.classList.contains('card__header');
        // consumer = event.target.dataset.consumerid;

        if (!isRow && !isHeader) return; // if not row or header return
        if (isRow) {
            if (enableMultiEdit) {
                event.target.classList.toggle('selected');
                var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
                if (highlightedRows.length > 0) {
                    multiDeleteRecordBtn.classList.remove('disabled');
                } else {
                    multiDeleteRecordBtn.classList.add('disabled');
                }
            } else if (!enableMultiEdit) {
                rowPopup(element, consumer);
            }
        }
        if (isHeader) {
            if (enableMultiEdit) {
                event.target.classList.toggle('selected');
                var highlightedHeaders = [].slice.call(document.querySelectorAll('.card__header.selected'));
                if (highlightedHeaders.length > 0) {
                    multiOutRecordBtn.classList.remove('disabled');
                    multiInRecordBtn.classList.remove('disabled');
                } else {
                    multiInRecordBtn.classList.add('disabled');
                    multiOutRecordBtn.classList.add('disabled');
                }
            }
        }
    }
    function buildCards() {
        if (!dsConsumers || dsConsumers.length === 0) {
            // show message
            const message = `There are no individuals clocked in at this location for the selected date. Please use the Roster button below to select individuals to clock in.`;
            dsCardArea.innerHTML = `<h3 class="error">${message}</h3>`;
            return;
        }

        //sort consumers Alphabeically
        dsConsumers.sort(function (a, b) {
            var textA = a.LastName.toUpperCase();
            var textB = b.LastName.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        //For each unique consumer, create a card:
        dsConsumers.forEach(consumer => {
            var card = document.createElement('div');
            card.classList.add('card', 'dayServiceActivityCard');
            card.setAttribute('data-consumerID', consumer.id);
            card.setAttribute('id', 'consumer-' + consumer.id);

            var cardHeader = document.createElement('div');
            cardHeader.classList.add('card__header');
            cardHeader.setAttribute('data-consumerID', consumer.id);

            var cardBody = document.createElement('div');
            cardBody.classList.add('card__body');

            cardHeader.innerHTML = `
      <img 
          src="./images/portraits/${consumer.id}.png"
          onerror="this.src='./images/new-icons/default.jpg'"
      />
      <h3>${activityCache[consumer.id][0].FirstName} ${activityCache[consumer.id][0].LastName}</h3>
      <p class="accuityDisplay">${activityCache[consumer.id][0].Acuity === ''
                    ? ''
                    : 'Acuity: ' + activityCache[consumer.id][0].Acuity
                }</p>
      `;

            var cardBodyHeader = document.createElement('div');
            cardBodyHeader.innerHTML = `<div>In</div><div>Out</div><div>DS Type</div><div>Group</div>`; //<div>CI</div>
            cardBodyHeader.classList.add('dayServiceCardBodyHeader');
            cardBody.appendChild(cardBodyHeader);

            card.appendChild(cardHeader);
            card.appendChild(cardBody);

            //For each activity that consumer has, create a new row:
            activityCache[consumer.id].forEach(act => {
                var dsGroup = dsGroupsCache[act.dsGroupId];
                var dsGroupValue = dsGroup ? dsGroup.value : null;
                var displayStartTime = UTIL.convertFromMilitary(act.Start_Time);
                var displayEndTime = UTIL.convertFromMilitary(act.Stop_Time);
                var cardRow = document.createElement('div');
                cardRow.classList.add('dayServiceCardRow', 'table__row');

                if (act.Day_Service_Type !== '')
                    var dayServiceDisplay = convertDSValueToText(act.Day_Service_Type);
                else var dayServiceDisplay = icons.error;

                //A V N allow CI
                //let allowCI = false;
                //let hasCI = false;
                //if (checkForCI(act.Day_Service_Type)) {
                //	cardRow.setAttribute('data-allow-CI', true);
                //	allowCI = true;
                //	if (act.ciStaffID !== '') {
                //		cardRow.setAttribute('data-has-CI', true);
                //		hasCI = true;
                //	} else {
                //		cardRow.setAttribute('data-has-CI', false);
                //	}
                //} else {
                //	cardRow.setAttribute('data-allow-CI', false);
                //}

                //ADD in time and consumer ID data attributes for easier multi-select opperations
                cardRow.setAttribute('data-in-time', act.Start_Time);
                cardRow.setAttribute('data-consumer-id', consumer.id);

                cardRow.innerHTML = `
          <div>${displayStartTime}</div>
          <div>${displayEndTime === '' ? icons.error : displayEndTime}</div>
          <div>${dayServiceDisplay}</div> 
          <div>${dsGroupValue ? dsGroupValue : act.Day_Service_Type === 'S' || act.Day_Service_Type === 'X' ? icons.error : '-'}</div>           
          `;
                //<div>${allowCI === true ? (hasCI === true ? icons.checkmark : '-') : '-'}</div>
                //View only has no need to click on a row:
                if ($.session.DayServiceUpdate) {
                    cardRow.addEventListener('click', function () {
                        handleDayServiceCardEvents(event.target, consumer.id);
                    });
                }
                cardBody.appendChild(cardRow);
            });

            cardHeader.addEventListener('click', function () {
                handleDayServiceCardEvents(event.target);
            });
            dsCardArea.appendChild(card);
        });

        //Add place holders for odd number of cards;
        var placeholder1 = document.createElement('div');
        var placeholder2 = document.createElement('div');
        var placeholder3 = document.createElement('div');
        var placeholder4 = document.createElement('div');
        placeholder1.classList.add('cardPlaceholder');
        placeholder2.classList.add('cardPlaceholder');
        placeholder3.classList.add('cardPlaceholder');
        placeholder4.classList.add('cardPlaceholder');
        dsCardArea.appendChild(placeholder1);
        dsCardArea.appendChild(placeholder2);
        dsCardArea.appendChild(placeholder3);
        dsCardArea.appendChild(placeholder4);
    }

    //==== Muti Button Stuff =========================
    function enableMultiEditRows(multiBtn) {
        setupActionNav();
        miniRosterBtn = document.querySelector('.consumerListBtn');
        miniRosterBtn.classList.toggle('disabled');

        enableMultiEdit = !enableMultiEdit;
        multiBtn.classList.toggle('enabled');

        if (enableMultiEdit) {
            multiSelectAllNoneArea.classList.remove('hidden');
            ACTION_NAV.show();
        } else {
            multiSelectAllNoneArea.classList.add('hidden');
            ACTION_NAV.hide();
        }

        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));
        var highlightedHeaders = [].slice.call(document.querySelectorAll('.card__header.selected'));
        highlightedHeaders.forEach(header => header.classList.remove('selected'));
    }
    //When Delete record button is clicked -
    function multiDeleteRecord(highlightedRows) {
        deleteConfirmation(
            null,
            (res = () => {
                if (res) {
                    var recordsToDelete = '';
                    highlightedRows.forEach(row => {
                        recordsToDelete += `${row.dataset.consumerId},${row.dataset.inTime}|`;
                    });
                    deleteDSRecord(recordsToDelete);
                }
            }),
        );
    }
    //when in or out button is clicked -
    function multiInOutRecord(type, highlightedHeaders) {
        selectedConsumers = [];
        highlightedHeaders.forEach(row => {
            obj = {};
            obj['id'] = row.dataset.consumerid;
            selectedConsumers.push(obj);
        });
        clockInOutActionPopup(type);
    }

    //====== POPUP WHEN CLICKING ON A ACTIVITY ROW =========================
    function rowPopup(element, consumer) {
        //==== !No Popup When Location is Batched! ====
        if (currentLocationBatched) {
            return;
        }
        //======= REST =========
        var ciStaffID;
        var dsType;
        var groupID;
        var newInTime;
        var newOutTime;

        let outTime =
            element.childNodes[3].childElementCount !== 0
                ? null
                : UTIL.convertToMilitary(element.childNodes[3].innerHTML);
        let inTime = UTIL.convertToMilitary(element.childNodes[1].innerHTML);
        activityCache[consumer].forEach(act => {
            if (act.Start_Time === inTime) {
                ciStaffID = act.ciStaffID;
                dsType = act.Day_Service_Type;
                groupID = act.dsGroupId;
            }
        });

        var popup = POPUP.build({
            classNames: 'dayServiceRowPopup',
            header: `${activityCache[consumer][0].FirstName} ${activityCache[consumer][0].LastName}`,
            id: `consumer${consumer}`,
        });

        var inTimeField = input.build({
            id: 'inTime',
            label: 'In Time',
            type: 'time',
            style: 'secondary',
            value: inTime,
        });
        var outTimeField = input.build({
            id: 'outTime',
            label: 'Out Time',
            type: 'time',
            style: 'secondary',
            value: outTime,
        });

        var dsTypeDropdown = dropdown.build({
            dropdownId: 'dsTypeDropdown',
            label: 'DS Type',
            style: 'secondary',
        });
        //var ciDropdown = dropdown.build({
        //	dropdownId: 'ciDropdown',
        //	label: 'CI',
        //	style: 'secondary',
        //});
        groupDropdown = dropdown.build({
            id: 'groupDropdown',
            dropdownId: 'groupDropdown',
            label: 'Group',  
            style: 'secondary',
        });

        saveBtn = button.build({
            text: 'Save',
            id: 'rowSaveBtn',
            style: 'secondary',
            type: 'contained',
            icon: 'save',
            callback: function () {
                if (IsSaveBtnDisable) {
                    dsTypeDropdown = document.getElementById('dsTypeDropdown');
                    //ciStaffDropdown = document.getElementById('ciDropdown');
                    groupDropdown = document.getElementById('groupDropdown');
                    //if (ciStaffDropdown) ciStaffID = ciStaffDropdown.options[ciStaffDropdown.selectedIndex].value;
                    if (groupDropdown)
                        selectedGroupId = groupDropdown.options[groupDropdown.selectedIndex].value;
                    selectedDSType = dsTypeDropdown.options[dsTypeDropdown.selectedIndex].value;
                    saveTypeAndCi(
                        consumer,
                        inTime,
                        newInTime,
                        outTime,
                        newOutTime,
                        selectedDSType,
                        ciStaffID,
                        selectedGroupId,
                    );
                    POPUP.hide(popup);
                }
                IsSaveBtnDisable = true;
            },
        });
        var deleteBtn = button.build({
            text: 'Delete Record',
            style: 'secondary',
            type: 'outlined',
            icon: 'delete',
            callback: function () {
                deleteConfirmation(
                    popup,
                    (res = () => {
                        if (res) {
                            consumerDeleteString = `${consumer},${inTime}|`;
                            deleteDSRecord(consumerDeleteString);
                            POPUP.hide(popup);
                        }
                    }),
                );
            },
        });

        inTimeField.addEventListener('change', () => {
            let inTimeField = document.getElementById('inTime');
            newInTime = inTimeField.value;
        });

        outTimeField.addEventListener('change', () => {
            let outTimeField = document.getElementById('outTime');
            newOutTime = outTimeField.value;
        });

        dsTypeDropdown.addEventListener('change', () => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            selectedDSType = selectedOption.value;
            checkRequiredFieldsOfNewEntry();
            //let allowCi = checkForCI();
            //if (allowCi) {
            //	ciDropdown.style.display = '';
            //	dropdown.populate(ciDropdown, ciDropdownData);
            //} else {
            //	ciDropdown.style.display = 'none';
            //}
        });

        saveBtn.addEventListener('keypress', event => {
            if (event.keyCode === 13 && saveBtn.classList.contains('disabled')) {
                IsSaveBtnDisable = false;
            }
        });

        groupDropdown.addEventListener('change', () => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            selectedGroup = selectedOption.innerText;
            selectedGroupId = selectedOption.id;
            checkRequiredFieldsOfNewEntry();
        });

        btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(saveBtn);
        btnWrap.appendChild(deleteBtn);

        popup.appendChild(inTimeField);
        popup.appendChild(outTimeField);
        popup.appendChild(dsTypeDropdown);
        popup.appendChild(groupDropdown);
        //popup.appendChild(ciDropdown);
        //ciDropdown.style.display = element.dataset.allowCi === 'true' ? 'auto' : 'none';
        popup.appendChild(btnWrap);
        POPUP.show(popup);

        dropdown.populate(dsTypeDropdown, dsDropdownData, dsType);
        //dropdown.populate(ciDropdown, ciDropdownData, ciStaffID);
        dropdown.populate(groupDropdown, groupDropdownData, groupID);
        checkRequiredFieldsOfNewEntry();
    }

    //====== POPUP WARNING WHEN CONSUMER HAS EXISTING DAY SERVICE ACTIVITY ===========
    function consumerExistingDayServicePopup(consumerList) {
        var popup = POPUP.build({
            header: 'At least one consumer has existing day service activity at another location.',
        });

        var continueBtn = button.build({
            text: 'Continue',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                clockInOutActionPopup('in');
            },
        });

        var cancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: function () {
                POPUP.hide(popup);
                roster2.clearActiveConsumers();
            },
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(continueBtn);
        btnWrap.appendChild(cancelBtn);

        var textArea;
        consumerList.forEach(consumer => {
            textArea = document.createElement('p');
            textArea.innerHTML = `
          <div>Name: ${consumer.name}</div>
          <div>Location: ${consumer.location}</div> 
          <div>Start Time: ${consumer.startTime}</div> 
          <div>End Time: ${consumer.endTime}</div> 
          <div><br></div>
        `;
            popup.appendChild(textArea);
        });

        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }


    function checkRequiredFieldsOfNewEntry() {

        var selectedGroupId = '';
        var selectedDSTypeId = '';
        var group = document.getElementById('groupDropdown');
        var dsType = document.getElementById('dsTypeDropdown');
        if (group)
            selectedGroupId = group.options[group.selectedIndex].value;
        if (dsType)
            selectedDSTypeId = dsType.options[dsType.selectedIndex].value;

        if (selectedGroupId === '' && (selectedDSTypeId == 'X' || selectedDSTypeId == 'S')) {
            groupDropdown.classList.add('error');
        } else {
            groupDropdown.classList.remove('error');
        }
        setBtnStatusOfSave();
    }

    function setBtnStatusOfSave() {
        var hasErrors = [].slice.call(document.querySelectorAll('.error'));
        if (hasErrors.length !== 0) {
            saveBtn.classList.add('disabled');
            return;
        } else {
            saveBtn.classList.remove('disabled');
        }
    }

    //====== POPUP DISPLAYING OPTION TO CLOCKIN OR CLOCK OUT =========================
    function clockInOutChoicePopup() {
        let popup = POPUP.build({
            header: 'Please Choose an Option',
            id: 'clockInOutChoicePopup',
        });

        let clockInBtn = button.build({
            text: 'Clock In',
            style: 'secondary',
            type: 'contained',
            callback: async function () {
                POPUP.hide(popup);

                const idString = selectedConsumers.map(function (sc) {
                    return sc.id
                }).join(",");

                //Get a list of any existing day service activity for this consumer, on today's date, on other locations
                const clockedInConsumers = await dayServiceAjax.getDayServiceClockedInConsumers({
                    token: $.session.Token,
                    consumerIdString: idString,
                    serviceDate: serviceDate,
                    locationId: locationID,
                });

                //If the consumer has no existing day service activity, behave normally...
                if (clockedInConsumers.length === 0) {
                    clockInOutActionPopup('in');
                } else {
                    consumerExistingDayServicePopup(clockedInConsumers);
                }
            },
        });
        let clockOutBtn = button.build({
            text: 'Clock Out',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(popup);
                clockInOutActionPopup('out');
            },
        });
        let btnWrap = document.createElement('div');
        btnWrap.classList.add('choiceBtnWrap');
        btnWrap.appendChild(clockInBtn);
        btnWrap.appendChild(clockOutBtn);
        popup.appendChild(btnWrap);
        POPUP.show(popup);
    }

    //====== ACTION FOR CLOCKING IN OR OUT =========================
    // in / clock out popup
    function clockInOutActionPopup(choice) {
        let inPopup = POPUP.build({
            header: 'Clock In',
            id: 'clockInOutPopup',
        });

        let outPopup = POPUP.build({
            header: 'Clock Out',
            id: 'clockInOutPopup',
        });

        var currentTime = UTIL.getCurrentTime();

        let timeInField = input.build({
            id: 'inTime',
            label: 'In Time',
            type: 'time',
            style: 'secondary',
            value: currentTime,
        });

        let timeOutField = input.build({
            id: 'outTime',
            label: 'Out Time',
            type: 'time',
            style: 'secondary',
            value: currentTime,
        });

        let clockInBtn = button.build({
            text: 'Clock In',
            style: 'secondary',
            type: 'contained',
            id: 'clockInBtn',
            callback: function () {
                clockIn(timeInField);
                POPUP.hide(inPopup);
                roster2.clearActiveConsumers();
                //Clock in function
            },
        });

        let clockOutBtn = button.build({
            text: 'Clock Out',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                clockOut();
                roster2.clearActiveConsumers();
                POPUP.hide(outPopup);
                //clock out function
            },
        });

        let inCancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: function () {
                roster2.clearActiveConsumers();
                POPUP.hide(inPopup);
            },
        });

        let outCancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
            callback: function () {
                roster2.clearActiveConsumers();
                POPUP.hide(outPopup);
            },
        });

        let btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        timeInField.addEventListener('change', function () {
            let inTimeField = document.getElementById('inTime');
            if (inTimeField.value === '') {
                clockInBtn.classList.add('disabled');
                timeInField.classList.add('error');
            } else {
                clockInBtn.classList.remove('disabled');
                timeInField.classList.remove('error');
            }
        });

        timeOutField.addEventListener('change', function () {
            let outTimeField = document.getElementById('outTime');
            if (outTimeField.value === '') {
                clockOutBtn.classList.add('disabled');
                timeOutField.classList.add('error');
            } else {
                clockOutBtn.classList.remove('disabled');
                timeOutField.classList.remove('error');
            }
        });

        switch (choice) {
            case 'in': {
                inPopup.appendChild(timeInField);
                btnWrap.appendChild(clockInBtn);
                btnWrap.appendChild(inCancelBtn);
                inPopup.appendChild(btnWrap);
                POPUP.show(inPopup);
                break;
            }
            case 'out': {
                outPopup.appendChild(timeOutField);
                btnWrap.appendChild(clockOutBtn);
                btnWrap.appendChild(outCancelBtn);
                outPopup.appendChild(btnWrap);
                POPUP.show(outPopup);
                break;
            }
        }
    }

    function clockIn() {
        let inTime = document.getElementById('inTime').value;
        inTime += ':00';
        let clockInConsumerString = formatConsumersForClockIn(selectedConsumers);
        let selectedConsumerCount = selectedConsumers.length;
        //get consuemrs with existing clockins TODO. call new ajax. $.session.Token
        dayServiceAjax.dayServiceClockIn(
            clockInConsumerString,
            serviceDate,
            locationID,
            inTime,
            res => {
                //Overlap error occured
                if (res.indexOf('615') !== -1) {
                    let start = res.search('<consumers>');
                    let end = res.search('</consumers>');
                    var overlapConsumers = res.substring(start + 11, end - 1).split('|');
                }
                getDayServiceActivity(cb => {
                    dsCardArea.innerHTML = '';
                    buildCards();
                    if (overlapConsumers) {
                        overlapConsumers.forEach(consumer => {
                            let card = document.getElementById('consumer-' + consumer);
                            cardHeader = card.querySelector('.card__header');
                            cardHeader.classList.add('overlapError');
                            accuityDisplay = cardHeader.querySelector('.accuityDisplay');
                            accuityDisplay.innerHTML = 'TIME OVERLAP';
                        });
                    }
                });
            },
        );
        selectedConsumers = null;
    }

    function clockOut() {
        let outTime = document.getElementById('outTime').value;
        outTime += ':00';
        let clockOutConsumerString = formatConsumersForClockOut(selectedConsumers);
        dayServiceAjax.updateDayServiceActivity(
            clockOutConsumerString,
            'Stop Time',
            outTime,
            serviceDate,
            locationID,
            '',
            selectedGroupId,
            res => {
                //Overlap error occured
                if (res.indexOf('615') !== -1) {
                    let start = res.search('<consumers>');
                    let end = res.search('</consumers>');
                    var overlapConsumers = res.substring(start + 11, end - 1).split('|');
                }
                getDayServiceActivity(cb => {
                    dsCardArea.innerHTML = '';
                    buildCards();
                    if (overlapConsumers) {
                        overlapConsumers.forEach(consumer => {
                            let card = document.getElementById('consumer-' + consumer);
                            cardHeader = card.querySelector('.card__header');
                            cardHeader.classList.add('overlapError');
                            accuityDisplay = cardHeader.querySelector('.accuityDisplay');
                            accuityDisplay.innerHTML = 'TIME OVERLAP';
                        });
                    }
                });
            },
        );
        selectedConsumers = null;
    }

    function deleteDSRecord(consumerDeleteString) {
        // let consumerString = `${consumerId},${inTime}|`;
        dayServiceAjax.deleteDayServiceActivity(consumerDeleteString, serviceDate, locationID, res => {
            getDayServiceActivity(cb => {
                dsCardArea.innerHTML = '';
                buildCards();
            });
        });
    }
    //POPUP for confirming the delete action
    function deleteConfirmation(orgPopup, callback) {
        if (orgPopup) POPUP.hide(orgPopup);

        var confPopup = POPUP.build({
            classNames: 'warning',
        });

        var cancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'contained',
            icon: 'no',
            callback: function () {
                POPUP.hide(confPopup);
                if (orgPopup) POPUP.show(orgPopup);
                callback((res = false));
            },
        });
        var confirmBtn = button.build({
            text: 'Delete Entry',
            style: 'secondary',
            type: 'outlined',
            id: 'confDeleteBtn',
            icon: 'delete',
            callback: function () {
                POPUP.hide(confPopup);
                callback((res = true));
            },
        });

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(cancelBtn);
        btnWrap.appendChild(confirmBtn);

        var textArea = document.createElement('p');
        textArea.classList.add('warningTextArea');
        textArea.innerHTML = 'Are you sure you want to delete this record?';
        confPopup.appendChild(textArea);
        confPopup.appendChild(btnWrap);
        POPUP.show(confPopup);
    }

    //Update single DS record from the row popup. Curently updates everything even if it wasn't changed.
    function saveTime(
        consumerId,
        orgInTime,
        newInTime,
        orgEndTime,
        newOutTime,
        selectedDSType,
        ciStaffId,
    ) {
        let consumerString = `${consumerId},${orgInTime}|`;

        //Update Start Time && Stop Times
        if (newInTime && newOutTime) {
            newInTime += ':00';
            newOutTime += ':00';
            try {
                if (newInTime > newOutTime) {
                    throw 'overlap';
                }
                dayServiceAjax.updateDayServiceActivity(
                    consumerString,
                    'Start Time',
                    newInTime,
                    serviceDate,
                    locationID,
                    '',
                    selectedGroupId,
                    res => {
                        if (res.indexOf('615') !== -1) errorPopup('Start Time Overlaps with existing Activity');
                    },
                );
                dayServiceAjax.updateDayServiceActivity(
                    consumerString,
                    'Stop Time',
                    newOutTime,
                    serviceDate,
                    locationID,
                    '',
                    selectedGroupId,
                    res => {
                        if (res.indexOf('615') !== -1) errorPopup('Stop Time Overlaps with existing Activity');
                        //Finally - Reload DS Card Area
                        getDayServiceActivity(() => {
                            //1) get activity from DB, 2(cb) rebuild the cards.
                            dsCardArea.innerHTML = '';
                            buildCards();
                        });
                    },
                );
                newInTime = null;
                newOutTime = null;
            } catch (e) {
                if (e === 'overlap') {
                    errorPopup('Times Overlap');
                }
            }
        }
        //Only New In Time
        else if (newInTime && !newOutTime) {
            newInTime += ':00';
            try {
                if (newInTime > orgEndTime) {
                    throw 'overlap';
                }
                dayServiceAjax.updateDayServiceActivity(
                    consumerString,
                    'Start Time',
                    newInTime,
                    serviceDate,
                    locationID,
                    '',
                    selectedGroupId,
                    res => {
                        if (res.indexOf('615') !== -1) errorPopup('Start Time Overlaps with existing Activity');
                        //Finally - Reload DS Card Area
                        getDayServiceActivity(() => {
                            //1) get activity from DB, 2(cb) rebuild the cards.
                            dsCardArea.innerHTML = '';
                            buildCards();
                        });
                    },
                );
                newInTime = null;
            } catch (e) {
                if (e === 'overlap') {
                    errorPopup('Start Time Overlaps with End Time');
                }
            }
        }
        //Only New Out Time
        else if (newOutTime && !newInTime) {
            newOutTime += ':00';
            try {
                if (newOutTime < orgInTime) {
                    throw 'overlap';
                }
                dayServiceAjax.updateDayServiceActivity(
                    consumerString,
                    'Stop Time',
                    newOutTime,
                    serviceDate,
                    locationID,
                    '',
                    selectedGroupId,
                    res => {
                        if (res.indexOf('615') !== -1) errorPopup('Stop Time Overlaps with existing Activity');
                        //Finally - Reload DS Card Area
                        getDayServiceActivity(() => {
                            //1) get activity from DB, 2(cb) rebuild the cards.
                            dsCardArea.innerHTML = '';
                            buildCards();
                        });
                    },
                );
                newOutTime = null;
            } catch (e) {
                if (e === 'overlap') {
                    errorPopup('Stop Time Overlaps with Start Time');
                }
            }
        } else
            getDayServiceActivity(() => {
                //1) get activity from DB, 2(cb) rebuild the cards.
                dsCardArea.innerHTML = '';
                buildCards();
            });
    }

    function saveTypeAndCi(
        consumerId,
        orgInTime,
        newInTime,
        orgEndTime,
        newOutTime,
        selectedDSType,
        ciStaffId,
        selectedGroupId,
    ) {
        let consumerString = `${consumerId},${orgInTime}|`;
        //Update Ds Type
        var updateDSTypePromise = new Promise(function (resolve, reject) {
            dayServiceAjax.updateDayServiceActivity(
                consumerString,
                'Service Type',
                newInTime,
                serviceDate,
                locationID,
                selectedDSType,
                selectedGroupId,
                () => {
                    resolve('success');
                },
            );
        });

        //Update CI
        if (checkForCI() && ciStaffId !== '') {
            var updateCIPromise = new Promise(function (resolve, reject) {
                dayServiceAjax.updateCIStaff(
                    consumerId,
                    ciStaffId,
                    orgInTime,
                    serviceDate,
                    locationID,
                    () => {
                        resolve('success');
                    },
                );
            });
        } else {
            var deleteCIPromise = new Promise(function (resolve, reject) {
                dayServiceAjax.deleteCIStaffId(consumerId, orgInTime, serviceDate, locationID, () => {
                    resolve('success');
                });
            });
        }

        if (updateCIPromise) {
            Promise.all([updateDSTypePromise, updateCIPromise]).then(function () {
                saveTime(
                    consumerId,
                    orgInTime,
                    newInTime,
                    orgEndTime,
                    newOutTime,
                    selectedDSType,
                    ciStaffId,
                );
            });
        } else if (deleteCIPromise) {
            Promise.all([updateDSTypePromise, deleteCIPromise]).then(function () {
                saveTime(
                    consumerId,
                    orgInTime,
                    newInTime,
                    orgEndTime,
                    newOutTime,
                    selectedDSType,
                    ciStaffId,
                );
            });
        }
    }

    function buildPageComponents() {
        // custom search stuff
        SEARCH_BTN = button.build({
            id: 'searchBtn',
            text: 'Search',
            icon: 'search',
            style: 'secondary',
            type: 'contained',
        });

        SEARCH_WRAP = document.createElement('div');
        SEARCH_WRAP.classList.add('consumerSearch');
        SEARCH_INPUT = document.createElement('input');
        SEARCH_INPUT.setAttribute('placeholder', 'search consumers');
        SEARCH_WRAP.appendChild(SEARCH_BTN);
        SEARCH_WRAP.appendChild(SEARCH_INPUT);


        mulitSelectBtn = button.build({
            text: 'Multi Select',
            icon: 'multiSelect',
            style: 'secondary',
            type: 'contained',
            classNames: 'multiSelectBtn',
            id: 'multiSelectBtn',
            callback: function () {
                enableMultiEditRows(mulitSelectBtn);
                filterBtn.classList.toggle('disabled');
            },
        });

        multiSelectAllBtn = button.build({
            text: 'Select All',
            icon: 'selectAll',
            style: 'secondary',
            type: 'contained',
            classNames: 'multiSelectAllBtn',
            callback: function () {
                if (Object.keys(activityCache).length === displayedConsumers.length) {
                    var allRows = [].slice.call(document.querySelectorAll('.table__row'));
                    var allHeaders = [].slice.call(document.querySelectorAll('.card__header'));
                    allRows.forEach(row => row.classList.add('selected'));
                    allHeaders.forEach(header => header.classList.add('selected'));
                    if (allRows.length !== 0) {
                        multiOutRecordBtn.classList.remove('disabled');
                        multiInRecordBtn.classList.remove('disabled');
                        multiDeleteRecordBtn.classList.remove('disabled');
                    }
                } else if (displayedConsumers.length !== 0) {
                    displayedConsumers.forEach(consumer => {
                        var card = document.getElementById(`consumer-${consumer}`);
                        card.querySelector('.card__header').classList.add('selected');
                        var rows = card.querySelectorAll('.table__row');
                        rows.forEach(row => row.classList.add('selected'));
                        multiOutRecordBtn.classList.remove('disabled');
                        multiInRecordBtn.classList.remove('disabled');
                        multiDeleteRecordBtn.classList.remove('disabled');
                    });
                }
            },
        });

        multiSelectNoneBtn = button.build({
            text: 'Select None',
            icon: 'deSelectAll',
            style: 'secondary',
            type: 'contained',
            classNames: 'multiSelectNoneBtn',
            callback: function () {
                multiOutRecordBtn.classList.add('disabled');
                multiInRecordBtn.classList.add('disabled');
                multiDeleteRecordBtn.classList.add('disabled');
                var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
                highlightedRows.forEach(row => row.classList.remove('selected'));
                var highlightedHeaders = [].slice.call(document.querySelectorAll('.card__header.selected'));
                highlightedHeaders.forEach(header => header.classList.remove('selected'));
            },
        });

        filterLocationDropdown = dropdown.build({
            dropdownId: 'dsLocationDropdown',
            label: 'Location',
            style: 'secondary',
        });

        var isDisabld = false;
        if ($.session.DayServiceCaseLoad === true && $.loadedApp === 'dayservices') {
            isDisabld = true;
        }

        filterGroupDropdown = dropdown.build({
            dropdownId: 'dsGroupDropdown',
            label: 'Group',
            style: 'secondary',
            readonly: isDisabld,  
        });

        filterDateInput = input.build({
            id: 'dsFilterDate',
            label: 'Date',
            type: 'date',
            style: 'secondary',
            value: serviceDate,
            attributes: [{ key: 'max', value: UTIL.getTodaysDate() }],
        });

        fitlerApplyBtn = button.build({
            id: 'filterApply',
            text: 'Apply',
            style: 'secondary',
            type: 'contained',
            icon: 'checkmark',
            disabled: false,
            callback: function () {
                fitlerApplyBtn.disabled = true;
                filterApplyAction(filterPopup);
                POPUP.hide(filterPopup);  
            },
        });

        updateCurrentFilterDisplay();

        //Disable multi-select button where there are 0 consumers displayed:
        // if (displayedConsumers.length === 0) multiSelectBtn.classList.add('disabled');

        multiSelectAllNoneArea = document.createElement('div');
        multiSelectAllNoneArea.classList.add('btnWrap');
        multiSelectAllNoneArea.setAttribute('id', 'selectAllSelectNoneWrap');
        multiSelectAllNoneArea.appendChild(multiSelectAllBtn);
        multiSelectAllNoneArea.appendChild(multiSelectNoneBtn);
        multiSelectAllNoneArea.classList.add('hidden');

        function getFilterValues() {
            return (filterValues = {
                dayServiceLocation: locationID,
                dayServiceServiceDate: serviceDate,
            });
        }
        // Helper function to create the main reports button on the module page
        function createMainReportButton(buttonsData) {
            return button.build({
                text: 'Reports',
                icon: 'add',
                style: 'secondary',
                type: 'contained',
                classNames: 'reportBtn',
                callback: function () {
                    // Iterate through each item in the buttonsData array
                    buttonsData.forEach(function (buttonData) {
                        buttonData.filterValues = getFilterValues();
                    });

                    generateReports.showReportsPopup(buttonsData);
                },
            });
        }
        reportsBtn = createMainReportButton([{ text: 'Individual Day Service Activity Report' }]);

        batchedMessageDisplay.innerHTML = 'The selected location is batched for this date.';
        batchedMessageDisplay.classList.add('batchedMessageDisplay');
        batchedMessageDisplay.classList.add('hidden');

        let filterSelectReportBtnWrap = document.createElement('div');
        filterSelectReportBtnWrap.classList.add('btnWrap', 'filterSelectReportBtnWrap');       
        if ($.session.DayServiceUpdate) filterSelectReportBtnWrap.appendChild(mulitSelectBtn); //No need to multi select for view only
        filterSelectReportBtnWrap.appendChild(reportsBtn);
        DOM.ACTIONCENTER.appendChild(filterSelectReportBtnWrap);
        if ($.session.DayServiceUpdate) DOM.ACTIONCENTER.appendChild(multiSelectAllNoneArea); //no need to multi select for view only
        DOM.ACTIONCENTER.appendChild(SEARCH_WRAP);

        const filteredBy = updateCurrentFilterDisplay();
        DOM.ACTIONCENTER.appendChild(filteredBy);

        DOM.ACTIONCENTER.appendChild(batchedMessageDisplay);
        //if (dsCardArea.outerHTML.indexOf('style=\"display: none;\"') != -1) {
        //    dsCardArea.outerHTML = dsCardArea.outerHTML.replace('"style=\"display: none;\"', '');
        //}

        DOM.ACTIONCENTER.appendChild(dsCardArea);
        roster2.toggleActionCenterChildrenVisiblity('show');
        buildCards();
    }

    async function initialPageBuild() {
        dsDropdownData = dsTypes.map(ds => {
            var id = `ds-${ds.dsType}`;
            var value = ds.dsType;
            var text = ds.dsText;
            return {
                id,
                value,
                text,
            };
        });
        if ($.session.applicationName.toLowerCase() === 'gatekeeper') {
            dsDropdownData.push({ id: '', value: '0', text: '' });
        }
        buildPageComponents();
        addEventListeners();
        //checkIfBatched();
        document.getElementById('searchBtn').click();
        rosterGroupResults = (await customGroupsAjax.getConsumerGroups(locationID))
            .getConsumerGroupsJSONResult;
    }

    function addEventListeners() {
        SEARCH_BTN.addEventListener('click', event => {
            SEARCH_WRAP.classList.toggle('searchOpen');
            SEARCH_INPUT.value = '';
            SEARCH_INPUT.focus();
        });
        SEARCH_INPUT.addEventListener('keyup', event => {
            searchDS(event.target.value);
        });

        filterLocationDropdown.addEventListener('change', async event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            temp__locationID = selectedOption.value;

            rosterGroupResults = (await customGroupsAjax.getConsumerGroups(temp__locationID))
                .getConsumerGroupsJSONResult;
            populateFilterGroupDropdown();
        });

        filterGroupDropdown.addEventListener('change', event => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            temp__groupID = selectedOption.value;
            temp__retrieveID = selectedOption.dataset.retrieveid;
            selectedGroupName = selectedOption.innerHTML;
        });

        filterDateInput.addEventListener('change', event => {
            temp__serviceDate = event.target.value;
        });

        //MutationObserver to detect when leaving the module, reset values
        var observNode = document.getElementById('actioncenter');
        var config = { attributes: true };
        var callback = function (mutationList, observer) {
            for (let mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'data-active-module') {
                        observer.disconnect();
                        miniRosterBtn = document.querySelector('.consumerListBtn');
                        if (miniRosterBtn) miniRosterBtn.classList.remove('disabled');
                        enableMultiEdit = false;
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(observNode, config);
    }

    function initPageLoad() {
        let tempDsConsumers = [];
        let dsEnabledConsumers;
        serviceDate = UTIL.getTodaysDate();

        if ($.session.DayServiceCaseLoad === true && $.loadedApp === 'dayservices') {
            filterGroupID = 'CAS';
        }    

        //Check to see if CI should be enabled
        const checkCiPromise = new Promise(function (resolve, reject) {
            dayServiceAjax.getDateToCheckShowCI(res => {
                var today = new Date();
                ciDateToCompare = new Date(res[0].Setting_Value);
                if (ciDateToCompare <= today) {
                    $.session.ciBShow = true;
                }
                resolve('success');
            });
        });

        //Get CI Staff for CI Dropdown
        const getCiStaffPromise = new Promise(function (resolve, reject) {
            dayServiceAjax.getCiStaff(serviceDate, locationID, res => {
                ciDropdownData = res.map(ci => {
                    var id = `ci-${ci.id}`;
                    var value = ci.id;
                    var text = ci.fullName;
                    return {
                        id,
                        value,
                        text,
                    };
                });
                ciDropdownData.unshift({ id: 'ci-0', value: '', text: '' });
                resolve('success');
            });
        });

        //Get consumer activities
        const getEnabledConsumersPromise = new Promise(function (resolve, reject) {
            dayServiceAjax.getDayServiceGetEnabledConsumers(serviceDate, locationID, res => {
                dsEnabledConsumers = res.map(r => r.consumerId);
                dayServiceAjax.getConsumerDayServiceActivity(
                    dsEnabledConsumers,
                    serviceDate,
                    locationID,
                    filterGroupID,
                    filterGroupRetrieveID,
                    res => {
                        dsConsumers = [];
                        res.forEach(res => {
                            actObj = {
                                Acuity: res.Acuity,
                                AllowNonBillable: res.AllowNonBillable,
                                Day_Service_Type: res.Day_Service_Type,
                                FirstName: res.FirstName,
                                LastName: res.LastName,
                                Service_Date: res.Service_Date,
                                Start_Time: res.Start_Time,
                                Stop_Time: res.Stop_Time,
                                ciStaffID: res.ciStaffID,
                                isBatched: res.isBatched,
                                dsGroupId: res.Day_service_group_id,
                            };
                            consumerObj = {
                                id: res.ID,
                                FirstName: res.FirstName,
                                LastName: res.LastName,
                            };
                            if (activityCache[res.ID]) {
                                arr = activityCache[res.ID];
                                arr.push(actObj);
                                activityCache[res.ID] = arr;
                            } else {
                                activityCache[res.ID] = [actObj];
                            }
                            // if (!dsConsumers[res.ID]) {
                            //   dsConsumers[res.ID] = consumerObj;
                            // }
                            tempDsConsumers.push(consumerObj);
                            selectedGroupId = res.Day_service_group_id;
                        });
                        //filter out array to only get distinct consumers:
                        var dsConsumerMap = new Map();
                        for (const item of tempDsConsumers) {
                            if (!dsConsumerMap.has(item.id)) {
                                dsConsumerMap.set(item.id, true);
                                dsConsumers.push({
                                    id: item.id,
                                    FirstName: item.FirstName,
                                    LastName: item.LastName,
                                });
                            }
                        }
                        //Add all consumers to the displayed consumers array
                        dsConsumers.forEach(consumer => {
                            displayedConsumers.push(consumer.id);
                        });

                        resolve('success');
                    },
                );
            });
        });

        //Get Groups
        const getGroupsPrommise = new Promise(function (resolve, reject) {
            dayServiceAjax.getDayServiceGroups($.session.Token, locationID, res => {
                dsGroupsCache = {};
                groupDropdownData = res.map((group, index) => {
                    var { groupId, groupDescription } = group;

                    if (!dsGroupsCache[groupId]) {
                        dsGroupsCache[groupId] = {
                            id: groupId,
                            value: groupDescription,
                        };
                    }

                    return {
                        id: groupId,
                        value: groupId,
                        text: groupDescription,
                    };
                });
                groupDropdownData.unshift({ id: '%', value: '', text: '' });
                resolve('success');
            });
        });

        Promise.all([
            checkCiPromise,
            getCiStaffPromise,
            getEnabledConsumersPromise,
            getGroupsPrommise,
        ]).then(function () {
            initialPageBuild();
            enabledConsumers = dsEnabledConsumers;
            roster2.setAllowedConsumers(dsEnabledConsumers);
            let locationName = locationCache[locationID].locationName;
            roster2.miniRosterinit(
                { locationId: locationID, locationName: locationName },
                {
                    hideDate: true,
                },
            );
            checkIfBatched();
        });
    }

    function locationCheck() {
        locationID = defaults.getLocation('dayServices');
        noLocationSet = locationID === '' ? true : false;
        serviceDate = UTIL.getTodaysDate();
             
        if ($.session.DayServiceCaseLoad === true && $.loadedApp === 'dayservices') {
            selectedGroupName = 'Caseload';  
            temp__groupID = 'CAS';
        } else {
            selectedGroupName = 'Everyone';
        }
        

        //get locations and cache them
        dayServiceAjax.getDayServiceLocations(serviceDate, loc => {
            loc.forEach(loc => {
                if (!locationCache[loc.locationId]) {
                    obj = {
                        locationName: loc.Name,
                        defaultDayServiceType: loc.defaultDayServiceType,
                    };
                    locationCache[loc.locationId] = obj;
                }
            });

            locationDropdownData = loc.map(loc => {
                var id = `loc${loc.locationId}`;
                var value = loc.locationId;
                var text = loc.Name;
                return {
                    id,
                    value,
                    text,
                };
            });

            //Add "" location for users that don't have a default location set
            locationCache[''] = {
                locationName: 'Select a location from the filter',
                defaultDayServiceType: '',
            };

            //When done, if they don't have a default location set, or the default loaction is set that they don't have permisison to (Advisor bug)
            //display a popup that has a location selection
            if (noLocationSet || !Object.keys(locationCache).includes(locationID)) {
                var popup = document.createElement('div');
                popup.classList.add('popup', 'visable', 'locationPicker');
                let header = document.createElement('h2');
                header.classList.add('popupHeader');
                popup.appendChild(header);

                header.innerHTML = 'No Default Location Set. Please Choose a Location:';
                var locationDropdown = dropdown.build({
                    dropdownId: 'locationDropdown',
                    label: 'location',
                    style: 'secondary',
                });

                var applyBtn = button.build({
                    id: 'apply',
                    text: 'Apply',
                    style: 'secondary',
                    type: 'contained',
                    icon: 'checkmark',
                    callback: function () {
                        locationID =
                            locationDropdown.firstElementChild.options[
                                locationDropdown.firstElementChild.selectedIndex
                            ].value;
                        let locationName =
                            locationDropdown.firstElementChild.options[
                                locationDropdown.firstElementChild.selectedIndex
                            ].innerText;
                        if (defaults.rememberLastLocation('dayServices'))
                            defaults.setLocation('dayServices', locationID);
                        DOM.ACTIONCENTER.removeChild(popup);
                        noLocationSet = false;
                        overlay.hide();

                        initPageLoad();
                    },
                });
                var btnWrap = document.createElement('div');
                btnWrap.appendChild(applyBtn);
                btnWrap.classList.add('btnWrap');

                popup.appendChild(locationDropdown);
                popup.appendChild(btnWrap);
                DOM.ACTIONCENTER.appendChild(popup);
                overlay.show();

                dropdown.populate(locationDropdown, locationDropdownData);
            } else {
                initPageLoad();
            }
        });
    }

    function init() {
        initRosterSelection = true;
        setActiveModuleSectionAttribute('dayServices');

        //clear cache
        locationCache = {};
        activityCache = {};

        dsCardArea.innerHTML = '';

        DOM.clearActionCenter();
        locationCheck();  
    }

    return {
        init,
        handleActionNavEvent,
    };
})();
