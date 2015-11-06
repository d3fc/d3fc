describe('fc.util.scale', function() {

    describe('range', function() {
        it('should return the correct range for linear scales', function() {
            var scale = d3.scale.linear()
                .range([10, 100]);
            expect(fc.util.scale.range(scale)).toEqual([10, 100]);
        });

        it('should return the correct range for ordinal scales', function() {
            var scale = d3.scale.ordinal()
                .domain(['a', 'b', 'c'])
                .rangePoints([10, 100], 1);
            expect(fc.util.scale.range(scale)).toEqual([10, 100]);
        });

        it('should return the correct range for ordinal scales where the range is inverted', function() {
            var scale = d3.scale.ordinal()
                .domain(['a', 'b', 'c'])
                .rangePoints([100, 10], 1);
            expect(fc.util.scale.range(scale)).toEqual([100, 10]);
        });

        it('should return the the non inverted range if the scale contains a single item', function() {
            // NOTE: See the implementation detail, this is unfortunately the best we can do.
            var scale = d3.scale.ordinal()
                .domain(['a'])
                .rangePoints([100, 10], 1);
            expect(fc.util.scale.range(scale)).toEqual([10, 100]);
        });
    });

});
