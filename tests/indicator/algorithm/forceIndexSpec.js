// Tested using data found at http://investexcel.net/force-index-for-technical-traders/

describe('fc.indicator.algorithm.calculator.forceIndex', function() {

    var force;

    function verifyResult(expected, result) {
        expect(result.length).toEqual(expected.length);

        for (var i = 0; i < expected.length; i++) {
            if (result[i]) {
                expect(result[i]).toBeCloseTo(expected[i], 0.000001);
            } else {
                expect(result[i]).not.toBeDefined();
            }
        }
    }

    beforeEach(function() {
        force = fc.indicator.algorithm.calculator.forceIndex().windowSize(3);
    });

    it('should not return any force index values when data size is zero', function() {
        var data = [];

        expect(force(data)).toEqual([]);
    });

    it('should return one undefined force index value when data size is one', function() {
        var data = [
            {close: 50.8, volume: 20177800}
        ];

        var result = force(data);

        var expected = [
            undefined
        ];

        verifyResult(expected, result);
    });

    it('should return undefined force index values when data size is less than window size', function() {
        var data = [
            {close: 50.8, volume: 20177800},
            {close: 51.56, volume: 22429800}
        ];

        var result = force(data);

        var expected = [
            undefined,
            undefined
        ];

        verifyResult(expected, result);
    });

    it('should return undefined force index values when data size equals window size', function() {
        var data = [
            {close: 50.8, volume: 20177800},
            {close: 51.56, volume: 22429800},
            {close: 51.35, volume: 17645800}
        ];

        var result = force(data);

        var expected = [
            undefined,
            undefined,
            undefined
        ];

        verifyResult(expected, result);
    });

    it('should return one force index value when data size equals window size plus 1', function() {
        var data = [
            {close: 50.8, volume: 20177800},
            {close: 51.56, volume: 22429800},
            {close: 51.35, volume: 17645800},
            {close: 52.45, volume: 18790000}
        ];

        var result = force(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            11336676.6666667
        ];

        verifyResult(expected, result);
    });

    it('should return two force index values when data size equals window size plus 2', function() {
        var data = [
            {close: 50.8, volume: 20177800},
            {close: 51.56, volume: 22429800},
            {close: 51.35, volume: 17645800},
            {close: 52.45, volume: 18790000},
            {close: 51.65, volume: 14946000}
        ];

        var result = force(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            11336676.6666667,
            -310061.666666677
        ];

        verifyResult(expected, result);
    });

    it('should generate force index correctly with test data', function() {
        var data = [
            {close: 50.8, volume: 20177800},
            {close: 51.56, volume: 22429800},
            {close: 51.35, volume: 17645800},
            {close: 52.45, volume: 18790000},
            {close: 51.65, volume: 14946000},
            {close: 51.51, volume: 13656400},
            {close: 52.18, volume: 16368600},
            {close: 52.4, volume: 16784800},
            {close: 52.36, volume: 20740200},
            {close: 52.31, volume: 28405800},
            {close: 52.48, volume: 18346400},
            {close: 52.46, volume: 20805000},
            {close: 52.24, volume: 20718000},
            {close: 51.8, volume: 17401400},
            {close: 50.26, volume: 57969600},
            {close: 51.08, volume: 23525400},
            {close: 50.33, volume: 23502600},
            {close: 50.12, volume: 21933800},
            {close: 50.03, volume: 26030800},
            {close: 50.05, volume: 16270200}
        ];

        var result = force(data);

        var expected = [
            undefined,
            undefined,
            undefined,
            11336676.6666667,
            -310061.666666677,
            -1110978.83333334,
            4927991.58333334,
            4310323.79166666,
            1740357.89583334,
            160033.94791671,
            1639460.97395831,
            611680.486979194,
            -1973139.75651039,
            -4814877.87825524,
            -47044030.9391276,
            -13876601.4695638,
            -15751775.7347819,
            -10178936.867391,
            -6260854.43369543,
            -2967725.21684775
        ];

        verifyResult(expected, result);
    });
});
