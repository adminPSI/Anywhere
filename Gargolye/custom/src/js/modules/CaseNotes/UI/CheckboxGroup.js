(function (global, factory) {
  global.CheckboxGroup = factory();
})(this, function () {
  //=======================================
  // MAIN LIB
  //---------------------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    groupLabel: null,
    fields: null,
  };

  /**
   * Constructor function for creating a CheckboxGroup component.
   *
   * @constructor
   * @param {Object} options
   * @returns {CheckboxGroup}
   */
  function CheckboxGroup(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    this.inputs = {};

    // DOM Ref
    this.rootElement = null;
    this.groupLabelEle = null;

    this._build();
  }

  CheckboxGroup.prototype._build = function () {
    this.rootElement = _DOM.createElement('fieldset');
    this.groupLabelEle = _DOM.createElement('legend', { text: this.options.groupLabel });
    this.rootElement.appendChild(this.groupLabelEle);

    this.options.fields.forEach(field => {
      let inputInstance = new Checkbox({ ...field });
      this.rootElement.appendChild(inputInstance.rootElement);
      this.inputs[field.id] = inputInstance;
    });
  };

  return CheckboxGroup;
});
