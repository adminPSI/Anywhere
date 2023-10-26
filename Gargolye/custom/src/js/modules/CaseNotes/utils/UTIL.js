(function (global, factory) {
  global._UTIL = factory();
})(this, function () {
  /**
   * Debounces a function, ensuring that it's not called until after the specified
   * amount of time has passed since the lat time it was invoked.
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
   * Debounces a function, ensuring that it's not called until after the specified
   * amount of time has passed since the last time it was invoked. Executes the
   * function immediately upon the first call.
   *
   * @function
   * @param {Function} func - The function to debounce.
   * @param {Number} wait - The number of milliseconds to delay the function.
   * @returns {Function} - Returns the debounced version of the provided function.
   */
  function debounce2(func, wait) {
    let timeout;
    let immediate = true;

    return function executedFunction(...args) {
      const context = this;

      const later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
        immediate = true;
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) {
        immediate = false;
        func.apply(context, args);
      }
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

      let data = response.json();
      return data;
    } catch (error) {
      console.log(`There was a problem with ${service}`, error.message);
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
        localStorage.setItem(`anywstate_${user}`, updatedValue);
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

  //=================================================================
  // TIME SPECIFIC METHODS
  //-----------------------------------------------------------------
  function getMilitaryTimeDifference(startTime, endTime) {
    const startDate = new Date(`1970-01-01T${startTime}`);
    const endDate = new Date(`1970-01-01T${endTime}`);

    const timeDifference = endDate - startDate;

    const hours = Math.floor(timeDifference / 3600000);
    const minutes = Math.floor((timeDifference % 3600000) / 60000);

    const formattedTime = [];

    if (hours > 0) {
      if (hours === 1) {
        formattedTime.push(`${hours} hr`);
      } else {
        formattedTime.push(`${hours} hrs`);
      }
    }
    if (minutes > 0) {
      if (minutes === 1) {
        formattedTime.push(`${minutes} min`);
      } else {
        formattedTime.push(`${minutes} mins`);
      }
    }

    return formattedTime.join(' ');
  }

  return {
    debounce,
    fetchData,
    localStorageHandler,
    mergeObjects,
    removeUnsavableNoteText,
    sortByProperty,
    splitObjectByPropNames,
    watchVariable,
    // TIME METHODS
    getMilitaryTimeDifference,
  };
});
