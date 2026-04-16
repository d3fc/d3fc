// verifies that two arrays of values are equal to a precision of 5 decimal places
exports.toBeEqualWithTolerance = (actual, expected, precision) => {
    precision = precision || 5;
    const result = {
        pass: true,
        message: ''
    };
    if (actual.length !== expected.length) {
        result.pass = false;
        result.message =
            'toBeEqualWithTolerance failed, expected.length=' +
            expected.length +
            ', actual.length=' +
            actual.length;
    } else {
        for (let i = 0; i < actual.length; i++) {
            const expectedDatum = expected[i];
            const actualDatum = actual[i];
            if (!(expectedDatum === undefined && actualDatum === undefined)) {
                const equalWithTolerance =
                    Math.abs(expectedDatum - actualDatum) <
                    Math.pow(10, -precision) / 2;
                if (!equalWithTolerance) {
                    result.pass = false;
                    result.message =
                        'toBeEqualWithTolerance failed - expectedDatum=' +
                        expectedDatum +
                        ', actualDatum=' +
                        actualDatum +
                        ', index=' +
                        i;
                    break;
                }
            }
        }
    }
    return result;
};
