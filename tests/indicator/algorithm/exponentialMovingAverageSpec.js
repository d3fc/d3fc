describe('fc.indicator.algorithm.calculator.exponentialMovingAverage', function () {

    it('should return an empty array for an empty data array', function () {
        var ema = fc.indicator.algorithm.calculator.exponentialMovingAverage();
        expect(ema([])).toEqual([]);
    });

    it('should return undefined values when the array is less than EMA days', function () {
        var ema = fc.indicator.algorithm.calculator.exponentialMovingAverage()
            .windowSize(4);
        expect(ema([1, 2, 3])).toEqual([undefined, undefined, undefined]);
    });

    it('should return the average for the first EMA value', function () {
        var ema = fc.indicator.algorithm.calculator.exponentialMovingAverage()
            .windowSize(3);
        expect(ema([1, 2, 3])).toEqual([undefined, undefined, 2]);
    });

    it('should give the correct answer!', function () {
        var ema = fc.indicator.algorithm.calculator.exponentialMovingAverage()
            .windowSize(5);
        expect(ema([1, 3, 2, 4, 5, 3, 0, 2]))
            .toEqual([undefined, undefined, undefined, undefined, 3, 3, 2, 2]);
    });
});
