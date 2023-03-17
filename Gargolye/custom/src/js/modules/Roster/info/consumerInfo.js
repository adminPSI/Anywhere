var consumerInfo = (function () {
  var locationId;
  var consumerId;
  var selectedDate;
  var consumerInfoCard;
  var currentlyVisibleSection;
  var hasUnreadNote;

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
  async function updateConsumerPhoto(event) {
    event.preventDefault();
    var targetConsumerId = consumerInfoCard.dataset.consumerid;
    var consumerCardFromRosterList = document.querySelector(
      `[data-consumer-id="${targetConsumerId}"]`,
    );

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

      getImageOrientation(event.target.files[0], function (orientation) {});
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
        values: [
          data.end.Sun,
          data.end.Mon,
          data.end.Tues,
          data.end.Wed,
          data.end.Thur,
          data.end.Fri,
          data.end.Sat,
        ],
      },
    ];

    return tableData;
  }
  function toggleHideShowAbsentMenuSection(locationid) {
    var menulist = document.querySelector('.menuList');
    var absentMenuItem = menulist.querySelector('[data-info-task="Mark As Absent"]');
    if ((locationid === '000' || locationid === '0') && absentMenuItem !== null) {
      absentMenuItem.classList.add('hidden');
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
    var consumersWithUnreadNotes = roster2.getConsumersWithUnreadNotes();
    hasUnreadNote = consumersWithUnreadNotes[consumer.dataset.consumerId];

    if ($.session.selectedLocation[0] === '0') {
      var menuItem = document.querySelector('.menuList .progressNote');
      if (menuItem) menuItem.classList.add('hidden');
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

    var rosterList = document.querySelector('.roster');
    rosterList.classList.add('fadeOut');
    DOM.toggleHeaderOpacity();

    setTimeout(function () {
      consumerInfoCard.classList.add('visible');
      if (!isMobile) {
        bodyScrollLock.disableBodyScroll(consumerInfoCard);
      }
    }, 300);
  }
  function closeCard() {
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
      var rosterList = document.querySelector('.roster');
      rosterList.classList.remove('hidden');
      rosterList.classList.remove('fadeOut');
      DOM.toggleHeaderOpacity();
      if (!isMobile) {
        bodyScrollLock.enableBodyScroll(consumerInfoCard);
      }
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

    var photoInput = input.build({
      label: 'Choose Image',
      type: 'file',
      accept: 'image/*',
      style: 'secondary',
      attributes: [{ key: 'multiple', value: 'false' }],
    });

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

      var attachment = document.createElement('div');
      attachment.classList.add('attachment');
      attachment.setAttribute('data-attachments-id', d.attachmentid);
      attachment.innerHTML = `
        <p class="attachment__name">${fileName}</p>
        <p class="attachment__type">${fileType}</p>
        <p class="attachment__icon">${icons.download}</p>
      `;

      attachment.addEventListener('click', () => {
        downloadAttachment(d.attachmentid);
      });

      attachmentsList.appendChild(attachment);
    });

    sectionInner.appendChild(attachmentsList);
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

    if (data.length === 0) {
      sectionInner.innerHTML = `<p class="infoNotFoundMessage">No relationships found.</p>`;
      return;
    }

    const relationshipHeader = document.createElement('div');
    relationshipHeader.classList.add('relationship', 'relationship__header');
    relationshipHeader.innerHTML = `
      <div class="relationship__name">Name</div>
      <div class="relationship__type">Relationship</div>
      <div class="relationship__phone">Phone</div>
    `;
    sectionInner.appendChild(relationshipHeader);

    data.forEach(d => {
      const relationship = document.createElement('div');
      relationship.classList.add('relationship');
      relationship.innerHTML = `
        <div class="relationship__name">${d.lastName}, ${d.firstName}</div>
        <div class="relationship__type">${d.description}</div>
        <div class="relationship__phone">		
        ${
          d.primaryPhone && d.primaryPhone.trim().length != 0
            ? `P1: <a href=tel:+1-${UTIL.formatPhoneNumber(
                d.primaryPhone.trim(),
              )}>${UTIL.formatPhoneNumber(d.primaryPhone.trim())}</a><br>`
            : ``
        }
        ${
          d.secondaryPhone && d.secondaryPhone.trim().length != 0
            ? `P2: <a href=tel:+1-${UTIL.formatPhoneNumber(
                d.secondaryPhone.trim(),
              )}>${UTIL.formatPhoneNumber(d.secondaryPhone.trim())}</a><br>`
            : ``
        }
        ${
          d.cellularPhone && d.cellularPhone.trim().length != 0
            ? `C: <a href=tel:+1-${UTIL.formatPhoneNumber(
                d.cellularPhone.trim(),
              )}>${UTIL.formatPhoneNumber(d.cellularPhone.trim())}</a>`
            : ``
        }
        </div>
      `;

      if ($.session.applicationName === 'Advisor') {
        relationship.addEventListener('click', e =>
          showRelationshipDetails(section, sectionInner, d),
        );
      }

      sectionInner.appendChild(relationship);
    });
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
              scheduleResultsObj.weekOne.start[newkey] = UTIL.convertFromMilitary(
                scheduleResults[0][key],
              );
            }
          } else {
            var newkey = key.replace('End', '');
            if (!scheduleResultsObj.weekOne.end[newkey]) {
              scheduleResultsObj.weekOne.end[newkey] = UTIL.convertFromMilitary(
                scheduleResults[0][key],
              );
            }
          }
          if (scheduleResults[0][key] !== '') isWeekOneEmpty = false;
        } else {
          if (key.indexOf('End') === -1) {
            var newkey = key.replace('Start2', '');
            if (!scheduleResultsObj.weekTwo.start[newkey]) {
              scheduleResultsObj.weekTwo.start[newkey] = UTIL.convertFromMilitary(
                scheduleResults[0][key],
              );
            }
          } else {
            var newkey = key.replace('End2', '');
            if (!scheduleResultsObj.weekTwo.end[newkey]) {
              scheduleResultsObj.weekTwo.end[newkey] = UTIL.convertFromMilitary(
                scheduleResults[0][key],
              );
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
    // sections = ['']
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
    });

    cardMenuList.appendChild(cardInner);

    return cardMenuList;
  }
  // Consumer Info Card
  function setupCardEvents(cardMenu) {
    cardMenu.addEventListener('click', event => {
      var action = event.target.dataset.infoTask;
      var targetSection;

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
            demographics.populate(targetSection, results[0], consumerId);
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
      }

      if (targetSection) {
        var sectionBackBtn = document.querySelector('.sectionBackBtn');
        sectionBackBtn.classList.remove('hidden');
        showCardSection(targetSection);
      }
    });
  }
  function buildCard() {
    consumerInfoCard = document.createElement('div');
    consumerInfoCard.classList.add('consumerInfoCard');

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
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
    btnWrap.appendChild(backBtn);
    btnWrap.appendChild(closeBtn);

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
    ]);
    sections.forEach(section => {
      cardBody.appendChild(section);
    });

    // build card
    cardInner.appendChild(cardHeading);
    cardInner.appendChild(cardBody);

    consumerInfoCard.appendChild(btnWrap);
    consumerInfoCard.appendChild(cardInner);

    setupCardEvents(cardMenu);

    return consumerInfoCard;
  }

  return {
    buildCard,
    showCard,
    showCardSubSection,
    toggleHideShowAbsentMenuSection,
  };
})();
