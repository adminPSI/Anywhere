const consumerInfo = (function () {
    let locationId;
    let consumerId;
    let consumerName
    let selectedDate;
    let consumerInfoCard;
    let currentlyVisibleSection;
    let hasUnreadNote;
    let modalOverlay;
    let menuNewList = [];
    let currentScreen;
    let previousScreen = '';
    let nextScreen = '';
    let backwordBtn;
    let forwardBtn;
    let rosterList;

    // Edit relationship 
    let editRelationshipPopup;
    let numberOfRows;
    let btnWrapInputsN = [];
    let hasADropdownN = [];
    let startDateInputN = [];
    let whoIsDropdownN = [];
    let endDateInputN = [];
    let deleteBtnN = [];
    let showInactive;
    let tempConsumer;
    let consumerRelationships = [];
    let consumerRelationshipsNew = [];
    let relationshipPopupBtnWrap;
    let dataType;
    let dataName;
    let isValueChanged;
    let deletedIds = [];
    let archiveConsumerRelationships = [];


    function getImageOrientation(file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xffd8) {
                return callback(-2);
            }
            var length = view.byteLength,
                offset = 2;
            while (offset < length) {
                if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xffe1) {
                    if (view.getUint32((offset += 2), false) != 0x45786966) {
                        return callback(-1);
                    }

                    var little = view.getUint16((offset += 6), false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++) {
                        if (view.getUint16(offset + i * 12, little) == 0x0112) {
                            return callback(view.getUint16(offset + i * 12 + 8, little));
                        }
                    }
                } else if ((marker & 0xff00) != 0xff00) {
                    break;
                } else {
                    offset += view.getUint16(offset, false);
                }
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }

    // Workers
    function formatPortraitPath(portraitPath) {
        var splitPath = portraitPath.split('\\');
        var newPath = '\\\\\\\\';
        splitPath.forEach(sp => {
            if (sp === '') return;
            newPath += `${sp}\\\\`;
        });

        return newPath;
    }
    function updatePhotoToDefault() {
        var targetConsumerId = consumerInfoCard.dataset.consumerid;
        var consumerCardFromRosterList = document.querySelector(`[data-consumer-id="${targetConsumerId}"]`);
        var rosterPic = consumerCardFromRosterList.querySelector('img');
        var infoCardPic = consumerInfoCard.querySelector('img');
        rosterPic.setAttribute('src', './images/new-icons/default.jpg');
        infoCardPic.setAttribute('src', './images/new-icons/default.jpg');
        rosterPic.setAttribute('onerror', './images/new-icons/default.jpg');
        infoCardPic.setAttribute('onerror', './images/new-icons/default.jpg');
    }
    async function updateConsumerPhoto(event) {
        event.preventDefault();
        var targetConsumerId = consumerInfoCard.dataset.consumerid;
        var consumerCardFromRosterList = document.querySelector(`[data-consumer-id="${targetConsumerId}"]`);

        var pic2 = consumerCardFromRosterList.querySelector('img');
        pic2.setAttribute('src', URL.createObjectURL(event.target.files[0]));
        var pic1 = consumerInfoCard.querySelector('img');
        pic1.setAttribute('src', URL.createObjectURL(event.target.files[0]));

        var id = `${targetConsumerId}`;
        id = parseInt(id);
        var portraitPath = $.session.portraitPath;
        portraitPath = formatPortraitPath(portraitPath);

        var canvas = document.createElement('canvas');
        canvas.height = 127;
        canvas.width = 150;

        var ctx = canvas.getContext('2d');

        var imageObj = new Image(152, 127);

        pic2.onload = function () {
            ctx.drawImage(pic2, 0, 0, 152, 127);

            var srcData = canvas.toDataURL('image/jpeg');
            srcData = srcData.replace('data:image/jpeg;base64,', '');

            rosterAjax.updatePortrait(srcData, id, portraitPath);

            getImageOrientation(event.target.files[0], function (orientation) { });
        };
        //ctx.drawImage(imageObj, 0, 0, 152, 127);
        var imageObjSrcVal = `#${id}`;
        imageObj.setAttribute('src', imageObjSrcVal);
        ctx.drawImage(imageObj, 0, 0, 152, 127);

        //var srcData = canvas.toDataURL('image/jpeg');
        //srcData = srcData.replace("data:image/jpeg;base64,", "");
        //rosterAjax.updatePortrait(srcData, id, portraitPath);
    }
    function orderScheduleData(data) {
        var tableData = [
            {
                id: 'startTime',
                values: [
                    data.start.Sun,
                    data.start.Mon,
                    data.start.Tues,
                    data.start.Wed,
                    data.start.Thur,
                    data.start.Fri,
                    data.start.Sat,
                ],
            },
            {
                id: 'endTime',
                values: [data.end.Sun, data.end.Mon, data.end.Tues, data.end.Wed, data.end.Thur, data.end.Fri, data.end.Sat],
            },
        ];

        return tableData;
    }
    function toggleHideShowAbsentMenuSection(locationid) {
        var menulist = document.querySelector('.menuList');
        var absentMenuItem = menulist.querySelector('[data-info-task="Mark As Absent"]');
        if ((locationid === '000' || locationid === '0') && absentMenuItem !== null) {
            absentMenuItem.classList.add('hidden');
            const index = menuNewList.findIndex(x => x.title == 'Mark As Absent');
            if (index != -1) {
                menuNewList.splice(index, 1);
            }
        } else if (absentMenuItem !== null) {
            absentMenuItem.classList.remove('hidden');
        }
    }
    function downloadAttachment(attachmentid) {
        var action = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}/getIndividualAttachment/`;
        var successFunction = function (resp) {
            var res = JSON.stringify(response);
        };

        var form = document.createElement('form');
        form.setAttribute('action', action);
        form.setAttribute('method', 'POST');
        form.setAttribute('target', '_blank');
        form.setAttribute('enctype', 'application/json');
        form.setAttribute('success', successFunction);
        var tokenInput = document.createElement('input');
        tokenInput.setAttribute('name', 'token');
        tokenInput.setAttribute('value', $.session.Token);
        tokenInput.id = 'token';
        var attachmentInput = document.createElement('input');
        attachmentInput.setAttribute('name', 'attachmentId');
        attachmentInput.setAttribute('value', attachmentid);
        attachmentInput.id = 'attachmentId';

        form.appendChild(tokenInput);
        form.appendChild(attachmentInput);
        form.style.position = 'absolute';
        form.style.opacity = '0';
        document.body.appendChild(form);

        form.submit();
    }
    // Hide/Show
    function showCard(consumer) {
        tempConsumer = consumer;
        var consumersWithUnreadNotes = roster2.getConsumersWithUnreadNotes();
        hasUnreadNote = consumersWithUnreadNotes[consumer.dataset.consumerId];

        if ($.session.selectedLocation[0] === '0') {
            var menuItem = document.querySelector('.menuList .progressNote');
            if (menuItem) menuItem.classList.add('hidden');
            const index = menuNewList.findIndex(x => x.title == 'Progress Notes');
            if (index != -1) {
                menuNewList.splice(index, 1);
            }
        } else {
            var menuItem = document.querySelector('.menuList .progressNote');
            if (menuItem) menuItem.classList.remove('hidden');
        }

        if (hasUnreadNote) {
            var menuItem = document.querySelector('.menuList .progressNote');
            if (menuItem) menuItem.classList.add('needsAttention');
        } else {
            var menuItem = document.querySelector('.menuList .progressNote');
            if (menuItem) menuItem.classList.remove('needsAttention');
        }

        // shows consumer info card
        var locationObj = roster2.getSelectedLocationObj();
        locationId = locationObj.locationId;
        selectedDate = roster2.getSelectedDate();

        setConsumerToCard(consumer);

        rosterList = document.querySelector('.roster');
        rosterList.classList.add('fadeOut');
        DOM.toggleHeaderOpacity();

        setTimeout(function () {
            consumerInfoCard.classList.add('visible');
            if (!isMobile) {
                bodyScrollLock.disableBodyScroll(consumerInfoCard);
            }
            modalOverlay.classList.add('modal');
        }, 300);
    }
    function closeCard() {
        backwordBtn.classList.add('hidden');
        forwardBtn.classList.add('hidden');
        roster2.toggleRosterListLockdown(false);
        progressNotes.clearAllGlobalVariables();
        // hides consumer info card
        // grab visible section & subsection, then hide them
        var visibleSection = consumerInfoCard.querySelector('.infoCardSection.visible');
        var visibleSubSection = consumerInfoCard.querySelector('.infoCardSubSection.visible');
        if (visibleSection) visibleSection.classList.remove('visible');
        if (visibleSubSection) visibleSubSection.classList.remove('visible');
        // reset menuList
        var menuList = consumerInfoCard.querySelector('.menuList');
        menuList.classList.remove('fadeOut');
        // hide consumer info card
        consumerInfoCard.classList.remove('visible');
        // wait till consumer card is hidden
        setTimeout(function () {
            // reshow roster list
            rosterList = document.querySelector('.roster');
            if (rosterList != null) {
                rosterList.classList.remove('hidden');
                rosterList.classList.remove('fadeOut');
            }
            DOM.removeHeaderOpacity();
            if (!isMobile) {
                bodyScrollLock.enableBodyScroll(consumerInfoCard);
            }
            modalOverlay.classList.remove('modal');
        }, 200);

        currentlyVisibleSection = null;
    }
    function showCardSection(targetSection) {
        // shows section
        currentlyVisibleSection = targetSection;

        var menu = consumerInfoCard.querySelector('.menuList');
        menu.classList.add('fadeOut');

        targetSection.classList.add('visible');
    }
    function showCardSubSection(targetSubSection) {
        // shows sub section
        var currentlyVisibleSubSection = consumerInfoCard.querySelector('.infoCardSubSection.visible');
        // hide currently visible sub section
        currentlyVisibleSubSection.classList.remove('visible');
        // restore height of target subsection
        targetSubSection.classList.remove('hidden');

        setTimeout(function () {
            // shrink currently visible sub section
            currentlyVisibleSubSection.classList.add('hidden');
            // show target sub section
            targetSubSection.classList.add('visible');
        }, 200);
    }
    function handleBackButtonClick() {
        backwordBtn.classList.add('hidden');
        forwardBtn.classList.add('hidden');
        // first check to see if we are on the menulist
        var menuList = consumerInfoCard.querySelector('.menuList');
        var isMenuListHidden = menuList.classList.contains('fadeOut');
        if (!isMenuListHidden) {
            return;
        }

        var sectionBackBtn = document.querySelector('.sectionBackBtn');

        // clear out section/sub section variables
        //MAT - commenting out below due to teh fact that sometimes the back button is used while in progress notes. Still need the consumer ID at this point if adding another note
        progressNotes.clearAllGlobalVariablesOnBack();

        var visibleSection = consumerInfoCard.querySelector('.infoCardSection.visible');
        var visibleSubSection = visibleSection.querySelector('.infoCardSubSection.visible');

        if (visibleSubSection) {
            var isSubSection0Visible = visibleSubSection.classList.contains('subSec0');
            if (isSubSection0Visible) {
                // hide visible section & subSections
                visibleSubSection.classList.remove('visible');
                visibleSection.classList.remove('visible');
                // back to menu list
                menuList.classList.remove('fadeOut');
                sectionBackBtn.classList.add('hidden');
            } else {
                // back to subSec0
                var subSec0 = visibleSection.querySelector('.subSec0');
                // hide visible subsection
                visibleSubSection.classList.remove('visible');
                // reset subSec0 height
                subSec0.classList.remove('hidden');

                setTimeout(function () {
                    // shrink currently visible sub section
                    visibleSubSection.classList.add('hidden');
                    // show subSec0
                    subSec0.classList.add('visible');
                }, 200);
            }
        } else {
            // hide visible section
            visibleSection.classList.remove('visible');
            // back to menu list
            menuList.classList.remove('fadeOut');
            sectionBackBtn.classList.add('hidden');
        }
    }
    // Populating Card Sections
    function setConsumerToCard(consumer) {
        var cardClone = consumer.cloneNode(true);
        // get consumer name
        consumerName = consumer.children[1].innerText.replaceAll('\n', '').split(',');
        // set consumer id attribute and cache it
        var id = consumer.dataset.consumerId;
        consumerInfoCard.setAttribute('data-consumerId', id);
        consumerId = id;
        // append consumer card to info card
        var header = consumerInfoCard.querySelector('.consumerInfoCard__heading');
        header.innerHTML = '';
        header.appendChild(cardClone);
    }
    function populateAbsentSection(section, absentData) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';
        var absentForm = rosterAbsent.buildAbsentForm(true, consumerId, selectedDate, absentData);
        sectionInner.appendChild(absentForm);
    }
    function populatePhotoSection(section) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        var removePhotoBtn = button.build({
            text: 'Remove Photo',
            style: 'secondary',
            type: 'contained',
            callback: e => {
                if (!$.session.DemographicsPictureDelete) {
                    return;
                }

                rosterAjax.updatePortrait('', parseInt(consumerId), formatPortraitPath($.session.portraitPath), () => {
                    updatePhotoToDefault();
                });
            },
        });
        if (!$.session.DemographicsPictureDelete) {
            removePhotoBtn.classList.add('disabled');
        }

        var photoInput = input.build({
            label: 'Choose Image',
            type: 'file',
            accept: 'image/*',
            style: 'secondary',
            attributes: [{ key: 'multiple', value: 'false' }],
        });

        sectionInner.appendChild(removePhotoBtn);
        sectionInner.appendChild(photoInput);

        photoInput.addEventListener('change', updateConsumerPhoto);
    }
    function populateGroupSection(section) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';
        var groupList = customGroups.buildGroupList(false, consumerId);
        sectionInner.appendChild(groupList);
    }
    function populateNotesSection(section, data) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        if (data.length === 0) {
            sectionInner.innerHTML = `<p class="infoNotFoundMessage">No notes found.</p>`;
            return;
        }

        sectionInner.innerHTML = `
      ${data
                .map(d => {
                    var date = d.noteDate;
                    date = date ? date.split(' ')[0] : '';

                    return `
          <div class="consumerNote">
            <div class="consumerNote__details">
              <div class="type"><span>Type:</span> ${d.description}</div>
              <div class="dateTime">${date}</div>
            </div>
            <div class="consumerNote__note">${d.note}</div>
          </div>
        `;
                })
                .join('')}
    `;
    }
    function populateProgressNotesSection(section, data) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        var viewAllNotesSection = progressNotes.buildViewAllNotesSection(data);
        var addNoteSection = progressNotes.buildAddNoteSection();
        var viewSingleNoteSection = progressNotes.buildViewSingleNoteSection();
        var addMessageSection = progressNotes.buildAddMessageSection();

        viewAllNotesSection.classList.add('infoCardSubSection', 'subSec0', 'visible');
        addNoteSection.classList.add('infoCardSubSection', 'subSec1', 'hidden');
        viewSingleNoteSection.classList.add('infoCardSubSection', 'subSec2', 'hidden');
        addMessageSection.classList.add('infoCardSubSection', 'subSec3', 'hidden');

        sectionInner.appendChild(viewAllNotesSection);
        sectionInner.appendChild(addNoteSection);
        sectionInner.appendChild(viewSingleNoteSection);
        sectionInner.appendChild(addMessageSection);
    }
    function populateAttachmentsSection(section, data) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        var attachmentsList = document.createElement('div');
        attachmentsList.classList.add('attachmentsList');

        data.forEach(d => {
            var file = d.filename.split('.');
            var fileType = file.pop();
            var fileName = file.join('.');

            var btnWrap = document.createElement('div');
            btnWrap.classList.add('btnWrap');

            var attachment = document.createElement('div');
            attachment.classList.add('attachment');
            attachment.setAttribute('data-attachments-id', d.attachmentid);
            if ($.session.DemographicsDeleteAttachments) {
                attachment.style.width = '86%';   
            } else {
                attachment.style.width = '100%';
            }
            attachment.innerHTML = `
        <p class="attachment__name">${fileName}</p>
        <p class="attachment__type">${fileType}</p>
        <p class="attachment__icon">${icons.download}</p>
      `;

            attachment.addEventListener('click', () => {
                downloadAttachment(d.attachmentid);
            });
         
            var attachmentDelete = document.createElement('div');
            attachmentDelete.classList.add('attachment');
            attachmentDelete.setAttribute('data-attachments-id', d.attachmentid);
            attachmentDelete.innerHTML = `<p class="attachment__icon">${icons.remove}</p>`; 
                 
            attachmentDelete.addEventListener('click', () => {
                closeCard();
                deleteWagesBenefitsPOPUP(d.attachmentid); 
            });

            btnWrap.appendChild(attachment);
            if ($.session.DemographicsDeleteAttachments) {
                attachmentDelete.style.width = '14%'; 
                btnWrap.appendChild(attachmentDelete)
            }            

            attachmentsList.appendChild(btnWrap); 
        });

        sectionInner.appendChild(attachmentsList);
    }

    function deleteWagesBenefitsPOPUP(attachmentid) {
        const confirmPopup = POPUP.build({
            hideX: true,
        });

        YES_BTN = button.build({
            text: 'YES',
            style: 'secondary',
            type: 'contained',
            callback: async () => {
                await deleteAttachment(attachmentid); 
                POPUP.hide(confirmPopup); 
                showCard(tempConsumer);
                setupCard('View Attachments'); 
            },
        });

        NO_BTN = button.build({
            text: 'NO',
            style: 'secondary',
            type: 'outlined',
            callback: () => {
                POPUP.hide(confirmPopup);  
                showCard(tempConsumer);
                setupCard('View Attachments');
            },
        });

        const message = document.createElement('p');

        message.innerText = 'Are you sure you want to delete this attachment?';
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


    async function deleteAttachment(attachmentId) {
        await rosterAjax.deleteAttachment({
            token: $.session.Token,
            attachmentId: attachmentId,
        });  
        targetSection = consumerInfoCard.querySelector('.attachmentsSection');       
        rosterAjax.getAllAttachments(
            {
                token: $.session.Token,
                locationId: locationId,
                consumerId: consumerId,
                checkDate: selectedDate,
            },
            function (results) {
                populateAttachmentsSection(targetSection, results);
            },
        ); 
    }
    function showRelationshipDetails(section, sectionInner, data) {
        // set sectionInner to display none
        sectionInner.style.display = 'none';
        // check for nulls
        const companyName = data.companyName ? data.companyName : '';
        const title = data.title ? data.title : '';
        const addressOne = data.addressOne ? data.addressOne : '';
        const addressTwo = data.addressTwo ? data.addressTwo : '';
        const city = data.city ? data.city : '';
        const state = data.state ? data.state : '';
        const zipcode = data.zipcode ? data.zipcode : '';
        // show data
        const detailWrap = document.createElement('div');
        detailWrap.classList.add('relationshipDetailWrap');
        detailWrap.innerHTML = `
      <div>
        <p>Company Name</p>
        <p>${companyName}</p>
      </div>
      <div>
        <p>Title</p>
        <p>${title}</p>
      </div>
      <div>
        <p>Address</p>
        <p>${addressOne}</p>
        <p>${addressTwo}</p>
        <p>${city}, ${state} ${zipcode}</p>
      </div>
    `;
        const donebtn = button.build({
            text: 'Done',
            style: 'secondary',
            type: 'contained',
            callback: function () {
                section.removeChild(detailWrap);
                sectionInner.style.display = 'block';
            },
        });
        detailWrap.appendChild(donebtn);
        section.appendChild(detailWrap);
    }
    function populateRelationshipsSection(section, data) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';


        const relationshipTable = document.createElement('div');
        relationshipTable.classList.add('relationshipTable');

        const relationshipHeader = document.createElement('div');
        relationshipHeader.classList.add('relationshipTable__header');
        relationshipHeader.innerHTML = `
      <div></div>
      <div class="relationship__name">Name</div>
      <div class="relationship__type">Relationship</div>
     `;
        const endIcon = document.createElement('div');
        endIcon.classList.add('relationshipTable__endIcon');
        if ($.session.DemographicsUpdateRelationship == true) {
            endIcon.innerHTML = icons['edit'];
        } else {
            endIcon.innerHTML = `<div></div>`;
        }

        relationshipTable.appendChild(relationshipHeader);
        relationshipHeader.appendChild(endIcon);
        sectionInner.appendChild(relationshipTable);

        endIcon.addEventListener('click', e => {
            relationshipEditPopup();
            closeCard();
        });
        if (data.length === 0) {
            const errorMessage = document.createElement('div');
            errorMessage.innerHTML = `<p class="infoNotFoundMessage">No relationships found.</p>`;
            sectionInner.appendChild(errorMessage);
        }

        data.forEach(d => {
            var eventName;
            const rowWrap = document.createElement('div');
            rowWrap.classList.add('relationshipTable__subTableWrap');

            const mainDataRow = document.createElement('div');
            mainDataRow.classList.add('relationshipTable__mainDataRow', 'relationshipTable__dataRow');

            const toggleIcon = document.createElement('div');
            toggleIcon.id = 'authToggle';
            toggleIcon.classList.add('relationshipTable__endIcon');
            toggleIcon.innerHTML = icons['keyArrowRight'];
            mainDataRow.innerHTML = `
        <div class="relationship__name">${d.lastName}, ${d.firstName}</div>
        <div class="relationship__type">${d.description}</div>      
      `;
            mainDataRow.prepend(toggleIcon);
            rowWrap.appendChild(mainDataRow);

            const subRowWrap = document.createElement('div');
            subRowWrap.classList.add('relationshipTable__subRowWrap');

            if (d.primaryPhone && d.primaryPhone.trim().length != 0) {
                const subDataRowPrimaryPhone = document.createElement('div');
                subDataRowPrimaryPhone.classList.add('relationshipTable__subDataRow', 'relationshipTable__dataRow');
                subDataRowPrimaryPhone.innerHTML = `<div></div> 
                <div class="relationship__phone">
                    ${d.primaryPhone && d.primaryPhone.trim().length != 0
                        ? `<b>Primary Phone: </b><a href=tel:+1-${UTIL.formatPhoneNumber(
                            d.primaryPhone.trim(),
                        )}>${UTIL.formatPhoneNumber(d.primaryPhone.trim())}</a><br>`
                        : ``
                    }              
                </div>`;
                subRowWrap.appendChild(subDataRowPrimaryPhone);
            }

            if (d.secondaryPhone && d.secondaryPhone.trim().length != 0) {
                const subDataRowSecondaryPhone = document.createElement('div');
                subDataRowSecondaryPhone.classList.add('relationshipTable__subDataRow', 'relationshipTable__dataRow');
                subDataRowSecondaryPhone.innerHTML = `<div></div> 
                <div class="relationship__phone">               
                    ${d.secondaryPhone && d.secondaryPhone.trim().length != 0
                        ? `<b>Secondary Phone: </b> <a href=tel:+1-${UTIL.formatPhoneNumber(
                            d.secondaryPhone.trim(),
                        )}>${UTIL.formatPhoneNumber(d.secondaryPhone.trim())}</a><br>`
                        : ``
                    }               
                </div>`;
                subRowWrap.appendChild(subDataRowSecondaryPhone);
            }

            if (d.cellularPhone && d.cellularPhone.trim().length != 0) {
                const subDataRowCellularPhone = document.createElement('div');
                subDataRowCellularPhone.classList.add('relationshipTable__subDataRow', 'relationshipTable__dataRow');
                subDataRowCellularPhone.innerHTML = `<div></div> 
                <div class="relationship__phone">              
                    ${d.cellularPhone && d.cellularPhone.trim().length != 0
                        ? `<b>Cellular Phone: </b> <a href=tel:+1-${UTIL.formatPhoneNumber(
                            d.cellularPhone.trim(),
                        )}>${UTIL.formatPhoneNumber(d.cellularPhone.trim())}</a>`
                        : ``
                    }
                </div>`;
                subRowWrap.appendChild(subDataRowCellularPhone);
            }

            if (d.email != null && d.email != '') {
                const subDataRowEmail = document.createElement('div');
                subDataRowEmail.classList.add('relationshipTable__subDataRow', 'relationshipTable__dataRow');
                subDataRowEmail.innerHTML = `<div></div>   
                <div class="relationship__phone">
                    ${d.email ? `<b>Email: </b> <a href=mailto:${d.email}>${d.email}</a>` : ``}
                </div>`;
                subRowWrap.appendChild(subDataRowEmail);
            }

            if ($.session.applicationName === 'Advisor') {
                mainDataRow.addEventListener('click', e => {
                    if (eventName != 'toggle') {
                        showRelationshipDetails(section, sectionInner, d);
                    }
                    eventName = '';
                });
            }
            toggleIcon.addEventListener('click', e => {
                const toggle = document.querySelector('#authToggle');
                eventName = 'toggle';
                if (subRowWrap.classList.contains('active')) {
                    // close it
                    subRowWrap.classList.remove('active');
                    toggleIcon.innerHTML = icons.keyArrowRight;
                } else {
                    // open it
                    subRowWrap.classList.add('active');
                    toggleIcon.innerHTML = icons.keyArrowDown;
                }
            });

            rowWrap.appendChild(subRowWrap);

            sectionInner.appendChild(rowWrap);
        });
    }

    async function relationshipEditPopup(isActive = false) {

        const result = await rosterAjax.getEditConsumerRelationships(consumerId, isActive);
        const { getEditConsumerRelationshipsJSONResult } = result;

        consumerRelationships = getEditConsumerRelationshipsJSONResult;
        archiveConsumerRelationships = getEditConsumerRelationshipsJSONResult;
        numberOfRows = consumerRelationships.length;
        editRelationshipPopup = POPUP.build({
            hideX: true,
            id: "editRelationshipPopup"
        });

        editRelationshipPopup.style.maxWidth = '65%';
        editRelationshipPopup.style.left = '50%';

        showInactive = input.buildCheckbox({
            text: 'Show Inactive',
            id: 'chkShowInactive',
            isChecked: isActive,
            callback: () => {
                POPUP.hide(editRelationshipPopup);
                relationshipEditPopup(event.target.checked);
            }
        });

        const popupHeader = document.createElement("div");
        popupHeader.classList.add("popupHeader");
        const headerWrap = document.createElement("div");
        headerWrap.classList.add("editRelationshipInputWrap");
        const headerText = document.createElement("div");
        headerText.innerHTML = consumerName + "'s Relationship";
        headerWrap.appendChild(headerText);
        headerWrap.appendChild(showInactive);
        popupHeader.appendChild(headerWrap);
        editRelationshipPopup.appendChild(popupHeader);

        for (let i = 0; i < numberOfRows; i++) {
            await createPopupElements(i, consumerRelationships);
            editRelationshipPopup.appendChild(btnWrapInputsN[i]);
        }

        saveRelationshipBtn = button.build({
            id: "saveRelationshipBtn",
            text: "save",
            type: "contained",
            style: "secondary",
            classNames: 'disabled',
            callback: async () => {
                if (!saveRelationshipBtn.classList.contains('disabled')) {
                    await editRelationshipSaveData();
                    POPUP.hide(editRelationshipPopup);
                    showCard(tempConsumer);
                    setupCard('Relationships');
                }
            },
        });

        AddRelationshipBtn = button.build({
            id: "AddRelationshipBtn",
            text: "New",
            type: "contained",
            style: "secondary",
            callback: async () => {
                let i = numberOfRows;
                numberOfRows = numberOfRows + 1;
                await createPopupElements(i, null);
                editRelationshipPopup.insertBefore(btnWrapInputsN[i], relationshipPopupBtnWrap);
                dropdown.populate("hasADropdownN" + i, dataType, '');
                dropdown.populate("whoIsDropdownN" + i, dataName, '');
                popUpSplitTransectionEventHandlers();
                checkRequiredFieldsEditConsumerRelationships();
            },
        });

        cancelRelationshipBtn = button.build({
            id: "cancelRelationshipBtn",
            text: "cancel",
            type: "outlined",
            style: "secondary",
            callback: () => {
                POPUP.hide(editRelationshipPopup);
                showCard(tempConsumer);
                setupCard('Relationships');
                resetPopupValues();
            },
        });

        relationshipPopupBtnWrap = document.createElement("div");
        relationshipPopupBtnWrap.classList.add("editRelationshipBtnWrap");
        relationshipPopupBtnWrap.appendChild(saveRelationshipBtn);
        relationshipPopupBtnWrap.appendChild(AddRelationshipBtn);
        relationshipPopupBtnWrap.appendChild(cancelRelationshipBtn);
        editRelationshipPopup.appendChild(relationshipPopupBtnWrap);
        POPUP.show(editRelationshipPopup);
        await populateEditRelationshipDropdown();
        isValueChanged = false;
        checkRequiredFieldsEditConsumerRelationships();
        popUpSplitTransectionEventHandlers();
    }

    async function createPopupElements(i, getEditConsumerRelationshipsJSONResult) {
        hasADropdownN[i] = dropdown.build({
            id: 'hasADropdownN' + i,
            label: "Has a:",
            dropdownId: "hasADropdownN" + i,
        });

        whoIsDropdownN[i] = dropdown.build({
            id: 'whoIsDropdownN' + i,
            label: "Who is:",
            dropdownId: "whoIsDropdownN" + i,
        });

        startDateInputN[i] = input.build({
            id: 'startDateInputN' + i,
            type: 'date',
            label: 'Start Date:',
            style: 'secondary',
            value: getEditConsumerRelationshipsJSONResult == null ? UTIL.getTodaysDate() : moment(getEditConsumerRelationshipsJSONResult[i].startDate).format('YYYY-MM-DD'),
        });

        endDateInputN[i] = input.build({
            id: 'endDateInputN' + i,
            type: 'date',
            label: 'End Date:',
            style: 'secondary',
            value: getEditConsumerRelationshipsJSONResult == null ? '' : moment(getEditConsumerRelationshipsJSONResult[i].endDate).format('YYYY-MM-DD'),
        });

        deleteBtnN[i] = button.build({
            id: 'deleteBtnN' + i,
            type: 'text',
            icon: 'delete',
            style: 'secondary',
            callback: function (event) {
                isValueChanged = true;
                var deleteToId = Number(event.target.id.replace('deleteBtnN', ''));
                editRelationshipPopup.removeChild(btnWrapInputsN[deleteToId]);
                deletedIds.push(deleteToId);
                checkRequiredFieldsEditConsumerRelationships();
                popUpSplitTransectionEventHandlers();
            },
        });

        btnWrapInputsN[i] = document.createElement("div");
        btnWrapInputsN[i].classList.add("editRelationshipInputWrap");
        hasADropdownN[i].classList.add('width22Per');
        btnWrapInputsN[i].appendChild(hasADropdownN[i]);
        whoIsDropdownN[i].classList.add('width22Per');
        btnWrapInputsN[i].appendChild(whoIsDropdownN[i]);
        startDateInputN[i].classList.add('width23Per');
        btnWrapInputsN[i].appendChild(startDateInputN[i]);
        endDateInputN[i].classList.add('width23Per');
        btnWrapInputsN[i].appendChild(endDateInputN[i]);
        deleteBtnN[i].classList.add('width4Per');
        btnWrapInputsN[i].appendChild(deleteBtnN[i]);
    }

    function popUpSplitTransectionEventHandlers() {
        for (let i = 0; i < numberOfRows; i++) {
            startDateInputN[i].addEventListener('input', event => {
                isValueChanged = true;
                checkRequiredFieldsEditConsumerRelationships();
            });
            endDateInputN[i].addEventListener('input', event => {
                isValueChanged = true;
                checkRequiredFieldsEditConsumerRelationships();
            });

            hasADropdownN[i].addEventListener('change', async event => {
                isValueChanged = true;
                if ($.session.applicationName === 'Gatekeeper') {
                    var selectedDropdownId = event.target.id.replace('hasADropdownN', '');
                    var selectedValue = event.target.value;
                    await rePopulateEditRelationshipDropdown(selectedDropdownId, selectedValue, '');
                }
                checkRequiredFieldsEditConsumerRelationships();
            });
            whoIsDropdownN[i].addEventListener('change', event => {
                isValueChanged = true;
                checkRequiredFieldsEditConsumerRelationships();
            });
        }
    }

    function checkRequiredFieldsEditConsumerRelationships() {
        for (let i = 0; i < numberOfRows; i++) {
            var hasA = hasADropdownN[i].querySelector('#hasADropdownN' + i);
            var whoIs = whoIsDropdownN[i].querySelector('#whoIsDropdownN' + i);
            var startDate = startDateInputN[i].querySelector('#startDateInputN' + i);
            var endDate = endDateInputN[i].querySelector('#endDateInputN' + i);

            if (hasA.value === '') {
                hasADropdownN[i].classList.add('errorPopup');
            } else {
                hasADropdownN[i].classList.remove('errorPopup');
            }

            if (whoIs.value === '') {
                whoIsDropdownN[i].classList.add('errorPopup');
            } else {
                whoIsDropdownN[i].classList.remove('errorPopup');
            }

            if (startDate.value === '' || (endDate.value != '' && startDate.value > endDate.value)) {
                startDateInputN[i].classList.add('errorPopup');
            } else {
                startDateInputN[i].classList.remove('errorPopup');
            }
        }
        setBtnStatusEditConsumerRelationships();
    }

    function setBtnStatusEditConsumerRelationships() {
        var hasErrors = [].slice.call(document.querySelectorAll('.errorPopup'));
        if (hasErrors.length !== 0) {
            saveRelationshipBtn.classList.add('disabled');
            return;
        } else {
            if (isValueChanged)
                saveRelationshipBtn.classList.remove('disabled');
            else
                saveRelationshipBtn.classList.add('disabled');
        }
    }

    async function populateEditRelationshipDropdown() {
        const {
            getRelationshipsNameJSONResult: RelationshipsName,
        } = await rosterAjax.getRelationshipsName();
        dataName = RelationshipsName.map((relationshipsName) => ({
            id: relationshipsName.personID,
            value: relationshipsName.personID,
            text: relationshipsName.name,
            style: relationshipsName.statusCode != 'A' && relationshipsName.statusCode != null ? 'italic' : ''
        }));
        dataName.unshift({ id: null, value: '', text: '' });

        const {
            getRelationshipsTypeJSONResult: RelationshipsType,
        } = await rosterAjax.getRelationshipsType();
        dataType = RelationshipsType.map((relationshipsType) => ({
            id: relationshipsType.typeID,
            value: relationshipsType.typeID,
            text: relationshipsType.description
        }));
        dataType.unshift({ id: null, value: '', text: '' });
        for (let i = 0; i < numberOfRows; i++) {
            dropdown.populate("hasADropdownN" + i, dataType, consumerRelationships[i] != undefined ? consumerRelationships[i].typeID : '');

            if ($.session.applicationName === 'Gatekeeper' && consumerRelationships[i] != undefined && consumerRelationships[i].typeID != '') {
                await rePopulateEditRelationshipDropdown(i, consumerRelationships[i].typeID, consumerRelationships[i] != undefined ? consumerRelationships[i].personID : '')
            } else {
                dropdown.populateStyle("whoIsDropdownN" + i, dataName, consumerRelationships[i] != undefined ? consumerRelationships[i].personID : '');
            }
        }
    }

    async function rePopulateEditRelationshipDropdown(selectedDropdownId, selectedValue , personId) {
        const {
            getRelationshipsNameByIDJSONResult: RelationshipsName,
        } = await rosterAjax.getRelationshipsNameByID(selectedValue);

        dataName = RelationshipsName.map((relationshipsName) => ({
            id: relationshipsName.personID,
            value: relationshipsName.personID,
            text: relationshipsName.name,
            style: relationshipsName.statusCode != 'A' && relationshipsName.statusCode != null ? 'italic' : ''
        }));
        dataName.unshift({ id: null, value: '', text: '' });
        dropdown.populateStyle("whoIsDropdownN" + selectedDropdownId, dataName, personId);
    }

    async function editRelationshipSaveData() {
        consumerRelationshipsNew = [];
        for (let i = 0; i < numberOfRows; i++) {
            var hasA = hasADropdownN[i].querySelector('#hasADropdownN' + i);
            var whoIs = whoIsDropdownN[i].querySelector('#whoIsDropdownN' + i);
            var startDate = startDateInputN[i].querySelector('#startDateInputN' + i);
            var endDate = endDateInputN[i].querySelector('#endDateInputN' + i);

            if (hasA.value !== '' && !deletedIds.includes(i)) {
                consumerRelationshipsNew.push({
                    "consumerId": consumerId,
                    "endDate": endDate.value,
                    "personID": whoIs.options[whoIs.selectedIndex].id,
                    "startDate": startDate.value,
                    "typeID": hasA.options[hasA.selectedIndex].id
                });
            }
        }


        for (let j = 0; j < consumerRelationshipsNew.length; j++) {
            for (let i = 0; i < consumerRelationships.length; i++) {

                archiveConsumerRelationships[i].endDate = consumerRelationships[i].endDate == '' ? '' : moment(consumerRelationships[i].endDate).format('YYYY-MM-DD');
                archiveConsumerRelationships[i].startDate = moment(consumerRelationships[i].startDate).format('YYYY-MM-DD');

                if (archiveConsumerRelationships[i].endDate == consumerRelationshipsNew[j].endDate && consumerRelationships[i].personID == consumerRelationshipsNew[j].personID
                    && moment(consumerRelationships[i].startDate).format('YYYY-MM-DD') == consumerRelationshipsNew[j].startDate && consumerRelationships[i].typeID == consumerRelationshipsNew[j].typeID) {
                    const index = archiveConsumerRelationships.indexOf(archiveConsumerRelationships[i]);
                    archiveConsumerRelationships.splice(index, 1);
                }
            }
        }

        await rosterAjax.insertEditRelationship(consumerRelationshipsNew, archiveConsumerRelationships, consumerId);
        resetPopupValues();
    }

    function resetPopupValues() {
        btnWrapInputsN = [];
        hasADropdownN = [];
        startDateInputN = [];
        whoIsDropdownN = [];
        endDateInputN = [];
        deleteBtnN = [];
        consumerRelationships = [];
        consumerRelationshipsNew = [];
        deletedIds = [];
        archiveConsumerRelationships = []
    }

    // workflow
    async function populateWorkflowSection(section) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        rosterWorkflow.init(consumerId, consumerName, ({ workflowViewer, addWorkflowBtn }) => {
            sectionInner.innerHTML = '';
            sectionInner.appendChild(workflowViewer);
            sectionInner.appendChild(addWorkflowBtn);
        });

        const { workflowViewer, addWorkflowBtn } = await rosterWorkflow.getWorkflowScreen();

        sectionInner.appendChild(workflowViewer);
        sectionInner.appendChild(addWorkflowBtn);
    }

    // *schedule
    function populateScheduleTable(sectionInner, locationId) {
        function populateTable(sectionInner, schedule) {
            var showWeekOne = !schedule.isWeekOneEmpty;
            var showWeekTwo = !schedule.isWeekTwoEmpty;

            var tableWrap = document.querySelector('.consumerScheduleTable');
            if (!tableWrap) {
                var tableWrap = document.createElement('div');
                tableWrap.classList.add('consumerScheduleTable');
            } else {
                tableWrap.innerHTML = '';
            }

            if (!showWeekOne && !showWeekTwo) {
                tableWrap.innerHTML = `<p class="infoNotFoundMessage">There is nothing scheduled for this location</p>`;
            }

            var columnHeadings = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
            var scheduleTable1 = table.build({
                tableId: 'consumerScheduleWeekOne',
                columnHeadings,
            });
            var scheduleTable2 = table.build({
                tableId: 'consumerScheduleWeekTwo',
                columnHeadings,
            });

            // Populate table
            var table1Data = orderScheduleData(schedule.weekOne);
            var table2Data = orderScheduleData(schedule.weekTwo);
            if (showWeekOne) table.populate(scheduleTable1, table1Data);
            if (showWeekTwo) table.populate(scheduleTable2, table2Data);

            // Append table
            if (showWeekOne) tableWrap.appendChild(scheduleTable1);
            if (showWeekTwo) tableWrap.appendChild(scheduleTable2);
            if (showWeekOne || showWeekTwo) sectionInner.appendChild(tableWrap);
        }
        rosterAjax.getConsumerSchedule(locationId, consumerId, function (scheduleResults) {
            var scheduleResultsObj = { weekOne: { start: {}, end: {} }, weekTwo: { start: {}, end: {} } };
            var scheduleResultsObjKeys = Object.keys(scheduleResults[0]);
            var isWeekOneEmpty = true;
            var isWeekTwoEmpty = true;
            scheduleResultsObjKeys.forEach(key => {
                if (key.indexOf('2') === -1) {
                    if (key.indexOf('End') === -1) {
                        var newkey = key.replace('Start', '');
                        if (!scheduleResultsObj.weekOne.start[newkey]) {
                            scheduleResultsObj.weekOne.start[newkey] = UTIL.convertFromMilitary(scheduleResults[0][key]);
                        }
                    } else {
                        var newkey = key.replace('End', '');
                        if (!scheduleResultsObj.weekOne.end[newkey]) {
                            scheduleResultsObj.weekOne.end[newkey] = UTIL.convertFromMilitary(scheduleResults[0][key]);
                        }
                    }
                    if (scheduleResults[0][key] !== '') isWeekOneEmpty = false;
                } else {
                    if (key.indexOf('End') === -1) {
                        var newkey = key.replace('Start2', '');
                        if (!scheduleResultsObj.weekTwo.start[newkey]) {
                            scheduleResultsObj.weekTwo.start[newkey] = UTIL.convertFromMilitary(scheduleResults[0][key]);
                        }
                    } else {
                        var newkey = key.replace('End2', '');
                        if (!scheduleResultsObj.weekTwo.end[newkey]) {
                            scheduleResultsObj.weekTwo.end[newkey] = UTIL.convertFromMilitary(scheduleResults[0][key]);
                        }
                    }

                    if (scheduleResults[0][key] !== '') isWeekTwoEmpty = false;
                }
            });
            scheduleResultsObj.isWeekOneEmpty = isWeekOneEmpty;
            scheduleResultsObj.isWeekTwoEmpty = isWeekTwoEmpty;
            populateTable(sectionInner, scheduleResultsObj);
        });
    }
    function populateScheduleSection(targetSection, locations) {
        var sectionInner = targetSection.querySelector('.sectionInner');
        sectionInner.innerHTML = '';

        if (locations.length === 0) {
            sectionInner.innerHTML = 'Consumer has no locations';
            return;
        }

        var locationDropdown = dropdown.build({
            id: 'consumerLocationScheduleDropdown',
            label: 'Location',
            style: 'secondary',
        });

        var locationDropdownData = locations.map(al => {
            return {
                value: al.id,
                text: al.name,
            };
        });

        dropdown.populate(locationDropdown, locationDropdownData);
        sectionInner.appendChild(locationDropdown);
        locationDropdown.addEventListener('change', function (event) {
            populateScheduleTable(sectionInner, event.target.value);
        });

        // populate table
        populateScheduleTable(sectionInner, locationDropdownData[0].value);
    }
    function populateIntellivueSection(section, data) {
        var sectionInner = section.querySelector('.sectionInner');
        sectionInner.innerHTML = '';
        var url;

        if (data.size === 0) {
            sectionInner.innerHTML = `<p class="infoNotFoundMessage">No applications found.</p>`;
            return;
        }

        var applicationList = document.createElement('h2');
        applicationList.innerHTML = 'Applications';
        applicationList.classList.add('applicationList');
        var lineBR = document.createElement('br');
        applicationList.appendChild(lineBR);

        sectionInner.appendChild(applicationList);

        for (let [k, v] of data) {
            var appId = k;

            intellivue.getViewURL(consumerId, appId, res => {
                var application = document.createElement('div');
                application.classList.add('application');
                application.innerHTML = `
							<p><a href="${res}" target="_blank">${v}</a></p>
							`;
                applicationList.appendChild(application);
            });
        }

        //      data.forEach(appName => {
        //          test = data.key;
        //	var appId = data.indexOf(appName) +1;
        //	var application = document.createElement('div');
        //	application.classList.add('application');

        //	intellivue.getViewURL(consumerId, appId, res => { application.innerHTML = `
        //	<p><a href="${res}" target="_blank">${appName}</a></p>
        //	`});

        //	sectionInner.appendChild(application);
        //})

        sectionInner.appendChild(applicationList);
    }

    // Card Sections
    function buildSections(sections) {
        return sections.map((sec, index) => {
            // section
            var section = document.createElement('div');
            var className = [`${sec}Section`, `sec${index + 1}`];
            section.classList.add('infoCardSection', ...className);
            // section inner
            var cardInner = document.createElement('div');
            cardInner.classList.add('sectionInner');
            section.appendChild(cardInner);
            return section;
        });
    }
    function buildMenu() {
        var cardMenuList = document.createElement('div');
        cardMenuList.classList.add('menuList', 'sec0');

        var cardInner = document.createElement('div');
        cardInner.classList.add('sectionInner');
        menuNewList = [];
        if ($.session.DemographicsView === false) {
            // pointless reset based off above session variable
            $.session.DemographicsView = false;
            $.session.DemographicsRelationshipsView = false;
            $.session.viewLocationSchedulesKey = false;
            $.session.DemographicsViewAttachments = false;
            $.session.intellivuePermission = '';
        }

        var menuItems = [
            {
                title: 'Mark As Absent',
                icon: 'no',
                className: 'absent',
                visible: $.session.useAbsentFeature === 'Y' ? true : false,
            },
            {
                title: 'Change Photo',
                icon: 'camera',
                className: 'photo',
                visible: $.session.DemographicsPictureUpdate,
            },
            { title: 'Add To Group', icon: 'selectAll', className: 'group', visible: true },
            {
                title: 'Consumer Notes',
                icon: 'note',
                className: 'consumerNote',
                visible: $.session.DemographicsNotesView,
            },
            {
                title: 'Progress Notes',
                icon: 'note',
                className: 'progressNote',
                visible: $.session.useProgressNotes === 'Y' ? true : false,
            },
            {
                title: 'Demographics',
                icon: 'info',
                className: 'demographics',
                visible: $.session.DemographicsView,
            },
            {
                title: 'Relationships',
                icon: 'people',
                className: 'relationships',
                visible: $.session.DemographicsRelationshipsView,
            },
            {
                title: 'View Attachments',
                icon: 'attachment',
                className: 'attachments',
                visible: $.session.DemographicsViewAttachments,
            },
            {
                title: 'View Schedule',
                icon: 'calendar',
                className: 'schedule',
                visible: $.session.viewLocationSchedulesKey,
            },
            {
                title: 'Intellivue',
                icon: 'info',
                className: 'intellivue',
                visible: $.session.intellivuePermission === '' ? false : true,
            },
            {
                title: 'Workflow',
                icon: 'workflow',
                className: 'workflow',
                visible: true,
            },
        ];
        menuItems.forEach(mi => {
            if (!mi.visible) return;
            var item = document.createElement('div');
            item.setAttribute('data-info-task', mi.title);
            item.classList.add('menuList__item', mi.className);

            var itemTitle = document.createElement('p');
            itemTitle.innerHTML = mi.title;

            item.innerHTML = icons[mi.icon];
            item.appendChild(itemTitle);
            item.innerHTML += icons['keyArrowRight'];

            cardInner.appendChild(item);
            menuNewList.push(mi);
        });
        cardMenuList.appendChild(cardInner);

        return cardMenuList;
    }

    // Consumer Info Card
    function setupCardEvents(cardMenu) {
        cardMenu.addEventListener('click', event => {
            var action = event.target.dataset.infoTask;
            setupCard(action);
        });
    }

    async function setupCard(action) {
        var targetSection;
        currentScreen = action;
        var arraynumber = menuNewList.findIndex(x => x.title == currentScreen);
        previousScreen = menuNewList[arraynumber - 1] == undefined ? null : menuNewList[arraynumber - 1].title;
        nextScreen = menuNewList[arraynumber + 1] == undefined ? null : menuNewList[arraynumber + 1].title;

        if (previousScreen == null) {
            backwordBtn.classList.remove('hidden');
            backwordBtn.classList.add('disabled');
        } else {
            backwordBtn.classList.remove('hidden');
            backwordBtn.classList.remove('disabled');
        }
        if (nextScreen == null) {
            forwardBtn.classList.add('hidden');
        } else {
            forwardBtn.classList.remove('hidden');
        }

        document.getElementById('backwordBtn').innerHTML =
            menuNewList[arraynumber - 1] == undefined
                ? null
                : `${icons['arrowBack']}` + '' + menuNewList[arraynumber - 1].title;
        document.getElementById('forwardBtn').innerHTML =
            menuNewList[arraynumber + 1] == undefined
                ? null
                : menuNewList[arraynumber + 1].title + '' + `${icons['arrowNext']}`;

        switch (action) {
            case 'Mark As Absent': {
                targetSection = consumerInfoCard.querySelector('.absentSection');
                absentAjax.selectAbsent(
                    {
                        token: $.session.Token,
                        consumerId,
                        locationId,
                        statusDate: selectedDate,
                    },
                    function (results) {
                        populateAbsentSection(targetSection, results);
                    },
                );
                break;
            }
            case 'Change Photo': {
                targetSection = consumerInfoCard.querySelector('.photoSection');
                populatePhotoSection(targetSection);
                break;
            }
            case 'Add To Group': {
                targetSection = consumerInfoCard.querySelector('.groupSection');
                populateGroupSection(targetSection);
                break;
            }
            case 'Consumer Notes': {
                targetSection = consumerInfoCard.querySelector('.notesSection');
                rosterAjax.getDemographicsNotes(consumerId, function (results) {
                    populateNotesSection(targetSection, results);
                });
                break;
            }
            case 'Progress Notes': {
                targetSection = consumerInfoCard.querySelector('.progressNotesSection');
                progressNotes.init(targetSection, locationId, consumerId);
                progressNotes.getConsumerNotes(function (results) {
                    populateProgressNotesSection(targetSection, results);
                });
                break;
            }
            case 'View Attachments': {
                targetSection = consumerInfoCard.querySelector('.attachmentsSection'); 
                rosterAjax.getAllAttachments(
                    {
                        token: $.session.Token,
                        locationId: locationId,
                        consumerId: consumerId,
                        checkDate: selectedDate,
                    },
                    function (results) {
                        populateAttachmentsSection(targetSection, results);
                    },
                );
                break;
            }
            case 'View Schedule': {
                targetSection = consumerInfoCard.querySelector('.scheduleSection');
                rosterAjax.getConsumerScheduleLocation(consumerId, function (locationResults) {
                    populateScheduleSection(targetSection, locationResults);
                });
                break;
            }
            case 'Demographics': {
                targetSection = consumerInfoCard.querySelector('.demographicsSection');
                rosterAjax.getConsumerDemographics(consumerId, function (results) {
                    demographics.populate(targetSection, results[0], consumerId, tempConsumer);
                });
                break;
            }
            case 'Relationships': {
                targetSection = consumerInfoCard.querySelector('.relationshipsSection');
                rosterAjax.getConsumerRelationships(consumerId, function (results) {
                    populateRelationshipsSection(targetSection, results);
                });
                break;
            }
            case 'Intellivue': {
                targetSection = consumerInfoCard.querySelector('.intellivueSection');
                intellivue.getApplicationListHostedWithUser(function (results) {
                    populateIntellivueSection(targetSection, results);
                });
                break;
            }
            case 'Workflow': {
                targetSection = consumerInfoCard.querySelector('.workflowSection');
                await populateWorkflowSection(targetSection);
            }
        }

        if (targetSection) {
            var sectionBackBtn = document.querySelector('.sectionBackBtn');
            sectionBackBtn.classList.remove('hidden');
            showCardSection(targetSection);
        }
    }

    function buildCard() {
        consumerInfoCard = document.createElement('div');
        consumerInfoCard.classList.add('consumerInfoCard');

        var btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        var navBtnWrap = document.createElement('div');
        navBtnWrap.classList.add('btnWrap');

        var backBtn = button.build({
            text: 'Back',
            style: 'secondary',
            type: 'text',
            icon: 'arrowBack',
            classNames: ['sectionBackBtn', 'hidden'],
            callback: handleBackButtonClick,
        });
        var closeBtn = button.build({
            text: 'Close',
            style: 'secondary',
            type: 'text',
            icon: 'close',
            classNames: 'consumerInfoCloseBtn',
            callback: closeCard,
        });

        backwordBtn = button.build({
            id: 'backwordBtn',
            text: previousScreen,
            style: 'secondary',
            type: 'text',
            classNames: 'consumerInfoBackwardBtn',
        });
        forwardBtn = button.build({
            id: 'forwardBtn',
            text: nextScreen,
            style: 'secondary',
            type: 'text',
            classNames: 'consumerInfoForwardBtn',
        });
        btnWrap.appendChild(backBtn);
        btnWrap.appendChild(closeBtn);

        navBtnWrap.appendChild(backwordBtn);
        navBtnWrap.appendChild(forwardBtn);

        var cardInner = document.createElement('div');
        cardInner.classList.add('cardInner');
        var cardHeading = document.createElement('div');
        cardHeading.classList.add('consumerInfoCard__heading');
        var cardBody = document.createElement('div');
        cardBody.classList.add('consumerInfoCard__body');

        var cardMenu = buildMenu();
        cardBody.appendChild(cardMenu);

        var sections = buildSections([
            'absent',
            'photo',
            'group',
            'notes',
            'progressNotes',
            'demographics',
            'relationships',
            'attachments',
            'schedule',
            'intellivue',
            'workflow',
        ]);
        sections.forEach(section => {
            cardBody.appendChild(section);
        });

        // Build card
        cardInner.appendChild(cardHeading);
        cardInner.appendChild(navBtnWrap);
        cardInner.appendChild(cardBody);

        consumerInfoCard.appendChild(btnWrap);
        consumerInfoCard.appendChild(cardInner);

        setupCardEvents(cardMenu);

        modalOverlay = document.querySelector('.overlay');

        document.body.appendChild(consumerInfoCard);

        backwordBtn.classList.add('hidden');
        forwardBtn.classList.add('hidden');
        eventListeners();
        return consumerInfoCard;
    }

    function eventListeners() {
        // Add event listener to close the card when clicking outside of it
        modalOverlay.addEventListener('click', function (event) {
            closeCard();
        });
        forwardBtn.addEventListener('click', function (event) {
            handleBackButtonClick();
            setupCard(nextScreen);
        });
        backwordBtn.addEventListener('click', function (event) {
            handleBackButtonClick();
            setupCard(previousScreen);
        });
    }

    return {
        buildCard,
        showCard,
        showCardSubSection,
        toggleHideShowAbsentMenuSection,
        closeCard,
    };
})();
