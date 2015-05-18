(function(d3, fc) {
    'use strict';

    describe('fc.indicators.algorithms.undefinedInputAdapter', function() {

        var algorithm = fc.indicators.algorithms.slidingWindow()
                .accumulator(d3.mean)
                .windowSize(2);
        var adaptedAlgorithm = fc.indicators.algorithms.undefinedInputAdapter(algorithm);

        it('should leave the output un-affacted when there are no leading undefined values', function() {
            var data = [1, 2, 3, 4, 5, 6];

            expect(adaptedAlgorithm(data))
                .toEqual(algorithm(data));
        });

        it('should add an undefined value to the output for each leading undefined value', function() {
            var data = [undefined, undefined, 1, 2];

            expect(adaptedAlgorithm(data))
                .toEqual([undefined, undefined, undefined, 1.5]);
        });

        it('should create an undefined array if the input array is all undefined', function() {
            var data = [undefined, undefined, undefined];

            expect(adaptedAlgorithm(data))
                .toEqual([undefined, undefined, undefined]);
        });

        it('should handle empty arrays', function() {
            var data = [];

            expect(adaptedAlgorithm(data))
                .toEqual([]);
        });

    });

}(d3, fc));
