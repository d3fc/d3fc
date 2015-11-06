describe('fc.data.samplers.modeMedian', function() {

    var data;
    var bucketGenerator;

    describe('simple data', function() {

        beforeEach(function() {
            data = [0, 1, 6, 4, 8, 4, 8, 9, 3, 5, 2, 10, 2, 4, 3, 8, 5];
            bucketGenerator = fc.data.samplers.modeMedian()
                                .value(function(d) { return d; });
        });

        it('should return original data if the number of buckets is longer than the data', function() {
            expect(bucketGenerator.bucketSize(100)(data))
                .toEqual(data);
        });

        it('should return the correct number of buckets if summarisation occurs', function() {
            var subsampledData = bucketGenerator.bucketSize(5)(data);
            expect(subsampledData.length).toEqual(5);
        });

        it('should have the first and last buckets be the first and last data points', function() {
            var subsampledData = bucketGenerator.bucketSize(5)(data);
            expect(subsampledData[0]).toEqual(0);
            expect(subsampledData[4]).toEqual(5);
        });

        it('should have 2 buckets with the global max and min', function() {
            var subsampledData = bucketGenerator.bucketSize(5)(data);
            expect(subsampledData[0]).toEqual(0);
            expect(subsampledData[3]).toEqual(10);
        });

        it('should return the most common number if there is one', function() {
            var subsampledData = bucketGenerator.bucketSize(5)(data);
            expect(subsampledData[1]).toEqual(4);
        });

        it('should return the middle data point if there is no mode', function() {
            var subsampledData = bucketGenerator.bucketSize(5)(data);
            expect(subsampledData[2]).toEqual(3);
        });
    });
});
