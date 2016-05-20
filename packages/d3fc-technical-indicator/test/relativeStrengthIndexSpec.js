const relativeStrengthIndex = require('../build/d3fc-technical-indicator').relativeStrengthIndex;

// Tested using data found in 'Technical Analysis from A to Z, 2nd Edition' By Steven B. Achelis (Table 71, Pg. 299)

describe('relativeStrengthIndex', function() {

    var rsi;

    function verifyResult(expected, result) {
        expect(result.length).toEqual(expected.length);

        for (var i = 0; i < expected.length; i++) {
            if (result[i]) {
                expect(result[i]).toBeCloseTo(expected[i], 0.001);
            } else {
                expect(result[i]).not.toBeDefined();
            }
        }
    }

    beforeEach(function() {
        rsi = relativeStrengthIndex()
            .value((d) => d.close)
            .period(5);
    });

    it('should not return any RSI values when data size is zero', function() {
        var data = [];

        expect(rsi(data)).toEqual([]);
    });

    it('should return one undefined RSI value when data size is one', function() {
        var data = [
            {close: 37.875}
        ];

        var result = rsi(data);

        var expected = [
            undefined
        ];

        verifyResult(expected, result);
    });

    it('should return undefined RSI values when data size is less than period size', function() {
        var data = [
            {close: 37.875},
            {close: 39.5},
            {close: 38.75},
            {close: 39.8125}
        ];

        var result = rsi(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            undefined
        ];

        verifyResult(expected, result);
    });

    it('should return undefined RSI values when data size equals period size', function() {
        var data = [
            {close: 37.875},
            {close: 39.5},
            {close: 38.75},
            {close: 39.8125},
            {close: 40}
        ];

        var result = rsi(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        ];

        verifyResult(expected, result);
    });

    it('should return one RSI value when data size equals period size plus 1', function() {
        var data = [
            {close: 37.875},
            {close: 39.5},
            {close: 38.75},
            {close: 39.8125},
            {close: 40},
            {close: 39.875}
        ];

        var result = rsi(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            76.6667
        ];

        verifyResult(expected, result);
    });

    it('should return two RSI values when data size equals period size plus 2', function() {
        var data = [
            {close: 37.875},
            {close: 39.5},
            {close: 38.75},
            {close: 39.8125},
            {close: 40},
            {close: 39.875},
            {close: 40.1875}
        ];

        var result = rsi(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            76.6667,
            78.8679
        ];

        verifyResult(expected, result);
    });

    it('should work with test data', function() {
        var data = [
            {close: 37.875},
            {close: 39.5},
            {close: 38.75},
            {close: 39.8125},
            {close: 40},
            {close: 39.875},
            {close: 40.1875},
            {close: 41.25},
            {close: 41.125},
            {close: 41.625},
            {close: 41.25},
            {close: 40.1875},
            {close: 39.9375},
            {close: 39.9375},
            {close: 40.5},
            {close: 41.9375},
            {close: 42.25},
            {close: 42.25},
            {close: 41.875},
            {close: 41.875}
        ];

        var result = rsi(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            76.6667,
            78.8679,
            84.9158,
            81.486,
            84.5968,
            73.0851,
            49.3173,
            45.0119,
            45.0119,
            57.9252,
            75.9596,
            78.4676,
            78.4676,
            65.6299,
            65.6299
        ];

        verifyResult(expected, result);
    });

    it('should produce correct values on multiple calls', function() {
        var data = [
            {close: 37.875},
            {close: 39.5},
            {close: 38.75},
            {close: 39.8125},
            {close: 40},
            {close: 39.875},
            {close: 40.1875},
            {close: 41.25},
            {close: 41.125},
            {close: 41.625},
            {close: 41.25},
            {close: 40.1875},
            {close: 39.9375},
            {close: 39.9375},
            {close: 40.5},
            {close: 41.9375},
            {close: 42.25},
            {close: 42.25},
            {close: 41.875},
            {close: 41.875}
        ];

        var result = rsi(data);
        result = rsi(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            76.6667,
            78.8679,
            84.9158,
            81.486,
            84.5968,
            73.0851,
            49.3173,
            45.0119,
            45.0119,
            57.9252,
            75.9596,
            78.4676,
            78.4676,
            65.6299,
            65.6299
        ];

        verifyResult(expected, result);
    });
});

