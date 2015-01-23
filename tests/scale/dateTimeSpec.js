(function(d3, fc) {
    'use strict';

    describe('dateTime', function() {

        it('should support copy', function() {
            var start = new Date(2015, 0, 8); // thursday
            var end = new Date(2015, 0, 15); // thursday

            var dateTime = fc.scale.dateTime()
                .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                .range([0, 100])
                .domain([start, end]);

            var clone = dateTime.copy();

            expect(clone.discontinuityProvider()).toEqual(dateTime.discontinuityProvider());
        });

        describe('without discontinuities', function() {

            var range = [0, 100];
            var start = new Date(2015, 0, 18); // sunday
            var end = new Date(2015, 0, 28); // wednesday

            it('should match the functionality of a d3 time axis', function() {
                var referenceScale = d3.time.scale()
                    .domain([start, end])
                    .range(range);

                var dateTime = fc.scale.dateTime()
                    .domain([start, end])
                    .range(range);

                var date = new Date(2015, 0, 19);
                expect(dateTime(date)).toEqual(referenceScale(date));

                date = new Date(2015, 0, 25);
                expect(dateTime(date)).toEqual(referenceScale(date));

                expect(dateTime(start)).toEqual(referenceScale(start));
                expect(dateTime(end)).toEqual(referenceScale(end));
            });
        });

        describe('with weekends skipped', function() {

            it('should clamp the domain', function() {

                var endOfWeek = new Date(2015, 0, 24); // saturday 00:00 hours
                var end = new Date(2015, 0, 25, 12); // mid-day sunday

                var startOfWeek = new Date(2015, 0, 19); // monday 00:00 hours
                var start = new Date(2015, 0, 18, 12); // mid-day sunday

                var dateTime = fc.scale.dateTime()
                    .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                    .domain([start, end]);

                expect(dateTime.domain()[0]).toEqual(startOfWeek);
                expect(dateTime.domain()[1]).toEqual(endOfWeek);

            });

            it('should scale with weekends skipped', function() {

                var start = new Date(2015, 0, 8); // thursday
                var end = new Date(2015, 0, 15); // thursday

                var dateTime = fc.scale.dateTime()
                    .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                    .range([0, 100])
                    .domain([start, end]);

                // check the domain bounds
                expect(dateTime(start)).toEqual(0);
                expect(dateTime(end)).toEqual(100);

                // saturday and sunday collapse to the same point
                expect(dateTime(new Date(2015, 0, 10))).toEqual(20);
                expect(dateTime(new Date(2015, 0, 11))).toEqual(20);

                // monday
                expect(dateTime(new Date(2015, 0, 12))).toEqual(40);
                // tuesday
                expect(dateTime(new Date(2015, 0, 13))).toEqual(60);
                // wednesday
                expect(dateTime(new Date(2015, 0, 14))).toEqual(80);

            });
        });
    });


}(d3, fc));