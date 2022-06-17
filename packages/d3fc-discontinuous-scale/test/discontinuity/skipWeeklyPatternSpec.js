import { default as skipWeeklyPattern } from '../../src/discontinuity/skipWeeklyPattern';
import { timeMillisecond } from 'd3-time';

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

const mondayFirstStartBoundary = new Date(2018, 0, 1, 7, 45);
const mondayFirstEndBoundary = new Date(2018, 0, 1, 8, 30);
const fridaySecondStartBoundary = new Date(2018, 0, 5, 13, 20);
const sundayEndBoundary = new Date(2018, 0, 7, 19);

describe('skipWeeklyPattern', () => {
  const sut = skipWeeklyPattern(nonTradingHoursPattern);

  it('has 7 trading days', () => {
    expect(sut.tradingDays.length).toBe(7);
  });

  it('should throw due to no trading periods', () => {
    expect(() => skipWeeklyPattern({
      Monday: [["SOD", "EOD"]], Tuesday: [["SOD", "EOD"]],
      Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]],
      Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]]
    })).toThrow();
  });

  describe('clampUp', () => {

    it('should do nothing 1ms before non trading period', () => {
      const expected = timeMillisecond.offset(mondayFirstStartBoundary, - 1);
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

    it('should advance to single trading ms', () => {
      const sut = skipWeeklyPattern({ Sunday: [["SOD", "23:59:59.999"]], Monday: [["SOD", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]] });
      expect(sut.clampUp(new Date(2018, 0, 1))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
      expect(sut.clampUp(new Date(2018, 0, 2))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
      expect(sut.clampUp(new Date(2018, 0, 3))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
      expect(sut.clampUp(new Date(2018, 0, 4))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
      expect(sut.clampUp(new Date(2018, 0, 5))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
      expect(sut.clampUp(new Date(2018, 0, 6))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
      expect(sut.clampUp(new Date(2018, 0, 7))).toEqual(new Date(2018, 0, 7, 23, 59, 59, 999));
    });
  });

  describe('clampDown', () => {

    it('should do nothing one ms before non trading period', () => {
      const expected = timeMillisecond.offset(mondayFirstStartBoundary, - 1);
      const actual = sut.clampDown(expected);
      expect(actual).toEqual(expected);
    });

    it('should do nothing if provided with a valid trading hour', () => {
      const expected = mondayFirstEndBoundary;
      const actual = sut.clampDown(expected);
      expect(actual).toEqual(expected);
    });

    it('should clamp down to one millisecond before start of non-trading period', () => {
      const expected = timeMillisecond.offset(mondayFirstStartBoundary, -1);
      const actual = sut.clampDown(mondayFirstStartBoundary);
      expect(actual).toEqual(expected);
    });

    it('should clamp down from Sunday 6:59:59.999pm to 1ms before Friday 13:20', () => {
      const expected = timeMillisecond.offset(fridaySecondStartBoundary, -1);
      const actual = sut.clampDown(timeMillisecond.offset(sundayEndBoundary, -1));
      expect(actual).toEqual(expected);
    });

    it('should clamp down to single trading ms', () => {
      const expected = new Date(2018, 0, 1);
      const sut = skipWeeklyPattern({ Monday: [["00:00:00.001", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] });
      expect(sut.clampDown(new Date(2018, 0, 1, 0, 0, 0, 1))).toEqual(expected);
      expect(sut.clampDown(new Date(2018, 0, 2))).toEqual(expected);
      expect(sut.clampDown(new Date(2018, 0, 3))).toEqual(expected);
      expect(sut.clampDown(new Date(2018, 0, 4))).toEqual(expected);
      expect(sut.clampDown(new Date(2018, 0, 5))).toEqual(expected);
      expect(sut.clampDown(new Date(2018, 0, 6))).toEqual(expected);
      expect(sut.clampDown(new Date(2018, 0, 7))).toEqual(expected);
    });
  });

  describe('distance', () => {
    it('should return totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 0, 8))).toBe(sut.totalTradingWeekMilliseconds);
    });

    it('should return 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 11, 31))).toBe(52 * sut.totalTradingWeekMilliseconds);
    });

    it('should return negative 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(2018, 11, 31), new Date(2018, 0, 1))).toBe(-52 * sut.totalTradingWeekMilliseconds);
    });

    it('should return 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipWeeklyPattern({});
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 0, 8))).toBe(7 * 24 * 3600 * 1000);
    });

    it('should return 52 * 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipWeeklyPattern({});
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 11, 31))).toBe(52 * 7 * 24 * 3600 * 1000);
    });

    it('should return 0 between consecutive non-trading ranges spanning multiple days', () => {
      expect(sut.distance(fridaySecondStartBoundary, sundayEndBoundary)).toEqual(0);
      expect(sut.distance(sundayEndBoundary, fridaySecondStartBoundary)).toEqual(-0);
    });

    it('should return -1', () => {
      const expected = -1;
      const sut = skipWeeklyPattern({ Monday: [["00:00:00.001", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] });
      expect(sut.distance(new Date(2018, 0, 8), new Date(2018, 0, 1))).toEqual(expected);
      expect(sut.distance(new Date(2018, 0, 9), new Date(2018, 0, 2))).toEqual(expected);
      expect(sut.distance(new Date(2018, 0, 10), new Date(2018, 0, 3))).toEqual(expected);
      expect(sut.distance(new Date(2018, 0, 11), new Date(2018, 0, 4))).toEqual(expected);
      expect(sut.distance(new Date(2018, 0, 12), new Date(2018, 0, 5))).toEqual(expected);
      expect(sut.distance(new Date(2018, 0, 13), new Date(2018, 0, 6))).toEqual(expected);
      expect(sut.distance(new Date(2018, 0, 14), new Date(2018, 0, 7))).toEqual(expected);
    });

    it('on DST boundaries should return 0hr or 1hr', () => {
      const sut = skipWeeklyPattern({});
      expect(sut.distance(new Date(2022, 2, 27, 1), new Date(2022, 2, 27, 2))).toBe(0);
      expect(sut.distance(new Date(2022, 9, 30, 1), new Date(2022, 9, 30, 2))).toBe(2 * 3600 * 1000);
    });

    it('on DST boundary when clocks go back should return 0', () => {
      const sut = skipWeeklyPattern({ Sunday: [["1:0", "2:0"]] });
      expect(sut.distance(new Date(2022, 9, 30, 1), new Date(2022, 9, 30, 2))).toBe(0);
    });

    it('on DST boundary when clocks go back should return 90min', () => {
      const sut = skipWeeklyPattern({ Sunday: [["1:15", "1:45"]] });
      expect(sut.distance(new Date(2022, 9, 30, 1), new Date(2022, 9, 30, 2))).toBe(90 * 60000);
    });

    it(`KNOWN BUG:
    on DST boundary when clocks go forward should return 50min (1h:10min - 15min) when non-trading period falls within 'wall clock' change
    instead it returns 55min i.e. the non-trading period 1:55-2:00 is only counted once rather than twice`, () => {
      const sut = skipWeeklyPattern({ Sunday: [["1:55", "2:05"]] });
      expect(sut.distance(new Date(2022, 9, 30, 1), new Date(2022, 9, 30, 2))).toBe(/*50*/ 55 * 60000);
    });

    it('on DST boundaries should return 22hr or 24hr in single non-trading hour in day', () => {
      const sut = skipWeeklyPattern({ Sunday: [["7:45", "8:45"]] });
      expect(sut.distance(new Date(2022, 2, 27), new Date(2022, 2, 28))).toBe(22 * 3600 * 1000);
      expect(sut.distance(new Date(2022, 9, 30), new Date(2022, 9, 31))).toBe(24 * 3600 * 1000);
    });
  });

  describe('offset', () => {
    it('0 offset should return same date', () => {
      expect(sut.offset(new Date(2018, 0, 1), 0)).toEqual(new Date(2018, 0, 1));
    });

    it('0 offset in non-trading range clamps up', () => {
      expect(sut.offset(new Date(2018, 0, 1, 7, 45), 0)).toEqual(new Date(2018, 0, 1, 8, 30));
    });

    it('should return end of previous day when offset = -1ms on day boundary ', () => {
      expect(sut.offset(new Date(2018, 0, 1), -1)).toEqual(new Date(2017, 11, 31, 23, 59, 59, 999));
    });

    it('-2ms offset should return end of previous day - 1ms', () => {
      expect(sut.offset(new Date(2018, 0, 1), -2)).toEqual(new Date(2017, 11, 31, 23, 59, 59, 998));
    });

    it('-1ms offset after 1ms into trading day should return start of day', () => {
      expect(sut.offset(new Date(2018, 0, 1, 0, 0, 0, 1), -1)).toEqual(new Date(2018, 0, 1));
    });

    it('should return 1ms before the start of this period when offset = -1ms  at the end of non-trading period', () => {
      expect(sut.offset(new Date(2018, 0, 1, 8, 30), -1)).toEqual(new Date(2018, 0, 1, 7, 44, 59, 999));
    });

    it('should return start of next day when offset is 24hr', () => {
      const sut = skipWeeklyPattern({});
      expect(sut.offset(new Date(2018, 0, 1), 24 * 3600 * 1000)).toEqual(new Date(2018, 0, 2));
    });

    it('should return start of previous day when offset is -24hr', () => {
      const sut = skipWeeklyPattern({});
      expect(sut.offset(new Date(2018, 0, 2), - 24 * 3600 * 1000)).toEqual(new Date(2018, 0, 1));
    });

    it('should return end of non-trading period when offset is 1ms at start of non-trading period', () => {
      expect(sut.offset(new Date(2018, 0, 1, 7, 45), 1)).toEqual(new Date(2018, 0, 1, 8, 30, 0, 1));
    });

    it('should return start of next week when offset is totalTradingWeekMilliseconds', () => {
      expect(sut.offset(new Date(2018, 0, 1), sut.totalTradingWeekMilliseconds)).toEqual(new Date(2018, 0, 8));
    });

    it('should return start of 53rd week when offset is 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.offset(new Date(2018, 0, 1), 52 * sut.totalTradingWeekMilliseconds)).toEqual(new Date(2018, 11, 31));
    });

    it('should return end of second non-trading range when offset covers entire trading period sandwiched between 2 non-trading ones', () => {
      const offset = timeMillisecond.count(new Date(2018, 0, 1, 8, 30), new Date(2018, 0, 1, 13, 20));
      expect(sut.offset(new Date(2018, 0, 1, 7, 45), offset)).toEqual(new Date(2018, 0, 1, 19, 0, 0, 0));
    });

    it('should return 1ms before Friday 13:20 when offset = -1ms on Sunday 7:00pm', () => {
      expect(sut.offset(sundayEndBoundary, -1)).toEqual(timeMillisecond.offset(fridaySecondStartBoundary, -1));
    });

    it('should return Sunday 7pm when offset = 1ms on Friday 13:20', () => {
      expect(sut.offset(timeMillisecond.offset(fridaySecondStartBoundary, -1), 1)).toEqual(sundayEndBoundary);
    });

    it('should return Monday 22nd when offset = 2ms on any when day since it skips the 8th and the 15th', () => {
      const expected = new Date(2018, 0, 22);
      const sut = skipWeeklyPattern({ Monday: [["00:00:00.001", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] });
      expect(sut.offset(new Date(2018, 0, 1, 1), 2)).toEqual(expected);
      expect(sut.offset(new Date(2018, 0, 2), 2)).toEqual(expected);
      expect(sut.offset(new Date(2018, 0, 3), 2)).toEqual(expected);
      expect(sut.offset(new Date(2018, 0, 4), 2)).toEqual(expected);
      expect(sut.offset(new Date(2018, 0, 5), 2)).toEqual(expected);
      expect(sut.offset(new Date(2018, 0, 6), 2)).toEqual(expected);
      expect(sut.offset(new Date(2018, 0, 7), 2)).toEqual(expected);
    });
  });

  describe('copy', () => {
    it('should return same object', () => {
      expect(sut.copy() === sut.copy()).toBeTruthy();
    });
  });
});