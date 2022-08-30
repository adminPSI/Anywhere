var locationNotes = (function () {
  //-DOM------------------
  //*all
  var allNotesPage;
  var allNotesList;
  //*single
  var singleNotePage;
  var singleNotesList;
  //-DATA-----------------
  var allNotesData;
  var singleNoteData;
  //-VALUES---------------
  var selectedLocation;
  var selectedLocationId;

  // UTIL
  //---------------------------------------------
  function formatTime(datecreated) {
    // datecreated = "11/6/2019 8:49:11 AM"
    var datecreatedArray = datecreated.split(' ');
    var time = datecreatedArray[1].split(':');
    time = `${time[0]}:${time[1]} ${datecreatedArray[2]}`;
    return time;
  }
  function sortDataByDate(data) {
    data.sort((a, b) => {
      if (a.datecreated && b.datecreated) {
        var dateArrayA = a.datecreated.split(' ');
        var dateArrayB = b.datecreated.split(' ');
      } else {
        var dateArrayA = a.Date_Entered.split(' ');
        var dateArrayB = b.Date_Entered.split(' ');
      }

      var dateA = dateArrayA[0];
      var dateB = dateArrayB[0];

      dateA = new Date(a.datecreated);
      dateB = new Date(b.datecreated);

      if (dateA > dateB) {
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    });
    return data;
  }
  function buildNoteImage() {
    return `<img class="pic" src="./images/new-icons/default.jpg"/>`;
  }
  function buildNoteAuthorName(name) {
    return `<p class="name">${name}</p>`;
  }
  function buildNoteDateTime(date, time) {
    return `<div class="dateTime"><p>${date}</p><p>${time}</p></div>`;
  }
  function buildNoteTitle(title) {
    return `<p class="title">${title}</p>`;
  }
  function buildNoteText(text) {
    return `<p>${text}</p>`;
  }
  function buildNoteDetails(image, name, dateTime) {
    var details = document.createElement('div');
    details.classList.add('locationNote__details');
    details.innerHTML = `${image}${name}${dateTime}`;
    return details;
  }
  function buildNoteMessageg(title, notePreview) {
    var message = document.createElement('div');
    message.classList.add('locationNote__message');
    message.innerHTML = `
      ${title}${notePreview}
    `;
    return message;
  }
  function buildNote(details, message) {
    var note = document.createElement('div');
    note.classList.add('locationNote');
    note.appendChild(details);
    note.appendChild(message);
    return note;
  }
  function buildTitleInput() {
    return input.build({
      label: 'Title',
      style: 'secondary',
      type: 'text',
      attributes: [{ key: 'maxlength', value: '250' }],
    });
  }
  function buildTextInput() {
    return input.build({
      label: 'Message',
      style: 'secondary',
      type: 'textarea',
      attributes: [{ key: 'maxlength', value: '10000' }],
    });
  }
  function buildSendBtn() {
    return button.build({
      text: 'Send',
      type: 'contained',
      style: 'secondary',
    });
  }

  // Single Note Page
  //---------------------------------------------
  function getSingleNoteData(noteId, callback) {
    locationNotesAjax.selectLocationNote(noteId, function (results) {
      singleNoteData = sortDataByDate(results);
      callback();
    });
  }
  function handleReplyToNoteBtnClick(noteId) {
    // build
    var notePopup = POPUP.build({});
    var noteTextInput = buildTextInput();
    var sendNoteBtn = buildSendBtn();
    notePopup.appendChild(noteTextInput);
    notePopup.appendChild(sendNoteBtn);
    // show
    POPUP.show(notePopup);
    // events
    var noteText;
    noteTextInput.addEventListener('change', event => {
      noteText = event.target.value;
    });
    sendNoteBtn.addEventListener('click', event => {
      locationNotesAjax.updateLocationNote(
        {
          token: $.session.Token,
          noteId: noteId,
          locationId: selectedLocationId,
          note: UTIL.removeUnsavableNoteText(noteText),
        },
        results => {
          POPUP.hide(notePopup);
          loadSingleNotePage(noteId);
        },
      );
    });
  }
  function populateSingleNotePage(noteId) {
    singleNoteData.forEach(note => {
      // data
      var noteDate = note.Date_Entered.split(' ')[0];
      var noteTime = formatTime(note.Date_Entered);
      var noteAuthor = `${note.firstname} ${note.lastname}`;
      var noteTitle = note.notetitle;
      var noteText = note.note;
      var empId = note.emp_id;
      // dom
      var image = buildNoteImage(empId);
      var name = buildNoteAuthorName(noteAuthor);
      var dateTime = buildNoteDateTime(noteDate, noteTime);
      var title = buildNoteTitle(noteTitle);
      var notePreview = buildNoteText(noteText);
      // details - img, name, date, time
      var details = buildNoteDetails(image, name, dateTime);
      // message - title & text
      var message = buildNoteMessageg(title, notePreview);

      var note = buildNote(details, message);

      singleNotesList.appendChild(note);
    });

    var topNav = document.createElement('div');
    topNav.classList.add('locationNotesTopNav');

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    var backToNotesMain = button.build({
      text: 'Back To Notes',
      icon: 'arrowBack',
      type: 'text',
      style: 'secondary',
      classNames: 'backToRosterBtn',
      callback: function () {
        loadAllNotesPage();
      },
    });
    var newNoteBtn = button.build({
      text: 'New Note',
      type: 'contained',
      style: 'secondary',
      classNames: 'newNoteBtn',
      callback: function () {
        handleReplyToNoteBtnClick(noteId);
      },
    });

    var locationLabel = document.createElement('div');
    locationLabel.classList.add('locationLabel');
    locationLabel.innerHTML = `<h2>${selectedLocation.locationName}</h2>`;

    btnWrap.appendChild(backToNotesMain);
    btnWrap.appendChild(newNoteBtn);

    topNav.appendChild(btnWrap);
    topNav.appendChild(locationLabel);

    singleNotePage.appendChild(topNav);
    singleNotePage.appendChild(singleNotesList);
  }
  function buildSingleNotePage() {
    singleNotePage = document.createElement('div');
    singleNotePage.classList.add('locationSingleNotePage');
    singleNotePage.innerHTML = '';

    singleNotesList = document.createElement('div');
    singleNotesList.classList.add('locationNotesList');

    DOM.ACTIONCENTER.appendChild(singleNotePage);
  }
  function loadSingleNotePage(noteId) {
    getSingleNoteData(noteId, function () {
      DOM.clearActionCenter();
      buildSingleNotePage();
      populateSingleNotePage(noteId);
    });
  }

  // Main Page
  //---------------------------------------------
  function getLocationNotesData(callback) {
    locationNotesAjax.getLocationProgressNotes(selectedLocationId, function (results) {
      allNotesData = sortDataByDate(results);
      callback();
    });

    // locationNotesAjax.doesLocationHaveUnreadNotes(selectedLocationId, function(results) {
    //   // hasNote: "0"
    // });
  }
  function handleNewNoteBtnClick() {
    // build
    var notePopup = POPUP.build({});
    var noteTitleInput = buildTitleInput();
    var noteTextInput = buildTextInput();
    var sendNoteBtn = buildSendBtn();
    notePopup.appendChild(noteTitleInput);
    notePopup.appendChild(noteTextInput);
    notePopup.appendChild(sendNoteBtn);
    // show
    POPUP.show(notePopup);
    // events
    var noteTitle;
    var noteText;
    noteTitleInput.addEventListener('change', event => {
      noteTitle = event.target.value;
    });
    noteTextInput.addEventListener('change', event => {
      noteText = event.target.value;
    });
    sendNoteBtn.addEventListener('click', event => {
      locationNotesAjax.insertLocationNote(
        {
          token: $.session.Token,
          noteTitle: UTIL.removeUnsavableNoteText(noteTitle),
          note: UTIL.removeUnsavableNoteText(noteText),
          locationId: selectedLocationId,
        },
        results => {
          POPUP.hide(notePopup);
          loadAllNotesPage();
        },
      );
    });
  }
  function populateAllNotesPage() {
    allNotesData.forEach(note => {
      // data
      var noteId = note.noteID;
      var noteRead = note.is_read === '1' ? true : false;
      var noteDate = note.datecreated.split(' ')[0];
      var noteTime = formatTime(note.datecreated);
      var noteAuthor = note.MainAuthor;
      var noteTitle = note.title;
      var noteText = note.note;
      var empId = note.empId;
      // dom
      var image = buildNoteImage(empId);
      var name = buildNoteAuthorName(noteAuthor);
      var dateTime = buildNoteDateTime(noteDate, noteTime);
      var title = buildNoteTitle(noteTitle);
      var notePreview = buildNoteText(noteText);
      // details - img, name, date, time
      var details = buildNoteDetails(image, name, dateTime);
      // message - title & text
      var message = buildNoteMessageg(title, notePreview);

      var note = buildNote(details, message);
      if (!noteRead) {
        note.classList.add('unreadNote');
      } else {
        note.classList.remove('unreadNote');
      }

      note.addEventListener('click', function () {
        note.classList.remove('unreadNote');
        locationNotesAjax.updateLocationNoteDateRead(noteId, function (results) {
          loadSingleNotePage(noteId);
        });
      });

      allNotesList.appendChild(note);
    });

    var topNav = document.createElement('div');
    topNav.classList.add('locationNotesTopNav');

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    var backToRoster = button.build({
      text: 'Back To Roster',
      icon: 'arrowBack',
      type: 'text',
      style: 'secondary',
      classNames: 'backToRosterBtn',
      callback: function () {
        roster2.loadRosterInfo();
      },
    });
    var newNoteBtn = button.build({
      text: 'New Note',
      type: 'contained',
      style: 'secondary',
      classNames: 'newNoteBtn',
      callback: handleNewNoteBtnClick,
    });

    var locationLabel = document.createElement('div');
    locationLabel.classList.add('locationLabel');
    locationLabel.innerHTML = `<h2>${selectedLocation.locationName}</h2>`;

    btnWrap.appendChild(backToRoster);
    btnWrap.appendChild(newNoteBtn);

    topNav.appendChild(btnWrap);
    topNav.appendChild(locationLabel);

    allNotesPage.appendChild(topNav);
    allNotesPage.appendChild(allNotesList);
  }
  function buildAllNotesPage() {
    allNotesPage = document.createElement('div');
    allNotesPage.classList.add('locationAllNotesPage');
    allNotesPage.innerHTML = '';

    allNotesList = document.createElement('div');
    allNotesList.classList.add('locationNotesList');

    DOM.ACTIONCENTER.appendChild(allNotesPage);
  }
  function loadAllNotesPage() {
    selectedLocation = roster2.getSelectedLocationObj();
    selectedLocationId = selectedLocation.locationId;

    getLocationNotesData(function () {
      DOM.clearActionCenter();
      setActiveModuleSectionAttribute('roster-location-notes');
      buildAllNotesPage();
      populateAllNotesPage();
    });
  }

  return {
    loadAllNotesPage,
  };
})();
