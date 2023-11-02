(function (global, factory) {
  global.LoadingAnimation = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  function LoadingAnimation() {
    this.spinnerWrap = null;
    this.spinner = null;
  }

  LoadingAnimation.prototype.build = function () {
    this.spinnerWrap = _DOM.createElement('div', { class: 'loadingAnimation' });
    this.spinner = _DOM.createElement('div', { class: 'loadingAnimation__spinner' });

    this.spinnerWrap.appendChild(this.spinner);
  };

  return LoadingAnimation;
});
