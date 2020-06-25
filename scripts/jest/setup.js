const { toBeEqualWithTolerance } = require('./matchers/toBeEqualWithTolerance');
const { toEqualArray } = require('./matchers/toEqualArray');

expect.extend({
    toBeEqualWithTolerance,
    toEqualArray
});
