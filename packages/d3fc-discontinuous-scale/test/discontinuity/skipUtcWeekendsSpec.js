import skipUTCWeekends from '../../src/discontinuity/skipUtcWeekends';
import {utcDay, utcMillisecond, utcMinute} from 'd3-time';

describe('skipUTCWeekends', () => {
    const millisPerDay = 24 * 3600 * 1000;
    const wednesday = new Date(Date.UTC(2016, 0, 6));

    // this is 00:00:00 hours on monday, which is at the very start of the week
    const mondayBoundary = new Date(Date.UTC(2016, 0, 4));
    // this is 00:00:00 hours on Saturday, which is at the very start of the weekend
    const saturdayBoundary = new Date(Date.UTC(2016, 0, 2));

    describe('clampUp', () => {
        it('should do nothing if provided with a weekday', () => {
            expect(skipUTCWeekends().clampUp(wednesday)).toEqual(wednesday);
        });

        it('should clamp up if given a weekend', () => {
            // try subtracting a millisecond
            expect(skipUTCWeekends().clampUp(utcMillisecond.offset(mondayBoundary, -1)))
              .toEqual(mondayBoundary);

            // try subtracting a minute
            expect(skipUTCWeekends().clampUp(utcMinute.offset(mondayBoundary, -1)))
              .toEqual(mondayBoundary);

            // try subtracting a day
            expect(skipUTCWeekends().clampUp(utcDay.offset(mondayBoundary, -1)))
              .toEqual(mondayBoundary);

            // try subtracting one and a half days
            expect(skipUTCWeekends().clampUp(utcDay.offset(mondayBoundary, -1.5)))
              .toEqual(mondayBoundary);
        });

        it('should not clamp up at the boundary of a discontinuity', () => {
            // clamping the boundary should return the bundary
            expect(skipUTCWeekends().clampUp(mondayBoundary))
              .toEqual(mondayBoundary);

            // by subtracting one day and one millisecond, this will fall just outside of the weekend, so should not be clamped
            const friday = utcMillisecond.offset(utcDay.offset(mondayBoundary, -2), -1);
            expect(skipUTCWeekends().clampUp(friday))
              .toEqual(friday);
        });
    });

    describe('clampDown', () => {
        it('should do nothing if provided with a weekday', () => {
            expect(skipUTCWeekends().clampDown(wednesday)).toEqual(wednesday);
        });

        it('should clamp down if given a weekend', () => {
            // clamping the boundary should return the bundary
            expect(skipUTCWeekends().clampDown(saturdayBoundary))
              .toEqual(saturdayBoundary);

            // try adding a millisecond
            expect(skipUTCWeekends().clampDown(utcMillisecond.offset(saturdayBoundary, 1)))
              .toEqual(saturdayBoundary);

            // try adding a minute
            expect(skipUTCWeekends().clampDown(utcMinute.offset(saturdayBoundary, 1)))
              .toEqual(saturdayBoundary);

            // try adding a day
            expect(skipUTCWeekends().clampDown(utcDay.offset(saturdayBoundary, 1)))
              .toEqual(saturdayBoundary);

            // try adding one and a half days
            expect(skipUTCWeekends().clampDown(utcDay.offset(saturdayBoundary, 1.5)))
              .toEqual(saturdayBoundary);

        });

        it('should not clamp down at the boundary of a discontinuity', () => {
            // by adding two days, this will fall just outside of the weekend, so should not be clamped
            const monday = utcDay.offset(saturdayBoundary, 2);
            expect(skipUTCWeekends().clampDown(monday))
              .toEqual(monday);

            // by subtracting one millisecond, this will fall just outside of the weekend, so should not be clamped
            const friday = utcMillisecond.offset(saturdayBoundary, -1);
            expect(skipUTCWeekends().clampDown(friday))
              .toEqual(friday);
        });
    });

    it('should remove weekends', () => {
        expect(skipUTCWeekends().distance(mondayBoundary, wednesday)).toEqual(2 * millisPerDay);
        expect(skipUTCWeekends().distance(mondayBoundary, utcDay.offset(mondayBoundary, 7)))
            .toEqual(5 * millisPerDay);
    });
});
