import { tradingDay } from '../../../src/discontinuity/skipWeeklyPattern/tradingDay';
import { localDateTimeUtility } from '../../../src/discontinuity/skipWeeklyPattern';
import { utcDateTimeUtility } from '../../../src/discontinuity/skipUtcWeeklyPattern';

describe('tradingDay', () => {
    describe('totalTradingMillisecondsBetween', () => {
        it(' should return 0 ms for non trading day', () => {
            expect(tradingDay([["SOD", "EOD"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(0);
            expect(tradingDay([["SOD", "EOD"]], utcDateTimeUtility).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(0);
        });

        it('should return 1 ms', () => {
            expect(tradingDay([["0:0:0.1", "EOD"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(1);
            expect(tradingDay([["0:0:0.1", "EOD"]], utcDateTimeUtility).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(1);
        });

        it('should return 2 ms', () => {
            expect(tradingDay([["0:0:0.1", "23:59:59.999"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(2);
            expect(tradingDay([["0:0:0.1", "23:59:59.999"]], utcDateTimeUtility).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(2);
        });

        it('should return 2 ms - one at start and one at the end of the day', () => {
            expect(tradingDay([["0:0:0.1", "23:59:59.998"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 1, 23, 59, 59, 999))).toBe(2);
            expect(tradingDay([["0:0:0.1", "23:59:59.998"]], utcDateTimeUtility).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 1, 23, 59, 59, 999)))).toBe(2);
        });

        it('should skip multiple non-trading time ranges and return 3 ms', () => {
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "EOD"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(3);
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "EOD"]], utcDateTimeUtility).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(3);
        });

        it('should skip multiple non-trading time ranges and return 4 ms', () => {
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "23:59:59.998"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 1, 23, 59, 59, 999))).toBe(4);
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "23:59:59.998"]], utcDateTimeUtility).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 1, 23, 59, 59, 999)))).toBe(4);
        });

        it('should return 1', () => {
            expect(tradingDay([["7:00", "7:30"], ["8:00", "EOD"]], localDateTimeUtility).totalTradingMillisecondsBetween(new Date(2018, 0, 1, 7, 59, 59, 999), new Date(2018, 0, 2)));
        });
    });
});