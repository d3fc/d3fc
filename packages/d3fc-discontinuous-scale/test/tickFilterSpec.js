import tickFilter from '../src/tickFilter';

describe('tickFilter', () => {
    it('should clampUp the ticks with the dicontinuity provider', () => {
        const ticks = [new Date(), new Date()];
        const provider = {
            clampUp: () => { }
        };

        const clampUpSpy = jest.spyOn(provider, "clampUp").mockImplementation((date) => {
            date.setHours(12, 0, 0, 0);
            return date;
        });

        const filteredTicks = tickFilter(ticks, provider);

        expect(filteredTicks.every(tick => tick.getHours() === 12)).toBeTruthy();
        expect(clampUpSpy).toBeCalledTimes(ticks.length);
    });

    it('should use the tick filter provided by the discontinuity provider', () => {
        const ticks = [new Date(), new Date()];
        const provider = {
            tickFilter: () => { }
        };

        const tickFilterSpy = jest.spyOn(provider, "tickFilter").mockImplementation((ticks) => {
            return ticks.map(date => {
                date.setHours(12, 0, 0, 0);
                return date;
            });
        });

        const filteredTicks = tickFilter(ticks, provider);

        expect(filteredTicks.every(tick => tick.getHours() === 12)).toBeTruthy();
        expect(tickFilterSpy).toBeCalledWith(ticks);
    });
});