var linksAndMessages = (function() {
  var linksWidget;
  var messagesWidget;
  var links = [];
  var messages = [];

  
  function loadCustomLinks() {
    var linksList = linksWidget.querySelector('.customLinksList');
    linksList.innerHTML = '';
    if (links.length < 1) return;
    links.forEach(l => {
      var link = document.createElement('a');
      link.href = l.linkaddress;
      link.innerHTML = l.linkname;
      link.setAttribute('target', l.linktarget);
      linksList.appendChild(link);
      if (l.linkname.indexOf('CaraSolva') !== -1) {
        link.addEventListener('click', linksAndMessagesWidgetAjax.loadCaraSolva);
      }
    });
  }

  function loadSystemMessages() {
    var messageList = messagesWidget.querySelector('.messagesList');
    messageList.innerHTML = '';
    if (messages.length < 1) return;
    messages.forEach(m => {
      var message = document.createElement('p');
      message.innerHTML = m.description;
      messageList.appendChild(message);
    });
  }

  function separateLinksAndMessages(results) {
    results.forEach(r => {
      if (r.description === '') {
        links.push(r);
      } else {
        messages.push(r);
      }
    });
  }

  function init() {
    messagesWidget = document.getElementById('dashsystemmessagewidget');
    linksWidget = document.getElementById('dashcustomlinks');

    if (links.length > 0 || messages.length > 0) {
      loadSystemMessages();
      loadCustomLinks();
      return;
    }

    linksAndMessagesWidgetAjax.getSystemMessagesAndCustomLinks(function(results, error) {
      if (error) {
        var messageError = messagesWidget.querySelector('.widget__error');
        var linkError = linksWidget.querySelector('.widget__error');
        messageError.classList.add('visible');
        linkError.classList.add('visible');
        return;
      }
      separateLinksAndMessages(results);
      loadSystemMessages();
      loadCustomLinks();
    });
  }

  return {
    init
  }
  
}());