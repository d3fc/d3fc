(function(d3, fc) {
    'use strict';

    describe('fc.indicators.algorithms.slidingWindow', function() {

        it('should not call accumulator for an empty data array', function() {
            var slidingWindow = fc.indicators.algorithms.slidingWindow()
                .accumulator(function() { throw new Error('FAIL'); })
                .windowSize(2);
            expect(slidingWindow([])).toEqual([]);
        });

        it('should not call accumulator for a data array smaller than the window windowSize', function() {
            var slidingWindow = fc.indicators.algorithms.slidingWindow()
                .accumulator(function() { throw new Error('FAIL'); })
                .windowSize(2);
            expect(slidingWindow([0])).toEqual([undefined]);
        });

        it('should call accumulator once for a data array equal in length to the window windowSize', function() {
            var data = [0, 1];
            var accumulatedValue = {};

            var slidingWindow = fc.indicators.algorithms.slidingWindow()
                .accumulator(function(d) {
                    expect(d).toEqual(data);
                    return accumulatedValue;
                })
                .windowSize(2);
            expect(slidingWindow(data)).toEqual([undefined, accumulatedValue]);
        });

        it('should call accumulator multiple times for data arrays longer than window windowSize', function() {
            var data = [0, 1, 2];
            var accumulatedValue = {};
            var i = 0;

            var slidingWindow = fc.indicators.algorithms.slidingWindow()
                .accumulator(function(d) {
                    i++;
                    // N.B. Jasmine Spies compare arguments by reference
                    // https://github.com/jasmine/jasmine/issues/444
                    if (i === 1) {
                        expect(d).toEqual([0, 1]);
                    } else if (i === 2) {
                        expect(d).toEqual([1, 2]);
                    } else {
                        throw new Error('FAIL ' + i);
                    }
                    return accumulatedValue;
                })
                .windowSize(2);
            expect(slidingWindow(data)).toEqual([undefined, accumulatedValue, accumulatedValue]);
        });

        it('should work with the built-in d3 accumulator functions', function() {
            var data = [0, 1, 2];

            var movingAverage = fc.indicators.algorithms.slidingWindow()
                .accumulator(d3.mean)
                .windowSize(2);
            expect(movingAverage(data)).toEqual([undefined, 0.5, 1.5]);
        });
    });

}(d3, fc));
