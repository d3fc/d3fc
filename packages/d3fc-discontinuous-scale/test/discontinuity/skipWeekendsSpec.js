import skipWeekends from '../../src/discontinuity/skipWeekends';
import {timeDay, timeMillisecond, timeMinute} from 'd3-time';

describe('skipWeekends', () => {
    const millisPerDay = 24 * 3600 * 1000;
    const wednesday = new Date(2016, 0, 6);

    // this is 00:00:00 hours on monday, which is at the very start of the week
    const mondayBoundary = new Date(2016, 0, 4);
    // this is 00:00:00 hours on Saturday, which is at the very start of the weekend
    const saturdayBoundary = new Date(2016, 0, 2);

    describe('clampUp', () => {
        it('should do nothing if provided with a weekday', () => {
            expect(skipWeekends().clampUp(wednesday)).toEqual(wednesday);
        });

        it('should clamp up if given a weekend', () => {
            // try subtracting a millisecond
            expect(skipWeekends().clampUp(timeMillisecond.offset(mondayBoundary, -1)))
              .toEqual(mondayBoundary);

            // try subtracting a minute
            expect(skipWeekends().clampUp(timeMinute.offset(mondayBoundary, -1)))
              .toEqual(mondayBoundary);

            // try subtracting a day
            expect(skipWeekends().clampUp(timeDay.offset(mondayBoundary, -1)))
              .toEqual(mondayBoundary);

            // try subtracting one and a half days
            expect(skipWeekends().clampUp(timeDay.offset(mondayBoundary, -1.5)))
              .toEqual(mondayBoundary);
        });

        it('should not clamp up at the boundary of a discontinuity', () => {
            // clamping the boundary should return the bundary
            expect(skipWeekends().clampUp(mondayBoundary))
              .toEqual(mondayBoundary);

            // by subtracting one day and one millisecond, this will fall just outside of the weekend, so should not be clamped
            const friday = timeMillisecond.offset(timeDay.offset(mondayBoundary, -2), -1);
            expect(skipWeekends().clampUp(friday))
              .toEqual(friday);
        });
    });

    describe('clampDown', () => {
        it('should do nothing if provided with a weekday', () => {
            expect(skipWeekends().clampDown(wednesday)).toEqual(wednesday);
        });

        it('should clamp down if given a weekend', () => {
            // clamping the boundary should return the bundary
            expect(skipWeekends().clampDown(saturdayBoundary))
              .toEqual(saturdayBoundary);

            // try adding a millisecond
            expect(skipWeekends().clampDown(timeMillisecond.offset(saturdayBoundary, 1)))
              .toEqual(saturdayBoundary);

            // try adding a minute
            expect(skipWeekends().clampDown(timeMinute.offset(saturdayBoundary, 1)))
              .toEqual(saturdayBoundary);

            // try adding a day
            expect(skipWeekends().clampDown(timeDay.offset(saturdayBoundary, 1)))
              .toEqual(saturdayBoundary);

            // try adding one and a half days
            expect(skipWeekends().clampDown(timeDay.offset(saturdayBoundary, 1.5)))
              .toEqual(saturdayBoundary);

        });

        it('should not clamp down at the boundary of a discontinuity', () => {
            // by adding two days, this will fall just outside of the weekend, so should not be clamped
            const monday = timeDay.offset(saturdayBoundary, 2);
            expect(skipWeekends().clampDown(monday))
              .toEqual(monday);

            // by subtracting one millisecond, this will fall just outside of the weekend, so should not be clamped
            const friday = timeMillisecond.offset(saturdayBoundary, -1);
            expect(skipWeekends().clampDown(friday))
              .toEqual(friday);
        });
    });

    it('should remove weekends', () => {
        expect(skipWeekends().distance(mondayBoundary, wednesday)).toEqual(2 * millisPerDay);
        expect(skipWeekends().distance(mondayBoundary, timeDay.offset(mondayBoundary, 7)))
            .toEqual(5 * millisPerDay);
    });
});
