import include  from '../../src/transform/include';

describe('transform/include', function() {

    it('should include by string', function() {
        const transform = include('a');
        expect(transform('a')).toEqual('a');
    });

    it('should not include by unmatched string', function() {
        const transform = include('a');
        expect(transform('b')).toBeFalsy();
    });

    it('should include by regex', function() {
        const transform = include(/./);
        expect(transform('a')).toEqual('a');
    });

    it('should not include by unmatched regex', function() {
        const transform = include(/a/);
        expect(transform('b')).toBeFalsy();
    });

    it('should include by string and regex', function() {
        const transform = include(/a/, 'b');
        expect(transform('a')).toEqual('a');
        expect(transform('b')).toEqual('b');
    });
});
