const _movingAverage = require('../build/d3fc-technical-indicator').movingAverage;

describe('movingAverage', function() {

    it('should return an empty array for an empty data array', function() {
        var movingAverage = _movingAverage();
        expect(movingAverage([])).toEqual([]);
    });

    it('should return undefined values when the array is less than EMA days', function() {
        var movingAverage = _movingAverage()
            .windowSize(4);
        expect(movingAverage([1, 2, 3])).toEqual([undefined, undefined, undefined]);
    });

    it('should return the average for the first moving average value', function() {
        var movingAverage = _movingAverage()
            .windowSize(3);
        expect(movingAverage([1, 2, 3])).toEqual([undefined, undefined, 2]);
    });

    it('should give the correct answer!', function() {
        var movingAverage = _movingAverage()
            .windowSize(3);
        expect(movingAverage([3, 6, 9, 0, 0, 3, 6, 9]))
            .toEqual([undefined, undefined, 6, 5, 3, 1, 3, 6]);
    });
});
