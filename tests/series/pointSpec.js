(function(d3, fc) {
    'use strict';

    describe('point', function() {

        it('should invoke data accessors with datum and index', function() {

            var xValueSpy = jasmine.createSpy('xValue').and.callFake(fc.util.fn.identity),
                yValueSpy = jasmine.createSpy('yValue').and.callFake(fc.util.fn.identity);

            var point = fc.series.point()
                .xValue(xValueSpy)
                .yValue(yValueSpy);

            var element = document.createElement('svg'),
                container = d3.select(element),
                data = [0.1, 2.5, 4.3, 8.4, 16.4];

            container.datum(data)
                .call(point);

            expect(xValueSpy.calls.count()).toEqual(data.length);
            this.utils.verifyAccessorCalls(xValueSpy, data);

            expect(yValueSpy.calls.count()).toEqual(data.length);
            this.utils.verifyAccessorCalls(yValueSpy, data);
        });
    });

}(d3, fc));
