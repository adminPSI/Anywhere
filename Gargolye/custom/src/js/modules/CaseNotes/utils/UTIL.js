(function (global, factory) {
  global = global || self;
  global._UTIL = factory();
})(this, function () {
  /**
   * Merge two objects together, baseObject and mergeObject share same prop names they will be overridden
   * inside the baseObject.
   * @param {Object}  baseObject
   * @param {Object}  mergeObject
   * @return {Object}              Merged options object
   */
  const mergeObjects = (baseObject, mergeObject) => {
    return Object.assign({}, baseObject, mergeObject);
  };

  /**
   * Separate props and methods from obj
   * @param {Object}  options
   * @return {Object}          Separated options object
   */
  const splitObjectByPropNames = (options, props) => {
    const [a, b] = Object.entries(options).reduce(
      ([matching, leftover], [key, value]) =>
        props.includes(key)
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return [{ ...a }, { ...b }];
  };

  return {
    mergeObjects,
    splitObjectByPropNames,
  };
});
