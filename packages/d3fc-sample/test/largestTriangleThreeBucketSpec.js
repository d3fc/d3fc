import largestTriangleThreeBucket from '../src/largestTriangleThreeBucket';

describe('largestTriangleThreeBucket', function() {

    var data;
    var dataGenerator;

    describe('simple xy data', function() {

        beforeEach(function() {

            data = [
                { x: 0, y: 6 }, // Bucket 1
                { x: 1, y: 8 }, // Bucket 2
                { x: 2, y: 1 },
                { x: 3, y: 9 },
                { x: 4, y: 12 }, // Bucket 3
                { x: 5, y: 3 },
                { x: 6, y: 9 },
                { x: 7, y: 1 }, // Bucket 4
                { x: 8, y: 15 },
                { x: 9, y: 7 },
                { x: 10, y: 5 }, // Bucket 5
                { x: 11, y: 13 },
                { x: 12, y: 0 },
                { x: 13, y: 9 }, // Bucket 6
                { x: 14, y: 2 },
                { x: 15, y: 4 },
                { x: 16, y: 5 } // Bucket 7
            ];
            dataGenerator = largestTriangleThreeBucket()
                              .bucketSize(3)
                              .x(function(d) { return d.x; })
                              .y(function(d) { return d.y; });
        });

        it('should return the original data set if the bucket size is larger than the data', function() {
            var sampledData = dataGenerator.bucketSize(100)(data);
            expect(sampledData).toEqual(data);
        });

        it('should return the correct number of data points if the bucket size is less than the data', function() {
            var sampledData = dataGenerator(data);
            expect(sampledData).toHaveLength(7);
        });

        it('should return the first and last data points as the first and last buckets', function() {
            var sampledData = dataGenerator(data);
            expect(sampledData[0].x).toEqual(data[0].x);
            expect(sampledData[sampledData.length - 1].x).toEqual(data[data.length - 1].x);
        });

        it('should return values that form the largest triangle in that bucket', function() {
            var sampledData = dataGenerator(data);
            expect(sampledData[1].x).toEqual(2);
            expect(sampledData[2].x).toEqual(4);
            expect(sampledData[3].x).toEqual(7);
            expect(sampledData[4].x).toEqual(12);
            expect(sampledData[5].x).toEqual(13);
        });

    });

    describe('array data', function() {
        beforeEach(function() {
            data = [
                [0, 6], // Bucket 1
                [1, 8], // Bucket 2
                [2, 1],
                [3, 9],
                [4, 12] // Bucket 3
            ];
            dataGenerator = largestTriangleThreeBucket()
                              .bucketSize(3)
                              .x(function(d) { return d[0]; })
                              .y(function(d) { return d[1]; });
        });

        it('should return a 2-dimensional array', function() {
            var sampledData = dataGenerator(data);

            expect(sampledData[0][0]).toEqual(0);
            expect(sampledData[1][0]).toEqual(2);
            expect(sampledData[2][0]).toEqual(4);
        });
    });

});
