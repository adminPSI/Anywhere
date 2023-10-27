(function (global, factory) {
  global._DOM = factory();
})(this, function () {
  const ACTIONCENTER = document.getElementById('actioncenter');

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
   * Asynchronously fetches attachment details based on the given event object.
   *
   * @async
   * @param {Event} event - The Event object, commonly from an input element of type 'file'.
   * @returns {Promise<Object>} Returns a Promise that resolves to an object containing attachment details.
   * @returns {Object} .attachmentObj - An object containing the description and type of the attachment, as well as its ArrayBuffer.
   * @returns {string} .attachmentObj.description - The name of the attachment file.
   * @returns {string} .attachmentObj.type - The file extension of the attachment.
   * @returns {ArrayBuffer} .attachmentObj.arrayBuffer - The ArrayBuffer of the attachment file.
   * @throws {Error} Throws an error if unable to fetch attachment details.
   */
  async function getAttachmentDetails(event) {
    const attachmentObj = {};
    const attachmentFile = event.target.files.item(0);
    const attachmentName = attachmentFile.name;
    const attachmentType = attachmentFile.name.split('.').pop();

    attachmentObj.description = attachmentName;
    attachmentObj.type = attachmentType;

    const response = new Response(attachmentFile);
    const arrayBuffer = await response.arrayBuffer();

    // convert arrayBuffer to a base64 encoded string
    const bytes = new Uint8Array(arrayBuffer);
    const binary = Array.from(bytes).reduce((acc, byte) => {
      return acc + String.fromCharCode(byte);
    }, '');
    const abString = window.btoa(binary);

    attachmentObj.arrayBuffer = abString;

    return attachmentObj;
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
        props.includes(key) || key.startsWith('data-')
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return { ...b, attributes: { ...a } };
  }

  function setActiveModuleAttribute(appName) {
    ACTIONCENTER.setAttribute('data-active-module', appName);
  }

  function setActiveModuleSectionAttribute(sectionName) {
    ACTIONCENTER.setAttribute('data-active-section', sectionName);
  }

  /**
   * Checks if a given string contains HTML tags.
   *
   * @param {String} str - The string to be checked for HTML tags.
   * @returns {Boolean} - True if the string contains HTML tags, false otherwise.
   *
   * @example
   * console.log(containsHTML("Hello, World!"));  // Output: false
   * console.log(containsHTML("<b>Hello, World!</b>"));  // Output: true
   */
  function stringContainsHTML(str) {
    const regExp = /<[^>]*>/g;
    return regExp.test(str);
  }

  return {
    // DOM ref
    ACTIONCENTER,
    setActiveModuleAttribute,
    setActiveModuleSectionAttribute,
    // methods
    createElement,
    getAttachmentDetails,
    isReferenceFree,
    separateHTMLAttribrutes,
    stringContainsHTML,
  };
});
