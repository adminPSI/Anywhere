var newTimeEntry = (function () {
    var timeCard;

    async function loadPage() {
        DOM.clearActionCenter();

        timeCard = await timeEntryCard.build({
            isEdit: false,
        });
        DOM.ACTIONCENTER.appendChild(timeCard);

        await timeEntryCard.populate();
    }

    async function endDateWarningPopup(getExistingTimeEntryResult) {
        const endDateWarningPopup = POPUP.build({
            hideX: true,
            classNames: 'warning',
        });

        const okBtn = button.build({
            text: 'Provide End Time',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(endDateWarningPopup);
                let payPeriod = timeEntry.getCurrentPayPeriod(false);

                singleEntryAjax.getSingleEntryById(getExistingTimeEntryResult[0].Single_Entry_ID, results => {
                    singleEntryAjax.getSingleEntryConsumersPresent(getExistingTimeEntryResult[0].Single_Entry_ID, consumers => {
                        editTimeEntry.init({
                            isOrginUser : true,
                            entry: results,
                            consumers: consumers,
                            isAdminEdit: true,
                            payPeriod,
                            recordActivityElement: null,
                            isOnlyEndTimeChangePermission : true,
                        });
                    });
                });
            },
        });
        const cancelBtn = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                POPUP.hide(endDateWarningPopup);
                timeEntry.init();
            },
        });
        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        btnWrap.appendChild(okBtn);
        btnWrap.appendChild(cancelBtn);

        const borderBottom = document.createElement('div');
        borderBottom.classList.add('borderBottom');


        const warningMessage = document.createElement('p');
        warningMessage.innerHTML =
            'You have an existing time entry with no end time. Please provide the end time to the below time entry before creating a new entry.';
        endDateWarningPopup.appendChild(warningMessage);
        endDateWarningPopup.appendChild(borderBottom);

        const serviceDate = document.createElement('p');
        serviceDate.style.textAlign = 'left';
        serviceDate.innerHTML = 'Service Date: ' + moment(getExistingTimeEntryResult[0].Date_of_Service).format('M/D/YYYY');
        endDateWarningPopup.appendChild(serviceDate);

        const startTime = document.createElement('p');
        startTime.style.textAlign = 'left';
        startTime.innerHTML = 'Start Time: ' + UTIL.convertFromMilitary(getExistingTimeEntryResult[0].Start_Time);
        endDateWarningPopup.appendChild(startTime);

        const workCode = document.createElement('p');
        workCode.style.textAlign = 'left';
        workCode.innerHTML = 'Work Code: ' + getExistingTimeEntryResult[0].Work_Code_Name;
        endDateWarningPopup.appendChild(workCode);

        endDateWarningPopup.appendChild(btnWrap);
        POPUP.show(endDateWarningPopup);
    }

    function init() {
        setActiveModuleSectionAttribute('timeEntry-new');
        DOM.clearActionCenter();
        roster2.miniRosterinit(null, {
            hideDate: true,
        });
        roster2.toggleMiniRosterBtnVisible(false);
        loadPage();
    }

    return {
        init,
        loadPage,
        endDateWarningPopup,
    };
})();
