const arrayEquals = (a, b) =>
    a.length === b.length && a.every((item, index) => b[index] === item);

// a matcher that compares array elements, but ignores any properties that
// have been added to the arrays
exports.toEqualArray = (actual, expected) => ({
    pass:
        actual.length === expected.length &&
        actual.every((item, index) => arrayEquals(item, expected[index]))
});
