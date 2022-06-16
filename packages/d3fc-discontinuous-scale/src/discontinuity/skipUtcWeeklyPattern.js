import { utcDay, utcMillisecond } from 'd3-time';
import { base, timeHelper } from './skipWeeklyPattern';

export const utcTimeHelper = timeHelper(
    (date, hh, mm, ss, ms) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hh, mm, ss, ms)),
    date => date.getUTCDay(),
    date => date.getUTCHours(),
    date => date.getUTCMinutes(),
    date => date.getUTCSeconds(),
    date => date.getUTCMilliseconds(),
    utcDay,
    utcMillisecond
)

export default (nonTradingUtcHoursPattern) => base(nonTradingUtcHoursPattern, utcTimeHelper);