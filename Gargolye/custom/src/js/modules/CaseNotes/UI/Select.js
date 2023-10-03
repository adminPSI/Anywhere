'use-strict';

(function (global, factory) {
  global = global || self;
  global.SELECT = factory();
})(this, function () {
  /**
   * Default configuration
   * @typ {Object}
   */
  const DEFAULT_OPTIONS = {};
  /**
   * Merge default options with user options
   * @param {Object}  userOptions  User defined options object
   * @return {Object}              Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  /**
   * Separate HTML attributes from options obj
   * @param {Object}  options  Options object
   * @return {Object}          Separated options object
   */
  const separateHTMLAttribrutes = options => {
    const props = ['label', 'note', 'showcount'];

    const [a, b] = Object.entries(options).reduce(
      ([matching, leftover], [key, value]) =>
        props.includes(key)
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return { ...a, attributes: { ...b } };
  };

  //=========================
  // MAIN LIB
  //-------------------------

  /**
   * @class SELECT
   * @param {Object} options
   */
  function SELECT(options) {
    this.options = separateHTMLAttribrutes(mergOptionsWithDefaults(options));
  }

  SELECT.prototype.build = function () {
    return this;
  };

  return SELECT;
});
