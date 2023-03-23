const oneSpan = (() => {
    let oneSpanDocumentStatus;
    let oneSpanDocumentData;

    async function checkOneSpanData(planId) {
        oneSpanDocumentStatus = await oneSpanAjax.oneSpanCheckDocumentStatus({
          token: $.session.Token,
          assessmentId: planId
        });
      
        if (oneSpanDocumentStatus[0].signedStatus !== "") {
          const oneSpanRetrieveData = {
            token: $.session.Token,
            packageId: oneSpanDocumentStatus[0].packageId,
            assessmentID: planId
          }
        
          await oneSpanAjax.oneSpanGetSignedDocuments(oneSpanRetrieveData);
        }
      }

      function fireDataUpdateEvent(planId) {
        // custom event for event listener used on button to run disabled check
        const dataUpdateEvent = new CustomEvent("data-update", {
            detail: {
                data: planId
            }
        })

        document.dispatchEvent(dataUpdateEvent)
      }

      async function shouldBeDisabled(btn, planId) {
        // gathers the new list of team members and their signature types
        const updatedMemberData = await consentAndSignAjax.getConsentAndSignData({
            token: $.session.Token,
            assessmentId: planId,
          });

        // disables the btn if there are no team members
        if (updatedMemberData.length === 0) {
            btn.classList.add('disabled');
        }
          
          // if there is a digital signature type for any team member the button is no logner disabled
          for (let i = 0; i < updatedMemberData.length; i++) {
            if (updatedMemberData[i].signatureType.includes('1')) {
              btn.classList.remove('disabled');
              break;
            } else {
              btn.classList.add('disabled');
            }
          }
      }

      function buildPopupMessage() {
        const message = document.createElement('p');
        message.classList.add('message');
        message.innerText =
          'Are you sure you want to send the Document via One Span?';
        return message;
      }

      async function sendToOneSpanProgress() {
        oneSpanPopup.style.display = 'none';
        pendingSave.show('Sending...');

        const sentStatus = await oneSpanAjax.oneSpanBuildSigners(oneSpanDocumentData);

        if (sentStatus === 'success') {
          success = true;
        } else {
          success = false;
        }

        const pendingSavePopup = document.querySelector('.pendingSavePopup');
        pendingSavePopup.style.display = 'none';

        if (success) {
          pendingSave.fulfill('Sent!');
          setTimeout(() => {
            const savePopup = document.querySelector('.successfulSavePopup');
            DOM.ACTIONCENTER.removeChild(savePopup);
            POPUP.hide(oneSpanPopup);
          }, 700);
        } else {
          pendingSave.reject('Failed to send, please try again.');
          console.error(res);
          setTimeout(() => {
            const failPopup = document.querySelector('.failSavePopup');
            DOM.ACTIONCENTER.removeChild(failPopup);
            oneSpanPopup.style.removeProperty('display');
          }, 2000);
        }
      }

      function showOneSpanPopup() {    
        oneSpanPopup = POPUP.build({
          id: 'sendToOneSpanPopup',
          header: 'Send To One Span'
        });
    
        const message = buildPopupMessage();

        //* ACTION BUTTONS
        //*----------------------------------
        const btnWrap = document.createElement('div');
        btnWrap.classList.add('btnWrap');
        const continueBtn = button.build({
          text: 'Continue',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            // Shows spinner while the document is being sent via One Span
            sendToOneSpanProgress();
          },
        });
        const cancelBtn = button.build({
          text: 'Cancel',
          style: 'secondary',
          type: 'contained',
          callback: () => {
            POPUP.hide(oneSpanPopup);
          },
        });
    
        btnWrap.appendChild(continueBtn);
        btnWrap.appendChild(cancelBtn);
        oneSpanPopup.appendChild(message);
        oneSpanPopup.appendChild(btnWrap);
    
        POPUP.show(oneSpanPopup);
      }

      function buildSendDocumentToOneSpanBtn(planId, teamMemberData) {
            const sendDocumentToOneSpanBtn =
            button.build({
                id: 'sig_addMember',
                text: 'REQUEST E-SIGNATURES',
                style: 'secondary',
                type: 'contained',
                callback: async () => {
                  oneSpanDocumentData = {
                    token: $.session.Token,
                    assessmentID: planId,
                    userID: $.session.PeopleId,
                    versionID: 1,
                    extraSpace: "false",
                    isp: true
                  },

                  showOneSpanPopup(oneSpanDocumentData)
                  }
                });

                sendDocumentToOneSpanBtn.classList.add('disabled');

                return sendDocumentToOneSpanBtn;
      }  
  
    return {
        checkOneSpanData,
        buildSendDocumentToOneSpanBtn,
        shouldBeDisabled,
        fireDataUpdateEvent
      };
    })();