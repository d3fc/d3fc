(function(d3, fc) {
    'use strict';

    describe('fc.util.dataJoin', function() {

        it('should insert new elements in an order consistent with the data', function() {
            var dataJoin = fc.util.dataJoin();
            var element = document.createElement('svg');
            var container = d3.select(element);
            var data = [1, 2, 3];

            dataJoin(container, data);
            expect(element.childNodes.length).toBe(3);
            expect(element.childNodes[0].__data__).toBe(1);
            expect(element.childNodes[1].__data__).toBe(2);
            expect(element.childNodes[2].__data__).toBe(3);

            data = [1, 4, 2];
            dataJoin(container, data);
            expect(element.childNodes.length).toBe(3);
            expect(element.childNodes[0].__data__).toBe(1);
            expect(element.childNodes[1].__data__).toBe(4);
            expect(element.childNodes[2].__data__).toBe(2);
        });

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
