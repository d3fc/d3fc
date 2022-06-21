import { nonTradingTimeRange } from './nonTradingTimeRange';
import { dayBoundary, millisPerDay } from './constants';

/**
 * Represents a Trading day
 * @param { string[][] } rawDiscontinuityTimeRanges - Array of time range tuples e.g. [["07:45", "08:30"), ["19:00:45.500", "EOD")]
 * @param { import('./dateTimeUtility').DateTimeUtility } dateTimeUtility
 */
export const tradingDay = (rawDiscontinuityTimeRanges, dateTimeUtility) => {
    const nonTradingTimeRanges = rawDiscontinuityTimeRanges
        .map(rawRange => nonTradingTimeRange(rawRange, dateTimeUtility))
        .sort((a, b) => a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0);
    const totalTradingTimeInMiliseconds = millisPerDay - nonTradingTimeRanges.reduce((total, range) => total + range.lenghtInMs, 0);

    const totalTradingMillisecondsBetween = (intervalStart, intervalEnd) => {

        if (intervalStart.getTime() === intervalEnd.getTime()) {
            return 0;
        }

        // ensure arguments are on the same day or intervalEnd is the next day boundary
        if (dateTimeUtility.dayInterval(intervalStart).getTime() !== dateTimeUtility.dayInterval(intervalEnd).getTime()
            && dateTimeUtility.getStartOfNextDay(intervalStart).getTime() !== intervalEnd.getTime()) {
            throw `tradingDay.totalTradingMillisecondsBetween arguments must be on the same day or intervalEnd must be the start of the next day instead: intervalStart: '${intervalStart}'; intervalEnd: '${intervalEnd}'`;
        }

        let total = 0;

        const relevantDiscontinuityRanges = nonTradingTimeRanges.filter(range => {
            return range.endTime === dayBoundary ||
                dateTimeUtility.setTime(intervalStart, range.endTime) >= intervalStart;
        });

        for (const nonTradingRange of relevantDiscontinuityRanges) {
            const nonTradingStart = dateTimeUtility.setTime(intervalStart, nonTradingRange.startTime);
            const nonTradingEnd = nonTradingRange.endTime === dayBoundary
                ? dateTimeUtility.getStartOfNextDay(intervalStart)
                : dateTimeUtility.setTime(intervalStart, nonTradingRange.endTime);

            // both intervalStart and intervalEnd are before the start of this non-trading range
            if (intervalStart < nonTradingStart && intervalEnd < nonTradingStart) {
                return total + dateTimeUtility.msInterval.count(intervalStart, intervalEnd);
            }

            // intervalStart is before the start of this non-trading time range
            if (intervalStart < nonTradingStart) {
                total += dateTimeUtility.msInterval.count(intervalStart, nonTradingStart);
            }

            // interval ends within non-trading range
            if (intervalEnd < nonTradingEnd) {
                return total;
            }

            // set interval start to the end of non-trading range
            intervalStart = nonTradingEnd;
        }

        // add any interval time still left after iterating through all non-trading ranges
        return total + dateTimeUtility.msInterval.count(intervalStart, intervalEnd);
    };

    const offset = (date, ms) => {
        if (ms === 0) {
            return [date, ms];
        }

        let offsetDate = dateTimeUtility.msInterval.offset(date, ms);

        const nonTradingRanges = (ms > 0)
            ? nonTradingTimeRanges.filter(range => dateTimeUtility.setTime(date, range.startTime) >= date)
            : nonTradingTimeRanges.filter(range => dateTimeUtility.setTime(date, range.startTime) < date).reverse();

        if (nonTradingRanges.length === 0) {
            return [dateTimeUtility.msInterval.offset(date, ms), 0];
        }

        if (ms > 0) {
            for (const nonTradingRange of nonTradingRanges) {

                const rangeStart = dateTimeUtility.setTime(date, nonTradingRange.startTime);

                if (rangeStart <= offsetDate) {
                    // offsetDate is within non-trading range
                    ms -= dateTimeUtility.msInterval.count(date, rangeStart);
                    date = nonTradingRange.endTime === dayBoundary
                        ? dateTimeUtility.getStartOfNextDay(date)
                        : dateTimeUtility.setTime(date, nonTradingRange.endTime);
                    offsetDate = dateTimeUtility.msInterval.offset(date, ms);
                }
            }

            ms -= dateTimeUtility.msInterval.count(date, offsetDate);

        } else {

            for (const nonTradingRange of nonTradingRanges) {
                const endTime = nonTradingRange.endTime === dayBoundary
                    ? dateTimeUtility.getStartOfNextDay(date)
                    : dateTimeUtility.setTime(date, nonTradingRange.endTime);

                if (offsetDate < endTime) {
                    // offsetDate is within non-trading range
                    ms += dateTimeUtility.msInterval.count(endTime, date) + 1;
                    date = dateTimeUtility.msInterval.offset(dateTimeUtility.setTime(date, nonTradingRange.startTime), - 1);
                    offsetDate = dateTimeUtility.msInterval.offset(date, ms);
                }
            }

            ms += dateTimeUtility.msInterval.count(offsetDate, date);
        }

        if (ms !== 0) {
            throw 'tradingDay.offset was called with an offset that spans more than a day';
        }

        return [offsetDate, ms];
    };

    return { totalTradingTimeInMiliseconds, nonTradingTimeRanges, totalTradingMillisecondsBetween, offset };
};
