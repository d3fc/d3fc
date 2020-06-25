import bucket from '../src/bucket';

describe('bucket', () => {

    let dataBucketer;
    let data;

    beforeEach(() => {
        dataBucketer = bucket();
    });

    it('should have a bucket size of 10 by default', () => {
        const bucketSize = dataBucketer.bucketSize();
        expect(bucketSize).toEqual(10);
    });

    describe('simple data', () => {

        beforeEach(() => {
            data = [0, 1, 6, 4, 8, 4, 8, 9, 3, 5, 2, 10, 2, 4, 3, 8, 5];
        });

        it('should return the correct number of buckets if the bucket size is less than the data length and greater than 1', () => {
            const bucketedData = dataBucketer.bucketSize(3)(data);
            expect(bucketedData).toHaveLength(6);
            expect(bucketedData[0]).toEqual([0, 1, 6]);
            expect(bucketedData[1]).toEqual([4, 8, 4]);
            expect(bucketedData[2]).toEqual([ 8, 9, 3 ]);
            expect(bucketedData[3]).toEqual([5, 2, 10]);
            expect(bucketedData[4]).toEqual([2, 4, 3]);
            expect(bucketedData[5]).toEqual([8, 5]);
        });

        it('should return a single bucket if the bucket size is the same as the data length', () => {
            const bucketedData = dataBucketer.bucketSize(data.length)(data);
            expect(bucketedData).toEqual([data]);
        });

        it('should return a single bucket if the bucket size is larger than the data length', () => {
            const bucketedData = dataBucketer.bucketSize(100)(data);
            expect(bucketedData).toEqual([data]);
        });

        it('should return the same number of buckets as the data length if the bucket size is 1', () => {
            const bucketedData = dataBucketer.bucketSize(1)(data);
            expect(bucketedData).toEqual([[0], [1], [6], [4], [8], [4], [8], [9], [3], [5], [2], [10], [2], [4], [3], [8], [5]]);
        });

        it('should return the same number of buckets as the data length if the bucket size is less than 1', () => {
            const bucketedData = dataBucketer.bucketSize(0.5)(data);
            expect(bucketedData).toEqual([[0], [1], [6], [4], [8], [4], [8], [9], [3], [5], [2], [10], [2], [4], [3], [8], [5]]);
        });

        it('should return the same number of buckets as the data length if the bucket size is less than 1', () => {
            const bucketedData = dataBucketer.bucketSize(0.5)(data);
            expect(bucketedData).toEqual([[0], [1], [6], [4], [8], [4], [8], [9], [3], [5], [2], [10], [2], [4], [3], [8], [5]]);
        });

        it('should create a last bucket with (data.length % bucketSize) data points', () => {
            const bucketSize = 3;
            const bucketedData = dataBucketer.bucketSize(bucketSize)(data);

            const lastBucket = bucketedData[bucketedData.length - 1];
            const lastBucketSize = lastBucket.length;

            expect(lastBucketSize).toEqual(data.length % bucketSize);
            expect(lastBucket).toEqual([8, 5]);
        });

    });

});
