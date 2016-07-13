import prefix  from '../../src/transform/prefix';

describe('transform/prefix', function() {

    it('should transform a value', function() {
        const transform = prefix('a');
        expect(transform('value')).toEqual('aValue');
    });
});
