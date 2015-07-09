(function(d3, fc) {
    'use strict';

    describe('bar', function() {

        it('should invoke data accessors with datum and index', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.util.fn.identity),
                y0ValueSpy = jasmine.createSpy('y0Value').and.callFake(fc.util.fn.identity),
                y1ValueSpy = jasmine.createSpy('y1Value').and.callFake(fc.util.fn.identity);

            var bar = fc.series.bar()
                .xValue(xValueSpy)
                .y0Value(y0ValueSpy)
                .y1Value(y1ValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0.1, 2.2, 4.3, 8.4, 16.5];

            container.datum(data)
                .call(bar);

            expect(xValueSpy.calls.count()).toEqual(data.length * 5);
            this.utils.verifyAccessorCalls(xValueSpy, data);


            expect(y0ValueSpy.calls.count()).toEqual(data.length * 3);
            this.utils.verifyAccessorCalls(y0ValueSpy, data);

            expect(y1ValueSpy.calls.count()).toEqual(data.length * 3);
            this.utils.verifyAccessorCalls(y1ValueSpy, data);
        });
    });


}(d3, fc));
