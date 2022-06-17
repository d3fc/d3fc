/**
 * Object that helps with working with time strings and dates
 * @typedef { Object } DateTimeUtility
 * @property { function(Date): string } getTimeString - get's the time string for date as 'hh:mm:ss.fff'
 * @property { function(Date , string, number): Date } setTime - set the time  for date as
 * @property { function(Date): Date } getStartOfNextDay - returns the start of the next day i.e. 00:00:00.000
 * @property { function(Date): Date } getEndOfPreviousDay - returns the 'End' of the previous day i.e. one ms before midnight
 */

/**
 * 
 * @param {function(Date, number, number, number, number): Date } setTimeForDate - sets a time on a Date object given hh, mm, ss & ms time compononets
 * @param {function(Date): number } getDay 
 * @param {function(Date): number[] } getTimeComponentArray 
 * @param {function} dayInterval - d3-time timeDay or utcDay
 * @param {function} msInterval - d3-time timeMillisecond or utcMillisecond
  * @returns {DateTimeUtility}
 */
export const dateTimeUtility = (setTimeForDate, getDay, getTimeComponentArray, dayInterval, msInterval) => {
    const utility = {};
    utility.getTimeComponentArrayFromString = (timeString) => [timeString.slice(0, 2), timeString.slice(3, 5), timeString.slice(6, 8), timeString.slice(9, 12)];
    /**
        * Returns the local time part of a given Date instance as 'hh:mm:ss.fff'
        * @param {Date} date - Data instance
        * @returns {string} time string.
        */
    utility.getTimeString = date => {
        const [hh, mm, ss, ms] = getTimeComponentArray(date).map(x => x.toString(10).padStart(2, '0'));
        return `${hh}:${mm}:${ss}.${ms.padStart(3, '0')}`;
    };

    /**
     * Returns the combined local date and time string
     * @param {Date} date - Data instance
     * @param {string} timeString - string as 'hh:mm:ss.fff'
     * @param {number} offsetInmilliSeconds - additional offset in millisends. Default = 0; e.g. -1 is one millisecond before time specified by timeString;
     * @returns {Date} - combined date and time.
     */
    utility.setTime = (date, timeString, offsetInmilliSeconds = 0) => {
        const [hh, mm, ss, ms] = utility.getTimeComponentArrayFromString(timeString);
        return msInterval.offset(setTimeForDate(date, hh, mm, ss, ms), offsetInmilliSeconds);
    };

    /**
     * Returns the start of the next day i.e. 00:00:00.000
     * @param {Date} date - Data instance
     * @returns {Date}.
     */
    utility.getStartOfNextDay = (date) => dayInterval.offset(dayInterval.floor(date), 1);

    /**
     * Returns the end of the previous day (1ms before midnight) i.e.  23:59:59.999
     * @param {Date} date - Data instance
     * @returns {Date}.
     */
    utility.getEndOfPreviousDay = (date) => msInterval.offset(dayInterval.floor(date), -1);

    utility.dayInterval = dayInterval;
    utility.msInterval = msInterval;
    utility.getDay = getDay;

    return utility;
};