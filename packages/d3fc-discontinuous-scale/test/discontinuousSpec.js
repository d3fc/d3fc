import {scaleTime, scaleLinear} from 'd3-scale';

import discontinuous from '../src/discontinuous';
import skipWeekends from '../src/discontinuity/skipWeekends';
import discontinuityRange from '../src/discontinuity/range';

describe('discontinuous', () => {

    it('should default to an identity scale', () => {
        var scale = discontinuous();

        expect(scale(0)).toEqual(0);
        expect(scale(10)).toEqual(10);

        expect(scale.invert(0)).toEqual(0);
        expect(scale.invert(10)).toEqual(10);
    });

    it('should support copy', () => {
        var start = new Date(2015, 0, 8); // thursday
        var end = new Date(2015, 0, 15); // thursday

        var dateTime = discontinuous(scaleTime())
            .discontinuityProvider(skipWeekends())
            .range([0, 100])
            .domain([start, end]);

        var clone = dateTime.copy();

        expect(clone.discontinuityProvider()).toEqual(dateTime.discontinuityProvider());
        expect(clone.range()[0]).toEqual(0);
        expect(clone.range()[1]).toEqual(100);
        expect(clone.domain()[0]).toEqual(start);
        expect(clone.domain()[1]).toEqual(end);
    });

    describe('tick calculations', () => {
        it('should ensure ticks are not within discontinuities (time)', () => {
            var start = new Date(2015, 0, 9); // friday
            var end = new Date(2015, 0, 12); // monday

            var scale = discontinuous(scaleTime())
                .discontinuityProvider(skipWeekends())
                .domain([start, end]);

            var ticksInDiscontinuityRange = scale.ticks()
                .filter(tick => tick.getDay() === 6 /* Sat */ || tick.getDay() === 0 /* Sun */);
            expect(ticksInDiscontinuityRange).toEqual([]);
        });

        it('should ensure ticks are not within discontinuities (linear)', () => {
            var scale = discontinuous(scaleLinear())
                .discontinuityProvider(discontinuityRange([5, 20]))
                .domain([0, 25]);

            var ticksInDiscontinuityRange = scale.ticks()
                .filter(tick => tick > 5 && tick < 20);
            expect(ticksInDiscontinuityRange).toEqual([]);
        });

        it('should support arguments being passed to ticks', () => {
            var start = new Date(2015, 0, 9); // friday
            var end = new Date(2015, 0, 12); // monday

            var dateTime = discontinuous(scaleTime())
                .discontinuityProvider(skipWeekends())
                .domain([start, end]);

            var ticks = dateTime.ticks(100);
            expect(ticks).toHaveLength(25);
        });
    });

    describe('without discontinuities', () => {

        var range = [0, 100];
        var start = new Date(2015, 0, 18); // sunday
        var end = new Date(2015, 0, 28); // wednesday

        var referenceScale = scaleTime()
                .domain([start, end])
                .range(range);

        var dateTime = discontinuous(scaleTime())
            .domain([start, end])
            .range(range);

        it('should match the scale functionality of a d3 time scale', () => {
            var date = new Date(2015, 0, 19);
            expect(dateTime(date)).toEqual(referenceScale(date));

            date = new Date(2015, 0, 25);
            expect(dateTime(date)).toEqual(referenceScale(date));

            expect(dateTime(start)).toEqual(referenceScale(start));
            expect(dateTime(end)).toEqual(referenceScale(end));
        });

        it('should match the invert functionality of a d3 time scale', () => {
            expect(dateTime.invert(0)).toEqual(referenceScale.invert(0));
            expect(dateTime.invert(50)).toEqual(referenceScale.invert(50));
            expect(dateTime.invert(100)).toEqual(referenceScale.invert(100));
        });
    });

    describe('domain', () => {
        var endOfWeek = new Date(2015, 0, 24); // saturday 00:00 hours
        var end = new Date(2015, 0, 25, 12); // mid-day sunday

        var startOfWeek = new Date(2015, 0, 19); // monday 00:00 hours
        var start = new Date(2015, 0, 18, 12); // mid-day sunday

        it('should clamp the values supplied', () => {
            var dateTime = discontinuous(scaleTime())
                .discontinuityProvider(skipWeekends())
                .domain([start, end]);

            expect(dateTime.domain()[0]).toEqual(startOfWeek);
            expect(dateTime.domain()[1]).toEqual(endOfWeek);
        });
    });

    describe('nice', () => {
        it('should clamp the resulting domain', () => {
            var scale = discontinuous(scaleLinear())
                .discontinuityProvider(discontinuityRange([-0.1, 0.1], [9.9, 10.1]))
                .domain([0.2, 9.8]);

            // adapted scale would 'nice' to [0, 10], however, both these values
            // fall within discontinuities - so are clamped
            scale.nice();

            expect(scale.domain()[0]).toEqual(0.1);
            expect(scale.domain()[1]).toEqual(9.9);
        });
    });

    describe('linear', () => {

        describe('without discontinuities', () => {

            var range = [0, 100];
            var start = 10;
            var end = 60;

            var referenceScale = scaleLinear()
                    .domain([start, end])
                    .range(range);

            var scale = discontinuous(scaleLinear())
                .domain([start, end])
                .range(range);

            it('should match the scale functionality of a d3 linear scale', () => {
                expect(scale(20)).toEqual(referenceScale(20));
                expect(scale(50)).toEqual(referenceScale(50));

                expect(scale(start)).toEqual(referenceScale(start));
                expect(scale(end)).toEqual(referenceScale(end));
            });

            it('should match the invert functionality of a d3 time scale', () => {
                expect(scale.invert(0)).toEqual(referenceScale.invert(0));
                expect(scale.invert(50)).toEqual(referenceScale.invert(50));
                expect(scale.invert(100)).toEqual(referenceScale.invert(100));
            });
        });

        describe('with range discontinuities', () => {

            it('should scale correctly', () => {

                var scale = discontinuous(scaleLinear())
                    .discontinuityProvider(discontinuityRange([40, 90]))
                    .domain([0, 100])
                    .range([0, 100]);

                expect(scale(10)).toEqual(20);
            });
        });
    });
});
