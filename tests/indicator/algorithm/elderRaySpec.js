describe('fc.indicator.algorithm.calculator.elderRay', function() {

    var elderRay;
    var testData;

    beforeEach(function() {
        elderRay = fc.indicator.algorithm.calculator.elderRay();
        testData = [
            {high: 112.28, low: 109.49, close: 112.12},
            {high: 110.19, low: 108.21, close: 109.5},
            {high: 111.77, low: 109.41, close: 110.78},
            {high: 111.74, low: 109.77, close: 111.31},
            {high: 111.37, low: 109.07, close: 110.78},
            {high: 111.01, low: 107.55, close: 110.38},
            {high: 109.62, low: 107.31, close: 109.58},
            {high: 111.54, low: 108.73, close: 110.3},
            {high: 113.51, low: 107.86, close: 109.06},
            {high: 114.57, low: 112.44, close: 112.44}];
    });

    it('should have a period property defaulted to 13', function() {
        expect(elderRay.period()).toBe(13);
    });
    it('should return a data set same length as input', function() {
        var result = elderRay(testData);
        expect(result.length).toBe(testData.length);
    });
});
