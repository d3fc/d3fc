const rebind = require('../build/d3fc-rebind').rebind;

describe('rebind', function() {

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

    it('should have the same behaviour as d3.rebind', function() {
        var targetObject = rebind(target, source, 'fn');
        expect(targetObject).toBe(target);

        expect(target.fn())
            .toEqual(value);

        var newValue = {};
        expect(target.fn(newValue))
            .toEqual(target);
        expect(target.fn())
            .toEqual(newValue);
    });
});
