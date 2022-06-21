import { EOD, SOD, dayBoundary, millisPerDay } from './constants';

/**
 * Attempts to parse and format a time string into a fixed lenght string 'hh:mm:ss.fff'
 * @param {string} timeString - string representation of time 'hh:mm:ss.fff' e.g. '09:30' or '00:00:00.000'
 * @returns {int[]} array of parsed time components [hh, mm, ss, ms] or throws.
 */
export function standardiseTimeString(timeString) {

    if (arguments.length !== 1 || typeof timeString !== 'string') {
        throw 'Expected single argument of type string';
    }

    const isPositiveIntegerUpTo = (toCheck, upperBound) => {
        if (!Number.isInteger(toCheck))
            return false;

        return toCheck >= 0 && toCheck <= upperBound;
    };

    const result = [0, 0, 0, 0];
    const time_components = timeString.split(":");

    if (time_components.length < 2 || time_components.length > 3) {
        throw 'Expected an argument wiht 2 or 3 colon delimited parts.';
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
 * @property { int } lenghtInMs - Absolute length in MS i.e. only valid on non-Daylight saving boundaries
 */

/**
 * Represents a single continous Non-Trading time interval within a single day. You must denote day boundries as:
 * SOD - start of day 
 * EOD  - end of day
 * @constructor
 * @param { string[] } timeRangeTuple - Time range as a tuple of time strings e.g. ["07:45", "08:30"), ["SOD", "08:30:20") or ["19:00:45.500", "EOD").
 * @param { import('./dateTimeUtility').DateTimeUtility } dateTimeUtility
 * @returns { nonTradingTimeRange }
 */
export function nonTradingTimeRange(timeRangeTuple, dateTimeUtility) {

    if (arguments.length != 2 ||
        !Array.isArray(timeRangeTuple)
        || timeRangeTuple.length !== 2
        || typeof timeRangeTuple[0] !== 'string'
        || typeof timeRangeTuple[1] !== 'string') {
        throw `Expected argument is a single string[] of length 2.`;
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
        throw `Time range start time '${startTime}' must be before end time '${endTime}' or both must equal ${dayBoundary}`;
    }

    const lenghtInMs = dateTimeUtility.setTime(new Date(endTime === dayBoundary ? millisPerDay : 0), endTime) - dateTimeUtility.setTime(new Date(0), startTime);
    const instance = { startTime, endTime, lenghtInMs };

    /**
     * Returns if given date's time portion is within this discontinuity time range instance
     * @param { Date } date - date
     * @returns { boolean }
     */
    instance.isInRange = (date) => {
        const time = dateTimeUtility.getTimeString(date);

        if (instance.startTime <= time
            && (instance.endTime === dayBoundary || instance.endTime > time)) {
            return true;
        }

        return false;
    };

    return instance;
}