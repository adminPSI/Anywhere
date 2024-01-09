var newNoteSSA = (function () {
  let selectedConsumers;
  let activeConsumers;
  // Action Nav Event Handler
  // ----------------------------------------
  function handleActionNavEvent(target) {
    var targetAction = target.dataset.actionNav;
    var consumerList = document.querySelector('[data-roster="enabled"]');
    var consumerListBtn = document.querySelector('.consumerListBtn');

    switch (targetAction) {
      case 'miniRosterDone': {
        activeConsumers = roster2.getActiveConsumers();

        if (activeConsumers.length === 1) {
          DOM.scrollToTopOfPage();
          DOM.clearActionCenter();
          initPageLoad(activeConsumers[0].id);
          var isGroup = false;
          noteSSA.moveConsumerToConsumerSection(activeConsumers, isGroup);
          noteSSA.enableCard();
          DOM.toggleNavLayout();
        } else {
          // if user selects a consumer without deleting the previously selected consumer

          // 1. get currently selected consumer
          var selectedConsumerId = activeConsumers[activeConsumers.length - 1].id;
          var consumerName = activeConsumers[activeConsumers.length - 1].card.innerText.replace(
            /\s/g,
            '',
          );
          var consumerNameArr = consumerName.split(',');
          var consumerFN = consumerNameArr[1];
          var consumerLN = consumerNameArr[0];

          // 2. create consumer object (with currently selected consumer)
          var consumerobj = null;
          consumerobj = roster2.buildConsumerCard({
            FN: consumerFN,
            LN: consumerLN,
            id: selectedConsumerId,
          });

          // 3. remove all consumers from the activeConsumers list
          if (activeConsumers.length > 0) {
            activeConsumers.forEach(consumer => {
              roster2.removeConsumerFromActiveConsumers(consumer.id);
            });
          }

          // 4. add the currently selected consumer to the list
          roster2.addConsumerToActiveConsumers(consumerobj);
          activeConsumers = roster2.getActiveConsumers();

          // 5. Display currently selected consumer
          DOM.scrollToTopOfPage();
          DOM.clearActionCenter(); //
          // roster2.selectedConsumersToActiveList();
          initPageLoad(activeConsumers[0].id);
          var isGroup = false;
          noteSSA.moveConsumerToConsumerSection(activeConsumers, isGroup);
          noteSSA.enableCard();
          DOM.toggleNavLayout();
        }
        break;
      }
      case 'miniRosterCancel': {
        // consumerListBtn.classList.add('hidden');
        DOM.toggleNavLayout();
        loadApp('casenotes');
        break;
      }
    }
  }
  //Save Attachments
  function saveAttachments(caseNoteId, attachments, saveAndNew) {
    const saveAttachmentPromArray = [];
    attachments.forEach(attachment => {
      const promise = new Promise((resolve, reject) => {
        caseNotesAjax.addCaseNoteAttachment(
          caseNoteId,
          attachment.description,
          attachment.type,
          attachment.arrayBuffer,
          res => {
            resolve('saved');
          },
        );
      });
      saveAttachmentPromArray.push(promise);
    });
    Promise.all(saveAttachmentPromArray).then(() => {
      pendingSave.fulfill();
      setTimeout(function () {
        successfulSave.hide();
        if (saveAndNew) {
          noteSSA.init('new');
        } else {
          notesOverview.init();
        }
      }, 1000);
    });
  }

  // Save Note
  // ----------------------------------------
  function saveGroup(saveData, overlapData, selectedConsumerIds) {
    var groupSavePromises = [];
    selectedConsumerIds.forEach(cId => {
      groupSavePromises.push(
        new Promise(function (fulfill, reject) {
          overlapData.consumerId = cId;

          caseNotesAjax.caseNoteOverlapCheck(overlapData, function handleOverlapCheck(results) {
            if (results.length > 0) {
              //If the warning popup is already being displayed, skip and just save the record.
              //This prevents a popup from being created for each consumer being saved.
              if (document.getElementById('warningPopup')) {
                saveData.consumerGroupCount = selectedConsumerIds.length;
                saveData.consumerId = cId;
                caseNotesAjax.saveGroupCaseNote(saveData, function (results) {
                  fulfill();
                });
                return;
              }
              var uniqueConsumers = [];
              results.forEach(r => {
                if (!uniqueConsumers.includes(r.consumername)) uniqueConsumers.push(r.consumername);
              });
              var warningText = `Time Overlap(s): ${uniqueConsumers.join(', ')}`;
              warningPopup(warningText, function () {
                saveData.consumerGroupCount = selectedConsumerIds.length;
                saveData.consumerId = cId;
                caseNotesAjax.saveGroupCaseNote(saveData, function (results) {
                  fulfill();
                });
              });
            } else {
              saveData.consumerGroupCount = selectedConsumerIds.length;
              saveData.consumerId = cId;
              caseNotesAjax.saveGroupCaseNote(saveData, function (results) {
                fulfill();
              });
            }
          });
        }),
      );
    });

    Promise.all(groupSavePromises)
      .then(function (res) {
        successfulSave.show();
        setTimeout(function () {
          successfulSave.hide();
          if (saveAndNew) {
            noteSSA.init('new');
          } else {
            notesOverview.init();
          }
        }, 1000);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  function saveSingle(saveData, attachments, saveAndNew) {
    pendingSave.show();
    const parser = new DOMParser();
    caseNotesAjax.saveSingleCaseNote(saveData, function (results) {
      //SKIP ATTACHMENTS FOR ADVISOR
      if ($.session.applicationName === 'Advisor') {
        pendingSave.fulfill();
        setTimeout(function () {
          successfulSave.hide();
          if (saveAndNew) {
            noteSSA.init('new');
          } else {
            notesOverview.init();
          }
        }, 1000);
      } else {
        if (results !== null) {
          const saveResponseDoc = parser.parseFromString(results, 'text/xml');
          const caseNoteId = saveResponseDoc.getElementsByTagName('caseNoteId')[0].childNodes[0]
            .nodeValue;
          saveAttachments(caseNoteId, attachments, saveAndNew);
        } else {
          pendingSave.fulfill();
          setTimeout(function () {
            successfulSave.hide();
            if (saveAndNew) {
              noteSSA.init('new');
            } else {
              notesOverview.init();
            }
          }, 1000);
        }
      }
    });
  }
  function saveNote(opts, attachments) {
    var isGroup = opts.selectedConsumerIds.length > 1 ? true : false;

    if (isGroup) {
      caseNotesAjax.getGroupNoteId(function handleGettingGroupNoteId(results) {
        opts.saveData.groupNoteId = results[0].groupNoteId;
        saveGroup(opts.saveData, opts.overlapData, opts.selectedConsumerIds, opts.saveAndNew);
      });
    } else {
      opts.selectedConsumerIds.forEach(id => {
        opts.overlapData.consumerId = id;
        caseNotesAjax.caseNoteOverlapCheck(opts.overlapData, function handleOverlapCheck(results) {
          if (results.length > 0) {
            var uniqueConsumers = [];
            results.forEach(r => {
              if (!uniqueConsumers.includes(r.consumername)) uniqueConsumers.push(r.consumername);
            });
            var warningText = `Time Overlap(s): ${uniqueConsumers.join(', ')}`;
            warningPopup(warningText, function () {
              opts.saveData.consumerId = id;
              saveSingle(opts.saveData, attachments, opts.saveAndNew);
            });
          } else {
            opts.saveData.consumerId = id;
            saveSingle(opts.saveData, attachments, opts.saveAndNew);
          }
        });
      });
    }
  }

  function warningPopup(text, warningBtnFunction) {
    var popup = POPUP.build({
      id: 'warningPopup',
      classNames: 'warning',
    });
    var continueBtn = button.build({
      text: 'continue',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        warningBtnFunction();
        POPUP.hide(popup);
      },
    });
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(continueBtn);

    var warningMessage = document.createElement('p');
    warningMessage.innerHTML = text;
    popup.appendChild(warningMessage);
    popup.appendChild(btnWrap);
    POPUP.show(popup);
  }
  function checkMicError() {
    const NUSAI_popup = document.querySelector('.NUSAI_popupMessageContainer.error');
    if (NUSAI_popup) {
      const parent = NUSAI_popup.parentElement;
      parent.removeChild(NUSAI_popup);
      document.getElementById('NUSAI_CommandBar_Container').remove();
    }
  }

  // ----------------------------------------
  function initPageLoad(selectedConsumerId) {
    DOM.clearActionCenter();
    DOM.scrollToTopOfPage();
    if (!document.querySelector('.consumerListBtn')) roster2.miniRosterinit(); // Only build miniroster if it doesn't exits yet

    var noConsumerMessage = document.createElement('h3');
    noConsumerMessage.setAttribute('id', 'noConsumerMessage');
    noConsumerMessage.innerHTML = `Please select a consumer to get started.`;

    var container = document.createElement('div');
    container.classList.add('caseNotes');

    var noteCard = noteSSA.buildCaseNoteCard(selectedConsumerId);
    var consumersList = noteSSA.buildConsumersList();

    container.appendChild(noConsumerMessage);
    container.appendChild(consumersList);
    container.appendChild(noteCard);
    DOM.ACTIONCENTER.insertBefore(container, DOM.ACTIONCENTER.childNodes[0]);

    noteSSA.disableCard(); // disabled until consumers are moved

    noteSSA.checkRequiredFields();
    // if ($.session.applicationName === "Gatekeeper") noteSSA.checkGKRequiredFields();
    noteSSA.setPermissions();
    window.setTimeout(checkMicError, 3000);
  }

  function init() {
    setActiveModuleSectionAttribute('caseNotesSSA-new');
    roster2.setAllowedConsumers(['%']);
    roster2.showMiniRoster();
  }

  return {
    handleActionNavEvent,
    saveNote,
    checkMicError,
    init,
  };
})();
