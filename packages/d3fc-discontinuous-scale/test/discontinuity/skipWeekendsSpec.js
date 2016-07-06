import skipWeekends from '../../src/discontinuity/skipWeekends';

describe('skipWeekends', () => {

    const millisPerDay = 24 * 3600 * 1000;
    const friday = new Date(2016, 0, 1);
    const saturday = new Date(2016, 0, 2);
    const sunday = new Date(2016, 0, 3);
    const monday = new Date(2016, 0, 4);
    const wednesday = new Date(2016, 0, 6);

    describe('clampUp', () => {
        it('should do nothing if provided with a weekday', () => {
            expect(skipWeekends().clampUp(wednesday)).toEqual(wednesday);
        });

        it('should clamp up if given a weekend', () => {
            expect(skipWeekends().clampUp(saturday)).toEqual(monday);
            expect(skipWeekends().clampUp(sunday)).toEqual(monday);
        });

        it('should not clamp up at the boundary of a discontinuity', () => {
            expect(skipWeekends().clampUp(monday)).toEqual(monday);
        });
    });

    describe('clampDown', () => {
        it('should do nothing if provided with a weekday', () => {
            expect(skipWeekends().clampDown(wednesday)).toEqual(wednesday);
        });

        it('should clamp down if given a weekend', () => {
            expect(skipWeekends().clampDown(saturday)).toEqual(friday);
            expect(skipWeekends().clampDown(sunday)).toEqual(friday);
        });

        it('should not clamp down at the boundary of a discontinuity', () => {
            expect(skipWeekends().clampDown(friday)).toEqual(friday);
        });
    });

    it('should remove weekends', () => {
        expect(skipWeekends().distance(monday, wednesday)).toEqual(2 * millisPerDay);
        expect(skipWeekends().distance(monday, new Date(monday.getTime() + 7 * millisPerDay)))
            .toEqual(5 * millisPerDay);
    });
});
