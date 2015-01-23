(function(d3, fc) {
    'use strict';

    describe('skipWeekends', function() {

        var millisPerDay = 24 * 3600 * 1000;
        var skipWeekends = fc.scale.discontinuity.skipWeekends();

        describe('clampUp', function() {

            it('should leave non-weekend days unchanged', function() {
                var date = new Date(2015, 0, 19); // monday
                expect(skipWeekends.clampUp(date)).toEqual(date);

                date = new Date(2015, 0, 21); // wednesday
                expect(skipWeekends.clampUp(date)).toEqual(date);

                date = new Date(2015, 0, 23); // friday
                expect(skipWeekends.clampUp(date)).toEqual(date);
            });

            it('should clamp sunday up to 00:00 on monday', function() {
                var startOfWeek = new Date(2015, 0, 19); // monday 00:00 hours
                var date = new Date(2015, 0, 18, 12); // mid-day sunday
                expect(skipWeekends.clampUp(date)).toEqual(startOfWeek);
            });

            it('should clamp saturday up to 00:00 on monday', function() {
                var startOfWeek = new Date(2015, 0, 19); // monday 00:00 hours
                var date = new Date(2015, 0, 17, 12); // mid-day saturday
                expect(skipWeekends.clampUp(date)).toEqual(startOfWeek);
            });
        });

        describe('clampDown', function() {

            it('should leave non-weekend days unchanged', function() {
                var date = new Date(2015, 0, 19); // monday
                expect(skipWeekends.clampDown(date)).toEqual(date);

                date = new Date(2015, 0, 21); // wednesday
                expect(skipWeekends.clampDown(date)).toEqual(date);

                date = new Date(2015, 0, 23); // friday
                expect(skipWeekends.clampDown(date)).toEqual(date);
            });

            it('should clamp sunday down to 00:00 on saturday', function() {
                var endOfWeek = new Date(2015, 0, 17); // saturday 00:00 hours
                var date = new Date(2015, 0, 18, 12); // mid-day sunday
                expect(skipWeekends.clampDown(date)).toEqual(endOfWeek);
            });

            it('should clamp saturday up to 00:00 on monday', function() {
                var endOfWeek = new Date(2015, 0, 17); // saturday 00:00 hours
                var date = new Date(2015, 0, 17, 12); // mid-day saturday
                expect(skipWeekends.clampDown(date)).toEqual(endOfWeek);
            });
        });

        describe('getDistance', function() {
            it('should give the right result - duh!', function() {
                var d1 = new Date(2015, 0, 19); // monday
                var d2 = new Date(2015, 0, 21); // wednesday
                expect(skipWeekends.getDistance(d1, d2)).toEqual(2 * millisPerDay);
            });

            it('should remove weekends', function() {
                var d1 = new Date(2015, 0, 19); // monday
                var d2 = new Date(2015, 0, 30); // friday
                expect(skipWeekends.getDistance(d1, d2)).toEqual(11 * millisPerDay - 2 * millisPerDay);
            });

            it('should handle start dates which are weekends', function() {
                var d1 = new Date(2015, 0, 18); // sunday
                var d2 = new Date(2015, 0, 30); // friday
                expect(skipWeekends.getDistance(d1, d2)).toEqual(11 * millisPerDay - 2 * millisPerDay);
            });

            it('should handle end dates which are weekends', function() {
                var d1 = new Date(2015, 0, 18); // sunday
                var d2 = new Date(2015, 0, 20); // tuesday
                expect(skipWeekends.getDistance(d1, d2)).toEqual(1 * millisPerDay);
            });
        });
    });

}(d3, fc));