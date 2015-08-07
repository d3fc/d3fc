(function(d3, fc) {
    'use strict';

    describe('fc.util.dataJoin', function() {

        describe('attr', function() {

            it('should replace attributes when object is provided', function() {
                var attr = {key: 'value'};

                var observedAttrs = fc.util.dataJoin()
                    .attr(attr)
                    .attr();

                expect(observedAttrs).toEqual(attr);
            });

            it('should add attributes when key value is provided', function() {
                var key = 'key';
                var value = 'value';

                var observedAttrs = fc.util.dataJoin()
                    .attr(key, value)
                    .attr();

                var expected = {};
                expected[key] = value;
                expect(observedAttrs).toEqual(expected);
            });

            it('should replace attributes when key value is provided', function() {
                var key = 'key';
                var value = 'newValue';

                var observedAttrs = fc.util.dataJoin()
                    .attr(key, 'originalValue')
                    .attr(key, value)
                    .attr();

                var expected = {};
                expected[key] = value;
                expect(observedAttrs).toEqual(expected);
            });

            it('should not alter other attributes than specified when key value is provided', function() {
                var key = 'key';
                var value = 'value';

                var observedAttrs = fc.util.dataJoin()
                    .attr('anotherAttr', 'anotherValue')
                    .attr(key, value)
                    .attr();

                var expected = {};
                expected[key] = value;
                expected.anotherAttr = 'anotherValue';
                expect(observedAttrs).toEqual(expected);
            });

        });

    });

}(d3, fc));
