var bollingerBands = require('d3fc-technical-indicator').bollingerBands;

describe('fc.indicator.algorithm.merge', function() {

    var testData = [
        {high: 112.28, low: 109.49, close: 112.12},
        {high: 110.19, low: 108.21, close: 109.5},
        {high: 111.77, low: 109.41, close: 110.78},
        {high: 111.74, low: 109.77, close: 111.31},
        {high: 111.37, low: 109.07, close: 110.78},
        {high: 111.01, low: 107.55, close: 110.38},
        {high: 109.62, low: 107.31, close: 109.58},
        {high: 111.54, low: 108.73, close: 110.3},
        {high: 113.51, low: 107.86, close: 109.06},
        {high: 114.57, low: 112.44, close: 112.44}
    ];

    var bollinger = bollingerBands();

    var merge = fc.indicator.algorithm.merge()
        .algorithm(bollinger)
        .merge(function(datum, indicator) {
            return {
                high: datum.high,
                low: datum.low,
                close: datum.close,
                indicator: indicator
            };
        });

    it('should not mutate the source data', function() {
        merge(testData);

        testData.forEach(function(datum) {
            expect(datum.hasOwnProperty('indicator')).toBe(false);
        });
    });
});
