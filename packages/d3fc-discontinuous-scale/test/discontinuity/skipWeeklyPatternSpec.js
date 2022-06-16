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

const tradingWeekWithoutDiscontinuities = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };

const mondayFirstStartBoundary = new Date(2018, 0, 1, 7, 45);
const mondayFirstEndBoundary = new Date(2018, 0, 1, 8, 30);
const fridaySecondStartBoundary = new Date(2018, 0, 5, 13, 20);
const sundayEndBoundry = new Date(2018, 0, 7, 19);

describe('skipWeeklyPattern', () => {
  const sut = skipWeeklyPattern(nonTradingHoursPattern);

  it('has 7 trading days', () => {
    expect(sut.tradingDays.length).toBe(7);
  });

  it('should throw due to no trading periods', () => {
    expect(() => skipWeeklyPattern({ Monday: [["SOD", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] })).toThrow();
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
      const expected = sundayEndBoundry;
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
      const actual = sut.clampDown(timeMillisecond.offset(sundayEndBoundry, -1));
      expect(actual).toEqual(expected);
    });

    it('should clamp down to single trading ms', () => {
      const sut = skipWeeklyPattern({ Monday: [["00:00:00.001", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] });
      expect(sut.clampDown(new Date(2018, 0, 1, 0, 0, 0, 1))).toEqual(new Date(2018, 0, 1));
      expect(sut.clampDown(new Date(2018, 0, 2))).toEqual(new Date(2018, 0, 1));
      expect(sut.clampDown(new Date(2018, 0, 3))).toEqual(new Date(2018, 0, 1));
      expect(sut.clampDown(new Date(2018, 0, 4))).toEqual(new Date(2018, 0, 1));
      expect(sut.clampDown(new Date(2018, 0, 5))).toEqual(new Date(2018, 0, 1));
      expect(sut.clampDown(new Date(2018, 0, 6))).toEqual(new Date(2018, 0, 1));
      expect(sut.clampDown(new Date(2018, 0, 7))).toEqual(new Date(2018, 0, 1));
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

    it('on DST boundaries (clock goes forward) should return 23hr or 25hr between consecutive days', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(2022, 2, 27), new Date(2022, 2, 28))).toBe(23 * 3600 * 1000);
      expect(sut.distance(new Date(2022, 9, 30), new Date(2022, 9, 31))).toBe(25 * 3600 * 1000);
    });

    it('should return 23 * 3600 * 1000 for a DST sunday as it skips missing hour', () => {
      const sut = skipWeeklyPattern({ Sunday: [["1:0", "2:0"]] });
      expect(sut.distance(new Date(2022, 2, 27), new Date(2022, 2, 28))).toBe(23 * 3600 * 1000);
    });

    it('should return 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 0, 8))).toBe(7 * 24 * 3600 * 1000);
    });

    it('should return 52 * 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 11, 31))).toBe(52 * 7 * 24 * 3600 * 1000);
    });

    it('should return 0 between consecutive non-trading ranges spanning multiple days', () => {
      expect(sut.distance(fridaySecondStartBoundary, sundayEndBoundry)).toEqual(0);
      expect(sut.distance(sundayEndBoundry, fridaySecondStartBoundary)).toEqual(-0);
    });

    it('should return -1', () => {
      const sut = skipWeeklyPattern({ Monday: [["00:00:00.001", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] });
      expect(sut.distance(new Date(2018, 0, 8), new Date(2018, 0, 1))).toEqual(-1);
      expect(sut.distance(new Date(2018, 0, 9), new Date(2018, 0, 2))).toEqual(-1);
      expect(sut.distance(new Date(2018, 0, 10), new Date(2018, 0, 3))).toEqual(-1);
      expect(sut.distance(new Date(2018, 0, 11), new Date(2018, 0, 4))).toEqual(-1);
      expect(sut.distance(new Date(2018, 0, 12), new Date(2018, 0, 5))).toEqual(-1);
      expect(sut.distance(new Date(2018, 0, 13), new Date(2018, 0, 6))).toEqual(-1);
      expect(sut.distance(new Date(2018, 0, 14), new Date(2018, 0, 7))).toEqual(-1);
    });
  });

  describe('offset', () => {
    it('0 offset should return same date', () => {
      expect(sut.offset(new Date(2018, 0, 1), 0)).toEqual(new Date(2018, 0, 1));
    });

    it('0 offset in non-trading range clamps up', () => {
      expect(sut.offset(new Date(2018, 0, 1, 7, 45), 0)).toEqual(new Date(2018, 0, 1, 8, 30));
    });

    it('-1ms offset should return end of previous day', () => {
      expect(sut.offset(new Date(2018, 0, 1), -1)).toEqual(new Date(2017, 11, 31, 23, 59, 59, 999));
    });

    it('-1ms offset at the of non-trading period should return start of non-trading period', () => {
      expect(sut.offset(new Date(2018, 0, 1, 8, 30), -1)).toEqual(new Date(2018, 0, 1, 7, 44, 59, 999));
    });

    it('-2ms offset should return end of previous day - 1ms', () => {
      expect(sut.offset(new Date(2018, 0, 1), -2)).toEqual(new Date(2017, 11, 31, 23, 59, 59, 998));
    });

    it('-1ms offset after 1ms into trading day should return start of day', () => {
      expect(sut.offset(new Date(2018, 0, 1, 0, 0, 0, 1), -1)).toEqual(new Date(2018, 0, 1));
    });

    it('should return start of next day when offset is 24hr', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.offset(new Date(2018, 0, 1), 24 * 3600 * 1000)).toEqual(new Date(2018, 0, 2));
    });

    it('should return start of previous day when offset is -24hr', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.offset(new Date(2018, 0, 2), - 24 * 3600 * 1000)).toEqual(new Date(2018, 0, 1));
    });

    it('1ms offset at start of non-trading period should return end of non-trading period', () => {
      expect(sut.offset(new Date(2018, 0, 1, 7, 45), 1)).toEqual(new Date(2018, 0, 1, 8, 30, 0, 1));
    });

    it('should return start of next week when offset is totalTradingWeekMilliseconds', () => {
      expect(sut.offset(new Date(2018, 0, 1), sut.totalTradingWeekMilliseconds)).toEqual(new Date(2018, 0, 8));
    });

    it('should return start of 53rd week when offset is 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.offset(new Date(2018, 0, 1), 52 * sut.totalTradingWeekMilliseconds)).toEqual(new Date(2018, 11, 31));
    });

    it('on a DST boundry day should return start of next day when offset is 23 hours', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.offset(new Date(2022, 2, 27), 23 * 3600 * 1000)).toEqual(new Date(2022, 2, 28));
    });

    it('on a DST Sunday boundary should return 1h into next trading period when offset is 1h', () => {
      const sut = skipWeeklyPattern({ Sunday: [["1:0", "2:0"]] });
      expect(sut.offset(new Date(2022, 2, 27, 1), 3600 * 1000)).toEqual(new Date(2022, 2, 27, 3));
    });

    it('should return next day on a DST boundry when offset is 23 hours', () => {
      const sut = skipWeeklyPattern({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [["1:0", "2:0"]] });
      expect(sut.offset(new Date(2022, 2, 27), 23 * 3600 * 1000)).toEqual(new Date(2022, 2, 28));
    });

    it('should return end of second non-trading range', () => {
      const offset = timeMillisecond.count(new Date(2018, 0, 1, 8, 30), new Date(2018, 0, 1, 13, 20));
      expect(sut.offset(new Date(2018, 0, 1, 7, 45), offset)).toEqual(new Date(2018, 0, 1, 19, 0, 0, 0));
    });

    it('should return 1ms before Friday 13:20 when offset = -1ms on Sunday 7:00pm', () => {
      const expected = timeMillisecond.offset(fridaySecondStartBoundary, -1);
      const actual = sut.offset(sundayEndBoundry, -1);
      expect(actual).toEqual(expected);
    });

    it('should skip to Sunday 7pm', () => {
      expect(sut.offset(timeMillisecond.offset(fridaySecondStartBoundary, -1), 1)).toEqual(sundayEndBoundry);
    });

    it('should go back to Friday 13:20', () => {
      expect(sut.offset(sundayEndBoundry, -1)).toEqual(timeMillisecond.offset(fridaySecondStartBoundary, -1));
    });

    it('should skip to Monday 15th', () => {
      const sut = skipWeeklyPattern({ Monday: [["00:00:00.001", "EOD"]], Tuesday: [["SOD", "EOD"]], Wednesday: [["SOD", "EOD"]], Thursday: [["SOD", "EOD"]], Friday: [["SOD", "EOD"]], Saturday: [["SOD", "EOD"]], Sunday: [["SOD", "EOD"]] });
      expect(sut.offset(new Date(2018, 0, 1, 1), 2)).toEqual(new Date(2018, 0, 22));
      expect(sut.offset(new Date(2018, 0, 2), 2)).toEqual(new Date(2018, 0, 22));
      expect(sut.offset(new Date(2018, 0, 3), 2)).toEqual(new Date(2018, 0, 22));
      expect(sut.offset(new Date(2018, 0, 4), 2)).toEqual(new Date(2018, 0, 22));
      expect(sut.offset(new Date(2018, 0, 5), 2)).toEqual(new Date(2018, 0, 22));
      expect(sut.offset(new Date(2018, 0, 6), 2)).toEqual(new Date(2018, 0, 22));
      expect(sut.offset(new Date(2018, 0, 7), 2)).toEqual(new Date(2018, 0, 22));
    });
  });

  describe('copy', () => {
    it('should return same object', () => {
      expect(sut.copy() === sut.copy()).toBeTruthy();
    });
  });
});