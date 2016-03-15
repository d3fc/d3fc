const map = require('../../build/d3fc-rebind').map;

describe('transform/map', function() {

    it('should include a mapped value', function() {
        const transform = map({ 'a': 'b' });
        expect(transform('a')).toEqual('b');
    });

    it('should exclude an unmapped value', function() {
        const transform = map({ 'a': 'b' });
        expect(transform('b')).toBeFalsy();
    });
});
