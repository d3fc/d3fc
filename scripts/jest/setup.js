const { toBeEqualWithTolerance } = require('./matchers/toBeEqualWithTolerance');
const { toEqualArray } = require('./matchers/toEqualArray');

if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
    global.TextDecoder = require('util').TextDecoder;
}

expect.extend({
    toBeEqualWithTolerance,
    toEqualArray
});
