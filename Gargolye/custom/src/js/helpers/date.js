const dates = (function () {
  // PRIVATE
  //------------------------------------
  function toDate(argument) {
    const argStr = Object.prototype.toString.call(argument);

    // Clone the date
    if (argument instanceof Date || (typeof argument === 'object' && argStr === '[object Date]')) {
      return new argument.constructor(argument.getTime());
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument);
    } else {
      return new Date(NaN);
    }
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
  function cloneDate(argument) {
    // if (arguments.length < 1) {
    //   throw new TypeError(`1 argument required, only ${arguments.length} present`);
    // }

    // const argStr = Object.prototype.toString.call(argument);

    // if (argument instanceof Date || (typeof argument === 'object' && argStr === ['object Date'])) {
    //   return new Date(argument.getTime());
    // } else if (typeof argument === 'number' || argStr === ['object Number']) {
    //   return new Date(argument);
    // }
    const argStr = Object.prototype.toString.call(argument);

    // Clone the date
    if (argument instanceof Date || (typeof argument === 'object' && argStr === '[object Date]')) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: TODO find a way to make TypeScript happy about this code
      return new argument.constructor(argument.getTime());
      // return new Date(argument.getTime())
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument);
    } else {
      return new Date(NaN);
    }
  }

  function isValid(dirtyDate) {
    var date = cloneDate(dirtyDate);
    return !isNaN(date);
  }

  // PUBLIC
  //------------------------------------
  // GET
  function getTodaysDateObj() {
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);
    return todaysDate;
  }
  function getTodaysDateISOString() {
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);
    const dd = todaysDate.getDate();
    const mm = todaysDate.getMonth() + 1;
    const yyyy = todaysDate.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
  function getDaysInMonth(dirtyDate) {
    var date = cloneDate(dirtyDate);
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }
  // ADD
  function addDays(dirtyDate, dirtyAmount) {
    var date = cloneDate(dirtyDate);
    var amount = toInteger(dirtyAmount);
    date.setDate(date.getDate() + amount);
    return date;
  }
  function addWeeks(date, amount) {
    const days = amount * 7;
    return addDays(date, days);
  }
  function addMonths(dirtyDate, dirtyAmount) {
    var date = cloneDate(dirtyDate);
    var amount = toInteger(dirtyAmount);
    var desiredMonth = date.getMonth() + amount;
    var dateWithDesiredMonth = new Date(0);
    dateWithDesiredMonth.setFullYear(date.getFullYear(), desiredMonth, 1);
    dateWithDesiredMonth.setHours(0, 0, 0, 0);
    var daysInMonth = getDaysInMonth(dateWithDesiredMonth);
    // Set the last day of the new month
    // if the original date was the last day of the longer month
    date.setMonth(desiredMonth, Math.min(daysInMonth, date.getDate()));
    return date;
  }
  function addYears(dirtyDate, dirtyAmount) {
    var amount = toInteger(dirtyAmount);
    return addMonths(dirtyDate, amount * 12);
  }
  // SUB
  function subDays(dirtyDate, dirtyAmount) {
    var amount = toInteger(dirtyAmount);
    return addDays(dirtyDate, -amount);
  }
  function subWeeks(date, amount) {
    return addWeeks(date, -amount);
  }
  function subYears(dirtyDate, dirtyAmount) {
    var amount = toInteger(dirtyAmount);
    return addYears(dirtyDate, -amount);
  }
  // WEEKS
  function endOfWeek(dirtyDate, dirtyOptions) {
    //Get the end of the week for given date
    /**
     * @name endOfWeek
     * @param {Date|Number} dirtyDate
     * @param {Object} dirtyOptions
     * @param {0|1|2|3|4|5|6} [weekStartsOn=0]
     */

    if (arguments.length < 1) {
      throw new TypeError(`1 argument required, but only ${arguments.length} present`);
    }

    let options = dirtyOptions || {};

    const weekStartsOn =
      options.weekStartsOn === null || options.weekStartsOn === undefined ? 0 : UTIL.toInteger(options.weekStartsOn);

    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError(`weekStartsOn must be between 0 and 6 inclusively`);
    }

    const date = cloneDate(dirtyDate);
    const day = date.getDay();
    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

    date.setDate(date.getDate() + diff);
    date.setHours(23, 59, 59, 999);
    return date;
  }
  function startDayOfWeek(dirtyDate, dirtyOptions) {
    //Get the start date of week
    /**
     * @name startOfWeek
     * @param {Date|Number} dirtyDate
     * @param {Object} dirtyOptions
     * @param {0|1|2|3|4|5|6} [weekStartsOn=0]
     */

    if (arguments.length < 1) {
      throw new TypeError(`1 argument required, but only ${arguments.length} present`);
    }

    let options = dirtyOptions || {};

    const weekStartsOn =
      options.weekStartsOn === null || options.weekStartsOn === undefined ? 0 : util.toInteger(options.weekStartsOn);

    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError(`weekStartsOn must be between 0 and 6 inclusively`);
    }

    const date = cloneDate(dirtyDate);
    const day = date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  // COMPARE
  function isAfter(dirtyDate, dirtyDateToCompare) {
    if (arguments.length < 2) {
      throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }

    var date = cloneDate(dirtyDate);
    var dateToCompare = cloneDate(dirtyDateToCompare);
    return date.getTime() > dateToCompare.getTime();
  }
  function isBefore(dirtyDate, dirtyDateToCompare) {
    if (arguments.length < 2) {
      throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }

    var date = cloneDate(dirtyDate);
    var dateToCompare = cloneDate(dirtyDateToCompare);
    return date.getTime() < dateToCompare.getTime();
  }
  function isEqual(dirtyLeftDate, dirtyRightDate) {
    if (arguments.length < 2) {
      throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }

    var dateLeft = cloneDate(dirtyLeftDate);
    var dateRight = cloneDate(dirtyRightDate);
    return dateLeft.getTime() === dateRight.getTime();
  }
  function isDateInCurrentWeek(dirtyDate) {
    const date = cloneDate(dirtyDate);
    date.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const curentWeekStart = startDayOfWeek(currentDate);
    const curentWeekEnd = endOfWeek(currentDate);

    if (isAfter(date, curentWeekStart) && isBefore(date, curentWeekEnd)) {
      return true;
    }

    return false;
  }
  function isDateInFuture(dirtyDate) {
    const date = cloneDate(dirtyDate);
    date.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (isAfter(date, currentDate)) {
      return true;
    }

    return false;
  }
  // FORMAT
  function checkFormat(dateString) {
    // Regex pattern for ISO date format (YYYY-MM-DD)
    const isoFormatPattern = /^\d{4}-\d{2}-\d{2}$/;
    // Adjusted Regex pattern for Standard format (M/D/YYYY or MM/DD/YYYY)
    const standardFormatPattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    if (isoFormatPattern.test(dateString)) {
      return 'ISO';
    } else if (standardFormatPattern.test(dateString)) {
      return 'Standard';
    } else {
      return 'Unknown format';
    }
  }
  function formatISO(dirtyDate, dirtyOptions) {
    if (arguments.length < 1) {
      throw new TypeError(`1 argument required, but only ${arguments.length} present`);
    }

    const originalDate = cloneDate(dirtyDate);

    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value');
    }

    const options = dirtyOptions || {};
    const format = options.format == null ? 'extended' : String(options.format);
    const representation = options.representation == null ? 'complete' : String(options.representation);

    if (format !== 'extended' && format !== 'basic') {
      throw new RangeError("format must be 'extended' or 'basic'");
    }

    if (representation !== 'date' && representation !== 'time' && representation !== 'complete') {
      throw new RangeError("representation must be 'date', 'time', or 'complete'");
    }

    let result = '';
    let tzOffset = '';

    const dateDelimiter = format === 'extended' ? '-' : '';
    const timeDelimiter = format === 'extended' ? ':' : '';

    // Representation is either 'date' or 'complete'
    if (representation !== 'time') {
      const day = UTIL.leadingZero(originalDate.getDate(), 2);
      const month = UTIL.leadingZero(originalDate.getMonth() + 1, 2);
      const year = UTIL.leadingZero(originalDate.getFullYear(), 4);

      // yyyyMMdd or yyyy-MM-dd.
      result = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`;
    }

    // Representation is either 'time' or 'complete'
    if (representation !== 'date') {
      // Add the timezone.
      const offset = originalDate.getTimezoneOffset();

      if (offset !== 0) {
        const absoluteOffset = Math.abs(offset);
        const hourOffset = UTIL.leadingZero(Math.floor(absoluteOffset / 60), 2);
        const minuteOffset = UTIL.leadingZero(absoluteOffset % 60, 2);
        // If less than 0, the sign is +, because it is ahead of time.
        const sign = offset < 0 ? '+' : '-';

        tzOffset = `${sign}${hourOffset}:${minuteOffset}`;
      } else {
        tzOffset = 'Z';
      }

      const hour = UTIL.leadingZero(originalDate.getHours(), 2);
      const minute = UTIL.leadingZero(originalDate.getMinutes(), 2);
      const second = UTIL.leadingZero(originalDate.getSeconds(), 2);

      // If there's also date, separate it with time with 'T'
      const separator = result === '' ? '' : 'T';

      // Creates a time string consisting of hour, minute, and second, separated by delimiters, if defined.
      const time = [hour, minute, second].join(timeDelimiter);

      // HHmmss or HH:mm:ss.
      result = `${result}${separator}${time}${tzOffset}`;
    }

    return result;
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
  function formateToISO(dirtyDate) {
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
  function formateToStandard(dirtyDate, joinBy, opts) {
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
  // INTERVALS
  function eachDayOfInterval(interval, options) {
    const startDate = toDate(interval.start);
    const endDate = toDate(interval.end);

    const endTime = endDate.getTime();

    // Throw an exception if start date is after end date or if any date is `Invalid Date`
    if (!(startDate.getTime() <= endTime)) {
      throw new RangeError('Invalid interval');
    }

    const dates = [];

    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    const step = options?.step ?? 1;
    if (step < 1 || isNaN(step)) throw new RangeError('`options.step` must be a number greater than 1');

    while (currentDate.getTime() <= endTime) {
      dates.push(toDate(currentDate));
      currentDate.setDate(currentDate.getDate() + step);
      currentDate.setHours(0, 0, 0, 0);
    }

    return dates;
  }

  // TIME
  //----------------------------------------------------------------
  /**
   * Converts a 24hr time to 12hr standard time.
   *
   * @function
   * @param {string} time Time you would like to convert
   * @returns {string} Converted time
   */
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
   *
   * @function
   * @param {string} time Time you would like to convert
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
   * Formats the time as HH:MM:SS from a given number of seconds.
   *
   * @param {number} totalSeconds - The total number of seconds to format.
   * @return {string} - The formatted time string.
   */
  function formatSecondsToFullTime(totalSeconds) {
    if (!totalSeconds) return '00:00:00';
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    var seconds = totalSeconds % 60;

    return [_UTIL.padNumberWithZero(hours), _UTIL.padNumberWithZero(minutes), _UTIL.padNumberWithZero(seconds)].join(
      ':',
    );
  }
  /**
   * Calculates the time difference between two military time values.
   *
   * @param {string} startTime - The start time in military format (e.g., "14:00").
   * @param {string} endTime - The end time in military format (e.g., "16:30").
   * @param {boolean} [format=true] - If true, returns the time difference formatted as a string with hours and minutes.
   *                                 If false, returns only the total minutes as a formatted string.
   * @returns {string} The time difference as a formatted string. If `format` is true, the difference is returned
   *                   in terms of hours and minutes (e.g., "2 hrs 30 mins"). If `format` is false, the difference
   *                   is returned as total minutes (e.g., "150 mins").
   *
   * @example
   * // Returns "2 hrs 30 mins"
   * getMilitaryTimeDifference("14:00", "16:30", true);
   *
   * @example
   * // Returns "150 mins"
   * getMilitaryTimeDifference("14:00", "16:30", false);
   */
  function getMilitaryTimeDifference(startTime, endTime, format = true) {
    const startDate = new Date(`1970-01-01T${startTime}`);
    const endDate = new Date(`1970-01-01T${endTime}`);

    const timeDifference = endDate - startDate;

    // Calculate total time in minutes
    const totalMinutes = Math.floor(timeDifference / 60000);

    if (format) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const formattedTime = [];
      if (hours > 0) {
        formattedTime.push(`${hours} ${hours === 1 ? 'hr' : 'hrs'}`);
      }
      if (minutes > 0) {
        formattedTime.push(`${minutes} ${minutes === 1 ? 'min' : 'mins'}`);
      }

      return formattedTime.join(' ');
    } else {
      // Return total minutes in formatted string
      return `${totalMinutes} ${totalMinutes === 1 ? 'min' : 'mins'}`;
    }
  }
  /**
   *
   * @param {*} date
   * @returns
   */
  function removeTimestamp(date) {
    const splitDate = date.split(' ');
    return `${splitDate[0]}`;
  }

  return {
    getTodaysDateObj,
    getTodaysDateISOString,
    getDaysInMonth,
    addDays,
    addWeeks,
    addMonths,
    addYears,
    subDays,
    subWeeks,
    subYears,
    endOfWeek,
    startDayOfWeek,
    isAfter,
    isBefore,
    isEqual,
    isDateInCurrentWeek,
    isDateInFuture,
    checkFormat,
    formatISO,
    formateToISO,
    formateToStandard,
    eachDayOfInterval,
    // TIME
    convertFromMilitary,
    convertToMilitary,
    formatSecondsToFullTime,
    getMilitaryTimeDifference,
    removeTimestamp,
  };
})();
