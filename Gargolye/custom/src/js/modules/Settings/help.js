var help = (function() {

  function buildPage() {
    var helpPage = document.querySelector(".util-menu__help");
    helpPage.innerHTML = "";

    var backButton = button.build({
      text: "Back",
      icon: "arrowBack",
      type: "text",
      attributes: [{ key: "data-action", value: "back" }]
    });
    var linkButton = button.build({
        text: "DOCUMENTATION LIBRARY",
      icon: "openNew",
      type: "text",
      attributes: [{ key: "data-action", value: "trainingVideos" }]
    });

    helpPage.appendChild(backButton);
    helpPage.appendChild(linkButton);
  }
  return {
    buildPage
  };
})();
