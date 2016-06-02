beforeEach(() =>
    jasmine.addMatchers({
        // verifies that two arrays of values are equal to a precision of 5 decimal places
        toBeEqualWithTolerance: function() {
            return {
                compare: function(actual, expected, precision) {
                    precision = precision || 5;
                    var result = {
                        pass: true,
                        message: ''
                    };
                    if (actual.length !== expected.length) {
                        result.pass = false;
                        result.message = 'toBeEqualWithTolerance failed, expected.length=' + expected.length +
                            ', actual.length=' + actual.length;
                    } else {
                        for (var i = 0; i < actual.length; i++) {
                            var expectedDatum = expected[i];
                            var actualDatum = actual[i];
                            if (!(expectedDatum === undefined && actualDatum === undefined)) {
                                var equalWithTolerance = Math.abs(expectedDatum - actualDatum) < (Math.pow(10, -precision) / 2);
                                if (!equalWithTolerance) {
                                    result.pass = false;
                                    result.message = 'toBeEqualWithTolerance failed - expectedDatum=' + expectedDatum +
                                        ', actualDatum=' + actualDatum + ', index=' + i;
                                    break;
                                }
                            }
                        }
                    }
                    return result;
                }
            };
        }
    })
);
