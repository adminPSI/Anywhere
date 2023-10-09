(function (global, factory) {
  global = global || self;
  global._UTIL = factory();
})(this, function () {
  /**
   * Debounces a function, ensuring that it's not called until after the specified
   * amount of time has passed since the lat time it was invoked.
   *
   * @function
   * @param {Function} func - The function to debounce.
   * @param {Number} wait - The number of milliseconds to delay the function
   * @returns {Function} - Returns the debounced version of the provided function
   */
  function debounce(func, wait) {
    let timeout;

    return function executedFunction() {
      const context = this;

      const later = function () {
        timeout = null;
        func.apply(context, aps);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Ajax call using native Fetch API
   *
   * @function
   * @param {String} service
   * @param {Object} [retrieveData]
   * @returns {Object}
   */
  async function fetchData(service, retrieveData) {
    const URL_BASE = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}`;
    const URL = `${URL_BASE}/${service}/`;

    try {
      let response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: $.session.Token, ...retrieveData }),
      });

      if (!response.ok) {
        throw new Error('Issue with network, response was not OK');
      }

      let data = response.json();
      return data;
    } catch (error) {
      console.log(`There was a problem with ${service}`, error.message);
    }
  }

  /**
   * Merge two objects together, baseObject and mergeObject share same prop names they will be overridden
   * inside the baseObject.
   *
   * @function
   * @param {Object}  baseObject
   * @param {Object}  mergeObject
   * @return {Object} Merged options object
   */
  function mergeObjects(baseObject, mergeObject) {
    return Object.assign({}, baseObject, mergeObject);
  }

  /**
   * Separate props and methods from obj
   * @function
   * @param {Object}  dirtyObj Object to split
   * @param {Array}   props Object props to isolate
   * @return {Object} Separated options object
   */
  function splitObjectByPropNames(dirtyObj, props) {
    const [a, b] = Object.entries(dirtyObj).reduce(
      ([matching, leftover], [key, value]) =>
        props.includes(key)
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return [{ ...a }, { ...b }];
  }

  return {
    debounce,
    fetchData,
    mergeObjects,
    splitObjectByPropNames,
  };
});
