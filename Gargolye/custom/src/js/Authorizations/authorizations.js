const authorizations = (function () {
  function init() {
    setActiveModuleAttribute('plan');
    DOM.clearActionCenter();
  }

  return {
    init,
  };
})();
