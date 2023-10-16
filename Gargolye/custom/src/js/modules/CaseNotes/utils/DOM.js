(function (global, factory) {
  global._DOM = factory();
})(this, function () {
  /**
   * Create DOM element node and set given attributes, html/text, or nodes to append
   *
   * Examples:
   *
   * {css: 'classname'} - can be string value or an array of srings
   * {text: 'string of text' || 123456}
   * {html: '<p>innerHTML</p>'}
   * {node: elementNode} - can be a single node or an array of nodes
   * {[attribute]: nativeAttribute} - native HTML attributes
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
            if (Array.isArray(attributes[attributeName])) {
              attributes[attributeName].forEach(att => {
                element.appendChild(att);
              });
            } else {
              element.appendChild(attributes[attributeName]);
            }
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

  /**
   * Separates valid HTML attributes from options obj
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attributes
   *
   * @function
   * @param {Object}  options - Options object
   * @return {Object} - Separated options object
   */
  function separateHTMLAttribrutes(options) {
    const props = [
      'accept',
      'alt',
      'autocomplete',
      'checked',
      'disabled',
      'form',
      'id',
      'list',
      'max',
      'maxlength',
      'min',
      'minlength',
      'multiple',
      'name',
      'pattern',
      'placeholder',
      'readonly',
      'required',
      'size',
      'src',
      'type',
      'value',
    ];

    const [a, b] = Object.entries(options).reduce(
      ([matching, leftover], [key, value]) =>
        props.includes(key)
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return { ...b, attributes: { ...a } };
  }

  return {
    createElement,
    isReferenceFree,
    separateHTMLAttribrutes,
  };
});
