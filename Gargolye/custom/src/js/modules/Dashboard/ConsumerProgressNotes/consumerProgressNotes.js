const consumerProgresNotes = (function() {

    let widget
    let widgetBody
    let applyFiltersBtn
    let cancelFilterBtn
    let filterPopup
    //DOM
    let consumerProgresNoteslocationDropdown
    let progressNoteList
    //DATA
    let locationObject;
    let locationLookupObject;
    let tmpSelectedLocation;
    let filteredLocation;


    function buildFilterPopup() {
        var widgetFilter = widget.querySelector('.widget__filters');
        if (widgetFilter) return;
        filterPopup = dashboard.buildFilterPopup();

        applyFiltersBtn = button.build({
            text: 'Apply',
            style: 'secondary',
            type: 'contained'
        });
        cancelFilterBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined'
        });
        consumerProgresNoteslocationDropdown = dropdown.build({
            dropdownId: 'progressNoteLocations',
            label: 'Location',
            style: 'secondary'
        })

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');

        btnWrap.appendChild(applyFiltersBtn);
        btnWrap.appendChild(cancelFilterBtn);
        filterPopup.appendChild(consumerProgresNoteslocationDropdown)
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);


    }

    function populateDropdown() {
        let defaultLocation = UTIL.LS.getStorage('dash_consumerProgressNoteLocation');
        if (defaultLocation === undefined) {
            defaultLocation = "%";
            UTIL.LS.setStorage('dash_consumerProgressNoteLocation', '%')
        }
        filteredLocation = defaultLocation;

        let filteredLocationExists = (function () {
            if (defaultLocation === "%") return true
            let exists = false;
            locationObject.forEach(loc => {
                if (loc.locationId == filteredLocation) {
                    exists = true
                    return
                }
            })
            return exists;
        })()

        if (!filteredLocationExists) {
            defaultLocation = "%"
            filteredLocation = "%"
            UTIL.LS.setStorage('dash_consumerProgressNoteLocation', '%');
        }

        let data = locationObject.map(loc => {
            return {
                value: loc.locationId,
                text: loc.locationName
            }
        });

    data.sort(function(a, b) {   // alphabetize
      if(a.text < b.text) {return -1; }
      if(a.text > b.text) {return 1; }
            return 0;
        });

    data.unshift({id: "%", value: "%", text: "All"}) //ADD All Value
    locationObject.unshift({locationId: "%", locationName: "All"}) //ADD All Value

        dropdown.populate(consumerProgresNoteslocationDropdown, data, defaultLocation)
    }

    function eventSetup() {
        applyFiltersBtn.addEventListener("click", event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
            if (filteredLocation === tmpSelectedLocation || !tmpSelectedLocation) return
            filteredLocation = tmpSelectedLocation
            UTIL.LS.setStorage('dash_consumerProgressNoteLocation', filteredLocation);
            getNotesFiltered()
            widgetSettingsAjax.setWidgetFilter('consumerprogressnoteswidget', 'location', filteredLocation)
        })
        cancelFilterBtn.addEventListener("click", event => {
            filterPopup.classList.remove('visible');
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
        });
        consumerProgresNoteslocationDropdown.addEventListener("change", event => {
            tmpSelectedLocation = event.target[event.target.selectedIndex].value
        })
    }

    function getNotesFiltered() {
        PROGRESS__ANYWHERE.init()
        progressNoteList.innerHTML = ""
        PROGRESS__ANYWHERE.SPINNER.show(progressNoteList, "Loading");
        progressNotesAjax.getConsumersWithUnreadNotesByEmployeeAndLocationPermission(filteredLocation, res => {
            PROGRESS__ANYWHERE.SPINNER.hide(progressNoteList)
            populateProgressNoteWidgetResult(res)
        })
    }

    function populateProgressNoteWidgetResult(filteredResults) {
        displayFilteredBy()
        // progressNoteList.innerHTML = '';
        if (filteredResults.length === 0) {
            progressNoteList.innerHTML = 'There are no unread notes';
            return
        }
        filteredResults.forEach(progNote => {
            let date = progNote.dateEntered.split(" ")[0]
            progressNoteList.innerHTML += `
      <div class="progNote"><span>${progNote.name}</span>: ${progNote.noteTitle} - ${date}</div
      `
        })
    }

    function displayFilteredBy() {
        let filteredBy = widget.querySelector('.widgetFilteredBy');

        if (!filteredBy) {
            filteredBy = document.createElement('div');
            filteredBy.classList.add('widgetFilteredBy');
            widgetBody.insertBefore(filteredBy, progressNoteList);
        }
        filteredBy.innerHTML = `
    <div class="filteredByData">
    <p><span>Location:</span> ${locationLookupObject[filteredLocation].locationName}</p>
    </div>
    `;
    }

    function populateLocationLookup() {
        locationLookupObject = {}
        locationObject.forEach(loc => {
            obj = {
                locationName: loc.locationName
            }
            locationLookupObject[loc.locationId] = obj;
        })
    }

    function getData() {
        // const daysBackDateObj = convertDaysBackGoals($.session.defaultProgressNoteReviewDays);
        // let daysBackDay = daysBackDateObj.getDate()
        // let daysBackMonth = daysBackDateObj.getMonth()
        // let daysBackYeah = daysBackDateObj.getFullYear()
        // const daysBackDate = `${daysBackYeah}-${daysBackMonth}-${daysBackDay}`


        let getlocations = new Promise((resolve, reject) => {
            progressNotesAjax.getlocationsWithConsumersWithUnreadNotes(res => {
                locationObject = JSON.parse(res);
                resolve("success")
            })
        })

        Promise.all([getlocations]).then(() => {
            populateDropdown()
            populateLocationLookup()
            getNotesFiltered()
        })
    }

    // const dash_consumerProgressNotesLS = (function() {
    //   function getLocation() {
    //     let user = $.session.UserId
    //     return localStorage.getItem(`user:${user} dash_consumerProgressNoteLocation`)      
    //   }
    //   function setLocaiton(locationId) {
    //     let user = $.session.UserId
    //     return localStorage.setItem(`user:${user} dash_consumerProgressNoteLocation`, locationId)      
    //   }
    //   return {
    //     getLocation: getLocation,
    //     setLocation: setLocaiton
    //   }
    // })()

    async function init() {
        widget = document.getElementById('consumerprogressnoteswidget');
        widgetBody = widget.querySelector('.widget__body');
        progressNoteList = document.getElementById("progressNoteList");
        dashboard.appendFilterButton('consumerprogressnoteswidget', 'consumerProgressFilterBtn');

        var filterLocationDefaultValue = await widgetSettingsAjax.getWidgetFilter('consumerprogressnoteswidget', 'location');
        filteredLocation = filterLocationDefaultValue.getWidgetFilterResult;
        UTIL.LS.setStorage('dash_consumerProgressNoteLocation', filteredLocation);

        getData()
        buildFilterPopup()
        eventSetup()
    }
    return {
        init
    }

})();
