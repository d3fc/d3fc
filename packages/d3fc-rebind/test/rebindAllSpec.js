import prefix  from '../src/transform/prefix';
import exclude  from '../src/transform/exclude';
import rebindAll  from '../src/rebindAll';

describe('rebindAll', function() {

    var source, target;

    function createProperty(value) {
        return function(arg) {
            if (!arguments.length) {
                return value;
            }
            value = arg;
            return source;
        };
    }

    beforeEach(function() {
        source = {
            scale: createProperty(),
            orient: createProperty(),
            tickValues: createProperty(),
            tickFormat: createProperty(),
            innerTickSize: createProperty(),
            outerTickSize: createProperty(),
            tickPadding: createProperty(),
            tickSubdivide: createProperty()
        };
        target = {};
    });

    it('should rebind all properties', function() {
        rebindAll(target, source);
        expect(target.scale()).toEqual(source.scale());
        expect(target.orient()).toEqual(source.orient());
        expect(target.tickValues()).toEqual(source.tickValues());
        expect(target.tickFormat()).toEqual(source.tickFormat());
        expect(target.innerTickSize()).toEqual(source.innerTickSize());
        expect(target.outerTickSize()).toEqual(source.outerTickSize());
        expect(target.tickPadding()).toEqual(source.tickPadding());
        expect(target.tickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind all properties with the given prefix', function() {
        rebindAll(target, source, prefix('x'));
        expect(target.xScale()).toEqual(source.scale());
        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated property', function() {
        rebindAll(target, source, exclude('scale'), prefix('x'));

        expect(target.xScale).not.toBeDefined();

        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should support regular expression exclusions', function() {
        rebindAll(target, source, exclude('scale', /tick[\w]*/), prefix('x'));

        expect(target.xScale).not.toBeDefined();
        expect(target.xTickValues).not.toBeDefined();
        expect(target.xTickFormat).not.toBeDefined();
        expect(target.xTickPadding).not.toBeDefined();
        expect(target.xTickSubdivide).not.toBeDefined();

        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
    });

    it('should return the target', function() {
        expect(rebindAll(target, source)).toBe(target);
    });
});
