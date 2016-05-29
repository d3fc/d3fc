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

        it('should return undefined for undefined', function() {
            expect(skipWeekends.clampUp(undefined)).not.toBeDefined();
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

        it('should clamp any time on saturday down to 00:00 on saturday', function() {
            var endOfWeek = new Date(2015, 0, 17); // saturday 00:00 hours
            var date = new Date(2015, 0, 17, 12); // mid-day saturday
            expect(skipWeekends.clampDown(date)).toEqual(endOfWeek);
        });

        it('should return undefined for undefined', function() {
            expect(skipWeekends.clampDown(undefined)).not.toBeDefined();
        });
    });

    describe('distance', function() {
        it('should give the right result - duh!', function() {
            var d1 = new Date(2015, 0, 19); // monday
            var d2 = new Date(2015, 0, 21); // wednesday
            expect(skipWeekends.distance(d1, d2)).toEqual(2 * millisPerDay);
        });

        it('should remove weekends', function() {
            var d1 = new Date(2015, 0, 19); // monday
            var d2 = new Date(2015, 0, 30); // friday
            expect(skipWeekends.distance(d1, d2)).toEqual(11 * millisPerDay - 2 * millisPerDay);
        });

        it('should handle start dates which are weekends', function() {
            var d1 = new Date(2015, 0, 18); // sunday
            var d2 = new Date(2015, 0, 30); // friday
            expect(skipWeekends.distance(d1, d2)).toEqual(11 * millisPerDay - 2 * millisPerDay);
        });

        it('should handle end dates which are weekends', function() {
            var d1 = new Date(2015, 0, 18); // sunday
            var d2 = new Date(2015, 0, 20); // tuesday
            expect(skipWeekends.distance(d1, d2)).toEqual(1 * millisPerDay);
        });

        describe('DST', function() {
            it('should handle distances covering DST long days', function() {
                var d1 = new Date(2015, 9, 23);
                var d2 = new Date(2015, 9, 26);
                expect(skipWeekends.distance(d1, d2)).toEqual(3 * millisPerDay - 2 * millisPerDay);
            });

            it('should handle distances covering DST short days', function() {
                var d1 = new Date(2016, 2, 25);
                var d2 = new Date(2016, 2, 28);
                expect(skipWeekends.distance(d1, d2)).toEqual(3 * millisPerDay - 2 * millisPerDay);
            });

            it('should handle distances covering DST short and long days', function() {
                var d1 = new Date(2015, 0, 1);
                var d2 = new Date(2016, 0, 1);
                expect(skipWeekends.distance(d1, d2)).toEqual((365 * millisPerDay) - (2 * 52 * millisPerDay));
            });
        });

        describe('leap year', function() {
            it('should handle non-leap years', function() {
                var d1 = new Date(2015, 1, 1);
                var d2 = new Date(2015, 2, 1);
                expect(skipWeekends.distance(d1, d2)).toEqual((28 * millisPerDay) - (9 * millisPerDay));
            });

            it('should handle extra day in leap years', function() {
                var d1 = new Date(2016, 1, 1);
                var d2 = new Date(2016, 2, 1);
                expect(skipWeekends.distance(d1, d2)).toEqual((29 * millisPerDay) - (8 * millisPerDay));
            });
        });
    });

    describe('offset', function() {

        it('should accommodate offsets that do not cross weekend boundaries', function() {
            var d = new Date(2015, 0, 19); // monday
            expect(skipWeekends.offset(d, millisPerDay)).toEqual(new Date(2015, 0, 20));
        });

        it('should clamp up if supplied with a weekend date', function() {
            var d = new Date(2015, 0, 18); // sunday
            expect(skipWeekends.offset(d, millisPerDay)).toEqual(new Date(2015, 0, 20));
        });

        it('should skip weekends', function() {
            var d = new Date(2015, 0, 20); // tuesday
            expect(skipWeekends.offset(d, 5 * millisPerDay)).toEqual(new Date(2015, 0, 27));
        });
    });
});
