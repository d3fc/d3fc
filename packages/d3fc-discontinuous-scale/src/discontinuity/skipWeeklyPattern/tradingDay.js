import { nonTradingTimeRange } from './nonTradingTimeRange';
import { dayBoundary, millisPerDay } from './constants'

/**
 * Represents a Trading day
 * @param { string[][] } rawDicontinuityTimeRanges - Array of time range tuples e.g. [["07:45", "08:30"), ["19:00:45.500", "EOD")]
 * @param { import('./dateTimeUtility').DateTimeUtility } dateTimeUtility
 */
export const tradingDay = (rawDicontinuityTimeRanges, dateTimeUtility) => {
    const nonTradingTimeRanges = rawDicontinuityTimeRanges
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
            throw `tradingDay.totalTradingMillisecondsBetween arguments must be on the same day or intervalEnd must be the start of the next day instead: intervalStart: '${intervalStart}'; intervalEnd: '${intervalEnd}'`
        }

        let total = 0;

        for (const nonTradingRange of nonTradingTimeRanges) {
            const startTime = dateTimeUtility.setTime(intervalStart, nonTradingRange.startTime);
            const endTime = nonTradingRange.endTime === dayBoundary
                ? dateTimeUtility.getStartOfNextDay(intervalStart)
                : dateTimeUtility.setTime(intervalStart, nonTradingRange.endTime);

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
                    ms -= (rangeStart - date);
                    date = nonTradingRange.endTime === dayBoundary
                        ? dateTimeUtility.getStartOfNextDay(date)
                        : dateTimeUtility.setTime(date, nonTradingRange.endTime);
                    offsetDate = dateTimeUtility.msInterval.offset(date, ms);
                }
            }

            ms -= (offsetDate - date);

        } else {

            for (const nonTradingRange of nonTradingRanges) {
                const endTime = nonTradingRange.endTime === dayBoundary
                    ? dateTimeUtility.getStartOfNextDay(date)
                    : dateTimeUtility.setTime(date, nonTradingRange.endTime);

                if (endTime > offsetDate) {
                    ms += (date - endTime) + 1;
                    date = dateTimeUtility.msInterval.offset(dateTimeUtility.setTime(date, nonTradingRange.startTime), - 1);
                    offsetDate = dateTimeUtility.msInterval.offset(date, ms);
                }
            }

            ms += (date - offsetDate);
        }

        if (ms !== 0) {
            throw 'tradingDay.offset was called with an offset that spans more than a day';
        }

        return [offsetDate, ms];
    }

    return { totalTradingTimeInMiliseconds, nonTradingTimeRanges, totalTradingMillisecondsBetween, offset };
}
