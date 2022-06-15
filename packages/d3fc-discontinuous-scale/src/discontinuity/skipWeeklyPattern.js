import * as d3 from 'd3';

const millisPerDay = 24 * 3600 * 1000;
const dayBoundary = "00:00:00.000";
const SOD = 'SOD';
const EOD = 'EOD';

/**
 * Returns the [hh, mm, ss, ms] time components of a time string'
 * @param {string} timeString time string formatted as 'hh:mm:ss.fff';
 * @returns { int[] }
 */
const getTimeComponentArray = (timeString) => [timeString.slice(0, 2), timeString.slice(3, 5), timeString.slice(6, 8), timeString.slice(9, 12)];

/**
 * Object that helps with working with time strings and dates
 * @typedef { Object } TimeHelper
 * @property { function(Date): string } getTimeString - get's the time string for date as 'hh:mm:ss.fff'
 * @property { function(Date , string, number): Date } setTime - set the time  for date as
 * @property { function(Date): Date } setToStartOfNextDay - returns the start of the next day i.e. 00:00:00.000
 * @property { function(Date): Date } setToEndOfPreviousDay - returns the 'End' of the previous day i.e. one ms before midnight
 */

export const utcTimeHelper = {
    /**
     * Returns the UTC time part of a given Date instance as 'hh:mm:ss.fff'
     * @param {Date} date - Data instance
     * @returns {string} time string.
     */
    getTimeString: date => `${date.getUTCHours().toString(10).padStart(2, '0')}:${date.getUTCMinutes().toString(10).padStart(2, '0')}:${date.getUTCSeconds().toString(10).padStart(2, '0')}.${date.getUTCMilliseconds().toString(10).padStart(3, '0')}`,

    /**
     * Returns the combined UTC date and time string
     * @param {Date} date - Data instance
     * @param {string} timeString - string as 'hh:mm:ss.fff'
     * @param {number} offsetInmilliSeconds - additional offset in millisends. Default = 0; e.g. -1 is one millisecond before time specified by timeString;
     * @returns {Date} - combined date and time.
     */
    setTime: (date, timeString, offsetInmilliSeconds = 0) => {
        const [hh, mm, ss, ms] = getTimeComponentArray(timeString);
        return d3.utcMillisecond.offset(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hh, mm, ss, ms)), offsetInmilliSeconds);
    },

    /**
     * Returns the start of the next day i.e. 00:00:00.000
     * @param {Date} date - Data instance
     * @returns {Date}.
     */
    setToStartOfNextDay: (date) => d3.utcDay.offset(d3.utcDay.floor(date), 1),

    /**
     * Returns the end of the previous day (1ms before midnight) i.e.  23:59:59.999
     * @param {Date} date - Data instance
     * @returns {Date}.
     */
    setToEndOfPreviousDay: (date) => d3.utcMillisecond.offset(d3.utcDay.floor(date), -1),

    dayInterval: d3.utcDay,

    msInterval: d3.utcMillisecond
}

export const localTimeHelper = {
    /**
     * Returns the local time part of a given Date instance as 'hh:mm:ss.fff'
     * @param {Date} date - Data instance
     * @returns {string} time string.
     */
    getTimeString: date => `${date.getHours().toString(10).padStart(2, '0')}:${date.getMinutes().toString(10).padStart(2, '0')}:${date.getSeconds().toString(10).padStart(2, '0')}.${date.getMilliseconds().toString(10).padStart(3, '0')}`,

    /**
     * Returns the combined local date and time string
     * @param {Date} date - Data instance
     * @param {string} timeString - string as 'hh:mm:ss.fff'
     * @param {number} offsetInmilliSeconds - additional offset in millisends. Default = 0; e.g. -1 is one millisecond before time specified by timeString;
     * @returns {Date} - combined date and time.
     */
    setTime: (date, timeString, offsetInmilliSeconds = 0) => {
        const [hh, mm, ss, ms] = getTimeComponentArray(timeString);
        return d3.timeMillisecond.offset(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, ss, ms), offsetInmilliSeconds);
    },

    /**
     * Returns the start of the next day i.e. 00:00:00.000
     * @param {Date} date - Data instance
     * @returns {Date}.
     */
    setToStartOfNextDay: (date) => d3.timeDay.offset(d3.timeDay.floor(date), 1),

    /**
     * Returns the end of the previous day (1ms before midnight) i.e.  23:59:59.999
     * @param {Date} date - Data instance
     * @returns {Date}.
     */
    setToEndOfPreviousDay: (date) => d3.timeMillisecond.offset(d3.timeDay.floor(date), -1),

    dayInterval: d3.timeDay,

    msInterval: d3.timeMillisecond
}

