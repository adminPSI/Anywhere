(function (global, factory) {
  global.Attachments = factory();
})(this, function () {
  /**
   * @constructor
   * @param {Object} options
   * @param {String} options.id Id for input, use to link it with label. Also used for name attribute.
   * @param {String} options.type HTML Input type
   * @param {String} options.label Text for label input
   * @param {Boolean} [options.hidden] Whether to show or hide the input
   */
  function File(options) {
    // Data Init
    this.options = _DOM.separateHTMLAttribrutes(options);

    // DOM Ref
    this.rootElement = null;
    this.input = null;
    this.labelEle = null;

    this._build();
  }

  /**
   * @function
   */
  File.prototype._build = function () {
    // INPUT WRAP
    const classArray = ['inputGroup', 'file', `${this.options.attributes.id}`];
    const inputGroup = _DOM.createElement('div', {
      class: this.options.hidden ? [...classArray, 'inputGroup--hidden'] : classArray,
    });

    // INPUT & LABEL
    this.input = _DOM.createElement('input', { ...this.options.attributes });
    this.labelEle = _DOM.createElement('label', {
      text: this.options.label,
      for: this.options.attributes.id,
    });

    inputGroup.append(this.labelEle, this.input);

    this.rootElement = inputGroup;
  };

  /**
   * Renders the built File Input element to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render the input to
   * @returns {Input} Returns the current instances for chaining
   */
  File.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * @constructor
   */
  function Attachments(options) {
    // Data Init
    this.options = options;
    this.options.type = 'file';
    this.inputs = {};

    // DOM Ref
    this.rootElement = null;

    this._build();
    this._setupEvents();
  }

  /**
   * @function
   */
  Attachments.prototype._build = function () {
    this.rootElement = _DOM.createElement('div', { class: 'attachments' });

    const input = new File({ ...this.options });

    input.renderTo(this.rootElement);

    this.inputs[this.options.id] = input;
  };

  /**
   *
   *
   * @function
   */
  Attachments.prototype._setupEvents = function (cbFunc) {
    this.rootElement.addEventListener('change', e => {
      const targetID = e.target.id;

      // check file type
      const forbiddenTypes = new RegExp('(audio/)|(video/)');
      const isFileTypeValid = _UTIL.validateFileType(e, forbiddenTypes);
      if (!isFileTypeValid) return;

      // NEW INPUT
      const newInputId = _UTIL.autoIncrementId(targetID);
      const newInputInstance = new File({
        type: 'file',
        label: 'Add Attachment',
        id: newInputId,
      });
      this.inputs[newInputId] = newInputInstance;
      this.inputs[targetID].rootElement.insertAdjacentElement('beforebegin', newInputInstance.rootElement);

      // update target attachment
      this.inputs[targetID].rootElement.classList.add('hasFile');
      this.inputs[targetID].labelEle.innerText = _UTIL.truncateFilename(e.target.files[0].name);
      const deleteIcon = Icon.getIcon('delete');
      this.inputs[targetID].labelEle.insertBefore(deleteIcon, this.inputs[targetID].labelEle.firstChild);
      deleteIcon.addEventListener('click', e => {
        e.stopPropagation();
        this.inputs[targetID].rootElement.remove();
        delete this.inputs[targetID];
        const customEvent = new CustomEvent('fileDelete', { bubbles: true });
        this.rootElement.dispatchEvent(customEvent);
      });
    });
  };

  /**
   * This does not add a file input, rather a view only attachment
   *
   * @function
   * @param {Object} newAttachments
   */
  Attachments.prototype.addAttachments = function (newAttachments) {
    newAttachments.forEach(newAttachment => {
      const inputGroup = _DOM.createElement('div', { class: ['file', 'hasFile'] });
      const label = _DOM.createElement('div', {
        class: 'fakelabel',
        text: _UTIL.truncateFilename(newAttachment.description),
      });
      const deleteIcon = Icon.getIcon('delete');
      deleteIcon.addEventListener('click', e => {
        const customEvent = new CustomEvent('fileDelete', {
          bubbles: true,
          detail: newAttachment.attachmentId,
        });
        this.rootElement.dispatchEvent(customEvent);
      });

      label.append(deleteIcon);
      inputGroup.append(label);

      this.rootElement.append(inputGroup);
    });
  };

  /**
   * Clears out all attachments, does not delete them
   *
   * @function
   */
  Attachments.prototype.clear = function () {
    this.inputs = {};

    this.rootElement.innerHTML = '';

    const input = new File({ ...this.options });
    input.renderTo(this.rootElement);
    this.inputs[this.options.id] = input;
  };

  return Attachments;
});
