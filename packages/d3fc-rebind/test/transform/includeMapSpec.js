import includeMap  from '../../src/transform/includeMap';

describe('transform/includeMap', function() {

    it('should include a mapped value', function() {
        const transform = includeMap({ 'a': 'b' });
        expect(transform('a')).toEqual('b');
    });

    it('should exclude an unmapped value', function() {
        const transform = includeMap({ 'a': 'b' });
        expect(transform('b')).toBeFalsy();
    });
});