/**
 * Attempts to parse and format a time string into a fixed lenght string 'hh:mm:ss.fff'
 * @param {string} timeString - string representation of time 'hh:mm:ss.fff' e.g. '09:30' or '00:00:00.000'
 * @returns {int[]} array of parsed time components [hh, mm, ss, ms] or throws.
 */
export function standardiseTimeString(timeString) {

    if (arguments.length !== 1 || typeof timeString !== 'string') {
        throw 'Expected single argument of type string'
    }

    const isPositiveIntegerUpTo = (toCheck, upperBound) => {
        if (!Number.isInteger(toCheck))
            return false;

        return toCheck >= 0 && toCheck <= upperBound;
    }

    const result = [0, 0, 0, 0];
    const time_components = timeString.split(":");

    if (time_components.length < 2 || time_components.length > 3) {
        throw 'Expected an argument wiht 2 or 3 colon delimited parts.'
    }

    result[0] = isPositiveIntegerUpTo(parseInt(time_components[0], 10), 23)
        ? parseInt(time_components[0], 10)
        : function () { throw `'Hours' component must be an int between 0 and 23, but was '${time_components[0]}'`; }();

    result[1] = isPositiveIntegerUpTo(parseInt(time_components[1], 10), 59)
        ? parseInt(time_components[1], 10)
        : function () { throw `'Minutes' component must be an int between 0 and 59, but was '${time_components[1]}'`; }();

    if (time_components.length === 3) {
        const ms_components = time_components[2].split(".").map(x => parseInt(x, 10));

        result[2] = isPositiveIntegerUpTo(ms_components[0], 59)
            ? ms_components[0]
            : function () { throw `'Seconds' component must be an int between 0 and 59, but was '${ms_components[0]}'`; }();

        if (ms_components.length === 2) {
            result[3] = isPositiveIntegerUpTo(ms_components[1], 999)
                ? ms_components[1]
                : function () { throw `'Miliseconds' component must be an int between 0 and 999, but was '${ms_components[1]}'`; }();
        }
    }

    return `${result[0].toString(10).padStart(2, '0')}:${result[1].toString(10).padStart(2, '0')}:${result[2].toString(10).padStart(2, '0')}.${result[3].toString(10).padStart(3, '0')}`;
}

/**
 * @typedef { Object } nonTradingTimeRange
 * @property { string } startTime - Start time string with fixed format 'hh:mm:ss.fff'
 * @property { string } endTime - End time string with fixed format 'hh:mm:ss.fff'
 * @property { int } lenghtInMs - UTC Time range length in MS
 */

/**
 * Represents a single continous Non-Trading UTC time interval within a single day. You must denote day boundries as:
 * SOD - start of day 
 * EOD  - end of day
 * @constructor
 * @param { string[] } timeRangeTuple - UTC time range as a tuple of time strings e.g. ["07:45", "08:30"), ["SOD", "08:30:20") or ["19:00:45.500", "EOD").
 * @param { TimeHelper } timeHelper
 * @returns { nonTradingTimeRange }
 */
export function nonTradingTimeRange(timeRangeTuple, timeHelper) {

    if (arguments.length != 2 ||
        !Array.isArray(timeRangeTuple)
        || timeRangeTuple.length !== 2
        || typeof timeRangeTuple[0] !== 'string'
        || typeof timeRangeTuple[1] !== 'string') {
        throw `Expected argument is a single string[] of length 2.`
    }

    if (timeRangeTuple[0] === SOD) {
        timeRangeTuple[0] = dayBoundary;
    }

    if (timeRangeTuple[1] === EOD) {
        timeRangeTuple[1] = dayBoundary;
    }

    const startTime = standardiseTimeString(timeRangeTuple[0]);
    const endTime = standardiseTimeString(timeRangeTuple[1]);

    if (endTime !== dayBoundary && startTime > endTime) {
        throw `Time range start time '${startTime}' must be before end time '${endTime}' or both must equal ${dayBoundary}`
    }

    const lenghtInMs = timeHelper.setTime(new Date(endTime === dayBoundary ? millisPerDay : 0), endTime) - timeHelper.setTime(new Date(0), startTime)
    const instance = { startTime, endTime, lenghtInMs };

    /**
     * Returns if given date's time portion is within this discontinuity time range instance
     * @param { Date } date - date
     * @returns { boolean }
     */
    instance.isInRange = (date) => {
        const time = timeHelper.getTimeString(date);

        if (instance.startTime <= time
            && (instance.endTime === dayBoundary || instance.endTime > time))
            return true;

        return false;
    }

    return instance;
}

