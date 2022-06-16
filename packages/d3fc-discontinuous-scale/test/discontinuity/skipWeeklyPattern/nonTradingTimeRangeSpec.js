import { nonTradingTimeRange, standardiseTimeString } from "../../../src/discontinuity/skipWeeklyPattern/nonTradingTimeRange"
import { utcTimeHelper } from "../../../src/discontinuity/skipUtcWeeklyPattern"
import { localTimeHelper } from "../../../src/discontinuity/skipWeeklyPattern"

describe('nonTradingTimeRange', () => {
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
        expect(() => nonTradingTimeRange([1, 2], utcTimeHelper)).toThrow();
    });

    it('throws for argument that is not string[]', () => {
        expect(() => nonTradingTimeRange([new Date(), new Date()], utcTimeHelper)).toThrow();
    });

    it('throws for string[] argument when lenght != 2', () => {
        expect(() => nonTradingTimeRange(["a"], utcTimeHelper)).toThrow();
    });

    it('throws for string[] argument with invalid time string', () => {
        expect(() => nonTradingTimeRange(["", ""], utcTimeHelper)).toThrow();
    });

    it('should return lenght = 1 for SOD and "00:00:00.001" ', () => {
        expect(nonTradingTimeRange(["SOD", "00:00:00.001"], utcTimeHelper).lenghtInMs).toEqual(1);
        expect(nonTradingTimeRange(["SOD", "00:00:00.001"], localTimeHelper).lenghtInMs).toEqual(1);
    });

    it('should return total milliseconds per day for timeRange [SOD, EOD)', () => {
        expect(nonTradingTimeRange(["SOD", "EOD"], utcTimeHelper).lenghtInMs).toEqual(1000 * 60 * 60 * 24);
        expect(nonTradingTimeRange(["SOD", "EOD"], localTimeHelper).lenghtInMs).toEqual(1000 * 60 * 60 * 24);
    });
});

describe('standardiseTimeString', () => {
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