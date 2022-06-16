import { nonTradingTimeRange, standardiseTimeString } from "../../../src/discontinuity/skipWeeklyPattern/nonTradingTimeRange";
import { utcDateTimeUtility } from "../../../src/discontinuity/skipUtcWeeklyPattern";
import { localDateTimeUtility } from "../../../src/discontinuity/skipWeeklyPattern";

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
        expect(() => nonTradingTimeRange([1, 2], utcDateTimeUtility)).toThrow();
    });

    it('throws for argument that is not string[]', () => {
        expect(() => nonTradingTimeRange([new Date(), new Date()], utcDateTimeUtility)).toThrow();
    });

    it('throws for string[] argument when lenght != 2', () => {
        expect(() => nonTradingTimeRange(["a"], utcDateTimeUtility)).toThrow();
    });

    it('throws for string[] argument with invalid time string', () => {
        expect(() => nonTradingTimeRange(["", ""], utcDateTimeUtility)).toThrow();
    });

    it('should return lenght = 1 for SOD and "00:00:00.001" ', () => {
        expect(nonTradingTimeRange(["SOD", "00:00:00.001"], utcDateTimeUtility).lenghtInMs).toEqual(1);
        expect(nonTradingTimeRange(["SOD", "00:00:00.001"], localDateTimeUtility).lenghtInMs).toEqual(1);
    });

    it('should return total milliseconds per day for timeRange [SOD, EOD)', () => {
        expect(nonTradingTimeRange(["SOD", "EOD"], utcDateTimeUtility).lenghtInMs).toEqual(1000 * 60 * 60 * 24);
        expect(nonTradingTimeRange(["SOD", "EOD"], localDateTimeUtility).lenghtInMs).toEqual(1000 * 60 * 60 * 24);
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