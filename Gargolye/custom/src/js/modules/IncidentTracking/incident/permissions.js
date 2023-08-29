// Used For Incident Review Page
const incidentPermissions = (function () {
  function incidentDetails(enteredBy) {
    const textareas = [...document.querySelectorAll('textarea')];

    textareas.forEach(textarea => {
      if ($.session.UserId.toLowerCase() !== enteredBy.toLowerCase()) {
        if (
          (textarea.classList.contains('summary') && $.session.updateIncidentSummaryText) ||
          (textarea.classList.contains('action') && $.session.updateIncidentActionText) ||
          (textarea.classList.contains('prevention') && $.session.updateIncidentPreventionText) ||
          (textarea.classList.contains('factors') && $.session.updateIncidentCauseText)
        ) {
          const nonEditableText = textarea.value;

          textarea.addEventListener('keyup', event => {
            const updatedText = event.target.value;

            // if noneditable text is not at the beginning or has been changed
            if (!updatedText.startsWith(nonEditableText)) {
              textarea.blur();
              // create and append popup
              const popupElement = POPUP.build({
                id: 'js-incidentSummaryWarning',
                closeCallback: () => {
                  const resetValue =
                    nonEditableText + updatedText.substr(nonEditableText.length + 1);
                  textarea.value = resetValue;
                },
              });
              const message = document.createElement('div');
              message.innerHTML = 'You are not allowed to edit previously entered text.';

              const okButton = button.build({
                text: 'Ok',
                style: 'secondary',
                type: 'contained',
                callback: function () {
                  POPUP.hide(popupElement);
                  const resetValue =
                    nonEditableText + updatedText.substr(nonEditableText.length + 1);
                  textarea.value = resetValue;
                },
              });

              popupElement.appendChild(message);
              popupElement.appendChild(okButton);

              POPUP.show(popupElement);
            }
          });
        }
      }
    });
  }

  function permissions(originallyEnteredByUserId) {
    // gather all inputs, textareas, and dropdowns
    var incidentTrackingCard = document.querySelector('.incidentSection[data-card-page="details"]');
    var inputs = [].slice.call(incidentTrackingCard.querySelectorAll('input'));
    var textareas = [].slice.call(incidentTrackingCard.querySelectorAll('textarea'));
    var dropdowns = [].slice.call(incidentTrackingCard.querySelectorAll('select'));
    var formElements = [].concat(inputs, textareas, dropdowns);
    if ($.session.incidentTrackingUpdate === false) {
      // disable everything
      formElements.forEach(element => {
        element.disabled = true;
      });
    } else {
      // undisable everything
      formElements.forEach(element => {
        element.disabled = false;
      });
      incidentDetails(originallyEnteredByUserId);
    }
  }

  return {
    incidentDetails,
    permissions,
  };
})();
