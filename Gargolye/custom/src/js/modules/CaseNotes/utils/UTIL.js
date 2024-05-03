(function (global, factory) {
  global._UTIL = factory();
})(this, function () {
  /**
   * Auto-increments the numeric suffix of an identifier string. If the provided string
   * does not end in a hyphen followed by a number, it appends '-1'. If it does end
   * with a number, the number is incremented by one.
   *
   * This function is useful for automatically generating incremented ID values in
   * scenarios where unique and sequential identifiers are needed.
   *
   * @param {string} str - The input string which may or may not end with a numeric suffix.
   * @returns {string} The input string
   *
   * @example
   * autoIncrementIdString('example');
   * //* returns 'example-1'
   *
   * @example
   * autoIncrementIdString('example-4');
   * //* returns 'example-5'
   */
  function autoIncrementId(str) {
    // Regular expression to match the pattern "-number" at the end of the string
    const regex = /-(\d+)$/;

    // Check if the string matches the pattern
    const match = str.match(regex);

    if (match) {
      // If it matches, increment the number and return the string
      const number = parseInt(match[1], 10) + 1;
      return str.replace(regex, `-${number}`);
    } else {
      // If it doesn't match, append "-1" to the string
      return `${str}-1`;
    }
  }

  /**
   * Allows you to use async await with setTimeout
   *
   * @param {number} ms The number of milliseconds to delay.
   * @param {Function} callback The callback function to execute after the delay.
   * @returns {Promise<void>} A promise that resolves after the specified delay.
   */
  function asyncSetTimeout(callback, ms) {
    let timeoutId;

    const promise = new Promise(resolve => {
      timeoutId = setTimeout(() => {
        callback();
        resolve();
        clearTimeout(timeoutId);
      }, ms);
    });

    return promise;
  }

  /**
   * Creates an instance of AsyncQueue for managing and sending updates asynchronously.
   *
   * @constructor
   * @param {string} apiEndpoint - The endpoint URL where updates will be sent.
   * @param {number} [maxQueueSize=10] - The maximum number of updates before automatically sending them.
   */
  function AsyncQueue(apiEndpoint, maxQueueSize = 10, onSendComplete = () => {}) {
    this.apiEndpoint = apiEndpoint;
    this.maxQueueSize = maxQueueSize;
    this.onSendComplete = onSendComplete;

    this.queue = {};
    this.queueLength = 0;
    this.failedUpdates = [];
    this.isSending = false;
  }

  /**
   * Adds an update to the queue. Automatically sends updates if the queue reaches maxQueueSize.
   *
   * @param {string} inputId - The identifier for the input being updated.
   * @param {any} newValue - The new value for the input.
   */
  AsyncQueue.prototype.addUpdate = function (updateData) {
    this.queue[updateData.id] = updateData.data;
    this.queueLength = Object.keys(this.queue).length;

    if (this.queueLength >= this.maxQueueSize) {
      this.sendUpdates();
    }
  };

  /**
   * Sends updates from the queue to the server endpoint. Can be forced to send all updates regardless of queue size.
   *
   * @param {boolean} [force=false] - Whether to force sending of updates regardless of the current queue size.
   */
  AsyncQueue.prototype.sendUpdates = async function (forceUpdate = false) {
    if (this.queueLength === 0 || (this.isSending && !forceUpdate)) {
      this.onSendComplete([]);
      return;
    }

    this.isSending = true;

    const updatesToSend = Object.values(this.queue);
    this.queue = {};
    this.queueLength = 0;

    const sendPromises = updatesToSend.map(async update => {
      try {
        const response = await _UTIL.fetchData(this.apiEndpoint, update);
        return { success: true, data: response, update };
      } catch (error) {
        console.error('Error sending update:', update, error);
        this.failedUpdates.push(update);
        return { success: false, error: error.message, update };
      }
    });

    const results = await Promise.all(sendPromises);
    this.isSending = false;
    this.onSendComplete(results);
  };

  /**
   * Sets the callback function to be executed when sending data is complete.
   *
   * @param {Function} callback - The callback function to be called when sending is complete.
   * @returns {void}
   */
  AsyncQueue.prototype.setSendCompleteCallback = function (callback) {
    this.onSendComplete = callback;
  };

  /**
   * Immediately forces sending of all updates in the queue, regardless of queue size.
   */
  AsyncQueue.prototype.forceSendUpdates = function () {
    if (this.queueLength > 0) {
      this.sendUpdates(true);
    }
  };

  /**
   * Converts a camelCase string to a title case string with spaces.
   *
   * @param {string} camelCaseStr - The camelCase string to be converted.
   * @returns {string} The converted string in title case with spaces.
   *
   * @example
   * // returns 'Hello There World'
   * convertCamelCaseToTitle('helloThereWorld');
   */
  function convertCamelCaseToTitle(camelCaseStr) {
    // Add a space before each uppercase letter and trim the result
    let spacedStr = camelCaseStr.replace(/([A-Z])/g, ' $1').trim();

    // Capitalize the first letter and concatenate with the rest of the string
    return spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1);
  }

  /**
   * Debounces a function, ensuring that it's not called until after the specified
   * amount of time has passed since the last time it was invoked.
   *
   * @function
   * @param {Function} func - The function to debounce.
   * @param {Number} wait - The number of milliseconds to delay the function
   * @returns {Function} - Returns the debounced version of the provided function
   */
  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const context = this;

      const later = function () {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Ajax call using native Fetch API
   *
   * @function
   * @param {String} service
   * @param {Object} [retrieveData]
   * @returns {Object}
   */
  async function fetchData(service, retrieveData) {
    const URL_BASE = `${$.webServer.protocol}://${$.webServer.address}:${$.webServer.port}/${$.webServer.serviceName}`;
    const URL = `${URL_BASE}/${service}/`;

    try {
      let response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: $.session.Token, ...retrieveData }),
      });

      if (!response.ok) {
        throw new Error('Issue with network, response was not OK');
      }

      let data = await response.json();

      return data;
    } catch (error) {
      console.log(`There was a problem with ${service}`, error.message);
      throw error;
    }
  }

  function getDeviceType() {
    const ua = navigator.userAgent;

    // Patterns to detect mobile and tablet devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);

    if (isMobile) {
      return isTablet ? 'TABLET' : 'MOBILE';
    } else {
      return 'DESKTOP';
    }
  }

  /**
   * Provides methods to interact with the browser's localStorage.
   * It allows you to get and set values while handling JSON serialization and deserialization automatically.
   *
   * @namespace localStorageHandler
   */
  const localStorageHandler = {
    /**
     * Retrieves a value from local storage
     *
     * @function
     * @memberof localStorageHandler
     * @param {String} key
     * @returns {Any|Null}
     */
    get(key) {
      try {
        // storedValue = {storage_key1:storage_value,storage_key2:value}
        const storedValue = localStorage.getItem(`anywstate_${$.session.UserId}`);
        if (storedValue) {
          try {
            const state = JSON.parse(storedValue);
            return state ? state[key] : null;
          } catch (error) {
            return storedValue;
          }
        }

        return null;
      } catch (error) {
        console.log('An error occurred when getting the value from local storage', error);
      }
    },
    /**
     * Sets a value to local storage
     *
     * @function
     * @memberof localStorageHandler
     * @param {String} key
     * @param {Any} value
     */
    set(key, value) {
      try {
        if (typeof value === 'object') {
          value = JSON.parse(value);
        }

        // get current ls value
        const storedValue = localStorage.getItem(`anywstate_${$.session.UserId}`);
        if (!storedValue) {
          storedValue = {};
        }
        // set new key/value pair
        storedValue[key] = value;

        // update with new value
        const updatedValue = JSON.stringify(storedValue);
        localStorage.setItem(`anywstate_${$.session.UserId}`, updatedValue);
      } catch (error) {
        console.log('An error occurred when setting the value to local storage', error);
      }
    },
  };

  /**
   * Merge two objects together, baseObject and mergeObject share same prop names they will be overridden
   * inside the baseObject.
   *
   * @function
   * @param {Object}  baseObject
   * @param {Object}  mergeObject
   * @return {Object} - Merged options object
   */
  function mergeObjects(baseObject, mergeObject) {
    return Object.assign({}, baseObject, mergeObject);
  }

  /**
   * Pads a number with a leading zero if it is less than 10.
   *
   * @param {number} number - The number to pad.
   * @return {string} - The padded number as a string.
   */
  function padNumberWithZero(number) {
    return number < 10 ? '0' + number : number.toString();
  }

  /**
   * Removes and replaces certain characters that can't be saved into the DB.
   * @param {string} note Text that needs to be converted to a format that will save in the DB.
   * @returns {string} Returns the note that can now be saved into the DB.
   */
  function removeUnsavableNoteText(note) {
    if (note == null) return null;
    if (note === '') return '';

    // Remove backslashes
    if (note.indexOf('\\') != -1) {
      note = note.replace(/\\/g, '');
    }

    // Replace double quotes with the same double quotes (seems unnecessary but kept for intent)
    if (note.indexOf('"') != -1) {
      note = note.replace(/\"/g, '"');
    }

    // Escape single quotes
    if (note.indexOf("'") != -1) {
      note = note.replace(/'/g, "''");
    }

    // Remove special tab characters and actual tab characters
    note = note.replace(/&#9|\t/g, '');

    return note;
  }

  /**
   * Sorts an Array of Objects by given property, currently property must be a string
   *
   * @function
   * @param {String}  sortProp
   * @return {Function} - sort comparator function
   */
  function sortByProperty(sortProp) {
    return function (a, b) {
      const aValue = a[sortProp] || '';
      const bValue = b[sortProp] || '';

      // srings only
      return aValue.localeCompare(bValue);
    };
  }

  /**
   * Separate props and methods from obj
   *
   * @function
   * @param {Object}  dirtyObj - Object to split
   * @param {Array}   props - Object props to isolate
   * @return {Object} - Separated options object
   */
  function splitObjectByPropNames(dirtyObj, props) {
    const [a, b] = Object.entries(dirtyObj).reduce(
      ([matching, leftover], [key, value]) =>
        props.includes(key)
          ? [Object.assign(matching, { [key]: value }), leftover]
          : [matching, Object.assign(leftover, { [key]: value })],
      [{}, {}],
    );

    return [{ ...a }, { ...b }];
  }

  /**
   * Truncates a filename to a specified maximum length by removing characters from the middle.
   * Appends an ellipsis ('...') to indicate truncation.
   *
   * @function
   * @param {string} filename - The original filename to truncate.
   * @param {number} [maxLength=20] - The maximum length for the truncated filename. Default is 20.
   *
   * @returns {string} The truncated filename with an ellipsis in the middle.
   *
   * @example
   * const original = 'reallyLongfilename.png';
   * const truncated = truncateFilename(original, 15);
   */
  function truncateFilename(filename, maxLength = 20) {
    const fileExtension = filename.split('.').pop();

    // 3 characters are reserved for "..."
    const maxMainLength = maxLength - fileExtension.length - 3;

    if (filename.length > maxLength) {
      const firstPartLength = Math.floor(maxMainLength / 2);
      const secondPartLength = maxMainLength - firstPartLength;

      // Extract the first and last portions of the main part of the filename
      const firstPart = filename.substring(0, firstPartLength);
      const secondPart = filename.substring(
        filename.length - fileExtension.length - secondPartLength,
        filename.length - fileExtension.length,
      );

      return `${firstPart}...${secondPart}${fileExtension}`;
    }

    return filename;
  }

  /**
   * Watchs for the value of given variable to change
   *
   * @namespace watchVariable
   */
  function watchVariable(initialValue, callback) {
    let value = initialValue;

    return {
      getValue() {
        return value;
      },
      setValue(newValue) {
        if (value !== newValue) {
          callback(value, newValue);
        }
        value = newValue;
      },
    };
  }

  /**
   * Validates the file type based on the provided regular expression pattern.
   *
   * @param {Event} event - The Event object, commonly from an input element of type 'file'.
   * @param {RegExp} forbiddenTypesPattern - The regular expression pattern to match forbidden file types.
   * @returns {boolean} Returns true if the file type is valid, false otherwise.
   */
  function validateFileType(event, forbiddenTypesPattern) {
    const fileType = event.target.files[0]?.type;

    if (!fileType) {
      console.warn('No file selected.');
      return false;
    }

    if (forbiddenTypesPattern.test(fileType)) {
      alert('This application currently does not accept the selected file type.');
      event.target.value = '';
      return false;
    }
    return true;
  }

  return {
    autoIncrementId,
    asyncSetTimeout,
    AsyncQueue,
    convertCamelCaseToTitle,
    debounce,
    getDeviceType,
    fetchData,
    localStorageHandler,
    mergeObjects,
    padNumberWithZero,
    removeUnsavableNoteText,
    sortByProperty,
    splitObjectByPropNames,
    truncateFilename,
    watchVariable,
    validateFileType,
  };
});
