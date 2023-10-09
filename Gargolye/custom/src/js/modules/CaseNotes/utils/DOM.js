(function (global, factory) {
  global = global || self;
  global._DOM = factory();
})(this, function () {
  /**
   * Create DOM element node and set given attributes, html/text, or nodes to append
   *
   * @function
   * @param  {String}  tag - HTML element name
   * @param  {Object}  attributes - Attributes to be applied to element
   * @returns {HTMLElement} - Returns created HTML element
   */
  function createElement(tag, attributes) {
    const element = document.createElement(tag);
    if (attributes && typeof attributes === 'object') {
      let attributeName;
      for (attributeName in attributes) {
        if (!attributes[attributeName]) continue;
        switch (attributeName) {
          case 'html':
            element.innerHTML = attributes[attributeName];
            break;
          case 'text':
            element.innerText = attributes[attributeName];
            break;
          case 'node':
            element.appendChild(attributes[attributeName]);
            break;
          case 'class':
            if (Array.isArray(attributes[attributeName])) {
              attributes[attributeName].forEach(att => {
                element.classList.add(att);
              });
            } else {
              element.classList.add(attributes[attributeName]);
            }
            break;
          default:
            if (typeof attributes[attributeName] === 'boolean') {
              element.setAttribute(attributeName, '');
            } else {
              element.setAttribute(attributeName, attributes[attributeName]);
            }
        }
      }
    }
    return element;
  }

  /**
   * Test if node is reference-free
   *
   * @function
   * @param {HTMLElement}  node - HTML element
   * @returns {Boolean} - Returns whether node is reference free or not
   */
  function isReferenceFree(node) {
    return (document.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) === 0;
  }

  return {
    createElement,
    isReferenceFree,
  };
});
