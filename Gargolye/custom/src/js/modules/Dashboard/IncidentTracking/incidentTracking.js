var incidentTrackingWidget = (function () {

    let widget;
    let widgetBody;
    let defaultShow;
    let tempShow;
    let incidentTrackingWidgetObj = []; 

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
        showDropdown = dropdown.build({
            dropdownId: "showDropdown",
            label: "Show",
            style: "secondary"
        });

        var btnWrap = document.createElement("div");
        btnWrap.classList.add("btnWrap");

        btnWrap.appendChild(applyFiltersBtn);
        btnWrap.appendChild(cancelFilterBtn);
        filterPopup.appendChild(showDropdown);
        filterPopup.appendChild(btnWrap);
        widget.insertBefore(filterPopup, widgetBody);
    }

    function eventSetup() {
        applyFiltersBtn.addEventListener("click", event => {
            filterPopup.classList.remove("visible");
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
            if (defaultShow === tempShow || !tempShow)
                return;
            defaultShow = tempShow;
            UTIL.LS.setStorage('dash_incidentTrackingShow', defaultShow);
            populateIncidentTrackingWidget(incidentTrackingWidgetObj);
        });
        cancelFilterBtn.addEventListener("click", event => {
            filterPopup.classList.remove("visible");
            overlay.hide();
            bodyScrollLock.enableBodyScroll(filterPopup);
        });
        showDropdown.addEventListener("change", event => {
            tempShow = event.target[event.target.selectedIndex].value;
        });
    }

    function getData() {
        let showValue = UTIL.LS.getStorage('dash_incidentTrackingShow');
        if (showValue === undefined) {
            showValue = "%";
            UTIL.LS.setStorage('dash_incidentTrackingShow', '%')
        }
        defaultShow = showValue;

        const showDropdownData = ([
            { id: 1, value: 1, text: 'Unread' },
            { id: 2, value: 2, text: 'Read' },
        ]);
        showDropdownData.unshift({ id: null, value: '%', text: 'ALL' });
        dropdown.populate("showDropdown", showDropdownData, defaultShow);
    }

    var tableOptions = {
        plain: true,
        columnHeadings: ['Consumer Involved', 'Date of Incident', 'Category / Subcategory'],
        tableId: 'incidentTrackingWidgetTable',
    };

    function populateIncidentTrackingWidget(res) {
        var itTable = table.build(tableOptions);
        widgetBody.innerHTML = '';
        widgetBody.appendChild(itTable);

        var incidents = []; 
        res.forEach(r => {
            if (!incidents[r.incidentId]) {
                incidents[r.incidentId] = r;
            } else {
                const dupName = incidents[r.incidentId].consumerName.includes(r.consumerName);
                if (!dupName) {
                    incidents[r.incidentId].consumerName += `, ${r.consumerName}`;
                }
                incidents[r.incidentId].viewedBy += `, ${r.viewedBy}`;
            }
        });

        incidents.sort(function (a, b) {
            var o1 = a.consumerName.toLowerCase();
            var o2 = b.consumerName.toLowerCase();

            if (o1 < o2) return -1;
            if (o1 > o2) return 1;
            return 0;
        }); 

        incidents.sort(function (a, b) {
            return new Date(b.incidentDate) - new Date(a.incidentDate);
        });  

        var keys = Object.keys(incidents);
        const removeArray = [];
        var count = 0;
        var data = keys
            .filter(k => {
                var obj = incidents[k];

                if ($.session.incidentTrackingViewPerm.length !== 0) {
                    if (
                        obj.description !== '' &&
                        !$.session.incidentTrackingViewPerm.includes(obj.description.toLowerCase())
                    ) {
                        return false;
                    }
                }

                return true;
            })
            .map(r => {
                var obj = incidents[r];

                var name = obj.consumerName.split(',');
                name = `${name[1]}, ${name[0]}`;
                var date = UTIL.abbreviateDateYear(obj.incidentDate.split(' ')[0]);
                var viewedOn = r.viewedOn ? true : false;
                var orginUser =
                    obj.originallyEnteredBy.toLowerCase() === $.session.UserId.toLowerCase() ? true : false;
                var userHasViewed = obj.viewedBy.includes($.session.UserId) ? true : false;
                var showBold;

                if (!orginUser && !userHasViewed) {
                    showBold = true;
                } 
                if (defaultShow == 2 && showBold) {
                    removeArray.push(count);
                }
                else if (defaultShow == 1 && !showBold) {
                    removeArray.push(count);
                }
                count = count + 1;
                return {
                    values: [name, date, obj.incidentCategory],
                    attributes: [{ key: 'data-viewed', value: showBold }],
                    id: obj.incidentId,
                    onClick: async () => {
                        await incidentTrackingAjax.updateIncidentViewByUser({
                            token: $.session.Token,
                            incidentId: obj.incidentId,
                            userId: $.session.UserId,
                        });

                        incidentTracking.getDropdownData(() => {
                            setActiveModuleSectionAttribute('incidentTracking-overview');
                            UTIL.toggleMenuItemHighlight('incidenttracking');
                            actioncenter.dataset.activeModule = 'incidenttracking';
                            reviewIncident.init(obj.incidentId);
                        });
                    },
                };
            });
        for (let i = removeArray.length - 1; i >= 0; i--)
            data.splice(removeArray[i], 1);

        table.populate(itTable, data);
    }

    function init() {
        widget = document.getElementById('incidenttrackingwidget');
        if (!widget) return;
        widgetBody = widget.querySelector('.widget__body');
        dashboard.appendFilterButton(
            "incidenttrackingwidget",
            "incidenttrackingFilterBtn"
        );
        defaultShow = '%';
        buildFilterPopup();
        eventSetup();
        getData();
        incidentTrackingWidgetAjax.getITDashboardWidgetDataAjax(res => {
            incidentTrackingWidgetObj = res; 
            populateIncidentTrackingWidget(incidentTrackingWidgetObj);  
        }); 
              
    }

    return {
        init,
    };
})();
