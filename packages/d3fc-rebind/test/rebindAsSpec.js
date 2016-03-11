const rebindAs = require('../build/d3fc-rebind').rebindAs;

describe('rebindAs', function() {

    var source, target, value;

    beforeEach(function() {
        value = {};
        source = {
            fn: function(arg) {
                if (!arguments.length) {
                    return value;
                }
                value = arg;
                return source;
            }
        };
        target = {};
    });

    it('should allow a mapping object to be used', function() {
        rebindAs(target, source, {'fn2': 'fn'});
        expect(target.fn2())
            .toEqual(value);

        var newValue = {};
        expect(target.fn2(newValue))
            .toEqual(target);
        expect(target.fn2())
            .toEqual(newValue);
    });

    it('should throw if a method does not exist on the source object', function() {
        expect(function() {
            rebindAs(target, source, {'fn2': 'foo'});
        })
        .toThrow(new Error('Attempt to rebind foo which isn\'t a function on the source object'));
    });
});
