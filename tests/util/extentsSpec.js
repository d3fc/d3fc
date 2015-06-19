(function(d3, fc) {
    'use strict';

    describe('fc.util.extent', function() {

        function obj(val) {
            return {
                high: val + 5,
                low: val - 5
            };
        }

        it('should compute extents based on the supplied fields', function() {
            var data = [obj(1), obj(2), obj(10)];

            var extents = fc.util.extent(data, ['high']);
            expect(extents[0]).toEqual(6);
            expect(extents[1]).toEqual(15);

            extents = fc.util.extent(data, ['high', 'low']);
            expect(extents[0]).toEqual(-4);
            expect(extents[1]).toEqual(15);
        });

        it('should support a single field name', function() {
            var data = [obj(1), obj(2), obj(10)];

            var extents = fc.util.extent(data, 'high');
            expect(extents[0]).toEqual(6);
            expect(extents[1]).toEqual(15);
        });

        it('should support arrays of arrays', function() {
            var data = [obj(2), obj(1)];
            var data2 = [obj(4), obj(5)];

            var extents = fc.util.extent([data, data2], 'high');
            expect(extents[0]).toEqual(6);
            expect(extents[1]).toEqual(10);
        });

        it('should support accessor functions', function() {
            var data = [obj(1), obj(2), obj(10)];

            var extents = fc.util.extent(data, [function(d) { return d.high + 100; }]);
            expect(extents[0]).toEqual(106);
            expect(extents[1]).toEqual(115);
        });

    });

}(d3, fc));
