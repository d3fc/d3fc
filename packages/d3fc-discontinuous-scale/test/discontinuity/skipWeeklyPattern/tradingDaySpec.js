import { tradingDay } from '../../../src/discontinuity/skipWeeklyPattern/tradingDay';
import { localTimeHelper } from '../../../src/discontinuity/skipWeeklyPattern';
import { utcTimeHelper } from '../../../src/discontinuity/skipUtcWeeklyPattern';

describe('tradingDay', () => {
    describe('totalTradingMillisecondsBetween', () => {
        it(' should return 0 ms for non trading day', () => {
            expect(tradingDay([["SOD", "EOD"]], localTimeHelper).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(0);
            expect(tradingDay([["SOD", "EOD"]], utcTimeHelper).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(0);
        });

        it('should return 1 ms', () => {
            expect(tradingDay([["0:0:0.1", "EOD"]], localTimeHelper).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(1);
            expect(tradingDay([["0:0:0.1", "EOD"]], utcTimeHelper).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(1);
        });

        it('should return 2 ms', () => {
            expect(tradingDay([["0:0:0.1", "23:59:59.999"]], localTimeHelper).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(2);
            expect(tradingDay([["0:0:0.1", "23:59:59.999"]], utcTimeHelper).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(2);
        });

        it('should return 2 ms - one at start and one at the end of the day', () => {
            expect(tradingDay([["0:0:0.1", "23:59:59.998"]], localTimeHelper).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 1, 23, 59, 59, 999))).toBe(2);
            expect(tradingDay([["0:0:0.1", "23:59:59.998"]], utcTimeHelper).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 1, 23, 59, 59, 999)))).toBe(2);
        });

        it('should skip multiple non-trading time ranges and return 3 ms', () => {
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "EOD"]], localTimeHelper).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 2))).toBe(3);
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "EOD"]], utcTimeHelper).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 2)))).toBe(3);
        });

        it('should skip multiple non-trading time ranges and return 4 ms', () => {
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "23:59:59.998"]], localTimeHelper).totalTradingMillisecondsBetween(new Date(2018, 0, 1), new Date(2018, 0, 1, 23, 59, 59, 999))).toBe(4);
            expect(tradingDay([["0:0:0.1", "0:0:0.2"], ["0:0:0.3", "0:0:0.4"], ["0:0:0.5", "23:59:59.998"]], utcTimeHelper).totalTradingMillisecondsBetween(new Date(Date.UTC(2018, 0, 1)), new Date(Date.UTC(2018, 0, 1, 23, 59, 59, 999)))).toBe(4);
        });
    });
});