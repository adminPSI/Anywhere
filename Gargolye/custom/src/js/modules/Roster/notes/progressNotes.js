var progressNotes = (function() {
	var section;
	var VIEW_ALL_NOTES_SECTION;
	var VIEW_SINGLE_NOTE_SECTION;
	var ADD_NOTE_SECTION;
	var ADD_MESSAGE_SECTION;
	var ADD_NOTE_BTN;
	var ADD_MESSAGE_BTN;
	//*add note
	var title;
	var message;
	//*add message
	var messageText;
	// Data & Values
	var selectedNoteId;
	var selectedLocationId;
	var selectedConsumerId;
	var newNoteTitle;
	var newNoteText;
	var newMessageText;
	var consumerNotes;
	var singleNoteData;
	var hasUnreadNote;

	// Workers
	function addNewNote() {
		var insertData = {
			token: $.session.Token,
			noteTitle: UTIL.removeUnsavableNoteText(newNoteTitle),
			note: UTIL.removeUnsavableNoteText(newNoteText),
			locationId: selectedLocationId,
			consumerId: selectedConsumerId,
			hideNote: "N",
		};

		progressNotesAjax.insertConsumerNote(insertData, function(results) {
			getConsumerNotes(populateViewNotesSection);
		});
	}
	function addNewMessage() {
		var insertData = {
			token: $.session.Token,
			note: UTIL.removeUnsavableNoteText(newMessageText),
			noteId: selectedNoteId,
			consumerId: selectedConsumerId,
		};

		progressNotesAjax.updateConsumerNote(insertData, function(results) {
			getSingleNoteData(selectedNoteId, populateViewSingleNoteSection);
		});
	}
	function getConsumerNotes(callback) {
		function cacheNotes(results) {
			consumerNotes = results;
			callback(results);
		}

		progressNotesAjax.selectNotesByConsumerAndLocation(selectedConsumerId, selectedLocationId, cacheNotes);
	}
	function getSingleNoteData(noteId, callback) {
		function cacheSingleNoteData(results) {
			singleNoteData = results;
			callback(results);
		}

		progressNotesAjax.selectConsumerNote(noteId, cacheSingleNoteData);
	}
	 function markNoteAsRead(noteid, consumerid,  noteElement) {

		progressNotesAjax.updateConsumerNoteDateRead(noteid);  

		var consumersWithUnreadNotes = roster2.getConsumersWithUnreadNotes();
		hasUnreadNote = consumersWithUnreadNotes[consumerid];
		var noteMenuItem = document.getElementById(noteid)
		if (!hasUnreadNote) {
			var menuItem = document.querySelector('.menuList .progressNote');
			menuItem.classList.remove('needsAttention');	
		}

		if (noteMenuItem) {
			noteMenuItem.classList.remove('unreadNote');
		}
		// noteElement.classList.remove('unreadNote');
		 
	}
	function shortenNotePreview(noteString) {
		var note = noteString.split(' ');
		var shortenedNote = note
			.filter((note, index) => {
				return index <= 40;
			})
			.join(' ');

		if (note.length >= 39) {
			shortenedNote += `<span class="ellipsis">...</span>`;
		}

		return shortenedNote;
	}
	function createConsumersWithUnreadNotesObj(results) {
		var newObj = {};

    if (!results) return newObj;
    
		results.forEach(r => {
			if ($.session.HideProgressNotes || (!$.session.HideProgressNotes && (r.hideNote === "" || r.hideNote === "N"))) {
				if (!newObj[r.c_id]) newObj[r.c_id] = r.c_id;
			}
		});

		return newObj;
	}
	function clearAllGlobalVariables() {
		selectedNoteId = undefined;
		selectedLocationId = undefined;
		selectedConsumerId = undefined;
		newNoteTitle = undefined;
		newNoteText = undefined;
		newMessageText = undefined;

		if (title) {
			var titleInput = title.querySelector('input');
			titleInput.value = '';
		}

		if (message) {
			var messageInput = message.querySelector('textarea');
			messageInput.value = '';
		}

		if (messageText) {
			var messageInput = messageText.querySelector('textarea');
			messageInput.value = '';
		}
    }

    function clearAllGlobalVariablesOnBack() {
        //selectedNoteId = undefined;
        //selectedLocationId = undefined;
        //selectedConsumerId = undefined;
        newNoteTitle = undefined;
        newNoteText = undefined;
        newMessageText = undefined;

        if (title) {
            var titleInput = title.querySelector('input');
            titleInput.value = '';
        }

        if (message) {
            var messageInput = message.querySelector('textarea');
            messageInput.value = '';
        }

        if (messageText) {
            var messageInput = messageText.querySelector('textarea');
            messageInput.value = '';
        }	

		// grabs all subsections of progress notes
		const viewAllNotesSection = document.querySelector('.viewAllNotesSection');
		const addNoteSection = document.querySelector('.addNoteSection');
		const viewSingleNoteSection = document.querySelector('.viewSingleNoteSection');
		const addMessageSection = document.querySelector('.addMessageSection');

		const sections = [viewAllNotesSection, addNoteSection, viewSingleNoteSection, addMessageSection];
    
		// Iterate over all sections and make them hidden so the next and back button works correctly
		sections.forEach(section => {
			if (section && section.classList.contains('visible')) {
				section.classList.remove('visible');
				section.classList.add('hidden');
			}
		});
    }

	// populate
	function populateViewSingleNoteSection(data, singleNoteList) {
		if (!singleNoteList) singleNoteList = section.querySelector('.singleNoteList');
		singleNoteList.innerHTML = '';

		data.forEach(d => {
			var employeeId = d.emp_id;
			
			var dateTimeArray = d.Date_Entered.split(' ');
			var timeArray = dateTimeArray[1].split(':');

		

			// var image = `<img class="pic" src="./images/portraits/${employeeId}.png" onerror="this.src='./images/new-icons/default.jpg'" />`;
			var name = `<p class="name">${d.firstname} ${d.lastname}</p>`;
			var dateTime = `
        <div class="dateTime">
          <p>${dateTimeArray[0]}</p>
          <p>${timeArray[0]}:${timeArray[1]} ${dateTimeArray[2]}</p>
        </div>
      `;
			var title = `<p class="title">${d.notetitle}</p>`;
			var notePreview = `<p>${d.note}</p>`;

			// details - img, name, date, time
			var details = document.createElement('div');
			details.classList.add('progressNote__details');
			// details.innerHTML = `${image}${name}${dateTime}`;
			details.innerHTML = `${name}${dateTime}`;

			// message
			var message = document.createElement('div');
			message.classList.add('progressNote__message');
			message.innerHTML = `
        ${title}${notePreview}
      `;

			var note = document.createElement('div');
			note.classList.add('progressNote');

			note.appendChild(details);
			note.appendChild(message);

			singleNoteList.appendChild(note);
		});
	}
	 function populateViewNotesSection(data, allNotesList) {
		if (!allNotesList) allNotesList = section.querySelector('.allNotesList');
		allNotesList.innerHTML = '';

		data.forEach(d => {
		  if ($.session.HideProgressNotes || (!$.session.HideProgressNotes && (d.hidenote === "" || d.hidenote === "N"))) {
			var hasBeenRead = d.is_read === '1' ? true : false;
			var noteId = d.noteID;
			var consumerid = d.consumer;
			var dateTimeArray = d.datecreated.split(' ');
			var timeArray = dateTimeArray[1].split(':');
			// var image = `<img class="pic" src="./images/portraits/${d.empId}.png" onerror="this.src='./images/new-icons/default.jpg'" />`;
			var name = `<p class="name">${d.MainAuthor}</p>`;
			var dateTime = `
        <div class="dateTime">
          <p>${dateTimeArray[0]}</p>
          <p>${timeArray[0]}:${timeArray[1]} ${dateTimeArray[2]}</p>
        </div>
	  `;
	  
			var title = `<p class="title">${d.title}</p>`;
			var notePreview = `<p>${shortenNotePreview(d.note)}</p>`;

			var hideNoteCheckbox;
			hideNoteCheckbox = input.buildCheckbox({
				text: 'Hide Note',
				style: "secondary",
				isChecked: (d.hidenote === "" || d.hidenote === "N") ? false : true,
			});

			// hide note checkbox for users with Hide Progress Note Permission
			var hidenotedetail = document.createElement('div');
			 hidenotedetail.classList.add('progressNote__hidenotecheckbox');
		
			// details - img, name, date, time
			var details = document.createElement('div');
			details.classList.add('progressNote__details');
			details.classList.add('accessReplies');
			// details.innerHTML = `${image}${name}${dateTime}`;
			details.innerHTML = `${name}${dateTime}`;

			// message
			var message = document.createElement('div');
			message.classList.add('progressNote__message');
			message.classList.add('accessReplies');
						
			message.innerHTML = `
        ${title}${notePreview}
      `;

			var note = document.createElement('div');
			note.setAttribute('data-info-task', 'viewSingleNote');
			note.classList.add('progressNote');
			note.setAttribute('id', noteId)

			if (!hasBeenRead) {
				note.classList.add('unreadNote');
			}

			// appending Hide Note CheckBox -- display if User has Hide Progress Note Permission
			if ($.session.HideProgressNotes) {
				hidenotedetail.appendChild(hideNoteCheckbox);
				note.appendChild(hidenotedetail)
			}

			// appending details and message sections
			note.appendChild(details);
			note.appendChild(message);

			DOM.ACTIONCENTER.appendChild(note);

			var clickableNoteAreas = document.querySelectorAll(".accessReplies");

	
			clickableNoteAreas.forEach(function(elem) {
				elem.addEventListener('click', () => {
					 selectedNoteId = noteId;
					markNoteAsRead(noteId, consumerid, event.target);
					getSingleNoteData(noteId, function(results) {
						populateViewSingleNoteSection(results);
						consumerInfo.showCardSubSection(VIEW_SINGLE_NOTE_SECTION);
					 roster2.refreshRosterList();
					});
				});
			});

			hidenotedetail.addEventListener('change', e => {
				var tmpHideNote = e.target.checked ? 'Y' : 'N';
				var insertData = {
					token: $.session.Token,
					hideNote: tmpHideNote,
					noteId: noteId,
					consumerId: selectedConsumerId,
				};
				progressNotesAjax.updateHideNote(insertData);

			  });

			allNotesList.appendChild(note);
		}
		}); // for loop

	}

	// build
	function buildAddMessageSection() {
		var addMessageSection = document.createElement('div');
		addMessageSection.classList.add('addMessageSection');

		messageText = input.build({
			type: 'textarea',
			label: 'Message',
			style: 'secondary',
			classNames: ['newMessageInput', 'autosize'],
		});
		var sendButton = button.build({
			text: 'Send',
			style: 'secondary',
			type: 'contained',
			icon: 'send',
			callback: function() {
				var messageInput = messageText.querySelector('textarea');
				messageInput.value = '';
				addNewMessage();
				consumerInfo.showCardSubSection(VIEW_SINGLE_NOTE_SECTION);
			},
		});
		var cancelButton = button.build({
			text: 'Cancel',
			style: 'secondary',
			type: 'outlined',
			//icon: 'close',
			callback: function() {
				consumerInfo.showCardSubSection(VIEW_SINGLE_NOTE_SECTION);
				clearAllGlobalVariablesOnBack();
			},
		});

		var btnWrap = document.createElement('div');
		btnWrap.classList.add('btnWrap');
		btnWrap.appendChild(sendButton);
		btnWrap.appendChild(cancelButton);

		addMessageSection.appendChild(messageText);
		addMessageSection.appendChild(btnWrap);

		messageText.addEventListener('input', event => {
			newMessageText = event.target.value;
        });
        
		ADD_MESSAGE_SECTION = addMessageSection;
		return addMessageSection;
	}
	function buildAddNoteSection() {
		var addNoteSection = document.createElement('div');
		addNoteSection.classList.add('addNoteSection');

		title = input.build({
			type: 'text',
			label: 'Title',
			style: 'secondary',
			classNames: 'newMessageInput',
		});
		message = input.build({
			type: 'textarea',
			label: 'Message',
			style: 'secondary',
			classNames: ['newMessageInput', 'autosize'],
		});
		var sendButton = button.build({
			text: 'Send',
			style: 'secondary',
			type: 'contained',
			icon: 'send',
			callback: function() {
				var titleInput = title.querySelector('input');
				var messageInput = message.querySelector('textarea');
				titleInput.value = '';
				messageInput.value = '';
				addNewNote();
				consumerInfo.showCardSubSection(VIEW_ALL_NOTES_SECTION);
			},
		});
		var cancelButton = button.build({
			text: 'Cancel',
			style: 'secondary',
			type: 'outlined',
			//icon: 'close',
			callback: function() {
				consumerInfo.showCardSubSection(VIEW_ALL_NOTES_SECTION);
				clearAllGlobalVariablesOnBack();
			},
		});

		title.addEventListener('input', event => {
			newNoteTitle = event.target.value;
		});
		message.addEventListener('input', event => {
			newNoteText = event.target.value;
        });

		var btnWrap = document.createElement('div');
		btnWrap.classList.add('btnWrap');
		btnWrap.appendChild(sendButton);
		btnWrap.appendChild(cancelButton);

		addNoteSection.appendChild(title);
		addNoteSection.appendChild(message);
		addNoteSection.appendChild(btnWrap);

		ADD_NOTE_SECTION = addNoteSection;
		return addNoteSection;
	}
	function buildViewSingleNoteSection() {
		var section = document.createElement('div');
		section.classList.add('viewSingleNoteSection');

		var addNoteBtn = button.build({
			text: 'New',
			icon: 'message',
			style: 'secondary',
			type: 'contained',
			classNames: 'addNoteBtn',
			callback: function() {
				consumerInfo.showCardSubSection(ADD_MESSAGE_SECTION);
			},
		});

		var singleNoteList = document.createElement('div');
		singleNoteList.classList.add('singleNoteList');

		section.appendChild(addNoteBtn);
		section.appendChild(singleNoteList);

		VIEW_SINGLE_NOTE_SECTION = section;
		return section;
	}
	function buildViewAllNotesSection(data) {
		var section = document.createElement('div');
		section.classList.add('viewAllNotesSection');

		var addNoteBtn = button.build({
			text: 'New',
			icon: 'message',
			style: 'secondary',
			type: 'contained',
			classNames: 'addNoteBtn',
			callback: function() {
				consumerInfo.showCardSubSection(ADD_NOTE_SECTION);
			},
		});

		var notesList = document.createElement('div');
		notesList.classList.add('allNotesList');
		populateViewNotesSection(data, notesList);

		section.appendChild(addNoteBtn);
		section.appendChild(notesList);

		VIEW_ALL_NOTES_SECTION = section;
		return section;
	}

	function init(targetSection, locationId, consumerId) {
		section = targetSection;
		selectedLocationId = locationId;
		selectedConsumerId = consumerId;
	}

	return {
		buildViewAllNotesSection,
		buildViewSingleNoteSection,
		buildAddNoteSection,
		buildAddMessageSection,
		createConsumersWithUnreadNotesObj,
        clearAllGlobalVariables,
        clearAllGlobalVariablesOnBack,
		getConsumerNotes,
		init,
	};
})();
