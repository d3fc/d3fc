import { timeDay, timeSaturday, timeMonday } from 'd3-time';

export const base = (dayAccessor, intervalDay, intervalSaturday, intervalMonday) => {
    // the indices returned by dayAccessor(date)
    const day = {
        sunday: 0,
        monday: 1,
        saturday: 6
    };

    const millisPerDay = 24 * 3600 * 1000;
    const millisPerWorkWeek = millisPerDay * 5;
    const millisPerWeek = millisPerDay * 7;

    const skipWeekends = {};

    const isWeekend = (date) =>
        dayAccessor(date) === 0 || dayAccessor(date) === 6;

    skipWeekends.clampDown = (date) => {
        if (date && isWeekend(date)) {
            // round the date up to midnight
            const newDate = intervalDay.ceil(date);
            // then subtract the required number of days
            if (dayAccessor(newDate) === day.sunday) {
                return intervalDay.offset(newDate, -1);
            } else if (dayAccessor(newDate) === day.monday) {
                return intervalDay.offset(newDate, -2);
            } else {
                return newDate;
            }
        } else {
            return date;
        }
    };

    skipWeekends.clampUp = (date) => {
        if (date && isWeekend(date)) {
            // round the date down to midnight
            const newDate = intervalDay.floor(date);
            // then add the required number of days
            if (dayAccessor(newDate) === day.saturday) {
                return intervalDay.offset(newDate, 2);
            } else if (dayAccessor(newDate) === day.sunday) {
                return intervalDay.offset(newDate, 1);
            } else {
                return newDate;
            }
        } else {
            return date;
        }
    };

    // returns the number of included milliseconds (i.e. those which do not fall)
    // within discontinuities, along this scale
    skipWeekends.distance = function (startDate, endDate) {
        startDate = skipWeekends.clampUp(startDate);
        endDate = skipWeekends.clampDown(endDate);

        // move the start date to the end of week boundary
        const offsetStart = intervalSaturday.ceil(startDate);
        if (endDate < offsetStart) {
            return endDate.getTime() - startDate.getTime();
        }

        const msAdded = offsetStart.getTime() - startDate.getTime();

        // move the end date to the end of week boundary
        const offsetEnd = intervalSaturday.ceil(endDate);
        const msRemoved = offsetEnd.getTime() - endDate.getTime();

        // determine how many weeks there are between these two dates
        // round to account for DST transitions
        const weeks = Math.round((offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek);

        return weeks * millisPerWorkWeek + msAdded - msRemoved;
    };

    skipWeekends.offset = function (startDate, ms) {
        let date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;

        if (ms === 0) {
            return date;
        }

        const isNegativeOffset = ms < 0;
        const isPositiveOffset = ms > 0;
        let remainingms = ms;

        // move to the end of week boundary for a postive offset or to the start of a week for a negative offset
        const weekBoundary = isNegativeOffset ? intervalMonday.floor(date) : intervalSaturday.ceil(date);
        remainingms -= (weekBoundary.getTime() - date.getTime());

        // if the distance to the boundary is greater than the number of ms
        // simply add the ms to the current date
        if ((isNegativeOffset && remainingms > 0) || (isPositiveOffset && remainingms < 0)) {
            return new Date(date.getTime() + ms);
        }

        // skip the weekend for a positive offset
        date = isNegativeOffset ? weekBoundary : intervalDay.offset(weekBoundary, 2);

        // add all of the complete weeks to the date
        const completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
        date = intervalDay.offset(date, completeWeeks * 7);
        remainingms -= completeWeeks * millisPerWorkWeek;

        // add the remaining time
        date = new Date(date.getTime() + remainingms);
        return date;
    };

    skipWeekends.copy = function () { return skipWeekends; };

    return skipWeekends;
};

export default () => base(date => date.getDay(), timeDay, timeSaturday, timeMonday);
