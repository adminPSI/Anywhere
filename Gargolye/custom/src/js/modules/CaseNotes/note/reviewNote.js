var reviewNote = (function () {
  // review data
  var billerId; // caseManager ??
  var caseNoteId;
  var consumerId;
  var contactCode;
  var confidential;
  var endTime;
  var locationCode;
  var needCode;
  var noteText;
  var serviceId;
  var serviceCode;
  var serviceLocationId;
  var serviceDate;
  var startTime;
  var vendorId;
  let attachmentArray;
  let isSSANote;

  // Save Note
  // ----------------------------------------
  function updateGroup(updateData, selectedConsumerIds) {
    if (selectedConsumerIds && selectedConsumerIds.length > 0) {
      pendingSave.show();
      var cIdOfNote = updateData.consumerId;
      var groupSavePromises = [];
      caseNoteId = updateData.noteId;
      // saveAdditionalGroupCaseNote Only gets ran when adding new consumers to a group note, and only gets ran for the new consumers, not existing consumers.
      selectedConsumerIds.forEach(cId => {
        updateData.noteId = caseNoteId;
        groupSavePromises.push(
          new Promise(function (fulfill, reject) {
            if (cId === cIdOfNote) {
              caseNotesAjax.saveSingleCaseNote(updateData, function (results) {
                caseNotesAjax.updateGroupNoteValues(
                  {
                    noteId: updateData.noteId,
                    groupNoteId: updateData.groupNoteId,
                    serviceOrBillingCodeId: updateData.serviceOrBillingCodeId,
                    serviceDate: updateData.serviceDate,
                    startTime: updateData.startTime,
                    endTime: updateData.endTime,
                  },
                  function (results) {
                    fulfill();
                  },
                );
              });
            } else {
              updateData.consumerId = cId;
              updateData.noteId = 0;
              caseNotesAjax.saveAdditionalGroupCaseNote(updateData, function (results) {
                //caseNotesAjax.saveSingleCaseNote(updateData, function (results) {
                caseNotesAjax.updateGroupNoteValues(
                  {
                    noteId: updateData.noteId,
                    groupNoteId: updateData.groupNoteId,
                    serviceOrBillingCodeId: updateData.serviceOrBillingCodeId,
                    serviceDate: updateData.serviceDate,
                    startTime: updateData.startTime,
                    endTime: updateData.endTime,
                  },
                  function (results) {
                    fulfill();
                  },
                );
                //});
              });
            }
          }),
        );
      });

      Promise.all(groupSavePromises).then(function (res) {
        pendingSave.fulfill();
        setTimeout(function () {
          successfulSave.hide();
          notesOverview.init();
        }, 1000);
      });
    } else {
      caseNotesAjax.saveSingleCaseNote(updateData, function (results) {
        caseNotesAjax.updateGroupNoteValues(
          {
            noteId: updateData.noteId,
            groupNoteId: updateData.groupNoteId,
            serviceOrBillingCodeId: updateData.serviceOrBillingCodeId,
            serviceDate: updateData.serviceDate,
            startTime: updateData.startTime,
            endTime: updateData.endTime,
          },
          function (results) {
            fulfill();
          },
        );
      });
    }
  }
  function updateSingle(updateData) {
    pendingSave.show();
    caseNotesAjax.saveSingleCaseNote(updateData, function (results) {
      pendingSave.fulfill();
      setTimeout(function () {
        successfulSave.hide();
        notesOverview.init();
      }, 1000);
    });
  }
  function updateNote(opts, attachments) {
    if ($.session.applicationName === 'Gatekeeper') {
      attachments.forEach(attachment => {
        caseNotesAjax.addCaseNoteAttachment(
          opts.updateData.noteId,
          attachment.description,
          attachment.type,
          attachment.arrayBuffer,
        );
      });
    }
    if (opts.isGroupNote) {
      caseNotesAjax.caseNoteOverlapCheck(opts.overlapData, function (overlapResults) {
        updateGroup(opts.updateData, opts.selectedConsumerIds);
      });
    } else {
      caseNotesAjax.caseNoteOverlapCheck(opts.overlapData, function (overlapResults) {
        updateSingle(opts.updateData);
      });
    }
  }

  function handleActionNavEvent(target) {
    var targetAction = target.dataset.actionNav;

    switch (targetAction) {
      case 'miniRosterDone': {
        DOM.scrollToTopOfPage();
        DOM.clearActionCenter();
        initPageLoad();

        note.moveConsumerToConsumerSection();
        note.enableCard();

        DOM.toggleNavLayout();

        break;
      }
      case 'miniRosterCancel': {
        DOM.toggleNavLayout();
        break;
      }
    }
  }

  function initPageLoad() {
    DOM.clearActionCenter();
    DOM.scrollToTopOfPage();

    if (!isSSANote) {
      roster2.miniRosterinit();
    }

    var container = document.createElement('div');
    container.classList.add('caseNotes');

    var noteCard;
    if ($.session.CaseNotesSSANotes && isSSANote) {
      noteCard = noteSSA.buildCaseNoteCard({
        caseNoteId,
        contactCode,
        endTime,
        locationCode,
        needCode,
        noteText,
        serviceId,
        serviceCode,
        serviceLocationId,
        startTime,
        serviceDate,
        vendorId,
      });
    } else {
      noteCard = note.buildCaseNoteCard();
    }

    var consumersList;
    $.session.CaseNotesSSANotes && isSSANote
      ? (consumersList = noteSSA.buildConsumersList())
      : (consumersList = note.buildConsumersList());

    //Batched Message
    var batchedMessage = document.createElement('h4');
    batchedMessage.setAttribute('id', 'batchedMessage');
    batchedMessage.innerHTML = 'Case Note is Batched';

    // credit Message
    var creditMessage = document.createElement('h4');
    creditMessage.setAttribute('id', 'creditMessage');
    creditMessage.innerHTML = 'This is a credit note';


    container.appendChild(consumersList);
    container.appendChild(noteCard);

    $.session.CaseNotesSSANotes && isSSANote
      ? noteSSA.checkConfidential()
      : note.checkConfidential(); //Check confidential before notecard is appended

    DOM.ACTIONCENTER.insertBefore(container, DOM.ACTIONCENTER.childNodes[0]);

    //Checking if batched
    $.session.CaseNotesSSANotes && isSSANote
      ? (cnBatched = noteSSA.checkIfBatched())
      : (cnBatched = note.checkIfBatched());

      //Checking if credit note
    $.session.CaseNotesSSANotes && isSSANote
    ? (cnCredit = noteSSA.checkIfCredit())
    : (cnCredit = note.checkIfCredit());

    if ($.session.CaseNotesSSANotes && isSSANote) {
      if (cnBatched) DOM.ACTIONCENTER.insertBefore(batchedMessage, container);
      if (cnCredit) DOM.ACTIONCENTER.insertBefore(creditMessage, container);
      noteSSA.checkRequiredFields();
      // if ($.session.applicationName === "Gatekeeper") noteSSA.checkGKRequiredFields();
    } else {
      if (cnBatched) DOM.ACTIONCENTER.insertBefore(batchedMessage, container);
      if (cnCredit) DOM.ACTIONCENTER.insertBefore(creditMessage, container);
      note.checkRequiredFields();
      if ($.session.applicationName === 'Gatekeeper') note.checkGKRequiredFields();
    }

    $.session.CaseNotesSSANotes && isSSANote ? noteSSA.setPermissions() : note.setPermissions();
  }

  function init(IsSSANote) {
    isSSANote = IsSSANote;
    setActiveModuleSectionAttribute('caseNotes-review');
    roster2.setAllowedConsumers(['%']);
    initPageLoad();
  }

  return {
    handleActionNavEvent,
    updateNote,
    init,
  };
})();
