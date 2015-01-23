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
            expect(clone.range()[0]).toEqual(0);
            expect(clone.range()[1]).toEqual(100);
            expect(clone.domain()[0]).toEqual(start);
            expect(clone.domain()[1]).toEqual(end);
        });

        describe('without discontinuities', function() {

            var range = [0, 100];
            var start = new Date(2015, 0, 18); // sunday
            var end = new Date(2015, 0, 28); // wednesday

            var referenceScale = d3.time.scale()
                    .domain([start, end])
                    .range(range);

            var dateTime = fc.scale.dateTime()
                .domain([start, end])
                .range(range);

            it('should match the scale functionality of a d3 time scale', function() {
                var date = new Date(2015, 0, 19);
                expect(dateTime(date)).toEqual(referenceScale(date));

                date = new Date(2015, 0, 25);
                expect(dateTime(date)).toEqual(referenceScale(date));

                expect(dateTime(start)).toEqual(referenceScale(start));
                expect(dateTime(end)).toEqual(referenceScale(end));
            });

            it('should match the invert functionality of a d3 time scale', function() {
                expect(dateTime.invert(0)).toEqual(referenceScale.invert(0));
                expect(dateTime.invert(50)).toEqual(referenceScale.invert(50));
                expect(dateTime.invert(100)).toEqual(referenceScale.invert(100));
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

            it('should invert with weekends skipped', function() {

                // four calendar weeks = 20 week days
                var start = new Date(2015, 0, 1); // thursday
                var end = new Date(2015, 0, 29); // thursday

                var dateTime = fc.scale.dateTime()
                    .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                    .range([0, 20])
                    .domain([start, end]);

                expect(dateTime.invert(1)).toEqual(new Date(2015, 0, 2));
                expect(dateTime.invert(2)).toEqual(new Date(2015, 0, 5)); // weekend skipped
                expect(dateTime.invert(3)).toEqual(new Date(2015, 0, 6));
                expect(dateTime.invert(4)).toEqual(new Date(2015, 0, 7));

            });
        });
    });


}(d3, fc));