const stochasticOscillator = require('../build/d3fc-technical-indicator').stochasticOscillator;

describe('stochasticOscillator', function() {

    var stoc;
    var testData;

    beforeEach(function() {
        stoc = stochasticOscillator();
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

    it('should have a kWindowSize property defaulted to 5', function() {
        var func = stoc.kWindowSize()();
        expect(func).toBe(5);
    });
    it('should have a dWindowSize property defaulted to 3', function() {
        var func = stoc.dWindowSize()();
        expect(func).toBe(3);
    });
    it('should return a data set same length as input', function() {
        var result = stoc(testData);
        expect(result.length).toBe(testData.length);
    });
    it('should have undefined %k value for first 4 points', function() {
        var result = stoc(testData);
        expect(result[0].k).not.toBeDefined('index = 0');
        expect(result[1].k).not.toBeDefined('index = 1');
        expect(result[2].k).not.toBeDefined('index = 2');
        expect(result[3].k).not.toBeDefined('index = 3');
    });
    it('should calculate a %k value of about 63.1449 for the point 5', function() {
        var result = stoc(testData);
        expect(result[4].k).toBeCloseTo(63.1449, 0.0001);
    });
    it('should calculate a %k value of about 70.6612 for the point 9', function() {
        var result = stoc(testData);
        expect(result[9].k).toBeCloseTo(70.6612, 0.0001);
    });
    it('should have undefined %d value for first 6 points', function() {
        var result = stoc(testData);
        expect(result[0].d).not.toBeDefined('index = 0');
        expect(result[1].d).not.toBeDefined('index = 1');
        expect(result[2].d).not.toBeDefined('index = 2');
        expect(result[3].d).not.toBeDefined('index = 3');
        expect(result[4].d).not.toBeDefined('index = 4');
        expect(result[5].d).not.toBeDefined('index = 5');
    });
    it('should calculate a %d value of about 60.3678 for the point 6', function() {
        var result = stoc(testData);
        expect(result[6].d).toBeCloseTo(60.3678, 0.0001);
    });
    it('should calculate a %d value of about 55.4604 for the point 9', function() {
        var result = stoc(testData);
        expect(result[9].d).toBeCloseTo(55.4604, 0.0001);
    });
});
