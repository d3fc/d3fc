const { toBeEqualWithTolerance } = require('./matchers/toBeEqualWithTolerance');
const { toEqualArray } = require('./matchers/toEqualArray');

expect.extend({
    toBeEqualWithTolerance,
    toEqualArray
});

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextEncoder;
