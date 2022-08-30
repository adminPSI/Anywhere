// Used For Incident Review Page
var incidentPermissions = (function() {

  function incidentDetails(enteredBy) {
    if ($.session.UserId.toLowerCase() !== enteredBy.toLowerCase()) {
      var textarea = document.querySelector('textarea.summary');
      var nonEditableText = textarea.value;
      var newlyEnteredText = ``;

      textarea.addEventListener('keyup', event => {
        var updatedText = event.target.value;
        var updatedContainsNonEditable = updatedText.indexOf(nonEditableText);
        // if noneditable text is not at the beginning or has been changed
        if (updatedContainsNonEditable !== 0) {
          textarea.blur();
          // create and append popup
          var popupElement = POPUP.build({
            id: 'js-incidentSummaryWarning',
            closeCallback: () => {
              //POPUP.hide(popupElement);
              newlyEnteredText = textarea.value.slice(nonEditableText.length, textarea.value.length);
              textarea.value = `${nonEditableText} ${newlyEnteredText}`;
              newlyEnteredText = '';
            }
          });
          var message = document.createElement('div');
          message.innerHTML = 'You are not allowed to edit previously entered text.';
          
          var okButton = button.build({
            text: 'Ok',
            style: 'secondary',
            type: 'contained',
            callback: function() {
              POPUP.hide(popupElement);
              newlyEnteredText = textarea.value.slice(nonEditableText.length, textarea.value.length);
              textarea.value = `${nonEditableText} ${newlyEnteredText}`;
              newlyEnteredText = '';
            }
          });

          popupElement.appendChild(message);
          popupElement.appendChild(okButton);

          POPUP.show(popupElement);
        }
      });
    }
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
    permissions
  }
}());
