import { utcDay, utcMillisecond } from 'd3-time';
import { base } from './skipWeeklyPattern';
import { dateTimeUtility } from './skipWeeklyPattern/dateTimeUtility';

export const utcDateTimeUtility = dateTimeUtility(
    (date, hh, mm, ss, ms) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hh, mm, ss, ms)),
    date => date.getUTCDay(),
    date => [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()],
    utcDay,
    utcMillisecond
);

export default (nonTradingUtcHoursPattern) => base(nonTradingUtcHoursPattern, utcDateTimeUtility);