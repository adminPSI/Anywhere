const input = (function () {
  function build(opts) {
    // opts = {
    //   id = "",
    //   label = "",
    //   type = "",
    //   style = "",
    //   value = "",
    //   accept = "",
    //   readonly = bool,
    //   classNames = "" || [],
    //   callback = () => {},
    //   callbackType = "", ex: change, input, click
    //   onBlurCallback = () => {},
    //   attributes = [{key, value}]
    //   charLimit = int > 0,
    //   forceCharLimit = bool
    //   initialLength = int >= 0,
    //   tabindex = int,
    //   stt = bool,
    // }
    // comment
    var id = opts.id;
    var label = opts.label;
    var type = opts.type;
    var value = opts.value;
    var charLimit = opts.charLimit;
    var tab = opts.tabindex;

    var wrap = document.createElement('div');
    wrap.classList.add('input-field');
    // Button Coloring
    if (opts.style === 'primary') {
      wrap.classList.add('input-field--primary');
    }
    if (opts.style === 'secondary') {
      wrap.classList.add('input-field--secondary');
    }

    // build input
    if (type === 'textarea') {
      var input = document.createElement('textarea');
      wrap.classList.add('textarea');
    } else {
      var input = document.createElement('input');
      if (type) input.type = type;
    }

    input.classList.add('input-field__input');
    if (value && value !== '') input.value = value;
    if (id) input.id = id;

    if (type === 'file') {
      input.setAttribute('accept', opts.accept);
    }

    if (type === 'date') {
      input.setAttribute('max', '9999-12-31');
    }

    if (type === 'password') {
      input.setAttribute('autocomplete', 'new-password');
    }
    if (opts.attributes && opts.attributes.length > 0) {
      opts.attributes.forEach(a => {
        input.setAttribute(a.key, a.value);
      });
    }
    if (opts.readonly) {
      input.setAttribute('readonly', true);
      input.style.pointerEvents = 'none';
    }

    if (opts.classNames) {
      if (Array.isArray(opts.classNames)) {
        opts.classNames.forEach(c => {
          input.classList.add(c);
        });
      } else {
        input.classList.add(opts.classNames);
      }
    }

    // input event callback
    if (opts.callback) {
      if (opts.callbackType) {
        input.addEventListener(opts.callbackType, e => {
          opts.callback(e);
        });
      } else {
        input.addEventListener('change', e => {
          opts.callback(e);
        });
      }
    }
    if (opts.onBlurCallback) {
      input.addEventListener('blur', e => {
        opts.onBlurCallback(e);
      });
    }

    //Character Count. Updates on keyup. If the input value is changed programitically
    // you will need to dispatchEvent(new Event('keyup')) on the input field to update the count
    let characterCount = null;
    if (
      charLimit &&
      charLimit > 0 &&
      (type === 'textarea' || type === 'text' || type === undefined)
    ) {
      let initialLength = 0;

      if (opts.initialLength && opts.initialLength > 0) {
        initialLength = opts.initialLength;
      } else {
        initialLength = value ? value.length : 0;
      }

      characterCount = document.createElement('h5');
      characterCount.classList.add('inputCharCount');
      characterCount.innerText = `(${initialLength}/${charLimit})`;

      const checkOverLimit = length => {
        if (length > charLimit) {
          characterCount.classList.add('overLimit');
        } else {
          characterCount.classList.remove('overLimit');
        }
      };

      checkOverLimit(initialLength);

      // if (opts.forceCharLimit) {
      //   input.setAttribute('maxlength', `${charLimit}`);
      // }

      const handleEvents = e => {
        const length = e.target.value.length;

        if (opts.forceCharLimit) {
          if (length > charLimit) {
            const subString = e.target.value.substring(0, charLimit);
            e.target.value = subString;
            characterCount.innerText = `(${subString.length}/${charLimit})`;
          }
        }

        if (!opts.forceCharLimit || length <= charLimit) {
          characterCount.innerText = `(${length}/${charLimit})`;
          checkOverLimit(length);
          return;
        }
      };
      // input.addEventListener('keyup', handleEvents);
      input.addEventListener('input', handleEvents);
      input.addEventListener('paste', handleEvents);
    }

    if (opts.tabindex) {
      input.tabIndex = tab;
    }

    // Add Speech to Text. Only add to text fields.
    let sttBtn = null;
    let azureSTTConnection = false;
    if (opts.stt && (type === 'textarea' || type === undefined)) {
      sttBtn = button.build({
        text: '',
        style: 'secondary',
        type: 'text',
        classNames: 'sttInputIcon',
        icon: 'microphone',
      });
      azureSTTConnection = SPEECH.init();
      if (azureSTTConnection) SPEECH.addSTTContinuousRecEvent(sttBtn, wrap); // Change wrap to input and change SPEECH file
    }

    // build notch
    var notch = document.createElement('div');
    notch.classList.add('notched-outline');
    notch.innerHTML = `
      <div class="notched-outline__leading"></div>
      <div class="${label ? 'notched-outline__notch' : 'notched-outline__notch noLabel'}">
        ${label ? `<label for="${id}" class="floating-label">${label}</label>` : ``}
      </div>
      <div class="notched-outline__trailing"></div>
    `;

    wrap.appendChild(input);
    wrap.appendChild(notch);
    if (characterCount) wrap.appendChild(characterCount);
    if (sttBtn && azureSTTConnection) wrap.appendChild(sttBtn);

    return wrap;
  }

  function buildCheckbox(opts) {
    // opts = {
    //   className = "" || [],
    //   text = "",
    //   id = "",
    //   isChecked = boolean,
    //   attributes = [{key, value}]
    //   callback = () => {}
    // }
    var checkbox = document.createElement('label');
    checkbox.classList.add('checkbox', 'checkbox-mtd');

    var input = document.createElement('input');
    input.type = 'checkbox';
    if (opts.id) input.id = opts.id;
    if (opts.isChecked) input.setAttribute('checked', true);
    if (opts.isDisabled) input.setAttribute('disabled', true);

    if (opts.className) {
      if (Array.isArray(opts.className)) {
        opts.className.forEach(c => {
          checkbox.classList.add(c);
        });
      } else {
        checkbox.classList.add(opts.className);
      }
    }

    if (opts.attributes && opts.attributes.length > 0) {
      opts.attributes.forEach(a => {
        input.setAttribute(a.key, a.value);
      });
    }

    if (opts.callback) {
      input.addEventListener('change', e => {
        opts.callback(e);
      });
    }

    var text = document.createElement('span');
    if (opts.text) text.innerHTML = opts.text;

    checkbox.appendChild(input);
    checkbox.appendChild(text);

    return checkbox;
  }
  function buildNativeCheckbox(opts) {
    // opts = {
    //   className = "" || [],
    //   text = "",
    //   id = "",
    //   isChecked = boolean,
    //   isDisabled = boolean,
    //   attributes = [{key, value}]
    //   callback = () => {}
    // }

    var wrap = document.createElement('div');
    wrap.classList.add('input-field');
    wrap.classList.add('checkbox');

    var input = document.createElement('input');
    input.classList.add('input-field__input');
    input.type = 'checkbox';

    if (opts.id) input.id = opts.id;
    if (opts.isChecked) input.setAttribute('checked', true);
    if (opts.isDisabled) input.setAttribute('disabled', true);

    if (opts.className) {
      if (Array.isArray(opts.className)) {
        opts.className.forEach(c => {
          wrap.classList.add(c);
        });
      } else {
        wrap.classList.add(opts.className);
      }
    }

    if (opts.attributes && opts.attributes.length > 0) {
      opts.attributes.forEach(a => {
        input.setAttribute(a.key, a.value);
      });
    }

    if (opts.callback) {
      input.addEventListener('change', e => {
        opts.callback(e);
      });
    }

    wrap.appendChild(input);

    return wrap;
  }
  function buildRadio(opts) {
    // opts = {
    //   className = "" || [],
    //   text = "",
    //   id = "",
    //   name = "",
    //   isChecked = boolean,
    //   isDisabled = boolean,
    //   attributes = [{key, value}]
    //   callback = () => {}
    // }
    var radio = document.createElement('label');
    radio.classList.add('radio');

    var input = document.createElement('input');
    input.type = 'radio';
    if (opts.isChecked) input.checked = true;
    if (opts.isDisabled) input.setAttribute('disabled', true);
    if (opts.id) input.id = opts.id;

    if (opts.name) input.setAttribute('name', opts.name);

    if (opts.className) {
      if (Array.isArray(opts.className)) {
        opts.className.forEach(c => {
          radio.classList.add(c);
        });
      } else {
        radio.classList.add(opts.className);
      }
    }

    if (opts.attributes && opts.attributes.length > 0) {
      opts.attributes.forEach(a => {
        input.setAttribute(a.key, a.value);
      });
    }

    if (opts.callback) {
      input.addEventListener('change', e => {
        opts.callback(e);
      });
    }

    var text = document.createElement('span');
    if (opts.text) text.innerHTML = opts.text;

    radio.appendChild(input);
    radio.appendChild(text);

    return radio;
  }

  function disableInputField(element) {
    const inputEle = element.nodeName !== 'INPUT' ? element.querySelector('input') : element;

    inputEle.classList.add('disabled');
    inputEle.setAttribute('tab-index', '-1');
  }
  function enableInputField(inputEle) {
    const inputEle = element.nodeName !== 'INPUT' ? element.querySelector('input') : element;

    inputEle.classList.remove('disabled');
    inputEle.removeAttribute('tab-index', '-1');
  }

  return {
    build,
    buildCheckbox,
    buildNativeCheckbox,
    buildRadio,
    disableInputField,
    enableInputField,
  };
})();