/**
 * Represents a Trading day
 * @param { string[][] } rawDicontinuityTimeRanges - Array of non-trading time ranges within the day
 */
export const tradingDay = (rawDicontinuityTimeRanges, timeHelper) => {
    const nonTradingTimeRanges = rawDicontinuityTimeRanges
        .map(rawRange => nonTradingTimeRange(rawRange, timeHelper))
        .sort((a, b) => a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0);
    const totalTradingTimeInMiliseconds = millisPerDay - nonTradingTimeRanges.reduce((total, range) => total + range.lenghtInMs, 0);

    const totalTradingMillisecondsBetween = (intervalStart, intervalEnd) => {

        if (intervalStart.getTime() === intervalEnd.getTime()) {
            return 0;
        }

        // ensure arguments are on the same day or intervalEnd is at most the start of the next day
        if (timeHelper.dayInterval(intervalStart).getTime() !== timeHelper.dayInterval(intervalEnd).getTime()
            && timeHelper.setToStartOfNextDay(intervalStart).getTime() !== intervalEnd.getTime()) {
            throw `tradingDay.totalTradingMillisecondsBetween arguments must be on the same day or intervalEnd must be the start of the next day instead: intervalStart: '${intervalStart}'; intervalEnd: '${intervalEnd}'`
        }

        let total = 0;

        for (const nonTradingRange of nonTradingTimeRanges) {
            const startTime = timeHelper.setTime(intervalStart, nonTradingRange.startTime);
            const endTime = nonTradingRange.endTime === dayBoundary
                ? timeHelper.setToStartOfNextDay(intervalStart)
                : timeHelper.setTime(intervalStart, nonTradingRange.endTime);

            // both intervalStart and intervalEnd are before the start of this non-trading range
            if (startTime > intervalStart && startTime > intervalEnd) {
                return total + (+intervalEnd - intervalStart);
            }

            // intervalStart is before the start of this non-trading time range
            if (startTime > intervalStart) {
                total += (+startTime - intervalStart);
            }

            if (endTime > intervalEnd) {
                return total;
            }

            intervalStart = endTime;
        }

        return (total + (+intervalEnd - intervalStart));
    }

    const offset = (date, ms) => {

        if (ms === 0) {
            return [date, ms];
        }

        let offsetDate = timeHelper.msInterval.offset(date, ms);

        const nonTradingRanges = (ms > 0)
            ? nonTradingTimeRanges.filter(range => timeHelper.setTime(date, range.startTime) >= date)
            : nonTradingTimeRanges.filter(range => timeHelper.setTime(date, range.startTime) < date).reverse();

        if (nonTradingRanges.length === 0) {
            return [timeHelper.msInterval.offset(date, ms), 0];
        }

        if (ms > 0) {
            for (const nonTradingRange of nonTradingRanges) {

                const rangeStart = timeHelper.setTime(date, nonTradingRange.startTime);

                if (rangeStart <= offsetDate) {
                    ms -= (rangeStart - date);
                    date = nonTradingRange.endTime === dayBoundary
                        ? timeHelper.setToStartOfNextDay(date)
                        : timeHelper.setTime(date, nonTradingRange.endTime);
                    offsetDate = timeHelper.msInterval.offset(date, ms);
                } else {
                    ms -= (offsetDate - date);
                    break;
                }
            }
        } else {

            for (const nonTradingRange of nonTradingRanges) {
                const endTime = nonTradingRange.endTime === dayBoundary
                    ? timeHelper.setToStartOfNextDay(date)
                    : timeHelper.setTime(date, nonTradingRange.endTime);

                if (endTime > offsetDate) {
                    ms += (date - endTime) + 1;
                    date = timeHelper.msInterval.offset(timeHelper.setTime(date, nonTradingRange.startTime), - 1);
                    offsetDate = timeHelper.msInterval.offset(date, ms);
                } else {
                    ms += (date - offsetDate);
                    break;
                }
            }
        }

        if (ms !== 0) {
            throw 'tradingDay.offset was called with an offset that spans more than a day';
        }

        return [offsetDate, ms];
    }

    return { totalTradingTimeInMiliseconds, nonTradingTimeRanges, totalTradingMillisecondsBetween, offset };
}

