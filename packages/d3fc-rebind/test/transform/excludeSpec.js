import exclude  from '../../src/transform/exclude';

describe('transform/exclude', function() {

    it('should exclude by string', function() {
        const transform = exclude('a');
        expect(transform('a')).toBeFalsy();
    });

    it('should not exclude by unmatched string', function() {
        const transform = exclude('a');
        expect(transform('b')).toEqual('b');
    });

    it('should exclude by regex', function() {
        const transform = exclude(/./);
        expect(transform('a')).toBeFalsy();
    });

    it('should not exclude by unmatched regex', function() {
        const transform = exclude(/a/);
        expect(transform('b')).toEqual('b');
    });

    it('should exclude by string and regex', function() {
        const transform = exclude(/a/, 'b');
        expect(transform('a')).toBeFalsy();
        expect(transform('b')).toBeFalsy();
    });
});
