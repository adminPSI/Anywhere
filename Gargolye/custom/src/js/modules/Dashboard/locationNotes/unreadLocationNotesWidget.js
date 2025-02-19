const unreadLocationNotes = (function() {
    let widget;
    let widgetBody;
    let applyFiltersBtn;
    let cancelFilterBtn;
    let filterPopup;
    //DOM
    let locationNoteslocationDropdown;
    let locationNoteList;
    //DATA
    let locationNoteLocationObj;
    let locationNoteLocationLookupObject;
    let tmpSelectedLocation;
    let filteredLocation;

    function buildFilterPopup() {
        var widgetFilter = widget.querySelector(".widget__filters");
        if (widgetFilter) return;
        filterPopup = dashboard.buildFilterPopup();

        applyFiltersBtn = button.build({
            text: "Apply",
            style: "secondary",
            type: "contained"
        });
        cancelFilterBtn = button.build({
            text: "Cancel",
            style: "secondary",
            type: "outlined"
        });
        locationNoteslocationDropdown = dropdown.build({
            dropdownId: "locationProgressNoteLocations",
            label: "Location",
            style: "secondary"
        });

        var btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");

        btnWrap.appendChild(applyFiltersBtn);
        btnWrap.appendChild(cancelFilterBtn);
        filterPopup.appendChild(locationNoteslocationDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);
    }

    function populateDropdown() {
        let defaultLocation = UTIL.LS.getStorage('dash_locationProgressNoteLocation');
        if (defaultLocation === undefined) {
            defaultLocation = "%";
            UTIL.LS.setStorage('dash_locationProgressNoteLocation', '%')
        }
        filteredLocation = defaultLocation;

    let filteredLocationExists = (function() {
            if (defaultLocation === "%") return true;
            let exists = false;
            locationNoteLocationObj.forEach(loc => {
                if (loc.loc_id == filteredLocation) {
                    exists = true;
                    return;
                }
            });
            return exists;
        })();

        if (!filteredLocationExists) {
            defaultLocation = "%";
            filteredLocation = "%";
            UTIL.LS.setStorage('dash_locationProgressNoteLocation', '%');
        }

        let data = locationNoteLocationObj.map(loc => {
            return {
                value: loc.loc_id,
                text: loc.locationName
            };
        });

    data.sort(function(a, b) {
            // alphabetize
            if (a.text < b.text) {
                return -1;
            }
            if (a.text > b.text) {
                return 1;
            }
            return 0;
        });

        data.unshift({ id: "%", value: "%", text: "All" }); //ADD All Value
        locationNoteLocationObj.unshift({ loc_id: "%", locationName: "All" }); //ADD All Value

        dropdown.populate(locationNoteslocationDropdown, data, defaultLocation);
    }

    function eventSetup() {
        applyFiltersBtn.addEventListener("click", event => {
            filterPopup.classList.remove("visible");
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
            if (filteredLocation === tmpSelectedLocation || !tmpSelectedLocation)
                return;
            filteredLocation = tmpSelectedLocation;
            UTIL.LS.setStorage('dash_locationProgressNoteLocation', filteredLocation);
            getNotesFiltered();
            widgetSettingsAjax.setWidgetFilter('locationprogressnoteswidget', 'location', filteredLocation)
        });
        cancelFilterBtn.addEventListener("click", event => {
            filterPopup.classList.remove("visible");
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
        });
        locationNoteslocationDropdown.addEventListener("change", event => {
            tmpSelectedLocation = event.target[event.target.selectedIndex].value;
        });
    }

    function getNotesFiltered() {
        PROGRESS__ANYWHERE.init()
        locationNoteList.innerHTML = ""
        PROGRESS__ANYWHERE.SPINNER.show(locationNoteList, "Loading");
        locationNotesAjax.getLocationProgressNotesAndPermission(filteredLocation, res => {
            PROGRESS__ANYWHERE.SPINNER.hide(locationNoteList)
            populateLocationProgressNoteWidgetResult(res);
        });
    }

    function populateLocationProgressNoteWidgetResult(filteredResults) {
        displayFilteredBy();
        // locationNoteList.innerHTML = "";
        if (filteredResults.length === 0) {
            locationNoteList.innerHTML = "There are no unread notes";
            return;
        }
        filteredResults.forEach(progNote => {
            let date = progNote.datecreated.split(" ")[0];
            let location =
                locationNoteLocationLookupObject[progNote.Location].locationName;
            locationNoteList.innerHTML += `
        <div class="progNote"><span>${location}</span>: ${progNote.title} - ${date}</div
        `;
        });
    }

    function displayFilteredBy() {
        let filteredBy = widget.querySelector(".widgetFilteredBy");

        if (!filteredBy) {
            filteredBy = document.createElement("div");
            filteredBy.classList.add("widgetFilteredBy");
            widgetBody.insertBefore(filteredBy, locationNoteList);
        }
        filteredBy.innerHTML = `
      <div class="filteredByData">
      <p><span>Location:</span> ${locationNoteLocationLookupObject[filteredLocation].locationName}</p>
      </div>
      `;
    }

    function populateLocationLookup() {
        locationNoteLocationLookupObject = {};
        locationNoteLocationObj.forEach(loc => {
            obj = {
                locationName: loc.locationName
            };
            locationNoteLocationLookupObject[loc.loc_id] = obj;
        });
    }

    function getData() {
        let getlocations = new Promise((resolve, reject) => {
            locationNotesAjax.getLocationsWithUnreadNotesAndPermission(res => {
                locationNoteLocationObj = res;
                resolve("success");
            });
        });

        Promise.all([getlocations]).then(() => {
            populateDropdown();
            populateLocationLookup();
            getNotesFiltered();
        });
    }

    // const dash_locationProgressNotesLS = (function() {
    //   function getLocation() {
    //     let user = $.session.UserId;
    //     return localStorage.getItem(
    //       `user:${user} dash_locationProgressNoteLocation`
    //     );
    //   }
    //   function setLocaiton(locationId) {
    //     let user = $.session.UserId;
    //     return localStorage.setItem(
    //       `user:${user} dash_locationProgressNoteLocation`,
    //       locationId
    //     );
    //   }
    //   return {
    //     getLocation: getLocation,
    //     setLocation: setLocaiton
    //   };
    // })();

    async function init() {
        dashboard.appendFilterButton(
            "locationprogressnoteswidget",
            "locationProgressFilterBtn"
        );

        widget = document.getElementById("locationprogressnoteswidget");
        widgetBody = widget.querySelector(".widget__body");
        locationNoteList = document.getElementById("locationProgressNoteList");

        var filterLocationDefaultValue = await widgetSettingsAjax.getWidgetFilter('locationprogressnoteswidget', 'location');
        filteredLocation = filterLocationDefaultValue.getWidgetFilterResult;
        filteredLocation == '' ? filteredLocation = '%' : filteredLocation;
        UTIL.LS.setStorage('dash_locationProgressNoteLocation', filteredLocation);

        getData();
        buildFilterPopup();
        eventSetup();      
    }
    return {
        init
    };
})();