/**
 * Discontinuity provider implemenation that works with 'non-trading' periods during a trading day
 * @typedef { Object } WeeklyPatternDiscontinuityProvider
 * @property { function(Date): Date } clampUp - When given a value, if it falls within a discontinuity (i.e. an excluded domain range) it should be shifted forwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
 * @property { function(Date): Date } clampDown - When given a value, if it falls within a discontinuity it should be shifted backwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
 * @property { function(Date, Date): number } distance - When given a pair of values, this function returns the distance between the, in domain units, minus any discontinuities. discontinuities.
 * @property { function(Date, number): Date } offset - When given a value and an offset, the value should be advanced by the offset value, skipping any discontinuities, to return the final value.
 * @property { function(): WeeklyPatternDiscontinuityProvider } copy - Creates a copy of the discontinuity provider.
  */

/**
 * Creates WeeklyPatternDiscontinuityProvider
 * @param {Object} nonTradingPattern - contains raw 'non-trading' time ranges for each day of the week
 * @param {TimeHelper} timeHelper - uses local or utc dates
 * @returns { WeeklyPatternDiscontinuityProvider } WeeklyPatternDiscontinuityProvider
 */
export const base = (nonTradingPattern, timeHelper) => {

    const tradingDays = [
        tradingDay(nonTradingPattern['Sunday'], timeHelper),
        tradingDay(nonTradingPattern['Monday'], timeHelper),
        tradingDay(nonTradingPattern['Tuesday'], timeHelper),
        tradingDay(nonTradingPattern['Wednesday'], timeHelper),
        tradingDay(nonTradingPattern['Thursday'], timeHelper),
        tradingDay(nonTradingPattern['Friday'], timeHelper),
        tradingDay(nonTradingPattern['Saturday'], timeHelper)]

    const totalTradingWeekMilliseconds = tradingDays.reduce((total, tradingDay) => total + tradingDay.totalTradingTimeInMiliseconds, 0)

    const instance = { tradingDays, totalTradingWeekMilliseconds };

    /**
     * When given a value falls within a discontinuity (i.e. an excluded domain range) it should be shifted forwards to the discontinuity boundary. 
     * Otherwise, it should be returns unchanged.
     * @param {Date} date - date to clamp up
     * @returns {Date}
     */
    instance.clampUp = (date) => {
        const tradingDay = tradingDays[date.getDay()];

        for (let i = 0; i < tradingDay.nonTradingTimeRanges.length; i++) {
            if (tradingDay.nonTradingTimeRanges[i].isInRange(date)) {

                return tradingDay.nonTradingTimeRanges[i].endTime === dayBoundary
                    ? instance.clampUp(timeHelper.setToStartOfNextDay(date))
                    : timeHelper.setTime(date, tradingDay.nonTradingTimeRanges[i].endTime);
            }
        }
        return date;
    }

    /** 
     * When given a value, if it falls within a discontinuity it should be shifted backwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
     * @param {Date} date - date to clamp down
     * @returns {Date}
    */
    instance.clampDown = (date) => {
        const tradingDay = tradingDays[date.getDay()];

        for (let i = 0; i < tradingDay.nonTradingTimeRanges.length; i++) {
            if (tradingDay.nonTradingTimeRanges[i].isInRange(date)) {

                return tradingDay.nonTradingTimeRanges[i].startTime === dayBoundary
                    ? instance.clampDown(timeHelper.setToEndOfPreviousDay(date))
                    : timeHelper.setTime(date, tradingDay.nonTradingTimeRanges[i].startTime, -1);
            }
        }
        return date;
    }

    /**
     * When given a pair of values, this function returns the distance between the, in domain units, minus any discontinuities. discontinuities.
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @returns {number} - the number of milliseconds between the dates
     */
    instance.distance = (startDate, endDate) => {

        const sortChronologically = (start, end) => {
            return start < end
                ? [start, end, 1]
                : [end, start, -1]
        }

        let [start, end, factor] = sortChronologically(startDate, endDate);

        // same day distance
        if (timeHelper.dayInterval.floor(start) === timeHelper.dayInterval.floor(end)) {
            return instance.tradingDays[start.getDay()].totalTradingMillisecondsBetween(start, end);
        }

        // combine any trading time left in the day after startDate 
        // and any trading time from midnight up until the endDate
        let total = instance.tradingDays[start.getDay()].totalTradingMillisecondsBetween(start, timeHelper.dayInterval.offset(timeHelper.dayInterval(start), 1)) +
            instance.tradingDays[end.getDay()].totalTradingMillisecondsBetween(timeHelper.dayInterval(end), end)

        // startDate and endDate are consecutive days    
        if (timeHelper.dayInterval.count(start, end) === 1) {
            return total;
        }

        // move the start date to following day
        start = timeHelper.dayInterval.offset(timeHelper.dayInterval(start), 1);
        // remove 'time component' from endDate
        end = timeHelper.dayInterval.ceil(end);

        return factor * timeHelper.dayInterval.range(start, end)
            .reduce((runningTotal, currentDay, currentIndex, arr) => {

                const nextDay = currentIndex < arr.length - 1
                    ? arr[currentIndex + 1]
                    : timeHelper.dayInterval.offset(currentDay, 1);
                const isDstBoundary = (nextDay - currentDay) !== millisPerDay;
                const tradingDay = instance.tradingDays[currentDay.getDay()];
                return runningTotal += isDstBoundary
                    ? tradingDay.totalTradingMillisecondsBetween(currentDay, nextDay)
                    : tradingDay.totalTradingTimeInMiliseconds;

            }, total)

        // works out totalTradingMilliseconds for each day 
        // the 
        return factor * timeHelper.dayInterval.range(start, end)
            .reduce((runningTotal, day) => {
                runningTotal += instance.tradingDays[day.getDay()].totalTradingMillisecondsBetween(day, timeHelper.dayInterval.offset(day, 1))
            }, total);
    }

    /**
     * When given a value and an offset in milliseconds, the value should be advanced by the offset value, skipping any discontinuities, to return the final value.
     * @param {Date} date 
     * @param {number} ms 
     */
    instance.offset = (date, ms) => {

        const isDstBoundary = (d) => (timeHelper.dayInterval.offset(d) - d) !== millisPerDay;

        const moveToDayBoundary = (tradingDay, date, ms) => {

            if (ms < 0) {
                const dateFloor = timeHelper.dayInterval(date);
                const distanceToStartOfDay = tradingDay.totalTradingMillisecondsBetween(dateFloor, date);

                return Math.abs(ms) <= distanceToStartOfDay
                    ? tradingDay.offset(date, ms)
                    : [instance.clampDown(timeHelper.msInterval.offset(dateFloor, -1)), ms + distanceToStartOfDay + 1];

            } else {
                const nextDate = timeHelper.setToStartOfNextDay(date);
                const distanceToDayBoundary = tradingDay.totalTradingMillisecondsBetween(date, nextDate);

                return ms < distanceToDayBoundary
                    ? tradingDay.offset(date, ms)
                    : [nextDate, ms - distanceToDayBoundary];
            }
        }

        if (ms === 0)
            return date;

        const moveDateDelegate = ms < 0
            ? (date, remainingMs, tradingDayMs) => [timeHelper.dayInterval.offset(date, -1), remainingMs + tradingDayMs]
            : (date, remainingMs, tradingDayMs) => [timeHelper.dayInterval.offset(date), remainingMs - tradingDayMs];

        let tradingDay = instance.tradingDays[date.getDay()];
        [date, ms] = moveToDayBoundary(tradingDay, date, ms);
        while (ms !== 0) {
            tradingDay = instance.tradingDays[date.getDay()];
            if (isDstBoundary(date)) {
                [date, ms] = moveToDayBoundary(tradingDay, date, ms);
            } else {
                [date, ms] = Math.abs(ms) >= tradingDay.totalTradingTimeInMiliseconds
                    ? moveDateDelegate(date, ms, tradingDay.totalTradingTimeInMiliseconds)
                    : moveToDayBoundary(tradingDay, date, ms);
            }
        }

        return date;
    }

    instance.copy = () => instance;

    return instance;
}