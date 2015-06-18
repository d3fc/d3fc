(function(d3, fc) {
    'use strict';

    describe('fc.utilities.rebind', function() {

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
            fc.utilities.rebind(target, source, 'fn');
            expect(target.fn())
                .toEqual(value);

            var newValue = {};
            expect(target.fn(newValue))
                .toEqual(target);
            expect(target.fn())
                .toEqual(newValue);
        });

        it('should allow a mapping object to be used', function() {
            fc.utilities.rebind(target, source, {'fn2': 'fn'});
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
                fc.utilities.rebind(target, source, {'fn2': 'foo'});
            })
            .toThrow(new Error('The method foo does not exist on the source object'));
        });
    });

}(d3, fc));