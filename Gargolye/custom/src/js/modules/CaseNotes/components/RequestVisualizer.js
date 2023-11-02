(function (global, factory) {
  global.AsyncRequestVisualizer = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  function AsyncRequestVisualizer() {
    this.dialog = null;
  }

  AsyncRequestVisualizer.prototype.build = function () {
    this.dialog = new Dialog();

    this.spinner = new LoadingAnimation();
  };

  return AsyncRequestVisualizer;
});
