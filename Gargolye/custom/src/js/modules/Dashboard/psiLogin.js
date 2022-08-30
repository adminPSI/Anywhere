const psiLogin = (function() {
  let userPopup
  
  function buildPopup(userElemet) {

    userPopup = POPUP.build({
      header: "Select a User",
      id: "psiUserSelectPopup"
    })
    userPopup.appendChild(userElemet)
    
    POPUP.show(userPopup)
}

  return {
    buildPopup
  }
})()