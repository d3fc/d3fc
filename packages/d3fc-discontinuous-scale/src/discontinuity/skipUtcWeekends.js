import { utcDay, utcSaturday, utcMonday } from 'd3-time';
import { base } from './skipWeekends';

export default () => base(date => date.getUTCDay(), utcDay, utcSaturday, utcMonday);