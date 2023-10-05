(function (global, factory) {
  global = global || self;
  global._UTIL = factory();
})(this, function () {
  /**
   * Ajax call using native Fetch API
   * @param {String} service
   * @param {Object} retrieveData
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
   * @param {Object}  baseObject
   * @param {Object}  mergeObject
   * @return {Object} Merged options object
   */
  const mergeObjects = (baseObject, mergeObject) => {
    return Object.assign({}, baseObject, mergeObject);
  };

  /**
   * Separate props and methods from obj
   * @param {Object}  options
   * @return {Object} Separated options object
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
    fetchData,
  };
});
