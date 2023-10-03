(function (global, factory) {
  global = global || self;
  global._DOM = factory();
})(this, function () {
  /**
   * Create DOM element node
   * @param  {String}  tag         HTML element name
   * @param  {Object}  attributes  Attributes to be applied to element
   * @returns {HTMLElement}
   */
  const createElement = (tag, attributes) => {
    const element = document.createElement(tag);
    if (attributes && typeof attributes === 'object') {
      let attributeName;
      for (attributeName in attributes) {
        if (!attributes[attributeName]) continue;
        if (attributeName === 'html') {
          element.innerHTML = attributes[attributeName];
        } else if (attributeName === 'text') {
          element.innerText = attributes[attributeName];
        } else if (attributeName === 'node') {
          element.appendChild(attributes[attributeName]);
        } else {
          element.setAttribute(attributeName, attributes[attributeName]);
        }
      }
    }
    return element;
  };
  /**
   * Test if node is reference-free
   * @param {HTMLElement}  node  HTML element
   * @returns {Boolean}
   */
  const isReferenceFree = node => {
    return (document.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) === 0;
  };
  return {
    createElement,
    isReferenceFree,
  };
});
