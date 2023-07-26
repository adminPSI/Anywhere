const UTIL = (function () {
  function abbreviateDateYear(dateString) {
    // shortens year
    var dateArr = dateString.split('/');
    var month = dateArr[0];
    var day = dateArr[1];
    var year = dateArr[2].split('');
    year = `${year[2]}${year[3]}`;

    return `${leadingZero(month)}/${leadingZero(day)}/${year}`;
  }

  function camelize(str) {
    if (!str) return;
    return str.replace(/\W+(.)/g, (match, chr) => {
      return chr.toUpperCase();
    });
  }

  function capitalize(str) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function convertFromMilitary(time) {
    if (!time || time === '') return '';

    time = time.split(':');
    var hh = parseInt(time[0]);
    var mm = parseInt(time[1]);
    var amPm = hh <= 11 ? 'AM' : 'PM';

    if (hh === 0) hh = 12;
    if (amPm === 'PM' && hh !== 12) hh -= 12;

    return `${hh}:${leadingZero(mm)} ${amPm}`;
  }

  /**
   * Converts a 12hr time to 24hr military time.
   * @param {string} time - Time you would like to convert. Must be in this format: 'HH:MM am|pm'
   * @returns {string} Converted time
   */
  function convertToMilitary(time) {
    // time format must be hh:mm am/pm
    if (!time || time === '') return '';

    time = time.split(' ');
    timeString = time[0].split(':');

    var amPM = time[1].toLowerCase();
    var hh = parseInt(timeString[0]);
    var mm = parseInt(timeString[1]);

    if (amPM === 'pm' && hh !== 12) hh += 12;
    if (amPM === 'am' && hh === 12) hh = 0;

    return `${leadingZero(hh)}:${leadingZero(mm)}:00`;
  }

  /**
   * Calculates the total number of hours between the start and end
   * @param {string} dirtyStart Start Time (24hr military time)
   * @param {string} dirtyEnd End Time (24hr military time)
   * @returns {string} Total number of hours
   */
  function calculateTotalHours(dirtyStart, dirtyEnd, format) {
    // must be military time
    if (dirtyStart === '' || dirtyEnd === '' || !dirtyStart || !dirtyEnd) {
      return;
    }

    var startTime = dirtyStart.split(':');
    var endTime = dirtyEnd.split(':');

    var tempDate = new Date();
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth();
    var day = tempDate.getDate();

    var startDate = new Date(year, month, day, startTime[0], startTime[1]);
    var endDate;
    if (dirtyEnd === '00:00') {
      endDate = new Date(year, month, day + 1, endTime[0], endTime[1]);
    } else {
      endDate = new Date(year, month, day, endTime[0], endTime[1]);
    }

    var timeDiff = endDate - startDate;
    var hoursDiff = Math.floor((timeDiff % 86400000) / 3600000);
    var minutesDiff = Math.floor(((timeDiff % 86400000) % 3600000) / 60000);

    if (format === 'hh:mm') {
      return `${hoursDiff}:${minutesDiff}`;
    }

    return (parseInt(hoursDiff, 10) + parseFloat((minutesDiff / 60).toFixed(2))).toFixed(2);
  }
  /**
   * Splits the given array into a new array of the array broken into multiple chunks.
   * @example
   * // returns [[a,b,c],[d,e,f],[g,h,i]]
   * UTIL.chunkArray([a,b,c,d,e,f,g,h,i], 3)
   * @param {array} arr Array you would like to split into smaller arrays
   * @param {number} chunkSize Number value you would like the size of the array chunks to be split into
   * @returns {array[]} Returns an array of the split up array.
   */
  function chunkArray(arr, chunkSize) {
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
    return R;
  }

  function detectBrowser() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      var ver = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      var versionNumber = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      var versionNumber = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      return true;
    }

    // other browser
    return false;
  }

  /**
   * Converts the given date to ISO format
   * @example
   * // returns 2020-01-01
   * UTIL.formatDateToIso('01/01/2020')
   * @param {string} dirtyDate Date you would like to be converted to ISO format. Acceptable formats are:
   * - MM/DD/YYYY
   * - MM-DD-YYYY
   * @returns {string} Returns the string of the date in ISO Format
   */
  function formatDateToIso(dirtyDate) {
    if (!dirtyDate) return;

    let splitBy;

    if (dirtyDate.indexOf('/') !== -1) {
      splitBy = '/';
    } else if (dirtyDate.indexOf('-') !== -1) {
      splitBy = '-';
    } else {
      return 'Invalid Date String';
    }

    const date = dirtyDate.split(splitBy);

    if (date[0].length === 4) {
      return dirtyDate;
    }

    const YYYY = date[2];
    const MM = leadingZero(date[0]);
    const DD = leadingZero(date[1]);

    return `${YYYY}-${MM}-${DD}`;
  }
  /**
   * Converts the given ISO date to a more readable format
   * @example
   * // returns 01-01-2020
   * UTIL.formatDateFromIso('2020-01-01', '-')
   * @example
   * // returns 01/01/2020
   * UTIL.formatDateFromIso('2020-01-01')
   * @param {string} dirtyDate - Date you would like to be converted from ISO format
   * - Must be YYYY-MM-DD
   * @param {string} [joinBy='/'] - Character you would like to seperate the MM DD and YYYY
   * @returns {string} Returns the cleaned date
   */
  function formatDateFromIso(dirtyDate, joinBy, opts) {
    var shorten = opts ? opts.shortenYear : false;
    var date = dirtyDate.split('-');
    var MM = leadingZero(date[1]);
    var DD = leadingZero(date[2]);
    var YYYY = shorten ? date[0].substring(0, 2) : date[0];

    if (joinBy) {
      return `${MM}${joinBy}${DD}${joinBy}${YYYY}`;
    }

    return `${MM}/${DD}/${YYYY}`;
  }

  /**
   * Converts a date object created from Date() into ISO format (YYYY-MM-DD).
   * @deprecated Use getFormattedDateFromDate() instead. It allows you to specify how you would like the
   * date to be outputted.
   * @param {object} dirtyDateObj - date object created from Date()
   * @returns {string} Returns the ISO format of the given date object
   */
  function formatDateFromDateObj(dirtyDateObj) {
    var dateObj = new Date(dirtyDateObj);
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth();
    var day = dateObj.getDate();
    month = month + 1;

    return `${year}-${leadingZero(month)}-${leadingZero(day)}`;
  }

  /**
   * Converts a time with Hour Min and Seconds to 12hr time
   * @example
   * // returns 2:30 PM
   * UTIL.formatTimeString('14:30:29')
   * @param {string} timeString - Time you would like converted to AM PM time.
   * - HH:MM:SS
   * @returns {string} Returns the time into an Am Pm time, and strips the seconds.
   */
  function formatTimeString(timeString) {
    if (timeString === '') return timeString;
    // removes seconds and strips leading zeros then converts to standard
    var time = timeString.split(':');
    var hh = time[0].split('')[0] === '0' ? time[0].split('')[1] : time[0];
    var mm = time[1];

    return UTIL.convertFromMilitary(`${hh}:${mm}`);
  }

  /**
   * Converts a phone number string into a more readable format of the phone number
   * @example
   * returns  614-222-3322
   * UTIL.formatPhoneNumber('6142223322')
   * @param {string} phoneNumberString - Phone Number
   * @returns {string} Returs a more readable format of the phone number
   */
  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumberString;
  }

  function findAndSlice(array, value, property) {
    function itemFind(item) {
      // Check for array of objects
      if (typeof array[0] === 'object' && property) {
        return item[property] === value;
      } else {
        return item === value;
      }
    }
    array.splice(array.findIndex(itemFind), 1);
  }

  /**
   * Gets lat and long from browsers Location API
   * @param {function} callback Action to perform once location is found
   * @returns {object} Returs the position latitude and longitude
   */
  function getGeoLocation(callback) {
    function handleSuccess(position) {
      var pos = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };

      $.session.geoLocationPosition = pos;

      if (callback) callback(pos);
    }
    function handleFirstRunError(error) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleSecondRunError, {
        enableHighAccuracy: false,
      });
    }
    function handleSecondRunError(error) {
      alert('Location blocked by device or browser.');
    }

    if (location.protocol === 'https:' || location.hostname === 'localhost') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleFirstRunError, {
          enableHighAccuracy: true,
        });
      } else {
        alert('Your browser does not support geolocation.');
      }
    }
  }

  /**
   * Converts a date object from Date() into a date string for either display or to use in DB calls.
   * @param {object} date - Date object from Date()
   * @param {object} [options] - Options for formating the Date
   * @param {string} [options.separator='/'] - Seperation character for between month day and year
   * @param {string} [options.format] - Choose how you would like the date output to be formated:
   * - pass 'iso' for an ISO format (YYYY-MM-DD)
   * - pass 'nonIso' to have a display formated output (MM/DD/YYYY or options.separator)
   * @returns {string} Returns a string date with the given formating options
   */
  function getFormattedDateFromDate(date, options) {
    var separator = options && options.separator ? options.separator : '/';
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var date = `${month}${separator}${day}${separator}${year}`;

    if (options) {
      if (!options.format || options.format === 'nonIso') {
        return date;
      }

      if (options.format === 'iso') {
        return formatDateToIso(date);
      }
    } else {
      return date;
    }
  }

  /** @deprecated Use getTodaysDate()	 */
  function getDBDateNow() {
    var d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
  }

  /**
   * Gets todays date
   * @param {boolean} [returnObj] - If True, function will return a Date() object rather than an ISO formated date
   * @returns {string|object} Returns either a date object or ISO formated string depending on what is passed in returnObj
   */
  function getTodaysDate(returnObj) {
    // returns iso format date
    var today = new Date();
    if (returnObj) return today;
    var dd = leadingZero(today.getDate());
    var mm = leadingZero(today.getMonth() + 1);
    var yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Gets the current time 24hr military time (HH:MM).
   * @returns {string} Returns a time string in 24hr military time.
   */
  function getCurrentTime() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var now = `${hours}:${minutes}`;
    return now;
  }

  function getRange(start, stop) {
    if (stop === undefined) {
      stop = start || 1;
      start = 0;
    }
    let arr = [];
    for (let i = start; i < stop; i++) {
      arr.push(i);
    }
    return arr;
  }

  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }
  /**
   * Creates a deep copy of the passed object
   * @param {object} src Object to copy
   * @returns {object} Returns the coppied object
   */
  function iterationCopy(src) {
    // copys an object
    let target = {};
    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        // if the value is a nested object, recursively copy all it's properties
        if (isObject(src[prop])) {
          target[prop] = iterationCopy(src[prop]);
        } else {
          target[prop] = src[prop];
        }
      }
    }
    return target;
  }

  /**
   * Adds a leading 0 to the passed number.
   * - ONLY adds a 0 if the number is 1 character long.
   * - Primarly used to make numbers saveable to the DB.
   * @example
   * // returns '03'
   * UTIL.leadingZero(3)
   * // returns '11'
   * UTIL.leadingZero(11)
   * @param {number} number Number to add leading 0 to
   * @returns {string} Returns a string version of the number with
   * the number plus a 0 before it (if number is more than 1 character)
   */
  function leadingZero(number) {
    var num = String(number);
    if (num.length > 1) return num;
    return `0${num}`;
  }
  /**
   * Converts an XML string into an XMLDocument that can be accessed more easly using standard JS DOM selectors.
   * @param {string} xmlString An XML string
   * @returns {XMLDocument} Returns XMLDocument
   */
  function parseXml(xmlString) {
    var parser, xmlDoc, hasError;
    parser = new DOMParser();
    xmlString = xmlString.replace(/@/g, '');
    //xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    try {
      xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    } catch (error) {
      console.log(error);
    }
    // Parse Error Check
    hasError = xmlDoc.documentElement.nodeName === 'parsererror' ? true : false;
    if (hasError) {
      console.error('error while parsing');
    } else {
      return xmlDoc;
    }
  }

  function removeDecimals(num) {
    if (typeof num === 'number') {
      return Math.floor(num);
    } else {
      return Math.floor(parseInt(num));
    }
  }

  function removeQuotes(string) {
    return string.replace(/\\['\\]|'/g, function (s) {
      return s === "'" ? '' : s;
    });
  }

  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }

    var number = Number(dirtyNumber);

    if (isNaN(number)) {
      return number;
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }

  function validateTime(time) {
    const splitTime = time.split('.'); //Edge Chromium adds milliseconds to end of time when using time picker
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(splitTime[0]);
  }

  function validateDateFromInput(dateString) {
    const dateArray = dateString.split('-');
    let inputDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], 0);
    inputDate = formatDateFromDateObj(inputDate);

    return dateString == inputDate ? true : false;
  }

  /**
   * Removes and replaces certain characters that can't be saved into the DB.
   * @param {string} note Text that needs to be converted to a format that will save in the DB.
   * @returns {string} Returns the note that can now be saved into the DB.
   */
  function removeUnsavableNoteText(note) {
    if (note === null || note === undefined) return;
    if (note === '') return '';

    //if (note.indexOf("\"") != -1) {
    //    note = note.replace(/\"/g, "");
    //}
    if (note.indexOf('\\') != -1) {
      note = note.replace(/\\/g, '');
    }

    if (note.indexOf('"') != -1) {
      //note = note.replace(/\"/g, "");
      note = note.replace(/\"/g, '"');
    }
    if (note.indexOf("'") != -1) {
      note = note.replace(/'/g, "''");
    }

    if (note.indexOf('\n') != -1) {
      //note = note.replace(/\n/g, "\\\\x0a");
      // note = note.replace(/\n/g, "\\r\\n");
    }

    note = note.replace('&#9', '');
    note = note.replace('\t', '');
    note = note.replace(/\t/g, '');
    note = note;
    return note;
  }

  function romanize(num) {
    if (!+num) return false;
    var digits = String(+num).split(''),
      key = [
        '',
        'C',
        'CC',
        'CCC',
        'CD',
        'D',
        'DC',
        'DCC',
        'DCCC',
        'CM',
        '',
        'X',
        'XX',
        'XXX',
        'XL',
        'L',
        'LX',
        'LXX',
        'LXXX',
        'XC',
        '',
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
      ],
      roman = '',
      i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
  }
  /**
   *  Builds and appends a warning popup
   * @param {object} opts Options For the Popup
   * @param {string} opts.message What do you want the warning to say
   * @param {boolean} [opts.hideX=false] True: X button is hidden
   * @param {object} opts.accept Accept options
   * @param {string} opts.accept.text Accept option button text
   * @param {function} opts.accept.callback Accept option button callback
   * @param {object} [opts.reject] Reject options (optional)
   * @param {string} [opts.reject.text] Reject option button text
   * @param {function} [opts.reject.callback] Reject option button callback
   */
  function warningPopup(opts) {
    const { message, hideX = false, accept, reject } = opts;
    const popup = POPUP.build({
      id: 'warningPopup',
      hideX: hideX,
      classNames: 'warning',
    });
    const acceptBtn = button.build({
      text: accept.text,
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(popup);
        if (accept.callback) accept.callback();
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(acceptBtn);

    if (reject) {
      const rejectBtn = button.build({
        text: reject.text,
        style: 'secondary',
        type: 'contained',
        callback: function () {
          POPUP.hide(popup);
          if (reject.callback) reject.callback();
        },
      });
      btnWrap.appendChild(rejectBtn);
    }
    const warningMessage = document.createElement('p');
    warningMessage.innerHTML = message;
    popup.appendChild(warningMessage);
    popup.appendChild(btnWrap);
    POPUP.show(popup);
  }

  function deromanize(str) {
    var str = str.toUpperCase(),
      validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
      token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
      key = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      },
      num = 0,
      m;
    if (!(str && validator.test(str))) return false;
    while ((m = token.exec(str))) num += key[m[0]];
    return num;
  }
  /**
   * LS Stored as object like:
   * - anywstata_userid = {storage_key1:storage_value,storage_key2:value}
   * @function LS
   */
  const LS = (function () {
    /**
     * Returns the value of local storage for key that is passed.
     * @param {string} key - Local Storage Key.
     * @param {string} [user=$.session.UserId] - User for the key. Defaults to session user.
     * @returns {string} Value for key that is passed. Returns nothing if key does not exist.
     */
    function getStorage(key, user = $.session.UserId) {
      //
      const state = JSON.parse(localStorage.getItem(`anywstate_${user}`));
      if (state) {
        return state[key];
      } else return;
    }
    /**
     * Set LocalStorage key/value pair for user.
     * @param {string} key - Descriptive name of key. Use this same key in getStorage to get the LS value.
     * @param {string} value - Value you would like to set
     * @param {string} [user=$.session.UserId] - User for the key. Defaults to session user.
     */
    function setStorage(key, value, user = $.session.UserId) {
      let state = JSON.parse(localStorage.getItem(`anywstate_${user}`));
      if (!state) state = {};
      state[key] = value;
      return localStorage.setItem(`anywstate_${user}`, JSON.stringify(state));
    }
    return {
      getStorage: getStorage,
      setStorage: setStorage,
    };
  })();

  /**
   * Checks if the dates passed are valid and do not overlap each other
   * @param {string} start ISO formated date
   * @param {string} end ISO formated date
   * @returns {boolean} True = valid date range | False = date range invalid or error parsing date
   */
  function checkValidDateRange(start, end) {
    const startDate = Date.parse(start);
    const endDate = Date.parse(end);
    if (isNaN(startDate)) {
      console.error('Start date is not formatted correctly');
      return false;
    }
    if (isNaN(endDate)) {
      console.error('End date is not formatted correctly');
      return false;
    }
    return endDate.getTime() >= startDate.getTime();
  }

  /**
   * Highlights the module in the hamburger menu or side menu, signifying the module is active.
   * @param {string} appName Proper module name
   */
  function toggleMenuItemHighlight(appName) {
    var current = document.querySelector('.menu__button.active');
    var target;

    function toggleHighlight() {
      if (target === current) return;
      if (current) current.classList.remove('active');
      var btn = target.querySelector('.menu__button');
      btn.classList.add('active');
    }

    switch (appName) {
      case 'home': {
        target = document.getElementById('singlebuttondiv');
        break;
      }
      case 'casenotes': {
        target = document.getElementById('casenotessettingsdiv');
        break;
      }
      case 'dayservices': {
        target = document.getElementById('dayservicesettingsdiv');
        break;
      }
      case 'outcomes': {
        target = document.getElementById('goalssettingsdiv');
        break;
      }
      case 'incidenttracking': {
        target = document.getElementById('incidenttrackingsettingsdiv');
        break;
      }
      case 'roster': {
        target = document.getElementById('rostersettingsdiv');
        break;
      }
      case 'schedule': {
        target = document.getElementById('schedulersettingsdiv');
        break;
      }
      case 'timeEntry': {
        target = document.getElementById('singleentrysettingsdiv');
        break;
      }
      case 'workshop': {
        target = document.getElementById('workshopsettingsdiv');
        break;
      }
      case 'reportForms': {
        break;
      }
      case 'authorizations': {
        target = document.getElementById('authorizationsdiv');
        break;
      }
      case 'plan': {
        target = document.getElementById('plansettingsdiv');
        break;
      }
      case 'workflow': {
        target = document.getElementById('workflowsettingsdiv');
        break;
      }
      case 'covid': {
        target = document.getElementById('covidchecklistsettingsdiv');
        break;
      }
      case 'transportation': {
        target = document.getElementById('transportationsettingsdiv');
        break;
      }
      case 'forms': {
        target = document.getElementById('PDFFormssettingsdiv');
        break;
      }
      case 'employment': {
        target = document.getElementById('Employmentsettingsdiv');
        break;
      }
      case 'OOD': {
        target = document.getElementById('OODsettingsdiv');
        break;
      }
      case 'resetPassword': {
        target = document.getElementById('resetPw');
        break;
      }
      case 'ConsumerFinances': {
        target = document.getElementById('consumerfinancessettingsdiv');
        break;
      }
      default: {
        break;
      }
    }

    toggleHighlight();
  }

  return {
    abbreviateDateYear,
    camelize,
    capitalize,
    convertFromMilitary,
    convertToMilitary,
    calculateTotalHours,
    chunkArray,
    checkValidDateRange,
    detectBrowser,
    formatDateToIso,
    formatDateFromIso,
    formatDateFromDateObj,
    formatTimeString,
    formatPhoneNumber,
    findAndSlice,
    getGeoLocation,
    getFormattedDateFromDate,
    getDBDateNow,
    getTodaysDate,
    getCurrentTime,
    getRange,
    iterationCopy,
    leadingZero,
    parseXml,
    removeDecimals,
    removeQuotes,
    toInteger,
    validateTime,
    validateDateFromInput,
    warningPopup,
    removeUnsavableNoteText,
    romanize,
    deromanize,
    LS,
    toggleMenuItemHighlight,
  };
})();

function autoLogout() {
  var isPopupVisible = false;

  function timerIncrement() {
    var timeLimit = parseInt($.session.anywhereMinutestotimeout);
    idleTime++;
    if (idleTime === timeLimit - 1) {
      POPUP.show(logoutPopup);
      isPopupVisible = true;
    }
    if (idleTime === timeLimit) setCookieOnFail('');
  }

  var logoutMessage = `You've been inactive for a while. For security purposes, we will automatically sign you out in approximately 1 minute.`;
  var logoutPopup = POPUP.build({});
  logoutPopup.innerHTML += logoutMessage;

  var idleTime = 0;
  var logoutInterval = setInterval(timerIncrement, 60000);

  document.addEventListener('mousemove', () => {
    if (isPopupVisible) {
      POPUP.hide(logoutPopup);
      isPopupVisible = false;
    }
    idleTime = 0;
    clearInterval(logoutInterval);
    logoutInterval = setInterval(timerIncrement, 60000);
  });
  document.addEventListener('keydown', () => {
    if (isPopupVisible) {
      POPUP.hide(logoutPopup);
      isPopupVisible = false;
    }
    idleTime = 0;
    clearInterval(logoutInterval);
    logoutInterval = setInterval(timerIncrement, 60000);
  });
}
