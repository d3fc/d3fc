(function(d3, fc) {
    'use strict';

    describe('fc.util.dataJoin', function() {

        describe('attrs', function() {

            it('should replace attributes when object is provided', function() {
                var attrs = {key: 'value'};

                var observedAttrs = fc.util.dataJoin()
                    .attrs(attrs)
                    .attrs();

                expect(observedAttrs).toEqual(attrs);
            });

            it('should add attributes when key value is provided', function() {
                var key = 'key';
                var value = 'value';

                var observedAttrs = fc.util.dataJoin()
                    .attrs(key, value)
                    .attrs();

                var expected = {};
                expected[key] = value;
                expect(observedAttrs).toEqual(expected);
            });

            it('should replace attributes when key value is provided', function() {
                var key = 'key';
                var value = 'newValue';

                var observedAttrs = fc.util.dataJoin()
                    .attrs(key, 'originalValue')
                    .attrs(key, value)
                    .attrs();

                var expected = {};
                expected[key] = value;
                expect(observedAttrs).toEqual(expected);
            });

            it('should not alter other attributes than specified when key value is provided', function() {
                var key = 'key';
                var value = 'value';

                var observedAttrs = fc.util.dataJoin()
                    .attrs('anotherAttr', 'anotherValue')
                    .attrs(key, value)
                    .attrs();

                var expected = {};
                expected[key] = value;
                expected.anotherAttr = 'anotherValue';
                expect(observedAttrs).toEqual(expected);
            });

        });

    });

}(d3, fc));
