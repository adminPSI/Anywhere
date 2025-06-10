const EditMembers = (() => {

    let memberEntriesTable;
    let familyID;
    let familyEntries;
    let headingName;
    let name;
    let nameOfEvent;
    let memberName;
    var isActive;
    var memberId;
    let addEditMemberPopup;
    var newMemberId;

    async function init(familyId, name) {
        familyID = familyId;
        headingName = name;

        if (familyID != undefined) {
            familyEntries = await FSSAjax.getFamilyMembers(familyID);
        }
    }

    function getMarkup() {
        const memberWrap = document.createElement('div');
        memberWrap.classList.add('planSummary');
        if (familyID != undefined) {
            const importantTables = buildNewMemberForm();
            memberWrap.appendChild(importantTables);
        }
        return memberWrap;
    }

    function buildNewMemberForm() {
        const workScheduleDiv = document.createElement('div');
        workScheduleDiv.classList.add('additionalQuestionWrap');

        const newMemberBtn = button.build({
            text: '+ ADD FAMILY MEMBER',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                if ($.session.InsertFSS) {
                    addMemberPopup(0, 0, 'Add')
                }
            }
        });
        memberEntriesTable = buildmemberEntriesTable();


        const column1 = document.createElement('div')
        column1.classList.add('col-1')
        const addNewCard = document.createElement("div");
        addNewCard.classList.add("card");
        const addNewCardBody = document.createElement("div");
        addNewCardBody.classList.add("card__body");
        addNewCard.innerHTML = `<div class="card__header">Family Members</div>`;
        addNewCard.appendChild(addNewCardBody)
        column1.appendChild(addNewCard)
        addNewCardBody.appendChild(newMemberBtn);

        if ($.session.InsertFSS)
            newMemberBtn.classList.remove('disabled');
        else
            newMemberBtn.classList.add('disabled');

        addNewCardBody.appendChild(memberEntriesTable);
        workScheduleDiv.appendChild(column1);
        return workScheduleDiv;
    }


    function buildmemberEntriesTable() {
        const tableOptions = {
            plain: false,
            tableId: 'employmentWorkScheduleTable',
            columnHeadings: ['Family Member', 'Active?'],
            endIcon: $.session.FSSUpdate == true ? true : false,
        };

        let tableData = familyEntries.getFamilyMembersResult.map((entry) => ({
            values: [entry.memberName, entry.active == 'Y' ? 'Yes' : 'No'],
            attributes: [{ key: 'familyId', value: entry.familyId }],
            onClick: (e) => {
                if ($.session.FSSUpdate)
                    addMemberPopup(entry.familyId, entry.memberId, 'Edit')
            },
            endIcon: $.session.FSSDelete == true ? `${icons['delete']}` : '',
            endIconCallback: (e) => {
                deleteMemberPOPUP(entry.familyId, entry.memberId);
            },
        }));
        const oTable = table.build(tableOptions);

        // Set the data type for each header, for sorting purposes
        const headers = oTable.querySelectorAll('.header div');
        headers[0].setAttribute('data-type', 'string'); // Family Member
        headers[1].setAttribute('data-type', 'string'); // Active

        // Call function to allow table sorting by clicking on a header.
        table.sortTableByHeader(oTable);

        table.populate(oTable, tableData);

        return oTable;
    }

    function deleteMemberPOPUP(familyId, memberId) {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: () => {
                deleteMember(familyId, memberId, confirmPopup);
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

        message.innerText = 'Are you sure you would like to remove this Member?';
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

    function deleteMember(familyId, memberId, confirmPopup) {
        FSSAjax.deleteMemberInfo(
            {
                token: $.session.Token,
                memberId: memberId,
                familyID: familyID
            }
        );
        POPUP.hide(confirmPopup);
        EditFamilyHeader.refreshFamily(familyID, headingName, tabPositionIndex = 1);
    }

    function addMemberPopup(familyId, memberIdd, eventName) {
        if (eventName == 'Add') {
            memberName = '';
            isActive = 'Y';
            memberId = '';
            newMemberId = '';
        }
        else {
            let memberValues = familyEntries.getFamilyMembersResult.find(x => x.familyId == familyId && x.memberId == memberIdd);
            memberName = memberValues.memberName;
            isActive = memberValues.active;
            memberId = memberValues.memberId;
            newMemberId = memberValues.memberId;
        }
        addEditMemberPopup = POPUP.build({
            classNames: ['rosterFilterPopup'],
            hideX: true,
        });

        const heading = document.createElement('h2');
        heading.style.marginTop = '-20px';
        heading.style.marginBottom = '15px';
        if (eventName == 'Edit') {
            heading.innerText = 'Update Family Member';
            memberId = memberId;
        }
        else {
            heading.innerText = 'Add Family Member';
            memberId = '0';
        }

        // dropdowns & inputs
        memberDropdown = dropdown.build({
            id: 'memberDropdown',
            label: "Family Member",
            dropdownId: "memberDropdown",
            value: (memberId) ? memberId : '',
        });

        const yesActiveRadio = input.buildRadio({
            id: 'yesActiveRadio',
            text: "Yes",
            name: "activeChk",
            isChecked: true,
        })
        const noActiveRadio = input.buildRadio({
            id: 'noActiveRadio',
            text: "No",
            name: "activeChk",
        })

        const radioDiv = document.createElement('div')
        radioDiv.classList.add('radioDiv')
        radioDiv.appendChild(yesActiveRadio)
        radioDiv.appendChild(noActiveRadio)

        APPLY_BTN = button.build({
            text: 'SAVE',
            style: 'secondary',
            type: 'contained',
        });

        CANCEL_BTN = button.build({
            text: 'Cancel',
            style: 'secondary',
            type: 'outlined',
        });

        addEditMemberPopup.appendChild(heading);
        addEditMemberPopup.appendChild(memberDropdown);

        const active = document.createElement('h3');
        active.innerText = 'Active?';

        var timebtnWrap = document.createElement('div');
        timebtnWrap.classList.add('btnWrap');
        active.style.marginLeft = '1%';
        active.style.width = '48%';
        timebtnWrap.appendChild(active);
        radioDiv.style.marginLeft = '2%';
        radioDiv.style.width = '48%';
        timebtnWrap.appendChild(radioDiv);
        addEditMemberPopup.appendChild(timebtnWrap);

        var popupbtnWrap = document.createElement('div');
        popupbtnWrap.classList.add('btnWrap');
        popupbtnWrap.appendChild(APPLY_BTN);
        popupbtnWrap.appendChild(CANCEL_BTN);
        addEditMemberPopup.appendChild(popupbtnWrap);

        POPUP.show(addEditMemberPopup);
        PopupEventListeners();
        populateMemberDropdown(memberId);
        checkRequiredFieldsOfPopup();
    }

    function PopupEventListeners() {
        memberDropdown.addEventListener('change', event => {
            newMemberId = event.target.value;
            checkRequiredFieldsOfPopup();
        });
        yesActiveRadio.addEventListener('change', event => {
            isActive = 'Y';
        });
        noActiveRadio.addEventListener('change', event => {
            isActive = 'N';
        });

        APPLY_BTN.addEventListener('click', () => {
            if (!APPLY_BTN.classList.contains('disabled')) {
                saveNewMemberPopup();
            }
        });

        CANCEL_BTN.addEventListener('click', () => {
            POPUP.hide(addEditMemberPopup);
        });
    }

    function checkRequiredFieldsOfPopup() {
        var memberNm = memberDropdown.querySelector('#memberDropdown');

        if (memberNm.value === '') {
            memberDropdown.classList.add('errorPopup');
        } else {
            memberDropdown.classList.remove('errorPopup');
        }

        setBtnStatusOfPopup();
    }

    function setBtnStatusOfPopup() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            APPLY_BTN.classList.add('disabled');
            return;
        } else {
            APPLY_BTN.classList.remove('disabled');
        }
    }


    async function populateMemberDropdown(memberId) {
        const {
            getMembersResult: Members,
        } = await FSSAjax.getMembers();
        let data = Members.map((members) => ({
            id: members.memberId,
            value: members.memberId,
            text: members.memberName
        }));
        data.unshift({ id: null, value: '', text: '' });
        dropdown.populate("memberDropdown", data, memberId);
        checkRequiredFieldsOfPopup();
    }

    async function saveNewMemberPopup() {


        await FSSAjax.insertMemberInfo({
            token: $.session.Token,
            memberId: memberId,
            familyID: familyID,
            active: isActive,
            userId: $.session.UserId,
            newMemberId: newMemberId,
        });
        POPUP.hide(addEditMemberPopup);
        EditFamilyHeader.refreshFamily(familyID, headingName, tabPositionIndex = 1);


    }

    return {
        init,
        buildNewMemberForm,
        getMarkup,
    };
})(); 