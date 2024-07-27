import { default as skipUtcWeeklyPattern } from '../../src/discontinuity/skipUtcWeeklyPattern';
import { utcMillisecond } from 'd3-time';

const nonTradingHoursPattern =
{
  Monday: [["13:20", "19:00"], ["07:45", "08:30"]],
  Tuesday: [["07:45", "08:30"], ["13:20", "19:00"]],
  Wednesday: [["07:45", "08:30"], ["13:20", "19:00"]],
  Thursday: [["07:45", "08:30"], ["13:20", "19:00"]],
  Friday: [["07:45", "08:30"], ["13:20", "EOD"]],
  Saturday: [["SOD", "EOD"]],
  Sunday: [["SOD", "19:00"]]
};

const tradingWeekWithoutDiscontinuities = {};

const mondayFirstStartBoundary = new Date(Date.UTC(2018, 0, 1, 7, 45));
const mondayFirstEndBoundary = new Date(Date.UTC(2018, 0, 1, 8, 30));
const fridaySecondStartBoundary = new Date(Date.UTC(2018, 0, 5, 13, 20));
const sundayEndBoundary = new Date(Date.UTC(2018, 0, 7, 19));

describe('skipUtcWeeklyPattern', () => {
  const sut = skipUtcWeeklyPattern(nonTradingHoursPattern);

  it('has 7 trading days', () => {
    expect(sut.tradingDays.length).toBe(7);
  });

  describe('clampUp', () => {

    it('should do nothing 1ms before non trading period', () => {
      const expected = utcMillisecond.offset(mondayFirstStartBoundary, - 1);
      const actual = sut.clampUp(expected);
      expect(actual).toEqual(expected);
    });

    it('should do nothing if provided with a valid trading date', () => {
      const expected = mondayFirstEndBoundary;
      const actual = sut.clampUp(expected);
      expect(actual).toEqual(expected);
    });

    it('should advance to end of non trading period', () => {
      const expected = mondayFirstEndBoundary;
      const actual = sut.clampUp(mondayFirstStartBoundary);
      expect(actual).toEqual(expected);
    });

    it('should advance from Friday 13:20 to Sunday 7:00pm', () => {
      const expected = sundayEndBoundary;
      const actual = sut.clampUp(fridaySecondStartBoundary);
      expect(actual).toEqual(expected);
    });
  });

  describe('clampDown', () => {

    it('should do nothing one ms before non trading period', () => {
      const expected = utcMillisecond.offset(mondayFirstStartBoundary, - 1);
      const actual = sut.clampDown(expected);
      expect(actual).toEqual(expected);
    });

    it('should do nothing if provided with a valid trading hour', () => {
      const expected = mondayFirstEndBoundary;
      const actual = sut.clampDown(expected);
      expect(actual).toEqual(expected);
    });

    it('should clamp down to one millisecond before start of non-trading period', () => {
      const expected = utcMillisecond.offset(mondayFirstStartBoundary, -1);
      const actual = sut.clampDown(mondayFirstStartBoundary);
      expect(actual).toEqual(expected);
    });

    it('should clamp down from Sunday 6:59:59.999pm to 1ms before Friday 13:20', () => {
      const expected = utcMillisecond.offset(fridaySecondStartBoundary, -1);
      const actual = sut.clampDown(utcMillisecond.offset(sundayEndBoundary, -1));
      expect(actual).toEqual(expected);
    });
  });

  describe('distance', () => {
    it('should return totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 8)))).toBe(sut.totalTradingWeekMilliseconds);
    });

    it('should return 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 11, 31)))).toBe(52 * sut.totalTradingWeekMilliseconds);
    });

    it('should return negative 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(Date.UTC(2018, 11, 31)), new Date(Date.UTC(2018, 0, 1)))).toBe(-52 * sut.totalTradingWeekMilliseconds);
    });

    it('on DST boundaries should return 24 * 3600 * 1000', () => {
      const sut = skipUtcWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(Date.UTC(2022, 2, 27)), new Date(Date.UTC(2022, 2, 28)))).toBe(24 * 3600 * 1000);
      expect(sut.distance(new Date(Date.UTC(2022, 9, 30)), new Date(Date.UTC(2022, 9, 31)))).toBe(24 * 3600 * 1000);
    });

    it('should return 23 * 3600 * 1000 for a DST sunday as it skips missing hour', () => {
      const sut = skipUtcWeeklyPattern({ Sunday: [["1:0", "2:0"]] });
      expect(sut.distance(new Date(Date.UTC(2022, 2, 27)), new Date(Date.UTC(2022, 2, 28)))).toBe(23 * 3600 * 1000);
    });

    it('should return 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipUtcWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 8)))).toBe(7 * 24 * 3600 * 1000);
    });

    it('should return 52 * 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipUtcWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 11, 31)))).toBe(52 * 7 * 24 * 3600 * 1000);
    });
  });

  describe('offset', () => {
    it('0 offset should return same date', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1)), 0)).toEqual(new Date(Date.UTC(2018, 0, 1)));
    });

    it('-1ms offset should return end of previous day', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1)), -1)).toEqual(new Date(Date.UTC(2017, 11, 31, 23, 59, 59, 999)));
    });

    it('-1ms offset at the of non-trading period should return start of non-trading period', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1, 8, 30)), -1)).toEqual(new Date(Date.UTC(2018, 0, 1, 7, 44, 59, 999)));
    });

    it('-2ms offset should return end of previous day - 1ms', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1)), -2)).toEqual(new Date(Date.UTC(2017, 11, 31, 23, 59, 59, 998)));
    });

    it('-1ms offset after 1ms into trading day should return start of day', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 1)), -1)).toEqual(new Date(Date.UTC(2018, 0, 1)));
    });

    it('should return start of next day when offset is 24hr', () => {
      const sut = skipUtcWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1)), 24 * 3600 * 1000)).toEqual(new Date(Date.UTC(2018, 0, 2)));
    });

    it('should return start of previous day when offset is -24hr', () => {
      const sut = skipUtcWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.offset(new Date(Date.UTC(2018, 0, 2)), - 24 * 3600 * 1000)).toEqual(new Date(Date.UTC(2018, 0, 1)));
    });

    it('1ms offset at start of non-trading period should return end of non-trading period', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1, 7, 45)), 1)).toEqual(new Date(Date.UTC(2018, 0, 1, 8, 30, 0, 1)));
    });

    it('should return start of next week when offset is totalTradingWeekMilliseconds', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1)), sut.totalTradingWeekMilliseconds)).toEqual(new Date(Date.UTC(2018, 0, 8)));
    });

    it('should return start of 53rd week when offset is 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1)), 52 * sut.totalTradingWeekMilliseconds)).toEqual(new Date(Date.UTC(2018, 11, 31)));
    });

    it('on a DST Sunday boundary should return 1h into next trading period when offset is 1h', () => {
      expect(sut.offset(new Date(Date.UTC(2022, 2, 27, 1)), 3600 * 1000)).toEqual(new Date(Date.UTC(2022, 2, 27, 20)));
    });

    it('on a DST boundry day should return next day when offset is 24 hours', () => {
      const sut = skipUtcWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.offset(new Date(Date.UTC(2022, 2, 27)), 24 * 3600 * 1000)).toEqual(new Date(Date.UTC(2022, 2, 28)));
    });

    it('should return next day on a DST boundry when offset is 23 hours', () => {
      const sut = skipUtcWeeklyPattern({ Sunday: [["1:0", "2:0"]] });
      expect(sut.offset(new Date(Date.UTC(2022, 2, 27)), 23 * 3600 * 1000)).toEqual(new Date(Date.UTC(2022, 2, 28)));
    });

    it('should return end of second non-trading range', () => {
      const offset = utcMillisecond.count(new Date(Date.UTC(2018, 0, 1, 8, 30)), new Date(Date.UTC(2018, 0, 1, 13, 20)));
      expect(sut.offset(new Date(Date.UTC(2018, 0, 1, 7, 45)), offset)).toEqual(new Date(Date.UTC(2018, 0, 1, 19, 0, 0, 0)));
    });

    it('should return 1ms before Friday 13:20 when offset = -1ms on Sunday 7:00pm', () => {
      const expected = utcMillisecond.offset(fridaySecondStartBoundary, -1);
      const actual = sut.offset(sundayEndBoundary, -1);
      expect(actual).toEqual(expected);
    });
  });

  describe('copy', () => {
    it('should return same object', () => {
      expect(sut.copy() === sut.copy()).toBeTruthy();
    });
  });
});
