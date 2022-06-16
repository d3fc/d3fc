import { default as skipWeeklyPattern, localTimeHelper, tradingDay, nonTradingTimeRange, standardiseTimeString } from '../../src/discontinuity/skipWeeklyPattern';
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
  });

  describe('distance', () => {
    it('should return totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 0, 8))).toBe(sut.totalTradingWeekMilliseconds)
    });

    it('should return 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 11, 31))).toBe(52 * sut.totalTradingWeekMilliseconds)
    });

    it('should return negative 52 * totalTradingWeekMilliseconds', () => {
      expect(sut.distance(new Date(2018, 11, 31), new Date(2018, 0, 1))).toBe(-52 * sut.totalTradingWeekMilliseconds)
    });

    it('on DST boundaries (clock goes forward) should return 23hr or 25hr between consecutive days', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(2022, 2, 27), new Date(2022, 2, 28))).toBe(23 * 3600 * 1000);
      expect(sut.distance(new Date(2022, 9, 30), new Date(2022, 9, 31))).toBe(25 * 3600 * 1000);
    });

    it('should return 23 * 3600 * 1000 for a DST sunday as it skips missing hour', () => {
      const sut = skipWeeklyPattern({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [["1:0", "2:0"]] });
      expect(sut.distance(new Date(2022, 2, 27), new Date(2022, 2, 28))).toBe(23 * 3600 * 1000);
    });

    it('should return 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 0, 8))).toBe(7 * 24 * 3600 * 1000)
    });

    it('should return 52 * 7 * 24 * 3600 * 1000 for trading week without non-trading periods', () => {
      const sut = skipWeeklyPattern(tradingWeekWithoutDiscontinuities);
      expect(sut.distance(new Date(2018, 0, 1), new Date(2018, 11, 31))).toBe(52 * 7 * 24 * 3600 * 1000)
    });
  });

  describe('offset', () => {
    it('0 offset should return same date', () => {
      expect(sut.offset(new Date(2018, 0, 1), 0)).toEqual(new Date(2018, 0, 1));
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
  });

  describe('copy', () => {
    it('should return same object', () => {
      expect(sut.copy() === sut.copy()).toBeTruthy();
    });
  });
});

describe('dicontinuityTimeRange', () => {
  it('throws for no arguments', () => {
    expect(() => nonTradingTimeRange()).toThrow();
  });

  it('throws for more than 1 argument', () => {
    expect(() => nonTradingTimeRange("a", "b")).toThrow();
  });

  it('throws for argument that is not string[]', () => {
    expect(() => nonTradingTimeRange("a")).toThrow();
  });

  it('throws for argument that is not string[]', () => {
    expect(() => nonTradingTimeRange([1, 2], localTimeHelper)).toThrow();
  });

  it('throws for argument that is not string[]', () => {
    expect(() => nonTradingTimeRange([new Date(), new Date()], localTimeHelper)).toThrow();
  });

  it('throws for string[] argument when lenght != 2', () => {
    expect(() => nonTradingTimeRange(["a"], localTimeHelper)).toThrow();
  });

  it('throws for string[] argument with invalid time string', () => {
    expect(() => nonTradingTimeRange(["", ""], localTimeHelper)).toThrow();
  });

  it('should return lenght = 1 for SOD and "00:00:00.001" ', () => {
    const actual = nonTradingTimeRange(["SOD", "00:00:00.001"], localTimeHelper);
    expect(actual.lenghtInMs).toEqual(1);
  });

  it('should return total milliseconds per day for timeRange [SOD, EOD)', () => {
    const actual = nonTradingTimeRange(["SOD", "EOD"], localTimeHelper);
    expect(actual.lenghtInMs).toEqual(1000 * 60 * 60 * 24);
  });

});

describe('formatTimeString', () => {
  it('throws for no arguments', () => {
    expect(() => standardiseTimeString()).toThrow();
  });

  it('throws for more than 1 argument', () => {
    expect(() => standardiseTimeString("a", "b")).toThrow();
  });

  it('throws for argument that is not a valid time', () => {
    expect(() => standardiseTimeString("25:00:00.000")).toThrow();
  });

  it('throws for argument that is not a valid time', () => {
    expect(() => standardiseTimeString("24:00:00.000")).toThrow();
  });

  it('throws for argument that is not a valid time', () => {
    expect(() => standardiseTimeString("20")).toThrow();
  });

  it('parses argument formatted as h:m as expected', () => {
    const actual = standardiseTimeString("8:3");
    expect(actual).toEqual("08:03:00.000");
  });

  it('parses argument formatted as h:mm:s as expected', () => {
    const actual = standardiseTimeString("1:59:7");
    expect(actual).toEqual("01:59:07.000");
  });

  it('parses argument formatted as h:mm:s:ff as expected', () => {
    const actual = standardiseTimeString("1:59:9.56");
    expect(actual).toEqual("01:59:09.056");
  });

});

describe('tradingDay', () => {
  describe('totalTradingMillisecondsBetween', () => {
    it(' should return 0 ms for non trading day', () => {
      const sut = tradingDay([["SOD", "EOD"]], localTimeHelper)
      expect(sut.totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(0);
    });

    it('should return 1 ms', () => {
      const sut = tradingDay([["0:0:0.1", "EOD"]], localTimeHelper)
      expect(sut.totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(1);
    });

    it('should return 2 ms', () => {
      const sut = tradingDay([["0:0:0.1", "23:59:59.999"]], localTimeHelper)
      expect(sut.totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(2);
    });

    it('should return 2 ms - one at start and one at the end of the day', () => {
      const sut = tradingDay([["0:0:0.1", "23:59:59.998"]], localTimeHelper)
      expect(sut.totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 1, 23, 59, 59, 999))).toBe(2);
    });

    it('should skip multiple non-trading time ranges and return 3 ms', () => {
      const sut = tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "EOD"]], localTimeHelper)
      expect(sut.totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(3);
    });

    it('should skip multiple non-trading time ranges and return 4 ms', () => {
      const sut = tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "23:59:59.998"]], localTimeHelper)
      expect(sut.totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 1, 23, 59, 59, 999))).toBe(4);
    });
  });
});