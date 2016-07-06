import {timeDay, timeSaturday, timeMonday} from 'd3-time';

export default function() {
    const millisPerDay = 24 * 3600 * 1000;
    const millisPerWorkWeek = millisPerDay * 5;
    const millisPerWeek = millisPerDay * 7;

    const skipWeekends = {};

    const isWeekend = (date) =>
        date.getDay() === 0 || date.getDay() === 6;

    skipWeekends.clampDown = (date) => {
        if (date && isWeekend(date)) {
            const daysToSubtract = date.getDay() === 0 ? 2 : 1;
            // round the date up to midnight
            const newDate = timeDay.ceil(date);
            // then subtract the required number of days
            return timeDay.offset(newDate, -daysToSubtract);
        } else {
            return date;
        }
    };

    skipWeekends.clampUp = (date) => {
        if (date && isWeekend(date)) {
            const daysToAdd = date.getDay() === 0 ? 1 : 2;
            // round the date down to midnight
            const newDate = timeDay.floor(date);
            // then add the required number of days
            return timeDay.offset(newDate, daysToAdd);
        } else {
            return date;
        }
    };

    // returns the number of included milliseconds (i.e. those which do not fall)
    // within discontinuities, along this scale
    skipWeekends.distance = function(startDate, endDate) {
        startDate = skipWeekends.clampUp(startDate);
        endDate = skipWeekends.clampDown(endDate);

        // move the start date to the end of week boundary
        const offsetStart = timeSaturday.ceil(startDate);
        if (endDate < offsetStart) {
            return endDate.getTime() - startDate.getTime();
        }

        const msAdded = offsetStart.getTime() - startDate.getTime();

        // move the end date to the end of week boundary
        const offsetEnd = timeSaturday.ceil(endDate);
        const msRemoved = offsetEnd.getTime() - endDate.getTime();

        // determine how many weeks there are between these two dates
        // round to account for DST transitions
        const weeks = Math.round((offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek);

        return weeks * millisPerWorkWeek + msAdded - msRemoved;
    };

    skipWeekends.offset = function(startDate, ms) {
        let date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;

        if (ms === 0) {
            return date;
        }

        const isNegativeOffset = ms < 0;
        const isPositiveOffset = ms > 0;
        let remainingms = ms;

        // move to the end of week boundary for a postive offset or to the start of a week for a negative offset
        const weekBoundary = isNegativeOffset ? timeMonday.floor(date) : timeSaturday.ceil(date);
        remainingms -= (weekBoundary.getTime() - date.getTime());

        // if the distance to the boundary is greater than the number of ms
        // simply add the ms to the current date
        if ((isNegativeOffset && remainingms > 0) || (isPositiveOffset && remainingms < 0)) {
            return new Date(date.getTime() + ms);
        }

        // skip the weekend for a positive offset
        date = isNegativeOffset ? weekBoundary : timeDay.offset(weekBoundary, 2);

        // add all of the complete weeks to the date
        const completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
        date = timeDay.offset(date, completeWeeks * 7);
        remainingms -= completeWeeks * millisPerWorkWeek;

        // add the remaining time
        date = new Date(date.getTime() + remainingms);
        return date;
    };

    skipWeekends.copy = function() { return skipWeekends; };

    return skipWeekends;
}
