import { timeDay, timeMillisecond } from 'd3-time';
import { tradingDay } from './skipWeeklyPattern/tradingDay';
import { dayBoundary, millisPerDay } from './skipWeeklyPattern/constants';
import { dateTimeUtility } from './skipWeeklyPattern/dateTimeUtility';

export const localDateTimeUtility = dateTimeUtility(
    (date, hh, mm, ss, ms) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, ss, ms),
    date => date.getDay(),
    date => [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()],
    timeDay,
    timeMillisecond
);

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
 * @param {DateTimeUtility} dateTimeUtility - uses local or utc dates
 * @returns { WeeklyPatternDiscontinuityProvider } WeeklyPatternDiscontinuityProvider
 */
export const base = (nonTradingPattern, dateTimeUtility) => {

    const getDayPatternOrDefault = (day) => nonTradingPattern[day] === undefined ? [] : nonTradingPattern[day];

    const tradingDays = [
        tradingDay(getDayPatternOrDefault('Sunday'), dateTimeUtility),
        tradingDay(getDayPatternOrDefault('Monday'), dateTimeUtility),
        tradingDay(getDayPatternOrDefault('Tuesday'), dateTimeUtility),
        tradingDay(getDayPatternOrDefault('Wednesday'), dateTimeUtility),
        tradingDay(getDayPatternOrDefault('Thursday'), dateTimeUtility),
        tradingDay(getDayPatternOrDefault('Friday'), dateTimeUtility),
        tradingDay(getDayPatternOrDefault('Saturday'), dateTimeUtility)];

    const totalTradingWeekMilliseconds = tradingDays.reduce((total, tradingDay) => total + tradingDay.totalTradingTimeInMiliseconds, 0);

    if (totalTradingWeekMilliseconds === 0) {
        throw 'Trading pattern must yield at least 1 ms of trading time';
    }

    const instance = { tradingDays, totalTradingWeekMilliseconds };

    /**
     * When given a value falls within a discontinuity (i.e. an excluded domain range) it should be shifted forwards to the discontinuity boundary. 
     * Otherwise, it should be returns unchanged.
     * @param {Date} date - date to clamp up
     * @returns {Date}
     */
    instance.clampUp = (date) => {
        const tradingDay = tradingDays[dateTimeUtility.getDay(date)];

        for (const range of tradingDay.nonTradingTimeRanges) {
            if (range.isInRange(date)) {

                return range.endTime === dayBoundary
                    ? instance.clampUp(dateTimeUtility.getStartOfNextDay(date))
                    : dateTimeUtility.setTime(date, range.endTime);
            }
        }

        return date;
    };

    /** 
     * When given a value, if it falls within a discontinuity it should be shifted backwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
     * @param {Date} date - date to clamp down
     * @returns {Date}
    */
    instance.clampDown = (date) => {
        const tradingDay = tradingDays[dateTimeUtility.getDay(date)];

        for (const range of tradingDay.nonTradingTimeRanges) {
            if (range.isInRange(date)) {

                return range.startTime === dayBoundary
                    ? instance.clampDown(dateTimeUtility.getEndOfPreviousDay(date))
                    : dateTimeUtility.setTime(date, range.startTime, -1);
            }
        }
        return date;
    };

    /**
     * When given a pair of values, this function returns the distance between the, in domain units, minus any discontinuities. discontinuities.
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @returns {number} - the number of milliseconds between the dates
     */
    instance.distance = (startDate, endDate) => {

        if (startDate.getTime() === endDate.getTime()) {
            return 0;
        }

        let [start, end, factor] = startDate <= endDate
            ? [startDate, endDate, 1]
            : [endDate, startDate, -1];

        // same day distance
        if (dateTimeUtility.dayInterval(start).getTime() === dateTimeUtility.dayInterval(end).getTime()) {
            return instance.tradingDays[dateTimeUtility.getDay(start)].totalTradingMillisecondsBetween(start, end);
        }

        // combine any trading time left in the day after startDate 
        // and any trading time from midnight up until the endDate
        let total = instance.tradingDays[dateTimeUtility.getDay(start)].totalTradingMillisecondsBetween(start, dateTimeUtility.dayInterval.offset(dateTimeUtility.dayInterval(start), 1)) +
            instance.tradingDays[dateTimeUtility.getDay(end)].totalTradingMillisecondsBetween(dateTimeUtility.dayInterval(end), end);

        // startDate and endDate are consecutive days    
        if (dateTimeUtility.dayInterval.count(start, end) === 1) {
            return total;
        }

        // move the start date to following day
        start = dateTimeUtility.dayInterval.offset(dateTimeUtility.dayInterval(start), 1);
        // floor endDate to remove 'time component'
        end = dateTimeUtility.dayInterval(end);

        return factor * dateTimeUtility.dayInterval.range(start, end)
            .reduce((runningTotal, currentDay, currentIndex, arr) => {

                const nextDay = currentIndex < arr.length - 1
                    ? arr[currentIndex + 1]
                    : dateTimeUtility.dayInterval.offset(currentDay, 1);
                const isDstBoundary = (nextDay - currentDay) !== millisPerDay;
                const tradingDay = instance.tradingDays[dateTimeUtility.getDay(currentDay)];
                return runningTotal += isDstBoundary
                    ? tradingDay.totalTradingMillisecondsBetween(currentDay, nextDay)
                    : tradingDay.totalTradingTimeInMiliseconds;

            }, total);
    };

    /**
     * When given a value and an offset in milliseconds, the value should be advanced by the offset value, skipping any discontinuities, to return the final value.
     * @param {Date} date 
     * @param {number} ms 
     */
    instance.offset = (date, ms) => {
        date = ms >= 0
            ? instance.clampUp(date)
            : instance.clampDown(date);

        const isDstBoundary = (d) => (dateTimeUtility.dayInterval.offset(d) - dateTimeUtility.dayInterval(d)) !== millisPerDay;

        const moveToDayBoundary = (tradingDay, date, ms) => {

            if (ms < 0) {
                const dateFloor = dateTimeUtility.dayInterval(date);
                const distanceToStartOfDay = tradingDay.totalTradingMillisecondsBetween(dateFloor, date);

                return Math.abs(ms) <= distanceToStartOfDay
                    ? tradingDay.offset(date, ms)
                    : [instance.clampDown(dateTimeUtility.msInterval.offset(dateFloor, -1)), ms + distanceToStartOfDay + 1];

            } else {
                const nextDate = dateTimeUtility.getStartOfNextDay(date);
                const distanceToDayBoundary = tradingDay.totalTradingMillisecondsBetween(date, nextDate);

                return ms < distanceToDayBoundary
                    ? tradingDay.offset(date, ms)
                    : [instance.clampUp(nextDate), ms - distanceToDayBoundary];
            }
        };

        if (ms === 0)
            return date;

        const moveDateDelegate = ms < 0
            ? (date, remainingMs, tradingDayMs) => [instance.clampDown(dateTimeUtility.dayInterval.offset(date, -1)), remainingMs + tradingDayMs]
            : (date, remainingMs, tradingDayMs) => [instance.clampUp(dateTimeUtility.dayInterval.offset(date)), remainingMs - tradingDayMs];

        let tradingDay = instance.tradingDays[dateTimeUtility.getDay(date)];
        [date, ms] = moveToDayBoundary(tradingDay, date, ms);
        while (ms !== 0) {
            tradingDay = instance.tradingDays[dateTimeUtility.getDay(date)];
            if (isDstBoundary(date)) {
                [date, ms] = moveToDayBoundary(tradingDay, date, ms);
            } else {
                [date, ms] = Math.abs(ms) >= tradingDay.totalTradingTimeInMiliseconds
                    ? moveDateDelegate(date, ms, tradingDay.totalTradingTimeInMiliseconds)
                    : moveToDayBoundary(tradingDay, date, ms);
            }
        }

        return date;
    };

    instance.copy = () => instance;

    return instance;
};

export default (nonTradingHoursPattern) => base(nonTradingHoursPattern, localDateTimeUtility);