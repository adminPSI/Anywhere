var button = (function() {
  /**
   * See {@link https://git.primarysolutions.net/anywhere/anywhere-4/-/wikis/Anywhere/Elements/Buttons GitLab Wiki}
   * for button examples
   * @function build
   * @param {object} options 
   * @param {string} [options.id] - sets button elemnet id
   * @param {(string|string[])} [options.classNames] - Single string or array of strings that set the class names for the button element.
   * @param {object[]} [options.attributes] - sets key value pair of data attributes to the button.
   * @param {string} options.attributes.key - data attribute name
   * @param {string} options.attributes.value - data attribute value
   * @param {string} [options.text] - Text to display in the button. Can be left blank when creating an 'icon' button.
   * @param {string} options.style - secondary - button main color is blue 
   * - primary - button main color is white
   * - danger - button is red with white text
   * @param {string} options.type - contained - button is filled in with its style color
   * - outlined - button is not filled in and is outlined with is style color
   * - text - no fill no outline. Text is style color
   * @param {string} [options.icon] - icon svg from global\icons.js
   * @param {string} [options.iconPos=left] - icon position of text (left, right, top bottom).
   * @param {boolean} [options.toggle] - true - button is a toggable button when clicked it will now become highlighted once clicked again.
   * @param {string} [options.toggleText] - If it is a toggle button you can specify text here to change the button text to once it is toggled.
   * @param {string} [options.tabindex] - Customize the tab order of elements. set to -1 to remove button from tab order. Useful for buttons that are hidden off screen.
   * @param {function} options.callback - action to perform when clicked
   * @returns {HTMLButtonElement} Returns the button element with the given options.
   */
  function build(options) {
    var button = document.createElement('button');
    if (options.id) button.id = options.id;
    // Button Icons
    if (options.icon) {
      button.classList.add('btn-icon');
      if (options.iconPos) {
        var iconPos = `icon-${options.iconPos}`;
        button.classList.add(iconPos);
      }
      if (options.text) {
        button.innerHTML = `
          ${icons[options.icon]}
          <span>${options.text.toLowerCase()}</span>
        `;
      } else {
        button.innerHTML = icons[options.icon];
      }
    } else {
      button.classList.add('btn');
      if (options.text) {
        button.innerHTML = options.text.toLowerCase();
      }
    }
    // Button Coloring
    if (options.style === 'primary') {
      button.classList.add('btn--primary');
    }
    if (options.style === 'secondary') {
      button.classList.add('btn--secondary');
    }
    if (options.style === 'danger') {
      button.classList.add('btn--danger');
    }
    // Button Styling
    if (options.type === 'text') {
      button.classList.add('btn--text');
    }
    if (options.type === 'contained') {
      button.classList.add('btn--contained');
    }
    if (options.type === 'outlined') {
      button.classList.add('btn--outlined');
    }
    // toggle button?
    if (options.toggle) {
      button.classList.add('btn--toggle');
      button.setAttribute('data-toggled', false);
      // Toggle Event
      button.addEventListener('click', event => {
        if (options.icon) {
          var btnText = button.querySelector('span');
        } else {
          var btnText = button;
        }
        
        if (event.target.dataset.toggled === 'true') {
          button.setAttribute('data-toggled', false);
          btnText.innerHTML = options.text;
        } else {
          button.setAttribute('data-toggled', true);
          if (options.toggleText) {
            btnText.innerHTML = options.toggleText;
          }
        }
      });
    }
    // Button additional class names
    if (options.classNames) {
      if (Array.isArray(options.classNames)) {
        options.classNames.forEach(c => {
          button.classList.add(c);
        });
      } else {
        button.classList.add(options.classNames)
      }
    }
    // Button additional attributes
    if (options.attributes) {
      options.attributes.forEach(att => {
        button.setAttribute(att.key, att.value);
      });
    }
    // Button Callback
    if (options.callback) {
        button.addEventListener('click', options.callback);
    }
    // Button TabIndex
    if (options.tabindex) {
      button.tabIndex = options.tabindex;
    };

    return button;
  }

  return {
    build
  }
})();