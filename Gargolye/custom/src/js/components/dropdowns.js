var dropdown = (function () {
  /**
   * Anywhere dropdown element
   * @typedef {HTMLDivElement} DropdownElement
   * @param {object} options options to define the dropdown
   * @param {string} [options.dropdownId] - element id for the dropdown
   * @param {string} [options.className] - CSS class name to give the dropdown
   * @param {string} options.label - Text to label the dropdown
   * @param {string} options.style - primary - blue background for the dropdown. White text and outline.
   * - secondary - will be used the most. black outline white backbround
   * @param {boolean} options.readonly - true - dropdown can't be clicked and 'dropped down'
   * @param {function} options.callback - callback to be called on change
   * @returns {HTMLDivElement} Returns a dropdown element with the given options.
   */
  // asdfasdf
  function build(options) {
    var dropdownId = options.dropdownId;
    var className = options.className;
    var label = options.label;
    var style = options.style;
    var readonly = options.readonly;

    var wrap = document.createElement('div');
    wrap.classList.add('dropdown');

    // Dropdown Coloring
    if (style === 'primary') {
      wrap.classList.add('dropdown--primary');
    }
    if (style === 'secondary') {
      wrap.classList.add('dropdown--secondary');
    }

    // build select
    var select = document.createElement('select');
    select.classList.add('dropdown__select');
    if (dropdownId) select.id = dropdownId;
    if (className) select.classList.add(className);
    if (readonly) select.setAttribute('disabled', 'true');

    if (options.callback) {
      wrap.addEventListener('change', e => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        options.callback(e, selectedOption);
      });
    }

    // build notch
    var notch = document.createElement('div');
    notch.classList.add('notched-outline');
    if (label && label !== '') {
      notch.innerHTML = `
        <div class="notched-outline__leading"></div>
        <div class="notched-outline__notch">
          <label for="${dropdownId}" class="floating-label">${label}</label>
        </div>
        <div class="notched-outline__trailing"></div>
      `;
    } else {
      notch.innerHTML = `
        <div class="notched-outline__leading"></div>
        <div class="notched-outline__trailing"></div>
      `;
    }

    wrap.appendChild(select);
    wrap.appendChild(notch);

    wrap.innerHTML += `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z"/>
        <path class="fill-path" d="M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/>
      </svg>
    `;

    return wrap;
  }

  /**
   *
   * @param {object} options options to define the dropdown
   * @param {string} [options.dropdownId] - element id for the dropdown
   * @param {string} [options.className] - CSS class name to give the dropdown
   * @param {boolean} options.readonly - true - dropdown can't be clicked and 'dropped down'
   * @returns
   */
  function inlineBuild(options) {
    const dropdownId = options.dropdownId;
    const className = options.className;
    const readonly = options.readonly;

    const span = document.createElement('span');
    span.classList.add('inlineDropdown');

    const select = document.createElement('select');

    select.classList.add('inlineDropdown__select');
    select.id = dropdownId;
    if (className) select.classList.add(className);
    if (readonly) select.setAttribute('disabled', 'true');

    const hiddenDropdown = document.createElement('select');
    hiddenDropdown.id = `${dropdownId}__width_tmp_select`;
    const hidOpt = document.createElement('option');
    hidOpt.id = `${dropdownId}__width_tmp_option`;
    hiddenDropdown.appendChild(hidOpt);

    span.appendChild(select);
    span.appendChild(hiddenDropdown);
    span.innerHTML += `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 4 14 14">
      <path class="fill-path" d="M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/>
    </svg>
    `;
    return span;
  }
  /**
   * Populates the given dropdown
   * @param {DropdownElement} dropdown - Dropdown element from dropdown.build
   * @param {Object[]} data - Data array to populate the dropdown
   * @param {string} [data.id] - Dropdown data element id
   * @param {string} data.text - Dropdown data element text that is displayed
   * @param {string} data.value - Dropdown data element value
   * @param {Object[]} [data.attributes] - Dropdown data element data attributes
   * @param {string} data.attributes.key - data attribute key
   * @param {string} data.attributes.value - data attribute value
   * @param {string} defaultVal - default to set the dropdown to. Use the 'Value' data option.
   */

  function populate(dropdown, data, defaultVal) {
    if (typeof dropdown === 'string') {
      var dropdown = document.getElementById(dropdown);
    } else {
      var dropdown = dropdown.querySelector('select');
    }

    if (!dropdown) return;

    dropdown.innerHTML = '';

    data.forEach(d => {
      // value and text are required
      // data = {id="", value="", text="", attributes=[{key, value}]}
      var option = document.createElement('option');
      if (d.id) option.id = d.id;
      option.value = d.value;
      option.innerHTML = d.text;
      // set custom attributes
      if (d.attributes && d.attributes.length > 0) {
        d.attributes.forEach(a => {
          option.setAttribute(a.key, a.value);
        });
      }
      // append to dropdown
      dropdown.appendChild(option);
    });
    if (defaultVal && defaultVal !== '') dropdown.value = defaultVal;
  }
  /**
   * Populates the given dropdown using option grouping
   * @param {Object} opt - Options
   * @param {DropdownElement} opt.dropdown - Dropdown element from dropdown.build
   * @param {Object[]} opt.data - Data array to populate the dropdown
   * @param {string} opt.data.groupLabel - Label for the option grouping
   * @param {string} [opt.data.groupId] - Label for the option grouping
   * @param {Object[]} opt.data.dropdownValues - Dropdown Options
   * @param {string} [opt.data.dropdownValues.id] - Dropdown data element id
   * @param {string} opt.data.dropdownValues.text - Dropdown data element text that is displayed
   * @param {string} opt.data.dropdownValues.value - Dropdown data element value
   * @param {Object[]} [opt.nonGroupedData] - Dropdown Data that doesn't get grouped
   * @param {string} [opt.nonGroupedData.id] - Dropdown data element id
   * @param {string} opt.nonGroupedData.text - Dropdown data element text that is displayed
   * @param {string} opt.nonGroupedData.value - Dropdown data element value
   * @param {Object[]} [opt.data.dropdownValues.attributes] - Dropdown data element data attributes
   * @param {string} opt.data.dropdownValues.attributes.key - data attribute key
   * @param {string} opt.data.dropdownValues.attributes.value - data attribute value
   * @param {string} opt.defaultVal - default to set the dropdown to. Use the 'Value' data option.
   */

  function groupingPopulate(opt) {
    let dropdown = opt.dropdown;
    const data = opt.data;
    const nonGroupedData = opt.nonGroupedData;
    const defaultVal = opt.defaultVal;

    if (typeof dropdown === 'string') {
      dropdown = document.getElementById(dropdown);
    } else {
      dropdown = dropdown.querySelector('select');
    }

    if (!dropdown) return;

    dropdown.innerHTML = '';

    if (nonGroupedData) {
      nonGroupedData.forEach(d => {
        // value and text are required
        // data = {id="", value="", text="", attributes=[{key, value}]}
        const option = document.createElement('option');
        if (d.id) option.id = d.id;
        option.value = d.value;
        option.innerHTML = d.text;
        // set custom attributes
        if (d.attributes && d.attributes.length > 0) {
          d.attributes.forEach(a => {
            option.setAttribute(a.key, a.value);
          });
        }
        // append to dropdown
        dropdown.appendChild(option);
      });
    }

    data.forEach(d => {
      const group = document.createElement('optgroup');
      group.label = d.groupLabel;
      if (d.groupId) group.id = d.groupId;
      dropdown.appendChild(group);

      d.dropdownValues.forEach(d => {
        // value and text are required
        // dropdownValues = {id="", value="", text="", attributes=[{key, value}]}
        const option = document.createElement('option');
        if (d.id) option.id = d.id;
        option.value = d.value;
        option.innerHTML = d.text;
        // set custom attributes
        if (d.attributes && d.attributes.length > 0) {
          d.attributes.forEach(a => {
            option.setAttribute(a.key, a.value);
          });
        }
        group.appendChild(option);
      });
    });
    if (defaultVal && defaultVal !== '') dropdown.value = defaultVal;
  }

  return {
    build,
    inlineBuild,
    populate,
    groupingPopulate,
  };
})();
