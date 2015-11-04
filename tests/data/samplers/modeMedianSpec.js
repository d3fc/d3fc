describe('fc.data.samplers.modeMedian', function() {

    var data;
    var bucketGenerator;

    describe('simple data', function() {

        beforeEach(function() {
            data = [0, 1, 6, 4, 8, 4, 8, 9, 3, 5, 2, 10, 2, 4, 3, 8, 5];
            bucketGenerator = fc.data.samplers.modeMedian()
                                .field(function(d) { return d; });
        });

        it('should return original data if the number of buckets is longer than the data', function() {
            expect(bucketGenerator.number(100)(data))
                .toEqual(data);
        });

        it('should return the correct number of buckets if summarisation occurs', function() {
            var subsampledData = bucketGenerator.number(5)(data);
            expect(subsampledData.length).toEqual(5);
        });

        it('should have the first and last buckets be the first and last data points', function() {
            var subsampledData = bucketGenerator.number(5)(data);
            expect(subsampledData[0]).toEqual(0);
            expect(subsampledData[4]).toEqual(5);
        });

        it('should have 2 buckets with the global max and min', function() {
            var subsampledData = bucketGenerator.number(5)(data);
            expect(subsampledData[0]).toEqual(0);
            expect(subsampledData[3]).toEqual(10);
        });

        it('should return the most common number if there is one', function() {
            var subsampledData = bucketGenerator.number(5)(data);
            expect(subsampledData[1]).toEqual(4);
        });

        it('should return the middle data point if there is no mode', function() {
            var subsampledData = bucketGenerator.number(5)(data);
            expect(subsampledData[2]).toEqual(3);
        });
    });

    describe('accessor data', function() {

        beforeEach(function() {
            data = [
                {x: 1, y: 0},
                {x: 2, y: 1},
                {x: 3, y: 6},
                {x: 4, y: 4},
                {x: 5, y: 8},
                {x: 6, y: 4},
                {x: 7, y: 8},
                {x: 8, y: 9},
                {x: 9, y: 3},
                {x: 10, y: 5},
                {x: 11, y: 2},
                {x: 12, y: 10},
                {x: 13, y: 2},
                {x: 14, y: 4}
            ];
        });

        it('should use the accessor function provided', function() {
            bucketGenerator = fc.data.samplers.modeMedian()
                                .field(function(d) { return d.y; });
            var subsampledData = bucketGenerator.number(4)(data);
            expect(subsampledData[0].y).toEqual(0);
            expect(subsampledData[2].y).toEqual(10);
        });

        it('should use the accessor string provided', function() {
            bucketGenerator = fc.data.samplers.modeMedian()
                                .field('y');
            var subsampledData = bucketGenerator.number(4)(data);
            expect(subsampledData[0].y).toEqual(0);
            expect(subsampledData[2].y).toEqual(10);
        });

    });
});
