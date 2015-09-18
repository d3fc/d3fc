describe('fc.util.rebind', function() {

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
        fc.util.rebind(target, source, 'fn');
        expect(target.fn())
            .toEqual(value);

        var newValue = {};
        expect(target.fn(newValue))
            .toEqual(target);
        expect(target.fn())
            .toEqual(newValue);
    });

    it('should allow a mapping object to be used', function() {
        fc.util.rebind(target, source, {'fn2': 'fn'});
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
            fc.util.rebind(target, source, {'fn2': 'foo'});
        })
        .toThrow(new Error('The method foo does not exist on the source object'));
    });
});

describe('fc.util.rebindAll', function() {

    var source, target, value;

    beforeEach(function() {
        value = {};
        source = d3.svg.axis();
        target = {};
    });

    it('should rebind all properties with the given prefix', function() {
        fc.util.rebindAll(target, source, 'x');
        expect(target.xScale()).toEqual(source.scale());
        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated array of properties', function() {
        fc.util.rebindAll(target, source, 'x', ['scale', 'orient']);

        expect(target.xScale).not.toBeDefined();
        expect(target.xOrient).not.toBeDefined();

        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated property', function() {
        fc.util.rebindAll(target, source, 'x', 'scale');

        expect(target.xScale).not.toBeDefined();

        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated properties var-args', function() {
        fc.util.rebindAll(target, source, 'x', 'scale', 'orient');

        expect(target.xScale).not.toBeDefined();
        expect(target.xOrient).not.toBeDefined();

        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should throw if an excluded property does not exist on the source', function() {
        expect(function() {
            fc.util.rebindAll(target, source, 'x', ['fish']);
        })
        .toThrow(new Error('The method fish does not exist on the source object'));
    });

    it('should support regular expression exclusions', function() {
        fc.util.rebindAll(target, source, 'x', 'scale', /tick[\w]*/);

        expect(target.xScale).not.toBeDefined();
        expect(target.xTickValues).not.toBeDefined();
        expect(target.xTickFormat).not.toBeDefined();
        expect(target.xTickPadding).not.toBeDefined();
        expect(target.xTickSubdivide).not.toBeDefined();

        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
    });
});
