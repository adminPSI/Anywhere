const multiDropdown = (function() {
  let activeDropdownOptions = {};
  let optionAddedFunction = {};
  let optionRemovedFunction = {};

  /**
   * Anywhere multi select dropdown element
   * @typedef {HTMLDivElement} MultiSelectDropdownElement
   * @param {object} options options to define the dropdown
   * @param {string} options.dropdownId - element id for the dropdown
   * @param {string} [options.className] - CSS class name to give the dropdown
   * @param {string} options.label - Text to label the dropdown
   * @param {string} [options.optionAddedCallback] - Called when a option is selected for the dropdown
   * @param {string} [options.optionRemovedCallback] - Called when an option is removed from the dropdown
   * @param {string} options.style - primary - blue background for the dropdown. White text and outline.
   * - secondary - will be used the most. black outline white backbround
   * @param {boolean} options.readonly - true - dropdown can't be clicked and 'dropped down'
   * @returns {HTMLDivElement} Returns a dropdown element with the given options.
   */
  function build(opts) {
    const dropdownId = opts.dropdownId;
    const label = opts.label; 

    const wrap = document.createElement('div');
    wrap.classList.add('multi', 'dropdown');
    wrap.id = dropdownId

     // Dropdown Coloring
     if (opts.style === 'primary') {
      wrap.classList.add('dropdown--primary');
    }
    if (opts.style === 'secondary') {
      wrap.classList.add('dropdown--secondary');
    }
    activeDropdownOptions[dropdownId] = []
    optionAddedFunction[dropdownId] = opts.optionAddedCallback
    optionRemovedFunction[dropdownId] = opts.optionRemovedCallback

    // build select
    const select = document.createElement('select');
    select.classList.add('dropdown__select');
    select.multiple = true;
    select.name = dropdownId;
  
    if (opts.className) select.classList.add(opts.className);
    if (opts.readonly) select.setAttribute('disabled', 'true');

    // build notch
    const notch = document.createElement('div');
    notch.classList.add('notched-outline');
    notch.innerHTML = `
      <div class="notched-outline__leading"></div>
      <div class="notched-outline__notch">
        <label for="${dropdownId}" class="floating-label">${label}</label>
      </div>
      <div class="notched-outline__trailing"></div>
    `;

    const menu = document.createElement('div');
    menu.classList.add('multiMenu', 'hidden');
    menu.tabIndex = '-1';

    wrap.appendChild(select);
    wrap.appendChild(menu);
    wrap.appendChild(notch);

    wrap.innerHTML += `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path class="fill-path" d="M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/>
    </svg>
  `;

  wrap.addEventListener('click', () => {
  	if (wrap.querySelector('.multiMenu').classList.contains('hidden')) {
    	wrap.querySelector('.multiMenu').classList.replace('hidden', 'visible')
    } else {
    	wrap.querySelector('.multiMenu').classList.replace('visible', 'hidden')
    }
  })
  menu.addEventListener('blur', () => {
  	if (wrap.querySelector('.multiMenu').classList.contains('hidden')) {
    	wrap.querySelector('.multiMenu').classList.replace('hidden', 'visible')
    } else {
    	wrap.querySelector('.multiMenu').classList.replace('visible', 'hidden')
    }
  })

  return wrap;

  }

  function populate(dd, data) {
    //data.value
    //data.text
    let multiDropdown;
    let dropdown
    if (typeof dd === 'string') {
      let wrap = document.getElementById(dd);
      dd = wrap;
      dropdown = wrap.querySelector('.dropdown__select')
      multiDropdown = wrap.querySelector('.multiMenu')
    } else {
      dropdown = dd.querySelector('select');
      multiDropdown = dd.querySelector('.multiMenu')
    }

    if (!dropdown) return;

    dropdown.innerHTML = '';
    multiDropdown.innerHTML = '';
    
    if (data.length === 0) {
      const noOptions = document.createElement('div');
      noOptions.innerHTML = `<p style='color:red'>There are no dropdown options.</p>`
      multiDropdown.appendChild(noOptions)
      console.warn(`
      No data was passed into dropdown.populate for dropdown 
      element: ${dd.id}. This could be due the user's filter selection,
      or a database call that did not return any data.`)
    }

    data.forEach(d => {
      const option = document.createElement('option');
      const multiOption = document.createElement('div');
      if (d.id) {
        option.id = d.id;
        multiOption.id = d.id
      }
      option.value = d.value;
      option.innerHTML = d.text;
      multiOption.setAttribute('data-value', d.value);
      multiOption.innerText = d.text;
      dropdown.appendChild(option);
      
      multiOption.classList.add('item')
      multiOption.addEventListener('click', event => {
        multiOption.style.display = 'none';
        const option = multiOption.getAttribute('data-value')
        buildChip({value: option, text: multiOption.innerText}, dd, multiOption)
        const dropdownId = dd.id
        activeDropdownOptions[dropdownId].push({value: option, text: multiOption.innerText})
        const callback = optionAddedFunction[dropdownId]
        if (callback) {
          callback()
        }
        event.stopPropagation()
      })
      multiDropdown.appendChild(multiOption);
    })
  }

  function buildChip(option, dropdown, multiOption) {
    const text = option.text;
    const value = option.value
    const chip = document.createElement('a');
    chip.classList.add('multiChip');
    chip.setAttribute('data-value', value);
    // chip.innerText = text;
    chip.innerHTML = `<div class="chipText">${text}</div>${icons.close}`;

    chip.addEventListener('click', event => {
      multiOption.style.display = 'block';
      const dropdownId = dropdown.id
      const callback = optionRemovedFunction[dropdownId]
      activeDropdownOptions[dropdownId] = activeDropdownOptions[dropdownId].filter(opt => opt.value !== value);
      chip.remove();
      if (callback) callback();
      event.stopPropagation();
    })
    dropdown.prepend(chip)
  }

  // Pass dropdown ID string, or element created with multiDropdown.build
  function getActiveOptions(dd) {
    let dropdown
    if (typeof dd === 'string') {
      dropdown = dd.getElementById(dropdown);
    } else {
      dropdown = dd;
    }
    return [...activeDropdownOptions[dropdown.id]]
  }
  return {
    build,
    populate,
    getActiveOptions
  }
})();